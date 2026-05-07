"use client";
import { API_URLS } from '@/lib/api-config';


import DashboardLayout from '@/components/DashboardLayout';
import { motion, AnimatePresence } from 'framer-motion';
import React, { useState, useEffect, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
    Book, Plus, Search, Edit2, Trash2,
    Layers, Users, Clock, User, BookOpen,
    ChevronRight, ChevronLeft, Folder, File,
    Download, Upload, Eye, MoreVertical,
    CheckCircle, Calendar, Play, FileText,
    ExternalLink, Share2, Lock, Globe, AlertTriangle,
    Settings, HardDrive, Filter, XCircle, MinusCircle,
    ShieldCheck, UserPlus, Send, Video, LayoutTemplate, FolderPlus, X, Paperclip, Shield,
    Zap, Activity, Terminal, BarChart2, Monitor, Bot, MessageSquare, Home, FolderOpen
} from 'lucide-react';
import ExamManagement from '@/components/Academic/Exams/ExamManagement';
import AcademicAnalytics from '@/components/Academic/AcademicAnalytics';
import MockInterviewEngine from '@/components/Academic/MockInterviews/MockInterviewEngine';
import { fetchJsonSafe } from '@/lib/fetchJson';

type DashboardRole = 'super_admin' | 'admin' | 'tutor' | 'student';

export function AcademicHubPage(props: { role?: DashboardRole }) {
    return (
        <Suspense fallback={<div>Loading Academic Hub...</div>}>
            <AcademicHubPageContent {...props} />
        </Suspense>
    );
}

