import { describe, it, expect } from 'vitest';
import { items, recipes } from '../data';
import {
  getItemByCode,
  getItemName,
  buildKeywordIndex,
  findItemsByKeyword,
  findItemsByKeywords,
  resolveRecipeIngredients,
  resolveRecipeResults,
  resolveRecipe,
} from './index';
import { groupStepsIntoRuns } from '../planner';
import type { CraftStep } from '../planner';

// ============================================================
// Item Helpers
// ============================================================

describe('getItemByCode', () => {
  it('returns Butter for ItemCode 5011', () => {
    const item = getItemByCode(5011, items);
    expect(item).toBeDefined();
    expect(item!.Name).toBe('Butter');
  });

  it('returns undefined for nonexistent ItemCode', () => {
    expect(getItemByCode(999999, items)).toBeUndefined();
  });
});

describe('getItemName', () => {
  it('returns item name for known ItemCode', () => {
    expect(getItemName(5011, items)).toBe('Butter');
  });

  it('returns fallback for unknown ItemCode', () => {
    expect(getItemName(999999, items)).toBe('Item #999999');
  });
});

// ============================================================
// Keyword Helpers
// ============================================================

describe('buildKeywordIndex', () => {
  const index = buildKeywordIndex(items);

  it('indexes scored keywords with correct score values', () => {
    const fruitItems = index.get('Fruit');
    expect(fruitItems).toBeDefined();
    expect(fruitItems!.length).toBeGreaterThan(0);

    // Red Apple has Fruit=20
    const redApple = fruitItems!.find(m => m.item.Name === 'Red Apple');
    expect(redApple).toBeDefined();
    expect(redApple!.score).toBe(20);
  });

  it('indexes bare keywords without scores', () => {
    const toxicFrog = index.get('ToxicFrogSkin');
    expect(toxicFrog).toBeDefined();
    expect(toxicFrog!.length).toBeGreaterThan(0);
    // Bare keywords have no score
    expect(toxicFrog![0].score).toBeUndefined();
  });

  it('indexes colon-style keywords as-is', () => {
    // Items with "EquipmentSlot:MainHand" should appear under that exact key
    // (no = sign, so stored as bare keyword)
    const equipment = index.get('Equipment');
    expect(equipment).toBeDefined();
    expect(equipment!.length).toBeGreaterThan(100);
  });

  it('extracts itemCode from itemKey', () => {
    const fruitItems = index.get('Fruit')!;
    for (const match of fruitItems) {
      expect(match.itemCode).toBeGreaterThan(0);
      expect(match.itemKey).toBe(`item_${match.itemCode}`);
    }
  });
});

describe('findItemsByKeyword', () => {
  const index = buildKeywordIndex(items);

  it('returns items matching a keyword', () => {
    const matches = findItemsByKeyword('ToxicFrogSkin', index);
    expect(matches.length).toBeGreaterThan(0);
    // Toxic Frog Skin item should be in there
    expect(matches.some(m => m.item.Name === 'Toxic Frog Skin')).toBe(true);
  });

  it('returns empty array for nonexistent keyword', () => {
    expect(findItemsByKeyword('CompletelyFakeKeyword', index)).toEqual([]);
  });
});

describe('findItemsByKeywords', () => {
  const index = buildKeywordIndex(items);

  it('intersects multiple positive keywords', () => {
    // Items that are both "Edible" AND "Fruit"
    const matches = findItemsByKeywords(['Edible', 'Fruit'], index);
    expect(matches.length).toBeGreaterThan(0);

    // Every match should have both keywords
    for (const match of matches) {
      const keywords = match.item.Keywords ?? [];
      const bareKeywords = keywords.map(k => k.split('=')[0]);
      expect(bareKeywords).toContain('Edible');
      expect(bareKeywords).toContain('Fruit');
    }

    // Should be fewer than either keyword alone
    const edibleOnly = findItemsByKeyword('Edible', index);
    const fruitOnly = findItemsByKeyword('Fruit', index);
    expect(matches.length).toBeLessThan(edibleOnly.length);
    expect(matches.length).toBeLessThanOrEqual(fruitOnly.length);
  });

  it('excludes negated keywords', () => {
    // Meat but not CheapMeat
    const withoutExclusion = findItemsByKeyword('Meat', index);
    const withExclusion = findItemsByKeywords(['Meat', '!CheapMeat'], index);

    expect(withExclusion.length).toBeGreaterThan(0);
    expect(withExclusion.length).toBeLessThan(withoutExclusion.length);

    // None of the results should be CheapMeat
    for (const match of withExclusion) {
      const keywords = match.item.Keywords ?? [];
      const bareKeywords = keywords.map(k => k.split('=')[0]);
      expect(bareKeywords).not.toContain('CheapMeat');
    }
  });

  it('returns empty array for no positive keywords', () => {
    expect(findItemsByKeywords(['!Fruit'], index)).toEqual([]);
  });
});

// ============================================================
// Recipe Helpers
// ============================================================

