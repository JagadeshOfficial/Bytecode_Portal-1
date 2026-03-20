"use client";

import { useState } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { motion, AnimatePresence } from 'framer-motion';
import {
    BarChart3,
    Users,
    Search,
    Filter,
    Download,
    Calendar,
    CheckCircle2,
    XCircle,
    Clock,
    UserCheck,
    FilePieChart,
    TrendingUp,
    MoreVertical,
    ChevronRight,
    ArrowUpRight,
    Mail,
    Phone,
    Award,
    Activity
} from 'lucide-react';

const ATTENDANCE_DATA = [
    { student: "Rahul Sharma", batch: "Java #22", attendance: "94%", active: "Yes", lastSeen: "10m ago" },
    { student: "Priya Das", batch: "Java #22", attendance: "88%", active: "No", lastSeen: "2h ago" },
    { student: "Aman Verma", batch: "Java #21", attendance: "72%", active: "Yes", lastSeen: "Just now" },
    { student: "Sneha Reddy", batch: "Python #08", attendance: "98%", active: "Yes", lastSeen: "5m ago" },
];

const ANALYTICS_GRID = [
    { label: "Avg. Attendance", value: "88.4%", trend: "+2.1%", icon: UserCheck, color: "text-[#22d3ee]", bg: "bg-[#22d3ee]/10" },
    { label: "Lab Completion", value: "76%", trend: "-4.5%", icon: Activity, color: "text-[#d946ef]", bg: "bg-[#d946ef]/10" },
    { label: "Test Competency", value: "82/100", trend: "+12%", icon: Award, color: "text-emerald-400", bg: "bg-emerald-400/10" },
    { label: "Dropout Risk", value: "05", sub: "Low Alert", icon: XCircle, color: "text-red-400", bg: "bg-red-400/10" },
];

