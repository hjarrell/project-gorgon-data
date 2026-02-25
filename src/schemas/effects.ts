import { z } from 'zod';

// ============================================================
// Schemas
// ============================================================

export const EffectSchema = z
  .object({
    Desc: z.string(),
    DisplayMode: z.string(),
    IconId: z.number().int(),
    Keywords: z.array(z.string()),
    Name: z.string(),
    AbilityKeywords: z.array(z.string()).optional(),
    Duration: z.union([z.number(), z.string()]).optional(),
    Particle: z.string().optional(),
    SpewText: z.string().optional(),
    StackingPriority: z.number().int().optional(),
    StackingType: z.string().optional(),
  })
  .strict();

export const EffectsRecordSchema = z.record(z.string(), EffectSchema);

// ============================================================
// Types (inferred from schemas)
// ============================================================

export type Effect = z.infer<typeof EffectSchema>;
export type EffectsRecord = z.infer<typeof EffectsRecordSchema>;
