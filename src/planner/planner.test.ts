import { describe, it, expect } from 'vitest';
import { CharacterState } from '../character-state';
import { recipes, skills, RAW_XP_TABLES } from '../data';
import {
  buildXpTableLookup,
  calcDropOffMultiplier,
  calcRecipeXp,
  calcRecipeEffort,
  planCraftingSkill,
  buildItemRecipeLookup,
  findRecipesForItem,
  resolveIngredientTree,
  xpScorer,
  efficientScorer,
  initSimulation,
  canCraftRecipe,
  scoreCandidate,
  findBestCandidate,
  stepSimulation,
  isSimulationDone,
  buildPlanResult,
} from './index';
import type { ItemEffortMap, RecipeScorer } from './index';
import type { Recipe } from '../schemas/recipes';
import characterJson from '../example/Character_ShepardPiedPiper.json';

// ============================================================
// XP Utilities
// ============================================================

describe('buildXpTableLookup', () => {
  const lookup = buildXpTableLookup(RAW_XP_TABLES as Record<string, { InternalName: string; XpAmounts: number[] }>);

  it('contains expected table names', () => {
    expect(lookup.has('TypicalNoncombatSkill')).toBe(true);
    expect(lookup.has('TypicalCombatSkill')).toBe(true);
  });

  it('TypicalNoncombatSkill level 0 requires some XP', () => {
    const amounts = lookup.get('TypicalNoncombatSkill')!;
    expect(amounts[0]).toBeGreaterThan(0);
  });
});

describe('calcDropOffMultiplier', () => {
  it('returns 1.0 when no drop-off fields', () => {
    expect(calcDropOffMultiplier(50)).toBe(1.0);
    expect(calcDropOffMultiplier(50, null, undefined, undefined)).toBe(1.0);
  });

  it('returns 1.0 at exactly the drop-off level', () => {
    expect(calcDropOffMultiplier(10, 10, 5, 0.1)).toBe(1.0);
  });

  it('returns 1.0 below the drop-off level', () => {
    expect(calcDropOffMultiplier(5, 10, 5, 0.1)).toBe(1.0);
  });

  it('reduces by dropOffPct per step at dropOffLevel + dropOffRate', () => {
    // levelsAbove=5, steps=1, 1 - 0.1*1 = 0.9
    expect(calcDropOffMultiplier(15, 10, 5, 0.1)).toBeCloseTo(0.9);
  });

  it('reduces linearly at dropOffLevel + 2*dropOffRate', () => {
    // levelsAbove=10, steps=2, 1 - 0.1*2 = 0.8
    expect(calcDropOffMultiplier(20, 10, 5, 0.1)).toBeCloseTo(0.8);
  });

  it('continues reducing linearly at higher levels', () => {
    // levelsAbove=40, steps=8, 1 - 0.1*8 = 0.2
    expect(calcDropOffMultiplier(50, 10, 5, 0.1)).toBeCloseTo(0.2);
  });

  it('clamps to dropOffPct floor', () => {
    // levelsAbove=50, steps=10, 1 - 0.1*10 = 0 → clamped to 0.1
    expect(calcDropOffMultiplier(60, 10, 5, 0.1)).toBe(0.1);
    // levelsAbove=55, steps=11, 1 - 0.1*11 = -0.1 → clamped to 0.1
    expect(calcDropOffMultiplier(65, 10, 5, 0.1)).toBe(0.1);
  });
});

describe('calcRecipeXp', () => {
  const mockRecipe: Recipe = {
    Description: 'Test',
    IconId: 1,
    Ingredients: [],
    InternalName: 'TestRecipe',
    Name: 'Test Recipe',
    ResultItems: [],
    RewardSkill: 'Cooking',
    RewardSkillXp: 100,
    RewardSkillXpFirstTime: 400,
    RewardSkillXpDropOffLevel: 20,
    RewardSkillXpDropOffPct: 0.1,
    RewardSkillXpDropOffRate: 5,
    Skill: 'Cooking',
    SkillLevelReq: 10,
  };

  it('returns first-time XP on first craft', () => {
    expect(calcRecipeXp(mockRecipe, 10, 0)).toBe(400);
  });

  it('returns base XP on subsequent crafts below drop-off', () => {
    expect(calcRecipeXp(mockRecipe, 15, 1)).toBe(100);
  });

  it('applies drop-off on subsequent crafts above drop-off level', () => {
    // Level 25 = 5 above dropOff 20, rate 5 → steps=1, mult = 1-0.1*1 = 0.9 → 90 XP
    expect(calcRecipeXp(mockRecipe, 25, 1)).toBe(90);
  });

  it('applies crafting XP mod', () => {
    // First craft: 400 * 1.1 = 440
    expect(calcRecipeXp(mockRecipe, 10, 0, 1.1)).toBe(440);
  });

  it('does not apply XP mod when RewardAllowBonusXp is false', () => {
    const noBonus = { ...mockRecipe, RewardAllowBonusXp: false as const };
    expect(calcRecipeXp(noBonus, 10, 0, 1.5)).toBe(400);
  });
});

// ============================================================
// Greedy Planner — Smoke Test with Example Character
// ============================================================

describe('planCraftingSkill', () => {
  const state = new CharacterState();
  state.loadCharacterSheet(characterJson);

  const xpTableLookup = buildXpTableLookup(
    RAW_XP_TABLES as Record<string, { InternalName: string; XpAmounts: number[] }>,
  );

  it('plans Cooking from current level to level 25', () => {
    const result = planCraftingSkill(
      state,
      'Cooking',
      { targetLevel: 25 },
      recipes,
      skills,
      xpTableLookup,
    );

    expect(result.skill).toBe('Cooking');
    expect(result.startLevel).toBe(17);
    expect(result.endLevel).toBeGreaterThanOrEqual(25);
    expect(result.targetReached).toBe(true);
    expect(result.steps.length).toBeGreaterThan(0);
    expect(result.totalXpGained).toBeGreaterThan(0);
    expect(result.levelUps).toBeGreaterThanOrEqual(8);

    // First steps should have first-craft bonuses (high XP)
    const firstCraftSteps = result.steps.filter((s) => s.isFirstCraft);
    expect(firstCraftSteps.length).toBeGreaterThan(0);

    // Steps should have non-decreasing skillLevelAfter
    for (let i = 1; i < result.steps.length; i++) {
      expect(result.steps[i].skillLevelAfter).toBeGreaterThanOrEqual(
        result.steps[i - 1].skillLevelAfter,
      );
    }
  });

  it('returns early if already at target level', () => {
    // Pathology is at level 50
    const result = planCraftingSkill(
      state,
      'Pathology',
      { targetLevel: 50 },
      recipes,
      skills,
      xpTableLookup,
    );

    expect(result.startLevel).toBe(50);
    expect(result.targetReached).toBe(true);
    expect(result.steps.length).toBe(0);
  });

  it('respects maxCrafts limit', () => {
    const result = planCraftingSkill(
      state,
      'Cooking',
      { targetLevel: 100, maxCrafts: 5 },
      recipes,
      skills,
      xpTableLookup,
    );

    expect(result.steps.length).toBeLessThanOrEqual(5);
  });

  it('throws for unknown skill', () => {
    expect(() =>
      planCraftingSkill(
        state,
        'FakeSkill',
        { targetLevel: 10 },
        recipes,
        skills,
        xpTableLookup,
      ),
    ).toThrow('Unknown skill');
  });

  it('includes effortCost and totalEffort in results', () => {
    const result = planCraftingSkill(
      state,
      'Cooking',
      { targetLevel: 20 },
      recipes,
      skills,
      xpTableLookup,
    );

    expect(result.totalEffort).toBeGreaterThan(0);
    for (const step of result.steps) {
      expect(step.effortCost).toBeGreaterThan(0);
    }
  });
});

