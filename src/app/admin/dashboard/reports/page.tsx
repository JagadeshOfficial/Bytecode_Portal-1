"use client";

import { useState } from 'react';
import AdvancedModuleLayout from '@/components/dashboard/AdvancedModuleLayout';
import { motion } from 'framer-motion';
import {
    BarChart3,
    PieChart,
    Activity,
    Users,
    Calendar,
    DollarSign,
    TrendingUp,
    Download,
    FileText,
    Search,
    Filter,
    ChevronDown,
    ArrowUpRight,
    ArrowDownRight,
    MousePointer2,
    Layers,
    Briefcase
} from 'lucide-react';

export default function AdminReportsPage() {
    const [activeTab, setActiveTab] = useState('attendance');

    const stats = [
        { label: "Reports Generated", value: "245", icon: FileText, color: "#3b82f6", trend: "+12 Today" },
        { label: "Avg. Attendance", value: "84%", icon: Users, color: "#10b981", trend: "+2% growth" },
        { label: "Fee Realization", value: "92%", icon: DollarSign, color: "#a855f7", trend: "High" },
        { label: "Placement Rate", value: "78%", icon: Briefcase, color: "#f59e0b", trend: "+5% vs Q1" },
    ];

    return (
        <AdvancedModuleLayout
            title="Operational Intelligence & Reports"
            subtitle="Comprehensive data analytics and institutional performance reporting across all parameters."
            stats={stats}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            role="admin"
            tabs={[
                { id: 'attendance', label: 'Student Attendance', icon: Users },
                { id: 'finance', label: 'Fee & Collections', icon: DollarSign },
                { id: 'performance', label: 'Batch Performance', icon: Activity },
                { id: 'export', label: 'Report Archive', icon: Download },
            ]}
        >
            {activeTab === 'attendance' && (
                <div className="space-y-8">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-4">
                            <div className="p-4 bg-[#0a0a1a] border border-white/10 rounded-2xl flex items-center gap-3">
                                <Calendar size={18} className="text-emerald-400" />
                                <div className="text-xs font-bold text-white uppercase tracking-widest">Feb 2026 Operations</div>
                                <ChevronDown size={14} className="text-slate-500" />
                            </div>
                        </div>
                        <button className="flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 rounded-2xl text-white font-bold text-xs uppercase tracking-[0.2em] hover:bg-white/10 transition-all">
                            <Download size={16} /> DOWNLOAD FULL LOG
                        </button>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-6">
                            <div className="p-8 bg-[#0a0a1a]/60 border border-white/5 rounded-[2.5rem] backdrop-blur-md relative overflow-hidden h-[400px]">
                                <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-600/5 blur-[100px] -mr-48 -mt-48 rounded-full" />
                                <div className="flex justify-between items-start mb-12">
                                    <div>
                                        <h3 className="text-xl font-bold text-white mb-1">Attendance Volatility</h3>
                                        <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Across All Active Batches</p>
                                    </div>
                                    <div className="flex gap-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-emerald-500" />
                                            <span className="text-[10px] font-bold text-slate-400">ACTUAL</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-slate-700" />
                                            <span className="text-[10px] font-bold text-slate-400">TARGET</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Simulated Chart UI */}
                                <div className="absolute inset-x-8 bottom-12 h-48 flex items-end justify-between gap-4">
                                    {[65, 80, 45, 90, 75, 85, 95, 60, 82, 77, 88, 92].map((val, i) => (
                                        <div key={i} className="flex-1 group relative">
                                            <motion.div
                                                initial={{ height: 0 }}
                                                animate={{ height: `${val}%` }}
                                                className={`w-full rounded-t-lg transition-all duration-500 ${val < 50 ? 'bg-red-500/40 border-t border-red-400' : 'bg-emerald-500/40 border-t border-emerald-400 group-hover:bg-emerald-400'
                                                    }`}
                                            />
                                            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[9px] font-bold text-slate-600">D{i + 1}</div>
                                            {/* Tooltip */}
                                            <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-white text-[#030014] px-2 py-1 rounded text-[9px] font-black opacity-0 group-hover:opacity-100 transition-all pointer-events-none transform translate-y-2 group-hover:translate-y-0">
                                                {val}%
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="p-6 bg-[#0a0a1a]/60 border border-red-500/10 rounded-3xl backdrop-blur-md">
                                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center justify-between">
                                        Low Attendance Warning
                                        <TrendingUp className="w-4 h-4 text-red-500 rotate-180" />
                                    </h4>
                                    <div className="space-y-4">
                                        {[
                                            { batch: "B22-REACT", rate: "42%", delta: "-12%" },
                                            { batch: "PY-L08", rate: "38%", delta: "-18%" },
                                        ].map((item, i) => (
                                            <div key={i} className="flex items-center justify-between p-3 bg-white/5 border border-white/5 rounded-2xl group cursor-pointer hover:bg-white/10 transition-colors">
                                                <div>
                                                    <div className="text-xs font-bold text-white group-hover:text-red-400 transition-colors">{item.batch}</div>
                                                    <div className="text-[10px] text-slate-500">Last 03-day avg.</div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-sm font-bold text-red-500">{item.rate}</div>
                                                    <div className="text-[9px] font-bold text-red-500/60 uppercase">{item.delta}</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="p-6 bg-[#0a0a1a]/60 border border-emerald-500/10 rounded-3xl backdrop-blur-md">
                                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center justify-between">
                                        Peak Performers
                                        <TrendingUp className="w-4 h-4 text-emerald-500" />
                                    </h4>
                                    <div className="space-y-4">
                                        {[
                                            { batch: "JAVA-J05", rate: "98%", delta: "+4%" },
                                            { batch: "SYS-P12", rate: "94%", delta: "+8%" },
                                        ].map((item, i) => (
                                            <div key={i} className="flex items-center justify-between p-3 bg-white/5 border border-white/5 rounded-2xl group cursor-pointer hover:bg-white/10 transition-colors">
                                                <div>
                                                    <div className="text-xs font-bold text-white group-hover:text-emerald-400 transition-colors">{item.batch}</div>
                                                    <div className="text-[10px] text-slate-500">Perfect Streak</div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-sm font-bold text-emerald-500">{item.rate}</div>
                                                    <div className="text-[9px] font-bold text-emerald-500/60 uppercase">{item.delta}</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-8">
                            <div className="p-8 bg-gradient-to-br from-violet-600/20 to-fuchsia-600/20 border border-white/10 rounded-[2.5rem] backdrop-blur-xl group cursor-pointer overflow-hidden relative">
                                <div className="absolute top-0 right-0 p-4">
                                    <MousePointer2 size={32} className="text-white/20 group-hover:translate-x-2 group-hover:-translate-y-2 transition-transform duration-500" />
                                </div>
                                <h4 className="text-lg font-bold text-white mb-2 underline decoration-violet-500/50 underline-offset-8">AI PREDICTOR</h4>
                                <p className="text-xs text-slate-300 mb-6 leading-relaxed">Based on current trends, <b>Batch B22</b> may experience a 15% churn in final month due to session conflicts.</p>
                                <button className="w-full py-4 bg-white text-black font-black text-[10px] tracking-[0.2em] uppercase rounded-xl hover:scale-105 transition-all">
                                    GENERATE RISK AUDIT
                                </button>
                            </div>

                            <div className="p-8 bg-[#0a0a1a]/60 border border-white/5 rounded-[2.5rem] backdrop-blur-md">
                                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-2 mb-6">Recent Exports</h4>
                                <div className="space-y-4">
                                    {[
                                        { name: "Monthly Fee Reconciliation", type: "XLSX", icon: DollarSign },
                                        { name: "Academic Quality Audit", type: "PDF", icon: Layers },
                                        { name: "Placement Conversion Log", type: "CSV", icon: Briefcase },
                                    ].map((report, i) => (
                                        <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 hover:bg-white/10 transition-all cursor-pointer border border-white/5">
                                            <div className="p-3 bg-white/5 border border-white/10 rounded-xl text-slate-400 group-hover:text-white transition-colors">
                                                <report.icon size={16} />
                                            </div>
                                            <div>
                                                <div className="text-[11px] font-bold text-white truncate w-32">{report.name}</div>
                                                <div className="text-[8px] text-slate-500 font-bold uppercase tracking-widest">{report.type} • 2MB</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AdvancedModuleLayout>
    );
}
