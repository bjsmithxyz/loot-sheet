import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Import, Download, Users, Sun, Moon } from 'lucide-react';
import RAIDS from './data/raids.json';
import ItemTooltip from './components/ItemTooltip';
import { parseImportText, createPlayer } from './utils/import-parser';
import RaidSelector from './components/RaidSelector';
import BossSlider from './components/BossSlider';
import ImportModal from './components/ImportModal';
import ExportModal from './components/ExportModal';
import LootPopUp from './components/LootPopUp';
import PlayerRow from './components/PlayerRow';
import { formatPlayersForSpreadsheet } from './utils/export-formatter';
import { pickRandomTbcIcon, getHeaderIconUrl } from './utils/header-icon';
import Confetti from './components/Confetti';
import AddPlayerForm from './components/AddPlayerForm';
import { applyItemRarity, isLegendaryFlavorItem } from './utils/special-loot';
import { applyTheme, getInitialTheme, toggleTheme } from './utils/theme';

function App() {
    const [activeRaid, setActiveRaid] = useState('karazhan');
    const [activeBoss, setActiveBoss] = useState(RAIDS['karazhan'].bosses[0].id);
    const [players, setPlayers] = useState([]);
    const [showImport, setShowImport] = useState(true);
    const [showExport, setShowExport] = useState(false);
    const [showLootMenu, setShowLootMenu] = useState(null); // {playerId, x, y}
    const [editingPlayerId, setEditingPlayerId] = useState(null);
    const [hoveredGridItem, setHoveredGridItem] = useState(null); // {item, x, y}

    // New/Edit Player state
    const [isAddingPlayer, setIsAddingPlayer] = useState(false);
    const [tempPlayer, setTempPlayer] = useState({ name: '', className: 'Warrior', spec: 'Arms' });
    const [headerIcon, setHeaderIcon] = useState(() => pickRandomTbcIcon());
    const [iconShaking, setIconShaking] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false);
    const [theme, setTheme] = useState(getInitialTheme);

    const handleThemeToggle = () => {
        setTheme((current) => {
            const next = toggleTheme(current);
            applyTheme(next);
            return next;
        });
    };

    const handleHeaderIconClick = () => {
        setIconShaking(true);
        setHeaderIcon((current) => pickRandomTbcIcon(current));
        window.setTimeout(() => setIconShaking(false), 400);
    };

    const handleImport = (importText) => {
        const playerData = parseImportText(importText).map(createPlayer);
        if (playerData.length === 0) return;
        setPlayers(playerData);
        setShowImport(false);
    };

    const addItem = (playerId, item) => {
        const normalizedItem = applyItemRarity(item);
        if (isLegendaryFlavorItem(item)) {
            setShowConfetti(true);
        }
        setPlayers(prev => prev.map(p => {
            if (p.id === playerId) {
                return { ...p, items: [...p.items, { ...normalizedItem, instanceId: Date.now() }] };
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
        const player = createPlayer(tempPlayer);
        setPlayers([...players, player]);
        setTempPlayer({ name: '', className: 'Warrior', spec: 'Arms' });
        setIsAddingPlayer(false);
    };

    const handleSaveEdit = () => {
        setPlayers(prev => prev.map(p => {
            if (p.id === editingPlayerId) {
                return createPlayer({ ...tempPlayer, id: p.id, items: p.items });
            }
            return p;
        }));
        setEditingPlayerId(null);
        setTempPlayer({ name: '', className: 'Warrior', spec: 'Arms' });
    };

    const handleDeletePlayer = (playerId) => {
        setPlayers(prev => prev.filter(p => p.id !== playerId));
        setEditingPlayerId(null);
        setTempPlayer({ name: '', className: 'Warrior', spec: 'Arms' });
        if (showLootMenu?.playerId === playerId) {
            setShowLootMenu(null);
        }
    };

    const startEdit = (player) => {
        setEditingPlayerId(player.id);
        setTempPlayer({ name: player.name, className: player.className, spec: player.spec });
    };

    const exportData = formatPlayersForSpreadsheet(players, RAIDS[activeRaid].name);

    return (
        <div className="app-container">
            <Confetti active={showConfetti} onComplete={() => setShowConfetti(false)} />
            {/* Header */}
            <header className="main-header glass-panel">
                <div className="logo">
                    <h1>
                        {headerIcon && (
                            <button
                                type="button"
                                className="logo-icon-btn"
                                onClick={handleHeaderIconClick}
                                aria-label="Random loot icon"
                                title=""
                            >
                                <img
                                    src={getHeaderIconUrl(headerIcon)}
                                    alt=""
                                    className={`logo-icon ${iconShaking ? 'shaking' : ''}`}
                                    draggable={false}
                                />
                            </button>
                        )}
                        LOOT <span className="accent">SHEET</span>
                    </h1>
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
                    <button
                        className="import-btn-header"
                        onClick={() => setShowExport(true)}
                        disabled={players.length === 0}
                    >
                        <Download size={18} /> <span>Export</span>
                    </button>
                    <button
                        type="button"
                        className="import-btn-header icon-only"
                        onClick={handleThemeToggle}
                        aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
                        title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
                    >
                        {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
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
                                onDeletePlayer={handleDeletePlayer}
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

            <AnimatePresence>
                {showExport && (
                    <ExportModal
                        exportData={exportData}
                        onClose={() => setShowExport(false)}
                    />
                )}
            </AnimatePresence>

            {/* Grid Item Tooltip */}
            <AnimatePresence>
                {hoveredGridItem && (
                    <div
                        className="grid-tooltip-wrapper"
                        style={{
                            position: 'fixed',
                            left: hoveredGridItem.x + 50,
                            top: Math.min(hoveredGridItem.y, window.innerHeight - 300),
                            zIndex: 2000,
                            pointerEvents: 'none'
                        }}
                    >
                        <ItemTooltip item={hoveredGridItem.item} className="grid-tooltip" />
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
