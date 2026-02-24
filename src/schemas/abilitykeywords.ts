import { z } from 'zod';

// ============================================================
// Schemas
// ============================================================

export const AbilityKeywordEntrySchema = z
  .object({
    // Required fields
    MustHaveAbilityKeywords: z.array(z.string()),
    // Optional fields
    AttributesThatDeltaAccuracy: z.array(z.string()).optional(),
    AttributesThatDeltaCritChance: z.array(z.string()).optional(),
    AttributesThatDeltaDamage: z.array(z.string()).optional(),
    AttributesThatDeltaPowerCost: z.array(z.string()).optional(),
    AttributesThatDeltaRange: z.array(z.string()).optional(),
    AttributesThatDeltaResetTime: z.array(z.string()).optional(),
    AttributesThatModCritDamage: z.array(z.string()).optional(),
    AttributesThatModDamage: z.array(z.string()).optional(),
    MustHaveActiveSkill: z.string().optional(),
    MustHaveEffectKeywords: z.array(z.string()).optional(),
    MustNotHaveAbilityKeywords: z.array(z.string()).optional(),
  })
  .strict();

export const AbilityKeywordsArraySchema = z.array(AbilityKeywordEntrySchema);

// ============================================================
// Types (inferred from schemas)
// ============================================================

export type AbilityKeywordEntry = z.infer<typeof AbilityKeywordEntrySchema>;
export type AbilityKeywordsArray = z.infer<typeof AbilityKeywordsArraySchema>;
