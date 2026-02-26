import type { Ability } from '../../schemas/abilities';
import type {
  GearSlot,
  DamageResult,
  DamageContribution,
  StatResult,
} from '../build-helpers';
import type {
  PowerEffectConfig,
  ResolvedEffect,
  SkillEffectType,
} from './types';

export type { PowerEffectConfig, EffectExtraction, ResolvedEffect, SkillEffectType } from './types';

// ── Skill imports ────────────────────────────────────

import { ANIMALHANDLING_EFFECTS } from './animal-handling';
import { ARCHERY_EFFECTS } from './archery';
import { ARMORPATCHING_EFFECTS } from './armor-patching';
import { BARD_EFFECTS } from './bard';
import { BATTLECHEMISTRY_EFFECTS } from './battle-chemistry';
import { COW_EFFECTS } from './cow';
import { DEER_EFFECTS } from './deer';
import { DRUID_EFFECTS } from './druid';
import { FAIRYMAGIC_EFFECTS } from './fairy-magic';
import { FIREMAGIC_EFFECTS } from './fire-magic';
import { GIANTBAT_EFFECTS } from './giant-bat';
import { GOURMAND_EFFECTS } from './gourmand';
import { HAMMER_EFFECTS } from './hammer';
import { ICEMAGIC_EFFECTS } from './ice-magic';
import { KNIFE_EFFECTS } from './knife';
import { MENTALISM_EFFECTS } from './mentalism';
import { NECROMANCY_EFFECTS } from './necromancy';
import { PIG_EFFECTS } from './pig';
import { PRIEST_EFFECTS } from './priest';
import { PSYCHOLOGY_EFFECTS } from './psychology';
import { RABBIT_EFFECTS } from './rabbit';
import { SHIELD_EFFECTS } from './shield';
import { SPIDER_EFFECTS } from './spider';
import { SPIRITFOX_EFFECTS } from './spirit-fox';
import { STAFF_EFFECTS } from './staff';
import { SWORD_EFFECTS } from './sword';
import { UNARMED_EFFECTS } from './unarmed';
import { VAMPIRISM_EFFECTS } from './vampirism';
import { WARDEN_EFFECTS } from './warden';
import { WEATHERWITCHING_EFFECTS } from './weather-witching';
import { WEREWOLF_EFFECTS } from './werewolf';

// ── Registry ─────────────────────────────────────────

const ALL_POWER_EFFECTS: Map<string, PowerEffectConfig> = new Map();

// Auto-register all skill configs
register(ANIMALHANDLING_EFFECTS);
register(ARCHERY_EFFECTS);
register(ARMORPATCHING_EFFECTS);
register(BARD_EFFECTS);
register(BATTLECHEMISTRY_EFFECTS);
register(COW_EFFECTS);
register(DEER_EFFECTS);
register(DRUID_EFFECTS);
register(FAIRYMAGIC_EFFECTS);
register(FIREMAGIC_EFFECTS);
register(GIANTBAT_EFFECTS);
register(GOURMAND_EFFECTS);
register(HAMMER_EFFECTS);
register(ICEMAGIC_EFFECTS);
register(KNIFE_EFFECTS);
register(MENTALISM_EFFECTS);
register(NECROMANCY_EFFECTS);
register(PIG_EFFECTS);
register(PRIEST_EFFECTS);
register(PSYCHOLOGY_EFFECTS);
register(RABBIT_EFFECTS);
register(SHIELD_EFFECTS);
register(SPIDER_EFFECTS);
register(SPIRITFOX_EFFECTS);
register(STAFF_EFFECTS);
register(SWORD_EFFECTS);
register(UNARMED_EFFECTS);
register(VAMPIRISM_EFFECTS);
register(WARDEN_EFFECTS);
register(WEATHERWITCHING_EFFECTS);
register(WEREWOLF_EFFECTS);

