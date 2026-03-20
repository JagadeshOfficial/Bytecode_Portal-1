"use client";

import { useState } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { motion, AnimatePresence } from 'framer-motion';
import {
    BarChart3,
    PieChart,
    TrendingUp,
    Download,
    FilePieChart,
    Users,
    Briefcase,
    Building2,
    DollarSign,
    Target,
    ArrowUpRight,
    ArrowDownRight,
    Search,
    Filter,
    Table,
    Award,
    Globe,
    Activity
} from 'lucide-react';

const REPORT_CARDS = [
    { title: "Company-wise Selections", type: "Distribution", items: "48 MNCs", change: "+12.4%", trend: "up" },
    { title: "Salary Analytics", type: "CTC Index", items: "8.2L Avg", change: "+5.1%", trend: "up" },
    { title: "Role Distribution", type: "Job Family", items: "12 Categories", change: "-2.1%", trend: "down" },
];

const ANALYTICS_DATA = [
    { label: "Full Stack Java", selections: 145, avgPackage: "7.2 LPA", growth: "+18%" },
    { label: "AI/ML Engineers", selections: 82, avgPackage: "9.5 LPA", growth: "+32%" },
    { label: "Frontend React", selections: 112, avgPackage: "5.8 LPA", growth: "+12%" },
    { label: "DevOps & Cloud", selections: 56, avgPackage: "8.1 LPA", growth: "+24%" },
];

