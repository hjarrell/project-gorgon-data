import type { Board, IdSource, Tile } from './types';
import { getAllValidMoves } from './matching';
import { findMatches } from './matching';

/**
 * Reshuffle the board if no valid moves exist.
 *
 * Preserves tile count per type but assigns new IDs to all tiles.
 * Uses Fisher-Yates on the tile types, then checks for valid moves.
 * If the shuffle produces pre-existing matches, tries again (max 100 iterations).
 *
 * Returns the (possibly reshuffled) board and whether a reshuffle occurred.
 */
export function reshuffleIfDead(
  board: Board,
  K: number,
  boardSize: number,
  idSrc: IdSource,
  rng: () => number = Math.random,
): { board: Board; reshuffled: boolean } {
  if (getAllValidMoves(board, boardSize).length > 0) {
    return { board, reshuffled: false };
  }

  // Collect all tile types from the board
  const types: number[] = [];
  for (const tile of board) {
    if (tile) types.push(tile.type);
  }

  for (let attempt = 0; attempt < 100; attempt++) {
    // Fisher-Yates shuffle
    const shuffled = [...types];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    // Build new board with fresh IDs
    const newBoard: Board = shuffled.map((type) => ({
      id: idSrc.next(),
      type,
    }));

    // Check: no pre-existing matches AND at least one valid move
    if (
      findMatches(newBoard, boardSize).length === 0 &&
      getAllValidMoves(newBoard, boardSize).length > 0
    ) {
      return { board: newBoard, reshuffled: true };
    }
  }

  // Fallback: return the last shuffle attempt even if imperfect
  const fallback: Board = types.map((type) => ({
    id: idSrc.next(),
    type,
  }));
  return { board: fallback, reshuffled: true };
}
