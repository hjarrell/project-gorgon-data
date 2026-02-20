// ============================================================
// Grouping Function
// ============================================================
/**
 * Group consecutive crafts of the same recipe into runs.
 *
 * E.g., [Butter, Butter, Butter, Cheese, Cheese, Butter] becomes
 * three runs: Butter x3, Cheese x2, Butter x1.
 */
export function groupStepsIntoRuns(steps) {
    const runs = [];
    for (const step of steps) {
        const last = runs[runs.length - 1];
        if (last && last.internalName === step.internalName) {
            last.count++;
            last.totalXp += step.xpGained;
            last.totalEffort += step.effortCost;
            last.levelEnd = step.skillLevelAfter;
            if (step.isFirstCraft)
                last.firstCrafts++;
            last.steps.push(step);
        }
        else {
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
