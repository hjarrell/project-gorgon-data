import { z } from 'zod';

// ============================================================
// Schemas
// ============================================================

export const ItemBehaviorSchema = z
  .object({
    UseVerb: z.string(),
    MetabolismCost: z.number().int().optional(),
    MinStackSizeNeeded: z.number().int().optional(),
    UseAnimation: z.string().optional(),
    UseDelay: z.number().optional(),
    UseDelayAnimation: z.string().optional(),
    UseRequirements: z.array(z.string()).optional(),
  })
  .strict();

export const ItemSchema = z
  .object({
    // Required fields
    Description: z.string(),
    IconId: z.number().int(),
    InternalName: z.string(),
    MaxStackSize: z.number().int(),
    Name: z.string(),
    Value: z.number(),
    // Optional fields
    AllowInstallInGuildHalls: z.boolean().optional(),
    AllowInstallInHomes: z.boolean().optional(),
    AllowPrefix: z.boolean().optional(),
    AllowSuffix: z.boolean().optional(),
    AttuneOnPickup: z.boolean().optional(),
    Behaviors: z.array(ItemBehaviorSchema).optional(),
    BestowAbility: z.string().optional(),
    BestowLoreBook: z.number().int().optional(),
    BestowQuest: z.string().optional(),
    BestowRecipes: z.array(z.string()).optional(),
    BestowTitle: z.number().int().optional(),
    CraftPoints: z.number().int().optional(),
    CraftingTargetLevel: z.number().int().optional(),
    DestroyWhenUsedUp: z.boolean().optional(),
    DroppedAppearance: z.string().optional(),
    DroppedAppearanceLookup: z.string().optional(),
    DyeColor: z.string().optional(),
    DynamicCraftingSummary: z.string().optional(),
    EffectDescs: z.array(z.string()).optional(),
    EquipAppearance: z.string().optional(),
    EquipAppearance2: z.string().optional(),
    EquipSlot: z.string().optional(),
    FoodDesc: z.string().optional(),
    IgnoreAlreadyKnownBestowals: z.boolean().optional(),
    IsCrafted: z.boolean().optional(),
    IsSkillReqsDefaults: z.boolean().optional(),
    IsTemporary: z.boolean().optional(),
    Keywords: z.array(z.string()).optional(),
    Lint_VendorNpc: z.string().optional(),
    MacGuffinQuestName: z.string().optional(),
    MaxCarryable: z.number().int().optional(),
    MaxOnVendor: z.number().int().optional(),
    MountedAppearance: z.string().optional(),
    NumUses: z.number().int().optional(),
    RequiredAppearance: z.string().optional(),
    SelfDestructDuration_Hours: z.number().optional(),
    SkillReqs: z.record(z.string(), z.number().int()).optional(),
    StockDye: z.string().optional(),
    TSysProfile: z.string().optional(),
  })
  .strict();

export const ItemsRecordSchema = z.record(z.string(), ItemSchema);

// ============================================================
// Types (inferred from schemas)
// ============================================================

export type ItemBehavior = z.infer<typeof ItemBehaviorSchema>;
export type Item = z.infer<typeof ItemSchema>;
export type ItemsRecord = z.infer<typeof ItemsRecordSchema>;
