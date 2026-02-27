# Project Gorgon Data

Typed game data library for [Project Gorgon](https://projectgorgon.com) — an indie MMORPG by Elder Game, LLC.

Provides Zod-validated schemas for all client data files, pre-loaded typed `Map` collections, crafting/gardening/nature appreciation skill planners, a build calculator with damage computation, a combat simulator, a match-3 puzzle engine, and helper utilities for items, recipes, and keywords.

## Installation

```bash
npm install project-gorgon-data
# or
pnpm add project-gorgon-data
```

`zod` is a peer dependency:

```bash
npm install zod
```

## Quick Start

```typescript
import { recipes, items, skills, RAW_XP_TABLES } from 'project-gorgon-data';
import { planCraftingSkill, buildXpTableLookup, CharacterState } from 'project-gorgon-data';

// Load a character export
const state = new CharacterState();
state.loadReport(characterJson);

// Plan leveling Cooking to 30
const xpTables = buildXpTableLookup(RAW_XP_TABLES);
const plan = planCraftingSkill(state, 'Cooking', { targetLevel: 30 }, recipes, skills, xpTables);
console.log(`${plan.totalCrafts} crafts, ${plan.totalXpGained} XP`);
```

## Sub-path Imports

Import only what you need for smaller bundles:

```typescript
import { recipes, items } from 'project-gorgon-data/data';
import { RecipeSchema, ItemSchema } from 'project-gorgon-data/schemas';
import { planCraftingSkill } from 'project-gorgon-data/planner';
import { getItemName, buildKeywordIndex } from 'project-gorgon-data/helpers';
import { generateBoard, applyMove } from 'project-gorgon-data/match3';
```

| Import Path | Contents |
| --- | --- |
| `project-gorgon-data` | Everything re-exported |
| `project-gorgon-data/schemas` | Zod schemas + inferred TypeScript types |
| `project-gorgon-data/data` | Pre-loaded `Map` instances + raw JSON |
| `project-gorgon-data/data/items` | Items only |
| `project-gorgon-data/data/recipes` | Recipes only |
| `project-gorgon-data/data/skills` | Skills only |
| `project-gorgon-data/data/abilities` | Abilities only |
| `project-gorgon-data/data/npcs` | NPCs only |
| `project-gorgon-data/data/areas` | Areas only |
| `project-gorgon-data/data/sources` | Source lookups (abilities, items, recipes) |
| `project-gorgon-data/planner` | Crafting, gardening, and nature appreciation planners |
| `project-gorgon-data/helpers` | Item, recipe, keyword, build, and combat helpers |
| `project-gorgon-data/match3` | Match-3 puzzle engine |

## Data

All game data is pre-loaded into typed `Map` collections keyed by internal ID.

| Export | Type | Description |
| --- | --- | --- |
| `items` | `Map<string, Item>` | All game items keyed by `item_<id>` |
| `recipes` | `Map<string, Recipe>` | All game recipes keyed by `recipe_<id>` |
| `skills` | `Map<string, Skill>` | All game skills keyed by skill name |
| `abilities` | `Map<string, Ability>` | All abilities keyed by `ability_<id>` |
| `npcs` | `Map<string, Npc>` | All NPCs keyed by internal name |
| `areas` | `Map<string, Area>` | Game areas |
| `effects` | `Map<string, Effect>` | Buffs, debuffs, and ability modifiers |
| `tsysClientInfo` | `Map<string, TsysClientInfo>` | Treasure system powers and tiers |
| `advancementTables` | `Map<string, AdvancementTable>` | Skill advancement tables |
| `quests` | `Map<string, Quest>` | All quests |
| `RAW_XP_TABLES` | `Record<string, XpTable>` | Raw XP table data. Pass to `buildXpTableLookup()` |

Additional data exports: `abilityKeywords`, `abilityDynamicDots`, `attributes`, `directedGoals`, `landmarks`, `lorebookInfo`, `lorebooks`, `playerTitles`, `storageVaults`, `tsysProfiles`, and corresponding `RAW_*` constants.

## Schemas

All data types have Zod schemas with `.strict()` validation. Schemas are exported alongside their inferred TypeScript types:

```typescript
import { RecipeSchema, type Recipe } from 'project-gorgon-data/schemas';

const parsed = RecipeSchema.parse(rawData);
```

Schemas are available for: abilities, areas, items, itemUses, recipes, NPCs, skills, effects, attributes, quests, storageVaults, tsysClientInfo, tsysProfiles, xpTables, advancementTables, AI, abilityKeywords, abilityDynamicDots, abilityDynamicSpecialValues, directedGoals, landmarks, lorebookInfo, lorebooks, playerTitles, sourcesAbilities, sourcesItems, sourcesRecipes, characterReport, and storageReport.

## Character State

Load character sheet and storage exports from the game:

```typescript
import { CharacterState } from 'project-gorgon-data';

const state = new CharacterState();
state.loadReport(characterSheetJson);  // Auto-detects report type
state.loadReport(storageJson);         // Load storage separately

state.characterName;          // string | null
state.skills;                 // Map<string, CharacterSkillEntry>
state.recipeCompletions;      // Map<string, number> — InternalName -> times crafted
state.currentStats;           // Map<string, number>
state.allItems;               // StorageItem[] — all items from storage report
state.inventoryItems;         // StorageItem[] — items in inventory
state.vaultItems;             // StorageItem[] — items in storage vaults
state.getItemsByVault(name);  // StorageItem[] — items in a specific vault
state.vaultNames;             // string[] — all vault names
state.equippedItems;          // StorageItem[] — equipped gear
```

Standalone parse functions are also available: `parseReport(data)`, `parseCharacterReport(data)`, `parseStorageReport(data)`.

## Crafting Planner

Greedy simulation that picks the best recipe at each step to level a crafting skill:

```typescript
import { planCraftingSkill, buildXpTableLookup, groupStepsIntoRuns } from 'project-gorgon-data/planner';
import { recipes, skills, RAW_XP_TABLES } from 'project-gorgon-data/data';

const xpTables = buildXpTableLookup(RAW_XP_TABLES);
const plan = planCraftingSkill(state, 'Cooking', {
  targetLevel: 30,
  strategy: 'efficient',           // 'xp' (default) or 'efficient'
  includeRecipes: new Set(['Butter']),
  excludeRecipes: new Set(['MildCheddarCheese']),
  unlockPrereqs: true,
  inventory: new Map([[13101, 50]]),
}, recipes, skills, xpTables);

const runs = groupStepsIntoRuns(plan.steps);
```

### Planner Options

```typescript
{
  targetLevel: number;
  maxCrafts?: number;              // Safety cap (default 10000)
  strategy?: 'xp' | 'efficient';  // Scoring mode (default 'xp')
  itemEffort?: ItemEffortMap;      // Per-item effort overrides
  includeRecipes?: Set<string>;    // Extra recipes to treat as known
  excludeRecipes?: Set<string>;    // Recipes to skip
  unlockPrereqs?: boolean;         // Auto-unlock PrereqRecipe chains
  inventory?: Map<number, number>; // ItemCode -> quantity available
}
```

### Plan Result

```typescript
{
  skill: string;
  startLevel: number;
  endLevel: number;
  targetLevel: number;
  targetReached: boolean;
  steps: CraftStep[];
  totalCrafts: number;
  totalXpGained: number;
  totalEffort: number;
  levelUps: number;
  ingredientTotals: Map<number, IngredientUsage>;
  keywordIngredientTotals: Map<string, IngredientUsage>;
  inventoryRemaining?: Map<number, number>;
}
```

### Strategies

- **xp** (default): Pick the recipe with the highest effective XP per craft.
- **efficient**: Pick the recipe with the highest XP per effort. Effort is the sum of `stackSize * chanceToConsume * itemEffort` across all ingredients. Tools with low `ChanceToConsume` (e.g. 3%) contribute very little effort.

### XP Functions

| Function | Description |
| --- | --- |
| `buildXpTableLookup(rawXpTables)` | Converts raw XP table data into a `Map<string, number[]>` lookup |
| `getXpRequiredForLevel(name, level, lookup)` | XP needed to advance from `level` to `level + 1` |
| `calcRecipeXp(recipe, level, count, mod?)` | Effective XP for a single craft including first-time bonus and drop-off |
| `calcRecipeEffort(recipe, itemEffort?)` | Effort cost per craft |
| `calcDropOffMultiplier(level, dropOff?, rate?, pct?)` | XP drop-off multiplier |

### Ingredient Helpers

| Function | Description |
| --- | --- |
| `buildItemRecipeLookup(recipes)` | Reverse lookup: ItemCode -> recipes that produce it |
| `findRecipesForItem(code, lookup)` | Recipes producing a given item |
| `resolveIngredientTree(code, qty, recipes, lookup?, depth?)` | Recursive ingredient resolution |
| `annotateCraftableIngredients(tree, state, recipes)` | Mark which ingredients are craftable |
| `computeIngredientTotalsFromSteps(steps, recipes, items)` | Aggregate ingredient needs from plan steps |

### Step Grouping

```typescript
import { groupStepsIntoRuns } from 'project-gorgon-data/planner';

const runs = groupStepsIntoRuns(plan.steps);
// CraftRun: { recipeName, internalName, count, firstCrafts, totalXp, levelStart, levelEnd }
```

## Gardening Planner

Simulates concurrent multi-slot gardening with real-time constraints:

```typescript
import { planGardeningSkill, groupActionsIntoPhases } from 'project-gorgon-data/planner';

const plan = planGardeningSkill(state, {
  targetLevel: 30,
  slotGroups: DEFAULT_SLOT_GROUPS,
  timing: DEFAULT_GARDENING_TIMING,
}, skills, xpTables);

const phases = groupActionsIntoPhases(plan.actions);
```

Models plant growth, watering, fertilizer crafting/consumption, strange dirt boosts, and water refill cycles. Returns detailed action logs, harvest runs, seed/fertilizer usage, and XP-per-hour metrics.

## Nature Appreciation Planner

Plans sequential flower uses to level Nature Appreciation:

```typescript
import { planNatureAppreciation, groupFlowerUsesIntoPhases } from 'project-gorgon-data/planner';

const plan = planNatureAppreciation(state, { targetLevel: 30 }, skills, xpTables);
const phases = groupFlowerUsesIntoPhases(plan.steps);
```

Optionally generates a companion gardening plan for growing the needed flowers.

## Helpers

### Item Helpers

```typescript
import { getItemByCode, getItemName } from 'project-gorgon-data/helpers';

const item = getItemByCode(5001, items);  // Look up by numeric ItemCode
const name = getItemName(5001, items);    // "Onion" (falls back to "Item #5001")
```

### Keyword Helpers

```typescript
import { buildKeywordIndex, findItemsByKeyword, findItemsByKeywords } from 'project-gorgon-data/helpers';

const index = buildKeywordIndex(items);
const fruits = findItemsByKeyword('Fruit', index);
const matches = findItemsByKeywords(['Fruit', '!Poison'], index);  // Fruit AND NOT Poison
```

### Recipe Helpers

```typescript
import { resolveRecipe, resolveRecipeIngredients } from 'project-gorgon-data/helpers';

const resolved = resolveRecipe('recipe_1234', recipe, items, keywordIndex);
// ResolvedRecipe: { ingredients: ResolvedIngredient[], results: ResolvedResultItem[] }
```

### Build Helpers

Gear mod filtering, effect parsing, and damage calculation for the build planner:

```typescript
import {
  getAvailablePowers,
  getAvailableTiers,
  parseEffectDesc,
  collectAbilityAttributes,
  calculateAbilityDamage,
  getCombatAbilities,
  encodeBuildToHash,
  decodeBuildFromHash,
} from 'project-gorgon-data/helpers';
```

| Function | Description |
| --- | --- |
| `getAvailablePowers(slot, skill, tsysClientInfo)` | Filter treasure powers by gear slot and skill |
| `getAvailableTiers(power, rarity)` | Get tiers available at a given rarity |
| `parseEffectDesc(desc)` | Parse `{ATTR}{VALUE}{CONTEXT}` format effect descriptions |
| `collectAbilityAttributes(ability, keywords, skills, dots, map?)` | Build attribute buckets for damage scaling |
| `calculateAbilityDamage(ability, attrs, effects, textEffects?)` | Full damage result with DoTs, crit, stats |
| `getCombatAbilities(skill, abilities, maxLevel?)` | Player-facing abilities filtered and grouped by upgrade root |
| `encodeBuildToHash(input)` / `decodeBuildFromHash(hash)` | Serialize builds to shareable URL hashes |

### Skill Effects

Per-skill effect configs for 30+ combat skills (Sword, Fire Magic, Psychology, Bard, etc.):

```typescript
import { resolveSkillEffects, applyResolvedEffects } from 'project-gorgon-data/helpers';

const effects = resolveSkillEffects(powerId, effectDescs, slot);
applyResolvedEffects(damageResult, effects);
```

### Combat Simulator

Simulate ability rotations and compute DPS:

```typescript
import { simulateCombat } from 'project-gorgon-data/helpers';

const result = simulateCombat(config);
// CombatSimResult: per-ability DPS, timeline, enemy results, total damage
```

## Match-3 Engine

Board-based match-3 puzzle game engine with cascading, scoring, and simulation:

```typescript
import {
  generateBoard,
  createIdSource,
  applyMove,
  getAllValidMoves,
  simulateGameSummary,
  seededRng,
} from 'project-gorgon-data/match3';

const board = generateBoard(8, 6, createIdSource(), seededRng(42));
const moves = getAllValidMoves(board, 8);
const result = applyMove(board, moves[0].from, moves[0].to, 6, 8, createIdSource());
```

| Function | Description |
| --- | --- |
| `generateBoard(size, k, idSource, rng?)` | Create a `size x size` board with `k` gem types, no initial matches |
| `findMatches(board, size)` | Find all 3+ tile match groups |
| `applyMove(board, from, to, k, size, idSource, rng?)` | Execute a swap with full cascade resolution |
| `getAllValidMoves(board, size)` | List all legal moves |
| `simulateGameSummary(seed, config, solver, turns)` | Play N turns and return summary stats |
| `simulateGameReplay(seed, config, moves)` | Replay an exact move sequence |
| `reshuffleIfDead(board, size, k, idSource, rng?)` | Reshuffle if no valid moves exist |

## Validation

Validate raw JSON data against Zod schemas:

```typescript
import { validate, validateFile } from 'project-gorgon-data';

const result = validate();         // Validate all data files
const single = validateFile('items');  // Validate a single data file
```

Supported files: abilities, items, recipes, skills, NPCs, areas, effects, quests, and 20+ more.

## Key Types

### CraftStep

```typescript
{
  recipeId: string;
  recipeName: string;
  internalName: string;
  xpGained: number;
  effortCost: number;
  isFirstCraft: boolean;
  skillLevelBefore: number;
  skillLevelAfter: number;
}
```

### IngredientUsage

```typescript
{
  totalCount: number;
  timesUsed: number;
  chanceToConsume: number;
  recipeCount: number;
  usedByRecipes: Set<string>;
}
```

### RecipeSource

```typescript
{
  recipeId: string;
  recipe: Recipe;
  outputStackSize: number;
  percentChance?: number;
}
```

### IngredientNode

```typescript
{
  itemCode: number | null;
  keywords?: string[];
  quantity: number;
  craftableVia: RecipeSource[];
  subIngredients?: IngredientNode[];
}
```

---

## Development

### Setup

```bash
git clone https://github.com/hjarrell/project-gorgon-data.git
cd project_gorgon_data
pnpm install
```

### Commands

| Command | Description |
| --- | --- |
| `pnpm build` | Compile TypeScript (CJS + ESM) |
| `pnpm test` | Run tests (vitest) |
| `pnpm run clean` | Remove dist directories |
| `pnpm run analyze <file>` | Analyze a JSON data file's structure |
| `pnpm run update-files` | Fetch latest game data from CDN |
| `pnpm run diff-data` | Diff local data against previous version |
| `pnpm run update-icons` | Download game icons from CDN |

### CLI Crafting Planner

A CLI wrapper around the crafting planner for local development:

```bash
npx tsx scripts/plan-crafting.ts <character-json> <skill> <target-level> [flags]
```

#### Flags

| Flag | Description |
| --- | --- |
| `--efficient` | Score recipes by XP per effort instead of raw XP |
| `--effort-file <path>` | JSON file mapping ItemCode to effort value (used with `--efficient`) |
| `--include-recipes <path>` | JSON array of recipe InternalNames to treat as known |
| `--exclude-recipes <path>` | JSON array of recipe InternalNames to skip |
| `--inventory <path>` | JSON file mapping ItemCode to quantity available |
| `--unlock-prereqs` | Auto-unlock recipes via PrereqRecipe chains |
| `--verbose` | Show every individual craft step |

#### Examples

```bash
# Level Cooking to 30
npx tsx scripts/plan-crafting.ts src/example/Character_ShepardPiedPiper.json Cooking 30

# Efficient mode with inventory constraints
npx tsx scripts/plan-crafting.ts src/example/Character_ShepardPiedPiper.json Cooking 30 --efficient --inventory inventory.json

# Include extra recipes and auto-unlock prereq chains
npx tsx scripts/plan-crafting.ts src/example/Character_ShepardPiedPiper.json Fletching 30 --include-recipes fletching-recipes.json --unlock-prereqs
```

### Adding a New Schema

See [instructions.md](instructions.md) for the step-by-step workflow for adding Zod schemas to new data files.

### Game Data

Raw JSON data files are sourced from the [Project Gorgon CDN](http://cdn.projectgorgon.com/v458/). Use `pnpm run update-files` to fetch the latest version.

---

Game data copyright 2026 Elder Game, LLC. Used with permission per the [Project Gorgon CDN data policy](http://cdn.projectgorgon.com/v458/).

Library code MIT License, copyright 2026 Hunter Jarrell.
