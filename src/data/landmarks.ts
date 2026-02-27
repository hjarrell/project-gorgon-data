import type { Landmark } from '../schemas';
import { loadJSON } from '../load-json';

const RAW_LANDMARKS = loadJSON('data/raw/landmarks.json');

export const landmarks = new Map<string, Landmark[]>(
  Object.entries(RAW_LANDMARKS as Record<string, Landmark[]>),
);

export { RAW_LANDMARKS };
