"use client";

import { useState, useEffect, useMemo, useRef } from 'react';
import AdvancedModuleLayout from '@/components/dashboard/AdvancedModuleLayout';
import { motion, AnimatePresence } from 'framer-motion';
import {
    PieChart, Users, Video, FileText, PlayCircle, BookOpen,
    Clock, Calendar, CheckCircle2, AlertCircle, Plus, Search,
    ChevronRight, ArrowLeft, Play, LayoutGrid, Target, Award,
    MessageSquare, Bell, Zap, TrendingUp, GraduationCap,
    Settings, MoreVertical, Save, Trash2, CalendarDays,
    Download, Upload, X, Layers, Info, ArrowRight, FolderPlus,
    Lock, Share2, FolderOpen, FileVideo, FileCode, FileType, Star
} from 'lucide-react';
import api from '@/lib/api';
import { useUserId } from '@/lib/useUserId';

// ========== INTERFACES ==========
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
    studentIds?: string[];
}

interface Course {
    id: string;
    name: string;
    description: string;
    category: string;
}

interface CourseGroup {
    courseId: string;
    courseName: string;
    description?: string;
    batches: Batch[];
}

interface LiveSession {
    id: string;
    title: string;
    batchName: string;
    mentorName: string;
    startTime: string;
    endTime: string;
    status: string;
    meetingLink: string;
}

const STATUS_COLOR: Record<string, string> = {
    ONGOING: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    ACTIVE: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    UPCOMING: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    COMPLETED: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
    HIGH: 'bg-red-500/10 text-red-400 border-red-500/20',
};

const COURSE_EMOJI: Record<string, string> = {
    'Python': '🐍', 'Java': '☕', 'Web': '🌐', 'Data': '📊',
    'Machine': '🤖', 'Cloud': '☁️', 'React': '⚛️', 'Node': '🟩',
};
function getCourseEmoji(name: string) {
    for (const [key, emoji] of Object.entries(COURSE_EMOJI)) {
        if (name?.toLowerCase().includes(key.toLowerCase())) return emoji;
    }
    return '📚';
}

