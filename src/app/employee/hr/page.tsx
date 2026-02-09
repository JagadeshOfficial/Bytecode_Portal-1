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
    ExternalLink
} from 'lucide-react';

const ACTIVE_DRIVES = [
    { company: "TCS", role: "Digital/Ninja", students: 120, date: "15 Feb", status: "Active" },
    { company: "Accenture", role: "ASE", students: 85, date: "18 Feb", status: "Registration" },
    { company: "Capgemini", role: "Analyst", students: 45, date: "22 Feb", status: "Evaluation" },
];

const PLACED_RECENTLY = [
    { student: "Ankita Roy", company: "Infosys", package: "5.5 LPA", type: "On-Campus" },
    { student: "Vivek Singh", company: "Cisco", package: "18.2 LPA", type: "Off-Campus" },
    { student: "Samir Sen", company: "Zomato", package: "12 LPA", type: "PPO" },
];

export default function PlacementOfficerDashboard() {
    return (
        <DashboardLayout role="hr">
            <div className="flex flex-col gap-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-[Rajdhani] font-bold text-white tracking-widest uppercase">
                            Placement <span className="text-[#22d3ee]">HQ Hub</span>
                        </h1>
                        <p className="text-[var(--text-dim)]">Manage hiring drives, corporate relations, and student selections.</p>
                    </div>
                    <div className="flex gap-3">
                        <button className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white font-bold hover:bg-white/10 transition-all">
                            <Plus className="w-4 h-4" /> Add Company
                        </button>
                        <button className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-[#7c3aed] to-[#d946ef] rounded-xl text-white font-bold shadow-lg hover:scale-105 transition-all">
                            <Zap className="w-4 h-4" /> Launch Drive
                        </button>
                    </div>
                </div>

                {/* KPI Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                        { label: "Eligible Students", value: "842", trend: "High Priority", icon: Users, color: "text-[#22d3ee]" },
                        { label: "Active Drives", value: "12", trend: "+3 This Week", icon: Briefcase, color: "text-[#7c3aed]" },
                        { label: "Conversion Rate", value: "78%", trend: "+5% vs LY", icon: TrendingUp, color: "text-emerald-400" },
                        { label: "Partner MNCs", value: "48", trend: "Top Tier", icon: Building2, color: "text-[#d946ef]" },
                    ].map((stat, idx) => (
                        <div key={idx} className="bg-[rgba(19,10,48,0.5)] border border-[rgba(124,58,237,0.1)] rounded-2xl p-6 backdrop-blur-md">
                            <div className="flex justify-between items-center mb-4">
                                <stat.icon className={`w-6 h-6 ${stat.color}`} />
                                <span className="text-[10px] font-bold text-white bg-white/5 px-2 py-1 rounded-full">{stat.trend}</span>
                            </div>
                            <div className="text-3xl font-bold text-white font-[Rajdhani]">{stat.value}</div>
                            <div className="text-xs text-[var(--text-dim)] uppercase tracking-wider font-bold mt-1">{stat.label}</div>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Active Drives & Tracking */}
                    <div className="lg:col-span-2 flex flex-col gap-6">
                        <div className="bg-[rgba(19,10,48,0.5)] border border-[rgba(124,58,237,0.1)] rounded-2xl overflow-hidden backdrop-blur-md">
                            <div className="p-6 border-b border-[rgba(255,255,255,0.05)] flex justify-between items-center bg-[rgba(255,255,255,0.02)]">
                                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                    <Target className="w-5 h-5 text-[#22d3ee]" />
                                    Current Hiring Campaigns
                                </h3>
                                <div className="flex gap-2">
                                    <button className="p-2 hover:bg-white/5 rounded-lg transition-all"><Search className="w-4 h-4 text-[var(--text-dim)]" /></button>
                                    <button className="p-2 hover:bg-white/5 rounded-lg transition-all"><ExternalLink className="w-4 h-4 text-[var(--text-dim)]" /></button>
                                </div>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="border-b border-[rgba(255,255,255,0.05)]">
                                            <th className="p-4 text-xs font-bold text-[var(--text-dim)] uppercase">Company</th>
                                            <th className="p-4 text-xs font-bold text-[var(--text-dim)] uppercase">Job Role</th>
                                            <th className="p-4 text-xs font-bold text-[var(--text-dim)] uppercase">Applicants</th>
                                            <th className="p-4 text-xs font-bold text-[var(--text-dim)] uppercase">Drive Date</th>
                                            <th className="p-4 text-xs font-bold text-[var(--text-dim)] uppercase">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {ACTIVE_DRIVES.map((drive, i) => (
                                            <tr key={i} className="border-b border-[rgba(255,255,255,0.02)] hover:bg-[rgba(255,255,255,0.02)] transition-colors group cursor-pointer">
                                                <td className="p-4 font-bold text-white group-hover:text-[#22d3ee] transition-colors">{drive.company}</td>
                                                <td className="p-4 text-sm text-[var(--text-dim)]">{drive.role}</td>
                                                <td className="p-4 text-sm text-white font-mono">{drive.students}</td>
                                                <td className="p-4 text-sm text-[var(--text-dim)]">{drive.date}</td>
                                                <td className="p-4">
                                                    <span className={`px-2 py-1 rounded-lg text-[10px] font-bold border ${drive.status === 'Active' ? 'bg-[#7c3aed]/10 text-[#7c3aed] border-[#7c3aed]/20' :
                                                            drive.status === 'Registration' ? 'bg-[#22d3ee]/10 text-[#22d3ee] border-[#22d3ee]/20' :
                                                                'bg-amber-500/10 text-amber-500 border-amber-500/20'
                                                        }`}>
                                                        {drive.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Drive Management Tools */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-gradient-to-br from-[#130a30] to-[#0f0728] border border-blue-500/20 rounded-2xl p-6 hover:border-blue-500 transition-all cursor-pointer">
                                <div className="p-3 w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center mb-4 border border-blue-500/20">
                                    <Video className="w-6 h-6 text-blue-500" />
                                </div>
                                <h3 className="text-lg font-bold text-white mb-2">Interview Scheduler</h3>
                                <p className="text-xs text-[var(--text-dim)] leading-relaxed">Map panels, schedule Zoom/Teams links, and track technical rounds.</p>
                            </div>
                            <div className="bg-gradient-to-br from-[#130a30] to-[#0f0728] border border-emerald-500/20 rounded-2xl p-6 hover:border-emerald-500 transition-all cursor-pointer">
                                <div className="p-3 w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-4 border border-emerald-500/20">
                                    <BarChart className="w-6 h-6 text-emerald-500" />
                                </div>
                                <h3 className="text-lg font-bold text-white mb-2">Automated Cutoffs</h3>
                                <p className="text-xs text-[var(--text-dim)] leading-relaxed">Filter students based on MNC patterns, CGPA, and coding scores.</p>
                            </div>
                        </div>
                    </div>

                    {/* Left Sidebar: Recent Selections & Analytics */}
                    <div className="flex flex-col gap-6">
                        {/* Hall of Fame */}
                        <div className="bg-[rgba(19,10,48,0.5)] border border-[rgba(124,58,237,0.1)] rounded-2xl p-6 backdrop-blur-md">
                            <h3 className="text-lg font-bold text-white mb-6 uppercase tracking-widest flex items-center gap-2">
                                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                                Recent Selections
                            </h3>
                            <div className="space-y-4">
                                {PLACED_RECENTLY.map((placed, i) => (
                                    <div key={i} className="flex items-center gap-4 p-3 rounded-xl bg-white/5 border border-white/5">
                                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#10b981]/20 to-[#3b82f6]/20 flex items-center justify-center border border-white/10 text-xl">
                                            🎓
                                        </div>
                                        <div>
                                            <div className="text-sm font-bold text-white">{placed.student}</div>
                                            <div className="text-[10px] text-[var(--accent)] font-bold">{placed.company} • {placed.package}</div>
                                            <div className="text-[8px] text-[var(--text-dim)] uppercase mt-0.5">{placed.type}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <button className="w-full mt-6 py-2 border border-emerald-500/30 text-emerald-400 text-xs font-bold rounded-lg hover:bg-emerald-500 hover:text-white transition-all">
                                Generate Offer Report
                            </button>
                        </div>

                        {/* Deployment Success Analytics */}
                        <div className="bg-[rgba(19,10,48,0.5)] border border-[rgba(34,211,238,0.1)] rounded-2xl p-6 backdrop-blur-md">
                            <h3 className="text-lg font-bold text-white mb-4">Conversion Heatmap</h3>
                            <div className="space-y-5">
                                {[
                                    { label: "Technical Fitment", pct: 92, color: "bg-[#7c3aed]" },
                                    { label: "Communication Score", pct: 84, color: "bg-[#22d3ee]" },
                                    { label: "Aptitude Score", pct: 88, color: "bg-emerald-400" },
                                ].map((m, i) => (
                                    <div key={i}>
                                        <div className="flex justify-between text-[10px] font-bold text-[var(--text-dim)] mb-1 uppercase">
                                            {m.label} <span className="text-white">{m.pct}%</span>
                                        </div>
                                        <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                                            <div className={`h-full ${m.color}`} style={{ width: `${m.pct}%` }} />
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-8 p-4 rounded-xl bg-[rgba(124,58,237,0.1)] border border-[#7c3aed]/20">
                                <div className="flex items-center gap-3 mb-2">
                                    <PieChart className="w-4 h-4 text-[#7c3aed]" />
                                    <span className="text-xs font-bold text-white">ROI Analysis</span>
                                </div>
                                <p className="text-[10px] text-[var(--text-dim)]">Average salary package increased by 14% this quarter due to Tier-1 MNC drives.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
