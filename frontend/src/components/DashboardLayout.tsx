"use client";

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import styles from './Dashboard.module.css';

type Role = 'super_admin' | 'admin' | 'employee' | 'student';

interface DashboardLayoutProps {
    children: React.ReactNode;
    role: Role;
}

const MENUS = {
    super_admin: [
        { label: 'Platform Overview', href: '/super-admin', icon: '🌐' },
        { label: 'Institute Admin', href: '/admin', icon: '🏛️' },
        { label: 'System Logs', href: '/super-admin/logs', icon: '📋' },
        { label: 'Database Control', href: '/super-admin/database', icon: '💾' },
        { label: 'Security Center', href: '/super-admin/security', icon: '🛡️' },
        { label: 'Global Reports', href: '/super-admin/reports', icon: '📊' },
    ],
    admin: [
        { label: 'Dashboard', href: '/admin', icon: '📊' },
        { label: 'Students', href: '/admin/students', icon: '👨‍🎓' },
        { label: 'Employees', href: '/admin/employees', icon: '👔' },
        { label: 'Courses', href: '/admin/courses', icon: '📚' },
        { label: 'Finance', href: '/admin/finance', icon: '💰' },
        { label: 'Reports', href: '/admin/reports', icon: '📈' },
    ],
    employee: [
        { label: 'Dashboard', href: '/employee', icon: '📊' },
        { label: 'My Classes', href: '/employee/classes', icon: '🏫' },
        { label: 'Assignments', href: '/employee/assignments', icon: '📝' },
        { label: 'Students', href: '/employee/students', icon: '👥' },
    ],
    student: [
        { label: 'Dashboard', href: '/student', icon: '🏠' },
        { label: 'My Courses', href: '/student/courses', icon: '📚' },
        { label: 'Schedule', href: '/student/schedule', icon: '📅' },
        { label: 'Placements', href: '/student/placements', icon: '💼' },
    ]
};

export default function DashboardLayout({ children, role }: DashboardLayoutProps) {
    const pathname = usePathname();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [userName, setUserName] = useState('User');
    const menuItems = MENUS[role] || [];

    // Format role for display Title Case
    const roleDisplay = role.split('_').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ');

    const handleLogout = () => {
        localStorage.removeItem('user');
        window.location.href = '/login';
    };

    const getUserName = () => {
        if (typeof window !== 'undefined') {
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                const parsed = JSON.parse(storedUser);
                return parsed.name || parsed.email || 'User';
            }
        }
        return 'User';
    };

    // Client-side effect to safely set user name
    useState(() => {
        if (typeof window !== 'undefined') {
            setUserName(getUserName());
        }
    });

    return (
        <div className={styles.container}>
            {/* Mobile Overlay */}
            {isSidebarOpen && <div className={styles.overlay} onClick={() => setIsSidebarOpen(false)} />}

            <aside className={`${styles.sidebar} ${isSidebarOpen ? styles.sidebarOpen : ''}`}>
                <div className={styles.brand}>
                    <span>🔷</span> Bytecode {roleDisplay}
                    <button className={styles.closeBtn} onClick={() => setIsSidebarOpen(false)}>
                        <X size={20} />
                    </button>
                </div>
                <ul className={styles.menu}>
                    {menuItems.map((item) => (
                        <li key={item.href} className={styles.menuItem}>
                            <Link
                                href={item.href}
                                className={`${styles.menuLink} ${pathname === item.href ? styles.activeLink : ''}`}
                                onClick={() => setIsSidebarOpen(false)}
                            >
                                <span>{item.icon}</span>
                                {item.label}
                            </Link>
                        </li>
                    ))}
                    <li className={styles.menuItem} style={{ marginTop: 'auto' }}>
                        <button onClick={handleLogout} className={styles.menuLink} style={{ background: 'none', border: 'none', width: '100%', cursor: 'pointer' }}>
                            <span>🚪</span> Logout
                        </button>
                    </li>
                </ul>
            </aside>

            <main className={styles.main}>
                <header className={styles.header}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <button className={styles.menuBtn} onClick={() => setIsSidebarOpen(true)}>
                            <Menu size={24} />
                        </button>
                        <h2 className={styles.headerTitle}>{roleDisplay} Portal</h2>
                    </div>
                    <div className={styles.userProfile}>
                        <span>Welcome, {userName}</span>
                        <div className={styles.avatar}>{userName.charAt(0)}</div>
                    </div>
                </header>
                <div className={styles.content}>
                    {children}
                </div>
            </main>
        </div >
    );
}
