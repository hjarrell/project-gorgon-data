import type { Recipe } from '../schemas';

import RAW_RECIPES from './raw/recipes.json';

export const recipes = new Map<string, Recipe>(
  Object.entries(RAW_RECIPES as Record<string, Recipe>),
);

export { RAW_RECIPES };
