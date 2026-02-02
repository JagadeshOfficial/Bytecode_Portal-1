"use client";

import { useState } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Users, UserCheck, UserX, Clock,
    Search, Filter, Plus, MoreVertical,
    Briefcase, GraduationCap, Shield, Mail, Calendar,
    CheckCircle, XCircle, Trash2, Edit, Lock, FileText, ChevronRight
} from 'lucide-react';
import styles from '../SuperAdmin.module.css';

// -- Types --
type UserRole = 'student' | 'faculty' | 'staff';
type Status = 'Present' | 'Absent' | 'On Leave' | 'Remote';

interface User {
    id: string;
    name: string;
    role: UserRole;
    department: string;
    email: string;
    phone: string;
    status: Status;
    checkInTime?: string;
    avatarInitials: string;
    joinDate: string;
    attendanceRate: number;
}

interface LeaveRequest {
    id: number;
    userId: string;
    name: string;
    role: string;
    department: string;
    type: string;
    dates: string;
    duration: string;
    reason: string;
    description: string;
    status: 'Pending' | 'Approved' | 'Rejected';
    requestDate: string;
}

// -- Mock Data --
const INITIAL_USERS: User[] = [
    { id: 'ST-001', name: 'Arjun Reddy', role: 'student', department: 'Java Full Stack', email: 'arjun.r@std.com', phone: '9876543210', status: 'Present', checkInTime: '08:45 AM', avatarInitials: 'AR', joinDate: '2023-08-15', attendanceRate: 92 },
    { id: 'ST-002', name: 'Priya Sharma', role: 'student', department: 'Data Science', email: 'priya.s@std.com', phone: '9876543211', status: 'Present', checkInTime: '09:00 AM', avatarInitials: 'PS', joinDate: '2023-09-01', attendanceRate: 88 },
    { id: 'EMP-101', name: 'Dr. Rao', role: 'faculty', department: 'AI Research', email: 'rao@inst.com', phone: '9876543212', status: 'Present', checkInTime: '08:30 AM', avatarInitials: 'DR', joinDate: '2021-03-10', attendanceRate: 98 },
    { id: 'EMP-102', name: 'Sarah Jenkins', role: 'faculty', department: 'Web Dev', email: 'sarah.j@inst.com', phone: '9876543213', status: 'Remote', checkInTime: '09:15 AM', avatarInitials: 'SJ', joinDate: '2022-01-20', attendanceRate: 95 },
    { id: 'ST-003', name: 'Mike Chen', role: 'student', department: 'DevOps', email: 'mike.c@std.com', phone: '9876543214', status: 'Absent', avatarInitials: 'MC', joinDate: '2023-11-05', attendanceRate: 78 },
    { id: 'ADM-005', name: 'Karen Smith', role: 'staff', department: 'Admissions', email: 'karen@inst.com', phone: '9876543215', status: 'On Leave', avatarInitials: 'KS', joinDate: '2020-05-15', attendanceRate: 90 },
    { id: 'ST-004', name: 'Rahul V.', role: 'student', department: 'Java Full Stack', email: 'rahul@std.com', phone: '9876543216', status: 'Present', checkInTime: '08:50 AM', avatarInitials: 'RV', joinDate: '2024-01-10', attendanceRate: 85 },
    { id: 'EMP-103', name: 'Karthik M.', role: 'faculty', department: 'Cloud Computing', email: 'karthik@inst.com', phone: '9876543217', status: 'Present', checkInTime: '10:00 AM', avatarInitials: 'KM', joinDate: '2023-06-20', attendanceRate: 96 },
];

