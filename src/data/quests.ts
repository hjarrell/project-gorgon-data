import type { Quest } from '../schemas';

import RAW_QUESTS from './raw/quests.json';

export const quests = new Map<string, Quest>(
  Object.entries(RAW_QUESTS as Record<string, Quest>),
);

export { RAW_QUESTS };
