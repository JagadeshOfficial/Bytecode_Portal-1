"use client";

import DashboardLayout from '@/components/DashboardLayout';
import GlobalLogCenter from '@/components/Enterprise/Tracking/GlobalLogCenter';

type DashboardRole = 'super_admin' | 'admin' | 'tutor';

export function GlobalTrackingPageContent({ role = 'super_admin' }: { role?: DashboardRole } = {}) {
    return (
        <DashboardLayout role={role}>
            <GlobalLogCenter />
        </DashboardLayout>
    );
}

export default function GlobalTrackingPage() {
    return <GlobalTrackingPageContent />;
}
