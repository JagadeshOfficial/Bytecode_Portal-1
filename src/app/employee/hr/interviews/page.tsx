"use client";

import { useState } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Calendar,
    Plus,
    Clock,
    User,
    Video,
    MapPin,
    Building,
    CheckCircle2,
    XCircle,
    ChevronRight,
    Users,
    Activity,
    Search,
    Filter,
    MoreVertical,
    Monitor,
    ShieldCheck
} from 'lucide-react';

const INTERVIEWS = [
    {
        id: "INT-901",
        student: "Ankita Roy",
        company: "Infosys",
        panel: "Technical Panel Alpha",
        time: "10:30 AM",
        date: "Today",
        type: "Virtual",
        round: "Round 2: Technical",
        status: "Upcoming"
    },
    {
        id: "INT-905",
        student: "Vivek Singh",
        company: "Cisco",
        panel: "HR Panel Gamma",
        time: "02:00 PM",
        date: "Today",
        type: "On-Site (Mumbai)",
        round: "Final Interview",
        status: "Active"
    },
    {
        id: "INT-912",
        student: "Sneha Reddy",
        company: "Capgemini",
        panel: "Technical Panel Beta",
        time: "11:00 AM",
        date: "Tomorrow",
        type: "Virtual",
        round: "Round 1: DSA",
        status: "Scheduled"
    }
];

