import React from 'react';
import { sanitizeName } from '../utils/import-parser';
import { motion } from 'framer-motion';
import { UserPlus } from 'lucide-react';
import { CLASS_COLORS, CLASSES, CLASS_SPECS } from '../utils/wow-constants';

export default function AddPlayerForm({
    isAddingPlayer,
    setIsAddingPlayer,
    tempPlayer,
    setTempPlayer,
    onAddPlayer
}) {
    if (!isAddingPlayer) {
        return (
            <div className="add-player-row">
                <button className="add-player-init" onClick={() => {
                    setIsAddingPlayer(true);
                    setTempPlayer({ name: '', className: 'Warrior', spec: 'Arms' });
                }}>
                    <UserPlus size={18} /> Add player
                </button>
            </div>
        );
    }

    return (
        <div className="add-player-row">
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="add-player-form"
            >
                <input
                    type="text"
                    placeholder="Player Name"
                    value={tempPlayer.name}
                    onChange={(e) => setTempPlayer({ ...tempPlayer, name: sanitizeName(e.target.value) })}
                    onKeyDown={(e) => e.key === 'Enter' && onAddPlayer()}
                    className="name-input"
                    autoFocus
                />

                <div className="class-selector">
                    {CLASSES.map(className => (
                        <button
                            key={className}
                            className={`class-circle ${tempPlayer.className === className ? 'active' : ''}`}
                            style={{ backgroundColor: CLASS_COLORS[className] }}
                            onClick={() => {
                                setTempPlayer({
                                    ...tempPlayer,
                                    className,
                                    spec: CLASS_SPECS[className][0]
                                });
                            }}
                            title={className}
                        />
                    ))}
                </div>

                <div className="spec-selector">
                    {CLASS_SPECS[tempPlayer.className].map(spec => (
                        <button
                            key={spec}
                            className={`spec-btn ${tempPlayer.spec === spec ? 'active' : ''}`}
                            onClick={() => setTempPlayer({ ...tempPlayer, spec })}
                        >
                            {spec}
                        </button>
                    ))}
                </div>

                <div className="form-actions">
                    <button className="confirm-add" onClick={onAddPlayer}>Add</button>
                    <button className="cancel-add" onClick={() => setIsAddingPlayer(false)}>Cancel</button>
                </div>
            </motion.div>
        </div>
    );
}
