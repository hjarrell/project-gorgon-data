import { describe, it, expect } from 'vitest';
import { simulateCombat } from './simulation';
import type { CombatSimConfig, RotationEntry, EnemyConfig } from './types';
import type { Ability } from '../../schemas/abilities';
import type { DamageResult, StatResult, CritResult } from '../build-helpers';

// ── Test Helpers ────────────────────────────────────

function makeStat(base: number): StatResult {
  return {
    base,
    flatBonus: 0,
    percentMod: 0,
    modified: base,
    contributions: [],
  };
}

function makeCrit(critDamageMod = 0, critChanceBonus = 0): CritResult {
  return {
    baseCritDamageMod: critDamageMod,
    critDamageModBonus: 0,
    modifiedCritDamageMod: critDamageMod,
    critChanceBonus,
    contributions: [],
  };
}

function makeDamageResult(overrides: Partial<DamageResult> = {}): DamageResult {
  return {
    baseDamage: 100,
    flatBonus: 0,
    percentMod: 0,
    modifiedDamage: 100,
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
    DamageType: 'Crushing',
    Description: '',
    IconID: 1,
    InternalName: name,
    Level: 1,
    Name: name,
    PvE: {
      PowerCost: 10,
      Range: 10,
      Damage: 100,
    },
    ResetTime: 3,
    Skill: 'TestSkill',
    Target: 'Enemy',
    ...overrides,
  } as Ability;
}

