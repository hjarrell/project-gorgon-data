import { describe, it, expect } from 'vitest';
import type { Ability } from '../schemas/abilities';
import type { AbilityKeywordEntry } from '../schemas/abilitykeywords';
import {
  parseEffectDesc,
  isParsedEffect,
  parseTierEffects,
  collectAbilityAttributes,
  calculateAbilityDamage,
  getCombatAbilities,
  encodeBuildToHash,
  decodeBuildFromHash,
  GEAR_SLOTS,
} from './build-helpers';
import type {
  GearSlotConfig,
  EquippedEffect,
  ParsedEffect,
} from './build-helpers';

// ── parseEffectDesc ──────────────────────────────────

describe('parseEffectDesc', () => {
  it('parses {ATTR}{value} format', () => {
    const result = parseEffectDesc('{BOOST_SKILL_ARCHERY}{5}');
    expect(isParsedEffect(result)).toBe(true);
    if (isParsedEffect(result)) {
      expect(result.attribute).toBe('BOOST_SKILL_ARCHERY');
      expect(result.value).toBe(5);
    }
  });

  it('parses negative values', () => {
    const result = parseEffectDesc('{VULN_NATURE}{-0.18}');
    expect(isParsedEffect(result)).toBe(true);
    if (isParsedEffect(result)) {
      expect(result.attribute).toBe('VULN_NATURE');
      expect(result.value).toBe(-0.18);
    }
  });

  it('parses decimal values', () => {
    const result = parseEffectDesc('{MOD_SKILL_ARCHERY}{0.5}');
    expect(isParsedEffect(result)).toBe(true);
    if (isParsedEffect(result)) {
      expect(result.value).toBe(0.5);
    }
  });

  it('returns unparsed for plain English', () => {
    const result = parseEffectDesc(
      '<icon=3315>Blitz Shot and Aimed Shot heal you for 5 health',
    );
    expect(isParsedEffect(result)).toBe(false);
    if (!isParsedEffect(result)) {
      expect(result.raw).toContain('Blitz Shot');
    }
  });

  it('returns unparsed for complex English', () => {
    const result = parseEffectDesc(
      'While Druid skill is active: abilities that have Burst targeting deal +200 Nature damage over 8 seconds',
    );
    expect(isParsedEffect(result)).toBe(false);
  });
});

// ── parseTierEffects ─────────────────────────────────

describe('parseTierEffects', () => {
  it('separates parsed and unparsed effects', () => {
    const tier = {
      EffectDescs: [
        '{MOD_SKILL_ARCHERY}{0.5}',
        '{DELTA_ANATOMY_CRITICAL_CHANCE}{0.03}',
        '<icon=3315>Some plain text effect',
      ],
      MaxLevel: 120,
      MinLevel: 100,
      MinRarity: 'Uncommon',
      SkillLevelPrereq: 100,
    };
    const { parsed, unparsed } = parseTierEffects(tier);
    expect(parsed).toHaveLength(2);
    expect(unparsed).toHaveLength(1);
    expect(parsed[0].attribute).toBe('MOD_SKILL_ARCHERY');
    expect(parsed[1].attribute).toBe('DELTA_ANATOMY_CRITICAL_CHANCE');
  });
});

// ── collectAbilityAttributes ─────────────────────────

describe('collectAbilityAttributes', () => {
  const mockAbility: Ability = {
    Animation: 'Attack',
    DamageType: 'Nature',
    Description: 'Test',
    IconID: 1,
    InternalName: 'TestAbility',
    Level: 50,
    Name: 'Test Ability',
    PvE: {
      PowerCost: 10,
      Range: 30,
      Damage: 100,
      AttributesThatDeltaDamage: ['BOOST_ABILITY_TESTABILITY'],
      AttributesThatModDamage: ['MOD_ABILITY_TESTABILITY'],
    },
    ResetTime: 5,
    Skill: 'Druid',
    Target: 'Enemy',
    Keywords: ['Attack', 'Burst', 'NatureAttack'],
  };

  const keywordEntries: AbilityKeywordEntry[] = [
    {
      MustHaveAbilityKeywords: ['Burst'],
      AttributesThatDeltaDamage: ['BOOST_ABILITY_BURST'],
      AttributesThatModDamage: ['MOD_ABILITY_BURST'],
    },
    {
      MustHaveAbilityKeywords: ['Melee'],
      AttributesThatDeltaDamage: ['BOOST_ABILITY_MELEE'],
    },
  ];

  it('collects direct PvE attributes', () => {
    const attrs = collectAbilityAttributes(mockAbility, []);
    expect(attrs.deltaAttributes.has('BOOST_ABILITY_TESTABILITY')).toBe(true);
    expect(attrs.modAttributes.has('MOD_ABILITY_TESTABILITY')).toBe(true);
  });

  it('adds keyword-derived attributes when keywords match', () => {
    const attrs = collectAbilityAttributes(mockAbility, keywordEntries);
    expect(attrs.deltaAttributes.has('BOOST_ABILITY_BURST')).toBe(true);
    expect(attrs.modAttributes.has('MOD_ABILITY_BURST')).toBe(true);
  });

  it('does not add attributes for non-matching keywords', () => {
    const attrs = collectAbilityAttributes(mockAbility, keywordEntries);
    expect(attrs.deltaAttributes.has('BOOST_ABILITY_MELEE')).toBe(false);
  });
});

