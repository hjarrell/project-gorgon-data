import type {
  CombatSimState,
  EnemyState,
} from './types';

// ── Enemy Damage Pipeline ───────────────────────────

export interface DamageToEnemyResult {
  effectiveDamage: number;
  resistedDamage: number;
  armorDamage: number;
  healthDamage: number;
  enemyDied: boolean;
  aoeBonusDamage: number;
}

/** Check if armor just hit zero and emit a timeline event. */
function checkArmorDepletion(state: CombatSimState, enemy: EnemyState): void {
  if (enemy.currentArmor <= 0 && enemy.armorDepletedAt == null) {
    enemy.armorDepletedAt = state.currentTime;
    state.timeline.push({
      time: state.currentTime,
      type: 'armor_depleted',
      damage: 0,
      label: 'Enemy armor depleted',
      enemyHealth: enemy.currentHealth,
      enemyArmor: 0,
    });
  }
}

/**
 * Route damage through the enemy pipeline: resistance → armor split → health depletion → AoE.
 * When no enemy is configured, returns raw damage unchanged.
 */
export function applyDamageToEnemy(
  state: CombatSimState,
  rawDamage: number,
  damageType: string | undefined,
  armorMitRatio: number | undefined,
  armorSpecDmg: number,
  healthSpecDmg: number,
  isAoe: boolean,
): DamageToEnemyResult {
  const enemy = state.enemyState;
  if (!enemy || enemy.enemyDiedAt != null) {
    return {
      effectiveDamage: rawDamage,
      resistedDamage: 0,
      armorDamage: 0,
      healthDamage: rawDamage,
      enemyDied: false,
      aoeBonusDamage: 0,
    };
  }

  const enemyConfig = state.config.enemy!;

  // 1. Apply resistance
  const resistance = damageType ? (enemyConfig.resistances.get(damageType) ?? 0) : 0;
  const resisted = rawDamage * resistance;
  const afterResist = rawDamage - resisted;
  enemy.totalResisted += resisted;

  // 2. Split via armor ratio: R/(R+1) to armor, 1/(R+1) to health
  let armorDmg = 0;
  let healthDmg = 0;

  if (armorMitRatio != null && armorMitRatio > 0 && enemy.currentArmor > 0) {
    const armorPortion = afterResist * (armorMitRatio / (armorMitRatio + 1));
    const healthPortion = afterResist - armorPortion;

    const actualArmorDmg = Math.min(armorPortion, enemy.currentArmor);
    const armorOverflow = armorPortion - actualArmorDmg;

    armorDmg = actualArmorDmg;
    healthDmg = healthPortion + armorOverflow;
    enemy.currentArmor -= actualArmorDmg;

    checkArmorDepletion(state, enemy);
  } else {
    healthDmg = afterResist;
  }

  // 3. ArmorSpecificDamage — extra damage to armor only
  if (armorSpecDmg > 0 && enemy.currentArmor > 0) {
    const actualArmorSpec = Math.min(armorSpecDmg, enemy.currentArmor);
    armorDmg += actualArmorSpec;
    enemy.currentArmor -= actualArmorSpec;

    checkArmorDepletion(state, enemy);
  }

  // 4. HealthSpecificDamage — extra damage to health only
  healthDmg += healthSpecDmg;

  // 5. Apply health damage
  const infiniteHealth = enemyConfig.maxHealth === 0;
  if (!infiniteHealth) {
    enemy.currentHealth = Math.max(0, enemy.currentHealth - healthDmg);
  }

  // 6. Track totals
  const effectiveDamage = afterResist + armorSpecDmg + healthSpecDmg;
  enemy.totalDamageTaken += effectiveDamage;
  enemy.totalArmorDamage += armorDmg;
  enemy.totalHealthDamage += healthDmg;

  // 7. Check enemy death
  let enemyDied = false;
  if (!infiniteHealth && enemy.currentHealth <= 0 && enemy.enemyDiedAt == null) {
    enemy.enemyDiedAt = state.currentTime;
    enemyDied = true;
    state.timeline.push({
      time: state.currentTime,
      type: 'enemy_died',
      damage: 0,
      label: 'Enemy killed',
      enemyHealth: 0,
      enemyArmor: enemy.currentArmor,
    });
  }

  // 8. AoE bonus damage (secondary targets)
  let aoeBonusDamage = 0;
  if (isAoe && enemyConfig.targetCount > 1) {
    aoeBonusDamage = effectiveDamage * (enemyConfig.targetCount - 1);
  }

  return { effectiveDamage, resistedDamage: resisted, armorDamage: armorDmg, healthDamage: healthDmg, enemyDied, aoeBonusDamage };
}

/** Add rage to enemy proportional to damage dealt, plus ability RageBoost. */
export function applyRage(state: CombatSimState, damageDealt: number, rageBoost: number): void {
  const enemy = state.enemyState;
  if (!enemy || !state.config.enemy || state.config.enemy.ragePerDamage <= 0) return;

  const rageGain = damageDealt * state.config.enemy.ragePerDamage + rageBoost;
  enemy.currentRage = Math.max(0, enemy.currentRage + rageGain);
  enemy.peakRage = Math.max(enemy.peakRage, enemy.currentRage);
}

/** Decay enemy rage over elapsed time. */
export function applyRageDecay(state: CombatSimState, elapsed: number): void {
  const enemy = state.enemyState;
  if (!enemy || !state.config.enemy || state.config.enemy.rageDecayPerSecond <= 0 || elapsed <= 0) return;

  const decay = state.config.enemy.rageDecayPerSecond * elapsed;
  enemy.currentRage = Math.max(0, enemy.currentRage - decay);
}
