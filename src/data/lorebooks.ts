import type { Lorebook } from '../schemas';

import RAW_LOREBOOKS from './raw/lorebooks.json';

export const lorebooks = new Map<string, Lorebook>(
  Object.entries(RAW_LOREBOOKS as Record<string, Lorebook>),
);

export { RAW_LOREBOOKS };