// ── calculateAbilityDamage ───────────────────────────

describe('calculateAbilityDamage', () => {
  const mockAbility: Ability = {
    Animation: 'Attack',
    DamageType: 'Nature',
    Description: 'Test',
    IconID: 1,
    InternalName: 'TestAbility',
    Level: 50,
    Name: 'Test Ability',
    PvE: {
      PowerCost: 10,
      Range: 30,
      Damage: 100,
    },
    ResetTime: 5,
    Skill: 'Druid',
    Target: 'Enemy',
  };

  it('returns base damage with no mods', () => {
    const attrs = { deltaAttributes: new Set<string>(), modAttributes: new Set<string>(), dotAttributes: [] };
    const result = calculateAbilityDamage(mockAbility, attrs, []);
    expect(result.baseDamage).toBe(100);
    expect(result.modifiedDamage).toBe(100);
    expect(result.flatBonus).toBe(0);
    expect(result.percentMod).toBe(0);
  });

  it('applies flat delta bonus', () => {
    const attrs = {
      deltaAttributes: new Set(['BOOST_ABILITY_TEST']),
      modAttributes: new Set<string>(),
      dotAttributes: [],
    };
    const effects: EquippedEffect[] = [
      {
        effect: { attribute: 'BOOST_ABILITY_TEST', value: 50 },
        powerId: 'power_10001',
        tierId: 'id_1',
        slot: 'Head',
      },
    ];
    const result = calculateAbilityDamage(mockAbility, attrs, effects);
    expect(result.flatBonus).toBe(50);
    expect(result.modifiedDamage).toBe(150);
  });

  it('applies percent modifier', () => {
    const attrs = {
      deltaAttributes: new Set<string>(),
      modAttributes: new Set(['MOD_ABILITY_TEST']),
      dotAttributes: [],
    };
    const effects: EquippedEffect[] = [
      {
        effect: { attribute: 'MOD_ABILITY_TEST', value: 0.25 },
        powerId: 'power_10001',
        tierId: 'id_1',
        slot: 'Head',
      },
    ];
    const result = calculateAbilityDamage(mockAbility, attrs, effects);
    expect(result.percentMod).toBe(0.25);
    expect(result.modifiedDamage).toBe(125);
  });

  it('combines flat and percent correctly', () => {
    const attrs = {
      deltaAttributes: new Set(['BOOST']),
      modAttributes: new Set(['MOD']),
      dotAttributes: [],
    };
    const effects: EquippedEffect[] = [
      { effect: { attribute: 'MOD', value: 0.5 }, powerId: 'p1', tierId: 't1', slot: 'Head' },
      { effect: { attribute: 'BOOST', value: 30 }, powerId: 'p2', tierId: 't2', slot: 'Chest' },
    ];
    const result = calculateAbilityDamage(mockAbility, attrs, effects);
    // 100 * (1 + 0.5) + 30 = 180
    expect(result.modifiedDamage).toBe(180);
    expect(result.contributions).toHaveLength(2);
  });

  it('ignores irrelevant effects', () => {
    const attrs = {
      deltaAttributes: new Set(['BOOST_ABILITY_TEST']),
      modAttributes: new Set<string>(),
      dotAttributes: [],
    };
    const effects: EquippedEffect[] = [
      {
        effect: { attribute: 'UNRELATED_ATTR', value: 999 },
        powerId: 'power_10001',
        tierId: 'id_1',
        slot: 'Head',
      },
    ];
    const result = calculateAbilityDamage(mockAbility, attrs, effects);
    expect(result.modifiedDamage).toBe(100);
    expect(result.contributions).toHaveLength(0);
  });
});

// ── DoT Damage Calculation ──────────────────────────

