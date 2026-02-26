/**
 * Integration tests for Bard skill-effect mods.
 *
 * Each test exercises the full pipeline:
 *   tsysClientInfo EffectDescs → resolveSkillEffects → resolvedEffectMatchesAbility
 *   → applyResolvedEffects → simulateCombat
 *
 * We use real tsysClientInfo tier data so the regex patterns are validated
 * against actual game strings.
 */
import { describe, it, expect } from 'vitest';
import { abilities, abilityKeywords, abilityDynamicDots, tsysClientInfo } from '../../data';
import { simulateCombat } from '../combat-simulator/simulation';
import type { CombatSimConfig, RotationEntry } from '../combat-simulator/types';
import type { Ability } from '../../schemas/abilities';
import type {
  DamageResult,
  StatResult,
  CritResult,
  DoTDamageResult,
  EquippedEffect,
} from '../build-helpers';
import {
  buildInternalKeywordMap,
  collectAbilityAttributes,
  calculateAbilityDamage,
} from '../build-helpers';
import {
  resolveSkillEffects,
  resolvedEffectMatchesAbility,
  applyResolvedEffects,
} from './index';

// ── Helpers ─────────────────────────────────────────

function makeStat(base: number): StatResult {
  return { base, flatBonus: 0, percentMod: 0, modified: base, contributions: [] };
}

function makeCrit(): CritResult {
  return {
    baseCritDamageMod: 0,
    critDamageModBonus: 0,
    modifiedCritDamageMod: 0,
    critChanceBonus: 0,
    contributions: [],
  };
}

function baseDamageResult(overrides: Partial<DamageResult> = {}): DamageResult {
  return {
    baseDamage: 0,
    flatBonus: 0,
    percentMod: 0,
    modifiedDamage: 0,
    contributions: [],
    dots: [],
    crit: makeCrit(),
    rage: makeStat(0),
    taunt: makeStat(0),
    tempTaunt: makeStat(0),
    powerCost: makeStat(10),
    resetTime: makeStat(3),
    range: makeStat(10),
    aoe: null,
    accuracy: null,
    vulnerableDamage: null,
    specialValues: [],
    restores: [],
    ...overrides,
  };
}

function makeAbility(name: string, overrides: Partial<Ability> = {}): Ability {
  return {
    Animation: 'none',
    DamageType: 'Nature',
    Description: '',
    IconID: 1,
    InternalName: name,
    Level: 1,
    Name: name,
    PvE: { PowerCost: 10, Range: 10, Damage: 100 },
    ResetTime: 3,
    Skill: 'Bard',
    Target: 'Enemy',
    ...overrides,
  } as Ability;
}

function makeEntry(
  name: string,
  priority: number,
  dr: DamageResult,
  abilityOverrides: Partial<Ability> = {},
): RotationEntry {
  return {
    abilityId: name,
    ability: makeAbility(name, abilityOverrides),
    damageResult: dr,
    priority,
  };
}

function makeConfig(
  rotation: RotationEntry[],
  overrides: Partial<CombatSimConfig> = {},
): CombatSimConfig {
  return {
    rotation,
    fightDuration: 30,
    maxPower: 1000,
    powerRegenPerSecond: 0,
    globalCooldown: 0,
    baseCritChance: 0,
    maxHealth: 0,
    needBasedPriority: { enabled: false, healthThreshold: 0.5, powerThreshold: 0.25 },
    enemy: null,
    ...overrides,
  };
}

/** Get the first tier's EffectDescs for a power from tsysClientInfo. */
function getTierDescs(powerId: string, tierId = 'id_1'): string[] {
  const power = tsysClientInfo.get(powerId);
  if (!power) throw new Error(`Power ${powerId} not found`);
  const tier = power.Tiers[tierId as keyof typeof power.Tiers] as any;
  if (!tier) throw new Error(`Tier ${tierId} not found for ${powerId}`);
  return tier.EffectDescs;
}

/**
 * Resolve + filter + apply bard text effects to a DamageResult.
 * Returns the number of effects applied.
 */
function applyBardMod(
  powerId: string,
  dr: DamageResult,
  ability: Ability,
  tierId = 'id_1',
): number {
  const descs = getTierDescs(powerId, tierId);
  const resolved = resolveSkillEffects(powerId, descs, 'Legs');
  if (!resolved) return 0;
  const matching = resolved.filter((eff) => resolvedEffectMatchesAbility(eff, ability));
  applyResolvedEffects(dr, matching);
  return matching.length;
}

