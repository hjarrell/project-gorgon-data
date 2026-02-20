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
