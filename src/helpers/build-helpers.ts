import type { Ability } from '../schemas/abilities';
import type { TsysPower, TsysTier } from '../schemas/tsysclientinfo';
import type { AbilityKeywordEntry } from '../schemas/abilitykeywords';
import type { AbilityDynamicDoT } from '../schemas/abilitydynamicdots';

// ── Constants ────────────────────────────────────────

export type GearSlot =
  | 'Head'
  | 'Chest'
  | 'Legs'
  | 'Hands'
  | 'Feet'
  | 'MainHand'
  | 'OffHand'
  | 'Necklace'
  | 'Ring';

export const GEAR_SLOTS: GearSlot[] = [
  'Head',
  'Chest',
  'Legs',
  'Hands',
  'Feet',
  'MainHand',
  'OffHand',
  'Necklace',
  'Ring',
];

export type Rarity =
  | 'Common'
  | 'Uncommon'
  | 'Rare'
  | 'Epic'
  | 'Exceptional'
  | 'Legendary';

export const RARITIES: Rarity[] = [
  'Common',
  'Uncommon',
  'Rare',
  'Epic',
  'Exceptional',
  'Legendary',
];

export const RARITY_MOD_SLOTS: Record<Rarity, number> = {
  Common: 0,
  Uncommon: 1,
  Rare: 2,
  Epic: 3,
  Exceptional: 4,
  Legendary: 5,
};

const RARITY_ORDER: Record<string, number> = {
  Common: 0,
  Uncommon: 1,
  Rare: 2,
  Epic: 3,
  Exceptional: 4,
  Legendary: 5,
};

export const GEAR_SLOT_LABELS: Record<GearSlot, string> = {
  Head: 'Head',
  Chest: 'Chest',
  Legs: 'Legs',
  Hands: 'Hands',
  Feet: 'Feet',
  MainHand: 'Main Hand',
  OffHand: 'Off Hand',
  Necklace: 'Necklace',
  Ring: 'Ring',
};

// ── Types ────────────────────────────────────────────

export type ModAssignment = 'skill1' | 'skill2' | 'neutral';

export interface ParsedEffect {
  attribute: string;
  value: number;
}

export interface UnparsedEffect {
  raw: string;
}

export type EffectDesc = ParsedEffect | UnparsedEffect;

export interface ModSelection {
  powerId: string;
  tierId: string;
  assignment: ModAssignment;
}

export interface GearSlotConfig {
  slot: GearSlot;
  rarity: Rarity;
  mods: ModSelection[];
}

export interface DamageContribution {
  powerId: string;
  tierId: string;
  attribute: string;
  value: number;
  type: 'delta' | 'mod';
  slot: GearSlot;
}

export interface DoTDamageResult {
  damageType: string;
  baseTotalDamage: number;
  modifiedTotalDamage: number;
  baseDamagePerTick: number;
  numTicks: number;
  duration: number;
  flatBonusPerTick: number;
  percentMod: number;
  contributions: DamageContribution[];
}

export interface StatResult {
  base: number;
  flatBonus: number;
  percentMod: number;
  modified: number;
  contributions: DamageContribution[];
}

export interface CritResult {
  baseCritDamageMod: number;
  critDamageModBonus: number;
  modifiedCritDamageMod: number;
  critChanceBonus: number;
  contributions: DamageContribution[];
}

export interface SpecialValueResult {
  label: string;
  suffix: string;
  base: number;
  modified: number;
  flatBonus: number;
  percentMod: number;
  contributions: DamageContribution[];
  skipIfZero: boolean;
}

export interface RestoreResult {
  value: number;
  resourceType: string;
  powerId: string;
  slot: GearSlot;
}

export interface DamageResult {
  baseDamage: number;
  flatBonus: number;
  percentMod: number;
  modifiedDamage: number;
  contributions: DamageContribution[];
  dots: DoTDamageResult[];
  // Extended stat results
  crit: CritResult;
  rage: StatResult;
  taunt: StatResult;
  tempTaunt: StatResult;
  powerCost: StatResult;
  resetTime: StatResult;
  range: StatResult;
  aoe: StatResult | null;
  accuracy: StatResult | null;
  vulnerableDamage: StatResult | null;
  specialValues: SpecialValueResult[];
  restores: RestoreResult[];
}

export interface AttributeBucket {
  deltaAttributes: Set<string>;
  modAttributes: Set<string>;
}

export interface SpecialValueAttributes {
  label: string;
  suffix: string;
  baseValue: number;
  deltaAttributes: Set<string>;
  modAttributes: Set<string>;
  skipIfZero: boolean;
}

export interface AbilityAttributes {
  deltaAttributes: Set<string>;
  modAttributes: Set<string>;
  dotAttributes: {
    deltaAttributes: Set<string>;
    modAttributes: Set<string>;
    damageType: string;
    damagePerTick: number;
    numTicks: number;
    duration: number;
  }[];
  // Extended stat buckets
  baseDamageMod: AttributeBucket;
  critChance: AttributeBucket;
  critDamage: AttributeBucket;
  rage: AttributeBucket;
  taunt: AttributeBucket;
  tempTaunt: AttributeBucket;
  powerCost: AttributeBucket;
  resetTime: AttributeBucket;
  range: AttributeBucket;
  aoe: AttributeBucket;
  accuracy: AttributeBucket;
  vulnerableDamage: AttributeBucket;
  specialValues: SpecialValueAttributes[];
}

