import type { PowerEffectConfig } from './types';

export const MENTALISM_EFFECTS: PowerEffectConfig[] = [
  // Agonize deals +36 Psychic damage over 12 seconds
  {
    powerId: 'power_9007',
    name: 'AgonizeDoT',
    target: { abilities: ['Agonize'] },
    effects: [
      { type: 'dot', valuePattern: /deals? \+?(\d+) Psychic damage/, damageType: 'Psychic', duration: 12 },
    ],
    template: 'Agonize deals +{N} Psychic damage over {N} seconds',
  },
  // Agonize deals +3% damage and conjures a magical field that mitigates 10% of all physical damage you take for 1 minute (or until 100 damage is mitigated).
  {
    powerId: 'power_9404',
    name: 'AgonizeShield',
    target: { abilities: ['Agonize'] },
    effects: [
      { type: 'percentDamage', valuePattern: /damage[^]*?\+(\d+)%/ },
    ],
    template: 'Agonize deals +{N}% damage and conjures a magical field that mitigates {N}% of all physical damage you take for {N} minute (or until {N} damage is mitigated).',
  },
  // Agonize deals +10% damage and reuse timer is -6 seconds, but the ability deals 15 health damage to YOU
  {
    powerId: 'power_9605',
    name: 'AgonizeShortenReset',
    target: { abilities: ['Agonize'] },
    effects: [
      { type: 'percentDamage', valuePattern: /damage[^]*?\+(\d+)%/ },
    ],
    template: 'Agonize deals +{N}% damage and reuse timer is {N} seconds, but the ability deals {N} health damage to YOU',
  },
  // Electrify, System Shock, and Panic Charge restore 2 Health after a 7 second delay
  {
    powerId: 'power_9005',
    name: 'ElectricityDelayedHeal',
    target: { abilities: ['Electrify', 'System Shock', 'Panic Charge'] },
    effects: [
      { type: 'restore', valuePattern: /(?:restores?|heals? you for) (\d+) Health/, resourceType: 'Health' },
    ],
    template: 'Electrify, System Shock, and Panic Charge restore {N} Health after a {N} second delay',
  },
  // Electrify generates no rage and removes 250 Rage
  {
    powerId: 'power_9753',
    name: 'ElectrifyDeRage',
    target: 'self',
    effects: [
      { type: 'rageDelta', valuePattern: /(\d+) Rage/ },
    ],
    template: 'Electrify generates no rage and removes {N} Rage',
  },
  // Electrify restores 8 Health to you
  {
    powerId: 'power_9754',
    name: 'ElectrifyHeal',
    target: { abilities: ['Electrify'] },
    effects: [
      { type: 'restore', valuePattern: /(?:restores?|heals? you for) (\d+) Health/, resourceType: 'Health' },
    ],
    template: 'Electrify restores {N} Health to you',
  },
  // Electrify restores 4 power to you
  {
    powerId: 'power_9756',
    name: 'ElectrifyRestorePower',
    target: { abilities: ['Electrify'] },
    effects: [
      { type: 'restore', valuePattern: /(?:restores?|heals? you for) (\d+) power/, resourceType: 'power' },
    ],
    template: 'Electrify restores {N} power to you',
  },
  // Electrify stuns the target and deals +2 damage
  {
    powerId: 'power_9004',
    name: 'ElectrifyStun',
    target: { abilities: ['Electrify stuns the target and'] },
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
    ],
    template: 'Electrify stuns the target and deals +{N} damage',
  },
  // For 15 seconds after using Mindreave, your Major Healing abilities restore +6 Health (this effect does not stack with itself)
  {
    powerId: 'power_9008',
    name: 'MindreaveBoostMajorHealing',
    target: 'self',
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'For {N} seconds after using Mindreave, your Major Healing abilities restore +{N} Health (this effect does not stack with itself)',
  },
  // Mindreave deals +6 damage and deals Electricity damage instead of Psychic
  {
    powerId: 'power_9003',
    name: 'MindreaveElectricity',
    target: { abilities: ['Mindreave'] },
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
    ],
    template: 'Mindreave deals +{N} damage and deals Electricity damage instead of Psychic',
  },
  // Mindworm deals +12 Trauma damage over 8 seconds
  {
    powerId: 'power_9813',
    name: 'MindwormDoT',
    target: { abilities: ['Mindworm'] },
    effects: [
      { type: 'dot', valuePattern: /deals? \+?(\d+) Trauma damage/, damageType: 'Trauma', duration: 8 },
    ],
    template: 'Mindworm deals +{N} Trauma damage over {N} seconds',
  },
  // When Mindworm is used on a target that has less than 33% of their max Rage, Mindworm also attacks another enemy within 8 meters of the first (using Mindworm 0)
  {
    powerId: 'power_9814',
    name: 'MindwormHop',
    target: { abilities: ['When Mindworm is used on a target that'] },
    effects: [
      { type: 'aoeDelta', valuePattern: /(?:within|targets within) (\d+) meters/ },
    ],
    template: 'When Mindworm is used on a target that has less than {N}% of their max Rage, Mindworm also attacks another enemy within {N} meters of the first (using Mindworm {N})',
  },
  // Pain Bubble increases the damage of your ranged attacks by 1% for 10 seconds
  {
    powerId: 'power_9802',
    name: 'PainBubbleBoostRanged',
    target: { abilities: ['Pain Bubble increases the'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Pain Bubble increases the damage of your ranged attacks by {N}% for {N} seconds',
  },
  // Pain Bubble deals +5 damage and restores 40 armor to you
  {
    powerId: 'power_9752',
    name: 'PainBubbleSelfArmor',
    target: { abilities: ['Pain Bubble'] },
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
      { type: 'restore', valuePattern: /(?:restores?|heals? you for) (\d+) armor/, resourceType: 'armor' },
    ],
    template: 'Pain Bubble deals +{N} damage and restores {N} armor to you',
  },
  // Panic Charge boosts the damage of all your attacks +2 for 20 seconds
  {
    powerId: 'power_9702',
    name: 'PanicChargeBoostDamage',
    target: { abilities: ['Panic Charge'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Panic Charge boosts the damage of all your attacks +{N} for {N} seconds',
  },
  // Panic Charge knocks all targets back and restores 6 armor to you
  {
    powerId: 'power_9703',
    name: 'PanicChargeKnockback',
    target: { abilities: ['Panic Charge knocks all targets back and'] },
    effects: [
      { type: 'restore', valuePattern: /(?:restores?|heals? you for) (\d+) armor/, resourceType: 'armor' },
    ],
    template: 'Panic Charge knocks all targets back and restores {N} armor to you',
  },
  // Psi Adrenaline Wave increases all targets' Crushing damage +2% for 20 seconds
  {
    powerId: 'power_9604',
    name: 'PsiAdrenalineWaveBoostCrushing',
    target: { abilities: ['Psi Adrenaline Wave increases all targets\' Crushing'] },
    effects: [
      { type: 'percentDamage', valuePattern: /damage[^]*?\+(\d+)%/ },
    ],
    template: 'Psi Adrenaline Wave increases all targets\' Crushing damage +{N}% for {N} seconds',
  },
  // Psi Adrenaline Wave increases all targets' Electricity damage +2% for 20 seconds
  {
    powerId: 'power_9603',
    name: 'PsiAdrenalineWaveBoostElectricity',
    target: { abilities: ['Psi Adrenaline Wave increases all targets\' Electricity'] },
    effects: [
      { type: 'percentDamage', valuePattern: /damage[^]*?\+(\d+)%/ },
    ],
    template: 'Psi Adrenaline Wave increases all targets\' Electricity damage +{N}% for {N} seconds',
  },
  // Psi Adrenaline Wave increases all targets' Slashing damage +2% for 20 seconds
  {
    powerId: 'power_9602',
    name: 'PsiAdrenalineWaveBoostSlashingDirect',
    target: { abilities: ['Psi Adrenaline Wave increases all targets\' Slashing'] },
    effects: [
      { type: 'percentDamage', valuePattern: /damage[^]*?\+(\d+)%/ },
    ],
    template: 'Psi Adrenaline Wave increases all targets\' Slashing damage +{N}% for {N} seconds',
  },
  // Psi Armor Wave and Psi Adrenaline Wave restore 6 armor to all targets after a 15 second delay
  {
    powerId: 'power_9402',
    name: 'PsiArmorAdrenalineWaveDelayedArmor',
    target: { abilities: ['Psi Armor Wave', 'Psi Adrenaline Wave'] },
    effects: [
      { type: 'restore', valuePattern: /(?:restores?|heals? you for) (\d+) armor/, resourceType: 'armor' },
    ],
    template: 'Psi Armor Wave and Psi Adrenaline Wave restore {N} armor to all targets after a {N} second delay',
  },
  // Psi Armor Wave instantly restores 7 armor to all targets
  {
    powerId: 'power_9401',
    name: 'PsiArmorWaveExtraArmor',
    target: { abilities: ['Psi Armor Wave instantly'] },
    effects: [
      { type: 'restore', valuePattern: /(?:restores?|heals? you for) (\d+) armor/, resourceType: 'armor' },
    ],
    template: 'Psi Armor Wave instantly restores {N} armor to all targets',
  },
  // Psi Power Wave and Psi Armor Wave cause all targets' melee attacks to cost -1 Power for 20 seconds
  {
    powerId: 'power_9504',
    name: 'PsiArmorWavePsychicDmgBoost',
    target: { abilities: ['Psi Power Wave', 'Psi Armor Wave cause all targets\' melee attacks to'] },
    effects: [
      { type: 'costDelta', valuePattern: /[Cc]ost -(\d+)/ },
    ],
    template: 'Psi Power Wave and Psi Armor Wave cause all targets\' melee attacks to cost {N} Power for {N} seconds',
  },
  // Psi Health Wave and Psi Adrenaline Wave instantly heal all targets for 10 health
  {
    powerId: 'power_9301',
    name: 'PsiHealthAdrenalineWaveExtraHeal',
    target: { abilities: ['Psi Health Wave', 'Psi Adrenaline Wave instantly'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Psi Health Wave and Psi Adrenaline Wave instantly heal all targets for {N} health',
  },
  // Psi Health Wave and Psi Armor Wave instantly restore 10 armor to you
  {
    powerId: 'power_9403',
    name: 'PsiHealthAndArmorWaveSelfArmor',
    target: { abilities: ['Psi Health Wave', 'Psi Armor Wave instantly'] },
    effects: [
      { type: 'restore', valuePattern: /(?:restores?|heals? you for) (\d+) armor/, resourceType: 'armor' },
    ],
    template: 'Psi Health Wave and Psi Armor Wave instantly restore {N} armor to you',
  },
  // Psi Health Wave and Psi Armor Wave instantly heal you for 10 health
  {
    powerId: 'power_9303',
    name: 'PsiHealthArmorWaveSelfHeal',
    target: { abilities: ['Psi Health Wave', 'Psi Armor Wave instantly'] },
    effects: [
      { type: 'restore', valuePattern: /(?:restores?|heals? you for) (\d+) health/, resourceType: 'health' },
    ],
    template: 'Psi Health Wave and Psi Armor Wave instantly heal you for {N} health',
  },
  // Psi Health Wave heals all targets for 10 health after a 15 second delay
  {
    powerId: 'power_9302',
    name: 'PsiHealthWaveCritHeal',
    target: { abilities: ['Psi Health Wave'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Psi Health Wave heals all targets for {N} health after a {N} second delay',
  },
  // Psi Health Wave grants all targets +6 Mitigation vs. Electricity, Acid, and Nature attacks for 20 seconds
  {
    powerId: 'power_9304',
    name: 'PsiHealthWaveResist',
    target: 'self',
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Psi Health Wave grants all targets +{N} Mitigation vs. Electricity, Acid, and Nature attacks for {N} seconds',
  },
  // Psi Power Wave and Psi Adrenaline Wave instantly restore 15 power to you
  {
    powerId: 'power_9503',
    name: 'PsiPowerAndAdrenalineWaveSelfPower',
    target: { abilities: ['Psi Power Wave', 'Psi Adrenaline Wave instantly'] },
    effects: [
      { type: 'restore', valuePattern: /(?:restores?|heals? you for) (\d+) power/, resourceType: 'power' },
    ],
    template: 'Psi Power Wave and Psi Adrenaline Wave instantly restore {N} power to you',
  },
  // Psi Power Wave and Psi Adrenaline Wave restore 10 power to all targets after a 15 second delay
  {
    powerId: 'power_9501',
    name: 'PsiPowerWaveDelayedPower',
    target: { abilities: ['Psi Power Wave', 'Psi Adrenaline Wave'] },
    effects: [
      { type: 'restore', valuePattern: /(?:restores?|heals? you for) (\d+) power/, resourceType: 'power' },
    ],
    template: 'Psi Power Wave and Psi Adrenaline Wave restore {N} power to all targets after a {N} second delay',
  },
  // Psi Power Wave instantly restores 5 power to all targets
  {
    powerId: 'power_9502',
    name: 'PsiPowerWaveInstantPower',
    target: { abilities: ['Psi Power Wave instantly'] },
    effects: [
      { type: 'restore', valuePattern: /(?:restores?|heals? you for) (\d+) power/, resourceType: 'power' },
    ],
    template: 'Psi Power Wave instantly restores {N} power to all targets',
  },
  // Psi Health Wave, Armor Wave, and Power Wave restore +1 Health, Armor, and Power respectively every few seconds
  {
    powerId: 'power_9305',
    name: 'PsiWaveBoost',
    target: { abilities: ['Psi Health Wave', 'Armor Wave', 'Power Wave'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Psi Health Wave, Armor Wave, and Power Wave restore +{N} Health, Armor, and Power respectively every few seconds',
  },
  // Psi Health Wave, Armor Wave, and Power Wave grant all targets +10 Psychic Damage for 60 seconds
  {
    powerId: 'power_9601',
    name: 'PsiWaveBoostMentalism',
    target: { abilities: ['Psi Health Wave', 'Armor Wave', 'Power Wave grant all targets +10 Psychic'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Psi Health Wave, Armor Wave, and Power Wave grant all targets +{N} Psychic Damage for {N} seconds',
  },
  // All Psi Wave Abilities cost -1 Power and your Combat Refresh restores +4 Health
  {
    powerId: 'power_9002',
    name: 'PsiWaveCheaper',
    target: { abilities: ['All Psi Wave Abilities'] },
    effects: [
      { type: 'costDelta', valuePattern: /[Cc]ost -(\d+)/ },
    ],
    template: 'All Psi Wave Abilities cost {N} Power and your Combat Refresh restores +{N} Health',
  },
  // Reconstruct causes the target to take 4 less damage from attacks for 30 seconds
  {
    powerId: 'power_9083',
    name: 'ReconstructMitigationBoost',
    target: { abilities: ['Reconstruct causes the target to take 4 less'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Reconstruct causes the target to take {N} less damage from attacks for {N} seconds',
  },
  // Reconstruct restores 6 Power to the target
  {
    powerId: 'power_9085',
    name: 'ReconstructRestorePower',
    target: { abilities: ['Reconstruct'] },
    effects: [
      { type: 'restore', valuePattern: /(?:restores?|heals? you for) (\d+) Power/, resourceType: 'Power' },
    ],
    template: 'Reconstruct restores {N} Power to the target',
  },
  // Reconstruct restores 2 power and boosts target's sprint speed by 1 for 10 seconds
  {
    powerId: 'power_9087',
    name: 'ReconstructSpeedUp',
    target: { abilities: ['Reconstruct'] },
    effects: [
      { type: 'restore', valuePattern: /(?:restores?|heals? you for) (\d+) power/, resourceType: 'power' },
    ],
    template: 'Reconstruct restores {N} power and boosts target\'s sprint speed by {N} for {N} seconds',
  },
  // Revitalize restores +1 Health and removes ongoing Trauma effects (up to 1 dmg/sec)
  {
    powerId: 'power_9086',
    name: 'RevitalizeDispelTrauma',
    target: { abilities: ['Revitalize'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Revitalize restores +{N} Health and removes ongoing Trauma effects (up to {N} dmg/sec)',
  },
  // Revitalize restores +3 Health and causes the target to take 4 less damage from Psychic and Nature attacks for 12 seconds
  {
    powerId: 'power_9084',
    name: 'RevitalizePsychicMitigationBoost',
    target: { abilities: ['Revitalize'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Revitalize restores +{N} Health and causes the target to take {N} less damage from Psychic and Nature attacks for {N} seconds',
  },
  // Revitalize restores 7 armor to YOU (regardless of the target of the ability)
  {
    powerId: 'power_9088',
    name: 'RevitalizeSelfArmor',
    target: { abilities: ['Revitalize'] },
    effects: [
      { type: 'restore', valuePattern: /(?:restores?|heals? you for) (\d+) armor/, resourceType: 'armor' },
    ],
    template: 'Revitalize restores {N} armor to YOU (regardless of the target of the ability)',
  },
  // System Shock boosts the damage of your Signature Debuffs by +5 for 8 seconds
  {
    powerId: 'power_9034',
    name: 'SystemShockBoostSignatureDebuff',
    target: { abilities: ['System Shock'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'System Shock boosts the damage of your Signature Debuffs by +{N} for {N} seconds',
  },
  // System Shock deals +3 Electricity damage plus 6 Psychic damage over 12 seconds
  {
    powerId: 'power_9032',
    name: 'SystemShockDoT',
    target: { abilities: ['System Shock'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'System Shock deals +{N} Electricity damage plus {N} Psychic damage over {N} seconds',
  },
  // System Shock deals +2 damage, generates no Rage, and reduces Rage by 30
  {
    powerId: 'power_9033',
    name: 'SystemShockLowerRage',
    target: { abilities: ['System Shock'] },
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
    ],
    template: 'System Shock deals +{N} damage, generates no Rage, and reduces Rage by {N}',
  },
];
