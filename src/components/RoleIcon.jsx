import React from 'react';
import { Shield, Plus, Swords } from 'lucide-react';
import { SPEC_TO_ROLE } from '../utils/wow-constants';

export default function RoleIcon({ spec }) {
    const role = SPEC_TO_ROLE[spec] || 'dps';
    if (role === 'tank') return <Shield size={12} className="role-icon tank" />;
    if (role === 'healer') return <Plus size={12} className="role-icon healer" />;
    return <Swords size={12} className="role-icon dps" />;
}
