import type { Item, ItemUse } from '../schemas';

import RAW_ITEMS from './raw/items.json';
import RAW_ITEM_USES from './raw/itemuses.json';

export const items = new Map<string, Item>(
  Object.entries(RAW_ITEMS as Record<string, Item>),
);

export const itemUses = new Map<string, ItemUse>(
  Object.entries(RAW_ITEM_USES as Record<string, ItemUse>),
);

export { RAW_ITEMS, RAW_ITEM_USES };