export default function InterviewManagementPage() {
    return (
        <DashboardLayout role="hr">
            <div className="flex flex-col gap-8 pb-10">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                        <h1 className="text-4xl font-[Rajdhani] font-bold text-white tracking-widest uppercase">
                            Interview <span className="text-cyan-400">Logistics</span>
                        </h1>
                        <p className="text-slate-400 font-medium mt-1">Coordinate interview panels, virtual room mapping, and candidate feedback cycles.</p>
                    </div>
                    <button className="flex items-center gap-2 px-6 py-4 bg-cyan-600 hover:bg-cyan-500 text-black font-black rounded-2xl shadow-xl shadow-cyan-500/20 transition-all uppercase text-[10px] tracking-widest">
                        <Plus size={18} /> MAP INTERVIEW DRIVE
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Schedule Visualization */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="bg-[#0a0a1a]/60 border border-white/5 rounded-[2.5rem] p-8 backdrop-blur-xl relative overflow-hidden">
                            <div className="flex justify-between items-center mb-10 relative z-10">
                                <h3 className="text-2xl font-black text-white uppercase tracking-tight">Today's Timeline</h3>
                                <div className="flex bg-[#050510] border border-white/10 rounded-xl p-1">
                                    <button className="px-4 py-2 bg-cyan-600 text-black rounded-lg text-[10px] font-black uppercase tracking-widest">TIMELINE</button>
                                    <button className="px-4 py-2 text-slate-500 rounded-lg text-[10px] font-black uppercase tracking-widest hover:text-white">CALENDAR</button>
                                </div>
                            </div>

                            <div className="space-y-6 relative z-10">
                                {INTERVIEWS.map((interview) => (
                                    <div key={interview.id} className="group p-6 rounded-[2rem] bg-white/[0.02] border border-white/5 hover:border-cyan-500/40 transition-all flex flex-col md:flex-row md:items-center justify-between gap-8 relative overflow-hidden">
                                        {interview.status === 'Active' && (
                                            <div className="absolute top-0 left-0 w-1 h-full bg-red-500 animate-pulse" />
                                        )}

                                        <div className="flex items-center gap-6">
                                            <div className="w-14 h-14 rounded-2xl bg-[#0a0a1a] border border-white/10 flex flex-col items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                                                <div className="text-white font-black text-xs">{interview.time.split(' ')[0]}</div>
                                                <div className="text-[8px] text-slate-500 font-bold uppercase">{interview.time.split(' ')[1]}</div>
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-3 mb-1">
                                                    <h4 className="text-lg font-black text-white uppercase tracking-tight group-hover:text-cyan-400 transition-colors">{interview.student}</h4>
                                                    <span className={`px-2 py-0.5 rounded-lg text-[8px] font-black tracking-widest uppercase ${interview.status === 'Active' ? 'bg-red-500/10 text-red-500 border border-red-500/20' :
                                                        interview.status === 'Scheduled' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                                                            'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                                        }`}>
                                                        {interview.status}
                                                    </span>
                                                </div>
                                                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                                    <Building size={12} className="text-cyan-500" /> {interview.company} • {interview.round}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-10 border-t md:border-t-0 md:border-l border-white/5 pt-6 md:pt-0 md:pl-10">
                                            <div className="flex flex-col">
                                                <div className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-1">Assigned Panel</div>
                                                <div className="text-xs font-bold text-white uppercase tracking-tight flex items-center gap-2">
                                                    <Users size={14} className="text-cyan-500" /> {interview.panel}
                                                </div>
                                            </div>
                                            <div className="flex flex-col">
                                                <div className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-1">Environment</div>
                                                <div className="text-xs font-bold text-slate-400 uppercase tracking-tight flex items-center gap-2">
                                                    {interview.type.includes('Virtual') ? <Video size={14} className="text-blue-400" /> : <MapPin size={14} className="text-amber-500" />}
                                                    {interview.type}
                                                </div>
                                            </div>
                                            <button className="p-3 bg-white/5 border border-white/10 rounded-xl text-slate-500 hover:text-white transition-all"><MoreVertical size={18} /></button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="p-8 bg-gradient-to-br from-[#130a30] to-[#0a0a1a] border border-cyan-500/20 rounded-[2.5rem] relative overflow-hidden group hover:border-cyan-500/40 transition-all">
                                <ShieldCheck size={48} className="text-cyan-500/10 absolute -top-2 -right-2 group-hover:scale-125 transition-transform" />
                                <div className="p-4 bg-cyan-500/10 rounded-2xl border border-cyan-500/20 text-cyan-500 mb-6 inline-block">
                                    <Monitor size={28} />
                                </div>
                                <h4 className="text-xl font-black text-white uppercase tracking-tight mb-2">Panel Onboarding</h4>
                                <p className="text-xs text-slate-500 font-black uppercase tracking-[0.05em] leading-relaxed">Map external technical panelists to specific interview slots automatically.</p>
                            </div>

                            <div className="p-8 bg-gradient-to-br from-[#0c051a] to-[#030014] border border-purple-500/20 rounded-[2.5rem] relative overflow-hidden group hover:border-purple-500/40 transition-all">
                                <Activity size={48} className="text-purple-500/10 absolute -top-2 -right-2 group-hover:scale-125 transition-transform" />
                                <div className="p-4 bg-purple-500/10 rounded-2xl border border-purple-500/20 text-purple-400 mb-6 inline-block">
                                    <Clock size={28} />
                                </div>
                                <h4 className="text-xl font-black text-white uppercase tracking-tight mb-2">Cycle Tracking</h4>
                                <p className="text-xs text-slate-500 font-black uppercase tracking-[0.05em] leading-relaxed">Monitor feedback latency and selection turn-around time for all partner drives.</p>
                            </div>
                        </div>
                    </div>

                    {/* Quick Stats & Alerts */}
                    <div className="flex flex-col gap-8">
                        <div className="bg-[#0a0a1a]/60 border border-white/5 rounded-[2.5rem] p-8 backdrop-blur-xl">
                            <h3 className="text-xl font-bold text-white mb-8 uppercase tracking-tight">Daily Metrics</h3>
                            <div className="space-y-8">
                                {[
                                    { label: "Interviews Slotted", val: 42, target: 50, color: "text-cyan-400" },
                                    { label: "Panels Engaged", val: 8, target: 12, color: "text-purple-400" },
                                    { label: "Feedback Received", val: 12, target: 42, color: "text-emerald-400" },
                                ].map((stat, i) => (
                                    <div key={i} className="space-y-3">
                                        <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                                            <span className="text-slate-400">{stat.label}</span>
                                            <span className="text-white">{stat.val}/{stat.target}</span>
                                        </div>
                                        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${(stat.val / stat.target) * 100}%` }}
                                                className={`h-full ${stat.color.replace('text-', 'bg-')}`}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="p-8 bg-[#030014] border border-white/5 rounded-[2.5rem] relative overflow-hidden group">
                            <div className="flex items-center gap-4 mb-6 relative z-10">
                                <div className="p-3 bg-cyan-500/10 rounded-xl text-cyan-500 border border-cyan-500/20"><Calendar size={20} /></div>
                                <h4 className="text-sm font-black text-white uppercase tracking-tight">Cycle Update</h4>
                            </div>
                            <p className="text-[11px] text-slate-500 font-black uppercase leading-relaxed relative z-10">Drive Cycle for Cisco SE Role is now 85% complete. Final result publishing expected by 6:00 PM Tomorrow.</p>
                            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #22d3ee 1px, transparent 1px)', backgroundSize: '16px 16px' }} />
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
