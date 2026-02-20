import { describe, it, expect } from 'vitest';
import {
  AbilitiesRecordSchema,
  AreasRecordSchema,
  ItemsRecordSchema,
  ItemUsesRecordSchema,
  NpcsRecordSchema,
  RecipesRecordSchema,
  SkillsRecordSchema,
  SourcesAbilitiesRecordSchema,
  SourcesItemsRecordSchema,
  SourcesRecipesRecordSchema,
} from './schemas';

import RAW_ABILITIES from './data/abilities.json';
import RAW_AREAS from './data/areas.json';
import RAW_ITEMS from './data/items.json';
import RAW_ITEM_USES from './data/itemuses.json';
import RAW_NPCS from './data/npcs.json';
import RAW_RECIPES from './data/recipes.json';
import RAW_SKILLS from './data/skills.json';
import RAW_SOURCES_ABILITIES from './data/sources_abilities.json';
import RAW_SOURCES_ITEMS from './data/sources_items.json';
import RAW_SOURCES_RECIPES from './data/sources_recipes.json';

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
});
