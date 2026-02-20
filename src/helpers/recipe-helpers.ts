import type { Item } from '../schemas/items';
import type { Recipe, RecipeIngredient, RecipeResultItem } from '../schemas/recipes';
import { getItemByCode } from './item-helpers';
import { findItemsByKeyword, findItemsByKeywords } from './keyword-helpers';
import type { KeywordIndex, KeywordMatch } from './keyword-helpers';

// ============================================================
// Types
// ============================================================

/** A recipe ingredient resolved to its actual item(s). */
export interface ResolvedIngredient {
  /** The original ingredient from the recipe */
  ingredient: RecipeIngredient;
  /** The resolved Item, when ingredient uses ItemCode */
  item?: Item;
  /** The item's display name (resolved or fallback) */
  itemName: string;
  /** The numeric item code (when available) */
  itemCode?: number;
  /** For keyword-based ingredients: matching items from the keyword index */
  keywordMatches?: KeywordMatch[];
}

/** A recipe result item resolved to its actual Item. */
export interface ResolvedResultItem {
  /** The original result from the recipe */
  resultItem: RecipeResultItem;
  /** The resolved Item */
  item?: Item;
  /** The item's display name */
  itemName: string;
}

/** A recipe with all its ingredients and results resolved to items. */
export interface ResolvedRecipe {
  recipeId: string;
  recipe: Recipe;
  ingredients: ResolvedIngredient[];
  results: ResolvedResultItem[];
}

// ============================================================
// Resolution Functions
// ============================================================

/**
 * Resolve a recipe's ingredients to their actual Items.
 *
 * For ItemCode-based ingredients, looks up the Item directly.
 * For ItemKeys-based ingredients, optionally resolves matching items via keyword index.
 */
export function resolveRecipeIngredients(
  recipe: Recipe,
  allItems: Map<string, Item>,
  keywordIndex?: KeywordIndex,
): ResolvedIngredient[] {
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
export function resolveRecipeResults(
  recipe: Recipe,
  allItems: Map<string, Item>,
): ResolvedResultItem[] {
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
export function resolveRecipe(
  recipeId: string,
  recipe: Recipe,
  allItems: Map<string, Item>,
  keywordIndex?: KeywordIndex,
): ResolvedRecipe {
  return {
    recipeId,
    recipe,
    ingredients: resolveRecipeIngredients(recipe, allItems, keywordIndex),
    results: resolveRecipeResults(recipe, allItems),
  };
}
