import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, Import, Shield, Swords, Users, UserPlus, Pencil, Check } from 'lucide-react';

// --- Data Imports ---
import RAIDS from './data/raids.json';
import BOSS_LOOT from './data/loot.json';

// --- Data Constants ---
const CLASS_COLORS = {
    Warrior: 'var(--color-warrior)',
    Paladin: 'var(--color-paladin)',
    Hunter: 'var(--color-hunter)',
    Rogue: 'var(--color-rogue)',
    Priest: 'var(--color-priest)',
    Shaman: 'var(--color-shaman)',
    Mage: 'var(--color-mage)',
    Warlock: 'var(--color-warlock)',
    Druid: 'var(--color-druid)'
};

const CLASS_SPECS = {
    Warrior: ['Arms', 'Fury', 'Protection'],
    Paladin: ['Holy', 'Protection', 'Retribution'],
    Hunter: ['Beast Mastery', 'Marksmanship', 'Survival'],
    Rogue: ['Assassination', 'Combat', 'Subtlety'],
    Priest: ['Discipline', 'Holy', 'Shadow'],
    Shaman: ['Elemental', 'Enhancement', 'Restoration'],
    Mage: ['Arcane', 'Fire', 'Frost'],
    Warlock: ['Affliction', 'Demonology', 'Destruction'],
    Druid: ['Balance', 'Feral', 'Restoration']
};

const SPEC_TO_ROLE = {
    'Protection': 'tank',
    'Holy': 'healer',
    'Restoration': 'healer',
    'Discipline': 'healer',
    'Feral': 'tank',
    'Guardian': 'tank',
    'Restoration Shaman': 'healer',
    'Restoration Druid': 'healer',
    'Holy Paladin': 'healer'
};

const CLASSES = Object.keys(CLASS_COLORS);

const TOKEN_CLASSES = {
    'Defender': ['Warrior', 'Priest', 'Druid'],
    'Champion': ['Paladin', 'Rogue', 'Shaman'],
    'Hero': ['Hunter', 'Mage', 'Warlock']
};

const getTokenClasses = (itemName) => {
    if (itemName.includes('Defender')) return TOKEN_CLASSES['Defender'];
    if (itemName.includes('Champion')) return TOKEN_CLASSES['Champion'];
    if (itemName.includes('Hero')) return TOKEN_CLASSES['Hero'];
    return null;
};

// --- Components ---

