import type { Area } from '../schemas';

import RAW_AREAS from './raw/areas.json';

export const areas = new Map<string, Area>(
  Object.entries(RAW_AREAS as Record<string, Area>),
);

export { RAW_AREAS };
