"use client";

import DashboardLayout from '@/components/DashboardLayout';
import { 
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
    BarChart, Bar, Legend, Cell, PieChart, Pie 
} from 'recharts';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { 
    Users, DollarSign, BookOpen, Briefcase, 
    TrendingUp, Award, Calendar, ChevronRight 
} from 'lucide-react';

const revenueData = [
    { month: 'Jan', revenue: 45000, students: 120 },
    { month: 'Feb', revenue: 52000, students: 145 },
    { month: 'Mar', revenue: 48000, students: 130 },
    { month: 'Apr', revenue: 61000, students: 175 },
    { month: 'May', revenue: 55000, students: 160 },
    { month: 'Jun', revenue: 72000, students: 210 },
];

const placementStats = [
    { name: 'Placed', value: 85, color: '#10b981' },
    { name: 'In-Process', value: 12, color: '#f59e0b' },
    { name: 'Not Placed', value: 3, color: '#ef4444' },
];

export default function AdminDashboard() {
    const [isMounted, setIsMounted] = useState(false);
    const [stats, setStats] = useState({ totalUsers: 0, activeCourses: 12, placements: 92 });
    const [adminName, setAdminName] = useState('Admin');

    useEffect(() => {
        setIsMounted(true);
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const parsed = JSON.parse(storedUser);
            setAdminName(parsed.name || 'Admin');
        }

        // Fetch metrics from backend services
        Promise.all([
            fetch('http://localhost:8080/api/users').then(res => res.json()),
            fetch('http://localhost:8080/api/courses').then(res => res.json()).catch(() => []),
        ]).then(([users, courses]) => {
            setStats({
                totalUsers: users.length || 0,
                activeCourses: courses.length || 12,
                placements: 92
            });
        }).catch(err => console.error('Dashboard sync error:', err));
    }, []);

    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.1 } }
    };

    return (
        <DashboardLayout role="admin">
            <motion.div initial="hidden" animate="visible" variants={containerVariants}>
                <div style={{ marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h1 style={{ fontSize: '2.2rem', fontWeight: 900, letterSpacing: '-0.5px' }}>Institute Oversight</h1>
                        <p style={{ color: 'var(--text-dim)', fontSize: '1.1rem' }}>Welcome back, <span style={{ color: 'var(--primary)', fontWeight: 700 }}>{adminName}</span>. Here is your daily intelligence summary.</p>
                    </div>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-dim)', textTransform: 'uppercase' }}>Session Status</div>
                            <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#10b981' }}>Secured & Optimized</div>
                        </div>
                    </div>
                </div>

                {/* --- STATS GRID --- */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                    gap: '1.5rem',
                    marginBottom: '2.5rem'
                }}>
                    <MetricCard icon={<Users />} title="Total Enrollment" value={stats.totalUsers} trend="+12.5% vs Prev Month" color="#3b82f6" />
                    <MetricCard icon={<DollarSign />} title="Monthly Revenue" value="$72,400" trend="On track for $80k" color="#10b981" />
                    <MetricCard icon={<BookOpen />} title="Active Courses" value={stats.activeCourses} trend="4 New Modules added" color="#8b5cf6" />
                    <MetricCard icon={<Award />} title="Placement Rate" value={`${stats.placements}%`} trend="Top 1% in region" color="#f59e0b" />
                </div>

                {/* --- ANALYTICS SECTION --- */}
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem', flexWrap: 'wrap' }}>
                    {/* Growth Chart */}
                    <div className="glass-panel" style={{ padding: '2rem', borderRadius: '24px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <TrendingUp size={20} color="var(--primary)" /> Revenue & Growth Trends
                            </h3>
                            <select style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '5px 12px', borderRadius: '8px', color: 'var(--text-dim)', fontSize: '0.8rem' }}>
                                <option>Last 6 Months</option>
                                <option>Last Year</option>
                            </select>
                        </div>
                        <div style={{ height: 350, width: '100%' }}>
                            {isMounted && (
                                <ResponsiveContainer>
                                    <AreaChart data={revenueData}>
                                        <defs>
                                            <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3} />
                                                <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                                        <XAxis dataKey="month" stroke="var(--text-dim)" axisLine={false} tickLine={false} />
                                        <YAxis stroke="var(--text-dim)" axisLine={false} tickLine={false} />
                                        <Tooltip contentStyle={{ background: 'var(--bg-panel)', border: 'var(--border-luminous)', borderRadius: '12px' }} />
                                        <Area type="monotone" dataKey="revenue" stroke="var(--primary)" strokeWidth={3} fillOpacity={1} fill="url(#revGrad)" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            )}
                        </div>
                    </div>

                    {/* Placements & Recent Activity */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div className="glass-panel" style={{ padding: '2rem', borderRadius: '24px' }}>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '1.5rem' }}>Placement Status</h3>
                            <div style={{ height: 180, width: '100%' }}>
                                {isMounted && (
                                    <ResponsiveContainer>
                                        <PieChart>
                                            <Pie data={placementStats} innerRadius={50} outerRadius={70} paddingAngle={5} dataKey="value">
                                                {placementStats.map((entry, index) => <Cell key={index} fill={entry.color} />)}
                                            </Pie>
                                            <Tooltip />
                                        </PieChart>
                                    </ResponsiveContainer>
                                )}
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginTop: '1rem', flexWrap: 'wrap' }}>
                                {placementStats.map(s => (
                                    <div key={s.name} style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-dim)' }}>
                                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: s.color }} />
                                        {s.name.toUpperCase()}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: '24px' }}>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '1rem' }}>Faculty in Focus</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                <FacultyBar name="Vamsi Krishna" subject="Full Stack" score="9.8" />
                                <FacultyBar name="Sai Kiran" subject="DevOps" score="9.5" />
                                <FacultyBar name="Arjun Reddy" subject="Python/AI" score="9.2" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- RECENT APPLICATIONS --- */}
                <div className="glass-panel" style={{ marginTop: '2.5rem', padding: '2rem', borderRadius: '24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Recent Student Applications</h3>
                        <button style={{ color: 'var(--primary)', background: 'none', border: 'none', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer' }}>View All Applications →</button>
                    </div>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ color: 'var(--text-dim)', fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase' }}>
                                <th style={{ padding: '12px' }}>Student Name</th>
                                <th style={{ padding: '12px' }}>Course Applied</th>
                                <th style={{ padding: '12px' }}>Date</th>
                                <th style={{ padding: '12px' }}>Status</th>
                                <th style={{ padding: '12px' }}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            <ApplicationRow name="Karthik R." course="Masters in AI" date="2 Hours Ago" status="PENDING" statusColor="#f59e0b" />
                            <ApplicationRow name="Anjali Sharma" course="Full Stack Pro" date="5 Hours Ago" status="INTERVIEW" statusColor="#3b82f6" />
                            <ApplicationRow name="Siddharth M." course="AWS Cloud Eng" date="Today" status="VERIFIED" statusColor="#10b981" />
                        </tbody>
                    </table>
                </div>
            </motion.div>
        </DashboardLayout>
    );
}

function MetricCard({ icon, title, value, trend, color }: any) {
    return (
        <motion.div whileHover={{ y: -5 }} className="glass-panel" style={{ padding: '1.75rem', borderRadius: '24px', borderBottom: `4px solid ${color}` }}>
            <div style={{ color: color, marginBottom: '1rem' }}>{icon}</div>
            <div style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{title}</div>
            <div style={{ fontSize: '2.2rem', fontWeight: 900, color: '#fff', margin: '0.5rem 0' }}>{value}</div>
            <div style={{ fontSize: '0.75rem', color: color, fontWeight: 700 }}>{trend}</div>
        </motion.div>
    );
}

function FacultyBar({ name, subject, score }: any) {
    return (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px' }}>
            <div>
                <div style={{ fontWeight: 800, fontSize: '0.9rem' }}>{name}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>{subject}</div>
            </div>
            <div style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', padding: '4px 10px', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 900 }}>
                {score}
            </div>
        </div>
    );
}

function ApplicationRow({ name, course, date, status, statusColor }: any) {
    return (
        <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', fontSize: '0.95rem' }}>
            <td style={{ padding: '16px 12px', fontWeight: 700 }}>{name}</td>
            <td style={{ padding: '16px 12px', color: 'var(--text-dim)' }}>{course}</td>
            <td style={{ padding: '16px 12px', color: 'var(--text-dim)', fontSize: '0.85rem' }}>{date}</td>
            <td style={{ padding: '16px 12px' }}>
                <span style={{ background: `${statusColor}20`, color: statusColor, padding: '4px 10px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 800 }}>{status}</span>
            </td>
            <td style={{ padding: '16px 12px' }}>
                <button style={{ background: 'none', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-bright)', padding: '5px 12px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.8rem' }}>Review</button>
            </td>
        </tr>
    );
}