export interface EquippedEffect {
  effect: ParsedEffect;
  powerId: string;
  tierId: string;
  slot: GearSlot;
}

// ── Effect Parsing ───────────────────────────────────

const PARSEABLE_EFFECT_RE = /^\{([A-Z_0-9]+)\}\{(-?[\d.]+)\}$/;
const THREE_PART_EFFECT_RE = /^\{([A-Z_0-9]+)\}\{(-?[\d.]+)\}\{(\w+)\}$/;

export function parseEffectDesc(desc: string): EffectDesc {
  const match2 = desc.match(PARSEABLE_EFFECT_RE);
  if (match2) {
    return { attribute: match2[1], value: parseFloat(match2[2]) };
  }
  const match3 = desc.match(THREE_PART_EFFECT_RE);
  if (match3) {
    // 3-part format: {ATTR}{VALUE}{CONTEXT} — context is metadata only
    return { attribute: match3[1], value: parseFloat(match3[2]) };
  }
  return { raw: desc };
}

export function isParsedEffect(e: EffectDesc): e is ParsedEffect {
  return 'attribute' in e;
}

export function parseTierEffects(tier: TsysTier): {
  parsed: ParsedEffect[];
  unparsed: UnparsedEffect[];
} {
  const parsed: ParsedEffect[] = [];
  const unparsed: UnparsedEffect[] = [];
  for (const desc of tier.EffectDescs) {
    const result = parseEffectDesc(desc);
    if (isParsedEffect(result)) parsed.push(result);
    else unparsed.push(result);
  }
  return { parsed, unparsed };
}

// ── Mod Filtering ────────────────────────────────────

export function getAvailablePowers(
  slot: GearSlot,
  skill: string | null,
  tsysClientInfo: Map<string, TsysPower>,
): Map<string, TsysPower> {
  const result = new Map<string, TsysPower>();
  const targetSkill = skill ?? 'AnySkill';

  for (const [powerId, power] of tsysClientInfo) {
    if (power.IsUnavailable) continue;
    if (!power.Slots.includes(slot)) continue;
    if (targetSkill === 'AnySkill') {
      if (power.Skill === 'AnySkill') result.set(powerId, power);
    } else {
      if (power.Skill === targetSkill) result.set(powerId, power);
    }
  }
  return result;
}

export function getAvailableTiers(
  power: TsysPower,
  rarity: Rarity,
): [string, TsysTier][] {
  const rarityIdx = RARITY_ORDER[rarity] ?? 0;

  return Object.entries(power.Tiers)
    .filter(([, tier]) => {
      const tierRarityIdx = RARITY_ORDER[tier.MinRarity] ?? 0;
      return tierRarityIdx <= rarityIdx;
    })
    .sort(
      ([, a], [, b]) => a.SkillLevelPrereq - b.SkillLevelPrereq,
    );
}

// ── Helpers ──────────────────────────────────────────

function createEmptyBucket(): AttributeBucket {
  return { deltaAttributes: new Set(), modAttributes: new Set() };
}

function addToBucket(bucket: AttributeBucket, deltas?: string[], mods?: string[]): void {
  if (deltas) for (const attr of deltas) bucket.deltaAttributes.add(attr);
  if (mods) for (const attr of mods) bucket.modAttributes.add(attr);
}

export function calculateStat(
  base: number,
  bucket: AttributeBucket,
  equippedEffects: EquippedEffect[],
): StatResult {
  let flatBonus = 0;
  let percentMod = 0;
  const contributions: DamageContribution[] = [];

  for (const { effect, powerId, tierId, slot } of equippedEffects) {
    if (bucket.deltaAttributes.has(effect.attribute)) {
      flatBonus += effect.value;
      contributions.push({ powerId, tierId, attribute: effect.attribute, value: effect.value, type: 'delta', slot });
    }
    if (bucket.modAttributes.has(effect.attribute)) {
      percentMod += effect.value;
      contributions.push({ powerId, tierId, attribute: effect.attribute, value: effect.value, type: 'mod', slot });
    }
  }

  const modified = base * (1 + percentMod) + flatBonus;
  return { base, flatBonus, percentMod, modified, contributions };
}

// ── Internal Ability Keyword Map ─────────────────────

/**
 * Build a map from BOOST_ABILITY_* attribute → keywords from internal abilities.
 * Internal abilities (e.g., Song of Discord tick abilities) have keywords like
 * "Burst" and "Attack" that affect dynamic DoT eligibility but aren't on the
 * player-facing ability. Call once at startup, pass to collectAbilityAttributes.
 */
export function buildInternalKeywordMap(
  allAbilities: Map<string, Ability>,
): Map<string, Set<string>> {
  const map = new Map<string, Set<string>>();
  for (const ability of allAbilities.values()) {
    if (!ability.InternalAbility) continue;
    const attrs = ability.PvE?.AttributesThatDeltaDamage ?? [];
    const keywords = ability.Keywords ?? [];
    if (keywords.length === 0) continue;
    for (const attr of attrs) {
      if (!attr.startsWith('BOOST_ABILITY_')) continue;
      let set = map.get(attr);
      if (!set) {
        set = new Set<string>();
        map.set(attr, set);
      }
      for (const kw of keywords) set.add(kw);
    }
  }
  return map;
}

// ── Ability Attribute Collection ─────────────────────

