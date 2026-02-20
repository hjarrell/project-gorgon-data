import type { Recipe } from '../schemas/recipes';
import type { Skill } from '../schemas/skills';
import type { CharacterState } from '../character-state';
import type { ItemEffortMap } from './xp';
import type { RecipeScorer } from './scorers';
import { initSimulation, stepSimulation, isSimulationDone, buildPlanResult } from './simulation';

// ============================================================
// Types
// ============================================================

export interface CraftStep {
  /** Recipe key, e.g. "recipe_1" */
  recipeId: string;
  /** Human-readable name, e.g. "Butter" */
  recipeName: string;
  /** Internal name used in RecipeCompletions, e.g. "Butter" */
  internalName: string;
  /** Effective XP gained from this craft */
  xpGained: number;
  /** Effort cost of this craft (ingredient-weighted) */
  effortCost: number;
  /** Whether this was the first time crafting this recipe */
  isFirstCraft: boolean;
  /** Skill level before this craft */
  skillLevelBefore: number;
  /** Skill level after this craft (may be higher if leveled up) */
  skillLevelAfter: number;
}

export interface IngredientUsage {
  /** Total stack quantity across all crafts (e.g. StackSize=2 used 50 times = 100) */
  totalCount: number;
  /** Number of individual craft operations that used this ingredient */
  timesUsed: number;
  /** ChanceToConsume value (1.0 = always consumed, < 1.0 = tool/partial) */
  chanceToConsume: number;
  /** Number of distinct recipes in the plan that use this ingredient */
  recipeCount: number;
  /** InternalNames of recipes that use this ingredient */
  usedByRecipes: Set<string>;
}

export interface PlanResult {
  /** The skill being leveled */
  skill: string;
  /** Level at start of plan */
  startLevel: number;
  /** Level reached at end of plan */
  endLevel: number;
  /** Requested target level */
  targetLevel: number;
  /** Whether the target level was reached */
  targetReached: boolean;
  /** Ordered list of crafts to perform */
  steps: CraftStep[];
  /** Total number of crafts */
  totalCrafts: number;
  /** Total XP gained across all crafts */
  totalXpGained: number;
  /** Total effort cost across all crafts */
  totalEffort: number;
  /** Number of level-ups achieved */
  levelUps: number;
  /** Ingredients consumed across all crafts. Map of ItemCode → usage details. */
  ingredientTotals: Map<number, IngredientUsage>;
  /** Keyword-based ingredients consumed. Map of keyword string → usage details. */
  keywordIngredientTotals: Map<string, IngredientUsage>;
  /** Remaining inventory after all crafts. Only present when inventory was provided. */
  inventoryRemaining?: Map<number, number>;
}

export interface PlannerOptions {
  /** Desired skill level to reach */
  targetLevel: number;
  /** Safety cap on number of crafts (default 10000) */
  maxCrafts?: number;
  /**
   * Scoring strategy.
   * - "xp": pick the recipe with the highest effective XP per craft (default).
   * - "efficient": pick the recipe with the highest XP per effort.
   */
  strategy?: 'xp' | 'efficient';
  /** Per-item effort overrides keyed by ItemCode. Only used with "efficient" strategy. */
  itemEffort?: ItemEffortMap;
  /**
   * Additional recipe InternalNames to treat as known (completion count 0).
   * Useful for recipes the character could learn but hasn't yet.
   * These get first-time bonus XP when crafted.
   */
  includeRecipes?: Set<string>;
  /**
   * Recipe InternalNames to exclude from consideration.
   * These recipes will never be picked by the planner.
   */
  excludeRecipes?: Set<string>;
  /**
   * When true, crafting a recipe automatically unlocks any recipe
   * that lists it as a PrereqRecipe, adding it to the candidate pool
   * mid-simulation. Default false.
   */
  unlockPrereqs?: boolean;
  /**
   * Current inventory of items. Map of ItemCode → quantity available.
   * When provided, the planner only picks recipes whose consumable ingredients
   * are available in inventory, and deducts consumed items after each craft.
   * Recipe ResultItems are added back to inventory (enables crafting chains).
   * Items with ChanceToConsume < 1.0 (tools) must be present but are not deducted.
   */
  inventory?: Map<number, number>;
  /**
   * Custom scoring function. If provided, overrides `strategy`.
   * Receives the recipe, its computed XP, and its effort cost.
   * Return a number — higher score = better candidate.
   */
  scorer?: RecipeScorer;
}

// ============================================================
// Greedy Crafting Planner
// ============================================================

/**
 * Plan a greedy sequence of crafts to level a single skill as fast as possible.
 *
 * The planner picks the recipe yielding the highest score at each step,
 * simulating level-ups and first-time bonuses as they are consumed.
 *
 * For step-by-step control, use `initSimulation` + `stepSimulation` directly.
 *
 * @param characterState - The character's current state (skills, recipe completions, stats)
 * @param targetSkill    - The skill to level (must match recipe RewardSkill values)
 * @param options        - Target level, scoring strategy, and optional constraints
 * @param allRecipes     - All game recipes (from data/index.ts)
 * @param allSkills      - All game skills (from data/index.ts)
 * @param xpTableLookup  - Map of XP table InternalName → XpAmounts (from buildXpTableLookup)
 */
export function planCraftingSkill(
  characterState: CharacterState,
  targetSkill: string,
  options: PlannerOptions,
  allRecipes: Map<string, Recipe>,
  allSkills: Map<string, Skill>,
  xpTableLookup: Map<string, number[]>,
): PlanResult {
  const state = initSimulation(characterState, targetSkill, options, allRecipes, allSkills, xpTableLookup);
  while (!isSimulationDone(state)) {
    if (!stepSimulation(state)) break;
  }
  return buildPlanResult(state);
}
