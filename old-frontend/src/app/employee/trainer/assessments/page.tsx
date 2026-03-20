"use client";

import { useState } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { motion, AnimatePresence } from 'framer-motion';
import {
    CheckCircle2,
    Plus,
    FileText,
    Brain,
    Edit3,
    BarChart3,
    Clock,
    Users,
    ChevronRight,
    Search,
    Filter,
    MoreVertical,
    Target,
    Zap,
    Download,
    Eye,
    Star,
    AlertCircle,
    Trophy
} from 'lucide-react';

const ACTIVE_TESTS = [
    { id: "T-202", title: "Java Microservices Quiz", batch: "Java #22", end: "4:00 PM", status: "Live", takers: 38, avg: "72%" },
    { id: "T-205", title: "React State Management", batch: "React #15", end: "Tomorrow", status: "Scheduled", takers: 0, avg: "-" },
];

const RECENT_EVALUATIONS = [
    { student: "Aniket Mehra", test: "Python AI Fundamentals", score: "88/100", date: "2h ago", rank: "#04" },
    { student: "Isha Kapoor", test: "Spring Security Lab", score: "92/100", date: "5h ago", rank: "#02" },
    { student: "Sanjay Raj", test: "SQL Pro Certification", score: "45/100", date: "Yesterday", rank: "#42" },
];

