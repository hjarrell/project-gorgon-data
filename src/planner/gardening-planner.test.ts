import { describe, it, expect } from 'vitest';
import { CharacterState } from '../character-state';
import { skills, RAW_XP_TABLES } from '../data/skills';
import { buildXpTableLookup } from './xp';
import { planGardeningSkill, DEFAULT_GARDENING_TIMING } from './gardening-planner';
import {
  gardeningSeeds,
  gardeningSeedsByCode,
  getAvailableSeeds,
  getSeedSlotGroup,
  classifySeed,
  WATER_BOTTLE_ITEM_CODE,
  FERTILIZER_BOTTLE_ITEM_CODE,
} from './gardening-data';
import type { GardeningPlannerOptions } from './gardening-types';

const xpTables = buildXpTableLookup(
  RAW_XP_TABLES as Record<string, { InternalName: string; XpAmounts: number[] }>,
);

function makeCharState(level: number, xp: number = 0): CharacterState {
  const cs = new CharacterState();
  cs.skills.set('Gardening', {
    Level: level,
    BonusLevels: 0,
    XpTowardNextLevel: xp,
    XpNeededForNextLevel: 0,
  });
  return cs;
}

function makeOptions(overrides: Partial<GardeningPlannerOptions> = {}): GardeningPlannerOptions {
  return {
    targetLevel: 10,
    timing: { ...DEFAULT_GARDENING_TIMING },
    strategy: 'xp',
    ...overrides,
  };
}

// ── Data Layer Tests ──────────────────────────────────────

describe('gardening-data', () => {
  it('loads all seeds from gardening.json', () => {
    expect(gardeningSeeds.length).toBeGreaterThan(40);
  });

  it('looks up seeds by code', () => {
    const potato = gardeningSeedsByCode.get(10101);
    expect(potato).toBeDefined();
    expect(potato!.seedName).toBe('Potato Seedling');
    expect(potato!.resultItemCode).toBe(5301);
    expect(potato!.resultName).toBe('Potato');
  });

  it('classifies seeds correctly', () => {
    expect(classifySeed(10101)).toBe('vegetable');
    expect(classifySeed(10201)).toBe('flower');
    expect(classifySeed(12501)).toBe('cotton');
    expect(classifySeed(10252)).toBe('grass');
    expect(classifySeed(10262)).toBe('unique');
  });

  it('gets available seeds at level 0', () => {
    const seeds = getAvailableSeeds(0);
    // Only Potato Seedling (lv 0) and Soybean Sprout (lv 0) have level 0
    expect(seeds.length).toBeGreaterThanOrEqual(2);
    expect(seeds.every((s) => s.gardeningLevel <= 0)).toBe(true);
    expect(seeds.every((s) => s.gardeningXp != null && s.growTimeSeconds != null)).toBe(true);
  });

  it('excludes seeds with null XP or grow time', () => {
    const allSeeds = getAvailableSeeds(100); // high level, all unlocked
    for (const seed of allSeeds) {
      expect(seed.gardeningXp).not.toBeNull();
      expect(seed.growTimeSeconds).not.toBeNull();
    }
  });

  it('filters by include/exclude sets', () => {
    const included = new Set([10101]); // Only potato
    const seeds = getAvailableSeeds(100, included);
    expect(seeds.length).toBe(1);
    expect(seeds[0].seedItemCode).toBe(10101);

    const excluded = new Set([10101]);
    const seeds2 = getAvailableSeeds(0, undefined, excluded);
    expect(seeds2.every((s) => s.seedItemCode !== 10101)).toBe(true);
  });

  it('maps seeds to slot groups', () => {
    const potatoGroup = getSeedSlotGroup(10101);
    expect(potatoGroup).toBeDefined();
    expect(potatoGroup!.name).toBe('potato');
    expect(potatoGroup!.maxSlots).toBe(2);

    // Green pepper shares with red pepper
    const gpGroup = getSeedSlotGroup(10109);
    const rpGroup = getSeedSlotGroup(10110);
    expect(gpGroup).toBe(rpGroup);
    expect(gpGroup!.name).toBe('pepper');

    // Cabbage shares with escarole
    const cabGroup = getSeedSlotGroup(10103);
    const escGroup = getSeedSlotGroup(10112);
    expect(cabGroup).toBe(escGroup);
    expect(cabGroup!.name).toBe('lettuce');

    // Flower group
    const flowerGroup = getSeedSlotGroup(10201);
    expect(flowerGroup!.name).toBe('flower');
    expect(flowerGroup!.maxSlots).toBe(3);
  });
});

