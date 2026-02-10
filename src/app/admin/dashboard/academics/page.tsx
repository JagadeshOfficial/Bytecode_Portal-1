"use client";

import { useState } from 'react';
import AdvancedModuleLayout from '@/components/dashboard/AdvancedModuleLayout';
import { motion } from 'framer-motion';
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
    MapPin,
    Settings,
    MoreVertical,
    Save,
    Trash2,
    CalendarDays
} from 'lucide-react';

export default function AcademicManagementPage() {
    const [activeTab, setActiveTab] = useState('batches');

    const stats = [
        { label: "Active Courses", value: "18", icon: Layers, color: "#7c3aed", trend: "+2 this month" },
        { label: "Total Batches", value: "32", icon: BookOpen, color: "#22d3ee", trend: "Normal" },
        { label: "Tutors Assigned", value: "28/32", icon: UserCheck, color: "#10b981", trend: "High load" },
        { label: "Classes Today", value: "14", icon: CalendarDays, color: "#f59e0b" },
    ];

    const batches = [
        { id: "B22-REACT", course: "React Full Stack", tutor: "Dr. Alan Smith", schedule: "MWF 10:00 AM", students: 45, progress: 65, status: "Ongoing" },
        { id: "B08-GO", course: "Backend GoLang", tutor: "Prof. Sarah Chen", schedule: "TTS 02:00 PM", students: 32, progress: 20, status: "New" },
        { id: "P05-SYS", course: "System Design", tutor: "Mr. Rajesh Kumar", schedule: "Sat-Sun 04:30 PM", students: 50, progress: 90, status: "Finalizing" },
    ];

    return (
        <AdvancedModuleLayout
            title="Academic Management"
            subtitle="Centralized control for courses, batches, schedules, and faculty assignments."
            stats={stats}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            role="admin"
            tabs={[
                { id: 'batches', label: 'Batch Management', icon: BookOpen },
                { id: 'courses', label: 'Course Catalog', icon: Layers },
                { id: 'scheduling', label: 'Class Schedules', icon: CalendarDays },
                { id: 'faculty', label: 'Faculty Assignment', icon: UserCheck },
            ]}
        >
            {activeTab === 'batches' && (
                <div className="space-y-6">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div className="relative w-full md:w-96">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                            <input type="text" placeholder="Filter batches by name, tutor, or course..." className="w-full bg-[#0a0a1a] border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-violet-500 transition-colors" />
                        </div>
                        <button className="w-full md:w-auto px-6 py-3 bg-violet-600 hover:bg-violet-700 text-white font-bold rounded-2xl shadow-lg shadow-violet-500/20 flex items-center justify-center gap-2 transition-all">
                            <Plus size={18} /> CREATE NEW BATCH
                        </button>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                        {batches.map((batch, i) => (
                            <motion.div
                                key={batch.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="p-6 bg-[#0a0a1a]/60 border border-white/5 rounded-3xl backdrop-blur-md group hover:border-violet-500/30 transition-all flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6"
                            >
                                <div className="flex items-start gap-5">
                                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-600/20 to-fuchsia-600/20 border border-white/10 flex items-center justify-center relative overflow-hidden group-hover:scale-110 transition-transform duration-500">
                                        <BookOpen className="text-violet-400" size={28} />
                                        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-3">
                                            <h3 className="text-xl font-bold text-white group-hover:text-violet-400 transition-colors">{batch.id}</h3>
                                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${batch.status === 'Ongoing' ? 'bg-emerald-500/10 text-emerald-400' :
                                                batch.status === 'New' ? 'bg-blue-500/10 text-blue-400' : 'bg-amber-500/10 text-amber-400'
                                                }`}>{batch.status}</span>
                                        </div>
                                        <p className="text-sm text-slate-400 font-medium">{batch.course}</p>
                                        <div className="mt-2 flex flex-wrap gap-4 text-xs text-slate-500">
                                            <span className="flex items-center gap-1.5"><Users size={12} className="text-slate-400" /> {batch.students} Students</span>
                                            <span className="flex items-center gap-1.5"><UserCheck size={12} className="text-slate-400" /> {batch.tutor}</span>
                                            <span className="flex items-center gap-1.5"><Clock size={12} className="text-slate-500" /> {batch.schedule}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="w-full lg:w-48 space-y-2">
                                    <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                        <span>Course Completion</span>
                                        <span className="text-white">{batch.progress}%</span>
                                    </div>
                                    <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${batch.progress}%` }}
                                            className="h-full bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-full"
                                        />
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 w-full lg:w-auto border-t lg:border-t-0 border-white/5 pt-4 lg:pt-0">
                                    <button className="flex-1 lg:flex-none p-3 bg-white/5 border border-white/10 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-all">
                                        <Settings size={18} />
                                    </button>
                                    <button className="flex-1 lg:flex-none p-3 bg-white/5 border border-white/10 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-all">
                                        <Calendar size={18} />
                                    </button>
                                    <button className="flex-1 lg:flex-none px-6 py-3 bg-violet-600/10 border border-violet-500/30 rounded-xl text-violet-400 font-bold text-xs hover:bg-violet-600 hover:text-white transition-all">
                                        BATCH DETAILS
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            )}

            {activeTab === 'scheduling' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-[600px]">
                    <div className="lg:col-span-2 bg-[#0a0a1a]/60 border border-white/5 rounded-3xl p-6 backdrop-blur-md overflow-hidden flex flex-col">
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="text-xl font-bold text-white">February 2026</h3>
                            <div className="flex gap-2">
                                <button className="p-2 hover:bg-white/5 rounded-lg border border-white/5 text-slate-400 transition-colors"><ChevronRight className="rotate-180" size={20} /></button>
                                <button className="p-2 hover:bg-white/5 rounded-lg border border-white/5 text-slate-400 transition-colors"><ChevronRight size={20} /></button>
                            </div>
                        </div>
                        <div className="flex-1 grid grid-cols-7 gap-2">
                            {['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].map(day => (
                                <div key={day} className="text-center text-[10px] font-bold text-slate-500 py-2 tracking-[0.2em]">{day}</div>
                            ))}
                            {Array.from({ length: 35 }).map((_, i) => {
                                const day = i - 2;
                                const hasClass = day === 10 || day === 14 || day === 15 || day === 22;
                                return (
                                    <div key={i} className={`relative flex flex-col items-center justify-start p-2 rounded-2xl border ${day === 10 ? 'bg-violet-600/20 border-violet-500/50 shadow-lg shadow-violet-500/10' : 'border-white/5 hover:border-white/20'
                                        } transition-all cursor-pointer group`}>
                                        <span className={`text-xs font-bold ${day < 1 || day > 28 ? 'text-slate-700' : day === 10 ? 'text-violet-400' : 'text-slate-400 group-hover:text-white'}`}>
                                            {day > 0 && day <= 28 ? day : ''}
                                        </span>
                                        {hasClass && (
                                            <div className="mt-auto flex gap-1">
                                                <div className="w-1 h-1 rounded-full bg-violet-400" />
                                                {day === 10 && <div className="w-1 h-1 rounded-full bg-fuchsia-400" />}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="space-y-6 flex flex-col h-full overflow-y-auto custom-scrollbar">
                        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-2">Schedule Details (Feb 10)</h4>
                        {[
                            { time: "10:00 AM", title: "React State Management", batch: "B22", tutor: "Dr. Alan", type: "Main" },
                            { time: "01:30 PM", title: "Mock Interview Session", batch: "P05", tutor: "HR Team", type: "Placement" },
                            { time: "04:30 PM", title: "System Design Refresher", batch: "S05", tutor: "Mr. Rajesh", type: "Lab" },
                        ].map((event, i) => (
                            <div key={i} className="p-4 bg-white/5 border border-white/5 rounded-2xl relative group hover:bg-white/[0.08] transition-colors">
                                <div className={`absolute left-0 top-4 bottom-4 w-1 rounded-r-full ${event.type === 'Main' ? 'bg-violet-500' : event.type === 'Placement' ? 'bg-fuchsia-500' : 'bg-blue-500'
                                    }`} />
                                <div className="text-xs font-bold text-violet-400 mb-1">{event.time}</div>
                                <div className="text-sm font-bold text-white group-hover:text-violet-200 transition-colors">{event.title}</div>
                                <div className="mt-2 flex justify-between items-center">
                                    <span className="text-[10px] text-slate-500">Batch: <b className="text-slate-300">{event.batch}</b></span>
                                    <span className="text-[10px] text-slate-500">{event.tutor}</span>
                                </div>
                            </div>
                        ))}
                        <button className="mt-auto w-full py-4 bg-violet-600/10 border border-violet-500/20 rounded-2xl text-violet-400 font-bold text-xs hover:bg-violet-600 hover:text-white transition-all">
                            RESCHEDULE CLASS
                        </button>
                    </div>
                </div>
            )}
        </AdvancedModuleLayout>
    );
}
