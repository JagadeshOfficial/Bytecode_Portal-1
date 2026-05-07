"use client";
import { API_URLS } from '@/lib/api-config';


import { useState, useEffect, useCallback, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import {
    Menu, X, LogOut, LayoutDashboard, Users, BookOpen, Layers, Calendar,
    Video, FileText, CheckCircle, Target, Search, Phone, DollarSign,
    BarChart3, UserCheck, TrendingUp, Settings, Shield, Globe, Zap,
    HeartPulse, Activity, MousePointer2, Briefcase, Smile, PenTool, Edit2, XCircle,
    MessageSquare, ClipboardCheck, Microscope, UserPlus, Fingerprint, Terminal, Code,
    ChevronRight, Bell, BellRing, Trash2, Check, Send
} from 'lucide-react';
import styles from './Dashboard.module.css';
import { fetchJsonSafe } from '@/lib/fetchJson';

type Role = 'super_admin' | 'admin' | 'counsellor' | 'tutor' | 'placement' | 'social_media' | 'student';

interface MenuItem {
    label: string;
    href: string;
    icon: React.ReactNode;
    section?: string;
    subItems?: { label: string; href: string; icon?: React.ReactNode; roles?: string[] }[];
}

interface DashboardLayoutProps {
    children: React.ReactNode;
    role: Role;
    noPadding?: boolean;
}

interface Notification {
    id: string;
    _id?: string;
    title: string;
    message: string;
    type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR';
    status: 'READ' | 'UNREAD';
    createdAt: string;
}

const MENUS: Record<string, MenuItem[]> = {
    super_admin: [
        { section: 'Overview', label: 'Dashboard Home', href: '/super-admin', icon: <LayoutDashboard size={18} /> },
        { section: 'User Management', label: 'Users List', href: '/super-admin/users', icon: <Users size={18} /> },
        { section: 'Academic Hub', label: 'Curriculum & Live Hub', href: '/super-admin/academic', icon: <BookOpen size={18} /> },
        { label: 'Mock Interview Index', href: '/super-admin/academic?tab=INTERVIEWS', icon: <Target size={18} /> },
        { section: 'Communication', label: 'ByteChat Section', href: '/super-admin/chat', icon: <MessageSquare size={18} /> },
        { section: 'Tracking', label: 'Tracking Center', href: '/super-admin/pinpoint-hub', icon: <Activity size={18} /> },
        { label: 'System Activity Log', href: '/super-admin/global-tracking', icon: <Terminal size={18} /> },
    ],
    admin: [
        { section: 'Main', label: 'Admin Home', href: '/admin', icon: <LayoutDashboard size={18} /> },
        { section: 'User Management', label: 'Users List', href: '/admin/users', icon: <Users size={18} /> },
        { section: 'Academic Hub', label: 'Curriculum & Live Hub', href: '/admin/academic', icon: <BookOpen size={18} /> },
        { section: 'Communication', label: 'ByteChat Section', href: '/admin/chat', icon: <MessageSquare size={18} /> },
        { section: 'Tracking', label: 'Tracking Center', href: '/admin/pinpoint-hub', icon: <Activity size={18} /> },
        { label: 'System Activity Log', href: '/admin/global-tracking', icon: <Terminal size={18} /> },
        { section: 'Reports', label: 'Reports', href: '/admin/reports', icon: <BarChart3 size={18} /> },
    ],
    counsellor: [
        { section: 'Performance', label: 'My Targets', href: '/counsellor', icon: <LayoutDashboard size={18} /> },
        { label: 'New Leads', href: '/counsellor/leads', icon: <Target size={18} /> },
        { section: 'Action', label: 'Follow-ups', href: '/counsellor/followup', icon: <Phone size={18} /> },
    ],
    tutor: [
        { section: 'Main', label: 'Tutor Dashboard', href: '/tutor', icon: <LayoutDashboard size={18} /> },
        { section: 'User Management', label: 'Users List', href: '/tutor/users', icon: <Users size={18} /> },
        { section: 'Academic Hub', label: 'Curriculum & Live Hub', href: '/tutor/academic', icon: <BookOpen size={18} /> },
        { section: 'Communication', label: 'ByteChat Section', href: '/tutor/chat', icon: <MessageSquare size={18} /> },
        { section: 'Finance', label: 'Attendance & Leaves', href: '/tutor/salary', icon: <Calendar size={18} /> },
    ],
    trainer: [
        { section: 'Main', label: 'Tutor Dashboard', href: '/tutor', icon: <LayoutDashboard size={18} /> },
        { section: 'User Management', label: 'Users List', href: '/tutor/users', icon: <Users size={18} /> },
        { section: 'Academic Hub', label: 'Curriculum & Live Hub', href: '/tutor/academic', icon: <BookOpen size={18} /> },
        { section: 'Communication', label: 'ByteChat Section', href: '/tutor/chat', icon: <MessageSquare size={18} /> },
        { section: 'Finance', label: 'Attendance & Leaves', href: '/tutor/salary', icon: <Calendar size={18} /> },
    ],
    placement: [
        { section: 'Career', label: 'Student Readiness', href: '/placement', icon: <UserCheck size={18} /> },
        { label: 'Interviews', href: '/placement/interviews', icon: <Calendar size={18} /> },
        { label: 'Jobs List', href: '/placement/jobs', icon: <Briefcase size={18} /> },
    ],
    social_media: [
        { section: 'Creator', label: 'Content Planner', href: '/social-media', icon: <PenTool size={18} /> },
        { label: 'Campaigns', href: '/social-media/campaigns', icon: <BarChart3 size={18} /> },
        { label: 'Leads Tracking', href: '/social-media/leads', icon: <Target size={18} /> },
    ],
    student: [
        { section: 'Overview', label: 'Student Dashboard', href: '/student', icon: <LayoutDashboard size={18} /> },
        { section: 'Academic', label: 'Curriculum Hub', href: '/student/academic', icon: <BookOpen size={18} /> },
        { section: 'Communication', label: 'ByteChat Connect', href: '/admin/chat', icon: <MessageSquare size={18} /> },
        { section: 'Reports', label: 'Analytics Reports', href: '/admin/reports', icon: <BarChart3 size={18} /> },
        { section: 'Utilities', label: 'Online Compiler', href: '/student/compiler', icon: <Code size={18} /> },
        { section: 'Learning', label: 'Exams & Tests', href: '/student/tests', icon: <CheckCircle size={18} /> },
        { section: 'Career', label: 'Placement Portal', href: '/student/placements', icon: <Briefcase size={18} /> },
        { label: 'Growth Progress', href: '/student/progress', icon: <TrendingUp size={18} /> },
    ]
};

function DashboardLayoutContent({ children, role, noPadding }: DashboardLayoutProps) {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const router = useRouter();

    const expectedRole = role === 'super_admin' ? 'SUPER_ADMIN' : role === 'admin' ? 'ADMIN' : role?.toUpperCase();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [openSubmenus, setOpenSubmenus] = useState<Record<string, boolean>>({});
    const [userName, setUserName] = useState('User');
    const [loggedUser, setLoggedUser] = useState<any>(null);
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
    const [profileForm, setProfileForm] = useState({
        fullName: '', email: '', password: '',
        phoneNumber: '', branch: '', department: '', userStatus: '', profileImage: ''
    });

    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [isNotifOpen, setIsNotifOpen] = useState(false);
    const [shouldShake, setShouldShake] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Sync form with loggedUser when modal opens
    useEffect(() => {
        if (isProfileModalOpen && loggedUser) {
            setProfileForm({
                fullName: loggedUser.fullName || loggedUser.name || '',
                email: loggedUser.email || '',
                password: '', // Keep blank for security
                phoneNumber: loggedUser.phoneNumber || '',
                branch: loggedUser.branch || '',
                department: loggedUser.department || '',
                userStatus: loggedUser.userStatus || '',
                profileImage: loggedUser.profileImage || ''
            });
        }
    }, [isProfileModalOpen, loggedUser]);

    // --- SIDEBAR SCROLL PERSISTENCE ---
    useEffect(() => {
        const sidebar = document.getElementById('sidebar-scroll-container');
        if (sidebar) {
            const savedScroll = sessionStorage.getItem('sidebar-scroll');
            if (savedScroll) {
                sidebar.scrollTop = parseInt(savedScroll, 10);
            }

            const handleScroll = () => {
                sessionStorage.setItem('sidebar-scroll', sidebar.scrollTop.toString());
            };
            sidebar.addEventListener('scroll', handleScroll);
            return () => sidebar.removeEventListener('scroll', handleScroll);
        }
    }, [pathname]);

    // Determine the menu items based on the LOGGED IN user's role, not the page's requested role
    const activeUserRole = (loggedUser?.role || role || 'student').toLowerCase().replace(/-/g, '_').replace(/\s+/g, '_');
    const menuItems = MENUS[activeUserRole] || MENUS.student || [];
    const roleDisplay = (loggedUser?.role || role || 'student').replace(/_/g, ' ').replace(/-/g, ' ').split(' ').map((s: string) => s.charAt(0).toUpperCase() + s.slice(1)).join(' ');

    const handleLogout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        window.location.href = '/login';
    };


    const toggleSubmenu = (label: string) => {
        setOpenSubmenus(prev => ({ ...prev, [label]: !prev[label] }));
    };

    const isLinkActive = (href: string) => {
        if (!href) return false;
        const currentFull = pathname + (searchParams.toString() ? `?${searchParams.toString()}` : '');
        return currentFull === href || pathname === href;
    };

    const fetchUserProfile = async () => {
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('token');
            if (!token || token === 'null' || token === 'undefined') {
                console.error("Session expired or invalid. Please login again.");
                handleLogout();
                return;
            }
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                const parsed = JSON.parse(storedUser);
                setLoggedUser(parsed);
                const userId = parsed.id || parsed._id;
                if (userId) {
                    try {
                        const result = await fetchJsonSafe<any>(`${API_URLS.LMS_BACKEND}/api/users/${userId}`);
                        if (result.ok && result.data) {
                            const data = result.data;
                            const apiRole = String(data.role || parsed.role || '').toUpperCase();
                            const actualName = data.fullName || data.name || parsed.name || data.email || 'User';

                            const currentRoleStr = (expectedRole || '').toUpperCase();
                            const actualRoleStr = (apiRole || '').toUpperCase();

                            if (currentRoleStr !== actualRoleStr) {
                                // Specific logic for Platform wide compatibility (Staff & Student)
                                const authorizedFamily = ['TUTOR', 'TRAINER', 'STAFF', 'HR', 'ADMIN', 'SUPER_ADMIN', 'STUDENT'];
                                const isFamilyCompat = authorizedFamily.includes(currentRoleStr) && authorizedFamily.includes(actualRoleStr);

                                // Also allow common dashboard access
                                const isCommonAuthorized = (actualRoleStr === 'TRAINER' || actualRoleStr === 'TUTOR' || actualRoleStr === 'ADMIN' || actualRoleStr === 'SUPER_ADMIN' || actualRoleStr === 'STUDENT');

                                if (!isFamilyCompat && !isCommonAuthorized) {
                                    if (expectedRole === 'SUPER_ADMIN') {
                                        router.push(apiRole === 'ADMIN' ? '/admin' : '/login');
                                    } else if (expectedRole === 'ADMIN') {
                                        router.push(apiRole === 'SUPER_ADMIN' ? '/super-admin' : '/login');
                                    } else {
                                        router.push('/login');
                                    }
                                    return;
                                }
                            }

                            setUserName(actualName);
                            // Update local storage so it stays fresh with FULL data
                            const updatedUser = {
                                ...parsed,
                                ...data,
                                id: userId,
                                _id: userId,
                                name: actualName,
                                fullName: actualName,
                                role: apiRole || parsed.role
                            };
                            localStorage.setItem('user', JSON.stringify(updatedUser));
                            setProfileForm({
                                fullName: actualName,
                                email: data.email || '',
                                password: data.password || '',
                                phoneNumber: data.phoneNumber || '',
                                branch: data.branch || '',
                                department: data.department || '',
                                userStatus: data.userStatus || '',
                                profileImage: data.profileImage || ''
                            });
                            setLoggedUser(updatedUser);
                        } else {
                            setUserName(parsed.name || parsed.fullName || parsed.email || 'User');
                        }
                    } catch (e) {
                        setUserName(parsed.name || parsed.fullName || parsed.email || 'User');
                    }
                } else {
                    setUserName(parsed.name || parsed.fullName || parsed.email || 'User');
                }
            }
        }
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfileForm({ ...profileForm, profileImage: reader.result as string });
            };
            reader.readAsDataURL(file);
        }
    };

    const fetchNotifications = useCallback(async () => {
        if (!loggedUser) return;
        const userId = loggedUser.id || loggedUser._id;
        try {
            const res = await fetch(`${API_URLS.LMS_BACKEND}/api/academic/notifications?userId=${userId}&role=${expectedRole}`);
            if (res.ok) {
                const data = await res.json();

                setNotifications(prev => {
                    const newUnreadCount = data.filter((n: any) => n.status === 'UNREAD').length;
                    const oldUnreadCount = prev.filter(n => n.status === 'UNREAD').length;

                    if (newUnreadCount > oldUnreadCount) {
                        setShouldShake(true);
                        setTimeout(() => setShouldShake(false), 2000);
                    }
                    return data;
                });
            }
        } catch (e) {
            console.error("Notif fetch error:", e);
        }
    }, [loggedUser, expectedRole]);

    const markNotifRead = async (id: string) => {
        try {
            await fetch(`${API_URLS.LMS_BACKEND}/api/academic/notifications/${id}/read`, { method: 'PATCH' });
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, status: 'READ' } : n));
        } catch (e) { console.error(e); }
    };

    const deleteNotif = async (id: string) => {
        try {
            await fetch(`${API_URLS.LMS_BACKEND}/api/academic/notifications/${id}`, { method: 'DELETE' });
            setNotifications(prev => prev.filter(n => n.id !== id));
        } catch (e) { console.error(e); }
    };

    useEffect(() => {
        fetchUserProfile();
    }, []);

    useEffect(() => {
        if (loggedUser) {
            fetchNotifications();
            const interval = setInterval(fetchNotifications, 10000); // Polling every 10s
            return () => clearInterval(interval);
        }
    }, [loggedUser, fetchNotifications]);

    const handleProfileSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const userId = loggedUser?.id || loggedUser?._id;
        if (!userId) return;

        const updateData: Record<string, any> = {
            fullName: profileForm.fullName,
            email: profileForm.email,
            phoneNumber: profileForm.phoneNumber,
            branch: profileForm.branch,
            department: profileForm.department,
            userStatus: profileForm.userStatus,
            profileImage: profileForm.profileImage
        };

        if (profileForm.password?.trim()) {
            updateData.password = profileForm.password;
        }

        try {
            const res = await fetch(`${API_URLS.LMS_BACKEND}/api/users/${userId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updateData)
            });

            if (res.ok) {
                setIsProfileModalOpen(false);
                fetchUserProfile(); // refresh the header immediately
                alert('Profile updated successfully!');
            } else {
                const errorData = await res.json().catch(() => null);
                alert(errorData?.error || 'Error updating profile');
            }
        } catch (e) {
            alert('Failed to connect to server');
        }
    };

    return (
        <div className={styles.container}>
            {isSidebarOpen && <div className={styles.overlay} onClick={() => setIsSidebarOpen(false)} />}

            <aside className={`${styles.sidebar} ${isSidebarOpen ? styles.sidebarOpen : ''}`}>
                <div className={styles.brand}>
                    <span>🔷</span>
                    <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.1 }}>
                        <span style={{ fontSize: '1rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '2px', color: 'var(--primary)' }}>Bytecode</span>
                        <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-dim)', textTransform: 'uppercase' }}>{roleDisplay}</span>
                    </div>
                    <button className={styles.closeBtn} onClick={() => setIsSidebarOpen(false)}>
                        <X size={20} />
                    </button>
                </div>

                <div id="sidebar-scroll-container" className={styles.sidebarContent}>
                    <ul className={styles.menu}>
                        {mounted && menuItems.map((item, index) => {
                            const hasSubItems = item.subItems && item.subItems.length > 0;
                            const isSubmenuOpen = openSubmenus[item.label] || (item.label === 'Games' && pathname === '/games');
                            const uniqueKey = `${item.label}-${index}`;

                            return (
                                <li key={uniqueKey} className={styles.menuItem}>
                                    {item.section && <div className={styles.menuSection}>{item.section}</div>}

                                    {hasSubItems ? (
                                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    toggleSubmenu(item.label);
                                                }}
                                                className={`${styles.menuLink} ${pathname.startsWith(item.href) ? styles.activeLink : ''}`}
                                                style={{ background: 'none', border: 'none', width: '100%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                                            >
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                    <span style={{ opacity: 0.8 }}>{item.icon}</span>
                                                    {item.label}
                                                </div>
                                                <ChevronRight
                                                    size={14}
                                                    style={{
                                                        transition: '0.3s',
                                                        transform: isSubmenuOpen ? 'rotate(90deg)' : 'rotate(0deg)'
                                                    }}
                                                />
                                            </button>

                                            <AnimatePresence>
                                                {isSubmenuOpen && (
                                                    <motion.ul
                                                        initial={{ height: 0, opacity: 0 }}
                                                        animate={{ height: 'auto', opacity: 1 }}
                                                        exit={{ height: 0, opacity: 0 }}
                                                        style={{ listStyle: 'none', paddingLeft: '45px', overflow: 'hidden' }}
                                                    >
                                                        {item.subItems?.filter(sub => {
                                                            if (!sub.roles) return true;
                                                            const roleToMatch = (role || 'student').toUpperCase().replace(/[-\s]/g, '_');
                                                            return sub.roles.includes(roleToMatch as any);
                                                        }).map((sub, i) => (
                                                            <li key={i} style={{ marginBottom: '5px' }}>
                                                                <Link
                                                                    href={sub.href}
                                                                    className={`${styles.menuLink} ${isLinkActive(sub.href) ? styles.activeLink : ''}`}
                                                                    style={{ fontSize: '0.8rem', opacity: isLinkActive(sub.href) ? 1 : 0.7, padding: '8px 0', color: isLinkActive(sub.href) ? 'var(--primary)' : 'inherit' }}
                                                                    onClick={() => setIsSidebarOpen(false)}
                                                                >
                                                                    {sub.label}
                                                                </Link>
                                                            </li>
                                                        ))}
                                                    </motion.ul>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    ) : (
                                        <Link
                                            href={item.href}
                                            scroll={false}
                                            className={`${styles.menuLink} ${pathname === item.href ? styles.activeLink : ''}`}
                                            onClick={() => setIsSidebarOpen(false)}
                                        >
                                            <span style={{ opacity: 0.8 }}>{item.icon}</span>
                                            {item.label}
                                        </Link>
                                    )}
                                </li>
                            );
                        })}

                        <li className={styles.menuItem} style={{ marginTop: '2rem' }}>
                            <div className={styles.menuSection}>Account</div>
                            <button onClick={() => setIsProfileModalOpen(true)} className={styles.menuLink} style={{ background: 'none', border: 'none', width: '100%', cursor: 'pointer' }}>
                                <Settings size={18} style={{ opacity: 0.8 }} />
                                My Profile Settings
                            </button>
                            <button onClick={handleLogout} className={styles.menuLink} style={{ background: 'none', border: 'none', width: '100%', cursor: 'pointer', marginTop: '5px' }}>
                                <LogOut size={18} style={{ opacity: 0.8 }} />
                                Logout
                            </button>
                        </li>
                    </ul>
                </div>
            </aside>

            <main className={styles.main}>
                <header className={styles.header}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                        <button className={styles.menuBtn} onClick={() => setIsSidebarOpen(true)}>
                            <Menu size={24} />
                        </button>
                        <h2 className={styles.headerTitle}>{roleDisplay} Panel</h2>
                    </div>


                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                        {/* Notification Bell */}
                        <div style={{ position: 'relative' }}>
                            <motion.button
                                animate={shouldShake ? { rotate: [0, -15, 15, -15, 15, 0], scale: [1, 1.1, 1.1, 1] } : {}}
                                transition={{ duration: 0.5, repeat: shouldShake ? 3 : 0 }}
                                onClick={() => setIsNotifOpen(!isNotifOpen)}
                                style={{ background: 'none', border: 'none', color: '#4a5568', cursor: 'pointer', position: 'relative', padding: '8px' }}
                            >
                                {notifications.some(n => n.status === 'UNREAD') ? <BellRing size={24} color="var(--primary)" /> : <Bell size={24} />}
                                {notifications.filter(n => n.status === 'UNREAD').length > 0 && (
                                    <span style={{ position: 'absolute', top: '5px', right: '5px', background: '#ef4444', color: '#fff', fontSize: '10px', fontWeight: 900, padding: '2px 6px', borderRadius: '50%', border: '2px solid #fff' }}>
                                        {notifications.filter(n => n.status === 'UNREAD').length}
                                    </span>
                                )}
                            </motion.button>

                            <AnimatePresence>
                                {isNotifOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 15, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 15, scale: 0.95 }}
                                        style={{ position: 'absolute', top: '100%', right: 0, width: '350px', background: '#fff', borderRadius: '24px', boxShadow: '0 20px 50px rgba(0,0,0,0.15)', zIndex: 11000, marginTop: '15px', border: '1px solid #e2e8f0', overflow: 'hidden' }}
                                    >
                                        <div style={{ padding: '20px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc' }}>
                                            <h3 style={{ fontSize: '1rem', fontWeight: 900, color: '#1a202c' }}>Notifications</h3>
                                            <button onClick={() => setIsNotifOpen(false)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}><X size={18} /></button>
                                        </div>
                                        <div style={{ maxHeight: '400px', overflowY: 'auto', padding: '10px' }}>
                                            {notifications.length === 0 ? (
                                                <div style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>
                                                    <Bell size={32} style={{ opacity: 0.2, marginBottom: '10px' }} />
                                                    <p style={{ fontSize: '0.85rem', fontWeight: 700 }}>All caught up!</p>
                                                </div>
                                            ) : (
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                                    {notifications.map((n) => (
                                                        <div key={n.id} style={{ padding: '15px', borderRadius: '16px', background: n.status === 'UNREAD' ? '#f0f9ff' : '#fff', border: '1px solid #f1f5f9', position: 'relative' }}>
                                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                                                                <span style={{ fontSize: '0.85rem', fontWeight: 800, color: n.status === 'UNREAD' ? 'var(--primary)' : '#4a5568' }}>{n.title}</span>
                                                                <div style={{ display: 'flex', gap: '8px' }}>
                                                                    {n.status === 'UNREAD' && (
                                                                        <button onClick={() => markNotifRead(n.id)} style={{ background: 'none', border: 'none', color: '#10b981', cursor: 'pointer' }} title="Mark as Read"><Check size={14} /></button>
                                                                    )}
                                                                    <button onClick={() => deleteNotif(n.id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }} title="Delete"><Trash2 size={14} /></button>
                                                                </div>
                                                            </div>
                                                            <p style={{ fontSize: '0.8rem', color: '#718096', lineHeight: 1.4 }}>{n.message}</p>
                                                            <span style={{ fontSize: '0.65rem', color: '#cbd5e1', fontWeight: 700, marginTop: '8px', display: 'block' }}>{mounted ? new Date(n.createdAt).toLocaleString() : ''}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                        {notifications.length > 0 && (
                                            <div style={{ padding: '15px', textAlign: 'center', borderTop: '1px solid #f1f5f9' }}>
                                                <button onClick={() => setNotifications([])} style={{ background: 'none', border: 'none', color: 'var(--primary)', fontSize: '0.8rem', fontWeight: 900, cursor: 'pointer' }}>CLEAR ALL HISTORY</button>
                                            </div>
                                        )}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        <div className={styles.userProfile} onClick={() => setIsProfileModalOpen(true)} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <span>{userName}</span>
                            <div className={styles.avatar}>
                                {loggedUser?.profileImage ? (
                                    <img src={loggedUser.profileImage} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
                                ) : (
                                    <span>{userName.charAt(0).toUpperCase()}</span>
                                )}
                            </div>
                        </div>
                    </div>
                </header>

                <div className={styles.content} style={noPadding ? { padding: 0, height: 'calc(100vh - 80px)', overflow: 'auto' } : {}}>
                    {children}
                </div>
            </main>

            {/* --- MY PROFILE MODAL (PREMIUM REDESIGN) --- */}
            {isProfileModalOpen && (
                <div style={{ position: 'fixed', inset: 0, zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(15px)' }}>
                    <div className="glass-panel" style={{ width: '95%', maxWidth: '850px', padding: 0, borderRadius: '40px', position: 'relative', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>

                        {/* Top Accent Bar */}
                        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '6px', background: 'linear-gradient(90deg, var(--primary), var(--secondary))' }} />

                        <button onClick={() => setIsProfileModalOpen(false)} style={{ position: 'absolute', top: '2rem', right: '2rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '10px', borderRadius: '50%', cursor: 'pointer', display: 'flex', zIndex: 10, transition: 'all 0.3s ease' }}>
                            <X size={20} />
                        </button>

                        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(250px, 30%) 1fr', minHeight: '500px' }}>
                            {/* Left Panel: Avatar & Brand Focus */}
                            <div style={{ background: 'rgba(0,0,0,0.4)', padding: '3rem 2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', borderRight: '1px solid rgba(255,255,255,0.05)' }}>
                                <div style={{
                                    width: '160px', height: '160px', borderRadius: '50%',
                                    border: '4px solid rgba(255,255,255,0.1)',
                                    boxShadow: '0 10px 30px rgba(0,0,0,0.5), inset 0 0 20px rgba(255,255,255,0.1)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    overflow: 'hidden',
                                    marginBottom: '2rem'
                                }}>
                                    {profileForm.profileImage ? (
                                        <img src={profileForm.profileImage} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    ) : (
                                        <span style={{ fontSize: '4rem', fontWeight: 900 }}>{userName.charAt(0).toUpperCase()}</span>
                                    )}
                                </div>

                                <h3 style={{ fontSize: '1.4rem', fontWeight: 900, textAlign: 'center', marginBottom: '0.5rem', background: 'linear-gradient(90deg, #fff, #aaa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{userName}</h3>
                                <p style={{ color: 'var(--primary)', fontSize: '0.9rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '2.5rem' }}>{roleDisplay}</p>

                                <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    <input
                                        type="file"
                                        id="profileImageInput"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        style={{ display: 'none' }}
                                    />
                                    <button
                                        onClick={() => document.getElementById('profileImageInput')?.click()}
                                        style={{ padding: '12px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px dashed rgba(255,255,255,0.2)', color: '#fff', fontSize: '0.85rem', cursor: 'pointer', transition: 'all 0.3s ease' }}
                                    >
                                        UPLOAD PROFILE IMAGE
                                    </button>
                                </div>
                            </div>

                            {/* Right Panel: Form Fields */}
                            <div style={{ padding: '3.5rem 3rem' }}>
                                <h2 style={{ fontSize: '1.8rem', fontWeight: 900, marginBottom: '2.5rem', display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <Shield color="var(--primary)" size={28} /> Account Settings
                                </h2>

                                <form onSubmit={handleProfileSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                            <label style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-dim)' }}>FULL NAME</label>
                                            <input
                                                value={profileForm.fullName}
                                                onChange={e => setProfileForm({ ...profileForm, fullName: e.target.value })}
                                                style={{ padding: '14px 18px', borderRadius: '14px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '1rem', outline: 'none', transition: 'all 0.3s ease' }}
                                                required
                                            />
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                            <label style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-dim)' }}>EMAIL ADDRESS</label>
                                            <input
                                                value={profileForm.email}
                                                onChange={e => setProfileForm({ ...profileForm, email: e.target.value })}
                                                style={{ padding: '14px 18px', borderRadius: '14px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '1rem', outline: 'none', transition: 'all 0.3s ease' }}
                                                required type="email"
                                            />
                                        </div>
                                    </div>

                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                            <label style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-dim)' }}>PHONE NUMBER</label>
                                            <input
                                                value={profileForm.phoneNumber}
                                                onChange={e => setProfileForm({ ...profileForm, phoneNumber: e.target.value })}
                                                style={{ padding: '14px 18px', borderRadius: '14px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '1rem', outline: 'none', transition: 'all 0.3s ease' }}
                                            />
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                            <label style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-dim)' }}>UPDATE PASSWORD</label>
                                            <input
                                                value={profileForm.password}
                                                onChange={e => setProfileForm({ ...profileForm, password: e.target.value })}
                                                style={{ padding: '14px 18px', borderRadius: '14px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '1rem', outline: 'none', transition: 'all 0.3s ease' }}
                                                type="password" placeholder="Leave blank to keep same"
                                            />
                                        </div>
                                    </div>

                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                            <label style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-dim)' }}>BRANCH</label>
                                            <input
                                                value={profileForm.branch}
                                                onChange={e => setProfileForm({ ...profileForm, branch: e.target.value })}
                                                style={{ padding: '14px 18px', borderRadius: '14px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '1rem', outline: 'none', transition: 'all 0.3s ease' }}
                                            />
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                            <label style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-dim)' }}>DEPARTMENT</label>
                                            <input
                                                value={profileForm.department}
                                                onChange={e => setProfileForm({ ...profileForm, department: e.target.value })}
                                                style={{ padding: '14px 18px', borderRadius: '14px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '1rem', outline: 'none', transition: 'all 0.3s ease' }}
                                            />
                                        </div>
                                    </div>

                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem', paddingTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: profileForm.userStatus === 'Inactive' ? '#ef4444' : '#10b981', boxShadow: profileForm.userStatus === 'Inactive' ? '0 0 10px rgba(239, 68, 68, 0.5)' : '0 0 10px rgba(16, 185, 129, 0.5)' }} />
                                            <input
                                                value={profileForm.userStatus}
                                                onChange={e => setProfileForm({ ...profileForm, userStatus: e.target.value })}
                                                style={{ background: 'transparent', border: 'none', color: 'var(--text-dim)', fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase', outline: 'none' }}
                                                placeholder="Status (e.g. Active)"
                                            />
                                        </div>
                                        <button type="submit" className="btn-quantum" style={{ padding: '14px 30px', borderRadius: '100px', fontWeight: 900, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '10px', boxShadow: '0 10px 25px rgba(139, 92, 246, 0.3)' }}>
                                            <CheckCircle size={18} /> SAVE CHANGES
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default function DashboardLayout(props: DashboardLayoutProps) {
    return (
        <Suspense fallback={null}>
            <DashboardLayoutContent {...props} />
        </Suspense>
    );
}
