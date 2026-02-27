import type { Lorebook } from '../schemas';
import { loadJSON } from '../load-json';

const RAW_LOREBOOKS = loadJSON('data/raw/lorebooks.json');

export const lorebooks = new Map<string, Lorebook>(
  Object.entries(RAW_LOREBOOKS as Record<string, Lorebook>),
);

export { RAW_LOREBOOKS };
