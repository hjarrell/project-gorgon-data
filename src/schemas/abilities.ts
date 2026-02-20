import { z } from 'zod';

// ============================================================
// Schemas
// ============================================================

export const AbilityAmmoKeywordSchema = z
  .object({
    Count: z.number().int(),
    ItemKeyword: z.string(),
  })
  .strict();

export const AbilityConditionalKeywordSchema = z
  .object({
    Keyword: z.string(),
    Default: z.boolean().optional(),
    EffectKeywordMustExist: z.string().optional(),
    EffectKeywordMustNotExist: z.string().optional(),
  })
  .strict();

export const AbilityCostSchema = z
  .object({
    Currency: z.string(),
    Price: z.number(),
  })
  .strict();

export const AbilityCasterRequirementSchema = z
  .object({
    T: z.string(),
    InteractionFlag: z.string().optional(),
    Item: z.string().optional(),
    Keyword: z.string().optional(),
    MaxCount: z.number().optional(),
    MinCount: z.number().optional(),
    Name: z.string().optional(),
  })
  .strict();

export const AbilityDoTSchema = z
  .object({
    DamagePerTick: z.number(),
    DamageType: z.string(),
    Duration: z.number(),
    NumTicks: z.number().int(),
    AttributesThatDelta: z.array(z.string()).optional(),
    AttributesThatMod: z.array(z.string()).optional(),
    Preface: z.string().optional(),
    SpecialRules: z.array(z.string()).optional(),
  })
  .strict();

export const AbilitySpecialValueSchema = z
  .object({
    Label: z.string(),
    Suffix: z.string(),
    Value: z.number(),
    AttributesThatDelta: z.array(z.string()).optional(),
    AttributesThatDeltaBase: z.array(z.string()).optional(),
    AttributesThatMod: z.array(z.string()).optional(),
    DisplayType: z.string().optional(),
    SkipIfThisAttributeIsZero: z.string().optional(),
    SkipIfZero: z.boolean().optional(),
  })
  .strict();

export const AbilityPvESchema = z
  .object({
    PowerCost: z.number(),
    Range: z.number(),
    Accuracy: z.number().optional(),
    AoE: z.number().optional(),
    ArmorMitigationRatio: z.number().optional(),
    ArmorSpecificDamage: z.number().optional(),
    AttributesThatDeltaAccuracy: z.array(z.string()).optional(),
    AttributesThatDeltaAoE: z.array(z.string()).optional(),
    AttributesThatDeltaDamage: z.array(z.string()).optional(),
    AttributesThatDeltaDamageIfTargetIsVulnerable: z
      .array(z.string())
      .optional(),
    AttributesThatDeltaRage: z.array(z.string()).optional(),
    AttributesThatDeltaRange: z.array(z.string()).optional(),
    AttributesThatDeltaTaunt: z.array(z.string()).optional(),
    AttributesThatDeltaTempTaunt: z.array(z.string()).optional(),
    AttributesThatModBaseDamage: z.array(z.string()).optional(),
    AttributesThatModCritDamage: z.array(z.string()).optional(),
    AttributesThatModDamage: z.array(z.string()).optional(),
    AttributesThatModRage: z.array(z.string()).optional(),
    AttributesThatModTaunt: z.array(z.string()).optional(),
    CritDamageMod: z.number().optional(),
    Damage: z.number().optional(),
    DoTs: z.array(AbilityDoTSchema).optional(),
    ExtraDamageIfTargetVulnerable: z.number().optional(),
    HealthSpecificDamage: z.number().optional(),
    RageBoost: z.number().optional(),
    RageCost: z.number().optional(),
    RageCostMod: z.number().optional(),
    RageMultiplier: z.number().optional(),
    SpecialValues: z.array(AbilitySpecialValueSchema).optional(),
    TauntDelta: z.number().optional(),
    TauntMod: z.number().optional(),
    TempTauntDelta: z.number().optional(),
  })
  .strict();

