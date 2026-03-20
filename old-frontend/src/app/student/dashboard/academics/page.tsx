"use client";

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Video, Bell, FileText, Clock, Calendar, AlertCircle,
    Play, CheckCircle2, Award, Download, BookOpen, Users,
    Link as LinkIcon, MessageSquare, ChevronRight, ExternalLink
} from 'lucide-react';
import api from '@/lib/api';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useUserId } from '@/lib/useUserId';

interface LiveSession {
    id: string;
    title: string;
    batchId: string;
    batchName: string;
    mentorName: string;
    startTime: string;
    endTime: string;
    meetingLink: string;
    status: string;
    duration: number;
    platform: string;
}

interface Assignment {
    id: string;
    title: string;
    description: string;
    batchId: string;
    courseName: string;
    batchName: string;
    dueDate: string;
    totalMarks: number;
    difficulty: string;
    submissionStatus: 'SUBMITTED' | 'PENDING' | 'LATE';
}

interface Announcement {
    id: string;
    title: string;
    content: string;
    type: string;
    priority: string;
    createdByName: string;
    createdAt: string;
}

const tabs = [
    { id: 'sessions', label: 'LIVE CLASSES', icon: Video },
    { id: 'assignments', label: 'ASSIGNMENTS', icon: FileText },
    { id: 'notices', label: 'NOTICES', icon: Bell },
];

const PRIORITY_COLOR: Record<string, string> = {
    HIGH: 'text-red-400 bg-red-400/10 border-red-400/20',
    MEDIUM: 'text-amber-400 bg-amber-400/10 border-amber-400/20',
    LOW: 'text-slate-400 bg-slate-400/10 border-slate-400/20',
};

const SUBMISSION_COLOR: Record<string, string> = {
    SUBMITTED: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
    PENDING: 'text-amber-400 bg-amber-400/10 border-amber-400/20',
    LATE: 'text-red-400 bg-red-400/10 border-red-400/20',
};

