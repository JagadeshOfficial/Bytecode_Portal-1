"use client";

import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { motion } from 'framer-motion';
import {
    BookOpen,
    PlayCircle,
    FileText,
    Award,
    TrendingUp,
    CheckCircle2,
    Clock,
    Zap,
    Rocket,
    BarChart3,
    MoreVertical
} from 'lucide-react';

const ENROLLED_COURSES = [
    { name: "Full Stack Development", progress: 65, status: "Ongoing", color: "#7c3aed" },
    { name: "Cloud Computing", progress: 20, status: "New", color: "#22d3ee" },
];

const UPCOMING_CLASSES = [
    { title: "React Query & State", time: "2:00 PM", tutor: "Dr. Alan", type: "Live" },
    { title: "AWS Deployment Lab", time: "Tomorrow", tutor: "Prof. Sarah", type: "Virtual" },
];

export default function StudentMasterDashboard() {
    return (
        <DashboardLayout role="student">
            <div className="flex flex-col gap-10">
                {/* Greeting Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                        <h1 className="text-4xl font-display font-bold text-white tracking-widest uppercase">
                            Welcome Back, <span className="text-[#22d3ee]">Student</span>
                        </h1>
                        <p className="text-[var(--text-dim)]">Your academic and placement journey is on track.</p>
                    </div>
                </div>

                {/* Top Metrics Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {[
                        { label: "Overall Progress", value: "68%", trend: "On Track", icon: TrendingUp, color: "text-[#7c3aed]" },
                        { label: "Assignments", value: "12/15", trend: "+2 New", icon: FileText, color: "text-[#22d3ee]" },
                        { label: "Placement Score", value: "840", trend: "Top 5%", icon: Rocket, color: "text-emerald-400" },
                        { label: "Attendance", value: "95%", trend: "Excellent", icon: CheckCircle2, color: "text-[#d946ef]" },
                    ].map((stat, idx) => (
                        <div key={idx} className="bg-gradient-to-br from-[rgba(19,10,48,0.8)] to-[#030014] border border-[rgba(124,58,237,0.1)] rounded-3xl p-6 backdrop-blur-3xl relative overflow-hidden group border-b-2">
                            <stat.icon className={`w-8 h-8 ${stat.color} mb-4 group-hover:scale-110 transition-transform`} />
                            <div className="text-3xl font-bold text-white font-display mb-1">{stat.value}</div>
                            <div className="text-xs text-[var(--text-dim)] uppercase tracking-wider font-bold mb-3">{stat.label}</div>
                            <div className="text-[10px] text-emerald-400 font-bold bg-emerald-400/10 px-2 py-0.5 rounded-full inline-block">{stat.trend}</div>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    {/* Primary Learning Area */}
                    <div className="lg:col-span-2 flex flex-col gap-8">
                        <div className="bg-[rgba(19,10,48,0.5)] border border-[rgba(124,58,237,0.1)] rounded-3xl p-8 backdrop-blur-md">
                            <div className="flex justify-between items-center mb-8">
                                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                    <BookOpen className="w-5 h-5 text-[#7c3aed]" />
                                    Active Courses
                                </h3>
                                <button className="text-[10px] text-[#22d3ee] font-bold uppercase tracking-widest hover:underline">View Roadmap</button>
                            </div>
                            <div className="space-y-6">
                                {ENROLLED_COURSES.map((course, i) => (
                                    <div key={i} className="p-6 rounded-2xl bg-white/[0.03] border border-white/[0.05] hover:border-[#7c3aed]/40 transition-all cursor-pointer group">
                                        <div className="flex justify-between items-center mb-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#7c3aed] to-[#d946ef] flex items-center justify-center text-2xl shadow-lg">⚛️</div>
                                                <div>
                                                    <div className="font-bold text-white text-lg group-hover:text-[#22d3ee] transition-colors">{course.name}</div>
                                                    <div className="text-xs text-[var(--text-dim)]">{course.status} • 24 Lessons Left</div>
                                                </div>
                                            </div>
                                            <button className="px-6 py-2 bg-[#7c3aed] text-white rounded-lg text-xs font-bold shadow-[0_0_15px_rgba(124,58,237,0.4)] hover:bg-[#d946ef] transition-all">Resume</button>
                                        </div>
                                        <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                                            <div className="h-full bg-gradient-to-r from-[#7c3aed] to-[#22d3ee]" style={{ width: `${course.progress}%` }} />
                                        </div>
                                        <div className="flex justify-between mt-2 text-[10px] text-[var(--text-dim)] font-bold uppercase letter-spacing-widest">
                                            <span>{course.progress}% Completed</span>
                                            <span>Module 4 of 12</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Quick Access Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            {[
                                { label: "Compiler", icon: Zap, color: "text-amber-400" },
                                { label: "Mock Tests", icon: FileText, color: "text-[#d946ef]" },
                                { label: "Career HQ", icon: Rocket, color: "text-emerald-400" },
                                { label: "LMS Vault", icon: BookOpen, color: "text-[#22d3ee]" },
                            ].map((item, i) => (
                                <button key={i} className="flex flex-col items-center justify-center p-6 bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.05)] rounded-2xl hover:border-[#7c3aed] hover:bg-[#7c3aed]/5 transition-all group">
                                    <item.icon className={`w-6 h-6 ${item.color} mb-3 group-hover:scale-110 transition-transform`} />
                                    <span className="text-[10px] font-bold text-white uppercase tracking-widest">{item.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Secondary Information Bar */}
                    <div className="flex flex-col gap-8">
                        {/* Upcoming Live Sessions */}
                        <div className="bg-[rgba(19,10,48,0.5)] border border-[rgba(34,211,238,0.1)] rounded-3xl p-6 backdrop-blur-md">
                            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                                <PlayCircle className="w-5 h-5 text-[#d946ef]" />
                                Next Up
                            </h3>
                            <div className="space-y-4">
                                {UPCOMING_CLASSES.map((cls, i) => (
                                    <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.03] border border-white/[0.05] group cursor-pointer hover:bg-white/[0.08] transition-all">
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${cls.type === 'Live' ? 'bg-red-500/10 border-red-500/20 text-red-500' : 'bg-blue-500/10 border-blue-500/20 text-blue-500'}`}>
                                            <Video className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <div className="text-sm font-bold text-white group-hover:text-[#22d3ee] transition-colors">{cls.title}</div>
                                            <div className="text-[10px] text-[var(--text-dim)] font-bold">{cls.time} • {cls.tutor}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <button className="w-full mt-6 py-3 border border-[#d946ef]/20 text-[#d946ef] text-[10px] font-bold uppercase rounded-xl hover:bg-[#d946ef] hover:text-white transition-all">View All Sessions</button>
                        </div>

                        {/* Recent Performance Metrics */}
                        <div className="bg-[rgba(19,10,48,0.5)] border border-[rgba(124,58,237,0.1)] rounded-3xl p-6 backdrop-blur-md">
                            <h3 className="text-lg font-bold text-white mb-6 uppercase tracking-widest flex items-center gap-2">
                                <BarChart3 className="w-5 h-5 text-[#7c3aed]" />
                                Performance
                            </h3>
                            <div className="space-y-6">
                                {[
                                    { label: "Aptitude Score", val: 82, color: "#22d3ee" },
                                    { label: "Coding Score", val: 74, color: "#7c3aed" },
                                    { label: "Communication", val: 90, color: "#d946ef" },
                                ].map((item, i) => (
                                    <div key={i}>
                                        <div className="flex justify-between text-[10px] font-bold text-[var(--text-dim)] mb-1 uppercase">
                                            {item.label} <span className="text-white">{item.val}%</span>
                                        </div>
                                        <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                                            <div className="h-full" style={{ width: `${item.val}%`, background: item.color }} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Quick Alerts */}
                        <div className="p-5 bg-gradient-to-br from-[#0c051a] to-[#030014] border border-[#22d3ee]/20 rounded-3xl relative overflow-hidden group">
                            <div className="flex gap-4 items-start">
                                <div className="p-2 bg-emerald-500/10 rounded-lg"><CheckCircle2 className="w-5 h-5 text-emerald-500" /></div>
                                <div>
                                    <div className="text-xs font-bold text-white">Fee Status: Paid</div>
                                    <p className="text-[10px] text-[var(--text-dim)] mt-1">Receipt #BC-2024-88A is available for download.</p>
                                </div>
                            </div>
                            <MoreVertical className="absolute top-4 right-2 text-white/20 w-4 h-4" />
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}

// Fixed import for Video icon which was used but potentially missing in the context of the previous file's structure.
import { Video } from 'lucide-react';
