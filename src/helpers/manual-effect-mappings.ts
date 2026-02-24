import type { ParsedEffect } from './build-helpers';

// ── Mapping Types ───────────────────────────────────

/** Flat delta to direct damage or existing DoT per-tick */
interface DeltaEffectMapping {
  type: 'delta';
  /** Regex with capture group 1 = numeric value */
  valuePattern: RegExp;
  /** Synthetic attribute name(s) to emit */
  attributes: string[];
  description: string;
}

/** DoT total damage → per-tick delta (text gives total, divide by numTicks) */
interface DotDeltaEffectMapping {
  type: 'dotDelta';
  valuePattern: RegExp;
  attribute: string;
  numTicks: number;
  description: string;
}

/** Adds a NEW dynamic DoT from abilitydynamicdots.json (Phase 2 wires these up) */
interface DynamicDotEffectMapping {
  type: 'dynamicDot';
  valuePattern: RegExp;
  attribute: string;
  numTicks: number;
  description: string;
}

/** Known effect but not yet calculable */
interface TodoEffectMapping {
  type: 'todo';
  description: string;
}

/** Explicitly non-damage (heal, mitigation, armor, utility) */
interface IgnoredEffectMapping {
  type: 'ignored';
  description: string;
}

export type ManualEffectMapping =
  | DeltaEffectMapping
  | DotDeltaEffectMapping
  | DynamicDotEffectMapping
  | TodoEffectMapping
  | IgnoredEffectMapping;

// ── Mapping Data ────────────────────────────────────

