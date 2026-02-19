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
    Play,
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
    RefreshCw,
} from 'lucide-react';
import api from '@/lib/api';

// ========== INTERFACES ==========
interface Course {
    id: string;
    title: string;
    description: string;
    category?: string;
    tech?: string;
    level: string;
    duration: string;
    price: number;
    instructor?: string;
    mentor?: string;
    rating: number;
    enrolledStudents: number;
    thumbnail?: string;
    image?: string;
    status?: string;
    active?: boolean;
    tags?: string[];
    modules?: string[];
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
    recordingUrl?: string;
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
    const [archivedRecordings, setArchivedRecordings] = useState<any[]>([]);

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
    const [showCourseModal, setShowCourseModal] = useState(false);
    const [showVideoModal, setShowVideoModal] = useState(false);
    const [selectedVideo, setSelectedVideo] = useState<any>(null);
    const [toastStatus, setToastStatus] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);

    const showToast = (msg: string, type: 'success' | 'error') => {
        setToastStatus({ type, msg });
        setTimeout(() => setToastStatus(null), 3000);
    };

    // Form states
    const [courseForm, setCourseForm] = useState<Partial<Course>>({});
    const [batchForm, setBatchForm] = useState<Partial<Batch>>({});
    const [sessionForm, setSessionForm] = useState<Partial<LiveSession>>({});
    const [materialForm, setMaterialForm] = useState<Partial<LearningMaterial>>({
        permissions: { studentIds: [], accessType: 'READ', isPublic: true }
    });
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isDragging, setIsDragging] = useState(false);

    // Sharing / Manage Recording State
    const [showShareModal, setShowShareModal] = useState(false);
    const [shareStep, setShareStep] = useState<'COURSE' | 'BATCH' | 'FOLDER' | 'CONFIRM'>('COURSE');
    const [shareData, setShareData] = useState<{
        courses: Course[],
        batches: Batch[],
        folders: LearningMaterial[],
        selectedCourse: Course | null,
        selectedBatch: Batch | null,
        selectedFolder: LearningMaterial | null
    }>({
        courses: [],
        batches: [],
        folders: [],
        selectedCourse: null,
        selectedBatch: null,
        selectedFolder: null
    });
    const [newFolderName, setNewFolderName] = useState("");
    const [isCreatingFolder, setIsCreatingFolder] = useState(false);
    const [recordingToDelete, setRecordingToDelete] = useState<any>(null);

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
            else console.error("Courses fetch failed:", coursesRes.reason);

            if (batchesRes.status === 'fulfilled') setBatches(batchesRes.value.data);
            else console.error("Batches fetch failed:", batchesRes.reason);

            if (sessionsRes.status === 'fulfilled') setSessions(sessionsRes.value.data);
            else console.error("Sessions fetch failed:", sessionsRes.reason);

            if (assignmentsRes.status === 'fulfilled') setAssignments(assignmentsRes.value.data);
            else console.error("Assignments fetch failed:", assignmentsRes.reason);

            if (studentsRes.status === 'fulfilled') setStudents(studentsRes.value.data);
            else console.error("Students fetch failed:", studentsRes.reason);

            if (trainersRes.status === 'fulfilled') setTrainers(trainersRes.value.data);
            else console.error("Trainers fetch failed:", trainersRes.reason);

            if (materialsRes.status === 'fulfilled') setMaterials(materialsRes.value.data || []);
            else console.error("Materials fetch failed:", materialsRes.reason);

            // Derive recordings from backend sessions
            const allSessions = sessionsRes.status === 'fulfilled' ? sessionsRes.value.data : [];
            const backendRecordings = allSessions
                .filter((s: LiveSession) => s.recordingUrl || s.status === 'COMPLETED')
                .map((s: LiveSession) => ({
                    id: s.id,
                    title: s.title,
                    batchName: s.batchName,
                    date: typeof s.startTime === 'string' ? new Date(s.startTime).toLocaleDateString() : 'Recent',
                    duration: s.duration + ' mins',
                    mentorName: s.mentorName,
                    thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80',
                    url: s.recordingUrl,
                    videoUrl: s.recordingUrl
                }));

            // Load simulated recordings from localStorage (Bytecode Live)
            let localRecordings: any[] = [];
            if (typeof window !== 'undefined') {
                const stored = localStorage.getItem('bytecode_recordings');
                if (stored) {
                    localRecordings = JSON.parse(stored);
                }
            }

            // Merge and deduplicate (prefer local for simulated ones, backend for manual URLs)
            // We'll just concatenate for now as IDs might differ formats
            setArchivedRecordings([...localRecordings, ...backendRecordings]);

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
        const totalRevenue = courses.reduce((acc, c) => acc + ((c.price || 0) * (c.enrolledStudents || 0)), 0);
        const avgRating = courses.length > 0
            ? courses.reduce((acc, c) => acc + (c.rating || 0), 0) / courses.length
            : 0;

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
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    const formatDateForInput = (dateString: string) => {
        if (!dateString) return '';
        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) return '';
            return date.toISOString().split('T')[0];
        } catch (e) {
            return '';
        }
    };

    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    };

    const generateMeetingLink = (platform: string) => {
        const id = Math.random().toString(36).substring(2, 12);
        // Always generate internal Bytecode Live link
        return `${window.location.origin}/live/${id}`;
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
                showToast("Please select a course for this batch.", 'error');
                return;
            }

            await api.post('academic/batches', payload);
            fetchAllData();
            setShowBatchModal(false);
            setBatchForm({});
            showToast("Batch created successfully!", 'success');
        } catch (error: any) {
            console.error("Failed to create batch:", error);
            const errMsg = error.response?.data || "Failed to create batch.";
            showToast(typeof errMsg === 'string' ? errMsg : JSON.stringify(errMsg), 'error');
        }
    };

    const handleUpdateBatch = async () => {
        if (!batchForm.id) return;
        try {
            await api.put(`academic/batches/${batchForm.id}`, batchForm);
            fetchAllData();
            setShowBatchModal(false);
            setBatchForm({});
            showToast("Batch updated successfully!", 'success');
        } catch (error: any) {
            console.error("Failed to update batch:", error);
            const errMsg = error.response?.data || "Failed to update batch.";
            showToast(typeof errMsg === 'string' ? errMsg : JSON.stringify(errMsg), 'error');
        }
    };

    const handleDeleteBatch = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (confirm("Are you sure you want to delete this batch? All sessions and student assignments for this batch will be lost.")) {
            try {
                await api.delete(`academic/batches/${id}`);
                fetchAllData();
                if (selectedBatch?.id === id) setSelectedBatch(null);
                showToast("Batch deleted successfully!", 'success');
            } catch (error: any) {
                console.error("Failed to delete batch:", error);
                const errMsg = error.response?.data || "Failed to delete batch.";
                showToast(typeof errMsg === 'string' ? errMsg : JSON.stringify(errMsg), 'error');
            }
        }
    };

    const handleAssignStudent = async (studentId: string) => {
        if (!selectedBatch) return;
        try {
            const updatedStudents = [...(selectedBatch.studentIds || []), studentId];
            const updatedBatch = {
                ...selectedBatch,
                studentIds: updatedStudents,
                totalStudents: updatedStudents.length
            };
            await api.put(`academic/batches/${selectedBatch.id}`, updatedBatch);
            setSelectedBatch(updatedBatch);
            fetchAllData();
            showToast("Student assigned successfully!", 'success');
        } catch (error) {
            console.error("Failed to assign student:", error);
            showToast("Failed to assign student.", 'error');
        }
    };

    const handleRemoveStudent = async (studentId: string) => {
        if (!selectedBatch) return;
        try {
            const updatedStudents = selectedBatch.studentIds.filter(id => id !== studentId);
            const updatedBatch = {
                ...selectedBatch,
                studentIds: updatedStudents,
                totalStudents: updatedStudents.length
            };
            await api.put(`academic/batches/${selectedBatch.id}`, updatedBatch);
            setSelectedBatch(updatedBatch);
            fetchAllData();
            showToast("Student removed successfully!", 'success');
        } catch (error) {
            console.error("Failed to remove student:", error);
            showToast("Failed to remove student.", 'error');
        }
    };

    const handleSaveSession = async () => {
        try {
            if (sessionForm.id) {
                await api.put(`academic/sessions/${sessionForm.id}`, sessionForm);
                showToast("Session updated successfully!", 'success');
            } else {
                const res = await api.post('academic/sessions', { ...sessionForm, batchId: selectedBatch?.id });
                const createdSession = res.data;

                if (sessionForm.platform === 'BYTECODE_LIVE') {
                    const updatedSession = {
                        ...createdSession,
                        meetingLink: `${window.location.origin}/live/${createdSession.id}`
                    };
                    await api.put(`academic/sessions/${createdSession.id}`, updatedSession);
                }
                showToast("Session scheduled successfully!", 'success');
            }

            fetchAllData();
            setShowSessionModal(false);
            setSessionForm({});
        } catch (error) {
            console.error("Failed to save session:", error);
            showToast("Failed to save session.", 'error');
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

    const handleSaveCourse = async () => {
        try {
            if (courseForm.id) {
                await api.put(`courses/${courseForm.id}`, courseForm);
            } else {
                await api.post('courses', {
                    ...courseForm,
                    active: true,
                    rating: 0,
                    enrolledStudents: 0
                });
            }
            fetchAllData();
            setShowCourseModal(false);
            setCourseForm({});
            showToast(courseForm.id ? "Course updated successfully!" : "Course created successfully!", 'success');
        } catch (error: any) {
            console.error("Failed to save course:", error);
            const errMsg = error.response?.data || "Failed to save course.";
            showToast(typeof errMsg === 'string' ? errMsg : JSON.stringify(errMsg), 'error');
        }
    };

    const handleDeleteCourse = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (confirm("Are you sure you want to delete this course? This action cannot be undone.")) {
            try {
                await api.delete(`courses/${id}`);
                fetchAllData();
                showToast("Course deleted successfully!", 'success');
            } catch (error: any) {
                console.error("Failed to delete course:", error);
                const errMsg = error.response?.data || "Failed to delete course.";
                showToast(typeof errMsg === 'string' ? errMsg : JSON.stringify(errMsg), 'error');
            }
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

    // Recording Management Functions
    const handleDeleteRecording = (rec: any) => {
        setRecordingToDelete(rec);
        // We will execute the actual delete logic in a new function `executeRecordingDeletion`
        // which will be called by the modal's confirm button.
        // For now, let's assume we have a `showDeleteConfirm` state or we can infer it
        // from `recordingToDelete` not being null if we use that to show the modal.
    };

    const executeRecordingDeletion = async () => {
        if (!recordingToDelete) return;

        // Check if it's a local recording (starts with REC-)
        if (recordingToDelete.id.toString().startsWith('REC-')) {
            const stored = JSON.parse(localStorage.getItem('bytecode_recordings') || '[]');
            const updated = stored.filter((r: any) => r.id !== recordingToDelete.id);
            localStorage.setItem('bytecode_recordings', JSON.stringify(updated));
            setArchivedRecordings(prev => prev.filter(r => r.id !== recordingToDelete.id));
            showToast('success', 'Recording deleted from local storage.');
        } else {
            // It's a backend recording - in a real app we'd call an API
            try {
                // Simulate API call
                await new Promise(resolve => setTimeout(resolve, 500));
                // await api.put(`academic/sessions/${recordingToDelete.id}`, { recordingUrl: '' });

                // For now, just remove from UI
                setArchivedRecordings(prev => prev.filter(r => r.id !== recordingToDelete.id));
                showToast('success', 'Recording deleted successfully.');
            } catch (error) {
                console.error("Delete failed", error);
                showToast('error', 'Failed to delete recording.');
            }
        }
        setRecordingToDelete(null);
    };

    const handleShareClick = async (recording: any) => {
        setSelectedVideo(recording); // Reuse selectedVideo for current recording context
        setShowShareModal(true);
        setShareStep('COURSE');

        // Use existing courses data
        setShareData(prev => ({ ...prev, courses: courses, batches: [], folders: [] }));
    };

    const handleCourseSelect = (course: Course) => {
        setShareData(prev => ({ ...prev, selectedCourse: course }));
        // Filter existing batches for this course
        const relevantBatches = batches.filter(b => b.courseId === course.id);
        setShareData(prev => ({ ...prev, batches: relevantBatches }));
        setShareStep('BATCH');
    };

    const handleBatchSelect = async (batch: Batch) => {
        setShareData(prev => ({ ...prev, selectedBatch: batch }));
        try {
            // Fetch folders for this batch
            const res = await api.get(`academic/materials?batchId=${batch.id}`);
            const batchFolders = (res.data || []).filter((m: LearningMaterial) => m.type === 'FOLDER');
            setShareData(prev => ({ ...prev, folders: batchFolders }));
            setShareStep('FOLDER');
        } catch (error) {
            setShareData(prev => ({ ...prev, folders: [] }));
            setShareStep('FOLDER');
        }
    };

    const handleCreateFolder = async () => {
        if (!newFolderName.trim() || !shareData.selectedBatch) return;

        try {
            const payload = {
                batchId: shareData.selectedBatch.id,
                name: newFolderName,
                type: 'FOLDER',
                uploadedBy: 'Admin',
                uploadedAt: new Date().toISOString(),
                permissions: { studentIds: [], accessType: 'READ', isPublic: true }
            };

            const res = await api.post('academic/materials', payload);
            const newFolder = res.data;

            setShareData(prev => ({
                ...prev,
                folders: [...prev.folders, newFolder],
                selectedFolder: newFolder
            }));
            setNewFolderName("");
            setIsCreatingFolder(false);
        } catch (error) {
            console.error("Failed to create folder", error);
        }
    };

    const handleConfirmShare = async () => {
        // In a real app, this would verify the move/copy of the video to the folder
        // Since we are simulating URL linkage:
        showToast(`Recording linked to ${shareData.selectedCourse?.title} > ${shareData.selectedBatch?.batchName}`, 'success');
        setShowShareModal(false);
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
                    { id: 'recordings', label: 'Recordings', icon: PlayCircle },
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
                { id: 'recordings', label: 'Recordings', icon: PlayCircle },
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
                                <button
                                    onClick={() => {
                                        setCourseForm({});
                                        setShowCourseModal(true);
                                    }}
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2"
                                >
                                    <Plus size={16} /> Add Course
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {courses.map((course, i) => (
                                    <motion.div
                                        key={course.id || i}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.05 }}
                                        onClick={() => setSelectedCourse(course)}
                                        className="bg-slate-900/50 border border-white/5 rounded-2xl overflow-hidden hover:border-blue-500/50 transition-all group cursor-pointer"
                                    >
                                        <div className="relative h-40 bg-gradient-to-br from-blue-500/20 to-violet-600/20 group">
                                            {course.thumbnail ? (
                                                <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <BookOpen size={48} className="text-white/20" />
                                                </div>
                                            )}
                                            <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setCourseForm(course);
                                                        setShowCourseModal(true);
                                                    }}
                                                    className="p-1.5 bg-slate-900/80 rounded-lg text-blue-400 hover:text-white backdrop-blur-sm"
                                                    title="Edit Course"
                                                >
                                                    <Edit size={14} />
                                                </button>
                                                <button
                                                    onClick={(e) => handleDeleteCourse(course.id, e)}
                                                    className="p-1.5 bg-slate-900/80 rounded-lg text-red-400 hover:text-white backdrop-blur-sm"
                                                    title="Delete Course"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
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
                                            <div className="flex items-center gap-2">
                                                <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setBatchForm({
                                                                ...batch,
                                                                startDate: formatDateForInput(batch.startDate),
                                                                endDate: formatDateForInput(batch.endDate)
                                                            });
                                                            setShowBatchModal(true);
                                                        }}
                                                        className="p-1.5 hover:bg-blue-500/20 rounded text-blue-400 border border-transparent hover:border-blue-500/20"
                                                    >
                                                        <Edit size={14} />
                                                    </button>
                                                    <button
                                                        onClick={(e) => handleDeleteBatch(batch.id, e)}
                                                        className="p-1.5 hover:bg-red-500/20 rounded text-red-400 border border-transparent hover:border-red-500/20"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                                <span className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase border ${getStatusColor(batch.status)}`}>
                                                    {batch.status}
                                                </span>
                                            </div>
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
                                ).map((batch, i) => (
                                    <motion.div
                                        key={batch.id || i}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        onClick={() => setSelectedBatch(batch)}
                                        className="bg-slate-900/50 border border-white/5 rounded-2xl p-5 hover:border-blue-500/50 transition-all group cursor-pointer relative overflow-hidden"
                                    >
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-white">
                                                <Users size={24} />
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setBatchForm({
                                                                ...batch,
                                                                startDate: formatDateForInput(batch.startDate),
                                                                endDate: formatDateForInput(batch.endDate)
                                                            });
                                                            setShowBatchModal(true);
                                                        }}
                                                        className="p-1.5 hover:bg-blue-500/20 rounded text-blue-400 border border-transparent hover:border-blue-500/20"
                                                    >
                                                        <Edit size={14} />
                                                    </button>
                                                    <button
                                                        onClick={(e) => handleDeleteBatch(batch.id, e)}
                                                        className="p-1.5 hover:bg-red-500/20 rounded text-red-400 border border-transparent hover:border-red-500/20"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                                <span className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase border ${getStatusColor(batch.status)}`}>
                                                    {batch.status}
                                                </span>
                                            </div>
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
                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => {
                                                setBatchForm({
                                                    ...selectedBatch,
                                                    startDate: formatDateForInput(selectedBatch.startDate),
                                                    endDate: formatDateForInput(selectedBatch.endDate)
                                                });
                                                setShowBatchModal(true);
                                            }}
                                            className="bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-500/20 px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2"
                                        >
                                            <Edit size={16} /> Edit Batch
                                        </button>
                                        <button
                                            onClick={(e) => handleDeleteBatch(selectedBatch.id, e)}
                                            className="bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-500/20 px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2"
                                        >
                                            <Trash2 size={16} /> Delete
                                        </button>
                                    </div>
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
                                        {students.filter(s => selectedBatch.studentIds?.includes(s.id)).map((student, i) => (
                                            <div key={student.id || i} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
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
                                        {batchSessions.map((session, i) => (
                                            <div key={session.id || i} className="p-3 bg-white/5 rounded-lg group hover:bg-white/10 transition-colors cursor-pointer"
                                                onClick={() => {
                                                    setSessionForm(session);
                                                    setShowSessionModal(true);
                                                }}>
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
                                    {batchMaterials.map((material, i) => (
                                        <div
                                            key={material.id || i}
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
                        ).map((session, i) => (
                            <motion.div
                                key={session.id || i}
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
                                <h3 className="text-lg font-bold text-white mb-1 group-hover:text-violet-400 cursor-pointer" onClick={() => { setSessionForm(session); setShowSessionModal(true); }}>{session.title}</h3>
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
                                        <span>Mentor: {session.mentorName || 'Not Assigned'}</span>
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
                                onClick={() => {
                                    if (material.type === 'VIDEO') {
                                        setSelectedVideo({
                                            title: material.name,
                                            batchName: 'Resource Library',
                                            duration: 'Resource',
                                            date: 'Added Recently',
                                            mentorName: 'Bytecode Intelligence'
                                        });
                                        setShowVideoModal(true);
                                    }
                                }}
                                className={`bg-slate-900/50 border border-white/5 rounded-2xl p-4 hover:border-amber-500/50 transition-all group text-center ${material.type === 'VIDEO' ? 'cursor-pointer' : 'cursor-default'}`}
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

            {/* ========== RECORDINGS TAB ========== */}
            {activeTab === 'recordings' && (
                <div className="space-y-6">
                    <div className="flex justify-between items-center bg-slate-900/40 border border-white/5 p-6 rounded-2xl">
                        <div className="relative w-96">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                            <input
                                type="text"
                                placeholder="Search recordings by topic or batch..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-12 pr-6 text-sm text-white focus:outline-none focus:border-red-500 transition-all font-bold"
                            />
                        </div>
                        <div className="flex gap-4">
                            <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs font-bold text-slate-400 flex items-center gap-2 uppercase tracking-widest">
                                <Clock size={14} /> {archivedRecordings.length} Total Archives
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {archivedRecordings.filter(rec =>
                            rec.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            rec.batchName.toLowerCase().includes(searchQuery.toLowerCase())
                        ).length === 0 ? (
                            <div className="col-span-full flex flex-col items-center justify-center py-20 bg-white/5 rounded-3xl border border-dashed border-white/10">
                                <div className="w-20 h-20 rounded-full bg-slate-800 flex items-center justify-center mb-4">
                                    <Video className="text-slate-600" size={32} />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2 uppercase font-[Rajdhani]">No Recordings Found</h3>
                                <p className="text-sm text-slate-500">Recordings started in the live room will appear here automatically.</p>
                            </div>
                        ) : archivedRecordings.filter(rec =>
                            rec.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            rec.batchName.toLowerCase().includes(searchQuery.toLowerCase())
                        ).map((rec, i) => (
                            <motion.div
                                key={rec.id || i}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: i * 0.1 }}
                                onClick={() => {
                                    setSelectedVideo(rec);
                                    setShowVideoModal(true);
                                }}
                                className="group bg-slate-900/50 border border-white/5 rounded-2xl p-5 hover:border-red-500/30 transition-all cursor-pointer relative overflow-hidden flex flex-col"
                            >
                                <div className="aspect-video bg-black rounded-xl mb-4 relative overflow-hidden border border-white/5 group-hover:border-red-500/20 transition-all shadow-2xl">
                                    <img
                                        src={rec.thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80'}
                                        alt={rec.title}
                                        className="w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-700"
                                    />
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <div className="flex gap-4">
                                            <button
                                                onClick={(e) => handleDeleteRecording(rec)}
                                                className="w-10 h-10 rounded-full bg-slate-900/80 text-red-500 hover:bg-red-600 hover:text-white flex items-center justify-center transition-all transform hover:scale-110"
                                                title="Delete Recording"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setSelectedVideo(rec);
                                                    setShowVideoModal(true);
                                                }}
                                                className="w-16 h-16 rounded-full bg-red-600 text-white flex items-center justify-center shadow-lg shadow-red-500/40 hover:scale-110 transition-transform"
                                            >
                                                <PlayCircle size={32} fill="currentColor" />
                                            </button>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); handleShareClick(rec); }}
                                                className="w-10 h-10 rounded-full bg-slate-900/80 text-blue-400 hover:bg-blue-600 hover:text-white flex items-center justify-center transition-all transform hover:scale-110"
                                                title="Share / Manage"
                                            >
                                                <FolderPlus size={18} />
                                            </button>
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
                                {students.filter(s => !selectedBatch.studentIds?.includes(s.id)).map((student, i) => (
                                    <div key={student.id || i} className="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10">
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

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
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
                                            className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-2 text-white"
                                        >
                                            <option value="BYTECODE_LIVE">Bytecode Live (Internal)</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-400 mb-2">Meeting Link</label>
                                        <div className="flex gap-2">
                                            <input
                                                type="url"
                                                value={sessionForm.meetingLink || ''}
                                                onChange={(e) => setSessionForm({ ...sessionForm, meetingLink: e.target.value })}
                                                className="flex-1 bg-slate-800 border border-white/10 rounded-lg px-4 py-2 text-white text-sm"
                                                placeholder="Link will be auto-generated..."
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setSessionForm({
                                                    ...sessionForm,
                                                    meetingLink: generateMeetingLink(sessionForm.platform || 'BYTECODE_LIVE')
                                                })}
                                                className="bg-white/5 border border-white/10 hover:bg-white/10 text-white px-3 rounded-lg transition-colors"
                                                title="Re-generate link"
                                            >
                                                <RefreshCw size={14} />
                                            </button>
                                        </div>
                                    </div>
                                </div>

                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-400 mb-2">Recording URL (Optional)</label>
                                <input
                                    type="url"
                                    value={sessionForm.recordingUrl || ''}
                                    onChange={(e) => setSessionForm({ ...sessionForm, recordingUrl: e.target.value })}
                                    className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-2 text-white"
                                    placeholder="Enter secure recording URL..."
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-slate-400 mb-2">Status</label>
                                    <select
                                        value={sessionForm.status || 'UPCOMING'}
                                        onChange={(e) => setSessionForm({ ...sessionForm, status: e.target.value })}
                                        className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-2 text-white"
                                    >
                                        <option value="UPCOMING">Upcoming</option>
                                        <option value="ONGOING">Live / Ongoing</option>
                                        <option value="COMPLETED">Completed</option>
                                        <option value="CANCELLED">Cancelled</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-400 mb-2">Mentor / Instructor</label>
                                    <select
                                        value={sessionForm.mentorName || ''}
                                        onChange={(e) => setSessionForm({ ...sessionForm, mentorName: e.target.value })}
                                        className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-2 text-white"
                                    >
                                        <option value="">Select a Mentor</option>
                                        <option value="Koushik Krishna">Koushik Krishna (Me)</option>
                                        {trainers.map((trainer, i) => (
                                            <option key={trainer.id || i} value={trainer.fullName}>
                                                {trainer.fullName}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="flex gap-3 pt-4">
                                    <button
                                        onClick={() => setShowSessionModal(false)}
                                        className="flex-1 bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg font-bold"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleSaveSession}
                                        className="flex-1 bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-lg font-bold flex items-center justify-center gap-2"
                                    >
                                        <Save size={16} /> {sessionForm.id ? 'Update Session' : 'Schedule'}
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

            {/* Course Modal */}
            <AnimatePresence>
                {showCourseModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                        onClick={() => setShowCourseModal(false)}
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
                                    {courseForm.id ? 'Edit Course' : 'Add New Course'}
                                </h3>
                                <button onClick={() => setShowCourseModal(false)} className="text-slate-400 hover:text-white">
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-bold text-slate-400 mb-2">Course Title</label>
                                    <input
                                        type="text"
                                        value={courseForm.title || ''}
                                        onChange={(e) => setCourseForm({ ...courseForm, title: e.target.value })}
                                        className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-2 text-white"
                                        placeholder="e.g., Python Masterclass"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-bold text-slate-400 mb-2">Category / Tech</label>
                                        <input
                                            type="text"
                                            value={courseForm.tech || ''}
                                            onChange={(e) => setCourseForm({ ...courseForm, tech: e.target.value })}
                                            className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-2 text-white"
                                            placeholder="e.g., Full Stack"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-400 mb-2">Level</label>
                                        <select
                                            value={courseForm.level || 'Beginner'}
                                            onChange={(e) => setCourseForm({ ...courseForm, level: e.target.value })}
                                            className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-2 text-white"
                                        >
                                            <option value="Beginner">Beginner</option>
                                            <option value="Intermediate">Intermediate</option>
                                            <option value="Advanced">Advanced</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-bold text-slate-400 mb-2">Duration</label>
                                        <input
                                            type="text"
                                            value={courseForm.duration || ''}
                                            onChange={(e) => setCourseForm({ ...courseForm, duration: e.target.value })}
                                            className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-2 text-white"
                                            placeholder="e.g., 6 Months"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-400 mb-2">Price (₹)</label>
                                        <input
                                            type="number"
                                            value={courseForm.price || ''}
                                            onChange={(e) => setCourseForm({ ...courseForm, price: parseFloat(e.target.value) })}
                                            className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-2 text-white"
                                            placeholder="e.g., 49999"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-slate-400 mb-2">Description</label>
                                    <textarea
                                        value={courseForm.description || ''}
                                        onChange={(e) => setCourseForm({ ...courseForm, description: e.target.value })}
                                        className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-2 text-white h-24"
                                        placeholder="Course description..."
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-slate-400 mb-2">Thumbnail URL</label>
                                    <input
                                        type="text"
                                        value={courseForm.thumbnail || courseForm.image || ''}
                                        onChange={(e) => setCourseForm({ ...courseForm, image: e.target.value, thumbnail: e.target.value })}
                                        className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-2 text-white"
                                        placeholder="https://..."
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-slate-400 mb-2">Instructor / Mentor</label>
                                    <select
                                        value={courseForm.mentor || courseForm.instructor || ''}
                                        onChange={(e) => setCourseForm({ ...courseForm, mentor: e.target.value, instructor: e.target.value })}
                                        className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-2 text-white"
                                    >
                                        <option value="">Select Instructor</option>
                                        {trainers.map((trainer, i) => (
                                            <option key={trainer.id || i} value={trainer.fullName}>
                                                {trainer.fullName} {trainer.specialization ? `(${trainer.specialization})` : ''}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="flex gap-3 pt-4">
                                    <button
                                        onClick={() => setShowCourseModal(false)}
                                        className="flex-1 bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg font-bold"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleSaveCourse}
                                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-bold flex items-center justify-center gap-2"
                                    >
                                        <Save size={16} /> {courseForm.id ? 'Update Course' : 'Create Course'}
                                    </button>
                                </div>
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

            {/* Delete Confirmation Modal */}
            <AnimatePresence>
                {recordingToDelete && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                        onClick={() => setRecordingToDelete(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.95, y: 20 }}
                            className="bg-slate-900 border border-white/10 rounded-2xl p-6 w-full max-w-sm text-center shadow-2xl shadow-red-500/10"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4 text-red-500">
                                <Trash2 size={32} />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Delete Recording?</h3>
                            <p className="text-slate-400 mb-6 text-sm">
                                Are you sure you want to delete <span className="text-white font-bold">"{recordingToDelete.title}"</span>? This action cannot be undone.
                            </p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setRecordingToDelete(null)}
                                    className="flex-1 bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg font-bold transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={executeRecordingDeletion}
                                    className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-bold flex items-center justify-center gap-2 transition-colors shadow-lg shadow-red-600/20"
                                >
                                    Delete
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <Toast status={toastStatus} onClose={() => setToastStatus(null)} />

            {/* Share / Manage Recording Modal */}
            <AnimatePresence>
                {showShareModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
                        onClick={() => setShowShareModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            className="bg-[#0f1115] border border-white/10 rounded-3xl p-6 w-full max-w-lg shadow-2xl relative overflow-hidden"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                    <FolderPlus size={20} className="text-blue-500" />
                                    Manage Recording
                                </h3>
                                <button onClick={() => setShowShareModal(false)} className="text-slate-500 hover:text-white transition-colors"><X size={20} /></button>
                            </div>

                            {/* Stepper Header */}
                            <div className="flex items-center gap-2 mb-6 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                                <span className={shareStep === 'COURSE' ? 'text-blue-400' : ''}>Course</span>
                                <ChevronRight size={10} />
                                <span className={shareStep === 'BATCH' ? 'text-blue-400' : ''}>Batch</span>
                                <ChevronRight size={10} />
                                <span className={shareStep === 'FOLDER' ? 'text-blue-400' : ''}>Folder</span>
                            </div>

                            <div className="min-h-[300px]">
                                {shareStep === 'COURSE' && (
                                    <div className="space-y-2">
                                        <p className="text-sm text-slate-400 mb-4">Select a course to organize this recording:</p>
                                        <div className="space-y-2 max-h-[300px] overflow-y-auto custom-scrollbar">
                                            {shareData.courses.map(course => (
                                                <button
                                                    key={course.id}
                                                    onClick={() => handleCourseSelect(course)}
                                                    className="w-full text-left p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-blue-500/30 transition-all flex items-center justify-between group"
                                                >
                                                    <span className="font-bold text-slate-200 group-hover:text-white">{course.title}</span>
                                                    <ChevronRight size={16} className="text-slate-600 group-hover:text-blue-400" />
                                                </button>
                                            ))}
                                            {shareData.courses.length === 0 && <div className="text-center text-slate-500 py-10">No courses available</div>}
                                        </div>
                                    </div>
                                )}

                                {shareStep === 'BATCH' && (
                                    <div className="space-y-2">
                                        <button onClick={() => setShareStep('COURSE')} className="text-xs text-slate-500 hover:text-white flex items-center gap-1 mb-4"><ChevronRight size={12} className="rotate-180" /> Back to Courses</button>
                                        <p className="text-sm text-slate-400 mb-2">Select Batch in <span className="text-blue-400 font-bold">{shareData.selectedCourse?.title}</span>:</p>
                                        <div className="space-y-2 max-h-[250px] overflow-y-auto custom-scrollbar">
                                            {shareData.batches.map(batch => (
                                                <button
                                                    key={batch.id}
                                                    onClick={() => handleBatchSelect(batch)}
                                                    className="w-full text-left p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-blue-500/30 transition-all flex items-center justify-between group"
                                                >
                                                    <span className="font-bold text-slate-200 group-hover:text-white">{batch.batchName}</span>
                                                    <ChevronRight size={16} className="text-slate-600 group-hover:text-blue-400" />
                                                </button>
                                            ))}
                                            {shareData.batches.length === 0 && <div className="text-center text-slate-500 py-10">No batches found</div>}
                                        </div>
                                    </div>
                                )}

                                {shareStep === 'FOLDER' && (
                                    <div className="space-y-2">
                                        <button onClick={() => setShareStep('BATCH')} className="text-xs text-slate-500 hover:text-white flex items-center gap-1 mb-4"><ChevronRight size={12} className="rotate-180" /> Back to Batches</button>
                                        <p className="text-sm text-slate-400 mb-2">Select Folder in <span className="text-blue-400 font-bold">{shareData.selectedBatch?.batchName}</span>:</p>

                                        <div className="space-y-2 max-h-[200px] overflow-y-auto custom-scrollbar mb-4">
                                            <button
                                                onClick={() => { setShareData(prev => ({ ...prev, selectedFolder: null })); handleConfirmShare(); }}
                                                className="w-full text-left p-3 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 transition-all flex items-center gap-3"
                                            >
                                                <FolderPlus size={18} />
                                                <span className="font-bold">Save to Root Directory</span>
                                            </button>
                                            {shareData.folders.map(folder => (
                                                <button
                                                    key={folder.id}
                                                    onClick={() => { setShareData(prev => ({ ...prev, selectedFolder: folder })); handleConfirmShare(); }}
                                                    className="w-full text-left p-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 transition-all flex items-center gap-3"
                                                >
                                                    <div className="text-amber-400"><FolderPlus size={18} /></div>
                                                    <span className="font-bold text-slate-300">{folder.name}</span>
                                                </button>
                                            ))}
                                        </div>

                                        {/* Create New Folder */}
                                        <div className="pt-4 border-t border-white/5">
                                            <div className="flex gap-2">
                                                <input
                                                    type="text"
                                                    placeholder="Create new folder..."
                                                    value={newFolderName}
                                                    onChange={(e) => setNewFolderName(e.target.value)}
                                                    className="flex-1 bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                                                />
                                                <button
                                                    onClick={handleCreateFolder}
                                                    className="bg-white/10 hover:bg-white/20 text-white px-3 py-2 rounded-lg"
                                                >
                                                    <Plus size={18} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </AdvancedModuleLayout >
    );
}
