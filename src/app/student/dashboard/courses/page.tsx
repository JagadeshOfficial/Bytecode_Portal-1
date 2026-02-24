"use client";

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { motion, AnimatePresence } from 'framer-motion';
import {
    BookOpen, Play, Video, Download, Eye, Search, ChevronRight,
    Lock, CheckCircle2, Clock, Star, Layers, FileText, Award,
    Filter, PlayCircle
} from 'lucide-react';
import api from '@/lib/api';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useUserId } from '@/lib/useUserId';

interface Course {
    id: string;
    title: string;
    description: string;
    category: string;
    level: string;
    duration: number;
    totalModules: number;
    thumbnail?: string;
    instructor?: string;
    rating?: number;
}

interface Batch {
    id: string;
    batchName: string;
    courseId: string;
    courseName: string;
    studentIds?: string[];
}

interface LearningMaterial {
    id: string;
    title: string;
    type: string;
    courseId: string;
    url: string;
    uploadedAt: string;
}

const LEVEL_COLOR: Record<string, string> = {
    BEGINNER: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
    INTERMEDIATE: 'text-amber-400 bg-amber-400/10 border-amber-400/20',
    ADVANCED: 'text-red-400 bg-red-400/10 border-red-400/20',
};

const CATEGORY_EMOJI: Record<string, string> = {
    'Web Development': '🌐',
    'Machine Learning': '🤖',
    'Data Science': '📊',
    'Mobile': '📱',
    'DevOps': '⚙️',
    'Python': '🐍',
    'Java': '☕',
};

const tabs = [
    { id: 'enrolled', label: 'MY COURSES', icon: BookOpen },
    { id: 'materials', label: 'STUDY MATERIAL', icon: FileText },
    { id: 'explore', label: 'EXPLORE', icon: Star },
];

