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

export interface DamageResult {
  baseDamage: number;
  flatBonus: number;
  percentMod: number;
  modifiedDamage: number;
  contributions: DamageContribution[];
  dots: DoTDamageResult[];
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
}

export interface EquippedEffect {
  effect: ParsedEffect;
  powerId: string;
  tierId: string;
  slot: GearSlot;
}

// ── Effect Parsing ───────────────────────────────────

const PARSEABLE_EFFECT_RE = /^\{([A-Z_0-9]+)\}\{(-?[\d.]+)\}$/;

export function parseEffectDesc(desc: string): EffectDesc {
  const match = desc.match(PARSEABLE_EFFECT_RE);
  if (match) {
    return { attribute: match[1], value: parseFloat(match[2]) };
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

// ── Ability Attribute Collection ─────────────────────

export function collectAbilityAttributes(
  ability: Ability,
  keywordEntries: AbilityKeywordEntry[],
  activeSkills: string[] = [],
  dynamicDots: AbilityDynamicDoT[] = [],
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

    if (entry.AttributesThatDeltaDamage) {
      for (const attr of entry.AttributesThatDeltaDamage)
        deltaAttributes.add(attr);
    }
    if (entry.AttributesThatModDamage) {
      for (const attr of entry.AttributesThatModDamage)
        modAttributes.add(attr);
    }
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
  const activeSkillSet = new Set(activeSkills);
  for (const dynDot of dynamicDots) {
    if (!activeSkillSet.has(dynDot.ReqActiveSkill)) continue;
    const hasAllKeywords = dynDot.ReqAbilityKeywords.every((k) =>
      abilityKeywords.has(k),
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

  return { deltaAttributes, modAttributes, dotAttributes };
}

// ── Damage Calculation ───────────────────────────────

export function calculateAbilityDamage(
  ability: Ability,
  abilityAttrs: AbilityAttributes,
  equippedEffects: EquippedEffect[],
): DamageResult {
  const baseDamage = ability.PvE.Damage ?? 0;
  let flatBonus = 0;
  let percentMod = 0;
  const contributions: DamageContribution[] = [];

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

  const modifiedDamage = baseDamage * (1 + percentMod) + flatBonus;

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

  return { baseDamage, flatBonus, percentMod, modifiedDamage, contributions, dots };
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
