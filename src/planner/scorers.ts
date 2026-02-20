import type { Recipe } from '../schemas/recipes';

/**
 * A scoring function that ranks a recipe given its computed XP and effort.
 * Higher score = better candidate. Return value is used for comparison only.
 */
export type RecipeScorer = (recipe: Recipe, xp: number, effort: number) => number;

/** Pick the recipe with the highest raw XP per craft. */
export const xpScorer: RecipeScorer = (_recipe, xp) => xp;

/** Pick the recipe with the highest XP per unit of effort. */
export const efficientScorer: RecipeScorer = (_recipe, xp, effort) =>
  effort > 0 ? xp / effort : xp;
