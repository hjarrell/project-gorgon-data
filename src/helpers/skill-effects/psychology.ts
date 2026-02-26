import type { PowerEffectConfig } from './types';

export const PSYCHOLOGY_EFFECTS: PowerEffectConfig[] = [
  // But I Love You boosts your Nice and Epic Attack Damage +15 for 10 seconds
  {
    powerId: 'power_4402',
    name: 'ButILoveYouBoostNiceAndEpic',
    target: { abilities: ['But I Love You'] },
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
    ],
    template: 'But I Love You boosts your Nice and Epic Attack Damage +{N} for {N} seconds',
  },
  // But I Love You and Cause Terror Damage +6%
  {
    powerId: 'power_4403',
    name: 'ButILoveYouCauseTerrorBoost',
    target: { abilities: ['But I Love You', 'Cause Terror'] },
    effects: [
      { type: 'percentDamage', valuePattern: /damage[^]*?\+(\d+)%/ },
    ],
    template: 'But I Love You and Cause Terror Damage +{N}%',
  },
  // But I Love You deals +5% damage and stuns the target
  {
    powerId: 'power_4401',
    name: 'ButILoveYouStun',
    target: { abilities: ['But I Love You'] },
    effects: [
      { type: 'percentDamage', valuePattern: /damage[^]*?\+(\d+)%/ },
    ],
    template: 'But I Love You deals +{N}% damage and stuns the target',
  },
  // Cause Terror deals +4 damage and costs -2 Power
  {
    powerId: 'power_4472',
    name: 'CauseTerrorFaster',
    target: { abilities: ['Cause Terror'] },
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
    ],
    template: 'Cause Terror deals +{N} damage and costs {N} Power',
  },
  // Cause Terror deals +24 damage and restores 8 Health to you
  {
    powerId: 'power_4471',
    name: 'CauseTerrorHeal',
    target: { abilities: ['Cause Terror'] },
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
      { type: 'restore', valuePattern: /(?:restores?|heals? you for) (\d+) Health/, resourceType: 'Health' },
    ],
    template: 'Cause Terror deals +{N} damage and restores {N} Health to you',
  },
  // Fast Talk targets all enemies within 10 meters
  {
    powerId: 'power_4114',
    name: 'FastTalkAoE',
    target: 'self',
    effects: [
      { type: 'aoeDelta', valuePattern: /(?:within|targets within) (\d+) meters/ },
    ],
    template: 'Fast Talk targets all enemies within {N} meters',
  },
  // Fast Talk taunts -100
  {
    powerId: 'power_4111',
    name: 'FastTalkBoost',
    target: 'self',
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Fast Talk taunts {N}',
  },
  // Fast Talk reduces target's rage by -50 and reuse timer is -2 seconds
  {
    powerId: 'power_4113',
    name: 'FastTalkDeRage',
    target: { abilities: ['Fast Talk reduces target\'s rage by -50 and'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Fast Talk reduces target\'s rage by {N} and reuse timer is {N} seconds',
  },
  // Fast Talk heals you for 10 health
  {
    powerId: 'power_4112',
    name: 'FastTalkHeal',
    target: { abilities: ['Fast Talk'] },
    effects: [
      { type: 'restore', valuePattern: /(?:restores?|heals? you for) (\d+) health/, resourceType: 'health' },
    ],
    template: 'Fast Talk heals you for {N} health',
  },
  // Inspire Confidence restores +7 Armor to all targets
  {
    powerId: 'power_4305',
    name: 'InspireConfidenceArmor',
    target: { abilities: ['Inspire Confidence'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Inspire Confidence restores +{N} Armor to all targets',
  },
  // Inspire Confidence increases all targets' Accuracy +1 for 10 seconds
  {
    powerId: 'power_4302',
    name: 'InspireConfidenceBoostAccuracy',
    target: 'self',
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Inspire Confidence increases all targets\' Accuracy +{N} for {N} seconds',
  },
  // Inspire Confidence increases the damage of all targets' attacks +9 for 30 seconds
  {
    powerId: 'power_4303',
    name: 'InspireConfidenceDmgBuff',
    target: { abilities: ['Inspire Confidence increases the'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Inspire Confidence increases the damage of all targets\' attacks +{N} for {N} seconds',
  },
  // Inspire Confidence restores 3 Power over 9 seconds to all targets
  {
    powerId: 'power_4304',
    name: 'InspireConfidencePower',
    target: { abilities: ['Inspire Confidence'] },
    effects: [
      { type: 'restore', valuePattern: /(?:restores?|heals? you for) (\d+) Power/, resourceType: 'Power' },
    ],
    template: 'Inspire Confidence restores {N} Power over {N} seconds to all targets',
  },
  // Mock and Ridicule deal +10% damage and taunt +10
  {
    powerId: 'power_4066',
    name: 'MockAndRidiculeBoost',
    target: { abilities: ['Mock', 'Ridicule'] },
    effects: [
      { type: 'percentDamage', valuePattern: /damage[^]*?\+(\d+)%/ },
      { type: 'tauntDelta', valuePattern: /[Tt]aunt \+(\d+)/ },
    ],
    template: 'Mock and Ridicule deal +{N}% damage and taunt +{N}',
  },
  // Mock hits all enemies within 20 meters and taunts +60, but damage is halved and reuse timer is +1.5 seconds
  {
    powerId: 'power_4032',
    name: 'MockBoost',
    target: 'self',
    effects: [
      { type: 'aoeDelta', valuePattern: /(?:within|targets within) (\d+) meters/ },
    ],
    template: 'Mock hits all enemies within {N} meters and taunts +{N}, but damage is halved and reuse timer is +{N} seconds',
  },
  // Pep Talk removes ongoing Fire effects (up to 3 dmg/sec)
  {
    powerId: 'power_4084',
    name: 'PepTalkDispelFire',
    target: 'self',
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Pep Talk removes ongoing Fire effects (up to {N} dmg/sec)',
  },
  // Pep Talk removes ongoing Poison effects (up to 3 dmg/sec)
  {
    powerId: 'power_4083',
    name: 'PepTalkDispelPoison',
    target: 'self',
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Pep Talk removes ongoing Poison effects (up to {N} dmg/sec)',
  },
  // Pep Talk restores 7 Armor
  {
    powerId: 'power_4085',
    name: 'PepTalkHealArmor',
    target: { abilities: ['Pep Talk'] },
    effects: [
      { type: 'restore', valuePattern: /(?:restores?|heals? you for) (\d+) Armor/, resourceType: 'Armor' },
    ],
    template: 'Pep Talk restores {N} Armor',
  },
  // Pep Talk restores 14 Power
  {
    powerId: 'power_4082',
    name: 'PepTalkHealPower',
    target: { abilities: ['Pep Talk'] },
    effects: [
      { type: 'restore', valuePattern: /(?:restores?|heals? you for) (\d+) Power/, resourceType: 'Power' },
    ],
    template: 'Pep Talk restores {N} Power',
  },
  // Positive Attitude increases your Core Attack Damage +10 for 15 seconds
  {
    powerId: 'power_4203',
    name: 'PositiveAttitudeBoostCore',
    target: { abilities: ['Positive Attitude increases your Core Attack'] },
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
    ],
    template: 'Positive Attitude increases your Core Attack Damage +{N} for {N} seconds',
  },
  // Positive Attitude increases your Poison Mitigation +1 for 30 seconds
  {
    powerId: 'power_4202',
    name: 'PositiveAttitudePoisonImmunity',
    target: 'self',
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Positive Attitude increases your Poison Mitigation +{N} for {N} seconds',
  },
  // Positive Attitude boosts your Out-of-Combat Sprint Speed by 4 for 60 seconds
  {
    powerId: 'power_4201',
    name: 'PositiveAttitudeSpeedup',
    target: { abilities: ['Positive Attitude'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Positive Attitude boosts your Out-of-Combat Sprint Speed by {N} for {N} seconds',
  },
  // Psychoanalyze deals +5% damage and restores 5 Armor to you
  {
    powerId: 'power_4004',
    name: 'PsychoanalyzeArmorHeal',
    target: { abilities: ['Psychoanalyze'] },
    effects: [
      { type: 'percentDamage', valuePattern: /damage[^]*?\+(\d+)%/ },
      { type: 'restore', valuePattern: /(?:restores?|heals? you for) (\d+) Armor/, resourceType: 'Armor' },
    ],
    template: 'Psychoanalyze deals +{N}% damage and restores {N} Armor to you',
  },
  // Psychoanalyze deals between 10 and 60 extra damage
  {
    powerId: 'power_4002',
    name: 'PsychoanalyzeCrit',
    target: { abilities: ['Psychoanalyze'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Psychoanalyze deals between {N} and {N} extra damage',
  },
  // Psychoanalyze restores 10 Health to you after an 8 second delay
  {
    powerId: 'power_4003',
    name: 'PsychoanalyzeHeal',
    target: { abilities: ['Psychoanalyze'] },
    effects: [
      { type: 'restore', valuePattern: /(?:restores?|heals? you for) (\d+) Health/, resourceType: 'Health' },
    ],
    template: 'Psychoanalyze restores {N} Health to you after an {N} second delay',
  },
  // Psychoanalyze causes the target to take +4 damage from Psychic attacks for 15 seconds
  {
    powerId: 'power_4006',
    name: 'PsychoanalyzePsionicsVuln',
    target: { abilities: ['Psychoanalyze causes the target to take +4'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Psychoanalyze causes the target to take +{N} damage from Psychic attacks for {N} seconds',
  },
  // Psychoanalyze, Tell Me About Your Mother, and You Were Adopted Damage +15
  {
    powerId: 'power_4031',
    name: 'PsychoanalyzeTellMeAdoptedBoost',
    target: { abilities: ['Psychoanalyze', 'Tell Me About Your Mother', 'You Were Adopted'] },
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
    ],
    template: 'Psychoanalyze, Tell Me About Your Mother, and You Were Adopted Damage +{N}',
  },
  // Psychoanalyze causes the target to be worth 1% more XP if slain within 60 seconds
  {
    powerId: 'power_4005',
    name: 'PsychoanalyzeXpValueBoost',
    target: 'self',
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Psychoanalyze causes the target to be worth {N}% more XP if slain within {N} seconds',
  },
  // Ridicule damage +5 and target does not call for help
  {
    powerId: 'power_4534',
    name: 'RidiculeNoHelp',
    target: { abilities: ['Ridicule'] },
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
    ],
    template: 'Ridicule damage +{N} and target does not call for help',
  },
  // Ridicule damage +5 and range +10 meters
  {
    powerId: 'power_4533',
    name: 'RidiculeRange',
    target: { abilities: ['Ridicule'] },
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
    ],
    template: 'Ridicule damage +{N} and range +{N} meters',
  },
  // Ridicule boosts movement speed by 1 for 6 seconds
  {
    powerId: 'power_4532',
    name: 'RidiculeSpeed',
    target: { abilities: ['Ridicule'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Ridicule boosts movement speed by {N} for {N} seconds',
  },
  // Ridicule taunts +40 and target's next attack has a 25% chance to automatically miss
  {
    powerId: 'power_4531',
    name: 'RidiculeTaunt',
    target: 'self',
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Ridicule taunts +{N} and target\'s next attack has a {N}% chance to automatically miss',
  },
  // Soothe and Psychoanalyze damage +7 and range +5 meters
  {
    powerId: 'power_4501',
    name: 'SootheBoost',
    target: { abilities: ['Soothe', 'Psychoanalyze'] },
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
    ],
    template: 'Soothe and Psychoanalyze damage +{N} and range +{N} meters',
  },
  // For 10 seconds after using Soothe, your Major Healing abilities restore +16 Health and your attacks generate -2% Rage
  {
    powerId: 'power_4502',
    name: 'SootheBoostMajorHealing',
    target: 'self',
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'For {N} seconds after using Soothe, your Major Healing abilities restore +{N} Health and your attacks generate {N}% Rage',
  },
  // Soothe, But I Love You, and Cause Terror Damage +15
  {
    powerId: 'power_4008',
    name: 'SootheButILoveYouCauseTerrorBoost',
    target: { abilities: ['Soothe', 'But I Love You', 'Cause Terror'] },
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
    ],
    template: 'Soothe, But I Love You, and Cause Terror Damage +{N}',
  },
  // Soothe reuse timer is -1 second and it further reduces Rage by 250
  {
    powerId: 'power_4033',
    name: 'SootheDeRage',
    target: { abilities: ['Soothe'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Soothe reuse timer is {N} second and it further reduces Rage by {N}',
  },
  // Strike a Nerve deals +4 damage and has a 33% chance to deal double damage
  {
    powerId: 'power_4062',
    name: 'StrikeANerveCrit',
    target: { abilities: ['Strike a Nerve'] },
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
    ],
    template: 'Strike a Nerve deals +{N} damage and has a {N}% chance to deal double damage',
  },
  // Strike a Nerve deals +5 damage and hastens the reuse timer of But I Love You -1 second
  {
    powerId: 'power_4063',
    name: 'StrikeANerveHastenButILoveYou',
    target: { abilities: ['Strike a Nerve'] },
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
    ],
    template: 'Strike a Nerve deals +{N} damage and hastens the reuse timer of But I Love You {N} second',
  },
  // Strike a Nerve generates no Rage and instead reduces Rage by 40. It also deals +10 Armor damage
  {
    powerId: 'power_4064',
    name: 'StrikeANerveRageAndArmor',
    target: 'self',
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Strike a Nerve generates no Rage and instead reduces Rage by {N}. It also deals +{N} Armor damage',
  },
  // Tell Me About Your Mother restores 15 Health (or Armor if Health is full)
  {
    powerId: 'power_4034',
    name: 'TellMeAboutYourArmorHeal',
    target: { abilities: ['Tell Me About Your Mother'] },
    effects: [
      { type: 'restore', valuePattern: /(?:restores?|heals? you for) (\d+) Health/, resourceType: 'Health' },
    ],
    template: 'Tell Me About Your Mother restores {N} Health (or Armor if Health is full)',
  },
  // Tell Me About Your Mother boosts your Epic Attack Damage +10 and reduces the Power cost of your Epic Attacks -8 for 15 seconds
  {
    powerId: 'power_4036',
    name: 'TellMeAboutYourMotherBoostEpic',
    target: { abilities: ['Tell Me About Your Mother'] },
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
    ],
    template: 'Tell Me About Your Mother boosts your Epic Attack Damage +{N} and reduces the Power cost of your Epic Attacks {N} for {N} seconds',
  },
  // Tell Me About Your Mother causes target's attacks to deal -1 damage for 60 seconds
  {
    powerId: 'power_4035',
    name: 'TellMeAboutYourMotherDebuff',
    target: { abilities: ['Tell Me About Your Mother causes target\'s attacks to'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Tell Me About Your Mother causes target\'s attacks to deal {N} damage for {N} seconds',
  },
  // You Were Adopted deals +10% damage and Power cost is -3
  {
    powerId: 'power_4431',
    name: 'YouWereAdoptedPower',
    target: { abilities: ['You Were Adopted'] },
    effects: [
      { type: 'percentDamage', valuePattern: /damage[^]*?\+(\d+)%/ },
    ],
    template: 'You Were Adopted deals +{N}% damage and Power cost is {N}',
  },
  // You Were Adopted deals +3% damage and triggers the target's Vulnerability
  {
    powerId: 'power_4433',
    name: 'YouWereAdoptedVuln',
    target: { abilities: ['You Were Adopted'] },
    effects: [
      { type: 'percentDamage', valuePattern: /damage[^]*?\+(\d+)%/ },
    ],
    template: 'You Were Adopted deals +{N}% damage and triggers the target\'s Vulnerability',
  },
];
