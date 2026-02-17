"use client";

import { useState, useEffect, useMemo } from 'react';
import AdvancedModuleLayout from '@/components/dashboard/AdvancedModuleLayout';
import { motion, AnimatePresence } from 'framer-motion';
import {
    GraduationCap,
    BookOpen,
    Users,
    TrendingUp,
    CheckCircle,
    Calendar,
    Clock,
    FileText,
    PieChart,
    Layers,
    PlayCircle,
    MoreVertical,
    Plus,
    Search,
    Settings,
    Video,
    Award,
    Bell,
    AlertCircle,
    Play,
    X
} from 'lucide-react';
import api from '@/lib/api';

interface Batch {
    id: string;
    batchCode: string;
    batchName: string;
    courseId: string;
    courseName: string;
    trainerId: string;
    trainerName: string;
    startDate: string;
    endDate: string;
    status: string;
    totalStudents: number;
    schedule: string;
    mode: string;
    branch: string;
    maxCapacity: number;
}

interface LiveSession {
    id: string;
    title: string;
    description: string;
    mentorName: string;
    courseName: string;
    batchName: string;
    startTime: string;
    endTime: string;
    duration: number;
    meetingLink: string;
    status: string;
    platform: string;
    totalParticipants: number;
}

interface Assignment {
    id: string;
    title: string;
    description: string;
    courseName: string;
    batchName: string;
    trainerName: string;
    assignedDate: string;
    dueDate: string;
    totalMarks: number;
    difficulty: string;
    status: string;
}

interface Announcement {
    id: string;
    title: string;
    content: string;
    type: string;
    priority: string;
    createdByName: string;
    createdAt: string;
    isPinned: boolean;
}

