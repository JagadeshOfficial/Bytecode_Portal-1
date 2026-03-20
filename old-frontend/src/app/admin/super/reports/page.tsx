"use client";

import { useState } from 'react';
import AdvancedModuleLayout from '@/components/dashboard/AdvancedModuleLayout';
import { motion } from 'framer-motion';
import {
    BarChart3,
    FileText,
    PieChart,
    Download,
    TrendingUp,
    Users,
    DollarSign,
    Calendar,
    ArrowDown
} from 'lucide-react';

export default function ReportsPage() {
    const [activeTab, setActiveTab] = useState('overview');

    const stats = [
        { label: "Reports Generated", value: "142", icon: FileText, color: "#3b82f6", trend: "+12 Today" },
        { label: "Data Points", value: "1.2M", icon: BarChart3, color: "#8b5cf6", trend: "Live Feed" },
        { label: "Scheduled Reports", value: "8", icon: Calendar, color: "#10b981", trend: "Automated" },
    ];

    const reports = [
        { title: "Monthly Financial Audit", type: "Financial", date: "Feb 01, 2026", size: "2.4 MB", author: "Finance Dept" },
        { title: "Student Performance Q1", type: "Academic", date: "Jan 28, 2026", size: "1.8 MB", author: "Academic Lead" },
        { title: "Campus Recruitment 2025", type: "Placement", date: "Jan 25, 2026", size: "3.5 MB", author: "Placement Cell" },
        { title: "Infrastructure Health Check", type: "Operational", date: "Jan 20, 2026", size: "850 KB", author: "IT Admin" },
        { title: "Quarterly Revenue Forecast", type: "Financial", date: "Jan 15, 2026", size: "1.2 MB", author: "CFO Office" },
    ];

    return (
        <AdvancedModuleLayout
            title="Reports & Analytics"
            subtitle="Deep data insights, AI-driven forecasts, and comprehensive reporting."
            stats={stats}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            tabs={[
                { id: 'overview', label: 'Dashboard', icon: PieChart },
                { id: 'library', label: 'Report Library', icon: FileText },
                { id: 'custom', label: 'Custom Builder', icon: TrendingUp },
            ]}
        >
            {activeTab === 'overview' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Main Analytics Canvas Placeholder */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-slate-900/50 border border-white/5 rounded-2xl p-6 backdrop-blur-sm lg:col-span-2 min-h-[400px] flex flex-col"
                    >
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                <TrendingUp className="text-blue-400" /> Revenue vs. Enrollment
                            </h3>
                            <div className="flex gap-2 text-xs">
                                <button className="px-3 py-1 bg-white/5 hover:bg-white/10 rounded-lg text-slate-300">1W</button>
                                <button className="px-3 py-1 bg-blue-600 text-white rounded-lg">1M</button>
                                <button className="px-3 py-1 bg-white/5 hover:bg-white/10 rounded-lg text-slate-300">3M</button>
                            </div>
                        </div>
                        <div className="flex-1 rounded-xl bg-gradient-to-b from-slate-800/50 to-transparent border border-white/5 relative overflow-hidden flex items-end justify-between px-4 pb-0 pt-10 gap-2">
                            {/* CSS Bar Chart Simulation */}
                            {[35, 45, 30, 60, 75, 50, 65, 80, 55, 70, 90, 65].map((h, i) => (
                                <div key={i} className="w-full bg-blue-500/20 rounded-t-sm hover:bg-blue-500/40 transition-colors relative group" style={{ height: `${h}%` }}>
                                    <div className="absolute top-0 w-full h-1 bg-blue-400 shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
                                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity border border-white/10 z-10 pointer-events-none">
                                        Data: {h}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-2 uppercase tracking-widest">
                            <span>Week 1</span><span>Week 2</span><span>Week 3</span><span>Week 4</span>
                        </div>
                    </motion.div>

                    {/* Report Cards Stack */}
                    <div className="flex flex-col gap-4">
                        <div className="flex justify-between items-center mb-2">
                            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Recent Exports</h3>
                            <button className="text-xs text-blue-400 hover:text-blue-300">View All</button>
                        </div>
                        {reports.slice(0, 4).map((report, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="bg-white/5 border border-white/5 rounded-xl p-4 hover:bg-white/10 hover:border-blue-500/30 transition-all group cursor-pointer"
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <div className={`p-2 rounded-lg ${report.type === 'Financial' ? 'bg-emerald-500/10 text-emerald-400' :
                                            report.type === 'Academic' ? 'bg-blue-500/10 text-blue-400' :
                                                report.type === 'Placement' ? 'bg-violet-500/10 text-violet-400' : 'bg-amber-500/10 text-amber-400'
                                        }`}>
                                        <FileText size={16} />
                                    </div>
                                    <button className="text-slate-500 hover:text-white"><ArrowDown size={16} /></button>
                                </div>
                                <h4 className="font-bold text-white text-sm mb-1 group-hover:text-blue-400 transition-colors">{report.title}</h4>
                                <div className="flex justify-between items-center text-[10px] text-slate-500 font-mono">
                                    <span>{report.date}</span>
                                    <span>{report.size}</span>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            )}
        </AdvancedModuleLayout>
    );
}
