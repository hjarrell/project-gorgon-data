import type { PowerEffectConfig } from './types';

export const BARD_EFFECTS: PowerEffectConfig[] = [
  // Anthem of Avoidance gives all targets +8% Burst Evasion for 8 seconds
  {
    powerId: 'power_17241',
    name: 'AnthemOfAvoidanceBurstEvade',
    target: 'self',
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Anthem of Avoidance gives all targets +{N}% Burst Evasion for {N} seconds',
  },
  // Anthem of Avoidance hastens the current reuse timer of Rally by 5 seconds
  {
    powerId: 'power_17244',
    name: 'AnthemOfAvoidanceHastenRally',
    target: { abilities: ['Anthem of Avoidance hastens the current'] },
    effects: [
      { type: 'cooldownDelta', valuePattern: /by (\d+) seconds?/ },
    ],
    template: 'Anthem of Avoidance hastens the current reuse timer of Rally by {N} seconds',
  },
  // Anthem of Avoidance grants all targets immunity to Knockbacks for 8 seconds
  {
    powerId: 'power_17243',
    name: 'AnthemOfAvoidanceKnockback',
    target: 'self',
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Anthem of Avoidance grants all targets immunity to Knockbacks for {N} seconds',
  },
  // Anthem of Avoidance gives all targets +4% Melee Evasion for 8 seconds
  {
    powerId: 'power_17242',
    name: 'AnthemOfAvoidanceMeleeEvade',
    target: 'self',
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Anthem of Avoidance gives all targets +{N}% Melee Evasion for {N} seconds',
  },
  // Bard Blast abilities cause target to suffer 12 Nature damage over 8 seconds
  {
    powerId: 'power_17102',
    name: 'BardBlastDoT',
    target: { abilities: ['Bard Blast abilities cause target to suffer 12 Nature'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Bard Blast abilities cause target to suffer {N} Nature damage over {N} seconds',
  },
  // Your Bard Songs cost -20% Power. In addition, you can use the ability Hymn of Resurrection. (Equipping this item will teach you the ability if needed.)
  {
    powerId: 'power_17024',
    name: 'BardEnableHymnOfResurrection',
    target: { abilities: ['Your Bard Songs'] },
    effects: [
      { type: 'costDelta', valuePattern: /[Cc]ost -(\d+)/ },
    ],
    template: 'Your Bard Songs cost {N}% Power. In addition, you can use the ability Hymn of Resurrection. (Equipping this item will teach you the ability if needed.)',
  },
  // Whenever you take damage from an enemy, you gain Song of Discord Damage +3% and Song of Resurgence Healing +3 for 20 seconds. (Stacks up to 12x)
  {
    powerId: 'power_17045',
    name: 'BardPainfulPerformance',
    target: { abilities: ['Whenever you take'] },
    effects: [
      { type: 'percentDamage', valuePattern: /[Dd]amage \+(\d+)%/ },
    ],
    template: 'Whenever you take damage from an enemy, you gain Song of Discord Damage +{N}% and Song of Resurgence Healing +{N} for {N} seconds. (Stacks up to {N}x)',
  },
  // Whenever you take damage from an enemy, your Bardic Blast abilities deal +5% damage for 20 seconds. (Stacks up to 12x)
  {
    powerId: 'power_17003',
    name: 'BardPainYieldsArt',
    target: { abilities: ['Whenever you take'] },
    effects: [
      { type: 'percentDamage', valuePattern: /deal \+(\d+)% damage/ },
    ],
    template: 'Whenever you take damage from an enemy, your Bardic Blast abilities deal +{N}% damage for {N} seconds. (Stacks up to {N}x)',
  },
  // All bard songs restore 7 Health to YOU every 4 seconds
  {
    powerId: 'power_17022',
    name: 'BardSongSelfHeal',
    target: { abilities: ['All bard songs'] },
    effects: [
      { type: 'restore', valuePattern: /(?:restores?|heals? you for) (\d+) Health/, resourceType: 'Health' },
    ],
    template: 'All bard songs restore {N} Health to YOU every {N} seconds',
  },
  // All bard songs restore 5 Armor to YOU every 4 seconds
  {
    powerId: 'power_17023',
    name: 'BardSongSelfHealArmor',
    target: { abilities: ['All bard songs'] },
    effects: [
      { type: 'restore', valuePattern: /(?:restores?|heals? you for) (\d+) Armor/, resourceType: 'Armor' },
    ],
    template: 'All bard songs restore {N} Armor to YOU every {N} seconds',
  },
  // Blast of Defiance reaps +4% of the Health damage to you as health (or armor if health is full). The reap cap is +15
  {
    powerId: 'power_17142',
    name: 'BlastOfDefianceReap',
    target: { abilities: ['Blast of Defiance reaps +4% of the Health'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Blast of Defiance reaps +{N}% of the Health damage to you as health (or armor if health is full). The reap cap is +{N}',
  },
  // Blast of Despair restores 4 Armor to you
  {
    powerId: 'power_17163',
    name: 'BlastOfDespairArmor',
    target: { abilities: ['Blast of Despair'] },
    effects: [
      { type: 'restore', valuePattern: /(?:restores?|heals? you for) (\d+) Armor/, resourceType: 'Armor' },
    ],
    template: 'Blast of Despair restores {N} Armor to you',
  },
  // Blast of Despair damage is +10% and reduces 10 more Rage
  {
    powerId: 'power_17161',
    name: 'BlastOfDespairBoost',
    target: { abilities: ['Blast of Despair'] },
    effects: [
      { type: 'rageDelta', valuePattern: /reduces? (\d+) (?:more )?Rage/ },
    ],
    template: 'Blast of Despair damage is +{N}% and reduces {N} more Rage',
  },
  // Blast of Despair causes your Nice Attacks to deal +10 damage for 10 seconds
  {
    powerId: 'power_17162',
    name: 'BlastOfDespairBoostNice',
    target: { abilities: ['Blast of Despair causes your Nice Attacks to'] },
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
    ],
    template: 'Blast of Despair causes your Nice Attacks to deal +{N} damage for {N} seconds',
  },
  // Blast of Fury deals 22 Armor damage
  {
    powerId: 'power_17123',
    name: 'BlastOfFuryArmorDmg',
    target: { abilities: ['Blast of Fury'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Blast of Fury deals {N} Armor damage',
  },
  // Blast of Fury deals +10% damage and knocks the target back
  {
    powerId: 'power_17122',
    name: 'BlastOfFuryKnockback',
    target: { abilities: ['Blast of Fury'] },
    effects: [
      { type: 'percentDamage', valuePattern: /\+(\d+)% damage/ },
    ],
    template: 'Blast of Fury deals +{N}% damage and knocks the target back',
  },
  // Disharmony causes your next attack to deal +4 damage
  {
    powerId: 'power_17322',
    name: 'DisharmonyBuff',
    target: { abilities: ['Disharmony causes your next attack to'] },
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
    ],
    template: 'Disharmony causes your next attack to deal +{N} damage',
  },
  // Disharmony causes target's next attack to have a 4% chance to automatically Miss. (This effect does not stack with itself.)
  {
    powerId: 'power_17321',
    name: 'DisharmonyDebuff',
    target: 'self',
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Disharmony causes target\'s next attack to have a {N}% chance to automatically Miss. (This effect does not stack with itself.)',
  },
  // Entrancing Lullaby and Anthem of Avoidance cost -7 Power
  {
    powerId: 'power_17263',
    name: 'EntrancingLullabyAnthemOfAvoidanceCheaper',
    target: { abilities: ['Entrancing Lullaby', 'Anthem of Avoidance'] },
    effects: [
      { type: 'costDelta', valuePattern: /[Cc]ost -(\d+)/ },
    ],
    template: 'Entrancing Lullaby and Anthem of Avoidance cost {N} Power',
  },
  // Melee abilities boost your Bardic Blast ability damage +1.5% for 30 seconds
  {
    powerId: 'power_17103',
    name: 'MeleeBuffsBlasts',
    target: { abilities: ['Melee abilities'] },
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
    ],
    template: 'Melee abilities boost your Bardic Blast ability damage +{N}% for {N} seconds',
  },
  // Melee abilities boost your next attack +5.5% if it is a Bardic Blast ability
  {
    powerId: 'power_17104',
    name: 'MeleeBuffsNextAttack',
    target: { abilities: ['Melee abilities'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Melee abilities boost your next attack +{N}% if it is a Bardic Blast ability',
  },
  // Moment of Resolve dispels any Slow or Root effects on allies and grants them immunity to Slow and Root effects for 8 seconds
  {
    powerId: 'power_17303',
    name: 'MomentOfResolveSlowResist',
    target: 'self',
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Moment of Resolve dispels any Slow or Root effects on allies and grants them immunity to Slow and Root effects for {N} seconds',
  },
  // Moment of Resolve boosts targets' Movement Speed +1 for 8 seconds
  {
    powerId: 'power_17304',
    name: 'MomentOfResolveSpeedUp',
    target: { abilities: ['Moment of Resolve'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Moment of Resolve boosts targets\' Movement Speed +{N} for {N} seconds',
  },
  // Moment of Resolve dispels any Stun effects on allies and grants them immunity to Stuns for 8 seconds. Moment of Resolve can be used while stunned.
  {
    powerId: 'power_17302',
    name: 'MomentOfResolveStunResist',
    target: 'self',
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Moment of Resolve dispels any Stun effects on allies and grants them immunity to Stuns for {N} seconds. Moment of Resolve can be used while stunned.',
  },
  // Rally restores 20 Armor after a 20 second delay
  {
    powerId: 'power_17223',
    name: 'RallyDelayedArmorHeal',
    target: { abilities: ['Rally'] },
    effects: [
      { type: 'restore', valuePattern: /(?:restores?|heals? you for) (\d+) Armor/, resourceType: 'Armor' },
    ],
    template: 'Rally restores {N} Armor after a {N} second delay',
  },
  // Rally restores 10 Power
  {
    powerId: 'power_17222',
    name: 'RallyHealPower',
    target: { abilities: ['Rally'] },
    effects: [
      { type: 'restore', valuePattern: /(?:restores?|heals? you for) (\d+) Power/, resourceType: 'Power' },
    ],
    template: 'Rally restores {N} Power',
  },
  // Song of Bravery causes allies' Combat Refreshes to restore +10 Armor
  {
    powerId: 'power_17083',
    name: 'SongOfBraveryBoostArmorRecovery',
    target: { abilities: ['Song of Bravery causes allies\' Combat Refreshes to'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Song of Bravery causes allies\' Combat Refreshes to restore +{N} Armor',
  },
  // Song of Bravery boosts allies' Basic Attack and Core Attack damage +10
  {
    powerId: 'power_17082',
    name: 'SongOfBraveryBoostBasicAndCore',
    target: { abilities: ['Song of Bravery'] },
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
    ],
    template: 'Song of Bravery boosts allies\' Basic Attack and Core Attack damage +{N}',
  },
  // Song of Bravery further reduces ability costs -1 and increases Direct Damage +2%
  {
    powerId: 'power_17084',
    name: 'SongOfBraveryBoostDmg',
    target: 'self',
    effects: [
      { type: 'percentDamage', valuePattern: /[Dd]amage \+(\d+)%/ },
    ],
    template: 'Song of Bravery further reduces ability costs {N} and increases Direct Damage +{N}%',
  },
  // Song of Bravery has a 15% chance every 4 seconds to grant listeners a Moment of Bravery: all attacks deal +33% damage for 5 seconds
  {
    powerId: 'power_17081',
    name: 'SongOfBraveryCrits',
    target: { abilities: ['Song of Bravery'] },
    effects: [
      { type: 'percentDamage', valuePattern: /deal \+(\d+)% damage/ },
    ],
    template: 'Song of Bravery has a {N}% chance every {N} seconds to grant listeners a Moment of Bravery: all attacks deal +{N}% damage for {N} seconds',
  },
  // Every 2 seconds when Song of Discord damages an enemy, your Bardic Blast ability damage is boosted +1% for 30 seconds
  {
    powerId: 'power_17046',
    name: 'SongOfDiscordBuffsBlasts',
    target: 'self',
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Every {N} seconds when Song of Discord damages an enemy, your Bardic Blast ability damage is boosted +{N}% for {N} seconds',
  },
  // Song of Discord has a 10% chance to deal +100% damage to each target every 2 seconds
  {
    powerId: 'power_17044',
    name: 'SongOfDiscordCrit',
    target: { abilities: ['Song of Discord'] },
    effects: [
      { type: 'percentDamage', valuePattern: /deal \+(\d+)% damage/ },
    ],
    template: 'Song of Discord has a {N}% chance to deal +{N}% damage to each target every {N} seconds',
  },
  // Song of Discord deals +5 damage and reduces targets' Rage by -10 every 2 seconds
  {
    powerId: 'power_17043',
    name: 'SongOfDiscordLowerRage',
    target: { abilities: ['Song of Discord'] },
    effects: [
      { type: 'dotFlatDamage', valuePattern: /deals? \+?(\d+) damage/ },
    ],
    template: 'Song of Discord deals +{N} damage and reduces targets\' Rage by {N} every {N} seconds',
  },
  // Song of Discord deals +5% damage to targets with less than 33% of their Max Rage
  {
    powerId: 'power_17047',
    name: 'SongOfDiscordRageahol',
    target: { abilities: ['Song of Discord'] },
    effects: [
      { type: 'percentDamage', valuePattern: /\+(\d+)% damage/ },
    ],
    template: 'Song of Discord deals +{N}% damage to targets with less than {N}% of their Max Rage',
  },
  // Song of Discord deals +3 damage and has a 10% chance to stun each target every 2 seconds
  {
    powerId: 'power_17042',
    name: 'SongOfDiscordStun',
    target: { abilities: ['Song of Discord'] },
    effects: [
      { type: 'dotFlatDamage', valuePattern: /deals? \+?(\d+) damage/ },
    ],
    template: 'Song of Discord deals +{N} damage and has a {N}% chance to stun each target every {N} seconds',
  },
  // While playing Song of Resurgence, your Major Healing abilities restore +7 Health
  {
    powerId: 'power_17063',
    name: 'SongOfResurgenceBuffMajorHeals',
    target: 'self',
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'While playing Song of Resurgence, your Major Healing abilities restore +{N} Health',
  },
  // Song of Resurgence also restores 1 Power every 4 seconds to each target in range
  {
    powerId: 'power_17062',
    name: 'SongOfResurgenceHealPower',
    target: { abilities: ['Song of Resurgence also'] },
    effects: [
      { type: 'restore', valuePattern: /(?:restores?|heals? you for) (\d+) Power/, resourceType: 'Power' },
    ],
    template: 'Song of Resurgence also restores {N} Power every {N} seconds to each target in range',
  },
  // Thunderous Note deals +3 damage and is considered a Bardic Blast ability.
  {
    powerId: 'power_17205',
    name: 'ThunderousNoteBardBlast',
    target: { abilities: ['Thunderous Note'] },
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
    ],
    template: 'Thunderous Note deals +{N} damage and is considered a Bardic Blast ability.',
  },
  // Thunderous Note costs -3 Power and damage is +1%
  {
    powerId: 'power_17202',
    name: 'ThunderousNoteCost',
    target: { abilities: ['Thunderous Note costs -3 Power and'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Thunderous Note costs {N} Power and damage is +{N}%',
  },
  // Thunderous Note deals +11% damage and damage type is Nature instead of Trauma
  {
    powerId: 'power_17204',
    name: 'ThunderousNoteNature',
    target: { abilities: ['Thunderous Note'] },
    effects: [
      { type: 'percentDamage', valuePattern: /\+(\d+)% damage/ },
    ],
    template: 'Thunderous Note deals +{N}% damage and damage type is Nature instead of Trauma',
  },
  // Thunderous Note causes the target to take +6% damage from direct Nature attacks for 15 seconds
  {
    powerId: 'power_17203',
    name: 'ThunderousNoteNatureVuln',
    target: { abilities: ['Thunderous Note causes the target to take +6%'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Thunderous Note causes the target to take +{N}% damage from direct Nature attacks for {N} seconds',
  },
  // Virtuoso's Ballad causes target's next attack to deal +16 damage
  {
    powerId: 'power_17284',
    name: 'VirtuososBalladDamage',
    target: { abilities: ['Virtuoso\'s Ballad causes target\'s next attack to'] },
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
    ],
    template: 'Virtuoso\'s Ballad causes target\'s next attack to deal +{N} damage',
  },
  // Virtuoso's Ballad restores 8 Health (or Armor if Health is Full)
  {
    powerId: 'power_17282',
    name: 'VirtuososBalladHealing',
    target: { abilities: ['Virtuoso\'s Ballad'] },
    effects: [
      { type: 'restore', valuePattern: /(?:restores?|heals? you for) (\d+) Health/, resourceType: 'Health' },
    ],
    template: 'Virtuoso\'s Ballad restores {N} Health (or Armor if Health is Full)',
  },
  // Virtuoso's Ballad and Moment of Resolve Reuse Timer -3 seconds
  {
    powerId: 'power_17283',
    name: 'VirtuososBalladMomentOfResolveFaster',
    target: { abilities: ['Virtuoso\'s Ballad', 'Moment of Resolve'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Virtuoso\'s Ballad and Moment of Resolve Reuse Timer {N} seconds',
  },
  // Virtuoso's Ballad restores 10 Power
  {
    powerId: 'power_17281',
    name: 'VirtuososBalladPower',
    target: { abilities: ['Virtuoso\'s Ballad'] },
    effects: [
      { type: 'restore', valuePattern: /(?:restores?|heals? you for) (\d+) Power/, resourceType: 'Power' },
    ],
    template: 'Virtuoso\'s Ballad restores {N} Power',
  },
];
