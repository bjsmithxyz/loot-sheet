import React from 'react';

export default function BossSlider({ raid, activeBoss, setActiveBoss }) {
    if (!raid || !raid.bosses) return null;

    return (
        <div className="boss-slider">
            {raid.bosses.map(boss => (
                <button
                    key={boss.id}
                    className={`boss-btn ${activeBoss === boss.id ? 'active' : 'faded'}`}
                    onClick={() => setActiveBoss(boss.id)}
                >
                    {boss.name}
                </button>
            ))}
        </div>
    );
}
