// ============================================================
// Reverse Lookup: ItemCode → recipes that produce it
// ============================================================
/**
 * Build a reverse lookup: ItemCode → recipes whose ResultItems include it.
 */
export function buildItemRecipeLookup(allRecipes) {
    const lookup = new Map();
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
export function findRecipesForItem(itemCode, lookup) {
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
export function resolveIngredientTree(itemCode, quantity, allRecipes, lookup, maxDepth = 1) {
    const itemLookup = lookup ?? buildItemRecipeLookup(allRecipes);
    return resolveNode(itemCode, quantity, itemLookup, maxDepth, new Set());
}
function resolveNode(itemCode, quantity, lookup, depthRemaining, visited) {
    const sources = findRecipesForItem(itemCode, lookup);
    const node = {
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