// ============================================================
// Recipe Effort Calculation
// ============================================================

describe('calcRecipeEffort', () => {
  it('sums stackSize for ingredients with no effort overrides', () => {
    const recipe: Recipe = {
      Description: 'Test',
      IconId: 1,
      Ingredients: [
        { ItemCode: 100, StackSize: 2 },
        { ItemCode: 200, StackSize: 3 },
      ],
      InternalName: 'Test',
      Name: 'Test',
      ResultItems: [],
      RewardSkill: 'Cooking',
      RewardSkillXp: 10,
      RewardSkillXpFirstTime: 40,
      Skill: 'Cooking',
      SkillLevelReq: 0,
    };
    // No effort map → all items default 1.0 → 2*1 + 3*1 = 5
    expect(calcRecipeEffort(recipe)).toBe(5);
  });

  it('applies effort overrides per ItemCode', () => {
    const recipe: Recipe = {
      Description: 'Test',
      IconId: 1,
      Ingredients: [
        { ItemCode: 100, StackSize: 2 },
        { ItemCode: 200, StackSize: 1 },
      ],
      InternalName: 'Test',
      Name: 'Test',
      ResultItems: [],
      RewardSkill: 'Cooking',
      RewardSkillXp: 10,
      RewardSkillXpFirstTime: 40,
      Skill: 'Cooking',
      SkillLevelReq: 0,
    };
    const effort: ItemEffortMap = new Map([[200, 10]]);
    // 2*1.0 + 1*10.0 = 12
    expect(calcRecipeEffort(recipe, effort)).toBe(12);
  });

  it('accounts for ChanceToConsume', () => {
    const recipe: Recipe = {
      Description: 'Test',
      IconId: 1,
      Ingredients: [
        { ItemCode: 100, StackSize: 1 },
        { ItemCode: 200, StackSize: 1, ChanceToConsume: 0.2 },
      ],
      InternalName: 'Test',
      Name: 'Test',
      ResultItems: [],
      RewardSkill: 'Cooking',
      RewardSkillXp: 10,
      RewardSkillXpFirstTime: 40,
      Skill: 'Cooking',
      SkillLevelReq: 0,
    };
    // 1*1.0*1.0 + 1*1.0*0.2 = 1.2
    expect(calcRecipeEffort(recipe)).toBeCloseTo(1.2);
  });

  it('defaults keyword-based ingredients (no ItemCode) to effort 1.0', () => {
    const recipe: Recipe = {
      Description: 'Test',
      IconId: 1,
      Ingredients: [
        { ItemKeys: ['Equipment'], StackSize: 1 },
      ],
      InternalName: 'Test',
      Name: 'Test',
      ResultItems: [],
      RewardSkill: 'Cooking',
      RewardSkillXp: 10,
      RewardSkillXpFirstTime: 40,
      Skill: 'Cooking',
      SkillLevelReq: 0,
    };
    expect(calcRecipeEffort(recipe)).toBe(1);
  });
});

// ============================================================
// Efficient Strategy
// ============================================================

describe('planCraftingSkill — efficient strategy', () => {
  const state = new CharacterState();
  state.loadCharacterSheet(characterJson);

  const xpTableLookup = buildXpTableLookup(
    RAW_XP_TABLES as Record<string, { InternalName: string; XpAmounts: number[] }>,
  );

  it('reaches the target level with efficient strategy', () => {
    const result = planCraftingSkill(
      state,
      'Cooking',
      { targetLevel: 25, strategy: 'efficient' },
      recipes,
      skills,
      xpTableLookup,
    );

    expect(result.targetReached).toBe(true);
    expect(result.endLevel).toBeGreaterThanOrEqual(25);
    expect(result.totalEffort).toBeGreaterThan(0);
  });

  it('may choose different recipes than xp strategy', () => {
    const xpResult = planCraftingSkill(
      state,
      'Cooking',
      { targetLevel: 25, strategy: 'xp' },
      recipes,
      skills,
      xpTableLookup,
    );
    const effResult = planCraftingSkill(
      state,
      'Cooking',
      { targetLevel: 25, strategy: 'efficient' },
      recipes,
      skills,
      xpTableLookup,
    );

    // Both reach the target
    expect(xpResult.targetReached).toBe(true);
    expect(effResult.targetReached).toBe(true);

    // Efficient strategy should use less or equal total effort
    expect(effResult.totalEffort).toBeLessThanOrEqual(xpResult.totalEffort);
  });

  it('uses includeRecipes to add unknown recipes with first-time bonuses', () => {
    // Fletching is at level 1 with only ArrowHead1 (0 repeatable XP) known.
    // Without extra recipes, the planner gets stuck after the single first craft.
    const withoutInclude = planCraftingSkill(
      state,
      'Fletching',
      { targetLevel: 10, strategy: 'xp' },
      recipes,
      skills,
      xpTableLookup,
    );

    const withInclude = planCraftingSkill(
      state,
      'Fletching',
      { targetLevel: 10, strategy: 'xp', includeRecipes: new Set([
        'ArrowShaft1', 'Arrow1', 'BarbedArrow1', 'LongArrow1',
        'DenseArrow1', 'ReservoirArrow1', 'SnareArrow1',
        'ArrowHead2', 'ArrowShaft2', 'Arrow2',
      ]) },
      recipes,
      skills,
      xpTableLookup,
    );

    // Without includes, stuck — can't reach target
    expect(withoutInclude.targetReached).toBe(false);
    // With includes, the first-craft bonuses and repeatable XP unlock progress
    expect(withInclude.targetReached).toBe(true);
    expect(withInclude.steps.filter((s) => s.isFirstCraft).length).toBeGreaterThan(1);
  });

  it('responds to itemEffort overrides', () => {
    // Make all items very cheap except one specific ingredient
    const defaultResult = planCraftingSkill(
      state,
      'Blacksmithing',
      { targetLevel: 18, strategy: 'efficient' },
      recipes,
      skills,
      xpTableLookup,
    );

    // Now make a key ingredient very expensive
    const expensiveEffort: ItemEffortMap = new Map([[22551, 100]]); // Gryphon Statue mold
    const expensiveResult = planCraftingSkill(
      state,
      'Blacksmithing',
      { targetLevel: 18, strategy: 'efficient', itemEffort: expensiveEffort },
      recipes,
      skills,
      xpTableLookup,
    );

    // Both should reach the target
    expect(defaultResult.targetReached).toBe(true);
    expect(expensiveResult.targetReached).toBe(true);

    // With expensive item, planner should report higher total effort
    expect(expensiveResult.totalEffort).toBeGreaterThanOrEqual(defaultResult.totalEffort);
  });
});

