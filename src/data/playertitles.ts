import type { PlayerTitle } from '../schemas';
import { loadJSON } from '../load-json';

const RAW_PLAYER_TITLES = loadJSON('data/raw/playertitles.json');

export const playerTitles = new Map<string, PlayerTitle>(
  Object.entries(RAW_PLAYER_TITLES as Record<string, PlayerTitle>),
);

export { RAW_PLAYER_TITLES };
