import BOSS_LOOT from '../data/loot.json';
import { getWowheadIconUrl } from './item-icons';

const TBC_ICON_POOL = [...new Set(
    Object.values(BOSS_LOOT)
        .flat()
        .map((item) => item.icon)
        .filter(Boolean)
)];

export function pickRandomTbcIcon(exclude = null) {
    if (TBC_ICON_POOL.length === 0) return null;

    const pool = exclude && TBC_ICON_POOL.length > 1
        ? TBC_ICON_POOL.filter((icon) => icon !== exclude)
        : TBC_ICON_POOL;

    return pool[Math.floor(Math.random() * pool.length)];
}

export function getHeaderIconUrl(iconSlug) {
    return getWowheadIconUrl(iconSlug, 'medium');
}

export const TBC_ICON_COUNT = TBC_ICON_POOL.length;
