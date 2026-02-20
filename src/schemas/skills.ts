import { z } from 'zod';

// ============================================================
// Schemas
// ============================================================

export const SkillRewardSchema = z
  .object({
    Ability: z.union([z.string(), z.array(z.string())]).optional(),
    BonusToSkill: z.string().optional(),
    Notes: z.string().optional(),
    Recipe: z.string().optional(),
  })
  .strict();

export const SkillSchema = z
  .object({
    // Required fields
    Combat: z.boolean(),
    Description: z.string(),
    GuestLevelCap: z.number().int(),
    Id: z.number().int(),
    MaxBonusLevels: z.number().int(),
    Rewards: z.record(z.string(), SkillRewardSchema),
    XpTable: z.string(),
    // Optional fields
    ActiveAdvancementTable: z.string().optional(),
    AdvancementHints: z.record(z.string(), z.string()).optional(),
    AssociatedAppearances: z.array(z.string()).optional(),
    AssociatedItemKeywords: z.array(z.string()).optional(),
    AuxCombat: z.boolean().optional(),
    DisallowedAppearances: z.array(z.string()).optional(),
    DisallowedItemKeywords: z.array(z.string()).optional(),
    HideWhenZero: z.boolean().optional(),
    InteractionFlagLevelCaps: z.record(z.string(), z.number().int()).optional(),
    IsFakeCombatSkill: z.boolean().optional(),
    IsUmbrellaSkill: z.boolean().optional(),
    Name: z.string().optional(),
    Parents: z.array(z.string()).optional(),
    PassiveAdvancementTable: z.string().optional(),
    ProdigyEnabledInteractionFlag: z.string().optional(),
    RecipeIngredientKeywords: z.array(z.string()).optional(),
    Reports: z.record(z.string(), z.string()).optional(),
    SkillLevelDisparityApplies: z.boolean().optional(),
    SkipBonusLevelsIfSkillUnlearned: z.boolean().optional(),
    TSysCompatibleCombatSkills: z.array(z.string()).optional(),
    XpEarnedAttributes: z.array(z.string()).optional(),
    _RecipeIngredientKeywords: z.array(z.string()).optional(),
  })
  .strict();

export const SkillsRecordSchema = z.record(z.string(), SkillSchema);

// ============================================================
// Types (inferred from schemas)
// ============================================================

export type SkillReward = z.infer<typeof SkillRewardSchema>;
export type Skill = z.infer<typeof SkillSchema>;
export type SkillsRecord = z.infer<typeof SkillsRecordSchema>;
