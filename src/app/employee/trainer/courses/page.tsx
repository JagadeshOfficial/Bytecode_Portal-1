"use client";

import { useState, useEffect, useMemo, useRef } from 'react';
import AdvancedModuleLayout from '@/components/dashboard/AdvancedModuleLayout';
import { motion, AnimatePresence } from 'framer-motion';
import {
    BookOpen, Layers, Target, PlayCircle, FileText, Plus,
    Search, ChevronRight, ArrowLeft, Download, Upload,
    GraduationCap, TrendingUp, Zap, Users, Star, Activity,
    Clock, Calendar, CheckCircle2, ArrowRight, Info, Video,
    FolderPlus, Lock, Share2, FolderOpen, FileVideo, FileType,
    Settings, Trash2
} from 'lucide-react';
import api from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
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
    status: string;
    totalStudents: number;
    maxCapacity: number;
    schedule: string;
    startDate: string;
    endDate: string;
    mode: string;
    studentIds?: string[];
}

interface LearningMaterial {
    id: string;
    name: string;
    type: string;
    batchId: string;
    folderId?: string;
    batchName?: string;
    uploadedAt: string;
    url: string;
}

interface CourseGroup {
    courseId: string;
    courseName: string;
    batches: Batch[];
}

const STATUS_COLOR: Record<string, string> = {
    ONGOING: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    ACTIVE: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    UPCOMING: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    COMPLETED: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
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

export default function TrainerUnifiedConsole() {
    const [activeTab, setActiveTab] = useState<string>('catalog');
    const [loading, setLoading] = useState(true);
    const userId = useUserId();

    // Data states
    const [batches, setBatches] = useState<Batch[]>([]);
    const [materials, setMaterials] = useState<LearningMaterial[]>([]);
    const [allStudents, setAllStudents] = useState<any[]>([]);
    const [sessions, setSessions] = useState<any[]>([]);

    // Drill-down states
    const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
    const [selectedBatch, setSelectedBatch] = useState<Batch | null>(null);
    const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);

    // Modal states
    const [showFolderModal, setShowFolderModal] = useState(false);
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [newFolderName, setNewFolderName] = useState('');
    const [uploading, setUploading] = useState(false);
    const [toast, setToast] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [hasFullAccess] = useState(true);

    const showToast = (type: 'success' | 'error', msg: string) => {
        setToast({ type, msg });
        setTimeout(() => setToast(null), 3000);
    };

    useEffect(() => {
        const fetchData = async () => {
            if (!userId) return;
            try {
                setLoading(true);
                const [batchRes, matRes, studentsRes, sessionsRes] = await Promise.all([
                    api.get(`/academic/batches/trainer/${encodeURIComponent(userId)}`),
                    api.get('/academic/materials').catch(() => ({ data: [] })),
                    api.get('/users?role=STUDENT').catch(() => ({ data: [] })),
                    api.get('/academic/sessions').catch(() => ({ data: [] })),
                ]);
                setBatches(batchRes.data || []);
                setMaterials(matRes.data || []);
                setAllStudents(studentsRes.data || []);
                setSessions(sessionsRes.data || []);
            } catch (err) {
                console.error("Failed to load trainer course data:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [userId]);

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
            showToast('success', 'Folder created successfully');
        } catch (err) {
            console.error(err);
            showToast('error', 'Failed to create folder');
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
                name: selectedFile ? selectedFile.name : ("COURSE_MATERIAL_" + Date.now() + ".PDF"),
                type: selectedFile ? selectedFile.name.split('.').pop()?.toUpperCase() : 'PDF',
                uploadedBy: userId,
                url: "https://bytecode-cloud.storage/path/to/resource.pdf",
                permissions: { isPublic: true, accessType: 'FULL' }
            };
            const res = await api.post('academic/materials', assetData);
            setMaterials([...materials, res.data]);
            setShowUploadModal(false);
            setSelectedFile(null);
            showToast('success', 'Asset uploaded successfully');
        } catch (err) {
            console.error(err);
            showToast('error', 'Upload failed');
        } finally {
            setUploading(false);
        }
    };

    const handleDeleteMaterial = async (id: string) => {
        if (!confirm('Are you sure you want to remove this resource?')) return;
        try {
            await api.delete(`/academic/materials/${id}`);
            setMaterials(materials.filter(m => m.id !== id));
            showToast('success', 'Resource deleted');
        } catch (err) {
            console.error(err);
            showToast('error', 'Deletion failed');
        }
    };

    const courseGroups: CourseGroup[] = useMemo(() => {
        const map = new Map<string, CourseGroup>();
        batches.forEach(b => {
            const key = b.courseId || b.courseName;
            if (!map.has(key)) map.set(key, { courseId: key, courseName: b.courseName, batches: [] });
            map.get(key)!.batches.push(b);
        });
        return Array.from(map.values());
    }, [batches]);

    const stats = useMemo(() => [
        { label: "My Roadmaps", value: courseGroups.length.toString(), icon: Target, color: "#8b5cf6" },
        { label: "Faculty Batches", value: batches.length.toString(), icon: BookOpen, color: "#3b82f6" },
        { label: "Total Students", value: batches.reduce((a, b) => a + (b.totalStudents || 0), 0).toString(), icon: Users, color: "#10b981" },
        { label: "Asset Library", value: materials.length.toString(), icon: Layers, color: "#f59e0b", trend: "Faculty Only" },
    ], [courseGroups, batches, materials]);

    const selectedGroup = selectedCourseId ? courseGroups.find(g => g.courseId === selectedCourseId) : null;

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-[#050510]">
                <div className="w-12 h-12 border-4 border-violet-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <AdvancedModuleLayout
            title="Faculty Batch & Resource Manager"
            subtitle="Coordinate your assigned curriculum, distribute learning assets and monitor student success."
            stats={stats}
            activeTab={activeTab}
            onTabChange={(id) => { setActiveTab(id); setSelectedCourseId(null); setSelectedBatch(null); }}
            role="trainer"
            tabs={[
                { id: 'catalog', label: 'Curriculum Catalog', icon: Layers },
                { id: 'materials', label: 'Study Materials', icon: FileText },
                { id: 'archives', label: 'Resource Archives', icon: PlayCircle },
            ]}
        >
            <AnimatePresence mode="wait">
                {activeTab === 'catalog' && (
                    <motion.div key="catalog" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">

                        {/* Breadcrumbs */}
                        {(selectedCourseId || selectedBatch) && (
                            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-500 mb-6">
                                <button onClick={() => { setSelectedCourseId(null); setSelectedBatch(null); }} className="hover:text-violet-400 transition-colors">Courses</button>
                                {selectedCourseId && <><ChevronRight size={12} /> <button onClick={() => setSelectedBatch(null)} className={`hover:text-violet-400 transition-colors ${!selectedBatch ? 'text-violet-400' : ''}`}>{selectedGroup?.courseName}</button></>}
                                {selectedBatch && <><ChevronRight size={12} /> <span className="text-violet-400">{selectedBatch.batchName}</span></>}
                            </div>
                        )}

                        {!selectedCourseId && !selectedBatch ? (
                            /* ── IMAGE 1: COURSE GRID ── */
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {courseGroups.map((group, i) => (
                                    <motion.div
                                        key={group.courseId}
                                        whileHover={{ y: -8 }}
                                        onClick={() => setSelectedCourseId(group.courseId)}
                                        className="group bg-[#0d0d1f] border border-white/5 rounded-[2rem] overflow-hidden cursor-pointer shadow-2xl hover:border-violet-500/30 transition-all flex flex-col"
                                    >
                                        <div className="h-48 flex items-center justify-center bg-gradient-to-br from-violet-600/5 to-blue-600/5 relative">
                                            <div className="w-20 h-20 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-5xl group-hover:scale-110 transition-transform duration-500">
                                                {getCourseEmoji(group.courseName)}
                                            </div>
                                        </div>
                                        <div className="p-8 flex-1 flex flex-col">
                                            <h4 className="text-xl font-black text-white uppercase mb-3 font-[Rajdhani] group-hover:text-violet-400 transition-colors leading-tight">{group.courseName}</h4>
                                            <div className="flex gap-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                                                <span>{group.batches.length} BATCHES</span>
                                                <span>{group.batches.reduce((a, b) => a + (b.totalStudents || 0), 0)} STUDENTS</span>
                                            </div>
                                            <div className="mt-10 pt-6 border-t border-white/5 flex items-center justify-between">
                                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Explore Syllabus</span>
                                                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-violet-600 transition-all">
                                                    <ChevronRight size={18} className="text-slate-600 group-hover:text-white" />
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        ) : selectedCourseId && !selectedBatch ? (
                            /* ── IMAGE 2: BATCH SELECTION ── */
                            <div className="space-y-8">
                                <div className="flex justify-between items-end">
                                    <h2 className="text-4xl font-black text-white uppercase tracking-tight font-[Rajdhani]">{selectedGroup?.courseName}</h2>
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
                                                <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase border tracking-widest ${STATUS_COLOR[batch.status]}`}>{batch.status}</span>
                                            </div>

                                            <h4 className="text-2xl font-black text-white mb-2 uppercase tracking-tight font-[Rajdhani] leading-tight group-hover:text-blue-400 transition-colors uppercase">{batch.batchName}</h4>
                                            <p className="text-sm font-bold text-slate-600 uppercase mb-8 tracking-widest">{batch.trainerName}</p>

                                            <div className="mt-8 space-y-4 pt-6 border-t border-white/5">
                                                <div className="flex justify-between items-center text-[10px] font-black text-slate-500 uppercase tracking-widest">
                                                    <span>Enrolled</span>
                                                    <span className="text-white">{batch.totalStudents} / {batch.maxCapacity}</span>
                                                </div>
                                                <div className="flex justify-between items-center text-[10px] font-black text-slate-500 uppercase tracking-widest">
                                                    <span>Delivery</span>
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

                                <div className="flex justify-between items-start">
                                    <div className="space-y-4">
                                        <h2 className="text-4xl font-black text-white uppercase tracking-tighter font-[Rajdhani] leading-none">{selectedBatch.batchName}</h2>
                                        <div className="flex flex-wrap items-center gap-6 text-xs font-bold text-slate-500 uppercase tracking-widest">
                                            <span className="text-blue-400">{selectedBatch.courseName}</span>
                                            <span className="flex items-center gap-2"> <Users size={14} className="text-slate-600" /> {selectedBatch.trainerName}</span>
                                            <span className="flex items-center gap-2"> <Clock size={14} className="text-slate-600" /> {selectedBatch.schedule}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

                                    {/* Students Section */}
                                    <div className="bg-[#0b0b1a] border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl">
                                        <div className="p-8 pb-4 flex justify-between items-center">
                                            <h3 className="text-xl font-black text-white uppercase tracking-tight flex items-center gap-3 font-[Rajdhani]">
                                                <Users className="text-blue-400" /> My Students ({selectedBatch.totalStudents})
                                            </h3>
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

                                    {/* Sessions Section */}
                                    <div className="bg-[#0b0b1a] border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl">
                                        <div className="p-8 pb-4 flex justify-between items-center">
                                            <h3 className="text-xl font-black text-white uppercase tracking-tight flex items-center gap-3 font-[Rajdhani]">
                                                <Video className="text-violet-400" /> Faculty Sessions
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
                                                            <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">{s.status}</span>
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
                                                <Upload size={16} /> Upload New
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
                                                            {hasFullAccess && (
                                                                <button className={`flex-1 py-3 rounded-xl text-[8px] font-black tracking-widest uppercase transition-all shadow-lg border
                                                                    ${isFolder
                                                                        ? 'bg-amber-500/10 border-amber-500/30 text-amber-400 hover:bg-amber-500 hover:text-white'
                                                                        : item.type === 'VIDEO'
                                                                            ? 'bg-violet-500/10 border-violet-500/30 text-violet-400 hover:bg-violet-500 hover:text-white'
                                                                            : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-600 hover:text-white'
                                                                    }`}>
                                                                    {isFolder ? 'Explore' : 'Access'}
                                                                </button>
                                                            )}
                                                        </div>

                                                        {/* Glass Reflection Highlight */}
                                                        <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />
                                                    </motion.div>
                                                );
                                            })
                                        ) : (
                                            <div className="col-span-full py-20 text-center font-bold text-slate-700 uppercase tracking-widest text-sm border-2 border-dashed border-white/5 rounded-3xl">No faculty resources initialized for this batch</div>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </motion.div>
                )}

                {activeTab === 'materials' && (
                    <motion.div key="materials-tab" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                        <div className="flex justify-between items-center bg-white/5 border border-white/5 p-6 rounded-[2rem]">
                            <div className="text-sm font-bold text-slate-400 uppercase tracking-widest">Global Asset Library</div>
                            <button className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-xl text-[10px] uppercase tracking-widest flex items-center gap-2 transition-all shadow-lg shadow-emerald-500/20 rotate-0 hover:scale-105"><Upload size={16} /> Faculty Upload</button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {materials.map((mat, i) => (
                                <div key={i} className="p-6 bg-slate-900/50 border border-white/5 rounded-[2rem] group hover:border-emerald-500/30 transition-all flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center border border-emerald-500/20 group-hover:bg-emerald-600 group-hover:text-white transition-all"><FileText size={24} /></div>
                                        <div>
                                            <div className="text-sm font-bold text-white line-clamp-1 tracking-tight">{mat.name}</div>
                                            <div className="text-[10px] text-slate-500 font-black uppercase tracking-widest opacity-60">{mat.type} · {mat.batchName || 'Global'}</div>
                                        </div>
                                    </div>
                                    <button className="p-3 text-slate-700 hover:text-emerald-400 bg-white/5 rounded-xl transition-all"><Download size={20} /></button>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}

                {activeTab === 'archives' && (
                    <motion.div key="archives-tab" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-32 text-slate-700 border-2 border-dashed border-white/5 rounded-[3rem]">
                        <PlayCircle size={80} className="mb-6 opacity-10 animate-pulse" />
                        <h4 className="text-xl font-black text-white uppercase tracking-[0.2em] font-[Rajdhani]">Vault Secure Archives</h4>
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-2">Cloud-syncing with Bytecode Media Server — Version 2.0</p>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Modal Layer */}
            <AnimatePresence>
                {showFolderModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowFolderModal(false)} className="absolute inset-0 bg-black/80 backdrop-blur-xl" />
                        <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} className="relative w-full max-w-md bg-[#0d0d1f] border border-white/10 rounded-[2.5rem] p-10 overflow-hidden shadow-2xl">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-3xl rounded-full -mr-16 -mt-16" />
                            <h3 className="text-2xl font-black text-white uppercase tracking-tight font-[Rajdhani] mb-6 flex items-center gap-3">
                                <FolderPlus className="text-emerald-400" /> New Folder
                            </h3>
                            <div className="space-y-6">
                                <input
                                    type="text"
                                    value={newFolderName}
                                    onChange={(e) => setNewFolderName(e.target.value)}
                                    placeholder="Enter folder name..."
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm text-white focus:border-emerald-500 outline-none transition-all"
                                />
                                <div className="flex gap-4">
                                    <button onClick={() => setShowFolderModal(false)} className="flex-1 py-4 bg-white/5 border border-white/10 text-white font-black rounded-2xl text-[10px] uppercase tracking-[0.2em] transition-all">Cancel</button>
                                    <button
                                        disabled={uploading}
                                        onClick={handleCreateFolder}
                                        className="flex-1 py-4 bg-emerald-600 text-white font-black rounded-2xl text-[10px] uppercase tracking-[0.2em] shadow-lg shadow-emerald-500/20 active:scale-95 transition-all disabled:opacity-50">
                                        {uploading ? 'Initializing...' : 'Create'}
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
                                <Upload size={32} />
                            </div>
                            <h3 className="text-2xl font-black text-white uppercase tracking-tight font-[Rajdhani] mb-2">Upload File</h3>
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-8">Add new resource to batch library</p>

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
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">
                                    {selectedFile ? 'Selected: ' + selectedFile.name : 'Select files or drag & drop'}
                                </span>
                                {selectedFile && <span className="text-[8px] text-emerald-400 font-bold uppercase tracking-widest italic">Click again to change file</span>}
                            </div>

                            <div className="flex gap-4">
                                <button onClick={() => setShowUploadModal(false)} className="flex-1 py-4 bg-white/5 border border-white/10 text-white font-black rounded-2xl text-[10px] uppercase tracking-[0.2em] transition-all">Cancel</button>
                                <button
                                    disabled={uploading}
                                    onClick={handleUploadAsset}
                                    className="flex-1 py-4 bg-blue-600 text-white font-black rounded-2xl text-[10px] uppercase tracking-[0.2em] shadow-lg shadow-blue-500/20 active:scale-95 transition-all disabled:opacity-50">
                                    {uploading ? 'Uploading...' : 'Upload'}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {toast && (
                <motion.div
                    initial={{ opacity: 0, y: 50, x: '-50%' }}
                    animate={{ opacity: 1, y: 0, x: '-50%' }}
                    exit={{ opacity: 0, y: 50, x: '-50%' }}
                    className={`fixed bottom-10 left-1/2 z-[200] px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest text-white shadow-2xl ${toast.type === 'success' ? 'bg-emerald-600' : 'bg-red-600'}`}
                >
                    {toast.msg}
                </motion.div>
            )}
        </AdvancedModuleLayout>
    );
}
