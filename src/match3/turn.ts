import type { Board, IdSource, Pos, TurnResult } from './types';
import { idx } from './board';
import { findMatches } from './matching';
import { applyGravity, spawnNewTiles } from './gravity';
import { computeTurnEffect, scoreCascadeLevel } from './scoring';

/**
 * Apply a player's swap and resolve the full cascade.
 *
 * Returns a TurnResult with all cascade steps pre-computed. Does NOT mutate
 * any input. The final cascadeStep's boardAfterFill is the board state to
 * store for the next turn.
 *
 * Returns a TurnResult with empty cascadeSteps if the swap produces no
 * matches (caller should treat this as an invalid/no-op move).
 */
export function applyMove(
  board: Board,
  a: Pos,
  b: Pos,
  K: number,
  boardSize: number,
  idSrc: IdSource,
  rng: () => number = Math.random,
): TurnResult {
  const typeClears = new Array(K).fill(0);
  const ai = idx(a.row, a.col, boardSize);
  const bi = idx(b.row, b.col, boardSize);

  // Perform the swap
  let current = [...board];
  current[ai] = board[bi];
  current[bi] = board[ai];

  const cascadeSteps: TurnResult['cascadeSteps'] = [];
  let cascadeLevel = 0;
  let totalScore = 0;

  // Cascade loop
  while (true) {
    const matches = findMatches(current, boardSize);
    if (matches.length === 0) break;

    // Clear matched positions (set to null)
    const boardAfterClear = [...current];
    const cleared = new Set<number>();
    for (const m of matches) {
      for (const p of m.positions) {
        const i = idx(p.row, p.col, boardSize);
        if (!cleared.has(i)) {
          cleared.add(i);
          const tile = boardAfterClear[i];
          if (tile) typeClears[tile.type]++;
          boardAfterClear[i] = null;
        }
      }
    }

    // Gravity
    const boardAfterGravity = applyGravity(boardAfterClear, boardSize);

    // Spawn new tiles
    const { board: boardAfterFill, origins } = spawnNewTiles(
      boardAfterGravity,
      K,
      boardSize,
      idSrc,
      rng,
    );

    // Score
    const scoreGained = scoreCascadeLevel(matches, cascadeLevel);
    totalScore += scoreGained;

    cascadeSteps.push({
      cascadeLevel,
      matches,
      boardAfterClear,
      boardAfterGravity,
      boardAfterFill,
      newTileOrigins: origins,
      scoreGained,
    });

    current = boardAfterFill;
    cascadeLevel++;
  }

  return {
    cascadeSteps,
    totalScoreGained: totalScore,
    turnEffect: computeTurnEffect(cascadeSteps),
    typeClears,
  };
}
