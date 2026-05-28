import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Pencil, X, Plus, ChevronDown } from 'lucide-react';
import { CLASS_COLORS } from '../utils/wow-constants';
import { useIsMobile } from '../hooks/useIsMobile';
import ItemIcon from './ItemIcon';
import RoleIcon from './RoleIcon';

function PlayerRow({
    player,
    isEditing,
    onStartEdit,
    onRemoveItem,
    onShowLootMenu,
    onHoverItem,
    onLeaveItem,
    onTapItem,
}) {
    const isMobile = useIsMobile();
    const [collapsed, setCollapsed] = useState(false);

    const handleEditClick = (e) => {
        e.stopPropagation();
        const row = e.currentTarget.closest('.player-row');
        const rect = row.getBoundingClientRect();
        onStartEdit(player, { x: rect.left, y: rect.top, height: rect.height });
    };

    const handleItemTap = (e, item) => {
        e.stopPropagation();
        const rect = e.currentTarget.getBoundingClientRect();
        onTapItem({
            item,
            instanceId: item.instanceId,
            x: rect.left,
            y: rect.top,
        });
    };

    const toggleCollapsed = () => {
        setCollapsed((current) => !current);
    };

    const playerMeta = (
        <>
            <span
                className="player-name-top"
                style={{ color: CLASS_COLORS[player.className] || '#fff' }}
            >
                {player.name}
            </span>
            <RoleIcon role={player.role} />
            {isMobile && player.items.length > 0 && (
                <span className="player-loot-count">{player.items.length}</span>
            )}
            {isMobile && (
                <ChevronDown
                    size={16}
                    className={`player-row-chevron ${collapsed ? 'is-collapsed' : ''}`}
                    aria-hidden="true"
                />
            )}
        </>
    );

    return (
        <div className={`player-row ${isEditing ? 'is-editing' : ''} ${collapsed ? 'is-collapsed' : ''}`}>
            <div className="player-meta-container">
                <button
                    type="button"
                    className="edit-action-btn"
                    onClick={handleEditClick}
                    title="Edit player"
                    aria-label={`Edit ${player.name}`}
                >
                    <Pencil size={12} />
                </button>
                {isMobile ? (
                    <button
                        type="button"
                        className="player-meta player-meta-toggle"
                        onClick={toggleCollapsed}
                        aria-expanded={!collapsed}
                        aria-label={`${collapsed ? 'Expand' : 'Collapse'} loot for ${player.name}`}
                    >
                        {playerMeta}
                    </button>
                ) : (
                    <div className="player-meta">{playerMeta}</div>
                )}
            </div>
            {!collapsed && (
                <div className="player-items">
                    <AnimatePresence>
                        {player.items.map(item => (
                            <motion.div
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0, opacity: 0 }}
                                key={item.instanceId}
                                className="item-icon-slot"
                                onMouseEnter={!isMobile ? (e) => {
                                    const rect = e.currentTarget.getBoundingClientRect();
                                    onHoverItem({
                                        item,
                                        x: rect.left,
                                        y: rect.top,
                                    });
                                } : undefined}
                                onMouseLeave={!isMobile ? onLeaveItem : undefined}
                            >
                                {isMobile ? (
                                    <button
                                        type="button"
                                        className="item-icon-tap"
                                        aria-label={`View ${item.name}`}
                                        onClick={(e) => handleItemTap(e, item)}
                                    >
                                        <ItemIcon item={item} size="medium" />
                                    </button>
                                ) : (
                                    <ItemIcon item={item} size="medium" />
                                )}
                                <button
                                    type="button"
                                    className="remove-item"
                                    aria-label={`Remove ${item.name}`}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onRemoveItem(player.id, item.instanceId);
                                        onLeaveItem();
                                    }}
                                >
                                    <X size={10} />
                                </button>
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    <div className="add-item-container">
                        <button
                            type="button"
                            className="add-item-btn"
                            aria-label={`Add loot for ${player.name}`}
                            onClick={(e) => {
                                e.stopPropagation();
                                const rect = e.currentTarget.getBoundingClientRect();
                                onShowLootMenu({
                                    playerId: player.id,
                                    x: rect.left,
                                    y: rect.top,
                                });
                            }}
                        >
                            <Plus size={16} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default React.memo(PlayerRow);
