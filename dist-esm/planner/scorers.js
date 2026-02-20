/** Pick the recipe with the highest raw XP per craft. */
export const xpScorer = (_recipe, xp) => xp;
/** Pick the recipe with the highest XP per unit of effort. */
export const efficientScorer = (_recipe, xp, effort) => effort > 0 ? xp / effort : xp;
