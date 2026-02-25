import { z } from 'zod';

// ============================================================
// Schemas
// ============================================================

export const LorebookCategorySchema = z
  .object({
    Title: z.string(),
    SortTitle: z.string().optional(),
    SubTitle: z.string().optional(),
  })
  .strict();

export const LorebookInfoSchema = z
  .object({
    Categories: z.record(z.string(), LorebookCategorySchema),
  })
  .strict();

// ============================================================
// Types (inferred from schemas)
// ============================================================

export type LorebookCategory = z.infer<typeof LorebookCategorySchema>;
export type LorebookInfo = z.infer<typeof LorebookInfoSchema>;
