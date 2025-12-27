import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Import, Users } from 'lucide-react';
import RAIDS from './data/raids.json';
import RaidSelector from './components/RaidSelector';
import BossSlider from './components/BossSlider';
import ImportModal from './components/ImportModal';
import LootPopUp from './components/LootPopUp';
import PlayerRow from './components/PlayerRow';
import AddPlayerForm from './components/AddPlayerForm';

function App() {
    const [activeRaid, setActiveRaid] = useState('karazhan');
    const [activeBoss, setActiveBoss] = useState(RAIDS['karazhan'].bosses[0].id);
    const [players, setPlayers] = useState([]);
    const [showImport, setShowImport] = useState(true);
    const [showLootMenu, setShowLootMenu] = useState(null); // {playerId, x, y}
    const [editingPlayerId, setEditingPlayerId] = useState(null);
    const [hoveredGridItem, setHoveredGridItem] = useState(null); // {item, x, y}

    // New/Edit Player state
    const [isAddingPlayer, setIsAddingPlayer] = useState(false);
    const [tempPlayer, setTempPlayer] = useState({ name: '', className: 'Warrior', spec: 'Arms' });

    const handleImport = (importText) => {
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

    return (
        <div className="app-container">
            {/* Header */}
            <header className="main-header glass-panel">
                <div className="logo">
                    <h1>TBC LOOT <span className="accent">TRACKER</span></h1>
                </div>
                <RaidSelector
                    activeRaid={activeRaid}
                    onSelectRaid={(id) => {
                        setActiveRaid(id);
                        setActiveBoss(RAIDS[id].bosses[0].id);
                    }}
                />
                <div className="header-actions">
                    <button className="import-btn-header" onClick={() => setShowImport(true)}>
                        <Import size={18} /> <span>Import</span>
                    </button>
                </div>
            </header>

            {/* Boss Slider */}
            <BossSlider
                raid={RAIDS[activeRaid]}
                activeBoss={activeBoss}
                setActiveBoss={setActiveBoss}
            />

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
                            <PlayerRow
                                key={player.id}
                                player={player}
                                isEditing={editingPlayerId === player.id}
                                tempPlayer={tempPlayer}
                                setTempPlayer={setTempPlayer}
                                onSaveEdit={handleSaveEdit}
                                onStartEdit={startEdit}
                                onRemoveItem={removeItem}
                                onShowLootMenu={setShowLootMenu}
                                onHoverItem={setHoveredGridItem}
                                onLeaveItem={() => setHoveredGridItem(null)}
                            />
                        ))}

                        {/* Add Player Form */}
                        <AddPlayerForm
                            isAddingPlayer={isAddingPlayer}
                            setIsAddingPlayer={setIsAddingPlayer}
                            tempPlayer={tempPlayer}
                            setTempPlayer={setTempPlayer}
                            onAddPlayer={handleAddManualPlayer}
                        />
                    </div>
                </div>
            </main>

            {/* Import Modal */}
            <AnimatePresence>
                {showImport && (
                    <ImportModal
                        onImport={handleImport}
                        onClose={() => setShowImport(false)}
                    />
                )}
            </AnimatePresence>

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
        </div>
    );
}

export default App;
