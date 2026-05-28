import React from 'react';
import { getWowheadIconUrl } from '../utils/item-icons';
import { rarityClass } from '../utils/import-parser';

export default function ItemIcon({ item, size = 'medium', showAcronym = false, className = '' }) {
    const iconUrl = getWowheadIconUrl(item?.icon, size);
    const label = item?.acronym || item?.name?.[0] || '?';
    const rarity = rarityClass(item?.rarity);

    return (
        <div className={`item-icon-frame size-${size} rarity-${rarity} ${className}`.trim()}>
            {iconUrl ? (
                <img src={iconUrl} alt="" className="item-icon-image" loading="lazy" draggable={false} />
            ) : (
                <div className="item-icon-fallback">{label}</div>
            )}
            {showAcronym && (
                <span className="item-icon-acronym">{label}</span>
            )}
        </div>
    );
}
