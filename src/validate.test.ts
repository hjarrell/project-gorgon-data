import { describe, it, expect } from 'vitest';
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

// ============================================================
// Schema validation (parse entire JSON files)
// ============================================================

describe('schema validation', () => {
  it('abilities.json matches AbilitiesRecordSchema', () => {
    const result = AbilitiesRecordSchema.safeParse(RAW_ABILITIES);
    expect(result.success, result.error?.toString()).toBe(true);
  });

  it('areas.json matches AreasRecordSchema', () => {
    const result = AreasRecordSchema.safeParse(RAW_AREAS);
    expect(result.success, result.error?.toString()).toBe(true);
  });

  it('items.json matches ItemsRecordSchema', () => {
    const result = ItemsRecordSchema.safeParse(RAW_ITEMS);
    expect(result.success, result.error?.toString()).toBe(true);
  });

  it('itemuses.json matches ItemUsesRecordSchema', () => {
    const result = ItemUsesRecordSchema.safeParse(RAW_ITEM_USES);
    expect(result.success, result.error?.toString()).toBe(true);
  });

  it('recipes.json matches RecipesRecordSchema', () => {
    const result = RecipesRecordSchema.safeParse(RAW_RECIPES);
    expect(result.success, result.error?.toString()).toBe(true);
  });

  it('npcs.json matches NpcsRecordSchema', () => {
    const result = NpcsRecordSchema.safeParse(RAW_NPCS);
    expect(result.success, result.error?.toString()).toBe(true);
  });

  it('skills.json matches SkillsRecordSchema', () => {
    const result = SkillsRecordSchema.safeParse(RAW_SKILLS);
    expect(result.success, result.error?.toString()).toBe(true);
  });

  it('sources_abilities.json matches SourcesAbilitiesRecordSchema', () => {
    const result = SourcesAbilitiesRecordSchema.safeParse(RAW_SOURCES_ABILITIES);
    expect(result.success, result.error?.toString()).toBe(true);
  });

  it('sources_items.json matches SourcesItemsRecordSchema', () => {
    const result = SourcesItemsRecordSchema.safeParse(RAW_SOURCES_ITEMS);
    expect(result.success, result.error?.toString()).toBe(true);
  });

  it('sources_recipes.json matches SourcesRecipesRecordSchema', () => {
    const result = SourcesRecipesRecordSchema.safeParse(RAW_SOURCES_RECIPES);
    expect(result.success, result.error?.toString()).toBe(true);
  });

  it('tsysclientinfo.json matches TsysClientInfoRecordSchema', () => {
    const result = TsysClientInfoRecordSchema.safeParse(RAW_TSYS_CLIENT_INFO);
    expect(result.success, result.error?.toString()).toBe(true);
  });

  it('abilitykeywords.json matches AbilityKeywordsArraySchema', () => {
    const result = AbilityKeywordsArraySchema.safeParse(RAW_ABILITY_KEYWORDS);
    expect(result.success, result.error?.toString()).toBe(true);
  });

  it('abilitydynamicdots.json matches AbilityDynamicDoTsArraySchema', () => {
    const result = AbilityDynamicDoTsArraySchema.safeParse(RAW_ABILITY_DYNAMIC_DOTS);
    expect(result.success, result.error?.toString()).toBe(true);
  });

  it('abilitydynamicspecialvalues.json matches AbilityDynamicSpecialValuesArraySchema', () => {
    const result = AbilityDynamicSpecialValuesArraySchema.safeParse(RAW_ABILITY_DYNAMIC_SPECIAL_VALUES);
    expect(result.success, result.error?.toString()).toBe(true);
  });

  it('advancementtables.json matches AdvancementTablesRecordSchema', () => {
    const result = AdvancementTablesRecordSchema.safeParse(RAW_ADVANCEMENT_TABLES);
    expect(result.success, result.error?.toString()).toBe(true);
  });

  it('ai.json matches AiRecordSchema', () => {
    const result = AiRecordSchema.safeParse(RAW_AI);
    expect(result.success, result.error?.toString()).toBe(true);
  });

  it('attributes.json matches AttributesRecordSchema', () => {
    const result = AttributesRecordSchema.safeParse(RAW_ATTRIBUTES);
    expect(result.success, result.error?.toString()).toBe(true);
  });

  it('directedgoals.json matches DirectedGoalsArraySchema', () => {
    const result = DirectedGoalsArraySchema.safeParse(RAW_DIRECTED_GOALS);
    expect(result.success, result.error?.toString()).toBe(true);
  });

  it('effects.json matches EffectsRecordSchema', () => {
    const result = EffectsRecordSchema.safeParse(RAW_EFFECTS);
    expect(result.success, result.error?.toString()).toBe(true);
  });

  it('landmarks.json matches LandmarksRecordSchema', () => {
    const result = LandmarksRecordSchema.safeParse(RAW_LANDMARKS);
    expect(result.success, result.error?.toString()).toBe(true);
  });

  it('lorebookinfo.json matches LorebookInfoSchema', () => {
    const result = LorebookInfoSchema.safeParse(RAW_LOREBOOK_INFO);
    expect(result.success, result.error?.toString()).toBe(true);
  });

  it('lorebooks.json matches LorebooksRecordSchema', () => {
    const result = LorebooksRecordSchema.safeParse(RAW_LOREBOOKS);
    expect(result.success, result.error?.toString()).toBe(true);
  });

  it('playertitles.json matches PlayerTitlesRecordSchema', () => {
    const result = PlayerTitlesRecordSchema.safeParse(RAW_PLAYER_TITLES);
    expect(result.success, result.error?.toString()).toBe(true);
  });

  it('quests.json matches QuestsRecordSchema', () => {
    const result = QuestsRecordSchema.safeParse(RAW_QUESTS);
    expect(result.success, result.error?.toString()).toBe(true);
  });

  it('storagevaults.json matches StorageVaultsRecordSchema', () => {
    const result = StorageVaultsRecordSchema.safeParse(RAW_STORAGE_VAULTS);
    expect(result.success, result.error?.toString()).toBe(true);
  });

  it('tsysprofiles.json matches TsysProfilesRecordSchema', () => {
    const result = TsysProfilesRecordSchema.safeParse(RAW_TSYS_PROFILES);
    expect(result.success, result.error?.toString()).toBe(true);
  });

  it('xptables.json matches XpTablesRecordSchema', () => {
    const result = XpTablesRecordSchema.safeParse(RAW_XP_TABLES);
    expect(result.success, result.error?.toString()).toBe(true);
  });
});

