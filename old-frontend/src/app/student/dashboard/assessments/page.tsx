"use client";

import { useState } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { motion, AnimatePresence } from 'framer-motion';
import {
    CheckCircle2,
    Clock,
    Award,
    BarChart3,
    TrendingUp,
    FileText,
    ChevronRight,
    Search,
    Filter,
    ArrowUpRight,
    Zap,
    History,
    Target,
    Activity,
    Calendar,
    PenTool
} from 'lucide-react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
    Cell
} from 'recharts';

const PERFORMANCE_DATA = [
    { name: 'Test 1', score: 65, avg: 60 },
    { name: 'Test 2', score: 72, avg: 62 },
    { name: 'Test 3', score: 68, avg: 64 },
    { name: 'Test 4', score: 85, avg: 65 },
    { name: 'Test 5', score: 82, avg: 68 },
    { name: 'Test 6', score: 90, avg: 70 },
];

const SKILL_RADAR = [
    { skill: 'Aptitude', val: 85 },
    { skill: 'Coding', val: 78 },
    { skill: 'Logical', val: 92 },
    { skill: 'Verbal', val: 65 },
    { skill: 'Domain', val: 80 },
];

const UPCOMING_TESTS = [
    { title: "Weekly Coding Challenge #4", subject: "Full Stack Development", date: "Feb 12", time: "06:00 PM", duration: "90m", type: "Coding" },
    { title: "End-Module Aptitude Test", subject: "Placement Ready", date: "Feb 15", time: "10:00 AM", duration: "60m", type: "MCQ" },
];

const PAST_RESULTS = [
    { title: "React Architecture Quiz", score: 94, total: 100, date: "Feb 05", status: "A+" },
    { title: "Node.js Basics Test", score: 78, total: 100, date: "Jan 28", status: "B" },
    { title: "Cloud Fundamentals", score: 85, total: 100, date: "Jan 15", status: "A" },
];

