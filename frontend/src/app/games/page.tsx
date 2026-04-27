"use client";

import DashboardLayout from '@/components/DashboardLayout';
import GamesDashboard from '@/components/Games/GamesDashboard';
import { useEffect, useState } from 'react';

export default function GamesPage() {
    const [role, setRole] = useState<any>(null);

    useEffect(() => {
        if (!role && typeof window !== 'undefined') {
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                const parsed = JSON.parse(storedUser);
                const rawRole = parsed.role || 'student';
                let cleanRole = rawRole.toLowerCase().replace(/-/g, '_');
                if (cleanRole === 'trainer' || cleanRole === 'tutor') {
                    cleanRole = 'tutor';
                }
                setRole(cleanRole);
            } else {
                setRole('student');
            }
        }
    }, [role]);

    if (!role) return null; // Don't render until role is known

    return (
        <DashboardLayout role={role} noPadding>
            <GamesDashboard />
        </DashboardLayout>
    );
}
