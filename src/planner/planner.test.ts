import { describe, it, expect } from 'vitest';
import { CharacterState } from '../character-state';
import { recipes, skills, RAW_XP_TABLES } from '../data';
import {
  buildXpTableLookup,
  calcDropOffMultiplier,
  calcRecipeXp,
  planCraftingSkill,
} from './index';
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
});