export default function AcademicsPage() {
    const [activeTab, setActiveTab] = useState('overview');
    const [loading, setLoading] = useState(true);

    // State for data
    const [batches, setBatches] = useState<Batch[]>([]);
    const [sessions, setSessions] = useState<LiveSession[]>([]);
    const [assignments, setAssignments] = useState<Assignment[]>([]);
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [archivedRecordings, setArchivedRecordings] = useState<any[]>([]);
    const [showVideoModal, setShowVideoModal] = useState(false);
    const [selectedVideo, setSelectedVideo] = useState<any>(null);

    // Fetch all academic data
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [batchesRes, sessionsRes, assignmentsRes, announcementsRes] = await Promise.all([
                    api.get('/academic/batches'),
                    api.get('/academic/sessions'),
                    api.get('/academic/assignments'),
                    api.get('/academic/announcements')
                ]);

                setBatches(batchesRes.data);
                setSessions(sessionsRes.data);
                setAssignments(assignmentsRes.data);
                setAnnouncements(announcementsRes.data);

                // Load recordings from shared localStorage
                if (typeof window !== 'undefined') {
                    const stored = localStorage.getItem('bytecode_recordings');
                    if (stored) {
                        setArchivedRecordings(JSON.parse(stored));
                    }
                }
                setLoading(false);
            } catch (error) {
                console.error("Failed to fetch academic data:", error);
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Calculate stats from real data - using useMemo to ensure recalculation when data changes
    const stats = useMemo(() => [
        {
            label: "Total Batches",
            value: batches.length.toString(),
            icon: BookOpen,
            color: "#3b82f6",
            trend: `${batches.filter(b => b.status === 'ONGOING').length} Active`
        },
        {
            label: "Active Sessions",
            value: sessions.filter(s => s.status === 'ONGOING' || s.status === 'UPCOMING').length.toString(),
            icon: Video,
            color: "#8b5cf6",
            trend: "Live Now"
        },
        {
            label: "Total Students",
            value: batches.reduce((acc, b) => acc + (b.totalStudents || 0), 0).toString(),
            icon: GraduationCap,
            color: "#10b981",
            trend: `${batches.length} Batches`
        },
        {
            label: "Assignments",
            value: assignments.length.toString(),
            icon: FileText,
            color: "#f59e0b",
            trend: `${assignments.filter(a => a.status === 'ACTIVE').length} Active`
        },
    ], [batches, sessions, assignments]);

    // Get ongoing batches for overview
    const ongoingBatches = batches.filter(b => b.status === 'ONGOING').slice(0, 5);

    // Get live/upcoming sessions
    const liveSessions = sessions.filter(s => s.status === 'ONGOING' || s.status === 'UPCOMING').slice(0, 3);

    // Get pinned announcements
    const pinnedAnnouncements = announcements.filter(a => a.isPinned).slice(0, 3);

    // Calculate batch progress (mock calculation based on dates)
    const calculateProgress = (batch: Batch) => {
        const start = new Date(batch.startDate).getTime();
        const end = new Date(batch.endDate).getTime();
        const now = new Date().getTime();
        const progress = ((now - start) / (end - start)) * 100;
        return Math.min(Math.max(progress, 0), 100);
    };

    // Format date
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    // Format time
    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    };

    // Get status color
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'ONGOING':
            case 'LIVE':
                return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
            case 'UPCOMING':
                return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
            case 'COMPLETED':
                return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
            case 'ACTIVE':
                return 'bg-violet-500/10 text-violet-400 border-violet-500/20';
            case 'CLOSED':
                return 'bg-red-500/10 text-red-400 border-red-500/20';
            default:
                return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
        }
    };

    if (loading) {
        return (
            <AdvancedModuleLayout
                title="Academic Management"
                subtitle="Oversee curriculum, courses, batches, and student progression."
                stats={stats}
                activeTab={activeTab}
                onTabChange={setActiveTab}
                tabs={[
                    { id: 'overview', label: 'Overview', icon: PieChart },
                    { id: 'batches', label: 'Batches', icon: Users },
                    { id: 'sessions', label: 'Live Sessions', icon: Video },
                    { id: 'recordings', label: 'Recordings', icon: PlayCircle },
                    { id: 'assignments', label: 'Assignments', icon: FileText },
                ]}
            >
                <div className="flex items-center justify-center h-64">
                    <div className="text-white">Loading academic data...</div>
                </div>
            </AdvancedModuleLayout>
        );
    }

    return (
        <AdvancedModuleLayout
            title="Academic Management"
            subtitle="Oversee curriculum, courses, batches, and student progression."
            stats={stats}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            tabs={[
                { id: 'overview', label: 'Overview', icon: PieChart },
                { id: 'batches', label: 'Batches', icon: Users },
                { id: 'sessions', label: 'Live Sessions', icon: Video },
                { id: 'recordings', label: 'Recordings', icon: PlayCircle },
                { id: 'assignments', label: 'Assignments', icon: FileText },
            ]}
        >
            {activeTab === 'overview' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Active Batches List */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-slate-900/50 border border-white/5 rounded-2xl p-6 backdrop-blur-sm lg:col-span-2"
                    >
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                <Users className="text-blue-400" /> Ongoing Batches
                            </h3>
                            <button
                                onClick={() => setActiveTab('batches')}
                                className="text-xs text-blue-400 font-bold hover:underline"
                            >
                                View All
                            </button>
                        </div>
                        <div className="space-y-4">
                            {ongoingBatches.length > 0 ? ongoingBatches.map((batch, i) => (
                                <div key={batch.id} className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5 hover:border-blue-500/30 transition-all cursor-pointer group">
                                    <div className="flex items-center gap-4">
                                        <div className="h-12 w-12 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400 border border-blue-500/20 group-hover:scale-110 transition-transform">
                                            <b className="text-lg">{batch.batchCode.charAt(0)}</b>
                                        </div>
                                        <div>
                                            <div className="font-bold text-white group-hover:text-blue-400 transition-colors">{batch.batchName}</div>
                                            <div className="text-xs text-slate-400 flex items-center gap-2">
                                                <span><Clock size={10} className="inline mr-1" />{batch.schedule}</span>
                                                <span className="w-1 h-1 bg-slate-600 rounded-full" />
                                                <span>{batch.trainerName}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase border ${getStatusColor(batch.status)}`}>
                                            {batch.status}
                                        </span>
                                        <div className="mt-2 text-xs text-slate-400">{batch.totalStudents}/{batch.maxCapacity} Students</div>
                                        <div className="mt-2 w-24 h-1 bg-slate-700 rounded-full overflow-hidden ml-auto">
                                            <div className="h-full bg-blue-500" style={{ width: `${calculateProgress(batch)}%` }} />
                                        </div>
                                    </div>
                                </div>
                            )) : (
                                <div className="text-center text-slate-400 py-8">No ongoing batches</div>
                            )}
                        </div>
                    </motion.div>

                    {/* Live Sessions & Announcements */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-6"
                    >
                        {/* Live Sessions */}
                        <div className="bg-slate-900/50 border border-white/5 rounded-2xl p-6 backdrop-blur-sm">
                            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                <Video className="text-violet-400" /> Live Sessions
                            </h3>
                            <div className="space-y-3">
                                {liveSessions.length > 0 ? liveSessions.slice(0, 3).map((session) => (
                                    <div key={session.id} className="p-3 bg-white/5 rounded-lg border border-white/5 hover:border-violet-500/30 transition-all">
                                        <div className="flex justify-between items-start mb-2">
                                            <div className="font-bold text-sm text-white">{session.batchName}</div>
                                            <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase border ${getStatusColor(session.status)}`}>
                                                {session.status}
                                            </span>
                                        </div>
                                        <div className="text-xs text-slate-400 space-y-1">
                                            <div className="flex items-center gap-1">
                                                <Clock size={10} />
                                                {formatTime(session.startTime)} - {formatTime(session.endTime)}
                                            </div>
                                            <div>{session.mentorName}</div>
                                        </div>
                                    </div>
                                )) : (
                                    <div className="text-center text-slate-400 py-4 text-sm">No live sessions</div>
                                )}
                            </div>
                        </div>

                        {/* Announcements */}
                        <div className="bg-slate-900/50 border border-white/5 rounded-2xl p-6 backdrop-blur-sm">
                            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                <Bell className="text-amber-400" /> Announcements
                            </h3>
                            <div className="space-y-3">
                                {pinnedAnnouncements.length > 0 ? pinnedAnnouncements.map((announcement) => (
                                    <div key={announcement.id} className="p-3 bg-white/5 rounded-lg border border-white/5">
                                        <div className="font-bold text-sm text-white mb-1">{announcement.title}</div>
                                        <div className="text-xs text-slate-400 line-clamp-2">{announcement.content}</div>
                                        <div className="mt-2 flex items-center justify-between">
                                            <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase border ${getStatusColor(announcement.priority)}`}>
                                                {announcement.priority}
                                            </span>
                                            <span className="text-[10px] text-slate-500">{formatDate(announcement.createdAt)}</span>
                                        </div>
                                    </div>
                                )) : (
                                    <div className="text-center text-slate-400 py-4 text-sm">No announcements</div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}

            {activeTab === 'batches' && (
                <div className="space-y-6">
                    <div className="flex justify-between items-center">
                        <div className="relative w-96">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                            <input type="text" placeholder="Search batches..." className="w-full bg-slate-900/50 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors" />
                        </div>
                        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-colors">
                            <Plus size={16} /> Add New Batch
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {batches.map((batch, i) => (
                            <motion.div
                                key={batch.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.05 }}
                                className="bg-slate-900/50 border border-white/5 rounded-2xl p-5 hover:border-blue-500/50 transition-all group relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button className="p-2 hover:bg-white/10 rounded-lg text-white"><MoreVertical size={16} /></button>
                                </div>
                                <div className="flex items-center justify-between mb-4">
                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
                                        <Users size={24} />
                                    </div>
                                    <span className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase border ${getStatusColor(batch.status)}`}>
                                        {batch.status}
                                    </span>
                                </div>
                                <h3 className="text-lg font-bold text-white mb-1 group-hover:text-blue-400 transition-colors">{batch.batchName}</h3>
                                <div className="text-sm text-slate-400 mb-3">{batch.courseName}</div>
                                <div className="flex gap-2 mb-4">
                                    <span className="text-[10px] bg-white/5 border border-white/5 px-2 py-0.5 rounded text-slate-400">{batch.mode}</span>
                                    <span className="text-[10px] bg-white/5 border border-white/5 px-2 py-0.5 rounded text-slate-400">{batch.branch}</span>
                                </div>
                                <div className="space-y-2 text-xs text-slate-400 border-t border-white/5 pt-4">
                                    <div className="flex justify-between">
                                        <span>Trainer:</span>
                                        <span className="text-white font-bold">{batch.trainerName}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Students:</span>
                                        <span className="text-white font-bold">{batch.totalStudents}/{batch.maxCapacity}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Schedule:</span>
                                        <span className="text-white font-bold text-[10px]">{batch.schedule}</span>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            )}

            {activeTab === 'sessions' && (
                <div className="space-y-6">
                    <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-bold text-white">Live Sessions</h2>
                        <button className="bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-colors">
                            <Plus size={16} /> Schedule Session
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {sessions.map((session, i) => (
                            <motion.div
                                key={session.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.05 }}
                                className="bg-slate-900/50 border border-white/5 rounded-2xl p-6 hover:border-violet-500/50 transition-all group"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-violet-500/20">
                                            <Video size={24} />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-white group-hover:text-violet-400 transition-colors">{session.title}</h3>
                                            <div className="text-sm text-slate-400">{session.batchName}</div>
                                        </div>
                                    </div>
                                    <span className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase border ${getStatusColor(session.status)}`}>
                                        {session.status}
                                    </span>
                                </div>
                                <div className="space-y-2 text-sm text-slate-400 mb-4">
                                    <div className="flex items-center gap-2">
                                        <Clock size={14} className="text-violet-400" />
                                        {formatDate(session.startTime)} • {formatTime(session.startTime)} - {formatTime(session.endTime)}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Users size={14} className="text-violet-400" />
                                        {session.mentorName} • {session.totalParticipants} participants
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Award size={14} className="text-violet-400" />
                                        {session.platform}
                                    </div>
                                </div>
                                {session.description && (
                                    <p className="text-xs text-slate-400 mb-4 line-clamp-2">{session.description}</p>
                                )}
                                {session.status === 'ONGOING' && (
                                    <button className="w-full py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg text-sm font-bold transition-colors">
                                        Join Session
                                    </button>
                                )}
                            </motion.div>
                        ))}
                    </div>
                </div>
            )}

            {activeTab === 'assignments' && (
                <div className="space-y-6">
                    <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-bold text-white">Assignments</h2>
                        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-colors">
                            <Plus size={16} /> Create Assignment
                        </button>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                        {assignments.map((assignment, i) => (
                            <motion.div
                                key={assignment.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.05 }}
                                className="bg-slate-900/50 border border-white/5 rounded-2xl p-6 hover:border-blue-500/50 transition-all group"
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-3">
                                            <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400 border border-blue-500/20">
                                                <FileText size={20} />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors">{assignment.title}</h3>
                                                <div className="text-sm text-slate-400">{assignment.courseName} • {assignment.batchName}</div>
                                            </div>
                                        </div>
                                        <p className="text-sm text-slate-400 mb-4 line-clamp-2">{assignment.description}</p>
                                        <div className="flex items-center gap-4 text-xs text-slate-400">
                                            <div className="flex items-center gap-1">
                                                <Calendar size={12} />
                                                Due: {formatDate(assignment.dueDate)}
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Award size={12} />
                                                {assignment.totalMarks} marks
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Users size={12} />
                                                {assignment.trainerName}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end gap-2">
                                        <span className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase border ${getStatusColor(assignment.status)}`}>
                                            {assignment.status}
                                        </span>
                                        <span className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase border ${assignment.difficulty === 'EASY' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                                            assignment.difficulty === 'MEDIUM' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' :
                                                'bg-red-500/10 text-red-400 border-red-500/20'
                                            }`}>
                                            {assignment.difficulty}
                                        </span>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            )}
            {activeTab === 'recordings' && (
                <div className="space-y-6">
                    <div className="flex justify-between items-center bg-slate-900/40 border border-white/5 p-6 rounded-2xl">
                        <div className="relative w-96">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                            <input
                                type="text"
                                placeholder="Search all recordings by topic or batch..."
                                className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-12 pr-6 text-sm text-white focus:outline-none focus:border-red-500 transition-all font-bold"
                            />
                        </div>
                        <div className="flex gap-4">
                            <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs font-bold text-slate-400 flex items-center gap-2 uppercase tracking-widest">
                                <Clock size={14} /> {archivedRecordings.length} Total Archives
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {archivedRecordings.length === 0 ? (
                            <div className="col-span-full flex flex-col items-center justify-center py-20 bg-white/5 rounded-3xl border border-dashed border-white/10">
                                <div className="w-20 h-20 rounded-full bg-slate-800 flex items-center justify-center mb-4">
                                    <Video className="text-slate-600" size={32} />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2 uppercase font-[Rajdhani]">No Recordings Yet</h3>
                                <p className="text-sm text-slate-500">Recordings started in the live room will appear here automatically.</p>
                            </div>
                        ) : archivedRecordings.map((rec, i) => (
                            <motion.div
                                key={rec.id || i}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: i * 0.1 }}
                                onClick={() => {
                                    setSelectedVideo(rec);
                                    setShowVideoModal(true);
                                }}
                                className="group bg-slate-900/50 border border-white/5 rounded-2xl p-5 hover:border-red-500/30 transition-all cursor-pointer relative overflow-hidden"
                            >
                                <div className="aspect-video bg-black rounded-xl mb-4 relative overflow-hidden border border-white/5 group-hover:border-red-500/20 transition-all shadow-2xl">
                                    <img
                                        src={rec.thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80'}
                                        alt={rec.title}
                                        className="w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-700"
                                    />
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <div className="w-12 h-12 rounded-full bg-red-600 text-white flex items-center justify-center shadow-lg shadow-red-500/40">
                                            <Play size={24} fill="currentColor" />
                                        </div>
                                    </div>
                                    <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/80 backdrop-blur-md rounded text-[9px] font-black text-white border border-white/10">
                                        {rec.duration}
                                    </div>
                                </div>

                                <div className="flex justify-between items-start mb-3">
                                    <span className="text-[9px] font-black text-red-500 bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20 uppercase tracking-tighter">{rec.batchName}</span>
                                    <span className="text-[9px] font-bold text-slate-500 uppercase flex items-center gap-1"><Calendar size={10} /> {rec.date}</span>
                                </div>

                                <h4 className="text-base font-bold text-white mb-4 tracking-tight group-hover:text-red-400 transition-colors uppercase font-[Rajdhani] line-clamp-1">{rec.title}</h4>

                                <div className="mt-auto flex items-center justify-between pt-4 border-t border-white/5">
                                    <div className="flex flex-col">
                                        <span className="text-[8px] text-slate-500 uppercase font-black mb-0.5">MENTOR</span>
                                        <span className="text-[11px] font-bold text-slate-300">{rec.mentorName}</span>
                                    </div>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setSelectedVideo(rec);
                                            setShowVideoModal(true);
                                        }}
                                        className="flex items-center gap-2 text-[10px] font-black text-red-500 hover:text-white transition-colors uppercase tracking-widest bg-red-500/5 px-4 py-2 rounded-xl border border-red-500/10 group-hover:bg-red-600 group-hover:text-white group-hover:border-red-500 transition-all font-[Rajdhani]"
                                    >
                                        PLAY <Play size={14} />
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            )}

            {/* Video Player Modal */}
            <AnimatePresence>
                {showVideoModal && selectedVideo && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl"
                        onClick={() => setShowVideoModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="relative w-full max-w-5xl aspect-video bg-black rounded-3xl overflow-hidden shadow-2xl border border-white/10"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Close Button */}
                            <button
                                onClick={() => setShowVideoModal(false)}
                                className="absolute top-6 right-6 z-50 p-3 bg-black/50 hover:bg-red-600 text-white rounded-full transition-all border border-white/10"
                            >
                                <X size={24} />
                            </button>

                            {/* Video Title & Info Overlay */}
                            <div className="absolute top-0 left-0 right-0 p-8 bg-gradient-to-b from-black/80 to-transparent z-40 pointer-events-none">
                                <h3 className="text-2xl font-bold text-white mb-1 uppercase font-[Rajdhani] tracking-tight">{selectedVideo.title}</h3>
                                <div className="flex items-center gap-4 text-slate-300 text-sm">
                                    <span className="flex items-center gap-1.5"><Users size={14} className="text-red-500" /> {selectedVideo.batchName}</span>
                                    <span className="flex items-center gap-1.5"><Clock size={14} className="text-red-400" /> {selectedVideo.duration}</span>
                                    <span className="flex items-center gap-1.5"><Calendar size={14} className="text-red-400" /> {selectedVideo.date}</span>
                                </div>
                            </div>

                            {/* Video Element */}
                            <video
                                src={selectedVideo.url || selectedVideo.videoUrl || "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"}
                                className="w-full h-full object-contain"
                                controls
                                autoPlay
                                playsInline
                            />

                            {/* Bottom Controls Legend */}
                            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent z-40 opacity-0 hover:opacity-100 transition-opacity">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Bytecode Archive Player v1.0 • {selectedVideo.mentorName}</p>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </AdvancedModuleLayout>
    );
}
