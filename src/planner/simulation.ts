import type { Recipe } from '../schemas/recipes';
import type { Skill } from '../schemas/skills';
import type { CharacterState } from '../character-state';
import { calcRecipeXp, calcRecipeEffort, getXpRequiredForLevel } from './xp';
import type { ItemEffortMap } from './xp';
import { xpScorer, efficientScorer } from './scorers';
import type { RecipeScorer } from './scorers';
import type { CraftStep, IngredientUsage, PlanResult, PlannerOptions } from './crafting-planner';

// ============================================================
// Types
// ============================================================

export interface RecipeCandidate {
  recipeId: string;
  recipe: Recipe;
}

export interface CandidateScore {
  xp: number;
  effort: number;
  score: number;
}

export interface BestCandidate {
  candidate: RecipeCandidate;
  xp: number;
  effort: number;
}

export interface SimulationState {
  // --- Config (set once during init) ---
  targetSkill: string;
  xpTableName: string;
  xpTableLookup: Map<string, number[]>;
  craftingXpMod: number;
  unlockPrereqs: boolean;
  excludeRecipes: Set<string> | undefined;
  itemEffort: ItemEffortMap | undefined;
  prereqUnlocks: Map<string, RecipeCandidate[]>;
  targetLevel: number;
  maxCrafts: number;
  scorer: RecipeScorer;

  // --- Mutable simulation state ---
  currentLevel: number;
  currentXp: number;
  xpNeeded: number;
  completions: Map<string, number>;
  skillLevels: Map<string, number>;
  inventory: Map<number, number> | null;
  candidates: RecipeCandidate[];
  candidateSet: Set<string>;

  // --- Accumulation ---
  startLevel: number;
  steps: CraftStep[];
  totalXpGained: number;
  totalEffort: number;
  ingredientTotals: Map<number, IngredientUsage>;
  keywordIngredientTotals: Map<string, IngredientUsage>;
}

// ============================================================
// Initialization
// ============================================================

/**
 * Create a SimulationState from character data and planner options.
 * The returned state is ready to be stepped through with `stepSimulation`.
 */
export function initSimulation(
  characterState: CharacterState,
  targetSkill: string,
  options: PlannerOptions,
  allRecipes: Map<string, Recipe>,
  allSkills: Map<string, Skill>,
  xpTableLookup: Map<string, number[]>,
): SimulationState {
  // Resolve skill info
  const skillDef = allSkills.get(targetSkill);
  if (!skillDef) {
    throw new Error(`Unknown skill: "${targetSkill}"`);
  }
  const xpTableName = skillDef.XpTable;

  const skillEntry = characterState.skills.get(targetSkill) ?? {
    Level: 0,
    BonusLevels: 0,
    XpTowardNextLevel: 0,
    XpNeededForNextLevel: 0,
  };

  // Mutable simulation state
  const currentLevel = skillEntry.Level;
  const currentXp = skillEntry.XpTowardNextLevel;
  const xpNeeded = getXpRequiredForLevel(xpTableName, currentLevel, xpTableLookup);

  // Clone recipe completions
  const completions = new Map(characterState.recipeCompletions);
  if (options.includeRecipes) {
    for (const name of options.includeRecipes) {
      if (!completions.has(name)) {
        completions.set(name, 0);
      }
    }
  }

  // Track mutable skill levels for cross-skill prerequisite checking
  const skillLevels = new Map<string, number>();
  for (const [name, entry] of characterState.skills) {
    skillLevels.set(name, entry.Level);
  }

  const craftingXpMod = characterState.currentStats.get('CRAFTING_XP_EARNED_MOD') ?? 1.0;

  // Clone inventory if provided
  const inventory = options.inventory != null ? new Map(options.inventory) : null;

  // Build prereq unlock index
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

  // Gather candidate recipes
  const excludeRecipes = options.excludeRecipes;
  const candidates: RecipeCandidate[] = [];
  const candidateSet = new Set<string>();
  for (const [recipeId, recipe] of allRecipes) {
    if (recipe.RewardSkill !== targetSkill) continue;
    if (!completions.has(recipe.InternalName)) continue;
    if (excludeRecipes?.has(recipe.InternalName)) continue;
    candidates.push({ recipeId, recipe });
    candidateSet.add(recipe.InternalName);
  }

  // Resolve scorer
  const scorer = options.scorer
    ?? (options.strategy === 'efficient' ? efficientScorer : xpScorer);

  return {
    targetSkill,
    xpTableName,
    xpTableLookup,
    craftingXpMod,
    unlockPrereqs: options.unlockPrereqs ?? false,
    excludeRecipes,
    itemEffort: options.itemEffort,
    prereqUnlocks,
    targetLevel: options.targetLevel,
    maxCrafts: options.maxCrafts ?? 10000,
    scorer,
    currentLevel,
    currentXp,
    xpNeeded,
    completions,
    skillLevels,
    inventory,
    candidates,
    candidateSet,
    startLevel: currentLevel,
    steps: [],
    totalXpGained: 0,
    totalEffort: 0,
    ingredientTotals: new Map(),
    keywordIngredientTotals: new Map(),
  };
}

