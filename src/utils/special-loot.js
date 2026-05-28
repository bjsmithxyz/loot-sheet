export const LEGENDARY_FLAVOR_ITEM_IDS = new Set([
    28830, // Dragonspine Trophy
    30480, // Fiery Warhorse's Reins
    32458, // Ashes of Al'ar
]);

export function isLegendaryFlavorItem(item) {
    return Boolean(item && LEGENDARY_FLAVOR_ITEM_IDS.has(item.id));
}

export function applyItemRarity(item) {
    if (isLegendaryFlavorItem(item)) {
        return { ...item, rarity: 'Legendary' };
    }
    return item;
}
