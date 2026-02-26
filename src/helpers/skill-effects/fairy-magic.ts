import type { PowerEffectConfig } from './types';

export const FAIRYMAGIC_EFFECTS: PowerEffectConfig[] = [
  // Astral Strike causes all targets to suffer +12 damage from direct Cold attacks for 10 seconds
  {
    powerId: 'power_9867',
    name: 'AstralStrikeColdDebuff',
    target: { abilities: ['Astral Strike causes all targets to suffer +12'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Astral Strike causes all targets to suffer +{N} damage from direct Cold attacks for {N} seconds',
  },
  // Astral Strike's reuse timer is -1 secs, and damage is boosted +5% vs Elite enemies
  {
    powerId: 'power_9862',
    name: 'AstralStrikeDamageVsElites',
    target: { abilities: ['Astral Strike\'s'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Astral Strike\'s reuse timer is {N} secs, and damage is boosted +{N}% vs Elite enemies',
  },
  // Astral Strike's damage type becomes Fire, and it deals an additional 25 damage over 10 seconds
  {
    powerId: 'power_9864',
    name: 'AstralStrikeDoT',
    target: { abilities: ['Astral Strike\'s'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Astral Strike\'s damage type becomes Fire, and it deals an additional {N} damage over {N} seconds',
  },
  // Astral Strike deals +10 damage and resets the timer on Pixie Flare (so it can be used again immediately)
  {
    powerId: 'power_9866',
    name: 'AstralStrikeResetPixieFlare',
    target: { abilities: ['Astral Strike'] },
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
    ],
    template: 'Astral Strike deals +{N} damage and resets the timer on Pixie Flare (so it can be used again immediately)',
  },
  // Astral Strike's damage is +10 and all targets are Stunned
  {
    powerId: 'power_9863',
    name: 'AstralStrikeStun',
    target: { abilities: ['Astral Strike\'s'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Astral Strike\'s damage is +{N} and all targets are Stunned',
  },
  // Fae Conduit also buffs targets' direct Cold, Fire, and Electricity damage +8 for 30 seconds (stacking up to 6 times)
  {
    powerId: 'power_9885',
    name: 'FaeConduitBuffDamage',
    target: { abilities: ['Fae Conduit also buffs targets\' direct Cold', 'Fire', 'Electricity'] },
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
    ],
    template: 'Fae Conduit also buffs targets\' direct Cold, Fire, and Electricity damage +{N} for {N} seconds (stacking up to {N} times)',
  },
  // Fae Conduit's Power cost is -5 and reuse timer is -1 second
  {
    powerId: 'power_9884',
    name: 'FaeConduitCheaper',
    target: { abilities: ['Fae Conduit\'s Power'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Fae Conduit\'s Power cost is {N} and reuse timer is {N} second',
  },
  // Fae Conduit reuse timer is -1 second
  {
    powerId: 'power_9882',
    name: 'FaeConduitFaster',
    target: { abilities: ['Fae Conduit'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Fae Conduit reuse timer is {N} second',
  },
  // Fae Conduit also heals 10 Health every 5 seconds
  {
    powerId: 'power_9883',
    name: 'FaeConduitHeal',
    target: { abilities: ['Fae Conduit also'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Fae Conduit also heals {N} Health every {N} seconds',
  },
  // Fae Conduit restores +1 Power every 5 seconds
  {
    powerId: 'power_9881',
    name: 'FaeConduitMorePower',
    target: { abilities: ['Fae Conduit'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Fae Conduit restores +{N} Power every {N} seconds',
  },
  // Fairy Fire causes your next attack to deal +8 damage if it's a Psychic, Electricity, or Fire attack
  {
    powerId: 'power_9854',
    name: 'FairyFireBoostNextAttack',
    target: { abilities: ['Fairy Fire causes your next attack to'] },
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
    ],
    template: 'Fairy Fire causes your next attack to deal +{N} damage if it\'s a Psychic, Electricity, or Fire attack',
  },
  // Fairy Fire's damage type becomes Fire, and it deals an additional 15 Fire damage over 10 seconds
  {
    powerId: 'power_9853',
    name: 'FairyFireDoT',
    target: { abilities: ['Fairy Fire\'s'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Fairy Fire\'s damage type becomes Fire, and it deals an additional {N} Fire damage over {N} seconds',
  },
  // Fairy Fire damage is +4 and attack range is +5
  {
    powerId: 'power_9851',
    name: 'FairyFireRange',
    target: { abilities: ['Fairy Fire'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Fairy Fire damage is +{N} and attack range is +{N}',
  },
  // Fairy Fire deals +5 damage, plus it stuns incorporeal enemies
  {
    powerId: 'power_9855',
    name: 'FairyFireStunsGhosts',
    target: { abilities: ['Fairy Fire'] },
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
    ],
    template: 'Fairy Fire deals +{N} damage, plus it stuns incorporeal enemies',
  },
  // Pixie Flare's attack range is +5, and it deals +15 damage to targets that are covered in Fairy Fire
  {
    powerId: 'power_9873',
    name: 'PixieFlareBoostedByFairyFire',
    target: 'self',
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
    ],
    template: 'Pixie Flare\'s attack range is +{N}, and it deals +{N} damage to targets that are covered in Fairy Fire',
  },
  // Pixie Flare's damage is +7 and reuse timer is -1 sec
  {
    powerId: 'power_9871',
    name: 'PixieFlareFaster',
    target: { abilities: ['Pixie Flare\'s'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Pixie Flare\'s damage is +{N} and reuse timer is {N} sec',
  },
  // Pixie Flare's damage is +7 and its damage becomes Fire instead of Electricity
  {
    powerId: 'power_9874',
    name: 'PixieFlareFire',
    target: { abilities: ['Pixie Flare\'s'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Pixie Flare\'s damage is +{N} and its damage becomes Fire instead of Electricity',
  },
  // Pixie Flare restores 3 Health to you
  {
    powerId: 'power_9875',
    name: 'PixieFlareHeal',
    target: { abilities: ['Pixie Flare'] },
    effects: [
      { type: 'restore', valuePattern: /(?:restores?|heals? you for) (\d+) Health/, resourceType: 'Health' },
    ],
    template: 'Pixie Flare restores {N} Health to you',
  },
  // Pixie Flare deals +7 damage, and deals +33% total damage against Demons
  {
    powerId: 'power_9876',
    name: 'PixieFlareVsDemons',
    target: { abilities: ['Pixie Flare'] },
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
    ],
    template: 'Pixie Flare deals +{N} damage, and deals +{N}% total damage against Demons',
  },
];