// ============================================================
// Recipe Unlocks (includeRecipes + unlockPrereqs)
// ============================================================

describe('planCraftingSkill — recipe unlocks', () => {
  const state = new CharacterState();
  state.loadCharacterSheet(characterJson);

  const xpTableLookup = buildXpTableLookup(
    RAW_XP_TABLES as Record<string, { InternalName: string; XpAmounts: number[] }>,
  );

  it('includeRecipes seeds unknown recipes as available with first-time bonus', () => {
    // Without includeRecipes, Fletching is stuck (ArrowHead1 gives 0 repeatable XP)
    const baseResult = planCraftingSkill(
      state,
      'Fletching',
      { targetLevel: 5 },
      recipes,
      skills,
      xpTableLookup,
    );

    // With includeRecipes, add several early fletching recipes
    const expandedResult = planCraftingSkill(
      state,
      'Fletching',
      { targetLevel: 5, includeRecipes: new Set(['ArrowShaft1', 'Arrow1', 'BarbedArrow1']) },
      recipes,
      skills,
      xpTableLookup,
    );

    // Base can't reach target, expanded can
    expect(baseResult.targetReached).toBe(false);
    expect(expandedResult.targetReached).toBe(true);

    // The expanded plan should use multiple first-craft bonuses
    const expandedFCs = expandedResult.steps.filter((s) => s.isFirstCraft).length;
    expect(expandedFCs).toBeGreaterThanOrEqual(3);
  });

  it('unlockPrereqs makes chained recipes available after crafting prereq', () => {
    // Include a wide range of fletching recipes including Arrow5
    // With unlockPrereqs, crafting Arrow5 should make Arrow6 available
    const allLowFletchingRecipes = [
      'ArrowShaft1', 'Arrow1', 'BarbedArrow1', 'LongArrow1', 'DenseArrow1',
      'ReservoirArrow1', 'SnareArrow1',
      'ArrowHead2', 'ArrowShaft2', 'ArrowShaft2B', 'Fletching2', 'Arrow2',
      'BarbedArrow2', 'LongArrow2', 'DenseArrow2', 'ReservoirArrow2', 'SnareArrow2',
      'ArrowHead3', 'ArrowShaft3', 'ArrowShaft3B', 'Arrow3',
      'BarbedArrow3', 'LongArrow3', 'DenseArrow3', 'ReservoirArrow3', 'SnareArrow3',
      'ArrowHead4', 'ArrowShaft4', 'ArrowShaft4B', 'Fletching4', 'Arrow4',
      'BarbedArrow4', 'LongArrow4', 'DenseArrow4', 'ReservoirArrow4', 'SnareArrow4',
      'ArrowHead5', 'ArrowShaft5', 'ArrowShaft5B', 'Arrow5',
      'BarbedArrow5', 'LongArrow5', 'DenseArrow5', 'ReservoirArrow5', 'SnareArrow5',
    ];

    const withoutUnlock = planCraftingSkill(
      state,
      'Fletching',
      { targetLevel: 55, includeRecipes: new Set(allLowFletchingRecipes), unlockPrereqs: false },
      recipes,
      skills,
      xpTableLookup,
    );

    const withUnlock = planCraftingSkill(
      state,
      'Fletching',
      { targetLevel: 55, includeRecipes: new Set(allLowFletchingRecipes), unlockPrereqs: true },
      recipes,
      skills,
      xpTableLookup,
    );

    // Both should reach the target
    expect(withoutUnlock.targetReached).toBe(true);
    expect(withUnlock.targetReached).toBe(true);

    // With prereq unlocks, Arrow6/BarbedArrow6/etc. should appear as first crafts
    const unlockedNames = withUnlock.steps
      .filter((s) => s.isFirstCraft)
      .map((s) => s.internalName);
    const withoutUnlockedNames = withoutUnlock.steps
      .filter((s) => s.isFirstCraft)
      .map((s) => s.internalName);

    // Arrow6 should be unlocked (prereq Arrow5) — only with unlockPrereqs
    expect(unlockedNames).toContain('Arrow6');
    expect(withoutUnlockedNames).not.toContain('Arrow6');
  });

  it('unlockPrereqs does nothing when no prereq chains exist', () => {
    // Cooking recipes don't have PrereqRecipe chains at low levels
    const withoutUnlock = planCraftingSkill(
      state,
      'Cooking',
      { targetLevel: 20, unlockPrereqs: false },
      recipes,
      skills,
      xpTableLookup,
    );

    const withUnlock = planCraftingSkill(
      state,
      'Cooking',
      { targetLevel: 20, unlockPrereqs: true },
      recipes,
      skills,
      xpTableLookup,
    );

    // Should produce identical results
    expect(withoutUnlock.totalCrafts).toBe(withUnlock.totalCrafts);
    expect(withoutUnlock.totalXpGained).toBe(withUnlock.totalXpGained);
  });
});

// ============================================================
// Ingredient Totals in PlanResult
// ============================================================

