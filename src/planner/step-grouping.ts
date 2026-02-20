import type { CraftStep } from './crafting-planner';

// ============================================================
// Types
// ============================================================

/** A run of consecutive crafts of the same recipe. */
export interface CraftRun {
  /** Recipe display name */
  recipeName: string;
  /** Recipe InternalName (used for grouping) */
  internalName: string;
  /** Recipe key (e.g., "recipe_1234") */
  recipeId: string;
  /** Number of consecutive crafts in this run */
  count: number;
  /** Number of first-time crafts in this run (0 or 1 typically) */
  firstCrafts: number;
  /** Total XP gained across all crafts in the run */
  totalXp: number;
  /** Total effort cost across all crafts in the run */
  totalEffort: number;
  /** Skill level at the start of this run */
  levelStart: number;
  /** Skill level at the end of this run */
  levelEnd: number;
  /** The original CraftStep objects in this run */
  steps: CraftStep[];
}

// ============================================================
// Grouping Function
// ============================================================

/**
 * Group consecutive crafts of the same recipe into runs.
 *
 * E.g., [Butter, Butter, Butter, Cheese, Cheese, Butter] becomes
 * three runs: Butter x3, Cheese x2, Butter x1.
 */
export function groupStepsIntoRuns(steps: CraftStep[]): CraftRun[] {
  const runs: CraftRun[] = [];

  for (const step of steps) {
    const last = runs[runs.length - 1];
    if (last && last.internalName === step.internalName) {
      last.count++;
      last.totalXp += step.xpGained;
      last.totalEffort += step.effortCost;
      last.levelEnd = step.skillLevelAfter;
      if (step.isFirstCraft) last.firstCrafts++;
      last.steps.push(step);
    } else {
      runs.push({
        recipeName: step.recipeName,
        internalName: step.internalName,
        recipeId: step.recipeId,
        count: 1,
        firstCrafts: step.isFirstCraft ? 1 : 0,
        totalXp: step.xpGained,
        totalEffort: step.effortCost,
        levelStart: step.skillLevelBefore,
        levelEnd: step.skillLevelAfter,
        steps: [step],
      });
    }
  }

  return runs;
}
