import { z } from 'zod';

// ============================================================
// Schemas
// ============================================================

export const NpcPreferenceSchema = z
  .object({
    Desire: z.string(),
    Keywords: z.array(z.string()),
    Pref: z.number(),
    Favor: z.string().optional(),
    Name: z.string().optional(),
  })
  .strict();

export const NpcServiceSchema = z
  .object({
    Favor: z.string(),
    Type: z.string(),
    AdditionalUnlocks: z.array(z.string()).optional(),
    CapIncreases: z.array(z.string()).optional(),
    ItemDescs: z.array(z.string()).optional(),
    ItemTypes: z.array(z.string()).optional(),
    LevelRange: z.array(z.string()).optional(),
    Skills: z.array(z.string()).optional(),
    SpaceIncreases: z.array(z.string()).optional(),
    Unlocks: z.array(z.string()).optional(),
  })
  .strict();

export const NpcSchema = z
  .object({
    AreaFriendlyName: z.string(),
    AreaName: z.string(),
    Desc: z.string(),
    Name: z.string(),
    ItemGifts: z.array(z.string()).optional(),
    Pos: z.string().optional(),
    Preferences: z.array(NpcPreferenceSchema).optional(),
    Services: z.array(NpcServiceSchema).optional(),
  })
  .strict();

export const NpcsRecordSchema = z.record(z.string(), NpcSchema);

// ============================================================
// Types (inferred from schemas)
// ============================================================

export type NpcPreference = z.infer<typeof NpcPreferenceSchema>;
export type NpcService = z.infer<typeof NpcServiceSchema>;
export type Npc = z.infer<typeof NpcSchema>;
export type NpcsRecord = z.infer<typeof NpcsRecordSchema>;