export default function StudentCoursesPage() {
    const [activeTab, setActiveTab] = useState('enrolled');
    const [enrolledCourses, setEnrolledCourses] = useState<Course[]>([]);
    const [allCourses, setAllCourses] = useState<Course[]>([]); // for Explore tab
    const [materials, setMaterials] = useState<LearningMaterial[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const { user } = useAuth();
    const userId = useUserId();

    useEffect(() => {
        const fetchData = async () => {
            if (!userId) return;
            try {
                const [batchRes, allCoursesRes, mRes] = await Promise.all([
                    // Get only batches this student is enrolled in
                    api.get(`/academic/batches/student/${encodeURIComponent(userId)}`),
                    api.get('/courses'),
                    api.get('/courses/materials').catch(() => ({ data: [] })),
                ]);

                const myBatches: Batch[] = batchRes.data || [];
                const allCoursesList: Course[] = allCoursesRes.data || [];
                setAllCourses(allCoursesList);
                setMaterials(mRes.data || []);

                // Derive enrolled courses from batch courseIds
                const enrolledCourseIds = new Set(myBatches.map(b => b.courseId).filter(Boolean));
                const enrolled = allCoursesList.filter(c => enrolledCourseIds.has(c.id));
                setEnrolledCourses(enrolled);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [userId]);

    const courses = enrolledCourses; // alias for stats/filter
    const filtered = courses.filter(c =>
        c.title?.toLowerCase().includes(search.toLowerCase()) ||
        c.category?.toLowerCase().includes(search.toLowerCase())
    );

    const stats = [
        { label: 'Enrolled Courses', value: courses.length, color: 'from-violet-600/20 to-transparent', accent: 'text-violet-400', icon: BookOpen },
        { label: 'Study Materials', value: materials.length, color: 'from-cyan-600/20 to-transparent', accent: 'text-cyan-400', icon: FileText },
        { label: 'Completed', value: Math.floor(courses.length * 0.3), color: 'from-emerald-600/20 to-transparent', accent: 'text-emerald-400', icon: CheckCircle2 },
        { label: 'Avg. Progress', value: '74%', color: 'from-amber-600/20 to-transparent', accent: 'text-amber-400', icon: Award },
    ];

    return (
        <DashboardLayout role="student">
            <div className="flex flex-col gap-8 pb-10">
                {/* Header */}
                <div>
                    <h1 className="text-4xl font-[Rajdhani] font-bold text-white tracking-widest uppercase">
                        My <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-400">Learning Hub</span>
                    </h1>
                    <p className="text-slate-400 font-medium mt-1">Your enrolled courses, study materials, and learning progress — all in one place.</p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {stats.map((s, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.08 }}
                            className={`bg-gradient-to-br ${s.color} border border-white/5 rounded-2xl p-5 flex items-center gap-4 hover:border-white/10 transition-all`}
                        >
                            <div className={`p-3 rounded-xl bg-black/20 ${s.accent}`}>
                                <s.icon size={20} />
                            </div>
                            <div>
                                <div className={`text-2xl font-black ${s.accent} font-[Rajdhani]`}>{loading ? '—' : s.value}</div>
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
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-[10px] font-black tracking-widest transition-all ${activeTab === tab.id
                                ? 'bg-gradient-to-r from-violet-600 to-violet-700 text-white shadow-lg shadow-violet-500/20'
                                : 'text-slate-500 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            <tab.icon size={13} /> {tab.label}
                        </button>
                    ))}
                </div>

                <AnimatePresence mode="wait">
                    {/* My Courses Tab */}
                    {activeTab === 'enrolled' && (
                        <motion.div key="enrolled" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-5">
                            <div className="relative max-w-md">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={15} />
                                <input
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                    placeholder="Search courses..."
                                    className="w-full bg-black/30 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-violet-500 transition-all"
                                />
                            </div>

                            {loading ? (
                                <div className="text-center py-20 text-slate-500">Loading courses...</div>
                            ) : filtered.length === 0 ? (
                                <div className="text-center py-20 text-slate-500">
                                    <BookOpen size={48} className="mx-auto mb-4 opacity-20" />
                                    <p>No courses found.</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                                    {filtered.map((course, i) => {
                                        const progress = 30 + (i * 17) % 60;
                                        const emoji = CATEGORY_EMOJI[course.category] || '📚';
                                        return (
                                            <motion.div
                                                key={course.id}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: i * 0.06 }}
                                                className="bg-[#0a0a1a]/70 border border-white/5 rounded-[1.5rem] p-6 hover:border-violet-500/40 transition-all group relative overflow-hidden"
                                            >
                                                <div className="absolute top-0 right-0 w-32 h-32 bg-violet-600/5 blur-[60px] rounded-full -mr-10 -mt-10 pointer-events-none" />
                                                <div className="flex items-start justify-between mb-4">
                                                    <div className="text-4xl">{emoji}</div>
                                                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase border ${LEVEL_COLOR[course.level] || LEVEL_COLOR['BEGINNER']}`}>
                                                        {course.level || 'BEGINNER'}
                                                    </span>
                                                </div>
                                                <h3 className="text-base font-black text-white uppercase tracking-tight mb-1 group-hover:text-violet-400 transition-colors line-clamp-2">{course.title}</h3>
                                                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">{course.category}</p>
                                                <p className="text-xs text-slate-500 mb-4 line-clamp-2 leading-relaxed">{course.description}</p>

                                                <div className="space-y-2 mb-5">
                                                    <div className="flex justify-between text-[10px] font-bold uppercase text-slate-500">
                                                        <span>Progress</span>
                                                        <span className="text-white">{progress}%</span>
                                                    </div>
                                                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                                                        <motion.div
                                                            initial={{ width: 0 }}
                                                            animate={{ width: `${progress}%` }}
                                                            transition={{ delay: 0.3 + i * 0.06 }}
                                                            className="h-full bg-gradient-to-r from-violet-600 to-cyan-400 rounded-full"
                                                        />
                                                    </div>
                                                </div>

                                                <div className="flex gap-3 text-[10px] font-bold text-slate-500 uppercase mb-5">
                                                    <span className="flex items-center gap-1"><Layers size={10} /> {course.totalModules || 12} Modules</span>
                                                    <span className="flex items-center gap-1"><Clock size={10} /> {course.duration || 40}h</span>
                                                </div>

                                                <button className="w-full flex items-center justify-center gap-2 py-2.5 bg-violet-600/10 hover:bg-violet-600 text-violet-400 hover:text-white border border-violet-500/20 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">
                                                    <Play size={12} fill="currentColor" /> Resume Learning
                                                </button>
                                            </motion.div>
                                        );
                                    })}
                                </div>
                            )}
                        </motion.div>
                    )}

                    {/* Materials Tab */}
                    {activeTab === 'materials' && (
                        <motion.div key="materials" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                                {[
                                    { label: 'Video Lectures', count: materials.filter(m => m.type === 'VIDEO').length || 8, icon: Video, color: 'text-red-400', bg: 'bg-red-400/10' },
                                    { label: 'PDF Notes', count: materials.filter(m => m.type === 'PDF').length || 15, icon: FileText, color: 'text-blue-400', bg: 'bg-blue-400/10' },
                                    { label: 'Lab Exercises', count: 6, icon: Layers, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
                                    { label: 'Projects', count: 3, icon: Award, color: 'text-amber-400', bg: 'bg-amber-400/10' },
                                ].map((cat, i) => (
                                    <div key={i} className={`${cat.bg} border border-white/5 rounded-2xl p-5 flex items-center gap-3 cursor-pointer hover:border-white/20 transition-all`}>
                                        <cat.icon className={cat.color} size={22} />
                                        <div>
                                            <div className="text-lg font-black text-white">{cat.count}</div>
                                            <div className="text-[9px] text-slate-500 font-bold uppercase">{cat.label}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {materials.length === 0 ? (
                                <div className="text-center py-16 text-slate-500">
                                    <FileText size={48} className="mx-auto mb-4 opacity-20" />
                                    <p>No materials available yet. Your trainer will upload them soon.</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {materials.map((mat, i) => (
                                        <div key={mat.id} className="flex items-center gap-4 p-4 bg-black/20 border border-white/5 rounded-xl hover:border-violet-500/30 transition-all group">
                                            <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center text-violet-400 flex-shrink-0">
                                                {mat.type === 'VIDEO' ? <Video size={18} /> : <FileText size={18} />}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="text-sm font-bold text-white truncate group-hover:text-violet-400 transition-colors">{mat.title}</div>
                                                <div className="text-[10px] text-slate-500 font-bold uppercase">{mat.type}</div>
                                            </div>
                                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <a href={mat.url} target="_blank" rel="noopener noreferrer"
                                                    className="p-2 hover:bg-violet-500/20 rounded-lg text-violet-400">
                                                    {mat.type === 'VIDEO' ? <Play size={14} /> : <Eye size={14} />}
                                                </a>
                                                <a href={mat.url} download className="p-2 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white">
                                                    <Download size={14} />
                                                </a>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </motion.div>
                    )}

                    {/* Explore Tab */}
                    {activeTab === 'explore' && (
                        <motion.div key="explore" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-5">
                            <p className="text-sm text-slate-400">Discover more courses available at Bytecode Academy.</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                                {allCourses.slice(0, 6).map((course, i) => {
                                    const emoji = CATEGORY_EMOJI[course.category] || '📚';
                                    return (
                                        <div key={course.id} className="bg-[#0a0a1a]/70 border border-white/5 rounded-[1.5rem] p-6 hover:border-cyan-500/40 transition-all group">
                                            <div className="flex items-start justify-between mb-4">
                                                <div className="text-4xl">{emoji}</div>
                                                <span className="flex items-center gap-1 text-[10px] font-black text-amber-400">
                                                    <Star size={10} fill="currentColor" /> 4.{5 + (i % 5)}
                                                </span>
                                            </div>
                                            <h3 className="text-base font-black text-white uppercase tracking-tight mb-2 group-hover:text-cyan-400 transition-colors line-clamp-2">{course.title}</h3>
                                            <p className="text-xs text-slate-500 mb-4 line-clamp-2">{course.description}</p>
                                            <div className="flex gap-3 text-[10px] font-bold text-slate-500 uppercase mb-4">
                                                <span>{course.level}</span>
                                                <span>•</span>
                                                <span>{course.totalModules || 12} Modules</span>
                                            </div>
                                            <button className="w-full py-2.5 bg-cyan-500/10 hover:bg-cyan-500 text-cyan-400 hover:text-white border border-cyan-500/20 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2">
                                                <PlayCircle size={12} /> Enroll Now
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </DashboardLayout>
    );
}
