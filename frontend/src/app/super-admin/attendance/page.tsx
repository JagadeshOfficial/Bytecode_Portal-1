"use client";

import DashboardLayout from '@/components/DashboardLayout';
import PinpointDashboard from '@/components/Academic/PinpointDashboard';

export default function AttendancePage() {
    return (
        <DashboardLayout role="super_admin" noPadding>
            <PinpointDashboard />
        </DashboardLayout>
    );
}
