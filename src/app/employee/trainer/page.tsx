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
    Search
} from 'lucide-react';

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
            <div className="flex flex-col gap-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-[Rajdhani] font-bold text-white tracking-widest uppercase">
                            Trainer <span className="text-[#7c3aed]">Command Center</span>
                        </h1>
                        <p className="text-[var(--text-dim)]">Manage your batches, sessions, and academic assets.</p>
                    </div>
                </div>

                {/* Trainer Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                        { label: "Assigned Batches", value: "08", trend: "02 Today", icon: BookOpen, color: "text-[#7c3aed]" },
                        { label: "Active Students", value: "342", trend: "+12 New", icon: Users, color: "text-[#22d3ee]" },
                        { label: "Avg. Attendance", value: "92%", trend: "Good", icon: CheckCircle2, color: "text-emerald-400" },
                        { label: "Completed Tests", value: "15", trend: "+3 Pending", icon: FileText, color: "text-[#d946ef]" },
                    ].map((stat, idx) => (
                        <div key={idx} className="bg-[rgba(19,10,48,0.5)] border border-[rgba(124,58,237,0.1)] rounded-2xl p-6 backdrop-blur-md relative group overflow-hidden">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-xs font-bold text-[var(--text-dim)] uppercase tracking-wider">{stat.label}</span>
                                <stat.icon className={`w-5 h-5 ${stat.color}`} />
                            </div>
                            <div className="text-3xl font-bold text-white font-[Rajdhani]">{stat.value}</div>
                            <div className="text-[10px] text-emerald-400 font-bold mt-1">{stat.trend}</div>
                            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-[#7c3aed] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Live Sessions & Batch Tracking */}
                    <div className="lg:col-span-2 flex flex-col gap-6">
                        <div className="bg-[rgba(19,10,48,0.5)] border border-[rgba(124,58,237,0.1)] rounded-2xl overflow-hidden backdrop-blur-md shadow-2xl">
                            <div className="p-6 border-b border-[rgba(255,255,255,0.05)] flex justify-between items-center bg-[rgba(255,255,255,0.02)]">
                                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                    <Video className="w-5 h-5 text-red-500" />
                                    Today's Live Sessions
                                </h3>
                                <button className="p-2 hover:bg-white/5 rounded-lg transition-all"><Search className="w-4 h-4 text-[var(--text-dim)]" /></button>
                            </div>
                            <div className="p-6 space-y-4">
                                {BATCHES.map((batch, i) => (
                                    <div key={i} className="group relative p-4 rounded-xl bg-white/5 border border-white/5 hover:border-[#7c3aed] transition-all flex flex-col md:flex-row justify-between items-center gap-6">
                                        <div className="flex items-center gap-5 w-full md:w-auto">
                                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#7c3aed]/20 to-[#d946ef]/20 flex items-center justify-center border border-white/10">
                                                <span className="text-lg font-bold text-white">{batch.time.split(':')[0]}</span>
                                            </div>
                                            <div>
                                                <div className="font-bold text-white group-hover:text-[#22d3ee] transition-colors">{batch.name}</div>
                                                <div className="text-xs text-[var(--text-dim)]">{batch.topic}</div>
                                            </div>
                                        </div>

                                        <div className="flex-1 w-full md:w-auto px-4">
                                            <div className="flex justify-between text-[10px] font-bold text-[var(--text-dim)] mb-1 uppercase">Course Progress: {batch.progress}%</div>
                                            <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                                                <div className="h-full bg-[#7c3aed]" style={{ width: `${batch.progress}%` }} />
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4">
                                            <div className="text-right hidden md:block">
                                                <div className="text-xs font-bold text-white">{batch.students} Students</div>
                                                <div className="text-[10px] text-emerald-400">Online: 90%</div>
                                            </div>
                                            <button className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg text-xs font-bold shadow-[0_0_15px_rgba(239,68,68,0.3)] hover:scale-105 transition-all">
                                                <Play className="w-3 h-3 fill-current" /> Start Session
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Quick Assessment Creation */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-gradient-to-br from-[#130a30] to-[#0f0728] border border-[rgba(124,58,237,0.2)] rounded-2xl p-6 relative overflow-hidden group hover:border-[#7c3aed] transition-all cursor-pointer">
                                <Plus className="absolute top-4 right-4 text-[#7c3aed] w-8 h-8 opacity-20 group-hover:opacity-100 transition-opacity" />
                                <div className="p-3 w-12 h-12 rounded-xl bg-[#7c3aed]/10 flex items-center justify-center mb-4 border border-[#7c3aed]/20">
                                    <FileText className="w-6 h-6 text-[#7c3aed]" />
                                </div>
                                <h3 className="text-lg font-bold text-white mb-2">Create New Test</h3>
                                <p className="text-xs text-[var(--text-dim)] leading-relaxed">Design Aptitude, Technical or MCQ based assessments for your batches.</p>
                            </div>
                            <div className="bg-gradient-to-br from-[#130a30] to-[#0f0728] border border-[rgba(34,211,238,0.2)] rounded-2xl p-6 relative overflow-hidden group hover:border-[#22d3ee] transition-all cursor-pointer">
                                <Plus className="absolute top-4 right-4 text-[#22d3ee] w-8 h-8 opacity-20 group-hover:opacity-100 transition-opacity" />
                                <div className="p-3 w-12 h-12 rounded-xl bg-[#22d3ee]/10 flex items-center justify-center mb-4 border border-[#22d3ee]/20">
                                    <BookOpen className="w-6 h-6 text-[#22d3ee]" />
                                </div>
                                <h3 className="text-lg font-bold text-white mb-2">Upload LMS Content</h3>
                                <p className="text-xs text-[var(--text-dim)] leading-relaxed">Upload session recordings, notes, or lab materials for student access.</p>
                            </div>
                        </div>
                    </div>

                    {/* Performance & Tracking */}
                    <div className="flex flex-col gap-6">
                        {/* Student Submissions */}
                        <div className="bg-[rgba(19,10,48,0.5)] border border-[rgba(124,58,237,0.1)] rounded-2xl p-6 backdrop-blur-md">
                            <h3 className="text-lg font-bold text-white mb-6 uppercase tracking-widest flex items-center gap-2">
                                <BarChart3 className="w-5 h-5 text-[#d946ef]" />
                                Grade Queue
                            </h3>
                            <div className="space-y-4">
                                {RECENT_SUBMISSIONS.map((sub, i) => (
                                    <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-all">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-[#7c3aed]/20 flex items-center justify-center text-[10px] font-bold text-white">
                                                {sub.student.split(' ').map(n => n[0]).join('')}
                                            </div>
                                            <div>
                                                <div className="text-sm font-bold text-white">{sub.student}</div>
                                                <div className="text-[10px] text-[var(--text-dim)]">{sub.assignment}</div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className={`text-[10px] font-bold ${sub.status === 'Pending' ? 'text-amber-500' : 'text-emerald-400'}`}>
                                                {sub.status}
                                            </div>
                                            <div className="text-[8px] text-[var(--text-dim)]">{sub.time}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <button className="w-full mt-6 py-2 bg-[#7c3aed]/10 text-[#7c3aed] text-xs font-bold rounded-lg border border-[#7c3aed]/20 hover:bg-[#7c3aed] hover:text-white transition-all">
                                Go to Grading Hub
                            </button>
                        </div>

                        {/* Weekly Activity */}
                        <div className="bg-[rgba(19,10,48,0.5)] border border-[rgba(34,211,238,0.1)] rounded-2xl p-6 backdrop-blur-md">
                            <h3 className="text-lg font-bold text-white mb-4">Teaching Efficiency</h3>
                            <div className="space-y-5">
                                {[
                                    { label: "Hours Delivered", value: "32/40", color: "#7c3aed", pct: 80 },
                                    { label: "Response Rate", value: "98%", color: "#22d3ee", pct: 98 },
                                    { label: "Content Quality", value: "4.8/5", color: "emerald-400", pct: 95 },
                                ].map((m, i) => (
                                    <div key={i}>
                                        <div className="flex justify-between text-[10px] font-bold text-[var(--text-dim)] mb-1 uppercase">
                                            {m.label} <span className="text-white">{m.value}</span>
                                        </div>
                                        <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                                            <div className="h-full" style={{ width: `${m.pct}%`, background: m.color }} />
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-8 p-4 rounded-xl bg-white/5 border border-white/5">
                                <div className="flex items-center gap-3 mb-2">
                                    <Clock className="w-4 h-4 text-[#22d3ee]" />
                                    <span className="text-xs font-bold text-white">Next Task</span>
                                </div>
                                <p className="text-[10px] text-[var(--text-dim)]">Review Full Stack Java Capstone projects for Batch #22 by tomorrow morning.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
