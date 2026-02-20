import { z } from 'zod';

// ============================================================
// Schemas
// ============================================================

export const TSysPowerSchema = z
  .object({
    Tier: z.number().int(),
    Power: z.string(),
  })
  .strict();

export const StorageItemSchema = z
  .object({
    // Always present
    TypeID: z.number().int(),
    StackSize: z.number().int(),
    Value: z.number(),
    PetHusbandryState: z.string(),
    Name: z.string(),
    // Location (mutually exclusive: either in a vault or in inventory)
    StorageVault: z.string().optional(),
    IsInInventory: z.boolean().optional(),
    // Equipment fields
    Level: z.number().int().optional(),
    Slot: z.string().optional(),
    Rarity: z.string().optional(),
    TSysPowers: z.array(TSysPowerSchema).optional(),
    // Crafting
    IsCrafted: z.boolean().optional(),
    Crafter: z.string().optional(),
    // Binding / durability
    AttunedTo: z.string().optional(),
    Durability: z.number().optional(),
    TransmuteCount: z.number().int().optional(),
    // Imbue system
    TSysImbuePower: z.string().optional(),
    TSysImbuePowerTier: z.number().int().optional(),
  })
  .strict();

export const StorageReportSchema = z
  .object({
    Character: z.string(),
    Timestamp: z.string(),
    Report: z.literal('Storage'),
    ReportVersion: z.number().int(),
    Items: z.array(StorageItemSchema),
  })
  .strict();

// ============================================================
// Types (inferred from schemas)
// ============================================================

export type TSysPower = z.infer<typeof TSysPowerSchema>;
export type StorageItem = z.infer<typeof StorageItemSchema>;
export type StorageReport = z.infer<typeof StorageReportSchema>;
