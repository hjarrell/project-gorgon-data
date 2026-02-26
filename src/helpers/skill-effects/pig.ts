import type { PowerEffectConfig } from './types';

export const PIG_EFFECTS: PowerEffectConfig[] = [
  // Grunt of Abeyance restores 4 Armor to all targets
  {
    powerId: 'power_22043',
    name: 'GruntOfAbeyanceArmor',
    target: { abilities: ['Grunt of Abeyance'] },
    effects: [
      { type: 'restore', valuePattern: /(?:restores?|heals? you for) (\d+) Armor/, resourceType: 'Armor' },
    ],
    template: 'Grunt of Abeyance restores {N} Armor to all targets',
  },
  // Grunt of Abeyance grants all targets 5% mitigation from attacks, up to a maximum of 50 total mitigated damage.
  {
    powerId: 'power_22061',
    name: 'GruntOfAbeyanceMitigate',
    target: 'self',
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Grunt of Abeyance grants all targets {N}% mitigation from attacks, up to a maximum of {N} total mitigated damage.',
  },
  // Grunt of Abeyance restores 3 Power to all targets
  {
    powerId: 'power_22041',
    name: 'GruntOfAbeyancePower',
    target: { abilities: ['Grunt of Abeyance'] },
    effects: [
      { type: 'restore', valuePattern: /(?:restores?|heals? you for) (\d+) Power/, resourceType: 'Power' },
    ],
    template: 'Grunt of Abeyance restores {N} Power to all targets',
  },
  // Pig Bite has a 3% chance to deal +40 damage and hit all targets within 5 meters
  {
    powerId: 'power_22003',
    name: 'PigBiteAoE',
    target: { abilities: ['Pig Bite'] },
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
      { type: 'aoeDelta', valuePattern: /(?:within|targets within) (\d+) meters/ },
    ],
    template: 'Pig Bite has a {N}% chance to deal +{N} damage and hit all targets within {N} meters',
  },
  // Pig Bite boosts the Trauma damage of Pig Rend and Squeal +16 for 30 seconds
  {
    powerId: 'power_22002',
    name: 'PigBiteBoost',
    target: { abilities: ['Pig Bite'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Pig Bite boosts the Trauma damage of Pig Rend and Squeal +{N} for {N} seconds',
  },
  // Pig Bite restores 1 Health
  {
    powerId: 'power_22004',
    name: 'PigBiteHeal',
    target: { abilities: ['Pig Bite'] },
    effects: [
      { type: 'restore', valuePattern: /(?:restores?|heals? you for) (\d+) Health/, resourceType: 'Health' },
    ],
    template: 'Pig Bite restores {N} Health',
  },
  // For 15 seconds, Frenzy boosts targets' receptivity to Major Heals so that they restore +5 Health
  {
    powerId: 'power_22401',
    name: 'PigFrenziedHealing',
    target: { abilities: ['For 15 seconds', 'Frenzy'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'For {N} seconds, Frenzy boosts targets\' receptivity to Major Heals so that they restore +{N} Health',
  },
  // Frenzy restores 3 power to all targets
  {
    powerId: 'power_22402',
    name: 'PigFrenzyHealPower',
    target: { abilities: ['Frenzy'] },
    effects: [
      { type: 'restore', valuePattern: /(?:restores?|heals? you for) (\d+) power/, resourceType: 'power' },
    ],
    template: 'Frenzy restores {N} power to all targets',
  },
  // For 10 seconds, Frenzy boosts targets' indirect damage +1 per tick
  {
    powerId: 'power_22404',
    name: 'PigFrenzyIndirectBoost',
    target: { abilities: ['For 10 seconds', 'Frenzy'] },
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
    ],
    template: 'For {N} seconds, Frenzy boosts targets\' indirect damage +{N} per tick',
  },
  // Frenzy gives all targets +4 absorption of any physical damage for 20 seconds
  {
    powerId: 'power_22403',
    name: 'PigFrenzyMitigation',
    target: { abilities: ['Frenzy gives all targets +4 absorption of any physical'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Frenzy gives all targets +{N} absorption of any physical damage for {N} seconds',
  },
  // Harmlessness confuses the target about which enemy is which, permanently shuffling their hatred levels toward all enemies they know about
  {
    powerId: 'power_22304',
    name: 'PigHarmlessnessConfusion',
    target: 'self',
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Harmlessness confuses the target about which enemy is which, permanently shuffling their hatred levels toward all enemies they know about',
  },
  // Harmlessness heals you for 10 health
  {
    powerId: 'power_22301',
    name: 'PigHarmlessnessHeal',
    target: { abilities: ['Harmlessness'] },
    effects: [
      { type: 'restore', valuePattern: /(?:restores?|heals? you for) (\d+) health/, resourceType: 'health' },
    ],
    template: 'Harmlessness heals you for {N} health',
  },
  // Harmlessness restores 21 armor to you
  {
    powerId: 'power_22302',
    name: 'PigHarmlessnessHealArmor',
    target: { abilities: ['Harmlessness'] },
    effects: [
      { type: 'restore', valuePattern: /(?:restores?|heals? you for) (\d+) armor/, resourceType: 'armor' },
    ],
    template: 'Harmlessness restores {N} armor to you',
  },
  // Harmlessness restores 10 power to you
  {
    powerId: 'power_22303',
    name: 'PigHarmlessnessHealPower',
    target: { abilities: ['Harmlessness'] },
    effects: [
      { type: 'restore', valuePattern: /(?:restores?|heals? you for) (\d+) power/, resourceType: 'power' },
    ],
    template: 'Harmlessness restores {N} power to you',
  },
  // Mudbath causes the target to take 5% less damage from all attacks for 10 seconds
  {
    powerId: 'power_22254',
    name: 'PigMudArmor',
    target: { abilities: ['Mudbath causes the target to take 5% less'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Mudbath causes the target to take {N}% less damage from all attacks for {N} seconds',
  },
  // Mudbath restores 7 armor to the target
  {
    powerId: 'power_22252',
    name: 'PigMudbathArmor',
    target: { abilities: ['Mudbath'] },
    effects: [
      { type: 'restore', valuePattern: /(?:restores?|heals? you for) (\d+) armor/, resourceType: 'armor' },
    ],
    template: 'Mudbath restores {N} armor to the target',
  },
  // Mudbath gives the target +5 absorption of any physical damage for 20 seconds
  {
    powerId: 'power_22253',
    name: 'PigMudbathMitigation',
    target: { abilities: ['Mudbath gives the target +5 absorption of any physical'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Mudbath gives the target +{N} absorption of any physical damage for {N} seconds',
  },
  // Pig Punt deals +3% damage and taunts -15
  {
    powerId: 'power_22352',
    name: 'PigPuntBoostB',
    target: { abilities: ['Pig Punt'] },
    effects: [
      { type: 'percentDamage', valuePattern: /damage[^]*?\+(\d+)%/ },
    ],
    template: 'Pig Punt deals +{N}% damage and taunts {N}',
  },
  // Pig Punt has a 10% chance to confuse the target about which enemy is which, permanently shuffling their hatred levels toward all enemies they know about
  {
    powerId: 'power_22354',
    name: 'PigPuntConfuse',
    target: { abilities: ['Pig Punt'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Pig Punt has a {N}% chance to confuse the target about which enemy is which, permanently shuffling their hatred levels toward all enemies they know about',
  },
  // Pig Punt deals +10 damage and slows target's movement by 45%
  {
    powerId: 'power_22355',
    name: 'PigPuntCripple',
    target: { abilities: ['Pig Punt'] },
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
    ],
    template: 'Pig Punt deals +{N} damage and slows target\'s movement by {N}%',
  },
  // Pig Punt causes the target to ignore you for 3 seconds, or until you attack it again
  {
    powerId: 'power_22353',
    name: 'PigPuntIgnore',
    target: 'self',
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Pig Punt causes the target to ignore you for {N} seconds, or until you attack it again',
  },
  // Pig Rend deals +32 Trauma damage over 8 seconds
  {
    powerId: 'power_22086',
    name: 'PigRendBleed',
    target: { abilities: ['Pig Rend'] },
    effects: [
      { type: 'dot', valuePattern: /deals? \+?(\d+) Trauma damage/, damageType: 'Trauma', duration: 8 },
    ],
    template: 'Pig Rend deals +{N} Trauma damage over {N} seconds',
  },
  // Pig Rend damage +10% and there is a 15% chance to deal +100% more damage
  {
    powerId: 'power_22085',
    name: 'PigRendCrit',
    target: { abilities: ['Pig Rend'] },
    effects: [
      { type: 'percentDamage', valuePattern: /damage[^]*?\+(\d+)%/ },
    ],
    template: 'Pig Rend damage +{N}% and there is a {N}% chance to deal +{N}% more damage',
  },
  // Squeal deals +10 direct damage plus 40 Trauma damage over 8 seconds
  {
    powerId: 'power_22202',
    name: 'PigSquealBleed',
    target: { abilities: ['Squeal'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Squeal deals +{N} direct damage plus {N} Trauma damage over {N} seconds',
  },
  // Squeal uniformly diminishes all targets' entire aggro lists by 5%, making them less locked in to their aggro choices and more easily susceptible to additional taunts and detaunts
  {
    powerId: 'power_22204',
    name: 'PigSquealReduceAggro',
    target: 'self',
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Squeal uniformly diminishes all targets\' entire aggro lists by {N}%, making them less locked in to their aggro choices and more easily susceptible to additional taunts and detaunts',
  },
  // Squeal boosts sprint speed by 2 for 10 seconds
  {
    powerId: 'power_22203',
    name: 'PigSquealSpeed',
    target: { abilities: ['Squeal'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Squeal boosts sprint speed by {N} for {N} seconds',
  },
  // Strategic Chomp debuffs target's Trauma Vulnerability +10% for 20 seconds
  {
    powerId: 'power_22089',
    name: 'PigStrategicChompDebuff',
    target: 'self',
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Strategic Chomp debuffs target\'s Trauma Vulnerability +{N}% for {N} seconds',
  },
  // Strategic Chomp deals +5 damage and generates no taunt, instead detaunting by 100% of the ability's direct damage
  {
    powerId: 'power_22080',
    name: 'PigStrategicChompDetaunt',
    target: { abilities: ['Strategic Chomp'] },
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
    ],
    template: 'Strategic Chomp deals +{N} damage and generates no taunt, instead detaunting by {N}% of the ability\'s direct damage',
  },
  // Strategic Chomp deals +6% damage and generates 50 less Rage
  {
    powerId: 'power_22079',
    name: 'PigStrategicChompLowerRage',
    target: { abilities: ['Strategic Chomp'] },
    effects: [
      { type: 'percentDamage', valuePattern: /damage[^]*?\+(\d+)%/ },
    ],
    template: 'Strategic Chomp deals +{N}% damage and generates {N} less Rage',
  },
  // Strategic Chomp boosts your mitigation versus physical damage +1 for 20 seconds
  {
    powerId: 'power_22082',
    name: 'PigStrategicChompMitigation',
    target: { abilities: ['Strategic Chomp'] },
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
    ],
    template: 'Strategic Chomp boosts your mitigation versus physical damage +{N} for {N} seconds',
  },
  // Strategic Chomp restores 3 Power
  {
    powerId: 'power_22083',
    name: 'PigStrategicChompPower',
    target: { abilities: ['Strategic Chomp'] },
    effects: [
      { type: 'restore', valuePattern: /(?:restores?|heals? you for) (\d+) Power/, resourceType: 'Power' },
    ],
    template: 'Strategic Chomp restores {N} Power',
  },
  // Strategic Chomp and Squeal deal +12 Trauma damage over 8 seconds
  {
    powerId: 'power_22090',
    name: 'PigStrategicChompSquealDoT',
    target: { abilities: ['Strategic Chomp', 'Squeal'] },
    effects: [
      { type: 'dot', valuePattern: /deals? \+?(\d+) Trauma damage/, damageType: 'Trauma', duration: 8 },
    ],
    template: 'Strategic Chomp and Squeal deal +{N} Trauma damage over {N} seconds',
  },
  // Porcine Alertness gives all targets +5 Accuracy for 20 seconds
  {
    powerId: 'power_22451',
    name: 'PorcineAlertnessAccuracy',
    target: 'self',
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Porcine Alertness gives all targets +{N} Accuracy for {N} seconds',
  },
  // Porcine Alertness restores 10 armor to all targets
  {
    powerId: 'power_22452',
    name: 'PorcineAlertnessArmor',
    target: { abilities: ['Porcine Alertness'] },
    effects: [
      { type: 'restore', valuePattern: /(?:restores?|heals? you for) (\d+) armor/, resourceType: 'armor' },
    ],
    template: 'Porcine Alertness restores {N} armor to all targets',
  },
  // Porcine Alertness heals all targets for 7 health after a 15 second delay
  {
    powerId: 'power_22454',
    name: 'PorcineAlertnessDelayedHeal',
    target: { abilities: ['Porcine Alertness'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Porcine Alertness heals all targets for {N} health after a {N} second delay',
  },
  // Porcine Alertness gives all targets +5% chance to ignore Stun effects for 20 seconds
  {
    powerId: 'power_22453',
    name: 'PorcineAlertnessStunResist',
    target: 'self',
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Porcine Alertness gives all targets +{N}% chance to ignore Stun effects for {N} seconds',
  },
];
