"use client";

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import AdvancedModuleLayout from '@/components/dashboard/AdvancedModuleLayout';
import api from '@/lib/api';
import styles from '@/app/admin/super/SuperAdmin.module.css';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FileText,
    Users,
    CheckCircle,
    Clock,
    Plus,
    Search,
    Filter,
    MoreVertical,
    BarChart3,
    Trophy,
    AlertCircle,
    Eye,
    TrendingUp,
    Shield,
    Camera
} from 'lucide-react';

export default function ExamsPage() {
    const [activeTab, setActiveTab] = useState('summary');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

    const [exams, setExams] = useState<any[]>([]);
    const [results, setResults] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchExamData = async () => {
        try {
            const [examsRes, resultsRes] = await Promise.all([
                api.get('exams'),
                api.get('exams/results')
            ]);
            setExams(examsRes.data || []);
            setResults(resultsRes.data || []);
            setLoading(false);
        } catch (error) {
            console.error("Failed to fetch exam data:", error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchExamData();
    }, []);

    const passRate = results.length > 0
        ? (results.filter(r => r.score >= 40).length / results.length) * 100
        : 0;

    const stats = [
        { label: "Total Exams", value: exams.length.toString(), icon: FileText, color: "#3b82f6", trend: `${exams.filter(e => e.active).length} Active` },
        { label: "Attempts", value: results.length.toLocaleString(), icon: Users, color: "#8b5cf6", trend: "Total Submissions" },
        { label: "Avg. Score", value: `${results.length > 0 ? (results.reduce((acc, r) => acc + r.score, 0) / results.length).toFixed(1) : 0}%`, icon: CheckCircle, color: "#10b981", trend: "Success Rate" },
        { label: "Distinctions", value: results.filter(r => r.score >= 80).length.toString(), icon: Trophy, color: "#f59e0b", trend: "Score > 80%" },
    ];

    const upcomingExams = exams.slice(0, 3).map(e => ({
        name: e.title,
        date: new Date(e.createdAt).toLocaleDateString(),
        candidates: 0,
        status: e.active ? "Ready" : "Draft",
        time: "TBD"
    }));

    const activeSessions = [
        { student: "Rahul S.", exam: "JS Final", progress: 65, status: "Active", alerts: 0 },
        { student: "Priya P.", exam: "JS Final", progress: 42, status: "Warning", alerts: 2 },
        { student: "Amit K.", exam: "JS Final", progress: 88, status: "Active", alerts: 0 },
        { student: "Sneha M.", exam: "JS Final", progress: 12, status: "Offline", alerts: 1 },
    ];

    return (
        <AdvancedModuleLayout
            title="Online Exam Engine"
            subtitle="Advanced centralized examination control and proctoring system."
            stats={stats}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            tabs={[
                { id: 'summary', label: 'Overview', icon: BarChart3 },
                { id: 'live', label: 'Live Proctoring', icon: Eye },
                { id: 'exams', label: 'Exam Library', icon: FileText },
                { id: 'results', label: 'Detailed Results', icon: Trophy },
            ]}
        >
            {activeTab === 'summary' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Active Exam Schedule */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-slate-900/50 border border-white/5 rounded-2xl p-6 backdrop-blur-sm lg:col-span-2"
                    >
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                <CalendarIcon className="text-violet-400" /> Upcoming Schedule
                            </h3>
                            <button className="text-xs text-violet-400 font-bold hover:underline">View All</button>
                        </div>
                        <div className="space-y-4">
                            {upcomingExams.map((exam, i) => (
                                <div key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5 hover:border-violet-500/30 transition-all group cursor-pointer">
                                    <div className="flex items-center gap-4">
                                        <div className="text-center bg-violet-500/10 px-3 py-2 rounded-lg border border-violet-500/20">
                                            <div className="text-xs text-violet-300 font-bold uppercase">{exam.date.split(' ')[0]}</div>
                                            <div className="text-lg font-bold text-white">{exam.date.split(' ')[1]}</div>
                                        </div>
                                        <div>
                                            <div className="text-sm font-bold text-white group-hover:text-violet-400 transition-colors">{exam.name}</div>
                                            <div className="text-xs text-slate-400">{exam.time} • {exam.candidates} Candidates</div>
                                        </div>
                                    </div>
                                    <div className={`text-xs font-bold px-3 py-1 rounded-full ${exam.status === 'Ready' ? 'bg-emerald-500/10 text-emerald-400' :
                                        exam.status === 'Draft' ? 'bg-slate-500/10 text-slate-400' : 'bg-amber-500/10 text-amber-400'
                                        }`}>
                                        {exam.status}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Quick Analytics */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-slate-900/50 border border-white/5 rounded-2xl p-6 backdrop-blur-sm flex flex-col gap-6"
                    >
                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                            <TrendingUp className="text-emerald-400" size={20} /> Performance
                        </h3>
                        <div className="flex-1 flex flex-col justify-center items-center relative">
                            {/* Simple CSS Donut Chart */}
                            <div className="w-40 h-40 rounded-full border-[12px] border-slate-700 relative flex items-center justify-center">
                                <div
                                    className="absolute inset-0 rounded-full border-[12px] border-violet-500 border-t-transparent border-l-transparent"
                                    style={{ transform: `rotate(${45 + (passRate * 3.6)}deg)` }}
                                ></div>
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-white">{passRate.toFixed(0)}%</div>
                                    <div className="text-[10px] text-slate-400 uppercase tracking-widest">Pass Rate</div>
                                </div>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="text-center p-3 bg-white/5 rounded-xl">
                                <div className="text-2xl font-bold text-emerald-400">92</div>
                                <div className="text-[10px] text-slate-400">Distinctions</div>
                            </div>
                            <div className="text-center p-3 bg-white/5 rounded-xl">
                                <div className="text-2xl font-bold text-red-400">14</div>
                                <div className="text-[10px] text-slate-400">Failed</div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}

            {activeTab === 'live' && (
                <div className="flex flex-col gap-6">
                    <div className="flex justify-between items-center">
                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                            Live Proctoring Feed (4 Active)
                        </h3>
                        <button className="text-xs bg-red-500/10 text-red-400 px-3 py-1 rounded-full border border-red-500/20 font-bold hover:bg-red-500/20">
                            Force End All
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {activeSessions.map((session, i) => (
                            <motion.div
                                key={i}
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: i * 0.1 }}
                                className={`relative aspect-video bg-black rounded-xl border ${session.alerts > 0 ? 'border-red-500 animate-pulse' : 'border-slate-700'} overflow-hidden group`}
                            >
                                <div className="absolute top-2 left-2 z-10 bg-black/60 backdrop-blur-md px-2 py-1 rounded-md text-xs font-bold text-white flex items-center gap-2">
                                    <div className={`w-1.5 h-1.5 rounded-full ${session.status === 'Active' ? 'bg-emerald-500' : session.status === 'Warning' ? 'bg-amber-500' : 'bg-slate-500'}`}></div>
                                    {session.student}
                                </div>

                                {/* Simulated Camera View */}
                                <div className="absolute inset-0 flex items-center justify-center bg-slate-800">
                                    <Users className="text-slate-600 opacity-20" size={48} />
                                    {session.status === 'Offline' && (
                                        <div className="absolute inset-0 bg-black/80 flex items-center justify-center flex-col gap-2">
                                            <AlertCircle className="text-slate-400" />
                                            <span className="text-xs text-slate-400">Signal Lost</span>
                                        </div>
                                    )}
                                </div>

                                {/* Controls Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                                    <div className="flex justify-between items-end">
                                        <div>
                                            <div className="text-xs text-slate-300">{session.exam}</div>
                                            <div className="h-1 w-24 bg-slate-700 rounded-full mt-1 overflow-hidden">
                                                <div className="h-full bg-emerald-500" style={{ width: `${session.progress}%` }}></div>
                                            </div>
                                        </div>
                                        <button className="p-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors">
                                            <MoreVertical size={16} />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            )}
        </AdvancedModuleLayout>
    );
}

function CalendarIcon({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
            <line x1="16" x2="16" y1="2" y2="6" />
            <line x1="8" x2="8" y1="2" y2="6" />
            <line x1="3" x2="21" y1="10" y2="10" />
        </svg>
    )
}
