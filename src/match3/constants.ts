import type { GameConfig, GemDef } from './types';

export const DEFAULT_CONFIG: GameConfig = {
  boardSize: 7,
  startK: 4,
  startTurns: 12,
  collectionThreshold: 30,
};

export const MAX_K = 8;

/**
 * Ordered catalog of gem visual definitions. Index = GemType.
 * The engine only uses the first K entries. Maximum supported K = MAX_K.
 */
export const GEM_CATALOG: readonly GemDef[] = [
  { id: 'ruby', label: 'Ruby', fill: '#e05555', stroke: '#f07070', shape: 'diamond' },
  { id: 'sapphire', label: 'Sapphire', fill: '#4477cc', stroke: '#6699ee', shape: 'circle' },
  { id: 'emerald', label: 'Emerald', fill: '#44aa66', stroke: '#66cc88', shape: 'hexagon' },
  { id: 'amber', label: 'Amber', fill: '#cc8833', stroke: '#eeaa55', shape: 'square' },
  { id: 'amethyst', label: 'Amethyst', fill: '#9955cc', stroke: '#bb77ee', shape: 'triangle' },
  { id: 'topaz', label: 'Topaz', fill: '#33bbcc', stroke: '#55ddee', shape: 'star' },
  { id: 'onyx', label: 'Onyx', fill: '#666688', stroke: '#8888aa', shape: 'teardrop' },
  { id: 'opal', label: 'Opal', fill: '#cc4499', stroke: '#ee66bb', shape: 'cross' },
];