const INITIAL_LEAVE_REQUESTS: LeaveRequest[] = [
    {
        id: 1, userId: 'EMP-101', name: 'Dr. Rao', role: 'Faculty', department: 'AI Research',
        type: 'Sick Leave', dates: 'Feb 12 - Feb 14', duration: '3 Days',
        reason: 'Viral Fever', description: 'I have been diagnosed with high viral fever and advised complete rest by the doctor. I will ensure my classes are rescheduled.',
        status: 'Pending', requestDate: 'Feb 11, 2026'
    },
    {
        id: 2, userId: 'ADM-005', name: 'Karen Smith', role: 'Staff', department: 'Admissions',
        type: 'Casual Leave', dates: 'Feb 20', duration: '1 Day',
        reason: 'Personal work', description: 'Need to attend a family function out of town.',
        status: 'Pending', requestDate: 'Feb 15, 2026'
    },
    {
        id: 3, userId: 'ST-002', name: 'Priya Sharma', role: 'Student', department: 'Data Science',
        type: 'Medical Leave', dates: 'Feb 25 - Feb 28', duration: '4 Days',
        reason: 'Surgery', description: 'Scheduled for a minor dental surgery.',
        status: 'Pending', requestDate: 'Feb 18, 2026'
    },
];

export default function UsersPage() {
    const [users, setUsers] = useState<User[]>(INITIAL_USERS);
    const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>(INITIAL_LEAVE_REQUESTS);
    const [activeTab, setActiveTab] = useState<'all' | 'student' | 'faculty' | 'staff'>('all');
    const [searchQuery, setSearchQuery] = useState('');

    // Modal States
    const [isAddUserOpen, setIsAddUserOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [selectedLeave, setSelectedLeave] = useState<LeaveRequest | null>(null);

    // Filter Logic
    const filteredUsers = users.filter(user => {
        const matchesTab = activeTab === 'all' || user.role === activeTab;
        const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesTab && matchesSearch;
    });

    const stats = {
        total: users.length,
        present: users.filter(u => u.status === 'Present' || u.status === 'Remote').length,
        absent: users.filter(u => u.status === 'Absent').length,
        onLeave: users.filter(u => u.status === 'On Leave').length,
    };

    const handleAddUser = (e: React.FormEvent) => {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        const role = (form.elements.namedItem('role') as HTMLSelectElement).value as UserRole;

        const newUser: User = {
            id: `${role === 'student' ? 'ST' : 'EMP'}-${Math.floor(Math.random() * 1000)}`,
            name: (form.elements.namedItem('name') as HTMLInputElement).value,
            email: (form.elements.namedItem('email') as HTMLInputElement).value,
            phone: (form.elements.namedItem('phone') as HTMLInputElement).value,
            department: (form.elements.namedItem('department') as HTMLInputElement).value,
            role: role,
            status: 'Present',
            checkInTime: '09:00 AM',
            avatarInitials: (form.elements.namedItem('name') as HTMLInputElement).value.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase(),
            joinDate: new Date().toISOString().split('T')[0],
            attendanceRate: 100
        };

        setUsers([newUser, ...users]);
        setIsAddUserOpen(false);
    };

    const handleLeaveAction = (id: number, action: 'Approved' | 'Rejected') => {
        setLeaveRequests(prev => prev.map(req => req.id === id ? { ...req, status: action } : req));
        setSelectedLeave(null); // Close modal
    };

    return (
        <DashboardLayout role="super_admin">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={styles.container}
            >
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '1.5rem' }}>
                    <div>
                        <div className={styles.textLabel} style={{ marginBottom: '0.25rem' }}>HR & Administration</div>
                        <h1 className={styles.textH1}>User Governance Hub</h1>
                    </div>
                    <div className={styles.actionBtnRow}>
                        <div className={styles.searchBar}>
                            <Search size={16} style={{ color: '#94a3b8' }} />
                            <input
                                type="text"
                                className={styles.searchInput}
                                placeholder="Search by name, ID..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <button className={styles.btnPrimary} onClick={() => setIsAddUserOpen(true)}>
                            <Plus size={18} /> Add New User
                        </button>
                    </div>
                </div>

                {/* KPI Stats */}
                <div className={styles.advStatsGrid}>
                    <div className={styles.advCard}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                            <div className={styles.advCardIconBox} style={{ background: 'rgba(59, 130, 246, 0.15)', color: '#60a5fa' }}><Users size={24} /></div>
                            <span className={styles.statusBadge} style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#93c5fd' }}>Total Workforce</span>
                        </div>
                        <div style={{ fontSize: '2.2rem', fontWeight: 700, color: 'white', fontFamily: 'Rajdhani', lineHeight: 1 }}>{stats.total}</div>
                        <div className={styles.textSub} style={{ marginTop: '0.5rem' }}>Registered Profiles</div>
                    </div>
                    <div className={styles.advCard}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                            <div className={styles.advCardIconBox} style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#34d399' }}><UserCheck size={24} /></div>
                            <span className={styles.statusBadge} style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#6ee7b7' }}>{Math.round((stats.present / stats.total) * 100)}% Active</span>
                        </div>
                        <div style={{ fontSize: '2.2rem', fontWeight: 700, color: 'white', fontFamily: 'Rajdhani', lineHeight: 1 }}>{stats.present}</div>
                        <div className={styles.textSub} style={{ marginTop: '0.5rem' }}>Present Today</div>
                    </div>
                    <div className={styles.advCard}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                            <div className={styles.advCardIconBox} style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#f87171' }}><UserX size={24} /></div>
                            <span className={styles.statusBadge} style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#fca5a5' }}>Requires Action</span>
                        </div>
                        <div style={{ fontSize: '2.2rem', fontWeight: 700, color: 'white', fontFamily: 'Rajdhani', lineHeight: 1 }}>{stats.absent}</div>
                        <div className={styles.textSub} style={{ marginTop: '0.5rem' }}>Absent</div>
                    </div>
                    <div className={styles.advCard}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                            <div className={styles.advCardIconBox} style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24' }}><Clock size={24} /></div>
                            <span className={styles.statusBadge} style={{ background: 'rgba(245, 158, 11, 0.1)', color: '#fcd34d' }}>Pending</span>
                        </div>
                        <div style={{ fontSize: '2.2rem', fontWeight: 700, color: 'white', fontFamily: 'Rajdhani', lineHeight: 1 }}>{stats.onLeave}</div>
                        <div className={styles.textSub} style={{ marginTop: '0.5rem' }}>On Leave</div>
                    </div>
                </div>

                {/* Main Content Split Layout */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

                    {/* Main User Table - Full Width */}
                    <div className={styles.card}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid rgba(51, 65, 85, 0.3)' }}>
                            <div className={styles.tabContainer} style={{ marginBottom: 0, borderBottom: 'none' }}>
                                {(['all', 'student', 'faculty', 'staff'] as const).map(tab => (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab)}
                                        className={`${styles.tabBtn} ${activeTab === tab ? styles.tabBtnActive : ''}`}
                                        style={{ textTransform: 'capitalize', fontSize: '0.9rem', padding: '0.5rem 1rem', borderRadius: '6px', marginRight: '0.5rem', background: activeTab === tab ? 'rgba(124, 58, 237, 0.1)' : 'transparent', border: activeTab === tab ? '1px solid rgba(124, 58, 237, 0.3)' : 'none' }}
                                    >
                                        {tab}s
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className={styles.tableContainer}>
                            <table className={styles.table}>
                                <thead>
                                    <tr>
                                        <th style={{ paddingLeft: '1.5rem' }}>User Profile</th>
                                        <th>Role / ID</th>
                                        <th>Department</th>
                                        <th>Status</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredUsers.map(user => (
                                        <tr key={user.id} onClick={() => setSelectedUser(user)} style={{ cursor: 'pointer' }}>
                                            <td style={{ paddingLeft: '1.5rem' }}>
                                                <div className={styles.userTableProfile}>
                                                    <div className={styles.userAvatar} style={{
                                                        background: user.role === 'student' ? 'rgba(59,130,246,0.15)' : user.role === 'faculty' ? 'rgba(139,92,246,0.15)' : 'rgba(16,185,129,0.15)',
                                                        color: user.role === 'student' ? '#60a5fa' : user.role === 'faculty' ? '#a78bfa' : '#34d399',
                                                        border: `1px solid ${user.role === 'student' ? 'rgba(59,130,246,0.3)' : user.role === 'faculty' ? 'rgba(139,92,246,0.3)' : 'rgba(16,185,129,0.3)'}`
                                                    }}>
                                                        {user.avatarInitials}
                                                    </div>
                                                    <div>
                                                        <div style={{ fontWeight: 600, color: 'white', fontSize: '0.95rem' }}>{user.name}</div>
                                                        <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{user.email}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                    <span style={{ textTransform: 'capitalize', color: '#e2e8f0', fontWeight: 500 }}>{user.role}</span>
                                                    <span style={{ fontSize: '0.75rem', color: '#64748b', fontFamily: 'monospace' }}>{user.id}</span>
                                                </div>
                                            </td>
                                            <td>
                                                <span style={{
                                                    padding: '4px 10px', borderRadius: '4px', background: 'rgba(15, 23, 42, 0.4)',
                                                    color: '#cbd5e1', fontSize: '0.8rem', border: '1px solid rgba(51, 65, 85, 0.5)'
                                                }}>
                                                    {user.department}
                                                </span>
                                            </td>
                                            <td>
                                                <span className={`${styles.statusBadge} ${user.status === 'Present' ? styles.statusSuccess :
                                                    user.status === 'Absent' ? styles.statusFailed :
                                                        styles.statusWarning
                                                    }`}>
                                                    {user.status === 'Present' && <span className="w-2 h-2 rounded-full bg-emerald-400 mr-2 animate-pulse"></span>}
                                                    {user.status}
                                                    {user.checkInTime && <span style={{ marginLeft: '4px', fontWeight: 400, opacity: 0.7 }}>({user.checkInTime})</span>}
                                                </span>
                                            </td>
                                            <td>
                                                <button className={styles.btnSecondary} style={{ padding: '6px 12px', height: 'auto', fontSize: '0.75rem' }}>
                                                    View Profile
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Bottom Split Section: Leave & Stats */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                        {/* Leave Requests Widget */}
                        <div className={styles.card} style={{ height: '100%' }}>
                            <div className={styles.cardHeader} style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span>Leave Center</span>
                                <span className={styles.statusBadge} style={{ background: 'rgba(245, 158, 11, 0.1)', color: '#fbbf24', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
                                    {leaveRequests.filter(r => r.status === 'Pending').length} Pending
                                </span>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '350px', overflowY: 'auto', paddingRight: '0.5rem' }}>
                                {leaveRequests.map(req => (
                                    <div
                                        key={req.id}
                                        onClick={() => setSelectedLeave(req)}
                                        style={{
                                            padding: '1rem', background: 'rgba(30, 41, 59, 0.3)',
                                            borderRadius: '0.75rem', border: '1px solid rgba(51, 65, 85, 0.4)',
                                            opacity: req.status !== 'Pending' ? 0.6 : 1,
                                            cursor: 'pointer',
                                            transition: 'all 0.2s'
                                        }}
                                        className="hover:border-violet-500/50 hover:bg-slate-800/60"
                                    >
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                            <span style={{ fontWeight: 600, color: 'white', fontSize: '0.9rem' }}>{req.name}</span>
                                            <span style={{ fontSize: '0.75rem', color: '#94a3b8', background: 'rgba(15, 23, 42, 0.4)', padding: '2px 6px', borderRadius: '4px' }}>{req.role}</span>
                                        </div>
                                        <div style={{ fontSize: '0.85rem', color: '#cbd5e1', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            <span className="w-1.5 h-1.5 rounded-full bg-violet-500"></span> {req.type}
                                        </div>
                                        <div style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
                                            <Calendar size={12} /> {req.dates} <span style={{ opacity: 0.5 }}>•</span> {req.duration}
                                        </div>
                                        {req.status !== 'Pending' && (
                                            <div style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: req.status === 'Approved' ? '#10b981' : '#ef4444', fontStyle: 'italic', fontWeight: 500 }}>
                                                ● {req.status}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Organizational Distribution Widget */}
                        <div className={styles.card} style={{ height: '100%' }}>
                            <div className={styles.cardHeader}>Organization Stats</div>
                            <div style={{ padding: '0.5rem', display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'center' }}>
                                <div style={{ display: 'flex', gap: '1rem', height: '200px', alignItems: 'flex-end', justifyContent: 'space-around', marginBottom: '1.5rem', background: 'rgba(15, 23, 42, 0.3)', borderRadius: '0.75rem', padding: '1rem' }}>
                                    {[
                                        { label: 'Java', val: 120, col: '#3b82f6' },
                                        { label: 'Data', val: 80, col: '#8b5cf6' },
                                        { label: 'AI', val: 45, col: '#10b981' },
                                        { label: 'Admin', val: 15, col: '#f59e0b' }
                                    ].map((item, i) => (
                                        <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', height: '100%', justifyContent: 'flex-end' }}>
                                            <div style={{ width: '32px', height: `${(item.val / 150) * 100}%`, background: item.col, borderRadius: '4px 4px 0 0', opacity: 0.8, position: 'relative', transition: 'height 0.5s ease' }}>
                                                <div style={{ position: 'absolute', top: '-24px', left: '50%', transform: 'translateX(-50%)', fontSize: '0.85rem', fontWeight: 700, color: 'white' }}>{item.val}</div>
                                            </div>
                                            <div style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: 600 }}>{item.label}</div>
                                        </div>
                                    ))}
                                </div>
                                <div style={{ fontSize: '0.9rem', color: '#cbd5e1', textAlign: 'center', fontStyle: 'italic', opacity: 0.7 }}>
                                    {/* Footer stats if needed */}
                                    View Detailed Roster
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* -- Add User Modal -- */}
                <AnimatePresence>
                    {isAddUserOpen && (
                        <div className={styles.modalOverlay}>
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className={`${styles.modalContent} ${styles.modalContentMedium}`}
                            >
                                <div className={styles.modalHeader}>
                                    <h2 className={styles.modalTitle}>Onboard New User</h2>
                                    <button onClick={() => setIsAddUserOpen(false)} className={styles.closeBtn}>✕</button>
                                </div>
                                <form onSubmit={handleAddUser} className={styles.modalBody}>
                                    <div className={styles.formGroup}>
                                        <label className={styles.formLabel}>Select Role</label>
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem' }}>
                                            {['student', 'faculty', 'staff'].map((r) => (
                                                <label key={r} style={{
                                                    cursor: 'pointer',
                                                    padding: '0.75rem',
                                                    background: 'rgba(15, 23, 42, 0.6)',
                                                    border: '1px solid rgba(51, 65, 85, 0.6)',
                                                    borderRadius: '0.5rem',
                                                    textAlign: 'center',
                                                    textTransform: 'capitalize',
                                                    fontSize: '0.9rem',
                                                    color: 'white',
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                                                }}>
                                                    <input type="radio" name="role" value={r} defaultChecked={r === 'student'} style={{ marginRight: '0.5rem' }} />
                                                    {r}
                                                </label>
                                            ))}
                                        </div>
                                    </div>

                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                        <div className={styles.formGroup}>
                                            <label className={styles.formLabel}>Full Name</label>
                                            <input name="name" type="text" className={styles.formInput} required placeholder="John Doe" />
                                        </div>
                                        <div className={styles.formGroup}>
                                            <label className={styles.formLabel}>Department</label>
                                            <input name="department" type="text" className={styles.formInput} placeholder="e.g. CS" />
                                        </div>
                                    </div>

                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                        <div className={styles.formGroup}>
                                            <label className={styles.formLabel}>Email Address</label>
                                            <input name="email" type="email" className={styles.formInput} required placeholder="john@example.com" />
                                        </div>
                                        <div className={styles.formGroup}>
                                            <label className={styles.formLabel}>Phone Number</label>
                                            <input name="phone" type="tel" className={styles.formInput} required placeholder="+91..." />
                                        </div>
                                    </div>

                                    <hr style={{ borderColor: 'rgba(51, 65, 85, 0.5)', margin: '1rem 0' }} />

                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                        <div className={styles.formGroup}>
                                            <label className={styles.formLabel}>Password</label>
                                            <div style={{ position: 'relative' }}>
                                                <input name="password" type="password" className={styles.formInput} required placeholder="••••••••" style={{ paddingLeft: '2.5rem' }} />
                                                <Lock size={14} style={{ position: 'absolute', left: '12px', top: '14px', color: '#94a3b8' }} />
                                            </div>
                                        </div>
                                        <div className={styles.formGroup}>
                                            <label className={styles.formLabel}>Confirm Password</label>
                                            <div style={{ position: 'relative' }}>
                                                <input name="confirm_password" type="password" className={styles.formInput} required placeholder="••••••••" style={{ paddingLeft: '2.5rem' }} />
                                                <Lock size={14} style={{ position: 'absolute', left: '12px', top: '14px', color: '#94a3b8' }} />
                                            </div>
                                        </div>
                                    </div>

                                    <div className={styles.formActions}>
                                        <button type="button" onClick={() => setIsAddUserOpen(false)} className={styles.btnSecondary} style={{ justifyContent: 'center', flex: 1 }}>Cancel</button>
                                        <button type="submit" className={styles.btnPrimary} style={{ justifyContent: 'center', flex: 1 }}>Create Account</button>
                                    </div>
                                </form>
                            </motion.div>
                        </div>
                    )}

                    {/* -- Leave Details Modal -- */}
                    {selectedLeave && (
                        <div className={styles.modalOverlay}>
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className={`${styles.modalContent} ${styles.modalContentMedium}`}
                            >
                                <div className={styles.modalHeader}>
                                    <h2 className={styles.modalTitle}>Leave Request Details</h2>
                                    <button onClick={() => setSelectedLeave(null)} className={styles.closeBtn}>✕</button>
                                </div>
                                <div className={styles.modalBody}>
                                    <div style={{ padding: '1rem', background: 'rgba(30, 41, 59, 0.4)', borderRadius: '0.5rem', marginBottom: '1.5rem', border: '1px solid rgba(51, 65, 85, 0.4)' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                                            <div>
                                                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'white' }}>{selectedLeave.name}</h3>
                                                <div style={{ color: '#94a3b8', fontSize: '0.9rem' }}>{selectedLeave.role} • {selectedLeave.department}</div>
                                            </div>
                                            <span style={{
                                                padding: '4px 10px', borderRadius: '20px',
                                                background: selectedLeave.status === 'Pending' ? 'rgba(245, 158, 11, 0.15)' : selectedLeave.status === 'Approved' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                                                color: selectedLeave.status === 'Pending' ? '#fbbf24' : selectedLeave.status === 'Approved' ? '#34d399' : '#f87171',
                                                border: `1px solid ${selectedLeave.status === 'Pending' ? 'rgba(245, 158, 11, 0.3)' : selectedLeave.status === 'Approved' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
                                                fontSize: '0.8rem', fontWeight: 600
                                            }}>
                                                {selectedLeave.status}
                                            </span>
                                        </div>
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                            <div>
                                                <div style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>Leave Type</div>
                                                <div style={{ color: '#e2e8f0', fontSize: '0.9rem' }}>{selectedLeave.type}</div>
                                            </div>
                                            <div>
                                                <div style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>Duration</div>
                                                <div style={{ color: '#e2e8f0', fontSize: '0.9rem' }}>{selectedLeave.dates} ({selectedLeave.duration})</div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className={styles.formGroup}>
                                        <label className={styles.formLabel}>Reason / Description</label>
                                        <div style={{ padding: '1rem', background: 'rgba(15, 23, 42, 0.6)', borderRadius: '0.5rem', border: '1px solid rgba(51, 65, 85, 0.6)', color: '#cbd5e1', fontSize: '0.9rem', lineHeight: 1.5 }}>
                                            {selectedLeave.description}
                                        </div>
                                    </div>

                                    {selectedLeave.status === 'Pending' && (
                                        <div className={styles.formActions} style={{ marginTop: '2rem' }}>
                                            <button
                                                onClick={() => handleLeaveAction(selectedLeave.id, 'Approved')}
                                                className={styles.btnPrimary}
                                                style={{ flex: 1, justifyContent: 'center', background: '#059669', borderColor: '#059669' }} // Custom green for approve
                                            >
                                                <CheckCircle size={18} /> Approve
                                            </button>
                                            <button
                                                onClick={() => handleLeaveAction(selectedLeave.id, 'Rejected')}
                                                className={styles.btnSecondary}
                                                style={{ flex: 1, justifyContent: 'center', color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.5)' }}
                                            >
                                                <XCircle size={18} /> Reject
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        </div>
                    )}

                    {/* -- User Profile Modal -- */}
                    {selectedUser && (
                        <div className={styles.modalOverlay}>
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className={`${styles.modalContent} ${styles.modalContentMedium}`}
                            >
                                <div className={styles.modalHeader}>
                                    <div>
                                        <h2 className={styles.modalTitle}>User Profile</h2>
                                        <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>ID: {selectedUser.id}</span>
                                    </div>
                                    <button onClick={() => setSelectedUser(null)} className={styles.closeBtn}>✕</button>
                                </div>
                                <div className={styles.modalBody}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '2rem' }}>
                                        <div style={{
                                            width: '80px', height: '80px', borderRadius: '50%',
                                            background: '#334155', color: 'white', display: 'flex',
                                            alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: 700
                                        }}>
                                            {selectedUser.avatarInitials}
                                        </div>
                                        <div>
                                            <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'white', marginBottom: '0.25rem' }}>{selectedUser.name}</h3>
                                            <div style={{ color: '#94a3b8', display: 'flex', gap: '1rem', fontSize: '0.9rem' }}>
                                                <span style={{ textTransform: 'capitalize' }}>{selectedUser.role}</span>
                                                <span>•</span>
                                                <span>{selectedUser.department}</span>
                                            </div>
                                            <div style={{ marginTop: '0.5rem', display: 'flex', gap: '0.5rem' }}>
                                                <span className={`${styles.statusBadge} ${selectedUser.status === 'Present' ? styles.statusSuccess : styles.statusFailed}`}>
                                                    {selectedUser.status}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                                        <div style={{ padding: '1rem', background: 'rgba(30,41,59,0.5)', borderRadius: '8px' }}>
                                            <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Check-In Time</div>
                                            <div style={{ fontSize: '1.1rem', fontWeight: 600, color: 'white' }}>{selectedUser.checkInTime || '--:--'}</div>
                                        </div>
                                        <div style={{ padding: '1rem', background: 'rgba(30,41,59,0.5)', borderRadius: '8px' }}>
                                            <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Attendance Rate</div>
                                            <div style={{ fontSize: '1.1rem', fontWeight: 600, color: '#10b981' }}>{selectedUser.attendanceRate}%</div>
                                        </div>
                                    </div>

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                        <button className={styles.btnSecondary} style={{ justifyContent: 'center' }}>
                                            <Edit size={16} /> Edit Profile
                                        </button>
                                        <button className={styles.btnSecondary} style={{ justifyContent: 'center', borderColor: 'rgba(239, 68, 68, 0.3)', color: '#ef4444' }}>
                                            <Trash2 size={16} /> Remove User
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>
            </motion.div>
        </DashboardLayout>
    );
}
