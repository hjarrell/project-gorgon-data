import type {
  CombatSimState,
  RotationEntry,
  ActiveDoT,
  ActiveSong,
} from './types';
import { isBardSong, getCooldownGroup } from './ability-selection';
import { applyDamageToEnemy, applyRage } from './enemy';

// ── Song Constants ──────────────────────────────────

const SONG_TICK_INTERVAL = 2; // Bard songs tick every 2 seconds
const SONG_DURATION = 60;     // Bard songs last 60 seconds

// ── Casting ─────────────────────────────────────────

export function castAbility(state: CombatSimState, entry: RotationEntry): void {
  const dr = entry.damageResult;
  const cooldown = Math.max(0, dr.resetTime.modified);

  // Deduct power
  const cost = Math.max(0, dr.powerCost.modified);
  state.currentPower -= cost;
  state.totalPowerSpent += cost;

  // Apply power restores from this ability
  let powerRestored = 0;
  for (const restore of dr.restores) {
    if (restore.resourceType === 'Power') {
      powerRestored += restore.value;
    }
  }
  if (powerRestored > 0) {
    state.currentPower = Math.min(state.config.maxPower, state.currentPower + powerRestored);
    state.totalPowerRestored += powerRestored;
  }

  // Apply health restores
  if (state.config.maxHealth > 0) {
    let healthRestored = 0;
    for (const restore of dr.restores) {
      if (restore.resourceType === 'Health') {
        healthRestored += restore.value;
      }
    }
    if (healthRestored > 0) {
      state.currentHealth = Math.min(state.config.maxHealth, state.currentHealth + healthRestored);
    }
  }

  // Set cooldown
  const group = getCooldownGroup(entry.ability);
  state.cooldownTimers.set(group, state.currentTime + cooldown);
  state.lastCastTime = state.currentTime;

  // Update cast count
  const prevCasts = state.abilityCasts.get(entry.abilityId) ?? 0;
  state.abilityCasts.set(entry.abilityId, prevCasts + 1);

  // Update per-ability stats (power tracking for all abilities)
  const stats = state.abilityDamageMap.get(entry.abilityId);
  if (stats) {
    stats.casts += 1;
    stats.totalPowerSpent += cost;
    stats.totalPowerRestored += powerRestored;
  }

  // ── Song handling ─────────────────────────────────
  if (isBardSong(entry.ability)) {
    castSong(state, entry, cost);
    return;
  }

  // ── Normal ability handling ───────────────────────

  // Calculate expected damage with crit EV
  const baseDmg = Math.max(0, dr.modifiedDamage);
  const critChance = Math.min(1, Math.max(0, state.config.baseCritChance + dr.crit.critChanceBonus));
  const critMult = dr.crit.modifiedCritDamageMod;
  const critBonus = critMult > 0 ? critChance * (critMult - 1) : 0;
  const expectedDamage = baseDmg * (1 + critBonus);
  const critBonusDamage = baseDmg * critBonus;

  // Route through enemy damage pipeline
  const pve = entry.ability.PvE;
  const enemyResult = applyDamageToEnemy(
    state,
    expectedDamage,
    entry.ability.DamageType,
    pve?.ArmorMitigationRatio,
    pve?.ArmorSpecificDamage ?? 0,
    pve?.HealthSpecificDamage ?? 0,
    dr.aoe != null,
  );

  state.totalDirectDamage += expectedDamage;
  state.totalCritDamage += critBonusDamage;
  state.totalAoeDamage += enemyResult.aoeBonusDamage;

  if (stats) {
    stats.totalDirectDamage += expectedDamage;
    stats.totalCritBonusDamage += critBonusDamage;
    stats.totalAoeDamage += enemyResult.aoeBonusDamage;
  }

  // Apply rage (RageBoost from ability is typically negative = reduces enemy rage)
  applyRage(state, enemyResult.effectiveDamage, dr.rage.modified);

  // Apply DoTs
  for (const dot of dr.dots) {
    if (dot.duration > 0 && dot.numTicks > 0) {
      const tickInterval = dot.duration / dot.numTicks;
      const modifiedPerTick = dot.modifiedTotalDamage / dot.numTicks;
      const activeDot: ActiveDoT = {
        sourceAbilityId: entry.abilityId,
        damagePerTick: modifiedPerTick,
        damageType: dot.damageType,
        tickInterval,
        nextTickAt: state.currentTime + tickInterval,
        expiresAt: state.currentTime + dot.duration,
        ticksRemaining: dot.numTicks,
      };
      state.activeDoTs.push(activeDot);
    }
  }

  // Log timeline event with enemy snapshot
  const enemy = state.enemyState;
  state.timeline.push({
    time: state.currentTime,
    type: 'ability_cast',
    abilityId: entry.abilityId,
    abilityName: entry.ability.Name,
    damage: expectedDamage,
    damageType: entry.ability.DamageType,
    powerCost: cost,
    powerRestored: powerRestored > 0 ? powerRestored : undefined,
    label: `${entry.ability.Name} → ${Math.round(expectedDamage)} dmg`,
    enemyHealth: enemy?.currentHealth,
    enemyArmor: enemy?.currentArmor,
    enemyRage: enemy?.currentRage,
    resistedDamage: enemyResult.resistedDamage > 0 ? enemyResult.resistedDamage : undefined,
    armorDamage: enemyResult.armorDamage > 0 ? enemyResult.armorDamage : undefined,
    healthDamage: enemyResult.healthDamage > 0 ? enemyResult.healthDamage : undefined,
  });
}

