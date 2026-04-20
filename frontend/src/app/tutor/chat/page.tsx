"use client";

import DashboardLayout from '@/components/DashboardLayout';
import ByteChat from '@/components/Enterprise/ByteChat/ByteChat';

export default function TutorChatPage() {
    return (
        <DashboardLayout role="tutor" noPadding={true}>
            <ByteChat role="tutor" />
        </DashboardLayout>
    );
}