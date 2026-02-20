// ============================================================
// Index Builder
// ============================================================
/**
 * Build a keyword index from all items. Iterates every item once.
 *
 * Item keywords can be bare ("Equipment", "ToxicFrogSkin") or scored ("Fruit=20", "Wood=25").
 * The index key is always the bare keyword (before the `=`).
 * When a score suffix exists, it is parsed and stored on the KeywordMatch.
 */
export function buildKeywordIndex(allItems) {
    const index = new Map();
    for (const [itemKey, item] of allItems) {
        if (!item.Keywords)
            continue;
        const itemCode = parseInt(itemKey.replace('item_', ''), 10);
        for (const rawKeyword of item.Keywords) {
            const eqIdx = rawKeyword.indexOf('=');
            let bareKey;
            let score;
            if (eqIdx !== -1) {
                bareKey = rawKeyword.substring(0, eqIdx);
                score = parseFloat(rawKeyword.substring(eqIdx + 1));
            }
            else {
                bareKey = rawKeyword;
            }
            let list = index.get(bareKey);
            if (!list) {
                list = [];
                index.set(bareKey, list);
            }
            list.push({ item, itemKey, itemCode, score });
        }
    }
    return index;
}
// ============================================================
// Lookup Functions
// ============================================================
/**
 * Find all items matching a single keyword.
 */
export function findItemsByKeyword(keyword, index) {
    return index.get(keyword) ?? [];
}
/**
 * Find items matching ALL positive keywords and NONE of the negated keywords.
 *
 * Supports the multi-keyword ingredient format from recipes:
 * - Positive keywords: items must have all of them (intersection)
 * - Negated keywords (prefixed with `!`): items must NOT have them
 *
 * Example: `["EquipmentSlot:MainHand", "Hammer", "!Club"]`
 * → items with both "EquipmentSlot:MainHand" AND "Hammer", but NOT "Club"
 */
export function findItemsByKeywords(keywords, index) {
    const positive = keywords.filter(k => !k.startsWith('!'));
    const negated = keywords.filter(k => k.startsWith('!')).map(k => k.substring(1));
    if (positive.length === 0)
        return [];
    // Start with items matching the first positive keyword
    let candidates = findItemsByKeyword(positive[0], index);
    // Intersect with remaining positive keywords
    for (let i = 1; i < positive.length; i++) {
        const matchSet = new Set(findItemsByKeyword(positive[i], index).map(m => m.itemCode));
        candidates = candidates.filter(m => matchSet.has(m.itemCode));
    }
    // Exclude negated keywords
    if (negated.length > 0) {
        const excludeSet = new Set();
        for (const neg of negated) {
            for (const match of findItemsByKeyword(neg, index)) {
                excludeSet.add(match.itemCode);
            }
        }
        candidates = candidates.filter(m => !excludeSet.has(m.itemCode));
    }
    return candidates;
}
