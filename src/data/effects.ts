import type { Effect } from '../schemas';

import RAW_EFFECTS from './raw/effects.json';

export const effects = new Map<string, Effect>(
  Object.entries(RAW_EFFECTS as Record<string, Effect>),
);

export { RAW_EFFECTS };
