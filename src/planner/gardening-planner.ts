import type { CharacterState } from '../character-state';
import type { Skill } from '../schemas/skills';
import type {
  GardeningTimingConfig,
  GardeningPlannerOptions,
  GardeningPlanResult,
  GardeningHarvestRun,
  GardeningPhase,
  GardeningPhaseCrop,
  GardenAction,
} from './gardening-types';
import {
  initGardeningSimulation,
  stepGardeningSimulation,
  isGardeningSimulationDone,
} from './gardening-simulation';
import { gardeningSeedsByCode } from './gardening-data';

// ============================================================
// Default Timing Config
// ============================================================

/**
 * Default gardening timing values.
 * All delay values default to 0 — measure in-game and update.
 */
export const DEFAULT_GARDENING_TIMING: GardeningTimingConfig = {
  wiggleTimeSeconds: 5,
  waterDelaySeconds: 0,
  fertilizerDelaySeconds: 0,
  waterRefillTimeSeconds: 15,
  waterBottleCount: 5,
  fertilizerBottleCount: 5,
  fertilizerCraftTimeSeconds: 15,
};

// ============================================================
// Plan Gardening Skill
// ============================================================

/**
 * Plan a gardening session to level the Gardening skill.
 *
 * Unlike crafting (sequential, one craft at a time), gardening
 * simulates concurrent plant growth across multiple garden slots
 * with real-time constraints.
 */
export function planGardeningSkill(
  characterState: CharacterState,
  options: GardeningPlannerOptions,
  allSkills: Map<string, Skill>,
  xpTableLookup: Map<string, number[]>,
): GardeningPlanResult {
  const state = initGardeningSimulation(characterState, options, allSkills, xpTableLookup);

  while (!isGardeningSimulationDone(state)) {
    const action = stepGardeningSimulation(state);
    if (!action) break;
    state.actions.push(action);
  }

  return buildGardeningPlanResult(state);
}

// ============================================================
// Build Result
// ============================================================

function buildGardeningPlanResult(
  state: ReturnType<typeof initGardeningSimulation>,
): GardeningPlanResult {
  const harvestActions = state.actions.filter((a) => a.type === 'harvest' && a.xpGained > 0);
  const totalHarvests = harvestActions.length;
  const totalTimeSeconds = state.currentTime;
  const xpPerHour = totalTimeSeconds > 0
    ? (state.totalXpGained / totalTimeSeconds) * 3600
    : 0;

  return {
    skill: 'Gardening',
    startLevel: state.startLevel,
    endLevel: state.currentLevel,
    targetLevel: state.options.targetLevel,
    targetReached: state.currentLevel >= state.options.targetLevel,
    actions: state.actions,
    harvestRuns: groupActionsIntoHarvestRuns(state.actions),
    phases: groupActionsIntoPhases(state.actions),
    totalHarvests,
    totalXpGained: state.totalXpGained,
    totalTimeSeconds,
    xpPerHour: Math.round(xpPerHour),
    levelUps: state.currentLevel - state.startLevel,
    seedsUsed: state.seedsUsed,
    fertilizerUsed: state.fertilizerUsed,
    fertilizerCrafts: state.fertilizerCrafts,
    strangeDirtUsed: state.strangeDirtUsed,
    waterUsed: state.waterUsed,
    waterRefills: state.waterRefills,
    produceHarvested: state.produceHarvested,
    ingredientTotals: state.ingredientTotals,
    keywordIngredientTotals: new Map(),
    ...(state.inventory ? { inventoryRemaining: state.inventory } : {}),
  };
}

// ============================================================
// Group Actions into Harvest Runs (legacy)
// ============================================================

/**
 * Group consecutive harvest actions by seed type for display.
 * Analogous to `groupStepsIntoRuns` for crafting.
 */
