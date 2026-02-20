import type { Ability, Area, Item, ItemUse, Npc, Recipe, Skill, SourceAbility, SourceItem, SourceRecipe } from '../schemas';

// --- JSON Imports ---
import RAW_ABILITIES from './abilities.json';
import RAW_ABILITY_DYNAMIC_DOTS from './abilitydynamicdots.json';
import RAW_ABILITY_DYNAMIC_SPECIAL_VALUES from './abilitydynamicspecialvalues.json';
import RAW_ABILITY_KEYWORDS from './abilitykeywords.json';
import RAW_ADVANCEMENT_TABLES from './advancementtables.json';
import RAW_AI from './ai.json';
import RAW_AREAS from './areas.json';
import RAW_ATTRIBUTES from './attributes.json';
import RAW_DIRECTED_GOALS from './directedgoals.json';
import RAW_EFFECTS from './effects.json';
import RAW_ITEMS from './items.json';
import RAW_ITEM_USES from './itemuses.json';
import RAW_LANDMARKS from './landmarks.json';
import RAW_LOREBOOK_INFO from './lorebookinfo.json';
import RAW_LOREBOOKS from './lorebooks.json';
import RAW_NPCS from './npcs.json';
import RAW_PLAYER_TITLES from './playertitles.json';
import RAW_QUESTS from './quests.json';
import RAW_RECIPES from './recipes.json';
import RAW_SKILLS from './skills.json';
import RAW_SOURCES_ABILITIES from './sources_abilities.json';
import RAW_SOURCES_ITEMS from './sources_items.json';
import RAW_SOURCES_RECIPES from './sources_recipes.json';
import RAW_STORAGE_VAULTS from './storagevaults.json';
import RAW_TSYS_CLIENT_INFO from './tsysclientinfo.json';
import RAW_TSYS_PROFILES from './tsysprofiles.json';
import RAW_XP_TABLES from './xptables.json';

// --- Typed Maps (for files with schemas) ---

export const abilities = new Map<string, Ability>(
  Object.entries(RAW_ABILITIES as Record<string, Ability>),
);

export const areas = new Map<string, Area>(
  Object.entries(RAW_AREAS as Record<string, Area>),
);

export const items = new Map<string, Item>(
  Object.entries(RAW_ITEMS as Record<string, Item>),
);

export const itemUses = new Map<string, ItemUse>(
  Object.entries(RAW_ITEM_USES as Record<string, ItemUse>),
);

export const recipes = new Map<string, Recipe>(
  Object.entries(RAW_RECIPES as Record<string, Recipe>),
);

export const npcs = new Map<string, Npc>(
  Object.entries(RAW_NPCS as Record<string, Npc>),
);

export const skills = new Map<string, Skill>(
  Object.entries(RAW_SKILLS as Record<string, Skill>),
);

export const sourcesAbilities = new Map<string, SourceAbility>(
  Object.entries(RAW_SOURCES_ABILITIES as Record<string, SourceAbility>),
);

export const sourcesItems = new Map<string, SourceItem>(
  Object.entries(RAW_SOURCES_ITEMS as Record<string, SourceItem>),
);

export const sourcesRecipes = new Map<string, SourceRecipe>(
  Object.entries(RAW_SOURCES_RECIPES as Record<string, SourceRecipe>),
);

// --- Raw JSON re-exports (for all files) ---
export {
  RAW_ABILITIES,
  RAW_ABILITY_DYNAMIC_DOTS,
  RAW_ABILITY_DYNAMIC_SPECIAL_VALUES,
  RAW_ABILITY_KEYWORDS,
  RAW_ADVANCEMENT_TABLES,
  RAW_AI,
  RAW_AREAS,
  RAW_ATTRIBUTES,
  RAW_DIRECTED_GOALS,
  RAW_EFFECTS,
  RAW_ITEMS,
  RAW_ITEM_USES,
  RAW_LANDMARKS,
  RAW_LOREBOOK_INFO,
  RAW_LOREBOOKS,
  RAW_NPCS,
  RAW_PLAYER_TITLES,
  RAW_QUESTS,
  RAW_RECIPES,
  RAW_SKILLS,
  RAW_SOURCES_ABILITIES,
  RAW_SOURCES_ITEMS,
  RAW_SOURCES_RECIPES,
  RAW_STORAGE_VAULTS,
  RAW_TSYS_CLIENT_INFO,
  RAW_TSYS_PROFILES,
  RAW_XP_TABLES,
};