function App() {
    const [activeRaid, setActiveRaid] = useState('karazhan');
    const [activeBoss, setActiveBoss] = useState(RAIDS['karazhan'].bosses[0].id);
    const [players, setPlayers] = useState([]);
    const [importText, setImportText] = useState('');
    const [showImport, setShowImport] = useState(true);
    const [showLootMenu, setShowLootMenu] = useState(null); // {playerId, x, y}
    const [editingPlayerId, setEditingPlayerId] = useState(null);
    const [hoveredGridItem, setHoveredGridItem] = useState(null); // {item, x, y}

    // New/Edit Player state
    const [isAddingPlayer, setIsAddingPlayer] = useState(false);
    const [tempPlayer, setTempPlayer] = useState({ name: '', className: 'Warrior', spec: 'Arms' });

    const handleImport = () => {
        if (!importText) return;
        const playerData = importText.split('|').map(p => {
            const [name, className, spec] = p.split(':');
            return {
                id: Math.random().toString(36).substr(2, 9),
                name,
                className: className || 'Warrior',
                spec: spec || 'None',
                items: []
            };
        });
        setPlayers(playerData);
        setShowImport(false);
    };

    const addItem = (playerId, item) => {
        setPlayers(prev => prev.map(p => {
            if (p.id === playerId) {
                return { ...p, items: [...p.items, { ...item, instanceId: Date.now() }] };
            }
            return p;
        }));
        setShowLootMenu(null);
    };

    const removeItem = (playerId, instanceId) => {
        setPlayers(prev => prev.map(p => {
            if (p.id === playerId) {
                return { ...p, items: p.items.filter(i => i.instanceId !== instanceId) };
            }
            return p;
        }));
    };

    const handleAddManualPlayer = () => {
        if (!tempPlayer.name) return;
        const player = {
            id: Math.random().toString(36).substr(2, 9),
            ...tempPlayer,
            items: []
        };
        setPlayers([...players, player]);
        setTempPlayer({ name: '', className: 'Warrior', spec: 'Arms' });
        setIsAddingPlayer(false);
    };

    const handleSaveEdit = () => {
        setPlayers(prev => prev.map(p => {
            if (p.id === editingPlayerId) {
                return { ...p, ...tempPlayer };
            }
            return p;
        }));
        setEditingPlayerId(null);
        setTempPlayer({ name: '', className: 'Warrior', spec: 'Arms' });
    };

    const startEdit = (player) => {
        setEditingPlayerId(player.id);
        setTempPlayer({ name: player.name, className: player.className, spec: player.spec });
    };

    const getRoleIcon = (spec) => {
        const role = SPEC_TO_ROLE[spec] || 'dps';
        if (role === 'tank') return <Shield size={12} className="role-icon tank" />;
        if (role === 'healer') return <Plus size={12} className="role-icon healer" />;
        return <Swords size={12} className="role-icon dps" />;
    };

    return (
        <div className="app-container">
            {/* Header */}
            <header className="main-header glass-panel">
                <div className="logo">
                    <h1>TBC LOOT <span className="accent">TRACKER</span></h1>
                </div>
                <div className="raid-selector">
                    {Object.entries(RAIDS).map(([id, raid]) => (
                        <button
                            key={id}
                            className={`raid-btn ${activeRaid === id ? 'active' : ''}`}
                            onClick={() => {
                                setActiveRaid(id);
                                setActiveBoss(RAIDS[id].bosses[0].id);
                            }}
                        >
                            {raid.name}
                        </button>
                    ))}
                </div>
                <div className="header-actions">
                    <button className="import-btn-header" onClick={() => setShowImport(true)}>
                        <Import size={18} /> <span>Import</span>
                    </button>
                </div>
            </header>

            {/* Boss Slider */}
            <div className="boss-slider">
                {RAIDS[activeRaid].bosses.map(boss => (
                    <button
                        key={boss.id}
                        className={`boss-btn ${activeBoss === boss.id ? 'active' : 'faded'}`}
                        onClick={() => setActiveBoss(boss.id)}
                    >
                        {boss.name}
                    </button>
                ))}
            </div>

            {/* Main Content */}
            <main className="content">
                <div className="spreadsheet glass-panel">
                    <div className="grid-header">
                        <div className="col-name">Player</div>
                        <div className="col-items">Loot Obtained</div>
                    </div>
                    <div className="grid-body">
                        {players.length === 0 && (
                            <div className="empty-state">
                                <Users size={48} />
                                <p>No players imported. Use the import tool or add manually below.</p>
                            </div>
                        )}
                        {players.map(player => (
                            <div key={player.id} className="player-row">
                                <div className="player-meta-container">
                                    {editingPlayerId === player.id ? (
                                        <div className="inline-edit-form">
                                            <input
                                                type="text"
                                                value={tempPlayer.name}
                                                onChange={(e) => setTempPlayer({ ...tempPlayer, name: e.target.value })}
                                                onKeyDown={(e) => e.key === 'Enter' && handleSaveEdit()}
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
                                            <button className="save-edit-btn" onClick={handleSaveEdit}><Check size={16} /></button>
                                        </div>
                                    ) : (
                                        <>
                                            <button className="edit-action-btn" onClick={() => startEdit(player)}>
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
                                                    {getRoleIcon(player.spec)}
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
                                                    setHoveredGridItem({
                                                        item,
                                                        x: rect.left,
                                                        y: rect.top
                                                    });
                                                }}
                                                onMouseLeave={() => setHoveredGridItem(null)}
                                            >
                                                <div className="item-inner">{item.acronym || item.name[0]}</div>
                                                <button
                                                    className="remove-item"
                                                    onClick={() => {
                                                        removeItem(player.id, item.instanceId);
                                                        setHoveredGridItem(null);
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
                                                setShowLootMenu({
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
                        ))}

                        {/* Add Player Row */}
                        <div className="add-player-row">
                            {!isAddingPlayer ? (
                                <button className="add-player-init" onClick={() => {
                                    setIsAddingPlayer(true);
                                    setTempPlayer({ name: '', className: 'Warrior', spec: 'Arms' });
                                }}>
                                    <UserPlus size={18} /> Add player
                                </button>
                            ) : (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="add-player-form"
                                >
                                    <input
                                        type="text"
                                        placeholder="Player Name"
                                        value={tempPlayer.name}
                                        onChange={(e) => setTempPlayer({ ...tempPlayer, name: e.target.value })}
                                        onKeyDown={(e) => e.key === 'Enter' && handleAddManualPlayer()}
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
                                        <button className="confirm-add" onClick={handleAddManualPlayer}>Add</button>
                                        <button className="cancel-add" onClick={() => setIsAddingPlayer(false)}>Cancel</button>
                                    </div>
                                </motion.div>
                            )}
                        </div>
                    </div>
                </div>
            </main>

            {/* Import Modal */}
            {showImport && (
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
                            <button className="skip-btn" onClick={() => setShowImport(false)}>Skip</button>
                            <button className="import-btn-main" onClick={handleImport}>Import</button>
                        </div>
                    </motion.div>
                </div>
            )}

            {/* Grid Item Tooltip */}
            <AnimatePresence>
                {hoveredGridItem && (
                    <div
                        className="item-tooltip-wow grid-tooltip"
                        style={{
                            position: 'fixed',
                            left: hoveredGridItem.x + 50,
                            top: Math.min(hoveredGridItem.y, window.innerHeight - 300),
                            zIndex: 2000,
                            pointerEvents: 'none'
                        }}
                    >
                        <div className={`wow-name rarity-text-${hoveredGridItem.item.rarity}`}>
                            {hoveredGridItem.item.name}
                        </div>
                    </div>
                )}
            </AnimatePresence>

            {/* Loot Menu */}
            <AnimatePresence>
                {showLootMenu && (
                    <LootPopUp
                        bossId={activeBoss}
                        position={showLootMenu}
                        onSelect={(item) => addItem(showLootMenu.playerId, item)}
                        onClose={() => setShowLootMenu(null)}
                    />
                )}
            </AnimatePresence>

            <style jsx global>{`
        .app-container {
          display: flex;
          flex-direction: column;
          height: 100vh;
          padding: 20px;
          gap: 20px;
        }

        .main-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 15px 30px;
        }

        .accent { color: var(--accent); }

        .raid-selector {
          display: flex;
          gap: 10px;
        }

        .raid-btn {
          background: transparent;
          border: 1px solid var(--glass-border);
          color: var(--text-secondary);
          padding: 8px 20px;
          border-radius: 20px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .raid-btn.active {
          background: var(--accent);
          color: #000;
          border-color: var(--accent);
        }

        .import-btn-header {
            background: var(--bg-secondary);
            border: 1px solid var(--glass-border);
            color: var(--text-primary);
            padding: 8px 16px;
            border-radius: 8px;
            display: flex;
            align-items: center;
            gap: 8px;
            cursor: pointer;
            transition: all 0.2s;
        }

        .import-btn-header:hover {
            background: var(--bg-tertiary);
            border-color: var(--accent);
            color: var(--accent);
        }

        .boss-slider {
          display: flex;
          gap: 10px;
          padding: 10px 0;
          overflow-x: auto;
        }

        .boss-btn {
          background: var(--bg-secondary);
          border: 1px solid var(--glass-border);
          color: var(--text-primary);
          padding: 10px 20px;
          border-radius: 8px;
          cursor: pointer;
          white-space: nowrap;
          transition: all 0.3s ease;
        }

        .boss-btn.active {
          border-color: var(--accent);
          background: var(--bg-tertiary);
          box-shadow: 0 0 15px rgba(212, 175, 55, 0.2);
        }

        .boss-btn.faded { opacity: 0.5; }

        .spreadsheet {
          flex: 1;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .grid-header {
          display: flex;
          padding: 15px 30px;
          border-bottom: 1px solid var(--glass-border);
          font-weight: 700;
          color: var(--text-secondary);
          text-transform: uppercase;
          font-size: 0.8rem;
          letter-spacing: 1px;
        }

        .col-name { width: 250px; }
        .col-items { flex: 1; }

        .grid-body {
          flex: 1;
          overflow-y: auto;
          padding: 10px 0;
        }

        .player-row {
          display: flex;
          align-items: center;
          padding: 12px 30px;
          border-bottom: 1px solid rgba(255,255,255,0.03);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .player-row:hover {
          background: rgba(255,255,255,0.03);
          transform: translateX(4px);
        }

        .player-meta-container {
            min-width: 250px;
            display: flex;
            align-items: center;
            gap: 12px;
            position: relative;
        }

        .edit-action-btn {
            background: transparent;
            border: none;
            color: var(--text-secondary);
            cursor: pointer;
            opacity: 0;
            transition: opacity 0.2s, color 0.2s;
            position: absolute;
            left: -25px;
        }

        .player-row:hover .edit-action-btn {
            opacity: 1;
        }

        .edit-action-btn:hover {
            color: var(--accent);
        }

        .inline-edit-form {
            display: flex;
            flex-direction: column;
            gap: 12px;
            width: 420px;
            background: rgba(10, 10, 20, 0.95);
            padding: 15px;
            border-radius: 12px;
            border: 1px solid var(--accent);
            box-shadow: 0 10px 40px rgba(0,0,0,0.8);
            z-index: 50;
        }

        .inline-edit-form input {
            background: #000;
            border: 1px solid var(--glass-border);
            color: #fff;
            padding: 8px 12px;
            border-radius: 6px;
            font-size: 1rem;
            width: 100%;
        }

        .edit-options { 
            display: flex; 
            flex-direction: column; 
            gap: 12px; 
            padding: 4px 0;
        }

        .class-selector.small { gap: 8px; flex-wrap: nowrap; }
        .class-circle.small { width: 18px; height: 18px; flex-shrink: 0; }
        .spec-selector.small { display: flex; gap: 6px; flex-wrap: wrap; }
        .spec-btn.small { padding: 4px 10px; font-size: 0.8rem; }
        
        .save-edit-btn {
            background: var(--accent);
            color: #000;
            border: none;
            border-radius: 4px;
            padding: 4px;
            cursor: pointer;
            align-self: flex-end;
        }

        .player-meta {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .player-name-top {
          font-weight: 700;
          font-size: 1.1rem;
          text-shadow: 0 2px 4px rgba(0,0,0,0.3);
        }

        .player-spec-line {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .player-spec-name {
          font-size: 0.8rem;
          color: var(--text-secondary);
          font-style: italic;
        }

        .role-icon.tank { color: #facc15; }
        .role-icon.healer { color: #22c55e; }
        .role-icon.dps { color: #ef4444; }

        .player-items {
          flex: 1;
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
        }

        .item-icon {
          width: 44px;
          height: 44px;
          border-radius: 6px;
          background: #111;
          border: 2px solid #333;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          cursor: pointer;
          transition: all 0.2s ease;
          overflow: hidden;
        }

        .item-icon:hover { transform: scale(1.1); z-index: 10; }

        .rarity-epic { border-color: var(--rarity-epic); box-shadow: 0 0 10px rgba(163, 53, 238, 0.2); }
        .rarity-legendary { border-color: var(--rarity-legendary); box-shadow: 0 0 15px rgba(255, 128, 0, 0.4); }

        .remove-item {
          position: absolute;
          top: 0; left: 0; width: 100%; height: 100%;
          background: rgba(255, 0, 0, 0.8);
          border: none; color: white;
          display: flex; align-items: center; justify-content: center;
          opacity: 0; transition: opacity 0.2s;
        }

        .item-icon:hover .remove-item { opacity: 1; }

        .add-item-btn {
          width: 40px; height: 40px; border-radius: 50%;
          background: var(--bg-tertiary);
          border: 2px dashed var(--glass-border);
          color: var(--text-secondary);
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; transition: all 0.2s ease;
        }

        .add-item-btn:hover { border-color: var(--accent); color: var(--accent); }

        .add-player-row {
          padding: 20px 30px;
          border-top: 1px dashed var(--glass-border);
        }

        .add-player-init {
          background: transparent;
          border: 1px dashed var(--glass-border);
          color: var(--text-secondary);
          padding: 10px 20px;
          border-radius: 8px;
          cursor: pointer;
          display: flex; align-items: center; gap: 8px;
          width: 100%; justify-content: center;
          transition: all 0.2s;
        }

        .add-player-init:hover {
          border-color: var(--accent);
          color: var(--accent);
          background: rgba(212, 175, 55, 0.05);
        }

        .add-player-form {
          display: flex; flex-direction: column; gap: 15px; 
          background: var(--bg-secondary);
          padding: 20px; border-radius: 12px;
          border: 1px solid var(--glass-border);
        }

        .name-input {
          background: #000; border: 1px solid var(--glass-border);
          color: #fff; padding: 10px 15px; border-radius: 6px;
          width: 100%; font-size: 1rem;
        }

        .class-selector {
          display: flex; gap: 10px; flex-wrap: wrap; justify-content: flex-start;
        }

        .class-circle {
          width: 32px; height: 32px; border-radius: 50%;
          border: 2px solid transparent; cursor: pointer;
          transition: all 0.2s;
        }

        .class-circle.active {
          transform: scale(1.2); border-color: #fff;
          box-shadow: 0 0 10px rgba(255,255,255,0.5);
        }

        .spec-selector {
          display: flex; gap: 8px; justify-content: flex-start;
        }

        .spec-btn {
          background: rgba(255,255,255,0.05);
          border: 1px solid var(--glass-border);
          color: var(--text-secondary);
          padding: 6px 12px; border-radius: 4px;
          cursor: pointer; font-size: 0.85rem; font-style: italic;
          transition: all 0.2s;
        }

        .spec-btn.active {
          background: var(--accent); color: #000;
          border-color: var(--accent); font-weight: 700;
        }

        .form-actions {
          display: flex; gap: 15px; justify-content: flex-start; width: 100%;
        }

        .confirm-add {
          background: var(--accent); color: #000;
          border: none; padding: 8px 24px; border-radius: 4px;
          font-weight: 700; cursor: pointer;
        }

        .cancel-add {
          background: transparent; color: var(--text-secondary);
          border: none; cursor: pointer; font-weight: 500;
        }

        .modal-overlay {
          position: fixed; top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0,0,0,0.85); backdrop-filter: blur(8px);
          display: flex; align-items: center; justify-content: center; z-index: 100;
        }

        .import-modal {
          width: 500px; padding: 30px; display: flex; flex-direction: column; gap: 20px;
        }

        .modal-actions-import {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 10px;
        }

        .skip-btn {
          background: transparent;
          border: none;
          color: var(--text-secondary);
          cursor: pointer;
          font-weight: 500;
        }

        .import-btn-main {
          background: var(--accent);
          color: #000;
          border: none;
          padding: 8px 24px;
          border-radius: 4px;
          font-weight: 700;
          cursor: pointer;
        }

        textarea {
          background: #000; border: 1px solid var(--glass-border);
          color: #fff; padding: 15px; border-radius: 8px; min-height: 150px;
        }

        .empty-state {
          display: flex; flex-direction: column; align-items: center;
          justify-content: center; padding: 60px; color: var(--text-secondary); gap: 20px;
        }
      `}</style>
        </div>
    );
}

function LootPopUp({ bossId, position, onSelect, onClose }) {
    const loot = BOSS_LOOT[bossId] || [];
    const [hoveredItem, setHoveredItem] = useState(null);

    useEffect(() => {
        const handleClickOutside = () => {
            onClose();
        };

        const timer = setTimeout(() => {
            window.addEventListener('click', handleClickOutside);
        }, 10);

        return () => {
            clearTimeout(timer);
            window.removeEventListener('click', handleClickOutside);
        };
    }, [onClose]);

    return (
        <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="loot-popup glass-panel"
            style={{
                position: 'fixed',
                left: position.x + 50,
                top: Math.min(position.y, window.innerHeight - 300),
                zIndex: 1000
            }}
            onClick={(e) => e.stopPropagation()}
        >
            <div className="loot-list">
                {loot.map(item => (
                    <div
                        key={item.id}
                        className="loot-item"
                        onClick={() => onSelect(item)}
                        onMouseEnter={() => setHoveredItem(item)}
                        onMouseLeave={() => setHoveredItem(null)}
                    >
                        <div className={`item-icon-small rarity-${item.rarity}`}>
                            {item.name[0]}
                        </div>
                        <span className={`item-name rarity-text-${item.rarity}`}>
                            {item.name}
                            {getTokenClasses(item.name) && (
                                <div className="token-classes-row small">
                                    {getTokenClasses(item.name).map(c => (
                                        <div
                                            key={c}
                                            className="token-class-dot small"
                                            style={{ backgroundColor: CLASS_COLORS[c] }}
                                        />
                                    ))}
                                </div>
                            )}
                        </span>
                    </div>
                ))}
                {loot.length === 0 && <div className="no-loot">No loot recorded.</div>}
            </div>

            {/* Stats Tooltip */}
            <AnimatePresence>
                {hoveredItem && (
                    <motion.div
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        className="item-tooltip-wow"
                        style={{ position: 'absolute', top: 0, left: '100%', marginLeft: '15px' }}
                    >
                        <TooltipContent item={hoveredItem} />
                    </motion.div>
                )}
            </AnimatePresence>

            <style jsx global>{`
        .loot-popup {
          padding: 10px; min-width: 220px;
          box-shadow: 0 10px 40px rgba(0,0,0,0.6);
          border: 1px solid var(--accent);
          position: relative;
        }
        .loot-list { display: flex; flex-direction: column; gap: 2px; }
        .loot-item {
          display: flex; align-items: center; gap: 8px;
          padding: 4px 6px; border-radius: 4px; cursor: pointer;
          transition: background 0.2s;
        }
        .loot-item:hover { background: rgba(255,255,255,0.05); }
        
        .item-icon-small {
            width: 24px;
            height: 24px;
            border-radius: 2px;
            background: #000;
            border: 1px solid #333;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 0.6rem;
            font-weight: bold;
        }

        .item-name { font-weight: 500; font-size: 0.75rem; display: flex; align-items: center; }
        
        .token-classes-row.small { display: inline-flex; gap: 4px; margin-left: 6px; }
        .token-class-dot.small { width: 6px; height: 6px; border-radius: 50%; }

        .item-tooltip-wow {
            width: 280px;
            padding: 12px;
            z-index: 1100;
            pointer-events: none;
            background: #070c21;
            border: 1px solid #353959;
            box-shadow: 0 10px 30px rgba(0,0,0,0.8);
            border-radius: 4px;
            font-family: 'Inter', sans-serif;
            line-height: 1.4;
            color: #fff;
            text-align: left;
        }

        .item-tooltip-wow.grid-tooltip {
            width: auto;
            min-width: 120px;
            padding: 8px 12px;
            background: rgba(7, 12, 33, 0.95);
            border: 1px solid var(--accent);
            box-shadow: 0 5px 20px rgba(0,0,0,0.8);
        }

        .item-tooltip-wow.grid-tooltip .wow-name {
            font-size: 0.9rem;
            margin-bottom: 0;
        }

        .wow-name { font-size: 1.1rem; font-weight: 700; margin-bottom: 2px; }
        .wow-ilevel { color: #ffd100; font-size: 0.85rem; }
        .wow-bind { color: #fff; font-size: 0.85rem; }
        .wow-type { color: #fff; font-size: 0.85rem; }
        .wow-stat { color: #fff; font-size: 0.85rem; }
        .wow-req { color: #fff; font-size: 0.85rem; margin-top: 4px; }
        .wow-equip, .wow-use { color: #fff; font-size: 0.85rem; margin-top: 6px; }
        .wow-green { color: #1eff00 !important; }
        .wow-flavor { color: #ffd100; font-size: 0.85rem; font-style: italic; margin-top: 6px; }

        .rarity-text-epic { color: #a335ee; }
        .rarity-text-legendary { color: #ff8000; }
        .rarity-text-rare { color: #0070dd; }

        .token-classes-row {
            display: inline-flex;
            gap: 6px;
            margin-left: 10px;
            vertical-align: middle;
        }
        .token-class-dot {
            width: 10px;
            height: 10px;
            border-radius: 50%;
            border: 1px solid rgba(255,255,255,0.4);
            box-shadow: 0 0 5px rgba(0,0,0,0.5);
        }
        .token-classes-row.small { gap: 4px; margin-left: 6px; }
        .token-class-dot.small { width: 6px; height: 6px; border: none; box-shadow: none; }
      `}</style>
        </motion.div>
    );
}

function TooltipContent({ item }) {
    const tokenClasses = getTokenClasses(item.name);
    return (
        <>
            <div className={`wow-name rarity-text-${item.rarity}`}>
                {item.name}
            </div>
            {tokenClasses && (
                <div className="wow-type">
                    Classes: {tokenClasses.map((c, i) => (
                        <span key={c} style={{ color: CLASS_COLORS[c] }}>
                            {c}{i < tokenClasses.length - 1 ? ', ' : ''}
                        </span>
                    ))}
                </div>
            )}
            {item.ilevel && <div className="wow-ilevel">Item Level {item.ilevel}</div>}
            {item.bind && <div className="wow-bind">{item.bind}</div>}
            {item.type && <div className="wow-type">{item.type}</div>}

            {item.stats && item.stats.map((stat, i) => (
                <div key={i} className="wow-stat">{stat}</div>
            ))}

            {item.req && <div className="wow-req">Requires Level {item.req}</div>}

            {item.equip && (
                <div className="wow-equip wow-green">
                    Equip: {item.equip}
                </div>
            )}
            {item.use && (
                <div className="wow-use wow-green">
                    Use: {item.use}
                </div>
            )}
            {item.flavor && <div className="wow-flavor">"{item.flavor}"</div>}
        </>
    );
}

export default App;
