"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
    Menu, X, LogOut, LayoutDashboard, Users, BookOpen, Layers, Calendar, 
    Video, FileText, CheckCircle, Target, Search, Phone, DollarSign, 
    BarChart3, UserCheck, TrendingUp, Settings, Shield, Globe, Zap, 
    HeartPulse, Activity, MousePointer2, Briefcase, Smile, PenTool, Edit2, XCircle
} from 'lucide-react';
import styles from './Dashboard.module.css';

type Role = 'super_admin' | 'admin' | 'counsellor' | 'tutor' | 'placement' | 'social_media' | 'student';

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

const MENUS: Record<string, MenuItem[]> = {
    super_admin: [
        { section: 'Overview', label: 'Dashboard Home', href: '/super-admin', icon: <LayoutDashboard size={18} /> },
        { section: 'User Management', label: 'Users List', href: '/super-admin/users', icon: <Users size={18} /> },
        { section: 'Academic Hub', label: 'Curriculum & Batches', href: '/super-admin/academic', icon: <BookOpen size={18} /> },
        { section: 'Class Activities', label: 'Live Classes', href: '/super-admin/live', icon: <Video size={18} /> },
        { label: 'Recorded Classes', href: '/super-admin/recordings', icon: <Activity size={18} /> },
        { label: 'Assignments', href: '/super-admin/assignments', icon: <FileText size={18} /> },
        { section: 'Tests & Exams', label: 'Exam Management', href: '/super-admin/tests', icon: <CheckCircle size={18} /> },
        { label: 'Mock Interviews', href: '/super-admin/mocks', icon: <Target size={18} /> },
        { section: 'Sales & Finance', label: 'Leads Management', href: '/super-admin/crm', icon: <Search size={18} /> },
        { label: 'Follow-ups', href: '/super-admin/followup', icon: <Phone size={18} /> },
        { label: 'Payments & Accounts', href: '/super-admin/finance', icon: <DollarSign size={18} /> },
        { section: 'Staff & Team', label: 'Staff Tracking', href: '/super-admin/tracking', icon: <UserCheck size={18} /> },
        { label: 'Salary Management', href: '/super-admin/salary', icon: <DollarSign size={18} /> },
        { section: 'Reports & Settings', label: 'Marketing Planner', href: '/super-admin/marketing', icon: <TrendingUp size={18} /> },
        { label: 'System Reports', href: '/super-admin/reports', icon: <BarChart3 size={18} /> },
        { label: 'Settings', href: '/super-admin/settings', icon: <Settings size={18} /> },
    ],
    admin: [
        { section: 'Main', label: 'Admin Home', href: '/admin', icon: <LayoutDashboard size={18} /> },
        { label: 'Students List', href: '/admin/students', icon: <Users size={18} /> },
        { label: 'Batches', href: '/admin/batches', icon: <Layers size={18} /> },
        { section: 'CRM', label: 'Leads Desk', href: '/admin/leads', icon: <Target size={18} /> },
        { label: 'Reports', href: '/admin/reports', icon: <BarChart3 size={18} /> },
    ],
    counsellor: [
        { section: 'Performance', label: 'My Targets', href: '/counsellor', icon: <LayoutDashboard size={18} /> },
        { label: 'New Leads', href: '/counsellor/leads', icon: <Target size={18} /> },
        { section: 'Action', label: 'Follow-ups', href: '/counsellor/followup', icon: <Phone size={18} /> },
    ],
    tutor: [
        { section: 'Academy', label: 'Live Classes', href: '/tutor', icon: <Video size={18} /> },
        { label: 'Recorded Sessions', href: '/tutor/recordings', icon: <Activity size={18} /> },
        { section: 'Grading', label: 'Assignments', href: '/tutor/assignments', icon: <FileText size={18} /> },
        { label: 'Students', href: '/tutor/students', icon: <Users size={18} /> },
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
        { section: 'Learning', label: 'My Courses', href: '/student', icon: <BookOpen size={18} /> },
        { label: 'Assignments', href: '/student/assignments', icon: <FileText size={18} /> },
        { label: 'Exams', href: '/student/tests', icon: <CheckCircle size={18} /> },
        { section: 'Career', label: 'Placements', href: '/student/placements', icon: <Briefcase size={18} /> },
        { label: 'My Progress', href: '/student/progress', icon: <TrendingUp size={18} /> },
    ]
};

