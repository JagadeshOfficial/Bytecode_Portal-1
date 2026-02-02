
"use client";

import DashboardLayout from '@/components/dashboard/DashboardLayout';
import StatsCard from '@/components/dashboard/StatsCard';
import { BookOpen, Award, FileText, PlayCircle } from 'lucide-react';
import {
    RadialBarChart,
    RadialBar,
    Legend,
    ResponsiveContainer,
    Tooltip
} from 'recharts';

const PROGRESS_DATA = [
    { name: 'Assignments', uv: 80, fill: '#7c3aed' },
    { name: 'Quizzes', uv: 90, fill: '#d946ef' },
    { name: 'Attendance', uv: 95, fill: '#22d3ee' },
    { name: 'Course', uv: 65, fill: '#10b981' }
];

export default function StudentDashboard() {
    return (
        <DashboardLayout role="student">
            {/* Header Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard
                    title="Course Progress"
                    value="65%"
                    trend="On Track"
                    trendUp={true}
                    icon={BookOpen}
                    color="text-[#7c3aed]"
                />
                <StatsCard
                    title="Assignments"
                    value="12/15"
                    trend="Submited"
                    trendUp={true}
                    icon={FileText}
                    color="text-[#22d3ee]"
                />
                <StatsCard
                    title="Attendance"
                    value="95%"
                    trend="Excellent"
                    trendUp={true}
                    icon={Award}
                    color="text-emerald-400"
                />
                <StatsCard
                    title="Next Class"
                    value="2 PM"
                    trend="React JS"
                    trendUp={false}
                    icon={PlayCircle}
                    color="text-[#d946ef]"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Learning Progress */}
                <div className="lg:col-span-2 bg-[rgba(19,10,48,0.5)] border border-[rgba(124,58,237,0.1)] rounded-2xl p-6 backdrop-blur-md">
                    <h3 className="text-xl font-[Rajdhani] font-bold mb-6 text-white">Continue Learning</h3>

                    <div className="space-y-6">
                        {/* Course Card */}
                        <div className="p-4 rounded-xl bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.05)] hover:border-[#7c3aed] transition-all group cursor-pointer">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex gap-4">
                                    <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-[#7c3aed] to-[#d946ef] flex items-center justify-center text-2xl">⚛️</div>
                                    <div>
                                        <h4 className="text-xl font-bold text-white group-hover:text-[#22d3ee] transition-colors">Full Stack React Development</h4>
                                        <p className="text-sm text-[var(--text-dim)]">Module 4: Advanced Hooks & Context API</p>
                                    </div>
                                </div>
                                <button className="px-4 py-2 bg-[#7c3aed] text-white rounded-lg text-sm font-bold shadow-[0_0_15px_rgba(124,58,237,0.4)] group-hover:bg-[#d946ef] transition-all">
                                    Resume
                                </button>
                            </div>
                            {/* Progress Bar */}
                            <div className="w-full h-2 bg-[rgba(255,255,255,0.1)] rounded-full overflow-hidden">
                                <div className="h-full bg-gradient-to-r from-[#7c3aed] to-[#22d3ee] w-[65%]"></div>
                            </div>
                            <div className="flex justify-between mt-2 text-xs text-[var(--text-dim)]">
                                <span>65% Completed</span>
                                <span>24/40 Lessons</span>
                            </div>
                        </div>

                        {/* Recent Lessons */}
                        <div>
                            <h4 className="text-sm font-bold text-[var(--text-dim)] uppercase tracking-wider mb-3">Up Next</h4>
                            <div className="space-y-3">
                                <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-[rgba(255,255,255,0.02)] transition-colors">
                                    <PlayCircle className="w-5 h-5 text-[#22d3ee]" />
                                    <span className="text-white text-sm">Building Custom Hooks</span>
                                    <span className="ml-auto text-xs text-[var(--text-dim)]">15 mins</span>
                                </div>
                                <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-[rgba(255,255,255,0.02)] transition-colors">
                                    <FileText className="w-5 h-5 text-[#d946ef]" />
                                    <span className="text-white text-sm">Assignment: Todo App Optimization</span>
                                    <span className="ml-auto text-xs text-[var(--text-dim)]">Due Tomorrow</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Performance Stats */}
                <div className="bg-[rgba(19,10,48,0.5)] border border-[rgba(124,58,237,0.1)] rounded-2xl p-6 backdrop-blur-md h-[400px]">
                    <h3 className="text-xl font-[Rajdhani] font-bold mb-6 text-white">Performance Metrics</h3>
                    <ResponsiveContainer width="100%" height="85%">
                        <RadialBarChart cx="50%" cy="50%" innerRadius="10%" outerRadius="80%" barSize={10} data={PROGRESS_DATA}>
                            <RadialBar
                                label={{ position: 'insideStart', fill: '#fff' }}
                                background
                                dataKey="uv"
                            />
                            <Legend iconSize={10} layout="vertical" verticalAlign="middle" wrapperStyle={{ right: 0 }} />
                            <Tooltip contentStyle={{ backgroundColor: '#0f0728', borderColor: '#7c3aed', color: '#fff' }} />
                        </RadialBarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </DashboardLayout>
    );
}