// ============================================================
// Spot-check known items (verify typed Maps contain expected data)
// ============================================================

describe('spot-check known items', () => {
  it('xpTables: Table_1 is TypicalCombatSkill with correct XP amounts', () => {
    const raw = RAW_XP_TABLES as Record<string, { InternalName: string; XpAmounts: number[] }>;
    const table = raw['Table_1'];
    expect(table).toBeDefined();
    expect(table.InternalName).toBe('TypicalCombatSkill');
    expect(table.XpAmounts).toBeInstanceOf(Array);
    expect(table.XpAmounts.length).toBeGreaterThan(50);
    expect(table.XpAmounts[0]).toBe(10);
    expect(table.XpAmounts[1]).toBe(17);
  });

  it('abilityDynamicSpecialValues: first entry has expected fields', () => {
    const arr = RAW_ABILITY_DYNAMIC_SPECIAL_VALUES as Array<{
      Label: string; Suffix: string; Value: number;
      ReqAbilityKeywords: string[]; ReqEffectKeywords: string[];
      SkipIfZero: boolean;
    }>;
    expect(arr.length).toBeGreaterThan(0);
    const first = arr[0];
    expect(first.Label).toBe('Restores');
    expect(first.Suffix).toBe('Body Heat in cold environments');
    expect(first.Value).toBe(5);
    expect(first.ReqAbilityKeywords).toEqual(['Attack']);
    expect(first.ReqEffectKeywords).toEqual(['TestEffect']);
    expect(first.SkipIfZero).toBe(true);
  });

  it('advancementTables: 1001_Skeleton has Level_01 vulnerabilities', () => {
    const raw = RAW_ADVANCEMENT_TABLES as Record<string, Record<string, Record<string, number>>>;
    const skeleton = raw['1001_Skeleton'];
    expect(skeleton).toBeDefined();
    expect(skeleton.Level_01).toBeDefined();
    expect(skeleton.Level_01.VULN_CRUSHING).toBe(0.25);
    expect(skeleton.Level_01.VULN_DARKNESS).toBe(-0.5);
    expect(skeleton.Level_01.VULN_FIRE).toBe(0.25);
  });

  it('ai: AktaariSoldier has expected abilities and properties', () => {
    const raw = RAW_AI as Record<string, {
      Abilities: Record<string, Record<string, unknown>>;
      Strategy?: string; Swimming?: boolean;
      MinDelayBetweenAbilities?: number;
    }>;
    const soldier = raw['AktaariSoldier'];
    expect(soldier).toBeDefined();
    expect(soldier.Strategy).toBe('Melee');
    expect(soldier.Swimming).toBe(true);
    expect(soldier.MinDelayBetweenAbilities).toBe(1);
    expect(soldier.Abilities.AktaariSlash1).toBeDefined();
    expect(soldier.Abilities.AktaariSlow).toBeDefined();
    expect(soldier.Abilities.AktaariSlow.cue).toBe('Slowed');
  });

  it('attributes: AUTOLOOT_RADIUS has expected label and tooltip', () => {
    const raw = RAW_ATTRIBUTES as Record<string, {
      DisplayRule: string; DisplayType: string;
      DefaultValue?: number; Label?: string;
      IconIds?: number[]; Tooltip?: string;
    }>;
    const attr = raw['AUTOLOOT_RADIUS'];
    expect(attr).toBeDefined();
    expect(attr.DisplayRule).toBe('IfNotDefault');
    expect(attr.DisplayType).toBe('AsDouble');
    expect(attr.DefaultValue).toBe(5);
    expect(attr.Label).toBe('Corpse-Loot Radius');
    expect(attr.Tooltip).toContain('looting a corpse');
    expect(attr.IconIds).toEqual([108]);
  });

  it('directedGoals: first entry is the General category gate', () => {
    const arr = RAW_DIRECTED_GOALS as Array<{
      Id: number; Label: string; Zone: string;
      IsCategoryGate?: boolean;
    }>;
    expect(arr.length).toBeGreaterThan(0);
    const first = arr[0];
    expect(first.Id).toBe(1);
    expect(first.Label).toBe('General');
    expect(first.IsCategoryGate).toBe(true);
    expect(first.Zone).toBe('Tasks without a specific location');
  });

  it('effects: effect_10010 is Orran\'s Inventory Expander', () => {
    const raw = RAW_EFFECTS as Record<string, {
      Name: string; Desc: string; DisplayMode: string;
      Duration?: number | string; IconId: number;
      Keywords: string[]; StackingType?: string;
      StackingPriority?: number;
    }>;
    const effect = raw['effect_10010'];
    expect(effect).toBeDefined();
    expect(effect.Name).toBe("Orran's Inventory Expander");
    expect(effect.DisplayMode).toBe('Effect');
    expect(effect.Duration).toBe(18000);
    expect(effect.IconId).toBe(6333);
    expect(effect.Keywords).toContain('Buff');
    expect(effect.StackingType).toBe('WordOfPowerInventory');
    expect(effect.StackingPriority).toBe(101);
  });

  it('landmarks: AreaCasino has an Employee Exit portal', () => {
    const raw = RAW_LANDMARKS as Record<string, Array<{
      Name: string; Loc: string; Type: string; Desc?: string;
    }>>;
    const area = raw['AreaCasino'];
    expect(area).toBeDefined();
    expect(area.length).toBeGreaterThan(0);
    const exit = area[0];
    expect(exit.Name).toBe('Employee Exit');
    expect(exit.Type).toBe('Portal');
    expect(exit.Desc).toBe('Employees Only!');
  });

  it('lorebookInfo: has Categories with expected keys', () => {
    const raw = RAW_LOREBOOK_INFO as {
      Categories: Record<string, { Title: string; SubTitle?: string; SortTitle?: string }>;
    };
    expect(raw.Categories).toBeDefined();
    expect(raw.Categories.Gods.Title).toBe('The Gods');
    expect(raw.Categories.Gods.SubTitle).toBe('Gods, Myths, and Legends');
    expect(raw.Categories.History.Title).toBe('History');
    expect(raw.Categories.Stories.Title).toBe('Stories');
  });

  it('lorebooks: Book_101 is The Wasted Wishes', () => {
    const raw = RAW_LOREBOOKS as Record<string, {
      Category: string; InternalName: string; Title: string;
      IsClientLocal: boolean; Keywords: string[];
      Visibility: string; LocationHint?: string; Text?: string;
    }>;
    const book = raw['Book_101'];
    expect(book).toBeDefined();
    expect(book.InternalName).toBe('TheWastedWishes');
    expect(book.Title).toBe('The Wasted Wishes');
    expect(book.Category).toBe('Stories');
    expect(book.IsClientLocal).toBe(true);
    expect(book.Keywords).toContain('AreaSerbule');
    expect(book.LocationHint).toBe('Found in a house in Serbule');
    expect(book.Text).toContain('Wasted Wishes');
  });

  it('playerTitles: Title_102 is MEGA Master', () => {
    const raw = RAW_PLAYER_TITLES as Record<string, {
      Title: string; Keywords?: string[]; Tooltip?: string;
    }>;
    const title = raw['Title_102'];
    expect(title).toBeDefined();
    expect(title.Title).toContain('MEGA Master');
    expect(title.Tooltip).toContain('MEGA Raffles');
    expect(title.Keywords).toContain('Lint_NotObtainable');
  });

  it('quests: quest_10001 is Get Cat Eyeballs for Joeh', () => {
    const raw = RAW_QUESTS as Record<string, {
      Name: string; InternalName: string; Description: string;
      Objectives: Array<{ Description: string; Type: string; Number?: number; ItemName?: string }>;
      Requirements?: unknown; Rewards?: Array<{ T: string; Skill?: string; Xp?: number }>;
      FavorNpc?: string; DisplayedLocation?: string;
      Reward_Favor?: number; Version: number;
    }>;
    const quest = raw['quest_10001'];
    expect(quest).toBeDefined();
    expect(quest.Name).toBe('Get Cat Eyeballs for Joeh');
    expect(quest.InternalName).toBe('GetCatEyeballsForJoeh');
    expect(quest.DisplayedLocation).toBe('Serbule');
    expect(quest.FavorNpc).toBe('AreaSerbule/NPC_Joe');
    expect(quest.Version).toBe(2);
    expect(quest.Reward_Favor).toBe(100);
    // Objectives
    expect(quest.Objectives).toHaveLength(2);
    expect(quest.Objectives[0].Type).toBe('Collect');
    expect(quest.Objectives[0].ItemName).toBe('CatEyeball');
    expect(quest.Objectives[0].Number).toBe(2);
    expect(quest.Objectives[1].Type).toBe('Scripted');
    // Rewards
    expect(quest.Rewards).toHaveLength(1);
    expect(quest.Rewards![0].T).toBe('SkillXp');
    expect(quest.Rewards![0].Skill).toBe('Sword');
    expect(quest.Rewards![0].Xp).toBe(750);
  });

  it('storageVaults: NPC_Agrashab has Levels and correct area', () => {
    const raw = RAW_STORAGE_VAULTS as Record<string, {
      Area: string; ID: number; NpcFriendlyName: string;
      Grouping?: string; Levels?: Record<string, number>;
    }>;
    const vault = raw['NPC_Agrashab'];
    expect(vault).toBeDefined();
    expect(vault.Area).toBe('AreaSunVale');
    expect(vault.ID).toBe(905);
    expect(vault.NpcFriendlyName).toBe('Agrashab');
    expect(vault.Grouping).toBe('AreaSunVale');
    expect(vault.Levels).toBeDefined();
    expect(vault.Levels!.Comfortable).toBe(16);
    expect(vault.Levels!.Friends).toBe(20);
    expect(vault.Levels!.SoulMates).toBe(36);
  });

  it('tsysProfiles: All profile is a non-empty string array', () => {
    const raw = RAW_TSYS_PROFILES as Record<string, string[]>;
    const all = raw['All'];
    expect(all).toBeDefined();
    expect(all).toBeInstanceOf(Array);
    expect(all.length).toBeGreaterThan(100);
    expect(all).toContain('AccuracyBoost');
    expect(all).toContain('AcidArrowBoost');
  });
});
