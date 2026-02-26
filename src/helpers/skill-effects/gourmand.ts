import type { PowerEffectConfig } from './types';

export const GOURMAND_EFFECTS: PowerEffectConfig[] = [
  // Your attacks deal +3 damage to Aberrations
  {
    powerId: 'power_31413',
    name: 'BrewingBoostVsAberrations',
    target: { abilities: ['Your attacks'] },
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
    ],
    template: 'Your attacks deal +{N} damage to Aberrations',
  },
  // Your attacks deal +3 damage to Arthropods
  {
    powerId: 'power_31405',
    name: 'BrewingBoostVsArthropods',
    target: { abilities: ['Your attacks'] },
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
    ],
    template: 'Your attacks deal +{N} damage to Arthropods',
  },
  // Your attacks deal +3 damage to Bears
  {
    powerId: 'power_31408',
    name: 'BrewingBoostVsBears',
    target: { abilities: ['Your attacks'] },
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
    ],
    template: 'Your attacks deal +{N} damage to Bears',
  },
  // Your attacks deal +3 damage to Canines
  {
    powerId: 'power_31403',
    name: 'BrewingBoostVsCanines',
    target: { abilities: ['Your attacks'] },
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
    ],
    template: 'Your attacks deal +{N} damage to Canines',
  },
  // Your attacks deal +3 damage to Felines
  {
    powerId: 'power_31404',
    name: 'BrewingBoostVsCats',
    target: { abilities: ['Your attacks'] },
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
    ],
    template: 'Your attacks deal +{N} damage to Felines',
  },
  // Your attacks deal +3 damage to Constructs
  {
    powerId: 'power_31415',
    name: 'BrewingBoostVsConstructs',
    target: { abilities: ['Your attacks'] },
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
    ],
    template: 'Your attacks deal +{N} damage to Constructs',
  },
  // Your attacks deal +3 damage to Crone-Kin
  {
    powerId: 'power_31424',
    name: 'BrewingBoostVsCrones',
    target: { abilities: ['Your attacks'] },
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
    ],
    template: 'Your attacks deal +{N} damage to Crone-Kin',
  },
  // Your attacks deal +3 damage to Demons
  {
    powerId: 'power_31419',
    name: 'BrewingBoostVsDemons',
    target: { abilities: ['Your attacks'] },
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
    ],
    template: 'Your attacks deal +{N} damage to Demons',
  },
  // Your attacks deal +3 damage to Dinosaurs
  {
    powerId: 'power_31420',
    name: 'BrewingBoostVsDinosaurs',
    target: { abilities: ['Your attacks'] },
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
    ],
    template: 'Your attacks deal +{N} damage to Dinosaurs',
  },
  // Your attacks deal +3 damage to Dwarves
  {
    powerId: 'power_31427',
    name: 'BrewingBoostVsDwarves',
    target: { abilities: ['Your attacks'] },
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
    ],
    template: 'Your attacks deal +{N} damage to Dwarves',
  },
  // Your attacks deal +3 damage to Elementals
  {
    powerId: 'power_31414',
    name: 'BrewingBoostVsElementals',
    target: { abilities: ['Your attacks'] },
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
    ],
    template: 'Your attacks deal +{N} damage to Elementals',
  },
  // Your attacks deal +3 damage to Elves
  {
    powerId: 'power_31401',
    name: 'BrewingBoostVsElves',
    target: { abilities: ['Your attacks'] },
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
    ],
    template: 'Your attacks deal +{N} damage to Elves',
  },
  // Your attacks deal +3 damage to Fey
  {
    powerId: 'power_31410',
    name: 'BrewingBoostVsFey',
    target: { abilities: ['Your attacks'] },
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
    ],
    template: 'Your attacks deal +{N} damage to Fey',
  },
  // Your attacks deal +3 damage to Fish
  {
    powerId: 'power_31416',
    name: 'BrewingBoostVsFish',
    target: { abilities: ['Your attacks'] },
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
    ],
    template: 'Your attacks deal +{N} damage to Fish',
  },
  // Your attacks deal +3 damage to Fungoids
  {
    powerId: 'power_31417',
    name: 'BrewingBoostVsFungoids',
    target: { abilities: ['Your attacks'] },
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
    ],
    template: 'Your attacks deal +{N} damage to Fungoids',
  },
  // Your attacks deal +3 damage to Giants
  {
    powerId: 'power_31412',
    name: 'BrewingBoostVsGiants',
    target: { abilities: ['Your attacks'] },
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
    ],
    template: 'Your attacks deal +{N} damage to Giants',
  },
  // Your attacks deal +3 damage to Goblins
  {
    powerId: 'power_31409',
    name: 'BrewingBoostVsGoblins',
    target: { abilities: ['Your attacks'] },
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
    ],
    template: 'Your attacks deal +{N} damage to Goblins',
  },
  // Your attacks deal +3 damage to Humans
  {
    powerId: 'power_31421',
    name: 'BrewingBoostVsHumans',
    target: { abilities: ['Your attacks'] },
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
    ],
    template: 'Your attacks deal +{N} damage to Humans',
  },
  // Your attacks deal +3 damage to Incorporeal Creatures
  {
    powerId: 'power_31423',
    name: 'BrewingBoostVsIncorporeal',
    target: { abilities: ['Your attacks'] },
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
    ],
    template: 'Your attacks deal +{N} damage to Incorporeal Creatures',
  },
  // Your attacks deal +3 damage to Orcs
  {
    powerId: 'power_31411',
    name: 'BrewingBoostVsOrcs',
    target: { abilities: ['Your attacks'] },
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
    ],
    template: 'Your attacks deal +{N} damage to Orcs',
  },
  // Your attacks deal +3 damage to Plants
  {
    powerId: 'power_31425',
    name: 'BrewingBoostVsPlants',
    target: { abilities: ['Your attacks'] },
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
    ],
    template: 'Your attacks deal +{N} damage to Plants',
  },
  // Your attacks deal +3 damage to Rakshasa
  {
    powerId: 'power_31402',
    name: 'BrewingBoostVsRakshasa',
    target: { abilities: ['Your attacks'] },
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
    ],
    template: 'Your attacks deal +{N} damage to Rakshasa',
  },
  // Your attacks deal +3 damage to Reptiles
  {
    powerId: 'power_31426',
    name: 'BrewingBoostVsReptiles',
    target: { abilities: ['Your attacks'] },
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
    ],
    template: 'Your attacks deal +{N} damage to Reptiles',
  },
  // Your attacks deal +3 damage to Rodents
  {
    powerId: 'power_31418',
    name: 'BrewingBoostVsRodents',
    target: { abilities: ['Your attacks'] },
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
    ],
    template: 'Your attacks deal +{N} damage to Rodents',
  },
  // Your attacks deal +3 damage to Ruminants
  {
    powerId: 'power_31406',
    name: 'BrewingBoostVsRuminants',
    target: { abilities: ['Your attacks'] },
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
    ],
    template: 'Your attacks deal +{N} damage to Ruminants',
  },
  // Your attacks deal +3 damage to (corporeal) Undead
  {
    powerId: 'power_31422',
    name: 'BrewingBoostVsUndead',
    target: { abilities: ['Your attacks'] },
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
    ],
    template: 'Your attacks deal +{N} damage to (corporeal) Undead',
  },
  // Your attacks deal +3 damage to (non-ruminant) Ungulates
  {
    powerId: 'power_31407',
    name: 'BrewingBoostVsUngulates',
    target: { abilities: ['Your attacks'] },
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
    ],
    template: 'Your attacks deal +{N} damage to (non-ruminant) Ungulates',
  },
  // Your burst attacks deal +10 damage to Elite enemies
  {
    powerId: 'power_31368',
    name: 'BrewingBurstBoostVsElites',
    target: { abilities: ['Your burst attacks'] },
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
    ],
    template: 'Your burst attacks deal +{N} damage to Elite enemies',
  },
  // Dwarves gain +5 Max Armor
  {
    powerId: 'power_31212',
    name: 'BrewingMaxArmorDwarf',
    target: 'self',
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Dwarves gain +{N} Max Armor',
  },
  // Elves gain +5 Max Armor
  {
    powerId: 'power_31208',
    name: 'BrewingMaxArmorElf',
    target: 'self',
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Elves gain +{N} Max Armor',
  },
  // Fairies gain +5 Max Armor
  {
    powerId: 'power_31210',
    name: 'BrewingMaxArmorFae',
    target: 'self',
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Fairies gain +{N} Max Armor',
  },
  // Humans gain +5 Max Armor
  {
    powerId: 'power_31207',
    name: 'BrewingMaxArmorHuman',
    target: 'self',
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Humans gain +{N} Max Armor',
  },
  // Orcs gain +5 Max Armor
  {
    powerId: 'power_31211',
    name: 'BrewingMaxArmorOrc',
    target: 'self',
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Orcs gain +{N} Max Armor',
  },
  // Rakshasa gain +5 Max Armor
  {
    powerId: 'power_31209',
    name: 'BrewingMaxArmorRak',
    target: 'self',
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Rakshasa gain +{N} Max Armor',
  },
  // Dwarves gain +1 Max Bodyheat
  {
    powerId: 'power_31236',
    name: 'BrewingMaxBodyHeatDwarf',
    target: 'self',
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Dwarves gain +{N} Max Bodyheat',
  },
  // Elves gain +1 Max Bodyheat
  {
    powerId: 'power_31232',
    name: 'BrewingMaxBodyHeatElf',
    target: 'self',
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Elves gain +{N} Max Bodyheat',
  },
  // Fairies gain +1 Max Bodyheat
  {
    powerId: 'power_31234',
    name: 'BrewingMaxBodyHeatFae',
    target: 'self',
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Fairies gain +{N} Max Bodyheat',
  },
  // Humans gain +1 Max Bodyheat
  {
    powerId: 'power_31231',
    name: 'BrewingMaxBodyHeatHuman',
    target: 'self',
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Humans gain +{N} Max Bodyheat',
  },
  // Orcs gain +1 Max Bodyheat
  {
    powerId: 'power_31235',
    name: 'BrewingMaxBodyHeatOrc',
    target: 'self',
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Orcs gain +{N} Max Bodyheat',
  },
  // Rakshasa gain +1 Max Bodyheat
  {
    powerId: 'power_31233',
    name: 'BrewingMaxBodyHeatRak',
    target: 'self',
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Rakshasa gain +{N} Max Bodyheat',
  },
  // Dwarves gain +6 Max Health
  {
    powerId: 'power_31206',
    name: 'BrewingMaxHealthDwarf',
    target: 'self',
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Dwarves gain +{N} Max Health',
  },
  // Elves gain +6 Max Health
  {
    powerId: 'power_31202',
    name: 'BrewingMaxHealthElf',
    target: 'self',
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Elves gain +{N} Max Health',
  },
  // Fairies gain +6 Max Health
  {
    powerId: 'power_31204',
    name: 'BrewingMaxHealthFae',
    target: 'self',
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Fairies gain +{N} Max Health',
  },
  // Humans gain +6 Max Health
  {
    powerId: 'power_31201',
    name: 'BrewingMaxHealthHuman',
    target: 'self',
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Humans gain +{N} Max Health',
  },
  // Orcs gain +6 Max Health
  {
    powerId: 'power_31205',
    name: 'BrewingMaxHealthOrc',
    target: 'self',
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Orcs gain +{N} Max Health',
  },
  // Rakshasa gain +6 Max Health
  {
    powerId: 'power_31203',
    name: 'BrewingMaxHealthRak',
    target: 'self',
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Rakshasa gain +{N} Max Health',
  },
  // Dwarves gain +1 Max Hydration
  {
    powerId: 'power_31242',
    name: 'BrewingMaxHydrationDwarf',
    target: 'self',
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Dwarves gain +{N} Max Hydration',
  },
  // Elves gain +1 Max Hydration
  {
    powerId: 'power_31238',
    name: 'BrewingMaxHydrationElf',
    target: 'self',
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Elves gain +{N} Max Hydration',
  },
  // Fairies gain +1 Max Hydration
  {
    powerId: 'power_31240',
    name: 'BrewingMaxHydrationFae',
    target: 'self',
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Fairies gain +{N} Max Hydration',
  },
  // Humans gain +1 Max Hydration
  {
    powerId: 'power_31237',
    name: 'BrewingMaxHydrationHuman',
    target: 'self',
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Humans gain +{N} Max Hydration',
  },
  // Orcs gain +1 Max Hydration
  {
    powerId: 'power_31241',
    name: 'BrewingMaxHydrationOrc',
    target: 'self',
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Orcs gain +{N} Max Hydration',
  },
  // Rakshasa gain +1 Max Hydration
  {
    powerId: 'power_31239',
    name: 'BrewingMaxHydrationRak',
    target: 'self',
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Rakshasa gain +{N} Max Hydration',
  },
  // Dwarves gain +1 Max Metabolism
  {
    powerId: 'power_31230',
    name: 'BrewingMaxMetabDwarf',
    target: 'self',
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Dwarves gain +{N} Max Metabolism',
  },
  // Elves gain +1 Max Metabolism
  {
    powerId: 'power_31226',
    name: 'BrewingMaxMetabElf',
    target: 'self',
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Elves gain +{N} Max Metabolism',
  },
  // Fairies gain +1 Max Metabolism
  {
    powerId: 'power_31228',
    name: 'BrewingMaxMetabFae',
    target: 'self',
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Fairies gain +{N} Max Metabolism',
  },
  // Humans gain +1 Max Metabolism
  {
    powerId: 'power_31225',
    name: 'BrewingMaxMetabHuman',
    target: 'self',
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Humans gain +{N} Max Metabolism',
  },
  // Orcs gain +1 Max Metabolism
  {
    powerId: 'power_31229',
    name: 'BrewingMaxMetabOrc',
    target: 'self',
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Orcs gain +{N} Max Metabolism',
  },
  // Rakshasa gain +1 Max Metabolism
  {
    powerId: 'power_31227',
    name: 'BrewingMaxMetabRak',
    target: 'self',
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Rakshasa gain +{N} Max Metabolism',
  },
  // Dwarves gain +4 Max Power
  {
    powerId: 'power_31218',
    name: 'BrewingMaxPowerDwarf',
    target: 'self',
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Dwarves gain +{N} Max Power',
  },
  // Elves gain +4 Max Power
  {
    powerId: 'power_31214',
    name: 'BrewingMaxPowerElf',
    target: 'self',
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Elves gain +{N} Max Power',
  },
  // Fairies gain +4 Max Power
  {
    powerId: 'power_31216',
    name: 'BrewingMaxPowerFae',
    target: 'self',
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Fairies gain +{N} Max Power',
  },
  // Humans gain +4 Max Power
  {
    powerId: 'power_31213',
    name: 'BrewingMaxPowerHuman',
    target: 'self',
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Humans gain +{N} Max Power',
  },
  // Orcs gain +4 Max Power
  {
    powerId: 'power_31217',
    name: 'BrewingMaxPowerOrc',
    target: 'self',
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Orcs gain +{N} Max Power',
  },
  // Rakshasa gain +4 Max Power
  {
    powerId: 'power_31215',
    name: 'BrewingMaxPowerRak',
    target: 'self',
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Rakshasa gain +{N} Max Power',
  },
  // Your melee attacks deal +6 damage to Elite enemies
  {
    powerId: 'power_31366',
    name: 'BrewingMeleeBoostVsElites',
    target: { abilities: ['Your melee attacks'] },
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
    ],
    template: 'Your melee attacks deal +{N} damage to Elite enemies',
  },
  // You take -1 damage from Elite monsters' attacks
  {
    powerId: 'power_31319',
    name: 'BrewingMitigateElites',
    target: { abilities: ['You take -1'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'You take {N} damage from Elite monsters\' attacks',
  },
  // Your ranged attacks deal +6 damage to Elite enemies
  {
    powerId: 'power_31367',
    name: 'BrewingRangedBoostVsElites',
    target: { abilities: ['Your ranged attacks'] },
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
    ],
    template: 'Your ranged attacks deal +{N} damage to Elite enemies',
  },
  // Elves earn +1% Combat XP when feeling Clean, but earn -1% Combat XP when Dirty
  {
    powerId: 'power_31220',
    name: 'BrewingXpElf',
    target: 'self',
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Elves earn +{N}% Combat XP when feeling Clean, but earn {N}% Combat XP when Dirty',
  },
  // Elves earn +1% Combat XP when feeling Clean, but earn NO Combat XP when Dirty
  {
    powerId: 'power_31223',
    name: 'BrewingXpElf2',
    target: 'self',
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Elves earn +{N}% Combat XP when feeling Clean, but earn NO Combat XP when Dirty',
  },
  // Humans earn +1% Combat XP when feeling Community-Minded, but earn -1% Combat XP when Lonely
  {
    powerId: 'power_31219',
    name: 'BrewingXpHuman',
    target: 'self',
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Humans earn +{N}% Combat XP when feeling Community-Minded, but earn {N}% Combat XP when Lonely',
  },
  // Humans earn +1% Combat XP when feeling Community-Minded, but earn NO Combat XP when Lonely
  {
    powerId: 'power_31222',
    name: 'BrewingXpHuman2',
    target: 'self',
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Humans earn +{N}% Combat XP when feeling Community-Minded, but earn NO Combat XP when Lonely',
  },
  // Rakshasa earn +1% Combat XP when feeling Peaceable, but earn -1% Combat XP when feeling Dead Inside
  {
    powerId: 'power_31221',
    name: 'BrewingXpRak',
    target: 'self',
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Rakshasa earn +{N}% Combat XP when feeling Peaceable, but earn {N}% Combat XP when feeling Dead Inside',
  },
  // Rakshasa earn +1% Combat XP when feeling Peaceable, but earn NO Combat XP when feeling Dead Inside
  {
    powerId: 'power_31224',
    name: 'BrewingXpRak2',
    target: 'self',
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Rakshasa earn +{N}% Combat XP when feeling Peaceable, but earn NO Combat XP when feeling Dead Inside',
  },
];
