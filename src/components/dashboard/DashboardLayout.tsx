
"use client";

import { Role } from '@/lib/dashboard-config';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

interface DashboardLayoutProps {
    children: React.ReactNode;
    role: Role;
}

export default function DashboardLayout({ children, role }: DashboardLayoutProps) {
    return (
        <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#030014', color: 'white' }}>
            <Sidebar role={role} />
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', marginLeft: '260px', width: 'calc(100% - 260px)' }}>
                <Topbar />
                <main style={{ padding: '2rem', flex: 1, overflowY: 'auto' }}>
                    <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
