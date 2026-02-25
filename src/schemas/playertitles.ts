import { z } from 'zod';

// ============================================================
// Schemas
// ============================================================

export const PlayerTitleSchema = z
  .object({
    Title: z.string(),
    AccountWide: z.boolean().optional(),
    Keywords: z.array(z.string()).optional(),
    SoulWide: z.boolean().optional(),
    Tooltip: z.string().optional(),
  })
  .strict();

export const PlayerTitlesRecordSchema = z.record(
  z.string(),
  PlayerTitleSchema,
);

// ============================================================
// Types (inferred from schemas)
// ============================================================

export type PlayerTitle = z.infer<typeof PlayerTitleSchema>;
export type PlayerTitlesRecord = z.infer<typeof PlayerTitlesRecordSchema>;
