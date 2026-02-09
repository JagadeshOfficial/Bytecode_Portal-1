"use client";

import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { motion } from 'framer-motion';
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
    Activity
} from 'lucide-react';

const TODAY_SESSIONS = [
    { title: "React Advanced", tutor: "Dr. Alan", time: "10:00 AM", batch: "#B22", status: "Live" },
    { title: "Python Basics", tutor: "Prof. Sarah", time: "02:00 PM", batch: "#P08", status: "Scheduled" },
    { title: "System Design", tutor: "Mr. Rajesh", time: "04:30 PM", batch: "#S05", status: "Scheduled" },
];

const RECENT_ENROLLMENTS = [
    { name: "Arjun Mehra", course: "Java Full Stack", date: "Today", fee: "Paid" },
    { name: "Sita Kumari", course: "Data Science", date: "Yesterday", fee: "Pending" },
    { name: "John Wick", course: "Cyber Security", date: "Yesterday", fee: "Paid" },
];

export default function AdminOperationsDashboard() {
    return (
        <DashboardLayout role="admin">
            <div className="flex flex-col gap-8">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-[Rajdhani] font-bold text-white tracking-widest uppercase">
                            Institute <span className="text-[#7c3aed]">Operations Hub</span>
                        </h1>
                        <p className="text-[var(--text-dim)]">Real-time oversight of academic and administrative metrics.</p>
                    </div>
                    <div className="flex gap-4">
                        <button className="p-3 bg-white/5 border border-white/10 rounded-xl text-white hover:bg-white/10 transition-all relative">
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-[#030014]" />
                        </button>
                        <button className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-[#7c3aed] to-[#d946ef] rounded-xl text-white font-bold shadow-lg hover:scale-105 transition-all">
                            <Plus className="w-4 h-4" /> Quick Action
                        </button>
                    </div>
                </div>

                {/* Institute-level Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                        { label: "Active Batches", value: "24", trend: "03 Starting", icon: BookOpen, color: "text-[#7c3aed]" },
                        { label: "Total Students", value: "1,248", trend: "+42 Enrollments", icon: Users, color: "text-[#22d3ee]" },
                        { label: "Fee Collection", value: "₹18.4L", trend: "85% Target", icon: Wallet, color: "text-emerald-400" },
                        { label: "Avg. Performance", value: "72%", trend: "Needs Focus", icon: Activity, color: "text-[#d946ef]" },
                    ].map((stat, idx) => (
                        <div key={idx} className="bg-[rgba(19,10,48,0.5)] border border-[rgba(124,58,237,0.1)] rounded-2xl p-6 backdrop-blur-md relative overflow-hidden group">
                            <div className="flex justify-between items-center mb-4">
                                <stat.icon className={`w-6 h-6 ${stat.color}`} />
                                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-full">{stat.trend}</span>
                            </div>
                            <div className="text-3xl font-bold text-white font-[Rajdhani]">{stat.value}</div>
                            <div className="text-xs text-[var(--text-dim)] uppercase tracking-wider font-bold mt-1">{stat.label}</div>
                            <div className="absolute inset-0 bg-gradient-to-br from-[#7c3aed]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Academic & Session Monitoring */}
                    <div className="lg:col-span-2 flex flex-col gap-6">
                        <div className="bg-[rgba(19,10,48,0.5)] border border-[rgba(124,58,237,0.1)] rounded-2xl overflow-hidden shadow-2xl">
                            <div className="p-6 border-b border-[rgba(255,255,255,0.05)] flex justify-between items-center bg-[rgba(255,255,255,0.02)]">
                                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                    <Video className="w-5 h-5 text-[#22d3ee]" />
                                    Academic Schedule Today
                                </h3>
                                <button className="text-[10px] text-[#22d3ee] font-bold uppercase tracking-widest">Manage Schedule</button>
                            </div>
                            <div className="p-4 space-y-3">
                                {TODAY_SESSIONS.map((session, i) => (
                                    <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 hover:border-[#7c3aed]/30 hover:bg-white/[0.08] transition-all">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#130a30] to-[#0f0728] flex flex-col items-center justify-center border border-white/10 font-[Rajdhani]">
                                                <span className="text-[10px] text-[var(--text-dim)]">{session.time.split(' ')[1]}</span>
                                                <span className="text-sm font-bold text-white">{session.time.split(' ')[0]}</span>
                                            </div>
                                            <div>
                                                <div className="font-bold text-white">{session.title}</div>
                                                <div className="text-[10px] text-[var(--text-dim)]">Tutor: {session.tutor} • Batch: {session.batch}</div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            {session.status === 'Live' && (
                                                <div className="flex items-center gap-2 px-3 py-1 bg-red-500/10 border border-red-500/20 rounded-full">
                                                    <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
                                                    <span className="text-[10px] font-bold text-red-500 uppercase">Live</span>
                                                </div>
                                            )}
                                            <button className="p-2 hover:bg-white/10 rounded-lg transition-all">
                                                <TrendingUp className="w-4 h-4 text-[var(--text-dim)]" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Admissions & Finance Overview */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-[rgba(19,10,48,0.5)] border border-[rgba(34,211,238,0.1)] rounded-2xl overflow-hidden">
                                <div className="p-4 border-b border-white/5 bg-white/20">
                                    <h4 className="text-sm font-bold text-white flex items-center gap-2 uppercase tracking-widest">
                                        <Wallet className="w-4 h-4 text-emerald-400" />
                                        Collection Log
                                    </h4>
                                </div>
                                <div className="p-4 space-y-4">
                                    {RECENT_ENROLLMENTS.map((r, i) => (
                                        <div key={i} className="flex justify-between items-center text-xs">
                                            <div>
                                                <div className="font-bold text-white">{r.course}</div>
                                                <div className="text-[var(--text-dim)]">{r.name}</div>
                                            </div>
                                            <span className={`px-2 py-1 rounded text-[10px] font-bold ${r.fee === 'Paid' ? 'text-emerald-400 bg-emerald-400/10' : 'text-amber-500 bg-amber-500/10'}`}>
                                                {r.fee}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="grid grid-rows-2 gap-4">
                                <div className="bg-gradient-to-br from-[#7c3aed]/20 to-transparent border border-[#7c3aed]/30 rounded-2xl p-4 flex items-center gap-4 group cursor-pointer hover:bg-[#7c3aed]/30 transition-all">
                                    <div className="p-3 bg-[#7c3aed]/20 rounded-xl border border-[#7c3aed]/30">
                                        <FileText className="w-6 h-6 text-[#7c3aed]" />
                                    </div>
                                    <div>
                                        <div className="text-sm font-bold text-white">LMS Analytics</div>
                                        <div className="text-[10px] text-[var(--text-dim)]">Track video views & downloads</div>
                                    </div>
                                </div>
                                <div className="bg-gradient-to-br from-[#22d3ee]/20 to-transparent border border-[#22d3ee]/30 rounded-2xl p-4 flex items-center gap-4 group cursor-pointer hover:bg-[#22d3ee]/30 transition-all">
                                    <div className="p-3 bg-[#22d3ee]/20 rounded-xl border border-[#22d3ee]/30">
                                        <GraduationCap className="w-6 h-6 text-[#22d3ee]" />
                                    </div>
                                    <div>
                                        <div className="text-sm font-bold text-white">Assessment Engine</div>
                                        <div className="text-[10px] text-[var(--text-dim)]">Create & Evaluate Tests</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Left Sidebar: Reports & Alerts */}
                    <div className="flex flex-col gap-8">
                        {/* Attendance Snapshot */}
                        <div className="bg-[rgba(19,10,48,0.5)] border border-[rgba(217,70,239,0.1)] rounded-2xl p-6 backdrop-blur-md">
                            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                                <Calendar className="w-5 h-5 text-[#d946ef]" />
                                Staff Attendance
                            </h3>
                            <div className="space-y-5">
                                {[
                                    { label: "Faculty", val: 12, tot: 14, color: "#7c3aed" },
                                    { label: "Admissions", val: 5, tot: 5, color: "#22d3ee" },
                                    { label: "Support", val: 8, tot: 10, color: "#d946ef" },
                                ].map((item, i) => (
                                    <div key={i}>
                                        <div className="flex justify-between text-[10px] font-bold text-[var(--text-dim)] mb-1 uppercase">
                                            {item.label} <span className="text-white">{item.val}/{item.tot}</span>
                                        </div>
                                        <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                                            <div className="h-full" style={{ width: `${(item.val / item.tot) * 100}%`, background: item.color }} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Low Performance Alerts */}
                        <div className="bg-[rgba(19,10,48,0.5)] border border-[rgba(239,68,68,0.1)] rounded-2xl p-6 backdrop-blur-md">
                            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                <Bell className="w-5 h-5 text-red-500" />
                                Critical Alerts
                            </h3>
                            <div className="space-y-4">
                                {[
                                    { msg: "Batch #B22 attendance dropped to 45%", color: "text-red-400" },
                                    { msg: "3 Assessments pending grading for > 48h", color: "text-amber-400" },
                                    { msg: "Subscription for AWS Lab expiring soon", color: "text-blue-400" },
                                ].map((alert, i) => (
                                    <div key={i} className="flex gap-3 text-[11px] leading-relaxed p-2 rounded-lg bg-white/5 border border-white/5">
                                        <div className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${alert.color.replace('text', 'bg')}`} />
                                        <span className={alert.color}>{alert.msg}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Recent Reports */}
                        <div className="bg-gradient-to-br from-[#130a30] to-[#0f0728] border border-[rgba(255,255,255,0.05)] rounded-2xl p-6">
                            <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-widest flex items-center justify-between">
                                Recent Reports
                                <BarChart3 className="w-4 h-4 text-[var(--accent)]" />
                            </h3>
                            <div className="space-y-3">
                                <button className="w-full text-left flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-all">
                                    <FileText className="w-4 h-4 text-[var(--text-dim)]" />
                                    <span className="text-xs text-white">Monthly Revenue.pdf</span>
                                </button>
                                <button className="w-full text-left flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-all">
                                    <FileText className="w-4 h-4 text-[var(--text-dim)]" />
                                    <span className="text-xs text-white">Batch Success Rate.csv</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
