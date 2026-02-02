"use client";

import DashboardLayout from '@/components/dashboard/DashboardLayout';
import StatsCard from '@/components/dashboard/StatsCard';
import {
    Building2, Users, DollarSign, GraduationCap,
    TrendingUp, Activity, CheckCircle, AlertTriangle,
    Server, Shield, Plus, FileText, Settings, Database
} from 'lucide-react';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    BarChart, Bar, PieChart, Pie, Cell, Legend
} from 'recharts';
import { motion } from 'framer-motion';
import styles from './SuperAdmin.module.css';

// Mock Data
const REVENUE_DATA = [
    { name: 'Jan', value: 45000, previous: 38000 },
    { name: 'Feb', value: 52000, previous: 42000 },
    { name: 'Mar', value: 48000, previous: 45000 },
    { name: 'Apr', value: 61000, previous: 50000 },
    { name: 'May', value: 55000, previous: 48000 },
    { name: 'Jun', value: 67000, previous: 53000 },
    { name: 'Jul', value: 72000, previous: 58000 },
    { name: 'Aug', value: 85000, previous: 62000 },
    { name: 'Sep', value: 92000, previous: 68000 },
];

const COURSE_PERFORMANCE = [
    { name: 'Java Full Stack', value: 120, color: '#8b5cf6' },
    { name: 'Python & AI', value: 95, color: '#3b82f6' },
    { name: 'DevOps & Cloud', value: 80, color: '#06b6d4' },
    { name: 'Data Science', value: 60, color: '#10b981' },
    { name: 'Cyber Security', value: 45, color: '#f59e0b' },
];

const PLACEMENT_DATA = [
    { name: 'Placed', value: 850, color: '#10b981' },
    { name: 'In Progress', value: 300, color: '#f59e0b' },
    { name: 'Training', value: 450, color: '#3b82f6' },
];

const RECENT_LOGS = [
    { id: 1, user: 'Principal', action: 'System Update', target: 'Core v4.2', time: '10 mins ago', status: 'Success' },
    { id: 2, user: 'Counselor', action: 'New Admission', target: 'Ravi Kumar', time: '45 mins ago', status: 'Success' },
    { id: 3, user: 'System Bot', action: 'Space Warning', target: 'Server DB-01', time: '2 hours ago', status: 'Warning' },
    { id: 4, user: 'Accounts', action: 'Fee Collected', target: 'Batch #204', time: '4 hours ago', status: 'Success' },
    { id: 5, user: 'Faculty Lead', action: 'Update Schedule', target: 'Java Batch', time: '5 hours ago', status: 'Failed' },
];

// Variants for Staggered Animation
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.1 }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
};

