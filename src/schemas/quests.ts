import { z } from 'zod';

// ============================================================
// Schemas
// ============================================================

/**
 * Quest requirements are polymorphic (discriminated by T field).
 * We validate the T field and allow any additional fields.
 */
export const QuestRequirementSchema = z
  .object({
    T: z.string(),
  })
  .passthrough();

/**
 * Requirements can appear as:
 * - A single object: { T: "..." }
 * - An array of objects: [{ T: "..." }, ...]
 * - An array of arrays (AND/OR groups): [[{ T: "..." }, ...]]
 */
const QuestRequirementsFieldSchema = z.union([
  QuestRequirementSchema,
  z.array(z.union([QuestRequirementSchema, z.array(QuestRequirementSchema)])),
]);

export const QuestObjectiveSchema = z
  .object({
    Description: z.string(),
    Type: z.string(),
    AbilityKeyword: z.string().optional(),
    AllowedFishingZone: z.string().optional(),
    AnatomyType: z.string().optional(),
    BehaviorId: z.string().optional(),
    CausesOfDeath: z.array(z.string()).optional(),
    DamageType: z.string().optional(),
    FishConfig: z.string().optional(),
    GroupId: z.number().int().optional(),
    InteractionFlags: z.array(z.string()).optional(),
    InternalName: z.string().optional(),
    IsHiddenUntilEarlierObjectivesComplete: z.boolean().optional(),
    Item: z.string().optional(),
    ItemKeyword: z.string().optional(),
    ItemName: z.string().optional(),
    MaxAmount: z.string().optional(),
    MaxFavorReceived: z.string().optional(),
    MinAmount: z.string().optional(),
    MinFavorReceived: z.string().optional(),
    MonsterTypeTag: z.string().optional(),
    NumTargets: z.string().optional(),
    NumToDeliver: z.string().optional(),
    Number: z.number().int().optional(),
    Requirements: QuestRequirementsFieldSchema.optional(),
    ResultItemKeyword: z.string().optional(),
    Skill: z.string().optional(),
    StringParam: z.string().optional(),
    Target: z.union([z.string(), z.array(z.string())]).optional(),
  })
  .strict();

export const QuestRewardSchema = z
  .object({
    T: z.string(),
    Ability: z.string().optional(),
    Amount: z.number().int().optional(),
    Credits: z.number().int().optional(),
    Currency: z.string().optional(),
    Level: z.number().int().optional(),
    Recipe: z.string().optional(),
    Skill: z.string().optional(),
    Xp: z.number().int().optional(),
  })
  .strict();

export const QuestItemSchema = z
  .object({
    Item: z.string(),
    StackSize: z.number().int(),
  })
  .strict();

export const QuestSchema = z
  .object({
    Description: z.string(),
    InternalName: z.string(),
    Name: z.string(),
    Objectives: z.array(QuestObjectiveSchema),
    Version: z.number().int(),
    CheckRequirementsToSustainOnBestow: z.boolean().optional(),
    DeleteFromHistoryIfVersionChanged: z.boolean().optional(),
    DisplayedLocation: z.string().optional(),
    FavorNpc: z.string().optional(),
    FollowUpQuests: z.array(z.string()).optional(),
    ForceBookOnWrapUp: z.boolean().optional(),
    GroupingName: z.string().optional(),
    IsAutoPreface: z.boolean().optional(),
    IsAutoWrapUp: z.boolean().optional(),
    IsCancellable: z.boolean().optional(),
    IsGuildQuest: z.boolean().optional(),
    Keywords: z.array(z.string()).optional(),
    Level: z.number().int().optional(),
    MainNpcName: z.string().optional(),
    MidwayGiveItems: z.array(QuestItemSchema).optional(),
    MidwayText: z.string().optional(),
    NumExpectedParticipants: z.number().int().optional(),
    PreGiveEffects: z.array(z.string()).optional(),
    PreGiveItems: z.array(QuestItemSchema).optional(),
    PreGiveRecipes: z.array(z.string()).optional(),
    PrefaceText: z.string().optional(),
    PrerequisiteFavorLevel: z.string().optional(),
    QuestFailEffects: z.array(z.string()).optional(),
    QuestNpc: z.string().optional(),
    Requirements: QuestRequirementsFieldSchema.optional(),
    RequirementsToSustain: QuestRequirementsFieldSchema.optional(),
    ReuseTime_Days: z.number().int().optional(),
    ReuseTime_Hours: z.number().int().optional(),
    ReuseTime_Minutes: z.number().int().optional(),
    Reward_Favor: z.number().int().optional(),
    Reward_SkillLevels: z.record(z.string(), z.number().int()).optional(),
    Rewards: z.array(QuestRewardSchema).optional(),
    Rewards_Description: z.string().optional(),
    Rewards_Effects: z.array(z.string()).optional(),
    Rewards_Favor: z.number().int().optional(),
    Rewards_Items: z.array(QuestItemSchema).optional(),
    Rewards_NamedLootProfile: z.string().optional(),
    SuccessText: z.string().optional(),
    TSysLevel: z.number().int().optional(),
    WorkOrderSkill: z.string().optional(),
  })
  .strict();

export const QuestsRecordSchema = z.record(z.string(), QuestSchema);

// ============================================================
// Types (inferred from schemas)
// ============================================================

export type QuestRequirement = z.infer<typeof QuestRequirementSchema>;
export type QuestObjective = z.infer<typeof QuestObjectiveSchema>;
export type QuestReward = z.infer<typeof QuestRewardSchema>;
export type QuestItem = z.infer<typeof QuestItemSchema>;
export type Quest = z.infer<typeof QuestSchema>;
export type QuestsRecord = z.infer<typeof QuestsRecordSchema>;
