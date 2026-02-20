import { getItemByCode } from './item-helpers';
import { findItemsByKeyword, findItemsByKeywords } from './keyword-helpers';
// ============================================================
// Resolution Functions
// ============================================================
/**
 * Resolve a recipe's ingredients to their actual Items.
 *
 * For ItemCode-based ingredients, looks up the Item directly.
 * For ItemKeys-based ingredients, optionally resolves matching items via keyword index.
 */
export function resolveRecipeIngredients(recipe, allItems, keywordIndex) {
    return recipe.Ingredients.map((ingredient) => {
        if (ingredient.ItemCode != null) {
            const item = getItemByCode(ingredient.ItemCode, allItems);
            return {
                ingredient,
                item,
                itemName: item?.Name ?? `Item #${ingredient.ItemCode}`,
                itemCode: ingredient.ItemCode,
            };
        }
        // Keyword-based ingredient
        const keys = ingredient.ItemKeys ?? [];
        const keywordMatches = keywordIndex
            ? (keys.length > 1
                ? findItemsByKeywords(keys, keywordIndex)
                : keys.length === 1
                    ? findItemsByKeyword(keys[0], keywordIndex)
                    : [])
            : undefined;
        return {
            ingredient,
            itemName: ingredient.Desc ?? keys.join(' + '),
            keywordMatches,
        };
    });
}
/**
 * Resolve a recipe's result items to their actual Items.
 */
export function resolveRecipeResults(recipe, allItems) {
    return recipe.ResultItems.map((resultItem) => {
        const item = getItemByCode(resultItem.ItemCode, allItems);
        return {
            resultItem,
            item,
            itemName: item?.Name ?? `Item #${resultItem.ItemCode}`,
        };
    });
}
/**
 * Resolve both ingredients and results for a recipe.
 */
export function resolveRecipe(recipeId, recipe, allItems, keywordIndex) {
    return {
        recipeId,
        recipe,
        ingredients: resolveRecipeIngredients(recipe, allItems, keywordIndex),
        results: resolveRecipeResults(recipe, allItems),
    };
}
