"use client";

import DashboardLayout from '@/components/DashboardLayout';
import { 
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
    BarChart, Bar, Legend, Cell, PieChart, Pie,
    ComposedChart, Line
} from 'recharts';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { 
    Users, DollarSign, BookOpen, Layers, 
    Award, TrendingUp, AlertCircle, ChevronRight,
    Search, UserCheck, Activity, Target
} from 'lucide-react';

const conversionData = [
    { name: 'New Leads', value: 850, fill: '#8b5cf6' },
    { name: 'Interested', value: 420, fill: '#3b82f6' },
    { name: 'Admissions', value: 310, fill: '#10b981' },
];

const revenueTrend = [
    { day: 'Mon', revenue: 4200, enrollments: 12 },
    { day: 'Tue', revenue: 3800, enrollments: 8 },
    { day: 'Wed', revenue: 5600, enrollments: 14 },
    { day: 'Thu', revenue: 7100, enrollments: 19 },
    { day: 'Fri', revenue: 4800, enrollments: 11 },
    { day: 'Sat', revenue: 3200, enrollments: 6 },
    { day: 'Sun', revenue: 5900, enrollments: 15 },
];

export default function SuperAdminHome() {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    return (
        <DashboardLayout role="super_admin">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                
                {/* --- OVERVIEW CARDS --- */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '1.25rem', marginBottom: '2.5rem' }}>
                    <HomeMetricCard icon={<Users />} title="Total Students" value="4,852" trend="+124 new" color="#8b5cf6" />
                    <HomeMetricCard icon={<Target />} title="Conversion" value="36.4%" trend="Good" color="#3b82f6" />
                    <HomeMetricCard icon={<DollarSign />} title="Monthly Income" value="$142,500" trend="22% Growth" color="#10b981" />
                    <HomeMetricCard icon={<Layers />} title="Active Batches" value="18" sub="4 Main Courses" color="#f59e0b" />
                    <HomeMetricCard icon={<Award />} title="Job Placements" value="92.4%" sub="Industry Best" color="#ec4899" />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: '1.5rem', flexWrap: 'wrap' }}>
                    {/* Main Growth Graph */}
                    <div className="glass-panel" style={{ padding: '2rem', borderRadius: '32px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2.5rem' }}>
                            <div>
                                <h3 style={{ fontSize: '1.25rem', fontWeight: 900 }}>Income & Enrollment Growth</h3>
                                <p style={{ fontSize: '0.85rem', color: 'var(--text-dim)' }}>Daily tracking of new students and revenue</p>
                            </div>
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <Badge label="Live Update" color="#10b981" />
                            </div>
                        </div>
                        <div style={{ height: 350, width: '100%', marginLeft: '-20px' }}>
                            {isMounted && (
                                <ResponsiveContainer>
                                    <ComposedChart data={revenueTrend}>
                                        <XAxis dataKey="day" stroke="rgba(255,255,255,0.2)" axisLine={false} tickLine={false} />
                                        <YAxis yAxisId="left" stroke="rgba(255,255,255,0.2)" axisLine={false} tickLine={false} />
                                        <YAxis yAxisId="right" orientation="right" stroke="rgba(255,255,255,0.2)" axisLine={false} tickLine={false} />
                                        <Tooltip contentStyle={{ background: '#0f172a', border: 'none', borderRadius: '16px' }} />
                                        <Area yAxisId="left" type="monotone" dataKey="revenue" fill="rgba(139, 92, 246, 0.1)" stroke="#8b5cf6" strokeWidth={3} />
                                        <Line yAxisId="right" type="step" dataKey="enrollments" stroke="#10b981" strokeWidth={3} dot={{ fill: '#10b981' }} />
                                    </ComposedChart>
                                </ResponsiveContainer>
                            )}
                        </div>
                    </div>

                    {/* Conversion Funnel & Alerts */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div className="glass-panel" style={{ padding: '2rem', borderRadius: '24px' }}>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: 900, marginBottom: '2rem' }}>Leads Tracking</h3>
                            <div style={{ height: 220, width: '100%' }}>
                                {isMounted && (
                                    <ResponsiveContainer>
                                        <BarChart data={conversionData} layout="vertical">
                                            <XAxis type="number" hide />
                                            <YAxis dataKey="name" type="category" stroke="var(--text-dim)" axisLine={false} tickLine={false} />
                                            <Tooltip cursor={{ fill: 'rgba(255,255,255,0.05)' }} contentStyle={{ background: '#1e293b', border: 'none' }} />
                                            <Bar dataKey="value" radius={[0, 10, 10, 0]} barSize={25}>
                                                {conversionData.map((e, i) => <Cell key={i} fill={e.fill} />)}
                                            </Bar>
                                        </BarChart>
                                    </ResponsiveContainer>
                                )}
                            </div>
                        </div>

                        {/* Alerts Panel */}
                        <div className="glass-panel" style={{ padding: '2rem', borderRadius: '24px', borderLeft: '4px solid #ef4444' }}>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: 900, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <AlertCircle size={18} color="#ef4444" /> Pending Tasks
                            </h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                <AlertRow type="FOLLOW-UP" label="24 Pending Counsellor calls" time="30m ago" />
                                <AlertRow type="ATTENDANCE" label="Batch J1 attendance low" time="2h ago" />
                                <AlertRow type="PAYMENTS" label="4 Payments overdue ($3.2k)" time="Today" />
                            </div>
                            <button style={{ width: '100%', marginTop: '1.5rem', padding: '10px', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: 'none', borderRadius: '8px', fontWeight: 900, fontSize: '0.8rem', cursor: 'pointer' }}>VIEW ALL NOTIFICATIONS →</button>
                        </div>
                    </div>
                </div>

                {/* --- RECENT ACTIVITY TABLE --- */}
                <div style={{ marginTop: '3rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <h3 style={{ fontSize: '1.4rem', fontWeight: 900 }}>Recent Activity</h3>
                        <div style={{ color: 'var(--primary)', fontWeight: 800, fontSize: '0.85rem' }}>VIEW ALL ACTIVITY</div>
                    </div>
                    <div className="glass-panel" style={{ borderRadius: '24px', overflow: 'hidden' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead>
                                <tr style={{ background: 'rgba(255,255,255,0.02)', fontSize: '0.7rem', color: 'var(--text-dim)', fontWeight: 800 }}>
                                    <th style={{ padding: '15px 20px' }}>ENTITY / USER</th>
                                    <th style={{ padding: '15px 20px' }}>ACTION PERFORMED</th>
                                    <th style={{ padding: '15px 20px' }}>TIME</th>
                                    <th style={{ padding: '15px 20px' }}>PRIORITY</th>
                                </tr>
                            </thead>
                            <tbody>
                                <PulseRow entity="Security Service" action="Regular System Check" time="Just Now" rank="LOW" />
                                <PulseRow entity="Server Node 4" action="Performance Balanced" time="3m ago" rank="NORMAL" />
                                <PulseRow entity="Admin: Sai" action="Created New Batch" time="15m ago" rank="NORMAL" />
                            </tbody>
                        </table>
                    </div>
                </div>
            </motion.div>
        </DashboardLayout>
    );
}

function HomeMetricCard({ icon, title, value, trend, sub, color }: any) {
    return (
        <div className="glass-panel" style={{ padding: '1.25rem', borderRadius: '20px', borderBottom: `3px solid ${color}` }}>
            <div style={{ color: color, marginBottom: '0.6rem' }}>{icon}</div>
            <div style={{ fontSize: '0.6rem', fontWeight: 800, color: 'var(--text-dim)', letterSpacing: '1px' }}>{title.toUpperCase()}</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 900, margin: '0.2rem 0' }}>{value}</div>
            <div style={{ fontSize: '0.7rem', color: trend ? '#10b981' : 'var(--text-dim)', fontWeight: 700 }}>{trend || sub}</div>
        </div>
    );
}

function Badge({ label, color }: any) {
    return <span style={{ background: `${color}10`, color: color, padding: '4px 12px', borderRadius: '100px', fontSize: '0.7rem', fontWeight: 900 }}>{label.toUpperCase()}</span>;
}

function AlertRow({ type, label, time }: any) {
    return (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '10px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
            <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.65rem', fontWeight: 900, color: '#ef4444' }}>{type}</div>
                <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>{label}</div>
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>{time}</div>
        </div>
    );
}

function PulseRow({ entity, action, time, rank }: any) {
    return (
        <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
            <td style={{ padding: '15px 20px', fontWeight: 800 }}>{entity}</td>
            <td style={{ padding: '15px 20px', color: 'var(--text-dim)', fontSize: '0.9rem' }}>{action}</td>
            <td style={{ padding: '15px 20px', color: 'var(--text-dim)', fontSize: '0.8rem' }}>{time}</td>
            <td style={{ padding: '15px 20px' }}><Badge label={rank} color={rank === 'HIGH' ? '#ef4444' : rank === 'NORMAL' ? '#3b82f6' : '#94a3b8'} /></td>
        </tr>
    );
}
