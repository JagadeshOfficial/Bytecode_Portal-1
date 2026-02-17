"use client";

import { useState, useEffect } from 'react';
import AdvancedModuleLayout from '@/components/dashboard/AdvancedModuleLayout';
import { motion, AnimatePresence } from 'framer-motion';
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
    CheckCircle2,
    Calendar,
    ArrowUpRight,
    PlayCircle
} from 'lucide-react';

export default function OnlineSessionsPage() {
    const [activeTab, setActiveTab] = useState('active');
    const [archivedRecordings, setArchivedRecordings] = useState<any[]>([]);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const stored = localStorage.getItem('bytecode_recordings');
            if (stored) {
                setArchivedRecordings(JSON.parse(stored));
            } else {
                // Fallback initial data
                const initial = [
                    { id: '1', title: 'React Context API & Hooks', batchName: 'React FE #15', mentorName: 'Dr. Alan Smith', date: 'Feb 09', duration: '1:45:12', views: 120, thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&q=80' },
                    { id: '2', title: 'Docker Containerization', batchName: 'Java Full Stack #21', mentorName: 'Prof. Sarah Chen', date: 'Feb 08', duration: '2:10:05', views: 95, thumbnail: 'https://images.unsplash.com/photo-1605745341112-85968b193ef5?w=800&q=80' },
                ];
                localStorage.setItem('bytecode_recordings', JSON.stringify(initial));
                setArchivedRecordings(initial);
            }
        }
    }, []);

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
            {activeTab === 'recordings' && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-8"
                >
                    <div className="flex justify-between items-center bg-[#0a0a1a]/40 border border-white/5 p-6 rounded-[2rem]">
                        <div className="relative w-96">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                            <input
                                type="text"
                                placeholder="Search recordings by batch or topic..."
                                className="w-full bg-[#050510] border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-sm text-white focus:outline-none focus:border-red-500 transition-all font-bold"
                            />
                        </div>
                        <div className="flex gap-4">
                            <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs font-bold text-slate-400 flex items-center gap-2">
                                <Clock size={14} /> {archivedRecordings.length} ARCHIVED
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {archivedRecordings.map((rec, i) => (
                            <motion.div
                                key={rec.id || i}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: i * 0.1 }}
                                className="group bg-[#0a0a1a]/60 border border-white/5 rounded-3xl p-6 backdrop-blur-xl hover:border-red-500/30 transition-all cursor-pointer relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 blur-3xl -mr-16 -mt-16 rounded-full group-hover:bg-red-500/10 transition-colors" />

                                <div className="aspect-video bg-[#050510] rounded-2xl mb-6 relative overflow-hidden border border-white/5 group-hover:border-red-500/20 transition-all shadow-2xl">
                                    <img
                                        src={rec.thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80'}
                                        alt={rec.title}
                                        className="w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-700"
                                    />
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <div className="w-16 h-16 rounded-full bg-red-600 text-white flex items-center justify-center shadow-xl shadow-red-500/40">
                                            <PlayCircle size={32} fill="currentColor" />
                                        </div>
                                    </div>
                                    <div className="absolute bottom-3 right-3 px-3 py-1.5 bg-black/80 backdrop-blur-md rounded-lg text-[10px] font-black text-white border border-white/10">
                                        {rec.duration}
                                    </div>
                                </div>

                                <div className="flex justify-between items-start mb-4">
                                    <span className="text-[10px] font-black text-red-500 bg-red-500/10 px-2 py-1 rounded-lg uppercase tracking-widest border border-red-500/20">{rec.batchName}</span>
                                    <span className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1.5"><Calendar size={12} /> {rec.date}</span>
                                </div>

                                <h4 className="text-xl font-bold text-white mb-6 tracking-tight group-hover:text-red-500 transition-colors uppercase font-[Rajdhani]">{rec.title}</h4>

                                <div className="flex items-center justify-between pt-6 border-t border-white/5">
                                    <div className="flex flex-col">
                                        <span className="text-[9px] text-slate-500 uppercase font-black mb-0.5">MENTOR</span>
                                        <span className="text-xs font-bold text-slate-300">{rec.mentorName}</span>
                                    </div>
                                    <button className="flex items-center gap-2 text-[10px] font-black text-red-500 hover:text-white transition-colors uppercase tracking-widest bg-red-500/5 px-4 py-2 rounded-xl border border-red-500/10 group-hover:bg-red-600 group-hover:text-white group-hover:border-red-500 transition-all">
                                        VIEW <ArrowUpRight size={14} />
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            )}
        </AdvancedModuleLayout>
    );
}
