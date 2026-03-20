"use client";

import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { motion } from 'framer-motion';
import {
    Users,
    Briefcase,
    Building2,
    TrendingUp,
    FileText,
    Calendar,
    CheckCircle2,
    Target,
    Plus,
    BarChart,
    PieChart,
    Search,
    Video,
    Zap,
    ExternalLink,
    Building,
    ArrowUpRight,
    SearchCode,
    Activity,
    Trophy,
    Handshake,
    Globe,
    Cpu
} from 'lucide-react';
import Link from 'next/link';

const ACTIVE_DRIVES = [
    { company: "TCS", role: "Digital/Ninja", students: 120, date: "15 Feb", status: "Active", package: "7.0 LPA" },
    { company: "Accenture", role: "ASE", students: 85, date: "18 Feb", status: "Registration", package: "4.5 LPA" },
    { company: "Capgemini", role: "Analyst", students: 45, date: "22 Feb", status: "Evaluation", package: "6.0 LPA" },
];

const PLACED_RECENTLY = [
    { student: "Ankita Roy", company: "Infosys", package: "5.5 LPA", type: "On-Campus" },
    { student: "Vivek Singh", company: "Cisco", package: "18.2 LPA", type: "Off-Campus" },
    { student: "Samir Sen", company: "Zomato", package: "12 LPA", type: "PPO" },
];