function AcademicHubPageContent({ role = 'super_admin' }: { role?: DashboardRole } = {}) {
    const router = useRouter();
    const [viewMode, setViewMode] = useState<'COURSES' | 'BATCHES' | 'DETAILS' | 'EXAMS' | 'ANALYTICS'>('COURSES');
    const [batchTab, setBatchTab] = useState<'DRIVE' | 'LIVE' | 'RECORDINGS' | 'ASSIGNMENTS' | 'TRACKING'>('DRIVE');
    const [courses, setCourses] = useState<any[]>([]);
    const [batches, setBatches] = useState<any[]>([]);
    const [studentTracking, setStudentTracking] = useState<any[]>([]);
    const [allUsers, setAllUsers] = useState<any[]>([]);
    const [liveSessions, setLiveSessions] = useState<any[]>([]);
    const [sessionRequests, setSessionRequests] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentUser, setCurrentUser] = useState<any>(null);

    // Selection state
    const [selectedCourse, setSelectedCourse] = useState<any>(null);
    const [selectedBatch, setSelectedBatch] = useState<any>(null);
    const [selectedFolder, setSelectedFolder] = useState<any>(null);

    // Modals
    const [isCreateCourseOpen, setIsCreateCourseOpen] = useState(false);
    const [newCourse, setNewCourse] = useState({
        title: '', duration: '', price: 0, createdAt: new Date().toISOString().split('T')[0]
    });
    const [isCreateFolderOpen, setIsCreateFolderOpen] = useState(false);
    const [isCreateBatchOpen, setIsCreateBatchOpen] = useState(false);
    const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);
    const [isScheduleLiveModalOpen, setIsScheduleLiveModalOpen] = useState(false);
    const [isEditSessionModalOpen, setIsEditSessionModalOpen] = useState(false);
    const [editingSession, setEditingSession] = useState<any>(null);

    // --- Student Join Request Modal States ---
    const [isJoinRequestModalOpen, setIsJoinRequestModalOpen] = useState(false);
    const [selectedSessionForRequest, setSelectedSessionForRequest] = useState<any>(null);
    const [joinRequestForm, setJoinRequestForm] = useState({
        studentName: '', courseName: '', batchName: '', message: ''
    });

    const [newLiveSession, setNewLiveSession] = useState({
        title: '',
        startTime: '',
        endDate: '',
        durationHours: 1,
        durationMinutes: 0,
        tutorId: '',
        platform: 'Bytecode Meetings',
        meetingLink: '',
        recordingUrl: ''
    });
    const [isEditBatchOpen, setIsEditBatchOpen] = useState(false);
    const [editBatchData, setEditBatchData] = useState<any>(null);

    // --- Share Recording Modal Multi-step States ---
    const [isShareModalOpen, setIsShareModalOpen] = useState(false);
    const [shareTarget, setShareTarget] = useState<any>(null);
    const [shareStep, setShareStep] = useState(1); // 1: Select Course, 2: Select Batch, 3: Select Folder
    const [shareCurrentPath, setShareCurrentPath] = useState<string[]>([]);
    const [drivePath, setDrivePath] = useState<string[]>([]);
    const [allCourses, setAllCourses] = useState<any[]>([]);
    const [allBatchesForCourse, setAllBatchesForCourse] = useState<any[]>([]);
    const [shareSelectedCourse, setShareSelectedCourse] = useState<any>(null);
    const [shareSelectedBatch, setShareSelectedBatch] = useState<any>(null);
    const [shareNewFolderName, setShareNewFolderName] = useState('');
    const [isCreatingNewFolderInShare, setIsCreatingNewFolderInShare] = useState(false);
    const [newBatch, setNewBatch] = useState({
        batchCode: '', batchName: '', trainerId: '', startDate: '', endDate: '', status: 'UPCOMING',
        schedule: '', mode: 'ONLINE', branch: '', maxCapacity: 50, description: ''
    });
    const [newFolderName, setNewFolderName] = useState('');
    const [assignments, setAssignments] = useState<any[]>([]);
    const [isCreateAssignmentModalOpen, setIsCreateAssignmentModalOpen] = useState(false);
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
    const [sessionToDelete, setSessionToDelete] = useState<any>(null);
    const [newAssignment, setNewAssignment] = useState({
        title: '', description: '', attachments: [] as { name: string, url: string }[],
        difficulty: 'MEDIUM', instructions: '', status: 'ACTIVE',
        dueDate: '',
    });
    const [viewingAssignment, setViewingAssignment] = useState<any>(null);
    const [viewingSubmissionsAssignment, setViewingSubmissionsAssignment] = useState<any>(null);
    const [activeSubmission, setActiveSubmission] = useState<any>(null);
    const [gradingData, setGradingData] = useState({ marks: 0, feedback: '', status: 'ACCEPTED' });
    const [isEditAssignmentModalOpen, setIsEditAssignmentModalOpen] = useState(false);
    const [editingAssignment, setEditingAssignment] = useState<any>(null);
    const [sharingTarget, setSharingTarget] = useState<any>(null);
    const [userSearchTerm, setUserSearchTerm] = useState('');
    const [isTutorModalOpen, setIsTutorModalOpen] = useState(false);
    const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
    const [tutorSearchTerm, setTutorSearchTerm] = useState('');
    const [studentSearchTerm, setStudentSearchTerm] = useState('');
    const [trackingSearchTerm, setTrackingSearchTerm] = useState('');
    const [isStudentHistoryModalOpen, setIsStudentHistoryModalOpen] = useState(false);
    const [selectedStudentForHistory, setSelectedStudentForHistory] = useState<any>(null);
    const [isShareRecordingModalOpen, setIsShareRecordingModalOpen] = useState(false);
    const [sharingRecording, setSharingRecording] = useState<any>(null);
    const [renameTarget, setRenameTarget] = useState<{ type: 'folder' | 'file', oldName: string, folderName?: string } | null>(null);
    const [renameValue, setRenameValue] = useState('');
    const [viewFileTarget, setViewFileTarget] = useState<any>(null);

    const [recSearchTerm, setRecSearchTerm] = useState('');
    const [recCourseFilter, setRecCourseFilter] = useState('ALL');
    const [recBatchFilter, setRecBatchFilter] = useState('ALL');

    const [isAccessModalOpen, setIsAccessModalOpen] = useState(false);
    const [accessTarget, setAccessTarget] = useState<any>(null);
    const [accessSearchTerm, setAccessSearchTerm] = useState('');
    const [accessRole, setAccessRole] = useState('VIEWER');

    const [isRequestDetailModalOpen, setIsRequestDetailModalOpen] = useState(false);
    const [selectedRequestForDetail, setSelectedRequestForDetail] = useState<any>(null);

    // --- PREMIUM ALERT STATES ---
    const [alertConfig, setAlertConfig] = useState<{
        isOpen: boolean;
        title: string;
        message: string;
        type: 'DELETE' | 'INFO' | 'SUCCESS';
        onConfirm?: () => void;
    }>({ isOpen: false, title: '', message: '', type: 'INFO' });

    const [notification, setNotification] = useState<{ message: string, type: 'success' | 'error' | 'info' } | null>(null);

    const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 4000);
    };

    const confirmAction = (title: string, message: string, onConfirm: () => void, type: 'DELETE' | 'INFO' = 'DELETE') => {
        setAlertConfig({ isOpen: true, title, message, type, onConfirm });
    };

    const [searchTerm, setSearchTerm] = useState('');

    const fetchData = async () => {
        setLoading(true);
        const userId = currentUser?.id || currentUser?._id;
        const isStudent = currentUserRole === 'STUDENT';

        const batchUrl = isStudent
            ? `${API_URLS.LMS_BACKEND}/api/academic/batches/student/${userId}`
            : `${API_URLS.LMS_BACKEND}/api/academic/batches`;

        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        const headers: Record<string, string> = token ? { 'Authorization': `Bearer ${token}` } : {};

        const [cData, bData, uData, aData, sData, rData] = await Promise.all([
            fetchJsonSafe<any[]>(`${API_URLS.LMS_BACKEND}/api/courses`, { headers }),
            fetchJsonSafe<any[]>(batchUrl, { headers }),
            fetchJsonSafe<any[]>(`${API_URLS.LMS_BACKEND}/api/users`, { headers }),
            fetchJsonSafe<any[]>(`${API_URLS.LMS_BACKEND}/api/academic/assignments`, { headers }),
            fetchJsonSafe<any[]>(`${API_URLS.LMS_BACKEND}/api/academic/sessions`, { headers }),
            fetchJsonSafe<any[]>(`${API_URLS.LMS_BACKEND}/api/academic/session-requests`, { headers })
        ]);

        // REPORT ERRORS IF ANY
        const errors = [cData, bData, uData, aData, sData, rData].filter(d => !d.ok && d.error);
        if (errors.length > 0) {
            showToast(errors[0].error || "Data link unstable. Authorization required.", "error");
        }

        if (bData.ok && bData.data) {
            setBatches(bData.data);

            if (isStudent) {
                const assignedCourseIds = new Set(bData.data.map((b: any) => b.courseId));
                if (cData.ok && cData.data) {
                    const filteredCourses = cData.data.filter(c => assignedCourseIds.has(c.id) || assignedCourseIds.has(c._id));
                    setCourses(filteredCourses);
                }

                // AUTO-SELECT FIRST BATCH FOR STUDENT
                if (bData.data.length > 0) {
                    const firstBatch = bData.data[0];
                    setSelectedBatch(firstBatch);
                    setViewMode('DETAILS');

                    // Also select the course for this batch
                    if (cData.ok && cData.data) {
                        const course = cData.data.find(c => c.id === firstBatch.courseId || c._id === firstBatch.courseId);
                        if (course) setSelectedCourse(course);
                    }
                }

                const assignedBatchIds = new Set(bData.data.map((b: any) => b.id || b._id));
                if (sData.ok && sData.data) {
                    setLiveSessions(sData.data.filter(s => assignedBatchIds.has(s.batchId)));
                }
                if (aData.ok && aData.data) {
                    setAssignments(aData.data.filter(a => assignedBatchIds.has(a.batchId)));
                }
            } else {
                if (cData.ok && cData.data) setCourses(cData.data);
                if (sData.ok && sData.data) setLiveSessions(sData.data);
                if (aData.ok && aData.data) setAssignments(aData.data);
            }
        } else if (cData.ok && cData.data) {
            setCourses(cData.data);
        }

        if (uData.ok && uData.data) setAllUsers(uData.data);

        if (rData.ok && rData.data) {
            if (isStudent) {
                setSessionRequests(rData.data.filter(r => r.requestedById === userId));
            } else {
                setSessionRequests(rData.data);
            }
        }
        setLoading(false);
    };

    const handleJoinRequestSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentUser || !selectedSessionForRequest) return;

        const payload = {
            type: 'JOIN_SESSION',
            sessionId: selectedSessionForRequest.id || selectedSessionForRequest._id,
            requestedBy: joinRequestForm.studentName,
            requestedById: currentUser.id,
            data: {
                title: selectedSessionForRequest.title,
                courseName: joinRequestForm.courseName,
                batchName: joinRequestForm.batchName,
                message: joinRequestForm.message
            },
            status: 'PENDING',
            createdAt: new Date().toISOString()
        };

        const result = await fetchJsonSafe<any>(`${API_URLS.LMS_BACKEND}/api/academic/session-requests`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        if (result.ok && result.data) {
            setSessionRequests([result.data, ...sessionRequests]);
            setIsJoinRequestModalOpen(false);
            alert("Protocol Initialized: Access request sent to Command Center.");
        } else if (result.error) {
            console.error("Join request failed:", result.error);
        }
    };

    const searchParams = useSearchParams();
    const activeTabParam = searchParams.get('tab');

    useEffect(() => {
        if (currentUser) fetchData();
    }, [currentUser]);

    useEffect(() => {
        if (activeTabParam === 'TRACKING') {
            setBatchTab('TRACKING');
        } else if (activeTabParam === 'EXAMS') {
            setViewMode('EXAMS');
        } else if (activeTabParam === 'INTERVIEWS') {
            setViewMode('ANALYTICS');
        }
    }, [activeTabParam]);

    useEffect(() => {
        if (typeof window === 'undefined') return;
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                setCurrentUser(JSON.parse(storedUser));
            } catch (e) { console.error("Stored user parse error", e); }
        }
    }, []);

    const currentUserRole = String(currentUser?.role || role).toUpperCase();
    const isFullAdmin = currentUserRole === 'SUPER_ADMIN' || currentUserRole === 'ADMIN';

    const handleSessionRequestAction = async (requestId: string, action: 'APPROVED' | 'REJECTED') => {
        try {
            const reqData = sessionRequests.find(r => (r.id === requestId || r._id === requestId));
            const reviewerId = currentUser?.id || '';
            const reviewerName = currentUser?.fullName || 'Admin';

            const res = await fetch(`${API_URLS.LMS_BACKEND}/api/academic/session-requests/${requestId}/action`, {
                method: 'PUT',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ action, reviewerId, reviewerName })
            });

            if (res.ok) {
                // ADD NOTIFICATION FOR TUTOR
                if (reqData && reqData.requestedById) {
                    const isDownload = reqData.type === 'DOWNLOAD_RECORDING';
                    const titleText = isDownload ? `Recording Download ${action}` : `Request ${action}`;
                    let msgText = `Your request for "${reqData.data?.title || 'a session/recording'}" has been ${action.toLowerCase()} by ${reviewerName}.`;

                    if (isDownload && action === 'APPROVED') {
                        msgText = `Your download request for "${reqData.data?.title}" has been approved. You can now use this link: ${reqData.data?.recordingUrl}`;
                    }

                    await fetch(`${API_URLS.LMS_BACKEND}/api/academic/notifications`, {
                        method: 'POST',
                        headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                        body: JSON.stringify({
                            userId: reqData.requestedById,
                            title: titleText,
                            message: msgText,
                            type: action === 'APPROVED' ? 'SUCCESS' : 'ERROR'
                        })
                    });
                }
                alert(`Request has been ${action.toLowerCase()} successfully.`);
                fetchData();
            }
        } catch (e) {
            console.error("Action failed:", e);
        }
    };

    const handleDeleteRequest = async (requestId: string) => {
        const req = sessionRequests.find(r => (r.id === requestId || r._id === requestId));
        const isHistorical = req && req.status !== 'PENDING';

        const confirmMsg = isHistorical
            ? "Are you sure you want to delete this historical request log? This action is permanent."
            : "Are you sure you want to withdraw this request?";

        if (!confirm(confirmMsg)) return;

        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_URLS.LMS_BACKEND}/api/academic/session-requests/${requestId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                setSessionRequests(sessionRequests.filter(r => (r.id !== requestId && r._id !== requestId)));
                alert(isHistorical ? "Log entry deleted." : "Request withdrawn successfully.");
            }
        } catch (e) {
            console.error("Delete request failed:", e);
        }
    };

    useEffect(() => {
        const fetchTracking = async () => {
            if (batchTab === 'TRACKING' && selectedBatch) {
                try {
                    const token = localStorage.getItem('token');
                    const res = await fetch(`${API_URLS.LMS_BACKEND}/api/academic/batches/${selectedBatch.id || selectedBatch._id}/student-tracking`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    if (res.ok) setStudentTracking(await res.json());
                } catch (err) {
                    console.error(err);
                }
            }
        };
        fetchTracking();
    }, [batchTab, selectedBatch]);

    const handleCreateFolder = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newFolderName.trim()) return;

        const updatedBatch = { ...selectedBatch };
        const newFolder = {
            name: newFolderName,
            createdBy: "Super Admin",
            sharedWith: [],
            files: []
        };

        updatedBatch.folders = [...(updatedBatch.folders || []), newFolder];

        try {
            const res = await fetch(`${API_URLS.LMS_BACKEND}/api/academic/batches/${selectedBatch.id}`, {
                method: 'PUT',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(updatedBatch)
            });
            if (res.ok) {
                const savedBatch = await res.json();
                setSelectedBatch(savedBatch);
                setBatches(batches.map(b => b.id === savedBatch.id ? savedBatch : b));
                setIsCreateFolderOpen(false);
                setNewFolderName('');
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleUpdateSharing = async (user: any, role: string) => {
        if (!sharingTarget) return;

        const updatedFolders = selectedBatch.folders.map((f: any) => {
            if (f.name === sharingTarget.name) {
                const alreadyShared = f.sharedWith?.find((s: any) => s.userId === user.id);
                if (alreadyShared) {
                    return { ...f, sharedWith: f.sharedWith.map((s: any) => s.userId === user.id ? { ...s, role } : s) };
                } else {
                    return { ...f, sharedWith: [...(f.sharedWith || []), { userId: user.id, fullName: user.fullName, role }] };
                }
            }
            return f;
        });

        const updatedBatch = { ...selectedBatch, folders: updatedFolders };

        try {
            const res = await fetch(`${API_URLS.LMS_BACKEND}/api/academic/batches/${selectedBatch.id}`, {
                method: 'PUT',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(updatedBatch)
            });
            if (res.ok) {
                const savedBatch = await res.json();
                setSelectedBatch(savedBatch);
                setBatches(batches.map(b => b.id === savedBatch.id ? savedBatch : b));
                // Update local sharing target if open
                if (sharingTarget) {
                    const freshFolder = savedBatch.folders.find((f: any) => f.name === sharingTarget.name);
                    setSharingTarget(freshFolder);
                }
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleCreateCourse = async (e: React.FormEvent) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        if (!token || token === 'null' || token === 'undefined') {
            showToast("Session expired. Please login again.", "error");
            return;
        }

        try {
            const res = await fetch(`${API_URLS.LMS_BACKEND}/api/courses`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(newCourse)
            });
            if (res.ok) {
                const saved = await res.json();
                const courseData = saved.data || saved;
                setCourses([...courses, { ...courseData, id: courseData.id || courseData._id }]);
                setIsCreateCourseOpen(false);
                setNewCourse({ title: '', duration: '', price: 0, createdAt: new Date().toISOString().split('T')[0] });
                showToast("Course deployed to Module Drive.", "success");
            } else {
                const err = await res.json();
                showToast(err.error || "Failed to create course.", "error");
            }
        } catch (err) {
            showToast("Neural link failed. Network error.", "error");
        }
    };

    const handleCreateBatch = async (e: React.FormEvent) => {
        e.preventDefault();
        const selectedMentor = allUsers.find(u => u.id === newBatch.trainerId);
        const payload = {
            ...newBatch,
            courseId: selectedCourse?.id,
            courseName: selectedCourse?.title,
            trainerName: selectedMentor?.fullName,
            studentIds: [],
            totalStudents: 0,
            createdAt: new Date(),
            updatedAt: new Date()
        };

        try {
            const res = await fetch(`${API_URLS.LMS_BACKEND}/api/academic/batches`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(payload)
            });
            if (res.ok) {
                const saved = await res.json();
                setBatches([...batches, saved]);
                setIsCreateBatchOpen(false);
                setNewBatch({
                    batchCode: '', batchName: '', trainerId: '', startDate: '', endDate: '', status: 'UPCOMING',
                    schedule: '', mode: 'ONLINE', branch: '', maxCapacity: 50, description: ''
                });
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleUpdateBatchSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const selectedMentor = allUsers.find(u => u.id === editBatchData.trainerId);
        const payload = {
            ...editBatchData,
            trainerName: selectedMentor?.fullName || editBatchData.trainerName,
            updatedAt: new Date()
        };

        try {
            const res = await fetch(`${API_URLS.LMS_BACKEND}/api/academic/batches/${editBatchData.id}`, {
                method: 'PUT',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(payload)
            });
            if (res.ok) {
                const saved = await res.json();
                setBatches(batches.map(b => b.id === saved.id ? saved : b));
                setSelectedBatch(saved);
                setIsEditBatchOpen(false);
                setEditBatchData(null);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleDeleteBatch = async (id: string, e: any) => {
        e.stopPropagation();
        const token = localStorage.getItem('token');
        if (!token || token === 'null' || token === 'undefined') {
            showToast("Session expired or invalid. Please logout and login again to refresh your security token.", "error");
            return;
        }

        if (!confirm("Are you sure you want to delete this batch and all its resources?")) return;
        try {
            await fetch(`${API_URLS.LMS_BACKEND}/api/academic/batches/${id}`, { 
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setBatches(batches.filter((b: any) => b.id !== id));
            if (selectedBatch?.id === id) setSelectedBatch(null);
            showToast("Batch and all associated data purged.", "success");
        } catch (e) {
            console.error("Failed to delete batch", e);
            showToast("Failed to delete batch. Please try again.", "error");
        }
    };

    const handleDeleteCourse = async (courseId: string, e: any) => {
        e.stopPropagation();
        const token = localStorage.getItem('token');
        if (!token || token === 'null' || token === 'undefined') {
            showToast("Session expired or invalid. Please logout and login again to refresh your security token.", "error");
            return;
        }

        confirmAction(
            "Terminate Course?",
            "This action is irreversible. All modules and data linked to this course will be permanently purged from the Command Center.",
            async () => {
                try {
                    const res = await fetch(`${API_URLS.LMS_BACKEND}/api/courses/${courseId}`, {
                        method: 'DELETE',
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    if (res.ok) {
                        setCourses(courses.filter(c => (c.id !== courseId && c._id !== courseId)));
                        showToast("Course Data Purged Successfully.", "success");
                    } else {
                        const err = await res.json();
                        showToast(err.error || "Failed to purge course.", "error");
                    }
                } catch (err) {
                    showToast("Neural link failed. Network error.", "error");
                }
            }
        );
    };

    const handleDeleteRecording = async (sessionId: string, e: any) => {
        e.stopPropagation();
        const session = liveSessions.find((s: any) => s.id === sessionId || s._id === sessionId);
        if (!session) return;

        if (isFullAdmin) {
            setSessionToDelete(session);
            setIsDeleteConfirmOpen(true);
        } else {
            if (!confirm("Your request to delete this recording will be sent to Admin for approval. Continue?")) return;
            try {
                const reqPayload = {
                    type: 'DELETE_RECORDING',
                    sessionId: sessionId,
                    data: { title: session.title, batchName: session.batchName, batchId: session.batchId, recordingUrl: session.recordingUrl },
                    requestedBy: currentUser?.fullName || currentUser?.email,
                    requestedById: currentUser?.id
                };
                const res = await fetch(`${API_URLS.LMS_BACKEND}/api/academic/session-requests`, {
                    method: 'POST',
                    headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                    body: JSON.stringify(reqPayload)
                });
                if (res.ok) {
                    const createdReq = await res.json();
                    setSessionRequests([createdReq, ...sessionRequests]);

                    // NOTIFY ADMINS
                    const notifMsg = `${currentUser?.fullName || 'A Tutor'} has requested to delete a recording for ${session.batchName}.`;
                    await fetch(`${API_URLS.LMS_BACKEND}/api/academic/notifications`, {
                        method: 'POST',
                        headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                        body: JSON.stringify({ role: 'ADMIN', title: 'Recording Delete Request', message: notifMsg, type: 'WARNING' })
                    });
                    await fetch(`${API_URLS.LMS_BACKEND}/api/academic/notifications`, {
                        method: 'POST',
                        headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                        body: JSON.stringify({ role: 'SUPER_ADMIN', title: 'Recording Delete Request', message: notifMsg, type: 'WARNING' })
                    });

                    alert("Delete request sent to Admin.");
                }
            } catch (e) { console.error(e); }
        }
    };

    const confirmDeleteRecording = async () => {
        if (!sessionToDelete) return;
        const sessionId = sessionToDelete.id || sessionToDelete._id;
        try {
            const res = await fetch(`${API_URLS.LMS_BACKEND}/api/academic/sessions/${sessionId}/recording`, {
                method: 'DELETE'
            });
            if (res.ok) {
                setLiveSessions(liveSessions.map(s => (s.id === sessionId || s._id === sessionId) ? { ...s, recordingUrl: null } : s));
                setIsDeleteConfirmOpen(false);
                setSessionToDelete(null);
                alert("Recording deleted successfully.");
            }
        } catch (e) {
            console.error("Failed to delete recording", e);
        }
    };

    const handleDownloadRequest = async (ls: any) => {
        if (!ls) return;
        if (isFullAdmin) {
            window.open(`${ls.recordingUrl}?download=true`, '_blank');
            return;
        }

        if (!confirm("Your request to download this recording will be sent to Admin. Continue?")) return;
        try {
            const reqPayload = {
                type: 'DOWNLOAD_RECORDING',
                sessionId: ls.id || ls._id,
                data: { title: ls.title, batchName: ls.batchName, batchId: ls.batchId, recordingUrl: ls.recordingUrl },
                requestedBy: currentUser?.fullName || currentUser?.email,
                requestedById: currentUser?.id
            };
            const res = await fetch(`${API_URLS.LMS_BACKEND}/api/academic/session-requests`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(reqPayload)
            });
            if (res.ok) {
                const createdReq = await res.json();
                setSessionRequests([createdReq, ...sessionRequests]);

                // NOTIFY ADMINS
                const notifMsg = `${currentUser?.fullName || 'A Tutor'} has requested to download a recording for ${ls.batchName}.`;
                await fetch(`${API_URLS.LMS_BACKEND}/api/academic/notifications`, {
                    method: 'POST',
                    headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                    body: JSON.stringify({ role: 'ADMIN', title: 'Recording Download Request', message: notifMsg, type: 'INFO' })
                });

                alert("Download request sent to Admin.");
            }
        } catch (e) { console.error(e); }
    };

    const initiateShare = async (ls: any) => {
        setShareTarget(ls);
        setShareCurrentPath([]);
        setIsShareModalOpen(true);

        try {
            // Priority 1: Get all courses for general sharing
            const res = await fetch(`${API_URLS.LMS_BACKEND}/api/courses`);
            const courses = await res.json();
            setAllCourses(courses);

            // Priority 2: If session has metadata, jump to appropriate step
            if (ls.courseId || ls.batchId) {
                const course = courses.find((c: any) => c.id === ls.courseId || c._id === ls.courseId);
                if (course) {
                    setShareSelectedCourse(course);
                    const bRes = await fetch(`${API_URLS.LMS_BACKEND}/api/academic/batches/course/${course.id || course._id}`);
                    const batches = await bRes.json();
                    setAllBatchesForCourse(batches);

                    const batch = batches.find((b: any) => b.id === ls.batchId || b._id === ls.batchId);
                    if (batch) {
                        setShareSelectedBatch(batch);
                        setShareStep(3); // Jump straight to folder selection
                    } else {
                        setShareStep(2); // Jump to batch selection
                    }
                } else {
                    setShareStep(1);
                }
            } else {
                setShareStep(1);
            }
        } catch (e) {
            console.error("Initiate Share Error:", e);
            setShareStep(1);
        }
    };

    const handleSelectCourseForShare = async (course: any) => {
        setShareSelectedCourse(course);
        setShareStep(2);
        try {
            const res = await fetch(`${API_URLS.LMS_BACKEND}/api/academic/batches/course/${course.id}`);
            if (!res.ok) throw new Error(`Status: ${res.status}`);
            const data = await res.json();
            setAllBatchesForCourse(data);
        } catch (e) {
            console.error("Batches for course error:", e);
            setAllBatchesForCourse([]);
        }
    };

    const handleCreateFolderForShare = async (newPath: string) => {
        if (!shareSelectedBatch) return;
        const updatedBatch = { ...shareSelectedBatch, updatedAt: new Date() };
        if (!updatedBatch.folders) updatedBatch.folders = [];
        
        // Check if folder already exists
        if (updatedBatch.folders.find((f: any) => f.name === newPath)) {
            alert("Folder already exists!");
            return;
        }

        updatedBatch.folders.push({ name: newPath, files: [], createdBy: 'Admin', createdAt: new Date() });

        try {
            const res = await fetch(`${API_URLS.LMS_BACKEND}/api/academic/batches/${shareSelectedBatch.id}`, {
                method: 'PUT',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(updatedBatch)
            });
            if (res.ok) {
                // Refresh local state
                const freshBatches = batches.map(b => b.id === shareSelectedBatch.id ? updatedBatch : b);
                setBatches(freshBatches);
                setShareSelectedBatch(updatedBatch);
                setShareNewFolderName('');
                alert(`Folder "${newPath}" created successfully!`);
            }
        } catch (e) { console.error(e); }
    };

    const handleConfirmShare = async (path: string) => {
        if (!shareSelectedBatch || !shareTarget) return;

        const trainer = allUsers.find(u => u.id === shareTarget.tutorId);
        const trainerName = trainer ? (trainer.fullName || trainer.name) : 'Trainer';
        const sessionTime = new Date(shareTarget.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }).replace(/:/g, '-');
        const sessionDate = new Date(shareTarget.startTime).toLocaleDateString().replace(/\//g, '-');

        const newFile = {
            name: `${selectedCourse?.title || 'Course'}_${selectedBatch?.batchName || 'Batch'}_${sessionDate}_${sessionTime}_${trainerName}.webm`,
            type: 'VIDEO',
            size: 'Captured Stream',
            uploadDate: new Date().toISOString(),
            url: shareTarget.recordingUrl
        };

        const updatedBatch = { ...shareSelectedBatch, updatedAt: new Date() };
        if (!updatedBatch.folders) updatedBatch.folders = [];
        
        let folder = updatedBatch.folders.find((f: any) => f.name === path);
        if (!folder) {
            folder = { name: path, files: [], createdBy: 'Stream Capture', createdAt: new Date() };
            updatedBatch.folders.push(folder);
        }
        if (!folder.files) folder.files = [];
        folder.files.push(newFile);

        try {
            const res = await fetch(`${API_URLS.LMS_BACKEND}/api/academic/batches/${shareSelectedBatch.id}`, {
                method: 'PUT',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(updatedBatch)
            });
            if (res.ok) {
                // Refresh local state
                const freshBatches = batches.map(b => b.id === shareSelectedBatch.id ? updatedBatch : b);
                setBatches(freshBatches);
                setShareSelectedBatch(updatedBatch);
                alert(`Recording shared successfully to ${path}!`);
                setIsShareModalOpen(false);
            }
        } catch (e) { console.error(e); }
    };

    const [tempTrainerIds, setTempTrainerIds] = useState<string[]>([]);
    const [tempStudentIds, setTempStudentIds] = useState<string[]>([]);

    useEffect(() => {
        if (isTutorModalOpen && selectedBatch) {
            setTempTrainerIds(selectedBatch.trainerIds || (selectedBatch.trainerId ? [selectedBatch.trainerId] : []));
        }
    }, [isTutorModalOpen, selectedBatch]);

    useEffect(() => {
        if (isStudentModalOpen && selectedBatch) {
            const ids = selectedBatch.studentIds || [];
            // Normalize IDs to strings just in case
            setTempStudentIds(ids.map((id: any) => String(id.id || id._id || id)));
        }
    }, [isStudentModalOpen, selectedBatch]);

    const handleSaveChanges = async (type: 'FACULTY' | 'STUDENTS') => {
        if (!selectedBatch) return;
        const batchId = selectedBatch.id || selectedBatch._id;

        let updatePayload = { ...selectedBatch };
        if (type === 'FACULTY') {
            updatePayload.trainerIds = tempTrainerIds;
            // Backward compatibility for UI that uses trainerId
            updatePayload.trainerId = tempTrainerIds[0] || null;
        } else {
            updatePayload.studentIds = tempStudentIds;
            updatePayload.totalStudents = tempStudentIds.length;
        }

        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_URLS.LMS_BACKEND}/api/academic/batches/${batchId}`, {
                method: 'PUT',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(updatePayload)
            });
            if (res.ok) {
                const savedBatch = await res.json();
                const normalizedBatch = { ...savedBatch, id: savedBatch.id || savedBatch._id };
                setSelectedBatch(normalizedBatch);
                await fetchData();
                if (type === 'FACULTY') setIsTutorModalOpen(false);
                else setIsStudentModalOpen(false);
                showToast(`Batch ${type.toLowerCase()} updated successfully.`, "success");
            }
        } catch (err) { console.error("Save failed:", err); }
    };

    const toggleTempTrainer = (id: string) => {
        setTempTrainerIds(prev => prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]);
    };

    const toggleTempStudent = (id: string) => {
        setTempStudentIds(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]);
    };

    const handleFileUpload = async (event: any) => {
        const file = event.target.files[0];
        if (!file) return;

        let targetFolder = selectedFolder;
        let updatedBatch = { ...selectedBatch };

        if (!targetFolder) {
            targetFolder = updatedBatch.folders?.find((f: any) => f.name === 'General Files');
            if (!targetFolder) {
                targetFolder = { name: 'General Files', files: [], sharedWith: [] };
                updatedBatch.folders = [...(updatedBatch.folders || []), targetFolder];
            }
        }

        const newFileObj = {
            name: file.name,
            size: (file.size / 1024 / 1024).toFixed(2) + ' MB',
            type: file.name.split('.').pop()?.toLowerCase() || 'unknown',
            uploadDate: new Date().toISOString()
        };

        updatedBatch.folders = updatedBatch.folders.map((f: any) => {
            if (f.name === targetFolder.name) {
                return { ...f, files: [...(f.files || []), newFileObj] };
            }
            return f;
        });

        try {
            const res = await fetch(`${API_URLS.LMS_BACKEND}/api/academic/batches/${selectedBatch.id}`, {
                method: 'PUT',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(updatedBatch)
            });
            if (res.ok) {
                const savedBatch = await res.json();
                setSelectedBatch(savedBatch);
                setBatches(batches.map(b => b.id === savedBatch.id ? savedBatch : b));
                if (selectedFolder) {
                    const freshFolder = savedBatch.folders.find((f: any) => f.name === selectedFolder.name);
                    setSelectedFolder(freshFolder);
                }
            }
        } catch (err) {
            console.error(err);
        }
    };

    const updateBatchInDb = async (updatedBatch: any, newSelectedFolderName?: string | null) => {
        try {
            const res = await fetch(`${API_URLS.LMS_BACKEND}/api/academic/batches/${selectedBatch.id}`, {
                method: 'PUT',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(updatedBatch)
            });
            if (res.ok) {
                const savedBatch = await res.json();
                setSelectedBatch(savedBatch);
                setBatches(batches.map((b: any) => b.id === savedBatch.id ? savedBatch : b));

                if (newSelectedFolderName) {
                    const freshFolder = savedBatch.folders?.find((f: any) => f.name === newSelectedFolderName);
                    setSelectedFolder(freshFolder);
                } else if (newSelectedFolderName === null && selectedFolder) {
                    setSelectedFolder(null);
                } else if (selectedFolder) {
                    const freshFolder = savedBatch.folders?.find((f: any) => f.name === selectedFolder.name);
                    setSelectedFolder(freshFolder);
                }
            }
        } catch (err) { console.error(err); }
    };

    const handleDeleteFolder = async (folderName: string, e: any) => {
        e.stopPropagation();
        if (!window.confirm(`Are you sure you want to delete folder "${folderName}" and all its contents?`)) return;
        
        const updatedBatch = { ...selectedBatch };
        if (!updatedBatch.folders) return;

        // Recursive deletion: filter out the target folder and all its subdirectories
        const originalCount = updatedBatch.folders.length;
        updatedBatch.folders = updatedBatch.folders.filter((f: any) => 
            f.name !== folderName && !f.name.startsWith(folderName + '/')
        );

        if (updatedBatch.folders.length === originalCount) {
            alert("Folder not found or already deleted.");
            return;
        }

        try {
            await updateBatchInDb(updatedBatch, null);
            alert(`Folder "${folderName}" and its contents have been removed.`);
        } catch (err) {
            alert("Failed to delete folder. Please try again.");
            console.error(err);
        }
    };

    const handleRenameSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!renameTarget || !renameValue.trim()) return;

        const updatedBatch = { ...selectedBatch };

        if (renameTarget.type === 'folder') {
            updatedBatch.folders = updatedBatch.folders.map((f: any) => {
                if (f.name === renameTarget.oldName) return { ...f, name: renameValue.trim() };
                return f;
            });
        } else if (renameTarget.type === 'file') {
            updatedBatch.folders = updatedBatch.folders.map((f: any) => {
                if (f.name === renameTarget.folderName) {
                    return {
                        ...f,
                        files: f.files.map((file: any) => file.name === renameTarget.oldName ? { ...file, name: renameValue.trim() } : file)
                    };
                }
                return f;
            });
        }

        await updateBatchInDb(updatedBatch, renameTarget.type === 'folder' && selectedFolder?.name === renameTarget.oldName ? renameValue.trim() : selectedFolder?.name);
        setRenameTarget(null);
        setRenameValue('');
    };

    const handleDeleteFile = async (fileName: string) => {
        if (!window.confirm(`Are you sure you want to delete file "${fileName}"?`)) return;
        
        const currentPathStr = drivePath.join('/');
        const updatedBatch = { ...selectedBatch };
        
        if (!updatedBatch.folders) return;

        updatedBatch.folders = updatedBatch.folders.map((f: any) => {
            if (f.name === currentPathStr) {
                return { ...f, files: (f.files || []).filter((file: any) => file.name !== fileName) };
            }
            return f;
        });

        try {
            await updateBatchInDb(updatedBatch, currentPathStr);
            alert(`File "${fileName}" has been deleted.`);
        } catch (err) {
            alert("Failed to delete file.");
            console.error(err);
        }
    };

    const handleToggleStudent = async (studentId: string) => {
        if (!selectedBatch) return;
        const batchId = selectedBatch.id || selectedBatch._id;

        let currentStudentIds = [...(selectedBatch.studentIds || [])];
        if (currentStudentIds.includes(studentId)) {
            currentStudentIds = currentStudentIds.filter((id: string) => id !== studentId);
        } else {
            currentStudentIds = [...currentStudentIds, studentId];
        }

        const updatedBatch = { ...selectedBatch, studentIds: currentStudentIds, totalStudents: currentStudentIds.length };
        try {
            const res = await fetch(`${API_URLS.LMS_BACKEND}/api/academic/batches/${batchId}`, {
                method: 'PUT',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(updatedBatch)
            });
            if (res.ok) {
                const savedBatch = await res.json();
                const normalized = { ...savedBatch, id: (savedBatch.id || savedBatch._id).toString() };
                setSelectedBatch(normalized);
                setBatches(batches.map(b => (b.id === normalized.id || b._id === normalized.id) ? normalized : b));
            }
        } catch (err) {
            console.error("Student sync failed:", err);
        }
    };

    const handleCourseClick = (course: any) => {
        setSelectedCourse(course);
        setViewMode('BATCHES');
    };

    const handleBatchClick = async (batch: any) => {
        setSelectedBatch(batch);
        setSelectedFolder(null); // Reset folder view
        setViewMode('DETAILS');

        const batchId = batch.id || batch._id;
        // Fetch Live Sessions for this batch
        if (batchId) {
            try {
                const res = await fetch(`${API_URLS.LMS_BACKEND}/api/academic/sessions/batch/${batchId}`);
                if (res.ok) {
                    const sessions = await res.json();
                    setLiveSessions(sessions);
                }
            } catch (e) {
                console.error("Failed to fetch live sessions", e);
            }
        }
    };

    const handleOpenAccess = (target: any) => {
        setAccessTarget(target);
        setIsAccessModalOpen(true);
    };

    const handleUpdateAccess = async (user: any, role: string) => {
        if (!selectedBatch) return;
        const updatedBatch = { ...selectedBatch };

        // CHECK: Is this a global batch access or a folder access?
        if (accessTarget.batchName || accessTarget.batchCode) {
            // Global Batch Access
            updatedBatch.sharedWith = updatedBatch.sharedWith || [];
            const existing = updatedBatch.sharedWith.find((s: any) => s.email === user.email);
            if (existing) existing.role = role;
            else updatedBatch.sharedWith.push({ email: user.email, name: user.fullName, role });
        } else {
            // Specific Folder Access
            const targetFolder = updatedBatch.folders?.find((f: any) => f.name === accessTarget.name);
            if (targetFolder) {
                targetFolder.sharedWith = targetFolder.sharedWith || [];
                const existing = targetFolder.sharedWith.find((s: any) => s.email === user.email);
                if (existing) existing.role = role;
                else targetFolder.sharedWith.push({ email: user.email, name: user.fullName, role });
            }
        }

        try {
            const res = await fetch(`${API_URLS.LMS_BACKEND}/api/academic/batches/${selectedBatch.id || selectedBatch._id}`, {
                method: 'PUT',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(updatedBatch)
            });
            if (res.ok) {
                const saved = await res.json();
                setSelectedBatch(saved);
                setBatches(batches.map(b => (b.id === saved.id || b._id === saved.id) ? saved : b));
                setAccessTarget(accessTarget.batchName ? saved : accessTarget);
            }
        } catch (e) {
            console.error("Access Update Error:", e);
        }
    };

    const handleRemoveAccess = async (email: string) => {
        if (!selectedBatch) return;
        const updatedBatch = { ...selectedBatch };

        if (accessTarget.batchName || accessTarget.batchCode) {
            // Global Batch
            updatedBatch.sharedWith = updatedBatch.sharedWith?.filter((s: any) => s.email !== email);
        } else {
            // Folder
            const targetFolder = updatedBatch.folders?.find((f: any) => f.name === accessTarget.name);
            if (targetFolder) {
                targetFolder.sharedWith = targetFolder.sharedWith?.filter((s: any) => s.email !== email);
            }
        }

        try {
            const res = await fetch(`${API_URLS.LMS_BACKEND}/api/academic/batches/${selectedBatch.id || selectedBatch._id}`, {
                method: 'PUT',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(updatedBatch)
            });
            if (res.ok) {
                const saved = await res.json();
                setSelectedBatch(saved);
                setBatches(batches.map(b => (b.id === saved.id || b._id === saved.id) ? saved : b));
                setAccessTarget(accessTarget.batchName ? saved : accessTarget);
            }
        } catch (e) {
            console.error("Access Revoke Error:", e);
        }
    };

    const goBack = () => {
        if (selectedFolder) setSelectedFolder(null);
        else if (viewMode === 'DETAILS') setViewMode('BATCHES');
        else if (viewMode === 'BATCHES') setViewMode('COURSES');
    };

    const handleScheduleLiveClass = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedBatch) return;

        // Auto-generate internal WebRTC room ID if Bytecode Meetings is selected
        let finalLink = newLiveSession.meetingLink;
        if (newLiveSession.platform === 'Bytecode Meetings' && !finalLink) {
            finalLink = `${selectedBatch.batchCode}-${Date.now()}`;
        }

        const batchId = selectedBatch.id || selectedBatch._id;
        const courseId = selectedCourse.id || selectedCourse._id;

        const payload = {
            title: newLiveSession.title,
            courseId: courseId,
            courseName: selectedCourse.title,
            batchId: batchId,
            batchName: selectedBatch.batchName,
            mentorId: newLiveSession.tutorId,
            mentorName: allUsers.find(u => u.id === newLiveSession.tutorId)?.fullName || allUsers.find(u => u.id === newLiveSession.tutorId)?.email || 'Unassigned',
            startTime: newLiveSession.startTime ? new Date(newLiveSession.startTime).toISOString() : new Date().toISOString(),
            endTime: newLiveSession.endDate ? new Date(newLiveSession.endDate).toISOString() : undefined,
            duration: (Number(newLiveSession.durationHours) * 60) + Number(newLiveSession.durationMinutes),
            platform: newLiveSession.platform,
            meetingLink: finalLink,
            status: 'UPCOMING'
        };

        try {
            if (isFullAdmin) {
                const res = await fetch(`${API_URLS.LMS_BACKEND}/api/academic/sessions`, {
                    method: 'POST',
                    headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                    body: JSON.stringify(payload)
                });
                if (res.ok) {
                    const created = await res.json();
                    setLiveSessions([...liveSessions, created]);
                    setIsScheduleLiveModalOpen(false);
                    setNewLiveSession({
                        title: '', startTime: '', endDate: '',
                        durationHours: 1, durationMinutes: 0,
                        tutorId: '', platform: 'Bytecode Meetings', meetingLink: '',
                        recordingUrl: ''
                    });
                }
            } else {
                // Submit Request
                const reqPayload = {
                    type: 'CREATE',
                    data: payload,
                    requestedBy: currentUser?.fullName || currentUser?.email,
                    requestedById: currentUser?.id
                };
                const res = await fetch(`${API_URLS.LMS_BACKEND}/api/academic/session-requests`, {
                    method: 'POST',
                    headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                    body: JSON.stringify(reqPayload)
                });
                if (res.ok) {
                    const createdReq = await res.json();

                    // NOTIFY ADMINS
                    const notifMsg = `${currentUser?.fullName || 'A Tutor'} has requested to schedule a new session for ${selectedBatch?.batchName || 'a batch'}.`;
                    await fetch(`${API_URLS.LMS_BACKEND}/api/academic/notifications`, {
                        method: 'POST',
                        headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                        body: JSON.stringify({ role: 'ADMIN', title: 'New Session Request', message: notifMsg, type: 'INFO' })
                    });
                    await fetch(`${API_URLS.LMS_BACKEND}/api/academic/notifications`, {
                        method: 'POST',
                        headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                        body: JSON.stringify({ role: 'SUPER_ADMIN', title: 'New Session Request', message: notifMsg, type: 'INFO' })
                    });

                    setSessionRequests([createdReq, ...sessionRequests]);
                    alert("Your request to schedule a new session has been sent to Admin for approval.");
                    setIsScheduleLiveModalOpen(false);
                }
            }
        } catch (e) {
            console.error("Failed to schedule live class", e);
        }
    };

    const handleDeleteSession = async (id: string, e: any) => {
        e.stopPropagation();
        const sessionId = id || e.currentTarget?.dataset?.id; // Fallback
        if (!sessionId) return console.error("No sessionId provided");
        if (!confirm("Are you sure you want to delete this live session?")) return;
        try {
            if (isFullAdmin) {
                const token = localStorage.getItem('token');
                const res = await fetch(`${API_URLS.LMS_BACKEND}/api/academic/sessions/${sessionId}`, { 
                    method: 'DELETE',
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (res.ok) {
                    setLiveSessions(liveSessions.filter(s => (s.id !== sessionId && s._id !== sessionId)));
                }
            } else {
                // Submit Request
                const session = liveSessions.find(s => (s.id === sessionId || s._id === sessionId));
                const reqPayload = {
                    type: 'DELETE',
                    sessionId: sessionId,
                    data: { title: session?.title, batchName: session?.batchName, batchId: session?.batchId },
                    requestedBy: currentUser?.fullName || currentUser?.email,
                    requestedById: currentUser?.id
                };
                const res = await fetch(`${API_URLS.LMS_BACKEND}/api/academic/session-requests`, {
                    method: 'POST',
                    headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                    body: JSON.stringify(reqPayload)
                });
                if (res.ok) {
                    const createdReq = await res.json();

                    // NOTIFY ADMINS
                    const notifMsg = `${currentUser?.fullName || 'A Tutor'} has requested to delete a session in ${selectedBatch?.batchName || 'a batch'}.`;
                    await fetch(`${API_URLS.LMS_BACKEND}/api/academic/notifications`, {
                        method: 'POST',
                        headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                        body: JSON.stringify({ role: 'ADMIN', title: 'Session Delete Request', message: notifMsg, type: 'WARNING' })
                    });
                    await fetch(`${API_URLS.LMS_BACKEND}/api/academic/notifications`, {
                        method: 'POST',
                        headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                        body: JSON.stringify({ role: 'SUPER_ADMIN', title: 'Session Delete Request', message: notifMsg, type: 'WARNING' })
                    });

                    setSessionRequests([createdReq, ...sessionRequests]);
                    alert("Your request to delete this session has been sent to Admin for approval.");
                }
            }
        } catch (e) {
            console.error(e);
        }
    };

    const handleOpenEditSession = (session: any, e: any) => {
        e.stopPropagation();
        setEditingSession(session);
        setIsEditSessionModalOpen(true);
    };

    const handleUpdateSession = async (e: any) => {
        e.preventDefault();
        try {
            if (isFullAdmin) {
                const sessionId = editingSession.id || editingSession._id;
                const res = await fetch(`${API_URLS.LMS_BACKEND}/api/academic/sessions/${sessionId}`, {
                    method: 'PUT',
                    headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                    body: JSON.stringify(editingSession)
                });
                if (res.ok) {
                    setLiveSessions(liveSessions.map(s => (s.id === sessionId || s._id === sessionId) ? editingSession : s));
                    setIsEditSessionModalOpen(false);
                    setEditingSession(null);
                }
            } else {
                // Submit Request
                const sessionId = editingSession.id || editingSession._id;
                const originalSession = liveSessions.find(s => (s.id === sessionId || s._id === sessionId));
                const reqPayload = {
                    type: 'EDIT',
                    sessionId: sessionId,
                    data: editingSession,
                    oldData: originalSession,
                    requestedBy: currentUser?.fullName || currentUser?.email,
                    requestedById: currentUser?.id
                };
                const res = await fetch(`${API_URLS.LMS_BACKEND}/api/academic/session-requests`, {
                    method: 'POST',
                    headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                    body: JSON.stringify(reqPayload)
                });
                if (res.ok) {
                    const createdReq = await res.json();

                    // NOTIFY ADMINS
                    const notifMsg = `${currentUser?.fullName || 'A Tutor'} has requested to edit a session in ${selectedBatch?.batchName || 'a batch'}.`;
                    await fetch(`${API_URLS.LMS_BACKEND}/api/academic/notifications`, {
                        method: 'POST',
                        headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                        body: JSON.stringify({ role: 'ADMIN', title: 'Session Edit Request', message: notifMsg, type: 'INFO' })
                    });
                    await fetch(`${API_URLS.LMS_BACKEND}/api/academic/notifications`, {
                        method: 'POST',
                        headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                        body: JSON.stringify({ role: 'SUPER_ADMIN', title: 'Session Edit Request', message: notifMsg, type: 'INFO' })
                    });

                    setSessionRequests([createdReq, ...sessionRequests]);
                    alert("Your request to edit this session has been sent to Admin for approval.");
                    setIsEditSessionModalOpen(false);
                    setEditingSession(null);
                }
            }
        } catch (e) {
            console.error(e);
        }
    };

    const handleCreateAssignment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedBatch) return;

        const batchId = selectedBatch.id || selectedBatch._id;
        const courseId = selectedCourse.id || selectedCourse._id;

        const payload = {
            ...newAssignment,
            batchId: batchId,
            batchName: selectedBatch.batchName,
            courseId: courseId,
            courseName: selectedCourse.title,
            trainerId: selectedBatch.trainerId,
            trainerName: tutor?.fullName || "Unassigned",
            assignedDate: new Date(),
            submissions: []
        };

        try {
            const res = await fetch(`${API_URLS.LMS_BACKEND}/api/academic/assignments`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });
            if (res.ok) {
                const created = await res.json();
                setAssignments([...assignments, created]);
                setIsCreateAssignmentModalOpen(false);
                setNewAssignment({
                    title: "", description: "", attachments: [],
                    difficulty: "MEDIUM", instructions: "", status: "ACTIVE",
                    dueDate: "",
                });
                alert("Assignment broadcasted successfully!");
            } else {
                const err = await res.json();
                alert("Failed to broadcast assignment: " + (err.error || "Unknown error"));
            }
        } catch (e: any) {
            console.error(e);
            alert("Error broadcasting assignment: " + e.message);
        }
    };

    const handleAssignmentFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const formData = new FormData();
        formData.append("file", file);
        try {
            const res = await fetch(`${API_URLS.LMS_BACKEND}/api/academic/upload`, {
                method: "POST",
                body: formData
            });
            const data = await res.json();
            if (data.url) {
                setNewAssignment(prev => ({
                    ...prev,
                    attachments: [...prev.attachments, { name: file.name, url: data.url }]
                }));
            }
        } catch (err) { console.error(err); }
    };

    const handleDeleteAssignment = async (id: string, e: any) => {
        e.stopPropagation();
        const assignment = assignments.find(a => (a.id === id || a._id === id));
        if (!assignment) return;

        if (isFullAdmin) {
            if (!confirm("Remove this assignment? Students will no longer be able to submit.")) return;
            try {
                const token = localStorage.getItem('token');
                const res = await fetch(`${API_URLS.LMS_BACKEND}/api/academic/assignments/${id}`, { 
                    method: 'DELETE',
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (res.ok) {
                    setAssignments(assignments.filter(a => a.id !== id));
                    alert("Assignment deleted successfully.");
                }
            } catch (e) { console.error(e); }
        } else {
            if (!confirm("Your request to delete this assignment will be sent to Admin for approval. Continue?")) return;
            try {
                const reqPayload = {
                    type: 'DELETE_ASSIGNMENT',
                    assignmentId: id,
                    data: { title: assignment.title, batchName: assignment.batchName, batchId: assignment.batchId },
                    requestedBy: currentUser?.fullName || currentUser?.email,
                    requestedById: currentUser?.id
                };
                const res = await fetch(`${API_URLS.LMS_BACKEND}/api/academic/session-requests`, {
                    method: 'POST',
                    headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                    body: JSON.stringify(reqPayload)
                });
                if (res.ok) {
                    const createdReq = await res.json();
                    setSessionRequests([createdReq, ...sessionRequests]);

                    // NOTIFY ADMINS
                    const notifMsg = `${currentUser?.fullName || 'A Tutor'} has requested to delete an assignment: "${assignment.title}".`;
                    await fetch(`${API_URLS.LMS_BACKEND}/api/academic/notifications`, {
                        method: 'POST',
                        headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                        body: JSON.stringify({ role: 'ADMIN', title: 'Assignment Delete Request', message: notifMsg, type: 'WARNING' })
                    });
                    await fetch(`${API_URLS.LMS_BACKEND}/api/academic/notifications`, {
                        method: 'POST',
                        headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                        body: JSON.stringify({ role: 'SUPER_ADMIN', title: 'Assignment Delete Request', message: notifMsg, type: 'WARNING' })
                    });

                    alert("Delete request sent to Admin.");
                }
            } catch (e) {
                console.error("Delete request failed:", e);
                alert("Failed to send delete request.");
            }
        }
    };

    const handleGradeSubmission = async () => {
        if (!viewingSubmissionsAssignment || !activeSubmission) return;

        const updatedSubmissions = viewingSubmissionsAssignment.submissions.map((s: any) => {
            if (s.studentId === activeSubmission.studentId) {
                return { ...s, marksObtained: gradingData.marks, feedback: gradingData.feedback, status: gradingData.status };
            }
            return s;
        });

        const updatedAssignment = { ...viewingSubmissionsAssignment, submissions: updatedSubmissions };

        try {
            const res = await fetch(`${API_URLS.LMS_BACKEND}/api/academic/assignments/${viewingSubmissionsAssignment.id}`, {
                method: 'PUT',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(updatedAssignment)
            });
            if (res.ok) {
                const saved = await res.json();
                setAssignments(assignments.map(a => a.id === saved.id ? saved : a));
                setViewingSubmissionsAssignment(saved);
                setActiveSubmission(null);
                setGradingData({ marks: 0, feedback: '', status: 'GRADED' });
            }
        } catch (e) { console.error(e); }
    };

    const handleUpdateAssignment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingAssignment) return;

        try {
            const res = await fetch(`${API_URLS.LMS_BACKEND}/api/academic/assignments/${editingAssignment.id}`, {
                method: 'PUT',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(editingAssignment)
            });
            if (res.ok) {
                const saved = await res.json();
                setAssignments(assignments.map(a => a.id === saved.id ? saved : a));
                setIsEditAssignmentModalOpen(false);
                setEditingAssignment(null);
            }
        } catch (e) { console.error(e); }
    };
    const filteredBatches = batches.filter(b => b.courseId === selectedCourse?.id);
    const assignedTutors = allUsers.filter(u =>
        (selectedBatch?.trainerIds?.includes(u.id) || selectedBatch?.trainerIds?.includes(u._id)) ||
        (selectedBatch?.trainerId === u.id || selectedBatch?.trainerId === u._id)
    );
    const tutor = assignedTutors[0]; // Fallback for single tutor logic elsewhere
    const batchAssignments = assignments.filter(a => a.batchId === selectedBatch?.id);
    const students = allUsers.filter(u => u.role === 'STUDENT' && (selectedBatch?.studentIds?.includes(u.id) || selectedBatch?.studentIds?.includes(u.email)));

    const usersToShareWith = allUsers.filter(u =>
        (u.fullName || '').toLowerCase().includes(userSearchTerm.toLowerCase()) ||
        (u.email || '').toLowerCase().includes(userSearchTerm.toLowerCase())
    ).slice(0, 5);

    return (
        <DashboardLayout role={role}>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ paddingBottom: '5rem' }}>

                {/* --- NAVIGATION BREADCRUMBS --- */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '2rem', fontSize: '0.9rem', fontWeight: 600 }}>
                    <span onClick={() => { setViewMode('COURSES'); setSelectedCourse(null); setSelectedBatch(null); }} style={{ cursor: 'pointer', color: viewMode === 'COURSES' ? 'var(--primary)' : 'var(--text-dim)' }}>Academic Portal</span>
                    {viewMode === 'BATCHES' && (
                        <>
                            <ChevronRight size={14} color="var(--text-dim)" />
                            <span style={{ color: 'var(--primary)' }}>{selectedCourse?.title}</span>
                        </>
                    )}
                    {(viewMode === 'DETAILS') && (
                        <>
                            <ChevronRight size={14} color="var(--text-dim)" />
                            <span onClick={() => setViewMode('BATCHES')} style={{ cursor: 'pointer', color: 'var(--text-dim)' }}>{selectedCourse?.title}</span>
                            <ChevronRight size={14} color="var(--text-dim)" />
                            <span onClick={() => setSelectedFolder(null)} style={{ cursor: 'pointer', color: !selectedFolder ? 'var(--primary)' : 'var(--text-dim)' }}>{selectedBatch?.name || selectedBatch?.batchName}</span>
                        </>
                    )}
                    {selectedFolder && (
                        <>
                            <ChevronRight size={14} color="var(--text-dim)" />
                            <span style={{ color: 'var(--primary)', fontWeight: 800 }}>📂 {selectedFolder.name}</span>
                        </>
                    )}
                </div>

                {/* --- HEADER --- */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem' }}>
                    <div>
                        <h1 style={{ fontSize: '2.8rem', fontWeight: 900, letterSpacing: '-1.5px' }}>
                            {selectedFolder ? selectedFolder.name : 
                             viewMode === 'COURSES' ? 'Module Drive' : 
                             viewMode === 'BATCHES' ? 'Select Batch' : 
                             viewMode === 'EXAMS' ? 'Online Assessment Engine' :
                             viewMode === 'ANALYTICS' ? 'Quantum Interview Simulator' :
                             'Shared Workspace'}
                        </h1>
                        <div style={{ color: 'var(--text-dim)', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '20px' }}>
                            {selectedFolder ? `Viewing files in this folder.` : 
                             viewMode === 'COURSES' ? 'Access your courses and modules.' : 
                             viewMode === 'BATCHES' ? `Managing batches for ${selectedCourse?.title}.` : 
                             viewMode === 'EXAMS' ? 'Participate in scheduled tests and evaluate performance.' :
                             viewMode === 'ANALYTICS' ? 'Master your interview skills with real-time simulations.' :
                             `Manage folders and sharing for ${selectedBatch?.name || selectedBatch?.batchName}.`}

                            {viewMode === 'COURSES' && !selectedFolder && (
                                <div style={{ display: 'flex', gap: '20px', marginLeft: '10px', borderLeft: '1px solid rgba(255,255,255,0.1)', paddingLeft: '20px' }}>
                                    <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--primary)' }}>{allUsers.filter(u => u.role === 'STUDENT').length} <span style={{ color: 'var(--text-dim)', opacity: 0.6 }}>STUDENTS</span></span>
                                    <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--secondary)' }}>{allUsers.filter(u => u.role === 'TRAINER').length} <span style={{ color: 'var(--text-dim)', opacity: 0.6 }}>TRAINERS</span></span>
                                    <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#fff' }}>{courses.length} <span style={{ color: 'var(--text-dim)', opacity: 0.6 }}>COURSES</span></span>
                                </div>
                            )}
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                        {(viewMode === 'COURSES' || viewMode === 'EXAMS' || viewMode === 'ANALYTICS') && !selectedCourse && (
                            <div style={{ display: 'flex', background: 'rgba(255,255,255,0.03)', padding: '6px', borderRadius: '18px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                <button 
                                    onClick={() => setViewMode('COURSES')} 
                                    style={{ padding: '10px 20px', borderRadius: '14px', background: viewMode === 'COURSES' ? 'var(--primary)' : 'transparent', color: '#fff', border: 'none', fontWeight: 900, cursor: 'pointer', fontSize: '0.8rem', transition: 'all 0.3s' }}
                                >
                                    MODULES
                                </button>
                                <button 
                                    onClick={() => setViewMode('EXAMS')} 
                                    style={{ padding: '10px 20px', borderRadius: '14px', background: viewMode === 'EXAMS' ? 'var(--primary)' : 'transparent', color: '#fff', border: 'none', fontWeight: 900, cursor: 'pointer', fontSize: '0.8rem', transition: 'all 0.3s' }}
                                >
                                    TESTS & EXAMS
                                </button>
                                <button 
                                    onClick={() => setViewMode('ANALYTICS')} 
                                    style={{ padding: '10px 20px', borderRadius: '14px', background: viewMode === 'ANALYTICS' ? 'var(--primary)' : 'transparent', color: '#fff', border: 'none', fontWeight: 900, cursor: 'pointer', fontSize: '0.8rem', transition: 'all 0.3s' }}
                                >
                                    MOCK INTERVIEWS
                                </button>
                            </div>
                        )}

                        {viewMode === 'COURSES' && isFullAdmin && (
                            <button onClick={() => setIsCreateCourseOpen(true)} className="btn-quantum" style={{ padding: '12px 24px', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.85rem' }}>
                                <Plus size={16} /> NEW COURSE
                            </button>
                        )}
                        {viewMode !== 'COURSES' && (
                            <>
                                {viewMode === 'BATCHES' && isFullAdmin && (
                                    <button onClick={() => setIsCreateBatchOpen(true)} className="btn-quantum" style={{ padding: '12px 24px', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.85rem' }}>
                                        <Plus size={16} /> NEW BATCH
                                    </button>
                                )}
                                <button onClick={goBack} style={{ background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', padding: '12px 24px', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 900, cursor: 'pointer' }}>
                                    <ChevronLeft size={18} /> GO BACK
                                </button>
                            </>
                        )}
                    </div>
                </div>

                <AnimatePresence mode="wait">
                    {/* --- COURSES GRID --- */}
                    {viewMode === 'COURSES' && (
                        <motion.div key="courses-container" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                            {courses.length === 0 ? (
                                <div key="no-courses" style={{ textAlign: 'center', padding: '5rem', background: 'rgba(255,255,255,0.02)', borderRadius: '32px', border: '1px dashed rgba(255,255,255,0.1)' }}>
                                    <Book size={48} color="var(--text-dim)" style={{ marginBottom: '1rem', opacity: 0.2 }} />
                                    <p style={{ color: 'var(--text-dim)', fontSize: '1.2rem', fontWeight: 800 }}>No courses available.</p>
                                    <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem', opacity: 0.7 }}>Please ensure your Course Service is running, or create courses to begin.</p>
                                </div>
                            ) : (
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem' }}>
                                    {courses.map((c, i) => (
                                        <CourseCard 
                                            key={c.id || c._id || `course-${i}`} 
                                            course={c} 
                                            onClick={() => handleCourseClick(c)} 
                                            onDelete={(e: any) => handleDeleteCourse(c.id || c._id, e)}
                                            isAdmin={isFullAdmin}
                                            delay={i * 0.05} 
                                        />
                                    ))}
                                </div>
                            )}
                        </motion.div>
                    )}

                    {/* --- BATCHES GRID --- */}
                    {viewMode === 'BATCHES' && (
                        <>
                            {filteredBatches.length === 0 ? (
                                <div style={{ textAlign: 'center', padding: '5rem', background: 'rgba(255,255,255,0.02)', borderRadius: '32px', border: '1px dashed rgba(255,255,255,0.1)' }}>
                                    <Layers size={48} color="var(--text-dim)" style={{ marginBottom: '1rem', opacity: 0.2 }} />
                                    <p style={{ color: 'var(--text-dim)', fontSize: '1.2rem', fontWeight: 800 }}>No batches found for this course.</p>
                                </div>
                            ) : (
                                <motion.div key="batches" initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem' }}>
                                    {filteredBatches.map((b, i) => (
                                        <BatchCard key={b.id || i} batch={b} onClick={() => handleBatchClick(b)} delay={i * 0.05} />
                                    ))}
                                </motion.div>
                            )}
                        </>
                    )}

                    {/* --- DRIVE WORKSPACE --- */}
                    {viewMode === 'DETAILS' && (
                        <motion.div key="details" initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '2.5rem' }}>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
                                {/* --- BATCH TABS NAVIGATION --- */}
                                <div style={{
                                    display: 'flex',
                                    gap: '10px',
                                    background: 'rgba(255,255,255,0.02)',
                                    padding: '8px',
                                    borderRadius: '24px',
                                    border: '1px solid rgba(255,255,255,0.05)',
                                    position: 'relative'
                                }}>
                                    {[
                                        { id: 'DRIVE', label: 'BATCH DRIVE', icon: <Folder size={16} /> },
                                        { id: 'LIVE', label: 'LIVE CLASSES', icon: <Video size={16} /> },
                                        { id: 'ASSIGNMENTS', label: 'ASSIGNMENTS', icon: <FileText size={16} /> },
                                        ...((isFullAdmin || role === 'student') ? [
                                             { id: 'TRACKING', label: 'STUDENT TRACKING', icon: <Users size={16} /> }
                                        ] : [])
                                    ].map((tab) => (
                                        <button
                                            key={tab.id}
                                            onClick={() => setBatchTab(tab.id as any)}
                                            style={{
                                                flex: 1,
                                                padding: '14px',
                                                borderRadius: '16px',
                                                background: 'transparent',
                                                color: batchTab === tab.id ? '#fff' : 'var(--text-dim)',
                                                border: 'none',
                                                fontWeight: 800,
                                                cursor: 'pointer',
                                                transition: 'color 0.3s',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                gap: '10px',
                                                position: 'relative'
                                            }}
                                        >
                                            {batchTab === tab.id && (
                                                <motion.div
                                                    layoutId="batchActiveTab"
                                                    style={{
                                                        position: 'absolute',
                                                        inset: 0,
                                                        background: 'var(--primary)',
                                                        borderRadius: '16px',
                                                        zIndex: 0,
                                                        boxShadow: '0 10px 20px rgba(124, 58, 237, 0.3)'
                                                    }}
                                                    transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                                                />
                                            )}
                                            <span style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                {tab.icon} {tab.label}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                                {batchTab === 'DRIVE' && (
                                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-panel" style={{ padding: '2.5rem', borderRadius: '40px', minHeight: '600px', flex: 1 }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem', marginBottom: '3rem' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                                    <div style={{ width: '45px', height: '45px', background: 'linear-gradient(135deg, var(--primary), #8b5cf6)', borderRadius: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 20px rgba(124, 58, 237, 0.2)' }}>
                                                        <HardDrive color="#fff" size={24} />
                                                    </div>
                                                    <div>
                                                        <h3 style={{ fontSize: '1.6rem', fontWeight: 950, color: '#1e293b', letterSpacing: '-0.5px' }}>Batch Drive</h3>
                                                        <p style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '1px' }}>Resource Management Hub</p>
                                                    </div>
                                                </div>
                                                <div style={{ display: 'flex', gap: '12px' }}>
                                                    {isFullAdmin && (
                                                        <button onClick={() => setIsCreateFolderOpen(true)} className="btn-quantum" style={{ padding: '12px 25px', fontSize: '0.85rem', borderRadius: '18px' }}>
                                                            <Plus size={18} /> NEW FOLDER
                                                        </button>
                                                    )}
                                                    <input type="file" id="file-upload" style={{ display: 'none' }} onChange={handleFileUpload} />
                                                    <button onClick={() => document.getElementById('file-upload')?.click()} className="btn-quantum" style={{ padding: '12px 25px', fontSize: '0.85rem', background: '#f8fafc', color: '#64748b', border: '1px solid #e2e8f0', borderRadius: '18px', boxShadow: 'none' }}>
                                                        <Upload size={18} /> UPLOAD FILE
                                                    </button>
                                                </div>
                                            </div>

                                            {/* PREMIUM PILL BREADCRUMBS */}
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#f8fafc', padding: '8px 25px', borderRadius: '25px', border: '1px solid #f1f5f9', alignSelf: 'flex-start' }}>
                                                <button onClick={() => setDrivePath([])} style={{ background: 'none', border: 'none', color: drivePath.length === 0 ? 'var(--primary)' : '#94a3b8', fontWeight: 900, fontSize: '0.7rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', transition: 'all 0.3s' }}>
                                                    <Home size={14} /> DRIVE
                                                </button>
                                                {drivePath.map((p, idx) => (
                                                    <React.Fragment key={idx}>
                                                        <ChevronRight size={12} color="#cbd5e1" />
                                                        <button onClick={() => setDrivePath(drivePath.slice(0, idx + 1))} style={{ background: 'none', border: 'none', color: idx === drivePath.length - 1 ? 'var(--primary)' : '#64748b', fontWeight: 800, fontSize: '0.7rem', cursor: 'pointer', textTransform: 'uppercase' }}>
                                                            {p}
                                                        </button>
                                                    </React.Fragment>
                                                ))}
                                            </div>
                                        </div>

                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '3.5rem' }}>
                                            {/* RENDER FOLDERS */}
                                            {(() => {
                                                const currentPathStr = drivePath.join('/');
                                                const folders = selectedBatch?.folders || [];
                                                
                                                const visibleSubFolders = new Set<string>();
                                                folders.forEach((f: any) => {
                                                    const name = f.name;
                                                    if (currentPathStr === '') {
                                                        visibleSubFolders.add(name.split('/')[0]);
                                                    } else {
                                                        const prefix = currentPathStr + '/';
                                                        if (name.startsWith(prefix)) {
                                                            const relative = name.substring(prefix.length);
                                                            const firstPart = relative.split('/')[0];
                                                            if (firstPart) visibleSubFolders.add(firstPart);
                                                        }
                                                    }
                                                });

                                                if (visibleSubFolders.size > 0) {
                                                    return (
                                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '2rem' }}>
                                                            {Array.from(visibleSubFolders).map((folderName) => {
                                                                const fullPath = currentPathStr ? `${currentPathStr}/${folderName}` : folderName;
                                                                const actualFolder = folders.find((f: any) => f.name === fullPath);
                                                                
                                                                return (
                                                                    <motion.div
                                                                        key={fullPath}
                                                                        initial={{ opacity: 0, scale: 0.95 }}
                                                                        animate={{ opacity: 1, scale: 1 }}
                                                                        whileHover={{ y: -8 }}
                                                                        onClick={() => setDrivePath([...drivePath, folderName])}
                                                                        style={{ 
                                                                            background: '#fff', 
                                                                            padding: '2rem', 
                                                                            borderRadius: '35px', 
                                                                            border: '1px solid #f1f5f9', 
                                                                            boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -1px rgba(0,0,0,0.03)',
                                                                            cursor: 'pointer',
                                                                            position: 'relative',
                                                                            overflow: 'hidden',
                                                                            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
                                                                        }}
                                                                    >
                                                                        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '5px', background: 'linear-gradient(90deg, #f59e0b, #fbbf24)' }} />
                                                                        
                                                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                                                                            <div style={{ width: '55px', height: '55px', background: 'rgba(245, 158, 11, 0.08)', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                                                <Folder size={28} color="#f59e0b" />
                                                                            </div>
                                                                            <div style={{ display: 'flex', gap: '5px' }}>
                                                                                <button onClick={(e) => { e.stopPropagation(); handleOpenAccess(actualFolder || { name: fullPath }); }} style={{ padding: '8px', background: '#f8fafc', border: 'none', borderRadius: '10px', color: '#94a3b8', cursor: 'pointer' }}><Share2 size={14} /></button>
                                                                                <button onClick={(e) => handleDeleteFolder(fullPath, e)} style={{ padding: '8px', background: '#fff5f5', border: 'none', borderRadius: '10px', color: '#ef4444', cursor: 'pointer' }}><Trash2 size={14} /></button>
                                                                            </div>
                                                                        </div>
                                                                        
                                                                        <h4 style={{ fontSize: '1.1rem', fontWeight: 900, color: '#1e293b', marginBottom: '6px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{folderName}</h4>
                                                                        <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{(actualFolder?.files?.length || 0)} RESOURCES</span>
                                                                    </motion.div>
                                                                );
                                                            })}
                                                        </div>
                                                    );
                                                }
                                                return null;
                                            })()}

                                            {/* RENDER FILES */}
                                            {(() => {
                                                const currentPathStr = drivePath.join('/');
                                                const currentFolder = selectedBatch?.folders?.find((f: any) => f.name === currentPathStr);
                                                
                                                if (currentFolder && currentFolder.files?.length > 0) {
                                                    return (
                                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '0 25px', marginBottom: '5px' }}>
                                                                <div style={{ height: '1px', flex: 1, background: '#f1f5f9' }} />
                                                                <span style={{ fontSize: '0.7rem', fontWeight: 900, color: '#cbd5e1', textTransform: 'uppercase', letterSpacing: '2px' }}>Directory Content</span>
                                                                <div style={{ height: '1px', flex: 1, background: '#f1f5f9' }} />
                                                            </div>
                                                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                                                                {currentFolder.files.map((file: any, fIdx: number) => (
                                                                    <motion.div
                                                                        key={fIdx}
                                                                        whileHover={{ y: -4, boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}
                                                                        style={{ background: '#fff', padding: '1.5rem', borderRadius: '28px', border: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: '18px', transition: 'all 0.3s' }}
                                                                    >
                                                                        <div style={{ width: '50px', height: '50px', background: file.type === 'VIDEO' ? 'rgba(59, 130, 246, 0.08)' : 'rgba(16, 185, 129, 0.08)', borderRadius: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                                            {file.type === 'VIDEO' ? <Play size={22} color="#3b82f6" /> : <FileText size={22} color="#10b981" />}
                                                                        </div>
                                                                        <div style={{ flex: 1, overflow: 'hidden' }}>
                                                                            <h5 style={{ fontSize: '0.9rem', fontWeight: 850, color: '#334155', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginBottom: '2px' }}>{file.name}</h5>
                                                                            <span style={{ fontSize: '0.65rem', fontWeight: 800, color: '#94a3b8' }}>{new Date(file.uploadDate).toLocaleDateString()} • {file.size}</span>
                                                                        </div>
                                                                        <div style={{ display: 'flex', gap: '6px' }}>
                                                                            <button onClick={() => setViewFileTarget(file)} style={{ padding: '8px', background: '#f0f9ff', color: '#0ea5e9', borderRadius: '10px', border: 'none', cursor: 'pointer' }}><Eye size={14} /></button>
                                                                            <button onClick={() => handleDeleteFile(file.name)} style={{ padding: '8px', background: '#fef2f2', color: '#ef4444', borderRadius: '10px', border: 'none', cursor: 'pointer' }}><Trash2 size={14} /></button>
                                                                        </div>
                                                                    </motion.div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    );
                                                }
                                                return null;
                                            })()}

                                            {/* EMPTY STATE */}
                                            {(() => {
                                                const currentPathStr = drivePath.join('/');
                                                const folders = selectedBatch?.folders || [];
                                                const hasSubfolders = folders.some((f: any) => currentPathStr === '' ? true : f.name.startsWith(currentPathStr + '/'));
                                                const currentFolder = folders.find((f: any) => f.name === currentPathStr);
                                                const hasFiles = currentFolder?.files?.length > 0;

                                                if (!hasSubfolders && !hasFiles) {
                                                    return (
                                                        <div style={{ textAlign: 'center', padding: '6rem 2rem', background: 'rgba(248, 250, 252, 0.5)', borderRadius: '40px', border: '2px dashed #e2e8f0' }}>
                                                            <div style={{ width: '80px', height: '80px', background: '#fff', borderRadius: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', boxShadow: '0 10px 25px rgba(0,0,0,0.03)' }}>
                                                                <FolderOpen size={35} color="#cbd5e1" />
                                                            </div>
                                                            <h3 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#475569', marginBottom: '8px' }}>Directory is Empty</h3>
                                                            <p style={{ color: '#94a3b8', fontSize: '0.85rem', fontWeight: 600, maxWidth: '300px', margin: '0 auto 2rem' }}>This subdirectory doesn't contain any folders or resources yet.</p>
                                                            {currentPathStr !== '' && (
                                                                <button onClick={() => setDrivePath(drivePath.slice(0, -1))} className="btn-quantum" style={{ padding: '12px 30px', fontSize: '0.85rem' }}>
                                                                    <ChevronLeft size={16} /> GO BACK
                                                                </button>
                                                            )}
                                                        </div>
                                                    );
                                                }
                                                return null;
                                            })()}
                                        </div>
                                    </motion.div>
                                )}

                                {/* --- RECORDINGS CONTENT --- */}
                                {batchTab === 'RECORDINGS' && (
                                    <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="glass-panel" style={{ padding: '2.5rem', borderRadius: '40px', minHeight: '600px', flex: 1 }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                                            <h3 style={{ fontSize: '1.4rem', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                <Play color="var(--primary)" /> Session Recordings Vault
                                            </h3>
                                        </div>

                                        {liveSessions.filter(ls => ls.status === 'COMPLETED' || ls.recordingUrl).length === 0 ? (
                                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '400px' }}>
                                                <HardDrive size={64} style={{ marginBottom: '1.5rem', opacity: 0.1 }} />
                                                <h2 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '1rem', color: 'rgba(0,0,0,0.1)' }}>Vault is Empty</h2>
                                                <p style={{ color: 'var(--text-dim)', fontSize: '1rem', textAlign: 'center', maxWidth: '400px' }}>Once live sessions are concluded and recorded, they will be archived here.</p>
                                            </div>
                                        ) : (
                                            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))", gap: "2rem" }}>
                                                {liveSessions.filter(ls => ls.status === 'COMPLETED' || ls.recordingUrl).map((ls, idx) => {
                                                    const trainer = allUsers.find(u => String(u.id || u._id) === String(ls.tutorId));
                                                    const batchTrainer = allUsers.find(u => String(u.id || u._id) === String(selectedBatch?.trainerId));
                                                    const trainerName = (trainer?.fullName || trainer?.name) || (batchTrainer?.fullName || batchTrainer?.name) || 'Lead Instructor';
                                                    const sessionTime = new Date(ls.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                                                    
                                                    return (
                                                        <motion.div
                                                            key={idx}
                                                            whileHover={{ y: -5, boxShadow: "0 15px 40px rgba(0,0,0,0.08)" }}
                                                            style={{
                                                                background: "#ffffff",
                                                                border: "1px solid #e2e8f0",
                                                                borderRadius: "35px",
                                                                padding: "2.2rem",
                                                                display: "flex",
                                                                flexDirection: "column",
                                                                gap: "1.2rem",
                                                                position: "relative",
                                                                overflow: "hidden"
                                                            }}
                                                        >
                                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                                                <div>
                                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                                                                        <span style={{ padding: '6px 12px', borderRadius: '10px', background: 'rgba(139, 92, 246, 0.05)', color: 'var(--primary)', fontSize: '0.65rem', fontWeight: 900, letterSpacing: '1px' }}>{selectedCourse?.title || 'COURSE'}</span>
                                                                        <span style={{ padding: '6px 12px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.05)', color: '#10b981', fontSize: '0.65rem', fontWeight: 900 }}>{selectedBatch?.batchName || 'BATCH'}</span>
                                                                    </div>
                                                                    <h4 style={{ fontSize: "1.3rem", fontWeight: 900, color: "#1a202c" }}>{ls.title}</h4>
                                                                </div>
                                                                <div style={{ display: 'flex', gap: '8px' }}>
                                                                    <button onClick={() => { setShareTarget(ls); setShareCurrentPath([]); setIsShareModalOpen(true); setShareStep(1); }} style={{ background: '#f0f9ff', border: '1px solid #e0f2fe', color: '#0ea5e9', padding: '10px', borderRadius: '12px', cursor: 'pointer' }} title="Share to Drive"><Share2 size={16} /></button>
                                                                    <button onClick={(e) => handleDeleteSession(ls.id || ls._id, e)} style={{ background: '#fef2f2', border: '1px solid #fee2e2', color: '#ef4444', padding: '10px', borderRadius: '12px', cursor: 'pointer' }} title="Delete Archive"><Trash2 size={16} /></button>
                                                                </div>
                                                            </div>

                                                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', background: '#f8fafc', padding: '15px', borderRadius: '20px' }}>
                                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                                                    <span style={{ fontSize: '0.6rem', fontWeight: 900, color: '#a0aec0', textTransform: 'uppercase' }}>Session Time</span>
                                                                    <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#1a202c', display: 'flex', alignItems: 'center', gap: '6px' }}><Clock size={14} /> {sessionTime}</span>
                                                                </div>
                                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                                                    <span style={{ fontSize: '0.6rem', fontWeight: 900, color: '#a0aec0', textTransform: 'uppercase' }}>Instructor</span>
                                                                    <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#1a202c', display: 'flex', alignItems: 'center', gap: '6px' }}><User size={14} /> {trainerName}</span>
                                                                </div>
                                                            </div>

                                                            <button 
                                                                onClick={() => window.open(ls.recordingUrl || ls.meetingLink, '_blank')}
                                                                className="btn-quantum" 
                                                                style={{ width: '100%', padding: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', fontWeight: 900, borderRadius: '18px' }}
                                                            >
                                                                <Play size={18} fill="currentColor" /> WATCH RECORDING
                                                            </button>
                                                        </motion.div>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </motion.div>
                                )}

                                {/* --- LIVE SESSIONS CONTENT --- */}
                                {batchTab === 'LIVE' && (
                                    <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="glass-panel" style={{ padding: '2.5rem', borderRadius: '40px', minHeight: '600px' }}>

                                        {/* SESSION REQUESTS ARE NOW MANAGED VIA THE "Session Requests" BUTTON IN THE SIDEBAR MODAL */}

                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                                            <h3 style={{ fontSize: '1.4rem', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                <Video color="var(--primary)" /> Live Sessions Hub
                                            </h3>
                                            {currentUserRole !== 'STUDENT' && (
                                                <button onClick={() => setIsScheduleLiveModalOpen(true)} className="btn-quantum" style={{ padding: '10px 20px', fontSize: '0.85rem' }}>
                                                    <Plus size={16} /> SCHEDULE SESSION
                                                </button>
                                            )}
                                        </div>

                                        {liveSessions.length === 0 ? (
                                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '400px' }}>
                                                <Video size={64} color="var(--secondary)" style={{ marginBottom: '1.5rem', WebkitFilter: 'drop-shadow(0 0 20px rgba(168,85,247,0.4))' }} />
                                                <h2 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '1rem' }}>No Upcoming Live Sessions</h2>
                                                <p style={{ color: 'var(--text-dim)', fontSize: '1rem', textAlign: 'center', maxWidth: '400px' }}>Schedule virtual classes and they will appear here.</p>
                                                {currentUserRole !== 'STUDENT' && <button onClick={() => setIsScheduleLiveModalOpen(true)} className="btn-quantum" style={{ marginTop: '2rem', padding: '12px 24px', fontSize: '0.9rem' }}>SCHEDULE LIVE CLASS</button>}
                                            </div>
                                        ) : (
                                            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "2rem" }}>
                                                {liveSessions.map((ls, idx) => (
                                                    <motion.div
                                                        key={idx}
                                                        whileHover={{ y: -5, boxShadow: "0 15px 40px rgba(0,0,0,0.12)" }}
                                                        style={{
                                                            background: "#ffffff",
                                                            border: "1px solid #e2e8f0",
                                                            borderRadius: "35px",
                                                            padding: "2.5rem",
                                                            display: "flex",
                                                            flexDirection: "column",
                                                            gap: "1.5rem",
                                                            position: "relative",
                                                            overflow: "hidden",
                                                            boxShadow: "0 10px 25px rgba(0,0,0,0.05)"
                                                        }}
                                                    >
                                                        <div style={{ position: "absolute", top: 0, left: 0, width: "6px", height: "100%", background: ls.status === "LIVE" ? "#10b981" : "var(--primary)" }} />
                                                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                                                            <div>
                                                                <h4 style={{ fontSize: "1.4rem", fontWeight: 900, color: "#1a202c" }}>{ls.title}</h4>
                                                                <span style={{ fontSize: "0.75rem", fontWeight: 900, color: "var(--primary)", letterSpacing: "2px", textTransform: "uppercase" }}>Live Transmission</span>
                                                            </div>
                                                            {currentUserRole !== 'STUDENT' && (
                                                                <div style={{ display: "flex", gap: "8px" }}>
                                                                    {sessionRequests.find(r => (r.sessionId === ls.id || r.sessionId === ls._id) && r.status === 'PENDING') ? (
                                                                        <span style={{ fontSize: '0.65rem', fontWeight: 900, color: '#f59e0b', background: '#fffbeb', padding: '6px 12px', borderRadius: '10px', border: '1px solid #fef3c7', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                                                            <Clock size={12} /> PENDING {sessionRequests.find(r => (r.sessionId === ls.id || r.sessionId === ls._id) && r.status === 'PENDING')?.type}
                                                                        </span>
                                                                    ) : (
                                                                        <>
                                                                            <button onClick={(e) => handleOpenEditSession(ls, e)} style={{ background: "#f8fafc", border: "1px solid #e2e8f0", color: "#4a5568", padding: "10px", borderRadius: "12px", cursor: "pointer" }}><Edit2 size={18} /></button>
                                                                            <button onClick={(e) => handleDeleteSession(ls.id || ls._id, e)} style={{ background: "#fef2f2", border: "1px solid #fee2e2", color: "#ef4444", padding: "10px", borderRadius: "12px", cursor: "pointer" }}><Trash2 size={18} /></button>
                                                                        </>
                                                                    )}
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                                                            <div style={{ display: "flex", alignItems: "center", gap: "12px", color: "#2d3748" }}>
                                                                <User size={18} color="var(--primary)" />
                                                                <span style={{ fontSize: "1rem", fontWeight: 700 }}>Trainer: <b style={{ color: "var(--primary)" }}>{ls.mentorName || "Unassigned"}</b></span>
                                                            </div>
                                                            <div style={{ display: "flex", alignItems: "center", gap: "12px", color: "#718096" }}>
                                                                <Calendar size={18} />
                                                                <span style={{ fontSize: "0.9rem" }}>{new Date(ls.startTime).toLocaleString()}</span>
                                                            </div>
                                                            <div style={{ display: "flex", alignItems: "center", gap: "12px", color: "#a0aec0" }}>
                                                                <Clock size={16} />
                                                                <span style={{ fontSize: "0.85rem" }}>{ls.duration} Minutes • {ls.platform}</span>
                                                            </div>
                                                        </div>
                                                        <button
                                                            onClick={() => {
                                                                if (currentUserRole === 'STUDENT') {
                                                                    // Check if student has an APPROVED request for this session
                                                                    const approvedReq = sessionRequests.find(r => (r.sessionId === ls.id || r.sessionId === ls._id) && r.status === 'APPROVED');
                                                                    if (approvedReq) {
                                                                        router.push(`/super-admin/live/room/${encodeURIComponent(ls.meetingLink || ls.title)}`);
                                                                    } else {
                                                                        setSelectedSessionForRequest(ls);
                                                                        setJoinRequestForm({
                                                                            studentName: currentUser?.fullName || currentUser?.email || 'Student',
                                                                            courseName: ls.courseName || 'Full Stack',
                                                                            batchName: ls.batchName || 'Default',
                                                                            message: ''
                                                                        });
                                                                        setIsJoinRequestModalOpen(true);
                                                                    }
                                                                } else {
                                                                    router.push(`/super-admin/live/room/${encodeURIComponent(ls.meetingLink || ls.title)}`);
                                                                }
                                                            }}
                                                            className="btn-quantum"
                                                            style={{ marginTop: "1rem", padding: "16px", fontSize: "1rem", fontWeight: 900, background: ls.status === "LIVE" ? "#10b981" : "var(--primary)", borderRadius: "20px", border: "none", color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", boxShadow: "0 10px 20px rgba(139, 92, 246, 0.3)" }}>
                                                            🎥 {currentUserRole === 'STUDENT' && !sessionRequests.find(r => (r.sessionId === ls.id || r.sessionId === ls._id) && r.status === 'APPROVED') ? 'REQUEST ACCESS' : 'JOIN WEBRTC ROOM'}
                                                        </button>
                                                    </motion.div>
                                                ))}
                                            </div>
                                        )}
                                    </motion.div>
                                )}


                                <AnimatePresence>
                                    {isAccessModalOpen && (
                                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="modal-overlay" style={{ position: 'fixed', inset: 0, zIndex: 110000, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(20px)' }}>
                                            <motion.div initial={{ scale: 0.9, y: 30 }} animate={{ scale: 1, y: 0 }} className="glass-panel" style={{ width: '95%', maxWidth: '750px', padding: 0, borderRadius: '40px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
                                                {/* MODAL HEADER */}
                                                <div style={{ background: 'var(--primary)', padding: '2.5rem', color: '#fff', position: 'relative' }}>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                        <div>
                                                            <span style={{ fontSize: '0.75rem', fontWeight: 900, color: 'rgba(255,255,255,0.6)', letterSpacing: '3px', textTransform: 'uppercase' }}>Access Control</span>
                                                            <h2 style={{ fontSize: '2rem', fontWeight: 900, marginTop: '5px', letterSpacing: '-1px' }}>Manage Access</h2>
                                                            <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem', marginTop: '5px' }}>
                                                                {accessTarget?.batchName ? "Target Batch: " : "Target Folder: "}
                                                                <span style={{ color: '#fff', fontWeight: 800 }}>{accessTarget?.batchName || accessTarget?.name}</span>
                                                            </p>
                                                        </div>
                                                        <button onClick={() => setIsAccessModalOpen(false)} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', padding: '12px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><X size={24} /></button>
                                                    </div>
                                                </div>

                                                <div style={{ padding: '2.5rem', display: 'flex', flexDirection: 'column', gap: '2rem', maxHeight: '65vh', overflowY: 'auto' }}>
                                                    {/* ADD USER SECTION */}
                                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                                        <label style={{ fontSize: '0.8rem', fontWeight: 900, color: 'var(--text-dim)', letterSpacing: '1px' }}>ADD STUDENT OR FACULTY</label>
                                                        <div style={{ display: 'flex', gap: '12px' }}>
                                                            <div style={{ position: 'relative', flex: 1 }}>
                                                                <Search size={18} style={{ position: 'absolute', left: '18px', top: '15px', color: 'var(--primary)' }} />
                                                                <input value={accessSearchTerm} onChange={(e) => setAccessSearchTerm(e.target.value)} placeholder="Search by Email or Name..." style={{ ...inputStyle, paddingLeft: '50px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px' }} />
                                                            </div>
                                                            <select value={accessRole} onChange={(e) => setAccessRole(e.target.value)} style={{ ...inputStyle, width: '130px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.03)', color: '#fff', fontWeight: 700, borderRadius: '16px' }}>
                                                                <option value="VIEWER">VIEWER</option>
                                                                <option value="EDITOR">EDITOR</option>
                                                                <option value="OWNER">OWNER</option>
                                                            </select>
                                                        </div>

                                                        {accessSearchTerm && (
                                                            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ background: 'rgba(30, 41, 59, 0.95)', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.1)', maxHeight: '180px', overflowY: 'auto', boxShadow: '0 10px 40px rgba(0,0,0,0.5)' }}>
                                                                {allUsers.filter(u => u.email?.toLowerCase().includes(accessSearchTerm.toLowerCase()) || u.fullName?.toLowerCase().includes(accessSearchTerm.toLowerCase())).map((u: any) => (
                                                                    <button key={u.id} onClick={() => { handleUpdateAccess(u, accessRole); setAccessSearchTerm(''); }} style={{ width: '100%', padding: '15px 25px', border: 'none', background: 'none', color: '#fff', textAlign: 'left', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                                                        <div>
                                                                            <div style={{ fontWeight: 800, fontSize: '0.95rem' }}>{u.fullName}</div>
                                                                            <div style={{ color: 'var(--text-dim)', fontSize: '0.75rem' }}>{u.email}</div>
                                                                        </div>
                                                                        <div style={{ padding: '8px', background: 'rgba(124, 58, 237, 0.2)', borderRadius: '12px' }}>
                                                                            <Plus size={18} color="#fff" />
                                                                        </div>
                                                                    </button>
                                                                ))}
                                                            </motion.div>
                                                        )}
                                                    </div>

                                                    {/* CURRENT MEMBERS LIST */}
                                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                                        <label style={{ fontSize: '0.8rem', fontWeight: 900, color: 'var(--text-dim)', letterSpacing: '1px' }}>STUDENTS & STAFF</label>
                                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                                            {(() => {
                                                                const combined = [...(accessTarget?.sharedWith || [])];

                                                                // Add Core Tutors
                                                                selectedBatch?.trainerIds?.forEach((id: string) => {
                                                                    const user = allUsers.find(u => u.id === id || u._id === id);
                                                                    if (user && !combined.find(s => s.email === user.email)) {
                                                                        combined.push({ email: user.email, name: user.fullName, role: 'BATCH TUTOR', isCore: true });
                                                                    }
                                                                });

                                                                // Add Core Students
                                                                selectedBatch?.studentIds?.forEach((id: string) => {
                                                                    const user = allUsers.find(u => u.id === id || u._id === id || u.email === id);
                                                                    if (user && !combined.find(s => s.email === user.email)) {
                                                                        combined.push({ email: user.email, name: user.fullName, role: 'STUDENT', isCore: true });
                                                                    }
                                                                });

                                                                return combined.length > 0 ? combined.map((member: any) => (
                                                                    <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} key={member.email} style={{ background: 'rgba(255,255,255,0.03)', padding: '1.2rem', borderRadius: '18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)' }}>
                                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                                                            <div style={{ width: 42, height: 42, borderRadius: '12px', background: member.isCore ? 'linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))' : 'linear-gradient(135deg, var(--primary), #4f46e5)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, color: '#fff', fontSize: '0.9rem', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>{member.name?.[0] || 'U'}</div>
                                                                            <div>
                                                                                <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#fff' }}>{member.name}</div>
                                                                                <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', fontWeight: 600 }}>{member.email}</div>
                                                                            </div>
                                                                        </div>
                                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                                            <span style={{ fontSize: '0.65rem', fontWeight: 900, color: 'rgba(255,255,255,0.7)', background: 'rgba(255,255,255,0.05)', padding: '5px 12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', letterSpacing: '1px', textTransform: 'uppercase' }}>{member.role}</span>
                                                                            {!member.isCore ? (
                                                                                <button onClick={() => handleRemoveAccess(member.email)} style={{ background: 'rgba(239, 68, 68, 0.15)', border: 'none', color: '#f87171', cursor: 'pointer', padding: '10px', borderRadius: '12px', transition: 'all 0.2s' }}><Trash2 size={16} /></button>
                                                                            ) : (
                                                                                <button onClick={() => { setAccessSearchTerm(member.email); setAccessRole('EDITOR'); }} style={{ background: 'rgba(59, 130, 246, 0.15)', border: 'none', color: '#60a5fa', cursor: 'pointer', padding: '10px', borderRadius: '12px', transition: 'all 0.2s' }} title="Promote to Editor"><Plus size={16} /></button>
                                                                            )}
                                                                        </div>
                                                                    </motion.div>
                                                                )) : (
                                                                    <div style={{ textAlign: 'center', padding: '4rem 2rem', border: '2px dashed rgba(255,255,255,0.05)', borderRadius: '32px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px', background: 'rgba(255,255,255,0.01)' }}>
                                                                        <Users size={40} style={{ color: 'rgba(255,255,255,0.1)' }} />
                                                                        <p style={{ color: 'rgba(255,255,255,0.3)', fontWeight: 700, fontSize: '0.9rem' }}>No individual access members added yet.</p>
                                                                    </div>
                                                                );
                                                            })()}
                                                        </div>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {/* --- STUDENT JOIN REQUEST MODAL --- */}
                                <AnimatePresence>
                                    {isJoinRequestModalOpen && selectedSessionForRequest && (
                                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="modal-overlay" style={{ position: 'fixed', inset: 0, zIndex: 110000, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(20px)' }}>
                                            <motion.div initial={{ scale: 0.9, y: 30 }} animate={{ scale: 1, y: 0 }} style={{ width: '95%', maxWidth: '550px', padding: '3.5rem', borderRadius: '45px', background: '#ffffff', boxShadow: '0 25px 80px rgba(0,0,0,0.4)', border: '1px solid #e2e8f0' }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '3rem' }}>
                                                    <div>
                                                        <span style={{ fontSize: '0.75rem', fontWeight: 900, color: 'var(--primary)', letterSpacing: '3px', textTransform: 'uppercase' }}>Security Protocol</span>
                                                        <h2 style={{ fontSize: '2.2rem', fontWeight: 900, color: '#1a202c', marginTop: '10px' }}>Request Live Access</h2>
                                                        <p style={{ color: '#718096', fontSize: '0.95rem', marginTop: '8px' }}>Target Session: <b style={{ color: 'var(--primary)' }}>{selectedSessionForRequest.title}</b></p>
                                                    </div>
                                                    <button onClick={() => setIsJoinRequestModalOpen(false)} style={{ background: '#f7fafc', border: '1px solid #e2e8f0', color: '#1a202c', padding: '10px', borderRadius: '50%', cursor: 'pointer' }}><X size={26} /></button>
                                                </div>

                                                <form onSubmit={handleJoinRequestSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                                                        <div className="input-field shadow-sm" style={{ padding: '20px', borderRadius: '20px', background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                                                            <label style={{ fontSize: '0.7rem', fontWeight: 900, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '10px', display: 'block' }}>Student Identity</label>
                                                            <input value={joinRequestForm.studentName} onChange={e => setJoinRequestForm({ ...joinRequestForm, studentName: e.target.value })} style={{ width: '100%', background: 'transparent', border: 'none', fontSize: '1.1rem', fontWeight: 700, color: '#1a202c' }} required />
                                                        </div>
                                                        <div className="input-field shadow-sm" style={{ padding: '20px', borderRadius: '20px', background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                                                            <label style={{ fontSize: '0.7rem', fontWeight: 900, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '10px', display: 'block' }}>Batch Stream</label>
                                                            <input value={joinRequestForm.batchName} onChange={e => setJoinRequestForm({ ...joinRequestForm, batchName: e.target.value })} style={{ width: '100%', background: 'transparent', border: 'none', fontSize: '1.1rem', fontWeight: 700, color: '#1a202c' }} required />
                                                        </div>
                                                    </div>
                                                    <div className="input-field shadow-sm" style={{ padding: '20px', borderRadius: '20px', background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                                                        <label style={{ fontSize: '0.7rem', fontWeight: 900, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '10px', display: 'block' }}>Target Course</label>
                                                        <input value={joinRequestForm.courseName} onChange={e => setJoinRequestForm({ ...joinRequestForm, courseName: e.target.value })} style={{ width: '100%', background: 'transparent', border: 'none', fontSize: '1.1rem', fontWeight: 700, color: '#1a202c' }} required />
                                                    </div>
                                                    <div className="input-field shadow-sm" style={{ padding: '20px', borderRadius: '20px', background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                                                        <label style={{ fontSize: '0.7rem', fontWeight: 900, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '10px', display: 'block' }}>Authorization Message</label>
                                                        <textarea value={joinRequestForm.message} onChange={e => setJoinRequestForm({ ...joinRequestForm, message: e.target.value })} rows={3} style={{ width: '100%', background: 'transparent', border: 'none', fontSize: '1rem', fontWeight: 600, color: '#1a202c', resize: 'none' }} placeholder="Provide purpose for joining..." />
                                                    </div>
                                                    <button type="submit" className="btn-quantum" style={{ padding: '22px', borderRadius: '24px', fontSize: '1.1rem', fontWeight: 900, width: '100%', boxShadow: '0 15px 35px rgba(139, 92, 246, 0.4)' }}>SUBMIT ACCESS REQUEST</button>
                                                </form>
                                            </motion.div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {/* --- ASSIGNMENTS CONTENT --- */}
                                {batchTab === 'ASSIGNMENTS' && (
                                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                                            <div>
                                                <h3 style={{ fontSize: '1.8rem', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '12px', color: '#1a202c' }}>
                                                    <FileText color="#10b981" /> Academic Assignments
                                                </h3>
                                                <p style={{ color: '#718096', fontSize: '0.9rem' }}>Project tracking, submissions, and performance auditing.</p>
                                            </div>
                                            {role !== 'student' && (
                                                <button onClick={() => setIsCreateAssignmentModalOpen(true)} className="btn-quantum" style={{ padding: '16px 32px', background: '#10b981', borderRadius: '18px', fontSize: '1rem', fontWeight: 900 }}>+ NEW ASSIGNMENT</button>
                                            )}
                                        </div>

                                        {batchAssignments.length === 0 ? (
                                            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', borderRadius: '45px', padding: '4rem', border: '1px solid #e2e8f0' }}>
                                                <div style={{ width: 100, height: 100, borderRadius: '35px', background: 'rgba(16, 185, 129, 0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
                                                    <FileText size={48} color="#10b981" />
                                                </div>
                                                <h2 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#1a202c' }}>Assignment Queue Empty</h2>
                                                <p style={{ color: '#718096', fontSize: '1rem', textAlign: 'center', maxWidth: '350px', marginTop: '10px' }}>Distribute projects or exams to this batch to start tracking performance and submissions.</p>
                                                {role !== 'student' && (
                                                    <button onClick={() => setIsCreateAssignmentModalOpen(true)} className="btn-quantum" style={{ marginTop: '2.5rem', padding: '12px 24px', background: '#10b981' }}>CREATE FIRST ASSIGNMENT</button>
                                                )}
                                            </div>
                                        ) : (
                                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '2rem' }}>
                                                {batchAssignments.map((a, idx) => {
                                                    const submissionCount = a.submissions?.length || 0;
                                                    const totalStudents = students.length || 1;
                                                    const completionRate = Math.round((submissionCount / totalStudents) * 100);

                                                    return (
                                                        <motion.div
                                                            key={idx}
                                                            whileHover={{ y: -8, boxShadow: '0 20px 40px rgba(0,0,0,0.06)' }}
                                                            style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '35px', padding: '2.2rem', display: 'flex', flexDirection: 'column', gap: '1.2rem', position: 'relative' }}
                                                        >
                                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                                                <div style={{ display: 'flex', gap: '10px' }}>
                                                                    <span style={{ padding: '6px 14px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.05)', color: '#10b981', fontSize: '0.75rem', fontWeight: 900 }}>{a.difficulty}</span>
                                                                    <span style={{ padding: '6px 14px', borderRadius: '10px', background: '#f7fafc', color: '#1a202c', fontSize: '0.75rem', fontWeight: 900 }}>ASSIGNMENT</span>
                                                                </div>
                                                                {role !== 'student' && (
                                                                    <div style={{ display: 'flex', gap: '8px' }}>
                                                                        <button onClick={() => { setEditingAssignment(a); setIsEditAssignmentModalOpen(true); }} style={{ background: 'none', border: 'none', color: '#718096', cursor: 'pointer' }}><Edit2 size={18} /></button>
                                                                        <button onClick={(e) => handleDeleteAssignment(a.id, e)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}><Trash2 size={18} /></button>
                                                                    </div>
                                                                )}
                                                            </div>

                                                            <div>
                                                                <h4 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#1a202c', marginBottom: '8px' }}>{a.title}</h4>
                                                                <p style={{ fontSize: '0.9rem', color: '#718096', lineHeight: '1.6', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{a.description}</p>
                                                            </div>

                                                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', background: '#f8fafc', padding: '15px', borderRadius: '20px' }}>
                                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                                                    <span style={{ fontSize: '0.65rem', fontWeight: 900, color: '#a0aec0', textTransform: 'uppercase' }}>Due Date</span>
                                                                    <span style={{ fontSize: '0.9rem', fontWeight: 800, color: '#1a202c', display: 'flex', alignItems: 'center', gap: '6px' }}><Clock size={14} /> {new Date(a.dueDate).toLocaleDateString()}</span>
                                                                </div>
                                                            </div>

                                                            <div>
                                                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '0.85rem', fontWeight: 900 }}>
                                                                    <span style={{ color: '#1a202c' }}>Students Submitted</span>
                                                                    <span style={{ color: '#10b981' }}>{submissionCount} / {totalStudents}</span>
                                                                </div>
                                                                <div style={{ height: '10px', background: '#edf2f7', borderRadius: '20px', overflow: 'hidden' }}>
                                                                    <motion.div initial={{ width: 0 }} animate={{ width: `${completionRate}%` }} style={{ height: '100%', background: '#10b981' }} />
                                                                </div>
                                                            </div>

                                                            <button onClick={() => setViewingSubmissionsAssignment(a)} className="btn-quantum" style={{ width: '100%', padding: '15px', background: 'rgba(139, 92, 246, 0.05)', color: 'var(--primary)', border: '1px solid rgba(139, 92, 246, 0.2)', fontWeight: 900, borderRadius: '18px', marginTop: '10px' }}>
                                                                VIEW SUBMISSIONS
                                                            </button>
                                                        </motion.div>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </motion.div>
                                )}
                                {/* --- ANALYTICS CONTENT --- */}
                                {['ANALYTICS'].includes(batchTab) && (
                                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ flex: 1 }}>
                                        <MockInterviewEngine activeView="ANALYTICS" role={currentUserRole} />
                                    </motion.div>
                                )}

                                {batchTab === 'TRACKING' && (
                                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-panel" style={{ padding: '2.5rem', borderRadius: '40px', minHeight: '600px', flex: 1 }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                                            <h3 style={{ fontSize: '1.4rem', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                <Users color="var(--primary)" /> {role === 'student' ? 'MY PERFORMANCE TRACKING' : 'STUDENT PERFORMANCE TRACKING'}
                                            </h3>
                                            {role !== 'student' && (
                                                <div style={{ position: 'relative', width: '300px' }}>
                                                    <Search style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', opacity: 0.3 }} size={18} />
                                                    <input 
                                                        type="text" 
                                                        placeholder="Search student or email..." 
                                                        value={trackingSearchTerm}
                                                        onChange={(e) => setTrackingSearchTerm(e.target.value)}
                                                        style={{ ...inputStyle, paddingLeft: '45px', borderRadius: '15px', background: 'rgba(0,0,0,0.02)', border: '1px solid rgba(0,0,0,0.05)' }} 
                                                    />
                                                </div>
                                            )}
                                        </div>

                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem' }}>
                                            {studentTracking.filter(s => {
                                                const matchesSearch = s.name?.toLowerCase().includes(trackingSearchTerm.toLowerCase()) || 
                                                                    s.email?.toLowerCase().includes(trackingSearchTerm.toLowerCase());
                                                if (role === 'student') {
                                                    return matchesSearch && (s.email === currentUser?.email || s.id === (currentUser?.id || currentUser?._id));
                                                }
                                                return matchesSearch;
                                            }).length === 0 ? (
                                                <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '5rem', background: 'rgba(0,0,0,0.02)', borderRadius: '32px' }}>
                                                    <Users size={48} style={{ opacity: 0.1, marginBottom: '1rem' }} />
                                                    <p style={{ fontWeight: 800, color: '#666' }}>{role === 'student' ? 'Your performance data is being processed...' : 'No students found matching your search.'}</p>
                                                </div>
                                            ) : (
                                                studentTracking.filter(s => {
                                                    const matchesSearch = s.name?.toLowerCase().includes(trackingSearchTerm.toLowerCase()) || 
                                                                        s.email?.toLowerCase().includes(trackingSearchTerm.toLowerCase());
                                                    if (role === 'student') {
                                                        return matchesSearch && (s.email === currentUser?.email || s.id === (currentUser?.id || currentUser?._id));
                                                    }
                                                    return matchesSearch;
                                                }).map((student) => (
                                                    <motion.div 
                                                        key={student.id} 
                                                        whileHover={{ y: -5, boxShadow: '0 20px 40px rgba(124, 58, 237, 0.1)' }} 
                                                        onClick={() => {
                                                            setSelectedStudentForHistory(student);
                                                            setIsStudentHistoryModalOpen(true);
                                                        }}
                                                        style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '32px', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', cursor: 'pointer', transition: 'all 0.3s' }}
                                                    >
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                                            <div style={{ width: 60, height: 60, borderRadius: '20px', background: 'rgba(124, 58, 237, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                                                                {student.profileImage ? (
                                                                    <img src={student.profileImage} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" />
                                                                ) : (
                                                                    <User size={30} color="var(--primary)" />
                                                                )}
                                                            </div>
                                                            <div>
                                                                <h4 style={{ fontSize: '1.1rem', fontWeight: 900, color: '#1a202c' }}>{student.name}</h4>
                                                                <p style={{ fontSize: '0.8rem', color: '#718096', fontWeight: 700 }}>{student.email}</p>
                                                            </div>
                                                        </div>

                                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                                                            <div style={{ background: '#f8fafc', padding: '1.2rem', borderRadius: '24px' }}>
                                                                <p style={{ fontSize: '0.65rem', fontWeight: 900, color: '#a0aec0', textTransform: 'uppercase' }}>Interviews</p>
                                                                <p style={{ fontSize: '1rem', fontWeight: 900, color: '#1a202c' }}>{student.interviewsAttended} <span style={{ fontSize: '0.7rem', color: '#10b981' }}>({student.avgInterviewScore}%)</span></p>
                                                            </div>
                                                            <div style={{ background: '#f8fafc', padding: '1.2rem', borderRadius: '24px' }}>
                                                                <p style={{ fontSize: '0.65rem', fontWeight: 900, color: '#a0aec0', textTransform: 'uppercase' }}>Attendance</p>
                                                                <p style={{ fontSize: '1rem', fontWeight: 900, color: '#1a202c' }}>{student.attendanceRate}% <span style={{ fontSize: '0.7rem', color: Number(student.attendanceRate) > 75 ? '#10b981' : '#f59e0b' }}>Rate</span></p>
                                                            </div>
                                                            <div style={{ background: '#f8fafc', padding: '1.2rem', borderRadius: '24px', gridColumn: 'span 2' }}>
                                                                <p style={{ fontSize: '0.65rem', fontWeight: 900, color: '#a0aec0', textTransform: 'uppercase' }}>Tests Taken</p>
                                                                <p style={{ fontSize: '1rem', fontWeight: 900, color: '#1a202c' }}>{student.testsTaken} <span style={{ fontSize: '0.7rem', color: '#6366f1' }}>({student.avgTestScore}%)</span></p>
                                                            </div>
                                                        </div>

                                                        <div>
                                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.85rem', fontWeight: 900 }}>
                                                                <span>Overall Performance</span>
                                                                <span style={{ color: 'var(--primary)' }}>{student.overallProgress}%</span>
                                                            </div>
                                                            <div style={{ height: '10px', background: '#edf2f7', borderRadius: '20px', overflow: 'hidden' }}>
                                                                <motion.div initial={{ width: 0 }} animate={{ width: `${student.overallProgress}%` }} style={{ height: '100%', background: 'linear-gradient(90deg, #8b5cf6, #7c3aed)' }} />
                                                            </div>
                                                        </div>
                                                        <div style={{ textAlign: 'center', fontSize: '0.75rem', fontWeight: 800, color: 'var(--primary)', opacity: 0.8 }}>VIEW FULL HISTORY →</div>
                                                    </motion.div>
                                                ))
                                            )}
                                        </div>
                                    </motion.div>
                                )}
                            </div>

                            {/* --- RIGHT INFO PANEL --- */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
                                <div className="glass-panel" style={{ padding: '2rem', borderRadius: '32px' }}>
                                    <h4 style={{ fontSize: '1rem', fontWeight: 900, color: 'var(--primary)', marginBottom: '1.5rem', textTransform: 'uppercase' }}>Batch Context</h4>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                        <InfoSnippet icon={<User size={18} />} label="Faculty / Tutors" value={assignedTutors.length > 0 ? assignedTutors.map(t => t.fullName || t.email?.split('@')[0]).join(', ') : 'Pending'} />
                                        <InfoSnippet icon={<Users size={18} />} label="Student Access" value={`${students.length} Active`} />
                                        <InfoSnippet icon={<Calendar size={18} />} label="Drive Created" value={selectedBatch?.createdAt ? new Date(selectedBatch.createdAt).toLocaleDateString() : '09/04/2026'} />
                                        <div
                                            onClick={() => { setIsRequestDetailModalOpen(true); fetchData(); }}
                                            style={{
                                                marginTop: '10px',
                                                padding: '12px 20px',
                                                background: 'rgba(59, 130, 246, 0.05)',
                                                border: '1px solid rgba(59, 130, 246, 0.2)',
                                                borderRadius: '16px',
                                                cursor: 'pointer',
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center'
                                            }}
                                        >
                                            <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                <Send size={16} /> Session Requests
                                            </span>
                                            <span style={{ background: 'var(--primary)', color: '#000', fontSize: '0.7rem', fontWeight: 900, padding: '2px 8px', borderRadius: '8px' }}>
                                                {sessionRequests.filter(r => (r.data?.batchId === selectedBatch?.id || r.data?.batchId === selectedBatch?._id) && r.status === 'PENDING').length}
                                            </span>
                                        </div>
                                    </div>
                                    {isFullAdmin && (
                                        <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                            <button onClick={() => {
                                                setEditBatchData({
                                                    ...selectedBatch,
                                                    startDate: selectedBatch.startDate ? selectedBatch.startDate.split('T')[0] : '',
                                                    endDate: selectedBatch.endDate ? selectedBatch.endDate.split('T')[0] : ''
                                                });
                                                setIsEditBatchOpen(true);
                                            }} className="btn-quantum" style={{ padding: '10px', fontSize: '0.8rem', width: '100%', background: 'var(--primary)' }}>EDIT BATCH</button>
                                            <button onClick={() => setIsTutorModalOpen(true)} className="btn-quantum" style={{ padding: '10px', fontSize: '0.8rem', width: '100%' }}>ASSIGN TUTOR</button>
                                            <button onClick={() => setIsStudentModalOpen(true)} className="btn-quantum" style={{ padding: "10px", fontSize: "0.8rem", background: "var(--secondary)", width: "100%" }}>MANAGE BATCH STUDENTS</button>
                                            <button onClick={() => handleOpenAccess(selectedBatch)} className="btn-quantum" style={{ padding: "10px", fontSize: "0.8rem", width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid var(--primary)", color: "var(--primary)" }}>MANAGE BATCH ACCESS</button>
                                            <button onClick={(e) => handleDeleteBatch(selectedBatch.id, e)} className="btn-quantum" style={{ padding: "10px", fontSize: "0.8rem", background: "#ef4444", width: "100%", border: "none" }}>DELETE BATCH</button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    )}
                    {/* --- EXAMS MODULE --- */}
                    {viewMode === 'EXAMS' && (
                        <motion.div key="exams" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                            <ExamManagement />
                        </motion.div>
                    )}

                    {/* --- MOCK INTERVIEW ENGINE --- */}
                    {viewMode === 'ANALYTICS' && (
                        <motion.div key="mock-interviews" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                            <MockInterviewEngine role={role} />
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>

            {/* --- CREATE FOLDER MODAL --- */}
            <AnimatePresence>
                {isCreateFolderOpen && (
                    <div style={{ position: 'fixed', inset: 0, zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)' }}>
                        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="glass-panel" style={{ width: '90%', maxWidth: '400px', padding: '3rem', borderRadius: '40px' }}>
                            <h2 style={{ fontSize: '1.8rem', fontWeight: 900, marginBottom: '2rem' }}>New Folder</h2>
                            <form onSubmit={handleCreateFolder}>
                                <input value={newFolderName} onChange={(e) => setNewFolderName(e.target.value)} autoFocus placeholder="Folder Name" style={inputStyle} />
                                <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                                    <button type="button" onClick={() => setIsCreateFolderOpen(false)} style={{ flex: 1, padding: '12px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', color: '#fff', border: 'none', cursor: 'pointer' }}>CANCEL</button>
                                    <button type="submit" className="btn-quantum" style={{ flex: 2, padding: '12px', borderRadius: '12px' }}>CREATE</button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* --- CREATE BATCH MODAL --- */}
            <AnimatePresence>
                {/* --- CREATE COURSE MODAL --- */}
                {isCreateCourseOpen && (
                    <div style={{ position: 'fixed', inset: 0, zIndex: 11000, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(20px)' }}>
                        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="glass-panel" style={{ width: '600px', padding: '3rem', borderRadius: '40px', border: '1px solid rgba(255,255,255,0.1)', position: 'relative' }}>
                            <button onClick={() => setIsCreateCourseOpen(false)} style={{ position: 'absolute', top: '30px', right: '30px', background: 'none', border: 'none', color: 'var(--text-dim)', cursor: 'pointer' }}><X size={24} /></button>
                            <h2 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '15px' }}>
                                <BookOpen size={32} color="var(--primary)" /> DEPLOY NEW COURSE
                            </h2>
                            <form onSubmit={handleCreateCourse} style={{ display: 'grid', gap: '20px' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-dim)', marginBottom: '8px' }}>NAME OF THE COURSE</label>
                                    <input type="text" required placeholder="e.g. Master React & Next.js" style={inputStyle} value={newCourse.title} onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })} />
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-dim)', marginBottom: '8px' }}>DATE OF CREATING</label>
                                        <input type="date" required style={inputStyle} value={newCourse.createdAt} onChange={(e) => setNewCourse({ ...newCourse, createdAt: e.target.value })} />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-dim)', marginBottom: '8px' }}>DURATION (MONTHS)</label>
                                        <input type="text" required placeholder="e.g. 6 Months" style={inputStyle} value={newCourse.duration} onChange={(e) => setNewCourse({ ...newCourse, duration: e.target.value })} />
                                    </div>
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-dim)', marginBottom: '8px' }}>FEE OF THE COURSE (INR)</label>
                                    <input type="number" required placeholder="0.00" style={inputStyle} value={newCourse.price} onChange={(e) => setNewCourse({ ...newCourse, price: Number(e.target.value) })} />
                                </div>
                                <button type="submit" className="btn-quantum" style={{ padding: '16px', fontWeight: 900, marginTop: '10px' }}>
                                    INITIALIZE COURSE DEPLOYMENT
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* --- STUDENT HISTORY MODAL --- */}
            <AnimatePresence>
                {isStudentHistoryModalOpen && selectedStudentForHistory && (
                    <div style={{ position: 'fixed', inset: 0, zIndex: 120000, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(15px)' }}>
                        <motion.div initial={{ scale: 0.9, opacity: 0, y: 50 }} animate={{ scale: 1, opacity: 1, y: 0 }} className="glass-panel" style={{ width: '95%', maxWidth: '900px', height: '85vh', borderRadius: '40px', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                            {/* MODAL HEADER */}
                            <div style={{ background: 'var(--primary)', padding: '2.5rem', color: '#fff', position: 'relative' }}>
                                <button onClick={() => setIsStudentHistoryModalOpen(false)} style={{ position: 'absolute', top: '30px', right: '30px', background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', padding: '12px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><X size={20} /></button>
                                <div style={{ display: 'flex', gap: '25px', alignItems: 'center' }}>
                                    <div style={{ width: 80, height: 80, borderRadius: '25px', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', border: '4px solid rgba(255,255,255,0.1)' }}>
                                        {selectedStudentForHistory.profileImage ? (
                                            <img src={selectedStudentForHistory.profileImage} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" />
                                        ) : (
                                            <User size={40} color="#fff" />
                                        )}
                                    </div>
                                    <div>
                                        <h2 style={{ fontSize: '2.2rem', fontWeight: 900, letterSpacing: '-1px' }}>{selectedStudentForHistory.name}</h2>
                                        <p style={{ fontSize: '1rem', opacity: 0.8, fontWeight: 700 }}>{selectedStudentForHistory.email}</p>
                                        <div style={{ display: 'flex', gap: '15px', marginTop: '10px' }}>
                                            <span style={{ background: 'rgba(255,255,255,0.15)', padding: '5px 12px', borderRadius: '10px', fontSize: '0.75rem', fontWeight: 900 }}>BATCH STUDENT</span>
                                            <span style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#10b981', padding: '5px 12px', borderRadius: '10px', fontSize: '0.75rem', fontWeight: 900 }}>{selectedStudentForHistory.overallProgress}% MASTERY</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* MODAL BODY */}
                            <div style={{ flex: 1, padding: '2.5rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '3rem' }}>
                                
                                {/* QUICK STATS DASHBOARD */}
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '20px' }}>
                                    {[
                                        { label: 'PRESENT', value: selectedStudentForHistory.statusSummary?.PRESENT || 0, color: '#10b981', icon: <CheckCircle size={20} /> },
                                        { label: 'LATE', value: selectedStudentForHistory.statusSummary?.LATE || 0, color: '#f59e0b', icon: <Clock size={20} /> },
                                        { label: 'ABSENT', value: selectedStudentForHistory.statusSummary?.ABSENT || 0, color: '#ef4444', icon: <XCircle size={20} /> },
                                        { label: 'AVG TEST', value: `${selectedStudentForHistory.avgTestScore}%`, color: '#6366f1', icon: <Activity size={20} /> },
                                        { label: 'AVG INTERVIEW', value: `${selectedStudentForHistory.avgInterviewScore}%`, color: '#8b5cf6', icon: <MessageSquare size={20} /> }
                                    ].map((stat, i) => (
                                        <div key={i} style={{ background: 'rgba(255,255,255,0.03)', padding: '1.5rem', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)', textAlign: 'center' }}>
                                            <div style={{ color: stat.color, marginBottom: '10px', display: 'flex', justifyContent: 'center' }}>{stat.icon}</div>
                                            <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#fff' }}>{stat.value}</div>
                                            <div style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-dim)', marginTop: '5px', letterSpacing: '1px' }}>{stat.label}</div>
                                        </div>
                                    ))}
                                </div>

                                {/* ATTENDANCE HISTORY */}
                                <div>
                                    <h3 style={{ fontSize: '1.2rem', fontWeight: 900, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <Calendar size={20} color="var(--primary)" /> ATTENDANCE LOG ({selectedStudentForHistory.attendanceRate}%)
                                    </h3>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '15px' }}>
                                        {(selectedStudentForHistory.attendanceHistory || []).map((log: any, i: number) => (
                                            <div key={i} style={{ background: 'rgba(255,255,255,0.03)', padding: '15px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                                <div style={{ fontSize: '0.7rem', fontWeight: 900, color: 'var(--text-dim)', marginBottom: '5px' }}>{new Date(log.date).toLocaleDateString()}</div>
                                                <div style={{ fontWeight: 800, fontSize: '0.9rem', color: '#fff', marginBottom: '10px' }}>{log.topic}</div>
                                                <span style={{ 
                                                    fontSize: '0.65rem', 
                                                    fontWeight: 900, 
                                                    padding: '4px 10px', 
                                                    borderRadius: '8px', 
                                                    background: log.status === 'PRESENT' ? 'rgba(16, 185, 129, 0.1)' : (log.status === 'LATE' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(239, 68, 68, 0.1)'),
                                                    color: log.status === 'PRESENT' ? '#10b981' : (log.status === 'LATE' ? '#f59e0b' : '#ef4444')
                                                }}>
                                                    {log.status}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* MOCK INTERVIEW LOGS */}
                                <div>
                                    <h3 style={{ fontSize: '1.2rem', fontWeight: 900, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <MessageSquare size={20} color="var(--primary)" /> MOCK INTERVIEW RECORDS
                                    </h3>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                        {(selectedStudentForHistory.interviewHistory || []).length === 0 ? (
                                            <div style={{ textAlign: 'center', padding: '3rem', background: 'rgba(255,255,255,0.02)', borderRadius: '24px', border: '1px dashed rgba(255,255,255,0.1)' }}>
                                                No interview records found.
                                            </div>
                                        ) : (
                                            selectedStudentForHistory.interviewHistory.map((interview: any) => (
                                                <div key={interview.id} style={{ background: 'rgba(255,255,255,0.03)', padding: '20px', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
                                                        <div>
                                                            <div style={{ fontWeight: 900, color: '#fff', fontSize: '1.1rem' }}>{interview.topic}</div>
                                                            <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Interacted on {new Date(interview.date).toLocaleDateString()}</div>
                                                        </div>
                                                        <div style={{ background: 'rgba(139, 92, 246, 0.2)', color: '#a78bfa', padding: '8px 15px', borderRadius: '12px', fontSize: '1.2rem', fontWeight: 900 }}>
                                                            {interview.score}%
                                                        </div>
                                                    </div>
                                                    <div style={{ background: 'rgba(255,255,255,0.02)', padding: '15px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.03)', fontSize: '0.85rem', color: 'var(--text-dim)', lineHeight: '1.6' }}>
                                                        <strong style={{ color: '#fff', display: 'block', marginBottom: '5px' }}>AI Feedback:</strong>
                                                        {interview.feedback}
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>

                                {/* TEST PERFORMANCE LOGS */}
                                <div>
                                    <h3 style={{ fontSize: '1.2rem', fontWeight: 900, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <Activity size={20} color="var(--primary)" /> TEST PERFORMANCE HISTORY
                                    </h3>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '15px' }}>
                                        {(selectedStudentForHistory.testHistory || []).length === 0 ? (
                                            <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '3rem', background: 'rgba(255,255,255,0.02)', borderRadius: '24px', border: '1px dashed rgba(255,255,255,0.1)' }}>
                                                No test submissions recorded.
                                            </div>
                                        ) : (
                                            selectedStudentForHistory.testHistory.map((test: any) => (
                                                <div key={test.id} style={{ background: 'rgba(255,255,255,0.03)', padding: '20px', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                    <div>
                                                        <div style={{ fontWeight: 800, color: '#fff', fontSize: '0.95rem' }}>{test.title}</div>
                                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '4px' }}>Completed {new Date(test.date).toLocaleDateString()}</div>
                                                    </div>
                                                    <div style={{ textAlign: 'right' }}>
                                                        <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#6366f1' }}>{test.score} / {test.totalMarks}</div>
                                                        <div style={{ fontSize: '0.65rem', color: 'var(--text-dim)', fontWeight: 800 }}>RESULT CAPTURED</div>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>

                                {/* ASSIGNMENT HISTORY */}
                                <div>
                                    <h3 style={{ fontSize: '1.2rem', fontWeight: 900, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <FileText size={20} color="var(--primary)" /> ASSIGNMENT SUBMISSIONS
                                    </h3>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                        {(selectedStudentForHistory.assignmentHistory || []).length === 0 ? (
                                            <div style={{ textAlign: 'center', padding: '3rem', background: 'rgba(255,255,255,0.02)', borderRadius: '24px', border: '1px dashed rgba(255,255,255,0.1)' }}>
                                                No assignments submitted yet.
                                            </div>
                                        ) : (
                                            selectedStudentForHistory.assignmentHistory.map((a: any) => (
                                                <div key={a.id} style={{ background: 'rgba(255,255,255,0.03)', padding: '20px', borderRadius: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid rgba(255,255,255,0.05)' }}>
                                                    <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                                                        <div style={{ padding: '12px', background: 'rgba(124, 58, 237, 0.1)', borderRadius: '14px' }}>
                                                            <FileText size={20} color="var(--primary)" />
                                                        </div>
                                                        <div>
                                                            <div style={{ fontWeight: 800, color: '#fff', fontSize: '1rem' }}>{a.title}</div>
                                                            <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Submitted on {new Date(a.submittedAt).toLocaleDateString()}</div>
                                                        </div>
                                                    </div>
                                                    <div style={{ textAlign: 'right' }}>
                                                        <div style={{ fontSize: '1.2rem', fontWeight: 900, color: 'var(--primary)' }}>{a.marks}<span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>/{a.totalMarks}</span></div>
                                                        <span style={{ fontSize: '0.65rem', fontWeight: 900, color: '#10b981', background: 'rgba(16, 185, 129, 0.1)', padding: '4px 10px', borderRadius: '8px' }}>{a.status}</span>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}

                {isCreateBatchOpen && selectedCourse && (
                    <div style={{ position: 'fixed', inset: 0, zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)' }}>
                        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="glass-panel" style={{ width: '90%', maxWidth: '600px', padding: '3rem', borderRadius: '40px', maxHeight: '90vh', overflowY: 'auto' }}>
                            <h2 style={{ fontSize: '1.8rem', fontWeight: 900, marginBottom: '2rem' }}>New Batch for {selectedCourse.title}</h2>
                            <form onSubmit={handleCreateBatch} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                <div style={{ display: 'flex', gap: '1rem' }}>
                                    <input value={newBatch.batchCode} onChange={(e) => setNewBatch({ ...newBatch, batchCode: e.target.value })} placeholder="Batch Code (e.g. J1_APRIL)" style={inputStyle} required />
                                    <input value={newBatch.batchName} onChange={(e) => setNewBatch({ ...newBatch, batchName: e.target.value })} placeholder="Batch Name" style={inputStyle} required />
                                </div>
                                <div style={{ display: 'flex', gap: '1rem' }}>
                                    <input type="date" value={newBatch.startDate} onChange={(e) => setNewBatch({ ...newBatch, startDate: e.target.value })} style={inputStyle} required />
                                    <input type="date" value={newBatch.endDate} onChange={(e) => setNewBatch({ ...newBatch, endDate: e.target.value })} style={inputStyle} required />
                                </div>
                                <div style={{ display: 'flex', gap: '1rem' }}>
                                    <select value={newBatch.trainerId} onChange={(e) => setNewBatch({ ...newBatch, trainerId: e.target.value })} style={inputStyle} required>
                                        <option value="">Select Trainer / Admin</option>
                                        {allUsers.filter(u => u.role === 'TRAINER' || u.role === 'SUPER_ADMIN').map((u, idx) => (
                                            <option key={u.id || idx} value={u.id}>{u.fullName}</option>
                                        ))}
                                    </select>
                                    <select value={newBatch.mode} onChange={(e) => setNewBatch({ ...newBatch, mode: e.target.value })} style={inputStyle}>
                                        <option value="ONLINE">Online</option>
                                        <option value="OFFLINE">Offline</option>
                                        <option value="HYBRID">Hybrid</option>
                                    </select>
                                </div>
                                <div style={{ display: 'flex', gap: '1rem' }}>
                                    <input value={newBatch.schedule} onChange={(e) => setNewBatch({ ...newBatch, schedule: e.target.value })} placeholder="Schedule (e.g. Mon-Fri 10AM-1PM)" style={inputStyle} />
                                    <input type="number" value={newBatch.maxCapacity} onChange={(e) => setNewBatch({ ...newBatch, maxCapacity: parseInt(e.target.value) })} placeholder="Max Capacity" style={inputStyle} />
                                </div>
                                <textarea value={newBatch.description} onChange={(e) => setNewBatch({ ...newBatch, description: e.target.value })} placeholder="Description" rows={3} style={{ ...inputStyle, resize: 'none' }} />

                                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                                    <button type="button" onClick={() => setIsCreateBatchOpen(false)} style={{ flex: 1, padding: '12px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', color: '#fff', border: 'none', cursor: 'pointer' }}>CANCEL</button>
                                    <button type="submit" className="btn-quantum" style={{ flex: 2, padding: '12px', borderRadius: '12px' }}>CREATE BATCH</button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* --- EDIT BATCH MODAL --- */}
            <AnimatePresence>
                {isEditBatchOpen && editBatchData && (
                    <div style={{ position: 'fixed', inset: 0, zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)' }}>
                        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="glass-panel" style={{ width: '90%', maxWidth: '600px', padding: '3rem', borderRadius: '40px', maxHeight: '90vh', overflowY: 'auto' }}>
                            <h2 style={{ fontSize: '1.8rem', fontWeight: 900, marginBottom: '2rem' }}>Edit Batch {editBatchData.batchName}</h2>
                            <form onSubmit={handleUpdateBatchSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                <div style={{ display: 'flex', gap: '1rem' }}>
                                    <input value={editBatchData.batchCode} onChange={(e) => setEditBatchData({ ...editBatchData, batchCode: e.target.value })} placeholder="Batch Code" style={inputStyle} required />
                                    <input value={editBatchData.batchName} onChange={(e) => setEditBatchData({ ...editBatchData, batchName: e.target.value })} placeholder="Batch Name" style={inputStyle} required />
                                </div>
                                <div style={{ display: 'flex', gap: '1rem' }}>
                                    <input type="date" value={editBatchData.startDate} onChange={(e) => setEditBatchData({ ...editBatchData, startDate: e.target.value })} style={inputStyle} required />
                                    <input type="date" value={editBatchData.endDate} onChange={(e) => setEditBatchData({ ...editBatchData, endDate: e.target.value })} style={inputStyle} required />
                                </div>
                                <div style={{ display: 'flex', gap: '1rem' }}>
                                    <select value={editBatchData.trainerId || ''} onChange={(e) => setEditBatchData({ ...editBatchData, trainerId: e.target.value })} style={inputStyle} required>
                                        <option value="">Select Trainer / Admin</option>
                                        {allUsers.filter(u => u.role === 'TRAINER' || u.role === 'SUPER_ADMIN').map((u, idx) => (
                                            <option key={u.id || idx} value={u.id}>{u.fullName}</option>
                                        ))}
                                    </select>
                                    <select value={editBatchData.mode || 'ONLINE'} onChange={(e) => setEditBatchData({ ...editBatchData, mode: e.target.value })} style={inputStyle}>
                                        <option value="ONLINE">Online</option>
                                        <option value="OFFLINE">Offline</option>
                                        <option value="HYBRID">Hybrid</option>
                                    </select>
                                </div>
                                <div style={{ display: 'flex', gap: '1rem' }}>
                                    <input value={editBatchData.schedule || ''} onChange={(e) => setEditBatchData({ ...editBatchData, schedule: e.target.value })} placeholder="Schedule (e.g. Mon-Fri 10AM-1PM)" style={inputStyle} />
                                    <input type="number" value={editBatchData.maxCapacity || 50} onChange={(e) => setEditBatchData({ ...editBatchData, maxCapacity: parseInt(e.target.value) })} placeholder="Max Capacity" style={inputStyle} />
                                </div>
                                <textarea value={editBatchData.description || ''} onChange={(e) => setEditBatchData({ ...editBatchData, description: e.target.value })} placeholder="Description" rows={3} style={{ ...inputStyle, resize: 'none' }} />

                                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                                    <button type="button" onClick={() => setIsEditBatchOpen(false)} style={{ flex: 1, padding: '12px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', color: '#fff', border: 'none', cursor: 'pointer' }}>CANCEL</button>
                                    <button type="submit" className="btn-quantum" style={{ flex: 2, padding: '12px', borderRadius: '12px', background: 'var(--primary)' }}>SAVE CHANGES</button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* --- SHARE ACCESS MODAL (Fully Functional) --- */}
            <AnimatePresence>
                {isShareModalOpen && sharingTarget && (
                    <div style={{ position: 'fixed', inset: 0, zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(15px)' }}>
                        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="glass-panel" style={{ width: '95%', maxWidth: '550px', padding: 0, borderRadius: '40px', overflow: 'hidden' }}>
                            <div style={{ background: 'var(--primary)', padding: '2.5rem', color: '#000' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                    <h2 style={{ fontSize: '1.8rem', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '12px' }}><Share2 size={24} /> Share Access</h2>
                                    <button onClick={() => setIsShareModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><XCircle size={28} /></button>
                                </div>
                                <div style={{ background: 'rgba(0,0,0,0.1)', padding: '1rem', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <Search size={18} />
                                    <input
                                        value={userSearchTerm}
                                        onChange={(e) => setUserSearchTerm(e.target.value)}
                                        placeholder="Search students, staff or tutors..."
                                        style={{ background: 'none', border: 'none', width: '100%', outline: 'none', fontWeight: 700, fontSize: '0.95rem', color: '#000' }}
                                    />
                                </div>
                            </div>

                            <div style={{ padding: '2.5rem' }}>
                                {/* --- SEARCH RESULTS --- */}
                                {userSearchTerm && (
                                    <div style={{ marginBottom: '2rem' }}>
                                        <h4 style={{ fontSize: '0.75rem', fontWeight: 900, color: 'var(--text-dim)', marginBottom: '1rem', textTransform: 'uppercase' }}>Search Results</h4>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                            {usersToShareWith.map((u: any, idx: number) => (
                                                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: '16px' }}>
                                                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                                        <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: 'var(--primary)', color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 900 }}>{u.fullName?.charAt(0)}</div>
                                                        <div>
                                                            <div style={{ fontSize: '0.9rem', fontWeight: 800 }}>{u.fullName}</div>
                                                            <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>{u.role.replace('_', ' ')}</div>
                                                        </div>
                                                    </div>
                                                    <button onClick={() => handleUpdateSharing(u, 'EDITOR')} style={{ background: 'var(--primary)', color: '#000', padding: '6px 15px', borderRadius: '10px', fontSize: '0.75rem', fontWeight: 900, cursor: 'pointer', border: 'none' }}>GIVE ACCESS</button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* --- SUGGESTED USERS (All Students of Batch) --- */}
                                {!userSearchTerm && (
                                    <div style={{ marginBottom: '2rem' }}>
                                        <h4 style={{ fontSize: '0.75rem', fontWeight: 900, color: 'var(--text-dim)', marginBottom: '1rem', textTransform: 'uppercase' }}>Suggested Users (Batch {selectedBatch.batchName})</h4>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '200px', overflowY: 'auto' }}>
                                            {students.filter(s => !sharingTarget.sharedWith?.find((sw: any) => sw.userId === s.id)).map((u: any, idx: number) => (
                                                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: '16px' }}>
                                                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                                        <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: 'var(--primary)', color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 900 }}>{u.fullName?.charAt(0)}</div>
                                                        <div>
                                                            <div style={{ fontSize: '0.9rem', fontWeight: 800 }}>{u.fullName}</div>
                                                            <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>{u.role.replace('_', ' ')}</div>
                                                        </div>
                                                    </div>
                                                    <button onClick={() => handleUpdateSharing(u, 'EDITOR')} style={{ background: 'rgba(255,255,255,0.05)', color: '#fff', padding: '6px 15px', borderRadius: '10px', fontSize: '0.75rem', fontWeight: 900, cursor: 'pointer', border: 'none' }}>GIVE ACCESS</button>
                                                </div>
                                            ))}
                                            {students.length === 0 && <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', padding: '10px' }}>No students found in this batch.</div>}
                                        </div>
                                    </div>
                                )}

                                {/* --- CURRENT ACCESS LIST --- */}
                                <h4 style={{ fontSize: '0.75rem', fontWeight: 900, color: 'var(--text-dim)', marginBottom: '1.5rem', textTransform: 'uppercase' }}>People with access</h4>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxHeight: '300px', overflowY: 'auto' }}>
                                    <SharedMemberItem name="Super Admin (You)" role="OWNER" />
                                    {sharingTarget.sharedWith?.map((access: any, idx: number) => (
                                        <SharedMemberItem
                                            key={idx}
                                            name={access.fullName}
                                            role={access.role}
                                            onRoleChange={(r: string) => handleUpdateSharing({ id: access.userId, fullName: access.fullName }, r)}
                                        />
                                    ))}
                                </div>
                            </div>

                            <div style={{ padding: '2rem 2.5rem', background: 'rgba(255,255,255,0.02)', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'flex-end' }}>
                                <button onClick={() => setIsShareModalOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text-dim)', fontWeight: 800, cursor: 'pointer' }}>CLOSE</button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* --- ASSIGN TUTOR MODAL --- */}
            <AnimatePresence>
                {isTutorModalOpen && (
                    <div style={{ position: 'fixed', inset: 0, zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(5,2,18,0.9)', backdropFilter: 'blur(20px)' }}>
                        <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="glass-panel" style={{ width: '90%', maxWidth: '480px', padding: 0, borderRadius: '32px', border: '1px solid rgba(255,255,255,0.1)', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)' }}>
                            <div style={{ background: 'var(--grad-main)', padding: '2.5rem', position: 'relative' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                    <div>
                                        <h2 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#fff', letterSpacing: '-1px' }}>Assign Faculty</h2>
                                        <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)', fontWeight: 600 }}>Select personnel for {selectedBatch?.batchName}</p>
                                    </div>
                                    <button onClick={() => setIsTutorModalOpen(false)} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', cursor: 'pointer', color: '#fff', width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><X size={20} /></button>
                                </div>
                                <div style={{ background: 'rgba(255,255,255,0.1)', padding: '12px 20px', borderRadius: '18px', display: 'flex', alignItems: 'center', gap: '15px', border: '1px solid rgba(255,255,255,0.1)' }}>
                                    <Search size={18} color="#fff" />
                                    <input
                                        value={tutorSearchTerm}
                                        onChange={(e) => setTutorSearchTerm(e.target.value)}
                                        placeholder="Search by name or email..."
                                        style={{ background: 'none', border: 'none', width: '100%', outline: 'none', fontWeight: 600, fontSize: '0.95rem', color: '#fff' }}
                                    />
                                </div>
                            </div>
                            <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '400px', overflowY: 'auto' }}>
                                {allUsers.filter(u => (u.role === 'TRAINER' || u.role === 'ADMIN' || u.role === 'SUPER_ADMIN') && (
                                    (u.fullName || '').toLowerCase().includes(tutorSearchTerm.toLowerCase()) ||
                                    (u.email || '').toLowerCase().includes(tutorSearchTerm.toLowerCase())
                                )).map((trainer: any, idx: number) => {
                                    const isAssigned = tempTrainerIds.includes(trainer.id || trainer._id);
                                    return (
                                        <motion.div key={idx} whileHover={{ x: 5 }} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', background: isAssigned ? 'rgba(124, 58, 237, 0.05)' : 'rgba(255,255,255,0.02)', borderRadius: '20px', border: isAssigned ? '1px solid var(--primary)' : '1px solid rgba(255,255,255,0.05)' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                                <div style={{ width: '45px', height: '45px', borderRadius: '14px', background: 'var(--grad-main)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '1.1rem', color: '#fff' }}>
                                                    {(trainer.fullName || 'U').charAt(0)}
                                                </div>
                                                <div>
                                                    <div style={{ fontWeight: 800, fontSize: '1rem' }}>{trainer.fullName || 'Academic Staff'}</div>
                                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontWeight: 600 }}>{trainer.email}</div>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => toggleTempTrainer(trainer.id || trainer._id)}
                                                style={{
                                                    background: isAssigned ? '#ef444420' : 'rgba(255,255,255,0.05)',
                                                    color: isAssigned ? '#ef4444' : 'var(--text-bright)',
                                                    border: isAssigned ? '1px solid #ef4444' : '1px solid rgba(255,255,255,0.1)',
                                                    padding: '8px 18px',
                                                    borderRadius: '12px',
                                                    fontSize: '0.75rem',
                                                    fontWeight: 800,
                                                    cursor: 'pointer',
                                                    transition: 'all 0.2s ease'
                                                }}
                                            >
                                                {isAssigned ? 'UNSELECT' : 'SELECT'}
                                            </button>
                                        </motion.div>
                                    )
                                })}
                            </div>
                            <div style={{ padding: '1.5rem 2rem', background: 'rgba(255,255,255,0.01)', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'flex-end' }}>
                                <button onClick={() => handleSaveChanges('FACULTY')} className="btn-quantum" style={{ padding: '12px 30px', borderRadius: '14px' }}>SAVE CHANGES</button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* --- MANAGE STUDENTS MODAL --- */}
            <AnimatePresence>
                {isStudentModalOpen && (
                    <div style={{ position: 'fixed', inset: 0, zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(15px)' }}>
                        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="glass-panel" style={{ width: '95%', maxWidth: '550px', padding: 0, borderRadius: '40px', overflow: 'hidden' }}>
                            <div style={{ background: 'var(--secondary)', padding: '2.5rem', color: '#000' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                    <h2 style={{ fontSize: '1.8rem', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '12px' }}><Users size={24} /> Edit Batch Students</h2>
                                    <button onClick={() => setIsStudentModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#000' }}><XCircle size={28} /></button>
                                </div>
                                <div style={{ background: 'rgba(0,0,0,0.1)', padding: '1rem', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <Search size={18} />
                                    <input
                                        value={studentSearchTerm}
                                        onChange={(e) => setStudentSearchTerm(e.target.value)}
                                        placeholder="Search name, email, number..."
                                        style={{ background: 'none', border: 'none', width: '100%', outline: 'none', fontWeight: 700, fontSize: '0.95rem', color: '#000' }}
                                    />
                                </div>
                            </div>

                            <div style={{ padding: '2rem 2.5rem', display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '400px', overflowY: 'auto' }}>
                                {allUsers.filter(u => u.role === 'STUDENT' && (
                                    (u.fullName || '').toLowerCase().includes(studentSearchTerm.toLowerCase()) ||
                                    (u.email || '').toLowerCase().includes(studentSearchTerm.toLowerCase()) ||
                                    (u.phone || '').toLowerCase().includes(studentSearchTerm.toLowerCase())
                                )).map((student: any, idx: number) => {
                                    const studentId = String(student.id || student._id || '');
                                    const hasAccess = tempStudentIds.some(tid => String(tid) === studentId);
                                    return (
                                        <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: '16px', border: hasAccess ? '1px solid var(--secondary)' : '1px solid transparent' }}>
                                            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                                <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: 'var(--secondary)', color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 900 }}>{student.email?.charAt(0).toUpperCase()}</div>
                                                <div>
                                                    <div style={{ fontSize: '0.9rem', fontWeight: 800 }}>{student.fullName || student.email.split('@')[0]}</div>
                                                    <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>{student.email} • {student.phone || 'No phone'}</div>
                                                </div>
                                            </div>
                                            <button onClick={() => toggleTempStudent(studentId)} style={{ background: hasAccess ? 'rgba(16, 185, 129, 0.1)' : 'rgba(255,255,255,0.05)', color: hasAccess ? '#10b981' : '#fff', border: hasAccess ? '1px solid #10b981' : '1px solid rgba(255,255,255,0.1)', padding: '8px 18px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 900, cursor: 'pointer' }}>
                                                {hasAccess ? 'UNSELECT' : 'SELECT'}
                                            </button>
                                        </div>
                                    )
                                })}
                            </div>
                            <div style={{ padding: '1.5rem 2.5rem', background: 'rgba(255,255,255,0.01)', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'flex-end' }}>
                                <button onClick={() => handleSaveChanges('STUDENTS')} className="btn-quantum" style={{ padding: '12px 30px', borderRadius: '14px', background: 'var(--secondary)' }}>SAVE CHANGES</button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* --- RENAME MODAL --- */}
            <AnimatePresence>
                {renameTarget && (
                    <div style={{ position: 'fixed', inset: 0, zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)' }}>
                        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="glass-panel" style={{ width: '90%', maxWidth: '400px', padding: '3rem', borderRadius: '40px' }}>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: '2rem' }}>Rename {renameTarget.type === 'folder' ? 'Folder' : 'File'}</h2>
                            <form onSubmit={handleRenameSubmit}>
                                <input value={renameValue} onChange={(e) => setRenameValue(e.target.value)} autoFocus placeholder="New Name" style={inputStyle} />
                                <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                                    <button type="button" onClick={() => setRenameTarget(null)} style={{ flex: 1, padding: '12px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', color: '#fff', border: 'none', cursor: 'pointer' }}>CANCEL</button>
                                    <button type="submit" className="btn-quantum" style={{ flex: 2, padding: '12px', borderRadius: '12px' }}>SAVE</button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* --- VIEW FILE MODAL --- */}
            <AnimatePresence>
                {viewFileTarget && (
                    <div style={{ position: 'fixed', inset: 0, zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.95)', backdropFilter: 'blur(15px)' }}>
                        <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} style={{ width: '95%', maxWidth: '1000px', height: '80vh', display: 'flex', flexDirection: 'column' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem', background: 'rgba(255,255,255,0.05)', borderRadius: '24px 24px 0 0' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                    {viewFileTarget.type === 'pdf' || viewFileTarget.type === 'doc' || viewFileTarget.type === 'txt' ? <FileText color="var(--primary)" /> : <Play color="var(--primary)" />}
                                    <h2 style={{ fontSize: '1.2rem', fontWeight: 900 }}>{viewFileTarget.name}</h2>
                                </div>
                                <button onClick={() => setViewFileTarget(null)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}><XCircle size={28} /></button>
                            </div>
                            <div style={{ flex: 1, background: '#000', borderRadius: '0 0 24px 24px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
                                {['mp4', 'mkv', 'webm', 'mov', 'video'].includes(viewFileTarget.type?.toLowerCase()) || viewFileTarget.name?.toLowerCase().endsWith('.webm') ? (
                                    <video
                                        src={viewFileTarget.url}
                                        controls
                                        autoPlay
                                        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                                    />
                                ) : (
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
                                        <FileText size={80} color="var(--primary)" style={{ opacity: 0.5 }} />
                                        <p style={{ color: 'var(--text-dim)', fontWeight: 800 }}>Document Preview Viewer</p>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* --- SCHEDULE LIVE SESSION MODAL --- */}
            {isScheduleLiveModalOpen && (
                <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(5px)' }}>
                    <div className="glass-panel" style={{ width: '90%', maxWidth: '750px', padding: '2.5rem', borderRadius: '40px', position: 'relative' }}>
                        <button onClick={() => setIsScheduleLiveModalOpen(false)} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer' }}>
                            <XCircle size={24} />
                        </button>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <Video size={24} color="var(--primary)" /> Schedule Live Class
                        </h2>

                        <form onSubmit={handleScheduleLiveClass} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <label style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-dim)' }}>SESSION TITLE</label>
                                <input value={newLiveSession.title} onChange={e => setNewLiveSession({ ...newLiveSession, title: e.target.value })} placeholder="e.g. FullStack Development Introduction" required style={{ padding: '12px 16px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', outline: 'none' }} />
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    <label style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-dim)' }}>START DATE & TIME</label>
                                    <input type="datetime-local" value={newLiveSession.startTime} onChange={e => setNewLiveSession({ ...newLiveSession, startTime: e.target.value })} required style={{ padding: '12px 16px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', outline: 'none' }} />
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    <label style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-dim)' }}>END DATE & TIME (OPTIONAL)</label>
                                    <input type="datetime-local" value={newLiveSession.endDate} onChange={e => setNewLiveSession({ ...newLiveSession, endDate: e.target.value })} style={{ padding: '12px 16px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', outline: 'none' }} />
                                </div>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <label style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-dim)' }}>DURATION</label>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                    <div style={{ position: 'relative' }}>
                                        <input type="number" min="0" value={newLiveSession.durationHours} onChange={e => setNewLiveSession({ ...newLiveSession, durationHours: parseInt(e.target.value) || 0 })} required style={{ padding: '12px 16px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', outline: 'none', width: '100%' }} />
                                        <span style={{ position: 'absolute', right: '12px', top: '12px', fontSize: '0.7rem', color: 'var(--secondary)', fontWeight: 900 }}>HOURS</span>
                                    </div>
                                    <div style={{ position: 'relative' }}>
                                        <input type="number" min="0" max="59" value={newLiveSession.durationMinutes} onChange={e => setNewLiveSession({ ...newLiveSession, durationMinutes: parseInt(e.target.value) || 0 })} required style={{ padding: '12px 16px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', outline: 'none', width: '100%' }} />
                                        <span style={{ position: 'absolute', right: '12px', top: '12px', fontSize: '0.7rem', color: 'var(--secondary)', fontWeight: 900 }}>MINS</span>
                                    </div>
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    <label style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-dim)' }}>SELECT TUTOR</label>
                                    <select value={newLiveSession.tutorId} onChange={e => setNewLiveSession({ ...newLiveSession, tutorId: e.target.value })} required style={{ padding: '12px 16px', borderRadius: '12px', background: 'rgba(20,20,20,0.9)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', outline: 'none' }}>
                                        <option value="">- Select Trainer/Admin -</option>
                                        {allUsers.filter(u => ['TRAINER', 'ADMIN', 'SUPER_ADMIN', 'TUTOR', 'EMPLOYEE'].includes(u.role)).map((u, idx) => (
                                            <option key={u.id || idx} value={u.id}>{u.fullName || u.name || u.email || 'Unnamed User'} ({u.role})</option>
                                        ))}
                                    </select>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    <label style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-dim)' }}>PLATFORM</label>
                                    <select value={newLiveSession.platform} onChange={e => setNewLiveSession({ ...newLiveSession, platform: e.target.value })} required style={{ padding: '12px 16px', borderRadius: '12px', background: 'rgba(20,20,20,0.9)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', outline: 'none' }}>
                                        <option value="Bytecode Meetings">Bytecode Meetings</option>
                                        <option value="ZOOM">Zoom Cloud Meeting</option>
                                        <option value="GOOGLE_MEET">Google Meet</option>
                                        <option value="MS_TEAMS">Microsoft Teams</option>
                                    </select>
                                </div>
                            </div>

                            {newLiveSession.platform !== 'Bytecode Meetings' && (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    <label style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-dim)' }}>MEETING LINK URL</label>
                                    <input value={newLiveSession.meetingLink} onChange={e => setNewLiveSession({ ...newLiveSession, meetingLink: e.target.value })} placeholder={`https://${newLiveSession.platform.toLowerCase()}...`} required style={{ padding: '12px 16px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', outline: 'none' }} />
                                </div>
                            )}

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <label style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-dim)' }}>RECORDING URL (FOR COMPLETED SESSIONS)</label>
                                <input value={newLiveSession.recordingUrl} onChange={e => setNewLiveSession({ ...newLiveSession, recordingUrl: e.target.value })} placeholder="https://..." style={{ padding: '12px 16px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', outline: 'none' }} />
                            </div>

                            <div style={{ background: 'rgba(139, 92, 246, 0.1)', padding: '1rem', borderRadius: '12px', fontSize: '0.8rem', color: 'var(--text-dim)', marginTop: '0.5rem' }}>
                                <strong style={{ color: 'var(--primary)' }}>Note:</strong> Using Bytecode Meetings automatically provisions a secure, 1-click launch room for this class.
                            </div>

                            <button type="submit" className="btn-quantum" style={{ padding: '15px', borderRadius: '12px', fontWeight: 900, marginTop: '1rem' }}>
                                CREATE SESSION
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* --- EDIT LIVE SESSION MODAL --- */}
            <AnimatePresence>
                {isEditSessionModalOpen && editingSession && (
                    <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(5px)' }}>
                        <div className="glass-panel" style={{ width: '90%', maxWidth: '750px', padding: '2.5rem', borderRadius: '40px', position: 'relative' }}>
                            <button onClick={() => setIsEditSessionModalOpen(false)} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer' }}>
                                <XCircle size={24} />
                            </button>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <Edit2 size={24} color="var(--primary)" /> Edit Live Session
                            </h2>

                            <form onSubmit={handleUpdateSession} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    <label style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-dim)' }}>SESSION TITLE</label>
                                    <input value={editingSession.title} onChange={e => setEditingSession({ ...editingSession, title: e.target.value })} placeholder="e.g. React Hooks Deep Dive" required style={{ padding: '12px 16px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', outline: 'none' }} />
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                        <label style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-dim)' }}>START DATE & TIME</label>
                                        <input type="datetime-local" value={editingSession.startTime?.slice(0, 16)} onChange={e => setEditingSession({ ...editingSession, startTime: e.target.value })} required style={{ padding: '12px 16px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', outline: 'none' }} />
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                        <label style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-dim)' }}>DURATION (MINUTES)</label>
                                        <input type="number" min="1" value={editingSession.duration} onChange={e => setEditingSession({ ...editingSession, duration: parseInt(e.target.value) || 60 })} required style={{ padding: '12px 16px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', outline: 'none' }} />
                                    </div>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                        <label style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-dim)' }}>PLATFORM</label>
                                        <select value={editingSession.platform} onChange={e => setEditingSession({ ...editingSession, platform: e.target.value })} style={{ padding: '12px 16px', borderRadius: '12px', background: 'rgba(20,20,20,0.95)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', outline: 'none' }}>
                                            <option value="Bytecode Meetings">Bytecode Meetings</option>
                                            <option value="ZOOM">Zoom</option>
                                            <option value="GOOGLE_MEET">Google Meet</option>
                                            <option value="MS_TEAMS">Microsoft Teams</option>
                                        </select>
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                        <label style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-dim)' }}>STATUS</label>
                                        <select value={editingSession.status} onChange={e => setEditingSession({ ...editingSession, status: e.target.value })} style={{ padding: '12px 16px', borderRadius: '12px', background: 'rgba(20,20,20,0.95)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', outline: 'none' }}>
                                            <option value="UPCOMING">Upcoming</option>
                                            <option value="LIVE">Live Now</option>
                                            <option value="COMPLETED">Completed</option>
                                        </select>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    <label style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-dim)' }}>RECORDING URL</label>
                                    <input value={editingSession.recordingUrl || ''} onChange={e => setEditingSession({ ...editingSession, recordingUrl: e.target.value })} placeholder="https://..." style={{ padding: '12px 16px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', outline: 'none' }} />
                                </div>

                                <button type="submit" className="btn-quantum" style={{ padding: '15px', borderRadius: '12px', fontWeight: 900, marginTop: '1rem' }}>
                                    UPDATE SESSION
                                </button>
                            </form>
                        </div>
                    </div>
                )}
            </AnimatePresence>

            {/* --- WebRTC Room navigation is handled via router.push --- */}

            {/* --- MULTI-STEP FOLDER SHARE MODAL --- */}
            <AnimatePresence>
                {isShareModalOpen && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="modal-overlay" style={{ position: 'fixed', inset: 0, zIndex: 100000, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(20px)' }}>
                        <motion.div initial={{ scale: 0.9, y: 30 }} animate={{ scale: 1, y: 0 }} className="glass-panel" style={{ width: '95%', maxWidth: '650px', padding: '3rem', borderRadius: '45px', border: '1px solid rgba(139, 92, 246, 0.4)', position: 'relative', boxShadow: '0 50px 100px rgba(0,0,0,0.8)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2.5rem' }}>
                                <div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                                        <div style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--primary)', boxShadow: '0 0 10px var(--primary)' }} />
                                        <span style={{ fontSize: '0.75rem', fontWeight: 900, color: 'var(--primary)', letterSpacing: '2px' }}>DISTRIBUTION ENGINE • STEP {shareStep}</span>
                                    </div>
                                    <h2 style={{ fontSize: '2rem', fontWeight: 900 }}>
                                        {shareStep === 1 && "Pick a Course"}
                                        {shareStep === 2 && "Select Batch"}
                                        {shareStep === 3 && "Choose Folder"}
                                    </h2>
                                </div>
                                <button onClick={() => setIsShareModalOpen(false)} style={{ background: 'rgba(255,255,255,0.05)', border: 'none', color: '#fff', cursor: 'pointer', padding: '12px', borderRadius: '50%' }}><XCircle size={28} /></button>
                            </div>

                            {/* PATH SUMMARY BREADCRUMB */}
                            {(shareSelectedCourse || shareSelectedBatch) && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(255,255,255,0.03)', padding: '12px 20px', borderRadius: '18px', border: '1px solid rgba(255,255,255,0.06)', marginBottom: '2rem', fontSize: '0.85rem' }}>
                                    <Globe size={16} color="var(--primary)" />
                                    {shareSelectedCourse && <span style={{ fontWeight: 800 }}>{shareSelectedCourse.title}</span>}
                                    {shareSelectedBatch && <>
                                        <ChevronRight size={14} color="rgba(255,255,255,0.2)" />
                                        <span style={{ fontWeight: 800, color: '#10b981' }}>{shareSelectedBatch.batchName}</span>
                                    </>}
                                </div>
                            )}

                            <AnimatePresence mode="wait">
                                {/* STEP 1: COURSES */}
                                {shareStep === 1 && (
                                    <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '15px', maxHeight: '420px', overflowY: 'auto', padding: '5px' }}>
                                        {courses.length > 0 ? courses.map((c: any) => (
                                            <motion.button key={c.id} whileHover={{ y: -5, background: 'rgba(139, 92, 246, 0.1)' }} onClick={() => handleSelectCourseForShare(c)} className="glass-panel" style={{ padding: '1.5rem', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)', textAlign: 'left', display: 'flex', gap: '15px', alignItems: 'center', cursor: 'pointer', transition: 'all 0.3s' }}>
                                                <div style={{ padding: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: '14px' }}><BookOpen size={22} color="var(--primary)" /></div>
                                                <span style={{ fontWeight: 800, fontSize: '0.95rem' }}>{c.title}</span>
                                            </motion.button>
                                        )) : <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '3rem', opacity: 0.5 }}>No courses available to share...</div>}
                                    </motion.div>
                                )}

                                {/* STEP 2: BATCHES */}
                                {shareStep === 2 && (
                                    <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '420px', overflowY: 'auto' }}>
                                        <button onClick={() => setShareStep(1)} style={{ marginBottom: '10px', fontSize: '0.8rem', fontWeight: 900, color: 'var(--primary)', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            <ChevronLeft size={16} /> CHANGE COURSE
                                        </button>
                                        {batches.filter(b => b.courseId === shareSelectedCourse?.id).length > 0 ? batches.filter(b => b.courseId === shareSelectedCourse?.id).map((b: any) => (
                                            <motion.button key={b.id} whileHover={{ x: 5, background: 'rgba(16, 185, 129, 0.1)' }} onClick={() => { setShareSelectedBatch(b); setShareStep(3); }} className="glass-panel" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.5rem', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)', textAlign: 'left', cursor: 'pointer' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
                                                    <div style={{ padding: '12px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '15px' }}><Layers size={22} color="#10b981" /></div>
                                                    <div>
                                                        <div style={{ fontWeight: 800, fontSize: '1.1rem' }}>{b.batchName}</div>
                                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '2px' }}>{b.batchCode} • {b.mode}</div>
                                                    </div>
                                                </div>
                                                <ChevronRight size={20} color="rgba(255,255,255,0.2)" />
                                            </motion.button>
                                        )) : <p style={{ textAlign: 'center', padding: '3rem', opacity: 0.5 }}>No active batches found for this course.</p>}
                                    </motion.div>
                                )}

                                {/* STEP 3: FOLDERS */}
                                {shareStep === 3 && (
                                    <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                            <button onClick={() => shareCurrentPath.length > 0 ? setShareCurrentPath(shareCurrentPath.slice(0, -1)) : setShareStep(2)} style={{ fontSize: '0.8rem', fontWeight: 900, color: 'var(--primary)', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                <ChevronLeft size={16} /> {shareCurrentPath.length > 0 ? 'BACK' : 'BACK TO BATCHES'}
                                            </button>

                                            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                                {shareCurrentPath.length > 0 && (
                                                    <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#10b981', background: 'rgba(16,185,129,0.1)', padding: '5px 12px', borderRadius: '10px', marginRight: '10px' }}>
                                                        IN: {shareCurrentPath.join(' / ')}
                                                    </span>
                                                )}
                                                <button 
                                                    onClick={() => handleConfirmShare(shareCurrentPath.join('/'))}
                                                    disabled={shareCurrentPath.length === 0}
                                                    style={{ background: shareCurrentPath.length === 0 ? 'rgba(255,255,255,0.05)' : 'var(--primary)', border: 'none', color: '#fff', padding: '10px 20px', borderRadius: '15px', fontSize: '0.8rem', fontWeight: 900, cursor: shareCurrentPath.length === 0 ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
                                                >
                                                    <Share2 size={16} /> SHARE HERE
                                                </button>
                                            </div>
                                        </div>

                                        {/* DESTINATION GRID */}
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '15px', minHeight: '100px' }}>
                                            {(() => {
                                                const currentPathStr = shareCurrentPath.join('/');
                                                const folders = shareSelectedBatch.folders || [];
                                                
                                                const visibleFolders = new Set<string>();
                                                folders.forEach((f: any) => {
                                                    const name = f.name;
                                                    if (currentPathStr === '') {
                                                        // At root, show first level only
                                                        visibleFolders.add(name.split('/')[0]);
                                                    } else {
                                                        // Inside a path, show only folders that start with currentPath/
                                                        const prefix = currentPathStr + '/';
                                                        if (name.startsWith(prefix)) {
                                                            const relative = name.substring(prefix.length);
                                                            const firstPart = relative.split('/')[0];
                                                            if (firstPart) visibleFolders.add(firstPart);
                                                        }
                                                    }
                                                });

                                                return Array.from(visibleFolders).map(folderName => (
                                                    <motion.button 
                                                        key={folderName}
                                                        whileHover={{ y: -5, background: 'rgba(255,255,255,0.05)' }}
                                                        onClick={() => setShareCurrentPath([...shareCurrentPath, folderName])}
                                                        style={{ padding: '20px', borderRadius: '25px', border: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.03)', color: '#fff', fontWeight: 800, fontSize: '1rem', cursor: 'pointer', textAlign: 'left', display: 'flex', gap: '15px', alignItems: 'center' }}
                                                    >
                                                        <div style={{ padding: '10px', background: 'rgba(245, 158, 11, 0.1)', borderRadius: '15px' }}><Folder size={22} color="#f59e0b" /></div>
                                                        <span>{folderName}</span>
                                                    </motion.button>
                                                ));
                                            })()}
                                        </div>

                                        {/* EXPLICIT CREATION ZONE */}
                                        <div style={{ background: 'rgba(139, 92, 246, 0.05)', padding: '2rem', borderRadius: '40px', border: '2px dashed rgba(139, 92, 246, 0.2)' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1.5rem' }}>
                                                <FolderPlus size={22} color="var(--primary)" />
                                                <span style={{ fontWeight: 900, fontSize: '0.9rem', color: 'var(--primary)', letterSpacing: '1px' }}>DEPLOY NEW SUB-FOLDER</span>
                                            </div>
                                            <div style={{ display: 'flex', gap: '15px' }}>
                                                <input 
                                                    value={shareNewFolderName} 
                                                    onChange={(e) => setShareNewFolderName(e.target.value)} 
                                                    placeholder="Enter folder name..." 
                                                    style={{ flex: 1, background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '25px', padding: '20px 25px', color: '#fff', fontSize: '1rem', outline: 'none' }} 
                                                />
                                                <button 
                                                    onClick={() => {
                                                        const fullPath = shareCurrentPath.length > 0 ? `${shareCurrentPath.join('/')}/${shareNewFolderName}` : shareNewFolderName;
                                                        handleCreateFolderForShare(fullPath);
                                                    }} 
                                                    disabled={!shareNewFolderName} 
                                                    className="btn-quantum" 
                                                    style={{ padding: '0 40px', borderRadius: '25px', fontWeight: 900, background: 'rgba(255,255,255,0.05)', color: 'var(--primary)', border: '1px solid var(--primary)' }}
                                                >
                                                    CREATE FOLDER
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>


            {/* --- CREATE ASSIGNMENT MODAL --- */}
            <AnimatePresence>
                {isCreateAssignmentModalOpen && (
                    <div style={{ position: "fixed", inset: 0, zIndex: 10000, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.6)", backdropFilter: "blur(15px)" }}>
                        <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} style={{ width: "95%", maxWidth: "700px", padding: "3.5rem", borderRadius: "45px", background: "#fff", boxShadow: "0 30px 100px rgba(0,0,0,0.3)", border: "1px solid #e2e8f0", maxHeight: "90vh", overflowY: "auto" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2.5rem" }}>
                                <div>
                                    <span style={{ fontSize: "0.8rem", fontWeight: 900, color: "#10b981", letterSpacing: "3px", textTransform: "uppercase" }}>Assignment Details</span>
                                    <h2 style={{ fontSize: "2.5rem", fontWeight: 900, marginTop: "8px", color: "#1a202c", letterSpacing: "-1.5px" }}>Create Assignment</h2>
                                </div>
                                <button onClick={() => setIsCreateAssignmentModalOpen(false)} style={{ background: "#f8fafc", border: "1px solid #e2e8f0", padding: "12px", borderRadius: "50%", cursor: "pointer" }}><X size={32} /></button>
                            </div>

                            <form onSubmit={handleCreateAssignment} style={{ display: "flex", flexDirection: "column", gap: "1.8rem" }}>
                                <div style={{ display: "flex", flexWrap: "wrap", gap: "1.5rem" }}>
                                    <div style={{ flex: "1 1 300px", display: "flex", flexDirection: "column", gap: "8px" }}>
                                        <label style={{ fontSize: "0.75rem", fontWeight: 900, color: "#718096", marginLeft: "10px" }}>ASSIGNMENT TITLE</label>
                                        <input required value={newAssignment.title} onChange={(e) => setNewAssignment({ ...newAssignment, title: e.target.value })} placeholder="e.g. Advanced System Architecture Project" style={{ ...inputStyle, background: "#f8fafc", color: "#1a202c", border: "1px solid #e2e8f0" }} />
                                    </div>
                                    <div style={{ flex: "1 1 200px", display: "flex", flexDirection: "column", gap: "8px" }}>
                                        <label style={{ fontSize: "0.75rem", fontWeight: 900, color: "#718096", marginLeft: "10px" }}>LEVEL</label>
                                        <select value={newAssignment.difficulty} onChange={(e) => setNewAssignment({ ...newAssignment, difficulty: e.target.value })} style={{ ...inputStyle, background: "#f8fafc", color: "#1a202c", border: "1px solid #e2e8f0" }}>
                                            <option value="BEGINNER">BEGINNER</option>
                                            <option value="MEDIUM">MEDIUM</option>
                                            <option value="ADVANCED">ADVANCED</option>
                                            <option value="CHALLENGE">CHALLENGE</option>
                                        </select>
                                    </div>
                                </div>

                                <div style={{ display: "flex", flexWrap: "wrap", gap: "1.5rem" }}>
                                    <div style={{ flex: "1 1 200px", display: "flex", flexDirection: "column", gap: "8px" }}>
                                        <label style={{ fontSize: "0.75rem", fontWeight: 900, color: "#718096", marginLeft: "10px" }}>DUE DATE</label>
                                        <input type="date" required value={newAssignment.dueDate} onChange={(e) => setNewAssignment({ ...newAssignment, dueDate: e.target.value })} style={{ ...inputStyle, background: "#f8fafc", color: "#1a202c", border: "1px solid #e2e8f0" }} />
                                    </div>
                                </div>

                                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                                    <label style={{ fontSize: "0.75rem", fontWeight: 900, color: "#718096", marginLeft: "10px" }}>DESCRIPTION</label>
                                    <textarea required value={newAssignment.description} onChange={(e) => setNewAssignment({ ...newAssignment, description: e.target.value })} placeholder="Explain the project scope and expected deliverables..." rows={4} style={{ ...inputStyle, background: "#f8fafc", color: "#1a202c", border: "1px solid #e2e8f0", resize: "none" }} />
                                </div>

                                <div style={{ background: "#f0f9ff", padding: "1.5rem", borderRadius: "24px", border: "1px solid #e0f2fe" }}>
                                    <h4 style={{ fontSize: "0.9rem", fontWeight: 900, marginBottom: "10px", color: "#0369a1" }}>Attachments</h4>
                                    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                                        <div style={{ background: "#fff", padding: "20px", borderRadius: "15px", border: "1px dashed #7dd3fc", textAlign: "center", cursor: "pointer" }} onClick={() => document.getElementById("assign-file")?.click()}>
                                            <Upload size={24} style={{ marginBottom: "5px", color: "#0369a1" }} />
                                            <p style={{ fontSize: "0.8rem", fontWeight: 700, color: "#0369a1" }}>{newAssignment.attachments.length > 0 ? `${newAssignment.attachments.length} Files Selected` : "Click here to upload files"}</p>
                                        </div>
                                        {newAssignment.attachments.length > 0 && (
                                            <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "10px" }}>
                                                {newAssignment.attachments.map((file, idx) => (
                                                    <div key={idx} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px", background: "#fff", borderRadius: "10px", border: "1px solid #e0f2fe" }}>
                                                        <FileText size={16} color="#0369a1" />
                                                        <span style={{ fontSize: "0.8rem", fontWeight: 600, color: "#0369a1", flex: 1 }}>{file.name}</span>
                                                        <button type="button" onClick={(e) => { e.stopPropagation(); setNewAssignment(prev => ({ ...prev, attachments: prev.attachments.filter((_, i) => i !== idx) })) }} style={{ border: "none", background: "none", color: "#ef4444", cursor: "pointer" }}><X size={16} /></button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                        <input type="file" id="assign-file" style={{ display: "none" }} onChange={handleAssignmentFileUpload} />
                                    </div>
                                </div>

                                <div style={{ display: "flex", gap: "1.5rem", marginTop: "1rem" }}>
                                    <button type="button" onClick={() => setIsCreateAssignmentModalOpen(false)} style={{ flex: 1, padding: "18px", borderRadius: "18px", background: "#f1f5f9", color: "#475569", border: "none", fontWeight: 900, cursor: "pointer" }}>CANCEL</button>
                                    <button type="submit" className="btn-quantum" style={{ flex: 2, padding: "18px", borderRadius: "18px", background: "#10b981", color: "#fff", fontWeight: 900 }}>UPLOAD & SEND</button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* --- SUBMISSIONS TRACKING MODAL --- */}
            <AnimatePresence>
                {viewingSubmissionsAssignment && (
                    <div style={{ position: "fixed", inset: 0, zIndex: 110000, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.6)", backdropFilter: "blur(20px)" }}>
                        <motion.div initial={{ scale: 1.05, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} style={{ width: "95%", maxWidth: "900px", padding: "3.5rem", borderRadius: "45px", background: "#fff", display: "flex", flexDirection: "column", gap: "2.5rem", maxHeight: "90vh", overflowY: "auto" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                                <div>
                                    <span style={{ fontSize: "0.8rem", fontWeight: 900, color: "#10b981", letterSpacing: "3px", textTransform: "uppercase" }}>Student Submissions</span>
                                    <h2 style={{ fontSize: "2.5rem", fontWeight: 900, marginTop: "8px", color: "#1a202c", letterSpacing: "-1.5px" }}>{viewingSubmissionsAssignment.title}</h2>
                                    <div style={{ display: "flex", gap: "15px", color: "#718096", fontSize: "0.9rem", marginTop: "10px" }}>
                                        <span style={{ display: "flex", alignItems: "center", gap: "6px" }}><Users size={16} /> {students.length} Total Students</span>
                                        <span style={{ display: "flex", alignItems: "center", gap: "6px", color: "#10b981" }}><CheckCircle size={16} /> {viewingSubmissionsAssignment.submissions?.length || 0} Turned In</span>
                                    </div>
                                </div>
                                <button onClick={() => setViewingSubmissionsAssignment(null)} style={{ background: "#f8fafc", border: "1px solid #e2e8f0", color: "#1a202c", padding: "12px", borderRadius: "50%", cursor: "pointer" }}><X size={32} /></button>
                            </div>

                            <div style={{ border: "1px solid #e2e8f0", borderRadius: "30px", overflow: "hidden" }}>
                                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                                    <thead>
                                        <tr style={{ background: "#f8fafc", borderBottom: "1px solid #e2e8f0" }}>
                                            <th style={{ padding: "20px", textAlign: "left", fontSize: "0.8rem", fontWeight: 900, color: "#4a5568" }}>STUDENT NAME</th>
                                            <th style={{ padding: "20px", textAlign: "left", fontSize: "0.8rem", fontWeight: 900, color: "#4a5568" }}>SUBMISSION DATE</th>
                                            <th style={{ padding: "20px", textAlign: "left", fontSize: "0.8rem", fontWeight: 900, color: "#4a5568" }}>HISTORY / FILE</th>
                                            <th style={{ padding: "20px", textAlign: "left", fontSize: "0.8rem", fontWeight: 900, color: "#4a5568" }}>STATUS</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {students.map((student: any) => {
                                            const sub = (viewingSubmissionsAssignment.submissions || []).find((s: any) => s.studentId === student.id || s.email === student.email);
                                            return (
                                                <tr key={student.email} style={{ borderBottom: "1px solid #f1f5f9" }}>
                                                    <td style={{ padding: "20px" }}>
                                                        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                                                            <div style={{ width: 35, height: 35, borderRadius: "10px", background: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.8rem", fontWeight: 900, color: "#64748b" }}>{student.fullName?.[0]}</div>
                                                            <div>
                                                                <div style={{ fontWeight: 800, color: "#1a202c" }}>{student.fullName}</div>
                                                                <div style={{ fontSize: "0.7rem", color: "#a0aec0" }}>{student.email}</div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td style={{ padding: "20px", color: "#718096", fontSize: "0.9rem" }}>
                                                        {sub ? new Date(sub.submittedAt).toLocaleString() : "NOT SUBMITTED"}
                                                    </td>
                                                    <td style={{ padding: "20px" }}>
                                                        {sub ? (
                                                            <a href={sub.fileUrl} target="_blank" rel="noreferrer" style={{ color: "var(--primary)", textDecoration: "none", fontWeight: 800, fontSize: "0.8rem", display: "flex", alignItems: "center", gap: "5px" }}>
                                                                <Paperclip size={14} /> VIEW SUBMISSION
                                                            </a>
                                                        ) : (
                                                            <span style={{ fontSize: "0.8rem", color: "#cbd5e1" }}>NO RECORD</span>
                                                        )}
                                                    </td>
                                                    <td style={{ padding: "20px" }}>
                                                        <span style={{ padding: "6px 14px", borderRadius: "10px", fontSize: "0.7rem", fontWeight: 900, background: sub ? "rgba(16, 185, 129, 0.05)" : "#fff1f2", color: sub ? "#10b981" : "#f43f5e", border: sub ? "none" : "1px solid #fecaca" }}>
                                                            {sub ? "SUBMITTED" : "PENDING"}
                                                        </span>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* --- GRADING / SUBMISSION VIEW MODAL --- */}
            <AnimatePresence>
                {activeSubmission && (
                    <div style={{ position: 'fixed', inset: 0, zIndex: 11000, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.9)', backdropFilter: 'blur(20px)' }}>
                        <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="glass-panel" style={{ width: '90%', maxWidth: '800px', padding: '3.5rem', borderRadius: '40px', border: '1px solid rgba(139, 92, 246, 0.3)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '3rem' }}>
                                <div>
                                    <span style={{ color: 'var(--primary)', fontSize: '0.75rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '2px' }}>Submission Review</span>
                                    <h2 style={{ fontSize: '2rem', fontWeight: 900, marginTop: '8px' }}>{activeSubmission.studentName}</h2>
                                    <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem' }}>Submitted on {new Date(activeSubmission.submittedAt).toLocaleString()}</p>
                                </div>
                                <button onClick={() => setActiveSubmission(null)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}><X size={28} /></button>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '3rem' }}>
                                <div>
                                    <h5 style={{ color: 'var(--primary)', fontWeight: 900, marginBottom: '1.5rem', textTransform: 'uppercase', fontSize: '0.8rem' }}>Submission Artifacts</h5>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '2.5rem' }}>
                                        {activeSubmission.files?.map((file: string, idx: number) => (
                                            <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px', background: 'rgba(255,255,255,0.03)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                    <Paperclip size={18} color="var(--primary)" />
                                                    <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>{file.split('/').pop() || 'submission.zip'}</span>
                                                </div>
                                                <button style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer' }}><Download size={18} /></button>
                                            </div>
                                        ))}
                                        {(!activeSubmission.files || activeSubmission.files.length === 0) && (
                                            <div style={{ padding: '20px', background: 'rgba(255,255,255,0.02)', borderRadius: '16px', textAlign: 'center', color: 'rgba(255,255,255,0.2)', fontSize: '0.85rem' }}>No binary artifacts attached.</div>
                                        )}
                                    </div>
                                    <h5 style={{ color: 'var(--primary)', fontWeight: 900, marginBottom: '1.2rem', textTransform: 'uppercase', fontSize: '0.8rem' }}>Student Remarks</h5>
                                    <div style={{ padding: '1.5rem', background: 'rgba(0,0,0,0.2)', borderRadius: '18px', border: '1px solid rgba(255,255,255,0.05)', fontSize: '0.9rem', lineHeight: 1.6, minHeight: '100px' }}>
                                        {activeSubmission.remarks || 'No remarks provided.'}
                                    </div>
                                </div>

                                <div style={{ background: 'rgba(255,255,255,0.02)', padding: '2.5rem', borderRadius: '32px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                    <h5 style={{ fontWeight: 900, marginBottom: '2rem', textTransform: 'uppercase', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '8px' }}><ShieldCheck size={18} color="#10b981" /> Action</h5>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                            <label style={{ fontSize: '0.7rem', fontWeight: 900, color: 'var(--text-dim)' }}>STATUS</label>
                                            <select
                                                value={gradingData.status}
                                                onChange={(e) => setGradingData({ ...gradingData, status: e.target.value })}
                                                style={inputStyle}
                                            >
                                                <option value="ACCEPTED">APPROVE SUBMISSION</option>
                                                <option value="REJECTED">REQUEST RE-SUBMIT</option>
                                            </select>
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                            <label style={{ fontSize: '0.7rem', fontWeight: 900, color: 'var(--text-dim)' }}>FEEDBACK</label>
                                            <textarea
                                                value={gradingData.feedback}
                                                onChange={(e) => setGradingData({ ...gradingData, feedback: e.target.value })}
                                                rows={5}
                                                style={{ ...inputStyle, resize: 'none' }}
                                                placeholder="Professional feedback for the student..."
                                            />
                                        </div>
                                        <div style={{ display: 'flex', gap: '10px' }}>
                                            <button onClick={handleGradeSubmission} className="btn-quantum" style={{ flex: 1, padding: '15px', background: gradingData.status === 'ACCEPTED' ? '#10b981' : '#ef4444' }}>
                                                {gradingData.status === 'ACCEPTED' ? 'APPROVE PROTOCOL' : 'SEND FOR REVISION'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* --- EDIT ASSIGNMENT MODAL --- */}
            <AnimatePresence>
                {isEditAssignmentModalOpen && editingAssignment && (
                    <div style={{ position: 'fixed', inset: 0, zIndex: 11000, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)' }}>
                        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="glass-panel" style={{ width: '90%', maxWidth: '600px', padding: '3rem', borderRadius: '40px', maxHeight: '90vh', overflowY: 'auto' }}>
                            <h2 style={{ fontSize: '1.8rem', fontWeight: 900, marginBottom: '2rem' }}>Update Protocols: {editingAssignment.title}</h2>
                            <form onSubmit={handleUpdateAssignment} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                <input value={editingAssignment.title} onChange={(e) => setEditingAssignment({ ...editingAssignment, title: e.target.value })} placeholder="Assignment Title" style={inputStyle} required />
                                <textarea value={editingAssignment.description} onChange={(e) => setEditingAssignment({ ...editingAssignment, description: e.target.value })} placeholder="Abstract Description" rows={3} style={{ ...inputStyle, resize: 'none' }} required />

                                <div style={{ display: 'flex', gap: '1rem' }}>
                                    <div style={{ flex: 1 }}>
                                        <label style={{ fontSize: '0.7rem', color: 'var(--text-dim)', fontWeight: 800, marginBottom: '8px', display: 'block' }}>DIFFICULTY</label>
                                        <select value={editingAssignment.difficulty} onChange={(e) => setEditingAssignment({ ...editingAssignment, difficulty: e.target.value })} style={inputStyle}>
                                            <option value="EASY">Easy</option>
                                            <option value="MEDIUM">Medium</option>
                                            <option value="HARD">Hard</option>
                                        </select>
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <label style={{ fontSize: '0.7rem', color: 'var(--text-dim)', fontWeight: 800, marginBottom: '8px', display: 'block' }}>STATUS</label>
                                        <select value={editingAssignment.status} onChange={(e) => setEditingAssignment({ ...editingAssignment, status: e.target.value })} style={inputStyle}>
                                            <option value="ACTIVE">Active</option>
                                            <option value="UPCOMING">Upcoming</option>
                                            <option value="CLOSED">Closed</option>
                                        </select>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    <label style={{ fontSize: '0.7rem', color: 'var(--text-dim)', fontWeight: 800, display: 'block' }}>ATTACHMENT URL</label>
                                    <input value={editingAssignment.attachmentUrl} onChange={(e) => setEditingAssignment({ ...editingAssignment, attachmentUrl: e.target.value })} style={inputStyle} />
                                </div>

                                <textarea value={editingAssignment.instructions} onChange={(e) => setEditingAssignment({ ...editingAssignment, instructions: e.target.value })} placeholder="Critical Instructions" rows={4} style={{ ...inputStyle, resize: 'none' }} />

                                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                                    <button type="button" onClick={() => setIsEditAssignmentModalOpen(false)} style={{ flex: 1, padding: '12px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', color: '#fff', border: 'none', cursor: 'pointer' }}>CANCEL</button>
                                    <button type="submit" className="btn-quantum" style={{ flex: 2, padding: '12px', borderRadius: '12px', background: 'var(--primary)' }}>COMMIT CHANGES</button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* --- DELETE CONFIRMATION MODAL --- */}
            <AnimatePresence key="delete-recording-confirm-presence">
                {isDeleteConfirmOpen && (
                    <div key="delete-recording-overlay" style={{ position: 'fixed', inset: 0, zIndex: 20000, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)' }}>
                        <motion.div key="delete-recording-modal" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="glass-panel" style={{ width: '90%', maxWidth: '450px', padding: '3rem', borderRadius: '40px', textAlign: 'center' }}>
                            <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'rgba(239, 68, 68, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem' }}>
                                <AlertTriangle size={40} color="#ef4444" />
                            </div>
                            <h2 style={{ fontSize: '1.8rem', fontWeight: 900, marginBottom: '1rem' }}>Irreversible Action</h2>
                            <p style={{ color: 'var(--text-dim)', marginBottom: '2.5rem', lineHeight: 1.6 }}>You are about to permanently delete this session recording from MongoDB. This action cannot be undone.</p>

                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <button onClick={() => setIsDeleteConfirmOpen(false)} style={{ flex: 1, padding: '14px', borderRadius: '16px', background: 'rgba(255,255,255,0.05)', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 800 }}>CANCEL</button>
                                <button onClick={confirmDeleteRecording} style={{ flex: 1, padding: '14px', borderRadius: '16px', background: '#ef4444', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 900 }}>DELETE NOW</button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
            
            {/* --- SESSION REQUEST TRACKER MODAL --- */}
            <AnimatePresence key="request-tracker-modal-presence">
                {isRequestDetailModalOpen && (
                    <div key="request-tracker-overlay" style={{ position: 'fixed', inset: 0, zIndex: 11000, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(20px)' }}>
                        <motion.div key="request-tracker-modal" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="glass-panel" style={{ width: '95%', maxWidth: '900px', padding: '3rem', borderRadius: '40px', maxHeight: '90vh', overflowY: 'auto' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                                <div>
                                    <h2 style={{ fontSize: '2rem', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '15px' }}>
                                        <Send size={32} color="var(--primary)" /> Request Tracker
                                    </h2>
                                    <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem', marginTop: '5px' }}>Audit log and pending approvals for {selectedBatch?.name || selectedBatch?.batchName}</p>
                                </div>
                                <button onClick={() => setIsRequestDetailModalOpen(false)} style={{ background: 'rgba(255,255,255,0.05)', border: 'none', color: '#fff', padding: '10px', borderRadius: '50%', cursor: 'pointer' }}><X size={24} /></button>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                {sessionRequests.filter(r =>
                                    (r.data?.batchId === selectedBatch?.id || r.data?.batchId === selectedBatch?._id) ||
                                    (r.type === 'JOIN_SESSION' && r.data?.batchName === (selectedBatch?.name || selectedBatch?.batchName))
                                ).length === 0 ? (
                                    <div style={{ textAlign: 'center', padding: '5rem', background: 'rgba(255,255,255,0.02)', borderRadius: '32px' }}>
                                        <p style={{ color: 'var(--text-dim)', fontWeight: 800 }}>No requests found for this batch.</p>
                                    </div>
                                ) : (
                                    sessionRequests.filter(r =>
                                        (r.data?.batchId === selectedBatch?.id || r.data?.batchId === selectedBatch?._id) ||
                                        (r.type === 'JOIN_SESSION' && r.data?.batchName === (selectedBatch?.name || selectedBatch?.batchName))
                                    ).map((req, idx) => (
                                        <div key={idx} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '24px', padding: '2rem' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', alignItems: 'flex-start' }}>
                                                <div>
                                                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '8px' }}>
                                                        <span style={{ fontSize: '0.7rem', fontWeight: 900, padding: '5px 12px', borderRadius: '8px', background: req.type === 'JOIN_SESSION' ? '#10b98120' : (req.type === 'DELETE' ? '#ef444420' : '#3b82f620'), color: req.type === 'JOIN_SESSION' ? '#10b981' : (req.type === 'DELETE' ? '#ef4444' : '#3b82f6') }}>{req.type} REQUEST</span>
                                                        <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-dim)' }}>by {req.requestedBy}</span>
                                                    </div>
                                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontWeight: 600 }}>Requested on {new Date(req.createdAt).toLocaleString()}</div>
                                                </div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                                    <span style={{
                                                        fontSize: '0.8rem',
                                                        fontWeight: 900,
                                                        padding: '8px 16px',
                                                        borderRadius: '12px',
                                                        background: req.status === 'APPROVED' ? '#ecfdf5' : (req.status === 'REJECTED' ? '#fef2f2' : (req.status === 'PENDING' ? 'rgba(59, 130, 246, 0.1)' : 'rgba(255,255,255,0.05)')),
                                                        color: req.status === 'APPROVED' ? '#10b981' : (req.status === 'REJECTED' ? '#ef4444' : (req.status === 'PENDING' ? '#3b82f6' : '#f59e0b')),
                                                        border: `1px solid ${req.status === 'APPROVED' ? '#10b98130' : (req.status === 'REJECTED' ? '#ef444430' : 'transparent')}`
                                                    }}>{req.status}</span>
                                                    {req.status === 'APPROVED' && (
                                                        <span style={{ fontSize: '0.7rem', color: '#10b981', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                            <CheckCircle size={14} /> AUTHORIZED
                                                        </span>
                                                    )}
                                                    {(isFullAdmin || (req.status === 'PENDING' && req.requestedById === currentUser?.id)) && (
                                                        <button onClick={() => handleDeleteRequest(req.id || req._id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }} title={req.status === 'PENDING' ? "Withdraw Request" : "Delete Log Entry"}><Trash2 size={18} /></button>
                                                    )}
                                                </div>
                                            </div>

                                            {req.type === 'JOIN_SESSION' && (
                                                <div style={{ background: 'rgba(16, 185, 129, 0.05)', padding: '1.5rem', borderRadius: '20px', border: '1px solid rgba(16, 185, 129, 0.1)', marginTop: '1rem' }}>
                                                    <p style={{ fontSize: '0.7rem', fontWeight: 900, color: '#10b981', marginBottom: '10px', letterSpacing: '1px' }}>SESSION ACCESS REQUEST</p>
                                                    <p style={{ fontWeight: 800, fontSize: '1.2rem' }}>{req.data?.title || "Live Transmission"}</p>
                                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '12px' }}>
                                                        <div>
                                                            <label style={{ fontSize: '0.65rem', color: 'var(--text-dim)', fontWeight: 800, textTransform: 'uppercase' }}>Target Course</label>
                                                            <p style={{ fontWeight: 700 }}>{req.data?.courseName}</p>
                                                        </div>
                                                        <div>
                                                            <label style={{ fontSize: '0.65rem', color: 'var(--text-dim)', fontWeight: 800, textTransform: 'uppercase' }}>Batch Node</label>
                                                            <p style={{ fontWeight: 700 }}>{req.data?.batchName}</p>
                                                        </div>
                                                    </div>
                                                    {req.data?.message && (
                                                        <div style={{ marginTop: '15px', padding: '12px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                                            <label style={{ fontSize: '0.65rem', color: 'var(--text-dim)', fontWeight: 800, display: 'block', marginBottom: '4px' }}>STUDENT NOTE</label>
                                                            <p style={{ fontSize: '0.9rem', color: 'var(--text-dim)', fontStyle: 'italic' }}>"{req.data.message}"</p>
                                                        </div>
                                                    )}
                                                </div>
                                            )}

                                            {req.type === 'EDIT' && (
                                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginTop: '1rem' }}>
                                                    <div style={{ background: 'rgba(239, 68, 68, 0.05)', padding: '1.5rem', borderRadius: '20px', border: '1px solid rgba(239, 68, 68, 0.1)' }}>
                                                        <p style={{ fontSize: '0.7rem', fontWeight: 900, color: '#ef4444', marginBottom: '10px', letterSpacing: '1px' }}>OLD DETAILS</p>
                                                        <p style={{ fontWeight: 800, fontSize: '1rem' }}>{req.oldData?.title || 'Unknown Title'}</p>
                                                        <p style={{ fontSize: '0.85rem', color: 'var(--text-dim)', marginTop: '5px' }}>📅 {req.oldData?.startTime ? new Date(req.oldData.startTime).toLocaleString() : 'N/A'}</p>
                                                        <p style={{ fontSize: '0.85rem', color: 'var(--text-dim)' }}>🌐 {req.oldData?.platform} • ⏱️ {req.oldData?.duration} Mins</p>
                                                    </div>
                                                    <div style={{ background: 'rgba(16, 185, 129, 0.05)', padding: '1.5rem', borderRadius: '20px', border: '1px solid rgba(16, 185, 129, 0.1)' }}>
                                                        <p style={{ fontSize: '0.7rem', fontWeight: 900, color: '#10b981', marginBottom: '10px', letterSpacing: '1px' }}>NEW DETAILS</p>
                                                        <p style={{ fontWeight: 800, fontSize: '1rem' }}>{req.data?.title}</p>
                                                        <p style={{ fontSize: '0.85rem', color: 'var(--text-bright)', marginTop: '5px' }}>📅 {req.data?.startTime ? new Date(req.data.startTime).toLocaleString() : 'N/A'}</p>
                                                        <p style={{ fontSize: '0.85rem', color: 'var(--text-bright)' }}>🌐 {req.data?.platform} • ⏱️ {req.data?.duration} Mins</p>
                                                    </div>
                                                </div>
                                            )}

                                            {(req.type === 'DELETE' || req.type === 'DELETE_RECORDING') && (
                                                <div style={{ background: 'rgba(239, 68, 68, 0.05)', padding: '1.5rem', borderRadius: '20px', border: '1px solid rgba(239, 68, 68, 0.1)', marginTop: '1rem' }}>
                                                    <p style={{ fontSize: '0.7rem', fontWeight: 900, color: '#ef4444', marginBottom: '10px', letterSpacing: '1px' }}>TARGET FOR DELETION</p>
                                                    <p style={{ fontWeight: 800, fontSize: '1rem' }}>{req.data?.title || "Session/Recording"}</p>
                                                    <p style={{ fontSize: '0.85rem', color: 'var(--text-dim)', marginTop: '5px' }}>This {req.type === 'DELETE_RECORDING' ? 'recording' : 'session'} will be permanently removed.</p>
                                                </div>
                                            )}

                                            {req.type === 'DOWNLOAD_RECORDING' && (
                                                <div style={{ background: 'rgba(59, 130, 246, 0.05)', padding: '1.5rem', borderRadius: '20px', border: '1px solid rgba(59, 130, 246, 0.1)', marginTop: '1rem' }}>
                                                    <p style={{ fontSize: '0.7rem', fontWeight: 900, color: '#3b82f6', marginBottom: '10px', letterSpacing: '1px' }}>DOWNLOAD REQUEST</p>
                                                    <p style={{ fontWeight: 800, fontSize: '1rem' }}>{req.data?.title || "Recording"}</p>
                                                    <p style={{ fontSize: '0.85rem', color: 'var(--text-bright)', marginTop: '5px' }}>Tutor has requested to download this video file.</p>
                                                </div>
                                            )}

                                            {req.type === 'CREATE' && (
                                                <div style={{ background: 'rgba(59, 130, 246, 0.05)', padding: '1.5rem', borderRadius: '20px', border: '1px solid rgba(59, 130, 246, 0.1)', marginTop: '1rem' }}>
                                                    <p style={{ fontSize: '0.7rem', fontWeight: 900, color: '#3b82f6', marginBottom: '10px', letterSpacing: '1px' }}>PROPOSED SESSION</p>
                                                    <p style={{ fontWeight: 800, fontSize: '1rem' }}>{req.data?.title}</p>
                                                    <p style={{ fontSize: '0.85rem', color: 'var(--text-bright)', marginTop: '5px' }}>📅 {req.data?.startTime ? new Date(req.data.startTime).toLocaleString() : 'N/A'}</p>
                                                    <p style={{ fontSize: '0.85rem', color: 'var(--text-bright)' }}>🌐 {req.data?.platform} • ⏱️ {req.data?.duration} Mins</p>
                                                </div>
                                            )}

                                            {isFullAdmin && req.status === 'PENDING' && (
                                                <div style={{ display: 'flex', gap: '10px', marginTop: '1.5rem' }}>
                                                    <button onClick={() => handleSessionRequestAction(req.id || req._id, 'REJECTED')} style={{ flex: 1, padding: '14px', borderRadius: '16px', background: '#fef2f2', color: '#ef4444', border: '1px solid #fee2e2', fontWeight: 900, cursor: 'pointer' }}>REJECT</button>
                                                    <button onClick={() => handleSessionRequestAction(req.id || req._id, 'APPROVED')} className="btn-quantum" style={{ flex: 2, padding: '14px', borderRadius: '16px', fontWeight: 900 }}>{req.type === 'JOIN_SESSION' ? 'APPROVE ACCESS' : 'APPROVE & APPLY CHANGES'}</button>
                                                </div>
                                            )}
                                        </div>
                                    ))
                                )}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* --- PREMIUM NOTIFICATION TOAST --- */}
            <AnimatePresence key="toast-presence">
                {notification && (
                    <motion.div
                        key="notification-toast"
                        initial={{ opacity: 0, y: 50, x: '-50%' }}
                        animate={{ opacity: 1, y: 0, x: '-50%' }}
                        exit={{ opacity: 0, y: 20, x: '-50%' }}
                        style={{
                            position: 'fixed',
                            bottom: '40px',
                            left: '50%',
                            zIndex: 9999,
                            background: notification.type === 'error' ? 'rgba(220, 38, 38, 0.9)' : 'rgba(16, 185, 129, 0.9)',
                            color: '#fff',
                            padding: '16px 32px',
                            borderRadius: '20px',
                            fontWeight: 800,
                            fontSize: '0.9rem',
                            boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
                            backdropFilter: 'blur(10px)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            border: '1px solid rgba(255,255,255,0.1)'
                        }}
                    >
                        {notification.type === 'error' ? <AlertTriangle size={20} /> : <CheckCircle size={20} />}
                        {notification.message}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* --- PREMIUM QUANTUM DELETE MODAL --- */}
            <AnimatePresence key="delete-modal-presence">
                {alertConfig.isOpen && (
                    <div key="quantum-alert-overlay" style={{ position: 'fixed', inset: 0, zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
                        <motion.div
                            key="alert-backdrop"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setAlertConfig({ ...alertConfig, isOpen: false })}
                            style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)' }}
                        />
                        <motion.div
                            key="alert-modal-content"
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="glass-panel"
                            style={{
                                width: '100%',
                                maxWidth: '450px',
                                padding: '3rem',
                                borderRadius: '40px',
                                position: 'relative',
                                zIndex: 1,
                                border: alertConfig.type === 'DELETE' ? '1px solid rgba(239, 68, 68, 0.3)' : '1px solid rgba(124, 58, 237, 0.3)',
                                textAlign: 'center',
                                boxShadow: alertConfig.type === 'DELETE' ? '0 0 50px rgba(239, 68, 68, 0.15)' : '0 0 50px rgba(124, 58, 237, 0.15)'
                            }}
                        >
                            <div style={{
                                width: '80px',
                                height: '80px',
                                borderRadius: '24px',
                                background: alertConfig.type === 'DELETE' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(124, 58, 237, 0.1)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: '0 auto 2rem',
                                color: alertConfig.type === 'DELETE' ? '#ef4444' : 'var(--primary)'
                            }}>
                                {alertConfig.type === 'DELETE' ? <Trash2 size={40} /> : <Shield size={40} />}
                            </div>
                            
                            <h2 style={{ fontSize: '1.8rem', fontWeight: 900, marginBottom: '1rem', color: '#fff' }}>{alertConfig.title}</h2>
                            <p style={{ color: 'var(--text-dim)', lineHeight: 1.6, marginBottom: '2.5rem', fontSize: '1rem' }}>{alertConfig.message}</p>
                            
                            <div style={{ display: 'flex', gap: '15px' }}>
                                <button 
                                    onClick={() => setAlertConfig({ ...alertConfig, isOpen: false })}
                                    style={{ flex: 1, padding: '16px', borderRadius: '20px', background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', fontWeight: 800, cursor: 'pointer' }}
                                >
                                    CANCEL
                                </button>
                                <button 
                                    onClick={() => {
                                        alertConfig.onConfirm?.();
                                        setAlertConfig({ ...alertConfig, isOpen: false });
                                    }}
                                    style={{ 
                                        flex: 1, 
                                        padding: '16px', 
                                        borderRadius: '20px', 
                                        background: alertConfig.type === 'DELETE' ? '#ef4444' : 'var(--primary)', 
                                        color: '#fff', 
                                        border: 'none', 
                                        fontWeight: 900, 
                                        cursor: 'pointer',
                                        boxShadow: alertConfig.type === 'DELETE' ? '0 10px 20px rgba(239, 68, 68, 0.3)' : '0 10px 20px rgba(124, 58, 237, 0.3)'
                                    }}
                                >
                                    CONFIRM
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </DashboardLayout>
    );
}

function DriveFolder({ folder, onClick, onShare, onRename, onDelete }: any) {
    return (
        <motion.div
            whileHover={{ scale: 1.05, background: 'rgba(255,255,255,0.03)' }}
            className="drive-card"
            style={{ padding: '1.5rem', borderRadius: '24px', background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.03)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px', textAlign: 'center', cursor: 'pointer', position: 'relative' }}
        >
            <div style={{ position: 'absolute', top: '15px', right: '15px', display: 'flex', gap: '5px' }}>
                <button onClick={(e) => onShare(e)} title="Share" style={{ background: 'none', border: 'none', color: 'var(--primary)', opacity: 0.9, cursor: 'pointer' }}><Share2 size={16} /></button>
                <button onClick={(e) => onRename(e)} title="Rename" style={{ background: 'none', border: 'none', color: 'var(--text-dim)', opacity: 0.7, cursor: 'pointer' }}><Edit2 size={16} /></button>
                <button onClick={(e) => onDelete(e)} title="Delete" style={{ background: 'none', border: 'none', color: '#ef4444', opacity: 0.9, cursor: 'pointer' }}><Trash2 size={16} /></button>
            </div>
            <div onClick={onClick}>
                <Folder size={64} fill="rgba(124, 58, 237, 0.2)" color="var(--primary)" />
                <div style={{ marginTop: '10px' }}>
                    <div style={{ fontWeight: 800, fontSize: '0.9rem' }}>{folder.name}</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>{folder.files?.length || 0} Files</div>
                </div>
            </div>
        </motion.div>
    );
}

function FileItem({ name, type, size, date, onRename, onDelete, onView }: any) {
    return (
        <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1.25rem', borderRadius: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid rgba(255,255,255,0.03)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                <div style={{ padding: '10px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', color: 'var(--primary)' }}>
                    {type === 'pdf' || type === 'doc' || type === 'txt' ? <FileText size={20} /> : <Play size={20} />}
                </div>
                <div>
                    <div style={{ fontSize: '0.95rem', fontWeight: 800 }}>{name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>{size} • {date}</div>
                </div>
            </div>
            <div style={{ display: 'flex', gap: '15px' }}>
                <button onClick={onView} title="View" style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer' }}><Eye size={18} /></button>
                <button onClick={onRename} title="Rename" style={{ background: 'none', border: 'none', color: '#f59e0b', cursor: 'pointer' }}><Edit2 size={18} /></button>
                <button onClick={onDelete} title="Delete" style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}><Trash2 size={18} /></button>
                <button title="Download" style={{ background: 'none', border: 'none', color: 'var(--text-dim)', cursor: 'pointer' }}><Download size={18} /></button>
            </div>
        </div>
    );
}

function SharedMemberItem({ name, role, onRoleChange }: any) {
    return (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 900 }}>{name.charAt(0)}</div>
                <div style={{ fontSize: '0.95rem', fontWeight: 800 }}>{name}</div>
            </div>
            {onRoleChange ? (
                <select
                    value={role}
                    onChange={(e) => onRoleChange(e.target.value)}
                    style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 800, fontSize: '0.8rem', outline: 'none', cursor: 'pointer' }}
                >
                    <option value="VIEWER">VIEWER</option>
                    <option value="EDITOR">EDITOR</option>
                    <option value="OWNER">OWNER</option>
                </select>
            ) : (
                <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontWeight: 800, textTransform: 'uppercase' }}>{role}</span>
            )}
        </div>
    );
}

function InfoSnippet({ icon, label, value }: any) {
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(255,255,255,0.03)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{icon}</div>
            <div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', fontWeight: 800, textTransform: 'uppercase' }}>{label}</div>
                <div style={{ fontSize: '0.9rem', fontWeight: 900 }}>{value}</div>
            </div>
        </div>
    );
}

function CourseCard({ course, onClick, onDelete, isAdmin, delay }: any) {
    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }} onClick={onClick} className="glass-panel"
            style={{ padding: '2.5rem', borderRadius: '32px', cursor: 'pointer', border: '1px solid rgba(255,255,255,0.05)', position: 'relative', overflow: 'hidden' }}
            whileHover={{ y: -5, background: 'rgba(255,255,255,0.06)' }}
        >
            {isAdmin && (
                <button 
                    onClick={onDelete}
                    style={{
                        position: 'absolute',
                        top: '20px',
                        right: '20px',
                        background: 'rgba(239, 68, 68, 0.1)',
                        color: '#ef4444',
                        border: '1px solid rgba(239, 68, 68, 0.2)',
                        padding: '8px',
                        borderRadius: '12px',
                        cursor: 'pointer',
                        zIndex: 10,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.3s'
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#ef4444';
                        e.currentTarget.style.color = '#fff';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)';
                        e.currentTarget.style.color = '#ef4444';
                    }}
                >
                    <Trash2 size={16} />
                </button>
            )}
            <Book size={32} color="var(--primary)" style={{ marginBottom: '1.5rem' }} />
            <h3 style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: '0.75rem' }}>{course.title}</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-dim)', lineHeight: 1.6, marginBottom: '2rem' }}>{course.description}</p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1.5rem' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 900, color: 'var(--text-dim)' }}>{course.duration}</span>
                <span style={{ color: 'var(--primary)', fontWeight: 900, fontSize: '0.85rem', display: 'flex', alignItems: 'center' }}>VIEW GDRIVE <ChevronRight size={16} /></span>
            </div>
        </motion.div>
    );
}

function BatchCard({ batch, onClick, delay }: any) {
    return (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay }} onClick={onClick} className="glass-panel"
            style={{ padding: '2.5rem', borderRadius: '32px', cursor: 'pointer', border: '1px solid rgba(255,255,255,0.05)' }}
            whileHover={{ y: -5 }}
        >
            <Layers size={32} color="var(--secondary)" style={{ marginBottom: '1.5rem' }} />
            <h3 style={{ fontSize: '1.4rem', fontWeight: 900, marginBottom: '0.5rem' }}>{batch.name || batch.batchName}</h3>
            <div style={{ display: 'flex', gap: '15px', color: 'var(--text-dim)', fontSize: '0.8rem', fontWeight: 700, marginBottom: '1.5rem' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><Clock size={14} /> DRIVE SYNCED</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Users size={18} color="var(--secondary)" />
                    <span style={{ fontSize: '0.85rem', fontWeight: 800 }}>{batch.totalStudents || 0} Members</span>
                </div>
                <ChevronRight size={20} color="var(--primary)" />
            </div>
        </motion.div>
    );
}

const inputStyle = {
    padding: '14px 18px',
    borderRadius: '16px',
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.1)',
    color: '#fff',
    outline: 'none',
    width: '100%',
    fontFamily: 'inherit',
    fontSize: '1rem'
};

export default function AcademicHub() {
    return (
        <Suspense fallback={<div>Loading Academic Hub...</div>}>
            <AcademicHubPage />
        </Suspense>
    );
}
