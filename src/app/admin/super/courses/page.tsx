"use client";

import { useState, Fragment } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { motion, AnimatePresence } from 'framer-motion';
import {
    BookOpen, Layers, Users, DollarSign,
    Plus, Search, Filter, MoreVertical,
    CheckCircle, XCircle, Clock, Star,
    Edit, Trash2, ChevronDown, ChevronUp,
    FileText, Video, PenTool, Layout, Upload, Calendar, Link, MoreHorizontal, Download, File, Folder, ChevronRight, CornerUpLeft, Lock, Unlock, Eye
} from 'lucide-react';
import styles from '../SuperAdmin.module.css';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';

// -- Types --
type CourseStatus = 'Active' | 'Draft' | 'Archived';
type CourseCategory = 'Development' | 'Data Science' | 'Design' | 'Cloud' | 'Cyber Security';
type ResourceType = 'Video' | 'File' | 'Link' | 'Folder';
type AccessStatus = 'Granted' | 'Revoked';

interface Module {
    id: number;
    title: string;
    topics: number;
    duration: string;
}

interface BatchResource {
    id: string;
    title: string;
    type: ResourceType;
    url?: string;
    date: string;
    uploadedBy: string; // Tutor Name
    parentId: string | null; // For nested folders
    accessList: string[]; // List of Student IDs who have access. Empty = All
}

interface BatchStudent {
    id: string;
    name: string;
    email: string;
    status: AccessStatus;
    joinDate: string;
    lastActive: string;
    progress: number; // %
}

interface BatchTutor {
    id: string;
    name: string;
    email: string;
    status: AccessStatus;
}

interface ActivityLog {
    id: string;
    studentId: string;
    resourceName: string;
    action: 'Opened' | 'Completed' | 'Downloaded';
    timestamp: string;
    duration?: string; // e.g., "15m 20s"
}

interface Batch {
    id: string;
    name: string;
    startDate: string;
    time: string;
    students: BatchStudent[];
    tutors: BatchTutor[];
    resources: BatchResource[];
}

interface Course {
    id: string;
    title: string;
    category: CourseCategory;
    description: string;
    duration: string;
    fee: number;
    status: CourseStatus;
    students: number;
    rating: number;
    modules: Module[];
    batches: Batch[];
    lastUpdated: string;
    thumbnail: string;
}

// -- Mock Helpers --
const generateMockStudents = (count: number): BatchStudent[] => {
    return Array.from({ length: count }).map((_, i) => ({
        id: `S-2024-${1000 + i}`,
        name: `Student ${i + 1}`,
        email: `student${i + 1}@example.com`,
        status: i % 10 === 0 ? 'Revoked' : 'Granted',
        joinDate: '2024-03-01',
        lastActive: '2024-03-05 10:30 AM',
        progress: Math.floor(Math.random() * 100)
    }));
};

const generateMockActivity = (studentId: string): ActivityLog[] => {
    return [
        { id: 'ACT-1', studentId, resourceName: 'Java Installation Guide', action: 'Downloaded', timestamp: '2024-03-01 10:05 AM' },
        { id: 'ACT-2', studentId, resourceName: 'Week 1 Recording', action: 'Opened', timestamp: '2024-03-02 02:15 PM', duration: '45m 00s' },
        { id: 'ACT-3', studentId, resourceName: 'Week 1 Recording', action: 'Completed', timestamp: '2024-03-02 03:00 PM' },
        { id: 'ACT-4', studentId, resourceName: 'Assignment 1', action: 'Opened', timestamp: '2024-03-03 09:30 AM', duration: '5m 12s' },
    ];
};

// -- Mock Data --
const INITIAL_COURSES: Course[] = [
    {
        id: 'C-101', title: 'Full Stack Java Development', category: 'Development',
        description: 'Master Java, Spring Boot, and React for enterprise application development.',
        duration: '6 Months', fee: 25000, status: 'Active', students: 120, rating: 4.8,
        lastUpdated: '2024-02-15', thumbnail: '☕',
        modules: [
            { id: 1, title: 'Core Java Fundamentals', topics: 12, duration: '4 Weeks' },
            { id: 2, title: 'Advanced Java & J2EE', topics: 8, duration: '3 Weeks' },
            { id: 3, title: 'Spring Boot Microservices', topics: 15, duration: '6 Weeks' },
            { id: 4, title: 'React Frontend Integration', topics: 10, duration: '4 Weeks' }
        ],
        batches: [
            {
                id: 'B-101', name: 'Java Weekend Batch', startDate: '2024-03-01', time: '10:00 AM - 01:00 PM',
                students: generateMockStudents(25),
                tutors: [
                    { id: 'T-1', name: 'Sarah Jenkins', email: 'sarah.j@academy.com', status: 'Granted' },
                    { id: 'T-2', name: 'Mike Ross', email: 'mike.r@academy.com', status: 'Granted' }
                ],
                resources: [
                    { id: 'F-1', title: 'Class Recordings', type: 'Folder', date: '2024-03-01', uploadedBy: 'System', parentId: null, accessList: [] },
                    { id: 'R-1', title: 'Java Installation Guide', type: 'File', url: '#', date: '2024-03-01', uploadedBy: 'Sarah Jenkins', parentId: null, accessList: [] },
                    { id: 'R-2', title: 'Week 1 Recording', type: 'Video', url: '#', date: '2024-03-02', uploadedBy: 'Mike Ross', parentId: 'F-1', accessList: [] } // Inside folder
                ]
            }
        ]
    },
    // ... other courses (omitted for brevity, structure is identical)
    {
        id: 'C-102', title: 'Data Science with Python', category: 'Data Science',
        description: 'Comprehensive data science bootcamp covering Python, ML, and AI.',
        duration: '5 Months', fee: 30000, status: 'Active', students: 85, rating: 4.7,
        lastUpdated: '2024-02-10', thumbnail: '🐍',
        modules: [
            { id: 1, title: 'Python for Data Analysis', topics: 14, duration: '5 Weeks' },
            { id: 2, title: 'Machine Learning Algorithms', topics: 18, duration: '8 Weeks' }
        ],
        batches: []
    },
    {
        id: 'C-103', title: 'DevOps & Cloud Engineering', category: 'Cloud',
        description: 'Learn AWS, Docker, Kubernetes and CI/CD pipelines.',
        duration: '4 Months', fee: 28000, status: 'Active', students: 60, rating: 4.9,
        lastUpdated: '2024-02-20', thumbnail: '☁️',
        modules: [],
        batches: []
    },
    {
        id: 'C-104', title: 'UI/UX Design Masterclass', category: 'Design',
        description: 'Design beautiful user interfaces and user experiences.',
        duration: '3 Months', fee: 18000, status: 'Draft', students: 0, rating: 0,
        lastUpdated: '2024-02-25', thumbnail: '🎨',
        modules: [
            { id: 1, title: 'Design Thinking', topics: 5, duration: '2 Weeks' },
            { id: 2, title: 'Figma Mastery', topics: 12, duration: '4 Weeks' }
        ],
        batches: []
    },
];

