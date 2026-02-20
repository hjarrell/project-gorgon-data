import type { Recipe } from '../schemas/recipes';
import type { Skill } from '../schemas/skills';
import { CharacterState } from '../character-state';
import type { ItemEffortMap } from './xp';
import type { RecipeScorer } from './scorers';
import { initSimulation, stepSimulation, isSimulationDone, buildPlanResult, applyCraft, canCraftRecipe } from './simulation';
import type { RecipeCandidate } from './simulation';
import { calcRecipeXp } from './xp';

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
  /** The skill this craft belongs to. Undefined = the plan's primary skill. */
  skill?: string;
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

// ============================================================
// Quantity-Targeted Crafting Planner
// ============================================================

export interface QuantityPlanResult {
  /** The skill used */
  skill: string;
  /** The recipe crafted */
  recipeId: string;
  recipeName: string;
  /** How many crafts were performed */
  totalCrafts: number;
  /** Total items produced */
  totalProduced: number;
  /** Whether the target quantity was met */
  targetMet: boolean;
  /** Ordered list of CraftSteps (with `skill` set) */
  steps: CraftStep[];
  /** Ingredient totals consumed by this sub-plan */
  ingredientTotals: Map<number, IngredientUsage>;
  /** Keyword ingredient totals consumed by this sub-plan */
  keywordIngredientTotals: Map<string, IngredientUsage>;
  /** Total XP gained (may level up the sub-skill) */
  totalXpGained: number;
  /** Skill level at start */
  startLevel: number;
  /** Skill level at end */
  endLevel: number;
}

/**
 * Plan crafting a specific recipe to produce a target quantity of its output item.
 * Used for sub-crafting ingredients needed by another plan.
 *
 * @param characterState - The character's current state
 * @param recipeId       - The recipe key (e.g. "recipe_1234")
 * @param targetItemCode - The ItemCode of the desired output item
 * @param targetQuantity - How many of the output item are needed
 * @param allRecipes     - All game recipes
 * @param allSkills      - All game skills
 * @param xpTableLookup  - XP table lookup
 * @param options        - Optional maxCrafts safety cap
 */
export function planCraftQuantity(
  characterState: CharacterState,
  recipeId: string,
  targetItemCode: number,
  targetQuantity: number,
  allRecipes: Map<string, Recipe>,
  allSkills: Map<string, Skill>,
  xpTableLookup: Map<string, number[]>,
  options?: { maxCrafts?: number },
): QuantityPlanResult {
  const recipe = allRecipes.get(recipeId);
  if (!recipe) {
    throw new Error(`Unknown recipe: "${recipeId}"`);
  }

  // Find the output entry for the target item
  const outputEntry = recipe.ResultItems.find((r) => r.ItemCode === targetItemCode);
  if (!outputEntry) {
    throw new Error(
      `Recipe "${recipe.Name}" does not produce item ${targetItemCode}`,
    );
  }

  const outputPerCraft = outputEntry.StackSize;
  const craftsNeeded = Math.ceil(targetQuantity / outputPerCraft);
  const maxCrafts = Math.min(craftsNeeded, options?.maxCrafts ?? 10000);

  const rewardSkill = recipe.RewardSkill;

  // Ensure the character has a skill entry for the recipe's reward skill.
  // If not, create a shallow copy with the skill added at level 0.
  let cs = characterState;
  if (!characterState.skills.has(rewardSkill)) {
    cs = new CharacterState();
    cs.skills = new Map(characterState.skills);
    cs.recipeCompletions = new Map(characterState.recipeCompletions);
    cs.currentStats = new Map(characterState.currentStats);
    cs.skills.set(rewardSkill, {
      Level: 0,
      BonusLevels: 0,
      XpTowardNextLevel: 0,
      XpNeededForNextLevel: 0,
    });
  }

  // Initialize simulation for the recipe's skill with a very high target level
  // (we stop based on maxCrafts, not level)
  const simState = initSimulation(
    cs,
    rewardSkill,
    {
      targetLevel: 999,
      maxCrafts,
      includeRecipes: new Set([recipe.InternalName]),
    },
    allRecipes,
    allSkills,
    xpTableLookup,
  );

  // Find our specific recipe candidate
  const candidate: RecipeCandidate | undefined = simState.candidates.find(
    (c) => c.recipeId === recipeId,
  );
  if (!candidate) {
    throw new Error(
      `Recipe "${recipe.Name}" is not a valid candidate for skill "${rewardSkill}"`,
    );
  }

  // Craft the recipe the exact number of times needed
  const startLevel = simState.currentLevel;
  let crafted = 0;
  for (let i = 0; i < maxCrafts; i++) {
    if (!canCraftRecipe(candidate.recipe, simState)) break;

    const count = simState.completions.get(candidate.recipe.InternalName) ?? 0;
    const xp = calcRecipeXp(
      candidate.recipe,
      simState.currentLevel,
      count,
      simState.craftingXpMod,
    );
    if (xp <= 0) break;

    applyCraft(simState, candidate, xp);
    crafted++;
  }

  // Tag all steps with the skill
  for (const step of simState.steps) {
    step.skill = rewardSkill;
  }

  return {
    skill: rewardSkill,
    recipeId,
    recipeName: recipe.Name,
    totalCrafts: crafted,
    totalProduced: crafted * outputPerCraft,
    targetMet: crafted * outputPerCraft >= targetQuantity,
    steps: simState.steps,
    ingredientTotals: simState.ingredientTotals,
    keywordIngredientTotals: simState.keywordIngredientTotals,
    totalXpGained: simState.totalXpGained,
    startLevel,
    endLevel: simState.currentLevel,
  };
}