// ── Song Casting ────────────────────────────────────

function castSong(state: CombatSimState, entry: RotationEntry, cost: number): void {
  const dr = entry.damageResult;

  // Extract per-tick damage from the song's DoT data.
  // Song DoTs have Duration=0 and NumTicks=1 in game data;
  // modifiedTotalDamage is the per-tick damage after mods.
  let damagePerTick = 0;
  let damageType = entry.ability.DamageType;
  for (const dot of dr.dots) {
    damagePerTick += dot.modifiedTotalDamage / Math.max(1, dot.numTicks);
    if (dot.damageType) damageType = dot.damageType;
  }

  // If a song is already active, log its expiry
  if (state.activeSong) {
    state.timeline.push({
      time: state.currentTime,
      type: 'song_expire',
      abilityId: state.activeSong.abilityId,
      damage: 0,
      label: `Song ended (replaced)`,
    });
  }

  // Activate the new song
  const songDuration = Math.min(SONG_DURATION, state.config.fightDuration - state.currentTime);
  const newSong: ActiveSong = {
    abilityId: entry.abilityId,
    damagePerTick,
    damageType,
    tickInterval: SONG_TICK_INTERVAL,
    nextTickAt: state.currentTime + SONG_TICK_INTERVAL,
    expiresAt: state.currentTime + songDuration,
  };
  state.activeSong = newSong;

  // Log song start event
  state.timeline.push({
    time: state.currentTime,
    type: 'song_start',
    abilityId: entry.abilityId,
    abilityName: entry.ability.Name,
    damage: 0,
    powerCost: cost,
    label: `${entry.ability.Name} started (${Math.round(damagePerTick)} dmg/tick)`,
  });
}

// ── Song Tick Processing ────────────────────────────