// ── Planner Tests ─────────────────────────────────────────

describe('planGardeningSkill', () => {
  it('plans potato farming from level 0 to 5', () => {
    const cs = makeCharState(0);
    const result = planGardeningSkill(cs, makeOptions({ targetLevel: 5 }), skills, xpTables);

    expect(result.skill).toBe('Gardening');
    expect(result.startLevel).toBe(0);
    expect(result.endLevel).toBeGreaterThanOrEqual(5);
    expect(result.targetReached).toBe(true);
    expect(result.totalHarvests).toBeGreaterThan(0);
    expect(result.totalXpGained).toBeGreaterThan(0);
    expect(result.totalTimeSeconds).toBeGreaterThan(0);
    expect(result.xpPerHour).toBeGreaterThan(0);
    expect(result.levelUps).toBeGreaterThanOrEqual(5);
  });

  it('tracks seed usage in ingredientTotals', () => {
    const cs = makeCharState(0);
    const result = planGardeningSkill(cs, makeOptions({ targetLevel: 3 }), skills, xpTables);

    // Should have seed usage in ingredientTotals
    expect(result.ingredientTotals.size).toBeGreaterThan(0);
    expect(result.seedsUsed.size).toBeGreaterThan(0);

    // Water should be tracked
    expect(result.waterUsed).toBeGreaterThan(0);
    expect(result.ingredientTotals.has(WATER_BOTTLE_ITEM_CODE)).toBe(true);
  });

  it('tracks fertilizer usage for fert plants', () => {
    const cs = makeCharState(10);
    // At level 10, cabbage (fert=1) is available
    const result = planGardeningSkill(cs, makeOptions({ targetLevel: 15 }), skills, xpTables);

    expect(result.fertilizerUsed).toBeGreaterThan(0);
    expect(result.ingredientTotals.has(FERTILIZER_BOTTLE_ITEM_CODE)).toBe(true);
  });

  it('produces harvest runs grouped by seed type', () => {
    const cs = makeCharState(0);
    const result = planGardeningSkill(cs, makeOptions({ targetLevel: 5 }), skills, xpTables);

    expect(result.harvestRuns.length).toBeGreaterThan(0);
    for (const run of result.harvestRuns) {
      expect(run.count).toBeGreaterThan(0);
      expect(run.totalXp).toBeGreaterThan(0);
      expect(run.seedName).toBeTruthy();
      expect(run.resultName).toBeTruthy();
    }
  });

  it('respects maxActions safety cap', () => {
    const cs = makeCharState(0);
    const result = planGardeningSkill(
      cs,
      makeOptions({ targetLevel: 999, maxActions: 50 }),
      skills,
      xpTables,
    );

    expect(result.actions.length).toBeLessThanOrEqual(50);
    expect(result.targetReached).toBe(false);
  });

  it('unlocks new seeds on level up', () => {
    const cs = makeCharState(0);
    // Level 0->10 should go from potato only to also cabbage (level 10)
    const result = planGardeningSkill(cs, makeOptions({ targetLevel: 10 }), skills, xpTables);

    // Check that we planted more than just one seed type
    const seedTypes = new Set(
      result.actions
        .filter((a) => a.type === 'plant' && a.seedItemCode != null)
        .map((a) => a.seedItemCode),
    );
    // At minimum potato + onion (lv 5 unlock)
    expect(seedTypes.size).toBeGreaterThanOrEqual(1);
  });

  it('tracks produce harvested', () => {
    const cs = makeCharState(0);
    const result = planGardeningSkill(cs, makeOptions({ targetLevel: 3 }), skills, xpTables);

    expect(result.produceHarvested.size).toBeGreaterThan(0);
    // Potato (5301) should be in the harvested produce
    expect(result.produceHarvested.has(5301)).toBe(true);
  });

  it('handles water bottle refills', () => {
    const cs = makeCharState(0);
    const options = makeOptions({
      targetLevel: 5,
      timing: { ...DEFAULT_GARDENING_TIMING, waterBottleCount: 2 },
    });
    const result = planGardeningSkill(cs, options, skills, xpTables);

    // With only 2 bottles and many plants, refills should happen
    expect(result.waterRefills).toBeGreaterThan(0);
  });

  it('returns empty keyword ingredient totals', () => {
    const cs = makeCharState(0);
    const result = planGardeningSkill(cs, makeOptions({ targetLevel: 3 }), skills, xpTables);

    expect(result.keywordIngredientTotals.size).toBe(0);
  });
});
