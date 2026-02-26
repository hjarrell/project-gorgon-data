import type { PowerEffectConfig } from './types';

export const SHIELD_EFFECTS: PowerEffectConfig[] = [
  // While Bulwark Mode is enabled you recover 5 Armor every 3 seconds
  {
    powerId: 'power_11402',
    name: 'BulwarkModeArmor',
    target: 'self',
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'While Bulwark Mode is enabled you recover {N} Armor every {N} seconds',
  },
  // While Bulwark Mode is enabled, other abilities cost -3 Power to use
  {
    powerId: 'power_11454',
    name: 'BulwarkModePower',
    target: 'self',
    effects: [
      { type: 'costDelta', valuePattern: /[Cc]ost -(\d+)/ },
    ],
    template: 'While Bulwark Mode is enabled, other abilities cost {N} Power to use',
  },
  // While Bulwark Mode is active all your attacks taunt +50% and restore 1 Armor to you
  {
    powerId: 'power_11472',
    name: 'BulwarkModeReactiveArmor',
    target: { abilities: ['While Bulwark Mode is active all your attacks taunt +50% and'] },
    effects: [
      { type: 'restore', valuePattern: /(?:restores?|heals? you for) (\d+) Armor/, resourceType: 'Armor' },
      { type: 'tauntDelta', valuePattern: /[Tt]aunt \+(\d+)/ },
    ],
    template: 'While Bulwark Mode is active all your attacks taunt +{N}% and restore {N} Armor to you',
  },
  // While Bulwark Mode is active all your attacks taunt +50% and restore 2 Health to you
  {
    powerId: 'power_11471',
    name: 'BulwarkModeReactiveHealth',
    target: { abilities: ['While Bulwark Mode is active all your attacks taunt +50% and'] },
    effects: [
      { type: 'restore', valuePattern: /(?:restores?|heals? you for) (\d+) Health/, resourceType: 'Health' },
      { type: 'tauntDelta', valuePattern: /[Tt]aunt \+(\d+)/ },
    ],
    template: 'While Bulwark Mode is active all your attacks taunt +{N}% and restore {N} Health to you',
  },
  // Disrupting Bash causes the next attack that hits you to deal 10 less damage
  {
    powerId: 'power_11203',
    name: 'DisruptingBashAbsorb',
    target: { abilities: ['Disrupting Bash causes the next attack that hits you to'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Disrupting Bash causes the next attack that hits you to deal {N} less damage',
  },
  // Disrupting Bash causes the target to take +3% damage from Crushing attacks for 8 seconds
  {
    powerId: 'power_11452',
    name: 'DisruptingBashCrushingVuln',
    target: { abilities: ['Disrupting Bash causes the target to take +3%'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Disrupting Bash causes the target to take +{N}% damage from Crushing attacks for {N} seconds',
  },
  // Disrupting Bash further reduces target's Rage by 115
  {
    powerId: 'power_11201',
    name: 'DisruptingBashLessRage',
    target: 'self',
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Disrupting Bash further reduces target\'s Rage by {N}',
  },
  // Elemental Ward boosts your direct and indirect Electricity damage +4 for 30 seconds
  {
    powerId: 'power_11353',
    name: 'ElementalWardBuffElectricity',
    target: { abilities: ['Elemental Ward'] },
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
    ],
    template: 'Elemental Ward boosts your direct and indirect Electricity damage +{N} for {N} seconds',
  },
  // Elemental Ward mitigates +2 elemental damage (Fire, Cold, and Electricity) for 30 seconds. Against Elite attackers, mitigates +2 more
  {
    powerId: 'power_11354',
    name: 'ElementalWardResist',
    target: { abilities: ['Elemental Ward mitigates +2 elemental'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Elemental Ward mitigates +{N} elemental damage (Fire, Cold, and Electricity) for {N} seconds. Against Elite attackers, mitigates +{N} more',
  },
  // Elemental Ward mitigates +12 Darkness damage for 30 seconds
  {
    powerId: 'power_11351',
    name: 'ElementalWardResistDarkness',
    target: { abilities: ['Elemental Ward mitigates +12 Darkness'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Elemental Ward mitigates +{N} Darkness damage for {N} seconds',
  },
  // Elemental Ward mitigates +6 direct Trauma damage for 30 seconds
  {
    powerId: 'power_11352',
    name: 'ElementalWardResistTrauma',
    target: { abilities: ['Elemental Ward mitigates +6 direct Trauma'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Elemental Ward mitigates +{N} direct Trauma damage for {N} seconds',
  },
  // Fight Me You Fools boosts Core Attack Damage +25 for 6 seconds
  {
    powerId: 'power_11652',
    name: 'FightMeYouFoolsBoostCore',
    target: { abilities: ['Fight Me You Fools'] },
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
    ],
    template: 'Fight Me You Fools boosts Core Attack Damage +{N} for {N} seconds',
  },
  // Fight Me You Fools deals +3% damage and restores 32 Health over 8 seconds
  {
    powerId: 'power_11553',
    name: 'FightMeYouFoolsHoT',
    target: { abilities: ['Fight Me You Fools'] },
    effects: [
      { type: 'percentDamage', valuePattern: /damage[^]*?\+(\d+)%/ },
      { type: 'restore', valuePattern: /(?:restores?|heals? you for) (\d+) Health/, resourceType: 'Health' },
    ],
    template: 'Fight Me You Fools deals +{N}% damage and restores {N} Health over {N} seconds',
  },
  // Fight Me You Fools deals +5% damage and taunts +25
  {
    powerId: 'power_11552',
    name: 'FightMeYouFoolsTaunt',
    target: { abilities: ['Fight Me You Fools'] },
    effects: [
      { type: 'percentDamage', valuePattern: /damage[^]*?\+(\d+)%/ },
    ],
    template: 'Fight Me You Fools deals +{N}% damage and taunts +{N}',
  },
  // Finish It Damage +5% and Power Cost -3
  {
    powerId: 'power_11602',
    name: 'FinishItPowerCostReduced',
    target: { abilities: ['Finish It'] },
    effects: [
      { type: 'percentDamage', valuePattern: /damage[^]*?\+(\d+)%/ },
      { type: 'costDelta', valuePattern: /[Cc]ost -(\d+)/ },
    ],
    template: 'Finish It Damage +{N}% and Power Cost {N}',
  },
  // Finish It Restores 16 Health
  {
    powerId: 'power_11603',
    name: 'FinishItRestoreHealth',
    target: 'self',
    effects: [
      { type: 'restore', valuePattern: /(?:restores?|heals? you for) (\d+) Health/, resourceType: 'Health' },
    ],
    template: 'Finish It Restores {N} Health',
  },
  // Fire Shield deals +12 Fire damage to melee attackers
  {
    powerId: 'power_11705',
    name: 'FireShieldBoost',
    target: { abilities: ['Fire Shield'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Fire Shield deals +{N} Fire damage to melee attackers',
  },
  // Fire Shield causes melee attackers to ignite, dealing 30 Fire damage over 10 seconds
  {
    powerId: 'power_11704',
    name: 'FireShieldBurn',
    target: { abilities: ['Fire Shield causes melee attackers to'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Fire Shield causes melee attackers to ignite, dealing {N} Fire damage over {N} seconds',
  },
  // Fire Shield boosts your direct and indirect Cold mitigation +1 for 20 seconds
  {
    powerId: 'power_11702',
    name: 'FireShieldColdMitigation',
    target: { abilities: ['Fire Shield'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Fire Shield boosts your direct and indirect Cold mitigation +{N} for {N} seconds',
  },
  // Fire Shield boosts your direct and indirect Fire mitigation +1 for 20 seconds
  {
    powerId: 'power_11703',
    name: 'FireShieldFireMitigation',
    target: { abilities: ['Fire Shield'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Fire Shield boosts your direct and indirect Fire mitigation +{N} for {N} seconds',
  },
  // Infuriating Bash deals +11% damage and taunts +30
  {
    powerId: 'power_11253',
    name: 'InfuriatingBashBoostTaunt',
    target: { abilities: ['Infuriating Bash'] },
    effects: [
      { type: 'percentDamage', valuePattern: /damage[^]*?\+(\d+)%/ },
    ],
    template: 'Infuriating Bash deals +{N}% damage and taunts +{N}',
  },
  // Infuriating Bash deals +3 damage and boosts your Indirect Acid Damage +5 for 7 seconds
  {
    powerId: 'power_11254',
    name: 'InfuriatingBashBuffAcid',
    target: { abilities: ['Infuriating Bash'] },
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
    ],
    template: 'Infuriating Bash deals +{N} damage and boosts your Indirect Acid Damage +{N} for {N} seconds',
  },
  // Infuriating Bash reduces the Power cost of melee attacks by 1 for 6 seconds
  {
    powerId: 'power_11251',
    name: 'InfuriatingBashCheapMelee',
    target: { abilities: ['Infuriating Bash reduces the Power'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Infuriating Bash reduces the Power cost of melee attacks by {N} for {N} seconds',
  },
  // When you are hit, Finish It damage is +10 for 40 seconds (stacks up to 15 times)
  {
    powerId: 'power_11604',
    name: 'OnHitBoostFinishIt',
    target: { abilities: ['When you are hit', 'Finish It'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'When you are hit, Finish It damage is +{N} for {N} seconds (stacks up to {N} times)',
  },
  // When you are hit, all Shield abilities taunt +12 for 30 seconds (stacks up to 20 times)
  {
    powerId: 'power_11403',
    name: 'OnHitBoostShieldTaunt',
    target: 'self',
    effects: [
      { type: 'tauntDelta', valuePattern: /[Tt]aunt \+(\d+)/ },
    ],
    template: 'When you are hit, all Shield abilities taunt +{N} for {N} seconds (stacks up to {N} times)',
  },
  // When you are hit by a monster's Rage Attack, Reinforce restores +6 Armor for 60 seconds (stacks up to 10 times)
  {
    powerId: 'power_11405',
    name: 'OnRageHitBoostReinforce',
    target: { abilities: ['When you are hit by a monster\'s Rage Attack', 'Reinforce'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'When you are hit by a monster\'s Rage Attack, Reinforce restores +{N} Armor for {N} seconds (stacks up to {N} times)',
  },
  // When you are hit by a monster's Rage Attack, the current reuse timer of Stunning Bash is hastened by 1 second and your next Stunning Bash deals +5 damage
  {
    powerId: 'power_11051',
    name: 'OnRageHitBoostStunningBash',
    target: 'self',
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
      { type: 'cooldownDelta', valuePattern: /by (\d+) seconds?/ },
    ],
    template: 'When you are hit by a monster\'s Rage Attack, the current reuse timer of Stunning Bash is hastened by {N} second and your next Stunning Bash deals +{N} damage',
  },
  // Reinforce causes your Major Healing abilities to restore +7 for 10 seconds
  {
    powerId: 'power_11404',
    name: 'ReinforceBoostMajorHeal',
    target: { abilities: ['Reinforce causes your Major Healing abilities to'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Reinforce causes your Major Healing abilities to restore +{N} for {N} seconds',
  },
  // Reinforce boosts your Nice Attack Damage +10 for 9 seconds
  {
    powerId: 'power_11456',
    name: 'ReinforceBoostNice',
    target: { abilities: ['Reinforce'] },
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
    ],
    template: 'Reinforce boosts your Nice Attack Damage +{N} for {N} seconds',
  },
  // Reinforce restores +15 Armor and Shield Team restores +8 Armor
  {
    powerId: 'power_11401',
    name: 'ReinforceShieldTeamHealArmor',
    target: { abilities: ['Reinforce'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Reinforce restores +{N} Armor and Shield Team restores +{N} Armor',
  },
  // All Shield attacks have a 10% chance to conjure a force-shield that mitigates 10% of all nature, darkness, demonic, and acid damage for 30 seconds (or until 100 damage is absorbed). Stacks up to 5 times
  {
    powerId: 'power_11015',
    name: 'ShieldAttacksMitigateEsoteric',
    target: { skill: 'Shield' },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'All Shield attacks have a {N}% chance to conjure a force-shield that mitigates {N}% of all nature, darkness, demonic, and acid damage for {N} seconds (or until {N} damage is absorbed). Stacks up to {N} times',
  },
  // All Shield attacks have a 10% chance to conjure a force-shield that mitigates 10% of all slashing, crushing, and piercing damage for 30 seconds (or until 100 damage is absorbed). Stacks up to 5 times
  {
    powerId: 'power_11014',
    name: 'ShieldAttacksMitigatePhysical',
    target: { skill: 'Shield' },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'All Shield attacks have a {N}% chance to conjure a force-shield that mitigates {N}% of all slashing, crushing, and piercing damage for {N} seconds (or until {N} damage is absorbed). Stacks up to {N} times',
  },
  // All Shield Bash Abilities deal +5 damage and hasten the current reuse timer of Fight Me You Fools by 1 second
  {
    powerId: 'power_11701',
    name: 'ShieldBashHastenFightMeYouFools',
    target: { abilities: ['All Shield Bash Abilities'] },
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
      { type: 'cooldownDelta', valuePattern: /by (\d+) seconds?/ },
    ],
    template: 'All Shield Bash Abilities deal +{N} damage and hasten the current reuse timer of Fight Me You Fools by {N} second',
  },
  // All Shield Bash Abilities deal +5 damage and hasten the current reuse timer of Finish It by 1 second
  {
    powerId: 'power_11605',
    name: 'ShieldBashHastenFinishIt',
    target: { abilities: ['All Shield Bash Abilities'] },
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
      { type: 'cooldownDelta', valuePattern: /by (\d+) seconds?/ },
    ],
    template: 'All Shield Bash Abilities deal +{N} damage and hasten the current reuse timer of Finish It by {N} second',
  },
  // All types of shield Bash attacks restore 6 Armor
  {
    powerId: 'power_11012',
    name: 'ShieldBashRestoreArmor',
    target: { abilities: ['All types of shield Bash attacks'] },
    effects: [
      { type: 'restore', valuePattern: /(?:restores?|heals? you for) (\d+) Armor/, resourceType: 'Armor' },
    ],
    template: 'All types of shield Bash attacks restore {N} Armor',
  },
  // While the Shield skill is active, you mitigate 1 point of attack damage for every 20 Armor you have remaining. (Normally, you would mitigate 1 for every 25 Armor remaining.)
  {
    powerId: 'power_11013',
    name: 'ShieldImprovedArmorMitigation',
    target: 'self',
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'While the Shield skill is active, you mitigate {N} point of attack damage for every {N} Armor you have remaining. (Normally, you would mitigate {N} for every {N} Armor remaining.)',
  },
  // Max Armor +3, Direct Acid Mitigation +2, and Indirect Acid Mitigation +1 while Shield skill active
  {
    powerId: 'power_11103',
    name: 'ShieldMitigateAcid',
    target: 'self',
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Max Armor +{N}, Direct Acid Mitigation +{N}, and Indirect Acid Mitigation +{N} while Shield skill active',
  },
  // While Shield skill active: Mitigate Slashing +2, Piercing +2, and Crushing +2. Versus Elite attackers, these values are doubled
  {
    powerId: 'power_11102',
    name: 'ShieldMitigatePhysical',
    target: 'self',
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'While Shield skill active: Mitigate Slashing +{N}, Piercing +{N}, and Crushing +{N}. Versus Elite attackers, these values are doubled',
  },
  // Chance to Ignore Knockbacks +33%, Chance to Ignore Stuns +20%
  {
    powerId: 'power_11651',
    name: 'ShieldStunAndKnockbackIgnore',
    target: 'self',
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Chance to Ignore Knockbacks +{N}%, Chance to Ignore Stuns +{N}%',
  },
  // Shield Team grants all allies +2 mitigation of all physical attacks (Crushing, Slashing, or Piercing) for 20 seconds
  {
    powerId: 'power_11453',
    name: 'ShieldTeamBoostMitigation',
    target: 'self',
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Shield Team grants all allies +{N} mitigation of all physical attacks (Crushing, Slashing, or Piercing) for {N} seconds',
  },
  // Shield Team causes all targets' Survival Utility abilities to restore 16 Armor to them. Lasts 20 seconds
  {
    powerId: 'power_11455',
    name: 'ShieldTeamBoostSurvivalUtility',
    target: { abilities: ['Shield Team causes all targets\' Survival Utility abilities to'] },
    effects: [
      { type: 'restore', valuePattern: /(?:restores?|heals? you for) (\d+) Armor/, resourceType: 'Armor' },
    ],
    template: 'Shield Team causes all targets\' Survival Utility abilities to restore {N} Armor to them. Lasts {N} seconds',
  },
  // Shield Team grants all allies 3% evasion of burst attacks for 10 seconds
  {
    powerId: 'power_11451',
    name: 'ShieldTeamBurstDefense',
    target: 'self',
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Shield Team grants all allies {N}% evasion of burst attacks for {N} seconds',
  },
  // Strategic Preparation boosts your in-combat Armor regeneration +2 for 20 seconds
  {
    powerId: 'power_11302',
    name: 'StrategicPreparationBoostCombatArmorRegen',
    target: { abilities: ['Strategic Preparation'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Strategic Preparation boosts your in-combat Armor regeneration +{N} for {N} seconds',
  },
  // Strategic Preparation causes your next attack to deal +10 damage if it is a Crushing, Slashing, or Piercing attack
  {
    powerId: 'power_11303',
    name: 'StrategicPreparationBoostNextAttack',
    target: { abilities: ['Strategic Preparation causes your next attack to'] },
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
    ],
    template: 'Strategic Preparation causes your next attack to deal +{N} damage if it is a Crushing, Slashing, or Piercing attack',
  },
  // Strategic Preparation boosts your Indirect Acid Damage +25% for 20 seconds
  {
    powerId: 'power_11301',
    name: 'StrategicPreparationBuffAcid',
    target: { abilities: ['Strategic Preparation'] },
    effects: [
      { type: 'percentDamage', valuePattern: /damage[^]*?\+(\d+)%/ },
    ],
    template: 'Strategic Preparation boosts your Indirect Acid Damage +{N}% for {N} seconds',
  },
  // Stunning Bash causes the target to take 30 Trauma damage over 12 seconds
  {
    powerId: 'power_11105',
    name: 'StunningBashBleed',
    target: { abilities: ['Stunning Bash causes the target to take 30 Trauma'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Stunning Bash causes the target to take {N} Trauma damage over {N} seconds',
  },
  // Take the Lead heals you for 6 Health after a 15 second delay
  {
    powerId: 'power_11501',
    name: 'TakeTheLeadHeal',
    target: { abilities: ['Take the Lead'] },
    effects: [
      { type: 'restore', valuePattern: /(?:restores?|heals? you for) (\d+) Health/, resourceType: 'Health' },
    ],
    template: 'Take the Lead heals you for {N} Health after a {N} second delay',
  },
  // Take the Lead boosts your movement speed +1 and you recover 15 Power after a 15 second delay
  {
    powerId: 'power_11502',
    name: 'TakeTheLeadSpeed',
    target: { abilities: ['Take the Lead'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Take the Lead boosts your movement speed +{N} and you recover {N} Power after a {N} second delay',
  },
  // Take the Lead boosts the taunt of all your attacks +10%
  {
    powerId: 'power_11503',
    name: 'TakeTheLeadTaunt',
    target: { abilities: ['Take the Lead'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Take the Lead boosts the taunt of all your attacks +{N}%',
  },
];
