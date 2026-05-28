import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Pencil, X, Plus } from 'lucide-react';
import { CLASS_COLORS } from '../utils/wow-constants';
import ItemIcon from './ItemIcon';
import RoleIcon from './RoleIcon';

function PlayerRow({
    player,
    isEditing,
    onStartEdit,
    onRemoveItem,
    onShowLootMenu,
    onHoverItem,
    onLeaveItem
}) {
    const handleEditClick = (e) => {
        e.stopPropagation();
        const row = e.currentTarget.closest('.player-row');
        const rect = row.getBoundingClientRect();
        onStartEdit(player, { x: rect.left, y: rect.top, height: rect.height });
    };

    return (
        <div className={`player-row ${isEditing ? 'is-editing' : ''}`}>
            <div className="player-meta-container">
                <button
                    type="button"
                    className="edit-action-btn"
                    onClick={handleEditClick}
                    title="Edit player"
                >
                    <Pencil size={12} />
                </button>
                <div className="player-meta">
                    <span
                        className="player-name-top"
                        style={{ color: CLASS_COLORS[player.className] || '#fff' }}
                    >
                        {player.name}
                    </span>
                    <RoleIcon role={player.role} />
                </div>
            </div>
            <div className="player-items">
                <AnimatePresence>
                    {player.items.map(item => (
                        <motion.div
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                            key={item.instanceId}
                            className="item-icon-slot"
                            onMouseEnter={(e) => {
                                const rect = e.currentTarget.getBoundingClientRect();
                                onHoverItem({
                                    item,
                                    x: rect.left,
                                    y: rect.top
                                });
                            }}
                            onMouseLeave={onLeaveItem}
                        >
                            <ItemIcon item={item} size="medium" />
                            <button
                                className="remove-item"
                                onClick={() => {
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
                        onClick={(e) => {
                            e.stopPropagation();
                            const rect = e.currentTarget.getBoundingClientRect();
                            onShowLootMenu({
                                playerId: player.id,
                                x: rect.left,
                                y: rect.top
                            });
                        }}
                    >
                        <Plus size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
}

export default React.memo(PlayerRow);