export function collectAbilityAttributes(
  ability: Ability,
  keywordEntries: AbilityKeywordEntry[],
  activeSkills: string[] = [],
  dynamicDots: AbilityDynamicDoT[] = [],
  internalKeywordMap?: Map<string, Set<string>>,
): AbilityAttributes {
  const deltaAttributes = new Set<string>();
  const modAttributes = new Set<string>();

  // Direct PvE root-level damage attributes
  if (ability.PvE.AttributesThatDeltaDamage) {
    for (const attr of ability.PvE.AttributesThatDeltaDamage)
      deltaAttributes.add(attr);
  }
  if (ability.PvE.AttributesThatModDamage) {
    for (const attr of ability.PvE.AttributesThatModDamage)
      modAttributes.add(attr);
  }

  // Initialize extended stat buckets
  const baseDamageMod = createEmptyBucket();
  const critChance = createEmptyBucket();
  const critDamage = createEmptyBucket();
  const rage = createEmptyBucket();
  const taunt = createEmptyBucket();
  const tempTaunt = createEmptyBucket();
  const powerCost = createEmptyBucket();
  const resetTime = createEmptyBucket();
  const range = createEmptyBucket();
  const aoe = createEmptyBucket();
  const accuracy = createEmptyBucket();
  const vulnerableDamage = createEmptyBucket();

  // PvE-level attribute arrays
  addToBucket(baseDamageMod, undefined, ability.PvE.AttributesThatModBaseDamage);
  addToBucket(critDamage, undefined, ability.PvE.AttributesThatModCritDamage);
  addToBucket(rage, ability.PvE.AttributesThatDeltaRage, ability.PvE.AttributesThatModRage);
  addToBucket(taunt, ability.PvE.AttributesThatDeltaTaunt, ability.PvE.AttributesThatModTaunt);
  addToBucket(tempTaunt, ability.PvE.AttributesThatDeltaTempTaunt);
  addToBucket(range, ability.PvE.AttributesThatDeltaRange);
  addToBucket(aoe, ability.PvE.AttributesThatDeltaAoE);
  addToBucket(accuracy, ability.PvE.AttributesThatDeltaAccuracy);
  addToBucket(vulnerableDamage, ability.PvE.AttributesThatDeltaDamageIfTargetIsVulnerable);

  // Ability root-level attribute arrays
  addToBucket(critChance, ability.AttributesThatDeltaCritChance);
  addToBucket(powerCost, ability.AttributesThatDeltaPowerCost, ability.AttributesThatModPowerCost);
  addToBucket(resetTime, ability.AttributesThatDeltaResetTime);

  // Keyword-derived attributes
  const abilityKeywords = new Set(ability.Keywords ?? []);

  for (const entry of keywordEntries) {
    const allRequired = entry.MustHaveAbilityKeywords.every((k) =>
      abilityKeywords.has(k),
    );
    if (!allRequired) continue;

    if (entry.MustNotHaveAbilityKeywords) {
      const hasExcluded = entry.MustNotHaveAbilityKeywords.some((k) =>
        abilityKeywords.has(k),
      );
      if (hasExcluded) continue;
    }

    // Damage (existing)
    if (entry.AttributesThatDeltaDamage) {
      for (const attr of entry.AttributesThatDeltaDamage)
        deltaAttributes.add(attr);
    }
    if (entry.AttributesThatModDamage) {
      for (const attr of entry.AttributesThatModDamage)
        modAttributes.add(attr);
    }

    // Extended buckets from keywords
    addToBucket(critChance, entry.AttributesThatDeltaCritChance);
    addToBucket(critDamage, undefined, entry.AttributesThatModCritDamage);
    addToBucket(powerCost, entry.AttributesThatDeltaPowerCost);
    addToBucket(resetTime, entry.AttributesThatDeltaResetTime);
    addToBucket(range, entry.AttributesThatDeltaRange);
    addToBucket(accuracy, entry.AttributesThatDeltaAccuracy);
  }

  // DoT-specific attributes
  const dotAttributes: AbilityAttributes['dotAttributes'] = [];
  if (ability.PvE.DoTs) {
    for (const dot of ability.PvE.DoTs) {
      const dotDelta = new Set<string>();
      const dotMod = new Set<string>();
      if (dot.AttributesThatDelta) {
        for (const attr of dot.AttributesThatDelta) dotDelta.add(attr);
      }
      if (dot.AttributesThatMod) {
        for (const attr of dot.AttributesThatMod) dotMod.add(attr);
      }
      dotAttributes.push({
        deltaAttributes: dotDelta,
        modAttributes: dotMod,
        damageType: dot.DamageType,
        damagePerTick: dot.DamagePerTick,
        numTicks: dot.NumTicks,
        duration: dot.Duration,
      });
    }
  }

  // Dynamic DoTs (from abilitydynamicdots.json)
  // Expand keywords for dynamic DoT matching: internal abilities (e.g., Song of
  // Discord tick abilities) may have keywords like "Burst" that the player-facing
  // ability lacks. Link them via shared BOOST_ABILITY_* attributes on DoTs.
  const dynDotKeywords = new Set(abilityKeywords);
  if (internalKeywordMap) {
    for (const dotAttr of dotAttributes) {
      for (const attr of dotAttr.deltaAttributes) {
        const extra = internalKeywordMap.get(attr);
        if (extra) for (const kw of extra) dynDotKeywords.add(kw);
      }
    }
    for (const attr of deltaAttributes) {
      const extra = internalKeywordMap.get(attr);
      if (extra) for (const kw of extra) dynDotKeywords.add(kw);
    }
  }

  const activeSkillSet = new Set(activeSkills);
  for (const dynDot of dynamicDots) {
    if (!activeSkillSet.has(dynDot.ReqActiveSkill)) continue;
    const hasAllKeywords = dynDot.ReqAbilityKeywords.every((k) =>
      dynDotKeywords.has(k),
    );
    if (!hasAllKeywords) continue;

    const dotDelta = new Set<string>();
    for (const attr of dynDot.AttributesThatDelta) dotDelta.add(attr);
    dotAttributes.push({
      deltaAttributes: dotDelta,
      modAttributes: new Set<string>(),
      damageType: dynDot.DamageType,
      damagePerTick: dynDot.DamagePerTick,
      numTicks: dynDot.NumTicks,
      duration: dynDot.Duration,
    });
  }

  // SpecialValues
  const specialValues: SpecialValueAttributes[] = [];
  if (ability.PvE.SpecialValues) {
    for (const sv of ability.PvE.SpecialValues) {
      const svDelta = new Set<string>();
      const svMod = new Set<string>();
      if (sv.AttributesThatDelta) {
        for (const attr of sv.AttributesThatDelta) svDelta.add(attr);
      }
      if (sv.AttributesThatDeltaBase) {
        for (const attr of sv.AttributesThatDeltaBase) svDelta.add(attr);
      }
      if (sv.AttributesThatMod) {
        for (const attr of sv.AttributesThatMod) svMod.add(attr);
      }
      specialValues.push({
        label: sv.Label,
        suffix: sv.Suffix,
        baseValue: sv.Value,
        deltaAttributes: svDelta,
        modAttributes: svMod,
        skipIfZero: sv.SkipIfZero ?? false,
      });
    }
  }

  // Damage-type mods (e.g. MOD_NATURE_DIRECT, MOD_FIRE_INDIRECT)
  // These apply globally based on the damage type of the ability/DoT,
  // not per-ability attribute lists.
  const dmgType = ability.DamageType?.toUpperCase();
  if (dmgType) {
    modAttributes.add(`MOD_${dmgType}_DIRECT`);
  }
  modAttributes.add('MOD_UNIVERSAL_DIRECT');

  for (const dotAttr of dotAttributes) {
    const dotType = dotAttr.damageType?.toUpperCase();
    if (dotType) {
      dotAttr.modAttributes.add(`MOD_${dotType}_INDIRECT`);
    }
    dotAttr.modAttributes.add('MOD_UNIVERSAL_INDIRECT');
  }

  return {
    deltaAttributes,
    modAttributes,
    dotAttributes,
    baseDamageMod,
    critChance,
    critDamage,
    rage,
    taunt,
    tempTaunt,
    powerCost,
    resetTime,
    range,
    aoe,
    accuracy,
    vulnerableDamage,
    specialValues,
  };
}

