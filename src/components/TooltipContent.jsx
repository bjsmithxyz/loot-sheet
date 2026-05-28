import React from 'react';
import { getTokenClasses, CLASS_COLORS } from '../utils/wow-constants';
import { rarityClass } from '../utils/import-parser';

function cleanStatText(text) {
  return String(text)
    .replace(/Requires Level \d+/gi, '')
    .replace(/Sell Price:.+$/i, '')
    .trim();
}

export default function TooltipContent({ item }) {
    const tokenClasses = getTokenClasses(item.name);

    return (
        <>
            <div className={`wow-name rarity-text-${rarityClass(item.rarity)}`}>
                {item.name}
            </div>
            {tokenClasses && (
                <div className="wow-type">
                    Classes: {tokenClasses.map((c, i) => (
                        <span key={c} style={{ color: CLASS_COLORS[c] }}>
                            {c}{i < tokenClasses.length - 1 ? ', ' : ''}
                        </span>
                    ))}
                </div>
            )}
            {item.ilevel && <div className="wow-ilevel">Item Level {item.ilevel}</div>}
            {(item.hand || item.weaponType) && (
                <div className="wow-slot">
                    {[item.hand, item.weaponType].filter(Boolean).join(' · ')}
                </div>
            )}
            {item.damage && (
                <div className="wow-damage">
                    {item.damage}
                    {item.speed ? ` Speed ${item.speed}` : ''}
                </div>
            )}
            {item.dps && <div className="wow-dps">({item.dps})</div>}

            {item.stats && item.stats.map((stat, i) => {
                const cleaned = cleanStatText(stat);
                if (!cleaned) return null;
                return <div key={i} className="wow-stat">{cleaned}</div>;
            })}

            {item.equip && (
                <div className="wow-equip wow-green">
                    Equip: {item.equip}
                </div>
            )}
            {item.use && (
                <div className="wow-use wow-green">
                    Use: {item.use}
                </div>
            )}
            {item.flavor && <div className="wow-flavor">"{item.flavor}"</div>}
        </>
    );
}
