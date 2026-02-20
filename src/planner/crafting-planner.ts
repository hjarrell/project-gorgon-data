import type { Recipe } from '../schemas/recipes';
import type { Skill } from '../schemas/skills';
import type { CharacterState } from '../character-state';
import { calcRecipeXp, getXpRequiredForLevel } from './xp';

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
  /** Whether this was the first time crafting this recipe */
  isFirstCraft: boolean;
  /** Skill level before this craft */
  skillLevelBefore: number;
  /** Skill level after this craft (may be higher if leveled up) */
  skillLevelAfter: number;
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
  /** Number of level-ups achieved */
  levelUps: number;
}

export interface PlannerOptions {
  /** Desired skill level to reach */
  targetLevel: number;
  /** Safety cap on number of crafts (default 10000) */
  maxCrafts?: number;
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

  // Also track mutable skill levels for prerequisite checking (Skill != RewardSkill cases)
  const skillLevels = new Map<string, number>();
  for (const [name, entry] of characterState.skills) {
    skillLevels.set(name, entry.Level);
  }

  // Crafting XP modifier from character stats
  const craftingXpMod = characterState.currentStats.get('CRAFTING_XP_EARNED_MOD') ?? 1.0;

  // --- Gather candidate recipes that reward XP in targetSkill ---
  const candidates: RecipeCandidate[] = [];
  for (const [recipeId, recipe] of allRecipes) {
    if (recipe.RewardSkill !== targetSkill) continue;
    // Character must know this recipe (InternalName in RecipeCompletions)
    if (!completions.has(recipe.InternalName)) continue;
    candidates.push({ recipeId, recipe });
  }

  // --- Greedy simulation ---
  const startLevel = currentLevel;
  const steps: CraftStep[] = [];
  let totalXpGained = 0;

  while (currentLevel < options.targetLevel && steps.length < maxCrafts) {
    // Find the best recipe to craft right now
    let bestCandidate: RecipeCandidate | null = null;
    let bestXp = 0;

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

      // Calculate effective XP
      const xp = calcRecipeXp(recipe, currentLevel, count, craftingXpMod);
      if (xp > bestXp) {
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

    // Apply XP
    currentXp += bestXp;
    totalXpGained += bestXp;

    // Update completion count
    completions.set(recipe.InternalName, count + 1);

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
    levelUps: currentLevel - startLevel,
  };
}