// ============================================================
// Eligibility Check
// ============================================================

/**
 * Check whether a recipe can be crafted given the current simulation state.
 * Checks skill level requirement, MaxUses, and inventory availability.
 */
export function canCraftRecipe(recipe: Recipe, state: SimulationState): boolean {
  // Check skill level requirement
  const reqSkill = recipe.Skill;
  const reqLevel = recipe.SkillLevelReq;
  const playerLevel = reqSkill === state.targetSkill
    ? state.currentLevel
    : (state.skillLevels.get(reqSkill) ?? 0);
  if (playerLevel < reqLevel) return false;

  // Check MaxUses
  const count = state.completions.get(recipe.InternalName) ?? 0;
  if (recipe.MaxUses != null && count >= recipe.MaxUses) return false;

  // Check inventory availability
  if (state.inventory) {
    for (const ingredient of recipe.Ingredients) {
      if (ingredient.ItemCode == null) continue;
      const available = state.inventory.get(ingredient.ItemCode) ?? 0;
      const chance = ingredient.ChanceToConsume ?? 1.0;
      if (chance === 1.0) {
        if (available < ingredient.StackSize) return false;
      } else {
        if (available < 1) return false;
      }
    }
  }

  return true;
}

// ============================================================
// Scoring
// ============================================================

/**
 * Score a candidate recipe. Returns null if the recipe is ineligible or gives 0 XP.
 */
export function scoreCandidate(
  candidate: RecipeCandidate,
  state: SimulationState,
  scorer?: RecipeScorer,
): CandidateScore | null {
  if (!canCraftRecipe(candidate.recipe, state)) return null;

  const count = state.completions.get(candidate.recipe.InternalName) ?? 0;
  const xp = calcRecipeXp(candidate.recipe, state.currentLevel, count, state.craftingXpMod);
  if (xp <= 0) return null;

  const effort = calcRecipeEffort(candidate.recipe, state.itemEffort);
  const score = (scorer ?? state.scorer)(candidate.recipe, xp, effort);

  return { xp, effort, score };
}

/**
 * Find the best candidate recipe to craft given the current simulation state.
 * Returns null if no recipe can give XP.
 */
export function findBestCandidate(
  state: SimulationState,
  scorer?: RecipeScorer,
): BestCandidate | null {
  let best: BestCandidate | null = null;
  let bestScore = 0;

  for (const candidate of state.candidates) {
    const result = scoreCandidate(candidate, state, scorer);
    if (!result) continue;

    if (result.score > bestScore) {
      bestScore = result.score;
      best = { candidate, xp: result.xp, effort: result.effort };
    }
  }

  return best;
}

// ============================================================
// Apply Craft
// ============================================================

/**
 * Apply a single craft to the simulation state.
 * Mutates state: ingredients, inventory, XP, level-ups, completions, prereq unlocks.
 * Returns the CraftStep that was performed.
 */
