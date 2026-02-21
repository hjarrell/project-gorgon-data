import type { GardeningSeedEntry, SlotGroup, SeedCategory } from './gardening-types';
import RAW_GARDENING from '../wikidata/gardening.json';

// ============================================================
// Well-Known Item Codes
// ============================================================

/** item_1: Empty Bottle */
export const EMPTY_BOTTLE_ITEM_CODE = 1;
/** item_2: Bottle of Water */
export const WATER_BOTTLE_ITEM_CODE = 2;
/** item_10001: Bottle of Fertilizer */
export const FERTILIZER_BOTTLE_ITEM_CODE = 10001;
/** NPC vendor price for Bottle of Fertilizer (higher than item Value of 30) */
export const FERTILIZER_NPC_PRICE = 45;
/** item_1001: Strange Dirt (fertilizer crafting ingredient) */
export const STRANGE_DIRT_ITEM_CODE = 1001;

// ============================================================
// Seed Data Loader
// ============================================================

function loadCategory(
  entries: Array<Record<string, unknown>>,
  category: SeedCategory,
): GardeningSeedEntry[] {
  return entries.map((e) => ({
    seedItemCode: e.seedItemCode as number,
    seedName: e.seedName as string,
    seedValue: e.seedValue as number,
    gardeningLevel: e.gardeningLevel as number,
    gardeningXp: (e.gardeningXp as number) ?? null,
    growTimeSeconds: (e.growTimeSeconds as number) ?? null,
    growTimeDisplay: (e.growTimeDisplay as string) ?? null,
    location: e.location as string,
    fertilizer: e.fertilizer as number,
    resultItemCode: e.resultItemCode as number,
    resultName: e.resultName as string,
    resultValue: (e.resultValue as number) ?? null,
    resultYield: e.resultYield as number,
    notes: e.notes as string | undefined,
    _category: category,
  })) as GardeningSeedEntry[];
}

const raw = RAW_GARDENING as {
  vegetables: Array<Record<string, unknown>>;
  flowers: Array<Record<string, unknown>>;
  unique: Array<Record<string, unknown>>;
};

const vegetableSeeds = loadCategory(raw.vegetables, 'vegetable');
const flowerSeeds = loadCategory(raw.flowers, 'flower');
const uniqueSeeds = loadCategory(raw.unique, 'unique');

/** All gardening seed entries from wiki data */
export const gardeningSeeds: GardeningSeedEntry[] = [
  ...vegetableSeeds,
  ...flowerSeeds,
  ...uniqueSeeds,
];

/** Lookup seed entry by seedItemCode */
export const gardeningSeedsByCode: Map<number, GardeningSeedEntry> = new Map(
  gardeningSeeds.map((s) => [s.seedItemCode, s]),
);

// ============================================================
// Seed Category Classification
// ============================================================

const vegetableCodes = new Set(vegetableSeeds.map((s) => s.seedItemCode));
const flowerCodes = new Set(flowerSeeds.map((s) => s.seedItemCode));

/** Cotton item code (seed and result are the same item) */
const COTTON_CODE = 12501;
/** Grass seed codes: Sugarcane Seeds, Barley Seeds */
const GRASS_CODES = new Set([10252, 10251]);

export function classifySeed(seedItemCode: number): SeedCategory {
  if (vegetableCodes.has(seedItemCode)) return 'vegetable';
  if (flowerCodes.has(seedItemCode)) return 'flower';
  if (seedItemCode === COTTON_CODE) return 'cotton';
  if (GRASS_CODES.has(seedItemCode)) return 'grass';
  return 'unique';
}

// ============================================================
// Slot Configuration (data-driven, easy to update)
// ============================================================

/**
 * Default garden slot groups.
 *
 * Vegetables: 2 slots per type (some types share slots).
 * Flowers: 3 total slots, any combination.
 * Cotton: 5 slots.
 * Grass: 2 slots (sugarcane or barley).
 * Unique plants get 2 slots each by default.
 */