export default function AdminUnifiedConsole() {
    const [activeTab, setActiveTab] = useState<string>('courses');
    const [loading, setLoading] = useState(true);
    const userId = useUserId();

    // Data states
    const [batches, setBatches] = useState<Batch[]>([]);
    const [courses, setCourses] = useState<Course[]>([]);
    const [trainers, setTrainers] = useState<any[]>([]);
    const [sessions, setSessions] = useState<LiveSession[]>([]);
    const [allStudents, setAllStudents] = useState<any[]>([]);
    const [materials, setMaterials] = useState<any[]>([]);

    // Drill-down states
    const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
    const [selectedBatch, setSelectedBatch] = useState<Batch | null>(null);
    const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Edit modal states
    const [showEditModal, setShowEditModal] = useState(false);
    const [editForm, setEditForm] = useState<Partial<Batch>>({});
    const [saving, setSaving] = useState(false);
    const [toast, setToast] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);
    const [uploading, setUploading] = useState(false);

    // Modal states
    const [showFolderModal, setShowFolderModal] = useState(false);
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [newFolderName, setNewFolderName] = useState('');
    const [hasFullAccess] = useState(true); // Admin always has access

    const showToast = (type: 'success' | 'error', msg: string) => {
        setToast({ type, msg });
        setTimeout(() => setToast(null), 3000);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [batchesRes, coursesRes, trainersRes, sessionsRes, studentsRes, materialsRes] = await Promise.all([
                    api.get('academic/batches'),
                    api.get('courses'),
                    api.get('users?role=TRAINER').catch(() => ({ data: [] })),
                    api.get('academic/sessions').catch(() => ({ data: [] })),
                    api.get('users?role=STUDENT').catch(() => ({ data: [] })),
                    api.get('academic/materials').catch(() => ({ data: [] })),
                ]);
                setBatches(batchesRes.data || []);
                setCourses(coursesRes.data || []);
                setTrainers(trainersRes.data || []);
                setSessions(sessionsRes.data || []);
                setAllStudents(studentsRes.data || []);
                setMaterials(materialsRes.data || []);
            } catch (error) {
                console.error("Failed to fetch academic data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleCreateFolder = async () => {
        if (!newFolderName || !selectedBatch) return;
        try {
            setUploading(true);
            const folderData = {
                batchId: selectedBatch.id,
                folderId: currentFolderId,
                name: newFolderName,
                type: 'FOLDER',
                uploadedBy: userId,
                permissions: { isPublic: true, accessType: 'FULL' }
            };
            const res = await api.post('academic/materials', folderData);
            setMaterials([...materials, res.data]);
            setShowFolderModal(false);
            setNewFolderName('');
            showToast('success', 'Organizational folder deployed');
        } catch (err) {
            console.error(err);
            showToast('error', 'Deployment failed');
        } finally {
            setUploading(false);
        }
    };

    const handleUploadAsset = async () => {
        if (!selectedBatch) return;
        try {
            setUploading(true);
            const assetData = {
                batchId: selectedBatch.id,
                folderId: currentFolderId,
                name: selectedFile ? selectedFile.name : ("ADMIN_RESOURCE_" + Date.now() + ".PDF"),
                type: selectedFile ? selectedFile.name.split('.').pop()?.toUpperCase() : 'PDF',
                uploadedBy: userId,
                url: "https://bytecode-cloud.storage/path/to/resource.pdf",
                permissions: { isPublic: true, accessType: 'FULL' }
            };
            const res = await api.post('academic/materials', assetData);
            setMaterials([...materials, res.data]);
            setShowUploadModal(false);
            setSelectedFile(null);
            showToast('success', 'Central asset pushed successfully');
        } catch (err) {
            console.error(err);
            showToast('error', 'Push to cloud failed');
        } finally {
            setUploading(false);
        }
    };

    const handleDeleteMaterial = async (id: string) => {
        if (!confirm('Are you sure you want to remove this resource from the institution?')) return;
        try {
            await api.delete(`/academic/materials/${id}`);
            setMaterials(materials.filter(m => m.id !== id));
            showToast('success', 'Institutional asset removed');
        } catch (err) {
            console.error(err);
            showToast('error', 'Removal failed');
        }
    };

    const courseGroups: CourseGroup[] = useMemo(() => {
        const map = new Map<string, CourseGroup>();

        // Link batches to courses
        batches.forEach(b => {
            const course = courses.find(c => c.id === b.courseId) || { id: b.courseId, name: b.courseName, description: 'Academic curriculum' };
            if (!map.has(course.id)) {
                map.set(course.id, { courseId: course.id, courseName: course.name, description: course.description, batches: [] });
            }
            map.get(course.id)!.batches.push(b);
        });

        // Add courses with no batches too (optional)
        courses.forEach(c => {
            if (!map.has(c.id)) {
                map.set(c.id, { courseId: c.id, courseName: c.name, description: c.description, batches: [] });
            }
        });

        return Array.from(map.values());
    }, [batches, courses]);

    const stats = useMemo(() => [
        { label: "Total Courses", value: courses.length.toString(), icon: Layers, color: "#8b5cf6" },
        { label: "Active Batches", value: batches.length.toString(), icon: Users, color: "#3b82f6" },
        { label: "Live Sessions", value: sessions.filter(s => s.status === 'LIVE' || s.status === 'UPCOMING').length.toString(), icon: Video, color: "#10b981" },
        { label: "Course Revenue", value: "₹0.0L", icon: Award, color: "#f59e0b", trend: "Live Tracking" },
    ], [courses, batches, sessions]);

    const selectedGroup = selectedCourseId ? courseGroups.find(g => g.courseId === selectedCourseId) : null;

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-[#050510]">
                <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <AdvancedModuleLayout
            title="Batch & Resource Manager"
            subtitle="Coordinate institutional curriculum, distribute faculty resources and monitor student success."
            stats={stats}
            activeTab={activeTab}
            onTabChange={(tab) => { setActiveTab(tab); setSelectedCourseId(null); setSelectedBatch(null); }}
            role="admin"
            tabs={[
                { id: 'courses', label: 'Courses', icon: BookOpen },
                { id: 'batches', label: 'Batches', icon: Users },
                { id: 'sessions', label: 'Sessions', icon: Video },
                { id: 'recordings', label: 'Recordings', icon: PlayCircle },
                { id: 'materials', label: 'Materials', icon: FileText },
            ]}
        >
            <AnimatePresence mode="wait">
                {activeTab === 'courses' && (
                    <motion.div key="curriculum" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">

                        {/* Breadcrumbs */}
                        {(selectedCourseId || selectedBatch) && (
                            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-500 mb-6">
                                <button onClick={() => { setSelectedCourseId(null); setSelectedBatch(null); }} className="hover:text-violet-400 transition-colors">Courses</button>
                                {selectedCourseId && <><ChevronRight size={12} /> <button onClick={() => setSelectedBatch(null)} className={`hover:text-violet-400 transition-colors ${!selectedBatch ? 'text-violet-400' : ''}`}>{courseGroups.find(g => g.courseId === selectedCourseId)?.courseName}</button></>}
                                {selectedBatch && <><ChevronRight size={12} /> <span className="text-violet-400">{selectedBatch.batchName}</span></>}
                            </div>
                        )}

                        {!selectedCourseId && !selectedBatch ? (
                            /* ── IMAGE 1: COURSE GRID ── */
                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <div className="relative w-96">
                                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                        <input type="text" placeholder="Search courses..." className="w-full bg-slate-900/50 border border-white/5 rounded-xl py-3 pl-12 pr-4 text-sm focus:border-violet-500 focus:outline-none transition-all" />
                                    </div>
                                    <button className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-lg shadow-blue-500/20">
                                        <Plus size={18} /> Add Course
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                    {courseGroups.map((group) => (
                                        <motion.div
                                            key={group.courseId}
                                            whileHover={{ y: -8 }}
                                            onClick={() => setSelectedCourseId(group.courseId)}
                                            className="group bg-[#0d0d1f] border border-white/5 rounded-[2rem] overflow-hidden cursor-pointer shadow-2xl hover:border-violet-500/30 transition-all flex flex-col"
                                        >
                                            <div className="h-48 flex items-center justify-center bg-gradient-to-br from-violet-600/5 to-blue-600/5 relative">
                                                <div className="absolute top-4 right-4 flex gap-2">
                                                    <button className="p-2 bg-slate-800/80 rounded-lg text-slate-400 hover:text-white transition-colors opacity-0 group-hover:opacity-100"><Settings size={14} /></button>
                                                    <button className="p-2 bg-red-500/10 rounded-lg text-red-500 hover:bg-red-500 hover:text-white transition-all opacity-0 group-hover:opacity-100"><Trash2 size={14} /></button>
                                                </div>
                                                <div className="w-20 h-20 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-5xl group-hover:scale-110 transition-transform duration-500">
                                                    {getCourseEmoji(group.courseName)}
                                                </div>
                                            </div>
                                            <div className="p-8 flex-1 flex flex-col">
                                                <h4 className="text-xl font-black text-white uppercase mb-3 font-[Rajdhani] group-hover:text-violet-400 transition-colors leading-tight">{group.courseName}</h4>
                                                <p className="text-sm text-slate-500 mb-8 line-clamp-2 leading-relaxed">{group.description || 'Comprehensive training program designed for advanced skill acquisition.'}</p>
                                                <div className="mt-auto flex items-center justify-between">
                                                    <div className="flex -space-x-3">
                                                        <Users size={16} className="text-slate-600" />
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <Star size={14} className="text-amber-500 fill-amber-500" />
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        ) : selectedCourseId && !selectedBatch ? (
                            /* ── IMAGE 2: BATCH SELECTION ── */
                            <div className="space-y-8">
                                <div className="flex justify-between items-end">
                                    <div>
                                        <h2 className="text-4xl font-black text-white uppercase tracking-tight font-[Rajdhani]">{selectedGroup?.courseName}</h2>
                                        <p className="text-slate-500 font-bold uppercase text-xs tracking-widest mt-2">{selectedGroup?.batches.length} Batches currently operational</p>
                                    </div>
                                    <button className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-lg shadow-blue-500/20">
                                        <Plus size={18} /> Create Batch
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                    {selectedGroup?.batches.map((batch) => (
                                        <motion.div
                                            key={batch.id}
                                            whileHover={{ y: -5 }}
                                            onClick={() => setSelectedBatch(batch)}
                                            className="bg-[#0d0d1f] border border-white/5 rounded-[2.5rem] p-8 cursor-pointer group hover:border-blue-500/30 transition-all shadow-2xl relative overflow-hidden"
                                        >
                                            <div className="flex justify-between items-start mb-8">
                                                <div className="w-16 h-16 rounded-3xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400 font-black text-2xl group-hover:scale-110 transition-transform font-[Rajdhani]">
                                                    <Users size={32} />
                                                </div>
                                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button className="p-2 text-slate-500 hover:text-white"><Settings size={14} /></button>
                                                    <button className="p-2 text-red-500/50 hover:text-red-500"><Trash2 size={14} /></button>
                                                </div>
                                                <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase border tracking-widest ${STATUS_COLOR[batch.status]}`}>{batch.status}</span>
                                            </div>

                                            <h4 className="text-2xl font-black text-white mb-2 uppercase tracking-tight font-[Rajdhani] leading-tight group-hover:text-blue-400 transition-colors">{batch.batchName}</h4>
                                            <p className="text-sm font-bold text-slate-600 uppercase mb-8 tracking-widest">{batch.trainerName}</p>

                                            <div className="mt-8 space-y-4 pt-6 border-t border-white/5">
                                                <div className="flex justify-between items-center text-[10px] font-black text-slate-500 uppercase tracking-widest">
                                                    <span>Enrollment</span>
                                                    <span className="text-white">{batch.totalStudents} / {batch.maxCapacity}</span>
                                                </div>
                                                <div className="flex justify-between items-center text-[10px] font-black text-slate-500 uppercase tracking-widest">
                                                    <span>Delivery Mode</span>
                                                    <span className="text-blue-400">{batch.mode === 'HYBRID' ? 'HYBRID' : 'ONLINE'}</span>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        ) : selectedBatch && (
                            /* ── IMAGE 3 & 4: BATCH CONTROL PANEL ── */
                            <motion.div key="batch-control" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-10 pb-20">

                                {/* Header Section */}
                                <div className="flex justify-between items-start">
                                    <div className="space-y-4">
                                        <h2 className="text-4xl font-black text-white uppercase tracking-tighter font-[Rajdhani] leading-none">{selectedBatch.batchName}</h2>
                                        <div className="flex flex-wrap items-center gap-6 text-xs font-bold text-slate-500 uppercase tracking-widest">
                                            <span className="text-blue-400">{selectedBatch.courseName}</span>
                                            <span className="flex items-center gap-2"> <Users size={14} className="text-slate-600" /> {selectedBatch.trainerName}</span>
                                            <span className="flex items-center gap-2"> <Clock size={14} className="text-slate-600" /> {selectedBatch.schedule}</span>
                                        </div>
                                    </div>
                                    <div className="flex gap-4">
                                        <button className="flex items-center gap-2 px-6 py-3 bg-blue-600/10 border border-blue-500/30 text-blue-400 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all">
                                            <Settings size={16} /> Edit Batch
                                        </button>
                                        <button className="flex items-center gap-2 px-6 py-3 bg-red-600/10 border border-red-500/30 text-red-500 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all">
                                            <Trash2 size={16} /> Delete
                                        </button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

                                    {/* Students Section (Image 3 Left) */}
                                    <div className="bg-[#0b0b1a] border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl">
                                        <div className="p-8 pb-4 flex justify-between items-center">
                                            <h3 className="text-xl font-black text-white uppercase tracking-tight flex items-center gap-3 font-[Rajdhani]">
                                                <Users className="text-blue-400" /> Students ({selectedBatch.totalStudents}/{selectedBatch.maxCapacity})
                                            </h3>
                                            <button className="px-5 py-2.5 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-blue-500/20">Assign</button>
                                        </div>
                                        <div className="p-8 pt-0 space-y-4 max-h-[400px] overflow-y-auto custom-scrollbar">
                                            {allStudents.filter(s => selectedBatch.studentIds?.includes(s.id)).length > 0 ? (
                                                allStudents.filter(s => selectedBatch.studentIds?.includes(s.id)).map(student => (
                                                    <div key={student.id} className="p-5 bg-white/5 border border-white/5 rounded-2xl flex items-center justify-between group">
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-10 h-10 rounded-xl bg-violet-600/10 flex items-center justify-center text-violet-400 font-bold group-hover:bg-violet-600 group-hover:text-white transition-all">
                                                                {student.fullName.slice(0, 1)}
                                                            </div>
                                                            <div>
                                                                <div className="font-bold text-white text-sm tracking-tight">{student.fullName}</div>
                                                                <div className="text-[10px] text-slate-500 font-bold tracking-tighter uppercase">{student.email}</div>
                                                            </div>
                                                        </div>
                                                        <button className="p-2 text-slate-700 hover:text-blue-400 transition-colors"><Zap size={14} /></button>
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="py-20 text-center font-bold text-slate-700 uppercase tracking-widest text-sm border-2 border-dashed border-white/5 rounded-3xl">No students distributed</div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Sessions Section (Image 3 Right) */}
                                    <div className="bg-[#0b0b1a] border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl">
                                        <div className="p-8 pb-4 flex justify-between items-center">
                                            <h3 className="text-xl font-black text-white uppercase tracking-tight flex items-center gap-3 font-[Rajdhani]">
                                                <Video className="text-violet-400" /> Sessions ({sessions.filter(s => s.batchName === selectedBatch.batchName).length})
                                            </h3>
                                            <button className="px-5 py-2.5 bg-violet-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-violet-500/20 flex items-center gap-2">
                                                <Plus size={14} /> Schedule
                                            </button>
                                        </div>
                                        <div className="p-8 pt-0 space-y-4 max-h-[400px] overflow-y-auto custom-scrollbar">
                                            {sessions.filter(s => s.batchName === selectedBatch.batchName).length > 0 ? (
                                                sessions.filter(s => s.batchName === selectedBatch.batchName).map(s => (
                                                    <div key={s.id} className="p-6 bg-white/5 border border-white/5 rounded-2xl group hover:border-violet-500/30 transition-all">
                                                        <div className="flex justify-between items-start mb-4">
                                                            <div>
                                                                <h4 className="font-bold text-white text-base tracking-tight mb-1">{s.title}</h4>
                                                                <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{new Date(s.startTime).toLocaleString()}</div>
                                                            </div>
                                                            <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase bg-slate-500/10 text-slate-500 border border-white/5">{s.status}</span>
                                                        </div>
                                                        <button className="w-full py-2.5 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:bg-violet-600 hover:text-white transition-all">Join Session</button>
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="py-20 text-center font-bold text-slate-700 uppercase tracking-widest text-sm border-2 border-dashed border-white/5 rounded-3xl">No rooms initialized</div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Learning Materials Section */}
                                <div className="bg-[#0b0b1a] border border-white/5 rounded-[3rem] p-10 shadow-2xl relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-600/5 blur-[100px] rounded-full -mr-32 -mt-32" />
                                    <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-8 relative z-10">
                                        <div className="flex flex-col gap-2">
                                            <h3 className="text-3xl font-black text-white uppercase tracking-tighter font-[Rajdhani] flex items-center gap-4">
                                                <FolderOpen className="text-emerald-400" size={32} /> Learning Materials
                                            </h3>
                                            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500 ml-12">
                                                <button onClick={() => setCurrentFolderId(null)} className={`hover:text-emerald-400 transition-colors ${!currentFolderId ? 'text-emerald-400' : ''}`}>Root</button>
                                                {currentFolderId && (
                                                    <>
                                                        <ChevronRight size={10} />
                                                        <span className="text-emerald-400">{materials.find(m => m.id === currentFolderId)?.name || 'Folder'}</span>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex flex-wrap justify-center gap-3">
                                            <button
                                                onClick={() => setShowFolderModal(true)}
                                                className="px-6 py-3 bg-emerald-600/10 border border-emerald-500/20 text-emerald-400 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-emerald-600 hover:text-white transition-all">
                                                <FolderPlus size={16} /> New Folder
                                            </button>
                                            <button
                                                onClick={() => setShowUploadModal(true)}
                                                className="px-6 py-3 bg-emerald-600/10 border border-emerald-500/20 text-emerald-400 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-emerald-600 hover:text-white transition-all">
                                                <Upload size={16} /> Upload
                                            </button>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
                                        {materials.filter(m => m.batchId === selectedBatch.id && (currentFolderId ? m.folderId === currentFolderId : !m.folderId)).length > 0 ? (
                                            materials.filter(m => m.batchId === selectedBatch.id && (currentFolderId ? m.folderId === currentFolderId : !m.folderId)).map((item, i) => {
                                                const isFolder = item.type === 'FOLDER';
                                                return (
                                                    <motion.div
                                                        key={item.id || i}
                                                        whileHover={{ y: -10, scale: 1.02 }}
                                                        onClick={() => isFolder && setCurrentFolderId(item.id)}
                                                        className={`relative overflow-hidden group p-8 rounded-[2.5rem] border transition-all duration-500 cursor-pointer flex flex-col items-center text-center
                                                            ${isFolder
                                                                ? 'bg-amber-500/5 border-amber-500/10 hover:border-amber-500/40 hover:shadow-[0_0_40px_rgba(245,158,11,0.2)]'
                                                                : item.type === 'VIDEO'
                                                                    ? 'bg-violet-500/5 border-violet-500/10 hover:border-violet-500/40 hover:shadow-[0_0_40px_rgba(124,58,237,0.2)]'
                                                                    : 'bg-rose-500/5 border-rose-500/10 hover:border-rose-500/40 hover:shadow-[0_0_40px_rgba(244,63,94,0.2)]'
                                                            } backdrop-blur-2xl`}
                                                    >
                                                        {/* Animated Mesh Glow */}
                                                        <div className={`absolute -top-20 -right-20 w-40 h-40 blur-[70px] rounded-full transition-all duration-700 opacity-10 group-hover:opacity-30 group-hover:scale-150
                                                            ${isFolder ? 'bg-amber-500' : item.type === 'VIDEO' ? 'bg-violet-500' : 'bg-rose-500'}`} />

                                                        {/* Main Icon with Dynamic Border */}
                                                        <div className={`w-24 h-24 rounded-3xl flex items-center justify-center mb-8 relative transition-all duration-500 group-hover:rotate-6
                                                            ${isFolder ? 'bg-amber-400/10 border-amber-400/20 shadow-[inset_0_0_15px_rgba(251,191,36,0.1)]' : item.type === 'VIDEO' ? 'bg-violet-400/10 border-violet-400/20 shadow-[inset_0_0_15px_rgba(167,139,250,0.1)]' : 'bg-rose-400/10 border-rose-400/20 shadow-[inset_0_0_15px_rgba(251,113,133,0.1)]'} border`}>
                                                            {isFolder ? <FolderOpen size={48} className="text-amber-400 filter drop-shadow-[0_4px_12px_rgba(251,191,36,0.4)]" /> : item.type === 'VIDEO' ? <FileVideo size={48} className="text-violet-400 filter drop-shadow-[0_4px_12px_rgba(167,139,250,0.4)]" /> : <FileType size={48} className="text-rose-400 filter drop-shadow-[0_4px_12px_rgba(251,113,133,0.4)]" />}

                                                            <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-slate-950 border border-white/10 rounded-full flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
                                                                <Lock size={10} className="text-emerald-500" />
                                                            </div>
                                                        </div>

                                                        {/* Metadata Section */}
                                                        <div className="relative z-10 w-full mb-8">
                                                            <h4 className="text-lg font-black text-white uppercase tracking-tight mb-2 font-[Rajdhani] line-clamp-1 group-hover:text-amber-400 transition-colors">
                                                                {item.name}
                                                            </h4>
                                                            <div className="flex items-center justify-center gap-2">
                                                                <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">{selectedBatch.batchName}</p>
                                                            </div>
                                                        </div>

                                                        {/* Modern Interactive Actions */}
                                                        <div className="flex gap-2 w-full relative z-10">
                                                            <div className="flex-1 py-3 bg-white/5 border border-white/5 rounded-xl text-[8px] font-black text-slate-400 tracking-widest uppercase flex items-center justify-center">
                                                                {item.type}
                                                            </div>
                                                            <button
                                                                onClick={(e) => { e.stopPropagation(); handleDeleteMaterial(item.id); }}
                                                                className="px-4 py-3 bg-rose-500/10 border border-white/5 rounded-xl text-rose-500 hover:bg-rose-600 hover:text-white transition-all active:scale-90"
                                                            >
                                                                <Trash2 size={14} />
                                                            </button>
                                                            <button className={`flex-1 py-3 rounded-xl text-[8px] font-black tracking-widest uppercase transition-all shadow-lg border
                                                                    ${isFolder
                                                                    ? 'bg-amber-500/10 border-amber-500/30 text-amber-400 hover:bg-amber-500 hover:text-white'
                                                                    : item.type === 'VIDEO'
                                                                        ? 'bg-violet-500/10 border-violet-500/30 text-violet-400 hover:bg-violet-500 hover:text-white'
                                                                        : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-600 hover:text-white'
                                                                }`}>
                                                                {isFolder ? 'Explore' : 'Access'}
                                                            </button>
                                                        </div>

                                                        {/* Glass Reflection Highlight */}
                                                        <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />
                                                    </motion.div>
                                                );
                                            })
                                        ) : (
                                            <div className="col-span-full py-20 text-center font-bold text-slate-700 uppercase tracking-widest text-sm border-2 border-dashed border-white/5 rounded-3xl">Institutional resource vault is empty for this batch</div>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </motion.div>
                )}

                {/* Legacy Tabs for non-drilldown access */}
                {activeTab === 'batches' && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {batches.map(b => (
                            <div key={b.id} className="p-8 bg-slate-900/50 border border-white/5 rounded-3xl hover:border-blue-500/30 transition-all group">
                                <h4 className="text-xl font-black text-white uppercase mb-1 font-[Rajdhani]">{b.batchName}</h4>
                                <p className="text-xs font-bold text-slate-500 uppercase mb-4 tracking-widest">{b.courseName}</p>
                                <div className={`inline-block px-3 py-1 rounded-full text-[9px] font-black uppercase border ${STATUS_COLOR[b.status]}`}>{b.status}</div>
                            </div>
                        ))}
                    </div>
                )}

                {activeTab === 'sessions' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {sessions.map(s => (
                            <div key={s.id} className="p-8 bg-slate-900/50 border border-white/5 rounded-3xl flex items-center justify-between group">
                                <div className="flex items-center gap-6">
                                    <div className="p-4 rounded-2xl bg-violet-600/10 text-violet-400 border border-violet-500/20 group-hover:bg-violet-600 group-hover:text-white transition-all"><Video size={28} /></div>
                                    <div>
                                        <h4 className="text-lg font-black text-white uppercase tracking-tight font-[Rajdhani]">{s.title}</h4>
                                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">{s.batchName}</p>
                                    </div>
                                </div>
                                <span className="px-3 py-1 bg-white/5 rounded-full text-[9px] font-black text-slate-400 uppercase tracking-widest border border-white/10">{s.status}</span>
                            </div>
                        ))}
                    </div>
                )}

            </AnimatePresence>

            {/* Admin Asset Modals */}
            <AnimatePresence>
                {showFolderModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowFolderModal(false)} className="absolute inset-0 bg-black/80 backdrop-blur-xl" />
                        <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} className="relative w-full max-w-md bg-[#0d0d1f] border border-white/10 rounded-[2.5rem] p-10 overflow-hidden shadow-2xl">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-3xl rounded-full -mr-16 -mt-16" />
                            <h3 className="text-2xl font-black text-white uppercase tracking-tight font-[Rajdhani] mb-6 flex items-center gap-3">
                                <FolderPlus className="text-emerald-400" /> Organizational Folder
                            </h3>
                            <div className="space-y-6">
                                <div>
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">System Label</label>
                                    <input
                                        type="text"
                                        value={newFolderName}
                                        onChange={(e) => setNewFolderName(e.target.value)}
                                        placeholder="e.g. Advanced Python 2026..."
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm text-white focus:border-emerald-500 outline-none transition-all"
                                    />
                                </div>
                                <div className="flex gap-4">
                                    <button onClick={() => setShowFolderModal(false)} className="flex-1 py-4 bg-white/5 border border-white/10 text-white font-black rounded-2xl text-[10px] uppercase tracking-[0.2em] transition-all">Cancel</button>
                                    <button
                                        disabled={uploading}
                                        onClick={handleCreateFolder}
                                        className="flex-1 py-4 bg-emerald-600 text-white font-black rounded-2xl text-[10px] uppercase tracking-[0.2em] shadow-lg shadow-emerald-500/20 active:scale-95 transition-all disabled:opacity-50">
                                        {uploading ? 'Deploying...' : 'Deploy'}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}

                {showUploadModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowUploadModal(false)} className="absolute inset-0 bg-black/80 backdrop-blur-xl" />
                        <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} className="relative w-full max-w-md bg-[#0d0d1f] border border-white/10 rounded-[2.5rem] p-10 overflow-hidden shadow-2xl text-center">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-3xl rounded-full -mr-16 -mt-16" />
                            <div className="w-20 h-20 bg-blue-600/10 border border-blue-500/20 rounded-[1.5rem] flex items-center justify-center text-blue-400 mx-auto mb-6">
                                <Upload size={32} className="animate-pulse" />
                            </div>
                            <h3 className="text-2xl font-black text-white uppercase tracking-tight font-[Rajdhani] mb-2">Central Asset Upload</h3>
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-8">Push global resources to batch libraries</p>

                            <div
                                onClick={() => fileInputRef.current?.click()}
                                className="border-2 border-dashed border-white/10 rounded-3xl p-10 mb-8 hover:border-blue-500/50 transition-all cursor-pointer group bg-white/5"
                            >
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    className="hidden"
                                    onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                                />
                                <Plus size={24} className="text-slate-700 mx-auto mb-4 group-hover:rotate-90 transition-transform duration-500" />
                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-1">
                                    {selectedFile ? 'Selected: ' + selectedFile.name : 'Select system files'}
                                </span>
                                {selectedFile && <span className="text-[8px] text-emerald-400 font-bold uppercase tracking-widest italic">Click again to change file</span>}
                            </div>

                            <div className="flex gap-4">
                                <button onClick={() => setShowUploadModal(false)} className="flex-1 py-4 bg-white/5 border border-white/10 text-white font-black rounded-2xl text-[10px] uppercase tracking-[0.2em] transition-all">Discard</button>
                                <button
                                    disabled={uploading}
                                    onClick={handleUploadAsset}
                                    className="flex-1 py-4 bg-blue-600 text-white font-black rounded-2xl text-[10px] uppercase tracking-[0.2em] shadow-lg shadow-blue-500/20 active:scale-95 transition-all disabled:opacity-50">
                                    {uploading ? 'Pushing...' : 'Upload Now'}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {toast && <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] px-10 py-4 rounded-[2rem] font-black text-[10px] tracking-[0.2em] uppercase bg-emerald-600 text-white shadow-2xl`}>{toast.msg}</motion.div>}
        </AdvancedModuleLayout>
    );
}