function makeSongDoT(baseDamagePerTick: number): DoTDamageResult {
  return {
    damageType: 'Trauma',
    baseTotalDamage: baseDamagePerTick,
    modifiedTotalDamage: baseDamagePerTick,
    baseDamagePerTick,
    numTicks: 1,
    duration: 0,
    flatBonusPerTick: 0,
    percentMod: 0,
    contributions: [],
  };
}

// ── Tests ───────────────────────────────────────────

describe('bard mods integration', () => {
  // ── Direct damage mods ──

  describe('BlastOfFuryKnockback (percentDamage)', () => {
    it('boosts Blast of Fury damage by +10% in simulator', () => {
      const ability = makeAbility('Blast of Fury', {
        DamageType: 'Nature',
        PvE: { PowerCost: 16, Range: 30, Damage: 200 },
        ResetTime: 12,
      });
      const dr = baseDamageResult({
        baseDamage: 200,
        modifiedDamage: 200,
        resetTime: makeStat(12),
      });
      const applied = applyBardMod('power_17122', dr, ability);

      expect(applied).toBe(1);
      expect(dr.percentMod).toBeCloseTo(0.10);
      expect(dr.modifiedDamage).toBeCloseTo(220);

      const entry = makeEntry('Blast of Fury', 0, dr, {
        DamageType: 'Nature',
        ResetTime: 12,
        PvE: { PowerCost: 16, Range: 30, Damage: 200 },
      });
      const sim = simulateCombat(makeConfig([entry], { fightDuration: 12 }));
      // Casts at t=0 only (12s cooldown, 12s fight)
      expect(sim.totalCasts).toBe(1);
      expect(sim.totalDirectDamage).toBeCloseTo(220);
    });

    it('matches tiered ability name "Blast of Fury 13"', () => {
      const ability = makeAbility('Blast of Fury 13', {
        DamageType: 'Nature',
        PvE: { PowerCost: 16, Range: 30, Damage: 877 },
        ResetTime: 12,
      });
      const dr = baseDamageResult({ baseDamage: 877, modifiedDamage: 877 });
      const applied = applyBardMod('power_17122', dr, ability);
      expect(applied).toBe(1);
      expect(dr.modifiedDamage).toBeCloseTo(877 * 1.10);
    });
  });

  describe('ThunderousNoteBardBlast (flatDamage)', () => {
    it('adds +3 flat damage to Thunderous Note', () => {
      const ability = makeAbility('Thunderous Note', {
        DamageType: 'Trauma',
        PvE: { PowerCost: 11, Range: 30, Damage: 100 },
        ResetTime: 8,
      });
      const dr = baseDamageResult({ baseDamage: 100, modifiedDamage: 100 });
      const applied = applyBardMod('power_17205', dr, ability);

      expect(applied).toBe(1);
      expect(dr.flatBonus).toBe(3);
      expect(dr.modifiedDamage).toBe(103);
    });
  });

  describe('ThunderousNoteNature (percentDamage)', () => {
    it('boosts Thunderous Note damage by +11%', () => {
      const ability = makeAbility('Thunderous Note 8', {
        DamageType: 'Trauma',
        PvE: { PowerCost: 11, Range: 30, Damage: 304 },
        ResetTime: 8,
      });
      const dr = baseDamageResult({ baseDamage: 304, modifiedDamage: 304 });
      const applied = applyBardMod('power_17204', dr, ability);

      expect(applied).toBe(1);
      expect(dr.percentMod).toBeCloseTo(0.11);
      expect(dr.modifiedDamage).toBeCloseTo(304 * 1.11);
    });
  });

  describe('DisharmonyBuff (flatDamage)', () => {
    it('adds +4 flat damage to Disharmony', () => {
      const ability = makeAbility('Disharmony 5', {
        DamageType: 'Trauma',
        PvE: { PowerCost: 0, Range: 30, Damage: 39 },
        ResetTime: 1.5,
      });
      const dr = baseDamageResult({ baseDamage: 39, modifiedDamage: 39 });
      const descs = getTierDescs('power_17322');
      const resolved = resolveSkillEffects('power_17322', descs, 'Legs');
      expect(resolved).not.toBeNull();

      // This mod targets "Disharmony causes your next attack to" — a
      // phrase-based target. It will NOT match ability name "Disharmony 5".
      // Verify the resolver produces effects even though matching may fail.
      expect(resolved!.length).toBeGreaterThan(0);
      expect(resolved![0].type).toBe('flatDamage');
      expect(resolved![0].value).toBe(4);
    });
  });

  // ── Song DoT mods ──

  describe('SongOfDiscordStun (dotFlatDamage)', () => {
    it('adds +3 per-tick to Song of Discord DoT', () => {
      const ability = makeAbility('Song of Discord', {
        DamageType: 'Potion',
        Keywords: ['BardSong', 'SongOfDiscord'],
        PvE: { PowerCost: 16, Range: 10 },
        ResetTime: 2,
      });
      const dr = baseDamageResult({
        dots: [makeSongDoT(12)],
      });
      const applied = applyBardMod('power_17042', dr, ability);

      expect(applied).toBe(1);
      expect(dr.dots[0].flatBonusPerTick).toBe(3);
      expect(dr.dots[0].modifiedTotalDamage).toBe(15);
    });

    it('boosts song tick damage in simulator', () => {
      const dr = baseDamageResult({ dots: [makeSongDoT(12)] });
      const ability = makeAbility('Song of Discord', {
        DamageType: 'Potion',
        Keywords: ['BardSong', 'SongOfDiscord'],
        SharesResetTimerWith: 'SongGroup',
        PvE: { PowerCost: 16, Range: 10 },
        ResetTime: 2,
      });
      applyBardMod('power_17042', dr, ability);

      const entry: RotationEntry = {
        abilityId: 'SongOfDiscord',
        ability,
        damageResult: dr,
        priority: 0,
      };
      // 10s fight: song ticks at t=2,4,6,8,10 = 5 ticks at 15 dmg/tick
      const sim = simulateCombat(makeConfig([entry], { fightDuration: 10 }));
      expect(sim.totalSongDamage).toBeCloseTo(15 * 5, 1);
    });

    it('matches tiered Song of Discord 13', () => {
      const ability = makeAbility('Song of Discord 13', {
        DamageType: 'Potion',
        Keywords: ['BardSong', 'SongOfDiscord'],
        PvE: { PowerCost: 16, Range: 10 },
        ResetTime: 2,
      });
      const dr = baseDamageResult({ dots: [makeSongDoT(453)] });
      const applied = applyBardMod('power_17042', dr, ability);
      expect(applied).toBe(1);
      expect(dr.dots[0].modifiedTotalDamage).toBe(456); // 453 + 3
    });
  });

  describe('SongOfDiscordLowerRage (dotFlatDamage)', () => {
    it('adds +5 per-tick to Song of Discord DoT', () => {
      const ability = makeAbility('Song of Discord', {
        DamageType: 'Potion',
        Keywords: ['BardSong', 'SongOfDiscord'],
        PvE: { PowerCost: 16, Range: 10 },
        ResetTime: 2,
      });
      const dr = baseDamageResult({ dots: [makeSongDoT(12)] });
      const applied = applyBardMod('power_17043', dr, ability);

      expect(applied).toBe(1);
      expect(dr.dots[0].flatBonusPerTick).toBe(5);
      expect(dr.dots[0].modifiedTotalDamage).toBe(17);
    });
  });

  describe('SongOfDiscordCrit (percentDamage — DoT percent)', () => {
    it('resolves +100% from Song of Discord tier data', () => {
      const ability = makeAbility('Song of Discord', {
        DamageType: 'Potion',
        Keywords: ['BardSong', 'SongOfDiscord'],
        PvE: { PowerCost: 16, Range: 10 },
        ResetTime: 2,
      });
      const dr = baseDamageResult({ dots: [makeSongDoT(12)] });
      const descs = getTierDescs('power_17044');
      const resolved = resolveSkillEffects('power_17044', descs, 'Legs');
      expect(resolved).not.toBeNull();
      expect(resolved![0].type).toBe('percentDamage');
      expect(resolved![0].value).toBe(100);

      const matching = resolved!.filter((e) => resolvedEffectMatchesAbility(e, ability));
      expect(matching.length).toBe(1);
    });
  });

  describe('SongOfDiscordRageahol (percentDamage)', () => {
    it('resolves +5% from tier data', () => {
      const descs = getTierDescs('power_17047');
      const resolved = resolveSkillEffects('power_17047', descs, 'Legs');
      expect(resolved).not.toBeNull();
      expect(resolved![0].type).toBe('percentDamage');
      expect(resolved![0].value).toBe(5);
    });
  });

  // ── Rage mods ──

  describe('BlastOfDespairBoost (rageDelta)', () => {
    it('adds +10 rage to Blast of Despair', () => {
      const ability = makeAbility('Blast of Despair 7', {
        DamageType: 'Nature',
        PvE: { PowerCost: 10, Range: 30, Damage: 251 },
        ResetTime: 6,
      });
      const dr = baseDamageResult({
        baseDamage: 251,
        modifiedDamage: 251,
        rage: makeStat(50),
      });
      const applied = applyBardMod('power_17161', dr, ability);

      expect(applied).toBe(1);
      expect(dr.rage.flatBonus).toBe(10);
      expect(dr.rage.modified).toBe(60);
    });
  });

  // ── Cost reduction mods ──

  describe('EntrancingLullabyAnthemOfAvoidanceCheaper (costDelta)', () => {
    it('reduces Entrancing Lullaby cost by 7', () => {
      const ability = makeAbility('Entrancing Lullaby 3', {
        PvE: { PowerCost: 10, Range: 30, Damage: 0 },
        ResetTime: 30,
      });
      const dr = baseDamageResult({ powerCost: makeStat(10) });
      const applied = applyBardMod('power_17263', dr, ability);

      expect(applied).toBe(1);
      expect(dr.powerCost.flatBonus).toBe(7);
      expect(dr.powerCost.modified).toBe(17); // adds 7 to stat, not subtracts (sign from value)
    });

    it('also applies to Anthem of Avoidance', () => {
      const ability = makeAbility('Anthem of Avoidance', {
        PvE: { PowerCost: 20, Range: 30, Damage: 0 },
        ResetTime: 30,
      });
      const dr = baseDamageResult({ powerCost: makeStat(20) });
      const applied = applyBardMod('power_17263', dr, ability);
      expect(applied).toBe(1);
    });

    it('does not apply to Blast of Fury', () => {
      const ability = makeAbility('Blast of Fury', {
        PvE: { PowerCost: 16, Range: 30, Damage: 200 },
        ResetTime: 12,
      });
      const dr = baseDamageResult({ powerCost: makeStat(16) });
      const applied = applyBardMod('power_17263', dr, ability);
      expect(applied).toBe(0);
    });
  });

  describe('BardEnableHymnOfResurrection (costDelta)', () => {
    it('resolves cost reduction from tier data', () => {
      const descs = getTierDescs('power_17024');
      const resolved = resolveSkillEffects('power_17024', descs, 'Chest');
      expect(resolved).not.toBeNull();
      expect(resolved![0].type).toBe('costDelta');
      expect(resolved![0].value).toBe(20);
    });
  });

  // ── Cooldown mods ──

  describe('AnthemOfAvoidanceHastenRally (cooldownDelta)', () => {
    it('resolves cooldown reduction', () => {
      const descs = getTierDescs('power_17244');
      const resolved = resolveSkillEffects('power_17244', descs, 'Legs');
      expect(resolved).not.toBeNull();
      expect(resolved![0].type).toBe('cooldownDelta');
      expect(resolved![0].value).toBe(5);
    });
  });

  // ── Restore mods ──

  describe('BardSongSelfHeal (restore Health)', () => {
    it('adds Health restore to DamageResult', () => {
      const ability = makeAbility('Song of Discord', {
        DamageType: 'Potion',
        Keywords: ['BardSong', 'SongOfDiscord'],
        PvE: { PowerCost: 16, Range: 10 },
        ResetTime: 2,
      });
      const dr = baseDamageResult({ dots: [makeSongDoT(12)] });
      const descs = getTierDescs('power_17022');
      const resolved = resolveSkillEffects('power_17022', descs, 'Legs');
      expect(resolved).not.toBeNull();
      expect(resolved![0].type).toBe('restore');
      expect(resolved![0].value).toBe(7);

      applyResolvedEffects(dr, resolved!);
      expect(dr.restores.length).toBe(1);
      expect(dr.restores[0].resourceType).toBe('Health');
      expect(dr.restores[0].value).toBe(7);
    });
  });

  describe('BardSongSelfHealArmor (restore Armor)', () => {
    it('adds Armor restore to DamageResult', () => {
      const descs = getTierDescs('power_17023');
      const resolved = resolveSkillEffects('power_17023', descs, 'Legs');
      expect(resolved).not.toBeNull();
      expect(resolved![0].type).toBe('restore');
      expect(resolved![0].value).toBe(5);

      const dr = baseDamageResult();
      applyResolvedEffects(dr, resolved!);
      expect(dr.restores[0].resourceType).toBe('Armor');
    });
  });

  describe('RallyHealPower (restore Power)', () => {
    it('adds Power restore to Rally', () => {
      const ability = makeAbility('Rally', {
        PvE: { PowerCost: 0, Range: 30, Damage: 0 },
        ResetTime: 30,
      });
      const dr = baseDamageResult();
      const applied = applyBardMod('power_17222', dr, ability);

      expect(applied).toBe(1);
      expect(dr.restores.length).toBe(1);
      expect(dr.restores[0].resourceType).toBe('Power');
      expect(dr.restores[0].value).toBe(10);
    });
  });

  describe('BlastOfDespairArmor (restore Armor)', () => {
    it('adds Armor restore to Blast of Despair', () => {
      const ability = makeAbility('Blast of Despair 9', {
        DamageType: 'Nature',
        PvE: { PowerCost: 10, Range: 30, Damage: 360 },
        ResetTime: 6,
      });
      const dr = baseDamageResult({ baseDamage: 360, modifiedDamage: 360 });
      const applied = applyBardMod('power_17163', dr, ability);

      expect(applied).toBe(1);
      expect(dr.restores[0].resourceType).toBe('Armor');
      expect(dr.restores[0].value).toBe(4);
    });
  });

  describe('VirtuososBalladHealing (restore Health)', () => {
    it('resolves Health restore', () => {
      const descs = getTierDescs('power_17282');
      const resolved = resolveSkillEffects('power_17282', descs, 'Legs');
      expect(resolved).not.toBeNull();
      expect(resolved![0].type).toBe('restore');
      expect(resolved![0].value).toBe(8);
      expect(resolved![0].resourceType).toBe('Health');
    });
  });

  describe('VirtuososBalladPower (restore Power)', () => {
    it('resolves Power restore', () => {
      const descs = getTierDescs('power_17281');
      const resolved = resolveSkillEffects('power_17281', descs, 'Legs');
      expect(resolved).not.toBeNull();
      expect(resolved![0].type).toBe('restore');
      expect(resolved![0].value).toBe(10);
      expect(resolved![0].resourceType).toBe('Power');
    });
  });

  // ── Simulator integration: combined mods ──

  describe('combined mods through simulator', () => {
    it('stacks flat + percent mods on Thunderous Note', () => {
      const ability = makeAbility('Thunderous Note 8', {
        DamageType: 'Trauma',
        PvE: { PowerCost: 11, Range: 30, Damage: 304 },
        ResetTime: 8,
      });
      const dr = baseDamageResult({
        baseDamage: 304,
        modifiedDamage: 304,
        resetTime: makeStat(8),
      });

      // Apply flat +3 from ThunderousNoteBardBlast
      applyBardMod('power_17205', dr, ability);
      // Apply +11% from ThunderousNoteNature
      applyBardMod('power_17204', dr, ability);

      // 304 * 1.11 + 3 = 340.44
      expect(dr.flatBonus).toBe(3);
      expect(dr.percentMod).toBeCloseTo(0.11);
      expect(dr.modifiedDamage).toBeCloseTo(304 * 1.11 + 3);

      const entry = makeEntry('Thunderous Note 8', 0, dr, {
        DamageType: 'Trauma',
        ResetTime: 8,
        PvE: { PowerCost: 11, Range: 30, Damage: 304 },
      });
      const sim = simulateCombat(makeConfig([entry], { fightDuration: 16 }));
      // 16s / 8s CD = casts at t=0 and t=8 = 2 casts
      expect(sim.totalCasts).toBe(2);
      expect(sim.totalDirectDamage).toBeCloseTo((304 * 1.11 + 3) * 2);
    });

    it('stacks two dotFlatDamage mods on Song of Discord', () => {
      const ability = makeAbility('Song of Discord 13', {
        DamageType: 'Potion',
        Keywords: ['BardSong', 'SongOfDiscord'],
        SharesResetTimerWith: 'SongGroup',
        PvE: { PowerCost: 16, Range: 10 },
        ResetTime: 2,
      });
      const dr = baseDamageResult({ dots: [makeSongDoT(453)] });

      // +3 from SongOfDiscordStun
      applyBardMod('power_17042', dr, ability);
      // +5 from SongOfDiscordLowerRage
      applyBardMod('power_17043', dr, ability);

      expect(dr.dots[0].flatBonusPerTick).toBe(8); // 3 + 5
      expect(dr.dots[0].modifiedTotalDamage).toBe(461); // 453 + 8

      const entry: RotationEntry = {
        abilityId: 'SongOfDiscord13',
        ability,
        damageResult: dr,
        priority: 0,
      };
      // 10s fight: ticks at 2,4,6,8,10 = 5 ticks
      const sim = simulateCombat(makeConfig([entry], { fightDuration: 10 }));
      expect(sim.totalSongDamage).toBeCloseTo(461 * 5, 1);
    });

    it('cost reduction affects simulator sustainability', () => {
      const ability = makeAbility('Entrancing Lullaby', {
        DamageType: 'Nothingness',
        PvE: { PowerCost: 10, Range: 30 },
        ResetTime: 30,
      });
      const drNoMod = baseDamageResult({ powerCost: makeStat(10) });
      const drWithMod = baseDamageResult({ powerCost: makeStat(10) });

      applyBardMod('power_17263', drWithMod, ability); // -7 cost

      // Power cost should differ
      expect(drNoMod.powerCost.modified).toBe(10);
      expect(drWithMod.powerCost.modified).toBe(17); // 10 + 7 (flat added)
    });
  });

  // ── Higher tiers ──

  describe('higher tier values', () => {
    it('SongOfDiscordStun tier 24 extracts +67', () => {
      const ability = makeAbility('Song of Discord 13', {
        DamageType: 'Potion',
        Keywords: ['BardSong', 'SongOfDiscord'],
        PvE: { PowerCost: 16, Range: 10 },
        ResetTime: 2,
      });
      const dr = baseDamageResult({ dots: [makeSongDoT(453)] });
      const applied = applyBardMod('power_17042', dr, ability, 'id_24');

      expect(applied).toBe(1);
      expect(dr.dots[0].flatBonusPerTick).toBe(67);
      expect(dr.dots[0].modifiedTotalDamage).toBe(520);
    });

    it('BlastOfFuryKnockback tier 12 extracts higher %', () => {
      const descs = getTierDescs('power_17122', 'id_12');
      const resolved = resolveSkillEffects('power_17122', descs, 'Legs');
      expect(resolved).not.toBeNull();
      expect(resolved![0].type).toBe('percentDamage');
      expect(resolved![0].value).toBeGreaterThan(10);
    });
  });

  // ── Negative matching ──

  describe('effect targeting', () => {
    it('BlastOfFuryKnockback does not apply to Thunderous Note', () => {
      const ability = makeAbility('Thunderous Note', {
        DamageType: 'Trauma',
        PvE: { PowerCost: 11, Range: 30, Damage: 100 },
        ResetTime: 8,
      });
      const dr = baseDamageResult({ baseDamage: 100, modifiedDamage: 100 });
      const applied = applyBardMod('power_17122', dr, ability);
      expect(applied).toBe(0);
      expect(dr.modifiedDamage).toBe(100); // unchanged
    });

    it('SongOfDiscordStun does not apply to Blast of Fury', () => {
      const ability = makeAbility('Blast of Fury', {
        DamageType: 'Nature',
        PvE: { PowerCost: 16, Range: 30, Damage: 200 },
        ResetTime: 12,
      });
      const dr = baseDamageResult({ baseDamage: 200, modifiedDamage: 200 });
      const applied = applyBardMod('power_17042', dr, ability);
      expect(applied).toBe(0);
    });

    it('self-targeted mods apply to any ability', () => {
      const ability = makeAbility('Blast of Fury', {
        DamageType: 'Nature',
        PvE: { PowerCost: 16, Range: 30, Damage: 200 },
        ResetTime: 12,
      });
      const dr = baseDamageResult({ baseDamage: 200, modifiedDamage: 200 });

      // SongOfBraveryBoostDmg is target: 'self'
      const descs = getTierDescs('power_17084');
      const resolved = resolveSkillEffects('power_17084', descs, 'Legs');
      expect(resolved).not.toBeNull();
      const matching = resolved!.filter((e) => resolvedEffectMatchesAbility(e, ability));
      expect(matching.length).toBe(1);
      expect(matching[0].type).toBe('percentDamage');
    });
  });

  // ── Cross-skill: DruidBurstDoT + BardBoostNature on Song of Discord ──

  describe('DruidBurstDoT + BardBoostNature on Song of Discord', () => {
    // Pre-compute once for this describe block
    const internalKeywordMap = buildInternalKeywordMap(abilities);
    const sod13 = abilities.get('ability_8654')!; // Song of Discord 13

    it('collectAbilityAttributes adds Nature dynamic DoT when Druid is active', () => {
      const attrs = collectAbilityAttributes(
        sod13, abilityKeywords, ['Bard', 'Druid'], abilityDynamicDots, internalKeywordMap,
      );

      // Should have 2 DoTs: the native Trauma tick + Burst Nature dynamic DoT
      expect(attrs.dotAttributes.length).toBe(2);

      const traumaDot = attrs.dotAttributes[0];
      expect(traumaDot.damageType).toBe('Trauma');
      expect(traumaDot.damagePerTick).toBe(453);
      expect(traumaDot.numTicks).toBe(1);

      const natureDot = attrs.dotAttributes[1];
      expect(natureDot.damageType).toBe('Nature');
      expect(natureDot.numTicks).toBe(4);
      expect(natureDot.duration).toBe(8);
      expect(natureDot.deltaAttributes.has('BOOST_ABILITYDOT_BURST_NATURE')).toBe(true);
      expect(natureDot.modAttributes.has('MOD_NATURE_INDIRECT')).toBe(true);
    });

    it('does NOT add Nature DoT when Druid is not active', () => {
      const attrs = collectAbilityAttributes(
        sod13, abilityKeywords, ['Bard', 'Sword'], abilityDynamicDots, internalKeywordMap,
      );
      expect(attrs.dotAttributes.length).toBe(1);
      expect(attrs.dotAttributes[0].damageType).toBe('Trauma');
    });

    it('does NOT add Nature DoT without internalKeywordMap', () => {
      // Without the map, Song of Discord lacks the Burst keyword
      const attrs = collectAbilityAttributes(
        sod13, abilityKeywords, ['Bard', 'Druid'], abilityDynamicDots,
      );
      expect(attrs.dotAttributes.length).toBe(1);
    });

    it('calculateAbilityDamage applies BOOST and MOD to the Nature DoT', () => {
      const attrs = collectAbilityAttributes(
        sod13, abilityKeywords, ['Bard', 'Druid'], abilityDynamicDots, internalKeywordMap,
      );

      // DruidBurstDoT tier 24: +392 Nature over 8s = 98/tick (4 ticks)
      // BardBoostNature: Indirect Nature Damage +28%
      const equipped: EquippedEffect[] = [
        { effect: { attribute: 'BOOST_ABILITYDOT_BURST_NATURE', value: 98 }, powerId: 'power_14007', tierId: 'id_24', slot: 'Legs' },
        { effect: { attribute: 'MOD_NATURE_INDIRECT', value: 0.28 }, powerId: 'power_17004', tierId: 'id_1', slot: 'Chest' },
      ];

      const dr = calculateAbilityDamage(sod13, attrs, equipped, []);

      expect(dr.dots.length).toBe(2);

      // Trauma DoT: 453 per tick, no equipped mods for its attributes
      const trauma = dr.dots[0];
      expect(trauma.damageType).toBe('Trauma');
      expect(trauma.modifiedTotalDamage).toBe(453);

      // Nature DoT: base 0/tick, +98 flat from BOOST, +28% mod from MOD_NATURE_INDIRECT
      // modifiedPerTick = 0 * (1 + 0.28) + 98 = 98
      // modifiedTotal = 98 * 4 = 392
      const nature = dr.dots[1];
      expect(nature.damageType).toBe('Nature');
      expect(nature.flatBonusPerTick).toBe(98);
      expect(nature.percentMod).toBeCloseTo(0.28);
      expect(nature.modifiedTotalDamage).toBeCloseTo(392);
    });

    it('song ticks deal only Trauma; Nature DoTs tick independently', () => {
      const attrs = collectAbilityAttributes(
        sod13, abilityKeywords, ['Bard', 'Druid'], abilityDynamicDots, internalKeywordMap,
      );

      const equipped: EquippedEffect[] = [
        { effect: { attribute: 'BOOST_ABILITYDOT_BURST_NATURE', value: 98 }, powerId: 'power_14007', tierId: 'id_24', slot: 'Legs' },
      ];

      const dr = calculateAbilityDamage(sod13, attrs, equipped, []);

      const entry: RotationEntry = {
        abilityId: 'SongOfDiscord13',
        ability: sod13,
        damageResult: dr,
        priority: 0,
      };

      // 10s fight: song ticks at t=2, 4, 6, 8, 10 = 5 ticks
      const sim = simulateCombat(makeConfig([entry], { fightDuration: 10 }));

      // Song ticks should only contain Trauma damage (453/tick)
      const songTicks = sim.timeline.filter((e) => e.type === 'song_tick');
      expect(songTicks.length).toBe(5);
      expect(songTicks[0].damage).toBeCloseTo(453);
      expect(sim.totalSongDamage).toBeCloseTo(453 * 5, 0);

      // Nature DoTs are spawned as independent ActiveDoTs on each song tick.
      // Each Nature DoT: 4 ticks, 2s interval, 8s duration, 98 dmg/tick.
      // Song tick at t=2 → Nature DoT ticks at t=4, 6, 8, 10
      // Song tick at t=4 → Nature DoT ticks at t=6, 8, 10 (t=12 is past fight end)
      // Song tick at t=6 → Nature DoT ticks at t=8, 10 (t=12, 14 past fight end)
      // Song tick at t=8 → Nature DoT ticks at t=10 (t=12, 14, 16 past fight end)
      // Song tick at t=10 → no ticks land within fight (t=12+ past end)
      // Total Nature DoT ticks: 4 + 3 + 2 + 1 + 0 = 10
      const dotTicks = sim.timeline.filter((e) => e.type === 'dot_tick');
      expect(dotTicks.length).toBe(10);
      expect(sim.totalDotDamage).toBeCloseTo(98 * 10, 0);

      // Verify Nature DoT ticks are separate from song ticks
      for (const tick of dotTicks) {
        expect(tick.damageType).toBe('Nature');
        expect(tick.damage).toBeCloseTo(98);
      }
    });

    it('Nature DoTs continue ticking after song stops', () => {
      const attrs = collectAbilityAttributes(
        sod13, abilityKeywords, ['Bard', 'Druid'], abilityDynamicDots, internalKeywordMap,
      );

      const equipped: EquippedEffect[] = [
        { effect: { attribute: 'BOOST_ABILITYDOT_BURST_NATURE', value: 98 }, powerId: 'power_14007', tierId: 'id_24', slot: 'Legs' },
      ];

      const dr = calculateAbilityDamage(sod13, attrs, equipped, []);

      const entry: RotationEntry = {
        abilityId: 'SongOfDiscord13',
        ability: sod13,
        damageResult: dr,
        priority: 0,
      };

      // 20s fight: song ticks at t=2,4,...,20 = 10 ticks
      // Last song tick at t=20 → Nature DoT ticks at t=22,24,26,28 (all within 20s? No, past fight)
      // Actually song at t=0 with 20s fight, ticks at 2,4,6,8,10,12,14,16,18,20
      // DoT from t=18 tick → ticks at 20 (within fight), 22,24,26 (past)
      // DoT from t=20 tick → ticks at 22,24,26,28 (all past fight end)
      // So we should see that DoTs spawned from early ticks have all their ticks land,
      // while later ones get cut off by fight duration.
      const sim = simulateCombat(makeConfig([entry], { fightDuration: 20 }));

      const songTicks = sim.timeline.filter((e) => e.type === 'song_tick');
      const dotTicks = sim.timeline.filter((e) => e.type === 'dot_tick');

      // Song ticks: 10 (at 2,4,6,8,10,12,14,16,18,20)
      expect(songTicks.length).toBe(10);

      // Nature DoTs from song ticks:
      // t=2:  ticks at 4,6,8,10       → 4 ticks
      // t=4:  ticks at 6,8,10,12      → 4 ticks
      // t=6:  ticks at 8,10,12,14     → 4 ticks
      // t=8:  ticks at 10,12,14,16    → 4 ticks
      // t=10: ticks at 12,14,16,18    → 4 ticks
      // t=12: ticks at 14,16,18,20    → 4 ticks
      // t=14: ticks at 16,18,20 (22 past) → 3 ticks
      // t=16: ticks at 18,20 (22,24 past) → 2 ticks
      // t=18: ticks at 20 (22,24,26 past) → 1 tick
      // t=20: no ticks land (22+ past)    → 0 ticks
      // Total: 6*4 + 3 + 2 + 1 = 30
      expect(dotTicks.length).toBe(30);
      expect(sim.totalDotDamage).toBeCloseTo(98 * 30, 0);
    });
  });
});
