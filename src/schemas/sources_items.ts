import { z } from 'zod';

// ============================================================
// Schemas
// ============================================================

export const SourceItemEntrySchema = z
  .object({
    type: z.string(),
    friendlyName: z.string().optional(),
    hangOutId: z.number().int().optional(),
    itemTypeId: z.number().int().optional(),
    npc: z.string().optional(),
    questId: z.number().int().optional(),
    recipeId: z.number().int().optional(),
  })
  .strict();

export const SourceItemSchema = z
  .object({
    entries: z.array(SourceItemEntrySchema),
  })
  .strict();

export const SourcesItemsRecordSchema = z.record(z.string(), SourceItemSchema);

// ============================================================
// Types (inferred from schemas)
// ============================================================

export type SourceItemEntry = z.infer<typeof SourceItemEntrySchema>;
export type SourceItem = z.infer<typeof SourceItemSchema>;
export type SourcesItemsRecord = z.infer<typeof SourcesItemsRecordSchema>;
