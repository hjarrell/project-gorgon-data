import type { PowerEffectConfig } from './types';

export const GIANTBAT_EFFECTS: PowerEffectConfig[] = [
  // Combo: Rip+Any Melee+Any Melee+Bat Stability: final step boosts Giant Bat Base Damage +10% for 10 seconds.
  {
    powerId: 'power_24153',
    name: 'BatStabilityDamageBoost',
    target: { abilities: ['Combo: Rip+Any Melee+Any Melee+Bat Stability: final step'] },
    effects: [
      { type: 'percentDamage', valuePattern: /damage[^]*?\+(\d+)%/ },
    ],
    template: 'Combo: Rip+Any Melee+Any Melee+Bat Stability: final step boosts Giant Bat Base Damage +{N}% for {N} seconds.',
  },
  // Bat Stability heals 10 health
  {
    powerId: 'power_24151',
    name: 'BatStabilityHeal',
    target: { abilities: ['Bat Stability'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Bat Stability heals {N} health',
  },
  // Bat Stability provides +10% Projectile Evasion for 10 seconds
  {
    powerId: 'power_24154',
    name: 'BatStabilityProjectileEvasion',
    target: 'self',
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Bat Stability provides +{N}% Projectile Evasion for {N} seconds',
  },
  // Confusing Double summons an additional figment. Each figment deals +5 damage with each attack
  {
    powerId: 'power_24246',
    name: 'ConfusingDoubleCloneA',
    target: { abilities: ['Confusing Double summons an additional figment. Each figment'] },
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
    ],
    template: 'Confusing Double summons an additional figment. Each figment deals +{N} damage with each attack',
  },
  // Confusing Double summons an additional figment. Each figment deals +5 damage with each attack
  {
    powerId: 'power_24247',
    name: 'ConfusingDoubleCloneB',
    target: { abilities: ['Confusing Double summons an additional figment. Each figment'] },
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
    ],
    template: 'Confusing Double summons an additional figment. Each figment deals +{N} damage with each attack',
  },
  // Your Confusing Double deals +10% damage with each attack
  {
    powerId: 'power_24245',
    name: 'ConfusingDoubleDamage',
    target: { abilities: ['Your Confusing Double'] },
    effects: [
      { type: 'percentDamage', valuePattern: /damage[^]*?\+(\d+)%/ },
    ],
    template: 'Your Confusing Double deals +{N}% damage with each attack',
  },
  // Confusing Double heals you for 18 health
  {
    powerId: 'power_24241',
    name: 'ConfusingDoubleHeal',
    target: { abilities: ['Confusing Double'] },
    effects: [
      { type: 'restore', valuePattern: /(?:restores?|heals? you for) (\d+) health/, resourceType: 'health' },
    ],
    template: 'Confusing Double heals you for {N} health',
  },
  // Confusing Double restores 20 Power after a 10 second delay
  {
    powerId: 'power_24244',
    name: 'ConfusingDoublePower',
    target: { abilities: ['Confusing Double'] },
    effects: [
      { type: 'restore', valuePattern: /(?:restores?|heals? you for) (\d+) Power/, resourceType: 'Power' },
    ],
    template: 'Confusing Double restores {N} Power after a {N} second delay',
  },
  // Confusing Double boosts your movement speed by 1 and your Giant Bat Base Damage by 5% for 15 seconds
  {
    powerId: 'power_24242',
    name: 'ConfusingDoubleSpeed',
    target: { abilities: ['Confusing Double'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Confusing Double boosts your movement speed by {N} and your Giant Bat Base Damage by {N}% for {N} seconds',
  },
  // Deathscream has a 60% chance to deal +25% damage
  {
    powerId: 'power_24282',
    name: 'DeathscreamCrit',
    target: { abilities: ['Deathscream'] },
    effects: [
      { type: 'percentDamage', valuePattern: /damage[^]*?\+(\d+)%/ },
    ],
    template: 'Deathscream has a {N}% chance to deal +{N}% damage',
  },
  // Deathscream deals an additional 54 Trauma damage over 12 seconds
  {
    powerId: 'power_24283',
    name: 'DeathscreamDoT',
    target: { abilities: ['Deathscream'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Deathscream deals an additional {N} Trauma damage over {N} seconds',
  },
  // Deathscream deals +15% damage and Power cost is -2, but the ability's range is reduced to 12m
  {
    powerId: 'power_24284',
    name: 'DeathscreamWhisper',
    target: { abilities: ['Deathscream'] },
    effects: [
      { type: 'percentDamage', valuePattern: /damage[^]*?\+(\d+)%/ },
    ],
    template: 'Deathscream deals +{N}% damage and Power cost is {N}, but the ability\'s range is reduced to {N}m',
  },
  // For 30 seconds after using Drink Blood, all Nature attacks deal +3 damage
  {
    powerId: 'power_24094',
    name: 'DrinkBloodBoostNature',
    target: 'self',
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
    ],
    template: 'For {N} seconds after using Drink Blood, all Nature attacks deal +{N} damage',
  },
  // Drink Blood deals +8 Piercing damage
  {
    powerId: 'power_24092',
    name: 'DrinkBloodDamage',
    target: { abilities: ['Drink Blood'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Drink Blood deals +{N} Piercing damage',
  },
  // Drink Blood steals 24 more Health over 12 seconds
  {
    powerId: 'power_24096',
    name: 'DrinkBloodDoT',
    target: 'self',
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Drink Blood steals {N} more Health over {N} seconds',
  },
  // For 30 seconds after using Drink Blood, you gain +2 mitigation vs. Psychic and Trauma damage
  {
    powerId: 'power_24095',
    name: 'DrinkBloodMitigation',
    target: 'self',
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'For {N} seconds after using Drink Blood, you gain +{N} mitigation vs. Psychic and Trauma damage',
  },
  // Drink Blood costs -3 Power
  {
    powerId: 'power_24093',
    name: 'DrinkBloodPower',
    target: 'self',
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Drink Blood costs {N} Power',
  },
  // Drink Blood steals 4 additional health
  {
    powerId: 'power_24091',
    name: 'DrinkBloodReapBoost',
    target: 'self',
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Drink Blood steals {N} additional health',
  },
  // Combo: Rip+Any Melee+Any Giant Bat Attack+Tear: final step hits all targets within 5 meters and deals +5 damage.
  {
    powerId: 'power_24004',
    name: 'GiantBatRipAoECombo',
    target: { abilities: ['Combo: Rip+Any Melee+Any Giant Bat Attack+Tear: final step hits all targets within 5 meters and'] },
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
      { type: 'aoeDelta', valuePattern: /(?:within|targets within) (\d+) meters/ },
    ],
    template: 'Combo: Rip+Any Melee+Any Giant Bat Attack+Tear: final step hits all targets within {N} meters and deals +{N} damage.',
  },
  // If Screech, Sonic Burst, or Deathscream deal Trauma damage, that damage is boosted +15% per tick
  {
    powerId: 'power_24304',
    name: 'GiantBatSonicBleedMod',
    target: 'self',
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'If Screech, Sonic Burst, or Deathscream deal Trauma damage, that damage is boosted +{N}% per tick',
  },
  // Screech, Sonic Burst, and Deathscream deal 16 Nature damage over 8 seconds
  {
    powerId: 'power_24305',
    name: 'GiantBatSonicNatureDoT',
    target: { abilities: ['Screech', 'Sonic Burst', 'Deathscream'] },
    effects: [
      { type: 'dot', valuePattern: /deals? \+?(\d+) Nature damage/, damageType: 'Nature', duration: 8 },
    ],
    template: 'Screech, Sonic Burst, and Deathscream deal {N} Nature damage over {N} seconds',
  },
  // Rip and Tear deal +3 damage and hasten the current reuse timer of Drink Blood by 1 second
  {
    powerId: 'power_24035',
    name: 'RipAndTearHastenDrinkBlood',
    target: { abilities: ['Rip', 'Tear'] },
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
      { type: 'cooldownDelta', valuePattern: /by (\d+) seconds?/ },
    ],
    template: 'Rip and Tear deal +{N} damage and hasten the current reuse timer of Drink Blood by {N} second',
  },
  // Rip restores 5 Armor
  {
    powerId: 'power_24003',
    name: 'RipArmor',
    target: { abilities: ['Rip'] },
    effects: [
      { type: 'restore', valuePattern: /(?:restores?|heals? you for) (\d+) Armor/, resourceType: 'Armor' },
    ],
    template: 'Rip restores {N} Armor',
  },
  // Rip deals +5 damage and restores 2 Power
  {
    powerId: 'power_24002',
    name: 'RipBoost',
    target: { abilities: ['Rip'] },
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
      { type: 'restore', valuePattern: /(?:restores?|heals? you for) (\d+) Power/, resourceType: 'Power' },
    ],
    template: 'Rip deals +{N} damage and restores {N} Power',
  },
  // Screech deals 36 Trauma damage over 12 seconds
  {
    powerId: 'power_24184',
    name: 'ScreechBleed',
    target: { abilities: ['Screech'] },
    effects: [
      { type: 'dot', valuePattern: /deals? \+?(\d+) Trauma damage/, damageType: 'Trauma', duration: 12 },
    ],
    template: 'Screech deals {N} Trauma damage over {N} seconds',
  },
  // Screech has a 60% chance to deal +5% damage
  {
    powerId: 'power_24182',
    name: 'ScreechCrit',
    target: { abilities: ['Screech'] },
    effects: [
      { type: 'percentDamage', valuePattern: /damage[^]*?\+(\d+)%/ },
    ],
    template: 'Screech has a {N}% chance to deal +{N}% damage',
  },
  // Screech deals +13 damage
  {
    powerId: 'power_24183',
    name: 'ScreechDamage',
    target: { abilities: ['Screech'] },
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
    ],
    template: 'Screech deals +{N} damage',
  },
  // Sonic Burst deals 30 Trauma damage over 12 seconds
  {
    powerId: 'power_24214',
    name: 'SonicBurstBleed',
    target: { abilities: ['Sonic Burst'] },
    effects: [
      { type: 'dot', valuePattern: /deals? \+?(\d+) Trauma damage/, damageType: 'Trauma', duration: 12 },
    ],
    template: 'Sonic Burst deals {N} Trauma damage over {N} seconds',
  },
  // Combo: Sonic Burst+Any Giant Bat Attack+Any Ranged Attack+Any Ranged Attack: final step deals +10% damage
  {
    powerId: 'power_24213',
    name: 'SonicBurstCombo',
    target: { abilities: ['Combo: Sonic Burst+Any Giant Bat Attack+Any Ranged Attack+Any Ranged Attack: final step'] },
    effects: [
      { type: 'percentDamage', valuePattern: /damage[^]*?\+(\d+)%/ },
    ],
    template: 'Combo: Sonic Burst+Any Giant Bat Attack+Any Ranged Attack+Any Ranged Attack: final step deals +{N}% damage',
  },
  // Sonic Burst has a 60% chance to deal +10% damage to all targets
  {
    powerId: 'power_24212',
    name: 'SonicBurstCrit',
    target: { abilities: ['Sonic Burst'] },
    effects: [
      { type: 'percentDamage', valuePattern: /damage[^]*?\+(\d+)%/ },
    ],
    template: 'Sonic Burst has a {N}% chance to deal +{N}% damage to all targets',
  },
  // Tear and Virulent Bite deal +6 damage
  {
    powerId: 'power_24034',
    name: 'TearAndVirulentBiteBoost',
    target: { abilities: ['Tear', 'Virulent Bite'] },
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
    ],
    template: 'Tear and Virulent Bite deal +{N} damage',
  },
  // Tear has a 50% chance to deal +25% damage
  {
    powerId: 'power_24032',
    name: 'TearCrit',
    target: { abilities: ['Tear'] },
    effects: [
      { type: 'percentDamage', valuePattern: /damage[^]*?\+(\d+)%/ },
    ],
    template: 'Tear has a {N}% chance to deal +{N}% damage',
  },
  // Tear has a 33% chance to deal +10% damage and reset the timer on Screech (so Screech can be used again immediately)
  {
    powerId: 'power_24033',
    name: 'TearCritB',
    target: { abilities: ['Tear'] },
    effects: [
      { type: 'percentDamage', valuePattern: /damage[^]*?\+(\d+)%/ },
    ],
    template: 'Tear has a {N}% chance to deal +{N}% damage and reset the timer on Screech (so Screech can be used again immediately)',
  },
  // Virulent Bite deals 24 Trauma damage to health over 12 seconds
  {
    powerId: 'power_24123',
    name: 'VirulentBiteBleed',
    target: { abilities: ['Virulent Bite'] },
    effects: [
      { type: 'dot', valuePattern: /deals? \+?(\d+) Trauma damage/, damageType: 'Trauma', duration: 12 },
    ],
    template: 'Virulent Bite deals {N} Trauma damage to health over {N} seconds',
  },
  // Virulent Bite deals 12 Trauma damage over 12 seconds and also has a 25% chance to deal +16% immediate Piercing damage
  {
    powerId: 'power_24122',
    name: 'VirulentBiteCrit',
    target: { abilities: ['Virulent Bite'] },
    effects: [
      { type: 'dot', valuePattern: /deals? \+?(\d+) Trauma damage/, damageType: 'Trauma', duration: 12 },
    ],
    template: 'Virulent Bite deals {N} Trauma damage over {N} seconds and also has a {N}% chance to deal +{N}% immediate Piercing damage',
  },
  // Combo: Screech+Any Giant Bat Attack+Any Melee+Virulent Bite: final step stuns the target and deals +10 damage
  {
    powerId: 'power_24124',
    name: 'VirulentBiteStunCombo',
    target: { abilities: ['Combo: Screech+Any Giant Bat Attack+Any Melee+Virulent Bite: final step stuns the target and'] },
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
    ],
    template: 'Combo: Screech+Any Giant Bat Attack+Any Melee+Virulent Bite: final step stuns the target and deals +{N} damage',
  },
  // Wing Vortex causes targets' next attack to deal -4 damage
  {
    powerId: 'power_24064',
    name: 'WingVortexDebuff',
    target: { abilities: ['Wing Vortex causes targets\' next attack to'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Wing Vortex causes targets\' next attack to deal {N} damage',
  },
  // Wing Vortex has a 70% chance to deal +10% damage and restore 10 Health to you
  {
    powerId: 'power_24062',
    name: 'WingVortexHealCrit',
    target: { abilities: ['Wing Vortex'] },
    effects: [
      { type: 'percentDamage', valuePattern: /damage[^]*?\+(\d+)%/ },
      { type: 'restore', valuePattern: /(?:restores?|heals? you for) (\d+) Health/, resourceType: 'Health' },
    ],
    template: 'Wing Vortex has a {N}% chance to deal +{N}% damage and restore {N} Health to you',
  },
  // Wing Vortex has a 30% chance to deal +10% damage and stun all targets
  {
    powerId: 'power_24063',
    name: 'WingVortexStunCrit',
    target: { abilities: ['Wing Vortex'] },
    effects: [
      { type: 'percentDamage', valuePattern: /damage[^]*?\+(\d+)%/ },
    ],
    template: 'Wing Vortex has a {N}% chance to deal +{N}% damage and stun all targets',
  },
];
