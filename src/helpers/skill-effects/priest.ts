import type { PowerEffectConfig } from './types';

export const PRIEST_EFFECTS: PowerEffectConfig[] = [
  // Admonish boosts your Priest Damage +1 for 60 seconds
  {
    powerId: 'power_26012',
    name: 'AdmonishBoostBaseDmg',
    target: { abilities: ['Admonish'] },
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
    ],
    template: 'Admonish boosts your Priest Damage +{N} for {N} seconds',
  },
  // The maximum Power restored by Admonish increases +3
  {
    powerId: 'power_26011',
    name: 'AdmonishPower',
    target: 'self',
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'The maximum Power restored by Admonish increases +{N}',
  },
  // Admonish makes the target 1% more vulnerable to Psychic damage for 20 seconds (this effect does not stack with itself)
  {
    powerId: 'power_26013',
    name: 'AdmonishPsiVuln',
    target: { abilities: ['Admonish makes the target 1% more vulnerable to Psychic'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Admonish makes the target {N}% more vulnerable to Psychic damage for {N} seconds (this effect does not stack with itself)',
  },
  // Castigate deals Fire damage instead of Psychic, and deals +12% damage to Aberrations
  {
    powerId: 'power_26034',
    name: 'CastigateAberrationBurn',
    target: { abilities: ['Castigate'] },
    effects: [
      { type: 'percentDamage', valuePattern: /damage[^]*?\+(\d+)%/ },
    ],
    template: 'Castigate deals Fire damage instead of Psychic, and deals +{N}% damage to Aberrations',
  },
  // Castigate boosts your Nice Attack Damage +6 for 8 seconds
  {
    powerId: 'power_26035',
    name: 'CastigateBoostNice',
    target: { abilities: ['Castigate'] },
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
    ],
    template: 'Castigate boosts your Nice Attack Damage +{N} for {N} seconds',
  },
  // Castigate has a 25% chance to stun the target
  {
    powerId: 'power_26033',
    name: 'CastigateStunChance',
    target: { abilities: ['Castigate'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Castigate has a {N}% chance to stun the target',
  },
  // Corrupt Hate causes the target to suffer 20 Psychic damage when they use a Rage Attack. Reuse Time -3 seconds
  {
    powerId: 'power_26113',
    name: 'CorruptHateSelfHate',
    target: { abilities: ['Corrupt Hate causes the target to suffer 20 Psychic'] },
    effects: [
      { type: 'cooldownDelta', valuePattern: /[Rr]euse [Tt]ime (?:is )?-(\d+)/ },
    ],
    template: 'Corrupt Hate causes the target to suffer {N} Psychic damage when they use a Rage Attack. Reuse Time {N} seconds',
  },
  // Exhilarate restores 12 Armor over 8 seconds
  {
    powerId: 'power_26053',
    name: 'ExhilarateArmorHoT',
    target: { abilities: ['Exhilarate'] },
    effects: [
      { type: 'restore', valuePattern: /(?:restores?|heals? you for) (\d+) Armor/, resourceType: 'Armor' },
    ],
    template: 'Exhilarate restores {N} Armor over {N} seconds',
  },
  // Exhilarate restores +5 Health and hastens the current reuse timer of Invigorate -1 seconds
  {
    powerId: 'power_26051',
    name: 'ExhilarateHeal',
    target: { abilities: ['Exhilarate'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Exhilarate restores +{N} Health and hastens the current reuse timer of Invigorate {N} seconds',
  },
  // For 60 seconds after casting Exhilarate on a target, additional Exhilarates on the same target restore +5 Health
  {
    powerId: 'power_26052',
    name: 'ExhilarateStackingHeal',
    target: 'self',
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'For {N} seconds after casting Exhilarate on a target, additional Exhilarates on the same target restore +{N} Health',
  },
  // Flamestrike deals 100 Fire damage over 10 seconds. Reuse timer is -10 seconds
  {
    powerId: 'power_26173',
    name: 'FlamestrikeDoT',
    target: { abilities: ['Flamestrike'] },
    effects: [
      { type: 'dot', valuePattern: /deals? \+?(\d+) Fire damage/, damageType: 'Fire', duration: 10 },
    ],
    template: 'Flamestrike deals {N} Fire damage over {N} seconds. Reuse timer is {N} seconds',
  },
  // Flamestrike deals +7 direct damage. When you have Flamestrike on your ability bar and you're injured by an enemy attack, that enemy is struck by Flamestrike 1. The cooldown on this effect is the same as your reuse time for Flamestrike.
  {
    powerId: 'power_26175',
    name: 'FlamestrikeReactA',
    target: { abilities: ['Flamestrike'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Flamestrike deals +{N} direct damage. When you have Flamestrike on your ability bar and you\'re injured by an enemy attack, that enemy is struck by Flamestrike {N}. The cooldown on this effect is the same as your reuse time for Flamestrike.',
  },
  // Flamestrike deals +3% direct damage. When you have Flamestrike on your ability bar and you're injured by an enemy attack, that enemy is struck by Flamestrike 1. The cooldown on this effect is the same as your reuse time for Flamestrike.
  {
    powerId: 'power_26176',
    name: 'FlamestrikeReactB',
    target: { abilities: ['Flamestrike'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Flamestrike deals +{N}% direct damage. When you have Flamestrike on your ability bar and you\'re injured by an enemy attack, that enemy is struck by Flamestrike {N}. The cooldown on this effect is the same as your reuse time for Flamestrike.',
  },
  // Flamestrike deals +10 direct damage and roots the target for 7 seconds. Reuse timer is -2 seconds
  {
    powerId: 'power_26174',
    name: 'FlamestrikeRoot',
    target: { abilities: ['Flamestrike'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Flamestrike deals +{N} direct damage and roots the target for {N} seconds. Reuse timer is {N} seconds',
  },
  // Give Warmth boosts the target's direct Fire damage +3% for 60 seconds
  {
    powerId: 'power_26262',
    name: 'GiveWarmthDirectFire',
    target: { abilities: ['Give Warmth'] },
    effects: [
      { type: 'percentDamage', valuePattern: /damage[^]*?\+(\d+)%/ },
    ],
    template: 'Give Warmth boosts the target\'s direct Fire damage +{N}% for {N} seconds',
  },
  // Give Warmth restores 10 Health and 10 Body Heat over 60 seconds
  {
    powerId: 'power_26261',
    name: 'GiveWarmthHoT',
    target: { abilities: ['Give Warmth'] },
    effects: [
      { type: 'restore', valuePattern: /(?:restores?|heals? you for) (\d+) Health/, resourceType: 'Health' },
    ],
    template: 'Give Warmth restores {N} Health and {N} Body Heat over {N} seconds',
  },
  // Give Warmth boosts the target's fire damage-over-time by +3 per tick for 60 seconds
  {
    powerId: 'power_26263',
    name: 'GiveWarmthIndirectFire',
    target: { abilities: ['Give Warmth'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Give Warmth boosts the target\'s fire damage-over-time by +{N} per tick for {N} seconds',
  },
  // Invigorate restores +12 Health (or Armor if Health is full)
  {
    powerId: 'power_26241',
    name: 'InvigorateHeal',
    target: { abilities: ['Invigorate'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Invigorate restores +{N} Health (or Armor if Health is full)',
  },
  // Invigorate restores +18 Armor
  {
    powerId: 'power_26242',
    name: 'InvigorateHealArmor',
    target: { abilities: ['Invigorate'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Invigorate restores +{N} Armor',
  },
  // Invigorate restores +6 Health, Armor, and Power
  {
    powerId: 'power_26243',
    name: 'InvigorateHealEverything',
    target: { abilities: ['Invigorate'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Invigorate restores +{N} Health, Armor, and Power',
  },
  // Mend Flesh gives the target +3 mitigation against physical attacks for 12 seconds
  {
    powerId: 'power_26073',
    name: 'MendFleshMitigation',
    target: 'self',
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Mend Flesh gives the target +{N} mitigation against physical attacks for {N} seconds',
  },
  // Fire abilities deal +3% direct damage if cast while you are channeling a Priest ability
  {
    powerId: 'power_26008',
    name: 'PriestBoostFireWhileChanneling',
    target: { abilities: ['Fire abilities'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Fire abilities deal +{N}% direct damage if cast while you are channeling a Priest ability',
  },
  // Exhilarate, Triage, and Invigorate restore +5 Health if you haven't been attacked in the past 15 seconds
  {
    powerId: 'power_26054',
    name: 'PriestPacifistHealing',
    target: { abilities: ['Exhilarate', 'Triage', 'Invigorate'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Exhilarate, Triage, and Invigorate restore +{N} Health if you haven\'t been attacked in the past {N} seconds',
  },
  // If you are using the Priest skill and you have not been attacked in the past 15 seconds, your Power Regeneration is +5 (meaning you recover this Power every 5 seconds, in and out of combat)
  {
    powerId: 'power_26006',
    name: 'PriestPacifistPower',
    target: 'self',
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'If you are using the Priest skill and you have not been attacked in the past {N} seconds, your Power Regeneration is +{N} (meaning you recover this Power every {N} seconds, in and out of combat)',
  },
  // Remedy restores 6 Armor
  {
    powerId: 'power_26222',
    name: 'RemedyArmor',
    target: { abilities: ['Remedy'] },
    effects: [
      { type: 'restore', valuePattern: /(?:restores?|heals? you for) (\d+) Armor/, resourceType: 'Armor' },
    ],
    template: 'Remedy restores {N} Armor',
  },
  // Remedy removes ongoing Fire effects (up to 3 dmg/sec)
  {
    powerId: 'power_26221',
    name: 'RemedyDispelFire',
    target: 'self',
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Remedy removes ongoing Fire effects (up to {N} dmg/sec)',
  },
  // Remedy reuse timer is -1 second and it has a 10% chance to mend a broken bone in the target
  {
    powerId: 'power_26224',
    name: 'RemedyFastAndCheap',
    target: { abilities: ['Remedy'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Remedy reuse timer is {N} second and it has a {N}% chance to mend a broken bone in the target',
  },
  // Remedy restores 5 Armor and mitigates all damage over time by 1 per tick for 10 seconds
  {
    powerId: 'power_26223',
    name: 'RemedyMitigation',
    target: { abilities: ['Remedy'] },
    effects: [
      { type: 'restore', valuePattern: /(?:restores?|heals? you for) (\d+) Armor/, resourceType: 'Armor' },
    ],
    template: 'Remedy restores {N} Armor and mitigates all damage over time by {N} per tick for {N} seconds',
  },
  // Righteous Flame deals +55 Fire damage over 10 seconds. Reuse TIme -1 second
  {
    powerId: 'power_26153',
    name: 'RighteousFlameDoT',
    target: { abilities: ['Righteous Flame'] },
    effects: [
      { type: 'dot', valuePattern: /deals? \+?(\d+) Fire damage/, damageType: 'Fire', duration: 10 },
      { type: 'cooldownDelta', valuePattern: /by (\d+) seconds?/ },
    ],
    template: 'Righteous Flame deals +{N} Fire damage over {N} seconds. Reuse TIme {N} second',
  },
  // Triage gives the target +3% Burst Evasion for 10 seconds
  {
    powerId: 'power_26203',
    name: 'TriageBurstEvasion',
    target: 'self',
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Triage gives the target +{N}% Burst Evasion for {N} seconds',
  },
  // Triage costs no Power to cast and restores +5 Health
  {
    powerId: 'power_26204',
    name: 'TriageFree',
    target: { abilities: ['Triage costs no Power to cast and'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Triage costs no Power to cast and restores +{N} Health',
  },
  // Triage restores 10 Health over 15 seconds
  {
    powerId: 'power_26205',
    name: 'TriageHoT',
    target: { abilities: ['Triage'] },
    effects: [
      { type: 'restore', valuePattern: /(?:restores?|heals? you for) (\d+) Health/, resourceType: 'Health' },
    ],
    template: 'Triage restores {N} Health over {N} seconds',
  },
  // Triage gives the target +4% Melee Evasion for 10 seconds
  {
    powerId: 'power_26202',
    name: 'TriageMeleeEvasion',
    target: 'self',
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Triage gives the target +{N}% Melee Evasion for {N} seconds',
  },
  // Unfetter allows free-form movement while leaping, and if the target can fly, fly speed is boosted +0.3 m/s for 20 seconds
  {
    powerId: 'power_26092',
    name: 'UnfetterFlySpeed',
    target: 'self',
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Unfetter allows free-form movement while leaping, and if the target can fly, fly speed is boosted +{N} m/s for {N} seconds',
  },
  // Unfetter grants immunity to Knockback effects for 6 seconds
  {
    powerId: 'power_26091',
    name: 'UnfetterKnockbackResist',
    target: 'self',
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Unfetter grants immunity to Knockback effects for {N} seconds',
  },
  // Unfetter restores 6 Power over 9 seconds
  {
    powerId: 'power_26094',
    name: 'UnfetterPower',
    target: { abilities: ['Unfetter'] },
    effects: [
      { type: 'restore', valuePattern: /(?:restores?|heals? you for) (\d+) Power/, resourceType: 'Power' },
    ],
    template: 'Unfetter restores {N} Power over {N} seconds',
  },
  // Unfetter boosts swim speed +0.4 m/s for 20 seconds
  {
    powerId: 'power_26093',
    name: 'UnfetterSwimSpeed',
    target: { abilities: ['Unfetter'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Unfetter boosts swim speed +{N} m/s for {N} seconds',
  },
];
