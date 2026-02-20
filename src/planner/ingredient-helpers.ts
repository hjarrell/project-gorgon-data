import type { Recipe } from '../schemas/recipes';

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
