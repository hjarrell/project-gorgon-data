import RAW_ITEMS from './items.json';
import RAW_ITEM_USES from './itemuses.json';
export const items = new Map(Object.entries(RAW_ITEMS));
export const itemUses = new Map(Object.entries(RAW_ITEM_USES));
export { RAW_ITEMS, RAW_ITEM_USES };
