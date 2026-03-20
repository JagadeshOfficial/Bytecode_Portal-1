"use client";

import { useState } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FileText,
    Plus,
    Search,
    Filter,
    PlayCircle,
    Copy,
    Trash2,
    Settings,
    Users,
    ChevronRight,
    SearchCode,
    Zap,
    Clock,
    Target,
    HelpCircle,
    Monitor,
    ShieldAlert,
    BarChart
} from 'lucide-react';

const TESTS = [
    {
        id: "T-801",
        title: "TCS Ninja Mock Assessment",
        company: "TCS",
        role: "System Engineer",
        duration: "90 Mins",
        takers: 450,
        status: "Active",
        sections: ["Aptitude", "Verbal", "Coding"]
    },
    {
        id: "T-805",
        title: "Accenture Technical Screener",
        company: "Accenture",
        role: "ASE",
        duration: "60 Mins",
        takers: 120,
        status: "Draft",
        sections: ["Logic", "MS Office", "Coding"]
    },
    {
        id: "T-812",
        title: "Capgemini Pseudo-code Round",
        company: "Capgemini",
        role: "Analyst",
        duration: "45 Mins",
        takers: 0,
        status: "Scheduled",
        sections: ["Pseudo-code", "English"]
    }
];

export default function OnlineTestsPage() {
    return (
        <DashboardLayout role="hr">
            <div className="flex flex-col gap-8 pb-10">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                        <h1 className="text-4xl font-[Rajdhani] font-bold text-white tracking-widest uppercase">
                            Test <span className="text-cyan-400">Engine</span>
                        </h1>
                        <p className="text-slate-400 font-medium mt-1">Design, proctor, and evaluate MNC-style aptitude and coding assessments.</p>
                    </div>
                    <div className="flex gap-4">
                        <button className="flex items-center gap-2 px-6 py-4 bg-cyan-600 hover:bg-cyan-500 text-black font-black rounded-2xl shadow-xl shadow-cyan-500/20 transition-all uppercase text-[10px] tracking-widest">
                            <Plus size={18} /> CREATE MNC TEST
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Test Bank & Templates Sidebar */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-[#0a0a1a]/60 border border-white/5 rounded-[2rem] p-6 backdrop-blur-xl">
                            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-6 px-2">MNC Patterns</h3>
                            <div className="space-y-3">
                                {[
                                    { label: "FAANG / Big Tech", count: 12, color: "text-amber-500", bg: "bg-amber-500/10" },
                                    { label: "Service Giants (TCS/Infosys)", count: 45, color: "text-blue-500", bg: "bg-blue-500/10" },
                                    { label: "Product Based (Zomato/Uber)", count: 8, color: "text-red-500", bg: "bg-red-500/10" },
                                ].map((pattern, i) => (
                                    <button key={i} className="w-full text-left p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/20 transition-all group">
                                        <div className="flex justify-between items-center">
                                            <span className="text-xs font-bold text-white group-hover:text-cyan-400 transition-colors uppercase tracking-tight">{pattern.label}</span>
                                            <span className={`text-[9px] font-black ${pattern.color} ${pattern.bg} px-2 py-0.5 rounded-lg`}>{pattern.count} Template</span>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="bg-[#030014] border border-cyan-500/20 rounded-[2rem] p-6 relative overflow-hidden group">
                            <div className="relative z-10">
                                <div className="p-3 bg-cyan-500/10 rounded-xl text-cyan-500 mb-4 inline-block"><ShieldAlert size={24} /></div>
                                <h4 className="text-sm font-black text-white uppercase tracking-tight mb-2">Proctoring Status</h4>
                                <p className="text-[10px] text-slate-500 font-bold uppercase leading-relaxed mb-6">AI Monitoring is active for all live exams. 12 potential violations flagging in current session.</p>
                                <button className="w-full py-3 bg-cyan-600/10 border border-cyan-500/20 text-cyan-400 hover:bg-cyan-600 hover:text-black transition-all rounded-xl text-[10px] font-black uppercase tracking-widest leading-none">VIEW INVIGILATION HUB</button>
                            </div>
                            <div className="absolute inset-0 opacity-[0.05] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #22d3ee 1px, transparent 1px)', backgroundSize: '16px 16px' }} />
                        </div>
                    </div>

                    {/* Active Exams Grid */}
                    <div className="lg:col-span-3 space-y-8">
                        {/* Search & Stats Bar */}
                        <div className="flex flex-col md:flex-row justify-between items-center gap-6 bg-[#0a0a1a]/60 border border-white/5 p-6 rounded-[2.5rem] backdrop-blur-xl">
                            <div className="relative w-full md:w-96">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                <input
                                    type="text"
                                    placeholder="Search assessment library..."
                                    className="w-full bg-[#050510] border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-sm text-white focus:outline-none focus:border-cyan-500 transition-all font-bold"
                                />
                            </div>
                            <div className="grid grid-cols-2 md:flex gap-4">
                                <div className="p-3 bg-white/5 border border-white/5 rounded-2xl flex flex-col items-center min-w-[100px]">
                                    <div className="text-lg font-black text-white">1,240</div>
                                    <div className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Questions</div>
                                </div>
                                <div className="p-3 bg-white/5 border border-white/5 rounded-2xl flex flex-col items-center min-w-[100px]">
                                    <div className="text-lg font-black text-white">82</div>
                                    <div className="text-[8px] font-black text-slate-500 uppercase tracking-widest">MNC Banks</div>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {TESTS.map((test) => (
                                <div key={test.id} className="group bg-[#0a0a1a]/60 border border-white/5 rounded-[2.5rem] p-8 backdrop-blur-xl hover:border-cyan-500/30 transition-all relative overflow-hidden flex flex-col">
                                    <div className="flex justify-between items-start mb-10 relative z-10">
                                        <div className="flex flex-col gap-2">
                                            <div className="flex items-center gap-2">
                                                <span className={`px-2 py-0.5 rounded-lg text-[9px] font-black tracking-widest uppercase ${test.status === 'Active' ? 'bg-red-500/10 text-red-500 border border-red-500/20 animate-pulse' :
                                                        test.status === 'Scheduled' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                                                            'bg-white/5 text-slate-500'
                                                    }`}>
                                                    {test.status}
                                                </span>
                                                <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">{test.id}</span>
                                            </div>
                                            <h3 className="text-2xl font-black text-white group-hover:text-cyan-400 transition-colors uppercase tracking-tight">{test.title}</h3>
                                        </div>
                                        <div className="p-3 bg-white/5 rounded-xl text-slate-400 hover:text-white transition-all"><Settings size={18} /></div>
                                    </div>

                                    <div className="relative z-10 space-y-6 mb-10">
                                        <div className="flex flex-wrap gap-2">
                                            {test.sections.map((section, i) => (
                                                <span key={i} className="text-[9px] font-black bg-white/5 border border-white/5 px-2 py-1 rounded-md text-slate-400 uppercase tracking-widest">{section}</span>
                                            ))}
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="flex items-center gap-3 text-xs text-slate-500 font-black uppercase tracking-tight">
                                                <Clock size={16} className="text-cyan-500" />
                                                {test.duration}
                                            </div>
                                            <div className="flex items-center gap-3 text-xs text-slate-500 font-black uppercase tracking-tight">
                                                <Users size={16} className="text-cyan-500" />
                                                {test.takers} Takers
                                            </div>
                                        </div>
                                    </div>

                                    <div className="relative z-10 flex gap-3 pt-8 border-t border-white/[0.03]">
                                        <button className="flex-1 py-4 bg-white/5 border border-white/10 hover:border-white/20 text-white font-black text-[10px] tracking-widest rounded-2xl transition-all uppercase">PREVIEW TEST</button>
                                        <button className="flex-1 py-4 bg-cyan-600 text-black font-black text-[10px] tracking-widest rounded-2xl shadow-xl shadow-cyan-500/10 transition-all uppercase">RESULTS HUB</button>
                                    </div>
                                </div>
                            ))}

                            {/* Create New Card */}
                            <div className="border-2 border-dashed border-white/10 rounded-[2.5rem] p-8 flex flex-col items-center justify-center text-center group hover:border-cyan-500/40 transition-all cursor-pointer">
                                <div className="w-16 h-16 rounded-3xl bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                    <Plus size={32} className="text-slate-600 group-hover:text-cyan-400" />
                                </div>
                                <h4 className="text-xl font-black text-white uppercase tracking-tight mb-2">New Assessment</h4>
                                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Initialize a fresh coding or aptitude bank.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}

import { ChevronDown } from 'lucide-react';
