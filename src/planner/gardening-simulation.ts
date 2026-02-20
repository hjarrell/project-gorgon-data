import type { CharacterState } from '../character-state';
import type { Skill } from '../schemas/skills';
import type {
  GardeningSeedEntry,
  GardenAction,
  GardenActionType,
  GardeningTimingConfig,
  GardeningPlannerOptions,
  SlotGroup,
} from './gardening-types';
import type { IngredientUsage } from './crafting-planner';
import { getXpRequiredForLevel } from './xp';
import {
  DEFAULT_SLOT_GROUPS,
  getAvailableSeeds,
  getSeedSlotGroup,
  WATER_BOTTLE_ITEM_CODE,
  FERTILIZER_BOTTLE_ITEM_CODE,
} from './gardening-data';

// ============================================================
// Internal Types
// ============================================================

type SlotPhase = 'empty' | 'planted' | 'watered' | 'fertilized';

interface SlotState {
  id: string;
  group: SlotGroup;
  seed: GardeningSeedEntry | null;
  phase: SlotPhase;
  fertilizerApplied: number;
  plantedAt: number;
}

interface PendingEvent {
  timestamp: number;
  type: GardenActionType;
  slotId: string | null;
  /** Lower = higher priority at same timestamp: harvest=0, water=1, fertilize=2, plant=3, refill=4 */
  priority: number;
}

// ============================================================
// Simulation State
// ============================================================

export interface GardeningSimulationState {
  // Config
  timing: GardeningTimingConfig;
  options: GardeningPlannerOptions;
  xpTableName: string;
  xpTableLookup: Map<string, number[]>;
  slotGroups: SlotGroup[];

  // Clock & Level
  currentTime: number;
  currentLevel: number;
  currentXp: number;
  xpNeeded: number;
  startLevel: number;

  // Slots
  slots: Map<string, SlotState>;

  // Event queue (maintained sorted)
  eventQueue: PendingEvent[];

  // Seed cache (refreshed on level up)
  availableSeeds: GardeningSeedEntry[];
  /** Best seed per slot group, cached */
  bestSeedPerGroup: Map<string, GardeningSeedEntry | null>;

  // Water
  waterBottlesAvailable: number;

  // Accumulators
  actions: GardenAction[];
  totalXpGained: number;
  seedsUsed: Map<number, number>;
  fertilizerUsed: number;
  waterUsed: number;
  waterRefills: number;
  produceHarvested: Map<number, number>;
  ingredientTotals: Map<number, IngredientUsage>;
}

// ============================================================
// Priority Queue Helpers
// ============================================================

function enqueueEvent(state: GardeningSimulationState, event: PendingEvent): void {
  const q = state.eventQueue;
  // Binary search for insertion point (sorted by timestamp asc, then priority asc)
  let lo = 0;
  let hi = q.length;
  while (lo < hi) {
    const mid = (lo + hi) >>> 1;
    const m = q[mid];
    if (m.timestamp < event.timestamp || (m.timestamp === event.timestamp && m.priority <= event.priority)) {
      lo = mid + 1;
    } else {
      hi = mid;
    }
  }
  q.splice(lo, 0, event);
}

function dequeueEvent(state: GardeningSimulationState): PendingEvent | undefined {
  return state.eventQueue.shift();
}

// ============================================================
// Seed Scoring & Selection
// ============================================================

function scoreSeed(seed: GardeningSeedEntry, strategy: 'xp' | 'time'): number {
  if (seed.gardeningXp == null || seed.growTimeSeconds == null || seed.growTimeSeconds === 0) {
    return -1;
  }
  if (strategy === 'xp') {
    // Best XP per second of grow time
    return seed.gardeningXp / seed.growTimeSeconds;
  }
  // 'time': prefer highest absolute XP to minimize total cycles
  return seed.gardeningXp;
}

