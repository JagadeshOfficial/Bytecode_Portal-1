"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function StudentPage() {
    const router = useRouter();

    useEffect(() => {
        router.push('/student/dashboard');
    }, [router]);

    return (
        <div className="flex items-center justify-center min-h-screen bg-[#030014]">
            <div className="text-white font-display font-bold tracking-widest animate-pulse uppercase">
                Synchronizing Dashboard...
            </div>
        </div>
    );
}
