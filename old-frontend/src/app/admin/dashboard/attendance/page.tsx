"use client";

import { useState, useMemo } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Calendar as CalendarIcon, Clock, UserCheck, XCircle, AlertCircle,
    ChevronLeft, ChevronRight, Filter, Download, Search, MoreHorizontal,
    CheckCircle, Users, BarChart2, PieChart as PieChartIcon, FileText
} from 'lucide-react';
import styles from '../Admin.module.css';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

// -- Mock Data & Types --
interface AttendanceLog {
    id: string;
    publicId: string;
    name: string;
    role: 'Student' | 'Employee' | 'Tutor';
    course: string;
    batch: string;
    time: string;
    status: 'Present' | 'Absent' | 'Late' | 'Excused';
    mode: 'In-Class' | 'Online' | 'Remote' | '-';
    duration: string;
}

const COURSES = ['Full Stack Java', 'Data Science', 'DevOps Cloud', 'UI/UX Design'];
const BATCHES = ['Batch A (Morning)', 'Batch B (Afternoon)', 'Batch C (Weekend)'];
const DEPARTMENTS = ['HR', 'Marketing', 'Development', 'Sales'];

// Generate mixed data: Students and Employees
const INITIAL_LOGS: AttendanceLog[] = Array.from({ length: 30 }).map((_, i) => {
    const isStudent = Math.random() > 0.3; // 70% Students
    const role = isStudent ? 'Student' : (Math.random() > 0.5 ? 'Employee' : 'Tutor');

    const statusProb = Math.random();
    const status = statusProb > 0.85 ? 'Absent' : statusProb > 0.75 ? 'Late' : 'Present';

    return {
        id: `LOG-${1000 + i}`,
        publicId: isStudent ? `STU-${202400 + i}` : `EMP-${500 + i}`,
        name: isStudent ? `Student Name ${i + 1}` : `Employee Name ${i + 1}`,
        role: role as any,
        course: isStudent ? COURSES[i % COURSES.length] : (role === 'Tutor' ? COURSES[i % COURSES.length] : DEPARTMENTS[i % DEPARTMENTS.length]),
        batch: isStudent ? BATCHES[i % BATCHES.length] : (role === 'Tutor' ? BATCHES[i % BATCHES.length] : 'General Shift'),
        time: status === 'Absent' ? '-' : `09:${Math.floor(Math.random() * 59).toString().padStart(2, '0')} AM`,
        status: status as any,
        mode: status === 'Absent' ? '-' : (isStudent ? (Math.random() > 0.4 ? 'In-Class' : 'Online') : 'In-Class'),
        duration: status === 'Absent' ? '-' : `${Math.floor(Math.random() * 2 + 6)}h ${Math.floor(Math.random() * 59)}m`
    };
});

const CHART_DATA = [
    { name: 'Mon', present: 85, absent: 15 },
    { name: 'Tue', present: 88, absent: 12 },
    { name: 'Wed', present: 92, absent: 8 },
    { name: 'Thu', present: 80, absent: 20 },
    { name: 'Fri', present: 85, absent: 15 },
    { name: 'Sat', present: 75, absent: 25 },
];

const COLORS = ['#10b981', '#ef4444', '#f59e0b', '#6366f1'];

