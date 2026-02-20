import type { CharacterState } from '../character-state';
import type { Skill } from '../schemas/skills';
import type {
  GardeningTimingConfig,
  GardeningPlannerOptions,
  GardeningPlanResult,
  GardeningHarvestRun,
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
    totalHarvests,
    totalXpGained: state.totalXpGained,
    totalTimeSeconds,
    xpPerHour: Math.round(xpPerHour),
    levelUps: state.currentLevel - state.startLevel,
    seedsUsed: state.seedsUsed,
    fertilizerUsed: state.fertilizerUsed,
    waterUsed: state.waterUsed,
    waterRefills: state.waterRefills,
    produceHarvested: state.produceHarvested,
    ingredientTotals: state.ingredientTotals,
    keywordIngredientTotals: new Map(),
  };
}

// ============================================================
// Group Actions into Harvest Runs
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
