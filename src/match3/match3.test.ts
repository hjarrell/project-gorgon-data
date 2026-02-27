import { describe, it, expect } from 'vitest';
import {
  generateBoard,
  createIdSource,
  idx,
  posFromIdx,
  findMatches,
  isAdjacent,
  isValidMove,
  getAllValidMoves,
  applyGravity,
  spawnNewTiles,
  scoreMatch,
  scoreCascadeLevel,
  computeTurnEffect,
  applyMove,
} from './index';
import type { Board, Tile, Match, Pos, CascadeStep } from './types';

// Deterministic RNG for reproducible tests
function seededRng(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0x100000000;
  };
}

/** Helper: build a board from a 2D array of type numbers. */
function boardFromTypes(types: number[][], idSrc = createIdSource()): Board {
  const boardSize = types.length;
  const board: Board = new Array(boardSize * boardSize);
  for (let r = 0; r < boardSize; r++) {
    for (let c = 0; c < boardSize; c++) {
      const t = types[r][c];
      board[idx(r, c, boardSize)] = t >= 0 ? { id: idSrc.next(), type: t } : null;
    }
  }
  return board;
}

/** Helper: extract type grid from board for easy assertion. */
function typesFromBoard(board: Board, boardSize: number): (number | null)[][] {
  const result: (number | null)[][] = [];
  for (let r = 0; r < boardSize; r++) {
    const row: (number | null)[] = [];
    for (let c = 0; c < boardSize; c++) {
      const tile = board[idx(r, c, boardSize)];
      row.push(tile ? tile.type : null);
    }
    result.push(row);
  }
  return result;
}

describe('idx / posFromIdx', () => {
  it('converts between index and position', () => {
    expect(idx(0, 0, 7)).toBe(0);
    expect(idx(0, 6, 7)).toBe(6);
    expect(idx(1, 0, 7)).toBe(7);
    expect(idx(6, 6, 7)).toBe(48);
    expect(posFromIdx(0, 7)).toEqual({ row: 0, col: 0 });
    expect(posFromIdx(7, 7)).toEqual({ row: 1, col: 0 });
    expect(posFromIdx(48, 7)).toEqual({ row: 6, col: 6 });
  });
});

describe('generateBoard', () => {
  it('creates a board of correct size', () => {
    const board = generateBoard(4, 7, createIdSource());
    expect(board.length).toBe(49);
    expect(board.every((t) => t !== null)).toBe(true);
  });

  it('uses only types 0..K-1', () => {
    const board = generateBoard(4, 7, createIdSource());
    for (const tile of board) {
      expect(tile!.type).toBeGreaterThanOrEqual(0);
      expect(tile!.type).toBeLessThan(4);
    }
  });

  it('produces no initial matches', () => {
    const rng = seededRng(42);
    for (let trial = 0; trial < 10; trial++) {
      const board = generateBoard(4, 7, createIdSource(), rng);
      const matches = findMatches(board, 7);
      expect(matches).toHaveLength(0);
    }
  });

  it('assigns unique tile IDs', () => {
    const board = generateBoard(4, 7, createIdSource());
    const ids = new Set(board.map((t) => t!.id));
    expect(ids.size).toBe(49);
  });
});

