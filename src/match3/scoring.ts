import type { CascadeStep, Match, TurnEffect } from './types';

/**
 * Score for a single match.
 * score = N + max(N - 3, 0) where N = match length.
 * 3-match → 3, 4-match → 5, 5-match → 7, etc.
 */
export function scoreMatch(match: Match): number {
  const N = match.positions.length;
  return N + Math.max(N - 3, 0);
}

/**
 * Score for all matches in one cascade level.
 * Each match gets its own score plus cascadeLevel * 3 bonus.
 */
export function scoreCascadeLevel(
  matches: Match[],
  cascadeLevel: number,
): number {
  let total = 0;
  for (const m of matches) {
    total += scoreMatch(m) + cascadeLevel * 3;
  }
  return total;
}

/**
 * Compute the turn effect from the entire turn's cascade steps.
 * Examines max match length across all matches in all cascade levels.
 * 5+ → 'extra', 4 → 'refund', otherwise → 'none'.
 */
export function computeTurnEffect(cascadeSteps: CascadeStep[]): TurnEffect {
  let maxLen = 0;
  for (const step of cascadeSteps) {
    for (const m of step.matches) {
      if (m.positions.length > maxLen) maxLen = m.positions.length;
    }
  }
  if (maxLen >= 5) return 'extra';
  if (maxLen >= 4) return 'refund';
  return 'none';
}