// ── Damage Calculation ───────────────────────────────

export function calculateAbilityDamage(
  ability: Ability,
  abilityAttrs: AbilityAttributes,
  equippedEffects: EquippedEffect[],
  textEffects: TextEffect[] = [],
): DamageResult {
  const baseDamage = ability.PvE.Damage ?? 0;
  let flatBonus = 0;
  let percentMod = 0;
  const contributions: DamageContribution[] = [];

  // Base damage mod (modifies base before other % mods)
  const baseDamageModResult = calculateStat(0, abilityAttrs.baseDamageMod, equippedEffects);
  const modifiedBase = baseDamage * (1 + baseDamageModResult.percentMod) + baseDamageModResult.flatBonus;

  // Direct damage modifications
  for (const { effect, powerId, tierId, slot } of equippedEffects) {
    if (abilityAttrs.deltaAttributes.has(effect.attribute)) {
      flatBonus += effect.value;
      contributions.push({
        powerId,
        tierId,
        attribute: effect.attribute,
        value: effect.value,
        type: 'delta',
        slot,
      });
    }
    if (abilityAttrs.modAttributes.has(effect.attribute)) {
      percentMod += effect.value;
      contributions.push({
        powerId,
        tierId,
        attribute: effect.attribute,
        value: effect.value,
        type: 'mod',
        slot,
      });
    }
  }

  const modifiedDamage = modifiedBase * (1 + percentMod) + flatBonus;

  // DoT damage modifications
  const dots: DoTDamageResult[] = [];
  for (const dotAttr of abilityAttrs.dotAttributes) {
    let dotFlatPerTick = 0;
    let dotPercentMod = 0;
    const dotContribs: DamageContribution[] = [];

    for (const { effect, powerId, tierId, slot } of equippedEffects) {
      if (dotAttr.deltaAttributes.has(effect.attribute)) {
        dotFlatPerTick += effect.value;
        dotContribs.push({
          powerId,
          tierId,
          attribute: effect.attribute,
          value: effect.value,
          type: 'delta',
          slot,
        });
      }
      if (dotAttr.modAttributes.has(effect.attribute)) {
        dotPercentMod += effect.value;
        dotContribs.push({
          powerId,
          tierId,
          attribute: effect.attribute,
          value: effect.value,
          type: 'mod',
          slot,
        });
      }
    }

    const baseTotalDamage = dotAttr.damagePerTick * dotAttr.numTicks;
    const modifiedPerTick =
      dotAttr.damagePerTick * (1 + dotPercentMod) + dotFlatPerTick;
    const modifiedTotalDamage = modifiedPerTick * dotAttr.numTicks;

    dots.push({
      damageType: dotAttr.damageType,
      baseTotalDamage,
      modifiedTotalDamage,
      baseDamagePerTick: dotAttr.damagePerTick,
      numTicks: dotAttr.numTicks,
      duration: dotAttr.duration,
      flatBonusPerTick: dotFlatPerTick,
      percentMod: dotPercentMod,
      contributions: dotContribs,
    });
  }

  // Crit
  const baseCritDamageMod = ability.PvE.CritDamageMod ?? 0;
  const critDamageResult = calculateStat(baseCritDamageMod, abilityAttrs.critDamage, equippedEffects);
  const critChanceResult = calculateStat(0, abilityAttrs.critChance, equippedEffects);
  const crit: CritResult = {
    baseCritDamageMod,
    critDamageModBonus: critDamageResult.flatBonus + critDamageResult.percentMod * baseCritDamageMod,
    modifiedCritDamageMod: critDamageResult.modified,
    critChanceBonus: critChanceResult.flatBonus,
    contributions: [...critDamageResult.contributions, ...critChanceResult.contributions],
  };

  // Rage
  const rageResult = calculateStat(
    ability.PvE.RageBoost ?? 0,
    abilityAttrs.rage,
    equippedEffects,
  );

  // Taunt
  const tauntResult = calculateStat(
    ability.PvE.TauntDelta ?? 0,
    abilityAttrs.taunt,
    equippedEffects,
  );

  // Temp Taunt
  const tempTauntResult = calculateStat(
    ability.PvE.TempTauntDelta ?? 0,
    abilityAttrs.tempTaunt,
    equippedEffects,
  );

  // Power Cost
  const powerCostResult = calculateStat(
    ability.PvE.PowerCost,
    abilityAttrs.powerCost,
    equippedEffects,
  );

  // Reset Time (cooldown)
  const resetTimeResult = calculateStat(
    ability.ResetTime,
    abilityAttrs.resetTime,
    equippedEffects,
  );

  // Range
  const rangeResult = calculateStat(
    ability.PvE.Range,
    abilityAttrs.range,
    equippedEffects,
  );

  // AoE
  const aoeResult = ability.PvE.AoE != null
    ? calculateStat(ability.PvE.AoE, abilityAttrs.aoe, equippedEffects)
    : null;

  // Accuracy
  const accuracyResult = ability.PvE.Accuracy != null
    ? calculateStat(ability.PvE.Accuracy, abilityAttrs.accuracy, equippedEffects)
    : null;

  // Vulnerable damage
  const vulnResult = ability.PvE.ExtraDamageIfTargetVulnerable != null
    ? calculateStat(ability.PvE.ExtraDamageIfTargetVulnerable, abilityAttrs.vulnerableDamage, equippedEffects)
    : null;

  // Special Values
  const specialValues: SpecialValueResult[] = abilityAttrs.specialValues.map((sv) => {
    const result = calculateStat(sv.baseValue, sv, equippedEffects);
    return {
      label: sv.label,
      suffix: sv.suffix,
      base: sv.baseValue,
      modified: result.modified,
      flatBonus: result.flatBonus,
      percentMod: result.percentMod,
      contributions: result.contributions,
      skipIfZero: sv.skipIfZero,
    };
  });

  // Apply text effects (parsed from English-text mod descriptions)
  const textResult = applyTextEffects(ability, textEffects);
  const totalFlatBonus = flatBonus + textResult.flatBonus;
  const totalPercentMod = percentMod + textResult.percentMod;
  const finalModifiedDamage = modifiedBase * (1 + totalPercentMod) + totalFlatBonus;
  const allContributions = [...baseDamageModResult.contributions, ...contributions, ...textResult.contributions];
  const allDots = [...dots, ...textResult.dots];

  return {
    baseDamage,
    flatBonus: totalFlatBonus,
    percentMod: totalPercentMod,
    modifiedDamage: finalModifiedDamage,
    contributions: allContributions,
    dots: allDots,
    crit,
    rage: rageResult,
    taunt: tauntResult,
    tempTaunt: tempTauntResult,
    powerCost: powerCostResult,
    resetTime: resetTimeResult,
    range: rangeResult,
    aoe: aoeResult,
    accuracy: accuracyResult,
    vulnerableDamage: vulnResult,
    specialValues,
    restores: textResult.restores,
  };
}

