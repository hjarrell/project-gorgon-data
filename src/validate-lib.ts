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
import { loadJSON } from './load-json';

const RAW_ABILITIES = loadJSON('./data/raw/abilities.json');
const RAW_ABILITY_KEYWORDS = loadJSON('./data/raw/abilitykeywords.json');
const RAW_ABILITY_DYNAMIC_DOTS = loadJSON('./data/raw/abilitydynamicdots.json');
const RAW_ABILITY_DYNAMIC_SPECIAL_VALUES = loadJSON('./data/raw/abilitydynamicspecialvalues.json');
const RAW_ADVANCEMENT_TABLES = loadJSON('./data/raw/advancementtables.json');
const RAW_AI = loadJSON('./data/raw/ai.json');
const RAW_AREAS = loadJSON('./data/raw/areas.json');
const RAW_ATTRIBUTES = loadJSON('./data/raw/attributes.json');
const RAW_DIRECTED_GOALS = loadJSON('./data/raw/directedgoals.json');
const RAW_EFFECTS = loadJSON('./data/raw/effects.json');
const RAW_ITEMS = loadJSON('./data/raw/items.json');
const RAW_ITEM_USES = loadJSON('./data/raw/itemuses.json');
const RAW_LANDMARKS = loadJSON('./data/raw/landmarks.json');
const RAW_LOREBOOK_INFO = loadJSON('./data/raw/lorebookinfo.json');
const RAW_LOREBOOKS = loadJSON('./data/raw/lorebooks.json');
const RAW_NPCS = loadJSON('./data/raw/npcs.json');
const RAW_PLAYER_TITLES = loadJSON('./data/raw/playertitles.json');
const RAW_QUESTS = loadJSON('./data/raw/quests.json');
const RAW_RECIPES = loadJSON('./data/raw/recipes.json');
const RAW_SKILLS = loadJSON('./data/raw/skills.json');
const RAW_SOURCES_ABILITIES = loadJSON('./data/raw/sources_abilities.json');
const RAW_SOURCES_ITEMS = loadJSON('./data/raw/sources_items.json');
const RAW_SOURCES_RECIPES = loadJSON('./data/raw/sources_recipes.json');
const RAW_STORAGE_VAULTS = loadJSON('./data/raw/storagevaults.json');
const RAW_TSYS_CLIENT_INFO = loadJSON('./data/raw/tsysclientinfo.json');
const RAW_TSYS_PROFILES = loadJSON('./data/raw/tsysprofiles.json');
const RAW_XP_TABLES = loadJSON('./data/raw/xptables.json');

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
