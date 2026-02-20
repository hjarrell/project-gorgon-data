import type { Item } from '../schemas/items';

/**
 * Look up an Item by its numeric ItemCode.
 * The items Map uses keys like "item_5011"; this helper handles the conversion.
 */
export function getItemByCode(
  itemCode: number,
  allItems: Map<string, Item>,
): Item | undefined {
  return allItems.get(`item_${itemCode}`);
}

/**
 * Get an Item's display name by ItemCode, with a fallback for unknown items.
 */
export function getItemName(
  itemCode: number,
  allItems: Map<string, Item>,
): string {
  return allItems.get(`item_${itemCode}`)?.Name ?? `Item #${itemCode}`;
}
