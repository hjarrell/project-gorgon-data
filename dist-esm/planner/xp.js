/**
 * Build a lookup from XP table InternalName → XpAmounts array.
 * Index 0 = XP to go from level 0→1, index 1 = level 1→2, etc.
 */
export function buildXpTableLookup(raw) {
    const lookup = new Map();
    for (const entry of Object.values(raw)) {
        lookup.set(entry.InternalName, entry.XpAmounts);
    }
    return lookup;
}
/**
 * Get the XP required to advance from `level` to `level + 1`.
 * Returns 0 if the level is beyond the table (max level reached).
 */
export function getXpRequiredForLevel(xpTableName, level, lookup) {
    const amounts = lookup.get(xpTableName);
    if (!amounts) {
        throw new Error(`Unknown XP table: "${xpTableName}"`);
    }
    if (level < 0 || level >= amounts.length) {
        return 0; // at or beyond max level
    }
    return amounts[level];
}
// ============================================================
// Drop-off Calculation
// ============================================================
/**
 * Calculate the XP multiplier due to recipe drop-off at higher skill levels.
 *
 * Formula: multiplier = max(dropOffPct, 0.5 ^ (levelsAbove / dropOffRate))
 * where levelsAbove = max(0, skillLevel - dropOffLevel).
 *
 * Returns 1.0 if the recipe has no drop-off fields.
 */
export function calcDropOffMultiplier(skillLevel, dropOffLevel, dropOffRate, dropOffPct) {
    if (dropOffLevel == null || dropOffRate == null || dropOffPct == null) {
        return 1.0;
    }
    const levelsAbove = Math.max(0, skillLevel - dropOffLevel);
    if (levelsAbove === 0) {
        return 1.0;
    }
    const rawMultiplier = Math.pow(0.5, levelsAbove / dropOffRate);
    return Math.max(dropOffPct, rawMultiplier);
}
// ============================================================
// Effective XP Calculation
// ============================================================
/**
 * Calculate the effective XP for a single craft of a recipe.
 *
 * - First craft (completionCount === 0): uses RewardSkillXpFirstTime as base.
 * - Subsequent crafts: uses RewardSkillXp with drop-off applied.
 * - craftingXpMod: character's CRAFTING_XP_EARNED_MOD stat (default 1.0).
 *   Applied unless the recipe has RewardAllowBonusXp === false.
 */
export function calcRecipeXp(recipe, skillLevel, completionCount, craftingXpMod = 1.0) {
    const isFirstCraft = completionCount === 0;
    let baseXp;
    if (isFirstCraft) {
        baseXp = recipe.RewardSkillXpFirstTime;
    }
    else {
        baseXp = recipe.RewardSkillXp;
        // Apply drop-off for non-first crafts
        const multiplier = calcDropOffMultiplier(skillLevel, recipe.RewardSkillXpDropOffLevel, recipe.RewardSkillXpDropOffRate, recipe.RewardSkillXpDropOffPct);
        baseXp = Math.floor(baseXp * multiplier);
    }
    // Apply crafting XP mod (unless recipe opts out)
    if (recipe.RewardAllowBonusXp !== false && craftingXpMod !== 1.0) {
        baseXp = Math.floor(baseXp * craftingXpMod);
    }
    return baseXp;
}
// ============================================================
// Recipe Effort Calculation
// ============================================================
/**
 * Calculate the total effort cost of crafting a recipe once.
 *
 * Effort = sum of (stackSize * chanceToConsume * itemEffort) for each ingredient.
 * - ChanceToConsume defaults to 1.0 (fully consumed) when absent.
 * - Items not in the effort map default to effort 1.0.
 * - Keyword-based ingredients (ItemKeys, no ItemCode) default to effort 1.0.
 */
export function calcRecipeEffort(recipe, itemEffort) {
    let total = 0;
    for (const ingredient of recipe.Ingredients) {
        const chance = ingredient.ChanceToConsume ?? 1.0;
        const effort = (ingredient.ItemCode != null && itemEffort?.get(ingredient.ItemCode)) || 1.0;
        total += ingredient.StackSize * chance * effort;
    }
    return total;
}
