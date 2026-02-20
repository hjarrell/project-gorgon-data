import { initSimulation, stepSimulation, isSimulationDone, buildPlanResult } from './simulation';
// ============================================================
// Greedy Crafting Planner
// ============================================================
/**
 * Plan a greedy sequence of crafts to level a single skill as fast as possible.
 *
 * The planner picks the recipe yielding the highest score at each step,
 * simulating level-ups and first-time bonuses as they are consumed.
 *
 * For step-by-step control, use `initSimulation` + `stepSimulation` directly.
 *
 * @param characterState - The character's current state (skills, recipe completions, stats)
 * @param targetSkill    - The skill to level (must match recipe RewardSkill values)
 * @param options        - Target level, scoring strategy, and optional constraints
 * @param allRecipes     - All game recipes (from data/index.ts)
 * @param allSkills      - All game skills (from data/index.ts)
 * @param xpTableLookup  - Map of XP table InternalName → XpAmounts (from buildXpTableLookup)
 */
export function planCraftingSkill(characterState, targetSkill, options, allRecipes, allSkills, xpTableLookup) {
    const state = initSimulation(characterState, targetSkill, options, allRecipes, allSkills, xpTableLookup);
    while (!isSimulationDone(state)) {
        if (!stepSimulation(state))
            break;
    }
    return buildPlanResult(state);
}
