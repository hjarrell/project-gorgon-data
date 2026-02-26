import type { PowerEffectConfig } from './types';

export const KNIFE_EFFECTS: PowerEffectConfig[] = [
  // Backstab deals an additional 50 Trauma damage over 10 seconds if the target is not focused on you.
  {
    powerId: 'power_16163',
    name: 'BackstabBleed',
    target: { abilities: ['Backstab'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Backstab deals an additional {N} Trauma damage over {N} seconds if the target is not focused on you.',
  },
  // Backstab deals +9% Direct Damage to Elite targets
  {
    powerId: 'power_16164',
    name: 'BackstabElite',
    target: { abilities: ['Backstab'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Backstab deals +{N}% Direct Damage to Elite targets',
  },
  // Backstab deals +18 direct damage. You recover 18 Health (or Armor, if Health is full) over 12 seconds.
  {
    powerId: 'power_16162',
    name: 'BackstabHeal',
    target: { abilities: ['Backstab'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Backstab deals +{N} direct damage. You recover {N} Health (or Armor, if Health is full) over {N} seconds.',
  },
  // Backstab deals +9% Direct Damage if target is stunned
  {
    powerId: 'power_16165',
    name: 'BackstabStunned',
    target: { abilities: ['Backstab'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Backstab deals +{N}% Direct Damage if target is stunned',
  },
  // Blur Cut grants a 10% chance to ignore stuns for 8 seconds
  {
    powerId: 'power_16044',
    name: 'BlurCutBoostStunResist',
    target: 'self',
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Blur Cut grants a {N}% chance to ignore stuns for {N} seconds',
  },
  // Blur Cut boosts Burst Evasion by 10% for 8 seconds
  {
    powerId: 'power_16043',
    name: 'BlurCutBurstEvasion',
    target: { abilities: ['Blur Cut'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Blur Cut boosts Burst Evasion by {N}% for {N} seconds',
  },
  // Blur Cut restores 3 Health
  {
    powerId: 'power_16042',
    name: 'BlurCutHeal',
    target: { abilities: ['Blur Cut'] },
    effects: [
      { type: 'restore', valuePattern: /(?:restores?|heals? you for) (\d+) Health/, resourceType: 'Health' },
    ],
    template: 'Blur Cut restores {N} Health',
  },
  // Blur Cut deals 15 Poison damage over 10 seconds
  {
    powerId: 'power_16041',
    name: 'BlurCutPoison',
    target: { abilities: ['Blur Cut'] },
    effects: [
      { type: 'dot', valuePattern: /deals? \+?(\d+) Poison damage/, damageType: 'Poison', duration: 10 },
    ],
    template: 'Blur Cut deals {N} Poison damage over {N} seconds',
  },
  // Duelist's Slash hits all targets within 8 meters and deals +2 damage
  {
    powerId: 'power_16111',
    name: 'DuelistsSlashAoE',
    target: { abilities: ['Duelist\'s Slash hits all targets within 8 meters and'] },
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
      { type: 'aoeDelta', valuePattern: /(?:within|targets within) (\d+) meters/ },
    ],
    template: 'Duelist\'s Slash hits all targets within {N} meters and deals +{N} damage',
  },
  // Duelist's Slash deals +2 damage and for 12 seconds afterwards all melee Knife abilities can Critically Hit based on your Anatomy skill levels.
  {
    powerId: 'power_16112',
    name: 'DuelistsSlashCrits',
    target: { abilities: ['Duelist\'s Slash'] },
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
    ],
    template: 'Duelist\'s Slash deals +{N} damage and for {N} seconds afterwards all melee Knife abilities can Critically Hit based on your Anatomy skill levels.',
  },
  // Fan of Blades knocks all targets backwards
  {
    powerId: 'power_16242',
    name: 'FanOfBladesKnockback',
    target: 'self',
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Fan of Blades knocks all targets backwards',
  },
  // Fan of Blades deals +3 damage and causes targets to take +6% damage from Poison for 30 seconds
  {
    powerId: 'power_16243',
    name: 'FanOfBladesPoisonPrep',
    target: { abilities: ['Fan of Blades'] },
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
    ],
    template: 'Fan of Blades deals +{N} damage and causes targets to take +{N}% damage from Poison for {N} seconds',
  },
  // Fending Blade deals +7 damage and reduces Rage by 30
  {
    powerId: 'power_16081',
    name: 'FendingBladeDeRage',
    target: { abilities: ['Fending Blade'] },
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
    ],
    template: 'Fending Blade deals +{N} damage and reduces Rage by {N}',
  },
  // Fending Blade restores 3 Health to you and reduces the target's Rage by 20
  {
    powerId: 'power_16082',
    name: 'FendingBladeDerageDelayed',
    target: { abilities: ['Fending Blade'] },
    effects: [
      { type: 'restore', valuePattern: /(?:restores?|heals? you for) (\d+) Health/, resourceType: 'Health' },
    ],
    template: 'Fending Blade restores {N} Health to you and reduces the target\'s Rage by {N}',
  },
  // Fending Blade restores 6 Power
  {
    powerId: 'power_16083',
    name: 'FendingBladePower',
    target: { abilities: ['Fending Blade'] },
    effects: [
      { type: 'restore', valuePattern: /(?:restores?|heals? you for) (\d+) Power/, resourceType: 'Power' },
    ],
    template: 'Fending Blade restores {N} Power',
  },
  // Gut deals an additional 20 Trauma damage over 10 seconds if the target is not focused on you
  {
    powerId: 'power_16141',
    name: 'GutDoT',
    target: { abilities: ['Gut'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Gut deals an additional {N} Trauma damage over {N} seconds if the target is not focused on you',
  },
  // Gut deals +5% direct damage and reuse timer is -1 second
  {
    powerId: 'power_16144',
    name: 'GutFaster',
    target: { abilities: ['Gut'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Gut deals +{N}% direct damage and reuse timer is {N} second',
  },
  // Gut deals +4 direct damage, and if target Is not focused on you it deals +2% Trauma damage over 10 seconds
  {
    powerId: 'power_16143',
    name: 'GutTraumaMod',
    target: { abilities: ['Gut'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Gut deals +{N} direct damage, and if target Is not focused on you it deals +{N}% Trauma damage over {N} seconds',
  },
  // Hamstring Throw deals +5 direct health damage and causes the target to take +5% damage from Trauma for 20 seconds
  {
    powerId: 'power_16203',
    name: 'HamstringThrowDebuff',
    target: { abilities: ['Hamstring Throw'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Hamstring Throw deals +{N} direct health damage and causes the target to take +{N}% damage from Trauma for {N} seconds',
  },
  // Hamstring Throw deals +10 direct health damage
  {
    powerId: 'power_16202',
    name: 'HamstringThrowDirectDmg',
    target: { abilities: ['Hamstring Throw'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Hamstring Throw deals +{N} direct health damage',
  },
  // Fan of Blades, Hamstring Throw, and Surprise Throw deal +6% damage and reuse timer is -1 second
  {
    powerId: 'power_16005',
    name: 'KnifeBoostThrowing',
    target: { abilities: ['Fan of Blades', 'Hamstring Throw', 'Surprise Throw'] },
    effects: [
      { type: 'percentDamage', valuePattern: /damage[^]*?\+(\d+)%/ },
    ],
    template: 'Fan of Blades, Hamstring Throw, and Surprise Throw deal +{N}% damage and reuse timer is {N} second',
  },
  // Knife abilities with 'Cut' in their name cause all Knife abilities WITHOUT 'Cut' in their name to have a 10% chance to deal +20% damage for 10 seconds
  {
    powerId: 'power_16002',
    name: 'KnifeCutCritBoost',
    target: { abilities: ['Knife abilities with \'Cut\' in their name cause all Knife abilities WITHOUT \'Cut\' in their name to have a 10% chance to'] },
    effects: [
      { type: 'percentDamage', valuePattern: /damage[^]*?\+(\d+)%/ },
    ],
    template: 'Knife abilities with \'Cut\' in their name cause all Knife abilities WITHOUT \'Cut\' in their name to have a {N}% chance to deal +{N}% damage for {N} seconds',
  },
  // Knife abilities with 'Cut' in their name leave a Lasting Mark in the target for 30 seconds. When the target dies, each Lasting Mark hastens the active reset time of Backstab by 3 seconds, or if Backstab isn't on your ability bar, you instead recover 24 Power and your next Slice attack deals +35 damage.
  {
    powerId: 'power_16009',
    name: 'KnifeCutHastenBackstab',
    target: 'self',
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
    ],
    template: 'Knife abilities with \'Cut\' in their name leave a Lasting Mark in the target for {N} seconds. When the target dies, each Lasting Mark hastens the active reset time of Backstab by {N} seconds, or if Backstab isn\'t on your ability bar, you instead recover {N} Power and your next Slice attack deals +{N} damage.',
  },
  // When wielding two knives, Knife abilities with 'Cut' in their name deal +5% damage
  {
    powerId: 'power_16008',
    name: 'KnifeDualWieldBoost',
    target: { abilities: ['When wielding two knives', 'Knife abilities with \'Cut\' in their name'] },
    effects: [
      { type: 'percentDamage', valuePattern: /damage[^]*?\+(\d+)%/ },
    ],
    template: 'When wielding two knives, Knife abilities with \'Cut\' in their name deal +{N}% damage',
  },
  // When wielding two knives, all Knife abilities have a 33% chance to restore 3 Power
  {
    powerId: 'power_16004',
    name: 'KnifeDualWieldPower',
    target: 'self',
    effects: [
      { type: 'restore', valuePattern: /(?:restores?|heals? you for) (\d+) Power/, resourceType: 'Power' },
    ],
    template: 'When wielding two knives, all Knife abilities have a {N}% chance to restore {N} Power',
  },
  // All Knife abilities add 4 Crystal Ice to your inventory. Fan of Blades, Hamstring Throw, and Surprise Throw reuse timer is -1 second.
  {
    powerId: 'power_16006',
    name: 'KnifeGenerateCrystalIce',
    target: { skill: 'Knife' },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'All Knife abilities add {N} Crystal Ice to your inventory. Fan of Blades, Hamstring Throw, and Surprise Throw reuse timer is {N} second.',
  },
  // Taunt from Attack Damage -5% and Rage From Attacks -1% while Knife Fighting skill active
  {
    powerId: 'power_16010',
    name: 'KnifeLessTaunt',
    target: { abilities: ['Taunt from Attack'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Taunt from Attack Damage {N}% and Rage From Attacks {N}% while Knife Fighting skill active',
  },
  // Fan of Blades, Hamstring Throw, and Surprise Throw deal +5 damage and can Critically Hit based on your Anatomy skill levels
  {
    powerId: 'power_16007',
    name: 'KnifeThrowingCrits',
    target: { abilities: ['Fan of Blades', 'Hamstring Throw', 'Surprise Throw'] },
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
    ],
    template: 'Fan of Blades, Hamstring Throw, and Surprise Throw deal +{N} damage and can Critically Hit based on your Anatomy skill levels',
  },
  // Marking Cut deals +3 damage and grants +9 Accuracy to your next Knife ability
  {
    powerId: 'power_16024',
    name: 'MarkingCutAccuracy',
    target: { abilities: ['Marking Cut'] },
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
    ],
    template: 'Marking Cut deals +{N} damage and grants +{N} Accuracy to your next Knife ability',
  },
  // Marking Cut causes target to take +5% damage from Trauma attacks for 10 seconds
  {
    powerId: 'power_16022',
    name: 'MarkingCutBleedDebuff',
    target: { abilities: ['Marking Cut causes target to take +5%'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Marking Cut causes target to take +{N}% damage from Trauma attacks for {N} seconds',
  },
  // Marking Cut deals +3 armor damage and does not cause the target to shout for help
  {
    powerId: 'power_16023',
    name: 'MarkingCutSneaky',
    target: { abilities: ['Marking Cut'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Marking Cut deals +{N} armor damage and does not cause the target to shout for help',
  },
  // For 10 seconds after using Opening Thrust, all Knife abilities gain +1 Accuracy and have a 1% chance to deal +25% damage
  {
    powerId: 'power_16013',
    name: 'OpeningThrustAccuracy',
    target: 'self',
    effects: [
      { type: 'percentDamage', valuePattern: /damage[^]*?\+(\d+)%/ },
    ],
    template: 'For {N} seconds after using Opening Thrust, all Knife abilities gain +{N} Accuracy and have a {N}% chance to deal +{N}% damage',
  },
  // For 10 seconds after using Opening Thrust, all knife abilities with 'Cut' in their name deal +6 damage
  {
    powerId: 'power_16012',
    name: 'OpeningThrustBoostCuts',
    target: 'self',
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
    ],
    template: 'For {N} seconds after using Opening Thrust, all knife abilities with \'Cut\' in their name deal +{N} damage',
  },
  // Opening Thrust heals you for 2 health
  {
    powerId: 'power_16011',
    name: 'OpeningThrustHeal',
    target: { abilities: ['Opening Thrust'] },
    effects: [
      { type: 'restore', valuePattern: /(?:restores?|heals? you for) (\d+) health/, resourceType: 'health' },
    ],
    template: 'Opening Thrust heals you for {N} health',
  },
  // Poisoner's Cut has a 50% chance to deal +10% damage
  {
    powerId: 'power_16062',
    name: 'PoisonersCutCrit',
    target: { abilities: ['Poisoner\'s Cut'] },
    effects: [
      { type: 'percentDamage', valuePattern: /damage[^]*?\+(\d+)%/ },
    ],
    template: 'Poisoner\'s Cut has a {N}% chance to deal +{N}% damage',
  },
  // Poisoner's Cut boosts Direct Poison Damage an additional +3 per attack
  {
    powerId: 'power_16065',
    name: 'PoisonersCutDirectPoison',
    target: { abilities: ['Poisoner\'s Cut'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Poisoner\'s Cut boosts Direct Poison Damage an additional +{N} per attack',
  },
  // Poisoner's Cut boosts Indirect Poison Damage an additional +1 per tick
  {
    powerId: 'power_16064',
    name: 'PoisonersCutIndirectPoison',
    target: { abilities: ['Poisoner\'s Cut'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Poisoner\'s Cut boosts Indirect Poison Damage an additional +{N} per tick',
  },
  // Knife Accuracy +5
  {
    powerId: 'power_32121',
    name: 'SharpenedDaggerAccuracy',
    target: 'self',
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Knife Accuracy +{N}',
  },
  // Critical Hit Damage +1%
  {
    powerId: 'power_32122',
    name: 'SharpenedDaggerCritDamage',
    target: { abilities: ['Critical Hit'] },
    effects: [
      { type: 'percentDamage', valuePattern: /damage[^]*?\+(\d+)%/ },
    ],
    template: 'Critical Hit Damage +{N}%',
  },
  // Knife Accuracy +5
  {
    powerId: 'power_32141',
    name: 'SharpenedDirkAccuracy',
    target: 'self',
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Knife Accuracy +{N}',
  },
  // Critical Hit Damage +1%
  {
    powerId: 'power_32142',
    name: 'SharpenedDirkCritDamage',
    target: { abilities: ['Critical Hit'] },
    effects: [
      { type: 'percentDamage', valuePattern: /damage[^]*?\+(\d+)%/ },
    ],
    template: 'Critical Hit Damage +{N}%',
  },
  // Slice ignores mitigation from armor and deals +12 damage
  {
    powerId: 'power_16103',
    name: 'SliceArmor',
    target: { abilities: ['Slice ignores mitigation from armor and'] },
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
    ],
    template: 'Slice ignores mitigation from armor and deals +{N} damage',
  },
  // Slice has a 40% chance to deal +10% damage and restore 10 armor
  {
    powerId: 'power_16102',
    name: 'SliceCrit',
    target: { abilities: ['Slice'] },
    effects: [
      { type: 'percentDamage', valuePattern: /damage[^]*?\+(\d+)%/ },
      { type: 'restore', valuePattern: /(?:restores?|heals? you for) (\d+) armor/, resourceType: 'armor' },
    ],
    template: 'Slice has a {N}% chance to deal +{N}% damage and restore {N} armor',
  },
  // Slice deals +10 damage and causes target to suffer +10 damage from future attacks for 30 seconds
  {
    powerId: 'power_16104',
    name: 'SliceDebuff',
    target: { abilities: ['Slice'] },
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
    ],
    template: 'Slice deals +{N} damage and causes target to suffer +{N} damage from future attacks for {N} seconds',
  },
  // Slice deals 45 Poison damage over 10 seconds
  {
    powerId: 'power_16061',
    name: 'SlicePoison',
    target: { abilities: ['Slice'] },
    effects: [
      { type: 'dot', valuePattern: /deals? \+?(\d+) Poison damage/, damageType: 'Poison', duration: 10 },
    ],
    template: 'Slice deals {N} Poison damage over {N} seconds',
  },
  // Surge Cut deals 25 Trauma damage over 10 seconds
  {
    powerId: 'power_16183',
    name: 'SurgeCutDoT',
    target: { abilities: ['Surge Cut'] },
    effects: [
      { type: 'dot', valuePattern: /deals? \+?(\d+) Trauma damage/, damageType: 'Trauma', duration: 10 },
    ],
    template: 'Surge Cut deals {N} Trauma damage over {N} seconds',
  },
  // Surge Cut restores +3 Health to you
  {
    powerId: 'power_16181',
    name: 'SurgeCutHeal',
    target: { abilities: ['Surge Cut'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Surge Cut restores +{N} Health to you',
  },
  // Surge Cut restores 4 Power to you
  {
    powerId: 'power_16182',
    name: 'SurgeCutPower',
    target: { abilities: ['Surge Cut'] },
    effects: [
      { type: 'restore', valuePattern: /(?:restores?|heals? you for) (\d+) Power/, resourceType: 'Power' },
    ],
    template: 'Surge Cut restores {N} Power to you',
  },
  // Surprise Throw boosts your Epic Attack Damage +16 for 30 seconds if the target is not focused on you
  {
    powerId: 'power_16224',
    name: 'SurpriseThrowBoostEpic',
    target: { abilities: ['Surprise Throw'] },
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
    ],
    template: 'Surprise Throw boosts your Epic Attack Damage +{N} for {N} seconds if the target is not focused on you',
  },
  // Surprise Throw restores 4 Power if the target is not focused on you
  {
    powerId: 'power_16223',
    name: 'SurpriseThrowPower',
    target: { abilities: ['Surprise Throw'] },
    effects: [
      { type: 'restore', valuePattern: /(?:restores?|heals? you for) (\d+) Power/, resourceType: 'Power' },
    ],
    template: 'Surprise Throw restores {N} Power if the target is not focused on you',
  },
  // Surprise Throw deals +5 damage and stuns the target if they are not focused on you
  {
    powerId: 'power_16222',
    name: 'SurpriseThrowStun',
    target: { abilities: ['Surprise Throw'] },
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
    ],
    template: 'Surprise Throw deals +{N} damage and stuns the target if they are not focused on you',
  },
  // Venomstrike deals +5 damage and has a 31% chance to stun the target
  {
    powerId: 'power_16123',
    name: 'VenomstrikeCritStun',
    target: { abilities: ['Venomstrike'] },
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
    ],
    template: 'Venomstrike deals +{N} damage and has a {N}% chance to stun the target',
  },
  // Venomstrike deals an additional 60 Poison damage over 10 seconds
  {
    powerId: 'power_16122',
    name: 'VenomstrikeMoreDoT',
    target: { abilities: ['Venomstrike'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Venomstrike deals an additional {N} Poison damage over {N} seconds',
  },
];
