import type { PowerEffectConfig } from './types';

export const HAMMER_EFFECTS: PowerEffectConfig[] = [
  // Discharging Strike deals +1% damage plus 8% more damage if target's Rage meter is at least 66% full
  {
    powerId: 'power_13302',
    name: 'DischargingStrikeBoostOnRage',
    target: { abilities: ['Discharging Strike'] },
    effects: [
      { type: 'percentDamage', valuePattern: /damage[^]*?\+(\d+)%/ },
    ],
    template: 'Discharging Strike deals +{N}% damage plus {N}% more damage if target\'s Rage meter is at least {N}% full',
  },
  // Discharging Strike and Latent Charge boost your Epic Attack damage +15 for 60 seconds
  {
    powerId: 'power_13303',
    name: 'DischargingStrikeLatentChargeBoostEpic',
    target: { abilities: ['Discharging Strike', 'Latent Charge'] },
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
    ],
    template: 'Discharging Strike and Latent Charge boost your Epic Attack damage +{N} for {N} seconds',
  },
  // Hammer abilities that restore Armor after a 6-second delay also restore 6 Power, increased by 20% of the Armor restored
  {
    powerId: 'power_13007',
    name: 'HammerBoostDelayedArmorGivesPower',
    target: { abilities: ['Hammer abilities that'] },
    effects: [
      { type: 'restore', valuePattern: /(?:restores?|heals? you for) (\d+) Power/, resourceType: 'Power' },
    ],
    template: 'Hammer abilities that restore Armor after a {N}-second delay also restore {N} Power, increased by {N}% of the Armor restored',
  },
  // Direct Electricity Damage, Direct Fire Damage, and Direct Cold Damage +1% while Hammer skill active
  {
    powerId: 'power_13005',
    name: 'HammerBoostElementalDamage',
    target: { abilities: ['Direct Electricity'] },
    effects: [
      { type: 'percentDamage', valuePattern: /damage[^]*?\+(\d+)%/ },
    ],
    template: 'Direct Electricity Damage, Direct Fire Damage, and Direct Cold Damage +{N}% while Hammer skill active',
  },
  // Hammer attacks deal +5% damage to targets whose Rage meters are at least 66% full
  {
    powerId: 'power_13012',
    name: 'HammerBoostVsHighRage',
    target: { abilities: ['Hammer attacks'] },
    effects: [
      { type: 'percentDamage', valuePattern: /damage[^]*?\+(\d+)%/ },
    ],
    template: 'Hammer attacks deal +{N}% damage to targets whose Rage meters are at least {N}% full',
  },
  // Hammer attacks deal +1% damage but generate +3% Rage
  {
    powerId: 'power_13011',
    name: 'HammerBoostWithMoreRage',
    target: { abilities: ['Hammer attacks'] },
    effects: [
      { type: 'percentDamage', valuePattern: /damage[^]*?\+(\d+)%/ },
    ],
    template: 'Hammer attacks deal +{N}% damage but generate +{N}% Rage',
  },
  // Look at My Hammer Reuse Time is -5 seconds, and Core Attacks cause the next use of Look At My Hammer to restore +3 Power
  {
    powerId: 'power_13003',
    name: 'HammerCoreBoostsLookAtMyHammer',
    target: { abilities: ['Look at My Hammer'] },
    effects: [
      { type: 'cooldownDelta', valuePattern: /[Rr]euse [Tt]ime (?:is )?-(\d+)/ },
    ],
    template: 'Look at My Hammer Reuse Time is {N} seconds, and Core Attacks cause the next use of Look At My Hammer to restore +{N} Power',
  },
  // Hammer abilities that restore Armor after a 6-second delay have +80% Armor restoration
  {
    powerId: 'power_13006',
    name: 'HammerDelayedArmorMod',
    target: { abilities: ['Hammer abilities that'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Hammer abilities that restore Armor after a {N}-second delay have +{N}% Armor restoration',
  },
  // Hammer attacks have a 1% chance to Knock Down targets whose Rage meter is at least 66% full
  {
    powerId: 'power_13013',
    name: 'HammerKnockdownVsHighRage',
    target: 'self',
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Hammer attacks have a {N}% chance to Knock Down targets whose Rage meter is at least {N}% full',
  },
  // Hammer attacks that kill an enemy via direct damage restore 8 Power to you and hasten the current reuse timer of Pound to Slag -1 second.
  {
    powerId: 'power_13004',
    name: 'HammerPowerOnKill',
    target: { abilities: ['Hammer attacks that kill an enemy via direct'] },
    effects: [
      { type: 'restore', valuePattern: /(?:restores?|heals? you for) (\d+) Power/, resourceType: 'Power' },
    ],
    template: 'Hammer attacks that kill an enemy via direct damage restore {N} Power to you and hasten the current reuse timer of Pound to Slag {N} second.',
  },
  // Hurl Lightning deals +5% damage and applies Moderate Concussion status: target is prone to random self-stuns
  {
    powerId: 'power_13305',
    name: 'HurlLightningBoostOnRage',
    target: { abilities: ['Hurl Lightning'] },
    effects: [
      { type: 'percentDamage', valuePattern: /damage[^]*?\+(\d+)%/ },
    ],
    template: 'Hurl Lightning deals +{N}% damage and applies Moderate Concussion status: target is prone to random self-stuns',
  },
  // Hurl Lightning Damage +10 and Reuse Time -1 second
  {
    powerId: 'power_13203',
    name: 'HurlLightningSpeedupBoost',
    target: { abilities: ['Hurl Lightning'] },
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
      { type: 'cooldownDelta', valuePattern: /[Rr]euse [Tt]ime (?:is )?-(\d+)/ },
    ],
    template: 'Hurl Lightning Damage +{N} and Reuse Time {N} second',
  },
  // Hurl Lightning and Thunderstrike Damage +5%
  {
    powerId: 'power_13052',
    name: 'HurlLightningThunderstrikeBoost',
    target: { abilities: ['Hurl Lightning', 'Thunderstrike'] },
    effects: [
      { type: 'percentDamage', valuePattern: /damage[^]*?\+(\d+)%/ },
    ],
    template: 'Hurl Lightning and Thunderstrike Damage +{N}%',
  },
  // Latent Charge deals +15 Electricity damage after a 5 second delay
  {
    powerId: 'power_13401',
    name: 'LatentChargeLatentZap',
    target: { abilities: ['Latent Charge'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Latent Charge deals +{N} Electricity damage after a {N} second delay',
  },
  // Latent Charge direct damage becomes Electricity and deals +5 direct damage. In addition, the target takes a second full blast of delayed Electricity damage after a 4-second delay
  {
    powerId: 'power_13403',
    name: 'LatentChargeSecondZap',
    target: { abilities: ['Latent Charge direct'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Latent Charge direct damage becomes Electricity and deals +{N} direct damage. In addition, the target takes a second full blast of delayed Electricity damage after a {N}-second delay',
  },
  // Leaping Smash deals +5 Damage and restores 7 Armor to you after a 6-second delay
  {
    powerId: 'power_13153',
    name: 'LeapingSmashHealArmor',
    target: { abilities: ['Leaping Smash'] },
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
      { type: 'restore', valuePattern: /(?:restores?|heals? you for) (\d+) Armor/, resourceType: 'Armor' },
    ],
    template: 'Leaping Smash deals +{N} Damage and restores {N} Armor to you after a {N}-second delay',
  },
  // Leaping Smash and Latent Charge boost your Core Attack damage +12 for 6 seconds
  {
    powerId: 'power_13152',
    name: 'LeapingSmashLatentChargeBoostCore',
    target: { abilities: ['Leaping Smash', 'Latent Charge'] },
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
    ],
    template: 'Leaping Smash and Latent Charge boost your Core Attack damage +{N} for {N} seconds',
  },
  // Look At My Hammer causes your next ability to deal double direct damage
  {
    powerId: 'power_13107',
    name: 'LookAtMyHammerBoostDamage',
    target: { abilities: ['Look At My Hammer causes your next ability to'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Look At My Hammer causes your next ability to deal double direct damage',
  },
  // Look At My Hammer restores +7 health to you
  {
    powerId: 'power_13101',
    name: 'LookAtMyHammerHeal',
    target: { abilities: ['Look At My Hammer'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Look At My Hammer restores +{N} health to you',
  },
  // Look At My Hammer restores +15 armor to you
  {
    powerId: 'power_13102',
    name: 'LookAtMyHammerHealArmor',
    target: { abilities: ['Look At My Hammer'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Look At My Hammer restores +{N} armor to you',
  },
  // Look At My Hammer reduces the damage you take from Slashing, Piercing, and Crushing attacks by 3 for 15 seconds
  {
    powerId: 'power_13103',
    name: 'LookAtMyHammerMitigation',
    target: { abilities: ['Look At My Hammer reduces the'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Look At My Hammer reduces the damage you take from Slashing, Piercing, and Crushing attacks by {N} for {N} seconds',
  },
  // After using Look At My Hammer, all other Hammer attacks cost -2 Power for 12 seconds
  {
    powerId: 'power_13104',
    name: 'LookAtMyHammerPowerCostReduce',
    target: 'self',
    effects: [
      { type: 'costDelta', valuePattern: /[Cc]ost -(\d+)/ },
    ],
    template: 'After using Look At My Hammer, all other Hammer attacks cost {N} Power for {N} seconds',
  },
  // After using Look At My Hammer, all other Hammer attacks cost -2 Power for 15 seconds
  {
    powerId: 'power_13105',
    name: 'LookAtMyHammerPowerCostReduceB',
    target: 'self',
    effects: [
      { type: 'costDelta', valuePattern: /[Cc]ost -(\d+)/ },
    ],
    template: 'After using Look At My Hammer, all other Hammer attacks cost {N} Power for {N} seconds',
  },
  // After using Look At My Hammer, all other Hammer attacks cost -1 Power for 18 seconds
  {
    powerId: 'power_13106',
    name: 'LookAtMyHammerPowerCostReduceC',
    target: 'self',
    effects: [
      { type: 'costDelta', valuePattern: /[Cc]ost -(\d+)/ },
    ],
    template: 'After using Look At My Hammer, all other Hammer attacks cost {N} Power for {N} seconds',
  },
  // Pound To Slag deals +2% damage and hits all enemies within 5 meters, but Power cost is +35%
  {
    powerId: 'power_13054',
    name: 'PoundToSlagAoE',
    target: { abilities: ['Pound To Slag'] },
    effects: [
      { type: 'percentDamage', valuePattern: /damage[^]*?\+(\d+)%/ },
      { type: 'aoeDelta', valuePattern: /(?:within|targets within) (\d+) meters/ },
    ],
    template: 'Pound To Slag deals +{N}% damage and hits all enemies within {N} meters, but Power cost is +{N}%',
  },
  // Pound To Slag Damage +6 and Reuse Time -5 seconds
  {
    powerId: 'power_13058',
    name: 'PoundToSlagFaster',
    target: { abilities: ['Pound To Slag'] },
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
      { type: 'cooldownDelta', valuePattern: /[Rr]euse [Tt]ime (?:is )?-(\d+)/ },
    ],
    template: 'Pound To Slag Damage +{N} and Reuse Time {N} seconds',
  },
  // Pound To Slag deals +20 damage and hastens the current reuse timer of Look at My Hammer by 5 seconds
  {
    powerId: 'power_13055',
    name: 'PoundToSlagHastenLookAtMyHammer',
    target: { abilities: ['Pound To Slag'] },
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
      { type: 'cooldownDelta', valuePattern: /by (\d+) seconds?/ },
    ],
    template: 'Pound To Slag deals +{N} damage and hastens the current reuse timer of Look at My Hammer by {N} seconds',
  },
  // Pound To Slag restores 8 Health (or Armor, if Health is full)
  {
    powerId: 'power_13053',
    name: 'PoundToSlagHeal',
    target: { abilities: ['Pound To Slag'] },
    effects: [
      { type: 'restore', valuePattern: /(?:restores?|heals? you for) (\d+) Health/, resourceType: 'Health' },
    ],
    template: 'Pound To Slag restores {N} Health (or Armor, if Health is full)',
  },
  // Pound To Slag deals +32 damage if target's Rage is at least 66% full
  {
    powerId: 'power_13057',
    name: 'PoundToSlagVsHighRage',
    target: { abilities: ['Pound To Slag'] },
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
    ],
    template: 'Pound To Slag deals +{N} damage if target\'s Rage is at least {N}% full',
  },
  // Reckless Slam boosts your direct damage mitigation +2 for 5 seconds
  {
    powerId: 'power_13351',
    name: 'RecklessSlamMitigation',
    target: { abilities: ['Reckless Slam'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Reckless Slam boosts your direct damage mitigation +{N} for {N} seconds',
  },
  // Reckless Slam and Reverberating Strike boost your Nice Attack Damage +6 for 9 seconds
  {
    powerId: 'power_13356',
    name: 'RecklessSlamReverberatingStrikeBoostNice',
    target: { abilities: ['Reckless Slam', 'Reverberating Strike'] },
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
    ],
    template: 'Reckless Slam and Reverberating Strike boost your Nice Attack Damage +{N} for {N} seconds',
  },
  // Reverberating Strike restores 6 armor after a 6-second delay
  {
    powerId: 'power_13402',
    name: 'ReverberatingStrikeBoostArmor',
    target: { abilities: ['Reverberating Strike'] },
    effects: [
      { type: 'restore', valuePattern: /(?:restores?|heals? you for) (\d+) armor/, resourceType: 'armor' },
    ],
    template: 'Reverberating Strike restores {N} armor after a {N}-second delay',
  },
  // Rib Shatter deals +5 Damage and restores 10 Armor after a 6-second delay
  {
    powerId: 'power_13202',
    name: 'RibShatterHeal',
    target: { abilities: ['Rib Shatter'] },
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
      { type: 'restore', valuePattern: /(?:restores?|heals? you for) (\d+) Armor/, resourceType: 'Armor' },
    ],
    template: 'Rib Shatter deals +{N} Damage and restores {N} Armor after a {N}-second delay',
  },
  // Rib Shatter deals +7 Damage. If target is Knocked Down it deals a further +6% damage
  {
    powerId: 'power_13204',
    name: 'RibShatterKnockdownBoost',
    target: { abilities: ['Rib Shatter'] },
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
    ],
    template: 'Rib Shatter deals +{N} Damage. If target is Knocked Down it deals a further +{N}% damage',
  },
  // Rib Shatter and Leaping Smash Damage +10% if target's Rage is at least 66% full
  {
    powerId: 'power_13251',
    name: 'RibShatterLeapingSmashBoostOnRage',
    target: { abilities: ['Rib Shatter', 'Leaping Smash'] },
    effects: [
      { type: 'percentDamage', valuePattern: /damage[^]*?\+(\d+)%/ },
    ],
    template: 'Rib Shatter and Leaping Smash Damage +{N}% if target\'s Rage is at least {N}% full',
  },
  // Rib Shatter dispels any roots or slows you are currently suffering. Sprint Speed is increased +1 and Power cost to sprint in combat is reduced -1 for 9 seconds
  {
    powerId: 'power_13206',
    name: 'RibShatterUnstoppable',
    target: { abilities: ['Rib Shatter dispels any roots or slows you are currently suffering. Sprint Speed is increased +1', 'Power'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Rib Shatter dispels any roots or slows you are currently suffering. Sprint Speed is increased +{N} and Power cost to sprint in combat is reduced {N} for {N} seconds',
  },
  // Seismic Impact hits all targets within 8 meters and deals +3% damage
  {
    powerId: 'power_13016',
    name: 'SeismicImpactAoE',
    target: { abilities: ['Seismic Impact hits all targets within 8 meters and'] },
    effects: [
      { type: 'percentDamage', valuePattern: /damage[^]*?\+(\d+)%/ },
      { type: 'aoeDelta', valuePattern: /(?:within|targets within) (\d+) meters/ },
    ],
    template: 'Seismic Impact hits all targets within {N} meters and deals +{N}% damage',
  },
  // Seismic Impact deals +10 Damage and restores 10 Armor to you after a 6-second delay
  {
    powerId: 'power_13017',
    name: 'SeismicImpactArmor',
    target: { abilities: ['Seismic Impact'] },
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
      { type: 'restore', valuePattern: /(?:restores?|heals? you for) (\d+) Armor/, resourceType: 'Armor' },
    ],
    template: 'Seismic Impact deals +{N} Damage and restores {N} Armor to you after a {N}-second delay',
  },
  // Seismic Impact deals +8 Damage. If target is Knocked Down it deals a further +5% damage
  {
    powerId: 'power_13018',
    name: 'SeismicImpactBoostOnKnockdown',
    target: { abilities: ['Seismic Impact'] },
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
    ],
    template: 'Seismic Impact deals +{N} Damage. If target is Knocked Down it deals a further +{N}% damage',
  },
  // Thunderstrike deals +3 Damage and restores 3 Armor after a 6-second delay
  {
    powerId: 'power_13252',
    name: 'ThunderstrikeArmor',
    target: { abilities: ['Thunderstrike'] },
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
      { type: 'restore', valuePattern: /(?:restores?|heals? you for) (\d+) Armor/, resourceType: 'Armor' },
    ],
    template: 'Thunderstrike deals +{N} Damage and restores {N} Armor after a {N}-second delay',
  },
  // Thunderstrike deals +5% damage and knocks all targets back
  {
    powerId: 'power_13253',
    name: 'ThunderstrikeKnockback',
    target: { abilities: ['Thunderstrike'] },
    effects: [
      { type: 'percentDamage', valuePattern: /damage[^]*?\+(\d+)%/ },
    ],
    template: 'Thunderstrike deals +{N}% damage and knocks all targets back',
  },
  // Way of the Hammer restores 16 Armor to all targets
  {
    powerId: 'power_13044',
    name: 'WayOfTheHammerArmor',
    target: { abilities: ['Way of the Hammer'] },
    effects: [
      { type: 'restore', valuePattern: /(?:restores?|heals? you for) (\d+) Armor/, resourceType: 'Armor' },
    ],
    template: 'Way of the Hammer restores {N} Armor to all targets',
  },
  // Way of the Hammer boosts all targets' Electricity Damage +7% for 10 seconds
  {
    powerId: 'power_13056',
    name: 'WayOfTheHammerBoostElectricity',
    target: { abilities: ['Way of the Hammer'] },
    effects: [
      { type: 'percentDamage', valuePattern: /damage[^]*?\+(\d+)%/ },
    ],
    template: 'Way of the Hammer boosts all targets\' Electricity Damage +{N}% for {N} seconds',
  },
  // Way of the Hammer boosts Slashing and Piercing Damage +4% for 10 seconds
  {
    powerId: 'power_13015',
    name: 'WayOfTheHammerBoostSlashAndPierce',
    target: { abilities: ['Way of the Hammer'] },
    effects: [
      { type: 'percentDamage', valuePattern: /damage[^]*?\+(\d+)%/ },
    ],
    template: 'Way of the Hammer boosts Slashing and Piercing Damage +{N}% for {N} seconds',
  },
  // Way of the Hammer grants all targets +5 Direct Mitigation for 10 seconds
  {
    powerId: 'power_13205',
    name: 'WayOfTheHammerMitigation',
    target: 'self',
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Way of the Hammer grants all targets +{N} Direct Mitigation for {N} seconds',
  },
];