describe('planCraftingSkill — ingredient totals', () => {
  const state = new CharacterState();
  state.loadCharacterSheet(characterJson);

  const xpTableLookup = buildXpTableLookup(
    RAW_XP_TABLES as Record<string, { InternalName: string; XpAmounts: number[] }>,
  );

  it('tracks ingredient totals across all crafts', () => {
    const result = planCraftingSkill(
      state,
      'Cooking',
      { targetLevel: 20 },
      recipes,
      skills,
      xpTableLookup,
    );

    expect(result.ingredientTotals.size).toBeGreaterThan(0);

    // Each usage entry should have positive count and valid fields
    let totalItems = 0;
    for (const usage of result.ingredientTotals.values()) {
      expect(usage.totalCount).toBeGreaterThan(0);
      expect(usage.chanceToConsume).toBeGreaterThan(0);
      expect(usage.chanceToConsume).toBeLessThanOrEqual(1.0);
      expect(usage.recipeCount).toBeGreaterThan(0);
      expect(usage.usedByRecipes.size).toBe(usage.recipeCount);
      totalItems += usage.totalCount;
    }
    expect(totalItems).toBeGreaterThan(0);
  });

  it('returns empty ingredient totals when no crafts needed', () => {
    const result = planCraftingSkill(
      state,
      'Pathology',
      { targetLevel: 50 },
      recipes,
      skills,
      xpTableLookup,
    );

    expect(result.steps.length).toBe(0);
    expect(result.ingredientTotals.size).toBe(0);
    expect(result.keywordIngredientTotals.size).toBe(0);
  });

  it('ingredient counts scale with number of crafts', () => {
    const small = planCraftingSkill(
      state,
      'Cooking',
      { targetLevel: 19 },
      recipes,
      skills,
      xpTableLookup,
    );

    const large = planCraftingSkill(
      state,
      'Cooking',
      { targetLevel: 25 },
      recipes,
      skills,
      xpTableLookup,
    );

    // More crafts → more or equal ingredients
    let smallTotal = 0;
    for (const usage of small.ingredientTotals.values()) smallTotal += usage.totalCount;
    let largeTotal = 0;
    for (const usage of large.ingredientTotals.values()) largeTotal += usage.totalCount;

    expect(largeTotal).toBeGreaterThanOrEqual(smallTotal);
  });
});

// ============================================================
// Exclude Recipes
// ============================================================

describe('planCraftingSkill — excludeRecipes', () => {
  const state = new CharacterState();
  state.loadCharacterSheet(characterJson);

  const xpTableLookup = buildXpTableLookup(
    RAW_XP_TABLES as Record<string, { InternalName: string; XpAmounts: number[] }>,
  );

  it('excludes specified recipes from the plan', () => {
    const baseResult = planCraftingSkill(
      state,
      'Cooking',
      { targetLevel: 25 },
      recipes,
      skills,
      xpTableLookup,
    );

    // Find a recipe that appears in the base plan
    const recipeToExclude = baseResult.steps[0].internalName;

    const excludedResult = planCraftingSkill(
      state,
      'Cooking',
      { targetLevel: 25, excludeRecipes: new Set([recipeToExclude]) },
      recipes,
      skills,
      xpTableLookup,
    );

    // Excluded recipe should not appear in the plan
    const excludedSteps = excludedResult.steps.filter((s) => s.internalName === recipeToExclude);
    expect(excludedSteps.length).toBe(0);

    // Should still reach the target (Cooking has many recipes)
    expect(excludedResult.targetReached).toBe(true);
  });

  it('excludeRecipes does not affect other recipes', () => {
    // Exclude a recipe that wouldn't have been used anyway (fake name)
    const result = planCraftingSkill(
      state,
      'Cooking',
      { targetLevel: 20 },
      recipes,
      skills,
      xpTableLookup,
    );

    const resultWithIrrelevantExclude = planCraftingSkill(
      state,
      'Cooking',
      { targetLevel: 20, excludeRecipes: new Set(['NonExistentRecipe']) },
      recipes,
      skills,
      xpTableLookup,
    );

    expect(result.totalCrafts).toBe(resultWithIrrelevantExclude.totalCrafts);
    expect(result.totalXpGained).toBe(resultWithIrrelevantExclude.totalXpGained);
  });
});

// ============================================================
// Ingredient Helpers
// ============================================================

describe('buildItemRecipeLookup', () => {
  const lookup = buildItemRecipeLookup(recipes);

  it('finds recipes that produce Butter (ItemCode 5011)', () => {
    const sources = findRecipesForItem(5011, lookup);
    expect(sources.length).toBeGreaterThan(0);
    // Butter is made by Cheesemaking
    expect(sources.some((s) => s.recipe.Skill === 'Cheesemaking')).toBe(true);
  });

  it('finds recipes that produce Oak Wood Chips (ItemCode 13201)', () => {
    const sources = findRecipesForItem(13201, lookup);
    expect(sources.length).toBeGreaterThan(0);
    expect(sources.some((s) => s.recipe.Skill === 'Carpentry')).toBe(true);
  });

  it('returns empty array for uncraftable items', () => {
    // ItemCode 999999 shouldn't exist
    const sources = findRecipesForItem(999999, lookup);
    expect(sources).toEqual([]);
  });

  it('includes output stack size and percent chance', () => {
    const sources = findRecipesForItem(5011, lookup);
    const butterSource = sources.find((s) => s.recipe.InternalName === 'Butter');
    expect(butterSource).toBeDefined();
    expect(butterSource!.outputStackSize).toBe(3); // Butter produces 3
  });
});

// ============================================================
// Inventory-Constrained Planning
// ============================================================

