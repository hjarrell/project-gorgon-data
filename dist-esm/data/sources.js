import RAW_SOURCES_ABILITIES from './sources_abilities.json';
import RAW_SOURCES_ITEMS from './sources_items.json';
import RAW_SOURCES_RECIPES from './sources_recipes.json';
export const sourcesAbilities = new Map(Object.entries(RAW_SOURCES_ABILITIES));
export const sourcesItems = new Map(Object.entries(RAW_SOURCES_ITEMS));
export const sourcesRecipes = new Map(Object.entries(RAW_SOURCES_RECIPES));
export { RAW_SOURCES_ABILITIES, RAW_SOURCES_ITEMS, RAW_SOURCES_RECIPES };
