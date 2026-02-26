import { describe, it, expect } from 'vitest';
import type { SolverFn } from './solver-types';
import { simulateGameSummary, simulateGameReplay, seededRng } from './simulation';
import { DEFAULT_CONFIG } from './constants';

const defaultSimConfig = {
  K: DEFAULT_CONFIG.startK,
  turns: DEFAULT_CONFIG.startTurns,
  boardSize: DEFAULT_CONFIG.boardSize,
  collectionThreshold: DEFAULT_CONFIG.collectionThreshold,
};

/** Baseline solver: picks a random valid move using the seeded RNG. */
const randomSolver: SolverFn = (ctx) => {
  const idx = Math.floor(Math.random() * ctx.validMoves.length);
  return ctx.validMoves[idx];
};

/** Deterministic solver using a separate seeded RNG. */
function deterministicRandomSolver(seed: number): SolverFn {
  const rng = seededRng(seed);
  return (ctx) => {
    const idx = Math.floor(rng() * ctx.validMoves.length);
    return ctx.validMoves[idx];
  };
}

describe('seededRng', () => {
  it('produces deterministic values', () => {
    const rng1 = seededRng(42);
    const rng2 = seededRng(42);
    const values1 = Array.from({ length: 10 }, () => rng1());
    const values2 = Array.from({ length: 10 }, () => rng2());
    expect(values1).toEqual(values2);
  });

  it('produces values in [0, 1)', () => {
    const rng = seededRng(123);
    for (let i = 0; i < 1000; i++) {
      const v = rng();
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThan(1);
    }
  });

  it('different seeds produce different sequences', () => {
    const rng1 = seededRng(1);
    const rng2 = seededRng(2);
    const v1 = Array.from({ length: 5 }, () => rng1());
    const v2 = Array.from({ length: 5 }, () => rng2());
    expect(v1).not.toEqual(v2);
  });
});

describe('simulateGameSummary', () => {
  it('completes a game without errors', () => {
    const result = simulateGameSummary(randomSolver, defaultSimConfig, 42);
    expect(result.finalScore).toBeGreaterThanOrEqual(0);
    expect(result.turnsPlayed).toBeGreaterThan(0);
    expect(result.turnsPlayed).toBeLessThanOrEqual(defaultSimConfig.turns + 20); // turns can increase
    expect(result.maxK).toBeGreaterThanOrEqual(defaultSimConfig.K);
    expect(result.seed).toBe(42);
  });

  it('same seed produces same result (determinism)', () => {
    const solver = deterministicRandomSolver(99);
    const r1 = simulateGameSummary(solver, defaultSimConfig, 42);

    const solver2 = deterministicRandomSolver(99);
    const r2 = simulateGameSummary(solver2, defaultSimConfig, 42);

    expect(r1.finalScore).toBe(r2.finalScore);
    expect(r1.turnsPlayed).toBe(r2.turnsPlayed);
    expect(r1.maxK).toBe(r2.maxK);
    expect(r1.collectionEvents).toBe(r2.collectionEvents);
  });

  it('different seeds produce different results', () => {
    const results = new Set<number>();
    for (let seed = 0; seed < 20; seed++) {
      const r = simulateGameSummary(randomSolver, defaultSimConfig, seed);
      results.add(r.finalScore);
    }
    // With 20 different seeds, we should get multiple different scores
    expect(results.size).toBeGreaterThan(1);
  });

  it('handles many turns config without error', () => {
    const config = { ...defaultSimConfig, turns: 50 };
    const result = simulateGameSummary(randomSolver, config, 7);
    expect(result.turnsPlayed).toBeGreaterThan(0);
    expect(result.finalScore).toBeGreaterThan(0);
  });

  it('collection events fire with enough turns', () => {
    // With 50 turns and K=3, collection should happen at least once sometimes
    const config = { ...defaultSimConfig, K: 3, turns: 50 };
    let totalCollections = 0;
    for (let seed = 0; seed < 50; seed++) {
      const r = simulateGameSummary(randomSolver, config, seed);
      totalCollections += r.collectionEvents;
    }
    expect(totalCollections).toBeGreaterThan(0);
  });
});

describe('simulateGameReplay', () => {
  it('produces valid replay data', () => {
    const replay = simulateGameReplay(randomSolver, defaultSimConfig, 42);

    expect(replay.config).toEqual(defaultSimConfig);
    expect(replay.summary.seed).toBe(42);
    expect(replay.moves.length).toBeGreaterThan(0);

    for (const move of replay.moves) {
      expect(move.move).toHaveLength(2);
      expect(move.cascadeSteps.length).toBeGreaterThan(0);
      expect(move.totalScoreGained).toBeGreaterThanOrEqual(0);
      expect(['none', 'refund', 'extra']).toContain(move.turnEffect);
      expect(move.scoreAfter).toBeGreaterThanOrEqual(0);
      expect(move.turnsLeftAfter).toBeGreaterThanOrEqual(0);
    }
  });

  it('replay summary matches summary-only result', () => {
    const solver1 = deterministicRandomSolver(99);
    const summary = simulateGameSummary(solver1, defaultSimConfig, 42);

    const solver2 = deterministicRandomSolver(99);
    const replay = simulateGameReplay(solver2, defaultSimConfig, 42);

    expect(replay.summary.finalScore).toBe(summary.finalScore);
    expect(replay.summary.turnsPlayed).toBe(summary.turnsPlayed);
    expect(replay.summary.maxK).toBe(summary.maxK);
    expect(replay.summary.collectionEvents).toBe(summary.collectionEvents);
  });

  it('cascade steps have serializable newTileOrigins (Record, not Map)', () => {
    const replay = simulateGameReplay(randomSolver, defaultSimConfig, 42);
    const step = replay.moves[0].cascadeSteps[0];
    // Should be a plain object, not a Map
    expect(step.newTileOrigins).toBeDefined();
    expect(step.newTileOrigins instanceof Map).toBe(false);
    expect(typeof step.newTileOrigins).toBe('object');
  });

  it('last move scoreAfter matches summary finalScore', () => {
    const replay = simulateGameReplay(randomSolver, defaultSimConfig, 42);
    const lastMove = replay.moves[replay.moves.length - 1];
    expect(lastMove.scoreAfter).toBe(replay.summary.finalScore);
  });
});
