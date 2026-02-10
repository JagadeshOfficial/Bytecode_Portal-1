"use client";

import { useState } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { motion, AnimatePresence } from 'framer-motion';
import {
    BookOpen,
    Upload,
    FileText,
    PlayCircle,
    Plus,
    Search,
    Filter,
    Folder,
    MoreVertical,
    CheckCircle2,
    Clock,
    Download,
    Eye,
    Trash2,
    Settings,
    Layers,
    FileCode,
    Video
} from 'lucide-react';

const COURSES = [
    { id: "C1", name: "Full Stack Java", batches: 3, items: 45, color: "text-amber-500", bg: "bg-amber-500/10" },
    { id: "C2", name: "Python AI/ML", batches: 2, items: 32, color: "text-blue-500", bg: "bg-blue-500/10" },
    { id: "C3", name: "React Frontend", batches: 1, items: 28, color: "text-cyan-500", bg: "bg-cyan-500/10" },
];

const RECENT_UPLOADS = [
    { name: "Microservices Deployment.pdf", type: "Document", course: "Java", size: "2.4 MB", date: "Today" },
    { name: "React Query Pro Tips.mp4", type: "Video", course: "React", size: "145 MB", date: "Yesterday" },
    { name: "SQL Practice Set.zip", type: "Lab", course: "Java", size: "12 MB", date: "Feb 08" },
];

