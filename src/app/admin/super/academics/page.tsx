"use client";

import { useState, useEffect, useMemo } from 'react';
import AdvancedModuleLayout from '@/components/dashboard/AdvancedModuleLayout';
import Toast from '@/components/ui/Toast';
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
    X,
    Save,
    Trash2,
    RefreshCw,
    FolderPlus,
    Upload,
    Link as LinkIcon,
    Lock,
    Unlock,
    Shield
} from 'lucide-react';
import api from '@/lib/api';

// Toast is now managed via state and the Toast component

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
    permissions?: {
        studentIds: string[];
        trainerIds: string[];
        isPublic: boolean;
    };
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

interface Student {
    id: string;
    fullName: string;
    email: string;
}

interface Trainer {
    id: string;
    fullName: string;
    specialization?: string;
}

export default function AcademicsPage() {
    const [activeTab, setActiveTab] = useState('overview');
    const [loading, setLoading] = useState(true);

    // State for data
    const [batches, setBatches] = useState<Batch[]>([]);
    const [sessions, setSessions] = useState<LiveSession[]>([]);
    const [assignments, setAssignments] = useState<Assignment[]>([]);
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [students, setStudents] = useState<Student[]>([]);
    const [trainers, setTrainers] = useState<Trainer[]>([]);
    const [archivedRecordings, setArchivedRecordings] = useState<any[]>([]);
    const [showVideoModal, setShowVideoModal] = useState(false);
    const [selectedVideo, setSelectedVideo] = useState<any>(null);

    // Modal States
    const [showBatchModal, setShowBatchModal] = useState(false);
    const [showSessionModal, setShowSessionModal] = useState(false);
    const [showSessionPermissionModal, setShowSessionPermissionModal] = useState(false);
    const [selectedSessionForPermission, setSelectedSessionForPermission] = useState<LiveSession | null>(null);

    // Form States
    const [batchForm, setBatchForm] = useState<Partial<Batch>>({});
    const [sessionForm, setSessionForm] = useState<Partial<LiveSession>>({
        permissions: { studentIds: [], trainerIds: [], isPublic: true }
    });
    const [assignmentForm, setAssignmentForm] = useState<Partial<Assignment>>({});
    const [showAssignmentModal, setShowAssignmentModal] = useState(false);
    const [toastStatus, setToastStatus] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);
    const [deleteConfirmation, setDeleteConfirmation] = useState<{ id: string; type: string; title: string; onConfirm: () => void } | null>(null);

    const toast = {
        success: (msg: string) => {
            setToastStatus({ type: 'success', msg });
            setTimeout(() => setToastStatus(null), 3000);
        },
        error: (msg: string) => {
            setToastStatus({ type: 'error', msg });
            setTimeout(() => setToastStatus(null), 3000);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [batchesRes, sessionsRes, assignmentsRes, announcementsRes, studentsRes, trainersRes] = await Promise.all([
                api.get('/academic/batches'),
                api.get('/academic/sessions'),
                api.get('/academic/assignments'),
                api.get('/academic/announcements'),
                api.get('users?role=STUDENT'),
                api.get('users?role=TRAINER')
            ]);

            setBatches(batchesRes.data);
            setSessions(sessionsRes.data);
            setAssignments(assignmentsRes.data);
            setAnnouncements(announcementsRes.data);
            setStudents(studentsRes.data);
            setTrainers(trainersRes.data);

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
            toast.error("Failed to load academic data");
        }
    };

    // ========== BATCH HANDLERS ==========
    const handleUpdateSessionPermission = async (sessionId: string, permissions: any) => {
        if (!selectedSessionForPermission) return;
        try {
            const updatedSession = { ...selectedSessionForPermission, permissions };
            await api.put(`academic/sessions/${sessionId}`, updatedSession);
            // Optimistically update local state so the modal reflects changes immediately
            setSelectedSessionForPermission(updatedSession);
            setSessions(prev => prev.map(s => s.id === sessionId ? updatedSession : s));
            toast.success('Session permissions updated!');
        } catch (error) {
            console.error('Failed to update session permissions:', error);
            toast.error('Failed to update permissions.');
        }
    };

    const handleCreateBatch = async () => {
        try {
            if (!batchForm.batchName || !batchForm.batchCode) {
                toast.error("Batch Name and Code are required");
                return;
            }
            const res = await api.post('/academic/batches', batchForm);
            setBatches([...batches, res.data]);
            setShowBatchModal(false);
            setBatchForm({});
            toast.success("Batch created successfully");
        } catch (error) {
            console.error("Failed to create batch:", error);
            toast.error("Failed to create batch");
        }
    };

    const handleUpdateBatch = async () => {
        try {
            const res = await api.put(`/academic/batches/${batchForm.id}`, batchForm);
            setBatches(batches.map(b => b.id === batchForm.id ? res.data : b));
            setShowBatchModal(false);
            setBatchForm({});
            toast.success("Batch updated successfully");
        } catch (error) {
            console.error("Failed to update batch:", error);
            toast.error("Failed to update batch");
        }
    };

    const handleDeleteBatch = async (id: string) => {
        setDeleteConfirmation({
            id,
            type: 'batch',
            title: 'Delete Batch?',
            onConfirm: async () => {
                try {
                    await api.delete(`/academic/batches/${id}`);
                    setBatches(batches.filter(b => b.id !== id));
                    toast.success("Batch deleted");
                } catch (error) {
                    console.error("Failed to delete batch:", error);
                    toast.error("Failed to delete batch");
                }
            }
        });
    };

    // ========== SESSION HANDLERS ==========
    const handleSaveSession = async () => {
        try {
            if (!sessionForm.title || !sessionForm.startTime) {
                toast.error("Session Title and Start Time are required");
                return;
            }

            let res: any;
            if (sessionForm.id) {
                res = await api.put(`/academic/sessions/${sessionForm.id}`, sessionForm);
                setSessions(sessions.map(s => s.id === sessionForm.id ? res.data : s));
            } else {
                res = await api.post('/academic/sessions', sessionForm);
                setSessions([...sessions, res.data]);
            }

            setShowSessionModal(false);
            setSessionForm({});
            toast.success(sessionForm.id ? "Session updated" : "Session scheduled");
        } catch (error) {
            console.error("Failed to save session:", error);
            toast.error("Failed to save session");
        }
    };

    const handleDeleteSession = async (id: string) => {
        setDeleteConfirmation({
            id,
            type: 'session',
            title: 'Delete Session?',
            onConfirm: async () => {
                try {
                    await api.delete(`/academic/sessions/${id}`);
                    setSessions(sessions.filter(s => s.id !== id));
                    toast.success("Session deleted");
                } catch (error) {
                    console.error("Failed to delete session:", error);
                    toast.error("Failed to delete session");
                }
            }
        });
    };

    // ========== ASSIGNMENT HANDLERS ==========
    const handleSaveAssignment = async () => {
        try {
            if (!assignmentForm.title || !assignmentForm.batchName) {
                toast.error("Title and Batch are required");
                return;
            }

            let res: any;
            if (assignmentForm.id) {
                res = await api.put(`/academic/assignments/${assignmentForm.id}`, assignmentForm);
                setAssignments(assignments.map(a => a.id === assignmentForm.id ? res.data : a));
            } else {
                res = await api.post('/academic/assignments', {
                    ...assignmentForm,
                    assignedDate: new Date().toISOString(),
                    status: 'ACTIVE'
                });
                setAssignments([...assignments, res.data]);
            }

            setShowAssignmentModal(false);
            setAssignmentForm({});
            toast.success(assignmentForm.id ? "Assignment updated" : "Assignment created");
        } catch (error) {
            console.error("Failed to save assignment:", error);
            toast.error("Failed to save assignment");
        }
    };

    const handleDeleteAssignment = async (id: string) => {
        setDeleteConfirmation({
            id,
            type: 'assignment',
            title: 'Delete Assignment?',
            onConfirm: async () => {
                try {
                    await api.delete(`/academic/assignments/${id}`);
                    setAssignments(assignments.filter(a => a.id !== id));
                    toast.success("Assignment deleted");
                } catch (error) {
                    console.error("Failed to delete assignment:", error);
                    toast.error("Failed to delete assignment");
                }
            }
        });
    };

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

    // Generate a meeting link based on platform
    const generateMeetingLink = (platform: string) => {
        const id = Math.random().toString(36).substring(2, 10);
        switch (platform) {
            case 'ZOOM': return `https://zoom.us/j/${id}`;
            case 'MEET': return `https://meet.google.com/${id}`;
            default: return `https://live.bytecode.in/room/${id}`;
        }
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
                actions={<div />}
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
            actions={<div />}
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
                        <button
                            onClick={() => { setBatchForm({ status: 'ONGOING', mode: 'ONLINE', branch: 'Hyderabad' }); setShowBatchModal(true); }}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-colors"
                        >
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
                                <div className="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                                    <button
                                        onClick={() => { setBatchForm(batch); setShowBatchModal(true); }}
                                        className="p-2 hover:bg-white/10 rounded-lg text-white"
                                    >
                                        <Settings size={16} />
                                    </button>
                                    <button
                                        onClick={() => handleDeleteBatch(batch.id)}
                                        className="p-2 hover:bg-red-500/20 rounded-lg text-red-400"
                                    >
                                        <Trash2 size={16} />
                                    </button>
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
                        <button
                            onClick={() => { setSessionForm({ platform: 'BYTECODE_LIVE', status: 'UPCOMING', duration: 60 }); setShowSessionModal(true); }}
                            className="bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-colors"
                        >
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
                                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => { setSessionForm(session); setShowSessionModal(true); }}
                                            className="p-1.5 hover:bg-white/10 rounded text-white"
                                            title="Edit Session"
                                        >
                                            <Settings size={14} />
                                        </button>
                                        <button
                                            onClick={() => {
                                                setSelectedSessionForPermission(session);
                                                setShowSessionPermissionModal(true);
                                            }}
                                            className="p-1.5 hover:bg-violet-500/20 rounded text-violet-400"
                                            title="Manage Permissions"
                                        >
                                            <Lock size={14} />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteSession(session.id)}
                                            className="p-1.5 hover:bg-red-500/20 rounded text-red-500"
                                            title="Delete Session"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
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
                                {session.meetingLink && (
                                    <a
                                        href={session.meetingLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="mt-4 w-full flex items-center justify-center gap-2 py-2.5 bg-violet-600/10 hover:bg-violet-600 text-violet-400 hover:text-white rounded-xl text-xs font-bold transition-all border border-violet-500/20"
                                    >
                                        <LinkIcon size={14} /> Join Room
                                    </a>
                                )}
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
                        <h2 className="text-2xl font-bold text-white uppercase tracking-tight font-[Rajdhani]">Course Assignments</h2>
                        <button
                            onClick={() => { setAssignmentForm({ difficulty: 'MEDIUM', status: 'ACTIVE', totalMarks: 100 }); setShowAssignmentModal(true); }}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-colors uppercase tracking-widest text-[10px]"
                        >
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
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => { setAssignmentForm(assignment); setShowAssignmentModal(true); }}
                                                className="p-2 hover:bg-white/10 rounded-lg text-white"
                                            >
                                                <Settings size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteAssignment(assignment.id)}
                                                className="p-2 hover:bg-red-500/20 rounded-lg text-red-500"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
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
            )
            }
            {
                activeTab === 'recordings' && (
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
                )
            }

            {/* Batch Modal */}
            <AnimatePresence>
                {showBatchModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                        onClick={() => setShowBatchModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.95, y: 20 }}
                            className="bg-slate-900 border border-white/10 rounded-2xl p-6 w-full max-w-2xl max-h-[85vh] overflow-y-auto"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-bold text-white uppercase tracking-tight font-[Rajdhani]">
                                    {batchForm.id ? 'Edit Batch Archive' : 'Configure New Batch'}
                                </h3>
                                <button onClick={() => setShowBatchModal(false)} className="text-slate-400 hover:text-white transition-colors">
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="md:col-span-2">
                                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Batch Identification Name</label>
                                    <input
                                        type="text"
                                        value={batchForm.batchName || ''}
                                        onChange={(e) => setBatchForm({ ...batchForm, batchName: e.target.value })}
                                        className="w-full bg-slate-800/50 border border-white/5 rounded-xl px-4 py-3 text-white focus:border-blue-500 focus:outline-none transition-all font-bold"
                                        placeholder="e.g., Full Stack Java Production - B24"
                                    />
                                </div>

                                <div>
                                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Batch Code / UID</label>
                                    <input
                                        type="text"
                                        value={batchForm.batchCode || ''}
                                        onChange={(e) => setBatchForm({ ...batchForm, batchCode: e.target.value })}
                                        className="w-full bg-slate-800/50 border border-white/5 rounded-xl px-4 py-3 text-white focus:border-blue-500 focus:outline-none transition-all font-bold"
                                        placeholder="e.g., FSJ-2024-V1"
                                    />
                                </div>

                                <div>
                                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Primary Course</label>
                                    <input
                                        type="text"
                                        value={batchForm.courseName || ''}
                                        onChange={(e) => setBatchForm({ ...batchForm, courseName: e.target.value })}
                                        className="w-full bg-slate-800/50 border border-white/5 rounded-xl px-4 py-3 text-white focus:border-blue-500 focus:outline-none transition-all font-bold"
                                        placeholder="Course Name"
                                    />
                                </div>

                                <div>
                                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">
                                        Lead Instructor / Trainer
                                    </label>
                                    <select
                                        value={batchForm.trainerId || ''}
                                        onChange={(e) => {
                                            const selected = trainers.find(t => t.id === e.target.value);
                                            setBatchForm({
                                                ...batchForm,
                                                trainerId: selected?.id || '',
                                                trainerName: selected?.fullName || '',
                                            });
                                        }}
                                        className="w-full bg-slate-800/50 border border-white/5 rounded-xl px-4 py-3 text-white focus:border-blue-500 focus:outline-none transition-all font-bold appearance-none"
                                    >
                                        <option value="">— Select Trainer —</option>
                                        {trainers.map(t => (
                                            <option key={t.id} value={t.id}>
                                                {t.fullName}{t.specialization ? ` · ${t.specialization}` : ''}
                                            </option>
                                        ))}
                                    </select>
                                    {batchForm.trainerName && (
                                        <p className="mt-1.5 text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                                            ✓ {batchForm.trainerName} assigned
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Operation Status</label>
                                    <select
                                        value={batchForm.status || 'ONGOING'}
                                        onChange={(e) => setBatchForm({ ...batchForm, status: e.target.value })}
                                        className="w-full bg-slate-800/50 border border-white/5 rounded-xl px-4 py-3 text-white focus:border-blue-500 focus:outline-none transition-all font-bold appearance-none"
                                    >
                                        <option value="UPCOMING">Upcoming / Pre-production</option>
                                        <option value="ONGOING">Ongoing / Active</option>
                                        <option value="COMPLETED">Completed / Archived</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Activation Date</label>
                                    <input
                                        type="date"
                                        value={batchForm.startDate ? new Date(batchForm.startDate).toISOString().split('T')[0] : ''}
                                        onChange={(e) => setBatchForm({ ...batchForm, startDate: e.target.value })}
                                        className="w-full bg-slate-800/50 border border-white/5 rounded-xl px-4 py-3 text-white focus:border-blue-500 focus:outline-none transition-all font-bold"
                                    />
                                </div>

                                <div>
                                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Termination Date</label>
                                    <input
                                        type="date"
                                        value={batchForm.endDate ? new Date(batchForm.endDate).toISOString().split('T')[0] : ''}
                                        onChange={(e) => setBatchForm({ ...batchForm, endDate: e.target.value })}
                                        className="w-full bg-slate-800/50 border border-white/5 rounded-xl px-4 py-3 text-white focus:border-blue-500 focus:outline-none transition-all font-bold"
                                    />
                                </div>

                                <div>
                                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Execution Mode</label>
                                    <select
                                        value={batchForm.mode || 'ONLINE'}
                                        onChange={(e) => setBatchForm({ ...batchForm, mode: e.target.value })}
                                        className="w-full bg-slate-800/50 border border-white/5 rounded-xl px-4 py-3 text-white focus:border-blue-500 focus:outline-none transition-all font-bold"
                                    >
                                        <option value="ONLINE">Virtual / Online</option>
                                        <option value="OFFLINE">Physical / Offline</option>
                                        <option value="HYBRID">Hybrid Integration</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Batch Schedule</label>
                                    <input
                                        type="text"
                                        value={batchForm.schedule || ''}
                                        onChange={(e) => setBatchForm({ ...batchForm, schedule: e.target.value })}
                                        className="w-full bg-slate-800/50 border border-white/5 rounded-xl px-4 py-3 text-white focus:border-blue-500 focus:outline-none transition-all font-bold"
                                        placeholder="e.g., Mon-Fri 10AM - 1PM"
                                    />
                                </div>
                            </div>

                            <div className="flex gap-4 mt-8">
                                <button
                                    onClick={() => setShowBatchModal(false)}
                                    className="flex-1 bg-white/5 hover:bg-white/10 text-white px-6 py-4 rounded-xl font-bold transition-all uppercase tracking-widest text-[10px]"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={batchForm.id ? handleUpdateBatch : handleCreateBatch}
                                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-6 py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-500/20 uppercase tracking-widest text-[10px]"
                                >
                                    <Save size={16} /> {batchForm.id ? 'Save Changes' : 'Initialize Batch'}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Session Modal */}
            <AnimatePresence>
                {showSessionModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                        onClick={() => setShowSessionModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.95, y: 20 }}
                            className="bg-slate-900 border border-white/10 rounded-2xl p-8 w-full max-w-2xl"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-2xl font-bold text-white uppercase tracking-tight font-[Rajdhani]">
                                    {sessionForm.id ? 'Edit Live Session' : 'Schedule New Live Room'}
                                </h3>
                                <button onClick={() => setShowSessionModal(false)} className="text-slate-400 hover:text-white transition-colors">
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Session Topic / Title</label>
                                    <input
                                        type="text"
                                        value={sessionForm.title || ''}
                                        onChange={(e) => setSessionForm({ ...sessionForm, title: e.target.value })}
                                        className="w-full bg-slate-800/50 border border-white/5 rounded-xl px-4 py-4 text-white focus:border-violet-500 focus:outline-none transition-all font-bold"
                                        placeholder="e.g., Deep Dive into React Hooks & Context"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Commencement Time</label>
                                        <input
                                            type="datetime-local"
                                            value={sessionForm.startTime ? new Date(sessionForm.startTime).toISOString().slice(0, 16) : ''}
                                            onChange={(e) => setSessionForm({ ...sessionForm, startTime: e.target.value })}
                                            className="w-full bg-slate-800/50 border border-white/5 rounded-xl px-4 py-4 text-white focus:border-violet-500 focus:outline-none transition-all font-bold"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Duration (Minutes)</label>
                                        <input
                                            type="number"
                                            value={sessionForm.duration || ''}
                                            onChange={(e) => setSessionForm({ ...sessionForm, duration: parseInt(e.target.value) })}
                                            className="w-full bg-slate-800/50 border border-white/5 rounded-xl px-4 py-4 text-white focus:border-violet-500 focus:outline-none transition-all font-bold"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Target Batch</label>
                                        <select
                                            value={sessionForm.batchName || ''}
                                            onChange={(e) => {
                                                const batch = batches.find(b => b.batchName === e.target.value);
                                                setSessionForm({
                                                    ...sessionForm,
                                                    batchName: e.target.value,
                                                    courseName: batch?.courseName
                                                });
                                            }}
                                            className="w-full bg-slate-800/50 border border-white/5 rounded-xl px-4 py-4 text-white focus:border-violet-500 focus:outline-none transition-all font-bold appearance-none"
                                        >
                                            <option value="">Select Target Batch</option>
                                            {batches.map(b => (
                                                <option key={b.id} value={b.batchName}>{b.batchName}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Live Room Platform</label>
                                        <div className="flex gap-2">
                                            <select
                                                value={sessionForm.platform || 'BYTECODE_LIVE'}
                                                onChange={(e) => {
                                                    const platform = e.target.value;
                                                    setSessionForm({
                                                        ...sessionForm,
                                                        platform,
                                                        meetingLink: generateMeetingLink(platform)
                                                    });
                                                }}
                                                className="flex-1 bg-slate-800/50 border border-white/5 rounded-xl px-4 py-4 text-white focus:border-violet-500 focus:outline-none transition-all font-bold appearance-none"
                                            >
                                                <option value="BYTECODE_LIVE">Bytecode Live (Internal)</option>
                                                <option value="ZOOM">Zoom Integration</option>
                                                <option value="MEET">Google Meet</option>
                                            </select>
                                            <button
                                                onClick={() => setSessionForm({ ...sessionForm, meetingLink: generateMeetingLink(sessionForm.platform || 'BYTECODE_LIVE') })}
                                                className="p-4 bg-white/5 hover:bg-white/10 rounded-xl text-violet-400 border border-white/5 transition-all"
                                                title="Refresh Meeting Link"
                                            >
                                                <RefreshCw size={20} />
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Active Meeting URL</label>
                                    <div className="relative">
                                        <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
                                        <input
                                            type="text"
                                            value={sessionForm.meetingLink || ''}
                                            onChange={(e) => setSessionForm({ ...sessionForm, meetingLink: e.target.value })}
                                            className="w-full bg-slate-800/50 border border-white/5 rounded-xl py-4 pl-12 pr-4 text-white focus:border-violet-500 focus:outline-none transition-all font-bold"
                                            placeholder="https://..."
                                        />
                                    </div>
                                </div>

                                <div className="p-5 bg-white/5 rounded-2xl border border-white/5 space-y-4">
                                    <div className="flex items-center justify-between">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Join Access Control</label>
                                        <div className="flex items-center gap-2">
                                            <span className="text-[10px] text-slate-500 font-bold uppercase transition-colors">Public Access</span>
                                            <button
                                                onClick={() => setSessionForm(prev => ({
                                                    ...prev,
                                                    permissions: { ...(prev.permissions || { studentIds: [], trainerIds: [], isPublic: true }), isPublic: !prev.permissions?.isPublic }
                                                }))}
                                                className={`w-10 h-6 rounded-full relative transition-all shadow-inner ${sessionForm.permissions?.isPublic ? 'bg-violet-600' : 'bg-slate-700'}`}
                                            >
                                                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-lg transition-all ${sessionForm.permissions?.isPublic ? 'left-5' : 'left-1'}`} />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 border-t border-white/5 pt-4">
                                        <button
                                            onClick={() => setSessionForm(prev => ({
                                                ...prev,
                                                permissions: {
                                                    ...(prev.permissions || { studentIds: [], trainerIds: [], isPublic: true }),
                                                    studentIds: prev.permissions?.studentIds?.length === 0 ? ['ALL_ENROLLED'] : []
                                                }
                                            }))}
                                            className={`flex items-center justify-center gap-2 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${sessionForm.permissions?.studentIds?.length ? 'bg-blue-600/10 border-blue-500/40 text-blue-400' : 'bg-slate-900 border-white/5 text-slate-600'}`}
                                        >
                                            <Users size={14} /> Students: {sessionForm.permissions?.studentIds?.length ? 'ON' : 'OFF'}
                                        </button>
                                        <button
                                            onClick={() => setSessionForm(prev => ({
                                                ...prev,
                                                permissions: {
                                                    ...(prev.permissions || { studentIds: [], trainerIds: [], isPublic: true }),
                                                    trainerIds: prev.permissions?.trainerIds?.length === 0 ? ['ALL_ACTIVE'] : []
                                                }
                                            }))}
                                            className={`flex items-center justify-center gap-2 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${sessionForm.permissions?.trainerIds?.length ? 'bg-emerald-600/10 border-emerald-500/40 text-emerald-400' : 'bg-slate-900 border-white/5 text-slate-600'}`}
                                        >
                                            <GraduationCap size={14} /> Tutors: {sessionForm.permissions?.trainerIds?.length ? 'ON' : 'OFF'}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-4 mt-10">
                                <button
                                    onClick={() => setShowSessionModal(false)}
                                    className="flex-1 bg-white/5 hover:bg-white/10 text-white px-6 py-5 rounded-2xl font-bold transition-all uppercase tracking-widest text-[11px]"
                                >
                                    Discard
                                </button>
                                <button
                                    onClick={handleSaveSession}
                                    className="flex-1 bg-violet-600 hover:bg-violet-700 text-white px-6 py-5 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-violet-500/20 uppercase tracking-widest text-[11px]"
                                >
                                    <Save size={18} /> {sessionForm.id ? 'Save Changes' : 'Initialize Room'}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Assignment Modal */}
            <AnimatePresence>
                {showAssignmentModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                        onClick={() => setShowAssignmentModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.95, y: 20 }}
                            className="bg-slate-900 border border-white/10 rounded-2xl p-8 w-full max-w-2xl"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-2xl font-bold text-white uppercase tracking-tight font-[Rajdhani]">
                                    {assignmentForm.id ? 'Edit Assignment' : 'New Academic Task'}
                                </h3>
                                <button onClick={() => setShowAssignmentModal(false)} className="text-slate-400 hover:text-white transition-colors">
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Assignment Title</label>
                                    <input
                                        type="text"
                                        value={assignmentForm.title || ''}
                                        onChange={(e) => setAssignmentForm({ ...assignmentForm, title: e.target.value })}
                                        className="w-full bg-slate-800/50 border border-white/5 rounded-xl px-4 py-4 text-white focus:border-blue-500 focus:outline-none transition-all font-bold"
                                        placeholder="e.g., Final Project: E-commerce Backend"
                                    />
                                </div>

                                <div>
                                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Detailed Description & Instructions</label>
                                    <textarea
                                        value={assignmentForm.description || ''}
                                        onChange={(e) => setAssignmentForm({ ...assignmentForm, description: e.target.value })}
                                        className="w-full bg-slate-800/50 border border-white/5 rounded-xl px-4 py-4 text-white focus:border-blue-500 focus:outline-none transition-all font-bold min-h-[120px]"
                                        placeholder="Outline the task requirements..."
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Target Batch</label>
                                        <select
                                            value={assignmentForm.batchName || ''}
                                            onChange={(e) => {
                                                const batch = batches.find(b => b.batchName === e.target.value);
                                                setAssignmentForm({
                                                    ...assignmentForm,
                                                    batchName: e.target.value,
                                                    courseName: batch?.courseName,
                                                    trainerName: batch?.trainerName
                                                });
                                            }}
                                            className="w-full bg-slate-800/50 border border-white/5 rounded-xl px-4 py-4 text-white focus:border-blue-500 focus:outline-none transition-all font-bold appearance-none"
                                        >
                                            <option value="">Select Batch</option>
                                            {batches.map(b => (
                                                <option key={b.id} value={b.batchName}>{b.batchName}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Submission Deadline</label>
                                        <input
                                            type="date"
                                            value={assignmentForm.dueDate ? new Date(assignmentForm.dueDate).toISOString().split('T')[0] : ''}
                                            onChange={(e) => setAssignmentForm({ ...assignmentForm, dueDate: e.target.value })}
                                            className="w-full bg-slate-800/50 border border-white/5 rounded-xl px-4 py-4 text-white focus:border-blue-500 focus:outline-none transition-all font-bold"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-3 gap-6">
                                    <div>
                                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Total marks</label>
                                        <input
                                            type="number"
                                            value={assignmentForm.totalMarks || ''}
                                            onChange={(e) => setAssignmentForm({ ...assignmentForm, totalMarks: parseInt(e.target.value) })}
                                            className="w-full bg-slate-800/50 border border-white/5 rounded-xl px-4 py-4 text-white focus:border-blue-500 focus:outline-none transition-all font-bold"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Complexity</label>
                                        <select
                                            value={assignmentForm.difficulty || 'MEDIUM'}
                                            onChange={(e) => setAssignmentForm({ ...assignmentForm, difficulty: e.target.value })}
                                            className="w-full bg-slate-800/50 border border-white/5 rounded-xl px-4 py-4 text-white focus:border-blue-500 focus:outline-none transition-all font-bold appearance-none"
                                        >
                                            <option value="EASY">Easy / Fundamental</option>
                                            <option value="MEDIUM">Medium / Intermediate</option>
                                            <option value="HARD">Hard / Advanced</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Release Status</label>
                                        <select
                                            value={assignmentForm.status || 'ACTIVE'}
                                            onChange={(e) => setAssignmentForm({ ...assignmentForm, status: e.target.value })}
                                            className="w-full bg-slate-800/50 border border-white/5 rounded-xl px-4 py-4 text-white focus:border-blue-500 focus:outline-none transition-all font-bold appearance-none"
                                        >
                                            <option value="ACTIVE">Active / Published</option>
                                            <option value="DRAFT">Draft / Hidden</option>
                                            <option value="CLOSED">Closed / Archived</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-4 mt-10">
                                <button
                                    onClick={() => setShowAssignmentModal(false)}
                                    className="flex-1 bg-white/5 hover:bg-white/10 text-white px-6 py-5 rounded-2xl font-bold transition-all uppercase tracking-widest text-[11px]"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSaveAssignment}
                                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-6 py-5 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-500/20 uppercase tracking-widest text-[11px]"
                                >
                                    <Save size={18} /> {assignmentForm.id ? 'Save Assignment' : 'Deploy Task'}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

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

                            {/* Video Container */}
                            <div className="w-full h-full flex items-center justify-center bg-black">
                                {selectedVideo.url?.includes('youtube.com') || selectedVideo.url?.includes('youtu.be') ? (
                                    <iframe
                                        src={`https://www.youtube.com/embed/${selectedVideo.url.includes('v=') ? selectedVideo.url.split('v=')[1]?.split('&')[0] : selectedVideo.url.split('/').pop()}?autoplay=1`}
                                        className="w-full h-full border-none"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                    />
                                ) : (
                                    <video
                                        key={selectedVideo.id || selectedVideo.url || selectedVideo.videoUrl || selectedVideo.fileId || 'fallback-key'}
                                        src={
                                            selectedVideo.url && selectedVideo.url.startsWith('http') ? selectedVideo.url :
                                                selectedVideo.videoUrl && selectedVideo.videoUrl.startsWith('http') ? selectedVideo.videoUrl :
                                                    selectedVideo.fileId ? `http://localhost:8080/api/uploads/videos/${selectedVideo.fileId}` :
                                                        selectedVideo.url || selectedVideo.videoUrl || undefined
                                        }
                                        className="w-full h-full object-contain"
                                        controls
                                        autoPlay
                                        playsInline
                                        onError={(e) => {
                                            const video = e.currentTarget;
                                            if (!video.src || video.src.includes('undefined') || video.src === window.location.href) return;
                                            console.error("Video failed to load:", video.src);
                                            // Fallback to a sample video if it's a demo
                                            if (!video.src.includes('mov_bbb.mp4') && !video.src.includes('BigBuckBunny')) {
                                                video.src = 'https://www.w3schools.com/html/mov_bbb.mp4';
                                            }
                                        }}
                                    />
                                )}
                            </div>

                            {/* Bottom Controls Legend */}
                            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent z-40 opacity-0 hover:opacity-100 transition-opacity">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Bytecode Archive Player v1.0 • {selectedVideo.mentorName}</p>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
            {/* Session Permission Modal */}
            <AnimatePresence>
                {showSessionPermissionModal && selectedSessionForPermission && (
                    <div className="fixed inset-0 z-[400] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-[#0f172a] border border-white/10 rounded-[32px] p-8 max-w-2xl w-full shadow-2xl relative overflow-hidden"
                        >
                            <div className="flex justify-between items-center mb-8">
                                <div>
                                    <h3 className="text-2xl font-bold text-white font-[Rajdhani] uppercase tracking-tight">Session Access Control</h3>
                                    <p className="text-slate-400 text-sm">{selectedSessionForPermission.title} • {selectedSessionForPermission.batchName}</p>
                                </div>
                                <button onClick={() => setShowSessionPermissionModal(false)} className="p-2 hover:bg-white/10 rounded-full text-slate-400 hover:text-white transition-all">
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="space-y-6">
                                {/* Global Toggles */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-4 bg-white/5 rounded-2xl border border-white/5 flex items-center justify-between">
                                        <div>
                                            <div className="text-xs font-black text-slate-500 uppercase tracking-widest mb-1">Public Access</div>
                                            <div className="text-white font-bold">{selectedSessionForPermission.permissions?.isPublic ? 'ENABLED' : 'RESTRICTED'}</div>
                                        </div>
                                        <button
                                            onClick={() => {
                                                const p = selectedSessionForPermission.permissions || { studentIds: [], trainerIds: [], isPublic: true };
                                                handleUpdateSessionPermission(selectedSessionForPermission.id, { ...p, isPublic: !p.isPublic });
                                            }}
                                            className={`w-12 h-6 rounded-full relative transition-colors ${selectedSessionForPermission.permissions?.isPublic ? 'bg-violet-600' : 'bg-slate-700'}`}
                                        >
                                            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${selectedSessionForPermission.permissions?.isPublic ? 'left-7' : 'left-1'}`} />
                                        </button>
                                    </div>
                                    <div className="p-4 bg-white/5 rounded-2xl border border-white/5 flex items-center justify-between">
                                        <div>
                                            <div className="text-xs font-black text-slate-500 uppercase tracking-widest mb-1">Auto-Grant Enrolled</div>
                                            <div className="text-white font-bold">{selectedSessionForPermission.permissions?.studentIds?.includes('ALL_ENROLLED') ? 'ON' : 'OFF'}</div>
                                        </div>
                                        <button
                                            onClick={() => {
                                                const p = selectedSessionForPermission.permissions || { studentIds: [], trainerIds: [], isPublic: true };
                                                let newIds = [...(p.studentIds || [])];
                                                if (newIds.includes('ALL_ENROLLED')) newIds = newIds.filter(id => id !== 'ALL_ENROLLED');
                                                else newIds.push('ALL_ENROLLED');
                                                handleUpdateSessionPermission(selectedSessionForPermission.id, { ...p, studentIds: newIds });
                                            }}
                                            className={`w-12 h-6 rounded-full relative transition-colors ${selectedSessionForPermission.permissions?.studentIds?.includes('ALL_ENROLLED') ? 'bg-blue-600' : 'bg-slate-700'}`}
                                        >
                                            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${selectedSessionForPermission.permissions?.studentIds?.includes('ALL_ENROLLED') ? 'left-7' : 'left-1'}`} />
                                        </button>
                                    </div>
                                </div>

                                {/* Granular Access */}
                                <div className="grid grid-cols-2 gap-6 h-[400px]">
                                    {/* Students List */}
                                    <div className="flex flex-col">
                                        <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                                            <Users size={12} className="text-blue-400" /> Batch Students
                                        </h4>
                                        <div className="flex-1 overflow-y-auto pr-2 space-y-2 custom-scrollbar">
                                            {students.filter(s =>
                                                batches.find(b => b.batchName === selectedSessionForPermission.batchName)?.id === batches.find(b => b.batchName === selectedSessionForPermission.batchName)?.id
                                            ).map(student => {
                                                const hasAccess = selectedSessionForPermission.permissions?.studentIds?.includes(student.id) || selectedSessionForPermission.permissions?.studentIds?.includes('ALL_ENROLLED');
                                                return (
                                                    <div key={student.id} className="p-3 bg-white/5 rounded-xl border border-white/5 flex items-center justify-between group">
                                                        <div className="truncate pr-2">
                                                            <div className="text-xs font-bold text-white truncate">{student.fullName}</div>
                                                            <div className="text-[10px] text-slate-500 truncate">{student.email}</div>
                                                        </div>
                                                        <button
                                                            onClick={() => {
                                                                const p = selectedSessionForPermission.permissions || { studentIds: [], trainerIds: [], isPublic: true };
                                                                let newIds = [...(p.studentIds || [])];
                                                                if (newIds.includes(student.id)) newIds = newIds.filter(id => id !== student.id);
                                                                else newIds.push(student.id);
                                                                handleUpdateSessionPermission(selectedSessionForPermission.id, { ...p, studentIds: newIds });
                                                            }}
                                                            disabled={selectedSessionForPermission.permissions?.studentIds?.includes('ALL_ENROLLED')}
                                                            className={`p-1.5 rounded-lg transition-all ${hasAccess ? 'bg-blue-600/20 text-blue-400' : 'bg-white/5 text-slate-600 hover:text-white'} disabled:opacity-30`}
                                                        >
                                                            {hasAccess ? <Unlock size={14} /> : <Lock size={14} />}
                                                        </button>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    {/* Trainers List */}
                                    <div className="flex flex-col">
                                        <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                                            <GraduationCap size={12} className="text-emerald-400" /> Staff & Tutors
                                        </h4>
                                        <div className="flex-1 overflow-y-auto pr-2 space-y-2 custom-scrollbar">
                                            <div className="p-3 bg-white/5 rounded-xl border border-white/5 flex items-center justify-between mb-4">
                                                <div>
                                                    <div className="text-xs font-bold text-white leading-none">All Active Tutors</div>
                                                    <div className="text-[9px] text-slate-500 mt-1 uppercase">Global Staff Access</div>
                                                </div>
                                                <button
                                                    onClick={() => {
                                                        const p = selectedSessionForPermission.permissions || { studentIds: [], trainerIds: [], isPublic: true };
                                                        let newIds = [...(p.trainerIds || [])];
                                                        if (newIds.includes('ALL_ACTIVE')) newIds = newIds.filter(id => id !== 'ALL_ACTIVE');
                                                        else newIds.push('ALL_ACTIVE');
                                                        handleUpdateSessionPermission(selectedSessionForPermission.id, { ...p, trainerIds: newIds });
                                                    }}
                                                    className={`w-10 h-5 rounded-full relative transition-colors ${selectedSessionForPermission.permissions?.trainerIds?.includes('ALL_ACTIVE') ? 'bg-emerald-600' : 'bg-slate-700'}`}
                                                >
                                                    <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${selectedSessionForPermission.permissions?.trainerIds?.includes('ALL_ACTIVE') ? 'left-6' : 'left-1'}`} />
                                                </button>
                                            </div>
                                            {trainers.map(trainer => {
                                                const hasAccess = selectedSessionForPermission.permissions?.trainerIds?.includes(trainer.id) || selectedSessionForPermission.permissions?.trainerIds?.includes('ALL_ACTIVE');
                                                return (
                                                    <div key={trainer.id} className="p-3 bg-white/5 rounded-xl border border-white/5 flex items-center justify-between group">
                                                        <div className="truncate pr-2">
                                                            <div className="text-xs font-bold text-white truncate">{trainer.fullName}</div>
                                                            <div className="text-[10px] text-slate-500 truncate">{trainer.specialization || 'Academic Staff'}</div>
                                                        </div>
                                                        <button
                                                            onClick={() => {
                                                                const p = selectedSessionForPermission.permissions || { studentIds: [], trainerIds: [], isPublic: true };
                                                                let newIds = [...(p.trainerIds || [])];
                                                                if (newIds.includes(trainer.id)) newIds = newIds.filter(id => id !== trainer.id);
                                                                else newIds.push(trainer.id);
                                                                handleUpdateSessionPermission(selectedSessionForPermission.id, { ...p, trainerIds: newIds });
                                                            }}
                                                            disabled={selectedSessionForPermission.permissions?.trainerIds?.includes('ALL_ACTIVE')}
                                                            className={`p-1.5 rounded-lg transition-all ${hasAccess ? 'bg-emerald-600/20 text-emerald-400' : 'bg-white/5 text-slate-600 hover:text-white'} disabled:opacity-30`}
                                                        >
                                                            {hasAccess ? <Unlock size={14} /> : <Lock size={14} />}
                                                        </button>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {deleteConfirmation && (
                <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-[#0f172a] border border-white/10 rounded-[32px] p-8 max-w-md w-full shadow-2xl"
                    >
                        <div className="w-16 h-16 rounded-2xl bg-red-500/10 flex items-center justify-center text-red-500 mb-6 mx-auto">
                            <Trash2 size={32} />
                        </div>
                        <h3 className="text-2xl font-bold text-white text-center mb-2 font-[Rajdhani] uppercase tracking-tight">{deleteConfirmation.title}</h3>
                        <p className="text-slate-400 text-center mb-8 text-sm">This action cannot be undone. All data associated with this {deleteConfirmation.type} will be permanently removed.</p>
                        <div className="grid grid-cols-2 gap-4">
                            <button
                                onClick={() => setDeleteConfirmation(null)}
                                className="px-6 py-3 rounded-xl bg-white/5 text-white font-bold hover:bg-white/10 transition-all border border-white/5"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => {
                                    deleteConfirmation.onConfirm();
                                    setDeleteConfirmation(null);
                                }}
                                className="px-6 py-3 rounded-xl bg-red-600 text-white font-bold hover:bg-red-500 transition-all shadow-lg shadow-red-600/20"
                            >
                                Delete Now
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}

            {toastStatus && (
                <Toast
                    status={toastStatus}
                    onClose={() => setToastStatus(null)}
                />
            )}
        </AdvancedModuleLayout >
    );
}