export default function AttendancePage() {
    const [logs, setLogs] = useState<AttendanceLog[]>(INITIAL_LOGS);
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [filterCourse, setFilterCourse] = useState('All');
    const [filterStatus, setFilterStatus] = useState('All');
    const [filterRole, setFilterRole] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [viewMode, setViewMode] = useState<'list' | 'analytics'>('list');

    // Filter Logic
    const filteredLogs = useMemo(() => {
        return logs.filter(log => {
            const matchSearch = log.name.toLowerCase().includes(searchQuery.toLowerCase()) || log.publicId.toLowerCase().includes(searchQuery.toLowerCase());
            const matchCourse = filterCourse === 'All' || log.course === filterCourse;
            const matchStatus = filterStatus === 'All' || log.status === filterStatus;
            const matchRole = filterRole === 'All' || log.role === filterRole;
            return matchSearch && matchCourse && matchStatus && matchRole;
        });
    }, [logs, searchQuery, filterCourse, filterStatus, filterRole]);

    // Stats Logic
    const stats = useMemo(() => {
        const total = filteredLogs.length;
        const present = filteredLogs.filter(l => l.status === 'Present').length;
        const absent = filteredLogs.filter(l => l.status === 'Absent').length;
        const late = filteredLogs.filter(l => l.status === 'Late').length;
        return { total, present, absent, late, rate: total ? Math.round((present / total) * 100) : 0 };
    }, [filteredLogs]);

    const pieData = [
        { name: 'Present', value: stats.present },
        { name: 'Absent', value: stats.absent },
        { name: 'Late', value: stats.late },
    ];

    // Handlers
    const toggleSelect = (id: string) => {
        setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
    };

    const toggleSelectAll = () => {
        if (selectedIds.length === filteredLogs.length) setSelectedIds([]);
        else setSelectedIds(filteredLogs.map(l => l.id));
    };

    const handleBulkAction = (action: 'Present' | 'Absent') => {
        if (!selectedIds.length) return;
        setLogs(logs.map(log => selectedIds.includes(log.id) ? { ...log, status: action, time: action === 'Absent' ? '-' : '09:00 AM' } : log));
        setSelectedIds([]);
        alert(`Marked ${selectedIds.length} students as ${action}`);
    };

    return (
        <DashboardLayout role="admin">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={styles.container}>

                {/* Header */}
                <div className={styles.glassHeader} style={{ marginBottom: '1.5rem' }}>
                    <div>
                        <div className={styles.titleGroup}>
                            <h3 style={{ fontSize: '1.8rem' }}>ATTENDANCE HUB</h3>
                        </div>
                        <p className={styles.subTitle}>Monitor realtime attendance for Students, Tutors and Employees.</p>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <button onClick={() => setViewMode('list')} className={styles.tabBtn} style={{ color: viewMode === 'list' ? '#a78bfa' : '#94a3b8', borderBottom: viewMode === 'list' ? '2px solid #a78bfa' : 'none' }}>
                            Daily View
                        </button>
                        <button onClick={() => setViewMode('analytics')} className={styles.tabBtn} style={{ color: viewMode === 'analytics' ? '#a78bfa' : '#94a3b8', borderBottom: viewMode === 'analytics' ? '2px solid #a78bfa' : 'none' }}>
                            Analytics
                        </button>
                    </div>
                </div>

                {/* Date Navigation Bar */}
                <div className={styles.glassPanel} style={{ padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <button className={styles.iconBtn}><ChevronLeft size={20} /></button>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', background: 'rgba(0,0,0,0.2)', padding: '0.5rem 1rem', borderRadius: '0.5rem', border: '1px solid rgba(255,255,255,0.1)' }}>
                            <CalendarIcon size={18} color="#a78bfa" />
                            <input
                                type="date"
                                value={selectedDate}
                                onChange={(e) => setSelectedDate(e.target.value)}
                                style={{ background: 'transparent', border: 'none', color: 'white', fontSize: '1rem', fontFamily: 'inherit', outline: 'none' }}
                            />
                        </div>
                        <button className={styles.iconBtn}><ChevronRight size={20} /></button>
                        <span style={{ color: '#94a3b8', fontSize: '0.9rem', marginLeft: '0.5rem' }}>Today's Session</span>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <button className={styles.btnSecondary} style={{ padding: '0.6rem 1rem' }}>
                            <Download size={16} /> Export CSV
                        </button>
                        <button className={styles.btnPrimary} style={{ padding: '0.6rem 1rem' }}>
                            <CheckCircle size={16} /> Mark All Present
                        </button>
                    </div>
                </div>

                {/* KPI Stats Row */}
                <div className={styles.statsGrid} style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '2rem' }}>
                    {[
                        { label: 'Present', value: stats.present, icon: UserCheck, color: '#34d399', bg: 'rgba(16, 185, 129, 0.1)' },
                        { label: 'Absent', value: stats.absent, icon: XCircle, color: '#f87171', bg: 'rgba(239, 68, 68, 0.1)' },
                        { label: 'Late Arrivals', value: stats.late, icon: AlertCircle, color: '#facc15', bg: 'rgba(234, 179, 8, 0.1)' },
                        { label: 'Attendance Rate', value: `${stats.rate}%`, icon: BarChart2, color: '#818cf8', bg: 'rgba(99, 102, 241, 0.1)' },
                    ].map((stat, i) => (
                        <motion.div key={i} whileHover={{ y: -5 }} className={styles.glassPanel} style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div style={{ padding: '1rem', borderRadius: '1rem', background: stat.bg, color: stat.color }}>
                                <stat.icon size={28} />
                            </div>
                            <div>
                                <div style={{ fontSize: '2rem', fontWeight: 700, fontFamily: 'Rajdhani', color: 'white', lineHeight: 1 }}>{stat.value}</div>
                                <div style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: '0.25rem' }}>{stat.label}</div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {viewMode === 'analytics' ? (
                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
                        <div className={styles.glassPanel}>
                            <h3 style={{ color: 'white', fontSize: '1.1rem', marginBottom: '1.5rem' }}>Attendance Trends (Weekly)</h3>
                            <div style={{ width: '100%', height: '300px' }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={CHART_DATA}>
                                        <defs>
                                            <linearGradient id="colorPresent" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <XAxis dataKey="name" stroke="#64748b" />
                                        <YAxis stroke="#64748b" />
                                        <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #1e293b' }} />
                                        <Area type="monotone" dataKey="present" stroke="#10b981" fillOpacity={1} fill="url(#colorPresent)" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                        <div className={styles.glassPanel} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                            <h3 style={{ color: 'white', fontSize: '1.1rem', marginBottom: '1rem', alignSelf: 'flex-start' }}>Daily Distribution</h3>
                            <div style={{ width: '100%', height: '250px' }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                                            {pieData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #1e293b' }} />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                            <div style={{ display: 'flex', gap: '1.5rem', marginTop: '1rem' }}>
                                {pieData.map((entry, index) => (
                                    <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: '#cbd5e1' }}>
                                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: COLORS[index] }}></div>
                                        {entry.name}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className={styles.glassPanel} style={{ padding: '0', overflow: 'hidden' }}>
                        {/* Toolbar */}
                        <div style={{ padding: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                            <div className={styles.searchGroup} style={{ width: 'auto', minWidth: '300px' }}>
                                <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
                                <input
                                    type="text"
                                    placeholder="Search by student ID or name..."
                                    className={styles.searchInput}
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <div style={{ display: 'flex', gap: '0.75rem' }}>
                                <select className={styles.formSelect} style={{ width: 'auto', minWidth: '120px' }} value={filterRole} onChange={(e) => setFilterRole(e.target.value)}>
                                    <option value="All">All Roles</option>
                                    <option value="Student">Student</option>
                                    <option value="Employee">Employee</option>
                                    <option value="Tutor">Tutor</option>
                                </select>
                                <select className={styles.formSelect} style={{ width: 'auto', minWidth: '150px' }} value={filterCourse} onChange={(e) => setFilterCourse(e.target.value)}>
                                    <option value="All">All Contexts</option>
                                    {COURSES.map(c => <option key={c} value={c}>{c}</option>)}
                                    {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                                </select>
                                <select className={styles.formSelect} style={{ width: 'auto', minWidth: '120px' }} value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                                    <option value="All">All Status</option>
                                    <option value="Present">Present</option>
                                    <option value="Absent">Absent</option>
                                    <option value="Late">Late</option>
                                </select>
                                {selectedIds.length > 0 && (
                                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} style={{ display: 'flex', gap: '0.5rem' }}>
                                        <button onClick={() => handleBulkAction('Present')} className={styles.btnPrimary} style={{ background: '#10b981' }}>Mark Present</button>
                                        <button onClick={() => handleBulkAction('Absent')} className={styles.btnPrimary} style={{ background: '#ef4444' }}>Mark Absent</button>
                                    </motion.div>
                                )}
                            </div>
                        </div>

                        {/* Table */}
                        <div className={styles.tableWrapper}>
                            <table className={styles.table}>
                                <thead>
                                    <tr>
                                        <th style={{ width: '50px', textAlign: 'center' }}>
                                            <input type="checkbox" checked={selectedIds.length === filteredLogs.length && filteredLogs.length > 0} onChange={toggleSelectAll} style={{ cursor: 'pointer' }} />
                                        </th>
                                        <th>Role</th>
                                        <th>Name / ID</th>
                                        <th>Context (Course/Dept & Batch)</th>
                                        <th>Check-In</th>
                                        <th>Mode</th>
                                        <th>Duration</th>
                                        <th>Status</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredLogs.map((log) => (
                                        <tr key={log.id} className={styles.tableRow} style={{ background: selectedIds.includes(log.id) ? 'rgba(124, 58, 237, 0.1)' : undefined }}>
                                            <td style={{ textAlign: 'center' }}>
                                                <input type="checkbox" checked={selectedIds.includes(log.id)} onChange={() => toggleSelect(log.id)} style={{ cursor: 'pointer' }} />
                                            </td>
                                            <td>
                                                <span style={{
                                                    fontSize: '0.7rem', fontWeight: 600, padding: '0.2rem 0.6rem', borderRadius: '4px',
                                                    background: log.role === 'Student' ? 'rgba(59, 130, 246, 0.1)' : log.role === 'Tutor' ? 'rgba(139, 92, 246, 0.1)' : 'rgba(236, 72, 153, 0.1)',
                                                    color: log.role === 'Student' ? '#60a5fa' : log.role === 'Tutor' ? '#a78bfa' : '#f472b6',
                                                    border: `1px solid ${log.role === 'Student' ? 'rgba(59, 130, 246, 0.2)' : log.role === 'Tutor' ? 'rgba(139, 92, 246, 0.2)' : 'rgba(236, 72, 153, 0.2)'}`
                                                }}>
                                                    {log.role.toUpperCase()}
                                                </span>
                                            </td>
                                            <td>
                                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                    <span style={{ color: 'white', fontWeight: 600 }}>{log.name}</span>
                                                    <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{log.publicId}</span>
                                                </div>
                                            </td>
                                            <td>
                                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                    <span style={{ fontSize: '0.85rem', color: '#cbd5e1', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                                        {log.role === 'Student' ? <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#38bdf8' }}></div> : null}
                                                        {log.course}
                                                    </span>
                                                    <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{log.batch}</span>
                                                </div>
                                            </td>
                                            <td style={{ fontFamily: 'monospace', color: '#cbd5e1' }}>{log.time}</td>
                                            <td>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                    {log.mode !== '-' && <div style={{ width: 6, height: 6, borderRadius: '50%', background: log.mode === 'In-Class' ? '#f59e0b' : '#38bdf8' }} />}
                                                    <span style={{ fontSize: '0.85rem' }}>{log.mode}</span>
                                                </div>
                                            </td>
                                            <td style={{ fontSize: '0.85rem', color: '#94a3b8' }}>{log.duration}</td>
                                            <td>
                                                <span className={`${styles.statusBadge}`} style={{
                                                    background: log.status === 'Present' ? 'rgba(16, 185, 129, 0.1)' : log.status === 'Late' ? 'rgba(234, 179, 8, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                                                    color: log.status === 'Present' ? '#34d399' : log.status === 'Late' ? '#facc15' : '#f87171',
                                                    border: `1px solid ${log.status === 'Present' ? 'rgba(16, 185, 129, 0.2)' : log.status === 'Late' ? 'rgba(234, 179, 8, 0.2)' : 'rgba(239, 68, 68, 0.2)'}`
                                                }}>
                                                    {log.status.toUpperCase()}
                                                </span>
                                            </td>
                                            <td>
                                                <button className={styles.iconBtn} style={{ padding: '0.4rem' }}>
                                                    <MoreHorizontal size={16} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {filteredLogs.length === 0 && (
                                <div style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>
                                    No attendance logs found matching your filters.
                                </div>
                            )}
                        </div>
                    </div>
                )}

            </motion.div>
        </DashboardLayout>
    );
}
