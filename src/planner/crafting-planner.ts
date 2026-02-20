import type { Recipe } from '../schemas/recipes';
import type { Skill } from '../schemas/skills';
import type { CharacterState } from '../character-state';
import { calcRecipeXp, calcRecipeEffort, getXpRequiredForLevel } from './xp';
import type { ItemEffortMap } from './xp';

// ============================================================
// Types
// ============================================================

export interface CraftStep {
  /** Recipe key, e.g. "recipe_1" */
  recipeId: string;
  /** Human-readable name, e.g. "Butter" */
  recipeName: string;
  /** Internal name used in RecipeCompletions, e.g. "Butter" */
  internalName: string;
  /** Effective XP gained from this craft */
  xpGained: number;
  /** Effort cost of this craft (ingredient-weighted) */
  effortCost: number;
  /** Whether this was the first time crafting this recipe */
  isFirstCraft: boolean;
  /** Skill level before this craft */
  skillLevelBefore: number;
  /** Skill level after this craft (may be higher if leveled up) */
  skillLevelAfter: number;
}

export interface IngredientUsage {
  /** Total stack quantity across all crafts (e.g. StackSize=2 used 50 times = 100) */
  totalCount: number;
  /** Number of individual craft operations that used this ingredient */
  timesUsed: number;
  /** ChanceToConsume value (1.0 = always consumed, < 1.0 = tool/partial) */
  chanceToConsume: number;
  /** Number of distinct recipes in the plan that use this ingredient */
  recipeCount: number;
  /** InternalNames of recipes that use this ingredient */
  usedByRecipes: Set<string>;
}

export interface PlanResult {
  /** The skill being leveled */
  skill: string;
  /** Level at start of plan */
  startLevel: number;
  /** Level reached at end of plan */
  endLevel: number;
  /** Requested target level */
  targetLevel: number;
  /** Whether the target level was reached */
  targetReached: boolean;
  /** Ordered list of crafts to perform */
  steps: CraftStep[];
  /** Total number of crafts */
  totalCrafts: number;
  /** Total XP gained across all crafts */
  totalXpGained: number;
  /** Total effort cost across all crafts */
  totalEffort: number;
  /** Number of level-ups achieved */
  levelUps: number;
  /** Ingredients consumed across all crafts. Map of ItemCode → usage details. */
  ingredientTotals: Map<number, IngredientUsage>;
  /** Keyword-based ingredients consumed. Map of keyword string → usage details. */
  keywordIngredientTotals: Map<string, IngredientUsage>;
  /** Remaining inventory after all crafts. Only present when inventory was provided. */
  inventoryRemaining?: Map<number, number>;
}

export interface PlannerOptions {
  /** Desired skill level to reach */
  targetLevel: number;
  /** Safety cap on number of crafts (default 10000) */
  maxCrafts?: number;
  /**
   * Scoring strategy.
   * - "xp": pick the recipe with the highest effective XP per craft (default).
   * - "efficient": pick the recipe with the highest XP per effort.
   */
  strategy?: 'xp' | 'efficient';
  /** Per-item effort overrides keyed by ItemCode. Only used with "efficient" strategy. */
  itemEffort?: ItemEffortMap;
  /**
   * Additional recipe InternalNames to treat as known (completion count 0).
   * Useful for recipes the character could learn but hasn't yet.
   * These get first-time bonus XP when crafted.
   */
  includeRecipes?: Set<string>;
  /**
   * Recipe InternalNames to exclude from consideration.
   * These recipes will never be picked by the planner.
   */
  excludeRecipes?: Set<string>;
  /**
   * When true, crafting a recipe automatically unlocks any recipe
   * that lists it as a PrereqRecipe, adding it to the candidate pool
   * mid-simulation. Default false.
   */
  unlockPrereqs?: boolean;
  /**
   * Current inventory of items. Map of ItemCode → quantity available.
   * When provided, the planner only picks recipes whose consumable ingredients
   * are available in inventory, and deducts consumed items after each craft.
   * Recipe ResultItems are added back to inventory (enables crafting chains).
   * Items with ChanceToConsume < 1.0 (tools) must be present but are not deducted.
   */
  inventory?: Map<number, number>;
}