export default function TrainerLMSPage() {
    const [selectedCourse, setSelectedCourse] = useState('C1');

    return (
        <DashboardLayout role="trainer">
            <div className="flex flex-col gap-8 pb-10">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                        <h1 className="text-4xl font-[Rajdhani] font-bold text-white tracking-widest uppercase">
                            LMS <span className="text-amber-500">Asset Vault</span>
                        </h1>
                        <p className="text-slate-400 font-medium mt-1">Curate course curriculum, upload technical assets, and distribute learning materials.</p>
                    </div>
                    <div className="flex gap-4">
                        <button className="px-6 py-4 bg-amber-500 hover:bg-amber-400 text-black font-black rounded-2xl shadow-xl shadow-amber-500/20 transition-all uppercase text-[10px] tracking-widest flex items-center gap-2">
                            <Plus size={18} /> NEW RESOURCE
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Courses Sidebar */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-[#0a0a1a]/60 border border-white/5 rounded-[2rem] p-6 backdrop-blur-xl">
                            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-6 px-2">Course Categories</h3>
                            <div className="space-y-3">
                                {COURSES.map((course) => (
                                    <button
                                        key={course.id}
                                        onClick={() => setSelectedCourse(course.id)}
                                        className={`w-full text-left p-4 rounded-2xl border transition-all group relative overflow-hidden ${selectedCourse === course.id
                                                ? 'bg-amber-500/10 border-amber-500/50 shadow-lg'
                                                : 'bg-white/[0.02] border-white/5 hover:border-white/20'
                                            }`}
                                    >
                                        <div className="flex items-center gap-4 relative z-10">
                                            <div className={`w-10 h-10 rounded-xl ${course.bg} ${course.color} flex items-center justify-center border border-white/5 group-hover:scale-110 transition-transform`}>
                                                <Layers size={20} />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="text-sm font-bold text-white group-hover:text-amber-500 transition-colors truncate uppercase tracking-tight">{course.name}</div>
                                                <div className="text-[10px] text-slate-500 font-bold uppercase mt-1">{course.items} Resources</div>
                                            </div>
                                        </div>
                                        {selectedCourse === course.id && (
                                            <div className="absolute top-0 right-0 h-full w-1 bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]" />
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Recent Activity Feed */}
                        <div className="bg-[#0a0a1a]/40 border border-white/5 rounded-[2rem] p-6">
                            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-6 px-2">Storage Status</h3>
                            <div className="space-y-4 px-2">
                                <div className="space-y-2">
                                    <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase">
                                        <span>Vault Capacity</span>
                                        <span>78%</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                        <div className="h-full bg-amber-500" style={{ width: '78%' }} />
                                    </div>
                                </div>
                                <p className="text-[9px] text-slate-600 font-bold uppercase leading-relaxed">Upgrade storage to avoid disruption in recording uploads.</p>
                            </div>
                        </div>
                    </div>

                    {/* Content Management Area */}
                    <div className="lg:col-span-3 flex flex-col gap-6">
                        {/* Summary Stats */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {[
                                { label: "Total Assignments", value: "124", icon: FileText, color: "text-amber-500", bg: "bg-amber-500/10" },
                                { label: "Published Videos", value: "82", icon: PlayCircle, color: "text-blue-400", bg: "bg-blue-500/10" },
                                { label: "Batch Access", value: "12 Live", icon: Folder, color: "text-emerald-400", bg: "bg-emerald-500/10" },
                            ].map((stat, i) => (
                                <div key={i} className={`${stat.bg} border border-white/5 rounded-3xl p-6 backdrop-blur-xl group hover:border-white/20 transition-all`}>
                                    <div className="flex justify-between items-start mb-4">
                                        <div className={`p-2.5 rounded-xl bg-[#0a0a1a]/60 border border-white/10 ${stat.color}`}>
                                            <stat.icon size={20} />
                                        </div>
                                        <button className="text-slate-600 hover:text-white transition-colors"><MoreVertical size={16} /></button>
                                    </div>
                                    <div className="text-2xl font-[Rajdhani] font-black text-white">{stat.value}</div>
                                    <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">{stat.label}</div>
                                </div>
                            ))}
                        </div>

                        {/* Search & Actions Bar */}
                        <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-[#0a0a1a]/60 border border-white/5 p-4 rounded-[2rem] backdrop-blur-xl">
                            <div className="relative w-full md:w-96">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                <input
                                    type="text"
                                    placeholder="Filter curriculum assets..."
                                    className="w-full bg-[#050510] border border-white/10 rounded-2xl py-3 pl-12 pr-6 text-sm text-white focus:outline-none focus:border-amber-500 transition-all font-bold"
                                />
                            </div>
                            <div className="flex gap-3">
                                <button className="p-3 bg-white/5 border border-white/10 rounded-xl text-slate-500 hover:text-white transition-all"><Filter size={20} /></button>
                                <button className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black text-slate-500 hover:text-white transition-all uppercase tracking-widest leading-none">BULK ACTIONS</button>
                            </div>
                        </div>

                        {/* Assets Table/List */}
                        <div className="bg-[#0a0a1a]/60 border border-white/5 rounded-[2.5rem] p-8 backdrop-blur-xl overflow-hidden">
                            <h3 className="text-xl font-bold text-white mb-8 uppercase tracking-tight">Recent Repository Activity</h3>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] border-b border-white/5">
                                            <th className="pb-6 pl-4 font-black">ASSET NAME</th>
                                            <th className="pb-6 px-4 font-black">TYPE</th>
                                            <th className="pb-6 px-4 font-black">COURSE</th>
                                            <th className="pb-6 px-4 font-black">SIZE</th>
                                            <th className="pb-6 pr-4 font-black text-right">CONTROLS</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/[0.03]">
                                        {RECENT_UPLOADS.map((asset, i) => (
                                            <tr key={i} className="group hover:bg-white/[0.02] transition-all">
                                                <td className="py-6 pl-4">
                                                    <div className="flex items-center gap-4">
                                                        <div className={`p-2 rounded-lg ${asset.type === 'Video' ? 'bg-blue-500/10 text-blue-400' :
                                                                asset.type === 'Document' ? 'bg-amber-500/10 text-amber-500' : 'bg-emerald-500/10 text-emerald-400'
                                                            }`}>
                                                            {asset.type === 'Video' ? <Video size={16} /> : asset.type === 'Document' ? <FileText size={16} /> : <FileCode size={16} />}
                                                        </div>
                                                        <div>
                                                            <div className="text-sm font-bold text-white group-hover:text-amber-500 transition-colors uppercase tracking-tight">{asset.name}</div>
                                                            <div className="text-[10px] text-slate-600 font-bold uppercase mt-1">Uploaded {asset.date}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-6 px-4">
                                                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{asset.type}</div>
                                                </td>
                                                <td className="py-6 px-4">
                                                    <div className="text-[10px] font-black text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-md inline-block uppercase tracking-widest">{asset.course}</div>
                                                </td>
                                                <td className="py-6 px-4 text-sm font-bold text-slate-500">{asset.size}</td>
                                                <td className="py-6 pr-4 text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <button className="p-2.5 rounded-xl bg-white/5 border border-white/5 text-slate-500 hover:text-white hover:bg-white/10 transition-all"><Eye size={16} /></button>
                                                        <button className="p-2.5 rounded-xl bg-white/5 border border-white/5 text-slate-500 hover:text-white hover:bg-white/10 transition-all"><Download size={16} /></button>
                                                        <button className="p-2.5 rounded-xl bg-white/5 border border-white/5 text-slate-500 hover:text-red-500 transition-all"><Trash2 size={16} /></button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
