import type { PowerEffectConfig } from './types';

export const WEREWOLF_EFFECTS: PowerEffectConfig[] = [
  // Werewolf Bite hits all enemies within 5 meters, but reuse timer is +2 seconds
  {
    powerId: 'power_6034',
    name: 'BiteAoE',
    target: 'self',
    effects: [
      { type: 'aoeDelta', valuePattern: /(?:within|targets within) (\d+) meters/ },
    ],
    template: 'Werewolf Bite hits all enemies within {N} meters, but reuse timer is +{N} seconds',
  },
  // Werewolf Bite deals +4% damage and boosts your Nice Attack Damage +5 for 10 seconds
  {
    powerId: 'power_6002',
    name: 'BiteBoostNice',
    target: { abilities: ['Werewolf Bite'] },
    effects: [
      { type: 'percentDamage', valuePattern: /damage[^]*?\+(\d+)%/ },
    ],
    template: 'Werewolf Bite deals +{N}% damage and boosts your Nice Attack Damage +{N} for {N} seconds',
  },
  // Bite restores 5 Health to you
  {
    powerId: 'power_6033',
    name: 'BiteHeal',
    target: { abilities: ['Bite'] },
    effects: [
      { type: 'restore', valuePattern: /(?:restores?|heals? you for) (\d+) Health/, resourceType: 'Health' },
    ],
    template: 'Bite restores {N} Health to you',
  },
  // Bite, Pack Attack, and Smell Fear Damage +7%
  {
    powerId: 'power_6114',
    name: 'BitePackAttackSmellFearBoost',
    target: { abilities: ['Bite', 'Pack Attack', 'Smell Fear'] },
    effects: [
      { type: 'percentDamage', valuePattern: /damage[^]*?\+(\d+)%/ },
    ],
    template: 'Bite, Pack Attack, and Smell Fear Damage +{N}%',
  },
  // Blood of the Pack restores +10 Health to you and costs -3 Power
  {
    powerId: 'power_6176',
    name: 'BloodOfThePackCheaper',
    target: { abilities: ['Blood of the Pack'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Blood of the Pack restores +{N} Health to you and costs {N} Power',
  },
  // Blood of the Pack causes you and your allies' attacks to deal +5 damage for 30 seconds
  {
    powerId: 'power_6115',
    name: 'BloodOfThePackDamageBoost',
    target: 'self',
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
    ],
    template: 'Blood of the Pack causes you and your allies\' attacks to deal +{N} damage for {N} seconds',
  },
  // Blood of the Pack restores 15 Health over 10 seconds to you and your allies
  {
    powerId: 'power_6088',
    name: 'BloodOfThePackHealOthers',
    target: { abilities: ['Blood of the Pack'] },
    effects: [
      { type: 'restore', valuePattern: /(?:restores?|heals? you for) (\d+) Health/, resourceType: 'Health' },
    ],
    template: 'Blood of the Pack restores {N} Health over {N} seconds to you and your allies',
  },
  // Claw and Double Claw restore 2 Health
  {
    powerId: 'power_6003',
    name: 'ClawDoubleClawHeal',
    target: { abilities: ['Claw', 'Double Claw'] },
    effects: [
      { type: 'restore', valuePattern: /(?:restores?|heals? you for) (\d+) Health/, resourceType: 'Health' },
    ],
    template: 'Claw and Double Claw restore {N} Health',
  },
  // Werewolf Claw, Double Claw, and Pouncing Rake Damage +5
  {
    powerId: 'power_6084',
    name: 'ClawDoubleClawPouncingRakeBoost',
    target: { abilities: ['Werewolf Claw', 'Double Claw', 'Pouncing Rake'] },
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
    ],
    template: 'Werewolf Claw, Double Claw, and Pouncing Rake Damage +{N}',
  },
  // Double Claw deals +2 damage and reuse time is -1 second
  {
    powerId: 'power_6087',
    name: 'DoubleClawFaster',
    target: { abilities: ['Double Claw'] },
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
      { type: 'cooldownDelta', valuePattern: /by (\d+) seconds?/ },
    ],
    template: 'Double Claw deals +{N} damage and reuse time is {N} second',
  },
  // Double Claw Damage +13
  {
    powerId: 'power_6082',
    name: 'DoubleClawFlatDmg',
    target: { abilities: ['Double Claw'] },
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
    ],
    template: 'Double Claw Damage +{N}',
  },
  // Future Pack Attacks to the same target deal +30 damage
  {
    powerId: 'power_6112',
    name: 'PackAttackBuff',
    target: { abilities: ['Future Pack Attacks to the same target'] },
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
    ],
    template: 'Future Pack Attacks to the same target deal +{N} damage',
  },
  // Pack Attack deals +4 damage and causes target to be 10% more vulnerable to Trauma damage for 10 seconds
  {
    powerId: 'power_6116',
    name: 'PackAttackDebuffTrauma',
    target: { abilities: ['Pack Attack'] },
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
    ],
    template: 'Pack Attack deals +{N} damage and causes target to be {N}% more vulnerable to Trauma damage for {N} seconds',
  },
  // After using Pack Attack, your Lycanthropy Base Damage increases +15% for 7 seconds or until you are attacked
  {
    powerId: 'power_6113',
    name: 'PackAttackDmgMod',
    target: 'self',
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'After using Pack Attack, your Lycanthropy Base Damage increases +{N}% for {N} seconds or until you are attacked',
  },
  // Pouncing Rake deals +14 Armor damage
  {
    powerId: 'power_6083',
    name: 'PouncingRakeArmorBoost',
    target: { abilities: ['Pouncing Rake'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Pouncing Rake deals +{N} Armor damage',
  },
  // Sanguine Fangs deals +36 trauma damage over 8 seconds
  {
    powerId: 'power_6132',
    name: 'SanguineFangsBleed',
    target: { abilities: ['Sanguine Fangs'] },
    effects: [
      { type: 'dot', valuePattern: /deals? \+?(\d+) trauma damage/, damageType: 'trauma', duration: 8 },
    ],
    template: 'Sanguine Fangs deals +{N} trauma damage over {N} seconds',
  },
  // For 10 seconds after using Sanguine Fangs, all other Lycanthropy attacks deal 16 Trauma damage over 8 seconds
  {
    powerId: 'power_6136',
    name: 'SanguineFangsBleedMore',
    target: 'self',
    effects: [
      { type: 'dot', valuePattern: /deals? \+?(\d+) Trauma damage/, damageType: 'Trauma', duration: 8 },
    ],
    template: 'For {N} seconds after using Sanguine Fangs, all other Lycanthropy attacks deal {N} Trauma damage over {N} seconds',
  },
  // Sanguine Fangs suddenly deals 45 Trauma damage after an 8-second delay
  {
    powerId: 'power_6134',
    name: 'SanguineFangsDelayedBoost',
    target: { abilities: ['Sanguine Fangs suddenly'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Sanguine Fangs suddenly deals {N} Trauma damage after an {N}-second delay',
  },
  // Sanguine Fangs deals +14% Crushing damage and doesn't cause the target to yell for help
  {
    powerId: 'power_6135',
    name: 'SanguineFangsNoYell',
    target: { abilities: ['Sanguine Fangs'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Sanguine Fangs deals +{N}% Crushing damage and doesn\'t cause the target to yell for help',
  },
  // Sanguine Fangs causes the target to take +5% damage from Slashing attacks for 15 seconds
  {
    powerId: 'power_6133',
    name: 'SanguineFangsVuln',
    target: { abilities: ['Sanguine Fangs causes the target to take +5%'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Sanguine Fangs causes the target to take +{N}% damage from Slashing attacks for {N} seconds',
  },
  // For 10 seconds after using See Red, all other Lycanthropy attacks deal 8 Trauma damage over 8 seconds
  {
    powerId: 'power_6153',
    name: 'SeeRedBleed',
    target: 'self',
    effects: [
      { type: 'dot', valuePattern: /deals? \+?(\d+) Trauma damage/, damageType: 'Trauma', duration: 8 },
    ],
    template: 'For {N} seconds after using See Red, all other Lycanthropy attacks deal {N} Trauma damage over {N} seconds',
  },
  // See Red deals +3 damage and Power cost is -1
  {
    powerId: 'power_6152',
    name: 'SeeRedCheaper',
    target: { abilities: ['See Red'] },
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
    ],
    template: 'See Red deals +{N} damage and Power cost is {N}',
  },
  // See Red increases the damage of your next attack by +5
  {
    powerId: 'power_6154',
    name: 'SeeRedDamage',
    target: { abilities: ['See Red increases the'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'See Red increases the damage of your next attack by +{N}',
  },
  // See Red grants you 7% melee evasion for 8 seconds
  {
    powerId: 'power_6155',
    name: 'SeeRedEvasion',
    target: 'self',
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'See Red grants you {N}% melee evasion for {N} seconds',
  },
  // See Red heals you for 8 health
  {
    powerId: 'power_6151',
    name: 'SeeRedHeal',
    target: { abilities: ['See Red'] },
    effects: [
      { type: 'restore', valuePattern: /(?:restores?|heals? you for) (\d+) health/, resourceType: 'health' },
    ],
    template: 'See Red heals you for {N} health',
  },
  // When you teleport via Shadow Feint, you recover 8 Armor and your Sprint Speed is +1 for 10 seconds
  {
    powerId: 'power_6303',
    name: 'ShadowFeintArmorAndSpeed',
    target: 'self',
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'When you teleport via Shadow Feint, you recover {N} Armor and your Sprint Speed is +{N} for {N} seconds',
  },
  // If you are reduced to 0 health while Shadow Feint is active, it automatically triggers and cancels the damage. In addition, Shadow Feint boosts your accuracy +2 until triggered.
  {
    powerId: 'power_6309',
    name: 'ShadowFeintAutoTrigger',
    target: 'self',
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'If you are reduced to {N} health while Shadow Feint is active, it automatically triggers and cancels the damage. In addition, Shadow Feint boosts your accuracy +{N} until triggered.',
  },
  // Shadow Feint causes your next attack to deal +12 damage if it is a Werewolf ability
  {
    powerId: 'power_6302',
    name: 'ShadowFeintBoostDamage',
    target: { abilities: ['Shadow Feint causes your next attack to'] },
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
    ],
    template: 'Shadow Feint causes your next attack to deal +{N} damage if it is a Werewolf ability',
  },
  // Shadow Feint raises your Lycanthropy Base Damage +7% until you trigger the teleport
  {
    powerId: 'power_6301',
    name: 'ShadowFeintBoostDmg',
    target: { abilities: ['Shadow Feint raises your Lycanthropy Base'] },
    effects: [
      { type: 'percentDamage', valuePattern: /damage[^]*?\+(\d+)%/ },
    ],
    template: 'Shadow Feint raises your Lycanthropy Base Damage +{N}% until you trigger the teleport',
  },
  // Shadow Feint reduces the taunt of all your attacks by 5% until you trigger the teleport
  {
    powerId: 'power_6305',
    name: 'ShadowFeintDetaunt',
    target: 'self',
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Shadow Feint reduces the taunt of all your attacks by {N}% until you trigger the teleport',
  },
  // When you teleport via Shadow Feint, you recover 10 Health
  {
    powerId: 'power_6304',
    name: 'ShadowFeintHeal',
    target: 'self',
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'When you teleport via Shadow Feint, you recover {N} Health',
  },
  // Skulk boosts the damage of your Core and Nice Attacks +5 for 30 seconds
  {
    powerId: 'power_6035',
    name: 'SkulkBoostCoreAndNice',
    target: { abilities: ['Skulk'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Skulk boosts the damage of your Core and Nice Attacks +{N} for {N} seconds',
  },
  // Skulk causes your next attack to deal +8% damage if it is a Crushing attack
  {
    powerId: 'power_6307',
    name: 'SkulkBoostCrushing',
    target: { abilities: ['Skulk causes your next attack to'] },
    effects: [
      { type: 'percentDamage', valuePattern: /damage[^]*?\+(\d+)%/ },
    ],
    template: 'Skulk causes your next attack to deal +{N}% damage if it is a Crushing attack',
  },
  // When Skulk is used, you recover 15 Health and all enemies within 10 meters are taunted -100
  {
    powerId: 'power_6306',
    name: 'SkulkMassiveDetaunt',
    target: 'self',
    effects: [
      { type: 'aoeDelta', valuePattern: /(?:within|targets within) (\d+) meters/ },
    ],
    template: 'When Skulk is used, you recover {N} Health and all enemies within {N} meters are taunted {N}',
  },
  // Skulk grants you +4 Mitigation against all attacks
  {
    powerId: 'power_6175',
    name: 'SkulkMitigation',
    target: 'self',
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Skulk grants you +{N} Mitigation against all attacks',
  },
  // Skulk grants you +20% Projectile Evasion
  {
    powerId: 'power_6308',
    name: 'SkulkProjectileEvasion',
    target: 'self',
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Skulk grants you +{N}% Projectile Evasion',
  },
  // Smell Fear deals +8% damage and further reduces Rage by 25
  {
    powerId: 'power_6172',
    name: 'SmellFearDeRage',
    target: { abilities: ['Smell Fear'] },
    effects: [
      { type: 'percentDamage', valuePattern: /damage[^]*?\+(\d+)%/ },
    ],
    template: 'Smell Fear deals +{N}% damage and further reduces Rage by {N}',
  },
  // Smell Fear deals +6% damage and taunts -30
  {
    powerId: 'power_6174',
    name: 'SmellFearDetaunt',
    target: { abilities: ['Smell Fear'] },
    effects: [
      { type: 'percentDamage', valuePattern: /damage[^]*?\+(\d+)%/ },
    ],
    template: 'Smell Fear deals +{N}% damage and taunts {N}',
  },
];
