import { z } from 'zod';

// ============================================================
// Schemas
// ============================================================

export const LandmarkSchema = z
  .object({
    Loc: z.string(),
    Name: z.string(),
    Type: z.string(),
    Combo: z.string().optional(),
    Desc: z.string().optional(),
  })
  .strict();

export const LandmarksRecordSchema = z.record(
  z.string(),
  z.array(LandmarkSchema),
);

// ============================================================
// Types (inferred from schemas)
// ============================================================

export type Landmark = z.infer<typeof LandmarkSchema>;
export type LandmarksRecord = z.infer<typeof LandmarksRecordSchema>;
