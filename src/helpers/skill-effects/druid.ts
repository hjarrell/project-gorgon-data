import type { PowerEffectConfig } from './types';

export const DRUID_EFFECTS: PowerEffectConfig[] = [
  // Brambleskin deals +6 Nature damage to melee attackers
  {
    powerId: 'power_14157',
    name: 'BrambleSkinBoost',
    target: { abilities: ['Brambleskin'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Brambleskin deals +{N} Nature damage to melee attackers',
  },
  // Brambleskin increases your Max Armor by +20 for 30 seconds and restores 20 Armor
  {
    powerId: 'power_14153',
    name: 'BrambleSkinMaxArmorBoost',
    target: { abilities: ['Brambleskin increases your Max Armor by +20 for 30 seconds and'] },
    effects: [
      { type: 'restore', valuePattern: /(?:restores?|heals? you for) (\d+) Armor/, resourceType: 'Armor' },
    ],
    template: 'Brambleskin increases your Max Armor by +{N} for {N} seconds and restores {N} Armor',
  },
  // Brambleskin increases your Max Armor by +20 for 30 seconds and restores 20 Armor
  {
    powerId: 'power_14154',
    name: 'BrambleSkinMaxArmorBoostB',
    target: { abilities: ['Brambleskin increases your Max Armor by +20 for 30 seconds and'] },
    effects: [
      { type: 'restore', valuePattern: /(?:restores?|heals? you for) (\d+) Armor/, resourceType: 'Armor' },
    ],
    template: 'Brambleskin increases your Max Armor by +{N} for {N} seconds and restores {N} Armor',
  },
  // Brambleskin increases your Max Health by +9 for 30 seconds and heals 9 Health
  {
    powerId: 'power_14151',
    name: 'BrambleSkinMaxHealthBoost',
    target: { abilities: ['Brambleskin increases your Max Health by +9 for 30 seconds and'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Brambleskin increases your Max Health by +{N} for {N} seconds and heals {N} Health',
  },
  // Brambleskin increases your Max Health by +9 for 30 seconds and heals 9 Health
  {
    powerId: 'power_14152',
    name: 'BrambleSkinMaxHealthBoostB',
    target: { abilities: ['Brambleskin increases your Max Health by +9 for 30 seconds and'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Brambleskin increases your Max Health by +{N} for {N} seconds and heals {N} Health',
  },
  // Brambleskin increases your Max Power by +15 for 30 seconds and restores 15 Power
  {
    powerId: 'power_14155',
    name: 'BrambleSkinMaxPowerBoost',
    target: { abilities: ['Brambleskin increases your Max Power by +15 for 30 seconds and'] },
    effects: [
      { type: 'restore', valuePattern: /(?:restores?|heals? you for) (\d+) Power/, resourceType: 'Power' },
    ],
    template: 'Brambleskin increases your Max Power by +{N} for {N} seconds and restores {N} Power',
  },
  // Brambleskin increases your Max Power by +15 for 30 seconds and restores 15 Power
  {
    powerId: 'power_14156',
    name: 'BrambleSkinMaxPowerBoostB',
    target: { abilities: ['Brambleskin increases your Max Power by +15 for 30 seconds and'] },
    effects: [
      { type: 'restore', valuePattern: /(?:restores?|heals? you for) (\d+) Power/, resourceType: 'Power' },
    ],
    template: 'Brambleskin increases your Max Power by +{N} for {N} seconds and restores {N} Power',
  },
  // Brambleskin deals +9% damage to melee attackers
  {
    powerId: 'power_14159',
    name: 'BrambleSkinMod',
    target: { abilities: ['Brambleskin'] },
    effects: [
      { type: 'percentDamage', valuePattern: /damage[^]*?\+(\d+)%/ },
    ],
    template: 'Brambleskin deals +{N}% damage to melee attackers',
  },
  // Cloud Sight causes target's attacks to have +5% more chance of missing.
  {
    powerId: 'power_14158',
    name: 'CloudSightBetterDebuff',
    target: 'self',
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Cloud Sight causes target\'s attacks to have +{N}% more chance of missing.',
  },
  // Cloud Sight and Delerium Damage +5%
  {
    powerId: 'power_14502',
    name: 'CloudSightDeleriumBoost',
    target: { abilities: ['Cloud Sight', 'Delerium'] },
    effects: [
      { type: 'percentDamage', valuePattern: /damage[^]*?\+(\d+)%/ },
    ],
    template: 'Cloud Sight and Delerium Damage +{N}%',
  },
  // Cloud Sight Damage +6 and Reuse Time -1 seconds
  {
    powerId: 'power_14504',
    name: 'CloudSightFaster',
    target: { abilities: ['Cloud Sight'] },
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
      { type: 'cooldownDelta', valuePattern: /[Rr]euse [Tt]ime (?:is )?-(\d+)/ },
    ],
    template: 'Cloud Sight Damage +{N} and Reuse Time {N} seconds',
  },
  // Cloud Sight covers the target in insects that deal 12 Nature damage over 8 seconds
  {
    powerId: 'power_14501',
    name: 'CloudSightInsects',
    target: { abilities: ['Cloud Sight covers the target in insects that'] },
    effects: [
      { type: 'dot', valuePattern: /deals? \+?(\d+) Nature damage/, damageType: 'Nature', duration: 8 },
    ],
    template: 'Cloud Sight covers the target in insects that deal {N} Nature damage over {N} seconds',
  },
  // Cosmic Strike deals +8% damage and boosts your Major Healing +5 for 20 seconds
  {
    powerId: 'power_14202',
    name: 'CosmicStrikeBoostHealing',
    target: { abilities: ['Cosmic Strike'] },
    effects: [
      { type: 'percentDamage', valuePattern: /damage[^]*?\+(\d+)%/ },
    ],
    template: 'Cosmic Strike deals +{N}% damage and boosts your Major Healing +{N} for {N} seconds',
  },
  // Cosmic Strike deals +14 damage and reuse timer is -1 second
  {
    powerId: 'power_14204',
    name: 'CosmicStrikeFaster',
    target: { abilities: ['Cosmic Strike'] },
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
    ],
    template: 'Cosmic Strike deals +{N} damage and reuse timer is {N} second',
  },
  // Cosmic Strike deals +14 damage, generates no Rage, and removes 40 Rage
  {
    powerId: 'power_14203',
    name: 'CosmicStrikeRage',
    target: { abilities: ['Cosmic Strike'] },
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
      { type: 'rageDelta', valuePattern: /(\d+) Rage/ },
    ],
    template: 'Cosmic Strike deals +{N} damage, generates no Rage, and removes {N} Rage',
  },
  // Cosmic Strike deals +16 damage and if it kills your target, you recover 9999 Health and 9999 Armor
  {
    powerId: 'power_14205',
    name: 'CosmicStrikeReap',
    target: { abilities: ['Cosmic Strike'] },
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
    ],
    template: 'Cosmic Strike deals +{N} damage and if it kills your target, you recover {N} Health and {N} Armor',
  },
  // Delerium becomes a 10m Burst attack that deals +33% damage to targets that are not focused on you
  {
    powerId: 'power_14104',
    name: 'DeleriumBurst',
    target: { abilities: ['Delerium becomes a 10m Burst attack that'] },
    effects: [
      { type: 'percentDamage', valuePattern: /damage[^]*?\+(\d+)%/ },
    ],
    template: 'Delerium becomes a {N}m Burst attack that deals +{N}% damage to targets that are not focused on you',
  },
  // Delerium deals +5 damage, depletes +50 rage and taunts -30
  {
    powerId: 'power_14102',
    name: 'DeleriumDetaunt',
    target: { abilities: ['Delerium'] },
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
      { type: 'rageDelta', valuePattern: /(\d+) Rage/ },
    ],
    template: 'Delerium deals +{N} damage, depletes +{N} rage and taunts {N}',
  },
  // Delerium depletes +60 rage and deals +18 Poison damage over 6 seconds
  {
    powerId: 'power_14103',
    name: 'DeleriumPoison',
    target: { abilities: ['Delerium depletes +60 rage and'] },
    effects: [
      { type: 'dot', valuePattern: /deals? \+?(\d+) Poison damage/, damageType: 'Poison', duration: 6 },
      { type: 'rageDelta', valuePattern: /(\d+) Rage/ },
    ],
    template: 'Delerium depletes +{N} rage and deals +{N} Poison damage over {N} seconds',
  },
  // All Druid abilities except Shillelagh have a 10% chance to restore 50 Power to you
  {
    powerId: 'power_14004',
    name: 'DruidAbilitiesRandomPower',
    target: { skill: 'Druid', except: ['Shillelagh'] },
    effects: [
      { type: 'restore', valuePattern: /(?:restores?|heals? you for) (\d+) Power/, resourceType: 'Power' },
    ],
    template: 'All Druid abilities except Shillelagh have a {N}% chance to restore {N} Power to you',
  },
  // While Druid skill is active: abilities that have Burst targeting deal +24 Nature damage over 8 seconds
  {
    powerId: 'power_14007',
    name: 'DruidBurstDoT',
    target: { abilities: ['While Druid skill is active: abilities that have Burst targeting'] },
    effects: [
      { type: 'dot', valuePattern: /deals? \+?(\d+) Nature damage/, damageType: 'Nature', duration: 8 },
    ],
    template: 'While Druid skill is active: abilities that have Burst targeting deal +{N} Nature damage over {N} seconds',
  },
  // While Druid skill is active: abilities that fire a projectile, such as Toxinball, Fireball, or most Archery abilities, deal +20 Poison damage over 8 seconds
  {
    powerId: 'power_14006',
    name: 'DruidProjectileDoT',
    target: 'self',
    effects: [
      { type: 'dot', valuePattern: /deals? \+?(\d+) Poison damage/, damageType: 'Poison', duration: 8 },
    ],
    template: 'While Druid skill is active: abilities that fire a projectile, such as Toxinball, Fireball, or most Archery abilities, deal +{N} Poison damage over {N} seconds',
  },
  // Energize restores 9 armor to each target
  {
    powerId: 'power_14401',
    name: 'EnergizeArmor',
    target: { abilities: ['Energize'] },
    effects: [
      { type: 'restore', valuePattern: /(?:restores?|heals? you for) (\d+) armor/, resourceType: 'armor' },
    ],
    template: 'Energize restores {N} armor to each target',
  },
  // Energize conjures a magical field around each target that mitigates 20% of all physical damage they take for 1 minute (or until 200 damage is mitigated).
  {
    powerId: 'power_14402',
    name: 'EnergizeDefensiveBubble',
    target: { abilities: ['Energize conjures a magical field around each target that mitigates 20% of all physical'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Energize conjures a magical field around each target that mitigates {N}% of all physical damage they take for {N} minute (or until {N} damage is mitigated).',
  },
  // Fill With Bile causes any Core attacks that deal direct Poison damage to deal +11 damage for 3 minutes. (This effect does not stack with itself.)
  {
    powerId: 'power_14251',
    name: 'FillWithBileCorePoison',
    target: { abilities: ['Fill With Bile causes any Core attacks that'] },
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
    ],
    template: 'Fill With Bile causes any Core attacks that deal direct Poison damage to deal +{N} damage for {N} minutes. (This effect does not stack with itself.)',
  },
  // Fill With Bile increases target's Max Health by +5 for 3 minutes and heals 5 health. (This effect does not stack with itself.)
  {
    powerId: 'power_14252',
    name: 'FillWithBileMaxHealth',
    target: { abilities: ['Fill With Bile increases target\'s Max Health by +5 for 3 minutes and'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Fill With Bile increases target\'s Max Health by +{N} for {N} minutes and heals {N} health. (This effect does not stack with itself.)',
  },
  // Fill With Bile increases target's Max Health by +5 for 3 minutes and heals 5 health. (This effect does not stack with itself.)
  {
    powerId: 'power_14253',
    name: 'FillWithBileMaxHealthB',
    target: { abilities: ['Fill With Bile increases target\'s Max Health by +5 for 3 minutes and'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Fill With Bile increases target\'s Max Health by +{N} for {N} minutes and heals {N} health. (This effect does not stack with itself.)',
  },
  // Fill With Bile causes any Nice attacks that deal direct Poison or Acid damage to deal +10% damage for 3 minutes. (This effect does not stack with itself.)
  {
    powerId: 'power_14254',
    name: 'FillWithBileNicePoison',
    target: { abilities: ['Fill With Bile causes any Nice attacks that'] },
    effects: [
      { type: 'percentDamage', valuePattern: /damage[^]*?\+(\d+)%/ },
    ],
    template: 'Fill With Bile causes any Nice attacks that deal direct Poison or Acid damage to deal +{N}% damage for {N} minutes. (This effect does not stack with itself.)',
  },
  // Fill With Bile reduces target's Indirect Poison Vulnerability and Indirect Acid Vulnerability -2% for 3 minutes. (This effect does not stack with itself.)
  {
    powerId: 'power_14255',
    name: 'FillWithBileResistance',
    target: 'self',
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Fill With Bile reduces target\'s Indirect Poison Vulnerability and Indirect Acid Vulnerability {N}% for {N} minutes. (This effect does not stack with itself.)',
  },
  // Fill With Bile increases target's direct Poison and Acid damage +20 for 3 minutes. (This effect does not stack with itself.)
  {
    powerId: 'power_14604',
    name: 'FillWithBileStronger',
    target: { abilities: ['Fill With Bile increases target\'s direct Poison', 'Acid'] },
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
    ],
    template: 'Fill With Bile increases target\'s direct Poison and Acid damage +{N} for {N} minutes. (This effect does not stack with itself.)',
  },
  // Your Healing Sanctuary heals +7 health and buffs Melee Accuracy +5
  {
    powerId: 'power_14605',
    name: 'HealingSanctuaryAccuracy',
    target: { abilities: ['Your Healing Sanctuary'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Your Healing Sanctuary heals +{N} health and buffs Melee Accuracy +{N}',
  },
  // Your Healing Sanctuary restores +5 Armor with each heal
  {
    powerId: 'power_14602',
    name: 'HealingSanctuaryArmor',
    target: { abilities: ['Your Healing Sanctuary'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Your Healing Sanctuary restores +{N} Armor with each heal',
  },
  // Your Healing Sanctuary restores +4 health with each heal
  {
    powerId: 'power_14601',
    name: 'HealingSanctuaryBoost',
    target: { abilities: ['Your Healing Sanctuary'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Your Healing Sanctuary restores +{N} health with each heal',
  },
  // Your Healing Sanctuary restores +3 Power with each heal
  {
    powerId: 'power_14603',
    name: 'HealingSanctuaryPower',
    target: { abilities: ['Your Healing Sanctuary'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Your Healing Sanctuary restores +{N} Power with each heal',
  },
  // Heart Thorn coats the target in acid that deals 24 armor damage over 3 seconds
  {
    powerId: 'power_14016',
    name: 'HeartThornAcidDoT',
    target: { abilities: ['Heart Thorn coats the target in acid that'] },
    effects: [
      { type: 'dot', valuePattern: /deals? \+?(\d+) armor damage/, damageType: 'armor', duration: 3 },
    ],
    template: 'Heart Thorn coats the target in acid that deals {N} armor damage over {N} seconds',
  },
  // Heart Thorn causes target to suffer +5% damage from all Indirect Damage sources for 15 seconds
  {
    powerId: 'power_14018',
    name: 'HeartThornIndirectDebuff',
    target: { abilities: ['Heart Thorn causes target to suffer +5%'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Heart Thorn causes target to suffer +{N}% damage from all Indirect Damage sources for {N} seconds',
  },
  // Heart Thorn coats the target in stinging insects that deal 24 Nature damage over 8 seconds
  {
    powerId: 'power_14012',
    name: 'HeartThornNatureDoT',
    target: { abilities: ['Heart Thorn coats the target in stinging insects that'] },
    effects: [
      { type: 'dot', valuePattern: /deals? \+?(\d+) Nature damage/, damageType: 'Nature', duration: 8 },
    ],
    template: 'Heart Thorn coats the target in stinging insects that deal {N} Nature damage over {N} seconds',
  },
  // Heart Thorn deals Poison damage (instead of Nature) and also deals 36 Poison damage over 8 seconds
  {
    powerId: 'power_14013',
    name: 'HeartThornPoisonDoT',
    target: { abilities: ['Heart Thorn'] },
    effects: [
      { type: 'dot', valuePattern: /deals? \+?(\d+) Poison damage/, damageType: 'Poison', duration: 8 },
    ],
    template: 'Heart Thorn deals Poison damage (instead of Nature) and also deals {N} Poison damage over {N} seconds',
  },
  // Pulse of Life gives +2 Fire, Cold, and Electricity Mitigation (direct and indirect) for 15 seconds
  {
    powerId: 'power_14017',
    name: 'PulseOfLifeElementalMitigation',
    target: 'self',
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Pulse of Life gives +{N} Fire, Cold, and Electricity Mitigation (direct and indirect) for {N} seconds',
  },
  // Pulse of Life restores 10 Health over 15 seconds
  {
    powerId: 'power_14015',
    name: 'PulseOfLifeHoT',
    target: { abilities: ['Pulse of Life'] },
    effects: [
      { type: 'restore', valuePattern: /(?:restores?|heals? you for) (\d+) Health/, resourceType: 'Health' },
    ],
    template: 'Pulse of Life restores {N} Health over {N} seconds',
  },
  // Regrowth and Pulse of Life Healing +10%
  {
    powerId: 'power_14355',
    name: 'RegrowthAndPulseOfLifeBoost',
    target: 'self',
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Regrowth and Pulse of Life Healing +{N}%',
  },
  // Regrowth restores +5 Health and causes your Minor Heals to restore +5 Health for 10 seconds
  {
    powerId: 'power_14354',
    name: 'RegrowthBoostMinorHeal',
    target: { abilities: ['Regrowth'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Regrowth restores +{N} Health and causes your Minor Heals to restore +{N} Health for {N} seconds',
  },
  // Regrowth restores +10 Health and conjures a magical field on the target that mitigates 10% of all physical damage they take for 1 minute (or until 100 damage is mitigated)
  {
    powerId: 'power_14353',
    name: 'RegrowthDefensiveBubble',
    target: { abilities: ['Regrowth'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Regrowth restores +{N} Health and conjures a magical field on the target that mitigates {N}% of all physical damage they take for {N} minute (or until {N} damage is mitigated)',
  },
  // Regrowth restores 15 Power
  {
    powerId: 'power_14352',
    name: 'RegrowthRestoreMinorPower',
    target: { abilities: ['Regrowth'] },
    effects: [
      { type: 'restore', valuePattern: /(?:restores?|heals? you for) (\d+) Power/, resourceType: 'Power' },
    ],
    template: 'Regrowth restores {N} Power',
  },
  // Rotskin hits all targets within 10 meters and further debuffs their mitigation -3
  {
    powerId: 'power_14053',
    name: 'RotskinAoE',
    target: 'self',
    effects: [
      { type: 'aoeDelta', valuePattern: /(?:within|targets within) (\d+) meters/ },
    ],
    template: 'Rotskin hits all targets within {N} meters and further debuffs their mitigation {N}',
  },
  // Rotskin deals +5% damage and boosts your Nice Attack Damage +8 for 10 seconds
  {
    powerId: 'power_14055',
    name: 'RotskinBoostNice',
    target: { abilities: ['Rotskin'] },
    effects: [
      { type: 'percentDamage', valuePattern: /damage[^]*?\+(\d+)%/ },
    ],
    template: 'Rotskin deals +{N}% damage and boosts your Nice Attack Damage +{N} for {N} seconds',
  },
  // Rotskin deals 24 Nature damage to health over 12 seconds
  {
    powerId: 'power_14052',
    name: 'RotskinDoT',
    target: { abilities: ['Rotskin'] },
    effects: [
      { type: 'dot', valuePattern: /deals? \+?(\d+) Nature damage/, damageType: 'Nature', duration: 12 },
    ],
    template: 'Rotskin deals {N} Nature damage to health over {N} seconds',
  },
  // Rotskin hastens the current reuse timer of Regrowth by 5 seconds
  {
    powerId: 'power_14054',
    name: 'RotskinHastenRegrowth',
    target: { abilities: ['Rotskin hastens the current'] },
    effects: [
      { type: 'cooldownDelta', valuePattern: /by (\d+) seconds?/ },
    ],
    template: 'Rotskin hastens the current reuse timer of Regrowth by {N} seconds',
  },
  // Rotskin debuffs target's Indirect Nature Vulnerability -10% for 12 seconds
  {
    powerId: 'power_14056',
    name: 'RotskinNatureDebuff',
    target: 'self',
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Rotskin debuffs target\'s Indirect Nature Vulnerability {N}% for {N} seconds',
  },
  // Toxinball deals +24 Poison damage to health over 8 seconds
  {
    powerId: 'power_14552',
    name: 'ToxinballDoT',
    target: { abilities: ['Toxinball'] },
    effects: [
      { type: 'dot', valuePattern: /deals? \+?(\d+) Poison damage/, damageType: 'Poison', duration: 8 },
    ],
    template: 'Toxinball deals +{N} Poison damage to health over {N} seconds',
  },
];