// ── Ability Filtering ────────────────────────────────

export function getCombatAbilities(
  skill: string,
  abilities: Map<string, Ability>,
  maxLevel?: number,
): Ability[] {
  // Group abilities by their upgrade root: all abilities sharing the same
  // UpgradeOf target (or standalone if they have no upgrade relationship)
  // keep only the highest-level version at or below maxLevel.
  const upgradeGroups = new Map<string, Ability>();

  const candidates: Ability[] = [];
  for (const ability of abilities.values()) {
    if (ability.Skill !== skill) continue;
    if (ability.InternalAbility) continue;
    if (ability.Keywords?.includes('Lint_MonsterAbility')) continue;
    if (ability.CanBeOnSidebar === false) continue;
    if (maxLevel !== undefined && ability.Level > maxLevel) continue;
    candidates.push(ability);
  }

  for (const ability of candidates) {
    const root = ability.UpgradeOf ?? ability.InternalName;
    const existing = upgradeGroups.get(root);
    if (!existing || ability.Level > existing.Level) {
      upgradeGroups.set(root, ability);
    }
  }

  const result = [...upgradeGroups.values()];
  result.sort((a, b) => a.Level - b.Level || a.Name.localeCompare(b.Name));
  return result;
}

// ── URL Hash Encoding/Decoding ───────────────────────

function powerNumFromId(powerId: string): string {
  return powerId.replace('power_', '');
}

