import type { Board, Pos, CollectionCounters, TurnEffect } from './types';

/** Everything a solver needs to pick a move. */
export interface SolverContext {
  board: Board;
  K: number;
  boardSize: number;
  turnsLeft: number;
  startTurns: number;
  score: number;
  collectionCounters: CollectionCounters;
  collectionThreshold: number;
  validMoves: [Pos, Pos][];
}

/** A solver is a pure function: context in, move out. */
export type SolverFn = (ctx: SolverContext) => [Pos, Pos];

/** Async-compatible solver (sync solvers satisfy this type naturally). */
export type AsyncSolverFn = (ctx: SolverContext) => [Pos, Pos] | Promise<[Pos, Pos]>;

/** Configuration for a simulation run. */
export interface SimConfig {
  K: number;
  turns: number;
  boardSize: number;
  collectionThreshold: number;
}

/** Lightweight game result for batch runs (no board snapshots). */
export interface GameSummary {
  finalScore: number;
  turnsPlayed: number;
  maxK: number;
  collectionEvents: number;
  seed: number;
}

/** Serializable cascade step (Map replaced with Record for structured clone). */
export interface SerializedCascadeStep {
  cascadeLevel: number;
  matchPositions: { row: number; col: number }[][];
  matchTypes: number[];
  boardAfterClear: Board;
  boardAfterGravity: Board;
  boardAfterFill: Board;
  newTileOrigins: Record<string, number>;
  scoreGained: number;
}

/** Full move record for replay. */
export interface ReplayMoveRecord {
  move: [Pos, Pos];
  cascadeSteps: SerializedCascadeStep[];
  totalScoreGained: number;
  turnEffect: TurnEffect;
  typeClears: number[];
  scoreAfter: number;
  turnsLeftAfter: number;
  kAfter: number;
  collectionCounters: number[];
}

/** Complete replay data for a single game. */
export interface GameReplay {
  summary: GameSummary;
  config: SimConfig;
  moves: ReplayMoveRecord[];
}