describe('planCraftingSkill — inventory', () => {
  const state = new CharacterState();
  state.loadCharacterSheet(characterJson);

  const xpTableLookup = buildXpTableLookup(
    RAW_XP_TABLES as Record<string, { InternalName: string; XpAmounts: number[] }>,
  );

  it('limits crafts to available inventory', () => {
    // Run without inventory to see what the first recipe needs
    const unconstrained = planCraftingSkill(
      state,
      'Cooking',
      { targetLevel: 25 },
      recipes,
      skills,
      xpTableLookup,
    );

    expect(unconstrained.targetReached).toBe(true);

    // Run with empty inventory — should produce zero crafts
    const emptyInv = planCraftingSkill(
      state,
      'Cooking',
      { targetLevel: 25, inventory: new Map() },
      recipes,
      skills,
      xpTableLookup,
    );

    expect(emptyInv.steps.length).toBe(0);
    expect(emptyInv.targetReached).toBe(false);
  });

  it('deducts consumed ingredients and tracks remaining inventory', () => {
    // Get the first recipe used in the unconstrained plan
    const unconstrained = planCraftingSkill(
      state,
      'Cooking',
      { targetLevel: 20, maxCrafts: 1 },
      recipes,
      skills,
      xpTableLookup,
    );

    expect(unconstrained.steps.length).toBe(1);
    const firstRecipeId = unconstrained.steps[0].recipeId;
    const recipe = recipes.get(firstRecipeId)!;

    // Build inventory with exactly enough for 1 craft
    const inv = new Map<number, number>();
    for (const ing of recipe.Ingredients) {
      if (ing.ItemCode != null) {
        inv.set(ing.ItemCode, ing.StackSize);
      }
    }

    const result = planCraftingSkill(
      state,
      'Cooking',
      { targetLevel: 20, maxCrafts: 1, inventory: inv },
      recipes,
      skills,
      xpTableLookup,
    );

    expect(result.steps.length).toBe(1);
    expect(result.inventoryRemaining).toBeDefined();

    // Consumed ingredients should be at 0 (or have ResultItems added back)
    for (const ing of recipe.Ingredients) {
      if (ing.ItemCode != null) {
        const chance = ing.ChanceToConsume ?? 1.0;
        const remaining = result.inventoryRemaining!.get(ing.ItemCode) ?? 0;
        if (chance === 1.0) {
          // Should be deducted
          expect(remaining).toBeLessThanOrEqual(ing.StackSize);
        }
      }
    }
  });

  it('adds ResultItems back to inventory', () => {
    // Find a Cooking recipe that has ResultItems
    const unconstrained = planCraftingSkill(
      state,
      'Cooking',
      { targetLevel: 20, maxCrafts: 1 },
      recipes,
      skills,
      xpTableLookup,
    );

    expect(unconstrained.steps.length).toBe(1);
    const recipe = recipes.get(unconstrained.steps[0].recipeId)!;

    // Build generous inventory
    const inv = new Map<number, number>();
    for (const ing of recipe.Ingredients) {
      if (ing.ItemCode != null) {
        inv.set(ing.ItemCode, ing.StackSize * 10);
      }
    }

    const result = planCraftingSkill(
      state,
      'Cooking',
      { targetLevel: 20, maxCrafts: 1, inventory: inv },
      recipes,
      skills,
      xpTableLookup,
    );

    // Check ResultItems were added to inventory
    for (const resultItem of recipe.ResultItems) {
      const remaining = result.inventoryRemaining!.get(resultItem.ItemCode) ?? 0;
      expect(remaining).toBeGreaterThanOrEqual(resultItem.StackSize);
    }
  });

  it('does not return inventoryRemaining when no inventory provided', () => {
    const result = planCraftingSkill(
      state,
      'Cooking',
      { targetLevel: 20 },
      recipes,
      skills,
      xpTableLookup,
    );

    expect(result.inventoryRemaining).toBeUndefined();
  });

  it('does not deduct tools (ChanceToConsume < 1.0) from inventory', () => {
    // Find a recipe with a tool ingredient (ChanceToConsume < 1.0)
    let toolRecipe: Recipe | undefined;
    let toolRecipeId = '';
    for (const [id, r] of recipes) {
      if (r.RewardSkill !== 'Cooking') continue;
      if (!state.recipeCompletions.has(r.InternalName)) continue;
      const hasTool = r.Ingredients.some((i) =>
        i.ChanceToConsume != null && i.ChanceToConsume < 1.0 && i.ItemCode != null,
      );
      if (hasTool) {
        toolRecipe = r;
        toolRecipeId = id;
        break;
      }
    }

    if (!toolRecipe) return; // skip if no such recipe exists

    // Build inventory for exactly 1 craft
    const inv = new Map<number, number>();
    for (const ing of toolRecipe.Ingredients) {
      if (ing.ItemCode != null) {
        inv.set(ing.ItemCode, ing.StackSize);
      }
    }

    const result = planCraftingSkill(
      state,
      'Cooking',
      { targetLevel: 100, maxCrafts: 1, inventory: inv },
      recipes,
      skills,
      xpTableLookup,
    );

    if (result.steps.length > 0 && result.steps[0].recipeId === toolRecipeId) {
      // Tool ingredient should still be present
      for (const ing of toolRecipe.Ingredients) {
        if (ing.ItemCode != null && ing.ChanceToConsume != null && ing.ChanceToConsume < 1.0) {
          const remaining = result.inventoryRemaining!.get(ing.ItemCode) ?? 0;
          expect(remaining).toBe(ing.StackSize); // not deducted
        }
      }
    }
  });
});

describe('resolveIngredientTree', () => {
  it('resolves immediate ingredients for Oak Wood Chips', () => {
    // Oak Wood Chips (13201) is made from Oak Wood (13101)
    const tree = resolveIngredientTree(13201, 5, recipes);
    expect(tree.itemCode).toBe(13201);
    expect(tree.quantity).toBe(5);
    expect(tree.craftableVia.length).toBeGreaterThan(0);
    expect(tree.subIngredients).toBeDefined();
    expect(tree.subIngredients!.length).toBeGreaterThan(0);
    // Oak Wood should be a sub-ingredient
    const oakWood = tree.subIngredients!.find((n) => n.itemCode === 13101);
    expect(oakWood).toBeDefined();
  });

  it('returns no sub-ingredients for uncraftable items', () => {
    const tree = resolveIngredientTree(999999, 1, recipes);
    expect(tree.craftableVia.length).toBe(0);
    expect(tree.subIngredients).toBeUndefined();
  });

  it('respects maxDepth=0 and does not recurse', () => {
    const tree = resolveIngredientTree(13201, 1, recipes, undefined, 0);
    expect(tree.craftableVia.length).toBeGreaterThan(0);
    // At depth 0, subIngredients should not be resolved
    expect(tree.subIngredients).toBeUndefined();
  });

  it('resolves deeper with maxDepth=2', () => {
    // Arrow1 recipe: needs ArrowHead1 + ArrowShaft1 items
    // ArrowShaft1 is craftable from Oak Dowels which are craftable from Oak Wood
    // Find ArrowShaft result item code
    const lookup = buildItemRecipeLookup(recipes);

    // Oak Dowels (13401) → made from Oak Wood (13101)
    const tree = resolveIngredientTree(13401, 2, recipes, lookup, 2);
    expect(tree.itemCode).toBe(13401);
    expect(tree.subIngredients).toBeDefined();
    // Oak Wood at depth 1
    const oakWood = tree.subIngredients!.find((n) => n.itemCode === 13101);
    expect(oakWood).toBeDefined();
    // Oak Wood is itself craftable (from logs?) — but may or may not have sub-ingredients at depth 2
    // Just verify the tree structure is valid
    expect(oakWood!.craftableVia).toBeDefined();
  });
});

// ============================================================
// Scorers
// ============================================================

describe('xpScorer', () => {
  const mockRecipe: Recipe = {
    Description: 'Test',
    IconId: 1,
    Ingredients: [],
    InternalName: 'TestRecipe',
    Name: 'Test Recipe',
    ResultItems: [],
    RewardSkill: 'Cooking',
    RewardSkillXp: 100,
    RewardSkillXpFirstTime: 400,
    Skill: 'Cooking',
    SkillLevelReq: 0,
  };

  it('returns raw XP regardless of effort', () => {
    expect(xpScorer(mockRecipe, 200, 5)).toBe(200);
    expect(xpScorer(mockRecipe, 200, 50)).toBe(200);
    expect(xpScorer(mockRecipe, 0, 10)).toBe(0);
  });
});

