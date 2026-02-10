"use client";

import { useState } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Video,
    PlayCircle,
    Calendar,
    Clock,
    Users,
    ChevronRight,
    Search,
    Monitor,
    MessageSquare,
    Download,
    Lock,
    Unlock,
    Settings,
    History,
    CalendarDays,
    ArrowUpRight
} from 'lucide-react';

const LIVE_CLASSES = [
    { id: "L01", title: "Advanced React & Next.js", tutor: "Dr. Alan Smith", time: "02:00 PM - 04:00 PM", status: "Live", participants: 45, topic: "State Management with Redux Toolkit" },
    { id: "L02", title: "Cloud Ops with Terraform", tutor: "Prof. Sarah Chen", time: "Tomorrow 10:00 AM", status: "Upcoming", participants: 0, topic: "Infrastructure as Code Fundamentals" },
];

const RECORDED_SESSIONS = [
    { title: "Node.js Architecture", date: "Feb 08, 2026", duration: "1h 45m", views: 250, category: "Backend" },
    { title: "System Design Patterns", date: "Feb 06, 2026", duration: "2h 10m", views: 180, category: "Architecture" },
    { title: "React Context API", date: "Feb 04, 2026", duration: "1h 20m", views: 320, category: "Frontend" },
    { title: "AWS IAM Deep Dive", date: "Feb 02, 2026", duration: "1h 55m", views: 150, category: "Cloud" },
];

