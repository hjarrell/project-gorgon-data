import type { IngredientUsage } from './crafting-planner';
import type { GardeningPlanResult } from './gardening-types';

// ============================================================
// Nature Appreciation Flower Data (from wikidata/nature_appreciation.json)
// ============================================================

export interface NatureAppreciationFlowerEntry {
  flowerItemCode: number;
  flowerName: string;
  natureAppreciationLevel: number;
  xp: number | null;
  buff: string | null;
  seedLocation: string;
  gardeningLevel: number | null;
  seedItemCode: number | null;
  growable: boolean;
  notes?: string;
}

// ============================================================
// Planner Options
// ============================================================

export interface NatureAppreciationPlannerOptions {
  /** Desired Nature Appreciation level to reach */
  targetLevel: number;
  /** Flower item codes to exclude from planning */
  excludedFlowers?: Set<number>;
  /** Enable gardening cross-reference: calculate what seeds/resources needed to grow flowers */
  growFlowers: boolean;
  /** Current gardening level (used for grow mode to determine which flowers can be grown) */
  gardeningLevel?: number;
  /** Safety cap on total flower uses. Default 100000. */
  maxUses?: number;
  /**
   * Available inventory of items. Map of ItemCode → quantity.
   * When provided, the planner only uses flowers available in inventory
   * and deducts them after each use.
   */
  inventory?: Map<number, number>;
}

// ============================================================
// Plan Steps & Grouping
// ============================================================

/** A single flower use (appreciation) */
export interface FlowerUseStep {
  flowerItemCode: number;
  flowerName: string;
  xpGained: number;
  skillLevelBefore: number;
  skillLevelAfter: number;
}

/** Grouped consecutive uses of the same flower */
export interface FlowerUseRun {
  flowerItemCode: number;
  flowerName: string;
  count: number;
  totalXp: number;
  xpEach: number;
  levelStart: number;
  levelEnd: number;
}

// ============================================================
// Phase-Based Grouping (for table display)
// ============================================================

export interface NatureAppreciationPhaseCrop {
  flowerItemCode: number;
  flowerName: string;
  /** Number of uses of this flower in the phase */
  count: number;
  /** Total XP from this flower in the phase */
  totalXp: number;
  /** XP per use */
  xpEach: number;
}

/**
 * A phase is a period where the same set of flowers is active.
 * A new phase starts when a level-up unlocks a new flower type.
 */
export interface NatureAppreciationPhase {
  phaseIndex: number;
  levelStart: number;
  levelEnd: number;
  totalUses: number;
  totalXp: number;
  flowers: NatureAppreciationPhaseCrop[];
  /** Flower names newly introduced in this phase */
  newFlowers: string[];
}

// ============================================================
// Gardening Cross-Reference
// ============================================================

/** Gardening requirement for growing a flower used in the plan */
export interface FlowerGardeningInfo {
  flowerItemCode: number;
  flowerName: string;
  seedItemCode: number;
  seedName: string;
  gardeningLevel: number;
  growTimeSeconds: number | null;
  fertilizerNeeded: number;
  /** How many of this flower the NA plan needs */
  countNeeded: number;
}

// ============================================================
// Plan Result
// ============================================================

export interface NatureAppreciationPlanResult {
  skill: 'NatureAppreciation';
  startLevel: number;
  endLevel: number;
  targetLevel: number;
  targetReached: boolean;

  /** Ordered steps (one per flower use) */
  steps: FlowerUseStep[];
  /** Grouped consecutive uses for compact display */
  runs: FlowerUseRun[];
  /** Phase-based grouping: each phase has a stable set of active flowers */
  phases: NatureAppreciationPhase[];

  /** Total flower uses */
  totalUses: number;
  /** Total XP gained */
  totalXpGained: number;
  /** Number of level-ups achieved */
  levelUps: number;

  /** Flowers consumed: flowerItemCode -> count */
  flowersUsed: Map<number, number>;

  /**
   * Ingredient totals compatible with existing IngredientsTable.
   * Maps flower item codes to usage counts.
   */
  ingredientTotals: Map<number, IngredientUsage>;
  /** Keyword-based ingredient totals (empty for NA, kept for UI compat) */
  keywordIngredientTotals: Map<string, IngredientUsage>;

  /** Gardening cross-reference info per flower (populated when growFlowers=true) */
  gardeningInfo: FlowerGardeningInfo[];
  /** Full gardening plan result (when growFlowers=true, runs actual gardening planner) */
  gardeningPlan: GardeningPlanResult | null;
  /** Remaining inventory after all flower uses. Only present when inventory was provided. */
  inventoryRemaining?: Map<number, number>;
}
