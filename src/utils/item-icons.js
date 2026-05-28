const WOWHEAD_ICON_SIZES = {
    small: 'small',
    medium: 'medium',
    large: 'large',
};

export function getWowheadIconUrl(iconSlug, size = 'medium') {
    if (!iconSlug) return null;
    const wowSize = WOWHEAD_ICON_SIZES[size] || 'medium';
    return `https://wow.zamimg.com/images/wow/icons/${wowSize}/${iconSlug}.jpg`;
}