export function processSongTicks(state: CombatSimState): void {
  const song = state.activeSong;
  if (!song) return;

  while (song.nextTickAt <= state.currentTime + 0.0001 && song.nextTickAt <= song.expiresAt + 0.0001) {
    // Route through enemy damage pipeline (no armor interaction for song ticks)
    const songEnemyResult = applyDamageToEnemy(
      state, song.damagePerTick, song.damageType,
      undefined, 0, 0, false,
    );

    state.totalSongDamage += song.damagePerTick;

    // Attribute song damage to source ability
    const stats = state.abilityDamageMap.get(song.abilityId);
    if (stats) {
      stats.totalDotDamage += song.damagePerTick;
    }

    const songEnemy = state.enemyState;
    state.timeline.push({
      time: song.nextTickAt,
      type: 'song_tick',
      abilityId: song.abilityId,
      damage: song.damagePerTick,
      damageType: song.damageType,
      label: `Song tick: ${song.damageType} → ${Math.round(song.damagePerTick)} dmg`,
      enemyHealth: songEnemy?.currentHealth,
      enemyArmor: songEnemy?.currentArmor,
      resistedDamage: songEnemyResult.resistedDamage > 0 ? songEnemyResult.resistedDamage : undefined,
      healthDamage: songEnemyResult.healthDamage > 0 ? songEnemyResult.healthDamage : undefined,
    });

    // Apply rage for song tick damage
    applyRage(state, songEnemyResult.effectiveDamage, 0);

    song.nextTickAt += song.tickInterval;

    // Stop ticking if enemy died
    if (songEnemyResult.enemyDied) break;
  }

  // Check if song has expired
  if (state.currentTime >= song.expiresAt - 0.0001) {
    state.timeline.push({
      time: song.expiresAt,
      type: 'song_expire',
      abilityId: song.abilityId,
      damage: 0,
      label: `Song expired`,
    });
    state.activeSong = null;
  }
}

// ── DoT Processing ──────────────────────────────────

export function processDoTTicks(state: CombatSimState): void {
  const expired: number[] = [];

  for (let i = 0; i < state.activeDoTs.length; i++) {
    const dot = state.activeDoTs[i];

    while (dot.ticksRemaining > 0 && dot.nextTickAt <= state.currentTime + 0.0001) {
      // Route through enemy damage pipeline (no armor-specific/health-specific for DoTs)
      const dotEnemyResult = applyDamageToEnemy(
        state, dot.damagePerTick, dot.damageType,
        undefined, 0, 0, false,
      );

      state.totalDotDamage += dot.damagePerTick;

      // Attribute DoT damage to source ability
      const stats = state.abilityDamageMap.get(dot.sourceAbilityId);
      if (stats) {
        stats.totalDotDamage += dot.damagePerTick;
      }

      const dotEnemy = state.enemyState;
      state.timeline.push({
        time: dot.nextTickAt,
        type: 'dot_tick',
        abilityId: dot.sourceAbilityId,
        damage: dot.damagePerTick,
        damageType: dot.damageType,
        label: `DoT: ${dot.damageType} → ${Math.round(dot.damagePerTick)} dmg`,
        enemyHealth: dotEnemy?.currentHealth,
        enemyArmor: dotEnemy?.currentArmor,
        resistedDamage: dotEnemyResult.resistedDamage > 0 ? dotEnemyResult.resistedDamage : undefined,
        healthDamage: dotEnemyResult.healthDamage > 0 ? dotEnemyResult.healthDamage : undefined,
      });

      // Apply rage for DoT tick damage
      applyRage(state, dotEnemyResult.effectiveDamage, 0);

      dot.ticksRemaining -= 1;
      dot.nextTickAt += dot.tickInterval;

      // Stop ticking if enemy died
      if (dotEnemyResult.enemyDied) break;
    }

    if (dot.ticksRemaining <= 0) {
      expired.push(i);
    }
  }

  // Remove expired DoTs (reverse order to preserve indices)
  for (let i = expired.length - 1; i >= 0; i--) {
    state.activeDoTs.splice(expired[i], 1);
  }
}

// ── Power Regeneration ──────────────────────────────

export function applyPowerRegen(state: CombatSimState, elapsed: number): void {
  if (state.config.powerRegenPerSecond > 0 && elapsed > 0) {
    const regen = state.config.powerRegenPerSecond * elapsed;
    const before = state.currentPower;
    state.currentPower = Math.min(state.config.maxPower, state.currentPower + regen);
    const actual = state.currentPower - before;
    if (actual > 0) {
      state.totalPowerRestored += actual;
    }
  }
}
