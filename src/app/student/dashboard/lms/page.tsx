"use client";

import { useState } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { motion, AnimatePresence } from 'framer-motion';
import {
    BookOpen,
    Layers,
    FileText,
    PlayCircle,
    Download,
    Search,
    ChevronRight,
    Lock,
    Unlock,
    Clock,
    CheckCircle2,
    Calendar,
    Filter,
    ArrowDownToLine,
    ExternalLink,
    Star,
    Grid,
    List,
    X,
    Users
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import { useEffect } from 'react';

const COURSES = [
    {
        id: "C01",
        title: "Full Stack Java & React",
        instructor: "Dr. Alan Smith",
        progress: 68,
        modules: 12,
        completedModules: 8,
        thumbnail: "☕",
        color: "from-violet-600 to-indigo-600"
    },
    {
        id: "C02",
        title: "Cloud Native with AWS",
        instructor: "Prof. Sarah Chen",
        progress: 25,
        modules: 10,
        completedModules: 2,
        thumbnail: "☁️",
        color: "from-cyan-500 to-blue-600"
    },
    {
        id: "C03",
        title: "System Design for Scale",
        instructor: "Mr. Rajesh Kumar",
        progress: 42,
        modules: 8,
        completedModules: 3,
        thumbnail: "🏗️",
        color: "from-fuchsia-600 to-pink-600"
    }
];

const CURRICULUM = [
    {
        id: "M01",
        title: "Module 1: Java Foundations",
        items: [
            { type: "Video", title: "Introduction to JVM", duration: "45m", status: "Completed", url: "https://www.w3schools.com/html/mov_bbb.mp4" },
            { type: "Document", title: "Setup Guide.pdf", size: "2.5 MB", status: "None" },
            { type: "Assignment", title: "Assignment #1: Basic IO", deadline: "Completed", status: "Graded" }
        ]
    },
    {
        id: "M02",
        title: "Module 2: Object Oriented Java",
        items: [
            { type: "Video", title: "Interfaces vs Abstract Classes", duration: "1h 10m", status: "InProgress", url: "https://www.youtube.com/watch?v=kYv9_m7fW6o" },
            { type: "Video", title: "Multithreading Basics", duration: "55m", status: "None", url: "https://www.w3schools.com/html/mov_bbb.mp4" },
            { type: "Assignment", title: "Assignment #2: Library System", deadline: "Feb 15", status: "Pending" }
        ]
    }
];

export default function LMSAccessPage() {
    const { user } = useAuth();
    const [courses, setCourses] = useState<any[]>([]);
    const [selectedCourse, setSelectedCourse] = useState<any>(null);
    const [curriculum, setCurriculum] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState('list');
    const [showVideoModal, setShowVideoModal] = useState(false);
    const [selectedVideo, setSelectedVideo] = useState<any>(null);

    useEffect(() => {
        if (user?.id || user?.email) {
            fetchEnrolledCourses();
        }
    }, [user]);

    const fetchEnrolledCourses = async () => {
        try {
            setLoading(true);
            // In a real microservices env, we fetch batches the student is enrolled in
            const res = await api.get('academic/batches');
            const allBatches = res.data || [];

            // Filter batches where student is enrolled
            const studentBatches = allBatches.filter((b: any) =>
                b.studentIds?.includes(user?.id) || b.studentIds?.includes(user?.email)
            ).map((b: any, index: number) => ({
                id: b.id,
                title: b.batchName,
                courseId: b.courseId,
                instructor: b.trainerName || "Faculty",
                progress: Math.floor(Math.random() * 40) + 30, // Mock progress for now
                modules: 10,
                completedModules: 4,
                thumbnail: ["☕", "☁️", "🏗️", "⚛️", "🐍"][index % 5],
                color: [
                    "from-violet-600 to-indigo-600",
                    "from-cyan-500 to-blue-600",
                    "from-fuchsia-600 to-pink-600",
                    "from-emerald-500 to-teal-600",
                    "from-amber-500 to-orange-600"
                ][index % 5]
            }));

            setCourses(studentBatches);
            if (studentBatches.length > 0) {
                setSelectedCourse(studentBatches[0]);
            }
            setLoading(false);
        } catch (error) {
            console.error("Failed to fetch enrolled courses:", error);
            setLoading(false);
        }
    };

    useEffect(() => {
        if (selectedCourse) {
            fetchCurriculum(selectedCourse.id);
        }
    }, [selectedCourse]);

    const fetchCurriculum = async (batchId: string) => {
        try {
            // Fetch materials for the selected batch
            const res = await api.get(`academic/materials/batch/${batchId}`);
            const materials = res.data || [];

            // Group materials into "Modules" (simulated by folders or just one big module)
            const folders = materials.filter((m: any) => m.type === 'FOLDER');
            const files = materials.filter((m: any) => m.type !== 'FOLDER');

            if (folders.length > 0) {
                const curriculumData = folders.map((f: any) => ({
                    id: f.id,
                    title: f.name,
                    items: files.filter((m: any) => m.folderId === f.id).map((m: any) => ({
                        type: m.type === 'VIDEO' ? 'Video' : m.type === 'PDF' ? 'PDF' : 'Document',
                        title: m.name,
                        duration: m.type === 'VIDEO' ? 'Topic' : (m.size ? `${(m.size / 1024).toFixed(1)} KB` : '1.2 MB'),
                        status: 'None',
                        url: m.url,
                        fileId: m.fileId
                    }))
                }));

                // Add root files as another module if any
                const rootFiles = files.filter((m: any) => !m.folderId);
                if (rootFiles.length > 0) {
                    curriculumData.push({
                        id: 'root',
                        title: 'General Resources',
                        items: rootFiles.map((m: any) => ({
                            type: m.type === 'VIDEO' ? 'Video' : m.type === 'PDF' ? 'PDF' : 'Document',
                            title: m.name,
                            duration: m.type === 'VIDEO' ? 'Topic' : (m.size ? `${(m.size / 1024).toFixed(1)} KB` : '1.2 MB'),
                            status: 'None',
                            url: m.url,
                            fileId: m.fileId
                        }))
                    });
                }
                setCurriculum(curriculumData);
            } else {
                // No folders, just list all files in one "Course Content" module
                setCurriculum([
                    {
                        id: "M01",
                        title: "Course Content",
                        items: files.map((m: any) => ({
                            type: m.type === 'VIDEO' ? 'Video' : m.type === 'PDF' ? 'PDF' : 'Document',
                            title: m.name,
                            duration: m.type === 'VIDEO' ? 'Topic' : (m.size ? `${(m.size / 1024).toFixed(1)} KB` : '1.2 MB'),
                            status: 'None',
                            url: m.url,
                            fileId: m.fileId
                        }))
                    }
                ]);
            }
        } catch (error) {
            console.error("Failed to fetch curriculum:", error);
        }
    };

    return (
        <DashboardLayout role="student">
            <div className="flex flex-col gap-8 pb-10">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                        <h1 className="text-4xl font-display font-bold text-white tracking-tight uppercase">
                            LMS <span className="text-violet-400">Vault</span>
                        </h1>
                        <p className="text-slate-400 font-medium mt-1">Access your comprehensive course library, notes, and practical assignments.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Course Sidebar */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-[#0a0a1a]/60 border border-white/5 rounded-[2rem] p-6 backdrop-blur-xl">
                            <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-6 px-2">My Enrolled Courses</h3>
                            <div className="space-y-3">
                                {loading ? (
                                    <div className="text-slate-500 text-xs p-4">Loading courses...</div>
                                ) : courses.length > 0 ? (
                                    courses.map((course) => (
                                        <button
                                            key={course.id}
                                            onClick={() => setSelectedCourse(course)}
                                            className={`w-full text-left p-4 rounded-2xl border transition-all group relative overflow-hidden ${selectedCourse?.id === course.id
                                                ? 'bg-violet-600/10 border-violet-500/50 shadow-lg shadow-violet-500/5'
                                                : 'bg-white/[0.02] border-white/5 hover:border-white/20'
                                                }`}
                                        >
                                            <div className="flex items-center gap-4 relative z-10">
                                                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${course.color} flex items-center justify-center text-xl shadow-lg group-hover:scale-110 transition-transform`}>
                                                    {course.thumbnail}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="text-sm font-bold text-white group-hover:text-violet-400 transition-colors truncate">{course.title}</div>
                                                    <div className="text-[10px] text-slate-500 font-bold uppercase mt-1">Progress: {course.progress}%</div>
                                                </div>
                                            </div>
                                            {selectedCourse?.id === course.id && (
                                                <div className="absolute top-0 right-0 h-full w-1 bg-violet-600 shadow-[0_0_10px_rgba(124,58,237,0.5)]" />
                                            )}
                                        </button>
                                    ))
                                ) : (
                                    <div className="text-slate-500 text-xs p-4">No enrolled courses found.</div>
                                )}
                            </div>
                        </div>

                        {/* Resource Sidebar - Study Tools */}
                        <div className="bg-gradient-to-br from-[#0a0a1a] to-[#030014] border border-white/5 rounded-[2rem] p-6 backdrop-blur-xl">
                            <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-6 px-2">Quick Reference</h3>
                            <div className="space-y-4">
                                {[
                                    { label: "Course Notes", icon: FileText, color: "text-blue-400" },
                                    { label: "Code Snippets", icon: Layers, color: "text-amber-400" },
                                    { label: "Assignment Portal", icon: CheckCircle2, color: "text-emerald-400" },
                                ].map((tool, i) => (
                                    <button key={i} className="w-full flex items-center justify-between p-4 rounded-2xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.08] transition-all group">
                                        <div className="flex items-center gap-3">
                                            <tool.icon size={18} className={tool.color} />
                                            <span className="text-xs font-bold text-white uppercase tracking-tight">{tool.label}</span>
                                        </div>
                                        <ChevronRight size={14} className="text-slate-600 group-hover:translate-x-1 transition-transform" />
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Content Area */}
                    <div className="lg:col-span-3 flex flex-col gap-6">
                        {/* Course Hero / Current Module Header */}
                        <div className={`bg-gradient-to-r ${selectedCourse?.color || 'from-slate-800 to-slate-900'} rounded-[2.5rem] p-10 relative overflow-hidden group shadow-2xl`}>
                            <div className="absolute inset-0 bg-black/20" />
                            <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 blur-[120px] -mr-32 -mt-32 rounded-full" />

                            <div className="relative z-10">
                                <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-[10px] font-black text-white tracking-[0.2em] uppercase">ACTIVE CURRICULUM</span>
                                <h2 className="text-4xl font-bold text-white mt-4 mb-2 tracking-tight uppercase">{selectedCourse?.title || 'Select a Course'}</h2>
                                <p className="text-white/70 font-medium">{selectedCourse?.instructor || 'Faculty'} • {selectedCourse?.modules || 0} Modules Total</p>

                                <div className="mt-8 flex items-center gap-8">
                                    <div className="flex-1 max-w-xs">
                                        <div className="flex justify-between text-[10px] font-black text-white uppercase tracking-widest mb-2">
                                            <span>Batch Progress</span>
                                            <span>{selectedCourse?.progress || 0}%</span>
                                        </div>
                                        <div className="h-2 w-full bg-white/20 rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${selectedCourse?.progress || 0}%` }}
                                                className="h-full bg-white"
                                            />
                                        </div>
                                    </div>
                                    <button className="px-8 py-4 bg-white text-black font-black text-xs tracking-[0.2em] rounded-2xl hover:scale-105 transition-all shadow-xl uppercase">RESUME LEARNING</button>
                                </div>
                            </div>
                        </div>

                        {/* Filters & Search */}
                        <div className="flex flex-col md:flex-row justify-between items-center gap-4 py-2">
                            <div className="relative w-full md:w-96">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                <input
                                    type="text"
                                    placeholder="Find videos, notes or assignments..."
                                    className="w-full bg-[#0a0a1a]/60 border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-sm text-white focus:outline-none focus:border-violet-500 transition-all font-bold"
                                />
                            </div>
                            <div className="flex gap-4">
                                <button className="p-3 bg-white/5 border border-white/10 rounded-xl text-slate-400 hover:text-white transition-all"><Filter size={20} /></button>
                                <div className="flex bg-[#0a0a1a]/60 border border-white/5 p-1 rounded-xl">
                                    <button onClick={() => setViewMode('grid')} className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-violet-600 text-white' : 'text-slate-500'}`}><Grid size={18} /></button>
                                    <button onClick={() => setViewMode('list')} className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-violet-600 text-white' : 'text-slate-500'}`}><List size={18} /></button>
                                </div>
                            </div>
                        </div>

                        {/* Curriculum Content */}
                        <div className="space-y-8">
                            {curriculum.length > 0 ? curriculum.map((module) => (
                                <div key={module.id} className="bg-[#0a0a1a]/60 border border-white/5 rounded-[2rem] p-8 backdrop-blur-xl relative overflow-hidden">
                                    <div className="absolute top-0 left-0 w-2 h-full bg-violet-600/20" />
                                    <div className="flex justify-between items-center mb-6">
                                        <h3 className="text-xl font-bold text-white uppercase tracking-tight">{module.title}</h3>
                                        <span className="text-[10px] font-black text-slate-500 tracking-widest uppercase">{module.items.length} ITEMS AVAILABLE</span>
                                    </div>

                                    <div className="grid grid-cols-1 gap-4">
                                        {module.items.map((item: any, idx: number) => (
                                            <div
                                                key={idx}
                                                onClick={() => {
                                                    if (item.type === 'Video') {
                                                        setSelectedVideo({
                                                            ...item,
                                                            title: item.title,
                                                            url: item.url,
                                                            fileId: item.fileId,
                                                            mentorName: selectedCourse?.instructor,
                                                            batchName: selectedCourse?.title,
                                                            duration: item.duration,
                                                            date: 'Course Content'
                                                        });
                                                        setShowVideoModal(true);
                                                    }
                                                }}
                                                className="flex items-center justify-between p-5 bg-white/[0.02] border border-white/5 rounded-2xl group hover:border-violet-500/30 hover:bg-white/[0.04] transition-all cursor-pointer"
                                            >
                                                <div className="flex items-center gap-5">
                                                    <div className={`p-3 rounded-xl bg-[#0a0a1a] border border-white/10 ${item.type === 'Video' ? 'text-cyan-400' : item.type === 'Assignment' ? 'text-emerald-400' : 'text-amber-400'
                                                        }`}>
                                                        {item.type === 'Video' ? <PlayCircle size={24} /> : item.type === 'Assignment' ? <CheckCircle2 size={24} /> : <FileText size={24} />}
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-bold text-white group-hover:text-violet-400 transition-colors uppercase tracking-tight">{item.title}</div>
                                                        <div className="text-[10px] text-slate-500 font-bold uppercase mt-1">
                                                            {item.type} • {item.type === 'Video' ? item.duration : item.type === 'Assignment' ? `Deadline: ${item.deadline}` : item.duration}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-4">
                                                    {item.status === 'Completed' && <span className="px-3 py-1 bg-emerald-500/10 text-emerald-500 rounded-full text-[9px] font-black tracking-widest">COMPLETED</span>}
                                                    {item.status === 'Graded' && <span className="px-3 py-1 bg-violet-500/10 text-violet-500 rounded-full text-[9px] font-black tracking-widest">A+ GRADED</span>}
                                                    {item.status === 'InProgress' && <span className="px-3 py-1 bg-amber-500/10 text-amber-500 rounded-full text-[9px] font-black tracking-widest">RESUME</span>}

                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            if (item.url || item.fileId) {
                                                                window.open(item.url || `http://localhost:8080/api/uploads/videos/${item.fileId}`, '_blank');
                                                            }
                                                        }}
                                                        className="p-2.5 bg-white/5 border border-white/10 rounded-xl text-slate-400 hover:text-white hover:bg-violet-600 hover:border-violet-500 transition-all"
                                                    >
                                                        {item.type === 'Video' ? <ArrowDownToLine size={18} /> : <Download size={18} />}
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )) : (
                                <div className="bg-[#0a0a1a]/60 border border-white/5 rounded-[2rem] p-12 text-center">
                                    <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center mx-auto mb-4 border border-white/5">
                                        <BookOpen className="text-slate-500" size={24} />
                                    </div>
                                    <h3 className="text-white font-bold mb-2">No Content Available</h3>
                                    <p className="text-slate-500 text-sm">Learning materials for this batch will appear here once uploaded by the faculty.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

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
                            <div className="absolute top-0 left-0 right-0 p-8 bg-gradient-to-b from-black/80 to-transparent z-40 pointer-events-none text-left">
                                <h3 className="text-2xl font-bold text-white mb-1 uppercase font-[Rajdhani] tracking-tight">{selectedVideo.title}</h3>
                                <div className="flex items-center gap-4 text-slate-300 text-sm">
                                    <span className="flex items-center gap-1.5"><Users size={14} className="text-violet-400" /> {selectedVideo.batchName}</span>
                                    <span className="flex items-center gap-1.5"><Clock size={14} className="text-violet-400" /> {selectedVideo.duration}</span>
                                    <span className="flex items-center gap-1.5"><Calendar size={14} className="text-violet-400" /> {selectedVideo.date}</span>
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
                                        key={selectedVideo.id || selectedVideo.url || selectedVideo.fileId || 'fallback-key'}
                                        src={
                                            selectedVideo.url && selectedVideo.url.startsWith('http') ? selectedVideo.url :
                                                selectedVideo.fileId ? `http://localhost:8080/api/uploads/videos/${selectedVideo.fileId}` :
                                                    selectedVideo.url || "https://www.w3schools.com/html/mov_bbb.mp4"
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
                                            if (!video.src.includes('mov_bbb.mp4')) {
                                                video.src = 'https://www.w3schools.com/html/mov_bbb.mp4';
                                            }
                                        }}
                                    />
                                )}
                            </div>

                            {/* Bottom Controls Legend */}
                            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent z-40 opacity-0 group-hover:opacity-100 transition-opacity">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Bytecode Archive Player v1.0 • {selectedVideo.mentorName || 'System Archive'}</p>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </DashboardLayout>
    );
}
