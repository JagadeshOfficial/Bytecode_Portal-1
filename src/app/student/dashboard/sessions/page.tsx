"use client";

import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { motion } from 'framer-motion';
import {
    Video,
    Monitor,
    MessageCircle,
    Users,
    Hand,
    Settings,
    Mic,
    MicOff,
    Video as VideoIcon,
    VideoOff,
    ScreenShare,
    Square,
    Play
} from 'lucide-react';

export default function JoinLiveClass() {
    return (
        <DashboardLayout role="student">
            <div className="flex flex-col h-[calc(100vh-140px)] gap-6">
                {/* Session Header */}
                <div className="flex justify-between items-center bg-[rgba(19,10,48,0.8)] border border-[rgba(34,211,238,0.2)] p-4 rounded-2xl backdrop-blur-xl">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center animate-pulse">
                            <div className="w-3 h-3 rounded-full bg-red-500" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white font-[Rajdhani]">Advanced React & Micro-frontends</h2>
                            <p className="text-[10px] text-[var(--accent)] font-bold uppercase tracking-widest">Instructor: Dr. Alan Smith • 128 Students Watching</p>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white font-mono text-sm">
                            01:45:22
                        </div>
                        <button className="px-6 py-2 bg-red-500 text-white rounded-lg font-bold hover:bg-red-600 transition-all">
                            Leave Class
                        </button>
                    </div>
                </div>

                {/* Main Video Area */}
                <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-6 overflow-hidden">
                    {/* Live Stream / Recording */}
                    <div className="lg:col-span-3 flex flex-col gap-6">
                        <div className="flex-1 bg-black rounded-3xl border border-[rgba(124,58,237,0.3)] relative overflow-hidden group shadow-2xl">
                            {/* Dummy Video Feed */}
                            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#030014] to-[#0f0728]">
                                <div className="text-center">
                                    <div className="w-24 h-24 rounded-full bg-[#7c3aed]/20 border border-[#7c3aed]/40 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                                        <Play className="w-10 h-10 text-[#7c3aed] fill-[#7c3aed]" />
                                    </div>
                                    <h3 className="text-white font-[Rajdhani] text-2xl font-bold">Waiting for stream...</h3>
                                    <p className="text-[var(--text-dim)] animate-pulse">Starting shortly at 2:00 PM</p>
                                </div>
                            </div>

                            {/* Stream Overlays */}
                            <div className="absolute top-6 left-6 flex gap-3">
                                <span className="px-3 py-1 bg-black/60 backdrop-blur-md rounded-full text-[10px] font-bold text-white border border-white/10">1080p Ultra HD</span>
                                <span className="px-3 py-1 bg-[#7c3aed]/60 backdrop-blur-md rounded-full text-[10px] font-bold text-white border border-[#7c3aed]/30 flex items-center gap-2">
                                    <Users className="w-3 h-3" /> 128
                                </span>
                            </div>

                            {/* Bottom Controls */}
                            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4 px-8 py-4 bg-black/60 backdrop-blur-xl rounded-2xl border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button className="p-3 rounded-full hover:bg-white/10 text-white transition-all"><MicOff className="w-5 h-5" /></button>
                                <button className="p-3 rounded-full hover:bg-white/10 text-white transition-all"><VideoOff className="w-5 h-5" /></button>
                                <button className="p-3 rounded-full hover:bg-white/10 text-[#22d3ee] transition-all"><ScreenShare className="w-5 h-5" /></button>
                                <div className="w-[1px] h-6 bg-white/20 mx-2" />
                                <button className="p-3 rounded-full bg-amber-500/20 text-amber-500 hover:bg-amber-500 hover:text-white transition-all"><Hand className="w-5 h-5" /></button>
                                <button className="p-3 rounded-full hover:bg-white/10 text-white transition-all"><Settings className="w-5 h-5" /></button>
                            </div>
                        </div>

                        {/* Resource Cards */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {[
                                { label: "Lecture Notes", icon: FileText, color: "text-[#7c3aed]" },
                                { label: "Source Code", icon: Monitor, color: "text-[#22d3ee]" },
                                { label: "Assignments", icon: Square, color: "text-emerald-400" },
                                { label: "Recorded Link", icon: Video, color: "text-[#d946ef]" },
                            ].map((item, i) => (
                                <button key={i} className="p-4 rounded-xl bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.05)] hover:border-[#7c3aed] transition-all flex items-center gap-3 text-left">
                                    <item.icon className={`w-5 h-5 ${item.color}`} />
                                    <span className="text-xs font-bold text-white">{item.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Chat & Participants */}
                    <div className="flex flex-col gap-6 overflow-hidden">
                        <div className="flex-1 bg-[rgba(19,10,48,0.5)] border border-[rgba(255,255,255,0.05)] rounded-3xl flex flex-col overflow-hidden backdrop-blur-md">
                            <div className="p-4 border-b border-[rgba(255,255,255,0.05)] flex justify-between items-center bg-[rgba(255,255,255,0.02)]">
                                <h3 className="text-sm font-bold text-white flex items-center gap-2 uppercase tracking-widest">
                                    <MessageCircle className="w-4 h-4 text-[var(--accent)]" />
                                    Live Chat
                                </h3>
                                <button className="p-1 hover:bg-white/5 rounded"><Users className="w-4 h-4 text-[var(--text-dim)]" /></button>
                            </div>

                            <div className="flex-1 p-4 overflow-y-auto space-y-4">
                                {[
                                    { user: "Sarah", msg: "Can we use React Query here?", time: "2:05 PM", role: "Student" },
                                    { user: "Dr. Alan", msg: "Yes, we will cover that in the next module.", time: "2:06 PM", role: "Tutor" },
                                    { user: "Kevin", msg: "The screen isn't visible clearly.", time: "2:08 PM", role: "Student" },
                                    { user: "System Bot", msg: "Session recorded successfully.", time: "2:10 PM", role: "System" },
                                ].map((chat, i) => (
                                    <div key={i} className="flex flex-col gap-1">
                                        <div className="flex items-center gap-2">
                                            <span className={`text-[10px] font-bold ${chat.role === 'Tutor' ? 'text-[#7c3aed]' : chat.role === 'System' ? 'text-amber-500' : 'text-[#22d3ee]'}`}>
                                                {chat.user}
                                            </span>
                                            <span className="text-[8px] text-[var(--text-dim)]">{chat.time}</span>
                                        </div>
                                        <p className="text-xs text-white/80 bg-white/5 p-2 rounded-lg border border-white/5">{chat.msg}</p>
                                    </div>
                                ))}
                            </div>

                            <div className="p-4 bg-[rgba(255,255,255,0.02)] border-t border-[rgba(255,255,255,0.05)]">
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Type your message..."
                                        className="w-full pl-4 pr-12 py-3 bg-[#030014] border border-[rgba(124,58,237,0.3)] rounded-xl text-sm text-white focus:outline-none focus:border-[#7c3aed] transition-all"
                                    />
                                    <button className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-[#7c3aed] hover:scale-110 transition-transform">
                                        <MessageCircle className="w-5 h-5 fill-current" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Quick Poll / Interaction */}
                        <div className="p-5 bg-gradient-to-br from-[#130a30] to-[#0f0728] border border-[#22d3ee]/20 rounded-3xl relative overflow-hidden">
                            <h4 className="text-xs font-bold text-[#22d3ee] uppercase tracking-widest mb-4">Quick Poll</h4>
                            <p className="text-xs text-white font-medium mb-4">Are you following the folder structure?</p>
                            <div className="space-y-3">
                                <button className="w-full py-2 bg-white/5 border border-white/10 rounded-lg text-xs text-[var(--text-dim)] hover:border-[#22d3ee] hover:text-white transition-all">Yes, I am!</button>
                                <button className="w-full py-2 bg-white/5 border border-white/10 rounded-lg text-xs text-[var(--text-dim)] hover:border-[#22d3ee] hover:text-white transition-all">Need more time</button>
                            </div>
                            <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-[#22d3ee]/5 blur-2xl pointer-events-none" />
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