export default function StudentAssessmentsPage() {
    const [activeTab, setActiveTab] = useState('overview');

    return (
        <DashboardLayout role="student">
            <div className="flex flex-col gap-8 pb-10">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                        <h1 className="text-4xl font-display font-bold text-white tracking-tight uppercase">
                            Assessment <span className="text-[#d946ef]">Engine</span>
                        </h1>
                        <p className="text-slate-400 font-medium mt-1">Track your growth, take objective tests, and analyze performance with precision analytics.</p>
                    </div>
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                        { label: "Overall Rank", value: "#14", trend: "Top 2% in Batch", icon: Target, color: "text-[#d946ef]", bg: "bg-[#d946ef]/10" },
                        { label: "Tests Taken", value: "24", trend: "+3 this month", icon: Activity, color: "text-blue-400", bg: "bg-blue-500/10" },
                        { label: "Avg. Accuracy", value: "88%", trend: "+2.4% Growth", icon: TrendingUp, color: "text-emerald-400", bg: "bg-emerald-500/10" },
                        { label: "Strengths", value: "Logical", trend: "92th Percentile", icon: Award, color: "text-amber-400", bg: "bg-amber-500/10" },
                    ].map((stat, idx) => (
                        <div key={idx} className={`${stat.bg} border border-white/5 rounded-3xl p-6 backdrop-blur-xl group hover:border-white/20 transition-all cursor-pointer shadow-lg shadow-black/20`}>
                            <div className="flex justify-between items-start mb-4">
                                <div className={`p-3 rounded-2xl bg-[#0a0a1a]/80 ${stat.color} shadow-lg shadow-black/40`}>
                                    <stat.icon className="w-5 h-5" />
                                </div>
                                <ArrowUpRight className="text-slate-600 group-hover:text-white transition-colors" size={18} />
                            </div>
                            <div className="text-3xl font-bold text-white mb-1 tracking-tight">{stat.value}</div>
                            <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{stat.label}</div>
                            <div className={`mt-3 text-[10px] font-bold ${stat.color}`}>{stat.trend}</div>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Charts & Analytics */}
                    <div className="lg:col-span-2 flex flex-col gap-8">
                        <div className="bg-[#0a0a1a]/60 border border-white/5 rounded-[2.5rem] p-8 backdrop-blur-xl relative overflow-hidden h-[450px]">
                            <div className="flex justify-between items-center mb-10 relative z-10">
                                <div>
                                    <h3 className="text-2xl font-bold text-white tracking-tight uppercase">Performance Trajectory</h3>
                                    <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Consistency vs Batch Average</p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-[#d946ef]" />
                                        <span className="text-[10px] font-black text-slate-500 uppercase">MY SCORE</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-slate-700" />
                                        <span className="text-[10px] font-black text-slate-500 uppercase">BATCH AVG</span>
                                    </div>
                                </div>
                            </div>

                            <div className="h-[300px] w-full relative z-10">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={PERFORMANCE_DATA}>
                                        <defs>
                                            <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#d946ef" stopOpacity={0.3} />
                                                <stop offset="95%" stopColor="#d946ef" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                                        <XAxis
                                            dataKey="name"
                                            stroke="#64748b"
                                            fontSize={10}
                                            tickLine={false}
                                            axisLine={false}
                                            dy={10}
                                        />
                                        <YAxis
                                            stroke="#64748b"
                                            fontSize={10}
                                            tickLine={false}
                                            axisLine={false}
                                            dx={-10}
                                        />
                                        <Tooltip
                                            contentStyle={{ backgroundColor: '#0a0a1a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                                            itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                                        />
                                        <Area
                                            type="monotone"
                                            dataKey="avg"
                                            stroke="rgba(255,255,255,0.1)"
                                            strokeWidth={2}
                                            fill="transparent"
                                        />
                                        <Area
                                            type="monotone"
                                            dataKey="score"
                                            stroke="#d946ef"
                                            strokeWidth={4}
                                            fillOpacity={1}
                                            fill="url(#colorScore)"
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Recent Results List */}
                        <div className="bg-[#0a0a1a]/60 border border-white/5 rounded-[2.5rem] p-8 backdrop-blur-xl">
                            <h3 className="text-xl font-bold text-white mb-8 flex items-center gap-3">
                                <History className="text-[#d946ef]" size={24} />
                                Past Performance Records
                            </h3>
                            <div className="space-y-4">
                                {PAST_RESULTS.map((res, i) => (
                                    <div key={i} className="flex items-center justify-between p-5 bg-white/[0.02] border border-white/5 rounded-2xl group hover:border-[#d946ef]/30 transition-all cursor-pointer">
                                        <div className="flex items-center gap-6">
                                            <div className="w-14 h-14 rounded-2xl bg-[#0a0a1a] border border-white/10 flex items-center justify-center text-xl font-black text-[#d946ef] group-hover:scale-110 transition-transform shadow-xl">
                                                {res.status}
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-white text-base group-hover:text-[#d946ef] transition-colors uppercase tracking-tight">{res.title}</h4>
                                                <div className="text-[10px] text-slate-500 font-bold uppercase mt-1">{res.date} • {res.score}/{res.total} Points</div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <button className="flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black text-slate-400 hover:text-white hover:bg-[#d946ef] transition-all uppercase tracking-widest">VIEW SCORECARD</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Sidebar */}
                    <div className="flex flex-col gap-8">
                        {/* Start New Test CTA */}
                        <div className="p-8 bg-gradient-to-br from-[#d946ef] to-[#7c3aed] rounded-[2.5rem] shadow-2xl shadow-[#d946ef]/20 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-6 opacity-20 group-hover:scale-125 transition-transform duration-700">
                                <PenTool size={80} />
                            </div>
                            <div className="relative z-10">
                                <h3 className="text-2xl font-black text-white uppercase tracking-tight leading-tight mb-2">Ready to <br />Level Up?</h3>
                                <p className="text-white/80 font-medium text-xs mb-8">Take a proctored assessment to boost your placement readiness score.</p>
                                <button className="w-full py-4 bg-white text-black font-black text-xs tracking-[0.2em] rounded-2xl shadow-xl hover:scale-105 transition-all uppercase">START PRACTICE TEST</button>
                            </div>
                        </div>

                        {/* Upcoming Schedule */}
                        <div className="bg-[#0a0a1a]/60 border border-white/5 rounded-[2.5rem] p-8 backdrop-blur-xl">
                            <h3 className="text-xl font-bold text-white mb-8 flex items-center gap-3 uppercase tracking-tight">
                                <Calendar className="text-blue-400" size={24} />
                                Test Schedule
                            </h3>
                            <div className="space-y-6">
                                {UPCOMING_TESTS.map((test, i) => (
                                    <div key={i} className="flex flex-col gap-3 p-5 rounded-3xl bg-white/[0.03] border border-white/5 group hover:bg-white/[0.05] transition-all">
                                        <div className="flex justify-between items-start">
                                            <div className="p-2.5 rounded-xl bg-[#0a0a1a] border border-white/10 text-white font-black text-[10px] tracking-widest">
                                                {test.type}
                                            </div>
                                            <div className="text-[10px] font-black text-blue-400">{test.date}</div>
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors uppercase tracking-tight">{test.title}</h4>
                                            <p className="text-[10px] text-slate-500 font-bold uppercase mt-1">{test.subject}</p>
                                        </div>
                                        <div className="flex items-center justify-between mt-2 pt-4 border-t border-white/5 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                                            <span>{test.time}</span>
                                            <span>{test.duration}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <button className="w-full mt-8 py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black text-slate-500 hover:text-white hover:bg-blue-600 transition-all uppercase tracking-widest">VIEW ALL SCHEDULES</button>
                        </div>

                        {/* Domain Weakness Analysis */}
                        <div className="bg-[#0a0a1a]/40 border border-white/5 rounded-[2.5rem] p-8">
                            <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-8">Weak Area Analysis</h4>
                            <div className="space-y-6">
                                {SKILL_RADAR.map((skill, i) => (
                                    <div key={i} className="space-y-2">
                                        <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-tighter">
                                            <span>{skill.skill}</span>
                                            <span className={skill.val < 70 ? 'text-red-500' : 'text-emerald-400'}>{skill.val}%</span>
                                        </div>
                                        <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${skill.val}%` }}
                                                className={`h-full ${skill.val < 70 ? 'bg-red-500' : 'bg-emerald-400'}`}
                                            />
                                        </div>
                                    </div>
                                ))}
                                <p className="text-[10px] text-slate-600 font-medium italic mt-6 leading-relaxed">* System recommends spending 2h/day on <b>Verbal Ability</b> refinement.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