describe('calculateAbilityDamage (DoTs)', () => {
  const dotAbility: Ability = {
    Animation: 'Attack',
    DamageType: 'Darkness',
    Description: 'DoT test',
    IconID: 1,
    InternalName: 'DotAbility',
    Level: 50,
    Name: 'DoT Ability',
    PvE: {
      PowerCost: 10,
      Range: 30,
      Damage: 0,
      DoTs: [
        {
          DamagePerTick: 20,
          DamageType: 'Nature',
          Duration: 8,
          NumTicks: 4,
          AttributesThatDelta: ['BOOST_DOT_TEST'],
          AttributesThatMod: ['MOD_DOT_TEST'],
        },
      ],
    },
    ResetTime: 5,
    Skill: 'Druid',
    Target: 'Enemy',
  };

  it('returns base DoT damage with no mods', () => {
    const attrs = collectAbilityAttributes(dotAbility, []);
    const result = calculateAbilityDamage(dotAbility, attrs, []);
    expect(result.dots).toHaveLength(1);
    expect(result.dots[0].baseTotalDamage).toBe(80); // 20 * 4
    expect(result.dots[0].modifiedTotalDamage).toBe(80);
    expect(result.dots[0].damageType).toBe('Nature');
    expect(result.dots[0].numTicks).toBe(4);
    expect(result.dots[0].duration).toBe(8);
  });

  it('applies flat delta to DoT per-tick', () => {
    const attrs = collectAbilityAttributes(dotAbility, []);
    const effects: EquippedEffect[] = [
      {
        effect: { attribute: 'BOOST_DOT_TEST', value: 5 },
        powerId: 'power_1',
        tierId: 'id_1',
        slot: 'Head',
      },
    ];
    const result = calculateAbilityDamage(dotAbility, attrs, effects);
    // (20 + 5) * 4 = 100
    expect(result.dots[0].flatBonusPerTick).toBe(5);
    expect(result.dots[0].modifiedTotalDamage).toBe(100);
    expect(result.dots[0].contributions).toHaveLength(1);
  });

  it('applies percent mod to DoT per-tick', () => {
    const attrs = collectAbilityAttributes(dotAbility, []);
    const effects: EquippedEffect[] = [
      {
        effect: { attribute: 'MOD_DOT_TEST', value: 0.5 },
        powerId: 'power_1',
        tierId: 'id_1',
        slot: 'Head',
      },
    ];
    const result = calculateAbilityDamage(dotAbility, attrs, effects);
    // 20 * (1 + 0.5) * 4 = 120
    expect(result.dots[0].percentMod).toBe(0.5);
    expect(result.dots[0].modifiedTotalDamage).toBe(120);
  });

  it('does not affect direct damage with DoT mods', () => {
    const attrs = collectAbilityAttributes(dotAbility, []);
    const effects: EquippedEffect[] = [
      {
        effect: { attribute: 'BOOST_DOT_TEST', value: 10 },
        powerId: 'power_1',
        tierId: 'id_1',
        slot: 'Head',
      },
    ];
    const result = calculateAbilityDamage(dotAbility, attrs, effects);
    expect(result.modifiedDamage).toBe(0); // direct damage stays 0
    expect(result.dots[0].modifiedTotalDamage).toBe(120); // (20 + 10) * 4
  });
});

// ── collectAbilityAttributes (DoTs) ─────────────────

describe('collectAbilityAttributes (DoTs)', () => {
  it('collects DoT-specific attributes', () => {
    const ability: Ability = {
      Animation: 'Attack',
      DamageType: 'Darkness',
      Description: 'Test',
      IconID: 1,
      InternalName: 'SongOfDiscord5',
      Level: 50,
      Name: 'Song of Discord',
      PvE: {
        PowerCost: 0,
        Range: 10,
        DoTs: [
          {
            DamagePerTick: 23,
            DamageType: 'Darkness',
            Duration: 10,
            NumTicks: 5,
            AttributesThatDelta: ['BOOST_SONGOFDISCORD_DOT'],
            AttributesThatMod: ['MOD_SONGOFDISCORD_DOT'],
          },
        ],
      },
      ResetTime: 8,
      Skill: 'Bard',
      Target: 'Enemy',
    };
    const attrs = collectAbilityAttributes(ability, []);
    expect(attrs.dotAttributes).toHaveLength(1);
    expect(attrs.dotAttributes[0].deltaAttributes.has('BOOST_SONGOFDISCORD_DOT')).toBe(true);
    expect(attrs.dotAttributes[0].modAttributes.has('MOD_SONGOFDISCORD_DOT')).toBe(true);
    expect(attrs.dotAttributes[0].damagePerTick).toBe(23);
    expect(attrs.dotAttributes[0].numTicks).toBe(5);
  });
});

// ── getCombatAbilities ───────────────────────────────

