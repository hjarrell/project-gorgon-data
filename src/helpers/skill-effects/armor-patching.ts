import type { PowerEffectConfig } from './types';

export const ARMORPATCHING_EFFECTS: PowerEffectConfig[] = [
  // Melee Attackers suffer 3 indirect Acid damage while Shield skill Active
  {
    powerId: 'power_32003',
    name: 'WaxAcid',
    target: { abilities: ['Melee Attackers suffer 3 indirect Acid'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Melee Attackers suffer {N} indirect Acid damage while Shield skill Active',
  },
  // Max Armor +4 while Shield skill active
  {
    powerId: 'power_32001',
    name: 'WaxArmor',
    target: 'self',
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Max Armor +{N} while Shield skill active',
  },
  // Max Armor +2
  {
    powerId: 'power_32002',
    name: 'WaxArmorNoShieldReq',
    target: 'self',
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Max Armor +{N}',
  },
];
