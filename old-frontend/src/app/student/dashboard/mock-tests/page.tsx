"use client";

import { useState } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { motion, AnimatePresence } from 'framer-motion';
import {
    GraduationCap,
    Clock,
    Zap,
    Target,
    BarChart3,
    ArrowUpRight,
    Search,
    Filter,
    Play,
    CheckCircle2,
    Lock,
    Unlock,
    Activity,
    Brain,
    Dna,
    Cpu,
    Languages,
    Timer,
    AlertCircle,
    History,
    ChevronRight
} from 'lucide-react';

const TEST_PATTERNS = [
    {
        id: "MNC-01",
        title: "Infosys Pattern Mock",
        sections: ["Aptitude", "Logical", "Verbal", "Pseudocode", "Puzzle"],
        duration: "100 Minutes",
        level: "Medium",
        questions: 54,
        icon: Brain,
        color: "text-blue-400",
        bg: "bg-blue-500/10"
    },
    {
        id: "MNC-02",
        title: "TCS Ninja/Digital",
        sections: ["Numerical", "Verbal", "Logic", "Coding"],
        duration: "180 Minutes",
        level: "Hard",
        questions: 92,
        icon: Cpu,
        color: "text-violet-400",
        bg: "bg-violet-500/10"
    },
    {
        id: "MNC-03",
        title: "Accenture Cognitive",
        sections: ["Aptitude", "English", "MS Office", "Pseudocode", "Networking"],
        duration: "90 Minutes",
        level: "Medium",
        questions: 90,
        icon: Target,
        color: "text-emerald-400",
        bg: "bg-emerald-500/10"
    }
];

const PREVIOUS_SCORES = [
    { test: "Aptitude Full Length", score: 82, rank: 45, date: "Feb 08" },
    { test: "Verbal Excellence", score: 94, rank: 12, date: "Feb 05" },
    { test: "Logical Reasoning #4", score: 76, rank: 110, date: "Feb 02" },
];

