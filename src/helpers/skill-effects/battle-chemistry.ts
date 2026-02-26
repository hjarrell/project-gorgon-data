import type { PowerEffectConfig } from './types';

export const BATTLECHEMISTRY_EFFECTS: PowerEffectConfig[] = [
  // Acid Bomb deals +3 damage and causes your next Minor Heal ability to restore +5 Health
  {
    powerId: 'power_7009',
    name: 'AcidBombBoostNextMinorHeal',
    target: { abilities: ['Acid Bomb'] },
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
    ],
    template: 'Acid Bomb deals +{N} damage and causes your next Minor Heal ability to restore +{N} Health',
  },
  // Acid Bomb deals 36 Acid Damage to Health and Armor over 6 seconds
  {
    powerId: 'power_7006',
    name: 'AcidBombDoT',
    target: { abilities: ['Acid Bomb'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Acid Bomb deals {N} Acid Damage to Health and Armor over {N} seconds',
  },
  // Your golem minion's attacks deal +6 damage
  {
    powerId: 'power_7302',
    name: 'BatChemGolemDamageBoost',
    target: { abilities: ['Your golem minion\'s attacks'] },
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
    ],
    template: 'Your golem minion\'s attacks deal +{N} damage',
  },
  // Your golem minion's attacks deal +15% Damage, and its Doom Admixture deals +15 damage
  {
    powerId: 'power_7305',
    name: 'BatChemGolemDoomAdmixtureBoost',
    target: { abilities: ['Your golem minion\'s attacks'] },
    effects: [
      { type: 'percentDamage', valuePattern: /damage[^]*?\+(\d+)%/ },
    ],
    template: 'Your golem minion\'s attacks deal +{N}% Damage, and its Doom Admixture deals +{N} damage',
  },
  // Your golem minion's Fire Balm absorbs the first 8 Fire damage you suffer in the next 15 seconds
  {
    powerId: 'power_7311',
    name: 'BatChemGolemFireBalmBuff',
    target: { abilities: ['Your golem minion\'s Fire Balm absorbs the first 8 Fire'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Your golem minion\'s Fire Balm absorbs the first {N} Fire damage you suffer in the next {N} seconds',
  },
  // Your golem minion's Fire Balm heals +3 health
  {
    powerId: 'power_7310',
    name: 'BatChemGolemFireBalmHeal',
    target: { abilities: ['Your golem minion\'s Fire Balm'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Your golem minion\'s Fire Balm heals +{N} health',
  },
  // Your golem minion's Healing Injection heals +5 health
  {
    powerId: 'power_7309',
    name: 'BatChemGolemHealingInjectionHeal',
    target: { abilities: ['Your golem minion\'s Healing Injection'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Your golem minion\'s Healing Injection heals +{N} health',
  },
  // Your golem minion's Healing Mist heals +3 health
  {
    powerId: 'power_7306',
    name: 'BatChemGolemHealingMistHeal',
    target: { abilities: ['Your golem minion\'s Healing Mist'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Your golem minion\'s Healing Mist heals +{N} health',
  },
  // Your golem minion has +25% Max Health and its attacks taunt +30
  {
    powerId: 'power_7301',
    name: 'BatChemGolemHealthyTaunts',
    target: { abilities: ['Your golem minion'] },
    effects: [
      { type: 'tauntDelta', valuePattern: /[Tt]aunt \+(\d+)/ },
    ],
    template: 'Your golem minion has +{N}% Max Health and its attacks taunt +{N}',
  },
  // Your golem minion's Invigorating Mist restores +3 Power
  {
    powerId: 'power_7307',
    name: 'BatChemGolemInvigoratingMistBoost',
    target: { abilities: ['Your golem minion\'s Invigorating Mist'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Your golem minion\'s Invigorating Mist restores +{N} Power',
  },
  // Your golem minion's attacks deal +15% Damage, and its Rage Acid Toss deals +15 damage
  {
    powerId: 'power_7304',
    name: 'BatChemGolemRageAcidTossBoost',
    target: { abilities: ['Your golem minion\'s attacks'] },
    effects: [
      { type: 'percentDamage', valuePattern: /damage[^]*?\+(\d+)%/ },
    ],
    template: 'Your golem minion\'s attacks deal +{N}% Damage, and its Rage Acid Toss deals +{N} damage',
  },
  // Your golem minion's Rage Mist and Self Sacrifice abilities heal +8 health
  {
    powerId: 'power_7308',
    name: 'BatChemGolemRageMistHeal',
    target: { abilities: ['Your golem minion\'s Rage Mist', 'Self Sacrifice abilities'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Your golem minion\'s Rage Mist and Self Sacrifice abilities heal +{N} health',
  },
  // Your golem minion's attacks deal +15% Damage, and its Self Destruct deals +55 damage
  {
    powerId: 'power_7303',
    name: 'BatChemGolemSelfDestructBoost',
    target: { abilities: ['Your golem minion\'s attacks'] },
    effects: [
      { type: 'percentDamage', valuePattern: /damage[^]*?\+(\d+)%/ },
    ],
    template: 'Your golem minion\'s attacks deal +{N}% Damage, and its Self Destruct deals +{N} damage',
  },
  // Bomb attacks deal +3 damage and cause your next Healing Mist to restore +5 Armor over 15 seconds
  {
    powerId: 'power_7216',
    name: 'BombBoostHealingMistArmorHoT',
    target: { abilities: ['Bomb attacks'] },
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
    ],
    template: 'Bomb attacks deal +{N} damage and cause your next Healing Mist to restore +{N} Armor over {N} seconds',
  },
  // Bomb attacks deal +5 damage and cause your next Healing Mist to restore +6 Health over 30 seconds
  {
    powerId: 'power_7215',
    name: 'BombBoostHealingMistHoT',
    target: { abilities: ['Bomb attacks'] },
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
    ],
    template: 'Bomb attacks deal +{N} damage and cause your next Healing Mist to restore +{N} Health over {N} seconds',
  },
  // All bomb attacks ignite the target, causing them to take 35 fire damage over 10 seconds
  {
    powerId: 'power_7203',
    name: 'BombIgnite',
    target: { skill: 'bomb' },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'All bomb attacks ignite the target, causing them to take {N} fire damage over {N} seconds',
  },
  // Bomb attacks deal +5 damage and hasten the current reuse timer of Healing Mist by 0.5 seconds
  {
    powerId: 'power_7207',
    name: 'BombResetHealingMist',
    target: { abilities: ['Bomb attacks'] },
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
    ],
    template: 'Bomb attacks deal +{N} damage and hasten the current reuse timer of Healing Mist by {N} seconds',
  },
  // Freezing Mist Damage +5 and Reuse Time -5 seconds
  {
    powerId: 'power_7103',
    name: 'FreezingMistFaster',
    target: { abilities: ['Freezing Mist'] },
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
      { type: 'cooldownDelta', valuePattern: /[Rr]euse [Tt]ime (?:is )?-(\d+)/ },
    ],
    template: 'Freezing Mist Damage +{N} and Reuse Time {N} seconds',
  },
  // Freezing Mist restores 13 Health (or Armor if Health is full) to you
  {
    powerId: 'power_7102',
    name: 'FreezingMistHealArmor',
    target: { abilities: ['Freezing Mist'] },
    effects: [
      { type: 'restore', valuePattern: /(?:restores?|heals? you for) (\d+) Health/, resourceType: 'Health' },
    ],
    template: 'Freezing Mist restores {N} Health (or Armor if Health is full) to you',
  },
  // You heal 2 health every other second while under the effect of Haste Concoction
  {
    powerId: 'power_7211',
    name: 'HasteConcoctionHeal',
    target: { abilities: ['You'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'You heal {N} health every other second while under the effect of Haste Concoction',
  },
  // You heal 2 health and 2 armor every other second while under the effect of Haste Concoction
  {
    powerId: 'power_7212',
    name: 'HasteConcoctionHealthArmor',
    target: { abilities: ['You'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'You heal {N} health and {N} armor every other second while under the effect of Haste Concoction',
  },
  // You regain 5 Power every other second while under the effect of Haste Concoction
  {
    powerId: 'power_7213',
    name: 'HasteConcoctionPower',
    target: 'self',
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'You regain {N} Power every other second while under the effect of Haste Concoction',
  },
  // Healing Injection heals 15 Health after a 20 second delay
  {
    powerId: 'power_7206',
    name: 'HealingInjectionDelayedHeal',
    target: { abilities: ['Healing Injection'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Healing Injection heals {N} Health after a {N} second delay',
  },
  // Healing Mist heals +13 Armor
  {
    powerId: 'power_7202',
    name: 'HealingMistBoostArmor',
    target: { abilities: ['Healing Mist'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Healing Mist heals +{N} Armor',
  },
  // Healing Mist heals +7 Health
  {
    powerId: 'power_7201',
    name: 'HealingMistBoostHeal',
    target: { abilities: ['Healing Mist'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Healing Mist heals +{N} Health',
  },
  // Healing Mist accelerates the current reuse time of Mend Flesh (for any targets that use Mend Flesh)
  {
    powerId: 'power_7214',
    name: 'HealingMistHastenMendFlesh',
    target: { abilities: ['Healing Mist accelerates the current'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Healing Mist accelerates the current reuse time of Mend Flesh (for any targets that use Mend Flesh)',
  },
  // Healing Mist accelerates the current reuse time of Pep Talk (for any targets that use Pep Talk)
  {
    powerId: 'power_7208',
    name: 'HealingMistHastenPepTalk',
    target: { abilities: ['Healing Mist accelerates the current'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Healing Mist accelerates the current reuse time of Pep Talk (for any targets that use Pep Talk)',
  },
  // Healing Mist accelerates the current reuse time of Reconstruct (for any targets that use Reconstruct)
  {
    powerId: 'power_7209',
    name: 'HealingMistHastenReconstruct',
    target: { abilities: ['Healing Mist accelerates the current'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Healing Mist accelerates the current reuse time of Reconstruct (for any targets that use Reconstruct)',
  },
  // Healing Mist accelerates the current reuse time of Regrowth (for any targets that use Regrowth)
  {
    powerId: 'power_7210',
    name: 'HealingMistHastenRegrowth',
    target: { abilities: ['Healing Mist accelerates the current'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Healing Mist accelerates the current reuse time of Regrowth (for any targets that use Regrowth)',
  },
  // Healing Mist restores 6 power
  {
    powerId: 'power_7205',
    name: 'HealingMistRestorePower',
    target: { abilities: ['Healing Mist'] },
    effects: [
      { type: 'restore', valuePattern: /(?:restores?|heals? you for) (\d+) power/, resourceType: 'power' },
    ],
    template: 'Healing Mist restores {N} power',
  },
  // Your Extra Toes mutation grants the target +6% Ranged Evasion
  {
    powerId: 'power_7483',
    name: 'MutationEvasion',
    target: 'self',
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Your Extra Toes mutation grants the target +{N}% Ranged Evasion',
  },
  // Your Extra Heart and Extra Skin mutations grant the target +10 Max Health
  {
    powerId: 'power_7472',
    name: 'MutationExtraHealth',
    target: 'self',
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Your Extra Heart and Extra Skin mutations grant the target +{N} Max Health',
  },
  // Your Extra Heart mutation causes the target to regain +5 Power every 8 seconds
  {
    powerId: 'power_7471',
    name: 'MutationExtraHeartPowerRegen',
    target: 'self',
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Your Extra Heart mutation causes the target to regain +{N} Power every {N} seconds',
  },
  // Your Extra Skin mutation causes the target to heal 10 Health every 15 seconds
  {
    powerId: 'power_7431',
    name: 'MutationExtraSkinHealing',
    target: { abilities: ['Your Extra Skin mutation causes the target to'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Your Extra Skin mutation causes the target to heal {N} Health every {N} seconds',
  },
  // Your Extra Skin mutation provides +3 mitigation from Piercing and direct Poison damage
  {
    powerId: 'power_7433',
    name: 'MutationExtraSkinPiercingMitigation',
    target: 'self',
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Your Extra Skin mutation provides +{N} mitigation from Piercing and direct Poison damage',
  },
  // Your Extra Skin mutation provides +3 mitigation from Slashing and direct Acid damage
  {
    powerId: 'power_7432',
    name: 'MutationExtraSkinSlashingMitigation',
    target: 'self',
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Your Extra Skin mutation provides +{N} mitigation from Slashing and direct Acid damage',
  },
  // Your Extra Heart mutation grants you -50% Indirect Poison Vulnerability and randomly repairs broken bones over time
  {
    powerId: 'power_7491',
    name: 'MutationFixBrokenBones',
    target: 'self',
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Your Extra Heart mutation grants you {N}% Indirect Poison Vulnerability and randomly repairs broken bones over time',
  },
  // Your Extra Toes mutation causes kicks to deal an additional +7% damage
  {
    powerId: 'power_7402',
    name: 'MutationKneeBooster',
    target: { abilities: ['Your Extra Toes mutation causes kicks to'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Your Extra Toes mutation causes kicks to deal an additional +{N}% damage',
  },
  // Your Extra Heart and Extra Toes mutations grant the target +10 Max Power
  {
    powerId: 'power_7473',
    name: 'MutationMaxPowerA',
    target: 'self',
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Your Extra Heart and Extra Toes mutations grant the target +{N} Max Power',
  },
  // Your Extra Heart mutation grants the target +4% Max Power
  {
    powerId: 'power_7474',
    name: 'MutationMaxPowerB',
    target: 'self',
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Your Extra Heart mutation grants the target +{N}% Max Power',
  },
  // Your Extra Toes mutation causes kicks to restore 3 Health to the kicker
  {
    powerId: 'power_7401',
    name: 'MutationRegenerativeKnees',
    target: { abilities: ['Your Extra Toes mutation causes kicks to'] },
    effects: [
      { type: 'restore', valuePattern: /(?:restores?|heals? you for) (\d+) Health/, resourceType: 'Health' },
    ],
    template: 'Your Extra Toes mutation causes kicks to restore {N} Health to the kicker',
  },
  // Your Extra Toes mutation grants the target +5% Knockback Ignore Chance
  {
    powerId: 'power_7481',
    name: 'MutationToesKnockbackResist',
    target: 'self',
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Your Extra Toes mutation grants the target +{N}% Knockback Ignore Chance',
  },
  // Your Extra Toes mutation grants the target +20% Slow/Root Ignore Chance
  {
    powerId: 'power_7482',
    name: 'MutationToesSlowResist',
    target: 'self',
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Your Extra Toes mutation grants the target +{N}% Slow/Root Ignore Chance',
  },
  // Mycotoxin Formula deals 48 Nature Damage to Health over 8 seconds
  {
    powerId: 'power_7007',
    name: 'MycotoxinBombDoT',
    target: { abilities: ['Mycotoxin Formula'] },
    effects: [
      { type: 'dot', valuePattern: /deals? \+?(\d+) Nature damage/, damageType: 'Nature', duration: 8 },
    ],
    template: 'Mycotoxin Formula deals {N} Nature Damage to Health over {N} seconds',
  },
  // Toxic Irritant boosts your Nice Attack Damage +15 for 8 seconds
  {
    powerId: 'power_7021',
    name: 'ToxicIrritantBoostNice',
    target: { abilities: ['Toxic Irritant'] },
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
    ],
    template: 'Toxic Irritant boosts your Nice Attack Damage +{N} for {N} seconds',
  },
  // Toxic Irritant boosts your Acid Damage (including from Toxic Irritant) +6% for 15 seconds. (This effect does not stack with itself.)
  {
    powerId: 'power_7024',
    name: 'ToxicIrritantDebuffAcid',
    target: { abilities: ['Toxic Irritant'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Toxic Irritant boosts your Acid Damage (including from Toxic Irritant) +{N}% for {N} seconds. (This effect does not stack with itself.)',
  },
  // Toxic Irritant deals +4 damage. If target has 5 or more Damage-over-Time effects, it also stuns them
  {
    powerId: 'power_7022',
    name: 'ToxicIrritantStun',
    target: { abilities: ['Toxic Irritant'] },
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
    ],
    template: 'Toxic Irritant deals +{N} damage. If target has {N} or more Damage-over-Time effects, it also stuns them',
  },
  // Toxin Bomb deals 42 Poison Damage to Health over 7 seconds
  {
    powerId: 'power_7008',
    name: 'ToxinBombDoT',
    target: { abilities: ['Toxin Bomb'] },
    effects: [
      { type: 'dot', valuePattern: /deals? \+?(\d+) Poison damage/, damageType: 'Poison', duration: 7 },
    ],
    template: 'Toxin Bomb deals {N} Poison Damage to Health over {N} seconds',
  },
];
