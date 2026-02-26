import type { PowerEffectConfig } from './types';

export const SPIDER_EFFECTS: PowerEffectConfig[] = [
  // Grappling Web causes the target to take +2% damage from Poison (both direct and indirect)
  {
    powerId: 'power_23604',
    name: 'GrapplingWebDebuff',
    target: { abilities: ['Grappling Web causes the target to take +2%'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Grappling Web causes the target to take +{N}% damage from Poison (both direct and indirect)',
  },
  // Grappling Web deals 48 Poison damage over 12 seconds
  {
    powerId: 'power_23602',
    name: 'GrapplingWebDoT',
    target: { abilities: ['Grappling Web'] },
    effects: [
      { type: 'dot', valuePattern: /deals? \+?(\d+) Poison damage/, damageType: 'Poison', duration: 12 },
    ],
    template: 'Grappling Web deals {N} Poison damage over {N} seconds',
  },
  // After using Grappling Web, you are immune to Knockback effects for 12 seconds
  {
    powerId: 'power_23603',
    name: 'GrapplingWebUnmovable',
    target: 'self',
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'After using Grappling Web, you are immune to Knockback effects for {N} seconds',
  },
  // Gripjaw has a 70% chance to deal +20% damage
  {
    powerId: 'power_23203',
    name: 'GripjawCrit',
    target: { abilities: ['Gripjaw'] },
    effects: [
      { type: 'percentDamage', valuePattern: /damage[^]*?\+(\d+)%/ },
    ],
    template: 'Gripjaw has a {N}% chance to deal +{N}% damage',
  },
  // Gripjaw deals +6% damage and hastens the current reset timer of Grappling Web by 1.5 seconds
  {
    powerId: 'power_23205',
    name: 'GripjawHastenGrapplingWeb',
    target: { abilities: ['Gripjaw'] },
    effects: [
      { type: 'percentDamage', valuePattern: /damage[^]*?\+(\d+)%/ },
    ],
    template: 'Gripjaw deals +{N}% damage and hastens the current reset timer of Grappling Web by {N} seconds',
  },
  // Gripjaw deals +3 Armor damage and restores 3 Armor to you
  {
    powerId: 'power_23201',
    name: 'GripjawHealArmor',
    target: { abilities: ['Gripjaw'] },
    effects: [
      { type: 'restore', valuePattern: /(?:restores?|heals? you for) (\d+) Armor/, resourceType: 'Armor' },
    ],
    template: 'Gripjaw deals +{N} Armor damage and restores {N} Armor to you',
  },
  // After using Infinite Legs, additional Infinite Legs attacks deal +5 damage
  {
    powerId: 'power_23254',
    name: 'InfiniteLegsBonus',
    target: 'self',
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
    ],
    template: 'After using Infinite Legs, additional Infinite Legs attacks deal +{N} damage',
  },
  // Infinite Legs has a 2% chance to boost Spider Skill Base Damage +10% for 30 seconds
  {
    powerId: 'power_23005',
    name: 'InfiniteLegsDmgBuff',
    target: { abilities: ['Infinite Legs'] },
    effects: [
      { type: 'percentDamage', valuePattern: /damage[^]*?\+(\d+)%/ },
    ],
    template: 'Infinite Legs has a {N}% chance to boost Spider Skill Base Damage +{N}% for {N} seconds',
  },
  // Infinite Legs deals +5% damage and reuse timer is -0.5 second
  {
    powerId: 'power_23251',
    name: 'InfiniteLegsFaster',
    target: { abilities: ['Infinite Legs'] },
    effects: [
      { type: 'percentDamage', valuePattern: /damage[^]*?\+(\d+)%/ },
    ],
    template: 'Infinite Legs deals +{N}% damage and reuse timer is {N} second',
  },
  // Spider Bite and Infinite Legs restore 1 Health
  {
    powerId: 'power_23252',
    name: 'InfiniteLegsHealth',
    target: { abilities: ['Spider Bite', 'Infinite Legs'] },
    effects: [
      { type: 'restore', valuePattern: /(?:restores?|heals? you for) (\d+) Health/, resourceType: 'Health' },
    ],
    template: 'Spider Bite and Infinite Legs restore {N} Health',
  },
  // Spider Bite and Infinite Legs have a 50% chance to deal +10% damage
  {
    powerId: 'power_23004',
    name: 'InfiniteLegsSpiderBiteCrit',
    target: { abilities: ['Spider Bite', 'Infinite Legs have a 50% chance to'] },
    effects: [
      { type: 'percentDamage', valuePattern: /damage[^]*?\+(\d+)%/ },
    ],
    template: 'Spider Bite and Infinite Legs have a {N}% chance to deal +{N}% damage',
  },
  // Combo: Gripjaw+Any Spider+Any Spider+Inject Venom: final step deals +20% damage.
  {
    powerId: 'power_23024',
    name: 'InjectVenomCombo',
    target: { abilities: ['Combo: Gripjaw+Any Spider+Any Spider+Inject Venom: final step'] },
    effects: [
      { type: 'percentDamage', valuePattern: /damage[^]*?\+(\d+)%/ },
    ],
    template: 'Combo: Gripjaw+Any Spider+Any Spider+Inject Venom: final step deals +{N}% damage.',
  },
  // Inject Venom has a 50% chance to deal +10% damage
  {
    powerId: 'power_23022',
    name: 'InjectVenomCrit',
    target: { abilities: ['Inject Venom'] },
    effects: [
      { type: 'percentDamage', valuePattern: /damage[^]*?\+(\d+)%/ },
    ],
    template: 'Inject Venom has a {N}% chance to deal +{N}% damage',
  },
  // Inject Venom deals +36 Poison damage over 12 seconds
  {
    powerId: 'power_23025',
    name: 'InjectVenomDoT',
    target: { abilities: ['Inject Venom'] },
    effects: [
      { type: 'dot', valuePattern: /deals? \+?(\d+) Poison damage/, damageType: 'Poison', duration: 12 },
    ],
    template: 'Inject Venom deals +{N} Poison damage over {N} seconds',
  },
  // Inject Venom heals you for 2 health
  {
    powerId: 'power_23023',
    name: 'InjectVenomHeal',
    target: { abilities: ['Inject Venom'] },
    effects: [
      { type: 'restore', valuePattern: /(?:restores?|heals? you for) (\d+) health/, resourceType: 'health' },
    ],
    template: 'Inject Venom heals you for {N} health',
  },
  // If you use Premeditated Doom while standing near your Web Trap, you gain +15% Spider Skill Base Damage for 20 seconds
  {
    powerId: 'power_23553',
    name: 'PremeditatedDoomBuffDamage',
    target: 'self',
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'If you use Premeditated Doom while standing near your Web Trap, you gain +{N}% Spider Skill Base Damage for {N} seconds',
  },
  // Premeditated Doom channeling time is -1 second and boosts your Indirect Poison damage +2 (per tick) for 20 seconds
  {
    powerId: 'power_23003',
    name: 'PremeditatedDoomBuffPoison',
    target: { abilities: ['Premeditated Doom channeling time is -1 second and'] },
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
    ],
    template: 'Premeditated Doom channeling time is {N} second and boosts your Indirect Poison damage +{N} (per tick) for {N} seconds',
  },
  // Premeditated Doom boosts sprint speed +1 for 20 seconds
  {
    powerId: 'power_23554',
    name: 'PremeditatedDoomBuffSprint',
    target: { abilities: ['Premeditated Doom'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Premeditated Doom boosts sprint speed +{N} for {N} seconds',
  },
  // Premeditated Doom boosts your Crushing damage +4 for 20 seconds
  {
    powerId: 'power_23552',
    name: 'PremeditatedDoomCrushing',
    target: { abilities: ['Premeditated Doom'] },
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
    ],
    template: 'Premeditated Doom boosts your Crushing damage +{N} for {N} seconds',
  },
  // Premeditated Doom restores 25 health (or armor, if health is full) after a 10-second delay
  {
    powerId: 'power_23551',
    name: 'PremeditatedDoomHeal',
    target: { abilities: ['Premeditated Doom'] },
    effects: [
      { type: 'restore', valuePattern: /(?:restores?|heals? you for) (\d+) health/, resourceType: 'health' },
    ],
    template: 'Premeditated Doom restores {N} health (or armor, if health is full) after a {N}-second delay',
  },
  // Premeditated Doom boosts your Direct Poison damage +4 for 20 seconds
  {
    powerId: 'power_23555',
    name: 'PremeditatedDoomPoison',
    target: { abilities: ['Premeditated Doom'] },
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
    ],
    template: 'Premeditated Doom boosts your Direct Poison damage +{N} for {N} seconds',
  },
  // Incubated Spiders have +10 armor
  {
    powerId: 'power_23302',
    name: 'SpiderPetArmorBoost',
    target: 'self',
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Incubated Spiders have +{N} armor',
  },
  // Incubated Spiders have a 6% chance to avoid being hit by burst attacks
  {
    powerId: 'power_23304',
    name: 'SpiderPetBurstAvoidance',
    target: 'self',
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Incubated Spiders have a {N}% chance to avoid being hit by burst attacks',
  },
  // Incubated Spiders deal +5% direct damage with each attack
  {
    powerId: 'power_23303',
    name: 'SpiderPetDamageBoost',
    target: { abilities: ['Incubated Spiders'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Incubated Spiders deal +{N}% direct damage with each attack',
  },
  // Incubated Spiders have +8 health
  {
    powerId: 'power_23301',
    name: 'SpiderPetHealthBoost',
    target: 'self',
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Incubated Spiders have +{N} health',
  },
  // Incubated Spiders' Rage attacks deal +48 Poison damage over 12 seconds
  {
    powerId: 'power_23305',
    name: 'SpiderPetPoison',
    target: { abilities: ['Incubated Spiders\' Rage attacks'] },
    effects: [
      { type: 'dot', valuePattern: /deals? \+?(\d+) Poison damage/, damageType: 'Poison', duration: 12 },
    ],
    template: 'Incubated Spiders\' Rage attacks deal +{N} Poison damage over {N} seconds',
  },
  // While Spider skill is active, gain Direct Poison and Acid Mitigation +3 and Indirect Poison and Acid Mitigation +1
  {
    powerId: 'power_23402',
    name: 'SpiderPoisonMitigation',
    target: 'self',
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'While Spider skill is active, gain Direct Poison and Acid Mitigation +{N} and Indirect Poison and Acid Mitigation +{N}',
  },
  // Spit Acid deals +18 armor damage
  {
    powerId: 'power_23451',
    name: 'SpitAcidBoost',
    target: { abilities: ['Spit Acid'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Spit Acid deals +{N} armor damage',
  },
  // Spit Acid causes your Signature Debuff abilities to deal +12 damage for 8 seconds
  {
    powerId: 'power_23401',
    name: 'SpitAcidBoostSignatureDebuff',
    target: { abilities: ['Spit Acid causes your Signature Debuff abilities to'] },
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
    ],
    template: 'Spit Acid causes your Signature Debuff abilities to deal +{N} damage for {N} seconds',
  },
  // Spit Acid raises your Poison Damage +4% for 12 seconds
  {
    powerId: 'power_23453',
    name: 'SpitAcidBuff',
    target: { abilities: ['Spit Acid raises your Poison'] },
    effects: [
      { type: 'percentDamage', valuePattern: /damage[^]*?\+(\d+)%/ },
    ],
    template: 'Spit Acid raises your Poison Damage +{N}% for {N} seconds',
  },
  // Spit Acid deals 60 Acid damage to Health over 12 seconds
  {
    powerId: 'power_23452',
    name: 'SpitAcidDoT',
    target: { abilities: ['Spit Acid'] },
    effects: [
      { type: 'dot', valuePattern: /deals? \+?(\d+) Acid damage/, damageType: 'Acid', duration: 12 },
    ],
    template: 'Spit Acid deals {N} Acid damage to Health over {N} seconds',
  },
  // Terrifying Bite causes the target to take +4% damage from Poison
  {
    powerId: 'power_23504',
    name: 'TerrifyingBiteDebuff',
    target: { abilities: ['Terrifying Bite causes the target to take +4%'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Terrifying Bite causes the target to take +{N}% damage from Poison',
  },
  // Terrifying Bite deals 24 Poison damage over 12 seconds
  {
    powerId: 'power_23505',
    name: 'TerrifyingBiteDoT',
    target: { abilities: ['Terrifying Bite'] },
    effects: [
      { type: 'dot', valuePattern: /deals? \+?(\d+) Poison damage/, damageType: 'Poison', duration: 12 },
    ],
    template: 'Terrifying Bite deals {N} Poison damage over {N} seconds',
  },
  // Terrifying Bite damage +6% and reuse timer is -1 seconds
  {
    powerId: 'power_23503',
    name: 'TerrifyingBiteFaster',
    target: { abilities: ['Terrifying Bite'] },
    effects: [
      { type: 'percentDamage', valuePattern: /damage[^]*?\+(\d+)%/ },
    ],
    template: 'Terrifying Bite damage +{N}% and reuse timer is {N} seconds',
  },
  // Terrifying Bite boosts sprint speed +1 for 10 seconds
  {
    powerId: 'power_23501',
    name: 'TerrifyingBiteSpeed',
    target: { abilities: ['Terrifying Bite'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Terrifying Bite boosts sprint speed +{N} for {N} seconds',
  },
  // While you are near your Web Trap, you recover 4 Health per second
  {
    powerId: 'power_23103',
    name: 'WebTrapHealing',
    target: 'self',
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'While you are near your Web Trap, you recover {N} Health per second',
  },
  // Web Trap boosts your movement speed by 2 for 10 seconds
  {
    powerId: 'power_23101',
    name: 'WebTrapSpeedBoost',
    target: { abilities: ['Web Trap'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Web Trap boosts your movement speed by {N} for {N} seconds',
  },
  // While you are near your Web Trap, you recover 3 Power per second
  {
    powerId: 'power_23102',
    name: 'WebTrick',
    target: 'self',
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'While you are near your Web Trap, you recover {N} Power per second',
  },
];