export function register(configs: PowerEffectConfig[]) {
  for (const config of configs) {
    ALL_POWER_EFFECTS.set(config.powerId, config);
  }
}

export function getRegisteredConfig(powerId: string): PowerEffectConfig | undefined {
  return ALL_POWER_EFFECTS.get(powerId);
}

export function getAllRegisteredPowerIds(): Set<string> {
  return new Set(ALL_POWER_EFFECTS.keys());
}

// ── Resolve ──────────────────────────────────────────

function stripIcons(text: string): string {
  return text.replace(/<icon=\d+>/g, '').trim();
}

/**
 * Resolve text effects for a power using per-skill configs.
 * Returns ResolvedEffect[] or null if the power has no config.
 */
export function resolveSkillEffects(
  powerId: string,
  effectDescs: string[],
  slot: GearSlot,
): ResolvedEffect[] | null {
  const config = ALL_POWER_EFFECTS.get(powerId);
  if (!config) return null;

  const results: ResolvedEffect[] = [];

  for (const desc of effectDescs) {
    const clean = stripIcons(desc);

    for (const extraction of config.effects) {
      // todo/ignored produce no resolved effects
      if (extraction.type === 'todo' || extraction.type === 'ignored') continue;

      const match = clean.match(extraction.valuePattern);
      if (!match) continue;

      const value = parseFloat(match[1]);
      if (isNaN(value)) continue;

      // Determine target info
      const target = config.target;
      let targetAbility: string | null = extraction.targetAbility ?? null;
      let skillName: string | undefined;
      let exceptAbilities: string[] | undefined;

      if (target === 'self') {
        targetAbility = null;
      } else if ('skill' in target) {
        skillName = target.skill;
        exceptAbilities = target.except;
      } else if ('abilities' in target && !extraction.targetAbility) {
        // For multi-ability targets, we'll set targetAbility to null
        // and let the matching function handle it via the config
        targetAbility = null;
      }

      results.push({
        type: extraction.type,
        value,
        powerId,
        slot,
        targetAbility,
        skillName,
        exceptAbilities,
        damageType: extraction.damageType,
        duration: extraction.duration,
        numTicks: extraction.numTicks,
        resourceType: extraction.resourceType,
        attribute: extraction.attribute,
        raw: clean,
      });
    }
  }

  return results.length > 0 ? results : null;
}

// ── Matching ─────────────────────────────────────────

/**
 * Match an ability name against a base name, accounting for tiered abilities.
 * "Aimed Shot" matches "Aimed Shot", "Aimed Shot 2", "Aimed Shot 11", etc.
 * but NOT "Aimed Shotgun" or "Heavy Aimed Shot".
 */
function nameMatchesTiered(abilityName: string, baseName: string): boolean {
  const aLower = abilityName.toLowerCase();
  const bLower = baseName.toLowerCase();
  if (aLower === bLower) return true;
  // Check for tiered variant: baseName + space + digits
  if (aLower.startsWith(bLower + ' ')) {
    const suffix = abilityName.slice(baseName.length + 1);
    return /^\d+$/.test(suffix);
  }
  return false;
}

/**
 * Check if a resolved effect applies to a given ability.
 */
export function resolvedEffectMatchesAbility(
  effect: ResolvedEffect,
  ability: Ability,
): boolean {
  const config = ALL_POWER_EFFECTS.get(effect.powerId);
  if (!config) return false;

  const target = config.target;

  if (target === 'self') return true;

  if ('skill' in target) {
    if (ability.Skill !== target.skill) return false;
    if (target.except?.some(
      (n) => nameMatchesTiered(ability.Name, n),
    )) {
      return false;
    }
    return true;
  }

  if ('abilities' in target) {
    // Check if specific targetAbility is set on the effect (compound mods)
    if (effect.targetAbility) {
      return nameMatchesTiered(ability.Name, effect.targetAbility);
    }
    return target.abilities.some(
      (n) => nameMatchesTiered(ability.Name, n),
    );
  }

  return false;
}

