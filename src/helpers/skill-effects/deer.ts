import type { PowerEffectConfig } from './types';

export const DEER_EFFECTS: PowerEffectConfig[] = [
  // Antler Slash hits all enemies within 5 meters and taunts +20
  {
    powerId: 'power_21302',
    name: 'AntlerSlashAoE',
    target: 'self',
    effects: [
      { type: 'aoeDelta', valuePattern: /(?:within|targets within) (\d+) meters/ },
    ],
    template: 'Antler Slash hits all enemies within {N} meters and taunts +{N}',
  },
  // Antler Slash heals you for 1 health
  {
    powerId: 'power_21303',
    name: 'AntlerSlashHeal',
    target: { abilities: ['Antler Slash'] },
    effects: [
      { type: 'restore', valuePattern: /(?:restores?|heals? you for) (\d+) health/, resourceType: 'health' },
    ],
    template: 'Antler Slash heals you for {N} health',
  },
  // Antler Slash restores 1 power to you
  {
    powerId: 'power_21301',
    name: 'AntlerSlashHealPower',
    target: { abilities: ['Antler Slash'] },
    effects: [
      { type: 'restore', valuePattern: /(?:restores?|heals? you for) (\d+) power/, resourceType: 'power' },
    ],
    template: 'Antler Slash restores {N} power to you',
  },
  // Bounding Escape heals you for 5 health
  {
    powerId: 'power_21251',
    name: 'BoundingEscapeHeal',
    target: { abilities: ['Bounding Escape'] },
    effects: [
      { type: 'restore', valuePattern: /(?:restores?|heals? you for) (\d+) health/, resourceType: 'health' },
    ],
    template: 'Bounding Escape heals you for {N} health',
  },
  // Bounding Escape restores 5 armor to you
  {
    powerId: 'power_21252',
    name: 'BoundingEscapeHealArmor',
    target: { abilities: ['Bounding Escape'] },
    effects: [
      { type: 'restore', valuePattern: /(?:restores?|heals? you for) (\d+) armor/, resourceType: 'armor' },
    ],
    template: 'Bounding Escape restores {N} armor to you',
  },
  // Bounding Escape restores 3 power to you
  {
    powerId: 'power_21253',
    name: 'BoundingEscapeHealPower',
    target: { abilities: ['Bounding Escape'] },
    effects: [
      { type: 'restore', valuePattern: /(?:restores?|heals? you for) (\d+) power/, resourceType: 'power' },
    ],
    template: 'Bounding Escape restores {N} power to you',
  },
  // Bounding Escape grants you +7% Projectile Evasion for 10 seconds
  {
    powerId: 'power_21254',
    name: 'BoundingEscapeRangedEvasion',
    target: 'self',
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Bounding Escape grants you +{N}% Projectile Evasion for {N} seconds',
  },
  // Bounding Escape dispels any active Slow or Root effects on you and grants you immunity to similar effects for 6 seconds
  {
    powerId: 'power_21255',
    name: 'BoundingEscapeSlowImmunity',
    target: 'self',
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Bounding Escape dispels any active Slow or Root effects on you and grants you immunity to similar effects for {N} seconds',
  },
  // Cuteness Overload deals 48 Psychic health damage over 12 seconds
  {
    powerId: 'power_21066',
    name: 'CutenessOverloadDoT',
    target: { abilities: ['Cuteness Overload'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Cuteness Overload deals {N} Psychic health damage over {N} seconds',
  },
  // Cuteness Overload restores 15 armor to you
  {
    powerId: 'power_21065',
    name: 'CutenessOverloadHealArmor',
    target: { abilities: ['Cuteness Overload'] },
    effects: [
      { type: 'restore', valuePattern: /(?:restores?|heals? you for) (\d+) armor/, resourceType: 'armor' },
    ],
    template: 'Cuteness Overload restores {N} armor to you',
  },
  // Cuteness Overload deals +8 damage and knocks the target backwards
  {
    powerId: 'power_21067',
    name: 'CutenessOverloadKnockback',
    target: { abilities: ['Cuteness Overload'] },
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
    ],
    template: 'Cuteness Overload deals +{N} damage and knocks the target backwards',
  },
  // Cuteness Overload heals you for 8 health and increases your movement speed by +1 for 8 seconds
  {
    powerId: 'power_21062',
    name: 'CutenessOverloadSpeedBurst',
    target: { abilities: ['Cuteness Overload'] },
    effects: [
      { type: 'restore', valuePattern: /(?:restores?|heals? you for) (\d+) health/, resourceType: 'health' },
    ],
    template: 'Cuteness Overload heals you for {N} health and increases your movement speed by +{N} for {N} seconds',
  },
  // Deer Bash deals +5 damage and has a 20% chance to deal +20% more damage
  {
    powerId: 'power_21023',
    name: 'DeerBashCrit',
    target: { abilities: ['Deer Bash'] },
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
    ],
    template: 'Deer Bash deals +{N} damage and has a {N}% chance to deal +{N}% more damage',
  },
  // Deer Bash heals 3 health
  {
    powerId: 'power_21024',
    name: 'DeerBashHeal',
    target: { abilities: ['Deer Bash'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Deer Bash heals {N} health',
  },
  // Deer Bash has a 1% chance to summon a deer ally for 30 seconds
  {
    powerId: 'power_21021',
    name: 'DeerBashSummon',
    target: { abilities: ['Deer Bash'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Deer Bash has a {N}% chance to summon a deer ally for {N} seconds',
  },
  // Burst Evasion +1% while Deer skill active
  {
    powerId: 'power_21102',
    name: 'DeerBurstEvasion',
    target: 'self',
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Burst Evasion +{N}% while Deer skill active',
  },
  // Combo: Deer Bash+Any Melee+Deer Kick: final step hits all enemies within 5 meters and deals +30 damage.
  {
    powerId: 'power_21003',
    name: 'DeerKickAoECombo',
    target: { abilities: ['Combo: Deer Bash+Any Melee+Deer Kick: final step hits all enemies within 5 meters and'] },
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
      { type: 'aoeDelta', valuePattern: /(?:within|targets within) (\d+) meters/ },
    ],
    template: 'Combo: Deer Bash+Any Melee+Deer Kick: final step hits all enemies within {N} meters and deals +{N} damage.',
  },
  // Deer Kick implants insect eggs in the target. (Max 4 stacks.) Future Deer Kicks by any pet deer or player deer will cause target to take 35 Nature damage over 5 seconds
  {
    powerId: 'power_21004',
    name: 'DeerKickBugDoT',
    target: { abilities: ['Deer Kick implants insect eggs in the target. (Max 4 stacks.) Future Deer Kicks by any pet deer or player deer will cause target to take 35 Nature'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Deer Kick implants insect eggs in the target. (Max {N} stacks.) Future Deer Kicks by any pet deer or player deer will cause target to take {N} Nature damage over {N} seconds',
  },
  // Deer Kick implants insect eggs in the target. (Max 4 stacks.) Future Deer Kicks by any pet deer or player deer will cause target to take 35 Nature damage over 5 seconds
  {
    powerId: 'power_21007',
    name: 'DeerKickBugDoTB',
    target: { abilities: ['Deer Kick implants insect eggs in the target. (Max 4 stacks.) Future Deer Kicks by any pet deer or player deer will cause target to take 35 Nature'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Deer Kick implants insect eggs in the target. (Max {N} stacks.) Future Deer Kicks by any pet deer or player deer will cause target to take {N} Nature damage over {N} seconds',
  },
  // Deer Kick deals +5 damage and grants you -10% Fire Vulnerability for 60 seconds
  {
    powerId: 'power_21002',
    name: 'DeerKickFireResist',
    target: { abilities: ['Deer Kick'] },
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
    ],
    template: 'Deer Kick deals +{N} damage and grants you {N}% Fire Vulnerability for {N} seconds',
  },
  // Deer Kick deals +14 damage and reduces target's Rage by -20
  {
    powerId: 'power_21005',
    name: 'DeerKickReduceRage',
    target: { abilities: ['Deer Kick'] },
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
    ],
    template: 'Deer Kick deals +{N} damage and reduces target\'s Rage by {N}',
  },
  // Deer Kick deals +8% damage and taunts +24
  {
    powerId: 'power_21006',
    name: 'DeerKickTaunt',
    target: { abilities: ['Deer Kick'] },
    effects: [
      { type: 'percentDamage', valuePattern: /damage[^]*?\+(\d+)%/ },
    ],
    template: 'Deer Kick deals +{N}% damage and taunts +{N}',
  },
  // Summoned Deer deal +4 damage and have a +1% chance to crit
  {
    powerId: 'power_21202',
    name: 'DeerPetCritBoost',
    target: { abilities: ['Summoned Deer'] },
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
    ],
    template: 'Summoned Deer deal +{N} damage and have a +{N}% chance to crit',
  },
  // Summoned Deer deal +5% damage with each attack
  {
    powerId: 'power_21203',
    name: 'DeerPetDamageBoost',
    target: { abilities: ['Summoned Deer'] },
    effects: [
      { type: 'percentDamage', valuePattern: /damage[^]*?\+(\d+)%/ },
    ],
    template: 'Summoned Deer deal +{N}% damage with each attack',
  },
  // Summoned Deer have +8 health
  {
    powerId: 'power_21201',
    name: 'DeerPetHealthBoost',
    target: 'self',
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Summoned Deer have +{N} health',
  },
  // Summoned Deer Rage Attack Damage +12. In addition, if it deals Indirect Nature damage (such as via Insect Egg implantation), damage is +1 per tick
  {
    powerId: 'power_21204',
    name: 'DeerPetRageAttackBoost',
    target: { abilities: ['Summoned Deer Rage Attack'] },
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
    ],
    template: 'Summoned Deer Rage Attack Damage +{N}. In addition, if it deals Indirect Nature damage (such as via Insect Egg implantation), damage is +{N} per tick',
  },
  // Direct and indirect Psychic and Nature Mitigation +2 while Deer skill active
  {
    powerId: 'power_21101',
    name: 'DeerPsychicNatureMitigation',
    target: 'self',
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Direct and indirect Psychic and Nature Mitigation +{N} while Deer skill active',
  },
  // Pummeling Hooves deals +4% damage and taunts +80
  {
    powerId: 'power_21152',
    name: 'DeerPummelingHoovesBoostB',
    target: { abilities: ['Pummeling Hooves'] },
    effects: [
      { type: 'percentDamage', valuePattern: /damage[^]*?\+(\d+)%/ },
    ],
    template: 'Pummeling Hooves deals +{N}% damage and taunts +{N}',
  },
  // Pummeling Hooves deals +3 damage and restores 4 Health over 8 seconds
  {
    powerId: 'power_21153',
    name: 'DeerPummelingHoovesHoT',
    target: { abilities: ['Pummeling Hooves'] },
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
      { type: 'restore', valuePattern: /(?:restores?|heals? you for) (\d+) Health/, resourceType: 'Health' },
    ],
    template: 'Pummeling Hooves deals +{N} damage and restores {N} Health over {N} seconds',
  },
  // Pummeling Hooves deals +10 damage and has a 1% chance to summon a deer ally for 30 seconds
  {
    powerId: 'power_21154',
    name: 'DeerPummelingHoovesSummon',
    target: { abilities: ['Pummeling Hooves'] },
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
    ],
    template: 'Pummeling Hooves deals +{N} damage and has a {N}% chance to summon a deer ally for {N} seconds',
  },
  // Combo: Forest Challenge+Any Melee+Any Melee+Any Epic Attack: final step deals +15 damage and summons a deer ally for 30 seconds.
  {
    powerId: 'power_21356',
    name: 'DeerSummonCombo',
    target: { abilities: ['Combo: Forest Challenge+Any Melee+Any Melee+Any Epic Attack: final step'] },
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
    ],
    template: 'Combo: Forest Challenge+Any Melee+Any Melee+Any Epic Attack: final step deals +{N} damage and summons a deer ally for {N} seconds.',
  },
  // Doe Eyes mitigates +1 physical damage (Crushing, Slashing, Piercing) for 24 seconds. Against Elite enemies, mitigates +2 more
  {
    powerId: 'power_21042',
    name: 'DoeEyesBoost',
    target: { abilities: ['Doe Eyes mitigates +1 physical'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Doe Eyes mitigates +{N} physical damage (Crushing, Slashing, Piercing) for {N} seconds. Against Elite enemies, mitigates +{N} more',
  },
  // Doe Eyes reuse timer is -2 seconds, and after using Doe Eyes your next attack deals +10 damage
  {
    powerId: 'power_21041',
    name: 'DoeEyesFaster',
    target: { abilities: ['Doe Eyes'] },
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
    ],
    template: 'Doe Eyes reuse timer is {N} seconds, and after using Doe Eyes your next attack deals +{N} damage',
  },
  // Doe Eyes restores 4 power
  {
    powerId: 'power_21043',
    name: 'DoeEyesHealPower',
    target: { abilities: ['Doe Eyes'] },
    effects: [
      { type: 'restore', valuePattern: /(?:restores?|heals? you for) (\d+) power/, resourceType: 'power' },
    ],
    template: 'Doe Eyes restores {N} power',
  },
  // For 10 seconds after using Doe Eyes, you mitigate +6 from all attacks, and a further +12 from Elite attacks
  {
    powerId: 'power_21044',
    name: 'DoeEyesShortBuff',
    target: 'self',
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'For {N} seconds after using Doe Eyes, you mitigate +{N} from all attacks, and a further +{N} from Elite attacks',
  },
  // You can use the Deer ability Feign Injury, and it temp-taunts +800. (Equipping this item will teach you the ability if needed.)
  {
    powerId: 'power_21304',
    name: 'FeignInjuryBoost',
    target: 'self',
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'You can use the Deer ability Feign Injury, and it temp-taunts +{N}. (Equipping this item will teach you the ability if needed.)',
  },
  // Forest Challenge deals +10 damage and you take -15% damage from Elite attacks for 20 seconds
  {
    powerId: 'power_21357',
    name: 'ForestChallengeEliteProtection',
    target: { abilities: ['Forest Challenge'] },
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
    ],
    template: 'Forest Challenge deals +{N} damage and you take {N}% damage from Elite attacks for {N} seconds',
  },
  // Forest Challenge raises Max Health +8 for 60 seconds (and heals +8)
  {
    powerId: 'power_21353',
    name: 'ForestChallengeHeal',
    target: { abilities: ['Forest Challenge raises Max Health +8 for 60 seconds (and'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Forest Challenge raises Max Health +{N} for {N} seconds (and heals +{N})',
  },
  // Forest Challenge and King of the Forest power cost is -4
  {
    powerId: 'power_21355',
    name: 'ForestChallengeKingOfTheForestCheaper',
    target: { abilities: ['Forest Challenge', 'King of the Forest power'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Forest Challenge and King of the Forest power cost is {N}',
  },
  // Forest Challenge and King of the Forest damage is +5 and reuse time is -1 second
  {
    powerId: 'power_21354',
    name: 'ForestChallengeKingOfTheForestFaster',
    target: { abilities: ['Forest Challenge', 'King of the Forest'] },
    effects: [
      { type: 'cooldownDelta', valuePattern: /by (\d+) seconds?/ },
    ],
    template: 'Forest Challenge and King of the Forest damage is +{N} and reuse time is {N} second',
  },
  // Forest Challenge deals Psychic damage, and damage is +10
  {
    powerId: 'power_21358',
    name: 'ForestChallengePsychic',
    target: { abilities: ['Forest Challenge'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Forest Challenge deals Psychic damage, and damage is +{N}',
  },
  // King of the Forest damage +5. There is a 10% chance to summon a deer ally for 30 seconds
  {
    powerId: 'power_21081',
    name: 'KingOfTheForestCrit',
    target: { abilities: ['King of the Forest'] },
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
    ],
    template: 'King of the Forest damage +{N}. There is a {N}% chance to summon a deer ally for {N} seconds',
  },
  // King of the Forest mitigates +4 physical damage (Crushing, Slashing, Piercing) for 10 seconds. Against Elite enemies, mitigates +8 more
  {
    powerId: 'power_21083',
    name: 'KingOfTheForestMitigation',
    target: { abilities: ['King of the Forest mitigates +4 physical'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'King of the Forest mitigates +{N} physical damage (Crushing, Slashing, Piercing) for {N} seconds. Against Elite enemies, mitigates +{N} more',
  },
  // King of the Forest deals Psychic damage, and damage is +6.
  {
    powerId: 'power_21084',
    name: 'KingOfTheForestPsychic',
    target: { abilities: ['King of the Forest'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'King of the Forest deals Psychic damage, and damage is +{N}.',
  },
];
