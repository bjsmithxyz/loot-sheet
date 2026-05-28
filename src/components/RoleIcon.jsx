import React from 'react';
import { Shield, Plus, Swords } from 'lucide-react';
import { normalizeRole } from '../utils/import-parser';

export default function RoleIcon({ role = 'dps' }) {
    const normalizedRole = normalizeRole(role);
    if (normalizedRole === 'tank') return <Shield size={12} className="role-icon tank" />;
    if (normalizedRole === 'healer') return <Plus size={12} className="role-icon healer" />;
    return <Swords size={12} className="role-icon dps" />;
}
