import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ImportIcon, ExportIcon } from './ActionIcons';

export default function ImportModal({ onImport, onClose }) {
    const [importText, setImportText] = useState('');

    const handleImport = () => {
        onImport(importText);
    };

    return (
        <div className="modal-overlay">
            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="import-modal glass-panel"
            >
                <h2>Addon import</h2>
                <p>Paste your addon export string below (<code>Name:Class|Name:Class</code>):</p>
                <textarea
                    value={importText}
                    onChange={(e) => setImportText(e.target.value)}
                    placeholder="Tanky:Warrior|Healy:Priest|Mmchunt:Hunter"
                />
                <div className="modal-actions-import">
                    <button className="skip-btn" onClick={onClose}>Skip</button>
                    <button className="import-btn-main import-action-btn" onClick={handleImport}>
                        <ImportIcon size={18} strokeWidth={2.25} />
                        Import
                    </button>
                </div>
            </motion.div>
        </div>
    );
}