function formatDate(dt: string) {
    if (!dt) return '—';
    return new Date(dt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}
function formatTime(dt: string) {
    if (!dt) return '—';
    return new Date(dt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}
function isOverdue(dueDate: string) {
    return new Date(dueDate) < new Date();
}

export default function StudentAcademicsPage() {
    const [activeTab, setActiveTab] = useState('sessions');
    const [sessions, setSessions] = useState<LiveSession[]>([]);
    const [assignments, setAssignments] = useState<Assignment[]>([]);
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();
    const userId = useUserId();

    useEffect(() => {
        const fetchData = async () => {
            if (!userId) return;
            try {
                // Step 1: get batches the student is enrolled in
                const batchRes = await api.get(`academic/batches/student/${encodeURIComponent(userId)}`);
                const myBatches: { id: string }[] = batchRes.data || [];
                const batchIds = myBatches.map(b => b.id);

                const [sRes, aRes, anRes] = await Promise.all([
                    api.get('academic/sessions'),
                    api.get('academic/assignments'),
                    api.get('academic/announcements'),
                ]);

                // Filter to only sessions/assignments from the student's batches
                const allSessions: LiveSession[] = sRes.data || [];
                const allAssignments: Assignment[] = aRes.data || [];
                setSessions(batchIds.length > 0 ? allSessions.filter(s => batchIds.includes(s.batchId ?? '')) : []);
                setAssignments(batchIds.length > 0 ? allAssignments.filter(a => batchIds.includes(a.batchId ?? '')) : []);
                setAnnouncements(anRes.data || []);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [userId]);

    const liveSessions = sessions.filter(s => s.status === 'LIVE');
    const upcomingSessions = sessions.filter(s => s.status === 'UPCOMING');
    const pendingAssignments = assignments.filter(a => a.submissionStatus === 'PENDING');
    const highPriorityNotices = announcements.filter(a => a.priority === 'HIGH');

    const stats = [
        { label: 'Live Now', value: liveSessions.length, icon: Video, color: 'text-red-400', bg: 'bg-red-400/10', pulse: liveSessions.length > 0 },
        { label: 'Upcoming Classes', value: upcomingSessions.length, icon: Calendar, color: 'text-blue-400', bg: 'bg-blue-400/10', pulse: false },
        { label: 'Pending Tasks', value: pendingAssignments.length, icon: FileText, color: 'text-amber-400', bg: 'bg-amber-400/10', pulse: pendingAssignments.length > 0 },
        { label: 'Urgent Notices', value: highPriorityNotices.length, icon: Bell, color: 'text-violet-400', bg: 'bg-violet-400/10', pulse: false },
    ];

    return (
        <DashboardLayout role="student">
            <div className="flex flex-col gap-8 pb-10">
                {/* Header */}
                <div>
                    <h1 className="text-4xl font-[Rajdhani] font-bold text-white tracking-widest uppercase">
                        Academics <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-violet-400">Portal</span>
                    </h1>
                    <p className="text-slate-400 font-medium mt-1">
                        Join live classes, submit assignments, and stay on top of academic notices.
                    </p>
                </div>

                {/* Live Alert Banner */}
                {liveSessions.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-4 p-4 bg-red-500/10 border border-red-500/30 rounded-2xl"
                    >
                        <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse flex-shrink-0" />
                        <div className="flex-1">
                            <span className="text-sm font-bold text-white">
                                {liveSessions.length} class{liveSessions.length > 1 ? 'es are' : ' is'} happening right now!
                            </span>
                            <span className="text-[11px] text-red-400 ml-2">Join before it ends.</span>
                        </div>
                        <button
                            onClick={() => setActiveTab('sessions')}
                            className="px-4 py-2 bg-red-500 text-white text-[10px] font-black uppercase rounded-xl hover:bg-red-400 transition-all"
                        >
                            Join Now
                        </button>
                    </motion.div>
                )}

                {/* Stats */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {stats.map((s, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.08 }}
                            className={`${s.bg} border border-white/5 rounded-2xl p-5 flex items-center gap-4`}
                        >
                            <div className={`p-3 rounded-xl bg-black/20 ${s.color} relative`}>
                                <s.icon size={20} />
                                {s.pulse && (
                                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full animate-ping" />
                                )}
                            </div>
                            <div>
                                <div className="text-2xl font-black text-white font-[Rajdhani]">{loading ? '—' : s.value}</div>
                                <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{s.label}</div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Tabs */}
                <div className="flex gap-2 p-1.5 bg-black/30 border border-white/5 rounded-2xl w-fit backdrop-blur-xl">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-[10px] font-black tracking-widest transition-all relative ${activeTab === tab.id
                                ? 'bg-gradient-to-r from-cyan-600 to-violet-600 text-white shadow-lg'
                                : 'text-slate-500 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            <tab.icon size={13} />
                            {tab.label}
                            {tab.id === 'assignments' && pendingAssignments.length > 0 && (
                                <span className="w-4 h-4 bg-amber-500 text-black rounded-full text-[8px] font-black flex items-center justify-center">
                                    {pendingAssignments.length}
                                </span>
                            )}
                        </button>
                    ))}
                </div>

                <AnimatePresence mode="wait">
                    {/* Sessions Tab */}
                    {activeTab === 'sessions' && (
                        <motion.div key="sessions" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
                            {loading ? (
                                <div className="text-center py-20 text-slate-500">Loading your class schedule...</div>
                            ) : sessions.length === 0 ? (
                                <div className="text-center py-20 text-slate-500">
                                    <Video size={48} className="mx-auto mb-4 opacity-20" />
                                    <p className="text-sm font-bold">No sessions scheduled yet.</p>
                                    <p className="text-xs mt-1 text-slate-600">Your trainer will schedule classes soon.</p>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    {liveSessions.length > 0 && (
                                        <div>
                                            <h3 className="text-[10px] font-black text-red-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                                                <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" /> Live Right Now
                                            </h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {liveSessions.map(s => <StudentSessionCard key={s.id} session={s} />)}
                                            </div>
                                        </div>
                                    )}
                                    {upcomingSessions.length > 0 && (
                                        <div>
                                            <h3 className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-3">Upcoming Classes</h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {upcomingSessions.map(s => <StudentSessionCard key={s.id} session={s} />)}
                                            </div>
                                        </div>
                                    )}
                                    {sessions.filter(s => s.status === 'COMPLETED').length > 0 && (
                                        <div>
                                            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Completed</h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {sessions.filter(s => s.status === 'COMPLETED').map(s => <StudentSessionCard key={s.id} session={s} />)}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </motion.div>
                    )}

                    {/* Assignments Tab */}
                    {activeTab === 'assignments' && (
                        <motion.div key="assignments" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
                            {loading ? (
                                <div className="text-center py-20 text-slate-500">Loading your tasks...</div>
                            ) : assignments.length === 0 ? (
                                <div className="text-center py-20 text-slate-500">
                                    <FileText size={48} className="mx-auto mb-4 opacity-20" />
                                    <p className="text-sm font-bold">No assignments posted yet.</p>
                                    <p className="text-xs mt-1 text-slate-600">Check back after your first class.</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {assignments.map((assignment, i) => {
                                        const overdue = isOverdue(assignment.dueDate) && assignment.submissionStatus === 'PENDING';
                                        const status = overdue ? 'LATE' : (assignment.submissionStatus || 'PENDING');
                                        return (
                                            <motion.div
                                                key={assignment.id}
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: i * 0.05 }}
                                                className={`flex items-start gap-4 p-5 rounded-2xl border transition-all group ${overdue ? 'bg-red-500/5 border-red-500/20' : 'bg-[#0a0a1a]/70 border-white/5 hover:border-violet-500/30'}`}
                                            >
                                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 ${status === 'SUBMITTED' ? 'bg-emerald-400/10 text-emerald-400' : overdue ? 'bg-red-400/10 text-red-400' : 'bg-amber-400/10 text-amber-400'}`}>
                                                    {status === 'SUBMITTED' ? <CheckCircle2 size={18} /> : <FileText size={18} />}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-start justify-between gap-4 mb-2">
                                                        <h4 className="font-bold text-white group-hover:text-violet-400 transition-colors">{assignment.title}</h4>
                                                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-black border flex-shrink-0 ${SUBMISSION_COLOR[status]}`}>
                                                            {status}
                                                        </span>
                                                    </div>
                                                    <p className="text-xs text-slate-500 mb-3 line-clamp-2">{assignment.description}</p>
                                                    <div className="flex flex-wrap gap-4 text-[10px] font-bold text-slate-500 uppercase mb-3">
                                                        <span className="flex items-center gap-1"><BookOpen size={10} /> {assignment.courseName}</span>
                                                        <span className={`flex items-center gap-1 ${overdue ? 'text-red-400' : ''}`}>
                                                            <AlertCircle size={10} /> Due: {formatDate(assignment.dueDate)}
                                                        </span>
                                                        <span className="flex items-center gap-1"><Award size={10} /> {assignment.totalMarks} Marks</span>
                                                    </div>
                                                    {status !== 'SUBMITTED' && (
                                                        <button className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${overdue ? 'bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500 hover:text-white' : 'bg-violet-600/10 text-violet-400 border border-violet-500/20 hover:bg-violet-600 hover:text-white'}`}>
                                                            {overdue ? 'Submit Late' : 'Submit Now'}
                                                        </button>
                                                    )}
                                                </div>
                                            </motion.div>
                                        );
                                    })}
                                </div>
                            )}
                        </motion.div>
                    )}

                    {/* Notices Tab */}
                    {activeTab === 'notices' && (
                        <motion.div key="notices" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
                            {loading ? (
                                <div className="text-center py-20 text-slate-500">Loading notices...</div>
                            ) : announcements.length === 0 ? (
                                <div className="text-center py-20 text-slate-500">
                                    <Bell size={48} className="mx-auto mb-4 opacity-20" />
                                    <p className="text-sm font-bold">No notices at the moment.</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {announcements.map((ann, i) => (
                                        <motion.div
                                            key={ann.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: i * 0.05 }}
                                            className={`p-5 rounded-2xl border transition-all ${ann.priority === 'HIGH' ? 'bg-red-500/5 border-red-500/20' : 'bg-[#0a0a1a]/70 border-white/5 hover:border-cyan-500/30'}`}
                                        >
                                            <div className="flex justify-between items-start mb-3">
                                                <div className="flex items-start gap-3">
                                                    <div className={`p-2 rounded-xl mt-0.5 ${ann.priority === 'HIGH' ? 'bg-red-400/10 text-red-400' : 'bg-cyan-400/10 text-cyan-400'}`}>
                                                        <Bell size={14} />
                                                    </div>
                                                    <h4 className="font-bold text-white">{ann.title}</h4>
                                                </div>
                                                <span className={`px-2 py-0.5 rounded-full text-[9px] font-black border ${PRIORITY_COLOR[ann.priority] || PRIORITY_COLOR['LOW']}`}>
                                                    {ann.priority}
                                                </span>
                                            </div>
                                            <p className="text-xs text-slate-400 mb-3 leading-relaxed pl-9">{ann.content}</p>
                                            <div className="flex justify-between text-[10px] font-bold text-slate-600 uppercase pl-9">
                                                <span>Posted by {ann.createdByName}</span>
                                                <span>{formatDate(ann.createdAt)}</span>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </DashboardLayout>
    );
}

function StudentSessionCard({ session }: { session: LiveSession }) {
    const isLive = session.status === 'LIVE';
    const isCompleted = session.status === 'COMPLETED';
    return (
        <div className={`p-5 rounded-2xl border transition-all group ${isLive ? 'bg-red-500/5 border-red-500/30' : isCompleted ? 'bg-white/[0.02] border-white/5' : 'bg-[#0a0a1a]/70 border-white/5 hover:border-cyan-500/30'}`}>
            <div className="flex items-start justify-between mb-3">
                <div className="flex-1 min-w-0 pr-3">
                    <h4 className="font-bold text-white truncate group-hover:text-cyan-400 transition-colors">{session.title}</h4>
                    <p className="text-[10px] text-slate-500 font-bold uppercase mt-0.5 truncate">{session.batchName}</p>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase border flex-shrink-0 ${isLive ? 'text-red-400 bg-red-400/10 border-red-400/30 animate-pulse' : isCompleted ? 'text-slate-400 bg-slate-400/10 border-slate-400/20' : 'text-blue-400 bg-blue-400/10 border-blue-400/20'}`}>
                    {session.status}
                </span>
            </div>

            <div className="flex flex-wrap gap-3 text-[10px] font-bold text-slate-500 uppercase mb-4">
                <span className="flex items-center gap-1"><Clock size={9} />
                    {new Date(session.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
                <span className="flex items-center gap-1"><Clock size={9} /> {session.duration} mins</span>
                {session.mentorName && <span>{session.mentorName}</span>}
            </div>

            {isLive && session.meetingLink ? (
                <a href={session.meetingLink} target="_blank" rel="noopener noreferrer"
                    className="w-full py-2.5 bg-red-500 hover:bg-red-400 text-white font-black text-[10px] uppercase tracking-widest rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-red-500/20">
                    <Play size={12} fill="currentColor" /> Join Live Class
                </a>
            ) : !isCompleted ? (
                <div className="w-full py-2.5 bg-blue-500/10 text-blue-400 border border-blue-500/20 font-black text-[10px] uppercase tracking-widest rounded-xl flex items-center justify-center gap-2">
                    <Calendar size={12} />
                    {new Date(session.startTime).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} at {new Date(session.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
            ) : (
                <div className="w-full py-2.5 bg-white/5 text-slate-500 font-black text-[10px] uppercase tracking-widest rounded-xl flex items-center justify-center gap-2">
                    <CheckCircle2 size={12} /> Class Ended
                </div>
            )}
        </div>
    );
}