export const DEFAULT_SLOT_GROUPS: SlotGroup[] = [
  // ── Vegetables (2 slots each) ──
  { name: 'potato', category: 'vegetable', maxSlots: 2, seedItemCodes: [10101] },
  { name: 'onion', category: 'vegetable', maxSlots: 2, seedItemCodes: [10102] },
  { name: 'lettuce', category: 'vegetable', maxSlots: 2, seedItemCodes: [10103, 10112, 10119] }, // cabbage + escarole + red-leaf lettuce
  { name: 'beet', category: 'vegetable', maxSlots: 2, seedItemCodes: [10104] },
  { name: 'squash', category: 'vegetable', maxSlots: 2, seedItemCodes: [10105] },
  { name: 'broccoli', category: 'vegetable', maxSlots: 2, seedItemCodes: [10106] },
  { name: 'carrot', category: 'vegetable', maxSlots: 2, seedItemCodes: [10107] },
  { name: 'pepper', category: 'vegetable', maxSlots: 2, seedItemCodes: [10109, 10110] }, // green + red pepper
  { name: 'corn', category: 'vegetable', maxSlots: 2, seedItemCodes: [10111] },
  { name: 'basil', category: 'vegetable', maxSlots: 2, seedItemCodes: [10113] },
  { name: 'gourd', category: 'vegetable', maxSlots: 2, seedItemCodes: [10114, 10108] }, // cantaloupe + pumpkin
  { name: 'pea', category: 'vegetable', maxSlots: 2, seedItemCodes: [10115] },
  { name: 'soybean', category: 'vegetable', maxSlots: 2, seedItemCodes: [10116] },
  { name: 'tomato', category: 'vegetable', maxSlots: 2, seedItemCodes: [10118] },

  // ── Flowers (3 total, any combination) ──
  {
    name: 'flower',
    category: 'flower',
    maxSlots: 3,
    seedItemCodes: flowerSeeds.map((s) => s.seedItemCode),
  },

  // ── Cotton (5 slots) ──
  { name: 'cotton', category: 'cotton', maxSlots: 5, seedItemCodes: [COTTON_CODE] },

  // ── Grass (2 slots, sugarcane or barley) ──
  { name: 'grass', category: 'grass', maxSlots: 2, seedItemCodes: [10252, 10251] },

  // ── Unique plants (2 slots each) ──
  { name: 'horse_apple', category: 'unique', maxSlots: 2, seedItemCodes: [10262] },
  { name: 'flax', category: 'unique', maxSlots: 2, seedItemCodes: [10261] },
  { name: 'oat', category: 'unique', maxSlots: 2, seedItemCodes: [10253] },
  { name: 'tundra_rye', category: 'unique', maxSlots: 2, seedItemCodes: [10120] },
  { name: 'evil_pumpkin', category: 'unique', maxSlots: 2, seedItemCodes: [10151] },
  { name: 'orcish_wheat', category: 'unique', maxSlots: 2, seedItemCodes: [10117] },
  { name: 'foul_acorn', category: 'unique', maxSlots: 1, seedItemCodes: [14117] },
  { name: 'sugarcane', category: 'unique', maxSlots: 2, seedItemCodes: [10252] },
];

/** Reverse lookup: seedItemCode → SlotGroup */
const seedToSlotGroup = new Map<number, SlotGroup>();
for (const group of DEFAULT_SLOT_GROUPS) {
  for (const code of group.seedItemCodes) {
    // First match wins (e.g. sugarcane is in 'grass' group, not 'unique')
    if (!seedToSlotGroup.has(code)) {
      seedToSlotGroup.set(code, group);
    }
  }
}

/** Get the slot group for a seed item code */
export function getSeedSlotGroup(seedItemCode: number): SlotGroup | undefined {
  return seedToSlotGroup.get(seedItemCode);
}

// ============================================================
// Seed Availability
// ============================================================

/**
 * Get seeds available at a given gardening level, optionally filtered.
 * Excludes seeds with null gardeningXp or null growTimeSeconds (can't be planned).
 */
export function getAvailableSeeds(
  level: number,
  included?: Set<number>,
  excluded?: Set<number>,
): GardeningSeedEntry[] {
  return gardeningSeeds.filter((seed) => {
    // Must have data to plan
    if (seed.gardeningXp == null || seed.growTimeSeconds == null) return false;
    // Must meet level requirement
    if (seed.gardeningLevel > level) return false;
    // Apply include filter (if set, must be in it)
    if (included && included.size > 0 && !included.has(seed.seedItemCode)) return false;
    // Apply exclude filter
    if (excluded && excluded.has(seed.seedItemCode)) return false;
    return true;
  });
}
