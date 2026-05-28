import React, { useEffect, useMemo } from 'react';

const CONFETTI_COLORS = ['#ff8000', '#ffd100', '#a335ee', '#d4af37', '#ff4d4d', '#69ccf0'];

export default function Confetti({ active, onComplete }) {
    const pieces = useMemo(
        () => Array.from({ length: 48 }, (_, index) => ({
            id: index,
            left: Math.random() * 100,
            delay: Math.random() * 0.25,
            duration: 0.9 + Math.random() * 0.9,
            drift: -40 + Math.random() * 80,
            color: CONFETTI_COLORS[index % CONFETTI_COLORS.length],
            size: 4 + Math.random() * 5,
            rotation: Math.random() * 360,
        })),
        [active]
    );

    useEffect(() => {
        if (!active) return undefined;
        const timer = window.setTimeout(onComplete, 1600);
        return () => window.clearTimeout(timer);
    }, [active, onComplete]);

    if (!active) return null;

    return (
        <div className="confetti-layer" aria-hidden="true">
            {pieces.map((piece) => (
                <span
                    key={piece.id}
                    className="confetti-piece"
                    style={{
                        left: `${piece.left}%`,
                        animationDelay: `${piece.delay}s`,
                        animationDuration: `${piece.duration}s`,
                        backgroundColor: piece.color,
                        width: `${piece.size}px`,
                        height: `${piece.size * 0.6}px`,
                        transform: `rotate(${piece.rotation}deg)`,
                        '--confetti-drift': `${piece.drift}px`,
                    }}
                />
            ))}
        </div>
    );
}
