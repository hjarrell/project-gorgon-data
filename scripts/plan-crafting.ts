#!/usr/bin/env npx tsx
/**
 * Run the greedy crafting planner and print the full plan.
 *
 * Usage:
 *   npx tsx scripts/plan-crafting.ts <character-json> <skill> <target-level> [flags]
 *
 * Flags:
 *   --efficient              Use XP-per-effort scoring instead of raw XP
 *   --effort-file <path>     JSON file mapping ItemCode (number) → effort value
 *   --include-recipes <path> JSON file with array of recipe InternalNames to treat as known
 *   --exclude-recipes <path> JSON file with array of recipe InternalNames to exclude
 *   --inventory <path>       JSON file mapping ItemCode (number) → quantity available
 *   --unlock-prereqs         Automatically unlock recipes via PrereqRecipe chains
 *   --verbose                Show every individual craft step
 *
 * Examples:
 *   npx tsx scripts/plan-crafting.ts src/example/Character_ShepardPiedPiper.json Cooking 30
 *   npx tsx scripts/plan-crafting.ts src/example/Character_ShepardPiedPiper.json Cooking 30 --efficient
 *   npx tsx scripts/plan-crafting.ts src/example/Character_ShepardPiedPiper.json Fletching 30 --unlock-prereqs
 *   npx tsx scripts/plan-crafting.ts src/example/Character_ShepardPiedPiper.json Blacksmithing 20 --efficient --effort-file effort.json --verbose
 */

import { readFileSync } from 'fs';
import { resolve } from 'path';
import { CharacterState } from '../src/character-state';
import { recipes, items, skills, RAW_XP_TABLES } from '../src/data';
import { buildXpTableLookup, planCraftingSkill, buildItemRecipeLookup, findRecipesForItem } from '../src/planner';
import type { ItemEffortMap, PlannerOptions } from '../src/planner';

// --- Parse args ---
const args = process.argv.slice(2);
const positional: string[] = [];
let efficient = false;
let effortFilePath: string | null = null;
let includeRecipesPath: string | null = null;
let excludeRecipesPath: string | null = null;
let inventoryPath: string | null = null;
let unlockPrereqs = false;
let verbose = false;

for (let i = 0; i < args.length; i++) {
  if (args[i] === '--efficient') {
    efficient = true;
  } else if (args[i] === '--effort-file') {
    effortFilePath = args[++i];
  } else if (args[i] === '--include-recipes') {
    includeRecipesPath = args[++i];
  } else if (args[i] === '--exclude-recipes') {
    excludeRecipesPath = args[++i];
  } else if (args[i] === '--inventory') {
    inventoryPath = args[++i];
  } else if (args[i] === '--unlock-prereqs') {
    unlockPrereqs = true;
  } else if (args[i] === '--verbose') {
    verbose = true;
  } else {
    positional.push(args[i]);
  }
}

const [charFile, targetSkill, targetLevelStr] = positional;

if (!charFile || !targetSkill || !targetLevelStr) {
  console.error(
    'Usage: npx tsx scripts/plan-crafting.ts <character-json> <skill> <target-level> [--efficient] [--effort-file <path>] [--include-recipes <path>] [--exclude-recipes <path>] [--inventory <path>] [--unlock-prereqs] [--verbose]',
  );
  process.exit(1);
}

const targetLevel = parseInt(targetLevelStr, 10);
if (isNaN(targetLevel) || targetLevel < 1) {
  console.error(`Invalid target level: "${targetLevelStr}"`);
  process.exit(1);
}

// --- Load effort file if provided ---
let itemEffort: ItemEffortMap | undefined;
if (effortFilePath) {
  const rawEffort = JSON.parse(readFileSync(resolve(effortFilePath), 'utf-8'));
  itemEffort = new Map<number, number>();
  for (const [key, value] of Object.entries(rawEffort)) {
    itemEffort.set(Number(key), value as number);
  }
}

// --- Load include-recipes file if provided ---
let includeRecipes: Set<string> | undefined;
if (includeRecipesPath) {
  const rawInclude = JSON.parse(readFileSync(resolve(includeRecipesPath), 'utf-8'));
  if (!Array.isArray(rawInclude)) {
    console.error('--include-recipes file must contain a JSON array of recipe InternalNames');
    process.exit(1);
  }
  includeRecipes = new Set<string>(rawInclude);
}

// --- Load exclude-recipes file if provided ---
let excludeRecipes: Set<string> | undefined;
if (excludeRecipesPath) {
  const rawExclude = JSON.parse(readFileSync(resolve(excludeRecipesPath), 'utf-8'));
  if (!Array.isArray(rawExclude)) {
    console.error('--exclude-recipes file must contain a JSON array of recipe InternalNames');
    process.exit(1);
  }
  excludeRecipes = new Set<string>(rawExclude);
}

