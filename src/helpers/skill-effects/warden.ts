import type { PowerEffectConfig } from './types';

export const WARDEN_EFFECTS: PowerEffectConfig[] = [
  // Aggression Deterrent ignites all targets, dealing 16 Fire damage over 8 seconds
  {
    powerId: 'power_27192',
    name: 'AggressionDeterrentDoT',
    target: { abilities: ['Aggression Deterrent'] },
    effects: [
      { type: 'dot', valuePattern: /dealing (\d+) Fire damage/, damageType: 'Fire', duration: 8 },
    ],
    template: 'Aggression Deterrent ignites all targets, dealing {N} Fire damage over {N} seconds',
  },
  // Apprehend causes your Nice Attacks to deal +10 damage for 8 seconds
  {
    powerId: 'power_27073',
    name: 'ApprehendBoostNice',
    target: { abilities: ['Apprehend causes your Nice Attacks to'] },
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
    ],
    template: 'Apprehend causes your Nice Attacks to deal +{N} damage for {N} seconds',
  },
  // Apprehend costs -2 Power
  {
    powerId: 'power_27072',
    name: 'ApprehendCheaper',
    target: 'self',
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Apprehend costs {N} Power',
  },
  // Apprehend deals +5 damage, and damage type is changed to Electricity
  {
    powerId: 'power_27074',
    name: 'ApprehendElectrical',
    target: { abilities: ['Apprehend'] },
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
    ],
    template: 'Apprehend deals +{N} damage, and damage type is changed to Electricity',
  },
  // Apprehend deals +36 Fire damage over 6 seconds and hastens the current reuse timer of Controlled Burn by 0.5 seconds (so it can be used again more quickly)
  {
    powerId: 'power_27075',
    name: 'ApprehendHastenControlledBurn',
    target: { abilities: ['Apprehend'] },
    effects: [
      { type: 'dot', valuePattern: /deals? \+?(\d+) Fire damage/, damageType: 'Fire', duration: 6 },
    ],
    template: 'Apprehend deals +{N} Fire damage over {N} seconds and hastens the current reuse timer of Controlled Burn by {N} seconds (so it can be used again more quickly)',
  },
  // Apprehend Damage +6. Non-Elite targets do not call for help.
  {
    powerId: 'power_27076',
    name: 'ApprehendSuppressShout',
    target: { abilities: ['Apprehend'] },
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
    ],
    template: 'Apprehend Damage +{N}. Non-Elite targets do not call for help.',
  },
  // Call For Backup assstance deals +10 Direct Damage and exists for +1 seconds
  {
    powerId: 'power_27203',
    name: 'CallForBackupBoost',
    target: { abilities: ['Call For Backup assstance'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Call For Backup assstance deals +{N} Direct Damage and exists for +{N} seconds',
  },
  // Call For Backup assistance has +2% Universal Evasion and +2% Max Armor and lasts for +1 seconds
  {
    powerId: 'power_27202',
    name: 'CallForBackupEvasion',
    target: { abilities: ['Call For Backup assistance'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Call For Backup assistance has +{N}% Universal Evasion and +{N}% Max Armor and lasts for +{N} seconds',
  },
  // Call For Backup assistance deals +7% Direct Damage and exists for +1 seconds
  {
    powerId: 'power_27204',
    name: 'CallForBackupMod',
    target: { abilities: ['Call For Backup assistance'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Call For Backup assistance deals +{N}% Direct Damage and exists for +{N} seconds',
  },
  // Call For Backup assistance has +1 increased speed and exists for +1 seconds
  {
    powerId: 'power_27205',
    name: 'CallForBackupShifty',
    target: { abilities: ['Call For Backup assistance'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Call For Backup assistance has +{N} increased speed and exists for +{N} seconds',
  },
  // Conditioning Shock and Apprehend deal +10 damage
  {
    powerId: 'power_27056',
    name: 'ConditioningShockApprehendDamage',
    target: { abilities: ['Conditioning Shock', 'Apprehend'] },
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
    ],
    template: 'Conditioning Shock and Apprehend deal +{N} damage',
  },
  // Conditioning Shock deals +8 damage and, if target is a monster, its chance to critically-hit is reduced by 25% for 10 seconds
  {
    powerId: 'power_27055',
    name: 'ConditioningShockCritDebuff',
    target: { abilities: ['Conditioning Shock'] },
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
    ],
    template: 'Conditioning Shock deals +{N} damage and, if target is a monster, its chance to critically-hit is reduced by {N}% for {N} seconds',
  },
  // Conditioning Shock causes target's next ability to deal -3 damage
  {
    powerId: 'power_27054',
    name: 'ConditioningShockDamageDebuff',
    target: { abilities: ['Conditioning Shock causes target\'s next ability to'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Conditioning Shock causes target\'s next ability to deal {N} damage',
  },
  // Conditioning Shock deals +6 damage and reuse time is 1 second sooner
  {
    powerId: 'power_27053',
    name: 'ConditioningShockFaster',
    target: { abilities: ['Conditioning Shock'] },
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
    ],
    template: 'Conditioning Shock deals +{N} damage and reuse time is {N} second sooner',
  },
  // Conditioning Shock deals +6 damage and causes the target to suffer +20% Fire damage for 30 seconds
  {
    powerId: 'power_27052',
    name: 'ConditioningShockFireDebuff',
    target: { abilities: ['Conditioning Shock'] },
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
    ],
    template: 'Conditioning Shock deals +{N} damage and causes the target to suffer +{N}% Fire damage for {N} seconds',
  },
  // Controlled Burn and Aggression Deterrent deal +10 damage
  {
    powerId: 'power_27115',
    name: 'ControlledBurnAndAggressionDeterrentBoost',
    target: { abilities: ['Controlled Burn', 'Aggression Deterrent'] },
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
    ],
    template: 'Controlled Burn and Aggression Deterrent deal +{N} damage',
  },
  // Controlled Burn and Aggression Deterrent cost -8 Power
  {
    powerId: 'power_27114',
    name: 'ControlledBurnAndAggressionDeterrentCheaper',
    target: { abilities: ['Controlled Burn', 'Aggression Deterrent'] },
    effects: [
      { type: 'costDelta', valuePattern: /[Cc]ost -(\d+)/ },
    ],
    template: 'Controlled Burn and Aggression Deterrent cost {N} Power',
  },
  // Controlled Burn deals 6 indirect Fire damage over 12 seconds
  {
    powerId: 'power_27112',
    name: 'ControlledBurnDoT',
    target: { abilities: ['Controlled Burn'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Controlled Burn deals {N} indirect Fire damage over {N} seconds',
  },
  // Controlled Burn deals +8 damage and taunts +25 to all targets
  {
    powerId: 'power_27113',
    name: 'ControlledBurnTaunt',
    target: { abilities: ['Controlled Burn'] },
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
    ],
    template: 'Controlled Burn deals +{N} damage and taunts +{N} to all targets',
  },
  // Coordinated Assault increases all allies' Max Armor +7 for 30 seconds
  {
    powerId: 'power_27173',
    name: 'CoordinatedAssaultMaxArmor',
    target: 'self',
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Coordinated Assault increases all allies\' Max Armor +{N} for {N} seconds',
  },
  // Coordinated Assault increases all allies' Max Health +5 for 30 seconds
  {
    powerId: 'power_27172',
    name: 'CoordinatedAssaultMaxHealth',
    target: 'self',
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Coordinated Assault increases all allies\' Max Health +{N} for {N} seconds',
  },
  // Coordinated Assault causes all allies' Melee attacks to cost -3 Power for 30 seconds
  {
    powerId: 'power_27171',
    name: 'CoordinatedAssaultPower',
    target: { abilities: ['Coordinated Assault causes all allies\' Melee attacks to'] },
    effects: [
      { type: 'costDelta', valuePattern: /[Cc]ost -(\d+)/ },
    ],
    template: 'Coordinated Assault causes all allies\' Melee attacks to cost {N} Power for {N} seconds',
  },
  // Coordinated Assault causes all allies' melee attacks to deal up to +15 damage (randomly determined for each attack) for 30 seconds
  {
    powerId: 'power_27174',
    name: 'CoordinatedAssaultRandomDamage',
    target: { abilities: ['Coordinated Assault causes all allies\' melee attacks to'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Coordinated Assault causes all allies\' melee attacks to deal up to +{N} damage (randomly determined for each attack) for {N} seconds',
  },
  // Coordinated Assault grants all allies +1 direct-damage mitigation and +1 out-of-combat sprint speed for 30 seconds
  {
    powerId: 'power_27175',
    name: 'CoordinatedAssaultSpeed',
    target: 'self',
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Coordinated Assault grants all allies +{N} direct-damage mitigation and +{N} out-of-combat sprint speed for {N} seconds',
  },
  // Lethal Force Damage +10 and Power Cost -3
  {
    powerId: 'power_27092',
    name: 'LethalForceCheaper',
    target: { abilities: ['Lethal Force'] },
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
      { type: 'costDelta', valuePattern: /[Cc]ost -(\d+)/ },
    ],
    template: 'Lethal Force Damage +{N} and Power Cost {N}',
  },
  // Lethal Force deals 40 additional Fire damage over 8 seconds
  {
    powerId: 'power_27094',
    name: 'LethalForceDoT',
    target: { abilities: ['Lethal Force'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Lethal Force deals {N} additional Fire damage over {N} seconds',
  },
  // Lethal Force deals +13 damage and reuse time is -3 seconds
  {
    powerId: 'power_27093',
    name: 'LethalForceFaster',
    target: { abilities: ['Lethal Force'] },
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
      { type: 'cooldownDelta', valuePattern: /by (\d+) seconds?/ },
    ],
    template: 'Lethal Force deals +{N} damage and reuse time is {N} seconds',
  },
  // Lethal Force deals +15 damage. Damage type becomes Fire
  {
    powerId: 'power_27095',
    name: 'LethalForceFire',
    target: { abilities: ['Lethal Force'] },
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
    ],
    template: 'Lethal Force deals +{N} damage. Damage type becomes Fire',
  },
  // Privacy Field also deals its damage when you are hit by burst attacks, and damage is +9
  {
    powerId: 'power_27154',
    name: 'PrivacyFieldAffectsBursts',
    target: { abilities: ['Privacy Field also'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Privacy Field also deals its damage when you are hit by burst attacks, and damage is +{N}',
  },
  // Privacy Field also deals its damage when you are hit by ranged attacks, and damage is +10
  {
    powerId: 'power_27155',
    name: 'PrivacyFieldAffectsRanged',
    target: { abilities: ['Privacy Field also'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Privacy Field also deals its damage when you are hit by ranged attacks, and damage is +{N}',
  },
  // Privacy Field deals +8% damage to melee attackers
  {
    powerId: 'power_27151',
    name: 'PrivacyFieldBoost',
    target: { abilities: ['Privacy Field'] },
    effects: [
      { type: 'percentDamage', valuePattern: /damage[^]*?\+(\d+)%/ },
    ],
    template: 'Privacy Field deals +{N}% damage to melee attackers',
  },
  // When Privacy Field deals damage, it also ignites the suspect, dealing 4 damage over 8 seconds
  {
    powerId: 'power_27156',
    name: 'PrivacyFieldDoT',
    target: { abilities: ['When Privacy Field'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'When Privacy Field deals damage, it also ignites the suspect, dealing {N} damage over {N} seconds',
  },
  // Privacy Field deals +4 damage to all melee attackers, and the first melee attacker is knocked away
  {
    powerId: 'power_27152',
    name: 'PrivacyFieldKnockback',
    target: { abilities: ['Privacy Field'] },
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
    ],
    template: 'Privacy Field deals +{N} damage to all melee attackers, and the first melee attacker is knocked away',
  },
  // While Privacy Field is active, melee attacks that damage you have a 75% chance to restore 3 Power to you
  {
    powerId: 'power_27153',
    name: 'PrivacyFieldPower',
    target: 'self',
    effects: [
      { type: 'restore', valuePattern: /(?:restores?|heals? you for) (\d+) Power/, resourceType: 'Power' },
    ],
    template: 'While Privacy Field is active, melee attacks that damage you have a {N}% chance to restore {N} Power to you',
  },
  // Stun Trap deals +10 damage to all nearby targets (when it activates)
  {
    powerId: 'power_27131',
    name: 'StunTrapBoost',
    target: { abilities: ['Stun Trap'] },
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
    ],
    template: 'Stun Trap deals +{N} damage to all nearby targets (when it activates)',
  },
  // Stun Trap deals +5% damage to all nearby targets (when it activates)
  {
    powerId: 'power_27132',
    name: 'StunTrapBoost2',
    target: { abilities: ['Stun Trap'] },
    effects: [
      { type: 'percentDamage', valuePattern: /damage[^]*?\+(\d+)%/ },
    ],
    template: 'Stun Trap deals +{N}% damage to all nearby targets (when it activates)',
  },
  // Stun Trap deals +5 damage, and there's a 50% chance you'll place an extra trap
  {
    powerId: 'power_27134',
    name: 'StunTrapExtraA',
    target: { abilities: ['Stun Trap'] },
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
    ],
    template: 'Stun Trap deals +{N} damage, and there\'s a {N}% chance you\'ll place an extra trap',
  },
  // Stun Trap deals +5 damage, and there's a 50% chance you'll place an extra trap
  {
    powerId: 'power_27135',
    name: 'StunTrapExtraB',
    target: { abilities: ['Stun Trap'] },
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
    ],
    template: 'Stun Trap deals +{N} damage, and there\'s a {N}% chance you\'ll place an extra trap',
  },
  // Stun Trap reuse timer is 1 second faster
  {
    powerId: 'power_27133',
    name: 'StunTrapFaster',
    target: { abilities: ['Stun Trap'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Stun Trap reuse timer is {N} second faster',
  },
  // Indirect Nature and Indirect Electricity damage is +5% per tick while Warden skill active
  {
    powerId: 'power_27013',
    name: 'WardenNatureElectricityMod',
    target: { abilities: ['Indirect Nature', 'Indirect Electricity'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Indirect Nature and Indirect Electricity damage is +{N}% per tick while Warden skill active',
  },
  // Indirect Poison and Indirect Trauma damage is +5% per tick while Warden skill active
  {
    powerId: 'power_27012',
    name: 'WardenPoisonTraumaMod',
    target: { abilities: ['Indirect Poison', 'Indirect Trauma'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Indirect Poison and Indirect Trauma damage is +{N}% per tick while Warden skill active',
  },
  // Warning Jolt restores 1 Armor and taunts +25
  {
    powerId: 'power_27032',
    name: 'WarningJoltArmorAndAggro',
    target: { abilities: ['Warning Jolt'] },
    effects: [
      { type: 'restore', valuePattern: /(?:restores?|heals? you for) (\d+) Armor/, resourceType: 'Armor' },
    ],
    template: 'Warning Jolt restores {N} Armor and taunts +{N}',
  },
  // Warning Jolt restores 1 Armor and boosts the damage of your Core Attacks +4 for 8 seconds
  {
    powerId: 'power_27033',
    name: 'WarningJoltBoostCore',
    target: { abilities: ['Warning Jolt'] },
    effects: [
      { type: 'restore', valuePattern: /(?:restores?|heals? you for) (\d+) Armor/, resourceType: 'Armor' },
    ],
    template: 'Warning Jolt restores {N} Armor and boosts the damage of your Core Attacks +{N} for {N} seconds',
  },
  // Warning Jolt taunts +25 and causes the target to suffer +1% damage from future Electricity attacks for 15 seconds
  {
    powerId: 'power_27034',
    name: 'WarningJoltDebuff',
    target: 'self',
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Warning Jolt taunts +{N} and causes the target to suffer +{N}% damage from future Electricity attacks for {N} seconds',
  },
  // Warning Jolt restores 1 Power, and ability range is increased 5 meters
  {
    powerId: 'power_27031',
    name: 'WarningJoltPowerAndRange',
    target: { abilities: ['Warning Jolt'] },
    effects: [
      { type: 'restore', valuePattern: /(?:restores?|heals? you for) (\d+) Power/, resourceType: 'Power' },
    ],
    template: 'Warning Jolt restores {N} Power, and ability range is increased {N} meters',
  },
];
