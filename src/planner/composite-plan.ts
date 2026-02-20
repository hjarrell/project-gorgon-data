import type { CraftStep, IngredientUsage, PlanResult, QuantityPlanResult } from './crafting-planner';

// ============================================================
// Types
// ============================================================

export interface SubCraftPlan {
  /** Which ingredient item this sub-plan produces */
  targetItemCode: number;
  /** The sub-plan result */
  result: QuantityPlanResult;
}

export interface CompositePlanResult {
  /** The primary skill and its PlanResult */
  mainPlan: PlanResult;
  /** Sub-craft plans, keyed by target item code */
  subCraftPlans: Map<number, SubCraftPlan>;
  /** All steps in execution order (sub-crafts first, then main plan) */
  allSteps: CraftStep[];
  /** Merged ingredient totals across all plans.
   *  Items produced by a sub-craft are removed from the main plan's needs,
   *  and the sub-craft's own ingredient needs are added. */
  netIngredientTotals: Map<number, IngredientUsage>;
  /** Merged keyword ingredient totals across all plans. */
  netKeywordIngredientTotals: Map<string, IngredientUsage>;
}

// ============================================================
// Composite Plan Builder
// ============================================================

/**
 * Compose a main plan with sub-craft plans into a unified result.
 *
 * Sub-craft steps appear before the main plan steps. Ingredient totals
 * are merged: items produced by sub-crafts are subtracted from the main
 * plan's needs, and the sub-crafts' own ingredient needs are added.
 */
export function buildCompositePlan(
  mainPlan: PlanResult,
  subCraftPlans: Map<number, SubCraftPlan>,
): CompositePlanResult {
  // Build allSteps: sub-craft steps first, then main plan steps
  const allSteps: CraftStep[] = [];

  // Tag main plan steps with the main skill if not already tagged
  const mainSteps = mainPlan.steps.map((s) => ({
    ...s,
    skill: s.skill ?? mainPlan.skill,
  }));

  // Add sub-craft steps in insertion order
  for (const [, subPlan] of subCraftPlans) {
    allSteps.push(...subPlan.result.steps);
  }

  // Add main plan steps
  allSteps.push(...mainSteps);

  // Compute net ingredient totals
  const netIngredientTotals = mergeIngredientTotals(mainPlan, subCraftPlans);
  const netKeywordIngredientTotals = mergeKeywordIngredientTotals(mainPlan, subCraftPlans);

  return {
    mainPlan,
    subCraftPlans,
    allSteps,
    netIngredientTotals,
    netKeywordIngredientTotals,
  };
}

// ============================================================
// Internal helpers
// ============================================================

function cloneUsage(u: IngredientUsage): IngredientUsage {
  return {
    totalCount: u.totalCount,
    timesUsed: u.timesUsed,
    chanceToConsume: u.chanceToConsume,
    recipeCount: u.recipeCount,
    usedByRecipes: new Set(u.usedByRecipes),
  };
}

function addUsage(target: Map<number, IngredientUsage>, itemCode: number, usage: IngredientUsage): void {
  const existing = target.get(itemCode);
  if (existing) {
    existing.totalCount += usage.totalCount;
    existing.timesUsed += usage.timesUsed;
    existing.chanceToConsume = Math.min(existing.chanceToConsume, usage.chanceToConsume);
    for (const r of usage.usedByRecipes) {
      existing.usedByRecipes.add(r);
    }
    existing.recipeCount = existing.usedByRecipes.size;
  } else {
    target.set(itemCode, cloneUsage(usage));
  }
}

function addKeywordUsage(target: Map<string, IngredientUsage>, key: string, usage: IngredientUsage): void {
  const existing = target.get(key);
  if (existing) {
    existing.totalCount += usage.totalCount;
    existing.timesUsed += usage.timesUsed;
    existing.chanceToConsume = Math.min(existing.chanceToConsume, usage.chanceToConsume);
    for (const r of usage.usedByRecipes) {
      existing.usedByRecipes.add(r);
    }
    existing.recipeCount = existing.usedByRecipes.size;
  } else {
    target.set(key, cloneUsage(usage));
  }
}

/**
 * Merge ingredient totals:
 * 1. Start with the main plan's ingredient totals (cloned).
 * 2. For each sub-craft, subtract the items it produces from the main plan's needs.
 * 3. Add the sub-craft's own ingredient needs.
 */
function mergeIngredientTotals(
  mainPlan: PlanResult,
  subCraftPlans: Map<number, SubCraftPlan>,
): Map<number, IngredientUsage> {
  const net = new Map<number, IngredientUsage>();

  // Clone main plan's ingredient totals
  for (const [itemCode, usage] of mainPlan.ingredientTotals) {
    net.set(itemCode, cloneUsage(usage));
  }

  for (const [targetItemCode, subPlan] of subCraftPlans) {
    // Subtract the items produced by this sub-craft from the main plan's needs
    const mainUsage = net.get(targetItemCode);
    if (mainUsage) {
      const produced = subPlan.result.totalProduced;
      mainUsage.totalCount = Math.max(0, mainUsage.totalCount - produced);
      if (mainUsage.totalCount === 0) {
        net.delete(targetItemCode);
      }
    }

    // Add the sub-craft's own ingredient needs
    for (const [itemCode, usage] of subPlan.result.ingredientTotals) {
      addUsage(net, itemCode, usage);
    }
  }

  return net;
}

function mergeKeywordIngredientTotals(
  mainPlan: PlanResult,
  subCraftPlans: Map<number, SubCraftPlan>,
): Map<string, IngredientUsage> {
  const net = new Map<string, IngredientUsage>();

  // Clone main plan's keyword ingredient totals
  for (const [key, usage] of mainPlan.keywordIngredientTotals) {
    net.set(key, cloneUsage(usage));
  }

  // Add sub-craft keyword ingredient needs
  for (const [, subPlan] of subCraftPlans) {
    for (const [key, usage] of subPlan.result.keywordIngredientTotals) {
      addKeywordUsage(net, key, usage);
    }
  }

  return net;
}
