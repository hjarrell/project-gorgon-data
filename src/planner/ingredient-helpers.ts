import type { Recipe } from '../schemas/recipes';
import type { CraftStep, IngredientUsage } from './crafting-planner';

// ============================================================
// Types
// ============================================================

export interface RecipeSource {
  recipeId: string;
  recipe: Recipe;
  /** How many of the item this recipe produces per craft */
  outputStackSize: number;
  /** Percent chance to produce this item (undefined = 100%) */
  percentChance?: number;
}

export interface IngredientNode {
  /** ItemCode, or null for keyword-based ingredients */
  itemCode: number | null;
  /** Keyword keys (e.g. ["CheapMeat"]) for keyword-based ingredients */
  keywords?: string[];
  /** Quantity needed */
  quantity: number;
  /** Recipes that can produce this item (empty if not craftable or at max depth) */
  craftableVia: RecipeSource[];
  /** Sub-ingredients if resolved deeper (one entry per recipe option) */
  subIngredients?: IngredientNode[];
}

// ============================================================
// Reverse Lookup: ItemCode → recipes that produce it
// ============================================================

/**
 * Build a reverse lookup: ItemCode → recipes whose ResultItems include it.
 */
export function buildItemRecipeLookup(
  allRecipes: Map<string, Recipe>,
): Map<number, RecipeSource[]> {
  const lookup = new Map<number, RecipeSource[]>();
  for (const [recipeId, recipe] of allRecipes) {
    for (const result of recipe.ResultItems) {
      let list = lookup.get(result.ItemCode);
      if (!list) {
        list = [];
        lookup.set(result.ItemCode, list);
      }
      list.push({
        recipeId,
        recipe,
        outputStackSize: result.StackSize,
        percentChance: result.PercentChance,
      });
    }
  }
  return lookup;
}

/**
 * Find all recipes that produce a given ItemCode.
 */
export function findRecipesForItem(
  itemCode: number,
  lookup: Map<number, RecipeSource[]>,
): RecipeSource[] {
  return lookup.get(itemCode) ?? [];
}

// ============================================================
// Ingredient Tree Resolution
// ============================================================

/**
 * Resolve the ingredient tree for a given ItemCode.
 *
 * For each ingredient, checks whether it can be crafted via any recipe.
 * Recurses up to `maxDepth` levels (default 1 = only immediate sub-ingredients).
 *
 * @param itemCode     - The item to resolve ingredients for
 * @param quantity     - How many of this item are needed
 * @param allRecipes   - All game recipes
 * @param lookup       - Pre-built reverse lookup (optional, built if not provided)
 * @param maxDepth     - How many levels deep to resolve (default 1)
 */
export function resolveIngredientTree(
  itemCode: number,
  quantity: number,
  allRecipes: Map<string, Recipe>,
  lookup?: Map<number, RecipeSource[]>,
  maxDepth: number = 1,
): IngredientNode {
  const itemLookup = lookup ?? buildItemRecipeLookup(allRecipes);
  return resolveNode(itemCode, quantity, itemLookup, maxDepth, new Set());
}

function resolveNode(
  itemCode: number,
  quantity: number,
  lookup: Map<number, RecipeSource[]>,
  depthRemaining: number,
  visited: Set<number>,
): IngredientNode {
  const sources = findRecipesForItem(itemCode, lookup);

  const node: IngredientNode = {
    itemCode,
    quantity,
    craftableVia: sources,
  };

  // Resolve sub-ingredients if we have depth budget and recipes exist
  if (depthRemaining > 0 && sources.length > 0 && !visited.has(itemCode)) {
    visited.add(itemCode);
    // Use the first recipe as the primary crafting path
    const primarySource = sources[0];
    const craftsNeeded = Math.ceil(quantity / primarySource.outputStackSize);

    node.subIngredients = primarySource.recipe.Ingredients.map((ingredient) => {
      const subQty = ingredient.StackSize * craftsNeeded;
      if (ingredient.ItemCode != null) {
        return resolveNode(ingredient.ItemCode, subQty, lookup, depthRemaining - 1, visited);
      }
      // Keyword-based ingredient — can't resolve further
      return {
        itemCode: null,
        keywords: ingredient.ItemKeys,
        quantity: subQty,
        craftableVia: [],
      };
    });
    visited.delete(itemCode);
  }

  return node;
}

// ============================================================
// Craftable Ingredient Annotation
// ============================================================

export interface CraftableIngredientInfo {
  itemCode: number;
  /** All recipes that can produce this item */
  sources: RecipeSource[];
  /** Whether the character knows at least one of these recipes */
  characterKnowsRecipe: boolean;
  /** The "best" (first) recipe source, if any */
  primarySource: RecipeSource | null;
  /** Skill required for the primary source recipe */
  requiredSkill: string | null;
  /** Skill level required for the primary source recipe */
  requiredLevel: number | null;
}

/**
 * Annotate a set of ingredient item codes with craftability info.
 * Returns entries only for items that have at least one producing recipe.
 */
