import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useIsMobile } from '../hooks/useIsMobile';
import MobileSheet from './MobileSheet';
import PlayerEditForm from './PlayerEditForm';

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
    playerName,
}) {
    const isMobile = useIsMobile();
    const flyoutRef = useRef(null);
    const [flyoutStyle, setFlyoutStyle] = useState(() => getInitialPosition(position));

    useLayoutEffect(() => {
        if (isMobile) return;

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
    }, [position, isMobile]);

    useEffect(() => {
        if (isMobile) return;

        const timer = setTimeout(() => {
            window.addEventListener('click', onClose);
        }, 10);
        return () => {
            clearTimeout(timer);
            window.removeEventListener('click', onClose);
        };
    }, [onClose, isMobile]);

    if (isMobile) {
        return (
            <MobileSheet
                title={playerName ? `Edit ${playerName}` : 'Edit player'}
                onClose={onClose}
                className="player-edit-sheet"
            >
                <PlayerEditForm
                    tempPlayer={tempPlayer}
                    setTempPlayer={setTempPlayer}
                    onSave={onSave}
                    onDelete={onDelete}
                    size="small"
                />
            </MobileSheet>
        );
    }

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
            <PlayerEditForm
                tempPlayer={tempPlayer}
                setTempPlayer={setTempPlayer}
                onSave={onSave}
                onDelete={onDelete}
                size="small"
            />
        </motion.div>
    );
}
