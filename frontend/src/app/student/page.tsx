"use client";

import DashboardLayout from '@/components/DashboardLayout';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Book, Trophy, Target, Briefcase } from 'lucide-react';
import { useEffect, useState } from 'react';

const data = [
    { name: 'Completed', value: 65, color: '#10b981' },
    { name: 'Remaining', value: 35, color: 'var(--bg-subtle)' },
];

export default function StudentDashboard() {
    const [isMounted, setIsMounted] = useState(false);
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        setIsMounted(true);
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const parsed = JSON.parse(storedUser);
            // Optionally fetch full profile if needed, but for now use what we have
            fetch(`http://localhost:8082/api/users/${parsed.email}`)
                .then(res => res.json())
                .then(data => setUser(data))
                .catch(err => setUser(parsed)); // Fallback to basic info
        }
    }, []);

    const name = user?.fullName || user?.name || 'Student';

    return (
        <DashboardLayout role="student">
            <div style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>Welcome, {name}</h1>
                <p style={{ color: 'var(--text-dim)' }}>
                    {user?.department || 'Student'} • {user?.userStatus || 'Present'}
                </p>
            </div>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                gap: '1.5rem',
                marginBottom: '2rem'
            }}>
                <StatsCard
                    icon={<Book size={24} className="text-purple-400" />}
                    title="Attendance Rate"
                    value={`${user?.attendanceRate || 0}%`}
                    trend="Consistent"
                    color="purple"
                />
                <StatsCard
                    icon={<Trophy size={24} className="text-yellow-400" />}
                    title="Skill Score"
                    value="850"
                    trend="Top 10%"
                    color="orange"
                />
                <StatsCard
                    icon={<Briefcase size={24} className="text-blue-400" />}
                    title="Status"
                    value={user?.userStatus || 'N/A'}
                    trend={`Checked in at ${user?.checkInTime || 'N/A'}`}
                    color="blue"
                />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="glass-panel"
                    style={{ padding: '2rem', borderRadius: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                >
                    <div>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Course Progress</h3>
                        <p style={{ color: 'var(--text-dim)', marginBottom: '1rem' }}>Java Full Stack Development</p>
                        <div style={{ fontSize: '3rem', fontWeight: 'bold', color: 'var(--success)' }}>65%</div>
                    </div>
                    <div style={{ width: 160, height: 160 }}>
                        {isMounted && (
                            <ResponsiveContainer>
                                <PieChart>
                                    <Pie
                                        data={data}
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                        stroke="none"
                                    >
                                        {data.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{ backgroundColor: 'var(--bg-panel)', border: 'var(--border-luminous)', borderRadius: '8px', color: 'var(--text-bright)' }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        )}
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 }}
                    className="glass-panel"
                    style={{ padding: '2rem', borderRadius: '1.5rem' }}
                >
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>Recent Notices</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div style={{ padding: '1rem', background: 'rgba(37, 99, 235, 0.1)', borderRadius: '1rem', borderLeft: '4px solid var(--primary)' }}>
                            <div style={{ fontWeight: 'bold', marginBottom: '0.25rem' }}>Placement Drive: Infosys</div>
                            <div style={{ fontSize: '0.9rem', color: 'var(--text-dim)' }}>Tomorrow, 10:00 AM • Auditorium</div>
                        </div>
                        <div style={{ padding: '1rem', background: 'var(--bg-subtle)', borderRadius: '1rem', borderLeft: '4px solid var(--text-dim)' }}>
                            <div style={{ fontWeight: 'bold', marginBottom: '0.25rem' }}>System Maintenance</div>
                            <div style={{ fontSize: '0.9rem', color: 'var(--text-dim)' }}>LMS will be down on Sunday 2 AM - 4 AM.</div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </DashboardLayout>
    );
}

function StatsCard({ icon, title, value, trend, color }: any) {
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
            style={{ padding: '1.5rem', borderRadius: '1.5rem' }}
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div style={{ padding: '0.5rem', borderRadius: '0.75rem', background: colors[color].bg }}>
                    {icon}
                </div>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>{trend}</span>
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.25rem' }}>{value}</div>
            <div style={{ color: 'var(--text-dim)', fontSize: '0.9rem' }}>{title}</div>
        </motion.div>
    );
}
