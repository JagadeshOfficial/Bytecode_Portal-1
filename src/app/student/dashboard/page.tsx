"use client";

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import { motion, AnimatePresence } from 'framer-motion';
import {
    BookOpen,
    PlayCircle,
    FileText,
    Award,
    Clock,
    Zap,
    Rocket,
    BarChart3,
    MoreVertical,
    Calendar,
    Video,
    ChevronRight,
    Search,
    Filter,
    ArrowUpRight,
    Wallet,
    AlertCircle,
    GraduationCap
} from 'lucide-react';
import Link from 'next/link';

interface Course {
    id: string;
    title: string;
    description: string;
    thumbnail: string;
}

interface LiveSession {
    id: string;
    title: string;
    mentorName: string;
    courseId: string;
    startTime: string;
    meetingLink: string;
    status: string;
}

interface PendingAssignment {
    title: string;
    deadline: string;
    subject: string;
    status: string;
}

const PENDING_ASSIGNMENTS: PendingAssignment[] = [
    { title: "Redux Middleware Task", deadline: "Today, 11:59 PM", subject: "React JS", status: "Critical" },
    { title: "Terraform Infrastructure", deadline: "Feb 12", subject: "Cloud Ops", status: "Upcoming" },
];

export default function StudentMasterDashboard() {
    const { user } = useAuth();
    const [courses, setCourses] = useState<Course[]>([]);
    const [liveSessions, setLiveSessions] = useState<LiveSession[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStudentData = async () => {
            try {
                const [coursesRes, sessionsRes] = await Promise.all([
                    api.get('courses'),
                    api.get('academic/sessions')
                ]);

                setCourses((coursesRes.data || []).slice(0, 3));
                setLiveSessions(sessionsRes.data || []);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching student data:", err);
                setLoading(false);
            }
        };
        fetchStudentData();
    }, []);

    const firstName = (user?.name || 'Student').split(' ')[0];

    return (
        <DashboardLayout role="student">
            <div className="flex flex-col gap-8 pb-10">
                {/* Greeting Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                        <motion.h1
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="text-4xl font-display font-bold text-white tracking-tight"
                        >
                            Elevate, <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-400">{firstName}</span>
                        </motion.h1>
                        <p className="text-slate-400 font-medium mt-1">Your training and placement journey is 82% ahead of your batchmates.</p>
                    </div>
                    {/* ... (rest of greeting section) */}
                </div>

                {/* Top Metrics Grid ... */}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Primary Learning Area */}
                    <div className="lg:col-span-2 flex flex-col gap-8">
                        {/* Enrolled Courses */}
                        <div className="bg-[#0a0a1a]/60 border border-white/5 rounded-[2.5rem] p-8 backdrop-blur-xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-violet-600/5 blur-[100px] -mr-32 -mt-32 rounded-full" />
                            <div className="flex justify-between items-center mb-10 relative z-10">
                                <div>
                                    <h3 className="text-2xl font-bold text-white tracking-tight">Active Courses</h3>
                                    <p className="text-sm text-slate-500">Pick up where you left off</p>
                                </div>
                                <Link href="/student/dashboard/lms" className="text-xs text-violet-400 font-bold hover:text-violet-300 flex items-center gap-1 transition-colors">
                                    OPEN LMS VAULT <ChevronRight size={14} />
                                </Link>
                            </div>
                            <div className="space-y-4 relative z-10">
                                {loading ? (
                                    <div className="text-center py-10 text-slate-500">Loading your journey...</div>
                                ) : courses.length > 0 ? (
                                    courses.map((course: Course, i: number) => (
                                        <div key={i} className="p-6 rounded-3xl bg-white/[0.02] border border-white/5 hover:border-violet-500/30 hover:bg-white/[0.04] transition-all cursor-pointer group/item flex items-center justify-between gap-6">
                                            <div className="flex items-center gap-5">
                                                <div className="w-16 h-16 rounded-2xl bg-[#0a0a1a] border border-white/10 flex items-center justify-center text-3xl shadow-xl group-hover/item:scale-110 group-hover/item:border-violet-500/50 transition-all duration-500">
                                                    📚
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-white text-lg group-hover/item:text-violet-400 transition-colors uppercase tracking-tight">{course.title}</h4>
                                                    <div className="mt-2 flex items-center gap-3">
                                                        <div className="w-32 h-1.5 bg-white/5 rounded-full overflow-hidden">
                                                            <div className="h-full bg-gradient-to-r from-violet-600 to-cyan-400" style={{ width: '45%' }} />
                                                        </div>
                                                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">45%</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <button className="hidden md:flex flex-col items-center gap-1 p-3 bg-violet-600 hover:bg-violet-700 text-white rounded-2xl shadow-lg shadow-violet-500/20 transition-all uppercase text-[10px] font-black tracking-widest">
                                                RESUME
                                            </button>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-10 text-slate-500 italic">No courses found. Start learning today!</div>
                                )}
                            </div>
                        </div>

                        {/* Recent Performance & Mock Analysis */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="bg-[#0a0a1a]/60 border border-white/5 rounded-[2.5rem] p-8 backdrop-blur-xl">
                                <h3 className="text-xl font-bold text-white mb-8 flex items-center gap-3">
                                    <Award className="text-violet-400" size={24} />
                                    Job Readiness
                                </h3>
                                <div className="space-y-6">
                                    {[
                                        { label: "Aptitude", score: 88, color: "bg-cyan-400" },
                                        { label: "Coding Round", score: 72, color: "bg-violet-600" },
                                        { label: "Soft Skills", score: 94, color: "bg-fuchsia-500" },
                                    ].map((skill: { label: string; score: number; color: string }, i: number) => (
                                        <div key={i} className="space-y-2">
                                            <div className="flex justify-between text-[10px] font-black text-slate-500 uppercase tracking-tighter">
                                                <span>{skill.label}</span>
                                                <span className="text-white">{skill.score}%</span>
                                            </div>
                                            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${skill.score}%` }}
                                                    className={`h-full ${skill.color}`}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <button className="w-full mt-10 py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black text-slate-400 hover:text-white hover:bg-violet-600 hover:border-violet-500 transition-all uppercase tracking-widest">
                                    Detailed Analysis
                                </button>
                            </div>

                            <div className="bg-[#0a0a1a]/60 border border-white/5 rounded-[2.5rem] p-8 backdrop-blur-xl">
                                <h3 className="text-xl font-bold text-white mb-8 flex items-center gap-3">
                                    <Clock className="text-amber-400" size={24} />
                                    Pending Tasks
                                </h3>
                                <div className="space-y-4">
                                    {PENDING_ASSIGNMENTS.map((task: PendingAssignment, i: number) => (
                                        <div key={i} className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col gap-2">
                                            <div className="flex justify-between items-start">
                                                <span className="text-xs font-bold text-white">{task.title}</span>
                                                <span className={`text-[10px] px-2 py-0.5 rounded-full ${task.status === 'Critical' ? 'bg-red-500/10 text-red-500' : 'bg-blue-500/10 text-blue-500'} font-bold`}>
                                                    {task.status}
                                                </span>
                                            </div>
                                            <div className="flex justify-between items-center text-[10px] font-bold text-slate-500">
                                                <span>{task.subject}</span>
                                                <span className="flex items-center gap-1"><AlertCircle size={10} /> {task.deadline}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <button className="w-full mt-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black text-slate-400 hover:text-white hover:bg-violet-600 hover:border-violet-500 transition-all uppercase tracking-widest">
                                    Submit Assignments
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Right Sidebar - Info Hub */}
                    <div className="flex flex-col gap-8">
                        {/* Session Hub */}
                        <div className="bg-[#0a0a1a]/60 border border-[#22d3ee]/20 rounded-[2.5rem] p-8 backdrop-blur-xl">
                            <h3 className="text-xl font-bold text-white mb-8 flex items-center gap-3">
                                <PlayCircle className="text-cyan-400" size={24} />
                                Next Session
                            </h3>
                            <div className="space-y-4">
                                {loading ? (
                                    <div className="text-center py-6 text-slate-500 text-xs">Syncing schedule...</div>
                                ) : liveSessions.length > 0 ? (
                                    liveSessions.map((session: LiveSession, i: number) => {
                                        const startTime = new Date(session.startTime);
                                        const timeStr = startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                                        const isLive = session.status === 'LIVE';

                                        return (
                                            <div key={session.id || i} className="flex flex-col gap-4 p-5 rounded-3xl bg-white/[0.03] border border-white/5 group hover:bg-white/[0.05] transition-all relative overflow-hidden">
                                                {isLive && (
                                                    <div className="absolute top-0 right-0 p-2">
                                                        <div className="flex items-center gap-1 px-2 py-0.5 bg-red-500/10 border border-red-500/20 text-red-500 rounded-full animate-pulse">
                                                            <div className="w-1 h-1 bg-red-500 rounded-full" />
                                                            <span className="text-[10px] font-black">LIVE</span>
                                                        </div>
                                                    </div>
                                                )}
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-2xl bg-cyan-400/10 border border-cyan-400/20 flex items-center justify-center text-cyan-400">
                                                        <Video size={24} />
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-bold text-white group-hover:text-cyan-400 transition-colors">{session.title}</div>
                                                        <div className="text-[10px] text-slate-500 font-bold uppercase mt-1">
                                                            {timeStr} • {session.mentorName}
                                                        </div>
                                                    </div>
                                                </div>
                                                <Link
                                                    href={session.meetingLink || "#"}
                                                    target="_blank"
                                                    className={`w-full py-3 text-center ${isLive ? 'bg-cyan-500 text-black' : 'bg-white/5 text-white'} font-bold rounded-xl text-xs transition-all uppercase tracking-widest`}
                                                >
                                                    {isLive ? 'JOIN CLASS' : 'DETAILS'}
                                                </Link>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <div className="text-center py-6 text-slate-500 text-xs italic">No sessions scheduled</div>
                                )}
                            </div>
                            <button className="w-full mt-6 text-center text-[10px] font-black text-slate-500 hover:text-cyan-400 transition-colors uppercase tracking-[0.2em]">VIEW FULL SCHEDULE</button>
                        </div>

                        {/* Marketplace / Placement Quick Stats */}
                        <div className="bg-gradient-to-br from-violet-600/20 via-transparent to-transparent border border-violet-500/20 rounded-[2.5rem] p-8 backdrop-blur-xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-6">
                                <Rocket className="text-violet-500/30 -rotate-12 group-hover:rotate-0 transition-transform duration-700" size={48} />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-6 uppercase tracking-tight">Placement HQ</h3>
                            <div className="space-y-6">
                                <div className="flex justify-between items-center">
                                    <span className="text-xs text-slate-400 font-bold">Recommended Jobs</span>
                                    <span className="text-lg font-black text-violet-400">12</span>
                                </div>
                                <div className="flex justify-between items-center text-xs font-bold">
                                    <span className="text-slate-400">Application Status</span>
                                    <span className="text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-lg">Shortlisted (2)</span>
                                </div>
                                <div className="pt-6 border-t border-white/10">
                                    <Link href="/student/dashboard/placements" className="w-full py-4 bg-violet-600 hover:bg-violet-700 text-white font-bold rounded-2xl flex items-center justify-center gap-2 shadow-xl shadow-violet-500/20 transition-all uppercase text-xs tracking-widest">
                                        GO TO PLACEMENTS <ArrowUpRight size={16} />
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/* Recent Activity Mini-Feed */}
                        <div className="p-6 bg-[#0a0a1a]/40 border border-white/5 rounded-[2.5rem]">
                            <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-6">Recent Records</h4>
                            <div className="space-y-6 relative ml-2">
                                <div className="absolute left-0 top-0 bottom-0 w-[1px] bg-white/5" />
                                {[
                                    { label: "Fee Received", time: "2 days ago", icon: Wallet, color: "text-emerald-400" },
                                    { label: "Assignment Submitted", time: "Feb 06", icon: FileText, color: "text-blue-400" },
                                    { label: "Mock Test Completed", time: "Jan 28", icon: GraduationCap, color: "text-violet-400" },
                                ].map((act: { label: string; time: string; icon: any; color: string }, i: number) => (
                                    <div key={i} className="relative pl-6">
                                        <div className="absolute left-[-4px] top-1 w-2 h-2 rounded-full bg-slate-800 border border-slate-700" />
                                        <div className="text-[11px] font-bold text-white">{act.label}</div>
                                        <div className="text-[10px] text-slate-600 font-bold uppercase">{act.time}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
