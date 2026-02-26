import type { Board, IdSource, Tile } from './types';
import { idx } from './board';

/**
 * Apply gravity: tiles fall down to fill empty (null) slots in each column.
 * Returns a new board. Null slots bubble to the top.
 */
export function applyGravity(board: Board, boardSize: number): Board {
  const result: Board = new Array(boardSize * boardSize).fill(null);

  for (let c = 0; c < boardSize; c++) {
    // Collect non-null tiles in this column, top to bottom
    const tiles: Tile[] = [];
    for (let r = 0; r < boardSize; r++) {
      const tile = board[idx(r, c, boardSize)];
      if (tile) tiles.push(tile);
    }

    // Pack them to the bottom of the column
    const emptyRows = boardSize - tiles.length;
    for (let r = 0; r < emptyRows; r++) {
      result[idx(r, c, boardSize)] = null;
    }
    for (let i = 0; i < tiles.length; i++) {
      result[idx(emptyRows + i, c, boardSize)] = tiles[i];
    }
  }

  return result;
}

/**
 * Fill all null slots with new random tiles.
 * Returns the filled board and a map of newTileId → number of rows above
 * the board the tile originated from (for drop animation offsets).
 *
 * For each column, null slots are at the top after gravity. The topmost null
 * gets origin = -(nullCount), next = -(nullCount-1), etc.
 */
export function spawnNewTiles(
  board: Board,
  K: number,
  boardSize: number,
  idSrc: IdSource,
  rng: () => number = Math.random,
): { board: Board; origins: Map<number, number> } {
  const result = [...board];
  const origins = new Map<number, number>();

  for (let c = 0; c < boardSize; c++) {
    // Count null slots from top
    let nullCount = 0;
    for (let r = 0; r < boardSize; r++) {
      if (!result[idx(r, c, boardSize)]) nullCount++;
      else break; // After gravity, all nulls are at top
    }

    // Fill them
    for (let i = 0; i < nullCount; i++) {
      const r = i; // row index (from top)
      const tile: Tile = { id: idSrc.next(), type: Math.floor(rng() * K) };
      result[idx(r, c, boardSize)] = tile;
      // Origin: how many rows above the board this tile "falls from"
      origins.set(tile.id, -(nullCount - i));
    }
  }

  return { board: result, origins };
}
