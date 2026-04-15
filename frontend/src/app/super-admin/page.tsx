"use client";

import DashboardLayout from '@/components/DashboardLayout';
import { 
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
    BarChart, Bar, Legend, Cell, PieChart, Pie,
    ComposedChart, Line
} from 'recharts';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
    Users, DollarSign, BookOpen, Layers, 
    Award, TrendingUp, AlertCircle, ChevronRight,
    Search, UserCheck, Activity, Target
} from 'lucide-react';
import { fetchJsonSafe } from '@/lib/fetchJson';


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

    const [metrics, setMetrics] = useState({
        totalStudents: 0,
        activeBatches: 0,
        trainers: 0,
        revenue: 0,
        placementRate: 92.4
    });
    const [conversionData, setConversionData] = useState<any[]>([
        { name: 'New Leads', value: 850, fill: '#8b5cf6' },
        { name: 'Interested', value: 420, fill: '#3b82f6' },
        { name: 'Admissions', value: 310, fill: '#10b981' },
    ]);

    useEffect(() => {
        setIsMounted(true);

        const loadHomeData = async () => {
            const [statsResult, batchesResult] = await Promise.all([
                fetchJsonSafe<any>('http://localhost:8080/api/admin/stats'),
                fetchJsonSafe<any[]>('http://localhost:8080/api/academic/batches'),
            ]);

            if (statsResult.ok && statsResult.data) {
                const data = statsResult.data;
                setMetrics({
                    totalStudents: data.totalStudents || 0,
                    activeBatches: data.activeBatches || 0,
                    trainers: data.totalTrainers || 0,
                    revenue: data.totalRevenue || 0,
                    placementRate: data.placementRate || 92.4,
                });

                if (Array.isArray(data.conversionData)) {
                    setConversionData(data.conversionData);
                }
            }

            if (batchesResult.ok && Array.isArray(batchesResult.data)) {
                setMetrics((prev) => ({ ...prev, activeBatches: batchesResult.data?.length || 0 }));
            }
        };

        loadHomeData();
    }, []);

    return (
        <DashboardLayout role="super_admin">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                
                {/* --- OVERVIEW CARDS --- */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '1.25rem', marginBottom: '2.5rem' }}>
                    <HomeMetricCard icon={<Users />} title="Total Students" value={metrics.totalStudents} trend="Active Students" color="#8b5cf6" />
                    <HomeMetricCard icon={<Target />} title="Conversion" value="36.4%" trend="Good" color="#3b82f6" />
                    <HomeMetricCard icon={<DollarSign />} title="Monthly Income" value={`$${(metrics.revenue || 0).toLocaleString()}`} trend="+12.5% AI Predict" color="#10b981" />
                    <HomeMetricCard icon={<Layers />} title="Active Batches" value={metrics.activeBatches} sub="Current Focus" color="#f59e0b" />
                    <HomeMetricCard icon={<Award />} title="Job Placements" value={`${metrics.placementRate}%`} sub="Industry Best" color="#ec4899" />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: '1.5rem', flexWrap: 'wrap' }}>
                    {/* Main Growth Graph */}
                    <div className="glass-panel" style={{ padding: '2.5rem', borderRadius: '32px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2.5rem' }}>
                            <div>
                                <h3 style={{ fontSize: '1.5rem', fontWeight: 900 }}>Income & Enrollment Growth</h3>
                                <p style={{ fontSize: '0.9rem', color: 'var(--text-dim)', marginTop: '4px' }}>Predictive tracking of revenue and scale.</p>
                            </div>
                            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(16, 185, 129, 0.1)', padding: '6px 14px', borderRadius: '100px', fontSize: '0.7rem', fontWeight: 900, color: '#10b981' }}>
                                    <Activity size={12} /> REAL-TIME AUDIT
                                </div>
                                <Badge label="AI SECURE" color="#8b5cf6" />
                            </div>
                        </div>
                        <div style={{ height: 350, width: '100%', marginLeft: '-20px' }}>
                            {isMounted && (
                                <ResponsiveContainer>
                                    <ComposedChart data={revenueTrend}>
                                        <defs>
                                            <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                                                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                                        <XAxis dataKey="day" stroke="rgba(255,255,255,0.2)" axisLine={false} tickLine={false} style={{ fontSize: '0.8rem', fontWeight: 700 }} />
                                        <YAxis yAxisId="left" stroke="rgba(255,255,255,0.2)" axisLine={false} tickLine={false} style={{ fontSize: '0.8rem', fontWeight: 700 }} />
                                        <YAxis yAxisId="right" orientation="right" stroke="rgba(255,255,255,0.2)" axisLine={false} tickLine={false} style={{ fontSize: '0.8rem', fontWeight: 700 }} />
                                        <Tooltip 
                                            contentStyle={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '20px', padding: '15px' }} 
                                            itemStyle={{ fontWeight: 800 }}
                                        />
                                        <Area yAxisId="left" type="monotone" dataKey="revenue" fill="url(#colorRev)" stroke="#8b5cf6" strokeWidth={4} />
                                        <Line yAxisId="right" type="monotone" dataKey="enrollments" stroke="#10b981" strokeWidth={4} dot={{ r: 6, fill: '#10b981', strokeWidth: 4, stroke: '#0f172a' }} />
                                    </ComposedChart>
                                </ResponsiveContainer>
                            )}
                        </div>
                    </div>

                    {/* Conversion Funnel & Alerts */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div className="glass-panel" style={{ padding: '2rem', borderRadius: '32px' }}>
                             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                                <h3 style={{ fontSize: '1.2rem', fontWeight: 900 }}>Leads Tracking</h3>
                                <span style={{ fontSize: '0.75rem', fontWeight: 900, color: 'var(--primary)' }}>CONVERSION FUNNEL</span>
                             </div>
                            <div style={{ height: 220, width: '100%' }}>
                                {isMounted && (
                                    <ResponsiveContainer>
                                        <BarChart 
                                            data={conversionData} 
                                            layout="vertical" 
                                            margin={{ left: 10, right: 30, top: 10, bottom: 10 }}
                                        >
                                            <XAxis type="number" hide />
                                            <YAxis 
                                                dataKey="name" 
                                                type="category" 
                                                stroke="var(--text-dim)" 
                                                axisLine={false} 
                                                tickLine={false} 
                                                width={90}
                                                style={{ fontSize: '0.75rem', fontWeight: 800 }}
                                            />
                                            <Tooltip cursor={{ fill: 'rgba(255,255,255,0.05)' }} contentStyle={{ background: '#0f172a', border: 'none', borderRadius: '15px' }} />
                                            <Bar dataKey="value" radius={[0, 10, 10, 0]} barSize={28}>
                                                {conversionData.map((e, i) => <Cell key={i} fill={e.fill} />)}
                                            </Bar>
                                        </BarChart>
                                    </ResponsiveContainer>
                                )}
                            </div>
                        </div>

                        {/* Recent Alerts (Critical System Status) */}
                        <div className="glass-panel" style={{ padding: '2rem', borderRadius: '32px', borderLeft: '4px solid #ef4444', background: 'rgba(239, 68, 68, 0.02)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                <h3 style={{ fontSize: '1.1rem', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <AlertCircle size={20} color="#ef4444" /> Safety Alerts
                                </h3>
                                <Badge label="High Priority" color="#ef4444" />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                <AlertRow type="FOLLOW-UP" label="24 Pending Admissions Tracker" time="30m ago" />
                                <AlertRow type="SECURITY" label="Strange IP login from Moscow" time="1h ago" />
                                <AlertRow type="PAYMENTS" label="Overdue Tutor Payouts (8 Staff)" time="Today" />
                            </div>
                            <button className="btn-quantum" style={{ width: '100%', marginTop: '1.5rem', padding: '14px', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: '15px' }}>RESOLVE INCIDENTS →</button>
                        </div>
                    </div>
                </div>

                {/* --- LIVE SYSTEM ACTIVITY --- */}
                <div style={{ marginTop: '4rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '2rem' }}>
                        <div>
                            <h3 style={{ fontSize: '1.8rem', fontWeight: 900 }}>Live Command Feed</h3>
                            <p style={{ color: '#666', fontWeight: 700 }}>Real-time audit of every action in the Bytecode ecosystem.</p>
                        </div>
                        <Link href="/super-admin/global-tracking" style={{ color: 'var(--primary)', fontWeight: 900, fontSize: '0.9rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            OPEN GLOBAL CONTROL CENTER <ChevronRight size={18} />
                        </Link>
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
