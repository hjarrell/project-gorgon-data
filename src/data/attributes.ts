import type { Attribute } from '../schemas';

import RAW_ATTRIBUTES from './raw/attributes.json';

export const attributes = new Map<string, Attribute>(
  Object.entries(RAW_ATTRIBUTES as Record<string, Attribute>),
);

export { RAW_ATTRIBUTES };