// --- Load inventory file if provided ---
let inventory: Map<number, number> | undefined;
if (inventoryPath) {
  const rawInventory = JSON.parse(readFileSync(resolve(inventoryPath), 'utf-8'));
  inventory = new Map<number, number>();
  for (const [key, value] of Object.entries(rawInventory)) {
    inventory.set(Number(key), value as number);
  }
}

// --- Load character ---
const raw = JSON.parse(readFileSync(resolve(charFile), 'utf-8'));
const state = new CharacterState();
state.loadCharacterSheet(raw);

// --- Run planner ---
const xpTables = buildXpTableLookup(
  RAW_XP_TABLES as Record<string, { InternalName: string; XpAmounts: number[] }>,
);

const plannerOptions: PlannerOptions = {
  targetLevel,
  strategy: efficient ? 'efficient' : 'xp',
  itemEffort,
  includeRecipes,
  excludeRecipes,
  unlockPrereqs,
  inventory,
};

const result = planCraftingSkill(state, targetSkill, plannerOptions, recipes, skills, xpTables);

// --- Print results ---
console.log('');
console.log(`=== Crafting Plan: ${result.skill} ===`);
console.log(`Character:    ${state.characterName}`);
console.log(`Strategy:     ${efficient ? 'efficient (XP/effort)' : 'xp (max XP)'}`);
console.log(`Start Level:  ${result.startLevel}`);
console.log(`Target Level: ${result.targetLevel}`);
console.log(`End Level:    ${result.endLevel}`);
console.log(`Reached:      ${result.targetReached ? 'YES' : 'NO'}`);
console.log(`Total Crafts: ${result.totalCrafts}`);
console.log(`Total XP:     ${result.totalXpGained.toLocaleString()}`);
console.log(`Total Effort: ${result.totalEffort.toFixed(1)}`);
console.log(`XP/Effort:    ${result.totalEffort > 0 ? (result.totalXpGained / result.totalEffort).toFixed(2) : 'N/A'}`);
console.log(`Level-ups:    ${result.levelUps}`);
console.log('');

