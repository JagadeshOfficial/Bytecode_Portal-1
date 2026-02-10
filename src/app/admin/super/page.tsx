"use client";

import DashboardLayout from '@/components/dashboard/DashboardLayout';
import styles from './SuperAdmin.module.css';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
    Users,
    Building2,
    DollarSign,
    Briefcase,
    ShieldCheck,
    Globe,
    Zap,
    TrendingUp,
    BarChart3,
    Cpu,
    Activity,
    Plus,
    LayoutDashboard,
    Layers,
    FileText,
    Settings,
    Bell,
    CheckCircle2,
    HardDrive,
    Video,
    GraduationCap,
    Wallet,
    PieChart,
    UserCheck,
    Search,
    Download
} from 'lucide-react';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    BarChart, Bar, Cell, Pie
} from 'recharts';

const REVENUE_DATA = [
    { name: 'Jan', revenue: 45 }, { name: 'Feb', revenue: 52 }, { name: 'Mar', revenue: 48 },
    { name: 'Apr', revenue: 61 }, { name: 'May', revenue: 55 }, { name: 'Jun', revenue: 67 },
    { name: 'Jul', revenue: 72 }, { name: 'Aug', revenue: 85 }, { name: 'Sep', revenue: 92 },
];

const PLATFORM_HEALTH = [
    { label: "Core Services", status: "Healthy", uptime: "99.99%", latency: "12ms" },
    { label: "LMS Database", status: "Healthy", uptime: "99.95%", latency: "24ms" },
    { label: "AI Engine", status: "Scaling", uptime: "98.8%", latency: "142ms" },
];

