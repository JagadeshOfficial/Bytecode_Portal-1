import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Role } from '@/lib/dashboard-config';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

interface DashboardLayoutProps {
    children: React.ReactNode;
    role: Role;
}

export default function DashboardLayout({ children, role }: DashboardLayoutProps) {
    const { token, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && !token) {
            router.push('/login');
        }
    }, [token, isLoading, router]);

    if (isLoading || !token) {
        return <div className="h-screen w-screen bg-[#030014] flex items-center justify-center text-white">Loading...</div>;
    }

    return (
        <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#030014', color: 'white' }}>
            <Sidebar role={role} />
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', marginLeft: '260px', width: 'calc(100% - 260px)' }}>
                <Topbar />
                <main style={{ padding: '2rem', flex: 1, overflowY: 'auto' }}>
                    <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