// ── Apply ────────────────────────────────────────────

function makeContribution(
  effect: ResolvedEffect,
  attrLabel: string,
  type: 'delta' | 'mod',
): DamageContribution {
  return {
    powerId: effect.powerId,
    tierId: '', // text effects don't have a single tierId
    attribute: attrLabel,
    value: effect.value,
    type,
    slot: effect.slot,
  };
}

function applyDelta(stat: StatResult, value: number, contrib: DamageContribution): void {
  stat.flatBonus += value;
  stat.modified = stat.base * (1 + stat.percentMod) + stat.flatBonus;
  stat.contributions.push(contrib);
}

function applyMod(stat: StatResult, value: number, contrib: DamageContribution): void {
  stat.percentMod += value;
  stat.modified = stat.base * (1 + stat.percentMod) + stat.flatBonus;
  stat.contributions.push(contrib);
}

/**
 * Apply resolved skill effects to a DamageResult in-place.
 * Call this after calculateAbilityDamage() with effects filtered for the ability.
 */
export function applyResolvedEffects(
  result: DamageResult,
  effects: ResolvedEffect[],
): void {
  for (const eff of effects) {
    switch (eff.type) {
      // ── Direct damage ──
      case 'flatDamage': {
        result.flatBonus += eff.value;
        result.modifiedDamage += eff.value;
        result.contributions.push(makeContribution(eff, 'SKILL_EFFECT_FLAT', 'delta'));
        break;
      }
      case 'percentDamage': {
        const pct = eff.value / 100;
        result.percentMod += pct;
        // Recalculate: modifiedDamage = baseDamage * (1 + percentMod) + flatBonus
        result.modifiedDamage = result.baseDamage * (1 + result.percentMod) + result.flatBonus;
        result.contributions.push(makeContribution(eff, 'SKILL_EFFECT_PERCENT', 'mod'));
        break;
      }
      case 'baseDamageMod': {
        // baseDamageMod is applied before other %, modifying the base
        const mod = eff.value / 100;
        const baseDelta = result.baseDamage * mod;
        result.flatBonus += baseDelta;
        result.modifiedDamage = result.baseDamage * (1 + result.percentMod) + result.flatBonus;
        result.contributions.push(makeContribution(eff, 'SKILL_EFFECT_BASEMOD', 'mod'));
        break;
      }
      case 'armorDamage': {
        result.flatBonus += eff.value;
        result.modifiedDamage += eff.value;
        result.contributions.push(makeContribution(eff, 'SKILL_EFFECT_ARMOR_DMG', 'delta'));
        break;
      }

      // ── DoTs ──
      case 'dot': {
        const numTicks = eff.numTicks ?? (eff.duration ? Math.max(1, Math.round(eff.duration / 2)) : 1);
        const perTick = eff.value / numTicks;
        result.dots.push({
          damageType: eff.damageType ?? 'Unknown',
          baseTotalDamage: 0,
          modifiedTotalDamage: eff.value,
          baseDamagePerTick: perTick,
          numTicks,
          duration: eff.duration ?? 0,
          flatBonusPerTick: perTick,
          percentMod: 0,
          contributions: [makeContribution(eff, 'SKILL_EFFECT_DOT', 'delta')],
        });
        break;
      }
      case 'dotDelta': {
        // Emit as synthetic ParsedEffect — these boost existing DoTs
        // The value from the config is total damage; divide by numTicks for per-tick
        if (eff.attribute && eff.numTicks) {
          const perTick = eff.value / eff.numTicks;
          // Find matching DoT in result and add to it
          for (const dot of result.dots) {
            // Match by looking at contributions for the attribute
            const hasAttr = dot.contributions.some((c) => c.attribute === eff.attribute);
            if (hasAttr) {
              dot.flatBonusPerTick += perTick;
              dot.modifiedTotalDamage = (dot.baseDamagePerTick * (1 + dot.percentMod) + dot.flatBonusPerTick) * dot.numTicks;
              dot.contributions.push(makeContribution(eff, eff.attribute, 'delta'));
              break;
            }
          }
        }
        break;
      }
      case 'dotFlatDamage': {
        // Text-effect flat damage boost to existing DoTs (e.g. Song of Discord deals +67 damage)
        // Adds per-tick to all DoTs on the ability
        for (const dot of result.dots) {
          dot.flatBonusPerTick += eff.value;
          dot.modifiedTotalDamage = (dot.baseDamagePerTick * (1 + dot.percentMod) + dot.flatBonusPerTick) * dot.numTicks;
          dot.contributions.push(makeContribution(eff, 'SKILL_EFFECT_DOT_FLAT', 'delta'));
        }
        break;
      }

      // ── Crit ──
      case 'critChanceDelta': {
        result.crit.critChanceBonus += eff.value / 100;
        result.crit.contributions.push(makeContribution(eff, 'SKILL_EFFECT_CRIT_CHANCE', 'delta'));
        break;
      }
      case 'critDamageMod': {
        const mod = eff.value / 100;
        result.crit.critDamageModBonus += mod;
        result.crit.modifiedCritDamageMod = result.crit.baseCritDamageMod + result.crit.critDamageModBonus;
        result.crit.contributions.push(makeContribution(eff, 'SKILL_EFFECT_CRIT_DMG', 'mod'));
        break;
      }

      // ── StatResult fields ──
      case 'costDelta':
        applyDelta(result.powerCost, eff.value, makeContribution(eff, 'SKILL_EFFECT_COST', 'delta'));
        break;
      case 'cooldownDelta':
        applyDelta(result.resetTime, eff.value, makeContribution(eff, 'SKILL_EFFECT_COOLDOWN', 'delta'));
        break;
      case 'rageDelta':
        applyDelta(result.rage, eff.value, makeContribution(eff, 'SKILL_EFFECT_RAGE', 'delta'));
        break;
      case 'rageMod':
        applyMod(result.rage, eff.value / 100, makeContribution(eff, 'SKILL_EFFECT_RAGE_MOD', 'mod'));
        break;
      case 'tauntDelta':
        applyDelta(result.taunt, eff.value, makeContribution(eff, 'SKILL_EFFECT_TAUNT', 'delta'));
        break;
      case 'tauntMod':
        applyMod(result.taunt, eff.value / 100, makeContribution(eff, 'SKILL_EFFECT_TAUNT_MOD', 'mod'));
        break;
      case 'tempTauntDelta':
        applyDelta(result.tempTaunt, eff.value, makeContribution(eff, 'SKILL_EFFECT_TEMP_TAUNT', 'delta'));
        break;
      case 'rangeDelta':
        applyDelta(result.range, eff.value, makeContribution(eff, 'SKILL_EFFECT_RANGE', 'delta'));
        break;
      case 'aoeDelta':
        if (result.aoe) applyDelta(result.aoe, eff.value, makeContribution(eff, 'SKILL_EFFECT_AOE', 'delta'));
        break;
      case 'accuracyDelta':
        if (result.accuracy) applyDelta(result.accuracy, eff.value, makeContribution(eff, 'SKILL_EFFECT_ACCURACY', 'delta'));
        break;
      case 'vulnerableDamageDelta':
        if (result.vulnerableDamage) applyDelta(result.vulnerableDamage, eff.value, makeContribution(eff, 'SKILL_EFFECT_VULN_DMG', 'delta'));
        break;

      // ── Resource restoration ──
      case 'restore':
        result.restores.push({
          value: eff.value,
          resourceType: eff.resourceType ?? 'Health',
          powerId: eff.powerId,
          slot: eff.slot,
        });
        break;

      case 'todo':
      case 'ignored':
        break;
    }
  }
}
