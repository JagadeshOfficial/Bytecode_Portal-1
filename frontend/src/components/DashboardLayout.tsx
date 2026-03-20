"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, LogOut, LayoutDashboard, Database, Shield, Activity, Globe, Zap, Users, BookOpen, GraduationCap, Briefcase, FileText, Settings, HeartPulse } from 'lucide-react';
import styles from './Dashboard.module.css';

type Role = 'super_admin' | 'admin' | 'employee' | 'student';

interface MenuItem {
    label: string;
    href: string;
    icon: React.ReactNode;
    section?: string;
}

interface DashboardLayoutProps {
    children: React.ReactNode;
    role: Role;
}

const MENUS: Record<Role, MenuItem[]> = {
    super_admin: [
        { section: 'Intelligence', label: 'Platform Hub', href: '/super-admin', icon: <LayoutDashboard size={20} /> },
        { section: 'Master Management', label: 'User & Role Control', href: '/super-admin/users', icon: <Users size={20} /> },
        { label: 'Platform Modules', href: '/super-admin/modules', icon: <BookOpen size={20} /> },
        { section: 'Operations', label: 'Center Admins', href: '/admin', icon: <Globe size={20} /> },
        { section: 'Health & Science', label: 'Platform Pulse', href: '/super-admin/pulse', icon: <HeartPulse size={20} /> },
        { section: 'Security Lab', label: 'Shield Protocol', href: '/super-admin/security', icon: <Shield size={20} /> },
        { label: 'System Settings', href: '/super-admin/settings', icon: <Settings size={20} /> },
    ],
    admin: [
        { section: 'Operations', label: 'Overview', href: '/admin', icon: <LayoutDashboard size={20} /> },
        { label: 'Talent Pool', href: '/admin/students', icon: <GraduationCap size={20} /> },
        { label: 'Faculty Roster', href: '/admin/employees', icon: <Users size={20} /> },
        { section: 'Academic', label: 'All Courses', href: '/admin/courses', icon: <BookOpen size={20} /> },
        { section: 'Finance', label: 'Revenue Flow', href: '/admin/finance', icon: <Zap size={20} /> },
        { label: 'Strategic Reports', href: '/admin/reports', icon: <FileText size={20} /> },
    ],
    employee: [
        { section: 'Teaching', label: 'My Console', href: '/employee', icon: <LayoutDashboard size={20} /> },
        { label: 'Active Batches', href: '/employee/classes', icon: <Users size={20} /> },
        { label: 'Evaluations', href: '/employee/assignments', icon: <FileText size={20} /> },
        { section: 'Records', label: 'My Students', href: '/employee/students', icon: <GraduationCap size={20} /> },
    ],
    student: [
        { section: 'Academy', label: 'My Learning', href: '/student', icon: <LayoutDashboard size={20} /> },
        { label: 'Catalog', href: '/student/courses', icon: <BookOpen size={20} /> },
        { label: 'Daily Planner', href: '/student/schedule', icon: <Zap size={20} /> },
        { section: 'Career', label: 'Career Hub', href: '/student/placements', icon: <Briefcase size={20} /> },
    ]
};

export default function DashboardLayout({ children, role }: DashboardLayoutProps) {
    const pathname = usePathname();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [userName, setUserName] = useState('User');
    const menuItems = MENUS[role] || [];

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

    useEffect(() => {
        setUserName(getUserName());
    }, []);

    return (
        <div className={styles.container}>
            {isSidebarOpen && <div className={styles.overlay} onClick={() => setIsSidebarOpen(false)} />}

            <aside className={`${styles.sidebar} ${isSidebarOpen ? styles.sidebarOpen : ''}`}>
                <div className={styles.brand}>
                    <span>🔷</span> 
                    <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.1 }}>
                        <span style={{ fontSize: '1rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '2px', color: 'var(--primary)' }}>Bytecode</span>
                        <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-dim)' }}>{roleDisplay}</span>
                    </div>
                    <button className={styles.closeBtn} onClick={() => setIsSidebarOpen(false)}>
                        <X size={20} />
                    </button>
                </div>
                
                <ul className={styles.menu}>
                    {menuItems.map((item, index) => (
                        <li key={item.href} className={styles.menuItem}>
                            {item.section && <div className={styles.menuSection}>{item.section}</div>}
                            <Link
                                href={item.href}
                                className={`${styles.menuLink} ${pathname === item.href ? styles.activeLink : ''}`}
                                onClick={() => setIsSidebarOpen(false)}
                            >
                                <span style={{ opacity: 0.8 }}>{item.icon}</span>
                                {item.label}
                            </Link>
                        </li>
                    ))}
                    
                    <li className={styles.menuItem} style={{ marginTop: 'auto' }}>
                        <div className={styles.menuSection}>System</div>
                        <button onClick={handleLogout} className={styles.menuLink} style={{ background: 'none', border: 'none', width: '100%', cursor: 'pointer' }}>
                            <LogOut size={20} style={{ opacity: 0.8 }} />
                            Terminate Session
                        </button>
                    </li>
                </ul>
            </aside>

            <main className={styles.main}>
                <header className={styles.header}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                        <button className={styles.menuBtn} onClick={() => setIsSidebarOpen(true)}>
                            <Menu size={24} />
                        </button>
                        <h2 className={styles.headerTitle}>{roleDisplay} Hub</h2>
                    </div>
                    
                    <div className={styles.userProfile}>
                        <span>{userName}</span>
                        <div className={styles.avatar}>{userName.charAt(0)}</div>
                    </div>
                </header>
                
                <div className={styles.content}>
                    {children}
                </div>
            </main>
        </div>
    );
}
