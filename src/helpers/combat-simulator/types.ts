import type { Ability } from '../../schemas/abilities';
import type { DamageResult, GearSlot } from '../build-helpers';

// ── Ability Roles ───────────────────────────────────

/** Classification of what an ability provides */
export type AbilityRole = 'damage' | 'heal' | 'power_restore';

/** Configuration for need-based ability selection */
export interface NeedBasedConfig {
  /** Whether need-based priority is active */
  enabled: boolean;
  /** Health fraction below which heals are prioritized (0.0-1.0) */
  healthThreshold: number;
  /** Power fraction below which power restores are prioritized (0.0-1.0) */
  powerThreshold: number;
}

// ── Enemy Configuration ─────────────────────────────

/** Enemy target configuration */
export interface EnemyConfig {
  /** Max HP (0 = infinite / target dummy mode) */
  maxHealth: number;
  /** Max armor pool (0 = no armor) */
  maxArmor: number;
  /** Damage type → percentage reduction 0.0-1.0 */
  resistances: Map<string, number>;
  /** Rage gained per point of damage dealt (0 = no rage tracking) */
  ragePerDamage: number;
  /** Rage decay per second */
  rageDecayPerSecond: number;
  /** Rage threshold for "enraged" state (informational) */
  enrageThreshold: number;
  /** Number of targets (1 = single target, >1 = AoE scenario) */
  targetCount: number;
}

/** Mutable enemy state during simulation */
export interface EnemyState {
  currentHealth: number;
  currentArmor: number;
  currentRage: number;
  peakRage: number;
  totalDamageTaken: number;
  totalArmorDamage: number;
  totalHealthDamage: number;
  totalResisted: number;
  /** Timestamp when armor hit 0 (null = never) */
  armorDepletedAt: number | null;
  /** Timestamp when HP hit 0 (null = survived) */
  enemyDiedAt: number | null;
}

// ── Configuration ────────────────────────────────────

/** A single ability in the user's priority rotation */
export interface RotationEntry {
  /** Ability InternalName */
  abilityId: string;
  /** The full Ability object (for Keywords, SharesResetTimerWith, etc.) */
  ability: Ability;
  /** Pre-computed damage result from the build planner */
  damageResult: DamageResult;
  /** Priority rank (0 = highest priority) */
  priority: number;
}

/** Top-level config passed to simulateCombat() */
export interface CombatSimConfig {
  /** Ordered rotation (index 0 = highest priority) */
  rotation: RotationEntry[];
  /** Fight duration in seconds (default: 30) */
  fightDuration: number;
  /** Starting/max power pool */
  maxPower: number;
  /** Power regen per second (default: 0) */
  powerRegenPerSecond: number;
  /** Minimum time between casts in seconds (default: 0) */
  globalCooldown: number;
  /** Base crit chance 0.0-1.0 (default: 0) */
  baseCritChance: number;
  /** Starting/max health pool (0 = no health tracking) */
  maxHealth: number;
  /** Need-based ability selection config */
  needBasedPriority: NeedBasedConfig;
  /** Enemy target configuration (null = target dummy / no enemy tracking) */
  enemy: EnemyConfig | null;
}

// ── Simulation State ────────────────────────────────

/** An active DoT ticking on the target */
export interface ActiveDoT {
  /** Source ability InternalName */
  sourceAbilityId: string;
  /** Damage per tick (already modified) */
  damagePerTick: number;
  /** Damage type (e.g., "Poison", "Fire") */
  damageType: string;
  /** Seconds between ticks */
  tickInterval: number;
  /** Timestamp of next tick */
  nextTickAt: number;
  /** Timestamp when this DoT expires */
  expiresAt: number;
  /** Ticks remaining */
  ticksRemaining: number;
}

/** An active song being played (Bard) */
export interface ActiveSong {
  /** The ability InternalName */
  abilityId: string;
  /** Damage per tick (from DoT data, already modified) */
  damagePerTick: number;
  /** Damage type */
  damageType: string;
  /** Tick interval in seconds (usually 2s) */
  tickInterval: number;
  /** Timestamp of next tick */
  nextTickAt: number;
  /** Song expiry timestamp */
  expiresAt: number;
}

/** Mutable state that evolves during simulation */
export interface CombatSimState {
  config: CombatSimConfig;
  currentTime: number;

  /** Cooldown group key → timestamp when available */
  cooldownTimers: Map<string, number>;
  /** Timestamp of last cast (for GCD enforcement) */
  lastCastTime: number;

  currentPower: number;
  currentHealth: number;
  totalPowerSpent: number;
  totalPowerRestored: number;

