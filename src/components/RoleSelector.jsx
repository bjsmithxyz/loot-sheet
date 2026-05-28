import React from 'react';
import { Shield, Plus, Swords } from 'lucide-react';

const ROLE_OPTIONS = [
    { id: 'tank', icon: Shield, label: 'Tank' },
    { id: 'healer', icon: Plus, label: 'Heal' },
    { id: 'dps', icon: Swords, label: 'DPS' },
];

export default function RoleSelector({ role = 'dps', onChange, size = 'normal' }) {
    return (
        <div className={`role-selector ${size === 'small' ? 'small' : ''}`}>
            {ROLE_OPTIONS.map(({ id, icon: Icon, label }) => (
                <button
                    key={id}
                    type="button"
                    className={`role-btn ${size === 'small' ? 'small' : ''} ${role === id ? 'active' : ''}`}
                    onClick={() => onChange(id)}
                    title={label}
                    aria-label={label}
                    aria-pressed={role === id}
                >
                    <Icon size={size === 'small' ? 12 : 14} className={`role-icon ${id}`} />
                </button>
            ))}
        </div>
    );
}

export { ROLE_OPTIONS };
