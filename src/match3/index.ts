// Types
export type {
  GemType,
  Pos,
  Tile,
  Board,
  Match,
  TurnEffect,
  IdSource,
  CascadeStep,
  TurnResult,
  CollectionOpts,
  GameConfig,
  GemDef,
  CollectionCounters,
} from './types';

// Constants
export { DEFAULT_CONFIG, MAX_K, GEM_CATALOG } from './constants';

// Board creation
export { generateBoard, createIdSource, randomTile, idx, posFromIdx } from './board';

// Match finding & move validation
export { findMatches, isAdjacent, isValidMove, getAllValidMoves } from './matching';

// Gravity & spawning
export { applyGravity, spawnNewTiles } from './gravity';

// Scoring
export { scoreMatch, scoreCascadeLevel, computeTurnEffect } from './scoring';

// Turn resolution
export { applyMove } from './turn';

// Solver types
export type {
  SolverContext,
  SolverFn,
  AsyncSolverFn,
  SimConfig,
  GameSummary,
  GameReplay,
  ReplayMoveRecord,
  SerializedCascadeStep,
} from './solver-types';

// Simulation
export {
  simulateGameSummary,
  simulateGameReplay,
  simulateGameSummaryAsync,
  simulateGameReplayAsync,
  seededRng,
} from './simulation';

// Simulation internals (for custom async game loops)
export type { GameState } from './simulation';
