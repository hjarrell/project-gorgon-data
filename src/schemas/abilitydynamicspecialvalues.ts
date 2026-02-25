import { z } from 'zod';

// ============================================================
// Schemas
// ============================================================

export const AbilityDynamicSpecialValueSchema = z
  .object({
    Label: z.string(),
    ReqAbilityKeywords: z.array(z.string()),
    ReqEffectKeywords: z.array(z.string()),
    SkipIfZero: z.boolean(),
    Suffix: z.string(),
    Value: z.number(),
    AttributesThatDelta: z.array(z.string()).optional(),
  })
  .strict();

export const AbilityDynamicSpecialValuesArraySchema = z.array(
  AbilityDynamicSpecialValueSchema,
);

// ============================================================
// Types (inferred from schemas)
// ============================================================

export type AbilityDynamicSpecialValue = z.infer<
  typeof AbilityDynamicSpecialValueSchema
>;
export type AbilityDynamicSpecialValuesArray = z.infer<
  typeof AbilityDynamicSpecialValuesArraySchema
>;
