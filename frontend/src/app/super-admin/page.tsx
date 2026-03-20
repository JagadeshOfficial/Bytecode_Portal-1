"use client";

import DashboardLayout from '@/components/DashboardLayout';
import { 
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
    BarChart, Bar, Cell, PieChart, Pie 
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { 
    Shield, Activity, Database, Globe, Zap, Users, 
    Server, Cpu, HardDrive, Terminal, Bell, 
    Clock, RefreshCw, Download, Settings, Lock
} from 'lucide-react';

const throughputData = [
    { time: '10:00', load: 45, reqs: 1200 },
    { time: '11:00', load: 52, reqs: 1450 },
    { time: '12:00', load: 48, reqs: 1300 },
    { time: '13:00', load: 75, reqs: 2100 },
    { time: '14:00', load: 60, reqs: 1800 },
    { time: '15:00', load: 85, reqs: 2500 },
    { time: '16:00', load: 70, reqs: 2200 },
];

const serviceIntegrity = [
    { name: 'Gateway', status: 'Online', uptime: '99.99%', load: 12, color: '#06b6d4' },
    { name: 'User Auth', status: 'Online', uptime: '100%', load: 8, color: '#10b981' },
    { name: 'Course Engine', status: 'Optimizing', uptime: '98.5%', load: 85, color: '#f59e0b' },
    { name: 'Discovery', status: 'Online', uptime: '99.9%', load: 5, color: '#8b5cf6' },
];

const COLORS = ['#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444'];

export default function SuperAdminDashboard() {
    const [isMounted, setIsMounted] = useState(false);
    const [stats, setStats] = useState({ users: 0, apiCalls: '1.2M', responseTime: '42ms' });
    const [activeSection, setActiveSection] = useState('overview');

    useEffect(() => {
        setIsMounted(true);
        fetch('http://localhost:8082/api/users')
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) setStats(prev => ({ ...prev, users: data.length }));
            })
            .catch(err => console.error(err));
    }, []);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { 
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    return (
        <DashboardLayout role="super_admin">
            <motion.div 
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                style={{ padding: '1rem 0' }}
            >
                {/* --- HEADER SECTION --- */}
                <div style={{ 
                    marginBottom: '3rem', 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '1.5rem'
                }}>
                    <div>
                        <motion.div 
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '0.5rem' }}
                        >
                            <div style={{ 
                                padding: '4px 12px', 
                                background: 'rgba(124, 58, 237, 0.1)', 
                                border: '1px solid rgba(124, 58, 237, 0.2)',
                                borderRadius: '100px',
                                fontSize: '0.7rem',
                                fontWeight: 800,
                                color: 'var(--primary)',
                                letterSpacing: '2px'
                            }}>CENTRAL COMMAND</div>
                            <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)', fontWeight: 700 }}>VER 4.2.0-STABLE</span>
                        </motion.div>
                        <h1 style={{ 
                            fontSize: 'clamp(1.5rem, 4vw, 3rem)', 
                            fontWeight: 900, 
                            letterSpacing: '-1px',
                            lineHeight: 1,
                            marginBottom: '0.5rem'
                        }}>Global Engine Control</h1>
                        <p style={{ color: 'var(--text-dim)', fontSize: '1.1rem' }}>Manage infrastructure, security, and global institute nodes.</p>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                         <div style={{ textAlign: 'right', display: 'none' }} className="desktop-only">
                            <div style={{ color: 'var(--text-dim)', fontSize: '0.75rem', fontWeight: 700 }}>LAST BACKUP</div>
                            <div style={{ fontWeight: 800, color: '#10b981' }}>2h 14m ago</div>
                         </div>
                         <button style={{ 
                             background: 'rgba(255,255,255,0.03)', 
                             border: '1px solid rgba(255,255,255,0.1)', 
                             padding: '12px', 
                             borderRadius: '12px',
                             cursor: 'pointer'
                         }}><Bell size={20} /></button>
                         <button className="btn-quantum" style={{ padding: '12px 24px', fontSize: '0.8rem' }}>
                            <RefreshCw size={14} style={{ marginRight: '8px' }} /> BOOT SYSTEM
                         </button>
                    </div>
                </div>

                {/* --- CORE METRICS GRID --- */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                    gap: '1.5rem',
                    marginBottom: '2.5rem'
                }}>
                    <ControlCard 
                        icon={<Users size={24} />} 
                        title="Active Citizens" 
                        value={stats.users} 
                        trend="+14% this month" 
                        chartColor="#3b82f6" 
                    />
                    <ControlCard 
                        icon={<Activity size={24} />} 
                        title="API Response" 
                        value={stats.responseTime} 
                        trend="-5ms avg" 
                        chartColor="#10b981" 
                    />
                    <ControlCard 
                        icon={<Zap size={24} />} 
                        title="Compute Load" 
                        value="32.4%" 
                        trend="Normal range" 
                        chartColor="#f59e0b" 
                    />
                    <ControlCard 
                        icon={<HardDrive size={24} />} 
                        title="DB Queries" 
                        value="24k/s" 
                        trend="Peak efficiency" 
                        chartColor="#ec4899" 
                    />
                </div>

                {/* --- MAIN DASHBOARD AREA --- */}
                <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: '7fr 3fr', 
                    gap: '2rem',
                    marginBottom: '2rem'
                }}>
                    {/* Left: Real-time traffic */}
                    <motion.div variants={containerVariants} className="glass-panel" style={{ padding: '2rem', borderRadius: '32px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                            <div>
                                <h3 style={{ fontSize: '1.4rem', fontWeight: 900, marginBottom: '0.25rem' }}>Infrastructure Throughput</h3>
                                <p style={{ fontSize: '0.9rem', color: 'var(--text-dim)' }}>Requests per second vs Server Load</p>
                            </div>
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <button style={{ padding: '4px 12px', fontSize: '0.7rem', borderRadius: '6px', background: 'var(--primary)', color: '#fff', border: 'none' }}>LIVE</button>
                                <button style={{ padding: '4px 12px', fontSize: '0.7rem', borderRadius: '6px', background: 'rgba(255,255,255,0.05)', color: 'var(--text-dim)', border: 'none' }}>24H</button>
                            </div>
                        </div>

                        <div style={{ height: 400, width: '100%', marginLeft: '-20px' }}>
                            {isMounted && (
                                <ResponsiveContainer>
                                    <AreaChart data={throughputData}>
                                        <defs>
                                            <linearGradient id="loadGrad" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.4} />
                                                <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="5 5" stroke="rgba(255,255,255,0.03)" vertical={false} />
                                        <XAxis dataKey="time" stroke="#64748b" axisLine={false} tickLine={false} dy={10} />
                                        <YAxis stroke="#64748b" axisLine={false} tickLine={false} />
                                        <Tooltip 
                                            contentStyle={{ 
                                                background: 'rgba(15, 23, 42, 0.95)', 
                                                border: '1px solid rgba(255,255,255,0.1)', 
                                                borderRadius: '16px',
                                                backdropFilter: 'blur(12px)'
                                            }} 
                                        />
                                        <Area 
                                            type="monotone" 
                                            dataKey="load" 
                                            stroke="var(--primary)" 
                                            strokeWidth={4}
                                            fill="url(#loadGrad)" 
                                            animationDuration={2000}
                                        />
                                        <Area 
                                            type="monotone" 
                                            dataKey="reqs" 
                                            stroke="#06b6d4" 
                                            strokeWidth={2}
                                            strokeDasharray="8 4"
                                            fill="none" 
                                            animationDuration={2500}
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            )}
                        </div>
                    </motion.div>

                    {/* Right: Security & Actions */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        {/* Status Pulse */}
                        <motion.div variants={containerVariants} className="glass-panel" style={{ padding: '1.5rem', borderRadius: '24px', textAlign: 'center' }}>
                            <div style={{ 
                                position: 'relative', 
                                width: '100px', 
                                height: '100px', 
                                margin: '0 auto 1.5rem',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <motion.div 
                                    animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                    style={{ position: 'absolute', width: '100%', height: '100%', background: '#10b981', borderRadius: '50%', filter: 'blur(20px)' }} 
                                />
                                <div style={{ position: 'relative', width: '50px', height: '50px', background: '#10b981', borderRadius: '50%', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 40px #10b981' }}>
                                    <Shield size={24} />
                                </div>
                            </div>
                            <h4 style={{ fontWeight: 900, marginBottom: '0.25rem' }}>Firewall Intact</h4>
                            <p style={{ fontSize: '0.8rem', color: '#10b981', fontWeight: 700 }}>0 SECURITY BREACHES</p>
                        </motion.div>

                        {/* Quick Control Center */}
                        <motion.div variants={containerVariants} className="glass-panel" style={{ padding: '1.5rem', borderRadius: '24px' }}>
                            <h4 style={{ fontSize: '0.9rem', fontWeight: 900, marginBottom: '1.5rem', color: 'var(--text-bright)' }}>ENGINEER ACTIONS</h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                <EngineAction icon={<Terminal size={14} />} label="Flush Gateway Cache" primary />
                                <EngineAction icon={<Download size={14} />} label="Download System Logs" />
                                <EngineAction icon={<Settings size={14} />} label="Runtime Config" />
                                <EngineAction icon={<Lock size={14} />} label="Rotate Auth Keys" color="#ef4444" />
                            </div>
                        </motion.div>

                        {/* Resource Pie */}
                        <motion.div variants={containerVariants} className="glass-panel" style={{ padding: '1.5rem', borderRadius: '24px', height: '240px' }}>
                             <div style={{ height: '100%', width: '100%' }}>
                                {isMounted && (
                                    <ResponsiveContainer>
                                        <PieChart>
                                            <Pie
                                                data={[
                                                    { name: 'App Nodes', value: 45 },
                                                    { name: 'Worker Pool', value: 25 },
                                                    { name: 'Cache Layer', value: 15 },
                                                    { name: 'Reserved', value: 15 }
                                                ]}
                                                innerRadius={60}
                                                outerRadius={80}
                                                paddingAngle={5}
                                                dataKey="value"
                                            >
                                                {COLORS.map((color, index) => (
                                                    <Cell key={`cell-${index}`} fill={color} />
                                                ))}
                                            </Pie>
                                            <Tooltip />
                                        </PieChart>
                                    </ResponsiveContainer>
                                )}
                             </div>
                        </motion.div>
                    </div>
                </div>

                {/* --- SERVICE GRID --- */}
                <h3 style={{ fontSize: '1.4rem', fontWeight: 900, marginBottom: '1.5rem' }}>Service Cluster Integrity</h3>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                    gap: '1.5rem'
                }}>
                    {serviceIntegrity.map((s, i) => (
                        <ServiceNode key={i} {...s} />
                    ))}
                </div>

            </motion.div>

            <style jsx global>{`
                .glass-panel {
                    border: 1px solid rgba(255,255,255,0.05) !important;
                    background: rgba(255,255,255,0.02) !important;
                    box-shadow: 0 4px 64px -12px rgba(0,0,0,0.4) !important;
                }
                .glass-panel:hover {
                    background: rgba(255,255,255,0.03) !important;
                    border-color: rgba(124, 58, 237, 0.2) !important;
                }
            `}</style>
        </DashboardLayout>
    );
}

function ControlCard({ icon, title, value, trend, chartColor }: any) {
    return (
        <motion.div 
            variants={{ hidden: { opacity: 0, scale: 0.9 }, visible: { opacity: 1, scale: 1 } }}
            whileHover={{ y: -8, scale: 1.02 }}
            className="glass-panel"
            style={{ padding: '1.75rem', borderRadius: '28px', position: 'relative', overflow: 'hidden' }}
        >
            <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: `${chartColor}20`, color: chartColor, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
                {icon}
            </div>
            <div style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-dim)', letterSpacing: '0.5px', marginBottom: '0.5rem' }}>{title.toUpperCase()}</div>
            <div style={{ fontSize: '2.4rem', fontWeight: 900, color: '#fff', marginBottom: '0.5rem', letterSpacing: '-1px' }}>{value}</div>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: chartColor }}>{trend}</div>
            
            {/* Background flourish */}
            <div style={{ position: 'absolute', bottom: '-20px', right: '-20px', width: '100px', height: '100px', borderRadius: '50%', background: chartColor, opacity: 0.03, filter: 'blur(30px)' }} />
        </motion.div>
    );
}