describe('getCombatAbilities', () => {
  function makeAbility(overrides: Partial<Ability>): Ability {
    return {
      Animation: 'Attack',
      DamageType: 'Nature',
      Description: '',
      IconID: 1,
      InternalName: 'Default',
      Level: 1,
      Name: 'Default',
      PvE: { PowerCost: 0, Range: 10 },
      ResetTime: 3,
      Skill: 'Druid',
      Target: 'Enemy',
      ...overrides,
    };
  }

  it('filters to the specified skill', () => {
    const abilities = new Map([
      ['a1', makeAbility({ InternalName: 'DruidA', Skill: 'Druid', Name: 'A' })],
      ['a2', makeAbility({ InternalName: 'SwordA', Skill: 'Sword', Name: 'B' })],
    ]);
    const result = getCombatAbilities('Druid', abilities);
    expect(result).toHaveLength(1);
    expect(result[0].InternalName).toBe('DruidA');
  });

  it('excludes monster abilities', () => {
    const abilities = new Map([
      [
        'a1',
        makeAbility({
          InternalName: 'MonsterBite',
          Skill: 'Druid',
          Keywords: ['Attack', 'Lint_MonsterAbility'],
        }),
      ],
      ['a2', makeAbility({ InternalName: 'DruidA', Skill: 'Druid', Name: 'A' })],
    ]);
    const result = getCombatAbilities('Druid', abilities);
    expect(result).toHaveLength(1);
    expect(result[0].InternalName).toBe('DruidA');
  });

  it('excludes abilities that have been upgraded', () => {
    const abilities = new Map([
      ['a1', makeAbility({ InternalName: 'Heal1', Skill: 'Druid', Name: 'Heal', Level: 1 })],
      [
        'a2',
        makeAbility({
          InternalName: 'Heal2',
          Skill: 'Druid',
          Name: 'Heal',
          Level: 10,
          UpgradeOf: 'Heal1',
        }),
      ],
    ]);
    const result = getCombatAbilities('Druid', abilities);
    expect(result).toHaveLength(1);
    expect(result[0].InternalName).toBe('Heal2');
  });

  it('sorts by level then name', () => {
    const abilities = new Map([
      ['a1', makeAbility({ InternalName: 'C', Skill: 'Druid', Name: 'C', Level: 10 })],
      ['a2', makeAbility({ InternalName: 'A', Skill: 'Druid', Name: 'A', Level: 1 })],
      ['a3', makeAbility({ InternalName: 'B', Skill: 'Druid', Name: 'B', Level: 1 })],
    ]);
    const result = getCombatAbilities('Druid', abilities);
    expect(result.map((a) => a.Name)).toEqual(['A', 'B', 'C']);
  });
});

// ── URL Encoding/Decoding ────────────────────────────

describe('encodeBuildToHash / decodeBuildFromHash', () => {
  it('roundtrips a build correctly', () => {
    const slots: GearSlotConfig[] = GEAR_SLOTS.map((slot, i) => ({
      slot,
      rarity: i === 0 ? 'Epic' : 'Common',
      mods:
        i === 0
          ? [
              { powerId: 'power_14007', tierId: 'id_12', assignment: 'skill1' as const },
              { powerId: 'power_10001', tierId: 'id_3', assignment: 'skill2' as const },
              { powerId: '', tierId: '', assignment: 'neutral' as const },
            ]
          : [],
    }));

    const hash = encodeBuildToHash({ skill1: 'Druid', skill2: 'Bard', slots, skill1Level: 50, skill2Level: 45 });
    const decoded = decodeBuildFromHash(hash);

    expect(decoded).not.toBeNull();
    expect(decoded!.skill1).toBe('Druid');
    expect(decoded!.skill2).toBe('Bard');
    expect(decoded!.skill1Level).toBe(50);
    expect(decoded!.skill2Level).toBe(45);
    expect(decoded!.slots[0].rarity).toBe('Epic');
    expect(decoded!.slots[0].mods).toHaveLength(3);
    expect(decoded!.slots[0].mods[0].powerId).toBe('power_14007');
    expect(decoded!.slots[0].mods[0].tierId).toBe('id_12');
    expect(decoded!.slots[0].mods[0].assignment).toBe('skill1');
    expect(decoded!.slots[0].mods[1].powerId).toBe('power_10001');
    expect(decoded!.slots[0].mods[2].powerId).toBe('');
  });

  it('returns null for invalid hash', () => {
    expect(decodeBuildFromHash('')).toBeNull();
    expect(decodeBuildFromHash('invalid')).toBeNull();
  });

  it('handles empty mods', () => {
    const slots: GearSlotConfig[] = GEAR_SLOTS.map((slot) => ({
      slot,
      rarity: 'Common',
      mods: [],
    }));
    const hash = encodeBuildToHash({ skill1: 'Sword', skill2: 'Shield', slots });
    const decoded = decodeBuildFromHash(hash);
    expect(decoded!.skill1).toBe('Sword');
    expect(decoded!.skill2).toBe('Shield');
    expect(decoded!.skill1Level).toBe(50);
    expect(decoded!.skill2Level).toBe(50);
  });
});
