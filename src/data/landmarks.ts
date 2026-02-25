import type { Landmark } from '../schemas';

import RAW_LANDMARKS from './raw/landmarks.json';

export const landmarks = new Map<string, Landmark[]>(
  Object.entries(RAW_LANDMARKS as Record<string, Landmark[]>),
);

export { RAW_LANDMARKS };