function tierNumFromId(tierId: string): string {
  return tierId.replace('id_', '');
}

const ASSIGNMENT_CHARS: Record<ModAssignment, string> = {
  skill1: '1',
  skill2: '2',
  neutral: 'n',
};

const CHAR_TO_ASSIGNMENT: Record<string, ModAssignment> = {
  '1': 'skill1',
  '2': 'skill2',
  n: 'neutral',
};

const RARITY_CHARS: Record<Rarity, string> = {
  Common: '0',
  Uncommon: '1',
  Rare: '2',
  Epic: '3',
  Exceptional: '4',
  Legendary: '5',
};

const CHAR_TO_RARITY: Record<string, Rarity> = {
  '0': 'Common',
  '1': 'Uncommon',
  '2': 'Rare',
  '3': 'Epic',
  '4': 'Exceptional',
  '5': 'Legendary',
};

export interface BuildHashInput {
  skill1: string;
  skill2: string;
  slots: GearSlotConfig[];
  sidebar1?: string[];
  sidebar2?: string[];
  skill1Level?: number;
  skill2Level?: number;
}

export function encodeBuildToHash(input: BuildHashInput): string {
  const { skill1, skill2, slots, sidebar1, sidebar2, skill1Level, skill2Level } = input;
  const parts: string[] = [`${skill1},${skill2},${skill1Level ?? 50},${skill2Level ?? 50}`];

  for (const slotConfig of slots) {
    const modParts = slotConfig.mods
      .map((mod) => {
        const a = ASSIGNMENT_CHARS[mod.assignment];
        if (!mod.powerId || !mod.tierId) return a;
        return `${a}:${powerNumFromId(mod.powerId)}.${tierNumFromId(mod.tierId)}`;
      })
      .join(',');
    parts.push(
      `${RARITY_CHARS[slotConfig.rarity]}${modParts ? ',' + modParts : ''}`,
    );
  }

  // Sidebar abilities (after gear slots)
  parts.push(sidebar1?.join(',') ?? '');
  parts.push(sidebar2?.join(',') ?? '');

  return parts.join('|');
}

export interface DecodedBuild {
  skill1: string;
  skill2: string;
  slots: GearSlotConfig[];
  sidebar1: string[];
  sidebar2: string[];
  skill1Level: number;
  skill2Level: number;
}

export function decodeBuildFromHash(hash: string): DecodedBuild | null {
  try {
    const parts = hash.split('|');
    if (parts.length < 1) return null;

    const headerTokens = parts[0].split(',');
    const skill1 = headerTokens[0];
    const skill2 = headerTokens[1];
    if (!skill1 || !skill2) return null;
    const skill1Level = parseInt(headerTokens[2], 10) || 50;
    const skill2Level = parseInt(headerTokens[3], 10) || 50;

    const slots: GearSlotConfig[] = [];
    for (let i = 1; i < parts.length && i - 1 < GEAR_SLOTS.length; i++) {
      const slotPart = parts[i];
      const tokens = slotPart.split(',');
      const rarityChar = tokens[0];
      const rarity = CHAR_TO_RARITY[rarityChar] ?? 'Common';
      const slot = GEAR_SLOTS[i - 1];

      const mods: ModSelection[] = [];
      for (let j = 1; j < tokens.length; j++) {
        const token = tokens[j];
        const assignChar = token[0];
        const assignment = CHAR_TO_ASSIGNMENT[assignChar] ?? 'skill1';

        if (token.length > 1 && token[1] === ':') {
          const rest = token.slice(2);
          const [pNum, tNum] = rest.split('.');
          mods.push({
            powerId: `power_${pNum}`,
            tierId: `id_${tNum}`,
            assignment,
          });
        } else {
          mods.push({ powerId: '', tierId: '', assignment });
        }
      }

      slots.push({ slot, rarity, mods });
    }

    // Fill any missing slots with defaults
    while (slots.length < GEAR_SLOTS.length) {
      slots.push({
        slot: GEAR_SLOTS[slots.length],
        rarity: 'Common',
        mods: [],
      });
    }

    // Sidebar abilities (after gear slots: index 10 and 11)
    const sidebarIdx = GEAR_SLOTS.length + 1;
    const sidebar1 = parts[sidebarIdx]?.split(',').filter(Boolean) ?? [];
    const sidebar2 = parts[sidebarIdx + 1]?.split(',').filter(Boolean) ?? [];

    return { skill1, skill2, slots, sidebar1, sidebar2, skill1Level, skill2Level };
  } catch {
    return null;
  }
}

// ── Default Gear Config ──────────────────────────────

export function createDefaultGearSlots(): Map<GearSlot, GearSlotConfig> {
  return new Map(
    GEAR_SLOTS.map((slot) => [slot, { slot, rarity: 'Common' as Rarity, mods: [] }]),
  );
}

// ── Text Effect Parsing ─────────────────────────────

export type TextEffectType =
  | 'flatDamage'
  | 'percentDamage'
  | 'dot'
  | 'restore'
  | 'cooldownReduction'
  | 'costReduction'
  | 'conditional'
  | 'utility';

export interface TextEffect {
  type: TextEffectType;
  /** Ability names this effect targets (e.g. ["Blast of Fury"]) */
  abilityNames: string[];
  /** Skill name for "All X abilities" patterns */
  skillName?: string;
  /** Abilities excluded (e.g. "except Shillelagh") */
  exceptAbilities?: string[];
  value: number;
  damageType?: string;
  duration?: number;
  /** Human-readable condition if this is conditional */
  condition?: string;
  /** Original text (icon tags stripped) */
  raw: string;
  powerId: string;
  tierId: string;
  slot: GearSlot;
}

