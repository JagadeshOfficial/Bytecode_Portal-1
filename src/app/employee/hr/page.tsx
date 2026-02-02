
"use client";

import DashboardLayout from '@/components/dashboard/DashboardLayout';
import StatsCard from '@/components/dashboard/StatsCard';
import { Briefcase, Building2, UserCheck, Calendar } from 'lucide-react';
import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    ResponsiveContainer
} from 'recharts';

const PLACEMENT_DATA = [
    { name: 'Placed', value: 450 },
    { name: 'Ready', value: 120 },
    { name: 'Training', value: 300 },
];

const COLORS = ['#10b981', '#22d3ee', '#7c3aed'];

export default function HRDashboard() {
    return (
        <DashboardLayout role="hr">
            {/* Header Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard
                    title="Students Placed"
                    value="450"
                    trend="+45 this month"
                    trendUp={true}
                    icon={UserCheck}
                    color="text-emerald-400"
                />
                <StatsCard
                    title="Active Companies"
                    value="85"
                    trend="+12 this week"
                    trendUp={true}
                    icon={Building2}
                    color="text-[#22d3ee]"
                />
                <StatsCard
                    title="Open Positions"
                    value="120"
                    trend="Urgent"
                    trendUp={true}
                    icon={Briefcase}
                    color="text-[#d946ef]"
                />
                <StatsCard
                    title="Interviews Today"
                    value="18"
                    trend="Scheduled"
                    trendUp={true}
                    icon={Calendar}
                    color="text-[#7c3aed]"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Placement Funnel */}
                <div className="bg-[rgba(19,10,48,0.5)] border border-[rgba(124,58,237,0.1)] rounded-2xl p-6 backdrop-blur-md h-[400px]">
                    <h3 className="text-xl font-[Rajdhani] font-bold mb-6 text-white">Student Placement Status</h3>
                    <ResponsiveContainer width="100%" height="85%">
                        <PieChart>
                            <Pie
                                data={PLACEMENT_DATA}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={100}
                                fill="#8884d8"
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {PLACEMENT_DATA.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{ backgroundColor: '#0f0728', borderColor: '#7c3aed', color: '#fff' }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                    <div className="flex justify-center gap-4 text-xs font-bold mt-[-20px]">
                        {PLACEMENT_DATA.map((entry, index) => (
                            <div key={index} className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index] }}></div>
                                <span className="text-white">{entry.name}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Upcoming Interviews */}
                <div className="lg:col-span-2 bg-[rgba(19,10,48,0.5)] border border-[rgba(124,58,237,0.1)] rounded-2xl p-6 backdrop-blur-md">
                    <h3 className="text-xl font-[Rajdhani] font-bold mb-6 text-white">Interview Schedule</h3>
                    <div className="space-y-4">
                        {[
                            { company: "Google", role: "Software Engineer", time: "10:30 AM", candidate: "Michael Scott", status: "In Progress" },
                            { company: "Amazon", role: "Cloud Associate", time: "02:00 PM", candidate: "Dwight Schrute", status: "Scheduled" },
                            { company: "TCS", role: "Java Developer", time: "04:15 PM", candidate: "Jim Halpert", status: "Scheduled" },
                            { company: "Infosys", role: "System Engineer", time: "05:00 PM", candidate: "Pam Beesly", status: "Pending Confirmation" },
                        ].map((int, i) => (
                            <div key={i} className="flex items-center justify-between p-4 bg-[rgba(255,255,255,0.03)] rounded-xl border border-[rgba(255,255,255,0.05)]">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-black font-bold text-xs uppercase">
                                        {int.company.slice(0, 2)}
                                    </div>
                                    <div>
                                        <div className="font-bold text-white">{int.company} - <span className="text-[#22d3ee]">{int.role}</span></div>
                                        <div className="text-xs text-[var(--text-dim)]">Candidate: {int.candidate}</div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="font-mono text-[#d946ef]">{int.time}</div>
                                    <div className={`text-xs ${int.status === 'In Progress' ? 'text-yellow-400 animate-pulse' : 'text-[var(--text-dim)]'}`}>{int.status}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