export default function StudentMockTestsPage() {
    return (
        <DashboardLayout role="student">
            <div className="flex flex-col gap-8 pb-10">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                        <h1 className="text-4xl font-display font-bold text-white tracking-tight uppercase">
                            Mock <span className="text-[#d946ef]">Arena</span>
                        </h1>
                        <p className="text-slate-400 font-medium mt-1">MNC-pattern proctored tests to simulate real-world hiring challenges.</p>
                    </div>
                    <div className="flex gap-4">
                        <button className="px-6 py-3 bg-[#d946ef] hover:bg-[#c026d3] text-black font-black rounded-2xl shadow-lg shadow-[#d946ef]/20 transition-all uppercase text-[10px] tracking-widest leading-none">START QUICK PRACTICE</button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Test Listings */}
                    <div className="lg:col-span-2 flex flex-col gap-8">
                        <div className="bg-[#0a0a1a]/60 border border-white/5 rounded-[2.5rem] p-8 backdrop-blur-xl relative overflow-hidden">
                            <div className="flex justify-between items-center mb-8 relative z-10">
                                <div>
                                    <h3 className="text-2xl font-black text-white uppercase tracking-tight">Active Mock Tests</h3>
                                    <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Available for the next 48 hours</p>
                                </div>
                                <div className="flex bg-[#050510] border border-white/10 rounded-xl p-1">
                                    <button className="px-4 py-2 bg-[#d946ef] text-black rounded-lg text-[10px] font-black uppercase tracking-widest">ALL</button>
                                    <button className="px-4 py-2 text-slate-500 rounded-lg text-[10px] font-black uppercase tracking-widest hover:text-white">MNC PATTERN</button>
                                </div>
                            </div>

                            <div className="space-y-6 relative z-10">
                                {TEST_PATTERNS.map((test) => (
                                    <div key={test.id} className="p-8 rounded-[2rem] bg-white/[0.02] border border-white/5 hover:border-[#d946ef]/40 transition-all group relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-8">
                                        <div className="flex items-center gap-6">
                                            <div className={`w-20 h-20 rounded-[1.5rem] bg-[#0a0a1a] border border-white/10 ${test.color} flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-500`}>
                                                <test.icon size={36} />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-3 mb-2">
                                                    <h4 className="text-xl font-black text-white uppercase tracking-tight group-hover:text-[#d946ef] transition-colors">{test.title}</h4>
                                                    <span className={`px-2 py-0.5 rounded-full text-[8px] font-black tracking-widest uppercase ${test.level === 'Hard' ? 'bg-red-500/10 text-red-500' : 'bg-emerald-500/10 text-emerald-400'}`}>{test.level}</span>
                                                </div>
                                                <div className="flex flex-wrap gap-2">
                                                    {test.sections.map(sec => (
                                                        <span key={sec} className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">{sec} {sec !== test.sections[test.sections.length - 1] && "•"}</span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-8 border-t md:border-t-0 md:border-l border-white/5 pt-6 md:pt-0 md:pl-8">
                                            <div className="flex flex-col items-center">
                                                <div className="text-white font-black text-lg leading-none">{test.questions}</div>
                                                <div className="text-[9px] font-bold text-slate-600 uppercase mt-1">QUESTIONS</div>
                                            </div>
                                            <div className="flex flex-col items-center">
                                                <div className="text-white font-black text-lg leading-none">{test.duration.split(' ')[0]}</div>
                                                <div className="text-[9px] font-bold text-slate-600 uppercase mt-1">MINUTES</div>
                                            </div>
                                            <button className="p-5 bg-[#d946ef] hover:bg-[#c026d3] text-black rounded-2xl shadow-xl shadow-[#d946ef]/20 transition-all group-hover:scale-105 active:scale-95">
                                                <Play size={20} fill="currentColor" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Analysis & Scoreboard */}
                        <div className="bg-[#0a0a1a]/60 border border-white/5 rounded-[2.5rem] p-8 backdrop-blur-xl">
                            <h3 className="text-xl font-bold text-white mb-8 flex items-center gap-3 uppercase tracking-tight">
                                <History className="text-[#d946ef]" size={24} />
                                Performance Scorecard
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {PREVIOUS_SCORES.map((score, i) => (
                                    <div key={i} className="p-6 rounded-3xl bg-white/[0.02] border border-white/5 flex items-center justify-between group hover:border-[#d946ef]/30 transition-all">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-xl bg-[#0a0a1a] border border-white/10 flex items-center justify-center text-lg font-black text-[#d946ef] group-hover:bg-[#d946ef] group-hover:text-black transition-all">
                                                {score.score}%
                                            </div>
                                            <div>
                                                <div className="text-sm font-bold text-white uppercase tracking-tight">{score.test}</div>
                                                <div className="text-[9px] text-slate-500 font-bold uppercase mt-1">Global Rank: #{score.rank} • {score.date}</div>
                                            </div>
                                        </div>
                                        <ChevronRight size={18} className="text-slate-700 group-hover:text-white transition-colors" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Info Hub */}
                    <div className="flex flex-col gap-8">
                        {/* Auto-Proctoring Alert */}
                        <div className="p-8 bg-gradient-to-br from-[#0c051a] to-[#030014] border border-[#d946ef]/20 rounded-[2.5rem] relative overflow-hidden group">
                            <div className="flex gap-5 items-start relative z-10">
                                <div className="p-4 bg-orange-500/10 rounded-2xl border border-orange-500/20 text-orange-400 shadow-xl shadow-orange-500/5 anim-pulse-slow">
                                    <AlertCircle size={28} />
                                </div>
                                <div>
                                    <h4 className="text-sm font-black text-white uppercase tracking-tight mb-2">Auto-Proctoring Enabled</h4>
                                    <p className="text-[10px] text-slate-500 font-medium leading-relaxed">System-monitored Mock Tests require Camera and Microphone access to simulate real MNC proctoring environments.</p>
                                </div>
                            </div>
                            <div className="mt-8 flex items-center gap-4 relative z-10">
                                <div className="flex items-center gap-1 text-[9px] font-black text-slate-500 uppercase tracking-widest"><Lock size={12} /> SECURE BROWSER</div>
                                <div className="flex items-center gap-1 text-[9px] font-black text-slate-500 uppercase tracking-widest"><Timer size={12} /> SECTION TIMER</div>
                            </div>
                            <div className="absolute inset-0 opacity-[0.05] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #d946ef 1px, transparent 1px)', backgroundSize: '16px 16px' }} />
                        </div>

                        {/* Strengths & Weak Areas */}
                        <div className="bg-[#0a0a1a]/60 border border-white/5 rounded-[2.5rem] p-8 backdrop-blur-xl">
                            <h3 className="text-xl font-bold text-white mb-8 uppercase tracking-tight">Category Breakdown</h3>
                            <div className="space-y-8">
                                {[
                                    { label: "Quantitative", val: 88, icon: Languages, color: "text-[#d946ef]" },
                                    { label: "Logical Aptitude", val: 72, icon: Brain, color: "text-blue-400" },
                                    { label: "Coding Round", val: 65, icon: Cpu, color: "text-amber-400" },
                                    { label: "English Communication", val: 94, icon: Languages, color: "text-emerald-400" },
                                ].map((cat, i) => (
                                    <div key={i} className="space-y-3">
                                        <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                                            <span className="flex items-center gap-2 text-slate-400"><cat.icon size={14} className={cat.color} /> {cat.label}</span>
                                            <span className="text-white">{cat.val}%</span>
                                        </div>
                                        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${cat.val}%` }}
                                                className={`h-full ${cat.color.replace('text-', 'bg-')}`}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <button className="w-full mt-10 py-5 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black text-slate-500 hover:text-white hover:bg-[#d946ef] transition-all uppercase tracking-[0.2em] shadow-xl">VIEW WEAK AREA ANALYSIS</button>
                        </div>

                        {/* Recent Activity Feed */}
                        <div className="p-6 bg-[#0a0a1a]/40 border border-white/5 rounded-[2.5rem]">
                            <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-6">Recent Records</h4>
                            <div className="space-y-6 relative ml-2">
                                <div className="absolute left-0 top-0 bottom-0 w-[1px] bg-white/5" />
                                {[
                                    { label: "Infosys Mock #1", time: "2 days ago", rank: "#14" },
                                    { label: "Logical Practice", time: "Feb 06", rank: "#110" },
                                    { label: "Verbal Quiz", time: "Jan 28", rank: "#12" },
                                ].map((act, i) => (
                                    <div key={i} className="relative pl-6">
                                        <div className="absolute left-[-4px] top-1 w-2 h-2 rounded-full bg-slate-800 border border-slate-700" />
                                        <div className="text-[11px] font-bold text-white uppercase tracking-tight">{act.label}</div>
                                        <div className="text-[9px] text-slate-600 font-bold uppercase">GLOBAL RANK {act.rank} • {act.time}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
