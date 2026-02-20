import { z } from 'zod';
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

interface Validator {
  schema: z.ZodTypeAny;
  data: unknown;
}

const VALIDATORS: Record<string, Validator> = {
  abilities: { schema: AbilitiesRecordSchema, data: RAW_ABILITIES },
  areas: { schema: AreasRecordSchema, data: RAW_AREAS },
  items: { schema: ItemsRecordSchema, data: RAW_ITEMS },
  itemUses: { schema: ItemUsesRecordSchema, data: RAW_ITEM_USES },
  npcs: { schema: NpcsRecordSchema, data: RAW_NPCS },
  recipes: { schema: RecipesRecordSchema, data: RAW_RECIPES },
  skills: { schema: SkillsRecordSchema, data: RAW_SKILLS },
  sourcesAbilities: { schema: SourcesAbilitiesRecordSchema, data: RAW_SOURCES_ABILITIES },
  sourcesItems: { schema: SourcesItemsRecordSchema, data: RAW_SOURCES_ITEMS },
  sourcesRecipes: { schema: SourcesRecipesRecordSchema, data: RAW_SOURCES_RECIPES },
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
