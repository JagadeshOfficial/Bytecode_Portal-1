"use client";

import DashboardLayout from '@/components/DashboardLayout';
import GamesDashboard from '@/components/Games/GamesDashboard';
import { useEffect, useState } from 'react';

export default function GamesPage() {
    const [role, setRole] = useState<any>('student');

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const parsed = JSON.parse(storedUser);
            // Sanitize role to match MENUS keys (lowercase, underscore)
            const rawRole = parsed.role || 'student';
            const cleanRole = rawRole.toLowerCase().replace(/-/g, '_');
            setRole(cleanRole);
        }
    }, []);

    return (
        <DashboardLayout role={role} noPadding>
            <GamesDashboard />
        </DashboardLayout>
    );
}