export function annotateCraftableIngredients(
  ingredientItemCodes: number[],
  lookup: Map<number, RecipeSource[]>,
  characterCompletions: Map<string, number>,
): Map<number, CraftableIngredientInfo> {
  const result = new Map<number, CraftableIngredientInfo>();
  for (const itemCode of ingredientItemCodes) {
    const sources = findRecipesForItem(itemCode, lookup);
    if (sources.length === 0) continue;

    const characterKnowsRecipe = sources.some(
      (s) => characterCompletions.has(s.recipe.InternalName),
    );
    const primarySource = sources[0];

    result.set(itemCode, {
      itemCode,
      sources,
      characterKnowsRecipe,
      primarySource,
      requiredSkill: primarySource.recipe.Skill,
      requiredLevel: primarySource.recipe.SkillLevelReq,
    });
  }
  return result;
}

// ============================================================
// Step-based Ingredient Computation
// ============================================================

// ============================================================
// Skill Dependency Extraction
// ============================================================

export interface SkillDependency {
  /** Item code of the ingredient that needs this skill */
  itemCode: number;
  /** Skill name required to craft the ingredient */
  requiredSkill: string;
  /** Minimum skill level required */
  requiredLevel: number;
  /** Name of the recipe that produces the ingredient */
  recipeName: string;
  /** Recipe key (e.g. "recipe_1234") */
  recipeId: string;
}

/**
 * Identify cross-skill dependencies from a plan's craftable ingredients.
 *
 * Returns ingredients whose crafting recipes require a different skill
 * than the plan's primary skill, and where the character's level in
 * that skill is insufficient.
 *
 * @param planSkill             - The primary skill of the current plan
 * @param craftableIngredients  - Craftability annotations for the plan's ingredients
 * @param charSkills            - Character's skill levels (empty map if no character loaded)
 */
export function extractSkillDependencies(
  planSkill: string,
  craftableIngredients: Map<number, CraftableIngredientInfo>,
  charSkills: Map<string, { Level: number }>,
): SkillDependency[] {
  const deps: SkillDependency[] = [];

  for (const [itemCode, info] of craftableIngredients) {
    if (!info.requiredSkill || info.requiredLevel === null) continue;
    if (info.requiredSkill === planSkill) continue;

    const charLevel = charSkills.get(info.requiredSkill)?.Level ?? 0;
    if (charLevel >= info.requiredLevel) continue;

    deps.push({
      itemCode,
      requiredSkill: info.requiredSkill,
      requiredLevel: info.requiredLevel,
      recipeName: info.primarySource?.recipe.Name ?? 'Unknown',
      recipeId: info.primarySource?.recipeId ?? '',
    });
  }

  return deps;
}

// ============================================================
// Step-based Ingredient Computation
// ============================================================

/**
 * Compute ingredient totals from a subset of CraftSteps.
 * Useful for computing partial plan costs (plan cursor feature).
 */
export function computeIngredientTotalsFromSteps(
  steps: CraftStep[],
  allRecipes: Map<string, Recipe>,
): { ingredientTotals: Map<number, IngredientUsage>; keywordIngredientTotals: Map<string, IngredientUsage> } {
  const ingredientTotals = new Map<number, IngredientUsage>();
  const keywordIngredientTotals = new Map<string, IngredientUsage>();

  for (const step of steps) {
    const recipe = allRecipes.get(step.recipeId);
    if (!recipe) continue;

    for (const ingredient of recipe.Ingredients) {
      const chance = ingredient.ChanceToConsume ?? 1.0;
      if (ingredient.ItemCode != null) {
        const existing = ingredientTotals.get(ingredient.ItemCode);
        if (existing) {
          existing.totalCount += ingredient.StackSize;
          existing.timesUsed++;
          existing.chanceToConsume = Math.min(existing.chanceToConsume, chance);
          existing.usedByRecipes.add(recipe.InternalName);
          existing.recipeCount = existing.usedByRecipes.size;
        } else {
          ingredientTotals.set(ingredient.ItemCode, {
            totalCount: ingredient.StackSize,
            timesUsed: 1,
            chanceToConsume: chance,
            recipeCount: 1,
            usedByRecipes: new Set([recipe.InternalName]),
          });
        }
      } else if (ingredient.ItemKeys) {
        const key = ingredient.ItemKeys.join('+');
        const existing = keywordIngredientTotals.get(key);
        if (existing) {
          existing.totalCount += ingredient.StackSize;
          existing.timesUsed++;
          existing.chanceToConsume = Math.min(existing.chanceToConsume, chance);
          existing.usedByRecipes.add(recipe.InternalName);
          existing.recipeCount = existing.usedByRecipes.size;
        } else {
          keywordIngredientTotals.set(key, {
            totalCount: ingredient.StackSize,
            timesUsed: 1,
            chanceToConsume: chance,
            recipeCount: 1,
            usedByRecipes: new Set([recipe.InternalName]),
          });
        }
      }
    }
  }

  return { ingredientTotals, keywordIngredientTotals };
}
