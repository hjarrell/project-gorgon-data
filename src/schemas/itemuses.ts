import { z } from 'zod';

// ============================================================
// Schemas
// ============================================================

export const ItemUseSchema = z
  .object({
    RecipesThatUseItem: z.array(z.number().int()),
  })
  .strict();

export const ItemUsesRecordSchema = z.record(z.string(), ItemUseSchema);

// ============================================================
// Types (inferred from schemas)
// ============================================================

export type ItemUse = z.infer<typeof ItemUseSchema>;
export type ItemUsesRecord = z.infer<typeof ItemUsesRecordSchema>;
