import type { Recipe } from '../schemas';
import { loadJSON } from '../load-json';

const RAW_RECIPES = loadJSON('data/raw/recipes.json');

export const recipes = new Map<string, Recipe>(
  Object.entries(RAW_RECIPES as Record<string, Recipe>),
);

export { RAW_RECIPES };
