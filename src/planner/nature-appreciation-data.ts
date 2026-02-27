import type { NatureAppreciationFlowerEntry } from './nature-appreciation-types';
import { loadJSON } from '../load-json';

const RAW_NA = loadJSON('wikidata/nature_appreciation.json');

// ============================================================
// Flower Data Loader
// ============================================================

function loadFlowers(
  entries: Array<Record<string, unknown>>,
): NatureAppreciationFlowerEntry[] {
  return entries.map((e) => ({
    flowerItemCode: e.flowerItemCode as number,
    flowerName: e.flowerName as string,
    natureAppreciationLevel: e.natureAppreciationLevel as number,
    xp: (e.xp as number) ?? null,
    buff: (e.buff as string) ?? null,
    seedLocation: e.seedLocation as string,
    gardeningLevel: (e.gardeningLevel as number) ?? null,
    seedItemCode: (e.seedItemCode as number) ?? null,
    growable: e.growable as boolean,
    notes: e.notes as string | undefined,
  }));
}

const raw = RAW_NA as {
  flowers: Array<Record<string, unknown>>;
};

/** All Nature Appreciation flower entries from wiki data */
export const natureAppreciationFlowers: NatureAppreciationFlowerEntry[] =
  loadFlowers(raw.flowers);

/** Lookup flower entry by flowerItemCode */
export const natureAppreciationFlowersByCode: Map<number, NatureAppreciationFlowerEntry> =
  new Map(natureAppreciationFlowers.map((f) => [f.flowerItemCode, f]));

// ============================================================
// Flower Availability
// ============================================================

/**
 * Get flowers available at a given Nature Appreciation level, optionally filtered.
 * Excludes flowers with null XP (can't be planned).
 */
export function getAvailableFlowers(
  level: number,
  excluded?: Set<number>,
): NatureAppreciationFlowerEntry[] {
  return natureAppreciationFlowers.filter((flower) => {
    // Must have XP data to plan
    if (flower.xp == null) return false;
    // Must meet level requirement
    if (flower.natureAppreciationLevel > level) return false;
    // Apply exclude filter
    if (excluded && excluded.has(flower.flowerItemCode)) return false;
    return true;
  });
}

/**
 * Get growable flowers at a given gardening level.
 * Useful for determining which flowers can be grown in "Grow Flowers" mode.
 */
export function getGrowableFlowersAtGardeningLevel(
  gardeningLevel: number,
): NatureAppreciationFlowerEntry[] {
  return natureAppreciationFlowers.filter(
    (f) => f.growable && f.gardeningLevel != null && f.gardeningLevel <= gardeningLevel,
  );
}
