import type { IngredientUsage } from './crafting-planner';

// ============================================================
// Gardening Seed Data (from wikidata/gardening.json)
// ============================================================

export type SeedCategory = 'vegetable' | 'flower' | 'cotton' | 'grass' | 'unique';

export interface GardeningSeedEntry {
  seedItemCode: number;
  seedName: string;
  seedValue: number;
  gardeningLevel: number;
  gardeningXp: number | null;
  growTimeSeconds: number | null;
  growTimeDisplay: string | null;
  location: string;
  /** 0 = no fertilizer, 1 = 1 water + 1 fertilizer, 2 = 2 water + 2 fertilizer */
  fertilizer: number;
  resultItemCode: number;
  resultName: string;
  resultValue: number | null;
  resultYield: number;
  notes?: string;
  /** Internal category tag set during loading */
  _category: SeedCategory;
}

// ============================================================
// Slot Configuration
// ============================================================

export interface SlotGroup {
  /** Human-readable group name, e.g. "potato", "flower", "cotton" */
  name: string;
  /** Which category this slot group belongs to */
  category: SeedCategory;
  /** Max concurrent plants in this group */
  maxSlots: number;
  /** Seed item codes that can use this group's slots */
  seedItemCodes: number[];
}

// ============================================================
// Timing Configuration
// ============================================================

export interface GardeningTimingConfig {
  /** Seconds between player actions (reaction/movement time). Default 5. */
  wiggleTimeSeconds: number;
  /** Seconds after planting before the plant needs water. Default 0 (measure in-game). */
  waterDelaySeconds: number;
  /** Seconds after watering before the plant needs fertilizer. Default 0 (measure in-game). */
  fertilizerDelaySeconds: number;
  /** Seconds to travel and refill all water bottles. Default 15. */
  waterRefillTimeSeconds: number;
  /** Number of water bottles the player has. Default 5. */
  waterBottleCount: number;
}

// ============================================================
// Planner Options
// ============================================================

export interface GardeningPlannerOptions {
  /** Desired gardening level to reach */
  targetLevel: number;
  /** Timing configuration */
  timing: GardeningTimingConfig;
  /** Seed item codes to include. Empty = auto-select best available. */
  includedSeeds?: Set<number>;
  /** Seed item codes to exclude from planning. */
  excludedSeeds?: Set<number>;
  /** Strategy: 'xp' = best XP/second rate, 'time' = minimize total time */
  strategy: 'xp' | 'time';
  /** Safety cap on total simulated actions. Default 100000. */
  maxActions?: number;
  /** Safety cap on simulated time in seconds. Default 172800 (48h). */
  maxSimulatedTime?: number;
}

// ============================================================
// Simulation Actions & Results
// ============================================================

export type GardenActionType = 'plant' | 'water' | 'fertilize' | 'harvest' | 'refill';

export interface GardenAction {
  /** Simulated time (seconds from start) when this action occurs */
  timestamp: number;
  /** Type of action */
  type: GardenActionType;
  /** Which slot this targets (null for 'refill') */
  slotId: string | null;
  /** The seed being operated on (null for 'refill') */
  seedItemCode: number | null;
  /** XP gained (only nonzero for 'harvest') */
  xpGained: number;
  /** Skill level before this action */
  skillLevelBefore: number;
  /** Skill level after this action */
  skillLevelAfter: number;
}

export interface GardeningHarvestRun {
  seedItemCode: number;
  seedName: string;
  resultItemCode: number;
  resultName: string;
  /** Number of harvests in this run */
  count: number;
  /** Total XP from all harvests in this run */
  totalXp: number;
  /** Skill level at first harvest */
  levelStart: number;
  /** Skill level at last harvest */
  levelEnd: number;
  /** Timestamp of first harvest in this run */
  timeStartSeconds: number;
  /** Timestamp of last harvest in this run */
  timeEndSeconds: number;
}

// ============================================================
// Phase-Based Grouping (for table display)
// ============================================================

export interface GardeningPhaseCrop {
  seedItemCode: number;
  seedName: string;
  resultItemCode: number;
  resultName: string;
  /** Number of harvests of this crop in the phase */
  count: number;
  /** Total XP from this crop in the phase */
  totalXp: number;
  /** XP per harvest */
  xpEach: number;
  /** Grow time in seconds (from seed data) */
  growTimeSeconds: number | null;
}

/**
 * A phase is a period where the same set of seed types is active.
 * A new phase starts when a level-up unlocks a new seed type.
 */
export interface GardeningPhase {
  phaseIndex: number;
  levelStart: number;
  levelEnd: number;
  timeStartSeconds: number;
  timeEndSeconds: number;
  totalHarvests: number;
  totalXp: number;
  crops: GardeningPhaseCrop[];
  /** Seed names newly introduced in this phase */
  newSeeds: string[];
}

export interface GardeningPlanResult {
  skill: 'Gardening';
  startLevel: number;
  endLevel: number;
  targetLevel: number;
  targetReached: boolean;

  /** Ordered timeline of all actions */
  actions: GardenAction[];
  /** Grouped harvest runs for display (legacy, see phases for better grouping) */
  harvestRuns: GardeningHarvestRun[];
  /** Phase-based grouping: each phase has a stable set of active seeds */
  phases: GardeningPhase[];

  /** Total harvests performed */
  totalHarvests: number;
  /** Total XP gained from harvesting */
  totalXpGained: number;
  /** Total simulated wall-clock time in seconds */
  totalTimeSeconds: number;
  /** XP per hour rate */
  xpPerHour: number;
  /** Number of level-ups achieved */
  levelUps: number;

  /** Seeds consumed: seedItemCode -> count */
  seedsUsed: Map<number, number>;
  /** Total fertilizer applications */
  fertilizerUsed: number;
  /** Total water applications */
  waterUsed: number;
  /** Water refills performed */
  waterRefills: number;
  /** Produce harvested: resultItemCode -> count */
  produceHarvested: Map<number, number>;

  /**
   * Ingredient totals compatible with existing IngredientsTable.
   * Includes seeds, water (as Water item), and fertilizer (as Basic Fertilizer item).
   */
  ingredientTotals: Map<number, IngredientUsage>;
  /** Keyword-based ingredient totals (empty for gardening, kept for UI compat) */
  keywordIngredientTotals: Map<string, IngredientUsage>;
}
