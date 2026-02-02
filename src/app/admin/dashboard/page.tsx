
"use client";

import DashboardLayout from '@/components/dashboard/DashboardLayout';
import StatsCard from '@/components/dashboard/StatsCard';
import { Users, BookOpen, Calendar, Wallet } from 'lucide-react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';

const ATTENDANCE_DATA = [
    { name: 'Mon', value: 92 },
    { name: 'Tue', value: 88 },
    { name: 'Wed', value: 95 },
    { name: 'Thu', value: 89 },
    { name: 'Fri', value: 85 },
    { name: 'Sat', value: 70 },
];

export default function AdminDashboard() {
    return (
        <DashboardLayout role="admin">
            {/* Header Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard
                    title="Active Students"
                    value="850"
                    trend="15 this week"
                    trendUp={true}
                    icon={Users}
                    color="text-[#22d3ee]"
                />
                <StatsCard
                    title="Running Batches"
                    value="24"
                    trend="2 new"
                    trendUp={true}
                    icon={BookOpen}
                    color="text-[#d946ef]"
                />
                <StatsCard
                    title="Daily Attendance"
                    value="88%"
                    trend="2%"
                    trendUp={false}
                    icon={Calendar}
                    color="text-[#7c3aed]"
                />
                <StatsCard
                    title="Today's Collection"
                    value="$15k"
                    trend="Target: $20k"
                    trendUp={true}
                    icon={Wallet}
                    color="text-emerald-400"
                />
            </div>

            {/* Charts & Split Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Attendance Chart */}
                <div className="lg:col-span-2 bg-[rgba(19,10,48,0.5)] border border-[rgba(124,58,237,0.1)] rounded-2xl p-6 backdrop-blur-md h-[400px]">
                    <h3 className="text-xl font-[Rajdhani] font-bold mb-6 text-white">Weekly Attendance Trends</h3>
                    <ResponsiveContainer width="100%" height="85%">
                        <AreaChart data={ATTENDANCE_DATA}>
                            <defs>
                                <linearGradient id="colorAttendance" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="#22d3ee" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                            <XAxis dataKey="name" stroke="#94a3b8" />
                            <YAxis stroke="#94a3b8" />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#0f0728', borderColor: '#22d3ee', color: '#fff' }}
                            />
                            <Area type="monotone" dataKey="value" stroke="#22d3ee" fillOpacity={1} fill="url(#colorAttendance)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                {/* Faculty Availability / Info */}
                <div className="bg-[rgba(19,10,48,0.5)] border border-[rgba(124,58,237,0.1)] rounded-2xl p-6 backdrop-blur-md space-y-4">
                    <h3 className="text-xl font-[Rajdhani] font-bold mb-4 text-white">Faculty Status</h3>
                    {[
                        { name: "Sarah Connor", subject: "React JS", status: "In Class", time: "10:00 - 12:00" },
                        { name: "John Doe", subject: "Python", status: "Available", time: "Next: 02:00 PM" },
                        { name: "Jane Smith", subject: "DevOps", status: "On Leave", time: "Back Tomorrow" },
                    ].map((faculty, i) => (
                        <div key={i} className="bg-[rgba(255,255,255,0.03)] p-4 rounded-xl flex items-center justify-between border border-[rgba(255,255,255,0.05)]">
                            <div>
                                <div className="font-bold text-white">{faculty.name}</div>
                                <div className="text-xs text-[var(--text-dim)]">{faculty.subject}</div>
                            </div>
                            <div className="text-right">
                                <div className={`text-sm font-bold ${faculty.status === 'Available' ? 'text-green-400' : faculty.status === 'In Class' ? 'text-yellow-400' : 'text-red-400'}`}>
                                    {faculty.status}
                                </div>
                                <div className="text-xs text-[var(--text-dim)]">{faculty.time}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Student Enrollment Table */}
            <div className="bg-[rgba(19,10,48,0.5)] border border-[rgba(124,58,237,0.1)] rounded-2xl p-6 backdrop-blur-md">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-[Rajdhani] font-bold text-white">Recent Enrollments</h3>
                    <button className="text-xs text-[#d946ef] border border-[#d946ef] px-3 py-1 rounded hover:bg-[#d946ef] hover:text-white transition-colors">
                        View All
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="text-[var(--text-dim)] border-b border-[rgba(255,255,255,0.05)] text-sm uppercase">
                                <th className="p-4">Student ID</th>
                                <th className="p-4">Name</th>
                                <th className="p-4">Course</th>
                                <th className="p-4">Date</th>
                                <th className="p-4">Fee Status</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm">
                            {[1, 2, 3].map((i) => (
                                <tr key={i} className="border-b border-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.02)] transition-colors">
                                    <td className="p-4 font-mono text-[#22d3ee]">STU-2024-00{i}</td>
                                    <td className="p-4 text-white font-medium">Student Name {i}</td>
                                    <td className="p-4 text-[var(--text-dim)]">Full Stack Java</td>
                                    <td className="p-4 text-[var(--text-dim)]">Jan 30, 2024</td>
                                    <td className="p-4">
                                        <span className="px-2 py-1 rounded-full text-xs font-bold bg-green-500/10 text-green-400">PAID</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </DashboardLayout>
    );
}
