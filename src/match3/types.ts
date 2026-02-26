/** A gem type index, 0-based. Valid range: [0, K-1]. */
export type GemType = number;

/** A position on the board. Row 0 is top, col 0 is left. */
export interface Pos {
  row: number;
  col: number;
}

/**
 * A single tile on the board.
 * `id` is a stable unique identifier per tile lifetime — new tiles spawned
 * after a clear get a new id. Used as React key for animation tracking.
 */
export interface Tile {
  id: number;
  type: GemType;
}

/**
 * The board is a flat array of length boardSize².
 * Index mapping: index = row * boardSize + col. Row 0 is the top.
 * A `null` cell represents an empty slot (mid-cascade, before gravity fill).
 */
export type Board = (Tile | null)[];

/**
 * A match group: 3+ same-type tiles connected via row/col runs.
 * Simple 3-in-a-row has one axis; L/T/cross shapes have no single axis.
 */
export interface Match {
  positions: Pos[];
  type: GemType;
  axis?: 'row' | 'col';
}

/** Turn effect: mutually exclusive, best across entire turn wins. */
export type TurnEffect = 'none' | 'refund' | 'extra';

/** Mutable ID counter. The store owns the instance; the engine receives it. */
export interface IdSource {
  next(): number;
}

/** One level of a cascade. The engine produces an ordered array of these. */
export interface CascadeStep {
  cascadeLevel: number;
  matches: Match[];
  /** Board after matched tiles set to null. */
  boardAfterClear: Board;
  /** Board after gravity (tiles dropped, nulls at top). */
  boardAfterGravity: Board;
  /** Board after new tiles fill empty slots. */
  boardAfterFill: Board;
  /** Map of new tile id → number of rows above board it originated from (for drop animation). */
  newTileOrigins: Map<number, number>;
  /** Score contribution from this cascade level. */
  scoreGained: number;
}

/** Complete result of resolving a player's swap. */
export interface TurnResult {
  cascadeSteps: CascadeStep[];
  totalScoreGained: number;
  turnEffect: TurnEffect;
  /** Per-type count of tiles cleared this turn. Index = GemType, length = K. */
  typeClears: number[];
}

/** Game configuration. */
export interface GameConfig {
  boardSize: number;
  startK: number;
  startTurns: number;
  collectionThreshold: number;
}

/** Visual definition for a gem type. */
export interface GemDef {
  id: string;
  label: string;
  fill: string;
  stroke: string;
  shape:
    | 'circle'
    | 'diamond'
    | 'square'
    | 'triangle'
    | 'star'
    | 'hexagon'
    | 'teardrop'
    | 'cross';
}

/** Parallel array to gem types; index = GemType, value = cleared count. */
export type CollectionCounters = number[];
