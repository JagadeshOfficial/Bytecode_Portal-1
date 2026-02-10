"use client";

import { useState } from 'react';
import AdvancedModuleLayout from '@/components/dashboard/AdvancedModuleLayout';
import { motion } from 'framer-motion';
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
    Settings
} from 'lucide-react';

export default function AcademicsPage() {
    const [activeTab, setActiveTab] = useState('overview');

    const stats = [
        { label: "Total Courses", value: "24", icon: BookOpen, color: "#3b82f6", trend: "+2 New" },
        { label: "Active Batches", value: "18", icon: Users, color: "#8b5cf6", trend: "High Demand" },
        { label: "Enrolled Students", value: "850", icon: GraduationCap, color: "#10b981", trend: "+15% YoY" },
        { label: "Completion Rate", value: "92%", icon: CheckCircle, color: "#f59e0b", trend: "Top Tier" },
    ];

    const courses = [
        { title: "Full Stack Development", modules: 12, duration: "6 Months", rating: 4.8, students: 320, level: "Advanced" },
        { title: "Data Science & AI", modules: 15, duration: "8 Months", rating: 4.9, students: 250, level: "Expert" },
        { title: "UI/UX Design Masterclass", modules: 8, duration: "4 Months", rating: 4.7, students: 180, level: "Intermediate" },
        { title: "Cloud Computing (AWS)", modules: 10, duration: "5 Months", rating: 4.8, students: 210, level: "Advanced" },
    ];

    return (
        <AdvancedModuleLayout
            title="Academic Management"
            subtitle="Oversee curriculum, courses, batches, and student progression."
            stats={stats}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            tabs={[
                { id: 'overview', label: 'Overview', icon: PieChart },
                { id: 'courses', label: 'Course Library', icon: BookOpen },
                { id: 'batches', label: 'Active Batches', icon: Users },
                { id: 'curriculum', label: 'Curriculum Builder', icon: Layers },
            ]}
        >
            {activeTab === 'overview' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Active Batches List */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-slate-900/50 border border-white/5 rounded-2xl p-6 backdrop-blur-sm lg:col-span-2"
                    >
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                <Users className="text-blue-400" /> Live Batches
                            </h3>
                            <button className="text-xs text-blue-400 font-bold hover:underline">View Schedule</button>
                        </div>
                        <div className="space-y-4">
                            {[
                                { name: "Full Stack Winter 2024", time: "10:00 AM - 12:00 PM", instructor: "Rahul S.", students: 45, progress: 60, status: "Ongoing" },
                                { name: "Data Science Spring 2024", time: "02:00 PM - 04:00 PM", instructor: "Priya M.", students: 32, progress: 25, status: "Ongoing" },
                                { name: "AWS Cloud Certification", time: "06:00 PM - 08:00 PM", instructor: "Amit K.", students: 50, progress: 90, status: "Finalizing" },
                            ].map((batch, i) => (
                                <div key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5 hover:border-blue-500/30 transition-all cursor-pointer group">
                                    <div className="flex items-center gap-4">
                                        <div className="h-12 w-12 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400 border border-blue-500/20 group-hover:scale-110 transition-transform">
                                            <b className="text-lg">{batch.name.charAt(0)}</b>
                                        </div>
                                        <div>
                                            <div className="font-bold text-white group-hover:text-blue-400 transition-colors">{batch.name}</div>
                                            <div className="text-xs text-slate-400 flex items-center gap-2">
                                                <span><Clock size={10} className="inline mr-1" />{batch.time}</span>
                                                <span className="w-1 h-1 bg-slate-600 rounded-full" />
                                                <span>{batch.instructor}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${batch.status === 'Ongoing' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
                                            }`}>
                                            {batch.status}
                                        </span>
                                        <div className="mt-2 w-24 h-1 bg-slate-700 rounded-full overflow-hidden ml-auto">
                                            <div className="h-full bg-blue-500" style={{ width: `${batch.progress}%` }} />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Quick Course Stats */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-slate-900/50 border border-white/5 rounded-2xl p-6 backdrop-blur-sm flex flex-col gap-6"
                    >
                        <h3 className="text-lg font-bold text-white mb-2">Category Spread</h3>
                        <div className="flex-1 flex items-center justify-center">
                            <div className="relative w-48 h-48 rounded-full border-[16px] border-slate-800 flex items-center justify-center">
                                {/* Simulated Pie Chart Segments using Conic Gradients - simplified for CSS */}
                                <div className="absolute inset-0 rounded-full" style={{ background: 'conic-gradient(#3b82f6 0% 40%, #8b5cf6 40% 70%, #10b981 70% 90%, #f59e0b 90% 100%)', opacity: 0.8 }}></div>
                                <div className="absolute inset-4 bg-slate-900 rounded-full flex flex-col items-center justify-center z-10">
                                    <span className="text-3xl font-bold text-white">24</span>
                                    <span className="text-xs text-slate-400 uppercase tracking-widest">Total</span>
                                </div>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                            <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-blue-500"></div>Development (40%)</div>
                            <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-violet-500"></div>Data Science (30%)</div>
                            <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-emerald-500"></div>Design (20%)</div>
                            <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-amber-500"></div>Cloud (10%)</div>
                        </div>
                    </motion.div>
                </div>
            )}

            {activeTab === 'courses' && (
                <div className="space-y-6">
                    <div className="flex justify-between items-center">
                        <div className="relative w-96">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                            <input type="text" placeholder="Search courses..." className="w-full bg-slate-900/50 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors" />
                        </div>
                        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-colors">
                            <Plus size={16} /> Add New Course
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {courses.map((course, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="bg-slate-900/50 border border-white/5 rounded-2xl p-5 hover:border-blue-500/50 transition-all group relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button className="p-2 hover:bg-white/10 rounded-lg text-white"><MoreVertical size={16} /></button>
                                </div>
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-white mb-4 shadow-lg shadow-blue-500/20">
                                    <Layers size={24} />
                                </div>
                                <h3 className="text-lg font-bold text-white mb-1 group-hover:text-blue-400 transition-colors">{course.title}</h3>
                                <div className="flex gap-2 mb-4">
                                    <span className="text-[10px] bg-white/5 border border-white/5 px-2 py-0.5 rounded text-slate-400">{course.level}</span>
                                    <span className="text-[10px] bg-white/5 border border-white/5 px-2 py-0.5 rounded text-slate-400">{course.duration}</span>
                                </div>
                                <div className="flex justify-between items-center text-xs text-slate-400 border-t border-white/5 pt-4">
                                    <div className="flex items-center gap-1"><BookOpen size={12} /> {course.modules} Modules</div>
                                    <div className="flex items-center gap-1"><Users size={12} /> {course.students}</div>
                                </div>
                            </motion.div>
                        ))}

                        {/* Add New Placeholder Card */}
                        <button className="border border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center p-6 text-slate-500 hover:text-blue-400 hover:border-blue-500/30 hover:bg-blue-500/5 transition-all group">
                            <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                                <Plus size={24} />
                            </div>
                            <span className="text-sm font-bold">Create New Course</span>
                        </button>
                    </div>
                </div>
            )}

            {activeTab === 'curriculum' && (
                <div className="flex h-[600px] border border-white/10 rounded-2xl overflow-hidden bg-slate-900/30">
                    {/* Sidebar */}
                    <div className="w-64 border-r border-white/10 p-4 bg-slate-900/50">
                        <h4 className="text-sm font-bold text-slate-400 uppercase mb-4">Modules</h4>
                        <div className="space-y-2">
                            {['Introduction to React', 'State Management', 'Hooks Deep Dive', 'Routing in React', 'API Integration', 'Deployment'].map((mod, i) => (
                                <div key={i} className={`p-3 rounded-lg text-sm font-bold cursor-pointer transition-colors flex items-center justify-between ${i === 1 ? 'bg-blue-600 text-white' : 'hover:bg-white/5 text-slate-300'}`}>
                                    <span>{i + 1}. {mod}</span>
                                    <MoreVertical size={14} className="opacity-50" />
                                </div>
                            ))}
                        </div>
                        <button className="mt-4 w-full py-2 border border-dashed border-white/20 rounded-lg text-xs font-bold text-slate-400 hover:text-white hover:border-white/40 transition-colors">
                            + Add Module
                        </button>
                    </div>
                    {/* Main Canvas */}
                    <div className="flex-1 p-8 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] relative">
                        <div className="max-w-3xl mx-auto">
                            <div className="flex items-center justify-between mb-8">
                                <div>
                                    <span className="text-xs font-bold text-blue-400 uppercase">Module 2</span>
                                    <h2 className="text-3xl font-bold text-white">State Management</h2>
                                </div>
                                <div className="flex gap-2">
                                    <button className="px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-xs font-bold text-white">Preview</button>
                                    <button className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 rounded-lg text-xs font-bold text-white">Save Changes</button>
                                </div>
                            </div>

                            <div className="space-y-4">
                                {['Understanding useState', 'Complex State Logic', 'Prop Drilling vs Context', 'Lab: ToDo App'].map((lesson, i) => (
                                    <div key={i} className="bg-slate-800/80 border border-white/5 p-4 rounded-xl flex items-center justify-between hover:border-blue-500/30 transition-colors cursor-move">
                                        <div className="flex items-center gap-4">
                                            <div className="text-slate-500 font-mono text-sm">0{i + 1}</div>
                                            <div className="w-8 h-8 rounded bg-slate-700 flex items-center justify-center text-slate-300">
                                                <PlayCircle size={16} />
                                            </div>
                                            <div>
                                                <div className="text-sm font-bold text-white">{lesson}</div>
                                                <div className="text-[10px] text-slate-400">Video • 12:00 mins</div>
                                            </div>
                                        </div>
                                        <div className="flex gap-2 opacity-50 hover:opacity-100">
                                            <button className="p-1 hover:bg-white/10 rounded"><Settings size={14} /></button>
                                            <button className="p-1 hover:bg-white/10 rounded"><MoreVertical size={14} /></button>
                                        </div>
                                    </div>
                                ))}
                                <button className="w-full py-3 border border-dashed border-white/10 rounded-xl text-sm font-bold text-slate-500 hover:text-blue-400 hover:border-blue-500/30 transition-all flex items-center justify-center gap-2">
                                    <Plus size={16} /> Add Lesson Content
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AdvancedModuleLayout>
    );
}