export default function TrainerTrackingPage() {
    return (
        <DashboardLayout role="trainer">
            <div className="flex flex-col gap-8 pb-10">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                        <h1 className="text-4xl font-[Rajdhani] font-bold text-white tracking-widest uppercase">
                            Intelligence <span className="text-[#22d3ee]">Tracker</span>
                        </h1>
                        <p className="text-slate-400 font-medium mt-1">Monitor enrollment metrics, student behavior, attendance logs, and performance outliers.</p>
                    </div>
                </div>

                {/* KPI Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {ANALYTICS_GRID.map((stat, i) => (
                        <div key={i} className={`${stat.bg} border border-white/5 rounded-3xl p-6 backdrop-blur-xl group hover:border-white/20 transition-all`}>
                            <div className="flex justify-between items-start mb-4">
                                <div className={`p-2.5 rounded-xl bg-[#0a0a1a]/60 border border-white/10 ${stat.color}`}>
                                    <stat.icon size={20} />
                                </div>
                                {stat.trend && <div className={`text-[10px] font-black uppercase tracking-tighter ${stat.trend.startsWith('+') ? 'text-emerald-400' : 'text-red-400'}`}>{stat.trend}</div>}
                            </div>
                            <div className="text-2xl font-[Rajdhani] font-black text-white">{stat.value}</div>
                            <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">{stat.label}</div>
                            {stat.sub && <div className="text-[9px] text-red-400 font-black mt-2 uppercase flex items-center gap-1"><Activity size={10} /> {stat.sub}</div>}
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Detailed Attendance/Status Table */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-[#0a0a1a]/60 border border-white/5 rounded-[2.5rem] p-8 backdrop-blur-xl">
                            <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-10">
                                <h3 className="text-2xl font-black text-white uppercase tracking-tight">Student Status Matrix</h3>
                                <div className="flex gap-4 w-full md:w-auto">
                                    <div className="relative flex-1 md:w-64">
                                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                                        <input
                                            type="text"
                                            placeholder="Search student..."
                                            className="w-full bg-[#050510] border border-white/10 rounded-xl py-3 pl-10 pr-4 text-xs text-white focus:outline-none focus:border-[#22d3ee] transition-all font-bold"
                                        />
                                    </div>
                                    <button className="p-3 bg-white/5 border border-white/10 rounded-xl text-slate-500 hover:text-white transition-all"><Filter size={18} /></button>
                                </div>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] border-b border-white/5">
                                            <th className="pb-6 pl-4 font-black">STUDENT</th>
                                            <th className="pb-6 px-4 font-black">BATCH</th>
                                            <th className="pb-6 px-4 font-black">ATTENDANCE</th>
                                            <th className="pb-6 px-4 font-black">STATUS</th>
                                            <th className="pb-6 pr-4 font-black text-right">ACTION</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/[0.03]">
                                        {ATTENDANCE_DATA.map((student, i) => (
                                            <tr key={i} className="group hover:bg-white/[0.02] transition-all">
                                                <td className="py-6 pl-4">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#22d3ee]/20 to-[#7c3aed]/20 flex items-center justify-center text-xs font-black text-white border border-white/10">
                                                            {student.student.split(' ').map(n => n[0]).join('')}
                                                        </div>
                                                        <div>
                                                            <div className="text-sm font-bold text-white group-hover:text-[#22d3ee] transition-colors">{student.student}</div>
                                                            <div className="text-[9px] text-slate-600 font-bold uppercase mt-1">Last seen: {student.lastSeen}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-6 px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">{student.batch}</td>
                                                <td className="py-6 px-4">
                                                    <div className="flex flex-col gap-1.5 w-32">
                                                        <div className="flex justify-between text-[9px] font-black text-slate-500 uppercase">
                                                            <span>LOGS</span>
                                                            <span className={parseInt(student.attendance) > 90 ? 'text-emerald-400' : 'text-amber-400'}>{student.attendance}</span>
                                                        </div>
                                                        <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                                                            <div className={`h-full ${parseInt(student.attendance) > 90 ? 'bg-emerald-400' : 'bg-amber-400'}`} style={{ width: student.attendance }} />
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-6 px-4">
                                                    <span className={`px-2 py-1 rounded-lg text-[8px] font-black tracking-widest uppercase ${student.active === 'Yes' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-white/5 text-slate-600'}`}>
                                                        {student.active === 'Yes' ? 'CONNECTED' : 'OFFLINE'}
                                                    </span>
                                                </td>
                                                <td className="py-6 pr-4 text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <button className="p-2.5 rounded-xl bg-white/5 border border-white/5 text-slate-500 hover:text-white hover:bg-[#22d3ee] hover:text-black transition-all"><Mail size={16} /></button>
                                                        <button className="p-2.5 rounded-xl bg-white/5 border border-white/5 text-slate-500 hover:text-white hover:bg-white/10 transition-all"><ChevronRight size={16} /></button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* Performance Reports & Alerts */}
                    <div className="flex flex-col gap-6">
                        <div className="bg-[#0a0a1a]/60 border border-white/5 rounded-[2.5rem] p-8 backdrop-blur-xl">
                            <h3 className="text-xl font-bold text-white mb-8 flex items-center gap-3 uppercase tracking-tight">
                                <FilePieChart className="text-[#22d3ee]" size={24} />
                                Analytics Hub
                            </h3>
                            <div className="space-y-6">
                                {[
                                    { label: "Attendance Report", sub: "Monthly Log Summary", format: "PDF", size: "1.2MB" },
                                    { label: "Performance Bell Curve", sub: "Batch #22 Progression", format: "Excel", size: "640KB" },
                                    { label: "Student Risk Factor", sub: "Critical Behavior Data", format: "Data", size: "22KB" },
                                ].map((report, i) => (
                                    <div key={i} className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 group hover:border-[#22d3ee]/30 transition-all flex items-center justify-between cursor-pointer">
                                        <div className="flex items-center gap-4">
                                            <div className="p-3 bg-white/5 rounded-xl group-hover:bg-[#22d3ee]/10 group-hover:text-[#22d3ee] transition-all">
                                                <TrendingUp size={20} />
                                            </div>
                                            <div>
                                                <div className="text-sm font-bold text-white uppercase tracking-tight">{report.label}</div>
                                                <div className="text-[9px] text-slate-600 font-bold uppercase mt-1">{report.sub}</div>
                                            </div>
                                        </div>
                                        <Download size={18} className="text-slate-700 group-hover:text-white transition-colors" />
                                    </div>
                                ))}
                            </div>
                            <button className="w-full mt-10 py-5 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black text-slate-500 hover:text-white hover:border-[#22d3ee] transition-all uppercase tracking-[0.2em] shadow-xl">GENERATE CUSTOM REPORT</button>
                        </div>

                        {/* Recent Alerts Feed */}
                        <div className="p-8 bg-gradient-to-br from-[#0c051a] to-[#030014] border border-white/5 rounded-[2.5rem] relative overflow-hidden group">
                            <div className="flex gap-5 items-start relative z-10 mb-8">
                                <div className="p-4 bg-amber-500/10 rounded-2xl border border-amber-500/20 text-amber-500 shadow-xl">
                                    <Activity size={28} />
                                </div>
                                <h4 className="text-sm font-black text-white uppercase tracking-tight leading-snug">Continuous Absence Alert: 5 Students in Batch #21 haven't logged in for 3 days.</h4>
                            </div>
                            <div className="flex gap-3 relative z-10">
                                <button className="flex-1 py-3 bg-white text-black font-black text-[9px] tracking-widest rounded-xl transition-all uppercase">NOTIFY ALL</button>
                                <button className="flex-1 py-3 bg-white/5 border border-white/10 text-white font-black text-[9px] tracking-widest rounded-xl transition-all uppercase">DISMISS</button>
                            </div>
                            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #22d3ee 1px, transparent 1px)', backgroundSize: '16px 16px' }} />
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
