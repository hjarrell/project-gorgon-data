# Project Gorgon Data

Helper library for parsing and handling the data from Project Gorgon.

## Crafting Planner

Greedy crafting skill leveling planner. Takes a character export and simulates the fastest path to a target skill level by picking the best recipe at each step.

### Usage

```bash
npx tsx scripts/plan-crafting.ts <character-json> <skill> <target-level> [flags]
```

### Flags

| Flag | Description |
| --- | --- |
| `--efficient` | Score recipes by XP per effort instead of raw XP. Prefers cheap recipes over expensive ones. |
| `--effort-file <path>` | JSON file mapping ItemCode (number) to effort value. Items not listed default to 1.0. Only used with `--efficient`. |
| `--include-recipes <path>` | JSON file with an array of recipe InternalNames to treat as known. Useful for recipes the character could learn but hasn't yet. These get first-time bonus XP. |
| `--exclude-recipes <path>` | JSON file with an array of recipe InternalNames to exclude from the plan. These recipes will never be picked. |
| `--inventory <path>` | JSON file mapping ItemCode (number) to quantity available. Constrains crafting to items on hand. |
| `--unlock-prereqs` | Automatically unlock recipes via PrereqRecipe chains during simulation. When a recipe is crafted, any recipe that lists it as a prerequisite becomes available. |
| `--verbose` | Show every individual craft step instead of just the grouped summary. |

### Examples

```bash
# Basic: level Cooking to 30
npx tsx scripts/plan-crafting.ts src/example/Character_ShepardPiedPiper.json Cooking 30

# Efficient mode: minimize ingredient cost
npx tsx scripts/plan-crafting.ts src/example/Character_ShepardPiedPiper.json Cooking 30 --efficient

# Include extra recipes and auto-unlock prereq chains
npx tsx scripts/plan-crafting.ts src/example/Character_ShepardPiedPiper.json Fletching 30 --include-recipes fletching-recipes.json --unlock-prereqs

# Constrain to current inventory
npx tsx scripts/plan-crafting.ts src/example/Character_ShepardPiedPiper.json Cooking 30 --inventory inventory.json

# Everything: efficient + effort file + verbose
npx tsx scripts/plan-crafting.ts src/example/Character_ShepardPiedPiper.json Blacksmithing 20 --efficient --effort-file effort.json --verbose
```

### Output

The planner prints:

- Summary stats (start/end level, total crafts, XP, effort)
- Grouped recipe table (consecutive crafts of the same recipe collapsed into runs)
- Ingredients needed (total counts, consume chance, number of recipes using each item, and craftability info)
- Inventory changes (when `--inventory` is used): shows before/after counts and net change per item

### Strategies

- **xp** (default): Pick the recipe with the highest effective XP per craft.
- **efficient**: Pick the recipe with the highest XP per effort. Effort is the sum of `stackSize * chanceToConsume * itemEffort` across all ingredients. Tools with low `ChanceToConsume` (e.g. 3%) contribute very little effort.

### Effort File Format

```json
{
  "13101": 1.0,
  "22551": 10.0,
  "5011": 3.5
}
```

Keys are ItemCode numbers (as strings). Values are effort multipliers. Any item not listed defaults to 1.0.

### Include Recipes File Format

```json
["ArrowShaft1", "Arrow1", "BarbedArrow1", "LongArrow1"]
```

Array of recipe InternalNames. These are added to the character's known recipes with 0 completions, so they get first-time bonus XP when crafted.

### Inventory File Format

```json
{
  "13101": 50,
  "5001": 200,
  "5011": 30
}
```

Keys are ItemCode numbers (as strings). Values are quantities available. When provided, the planner only crafts recipes whose consumable ingredients are in stock, deducts consumed items after each craft, and adds recipe ResultItems back to inventory. Tools (ChanceToConsume < 1.0) must be present but are not deducted.

### Exclude Recipes File Format

```json
["Butter", "MildCheddarCheese"]
```

Array of recipe InternalNames. These recipes are skipped entirely by the planner.

## API

The library exports everything from `project-gorgon-data`. Import what you need:

```typescript
import { planCraftingSkill, buildXpTableLookup, buildItemRecipeLookup } from 'project-gorgon-data';
```

### Data