  /** Pre-computed role classification per ability */
  abilityRoles: Map<string, Set<AbilityRole>>;

  activeDoTs: ActiveDoT[];
  activeSong: ActiveSong | null;

  /** Mutable enemy state (null when no enemy configured) */
  enemyState: EnemyState | null;

  timeline: TimelineEvent[];
  totalDirectDamage: number;
  totalDotDamage: number;
  totalSongDamage: number;
  totalCritDamage: number;
  totalAoeDamage: number;
  abilityCasts: Map<string, number>;
  abilityDamageMap: Map<string, MutableAbilityStats>;
}

/** Mutable per-ability accumulator used during simulation */
export interface MutableAbilityStats {
  abilityId: string;
  abilityName: string;
  casts: number;
  totalDirectDamage: number;
  totalDotDamage: number;
  totalCritBonusDamage: number;
  totalPowerSpent: number;
  totalPowerRestored: number;
  totalAoeDamage: number;
}

// ── Timeline Events ─────────────────────────────────

export type TimelineEventType =
  | 'ability_cast'
  | 'dot_tick'
  | 'song_tick'
  | 'song_start'
  | 'song_expire'
  | 'dot_apply'
  | 'dot_expire'
  | 'power_restore'
  | 'idle'
  | 'armor_depleted'
  | 'enemy_died';

export interface TimelineEvent {
  time: number;
  type: TimelineEventType;
  abilityId?: string;
  abilityName?: string;
  damage: number;
  damageType?: string;
  isCrit?: boolean;
  powerCost?: number;
  powerRestored?: number;
  /** Human-readable label */
  label: string;
  /** Enemy HP after this event */
  enemyHealth?: number;
  /** Enemy armor after this event */
  enemyArmor?: number;
  /** Enemy rage after this event */
  enemyRage?: number;
  /** Damage resisted by enemy */
  resistedDamage?: number;
  /** Damage dealt to armor */
  armorDamage?: number;
  /** Damage dealt to health */
  healthDamage?: number;
}

// ── Per-Ability Result ──────────────────────────────

export interface AbilitySimResult {
  abilityId: string;
  abilityName: string;
  casts: number;
  totalDirectDamage: number;
  totalDotDamage: number;
  totalCritBonusDamage: number;
  totalDamage: number;
  /** DPS contribution */
  dps: number;
  /** Percentage of total damage */
  damagePercent: number;
  totalPowerSpent: number;
  totalPowerRestored: number;
  /** Average damage per cast (direct + full DoT) */
  avgDamagePerCast: number;
  /** Total AoE bonus damage from this ability (secondary targets) */
  totalAoeDamage: number;
}

// ── Enemy Result ────────────────────────────────────

export interface EnemySimResult {
  maxHealth: number;
  maxArmor: number;
  healthRemaining: number;
  armorRemaining: number;
  /** Time when enemy died (null = survived) */
  timeToKill: number | null;
  /** Time when armor was depleted (null = never) */
  armorDepletedAt: number | null;
  totalDamageTaken: number;
  totalArmorDamage: number;
  totalHealthDamage: number;
  totalResisted: number;
  peakRage: number;
  finalRage: number;
  /** Whether enemy crossed the enrage threshold */
  wasEnraged: boolean;
}

// ── Final Result ────────────────────────────────────

export interface CombatSimResult {
  /** Configured fight duration */
  fightDuration: number;
  /** Actual simulated duration (may be less if OOM or enemy died) */
  actualDuration: number;
  /** Total damage across all sources */
  totalDamage: number;
  /** Overall DPS (totalDamage / actualDuration) */
  dps: number;
  /** Breakdown by category */
  totalDirectDamage: number;
  totalDotDamage: number;
  totalSongDamage: number;
  totalCritBonusDamage: number;
  /** Resource economy */
  totalPowerSpent: number;
  totalPowerRestored: number;
  netPowerPerSecond: number;
  /** Is the rotation power-sustainable for the fight duration? */
  isSustainable: boolean;
  /** Per-ability breakdown, sorted by total damage desc */
  abilities: AbilitySimResult[];
  /** Full event timeline */
  timeline: TimelineEvent[];
  /** Seconds spent idle (nothing to cast) */
  idleTime: number;
  /** Total ability casts */
  totalCasts: number;
  /** Enemy simulation results (null if no enemy configured) */
  enemyResult: EnemySimResult | null;
  /** Total AoE damage (across secondary targets) */
  totalAoeDamage: number;
  /** AoE-inclusive DPS (primary + secondary targets) */
  aoeDps: number;
}
