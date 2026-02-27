import type { Item, ItemUse } from '../schemas';
import { loadJSON } from '../load-json';

const RAW_ITEMS = loadJSON('data/raw/items.json');
const RAW_ITEM_USES = loadJSON('data/raw/itemuses.json');

export const items = new Map<string, Item>(
  Object.entries(RAW_ITEMS as Record<string, Item>),
);

export const itemUses = new Map<string, ItemUse>(
  Object.entries(RAW_ITEM_USES as Record<string, ItemUse>),
);

export { RAW_ITEMS, RAW_ITEM_USES };
