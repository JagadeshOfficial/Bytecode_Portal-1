"use client";

import DashboardLayout from '@/components/DashboardLayout';
import GlobalLogCenter from '@/components/Enterprise/Tracking/GlobalLogCenter';

export default function GlobalTrackingPage() {
    return (
        <DashboardLayout role="super_admin">
            <GlobalLogCenter />
        </DashboardLayout>
    );
}