export default function TrainerAssessmentsPage() {
    return (
        <DashboardLayout role="trainer">
            <div className="flex flex-col gap-8 pb-10">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                        <h1 className="text-4xl font-[Rajdhani] font-bold text-white tracking-widest uppercase">
                            Assessment <span className="text-[#d946ef]">Engine</span>
                        </h1>
                        <p className="text-slate-400 font-medium mt-1">Design technical evaluations, automate MCQ grading, and analyze batch competence.</p>
                    </div>
                    <div className="flex gap-4">
                        <button className="px-6 py-4 bg-[#d946ef] hover:bg-[#c026d3] text-black font-black rounded-2xl shadow-xl shadow-[#d946ef]/20 transition-all uppercase text-[10px] tracking-widest flex items-center gap-2">
                            <Plus size={18} /> GENERATE TEST
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Active & Scheduled Tests */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="bg-[#0a0a1a]/60 border border-white/5 rounded-[2.5rem] p-8 backdrop-blur-xl relative overflow-hidden">
                            <div className="flex justify-between items-center mb-10 relative z-10">
                                <div>
                                    <h3 className="text-2xl font-black text-white uppercase tracking-tight">Examination Pipeline</h3>
                                    <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Live and upcoming assessments</p>
                                </div>
                                <div className="flex bg-[#050510] border border-white/10 rounded-xl p-1">
                                    <button className="px-4 py-2 bg-[#d946ef] text-black rounded-lg text-[10px] font-black uppercase tracking-widest">ACTIVE</button>
                                    <button className="px-4 py-2 text-slate-500 rounded-lg text-[10px] font-black uppercase tracking-widest hover:text-white">HISTORY</button>
                                </div>
                            </div>

                            <div className="space-y-6 relative z-10">
                                {ACTIVE_TESTS.map((test) => (
                                    <div key={test.id} className="p-8 rounded-[2rem] bg-white/[0.02] border border-white/5 hover:border-[#d946ef]/40 transition-all group relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-8">
                                        <div className="flex items-center gap-6">
                                            <div className="w-16 h-16 rounded-[1.5rem] bg-[#0a0a1a] border border-white/10 text-[#d946ef] flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-500">
                                                <Target size={28} />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-3 mb-2">
                                                    <h4 className="text-xl font-black text-white uppercase tracking-tight group-hover:text-[#d946ef] transition-colors">{test.title}</h4>
                                                    <span className={`px-2 py-0.5 rounded-full text-[8px] font-black tracking-widest uppercase ${test.status === 'Live' ? 'bg-red-500/10 text-red-500 border border-red-500/20 animate-pulse' : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'}`}>{test.status}</span>
                                                </div>
                                                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{test.batch} • Ends {test.end}</div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-10 border-t md:border-t-0 md:border-l border-white/5 pt-6 md:pt-0 md:pl-10">
                                            <div className="flex flex-col items-center">
                                                <div className="text-white font-black text-lg leading-none">{test.takers}</div>
                                                <div className="text-[9px] font-bold text-slate-600 uppercase mt-1">PARTICIPANTS</div>
                                            </div>
                                            <div className="flex flex-col items-center">
                                                <div className="text-white font-black text-lg leading-none">{test.avg}</div>
                                                <div className="text-[9px] font-bold text-slate-600 uppercase mt-1">AVG. SCORE</div>
                                            </div>
                                            <button className="p-4 bg-white/5 border border-white/10 hover:border-[#d946ef] text-slate-400 hover:text-white rounded-xl transition-all">
                                                <Edit3 size={18} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Question Bank Preview */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="p-8 bg-gradient-to-br from-[#130a30] to-[#0a0a1a] border border-[#d946ef]/20 rounded-[2.5rem] relative overflow-hidden group hover:border-[#d946ef]/40 transition-all cursor-pointer">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="p-4 bg-[#d946ef]/10 rounded-2xl border border-[#d946ef]/20 text-[#d946ef]">
                                        <Brain size={28} />
                                    </div>
                                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">AUTO-CURATOR</span>
                                </div>
                                <h4 className="text-xl font-black text-white uppercase tracking-tight mb-2">Smart Question Bank</h4>
                                <p className="text-xs text-slate-500 font-medium leading-relaxed">Access 10,000+ technical questions across Java, AI, Cloud & Aptitude with difficulty levels.</p>
                                <div className="mt-8 flex items-center gap-2 text-[10px] font-black text-[#d946ef] uppercase tracking-widest">
                                    EXPLORE REPOSITORY <ChevronRight size={14} />
                                </div>
                                <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #d946ef 1px, transparent 1px)', backgroundSize: '16px 16px' }} />
                            </div>

                            <div className="p-8 bg-gradient-to-br from-[#0c051a] to-[#030014] border border-white/5 rounded-[2.5rem] relative overflow-hidden group items-center justify-center flex flex-col text-center">
                                <div className="p-4 bg-violet-500/10 rounded-2xl border border-violet-500/20 text-violet-400 mb-6 group-hover:scale-110 transition-transform">
                                    <Zap size={28} fill="currentColor" />
                                </div>
                                <h4 className="text-lg font-black text-white uppercase tracking-tight mb-2">Quick Evaluation</h4>
                                <p className="text-[10px] text-slate-500 font-medium max-w-[180px]">Automate MCQs and get instant batch-wise performance breakdown.</p>
                            </div>
                        </div>
                    </div>

                    {/* Performance Trends & Eval Queue */}
                    <div className="flex flex-col gap-8">
                        {/* Evaluation Queue */}
                        <div className="bg-[#0a0a1a]/60 border border-white/5 rounded-[2.5rem] p-8 backdrop-blur-xl">
                            <h3 className="text-xl font-bold text-white mb-8 flex items-center gap-3 uppercase tracking-tight">
                                <Trophy className="text-[#d946ef]" size={24} />
                                Recent Performance
                            </h3>
                            <div className="space-y-6">
                                {RECENT_EVALUATIONS.map((evalItem, i) => (
                                    <div key={i} className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-between group hover:border-[#d946ef]/30 transition-all">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-[#0a0a1a] border border-white/10 flex items-center justify-center text-[10px] font-black text-white group-hover:bg-[#d946ef] group-hover:text-black transition-all uppercase">
                                                {evalItem.student.split(' ').map(n => n[0]).join('')}
                                            </div>
                                            <div>
                                                <div className="text-sm font-bold text-white uppercase tracking-tight group-hover:text-[#d946ef] transition-colors">{evalItem.student}</div>
                                                <div className="text-[9px] text-slate-500 font-bold uppercase mt-1">{evalItem.test} • {evalItem.date}</div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-sm font-black text-white">{evalItem.score}</div>
                                            <div className="text-[9px] text-emerald-400 font-black tracking-widest uppercase">{evalItem.rank}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <button className="w-full mt-10 py-5 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black text-slate-500 hover:text-white hover:bg-[#d946ef] transition-all uppercase tracking-[0.2em] shadow-xl">VIEW FULL HUB</button>
                        </div>

                        {/* Batch Compotence Analysis */}
                        <div className="bg-[#0a0a1a]/60 border border-white/5 rounded-[2.5rem] p-8 backdrop-blur-xl">
                            <h3 className="text-xl font-bold text-white mb-8 uppercase tracking-tight">Skill Accuracy</h3>
                            <div className="space-y-8">
                                {[
                                    { label: "Core Java/Logic", val: 82, color: "text-[#d946ef]" },
                                    { label: "DSA Competence", val: 64, color: "text-blue-400" },
                                    { label: "System Design", val: 45, color: "text-amber-400" },
                                    { label: "Frontend Skills", val: 91, color: "text-emerald-400" },
                                ].map((skill, i) => (
                                    <div key={i} className="space-y-3">
                                        <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                                            <span className="text-slate-400">{skill.label}</span>
                                            <span className="text-white">{skill.val}%</span>
                                        </div>
                                        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${skill.val}%` }}
                                                className={`h-full ${skill.color.replace('text-', 'bg-')}`}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Alert / CTA */}
                        <div className="p-6 bg-red-500/10 border border-red-500/20 rounded-[2rem] flex items-center gap-4">
                            <div className="p-2.5 bg-red-500/20 rounded-xl text-red-500 animate-pulse">
                                <AlertCircle size={24} />
                            </div>
                            <p className="text-[11px] text-red-400 font-bold uppercase leading-snug">Evaluation Pending for 12 students in Batch #22 Project Mock.</p>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