export function groupActionsIntoHarvestRuns(actions: GardenAction[]): GardeningHarvestRun[] {
  const runs: GardeningHarvestRun[] = [];
  const harvests = actions.filter((a) => a.type === 'harvest' && a.xpGained > 0);

  for (const action of harvests) {
    const seedCode = action.seedItemCode!;
    const seed = gardeningSeedsByCode.get(seedCode);
    if (!seed) continue;

    const last = runs[runs.length - 1];
    if (last && last.seedItemCode === seedCode) {
      // Extend existing run
      last.count++;
      last.totalXp += action.xpGained;
      last.levelEnd = action.skillLevelAfter;
      last.timeEndSeconds = action.timestamp;
    } else {
      // Start new run
      runs.push({
        seedItemCode: seedCode,
        seedName: seed.seedName,
        resultItemCode: seed.resultItemCode,
        resultName: seed.resultName,
        count: 1,
        totalXp: action.xpGained,
        levelStart: action.skillLevelBefore,
        levelEnd: action.skillLevelAfter,
        timeStartSeconds: action.timestamp,
        timeEndSeconds: action.timestamp,
      });
    }
  }

  return runs;
}

// ============================================================
// Phase-Based Grouping
// ============================================================

/**
 * Group harvests into phases. A new phase starts when a previously-
 * unseen seed type appears (i.e. a new seed was unlocked via level-up).
 * Within each phase, harvests are aggregated by seed type into crops.
 */
export function groupActionsIntoPhases(actions: GardenAction[]): GardeningPhase[] {
  const harvests = actions.filter((a) => a.type === 'harvest' && a.xpGained > 0);
  if (harvests.length === 0) return [];

  const phases: GardeningPhase[] = [];
  const allSeenSeedCodes = new Set<number>();
  let currentHarvests: GardenAction[] = [];
  let currentNewSeeds: string[] = [];

  function finalizePhase(): void {
    if (currentHarvests.length === 0) return;

    // Aggregate by seed type within this phase
    const cropMap = new Map<number, GardeningPhaseCrop>();
    for (const h of currentHarvests) {
      const code = h.seedItemCode!;
      const seed = gardeningSeedsByCode.get(code);
      if (!seed) continue;

      const existing = cropMap.get(code);
      if (existing) {
        existing.count++;
        existing.totalXp += h.xpGained;
      } else {
        cropMap.set(code, {
          seedItemCode: code,
          seedName: seed.seedName,
          resultItemCode: seed.resultItemCode,
          resultName: seed.resultName,
          count: 1,
          totalXp: h.xpGained,
          xpEach: h.xpGained,
          growTimeSeconds: seed.growTimeSeconds,
        });
      }
    }

    // Finalize xpEach as average
    const crops: GardeningPhaseCrop[] = [];
    for (const crop of cropMap.values()) {
      crop.xpEach = crop.count > 0 ? Math.round(crop.totalXp / crop.count) : 0;
      crops.push(crop);
    }
    // Sort crops: most harvests first
    crops.sort((a, b) => b.count - a.count);

    const first = currentHarvests[0];
    const last = currentHarvests[currentHarvests.length - 1];

    phases.push({
      phaseIndex: phases.length,
      levelStart: first.skillLevelBefore,
      levelEnd: last.skillLevelAfter,
      timeStartSeconds: first.timestamp,
      timeEndSeconds: last.timestamp,
      totalHarvests: currentHarvests.length,
      totalXp: currentHarvests.reduce((sum, h) => sum + h.xpGained, 0),
      crops,
      newSeeds: [...currentNewSeeds],
    });

    currentHarvests = [];
    currentNewSeeds = [];
  }

  for (const harvest of harvests) {
    const seedCode = harvest.seedItemCode!;
    const seed = gardeningSeedsByCode.get(seedCode);

    if (!allSeenSeedCodes.has(seedCode)) {
      // New seed type! If we have accumulated harvests, finalize as a phase
      if (currentHarvests.length > 0) {
        finalizePhase();
      }
      allSeenSeedCodes.add(seedCode);
      currentNewSeeds.push(seed?.seedName ?? `Seed #${seedCode}`);
    }

    currentHarvests.push(harvest);
  }

  // Finalize last phase
  finalizePhase();

  return phases;
}