export default function OnlineClassesPage() {
    const [activeTab, setActiveTab] = useState('live');

    return (
        <DashboardLayout role="student">
            <div className="flex flex-col gap-8 pb-10">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                        <h1 className="text-4xl font-display font-bold text-white tracking-tight uppercase">
                            Digital <span className="text-cyan-400">Classroom</span>
                        </h1>
                        <p className="text-slate-400 font-medium mt-1">Join your live sessions, interact with mentors, and access recorded archives.</p>
                    </div>
                </div>

                {/* Navigation Tabs */}
                <div className="flex gap-4 p-1.5 bg-[#0a0a1a]/60 border border-white/5 rounded-2xl w-fit backdrop-blur-xl">
                    {[
                        { id: 'live', label: 'LIVE & UPCOMING', icon: Video },
                        { id: 'recordings', label: 'RECORDED SESSIONS', icon: History },
                        { id: 'schedule', label: 'MY SCHEDULE', icon: CalendarDays },
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-black transition-all tracking-widest ${activeTab === tab.id
                                    ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/20'
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
                            className="space-y-6"
                        >
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                {LIVE_CLASSES.map((cls, i) => (
                                    <div key={i} className="group bg-[#0a0a1a]/60 border border-white/5 rounded-[2.5rem] p-8 backdrop-blur-xl relative overflow-hidden">
                                        {/* Animated Background Glow */}
                                        <div className={`absolute top-0 right-0 w-64 h-64 ${cls.status === 'Live' ? 'bg-red-500/5' : 'bg-cyan-500/5'} blur-[100px] -mr-32 -mt-32 rounded-full`} />

                                        <div className="flex justify-between items-start mb-8 relative z-10">
                                            <div className="flex items-center gap-3">
                                                <div className={`px-3 py-1 rounded-full text-[10px] font-black tracking-[0.2em] ${cls.status === 'Live' ? 'bg-red-500/10 text-red-500 border border-red-500/20 animate-pulse' : 'bg-cyan-500/10 text-cyan-400 border border-cyan-400/20'
                                                    }`}>
                                                    {cls.status === 'Live' && <span className="inline-block w-1 h-1 bg-red-500 rounded-full mr-2 mb-0.5" />}
                                                    {cls.status.toUpperCase()}
                                                </div>
                                                {cls.status === 'Live' && <span className="text-[10px] font-bold text-slate-500 flex items-center gap-1"><Users size={12} /> {cls.participants} watching</span>}
                                            </div>
                                            <button className="p-3 bg-white/5 border border-white/10 rounded-xl text-slate-400 hover:text-white transition-all">
                                                <Settings size={18} />
                                            </button>
                                        </div>

                                        <div className="relative z-10">
                                            <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors uppercase tracking-tight">{cls.title}</h3>
                                            <p className="text-sm text-slate-500 font-bold mb-8">{cls.topic}</p>

                                            <div className="grid grid-cols-2 gap-6 mb-8 text-xs font-bold">
                                                <div className="flex items-center gap-3 text-slate-400">
                                                    <Clock size={16} className="text-cyan-400" />
                                                    {cls.time}
                                                </div>
                                                <div className="flex items-center gap-3 text-slate-400">
                                                    <Monitor size={16} className="text-cyan-400" />
                                                    Mentored by {cls.tutor}
                                                </div>
                                            </div>

                                            <div className="flex gap-4">
                                                <button className={`flex-1 py-4 font-black text-xs tracking-[0.2em] rounded-2xl transition-all ${cls.status === 'Live'
                                                        ? 'bg-cyan-500 text-black hover:bg-cyan-400 shadow-xl shadow-cyan-500/20'
                                                        : 'bg-white/5 text-white cursor-not-allowed'
                                                    }`}>
                                                    {cls.status === 'Live' ? 'JOIN CLASS NOW' : 'NOT STARTED'}
                                                </button>
                                                <button className="px-6 py-4 bg-white/5 border border-white/10 text-white rounded-2xl hover:bg-white/10 transition-all">
                                                    <Calendar size={18} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'recordings' && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="space-y-6"
                        >
                            <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
                                <div className="relative w-full md:w-96">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                    <input
                                        type="text"
                                        placeholder="Search by topic or date..."
                                        className="w-full bg-[#0a0a1a]/60 border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-sm text-white focus:outline-none focus:border-cyan-500 transition-all font-bold"
                                    />
                                </div>
                                <div className="flex gap-2">
                                    {['All', 'Frontend', 'Backend', 'Cloud', 'Design'].map(cat => (
                                        <button key={cat} className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black text-slate-500 hover:text-white hover:border-white/20 transition-all uppercase tracking-widest leading-none">
                                            {cat}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {RECORDED_SESSIONS.map((rec, i) => (
                                    <div key={i} className="group bg-[#0a0a1a]/60 border border-white/5 rounded-3xl p-6 backdrop-blur-xl hover:border-cyan-500/30 transition-all relative overflow-hidden">
                                        <div className="aspect-video bg-[#050510] rounded-2xl mb-6 relative overflow-hidden border border-white/5 group-hover:border-cyan-500/20 transition-all">
                                            <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <PlayCircle size={48} className="text-cyan-400" />
                                            </div>
                                            <div className="absolute bottom-3 right-3 px-2 py-1 bg-black/80 rounded text-[9px] font-black text-white">{rec.duration}</div>
                                        </div>

                                        <div className="flex justify-between items-start mb-4">
                                            <span className="text-[10px] font-black text-cyan-400 bg-cyan-400/10 px-2 py-1 rounded-lg uppercase tracking-widest">{rec.category}</span>
                                            <span className="text-[10px] font-bold text-slate-500">{rec.date}</span>
                                        </div>

                                        <h4 className="text-lg font-bold text-white mb-6 group-hover:text-cyan-400 transition-colors uppercase tracking-tight">{rec.title}</h4>

                                        <div className="flex justify-between items-center pt-6 border-t border-white/5">
                                            <div className="text-[10px] font-bold text-slate-500">{rec.views} Views</div>
                                            <button className="flex items-center gap-2 text-[10px] font-black text-cyan-400 hover:text-cyan-300 transition-colors uppercase tracking-widest group/btn">
                                                WATCH NOW <ChevronRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'schedule' && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="bg-[#0a0a1a]/60 border border-white/5 rounded-[2.5rem] p-8 backdrop-blur-xl"
                        >
                            <div className="flex justify-between items-center mb-10">
                                <h3 className="text-2xl font-bold text-white uppercase tracking-tight">Academic Calendar</h3>
                                <div className="flex gap-4">
                                    <button className="p-3 bg-white/5 border border-white/10 rounded-xl text-slate-400 hover:text-white transition-all">< ChevronRight className="rotate-180" size={18} /></button>
                                    <button className="p-3 bg-white/5 border border-white/10 rounded-xl text-slate-400 hover:text-white transition-all"><ChevronRight size={18} /></button>
                                </div>
                            </div>
                            <div className="grid grid-cols-7 gap-4">
                                {['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].map(day => (
                                    <div key={day} className="text-center text-[10px] font-black text-slate-500 py-4 tracking-[0.3em]">{day}</div>
                                ))}
                                {Array.from({ length: 28 }).map((_, i) => (
                                    <div key={i} className={`aspect-square rounded-3xl border ${i === 9 ? 'bg-cyan-500/10 border-cyan-500 text-cyan-400' : 'border-white/5 hover:border-white/20'} flex flex-col items-center justify-center gap-2 cursor-pointer transition-all group`}>
                                        <span className="text-xs font-bold text-inherit">{i + 1}</span>
                                        {[2, 9, 15, 22].includes(i + 1) && <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.5)]" />}
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
