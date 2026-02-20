import { describe, it, expect } from 'vitest';
import { CharacterState } from '../character-state';
import { recipes, skills, RAW_XP_TABLES } from '../data';
import {
  buildXpTableLookup,
  calcDropOffMultiplier,
  calcRecipeXp,
  calcRecipeEffort,
  planCraftingSkill,
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
