"use client";

import { useState } from 'react';
import AdvancedModuleLayout from '@/components/dashboard/AdvancedModuleLayout';
import { motion } from 'framer-motion';
import {
    Users,
    UserCheck,
    GraduationCap,
    Presentation,
    Search,
    Filter,
    MoreVertical,
    Mail,
    Phone,
    Shield,
    Plus,
    FileText
} from 'lucide-react';

export default function UserManagementPage() {
    const [activeTab, setActiveTab] = useState('students');

    const stats = [
        { label: "Total Students", value: "1,248", icon: GraduationCap, color: "#3b82f6", trend: "+42 New" },
        { label: "Active Tutors", value: "32", icon: Presentation, color: "#8b5cf6", trend: "Full Capacity" },
        { label: "Staff Members", value: "18", icon: Users, color: "#10b981", trend: "Stable" },
        { label: "User Requests", value: "5", icon: UserCheck, color: "#f59e0b", trend: "Pending" },
    ];

    const students = [
        { name: "Arjun Mehra", id: "STU-2024-001", course: "Full Stack Java", batch: "B22", status: "Active", email: "arjun.m@example.com" },
        { name: "Priya Sharma", id: "STU-2024-002", course: "Data Science", batch: "DS18", status: "Active", email: "priya.s@example.com" },
        { name: "Rahul Verma", id: "STU-2024-005", course: "Python Basics", batch: "P09", status: "On Hold", email: "rahul.v@example.com" },
        { name: "Sneha Gupta", id: "STU-2024-012", course: "UI/UX Design", batch: "UX05", status: "Active", email: "sneha.g@example.com" },
    ];

    return (
        <AdvancedModuleLayout
            title="User Management"
            subtitle="Manage students, tutors, and administrative staff accounts."
            stats={stats}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            role="admin"
            tabs={[
                { id: 'students', label: 'Students', icon: GraduationCap },
                { id: 'tutors', label: 'Tutors', icon: Presentation },
                { id: 'staff', label: 'Employees', icon: Users },
                { id: 'requests', label: 'Requests', icon: UserCheck },
            ]}
        >
            {activeTab === 'students' && (
                <div className="space-y-6">
                    <div className="flex justify-between items-center">
                        <div className="relative w-96">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                            <input type="text" placeholder="Search students by name, ID, or email..." className="w-full bg-slate-900/50 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors" />
                        </div>
                        <div className="flex gap-2">
                            <button className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-colors border border-white/5">
                                <Filter size={16} /> Filters
                            </button>
                            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-colors">
                                <Plus size={16} /> Add Student
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {students.map((student, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: i * 0.05 }}
                                className="bg-slate-900/50 border border-white/5 rounded-2xl p-6 hover:border-blue-500/30 transition-all group relative"
                            >
                                <div className="absolute top-4 right-4">
                                    <button className="text-slate-500 hover:text-white transition-colors"><MoreVertical size={16} /></button>
                                </div>
                                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-xl font-bold text-white mb-4 ring-4 ring-slate-900/50 mx-auto">
                                    {student.name.charAt(0)}
                                </div>
                                <div className="text-center mb-4">
                                    <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors">{student.name}</h3>
                                    <div className="text-xs text-slate-400 font-mono">{student.id}</div>
                                </div>

                                <div className="space-y-3 border-t border-white/5 pt-4">
                                    <div className="flex justify-between text-xs">
                                        <span className="text-slate-500">Course</span>
                                        <span className="text-white font-bold">{student.course}</span>
                                    </div>
                                    <div className="flex justify-between text-xs">
                                        <span className="text-slate-500">Batch</span>
                                        <span className="text-white font-bold">{student.batch}</span>
                                    </div>
                                    <div className="flex justify-between text-xs items-center">
                                        <span className="text-slate-500">Status</span>
                                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${student.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
                                            }`}>
                                            {student.status}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex gap-2 mt-4 pt-4 border-t border-white/5 justify-center">
                                    <button className="p-2 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-colors" title="Email">
                                        <Mail size={16} />
                                    </button>
                                    <button className="p-2 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-colors" title="Profile">
                                        <FileText size={16} />
                                    </button>
                                    <button className="p-2 hover:bg-white/10 rounded-lg text-slate-400 hover:text-red-400 transition-colors" title="Block">
                                        <Shield size={16} />
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            )}
        </AdvancedModuleLayout>
    );
}
