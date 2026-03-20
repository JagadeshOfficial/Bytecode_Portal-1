"use client";

import { useState } from 'react';
import AdvancedModuleLayout from '@/components/dashboard/AdvancedModuleLayout';
import { motion } from 'framer-motion';
import {
    CheckCircle,
    FileText,
    PieChart,
    Clock,
    Plus,
    Search,
    Filter,
    MoreVertical,
    BarChart3,
    AlertCircle,
    Check
} from 'lucide-react';

export default function AssessmentPage() {
    const [activeTab, setActiveTab] = useState('tests');

    const stats = [
        { label: "Active Tests", value: "8", icon: FileText, color: "#3b82f6", trend: "2 Live" },
        { label: "Pending Reviews", value: "45", icon: Clock, color: "#f59e0b", trend: "High" },
        { label: "Avg. Score", value: "76%", icon: BarChart3, color: "#10b981", trend: "+2.5%" },
        { label: "Completion Rate", value: "92%", icon: CheckCircle, color: "#8b5cf6", trend: "Excellent" },
    ];

    const tests = [
        { title: "React Fundamentals Quiz", batch: "B22", type: "MCQ", duration: "45 min", due: "Today", status: "Active" },
        { title: "Java OOPs Concept", batch: "J15", type: "Coding", duration: "90 min", due: "Tomorrow", status: "Scheduled" },
        { title: "Python Basics Test", batch: "P09", type: "MCQ", duration: "30 min", due: "Yesterday", status: "Closed" },
        { title: "System Design Mock", batch: "S05", type: "Subjective", duration: "120 min", due: "Feb 15", status: "Draft" },
    ];

    return (
        <AdvancedModuleLayout
            title="Assessments & Exams"
            subtitle="Create, manage, and evaluate student assessments."
            stats={stats}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            role="admin"
            tabs={[
                { id: 'tests', label: 'Test Library', icon: FileText },
                { id: 'results', label: 'Results', icon: PieChart },
                { id: 'grading', label: 'Grading Queue', icon: CheckCircle },
            ]}
        >
            {activeTab === 'tests' && (
                <div className="space-y-6">
                    <div className="flex justify-between items-center">
                        <div className="relative w-96">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                            <input type="text" placeholder="Search assessments..." className="w-full bg-slate-900/50 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors" />
                        </div>
                        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-colors">
                            <Plus size={16} /> Create New Test
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {tests.map((test, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="bg-slate-900/50 border border-white/5 rounded-2xl p-6 hover:border-blue-500/30 transition-all group relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-white/5 to-transparent rounded-bl-full -mr-8 -mt-8 transition-all group-hover:scale-110"></div>

                                <div className="flex justify-between items-start mb-4 relative z-10">
                                    <div className={`p-2 rounded-lg ${test.type === 'MCQ' ? 'bg-blue-500/10 text-blue-400' :
                                        test.type === 'Coding' ? 'bg-violet-500/10 text-violet-400' : 'bg-emerald-500/10 text-emerald-400'
                                        }`}>
                                        {test.type === 'MCQ' ? <CheckCircle size={18} /> : test.type === 'Coding' ? <FileText size={18} /> : <BarChart3 size={18} />}
                                    </div>
                                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${test.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400' :
                                        test.status === 'Scheduled' ? 'bg-blue-500/10 text-blue-400' :
                                            test.status === 'Draft' ? 'bg-slate-500/10 text-slate-400' : 'bg-red-500/10 text-red-400'
                                        }`}>
                                        {test.status}
                                    </span>
                                </div>

                                <h3 className="text-lg font-bold text-white mb-1 group-hover:text-blue-400 transition-colors relative z-10">{test.title}</h3>
                                <div className="text-xs text-slate-400 font-mono mb-4 relative z-10">Batch: {test.batch}</div>

                                <div className="space-y-2 border-t border-white/5 pt-4 relative z-10">
                                    <div className="flex justify-between text-xs text-slate-400">
                                        <span>Duration</span>
                                        <span className="text-white font-bold">{test.duration}</span>
                                    </div>
                                    <div className="flex justify-between text-xs text-slate-400">
                                        <span>Due Date</span>
                                        <span className="text-white font-bold">{test.due}</span>
                                    </div>
                                </div>

                                <div className="mt-4 pt-4 border-t border-white/5 flex gap-2 relative z-10">
                                    <button className="flex-1 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-xs font-bold text-white transition-colors">Edit</button>
                                    <button className="flex-1 py-2 bg-blue-600/10 hover:bg-blue-600 text-blue-400 hover:text-white rounded-lg text-xs font-bold transition-colors">Assign</button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            )}
        </AdvancedModuleLayout>
    );
}
