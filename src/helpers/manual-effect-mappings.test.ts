import { describe, it, expect } from 'vitest';
import {
  resolveManualEffect,
  MANUAL_EFFECT_MAPPINGS,
} from './manual-effect-mappings';

// ── resolveManualEffect ─────────────────────────────

describe('resolveManualEffect', () => {
  it('returns null for unmapped power IDs', () => {
    expect(resolveManualEffect('power_99999', 'anything')).toBeNull();
  });

  it('returns null for todo entries', () => {
    // PsychoanalyzeCrit is a todo
    expect(
      resolveManualEffect(
        'power_4002',
        '<icon=2118>Psychoanalyze deals between 10 and 60 extra damage',
      ),
    ).toBeNull();
  });

  it('returns null for ignored entries', () => {
    // BowBashHeal is ignored
    expect(
      resolveManualEffect('power_10452', '<icon=3312>Bow Bash heals you for 25 health'),
    ).toBeNull();
  });

  it('returns null when regex does not match', () => {
    // Finishing Blow + Decapitate mapping with non-matching text
    expect(
      resolveManualEffect('power_1085', 'Some completely different text'),
    ).toBeNull();
  });

  // ── Delta: Finishing Blow + Decapitate ────────────

  it('resolves FinishingBlowDecapitateDmgBoost with two attributes', () => {
    const result = resolveManualEffect(
      'power_1085',
      '<icon=3045><icon=2106>Finishing Blow and Decapitate damage +236',
    );
    expect(result).toHaveLength(2);
    expect(result).toEqual([
      { attribute: 'BOOST_ABILITY_FINISHINGBLOW', value: 236 },
      { attribute: 'BOOST_ABILITY_DECAPITATE', value: 236 },
    ]);
  });

  // ── Delta: Punch Boost ───────────────────────────

  it('resolves PunchBoost with two attributes', () => {
    const result = resolveManualEffect(
      'power_3002',
      '<icon=3627><icon=2203>Jab and Infuriating Fist Damage +8',
    );
    expect(result).toEqual([
      { attribute: 'BOOST_ABILITY_JAB', value: 8 },
      { attribute: 'BOOST_ABILITY_INFURIATINGFIST', value: 8 },
    ]);
  });

  // ── DotDelta: Poison Arrow ───────────────────────

  it('resolves PoisonArrowDoT total damage → per-tick', () => {
    const result = resolveManualEffect(
      'power_10311',
      '<icon=3301>Poison Arrow deals +600 Poison damage over 12 seconds',
    );
    expect(result).toEqual([
      { attribute: 'BOOST_ABILITYDOT_POISONARROW', value: 100 },
    ]);
  });

  // ── DotDelta: Hook Shot ──────────────────────────

  it('resolves HookShotDoT total damage → per-tick', () => {
    const result = resolveManualEffect(
      'power_10554',
      '<icon=3316>Hook Shot deals +294 Poison damage over 12 seconds',
    );
    expect(result).toEqual([
      { attribute: 'BOOST_ABILITYDOT_HOOKSHOT', value: 49 },
    ]);
  });

  // ── DotDelta: Many Cuts ──────────────────────────

  it('resolves ManyCutsDoT total damage → per-tick', () => {
    const result = resolveManualEffect(
      'power_1021',
      '<icon=2113>Many Cuts deals +108 Trauma damage over 6 seconds',
    );
    expect(result).toEqual([
      { attribute: 'BOOST_ABILITYDOT_MANYCUTS', value: 18 },
    ]);
  });

  // ── DotDelta: Aimed Shot (no + sign) ─────────────

  it('resolves AimedShotDoT total damage → per-tick (no + in text)', () => {
    const result = resolveManualEffect(
      'power_10042',
      '<icon=3315>Aimed Shot deals 252 Trauma damage to health over 12 seconds',
    );
    expect(result).toEqual([
      { attribute: 'BOOST_ABILITYDOT_AIMEDSHOT', value: 42 },
    ]);
  });

  // ── DotDelta: Archery Crit Poison ────────────────

  it('resolves ArcheryCritPoison total damage → per-tick', () => {
    const result = resolveManualEffect(
      'power_10010',
      '<icon=108>Archery attacks that Critically Hit deal 300 Poison damage over 12 seconds. This amount is further increased by treasure that boosts Poison Arrow\'s damage-over-time',
    );
    expect(result).toEqual([
      { attribute: 'BOOST_ABILITYDOT_ARCHERYPOISONCRIT', value: 50 },
    ]);
  });

  // ── DotDelta: Death's Hold ───────────────────────

  it("resolves DeathsHoldDoT total damage → per-tick", () => {
    const result = resolveManualEffect(
      'power_8002',
      "<icon=3427>Death's Hold ignites the target, dealing 48 Fire damage over 12 seconds",
    );
    expect(result).toEqual([
      { attribute: 'BOOST_ABILITYDOT_DEATHSHOLD', value: 8 },
    ]);
  });

  // ── DynamicDot: Druid Burst ──────────────────────

  it('resolves DruidBurstDoT total damage → per-tick', () => {
    const result = resolveManualEffect(
      'power_14007',
      'While Druid skill is active: abilities that have Burst targeting deal +280 Nature damage over 8 seconds',
    );
    expect(result).toEqual([
      { attribute: 'BOOST_ABILITYDOT_BURST_NATURE', value: 70 },
    ]);
  });

  // ── DynamicDot: Druid Projectile Poison ──────────

  it('resolves DruidProjectileDoT total damage → per-tick', () => {
    const result = resolveManualEffect(
      'power_14006',
      'While Druid skill is active: abilities that fire a projectile, such as Toxinball, Fireball, or most Archery abilities, deal +308 Poison damage over 8 seconds',
    );
    expect(result).toEqual([
      { attribute: 'BOOST_ABILITYDOT_PROJECTILE_POISON', value: 77 },
    ]);
  });
});

// ── Mapping Structure Validation ────────────────────

describe('MANUAL_EFFECT_MAPPINGS', () => {
  it('every mapping has required fields for its type', () => {
    for (const [, mapping] of Object.entries(MANUAL_EFFECT_MAPPINGS)) {
      expect(mapping.description).toBeTruthy();

      if (mapping.type === 'delta') {
        expect(mapping.valuePattern).toBeInstanceOf(RegExp);
        expect(mapping.attributes.length).toBeGreaterThan(0);
      }
      if (mapping.type === 'dotDelta') {
        expect(mapping.valuePattern).toBeInstanceOf(RegExp);
        expect(mapping.attribute).toBeTruthy();
        expect(mapping.numTicks).toBeGreaterThan(0);
      }
      if (mapping.type === 'dynamicDot') {
        expect(mapping.valuePattern).toBeInstanceOf(RegExp);
        expect(mapping.attribute).toBeTruthy();
        expect(mapping.numTicks).toBeGreaterThan(0);
      }
    }
  });
});