describe('efficientScorer', () => {
  const mockRecipe: Recipe = {
    Description: 'Test',
    IconId: 1,
    Ingredients: [],
    InternalName: 'TestRecipe',
    Name: 'Test Recipe',
    ResultItems: [],
    RewardSkill: 'Cooking',
    RewardSkillXp: 100,
    RewardSkillXpFirstTime: 400,
    Skill: 'Cooking',
    SkillLevelReq: 0,
  };

  it('returns XP / effort', () => {
    expect(efficientScorer(mockRecipe, 200, 5)).toBe(40);
    expect(efficientScorer(mockRecipe, 100, 4)).toBe(25);
  });

  it('returns raw XP when effort is 0', () => {
    expect(efficientScorer(mockRecipe, 200, 0)).toBe(200);
  });
});

// ============================================================
// Simulation — initSimulation
// ============================================================

describe('initSimulation', () => {
  const state = new CharacterState();
  state.loadCharacterSheet(characterJson);

  const xpTableLookup = buildXpTableLookup(
    RAW_XP_TABLES as Record<string, { InternalName: string; XpAmounts: number[] }>,
  );

  it('initializes simulation state with correct starting values', () => {
    const sim = initSimulation(
      state, 'Cooking', { targetLevel: 25 },
      recipes, skills, xpTableLookup,
    );

    expect(sim.targetSkill).toBe('Cooking');
    expect(sim.currentLevel).toBe(17);
    expect(sim.startLevel).toBe(17);
    expect(sim.targetLevel).toBe(25);
    expect(sim.maxCrafts).toBe(10000);
    expect(sim.steps).toEqual([]);
    expect(sim.totalXpGained).toBe(0);
    expect(sim.totalEffort).toBe(0);
    expect(sim.candidates.length).toBeGreaterThan(0);
    expect(sim.inventory).toBeNull();
  });

  it('uses xpScorer by default', () => {
    const sim = initSimulation(
      state, 'Cooking', { targetLevel: 25 },
      recipes, skills, xpTableLookup,
    );
    expect(sim.scorer).toBe(xpScorer);
  });

  it('uses efficientScorer when strategy is efficient', () => {
    const sim = initSimulation(
      state, 'Cooking', { targetLevel: 25, strategy: 'efficient' },
      recipes, skills, xpTableLookup,
    );
    expect(sim.scorer).toBe(efficientScorer);
  });

  it('uses custom scorer when provided', () => {
    const custom: RecipeScorer = (_r, xp) => xp * 2;
    const sim = initSimulation(
      state, 'Cooking', { targetLevel: 25, scorer: custom },
      recipes, skills, xpTableLookup,
    );
    expect(sim.scorer).toBe(custom);
  });

  it('seeds includeRecipes into completions with count 0', () => {
    const sim = initSimulation(
      state, 'Fletching',
      { targetLevel: 10, includeRecipes: new Set(['ArrowShaft1', 'Arrow1']) },
      recipes, skills, xpTableLookup,
    );

    expect(sim.completions.get('ArrowShaft1')).toBe(0);
    expect(sim.completions.get('Arrow1')).toBe(0);
    // These should also be in the candidate pool
    expect(sim.candidateSet.has('ArrowShaft1')).toBe(true);
    expect(sim.candidateSet.has('Arrow1')).toBe(true);
  });

  it('throws for unknown skill', () => {
    expect(() =>
      initSimulation(state, 'FakeSkill', { targetLevel: 10 }, recipes, skills, xpTableLookup),
    ).toThrow('Unknown skill');
  });

  it('clones inventory when provided', () => {
    const inv = new Map([[100, 50]]);
    const sim = initSimulation(
      state, 'Cooking', { targetLevel: 25, inventory: inv },
      recipes, skills, xpTableLookup,
    );

    expect(sim.inventory).not.toBeNull();
    expect(sim.inventory!.get(100)).toBe(50);
    // Verify it's a clone, not a reference
    inv.set(100, 999);
    expect(sim.inventory!.get(100)).toBe(50);
  });
});

// ============================================================
// Simulation — canCraftRecipe
// ============================================================

