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
    Edit,
    Trash2,
    Eye,
    Download,
    Upload,
    Filter,
    BarChart3,
    Target,
    Zap,
    Star,
    TrendingDown,
    Activity,
    DollarSign,
    X,
    Save,
    UserPlus,
    UserMinus,
    FolderOpen,
    File,
    Lock,
    Unlock,
    ChevronRight,
    ArrowLeft,
    Link as LinkIcon,
    FolderPlus,
    FilePlus,
} from 'lucide-react';
import api from '@/lib/api';

// ========== INTERFACES ==========
interface Course {
    id: string;
    title: string;
    description: string;
    category: string;
    level: string;
    duration: string;
    price: number;
    instructor: string;
    rating: number;
    enrolledStudents: number;
    thumbnail: string;
    status: string;
}

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
    studentIds: string[];
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
    batchId: string;
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
    batchId: string;
    batchName: string;
    trainerName: string;
    assignedDate: string;
    dueDate: string;
    totalMarks: number;
    difficulty: string;
    status: string;
    submissions?: any[];
}

interface LearningMaterial {
    id: string;
    batchId: string;
    folderId?: string;
    name: string;
    type: 'FOLDER' | 'VIDEO' | 'PDF' | 'DOCUMENT' | 'IMAGE';
    url?: string;
    size?: number;
    uploadedBy: string;
    uploadedAt: string;
    permissions: {
        studentIds: string[];
        accessType: 'READ' | 'WRITE' | 'FULL';
        isPublic?: boolean;
    };
}

interface Student {
    id: string;
    fullName: string;
    email: string;
    phoneNumber: string;
    enrolledCourses: string[];
}

interface Trainer {
    id: string;
    fullName: string;
    email: string;
    specialization: string;
}

