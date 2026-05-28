import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

const DISMISS_OFFSET = 96;
const DISMISS_VELOCITY = 400;

export default function MobileSheet({ title, onClose, children, className = '' }) {
    useEffect(() => {
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = previousOverflow;
        };
    }, []);

    return (
        <>
            <motion.button
                type="button"
                className="mobile-sheet-backdrop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                aria-label="Close"
                onClick={onClose}
            />
            <motion.div
                className={`mobile-sheet glass-panel ${className}`.trim()}
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring', damping: 30, stiffness: 320 }}
                drag="y"
                dragConstraints={{ top: 0 }}
                dragElastic={{ top: 0, bottom: 0.35 }}
                onDragEnd={(_, info) => {
                    if (info.offset.y > DISMISS_OFFSET || info.velocity.y > DISMISS_VELOCITY) {
                        onClose();
                    }
                }}
                role="dialog"
                aria-modal="true"
                aria-label={title}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="mobile-sheet-handle" aria-hidden="true" />
                {title && <h3 className="mobile-sheet-title">{title}</h3>}
                {children}
            </motion.div>
        </>
    );
}