describe('canCraftRecipe', () => {
  const charState = new CharacterState();
  charState.loadCharacterSheet(characterJson);

  const xpTableLookup = buildXpTableLookup(
    RAW_XP_TABLES as Record<string, { InternalName: string; XpAmounts: number[] }>,
  );

  it('returns true for a recipe the character can craft', () => {
    const sim = initSimulation(
      charState, 'Cooking', { targetLevel: 25 },
      recipes, skills, xpTableLookup,
    );

    // Find a recipe that's in the candidate pool — it should be craftable
    const candidate = sim.candidates[0];
    expect(canCraftRecipe(candidate.recipe, sim)).toBe(true);
  });

  it('returns false when skill level is too low', () => {
    const sim = initSimulation(
      charState, 'Cooking', { targetLevel: 25 },
      recipes, skills, xpTableLookup,
    );

    // Create a recipe that requires level 999
    const highLevelRecipe: Recipe = {
      Description: 'Test',
      IconId: 1,
      Ingredients: [],
      InternalName: 'HighLevel',
      Name: 'High Level',
      ResultItems: [],
      RewardSkill: 'Cooking',
      RewardSkillXp: 100,
      RewardSkillXpFirstTime: 400,
      Skill: 'Cooking',
      SkillLevelReq: 999,
    };

    expect(canCraftRecipe(highLevelRecipe, sim)).toBe(false);
  });

  it('returns false when MaxUses is exceeded', () => {
    const sim = initSimulation(
      charState, 'Cooking', { targetLevel: 25 },
      recipes, skills, xpTableLookup,
    );

    const limitedRecipe: Recipe = {
      Description: 'Test',
      IconId: 1,
      Ingredients: [],
      InternalName: 'Limited',
      Name: 'Limited',
      ResultItems: [],
      RewardSkill: 'Cooking',
      RewardSkillXp: 100,
      RewardSkillXpFirstTime: 400,
      Skill: 'Cooking',
      SkillLevelReq: 0,
      MaxUses: 3,
    };

    // Set completions to MaxUses
    sim.completions.set('Limited', 3);
    expect(canCraftRecipe(limitedRecipe, sim)).toBe(false);

    // Below MaxUses should be fine
    sim.completions.set('Limited', 2);
    expect(canCraftRecipe(limitedRecipe, sim)).toBe(true);
  });

  it('returns false when inventory lacks ingredients', () => {
    const sim = initSimulation(
      charState, 'Cooking', { targetLevel: 25, inventory: new Map() },
      recipes, skills, xpTableLookup,
    );

    const recipe: Recipe = {
      Description: 'Test',
      IconId: 1,
      Ingredients: [{ ItemCode: 5001, StackSize: 2 }],
      InternalName: 'NeedsItems',
      Name: 'Needs Items',
      ResultItems: [],
      RewardSkill: 'Cooking',
      RewardSkillXp: 100,
      RewardSkillXpFirstTime: 400,
      Skill: 'Cooking',
      SkillLevelReq: 0,
    };

    expect(canCraftRecipe(recipe, sim)).toBe(false);

    // Add enough inventory
    sim.inventory!.set(5001, 2);
    expect(canCraftRecipe(recipe, sim)).toBe(true);

    // Not quite enough
    sim.inventory!.set(5001, 1);
    expect(canCraftRecipe(recipe, sim)).toBe(false);
  });

  it('returns false when PrereqRecipe has not been crafted', () => {
    const sim = initSimulation(
      charState, 'Cooking', { targetLevel: 25 },
      recipes, skills, xpTableLookup,
    );

    const prereqRecipe: Recipe = {
      Description: 'Test',
      IconId: 1,
      Ingredients: [],
      InternalName: 'WithPrereq',
      Name: 'With Prereq',
      ResultItems: [],
      RewardSkill: 'Cooking',
      RewardSkillXp: 100,
      RewardSkillXpFirstTime: 400,
      Skill: 'Cooking',
      SkillLevelReq: 0,
      PrereqRecipe: 'PrereqBase',
    };

    // Prereq not crafted (not in completions at all)
    expect(canCraftRecipe(prereqRecipe, sim)).toBe(false);

    // Prereq seeded with count 0 (e.g. via includeRecipes) — still not crafted
    sim.completions.set('PrereqBase', 0);
    expect(canCraftRecipe(prereqRecipe, sim)).toBe(false);

    // Prereq actually crafted (count > 0)
    sim.completions.set('PrereqBase', 1);
    expect(canCraftRecipe(prereqRecipe, sim)).toBe(true);
  });

  it('requires tools to be present but does not require full stack', () => {
    const sim = initSimulation(
      charState, 'Cooking', { targetLevel: 25, inventory: new Map([[9999, 1]]) },
      recipes, skills, xpTableLookup,
    );

    const recipe: Recipe = {
      Description: 'Test',
      IconId: 1,
      Ingredients: [{ ItemCode: 9999, StackSize: 1, ChanceToConsume: 0.03 }],
      InternalName: 'ToolRecipe',
      Name: 'Tool Recipe',
      ResultItems: [],
      RewardSkill: 'Cooking',
      RewardSkillXp: 100,
      RewardSkillXpFirstTime: 400,
      Skill: 'Cooking',
      SkillLevelReq: 0,
    };

    expect(canCraftRecipe(recipe, sim)).toBe(true);

    // Without the tool
    sim.inventory!.delete(9999);
    expect(canCraftRecipe(recipe, sim)).toBe(false);
  });
});

// ============================================================
// Simulation — scoreCandidate & findBestCandidate
// ============================================================

describe('scoreCandidate', () => {
  const charState = new CharacterState();
  charState.loadCharacterSheet(characterJson);

  const xpTableLookup = buildXpTableLookup(
    RAW_XP_TABLES as Record<string, { InternalName: string; XpAmounts: number[] }>,
  );

  it('returns xp, effort, and score for a valid candidate', () => {
    const sim = initSimulation(
      charState, 'Cooking', { targetLevel: 25 },
      recipes, skills, xpTableLookup,
    );

    const candidate = sim.candidates[0];
    const result = scoreCandidate(candidate, sim);
    expect(result).not.toBeNull();
    expect(result!.xp).toBeGreaterThan(0);
    expect(result!.effort).toBeGreaterThanOrEqual(0);
    expect(result!.score).toBeGreaterThan(0);
  });

  it('returns null for ineligible candidate', () => {
    const sim = initSimulation(
      charState, 'Cooking', { targetLevel: 25 },
      recipes, skills, xpTableLookup,
    );

    const fakeCandidate = {
      recipeId: 'fake',
      recipe: {
        Description: 'Test',
        IconId: 1,
        Ingredients: [],
        InternalName: 'Fake',
        Name: 'Fake',
        ResultItems: [],
        RewardSkill: 'Cooking',
        RewardSkillXp: 100,
        RewardSkillXpFirstTime: 400,
        Skill: 'Cooking',
        SkillLevelReq: 999, // too high
      } as Recipe,
    };

    expect(scoreCandidate(fakeCandidate, sim)).toBeNull();
  });

  it('uses custom scorer when provided', () => {
    const sim = initSimulation(
      charState, 'Cooking', { targetLevel: 25 },
      recipes, skills, xpTableLookup,
    );

    const candidate = sim.candidates[0];
    const doubleScorer: RecipeScorer = (_r, xp) => xp * 2;
    const defaultResult = scoreCandidate(candidate, sim);
    const customResult = scoreCandidate(candidate, sim, doubleScorer);

    expect(customResult).not.toBeNull();
    expect(defaultResult).not.toBeNull();
    // Custom scorer doubles the score vs the default xpScorer (which returns raw XP)
    expect(customResult!.score).toBe(defaultResult!.xp * 2);
  });
});

describe('findBestCandidate', () => {
  const charState = new CharacterState();
  charState.loadCharacterSheet(characterJson);

  const xpTableLookup = buildXpTableLookup(
    RAW_XP_TABLES as Record<string, { InternalName: string; XpAmounts: number[] }>,
  );

  it('returns the highest-scoring candidate', () => {
    const sim = initSimulation(
      charState, 'Cooking', { targetLevel: 25 },
      recipes, skills, xpTableLookup,
    );

    const best = findBestCandidate(sim);
    expect(best).not.toBeNull();
    expect(best!.xp).toBeGreaterThan(0);

    // Verify it's actually the best by checking all candidates
    for (const candidate of sim.candidates) {
      const result = scoreCandidate(candidate, sim);
      if (result) {
        expect(best!.xp).toBeGreaterThanOrEqual(result.xp);
      }
    }
  });

  it('returns null when no candidates can give XP', () => {
    const sim = initSimulation(
      charState, 'Cooking', { targetLevel: 25, inventory: new Map() },
      recipes, skills, xpTableLookup,
    );

    const best = findBestCandidate(sim);
    expect(best).toBeNull();
  });
});

// ============================================================
// Simulation — stepSimulation & isSimulationDone
// ============================================================

