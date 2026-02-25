import { z } from 'zod';

// ============================================================
// Schemas
// ============================================================

export const LorebookSchema = z
  .object({
    Category: z.string(),
    InternalName: z.string(),
    IsClientLocal: z.boolean(),
    Keywords: z.array(z.string()),
    Title: z.string(),
    Visibility: z.string(),
    LocationHint: z.string().optional(),
    Text: z.string().optional(),
  })
  .strict();

export const LorebooksRecordSchema = z.record(z.string(), LorebookSchema);

// ============================================================
// Types (inferred from schemas)
// ============================================================

export type Lorebook = z.infer<typeof LorebookSchema>;
export type LorebooksRecord = z.infer<typeof LorebooksRecordSchema>;
