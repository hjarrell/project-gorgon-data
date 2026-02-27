import type { Effect } from '../schemas';
import { loadJSON } from '../load-json';

const RAW_EFFECTS = loadJSON('data/raw/effects.json');

export const effects = new Map<string, Effect>(
  Object.entries(RAW_EFFECTS as Record<string, Effect>),
);

export { RAW_EFFECTS };