export default function DashboardLayout({ children, role }: DashboardLayoutProps) {
    const pathname = usePathname();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [userName, setUserName] = useState('User');
    const [loggedUser, setLoggedUser] = useState<any>(null);
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
    const [profileForm, setProfileForm] = useState({ fullName: '', email: '', password: '' });

    const menuItems = MENUS[role] || [];
    const roleDisplay = role.replace(/_/g, ' ').split(' ').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ');

    const handleLogout = () => {
        localStorage.removeItem('user');
        window.location.href = '/login';
    };

    const fetchUserProfile = async () => {
        if (typeof window !== 'undefined') {
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                const parsed = JSON.parse(storedUser);
                setLoggedUser(parsed);
                if (parsed.id) {
                    try {
                        const res = await fetch(`http://localhost:8080/api/users/${parsed.id}`);
                        if (res.ok) {
                            const data = await res.json();
                            const actualName = data.fullName || data.name || parsed.name || data.email || 'User';
                            setUserName(actualName);
                            // Update local storage so it stays fresh
                            localStorage.setItem('user', JSON.stringify({ ...parsed, name: actualName, email: data.email }));
                            setProfileForm({ fullName: actualName, email: data.email || '', password: data.password || '' });
                            setLoggedUser({ ...parsed, ...data });
                        } else {
                            setUserName(parsed.name || parsed.fullName || parsed.email || 'User');
                        }
                    } catch (e) {
                        setUserName(parsed.name || parsed.fullName || parsed.email || 'User');
                    }
                } else {
                    setUserName(parsed.name || 'User');
                }
            }
        }
    };

    useEffect(() => {
        fetchUserProfile();
    }, []);

    const handleProfileSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!loggedUser || !loggedUser.id) return;
        try {
            const res = await fetch(`http://localhost:8080/api/users/${loggedUser.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...loggedUser,
                    fullName: profileForm.fullName,
                    email: profileForm.email,
                    password: profileForm.password
                })
            });
            if (res.ok) {
                setIsProfileModalOpen(false);
                fetchUserProfile(); // refresh the header immediately
                alert('Profile updated successfully!');
            } else {
                alert('Error updating profile');
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
                
                <div className={styles.sidebarContent}>
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
                    
                    <div className={styles.userProfile} onClick={() => setIsProfileModalOpen(true)} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span>{userName}</span>
                        <div className={styles.avatar} style={{ background: 'linear-gradient(135deg, var(--primary), var(--secondary))', border: '2px solid rgba(255,255,255,0.2)' }}>
                            {userName.charAt(0).toUpperCase()}
                        </div>
                    </div>
                </header>
                
                <div className={styles.content}>
                    {children}
                </div>
            </main>

            {/* --- MY PROFILE MODAL --- */}
            {isProfileModalOpen && (
                <div style={{ position: 'fixed', inset: 0, zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)' }}>
                    <div className="glass-panel" style={{ width: '95%', maxWidth: '500px', padding: '2.5rem', borderRadius: '32px', position: 'relative' }}>
                        <button onClick={() => setIsProfileModalOpen(false)} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', padding: '8px', borderRadius: '50%', cursor: 'pointer', display: 'flex' }}>
                            <XCircle size={20} />
                        </button>
                        
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <Edit2 size={24} color="var(--primary)" /> Edit My Profile
                        </h2>

                        <form onSubmit={handleProfileSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <label style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-dim)' }}>FULL NAME</label>
                                <input 
                                    value={profileForm.fullName} 
                                    onChange={e => setProfileForm({...profileForm, fullName: e.target.value})} 
                                    style={{ padding: '12px 16px', borderRadius: '12px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '1rem', outline: 'none' }} 
                                    required 
                                />
                            </div>
                            
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <label style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-dim)' }}>EMAIL ADDRESS</label>
                                <input 
                                    value={profileForm.email} 
                                    onChange={e => setProfileForm({...profileForm, email: e.target.value})} 
                                    style={{ padding: '12px 16px', borderRadius: '12px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '1rem', outline: 'none' }} 
                                    required 
                                    type="email"
                                />
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <label style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-dim)' }}>UPDATE PASSWORD</label>
                                <input 
                                    value={profileForm.password} 
                                    onChange={e => setProfileForm({...profileForm, password: e.target.value})} 
                                    style={{ padding: '12px 16px', borderRadius: '12px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '1rem', outline: 'none' }} 
                                />
                            </div>

                            <div style={{ background: 'rgba(139, 92, 246, 0.1)', padding: '1rem', borderRadius: '12px', fontSize: '0.8rem', color: 'var(--text-dim)' }}>
                                <strong style={{ color: 'var(--primary)' }}>Note:</strong> Updates to your profile are reflected immediately in the system. Changing your role is prohibited from this self-service modal.
                            </div>

                            <button type="submit" className="btn-quantum" style={{ padding: '15px', borderRadius: '14px', fontWeight: 900, fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                                <CheckCircle size={18} /> SAVE CHANGES
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
