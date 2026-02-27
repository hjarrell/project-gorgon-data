import type { Board, CascadeStep, IdSource } from './types';
import type {
  SolverFn,
  AsyncSolverFn,
  SimConfig,
  GameSummary,
  GameReplay,
  ReplayMoveRecord,
  SerializedCascadeStep,
} from './solver-types';
import { generateBoard, createIdSource } from './board';
import { getAllValidMoves } from './matching';
import { applyMove } from './turn';
import { MAX_K } from './constants';

/**
 * Simple LCG PRNG. Deterministic for a given seed.
 * Returns values in [0, 1).
 */
export function seededRng(seed: number): () => number {
  let s = seed | 0;
  return () => {
    s = (Math.imul(s, 1664525) + 1013904223) | 0;
    return (s >>> 0) / 0x100000000;
  };
}

/** Convert a CascadeStep's Map to a plain Record for structured clone. */
export function serializeCascadeStep(step: CascadeStep): SerializedCascadeStep {
  const origins: Record<string, number> = {};
  step.newTileOrigins.forEach((v, k) => {
    origins[String(k)] = v;
  });
  return {
    cascadeLevel: step.cascadeLevel,
    matchPositions: step.matches.map((m) =>
      m.positions.map((p) => ({ row: p.row, col: p.col })),
    ),
    matchTypes: step.matches.map((m) => m.type),
    boardAfterClear: step.boardAfterClear,
    boardAfterGravity: step.boardAfterGravity,
    boardAfterFill: step.boardAfterFill,
    newTileOrigins: origins,
    scoreGained: step.scoreGained,
  };
}

export interface GameState {
  board: Board;
  K: number;
  turnsLeft: number;
  score: number;
  counters: number[];
  collectionEvents: number;
  maxK: number;
  turnsPlayed: number;
}

export function initState(config: SimConfig, rng: () => number, idSrc: IdSource): GameState {
  const board = generateBoard(config.K, config.boardSize, idSrc, rng);
  return {
    board,
    K: config.K,
    turnsLeft: config.turns,
    score: 0,
    counters: new Array(MAX_K).fill(0),
    collectionEvents: 0,
    maxK: config.K,
    turnsPlayed: 0,
  };
}

export function advanceTurn(
  state: GameState,
  move: [{ row: number; col: number }, { row: number; col: number }],
  config: SimConfig,
  rng: () => number,
  idSrc: IdSource,
): { result: ReturnType<typeof applyMove> } {
  const result = applyMove(
    state.board, move[0], move[1], state.K, config.boardSize, idSrc, rng,
    { counters: state.counters, threshold: config.collectionThreshold, maxK: MAX_K },
  );

  if (result.cascadeSteps.length === 0) {
    // Should not happen if solver returns a valid move, but handle gracefully
    return { result };
  }

  // Update board to final state
  const lastStep = result.cascadeSteps[result.cascadeSteps.length - 1];
  state.board = lastStep.boardAfterFill;

  // Update score
  state.score += result.totalScoreGained;
  state.turnsPlayed++;

  // Apply collection results from the cascade (K and counters already
  // resolved mid-cascade by applyMove)
  if (result.finalCounters) {
    for (let t = 0; t < result.finalCounters.length; t++) {
      state.counters[t] = result.finalCounters[t];
    }
  }
  state.K = result.finalK;
  state.maxK = Math.max(state.maxK, state.K);
  state.collectionEvents += result.collectionEvents;

  // Apply turn effect
  if (result.turnEffect === 'extra') {
    state.turnsLeft += 1;
  } else if (result.turnEffect !== 'refund') {
    state.turnsLeft -= 1;
  }
  // 'refund' → no change

  return { result };
}

/** Run a full game and return only a summary (fast path for batch). */
export function simulateGameSummary(
  solver: SolverFn,
  config: SimConfig,
  seed: number,
): GameSummary {
  const rng = seededRng(seed);
  const idSrc = createIdSource();
  const state = initState(config, rng, idSrc);

  while (state.turnsLeft > 0) {
    const validMoves = getAllValidMoves(state.board, config.boardSize);
    if (validMoves.length === 0) break;

    const move = solver({
      board: state.board,
      K: state.K,
      boardSize: config.boardSize,
      turnsLeft: state.turnsLeft,
      startTurns: config.turns,
      score: state.score,
      collectionCounters: [...state.counters],
      collectionThreshold: config.collectionThreshold,
      validMoves,
    });

    // Validate solver's move is in the valid moves list
    const isValid = validMoves.some(
      ([a, b]) =>
        (a.row === move[0].row && a.col === move[0].col &&
         b.row === move[1].row && b.col === move[1].col) ||
        (a.row === move[1].row && a.col === move[1].col &&
         b.row === move[0].row && b.col === move[0].col),
    );

    const actualMove = isValid ? move : validMoves[0];
    advanceTurn(state, actualMove, config, rng, idSrc);
  }

  return {
    finalScore: state.score,
    turnsPlayed: state.turnsPlayed,
    maxK: state.maxK,
    collectionEvents: state.collectionEvents,
    seed,
  };
}

