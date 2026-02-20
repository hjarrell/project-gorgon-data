import { z } from 'zod';
// ============================================================
// Schemas
// ============================================================
export const RecipeIngredientSchema = z
    .object({
    StackSize: z.number().int(),
    ChanceToConsume: z.number().optional(),
    Desc: z.string().optional(),
    DurabilityConsumed: z.number().optional(),
    ItemCode: z.number().int().optional(),
    ItemKeys: z.array(z.string()).optional(),
})
    .strict();
export const RecipeResultItemSchema = z
    .object({
    ItemCode: z.number().int(),
    StackSize: z.number().int(),
    AttuneToCrafter: z.boolean().optional(),
    PercentChance: z.number().optional(),
})
    .strict();
export const RecipeProtoResultItemSchema = z
    .object({
    ItemCode: z.number().int(),
    StackSize: z.number().int(),
})
    .strict();
export const RecipeCostSchema = z
    .object({
    Currency: z.string(),
    Price: z.number(),
})
    .strict();
export const RecipeOtherRequirementSchema = z
    .object({
    T: z.string(),
    AllowedStates: z.array(z.string()).optional(),
    Appearance: z.string().optional(),
    ClearSky: z.boolean().optional(),
    DisallowedStates: z.array(z.string()).optional(),
    Distance: z.number().optional(),
    EntityTypeTag: z.string().optional(),
    ErrorMsg: z.string().optional(),
    Keyword: z.string().optional(),
    MaxCount: z.number().optional(),
    MaxHour: z.number().optional(),
    MaxTimesUsed: z.number().optional(),
    MinCount: z.number().optional(),
    MinHour: z.number().optional(),
    MoonPhase: z.string().optional(),
    PetTypeTag: z.string().optional(),
    Recipe: z.string().optional(),
    Slot: z.string().optional(),
})
    .strict();
export const RecipeSchema = z
    .object({
    Description: z.string(),
    IconId: z.number().int(),
    Ingredients: z.array(RecipeIngredientSchema),
    InternalName: z.string(),
    Name: z.string(),
    ResultItems: z.array(RecipeResultItemSchema),
    RewardSkill: z.string(),
    RewardSkillXp: z.number(),
    RewardSkillXpFirstTime: z.number(),
    Skill: z.string(),
    SkillLevelReq: z.number(),
    ActionLabel: z.string().optional(),
    Costs: z.array(RecipeCostSchema).optional(),
    DyeColor: z.string().optional(),
    IsItemMenuKeywordReqSufficient: z.boolean().optional(),
    ItemMenuCategory: z.string().optional(),
    ItemMenuCategoryLevel: z.number().optional(),
    ItemMenuKeywordReq: z.string().optional(),
    ItemMenuLabel: z.string().optional(),
    Keywords: z.array(z.string()).optional(),
    LoopParticle: z.string().optional(),
    MaxUses: z.number().optional(),
    NumResultItems: z.number().optional(),
    OtherRequirements: z
        .union([
        z.array(RecipeOtherRequirementSchema),
        RecipeOtherRequirementSchema,
    ])
        .optional(),
    Particle: z.string().optional(),
    PrereqRecipe: z.string().optional(),
    ProtoResultItems: z.array(RecipeProtoResultItemSchema).optional(),
    RequiredAttributeNonZero: z.string().optional(),
    ResetTimeInSeconds: z.number().optional(),
    ResultEffects: z.array(z.string()).optional(),
    ResultEffectsThatCanFail: z.array(z.string()).optional(),
    RewardAllowBonusXp: z.boolean().optional(),
    RewardSkillXpDropOffLevel: z.number().optional(),
    RewardSkillXpDropOffPct: z.number().optional(),
    RewardSkillXpDropOffRate: z.number().optional(),
    SharesResetTimerWith: z.string().optional(),
    SortSkill: z.string().optional(),
    UsageAnimation: z.string().optional(),
    UsageAnimationEnd: z.string().optional(),
    UsageDelay: z.number().optional(),
    UsageDelayMessage: z.string().optional(),
    ValidationIngredientKeywords: z.array(z.string()).optional(),
})
    .strict();
export const RecipesRecordSchema = z.record(z.string(), RecipeSchema);