function refreshBestSeeds(state: GardeningSimulationState): void {
  state.availableSeeds = getAvailableSeeds(
    state.currentLevel,
    state.options.includedSeeds,
    state.options.excludedSeeds,
  );
  state.bestSeedPerGroup.clear();

  for (const group of state.slotGroups) {
    let bestSeed: GardeningSeedEntry | null = null;
    let bestScore = -1;

    for (const seed of state.availableSeeds) {
      if (!group.seedItemCodes.includes(seed.seedItemCode)) continue;
      const score = scoreSeed(seed, state.options.strategy);
      if (score > bestScore) {
        bestScore = score;
        bestSeed = seed;
      }
    }
    state.bestSeedPerGroup.set(group.name, bestSeed);
  }
}

// ============================================================
// Ingredient Tracking
// ============================================================

function trackIngredient(state: GardeningSimulationState, itemCode: number, count: number, recipeName: string): void {
  const existing = state.ingredientTotals.get(itemCode);
  if (existing) {
    existing.totalCount += count;
    existing.timesUsed += 1;
    existing.usedByRecipes.add(recipeName);
    existing.recipeCount = existing.usedByRecipes.size;
  } else {
    state.ingredientTotals.set(itemCode, {
      totalCount: count,
      timesUsed: 1,
      chanceToConsume: 1.0,
      recipeCount: 1,
      usedByRecipes: new Set([recipeName]),
    });
  }
}

// ============================================================
// XP & Level Handling
// ============================================================

function applyXp(state: GardeningSimulationState, xp: number): number {
  const levelBefore = state.currentLevel;
  state.currentXp += xp;
  state.totalXpGained += xp;

  // Handle cascading level-ups
  while (state.xpNeeded > 0 && state.currentXp >= state.xpNeeded) {
    state.currentXp -= state.xpNeeded;
    state.currentLevel++;
    state.xpNeeded = getXpRequiredForLevel(state.xpTableName, state.currentLevel, state.xpTableLookup);
  }

  if (state.currentLevel > levelBefore) {
    refreshBestSeeds(state);
  }

  return state.currentLevel;
}

// ============================================================
// Init
// ============================================================

export function initGardeningSimulation(
  characterState: CharacterState,
  options: GardeningPlannerOptions,
  allSkills: Map<string, Skill>,
  xpTableLookup: Map<string, number[]>,
): GardeningSimulationState {
  const skill = allSkills.get('Gardening');
  if (!skill) throw new Error('Gardening skill not found in skill data');

  const xpTableName = skill.XpTable;
  const charSkill = characterState.skills.get('Gardening');
  const startLevel = charSkill?.Level ?? 0;
  const startXp = charSkill?.XpTowardNextLevel ?? 0;
  const xpNeeded = getXpRequiredForLevel(xpTableName, startLevel, xpTableLookup);

  const state: GardeningSimulationState = {
    timing: options.timing,
    options,
    xpTableName,
    xpTableLookup,
    slotGroups: DEFAULT_SLOT_GROUPS,
    currentTime: 0,
    currentLevel: startLevel,
    currentXp: startXp,
    xpNeeded,
    startLevel,
    slots: new Map(),
    eventQueue: [],
    availableSeeds: [],
    bestSeedPerGroup: new Map(),
    waterBottlesAvailable: options.timing.waterBottleCount,
    actions: [],
    totalXpGained: 0,
    seedsUsed: new Map(),
    fertilizerUsed: 0,
    waterUsed: 0,
    waterRefills: 0,
    produceHarvested: new Map(),
    ingredientTotals: new Map(),
  };

  // Build slots from groups
  for (const group of state.slotGroups) {
    for (let i = 0; i < group.maxSlots; i++) {
      const id = `${group.name}-${i}`;
      state.slots.set(id, {
        id,
        group,
        seed: null,
        phase: 'empty',
        fertilizerApplied: 0,
        plantedAt: 0,
      });
    }
  }

  // Figure out best seeds per group
  refreshBestSeeds(state);

  // Schedule initial planting for all slots
  let plantTime = 0;
  for (const [slotId, slot] of state.slots) {
    const bestSeed = state.bestSeedPerGroup.get(slot.group.name);
    if (bestSeed) {
      enqueueEvent(state, { timestamp: plantTime, type: 'plant', slotId, priority: 3 });
      plantTime += state.timing.wiggleTimeSeconds;
    }
  }

  return state;
}

