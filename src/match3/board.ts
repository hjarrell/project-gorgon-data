import type { Board, IdSource, Pos, Tile } from './types';

/** Board index from row + col. */
export function idx(row: number, col: number, boardSize: number): number {
  return row * boardSize + col;
}

/** Row + col from flat board index. */
export function posFromIdx(index: number, boardSize: number): Pos {
  return { row: Math.floor(index / boardSize), col: index % boardSize };
}

/** Create an IdSource starting from the given value. */
export function createIdSource(start = 0): IdSource {
  let current = start;
  return { next: () => current++ };
}

/** Create a single random tile. */
export function randomTile(
  K: number,
  idSrc: IdSource,
  rng: () => number = Math.random,
): Tile {
  return { id: idSrc.next(), type: Math.floor(rng() * K) };
}

/**
 * Generate a fresh board with no pre-existing matches.
 *
 * Places tiles left-to-right, top-to-bottom. For each cell, excludes any type
 * that would create a 3-in-a-row horizontally or vertically. With K >= 3 there
 * is always at least one valid type.
 */
export function generateBoard(
  K: number,
  boardSize: number,
  idSrc: IdSource,
  rng: () => number = Math.random,
): Board {
  const board: Board = new Array(boardSize * boardSize).fill(null);

  for (let r = 0; r < boardSize; r++) {
    for (let c = 0; c < boardSize; c++) {
      const forbidden = new Set<number>();

      // Check horizontal: if prev 2 in this row are same type, forbid it
      if (c >= 2) {
        const t1 = board[idx(r, c - 1, boardSize)]?.type;
        const t2 = board[idx(r, c - 2, boardSize)]?.type;
        if (t1 !== undefined && t1 === t2) forbidden.add(t1);
      }

      // Check vertical: if prev 2 in this col are same type, forbid it
      if (r >= 2) {
        const t1 = board[idx(r - 1, c, boardSize)]?.type;
        const t2 = board[idx(r - 2, c, boardSize)]?.type;
        if (t1 !== undefined && t1 === t2) forbidden.add(t1);
      }

      // Pick a random allowed type
      const allowed: number[] = [];
      for (let t = 0; t < K; t++) {
        if (!forbidden.has(t)) allowed.push(t);
      }

      const type = allowed[Math.floor(rng() * allowed.length)];
      board[idx(r, c, boardSize)] = { id: idSrc.next(), type };
    }
  }

  return board;
}