describe('findMatches', () => {
  it('finds a horizontal 3-match', () => {
    // Row 0: 0 0 0 1 2
    // Row 1: 1 2 1 2 1
    const board = boardFromTypes([
      [0, 0, 0, 1, 2],
      [1, 2, 1, 2, 1],
      [2, 1, 2, 1, 2],
      [1, 2, 1, 2, 1],
      [2, 1, 2, 1, 2],
    ]);
    const matches = findMatches(board, 5);
    expect(matches.length).toBe(1);
    expect(matches[0].axis).toBe('row');
    expect(matches[0].type).toBe(0);
    expect(matches[0].positions).toHaveLength(3);
  });

  it('finds a vertical 3-match', () => {
    const board = boardFromTypes([
      [0, 1, 2, 1, 2],
      [0, 2, 1, 2, 1],
      [0, 1, 2, 1, 2],
      [1, 2, 1, 2, 1],
      [2, 1, 2, 1, 2],
    ]);
    const matches = findMatches(board, 5);
    expect(matches.length).toBe(1);
    expect(matches[0].axis).toBe('col');
    expect(matches[0].type).toBe(0);
    expect(matches[0].positions).toHaveLength(3);
  });

  it('finds a 5-match', () => {
    const board = boardFromTypes([
      [0, 0, 0, 0, 0],
      [1, 2, 1, 2, 1],
      [2, 1, 2, 1, 2],
      [1, 2, 1, 2, 1],
      [2, 1, 2, 1, 2],
    ]);
    const matches = findMatches(board, 5);
    expect(matches.length).toBe(1);
    expect(matches[0].positions).toHaveLength(5);
  });

  it('merges overlapping row and col matches into an L-shape', () => {
    // Col 0: type 0 rows 0-2 (vertical 3)
    // Row 2: type 0 cols 0-2 (horizontal 3)
    // Shared tile at (2,0) → merged into 1 match with 5 unique tiles
    const board = boardFromTypes([
      [0, 1, 2, 1, 2],
      [0, 2, 1, 2, 1],
      [0, 0, 0, 1, 2],
      [1, 2, 1, 2, 1],
      [2, 1, 2, 1, 2],
    ]);
    const matches = findMatches(board, 5);
    expect(matches.length).toBe(1);
    expect(matches[0].type).toBe(0);
    expect(matches[0].positions).toHaveLength(5);
    expect(matches[0].axis).toBeUndefined();
  });

  it('merges L-shape from swap (the classic example)', () => {
    // Post-swap board (4×4):
    // O x x x       (1 = O, different type)
    // Y Y Y x       ← row match cols 0-2
    // Y x x x       ← col match rows 1-3
    // Y x x x
    // Shared tile at (1,0) → 5 unique Y tiles
    const board = boardFromTypes([
      [1, 2, 2, 3],
      [0, 0, 0, 3],
      [0, 2, 2, 3],
      [0, 2, 2, 3],
    ]);
    const matches = findMatches(board, 4);
    // type-0 L-shape (5 tiles) + type-3 column (4 tiles)
    expect(matches.length).toBe(2);
    const lMatch = matches.find((m) => m.type === 0)!;
    expect(lMatch).toBeDefined();
    expect(lMatch.positions).toHaveLength(5);
    expect(lMatch.axis).toBeUndefined(); // merged, no single axis
    const colMatch = matches.find((m) => m.type === 3)!;
    expect(colMatch).toBeDefined();
    expect(colMatch.positions).toHaveLength(4);
    expect(colMatch.axis).toBe('col');
  });

  it('merges + (plus/cross) shape into a single match', () => {
    // After cascade gravity, O forms a + shape:
    //   .  .  .  x  x
    //   x  x  O  x  x
    //   x  x  O  O  O    ← row 3-match at cols 2-4
    //   x  x  O  x  x    ← col 4-match at rows 1-4
    //   x  x  O  x  x
    // Shared tile at (2,2) → 6 unique O tiles
    const board = boardFromTypes([
      [1, 1, 1, 2, 2],   // top row (will be nulls after spawn, but use filler)
      [2, 2, 0, 2, 2],
      [2, 2, 0, 0, 0],
      [2, 2, 0, 2, 2],
      [2, 2, 0, 2, 2],
    ]);
    const matches = findMatches(board, 5);
    const oMatch = matches.find((m) => m.type === 0)!;
    expect(oMatch).toBeDefined();
    expect(oMatch.positions).toHaveLength(6);
    expect(oMatch.axis).toBeUndefined(); // merged cross, no single axis
  });

  it('cascade produces + shape match (user example)', () => {
    // Board before swap:
    //   x x O x x
    //   Y x O x x
    //   Z Y Y O O
    //   x x O x x
    //   x x O x x
    // Swap Y(1,0) with Z(2,0):
    //   x x O x x
    //   Z x O x x       (first: YYY row match at row 2 cols 0-2)
    //   Y Y Y O O       (after clear+gravity: col 2 = O,O,O,O + row 2 = O,O,O → 6-match +)
    //   x x O x x
    //   x x O x x
    const board = boardFromTypes([
      [1, 1, 2, 1, 1],
      [0, 1, 2, 1, 1],
      [3, 0, 0, 2, 2],
      [1, 1, 2, 1, 1],
      [1, 1, 2, 1, 1],
    ]);
    const idSrc = createIdSource(100);
    const rng = seededRng(0);
    const result = applyMove(board, { row: 1, col: 0 }, { row: 2, col: 0 }, 4, 5, idSrc, rng);
    // Should have at least 2 cascade steps: initial YYY clear, then + shaped O clear
    expect(result.cascadeSteps.length).toBeGreaterThanOrEqual(2);
    // The second cascade should contain the merged O match
    const step2 = result.cascadeSteps[1];
    const oMatch = step2.matches.find((m) => m.type === 2)!;
    expect(oMatch).toBeDefined();
    expect(oMatch.positions).toHaveLength(6);
  });

  it('keeps separate matches for different types', () => {
    // Two independent 3-matches of different types
    const board = boardFromTypes([
      [0, 0, 0, 1, 2],
      [2, 1, 2, 1, 2],
      [1, 1, 1, 2, 1],
      [2, 0, 2, 0, 2],
      [1, 2, 1, 2, 1],
    ]);
    const matches = findMatches(board, 5);
    expect(matches.length).toBe(2);
  });

  it('returns empty for no matches', () => {
    const board = boardFromTypes([
      [0, 1, 0, 1, 0],
      [1, 0, 1, 0, 1],
      [0, 1, 0, 1, 0],
      [1, 0, 1, 0, 1],
      [0, 1, 0, 1, 0],
    ]);
    expect(findMatches(board, 5)).toHaveLength(0);
  });
});

