"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Dashboard.module.css';

type Role = 'admin' | 'employee' | 'student';

interface DashboardLayoutProps {
    children: React.ReactNode;
    role: Role;
}

const MENUS = {
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
    const menuItems = MENUS[role] || [];

    // Format role for display Title Case
    const roleDisplay = role.charAt(0).toUpperCase() + role.slice(1);

    return (
        <div className={styles.container}>
            <aside className={styles.sidebar}>
                <div className={styles.brand}>
                    <span>🔷</span> ByteCode {roleDisplay}
                </div>
                <ul className={styles.menu}>
                    {menuItems.map((item) => (
                        <li key={item.href} className={styles.menuItem}>
                            <Link
                                href={item.href}
                                className={`${styles.menuLink} ${pathname === item.href ? styles.activeLink : ''}`}
                            >
                                <span>{item.icon}</span>
                                {item.label}
                            </Link>
                        </li>
                    ))}
                    <li className={styles.menuItem} style={{ marginTop: 'auto' }}>
                        <Link href="/" className={styles.menuLink}>
                            <span>🚪</span> Logout
                        </Link>
                    </li>
                </ul>
            </aside>

            <main className={styles.main}>
                <header className={styles.header}>
                    <h2 className={styles.headerTitle}>{roleDisplay} Portal</h2>
                    <div className={styles.userProfile}>
                        <span>Welcome, User</span>
                        <div className={styles.avatar}>U</div>
                    </div>
                </header>
                <div className={styles.content}>
                    {children}
                </div>
            </main>
        </div>
    );
}
