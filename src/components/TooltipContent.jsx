import React from 'react';
import { getTokenClasses, CLASS_COLORS } from '../utils/wow-constants';

export default function TooltipContent({ item }) {
    const tokenClasses = getTokenClasses(item.name);
    return (
        <>
            <div className={`wow-name rarity-text-${item.rarity.toLowerCase()}`}>
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
            {item.bind && <div className="wow-bind">{item.bind}</div>}
            {item.type && <div className="wow-type">{item.type}</div>}

            {item.stats && item.stats.map((stat, i) => (
                <div key={i} className="wow-stat">{stat}</div>
            ))}

            {item.req && <div className="wow-req">Requires Level {item.req}</div>}

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
