"use client";

import DashboardLayout from '@/components/dashboard/DashboardLayout';
import StatsCard from '@/components/dashboard/StatsCard';
import {
    Building2, Users, DollarSign, GraduationCap,
    TrendingUp, Activity, CheckCircle, AlertTriangle,
    Server, Shield, Plus, FileText, Settings, Database,
    Cpu, HardDrive, Globe, Zap, Wifi, Signal
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

                    {/* System Health Nodes - ADVANCED */}
                    <motion.div variants={itemVariants} className={styles.card} style={{ display: 'flex', flexDirection: 'column' }}>
                        <div className={styles.cardHeader}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Server size={20} className={styles.cardHeaderIcon} style={{ color: '#3b82f6' }} />
                                Platform Infrastructure
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <span className={styles.pulseDot} style={{ background: '#10b981' }} />
                                <span style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Systems Normal</span>
                            </div>
                        </div>

                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1.5rem', paddingTop: '0.5rem' }}>
                            {/* Resource Gauges */}
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
                                {[
                                    { label: 'CPU Load', value: '32%', icon: Cpu, color: '#3b82f6', bar: '32%' },
                                    { label: 'Memory', value: '14/64 GB', icon: HardDrive, color: '#8b5cf6', bar: '22%' },
                                    { label: 'Network', value: '1.2 Gbps', icon: Globe, color: '#10b981', bar: '65%' }
                                ].map((stat, i) => (
                                    <div key={i} style={{ background: 'rgba(255,255,255,0.02)', padding: '1rem 0.8rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: '#94a3b8', fontSize: '0.7rem', textTransform: 'uppercase', fontWeight: 600 }}>
                                            <stat.icon size={14} color={stat.color} /> {stat.label}
                                        </div>
                                        <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'white', fontFamily: 'Rajdhani', marginBottom: '0.5rem' }}>{stat.value}</div>
                                        <div style={{ height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', overflow: 'hidden' }}>
                                            <motion.div
                                                initial={{ width: 0 }} animate={{ width: stat.bar }} transition={{ duration: 1, delay: 0.5 }}
                                                style={{ height: '100%', background: stat.color, borderRadius: '2px' }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Advanced Services List */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                                <div style={{ fontSize: '0.8rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.05em' }}>Microservices Status</div>
                                {[
                                    { name: 'Core API Gateway', region: 'us-east-1(a)', lat: '12ms', status: 'Healthy', load: 24, color: '#10b981' },
                                    { name: 'LMS Database Shard-01', region: 'us-east-1(b)', lat: '18ms', status: 'Healthy', load: 45, color: '#10b981' },
                                    { name: 'AI Inference Neural Engine', region: 'eu-west-2', lat: '142ms', status: 'High Load', load: 88, color: '#f59e0b' },
                                    { name: 'Socket Realtime Svc', region: 'Global Edge', lat: '4ms', status: 'Healthy', load: 12, color: '#10b981' },
                                ].map((service, i) => (
                                    <div key={i} className={styles.interactiveRow} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem', background: 'rgba(15, 23, 42, 0.4)', borderRadius: '8px', borderLeft: `3px solid ${service.color}` }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                            <div style={{ background: `rgba(255,255,255,0.03)`, padding: '0.5rem', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                                {service.status === 'High Load' ? <Zap size={14} color="#f59e0b" fill="#f59e0b" /> : <Wifi size={14} color="#10b981" />}
                                            </div>
                                            <div>
                                                <div style={{ fontWeight: 600, fontSize: '0.85rem', color: '#e2e8f0', fontFamily: 'Rajdhani' }}>{service.name}</div>
                                                <div style={{ fontSize: '0.7rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                    <Globe size={10} /> {service.region} • {service.lat}
                                                </div>
                                            </div>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <div style={{ fontSize: '0.75rem', color: service.color, fontWeight: 700, background: `${service.color}15`, padding: '2px 8px', borderRadius: '4px', display: 'inline-block', marginBottom: '2px' }}>{service.status.toUpperCase()}</div>
                                            <div style={{ fontSize: '0.7rem', color: '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '4px' }}>
                                                <Activity size={10} /> {service.load}% Load
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
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
