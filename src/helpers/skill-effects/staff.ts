import type { PowerEffectConfig } from './types';

export const STAFF_EFFECTS: PowerEffectConfig[] = [
  // Blocking Stance boosts your Cold Damage +3% for 30 seconds
  {
    powerId: 'power_5039',
    name: 'BlockingStanceBoostCold',
    target: { abilities: ['Blocking Stance'] },
    effects: [
      { type: 'percentDamage', valuePattern: /damage[^]*?\+(\d+)%/ },
    ],
    template: 'Blocking Stance boosts your Cold Damage +{N}% for {N} seconds',
  },
  // For 60 seconds after using Blocking Stance, First Aid heals you +11
  {
    powerId: 'power_5124',
    name: 'BlockingStanceBoostHealthKit',
    target: { abilities: ['For 60 seconds after using Blocking Stance', 'First Aid'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'For {N} seconds after using Blocking Stance, First Aid heals you +{N}',
  },
  // Blocking Stance mitigates +2 physical damage (Crushing, Slashing, Piercing) for 30 seconds. Against Elite enemies, mitigates +2 more
  {
    powerId: 'power_5125',
    name: 'BlockingStanceBuff',
    target: { abilities: ['Blocking Stance mitigates +2 physical'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Blocking Stance mitigates +{N} physical damage (Crushing, Slashing, Piercing) for {N} seconds. Against Elite enemies, mitigates +{N} more',
  },
  // Blocking Stance increases your Max Health +6 for 30 seconds (and heals you for 6)
  {
    powerId: 'power_5122',
    name: 'BlockingStanceMaxHealth',
    target: { abilities: ['Blocking Stance increases your Max Health +6 for 30 seconds (and'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Blocking Stance increases your Max Health +{N} for {N} seconds (and heals you for {N})',
  },
  // Blocking Stance boosts your Psychic Damage +3% for 30 seconds
  {
    powerId: 'power_5123',
    name: 'BlockingStancePsionicsBoost',
    target: { abilities: ['Blocking Stance'] },
    effects: [
      { type: 'percentDamage', valuePattern: /damage[^]*?\+(\d+)%/ },
    ],
    template: 'Blocking Stance boosts your Psychic Damage +{N}% for {N} seconds',
  },
  // Deflective Spin damage +5. Targets' next attack deals -10% damage
  {
    powerId: 'power_5092',
    name: 'DeflectiveSpinDmg',
    target: { abilities: ['Deflective Spin'] },
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
    ],
    template: 'Deflective Spin damage +{N}. Targets\' next attack deals {N}% damage',
  },
  // Deflective Spin restores 6 Health instantly and provides +10 Mitigation from all Elite attacks for 10 seconds
  {
    powerId: 'power_5093',
    name: 'DeflectiveSpinHeal',
    target: { abilities: ['Deflective Spin'] },
    effects: [
      { type: 'restore', valuePattern: /(?:restores?|heals? you for) (\d+) Health/, resourceType: 'Health' },
    ],
    template: 'Deflective Spin restores {N} Health instantly and provides +{N} Mitigation from all Elite attacks for {N} seconds',
  },
  // Deflective Spin gives you +3% Projectile Evasion for 15 seconds
  {
    powerId: 'power_5094',
    name: 'DeflectiveSpinProjectileEvasion',
    target: 'self',
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Deflective Spin gives you +{N}% Projectile Evasion for {N} seconds',
  },
  // Deflective Spin heals 45 Health over 15 seconds
  {
    powerId: 'power_5091',
    name: 'DeflectiveSpinRegen',
    target: { abilities: ['Deflective Spin'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Deflective Spin heals {N} Health over {N} seconds',
  },
  // Double Hit causes your next attack to deal +15 damage if it is a Crushing attack
  {
    powerId: 'power_5007',
    name: 'DoubleHitCrushingBoost',
    target: { abilities: ['Double Hit causes your next attack to'] },
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
    ],
    template: 'Double Hit causes your next attack to deal +{N} damage if it is a Crushing attack',
  },
  // Double Hit costs -2 Power and makes the target 3% more vulnerable to direct Fire and Cold damage for 8 seconds
  {
    powerId: 'power_5035',
    name: 'DoubleHitFireColdVuln',
    target: 'self',
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Double Hit costs {N} Power and makes the target {N}% more vulnerable to direct Fire and Cold damage for {N} seconds',
  },
  // Double Hit ignites the target, dealing 18 Fire damage over 12 seconds
  {
    powerId: 'power_5038',
    name: 'DoubleHitFireDoT',
    target: { abilities: ['Double Hit'] },
    effects: [
      { type: 'dot', valuePattern: /dealing (\d+) Fire damage/, damageType: 'Fire', duration: 12 },
    ],
    template: 'Double Hit ignites the target, dealing {N} Fire damage over {N} seconds',
  },
  // Double Hit deals +6% damage and hastens the current reuse timer of Headcracker by 1 second
  {
    powerId: 'power_5040',
    name: 'DoubleHitHastenHeadcracker',
    target: { abilities: ['Double Hit'] },
    effects: [
      { type: 'percentDamage', valuePattern: /damage[^]*?\+(\d+)%/ },
      { type: 'cooldownDelta', valuePattern: /by (\d+) seconds?/ },
    ],
    template: 'Double Hit deals +{N}% damage and hastens the current reuse timer of Headcracker by {N} second',
  },
  // Headcracker deals +5 damage, generates no Rage, and reduces Rage by 10
  {
    powerId: 'power_5302',
    name: 'HeadcrackerDeRage',
    target: { abilities: ['Headcracker'] },
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
    ],
    template: 'Headcracker deals +{N} damage, generates no Rage, and reduces Rage by {N}',
  },
  // After using Headcracker, you take -50% damage from Psychic attacks for 5 seconds
  {
    powerId: 'power_5303',
    name: 'HeadcrackerMitigation',
    target: 'self',
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'After using Headcracker, you take {N}% damage from Psychic attacks for {N} seconds',
  },
  // Headcracker and Strategic Thrust deal +3% damage and reuse timer is -1 second
  {
    powerId: 'power_5036',
    name: 'HeadcrackerStrategicThrustFaster',
    target: { abilities: ['Headcracker', 'Strategic Thrust'] },
    effects: [
      { type: 'percentDamage', valuePattern: /damage[^]*?\+(\d+)%/ },
    ],
    template: 'Headcracker and Strategic Thrust deal +{N}% damage and reuse timer is {N} second',
  },
  // Heed The Stick heals you for 5 health (or armor if health is full)
  {
    powerId: 'power_5253',
    name: 'HeedTheStickHeal',
    target: { abilities: ['Heed The Stick'] },
    effects: [
      { type: 'restore', valuePattern: /(?:restores?|heals? you for) (\d+) health/, resourceType: 'health' },
    ],
    template: 'Heed The Stick heals you for {N} health (or armor if health is full)',
  },
  // Heed The Stick gives you +5 mitigation from direct attacks for 10 seconds
  {
    powerId: 'power_5254',
    name: 'HeedTheStickMitigation',
    target: 'self',
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Heed The Stick gives you +{N} mitigation from direct attacks for {N} seconds',
  },
  // Heed The Stick deals +1% Damage and Taunts +60
  {
    powerId: 'power_5252',
    name: 'HeedTheStickTaunt',
    target: { abilities: ['Heed The Stick'] },
    effects: [
      { type: 'percentDamage', valuePattern: /damage[^]*?\+(\d+)%/ },
    ],
    template: 'Heed The Stick deals +{N}% Damage and Taunts +{N}',
  },
  // Lunge hits all enemies within 7 meters and deals +25 damage to health and armor, but reuse timer is +2 seconds
  {
    powerId: 'power_5062',
    name: 'LungeAoE',
    target: { abilities: ['Lunge hits all enemies within 7 meters and'] },
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
      { type: 'aoeDelta', valuePattern: /(?:within|targets within) (\d+) meters/ },
    ],
    template: 'Lunge hits all enemies within {N} meters and deals +{N} damage to health and armor, but reuse timer is +{N} seconds',
  },
  // Lunge deals +7% damage to health and armor
  {
    powerId: 'power_5061',
    name: 'LungeBoost',
    target: { abilities: ['Lunge'] },
    effects: [
      { type: 'percentDamage', valuePattern: /damage[^]*?\+(\d+)%/ },
    ],
    template: 'Lunge deals +{N}% damage to health and armor',
  },
  // Lunge causes the next attack that hits you to deal 10 less damage
  {
    powerId: 'power_5066',
    name: 'LungeBoostMitigation',
    target: { abilities: ['Lunge causes the next attack that hits you to'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Lunge causes the next attack that hits you to deal {N} less damage',
  },
  // Lunge deals +2 damage and knocks the target backwards
  {
    powerId: 'power_5065',
    name: 'LungeKnockback',
    target: { abilities: ['Lunge'] },
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
    ],
    template: 'Lunge deals +{N} damage and knocks the target backwards',
  },
  // Phoenix Strike deals +10% damage and triggers the target's Vulnerability
  {
    powerId: 'power_5402',
    name: 'PhoenixStrikeActivateVulnerability',
    target: { abilities: ['Phoenix Strike'] },
    effects: [
      { type: 'percentDamage', valuePattern: /damage[^]*?\+(\d+)%/ },
    ],
    template: 'Phoenix Strike deals +{N}% damage and triggers the target\'s Vulnerability',
  },
  // Phoenix Strike costs -1 Power and boosts your Direct Fire Damage +5% for 30 seconds
  {
    powerId: 'power_5006',
    name: 'PhoenixStrikeBoostFire',
    target: { abilities: ['Phoenix Strike costs -1 Power and'] },
    effects: [
      { type: 'percentDamage', valuePattern: /damage[^]*?\+(\d+)%/ },
    ],
    template: 'Phoenix Strike costs {N} Power and boosts your Direct Fire Damage +{N}% for {N} seconds',
  },
  // For 30 seconds after using Phoenix Strike, your Survival Utility and Major Heal abilities restore 35 Health to you
  {
    powerId: 'power_5401',
    name: 'PhoenixStrikeBoostSurvivalUtilities',
    target: 'self',
    effects: [
      { type: 'restore', valuePattern: /(?:restores?|heals? you for) (\d+) Health/, resourceType: 'Health' },
    ],
    template: 'For {N} seconds after using Phoenix Strike, your Survival Utility and Major Heal abilities restore {N} Health to you',
  },
  // Phoenix Strike deals +5% Fire damage to melee attackers, and ability reuse timer is -4 seconds
  {
    powerId: 'power_5033',
    name: 'PhoenixStrikeFaster',
    target: { abilities: ['Phoenix Strike'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Phoenix Strike deals +{N}% Fire damage to melee attackers, and ability reuse timer is {N} seconds',
  },
  // Phoenix Strike deals +63 Fire damage to melee attackers
  {
    powerId: 'power_5034',
    name: 'PhoenixStrikeReflect',
    target: { abilities: ['Phoenix Strike'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Phoenix Strike deals +{N} Fire damage to melee attackers',
  },
  // Pin deals +10 damage and has +3 Accuracy (which cancels out the Evasion that certain monsters have)
  {
    powerId: 'power_5121',
    name: 'PinAccuracy',
    target: { abilities: ['Pin'] },
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
    ],
    template: 'Pin deals +{N} damage and has +{N} Accuracy (which cancels out the Evasion that certain monsters have)',
  },
  // Pin boosts Core Attack and Nice Attack Damage +8 for 15 seconds
  {
    powerId: 'power_5009',
    name: 'PinBoostCoreAndNice',
    target: { abilities: ['Pin'] },
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
    ],
    template: 'Pin boosts Core Attack and Nice Attack Damage +{N} for {N} seconds',
  },
  // Pin causes target's attacks to deal -10% damage for 5 seconds
  {
    powerId: 'power_5353',
    name: 'PinDebuff',
    target: { abilities: ['Pin causes target\'s attacks to'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Pin causes target\'s attacks to deal {N}% damage for {N} seconds',
  },
  // Pin generates no Rage and reduces Rage by 50
  {
    powerId: 'power_5352',
    name: 'PinDeRage',
    target: 'self',
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Pin generates no Rage and reduces Rage by {N}',
  },
  // Pin heals you for 10 health
  {
    powerId: 'power_5008',
    name: 'PinHeal',
    target: { abilities: ['Pin'] },
    effects: [
      { type: 'restore', valuePattern: /(?:restores?|heals? you for) (\d+) health/, resourceType: 'health' },
    ],
    template: 'Pin heals you for {N} health',
  },
  // Redirect causes target to bleed, dealing 40 Trauma damage over 8 seconds
  {
    powerId: 'power_5063',
    name: 'RedirectBleed',
    target: 'self',
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Redirect causes target to bleed, dealing {N} Trauma damage over {N} seconds',
  },
  // For 60 seconds after using Redirect, First Aid heals you +15
  {
    powerId: 'power_5152',
    name: 'RedirectBoostHealthKit',
    target: { abilities: ['For 60 seconds after using Redirect', 'First Aid'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'For {N} seconds after using Redirect, First Aid heals you +{N}',
  },
  // Redirect generates no Rage, reduces Rage by 100, and taunts -105
  {
    powerId: 'power_5153',
    name: 'RedirectDetaunt',
    target: 'self',
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Redirect generates no Rage, reduces Rage by {N}, and taunts {N}',
  },
  // Redirect deals +3 damage and stuns the target
  {
    powerId: 'power_5154',
    name: 'RedirectStun',
    target: { abilities: ['Redirect'] },
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
    ],
    template: 'Redirect deals +{N} damage and stuns the target',
  },
  // Smash, Double Hit, and Heed The Stick Damage +5
  {
    powerId: 'power_5003',
    name: 'SmashDoubleHitAndHeedTheStickBoost',
    target: { abilities: ['Smash', 'Double Hit', 'Heed The Stick'] },
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
    ],
    template: 'Smash, Double Hit, and Heed The Stick Damage +{N}',
  },
  // All Staff attacks have a 1.75% chance to trigger the target's Vulnerability
  {
    powerId: 'power_5005',
    name: 'StaffVulnChance',
    target: { skill: 'Staff' },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'All Staff attacks have a {N}% chance to trigger the target\'s Vulnerability',
  },
  // Strategic Thrust and Lunge Damage +10%
  {
    powerId: 'power_5202',
    name: 'StrategicThrustAndLungeBoost',
    target: { abilities: ['Strategic Thrust', 'Lunge'] },
    effects: [
      { type: 'percentDamage', valuePattern: /damage[^]*?\+(\d+)%/ },
    ],
    template: 'Strategic Thrust and Lunge Damage +{N}%',
  },
  // Strategic Thrust deals +10% damage, plus 25% more damage if the target is Vulnerable
  {
    powerId: 'power_5201',
    name: 'StrategicThrustBoost',
    target: { abilities: ['Strategic Thrust'] },
    effects: [
      { type: 'percentDamage', valuePattern: /damage[^]*?\+(\d+)%/ },
    ],
    template: 'Strategic Thrust deals +{N}% damage, plus {N}% more damage if the target is Vulnerable',
  },
  // If Strategic Thrust is used on a Vulnerable target, it deals +8 damage and restores 5 Health to you
  {
    powerId: 'power_5203',
    name: 'StrategicThrustVulnHeal',
    target: 'self',
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
      { type: 'restore', valuePattern: /(?:restores?|heals? you for) (\d+) Health/, resourceType: 'Health' },
    ],
    template: 'If Strategic Thrust is used on a Vulnerable target, it deals +{N} damage and restores {N} Health to you',
  },
  // Suppress and Deflective Spin Damage +7%
  {
    powerId: 'power_5037',
    name: 'SuppressAndDeflectiveSpinBoost',
    target: { abilities: ['Suppress', 'Deflective Spin'] },
    effects: [
      { type: 'percentDamage', valuePattern: /damage[^]*?\+(\d+)%/ },
    ],
    template: 'Suppress and Deflective Spin Damage +{N}%',
  },
  // Suppress deals +7% damage and causes targets to lose an additional 25 Rage
  {
    powerId: 'power_5452',
    name: 'SuppressDeRage',
    target: { abilities: ['Suppress'] },
    effects: [
      { type: 'percentDamage', valuePattern: /damage[^]*?\+(\d+)%/ },
      { type: 'rageDelta', valuePattern: /(\d+) Rage/ },
    ],
    template: 'Suppress deals +{N}% damage and causes targets to lose an additional {N} Rage',
  },
  // Suppress heals you for 15 health
  {
    powerId: 'power_5434',
    name: 'SuppressHeal',
    target: { abilities: ['Suppress'] },
    effects: [
      { type: 'restore', valuePattern: /(?:restores?|heals? you for) (\d+) health/, resourceType: 'health' },
    ],
    template: 'Suppress heals you for {N} health',
  },
  // Suppress and Heed the Stick have +7 Accuracy
  {
    powerId: 'power_5010',
    name: 'SuppressHeedAccuracy',
    target: 'self',
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Suppress and Heed the Stick have +{N} Accuracy',
  },
  // Combo: Suppress+Any Melee+Any Melee+Headcracker: final step stuns the target while dealing +10 damage.
  {
    powerId: 'power_5453',
    name: 'SuppressStunCombo',
    target: { abilities: ['Combo: Suppress+Any Melee+Any Melee+Headcracker: final step stuns the target while dealing +10'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Combo: Suppress+Any Melee+Any Melee+Headcracker: final step stuns the target while dealing +{N} damage.',
  },
];
