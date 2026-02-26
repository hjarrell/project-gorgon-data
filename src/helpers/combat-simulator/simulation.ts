import type {
  CombatSimConfig,
  CombatSimState,
  CombatSimResult,
  AbilityRole,
  EnemyState,
  EnemySimResult,
  AbilitySimResult,
  MutableAbilityStats,
} from './types';
import { classifyAbilityRoles, getCooldownGroup, findBestAvailableAbility } from './ability-selection';
import { castAbility, processDoTTicks, processSongTicks, applyPowerRegen } from './ability-casting';
import { applyRageDecay } from './enemy';

// ── Initialization ──────────────────────────────────

export function initCombatSim(config: CombatSimConfig): CombatSimState {
  const abilityDamageMap = new Map<string, MutableAbilityStats>();
  for (const entry of config.rotation) {
    abilityDamageMap.set(entry.abilityId, {
      abilityId: entry.abilityId,
      abilityName: entry.ability.Name,
      casts: 0,
      totalDirectDamage: 0,
      totalDotDamage: 0,
      totalCritBonusDamage: 0,
      totalPowerSpent: 0,
      totalPowerRestored: 0,
      totalAoeDamage: 0,
    });
  }

  // Pre-compute ability role classifications
  const abilityRoles = new Map<string, Set<AbilityRole>>();
  for (const entry of config.rotation) {
    abilityRoles.set(entry.abilityId, classifyAbilityRoles(entry));
  }

  // Initialize enemy state if configured
  let enemyState: EnemyState | null = null;
  if (config.enemy) {
    enemyState = {
      currentHealth: config.enemy.maxHealth,
      currentArmor: config.enemy.maxArmor,
      currentRage: 0,
      peakRage: 0,
      totalDamageTaken: 0,
      totalArmorDamage: 0,
      totalHealthDamage: 0,
      totalResisted: 0,
      armorDepletedAt: null,
      enemyDiedAt: null,
    };
  }

  return {
    config,
    currentTime: 0,
    cooldownTimers: new Map(),
    lastCastTime: -Infinity,
    currentPower: config.maxPower,
    currentHealth: config.maxHealth,
    totalPowerSpent: 0,
    totalPowerRestored: 0,
    abilityRoles,
    activeDoTs: [],
    activeSong: null,
    enemyState,
    timeline: [],
    totalDirectDamage: 0,
    totalDotDamage: 0,
    totalSongDamage: 0,
    totalCritDamage: 0,
    totalAoeDamage: 0,
    abilityCasts: new Map(),
    abilityDamageMap,
  };
}

// ── Next Event Time ─────────────────────────────────

function findNextEventTime(state: CombatSimState): number {
  const candidates: number[] = [];

  // Next ability off cooldown
  for (const entry of state.config.rotation) {
    const group = getCooldownGroup(entry.ability);
    const availableAt = state.cooldownTimers.get(group) ?? 0;
    if (availableAt > state.currentTime) {
      candidates.push(availableAt);
    }
  }

  // GCD
  if (state.config.globalCooldown > 0) {
    const gcdReady = state.lastCastTime + state.config.globalCooldown;
    if (gcdReady > state.currentTime) {
      candidates.push(gcdReady);
    }
  }

  // Next DoT tick
  for (const dot of state.activeDoTs) {
    if (dot.ticksRemaining > 0) {
      candidates.push(dot.nextTickAt);
    }
  }

  // Song tick
  if (state.activeSong && state.activeSong.nextTickAt <= state.config.fightDuration) {
    candidates.push(state.activeSong.nextTickAt);
  }

  if (candidates.length === 0) return state.config.fightDuration;
  return Math.min(...candidates);
}

// ── Build Result ────────────────────────────────────

function buildCombatResult(state: CombatSimState): CombatSimResult {
  // If enemy died, actual duration is the kill time
  const enemyDiedAt = state.enemyState?.enemyDiedAt;
  const actualDuration = Math.max(0.001, enemyDiedAt ?? state.currentTime);
  const totalDamage = state.totalDirectDamage + state.totalDotDamage + state.totalSongDamage;
  const dps = totalDamage / actualDuration;

  // Calculate idle time from timeline events
  let idleTime = 0;
  for (const event of state.timeline) {
    if (event.type === 'idle') {
      idleTime += event.damage; // We store idle duration in the damage field
    }
  }

  // Build per-ability results
  const abilities: AbilitySimResult[] = [];
  for (const stats of state.abilityDamageMap.values()) {
    const totalAbilityDamage = stats.totalDirectDamage + stats.totalDotDamage;
    abilities.push({
      abilityId: stats.abilityId,
      abilityName: stats.abilityName,
      casts: stats.casts,
      totalDirectDamage: stats.totalDirectDamage,
      totalDotDamage: stats.totalDotDamage,
      totalCritBonusDamage: stats.totalCritBonusDamage,
      totalDamage: totalAbilityDamage,
      dps: totalAbilityDamage / actualDuration,
      damagePercent: totalDamage > 0 ? (totalAbilityDamage / totalDamage) * 100 : 0,
      totalPowerSpent: stats.totalPowerSpent,
      totalPowerRestored: stats.totalPowerRestored,
      avgDamagePerCast: stats.casts > 0 ? totalAbilityDamage / stats.casts : 0,
      totalAoeDamage: stats.totalAoeDamage,
    });
  }

  // Sort by total damage descending
  abilities.sort((a, b) => b.totalDamage - a.totalDamage);

  // Check sustainability: did power ever hit 0 before fight ended?
  const isSustainable = state.currentPower > 0 || actualDuration >= state.config.fightDuration;

  const totalCasts = abilities.reduce((sum, a) => sum + a.casts, 0);
  const netPower = state.totalPowerRestored - state.totalPowerSpent;
  const netPowerPerSecond = actualDuration > 0 ? netPower / actualDuration : 0;

  // Build enemy result
  let enemyResult: EnemySimResult | null = null;
  if (state.enemyState && state.config.enemy) {
    const es = state.enemyState;
    const ec = state.config.enemy;
    enemyResult = {
      maxHealth: ec.maxHealth,
      maxArmor: ec.maxArmor,
      healthRemaining: es.currentHealth,
      armorRemaining: es.currentArmor,
      timeToKill: es.enemyDiedAt,
      armorDepletedAt: es.armorDepletedAt,
      totalDamageTaken: es.totalDamageTaken,
      totalArmorDamage: es.totalArmorDamage,
      totalHealthDamage: es.totalHealthDamage,
      totalResisted: es.totalResisted,
      peakRage: es.peakRage,
      finalRage: es.currentRage,
      wasEnraged: es.peakRage >= ec.enrageThreshold,
    };
  }

  // AoE DPS (primary + secondary targets)
  const totalAoeDamage = state.totalAoeDamage;
  const aoeDps = (totalDamage + totalAoeDamage) / actualDuration;

  return {
    fightDuration: state.config.fightDuration,
    actualDuration,
    totalDamage,
    dps,
    totalDirectDamage: state.totalDirectDamage,
    totalDotDamage: state.totalDotDamage,
    totalSongDamage: state.totalSongDamage,
    totalCritBonusDamage: state.totalCritDamage,
    totalPowerSpent: state.totalPowerSpent,
    totalPowerRestored: state.totalPowerRestored,
    netPowerPerSecond,
    isSustainable,
    abilities,
    timeline: state.timeline,
    idleTime,
    totalCasts,
    enemyResult,
    totalAoeDamage,
    aoeDps,
  };
}

