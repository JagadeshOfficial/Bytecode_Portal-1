"use client";

import DashboardLayout from '@/components/DashboardLayout';
import { motion } from 'framer-motion';
import { Calendar, Clock, CheckCircle, AlertCircle, BookOpen } from 'lucide-react';
import { useState, useEffect } from 'react';

const scheduleIds = [1, 2, 3];

export default function EmployeeDashboard() {
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const parsed = JSON.parse(storedUser);
            fetch(`http://localhost:8082/api/users/${parsed.email}`)
                .then(res => res.json())
                .then(data => setUser(data))
                .catch(err => setUser(parsed));
        }
    }, []);

    const name = user?.fullName || user?.name || 'Faculty';

    return (
        <DashboardLayout role="employee">
            <div style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>Welcome, {name}</h1>
                <p style={{ color: 'var(--text-secondary)' }}>
                    {user?.department || 'Faculty Hub'} • {user?.userStatus || 'Present'}
                </p>
            </div>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                gap: '1.5rem',
                marginBottom: '2rem'
            }}>
                <StatsCard
                    icon={<Clock size={24} className="text-blue-400" />}
                    title="Teaching Hours"
                    value="12h 30m"
                    trend="This Week"
                    color="blue"
                />
                <StatsCard
                    icon={<CheckCircle size={24} className="text-green-400" />}
                    title="Assignments Graded"
                    value="45/50"
                    trend="90% Done"
                    color="green"
                />
                <StatsCard
                    icon={<AlertCircle size={24} className="text-orange-400" />}
                    title="Pending Actions"
                    value="5"
                    trend="Urgent"
                    color="orange"
                />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
                <div className="glass-panel" style={{ padding: '2rem', borderRadius: '1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>Today's Schedule</h3>
                        <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Jan 20, 2026</span>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {scheduleIds.map((i) => (
                            <ScheduleItem key={i} index={i} />
                        ))}
                    </div>
                </div>

                <div className="glass-panel" style={{ padding: '2rem', borderRadius: '1.5rem' }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>Quick Actions</h3>
                    <div style={{ display: 'grid', gap: '1rem' }}>
                        <button className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-left">
                            <div className="p-2 rounded-lg bg-blue-500/20 text-blue-400"><BookOpen size={20} /></div>
                            <div>
                                <div className="font-semibold">Create Assignment</div>
                                <div className="text-xs text-slate-400">Post to batch</div>
                            </div>
                        </button>
                        {/* More buttons... */}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}

function StatsCard({ icon, title, value, trend, color }: any) {
    const colors: any = {
        blue: { bg: 'rgba(37, 99, 235, 0.1)', text: '#60a5fa' },
        green: { bg: 'rgba(16, 185, 129, 0.1)', text: '#34d399' },
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
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{trend}</span>
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.25rem' }}>{value}</div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{title}</div>
        </motion.div>
    );
}

function ScheduleItem({ index }: { index: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            style={{
                display: 'grid',
                gridTemplateColumns: '80px 1fr auto',
                alignItems: 'center',
                padding: '1rem',
                background: 'rgba(255,255,255,0.02)',
                borderRadius: '1rem',
                border: '1px solid var(--border-subtle)'
            }}
        >
            <div style={{ fontWeight: '600', color: 'var(--primary-light)' }}>10:00 AM</div>
            <div>
                <div style={{ fontWeight: '600' }}>Full Stack Development</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Batch B • Live Lecture</div>
            </div>
            <button style={{
                padding: '0.5rem 1rem',
                background: 'var(--primary)',
                color: 'white',
                borderRadius: '0.5rem',
                border: 'none',
                cursor: 'pointer',
                fontSize: '0.9rem',
                fontWeight: '500'
            }}>Join</button>
        </motion.div>
    )
}
