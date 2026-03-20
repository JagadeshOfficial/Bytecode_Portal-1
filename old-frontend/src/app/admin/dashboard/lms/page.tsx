"use client";

import { useState } from 'react';
import AdvancedModuleLayout from '@/components/dashboard/AdvancedModuleLayout';
import { motion } from 'framer-motion';
import {
    Layers,
    PlayCircle,
    FileText,
    Download,
    Upload,
    Plus,
    Search,
    Filter,
    Folder,
    MoreVertical,
    CheckCircle,
    Eye,
    Tag,
    Share2,
    Video
} from 'lucide-react';

export default function LMSModulePage() {
    const [activeTab, setActiveTab] = useState('library');

    const stats = [
        { label: "Course Modules", value: "142", icon: Layers, color: "#a855f7", trend: "+12 New" },
        { label: "Videos Hosted", value: "480", icon: Video, color: "#ef4444", trend: "05 Pending" },
        { label: "Study Materials", value: "1,240", icon: FileText, color: "#3b82f6", trend: "Normal" },
        { label: "Total Asset Views", value: "45.2K", icon: Eye, color: "#10b981", trend: "+18% growth" },
    ];

    const contentItems = [
        { id: 1, title: "Microservices Architecture Deep Dive", type: "Video", format: "MP4", size: "1.4 GB", batch: "Batch-S05", status: "Active", views: 1240 },
        { id: 2, title: "React State Management Lab Manual", type: "Document", format: "PDF", size: "2.4 MB", batch: "Batch-B22", status: "Active", views: 850 },
        { id: 3, title: "Java Multi-Threading Best Practices", type: "Video", format: "MOV", size: "850 MB", batch: "Java-J12", status: "Review", views: 0 },
        { id: 4, title: "SQL Complex Queries Reference", type: "Document", format: "PDF", size: "1.1 MB", batch: "ALL", status: "Active", views: 2100 },
    ];

    return (
        <AdvancedModuleLayout
            title="Learning Content Library (LMS)"
            subtitle="Centralized repository for high-fidelity educational assets, video lectures, and study materials."
            stats={stats}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            role="admin"
            tabs={[
                { id: 'library', label: 'Media Library', icon: Folder },
                { id: 'upload', label: 'Content Upload', icon: Upload },
                { id: 'assignment', label: 'Content Assignments', icon: Tag },
                { id: 'usage', label: 'Usage Analytics', icon: Eye },
            ]}
        >
            {activeTab === 'library' && (
                <div className="space-y-6">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div className="relative w-full md:w-96">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                            <input type="text" placeholder="Search by title, tag, or batch..." className="w-full bg-[#0a0a1a] border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-purple-500 transition-colors" />
                        </div>
                        <div className="flex gap-3 w-full md:w-auto">
                            <button className="flex-1 md:flex-none px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-slate-400 font-bold text-xs uppercase hover:bg-white/10 transition-all flex items-center justify-center gap-2">
                                <Filter size={14} /> FILTER
                            </button>
                            <button className="flex-1 md:flex-none px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl shadow-lg shadow-purple-500/20 flex items-center justify-center gap-2 transition-all">
                                <Upload size={18} /> UPLOAD ASSET
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {contentItems.map((item, i) => (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.05 }}
                                className="bg-[#0a0a1a]/60 border border-white/5 rounded-3xl p-6 group hover:border-purple-500/30 transition-all relative overflow-hidden flex flex-col"
                            >
                                <div className="absolute top-0 right-0 w-24 h-24 bg-purple-600/5 blur-3xl -mr-12 -mt-12 rounded-full" />

                                <div className="flex justify-between items-start mb-6">
                                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${item.type === 'Video' ? 'bg-red-600/10 text-red-400' : 'bg-blue-600/10 text-blue-400'
                                        } border border-white/5`}>
                                        {item.type === 'Video' ? <PlayCircle size={28} /> : <FileText size={28} />}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${item.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
                                            }`}>{item.status}</span>
                                        <button className="text-slate-500 hover:text-white"><MoreVertical size={16} /></button>
                                    </div>
                                </div>

                                <div className="flex-1">
                                    <h3 className="text-lg font-bold text-white group-hover:text-purple-400 transition-colors leading-tight mb-2">{item.title}</h3>
                                    <div className="flex items-center justify-between text-xs text-slate-500 mb-4">
                                        <span className="flex items-center gap-1"><Tag size={10} /> {item.batch}</span>
                                        <span className="font-mono">{item.format} • {item.size}</span>
                                    </div>
                                </div>

                                <div className="mt-auto space-y-4 pt-4 border-t border-white/5">
                                    <div className="flex justify-between items-center px-1">
                                        <div className="flex items-center gap-2 text-[10px] text-slate-400">
                                            <Eye size={12} /> {item.views.toLocaleString()} views
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <button className="text-slate-500 hover:text-purple-400" title="Share"><Share2 size={14} /></button>
                                            <button className="text-slate-500 hover:text-white" title="Download"><Download size={14} /></button>
                                        </div>
                                    </div>
                                    <button className="w-full py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white font-bold text-xs transition-all tracking-wider uppercase">
                                        ASSIGN TO BATCH
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            )}
        </AdvancedModuleLayout>
    );
}
