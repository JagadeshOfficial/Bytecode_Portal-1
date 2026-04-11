"use client";

import DashboardLayout from '@/components/DashboardLayout';
import AttendanceTracker from '@/components/Enterprise/Tracking/AttendanceTracker';

export default function AttendancePage() {
    return (
        <DashboardLayout role="super_admin">
            <AttendanceTracker />
        </DashboardLayout>
    );
}