function stripIcons(text: string): string {
  return text.replace(/<icon=\d+>/g, '').trim();
}

/**
 * Parse ability names from comma/and-separated lists like:
 * "Finishing Blow and Decapitate", "Punch, Jab, and Infuriating Fist"
 */
function parseAbilityNameList(text: string): string[] {
  return text
    .split(/(?:,\s*(?:and\s+)?|\s+and\s+)/)
    .map((s) => s.trim())
    .filter(Boolean);
}

const CONDITIONAL_MARKERS = [
  'chance to',
  'if ',
  'when you',
  'when the',
  'whenever',
  'to targets with',
  'while stunned',
  'with less than',
  'with more than',
  'on critical',
  'that critically',
  'combo:',
  'next ',
  'for 20 second',
  'for 30 second',
  'for 60 second',
  'every 2 second',
  'every 3 second',
];

function hasCondition(text: string): string | undefined {
  const lower = text.toLowerCase();
  for (const marker of CONDITIONAL_MARKERS) {
    if (lower.includes(marker)) return text;
  }
  return undefined;
}

// Regex patterns ordered from most specific to least
const TEXT_PATTERNS: {
  regex: RegExp;
  parse: (m: RegExpMatchArray, raw: string) => Omit<TextEffect, 'powerId' | 'tierId' | 'slot'> | null;
}[] = [
  // "AbilityName deals +N DamageType damage over Ns" (DoT)
  {
    regex: /^(.+?) deals \+?(\d+) (\w+) damage (?:to health )?over (\d+) seconds?/i,
    parse: (m, raw) => ({
      type: 'dot',
      abilityNames: parseAbilityNameList(m[1]),
      value: parseInt(m[2]),
      damageType: m[3],
      duration: parseInt(m[4]),
      condition: hasCondition(raw),
      raw,
    }),
  },
  // "...ignites the target, dealing N DamageType damage over Ns" (DoT with prefix)
  {
    regex: /^(.+?) ignites .+?dealing (\d+) (\w+) damage over (\d+) seconds?/i,
    parse: (m, raw) => ({
      type: 'dot',
      abilityNames: parseAbilityNameList(m[1]),
      value: parseInt(m[2]),
      damageType: m[3],
      duration: parseInt(m[4]),
      condition: hasCondition(raw),
      raw,
    }),
  },
  // "AbilityName deals N Armor damage"
  {
    regex: /^(.+?) deals \+?(\d+) [Aa]rmor damage/i,
    parse: (m, raw) => ({
      type: 'flatDamage',
      abilityNames: parseAbilityNameList(m[1]),
      value: parseInt(m[2]),
      damageType: 'Armor',
      condition: hasCondition(raw),
      raw,
    }),
  },
  // "AbilityName deals +N% damage" (percent)
  {
    regex: /^(.+?) deals? \+?(\d+)% damage/i,
    parse: (m, raw) => ({
      type: 'percentDamage',
      abilityNames: parseAbilityNameList(m[1]),
      value: parseInt(m[2]) / 100,
      condition: hasCondition(raw),
      raw,
    }),
  },
  // "AbilityName deals +N damage" (flat)
  {
    regex: /^(.+?) deals \+?(\d+) damage/i,
    parse: (m, raw) => ({
      type: 'flatDamage',
      abilityNames: parseAbilityNameList(m[1]),
      value: parseInt(m[2]),
      condition: hasCondition(raw),
      raw,
    }),
  },
  // "AbilityName and AbilityName damage +N" or "AbilityName Damage +N"
  {
    regex: /^(.+?) [Dd]amage \+(\d+)/i,
    parse: (m, raw) => ({
      type: 'flatDamage',
      abilityNames: parseAbilityNameList(m[1]),
      value: parseInt(m[2]),
      condition: hasCondition(raw),
      raw,
    }),
  },
  // "All SkillName abilities deal +N% damage"
  {
    regex: /^All (\w+) (?:abilities|attacks) .+?deal \+?(\d+)% damage/i,
    parse: (m, raw) => ({
      type: 'percentDamage',
      abilityNames: [],
      skillName: m[1],
      value: parseInt(m[2]) / 100,
      condition: hasCondition(raw),
      raw,
    }),
  },
  // "All SkillName abilities deal +N damage"
  {
    regex: /^All (\w+) (?:abilities|attacks) .+?deal \+?(\d+) damage/i,
    parse: (m, raw) => ({
      type: 'flatDamage',
      abilityNames: [],
      skillName: m[1],
      value: parseInt(m[2]),
      condition: hasCondition(raw),
      raw,
    }),
  },
  // "All X abilities except Y have a N% chance to restore N Resource"
  {
    regex: /^All (\w+) abilities except (.+?) have .+?restore (\d+) (\w+)/i,
    parse: (m, raw) => ({
      type: 'restore',
      abilityNames: [],
      skillName: m[1],
      exceptAbilities: parseAbilityNameList(m[2]),
      value: parseInt(m[3]),
      damageType: m[4],
      condition: hasCondition(raw),
      raw,
    }),
  },
  // "All X abilities have a N% chance to restore N Resource"
  {
    regex: /^All (\w+) abilities have .+?restore (\d+) (\w+)/i,
    parse: (m, raw) => ({
      type: 'restore',
      abilityNames: [],
      skillName: m[1],
      value: parseInt(m[2]),
      damageType: m[3],
      condition: hasCondition(raw),
      raw,
    }),
  },
  // "AbilityName heals you for N health" or "restore N armor/health/power"
  {
    regex: /^(.+?) (?:heals? you for|restores?) (\d+) (\w+)/i,
    parse: (m, raw) => ({
      type: 'restore',
      abilityNames: parseAbilityNameList(m[1]),
      value: parseInt(m[2]),
      damageType: m[3],
      condition: hasCondition(raw),
      raw,
    }),
  },
  // "AbilityName Reuse Time is -N seconds"
  {
    regex: /^(.+?) [Rr]euse [Tt]ime (?:is )?-(\d+) seconds?/i,
    parse: (m, raw) => ({
      type: 'cooldownReduction',
      abilityNames: parseAbilityNameList(m[1]),
      value: parseInt(m[2]),
      raw,
    }),
  },
  // "All X Abilities cost -N Power"
  {
    regex: /^All (.+?) [Aa]bilities cost -(\d+) [Pp]ower/i,
    parse: (m, raw) => ({
      type: 'costReduction',
      abilityNames: [],
      skillName: m[1],
      value: parseInt(m[2]),
      raw,
    }),
  },
  // "boosts the DamageType damage of AbilityName +N"
  {
    regex: /boosts? the (\w+) damage of (.+?) \+(\d+)/i,
    parse: (m, raw) => ({
      type: 'flatDamage',
      abilityNames: parseAbilityNameList(m[2]),
      value: parseInt(m[3]),
      damageType: m[1],
      condition: hasCondition(raw),
      raw,
    }),
  },
];