// ============================================================
// Step
// ============================================================

export function stepGardeningSimulation(state: GardeningSimulationState): GardenAction | null {
  const event = dequeueEvent(state);
  if (!event) return null;

  state.currentTime = event.timestamp;
  const levelBefore = state.currentLevel;

  switch (event.type) {
    case 'plant':
      return handlePlant(state, event, levelBefore);
    case 'water':
      return handleWater(state, event, levelBefore);
    case 'fertilize':
      return handleFertilize(state, event, levelBefore);
    case 'harvest':
      return handleHarvest(state, event, levelBefore);
    case 'refill':
      return handleRefill(state, event, levelBefore);
    default:
      return null;
  }
}

function handlePlant(state: GardeningSimulationState, event: PendingEvent, levelBefore: number): GardenAction {
  const slot = state.slots.get(event.slotId!)!;
  const seed = state.bestSeedPerGroup.get(slot.group.name);

  if (!seed) {
    // No seed available for this slot, skip
    return makeAction(event, null, 0, levelBefore, state.currentLevel);
  }

  slot.seed = seed;
  slot.phase = 'planted';
  slot.fertilizerApplied = 0;
  slot.plantedAt = state.currentTime;

  // Track seed usage
  state.seedsUsed.set(seed.seedItemCode, (state.seedsUsed.get(seed.seedItemCode) ?? 0) + 1);
  trackIngredient(state, seed.seedItemCode, 1, 'Gardening: ' + seed.seedName);

  // Schedule water event
  const waterTime = state.currentTime + state.timing.wiggleTimeSeconds + state.timing.waterDelaySeconds;
  enqueueEvent(state, { timestamp: waterTime, type: 'water', slotId: event.slotId, priority: 1 });

  return makeAction(event, seed.seedItemCode, 0, levelBefore, state.currentLevel);
}

function handleWater(state: GardeningSimulationState, event: PendingEvent, levelBefore: number): GardenAction {
  const slot = state.slots.get(event.slotId!)!;
  if (!slot.seed) return makeAction(event, null, 0, levelBefore, state.currentLevel);

  // Check water availability
  if (state.waterBottlesAvailable <= 0) {
    // Need to refill first - schedule refill, then re-queue this water event
    const refillTime = state.currentTime + state.timing.waterRefillTimeSeconds;
    enqueueEvent(state, { timestamp: refillTime, type: 'refill', slotId: null, priority: 4 });
    // Re-queue the water event after refill
    enqueueEvent(state, { timestamp: refillTime + state.timing.wiggleTimeSeconds, type: 'water', slotId: event.slotId, priority: 1 });
    // Return a refill action instead
    return makeAction({ ...event, type: 'refill' }, null, 0, levelBefore, state.currentLevel);
  }

  state.waterBottlesAvailable--;
  state.waterUsed++;
  trackIngredient(state, WATER_BOTTLE_ITEM_CODE, 1, 'Gardening: Water');
  slot.phase = 'watered';

  if (slot.seed.fertilizer > 0 && slot.fertilizerApplied < slot.seed.fertilizer) {
    // Needs fertilizer next
    const fertTime = state.currentTime + state.timing.wiggleTimeSeconds + state.timing.fertilizerDelaySeconds;
    enqueueEvent(state, { timestamp: fertTime, type: 'fertilize', slotId: event.slotId, priority: 2 });
  } else {
    // No fertilizer needed, schedule harvest at grow completion
    scheduleHarvest(state, slot);
  }

  return makeAction(event, slot.seed.seedItemCode, 0, levelBefore, state.currentLevel);
}

