import type { SourceAbility, SourceItem, SourceRecipe } from '../schemas';

import RAW_SOURCES_ABILITIES from './sources_abilities.json';
import RAW_SOURCES_ITEMS from './sources_items.json';
import RAW_SOURCES_RECIPES from './sources_recipes.json';

export const sourcesAbilities = new Map<string, SourceAbility>(
  Object.entries(RAW_SOURCES_ABILITIES as Record<string, SourceAbility>),
);

export const sourcesItems = new Map<string, SourceItem>(
  Object.entries(RAW_SOURCES_ITEMS as Record<string, SourceItem>),
);

export const sourcesRecipes = new Map<string, SourceRecipe>(
  Object.entries(RAW_SOURCES_RECIPES as Record<string, SourceRecipe>),
);

export { RAW_SOURCES_ABILITIES, RAW_SOURCES_ITEMS, RAW_SOURCES_RECIPES };
