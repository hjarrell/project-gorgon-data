import type { Quest } from '../schemas';
import { loadJSON } from '../load-json';

const RAW_QUESTS = loadJSON('data/raw/quests.json');

export const quests = new Map<string, Quest>(
  Object.entries(RAW_QUESTS as Record<string, Quest>),
);

export { RAW_QUESTS };
