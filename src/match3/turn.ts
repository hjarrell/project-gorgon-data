import type { Board, CollectionOpts, IdSource, Pos, TurnResult } from './types';
import { idx } from './board';
import { findMatches } from './matching';
import { applyGravity, spawnNewTiles } from './gravity';
import { computeTurnEffect, scoreCascadeLevel } from './scoring';
import { MAX_K } from './constants';

/**
 * Apply a player's swap and resolve the full cascade.
 *
 * Returns a TurnResult with all cascade steps pre-computed. Does NOT mutate
 * any input. The final cascadeStep's boardAfterFill is the board state to
 * store for the next turn.
 *
 * When `collection` opts are provided, the engine checks the collection
 * threshold after each cascade step's clears and bumps K immediately, so
 * newly-spawned tiles can include the unlocked gem type within the same
 * cascade.
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
  collection?: CollectionOpts,
): TurnResult {
  const typeClears = new Array(MAX_K).fill(0);
  let currentK = K;
  let collectionEvents = 0;
  const workingCounters = collection ? [...collection.counters] : null;

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
          if (tile) {
            typeClears[tile.type]++;
            if (workingCounters) workingCounters[tile.type]++;
          }
          boardAfterClear[i] = null;
        }
      }
    }

    // Mid-cascade collection check: bump K before spawning new tiles
    if (workingCounters && collection) {
      let collected = false;
      for (let t = 0; t < currentK; t++) {
        if (workingCounters[t] >= collection.threshold) {
          collected = true;
          break;
        }
      }
      if (collected) {
        workingCounters.fill(0);
        currentK = Math.min(currentK + 1, collection.maxK);
        collectionEvents++;
      }
    }

    // Gravity
    const boardAfterGravity = applyGravity(boardAfterClear, boardSize);

    // Spawn new tiles (using potentially updated K)
    const { board: boardAfterFill, origins } = spawnNewTiles(
      boardAfterGravity,
      currentK,
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
    finalK: currentK,
    collectionEvents,
    finalCounters: workingCounters ?? undefined,
  };
}
