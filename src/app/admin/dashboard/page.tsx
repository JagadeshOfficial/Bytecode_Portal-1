"use client";

import { useState } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Users,
    BookOpen,
    Video,
    Wallet,
    GraduationCap,
    Calendar,
    BarChart3,
    Bell,
    TrendingUp,
    FileText,
    CheckCircle2,
    Clock,
    Plus,
    Activity,
    ChevronRight,
    Search,
    Filter,
    MoreVertical,
    AlertCircle,
    ArrowUpRight,
    CheckCircle
} from 'lucide-react';

const STATS = [
    { label: "Active Batches", value: "24", trend: "+3 this week", icon: BookOpen, color: "#7c3aed", subtext: "03 starting today" },
    { label: "Total Students", value: "1,248", trend: "+12%", icon: GraduationCap, color: "#22d3ee", subtext: "42 new enrollments" },
    { label: "Fee Collection", value: "₹18.4L", trend: "85% of target", icon: Wallet, color: "#10b981", subtext: "₹2.5L pending" },
    { label: "Pending Tasks", value: "12", trend: "05 urgent", icon: CheckCircle2, color: "#f59e0b", subtext: "Assigned to you" },
];

const TODAY_CLASSES = [
    { id: 1, title: "React Advanced Architecture", tutor: "Dr. Alan Smith", time: "10:00 AM", batch: "BATCH-R22", status: "Live", students: 45 },
    { id: 2, title: "Backend Scaling with Go", tutor: "Prof. Sarah Chen", time: "02:00 PM", batch: "GO-B08", status: "Upcoming", students: 32 },
    { id: 3, title: "System Design Masterclass", tutor: "Mr. Rajesh Kumar", time: "04:30 PM", batch: "SYS-P05", status: "Upcoming", students: 50 },
];

const TASKS = [
    { id: 1, task: "Approve Batch R22 Schedule", priority: "High", due: "2h left", category: "Academic" },
    { id: 2, task: "Review Fee Discount for Arjun", priority: "Medium", due: "Today", category: "Finance" },
    { id: 3, task: "Assign Tutor for Java Batch", priority: "High", due: "Tomorrow", category: "Staffing" },
];

