import { z } from 'zod';

// ============================================================
// Schemas
// ============================================================

export const AiAbilityEntrySchema = z
  .object({
    cue: z.string().optional(),
    cueVal: z.number().int().optional(),
    favorite: z.boolean().optional(),
    maxLevel: z.number().int().optional(),
    maxRange: z.number().int().optional(),
    minLevel: z.number().int().optional(),
    minRange: z.number().optional(),
  })
  .strict();

export const AiSchema = z
  .object({
    Abilities: z.record(z.string(), AiAbilityEntrySchema),
    Comment: z.string().optional(),
    Description: z.string().optional(),
    FlyOffset: z.number().int().optional(),
    Flying: z.boolean().optional(),
    MinDelayBetweenAbilities: z.number().optional(),
    MobilityType: z.string().optional(),
    ServerDriven: z.boolean().optional(),
    Strategy: z.string().optional(),
    Swimming: z.boolean().optional(),
    UncontrolledPet: z.boolean().optional(),
    UseAbilitiesWithoutEnemyTarget: z.boolean().optional(),
  })
  .strict();

export const AiRecordSchema = z.record(z.string(), AiSchema);

// ============================================================
// Types (inferred from schemas)
// ============================================================

export type AiAbilityEntry = z.infer<typeof AiAbilityEntrySchema>;
export type Ai = z.infer<typeof AiSchema>;
export type AiRecord = z.infer<typeof AiRecordSchema>;