// ============================================================
// Internal: Candidate recipe with its key
// ============================================================

interface RecipeCandidate {
  recipeId: string;
  recipe: Recipe;
}

// ============================================================
// Greedy Crafting Planner
// ============================================================

/**
 * Plan a greedy sequence of crafts to level a single skill as fast as possible.
 *
 * The planner picks the recipe yielding the highest effective XP at each step,
 * simulating level-ups and first-time bonuses as they are consumed.
 *
 * @param characterState - The character's current state (skills, recipe completions, stats)
 * @param targetSkill    - The skill to level (must match recipe RewardSkill values)
 * @param options        - Target level and optional safety cap
 * @param allRecipes     - All game recipes (from data/index.ts)
 * @param allSkills      - All game skills (from data/index.ts)
 * @param xpTableLookup  - Map of XP table InternalName → XpAmounts (from buildXpTableLookup)
 */
export function planCraftingSkill(
  characterState: CharacterState,
  targetSkill: string,
  options: PlannerOptions,
  allRecipes: Map<string, Recipe>,
  allSkills: Map<string, Skill>,
  xpTableLookup: Map<string, number[]>,
): PlanResult {
  const maxCrafts = options.maxCrafts ?? 10000;

  // --- Resolve skill info ---
  const skillDef = allSkills.get(targetSkill);
  if (!skillDef) {
    throw new Error(`Unknown skill: "${targetSkill}"`);
  }
  const xpTableName = skillDef.XpTable;

  const skillEntry = characterState.skills.get(targetSkill);
  if (!skillEntry) {
    throw new Error(
      `Character has no data for skill "${targetSkill}". ` +
        `Available skills: ${[...characterState.skills.keys()].join(', ')}`,
    );
  }

  // --- Mutable simulation state ---
  let currentLevel = skillEntry.Level;
  let currentXp = skillEntry.XpTowardNextLevel;
  let xpNeeded = getXpRequiredForLevel(xpTableName, currentLevel, xpTableLookup);

  // Clone recipe completions so we can mutate during simulation
  const completions = new Map(characterState.recipeCompletions);

  // Seed includeRecipes into completions with count 0 (unknown but available)
  if (options.includeRecipes) {
    for (const name of options.includeRecipes) {
      if (!completions.has(name)) {
        completions.set(name, 0);
      }
    }
  }

  // Also track mutable skill levels for prerequisite checking (Skill != RewardSkill cases)
  const skillLevels = new Map<string, number>();
  for (const [name, entry] of characterState.skills) {
    skillLevels.set(name, entry.Level);
  }

  // Crafting XP modifier from character stats
  const craftingXpMod = characterState.currentStats.get('CRAFTING_XP_EARNED_MOD') ?? 1.0;

  // Clone inventory for mutable simulation (if provided)
  const hasInventory = options.inventory != null;
  const inventory = hasInventory ? new Map(options.inventory!) : null;

  // --- Build prereq unlock index (InternalName → recipes that require it) ---
  const prereqUnlocks = new Map<string, RecipeCandidate[]>();
  if (options.unlockPrereqs) {
    for (const [recipeId, recipe] of allRecipes) {
      if (recipe.RewardSkill !== targetSkill) continue;
      if (!recipe.PrereqRecipe) continue;
      let list = prereqUnlocks.get(recipe.PrereqRecipe);
      if (!list) {
        list = [];
        prereqUnlocks.set(recipe.PrereqRecipe, list);
      }
      list.push({ recipeId, recipe });
    }
  }

  // --- Track which InternalNames are already in the candidate pool ---
  const candidateSet = new Set<string>();

  // --- Gather candidate recipes that reward XP in targetSkill ---
  const excludeRecipes = options.excludeRecipes;
  const candidates: RecipeCandidate[] = [];
  for (const [recipeId, recipe] of allRecipes) {
    if (recipe.RewardSkill !== targetSkill) continue;
    // Character must know this recipe (InternalName in completions, which includes includeRecipes)
    if (!completions.has(recipe.InternalName)) continue;
    if (excludeRecipes?.has(recipe.InternalName)) continue;
    candidates.push({ recipeId, recipe });
    candidateSet.add(recipe.InternalName);
  }

  // --- Strategy config ---
  const strategy = options.strategy ?? 'xp';
  const itemEffort = options.itemEffort;

  // --- Greedy simulation ---
  const startLevel = currentLevel;
  const steps: CraftStep[] = [];
  let totalXpGained = 0;
  let totalEffort = 0;
  const ingredientTotals = new Map<number, IngredientUsage>();
  const keywordIngredientTotals = new Map<string, IngredientUsage>();

  while (currentLevel < options.targetLevel && steps.length < maxCrafts) {
    // Find the best recipe to craft right now
    let bestCandidate: RecipeCandidate | null = null;
    let bestXp = 0;
    let bestScore = 0;

    for (const candidate of candidates) {
      const { recipe } = candidate;

      // Check skill level requirement (against the recipe's Skill, not RewardSkill)
      const reqSkill = recipe.Skill;
      const reqLevel = recipe.SkillLevelReq;
      const playerLevel = reqSkill === targetSkill
        ? currentLevel
        : (skillLevels.get(reqSkill) ?? 0);
      if (playerLevel < reqLevel) continue;

      // Check MaxUses
      const count = completions.get(recipe.InternalName) ?? 0;
      if (recipe.MaxUses != null && count >= recipe.MaxUses) continue;

      // Check inventory availability (if inventory tracking is active)
      if (inventory) {
        let hasIngredients = true;
        for (const ingredient of recipe.Ingredients) {
          if (ingredient.ItemCode == null) continue; // keyword ingredients skip inventory check
          const available = inventory.get(ingredient.ItemCode) ?? 0;
          const chance = ingredient.ChanceToConsume ?? 1.0;
          if (chance === 1.0) {
            // Consumable: need at least StackSize
            if (available < ingredient.StackSize) { hasIngredients = false; break; }
          } else {
            // Tool: need at least 1 present
            if (available < 1) { hasIngredients = false; break; }
          }
        }
        if (!hasIngredients) continue;
      }

      // Calculate effective XP
      const xp = calcRecipeXp(recipe, currentLevel, count, craftingXpMod);
      if (xp <= 0) continue;

      // Score based on strategy
      let score: number;
      if (strategy === 'efficient') {
        const effort = calcRecipeEffort(recipe, itemEffort);
        score = effort > 0 ? xp / effort : xp;
      } else {
        score = xp;
      }

      if (score > bestScore) {
        bestScore = score;
        bestXp = xp;
        bestCandidate = candidate;
      }
    }

    // No recipe can give XP — we're stuck
    if (!bestCandidate || bestXp <= 0) break;

    const { recipeId, recipe } = bestCandidate;
    const count = completions.get(recipe.InternalName) ?? 0;
    const isFirstCraft = count === 0;
    const levelBefore = currentLevel;
    const effort = calcRecipeEffort(recipe, itemEffort);

    // Accumulate ingredient consumption
    for (const ingredient of recipe.Ingredients) {
      const chance = ingredient.ChanceToConsume ?? 1.0;
      if (ingredient.ItemCode != null) {
        const existing = ingredientTotals.get(ingredient.ItemCode);
        if (existing) {
          existing.totalCount += ingredient.StackSize;
          existing.timesUsed++;
          existing.chanceToConsume = Math.min(existing.chanceToConsume, chance);
          existing.usedByRecipes.add(recipe.InternalName);
          existing.recipeCount = existing.usedByRecipes.size;
        } else {
          ingredientTotals.set(ingredient.ItemCode, {
            totalCount: ingredient.StackSize,
            timesUsed: 1,
            chanceToConsume: chance,
            recipeCount: 1,
            usedByRecipes: new Set([recipe.InternalName]),
          });
        }
      } else if (ingredient.ItemKeys) {
        const key = ingredient.ItemKeys.join('+');
        const existing = keywordIngredientTotals.get(key);
        if (existing) {
          existing.totalCount += ingredient.StackSize;
          existing.timesUsed++;
          existing.chanceToConsume = Math.min(existing.chanceToConsume, chance);
          existing.usedByRecipes.add(recipe.InternalName);
          existing.recipeCount = existing.usedByRecipes.size;
        } else {
          keywordIngredientTotals.set(key, {
            totalCount: ingredient.StackSize,
            timesUsed: 1,
            chanceToConsume: chance,
            recipeCount: 1,
            usedByRecipes: new Set([recipe.InternalName]),
          });
        }
      }
    }

    // Deduct consumed ingredients and add results to inventory
    if (inventory) {
      for (const ingredient of recipe.Ingredients) {
        if (ingredient.ItemCode == null) continue;
        const chance = ingredient.ChanceToConsume ?? 1.0;
        if (chance === 1.0) {
          const cur = inventory.get(ingredient.ItemCode) ?? 0;
          inventory.set(ingredient.ItemCode, cur - ingredient.StackSize);
        }
        // Tools (chance < 1.0) are not deducted — they survive
      }
      // Add ResultItems back to inventory
      for (const result of recipe.ResultItems) {
        const cur = inventory.get(result.ItemCode) ?? 0;
        inventory.set(result.ItemCode, cur + result.StackSize);
      }
    }

    // Apply XP
    currentXp += bestXp;
    totalXpGained += bestXp;
    totalEffort += effort;

    // Update completion count
    completions.set(recipe.InternalName, count + 1);

    // Unlock recipes that have this recipe as a PrereqRecipe
    if (options.unlockPrereqs) {
      const unlocked = prereqUnlocks.get(recipe.InternalName);
      if (unlocked) {
        for (const candidate of unlocked) {
          if (!candidateSet.has(candidate.recipe.InternalName) &&
              !excludeRecipes?.has(candidate.recipe.InternalName)) {
            candidates.push(candidate);
            candidateSet.add(candidate.recipe.InternalName);
            // Seed completion count so it's eligible (first craft = 0)
            if (!completions.has(candidate.recipe.InternalName)) {
              completions.set(candidate.recipe.InternalName, 0);
            }
          }
        }
      }
    }

    // Handle level-ups (may cascade)
    while (xpNeeded > 0 && currentXp >= xpNeeded) {
      currentXp -= xpNeeded;
      currentLevel++;
      // Update the skill level tracking map for cross-skill req checks
      skillLevels.set(targetSkill, currentLevel);
      xpNeeded = getXpRequiredForLevel(xpTableName, currentLevel, xpTableLookup);
    }

    steps.push({
      recipeId,
      recipeName: recipe.Name,
      internalName: recipe.InternalName,
      xpGained: bestXp,
      effortCost: effort,
      isFirstCraft,
      skillLevelBefore: levelBefore,
      skillLevelAfter: currentLevel,
    });
  }

  return {
    skill: targetSkill,
    startLevel,
    endLevel: currentLevel,
    targetLevel: options.targetLevel,
    targetReached: currentLevel >= options.targetLevel,
    steps,
    totalCrafts: steps.length,
    totalXpGained,
    totalEffort,
    levelUps: currentLevel - startLevel,
    ingredientTotals,
    keywordIngredientTotals,
    ...(inventory ? { inventoryRemaining: inventory } : {}),
  };
}