export default function AdminOperationsDashboard() {
    const [activeTab, setActiveTab] = useState('overview');

    return (
        <DashboardLayout role="admin">
            <div className="space-y-8 pb-12">
                {/* Header with Glassmorphism */}
                <div className="relative p-8 rounded-3xl bg-gradient-to-br from-violet-600/10 via-transparent to-fuchsia-600/10 border border-white/5 backdrop-blur-xl overflow-hidden group">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-violet-600/10 blur-[100px] -mr-48 -mt-48 rounded-full transition-transform duration-1000 group-hover:scale-110" />
                    <div className="absolute bottom-0 left-0 w-96 h-96 bg-fuchsia-600/10 blur-[100px] -ml-48 -mb-48 rounded-full transition-transform duration-1000 group-hover:scale-110" />

                    <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        <div>
                            <motion.h1
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="text-4xl font-[Rajdhani] font-bold text-white tracking-wider flex items-center gap-3"
                            >
                                <div className="p-2 bg-violet-600 rounded-lg shadow-lg shadow-violet-500/50">
                                    <Activity className="w-8 h-8 text-white" />
                                </div>
                                INSTITUTE <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400 uppercase">Operations Hub</span>
                            </motion.h1>
                            <p className="mt-2 text-slate-400 text-lg flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                Real-time oversight of administrative & academic excellence.
                            </p>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="flex -space-x-3">
                                {[1, 2, 3, 4].map(i => (
                                    <div key={i} className="w-10 h-10 rounded-full border-2 border-[#030014] bg-slate-800 flex items-center justify-center text-[10px] font-bold text-white">
                                        JD
                                    </div>
                                ))}
                                <div className="w-10 h-10 rounded-full border-2 border-[#030014] bg-violet-600 flex items-center justify-center text-[10px] font-bold text-white">
                                    +12
                                </div>
                            </div>
                            <button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-2xl text-white font-bold shadow-xl shadow-violet-500/20 hover:scale-105 transition-all group">
                                <Plus size={20} className="group-hover:rotate-180 transition-transform duration-500" />
                                NEW SESSION
                            </button>
                        </div>
                    </div>
                </div>

                {/* Advanced Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {STATS.map((stat, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            whileHover={{ y: -5 }}
                            className="p-6 bg-[#0a0a1a]/60 border border-white/5 rounded-3xl backdrop-blur-md relative overflow-hidden group cursor-pointer"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/5 to-transparent rounded-bl-full transition-transform duration-500 group-hover:scale-125" />

                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 rounded-2xl bg-white/5 border border-white/10 group-hover:bg-white/10 transition-colors">
                                    <stat.icon size={24} style={{ color: stat.color }} />
                                </div>
                                <div className="flex flex-col items-end">
                                    <span className="text-[10px] font-bold text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-full flex items-center gap-1">
                                        <TrendingUp size={10} /> {stat.trend}
                                    </span>
                                </div>
                            </div>

                            <div className="space-y-1">
                                <h3 className="text-3xl font-bold text-white font-[Rajdhani]">{stat.value}</h3>
                                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">{stat.label}</p>
                                <p className="text-[10px] text-slate-500 mt-2 flex items-center gap-1 italic">
                                    <AlertCircle size={10} /> {stat.subtext}
                                </p>
                            </div>

                            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-violet-500/50 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
                        </motion.div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Live academic pulse */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-[#0a0a1a]/60 border border-white/5 rounded-3xl backdrop-blur-md overflow-hidden shadow-2xl">
                            <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/20">
                                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)]" />
                                    Academic Pulse Today
                                </h3>
                                <div className="flex gap-2 text-[10px] font-bold uppercase tracking-widest">
                                    <button className="text-slate-400 hover:text-white transition-colors">List View</button>
                                    <span className="text-slate-700">|</span>
                                    <button className="text-violet-400 transition-colors">Grid View</button>
                                </div>
                            </div>

                            <div className="p-6 space-y-4">
                                {TODAY_CLASSES.map((session, i) => (
                                    <motion.div
                                        key={session.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.1 }}
                                        className="p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-violet-500/30 hover:bg-white/[0.08] transition-all group flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-600/20 to-fuchsia-600/20 border border-white/10 flex flex-col items-center justify-center font-[Rajdhani] relative shadow-inner">
                                                <span className="text-[10px] text-slate-400 -mb-1">{session.time.split(' ')[1]}</span>
                                                <span className="text-xl font-bold text-white">{session.time.split(' ')[0]}</span>
                                                {session.status === 'Live' && (
                                                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-[#030014] animate-pulse" />
                                                )}
                                            </div>
                                            <div>
                                                <div className="text-lg font-bold text-white group-hover:text-violet-400 transition-colors">{session.title}</div>
                                                <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                                                    <span className="flex items-center gap-1"><Users size={12} /> {session.students} Attending</span>
                                                    <span className="w-1 h-1 bg-slate-700 rounded-full" />
                                                    <span className="flex items-center gap-1 font-bold text-slate-300 underline decoration-violet-500/50 underline-offset-4">{session.tutor}</span>
                                                    <span className="w-1 h-1 bg-slate-700 rounded-full" />
                                                    <span className="px-2 py-0.5 bg-white/5 rounded-md font-mono text-[10px]">{session.batch}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3 w-full md:w-auto">
                                            <button className="flex-1 md:flex-none px-4 py-2 bg-violet-600/10 border border-violet-500/20 rounded-xl text-violet-400 text-xs font-bold hover:bg-violet-600 hover:text-white transition-all">
                                                MODERATE
                                            </button>
                                            <button className="flex-1 md:flex-none px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-slate-300 text-xs font-bold hover:bg-white/10 transition-all">
                                                REPORTS
                                            </button>
                                        </div>
                                    </motion.div>
                                ))}

                                <button className="w-full py-4 border border-dashed border-white/10 rounded-2xl text-slate-500 hover:text-violet-400 hover:border-violet-500/50 hover:bg-violet-500/5 transition-all font-bold text-sm tracking-widest uppercase">
                                    View Full Academic Calendar
                                </button>
                            </div>
                        </div>

                        {/* Middle Row with tasks and collection */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Collection Analytics */}
                            <div className="bg-[#0a0a1a]/60 border border-emerald-500/10 rounded-3xl overflow-hidden backdrop-blur-md">
                                <div className="p-5 border-b border-white/5 bg-emerald-500/5 flex justify-between items-center">
                                    <h4 className="text-sm font-bold text-white flex items-center gap-2 uppercase tracking-widest">
                                        <Wallet className="w-4 h-4 text-emerald-400" />
                                        Fee Revenue Status
                                    </h4>
                                    <span className="text-[10px] text-emerald-400 font-bold">MONTHLY TARGET</span>
                                </div>
                                <div className="p-6">
                                    <div className="flex justify-between items-end mb-4">
                                        <div>
                                            <div className="text-xs text-slate-400">Total Collected</div>
                                            <div className="text-3xl font-bold text-white font-[Rajdhani]">₹18,45,000</div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-[10px] text-slate-500">Remaining</div>
                                            <div className="text-lg font-bold text-emerald-400">₹2.5L</div>
                                        </div>
                                    </div>
                                    <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden mb-6">
                                        <div className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-full" style={{ width: '85%' }} />
                                    </div>
                                    <div className="space-y-3">
                                        {[
                                            { label: "Installments Collected", val: "₹12.4L", icon: CheckCircle },
                                            { label: "New Admissions", val: "₹4.2L", icon: Plus },
                                            { label: "Miscellaneous", val: "₹1.85L", icon: ArrowUpRight },
                                        ].map((item, i) => (
                                            <div key={i} className="flex justify-between items-center p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors cursor-pointer group">
                                                <div className="flex items-center gap-3">
                                                    <item.icon size={14} className="text-emerald-500" />
                                                    <span className="text-xs text-slate-300 group-hover:text-white transition-colors">{item.label}</span>
                                                </div>
                                                <span className="text-xs font-bold text-white">{item.val}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Pending Tasks */}
                            <div className="bg-[#0a0a1a]/60 border border-violet-500/10 rounded-3xl overflow-hidden backdrop-blur-md">
                                <div className="p-5 border-b border-white/5 bg-violet-500/5 flex justify-between items-center">
                                    <h4 className="text-sm font-bold text-white flex items-center gap-2 uppercase tracking-widest">
                                        <CheckCircle2 className="w-4 h-4 text-violet-400" />
                                        Operational Queue
                                    </h4>
                                    <button className="text-[10px] text-violet-400 font-bold hover:underline">NEW TASK</button>
                                </div>
                                <div className="p-6 space-y-3">
                                    {TASKS.map((task, i) => (
                                        <div key={i} className="flex flex-col gap-2 p-3 rounded-2xl bg-white/5 border border-white/5 hover:border-violet-500/30 transition-all cursor-pointer group">
                                            <div className="flex justify-between items-start">
                                                <span className="text-xs font-bold text-white group-hover:text-violet-400 transition-colors">{task.task}</span>
                                                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${task.priority === 'High' ? 'bg-red-500/10 text-red-400' : 'bg-blue-500/10 text-blue-400'
                                                    }`}>{task.priority}</span>
                                            </div>
                                            <div className="flex justify-between items-center text-[10px]">
                                                <span className="text-slate-500 flex items-center gap-1"><Clock size={10} /> {task.due}</span>
                                                <span className="px-2 py-0.5 bg-violet-600/10 text-violet-300 rounded-lg">{task.category}</span>
                                            </div>
                                        </div>
                                    ))}
                                    <button className="w-full flex items-center justify-center gap-2 text-xs text-slate-500 font-bold hover:text-white mt-2 transition-colors">
                                        View Task Manager <ChevronRight size={14} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Alerts & Analytics */}
                    <div className="space-y-8">
                        {/* Attendance Tracker */}
                        <div className="p-6 bg-[#0a0a1a]/60 border border-fuchsia-500/10 rounded-3xl backdrop-blur-md">
                            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                                <Calendar className="w-5 h-5 text-fuchsia-500" />
                                Operations Readiness
                            </h3>
                            <div className="space-y-6">
                                {[
                                    { label: "Faculty Presence", val: 12, tot: 14, color: "#7c3aed" },
                                    { label: "Student Turnout", val: 840, tot: 1248, color: "#22d3ee" },
                                    { label: "Infrastructure Ready", val: 95, tot: 100, color: "#d946ef" },
                                ].map((item, i) => (
                                    <div key={i}>
                                        <div className="flex justify-between text-[10px] font-bold text-slate-400 mb-2 uppercase tracking-widest">
                                            {item.label} <span className="text-white">{Math.round((item.val / item.tot) * 100)}%</span>
                                        </div>
                                        <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${(item.val / item.tot) * 100}%` }}
                                                className="h-full rounded-full"
                                                style={{ background: item.color }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Critical Operations Alerts */}
                        <div className="p-6 bg-red-500/5 border border-red-500/20 rounded-3xl backdrop-blur-md">
                            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                <div className="w-6 h-6 rounded-full bg-red-500/20 flex items-center justify-center">
                                    <Bell className="w-4 h-4 text-red-500 animate-bounce" />
                                </div>
                                Critical Pulse
                            </h3>
                            <div className="space-y-3">
                                {[
                                    { msg: "Batch SYS-P5 attendance dropped below 40%", tag: "Urgent" },
                                    { msg: "Dr. Alan requested schedule change", tag: "Staffing" },
                                    { msg: "AWS Server reaching 90% storage capacity", tag: "IT" },
                                ].map((alert, i) => (
                                    <div key={i} className="p-3 rounded-2xl bg-white/5 border border-white/5 flex flex-col gap-1 items-start group hover:bg-white/10 transition-colors cursor-pointer">
                                        <span className="text-[9px] font-bold uppercase tracking-widest text-red-500">{alert.tag}</span>
                                        <span className="text-[11px] text-slate-300 leading-tight group-hover:text-white transition-colors">{alert.msg}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Summary reports */}
                        <div className="p-6 bg-[#0a0a1a]/60 border border-white/5 rounded-3xl backdrop-blur-md relative overflow-hidden group">
                            <div className="absolute inset-0 bg-gradient-to-br from-violet-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                            <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-widest flex items-center justify-between relative z-10">
                                Global Reports
                                <BarChart3 className="w-4 h-4 text-violet-400" />
                            </h3>
                            <div className="space-y-2 relative z-10">
                                {[
                                    { name: "Executive Summary.pdf", date: "2h ago", icon: FileText },
                                    { name: "Q1 Financial Audit.csv", date: "Yesterday", icon: TrendingUp },
                                    { name: "Student Performance.json", date: "Nov 24", icon: Activity },
                                ].map((report, i) => (
                                    <button key={i} className="w-full text-left flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-all group/btn">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 rounded-lg bg-white/5 text-slate-500 group-hover/btn:text-violet-400 transition-colors">
                                                <report.icon size={14} />
                                            </div>
                                            <div>
                                                <div className="text-xs font-bold text-white">{report.name}</div>
                                                <div className="text-[10px] text-slate-500">{report.date}</div>
                                            </div>
                                        </div>
                                        <ChevronRight size={14} className="text-slate-600 group-hover/btn:text-white translate-x-[-10px] opacity-0 group-hover/btn:translate-x-0 group-hover/btn:opacity-100 transition-all" />
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
