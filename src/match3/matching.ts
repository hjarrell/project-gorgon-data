import type { Board, Match, Pos } from './types';
import { idx } from './board';

/**
 * Find all matches on the board (3+ same-type in a row or column).
 *
 * Same-type row and column runs that share at least one tile are merged
 * into a single match (L, T, + shapes). The merged match's `positions`
 * contains all unique tiles and `axis` is omitted. Simple straight-line
 * matches keep their `axis` field.
 */
export function findMatches(board: Board, boardSize: number): Match[] {
  // Step 1: collect raw row and column runs of length >= 3
  interface RawRun {
    positions: Pos[];
    type: number;
    axis: 'row' | 'col';
  }
  const runs: RawRun[] = [];

  // Scan rows
  for (let r = 0; r < boardSize; r++) {
    let runStart = 0;
    for (let c = 1; c <= boardSize; c++) {
      const prev = board[idx(r, c - 1, boardSize)];
      const curr = c < boardSize ? board[idx(r, c, boardSize)] : null;

      if (curr && prev && curr.type === prev.type) continue;

      const runLen = c - runStart;
      if (runLen >= 3 && prev) {
        const positions: Pos[] = [];
        for (let cc = runStart; cc < c; cc++) {
          positions.push({ row: r, col: cc });
        }
        runs.push({ positions, type: prev.type, axis: 'row' });
      }
      runStart = c;
    }
  }

  // Scan columns
  for (let c = 0; c < boardSize; c++) {
    let runStart = 0;
    for (let r = 1; r <= boardSize; r++) {
      const prev = board[idx(r - 1, c, boardSize)];
      const curr = r < boardSize ? board[idx(r, c, boardSize)] : null;

      if (curr && prev && curr.type === prev.type) continue;

      const runLen = r - runStart;
      if (runLen >= 3 && prev) {
        const positions: Pos[] = [];
        for (let rr = runStart; rr < r; rr++) {
          positions.push({ row: rr, col: c });
        }
        runs.push({ positions, type: prev.type, axis: 'col' });
      }
      runStart = r;
    }
  }

  if (runs.length === 0) return [];

  // Step 2: merge same-type runs that share tiles (union-find)
  const parent = runs.map((_, i) => i);
  function find(x: number): number {
    while (parent[x] !== x) {
      parent[x] = parent[parent[x]];
      x = parent[x];
    }
    return x;
  }
  function union(a: number, b: number): void {
    const ra = find(a);
    const rb = find(b);
    if (ra !== rb) parent[ra] = rb;
  }

  // Map each position key to the first run index that contains it
  const posToRun = new Map<string, number>();
  for (let i = 0; i < runs.length; i++) {
    const run = runs[i];
    for (const p of run.positions) {
      const key = `${p.row},${p.col}`;
      const existing = posToRun.get(key);
      if (existing !== undefined && runs[existing].type === run.type) {
        union(i, existing);
      } else if (existing === undefined) {
        posToRun.set(key, i);
      }
    }
  }

  // Step 3: group runs by their root and build merged matches
  const groups = new Map<number, number[]>();
  for (let i = 0; i < runs.length; i++) {
    const root = find(i);
    let arr = groups.get(root);
    if (!arr) {
      arr = [];
      groups.set(root, arr);
    }
    arr.push(i);
  }

  const matches: Match[] = [];
  for (const indices of groups.values()) {
    if (indices.length === 1) {
      // Single run, keep axis
      const run = runs[indices[0]];
      matches.push({ positions: run.positions, type: run.type, axis: run.axis });
    } else {
      // Merged: deduplicate positions
      const seen = new Set<string>();
      const positions: Pos[] = [];
      const type = runs[indices[0]].type;
      for (const i of indices) {
        for (const p of runs[i].positions) {
          const key = `${p.row},${p.col}`;
          if (!seen.has(key)) {
            seen.add(key);
            positions.push(p);
          }
        }
      }
      matches.push({ positions, type });
    }
  }

  return matches;
}

/** True if two positions differ by exactly 1 in exactly one axis. */
export function isAdjacent(a: Pos, b: Pos): boolean {
  return Math.abs(a.row - b.row) + Math.abs(a.col - b.col) === 1;
}

/**
 * Test whether swapping a and b produces at least one match.
 * Does NOT mutate the board. Positions must be adjacent.
 */
export function isValidMove(
  board: Board,
  a: Pos,
  b: Pos,
  boardSize: number,
): boolean {
  if (!isAdjacent(a, b)) return false;

  const ai = idx(a.row, a.col, boardSize);
  const bi = idx(b.row, b.col, boardSize);
  if (!board[ai] || !board[bi]) return false;

  // Create a swapped copy
  const copy = [...board];
  copy[ai] = board[bi];
  copy[bi] = board[ai];

  return findMatches(copy, boardSize).length > 0;
}

/**
 * Return all valid moves on the board.
 * Each move is a [Pos, Pos] pair (a before b in reading order).
 * Empty array = dead board.
 */
export function getAllValidMoves(
  board: Board,
  boardSize: number,
): [Pos, Pos][] {
  const moves: [Pos, Pos][] = [];

  for (let r = 0; r < boardSize; r++) {
    for (let c = 0; c < boardSize; c++) {
      // Check right neighbor
      if (c + 1 < boardSize) {
        const a: Pos = { row: r, col: c };
        const b: Pos = { row: r, col: c + 1 };
        if (isValidMove(board, a, b, boardSize)) {
          moves.push([a, b]);
        }
      }
      // Check down neighbor
      if (r + 1 < boardSize) {
        const a: Pos = { row: r, col: c };
        const b: Pos = { row: r + 1, col: c };
        if (isValidMove(board, a, b, boardSize)) {
          moves.push([a, b]);
        }
      }
    }
  }

  return moves;
}
