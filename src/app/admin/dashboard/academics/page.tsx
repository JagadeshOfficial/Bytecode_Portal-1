"use client";

import { useState } from 'react';
import AdvancedModuleLayout from '@/components/dashboard/AdvancedModuleLayout';
import { motion, AnimatePresence } from 'framer-motion';
import {
    BookOpen,
    Layers,
    Calendar,
    Users,
    UserCheck,
    Plus,
    Clock,
    Search,
    ChevronRight,
    Settings,
    MoreVertical,
    Save,
    Trash2,
    CalendarDays,
    FileText,
    PlayCircle,
    Download,
    Upload,
    PenTool,
    GraduationCap,
    Grid,
    List,
    List,
    Filter,
    AlertCircle
} from 'lucide-react';
import api from '@/lib/api';
import { useEffect } from 'react';

export default function AcademicManagementPage() {
    const [activeTab, setActiveTab] = useState('batches');
    const [loading, setLoading] = useState(true);
    const [batches, setBatches] = useState<any[]>([]);
    const [courses, setCourses] = useState<any[]>([]);
    const [materials, setMaterials] = useState<any[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [batchesRes, coursesRes, materialsRes] = await Promise.all([
                    api.get('academic/batches'),
                    api.get('courses'),
                    api.get('academic/materials')
                ]);
                setBatches(batchesRes.data || []);
                setCourses(coursesRes.data || []);
                setMaterials(materialsRes.data || []);
            } catch (error) {
                console.error("Failed to fetch academic data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const stats = [
        { label: "Active Courses", value: courses.length.toString(), icon: Layers, color: "#7c3aed", trend: "Live" },
        { label: "Total Batches", value: batches.length.toString(), icon: BookOpen, color: "#22d3ee", trend: "Syncing" },
        { label: "LMS Assets", value: materials.length.toString(), icon: FileText, color: "#10b981", trend: "Cloud" },
        { label: "Classes Today", value: "14", icon: CalendarDays, color: "#f59e0b" },
    ];

    return (
        <AdvancedModuleLayout
            title="Academic Operations & Schedules"
            subtitle="Manage institutional schedules, faculty assignments, and batch progress."
            stats={stats}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            role="admin"
            tabs={[
                { id: 'batches', label: 'Batch Management', icon: BookOpen },
                { id: 'courses', label: 'Course Catalog', icon: Layers },
                { id: 'lms', label: 'LMS Assets', icon: FileText },
                { id: 'scheduling', label: 'Class Schedules', icon: CalendarDays },
                { id: 'faculty', label: 'Faculty Assignment', icon: UserCheck },
            ]}
        >
            <AnimatePresence mode="wait">
                {activeTab === 'batches' && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="space-y-6"
                    >
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div className="relative w-full md:w-96">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                                <input type="text" placeholder="Filter batches..." className="w-full bg-[#0a0a1a]/60 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-violet-500 transition-colors" />
                            </div>
                            <button className="w-full md:w-auto px-6 py-3 bg-violet-600 hover:bg-violet-700 text-white font-bold rounded-2xl shadow-lg shadow-violet-500/20 flex items-center justify-center gap-2 transition-all">
                                <Plus size={18} /> CREATE NEW BATCH
                            </button>
                        </div>

                        <div className="grid grid-cols-1 gap-4">
                            {loading ? (
                                <div className="p-12 flex flex-col items-center gap-4 text-slate-500">
                                    <div className="w-10 h-10 border-4 border-violet-500 border-t-transparent rounded-full animate-spin" />
                                    <p className="font-bold text-xs uppercase tracking-widest">Loading Batches...</p>
                                </div>
                            ) : batches.map((batch, i) => (
                                <motion.div
                                    key={batch.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="p-6 bg-[#0a0a1a]/60 border border-white/5 rounded-3xl backdrop-blur-md group hover:border-violet-500/30 transition-all flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 overflow-hidden relative"
                                >
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-violet-600/5 blur-3xl -mr-16 -mt-16 rounded-full" />

                                    <div className="flex items-start gap-5 relative z-10">
                                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-600/20 to-fuchsia-600/20 border border-white/10 flex items-center justify-center text-violet-400 group-hover:scale-110 transition-transform duration-500">
                                            <BookOpen size={28} />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-3">
                                                <h3 className="text-xl font-bold text-white group-hover:text-violet-400 transition-colors">{batch.batchName}</h3>
                                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${batch.status === 'ONGOING' ? 'bg-emerald-500/10 text-emerald-400' :
                                                        batch.status === 'UPCOMING' ? 'bg-blue-500/10 text-blue-400' : 'bg-amber-500/10 text-amber-400'
                                                    }`}>{batch.status}</span>
                                            </div>
                                            <p className="text-sm text-slate-400 font-medium">{batch.courseName}</p>
                                            <div className="mt-2 flex flex-wrap gap-4 text-xs text-slate-500">
                                                <span className="flex items-center gap-1.5"><Users size={12} /> {batch.totalStudents}/{batch.maxCapacity}</span>
                                                <span className="flex items-center gap-1.5"><UserCheck size={12} /> {batch.trainerName}</span>
                                                <span className="flex items-center gap-1.5"><Clock size={12} /> {batch.schedule}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="w-full lg:w-48 space-y-2 relative z-10">
                                        <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                            <span>Progress</span>
                                            <span className="text-white">45%</span>
                                        </div>
                                        <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `45%` }}
                                                className="h-full bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-full"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 w-full lg:w-auto relative z-10">
                                        <button className="flex-1 lg:flex-none p-3 bg-white/5 border border-white/10 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-all">
                                            <Settings size={18} />
                                        </button>
                                        <button className="flex-1 lg:flex-none px-6 py-3 bg-violet-600/10 border border-violet-500/30 rounded-xl text-violet-400 font-bold text-xs hover:bg-violet-600 hover:text-white transition-all uppercase tracking-widest">
                                            MANAGE
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                )}

                {activeTab === 'courses' && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    >
                        {courses.map((course, i) => (
                            <div key={i} className="p-6 bg-[#0a0a1a]/60 border border-white/5 rounded-3xl backdrop-blur-md group hover:border-violet-500/30 transition-all relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-24 h-24 bg-violet-600/5 blur-2xl -mr-12 -mt-12 rounded-full" />
                                <div className="flex justify-between items-start mb-6">
                                    <div className="w-12 h-12 rounded-xl bg-violet-600/10 border border-violet-500/20 flex items-center justify-center text-violet-400 group-hover:bg-violet-600 group-hover:text-white transition-all">
                                        <Layers size={24} />
                                    </div>
                                    <div className="flex items-center gap-1 text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-lg text-[10px] font-bold">
                                        ★ {course.rating}
                                    </div>
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-violet-200 transition-colors uppercase tracking-tight">{course.title}</h3>
                                <div className="flex justify-between items-center text-xs text-slate-500 font-bold mb-6">
                                    <span>{course.modules} Modules</span>
                                    <span>{course.content}</span>
                                </div>
                                <div className="flex gap-2">
                                    <button className="flex-1 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white font-bold text-xs hover:bg-white/10 transition-all uppercase tracking-widest">Curriculum</button>
                                    <button className="flex-1 py-2.5 bg-violet-600 border border-violet-500 rounded-xl text-white font-bold text-xs hover:scale-105 transition-all shadow-lg shadow-violet-500/10 uppercase tracking-widest">Edit</button>
                                </div>
                            </div>
                        ))}
                        <button className="p-6 border-2 border-dashed border-white/10 rounded-3xl flex flex-col items-center justify-center gap-3 text-slate-500 hover:text-violet-400 hover:border-violet-500/50 hover:bg-white/5 transition-all group">
                            <Plus size={32} className="group-hover:rotate-90 transition-transform duration-500" />
                            <span className="font-bold text-xs uppercase tracking-[0.2em]">Add New Course Template</span>
                        </button>
                    </motion.div>
                )}

                {activeTab === 'lms' && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="space-y-6"
                    >
                        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                            <div className="relative w-full md:w-96">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                                <input type="text" placeholder="Search curriculum assets..." className="w-full bg-[#0a0a1a]/60 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors" />
                            </div>
                            <button className="flex items-center gap-2 px-6 py-3 bg-emerald-600/20 border border-emerald-500/40 text-emerald-400 font-bold rounded-2xl hover:bg-emerald-600 hover:text-white transition-all uppercase tracking-widest text-xs">
                                <Upload size={18} /> Upload Master Asset
                            </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {materials.map((asset, i) => (
                                <div key={i} className="p-6 bg-[#0a0a1a]/60 border border-white/5 rounded-3xl group hover:border-emerald-500/30 transition-all flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 rounded-2xl bg-white/5 text-slate-400 group-hover:text-emerald-400 transition-colors">
                                            {asset.type === 'VIDEO' ? <PlayCircle size={24} /> : <FileText size={24} />}
                                        </div>
                                        <div>
                                            <div className="text-sm font-bold text-white group-hover:text-emerald-200 transition-colors">{asset.name}</div>
                                            <div className="text-[10px] text-slate-500 font-bold">{asset.type} • {(asset.size / 1024 / 1024).toFixed(2)} MB</div>
                                        </div>
                                    </div>
                                    <button className="p-2 hover:bg-white/10 rounded-lg text-slate-500 hover:text-white transition-colors"><Download size={16} /></button>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}

                {activeTab === 'scheduling' && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-[600px]"
                    >
                        <div className="lg:col-span-2 bg-[#0a0a1a]/60 border border-white/5 rounded-3xl p-8 backdrop-blur-md overflow-hidden flex flex-col relative">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-violet-600/50 via-fuchsia-600/50 to-violet-600/50" />
                            <div className="flex justify-between items-center mb-10">
                                <div>
                                    <h3 className="text-2xl font-bold text-white">Operations Calendar</h3>
                                    <p className="text-xs text-slate-500 font-bold uppercase tracking-[0.2em] mt-1">February 2026</p>
                                </div>
                                <div className="flex gap-3">
                                    <button className="p-3 hover:bg-white/5 rounded-xl border border-white/10 text-slate-400 transition-colors"><ChevronRight className="rotate-180" size={20} /></button>
                                    <button className="p-3 hover:bg-white/5 rounded-xl border border-white/10 text-slate-400 transition-colors"><ChevronRight size={20} /></button>
                                </div>
                            </div>
                            <div className="flex-1 grid grid-cols-7 gap-3">
                                {['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].map(day => (
                                    <div key={day} className="text-center text-[10px] font-black text-slate-600 py-3 tracking-[0.3em] font-mono">{day}</div>
                                ))}
                                {Array.from({ length: 35 }).map((_, i) => {
                                    const day = i - 2;
                                    const isToday = day === 10;
                                    const hasEvent = [5, 10, 15, 20, 22].includes(day);
                                    return (
                                        <div key={i} className={`relative flex flex-col items-center p-3 rounded-2xl border ${isToday ? 'bg-violet-600/20 border-violet-500 shadow-xl shadow-violet-500/10' : 'border-white/5 hover:border-white/20'
                                            } transition-all cursor-pointer group h-full`}>
                                            <span className={`text-xs font-bold ${day < 1 || day > 28 ? 'text-slate-800' : isToday ? 'text-violet-400' : 'text-slate-500 group-hover:text-white'}`}>
                                                {day > 0 && day <= 28 ? day : ''}
                                            </span>
                                            {hasEvent && day > 0 && (
                                                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="mt-auto flex gap-1">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-violet-500 shadow-[0_0_5px_rgba(124,58,237,0.5)]" />
                                                    {isToday && <div className="w-1.5 h-1.5 rounded-full bg-fuchsia-500 shadow-[0_0_5px_rgba(217,70,239,0.5)]" />}
                                                </motion.div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="space-y-4 flex flex-col h-full overflow-y-auto custom-scrollbar pr-2">
                            <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2 flex items-center gap-2">
                                <div className="w-4 h-[1px] bg-slate-700" /> ACTIVE AGENDA (FEB 10)
                            </h4>
                            {[
                                { time: "10:00 AM", title: "React Architecture", batch: "B22", tutor: "Dr. Alan", color: "border-violet-500" },
                                { time: "01:30 PM", title: "Placement Prep", batch: "P05", tutor: "Team HR", color: "border-fuchsia-500" },
                                { time: "04:30 PM", title: "System Design Lab", batch: "S05", tutor: "Mr. Rajesh", color: "border-blue-500" },
                            ].map((event, i) => (
                                <div key={i} className={`p-5 bg-white/5 border-l-4 ${event.color} rounded-2xl group hover:bg-white/[0.08] transition-all cursor-pointer`}>
                                    <div className="text-[10px] font-bold text-slate-500 mb-1">{event.time}</div>
                                    <div className="text-sm font-bold text-white group-hover:text-violet-300 transition-colors uppercase tracking-tight">{event.title}</div>
                                    <div className="mt-3 flex justify-between items-center text-[10px] font-bold text-slate-500">
                                        <span className="bg-white/5 px-2 py-1 rounded-md">BATCH {event.batch}</span>
                                        <span>{event.tutor}</span>
                                    </div>
                                </div>
                            ))}
                            <button className="mt-6 w-full py-4 bg-white/5 border border-white/10 rounded-2xl text-slate-400 font-bold text-[10px] tracking-[0.2em] hover:bg-violet-600 hover:text-white hover:border-violet-500 transition-all uppercase">
                                ADD CALENDAR EVENT
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </AdvancedModuleLayout>
    );
}
