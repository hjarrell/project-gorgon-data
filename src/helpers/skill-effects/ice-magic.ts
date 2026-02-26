import type { PowerEffectConfig } from './types';

export const ICEMAGIC_EFFECTS: PowerEffectConfig[] = [
  // Blizzard Damage +30
  {
    powerId: 'power_15304',
    name: 'BlizzardBoost',
    target: { abilities: ['Blizzard'] },
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
    ],
    template: 'Blizzard Damage +{N}',
  },
  // Blizzard deals +1% damage, generates -90 Rage and taunts -80
  {
    powerId: 'power_15302',
    name: 'BlizzardDetaunt',
    target: { abilities: ['Blizzard'] },
    effects: [
      { type: 'percentDamage', valuePattern: /damage[^]*?\+(\d+)%/ },
      { type: 'rageDelta', valuePattern: /(\d+) Rage/ },
    ],
    template: 'Blizzard deals +{N}% damage, generates {N} Rage and taunts {N}',
  },
  // Blizzard has a 15% chance to cause all sentient targets to flee in terror
  {
    powerId: 'power_15301',
    name: 'BlizzardFear',
    target: { abilities: ['Blizzard'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Blizzard has a {N}% chance to cause all sentient targets to flee in terror',
  },
  // You regain 15 Health when using Blizzard
  {
    powerId: 'power_15303',
    name: 'BlizzardHeal',
    target: 'self',
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'You regain {N} Health when using Blizzard',
  },
  // Blizzard Damage +15 and you gain Elite Resistance +10% for 20 seconds
  {
    powerId: 'power_15305',
    name: 'BlizzardMitigation',
    target: { abilities: ['Blizzard'] },
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
    ],
    template: 'Blizzard Damage +{N} and you gain Elite Resistance +{N}% for {N} seconds',
  },
  // Chill causes target to take +1% damage from Crushing attacks for 6 seconds, but reset time of Chill is increased +4 seconds
  {
    powerId: 'power_15033',
    name: 'ChillBoostCrushing',
    target: { abilities: ['Chill causes target to take +1%'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Chill causes target to take +{N}% damage from Crushing attacks for {N} seconds, but reset time of Chill is increased +{N} seconds',
  },
  // Your Cold Sphere's attacks deal +5% damage and taunt -25%
  {
    powerId: 'power_15501',
    name: 'ColdSphereBoostDmg',
    target: { abilities: ['Your Cold Sphere\'s attacks'] },
    effects: [
      { type: 'percentDamage', valuePattern: /damage[^]*?\+(\d+)%/ },
    ],
    template: 'Your Cold Sphere\'s attacks deal +{N}% damage and taunt {N}%',
  },
  // Your Cold Sphere gains 15 Health
  {
    powerId: 'power_15502',
    name: 'ColdSphereBoostHealth',
    target: 'self',
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Your Cold Sphere gains {N} Health',
  },
  // Your Cold Sphere's attacks deal +4 damage and cause the targets to suffer +10% damage from future Cold attacks (non-stacking)
  {
    powerId: 'power_15504',
    name: 'ColdSphereDebuff',
    target: { abilities: ['Your Cold Sphere\'s attacks'] },
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
    ],
    template: 'Your Cold Sphere\'s attacks deal +{N} damage and cause the targets to suffer +{N}% damage from future Cold attacks (non-stacking)',
  },
  // Your Cold Sphere's attacks deals +20 damage, but their Max Health is -5
  {
    powerId: 'power_15505',
    name: 'ColdSphereFrailty',
    target: { abilities: ['Your Cold Sphere\'s attacks'] },
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
    ],
    template: 'Your Cold Sphere\'s attacks deals +{N} damage, but their Max Health is {N}',
  },
  // Your Cold Sphere's Rage attack deals +35 damage
  {
    powerId: 'power_15503',
    name: 'ColdSphereRageBoost',
    target: { abilities: ['Your Cold Sphere\'s Rage attack'] },
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
    ],
    template: 'Your Cold Sphere\'s Rage attack deals +{N} damage',
  },
  // Cryogenic Freeze restores 11 Armor
  {
    powerId: 'power_15402',
    name: 'CryogenicFreezeArmor',
    target: { abilities: ['Cryogenic Freeze'] },
    effects: [
      { type: 'restore', valuePattern: /(?:restores?|heals? you for) (\d+) Armor/, resourceType: 'Armor' },
    ],
    template: 'Cryogenic Freeze restores {N} Armor',
  },
  // While in Cryogenic Freeze, you are 30% resistant to Fire damage
  {
    powerId: 'power_15404',
    name: 'CryogenicFreezeFireResist',
    target: 'self',
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'While in Cryogenic Freeze, you are {N}% resistant to Fire damage',
  },
  // Cryogenic Freeze restores 8 Health
  {
    powerId: 'power_15401',
    name: 'CryogenicFreezeHeal',
    target: { abilities: ['Cryogenic Freeze'] },
    effects: [
      { type: 'restore', valuePattern: /(?:restores?|heals? you for) (\d+) Health/, resourceType: 'Health' },
    ],
    template: 'Cryogenic Freeze restores {N} Health',
  },
  // While in Cryogenic Freeze, you are 30% resistant to Poison damage
  {
    powerId: 'power_15405',
    name: 'CryogenicFreezePoisonResist',
    target: 'self',
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'While in Cryogenic Freeze, you are {N}% resistant to Poison damage',
  },
  // Cryogenic Freeze restores 8 Power
  {
    powerId: 'power_15403',
    name: 'CryogenicFreezePower',
    target: { abilities: ['Cryogenic Freeze'] },
    effects: [
      { type: 'restore', valuePattern: /(?:restores?|heals? you for) (\d+) Power/, resourceType: 'Power' },
    ],
    template: 'Cryogenic Freeze restores {N} Power',
  },
  // Freeze Solid and Frostbite Damage +5%
  {
    powerId: 'power_15151',
    name: 'FreezeSolidBoost',
    target: { abilities: ['Freeze Solid', 'Frostbite'] },
    effects: [
      { type: 'percentDamage', valuePattern: /damage[^]*?\+(\d+)%/ },
    ],
    template: 'Freeze Solid and Frostbite Damage +{N}%',
  },
  // Freeze Solid reduces the Power cost of all Ice Magic abilities -4 for 7 seconds
  {
    powerId: 'power_15153',
    name: 'FreezeSolidCheapenIceMagic',
    target: { abilities: ['Freeze Solid reduces the Power'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Freeze Solid reduces the Power cost of all Ice Magic abilities {N} for {N} seconds',
  },
  // Freeze Solid restores 7 armor to you
  {
    powerId: 'power_15152',
    name: 'FreezeSolidHealArmor',
    target: { abilities: ['Freeze Solid'] },
    effects: [
      { type: 'restore', valuePattern: /(?:restores?|heals? you for) (\d+) armor/, resourceType: 'armor' },
    ],
    template: 'Freeze Solid restores {N} armor to you',
  },
  // Frostbite causes all target's attacks to deal -3 damage, and their Rage attacks are further reduced by 10%
  {
    powerId: 'power_15201',
    name: 'FrostbiteDamageDebuff',
    target: { abilities: ['Frostbite causes all target\'s attacks to'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Frostbite causes all target\'s attacks to deal {N} damage, and their Rage attacks are further reduced by {N}%',
  },
  // Frostbite debuffs target so that 4% of their attacks miss and have no effect
  {
    powerId: 'power_15203',
    name: 'FrostbiteMiss',
    target: 'self',
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Frostbite debuffs target so that {N}% of their attacks miss and have no effect',
  },
  // Frostbite deals +11 damage and raises the target's Max Rage by 33%, preventing them from using their Rage attacks as often
  {
    powerId: 'power_15202',
    name: 'FrostbiteReduceRage',
    target: { abilities: ['Frostbite'] },
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
    ],
    template: 'Frostbite deals +{N} damage and raises the target\'s Max Rage by {N}%, preventing them from using their Rage attacks as often',
  },
  // Ice Armor boosts Cold attack damage +5
  {
    powerId: 'power_15105',
    name: 'IceArmorBoostIceDamage',
    target: { abilities: ['Ice Armor'] },
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
    ],
    template: 'Ice Armor boosts Cold attack damage +{N}',
  },
  // Ice Armor has no slowdown effect and instead boosts Sprint Speed +8. However, any Knockback Ingore Chance is nullified while Ice Armor is active.
  {
    powerId: 'power_15107',
    name: 'IceArmorFastAndSlippery',
    target: { abilities: ['Ice Armor'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Ice Armor has no slowdown effect and instead boosts Sprint Speed +{N}. However, any Knockback Ingore Chance is nullified while Ice Armor is active.',
  },
  // Ice Armor instantly restores 11 Health
  {
    powerId: 'power_15106',
    name: 'IceArmorHeal',
    target: { abilities: ['Ice Armor instantly'] },
    effects: [
      { type: 'restore', valuePattern: /(?:restores?|heals? you for) (\d+) Health/, resourceType: 'Health' },
    ],
    template: 'Ice Armor instantly restores {N} Health',
  },
  // Ice Armor costs -4 Power and restores 10 Power after a 6-second delay
  {
    powerId: 'power_15102',
    name: 'IceArmorHealPower',
    target: { abilities: ['Ice Armor costs -4 Power and'] },
    effects: [
      { type: 'restore', valuePattern: /(?:restores?|heals? you for) (\d+) Power/, resourceType: 'Power' },
    ],
    template: 'Ice Armor costs {N} Power and restores {N} Power after a {N}-second delay',
  },
  // Ice Armor boosts direct and indirect Trauma Mitigation +10 and all attacks taunt +6%
  {
    powerId: 'power_15104',
    name: 'IceArmorMitigateTraumaAndTaunt',
    target: { abilities: ['Ice Armor'] },
    effects: [
      { type: 'tauntDelta', valuePattern: /[Tt]aunt \+(\d+)/ },
    ],
    template: 'Ice Armor boosts direct and indirect Trauma Mitigation +{N} and all attacks taunt +{N}%',
  },
  // Ice Armor mitigates +1 Physical and Cold damage, and mitigates +1 more against Elite attacks
  {
    powerId: 'power_15101',
    name: 'IceArmorMoreMitigation',
    target: { abilities: ['Ice Armor mitigates +1 Physical', 'Cold'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Ice Armor mitigates +{N} Physical and Cold damage, and mitigates +{N} more against Elite attacks',
  },
  // Ice Armor instantly restores 15 Armor, and Fire damage no longer dispels your Ice Armor
  {
    powerId: 'power_15103',
    name: 'IceArmorNotFireDispelled',
    target: { abilities: ['Ice Armor instantly'] },
    effects: [
      { type: 'restore', valuePattern: /(?:restores?|heals? you for) (\d+) Armor/, resourceType: 'Armor' },
    ],
    template: 'Ice Armor instantly restores {N} Armor, and Fire damage no longer dispels your Ice Armor',
  },
  // Ice Lightning boosts your Core Attack Damage +10 for 7 seconds
  {
    powerId: 'power_15352',
    name: 'IceLightningBoostCore',
    target: { abilities: ['Ice Lightning'] },
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
    ],
    template: 'Ice Lightning boosts your Core Attack Damage +{N} for {N} seconds',
  },
  // Ice Lightning causes the target to become 2% more vulnerable to Fire attacks for 7 seconds
  {
    powerId: 'power_15353',
    name: 'IceLightningBoostFire',
    target: 'self',
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Ice Lightning causes the target to become {N}% more vulnerable to Fire attacks for {N} seconds',
  },
  // All Ice Magic abilities that hit multiple targets have a 20% chance to deal +10% damage
  {
    powerId: 'power_15031',
    name: 'IceMagicAoECrit',
    target: { abilities: ['All Ice Magic abilities that hit multiple targets have a 20% chance to'] },
    effects: [
      { type: 'percentDamage', valuePattern: /damage[^]*?\+(\d+)%/ },
    ],
    template: 'All Ice Magic abilities that hit multiple targets have a {N}% chance to deal +{N}% damage',
  },
  // All Ice Magic attacks that hit a single target have a 33% chance to deal +11% damage
  {
    powerId: 'power_15032',
    name: 'IceMagicSingleTargetCrit',
    target: { abilities: ['All Ice Magic attacks that hit a single target have a 33% chance to'] },
    effects: [
      { type: 'percentDamage', valuePattern: /damage[^]*?\+(\d+)%/ },
    ],
    template: 'All Ice Magic attacks that hit a single target have a {N}% chance to deal +{N}% damage',
  },
  // Ice Nova and Shardblast deal +8% damage
  {
    powerId: 'power_15053',
    name: 'IceNovaBoost',
    target: { abilities: ['Ice Nova', 'Shardblast'] },
    effects: [
      { type: 'percentDamage', valuePattern: /damage[^]*?\+(\d+)%/ },
    ],
    template: 'Ice Nova and Shardblast deal +{N}% damage',
  },
  // Ice Nova deals +15 damage and reuse timer is -2 seconds
  {
    powerId: 'power_15154',
    name: 'IceNovaFaster',
    target: { abilities: ['Ice Nova'] },
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
    ],
    template: 'Ice Nova deals +{N} damage and reuse timer is {N} seconds',
  },
  // Ice Nova restores 7 Armor to you
  {
    powerId: 'power_15054',
    name: 'IceNovaHealArmor',
    target: { abilities: ['Ice Nova'] },
    effects: [
      { type: 'restore', valuePattern: /(?:restores?|heals? you for) (\d+) Armor/, resourceType: 'Armor' },
    ],
    template: 'Ice Nova restores {N} Armor to you',
  },
  // You regain 8 Health when using Ice Nova or Shardblast
  {
    powerId: 'power_15052',
    name: 'IceNovaHealHealth',
    target: 'self',
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'You regain {N} Health when using Ice Nova or Shardblast',
  },
  // Ice Nova and Shardblast deal +1 damage and cost -5 Power
  {
    powerId: 'power_15051',
    name: 'IceNovaHealPower',
    target: { abilities: ['Ice Nova', 'Shardblast'] },
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
      { type: 'costDelta', valuePattern: /[Cc]ost -(\d+)/ },
    ],
    template: 'Ice Nova and Shardblast deal +{N} damage and cost {N} Power',
  },
  // Ice Spear deals between +1 and +20 extra damage (randomly determined)
  {
    powerId: 'power_15012',
    name: 'IceSpearDamageCrit',
    target: { abilities: ['Ice Spear'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Ice Spear deals between +{N} and +{N} extra damage (randomly determined)',
  },
  // Ice Spear heals you for 4 health after a 7-second delay
  {
    powerId: 'power_15014',
    name: 'IceSpearDelayedHeal',
    target: { abilities: ['Ice Spear'] },
    effects: [
      { type: 'restore', valuePattern: /(?:restores?|heals? you for) (\d+) health/, resourceType: 'health' },
    ],
    template: 'Ice Spear heals you for {N} health after a {N}-second delay',
  },
  // Ice Spear and Ice Lightning damage +11%
  {
    powerId: 'power_15354',
    name: 'IceSpearIceLightningBoost',
    target: { abilities: ['Ice Spear', 'Ice Lightning'] },
    effects: [
      { type: 'percentDamage', valuePattern: /damage[^]*?\+(\d+)%/ },
    ],
    template: 'Ice Spear and Ice Lightning damage +{N}%',
  },
  // Ice Veins heals +10 Health and Power cost is -4
  {
    powerId: 'power_15453',
    name: 'IceVeinsLowerPower',
    target: { abilities: ['Ice Veins'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Ice Veins heals +{N} Health and Power cost is {N}',
  },
  // Ice Veins heals 30 Health over 10 seconds
  {
    powerId: 'power_15452',
    name: 'IceVeinsRegen',
    target: { abilities: ['Ice Veins'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Ice Veins heals {N} Health over {N} seconds',
  },
  // Ice Veins heals +1 Health and resets the timer on Ice Armor (so it can be used again immediately)
  {
    powerId: 'power_15454',
    name: 'IceVeinsResetsIceArmor',
    target: { abilities: ['Ice Veins'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Ice Veins heals +{N} Health and resets the timer on Ice Armor (so it can be used again immediately)',
  },
  // Shardblast deals +5% damage and resets the timer on Ice Armor (so it can be used again immediately)
  {
    powerId: 'power_15551',
    name: 'ShardblastResetIceArmor',
    target: { abilities: ['Shardblast'] },
    effects: [
      { type: 'percentDamage', valuePattern: /damage[^]*?\+(\d+)%/ },
    ],
    template: 'Shardblast deals +{N}% damage and resets the timer on Ice Armor (so it can be used again immediately)',
  },
  // Tundra Spikes deals 35 armor damage and taunts +75
  {
    powerId: 'power_15252',
    name: 'TundraSpikesArmorDmg',
    target: { abilities: ['Tundra Spikes'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Tundra Spikes deals {N} armor damage and taunts +{N}',
  },
  // Tundra Spikes and Blizzard Damage +6.5%
  {
    powerId: 'power_15251',
    name: 'TundraSpikesBoost',
    target: { abilities: ['Tundra Spikes', 'Blizzard'] },
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
    ],
    template: 'Tundra Spikes and Blizzard Damage +{N}%',
  },
  // Tundra Spikes deals +5% damage, gains +1 Accuracy, and lowers targets' Evasion by -2 for 20 seconds
  {
    powerId: 'power_15254',
    name: 'TundraSpikesDebuffEvasion',
    target: { abilities: ['Tundra Spikes'] },
    effects: [
      { type: 'percentDamage', valuePattern: /damage[^]*?\+(\d+)%/ },
    ],
    template: 'Tundra Spikes deals +{N}% damage, gains +{N} Accuracy, and lowers targets\' Evasion by {N} for {N} seconds',
  },
  // Tundra Spikes stuns all targets after a 13 second delay
  {
    powerId: 'power_15253',
    name: 'TundraSpikesDelayedStun',
    target: 'self',
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Tundra Spikes stuns all targets after a {N} second delay',
  },
];
