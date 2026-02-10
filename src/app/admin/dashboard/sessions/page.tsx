"use client";

import { useState } from 'react';
import AdvancedModuleLayout from '@/components/dashboard/AdvancedModuleLayout';
import { motion } from 'framer-motion';
import {
    Video,
    Mic,
    Users,
    MessageSquare,
    Play,
    Pause,
    MoreVertical,
    Clock,
    Plus,
    Search,
    Monitor,
    Airplay,
    UserCheck,
    Settings,
    XCircle,
    CheckCircle2
} from 'lucide-react';

export default function OnlineSessionsPage() {
    const [activeTab, setActiveTab] = useState('active');

    const stats = [
        { label: "Live Sessions", value: "05", icon: Video, color: "#ef4444", trend: "02 starting now" },
        { label: "Total Participants", value: "180+", icon: Users, color: "#3b82f6", trend: "Normal" },
        { label: "Avg. Engagement", value: "88%", icon: Airplay, color: "#10b981", trend: "+5% peak" },
        { label: "Recording Hours", value: "1,240", icon: Monitor, color: "#8b5cf6" },
    ];

    const activeSessions = [
        { id: 1, title: "React State Management", tutor: "Dr. Alan Smith", batch: "B22", viewers: 45, duration: "45:12", status: "Live", bitRate: "2.4 Mbps" },
        { id: 2, title: "Backend GoLang Lab", tutor: "Prof. Sarah Chen", batch: "B08", viewers: 32, duration: "12:05", status: "Live", bitRate: "3.1 Mbps" },
    ];

    const upcomingSessions = [
        { id: 3, title: "System Design Q&A", tutor: "Mr. Rajesh Kumar", batch: "P05", startTime: "04:30 PM", attendees: 50 },
        { id: 4, title: "Career Guidance", tutor: "Placement Team", batch: "ALL", startTime: "06:00 PM", attendees: 120 },
    ];

    return (
        <AdvancedModuleLayout
            title="Online Operations & Sessions"
            subtitle="Real-time monitoring and management of virtual classrooms and live sessions."
            stats={stats}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            role="admin"
            tabs={[
                { id: 'active', label: 'Live Sessions', icon: Video },
                { id: 'upcoming', label: 'Upcoming', icon: Clock },
                { id: 'attendance', label: 'Attendance Tracking', icon: UserCheck },
                { id: 'recordings', label: 'Session Archive', icon: Monitor },
            ]}
        >
            {activeTab === 'active' && (
                <div className="space-y-8">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2 px-3 py-1 bg-red-500/10 border border-red-500/20 rounded-full">
                                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.8)]" />
                                <span className="text-[10px] font-bold text-red-500 uppercase tracking-widest">Global Live Console</span>
                            </div>
                        </div>
                        <button className="flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-2xl shadow-xl shadow-red-500/20 transition-all">
                            <Plus size={18} /> START INSTANT SESSION
                        </button>
                    </div>

                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                        {activeSessions.map((session, i) => (
                            <motion.div
                                key={session.id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: i * 0.1 }}
                                className="bg-[#0a0a1a]/80 border border-white/5 rounded-[2.5rem] p-8 backdrop-blur-xl relative group overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/5 blur-[100px] -mr-32 -mt-32 rounded-full" />

                                <div className="flex justify-between items-start mb-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-red-600/20 to-orange-600/20 border border-red-500/30 flex items-center justify-center text-red-400 group-hover:rotate-6 transition-transform duration-500 shadow-inner">
                                            <Video size={40} />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <h3 className="text-2xl font-bold text-white tracking-tight">{session.title}</h3>
                                                <span className="px-2 py-0.5 bg-red-600 text-[9px] font-bold rounded-md uppercase tracking-tighter">LIVE</span>
                                            </div>
                                            <p className="text-slate-400 font-medium">Batch: {session.batch} • {session.tutor}</p>
                                        </div>
                                    </div>
                                    <button className="p-3 bg-white/5 border border-white/10 rounded-2xl text-slate-500 hover:text-white transition-colors">
                                        <MoreVertical size={20} />
                                    </button>
                                </div>

                                <div className="grid grid-cols-3 gap-4 mb-8">
                                    <div className="p-4 bg-white/5 border border-white/5 rounded-2xl text-center">
                                        <div className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-1">Viewers</div>
                                        <div className="text-xl font-bold text-white flex items-center justify-center gap-2">
                                            <Users size={16} className="text-blue-400" /> {session.viewers}
                                        </div>
                                    </div>
                                    <div className="p-4 bg-white/5 border border-white/5 rounded-2xl text-center">
                                        <div className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-1">Duration</div>
                                        <div className="text-xl font-bold text-white flex items-center justify-center gap-2">
                                            <Clock size={16} className="text-emerald-400" /> {session.duration}
                                        </div>
                                    </div>
                                    <div className="p-4 bg-white/5 border border-white/5 rounded-2xl text-center">
                                        <div className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-1">Stream</div>
                                        <div className="text-xl font-bold text-white flex items-center justify-center gap-2">
                                            <Airplay size={16} className="text-fuchsia-400" /> 2.4<span className="text-[10px] ml-1">Mbps</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <button className="flex-1 py-4 bg-red-600/10 border border-red-500/20 rounded-2xl text-red-400 font-bold text-sm tracking-widest flex items-center justify-center gap-2 hover:bg-red-600 hover:text-white transition-all">
                                        <XCircle size={18} /> STOP STREAM
                                    </button>
                                    <button className="flex-1 py-4 bg-white/5 border border-white/10 rounded-2xl text-white font-bold text-sm tracking-widest flex items-center justify-center gap-2 hover:bg-white/10 transition-all">
                                        <Monitor size={18} /> OPERATE CONSOLE
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            )}

            {activeTab === 'upcoming' && (
                <div className="max-w-4xl mx-auto space-y-4">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold text-white uppercase tracking-widest">Next 24 Hours</h3>
                        <div className="flex gap-2">
                            <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl flex items-center gap-2">
                                <Search size={14} className="text-slate-500" />
                                <input type="text" placeholder="Search upcoming..." className="bg-transparent border-none text-xs text-white focus:outline-none w-32" />
                            </div>
                        </div>
                    </div>
                    {upcomingSessions.map((session, i) => (
                        <motion.div
                            key={session.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="bg-[#0a0a1a]/60 border border-white/5 rounded-3xl p-6 flex items-center justify-between group hover:border-violet-500/30 transition-all hover:translate-x-1"
                        >
                            <div className="flex items-center gap-6">
                                <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex flex-col items-center justify-center font-[Rajdhani] group-hover:bg-violet-600 group-hover:border-violet-400 transition-all">
                                    <span className="text-[10px] text-slate-500 group-hover:text-violet-200">START</span>
                                    <span className="text-lg font-bold text-white">{session.startTime.split(' ')[0]}</span>
                                </div>
                                <div>
                                    <h4 className="text-lg font-bold text-white group-hover:text-violet-400 transition-colors">{session.title}</h4>
                                    <div className="flex gap-4 items-center mt-1">
                                        <span className="text-xs text-slate-500 flex items-center gap-1.5"><Users size={12} /> {session.attendees} Registered</span>
                                        <span className="text-xs text-slate-500 flex items-center gap-1.5"><UserCheck size={12} /> {session.tutor}</span>
                                        <span className="px-2 py-0.5 bg-violet-600/10 text-violet-400 text-[10px] font-bold rounded uppercase">Batch {session.batch}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <button className="p-3 bg-white/5 border border-white/10 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-all">
                                    <Settings size={18} />
                                </button>
                                <button className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-white font-bold text-xs uppercase tracking-widest group-hover:bg-violet-600 group-hover:border-violet-500 transition-all">
                                    MANAGE
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </AdvancedModuleLayout>
    );
}
