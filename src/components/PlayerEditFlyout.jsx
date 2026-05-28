import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Trash2 } from 'lucide-react';
import { CLASSES, CLASS_COLORS } from '../utils/wow-constants';
import { sanitizeName } from '../utils/import-parser';
import RoleSelector from './RoleSelector';

const VIEWPORT_MARGIN = 12;

function getInitialPosition(position) {
    return {
        left: position.x,
        top: position.y + position.height + 6,
    };
}

export default function PlayerEditFlyout({
    tempPlayer,
    setTempPlayer,
    onSave,
    onDelete,
    onClose,
    position,
}) {
    const flyoutRef = useRef(null);
    const [flyoutStyle, setFlyoutStyle] = useState(() => getInitialPosition(position));

    useLayoutEffect(() => {
        const flyout = flyoutRef.current;
        if (!flyout) return;

        const rect = flyout.getBoundingClientRect();
        let { left, top } = getInitialPosition(position);

        if (rect.bottom > window.innerHeight - VIEWPORT_MARGIN) {
            top = Math.max(VIEWPORT_MARGIN, position.y - rect.height - 6);
        }
        if (rect.right > window.innerWidth - VIEWPORT_MARGIN) {
            left = Math.max(VIEWPORT_MARGIN, window.innerWidth - VIEWPORT_MARGIN - rect.width);
        }
        left = Math.max(VIEWPORT_MARGIN, left);

        setFlyoutStyle({ left, top });
    }, [position]);

    useEffect(() => {
        const timer = setTimeout(() => {
            window.addEventListener('click', onClose);
        }, 10);
        return () => {
            clearTimeout(timer);
            window.removeEventListener('click', onClose);
        };
    }, [onClose]);

    return (
        <motion.div
            ref={flyoutRef}
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="player-edit-flyout glass-panel"
            style={{
                position: 'fixed',
                left: flyoutStyle.left,
                top: flyoutStyle.top,
                zIndex: 1100,
            }}
            onClick={(e) => e.stopPropagation()}
        >
            <input
                type="text"
                value={tempPlayer.name}
                onChange={(e) => setTempPlayer({ ...tempPlayer, name: sanitizeName(e.target.value) })}
                onKeyDown={(e) => e.key === 'Enter' && onSave()}
                autoFocus
            />
            <div className="edit-options">
                <div className="class-selector small">
                    {CLASSES.map(c => (
                        <button
                            key={c}
                            type="button"
                            className={`class-circle small ${tempPlayer.className === c ? 'active' : ''}`}
                            style={{ backgroundColor: CLASS_COLORS[c] }}
                            onClick={() => setTempPlayer({ ...tempPlayer, className: c })}
                            title={c}
                        />
                    ))}
                </div>
                <RoleSelector
                    role={tempPlayer.role}
                    onChange={(role) => setTempPlayer({ ...tempPlayer, role })}
                    size="small"
                />
            </div>
            <div className="edit-form-actions">
                <button
                    type="button"
                    className="delete-player-btn"
                    onClick={onDelete}
                    title="Delete player"
                >
                    <Trash2 size={16} />
                </button>
                <button type="button" className="save-edit-btn" onClick={onSave} title="Save changes">
                    <Check size={16} />
                </button>
            </div>
        </motion.div>
    );
}
