"use client";

import { useState } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Users,
    Search,
    Filter,
    Download,
    ChevronRight,
    ArrowUpRight,
    CheckCircle2,
    XCircle,
    Clock,
    UserCheck,
    FileText,
    TrendingUp,
    Star,
    Award,
    Mail,
    Phone,
    Briefcase
} from 'lucide-react';

const STUDENTS = [
    {
        name: "Rahul Sharma",
        batch: "Java #22",
        cgpa: "8.8",
        eligible: true,
        drives: 5,
        status: "Interviewing",
        company: "TCS",
        score: "92%"
    },
    {
        name: "Priya Das",
        batch: "Java #22",
        cgpa: "9.2",
        eligible: true,
        drives: 3,
        status: "Placed",
        company: "Cisco",
        score: "98%"
    },
    {
        name: "Aman Verma",
        batch: "Java #21",
        cgpa: "7.1",
        eligible: false,
        drives: 8,
        status: "Applied",
        company: "Accenture",
        score: "65%"
    },
    {
        name: "Sneha Reddy",
        batch: "Python #08",
        cgpa: "8.5",
        eligible: true,
        drives: 2,
        status: "Assessment",
        company: "Capgemini",
        score: "88%"
    },
];

export default function StudentTrackingPage() {
    return (
        <DashboardLayout role="hr">
            <div className="flex flex-col gap-8 pb-10">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                        <h1 className="text-4xl font-[Rajdhani] font-bold text-white tracking-widest uppercase">
                            Student <span className="text-cyan-400">Inventory</span>
                        </h1>
                        <p className="text-slate-400 font-medium mt-1">Cross-sectional tracking of eligibility, job applications, and interview performance.</p>
                    </div>
                </div>

                {/* KPI Pulse */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                        { label: "Placement Ready", value: "842", sub: "Clean Records", icon: UserCheck, color: "text-emerald-400" },
                        { label: "Under Evaluation", value: "156", sub: "Round 2/3", icon: Clock, color: "text-blue-400" },
                        { label: "Package Avg.", value: "6.8L", sub: "CTC Index", icon: TrendingUp, color: "text-cyan-400" },
                        { label: "Backlog Alert", value: "42", sub: "Restricted", icon: XCircle, color: "text-red-400" },
                    ].map((stat, i) => (
                        <div key={i} className="bg-[#0a0a1a]/60 border border-white/5 rounded-3xl p-6 backdrop-blur-xl group hover:border-white/20 transition-all">
                            <div className="flex justify-between items-center mb-4">
                                <div className={`p-2.5 rounded-xl bg-[#0a0a1a]/80 shadow-inner ${stat.color}`}>
                                    <stat.icon size={20} />
                                </div>
                                <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">{stat.sub}</span>
                            </div>
                            <div className="text-3xl font-black text-white font-[Rajdhani] tracking-tight">{stat.value}</div>
                            <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">{stat.label}</div>
                        </div>
                    ))}
                </div>

                {/* Main Table Container */}
                <div className="bg-[#0a0a1a]/60 border border-white/5 rounded-[2.5rem] p-8 backdrop-blur-xl">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-10">
                        <div className="flex bg-[#050510] border border-white/10 rounded-2xl p-1.5 w-full md:w-auto">
                            <button className="flex-1 md:flex-none px-6 py-3 bg-cyan-600 text-black rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-xl shadow-cyan-500/10">ALL STUDENTS</button>
                            <button className="flex-1 md:flex-none px-6 py-3 text-slate-500 hover:text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">PLACED</button>
                            <button className="flex-1 md:flex-none px-6 py-3 text-slate-500 hover:text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">UNPLACED</button>
                        </div>
                        <div className="flex gap-4 w-full md:w-96">
                            <div className="relative flex-1">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                <input
                                    type="text"
                                    placeholder="Filter by name, Batch ID, or CGPA..."
                                    className="w-full bg-[#050510] border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-sm text-white focus:outline-none focus:border-cyan-500 transition-all font-bold"
                                />
                            </div>
                            <button className="p-4 bg-white/5 border border-white/10 rounded-xl text-slate-400 hover:text-white transition-all"><Filter size={20} /></button>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] border-b border-white/5">
                                    <th className="pb-6 pl-4 font-black">STUDENT PROFILE</th>
                                    <th className="pb-6 px-4 font-black">ELIGIBILITY</th>
                                    <th className="pb-6 px-4 font-black">APTITUDE %</th>
                                    <th className="pb-6 px-4 font-black">HIRING STATUS</th>
                                    <th className="pb-6 pr-4 font-black text-right">ACTION</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/[0.03]">
                                {STUDENTS.map((student, i) => (
                                    <tr key={i} className="group hover:bg-white/[0.01] transition-all">
                                        <td className="py-6 pl-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-2xl bg-[#0a0a1a] border border-white/10 flex items-center justify-center text-xs font-black text-white group-hover:scale-110 transition-transform">
                                                    {student.name.split(' ').map(n => n[0]).join('')}
                                                </div>
                                                <div>
                                                    <div className="text-sm font-black text-white tracking-tight uppercase group-hover:text-cyan-400 transition-colors">{student.name}</div>
                                                    <div className="text-[10px] text-slate-500 font-black uppercase mt-1 tracking-widest">{student.batch} • {student.cgpa} CGPA</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-6 px-4">
                                            {student.eligible ? (
                                                <div className="flex items-center gap-2 text-emerald-400 text-[10px] font-black uppercase tracking-widest">
                                                    <CheckCircle2 size={16} /> QUALIFIED
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-2 text-red-500/60 text-[10px] font-black uppercase tracking-widest">
                                                    <XCircle size={16} /> RESTRICTED
                                                </div>
                                            )}
                                        </td>
                                        <td className="py-6 px-4">
                                            <div className="flex flex-col gap-1.5 w-32">
                                                <div className="flex justify-between text-[9px] font-black text-slate-500 uppercase tracking-widest">
                                                    <span>SCORE</span>
                                                    <span className="text-white">{student.score}</span>
                                                </div>
                                                <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                                                    <div className="h-full bg-cyan-500" style={{ width: student.score }} />
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-6 px-4">
                                            <div className="flex flex-col gap-1">
                                                <span className={`text-[10px] font-black uppercase tracking-widest ${student.status === 'Placed' ? 'text-emerald-400' :
                                                        student.status === 'Interviewing' ? 'text-blue-400' :
                                                            student.status === 'Assessment' ? 'text-amber-500' : 'text-slate-500'
                                                    }`}>
                                                    {student.status}
                                                </span>
                                                <div className="text-[8px] text-slate-600 font-bold uppercase tracking-widest">{student.company || 'Searching...'}</div>
                                            </div>
                                        </td>
                                        <td className="py-6 pr-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-500 hover:text-white transition-all"><Mail size={16} /></button>
                                                <button className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-500 hover:text-cyan-400 transition-all"><ArrowUpRight size={16} /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}

import { ChevronDown } from 'lucide-react';