export default function PlacementOfficerDashboard() {
    return (
        <DashboardLayout role="hr">
            <div className="flex flex-col gap-8 pb-10">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                        <h1 className="text-4xl font-[Rajdhani] font-bold text-white tracking-widest uppercase">
                            Placement <span className="text-[#22d3ee]">Command Center</span>
                        </h1>
                        <p className="text-slate-400 font-medium mt-1">Orchestrating career trajectories, corporate partnerships, and hiring pipelines.</p>
                    </div>
                    <div className="flex gap-4">
                        <Link href="/employee/hr/companies">
                            <button className="flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 rounded-2xl text-xs font-black text-slate-300 hover:text-white hover:bg-white/10 transition-all uppercase tracking-widest">
                                <Building2 size={16} /> ADD COMPANY
                            </button>
                        </Link>
                        <button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#22d3ee] to-[#7c3aed] rounded-2xl text-xs font-black text-white shadow-xl shadow-cyan-500/20 hover:scale-105 transition-all uppercase tracking-widest">
                            <Zap size={16} fill="currentColor" /> INITIATE DRIVE
                        </button>
                    </div>
                </div>

                {/* Industrial KPI Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                        { label: "Eligible Students", value: "842", sub: "Placement Ready", icon: Users, color: "text-[#22d3ee]", bg: "bg-cyan-500/10" },
                        { label: "Active Drives", value: "12", sub: "MNC & Unicorns", icon: Briefcase, color: "text-[#7c3aed]", bg: "bg-purple-500/10" },
                        { label: "Conversion Rate", value: "78.4%", sub: "Target: 85%", icon: TrendingUp, color: "text-emerald-400", bg: "bg-emerald-500/10" },
                        { label: "Partner MNCs", value: "48", sub: "Tier-1 Vendors", icon: Handshake, color: "text-[#d946ef]", bg: "bg-pink-500/10" },
                    ].map((stat, idx) => (
                        <div key={idx} className={`${stat.bg} border border-white/5 rounded-3xl p-6 backdrop-blur-xl group hover:border-white/20 transition-all relative overflow-hidden`}>
                            <div className="flex justify-between items-start mb-4">
                                <div className={`p-3 rounded-2xl bg-[#0a0a1a]/80 ${stat.color} shadow-lg shadow-black/40`}>
                                    <stat.icon size={24} />
                                </div>
                                <ArrowUpRight className="text-slate-600 group-hover:text-white transition-colors" size={18} />
                            </div>
                            <div className="text-3xl font-black text-white mb-1 tracking-tight font-[Rajdhani]">{stat.value}</div>
                            <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{stat.label}</div>
                            <div className={`mt-3 text-[9px] font-black uppercase tracking-tighter ${stat.color}`}>{stat.sub}</div>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Active Drives Matrix */}
                    <div className="lg:col-span-2 flex flex-col gap-8">
                        <div className="bg-[#0a0a1a]/60 border border-white/5 rounded-[2.5rem] p-8 backdrop-blur-xl relative overflow-hidden">
                            <div className="flex justify-between items-center mb-8 relative z-10">
                                <div>
                                    <h3 className="text-2xl font-black text-white uppercase tracking-tight">Active Hiring Matrix</h3>
                                    <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Real-time status of ongoing recruitment drives</p>
                                </div>
                                <button className="p-3 bg-white/5 border border-white/10 rounded-xl text-slate-500 hover:text-white transition-all"><Search size={20} /></button>
                            </div>

                            <div className="overflow-x-auto relative z-10">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] border-b border-white/5">
                                            <th className="pb-6 pl-4">PARTNER</th>
                                            <th className="pb-6 px-4">ROLE & PACKAGE</th>
                                            <th className="pb-6 px-4">APPLICANTS</th>
                                            <th className="pb-6 px-4">STATUS</th>
                                            <th className="pb-6 pr-4 text-right">ACTION</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/[0.03]">
                                        {ACTIVE_DRIVES.map((drive, i) => (
                                            <tr key={i} className="group hover:bg-white/[0.02] transition-all">
                                                <td className="py-6 pl-4">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-10 h-10 rounded-xl bg-[#0a0a1a] border border-white/10 flex items-center justify-center text-lg shadow-inner">
                                                            {drive.company === 'TCS' ? '💠' : drive.company === 'Accenture' ? '🔺' : '🏢'}
                                                        </div>
                                                        <div className="text-sm font-black text-white uppercase group-hover:text-[#22d3ee] transition-colors">{drive.company}</div>
                                                    </div>
                                                </td>
                                                <td className="py-6 px-4">
                                                    <div className="text-xs font-bold text-white uppercase tracking-tight">{drive.role}</div>
                                                    <div className="text-[10px] text-emerald-400 font-black mt-1 uppercase tracking-widest">{drive.package}</div>
                                                </td>
                                                <td className="py-6 px-4">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-sm font-black text-white">{drive.students}</span>
                                                        <div className="h-1 w-12 bg-white/5 rounded-full overflow-hidden">
                                                            <div className="h-full bg-cyan-500" style={{ width: '65%' }} />
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-6 px-4">
                                                    <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black tracking-widest uppercase ${drive.status === 'Active' ? 'bg-red-500/10 text-red-500 border border-red-500/20' :
                                                            drive.status === 'Registration' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                                                                'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                                                        }`}>
                                                        {drive.status}
                                                    </span>
                                                </td>
                                                <td className="py-6 pr-4 text-right">
                                                    <button className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-500 hover:text-[#22d3ee] hover:bg-[#22d3ee]/10 transition-all"><ChevronRight size={18} /></button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Quick Access Modules Mapping */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Link href="/employee/hr/tests" className="p-8 bg-gradient-to-br from-[#130a30] to-[#0a0a1a] border border-[#22d3ee]/10 rounded-[2.5rem] group hover:border-[#22d3ee]/40 transition-all flex items-center justify-between overflow-hidden relative">
                                <div className="relative z-10">
                                    <h4 className="text-xl font-black text-white uppercase tracking-tight mb-1">MNC Test Engine</h4>
                                    <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Aptitude & Coding Evaluation</p>
                                </div>
                                <div className="p-4 bg-cyan-500/10 rounded-2xl text-cyan-400 group-hover:scale-110 transition-transform relative z-10 shadow-2xl"><SearchCode size={28} /></div>
                                <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity"><Globe size={120} /></div>
                            </Link>

                            <Link href="/employee/hr/interviews" className="p-8 bg-gradient-to-br from-[#130a30] to-[#0a0a1a] border border-[#7c3aed]/10 rounded-[2.5rem] group hover:border-[#7c3aed]/40 transition-all flex items-center justify-between overflow-hidden relative">
                                <div className="relative z-10">
                                    <h4 className="text-xl font-black text-white uppercase tracking-tight mb-1">Interview Hub</h4>
                                    <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Scheduling & Panel Mapping</p>
                                </div>
                                <div className="p-4 bg-purple-500/10 rounded-2xl text-purple-400 group-hover:scale-110 transition-transform relative z-10 shadow-2xl"><Cpu size={28} /></div>
                                <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity"><Activity size={120} /></div>
                            </Link>
                        </div>
                    </div>

                    {/* Sidebar Analytics */}
                    <div className="flex flex-col gap-8">
                        {/* Selections Portal */}
                        <div className="bg-[#0a0a1a]/60 border border-white/5 rounded-[2.5rem] p-8 backdrop-blur-xl">
                            <h3 className="text-xl font-bold text-white mb-8 flex items-center gap-3 uppercase tracking-tight">
                                <Trophy className="text-[#22d3ee]" size={24} />
                                Placed Students
                            </h3>
                            <div className="space-y-6">
                                {PLACED_RECENTLY.map((placed, i) => (
                                    <div key={i} className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-between group hover:border-emerald-500/40 transition-all cursor-pointer">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500/20 to-emerald-500/20 flex items-center justify-center text-[10px] font-black text-white uppercase tracking-tight group-hover:scale-110 transition-transform">
                                                {placed.student.split(' ').map(n => n[0]).join('')}
                                            </div>
                                            <div>
                                                <div className="text-sm font-bold text-white uppercase tracking-tight group-hover:text-emerald-400 transition-colors">{placed.student}</div>
                                                <div className="text-[9px] text-slate-500 font-bold uppercase mt-1 tracking-widest">{placed.company} • {placed.package}</div>
                                            </div>
                                        </div>
                                        <ArrowUpRight size={16} className="text-slate-700 group-hover:text-white transition-colors" />
                                    </div>
                                ))}
                            </div>
                            <Link href="/employee/hr/reports">
                                <button className="w-full mt-10 py-5 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black text-slate-500 hover:text-white hover:bg-emerald-600 hover:text-black transition-all uppercase tracking-[0.2em] shadow-xl shadow-black/40">GENERATE ANALYTICS REPORT</button>
                            </Link>
                        </div>

                        {/* Conversion Metrics */}
                        <div className="bg-[#0a0a1a]/60 border border-white/5 rounded-[2.5rem] p-8 backdrop-blur-xl">
                            <h3 className="text-xl font-bold text-white mb-8 uppercase tracking-tight">Hiring Efficacy</h3>
                            <div className="space-y-8">
                                {[
                                    { label: "Technical Screening Pass", val: 92, color: "bg-[#22d3ee]" },
                                    { label: "Interview Success Rate", val: 64, color: "bg-[#7c3aed]" },
                                    { label: "Package Hike YoY", val: 14, color: "bg-emerald-400" },
                                ].map((stat, i) => (
                                    <div key={i} className="space-y-3">
                                        <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                                            <span className="text-slate-400">{stat.label}</span>
                                            <span className="text-white">{stat.val}%</span>
                                        </div>
                                        <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${stat.val}%` }}
                                                className={`h-full ${stat.color}`}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Recent Alerts Feed */}
                        <div className="p-8 bg-gradient-to-br from-[#0c051a] to-[#030014] border border-white/5 rounded-[2.5rem] relative overflow-hidden group">
                            <div className="flex items-start gap-4 mb-4 relative z-10">
                                <div className="p-3 bg-red-500/10 rounded-xl text-red-500 border border-red-500/20"><Activity size={20} /></div>
                                <h4 className="text-sm font-black text-white uppercase tracking-tight leading-snug">Critically Low Shortlist: Accenture Drive Round 1 results show only 12% pass. Investigation required.</h4>
                            </div>
                            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #22d3ee 1px, transparent 1px)', backgroundSize: '16px 16px' }} />
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}

import { ChevronRight } from 'lucide-react';
