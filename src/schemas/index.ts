// --- Abilities ---
export {
  AbilitiesRecordSchema,
  AbilityAmmoKeywordSchema,
  AbilityCasterRequirementSchema,
  AbilityConditionalKeywordSchema,
  AbilityCostSchema,
  AbilityDoTSchema,
  AbilityPvESchema,
  AbilitySchema,
  AbilitySpecialValueSchema,
} from './abilities';

export type {
  AbilitiesRecord,
  Ability,
  AbilityAmmoKeyword,
  AbilityCasterRequirement,
  AbilityConditionalKeyword,
  AbilityCost,
  AbilityDoT,
  AbilityPvE,
  AbilitySpecialValue,
} from './abilities';

// --- Areas ---
export { AreaSchema, AreasRecordSchema } from './areas';
export type { Area, AreasRecord } from './areas';

// --- Items ---
export { ItemBehaviorSchema, ItemSchema, ItemsRecordSchema } from './items';
export type { Item, ItemBehavior, ItemsRecord } from './items';

// --- Item Uses ---
export { ItemUseSchema, ItemUsesRecordSchema } from './itemuses';
export type { ItemUse, ItemUsesRecord } from './itemuses';

// --- Recipes ---
export {
  RecipeCostSchema,
  RecipeIngredientSchema,
  RecipeOtherRequirementSchema,
  RecipeProtoResultItemSchema,
  RecipeResultItemSchema,
  RecipeSchema,
  RecipesRecordSchema,
} from './recipes';

export type {
  Recipe,
  RecipeCost,
  RecipeIngredient,
  RecipeOtherRequirement,
  RecipeProtoResultItem,
  RecipeResultItem,
  RecipesRecord,
} from './recipes';

// --- NPCs ---
export { NpcPreferenceSchema, NpcServiceSchema, NpcSchema, NpcsRecordSchema } from './npcs';
export type { Npc, NpcPreference, NpcService, NpcsRecord } from './npcs';

// --- Skills ---
export { SkillRewardSchema, SkillSchema, SkillsRecordSchema } from './skills';
export type { Skill, SkillReward, SkillsRecord } from './skills';

// --- Sources: Abilities ---
export {
  SourceAbilityEntrySchema,
  SourceAbilitySchema,
  SourcesAbilitiesRecordSchema,
} from './sources_abilities';

export type {
  SourceAbility,
  SourceAbilityEntry,
  SourcesAbilitiesRecord,
} from './sources_abilities';

// --- Sources: Items ---
export {
  SourceItemEntrySchema,
  SourceItemSchema,
  SourcesItemsRecordSchema,
} from './sources_items';

export type {
  SourceItem,
  SourceItemEntry,
  SourcesItemsRecord,
} from './sources_items';

// --- Sources: Recipes ---
export {
  SourceRecipeEntrySchema,
  SourceRecipeSchema,
  SourcesRecipesRecordSchema,
} from './sources_recipes';

export type {
  SourceRecipe,
  SourceRecipeEntry,
  SourcesRecipesRecord,
} from './sources_recipes';

// --- Character Report ---
export {
  CharacterSkillEntrySchema,
  NpcFavorSchema,
  CharacterReportSchema,
} from './character_report';

export type {
  CharacterSkillEntry,
  NpcFavor,
  CharacterReport,
} from './character_report';

// --- Storage Report ---
export {
  TSysPowerSchema,
  StorageItemSchema,
  StorageReportSchema,
} from './storage_report';

export type {
  TSysPower,
  StorageItem,
  StorageReport,
} from './storage_report';

// --- TSys Client Info ---
export {
  TsysTierSchema as TsysClientInfoTierSchema,
  TsysPowerSchema as TsysClientInfoPowerSchema,
  TsysClientInfoRecordSchema,
} from './tsysclientinfo';

export type {
  TsysTier as TsysClientInfoTier,
  TsysPower as TsysClientInfoPower,
  TsysClientInfoRecord,
} from './tsysclientinfo';

// --- Ability Keywords ---
export {
  AbilityKeywordEntrySchema,
  AbilityKeywordsArraySchema,
} from './abilitykeywords';

export type {
  AbilityKeywordEntry,
  AbilityKeywordsArray,
} from './abilitykeywords';

// --- Ability Dynamic DoTs ---
export {
  AbilityDynamicDoTSchema,
  AbilityDynamicDoTsArraySchema,
} from './abilitydynamicdots';

export type {
  AbilityDynamicDoT,
  AbilityDynamicDoTsArray,
} from './abilitydynamicdots';

// --- Ability Dynamic Special Values ---
export {
  AbilityDynamicSpecialValueSchema,
  AbilityDynamicSpecialValuesArraySchema,
} from './abilitydynamicspecialvalues';

export type {
  AbilityDynamicSpecialValue,
  AbilityDynamicSpecialValuesArray,
} from './abilitydynamicspecialvalues';

// --- Advancement Tables ---
export {
  AdvancementTableSchema,
  AdvancementTablesRecordSchema,
} from './advancementtables';

export type {
  AdvancementTable,
  AdvancementTablesRecord,
} from './advancementtables';

// --- AI ---
export { AiAbilityEntrySchema, AiSchema, AiRecordSchema } from './ai';
export type { AiAbilityEntry, Ai, AiRecord } from './ai';

// --- Attributes ---
export { AttributeSchema, AttributesRecordSchema } from './attributes';
export type { Attribute, AttributesRecord } from './attributes';

// --- Directed Goals ---
export { DirectedGoalSchema, DirectedGoalsArraySchema } from './directedgoals';
export type { DirectedGoal, DirectedGoalsArray } from './directedgoals';

// --- Effects ---
export { EffectSchema, EffectsRecordSchema } from './effects';
export type { Effect, EffectsRecord } from './effects';

// --- Landmarks ---
export { LandmarkSchema, LandmarksRecordSchema } from './landmarks';
export type { Landmark, LandmarksRecord } from './landmarks';

// --- Lorebook Info ---
export {
  LorebookCategorySchema,
  LorebookInfoSchema,
} from './lorebookinfo';

export type { LorebookCategory, LorebookInfo } from './lorebookinfo';

// --- Lorebooks ---
export { LorebookSchema, LorebooksRecordSchema } from './lorebooks';
export type { Lorebook, LorebooksRecord } from './lorebooks';

// --- Player Titles ---
export { PlayerTitleSchema, PlayerTitlesRecordSchema } from './playertitles';
export type { PlayerTitle, PlayerTitlesRecord } from './playertitles';

// --- Quests ---
export {
  QuestRequirementSchema,
  QuestObjectiveSchema,
  QuestRewardSchema,
  QuestItemSchema,
  QuestSchema,
  QuestsRecordSchema,
} from './quests';

export type {
  QuestRequirement,
  QuestObjective,
  QuestReward,
  QuestItem,
  Quest,
  QuestsRecord,
} from './quests';

// --- Storage Vaults ---
export {
  StorageVaultRequirementSchema,
  StorageVaultSchema,
  StorageVaultsRecordSchema,
} from './storagevaults';

export type {
  StorageVaultRequirement,
  StorageVault,
  StorageVaultsRecord,
} from './storagevaults';

// --- TSys Profiles ---
export { TsysProfilesRecordSchema } from './tsysprofiles';
export type { TsysProfilesRecord } from './tsysprofiles';

// --- XP Tables ---
export { XpTableSchema, XpTablesRecordSchema } from './xptables';
export type { XpTable, XpTablesRecord } from './xptables';
