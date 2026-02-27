import type { Attribute } from '../schemas';
import { loadJSON } from '../load-json';

const RAW_ATTRIBUTES = loadJSON('data/raw/attributes.json');

export const attributes = new Map<string, Attribute>(
  Object.entries(RAW_ATTRIBUTES as Record<string, Attribute>),
);

export { RAW_ATTRIBUTES };
