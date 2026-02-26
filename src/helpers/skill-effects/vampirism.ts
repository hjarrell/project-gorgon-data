import type { PowerEffectConfig } from './types';

export const VAMPIRISM_EFFECTS: PowerEffectConfig[] = [
  // Bite attacks deal +5% damage and hasten the current reuse timer of Blood Mist by 1 second
  {
    powerId: 'power_18047',
    name: 'BiteModAndHastenBloodMist',
    target: { abilities: ['Bite attacks'] },
    effects: [
      { type: 'percentDamage', valuePattern: /damage[^]*?\+(\d+)%/ },
      { type: 'cooldownDelta', valuePattern: /by (\d+) seconds?/ },
    ],
    template: 'Bite attacks deal +{N}% damage and hasten the current reuse timer of Blood Mist by {N} second',
  },
  // If Blood Mist causes you to erupt in a fountain of vile blood, that eruption deals +12 Trauma damage over 8 seconds
  {
    powerId: 'power_18116',
    name: 'BloodMistDoT',
    target: 'self',
    effects: [
      { type: 'dot', valuePattern: /deals? \+?(\d+) Trauma damage/, damageType: 'Trauma', duration: 8 },
    ],
    template: 'If Blood Mist causes you to erupt in a fountain of vile blood, that eruption deals +{N} Trauma damage over {N} seconds',
  },
  // While in Blood Mist form, you erupt in a fountain of vile blood every 2 seconds, damaging all enemies within 5 meters. Damage depends on the tier of Blood Mist ability used (and can be further increased with other treasure effects).
  {
    powerId: 'power_18111',
    name: 'BloodMistEnableBurst',
    target: 'self',
    effects: [
      { type: 'aoeDelta', valuePattern: /(?:within|targets within) (\d+) meters/ },
    ],
    template: 'While in Blood Mist form, you erupt in a fountain of vile blood every {N} seconds, damaging all enemies within {N} meters. Damage depends on the tier of Blood Mist ability used (and can be further increased with other treasure effects).',
  },
  // While in Blood Mist form, 50% chance to react to incoming Melee attacks with an eruption of vile blood: a 5m Burst Trauma attack with Base Damage 7. (This cannot happen more than once per second.)
  {
    powerId: 'power_18114',
    name: 'BloodMistReaction',
    target: 'self',
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'While in Blood Mist form, {N}% chance to react to incoming Melee attacks with an eruption of vile blood: a {N}m Burst Trauma attack with Base Damage {N}. (This cannot happen more than once per second.)',
  },
  // While in Blood Mist form you gain Sprint Speed +1.5
  {
    powerId: 'power_18115',
    name: 'BloodMistSpeed',
    target: 'self',
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'While in Blood Mist form you gain Sprint Speed +{N}',
  },
  // Dominate boosts its victim's Direct Damage +10% and Taunt +50% while charmed
  {
    powerId: 'power_18133',
    name: 'DominateDamageAndTaunt',
    target: { abilities: ['Dominate'] },
    effects: [
      { type: 'percentDamage', valuePattern: /damage[^]*?\+(\d+)%/ },
      { type: 'tauntDelta', valuePattern: /[Tt]aunt \+(\d+)/ },
    ],
    template: 'Dominate boosts its victim\'s Direct Damage +{N}% and Taunt +{N}% while charmed',
  },
  // Dominate boosts its victim's Non-Rage Attack Damage +10% while charmed
  {
    powerId: 'power_18134',
    name: 'DominateNonRageAttackDamage',
    target: { abilities: ['Dominate'] },
    effects: [
      { type: 'percentDamage', valuePattern: /damage[^]*?\+(\d+)%/ },
    ],
    template: 'Dominate boosts its victim\'s Non-Rage Attack Damage +{N}% while charmed',
  },
  // If you abort Dominate before it naturally expires, or if you use it on an Elite target, the target is stunned for 6 secs and it suffers +25% damage from all Indirect Damage sources for 30 seconds
  {
    powerId: 'power_18132',
    name: 'DominateStun',
    target: 'self',
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'If you abort Dominate before it naturally expires, or if you use it on an Elite target, the target is stunned for {N} secs and it suffers +{N}% damage from all Indirect Damage sources for {N} seconds',
  },
  // Eclipse of Shadows deals +12 damage and damage type becomes Psychic. In addition, Eclipse of Shadows, Willbreaker, and Embrace of Despair become eligible for Phrenology Critical Hits.
  {
    powerId: 'power_18074',
    name: 'EclipseOfShadowsPsychic',
    target: { abilities: ['Eclipse of Shadows'] },
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
    ],
    template: 'Eclipse of Shadows deals +{N} damage and damage type becomes Psychic. In addition, Eclipse of Shadows, Willbreaker, and Embrace of Despair become eligible for Phrenology Critical Hits.',
  },
  // Eclipse of Shadows Range +1
  {
    powerId: 'power_18073',
    name: 'EclipseOfShadowsRange',
    target: 'self',
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Eclipse of Shadows Range +{N}',
  },
  // Embrace of Despair boosts your Bite abilities' damage +15 for 8 seconds
  {
    powerId: 'power_18034',
    name: 'EmbraceOfDespairBoostBite',
    target: { abilities: ['Embrace of Despair'] },
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
    ],
    template: 'Embrace of Despair boosts your Bite abilities\' damage +{N} for {N} seconds',
  },
  // Embrace of Despair deals +7 damage and increases target's Darkness vulnerability +1% for 13 seconds
  {
    powerId: 'power_18035',
    name: 'EmbraceOfDespairDebuffDarkness',
    target: { abilities: ['Embrace of Despair'] },
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
    ],
    template: 'Embrace of Despair deals +{N} damage and increases target\'s Darkness vulnerability +{N}% for {N} seconds',
  },
  // Embrace of Despair deals +7 damage and increases target's Trauma vulnerability +1% for 13 seconds
  {
    powerId: 'power_18036',
    name: 'EmbraceOfDespairDebuffTrauma',
    target: { abilities: ['Embrace of Despair'] },
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
    ],
    template: 'Embrace of Despair deals +{N} damage and increases target\'s Trauma vulnerability +{N}% for {N} seconds',
  },
  // Embrace of Despair becomes a Sonic ability and deals Nature damage instead of Psychic. Sonic Ability Damage +7% while Vampirism skill active
  {
    powerId: 'power_18037',
    name: 'EmbraceOfDespairNature',
    target: { abilities: ['Embrace of Despair becomes a Sonic ability and'] },
    effects: [
      { type: 'percentDamage', valuePattern: /damage[^]*?\+(\d+)%/ },
    ],
    template: 'Embrace of Despair becomes a Sonic ability and deals Nature damage instead of Psychic. Sonic Ability Damage +{N}% while Vampirism skill active',
  },
  // Enthrall and Dominate Range +6
  {
    powerId: 'power_18121',
    name: 'EnthrallAndDominateRange',
    target: 'self',
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Enthrall and Dominate Range +{N}',
  },
  // For 30 seconds after using Enthrall, any vile blood eruptions from Blood Mist deal +4 direct damage
  {
    powerId: 'power_18122',
    name: 'EnthrallBoostBlood',
    target: 'self',
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'For {N} seconds after using Enthrall, any vile blood eruptions from Blood Mist deal +{N} direct damage',
  },
  // Exsanguinate deals +12 Trauma damage over 8 seconds
  {
    powerId: 'power_18053',
    name: 'ExsanguinateDoT',
    target: { abilities: ['Exsanguinate'] },
    effects: [
      { type: 'dot', valuePattern: /deals? \+?(\d+) Trauma damage/, damageType: 'Trauma', duration: 8 },
    ],
    template: 'Exsanguinate deals +{N} Trauma damage over {N} seconds',
  },
  // Lifedrain and Exsanguinate deal +8 Trauma damage over 8 seconds.
  {
    powerId: 'power_18046',
    name: 'LifedrainExsanguinateBleed',
    target: { abilities: ['Lifedrain', 'Exsanguinate'] },
    effects: [
      { type: 'dot', valuePattern: /deals? \+?(\d+) Trauma damage/, damageType: 'Trauma', duration: 8 },
    ],
    template: 'Lifedrain and Exsanguinate deal +{N} Trauma damage over {N} seconds.',
  },
  // Lifedrain deals +12 Trauma damage over 8 seconds. This damage also heals you for 4 health (or armor if health is full) over 8 seconds.
  {
    powerId: 'power_18044',
    name: 'LifedrainHoT',
    target: { abilities: ['Lifedrain'] },
    effects: [
      { type: 'dot', valuePattern: /deals? \+?(\d+) Trauma damage/, damageType: 'Trauma', duration: 8 },
      { type: 'restore', valuePattern: /(?:restores?|heals? you for) (\d+) health/, resourceType: 'health' },
    ],
    template: 'Lifedrain deals +{N} Trauma damage over {N} seconds. This damage also heals you for {N} health (or armor if health is full) over {N} seconds.',
  },
  // Lifedrain deals +4 Trauma damage over 8 seconds. This damage also restores 4 power to you over 8 seconds.
  {
    powerId: 'power_18045',
    name: 'LifedrainPower',
    target: { abilities: ['Lifedrain'] },
    effects: [
      { type: 'dot', valuePattern: /deals? \+?(\d+) Trauma damage/, damageType: 'Trauma', duration: 8 },
      { type: 'restore', valuePattern: /(?:restores?|heals? you for) (\d+) power/, resourceType: 'power' },
    ],
    template: 'Lifedrain deals +{N} Trauma damage over {N} seconds. This damage also restores {N} power to you over {N} seconds.',
  },
  // If the target of Necrotic Grasp dies within 20 seconds, you heal 6 Health
  {
    powerId: 'power_18065',
    name: 'NecroticGraspHealth',
    target: 'self',
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'If the target of Necrotic Grasp dies within {N} seconds, you heal {N} Health',
  },
  // If the target of Necrotic Grasp dies within 20 seconds, you regain 6 Power
  {
    powerId: 'power_18064',
    name: 'NecroticGraspPower',
    target: 'self',
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'If the target of Necrotic Grasp dies within {N} seconds, you regain {N} Power',
  },
  // Overwhelming Bite damage +3. If Blood Mist causes you to erupt in a fountain of vile blood, that eruption also deals +3 damage
  {
    powerId: 'power_18112',
    name: 'OverwhelmingBiteAndBloodMistBurstBoost',
    target: { abilities: ['Overwhelming Bite'] },
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
    ],
    template: 'Overwhelming Bite damage +{N}. If Blood Mist causes you to erupt in a fountain of vile blood, that eruption also deals +{N} damage',
  },
  // Overwhelming Bite Damage +5%. If Blood Mist causes you to erupt in a fountain of vile blood, that eruption also deals +5% damage
  {
    powerId: 'power_18113',
    name: 'OverwhelmingBiteAndBloodMistBurstMod',
    target: { abilities: ['Overwhelming Bite'] },
    effects: [
      { type: 'percentDamage', valuePattern: /damage[^]*?\+(\d+)%/ },
    ],
    template: 'Overwhelming Bite Damage +{N}%. If Blood Mist causes you to erupt in a fountain of vile blood, that eruption also deals +{N}% damage',
  },
  // Overwhelming Bite deals 12 Trauma damage over 8 seconds. This amount is increased by treasure that increases Exsanguinate's bleed damage
  {
    powerId: 'power_18022',
    name: 'OverwhelmingBiteBleed',
    target: { abilities: ['Overwhelming Bite'] },
    effects: [
      { type: 'dot', valuePattern: /deals? \+?(\d+) Trauma damage/, damageType: 'Trauma', duration: 8 },
    ],
    template: 'Overwhelming Bite deals {N} Trauma damage over {N} seconds. This amount is increased by treasure that increases Exsanguinate\'s bleed damage',
  },
  // Overwhelming Bite restores 1 Health
  {
    powerId: 'power_18021',
    name: 'OverwhelmingBiteHealing',
    target: { abilities: ['Overwhelming Bite'] },
    effects: [
      { type: 'restore', valuePattern: /(?:restores?|heals? you for) (\d+) Health/, resourceType: 'Health' },
    ],
    template: 'Overwhelming Bite restores {N} Health',
  },
  // Ripple of Amnesia increases targets' Psychic vulnerability +5% for 30 seconds
  {
    powerId: 'power_18102',
    name: 'RippleOfAmnesiaDebuffPsychic',
    target: 'self',
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Ripple of Amnesia increases targets\' Psychic vulnerability +{N}% for {N} seconds',
  },
  // Ripple of Amnesia boosts your Sprint Speed +5.5 for 15 seconds
  {
    powerId: 'power_18103',
    name: 'RippleOfAmnesiaSpeed',
    target: { abilities: ['Ripple of Amnesia'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Ripple of Amnesia boosts your Sprint Speed +{N} for {N} seconds',
  },
  // Indirect Psychic damage is +11% per tick while Vampirism skill active
  {
    powerId: 'power_18002',
    name: 'VampirismPsychMod',
    target: { abilities: ['Indirect Psychic'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Indirect Psychic damage is +{N}% per tick while Vampirism skill active',
  },
  // Indirect Trauma damage is +11% per tick while Vampirism skill active
  {
    powerId: 'power_18003',
    name: 'VampirismTraumaMod',
    target: { abilities: ['Indirect Trauma'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Indirect Trauma damage is +{N}% per tick while Vampirism skill active',
  },
  // Willbreaker deals +16 Psychic damage over 8 seconds.
  {
    powerId: 'power_18093',
    name: 'WillbreakerDoT',
    target: { abilities: ['Willbreaker'] },
    effects: [
      { type: 'dot', valuePattern: /deals? \+?(\d+) Psychic damage/, damageType: 'Psychic', duration: 8 },
    ],
    template: 'Willbreaker deals +{N} Psychic damage over {N} seconds.',
  },
  // Willbreaker deals +4 damage and induces Fear in the target for 4 seconds, causing them to flee.
  {
    powerId: 'power_18094',
    name: 'WillbreakerFear',
    target: { abilities: ['Willbreaker'] },
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
    ],
    template: 'Willbreaker deals +{N} damage and induces Fear in the target for {N} seconds, causing them to flee.',
  },
  // Using Willbreaker while in Blood Mist form causes you to erupt in a fountain of vile blood: a Burst Trauma attack with Base Damage 7.
  {
    powerId: 'power_18095',
    name: 'WillbreakerTriggerBloodMist',
    target: { abilities: ['Using Willbreaker while in Blood Mist form causes you to erupt in a fountain of vile blood: a Burst Trauma attack with Base'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Using Willbreaker while in Blood Mist form causes you to erupt in a fountain of vile blood: a Burst Trauma attack with Base Damage {N}.',
  },
  // Withering Shroud Damage +3 and increases target's vulnerability to future Darkness attacks +1% for 10 seconds
  {
    powerId: 'power_18085',
    name: 'WitheringShroudDebuffDarkness',
    target: { abilities: ['Withering Shroud'] },
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
    ],
    template: 'Withering Shroud Damage +{N} and increases target\'s vulnerability to future Darkness attacks +{N}% for {N} seconds',
  },
  // Withering Shroud deals 12 Psychic damage over 8 seconds.
  {
    powerId: 'power_18084',
    name: 'WitheringShroudDoT',
    target: { abilities: ['Withering Shroud'] },
    effects: [
      { type: 'dot', valuePattern: /deals? \+?(\d+) Psychic damage/, damageType: 'Psychic', duration: 8 },
    ],
    template: 'Withering Shroud deals {N} Psychic damage over {N} seconds.',
  },
  // Withering Shroud Damage +4, and the next time the victim Evades an attack, it stuns itself.
  {
    powerId: 'power_18083',
    name: 'WitheringShroudPunishEvade',
    target: { abilities: ['Withering Shroud'] },
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
    ],
    template: 'Withering Shroud Damage +{N}, and the next time the victim Evades an attack, it stuns itself.',
  },
];
