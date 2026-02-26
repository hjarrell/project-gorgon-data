import type { PowerEffectConfig } from './types';

export const FIREMAGIC_EFFECTS: PowerEffectConfig[] = [
  // Calefaction causes target to take +1% damage from Cold for 12 seconds
  {
    powerId: 'power_2016',
    name: 'CalefactionDebuffsCold',
    target: { abilities: ['Calefaction causes target to take +1%'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Calefaction causes target to take +{N}% damage from Cold for {N} seconds',
  },
  // Calefaction and Defensive Burst Damage +10% and Reuse Timer -1 second
  {
    powerId: 'power_2152',
    name: 'CalefactionDefensiveBurstFaster',
    target: { abilities: ['Calefaction', 'Defensive Burst'] },
    effects: [
      { type: 'percentDamage', valuePattern: /damage[^]*?\+(\d+)%/ },
    ],
    template: 'Calefaction and Defensive Burst Damage +{N}% and Reuse Timer {N} second',
  },
  // Calefaction deals 33 additional Fire damage after a 12 second delay
  {
    powerId: 'power_2154',
    name: 'CalefactionDelayedBomb',
    target: { abilities: ['Calefaction'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Calefaction deals {N} additional Fire damage after a {N} second delay',
  },
  // Calefaction restores 14 Health
  {
    powerId: 'power_2153',
    name: 'CalefactionHealHealth',
    target: { abilities: ['Calefaction'] },
    effects: [
      { type: 'restore', valuePattern: /(?:restores?|heals? you for) (\d+) Health/, resourceType: 'Health' },
    ],
    template: 'Calefaction restores {N} Health',
  },
  // Frostball, Scintillating Frost, and Defensive Chill grant +3 Direct and Indirect Cold Protection for 10 seconds
  {
    powerId: 'power_2207',
    name: 'ColdSpellsBoostColdProt',
    target: 'self',
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Frostball, Scintillating Frost, and Defensive Chill grant +{N} Direct and Indirect Cold Protection for {N} seconds',
  },
  // Room-Temperature Ball deals Darkness damage and causes +24 damage over 12 seconds
  {
    powerId: 'power_2023',
    name: 'CrushingBallDarkness',
    target: { abilities: ['Room-Temperature Ball'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Room-Temperature Ball deals Darkness damage and causes +{N} damage over {N} seconds',
  },
  // Room-Temperature Ball Damage +5% and reuse timer -1 second
  {
    powerId: 'power_2024',
    name: 'CrushingBallFaster',
    target: { abilities: ['Room-Temperature Ball'] },
    effects: [
      { type: 'percentDamage', valuePattern: /damage[^]*?\+(\d+)%/ },
    ],
    template: 'Room-Temperature Ball Damage +{N}% and reuse timer {N} second',
  },
  // Defensive Burst deals +12% damage and raises Basic Attack Damage +5% for 10 seconds
  {
    powerId: 'power_2204',
    name: 'DefensiveBurstBoost',
    target: { abilities: ['Defensive Burst'] },
    effects: [
      { type: 'percentDamage', valuePattern: /damage[^]*?\+(\d+)%/ },
    ],
    template: 'Defensive Burst deals +{N}% damage and raises Basic Attack Damage +{N}% for {N} seconds',
  },
  // Fire Breath hits all targets within 8 meters and deals +3 damage, but reuse timer is +3 seconds and Power cost is +2
  {
    powerId: 'power_2011',
    name: 'FireBreathAoE',
    target: { abilities: ['Fire Breath hits all targets within 8 meters and'] },
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
      { type: 'aoeDelta', valuePattern: /(?:within|targets within) (\d+) meters/ },
    ],
    template: 'Fire Breath hits all targets within {N} meters and deals +{N} damage, but reuse timer is +{N} seconds and Power cost is +{N}',
  },
  // Fire Breath deals +23 damage and grants you +3 mitigation vs Fire for 10 seconds
  {
    powerId: 'power_2009',
    name: 'FireBreathFireProtect',
    target: { abilities: ['Fire Breath'] },
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
    ],
    template: 'Fire Breath deals +{N} damage and grants you +{N} mitigation vs Fire for {N} seconds',
  },
  // You regain 3 Health when using Ring of Fire, Defensive Burst, or Defensive Chill
  {
    powerId: 'power_2052',
    name: 'FireBurstHealHealth',
    target: 'self',
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'You regain {N} Health when using Ring of Fire, Defensive Burst, or Defensive Chill',
  },
  // You regain 2 Power when using Ring of Fire, Defensive Burst, or Defensive Chill
  {
    powerId: 'power_2051',
    name: 'FireBurstHealPower',
    target: 'self',
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'You regain {N} Power when using Ring of Fire, Defensive Burst, or Defensive Chill',
  },
  // Frostball, Scintillating Frost, and Defensive Chill boost your Nice Attack Damage +16 for 10 seconds
  {
    powerId: 'power_2015',
    name: 'FireMagicBoostNiceAttacks',
    target: { abilities: ['Frostball', 'Scintillating Frost', 'Defensive Chill'] },
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
    ],
    template: 'Frostball, Scintillating Frost, and Defensive Chill boost your Nice Attack Damage +{N} for {N} seconds',
  },
  // Molten Veins and Flesh to Fuel restore 12 health to any pets (including Fire Walls) within 20 meters
  {
    powerId: 'power_2304',
    name: 'FireMagicHealPets',
    target: { abilities: ['Molten Veins', 'Flesh to Fuel'] },
    effects: [
      { type: 'restore', valuePattern: /(?:restores?|heals? you for) (\d+) health/, resourceType: 'health' },
      { type: 'aoeDelta', valuePattern: /(?:within|targets within) (\d+) meters/ },
    ],
    template: 'Molten Veins and Flesh to Fuel restore {N} health to any pets (including Fire Walls) within {N} meters',
  },
  // Fire Breath and Super Fireball deal +45 damage over 10 seconds
  {
    powerId: 'power_2005',
    name: 'FireMagicSuperDoT',
    target: { abilities: ['Fire Breath', 'Super Fireball'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Fire Breath and Super Fireball deal +{N} damage over {N} seconds',
  },
  // Room-Temperature Ball and Defensive Burst cause the target's attacks to deal -3 damage for 10 seconds
  {
    powerId: 'power_2017',
    name: 'FireMagicWeaken',
    target: { abilities: ['Room-Temperature Ball', 'Defensive Burst cause the target\'s attacks to'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Room-Temperature Ball and Defensive Burst cause the target\'s attacks to deal {N} damage for {N} seconds',
  },
  // All fire spells deal up to +10 damage (randomly determined)
  {
    powerId: 'power_2003',
    name: 'FireSpellRndBoost',
    target: { abilities: ['All fire spells'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'All fire spells deal up to +{N} damage (randomly determined)',
  },
  // Fire Walls deal +10% damage per hit. Fire Wall reuse time is -3 seconds.
  {
    powerId: 'power_2301',
    name: 'FireWallBoostDamage',
    target: { abilities: ['Fire Walls'] },
    effects: [
      { type: 'percentDamage', valuePattern: /damage[^]*?\+(\d+)%/ },
      { type: 'cooldownDelta', valuePattern: /by (\d+) seconds?/ },
    ],
    template: 'Fire Walls deal +{N}% damage per hit. Fire Wall reuse time is {N} seconds.',
  },
  // Fire Walls' attacks deal +5 direct damage and they gain Burst Evasion +5%. Fire Wall reuse time is -3 seconds.
  {
    powerId: 'power_2305',
    name: 'FireWallBoostDamageAndEvasion',
    target: { abilities: ['Fire Walls\' attacks'] },
    effects: [
      { type: 'cooldownDelta', valuePattern: /by (\d+) seconds?/ },
    ],
    template: 'Fire Walls\' attacks deal +{N} direct damage and they gain Burst Evasion +{N}%. Fire Wall reuse time is {N} seconds.',
  },
  // Fire Walls have +11 Max Health. Fire Wall reuse time is -3 seconds.
  {
    powerId: 'power_2302',
    name: 'FireWallBoostHealth',
    target: { abilities: ['Fire Walls have +11 Max Health. Fire Wall'] },
    effects: [
      { type: 'cooldownDelta', valuePattern: /by (\d+) seconds?/ },
    ],
    template: 'Fire Walls have +{N} Max Health. Fire Wall reuse time is {N} seconds.',
  },
  // Fire Walls' attacks taunt +25%. They gain Melee Evasion +1% and heal +5 Health every 5 seconds. Fire Wall reuse time is -3 seconds.
  {
    powerId: 'power_2303',
    name: 'FireWallBoostTaunt',
    target: { abilities: ['Fire Walls\' attacks taunt +25%. They gain Melee Evasion +1% and'] },
    effects: [
      { type: 'cooldownDelta', valuePattern: /by (\d+) seconds?/ },
      { type: 'tauntDelta', valuePattern: /[Tt]aunt \+(\d+)/ },
    ],
    template: 'Fire Walls\' attacks taunt +{N}%. They gain Melee Evasion +{N}% and heal +{N} Health every {N} seconds. Fire Wall reuse time is {N} seconds.',
  },
  // When you are near your Fire Wall, you heal 6 Health per second. Fire Wall reuse time is -3 seconds.
  {
    powerId: 'power_2205',
    name: 'FireWallHeal',
    target: 'self',
    effects: [
      { type: 'cooldownDelta', valuePattern: /by (\d+) seconds?/ },
    ],
    template: 'When you are near your Fire Wall, you heal {N} Health per second. Fire Wall reuse time is {N} seconds.',
  },
  // Flesh to Fuel restores +15 Armor
  {
    powerId: 'power_2020',
    name: 'FleshToFuelArmor',
    target: { abilities: ['Flesh to Fuel'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Flesh to Fuel restores +{N} Armor',
  },
  // Flesh to Fuel restores +8 Power but has a 5% chance to stun you
  {
    powerId: 'power_2021',
    name: 'FleshToFuelBoost2',
    target: { abilities: ['Flesh to Fuel'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Flesh to Fuel restores +{N} Power but has a {N}% chance to stun you',
  },
  // Flesh to Fuel boosts your Core Attack Damage +13 for 7 seconds
  {
    powerId: 'power_2019',
    name: 'FleshToFuelCoreAttackBoost',
    target: { abilities: ['Flesh to Fuel'] },
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
    ],
    template: 'Flesh to Fuel boosts your Core Attack Damage +{N} for {N} seconds',
  },
  // Flesh to Fuel increases your Out of Combat Sprint speed +1 for 15 seconds
  {
    powerId: 'power_2022',
    name: 'FleshToFuelSprint',
    target: 'self',
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Flesh to Fuel increases your Out of Combat Sprint speed +{N} for {N} seconds',
  },
  // Frostball targets all enemies within 10 meters and deals +1 damage, but reuse timer is +3 seconds
  {
    powerId: 'power_2202',
    name: 'FrostballAoE',
    target: { abilities: ['Frostball targets all enemies within 10 meters and'] },
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
      { type: 'aoeDelta', valuePattern: /(?:within|targets within) (\d+) meters/ },
    ],
    template: 'Frostball targets all enemies within {N} meters and deals +{N} damage, but reuse timer is +{N} seconds',
  },
  // Fireball and Frostball Damage +6%
  {
    powerId: 'power_2201',
    name: 'FrostballBoost',
    target: { abilities: ['Fireball', 'Frostball'] },
    effects: [
      { type: 'percentDamage', valuePattern: /damage[^]*?\+(\d+)%/ },
    ],
    template: 'Fireball and Frostball Damage +{N}%',
  },
  // Frostball slows target's movement by 25% and deals +2 damage
  {
    powerId: 'power_2203',
    name: 'FrostballSlow25',
    target: { abilities: ['Frostball slows target\'s movement by 25% and'] },
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
    ],
    template: 'Frostball slows target\'s movement by {N}% and deals +{N} damage',
  },
  // Defensive Burst and Defensive Chill restore 10 Armor to you
  {
    powerId: 'power_2208',
    name: 'FrostBurstHealArmor',
    target: { abilities: ['Defensive Burst', 'Defensive Chill'] },
    effects: [
      { type: 'restore', valuePattern: /(?:restores?|heals? you for) (\d+) Armor/, resourceType: 'Armor' },
    ],
    template: 'Defensive Burst and Defensive Chill restore {N} Armor to you',
  },
  // Defensive Chill deals +3 damage and grants you 10% chance to ignore Knockback effects for 7 seconds
  {
    powerId: 'power_2209',
    name: 'FrostBurstKnockbackProtection',
    target: { abilities: ['Defensive Chill'] },
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
    ],
    template: 'Defensive Chill deals +{N} damage and grants you {N}% chance to ignore Knockback effects for {N} seconds',
  },
  // Molten Veins restores 10 Armor
  {
    powerId: 'power_2103',
    name: 'MoltenVeinsArmor',
    target: { abilities: ['Molten Veins'] },
    effects: [
      { type: 'restore', valuePattern: /(?:restores?|heals? you for) (\d+) Armor/, resourceType: 'Armor' },
    ],
    template: 'Molten Veins restores {N} Armor',
  },
  // Molten Veins deals 10 Fire damage over 10 seconds in response to melee damage
  {
    powerId: 'power_2104',
    name: 'MoltenVeinsDoT',
    target: { abilities: ['Molten Veins'] },
    effects: [
      { type: 'dot', valuePattern: /deals? \+?(\d+) Fire damage/, damageType: 'Fire', duration: 10 },
    ],
    template: 'Molten Veins deals {N} Fire damage over {N} seconds in response to melee damage',
  },
  // Ring of Fire deals +8% damage but has a 5% chance to deal 50 fire damage to YOU
  {
    powerId: 'power_2058',
    name: 'RingOfFireCrit',
    target: { abilities: ['Ring of Fire'] },
    effects: [
      { type: 'percentDamage', valuePattern: /damage[^]*?\+(\d+)%/ },
    ],
    template: 'Ring of Fire deals +{N}% damage but has a {N}% chance to deal {N} fire damage to YOU',
  },
  // Scintillating Flame and Scintillating Frost Damage +1 and Power Cost -2
  {
    powerId: 'power_2053',
    name: 'ScintillatingCheaper',
    target: { abilities: ['Scintillating Flame', 'Scintillating Frost'] },
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
      { type: 'costDelta', valuePattern: /[Cc]ost -(\d+)/ },
    ],
    template: 'Scintillating Flame and Scintillating Frost Damage +{N} and Power Cost {N}',
  },
  // Scintilatting Doom deals +7% damage and resets the current reuse timers on Scintillating Flame and Scintillating Frost
  {
    powerId: 'power_2062',
    name: 'ScintillatingDoomReset',
    target: { abilities: ['Scintilatting Doom'] },
    effects: [
      { type: 'percentDamage', valuePattern: /damage[^]*?\+(\d+)%/ },
    ],
    template: 'Scintilatting Doom deals +{N}% damage and resets the current reuse timers on Scintillating Flame and Scintillating Frost',
  },
  // Scintillating Flame restores 2 Health
  {
    powerId: 'power_2054',
    name: 'ScintillatingFlameHealHealth',
    target: { abilities: ['Scintillating Flame'] },
    effects: [
      { type: 'restore', valuePattern: /(?:restores?|heals? you for) (\d+) Health/, resourceType: 'Health' },
    ],
    template: 'Scintillating Flame restores {N} Health',
  },
  // Scintillating Frost and Defensive Chill restore 5 Armor
  {
    powerId: 'power_2059',
    name: 'ScintillatingFrostDefensiveChillArmor',
    target: { abilities: ['Scintillating Frost', 'Defensive Chill'] },
    effects: [
      { type: 'restore', valuePattern: /(?:restores?|heals? you for) (\d+) Armor/, resourceType: 'Armor' },
    ],
    template: 'Scintillating Frost and Defensive Chill restore {N} Armor',
  },
  // Scintillating Flame and Molten Veins boost your Core Attack Damage and Epic Attack Damage +6 for 15 seconds
  {
    powerId: 'power_2055',
    name: 'ScintillatingMoltenVeinsBoostCoreEpic',
    target: { abilities: ['Scintillating Flame', 'Molten Veins'] },
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
    ],
    template: 'Scintillating Flame and Molten Veins boost your Core Attack Damage and Epic Attack Damage +{N} for {N} seconds',
  },
  // Scintillating Flame and Scintillating Frost stun and deal +25% damage to Vulnerable targets
  {
    powerId: 'power_2057',
    name: 'ScintillatingVuln',
    target: { abilities: ['Scintillating Flame', 'Scintillating Frost stun and'] },
    effects: [
      { type: 'percentDamage', valuePattern: /damage[^]*?\+(\d+)%/ },
    ],
    template: 'Scintillating Flame and Scintillating Frost stun and deal +{N}% damage to Vulnerable targets',
  },
  // Scintillating Flame and Scintillating Frost can be used while stunned. When used while stunned, they deal +50% damage and knock the target back.
  {
    powerId: 'power_2060',
    name: 'ScintillatingWhileStunned',
    target: 'self',
    effects: [
      { type: 'percentDamage', valuePattern: /damage[^]*?\+(\d+)%/ },
    ],
    template: 'Scintillating Flame and Scintillating Frost can be used while stunned. When used while stunned, they deal +{N}% damage and knock the target back.',
  },
  // Scintillating Flame and Scintillating Frost Damage +14%
  {
    powerId: 'power_2004',
    name: 'SparklyFireballBoost',
    target: { abilities: ['Scintillating Flame', 'Scintillating Frost'] },
    effects: [
      { type: 'percentDamage', valuePattern: /damage[^]*?\+(\d+)%/ },
    ],
    template: 'Scintillating Flame and Scintillating Frost Damage +{N}%',
  },
  // Super Fireball causes the target to take +11% damage from indirect Fire (this effect does not stack with itself)
  {
    powerId: 'power_2018',
    name: 'SuperFireballDoTDebuff',
    target: { abilities: ['Super Fireball causes the target to take +11%'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Super Fireball causes the target to take +{N}% damage from indirect Fire (this effect does not stack with itself)',
  },
  // Super Fireball deals +15 damage and reuse timer is -1 second
  {
    powerId: 'power_2012',
    name: 'SuperFireballFaster',
    target: { abilities: ['Super Fireball'] },
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
    ],
    template: 'Super Fireball deals +{N} damage and reuse timer is {N} second',
  },
];