export const MANUAL_EFFECT_MAPPINGS: Record<string, ManualEffectMapping> = {
  // ── Bard ────────────────────────────────────────────

  // SongOfDiscordStun: "<icon=3665>Song of Discord deals +71 damage and has a 10% chance to stun each target every 2 seconds"
  // Song of Discord DoT: AttributesThatDelta: ["BOOST_ABILITY_SONGOFDISCORD", "BOOST_SKILL_BARD"], NumTicks=1
  power_17042: {
    type: 'delta',
    valuePattern: /deals \+(\d+) damage/,
    attributes: ['BOOST_ABILITY_SONGOFDISCORD'],
    description: 'Song of Discord flat damage per tick + stun chance',
  },

  // SongOfDiscordLowerRage: "<icon=3665>Song of Discord deals +5 damage and reduces targets' Rage by -10 every 2 seconds"
  power_17043: {
    type: 'delta',
    valuePattern: /deals \+(\d+) damage/,
    attributes: ['BOOST_ABILITY_SONGOFDISCORD'],
    description: 'Song of Discord flat damage per tick + rage reduction',
  },

  // SongOfDiscordCrit: "<icon=3665>Song of Discord has a 10% chance to deal +100% damage to each target every 2 seconds"
  power_17044: {
    type: 'todo',
    description: 'TODO_DESCRIPTION: Song of Discord crit chance on DoT ticks — needs crit damage model',
  },

  // SongOfDiscordBuffsBlasts: "<icon=3665>Every 2 seconds when Song of Discord damages an enemy, your Bardic Blast ability damage is boosted +1% for 30 seconds"
  power_17046: {
    type: 'todo',
    description: 'TODO_DESCRIPTION: Stacking % buff to Bardic Blast from Song of Discord ticks — needs stacking buff model',
  },

  // SongOfDiscordRageahol: "<icon=3665>Song of Discord deals +5% damage to targets with less than 33% of their Max Rage"
  power_17047: {
    type: 'todo',
    description: 'TODO_DESCRIPTION: Conditional % based on target rage threshold',
  },

  // BardPainYieldsArt: "<icon=108>Whenever you take damage from an enemy, your Bardic Blast abilities deal +5% damage for 20 seconds"
  power_17003: {
    type: 'todo',
    description: 'TODO_DESCRIPTION: Conditional % buff to Bardic Blast on taking damage',
  },

  // ── Archery ─────────────────────────────────────────

  // PoisonArrowDoT: "<icon=3301>Poison Arrow deals +600 Poison damage over 12 seconds"
  // Poison Arrow DoT: AttributesThatDelta: ["BOOST_ABILITYDOT_POISONARROW"], NumTicks=6, Duration=12
  power_10311: {
    type: 'dotDelta',
    valuePattern: /deals \+(\d+) Poison damage/,
    attribute: 'BOOST_ABILITYDOT_POISONARROW',
    numTicks: 6,
    description: 'Poison Arrow DoT total damage (÷6 ticks)',
  },

  // HookShotDoT: "<icon=3316>Hook Shot deals +18 Poison damage over 12 seconds"
  // Hook Shot DoT: AttributesThatDelta: ["BOOST_ABILITYDOT_HOOKSHOT"], NumTicks=6, Duration=12
  power_10554: {
    type: 'dotDelta',
    valuePattern: /deals \+(\d+) Poison damage/,
    attribute: 'BOOST_ABILITYDOT_HOOKSHOT',
    numTicks: 6,
    description: 'Hook Shot DoT total damage (÷6 ticks)',
  },

  // AimedShotDoT: "<icon=3315>Aimed Shot deals 12 Trauma damage to health over 12 seconds"
  // Aimed Shot DoT: AttributesThatDelta: ["BOOST_ABILITYDOT_AIMEDSHOT"], NumTicks=6, Duration=12
  // Note: no "+" in the text — absolute value
  power_10042: {
    type: 'dotDelta',
    valuePattern: /deals (\d+) Trauma damage/,
    attribute: 'BOOST_ABILITYDOT_AIMEDSHOT',
    numTicks: 6,
    description: 'Aimed Shot DoT total damage (÷6 ticks, no + in text)',
  },

  // ArcheryCritPoison: "<icon=108>Archery attacks that Critically Hit deal 30 Poison damage over 12 seconds..."
  // DoT: AttributesThatDelta: ["BOOST_ABILITYDOT_POISONARROW", "BOOST_ABILITYDOT_ARCHERYPOISONCRIT"], NumTicks=6
  power_10010: {
    type: 'dotDelta',
    valuePattern: /deal (\d+) Poison damage/,
    attribute: 'BOOST_ABILITYDOT_ARCHERYPOISONCRIT',
    numTicks: 6,
    description: 'Archery crit poison DoT total damage (÷6 ticks)',
  },

  // AimedAndBlitzShotHeal: "<icon=3315><icon=3310>Blitz Shot and Aimed Shot heal you for 5 health"
  power_10003: {
    type: 'ignored',
    description: 'Healing effect, not damage',
  },

  // ArcheryCritFaster: "<icon=108>Archery attacks that Critically Hit restore 5 Power and boost your Anatomy Critical Hit Chance +1%"
  power_10004: {
    type: 'todo',
    description: 'TODO_DESCRIPTION: Power restore + crit chance boost on crit — needs crit/power model',
  },

  // BowBashHeal: "<icon=3312>Bow Bash heals you for 1 health"
  power_10452: {
    type: 'ignored',
    description: 'Healing effect, not damage',
  },

  // ── Sword ───────────────────────────────────────────

  // FinishingBlowDecapitateDmgBoost: "<icon=3045><icon=2106>Finishing Blow and Decapitate damage +236"
  // Finishing Blow: AttributesThatDeltaDamage: ["BOOST_SKILL_SWORD", "BOOST_ABILITY_FINISHINGBLOW"]
  // Decapitate: AttributesThatDeltaDamage: ["BOOST_SKILL_SWORD", "BOOST_ABILITY_DECAPITATE"]
  power_1085: {
    type: 'delta',
    valuePattern: /damage \+(\d+)/,
    attributes: ['BOOST_ABILITY_FINISHINGBLOW', 'BOOST_ABILITY_DECAPITATE'],
    description: 'Finishing Blow + Decapitate flat damage',
  },

  // ManyCutsDoT: "<icon=2113>Many Cuts deals +18 Trauma damage over 6 seconds"
  // Many Cuts DoT: AttributesThatDelta: ["BOOST_ABILITYDOT_MANYCUTS"], NumTicks=6, Duration=6
  power_1021: {
    type: 'dotDelta',
    valuePattern: /deals \+(\d+) Trauma damage/,
    attribute: 'BOOST_ABILITYDOT_MANYCUTS',
    numTicks: 6,
    description: 'Many Cuts DoT total damage (÷6 ticks)',
  },

  // SwordBoostUnarmored: "<icon=108>All sword abilities deal +3% damage when you have 33% or less of your Armor left"
  power_1002: {
    type: 'todo',
    description: 'TODO_DESCRIPTION: Conditional % when low armor — needs health/armor condition model',
  },

  // SwordSlashHeal: "<icon=3445><icon=2121>Sword Slash and Thrusting Blade restore 4 armor"
  power_1004: {
    type: 'ignored',
    description: 'Armor restore, not damage',
  },

  // ── Unarmed ─────────────────────────────────────────

  // PunchBoost: "<icon=3627><icon=2203>Jab and Infuriating Fist Damage +8"
  // Jab: AttributesThatDeltaDamage: ["BOOST_SKILL_UNARMED", "BOOST_ABILITY_JAB"]
  // Infuriating Fist: AttributesThatDeltaDamage: ["BOOST_SKILL_UNARMED", "BOOST_ABILITY_INFURIATINGFIST"]
  power_3002: {
    type: 'delta',
    valuePattern: /Damage \+(\d+)/,
    attributes: ['BOOST_ABILITY_JAB', 'BOOST_ABILITY_INFURIATINGFIST'],
    description: 'Jab + Infuriating Fist flat damage',
  },

  // PunchHeal: "<icon=3627><icon=2203><icon=2119>Punch, Jab, and Infuriating Fist restore 3 Health to you"
  power_3003: {
    type: 'ignored',
    description: 'Healing effect, not damage',
  },

  // ── Necromancy ──────────────────────────────────────

  // DeathsHoldDoT: "<icon=3427>Death's Hold ignites the target, dealing 48 Fire damage over 12 seconds"
  // Death's Hold DoT: AttributesThatDelta: ["BOOST_ABILITYDOT_DEATHSHOLD"], NumTicks=6, Duration=12
  power_8002: {
    type: 'dotDelta',
    valuePattern: /dealing (\d+) Fire damage/,
    attribute: 'BOOST_ABILITYDOT_DEATHSHOLD',
    numTicks: 6,
    description: "Death's Hold fire DoT total damage (÷6 ticks)",
  },

  // NecromancyBoost: "<icon=2200><icon=2199><icon=2201>Necromancy Base Damage +5; Summoned Skeletons deal +1% direct damage"
  power_8001: {
    type: 'todo',
    description: 'TODO_DESCRIPTION: Necromancy base damage + skeleton damage — needs base damage + pet model',
  },

  // ── Druid ───────────────────────────────────────────

  // DruidBurstDoT: "While Druid skill is active: abilities that have Burst targeting deal +280 Nature damage over 8 seconds"
  // abilitydynamicdots.json: AttributesThatDelta: ["BOOST_ABILITYDOT_BURST_NATURE"], NumTicks=4, Duration=8
  power_14007: {
    type: 'dynamicDot',
    valuePattern: /deal \+(\d+) Nature damage/,
    attribute: 'BOOST_ABILITYDOT_BURST_NATURE',
    numTicks: 4,
    description: 'Druid Burst targeting Nature DoT total damage (÷4 ticks)',
  },

  // DruidProjectileDoT: "While Druid skill is active: abilities that fire a projectile...deal +308 Poison damage over 8 seconds"
  // abilitydynamicdots.json: AttributesThatDelta: ["BOOST_ABILITYDOT_PROJECTILE_POISON"], NumTicks=4, Duration=8
  power_14006: {
    type: 'dynamicDot',
    valuePattern: /deal \+(\d+) Poison damage/,
    attribute: 'BOOST_ABILITYDOT_PROJECTILE_POISON',
    numTicks: 4,
    description: 'Druid Projectile Poison DoT total damage (÷4 ticks)',
  },

  // ── Deer ────────────────────────────────────────────

  // DeerKickFireResist: "<icon=2152>Deer Kick deals +5 damage and grants you -10% Fire Vulnerability for 60 seconds"
  power_21002: {
    type: 'todo',
    description: 'TODO_DESCRIPTION: Flat damage + fire vulnerability reduction — needs vulnerability model',
  },

  // DeerKickAoECombo: "<icon=2152><icon=2154>Combo: Deer Bash+Any Melee+Deer Kick: final step hits all enemies within 5 meters..."
  power_21003: {
    type: 'todo',
    description: 'TODO_DESCRIPTION: Combo AoE effect — needs combo system model',
  },

  // ── Pig ─────────────────────────────────────────────

  // PigBiteBoost: "<icon=2231><icon=2227><icon=2224>Pig Bite boosts the Trauma damage of Pig Rend and Squeal +16 for 30 seconds"
  power_22002: {
    type: 'todo',
    description: 'TODO_DESCRIPTION: Pig Bite buffs Pig Rend + Squeal trauma damage — needs timed buff model',
  },

  // PigBiteAoE: "<icon=2224>Pig Bite has a 3% chance to deal +40 damage and hit all targets within 5 meters"
  power_22003: {
    type: 'todo',
    description: 'TODO_DESCRIPTION: Chance-based AoE on Pig Bite — needs proc chance model',
  },

  // ── Psychology ──────────────────────────────────────

  // PsychoanalyzeCrit: "<icon=2118>Psychoanalyze deals between 10 and 60 extra damage"
  power_4002: {
    type: 'todo',
    description: 'TODO_DESCRIPTION: Random extra damage range on Psychoanalyze — needs random damage model',
  },

  // ── Hammer ──────────────────────────────────────────

  // HammerCoreBoostsLookAtMyHammer: "<icon=3473>Look at My Hammer Reuse Time is -5 seconds, and Core Attacks cause the next use..."
  power_13003: {
    type: 'todo',
    description: 'TODO_DESCRIPTION: Reuse time reduction + conditional buff from Core Attacks',
  },

  // ── Knife ───────────────────────────────────────────

  // KnifeCutCritBoost: "<icon=108>Knife abilities with 'Cut' in their name cause all Knife abilities WITHOUT 'Cut'..."
  power_16002: {
    type: 'todo',
    description: 'TODO_DESCRIPTION: Crit chance manipulation between Cut/non-Cut Knife abilities',
  },

  // ── Mentalism ───────────────────────────────────────

  // PsiWaveCheaper: "<icon=108>All Psi Wave Abilities cost -1 Power and your Combat Refresh restores +4 Health"
  power_9002: {
    type: 'todo',
    description: 'TODO_DESCRIPTION: Power cost reduction + heal on Combat Refresh',
  },

  // ── Spider ──────────────────────────────────────────

  // PremeditatedDoomBuffPoison: "<icon=3555>Premeditated Doom channeling time is -1 second and boosts your Indirect Poison damage +2%"
  power_23003: {
    type: 'todo',
    description: 'TODO_DESCRIPTION: Channeling time reduction + indirect poison % buff',
  },

  // ── Shield ──────────────────────────────────────────

  // ShieldBashRestoreArmor: "<icon=108>All types of shield Bash attacks restore 6 Armor"
  power_11012: {
    type: 'ignored',
    description: 'Armor restore, not damage',
  },

  // ── AnySkill ────────────────────────────────────────

  // NiceAttackDebuffRageDmg: "<icon=108>Nice Attacks deal +2 damage and cause the target's next Rage Attack to deal -25% damage"
  power_151: {
    type: 'todo',
    description: 'TODO_DESCRIPTION: Flat damage + rage attack debuff on Nice Attacks',
  },
};

