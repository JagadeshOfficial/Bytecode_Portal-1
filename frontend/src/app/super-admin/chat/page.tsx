"use client";

import DashboardLayout from '@/components/DashboardLayout';
import ByteChat from '@/components/Enterprise/ByteChat/ByteChat';

export default function ChatPage() {
    return (
        <DashboardLayout role="super_admin" noPadding={true}>
            <ByteChat />
        </DashboardLayout>
    );
}