describe('stepSimulation', () => {
  const charState = new CharacterState();
  charState.loadCharacterSheet(characterJson);

  const xpTableLookup = buildXpTableLookup(
    RAW_XP_TABLES as Record<string, { InternalName: string; XpAmounts: number[] }>,
  );

  it('advances simulation by one craft', () => {
    const sim = initSimulation(
      charState, 'Cooking', { targetLevel: 25 },
      recipes, skills, xpTableLookup,
    );

    const levelBefore = sim.currentLevel;
    const xpBefore = sim.totalXpGained;

    const step = stepSimulation(sim);
    expect(step).not.toBeNull();
    expect(step!.xpGained).toBeGreaterThan(0);
    expect(sim.steps.length).toBe(1);
    expect(sim.totalXpGained).toBe(xpBefore + step!.xpGained);
    expect(sim.currentLevel).toBeGreaterThanOrEqual(levelBefore);
  });

  it('returns null when stuck (empty inventory)', () => {
    const sim = initSimulation(
      charState, 'Cooking', { targetLevel: 25, inventory: new Map() },
      recipes, skills, xpTableLookup,
    );

    const step = stepSimulation(sim);
    expect(step).toBeNull();
    expect(sim.steps.length).toBe(0);
  });

  it('updates completion count after crafting', () => {
    const sim = initSimulation(
      charState, 'Cooking', { targetLevel: 25 },
      recipes, skills, xpTableLookup,
    );

    const step = stepSimulation(sim)!;
    const countAfter = sim.completions.get(step.internalName) ?? 0;
    expect(countAfter).toBeGreaterThan(0);
  });
});

describe('isSimulationDone', () => {
  const charState = new CharacterState();
  charState.loadCharacterSheet(characterJson);

  const xpTableLookup = buildXpTableLookup(
    RAW_XP_TABLES as Record<string, { InternalName: string; XpAmounts: number[] }>,
  );

  it('returns true when already at target level', () => {
    const sim = initSimulation(
      charState, 'Pathology', { targetLevel: 50 },
      recipes, skills, xpTableLookup,
    );

    expect(isSimulationDone(sim)).toBe(true);
  });

  it('returns false when below target level', () => {
    const sim = initSimulation(
      charState, 'Cooking', { targetLevel: 25 },
      recipes, skills, xpTableLookup,
    );

    expect(isSimulationDone(sim)).toBe(false);
  });

  it('returns true when maxCrafts reached', () => {
    const sim = initSimulation(
      charState, 'Cooking', { targetLevel: 100, maxCrafts: 0 },
      recipes, skills, xpTableLookup,
    );

    expect(isSimulationDone(sim)).toBe(true);
  });
});

// ============================================================
// Custom Scorer via PlannerOptions
// ============================================================

describe('planCraftingSkill — custom scorer', () => {
  const charState = new CharacterState();
  charState.loadCharacterSheet(characterJson);

  const xpTableLookup = buildXpTableLookup(
    RAW_XP_TABLES as Record<string, { InternalName: string; XpAmounts: number[] }>,
  );

  it('accepts a custom scorer via options', () => {
    // Scorer that prefers recipes with low XP (inverting the default behavior)
    const invertedScorer: RecipeScorer = (_r, xp) => 1 / (xp + 1);

    const defaultResult = planCraftingSkill(
      charState, 'Cooking', { targetLevel: 20 },
      recipes, skills, xpTableLookup,
    );

    const invertedResult = planCraftingSkill(
      charState, 'Cooking', { targetLevel: 20, scorer: invertedScorer },
      recipes, skills, xpTableLookup,
    );

    // Both should reach the target
    expect(defaultResult.targetReached).toBe(true);
    expect(invertedResult.targetReached).toBe(true);

    // Inverted scorer should use more crafts (picking worse recipes)
    expect(invertedResult.totalCrafts).toBeGreaterThanOrEqual(defaultResult.totalCrafts);
  });

  it('custom scorer overrides strategy', () => {
    const customScorer: RecipeScorer = (_r, xp, effort) => xp + effort;

    const result = planCraftingSkill(
      charState, 'Cooking',
      { targetLevel: 20, strategy: 'efficient', scorer: customScorer },
      recipes, skills, xpTableLookup,
    );

    expect(result.targetReached).toBe(true);
  });
});

// ============================================================
// Incremental Stepping — manual loop matches planCraftingSkill
// ============================================================

describe('incremental stepping', () => {
  const charState = new CharacterState();
  charState.loadCharacterSheet(characterJson);

  const xpTableLookup = buildXpTableLookup(
    RAW_XP_TABLES as Record<string, { InternalName: string; XpAmounts: number[] }>,
  );

  it('manual step loop produces same result as planCraftingSkill', () => {
    // Run planCraftingSkill
    const autoResult = planCraftingSkill(
      charState, 'Cooking', { targetLevel: 22 },
      recipes, skills, xpTableLookup,
    );

    // Manual step loop
    const sim = initSimulation(
      charState, 'Cooking', { targetLevel: 22 },
      recipes, skills, xpTableLookup,
    );
    while (!isSimulationDone(sim)) {
      if (!stepSimulation(sim)) break;
    }
    const manualResult = buildPlanResult(sim);

    // Results should be identical
    expect(manualResult.skill).toBe(autoResult.skill);
    expect(manualResult.startLevel).toBe(autoResult.startLevel);
    expect(manualResult.endLevel).toBe(autoResult.endLevel);
    expect(manualResult.targetReached).toBe(autoResult.targetReached);
    expect(manualResult.totalCrafts).toBe(autoResult.totalCrafts);
    expect(manualResult.totalXpGained).toBe(autoResult.totalXpGained);
    expect(manualResult.totalEffort).toBe(autoResult.totalEffort);
    expect(manualResult.levelUps).toBe(autoResult.levelUps);

    // Steps should match
    expect(manualResult.steps.length).toBe(autoResult.steps.length);
    for (let i = 0; i < manualResult.steps.length; i++) {
      expect(manualResult.steps[i].recipeId).toBe(autoResult.steps[i].recipeId);
      expect(manualResult.steps[i].xpGained).toBe(autoResult.steps[i].xpGained);
    }
  });

  it('can stop early and resume', () => {
    const sim = initSimulation(
      charState, 'Cooking', { targetLevel: 22 },
      recipes, skills, xpTableLookup,
    );

    // Step 5 times
    for (let i = 0; i < 5; i++) {
      if (isSimulationDone(sim)) break;
      stepSimulation(sim);
    }

    const midwayLevel = sim.currentLevel;
    const midwaySteps = sim.steps.length;
    expect(midwaySteps).toBeLessThanOrEqual(5);

    // Continue until done
    while (!isSimulationDone(sim)) {
      if (!stepSimulation(sim)) break;
    }

    const result = buildPlanResult(sim);
    expect(result.endLevel).toBeGreaterThanOrEqual(midwayLevel);
    expect(result.steps.length).toBeGreaterThan(midwaySteps);
    expect(result.targetReached).toBe(true);
  });
});
