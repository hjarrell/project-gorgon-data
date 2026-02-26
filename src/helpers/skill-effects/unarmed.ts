import type { PowerEffectConfig } from './types';

export const UNARMED_EFFECTS: PowerEffectConfig[] = [
  // Barrage hits all enemies within 5 meters and deals +2% damage, but reuse timer is +3 seconds
  {
    powerId: 'power_3041',
    name: 'BarrageAoE',
    target: { abilities: ['Barrage hits all enemies within 5 meters and'] },
    effects: [
      { type: 'percentDamage', valuePattern: /damage[^]*?\+(\d+)%/ },
      { type: 'aoeDelta', valuePattern: /(?:within|targets within) (\d+) meters/ },
    ],
    template: 'Barrage hits all enemies within {N} meters and deals +{N}% damage, but reuse timer is +{N} seconds',
  },
  // Barrage costs -1 Power and restores 3 Armor to you
  {
    powerId: 'power_3047',
    name: 'BarrageHealArmor',
    target: { abilities: ['Barrage costs -1 Power and'] },
    effects: [
      { type: 'restore', valuePattern: /(?:restores?|heals? you for) (\d+) Armor/, resourceType: 'Armor' },
    ],
    template: 'Barrage costs {N} Power and restores {N} Armor to you',
  },
  // Barrage and Headbutt ignite the target, causing them to take 32 Fire damage over 8 seconds
  {
    powerId: 'power_3045',
    name: 'BarrageIgnite',
    target: { abilities: ['Barrage', 'Headbutt'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Barrage and Headbutt ignite the target, causing them to take {N} Fire damage over {N} seconds',
  },
  // Barrage and Headbutt make the target 5% more vulnerable to Psychic damage for 20 seconds (this effect does not stack with itself)
  {
    powerId: 'power_3042',
    name: 'BarragePsiVuln',
    target: { abilities: ['Barrage', 'Headbutt make the target 5% more vulnerable to Psychic'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Barrage and Headbutt make the target {N}% more vulnerable to Psychic damage for {N} seconds (this effect does not stack with itself)',
  },
  // Bodyslam deals +60 damage to non-Elite enemies
  {
    powerId: 'power_3134',
    name: 'BodyslamBoostNonElites',
    target: { abilities: ['Bodyslam'] },
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
    ],
    template: 'Bodyslam deals +{N} damage to non-Elite enemies',
  },
  // Bodyslam heals you for 10 health
  {
    powerId: 'power_3135',
    name: 'BodyslamHeal',
    target: { abilities: ['Bodyslam'] },
    effects: [
      { type: 'restore', valuePattern: /(?:restores?|heals? you for) (\d+) health/, resourceType: 'health' },
    ],
    template: 'Bodyslam heals you for {N} health',
  },
  // Bodyslam deals +10 damage and grants you immunity to direct damage for 3 seconds
  {
    powerId: 'power_3132',
    name: 'BodyslamImmunity',
    target: { abilities: ['Bodyslam'] },
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
    ],
    template: 'Bodyslam deals +{N} damage and grants you immunity to direct damage for {N} seconds',
  },
  // Bruising Blow hastens the current reuse timer of Bodyslam by 1 second
  {
    powerId: 'power_3252',
    name: 'BruisingBlowBodyslamReset',
    target: { abilities: ['Bruising Blow hastens the current'] },
    effects: [
      { type: 'cooldownDelta', valuePattern: /by (\d+) seconds?/ },
    ],
    template: 'Bruising Blow hastens the current reuse timer of Bodyslam by {N} second',
  },
  // Bruising Blow causes the target to take +3% damage from Poison for 20 seconds
  {
    powerId: 'power_3133',
    name: 'BruisingBlowBoostPoison',
    target: { abilities: ['Bruising Blow causes the target to take +3%'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Bruising Blow causes the target to take +{N}% damage from Poison for {N} seconds',
  },
  // Bruising Blow and Headbutt restore 2 Health
  {
    powerId: 'power_3253',
    name: 'BruisingBlowHeal',
    target: { abilities: ['Bruising Blow', 'Headbutt'] },
    effects: [
      { type: 'restore', valuePattern: /(?:restores?|heals? you for) (\d+) Health/, resourceType: 'Health' },
    ],
    template: 'Bruising Blow and Headbutt restore {N} Health',
  },
  // Bruising Blow deals Trauma damage instead of Crushing, and targets suffer +5% damage from other Trauma attacks for 20 seconds
  {
    powerId: 'power_3254',
    name: 'BruisingBlowTrauma',
    target: { abilities: ['Bruising Blow'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Bruising Blow deals Trauma damage instead of Crushing, and targets suffer +{N}% damage from other Trauma attacks for {N} seconds',
  },
  // Cobra Strike deals +5 damage and boosts your Melee Evasion +5% for 7 seconds
  {
    powerId: 'power_3204',
    name: 'CobraStrikeEvasion',
    target: { abilities: ['Cobra Strike'] },
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
    ],
    template: 'Cobra Strike deals +{N} damage and boosts your Melee Evasion +{N}% for {N} seconds',
  },
  // Headbutt deals +1% damage and conjures a magical field that mitigates 15% of all physical damage you take for 10 seconds (or until 100 damage is mitigated)
  {
    powerId: 'power_3043',
    name: 'HeadbuttBubble',
    target: { abilities: ['Headbutt'] },
    effects: [
      { type: 'percentDamage', valuePattern: /damage[^]*?\+(\d+)%/ },
    ],
    template: 'Headbutt deals +{N}% damage and conjures a magical field that mitigates {N}% of all physical damage you take for {N} seconds (or until {N} damage is mitigated)',
  },
  // Headbutt and Knee Kick Damage +10
  {
    powerId: 'power_3046',
    name: 'HeadbuttKneeKickDmg',
    target: { abilities: ['Headbutt', 'Knee Kick'] },
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
    ],
    template: 'Headbutt and Knee Kick Damage +{N}',
  },
  // Hip Throw hits all enemies within 8 meters, but Power cost is +20
  {
    powerId: 'power_3084',
    name: 'HipThrowAoE',
    target: 'self',
    effects: [
      { type: 'aoeDelta', valuePattern: /(?:within|targets within) (\d+) meters/ },
    ],
    template: 'Hip Throw hits all enemies within {N} meters, but Power cost is +{N}',
  },
  // Hip Throw and Bodyslam deal +5% damage and generate -20 Rage
  {
    powerId: 'power_3083',
    name: 'HipThrowRageDepletion',
    target: { abilities: ['Hip Throw', 'Bodyslam'] },
    effects: [
      { type: 'percentDamage', valuePattern: /damage[^]*?\+(\d+)%/ },
      { type: 'rageDelta', valuePattern: /(\d+) Rage/ },
    ],
    template: 'Hip Throw and Bodyslam deal +{N}% damage and generate {N} Rage',
  },
  // Hip Throw deals +10 damage, plus bonus Armor-specific damage equal to 15% of the attack's total regular damage
  {
    powerId: 'power_3082',
    name: 'HipThrowRendArmor',
    target: { abilities: ['Hip Throw'] },
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
    ],
    template: 'Hip Throw deals +{N} damage, plus bonus Armor-specific damage equal to {N}% of the attack\'s total regular damage',
  },
  // Infuriating Fist deals +13% damage and taunts +40
  {
    powerId: 'power_3401',
    name: 'InfuriatingFistBoostTaunt',
    target: { abilities: ['Infuriating Fist'] },
    effects: [
      { type: 'percentDamage', valuePattern: /damage[^]*?\+(\d+)%/ },
    ],
    template: 'Infuriating Fist deals +{N}% damage and taunts +{N}',
  },
  // Infuriating Fist taunts +280 and deals 30 Trauma damage over 6 seconds
  {
    powerId: 'power_3402',
    name: 'InfuriatingFistDoT',
    target: { abilities: ['Infuriating Fist taunts +280 and'] },
    effects: [
      { type: 'dot', valuePattern: /deals? \+?(\d+) Trauma damage/, damageType: 'Trauma', duration: 6 },
    ],
    template: 'Infuriating Fist taunts +{N} and deals {N} Trauma damage over {N} seconds',
  },
  // Infuriating Fist damage +8 and for 10 seconds all Elite attacks deal -5% damage to you.
  {
    powerId: 'power_3403',
    name: 'InfuriatingFistEliteMitigation',
    target: { abilities: ['Infuriating Fist'] },
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
    ],
    template: 'Infuriating Fist damage +{N} and for {N} seconds all Elite attacks deal {N}% damage to you.',
  },
  // Infuriating Fist damage +50. Damage becomes Trauma instead of Crushing
  {
    powerId: 'power_3404',
    name: 'InfuriatingFistTrauma',
    target: { abilities: ['Infuriating Fist'] },
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
    ],
    template: 'Infuriating Fist damage +{N}. Damage becomes Trauma instead of Crushing',
  },
  // Kick attacks deal +9% damage when you have 33% or less of your Armor left
  {
    powerId: 'power_3026',
    name: 'KickBoostUnarmored',
    target: { abilities: ['Kick attacks'] },
    effects: [
      { type: 'percentDamage', valuePattern: /damage[^]*?\+(\d+)%/ },
    ],
    template: 'Kick attacks deal +{N}% damage when you have {N}% or less of your Armor left',
  },
  // Kick attacks restore 12 Armor
  {
    powerId: 'power_3022',
    name: 'KickHeal',
    target: { abilities: ['Kick attacks'] },
    effects: [
      { type: 'restore', valuePattern: /(?:restores?|heals? you for) (\d+) Armor/, resourceType: 'Armor' },
    ],
    template: 'Kick attacks restore {N} Armor',
  },
  // Kick attacks deal +4% damage and grant you 1% Physical Damage Reflection for 15 seconds
  {
    powerId: 'power_3023',
    name: 'KickReflect',
    target: { abilities: ['Kick attacks'] },
    effects: [
      { type: 'percentDamage', valuePattern: /damage[^]*?\+(\d+)%/ },
    ],
    template: 'Kick attacks deal +{N}% damage and grant you {N}% Physical Damage Reflection for {N} seconds',
  },
  // While Unarmed skill active: 10% of all Acid, Poison, and Nature damage you take is mitigated and added to the damage done by your next Kick at a 100% rate
  {
    powerId: 'power_3027',
    name: 'KickShieldVsToxins',
    target: { abilities: ['While Unarmed skill active: 10% of all Acid', 'Poison', 'Nature'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'While Unarmed skill active: {N}% of all Acid, Poison, and Nature damage you take is mitigated and added to the damage done by your next Kick at a {N}% rate',
  },
  // Kick attacks deal +5% damage and slow target's movement speed by 45%
  {
    powerId: 'power_3025',
    name: 'KickSlow45',
    target: { abilities: ['Kick attacks'] },
    effects: [
      { type: 'percentDamage', valuePattern: /damage[^]*?\+(\d+)%/ },
    ],
    template: 'Kick attacks deal +{N}% damage and slow target\'s movement speed by {N}%',
  },
  // Mamba Strike boosts your Melee Evasion +5.5% for 10 seconds
  {
    powerId: 'power_3015',
    name: 'MambaStrikeEvasion',
    target: { abilities: ['Mamba Strike'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Mamba Strike boosts your Melee Evasion +{N}% for {N} seconds',
  },
  // Mamba Strike deals +13 Damage and boosts your Melee Evasion +1% for 6 seconds
  {
    powerId: 'power_3016',
    name: 'MambaStrikeEvasionPunch',
    target: { abilities: ['Mamba Strike'] },
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
    ],
    template: 'Mamba Strike deals +{N} Damage and boosts your Melee Evasion +{N}% for {N} seconds',
  },
  // Mamba Strike Reuse Time -0.2 seconds
  {
    powerId: 'power_3013',
    name: 'MambaStrikeFaster',
    target: { abilities: ['Mamba Strike'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Mamba Strike Reuse Time {N} seconds',
  },
  // Mamba Strike and Front Kick damage +12
  {
    powerId: 'power_3014',
    name: 'MambaStrikeFrontKickBoost',
    target: { abilities: ['Mamba Strike', 'Front Kick'] },
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
    ],
    template: 'Mamba Strike and Front Kick damage +{N}',
  },
  // Jab and Infuriating Fist Damage +8
  {
    powerId: 'power_3002',
    name: 'PunchBoost',
    target: { abilities: ['Jab', 'Infuriating Fist'] },
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
    ],
    template: 'Jab and Infuriating Fist Damage +{N}',
  },
  // Punch, Jab, and Infuriating Fist restore 3 Health to you
  {
    powerId: 'power_3003',
    name: 'PunchHeal',
    target: { abilities: ['Punch', 'Jab', 'Infuriating Fist'] },
    effects: [
      { type: 'restore', valuePattern: /(?:restores?|heals? you for) (\d+) Health/, resourceType: 'Health' },
    ],
    template: 'Punch, Jab, and Infuriating Fist restore {N} Health to you',
  },
  // While Unarmed skill is active: 13% of all Darkness and Psychic damage you take is mitigated and added to the damage done by your next Punch, Jab, or Infuriating Fist at a 100% rate
  {
    powerId: 'power_3011',
    name: 'PunchReflectDarkness',
    target: { abilities: ['While Unarmed skill is active: 13% of all Darkness', 'Psychic'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'While Unarmed skill is active: {N}% of all Darkness and Psychic damage you take is mitigated and added to the damage done by your next Punch, Jab, or Infuriating Fist at a {N}% rate',
  },
  // While Unarmed skill is active: 10% of all Slashing, Piercing, and Crushing damage you take is mitigated and added to the damage done by your next Punch, Jab, or Infuriating Fist at a 100% rate
  {
    powerId: 'power_3010',
    name: 'PunchReflectPhysical',
    target: { abilities: ['While Unarmed skill is active: 10% of all Slashing', 'Piercing', 'Crushing'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'While Unarmed skill is active: {N}% of all Slashing, Piercing, and Crushing damage you take is mitigated and added to the damage done by your next Punch, Jab, or Infuriating Fist at a {N}% rate',
  },
  // Cobra Strike and Mamba Strike Damage +6%
  {
    powerId: 'power_3201',
    name: 'SerpentStrikeBoost',
    target: { abilities: ['Cobra Strike', 'Mamba Strike'] },
    effects: [
      { type: 'percentDamage', valuePattern: /damage[^]*?\+(\d+)%/ },
    ],
    template: 'Cobra Strike and Mamba Strike Damage +{N}%',
  },
  // Cobra Strike and Mamba Strike boost your Nice Attack and Signature Debuff ability damage +10 for 7 seconds
  {
    powerId: 'power_3202',
    name: 'SerpentStrikeBoostNiceAndDebuffDmg',
    target: { abilities: ['Cobra Strike', 'Mamba Strike'] },
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
    ],
    template: 'Cobra Strike and Mamba Strike boost your Nice Attack and Signature Debuff ability damage +{N} for {N} seconds',
  },
  // Cobra Strike and Mamba Strike restore 10 Armor to you
  {
    powerId: 'power_3203',
    name: 'SerpentStrikeHealArmor',
    target: { abilities: ['Cobra Strike', 'Mamba Strike'] },
    effects: [
      { type: 'restore', valuePattern: /(?:restores?|heals? you for) (\d+) Armor/, resourceType: 'Armor' },
    ],
    template: 'Cobra Strike and Mamba Strike restore {N} Armor to you',
  },
  // Unarmed Accuracy +5
  {
    powerId: 'power_32161',
    name: 'SharpenedClawAccuracy',
    target: 'self',
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Unarmed Accuracy +{N}',
  },
  // Slashing Strike and Claw Barrage deal +42 Trauma damage over 6 seconds
  {
    powerId: 'power_3302',
    name: 'SlashingStrikeBleed',
    target: { abilities: ['Slashing Strike', 'Claw Barrage'] },
    effects: [
      { type: 'dot', valuePattern: /deals? \+?(\d+) Trauma damage/, damageType: 'Trauma', duration: 6 },
    ],
    template: 'Slashing Strike and Claw Barrage deal +{N} Trauma damage over {N} seconds',
  },
  // Slashing Strike deals +12 damage and worsens the target's Slashing Vulnerability +5% for 60 seconds. (This effect does not stack with itself.)
  {
    powerId: 'power_3306',
    name: 'SlashingStrikeDebuff',
    target: { abilities: ['Slashing Strike'] },
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
    ],
    template: 'Slashing Strike deals +{N} damage and worsens the target\'s Slashing Vulnerability +{N}% for {N} seconds. (This effect does not stack with itself.)',
  },
  // Slashing Strike deals +12 damage and boosts your Melee Evasion +2% for 5 seconds
  {
    powerId: 'power_3303',
    name: 'SlashingStrikeEvasion',
    target: { abilities: ['Slashing Strike'] },
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
    ],
    template: 'Slashing Strike deals +{N} damage and boosts your Melee Evasion +{N}% for {N} seconds',
  },
  // Slashing Strike deals +6% damage and hastens the current reuse timer of Hip Throw by 2 seconds
  {
    powerId: 'power_3304',
    name: 'SlashingStrikeHastenHipThrow',
    target: { abilities: ['Slashing Strike'] },
    effects: [
      { type: 'percentDamage', valuePattern: /damage[^]*?\+(\d+)%/ },
      { type: 'cooldownDelta', valuePattern: /by (\d+) seconds?/ },
    ],
    template: 'Slashing Strike deals +{N}% damage and hastens the current reuse timer of Hip Throw by {N} seconds',
  },
  // Unarmed attacks deal +1 damage and have +1 Accuracy (which cancels out the Evasion that certain monsters have)
  {
    powerId: 'power_3007',
    name: 'UnarmedAccuracy',
    target: { abilities: ['Unarmed attacks'] },
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
    ],
    template: 'Unarmed attacks deal +{N} damage and have +{N} Accuracy (which cancels out the Evasion that certain monsters have)',
  },
  // Unarmed attacks deal +7 Armor damage
  {
    powerId: 'power_3006',
    name: 'UnarmedBoostArmor',
    target: { abilities: ['Unarmed attacks'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Unarmed attacks deal +{N} Armor damage',
  },
  // Unarmed attacks deal +2 damage when you have 33% or less of your Armor left
  {
    powerId: 'power_3005',
    name: 'UnarmedBoostUnarmored',
    target: { abilities: ['Unarmed attacks'] },
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
    ],
    template: 'Unarmed attacks deal +{N} damage when you have {N}% or less of your Armor left',
  },
  // While Unarmed skill is active: any time you Evade an attack, your next attack deals +24 damage
  {
    powerId: 'power_3009',
    name: 'UnarmedEvasiveManeuvers',
    target: 'self',
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
    ],
    template: 'While Unarmed skill is active: any time you Evade an attack, your next attack deals +{N} damage',
  },
  // While Unarmed skill is active: you gain +4% Melee Evasion and any time you Evade a Melee attack you recover 4 Armor
  {
    powerId: 'power_3008',
    name: 'UnarmedMeleeEvasion',
    target: 'self',
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'While Unarmed skill is active: you gain +{N}% Melee Evasion and any time you Evade a Melee attack you recover {N} Armor',
  },
  // Cobra Strike, Mamba Strike, and Slashing Strike deal +5 damage and can be used while stunned. Doing so removes the stun effect from you.
  {
    powerId: 'power_3305',
    name: 'UnarmedStrikeCureStun',
    target: { abilities: ['Cobra Strike', 'Mamba Strike', 'Slashing Strike'] },
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
    ],
    template: 'Cobra Strike, Mamba Strike, and Slashing Strike deal +{N} damage and can be used while stunned. Doing so removes the stun effect from you.',
  },
];
