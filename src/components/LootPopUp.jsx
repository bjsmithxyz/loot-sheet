import React, { useMemo, useState, useEffect, useLayoutEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CLASS_COLORS, getTokenClasses } from '../utils/wow-constants';
import { rarityClass } from '../utils/import-parser';
import { useIsMobile } from '../hooks/useIsMobile';
import ItemIcon from './ItemIcon';
import ItemTooltip from './ItemTooltip';
import MobileSheet from './MobileSheet';
import BOSS_LOOT from '../data/loot.json';

const VIEWPORT_MARGIN = 12;
const POPUP_OFFSET_X = 50;

function getInitialPosition(position) {
    return {
        left: position.x + POPUP_OFFSET_X,
        top: position.y,
    };
}

function LootList({
    loot,
    previewItem,
    onSelect,
    onPreviewItem,
    onHoverItem,
    onLeaveHover,
    isMobile,
}) {
    return (
        <div className="loot-list">
            {loot.map((item) => (
                <div
                    key={item.id}
                    className={`loot-item ${previewItem?.id === item.id ? 'is-previewing' : ''}`}
                    onClick={() => onSelect(item)}
                    onMouseEnter={() => !isMobile && onHoverItem(item)}
                    onMouseLeave={() => !isMobile && onLeaveHover()}
                >
                    {isMobile ? (
                        <button
                            type="button"
                            className="loot-item-icon-btn"
                            aria-label={`Preview ${item.name}`}
                            onClick={(e) => {
                                e.stopPropagation();
                                onPreviewItem(item);
                            }}
                        >
                            <ItemIcon item={item} size="small" />
                        </button>
                    ) : (
                        <ItemIcon item={item} size="small" />
                    )}
                    <span className={`item-name rarity-text-${rarityClass(item.rarity)}`}>
                        {item.name}
                        {getTokenClasses(item.name) && (
                            <span className="token-classes-row small">
                                {getTokenClasses(item.name).map((c) => (
                                    <span
                                        key={c}
                                        className="token-class-dot small"
                                        style={{ backgroundColor: CLASS_COLORS[c] }}
                                    />
                                ))}
                            </span>
                        )}
                    </span>
                </div>
            ))}
            {loot.length === 0 && <div className="no-loot">No loot recorded.</div>}
        </div>
    );
}

export default function LootPopUp({ bossId, position, onSelect, onClose, bossName }) {
    const isMobile = useIsMobile();
    const loot = useMemo(() => BOSS_LOOT[bossId] || [], [bossId]);
    const [hoveredItem, setHoveredItem] = useState(null);
    const [previewItem, setPreviewItem] = useState(null);
    const popupRef = useRef(null);
    const [popupStyle, setPopupStyle] = useState(() => getInitialPosition(position));

    useLayoutEffect(() => {
        if (isMobile) return;

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
    }, [position, loot.length, isMobile]);

    useEffect(() => {
        if (isMobile) return;

        const handleClickOutside = () => onClose();

        const timer = setTimeout(() => {
            window.addEventListener('click', handleClickOutside);
        }, 10);

        return () => {
            clearTimeout(timer);
            window.removeEventListener('click', handleClickOutside);
        };
    }, [onClose, isMobile]);

    const handlePreviewItem = (item) => {
        setPreviewItem((current) => (current?.id === item.id ? null : item));
    };

    const lootList = (
        <LootList
            loot={loot}
            previewItem={isMobile ? previewItem : hoveredItem}
            onSelect={onSelect}
            onPreviewItem={handlePreviewItem}
            onHoverItem={setHoveredItem}
            onLeaveHover={() => setHoveredItem(null)}
            isMobile={isMobile}
        />
    );

    if (isMobile) {
        return (
            <MobileSheet
                title={bossName ? `Assign loot — ${bossName}` : 'Assign loot'}
                onClose={onClose}
                className="loot-popup-sheet"
            >
                <AnimatePresence>
                    {previewItem && (
                        <motion.div
                            key={previewItem.id}
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="loot-mobile-preview"
                        >
                            <ItemTooltip item={previewItem} className="grid-tooltip" />
                        </motion.div>
                    )}
                </AnimatePresence>
                {lootList}
            </MobileSheet>
        );
    }

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
            {lootList}
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
