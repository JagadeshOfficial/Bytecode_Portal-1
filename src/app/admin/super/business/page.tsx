"use client";

import { useState } from 'react';
import AdvancedModuleLayout from '@/components/dashboard/AdvancedModuleLayout';
import { motion } from 'framer-motion';
import {
    Briefcase,
    Building2,
    Users,
    TrendingUp,
    Clock,
    UserCheck,
    CheckCircle,
    Calendar,
    Settings,
    MoreVertical,
    FileText,
    PieChart,
    Layers,
    MoveRight,
    MapPin,
    AlertCircle
} from 'lucide-react';

export default function BusinessPage() {
    const [activeTab, setActiveTab] = useState('overview');

    const stats = [
        { label: "Total Employees", value: "156", icon: Users, color: "#3b82f6", trend: "+4% MoM" },
        { label: "Active Today", value: "142", icon: UserCheck, color: "#10b981", trend: "98% Att." },
        { label: "On Leave", value: "14", icon: Clock, color: "#f59e0b" },
        { label: "Open Roles", value: "8", icon: Briefcase, color: "#8b5cf6", trend: "Hiring" },
    ];

    const employees = [
        { name: "Sarah Connor", role: "HR Manager", dept: "HR", status: "Active", progress: 95, avatar: "SC" },
        { name: "John Wick", role: "Security Lead", dept: "IT", status: "Active", progress: 100, avatar: "JW" },
        { name: "Tony Stark", role: "CTO", dept: "Management", status: "Remote", progress: 85, avatar: "TS" },
        { name: "Bruce Banner", role: "Research Head", dept: "R&D", status: "On Leave", progress: 0, avatar: "BB" },
        { name: "Peter Parker", role: "Intern", dept: "Engineering", status: "Active", progress: 92, avatar: "PP" },
    ];

    const kanbanStages = [
        { title: 'Applied', color: 'border-slate-500', items: ['Frontend Dev #1', 'QA Engineer #2'] },
        { title: 'Screening', color: 'border-blue-500', items: ['Backend Dev #3', 'Sales Lead #4'] },
        { title: 'Interview', color: 'border-violet-500', items: ['UX Designer #5'] },
        { title: 'Offer', color: 'border-emerald-500', items: ['Product Manager #6'] },
    ];

    return (
        <AdvancedModuleLayout
            title="Business & Employees"
            subtitle="Manage organizational structure, workforce, and operational efficiency."
            stats={stats}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            tabs={[
                { id: 'overview', label: 'Overview', icon: PieChart },
                { id: 'employees', label: 'Directory', icon: Users },
                { id: 'attendance', label: 'Attendance', icon: Clock },
                { id: 'hiring', label: 'Recruitment', icon: Briefcase },
            ]}
        >
            {activeTab === 'overview' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="lg:col-span-2 bg-slate-900/50 border border-white/5 rounded-2xl p-6 backdrop-blur-sm"
                    >
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                <Users className="text-blue-400" /> Employee Directory
                            </h3>
                            <button className="text-xs text-blue-400 font-bold hover:underline">View Full List</button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {employees.slice(0, 4).map((emp, i) => (
                                <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/5 hover:border-blue-500/30 transition-all cursor-pointer group">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-white font-bold text-xs ring-2 ring-slate-900 group-hover:scale-110 transition-transform">
                                        {emp.avatar}
                                    </div>
                                    <div>
                                        <div className="font-bold text-white group-hover:text-blue-400 transition-colors">{emp.name}</div>
                                        <div className="text-xs text-slate-400">{emp.role} • {emp.dept}</div>
                                    </div>
                                    <div className="ml-auto flex flex-col items-end gap-1">
                                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${emp.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400' :
                                                emp.status === 'Remote' ? 'bg-blue-500/10 text-blue-400' : 'bg-amber-500/10 text-amber-400'
                                            }`}>{emp.status}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    <div className="flex flex-col gap-6">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-slate-900/50 border border-white/5 rounded-2xl p-6 backdrop-blur-sm relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-4 opacity-5"><Building2 size={120} /></div>
                            <h3 className="text-lg font-bold text-white mb-4 relative z-10">Headquarters</h3>
                            <div className="space-y-4 relative z-10">
                                <div className="flex items-start gap-3">
                                    <MapPin className="text-blue-400 mt-1" size={16} />
                                    <div>
                                        <div className="font-bold text-white text-sm">Tech Park Efficiency Tower</div>
                                        <div className="text-xs text-slate-400">Bangalore, India</div>
                                    </div>
                                </div>
                                <div className="p-3 bg-white/5 rounded-xl border border-white/5 text-xs text-slate-300 flex justify-between items-center">
                                    <span>Office Capacity</span>
                                    <span className="font-bold text-white">85% Full</span>
                                </div>
                                <div className="text-xs font-mono text-slate-400">
                                    <div className="flex justify-between mb-1"><span>Network Status</span><span className="text-emerald-400">Online</span></div>
                                    <div className="flex justify-between"><span>Security System</span><span className="text-emerald-400">Armed</span></div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            )}

            {activeTab === 'hiring' && (
                <div className="h-[600px] overflow-x-auto pb-4">
                    <div className="flex gap-6 h-full min-w-[1000px]">
                        {kanbanStages.map((stage, i) => (
                            <div key={i} className="flex-1 flex flex-col min-w-[280px] bg-slate-900/30 rounded-2xl border border-white/5 p-4">
                                <div className={`pb-3 mb-3 border-b-2 ${stage.color} flex justify-between items-center`}>
                                    <span className="font-bold text-white text-sm uppercase tracking-wide">{stage.title}</span>
                                    <span className="bg-white/10 px-2 py-0.5 rounded text-xs font-mono text-slate-300">{stage.items.length}</span>
                                </div>
                                <div className="flex-1 overflow-y-auto space-y-3 custom-scrollbar pr-1">
                                    {stage.items.map((item, j) => (
                                        <motion.div
                                            key={j}
                                            whileHover={{ y: -2 }}
                                            className="bg-slate-800 p-4 rounded-xl border border-white/5 hover:border-blue-500/30 shadow-lg cursor-grab active:cursor-grabbing group relative"
                                        >
                                            <div className="flex justify-between mb-2">
                                                <span className="text-xs font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded">DEV</span>
                                                <button className="text-slate-500 hover:text-white"><MoreVertical size={14} /></button>
                                            </div>
                                            <div className="font-bold text-white text-sm mb-1">{item}</div>
                                            <div className="text-xs text-slate-400 mb-3">Applied 2d ago</div>
                                            <div className="flex items-center justify-between pt-3 border-t border-white/5">
                                                <div className="flex -space-x-2">
                                                    <div className="w-6 h-6 rounded-full bg-slate-600 border-2 border-slate-800"></div>
                                                    <div className="w-6 h-6 rounded-full bg-slate-500 border-2 border-slate-800"></div>
                                                </div>
                                                <div className="flex gap-2">
                                                    <button className="p-1 hover:bg-white/10 rounded text-slate-400 hover:text-emerald-400"><CheckCircle size={14} /></button>
                                                    <button className="p-1 hover:bg-white/10 rounded text-slate-400 hover:text-red-400"><AlertCircle size={14} /></button>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                    <button className="w-full py-2 border border-dashed border-white/10 rounded-xl text-xs font-bold text-slate-500 hover:text-blue-400 hover:border-blue-500/30 transition-colors">
                                        + Add Candidate
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {activeTab === 'attendance' && (
                <div className="bg-slate-900/50 border border-white/5 rounded-2xl p-8 backdrop-blur-sm">
                    <div className="flex justify-between items-end mb-8">
                        <div>
                            <h3 className="text-xl font-bold text-white mb-1">Attendance Heatmap</h3>
                            <p className="text-sm text-slate-400">Visualizing workforce presence over the last 30 days.</p>
                        </div>
                        <div className="flex gap-4 text-xs font-bold">
                            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-emerald-500/20 border border-emerald-500/50"></div> Present</div>
                            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-amber-500/20 border border-amber-500/50"></div> Late</div>
                            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-red-500/20 border border-red-500/50"></div> Absent</div>
                        </div>
                    </div>
                    {/* Simulated Heatmap Grid */}
                    <div className="grid grid-cols-12 gap-2">
                        {Array.from({ length: 48 }).map((_, i) => {
                            const status = Math.random();
                            let colorClass = 'bg-emerald-500/20 border-emerald-500/30 hover:bg-emerald-500/40';
                            if (status > 0.8) colorClass = 'bg-amber-500/20 border-amber-500/30 hover:bg-amber-500/40';
                            if (status > 0.95) colorClass = 'bg-red-500/20 border-red-500/30 hover:bg-red-500/40';

                            return (
                                <motion.div
                                    key={i}
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: i * 0.01 }}
                                    className={`aspect-square rounded-lg border ${colorClass} cursor-pointer relative group`}
                                >
                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <span className="text-[10px] font-bold text-white">{Math.floor(Math.random() * 30 + 1)}</span>
                                    </div>
                                </motion.div>
                            )
                        })}
                    </div>
                </div>
            )}
        </AdvancedModuleLayout>
    );
}