function handleFertilize(state: GardeningSimulationState, event: PendingEvent, levelBefore: number): GardenAction {
  const slot = state.slots.get(event.slotId!)!;
  if (!slot.seed) return makeAction(event, null, 0, levelBefore, state.currentLevel);

  state.fertilizerUsed++;
  slot.fertilizerApplied++;
  trackIngredient(state, FERTILIZER_BOTTLE_ITEM_CODE, 1, 'Gardening: Fertilizer');
  slot.phase = 'fertilized';

  if (slot.fertilizerApplied < slot.seed.fertilizer) {
    // Need more water+fertilizer cycles
    const waterTime = state.currentTime + state.timing.wiggleTimeSeconds + state.timing.waterDelaySeconds;
    enqueueEvent(state, { timestamp: waterTime, type: 'water', slotId: event.slotId, priority: 1 });
  } else {
    // All fertilizer done, schedule harvest
    scheduleHarvest(state, slot);
  }

  return makeAction(event, slot.seed.seedItemCode, 0, levelBefore, state.currentLevel);
}

function handleHarvest(state: GardeningSimulationState, event: PendingEvent, levelBefore: number): GardenAction {
  const slot = state.slots.get(event.slotId!)!;
  if (!slot.seed) return makeAction(event, null, 0, levelBefore, state.currentLevel);

  const seed = slot.seed;
  const xp = seed.gardeningXp ?? 0;
  const levelAfter = applyXp(state, xp);

  // Track produce
  state.produceHarvested.set(
    seed.resultItemCode,
    (state.produceHarvested.get(seed.resultItemCode) ?? 0) + seed.resultYield,
  );

  // Clear slot
  slot.seed = null;
  slot.phase = 'empty';
  slot.fertilizerApplied = 0;

  // Schedule replant if not done
  if (!isGardeningSimulationDone(state)) {
    const replantTime = state.currentTime + state.timing.wiggleTimeSeconds;
    enqueueEvent(state, { timestamp: replantTime, type: 'plant', slotId: event.slotId, priority: 3 });
  }

  return makeAction(event, seed.seedItemCode, xp, levelBefore, levelAfter);
}

function handleRefill(state: GardeningSimulationState, event: PendingEvent, levelBefore: number): GardenAction {
  state.waterBottlesAvailable = state.timing.waterBottleCount;
  state.waterRefills++;
  return makeAction(event, null, 0, levelBefore, state.currentLevel);
}

function scheduleHarvest(state: GardeningSimulationState, slot: SlotState): void {
  if (!slot.seed || slot.seed.growTimeSeconds == null) return;
  const harvestTime = slot.plantedAt + slot.seed.growTimeSeconds;
  // Harvest can't happen before current time
  const effectiveTime = Math.max(harvestTime, state.currentTime + state.timing.wiggleTimeSeconds);
  enqueueEvent(state, { timestamp: effectiveTime, type: 'harvest', slotId: slot.id, priority: 0 });
}

function makeAction(
  event: PendingEvent,
  seedItemCode: number | null,
  xp: number,
  levelBefore: number,
  levelAfter: number,
): GardenAction {
  return {
    timestamp: event.timestamp,
    type: event.type,
    slotId: event.slotId,
    seedItemCode,
    xpGained: xp,
    skillLevelBefore: levelBefore,
    skillLevelAfter: levelAfter,
  };
}

// ============================================================
// Done Check
// ============================================================

export function isGardeningSimulationDone(state: GardeningSimulationState): boolean {
  if (state.currentLevel >= state.options.targetLevel) return true;
  if (state.actions.length >= (state.options.maxActions ?? 100000)) return true;
  if (state.currentTime >= (state.options.maxSimulatedTime ?? 172800)) return true;
  if (state.eventQueue.length === 0) return true;
  return false;
}
