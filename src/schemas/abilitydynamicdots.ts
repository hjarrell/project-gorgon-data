import { z } from 'zod';

// ============================================================
// Schemas
// ============================================================

export const AbilityDynamicDoTSchema = z
  .object({
    AttributesThatDelta: z.array(z.string()),
    DamagePerTick: z.number(),
    DamageType: z.string(),
    Duration: z.number(),
    NumTicks: z.number().int(),
    ReqAbilityKeywords: z.array(z.string()),
    ReqActiveSkill: z.string(),
    ReqEffectKeywords: z.array(z.string()),
    SpecialRules: z.array(z.string()),
  })
  .strict();

export const AbilityDynamicDoTsArraySchema = z.array(AbilityDynamicDoTSchema);

// ============================================================
// Types (inferred from schemas)
// ============================================================

export type AbilityDynamicDoT = z.infer<typeof AbilityDynamicDoTSchema>;
export type AbilityDynamicDoTsArray = z.infer<typeof AbilityDynamicDoTsArraySchema>;
