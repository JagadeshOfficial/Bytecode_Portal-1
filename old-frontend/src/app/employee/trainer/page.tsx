"use client";

import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { motion } from 'framer-motion';
import {
    Users,
    Calendar,
    BookOpen,
    Video,
    CheckCircle2,
    Clock,
    FileText,
    BarChart3,
    Play,
    Plus,
    MoreVertical,
    ArrowUpRight,
    Search,
    Zap,
    TrendingUp,
    Target,
    Activity
} from 'lucide-react';
import Link from 'next/link';

const BATCHES = [
    { name: "Full Stack Java #22", students: 45, time: "10:00 AM", progress: 65, topic: "Spring Boot Microservices" },
    { name: "Python AI/ML #08", students: 32, time: "02:00 PM", progress: 40, topic: "Neural Networks" },
    { name: "React FE #15", students: 58, time: "04:30 PM", progress: 85, topic: "Redux Toolkit" },
];

const RECENT_SUBMISSIONS = [
    { student: "Rahul Sharma", assignment: "Auth API Implementation", status: "Pending", time: "2h ago" },
    { student: "Priya Das", assignment: "React Router Lab", status: "Evaluated", time: "5h ago" },
    { student: "Aman Verma", assignment: "SQL Joins Task", status: "Pending", time: "Today" },
];

