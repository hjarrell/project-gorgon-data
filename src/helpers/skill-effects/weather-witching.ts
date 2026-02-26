import type { PowerEffectConfig } from './types';

export const WEATHERWITCHING_EFFECTS: PowerEffectConfig[] = [
  // Calm Skies restores 4 Armor every other second to allies in the area
  {
    powerId: 'power_28704',
    name: 'CalmSkiesArmor',
    target: { abilities: ['Calm Skies'] },
    effects: [
      { type: 'restore', valuePattern: /(?:restores?|heals? you for) (\d+) Armor/, resourceType: 'Armor' },
    ],
    template: 'Calm Skies restores {N} Armor every other second to allies in the area',
  },
  // Calm Skies Reset Time -0.5 seconds / Calm Skies Power Cost -1
  {
    powerId: 'power_28703',
    name: 'CalmSkiesFaster',
    target: 'self',
    effects: [
      { type: 'cooldownDelta', valuePattern: /[Rr]euse [Tt]ime (?:is )?-(\d+(?:\.\d+)?)/ },
      { type: 'costDelta', valuePattern: /[Cc]ost -(\d+)/ },
    ],
    template: 'Calm Skies Reset Time {N} seconds\nCalm Skies Power Cost {N}',
  },
  // Calm Skies restores 2 Health every other second to allies in the area
  {
    powerId: 'power_28701',
    name: 'CalmSkiesHeal',
    target: { abilities: ['Calm Skies'] },
    effects: [
      { type: 'restore', valuePattern: /(?:restores?|heals? you for) (\d+) Health/, resourceType: 'Health' },
    ],
    template: 'Calm Skies restores {N} Health every other second to allies in the area',
  },
  // Calm Skies restores 1 Power every three seconds to allies in the area
  {
    powerId: 'power_28702',
    name: 'CalmSkiesPower',
    target: { abilities: ['Calm Skies'] },
    effects: [
      { type: 'restore', valuePattern: /(?:restores?|heals? you for) (\d+) Power/, resourceType: 'Power' },
    ],
    template: 'Calm Skies restores {N} Power every three seconds to allies in the area',
  },
  // When you trigger Cloud Trick, your next attack deals +20 damage if it deals Nature damage
  {
    powerId: 'power_28685',
    name: 'CloudTrickDamageBoost',
    target: 'self',
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
    ],
    template: 'When you trigger Cloud Trick, your next attack deals +{N} damage if it deals Nature damage',
  },
  // While your Cloud Trick is active (before you teleport), you gain +1% Projectile Evasion and +0.5% Melee Evasion
  {
    powerId: 'power_28683',
    name: 'CloudTrickEvasion',
    target: 'self',
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'While your Cloud Trick is active (before you teleport), you gain +{N}% Projectile Evasion and +{N}% Melee Evasion',
  },
  // When you trigger Cloud Trick, you recover 20 Armor over 10 seconds and the reuse timer on Summon Tornado is hastened +0.5 secs (so it can be used again more quickly)
  {
    powerId: 'power_28687',
    name: 'CloudTrickHastenTornado',
    target: 'self',
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'When you trigger Cloud Trick, you recover {N} Armor over {N} seconds and the reuse timer on Summon Tornado is hastened +{N} secs (so it can be used again more quickly)',
  },
  // When you trigger your Cloud Trick, you recover 10 Health
  {
    powerId: 'power_28681',
    name: 'CloudTrickHeal',
    target: 'self',
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'When you trigger your Cloud Trick, you recover {N} Health',
  },
  // When you trigger your Cloud Trick, you recover 8 Power
  {
    powerId: 'power_28682',
    name: 'CloudTrickPower',
    target: 'self',
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'When you trigger your Cloud Trick, you recover {N} Power',
  },
  // While your Cloud Trick is active (before you teleport), your Movement Speed is +1 and Combat Refreshes restore +2 Power
  {
    powerId: 'power_28686',
    name: 'CloudTrickSpeed',
    target: 'self',
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'While your Cloud Trick is active (before you teleport), your Movement Speed is +{N} and Combat Refreshes restore +{N} Power',
  },
  // Dampen damage +3. If target is more than 10 meters away, dampness splashes to hit all enemies within 7 meters of target
  {
    powerId: 'power_28611',
    name: 'DampenAoE',
    target: { abilities: ['Dampen'] },
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
      { type: 'aoeDelta', valuePattern: /(?:within|targets within) (\d+) meters/ },
    ],
    template: 'Dampen damage +{N}. If target is more than {N} meters away, dampness splashes to hit all enemies within {N} meters of target',
  },
  // Using Dampen, Lightning Bolt, Shocking Grasp, or Hailstorm while simultaneously channeling a different Weather Witching ability boosts your next attack (which is typically the channeled ability, unless it's not an attack) damage +10%
  {
    powerId: 'power_28615',
    name: 'DampenChannelBuff',
    target: 'self',
    effects: [
      { type: 'percentDamage', valuePattern: /damage[^]*?\+(\d+)%/ },
    ],
    template: 'Using Dampen, Lightning Bolt, Shocking Grasp, or Hailstorm while simultaneously channeling a different Weather Witching ability boosts your next attack (which is typically the channeled ability, unless it\'s not an attack) damage +{N}%',
  },
  // Dampen deals Cold damage and debuffs the target so that it takes +3% damage from future Cold attacks for 10 seconds
  {
    powerId: 'power_28613',
    name: 'DampenCold',
    target: { abilities: ['Dampen'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Dampen deals Cold damage and debuffs the target so that it takes +{N}% damage from future Cold attacks for {N} seconds',
  },
  // Dampen debuffs the target so that it takes +3% damage from future Nature attacks for 10 seconds
  {
    powerId: 'power_28614',
    name: 'DampenDebuff',
    target: { abilities: ['Dampen debuffs the target so that it takes +3%'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Dampen debuffs the target so that it takes +{N}% damage from future Nature attacks for {N} seconds',
  },
  // Every other use of Dampen restores 2 Power
  {
    powerId: 'power_28612',
    name: 'DampenPower',
    target: { abilities: ['Every other use of Dampen'] },
    effects: [
      { type: 'restore', valuePattern: /(?:restores?|heals? you for) (\d+) Power/, resourceType: 'Power' },
    ],
    template: 'Every other use of Dampen restores {N} Power',
  },
  // Deluge damage +5 and hits all enemies within 7 meters of your target
  {
    powerId: 'power_28621',
    name: 'DelugeAoE',
    target: { abilities: ['Deluge'] },
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
      { type: 'aoeDelta', valuePattern: /(?:within|targets within) (\d+) meters/ },
    ],
    template: 'Deluge damage +{N} and hits all enemies within {N} meters of your target',
  },
  // Deluge deals +4 damage on contact and increases the target's Poison Vulnerability and Electricity Vulnerability +15% for 30 seconds (non-stacking)
  {
    powerId: 'power_28625',
    name: 'DelugeDebuffPoison',
    target: { abilities: ['Deluge'] },
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
    ],
    template: 'Deluge deals +{N} damage on contact and increases the target\'s Poison Vulnerability and Electricity Vulnerability +{N}% for {N} seconds (non-stacking)',
  },
  // Deluge deals an additional 14 nature damage over 7 seconds
  {
    powerId: 'power_28622',
    name: 'DelugeDoT',
    target: { abilities: ['Deluge'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Deluge deals an additional {N} nature damage over {N} seconds',
  },
  // Deluge deals an additional 7 nature damage over 7 seconds. For 7 seconds, target has a 15% chance to Miss with any Melee attack.
  {
    powerId: 'power_28626',
    name: 'DelugeMissChance',
    target: { abilities: ['Deluge'] },
    effects: [
      { type: 'dot', valuePattern: /deals? \+?(\d+) nature damage/, damageType: 'Nature', duration: 7 },
    ],
    template: 'Deluge deals an additional {N} nature damage over {N} seconds.\nFor {N} seconds, target has a {N}% chance to Miss with any Melee attack.',
  },
  // Deluge Damage +10%
  {
    powerId: 'power_28624',
    name: 'DelugeMod',
    target: { abilities: ['Deluge'] },
    effects: [
      { type: 'percentDamage', valuePattern: /damage[^]*?\+(\d+)%/ },
    ],
    template: 'Deluge Damage +{N}%',
  },
  // Deluge deals +4 damage on contact. If the target uses a ranged attack while deluged, they are stunned afterwards.
  {
    powerId: 'power_28623',
    name: 'DelugeStunReact',
    target: { abilities: ['Deluge'] },
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
    ],
    template: 'Deluge deals +{N} damage on contact. If the target uses a ranged attack while deluged, they are stunned afterwards.',
  },
  // Hailstorm damage +10
  {
    powerId: 'power_28801',
    name: 'HailstormBoost',
    target: { abilities: ['Hailstorm'] },
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
    ],
    template: 'Hailstorm damage +{N}',
  },
  // Hailstorm boosts the damage of your Nice Attacks +5 for 10 seconds
  {
    powerId: 'power_28806',
    name: 'HailstormBoostNice',
    target: { abilities: ['Hailstorm'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Hailstorm boosts the damage of your Nice Attacks +{N} for {N} seconds',
  },
  // Hailstorm boosts your Cold Damage +3% for 15 seconds
  {
    powerId: 'power_28805',
    name: 'HailstormColdBuff',
    target: { abilities: ['Hailstorm'] },
    effects: [
      { type: 'percentDamage', valuePattern: /damage[^]*?\+(\d+)%/ },
    ],
    template: 'Hailstorm boosts your Cold Damage +{N}% for {N} seconds',
  },
  // Hailstorm deals 15 Nature damage over 10 seconds
  {
    powerId: 'power_28804',
    name: 'HailstormDoT',
    target: { abilities: ['Hailstorm'] },
    effects: [
      { type: 'dot', valuePattern: /deals? \+?(\d+) Nature damage/, damageType: 'Nature', duration: 10 },
    ],
    template: 'Hailstorm deals {N} Nature damage over {N} seconds',
  },
  // Hailstorm damage +10%
  {
    powerId: 'power_28802',
    name: 'HailstormMod',
    target: { abilities: ['Hailstorm'] },
    effects: [
      { type: 'percentDamage', valuePattern: /damage[^]*?\+(\d+)%/ },
    ],
    template: 'Hailstorm damage +{N}%',
  },
  // Hailstorm damage +5% and Hailstorm damage type becomes Nature
  {
    powerId: 'power_28803',
    name: 'HailstormNature',
    target: { abilities: ['Hailstorm'] },
    effects: [
      { type: 'percentDamage', valuePattern: /damage[^]*?\+(\d+)%/ },
    ],
    template: 'Hailstorm damage +{N}% and Hailstorm damage type becomes Nature',
  },
  // Lightning Bolt damage +4. If target is more than 10 meters away, the bolt splits to hit all enemies within 7 meters of the target.
  {
    powerId: 'power_28661',
    name: 'LightningBoltAoE',
    target: { abilities: ['Lightning Bolt'] },
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
      { type: 'aoeDelta', valuePattern: /(?:within|targets within) (\d+) meters/ },
    ],
    template: 'Lightning Bolt damage +{N}. If target is more than {N} meters away, the bolt splits to hit all enemies within {N} meters of the target.',
  },
  // Lightning Bolt damage +5
  {
    powerId: 'power_28663',
    name: 'LightningBoltBoost',
    target: { abilities: ['Lightning Bolt'] },
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
    ],
    template: 'Lightning Bolt damage +{N}',
  },
  // Lightning Bolt deals +7 damage and range is +5 meters
  {
    powerId: 'power_28665',
    name: 'LightningBoltFarther',
    target: { abilities: ['Lightning Bolt'] },
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
    ],
    template: 'Lightning Bolt deals +{N} damage and range is +{N} meters',
  },
  // Lightning Bolt deals +3 damage and hastens the current reuse timer of Summon Tornado by 3 seconds
  {
    powerId: 'power_28662',
    name: 'LightningBoltHastenTornado',
    target: { abilities: ['Lightning Bolt'] },
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
      { type: 'cooldownDelta', valuePattern: /by (\d+) seconds?/ },
    ],
    template: 'Lightning Bolt deals +{N} damage and hastens the current reuse timer of Summon Tornado by {N} seconds',
  },
  // Lightning Bolt damage +5%
  {
    powerId: 'power_28664',
    name: 'LightningBoltMod',
    target: { abilities: ['Lightning Bolt'] },
    effects: [
      { type: 'percentDamage', valuePattern: /damage[^]*?\+(\d+)%/ },
    ],
    template: 'Lightning Bolt damage +{N}%',
  },
  // Shocking Grasp Damage +5 and Accuracy +6
  {
    powerId: 'power_28744',
    name: 'ShockingGraspAccuracy',
    target: { abilities: ['Shocking Grasp'] },
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
    ],
    template: 'Shocking Grasp Damage +{N} and Accuracy +{N}',
  },
  // Shocking Grasp Damage +3%
  {
    powerId: 'power_28743',
    name: 'ShockingGraspDamage',
    target: { abilities: ['Shocking Grasp'] },
    effects: [
      { type: 'percentDamage', valuePattern: /damage[^]*?\+(\d+)%/ },
    ],
    template: 'Shocking Grasp Damage +{N}%',
  },
  // Shocking Grasp range is increased +7 meters (but is still a Melee attack)
  {
    powerId: 'power_28742',
    name: 'ShockingGraspRange',
    target: 'self',
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Shocking Grasp range is increased +{N} meters (but is still a Melee attack)',
  },
  // Shocking Grasp Damage +3. Shocking Grasp has a 25% chance to stun the target
  {
    powerId: 'power_28741',
    name: 'ShockingGraspStun',
    target: { abilities: ['Shocking Grasp'] },
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
    ],
    template: 'Shocking Grasp Damage +{N}. Shocking Grasp has a {N}% chance to stun the target',
  },
  // Storm Shield targets all ally pets within 20 meters, but ability reuse time is increased +9 seconds
  {
    powerId: 'power_29946',
    name: 'StormShieldAoE',
    target: 'self',
    effects: [
      { type: 'aoeDelta', valuePattern: /(?:within|targets within) (\d+) meters/ },
    ],
    template: 'Storm Shield targets all ally pets within {N} meters, but ability reuse time is increased +{N} seconds',
  },
  // Storm Shield increases target pet's Electricity Damage and Nature Damage (both direct and indirect) +1% for 15 seconds
  {
    powerId: 'power_29944',
    name: 'StormShieldBoostNatureElectricity',
    target: { abilities: ['Storm Shield increases target pet\'s Electricity'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Storm Shield increases target pet\'s Electricity Damage and Nature Damage (both direct and indirect) +{N}% for {N} seconds',
  },
  // Storm Shield boosts target pet's non-Rage Attack damage +2 for 15 seconds
  {
    powerId: 'power_29942',
    name: 'StormShieldBoostNonRageAttacks',
    target: { abilities: ['Storm Shield'] },
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
    ],
    template: 'Storm Shield boosts target pet\'s non-Rage Attack damage +{N} for {N} seconds',
  },
  // Storm Shield increases target pet's Poison Damage and Acid Damage (both direct and indirect) +1% for 15 seconds
  {
    powerId: 'power_29945',
    name: 'StormShieldBoostPoisonAcid',
    target: { abilities: ['Storm Shield increases target pet\'s Poison'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Storm Shield increases target pet\'s Poison Damage and Acid Damage (both direct and indirect) +{N}% for {N} seconds',
  },
  // Storm Shield boosts target pet's Burst Evasion and Projectile Evasion +1% for 15 seconds
  {
    powerId: 'power_29943',
    name: 'StormShieldEvasion',
    target: { abilities: ['Storm Shield'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Storm Shield boosts target pet\'s Burst Evasion and Projectile Evasion +{N}% for {N} seconds',
  },
  // Storm Shield grants target pet +3 Electricity Mitigation and Nature Mitigation (both direct and indirect) for 15 seconds. In addition, the next attacker that hits the pet will be stunned.
  {
    powerId: 'power_28841',
    name: 'StormShieldShocker',
    target: 'self',
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Storm Shield grants target pet +{N} Electricity Mitigation and Nature Mitigation (both direct and indirect) for {N} seconds. In addition, the next attacker that hits the pet will be stunned.',
  },
  // When you use Summon Tornado 3 or higher, you summon a second tornado that is 2 ability-tiers weaker. In addition all summoned Tornadoes deal +1% Damage
  {
    powerId: 'power_28645',
    name: 'SummonExtraTornado',
    target: 'self',
    effects: [
      { type: 'percentDamage', valuePattern: /damage[^]*?\+(\d+)%/ },
    ],
    template: 'When you use Summon Tornado {N} or higher, you summon a second tornado that is {N} ability-tiers weaker. In addition all summoned Tornadoes deal +{N}% Damage',
  },
  // Summoned Tornadoes move much faster and their attacks deal +4% damage
  {
    powerId: 'power_28643',
    name: 'SummonFastTornadoes',
    target: 'self',
    effects: [
      { type: 'percentDamage', valuePattern: /damage[^]*?\+(\d+)%/ },
    ],
    template: 'Summoned Tornadoes move much faster and their attacks deal +{N}% damage',
  },
  // Summoned Tornadoes have +10 Max Health
  {
    powerId: 'power_28644',
    name: 'SummonHealthyTornadoes',
    target: 'self',
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Summoned Tornadoes have +{N} Max Health',
  },
  // Summoned Tornado attacks deal +6 damage and cause the target to take 15% more damage from Electricity for 10 seconds (non-stacking).
  {
    powerId: 'power_28642',
    name: 'SummonTornadoDebuff',
    target: { abilities: ['Summoned Tornado attacks'] },
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
    ],
    template: 'Summoned Tornado attacks deal +{N} damage and cause the target to take {N}% more damage from Electricity for {N} seconds (non-stacking).',
  },
  // Summon Tornado Reset Time -1 seconds. Tornado attacks deal +10 damage.
  {
    powerId: 'power_28641',
    name: 'SummonTornadoFaster',
    target: { abilities: ['Summon Tornado Reset Time -1 seconds. Tornado attacks'] },
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
    ],
    template: 'Summon Tornado Reset Time {N} seconds. Tornado attacks deal +{N} damage.',
  },
  // Tsunami Damage +10
  {
    powerId: 'power_28761',
    name: 'TsunamiDamage',
    target: { abilities: ['Tsunami'] },
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
    ],
    template: 'Tsunami Damage +{N}',
  },
  // Tsunami deals +28 Nature damage over 7 seconds
  {
    powerId: 'power_28763',
    name: 'TsunamiDoT',
    target: { abilities: ['Tsunami'] },
    effects: [
      { type: 'dot', valuePattern: /deals? \+?(\d+) Nature damage/, damageType: 'Nature', duration: 7 },
    ],
    template: 'Tsunami deals +{N} Nature damage over {N} seconds',
  },
  // Tsunami Damage +10, Every other casting resets the timer on Summon Tornado (so it can be used again immediately)
  {
    powerId: 'power_28762',
    name: 'TsunamiResetSummonTornado',
    target: { abilities: ['Tsunami'] },
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
    ],
    template: 'Tsunami Damage +{N}, Every other casting resets the timer on Summon Tornado (so it can be used again immediately)',
  },
  // Tsunami Damage +3, Targets also take +30% damage from sentient weather phenomena for 30 seconds
  {
    powerId: 'power_28765',
    name: 'TsunamiTornadoVulnA',
    target: { abilities: ['Tsunami'] },
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
    ],
    template: 'Tsunami Damage +{N}, Targets also take +{N}% damage from sentient weather phenomena for {N} seconds',
  },
  // Tsunami Damage +3, Targets also take +30% damage from sentient weather phenomena for 30 seconds
  {
    powerId: 'power_28766',
    name: 'TsunamiTornadoVulnB',
    target: { abilities: ['Tsunami'] },
    effects: [
      { type: 'flatDamage', valuePattern: /deals? \+?(\d+) damage/ },
    ],
    template: 'Tsunami Damage +{N}, Targets also take +{N}% damage from sentient weather phenomena for {N} seconds',
  },
  // Channeled Weather Witching ablilities are not aborted if you are attacked while channeling.
  {
    powerId: 'power_28767',
    name: 'WeatherWitchingSafeChannel',
    target: 'self',
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Channeled Weather Witching ablilities are not aborted if you are attacked while channeling.',
  },
  // When Wind Ward ends, you recover 10 Armor
  {
    powerId: 'power_28787',
    name: 'WindWardArmor',
    target: 'self',
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'When Wind Ward ends, you recover {N} Armor',
  },
  // Wind Ward absorbs +5 damage before dissipating
  {
    powerId: 'power_28781',
    name: 'WindWardBoost',
    target: { abilities: ['Wind Ward absorbs +5'] },
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'Wind Ward absorbs +{N} damage before dissipating',
  },
  // While Wind Ward is active, you gain +1% Burst Evasion
  {
    powerId: 'power_28784',
    name: 'WindWardBurstEvasion',
    target: 'self',
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'While Wind Ward is active, you gain +{N}% Burst Evasion',
  },
  // Wind Ward absorbs +5 damage before dissipating. While Wind Ward is active, attacks that hit you hasten the current reuse timer of Summon Tornado by 1 second
  {
    powerId: 'power_28785',
    name: 'WindWardHastenTornado',
    target: { abilities: ['Wind Ward'] },
    effects: [
      { type: 'cooldownDelta', valuePattern: /by (\d+) seconds?/ },
    ],
    template: 'Wind Ward absorbs +{N} damage before dissipating.\nWhile Wind Ward is active, attacks that hit you hasten the current reuse timer of Summon Tornado by {N} second',
  },
  // When Wind Ward ends, you recover 10 Health
  {
    powerId: 'power_28786',
    name: 'WindWardHealth',
    target: 'self',
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'When Wind Ward ends, you recover {N} Health',
  },
  // While Wind Ward is active, you gain +1% Melee Evasion
  {
    powerId: 'power_28783',
    name: 'WindWardMeleeEvasion',
    target: 'self',
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'While Wind Ward is active, you gain +{N}% Melee Evasion',
  },
  // While Wind Ward is active, you gain +1% Ranged Evasion
  {
    powerId: 'power_28782',
    name: 'WindWardRangedEvasion',
    target: 'self',
    effects: [
      { type: 'todo', valuePattern: /(?:)/ },
    ],
    template: 'While Wind Ward is active, you gain +{N}% Ranged Evasion',
  },
];
