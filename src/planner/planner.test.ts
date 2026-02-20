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
} from './index';
import type { ItemEffortMap } from './index';
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

  it('returns 0.5 at dropOffLevel + dropOffRate', () => {
    expect(calcDropOffMultiplier(15, 10, 5, 0.1)).toBeCloseTo(0.5);
  });

  it('returns 0.25 at dropOffLevel + 2*dropOffRate', () => {
    expect(calcDropOffMultiplier(20, 10, 5, 0.1)).toBeCloseTo(0.25);
  });

  it('clamps to dropOffPct floor', () => {
    // At level 50, dropOff from level 10 = 40 levels above, rate 5 → 0.5^8 = 0.0039
    // Clamped to 0.1
    expect(calcDropOffMultiplier(50, 10, 5, 0.1)).toBe(0.1);
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
    // Level 25 = 5 above dropOff 20, rate 5 → mult 0.5 → 50 XP
    expect(calcRecipeXp(mockRecipe, 25, 1)).toBe(50);
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
