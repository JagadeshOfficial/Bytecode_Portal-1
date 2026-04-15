"use client";

import DashboardLayout from '@/components/DashboardLayout';
import ByteChat from '@/components/Enterprise/ByteChat/ByteChat';

type DashboardRole = 'super_admin' | 'admin';

export function ChatPageContent({ role = 'super_admin' }: { role?: DashboardRole } = {}) {
    return (
        <DashboardLayout role={role} noPadding={true}>
            <ByteChat role={role} />
        </DashboardLayout>
    );
}

export default function ChatPage() {
    return <ChatPageContent />;
}
