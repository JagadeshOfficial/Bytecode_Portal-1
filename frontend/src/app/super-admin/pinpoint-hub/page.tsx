"use client";

import DashboardLayout from '@/components/DashboardLayout';
import PinpointDashboard from '@/components/Academic/PinpointDashboard';

export default function PinpointHubPage() {
    return (
        <DashboardLayout role="super_admin" noPadding>
            <PinpointDashboard />
        </DashboardLayout>
    );
}
