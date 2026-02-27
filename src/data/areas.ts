import type { Area } from '../schemas';
import { loadJSON } from '../load-json';

const RAW_AREAS = loadJSON('data/raw/areas.json');

export const areas = new Map<string, Area>(
  Object.entries(RAW_AREAS as Record<string, Area>),
);

export { RAW_AREAS };