export const AbilitySchema = z
  .object({
    // Required fields
    Animation: z.string(),
    DamageType: z.string(),
    Description: z.string(),
    IconID: z.number().int(),
    InternalName: z.string(),
    Level: z.number().int(),
    Name: z.string(),
    PvE: AbilityPvESchema,
    ResetTime: z.number(),
    Skill: z.string(),
    Target: z.string(),
    // Optional fields
    AbilityGroup: z.string().optional(),
    AbilityGroupName: z.string().optional(),
    AmmoConsumeChance: z.number().optional(),
    AmmoDescription: z.string().optional(),
    AmmoKeywords: z.array(AbilityAmmoKeywordSchema).optional(),
    AmmoStickChance: z.number().optional(),
    AoEIsCenteredOnCaster: z.boolean().optional(),
    AttributeThatPreventsDelayLoopAbortOnAttacked: z.string().optional(),
    AttributesThatDeltaCritChance: z.array(z.string()).optional(),
    AttributesThatDeltaDelayLoopTime: z.array(z.string()).optional(),
    AttributesThatDeltaPowerCost: z.array(z.string()).optional(),
    AttributesThatDeltaResetTime: z.array(z.string()).optional(),
    AttributesThatDeltaWorksWhileStunned: z.array(z.string()).optional(),
    AttributesThatModAmmoConsumeChance: z.array(z.string()).optional(),
    AttributesThatModPowerCost: z.array(z.string()).optional(),
    CanBeOnSidebar: z.boolean().optional(),
    CanSuppressMonsterShout: z.boolean().optional(),
    CanTargetUntargetableEnemies: z.boolean().optional(),
    CausesOfDeath: z.array(z.string()).optional(),
    CombatRefreshBaseAmount: z.number().optional(),
    ConditionalKeywords: z.array(AbilityConditionalKeywordSchema).optional(),
    Costs: z.array(AbilityCostSchema).optional(),
    DelayLoopIsAbortedIfAttacked: z.boolean().optional(),
    DelayLoopIsOnlyUsedInCombat: z.boolean().optional(),
    DelayLoopMessage: z.string().optional(),
    DelayLoopTime: z.number().optional(),
    EffectKeywordReqErrorMessage: z.string().optional(),
    EffectKeywordReqs: z.array(z.string()).optional(),
    EffectKeywordsIndicatingEnabled: z.array(z.string()).optional(),
    ExtraKeywordsForTooltips: z.array(z.string()).optional(),
    IgnoreEffectErrors: z.boolean().optional(),
    InternalAbility: z.boolean().optional(),
    InventoryKeywordReqErrorMessage: z.string().optional(),
    InventoryKeywordReqs: z.array(z.string()).optional(),
    IsCosmeticPet: z.boolean().optional(),
    IsHarmless: z.boolean().optional(),
    IsTimerResetWhenDisabling: z.boolean().optional(),
    ItemKeywordReqErrorMessage: z.string().optional(),
    ItemKeywordReqs: z.array(z.string()).optional(),
    Keywords: z.array(z.string()).optional(),
    PetTypeTagReq: z.string().optional(),
    PetTypeTagReqMax: z.number().optional(),
    Prerequisite: z.string().optional(),
    Projectile: z.string().optional(),
    Rank: z.string().optional(),
    SelfParticle: z.string().optional(),
    SelfPreParticle: z.string().optional(),
    SharesResetTimerWith: z.string().optional(),
    SpecialCasterRequirements: z
      .union([
        AbilityCasterRequirementSchema,
        z.array(AbilityCasterRequirementSchema),
      ])
      .optional(),
    SpecialCasterRequirementsErrorMessage: z.string().optional(),
    SpecialInfo: z.string().optional(),
    SpecialTargetingTypeReq: z.number().optional(),
    TargetEffectKeywordReq: z.string().optional(),
    TargetParticle: z.string().optional(),
    TargetTypeTagReq: z.string().optional(),
    UpgradeOf: z.string().optional(),
    WorksInCombat: z.boolean().optional(),
    WorksUnderwater: z.boolean().optional(),
    WorksWhileFalling: z.boolean().optional(),
    WorksWhileMounted: z.boolean().optional(),
    WorksWhileStunned: z.boolean().optional(),
  })
  .strict();

export const AbilitiesRecordSchema = z.record(z.string(), AbilitySchema);

// ============================================================
// Types (inferred from schemas)
// ============================================================

export type AbilityAmmoKeyword = z.infer<typeof AbilityAmmoKeywordSchema>;
export type AbilityConditionalKeyword = z.infer<
  typeof AbilityConditionalKeywordSchema
>;
export type AbilityCost = z.infer<typeof AbilityCostSchema>;
export type AbilityCasterRequirement = z.infer<
  typeof AbilityCasterRequirementSchema
>;
export type AbilityDoT = z.infer<typeof AbilityDoTSchema>;
export type AbilitySpecialValue = z.infer<typeof AbilitySpecialValueSchema>;
export type AbilityPvE = z.infer<typeof AbilityPvESchema>;
export type Ability = z.infer<typeof AbilitySchema>;
export type AbilitiesRecord = z.infer<typeof AbilitiesRecordSchema>;
