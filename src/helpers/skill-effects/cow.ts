import type { PowerEffectConfig } from './types';

export const COW_EFFECTS: PowerEffectConfig[] = [
  // Chew Cud increases your mitigation versus all attacks by Elites +6 for 10 seconds
  {
    powerId: 'power_20067',
    name: 'ChewCudEliteResistance',
    target: 'self',
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Chew Cud increases your mitigation versus all attacks by Elites +{N} for {N} seconds',
  },
  // Chew Cud increases your mitigation versus Crushing, Slashing, Piercing, and Fire attacks +3 for 10 seconds. Against Elite enemies, mitigates +3 more
  {
    powerId: 'power_20062',
    name: 'ChewCudMitigationPhysicalA',
    target: 'self',
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Chew Cud increases your mitigation versus Crushing, Slashing, Piercing, and Fire attacks +{N} for {N} seconds. Against Elite enemies, mitigates +{N} more',
  },
  // Chew Cud increases your mitigation versus Crushing, Slashing, Piercing, and Cold attacks +3 for 10 seconds. Against Elite enemies, mitigates +3 more
  {
    powerId: 'power_20065',
    name: 'ChewCudMitigationPhysicalB',
    target: 'self',
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Chew Cud increases your mitigation versus Crushing, Slashing, Piercing, and Cold attacks +{N} for {N} seconds. Against Elite enemies, mitigates +{N} more',
  },
  // Chew Cud restores +4 Armor. Chance to consume grass is -4%
  {
    powerId: 'power_20066',
    name: 'ChewCudNibble',
    target: { abilities: ['Chew Cud'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Chew Cud restores +{N} Armor. Chance to consume grass is {N}%',
  },
  // Clobbering Hoof attacks have a 50% chance to deal +12% damage
  {
    powerId: 'power_20102',
    name: 'ClobberingHoofCrit',
    target: { abilities: ['Clobbering Hoof attacks have a 50% chance to'] },
    effects: [
      { type: 'percentDamage', valuePattern: /damage[^]*?\+(\d+)%/ },
    ],
    template: 'Clobbering Hoof attacks have a {N}% chance to deal +{N}% damage',
  },
  // Clobbering Hoof deals +5% damage and if target is Elite, reduces their attack damage 10% for 10 seconds
  {
    powerId: 'power_20105',
    name: 'ClobberingHoofDebuffElite',
    target: { abilities: ['Clobbering Hoof'] },
    effects: [
      { type: 'percentDamage', valuePattern: /damage[^]*?\+(\d+)%/ },
    ],
    template: 'Clobbering Hoof deals +{N}% damage and if target is Elite, reduces their attack damage {N}% for {N} seconds',
  },
  // Clobbering Hoof infects the target, causing 20 Nature damage over 10 seconds
  {
    powerId: 'power_20104',
    name: 'ClobberingHoofDoT',
    target: 'self',
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Clobbering Hoof infects the target, causing {N} Nature damage over {N} seconds',
  },
  // Clobbering Hoof deals +8% damage and taunts +25
  {
    powerId: 'power_20103',
    name: 'ClobberingHoofTaunt',
    target: { abilities: ['Clobbering Hoof'] },
    effects: [
      { type: 'percentDamage', valuePattern: /damage[^]*?\+(\d+)%/ },
    ],
    template: 'Clobbering Hoof deals +{N}% damage and taunts +{N}',
  },
  // Cow's Bash boosts your Nice Attack damage +10 for 9 seconds
  {
    powerId: 'power_20013',
    name: 'CowBashBoostNice',
    target: { abilities: ['Cow\'s Bash'] },
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
    ],
    template: 'Cow\'s Bash boosts your Nice Attack damage +{N} for {N} seconds',
  },
  // Cow's Bash costs -3 Power
  {
    powerId: 'power_20017',
    name: 'CowBashCheap',
    target: 'self',
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Cow\'s Bash costs {N} Power',
  },
  // Cow's Bash deals +5 damage, taunts +50, and reuse timer is -1 second
  {
    powerId: 'power_20008',
    name: 'CowBashFast',
    target: { abilities: ['Cow\'s Bash'] },
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
    ],
    template: 'Cow\'s Bash deals +{N} damage, taunts +{N}, and reuse timer is {N} second',
  },
  // Cow's Bash heals you for 3 health and reuse timer is -1 second
  {
    powerId: 'power_20009',
    name: 'CowBashHeal',
    target: { abilities: ['Cow\'s Bash'] },
    effects: [
      { type: 'restore', valuePattern: /(?:restores?|heals? you for) (\d+) health/, resourceType: 'health' },
    ],
    template: 'Cow\'s Bash heals you for {N} health and reuse timer is {N} second',
  },
  // Cow's Bash inflicts bugs on the target, dealing 20 Nature damage over 10 seconds
  {
    powerId: 'power_20014',
    name: 'CowBashNatureDoT',
    target: 'self',
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Cow\'s Bash inflicts bugs on the target, dealing {N} Nature damage over {N} seconds',
  },
  // Indirect Nature and Indirect Trauma damage +10% while Cow skill active
  {
    powerId: 'power_20015',
    name: 'CowBoostTraumaNature',
    target: { abilities: ['Indirect Nature', 'Indirect Trauma'] },
    effects: [
      { type: 'percentDamage', valuePattern: /damage[^]*?\+(\d+)%/ },
    ],
    template: 'Indirect Nature and Indirect Trauma damage +{N}% while Cow skill active',
  },
  // Max Power +10 and Vulnerability to Elite Attacks -0.5% when Cow skill active
  {
    powerId: 'power_20018',
    name: 'CowEliteResist',
    target: 'self',
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Max Power +{N} and Vulnerability to Elite Attacks {N}% when Cow skill active',
  },
  // Cow's Front Kick has a 50% chance to hit all enemies within 5 meters and deal +8 damage
  {
    powerId: 'power_20011',
    name: 'CowFrontKickAoE',
    target: { abilities: ['Cow\'s Front Kick'] },
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
      { type: 'aoeDelta', valuePattern: /(?:within|targets within) (\d+) meters/ },
    ],
    template: 'Cow\'s Front Kick has a {N}% chance to hit all enemies within {N} meters and deal +{N} damage',
  },
  // Cow's Front Kick has a 66% chance to deal +12 damage
  {
    powerId: 'power_20003',
    name: 'CowFrontKickCritAdd',
    target: { abilities: ['Cow\'s Front Kick'] },
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
    ],
    template: 'Cow\'s Front Kick has a {N}% chance to deal +{N} damage',
  },
  // Cow's Front Kick causes the next attack that hits you to deal -8% damage
  {
    powerId: 'power_20012',
    name: 'CowFrontKickMitigate',
    target: { abilities: ['Cow\'s Front Kick causes the next attack that hits you to'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Cow\'s Front Kick causes the next attack that hits you to deal {N}% damage',
  },
  // Cow's Front Kick deals +8% damage and taunts +40
  {
    powerId: 'power_20010',
    name: 'CowFrontKickTaunt',
    target: { abilities: ['Cow\'s Front Kick'] },
    effects: [
      { type: 'percentDamage', valuePattern: /damage[^]*?\+(\d+)%/ },
    ],
    template: 'Cow\'s Front Kick deals +{N}% damage and taunts +{N}',
  },
  // While Cow skill is active, you regenerate +2 Health every 5 seconds and resist +1 damage from Elite attacks
  {
    powerId: 'power_20201',
    name: 'CowHealthRegenBoost',
    target: 'self',
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'While Cow skill is active, you regenerate +{N} Health every {N} seconds and resist +{N} damage from Elite attacks',
  },
  // All Major Healing abilities targeting you restore +10 Health (while Cow skill active)
  {
    powerId: 'power_20064',
    name: 'CowMajorHealBoost',
    target: { abilities: ['All Major Healing abilities targeting you'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'All Major Healing abilities targeting you restore +{N} Health (while Cow skill active)',
  },
  // Stampede boosts your Slashing/Crushing/Piercing Mitigation vs. Elites +5 for 30 seconds (stacks up to 5 times)
  {
    powerId: 'power_20016',
    name: 'CowStampedeMitigation',
    target: { abilities: ['Stampede'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Stampede boosts your Slashing/Crushing/Piercing Mitigation vs. Elites +{N} for {N} seconds (stacks up to {N} times)',
  },
  // Stampede boosts your Fire/Cold/Electricity Mitigation vs. Elites +5 for 30 seconds (stacks up to 5 times)
  {
    powerId: 'power_20019',
    name: 'CowStampedeMitigationB',
    target: { abilities: ['Stampede'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Stampede boosts your Fire/Cold/Electricity Mitigation vs. Elites +{N} for {N} seconds (stacks up to {N} times)',
  },
  // Stampede boosts the damage of future Stampede attacks by +4 for 60 seconds (stacks up to 15 times)
  {
    powerId: 'power_20004',
    name: 'CowStampedeStackingAdd',
    target: { abilities: ['Stampede'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Stampede boosts the damage of future Stampede attacks by +{N} for {N} seconds (stacks up to {N} times)',
  },
  // Stampede deals +100% damage if used while you are stunned
  {
    powerId: 'power_20020',
    name: 'CowStampedeVsStunned',
    target: { abilities: ['Stampede'] },
    effects: [
      { type: 'percentDamage', valuePattern: /damage[^]*?\+(\d+)%/ },
    ],
    template: 'Stampede deals +{N}% damage if used while you are stunned',
  },
  // Deadly Emission Deals +20 Nature damage over 10 seconds and reduces targets' next attack by 20%
  {
    powerId: 'power_20406',
    name: 'DeadlyEmissionDebuff',
    target: { abilities: ['Deadly Emission Deals +20 Nature'] },
    effects: [
      { type: 'dot', valuePattern: /deals? \+?(\d+) Nature damage/, damageType: 'Nature', duration: 10 },
    ],
    template: 'Deadly Emission Deals +{N} Nature damage over {N} seconds and reduces targets\' next attack by {N}%',
  },
  // Deadly Emission Deals +40 Nature damage over 10 seconds and Taunts +25
  {
    powerId: 'power_20403',
    name: 'DeadlyEmissionDoT',
    target: { abilities: ['Deadly Emission Deals +40 Nature'] },
    effects: [
      { type: 'dot', valuePattern: /deals? \+?(\d+) Nature damage/, damageType: 'Nature', duration: 10 },
    ],
    template: 'Deadly Emission Deals +{N} Nature damage over {N} seconds and Taunts +{N}',
  },
  // Deadly Emission Damage +5 and Reuse Timer -1 second
  {
    powerId: 'power_20402',
    name: 'DeadlyEmissionFaster',
    target: { abilities: ['Deadly Emission'] },
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
    ],
    template: 'Deadly Emission Damage +{N} and Reuse Timer {N} second',
  },
  // Deadly Emission Damage +5 and Targets are Knocked Backwards
  {
    powerId: 'power_20405',
    name: 'DeadlyEmissionKnockback',
    target: { abilities: ['Deadly Emission'] },
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
    ],
    template: 'Deadly Emission Damage +{N} and Targets are Knocked Backwards',
  },
  // Graze boosts your out-of-combat sprint speed by 1.1 for 50 seconds
  {
    powerId: 'power_20061',
    name: 'GrazeSpeedBoost',
    target: { abilities: ['Graze'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Graze boosts your out-of-combat sprint speed by {N} for {N} seconds',
  },
  // Moo of Calm heals +5 health
  {
    powerId: 'power_20041',
    name: 'MooBoost',
    target: { abilities: ['Moo of Calm'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Moo of Calm heals +{N} health',
  },
  // Moo of Calm restores +6 armor
  {
    powerId: 'power_20043',
    name: 'MooBoostArmor',
    target: { abilities: ['Moo of Calm'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Moo of Calm restores +{N} armor',
  },
  // Moo of Calm restores +5 power
  {
    powerId: 'power_20042',
    name: 'MooBoostPower',
    target: { abilities: ['Moo of Calm'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Moo of Calm restores +{N} power',
  },
  // For 30 seconds after you use Moo of Calm, any internal (Poison/Trauma/Psychic) attacks that hit you are reduced by 2. This absorbed damage is added to your next Stampede attack at a 200% rate.
  {
    powerId: 'power_20044',
    name: 'MooOfCalmAbsorbInternalDamage',
    target: 'self',
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'For {N} seconds after you use Moo of Calm, any internal (Poison/Trauma/Psychic) attacks that hit you are reduced by {N}. This absorbed damage is added to your next Stampede attack at a {N}% rate.',
  },
  // For 30 seconds after you use Moo of Determination, any physical (Slashing/Piercing/Crushing) attacks that hit you are reduced by 2. This absorbed damage is added to your next Front Kick.
  {
    powerId: 'power_20303',
    name: 'MooOfDeterminationAbsorbPhysical',
    target: 'self',
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'For {N} seconds after you use Moo of Determination, any physical (Slashing/Piercing/Crushing) attacks that hit you are reduced by {N}. This absorbed damage is added to your next Front Kick.',
  },
  // For 10 seconds after using Moo of Determination, all attacks deal +10 damage
  {
    powerId: 'power_20063',
    name: 'MooOfDeterminationBoost',
    target: 'self',
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
    ],
    template: 'For {N} seconds after using Moo of Determination, all attacks deal +{N} damage',
  },
  // Moo of Determination restores +6 armor
  {
    powerId: 'power_20301',
    name: 'MooOfDeterminationHealArmor',
    target: { abilities: ['Moo of Determination'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Moo of Determination restores +{N} armor',
  },
  // Moo of Determination restores 9 Health over 9 seconds
  {
    powerId: 'power_20302',
    name: 'MooOfDeterminationRegeneration',
    target: { abilities: ['Moo of Determination'] },
    effects: [
      { type: 'restore', valuePattern: /(?:restores?|heals? you for) (\d+) Health/, resourceType: 'Health' },
    ],
    template: 'Moo of Determination restores {N} Health over {N} seconds',
  },
  // Tough Hoof deals 9 Trauma damage to the target each time they attack and damage you (within 8 seconds)
  {
    powerId: 'power_20355',
    name: 'ToughHoofDelayedDamage',
    target: { abilities: ['Tough Hoof'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Tough Hoof deals {N} Trauma damage to the target each time they attack and damage you (within {N} seconds)',
  },
  // Tough Hoof deals +13% damage and reuse timer is -1 second
  {
    powerId: 'power_20351',
    name: 'ToughHoofFaster',
    target: { abilities: ['Tough Hoof'] },
    effects: [
      { type: 'percentDamage', valuePattern: /damage[^]*?\+(\d+)%/ },
    ],
    template: 'Tough Hoof deals +{N}% damage and reuse timer is {N} second',
  },
  // Tough Hoof immediately restores 13 armor
  {
    powerId: 'power_20352',
    name: 'ToughHoofHealArmor',
    target: { abilities: ['Tough Hoof immediately'] },
    effects: [
      { type: 'restore', valuePattern: /(?:restores?|heals? you for) (\d+) armor/, resourceType: 'armor' },
    ],
    template: 'Tough Hoof immediately restores {N} armor',
  },
  // Tough Hoof deals +12 damage and taunts +200
  {
    powerId: 'power_20356',
    name: 'ToughHoofTaunt',
    target: { abilities: ['Tough Hoof'] },
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
    ],
    template: 'Tough Hoof deals +{N} damage and taunts +{N}',
  },
  // Tough Hoof costs -2 Power and mitigates +4% of all Elite attacks for 8 seconds
  {
    powerId: 'power_20353',
    name: 'ToughHoofVsElites',
    target: 'self',
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Tough Hoof costs {N} Power and mitigates +{N}% of all Elite attacks for {N} seconds',
  },
];
