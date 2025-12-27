import React, { useState } from 'react';
import { motion } from 'framer-motion';

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
                <h2>Raid Export Import</h2>
                <p>Paste your addon export string below:</p>
                <textarea
                    value={importText}
                    onChange={(e) => setImportText(e.target.value)}
                    placeholder="Name:Class:Spec|Name:Class:Spec..."
                />
                <div className="modal-actions-import">
                    <button className="skip-btn" onClick={onClose}>Skip</button>
                    <button className="import-btn-main" onClick={handleImport}>Import</button>
                </div>
            </motion.div>
        </div>
    );
}