// ── Main Entry Point ────────────────────────────────

/**
 * Run a combat simulation using a priority-based ability rotation.
 *
 * The simulator uses a discrete event loop — it advances to the next
 * meaningful event (ability off cooldown, DoT tick, fight end) rather
 * than ticking every millisecond.
 */
export function simulateCombat(config: CombatSimConfig): CombatSimResult {
  if (config.rotation.length === 0 || config.fightDuration <= 0) {
    return {
      fightDuration: config.fightDuration,
      actualDuration: 0,
      totalDamage: 0,
      dps: 0,
      totalDirectDamage: 0,
      totalDotDamage: 0,
      totalSongDamage: 0,
      totalCritBonusDamage: 0,
      totalPowerSpent: 0,
      totalPowerRestored: 0,
      netPowerPerSecond: 0,
      isSustainable: true,
      abilities: [],
      timeline: [],
      idleTime: 0,
      totalCasts: 0,
      enemyResult: null,
      totalAoeDamage: 0,
      aoeDps: 0,
    };
  }

  const state = initCombatSim(config);
  let iterations = 0;
  const maxIterations = 10000; // Safety valve

  while (state.currentTime < config.fightDuration && iterations < maxIterations) {
    iterations++;

    // 0. Check if enemy died — end fight early
    if (state.enemyState?.enemyDiedAt != null) break;

    // 1. Process any DoT and song ticks due at currentTime
    processDoTTicks(state);
    processSongTicks(state);

    // Check again after ticks (DoT/song could kill)
    if (state.enemyState?.enemyDiedAt != null) break;

    // 2. Cast all available abilities at the current time step.
    //    Multiple abilities can fire at the same instant when there's no GCD.
    //    Track which abilities have been cast this step to prevent re-casting
    //    the same ability twice at the same instant (relevant for 0-CD abilities).
    const castThisStep = new Set<string>();
    let anyCast = false;
    let candidate = findBestAvailableAbility(state, castThisStep);
    while (candidate && iterations < maxIterations) {
      castAbility(state, candidate);
      castThisStep.add(candidate.abilityId);
      anyCast = true;
      iterations++;
      candidate = findBestAvailableAbility(state, castThisStep);
    }

    // 3. Find next event time
    const nextTime = findNextEventTime(state);

    if (nextTime <= state.currentTime) {
      // No future events and nothing to cast — we're idle until fight ends
      const idleDuration = config.fightDuration - state.currentTime;
      if (idleDuration > 0) {
        state.timeline.push({
          time: state.currentTime,
          type: 'idle',
          damage: idleDuration, // Store duration in damage field for simplicity
          label: `Idle for ${idleDuration.toFixed(1)}s`,
        });
        applyPowerRegen(state, idleDuration);
        applyRageDecay(state, idleDuration);
      }
      state.currentTime = config.fightDuration;
      break;
    }

    // 4. If we didn't cast anything, log idle time until next event
    if (!anyCast && nextTime > state.currentTime) {
      const idleDuration = nextTime - state.currentTime;
      state.timeline.push({
        time: state.currentTime,
        type: 'idle',
        damage: idleDuration,
        label: `Idle for ${idleDuration.toFixed(1)}s`,
      });
    }

    // 5. Apply power regen and rage decay for elapsed time
    const elapsed = Math.min(nextTime, config.fightDuration) - state.currentTime;
    applyPowerRegen(state, elapsed);
    applyRageDecay(state, elapsed);

    // 6. Advance time
    state.currentTime = Math.min(nextTime, config.fightDuration);
  }

  // Process any remaining DoT and song ticks at fight end (unless enemy died)
  if (state.enemyState?.enemyDiedAt == null) {
    state.currentTime = config.fightDuration;
    processDoTTicks(state);
    processSongTicks(state);
  }

  return buildCombatResult(state);
}
