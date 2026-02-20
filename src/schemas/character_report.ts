import { z } from 'zod';

// ============================================================
// Schemas
// ============================================================

export const CharacterSkillEntrySchema = z
  .object({
    Level: z.number().int(),
    BonusLevels: z.number().int(),
    XpTowardNextLevel: z.number(),
    XpNeededForNextLevel: z.number(),
    Abilities: z.array(z.string()).optional(),
  })
  .strict();

export const NpcFavorSchema = z
  .object({
    FavorLevel: z.string(),
  })
  .strict();

export const CharacterReportSchema = z
  .object({
    Character: z.string(),
    Timestamp: z.string(),
    Report: z.literal('CharacterSheet'),
    ReportVersion: z.number().int(),
    Race: z.string(),
    Skills: z.record(z.string(), CharacterSkillEntrySchema),
    RecipeCompletions: z.record(z.string(), z.number().int()),
    CurrentStats: z.record(z.string(), z.number()),
    Currencies: z.record(z.string(), z.number()),
    ActiveQuests: z.array(z.string()),
    ActiveWorkOrders: z.array(z.string()),
    CompletedWorkOrders: z.array(z.string()),
    NPCs: z.record(z.string(), NpcFavorSchema),
  })
  .strict();

// ============================================================
// Types (inferred from schemas)
// ============================================================

export type CharacterSkillEntry = z.infer<typeof CharacterSkillEntrySchema>;
export type NpcFavor = z.infer<typeof NpcFavorSchema>;
export type CharacterReport = z.infer<typeof CharacterReportSchema>;
