"use client";

import DashboardLayout from '@/components/DashboardLayout';
import PinpointDashboard from '@/components/Academic/PinpointDashboard';

type DashboardRole = 'super_admin' | 'admin';

export function PinpointHubPageContent({ role = 'super_admin' }: { role?: DashboardRole } = {}) {
    return (
        <DashboardLayout role={role} noPadding>
            <PinpointDashboard />
        </DashboardLayout>
    );
}

export default function PinpointHubPage() {
    return <PinpointHubPageContent />;
}
