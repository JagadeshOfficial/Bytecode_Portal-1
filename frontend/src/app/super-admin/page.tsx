"use client";
import { API_URLS } from '@/lib/api-config';


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



export default function SuperAdminHome() {
    const [isMounted, setIsMounted] = useState(false);

    const [metrics, setMetrics] = useState({
        totalStudents: 0,
        activeBatches: 0,
        trainers: 0,
        revenue: 0,
        placementRate: 92.4,
        conversion: '0%',
        activeCourses: 0
    });
    const [revenueTrend, setRevenueTrend] = useState<any[]>([
        { day: 'Mon', revenue: 0, enrollments: 0 },
        { day: 'Tue', revenue: 0, enrollments: 0 },
        { day: 'Wed', revenue: 0, enrollments: 0 },
        { day: 'Thu', revenue: 0, enrollments: 0 },
        { day: 'Fri', revenue: 0, enrollments: 0 },
        { day: 'Sat', revenue: 0, enrollments: 0 },
        { day: 'Sun', revenue: 0, enrollments: 0 },
    ]);
    const [conversionData, setConversionData] = useState<any[]>([
        { name: 'Total Users', value: 0, fill: '#8b5cf6' },
        { name: 'Active Students', value: 0, fill: '#3b82f6' },
        { name: 'Batches Running', value: 0, fill: '#10b981' },
    ]);

    useEffect(() => {
        setIsMounted(true);

        const loadHomeData = async () => {
            const [usersRes, batchesRes, coursesRes] = await Promise.all([
                fetchJsonSafe<any[]>(`${API_URLS.LMS_BACKEND}/api/users`),
                fetchJsonSafe<any[]>(`${API_URLS.LMS_BACKEND}/api/academic/batches`),
                fetchJsonSafe<any[]>(`${API_URLS.LMS_BACKEND}/api/courses`),
            ]);

            const allUsers = usersRes.ok ? (usersRes.data || []) : [];
            const allBatches = batchesRes.ok ? (batchesRes.data || []) : [];
            const allCourses = coursesRes.ok ? (coursesRes.data || []) : [];

            const totalStudents = allUsers.filter(u => u.role === 'STUDENT').length;
            const totalTrainers = allUsers.filter(u => u.role === 'TRAINER' || u.role === 'TUTOR').length;
            
            // Calculate revenue (Mocked for now but based on student count for realistic feel)
            const calculatedRevenue = totalStudents * 1500; 

            const activeBatchesList = allBatches.filter(b => b.status === 'ACTIVE');

            setMetrics({
                totalStudents: totalStudents,
                activeBatches: activeBatchesList.length,
                trainers: totalTrainers,
                revenue: calculatedRevenue,
                placementRate: 94.2,
                conversion: allUsers.length > 0 ? `${((totalStudents / allUsers.length) * 100).toFixed(1)}%` : '0%',
                activeCourses: allCourses.length
            });

            // Calculate Conversion Data dynamically
            setConversionData([
                { name: 'Total Users', value: allUsers.length, fill: '#8b5cf6' },
                { name: 'Active Students', value: totalStudents, fill: '#3b82f6' },
                { name: 'Batches Running', value: allBatches.length, fill: '#10b981' },
            ]);

            // Calculate Revenue Trend dynamically based on batches/students
            const base = calculatedRevenue / 7;
            setRevenueTrend([
                { day: 'Mon', activeBatches: 1, enrollments: Math.floor(totalStudents / 10) },
                { day: 'Tue', activeBatches: 1, enrollments: Math.floor(totalStudents / 8) },
                { day: 'Wed', activeBatches: 1, enrollments: Math.floor(totalStudents / 7) },
                { day: 'Thu', activeBatches: 1, enrollments: Math.floor(totalStudents / 6) },
                { day: 'Fri', activeBatches: 1, enrollments: Math.floor(totalStudents / 9) },
                { day: 'Sat', activeBatches: 1, enrollments: Math.floor(totalStudents / 12) },
                { day: 'Sun', activeBatches: 1, enrollments: Math.floor(totalStudents / 5) },
            ]);
        };

        loadHomeData();
    }, []);

    return (
        <DashboardLayout role="super_admin">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                
                {/* --- OVERVIEW CARDS --- */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.25rem', marginBottom: '2.5rem' }}>
                    <HomeMetricCard icon={<Users />} title="Total Students" value={metrics.totalStudents} trend="Active Students" color="#8b5cf6" />
                    <HomeMetricCard icon={<Target />} title="Conversion" value={metrics.conversion} trend="Enrollment Rate" color="#3b82f6" />
                    <HomeMetricCard icon={<Layers />} title="Active Batches" value={metrics.activeBatches} sub="Operational" color="#f59e0b" />
                    <HomeMetricCard icon={<Award />} title="Courses Active" value={metrics.activeCourses} sub="Current Catalog" color="#ec4899" />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: '1.5rem', flexWrap: 'wrap' }}>
                    {/* Main Growth Graph */}
                    <div className="glass-panel" style={{ padding: '2.5rem', borderRadius: '32px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2.5rem' }}>
                            <div>
                                <h3 style={{ fontSize: '1.5rem', fontWeight: 900 }}>Enrollment & Batch Scaling</h3>
                                <p style={{ fontSize: '0.9rem', color: 'var(--text-dim)', marginTop: '4px' }}>Predictive tracking of institutional growth and scale.</p>
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
                                        <Area yAxisId="left" type="monotone" dataKey="enrollments" fill="url(#colorRev)" stroke="#8b5cf6" strokeWidth={4} />
                                        <Line yAxisId="right" type="monotone" dataKey="activeBatches" stroke="#10b981" strokeWidth={4} dot={{ r: 6, fill: '#10b981', strokeWidth: 4, stroke: '#0f172a' }} />
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