export function applyCraft(
  state: SimulationState,
  candidate: RecipeCandidate,
  xp: number,
): CraftStep {
  const { recipe } = candidate;
  const count = state.completions.get(recipe.InternalName) ?? 0;
  const isFirstCraft = count === 0;
  const levelBefore = state.currentLevel;
  const effort = calcRecipeEffort(recipe, state.itemEffort);

  // Accumulate ingredient consumption
  for (const ingredient of recipe.Ingredients) {
    const chance = ingredient.ChanceToConsume ?? 1.0;
    if (ingredient.ItemCode != null) {
      const existing = state.ingredientTotals.get(ingredient.ItemCode);
      if (existing) {
        existing.totalCount += ingredient.StackSize;
        existing.timesUsed++;
        existing.chanceToConsume = Math.min(existing.chanceToConsume, chance);
        existing.usedByRecipes.add(recipe.InternalName);
        existing.recipeCount = existing.usedByRecipes.size;
      } else {
        state.ingredientTotals.set(ingredient.ItemCode, {
          totalCount: ingredient.StackSize,
          timesUsed: 1,
          chanceToConsume: chance,
          recipeCount: 1,
          usedByRecipes: new Set([recipe.InternalName]),
        });
      }
    } else if (ingredient.ItemKeys) {
      const key = ingredient.ItemKeys.join('+');
      const existing = state.keywordIngredientTotals.get(key);
      if (existing) {
        existing.totalCount += ingredient.StackSize;
        existing.timesUsed++;
        existing.chanceToConsume = Math.min(existing.chanceToConsume, chance);
        existing.usedByRecipes.add(recipe.InternalName);
        existing.recipeCount = existing.usedByRecipes.size;
      } else {
        state.keywordIngredientTotals.set(key, {
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
  if (state.inventory) {
    for (const ingredient of recipe.Ingredients) {
      if (ingredient.ItemCode == null) continue;
      const chance = ingredient.ChanceToConsume ?? 1.0;
      if (chance === 1.0) {
        const cur = state.inventory.get(ingredient.ItemCode) ?? 0;
        state.inventory.set(ingredient.ItemCode, cur - ingredient.StackSize);
      }
    }
    for (const result of recipe.ResultItems) {
      const cur = state.inventory.get(result.ItemCode) ?? 0;
      state.inventory.set(result.ItemCode, cur + result.StackSize);
    }
  }

  // Apply XP
  state.currentXp += xp;
  state.totalXpGained += xp;
  state.totalEffort += effort;

  // Update completion count
  state.completions.set(recipe.InternalName, count + 1);

  // Unlock prereq recipes
  if (state.unlockPrereqs) {
    const unlocked = state.prereqUnlocks.get(recipe.InternalName);
    if (unlocked) {
      for (const unlockCandidate of unlocked) {
        if (!state.candidateSet.has(unlockCandidate.recipe.InternalName) &&
            !state.excludeRecipes?.has(unlockCandidate.recipe.InternalName)) {
          state.candidates.push(unlockCandidate);
          state.candidateSet.add(unlockCandidate.recipe.InternalName);
          if (!state.completions.has(unlockCandidate.recipe.InternalName)) {
            state.completions.set(unlockCandidate.recipe.InternalName, 0);
          }
        }
      }
    }
  }

  // Handle level-ups (may cascade)
  while (state.xpNeeded > 0 && state.currentXp >= state.xpNeeded) {
    state.currentXp -= state.xpNeeded;
    state.currentLevel++;
    state.skillLevels.set(state.targetSkill, state.currentLevel);
    state.xpNeeded = getXpRequiredForLevel(state.xpTableName, state.currentLevel, state.xpTableLookup);
  }

  const step: CraftStep = {
    recipeId: candidate.recipeId,
    recipeName: recipe.Name,
    internalName: recipe.InternalName,
    xpGained: xp,
    effortCost: effort,
    isFirstCraft,
    skillLevelBefore: levelBefore,
    skillLevelAfter: state.currentLevel,
  };

  state.steps.push(step);
  return step;
}

// ============================================================
// Step & Done
// ============================================================

/**
 * Run a single simulation step: find the best recipe and craft it.
 * Returns the CraftStep, or null if no recipe can give XP (simulation is stuck).
 */
export function stepSimulation(
  state: SimulationState,
  scorer?: RecipeScorer,
): CraftStep | null {
  const best = findBestCandidate(state, scorer);
  if (!best) return null;
  return applyCraft(state, best.candidate, best.xp);
}

/**
 * Check whether the simulation has reached its stopping condition.
 */
export function isSimulationDone(state: SimulationState): boolean {
  return state.currentLevel >= state.targetLevel || state.steps.length >= state.maxCrafts;
}

// ============================================================
// Result
// ============================================================

/**
 * Build the final PlanResult from the simulation state.
 */
export function buildPlanResult(state: SimulationState): PlanResult {
  return {
    skill: state.targetSkill,
    startLevel: state.startLevel,
    endLevel: state.currentLevel,
    targetLevel: state.targetLevel,
    targetReached: state.currentLevel >= state.targetLevel,
    steps: state.steps,
    totalCrafts: state.steps.length,
    totalXpGained: state.totalXpGained,
    totalEffort: state.totalEffort,
    levelUps: state.currentLevel - state.startLevel,
    ingredientTotals: state.ingredientTotals,
    keywordIngredientTotals: state.keywordIngredientTotals,
    ...(state.inventory ? { inventoryRemaining: state.inventory } : {}),
  };
}
