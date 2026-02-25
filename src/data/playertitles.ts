import type { PlayerTitle } from '../schemas';

import RAW_PLAYER_TITLES from './raw/playertitles.json';

export const playerTitles = new Map<string, PlayerTitle>(
  Object.entries(RAW_PLAYER_TITLES as Record<string, PlayerTitle>),
);

export { RAW_PLAYER_TITLES };
