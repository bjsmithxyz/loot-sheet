import React from 'react';
import RAIDS from '../data/raids.json';

export default function RaidSelector({ activeRaid, onSelectRaid }) {
    return (
        <div className="raid-selector">
            {Object.entries(RAIDS).map(([id, raid]) => (
                <button
                    key={id}
                    className={`raid-btn ${activeRaid === id ? 'active' : ''}`}
                    onClick={() => onSelectRaid(id)}
                >
                    {raid.name}
                </button>
            ))}
        </div>
    );
}
