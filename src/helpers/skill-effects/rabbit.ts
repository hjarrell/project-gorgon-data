import type { PowerEffectConfig } from './types';

export const RABBIT_EFFECTS: PowerEffectConfig[] = [
  // Bun-Fu Blast deals +3 damage and restores 10 Power after a 9-second delay
  {
    powerId: 'power_25303',
    name: 'BunFuBlastDelayedPower',
    target: { abilities: ['Bun-Fu Blast'] },
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
      { type: 'restore', valuePattern: /(?:restores?|heals? you for) (\d+) Power/, resourceType: 'Power' },
    ],
    template: 'Bun-Fu Blast deals +{N} damage and restores {N} Power after a {N}-second delay',
  },
  // Bun-Fu Blast deals +6 damage and hastens the current reuse timer of Bun-Fu Strike by 1 seconds
  {
    powerId: 'power_25304',
    name: 'BunFuBlastHastensBunFuStrike',
    target: { abilities: ['Bun-Fu Blast'] },
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
      { type: 'cooldownDelta', valuePattern: /by (\d+) seconds?/ },
    ],
    template: 'Bun-Fu Blast deals +{N} damage and hastens the current reuse timer of Bun-Fu Strike by {N} seconds',
  },
  // All Bun-Fu moves cost -2 Power
  {
    powerId: 'power_25305',
    name: 'BunFuCheaper',
    target: { abilities: ['All Bun-Fu moves'] },
    effects: [
      { type: 'costDelta', valuePattern: /[Cc]ost -(\d+)/ },
    ],
    template: 'All Bun-Fu moves cost {N} Power',
  },
  // Bun-Fu Kick deals +6 damage and hastens the current reset timer of Thump by 1 second
  {
    powerId: 'power_25054',
    name: 'BunFuKickHastenThump',
    target: { abilities: ['Bun-Fu Kick'] },
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
    ],
    template: 'Bun-Fu Kick deals +{N} damage and hastens the current reset timer of Thump by {N} second',
  },
  // Bun-Fu Kick causes the target to take +2% damage from Trauma attacks for 20 seconds
  {
    powerId: 'power_25053',
    name: 'BunFuKickTraumaDebuff',
    target: { abilities: ['Bun-Fu Kick causes the target to take +2%'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Bun-Fu Kick causes the target to take +{N}% damage from Trauma attacks for {N} seconds',
  },
  // Bun-Fu Strike deals +10% damage and reuse time is -1 second
  {
    powerId: 'power_25221',
    name: 'BunFuStrikeBoost',
    target: { abilities: ['Bun-Fu Strike'] },
    effects: [
      { type: 'percentDamage', valuePattern: /damage[^]*?\+(\d+)%/ },
      { type: 'cooldownDelta', valuePattern: /by (\d+) seconds?/ },
    ],
    template: 'Bun-Fu Strike deals +{N}% damage and reuse time is {N} second',
  },
  // Bun-Fu Strike deals Cold damage (instead of Slashing), deals +7 damage, and hastens the current reset timer of Bun-Fu Blast by 1 seconds
  {
    powerId: 'power_25225',
    name: 'BunFuStrikeCold',
    target: { abilities: ['Bun-Fu Strike'] },
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
    ],
    template: 'Bun-Fu Strike deals Cold damage (instead of Slashing), deals +{N} damage, and hastens the current reset timer of Bun-Fu Blast by {N} seconds',
  },
  // Bun-Fu Strike deals +4 damage and hastens the current reset timer of Bun-Fu Kick by 1 seconds
  {
    powerId: 'power_25224',
    name: 'BunFuStrikeHastensBunFuKick',
    target: { abilities: ['Bun-Fu Strike'] },
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
    ],
    template: 'Bun-Fu Strike deals +{N} damage and hastens the current reset timer of Bun-Fu Kick by {N} seconds',
  },
  // Bun-Fu Strike deals +5% damage and restores 3 Health to you after an 8 second delay
  {
    powerId: 'power_25223',
    name: 'BunFuStrikeHeal',
    target: { abilities: ['Bun-Fu Strike'] },
    effects: [
      { type: 'percentDamage', valuePattern: /damage[^]*?\+(\d+)%/ },
      { type: 'restore', valuePattern: /(?:restores?|heals? you for) (\d+) Health/, resourceType: 'Health' },
    ],
    template: 'Bun-Fu Strike deals +{N}% damage and restores {N} Health to you after an {N} second delay',
  },
  // Bun-Fu Strike reduces target's rage by 30, then reduces it by 30 more after a 5 second delay
  {
    powerId: 'power_25222',
    name: 'BunFuStrikeLowerRage',
    target: 'self',
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Bun-Fu Strike reduces target\'s rage by {N}, then reduces it by {N} more after a {N} second delay',
  },
  // Carrot Power restores 9 Armor
  {
    powerId: 'power_25193',
    name: 'CarrotPowerArmor',
    target: { abilities: ['Carrot Power'] },
    effects: [
      { type: 'restore', valuePattern: /(?:restores?|heals? you for) (\d+) Armor/, resourceType: 'Armor' },
    ],
    template: 'Carrot Power restores {N} Armor',
  },
  // Carrot Power boosts your Cold Damage +6% for 10 seconds
  {
    powerId: 'power_25194',
    name: 'CarrotPowerBoostCold',
    target: { abilities: ['Carrot Power'] },
    effects: [
      { type: 'percentDamage', valuePattern: /damage[^]*?\+(\d+)%/ },
    ],
    template: 'Carrot Power boosts your Cold Damage +{N}% for {N} seconds',
  },
  // Carrot Power boosts your Crushing Damage +6% for 10 seconds
  {
    powerId: 'power_25197',
    name: 'CarrotPowerBoostCrushing',
    target: { abilities: ['Carrot Power'] },
    effects: [
      { type: 'percentDamage', valuePattern: /damage[^]*?\+(\d+)%/ },
    ],
    template: 'Carrot Power boosts your Crushing Damage +{N}% for {N} seconds',
  },
  // Carrot Power restores 15 Health after an 8-second delay
  {
    powerId: 'power_25192',
    name: 'CarrotPowerDelayedHealing',
    target: { abilities: ['Carrot Power'] },
    effects: [
      { type: 'restore', valuePattern: /(?:restores?|heals? you for) (\d+) Health/, resourceType: 'Health' },
    ],
    template: 'Carrot Power restores {N} Health after an {N}-second delay',
  },
  // Carrot Power boosts the damage from all kicks +12 for 10 seconds
  {
    powerId: 'power_25196',
    name: 'CarrotPowerKicks',
    target: { abilities: ['Carrot Power'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Carrot Power boosts the damage from all kicks +{N} for {N} seconds',
  },
  // Carrot Power's reuse timer is -1 second and chance to consume carrot is -4%
  {
    powerId: 'power_25195',
    name: 'CarrotPowerNibble',
    target: { abilities: ['Carrot Power\'s'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Carrot Power\'s reuse timer is {N} second and chance to consume carrot is {N}%',
  },
  // Hare Dash restores 8 Armor to you
  {
    powerId: 'power_25101',
    name: 'HareDashArmor',
    target: { abilities: ['Hare Dash'] },
    effects: [
      { type: 'restore', valuePattern: /(?:restores?|heals? you for) (\d+) Armor/, resourceType: 'Armor' },
    ],
    template: 'Hare Dash restores {N} Armor to you',
  },
  // Hare Dash causes your next attack to deal +10 damage if it is a Crushing attack
  {
    powerId: 'power_25102',
    name: 'HareDashBuff',
    target: { abilities: ['Hare Dash causes your next attack to'] },
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
    ],
    template: 'Hare Dash causes your next attack to deal +{N} damage if it is a Crushing attack',
  },
  // Hare Dash grants +5% Melee Evasion for 8 seconds and boosts jump height for 15 seconds
  {
    powerId: 'power_25103',
    name: 'HareDashJump',
    target: { abilities: ['Hare Dash grants +5% Melee Evasion for 8 seconds and'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Hare Dash grants +{N}% Melee Evasion for {N} seconds and boosts jump height for {N} seconds',
  },
  // Hare Dash restores 5 Power over 15 seconds
  {
    powerId: 'power_25105',
    name: 'HareDashPower',
    target: { abilities: ['Hare Dash'] },
    effects: [
      { type: 'restore', valuePattern: /(?:restores?|heals? you for) (\d+) Power/, resourceType: 'Power' },
    ],
    template: 'Hare Dash restores {N} Power over {N} seconds',
  },
  // Bun-Fu Blast deals Cold damage (instead of Psychic), and Ice Magic attacks boost the damage of Bun-Fu Blast by 1% for 60 seconds (max 20 stacks)
  {
    powerId: 'power_25302',
    name: 'IceMagicBoostsBunFuBlast',
    target: { abilities: ['Bun-Fu Blast'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Bun-Fu Blast deals Cold damage (instead of Psychic), and Ice Magic attacks boost the damage of Bun-Fu Blast by {N}% for {N} seconds (max {N} stacks)',
  },
  // Long Ear grants you +3% Projectile Evasion for 15 seconds
  {
    powerId: 'power_25161',
    name: 'LongEarProjectileEvasion',
    target: 'self',
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Long Ear grants you +{N}% Projectile Evasion for {N} seconds',
  },
  // Love Tap lowers target's aggro toward you by 50
  {
    powerId: 'power_25351',
    name: 'LoveTapDeAggro',
    target: 'self',
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Love Tap lowers target\'s aggro toward you by {N}',
  },
  // Love Tap causes target to suffer +2% damage from future physical attacks (Slashing, Crushing, and Piercing) for 10 seconds
  {
    powerId: 'power_25355',
    name: 'LoveTapDebuff',
    target: { abilities: ['Love Tap causes target to suffer +2%'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Love Tap causes target to suffer +{N}% damage from future physical attacks (Slashing, Crushing, and Piercing) for {N} seconds',
  },
  // Love Tap boosts your Melee Evasion +4% for 15 seconds
  {
    powerId: 'power_25354',
    name: 'LoveTapEvasion',
    target: { abilities: ['Love Tap'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Love Tap boosts your Melee Evasion +{N}% for {N} seconds',
  },
  // Love Tap hastens the current reuse timer of Carrot Power by 1 second
  {
    powerId: 'power_25352',
    name: 'LoveTapHastenCarrotPower',
    target: { abilities: ['Love Tap hastens the current'] },
    effects: [
      { type: 'cooldownDelta', valuePattern: /by (\d+) seconds?/ },
    ],
    template: 'Love Tap hastens the current reuse timer of Carrot Power by {N} second',
  },
  // Love Tap deals 30 Trauma damage after a 4-second delay
  {
    powerId: 'power_25353',
    name: 'LoveTapTrauma',
    target: { abilities: ['Love Tap'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Love Tap deals {N} Trauma damage after a {N}-second delay',
  },
  // Play Dead boosts your Nice Attack Damage +18 for 15 seconds
  {
    powerId: 'power_25134',
    name: 'PlayDeadBoostNice',
    target: { abilities: ['Play Dead'] },
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
    ],
    template: 'Play Dead boosts your Nice Attack Damage +{N} for {N} seconds',
  },
  // Play Dead causes all affected enemies to take 30 Psychic damage after a 5-second delay
  {
    powerId: 'power_25133',
    name: 'PlayDeadDelayedPsychicBlast',
    target: { abilities: ['Play Dead causes all affected enemies to take 30 Psychic'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Play Dead causes all affected enemies to take {N} Psychic damage after a {N}-second delay',
  },
  // Play Dead restores 15 Health
  {
    powerId: 'power_25131',
    name: 'PlayDeadHeal',
    target: { abilities: ['Play Dead'] },
    effects: [
      { type: 'restore', valuePattern: /(?:restores?|heals? you for) (\d+) Health/, resourceType: 'Health' },
    ],
    template: 'Play Dead restores {N} Health',
  },
  // Play Dead boosts your Psychic attack damage +16 for 20 seconds
  {
    powerId: 'power_25132',
    name: 'PlayDeadPsychicBoost',
    target: { abilities: ['Play Dead'] },
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
    ],
    template: 'Play Dead boosts your Psychic attack damage +{N} for {N} seconds',
  },
  // Play Dead Area of Effect +5 meters, and victims suffer -7 direct mitigation for 30 seconds
  {
    powerId: 'power_25135',
    name: 'PlayDeadWider',
    target: 'self',
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Play Dead Area of Effect +{N} meters, and victims suffer {N} direct mitigation for {N} seconds',
  },
  // While Rabbit skill is active, all Kick abilities deal +1% damage, with a 10% chance to deal double damage
  {
    powerId: 'power_25007',
    name: 'RabbitKickCrit',
    target: 'self',
    effects: [
      { type: 'percentDamage', valuePattern: /damage[^]*?\+(\d+)%/ },
    ],
    template: 'While Rabbit skill is active, all Kick abilities deal +{N}% damage, with a {N}% chance to deal double damage',
  },
  // While Rabbit skill is active, all Kick abilities deal +1% damage, with a 10% chance to deal double damage
  {
    powerId: 'power_25008',
    name: 'RabbitKickCritB',
    target: 'self',
    effects: [
      { type: 'percentDamage', valuePattern: /damage[^]*?\+(\d+)%/ },
    ],
    template: 'While Rabbit skill is active, all Kick abilities deal +{N}% damage, with a {N}% chance to deal double damage',
  },
  // While Rabbit skill is active, any Kick ability boosts Melee Evasion +3% for 10 seconds
  {
    powerId: 'power_25006',
    name: 'RabbitKickEvade',
    target: 'self',
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'While Rabbit skill is active, any Kick ability boosts Melee Evasion +{N}% for {N} seconds',
  },
  // Rabbit Scratch deals Trauma damage (instead of Slashing), and deals up to +8 damage (randomly determined)
  {
    powerId: 'power_25011',
    name: 'RabbitScratchBoost',
    target: { abilities: ['Rabbit Scratch'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Rabbit Scratch deals Trauma damage (instead of Slashing), and deals up to +{N} damage (randomly determined)',
  },
  // Rabbit Scratch restores 1 Armor to you
  {
    powerId: 'power_25012',
    name: 'RabbitScratchHeal',
    target: { abilities: ['Rabbit Scratch'] },
    effects: [
      { type: 'restore', valuePattern: /(?:restores?|heals? you for) (\d+) Armor/, resourceType: 'Armor' },
    ],
    template: 'Rabbit Scratch restores {N} Armor to you',
  },
  // Rabbit's Foot grants you and nearby allies +5% Burst Evasion for 10 seconds
  {
    powerId: 'power_25071',
    name: 'RabbitsFootBurstEvade',
    target: 'self',
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Rabbit\'s Foot grants you and nearby allies +{N}% Burst Evasion for {N} seconds',
  },
  // Rabbit's Foot restores 10 Health to you and nearby allies after a 15 second delay
  {
    powerId: 'power_25074',
    name: 'RabbitsFootDelayedHeal',
    target: { abilities: ['Rabbit\'s Foot'] },
    effects: [
      { type: 'restore', valuePattern: /(?:restores?|heals? you for) (\d+) Health/, resourceType: 'Health' },
    ],
    template: 'Rabbit\'s Foot restores {N} Health to you and nearby allies after a {N} second delay',
  },
  // Rabbit's Foot restores 7 Power to you and nearby allies
  {
    powerId: 'power_25073',
    name: 'RabbitsFootPower',
    target: { abilities: ['Rabbit\'s Foot'] },
    effects: [
      { type: 'restore', valuePattern: /(?:restores?|heals? you for) (\d+) Power/, resourceType: 'Power' },
    ],
    template: 'Rabbit\'s Foot restores {N} Power to you and nearby allies',
  },
  // Rabbit's Foot grants you and nearby allies +2% Earned Combat XP for 20 seconds
  {
    powerId: 'power_25072',
    name: 'RabbitsFootXpBoost',
    target: 'self',
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Rabbit\'s Foot grants you and nearby allies +{N}% Earned Combat XP for {N} seconds',
  },
  // Thump causes the target to take +2% damage from Cold attacks for 10 seconds
  {
    powerId: 'power_25023',
    name: 'ThumpColdDebuff',
    target: { abilities: ['Thump causes the target to take +2%'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Thump causes the target to take +{N}% damage from Cold attacks for {N} seconds',
  },
  // Thump deals +1 damage and knocks the enemy backwards
  {
    powerId: 'power_25022',
    name: 'ThumpKnockback',
    target: { abilities: ['Thump'] },
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
    ],
    template: 'Thump deals +{N} damage and knocks the enemy backwards',
  },
  // Thump causes 18 Trauma damage over 12 seconds
  {
    powerId: 'power_25024',
    name: 'ThumpTrauma',
    target: { abilities: ['Thump causes 18 Trauma'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Thump causes {N} Trauma damage over {N} seconds',
  },
];
