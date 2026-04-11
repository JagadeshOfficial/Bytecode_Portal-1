"use client";

import DashboardLayout from '@/components/DashboardLayout';
import ActivityLogger from '@/components/Enterprise/Tracking/ActivityLogger';

export default function AdminTrackingPage() {
    return (
        <DashboardLayout role="super_admin">
            <ActivityLogger type="ADMIN" />
        </DashboardLayout>
    );
}