if (result.steps.length === 0) {
  console.log('No crafts needed (already at or above target level).');
} else {
  // Summary table: group consecutive crafts of the same recipe
  interface RunSummary {
    recipeName: string;
    internalName: string;
    count: number;
    firstCrafts: number;
    totalXp: number;
    totalEffort: number;
    levelStart: number;
    levelEnd: number;
  }

  const runs: RunSummary[] = [];
  for (const step of result.steps) {
    const last = runs[runs.length - 1];
    if (last && last.internalName === step.internalName) {
      last.count++;
      last.totalXp += step.xpGained;
      last.totalEffort += step.effortCost;
      last.levelEnd = step.skillLevelAfter;
      if (step.isFirstCraft) last.firstCrafts++;
    } else {
      runs.push({
        recipeName: step.recipeName,
        internalName: step.internalName,
        count: 1,
        firstCrafts: step.isFirstCraft ? 1 : 0,
        totalXp: step.xpGained,
        totalEffort: step.effortCost,
        levelStart: step.skillLevelBefore,
        levelEnd: step.skillLevelAfter,
      });
    }
  }

  // Print summary
  console.log('--- Summary (grouped by consecutive recipe) ---');
  console.log('');
  const nameWidth = Math.max(12, ...runs.map((r) => r.recipeName.length));
  console.log(
    `${'Recipe'.padEnd(nameWidth)}  ${'Count'.padStart(5)}  ${'XP'.padStart(8)}  ${'Effort'.padStart(8)}  ${'XP/Eff'.padStart(7)}  ${'Lvl'.padStart(7)}  First?`,
  );
  console.log('-'.repeat(nameWidth + 50));

  for (const run of runs) {
    const lvl = run.levelStart === run.levelEnd
      ? `${run.levelStart}`
      : `${run.levelStart}→${run.levelEnd}`;
    const first = run.firstCrafts > 0 ? `(${run.firstCrafts} new)` : '';
    const xpPerEffort = run.totalEffort > 0 ? (run.totalXp / run.totalEffort).toFixed(1) : 'N/A';
    console.log(
      `${run.recipeName.padEnd(nameWidth)}  ${String(run.count).padStart(5)}  ${run.totalXp.toLocaleString().padStart(8)}  ${run.totalEffort.toFixed(1).padStart(8)}  ${xpPerEffort.padStart(7)}  ${lvl.padStart(7)}  ${first}`,
    );
  }

  // Detailed step-by-step
  if (verbose) {
    console.log('');
    console.log('--- Step-by-step Detail ---');
    console.log('');
    console.log(`${'#'.padStart(4)}  ${'Recipe'.padEnd(nameWidth)}  ${'XP'.padStart(7)}  ${'Effort'.padStart(7)}  ${'Lvl'.padStart(5)}  First?`);
    console.log('-'.repeat(nameWidth + 36));

    for (let i = 0; i < result.steps.length; i++) {
      const s = result.steps[i];
      const lvlChange = s.skillLevelBefore !== s.skillLevelAfter
        ? `${s.skillLevelBefore}→${s.skillLevelAfter}`
        : `${s.skillLevelBefore}`;
      const first = s.isFirstCraft ? '*NEW*' : '';
      console.log(
        `${String(i + 1).padStart(4)}  ${s.recipeName.padEnd(nameWidth)}  ${s.xpGained.toLocaleString().padStart(7)}  ${s.effortCost.toFixed(1).padStart(7)}  ${lvlChange.padStart(5)}  ${first}`,
      );
    }
  } else if (result.steps.length > 0) {
    console.log('');
    console.log('(Add --verbose for step-by-step detail)');
  }

  // --- Ingredient totals ---
  console.log('');
  console.log('--- Ingredients Needed ---');
  console.log('');

  // Resolve item names and sort by count descending
  interface IngredientRow {
    name: string;
    itemCode: number;
    count: number;
    timesUsed: number;
    chance: number;
    recipeCount: number;
  }
  const ingredientRows: IngredientRow[] = [];
  for (const [itemCode, usage] of result.ingredientTotals) {
    const itemKey = `item_${itemCode}`;
    const item = items.get(itemKey);
    const name = item?.Name ?? `Item #${itemCode}`;
    ingredientRows.push({ name, itemCode, count: usage.totalCount, timesUsed: usage.timesUsed, chance: usage.chanceToConsume, recipeCount: usage.recipeCount });
  }
  ingredientRows.sort((a, b) => b.count - a.count);

  const ingNameWidth = Math.max(12, ...ingredientRows.map((r) => r.name.length));
  console.log(`${'Item'.padEnd(ingNameWidth)}  ${'Count'.padStart(6)}  ${'Uses'.padStart(5)}  ${'Chance'.padStart(7)}  ${'Recipes'.padStart(7)}  Craftable?`);
  console.log('-'.repeat(ingNameWidth + 52));

  // Build reverse lookup for craftability check
  const itemRecipeLookup = buildItemRecipeLookup(recipes);

  for (const row of ingredientRows) {
    const sources = findRecipesForItem(row.itemCode, itemRecipeLookup);
    const craftable = sources.length > 0
      ? sources.map((s) => `${s.recipe.Skill} (${s.recipe.Name})`).slice(0, 2).join(', ')
      : '-';
    const chance = row.chance < 1.0 ? `${(row.chance * 100).toFixed(0)}%` : '100%';
    console.log(
      `${row.name.padEnd(ingNameWidth)}  ${String(row.count).padStart(6)}  ${String(row.timesUsed).padStart(5)}  ${chance.padStart(7)}  ${String(row.recipeCount).padStart(7)}  ${craftable}`,
    );
  }

  // Keyword-based ingredients
  if (result.keywordIngredientTotals.size > 0) {
    console.log('');
    console.log('Keyword-based ingredients:');
    for (const [keyword, usage] of result.keywordIngredientTotals) {
      const chance = usage.chanceToConsume < 1.0 ? ` (${(usage.chanceToConsume * 100).toFixed(0)}% chance)` : '';
      console.log(`  ${keyword}: ${usage.totalCount} (${usage.timesUsed} uses) across ${usage.recipeCount} recipe(s)${chance}`);
    }
  }

  // Inventory diff (only when inventory was provided)
  if (inventory && result.inventoryRemaining) {
    console.log('');
    console.log('--- Inventory Changes ---');
    console.log('');

    interface InventoryDiffRow {
      name: string;
      itemCode: number;
      before: number;
      after: number;
      diff: number;
    }
    const diffRows: InventoryDiffRow[] = [];

    // Collect all item codes that appear in either starting or remaining inventory
    const allCodes = new Set([...inventory.keys(), ...result.inventoryRemaining.keys()]);
    for (const itemCode of allCodes) {
      const before = inventory.get(itemCode) ?? 0;
      const after = result.inventoryRemaining.get(itemCode) ?? 0;
      if (before === after) continue;
      const itemKey = `item_${itemCode}`;
      const item = items.get(itemKey);
      const name = item?.Name ?? `Item #${itemCode}`;
      diffRows.push({ name, itemCode, before, after, diff: after - before });
    }

    if (diffRows.length === 0) {
      console.log('No inventory changes.');
    } else {
      // Sort: consumed items first (negative diff), then produced items (positive diff)
      diffRows.sort((a, b) => a.diff - b.diff);

      const diffNameWidth = Math.max(12, ...diffRows.map((r) => r.name.length));
      console.log(`${'Item'.padEnd(diffNameWidth)}  ${'Before'.padStart(7)}  ${'After'.padStart(7)}  ${'Change'.padStart(7)}`);
      console.log('-'.repeat(diffNameWidth + 27));

      for (const row of diffRows) {
        const sign = row.diff > 0 ? '+' : '';
        console.log(
          `${row.name.padEnd(diffNameWidth)}  ${String(row.before).padStart(7)}  ${String(row.after).padStart(7)}  ${(sign + row.diff).padStart(7)}`,
        );
      }
    }
  }
}

console.log('');
