import { CharacterState } from '../character-state';
import type { Skill } from '../schemas/skills';
import type { IngredientUsage } from './crafting-planner';
import type {
  NatureAppreciationFlowerEntry,
  NatureAppreciationPlannerOptions,
  NatureAppreciationPlanResult,
  FlowerUseStep,
  FlowerUseRun,
  NatureAppreciationPhase,
  NatureAppreciationPhaseCrop,
  FlowerGardeningInfo,
} from './nature-appreciation-types';
import type { GardeningPlanResult } from './gardening-types';
import { getXpRequiredForLevel } from './xp';
import { getAvailableFlowers, natureAppreciationFlowersByCode } from './nature-appreciation-data';
import { gardeningSeedsByCode } from './gardening-data';
import { planGardeningSkill, DEFAULT_GARDENING_TIMING } from './gardening-planner';

// ============================================================
// Plan Nature Appreciation
// ============================================================

/**
 * Plan a Nature Appreciation leveling session.
 *
 * Unlike crafting or gardening, NA is simple sequential flower uses:
 * pick the highest-XP flower available at current level, use it, gain XP, repeat.
 */
export function planNatureAppreciation(
  characterState: CharacterState,
  options: NatureAppreciationPlannerOptions,
  allSkills: Map<string, Skill>,
  xpTableLookup: Map<string, number[]>,
): NatureAppreciationPlanResult {
  const skill = allSkills.get('NatureAppreciation');
  if (!skill) throw new Error('NatureAppreciation skill not found in skill data');

  const xpTableName = skill.XpTable;
  const charSkill = characterState.skills.get('NatureAppreciation');
  const startLevel = charSkill?.Level ?? 0;

  let currentLevel = startLevel;
  let currentXp = charSkill?.XpTowardNextLevel ?? 0;
  let xpNeeded = getXpRequiredForLevel(xpTableName, currentLevel, xpTableLookup);
  let totalXpGained = 0;

  const maxUses = options.maxUses ?? 100000;
  const steps: FlowerUseStep[] = [];
  const flowersUsed = new Map<number, number>();

  // Clone inventory if provided (mutated during simulation)
  const inventory = options.inventory ? new Map(options.inventory) : null;

  // Cache available flowers (refreshed on level-up)
  let availableFlowers = getAvailableFlowers(currentLevel, options.excludedFlowers);

  while (currentLevel < options.targetLevel && steps.length < maxUses) {
    // Pick best flower, respecting inventory constraints if active
    const flower = inventory
      ? pickBestFlowerWithInventory(availableFlowers, inventory)
      : pickBestFlower(availableFlowers);
    if (!flower) break; // No flowers available (or inventory depleted)

    const xp = flower.xp!;
    const levelBefore = currentLevel;

    // Apply XP
    currentXp += xp;
    totalXpGained += xp;

    // Handle cascading level-ups
    while (xpNeeded > 0 && currentXp >= xpNeeded) {
      currentXp -= xpNeeded;
      currentLevel++;
      xpNeeded = getXpRequiredForLevel(xpTableName, currentLevel, xpTableLookup);
    }

    steps.push({
      flowerItemCode: flower.flowerItemCode,
      flowerName: flower.flowerName,
      xpGained: xp,
      skillLevelBefore: levelBefore,
      skillLevelAfter: currentLevel,
    });

    // Track flower usage
    flowersUsed.set(
      flower.flowerItemCode,
      (flowersUsed.get(flower.flowerItemCode) ?? 0) + 1,
    );

    // Deduct from inventory
    if (inventory) {
      const cur = inventory.get(flower.flowerItemCode) ?? 0;
      inventory.set(flower.flowerItemCode, cur - 1);
    }

    // If we leveled up, refresh available flowers
    if (currentLevel > levelBefore) {
      availableFlowers = getAvailableFlowers(currentLevel, options.excludedFlowers);
    }
  }

  // Build ingredient totals for IngredientsTable compatibility
  const ingredientTotals = new Map<number, IngredientUsage>();
  for (const [itemCode, count] of flowersUsed) {
    const flower = natureAppreciationFlowersByCode.get(itemCode);
    ingredientTotals.set(itemCode, {
      totalCount: count,
      timesUsed: count,
      chanceToConsume: 1.0,
      recipeCount: 1,
      usedByRecipes: new Set([`Appreciate: ${flower?.flowerName ?? `Flower #${itemCode}`}`]),
    });
  }

  // Build gardening cross-reference if requested
  let gardeningInfo: FlowerGardeningInfo[] = [];
  let gardeningPlan: GardeningPlanResult | null = null;

  if (options.growFlowers) {
    gardeningInfo = buildGardeningInfo(flowersUsed);
    gardeningPlan = buildGardeningPlan(
      characterState,
      flowersUsed,
      options.gardeningLevel ?? 0,
      allSkills,
      xpTableLookup,
    );
  }

  return {
    skill: 'NatureAppreciation',
    startLevel,
    endLevel: currentLevel,
    targetLevel: options.targetLevel,
    targetReached: currentLevel >= options.targetLevel,
    steps,
    runs: groupFlowerUsesIntoRuns(steps),
    phases: groupFlowerUsesIntoPhases(steps),
    totalUses: steps.length,
    totalXpGained,
    levelUps: currentLevel - startLevel,
    flowersUsed,
    ingredientTotals,
    keywordIngredientTotals: new Map(),
    gardeningInfo,
    gardeningPlan,
    ...(inventory ? { inventoryRemaining: inventory } : {}),
  };
}

// ============================================================
// Flower Selection
// ============================================================

function pickBestFlower(
  flowers: NatureAppreciationFlowerEntry[],
): NatureAppreciationFlowerEntry | null {
  if (flowers.length === 0) return null;
  let best = flowers[0];
  for (let i = 1; i < flowers.length; i++) {
    if ((flowers[i].xp ?? 0) > (best.xp ?? 0)) {
      best = flowers[i];
    }
  }
  return best;
}

/**
 * Like pickBestFlower but also checks that the flower has remaining inventory.
 * Falls through to next-best flower if preferred one is depleted.
 */
function pickBestFlowerWithInventory(
  flowers: NatureAppreciationFlowerEntry[],
  inventory: Map<number, number>,
): NatureAppreciationFlowerEntry | null {
  let best: NatureAppreciationFlowerEntry | null = null;
  for (const flower of flowers) {
    if ((flower.xp ?? 0) <= 0) continue;
    const available = inventory.get(flower.flowerItemCode) ?? 0;
    if (available <= 0) continue;
    if (!best || (flower.xp ?? 0) > (best.xp ?? 0)) {
      best = flower;
    }
  }
  return best;
}

// ============================================================
// Group Steps into Runs
// ============================================================

/**
 * Group consecutive flower uses by flower type for compact display.
 */
export function groupFlowerUsesIntoRuns(steps: FlowerUseStep[]): FlowerUseRun[] {
  const runs: FlowerUseRun[] = [];

  for (const step of steps) {
    const last = runs[runs.length - 1];
    if (last && last.flowerItemCode === step.flowerItemCode) {
      last.count++;
      last.totalXp += step.xpGained;
      last.levelEnd = step.skillLevelAfter;
    } else {
      runs.push({
        flowerItemCode: step.flowerItemCode,
        flowerName: step.flowerName,
        count: 1,
        totalXp: step.xpGained,
        xpEach: step.xpGained,
        levelStart: step.skillLevelBefore,
        levelEnd: step.skillLevelAfter,
      });
    }
  }

  // Finalize xpEach as average
  for (const run of runs) {
    run.xpEach = run.count > 0 ? Math.round(run.totalXp / run.count) : 0;
  }

  return runs;
}

// ============================================================
// Phase-Based Grouping
// ============================================================

/**
 * Group flower uses into phases. A new phase starts when a previously-
 * unseen flower type appears (i.e. a new flower was unlocked via level-up).
 * Within each phase, uses are aggregated by flower type.
 */
export function groupFlowerUsesIntoPhases(steps: FlowerUseStep[]): NatureAppreciationPhase[] {
  if (steps.length === 0) return [];

  const phases: NatureAppreciationPhase[] = [];
  const allSeenFlowerCodes = new Set<number>();
  let currentSteps: FlowerUseStep[] = [];
  let currentNewFlowers: string[] = [];

  function finalizePhase(): void {
    if (currentSteps.length === 0) return;

    const cropMap = new Map<number, NatureAppreciationPhaseCrop>();
    for (const s of currentSteps) {
      const existing = cropMap.get(s.flowerItemCode);
      if (existing) {
        existing.count++;
        existing.totalXp += s.xpGained;
      } else {
        cropMap.set(s.flowerItemCode, {
          flowerItemCode: s.flowerItemCode,
          flowerName: s.flowerName,
          count: 1,
          totalXp: s.xpGained,
          xpEach: s.xpGained,
        });
      }
    }

    const flowers: NatureAppreciationPhaseCrop[] = [];
    for (const crop of cropMap.values()) {
      crop.xpEach = crop.count > 0 ? Math.round(crop.totalXp / crop.count) : 0;
      flowers.push(crop);
    }
    flowers.sort((a, b) => b.count - a.count);

    const first = currentSteps[0];
    const last = currentSteps[currentSteps.length - 1];

    phases.push({
      phaseIndex: phases.length,
      levelStart: first.skillLevelBefore,
      levelEnd: last.skillLevelAfter,
      totalUses: currentSteps.length,
      totalXp: currentSteps.reduce((sum, s) => sum + s.xpGained, 0),
      flowers,
      newFlowers: [...currentNewFlowers],
    });

    currentSteps = [];
    currentNewFlowers = [];
  }

  for (const step of steps) {
    if (!allSeenFlowerCodes.has(step.flowerItemCode)) {
      if (currentSteps.length > 0) {
        finalizePhase();
      }
      allSeenFlowerCodes.add(step.flowerItemCode);
      currentNewFlowers.push(step.flowerName);
    }
    currentSteps.push(step);
  }

  finalizePhase();

  return phases;
}

// ============================================================
// Gardening Cross-Reference
// ============================================================

function buildGardeningInfo(flowersUsed: Map<number, number>): FlowerGardeningInfo[] {
  const info: FlowerGardeningInfo[] = [];

  for (const [flowerItemCode, count] of flowersUsed) {
    const flower = natureAppreciationFlowersByCode.get(flowerItemCode);
    if (!flower || !flower.growable || flower.seedItemCode == null) continue;

    const seed = gardeningSeedsByCode.get(flower.seedItemCode);
    if (!seed) continue;

    info.push({
      flowerItemCode,
      flowerName: flower.flowerName,
      seedItemCode: flower.seedItemCode,
      seedName: seed.seedName,
      gardeningLevel: seed.gardeningLevel,
      growTimeSeconds: seed.growTimeSeconds,
      fertilizerNeeded: seed.fertilizer,
      countNeeded: count,
    });
  }

  info.sort((a, b) => a.gardeningLevel - b.gardeningLevel);
  return info;
}

/**
 * Build a full gardening plan for growing only the flower seeds needed.
 * Determines the highest gardening level needed and runs planGardeningSkill
 * with only flower seeds included.
 */
function buildGardeningPlan(
  characterState: CharacterState,
  flowersUsed: Map<number, number>,
  gardeningLevel: number,
  allSkills: Map<string, Skill>,
  xpTableLookup: Map<string, number[]>,
): GardeningPlanResult | null {
  // Collect all flower seed codes that need to be grown
  const flowerSeedCodes = new Set<number>();
  let maxGardeningLevelNeeded = 0;

  for (const [flowerItemCode] of flowersUsed) {
    const flower = natureAppreciationFlowersByCode.get(flowerItemCode);
    if (!flower || !flower.growable || flower.seedItemCode == null) continue;
    flowerSeedCodes.add(flower.seedItemCode);
    if (flower.gardeningLevel != null && flower.gardeningLevel > maxGardeningLevelNeeded) {
      maxGardeningLevelNeeded = flower.gardeningLevel;
    }
  }

  if (flowerSeedCodes.size === 0) return null;

  // Build a character state with the gardening level
  const cs = new CharacterState();
  if (characterState.skills.size > 0) {
    cs.skills = new Map(characterState.skills);
    cs.recipeCompletions = new Map(characterState.recipeCompletions);
    cs.currentStats = new Map(characterState.currentStats);
  }
  // Override gardening level with provided value
  cs.skills.set('Gardening', {
    Level: gardeningLevel,
    BonusLevels: 0,
    XpTowardNextLevel: 0,
    XpNeededForNextLevel: 0,
  });

  // Target: at least the max gardening level needed to grow all flowers,
  // but at minimum 1 above current to make the planner run
  const targetLevel = Math.max(maxGardeningLevelNeeded + 1, gardeningLevel + 1);

  try {
    return planGardeningSkill(
      cs,
      {
        targetLevel,
        timing: DEFAULT_GARDENING_TIMING,
        strategy: 'xp',
        includedSeeds: flowerSeedCodes,
      },
      allSkills,
      xpTableLookup,
    );
  } catch {
    // If gardening planner fails (e.g. already at target), return null
    return null;
  }
}