const MiniChart = ({ color }: { color: string }) => (
    <div style={{ height: '40px', width: '80px' }}>
        <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={[
                { v: 10 }, { v: 25 }, { v: 15 }, { v: 30 }, { v: 20 }, { v: 45 }, { v: 40 }
            ]}>
                <defs>
                    <linearGradient id={`grad-${color}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={color} stopOpacity={0.4} />
                        <stop offset="100%" stopColor={color} stopOpacity={0} />
                    </linearGradient>
                </defs>
                <Area type="monotone" dataKey="v" stroke={color} strokeWidth={2} fill={`url(#grad-${color})`} />
            </AreaChart>
        </ResponsiveContainer>
    </div>
);

export default function CoursesPage() {
    const [courses, setCourses] = useState<Course[]>(INITIAL_COURSES);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('All');

    // UI State
    const [expandedCourseId, setExpandedCourseId] = useState<string | null>(null);
    const [expandedTab, setExpandedTab] = useState<'curriculum' | 'batches'>('curriculum');

    // Modal States
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [currentCourse, setCurrentCourse] = useState<Course | null>(null);

    const [isBatchOpen, setIsBatchOpen] = useState(false);
    const [currentBatch, setCurrentBatch] = useState<Batch | null>(null);
    const [batchTab, setBatchTab] = useState<'content' | 'people' | 'tutors'>('content');
    const [activeBatchCourseId, setActiveBatchCourseId] = useState<string | null>(null);
    const [newStudentInput, setNewStudentInput] = useState('');
    const [newTutorInput, setNewTutorInput] = useState('');

    // Folder Navigation State
    const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);

    // Student Tracking State
    const [selectedStudent, setSelectedStudent] = useState<BatchStudent | null>(null);
    const [studentActivity, setStudentActivity] = useState<ActivityLog[]>([]);

    // Resource Access Modal State
    const [resourceAccessModal, setResourceAccessModal] = useState<{ isOpen: boolean, resourceId: string | null }>({ isOpen: false, resourceId: null });

    // Filter Logic
    const filteredCourses = courses.filter(course => {
        const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            course.id.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || course.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const stats = {
        total: courses.length,
        active: courses.filter(c => c.status === 'Active').length,
        students: courses.reduce((acc, curr) => acc + curr.students, 0),
        revenue: courses.reduce((acc, curr) => acc + (curr.students * curr.fee), 0)
    };

    // -- Course Actions --
    const handleEditCourse = (course: Course | null) => {
        setCurrentCourse(course ? { ...course } : null);
        setIsEditOpen(true);
    };

    const handleSaveCourse = (e: React.FormEvent) => {
        e.preventDefault();
        if (currentCourse) {
            if (courses.some(c => c.id === currentCourse.id)) {
                setCourses(courses.map(c => c.id === currentCourse.id ? currentCourse : c));
            } else {
                setCourses([...courses, { ...currentCourse, id: `C-${100 + courses.length + 1}` }]);
            }
        }
        setIsEditOpen(false);
    };

    // -- Batch Actions --
    const handleOpenBatch = (courseId: string, batch?: Batch) => {
        setActiveBatchCourseId(courseId);
        setCurrentBatch(batch || {
            id: `B-${Math.floor(Math.random() * 1000)}`,
            name: '', startDate: '', time: '', students: [], tutors: [], resources: []
        });
        setBatchTab('content'); // Default tab
        setCurrentFolderId(null); // Reset to root
        setNewStudentInput('');
        setNewTutorInput('');
        setIsBatchOpen(true);
    };

    const handleViewStudentHistory = (student: BatchStudent) => {
        setSelectedStudent(student);
        setStudentActivity(generateMockActivity(student.id));
    };

    const handleAddStudent = () => {
        if (!currentBatch || !newStudentInput.trim()) return;
        const newStudent: BatchStudent = {
            id: `S-NEW-${Date.now()}`,
            name: newStudentInput,
            email: `${newStudentInput.toLowerCase().replace(/\s/g, '.')}@student.com`, // Mock email generation
            status: 'Granted',
            joinDate: new Date().toISOString().split('T')[0],
            lastActive: 'Never',
            progress: 0
        };
        setCurrentBatch({
            ...currentBatch,
            students: [...currentBatch.students, newStudent]
        });
        setNewStudentInput('');
    };

    const handleAddTutor = () => {
        if (!currentBatch || !newTutorInput.trim()) return;
        const newTutor: BatchTutor = {
            id: `T-NEW-${Date.now()}`,
            name: newTutorInput,
            email: `${newTutorInput.toLowerCase().replace(/\s/g, '.')}@tutor.com`, // Mock email generation
            status: 'Granted'
        };
        setCurrentBatch({
            ...currentBatch,
            tutors: [...currentBatch.tutors, newTutor]
        });
        setNewTutorInput('');
    };

    const handleSaveBatch = (e: React.FormEvent) => {
        e.preventDefault();
        if (currentBatch && activeBatchCourseId) {
            const courseIndex = courses.findIndex(c => c.id === activeBatchCourseId);
            if (courseIndex > -1) {
                const updatedCourses = [...courses];
                const course = updatedCourses[courseIndex];
                const batchIndex = course.batches.findIndex(b => b.id === currentBatch.id);

                if (batchIndex > -1) {
                    course.batches[batchIndex] = currentBatch;
                } else {
                    course.batches.push(currentBatch);
                }
                setCourses(updatedCourses);
            }
        }
        setIsBatchOpen(false);
    };

    const toggleRowExpand = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (expandedCourseId === id) {
            setExpandedCourseId(null);
        } else {
            setExpandedCourseId(id);
            setExpandedTab('curriculum'); // Reset to default
        }
    };

    // -- Resource & Content Logic --
    const getCurrentResources = () => {
        if (!currentBatch) return [];
        // Normalize null/undefined for comparison
        const targetParentId = currentFolderId || null;
        return currentBatch.resources.filter(res => (res.parentId || null) === targetParentId);
    };

    const handleCreateFolder = () => {
        setCurrentBatch(prev => {
            if (!prev) return null;
            const newFolder: BatchResource = {
                id: `F-${Date.now()}`,
                title: 'New Folder',
                type: 'Folder',
                date: new Date().toISOString().split('T')[0],
                uploadedBy: 'Admin',
                parentId: currentFolderId || null,
                accessList: []
            };
            return {
                ...prev,
                resources: [...prev.resources, newFolder]
            };
        });
    };

    const handleNavigateFolder = (folderId: string | null) => {
        setCurrentFolderId(folderId);
    };

    const getBreadcrumbs = () => {
        if (!currentFolderId) return [{ id: null, title: 'Root' }];
        const crumbs = [{ id: null, title: 'Root' }];

        // Find current folder
        let current = currentBatch?.resources.find(r => r.id === currentFolderId);
        const path = [];

        // Traverse up
        while (current) {
            path.unshift({ id: current.id, title: current.title });
            const parentId = current.parentId;
            if (parentId) {
                current = currentBatch?.resources.find(r => r.id === parentId);
            } else {
                current = undefined;
            }
        }
        return [...crumbs, ...path];
    };

    // -- Drag & Drop Helpers --
    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (currentBatch) {
            const newResources: BatchResource[] = Array.from(e.dataTransfer.files).map((f, i) => ({
                id: `R-DROP-${Date.now()}-${i}`,
                title: f.name,
                type: f.type.includes('video') ? 'Video' : 'File',
                url: '#',
                date: new Date().toISOString().split('T')[0],
                uploadedBy: 'Admin (Drag & Drop)',
                parentId: currentFolderId || null, // Drop into current folder
                accessList: []
            }));
            setCurrentBatch(prev => prev ? { ...prev, resources: [...prev.resources, ...newResources] } : null);
        }
    };

    // -- Access Control Logic --
    const toggleResourceAccess = (resourceId: string, studentId: string) => {
        setCurrentBatch(prev => {
            if (!prev) return null;
            const resIndex = prev.resources.findIndex(r => r.id === resourceId);
            if (resIndex === -1) return prev;

            const updatedResources = [...prev.resources];
            const currentAccessList = updatedResources[resIndex].accessList || [];

            let newAccessList;
            if (currentAccessList.includes(studentId)) {
                newAccessList = currentAccessList.filter(id => id !== studentId);
            } else {
                newAccessList = [...currentAccessList, studentId];
            }

            updatedResources[resIndex] = { ...updatedResources[resIndex], accessList: newAccessList };
            return { ...prev, resources: updatedResources };
        });
    };

    const getResourceIcon = (type: ResourceType) => {
        switch (type) {
            case 'Video': return <Video size={18} />;
            case 'File': return <FileText size={18} />;
            case 'Folder': return <Folder size={18} fill="#60a5fa" color="#60a5fa" />;
            default: return <Link size={18} />;
        }
    };

    const getResourceColor = (type: ResourceType) => {
        switch (type) {
            case 'Video': return { bg: 'rgba(239, 68, 68, 0.2)', text: '#f87171' };
            case 'Folder': return { bg: 'rgba(59, 130, 246, 0.2)', text: '#60a5fa' };
            default: return { bg: 'rgba(16, 185, 129, 0.2)', text: '#34d399' };
        }
    };

    return (
        <DashboardLayout role="super_admin">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={styles.container}>
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '1.5rem' }}>
                    <div>
                        <div className={styles.textLabel} style={{ marginBottom: '0.25rem' }}>Academic Administration</div>
                        <h1 className={styles.textH1}>Course Management</h1>
                    </div>
                </div>

                {/* KPI Stats */}
                <div className={styles.advStatsGrid}>
                    <div className={styles.advCard}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <div className={styles.advCardIconBox} style={{ background: 'rgba(139, 92, 246, 0.15)', color: '#8b5cf6' }}><BookOpen size={24} /></div>
                            <MiniChart color="#8b5cf6" />
                        </div>
                        <div style={{ fontSize: '2rem', fontWeight: 700, color: 'white', fontFamily: 'Rajdhani', marginTop: '0.5rem' }}>{stats.total}</div>
                        <div className={styles.textSub}>Total Courses</div>
                    </div>
                    <div className={styles.advCard}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <div className={styles.advCardIconBox} style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#34d399' }}><CheckCircle size={24} /></div>
                            <MiniChart color="#34d399" />
                        </div>
                        <div style={{ fontSize: '2rem', fontWeight: 700, color: 'white', fontFamily: 'Rajdhani', marginTop: '0.5rem' }}>{stats.active}</div>
                        <div className={styles.textSub}>Active Catalogs</div>
                    </div>
                    <div className={styles.advCard}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <div className={styles.advCardIconBox} style={{ background: 'rgba(59, 130, 246, 0.15)', color: '#60a5fa' }}><Users size={24} /></div>
                            <MiniChart color="#60a5fa" />
                        </div>
                        <div style={{ fontSize: '2rem', fontWeight: 700, color: 'white', fontFamily: 'Rajdhani', marginTop: '0.5rem' }}>{stats.students}</div>
                        <div className={styles.textSub}>Total Enrolled</div>
                    </div>
                    <div className={styles.advCard}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <div className={styles.advCardIconBox} style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24' }}><DollarSign size={24} /></div>
                            <MiniChart color="#fbbf24" />
                        </div>
                        <div style={{ fontSize: '2rem', fontWeight: 700, color: 'white', fontFamily: 'Rajdhani', marginTop: '0.5rem' }}>₹{(stats.revenue / 100000).toFixed(1)}L</div>
                        <div className={styles.textSub}>Revenue Est.</div>
                    </div>
                </div>

                {/* Filters */}
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                    {['All', 'Development', 'Data Science', 'Cloud', 'Design', 'Cyber Security'].map(cat => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            style={{
                                padding: '0.5rem 1.25rem',
                                borderRadius: '8px',
                                background: selectedCategory === cat ? 'rgba(124, 58, 237, 0.2)' : 'rgba(30, 41, 59, 0.5)',
                                color: selectedCategory === cat ? '#c4b5fd' : '#94a3b8',
                                border: selectedCategory === cat ? '1px solid rgba(124, 58, 237, 0.5)' : '1px solid rgba(71, 85, 105, 0.5)',
                                cursor: 'pointer',
                                fontSize: '0.9rem',
                                fontWeight: 500,
                                transition: 'all 0.2s'
                            }}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Courses Table */}
                <div className={styles.card}>
                    <div className={styles.tableContainer}>
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th style={{ paddingLeft: '1.5rem' }}>Course Name</th>
                                    <th>Category</th>
                                    <th>Fee Structure</th>
                                    <th>Last Updated</th>
                                    <th>Status</th>
                                    <th>Performance</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredCourses.map(course => (
                                    <Fragment key={course.id}>
                                        <tr className={styles.interactiveRow} onClick={(e) => toggleRowExpand(course.id, e)}>
                                            <td style={{ paddingLeft: '1.5rem' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                                    <div style={{
                                                        width: '40px', height: '40px', borderRadius: '8px',
                                                        background: 'rgba(30, 41, 59, 1)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                        fontSize: '1.2rem', border: '1px solid rgba(51, 65, 85, 0.5)'
                                                    }}>
                                                        {course.thumbnail}
                                                    </div>
                                                    <div>
                                                        <div style={{ fontWeight: 600, color: 'white', fontSize: '0.95rem' }}>{course.title}</div>
                                                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{course.id} • {course.duration}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td><span style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>{course.category}</span></td>
                                            <td><div style={{ color: 'white', fontWeight: 500 }}>₹{course.fee.toLocaleString()}</div></td>
                                            <td><div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>{course.lastUpdated}</div></td>
                                            <td>
                                                <span className={styles.statusBadge} style={{
                                                    background: course.status === 'Active' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(148, 163, 184, 0.1)',
                                                    color: course.status === 'Active' ? '#10b981' : '#94a3b8'
                                                }}>{course.status}</span>
                                            </td>
                                            <td>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', color: '#facc15', fontSize: '0.85rem', fontWeight: 600 }}>
                                                        <Star size={12} fill="#facc15" style={{ marginRight: '4px' }} /> {course.rating}
                                                    </div>
                                                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>({course.students} students)</div>
                                                </div>
                                            </td>
                                            <td>
                                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                    <button onClick={(e) => { e.stopPropagation(); handleEditCourse(course); }} className={styles.btnSecondary} style={{ padding: '6px', height: 'auto', color: '#60a5fa' }}><Edit size={14} /></button>
                                                    <button onClick={(e) => { e.stopPropagation(); /* Delete */ }} className={styles.btnSecondary} style={{ padding: '6px', height: 'auto', color: '#ef4444' }}><Trash2 size={14} /></button>
                                                    {expandedCourseId === course.id ? <ChevronUp size={16} color="#94a3b8" /> : <ChevronDown size={16} color="#94a3b8" />}
                                                </div>
                                            </td>
                                        </tr>
                                        {/* Expanded Row */}
                                        <AnimatePresence>
                                            {expandedCourseId === course.id && (
                                                <motion.tr initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                                    <td colSpan={7} style={{ padding: 0, borderBottom: '1px solid rgba(51, 65, 85, 0.3)' }}>
                                                        <div style={{ background: 'rgba(15, 23, 42, 0.3)', padding: '1.5rem', paddingLeft: '4rem' }}>
                                                            {/* Advanced Tabs for Expanded View */}
                                                            <div style={{
                                                                display: 'flex',
                                                                padding: '0.25rem',
                                                                background: 'rgba(15, 23, 42, 0.4)',
                                                                borderRadius: '8px',
                                                                border: '1px solid rgba(51, 65, 85, 0.3)',
                                                                width: 'fit-content',
                                                                marginBottom: '1.5rem',
                                                                gap: '0.5rem'
                                                            }}>
                                                                {[
                                                                    { id: 'curriculum', label: 'Curriculum & Modules', icon: Layers },
                                                                    { id: 'batches', label: 'Active Batches', icon: Users }
                                                                ].map(tab => (
                                                                    <button
                                                                        key={tab.id}
                                                                        onClick={() => setExpandedTab(tab.id as any)}
                                                                        style={{
                                                                            position: 'relative',
                                                                            padding: '0.5rem 1rem',
                                                                            borderRadius: '6px',
                                                                            border: 'none',
                                                                            background: 'transparent',
                                                                            color: expandedTab === tab.id ? '#ffffff' : '#94a3b8',
                                                                            fontWeight: expandedTab === tab.id ? 600 : 500,
                                                                            fontSize: '0.85rem',
                                                                            cursor: 'pointer',
                                                                            display: 'flex',
                                                                            alignItems: 'center',
                                                                            gap: '0.5rem',
                                                                            outline: 'none',
                                                                            zIndex: 1
                                                                        }}
                                                                    >
                                                                        {expandedTab === tab.id && (
                                                                            <motion.div
                                                                                layoutId="activeTabCourse"
                                                                                style={{
                                                                                    position: 'absolute',
                                                                                    inset: 0,
                                                                                    background: 'rgba(124, 58, 237, 0.2)',
                                                                                    border: '1px solid rgba(139, 92, 246, 0.3)',
                                                                                    borderRadius: '6px',
                                                                                    zIndex: -1
                                                                                }}
                                                                                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                                                            />
                                                                        )}
                                                                        <tab.icon size={14} />
                                                                        {tab.label}
                                                                    </button>
                                                                ))}
                                                            </div>

                                                            {expandedTab === 'curriculum' && (
                                                                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1rem' }}>
                                                                    {course.modules.length > 0 ? course.modules.map(mod => (
                                                                        <div key={mod.id} style={{ background: 'rgba(30, 41, 59, 0.5)', padding: '1rem', borderRadius: '0.5rem', border: '1px solid rgba(51, 65, 85, 0.5)', display: 'flex', gap: '0.75rem' }}>
                                                                            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(139, 92, 246, 0.1)', color: '#a78bfa', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>{mod.id}</div>
                                                                            <div>
                                                                                <div style={{ color: 'white', fontWeight: 600, fontSize: '0.9rem' }}>{mod.title}</div>
                                                                                <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '0.25rem' }}>{mod.topics} Topics • {mod.duration}</div>
                                                                            </div>
                                                                        </div>
                                                                    )) : <div style={{ color: '#64748b' }}>No curriculum modules defined.</div>}
                                                                </motion.div>
                                                            )}

                                                            {expandedTab === 'batches' && (
                                                                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                                                                    <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'flex-end' }}>
                                                                        <button className={styles.btnPrimary} style={{ padding: '0.5rem 1rem', fontSize: '0.8rem' }} onClick={() => handleOpenBatch(course.id)}>
                                                                            <Plus size={14} /> Create New Batch
                                                                        </button>
                                                                    </div>
                                                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
                                                                        {course.batches.length > 0 ? course.batches.map(batch => (
                                                                            <div key={batch.id} onClick={() => handleOpenBatch(course.id, batch)} style={{
                                                                                background: 'rgba(30, 41, 59, 0.4)', padding: '1.25rem', borderRadius: '0.75rem',
                                                                                border: '1px solid rgba(51, 65, 85, 0.5)', cursor: 'pointer', transition: 'all 0.2s',
                                                                                position: 'relative', overflow: 'hidden'
                                                                            }} className={styles.hoverScale}>
                                                                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                                                                    <div>
                                                                                        <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'white' }}>{batch.name}</div>
                                                                                        <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{batch.id}</div>
                                                                                    </div>
                                                                                    <div style={{ padding: '0.25rem 0.75rem', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', borderRadius: '999px', fontSize: '0.75rem', height: 'fit-content' }}>Active</div>
                                                                                </div>
                                                                                <div style={{ display: 'flex', gap: '1rem', fontSize: '0.85rem', color: '#cbd5e1', marginBottom: '1rem' }}>
                                                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Calendar size={14} /> {batch.startDate}</div>
                                                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Clock size={14} /> {batch.time}</div>
                                                                                </div>
                                                                                <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1rem', display: 'flex', justifyContent: 'space-between' }}>
                                                                                    <div style={{ display: 'flex', gap: '-0.5rem' }}>{batch.tutors.length} Tutors</div>
                                                                                    <div style={{ color: '#a78bfa' }}>{batch.students.length} Students</div>
                                                                                </div>
                                                                            </div>
                                                                        )) : <div style={{ color: '#64748b' }}>No active batches for this course.</div>}
                                                                    </div>
                                                                </motion.div>
                                                            )}
                                                        </div>
                                                    </td>
                                                </motion.tr>
                                            )}
                                        </AnimatePresence>
                                    </Fragment>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Batch Management Modal (Enhanced with Folder System and Access Control) */}
                <AnimatePresence>
                    {isBatchOpen && currentBatch && (
                        <div className={styles.modalOverlay}>
                            <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 50 }} className={`${styles.modalContent} ${styles.modalContentLarge}`} style={{ maxHeight: '95vh', overflowY: 'auto', maxWidth: '1000px' }}>
                                <div className={styles.modalHeader} style={{ background: 'rgba(30, 41, 59, 0.95)', position: 'sticky', top: 0, zIndex: 10 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                                        <div>
                                            <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>BATCH MANAGEMENT</div>
                                            <h2 className={styles.modalTitle} style={{ fontSize: '1.4rem' }}>{currentBatch.name || 'New Batch Configuration'}</h2>
                                        </div>
                                        <button onClick={() => setIsBatchOpen(false)} className={styles.closeBtn}>✕</button>
                                    </div>

                                    {/* Advanced Tabs */}
                                    <div style={{
                                        display: 'flex',
                                        padding: '0.35rem',
                                        background: 'rgba(15, 23, 42, 0.6)',
                                        borderRadius: '12px',
                                        border: '1px solid rgba(51, 65, 85, 0.5)',
                                        width: 'fit-content',
                                        marginTop: '1.5rem',
                                        gap: '0.25rem'
                                    }}>
                                        {[
                                            { id: 'content', label: 'Resources & Content', icon: Upload },
                                            { id: 'people', label: 'Students & Progress', icon: Users },
                                            { id: 'tutors', label: 'Tutors & Access', icon: CheckCircle }
                                        ].map(tab => (
                                            <button
                                                key={tab.id}
                                                type="button"
                                                onClick={() => setBatchTab(tab.id as any)}
                                                style={{
                                                    position: 'relative',
                                                    padding: '0.6rem 1.2rem',
                                                    borderRadius: '8px',
                                                    border: 'none',
                                                    background: 'transparent',
                                                    color: batchTab === tab.id ? '#ffffff' : '#94a3b8',
                                                    fontWeight: batchTab === tab.id ? 600 : 500,
                                                    fontSize: '0.85rem',
                                                    cursor: 'pointer',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '0.6rem',
                                                    zIndex: 1,
                                                    transition: 'color 0.2s ease',
                                                    outline: 'none'
                                                }}
                                            >
                                                {batchTab === tab.id && (
                                                    <motion.div
                                                        layoutId="activeTabBatch"
                                                        style={{
                                                            position: 'absolute',
                                                            inset: 0,
                                                            background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.8) 0%, rgba(139, 92, 246, 0.8) 100%)',
                                                            borderRadius: '8px',
                                                            zIndex: -1,
                                                            boxShadow: '0 4px 15px rgba(124, 58, 237, 0.35), inset 0 1px 1px rgba(255, 255, 255, 0.2)'
                                                        }}
                                                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                                    />
                                                )}
                                                <tab.icon size={15} style={{ opacity: batchTab === tab.id ? 1 : 0.7 }} />
                                                {tab.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <form onSubmit={handleSaveBatch}>
                                    <div className={styles.modalBody} style={{ minHeight: '400px' }}>
                                        {/* Configuration Section */}
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '2rem', background: 'rgba(15, 23, 42, 0.3)', padding: '1rem', borderRadius: '0.5rem' }}>
                                            <div className={styles.formGroup}><label className={styles.formLabel}>Batch Name</label><input className={styles.formInput} value={currentBatch.name} onChange={e => setCurrentBatch({ ...currentBatch, name: e.target.value })} placeholder="e.g. Java Weekend B1" required /></div>
                                            <div className={styles.formGroup}><label className={styles.formLabel}>Start Date</label><input type="date" className={styles.formInput} value={currentBatch.startDate} onChange={e => setCurrentBatch({ ...currentBatch, startDate: e.target.value })} /></div>
                                            <div className={styles.formGroup}><label className={styles.formLabel}>Timing</label><input className={styles.formInput} value={currentBatch.time} onChange={e => setCurrentBatch({ ...currentBatch, time: e.target.value })} placeholder="e.g. 10:00 AM" /></div>
                                        </div>

                                        {/* Content Tab (FileSystem & Uploads) */}
                                        {batchTab === 'content' && (
                                            <div className={styles.fadeIn}>
                                                {/* Navigation Bar */}
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', color: '#94a3b8' }}>
                                                        {getBreadcrumbs().map((crumb, index) => (
                                                            <div key={index} style={{ display: 'flex', alignItems: 'center' }}>
                                                                <span
                                                                    onClick={() => handleNavigateFolder(crumb.id as string | null)}
                                                                    style={{ cursor: 'pointer', fontWeight: index === getBreadcrumbs().length - 1 ? 700 : 400, color: index === getBreadcrumbs().length - 1 ? 'white' : 'inherit' }}
                                                                >
                                                                    {crumb.title}
                                                                </span>
                                                                {index < getBreadcrumbs().length - 1 && <ChevronRight size={14} style={{ margin: '0 0.25rem' }} />}
                                                            </div>
                                                        ))}
                                                    </div>
                                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                        {currentFolderId && (
                                                            <button type="button" onClick={() => {
                                                                const curr = currentBatch.resources.find(r => r.id === currentFolderId);
                                                                handleNavigateFolder(curr?.parentId || null);
                                                            }} className={styles.btnSecondary} style={{ padding: '0.5rem' }}>
                                                                <CornerUpLeft size={16} /> Up
                                                            </button>
                                                        )}
                                                        <button type="button" className={styles.btnSecondary} onClick={handleCreateFolder}>
                                                            <Plus size={16} style={{ marginRight: '0.25rem' }} /> New Folder
                                                        </button>
                                                    </div>
                                                </div>

                                                <div
                                                    onDragOver={(e) => { e.preventDefault(); e.currentTarget.style.borderColor = '#a78bfa'; e.currentTarget.style.background = 'rgba(139, 92, 246, 0.1)'; }}
                                                    onDragLeave={(e) => { e.preventDefault(); e.currentTarget.style.borderColor = 'rgba(51, 65, 85, 0.5)'; e.currentTarget.style.background = 'transparent'; }}
                                                    onDrop={handleDrop}
                                                    style={{
                                                        border: '2px dashed rgba(51, 65, 85, 0.5)', borderRadius: '1rem', padding: '2rem',
                                                        textAlign: 'center', marginBottom: '1.5rem', transition: 'all 0.2s', cursor: 'pointer', position: 'relative'
                                                    }}
                                                >
                                                    <input
                                                        type="file" multiple
                                                        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }}
                                                        onChange={(e) => {
                                                            if (e.target.files && currentBatch) {
                                                                const newResources: BatchResource[] = Array.from(e.target.files).map((f, i) => ({
                                                                    id: `R-UP-${Date.now()}-${i}`,
                                                                    title: f.name,
                                                                    type: f.type.includes('video') ? 'Video' : 'File',
                                                                    url: '#',
                                                                    date: new Date().toISOString().split('T')[0],
                                                                    uploadedBy: 'Admin (Manual)',
                                                                    parentId: currentFolderId || null,
                                                                    accessList: []
                                                                }));
                                                                setCurrentBatch({ ...currentBatch, resources: [...currentBatch.resources, ...newResources] });
                                                            }
                                                        }}
                                                    />
                                                    <Upload size={32} color="#a78bfa" style={{ marginBottom: '0.5rem', opacity: 0.8 }} />
                                                    <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Drag files or click to upload to <b>{currentFolderId ? 'this folder' : 'root'}</b></p>
                                                </div>

                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                                    {getCurrentResources().length > 0 ? getCurrentResources().map((res, idx) => {
                                                        const colors = getResourceColor(res.type);
                                                        return (
                                                            <div
                                                                key={res.id}
                                                                onClick={() => res.type === 'Folder' && handleNavigateFolder(res.id)}
                                                                style={{
                                                                    display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.75rem',
                                                                    background: 'rgba(30, 41, 59, 0.5)', borderRadius: '0.5rem', border: '1px solid rgba(51, 65, 85, 0.5)',
                                                                    cursor: res.type === 'Folder' ? 'pointer' : 'default'
                                                                }}
                                                            >
                                                                <div style={{ padding: '0.5rem', background: colors.bg, borderRadius: '0.3rem', color: colors.text }}>
                                                                    {getResourceIcon(res.type)}
                                                                </div>
                                                                <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 0.5fr', gap: '1rem', alignItems: 'center' }}>
                                                                    {res.type === 'Folder' ? (
                                                                        <input className={styles.searchInput} value={res.title} onClick={e => e.stopPropagation()} onChange={(e) => {
                                                                            const allRes = [...currentBatch.resources];
                                                                            const target = allRes.find(r => r.id === res.id);
                                                                            if (target) target.title = e.target.value;
                                                                            setCurrentBatch(prev => prev ? { ...prev, resources: allRes } : null);
                                                                        }} style={{ padding: '0.25rem', fontSize: '0.9rem', fontWeight: 600, color: 'white' }} />
                                                                    ) : (
                                                                        <input className={styles.searchInput} value={res.title} onClick={e => e.stopPropagation()} onChange={(e) => {
                                                                            const allRes = [...currentBatch.resources];
                                                                            const target = allRes.find(r => r.id === res.id);
                                                                            if (target) target.title = e.target.value;
                                                                            setCurrentBatch(prev => prev ? { ...prev, resources: allRes } : null);
                                                                        }} style={{ padding: '0.25rem', fontSize: '0.9rem' }} />
                                                                    )}

                                                                    <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>{res.uploadedBy}</div>
                                                                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{res.date}</div>
                                                                    <button type="button" onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        setResourceAccessModal({ isOpen: true, resourceId: res.id });
                                                                    }} className={styles.btnSecondary} style={{ color: res.accessList?.length ? '#fbbf24' : '#94a3b8' }} title="Manage Access">
                                                                        {res.accessList?.length ? <Lock size={16} /> : <Unlock size={16} />}
                                                                    </button>

                                                                </div>
                                                                <button type="button" onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    const allRes = currentBatch.resources.filter(r => r.id !== res.id);
                                                                    setCurrentBatch(prev => prev ? { ...prev, resources: allRes } : null);
                                                                }} className={styles.btnSecondary} style={{ color: '#ef4444' }}><Trash2 size={16} /></button>
                                                            </div>
                                                        );
                                                    }) : <div style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>This folder is empty.</div>}
                                                </div>
                                            </div>
                                        )}

                                        {/* Students Tab */}
                                        {batchTab === 'people' && (
                                            <div className={styles.fadeIn}>
                                                <div style={{ marginBottom: '1rem', display: 'flex', gap: '1rem' }}>
                                                    <input
                                                        className={styles.searchInput}
                                                        placeholder="Add student by name..."
                                                        value={newStudentInput}
                                                        onChange={(e) => setNewStudentInput(e.target.value)}
                                                        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddStudent())}
                                                    />
                                                    <button type="button" onClick={handleAddStudent} className={styles.btnPrimary} style={{ width: 'auto', whiteSpace: 'nowrap' }}>
                                                        <Plus size={16} style={{ marginRight: '0.5rem' }} /> Add Student
                                                    </button>
                                                </div>
                                                <div style={{ overflowX: 'auto' }}>
                                                    <table className={styles.table} style={{ fontSize: '0.9rem' }}>
                                                        <thead>
                                                            <tr>
                                                                <th>Student Name</th>
                                                                <th>Email</th>
                                                                <th>Access Status</th>
                                                                <th>Progress</th>
                                                                <th>Last Active</th>
                                                                <th>Actions</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {currentBatch.students.map((student, idx) => (
                                                                <tr key={student.id}>
                                                                    <td onClick={() => handleViewStudentHistory(student)} style={{ cursor: 'pointer' }}>
                                                                        <span style={{ color: 'white', fontWeight: 500, textDecoration: 'underline', textDecorationColor: 'rgba(255,255,255,0.3)', textUnderlineOffset: '4px' }}>{student.name}</span>
                                                                    </td>
                                                                    <td>{student.email}</td>
                                                                    <td>
                                                                        <button type="button" onClick={() => {
                                                                            const newStudents = [...currentBatch.students];
                                                                            newStudents[idx].status = student.status === 'Granted' ? 'Revoked' : 'Granted';
                                                                            setCurrentBatch({ ...currentBatch, students: newStudents });
                                                                        }} style={{
                                                                            padding: '2px 8px', borderRadius: '4px', border: 'none', cursor: 'pointer',
                                                                            background: student.status === 'Granted' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                                                                            color: student.status === 'Granted' ? '#34d399' : '#f87171', fontWeight: 600
                                                                        }}>
                                                                            {student.status}
                                                                        </button>
                                                                    </td>
                                                                    <td>
                                                                        <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', overflow: 'hidden' }}>
                                                                            <div style={{ width: `${student.progress}%`, height: '100%', background: '#a78bfa' }}></div>
                                                                        </div>
                                                                    </td>
                                                                    <td style={{ color: '#94a3b8' }}>{student.lastActive}</td>
                                                                    <td>
                                                                        <button type="button" onClick={() => handleViewStudentHistory(student)} className={styles.btnSecondary} style={{ padding: '4px 8px', fontSize: '0.75rem' }}>
                                                                            View History
                                                                        </button>
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        )}

                                        {/* Tutors Tab */}
                                        {batchTab === 'tutors' && (
                                            <div className={styles.fadeIn}>
                                                <div style={{ marginBottom: '1rem', display: 'flex', gap: '1rem' }}>
                                                    <input
                                                        className={styles.searchInput}
                                                        placeholder="Add tutor by name..."
                                                        value={newTutorInput}
                                                        onChange={(e) => setNewTutorInput(e.target.value)}
                                                        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTutor())}
                                                    />
                                                    <button type="button" onClick={handleAddTutor} className={styles.btnPrimary} style={{ width: 'auto', whiteSpace: 'nowrap' }}>
                                                        <Plus size={16} style={{ marginRight: '0.5rem' }} /> Add Tutor
                                                    </button>
                                                </div>
                                                <table className={styles.table}>
                                                    <thead><tr><th>Tutor Name</th><th>Email</th><th>Access Status</th><th>Actions</th></tr></thead>
                                                    <tbody>
                                                        {currentBatch.tutors.map((tutor, idx) => (
                                                            <tr key={tutor.id}>
                                                                <td style={{ color: 'white' }}>{tutor.name}</td>
                                                                <td>{tutor.email}</td>
                                                                <td>
                                                                    <button type="button" onClick={() => {
                                                                        const newTutors = [...currentBatch.tutors];
                                                                        newTutors[idx].status = tutor.status === 'Granted' ? 'Revoked' : 'Granted';
                                                                        setCurrentBatch({ ...currentBatch, tutors: newTutors });
                                                                    }} style={{
                                                                        padding: '2px 8px', borderRadius: '4px', border: 'none', cursor: 'pointer',
                                                                        background: tutor.status === 'Granted' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                                                                        color: tutor.status === 'Granted' ? '#34d399' : '#f87171', fontWeight: 600
                                                                    }}>
                                                                        {tutor.status}
                                                                    </button>
                                                                </td>
                                                                <td><button type="button" className={styles.btnSecondary} style={{ color: '#ef4444' }}><Trash2 size={14} /></button></td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        )}
                                    </div>
                                    <div className={styles.formActions} style={{ padding: '1.5rem', borderTop: '1px solid rgba(51, 65, 85, 0.5)' }}>
                                        <button type="button" onClick={() => setIsBatchOpen(false)} className={styles.btnSecondary} style={{ flex: 1, justifyContent: 'center' }}>Discard Changes</button>
                                        <button type="submit" className={styles.btnPrimary} style={{ flex: 1, justifyContent: 'center' }}>Save Batch Configuration</button>
                                    </div>
                                </form>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>

                {/* Resource Access Control Modal */}
                <AnimatePresence>
                    {resourceAccessModal.isOpen && resourceAccessModal.resourceId && currentBatch && (
                        <div className={styles.modalOverlay} style={{ zIndex: 70 }}>
                            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className={styles.modalContent} style={{ maxWidth: '500px' }}>
                                <div className={styles.modalHeader}>
                                    <h2 className={styles.modalTitle} style={{ fontSize: '1.1rem' }}>
                                        Manage Access: {currentBatch.resources.find(r => r.id === resourceAccessModal.resourceId)?.title}
                                    </h2>
                                    <button onClick={() => setResourceAccessModal({ isOpen: false, resourceId: null })} className={styles.closeBtn}>✕</button>
                                </div>
                                <div className={styles.modalBody}>
                                    <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1rem' }}>
                                        Select students who can view this resource. Deselecting all grants access to everyone.
                                    </p>
                                    <div style={{ maxHeight: '300px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                        {currentBatch.students.map(student => {
                                            const resource = currentBatch.resources.find(r => r.id === resourceAccessModal.resourceId);
                                            const hasAccess = resource?.accessList?.includes(student.id);
                                            return (
                                                <div key={student.id}
                                                    onClick={() => toggleResourceAccess(resourceAccessModal.resourceId!, student.id)}
                                                    style={{
                                                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                                        padding: '0.75rem', borderRadius: '0.5rem',
                                                        background: hasAccess ? 'rgba(16, 185, 129, 0.1)' : 'rgba(30, 41, 59, 0.5)',
                                                        border: hasAccess ? '1px solid #34d399' : '1px solid transparent',
                                                        cursor: 'pointer'
                                                    }}
                                                >
                                                    <span style={{ color: 'white' }}>{student.name}</span>
                                                    {hasAccess ? <CheckCircle size={16} color="#34d399" /> : <div style={{ width: 16, height: 16, border: '1px solid #64748b', borderRadius: '50%' }}></div>}
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>

                {/* Student Profile Side Drawer (Advanced) */}
                <AnimatePresence>
                    {selectedStudent && (
                        <>
                            {/* Backdrop */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setSelectedStudent(null)}
                                style={{
                                    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', zIndex: 60
                                }}
                            />

                            {/* Drawer */}
                            <motion.div
                                initial={{ x: '100%', opacity: 0.5 }}
                                animate={{ x: 0, opacity: 1 }}
                                exit={{ x: '100%', opacity: 0 }}
                                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                                style={{
                                    position: 'fixed',
                                    top: 0,
                                    right: 0,
                                    height: '100vh',
                                    width: '480px',
                                    background: 'rgba(15, 23, 42, 0.95)',
                                    borderLeft: '1px solid rgba(124, 58, 237, 0.2)',
                                    boxShadow: '-10px 0 40px rgba(0,0,0,0.5)',
                                    zIndex: 70,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    overflow: 'hidden'
                                }}
                            >
                                {/* Drawer Header */}
                                <div style={{
                                    padding: '2rem',
                                    background: 'linear-gradient(180deg, rgba(30, 41, 59, 1) 0%, rgba(15, 23, 42, 0) 100%)',
                                    borderBottom: '1px solid rgba(51, 65, 85, 0.5)',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    position: 'relative'
                                }}>
                                    <button
                                        onClick={() => setSelectedStudent(null)}
                                        style={{
                                            position: 'absolute', top: '1.5rem', right: '1.5rem',
                                            background: 'rgba(51, 65, 85, 0.5)', border: 'none', borderRadius: '50%',
                                            width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            color: '#cbd5e1', cursor: 'pointer', transition: 'all 0.2s'
                                        }}
                                        onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)'}
                                        onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(51, 65, 85, 0.5)'}
                                    >
                                        <XCircle size={18} />
                                    </button>

                                    <div style={{
                                        width: '96px', height: '96px', borderRadius: '50%',
                                        background: 'linear-gradient(135deg, #7c3aed, #ec4899)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontSize: '2.5rem', fontWeight: 700, color: 'white',
                                        marginBottom: '1rem', boxShadow: '0 8px 32px rgba(124, 58, 237, 0.3)'
                                    }}>
                                        {selectedStudent.name.charAt(0)}
                                    </div>
                                    <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'white', marginBottom: '0.25rem' }}>{selectedStudent.name}</h2>
                                    <div style={{ fontSize: '0.9rem', color: '#94a3b8' }}>{selectedStudent.email}</div>
                                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                                        <span style={{ padding: '0.25rem 0.75rem', background: 'rgba(124, 58, 237, 0.15)', color: '#a78bfa', borderRadius: '999px', fontSize: '0.75rem', border: '1px solid rgba(124, 58, 237, 0.3)' }}>
                                            Student ID: {selectedStudent.id}
                                        </span>
                                        <span style={{ padding: '0.25rem 0.75rem', background: selectedStudent.status === 'Granted' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)', color: selectedStudent.status === 'Granted' ? '#34d399' : '#f87171', borderRadius: '999px', fontSize: '0.75rem', border: `1px solid ${selectedStudent.status === 'Granted' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}` }}>
                                            {selectedStudent.status}
                                        </span>
                                    </div>
                                </div>

                                {/* Drawer Content (Scrollable) */}
                                <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem' }}>

                                    {/* Stats Grid */}
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
                                        <div style={{ background: 'rgba(30, 41, 59, 0.4)', padding: '1rem', borderRadius: '0.75rem', border: '1px solid rgba(51, 65, 85, 0.5)' }}>
                                            <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Clock size={14} /> Last Active</div>
                                            <div style={{ fontSize: '1rem', fontWeight: 600, color: 'white' }}>{selectedStudent.lastActive}</div>
                                        </div>
                                        <div style={{ background: 'rgba(30, 41, 59, 0.4)', padding: '1rem', borderRadius: '0.75rem', border: '1px solid rgba(51, 65, 85, 0.5)' }}>
                                            <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><CheckCircle size={14} /> Course Progress</div>
                                            <div style={{ fontSize: '1rem', fontWeight: 600, color: '#a78bfa' }}>{selectedStudent.progress}% Completed</div>
                                            <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.1)', marginTop: '0.5rem', borderRadius: '2px' }}>
                                                <div style={{ width: `${selectedStudent.progress}%`, height: '100%', background: '#a78bfa', borderRadius: '2px' }} />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Activity Timeline */}
                                    <div style={{ marginBottom: '1rem' }}>
                                        <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'white', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <div style={{ width: '4px', height: '16px', background: '#38bdf8', borderRadius: '2px' }} />
                                            Recent Activity
                                        </h3>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                            {studentActivity.map((log, index) => (
                                                <div key={log.id} style={{
                                                    display: 'flex', gap: '1rem', position: 'relative', paddingBottom: index === studentActivity.length - 1 ? 0 : '1rem'
                                                }}>
                                                    {/* Timeline Line */}
                                                    {index !== studentActivity.length - 1 && (
                                                        <div style={{ position: 'absolute', left: '15px', top: '30px', bottom: 0, width: '2px', background: 'rgba(51, 65, 85, 0.5)' }} />
                                                    )}

                                                    <div style={{
                                                        width: '32px', height: '32px', borderRadius: '50%', flexShrink: 0,
                                                        background: log.action === 'Opened' ? 'rgba(59, 130, 246, 0.2)' : log.action === 'Completed' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(251, 191, 36, 0.2)',
                                                        color: log.action === 'Opened' ? '#60a5fa' : log.action === 'Completed' ? '#34d399' : '#fbbf24',
                                                        display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid rgba(15, 23, 42, 1)'
                                                    }}>
                                                        {log.action === 'Opened' ? <Eye size={14} /> : log.action === 'Completed' ? <CheckCircle size={14} /> : <Download size={14} />}
                                                    </div>

                                                    <div style={{ flex: 1, background: 'rgba(30, 41, 59, 0.3)', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid rgba(51, 65, 85, 0.3)' }}>
                                                        <div style={{ fontSize: '0.9rem', color: 'white', marginBottom: '0.25rem' }}>
                                                            {log.action === 'Opened' ? 'Viewed' : log.action} <span style={{ fontWeight: 600, color: '#e2e8f0' }}>{log.resourceName}</span>
                                                        </div>
                                                        <div style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'flex', justifyContent: 'space-between' }}>
                                                            <span>{log.timestamp}</span>
                                                            {log.duration && <span>{log.duration}</span>}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>

            </motion.div>
        </DashboardLayout>
    );
}
