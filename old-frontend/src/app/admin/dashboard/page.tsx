"use client";

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import api from '@/lib/api';
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

interface Stat {
    label: string;
    value: string;
    trend: string;
    icon: any;
    color: string;
    subtext: string;
}

interface LiveSession {
    id: string;
    title: string;
    mentorName: string;
    courseId: string;
    startTime: string;
    meetingLink: string;
    status: string;
}

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
    const [liveSessions, setLiveSessions] = useState<LiveSession[]>([]);
    const [stats, setStats] = useState<Stat[]>(STATS);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                // Fetch Live Sessions
                const sessionsRes = await api.get('academic/sessions');
                setLiveSessions(sessionsRes.data);

                // Fetch Courses to update stats
                const coursesRes = await api.get('courses');
                const courseCount = (coursesRes.data || []).length;

                const updatedStats = [...STATS];
                updatedStats[0] = { ...updatedStats[0], value: courseCount.toString() };
                setStats(updatedStats);

                setLoading(false);
            } catch (err) {
                console.error("Error fetching dashboard data:", err);
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    return (
        <DashboardLayout role="admin">
            <div className="space-y-8 pb-12">
                {/* Header with Glassmorphism */}
                <div className="relative p-6 rounded-2xl bg-[#0b0b1a] border border-white/5 overflow-hidden group">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 blur-[80px] -mr-32 -mt-32 rounded-full" />

                    <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
                        <div className="flex items-center gap-5">
                            <div className="w-14 h-14 bg-blue-600/10 rounded-xl border border-blue-500/20 flex items-center justify-center shadow-lg shadow-blue-500/5">
                                <Activity className="w-8 h-8 text-blue-400" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-[Rajdhani] font-black text-white tracking-[0.05em] uppercase leading-tight">
                                    Institute <span className="text-blue-400">Operations Hub</span>
                                </h1>
                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2 mt-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                    Real-time Administrative Control • v4.0.2
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-6">
                            <div className="flex -space-x-2">
                                {[1, 2, 3].map((i: number) => (
                                    <div key={i} className="w-8 h-8 rounded-lg border border-[#030014] bg-slate-800 flex items-center justify-center text-[8px] font-black text-white uppercase tracking-tighter">
                                        ADM
                                    </div>
                                ))}
                            </div>
                            <button className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-lg shadow-lg shadow-blue-500/20 hover:bg-blue-500 transition-all group">
                                <Plus size={14} /> NEW SESSION
                            </button>
                        </div>
                    </div>
                </div>

                {/* Advanced Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {stats.map((stat: Stat, idx: number) => (
                        <motion.div
                            key={idx}
                            whileHover={{ y: -4 }}
                            className="p-4 bg-[#0b0b1a] border border-white/5 rounded-xl relative overflow-hidden group cursor-pointer"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-2 rounded-lg bg-white/5 border border-white/10 group-hover:border-white/20 transition-colors">
                                    <stat.icon size={16} style={{ color: stat.color }} />
                                </div>
                                <span className="text-[8px] font-black text-emerald-400 bg-emerald-400/5 border border-emerald-400/10 px-2 py-0.5 rounded-full uppercase tracking-widest">
                                    {stat.trend}
                                </span>
                            </div>

                            <div className="space-y-0.5">
                                <h3 className="text-2xl font-black text-white font-[Rajdhani] uppercase-tracking-tight">{stat.value}</h3>
                                <p className="text-[8px] font-black text-slate-500 uppercase tracking-[0.2em]">{stat.label}</p>
                            </div>

                            <div className="mt-4 pt-3 border-t border-white/5 flex items-center gap-2 text-[7px] font-black text-slate-600 uppercase tracking-widest">
                                <div className={`w-1.5 h-1.5 rounded-full`} style={{ backgroundColor: stat.color }} />
                                {stat.subtext}
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Live academic pulse */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-[#0b0b1a] border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
                            <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/5">
                                <h3 className="text-sm font-black text-white flex items-center gap-3 uppercase tracking-widest font-[Rajdhani]">
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_10px_#10b981]" />
                                    Academic Activity Stream
                                </h3>
                                <div className="text-[9px] font-black text-blue-400 uppercase tracking-widest bg-blue-400/5 px-3 py-1 rounded-full border border-blue-400/20">
                                    {liveSessions.length} LIVE SESSIONS
                                </div>
                            </div>

                            <div className="p-6 space-y-3">
                                {loading ? (
                                    <div className="text-center py-10 text-slate-700 font-black uppercase tracking-widest text-[10px]">Synchronizing...</div>
                                ) : liveSessions.length > 0 ? (
                                    liveSessions.map((session: LiveSession, i: number) => (
                                        <motion.div
                                            key={session.id || i}
                                            whileHover={{ x: 4 }}
                                            className="p-4 rounded-xl bg-white/5 border border-white/5 hover:border-blue-500/30 transition-all group flex items-center justify-between gap-4"
                                        >
                                            <div className="flex items-center gap-4 flex-1 min-w-0">
                                                <div className="w-12 h-12 rounded-xl bg-blue-600/10 border border-blue-500/20 flex flex-col items-center justify-center font-[Rajdhani] shadow-inner shrink-0">
                                                    <span className="text-[14px] font-black text-white">{new Date(session.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                                </div>
                                                <div className="min-w-0">
                                                    <div className="text-[13px] font-bold text-white group-hover:text-blue-400 transition-colors uppercase tracking-tight truncate">{session.title}</div>
                                                    <div className="flex items-center gap-3 text-[8px] text-slate-500 mt-1 uppercase font-black tracking-[0.15em]">
                                                        <span className="flex items-center gap-1 text-slate-400"><Users size={10} /> {session.mentorName}</span>
                                                        <span className="px-2 py-0.5 bg-white/5 rounded text-blue-300 border border-white/5">{session.status}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex gap-2 shrink-0">
                                                {session.meetingLink && (
                                                    <a href={session.meetingLink} target="_blank" className="px-4 py-2 bg-blue-600 text-white text-[9px] font-black uppercase tracking-widest rounded-lg shadow-lg shadow-blue-500/10 hover:bg-blue-500 transition-all">JOIN</a>
                                                )}
                                                <button className="px-4 py-2 bg-white/5 border border-white/5 text-[9px] font-black text-slate-500 uppercase tracking-widest rounded-lg hover:text-white transition-all">MOD</button>
                                            </div>
                                        </motion.div>
                                    ))
                                ) : (
                                    <div className="text-center py-10 text-slate-700 font-black uppercase tracking-widest text-[10px] border-2 border-dashed border-white/5 rounded-2xl">No active channels</div>
                                )}
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
                                    {TASKS.map((task: { task: string; priority: string; due: string; category: string }, i: number) => (
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
                                ].map((item: { label: string; val: number; tot: number; color: string }, i: number) => (
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
                                ].map((alert: { msg: string; tag: string }, i: number) => (
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
                                ].map((report: { name: string; date: string; icon: any }, i: number) => (
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
        </DashboardLayout >
    );
}