describe('isAdjacent', () => {
  it('detects adjacent positions', () => {
    expect(isAdjacent({ row: 0, col: 0 }, { row: 0, col: 1 })).toBe(true);
    expect(isAdjacent({ row: 0, col: 0 }, { row: 1, col: 0 })).toBe(true);
  });

  it('rejects non-adjacent positions', () => {
    expect(isAdjacent({ row: 0, col: 0 }, { row: 1, col: 1 })).toBe(false);
    expect(isAdjacent({ row: 0, col: 0 }, { row: 0, col: 2 })).toBe(false);
    expect(isAdjacent({ row: 0, col: 0 }, { row: 0, col: 0 })).toBe(false);
  });
});

describe('isValidMove', () => {
  it('accepts a swap that creates a match', () => {
    // Swapping (0,2) and (0,3) creates 0,0,0 in row 0
    const board = boardFromTypes([
      [0, 0, 1, 0, 2],
      [1, 2, 0, 2, 1],
      [2, 1, 2, 1, 2],
      [1, 2, 1, 2, 1],
      [2, 1, 2, 1, 2],
    ]);
    expect(isValidMove(board, { row: 0, col: 2 }, { row: 0, col: 3 }, 5)).toBe(true);
  });

  it('rejects a swap that creates no match', () => {
    const board = boardFromTypes([
      [0, 1, 2, 3, 0],
      [1, 2, 3, 0, 1],
      [2, 3, 0, 1, 2],
      [3, 0, 1, 2, 3],
      [0, 1, 2, 3, 0],
    ]);
    expect(isValidMove(board, { row: 0, col: 0 }, { row: 0, col: 1 }, 5)).toBe(false);
  });

  it('rejects non-adjacent swap', () => {
    const board = boardFromTypes([
      [0, 0, 1, 0, 0],
      [1, 2, 0, 2, 1],
      [2, 1, 2, 1, 2],
      [1, 2, 1, 2, 1],
      [2, 1, 2, 1, 2],
    ]);
    expect(isValidMove(board, { row: 0, col: 0 }, { row: 0, col: 2 }, 5)).toBe(false);
  });
});

describe('applyGravity', () => {
  it('drops tiles down to fill nulls', () => {
    const idSrc = createIdSource();
    // Col 0 has null at row 1
    const board = boardFromTypes(
      [
        [0, 1, 2],
        [-1, 2, 1],
        [1, 0, 2],
      ],
      idSrc,
    );
    const result = applyGravity(board, 3);
    const types = typesFromBoard(result, 3);
    expect(types).toEqual([
      [null, 1, 2],
      [0, 2, 1],
      [1, 0, 2],
    ]);
  });

  it('handles multiple nulls in a column', () => {
    const board = boardFromTypes(
      [
        [-1, 1, 2],
        [-1, 2, 1],
        [1, 0, 2],
      ],
    );
    const result = applyGravity(board, 3);
    const types = typesFromBoard(result, 3);
    expect(types).toEqual([
      [null, 1, 2],
      [null, 2, 1],
      [1, 0, 2],
    ]);
  });

  it('preserves fully populated columns', () => {
    const board = boardFromTypes([
      [0, 1, 2],
      [1, 2, 0],
      [2, 0, 1],
    ]);
    const result = applyGravity(board, 3);
    const types = typesFromBoard(result, 3);
    expect(types).toEqual([
      [0, 1, 2],
      [1, 2, 0],
      [2, 0, 1],
    ]);
  });
});

describe('spawnNewTiles', () => {
  it('fills null slots with new tiles', () => {
    const board = boardFromTypes([
      [-1, 1, 2],
      [-1, 2, 1],
      [1, 0, 2],
    ]);
    const idSrc = createIdSource(100);
    const { board: filled, origins } = spawnNewTiles(board, 4, 3, idSrc);

    // No nulls remain
    expect(filled.every((t) => t !== null)).toBe(true);

    // New tiles have origins (negative row offsets)
    expect(origins.size).toBe(2);
    for (const [, origin] of origins) {
      expect(origin).toBeLessThan(0);
    }
  });
});

