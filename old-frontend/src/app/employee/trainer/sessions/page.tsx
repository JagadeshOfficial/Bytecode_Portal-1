"use client";

import { useState } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Video,
    Play,
    Upload,
    History,
    Calendar,
    Users,
    Clock,
    Search,
    Filter,
    MoreVertical,
    CheckCircle2,
    XCircle,
    ArrowUpRight,
    Settings,
    Mic,
    Monitor,
    MessageSquare,
    Link as LinkIcon
} from 'lucide-react';

const TODAY_SESSIONS = [
    {
        id: "S-101",
        batch: "Full Stack Java #22",
        topic: "Spring Boot Microservices Architecture",
        time: "10:00 AM - 12:00 PM",
        status: "Active",
        students: 42,
        key: "JWT-AUTH-SYNC"
    },
    {
        id: "S-102",
        batch: "Python AI/ML #08",
        topic: "Neural Networks: Backpropagation",
        time: "02:00 PM - 04:00 PM",
        status: "Upcoming",
        students: 31,
        key: "PY-AI-LAB"
    },
];

const RECENT_RECORDINGS = [
    { title: "React Context API & Hooks", batch: "React FE #15", date: "Feb 09", duration: "1h 45m", views: 120 },
    { title: "Docker Containerization", batch: "Full Stack Java #21", date: "Feb 08", duration: "2h 10m", views: 95 },
];

