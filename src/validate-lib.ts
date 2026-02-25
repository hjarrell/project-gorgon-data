import { z } from 'zod';
import {
  AbilitiesRecordSchema,
  AbilityKeywordsArraySchema,
  AbilityDynamicDoTsArraySchema,
  AbilityDynamicSpecialValuesArraySchema,
  AdvancementTablesRecordSchema,
  AiRecordSchema,
  AreasRecordSchema,
  AttributesRecordSchema,
  DirectedGoalsArraySchema,
  EffectsRecordSchema,
  ItemsRecordSchema,
  ItemUsesRecordSchema,
  LandmarksRecordSchema,
  LorebookInfoSchema,
  LorebooksRecordSchema,
  NpcsRecordSchema,
  PlayerTitlesRecordSchema,
  QuestsRecordSchema,
  RecipesRecordSchema,
  SkillsRecordSchema,
  SourcesAbilitiesRecordSchema,
  SourcesItemsRecordSchema,
  SourcesRecipesRecordSchema,
  StorageVaultsRecordSchema,
  TsysClientInfoRecordSchema,
  TsysProfilesRecordSchema,
  XpTablesRecordSchema,
} from './schemas';

import RAW_ABILITIES from './data/raw/abilities.json';
import RAW_ABILITY_KEYWORDS from './data/raw/abilitykeywords.json';
import RAW_ABILITY_DYNAMIC_DOTS from './data/raw/abilitydynamicdots.json';
import RAW_ABILITY_DYNAMIC_SPECIAL_VALUES from './data/raw/abilitydynamicspecialvalues.json';
import RAW_ADVANCEMENT_TABLES from './data/raw/advancementtables.json';
import RAW_AI from './data/raw/ai.json';
import RAW_AREAS from './data/raw/areas.json';
import RAW_ATTRIBUTES from './data/raw/attributes.json';
import RAW_DIRECTED_GOALS from './data/raw/directedgoals.json';
import RAW_EFFECTS from './data/raw/effects.json';
import RAW_ITEMS from './data/raw/items.json';
import RAW_ITEM_USES from './data/raw/itemuses.json';
import RAW_LANDMARKS from './data/raw/landmarks.json';
import RAW_LOREBOOK_INFO from './data/raw/lorebookinfo.json';
import RAW_LOREBOOKS from './data/raw/lorebooks.json';
import RAW_NPCS from './data/raw/npcs.json';
import RAW_PLAYER_TITLES from './data/raw/playertitles.json';
import RAW_QUESTS from './data/raw/quests.json';
import RAW_RECIPES from './data/raw/recipes.json';
import RAW_SKILLS from './data/raw/skills.json';
import RAW_SOURCES_ABILITIES from './data/raw/sources_abilities.json';
import RAW_SOURCES_ITEMS from './data/raw/sources_items.json';
import RAW_SOURCES_RECIPES from './data/raw/sources_recipes.json';
import RAW_STORAGE_VAULTS from './data/raw/storagevaults.json';
import RAW_TSYS_CLIENT_INFO from './data/raw/tsysclientinfo.json';
import RAW_TSYS_PROFILES from './data/raw/tsysprofiles.json';
import RAW_XP_TABLES from './data/raw/xptables.json';

interface Validator {
  schema: z.ZodTypeAny;
  data: unknown;
}

const VALIDATORS: Record<string, Validator> = {
  abilities: { schema: AbilitiesRecordSchema, data: RAW_ABILITIES },
  abilityKeywords: { schema: AbilityKeywordsArraySchema, data: RAW_ABILITY_KEYWORDS },
  abilityDynamicDots: { schema: AbilityDynamicDoTsArraySchema, data: RAW_ABILITY_DYNAMIC_DOTS },
  abilityDynamicSpecialValues: { schema: AbilityDynamicSpecialValuesArraySchema, data: RAW_ABILITY_DYNAMIC_SPECIAL_VALUES },
  advancementTables: { schema: AdvancementTablesRecordSchema, data: RAW_ADVANCEMENT_TABLES },
  ai: { schema: AiRecordSchema, data: RAW_AI },
  areas: { schema: AreasRecordSchema, data: RAW_AREAS },
  attributes: { schema: AttributesRecordSchema, data: RAW_ATTRIBUTES },
  directedGoals: { schema: DirectedGoalsArraySchema, data: RAW_DIRECTED_GOALS },
  effects: { schema: EffectsRecordSchema, data: RAW_EFFECTS },
  items: { schema: ItemsRecordSchema, data: RAW_ITEMS },
  itemUses: { schema: ItemUsesRecordSchema, data: RAW_ITEM_USES },
  landmarks: { schema: LandmarksRecordSchema, data: RAW_LANDMARKS },
  lorebookInfo: { schema: LorebookInfoSchema, data: RAW_LOREBOOK_INFO },
  lorebooks: { schema: LorebooksRecordSchema, data: RAW_LOREBOOKS },
  npcs: { schema: NpcsRecordSchema, data: RAW_NPCS },
  playerTitles: { schema: PlayerTitlesRecordSchema, data: RAW_PLAYER_TITLES },
  quests: { schema: QuestsRecordSchema, data: RAW_QUESTS },
  recipes: { schema: RecipesRecordSchema, data: RAW_RECIPES },
  skills: { schema: SkillsRecordSchema, data: RAW_SKILLS },
  sourcesAbilities: { schema: SourcesAbilitiesRecordSchema, data: RAW_SOURCES_ABILITIES },
  sourcesItems: { schema: SourcesItemsRecordSchema, data: RAW_SOURCES_ITEMS },
  sourcesRecipes: { schema: SourcesRecipesRecordSchema, data: RAW_SOURCES_RECIPES },
  storageVaults: { schema: StorageVaultsRecordSchema, data: RAW_STORAGE_VAULTS },
  tsysClientInfo: { schema: TsysClientInfoRecordSchema, data: RAW_TSYS_CLIENT_INFO },
  tsysProfiles: { schema: TsysProfilesRecordSchema, data: RAW_TSYS_PROFILES },
  xpTables: { schema: XpTablesRecordSchema, data: RAW_XP_TABLES },
};

export type ValidatableFile = keyof typeof VALIDATORS;

/**
 * Validate a specific data file against its Zod schema.
 * Returns the parsed data on success, throws ZodError on failure.
 */
export function validateFile(name: string) {
  const validator = VALIDATORS[name];
  if (!validator) {
    throw new Error(`Unknown data file: ${name}. Valid names: ${Object.keys(VALIDATORS).join(', ')}`);
  }
  return validator.schema.parse(validator.data);
}

/**
 * Validate all data files that have schemas.
 * Returns an object mapping file names to success/error results.
 */
export function validate() {
  const results: Record<string, { success: boolean; error?: z.ZodError }> = {};
  for (const [name, { schema, data }] of Object.entries(VALIDATORS)) {
    const result = (schema as z.ZodTypeAny).safeParse(data);
    results[name] = result.success
      ? { success: true }
      : { success: false, error: result.error };
  }
  return results;
}