export default function TrainerDashboard() {
    return (
        <DashboardLayout role="trainer">
            <div className="flex flex-col gap-8 pb-10">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                        <h1 className="text-4xl font-[Rajdhani] font-bold text-white tracking-widest uppercase">
                            Trainer <span className="text-[#7c3aed]">Command Center</span>
                        </h1>
                        <p className="text-slate-400 font-medium mt-1">Operational overview for batch management, student performance, and technical assets.</p>
                    </div>
                </div>

                {/* KPI Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                        { label: "Active Batches", value: "08", sub: "02 Live Now", icon: Zap, color: "text-[#7c3aed]", bg: "bg-[#7c3aed]/10" },
                        { label: "Avg. Attendance", value: "92%", sub: "Above Target", icon: UserCheck, color: "text-[#22d3ee]", bg: "bg-[#22d3ee]/10" },
                        { label: "Pending Evals", value: "24", sub: "Required Today", icon: FileText, color: "text-[#d946ef]", bg: "bg-[#d946ef]/10" },
                        { label: "Success Rate", value: "88%", sub: "Placement Ready", icon: Target, color: "text-emerald-400", bg: "bg-emerald-400/10" },
                    ].map((stat, idx) => (
                        <div key={idx} className={`${stat.bg} border border-white/5 rounded-3xl p-6 backdrop-blur-md relative group overflow-hidden hover:border-white/20 transition-all`}>
                            <div className="flex justify-between items-center mb-4">
                                <div className={`p-2.5 rounded-xl bg-[#0a0a1a]/60 border border-white/10 ${stat.color}`}>
                                    <stat.icon size={20} />
                                </div>
                                <ArrowUpRight className="text-slate-600 group-hover:text-white transition-colors" size={16} />
                            </div>
                            <div className="text-3xl font-black text-white font-[Rajdhani] tracking-tight">{stat.value}</div>
                            <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">{stat.label}</div>
                            <div className={`mt-3 text-[9px] font-black uppercase tracking-tighter ${stat.color}`}>{stat.sub}</div>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Feed: Today's Classes */}
                    <div className="lg:col-span-2 flex flex-col gap-8">
                        <div className="bg-[#0a0a1a]/60 border border-white/5 rounded-[2.5rem] p-8 backdrop-blur-xl relative overflow-hidden">
                            <div className="flex justify-between items-center mb-8 relative z-10">
                                <div>
                                    <h3 className="text-2xl font-black text-white uppercase tracking-tight">Today's Live Sessions</h3>
                                    <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Management queue for active streaming</p>
                                </div>
                                <Link href="/employee/trainer/sessions">
                                    <button className="px-5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black text-slate-400 hover:text-white transition-all uppercase tracking-widest">VIEW SCHEDULE</button>
                                </Link>
                            </div>

                            <div className="space-y-6 relative z-10">
                                {BATCHES.map((batch, i) => (
                                    <div key={i} className="p-6 rounded-[2rem] bg-white/[0.02] border border-white/5 hover:border-[#7c3aed]/40 transition-all group flex flex-col md:flex-row md:items-center justify-between gap-8">
                                        <div className="flex items-center gap-6">
                                            <div className="w-14 h-14 rounded-2xl bg-[#0a0a1a] border border-white/10 text-[#7c3aed] flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                                                <Video size={24} />
                                            </div>
                                            <div>
                                                <h4 className="text-lg font-black text-white uppercase tracking-tight group-hover:text-[#22d3ee] transition-colors">{batch.name}</h4>
                                                <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">{batch.topic} • {batch.time}</div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-6">
                                            <div className="text-right hidden md:block">
                                                <div className="text-xs font-bold text-white uppercase">{batch.students} Students</div>
                                                <div className="text-[9px] text-emerald-400 font-black uppercase mt-0.5">92% Engagement</div>
                                            </div>
                                            <button className="flex items-center gap-2 px-8 py-3 bg-red-600 hover:bg-red-500 text-white rounded-[1rem] text-[10px] font-black shadow-xl shadow-red-500/20 hover:scale-105 transition-all uppercase tracking-widest">
                                                <Play size={14} fill="currentColor" /> START CLASS
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Quick Access Modules */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Link href="/employee/trainer/lms" className="p-8 bg-gradient-to-br from-[#130a30] to-[#0a0a1a] border border-amber-500/10 rounded-[2.5rem] group hover:border-amber-500/40 transition-all flex items-center justify-between">
                                <div>
                                    <h4 className="text-xl font-black text-white uppercase tracking-tight mb-1">Asset Vault</h4>
                                    <p className="text-[10px] text-slate-500 font-medium uppercase tracking-widest">Update Curriculum & Notes</p>
                                </div>
                                <div className="p-4 bg-amber-500/10 rounded-2xl text-amber-500 group-hover:scale-110 transition-transform"><BookOpen size={28} /></div>
                            </Link>
                            <Link href="/employee/trainer/assessments" className="p-8 bg-gradient-to-br from-[#130a30] to-[#0a0a1a] border border-[#d946ef]/10 rounded-[2.5rem] group hover:border-[#d946ef]/40 transition-all flex items-center justify-between">
                                <div>
                                    <h4 className="text-xl font-black text-white uppercase tracking-tight mb-1">Assessment Hub</h4>
                                    <p className="text-[10px] text-slate-500 font-medium uppercase tracking-widest">Create Tests & Evaluations</p>
                                </div>
                                <div className="p-4 bg-[#d946ef]/10 rounded-2xl text-[#d946ef] group-hover:scale-110 transition-transform"><CheckCircle2 size={28} /></div>
                            </Link>
                        </div>
                    </div>

                    {/* Sidebar High-Level Performance */}
                    <div className="flex flex-col gap-8">
                        <div className="bg-[#0a0a1a]/60 border border-white/5 rounded-[2.5rem] p-8 backdrop-blur-xl">
                            <h3 className="text-xl font-bold text-white mb-8 flex items-center gap-3 uppercase tracking-tight">
                                <Activity className="text-[#22d3ee]" size={24} />
                                Student Pulse
                            </h3>
                            <div className="space-y-6">
                                {RECENT_SUBMISSIONS.map((sub, i) => (
                                    <div key={i} className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-between group hover:border-[#7c3aed]/40 transition-all">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#7c3aed]/20 to-[#22d3ee]/20 flex items-center justify-center text-[10px] font-black text-white group-hover:scale-110 transition-transform uppercase">
                                                {sub.student.split(' ').map(n => n[0]).join('')}
                                            </div>
                                            <div>
                                                <div className="text-sm font-bold text-white group-hover:text-[#22d3ee] transition-colors truncate w-24 md:w-auto uppercase tracking-tight">{sub.student}</div>
                                                <div className="text-[9px] text-slate-600 font-bold uppercase mt-1 truncate w-24 md:w-auto">{sub.assignment}</div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className={`text-[9px] font-black uppercase tracking-widest ${sub.status === 'Pending' ? 'text-amber-500' : 'text-emerald-400'}`}>{sub.status}</div>
                                            <div className="text-[8px] text-slate-700 font-bold uppercase mt-1">{sub.time}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <Link href="/employee/trainer/tracking">
                                <button className="w-full mt-10 py-5 bg-[#7c3aed]/10 border border-[#7c3aed]/20 rounded-2xl text-[10px] font-black text-[#7c3aed] hover:bg-[#7c3aed] hover:text-white transition-all uppercase tracking-[0.2em] shadow-xl">STUDENT TRACKER HUB</button>
                            </Link>
                        </div>

                        {/* Teaching Efficiency Breakdown */}
                        <div className="bg-[#0a0a1a]/60 border border-white/5 rounded-[2.5rem] p-8 backdrop-blur-xl">
                            <h3 className="text-xl font-bold text-white mb-8 uppercase tracking-tight">Batch Health</h3>
                            <div className="space-y-8">
                                {[
                                    { label: "Attendance avg.", val: 92, color: "bg-[#22d3ee]" },
                                    { label: "Assignment Completion", val: 68, color: "bg-[#7c3aed]" },
                                    { label: "Topic Progression", val: 75, color: "bg-emerald-400" },
                                ].map((health, i) => (
                                    <div key={i} className="space-y-3">
                                        <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                                            <span className="text-slate-400">{health.label}</span>
                                            <span className="text-white">{health.val}%</span>
                                        </div>
                                        <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${health.val}%` }}
                                                className={`h-full ${health.color}`}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Pro-Tips / Alerts */}
                        <div className="p-8 bg-gradient-to-br from-[#130a30] to-[#0a0a1a] border border-white/5 rounded-[2.5rem] relative overflow-hidden group">
                            <div className="flex items-center gap-4 mb-4 relative z-10">
                                <div className="p-3 bg-blue-500/10 rounded-xl text-blue-400"><Clock size={20} /></div>
                                <h4 className="text-sm font-black text-white uppercase tracking-tight">Priority Check</h4>
                            </div>
                            <p className="text-[11px] text-slate-500 font-medium leading-relaxed relative z-10">Batch #22 has shown a 15% drop in lab submissions. Recommended intervention: Revision session on Microservices Security.</p>
                            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #7c3aed 1px, transparent 1px)', backgroundSize: '16px 16px' }} />
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}

import { UserCheck } from 'lucide-react';
