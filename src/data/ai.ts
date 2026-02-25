import type { Ai } from '../schemas';

import RAW_AI from './raw/ai.json';

export const ai = new Map<string, Ai>(
  Object.entries(RAW_AI as Record<string, Ai>),
);

export { RAW_AI };