export default function CourseManagementPage() {
    const [activeTab, setActiveTab] = useState('courses');
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    // Data states
    const [courses, setCourses] = useState<Course[]>([]);
    const [batches, setBatches] = useState<Batch[]>([]);
    const [sessions, setSessions] = useState<LiveSession[]>([]);
    const [assignments, setAssignments] = useState<Assignment[]>([]);
    const [students, setStudents] = useState<Student[]>([]);
    const [trainers, setTrainers] = useState<Trainer[]>([]);
    const [materials, setMaterials] = useState<LearningMaterial[]>([]);

    // View states
    const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
    const [selectedBatch, setSelectedBatch] = useState<Batch | null>(null);
    const [currentFolder, setCurrentFolder] = useState<string | null>(null);
    const [viewMode, setViewMode] = useState<'list' | 'detail'>('list');

    // Modal states
    const [showBatchModal, setShowBatchModal] = useState(false);
    const [showSessionModal, setShowSessionModal] = useState(false);
    const [showStudentModal, setShowStudentModal] = useState(false);
    const [showMaterialModal, setShowMaterialModal] = useState(false);
    const [showPermissionModal, setShowPermissionModal] = useState(false);

    // Form states
    const [batchForm, setBatchForm] = useState<Partial<Batch>>({});
    const [sessionForm, setSessionForm] = useState<Partial<LiveSession>>({});
    const [materialForm, setMaterialForm] = useState<Partial<LearningMaterial>>({
        permissions: { studentIds: [], accessType: 'READ', isPublic: true }
    });
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isDragging, setIsDragging] = useState(false);

    // Fetch all data
    useEffect(() => {
        fetchAllData();
    }, []);

    const fetchAllData = async () => {
        try {
            setLoading(true);
            const results = await Promise.allSettled([
                api.get('courses'),
                api.get('academic/batches'),
                api.get('academic/sessions'),
                api.get('academic/assignments'),
                api.get('users?role=STUDENT'),
                api.get('users?role=TRAINER'),
                api.get('academic/materials')
            ]);

            const [coursesRes, batchesRes, sessionsRes, assignmentsRes, studentsRes, trainersRes, materialsRes] = results;

            if (coursesRes.status === 'fulfilled') setCourses(coursesRes.value.data);
            if (batchesRes.status === 'fulfilled') setBatches(batchesRes.value.data);
            if (sessionsRes.status === 'fulfilled') setSessions(sessionsRes.value.data);
            if (assignmentsRes.status === 'fulfilled') setAssignments(assignmentsRes.value.data);
            if (studentsRes.status === 'fulfilled') setStudents(studentsRes.value.data);
            if (trainersRes.status === 'fulfilled') setTrainers(trainersRes.value.data);
            if (materialsRes.status === 'fulfilled') setMaterials(materialsRes.value.data || []);

            setLoading(false);
        } catch (error) {
            console.error("Dashboard data fetch failed:", error);
            setLoading(false);
        }
    };

    // Get batches for selected course
    const courseBatches = useMemo(() => {
        if (!selectedCourse) return [];
        return batches.filter(b => b.courseId === selectedCourse.id);
    }, [selectedCourse, batches]);

    // Get sessions for selected batch
    const batchSessions = useMemo(() => {
        if (!selectedBatch) return [];
        return sessions.filter(s => s.batchId === selectedBatch.id);
    }, [selectedBatch, sessions]);

    // Get materials for selected batch
    const batchMaterials = useMemo(() => {
        if (!selectedBatch) return [];
        return materials.filter(m =>
            m.batchId === selectedBatch.id &&
            (currentFolder ? m.folderId === currentFolder : !m.folderId)
        );
    }, [selectedBatch, materials, currentFolder]);

    // Fetch materials when folder changes
    useEffect(() => {
        if (selectedBatch) {
            const fetchMaterials = async () => {
                try {
                    const url = currentFolder
                        ? `academic/materials/batch/${selectedBatch.id}/folder/${currentFolder}`
                        : `academic/materials/batch/${selectedBatch.id}/root`;
                    const res = await api.get(url);
                    // Update the main materials state with new data
                    setMaterials(prev => {
                        const otherMaterials = prev.filter(m =>
                            m.batchId !== selectedBatch.id ||
                            (currentFolder ? m.folderId !== currentFolder : m.folderId !== null)
                        );
                        return [...otherMaterials, ...(res.data || [])];
                    });
                } catch (error) {
                    console.error("Failed to fetch folder materials:", error);
                }
            };
            fetchMaterials();
        }
    }, [currentFolder, selectedBatch]);

    // Statistics
    const stats = useMemo(() => {
        const totalRevenue = courses.reduce((acc, c) => acc + (c.price * c.enrolledStudents), 0);
        const avgRating = courses.length > 0 ? courses.reduce((acc, c) => acc + c.rating, 0) / courses.length : 0;

        return [
            {
                label: "Total Courses",
                value: courses.length.toString(),
                icon: BookOpen,
                color: "#3b82f6",
                trend: `${courses.filter(c => c.status === 'ACTIVE').length} Active`
            },
            {
                label: "Active Batches",
                value: batches.filter(b => b.status === 'ONGOING').length.toString(),
                icon: Users,
                color: "#8b5cf6",
                trend: `${batches.reduce((acc, b) => acc + b.totalStudents, 0)} Students`
            },
            {
                label: "Live Sessions",
                value: sessions.filter(s => s.status === 'ONGOING' || s.status === 'UPCOMING').length.toString(),
                icon: Video,
                color: "#10b981",
                trend: "Today"
            },
            {
                label: "Course Revenue",
                value: `₹${(totalRevenue / 100000).toFixed(1)}L`,
                icon: DollarSign,
                color: "#f59e0b",
                trend: `${avgRating.toFixed(1)}★ Avg Rating`
            },
        ];
    }, [courses, batches, sessions]);

    // Helper functions
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    };

    const getStatusColor = (status: string) => {
        const colors: Record<string, string> = {
            'ONGOING': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
            'UPCOMING': 'bg-blue-500/10 text-blue-400 border-blue-500/20',
            'COMPLETED': 'bg-slate-500/10 text-slate-400 border-slate-500/20',
            'ACTIVE': 'bg-violet-500/10 text-violet-400 border-violet-500/20',
        };
        return colors[status] || 'bg-amber-500/10 text-amber-400 border-amber-500/20';
    };

    // CRUD Operations
    const handleCreateBatch = async () => {
        try {
            const payload = {
                ...batchForm,
                courseId: batchForm.courseId || selectedCourse?.id,
                courseName: batchForm.courseName || selectedCourse?.title,
                studentIds: [],
                totalStudents: 0
            };

            if (!payload.courseId) {
                alert("Please select a course for this batch.");
                return;
            }

            await api.post('academic/batches', payload);
            fetchAllData();
            setShowBatchModal(false);
            setBatchForm({});
        } catch (error) {
            console.error("Failed to create batch:", error);
            alert("Error creating batch. This might be a connection issue.");
        }
    };

    const handleUpdateBatch = async () => {
        if (!selectedBatch) return;
        try {
            await api.put(`academic/batches/${selectedBatch.id}`, batchForm);
            fetchAllData();
            setShowBatchModal(false);
            setBatchForm({});
        } catch (error) {
            console.error("Failed to update batch:", error);
        }
    };

    const handleAssignStudent = async (studentId: string) => {
        if (!selectedBatch) return;
        try {
            const updatedStudents = [...(selectedBatch.studentIds || []), studentId];
            await api.put(`academic/batches/${selectedBatch.id}`, {
                ...selectedBatch,
                studentIds: updatedStudents,
                totalStudents: updatedStudents.length
            });
            fetchAllData();
        } catch (error) {
            console.error("Failed to assign student:", error);
        }
    };

    const handleRemoveStudent = async (studentId: string) => {
        if (!selectedBatch) return;
        try {
            const updatedStudents = selectedBatch.studentIds.filter(id => id !== studentId);
            await api.put(`academic/batches/${selectedBatch.id}`, {
                ...selectedBatch,
                studentIds: updatedStudents,
                totalStudents: updatedStudents.length
            });
            fetchAllData();
        } catch (error) {
            console.error("Failed to remove student:", error);
        }
    };

    const handleCreateSession = async () => {
        try {
            await api.post('academic/sessions', { ...sessionForm, batchId: selectedBatch?.id });
            fetchAllData();
            setShowSessionModal(false);
            setSessionForm({});
        } catch (error) {
            console.error("Failed to create session:", error);
        }
    };

    const handleUploadMaterial = async () => {
        try {
            const payload = {
                ...materialForm,
                batchId: selectedBatch?.id,
                folderId: currentFolder,
                url: materialForm.type === 'FOLDER' ? '' : (selectedFile ? `https://storage.bytecode.com/${selectedFile.name}` : materialForm.url),
                size: selectedFile?.size || 0,
                uploadedBy: 'Lead Java Faculty',
                uploadedAt: new Date().toISOString(),
            };

            await api.post('academic/materials', payload);
            fetchAllData();
            setShowMaterialModal(false);
            setMaterialForm({ permissions: { studentIds: [], accessType: 'READ', isPublic: true } });
            setSelectedFile(null);
        } catch (error) {
            console.error("Upload failed:", error);
        }
    };

    const onFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) {
            const file = e.target.files[0];
            setSelectedFile(file);
            setMaterialForm(prev => ({
                ...prev,
                name: file.name,
                type: file.type.includes('video') ? 'VIDEO' :
                    file.type.includes('pdf') ? 'PDF' :
                        file.type.includes('image') ? 'IMAGE' : 'DOCUMENT'
            }));
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files?.[0]) {
            const file = e.dataTransfer.files[0];
            setSelectedFile(file);
            setMaterialForm(prev => ({
                ...prev,
                name: file.name,
                type: file.type.includes('video') ? 'VIDEO' :
                    file.type.includes('pdf') ? 'PDF' :
                        file.type.includes('image') ? 'IMAGE' : 'DOCUMENT'
            }));
        }
    };

    if (loading) {
        return (
            <AdvancedModuleLayout
                title="Course & Academic Management"
                subtitle="Comprehensive course, batch, and curriculum management system"
                stats={stats}
                activeTab={activeTab}
                onTabChange={setActiveTab}
                tabs={[
                    { id: 'courses', label: 'Courses', icon: BookOpen },
                    { id: 'batches', label: 'Batches', icon: Users },
                    { id: 'sessions', label: 'Sessions', icon: Video },
                    { id: 'materials', label: 'Materials', icon: FolderOpen },
                ]}
            >
                <div className="flex items-center justify-center h-64">
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                        <div className="text-white font-bold">Loading...</div>
                    </div>
                </div>
            </AdvancedModuleLayout>
        );
    }

    return (
        <AdvancedModuleLayout
            title="Course & Academic Management"
            subtitle="Comprehensive course, batch, and curriculum management system"
            stats={stats}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            tabs={[
                { id: 'courses', label: 'Courses', icon: BookOpen },
                { id: 'batches', label: 'Batches', icon: Users },
                { id: 'sessions', label: 'Sessions', icon: Video },
                { id: 'materials', label: 'Materials', icon: FolderOpen },
            ]}
        >
            {/* ========== COURSES TAB ========== */}
            {activeTab === 'courses' && (
                <div className="space-y-6">
                    {/* Breadcrumb */}
                    {selectedCourse && (
                        <div className="flex items-center gap-2 text-sm">
                            <button onClick={() => setSelectedCourse(null)} className="text-blue-400 hover:underline">
                                Courses
                            </button>
                            <ChevronRight size={16} className="text-slate-600" />
                            <span className="text-white font-bold">{selectedCourse.title}</span>
                        </div>
                    )}

                    {!selectedCourse ? (
                        <>
                            <div className="flex justify-between items-center">
                                <div className="relative w-96">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                                    <input
                                        type="text"
                                        placeholder="Search courses..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full bg-slate-900/50 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-blue-500"
                                    />
                                </div>
                                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2">
                                    <Plus size={16} /> Add Course
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {courses.map((course, i) => (
                                    <motion.div
                                        key={course.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.05 }}
                                        onClick={() => setSelectedCourse(course)}
                                        className="bg-slate-900/50 border border-white/5 rounded-2xl overflow-hidden hover:border-blue-500/50 transition-all group cursor-pointer"
                                    >
                                        <div className="relative h-40 bg-gradient-to-br from-blue-500/20 to-violet-600/20">
                                            {course.thumbnail ? (
                                                <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <BookOpen size={48} className="text-white/20" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="p-5">
                                            <h3 className="text-lg font-bold text-white mb-2 group-hover:text-blue-400 transition-colors line-clamp-2">
                                                {course.title}
                                            </h3>
                                            <p className="text-sm text-slate-400 mb-4 line-clamp-2">{course.description}</p>
                                            <div className="flex items-center justify-between text-xs text-slate-400 border-t border-white/5 pt-4">
                                                <div className="flex items-center gap-1">
                                                    <Users size={12} />
                                                    {course.enrolledStudents}
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Star size={12} className="text-yellow-400 fill-yellow-400" />
                                                    {course.rating}
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </>
                    ) : (
                        <div className="space-y-6">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h2 className="text-2xl font-bold text-white">{selectedCourse.title}</h2>
                                    <p className="text-slate-400">{courseBatches.length} Batches</p>
                                </div>
                                <button
                                    onClick={() => {
                                        setBatchForm({ courseId: selectedCourse.id, courseName: selectedCourse.title });
                                        setShowBatchModal(true);
                                    }}
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2"
                                >
                                    <Plus size={16} /> Create Batch
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {courseBatches.map((batch) => (
                                    <motion.div
                                        key={batch.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        onClick={() => {
                                            setSelectedBatch(batch);
                                            setActiveTab('batches');
                                        }}
                                        className="bg-slate-900/50 border border-white/5 rounded-2xl p-5 hover:border-blue-500/50 transition-all group cursor-pointer"
                                    >
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-white">
                                                <Users size={24} />
                                            </div>
                                            <span className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase border ${getStatusColor(batch.status)}`}>
                                                {batch.status}
                                            </span>
                                        </div>
                                        <h3 className="text-lg font-bold text-white mb-1 group-hover:text-blue-400">{batch.batchName}</h3>
                                        <div className="text-sm text-slate-400 mb-3">{batch.trainerName}</div>
                                        <div className="space-y-2 text-xs text-slate-400 border-t border-white/5 pt-4">
                                            <div className="flex justify-between">
                                                <span>Students:</span>
                                                <span className="text-white font-bold">{batch.totalStudents}/{batch.maxCapacity}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>Mode:</span>
                                                <span className="text-white font-bold">{batch.mode}</span>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* ========== BATCHES TAB ========== */}
            {activeTab === 'batches' && (
                <div className="space-y-6">
                    {!selectedBatch ? (
                        <>
                            <div className="flex justify-between items-center">
                                <div className="relative w-96">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                                    <input
                                        type="text"
                                        placeholder="Search batches..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full bg-slate-900/50 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-blue-500"
                                    />
                                </div>
                                <button
                                    onClick={() => {
                                        setBatchForm({ status: 'UPCOMING' });
                                        setShowBatchModal(true);
                                    }}
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2"
                                >
                                    <Plus size={16} /> Create Batch
                                </button>
                            </div >

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {batches.filter(b =>
                                    b.batchName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                    b.courseName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                    b.batchCode.toLowerCase().includes(searchQuery.toLowerCase())
                                ).map((batch) => (
                                    <motion.div
                                        key={batch.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        onClick={() => setSelectedBatch(batch)}
                                        className="bg-slate-900/50 border border-white/5 rounded-2xl p-5 hover:border-blue-500/50 transition-all group cursor-pointer relative overflow-hidden"
                                    >
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-white">
                                                <Users size={24} />
                                            </div>
                                            <span className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase border ${getStatusColor(batch.status)}`}>
                                                {batch.status}
                                            </span>
                                        </div>
                                        <h3 className="text-lg font-bold text-white mb-1 group-hover:text-blue-400">{batch.batchName}</h3>
                                        <div className="text-sm text-slate-400 mb-2">{batch.courseName}</div>
                                        <div className="text-xs text-slate-500 mb-4 font-mono">{batch.batchCode}</div>

                                        <div className="space-y-2 text-xs text-slate-400 border-t border-white/5 pt-4">
                                            <div className="flex justify-between">
                                                <span>Trainer:</span>
                                                <span className="text-white font-medium">{batch.trainerName}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>Students:</span>
                                                <span className="text-white font-medium">{batch.totalStudents}/{batch.maxCapacity}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>Timeline:</span>
                                                <span className="text-white font-medium">{formatDate(batch.startDate)}</span>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </>
                    ) : (
                        <div className="space-y-6">
                            {/* Breadcrumb */}
                            <div className="flex items-center gap-2 text-sm">
                                <button onClick={() => { setSelectedBatch(null); setActiveTab('courses'); }} className="text-blue-400 hover:underline">
                                    Batches
                                </button>
                                <ChevronRight size={16} className="text-slate-600" />
                                <span className="text-white font-bold">{selectedBatch.batchName}</span>
                            </div>

                            {/* Batch Header */}
                            <div className="bg-slate-900/50 border border-white/5 rounded-2xl p-6">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h2 className="text-2xl font-bold text-white mb-2">{selectedBatch.batchName}</h2>
                                        <div className="flex items-center gap-4 text-sm text-slate-400">
                                            <span>{selectedBatch.courseName}</span>
                                            <span>•</span>
                                            <span>{selectedBatch.trainerName}</span>
                                            <span>•</span>
                                            <span>{selectedBatch.schedule}</span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => {
                                            setBatchForm(selectedBatch);
                                            setShowBatchModal(true);
                                        }}
                                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2"
                                    >
                                        <Edit size={16} /> Edit Batch
                                    </button>
                                </div>
                            </div>

                            {/* Batch Management Sections */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {/* Students Section */}
                                <div className="bg-slate-900/50 border border-white/5 rounded-2xl p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                            <Users className="text-blue-400" size={20} />
                                            Students ({selectedBatch.totalStudents}/{selectedBatch.maxCapacity})
                                        </h3>
                                        <button
                                            onClick={() => setShowStudentModal(true)}
                                            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1"
                                        >
                                            <UserPlus size={14} /> Assign
                                        </button>
                                    </div>
                                    <div className="space-y-2 max-h-64 overflow-y-auto">
                                        {students.filter(s => selectedBatch.studentIds?.includes(s.id)).map((student) => (
                                            <div key={student.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                                                <div>
                                                    <div className="text-sm font-bold text-white">{student.fullName}</div>
                                                    <div className="text-xs text-slate-400">{student.email}</div>
                                                </div>
                                                <button
                                                    onClick={() => handleRemoveStudent(student.id)}
                                                    className="p-1.5 hover:bg-red-500/10 rounded text-red-400"
                                                >
                                                    <UserMinus size={14} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Sessions Section */}
                                <div className="bg-slate-900/50 border border-white/5 rounded-2xl p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                            <Video className="text-violet-400" size={20} />
                                            Sessions ({batchSessions.length})
                                        </h3>
                                        <button
                                            onClick={() => {
                                                setSessionForm({ batchId: selectedBatch.id, batchName: selectedBatch.batchName });
                                                setShowSessionModal(true);
                                            }}
                                            className="bg-violet-600 hover:bg-violet-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1"
                                        >
                                            <Plus size={14} /> Schedule
                                        </button>
                                    </div>
                                    <div className="space-y-2 max-h-64 overflow-y-auto">
                                        {batchSessions.map((session) => (
                                            <div key={session.id} className="p-3 bg-white/5 rounded-lg">
                                                <div className="flex items-center justify-between mb-2">
                                                    <div className="text-sm font-bold text-white">{session.title}</div>
                                                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase border ${getStatusColor(session.status)}`}>
                                                        {session.status}
                                                    </span>
                                                </div>
                                                <div className="text-xs text-slate-400">
                                                    {formatDate(session.startTime)} • {formatTime(session.startTime)}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Learning Materials Section */}
                            <div className="bg-slate-900/50 border border-white/5 rounded-2xl p-6 mt-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                        <FolderOpen className="text-amber-400" size={20} />
                                        Learning Materials
                                    </h3>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => {
                                                setMaterialForm({ type: 'FOLDER', permissions: { studentIds: [], accessType: 'READ', isPublic: true } });
                                                setShowMaterialModal(true);
                                            }}
                                            className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-all active:scale-95"
                                        >
                                            <FolderPlus size={14} /> New Folder
                                        </button>
                                        <button
                                            onClick={() => {
                                                setMaterialForm({ type: 'DOCUMENT', permissions: { studentIds: [], accessType: 'READ', isPublic: true } });
                                                setShowMaterialModal(true);
                                            }}
                                            className="bg-amber-600 hover:bg-amber-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-all active:scale-95"
                                        >
                                            <Upload size={14} /> Upload
                                        </button>
                                        <button
                                            onClick={() => setShowPermissionModal(true)}
                                            className="bg-slate-600 hover:bg-slate-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1"
                                        >
                                            <Lock size={14} /> Permissions
                                        </button>
                                    </div>
                                </div>

                                {/* Breadcrumb for folders */}
                                {currentFolder && (
                                    <div className="flex items-center gap-2 mb-4 text-sm">
                                        <button onClick={() => setCurrentFolder(null)} className="text-blue-400 hover:underline">
                                            Root
                                        </button>
                                        <ChevronRight size={14} className="text-slate-600" />
                                        <span className="text-white">Current Folder</span>
                                    </div>
                                )}

                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                    {batchMaterials.map((material) => (
                                        <div
                                            key={material.id}
                                            onClick={() => material.type === 'FOLDER' ? setCurrentFolder(material.id) : null}
                                            className={`bg-white/5 border border-white/5 rounded-xl p-4 hover:border-blue-500/30 transition-all cursor-pointer group relative`}
                                        >
                                            <div className="absolute top-2 right-2">
                                                {material.permissions?.isPublic ? (
                                                    <Unlock size={12} className="text-emerald-400 opacity-50" />
                                                ) : (
                                                    <Lock size={12} className="text-amber-400 opacity-50" />
                                                )}
                                            </div>
                                            <div className="flex flex-col items-center text-center">
                                                {material.type === 'FOLDER' ? (
                                                    <FolderOpen size={48} className="text-amber-400 mb-2 group-hover:scale-110 transition-transform" />
                                                ) : material.type === 'VIDEO' ? (
                                                    <PlayCircle size={48} className="text-violet-400 mb-2 group-hover:scale-110 transition-transform" />
                                                ) : (
                                                    <FileText size={48} className="text-blue-400 mb-2 group-hover:scale-110 transition-transform" />
                                                )}
                                                <div className="text-sm font-bold text-white mb-1 line-clamp-1">{material.name}</div>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-slate-400">
                                                        {material.permissions?.accessType || 'READ'}
                                                    </span>
                                                    {!material.permissions?.isPublic && (
                                                        <span className="text-[10px] text-amber-500 font-bold">RESTR</span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    {batchMaterials.length === 0 && (
                                        <div className="col-span-full py-12 flex flex-col items-center justify-center text-slate-500 border-2 border-dashed border-white/5 rounded-2xl">
                                            <FolderOpen size={40} className="mb-2 opacity-20" />
                                            <p className="text-sm">No items in this folder</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* ========== SESSIONS TAB ========== */}
            {activeTab === 'sessions' && (
                <div className="space-y-6">
                    <div className="flex justify-between items-center">
                        <div className="relative w-96">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                            <input
                                type="text"
                                placeholder="Search sessions..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-slate-900/50 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-violet-500"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {sessions.filter(s =>
                            s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            s.batchName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            s.mentorName.toLowerCase().includes(searchQuery.toLowerCase())
                        ).map((session) => (
                            <motion.div
                                key={session.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-slate-900/50 border border-white/5 rounded-2xl p-5 hover:border-violet-500/50 transition-all group"
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <div className="w-10 h-10 rounded-lg bg-violet-500/10 flex items-center justify-center text-violet-400">
                                        <Video size={20} />
                                    </div>
                                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${getStatusColor(session.status)}`}>
                                        {session.status}
                                    </span>
                                </div>
                                <h3 className="text-lg font-bold text-white mb-1">{session.title}</h3>
                                <div className="text-sm text-slate-400 mb-4">{session.batchName}</div>

                                <div className="space-y-3 text-xs text-slate-400 border-t border-white/5 pt-4">
                                    <div className="flex items-center gap-2">
                                        <Calendar size={14} />
                                        <span>{formatDate(session.startTime)}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Clock size={14} />
                                        <span>{formatTime(session.startTime)} ({session.duration} mins)</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Users size={14} />
                                        <span>Mentor: {session.mentorName}</span>
                                    </div>
                                </div>

                                {session.meetingLink && (
                                    <a
                                        href={session.meetingLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="mt-4 w-full flex items-center justify-center gap-2 py-2 bg-violet-600/10 hover:bg-violet-600 text-violet-400 hover:text-white rounded-lg text-xs font-bold transition-all"
                                    >
                                        <LinkIcon size={14} /> Join Session
                                    </a>
                                )}
                            </motion.div>
                        ))}
                    </div>
                </div>
            )}

            {/* ========== MATERIALS TAB ========== */}
            {activeTab === 'materials' && (
                <div className="space-y-6">
                    <div className="flex justify-between items-center">
                        <div className="relative w-96">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                            <input
                                type="text"
                                placeholder="Search materials..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-slate-900/50 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-amber-500"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {materials.filter(m =>
                            m.name.toLowerCase().includes(searchQuery.toLowerCase())
                        ).map((material) => (
                            <motion.div
                                key={material.id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="bg-slate-900/50 border border-white/5 rounded-2xl p-4 hover:border-amber-500/50 transition-all group text-center"
                            >
                                <div className="mb-3 flex justify-center">
                                    {material.type === 'FOLDER' ? (
                                        <FolderOpen size={40} className="text-amber-400" />
                                    ) : material.type === 'VIDEO' ? (
                                        <PlayCircle size={40} className="text-violet-400" />
                                    ) : (
                                        <FileText size={40} className="text-blue-400" />
                                    )}
                                </div>
                                <div className="text-xs font-bold text-white mb-1 line-clamp-1">{material.name}</div>
                                <div className="text-[10px] text-slate-500">{material.type}</div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            )}
            {/* ========== MODALS ========== */}

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
                            className="bg-slate-900 border border-white/10 rounded-2xl p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-bold text-white">
                                    {batchForm.id ? 'Edit Batch' : 'Create New Batch'}
                                </h3>
                                <button onClick={() => setShowBatchModal(false)} className="text-slate-400 hover:text-white">
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-bold text-slate-400 mb-2">Batch Name</label>
                                    <input
                                        type="text"
                                        value={batchForm.batchName || ''}
                                        onChange={(e) => setBatchForm({ ...batchForm, batchName: e.target.value })}
                                        className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-2 text-white"
                                        placeholder="e.g., Full Stack Winter 2024"
                                    />
                                </div>

                                {!selectedCourse && !batchForm.id && (
                                    <div>
                                        <label className="block text-sm font-bold text-slate-400 mb-2">Select Course</label>
                                        <select
                                            value={batchForm.courseId || ''}
                                            onChange={(e) => {
                                                const course = courses.find(c => c.id === e.target.value);
                                                setBatchForm({
                                                    ...batchForm,
                                                    courseId: e.target.value,
                                                    courseName: course?.title
                                                });
                                            }}
                                            className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-2 text-white"
                                        >
                                            <option value="">Select a Course</option>
                                            {courses.map(course => (
                                                <option key={course.id} value={course.id}>{course.title}</option>
                                            ))}
                                        </select>
                                    </div>
                                )}

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-bold text-slate-400 mb-2">Start Date</label>
                                        <input
                                            type="date"
                                            value={batchForm.startDate || ''}
                                            onChange={(e) => setBatchForm({ ...batchForm, startDate: e.target.value })}
                                            className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-2 text-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-400 mb-2">End Date</label>
                                        <input
                                            type="date"
                                            value={batchForm.endDate || ''}
                                            onChange={(e) => setBatchForm({ ...batchForm, endDate: e.target.value })}
                                            className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-2 text-white"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-slate-400 mb-2">Schedule</label>
                                    <input
                                        type="text"
                                        value={batchForm.schedule || ''}
                                        onChange={(e) => setBatchForm({ ...batchForm, schedule: e.target.value })}
                                        className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-2 text-white"
                                        placeholder="e.g., Mon-Fri 10:00 AM - 12:00 PM"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-bold text-slate-400 mb-2">Mode</label>
                                        <select
                                            value={batchForm.mode || 'ONLINE'}
                                            onChange={(e) => setBatchForm({ ...batchForm, mode: e.target.value })}
                                            className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-2 text-white"
                                        >
                                            <option value="ONLINE">Online</option>
                                            <option value="OFFLINE">Offline</option>
                                            <option value="HYBRID">Hybrid</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-400 mb-2">Max Capacity</label>
                                        <input
                                            type="number"
                                            value={batchForm.maxCapacity || ''}
                                            onChange={(e) => setBatchForm({ ...batchForm, maxCapacity: parseInt(e.target.value) })}
                                            className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-2 text-white"
                                        />
                                    </div>
                                </div>

                                <div className="flex gap-3 pt-4">
                                    <button
                                        onClick={() => setShowBatchModal(false)}
                                        className="flex-1 bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg font-bold"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={batchForm.id ? handleUpdateBatch : handleCreateBatch}
                                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-bold flex items-center justify-center gap-2"
                                    >
                                        <Save size={16} /> {batchForm.id ? 'Update' : 'Create'}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Student Assignment Modal */}
            <AnimatePresence>
                {showStudentModal && selectedBatch && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                        onClick={() => setShowStudentModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.95, y: 20 }}
                            className="bg-slate-900 border border-white/10 rounded-2xl p-6 w-full max-w-md max-h-[80vh] overflow-y-auto"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-bold text-white">Assign Students</h3>
                                <button onClick={() => setShowStudentModal(false)} className="text-slate-400 hover:text-white">
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="space-y-2">
                                {students.filter(s => !selectedBatch.studentIds?.includes(s.id)).map((student) => (
                                    <div key={student.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10">
                                        <div>
                                            <div className="text-sm font-bold text-white">{student.fullName}</div>
                                            <div className="text-xs text-slate-400">{student.email}</div>
                                        </div>
                                        <button
                                            onClick={() => {
                                                handleAssignStudent(student.id);
                                                setShowStudentModal(false);
                                            }}
                                            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs font-bold"
                                        >
                                            Assign
                                        </button>
                                    </div>
                                ))}
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
                            className="bg-slate-900 border border-white/10 rounded-2xl p-6 w-full max-w-2xl"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-bold text-white">Schedule Session</h3>
                                <button onClick={() => setShowSessionModal(false)} className="text-slate-400 hover:text-white">
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-bold text-slate-400 mb-2">Session Title</label>
                                    <input
                                        type="text"
                                        value={sessionForm.title || ''}
                                        onChange={(e) => setSessionForm({ ...sessionForm, title: e.target.value })}
                                        className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-2 text-white"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-bold text-slate-400 mb-2">Start Time</label>
                                        <input
                                            type="datetime-local"
                                            value={sessionForm.startTime || ''}
                                            onChange={(e) => setSessionForm({ ...sessionForm, startTime: e.target.value })}
                                            className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-2 text-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-400 mb-2">Duration (mins)</label>
                                        <input
                                            type="number"
                                            value={sessionForm.duration || ''}
                                            onChange={(e) => setSessionForm({ ...sessionForm, duration: parseInt(e.target.value) })}
                                            className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-2 text-white"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-slate-400 mb-2">Meeting Link</label>
                                    <input
                                        type="url"
                                        value={sessionForm.meetingLink || ''}
                                        onChange={(e) => setSessionForm({ ...sessionForm, meetingLink: e.target.value })}
                                        className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-2 text-white"
                                    />
                                </div>

                                <div className="flex gap-3 pt-4">
                                    <button
                                        onClick={() => setShowSessionModal(false)}
                                        className="flex-1 bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg font-bold"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleCreateSession}
                                        className="flex-1 bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-lg font-bold flex items-center justify-center gap-2"
                                    >
                                        <Save size={16} /> Schedule
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Material Upload Modal */}
            <AnimatePresence>
                {showMaterialModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                        onClick={() => {
                            setShowMaterialModal(false);
                            setSelectedFile(null);
                        }}
                    >
                        <motion.div
                            initial={{ scale: 0.95, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.95, y: 20 }}
                            className="bg-slate-900 border border-white/10 rounded-2xl p-6 w-full max-w-md"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-bold text-white">
                                    {materialForm.type === 'FOLDER' ? 'Create Folder' : 'Upload Material'}
                                </h3>
                                <button onClick={() => setShowMaterialModal(false)} className="text-slate-400 hover:text-white">
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="space-y-4">
                                {materialForm.type !== 'FOLDER' && (
                                    <div
                                        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                                        onDragLeave={() => setIsDragging(false)}
                                        onDrop={handleDrop}
                                        className={`border-2 border-dashed rounded-xl p-8 transition-all flex flex-col items-center justify-center gap-3 cursor-pointer
                                            ${isDragging ? 'border-blue-500 bg-blue-500/10' : 'border-white/10 hover:border-white/20 hover:bg-white/5'}
                                            ${selectedFile ? 'border-emerald-500/50 bg-emerald-500/5' : ''}
                                        `}
                                        onClick={() => document.getElementById('fileInput')?.click()}
                                    >
                                        <input
                                            type="file"
                                            id="fileInput"
                                            className="hidden"
                                            onChange={onFileSelect}
                                        />
                                        {selectedFile ? (
                                            <>
                                                <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-500">
                                                    <CheckCircle size={24} />
                                                </div>
                                                <div className="text-center">
                                                    <div className="text-sm font-bold text-white mb-1">{selectedFile.name}</div>
                                                    <div className="text-xs text-slate-400">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</div>
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-500">
                                                    <Upload size={24} />
                                                </div>
                                                <div className="text-center">
                                                    <div className="text-sm font-bold text-white mb-1">Click or drag & drop</div>
                                                    <div className="text-xs text-slate-400">Support all file types</div>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                )}

                                <div>
                                    <label className="block text-sm font-bold text-slate-400 mb-2">
                                        {materialForm.type === 'FOLDER' ? 'Folder Name' : 'Display Name'}
                                    </label>
                                    <input
                                        type="text"
                                        value={materialForm.name || ''}
                                        onChange={(e) => setMaterialForm({ ...materialForm, name: e.target.value })}
                                        className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-2 text-white placeholder:text-slate-600"
                                        placeholder={materialForm.type === 'FOLDER' ? "e.g., Assignment Solutions" : "Enter file label"}
                                    />
                                </div>

                                {materialForm.type !== 'FOLDER' && !selectedFile && (
                                    <div>
                                        <label className="block text-sm font-bold text-slate-400 mb-2">Type (Auto-detected if file selected)</label>
                                        <select
                                            value={materialForm.type || 'DOCUMENT'}
                                            onChange={(e) => setMaterialForm({ ...materialForm, type: e.target.value as any })}
                                            className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-2 text-white"
                                        >
                                            <option value="VIDEO">Video</option>
                                            <option value="PDF">PDF</option>
                                            <option value="DOCUMENT">Document</option>
                                            <option value="IMAGE">Image</option>
                                        </select>
                                    </div>
                                )}

                                <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                                    <div className="flex items-center justify-between mb-3">
                                        <label className="text-sm font-bold text-white italic">Initial Permissions</label>
                                        <div className="flex items-center gap-2">
                                            <span className="text-[10px] text-slate-400">Public Access</span>
                                            <input
                                                type="checkbox"
                                                checked={materialForm.permissions?.isPublic}
                                                onChange={(e) => setMaterialForm({
                                                    ...materialForm,
                                                    permissions: { ...materialForm.permissions!, isPublic: e.target.checked }
                                                })}
                                                className="w-4 h-4 rounded border-white/10 bg-slate-800"
                                            />
                                        </div>
                                    </div>
                                    <select
                                        value={materialForm.permissions?.accessType || 'READ'}
                                        onChange={(e) => setMaterialForm({
                                            ...materialForm,
                                            permissions: { ...materialForm.permissions!, accessType: e.target.value as any }
                                        })}
                                        className="w-full bg-slate-800 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white"
                                    >
                                        <option value="READ">Read Only (Standard)</option>
                                        <option value="FULL">Full Access (Edit/Manage)</option>
                                    </select>
                                </div>

                                <div className="flex gap-3 pt-4">
                                    <button
                                        onClick={() => {
                                            setShowMaterialModal(false);
                                            setSelectedFile(null);
                                        }}
                                        className="flex-1 bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg font-bold"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleUploadMaterial}
                                        disabled={!materialForm.name}
                                        className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg font-bold flex items-center justify-center gap-2"
                                    >
                                        {materialForm.type === 'FOLDER' ? <FolderPlus size={16} /> : <Upload size={16} />}
                                        {materialForm.type === 'FOLDER' ? 'Create' : 'Upload'}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </AdvancedModuleLayout >
    );
}
