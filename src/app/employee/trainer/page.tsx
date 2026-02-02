
"use client";

import DashboardLayout from '@/components/dashboard/DashboardLayout';
import StatsCard from '@/components/dashboard/StatsCard';
import { Users, Clock, BookOpen, AlertCircle } from 'lucide-react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';

const BATCH_PERFORMANCE = [
    { name: 'Batch A', score: 85 },
    { name: 'Batch B', score: 72 },
    { name: 'Batch C', score: 90 },
    { name: 'Batch D', score: 65 },
];

export default function TrainerDashboard() {
    return (
        <DashboardLayout role="trainer">
            {/* Header Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard
                    title="Active Batches"
                    value="4"
                    trend="Running"
                    trendUp={true}
                    icon={BookOpen}
                    color="text-[#22d3ee]"
                />
                <StatsCard
                    title="Total Students"
                    value="125"
                    trend="In Class"
                    trendUp={true}
                    icon={Users}
                    color="text-[#d946ef]"
                />
                <StatsCard
                    title="Avg Attendance"
                    value="92%"
                    trend="-2%"
                    trendUp={false}
                    icon={Clock}
                    color="text-[#7c3aed]"
                />
                <StatsCard
                    title="Pending Tasks"
                    value="3"
                    trend="Grading"
                    trendUp={false}
                    icon={AlertCircle}
                    color="text-yellow-400"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Schedule */}
                <div className="lg:col-span-2 bg-[rgba(19,10,48,0.5)] border border-[rgba(124,58,237,0.1)] rounded-2xl p-6 backdrop-blur-md">
                    <h3 className="text-xl font-[Rajdhani] font-bold mb-6 text-white">Today's Schedule</h3>
                    <div className="space-y-4">
                        {[
                            { time: "09:00 AM - 11:00 AM", batch: "Full Stack Java - B21", topic: "Spring Boot Microservices", room: "Lab 1", status: "Completed" },
                            { time: "11:30 AM - 01:30 PM", batch: "UI/UX Design - B05", topic: "Figma Prototyping", room: "Studio A", status: "In Progress" },
                            { time: "03:00 PM - 05:00 PM", batch: "React JS - B12", topic: "Redux State Management", room: "Online", status: "Upcoming" }
                        ].map((cls, i) => (
                            <div key={i} className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-[rgba(255,255,255,0.03)] rounded-xl border border-[rgba(255,255,255,0.05)] hover:border-[#7c3aed]/30 transition-colors">
                                <div className="flex gap-4 items-center">
                                    <div className="p-3 bg-[#7c3aed]/10 rounded-lg text-[#7c3aed] font-bold font-mono text-sm whitespace-nowrap">
                                        {cls.time}
                                    </div>
                                    <div>
                                        <div className="font-bold text-white text-lg">{cls.batch}</div>
                                        <div className="text-[var(--text-dim)]">{cls.topic} • {cls.room}</div>
                                    </div>
                                </div>
                                <div className="mt-3 md:mt-0">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider 
                                        ${cls.status === 'Completed' ? 'bg-green-500/10 text-green-400' : cls.status === 'In Progress' ? 'bg-[#22d3ee]/10 text-[#22d3ee] animate-pulse' : 'bg-gray-500/20 text-gray-400'}`}>
                                        {cls.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Batch Performance */}
                <div className="bg-[rgba(19,10,48,0.5)] border border-[rgba(124,58,237,0.1)] rounded-2xl p-6 backdrop-blur-md">
                    <h3 className="text-xl font-[Rajdhani] font-bold mb-6 text-white">Batch Performance</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={BATCH_PERFORMANCE} layout="vertical">
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={true} vertical={false} />
                            <XAxis type="number" stroke="#94a3b8" />
                            <YAxis dataKey="name" type="category" stroke="#94a3b8" width={80} />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#0f0728', borderColor: '#7c3aed', color: '#fff' }}
                                cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                            />
                            <Bar dataKey="score" fill="#7c3aed" radius={[0, 4, 4, 0]} barSize={20} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </DashboardLayout>
    );
}
