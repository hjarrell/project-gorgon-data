import type { PowerEffectConfig } from './types';

export const ANIMALHANDLING_EFFECTS: PowerEffectConfig[] = [
  // Animal Handling pets' basic attacks deal +5% damage
  {
    powerId: 'power_12319',
    name: 'AnimalHandlingBasicAttackBoost',
    target: { abilities: ['Animal Handling pets\' basic attacks'] },
    effects: [
      { type: 'percentDamage', valuePattern: /damage[^]*?\+(\d+)%/ },
    ],
    template: 'Animal Handling pets\' basic attacks deal +{N}% damage',
  },
  // Animal Handling pets' Clever Trick abilities deal +20 damage
  {
    powerId: 'power_12315',
    name: 'CleverTrickPetBoost',
    target: { abilities: ['Animal Handling pets\' Clever Trick abilities'] },
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
    ],
    template: 'Animal Handling pets\' Clever Trick abilities deal +{N} damage',
  },
  // For 10 seconds after using Clever Trick, animal handling pets' basic attacks have a 20% chance to deal double damage
  {
    powerId: 'power_12317',
    name: 'CleverTrickPetBuffBasic',
    target: 'self',
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'For {N} seconds after using Clever Trick, animal handling pets\' basic attacks have a {N}% chance to deal double damage',
  },
  // Animal Handling pets' Clever Trick abilities deal +5% damage
  {
    powerId: 'power_12316',
    name: 'CleverTrickPetMod',
    target: { abilities: ['Animal Handling pets\' Clever Trick abilities'] },
    effects: [
      { type: 'percentDamage', valuePattern: /damage[^]*?\+(\d+)%/ },
    ],
    template: 'Animal Handling pets\' Clever Trick abilities deal +{N}% damage',
  },
  // Feed Pet restores 20 Health (or Armor if Health is full) to your pet after a 20 second delay
  {
    powerId: 'power_12091',
    name: 'FeedPetDelayedHeal',
    target: { abilities: ['Feed Pet'] },
    effects: [
      { type: 'restore', valuePattern: /(?:restores?|heals? you for) (\d+) Health/, resourceType: 'Health' },
    ],
    template: 'Feed Pet restores {N} Health (or Armor if Health is full) to your pet after a {N} second delay',
  },
  // Feed Pet restores 10 Armor to your pet and hastens the current reuse timer of Clever Trick by -1 second
  {
    powerId: 'power_12092',
    name: 'FeedPetReduceTimer',
    target: { abilities: ['Feed Pet'] },
    effects: [
      { type: 'restore', valuePattern: /(?:restores?|heals? you for) (\d+) Armor/, resourceType: 'Armor' },
    ],
    template: 'Feed Pet restores {N} Armor to your pet and hastens the current reuse timer of Clever Trick by {N} second',
  },
  // Get It Off Me heals you for 25 Health after a 15 second delay
  {
    powerId: 'power_12053',
    name: 'GetItOffMeDelayedHeal',
    target: { abilities: ['Get It Off Me'] },
    effects: [
      { type: 'restore', valuePattern: /(?:restores?|heals? you for) (\d+) Health/, resourceType: 'Health' },
    ],
    template: 'Get It Off Me heals you for {N} Health after a {N} second delay',
  },
  // Get It Off Me restores 20 Armor to you
  {
    powerId: 'power_12052',
    name: 'GetItOffMeSelfHeal',
    target: { abilities: ['Get It Off Me'] },
    effects: [
      { type: 'restore', valuePattern: /(?:restores?|heals? you for) (\d+) Armor/, resourceType: 'Armor' },
    ],
    template: 'Get It Off Me restores {N} Armor to you',
  },
  // Get It Off Me increases your pet's Taunt an additional +20%
  {
    powerId: 'power_12051',
    name: 'GetItOffMeTauntBoost',
    target: 'self',
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Get It Off Me increases your pet\'s Taunt an additional +{N}%',
  },
  // Animal Handling pets have +16 Max Armor
  {
    powerId: 'power_12302',
    name: 'HandledAnimalArmorBoost',
    target: 'self',
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Animal Handling pets have +{N} Max Armor',
  },
  // Animal Handling pets absorb some direct damage based on their remaining Armor (absorbing 0% when armor is empty, up to 20% when armor is full)
  {
    powerId: 'power_12310',
    name: 'HandledAnimalArmorMitigationRatio',
    target: { abilities: ['Animal Handling pets absorb some direct'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Animal Handling pets absorb some direct damage based on their remaining Armor (absorbing {N}% when armor is empty, up to {N}% when armor is full)',
  },
  // Animal Handling pets have +1.5% Max Armor, and every second they recover Armor equal to 2% of their Max Armor
  {
    powerId: 'power_12312',
    name: 'HandledAnimalArmorRegen',
    target: 'self',
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Animal Handling pets have +{N}% Max Armor, and every second they recover Armor equal to {N}% of their Max Armor',
  },
  // Animal Handling pets deal +2% damage when they critically hit
  {
    powerId: 'power_12306',
    name: 'HandledAnimalCritBoost',
    target: { abilities: ['Animal Handling pets'] },
    effects: [
      { type: 'percentDamage', valuePattern: /damage[^]*?\+(\d+)%/ },
    ],
    template: 'Animal Handling pets deal +{N}% damage when they critically hit',
  },
  // Animal Handling pets have +3% Death Avoidance (on success, ignores a fatal attack and chance is reduced -100%; resets after 15 minutes)
  {
    powerId: 'power_12311',
    name: 'HandledAnimalDeathAvoidance',
    target: 'self',
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Animal Handling pets have +{N}% Death Avoidance (on success, ignores a fatal attack and chance is reduced {N}%; resets after {N} minutes)',
  },
  // Animal Handling pets' damage-over-time effects (if any) deal +10% damage per tick
  {
    powerId: 'power_12309',
    name: 'HandledAnimalDoTMod',
    target: { abilities: ['Animal Handling pets\''] },
    effects: [
      { type: 'percentDamage', valuePattern: /damage[^]*?\+(\d+)%/ },
    ],
    template: 'Animal Handling pets\' damage-over-time effects (if any) deal +{N}% damage per tick',
  },
  // Animal Handling pets' healing abilities, if any, restore +16% health
  {
    powerId: 'power_12313',
    name: 'HandledAnimalHealingMod',
    target: 'self',
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Animal Handling pets\' healing abilities, if any, restore +{N}% health',
  },
  // Animal Handling pets have +13 Max Health
  {
    powerId: 'power_12301',
    name: 'HandledAnimalHealthBoost',
    target: 'self',
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Animal Handling pets have +{N} Max Health',
  },
  // Animal Handling pets' Sic 'Em abilities taunt +100
  {
    powerId: 'power_12305',
    name: 'HandledAnimalSicEmTaunt',
    target: 'self',
    effects: [
      { type: 'tauntDelta', valuePattern: /[Tt]aunt \+(\d+)/ },
    ],
    template: 'Animal Handling pets\' Sic \'Em abilities taunt +{N}',
  },
  // Animal Handling pets' Sic 'Em and Clever Trick attacks deal +10 damage
  {
    powerId: 'power_12303',
    name: 'HandledAnimalSpecialAttackBoost',
    target: { abilities: ['Animal Handling pets\' Sic \'Em', 'Clever Trick attacks'] },
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
    ],
    template: 'Animal Handling pets\' Sic \'Em and Clever Trick attacks deal +{N} damage',
  },
  // Animal Handling pets taunt as if they did +20% additional damage
  {
    powerId: 'power_12307',
    name: 'HandledAnimalTauntBoost',
    target: { abilities: ['Animal Handling pets taunt as if they did +20% additional'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Animal Handling pets taunt as if they did +{N}% additional damage',
  },
  // Animal Handling pets taunt their opponents 3% less
  {
    powerId: 'power_12308',
    name: 'HandledAnimalTauntReduce',
    target: 'self',
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Animal Handling pets taunt their opponents {N}% less',
  },
  // Mark Weakness causes your next attack to deal +14 damage if it is a Psychic attack
  {
    powerId: 'power_12335',
    name: 'MarkWeaknessBoostPsychic',
    target: { abilities: ['Mark Weakness causes your next attack to'] },
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
    ],
    template: 'Mark Weakness causes your next attack to deal +{N} damage if it is a Psychic attack',
  },
  // Mark Weakness further increases target's Pet Vulnerability +2%. Reuse time -1 seconds.
  {
    powerId: 'power_12334',
    name: 'MarkWeaknessDebuff',
    target: { abilities: ['Mark Weakness further increases target\'s Pet Vulnerability +2%.'] },
    effects: [
      { type: 'cooldownDelta', valuePattern: /by (\d+) seconds?/ },
    ],
    template: 'Mark Weakness further increases target\'s Pet Vulnerability +{N}%. Reuse time {N} seconds.',
  },
  // When Mark Weakness is used on a target that has less than 33% of their max Rage, it triggers again, targeting an enemy within 8 meters of the first (using Mark Weakness 1)
  {
    powerId: 'power_12333',
    name: 'MarkWeaknessHop',
    target: { abilities: ['When Mark Weakness is used on a target that'] },
    effects: [
      { type: 'aoeDelta', valuePattern: /(?:within|targets within) (\d+) meters/ },
    ],
    template: 'When Mark Weakness is used on a target that has less than {N}% of their max Rage, it triggers again, targeting an enemy within {N} meters of the first (using Mark Weakness {N})',
  },
  // Monstrous Rage boosts your Crushing attack damage +1% for 8 seconds
  {
    powerId: 'power_12013',
    name: 'MonstrousRageSelfCrushingBoost',
    target: { abilities: ['Monstrous Rage'] },
    effects: [
      { type: 'percentDamage', valuePattern: /damage[^]*?\+(\d+)%/ },
    ],
    template: 'Monstrous Rage boosts your Crushing attack damage +{N}% for {N} seconds',
  },
  // Monstrous Rage boosts your Slashing attack damage +1% for 8 seconds
  {
    powerId: 'power_12012',
    name: 'MonstrousRageSelfSlashingBoost',
    target: { abilities: ['Monstrous Rage'] },
    effects: [
      { type: 'percentDamage', valuePattern: /damage[^]*?\+(\d+)%/ },
    ],
    template: 'Monstrous Rage boosts your Slashing attack damage +{N}% for {N} seconds',
  },
  // Nimble Limbs heals your pet for 7 Health (or Armor if Health is full)
  {
    powerId: 'power_12103',
    name: 'NimbleLimbsHeal',
    target: { abilities: ['Nimble Limbs'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Nimble Limbs heals your pet for {N} Health (or Armor if Health is full)',
  },
  // Nimble Limbs gives pet +4% melee evasion for 30 seconds
  {
    powerId: 'power_12314',
    name: 'NimbleLimbsMeleeEvasion',
    target: 'self',
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Nimble Limbs gives pet +{N}% melee evasion for {N} seconds',
  },
  // Nimble Limbs grants your pet +1 mitigation vs. physical (slashing, piercing, and crushing) attacks for 15 seconds
  {
    powerId: 'power_12141',
    name: 'NimbleLimbsProtection',
    target: 'self',
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Nimble Limbs grants your pet +{N} mitigation vs. physical (slashing, piercing, and crushing) attacks for {N} seconds',
  },
  // Monstrous Rage and Unnatural Wrath boost your pet's next attack damage +8
  {
    powerId: 'power_12014',
    name: 'PetDmgBoostBoost',
    target: { abilities: ['Monstrous Rage', 'Unnatural Wrath'] },
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
    ],
    template: 'Monstrous Rage and Unnatural Wrath boost your pet\'s next attack damage +{N}',
  },
  // Shrill Command deals +6% damage and hastens the current reuse timer of Clever Trick by 1 second
  {
    powerId: 'power_12008',
    name: 'ShrillCommandCritLowerCleverTrick',
    target: { abilities: ['Shrill Command'] },
    effects: [
      { type: 'percentDamage', valuePattern: /damage[^]*?\+(\d+)%/ },
      { type: 'cooldownDelta', valuePattern: /by (\d+) seconds?/ },
    ],
    template: 'Shrill Command deals +{N}% damage and hastens the current reuse timer of Clever Trick by {N} second',
  },
  // Shrill Command deals +6% damage and shortens the current reuse time of Sic 'Em by 1 second
  {
    powerId: 'power_12009',
    name: 'ShrillCommandLowerSicEmReset',
    target: { abilities: ['Shrill Command'] },
    effects: [
      { type: 'percentDamage', valuePattern: /damage[^]*?\+(\d+)%/ },
    ],
    template: 'Shrill Command deals +{N}% damage and shortens the current reuse time of Sic \'Em by {N} second',
  },
  // Shrill Command deals +10% damage and reduces the target's Rage by -50
  {
    powerId: 'power_12011',
    name: 'ShrillCommandReduceRage',
    target: { abilities: ['Shrill Command'] },
    effects: [
      { type: 'percentDamage', valuePattern: /damage[^]*?\+(\d+)%/ },
    ],
    template: 'Shrill Command deals +{N}% damage and reduces the target\'s Rage by {N}',
  },
  // Sic Em gives both you and your pet +2 Accuracy for 10 seconds
  {
    powerId: 'power_12024',
    name: 'SicEmAccuracyBoost',
    target: 'self',
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Sic Em gives both you and your pet +{N} Accuracy for {N} seconds',
  },
  // Sic Em boosts your pet's Crushing attacks (if any) +10 damage for 10 seconds
  {
    powerId: 'power_12023',
    name: 'SicEmCrushingBoost',
    target: { abilities: ['Sic Em'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Sic Em boosts your pet\'s Crushing attacks (if any) +{N} damage for {N} seconds',
  },
  // Sic 'Em restores 5 Health to both you and your pet
  {
    powerId: 'power_12026',
    name: 'SicEmHeal',
    target: { abilities: ['Sic \'Em'] },
    effects: [
      { type: 'restore', valuePattern: /(?:restores?|heals? you for) (\d+) Health/, resourceType: 'Health' },
    ],
    template: 'Sic \'Em restores {N} Health to both you and your pet',
  },
  // Animal Handling pets' Sic 'Em attacks deal +1% damage
  {
    powerId: 'power_12304',
    name: 'SicEmPetMod',
    target: { abilities: ['Animal Handling pets\' Sic \'Em attacks'] },
    effects: [
      { type: 'percentDamage', valuePattern: /damage[^]*?\+(\d+)%/ },
    ],
    template: 'Animal Handling pets\' Sic \'Em attacks deal +{N}% damage',
  },
  // Sic Em causes your pet's attacks to generate -26 Rage for 10 seconds
  {
    powerId: 'power_12025',
    name: 'SicEmRageDelta',
    target: 'self',
    effects: [
      { type: 'rageDelta', valuePattern: /(\d+) Rage/ },
    ],
    template: 'Sic Em causes your pet\'s attacks to generate {N} Rage for {N} seconds',
  },
  // When you use Sic Em, your sprint speed increases by +1 for 10 seconds
  {
    powerId: 'power_12021',
    name: 'SicEmSelfSpeedBoost',
    target: 'self',
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'When you use Sic Em, your sprint speed increases by +{N} for {N} seconds',
  },
  // Sic Em boosts your pet's Slashing attacks (if any) +10 damage for 10 seconds
  {
    powerId: 'power_12022',
    name: 'SicEmSlashingBoost',
    target: { abilities: ['Sic Em'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Sic Em boosts your pet\'s Slashing attacks (if any) +{N} damage for {N} seconds',
  },
  // That'll Do restores 12 Health to your pet and 2 Power to you
  {
    powerId: 'power_12161',
    name: 'ThatllDoBoost',
    target: { abilities: ['That\'ll Do'] },
    effects: [
      { type: 'restore', valuePattern: /(?:restores?|heals? you for) (\d+) Health/, resourceType: 'Health' },
    ],
    template: 'That\'ll Do restores {N} Health to your pet and {N} Power to you',
  },
  // Unnatural Wrath grants your pet +8% mitigation versus direct attacks for 14 seconds. After 15 seconds, the pet takes 10 psychic damage. (You can negate the latent psychic damage by using First Aid 4+ on your pet.)
  {
    powerId: 'power_12106',
    name: 'UnnaturalWrathFesteringWound',
    target: 'self',
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Unnatural Wrath grants your pet +{N}% mitigation versus direct attacks for {N} seconds. After {N} seconds, the pet takes {N} psychic damage. (You can negate the latent psychic damage by using First Aid {N}+ on your pet.)',
  },
  // Unnatural Wrath causes your pet to bleed for 10 trauma damage over 10 seconds, but also deal +9 damage per attack during that time
  {
    powerId: 'power_12105',
    name: 'UnnaturalWrathPetAbuse',
    target: { abilities: ['Unnatural Wrath causes your pet to bleed for 10 trauma'] },
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
    ],
    template: 'Unnatural Wrath causes your pet to bleed for {N} trauma damage over {N} seconds, but also deal +{N} damage per attack during that time',
  },
  // Using Unnatural Wrath on your pet heals you for 8 Health (or Armor if Health is full)
  {
    powerId: 'power_12104',
    name: 'UnnaturalWrathSelfHeal',
    target: { abilities: ['Using Unnatural Wrath on your pet'] },
    effects: [
      { type: 'restore', valuePattern: /(?:restores?|heals? you for) (\d+) Health/, resourceType: 'Health' },
    ],
    template: 'Using Unnatural Wrath on your pet heals you for {N} Health (or Armor if Health is full)',
  },
  // Wild Endurance heals your pet for 15 Health (or Armor if Health is full)
  {
    powerId: 'power_12102',
    name: 'WildEnduranceHeal',
    target: { abilities: ['Wild Endurance'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Wild Endurance heals your pet for {N} Health (or Armor if Health is full)',
  },
  // After using Wild Endurance, your next use of Feed Pet restores +15 Health/Armor
  {
    powerId: 'power_12122',
    name: 'WildEnduranceHealingBoost',
    target: 'self',
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'After using Wild Endurance, your next use of Feed Pet restores +{N} Health/Armor',
  },
  // Wild Endurance gives your pet complete stun immunity and +1 Health/Armor healing per second for 15 seconds
  {
    powerId: 'power_12121',
    name: 'WildEnduranceStunImmunity',
    target: 'self',
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Wild Endurance gives your pet complete stun immunity and +{N} Health/Armor healing per second for {N} seconds',
  },
];