function ServiceNode({ name, status, uptime, load, color }: any) {
    return (
        <motion.div 
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
            className="glass-panel" 
            style={{ padding: '1.5rem', borderRadius: '24px' }}
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Server size={18} color={color} />
                    <span style={{ fontWeight: 800, fontSize: '1rem' }}>{name}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: status === 'Online' ? '#10b981' : '#f59e0b' }} />
                    <span style={{ fontSize: '0.7rem', fontWeight: 800, opacity: 0.8 }}>{status.toUpperCase()}</span>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                <div>
                    <div style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--text-dim)', marginBottom: '4px' }}>UPTIME</div>
                    <div style={{ fontWeight: 900, fontSize: '1.1rem' }}>{uptime}</div>
                </div>
                <div>
                    <div style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--text-dim)', marginBottom: '4px' }}>LOAD</div>
                    <div style={{ fontWeight: 900, fontSize: '1.1rem' }}>{load}%</div>
                </div>
            </div>

            <div style={{ height: '6px', width: '100%', background: 'rgba(255,255,255,0.03)', borderRadius: '100px', overflow: 'hidden' }}>
                <motion.div 
                    initial={{ width: 0 }} 
                    animate={{ width: `${load}%` }} 
                    style={{ height: '100%', background: color }} 
                />
            </div>
        </motion.div>
    );
}

function EngineAction({ icon, label, primary, color }: any) {
    return (
        <motion.button 
            whileHover={{ x: 5, background: 'rgba(255,255,255,0.05)' }}
            style={{ 
                width: '100%', 
                padding: '12px 16px', 
                borderRadius: '12px', 
                background: primary ? 'rgba(124, 58, 237, 0.1)' : 'transparent',
                border: primary ? '1px solid rgba(124, 58, 237, 0.2)' : '1px solid rgba(255,255,255,0.05)',
                color: color || (primary ? 'var(--primary)' : 'var(--text-bright)'),
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                cursor: 'pointer',
                fontSize: '0.85rem',
                fontWeight: 700,
                textAlign: 'left',
                transition: 'all 0.2s'
            }}
        >
            {icon}
            {label}
        </motion.button>
    );
}
