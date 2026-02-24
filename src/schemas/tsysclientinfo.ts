import { z } from 'zod';

// ============================================================
// Schemas
// ============================================================

export const TsysTierSchema = z
  .object({
    EffectDescs: z.array(z.string()),
    MaxLevel: z.number().int(),
    MinLevel: z.number().int(),
    MinRarity: z.string(),
    SkillLevelPrereq: z.number().int(),
  })
  .strict();

export const TsysPowerSchema = z
  .object({
    // Required fields
    InternalName: z.string(),
    Skill: z.string(),
    Slots: z.array(z.string()),
    Tiers: z.record(z.string(), TsysTierSchema),
    // Optional fields
    IsHiddenFromTransmutation: z.boolean().optional(),
    IsUnavailable: z.boolean().optional(),
    Prefix: z.string().optional(),
    Suffix: z.string().optional(),
  })
  .strict();

export const TsysClientInfoRecordSchema = z.record(
  z.string(),
  TsysPowerSchema,
);

// ============================================================
// Types (inferred from schemas)
// ============================================================

export type TsysTier = z.infer<typeof TsysTierSchema>;
export type TsysPower = z.infer<typeof TsysPowerSchema>;
export type TsysClientInfoRecord = z.infer<typeof TsysClientInfoRecordSchema>;
