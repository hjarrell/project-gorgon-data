import { z } from 'zod';

// ============================================================
// Schemas
// ============================================================

export const SourceRecipeEntrySchema = z
  .object({
    type: z.string(),
    hangOutId: z.number().int().optional(),
    itemTypeId: z.number().int().optional(),
    npc: z.string().optional(),
    questId: z.number().int().optional(),
    skill: z.string().optional(),
  })
  .strict();

export const SourceRecipeSchema = z
  .object({
    entries: z.array(SourceRecipeEntrySchema),
  })
  .strict();

export const SourcesRecipesRecordSchema = z.record(z.string(), SourceRecipeSchema);

// ============================================================
// Types (inferred from schemas)
// ============================================================

export type SourceRecipeEntry = z.infer<typeof SourceRecipeEntrySchema>;
export type SourceRecipe = z.infer<typeof SourceRecipeSchema>;
export type SourcesRecipesRecord = z.infer<typeof SourcesRecipesRecordSchema>;