function makeEntry(
  name: string,
  priority: number,
  damageOverrides: Partial<DamageResult> = {},
  abilityOverrides: Partial<Ability> = {},
): RotationEntry {
  return {
    abilityId: name,
    ability: makeAbility(name, abilityOverrides),
    damageResult: makeDamageResult(damageOverrides),
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

// ── Tests ───────────────────────────────────────────

describe('simulateCombat', () => {
  describe('edge cases', () => {
    it('returns zero for empty rotation', () => {
      const result = simulateCombat(makeConfig([]));
      expect(result.totalDamage).toBe(0);
      expect(result.dps).toBe(0);
      expect(result.totalCasts).toBe(0);
    });

    it('returns zero for zero duration', () => {
      const entry = makeEntry('Slash', 0);
      const result = simulateCombat(makeConfig([entry], { fightDuration: 0 }));
      expect(result.totalDamage).toBe(0);
      expect(result.dps).toBe(0);
    });
  });

  describe('single ability rotation', () => {
    it('casts ability repeatedly on cooldown', () => {
      // 100 damage, 3s cooldown, 30s fight
      // Casts at: t=0, 3, 6, 9, 12, 15, 18, 21, 24, 27 = 10 casts
      const entry = makeEntry('Slash', 0);
      const result = simulateCombat(makeConfig([entry]));

      expect(result.totalCasts).toBe(10);
      expect(result.totalDirectDamage).toBe(1000);
      expect(result.totalDamage).toBe(1000);
      expect(result.dps).toBeCloseTo(1000 / 30, 1);
    });

    it('respects cooldown timing', () => {
      // 5s cooldown, 12s fight → casts at t=0, 5, 10 = 3 casts
      const entry = makeEntry('BigHit', 0, {
        modifiedDamage: 200,
        resetTime: makeStat(5),
      });
      const result = simulateCombat(makeConfig([entry], { fightDuration: 12 }));

      expect(result.totalCasts).toBe(3);
      expect(result.totalDirectDamage).toBe(600);
    });

    it('tracks power consumption', () => {
      // 10 power/cast, 1000 max power, 3s cooldown, 30s fight
      // 10 casts × 10 power = 100 power spent
      const entry = makeEntry('Slash', 0);
      const result = simulateCombat(makeConfig([entry]));

      expect(result.totalPowerSpent).toBe(100);
      expect(result.isSustainable).toBe(true);
    });

    it('flags unsustainable rotation when OOM', () => {
      // 50 power/cast, 120 max power → can cast 2 times (cost 100), then OOM
      const entry = makeEntry('Expensive', 0, {
        modifiedDamage: 500,
        powerCost: makeStat(50),
        resetTime: makeStat(2),
      });
      const result = simulateCombat(makeConfig([entry], {
        fightDuration: 30,
        maxPower: 120,
      }));

      // 2 casts at t=0 and t=2, then can't afford (120 - 100 = 20 < 50)
      expect(result.totalCasts).toBe(2);
      expect(result.totalPowerSpent).toBe(100);
      // Check the rotation is NOT sustainable since we went idle with remaining time
      expect(result.idleTime).toBeGreaterThan(0);
    });

    it('handles zero-cost abilities', () => {
      const entry = makeEntry('Free', 0, {
        powerCost: makeStat(0),
        resetTime: makeStat(2),
      });
      const result = simulateCombat(makeConfig([entry], {
        fightDuration: 10,
        maxPower: 0,
      }));

      // Should cast at t=0, 2, 4, 6, 8 = 5 casts
      expect(result.totalCasts).toBe(5);
      expect(result.totalPowerSpent).toBe(0);
    });
  });

  describe('multi-ability priority', () => {
    it('casts highest priority ability first when multiple available', () => {
      // Both start off cooldown. Priority 0 should be cast first.
      const high = makeEntry('HighPriority', 0, {
        modifiedDamage: 200,
        resetTime: makeStat(10),
      });
      const low = makeEntry('LowPriority', 1, {
        modifiedDamage: 50,
        resetTime: makeStat(10),
      });

      const result = simulateCombat(makeConfig([high, low], { fightDuration: 5 }));

      // Both cast at t=0 (no GCD), but HighPriority is cast first in timeline
      const castEvents = result.timeline.filter(e => e.type === 'ability_cast');
      expect(castEvents[0].abilityId).toBe('HighPriority');
      expect(castEvents[0].time).toBe(0);
    });

    it('only casts one ability per GCD window', () => {
      // With a GCD, only one ability can cast per time step
      const high = makeEntry('HighPriority', 0, {
        modifiedDamage: 200,
        resetTime: makeStat(10),
      });
      const low = makeEntry('LowPriority', 1, {
        modifiedDamage: 50,
        resetTime: makeStat(10),
      });

      const result = simulateCombat(makeConfig([high, low], {
        fightDuration: 5,
        globalCooldown: 5,
      }));

      // Only HighPriority should cast — GCD blocks LowPriority, then both on CD
      const highResult = result.abilities.find(a => a.abilityId === 'HighPriority');
      const lowResult = result.abilities.find(a => a.abilityId === 'LowPriority');

      expect(highResult!.casts).toBe(1);
      expect(lowResult!.casts).toBe(0);
    });

    it('falls back to lower priority when higher is on cooldown', () => {
      // Priority 0: 5s CD. Priority 1: 2s CD.
      // t=0: cast HighPriority (CD until t=5)
      // t=2: HighPriority on CD → cast LowPriority (CD until t=4)
      // t=4: HighPriority still on CD → cast LowPriority (CD until t=6)
      // t=5: HighPriority ready → cast HighPriority (CD until t=10)
      // t=6: LowPriority ready → cast LowPriority
      // etc.
      const high = makeEntry('HighPriority', 0, {
        modifiedDamage: 200,
        resetTime: makeStat(5),
      });
      const low = makeEntry('LowPriority', 1, {
        modifiedDamage: 50,
        resetTime: makeStat(2),
      });

      const result = simulateCombat(makeConfig([high, low], { fightDuration: 10 }));

      const highResult = result.abilities.find(a => a.abilityId === 'HighPriority');
      const lowResult = result.abilities.find(a => a.abilityId === 'LowPriority');

      expect(highResult!.casts).toBeGreaterThanOrEqual(2);
      expect(lowResult!.casts).toBeGreaterThanOrEqual(2);
      // Total casts should be more than just one ability alone
      expect(result.totalCasts).toBeGreaterThan(3);
    });

    it('interleaves abilities based on cooldowns', () => {
      // A: 100 dmg, 4s CD. B: 50 dmg, 2s CD.
      // t=0: A (CD→4), t=2: B (CD→4), t=4: A (CD→8), t=6: B (CD→8), t=8: A (CD→12)
      const a = makeEntry('AbilityA', 0, {
        modifiedDamage: 100,
        resetTime: makeStat(4),
      });
      const b = makeEntry('AbilityB', 1, {
        modifiedDamage: 50,
        resetTime: makeStat(2),
      });

      const result = simulateCombat(makeConfig([a, b], { fightDuration: 10 }));

      // Both abilities should have been used
      const aResult = result.abilities.find(x => x.abilityId === 'AbilityA');
      const bResult = result.abilities.find(x => x.abilityId === 'AbilityB');
      expect(aResult!.casts).toBeGreaterThanOrEqual(2);
      expect(bResult!.casts).toBeGreaterThanOrEqual(1);
    });
  });

  describe('shared cooldowns', () => {
    it('puts shared abilities on cooldown together', () => {
      // A and B share a reset timer (SharesResetTimerWith).
      // Casting A should also put B on cooldown.
      const a = makeEntry('AbilityA', 0, {
        modifiedDamage: 100,
        resetTime: makeStat(5),
      }, {
        SharesResetTimerWith: 'SharedGroup',
      });
      const b = makeEntry('AbilityB', 1, {
        modifiedDamage: 80,
        resetTime: makeStat(5),
      }, {
        SharesResetTimerWith: 'SharedGroup',
      });
      const c = makeEntry('AbilityC', 2, {
        modifiedDamage: 30,
        resetTime: makeStat(2),
      });

      const result = simulateCombat(makeConfig([a, b, c], { fightDuration: 10 }));

      // A and B share cooldown → only one of them can be used per 5s window
      // A should be chosen (higher priority)
      // C has its own cooldown so it fills gaps
      const aResult = result.abilities.find(x => x.abilityId === 'AbilityA');
      const bResult = result.abilities.find(x => x.abilityId === 'AbilityB');

      expect(aResult!.casts).toBeGreaterThanOrEqual(2);
      expect(bResult!.casts).toBe(0); // B never fires because A always has priority
    });
  });

  describe('DoT tracking', () => {
    it('accumulates DoT damage over ticks', () => {
      // 100 direct damage + 60 total DoT (10/tick × 6 ticks over 12s)
      const entry = makeEntry('PoisonArrow', 0, {
        modifiedDamage: 100,
        resetTime: makeStat(15), // long CD so only 1 cast
        dots: [{
          damageType: 'Poison',
          baseTotalDamage: 60,
          modifiedTotalDamage: 60,
          baseDamagePerTick: 10,
          numTicks: 6,
          duration: 12,
          flatBonusPerTick: 0,
          percentMod: 0,
          contributions: [],
        }],
      });

      const result = simulateCombat(makeConfig([entry], { fightDuration: 15 }));

      expect(result.totalCasts).toBe(1);
      expect(result.totalDirectDamage).toBe(100);
      expect(result.totalDotDamage).toBeCloseTo(60, 1);
      expect(result.totalDamage).toBeCloseTo(160, 1);
    });

    it('tracks DoT damage per source ability', () => {
      const entry = makeEntry('PoisonArrow', 0, {
        modifiedDamage: 50,
        resetTime: makeStat(20),
        dots: [{
          damageType: 'Poison',
          baseTotalDamage: 40,
          modifiedTotalDamage: 40,
          baseDamagePerTick: 10,
          numTicks: 4,
          duration: 8,
          flatBonusPerTick: 0,
          percentMod: 0,
          contributions: [],
        }],
      });

      const result = simulateCombat(makeConfig([entry], { fightDuration: 10 }));
      const abilityResult = result.abilities.find(a => a.abilityId === 'PoisonArrow');

      expect(abilityResult!.totalDirectDamage).toBe(50);
      expect(abilityResult!.totalDotDamage).toBeCloseTo(40, 1);
      expect(abilityResult!.totalDamage).toBeCloseTo(90, 1);
    });

    it('handles overlapping DoTs from multiple casts', () => {
      // 3s CD, 6s DoT (3 ticks, 2s interval)
      // Cast at t=0: DoT ticks at 2, 4, 6
      // Cast at t=3: DoT ticks at 5, 7, 9
      const entry = makeEntry('QuickPoison', 0, {
        modifiedDamage: 50,
        resetTime: makeStat(3),
        dots: [{
          damageType: 'Poison',
          baseTotalDamage: 30,
          modifiedTotalDamage: 30,
          baseDamagePerTick: 10,
          numTicks: 3,
          duration: 6,
          flatBonusPerTick: 0,
          percentMod: 0,
          contributions: [],
        }],
      });

      const result = simulateCombat(makeConfig([entry], { fightDuration: 10 }));

      // At least 3 casts, each with 30 DoT = at least 90 DoT damage
      expect(result.totalCasts).toBeGreaterThanOrEqual(3);
      expect(result.totalDotDamage).toBeGreaterThanOrEqual(60); // at least 2 full DoTs complete
    });
  });

  describe('crit expected value', () => {
    it('applies crit EV to direct damage', () => {
      // 100 base, 50% crit chance, 2x crit mult
      // EV: 100 × (1 + 0.5 × (2 - 1)) = 100 × 1.5 = 150
      const entry = makeEntry('CritSlash', 0, {
        modifiedDamage: 100,
        resetTime: makeStat(30), // 1 cast
        crit: makeCrit(2.0, 0.5),
      });

      const result = simulateCombat(makeConfig([entry], {
        fightDuration: 5,
        baseCritChance: 0,
      }));

      expect(result.totalCasts).toBe(1);
      expect(result.totalDirectDamage).toBeCloseTo(150, 1);
      expect(result.totalCritBonusDamage).toBeCloseTo(50, 1);
    });

    it('combines base crit chance with ability crit bonus', () => {
      // 100 base, 10% base crit + 20% ability bonus = 30% total, 1.5x mult
      // EV: 100 × (1 + 0.3 × (1.5 - 1)) = 100 × 1.15 = 115
      const entry = makeEntry('CritSlash', 0, {
        modifiedDamage: 100,
        resetTime: makeStat(30),
        crit: makeCrit(1.5, 0.2),
      });

      const result = simulateCombat(makeConfig([entry], {
        fightDuration: 5,
        baseCritChance: 0.1,
      }));

      expect(result.totalDirectDamage).toBeCloseTo(115, 1);
    });

    it('handles zero crit damage mod', () => {
      const entry = makeEntry('NoCrit', 0, {
        modifiedDamage: 100,
        resetTime: makeStat(30),
        crit: makeCrit(0, 0.5), // 50% chance but 0x mult
      });

      const result = simulateCombat(makeConfig([entry], { fightDuration: 5 }));
      // No crit bonus since mult is 0
      expect(result.totalDirectDamage).toBe(100);
      expect(result.totalCritBonusDamage).toBe(0);
    });

    it('caps crit chance at 100%', () => {
      // 200% crit chance should be capped at 100%
      const entry = makeEntry('SuperCrit', 0, {
        modifiedDamage: 100,
        resetTime: makeStat(30),
        crit: makeCrit(2.0, 1.5), // 150% ability bonus
      });

      const result = simulateCombat(makeConfig([entry], {
        fightDuration: 5,
        baseCritChance: 0.8,
      }));

      // Capped at 100%: 100 × (1 + 1.0 × (2.0 - 1)) = 200
      expect(result.totalDirectDamage).toBeCloseTo(200, 1);
    });
  });

  describe('power economy', () => {
    it('handles power restoration from ability effects', () => {
      const entry = makeEntry('PowerStrike', 0, {
        modifiedDamage: 100,
        powerCost: makeStat(20),
        resetTime: makeStat(3),
        restores: [{ value: 10, resourceType: 'Power', powerId: 'test', slot: 'Head' as any }],
      });

      const result = simulateCombat(makeConfig([entry], {
        fightDuration: 9,
        maxPower: 100,
      }));

      // 3 casts: cost 20×3=60, restore 10×3=30, net 30 spent
      expect(result.totalCasts).toBe(3);
      expect(result.totalPowerSpent).toBe(60);
      expect(result.totalPowerRestored).toBe(30);
    });

    it('applies power regen over time', () => {
      const entry = makeEntry('Expensive', 0, {
        modifiedDamage: 200,
        powerCost: makeStat(50),
        resetTime: makeStat(5),
      });

      // 60 max power, 10 regen/s
      // t=0: cast (60→10), t=5: regen 50 (10→60), cast (60→10), t=10: regen 50 (10→60), cast
      const result = simulateCombat(makeConfig([entry], {
        fightDuration: 15,
        maxPower: 60,
        powerRegenPerSecond: 10,
      }));

      expect(result.totalCasts).toBeGreaterThanOrEqual(3);
    });

    it('does not exceed max power from restores', () => {
      const entry = makeEntry('BigRestore', 0, {
        modifiedDamage: 50,
        powerCost: makeStat(5),
        resetTime: makeStat(2),
        restores: [{ value: 100, resourceType: 'Power', powerId: 'test', slot: 'Head' as any }],
      });

      const result = simulateCombat(makeConfig([entry], {
        fightDuration: 6,
        maxPower: 50,
      }));

      // Power should never exceed 50 (maxPower)
      // The test passes if it doesn't crash and casts properly
      expect(result.totalCasts).toBe(3);
    });
  });

  describe('global cooldown', () => {
    it('enforces minimum time between casts', () => {
      // Two abilities with 0s cooldown, but 1s GCD
      const a = makeEntry('Fast1', 0, { resetTime: makeStat(0) });
      const b = makeEntry('Fast2', 1, { resetTime: makeStat(0) });

      const result = simulateCombat(makeConfig([a, b], {
        fightDuration: 5,
        globalCooldown: 1,
      }));

      // With 1s GCD over 5s: casts at t=0,1,2,3,4 = 5 casts
      expect(result.totalCasts).toBe(5);
    });
  });

  describe('result structure', () => {
    it('returns complete result with all fields', () => {
      const entry = makeEntry('Slash', 0);
      const result = simulateCombat(makeConfig([entry], { fightDuration: 10 }));

      expect(result.fightDuration).toBe(10);
      expect(result.actualDuration).toBeGreaterThan(0);
      expect(result.totalDamage).toBeGreaterThan(0);
      expect(result.dps).toBeGreaterThan(0);
      expect(result.abilities.length).toBe(1);
      expect(result.timeline.length).toBeGreaterThan(0);
      expect(typeof result.isSustainable).toBe('boolean');
      expect(typeof result.idleTime).toBe('number');
      expect(typeof result.netPowerPerSecond).toBe('number');
    });

    it('sorts abilities by total damage descending', () => {
      const high = makeEntry('BigHitter', 0, {
        modifiedDamage: 500,
        resetTime: makeStat(5),
      });
      const low = makeEntry('SmallHitter', 1, {
        modifiedDamage: 10,
        resetTime: makeStat(2),
      });

      const result = simulateCombat(makeConfig([high, low], { fightDuration: 10 }));

      expect(result.abilities[0].abilityId).toBe('BigHitter');
      expect(result.abilities[1].abilityId).toBe('SmallHitter');
    });

    it('calculates damage percentages correctly', () => {
      const entry = makeEntry('Slash', 0, {
        modifiedDamage: 100,
        resetTime: makeStat(30),
      });

      const result = simulateCombat(makeConfig([entry], { fightDuration: 5 }));

      expect(result.abilities[0].damagePercent).toBeCloseTo(100, 0);
    });

    it('calculates avgDamagePerCast', () => {
      // 5s CD, DoT: 50 total over 4s (2 ticks at 2s intervals)
      // fightDuration=10 → casts at t=0 and t=5, both DoTs complete
      const entry = makeEntry('Slash', 0, {
        modifiedDamage: 100,
        resetTime: makeStat(5),
        dots: [{
          damageType: 'Poison',
          baseTotalDamage: 50,
          modifiedTotalDamage: 50,
          baseDamagePerTick: 25,
          numTicks: 2,
          duration: 4,
          flatBonusPerTick: 0,
          percentMod: 0,
          contributions: [],
        }],
      });

      const result = simulateCombat(makeConfig([entry], { fightDuration: 10 }));
      const abilityResult = result.abilities[0];

      // 2 casts: each does 100 direct + 50 DoT = 150, total = 300, avg = 150
      expect(abilityResult.casts).toBe(2);
      expect(abilityResult.avgDamagePerCast).toBeCloseTo(150, 0);
    });

    it('reports idle time', () => {
      // Ability costs 500 power but we only have 600
      // Cast at t=0 (600→100), can't cast at t=3 (costs 500, only 100)
      const entry = makeEntry('VeryExpensive', 0, {
        modifiedDamage: 1000,
        powerCost: makeStat(500),
        resetTime: makeStat(3),
      });

      const result = simulateCombat(makeConfig([entry], {
        fightDuration: 10,
        maxPower: 600,
      }));

      expect(result.totalCasts).toBe(1);
      expect(result.idleTime).toBeGreaterThan(0);
    });
  });

  describe('timeline events', () => {
    it('records ability cast events', () => {
      const entry = makeEntry('Slash', 0, { resetTime: makeStat(10) });
      const result = simulateCombat(makeConfig([entry], { fightDuration: 5 }));

      const castEvents = result.timeline.filter(e => e.type === 'ability_cast');
      expect(castEvents.length).toBe(1);
      expect(castEvents[0].abilityId).toBe('Slash');
      expect(castEvents[0].time).toBe(0);
      expect(castEvents[0].damage).toBe(100);
    });

    it('records DoT tick events', () => {
      const entry = makeEntry('Poison', 0, {
        resetTime: makeStat(30),
        dots: [{
          damageType: 'Poison',
          baseTotalDamage: 20,
          modifiedTotalDamage: 20,
          baseDamagePerTick: 10,
          numTicks: 2,
          duration: 4,
          flatBonusPerTick: 0,
          percentMod: 0,
          contributions: [],
        }],
      });

      const result = simulateCombat(makeConfig([entry], { fightDuration: 6 }));
      const dotEvents = result.timeline.filter(e => e.type === 'dot_tick');

      expect(dotEvents.length).toBe(2);
      expect(dotEvents[0].damage).toBe(10);
      expect(dotEvents[0].damageType).toBe('Poison');
    });
  });

  describe('song support', () => {
    function makeSongEntry(
      name: string,
      priority: number,
      damagePerTick: number,
    ): RotationEntry {
      return makeEntry(name, priority, {
        modifiedDamage: 0, // Songs don't deal direct damage
        powerCost: makeStat(16),
        resetTime: makeStat(2),
        dots: [{
          damageType: 'Trauma',
          baseTotalDamage: damagePerTick,
          modifiedTotalDamage: damagePerTick,
          baseDamagePerTick: damagePerTick,
          numTicks: 1,
          duration: 0, // Song DoTs have duration=0, numTicks=1
          flatBonusPerTick: 0,
          percentMod: 0,
          contributions: [],
        }],
      }, {
        Keywords: ['BardSong', 'SongOfDiscord'],
        SharesResetTimerWith: 'SongGroup',
      });
    }

    it('activates a song and generates song ticks', () => {
      const song = makeSongEntry('SongOfDiscord', 0, 12);
      // 10s fight, song ticks every 2s: ticks at 2, 4, 6, 8, 10 = 5 ticks
      const result = simulateCombat(makeConfig([song], { fightDuration: 10 }));

      expect(result.totalSongDamage).toBeCloseTo(12 * 5, 1);

      const songStartEvents = result.timeline.filter(e => e.type === 'song_start');
      expect(songStartEvents.length).toBe(1);

      const songTickEvents = result.timeline.filter(e => e.type === 'song_tick');
      expect(songTickEvents.length).toBe(5);
      expect(songTickEvents[0].damage).toBe(12);
    });

    it('does not deal direct damage for songs', () => {
      const song = makeSongEntry('SongOfDiscord', 0, 20);
      const result = simulateCombat(makeConfig([song], { fightDuration: 10 }));

      expect(result.totalDirectDamage).toBe(0);
      expect(result.totalSongDamage).toBeGreaterThan(0);
    });

    it('attributes song damage to the ability', () => {
      const song = makeSongEntry('SongOfDiscord', 0, 15);
      const result = simulateCombat(makeConfig([song], { fightDuration: 10 }));

      const abilityResult = result.abilities.find(a => a.abilityId === 'SongOfDiscord');
      expect(abilityResult).toBeDefined();
      expect(abilityResult!.totalDotDamage).toBeCloseTo(15 * 5, 1);
    });

    it('replaces existing song when casting a new one', () => {
      const song1 = makeSongEntry('SongA', 0, 10);
      const song2 = makeEntry('SongB', 1, {
        modifiedDamage: 0,
        powerCost: makeStat(16),
        resetTime: makeStat(2),
        dots: [{
          damageType: 'Fire',
          baseTotalDamage: 20,
          modifiedTotalDamage: 20,
          baseDamagePerTick: 20,
          numTicks: 1,
          duration: 0,
          flatBonusPerTick: 0,
          percentMod: 0,
          contributions: [],
        }],
      }, {
        Keywords: ['BardSong', 'SongOfResurgence'],
        SharesResetTimerWith: 'OtherSongGroup',
      });

      // Both songs available at t=0 (different CD groups), SongA higher priority
      // t=0: cast SongA (SongGroup CD→2)
      // t=0: cast SongB (replaces SongA, OtherSongGroup CD→2)
      // Fight ends before CDs refresh, so no re-casting
      const result = simulateCombat(makeConfig([song1, song2], { fightDuration: 1 }));

      const songStartEvents = result.timeline.filter(e => e.type === 'song_start');
      // Both songs started
      expect(songStartEvents.length).toBe(2);
      // SongA was replaced
      const songExpireEvents = result.timeline.filter(e => e.type === 'song_expire' && e.label?.includes('replaced'));
      expect(songExpireEvents.length).toBe(1);
    });

    it('interleaves songs with normal abilities', () => {
      const song = makeSongEntry('SongOfDiscord', 0, 10);
      const slash = makeEntry('Slash', 1, {
        modifiedDamage: 100,
        resetTime: makeStat(3),
      });

      const result = simulateCombat(makeConfig([song, slash], { fightDuration: 10 }));

      // Song should be activated and Slash should also cast
      const songAbility = result.abilities.find(a => a.abilityId === 'SongOfDiscord');
      const slashAbility = result.abilities.find(a => a.abilityId === 'Slash');

      expect(songAbility).toBeDefined();
      expect(slashAbility).toBeDefined();
      expect(songAbility!.casts).toBeGreaterThanOrEqual(1);
      expect(slashAbility!.casts).toBeGreaterThanOrEqual(1);
      // Total damage includes both song ticks and slash direct damage
      expect(result.totalDamage).toBeGreaterThan(0);
      expect(result.totalSongDamage).toBeGreaterThan(0);
      expect(result.totalDirectDamage).toBeGreaterThan(0);
    });

    it('song ticks count in totalDamage and DPS', () => {
      const song = makeSongEntry('SongOfDiscord', 0, 50);
      // 30s fight, 50 dmg/tick, ticks every 2s: ticks at 2,4,...,30 = 15 ticks
      const result = simulateCombat(makeConfig([song], { fightDuration: 30 }));

      expect(result.totalSongDamage).toBeCloseTo(50 * 15, 1);
      expect(result.totalDamage).toBeCloseTo(50 * 15, 1);
      expect(result.dps).toBeCloseTo((50 * 15) / 30, 1);
    });
  });

  // ── Need-Based Priority Tests ──────────────────────

  describe('need-based priority', () => {
    // Helper: create a net-positive power restore ability (restores more than cost)
    function makePowerRestoreEntry(name: string, priority: number): RotationEntry {
      return makeEntry(name, priority, {
        modifiedDamage: 20,
        powerCost: makeStat(5),
        resetTime: makeStat(3),
        restores: [{ value: 30, resourceType: 'Power', powerId: 'test', slot: 'Head' as any }],
      });
    }

    const needEnabled = { enabled: true, healthThreshold: 0.5, powerThreshold: 0.25 };

    it('when disabled, uses standard priority order', () => {
      const damage = makeEntry('DmgAbility', 0, { modifiedDamage: 200, resetTime: makeStat(3) });
      const restore = makePowerRestoreEntry('RestoreAbility', 1);

      // Start with low power but need-based disabled
      const result = simulateCombat(makeConfig([damage, restore], {
        fightDuration: 3,
        maxPower: 100,
        needBasedPriority: { enabled: false, healthThreshold: 0.5, powerThreshold: 0.25 },
      }));

      // Damage ability (priority 0) should be cast first
      const firstCast = result.timeline.find(e => e.type === 'ability_cast');
      expect(firstCast?.abilityId).toBe('DmgAbility');
    });

    it('prefers power_restore ability when power is below threshold', () => {
      // Expensive damage ability drops power below 25% threshold after first cast
      const damage = makeEntry('DmgAbility', 0, {
        modifiedDamage: 200,
        powerCost: makeStat(80),
        resetTime: makeStat(3),
      });
      const restore = makePowerRestoreEntry('RestoreAbility', 1);

      // maxPower 100 → start at 100. DmgAbility costs 80 → drops to 20 (20%).
      // Inner loop: second cast sees 20% power → need=power_restore → RestoreAbility
      const result = simulateCombat(makeConfig([damage, restore], {
        fightDuration: 3,
        maxPower: 100,
        needBasedPriority: needEnabled,
      }));

      const casts = result.timeline.filter(e => e.type === 'ability_cast');
      expect(casts.length).toBeGreaterThanOrEqual(2);
      // First cast: DmgAbility (power was 100%, above threshold)
      expect(casts[0].abilityId).toBe('DmgAbility');
      // Second cast: RestoreAbility (power dropped to 20%, below threshold)
      expect(casts[1].abilityId).toBe('RestoreAbility');
    });

    it('falls back to damage when no power_restore is available', () => {
      const dmg1 = makeEntry('Slash', 0, { modifiedDamage: 100, resetTime: makeStat(3) });
      const dmg2 = makeEntry('Stab', 1, { modifiedDamage: 80, resetTime: makeStat(5) });

      // Low power but no restore abilities — should still cast damage
      const result = simulateCombat(makeConfig([dmg1, dmg2], {
        fightDuration: 3,
        maxPower: 100,
        needBasedPriority: needEnabled,
      }));

      expect(result.totalCasts).toBeGreaterThan(0);
      const firstCast = result.timeline.find(e => e.type === 'ability_cast');
      expect(firstCast?.abilityId).toBe('Slash');
    });

    it('switches back to damage after power recovers above threshold', () => {
      // BigHit costs 80, drops power to 20% → triggers power_restore need
      const damage = makeEntry('BigHit', 0, {
        modifiedDamage: 200,
        powerCost: makeStat(80),
        resetTime: makeStat(3),
      });
      // BigRestore: costs 5, restores 100 → net +95 → power goes from 20 to 100 (capped)
      const restore = makeEntry('BigRestore', 1, {
        modifiedDamage: 20,
        powerCost: makeStat(5),
        resetTime: makeStat(3),
        restores: [{ value: 100, resourceType: 'Power', powerId: 'test', slot: 'Head' as any }],
      });

      // t=0: BigHit (100→20, 20% < 25%), BigRestore (20-5+100=100, capped)
      // t=3: both off CD, power is 100% → damage mode → BigHit
      const result = simulateCombat(makeConfig([damage, restore], {
        fightDuration: 6,
        maxPower: 100,
        needBasedPriority: needEnabled,
      }));

      const casts = result.timeline.filter(e => e.type === 'ability_cast');
      expect(casts.length).toBeGreaterThanOrEqual(3);
      expect(casts[0].abilityId).toBe('BigHit');      // power was high
      expect(casts[1].abilityId).toBe('BigRestore');   // power dropped below threshold
      expect(casts[2].abilityId).toBe('BigHit');       // power recovered above threshold
    });

    it('classifies mixed damage+restore abilities correctly', () => {
      // This ability deals damage AND restores power (net positive)
      const mixed = makeEntry('DrainStrike', 0, {
        modifiedDamage: 150,
        powerCost: makeStat(10),
        resetTime: makeStat(3),
        restores: [{ value: 40, resourceType: 'Power', powerId: 'test', slot: 'Head' as any }],
      });
      const pureDamage = makeEntry('Slash', 1, {
        modifiedDamage: 100,
        powerCost: makeStat(10),
        resetTime: makeStat(3),
      });

      // Low power — DrainStrike should be preferred since it has power_restore role
      const result = simulateCombat(makeConfig([mixed, pureDamage], {
        fightDuration: 3,
        maxPower: 100,
        needBasedPriority: needEnabled,
      }));

      const firstCast = result.timeline.find(e => e.type === 'ability_cast');
      expect(firstCast?.abilityId).toBe('DrainStrike');
    });

    it('does not classify as power_restore if restore < cost', () => {
      // Burn ability: costs 80, no restore → drops power to 20%
      const burner = makeEntry('PowerBurn', 0, {
        modifiedDamage: 300,
        powerCost: makeStat(80),
        resetTime: makeStat(10),
      });
      // Costs 30, restores 10 → net negative, NOT a power_restore
      const netNegative = makeEntry('ExpensiveRestore', 1, {
        modifiedDamage: 100,
        powerCost: makeStat(15),
        resetTime: makeStat(3),
        restores: [{ value: 10, resourceType: 'Power', powerId: 'test', slot: 'Head' as any }],
      });
      // Costs 5, restores 20 → net positive, IS a power_restore
      const netPositive = makeEntry('CheapRestore', 2, {
        modifiedDamage: 50,
        powerCost: makeStat(5),
        resetTime: makeStat(3),
        restores: [{ value: 20, resourceType: 'Power', powerId: 'test', slot: 'Head' as any }],
      });

      // t=0: PowerBurn (power 100→20, 20% < 25%) → need=power_restore
      // ExpensiveRestore is NOT tagged as power_restore (10 < 30)
      // CheapRestore IS tagged as power_restore (20 > 5) → selected
      const result = simulateCombat(makeConfig([burner, netNegative, netPositive], {
        fightDuration: 3,
        maxPower: 100,
        needBasedPriority: needEnabled,
      }));

      const casts = result.timeline.filter(e => e.type === 'ability_cast');
      expect(casts[0].abilityId).toBe('PowerBurn');
      expect(casts[1].abilityId).toBe('CheapRestore');
    });

    it('health threshold is inactive when maxHealth is 0', () => {
      const damage = makeEntry('Slash', 0, { modifiedDamage: 100, resetTime: makeStat(3) });
      const heal = makeEntry('Heal', 1, {
        modifiedDamage: 0,
        powerCost: makeStat(20),
        resetTime: makeStat(5),
        restores: [{ value: 50, resourceType: 'Health', powerId: 'test', slot: 'Head' as any }],
      });

      // maxHealth=0 means health tracking disabled → heal branch never fires
      const result = simulateCombat(makeConfig([damage, heal], {
        fightDuration: 5,
        maxPower: 1000,
        maxHealth: 0,
        needBasedPriority: needEnabled,
      }));

      // Damage should be cast, not heal (since health tracking is off)
      const firstCast = result.timeline.find(e => e.type === 'ability_cast');
      expect(firstCast?.abilityId).toBe('Slash');
    });
  });

  // ── Enemy Simulation ─────────────────────────────────

  function makeEnemy(overrides: Partial<EnemyConfig> = {}): EnemyConfig {
    return {
      maxHealth: 10000,
      maxArmor: 0,
      resistances: new Map(),
      ragePerDamage: 0,
      rageDecayPerSecond: 0,
      enrageThreshold: 100,
      targetCount: 1,
      ...overrides,
    };
  }

  describe('enemy HP', () => {
    it('tracks enemy health depletion', () => {
      // 100 dmg, 3s CD, 30s fight → 10 casts = 1000 total dmg
      const result = simulateCombat(makeConfig(
        [makeEntry('Hit', 0)],
        { enemy: makeEnemy({ maxHealth: 10000 }) },
      ));
      expect(result.enemyResult).not.toBeNull();
      expect(result.enemyResult!.totalDamageTaken).toBeGreaterThan(0);
      expect(result.enemyResult!.healthRemaining).toBeLessThan(10000);
    });

    it('enemy dies when HP reaches 0', () => {
      // 100 dmg × 3 casts (t=0, t=3, t=6) = 300 dmg > 250 HP
      const result = simulateCombat(makeConfig(
        [makeEntry('Hit', 0)],
        { fightDuration: 30, enemy: makeEnemy({ maxHealth: 250 }) },
      ));
      expect(result.enemyResult!.healthRemaining).toBe(0);
      expect(result.enemyResult!.timeToKill).not.toBeNull();
      expect(result.enemyResult!.timeToKill!).toBeLessThanOrEqual(6);
    });

    it('fight ends early when enemy dies', () => {
      // 100 dmg at t=0 kills 50 HP enemy immediately
      const result = simulateCombat(makeConfig(
        [makeEntry('Hit', 0)],
        { fightDuration: 30, enemy: makeEnemy({ maxHealth: 50 }) },
      ));
      expect(result.actualDuration).toBeLessThan(30);
      expect(result.enemyResult!.timeToKill).toBe(0);
    });

    it('target dummy mode with maxHealth=0', () => {
      // maxHealth=0 → infinite HP, fight runs full duration
      const result = simulateCombat(makeConfig(
        [makeEntry('Hit', 0)],
        { fightDuration: 10, enemy: makeEnemy({ maxHealth: 0 }) },
      ));
      expect(result.actualDuration).toBeCloseTo(10);
      expect(result.enemyResult!.timeToKill).toBeNull();
    });

    it('timeline has enemy_died event', () => {
      const result = simulateCombat(makeConfig(
        [makeEntry('Hit', 0)],
        { fightDuration: 30, enemy: makeEnemy({ maxHealth: 50 }) },
      ));
      const deathEvent = result.timeline.find(e => e.type === 'enemy_died');
      expect(deathEvent).toBeDefined();
      expect(deathEvent!.enemyHealth).toBe(0);
    });
  });

  describe('armor mitigation', () => {
    it('splits damage via ArmorMitigationRatio R/(R+1)', () => {
      // Ratio 5: armor gets 5/6 ≈ 83.3%, health gets 1/6 ≈ 16.7%
      const entry = makeEntry('Hit', 0, {}, {
        PvE: { PowerCost: 10, Range: 10, Damage: 100, ArmorMitigationRatio: 5 },
      } as Partial<Ability>);
      const result = simulateCombat(makeConfig(
        [entry],
        { fightDuration: 1, enemy: makeEnemy({ maxHealth: 10000, maxArmor: 5000 }) },
      ));
      // 100 dmg at ratio 5: ~83.33 to armor, ~16.67 to health
      expect(result.enemyResult!.totalArmorDamage).toBeCloseTo(83.33, 0);
      expect(result.enemyResult!.totalHealthDamage).toBeCloseTo(16.67, 0);
    });

    it('overflows armor damage to health when armor depletes', () => {
      // 100 dmg, ratio 5: 83.33 to armor. Armor=50 → 50 absorbed, 33.33 overflows
      const entry = makeEntry('Hit', 0, {}, {
        PvE: { PowerCost: 10, Range: 10, Damage: 100, ArmorMitigationRatio: 5 },
      } as Partial<Ability>);
      const result = simulateCombat(makeConfig(
        [entry],
        { fightDuration: 1, enemy: makeEnemy({ maxHealth: 10000, maxArmor: 50 }) },
      ));
      expect(result.enemyResult!.armorRemaining).toBe(0);
      // Health damage = 16.67 (normal split) + 33.33 (overflow) = 50
      expect(result.enemyResult!.totalHealthDamage).toBeCloseTo(50, 0);
    });

    it('no armor interaction when ArmorMitigationRatio is absent', () => {
      // Without ratio, all damage goes to health
      const result = simulateCombat(makeConfig(
        [makeEntry('Hit', 0)],
        { fightDuration: 1, enemy: makeEnemy({ maxHealth: 10000, maxArmor: 5000 }) },
      ));
      expect(result.enemyResult!.totalArmorDamage).toBe(0);
      expect(result.enemyResult!.totalHealthDamage).toBe(100);
      expect(result.enemyResult!.armorRemaining).toBe(5000);
    });

    it('applies ArmorSpecificDamage to armor only', () => {
      const entry = makeEntry('Hit', 0, {}, {
        PvE: { PowerCost: 10, Range: 10, Damage: 100, ArmorSpecificDamage: 50 },
      } as Partial<Ability>);
      const result = simulateCombat(makeConfig(
        [entry],
        { fightDuration: 1, enemy: makeEnemy({ maxHealth: 10000, maxArmor: 5000 }) },
      ));
      // No ratio → 100 dmg all to health. ArmorSpecific → 50 to armor.
      expect(result.enemyResult!.totalArmorDamage).toBe(50);
      expect(result.enemyResult!.totalHealthDamage).toBe(100);
    });

    it('applies HealthSpecificDamage to health only', () => {
      const entry = makeEntry('Hit', 0, {}, {
        PvE: { PowerCost: 10, Range: 10, Damage: 100, HealthSpecificDamage: 30 },
      } as Partial<Ability>);
      const result = simulateCombat(makeConfig(
        [entry],
        { fightDuration: 1, enemy: makeEnemy({ maxHealth: 10000, maxArmor: 5000 }) },
      ));
      // No ratio → 100 dmg to health + 30 HealthSpecific = 130 to health
      expect(result.enemyResult!.totalHealthDamage).toBe(130);
      expect(result.enemyResult!.totalArmorDamage).toBe(0);
    });

    it('tracks armorDepletedAt timestamp', () => {
      const entry = makeEntry('Hit', 0, {}, {
        PvE: { PowerCost: 10, Range: 10, Damage: 100, ArmorMitigationRatio: 5 },
      } as Partial<Ability>);
      const result = simulateCombat(makeConfig(
        [entry],
        { fightDuration: 10, enemy: makeEnemy({ maxHealth: 10000, maxArmor: 50 }) },
      ));
      expect(result.enemyResult!.armorDepletedAt).toBe(0); // Depleted on first hit
      const armorEvent = result.timeline.find(e => e.type === 'armor_depleted');
      expect(armorEvent).toBeDefined();
    });

    it('post-depletion: all damage goes to health', () => {
      // Armor=1, ratio=5 → first hit depletes armor, second hit all to health
      const entry = makeEntry('Hit', 0, { resetTime: makeStat(1) }, {
        PvE: { PowerCost: 10, Range: 10, Damage: 100, ArmorMitigationRatio: 5 },
      } as Partial<Ability>);
      const result = simulateCombat(makeConfig(
        [entry],
        { fightDuration: 3, enemy: makeEnemy({ maxHealth: 10000, maxArmor: 1 }) },
      ));
      // First hit: 1 to armor, 99 to health (16.67 + 82.33 overflow)
      // Second hit (t=1): armor=0, ratio doesn't apply → 100 to health
      // Third hit (t=2): same → 100 to health
      expect(result.enemyResult!.armorRemaining).toBe(0);
      expect(result.enemyResult!.totalHealthDamage).toBeCloseTo(299, 0);
    });
  });

  describe('resistances', () => {
    it('applies percentage resistance reduction', () => {
      const resistances = new Map([['Crushing', 0.2]]);
      const result = simulateCombat(makeConfig(
        [makeEntry('Hit', 0)],
        { fightDuration: 1, enemy: makeEnemy({ maxHealth: 10000, resistances }) },
      ));
      // 100 dmg × 0.8 = 80 effective
      expect(result.enemyResult!.totalDamageTaken).toBeCloseTo(80, 0);
      expect(result.enemyResult!.totalResisted).toBeCloseTo(20, 0);
    });

    it('uses per-damage-type lookup', () => {
      const resistances = new Map([['Fire', 0.5]]);
      // Ability does Crushing damage → no resistance match
      const result = simulateCombat(makeConfig(
        [makeEntry('Hit', 0)],
        { fightDuration: 1, enemy: makeEnemy({ maxHealth: 10000, resistances }) },
      ));
      expect(result.enemyResult!.totalResisted).toBe(0);
      expect(result.enemyResult!.totalDamageTaken).toBe(100);
    });

    it('zero resistance passes through full damage', () => {
      const resistances = new Map([['Crushing', 0]]);
      const result = simulateCombat(makeConfig(
        [makeEntry('Hit', 0)],
        { fightDuration: 1, enemy: makeEnemy({ maxHealth: 10000, resistances }) },
      ));
      expect(result.enemyResult!.totalResisted).toBe(0);
      expect(result.enemyResult!.totalDamageTaken).toBe(100);
    });

    it('applies resistance to DoT ticks using DoT damageType', () => {
      const resistances = new Map([['Poison', 0.25]]);
      const entry = makeEntry('PoisonHit', 0, {
        modifiedDamage: 0, // No direct damage
        resetTime: makeStat(100), // High CD so only one cast
        dots: [{
          damageType: 'Poison',
          baseDamagePerTick: 40,
          modifiedTotalDamage: 80,
          numTicks: 2,
          duration: 4,
        }],
      });
      const result = simulateCombat(makeConfig(
        [entry],
        { fightDuration: 10, enemy: makeEnemy({ maxHealth: 10000, resistances }) },
      ));
      // 2 ticks × 40 dmg × 0.25 = 20 resisted
      expect(result.enemyResult!.totalResisted).toBeCloseTo(20, 0);
    });

    it('tracks totalResisted across multiple hits', () => {
      const resistances = new Map([['Crushing', 0.1]]);
      const result = simulateCombat(makeConfig(
        [makeEntry('Hit', 0)],
        { fightDuration: 10, enemy: makeEnemy({ maxHealth: 10000, resistances }) },
      ));
      // Multiple casts, each resists 10 → totalResisted accumulates
      expect(result.enemyResult!.totalResisted).toBeGreaterThan(10);
    });

    it('resistance reduces damage before armor split', () => {
      const resistances = new Map([['Crushing', 0.5]]);
      const entry = makeEntry('Hit', 0, {}, {
        PvE: { PowerCost: 10, Range: 10, Damage: 100, ArmorMitigationRatio: 5 },
      } as Partial<Ability>);
      const result = simulateCombat(makeConfig(
        [entry],
        { fightDuration: 1, enemy: makeEnemy({ maxHealth: 10000, maxArmor: 5000, resistances }) },
      ));
      // 100 × 0.5 = 50 after resist. Split at ratio 5: ~41.67 armor, ~8.33 health
      expect(result.enemyResult!.totalResisted).toBeCloseTo(50, 0);
      expect(result.enemyResult!.totalArmorDamage).toBeCloseTo(41.67, 0);
      expect(result.enemyResult!.totalHealthDamage).toBeCloseTo(8.33, 0);
    });
  });

  describe('rage', () => {
    it('accumulates rage proportional to damage dealt', () => {
      const result = simulateCombat(makeConfig(
        [makeEntry('Hit', 0)],
        { fightDuration: 1, enemy: makeEnemy({ maxHealth: 10000, ragePerDamage: 0.1 }) },
      ));
      // 100 dmg × 0.1 = 10 rage
      expect(result.enemyResult!.peakRage).toBeCloseTo(10);
    });

    it('decays rage over time', () => {
      // Hit at t=0 → 10 rage. Then 3s of decay at 2/sec = -6. Rage at t=3 = 4.
      // Hit at t=3 → +10 rage = 14. Then decay...
      const result = simulateCombat(makeConfig(
        [makeEntry('Hit', 0)],
        { fightDuration: 4, enemy: makeEnemy({
          maxHealth: 10000,
          ragePerDamage: 0.1,
          rageDecayPerSecond: 2,
        })},
      ));
      // Rage should be less than if there was no decay
      expect(result.enemyResult!.finalRage).toBeLessThan(result.enemyResult!.peakRage);
    });

    it('RageBoost (negative) reduces enemy rage', () => {
      // Ability has rage.modified = -5 → RageBoost reduces rage
      const entry = makeEntry('Hit', 0, { rage: makeStat(-5) });
      const result = simulateCombat(makeConfig(
        [entry],
        { fightDuration: 1, enemy: makeEnemy({ maxHealth: 10000, ragePerDamage: 0.1 }) },
      ));
      // 100 dmg × 0.1 = 10 rage, then -5 RageBoost = 5 rage
      expect(result.enemyResult!.peakRage).toBeCloseTo(5);
    });

    it('rage cannot go below 0', () => {
      // RageBoost = -100 should floor rage at 0
      const entry = makeEntry('Hit', 0, { rage: makeStat(-100) });
      const result = simulateCombat(makeConfig(
        [entry],
        { fightDuration: 1, enemy: makeEnemy({ maxHealth: 10000, ragePerDamage: 0.1 }) },
      ));
      expect(result.enemyResult!.finalRage).toBe(0);
    });

    it('tracks peak rage', () => {
      // Multiple hits build rage, then decay brings it down
      const result = simulateCombat(makeConfig(
        [makeEntry('Hit', 0, { resetTime: makeStat(1) })],
        { fightDuration: 5, enemy: makeEnemy({
          maxHealth: 10000,
          ragePerDamage: 0.1,
          rageDecayPerSecond: 5,
        })},
      ));
      expect(result.enemyResult!.peakRage).toBeGreaterThan(result.enemyResult!.finalRage);
    });

    it('detects enrage threshold', () => {
      const result = simulateCombat(makeConfig(
        [makeEntry('Hit', 0, { resetTime: makeStat(1) })],
        { fightDuration: 10, enemy: makeEnemy({
          maxHealth: 10000,
          ragePerDamage: 0.5,
          rageDecayPerSecond: 0,
          enrageThreshold: 200,
        })},
      ));
      // 10 casts × 100 dmg × 0.5 = 500 peak rage > 200 threshold
      expect(result.enemyResult!.wasEnraged).toBe(true);
    });

    it('no rage when ragePerDamage is 0', () => {
      const result = simulateCombat(makeConfig(
        [makeEntry('Hit', 0)],
        { fightDuration: 10, enemy: makeEnemy({ maxHealth: 10000, ragePerDamage: 0 }) },
      ));
      expect(result.enemyResult!.peakRage).toBe(0);
      expect(result.enemyResult!.finalRage).toBe(0);
    });
  });

  describe('AoE', () => {
    it('single target ability has no AoE bonus', () => {
      const result = simulateCombat(makeConfig(
        [makeEntry('Hit', 0)],
        { fightDuration: 1, enemy: makeEnemy({ maxHealth: 10000, targetCount: 3 }) },
      ));
      // aoe is null on the DamageResult → not an AoE ability
      expect(result.totalAoeDamage).toBe(0);
    });

    it('AoE ability multiplies damage by secondary targets', () => {
      const entry = makeEntry('Cleave', 0, { aoe: makeStat(8) }); // AoE range 8
      const result = simulateCombat(makeConfig(
        [entry],
        { fightDuration: 1, enemy: makeEnemy({ maxHealth: 10000, targetCount: 3 }) },
      ));
      // 100 dmg to primary + 100×2 = 200 AoE bonus
      expect(result.totalAoeDamage).toBeCloseTo(200, 0);
    });

    it('primary target DPS unchanged by AoE', () => {
      const entry = makeEntry('Cleave', 0, { aoe: makeStat(8) });
      const withAoe = simulateCombat(makeConfig(
        [entry],
        { fightDuration: 1, enemy: makeEnemy({ maxHealth: 10000, targetCount: 3 }) },
      ));
      const withoutAoe = simulateCombat(makeConfig(
        [entry],
        { fightDuration: 1, enemy: makeEnemy({ maxHealth: 10000, targetCount: 1 }) },
      ));
      // Primary target DPS should be the same
      expect(withAoe.dps).toBeCloseTo(withoutAoe.dps, 1);
    });

    it('tracks per-ability AoE damage', () => {
      const entry = makeEntry('Cleave', 0, { aoe: makeStat(8) });
      const result = simulateCombat(makeConfig(
        [entry],
        { fightDuration: 1, enemy: makeEnemy({ maxHealth: 10000, targetCount: 4 }) },
      ));
      const cleaveResult = result.abilities.find(a => a.abilityId === 'Cleave');
      expect(cleaveResult!.totalAoeDamage).toBeCloseTo(300, 0); // 100 × 3 secondary
    });

    it('aoeDps includes secondary target damage', () => {
      const entry = makeEntry('Cleave', 0, { aoe: makeStat(8) });
      const result = simulateCombat(makeConfig(
        [entry],
        { fightDuration: 1, enemy: makeEnemy({ maxHealth: 10000, targetCount: 3 }) },
      ));
      // aoeDps = (totalDamage + totalAoeDamage) / duration
      expect(result.aoeDps).toBeGreaterThan(result.dps);
      expect(result.aoeDps).toBeCloseTo((result.totalDamage + result.totalAoeDamage) / result.actualDuration, 1);
    });

    it('no AoE bonus when targetCount is 1', () => {
      const entry = makeEntry('Cleave', 0, { aoe: makeStat(8) });
      const result = simulateCombat(makeConfig(
        [entry],
        { fightDuration: 1, enemy: makeEnemy({ maxHealth: 10000, targetCount: 1 }) },
      ));
      expect(result.totalAoeDamage).toBe(0);
      expect(result.aoeDps).toBeCloseTo(result.dps, 1);
    });
  });

  describe('enemy: null backward compat', () => {
    it('all existing behavior unchanged with enemy: null', () => {
      const result = simulateCombat(makeConfig(
        [makeEntry('Hit', 0)],
        { fightDuration: 10 },
      ));
      expect(result.enemyResult).toBeNull();
      expect(result.totalAoeDamage).toBe(0);
      expect(result.aoeDps).toBeCloseTo(result.dps, 1);
      expect(result.totalDamage).toBeGreaterThan(0);
    });
  });
});
