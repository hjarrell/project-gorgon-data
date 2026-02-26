import type { Ability } from '../../schemas/abilities';
import type {
  CombatSimState,
  RotationEntry,
  AbilityRole,
} from './types';

// ── Song Detection ──────────────────────────────────

export function isBardSong(ability: Ability): boolean {
  return ability.Keywords?.includes('BardSong') ?? false;
}

// ── Cooldown Groups ─────────────────────────────────

/**
 * Get the cooldown group key for an ability.
 * Abilities that share a reset timer use the same group key.
 */
export function getCooldownGroup(ability: Ability): string {
  return ability.SharesResetTimerWith ?? ability.InternalName;
}

// ── Ability Classification ──────────────────────────

export function classifyAbilityRoles(entry: RotationEntry): Set<AbilityRole> {
  const roles = new Set<AbilityRole>();
  const dr = entry.damageResult;

  if (dr.modifiedDamage > 0 || dr.dots.length > 0 || isBardSong(entry.ability)) {
    roles.add('damage');
  }

  const healthRestore = dr.restores
    .filter((r) => r.resourceType === 'Health')
    .reduce((sum, r) => sum + r.value, 0);
  if (healthRestore > 0) {
    roles.add('heal');
  }

  // Only classify as power_restore if net-positive (restore > cost)
  const powerRestore = dr.restores
    .filter((r) => r.resourceType === 'Power')
    .reduce((sum, r) => sum + r.value, 0);
  const powerCost = Math.max(0, dr.powerCost.modified);
  if (powerRestore > powerCost) {
    roles.add('power_restore');
  }

  if (roles.size === 0) {
    roles.add('damage');
  }

  return roles;
}

// ── Need Determination ─────────────────────────────

type CurrentNeed = 'heal' | 'power_restore' | 'damage';

function determineCurrentNeed(state: CombatSimState): CurrentNeed {
  const nbc = state.config.needBasedPriority;
  if (!nbc.enabled) return 'damage';

  // Health check first (higher priority than power)
  if (state.config.maxHealth > 0) {
    const healthFraction = state.currentHealth / state.config.maxHealth;
    if (healthFraction <= nbc.healthThreshold) return 'heal';
  }

  // Power check
  if (state.config.maxPower > 0) {
    const powerFraction = state.currentPower / state.config.maxPower;
    if (powerFraction <= nbc.powerThreshold) return 'power_restore';
  }

  return 'damage';
}

// ── Ability Selection ───────────────────────────────

/**
 * Find the highest-priority available ability, filtered by role when need-based
 * priority is enabled. Falls back to any available ability if the preferred
 * role has no candidates.
 */
export function findBestAvailableAbility(
  state: CombatSimState,
  exclude?: Set<string>,
): RotationEntry | null {
  const need = determineCurrentNeed(state);

  // If need-based is enabled and we have a non-damage need, try preferred role first
  if (state.config.needBasedPriority.enabled && need !== 'damage') {
    const preferred = findAvailableAbilityWithRole(state, need, exclude);
    if (preferred) return preferred;
  }

  // Fall back to any available ability (original behavior)
  return findAvailableAbilityWithRole(state, null, exclude);
}

/**
 * Find the highest-priority available ability, optionally filtered to a specific role.
 * When role is null, any ability is accepted (original behavior).
 */
function findAvailableAbilityWithRole(
  state: CombatSimState,
  role: AbilityRole | null,
  exclude?: Set<string>,
): RotationEntry | null {
  for (const entry of state.config.rotation) {
    if (exclude?.has(entry.abilityId)) continue;

    // Role filter
    if (role !== null) {
      const roles = state.abilityRoles.get(entry.abilityId);
      if (!roles?.has(role)) continue;
    }

    // Skip songs that are already active (don't re-cast the same song)
    if (isBardSong(entry.ability) && state.activeSong?.abilityId === entry.abilityId) {
      continue;
    }

    const group = getCooldownGroup(entry.ability);
    const availableAt = state.cooldownTimers.get(group) ?? 0;
    if (availableAt > state.currentTime) continue;

    // Check GCD
    if (state.config.globalCooldown > 0) {
      const gcdReady = state.lastCastTime + state.config.globalCooldown;
      if (gcdReady > state.currentTime) continue;
    }

    // Check power cost
    const cost = Math.max(0, entry.damageResult.powerCost.modified);
    if (cost > state.currentPower) continue;

    return entry;
  }
  return null;
}
