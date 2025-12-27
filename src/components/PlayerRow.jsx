import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Pencil, Check, X, Plus } from 'lucide-react';
import { CLASS_COLORS, CLASSES, CLASS_SPECS } from '../utils/wow-constants';
import RoleIcon from './RoleIcon';

export default function PlayerRow({
    player,
    isEditing,
    tempPlayer,
    setTempPlayer,
    onSaveEdit,
    onStartEdit,
    onRemoveItem,
    onShowLootMenu,
    onHoverItem,
    onLeaveItem
}) {
    return (
        <div className="player-row">
            <div className="player-meta-container">
                {isEditing ? (
                    <div className="inline-edit-form">
                        <input
                            type="text"
                            value={tempPlayer.name}
                            onChange={(e) => setTempPlayer({ ...tempPlayer, name: e.target.value })}
                            onKeyDown={(e) => e.key === 'Enter' && onSaveEdit()}
                            autoFocus
                        />
                        <div className="edit-options">
                            <div className="class-selector small">
                                {CLASSES.map(c => (
                                    <button
                                        key={c}
                                        className={`class-circle small ${tempPlayer.className === c ? 'active' : ''}`}
                                        style={{ backgroundColor: CLASS_COLORS[c] }}
                                        onClick={() => setTempPlayer({ ...tempPlayer, className: c, spec: CLASS_SPECS[c][0] })}
                                    />
                                ))}
                            </div>
                            <div className="spec-selector small">
                                {CLASS_SPECS[tempPlayer.className].map(s => (
                                    <button
                                        key={s}
                                        className={`spec-btn small ${tempPlayer.spec === s ? 'active' : ''}`}
                                        onClick={() => setTempPlayer({ ...tempPlayer, spec: s })}
                                    >
                                        {s}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <button className="save-edit-btn" onClick={onSaveEdit}><Check size={16} /></button>
                    </div>
                ) : (
                    <>
                        <button className="edit-action-btn" onClick={() => onStartEdit(player)}>
                            <Pencil size={14} />
                        </button>
                        <div className="player-meta">
                            <span
                                className="player-name-top"
                                style={{ color: CLASS_COLORS[player.className] || '#fff' }}
                            >
                                {player.name}
                            </span>
                            <div className="player-spec-line">
                                <RoleIcon spec={player.spec} />
                                <span className="player-spec-name">{player.spec}</span>
                            </div>
                        </div>
                    </>
                )}
            </div>
            <div className="player-items">
                <AnimatePresence>
                    {player.items.map(item => (
                        <motion.div
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                            key={item.instanceId}
                            className={`item-icon rarity-${item.rarity}`}
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
                            <div className="item-inner">{item.acronym || item.name[0]}</div>
                            <button
                                className="remove-item"
                                onClick={() => {
                                    onRemoveItem(player.id, item.instanceId);
                                    onLeaveItem();
                                }}
                            >
                                <X size={12} />
                            </button>
                        </motion.div>
                    ))}
                </AnimatePresence>

                <div className="add-item-container">
                    <button
                        className="add-item-btn"
                        onClick={(e) => {
                            e.stopPropagation(); // Prevent instantaneous closure
                            const rect = e.currentTarget.getBoundingClientRect();
                            onShowLootMenu({
                                playerId: player.id,
                                x: rect.left,
                                y: rect.top
                            });
                        }}
                    >
                        <Plus size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
}
