import { z } from 'zod';

// ============================================================
// Schemas
// ============================================================

export const SourceAbilityEntrySchema = z
  .object({
    type: z.string(),
    itemTypeId: z.number().int().optional(),
    npc: z.string().optional(),
    questId: z.number().int().optional(),
    skill: z.string().optional(),
  })
  .strict();

export const SourceAbilitySchema = z
  .object({
    entries: z.array(SourceAbilityEntrySchema),
  })
  .strict();

export const SourcesAbilitiesRecordSchema = z.record(z.string(), SourceAbilitySchema);

// ============================================================
// Types (inferred from schemas)
// ============================================================

export type SourceAbilityEntry = z.infer<typeof SourceAbilityEntrySchema>;
export type SourceAbility = z.infer<typeof SourceAbilitySchema>;
export type SourcesAbilitiesRecord = z.infer<typeof SourcesAbilitiesRecordSchema>;
