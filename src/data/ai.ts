import type { Ai } from '../schemas';
import { loadJSON } from '../load-json';

const RAW_AI = loadJSON('data/raw/ai.json');

export const ai = new Map<string, Ai>(
  Object.entries(RAW_AI as Record<string, Ai>),
);

export { RAW_AI };
