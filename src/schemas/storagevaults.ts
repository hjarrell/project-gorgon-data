import { z } from 'zod';

// ============================================================
// Schemas
// ============================================================

export const StorageVaultRequirementSchema = z
  .object({
    T: z.string(),
  })
  .passthrough();

export const StorageVaultSchema = z
  .object({
    Area: z.string(),
    ID: z.number().int(),
    NpcFriendlyName: z.string(),
    EventLevels: z.record(z.string(), z.number().int()).optional(),
    Grouping: z.string().optional(),
    HasAssociatedNpc: z.boolean().optional(),
    Levels: z.record(z.string(), z.number().int()).optional(),
    NumSlots: z.number().int().optional(),
    NumSlotsScriptAtomic: z.string().optional(),
    NumSlotsScriptAtomicMaxValue: z.number().int().optional(),
    NumSlotsScriptAtomicMinValue: z.number().int().optional(),
    RequiredItemKeywords: z.array(z.string()).optional(),
    RequirementDescription: z.string().optional(),
    Requirements: StorageVaultRequirementSchema.optional(),
    SlotAttribute: z.string().optional(),
  })
  .strict();

export const StorageVaultsRecordSchema = z.record(
  z.string(),
  StorageVaultSchema,
);

// ============================================================
// Types (inferred from schemas)
// ============================================================

export type StorageVaultRequirement = z.infer<
  typeof StorageVaultRequirementSchema
>;
export type StorageVault = z.infer<typeof StorageVaultSchema>;
export type StorageVaultsRecord = z.infer<typeof StorageVaultsRecordSchema>;
