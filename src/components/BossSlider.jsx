import React from 'react';
import { Skull } from 'lucide-react';

export default function BossSlider({ raid, activeBoss, setActiveBoss }) {
    if (!raid || !raid.bosses) return null;

    const trash = raid.trash;

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
            {trash && (
                <>
                    <span className="boss-slider-gap" aria-hidden="true">—</span>
                    <button
                        className={`boss-btn boss-btn-trash ${activeBoss === trash.id ? 'active' : 'faded'}`}
                        onClick={() => setActiveBoss(trash.id)}
                        title="Trash loot"
                    >
                        <Skull size={14} />
                        <span>{trash.name}</span>
                    </button>
                </>
            )}
        </div>
    );
}
