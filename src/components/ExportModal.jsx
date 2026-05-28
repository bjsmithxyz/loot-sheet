import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ExportIcon } from './ActionIcons';
import { hapticSuccess } from '../utils/haptics';

export default function ExportModal({ exportData, onClose }) {
    const textareaRef = useRef(null);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        textareaRef.current?.focus();
        textareaRef.current?.select();
    }, []);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.write([
                new ClipboardItem({
                    'text/html': new Blob([exportData.html], { type: 'text/html' }),
                    'text/plain': new Blob([exportData.plain], { type: 'text/plain' }),
                }),
            ]);
            setCopied(true);
            hapticSuccess();
            setTimeout(() => setCopied(false), 2000);
        } catch {
            try {
                await navigator.clipboard.writeText(exportData.plain);
                setCopied(true);
                hapticSuccess();
                setTimeout(() => setCopied(false), 2000);
            } catch {
                textareaRef.current?.select();
                document.execCommand('copy');
                setCopied(true);
                hapticSuccess();
                setTimeout(() => setCopied(false), 2000);
            }
        }
    };

    return (
        <div className="modal-overlay">
            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="import-modal glass-panel"
            >
                <h2>Export Loot Sheet</h2>
                <p>Copy and paste into a spreadsheet. Player names keep class colours; each loot item gets its own column.</p>
                <textarea
                    ref={textareaRef}
                    readOnly
                    value={exportData.plain}
                />
                <div className="modal-actions-import">
                    <button className="skip-btn" onClick={onClose}>Close</button>
                    <button className="import-btn-main export-copy-btn" onClick={handleCopy}>
                        <ExportIcon size={18} strokeWidth={2.25} />
                        {copied ? 'Copied!' : 'Copy to Clipboard'}
                    </button>
                </div>
            </motion.div>
        </div>
    );
}