export default function SuperAdminDashboard() {
    return (
        <DashboardLayout role="super_admin">
            <motion.div
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                className={styles.container}
            >
                {/* 1. Header & Quick Stats */}
                <motion.div variants={itemVariants} className={styles.statsGrid}>
                    <StatsCard
                        title="Total Revenue"
                        value="$1.2M"
                        trend="+12.5%"
                        trendUp={true}
                        icon={DollarSign}
                        color="#10b981"
                    />
                    <StatsCard
                        title="Active Batches"
                        value="42"
                        trend="+4"
                        trendUp={true}
                        icon={Building2}
                        color="#3b82f6"
                    />
                    <StatsCard
                        title="Total Students"
                        value="2,450"
                        trend="+8.2%"
                        trendUp={true}
                        icon={GraduationCap}
                        color="#8b5cf6"
                    />
                    <StatsCard
                        title="Faculty Strength"
                        value="35"
                        trend="Hiring"
                        trendUp={true}
                        icon={Users}
                        color="#ec4899"
                    />
                </motion.div>

                {/* 2. Main Analytics Section */}
                <div className={styles.chartGrid}>
                    {/* Revenue Trend (Large) */}
                    <motion.div variants={itemVariants} className={styles.card}>
                        <div className={styles.cardHeader}>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <TrendingUp size={20} className={styles.cardHeaderIcon} />
                                Revenue Analytics
                            </div>
                            <div style={{ fontSize: '0.8rem', color: '#94a3b8', textTransform: 'none', fontWeight: 400 }}>This Year vs Last Year</div>
                        </div>
                        <div className={styles.chartContainer}>
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={REVENUE_DATA}>
                                    <defs>
                                        <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                                        </linearGradient>
                                        <linearGradient id="colorPrev" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1} />
                                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                                    <XAxis dataKey="name" stroke="#64748b" axisLine={false} tickLine={false} dy={10} />
                                    <YAxis stroke="#64748b" axisLine={false} tickLine={false} dx={-10} tickFormatter={(value) => `$${value / 1000}k`} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '8px', color: '#fff' }}
                                        itemStyle={{ color: '#fff' }}
                                    />
                                    <Area type="monotone" dataKey="value" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" name="Current Year" />
                                    <Area type="monotone" dataKey="previous" stroke="#3b82f6" strokeWidth={2} strokeDasharray="5 5" fillOpacity={1} fill="url(#colorPrev)" name="Previous Year" />
                                    <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </motion.div>

                    {/* Placement Stats (Donut) */}
                    <motion.div variants={itemVariants} className={styles.card}>
                        <div className={styles.cardHeader}>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <CheckCircle size={20} className={styles.cardHeaderIcon} style={{ color: '#10b981' }} />
                                Placement Status
                            </div>
                        </div>
                        <div className="flex-1 min-h-[250px] relative" style={{ flex: 1, minHeight: '300px', position: 'relative' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={PLACEMENT_DATA}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {PLACEMENT_DATA.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }}
                                    />
                                    <Legend verticalAlign="bottom" height={36} iconType="circle" />
                                </PieChart>
                            </ResponsiveContainer>
                            <div className={styles.donutCenter}>
                                <div className={styles.donutCenterValue}>850+</div>
                                <div className={styles.donutCenterLabel}>Students Placed</div>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* 3. Middle Section: Top Institutes & System Health */}
                <div className={styles.middleGrid}>
                    {/* Top Performing Institutes (Bar Chart) */}
                    <motion.div variants={itemVariants} className={styles.card}>
                        <div className={styles.cardHeader}>Course Enrollment Trends</div>
                        <div style={{ height: '300px', width: '100%' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={COURSE_PERFORMANCE} layout="vertical">
                                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="rgba(255,255,255,0.05)" />
                                    <XAxis type="number" hide />
                                    <YAxis dataKey="name" type="category" width={120} stroke="#94a3b8" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                                    <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ backgroundColor: '#1e293b', border: 'none' }} />
                                    <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={20}>
                                        {COURSE_PERFORMANCE.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </motion.div>

                    {/* System Health Nodes */}
                    <motion.div variants={itemVariants} className={styles.card}>
                        <div className={styles.cardHeader}>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <Server size={20} className={styles.cardHeaderIcon} style={{ color: '#3b82f6' }} />
                                Platform Infrastructure
                            </div>
                        </div>
                        <div className={styles.healthGrid}>
                            {[
                                { label: 'Student Portal', status: 'Operational', ping: '12ms', icon: Database, color: '#10b981', bg: 'rgba(16, 185, 129, 0.1)' },
                                { label: 'LMS Server', status: 'Operational', ping: '45ms', icon: Shield, color: '#10b981', bg: 'rgba(16, 185, 129, 0.1)' },
                                { label: 'Attendance Bio', status: 'Sync Delayed', ping: '120ms', icon: Server, color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.1)' },
                                { label: 'AI Inference', status: 'Operational', ping: '89ms', icon: Activity, color: '#8b5cf6', bg: 'rgba(139, 92, 246, 0.1)' },
                            ].map((node, i) => (
                                <div key={i} className={styles.healthNode}>
                                    <div className={styles.nodeIconBox} style={{ background: node.bg, color: node.color }}>
                                        <node.icon size={20} />
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '0.875rem', fontWeight: 500, color: '#e2e8f0' }}>{node.label}</div>
                                        <div style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: node.color }}></span>
                                            {node.status} ({node.ping})
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>

                {/* 4. Bottom Section: Quick Actions & Recent Logs */}
                <div className={styles.bottomGrid}>
                    {/* Quick Actions Panel */}
                    <motion.div variants={itemVariants} className={styles.card}>
                        <div className={styles.cardHeader}>Quick Actions</div>
                        <div className={styles.actionsGrid}>
                            <button className={styles.actionBtn}>
                                <Plus size={24} style={{ marginBottom: '0.5rem' }} />
                                <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>Create Batch</span>
                            </button>
                            <button className={styles.actionBtn}>
                                <Users size={24} style={{ marginBottom: '0.5rem' }} />
                                <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>Add Faculty</span>
                            </button>
                            <button className={styles.actionBtn}>
                                <FileText size={24} style={{ marginBottom: '0.5rem' }} />
                                <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>Admissions</span>
                            </button>
                            <button className={styles.actionBtn}>
                                <Settings size={24} style={{ marginBottom: '0.5rem' }} />
                                <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>Platform Config</span>
                            </button>
                        </div>
                    </motion.div>

                    {/* Recent Audit Logs */}
                    <motion.div variants={itemVariants} className={styles.card}>
                        <div className={styles.cardHeader}>
                            Recent Audit Logs
                            <button style={{ fontSize: '0.75rem', color: '#a78bfa', background: 'none', border: 'none', cursor: 'pointer', textTransform: 'none' }}>View All</button>
                        </div>
                        <div className={styles.tableContainer}>
                            <table className={styles.table}>
                                <thead>
                                    <tr>
                                        <th>USER</th>
                                        <th>ACTION</th>
                                        <th>TARGET</th>
                                        <th>TIME</th>
                                        <th style={{ textAlign: 'right' }}>STATUS</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {RECENT_LOGS.map((log) => (
                                        <tr key={log.id}>
                                            <td style={{ fontWeight: 500, color: '#e2e8f0' }}>{log.user}</td>
                                            <td style={{ color: '#cbd5e1' }}>{log.action}</td>
                                            <td style={{ fontFamily: 'monospace', color: '#94a3b8', fontSize: '0.75rem' }}>{log.target}</td>
                                            <td style={{ color: '#64748b' }}>{log.time}</td>
                                            <td style={{ textAlign: 'right' }}>
                                                <span className={`${styles.statusBadge} ${log.status === 'Success' ? styles.statusSuccess :
                                                        log.status === 'Warning' ? styles.statusWarning :
                                                            styles.statusFailed
                                                    }`}>
                                                    {log.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </motion.div>
                </div>
            </motion.div>
        </DashboardLayout>
    );
}
