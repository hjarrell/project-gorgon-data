/**
 * Look up an Item by its numeric ItemCode.
 * The items Map uses keys like "item_5011"; this helper handles the conversion.
 */
export function getItemByCode(itemCode, allItems) {
    return allItems.get(`item_${itemCode}`);
}
/**
 * Get an Item's display name by ItemCode, with a fallback for unknown items.
 */
export function getItemName(itemCode, allItems) {
    return allItems.get(`item_${itemCode}`)?.Name ?? `Item #${itemCode}`;
}
