"use client";

import DashboardLayout from '@/components/DashboardLayout';
import { 
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
    BarChart, Bar, Legend, Cell, PieChart, Pie 
} from 'recharts';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { 
    Users, BookOpen, Clock, Calendar, 
    FileText, Award, ChevronRight, CheckCircle,
    Activity, Clipboard, Zap
} from 'lucide-react';

const batchData = [
    { name: 'Morning (J1)', students: 45, attendance: 92 },
    { name: 'Afternoon (J2)', students: 38, attendance: 85 },
    { name: 'Evening (P1)', students: 52, attendance: 88 },
];

const performanceData = [
    { week: 'W1', avg: 72 },
    { week: 'W2', avg: 75 },
    { week: 'W3', avg: 82 },
    { week: 'W4', avg: 78 },
    { week: 'W5', avg: 85 },
];

export default function EmployeeDashboard() {
    const [isMounted, setIsMounted] = useState(false);
    const [employee, setEmployee] = useState<any>(null);

    useEffect(() => {
        setIsMounted(true);
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const parsed = JSON.parse(storedUser);
            fetch(`http://localhost:8082/api/users/${parsed.email}`)
                .then(res => res.json())
                .then(data => setEmployee(data))
                .catch(() => setEmployee(parsed));
        }
    }, []);

    const name = employee?.fullName || employee?.name || 'Faculty';

    return (
        <DashboardLayout role="employee">
            <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
                
                {/* --- FACULTY HEADER --- */}
                <div style={{ marginBottom: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
                    <div>
                        <div style={{ padding: '4px 12px', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)', borderRadius: '100px', fontSize: '0.7rem', fontWeight: 800, color: '#10b981', letterSpacing: '2px', display: 'inline-block', marginBottom: '1rem' }}>FACULTY CONTROL CENTER</div>
                        <h1 style={{ fontSize: '2.5rem', fontWeight: 900, letterSpacing: '-1px' }}>Welcome back, {name.split(' ')[0]}</h1>
                        <p style={{ color: 'var(--text-dim)', fontSize: '1.1rem' }}>Your first session for <span style={{ color: 'var(--primary)', fontWeight: 800 }}>Java Morning Batch</span> starts in 45m.</p>
                    </div>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button className="btn-quantum" style={{ padding: '12px 24px', fontSize: '0.8rem' }}>
                            <Clipboard size={14} style={{ marginRight: '8px' }} /> MARK ATTENDANCE
                        </button>
                    </div>
                </div>

                {/* --- FACULTY METRICS --- */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
                    <FacultyMetricCard icon={<Users />} title="Total Assigned Students" value="135" sub="Across 3 Active Batches" color="#3b82f6" />
                    <FacultyMetricCard icon={<Activity />} title="Avg. Attendance" value="88.4%" sub="System benchmark: 85%" color="#10b981" />
                    <FacultyMetricCard icon={<BookOpen />} title="Pending Assignments" value="24" sub="To be reviewed this week" color="#f59e0b" />
                    <FacultyMetricCard icon={<Award />} title="Batch Satisfaction" value="4.9/5" sub="Based on student feedback" color="#ec4899" />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem', flexWrap: 'wrap' }}>
                    {/* Batch Performance Area */}
                    <div className="glass-panel" style={{ padding: '2.5rem', borderRadius: '32px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2.5rem' }}>
                            <div>
                                <h3 style={{ fontSize: '1.25rem', fontWeight: 900 }}>Class Progression</h3>
                                <p style={{ fontSize: '0.9rem', color: 'var(--text-dim)' }}>Average score trends across modules</p>
                            </div>
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <BadgeSelect active>Week</BadgeSelect>
                                <BadgeSelect>Month</BadgeSelect>
                            </div>
                        </div>
                        <div style={{ height: 350, width: '100%', marginLeft: '-20px' }}>
                            {isMounted && (
                                <ResponsiveContainer>
                                    <AreaChart data={performanceData}>
                                        <defs>
                                            <linearGradient id="progGrad" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <XAxis dataKey="week" stroke="var(--text-dim)" axisLine={false} tickLine={false} dy={10} />
                                        <YAxis stroke="var(--text-dim)" axisLine={false} tickLine={false} domain={[0, 100]} />
                                        <Tooltip contentStyle={{ background: '#0f172a', border: 'none', borderRadius: '16px', boxShadow: '0 10px 40px rgba(0,0,0,0.5)' }} />
                                        <Area type="monotone" dataKey="avg" stroke="#10b981" strokeWidth={4} fill="url(#progGrad)" animationDuration={1500} />
                                    </AreaChart>
                                </ResponsiveContainer>
                            )}
                        </div>
                    </div>

                    {/* Pending Action Items */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div className="glass-panel" style={{ padding: '2rem', borderRadius: '24px' }}>
                            <h4 style={{ fontWeight: 900, marginBottom: '1.5rem', textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.85rem' }}>Next Session Details</h4>
                            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1.5rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)', marginBottom: '1rem' }}>
                                <div style={{ fontSize: '1.1rem', fontWeight: 900, marginBottom: '0.5rem' }}>Microservices Cluster</div>
                                <div style={{ fontSize: '0.85rem', color: 'var(--text-dim)' }}>Batch: J1 (Java Full Stack)</div>
                                <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', fontWeight: 700 }}>
                                    <Calendar size={14} color="var(--primary)" /> Today, 10:00 AM
                                </div>
                            </div>
                            <button style={{ width: '100%', padding: '12px', background: 'var(--primary)', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: 800, cursor: 'pointer' }}>Prepare Materials</button>
                        </div>

                        <div className="glass-panel" style={{ padding: '2rem', borderRadius: '24px' }}>
                            <h4 style={{ fontWeight: 900, marginBottom: '1.25rem', fontSize: '0.85rem' }}>QUICK TASKS</h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                <TaskLink label="Upload Study Material" count="2" />
                                <TaskLink label="Evaluate Assignments" count="18" />
                                <TaskLink label="Schedule Mock Interviews" count="4" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- BATCH MONITORING --- */}
                <div style={{ marginTop: '3rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
                    {batchData.map(b => (
                        <BatchCard key={b.name} {...b} />
                    ))}
                </div>
            </motion.div>
        </DashboardLayout>
    );
}

function FacultyMetricCard({ icon, title, value, sub, color }: any) {
    return (
        <motion.div whileHover={{ scale: 1.02 }} className="glass-panel" style={{ padding: '2rem', borderRadius: '24px', borderLeft: `6px solid ${color}` }}>
            <div style={{ color: color, marginBottom: '1rem' }}>{icon}</div>
            <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-dim)', letterSpacing: '1px' }}>{title.toUpperCase()}</div>
            <div style={{ fontSize: '2.4rem', fontWeight: 900, color: '#fff', margin: '0.5rem 0' }}>{value}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', fontWeight: 700 }}>{sub}</div>
        </motion.div>
    );
}

function BadgeSelect({ children, active }: any) {
    return (
        <button style={{ 
            padding: '6px 16px', 
            borderRadius: '100px', 
            fontSize: '0.75rem', 
            fontWeight: 800, 
            background: active ? 'var(--primary)' : 'rgba(255,255,255,0.05)', 
            color: active ? '#fff' : 'var(--text-dim)',
            border: active ? 'none' : '1px solid rgba(255,255,255,0.1)',
            cursor: 'pointer'
        }}>
            {children.toUpperCase()}
        </button>
    );
}

function TaskLink({ label, count }: any) {
    return (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
            <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-dim)' }}>{label}</span>
            <span style={{ background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', fontSize: '0.7rem', fontWeight: 900, padding: '2px 8px', borderRadius: '4px' }}>{count}</span>
        </div>
    );
}

function BatchCard({ name, students, attendance }: any) {
    return (
        <div className="glass-panel" style={{ padding: '2rem', borderRadius: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <h4 style={{ fontWeight: 900 }}>{name}</h4>
                <div style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 800 }}>{attendance}% ATTENDANCE</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <div style={{ fontSize: '2rem', fontWeight: 900 }}>{students}</div>
                <div style={{ fontSize: '0.8rem', opacity: 0.6, fontWeight: 700 }}>Active Residents</div>
            </div>
            <button style={{ width: '100%', marginTop: '1.5rem', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', color: 'var(--text-bright)', padding: '10px', borderRadius: '10px', fontSize: '0.8rem', fontWeight: 800, cursor: 'pointer' }}>Manage Roster</button>
        </div>
    );
}