describe('scoring', () => {
  it('scores a 3-match as 3', () => {
    const match: Match = {
      positions: [
        { row: 0, col: 0 },
        { row: 0, col: 1 },
        { row: 0, col: 2 },
      ],
      type: 0,
      axis: 'row',
    };
    expect(scoreMatch(match)).toBe(3);
  });

  it('scores a 4-match as 5', () => {
    const match: Match = {
      positions: [
        { row: 0, col: 0 },
        { row: 0, col: 1 },
        { row: 0, col: 2 },
        { row: 0, col: 3 },
      ],
      type: 0,
      axis: 'row',
    };
    expect(scoreMatch(match)).toBe(5);
  });

  it('scores a 5-match as 7', () => {
    const match: Match = {
      positions: Array.from({ length: 5 }, (_, i) => ({ row: 0, col: i })),
      type: 0,
      axis: 'row',
    };
    expect(scoreMatch(match)).toBe(7);
  });

  it('adds cascade bonus per match', () => {
    const matches: Match[] = [
      {
        positions: [
          { row: 0, col: 0 },
          { row: 0, col: 1 },
          { row: 0, col: 2 },
        ],
        type: 0,
        axis: 'row',
      },
    ];
    // Cascade level 0: 3 + 0 = 3
    expect(scoreCascadeLevel(matches, 0)).toBe(3);
    // Cascade level 1: 3 + 3 = 6
    expect(scoreCascadeLevel(matches, 1)).toBe(6);
    // Cascade level 2: 3 + 6 = 9
    expect(scoreCascadeLevel(matches, 2)).toBe(9);
  });

  it('computes turn effect from cascade steps', () => {
    const makeStep = (matchLen: number): CascadeStep => ({
      cascadeLevel: 0,
      matches: [
        {
          positions: Array.from({ length: matchLen }, (_, i) => ({ row: 0, col: i })),
          type: 0,
          axis: 'row',
        },
      ],
      boardAfterClear: [],
      boardAfterGravity: [],
      boardAfterFill: [],
      newTileOrigins: new Map(),
      scoreGained: 0,
    });

    expect(computeTurnEffect([makeStep(3)])).toBe('none');
    expect(computeTurnEffect([makeStep(4)])).toBe('refund');
    expect(computeTurnEffect([makeStep(5)])).toBe('extra');
    // Best wins: 3-match in level 0, 5-match in level 1
    expect(computeTurnEffect([makeStep(3), makeStep(5)])).toBe('extra');
  });
});

describe('applyMove', () => {
  it('resolves a simple swap with one cascade level', () => {
    // Swapping (0,2)↔(0,3) creates row-0: 0,0,0
    const board = boardFromTypes([
      [0, 0, 1, 0, 2],
      [1, 2, 0, 2, 1],
      [2, 1, 2, 1, 2],
      [1, 2, 1, 2, 1],
      [2, 1, 2, 1, 2],
    ]);

    const rng = seededRng(123);
    const result = applyMove(
      board,
      { row: 0, col: 2 },
      { row: 0, col: 3 },
      3,
      5,
      createIdSource(100),
      rng,
    );

    expect(result.cascadeSteps.length).toBeGreaterThanOrEqual(1);
    expect(result.totalScoreGained).toBeGreaterThan(0);
    // The cleared tiles should include type 0
    expect(result.typeClears[0]).toBeGreaterThanOrEqual(3);
  });

  it('returns empty cascade for invalid move (no match)', () => {
    const board = boardFromTypes([
      [0, 1, 2, 3, 0],
      [1, 2, 3, 0, 1],
      [2, 3, 0, 1, 2],
      [3, 0, 1, 2, 3],
      [0, 1, 2, 3, 0],
    ]);

    const result = applyMove(
      board,
      { row: 0, col: 0 },
      { row: 0, col: 1 },
      4,
      5,
      createIdSource(100),
    );

    expect(result.cascadeSteps).toHaveLength(0);
    expect(result.totalScoreGained).toBe(0);
  });

  it('final board has no remaining matches', () => {
    const board = boardFromTypes([
      [0, 0, 1, 0, 2],
      [1, 2, 0, 2, 1],
      [2, 1, 2, 1, 2],
      [1, 2, 1, 2, 1],
      [2, 1, 2, 1, 2],
    ]);

    const rng = seededRng(456);
    const result = applyMove(
      board,
      { row: 0, col: 2 },
      { row: 0, col: 3 },
      3,
      5,
      createIdSource(100),
      rng,
    );

    if (result.cascadeSteps.length > 0) {
      const finalBoard =
        result.cascadeSteps[result.cascadeSteps.length - 1].boardAfterFill;
      expect(findMatches(finalBoard, 5)).toHaveLength(0);
    }
  });
});

describe('getAllValidMoves', () => {
  it('finds moves on a generated board', () => {
    const board = generateBoard(4, 7, createIdSource(), seededRng(99));
    const moves = getAllValidMoves(board, 7);
    // A freshly generated board should almost always have valid moves
    expect(moves.length).toBeGreaterThan(0);
  });
});
