import type { PowerEffectConfig } from './types';

export const ARCHERY_EFFECTS: PowerEffectConfig[] = [
  // Acid Arrow deals 15 Poison damage after a 6-second delay
  {
    powerId: 'power_10312',
    name: 'AcidArrowDoT',
    target: { abilities: ['Acid Arrow'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Acid Arrow deals {N} Poison damage after a {N}-second delay',
  },
  // Acid Arrow deals +14 damage to Armor
  {
    powerId: 'power_10307',
    name: 'AcidArrowMeltArmor',
    target: { abilities: ['Acid Arrow'] },
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
    ],
    template: 'Acid Arrow deals +{N} damage to Armor',
  },
  // Acid Arrow generates no Taunt, generates no Rage, and reduces Rage by 40
  {
    powerId: 'power_10310',
    name: 'AcidArrowReduceRage',
    target: 'self',
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Acid Arrow generates no Taunt, generates no Rage, and reduces Rage by {N}',
  },
  // Blitz Shot and Aimed Shot heal you for 5 health
  {
    powerId: 'power_10003',
    name: 'AimedAndBlitzShotHeal',
    target: { abilities: ['Blitz Shot', 'Aimed Shot'] },
    effects: [
      { type: 'restore', valuePattern: /(?:restores?|heals? you for) (\d+) health/, resourceType: 'health' },
    ],
    template: 'Blitz Shot and Aimed Shot heal you for {N} health',
  },
  // Aimed Shot deals +6% damage and boosts your Accuracy +5 for 10 seconds
  {
    powerId: 'power_10044',
    name: 'AimedShotBoostAccuracy',
    target: { abilities: ['Aimed Shot'] },
    effects: [
      { type: 'percentDamage', valuePattern: /damage[^]*?\+(\d+)%/ },
    ],
    template: 'Aimed Shot deals +{N}% damage and boosts your Accuracy +{N} for {N} seconds',
  },
  // Aimed Shot deals +4 damage, has +4% Critical Hit Chance, and also grants this Critical Hit Chance bonus to your next Archery attack
  {
    powerId: 'power_10045',
    name: 'AimedShotBoostCrit',
    target: { abilities: ['Aimed Shot'] },
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
    ],
    template: 'Aimed Shot deals +{N} damage, has +{N}% Critical Hit Chance, and also grants this Critical Hit Chance bonus to your next Archery attack',
  },
  // Aimed Shot boosts your Nice Attack Damage +25 for 10 seconds
  {
    powerId: 'power_10043',
    name: 'AimedShotBoostNice',
    target: { abilities: ['Aimed Shot'] },
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
    ],
    template: 'Aimed Shot boosts your Nice Attack Damage +{N} for {N} seconds',
  },
  // Aimed Shot deals 12 Trauma damage to health over 12 seconds
  {
    powerId: 'power_10042',
    name: 'AimedShotDoT',
    target: { abilities: ['Aimed Shot'] },
    effects: [
      { type: 'dot', valuePattern: /deals? \+?(\d+) Trauma damage/, damageType: 'Trauma', duration: 12 },
    ],
    template: 'Aimed Shot deals {N} Trauma damage to health over {N} seconds',
  },
  // Direct Fire Damage +10 and Indirect Fire +1 (per tick) while Archery skill active.
  {
    powerId: 'power_10008',
    name: 'ArcheryBoostFire',
    target: { abilities: ['Direct Fire'] },
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
    ],
    template: 'Direct Fire Damage +{N} and Indirect Fire +{N} (per tick) while Archery skill active.',
  },
  // Direct Poison and Acid Damage +10 and Indirect Poison and Acid +1 (per tick) while Archery skill active.
  {
    powerId: 'power_10007',
    name: 'ArcheryBoostPoisonAndAcid',
    target: { abilities: ['Direct Poison', 'Acid'] },
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
    ],
    template: 'Direct Poison and Acid Damage +{N} and Indirect Poison and Acid +{N} (per tick) while Archery skill active.',
  },
  // When an Archery attack Critically Hits, you erupt in a burst of acid, dealing 4 Health and 4 Armor Damage to all foes within 8 meters. This effect is increased by treasure that boosts Acid Arrow
  {
    powerId: 'power_10315',
    name: 'ArcheryCritAcidBomb',
    target: 'self',
    effects: [
      { type: 'aoeDelta', valuePattern: /(?:within|targets within) (\d+) meters/ },
    ],
    template: 'When an Archery attack Critically Hits, you erupt in a burst of acid, dealing {N} Health and {N} Armor Damage to all foes within {N} meters. This effect is increased by treasure that boosts Acid Arrow',
  },
  // Archery attacks that Critically Hit restore 5 Power and boost your Anatomy Critical Hit Chance +1% for 20 seconds
  {
    powerId: 'power_10004',
    name: 'ArcheryCritFaster',
    target: { abilities: ['Archery attacks that Critically Hit'] },
    effects: [
      { type: 'restore', valuePattern: /(?:restores?|heals? you for) (\d+) Power/, resourceType: 'Power' },
      { type: 'critChanceDelta', valuePattern: /[Cc]ritical [Hh]it [Cc]hance \+(\d+)%/ },
    ],
    template: 'Archery attacks that Critically Hit restore {N} Power and boost your Anatomy Critical Hit Chance +{N}% for {N} seconds',
  },
  // Archery attacks that Critically Hit deal 30 Poison damage over 12 seconds. This amount is further increased by treasure that boosts Poison Arrow's damage-over-time
  {
    powerId: 'power_10010',
    name: 'ArcheryCritPoison',
    target: { abilities: ['Archery attacks that Critically Hit'] },
    effects: [
      { type: 'dot', valuePattern: /deals? \+?(\d+) Poison damage/, damageType: 'Poison', duration: 12 },
    ],
    template: 'Archery attacks that Critically Hit deal {N} Poison damage over {N} seconds. This amount is further increased by treasure that boosts Poison Arrow\'s damage-over-time',
  },
  // Blitz Shot Damage +15%
  {
    powerId: 'power_10402',
    name: 'BlitzShotBoost',
    target: { abilities: ['Blitz Shot'] },
    effects: [
      { type: 'percentDamage', valuePattern: /damage[^]*?\+(\d+)%/ },
    ],
    template: 'Blitz Shot Damage +{N}%',
  },
  // Blitz Shot boosts your healing from Combat Refreshes +2 for 30 seconds
  {
    powerId: 'power_10162',
    name: 'BlitzShotHeal',
    target: { abilities: ['Blitz Shot'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Blitz Shot boosts your healing from Combat Refreshes +{N} for {N} seconds',
  },
  // Blitz Shot deals +3 damage, and the damage type becomes Poison.
  {
    powerId: 'power_10163',
    name: 'BlitzShotPoison',
    target: { abilities: ['Blitz Shot'] },
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
    ],
    template: 'Blitz Shot deals +{N} damage, and the damage type becomes Poison.',
  },
  // Bow Bash heals you for 1 health
  {
    powerId: 'power_10452',
    name: 'BowBashHeal',
    target: { abilities: ['Bow Bash'] },
    effects: [
      { type: 'restore', valuePattern: /(?:restores?|heals? you for) (\d+) health/, resourceType: 'health' },
    ],
    template: 'Bow Bash heals you for {N} health',
  },
  // Bow Bash deals +40 damage and knocks the target backwards, but ability's reuse timer is +3 seconds
  {
    powerId: 'power_10454',
    name: 'BowBashKnockback',
    target: { abilities: ['Bow Bash'] },
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
    ],
    template: 'Bow Bash deals +{N} damage and knocks the target backwards, but ability\'s reuse timer is +{N} seconds',
  },
  // Bow Bash gives you +1 mitigation of any physical damage for 20 seconds. (This effect does not stack with itself.)
  {
    powerId: 'power_10451',
    name: 'BowBashMitigation',
    target: { abilities: ['Bow Bash gives you +1 mitigation of any physical'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Bow Bash gives you +{N} mitigation of any physical damage for {N} seconds. (This effect does not stack with itself.)',
  },
  // Bow Bash deals +10% damage and taunts +5
  {
    powerId: 'power_10455',
    name: 'BowBashTaunt',
    target: { abilities: ['Bow Bash'] },
    effects: [
      { type: 'percentDamage', valuePattern: /damage[^]*?\+(\d+)%/ },
    ],
    template: 'Bow Bash deals +{N}% damage and taunts +{N}',
  },
  // Fire Arrow, Poison Arrow, and Acid Arrow Damage +6%
  {
    powerId: 'power_10304',
    name: 'ElementalArrowBoost',
    target: { abilities: ['Fire Arrow', 'Poison Arrow', 'Acid Arrow'] },
    effects: [
      { type: 'percentDamage', valuePattern: /damage[^]*?\+(\d+)%/ },
    ],
    template: 'Fire Arrow, Poison Arrow, and Acid Arrow Damage +{N}%',
  },
  // Fire Arrow deals an additional 15 Fire damage over 10 seconds
  {
    powerId: 'power_10301',
    name: 'FireArrowBoost',
    target: { abilities: ['Fire Arrow'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Fire Arrow deals an additional {N} Fire damage over {N} seconds',
  },
  // Fire Arrow suddenly deals an additional 50 indirect Fire damage after a 6 second delay
  {
    powerId: 'power_10308',
    name: 'FireArrowExplode',
    target: { abilities: ['Fire Arrow suddenly'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Fire Arrow suddenly deals an additional {N} indirect Fire damage after a {N} second delay',
  },
  // Acid Arrow and Poison Arrow hasten the current reuse timer of Fire Arrow by -5 seconds
  {
    powerId: 'power_10314',
    name: 'FireArrowFaster',
    target: { abilities: ['Acid Arrow', 'Poison Arrow hasten the current'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Acid Arrow and Poison Arrow hasten the current reuse timer of Fire Arrow by {N} seconds',
  },
  // After using Fire Arrow, your next Archery attack will simultaneously shoot a Fire Arrow 1 at a separate target within 8 meters of that attack's main target. This extra Fire Arrow consumes ammunition as normal.
  {
    powerId: 'power_10313',
    name: 'FireArrowSplit',
    target: 'self',
    effects: [
      { type: 'aoeDelta', valuePattern: /(?:within|targets within) (\d+) meters/ },
    ],
    template: 'After using Fire Arrow, your next Archery attack will simultaneously shoot a Fire Arrow {N} at a separate target within {N} meters of that attack\'s main target. This extra Fire Arrow consumes ammunition as normal.',
  },
  // Fire Arrow deals +8 damage and taunts +50
  {
    powerId: 'power_10305',
    name: 'FireArrowTaunt',
    target: { abilities: ['Fire Arrow'] },
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
    ],
    template: 'Fire Arrow deals +{N} damage and taunts +{N}',
  },
  // Heavy Multishot boosts the damage of your Nice Attacks and Epic Attacks +15 for 10 seconds
  {
    powerId: 'power_10456',
    name: 'HeavyMultishotBuffNiceAndEpic',
    target: { abilities: ['Heavy Multishot'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Heavy Multishot boosts the damage of your Nice Attacks and Epic Attacks +{N} for {N} seconds',
  },
  // Heavy Shot and Heavy Multishot Damage +6%
  {
    powerId: 'power_10201',
    name: 'HeavyShotAndHeavyMultiShotBoost',
    target: { abilities: ['Heavy Shot', 'Heavy Multishot'] },
    effects: [
      { type: 'percentDamage', valuePattern: /damage[^]*?\+(\d+)%/ },
    ],
    template: 'Heavy Shot and Heavy Multishot Damage +{N}%',
  },
  // Heavy Shot deals +5% damage and reuse timer is -1 seconds
  {
    powerId: 'power_10202',
    name: 'HeavyShotFasterReuse',
    target: { abilities: ['Heavy Shot'] },
    effects: [
      { type: 'percentDamage', valuePattern: /damage[^]*?\+(\d+)%/ },
    ],
    template: 'Heavy Shot deals +{N}% damage and reuse timer is {N} seconds',
  },
  // Hook Shot deals +18 Poison damage over 12 seconds
  {
    powerId: 'power_10554',
    name: 'HookShotDoT',
    target: { abilities: ['Hook Shot'] },
    effects: [
      { type: 'dot', valuePattern: /deals? \+?(\d+) Poison damage/, damageType: 'Poison', duration: 12 },
    ],
    template: 'Hook Shot deals +{N} Poison damage over {N} seconds',
  },
  // Hook Shot Damage +5. Non-Elite targets do not call for help.
  {
    powerId: 'power_10551',
    name: 'HookShotSneaky',
    target: { abilities: ['Hook Shot'] },
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
    ],
    template: 'Hook Shot Damage +{N}. Non-Elite targets do not call for help.',
  },
  // Hook Shot and Bow Bash deal +20% damage to Stunned targets.
  {
    powerId: 'power_10553',
    name: 'HookShotVsStun',
    target: { abilities: ['Hook Shot', 'Bow Bash'] },
    effects: [
      { type: 'percentDamage', valuePattern: /damage[^]*?\+(\d+)%/ },
    ],
    template: 'Hook Shot and Bow Bash deal +{N}% damage to Stunned targets.',
  },
  // Hook Shot increases target's vulnerability to Fire and Poison +1% for 20 seconds. (Max of 2 stacks.)
  {
    powerId: 'power_10552',
    name: 'HookShotVuln',
    target: 'self',
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Hook Shot increases target\'s vulnerability to Fire and Poison +{N}% for {N} seconds. (Max of {N} stacks.)',
  },
  // Long Shot boosts your Epic Attack Damage +1% for 15 seconds
  {
    powerId: 'power_10122',
    name: 'LongShotBoostEpic',
    target: { abilities: ['Long Shot'] },
    effects: [
      { type: 'percentDamage', valuePattern: /damage[^]*?\+(\d+)%/ },
    ],
    template: 'Long Shot boosts your Epic Attack Damage +{N}% for {N} seconds',
  },
  // Long Shot restores 10 health to you after an 8 second delay
  {
    powerId: 'power_10124',
    name: 'LongShotDelayedHeal',
    target: { abilities: ['Long Shot'] },
    effects: [
      { type: 'restore', valuePattern: /(?:restores?|heals? you for) (\d+) health/, resourceType: 'health' },
    ],
    template: 'Long Shot restores {N} health to you after an {N} second delay',
  },
  // Long Shot and Hook Shot Damage +10
  {
    powerId: 'power_10123',
    name: 'LongShotHookShotBoost',
    target: { abilities: ['Long Shot', 'Hook Shot'] },
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
    ],
    template: 'Long Shot and Hook Shot Damage +{N}',
  },
  // Long Shot increases target's vulnerability to Poison, Trauma, and Acid +1% for 20 seconds. (Max of 2 stacks.)
  {
    powerId: 'power_10125',
    name: 'LongShotVuln',
    target: 'self',
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Long Shot increases target\'s vulnerability to Poison, Trauma, and Acid +{N}% for {N} seconds. (Max of {N} stacks.)',
  },
  // Mangling Shot deals 24 Trauma damage over 12 seconds
  {
    powerId: 'power_10502',
    name: 'ManglingShotBleed',
    target: { abilities: ['Mangling Shot'] },
    effects: [
      { type: 'dot', valuePattern: /deals? \+?(\d+) Trauma damage/, damageType: 'Trauma', duration: 12 },
    ],
    template: 'Mangling Shot deals {N} Trauma damage over {N} seconds',
  },
  // Mangling Shot deals +7% damage and slows target's movement by 25%
  {
    powerId: 'power_10501',
    name: 'ManglingShotBoost',
    target: { abilities: ['Mangling Shot'] },
    effects: [
      { type: 'percentDamage', valuePattern: /damage[^]*?\+(\d+)%/ },
    ],
    template: 'Mangling Shot deals +{N}% damage and slows target\'s movement by {N}%',
  },
  // Mangling Shot deals +5% damage and causes target's attacks to deal -1 damage for 20 seconds
  {
    powerId: 'power_10504',
    name: 'ManglingShotDebuff',
    target: { abilities: ['Mangling Shot'] },
    effects: [
      { type: 'percentDamage', valuePattern: /damage[^]*?\+(\d+)%/ },
    ],
    template: 'Mangling Shot deals +{N}% damage and causes target\'s attacks to deal {N} damage for {N} seconds',
  },
  // Mangling Shot causes target to take +4% damage from Piercing for 10 seconds
  {
    powerId: 'power_10503',
    name: 'ManglingShotPiercingVuln',
    target: { abilities: ['Mangling Shot causes target to take +4%'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Mangling Shot causes target to take +{N}% damage from Piercing for {N} seconds',
  },
  // After using Mangling Shot, your next Archery attack will simultaneously shoot a Mangling Shot 1 at a separate target within 8 meters of that attack's main target. This extra Mangling Shot consumes ammunition as normal.
  {
    powerId: 'power_10510',
    name: 'ManglingShotSplit',
    target: 'self',
    effects: [
      { type: 'aoeDelta', valuePattern: /(?:within|targets within) (\d+) meters/ },
    ],
    template: 'After using Mangling Shot, your next Archery attack will simultaneously shoot a Mangling Shot {N} at a separate target within {N} meters of that attack\'s main target. This extra Mangling Shot consumes ammunition as normal.',
  },
  // Multishot and Heavy Multishot Damage +16 and Power Cost -1
  {
    powerId: 'power_10005',
    name: 'MultiArrowsLowerPowerCost',
    target: { abilities: ['Multishot', 'Heavy Multishot'] },
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
      { type: 'costDelta', valuePattern: /[Cc]ost -(\d+)/ },
    ],
    template: 'Multishot and Heavy Multishot Damage +{N} and Power Cost {N}',
  },
  // Multishot restores 12 Health to you after an 8 second delay
  {
    powerId: 'power_10082',
    name: 'MultiShotDelayedHeal',
    target: { abilities: ['Multishot'] },
    effects: [
      { type: 'restore', valuePattern: /(?:restores?|heals? you for) (\d+) Health/, resourceType: 'Health' },
    ],
    template: 'Multishot restores {N} Health to you after an {N} second delay',
  },
  // Multishot deals +4 damage, and the damage type becomes Fire.
  {
    powerId: 'power_10083',
    name: 'MultiShotFire',
    target: { abilities: ['Multishot'] },
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
    ],
    template: 'Multishot deals +{N} damage, and the damage type becomes Fire.',
  },
  // Poison Arrow deals +24 Poison damage over 12 seconds
  {
    powerId: 'power_10311',
    name: 'PoisonArrowDoT',
    target: { abilities: ['Poison Arrow'] },
    effects: [
      { type: 'dot', valuePattern: /deals? \+?(\d+) Poison damage/, damageType: 'Poison', duration: 12 },
    ],
    template: 'Poison Arrow deals +{N} Poison damage over {N} seconds',
  },
  // Poison Arrow increases the target's Poison Vulnerability +4% for 10 seconds
  {
    powerId: 'power_10306',
    name: 'PoisonArrowPoisonVuln',
    target: 'self',
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Poison Arrow increases the target\'s Poison Vulnerability +{N}% for {N} seconds',
  },
  // Poison Arrow makes target's attacks deal -2 damage for 20 seconds
  {
    powerId: 'power_10309',
    name: 'PoisonArrowWeaken',
    target: { abilities: ['Poison Arrow makes target\'s attacks'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Poison Arrow makes target\'s attacks deal {N} damage for {N} seconds',
  },
  // Restorative Arrow targets yourself and all allies within 30 meters and restores +6 Health, but reuse time is +10 seconds
  {
    powerId: 'power_10509',
    name: 'RestorativeArrowAoE',
    target: 'self',
    effects: [
      { type: 'aoeDelta', valuePattern: /(?:within|targets within) (\d+) meters/ },
    ],
    template: 'Restorative Arrow targets yourself and all allies within {N} meters and restores +{N} Health, but reuse time is +{N} seconds',
  },
  // Restorative Arrow covers the target in a barrier that mitigates 2 damage from Crushing, Slashing, Piercing, Acid, and Fire attacks. Lasts for 20 seconds or until it has absorbed 10 total damage.
  {
    powerId: 'power_10508',
    name: 'RestorativeArrowBubble',
    target: { abilities: ['Restorative Arrow covers the target in a barrier that mitigates 2'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Restorative Arrow covers the target in a barrier that mitigates {N} damage from Crushing, Slashing, Piercing, Acid, and Fire attacks. Lasts for {N} seconds or until it has absorbed {N} total damage.',
  },
  // Restorative Arrow restores 5 Power
  {
    powerId: 'power_10507',
    name: 'RestorativeArrowPower',
    target: { abilities: ['Restorative Arrow'] },
    effects: [
      { type: 'restore', valuePattern: /(?:restores?|heals? you for) (\d+) Power/, resourceType: 'Power' },
    ],
    template: 'Restorative Arrow restores {N} Power',
  },
  // Restorative Arrow heals YOU for 5 Health
  {
    powerId: 'power_10506',
    name: 'RestorativeArrowSelfHeal',
    target: { abilities: ['Restorative Arrow'] },
    effects: [
      { type: 'restore', valuePattern: /(?:restores?|heals? you for) (\d+) Health/, resourceType: 'Health' },
    ],
    template: 'Restorative Arrow heals YOU for {N} Health',
  },
  // Archery Accuracy +5
  {
    powerId: 'power_32301',
    name: 'SharpenedBowAccuracy',
    target: 'self',
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Archery Accuracy +{N}',
  },
  // Anatomy Critical Hit Damage +1%
  {
    powerId: 'power_32302',
    name: 'SharpenedBowCritDamage',
    target: { abilities: ['Anatomy Critical Hit'] },
    effects: [
      { type: 'percentDamage', valuePattern: /damage[^]*?\+(\d+)%/ },
    ],
    template: 'Anatomy Critical Hit Damage +{N}%',
  },
  // Snare Arrow boosts the healing of your Major Healing abilities +10 for 15 seconds
  {
    powerId: 'power_10401',
    name: 'SnareArrowBoostHealing',
    target: { abilities: ['Snare Arrow'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Snare Arrow boosts the healing of your Major Healing abilities +{N} for {N} seconds',
  },
  // Snare Arrow raises target's Max Rage by 120, requiring more Rage to use their Rage Abilities
  {
    powerId: 'power_10403',
    name: 'SnareArrowDebuffMaxRage',
    target: 'self',
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Snare Arrow raises target\'s Max Rage by {N}, requiring more Rage to use their Rage Abilities',
  },
  // Snare Arrow restores 2 Health and 2 Armor to you
  {
    powerId: 'power_10404',
    name: 'SnareArrowHeal',
    target: { abilities: ['Snare Arrow'] },
    effects: [
      { type: 'restore', valuePattern: /(?:restores?|heals? you for) (\d+) Health/, resourceType: 'Health' },
    ],
    template: 'Snare Arrow restores {N} Health and {N} Armor to you',
  },
];
