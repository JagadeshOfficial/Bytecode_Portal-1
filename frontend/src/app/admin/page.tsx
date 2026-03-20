"use client";

import DashboardLayout from '@/components/DashboardLayout';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const revenueData = [
    { name: 'Jan', revenue: 4000 },
    { name: 'Feb', revenue: 3000 },
    { name: 'Mar', revenue: 2000 },
    { name: 'Apr', revenue: 2780 },
    { name: 'May', revenue: 1890 },
    { name: 'Jun', revenue: 2390 },
    { name: 'Jul', revenue: 3490 },
];

const studentData = [
    { name: 'Java', students: 120 },
    { name: 'Python', students: 98 },
    { name: 'React', students: 86 },
    { name: 'AWS', students: 99 },
    { name: 'Data Sci', students: 85 },
];

export default function AdminDashboard() {
    const [isMounted, setIsMounted] = useState(false);
    const [userCount, setUserCount] = useState(0);
    const [adminName, setAdminName] = useState('Admin');

    useEffect(() => {
        setIsMounted(true);
        
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const parsed = JSON.parse(storedUser);
            setAdminName(parsed.name || 'Admin');
        }

        fetch('http://localhost:8082/api/users')
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setUserCount(data.length);
                }
            })
            .catch(err => console.error('Error fetching user count:', err));
    }, []);

    return (
        <DashboardLayout role="admin">
            <div style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>Welcome, {adminName}</h1>
                <p style={{ color: 'var(--text-dim)' }}>Live institute metrics and performance analytics.</p>
            </div>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                gap: '1.5rem',
                marginBottom: '2rem'
            }}>
                <StatsCard title="Total Users" value={userCount.toLocaleString()} trend="+12.5%" color="blue" />
                <StatsCard title="Monthly Revenue" value="$45,000" trend="+8.2%" color="green" />
                <StatsCard title="New Enrollments" value="128" trend="+24%" color="purple" />
                <StatsCard title="Placement Ratio" value="92%" trend="Top 1%" color="orange" />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem' }}>
                {/* Revenue Chart */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-panel"
                    style={{ padding: '2rem', borderRadius: '1.5rem' }}
                >
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>Revenue Trends</h3>
                    <div style={{ height: 300, width: '100%' }}>
                        {isMounted && (
                            <ResponsiveContainer>
                                <AreaChart data={revenueData}>
                                    <defs>
                                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border-faint)" />
                                    <XAxis dataKey="name" stroke="var(--text-dim)" />
                                    <YAxis stroke="var(--text-dim)" />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: 'var(--bg-panel)', border: 'var(--border-luminous)', borderRadius: '8px', color: 'var(--text-bright)' }}
                                    />
                                    <Area type="monotone" dataKey="revenue" stroke="#2563eb" fillOpacity={1} fill="url(#colorRevenue)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        )}
                    </div>
                </motion.div>

                {/* Student Distribution */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="glass-panel"
                    style={{ padding: '2rem', borderRadius: '1.5rem' }}
                >
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>Course Distribution</h3>
                    <div style={{ height: 300, width: '100%' }}>
                        {isMounted && (
                            <ResponsiveContainer>
                                <BarChart data={studentData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border-faint)" />
                                    <XAxis dataKey="name" stroke="var(--text-dim)" />
                                    <YAxis stroke="var(--text-dim)" />
                                    <Tooltip
                                        cursor={{ fill: 'var(--bg-subtle)' }}
                                        contentStyle={{ backgroundColor: 'var(--bg-panel)', border: 'var(--border-luminous)', borderRadius: '8px', color: 'var(--text-bright)' }}
                                    />
                                    <Legend />
                                    <Bar dataKey="students" fill="#06b6d4" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        )}
                    </div>
                </motion.div>
            </div>
        </DashboardLayout>
    );
}

function StatsCard({ title, value, trend, color }: any) {
    const colors: any = {
        blue: { bg: 'rgba(37, 99, 235, 0.1)', text: '#60a5fa' },
        green: { bg: 'rgba(16, 185, 129, 0.1)', text: '#34d399' },
        purple: { bg: 'rgba(124, 58, 237, 0.1)', text: '#a78bfa' },
        orange: { bg: 'rgba(245, 158, 11, 0.1)', text: '#fbbf24' }
    };

    return (
        <motion.div
            whileHover={{ y: -5 }}
            className="glass-panel"
            style={{
                padding: '1.5rem',
                borderRadius: '1.5rem',
            }}
        >
            <div style={{ color: 'var(--text-dim)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>{title}</div>
            <div style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '0.5rem', color: 'var(--text-bright)' }}>{value}</div>
            <span style={{
                background: colors[color].bg,
                color: colors[color].text,
                padding: '0.25rem 0.75rem',
                borderRadius: '9999px',
                fontSize: '0.8rem',
                fontWeight: '600'
            }}>{trend}</span>
        </motion.div>
    );
}