export default function TrainerSessionsPage() {
    const [activeTab, setActiveTab] = useState('live');

    return (
        <DashboardLayout role="trainer">
            <div className="flex flex-col gap-8 pb-10">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                        <h1 className="text-4xl font-[Rajdhani] font-bold text-white tracking-widest uppercase">
                            Session <span className="text-red-500">Control Hub</span>
                        </h1>
                        <p className="text-slate-400 font-medium mt-1">Initialize live classrooms, manage streaming, and archive session recordings.</p>
                    </div>
                </div>

                {/* Dashboard Mode Switching */}
                <div className="flex gap-4 p-1.5 bg-[#0a0a1a]/60 border border-white/5 rounded-2xl w-fit backdrop-blur-xl">
                    {[
                        { id: 'live', label: 'LIVE CLASSES', icon: Video },
                        { id: 'archives', label: 'RECORDED ARCHIVES', icon: History },
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-black transition-all tracking-widest ${activeTab === tab.id
                                    ? 'bg-red-600 text-white shadow-lg shadow-red-500/20'
                                    : 'text-slate-500 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            <tab.icon size={18} />
                            {tab.label}
                        </button>
                    ))}
                </div>

                <AnimatePresence mode="wait">
                    {activeTab === 'live' && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="space-y-8"
                        >
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                {TODAY_SESSIONS.map((session, i) => (
                                    <div key={i} className="group bg-[#0a0a1a]/60 border border-white/5 rounded-[2.5rem] p-8 backdrop-blur-xl relative overflow-hidden">
                                        {/* Dynamic Status Glow */}
                                        <div className={`absolute top-0 right-0 w-64 h-64 ${session.status === 'Active' ? 'bg-red-500/5' : 'bg-blue-500/5'} blur-[100px] -mr-32 -mt-32 rounded-full`} />

                                        <div className="flex justify-between items-start mb-8 relative z-10">
                                            <div className="flex flex-col gap-1">
                                                <div className="flex items-center gap-2">
                                                    <span className={`px-3 py-1 rounded-full text-[9px] font-black tracking-widest uppercase ${session.status === 'Active' ? 'bg-red-500/10 text-red-500 border border-red-500/20 animate-pulse' : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                                                        }`}>
                                                        {session.status} SESSION
                                                    </span>
                                                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{session.id}</span>
                                                </div>
                                                <h3 className="text-2xl font-black text-white mt-4 uppercase tracking-tight group-hover:text-red-500 transition-colors">{session.batch}</h3>
                                            </div>
                                            <button className="p-3 bg-white/5 rounded-xl text-slate-500 hover:text-white transition-all"><MoreVertical size={20} /></button>
                                        </div>

                                        <div className="relative z-10 space-y-6 mb-10">
                                            <div className="flex items-center gap-3 text-sm text-slate-300 font-medium">
                                                <Video size={18} className="text-red-500" />
                                                {session.topic}
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="flex items-center gap-3 text-xs text-slate-500 font-bold uppercase tracking-tight">
                                                    <Clock size={16} className="text-red-500" />
                                                    {session.time}
                                                </div>
                                                <div className="flex items-center gap-3 text-xs text-slate-500 font-bold uppercase tracking-tight">
                                                    <Users size={16} className="text-red-500" />
                                                    {session.students} Enrolled
                                                </div>
                                            </div>
                                        </div>

                                        <div className="relative z-10 flex gap-4">
                                            <button className="flex-1 py-4 bg-red-600 hover:bg-red-500 text-white font-black text-xs tracking-[0.2em] rounded-2xl shadow-xl shadow-red-500/20 transition-all uppercase flex items-center justify-center gap-3">
                                                <Play size={18} fill="currentColor" /> {session.status === 'Active' ? 'RESUME STREAM' : 'INITIALIZE CLASS'}
                                            </button>
                                            <button className="px-6 py-4 bg-white/5 border border-white/10 text-white rounded-2xl hover:bg-white/10 transition-all"><Settings size={18} /></button>
                                        </div>
                                    </div>
                                ))}

                                {/* Quick Start Custom Session */}
                                <div className="bg-gradient-to-br from-[#130a30] to-[#0a0a1a] border border-dashed border-white/10 rounded-[2.5rem] p-8 backdrop-blur-xl flex flex-col items-center justify-center text-center group hover:border-red-500/30 transition-all cursor-pointer">
                                    <div className="w-20 h-20 rounded-full bg-white/5 border border-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                        <Plus size={32} className="text-slate-500 group-hover:text-red-500" />
                                    </div>
                                    <h3 className="text-xl font-black text-white uppercase tracking-tight mb-2">Instant Session</h3>
                                    <p className="text-xs text-slate-500 font-medium max-w-[200px]">Launch a generic live room for doubt clearing or extra labs.</p>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'archives' && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="space-y-6"
                        >
                            <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-8 bg-[#0a0a1a]/40 border border-white/5 p-6 rounded-[2rem]">
                                <div className="relative w-full md:w-96">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                    <input
                                        type="text"
                                        placeholder="Search archives by batch or topic..."
                                        className="w-full bg-[#050510] border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-sm text-white focus:outline-none focus:border-red-500 transition-all font-bold"
                                    />
                                </div>
                                <div className="flex gap-4">
                                    <button className="flex items-center gap-2 px-6 py-4 bg-white text-black font-black text-[10px] tracking-widest rounded-2xl shadow-xl transition-all uppercase">
                                        <Upload size={16} /> UPLOAD RECORDING
                                    </button>
                                    <button className="p-3 bg-white/5 border border-white/10 rounded-xl text-slate-500 hover:text-white transition-all"><Filter size={20} /></button>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {RECENT_RECORDINGS.map((rec, i) => (
                                    <div key={i} className="group bg-[#0a0a1a]/60 border border-white/5 rounded-3xl p-6 backdrop-blur-xl hover:border-red-500/30 transition-all">
                                        <div className="aspect-video bg-[#050510] rounded-2xl mb-6 relative overflow-hidden border border-white/5 group-hover:border-red-500/20 transition-all">
                                            <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Play size={48} className="text-red-500" fill="currentColor" />
                                            </div>
                                            <div className="absolute bottom-3 right-3 px-2 py-1 bg-black/80 rounded text-[9px] font-black text-white">{rec.duration}</div>
                                        </div>

                                        <div className="flex justify-between items-start mb-4">
                                            <span className="text-[10px] font-black text-red-500 bg-red-500/10 px-2 py-1 rounded-lg uppercase tracking-widest">{rec.batch}</span>
                                            <span className="text-[10px] font-bold text-slate-500 uppercase">{rec.date}</span>
                                        </div>

                                        <h4 className="text-lg font-black text-white mb-6 uppercase tracking-tight group-hover:text-red-500 transition-colors">{rec.title}</h4>

                                        <div className="flex items-center justify-between pt-6 border-t border-white/5">
                                            <div className="text-[10px] font-bold text-slate-500 uppercase">{rec.views} Accesses</div>
                                            <button className="flex items-center gap-2 text-[10px] font-black text-red-500 hover:text-white transition-colors uppercase tracking-widest">
                                                SHARE LINK <LinkIcon size={14} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </DashboardLayout>
    );
}

import { Plus } from 'lucide-react';
