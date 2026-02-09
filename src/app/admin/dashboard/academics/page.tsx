"use client";

import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { motion } from 'framer-motion';
import {
    BookOpen,
    Layers,
    Calendar,
    Users,
    Video,
    FileText,
    Plus,
    Clock,
    Search,
    ChevronRight,
    PlayCircle,
    Download
} from 'lucide-react';

const COURSES = [
    { id: 1, name: "Full Stack Java", batches: 8, students: 240, status: "Active" },
    { id: 2, name: "Python for AI", batches: 4, students: 120, status: "Active" },
    { id: 3, name: "React FE Mastery", batches: 6, students: 180, status: "Planned" },
];

export default function AcademicLMSModule() {
    return (
        <DashboardLayout role="admin">
            <div className="flex flex-col gap-8">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-[Rajdhani] font-bold text-white tracking-widest uppercase">
                            Academic & <span className="text-[#22d3ee]">LMS Hub</span>
                        </h1>
                        <p className="text-[var(--text-dim)]">Manage courses, schedules, and digital assets.</p>
                    </div>
                    <button className="flex items-center gap-2 px-6 py-2 bg-[#7c3aed] text-white rounded-xl font-bold hover:scale-105 transition-all">
                        <Plus className="w-4 h-4" /> Create Course
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Course & Batch Management */}
                    <div className="lg:col-span-2 flex flex-col gap-6">
                        <div className="bg-[rgba(19,10,48,0.5)] border border-[rgba(124,58,237,0.1)] rounded-2xl overflow-hidden">
                            <div className="p-6 border-b border-white/5 bg-white/2">
                                <h3 className="text-lg font-bold text-white">Course Catalog Management</h3>
                            </div>
                            <div className="p-6 space-y-4">
                                {COURSES.map(course => (
                                    <div key={course.id} className="p-4 rounded-xl bg-white/5 border border-white/5 hover:border-[#7c3aed] transition-all flex justify-between items-center">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-lg bg-[#7c3aed]/20 flex items-center justify-center">
                                                <Layers className="w-5 h-5 text-[#7c3aed]" />
                                            </div>
                                            <div>
                                                <div className="font-bold text-white">{course.name}</div>
                                                <div className="text-[10px] text-[var(--text-dim)] uppercase font-bold">{course.batches} Batches • {course.students} Students</div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className={`px-2 py-1 rounded text-[10px] font-bold ${course.status === 'Active' ? 'text-emerald-400 bg-emerald-400/10' : 'text-[#22d3ee] bg-[#22d3ee]/10'}`}>
                                                {course.status}
                                            </span>
                                            <button className="p-2 hover:bg-white/10 rounded-lg text-white"><ChevronRight className="w-4 h-4" /></button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Scheduling Grid */}
                        <div className="bg-[rgba(19,10,48,0.5)] border border-[rgba(124,58,237,0.1)] rounded-2xl p-6">
                            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                                <Calendar className="w-5 h-5 text-[#d946ef]" />
                                Academic Scheduling
                            </h3>
                            <div className="grid grid-cols-7 gap-2">
                                {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
                                    <div key={i} className="text-center text-[10px] font-bold text-[var(--text-dim)] py-2">{d}</div>
                                ))}
                                {Array.from({ length: 31 }).map((_, i) => (
                                    <div key={i} className={`aspect-square rounded-lg border border-white/5 flex items-center justify-center text-[10px] cursor-pointer hover:bg-[#7c3aed]/20 transition-all ${i === 8 ? 'bg-[#7c3aed] text-white shadow-lg shadow-[#7c3aed]/40' : 'text-[var(--text-dim)]'}`}>
                                        {i + 1}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* LMS Asset Library */}
                    <div className="flex flex-col gap-6">
                        <div className="bg-[rgba(19,10,48,0.5)] border border-[rgba(34,211,238,0.1)] rounded-2xl p-6">
                            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                                <FileText className="w-5 h-5 text-[#22d3ee]" />
                                LMS Asset Vault
                            </h3>
                            <div className="space-y-4">
                                {[
                                    { title: "Spring Boot Intro.mp4", size: "1.2 GB", type: "video" },
                                    { title: "React Context Lab.pdf", size: "450 KB", type: "doc" },
                                    { title: "SQL Mastery Notes.zip", size: "12 MB", type: "archive" },
                                ].map((asset, i) => (
                                    <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all cursor-pointer">
                                        <div className="flex items-center gap-3">
                                            {asset.type === 'video' ? <PlayCircle className="w-4 h-4 text-red-400" /> : <FileText className="w-4 h-4 text-blue-400" />}
                                            <div>
                                                <div className="text-[11px] font-bold text-white truncate w-32">{asset.title}</div>
                                                <div className="text-[8px] text-[var(--text-dim)]">{asset.size}</div>
                                            </div>
                                        </div>
                                        <Download className="w-3 h-3 text-[var(--text-dim)]" />
                                    </div>
                                ))}
                            </div>
                            <button className="w-full mt-6 py-2 bg-[#22d3ee]/10 text-[#22d3ee] text-xs font-bold rounded-lg border border-[#22d3ee]/20 hover:bg-[#22d3ee] hover:text-white transition-all">
                                Upload New Content
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
