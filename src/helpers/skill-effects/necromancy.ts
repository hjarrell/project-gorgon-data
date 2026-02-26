import type { PowerEffectConfig } from './types';

export const NECROMANCY_EFFECTS: PowerEffectConfig[] = [
  // Deathgaze deals +5 damage and restores 8 armor to you
  {
    powerId: 'power_8022',
    name: 'DeathGazeArmorHeal',
    target: { abilities: ['Deathgaze'] },
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
      { type: 'restore', valuePattern: /(?:restores?|heals? you for) (\d+) armor/, resourceType: 'armor' },
    ],
    template: 'Deathgaze deals +{N} damage and restores {N} armor to you',
  },
  // Deathgaze deals +10% damage and has +1 Accuracy (which cancels out the Evasion that certain monsters have)
  {
    powerId: 'power_8021',
    name: 'DeathGazeBoost',
    target: { abilities: ['Deathgaze'] },
    effects: [
      { type: 'percentDamage', valuePattern: /damage[^]*?\+(\d+)%/ },
    ],
    template: 'Deathgaze deals +{N}% damage and has +{N} Accuracy (which cancels out the Evasion that certain monsters have)',
  },
  // Deathgaze deals +10 damage and reuse timer is -1 second
  {
    powerId: 'power_8309',
    name: 'DeathgazeFaster',
    target: { abilities: ['Deathgaze'] },
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
    ],
    template: 'Deathgaze deals +{N} damage and reuse timer is {N} second',
  },
  // Deathgaze deals +13 damage and increases your sprint speed +1 for 15 seconds
  {
    powerId: 'power_8023',
    name: 'DeathGazeSpeed',
    target: { abilities: ['Deathgaze'] },
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
    ],
    template: 'Deathgaze deals +{N} damage and increases your sprint speed +{N} for {N} seconds',
  },
  // Death's Hold causes target to take +5.3% damage from Darkness for 15 seconds
  {
    powerId: 'power_8044',
    name: 'DeathsHoldDarknessVuln',
    target: { abilities: ['Death\'s Hold causes target to take +5.3%'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Death\'s Hold causes target to take +{N}% damage from Darkness for {N} seconds',
  },
  // Death's Hold ignites the target, dealing 48 Fire damage over 12 seconds
  {
    powerId: 'power_8002',
    name: 'DeathsHoldDoT',
    target: { abilities: ['Death\'s Hold'] },
    effects: [
      { type: 'dot', valuePattern: /dealing (\d+) Fire damage/, damageType: 'Fire', duration: 12 },
    ],
    template: 'Death\'s Hold ignites the target, dealing {N} Fire damage over {N} seconds',
  },
  // Death's Hold causes target to take +5% damage from Electricity for 15 seconds
  {
    powerId: 'power_8043',
    name: 'DeathsHoldElectricityVuln',
    target: { abilities: ['Death\'s Hold causes target to take +5%'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Death\'s Hold causes target to take +{N}% damage from Electricity for {N} seconds',
  },
  // Death's Hold causes target to take +5% damage from Slashing for 15 seconds
  {
    powerId: 'power_8042',
    name: 'DeathsHoldSlashingVuln',
    target: { abilities: ['Death\'s Hold causes target to take +5%'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Death\'s Hold causes target to take +{N}% damage from Slashing for {N} seconds',
  },
  // Heal Undead and Rebuild Undead restore +10 Health/Armor
  {
    powerId: 'power_8315',
    name: 'HealAndRebuildUndeadBoost',
    target: { abilities: ['Heal Undead', 'Rebuild Undead'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Heal Undead and Rebuild Undead restore +{N} Health/Armor',
  },
  // Heal Undead boosts your next attack +5 if it is a Darkness attack
  {
    powerId: 'power_8317',
    name: 'HealUndeadBoostNextAttack',
    target: { abilities: ['Heal Undead'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Heal Undead boosts your next attack +{N} if it is a Darkness attack',
  },
  // Heal Undead causes target undead to take -9% damage from Elite attacks for 8 seconds
  {
    powerId: 'power_8316',
    name: 'HealUndeadEliteResist',
    target: { abilities: ['Heal Undead causes target undead to take -9%'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Heal Undead causes target undead to take {N}% damage from Elite attacks for {N} seconds',
  },
  // Heal Undead restores an additional 4 Health/Armor over 12 seconds and also hastens the current reuse timer of Rebuild Undead -0.5 seconds
  {
    powerId: 'power_8318',
    name: 'HealUndeadHoT',
    target: { abilities: ['Heal Undead'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Heal Undead restores an additional {N} Health/Armor over {N} seconds and also hastens the current reuse timer of Rebuild Undead {N} seconds',
  },
  // Life Steal targets all enemies within 10 meters and steals +2 health, but reuse timer is +3 seconds and Power cost is +8
  {
    powerId: 'power_8006',
    name: 'LifeStealAoE',
    target: 'self',
    effects: [
      { type: 'aoeDelta', valuePattern: /(?:within|targets within) (\d+) meters/ },
    ],
    template: 'Life Steal targets all enemies within {N} meters and steals +{N} health, but reuse timer is +{N} seconds and Power cost is +{N}',
  },
  // Life Steal deals 50 Psychic damage over 10 seconds
  {
    powerId: 'power_8008',
    name: 'LifeStealDoT',
    target: { abilities: ['Life Steal'] },
    effects: [
      { type: 'dot', valuePattern: /deals? \+?(\d+) Psychic damage/, damageType: 'Psychic', duration: 10 },
    ],
    template: 'Life Steal deals {N} Psychic damage over {N} seconds',
  },
  // Life Steal restores 4 Health
  {
    powerId: 'power_8005',
    name: 'LifeStealHeal',
    target: { abilities: ['Life Steal'] },
    effects: [
      { type: 'restore', valuePattern: /(?:restores?|heals? you for) (\d+) Health/, resourceType: 'Health' },
    ],
    template: 'Life Steal restores {N} Health',
  },
  // Life Steal reaps 5 additional health
  {
    powerId: 'power_8007',
    name: 'LifeStealReapBoost',
    target: 'self',
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Life Steal reaps {N} additional health',
  },
  // Necromancy Base Damage +5; Summoned Skeletons deal +1% direct damage
  {
    powerId: 'power_8001',
    name: 'NecromancyBoost',
    target: { abilities: ['Necromancy Base'] },
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
    ],
    template: 'Necromancy Base Damage +{N}; Summoned Skeletons deal +{N}% direct damage',
  },
  // Summoned Skeletons deal +3% direct damage
  {
    powerId: 'power_8004',
    name: 'NecromancyPetDamageBoost',
    target: { abilities: ['Summoned Skeletons'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Summoned Skeletons deal +{N}% direct damage',
  },
  // Provoke Undead causes your minions to deal +8% damage for 10 seconds, but also take 35 damage over 10 seconds
  {
    powerId: 'power_8306',
    name: 'ProvokeUndeadBoost',
    target: { abilities: ['Provoke Undead causes your minions to'] },
    effects: [
      { type: 'percentDamage', valuePattern: /damage[^]*?\+(\d+)%/ },
    ],
    template: 'Provoke Undead causes your minions to deal +{N}% damage for {N} seconds, but also take {N} damage over {N} seconds',
  },
  // Provoke Undead deals 15 damage to your minions, who then deal +15 damage for 10 seconds
  {
    powerId: 'power_8314',
    name: 'ProvokeUndeadDamagingBoost',
    target: { abilities: ['Provoke Undead'] },
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
    ],
    template: 'Provoke Undead deals {N} damage to your minions, who then deal +{N} damage for {N} seconds',
  },
  // Provoke Undead's Reuse Time is -0.5 seconds and it boosts your minions' damage +10 for 10 seconds
  {
    powerId: 'power_8307',
    name: 'ProvokeUndeadFast',
    target: { abilities: ['Provoke Undead\'s'] },
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
    ],
    template: 'Provoke Undead\'s Reuse Time is {N} seconds and it boosts your minions\' damage +{N} for {N} seconds',
  },
  // Provoke Undead restores 7 Health to you (or Armor if Health is full) and causes your attacks to taunt +20% for 20 seconds
  {
    powerId: 'power_8313',
    name: 'ProvokeUndeadSelfTank',
    target: { abilities: ['Provoke Undead'] },
    effects: [
      { type: 'restore', valuePattern: /(?:restores?|heals? you for) (\d+) Health/, resourceType: 'Health' },
      { type: 'tauntDelta', valuePattern: /[Tt]aunt \+(\d+)/ },
    ],
    template: 'Provoke Undead restores {N} Health to you (or Armor if Health is full) and causes your attacks to taunt +{N}% for {N} seconds',
  },
  // Raised Zombies deal +6% damage
  {
    powerId: 'power_8351',
    name: 'RaiseZombieDamageBoost',
    target: { abilities: ['Raised Zombies'] },
    effects: [
      { type: 'percentDamage', valuePattern: /damage[^]*?\+(\d+)%/ },
    ],
    template: 'Raised Zombies deal +{N}% damage',
  },
  // Raised Zombies deal +6 damage and speed is +2
  {
    powerId: 'power_8353',
    name: 'RaiseZombieSpeedBoost',
    target: { abilities: ['Raised Zombies'] },
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
    ],
    template: 'Raised Zombies deal +{N} damage and speed is +{N}',
  },
  // Raised Zombies deal +8 damage and taunt as if they did +200% more damage
  {
    powerId: 'power_8352',
    name: 'RaiseZombieTauntBoost',
    target: { abilities: ['Raised Zombies'] },
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
    ],
    template: 'Raised Zombies deal +{N} damage and taunt as if they did +{N}% more damage',
  },
  // Rebuild Undead restores 20 health/armor to your undead after a 10 second delay
  {
    powerId: 'power_8103',
    name: 'RebuildUndeadDelayedHeal',
    target: { abilities: ['Rebuild Undead'] },
    effects: [
      { type: 'restore', valuePattern: /(?:restores?|heals? you for) (\d+) health/, resourceType: 'health' },
    ],
    template: 'Rebuild Undead restores {N} health/armor to your undead after a {N} second delay',
  },
  // Rebuild Undead grants targets +10.5% Universal Damage Resistance for 6 seconds
  {
    powerId: 'power_8102',
    name: 'RebuildUndeadMitigation',
    target: { abilities: ['Rebuild Undead grants targets +10.5% Universal'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Rebuild Undead grants targets +{N}% Universal Damage Resistance for {N} seconds',
  },
  // Summoned Skeletal Archers and Mages deal +5% direct damage, but take +5% damage from nature attacks
  {
    powerId: 'power_8322',
    name: 'SkeletonAntiNatureBoost',
    target: { abilities: ['Summoned Skeletal Archers', 'Mages'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Summoned Skeletal Archers and Mages deal +{N}% direct damage, but take +{N}% damage from nature attacks',
  },
  // Summoned Skeletal Archers and Mages deal +6% direct damage, but take +7% damage from crushing attacks
  {
    powerId: 'power_8321',
    name: 'SkeletonArcherMageFragilityBoost',
    target: { abilities: ['Summoned Skeletal Archers', 'Mages'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Summoned Skeletal Archers and Mages deal +{N}% direct damage, but take +{N}% damage from crushing attacks',
  },
  // Summoned Skeletons have +10 armor and -10.5% Crushing/Slashing/Piercing Vulnerability
  {
    powerId: 'power_8304',
    name: 'SkeletonArmorBoost',
    target: 'self',
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Summoned Skeletons have +{N} armor and {N}% Crushing/Slashing/Piercing Vulnerability',
  },
  // Summoned Skeletons deal +6% direct damage, but take +5% more damage from cold attacks
  {
    powerId: 'power_8319',
    name: 'SkeletonColdVuln',
    target: { abilities: ['Summoned Skeletons'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Summoned Skeletons deal +{N}% direct damage, but take +{N}% more damage from cold attacks',
  },
  // Summoned Skeletons deal +6 direct damage
  {
    powerId: 'power_8303',
    name: 'SkeletonFlatDamageBoost',
    target: { abilities: ['Summoned Skeletons'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Summoned Skeletons deal +{N} direct damage',
  },
  // Summoned Skeletons have +16 armor and suffer -5% damage from Burst attacks
  {
    powerId: 'power_8302',
    name: 'SkeletonPetArmorBoost',
    target: 'self',
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Summoned Skeletons have +{N} armor and suffer {N}% damage from Burst attacks',
  },
  // Summoned Skeletons have +8 health and suffer -5% damage from Burst attacks
  {
    powerId: 'power_8301',
    name: 'SkeletonPetHealthBoost',
    target: 'self',
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Summoned Skeletons have +{N} health and suffer {N}% damage from Burst attacks',
  },
  // Summoned Skeletal Swordsmen taunt as if they did 100% more damage
  {
    powerId: 'power_8308',
    name: 'SkeletonSwordsmanTauntBoost',
    target: { abilities: ['Summoned Skeletal Swordsmen taunt as if they did 100% more'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Summoned Skeletal Swordsmen taunt as if they did {N}% more damage',
  },
  // Spark of Death deals +1 damage and renders target 10% more vulnerable to Electricity damage for 30 seconds
  {
    powerId: 'power_8003',
    name: 'SparkOfDeathBoostElectricity',
    target: { abilities: ['Spark of Death'] },
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
    ],
    template: 'Spark of Death deals +{N} damage and renders target {N}% more vulnerable to Electricity damage for {N} seconds',
  },
  // Spark of Death deals 30 Psychic damage over 12 seconds
  {
    powerId: 'power_8062',
    name: 'SparkOfDeathPsychicDoT',
    target: { abilities: ['Spark of Death'] },
    effects: [
      { type: 'dot', valuePattern: /deals? \+?(\d+) Psychic damage/, damageType: 'Psychic', duration: 12 },
    ],
    template: 'Spark of Death deals {N} Psychic damage over {N} seconds',
  },
  // Spark of Death deals +7% damage and taunts +50
  {
    powerId: 'power_8063',
    name: 'SparkOfDeathTaunt',
    target: { abilities: ['Spark of Death'] },
    effects: [
      { type: 'percentDamage', valuePattern: /damage[^]*?\+(\d+)%/ },
    ],
    template: 'Spark of Death deals +{N}% damage and taunts +{N}',
  },
  // Using Raise Zombie on an existing zombie increases its damage +5% for 60 seconds
  {
    powerId: 'power_8201',
    name: 'SuperZombieBuffDamage',
    target: { abilities: ['Using Raise Zombie on an existing zombie increases its'] },
    effects: [
      { type: 'percentDamage', valuePattern: /damage[^]*?\+(\d+)%/ },
    ],
    template: 'Using Raise Zombie on an existing zombie increases its damage +{N}% for {N} seconds',
  },
  // Using Raise Zombie on an existing zombie increases its damage +5 for 5 minutes
  {
    powerId: 'power_8305',
    name: 'SuperZombieBuffDamageLong',
    target: { abilities: ['Using Raise Zombie on an existing zombie increases its'] },
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
    ],
    template: 'Using Raise Zombie on an existing zombie increases its damage +{N} for {N} minutes',
  },
  // Using Raise Zombie on an existing zombie raises its Max Health +6 for 5 minutes (and heals +6)
  {
    powerId: 'power_8311',
    name: 'SuperZombieMaxHealth',
    target: { abilities: ['Using Raise Zombie on an existing zombie raises its Max Health +6 for 5 minutes (and'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Using Raise Zombie on an existing zombie raises its Max Health +{N} for {N} minutes (and heals +{N})',
  },
  // Wave of Darkness deals 24 Psychic damage over 12 seconds
  {
    powerId: 'power_8252',
    name: 'WaveOfDarknessDoT',
    target: { abilities: ['Wave of Darkness'] },
    effects: [
      { type: 'dot', valuePattern: /deals? \+?(\d+) Psychic damage/, damageType: 'Psychic', duration: 12 },
    ],
    template: 'Wave of Darkness deals {N} Psychic damage over {N} seconds',
  },
  // Wave of Darkness deals +8 damage and reuse timer is -1 second
  {
    powerId: 'power_8253',
    name: 'WaveOfDarknessFaster',
    target: { abilities: ['Wave of Darkness'] },
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
    ],
    template: 'Wave of Darkness deals +{N} damage and reuse timer is {N} second',
  },
  // Wave of Darkness deals +10 damage to sentient creatures
  {
    powerId: 'power_8254',
    name: 'WaveOfDarknessVsSentient',
    target: { abilities: ['Wave of Darkness'] },
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
    ],
    template: 'Wave of Darkness deals +{N} damage to sentient creatures',
  },
];