export default function SuperAdminMasterDashboard() {
    // Advanced Animations Variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0, opacity: 1,
            transition: {
                type: "spring",
                stiffness: 100
            }
        }
    };

    const shimmerEffect = {
        initial: { backgroundPosition: "-200% 0" },
        animate: {
            backgroundPosition: "200% 0",
            transition: {
                repeat: Infinity,
                duration: 3,
                ease: "linear"
            }
        }
    };

    return (
        <DashboardLayout role="super_admin">
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="flex flex-col gap-6"
            >
                {/* Master Control Header - Premium Gradient & Glass */}
                <motion.div variants={itemVariants} className="relative overflow-hidden rounded-3xl p-1 bg-gradient-to-r from-[rgba(124,58,237,0.5)] via-[rgba(34,211,238,0.5)] to-[rgba(217,70,239,0.5)]">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-3xl z-0" />
                    <div className="relative z-10 bg-[#030014]/90 rounded-[22px] p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 overflow-hidden">

                        {/* Animated Background Mesh */}
                        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-bl from-[#7c3aed]/20 to-transparent rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />

                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <span className="px-3 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                    System Online
                                </span>
                                <span className="px-3 py-1 rounded-full border border-[var(--accent)]/30 bg-[var(--accent)]/10 text-[var(--accent)] text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
                                    <ShieldCheck className="w-3 h-3" /> Root Access
                                </span>
                            </div>
                            <h1 className="text-3xl md:text-4xl font-display font-bold text-white tracking-wide uppercase leading-none mt-2">
                                Global <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7c3aed] to-[#22d3ee]">Command Center</span>
                            </h1>
                            <p className="text-[var(--text-dim)] mt-2 font-light text-sm">Orchestrating multi-tenant architecture across 12 institutes.</p>
                        </div>

                        <div className="flex gap-3">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="flex items-center gap-2 px-5 py-2.5 bg-[rgba(255,255,255,0.05)] border border-white/10 text-white rounded-xl font-bold hover:bg-white/10 transition-all group"
                            >
                                <Download className="w-4 h-4 text-[var(--text-dim)] group-hover:text-white transition-colors" />
                                <span className="text-xs">Export Report</span>
                            </motion.button>

                            <motion.button
                                whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(124,58,237,0.5)" }}
                                whileTap={{ scale: 0.95 }}
                                className="relative overflow-hidden flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-[#7c3aed] to-[#d946ef] text-white rounded-xl font-bold shadow-2xl skew-x-0"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                                <Plus className="w-4 h-4" />
                                <span className="text-xs tracking-wider">DEPLOY NEW INSTITUTE</span>
                            </motion.button>
                        </div>
                    </div>
                </motion.div>

                {/* Master KPI Grid - 3D Cards with Hover Lift */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5">
                    {[
                        { label: "Total Institutes", value: "12", trend: "+2 New", icon: Building2, color: "text-[#22d3ee]", bg: "from-cyan-500/10 to-blue-500/5", border: "border-cyan-500/20" },
                        { label: "Active Users", value: "12,450", trend: "+8.2%", icon: Users, color: "text-[#7c3aed]", bg: "from-violet-500/10 to-purple-500/5", border: "border-violet-500/20" },
                        { label: "Total Placements", value: "842", trend: "Top Tier", icon: Briefcase, color: "text-[#d946ef]", bg: "from-fuchsia-500/10 to-pink-500/5", border: "border-fuchsia-500/20" },
                        { label: "Staff Strength", value: "156", trend: "Full Cap", icon: UserCheck, color: "text-amber-400", bg: "from-amber-500/10 to-orange-500/5", border: "border-amber-500/20" },
                        { label: "Total Revenue", value: "₹8.42 Cr", trend: "+12.5%", icon: DollarSign, color: "text-emerald-400", bg: "from-emerald-500/10 to-teal-500/5", border: "border-emerald-500/20" },
                    ].map((stat, idx) => (
                        <motion.div
                            key={idx}
                            variants={itemVariants}
                            whileHover={{ y: -10, transition: { type: "spring", stiffness: 300 } }}
                            className={`bg-gradient-to-br ${stat.bg} border ${stat.border} rounded-2xl p-6 backdrop-blur-xl relative overflow-hidden group`}
                        >
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                <stat.icon size={60} />
                            </div>

                            <div className="flex justify-between items-center mb-4 relative z-10">
                                <div className={`p-2.5 rounded-xl bg-white/5 border border-white/10 group-hover:scale-110 transition-transform shadow-lg ${stat.color}`}>
                                    <stat.icon className="w-5 h-5" />
                                </div>
                                <span className="text-[10px] font-bold text-white bg-white/10 px-2.5 py-0.5 rounded-full backdrop-blur-md border border-white/5">{stat.trend}</span>
                            </div>

                            <div className="relative z-10">
                                <div className="text-3xl font-bold text-white font-display mb-1 tracking-tight drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">{stat.value}</div>
                                <div className="text-[10px] text-[var(--text-dim)] uppercase tracking-[0.2em] font-bold">{stat.label}</div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Revenue Multi-Analysis - Glassmorphic Panel */}
                    <motion.div variants={itemVariants} className="lg:col-span-2 flex flex-col gap-6">
                        <div className="bg-[#0f0728]/60 border border-[var(--primary)]/20 rounded-[32px] p-8 backdrop-blur-xl shadow-2xl relative overflow-hidden">
                            {/* Decorative Grid Line */}
                            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[var(--primary)] to-transparent opacity-50" />

                            <div className="flex justify-between items-center mb-6">
                                <div>
                                    <h3 className="text-lg font-bold text-white flex items-center gap-3">
                                        <div className="p-1.5 rounded-lg bg-[var(--primary)]/10">
                                            <TrendingUp className="w-5 h-5 text-[#7c3aed]" />
                                        </div>
                                        Platform Revenue Trends
                                    </h3>
                                    <p className="text-[10px] text-[var(--text-dim)] mt-1 ml-1">Cross-Institute consolidated recurring revenue (INR In Millions)</p>
                                </div>
                                <div className="flex gap-2 bg-black/20 p-1 rounded-xl border border-white/5">
                                    {['7D', '1M', '1Y'].map(t => (
                                        <button key={t} className={`px-4 py-1.5 rounded-lg text-[10px] font-bold transition-all ${t === '1M' ? 'bg-[#7c3aed] text-white shadow-lg' : 'text-[var(--text-dim)] hover:text-white'}`}>
                                            {t}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="h-[280px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={REVENUE_DATA}>
                                        <defs>
                                            <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.4} />
                                                <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                                        <XAxis dataKey="name" stroke="#64748b" axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 500 }} dy={10} />
                                        <YAxis stroke="#64748b" axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 500 }} tickFormatter={(val) => `₹${val}M`} dx={-10} />
                                        <Tooltip
                                            contentStyle={{ backgroundColor: '#030014', border: '1px solid #7c3aed', borderRadius: '12px', boxShadow: '0 0 20px rgba(124,58,237,0.2)' }}
                                            itemStyle={{ color: '#fff' }}
                                        />
                                        <Area
                                            type="monotone"
                                            dataKey="revenue"
                                            stroke="#7c3aed"
                                            strokeWidth={4}
                                            fillOpacity={1}
                                            fill="url(#colorRev)"
                                            animationDuration={2000}
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Module Grid Access - New Premium CSS Implementation */}
                        <div className={styles.moduleGrid}>
                            {[
                                { label: "Academic Management", icon: LayoutDashboard, hex: "#7c3aed", href: "/admin/super/academics" },
                                { label: "LMS & Online Classes", icon: Video, hex: "#06b6d4", href: "/admin/super/courses" },
                                { label: "Placement System", icon: Briefcase, hex: "#d946ef", href: "/admin/super/placements" },
                                { label: "Online Exam Engine", icon: GraduationCap, hex: "#f59e0b", href: "/admin/super/exams" },
                                { label: "Business & Employees", icon: Globe, hex: "#3b82f6", href: "/admin/super/business" },
                                { label: "Finance & Payroll", icon: Wallet, hex: "#10b981", href: "/admin/super/finance" },
                                { label: "Analytics & Reports", icon: PieChart, hex: "#f97316", href: "/admin/super/reports" },
                                { label: "Platform Settings", icon: Settings, hex: "#94a3b8", href: "/admin/super/settings" },
                            ].map((module, i) => (
                                <Link key={i} href={module.href} style={{ textDecoration: 'none' }}>
                                    <motion.div
                                        className={styles.moduleCard}
                                        style={{
                                            '--glow-color': module.hex,
                                            '--icon-color': module.hex
                                        } as React.CSSProperties}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.05 }}
                                    >
                                        <div className={styles.moduleIconBox}>
                                            <module.icon className={styles.moduleIcon} strokeWidth={1.5} />
                                        </div>
                                        <span className={styles.moduleLabel}>
                                            {module.label}
                                        </span>
                                    </motion.div>
                                </Link>
                            ))}
                        </div>
                    </motion.div>

                    {/* Left Sidebar: Realtime Infrastructure & Audit */}
                    <div className="flex flex-col gap-6">
                        {/* Platform Nodes Health - Futuristic Panel */}
                        <motion.div variants={itemVariants} className="bg-[#0f0728]/60 border border-cyan-500/20 rounded-[32px] p-8 backdrop-blur-md relative">
                            <div className="absolute top-0 right-0 w-20 h-20 bg-cyan-500/10 rounded-bl-[32px] flex items-center justify-center">
                                <Activity className="w-6 h-6 text-[#22d3ee] animate-pulse" />
                            </div>

                            <h3 className="text-lg font-bold text-white mb-6">Infrastructure Status</h3>

                            <div className="space-y-4">
                                {PLATFORM_HEALTH.map((node, i) => (
                                    <div key={i} className="group flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-cyan-500/30 transition-colors">
                                        <div className="flex items-center gap-4">
                                            <div className="relative">
                                                <div className={`w-3 h-3 rounded-full ${node.status === 'Healthy' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                                                <div className={`absolute inset-0 rounded-full animate-ping ${node.status === 'Healthy' ? 'bg-emerald-500' : 'bg-amber-500'} opacity-75`} />
                                            </div>
                                            <div>
                                                <div className="text-sm font-bold text-white group-hover:text-cyan-400 transition-colors">{node.label}</div>
                                                <div className="text-[10px] text-[var(--text-dim)] font-mono flex items-center gap-1">
                                                    <Zap className="w-3 h-3" /> {node.latency} latency
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-xs font-bold text-white font-mono">{node.uptime}</div>
                                            <div className="text-[8px] text-[var(--text-dim)] uppercase tracking-wide">Uptime</div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-8 pt-8 border-t border-white/5 grid grid-cols-2 gap-4">
                                <div className="p-4 rounded-2xl bg-black/20 border border-white/5 text-center relative overflow-hidden">
                                    <div className="absolute inset-x-0 bottom-0 h-1 bg-[#22d3ee]" />
                                    <div className="text-[10px] text-[var(--text-dim)] uppercase font-bold mb-1">CPU Load</div>
                                    <div className="text-xl font-bold text-[#22d3ee] font-display">24.8%</div>
                                </div>
                                <div className="p-4 rounded-2xl bg-black/20 border border-white/5 text-center relative overflow-hidden">
                                    <div className="absolute inset-x-0 bottom-0 h-1 bg-[#d946ef]" />
                                    <div className="text-[10px] text-[var(--text-dim)] uppercase font-bold mb-1">RAM Cache</div>
                                    <div className="text-xl font-bold text-[#d946ef] font-display">12.4 GB</div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Recent Governance Audit - Security Panel */}
                        <motion.div variants={itemVariants} className="bg-[#0f0728]/60 border border-fuchsia-500/20 rounded-[32px] p-8 backdrop-blur-md">
                            <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
                                <div className="p-1.5 rounded-lg bg-emerald-500/10">
                                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                                </div>
                                Security Audit
                            </h3>
                            <div className="space-y-4">
                                {[
                                    { act: "Security Patch 4.2", by: "SysAdmin", time: "12m ago", status: "success" },
                                    { act: "New Institute Added", by: "SuperAdmin", time: "4h ago", status: "info" },
                                    { act: "DB Migration Successful", by: "Automator", time: "1d ago", status: "warning" },
                                ].map((log, i) => (
                                    <div key={i} className="flex items-start justify-between p-3 rounded-xl hover:bg-white/5 transition-colors cursor-default">
                                        <div className="flex gap-3">
                                            <div className={`mt-1 w-1.5 h-1.5 rounded-full ${log.status === 'success' ? 'bg-emerald-500' : log.status === 'warning' ? 'bg-amber-500' : 'bg-blue-500'}`} />
                                            <div>
                                                <div className="text-xs font-bold text-white">{log.act}</div>
                                                <div className="text-[10px] text-[var(--text-dim)]">by {log.by}</div>
                                            </div>
                                        </div>
                                        <span className="text-[9px] font-mono text-[var(--text-dim)] bg-white/5 px-2 py-0.5 rounded-md">{log.time}</span>
                                    </div>
                                ))}
                            </div>
                            <button className="w-full mt-8 py-4 bg-[rgba(255,255,255,0.03)] border border-white/5 text-white text-[10px] font-bold uppercase tracking-[0.2em] rounded-xl hover:bg-white/10 hover:border-fuchsia-500/30 transition-all flex items-center justify-center gap-2 group">
                                <FileText className="w-4 h-4 group-hover:text-fuchsia-400 transition-colors" />
                                Access Audit Vault
                            </button>
                        </motion.div>
                    </div>
                </div>
            </motion.div>
        </DashboardLayout>
    );
}
