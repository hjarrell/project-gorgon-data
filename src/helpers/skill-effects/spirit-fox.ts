import type { PowerEffectConfig } from './types';

export const SPIRITFOX_EFFECTS: PowerEffectConfig[] = [
  // Blur Step provides +10% Burst Evasion for 20 seconds, and Paradox Trot boosts Sprint Speed +1
  {
    powerId: 'power_28161',
    name: 'BlurStepBurstEvasion',
    target: { abilities: ['Blur Step provides +10% Burst Evasion for 20 seconds', 'Paradox Trot'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Blur Step provides +{N}% Burst Evasion for {N} seconds, and Paradox Trot boosts Sprint Speed +{N}',
  },
  // Blur Step heals 30 Health over 20 seconds, and Paradox Trot boosts Sprint Speed +1
  {
    powerId: 'power_28163',
    name: 'BlurStepHoT',
    target: { abilities: ['Blur Step'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Blur Step heals {N} Health over {N} seconds, and Paradox Trot boosts Sprint Speed +{N}',
  },
  // Blur Step provides +10% Ranged Evasion for 20 seconds, and Paradox Trot boosts Sprint Speed +1
  {
    powerId: 'power_28162',
    name: 'BlurStepRangedEvasion',
    target: { abilities: ['Blur Step provides +10% Ranged Evasion for 20 seconds', 'Paradox Trot'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Blur Step provides +{N}% Ranged Evasion for {N} seconds, and Paradox Trot boosts Sprint Speed +{N}',
  },
  // Blur Step provides +10% Stun Resistance for 20 seconds, and Paradox Trot boosts Sprint Speed +1
  {
    powerId: 'power_28164',
    name: 'BlurStepStunResist',
    target: { abilities: ['Blur Step provides +10% Stun Resistance for 20 seconds', 'Paradox Trot'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Blur Step provides +{N}% Stun Resistance for {N} seconds, and Paradox Trot boosts Sprint Speed +{N}',
  },
  // Cinderstorm direct damage is +9 and deals Darkness damage (instead of Fire)
  {
    powerId: 'power_28263',
    name: 'CinderstormDarkness',
    target: { abilities: ['Cinderstorm direct'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Cinderstorm direct damage is +{N} and deals Darkness damage (instead of Fire)',
  },
  // Cinderstorm deals +40 Fire damage over 8 seconds. Reuse time -1 seconds
  {
    powerId: 'power_28261',
    name: 'CinderstormDoT',
    target: { abilities: ['Cinderstorm'] },
    effects: [
      { type: 'dot', valuePattern: /deals? \+?(\d+) Fire damage/, damageType: 'Fire', duration: 8 },
      { type: 'cooldownDelta', valuePattern: /by (\d+) seconds?/ },
    ],
    template: 'Cinderstorm deals +{N} Fire damage over {N} seconds. Reuse time {N} seconds',
  },
  // Dimensional Snare causes target to take +5% damage from Crushing for 15 seconds
  {
    powerId: 'power_28105',
    name: 'DimensionalSnareCrushingVuln',
    target: { abilities: ['Dimensional Snare causes target to take +5%'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Dimensional Snare causes target to take +{N}% damage from Crushing for {N} seconds',
  },
  // Dimensional Snare causes target to take +5% damage from Darkness for 15 seconds
  {
    powerId: 'power_28103',
    name: 'DimensionalSnareDarknessVuln',
    target: { abilities: ['Dimensional Snare causes target to take +5%'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Dimensional Snare causes target to take +{N}% damage from Darkness for {N} seconds',
  },
  // Dimensional Snare deals Fire damage (instead of Darkness) and ignites the target, dealing 24 Fire damage over 12 seconds
  {
    powerId: 'power_28106',
    name: 'DimensionalSnareDoT',
    target: { abilities: ['Dimensional Snare'] },
    effects: [
      { type: 'dot', valuePattern: /dealing (\d+) Fire damage/, damageType: 'Fire', duration: 12 },
    ],
    template: 'Dimensional Snare deals Fire damage (instead of Darkness) and ignites the target, dealing {N} Fire damage over {N} seconds',
  },
  // Dimensional Snare Damage +33
  {
    powerId: 'power_28102',
    name: 'DimensionalSnareKill',
    target: { abilities: ['Dimensional Snare'] },
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
    ],
    template: 'Dimensional Snare Damage +{N}',
  },
  // Dimensional Snare causes target to take +5% damage from Poison for 15 seconds
  {
    powerId: 'power_28104',
    name: 'DimensionalSnarePoisonVuln',
    target: { abilities: ['Dimensional Snare causes target to take +5%'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Dimensional Snare causes target to take +{N}% damage from Poison for {N} seconds',
  },
  // Nip boosts the damage of Basic, Core, and Nice attacks +5 for 6 seconds. (This buff does not stack with itself.)
  {
    powerId: 'power_28042',
    name: 'FoxNipBuffA',
    target: { abilities: ['Nip'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Nip boosts the damage of Basic, Core, and Nice attacks +{N} for {N} seconds. (This buff does not stack with itself.)',
  },
  // Nip boosts the damage of Basic, Core, and Nice attacks +5 for 6 seconds. (This buff does not stack with itself.)
  {
    powerId: 'power_28043',
    name: 'FoxNipBuffB',
    target: { abilities: ['Nip'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Nip boosts the damage of Basic, Core, and Nice attacks +{N} for {N} seconds. (This buff does not stack with itself.)',
  },
  // Nip causes target's next attack to deal -1 damage
  {
    powerId: 'power_28041',
    name: 'FoxNipDebuff',
    target: { abilities: ['Nip causes target\'s next attack to'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Nip causes target\'s next attack to deal {N} damage',
  },
  // Galvanize restores 10 additional Power after a 6-second delay
  {
    powerId: 'power_28185',
    name: 'GalvanizeDelayedPower',
    target: { abilities: ['Galvanize'] },
    effects: [
      { type: 'restore', valuePattern: /(?:restores?|heals? you for) (\d+) additional/, resourceType: 'additional' },
    ],
    template: 'Galvanize restores {N} additional Power after a {N}-second delay',
  },
  // Galvanize grants pets Health (or Armor if Health is full) equal to the amount of Power generated +10
  {
    powerId: 'power_28187',
    name: 'GalvanizePets',
    target: 'self',
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Galvanize grants pets Health (or Armor if Health is full) equal to the amount of Power generated +{N}',
  },
  // Power Glyph and Galvanize restore +3 Power
  {
    powerId: 'power_28184',
    name: 'GalvanizePowerGlyphBoost',
    target: { abilities: ['Power Glyph', 'Galvanize'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Power Glyph and Galvanize restore +{N} Power',
  },
  // Galvanize affects the caster in addition to allies, and restores +4 Power
  {
    powerId: 'power_28183',
    name: 'GalvanizeSelf',
    target: 'self',
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Galvanize affects the caster in addition to allies, and restores +{N} Power',
  },
  // Infectious Instincts boosts target pet's next attack +8
  {
    powerId: 'power_28241',
    name: 'InfectiousInstinctsBoost',
    target: { abilities: ['Infectious Instincts'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Infectious Instincts boosts target pet\'s next attack +{N}',
  },
  // Infectious Instincts boosts target pet's non-Rage Attack damage +2 for 12 seconds
  {
    powerId: 'power_28242',
    name: 'InfectiousInstinctsBoostNonRageDmg',
    target: { abilities: ['Infectious Instincts'] },
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
    ],
    template: 'Infectious Instincts boosts target pet\'s non-Rage Attack damage +{N} for {N} seconds',
  },
  // Infectious Instincts grants target pet +2 Mitigation vs. elemental (fire, cold, and electricity) damage for 20 seconds
  {
    powerId: 'power_28244',
    name: 'InfectiousInstinctsElementalMitigation',
    target: 'self',
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Infectious Instincts grants target pet +{N} Mitigation vs. elemental (fire, cold, and electricity) damage for {N} seconds',
  },
  // Infectious Instincts grants target pet +1 Mitigation vs. physical (slashing, crushing, and piercing) damage for 20 seconds
  {
    powerId: 'power_28243',
    name: 'InfectiousInstinctsPhysicalMitigation',
    target: 'self',
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Infectious Instincts grants target pet +{N} Mitigation vs. physical (slashing, crushing, and piercing) damage for {N} seconds',
  },
  // Paradox Trot boosts Sprint Speed +1, Max Breath +2, and Radiation Protection +2
  {
    powerId: 'power_28221',
    name: 'ParadoxTrotBreath',
    target: { abilities: ['Paradox Trot'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Paradox Trot boosts Sprint Speed +{N}, Max Breath +{N}, and Radiation Protection +{N}',
  },
  // Power Glyph restores +6 Power when touched
  {
    powerId: 'power_28141',
    name: 'PowerGlyphBoost',
    target: { abilities: ['Power Glyph'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Power Glyph restores +{N} Power when touched',
  },
  // Power Glyph restores 5 additional Power after a 6-second delay
  {
    powerId: 'power_28143',
    name: 'PowerGlyphDelayedPower',
    target: { abilities: ['Power Glyph'] },
    effects: [
      { type: 'restore', valuePattern: /(?:restores?|heals? you for) (\d+) additional/, resourceType: 'additional' },
    ],
    template: 'Power Glyph restores {N} additional Power after a {N}-second delay',
  },
  // Power Glyph restores +5 Health when touched
  {
    powerId: 'power_28142',
    name: 'PowerGlyphHeal',
    target: { abilities: ['Power Glyph'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Power Glyph restores +{N} Health when touched',
  },
  // Soul Bite deals +3 damage and boosts the damage of Nice attacks by +1% for 6 seconds
  {
    powerId: 'power_28062',
    name: 'SoulBiteBoostNice',
    target: { abilities: ['Soul Bite'] },
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
    ],
    template: 'Soul Bite deals +{N} damage and boosts the damage of Nice attacks by +{N}% for {N} seconds',
  },
  // While Blur Step is active, Soul Bite has a 33% chance to deal +10 damage and hit all targets within 7 meters
  {
    powerId: 'power_28064',
    name: 'SoulBiteChanceForAoE',
    target: { abilities: ['While Blur Step is active', 'Soul Bite'] },
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
      { type: 'aoeDelta', valuePattern: /(?:within|targets within) (\d+) meters/ },
    ],
    template: 'While Blur Step is active, Soul Bite has a {N}% chance to deal +{N} damage and hit all targets within {N} meters',
  },
  // Soul Bite deals +7 damage and reduces the damage of the target's next attack by -1
  {
    powerId: 'power_28063',
    name: 'SoulBiteDebuff',
    target: { abilities: ['Soul Bite'] },
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
    ],
    template: 'Soul Bite deals +{N} damage and reduces the damage of the target\'s next attack by {N}',
  },
  // Soul Bite deals Fire damage (instead of Darkness) and damage is +2
  {
    powerId: 'power_28066',
    name: 'SoulBiteFire',
    target: { abilities: ['Soul Bite'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Soul Bite deals Fire damage (instead of Darkness) and damage is +{N}',
  },
  // Spirit Bolt deals +6 damage and there's a 50% chance it deals +10% damage
  {
    powerId: 'power_28124',
    name: 'SpiritBoltCrit',
    target: { abilities: ['Spirit Bolt'] },
    effects: [
      { type: 'percentDamage', valuePattern: /damage[^]*?\+(\d+)%/ },
    ],
    template: 'Spirit Bolt deals +{N} damage and there\'s a {N}% chance it deals +{N}% damage',
  },
  // Spirit Bolt deals Fire damage (instead of Darkness) and ignites the target, dealing 18 Fire damage over 12 seconds
  {
    powerId: 'power_28125',
    name: 'SpiritBoltFireDoT',
    target: { abilities: ['Spirit Bolt'] },
    effects: [
      { type: 'dot', valuePattern: /dealing (\d+) Fire damage/, damageType: 'Fire', duration: 12 },
    ],
    template: 'Spirit Bolt deals Fire damage (instead of Darkness) and ignites the target, dealing {N} Fire damage over {N} seconds',
  },
  // Spirit Bolt Damage +15 and range is +5 meters
  {
    powerId: 'power_28123',
    name: 'SpiritBoltRange',
    target: { abilities: ['Spirit Bolt'] },
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
    ],
    template: 'Spirit Bolt Damage +{N} and range is +{N} meters',
  },
  // Spirit Bolt Damage +10 and there's a 50% chance target is stunned
  {
    powerId: 'power_28122',
    name: 'SpiritBoltStun',
    target: { abilities: ['Spirit Bolt'] },
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
    ],
    template: 'Spirit Bolt Damage +{N} and there\'s a {N}% chance target is stunned',
  },
  // Spirit Pounce Damage +3 and ability hits all enemies within 6 meters
  {
    powerId: 'power_28084',
    name: 'SpiritPounceAoE',
    target: { abilities: ['Spirit Pounce'] },
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
      { type: 'aoeDelta', valuePattern: /(?:within|targets within) (\d+) meters/ },
    ],
    template: 'Spirit Pounce Damage +{N} and ability hits all enemies within {N} meters',
  },
  // Spirit Pounce Damage +2 and target is Knocked Back
  {
    powerId: 'power_28083',
    name: 'SpiritPounceKnockback',
    target: { abilities: ['Spirit Pounce'] },
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
    ],
    template: 'Spirit Pounce Damage +{N} and target is Knocked Back',
  },
  // Spirit Pounce Damage +5% and there's a 50% chance target is Stunned
  {
    powerId: 'power_28082',
    name: 'SpiritPounceStun',
    target: { abilities: ['Spirit Pounce'] },
    effects: [
      { type: 'percentDamage', valuePattern: /damage[^]*?\+(\d+)%/ },
    ],
    template: 'Spirit Pounce Damage +{N}% and there\'s a {N}% chance target is Stunned',
  },
  // Trick Foxes have +8 Max Health and their Rage Attacks deal +20 damage
  {
    powerId: 'power_28203',
    name: 'TrickFoxDamage',
    target: 'self',
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
    ],
    template: 'Trick Foxes have +{N} Max Health and their Rage Attacks deal +{N} damage',
  },
  // Trick Foxes have +8 Max Health and +4 Max Armor
  {
    powerId: 'power_28202',
    name: 'TrickFoxHealth',
    target: 'self',
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Trick Foxes have +{N} Max Health and +{N} Max Armor',
  },
  // Trick Foxes have +8 Max Health and Taunt +10%
  {
    powerId: 'power_28201',
    name: 'TrickFoxTaunt',
    target: 'self',
    effects: [
      { type: 'tauntDelta', valuePattern: /[Tt]aunt \+(\d+)/ },
    ],
    template: 'Trick Foxes have +{N} Max Health and Taunt +{N}%',
  },
];