/**
 * Parse a text effect description into structured data.
 * Returns null if the text doesn't match any known pattern.
 */
export function parseTextEffect(
  effectDesc: string,
  powerId: string,
  tierId: string,
  slot: GearSlot,
): TextEffect | null {
  const raw = stripIcons(effectDesc);

  for (const { regex, parse } of TEXT_PATTERNS) {
    const match = raw.match(regex);
    if (match) {
      const result = parse(match, raw);
      if (result) {
        return { ...result, powerId, tierId, slot };
      }
    }
  }

  return null;
}

/**
 * Check if a text effect applies to a given ability.
 */
export function textEffectMatchesAbility(
  effect: TextEffect,
  ability: Ability,
): boolean {
  // Match by ability name
  if (effect.abilityNames.length > 0) {
    const abilityNameLower = ability.Name.toLowerCase();
    const matched = effect.abilityNames.some(
      (n) => abilityNameLower === n.toLowerCase(),
    );
    if (matched) return true;
  }

  // Match by skill name (e.g. "All Druid abilities")
  if (effect.skillName) {
    if (ability.Skill.toLowerCase() === effect.skillName.toLowerCase()) {
      // Check except list
      if (effect.exceptAbilities?.some(
        (n) => ability.Name.toLowerCase() === n.toLowerCase(),
      )) {
        return false;
      }
      return true;
    }
  }

  return false;
}

/**
 * Apply matching text effects to an ability's damage result.
 * Returns additional flat bonus, percent mod, and dot contributions.
 */
export function applyTextEffects(
  ability: Ability,
  textEffects: TextEffect[],
): {
  flatBonus: number;
  percentMod: number;
  contributions: DamageContribution[];
  dots: DoTDamageResult[];
  restores: RestoreResult[];
} {
  let flatBonus = 0;
  let percentMod = 0;
  const contributions: DamageContribution[] = [];
  const dots: DoTDamageResult[] = [];
  const restores: RestoreResult[] = [];

  for (const te of textEffects) {
    if (!textEffectMatchesAbility(te, ability)) continue;

    switch (te.type) {
      case 'flatDamage': {
        // Conditional text effects get added but flagged
        flatBonus += te.value;
        contributions.push({
          powerId: te.powerId,
          tierId: te.tierId,
          attribute: te.condition ? `TEXT_CONDITIONAL` : `TEXT_FLAT`,
          value: te.value,
          type: 'delta',
          slot: te.slot,
        });
        break;
      }
      case 'percentDamage': {
        percentMod += te.value;
        contributions.push({
          powerId: te.powerId,
          tierId: te.tierId,
          attribute: te.condition ? `TEXT_CONDITIONAL` : `TEXT_PERCENT`,
          value: te.value,
          type: 'mod',
          slot: te.slot,
        });
        break;
      }
      case 'dot': {
        const numTicks = te.duration ? Math.max(1, Math.round(te.duration / 2)) : 1;
        const perTick = te.value / numTicks;
        dots.push({
          damageType: te.damageType ?? ability.DamageType,
          baseTotalDamage: 0,
          modifiedTotalDamage: te.value,
          baseDamagePerTick: perTick,
          numTicks,
          duration: te.duration ?? 0,
          flatBonusPerTick: perTick,
          percentMod: 0,
          contributions: [{
            powerId: te.powerId,
            tierId: te.tierId,
            attribute: 'TEXT_DOT',
            value: te.value,
            type: 'delta',
            slot: te.slot,
          }],
        });
        break;
      }
      case 'restore': {
        restores.push({
          value: te.value,
          resourceType: te.damageType ?? 'Health',
          powerId: te.powerId,
          slot: te.slot,
        });
        break;
      }
      // cooldownReduction, costReduction, conditional, utility — no damage calc impact for now
    }
  }

  return { flatBonus, percentMod, contributions, dots, restores };
}
