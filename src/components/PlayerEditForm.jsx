import React from 'react';
import { Check, Trash2 } from 'lucide-react';
import { CLASSES, CLASS_COLORS } from '../utils/wow-constants';
import { sanitizeName } from '../utils/import-parser';
import RoleSelector from './RoleSelector';

export default function PlayerEditForm({
    tempPlayer,
    setTempPlayer,
    onSave,
    onDelete,
    size = 'small',
}) {
    return (
        <>
            <input
                type="text"
                value={tempPlayer.name}
                onChange={(e) => setTempPlayer({ ...tempPlayer, name: sanitizeName(e.target.value) })}
                onKeyDown={(e) => e.key === 'Enter' && onSave()}
                autoFocus
            />
            <div className="edit-options">
                <div className={`class-selector ${size === 'small' ? 'small' : ''}`}>
                    {CLASSES.map((className) => (
                        <button
                            key={className}
                            type="button"
                            className={`class-circle ${size === 'small' ? 'small' : ''} ${tempPlayer.className === className ? 'active' : ''}`}
                            style={{ backgroundColor: CLASS_COLORS[className] }}
                            onClick={() => setTempPlayer({ ...tempPlayer, className })}
                            title={className}
                            aria-label={className}
                        />
                    ))}
                </div>
                <RoleSelector
                    role={tempPlayer.role}
                    onChange={(role) => setTempPlayer({ ...tempPlayer, role })}
                    size={size}
                />
            </div>
            <div className="edit-form-actions">
                <button
                    type="button"
                    className="delete-player-btn"
                    onClick={onDelete}
                    title="Delete player"
                    aria-label="Delete player"
                >
                    <Trash2 size={16} />
                </button>
                <button
                    type="button"
                    className="save-edit-btn"
                    onClick={onSave}
                    title="Save changes"
                    aria-label="Save changes"
                >
                    <Check size={16} />
                </button>
            </div>
        </>
    );
}