// ── Resolve Function ────────────────────────────────

/**
 * Attempt to resolve an unparseable effect using the manual mapping.
 * Returns an array of synthetic ParsedEffects, or null if the power
 * is unmapped, is todo/ignored, or the regex doesn't match.
 */
export function resolveManualEffect(
  powerId: string,
  effectDesc: string,
): ParsedEffect[] | null {
  const mapping = MANUAL_EFFECT_MAPPINGS[powerId];
  if (!mapping) return null;

  switch (mapping.type) {
    case 'todo':
    case 'ignored':
      return null;

    case 'delta': {
      const match = effectDesc.match(mapping.valuePattern);
      if (!match) return null;
      const value = parseFloat(match[1]);
      return mapping.attributes.map((attr) => ({ attribute: attr, value }));
    }

    case 'dotDelta': {
      const match = effectDesc.match(mapping.valuePattern);
      if (!match) return null;
      const totalDamage = parseFloat(match[1]);
      return [{ attribute: mapping.attribute, value: totalDamage / mapping.numTicks }];
    }

    case 'dynamicDot': {
      const match = effectDesc.match(mapping.valuePattern);
      if (!match) return null;
      const totalDamage = parseFloat(match[1]);
      return [{ attribute: mapping.attribute, value: totalDamage / mapping.numTicks }];
    }
  }
}