/** Run a single game with full move recording for visual replay. */
export function simulateGameReplay(
  solver: SolverFn,
  config: SimConfig,
  seed: number,
): GameReplay {
  const rng = seededRng(seed);
  const idSrc = createIdSource();
  const state = initState(config, rng, idSrc);
  const moves: ReplayMoveRecord[] = [];

  while (state.turnsLeft > 0) {
    const validMoves = getAllValidMoves(state.board, config.boardSize);
    if (validMoves.length === 0) break;

    const move = solver({
      board: state.board,
      K: state.K,
      boardSize: config.boardSize,
      turnsLeft: state.turnsLeft,
      startTurns: config.turns,
      score: state.score,
      collectionCounters: [...state.counters],
      collectionThreshold: config.collectionThreshold,
      validMoves,
    });

    const isValid = validMoves.some(
      ([a, b]) =>
        (a.row === move[0].row && a.col === move[0].col &&
         b.row === move[1].row && b.col === move[1].col) ||
        (a.row === move[1].row && a.col === move[1].col &&
         b.row === move[0].row && b.col === move[0].col),
    );

    const actualMove = isValid ? move : validMoves[0];
    const { result } = advanceTurn(state, actualMove, config, rng, idSrc);

    if (result.cascadeSteps.length > 0) {
      moves.push({
        move: actualMove,
        cascadeSteps: result.cascadeSteps.map(serializeCascadeStep),
        totalScoreGained: result.totalScoreGained,
        turnEffect: result.turnEffect,
        typeClears: result.typeClears,
        scoreAfter: state.score,
        turnsLeftAfter: state.turnsLeft,
        kAfter: state.K,
        collectionCounters: [...state.counters],
      });
    }
  }

  return {
    summary: {
      finalScore: state.score,
      turnsPlayed: state.turnsPlayed,
      maxK: state.maxK,
      collectionEvents: state.collectionEvents,
      seed,
    },
    config,
    moves,
  };
}

// ── Async variants (for solvers that return Promise, e.g. ONNX inference) ──

function isValidSolverMove(
  move: [{ row: number; col: number }, { row: number; col: number }],
  validMoves: [{ row: number; col: number }, { row: number; col: number }][],
): boolean {
  return validMoves.some(
    ([a, b]) =>
      (a.row === move[0].row && a.col === move[0].col &&
       b.row === move[1].row && b.col === move[1].col) ||
      (a.row === move[1].row && a.col === move[1].col &&
       b.row === move[0].row && b.col === move[0].col),
  );
}

/** Async version of simulateGameSummary. Awaits the solver each turn. */
export async function simulateGameSummaryAsync(
  solver: AsyncSolverFn,
  config: SimConfig,
  seed: number,
): Promise<GameSummary> {
  const rng = seededRng(seed);
  const idSrc = createIdSource();
  const state = initState(config, rng, idSrc);

  while (state.turnsLeft > 0) {
    const validMoves = getAllValidMoves(state.board, config.boardSize);
    if (validMoves.length === 0) break;

    const move = await solver({
      board: state.board,
      K: state.K,
      boardSize: config.boardSize,
      turnsLeft: state.turnsLeft,
      startTurns: config.turns,
      score: state.score,
      collectionCounters: [...state.counters],
      collectionThreshold: config.collectionThreshold,
      validMoves,
    });

    const actualMove = isValidSolverMove(move, validMoves) ? move : validMoves[0];
    advanceTurn(state, actualMove, config, rng, idSrc);
  }

  return {
    finalScore: state.score,
    turnsPlayed: state.turnsPlayed,
    maxK: state.maxK,
    collectionEvents: state.collectionEvents,
    seed,
  };
}

/** Async version of simulateGameReplay. Awaits the solver each turn. */
export async function simulateGameReplayAsync(
  solver: AsyncSolverFn,
  config: SimConfig,
  seed: number,
): Promise<GameReplay> {
  const rng = seededRng(seed);
  const idSrc = createIdSource();
  const state = initState(config, rng, idSrc);
  const moves: ReplayMoveRecord[] = [];

  while (state.turnsLeft > 0) {
    const validMoves = getAllValidMoves(state.board, config.boardSize);
    if (validMoves.length === 0) break;

    const move = await solver({
      board: state.board,
      K: state.K,
      boardSize: config.boardSize,
      turnsLeft: state.turnsLeft,
      startTurns: config.turns,
      score: state.score,
      collectionCounters: [...state.counters],
      collectionThreshold: config.collectionThreshold,
      validMoves,
    });

    const actualMove = isValidSolverMove(move, validMoves) ? move : validMoves[0];
    const { result } = advanceTurn(state, actualMove, config, rng, idSrc);

    if (result.cascadeSteps.length > 0) {
      moves.push({
        move: actualMove,
        cascadeSteps: result.cascadeSteps.map(serializeCascadeStep),
        totalScoreGained: result.totalScoreGained,
        turnEffect: result.turnEffect,
        typeClears: result.typeClears,
        scoreAfter: state.score,
        turnsLeftAfter: state.turnsLeft,
        kAfter: state.K,
        collectionCounters: [...state.counters],
      });
    }
  }

  return {
    summary: {
      finalScore: state.score,
      turnsPlayed: state.turnsPlayed,
      maxK: state.maxK,
      collectionEvents: state.collectionEvents,
      seed,
    },
    config,
    moves,
  };
}
