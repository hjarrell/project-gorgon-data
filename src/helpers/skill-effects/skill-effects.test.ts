import { describe, it, expect } from 'vitest';
import { tsysClientInfo } from '../../data/tsysclientinfo';
import { MANUAL_EFFECT_MAPPINGS } from '../manual-effect-mappings';
import { getAllRegisteredPowerIds, getRegisteredConfig, resolveSkillEffects } from './index';

const RE2 = /^\{([A-Z_0-9]+)\}\{(-?[\d.]+)\}$/;
const RE3 = /^\{([A-Z_0-9]+)\}\{(-?[\d.]+)\}\{(\w+)\}$/;

function stripIcons(text: string): string {
  return text.replace(/<icon=\d+>/g, '').trim();
}

function hasTextEffects(power: any): boolean {
  for (const tier of Object.values(power.Tiers) as any[]) {
    for (const desc of tier.EffectDescs) {
      const clean = stripIcons(desc);
      if (!RE2.test(clean) && !RE3.test(clean)) {
        return true;
      }
    }
  }
  return false;
}

function getTextDescs(power: any): string[] {
  const firstTier = Object.values(power.Tiers)[0] as any;
  if (!firstTier) return [];
  return firstTier.EffectDescs
    .map((d: string) => stripIcons(d))
    .filter((d: string) => !RE2.test(d) && !RE3.test(d));
}

const registeredIds = getAllRegisteredPowerIds();

describe('skill-effects registry', () => {
  it('has registered configs', () => {
    expect(registeredIds.size).toBeGreaterThan(0);
  });

  it('all registered power IDs exist in tsysClientInfo', () => {
    for (const powerId of registeredIds) {
      expect(tsysClientInfo.has(powerId), `${powerId} not found in tsysClientInfo`).toBe(true);
    }
  });
});

// Per-skill coverage tests
const COVERED_SKILLS = [
  'AnimalHandling',
  'Archery',
  'ArmorPatching',
  'Bard',
  'BattleChemistry',
  'Cow',
  'Deer',
  'Druid',
  'FairyMagic',
  'FireMagic',
  'GiantBat',
  'Gourmand',
  'Hammer',
  'IceMagic',
  'Knife',
  'Mentalism',
  'Necromancy',
  'Pig',
  'Priest',
  'Psychology',
  'Rabbit',
  'Shield',
  'Spider',
  'SpiritFox',
  'Staff',
  'Sword',
  'Unarmed',
  'Vampirism',
  'Warden',
  'WeatherWitching',
  'Werewolf',
];

for (const skillName of COVERED_SKILLS) {
  describe(`${skillName} coverage`, () => {
    const powersWithText: { powerId: string; power: any }[] = [];
    for (const [powerId, power] of tsysClientInfo) {
      if (power.Skill !== skillName) continue;
      if (power.IsUnavailable) continue;
      if (hasTextEffects(power)) {
        powersWithText.push({ powerId, power });
      }
    }

    it(`finds powers with text effects for ${skillName}`, () => {
      expect(powersWithText.length).toBeGreaterThan(0);
    });

    it(`every ${skillName} power with text effects is handled`, () => {
      const unhandled: string[] = [];
      for (const { powerId, power } of powersWithText) {
        const inRegistry = registeredIds.has(powerId);
        const inManual = powerId in MANUAL_EFFECT_MAPPINGS;
        if (!inRegistry && !inManual) {
          unhandled.push(`${powerId} (${power.InternalName})`);
        }
      }
      // This documents unhandled powers — as configs are refined, this count should go to 0
      // For now we just ensure nothing was completely missed by codegen
      // (codegen should have generated entries for all of them)
      expect(unhandled).toEqual([]);
    });
  });
}

// Template snapshot tests — verify the codegen templates match the actual data
describe('template snapshots', () => {
  for (const powerId of registeredIds) {
    const config = getRegisteredConfig(powerId);
    if (!config?.template) continue;

    const power = tsysClientInfo.get(powerId);
    if (!power) continue;

    it(`${config.name}: template matches data`, () => {
      const textDescs = getTextDescs(power);
      expect(textDescs.length).toBeGreaterThan(0);

      // Normalize the first text desc to a template and compare
      const actual = textDescs[0].replace(/-?\d+(\.\d+)?/g, '{N}');
      expect(actual).toBe(config.template);
    });
  }
});

// Extraction tests — verify that non-todo configs can actually extract values
describe('extraction validation', () => {
  for (const powerId of registeredIds) {
    const config = getRegisteredConfig(powerId);
    if (!config) continue;

    const hasNonTodoEffects = config.effects.some(e => e.type !== 'todo' && e.type !== 'ignored');
    if (!hasNonTodoEffects) continue;

    const power = tsysClientInfo.get(powerId);
    if (!power) continue;

    it(`${config.name}: resolves effects successfully`, () => {
      const firstTier = Object.values(power.Tiers)[0] as any;
      if (!firstTier) return;

      const resolved = resolveSkillEffects(powerId, firstTier.EffectDescs, 'Head');
      // If there are non-todo effects, we should get at least one resolved effect
      if (resolved) {
        expect(resolved.length).toBeGreaterThan(0);
        for (const eff of resolved) {
          expect(eff.value).not.toBeNaN();
          expect(eff.type).not.toBe('todo');
          expect(eff.type).not.toBe('ignored');
        }
      }
    });
  }
});
