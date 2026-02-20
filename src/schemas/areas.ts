import { z } from 'zod';

// ============================================================
// Schemas
// ============================================================

export const AreaSchema = z
  .object({
    FriendlyName: z.string(),
    ShortFriendlyName: z.string().optional(),
  })
  .strict();

export const AreasRecordSchema = z.record(z.string(), AreaSchema);

// ============================================================
// Types (inferred from schemas)
// ============================================================

export type Area = z.infer<typeof AreaSchema>;
export type AreasRecord = z.infer<typeof AreasRecordSchema>;
