import React, { useState } from 'react';
import RAIDS from '../data/raids.json';
import FUTURE_RAIDS from '../data/future-raids.json';

export default function RaidSelector({ activeRaid, onSelectRaid }) {
    const [shakingId, setShakingId] = useState(null);

    const handleComingSoonClick = (id) => {
        setShakingId(id);
        window.setTimeout(() => setShakingId(null), 450);
    };

    return (
        <div className="raid-selector">
            {Object.entries(RAIDS).map(([id, raid]) => (
                <button
                    key={id}
                    type="button"
                    className={`raid-btn ${activeRaid === id ? 'active' : ''}`}
                    onClick={() => onSelectRaid(id)}
                >
                    {raid.name}
                </button>
            ))}
            {FUTURE_RAIDS.length > 0 && (
                <>
                    <span className="raid-selector-gap" aria-hidden="true">—</span>
                    {FUTURE_RAIDS.map((raid) => (
                        <button
                            key={raid.id}
                            type="button"
                            className={`raid-btn coming-soon ${shakingId === raid.id ? 'shake-red' : ''}`}
                            onClick={() => handleComingSoonClick(raid.id)}
                            aria-label={`${raid.name} — coming soon`}
                            title="Coming soon"
                        >
                            {raid.name}
                        </button>
                    ))}
                </>
            )}
        </div>
    );
}