| Export | Type | Description |
| --- | --- | --- |
| `recipes` | `Map<string, Recipe>` | All game recipes keyed by `recipe_<id>`. |
| `items` | `Map<string, Item>` | All game items keyed by `item_<id>`. |
| `skills` | `Map<string, Skill>` | All game skills keyed by skill name. |
| `RAW_XP_TABLES` | `Record<string, ...>` | Raw XP table data. Pass to `buildXpTableLookup()`. |

### Planner Functions

#### `planCraftingSkill(characterState, targetSkill, options, allRecipes, allSkills, xpTableLookup): PlanResult`

Greedy simulation that picks the best recipe at each step to level a skill. Simulates XP gain, level-ups, first-time bonuses, and recipe completions.

#### `buildXpTableLookup(rawXpTables): Map<string, number[]>`

Converts raw XP table data into a lookup map. Index 0 = XP for level 0 to 1.

#### `getXpRequiredForLevel(xpTableName, level, lookup): number`

Returns XP needed to advance from `level` to `level + 1`. Returns 0 at max level.

#### `calcRecipeXp(recipe, skillLevel, completionCount, craftingXpMod?): number`

Calculates effective XP for a single craft. Uses `RewardSkillXpFirstTime` on first craft, applies drop-off multiplier on subsequent crafts.

#### `calcRecipeEffort(recipe, itemEffort?): number`

Calculates effort cost: `sum(stackSize * chanceToConsume * itemEffort)` per ingredient.

#### `calcDropOffMultiplier(skillLevel, dropOffLevel?, dropOffRate?, dropOffPct?): number`

XP drop-off multiplier: `max(dropOffPct, 0.5 ^ (levelsAbove / dropOffRate))`. Returns 1.0 when no drop-off fields are set.

#### `buildItemRecipeLookup(allRecipes): Map<number, RecipeSource[]>`

Reverse lookup: ItemCode to recipes whose `ResultItems` produce it.

#### `findRecipesForItem(itemCode, lookup): RecipeSource[]`

Returns all recipes that produce a given ItemCode.

#### `resolveIngredientTree(itemCode, quantity, allRecipes, lookup?, maxDepth?): IngredientNode`

Resolves what ingredients are needed to craft an item, recursing up to `maxDepth` levels (default 1).

### Types

#### `PlannerOptions`

```typescript
{
  targetLevel: number;
  maxCrafts?: number;           // Safety cap (default 10000)
  strategy?: 'xp' | 'efficient'; // Scoring mode (default 'xp')
  itemEffort?: ItemEffortMap;   // Per-item effort overrides
  includeRecipes?: Set<string>; // Extra recipes to treat as known
  excludeRecipes?: Set<string>; // Recipes to skip
  unlockPrereqs?: boolean;      // Auto-unlock PrereqRecipe chains
  inventory?: Map<number, number>; // ItemCode → quantity available
}
```

#### `PlanResult`

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

#### `CraftStep`

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

#### `IngredientUsage`

```typescript
{
  totalCount: number;      // Total stack quantity across all crafts
  timesUsed: number;       // Number of craft operations using this ingredient
  chanceToConsume: number;  // Min ChanceToConsume across recipes (1.0 = always consumed)
  recipeCount: number;     // Distinct recipes using this ingredient
  usedByRecipes: Set<string>;
}
```

#### `RecipeSource`

```typescript
{
  recipeId: string;
  recipe: Recipe;
  outputStackSize: number;
  percentChance?: number;
}
```

#### `IngredientNode`

```typescript
{
  itemCode: number | null;
  keywords?: string[];
  quantity: number;
  craftableVia: RecipeSource[];
  subIngredients?: IngredientNode[];
}
```

#### `ItemEffortMap`

```typescript
type ItemEffortMap = Map<number, number>; // ItemCode → effort multiplier
```

### Character State

#### `CharacterState`

```typescript
const state = new CharacterState();
state.loadCharacterSheet(jsonData);

state.characterName;       // string
state.skills;              // Map<string, { Level, XpTowardNextLevel }>
state.recipeCompletions;   // Map<string, number> (InternalName → times crafted)
state.currentStats;        // Map<string, number> (e.g. 'CRAFTING_XP_EARNED_MOD')
```

### Validation

#### `validate(dataType, data): ValidationResult`

Validates raw JSON data against the schema for a given data type.

#### `validateFile(filePath): ValidationResult`

Validates a JSON file, inferring the data type from the filename.

___

Some portions copyright 2026 Elder Game, LLC.
