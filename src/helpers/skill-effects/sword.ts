import type { PowerEffectConfig } from './types';

export const SWORD_EFFECTS: PowerEffectConfig[] = [
  // Debilitating Blow deals +10 damage and causes your Core Attacks to deal +7 damage for 7 seconds
  {
    powerId: 'power_1502',
    name: 'DebilitatingBlowBoostCoreAttacks',
    target: { abilities: ['Debilitating Blow'] },
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
    ],
    template: 'Debilitating Blow deals +{N} damage and causes your Core Attacks to deal +{N} damage for {N} seconds',
  },
  // Debilitating Blow hastens the current reuse timer of Decapitate by 1 second
  {
    powerId: 'power_1027',
    name: 'DebilitatingBlowHastenDecapitate',
    target: { abilities: ['Debilitating Blow hastens the current'] },
    effects: [
      { type: 'cooldownDelta', valuePattern: /by (\d+) seconds?/ },
    ],
    template: 'Debilitating Blow hastens the current reuse timer of Decapitate by {N} second',
  },
  // Debilitating Blow deals +3 damage and causes target's Rage attacks to deal -5% damage for 10 seconds
  {
    powerId: 'power_1503',
    name: 'DebilitatingBlowRageAttackDebuff',
    target: { abilities: ['Debilitating Blow'] },
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
    ],
    template: 'Debilitating Blow deals +{N} damage and causes target\'s Rage attacks to deal {N}% damage for {N} seconds',
  },
  // Decapitate deals +60 damage to non-Elite targets
  {
    powerId: 'power_1203',
    name: 'DecapitateKillNonElites',
    target: { abilities: ['Decapitate'] },
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
    ],
    template: 'Decapitate deals +{N} damage to non-Elite targets',
  },
  // Decapitate increases your Max Health +15 for 60 seconds (and heals 15)
  {
    powerId: 'power_1202',
    name: 'DecapitateMaxHealth',
    target: { abilities: ['Decapitate increases your Max Health +15 for 60 seconds (and'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Decapitate increases your Max Health +{N} for {N} seconds (and heals {N})',
  },
  // Decapitate deals +10 damage. If the target is killed, Decapitate can be used again immediately.
  {
    powerId: 'power_1204',
    name: 'DecapitateResetOnKill',
    target: { abilities: ['Decapitate'] },
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
    ],
    template: 'Decapitate deals +{N} damage. If the target is killed, Decapitate can be used again immediately.',
  },
  // Decapitate deals +40 damage and the next attack you use stuns its target
  {
    powerId: 'power_1081',
    name: 'DecapitateStun',
    target: { abilities: ['Decapitate'] },
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
    ],
    template: 'Decapitate deals +{N} damage and the next attack you use stuns its target',
  },
  // If Finishing Blow or Decapitate kills its target, you gain +12% direct damage for 15 seconds (this effect does not stack with itself)
  {
    powerId: 'power_1087',
    name: 'FinishingBlowDecapitateBuff',
    target: 'self',
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'If Finishing Blow or Decapitate kills its target, you gain +{N}% direct damage for {N} seconds (this effect does not stack with itself)',
  },
  // Finishing Blow and Decapitate damage +20
  {
    powerId: 'power_1085',
    name: 'FinishingBlowDecapitateDmgBoost',
    target: { abilities: ['Finishing Blow', 'Decapitate'] },
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
    ],
    template: 'Finishing Blow and Decapitate damage +{N}',
  },
  // Finishing Blow gives you 25% resistance to Elemental damage (Fire, Cold, Electricity) for 10 seconds
  {
    powerId: 'power_1064',
    name: 'FinishingBlowElementalResistance',
    target: { abilities: ['Finishing Blow gives you 25% resistance to Elemental'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Finishing Blow gives you {N}% resistance to Elemental damage (Fire, Cold, Electricity) for {N} seconds',
  },
  // Finishing Blow restores 12 Power to you
  {
    powerId: 'power_1083',
    name: 'FinishingBlowHealPower',
    target: { abilities: ['Finishing Blow'] },
    effects: [
      { type: 'restore', valuePattern: /(?:restores?|heals? you for) (\d+) Power/, resourceType: 'Power' },
    ],
    template: 'Finishing Blow restores {N} Power to you',
  },
  // Finishing Blow causes your next attack to deal +15 damage if it deals direct Psychic, Trauma, or Poison damage
  {
    powerId: 'power_1086',
    name: 'FinishingBlowPsychic',
    target: { abilities: ['Finishing Blow causes your next attack to'] },
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
    ],
    template: 'Finishing Blow causes your next attack to deal +{N} damage if it deals direct Psychic, Trauma, or Poison damage',
  },
  // Flashing Strike and Hacking Blade Damage +6%
  {
    powerId: 'power_1066',
    name: 'FlashingStrikeAndHackingBladeBoost',
    target: { abilities: ['Flashing Strike', 'Hacking Blade'] },
    effects: [
      { type: 'percentDamage', valuePattern: /damage[^]*?\+(\d+)%/ },
    ],
    template: 'Flashing Strike and Hacking Blade Damage +{N}%',
  },
  // Flashing Strike deals +25% damage and gives you 50% resistance to Darkness damage for 7 seconds
  {
    powerId: 'power_1082',
    name: 'FlashingStrikeDarkResist',
    target: { abilities: ['Flashing Strike'] },
    effects: [
      { type: 'percentDamage', valuePattern: /damage[^]*?\+(\d+)%/ },
    ],
    template: 'Flashing Strike deals +{N}% damage and gives you {N}% resistance to Darkness damage for {N} seconds',
  },
  // Flashing Strike deals +25 damage to undead
  {
    powerId: 'power_1253',
    name: 'FlashingStrikeExtraVsUndead',
    target: { abilities: ['Flashing Strike'] },
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
    ],
    template: 'Flashing Strike deals +{N} damage to undead',
  },
  // Flashing Strike heals you for 3 health
  {
    powerId: 'power_1251',
    name: 'FlashingStrikeRestoreHealth',
    target: { abilities: ['Flashing Strike'] },
    effects: [
      { type: 'restore', valuePattern: /(?:restores?|heals? you for) (\d+) health/, resourceType: 'health' },
    ],
    template: 'Flashing Strike heals you for {N} health',
  },
  // Hacking Blade and Debilitating Blow deal 48 Trauma damage over 6 seconds
  {
    powerId: 'power_1453',
    name: 'HackingBladeDebilitatingBlowDoT',
    target: { abilities: ['Hacking Blade', 'Debilitating Blow'] },
    effects: [
      { type: 'dot', valuePattern: /deals? \+?(\d+) Trauma damage/, damageType: 'Trauma', duration: 6 },
    ],
    template: 'Hacking Blade and Debilitating Blow deal {N} Trauma damage over {N} seconds',
  },
  // Hacking Blade generates no Rage, and instead reduces Rage by 20
  {
    powerId: 'power_1454',
    name: 'HackingBladeDeRage',
    target: 'self',
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Hacking Blade generates no Rage, and instead reduces Rage by {N}',
  },
  // Hacking Blade deals +12 Trauma damage over 6 seconds
  {
    powerId: 'power_1452',
    name: 'HackingBladeDoT',
    target: { abilities: ['Hacking Blade'] },
    effects: [
      { type: 'dot', valuePattern: /deals? \+?(\d+) Trauma damage/, damageType: 'Trauma', duration: 6 },
    ],
    template: 'Hacking Blade deals +{N} Trauma damage over {N} seconds',
  },
  // Decapitate deals +25 damage and reuse timer is -2 seconds
  {
    powerId: 'power_1029',
    name: 'HastenDecapitate',
    target: { abilities: ['Decapitate'] },
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
    ],
    template: 'Decapitate deals +{N} damage and reuse timer is {N} seconds',
  },
  // Heart Piercer removes (up to) 17 more Rage, turning half of that into Trauma damage
  {
    powerId: 'power_1302',
    name: 'HeartPiercerDeRage',
    target: 'self',
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Heart Piercer removes (up to) {N} more Rage, turning half of that into Trauma damage',
  },
  // Heart Piercer deals +3% direct damage and heals you for 4 health
  {
    powerId: 'power_1303',
    name: 'HeartPiercerHealAndDmg',
    target: { abilities: ['Heart Piercer'] },
    effects: [
      { type: 'restore', valuePattern: /(?:restores?|heals? you for) (\d+) health/, resourceType: 'health' },
    ],
    template: 'Heart Piercer deals +{N}% direct damage and heals you for {N} health',
  },
  // Heart Piercer heals you for 6 health
  {
    powerId: 'power_1301',
    name: 'HeartPiercerRestoreHealth',
    target: { abilities: ['Heart Piercer'] },
    effects: [
      { type: 'restore', valuePattern: /(?:restores?|heals? you for) (\d+) health/, resourceType: 'health' },
    ],
    template: 'Heart Piercer heals you for {N} health',
  },
  // Many Cuts hits all enemies within 5 meters
  {
    powerId: 'power_1028',
    name: 'ManyCutsAoE',
    target: 'self',
    effects: [
      { type: 'aoeDelta', valuePattern: /(?:within|targets within) (\d+) meters/ },
    ],
    template: 'Many Cuts hits all enemies within {N} meters',
  },
  // Many Cuts and Debilitating Blow Damage +3
  {
    powerId: 'power_1007',
    name: 'ManyCutsDebilitatingBlowBoost',
    target: { abilities: ['Many Cuts', 'Debilitating Blow'] },
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
    ],
    template: 'Many Cuts and Debilitating Blow Damage +{N}',
  },
  // Many Cuts and Debilitating Blow deal +20% damage to Arthropods (such as spiders, mantises, and beetles)
  {
    powerId: 'power_1024',
    name: 'ManyCutsDebilitatingBlowKillArthropods',
    target: { abilities: ['Many Cuts', 'Debilitating Blow'] },
    effects: [
      { type: 'percentDamage', valuePattern: /damage[^]*?\+(\d+)%/ },
    ],
    template: 'Many Cuts and Debilitating Blow deal +{N}% damage to Arthropods (such as spiders, mantises, and beetles)',
  },
  // Many Cuts deals +18 Trauma damage over 6 seconds
  {
    powerId: 'power_1021',
    name: 'ManyCutsDoT',
    target: { abilities: ['Many Cuts'] },
    effects: [
      { type: 'dot', valuePattern: /deals? \+?(\d+) Trauma damage/, damageType: 'Trauma', duration: 6 },
    ],
    template: 'Many Cuts deals +{N} Trauma damage over {N} seconds',
  },
  // Many Cuts deals +7 damage and if target has less than a third of their Max Rage, also knocks them back.
  {
    powerId: 'power_1023',
    name: 'ManyCutsKnockback',
    target: { abilities: ['Many Cuts'] },
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
    ],
    template: 'Many Cuts deals +{N} damage and if target has less than a third of their Max Rage, also knocks them back.',
  },
  // Many Cuts deals +3% damage and stuns targets that have less than a third of their Max Rage.
  {
    powerId: 'power_1022',
    name: 'ManyCutsStunOnLowRage',
    target: { abilities: ['Many Cuts'] },
    effects: [
      { type: 'percentDamage', valuePattern: /damage[^]*?\+(\d+)%/ },
    ],
    template: 'Many Cuts deals +{N}% damage and stuns targets that have less than a third of their Max Rage.',
  },
  // Parry and Riposte Damage +10%
  {
    powerId: 'power_1043',
    name: 'ParryAndRiposteBoost',
    target: { abilities: ['Parry', 'Riposte'] },
    effects: [
      { type: 'percentDamage', valuePattern: /damage[^]*?\+(\d+)%/ },
    ],
    template: 'Parry and Riposte Damage +{N}%',
  },
  // Parry hits all enemies within 5 meters, dealing an additional +3 damage
  {
    powerId: 'power_1044',
    name: 'ParryAoE',
    target: 'self',
    effects: [
      { type: 'aoeDelta', valuePattern: /(?:within|targets within) (\d+) meters/ },
    ],
    template: 'Parry hits all enemies within {N} meters, dealing an additional +{N} damage',
  },
  // Parry restores 3 health
  {
    powerId: 'power_1042',
    name: 'ParryHeal',
    target: { abilities: ['Parry'] },
    effects: [
      { type: 'restore', valuePattern: /(?:restores?|heals? you for) (\d+) health/, resourceType: 'health' },
    ],
    template: 'Parry restores {N} health',
  },
  // Parry and Riposte further reduce target's Rage by 80
  {
    powerId: 'power_1041',
    name: 'ParryLessRage',
    target: 'self',
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Parry and Riposte further reduce target\'s Rage by {N}',
  },
  // Parry and Riposte Damage +5% and Power Cost -1
  {
    powerId: 'power_1005',
    name: 'ParryLowerPowerCost',
    target: { abilities: ['Parry', 'Riposte'] },
    effects: [
      { type: 'percentDamage', valuePattern: /damage[^]*?\+(\d+)%/ },
      { type: 'costDelta', valuePattern: /[Cc]ost -(\d+)/ },
    ],
    template: 'Parry and Riposte Damage +{N}% and Power Cost {N}',
  },
  // Parry and Riposte boost your Indirect Trauma Damage +2/tick for 30 seconds
  {
    powerId: 'power_1046',
    name: 'ParryRiposteBoostTrauma',
    target: { abilities: ['Parry', 'Riposte'] },
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
    ],
    template: 'Parry and Riposte boost your Indirect Trauma Damage +{N}/tick for {N} seconds',
  },
  // Parry and Riposte temp-taunt the target +500
  {
    powerId: 'power_1047',
    name: 'ParryRiposteTempTaunt',
    target: 'self',
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Parry and Riposte temp-taunt the target +{N}',
  },
  // For 6 seconds after using Precision Pierce, your Nice Attacks deal +4 damage
  {
    powerId: 'power_1354',
    name: 'PrecisionPierceBuff',
    target: 'self',
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
    ],
    template: 'For {N} seconds after using Precision Pierce, your Nice Attacks deal +{N} damage',
  },
  // Precision Pierce deals +100% damage but its reuse timer is increased +3 seconds
  {
    powerId: 'power_1353',
    name: 'PrecisionPierceCrit',
    target: { abilities: ['Precision Pierce'] },
    effects: [
      { type: 'percentDamage', valuePattern: /damage[^]*?\+(\d+)%/ },
    ],
    template: 'Precision Pierce deals +{N}% damage but its reuse timer is increased +{N} seconds',
  },
  // Precision Pierce and Heart Piercer restore 3 Health to you
  {
    powerId: 'power_1351',
    name: 'PrecisionPierceHeal',
    target: { abilities: ['Precision Pierce', 'Heart Piercer'] },
    effects: [
      { type: 'restore', valuePattern: /(?:restores?|heals? you for) (\d+) Health/, resourceType: 'Health' },
    ],
    template: 'Precision Pierce and Heart Piercer restore {N} Health to you',
  },
  // Precision Pierce deals +9 direct health damage and further reduces target's Rage by 35
  {
    powerId: 'power_1025',
    name: 'PrecisionPierceLessRage',
    target: { abilities: ['Precision Pierce'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Precision Pierce deals +{N} direct health damage and further reduces target\'s Rage by {N}',
  },
  // Riposte restores 5 armor
  {
    powerId: 'power_1045',
    name: 'RiposteHealArmor',
    target: { abilities: ['Riposte'] },
    effects: [
      { type: 'restore', valuePattern: /(?:restores?|heals? you for) (\d+) armor/, resourceType: 'armor' },
    ],
    template: 'Riposte restores {N} armor',
  },
  // Sword Accuracy +5
  {
    powerId: 'power_32101',
    name: 'SharpenedSwordAccuracy',
    target: 'self',
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Sword Accuracy +{N}',
  },
  // Sword Damage to Vulnerable Enemies +4
  {
    powerId: 'power_32102',
    name: 'SharpenedSwordVulnDamage',
    target: { abilities: ['Sword'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Sword Damage to Vulnerable Enemies +{N}',
  },
  // Indirect Poison Damage, Indirect Trauma Damage, and Indirect Psychic Damage +4% while Sword skill active
  {
    powerId: 'power_1402',
    name: 'SwordBoostBodyDamage',
    target: { abilities: ['Indirect Poison'] },
    effects: [
      { type: 'percentDamage', valuePattern: /damage[^]*?\+(\d+)%/ },
    ],
    template: 'Indirect Poison Damage, Indirect Trauma Damage, and Indirect Psychic Damage +{N}% while Sword skill active',
  },
  // All sword abilities deal +3% damage when you have 33% or less of your Armor left
  {
    powerId: 'power_1002',
    name: 'SwordBoostUnarmored',
    target: { skill: 'sword' },
    effects: [
      { type: 'percentDamage', valuePattern: /damage[^]*?\+(\d+)%/ },
    ],
    template: 'All sword abilities deal +{N}% damage when you have {N}% or less of your Armor left',
  },
  // All Sword abilities deal +10% damage to targets with less than 33% of their Max Rage.
  {
    powerId: 'power_1009',
    name: 'SwordBoostVsCalm',
    target: { skill: 'Sword' },
    effects: [
      { type: 'percentDamage', valuePattern: /damage[^]*?\+(\d+)%/ },
    ],
    template: 'All Sword abilities deal +{N}% damage to targets with less than {N}% of their Max Rage.',
  },
  // All Sword abilities deal +10% damage to targets with less than 33% of their Max Rage.
  {
    powerId: 'power_1010',
    name: 'SwordBoostVsCalmB',
    target: { skill: 'Sword' },
    effects: [
      { type: 'percentDamage', valuePattern: /damage[^]*?\+(\d+)%/ },
    ],
    template: 'All Sword abilities deal +{N}% damage to targets with less than {N}% of their Max Rage.',
  },
  // Sword Slash and Thrusting Blade restore 4 armor
  {
    powerId: 'power_1004',
    name: 'SwordSlashHeal',
    target: { abilities: ['Sword Slash', 'Thrusting Blade'] },
    effects: [
      { type: 'restore', valuePattern: /(?:restores?|heals? you for) (\d+) armor/, resourceType: 'armor' },
    ],
    template: 'Sword Slash and Thrusting Blade restore {N} armor',
  },
  // All Sword abilities have a 20% chance to restore 12 Health to you
  {
    powerId: 'power_1006',
    name: 'SwordUniversalHealChance',
    target: { skill: 'Sword' },
    effects: [
      { type: 'restore', valuePattern: /(?:restores?|heals? you for) (\d+) Health/, resourceType: 'Health' },
    ],
    template: 'All Sword abilities have a {N}% chance to restore {N} Health to you',
  },
  // Wind Strike deals +8% damage and gives you +3 Accuracy for 10 seconds (Accuracy cancels out the Evasion that certain monsters have)
  {
    powerId: 'power_1063',
    name: 'WindStrikeAccuracy',
    target: { abilities: ['Wind Strike'] },
    effects: [
      { type: 'percentDamage', valuePattern: /damage[^]*?\+(\d+)%/ },
    ],
    template: 'Wind Strike deals +{N}% damage and gives you +{N} Accuracy for {N} seconds (Accuracy cancels out the Evasion that certain monsters have)',
  },
  // Wind Strike causes your next ability to cost 0 Power if it is an Attack ability.
  {
    powerId: 'power_1067',
    name: 'WindStrikeFreeAttack',
    target: { abilities: ['Wind Strike causes your next ability to'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Wind Strike causes your next ability to cost {N} Power if it is an Attack ability.',
  },
  // Wind Strike hastens the current reuse timer of Finishing Blow by 1 second
  {
    powerId: 'power_1026',
    name: 'WindStrikeHastenFinishingBlow',
    target: { abilities: ['Wind Strike hastens the current'] },
    effects: [
      { type: 'cooldownDelta', valuePattern: /by (\d+) seconds?/ },
    ],
    template: 'Wind Strike hastens the current reuse timer of Finishing Blow by {N} second',
  },
  // Wind Strike and Heart Piercer deal 10 armor damage
  {
    powerId: 'power_1062',
    name: 'WindStrikeHeartPiercerArmorDamage',
    target: { abilities: ['Wind Strike', 'Heart Piercer'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Wind Strike and Heart Piercer deal {N} armor damage',
  },
  // Wind Strike deals +13 damage and causes your next attack to deal +13 damage
  {
    powerId: 'power_1061',
    name: 'WindStrikeNextAttackBoost',
    target: { abilities: ['Wind Strike'] },
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
    ],
    template: 'Wind Strike deals +{N} damage and causes your next attack to deal +{N} damage',
  },
  // Wind Strike gives you +50% projectile evasion for 10 seconds
  {
    powerId: 'power_1065',
    name: 'WindStrikeRangedEvasion',
    target: 'self',
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Wind Strike gives you +{N}% projectile evasion for {N} seconds',
  },
];
