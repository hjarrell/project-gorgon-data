import type { GearSlot, DamageContribution } from '../build-helpers';

// ── Effect Types ─────────────────────────────────────

/**
 * Every stat type the damage calculator supports.
 * Maps 1:1 to the fields in DamageResult / StatResult / CritResult.
 */
export type SkillEffectType =
  // Direct damage
  | 'flatDamage'            // +N flat damage
  | 'percentDamage'         // +N% damage
  | 'baseDamageMod'         // +N% BASE damage (applied before other %)
  | 'armorDamage'           // +N armor-type damage

  // DoTs
  | 'dot'                   // New DoT: N DamageType damage over Ns
  | 'dotDelta'              // +N total to existing DoT (per-tick via numTicks)
  | 'dotFlatDamage'         // +N per-tick to existing DoTs (from text effects)

  // Crit
  | 'critChanceDelta'       // +N% crit chance
  | 'critDamageMod'         // +N% crit damage

  // Resource / economy
  | 'restore'               // Restores N resource
  | 'costDelta'             // -N power cost
  | 'cooldownDelta'         // -N reuse time (seconds)
  | 'rageDelta'             // +/-N rage
  | 'rageMod'               // +/-N% rage

  // Targeting / positioning
  | 'tauntDelta'            // +N taunt
  | 'tauntMod'              // +N% taunt
  | 'tempTauntDelta'        // +N temp taunt
  | 'rangeDelta'            // +N range
  | 'aoeDelta'              // +N AoE
  | 'accuracyDelta'         // +N accuracy

  // Conditional / situational
  | 'vulnerableDamageDelta' // +N damage if target vulnerable

  // Meta
  | 'todo'                  // Known but not yet calculable
  | 'ignored';              // Non-combat utility (sprint, mitigation, stun, etc.)

// ── Extraction Config ────────────────────────────────

export interface EffectExtraction {
  type: SkillEffectType;
  /** Regex to extract the numeric value from the effect desc (capture group 1) */
  valuePattern: RegExp;
  /** For dotDelta: the attribute name and tick count */
  attribute?: string;
  numTicks?: number;
  /** For dot: damage type and duration */
  damageType?: string;
  duration?: number;
  /** For restore: resource type (Health, Power, Armor) */
  resourceType?: string;
  /** Override the power's main target for this specific effect (for compound mods) */
  targetAbility?: string;
}

export interface PowerEffectConfig {
  powerId: string;
  /** Human-readable name for this power (from InternalName) */
  name: string;
  /** Which abilities this affects */
  target:
    | { abilities: string[] }
    | { skill: string; except?: string[] }
    | 'self';
  /**
   * How to extract structured data from EffectDescs.
   * For compound effects (single desc with multiple effects), list
   * multiple extractions - each runs its own regex on the same text.
   */
  effects: EffectExtraction[];
  /** Expected text template for snapshot testing (numbers replaced with {N}) */
  template?: string;
}

// ── Resolved Output ──────────────────────────────────

export interface ResolvedEffect {
  type: SkillEffectType;
  value: number;
  powerId: string;
  slot: GearSlot;
  /** Which ability this targets (null for 'self' effects) */
  targetAbility: string | null;
  /** Skill name for skill-wide targeting */
  skillName?: string;
  /** Abilities excluded from skill-wide targeting */
  exceptAbilities?: string[];
  /** For 'dot': extra metadata */
  damageType?: string;
  duration?: number;
  numTicks?: number;
  /** For 'restore': resource type */
  resourceType?: string;
  /** For 'dotDelta': synthetic attribute name */
  attribute?: string;
  /** Original raw text for contribution tracking */
  raw?: string;
}
