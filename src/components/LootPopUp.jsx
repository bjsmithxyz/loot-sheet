import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CLASS_COLORS, getTokenClasses } from '../utils/wow-constants';
import { rarityClass } from '../utils/import-parser';
import ItemIcon from './ItemIcon';
import ItemTooltip from './ItemTooltip';
import BOSS_LOOT from '../data/loot.json';

const VIEWPORT_MARGIN = 12;
const POPUP_OFFSET_X = 50;

function getInitialPosition(position) {
    return {
        left: position.x + POPUP_OFFSET_X,
        top: position.y,
    };
}

export default function LootPopUp({ bossId, position, onSelect, onClose }) {
    const loot = BOSS_LOOT[bossId] || [];
    const [hoveredItem, setHoveredItem] = useState(null);
    const popupRef = useRef(null);
    const [popupStyle, setPopupStyle] = useState(() => getInitialPosition(position));

    useLayoutEffect(() => {
        const popup = popupRef.current;
        if (!popup) return;

        const clampPosition = () => {
            const rect = popup.getBoundingClientRect();
            let { left, top } = getInitialPosition(position);

            if (rect.bottom > window.innerHeight - VIEWPORT_MARGIN) {
                top = Math.max(VIEWPORT_MARGIN, window.innerHeight - VIEWPORT_MARGIN - rect.height);
            }
            if (rect.top < VIEWPORT_MARGIN) {
                top = VIEWPORT_MARGIN;
            }

            const maxLeft = window.innerWidth - rect.width - VIEWPORT_MARGIN;
            left = Math.min(Math.max(VIEWPORT_MARGIN, left), maxLeft);

            setPopupStyle({ left, top });
        };

        clampPosition();
        window.addEventListener('resize', clampPosition);
        return () => window.removeEventListener('resize', clampPosition);
    }, [position, loot.length]);

    useEffect(() => {
        const handleClickOutside = () => {
            onClose();
        };

        const timer = setTimeout(() => {
            window.addEventListener('click', handleClickOutside);
        }, 10);

        return () => {
            clearTimeout(timer);
            window.removeEventListener('click', handleClickOutside);
        };
    }, [onClose]);

    return (
        <motion.div
            ref={popupRef}
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="loot-popup glass-panel"
            style={{
                position: 'fixed',
                left: popupStyle.left,
                top: popupStyle.top,
                zIndex: 1000,
            }}
            onClick={(e) => e.stopPropagation()}
        >
            <div className="loot-list">
                {loot.map(item => (
                    <div
                        key={item.id}
                        className="loot-item"
                        onClick={() => onSelect(item)}
                        onMouseEnter={() => setHoveredItem(item)}
                        onMouseLeave={() => setHoveredItem(null)}
                    >
                        <ItemIcon item={item} size="small" />
                        <span className={`item-name rarity-text-${rarityClass(item.rarity)}`}>
                            {item.name}
                            {getTokenClasses(item.name) && (
                                <div className="token-classes-row small">
                                    {getTokenClasses(item.name).map(c => (
                                        <div
                                            key={c}
                                            className="token-class-dot small"
                                            style={{ backgroundColor: CLASS_COLORS[c] }}
                                        />
                                    ))}
                                </div>
                            )}
                        </span>
                    </div>
                ))}
                {loot.length === 0 && <div className="no-loot">No loot recorded.</div>}
            </div>

            <AnimatePresence>
                {hoveredItem && (
                    <motion.div
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        className="loot-popup-tooltip"
                        style={{ position: 'absolute', top: 0, left: '100%', marginLeft: '15px' }}
                    >
                        <ItemTooltip item={hoveredItem} />
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