export default function PlacementReportsPage() {
    return (
        <DashboardLayout role="hr">
            <div className="flex flex-col gap-8 pb-10">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                        <h1 className="text-4xl font-[Rajdhani] font-bold text-white tracking-widest uppercase">
                            Placement <span className="text-cyan-400">Intelligence</span>
                        </h1>
                        <p className="text-slate-400 font-medium mt-1">Cross-sectional analytics on hiring trends, package distribution, and institutional ROI.</p>
                    </div>
                    <div className="flex gap-4">
                        <button className="flex items-center gap-2 px-6 py-4 bg-white/5 border border-white/10 text-white font-black rounded-2xl hover:bg-white/10 transition-all uppercase text-[10px] tracking-widest">
                            <Download size={18} /> EXPORT PDF REPORT
                        </button>
                    </div>
                </div>

                {/* Report KPI Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {REPORT_CARDS.map((report, i) => (
                        <div key={i} className="bg-[#0a0a1a]/60 border border-white/5 rounded-[2.5rem] p-8 backdrop-blur-xl relative overflow-hidden group hover:border-cyan-500/20 transition-all">
                            <div className="flex justify-between items-start mb-6">
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">{report.type}</span>
                                    <h3 className="text-xl font-black text-white uppercase tracking-tight">{report.title}</h3>
                                </div>
                                <div className={`p-2 rounded-lg bg-[#050510] border border-white/10 ${report.trend === 'up' ? 'text-emerald-400' : 'text-red-400'}`}>
                                    {report.trend === 'up' ? <ArrowUpRight size={20} /> : <ArrowDownRight size={20} />}
                                </div>
                            </div>
                            <div className="flex items-end justify-between">
                                <div className="text-3xl font-black text-white font-[Rajdhani]">{report.items}</div>
                                <div className={`text-xs font-black uppercase tracking-widest ${report.trend === 'up' ? 'text-emerald-500' : 'text-red-500'}`}>
                                    {report.change} vs LY
                                </div>
                            </div>
                            <div className="mt-8 h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                <div className={`h-full ${report.trend === 'up' ? 'bg-emerald-500' : 'bg-red-500'}`} style={{ width: '70%' }} />
                            </div>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Insights Table */}
                    <div className="lg:col-span-3">
                        <div className="bg-[#0a0a1a]/60 border border-white/5 rounded-[2.5rem] p-8 backdrop-blur-xl h-full">
                            <div className="flex justify-between items-center mb-10">
                                <h3 className="text-2xl font-black text-white uppercase tracking-tight">Hiring Vertical Analytics</h3>
                                <div className="flex gap-3">
                                    <button className="p-3 bg-white/5 border border-white/10 rounded-xl text-slate-500 hover:text-white transition-all"><Search size={18} /></button>
                                    <button className="p-3 bg-white/5 border border-white/10 rounded-xl text-slate-500 hover:text-white transition-all"><Filter size={18} /></button>
                                </div>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] border-b border-white/5">
                                            <th className="pb-6 pl-4 font-black">COURSE VERTICAL</th>
                                            <th className="pb-6 px-4 font-black text-center">TOTAL SELECTIONS</th>
                                            <th className="pb-6 px-4 font-black text-center">AVERAGE PACKAGE</th>
                                            <th className="pb-6 px-4 font-black text-center">YOY GROWTH</th>
                                            <th className="pb-6 pr-4 font-black text-right">METRICS</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/[0.03]">
                                        {ANALYTICS_DATA.map((data, i) => (
                                            <tr key={i} className="group hover:bg-white/[0.01] transition-all cursor-pointer">
                                                <td className="py-6 pl-4">
                                                    <div className="flex items-center gap-4">
                                                        <div className="p-3 rounded-xl bg-[#0a0a1a] border border-white/10 text-cyan-400 group-hover:scale-110 transition-transform">
                                                            <Target size={18} />
                                                        </div>
                                                        <div className="text-sm font-black text-white uppercase tracking-tight group-hover:text-cyan-400 transition-colors">{data.label}</div>
                                                    </div>
                                                </td>
                                                <td className="py-6 px-4 text-center">
                                                    <span className="text-lg font-black text-white">{data.selections}</span>
                                                    <div className="text-[9px] font-bold text-slate-600 uppercase mt-0.5 tracking-widest">Offers</div>
                                                </td>
                                                <td className="py-6 px-4 text-center">
                                                    <span className="text-lg font-black text-emerald-400">{data.avgPackage}</span>
                                                    <div className="text-[9px] font-bold text-slate-600 uppercase mt-0.5 tracking-widest">CTC AVG</div>
                                                </td>
                                                <td className="py-6 px-4 text-center">
                                                    <span className="text-xs font-black text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-lg uppercase tracking-widest">{data.growth}</span>
                                                </td>
                                                <td className="py-6 pr-4 text-right">
                                                    <button className="p-3 bg-white/5 border border-white/10 rounded-xl text-slate-600 hover:text-white transition-all"><FilePieChart size={18} /></button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* Quick Breakdown Sidebar */}
                    <div className="lg:col-span-1 space-y-8">
                        <div className="bg-[#0a0a1a]/60 border border-white/5 rounded-[2.5rem] p-8 backdrop-blur-xl">
                            <h3 className="text-xl font-bold text-white mb-8 uppercase tracking-tight">Status breakdown</h3>
                            <div className="space-y-8">
                                {[
                                    { label: "Tier-1 MNCs", val: 35, color: "bg-cyan-400" },
                                    { label: "Mid-Range", val: 50, color: "bg-purple-400" },
                                    { label: "Product Startups", val: 15, color: "bg-amber-400" },
                                ].map((stat, i) => (
                                    <div key={i} className="space-y-3">
                                        <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                                            <span className="text-slate-400">{stat.label}</span>
                                            <span className="text-white">{stat.val}%</span>
                                        </div>
                                        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
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

                        <div className="p-8 bg-gradient-to-br from-[#130a30] to-[#0a0a1a] border border-cyan-500/20 rounded-[2.5rem] relative overflow-hidden group text-center flex flex-col items-center">
                            <div className="p-4 bg-cyan-500/10 rounded-2xl border border-cyan-500/20 text-cyan-400 mb-6 group-hover:scale-110 transition-transform"><Award size={32} /></div>
                            <h4 className="text-lg font-black text-white uppercase tracking-tight mb-2">Institutional ROI</h4>
                            <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest leading-relaxed">Our average placement ROI has increased by 22% this fiscal year due to strategic corporate alliances.</p>
                            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #22d3ee 1px, transparent 1px)', backgroundSize: '16px 16px' }} />
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}

import { ChevronDown } from 'lucide-react';