describe('resolveRecipeIngredients', () => {
  const index = buildKeywordIndex(items);

  it('resolves ItemCode-based ingredients to Items', () => {
    // Find Butter recipe
    let butterRecipe;
    for (const [, recipe] of recipes) {
      if (recipe.InternalName === 'Butter') {
        butterRecipe = recipe;
        break;
      }
    }
    expect(butterRecipe).toBeDefined();

    const resolved = resolveRecipeIngredients(butterRecipe!, items);
    expect(resolved.length).toBe(butterRecipe!.Ingredients.length);

    // All ItemCode-based ingredients should have resolved items
    for (const ri of resolved) {
      if (ri.ingredient.ItemCode != null) {
        expect(ri.item).toBeDefined();
        expect(ri.itemName).not.toContain('Item #');
        expect(ri.itemCode).toBe(ri.ingredient.ItemCode);
      }
    }
  });

  it('resolves keyword-based ingredients with keyword matches', () => {
    // Find a recipe with ItemKeys-based ingredients
    let keywordRecipe;
    let keywordRecipeId = '';
    for (const [id, recipe] of recipes) {
      const hasKeywordIng = recipe.Ingredients.some(i => i.ItemKeys && i.ItemKeys.length > 0);
      if (hasKeywordIng) {
        keywordRecipe = recipe;
        keywordRecipeId = id;
        break;
      }
    }

    if (!keywordRecipe) return; // skip if none found

    const resolved = resolveRecipeIngredients(keywordRecipe, items, index);
    const keywordIng = resolved.find(ri => ri.keywordMatches != null);
    expect(keywordIng).toBeDefined();
    expect(keywordIng!.keywordMatches!.length).toBeGreaterThan(0);
  });

  it('works without keyword index (keywordMatches is undefined)', () => {
    let keywordRecipe;
    for (const [, recipe] of recipes) {
      if (recipe.Ingredients.some(i => i.ItemKeys && i.ItemKeys.length > 0)) {
        keywordRecipe = recipe;
        break;
      }
    }

    if (!keywordRecipe) return;

    const resolved = resolveRecipeIngredients(keywordRecipe, items);
    const keywordIng = resolved.find(ri => ri.ingredient.ItemKeys && ri.ingredient.ItemKeys.length > 0);
    expect(keywordIng).toBeDefined();
    expect(keywordIng!.keywordMatches).toBeUndefined();
  });
});

describe('resolveRecipeResults', () => {
  it('resolves result items to Items', () => {
    let butterRecipe;
    for (const [, recipe] of recipes) {
      if (recipe.InternalName === 'Butter') {
        butterRecipe = recipe;
        break;
      }
    }
    expect(butterRecipe).toBeDefined();

    const results = resolveRecipeResults(butterRecipe!, items);
    expect(results.length).toBe(butterRecipe!.ResultItems.length);

    for (const ri of results) {
      expect(ri.item).toBeDefined();
      expect(ri.itemName).not.toContain('Item #');
    }
  });
});

describe('resolveRecipe', () => {
  it('resolves both ingredients and results', () => {
    let butterRecipeId = '';
    let butterRecipe;
    for (const [id, recipe] of recipes) {
      if (recipe.InternalName === 'Butter') {
        butterRecipeId = id;
        butterRecipe = recipe;
        break;
      }
    }
    expect(butterRecipe).toBeDefined();

    const resolved = resolveRecipe(butterRecipeId, butterRecipe!, items);
    expect(resolved.recipeId).toBe(butterRecipeId);
    expect(resolved.recipe).toBe(butterRecipe);
    expect(resolved.ingredients.length).toBe(butterRecipe!.Ingredients.length);
    expect(resolved.results.length).toBe(butterRecipe!.ResultItems.length);
  });
});

// ============================================================
// Step Grouping
// ============================================================

describe('groupStepsIntoRuns', () => {
  const makeStep = (name: string, xp: number, effort: number, levelBefore: number, levelAfter: number, isFirst = false): CraftStep => ({
    recipeId: `recipe_${name}`,
    recipeName: name,
    internalName: name,
    xpGained: xp,
    effortCost: effort,
    isFirstCraft: isFirst,
    skillLevelBefore: levelBefore,
    skillLevelAfter: levelAfter,
  });

  it('groups consecutive same-recipe steps', () => {
    const steps = [
      makeStep('Butter', 100, 5, 10, 10),
      makeStep('Butter', 100, 5, 10, 10),
      makeStep('Butter', 100, 5, 10, 11),
    ];

    const runs = groupStepsIntoRuns(steps);
    expect(runs.length).toBe(1);
    expect(runs[0].count).toBe(3);
    expect(runs[0].totalXp).toBe(300);
    expect(runs[0].totalEffort).toBe(15);
    expect(runs[0].levelStart).toBe(10);
    expect(runs[0].levelEnd).toBe(11);
    expect(runs[0].steps.length).toBe(3);
  });

  it('creates separate runs for different recipes', () => {
    const steps = [
      makeStep('Butter', 100, 5, 10, 10),
      makeStep('Cheese', 200, 8, 10, 11),
      makeStep('Butter', 100, 5, 11, 11),
    ];

    const runs = groupStepsIntoRuns(steps);
    expect(runs.length).toBe(3);
    expect(runs[0].internalName).toBe('Butter');
    expect(runs[0].count).toBe(1);
    expect(runs[1].internalName).toBe('Cheese');
    expect(runs[1].count).toBe(1);
    expect(runs[2].internalName).toBe('Butter');
    expect(runs[2].count).toBe(1);
  });

  it('returns empty array for empty steps', () => {
    expect(groupStepsIntoRuns([])).toEqual([]);
  });

  it('tracks firstCrafts correctly', () => {
    const steps = [
      makeStep('Butter', 400, 5, 10, 10, true),
      makeStep('Butter', 100, 5, 10, 10),
      makeStep('Butter', 100, 5, 10, 11),
    ];

    const runs = groupStepsIntoRuns(steps);
    expect(runs[0].firstCrafts).toBe(1);
  });

  it('includes recipeId from steps', () => {
    const steps = [makeStep('Butter', 100, 5, 10, 10)];
    const runs = groupStepsIntoRuns(steps);
    expect(runs[0].recipeId).toBe('recipe_Butter');
  });
});
