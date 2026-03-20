
"use client";

import DashboardLayout from '@/components/dashboard/DashboardLayout';
import StatsCard from '@/components/dashboard/StatsCard';
import { DollarSign, FileText, AlertTriangle, CreditCard } from 'lucide-react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';

const COLLECTION_DATA = [
    { name: 'Week 1', value: 12000 },
    { name: 'Week 2', value: 15000 },
    { name: 'Week 3', value: 11000 },
    { name: 'Week 4', value: 18000 },
];

export default function FinanceDashboard() {
    return (
        <DashboardLayout role="finance">
            {/* Header Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard
                    title="Total Collections"
                    value="$56,000"
                    trend="This Month"
                    trendUp={true}
                    icon={DollarSign}
                    color="text-emerald-400"
                />
                <StatsCard
                    title="Pending Dues"
                    value="$12,500"
                    trend="Overdue > 7 days"
                    trendUp={false}
                    icon={AlertTriangle}
                    color="text-red-400"
                />
                <StatsCard
                    title="Invoices Generated"
                    value="145"
                    trend="+12 today"
                    trendUp={true}
                    icon={FileText}
                    color="text-[#22d3ee]"
                />
                <StatsCard
                    title="Refund Requests"
                    value="2"
                    trend="Requires Approval"
                    trendUp={false}
                    icon={CreditCard}
                    color="text-yellow-400"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Revenue Trend */}
                <div className="lg:col-span-2 bg-[rgba(19,10,48,0.5)] border border-[rgba(124,58,237,0.1)] rounded-2xl p-6 backdrop-blur-md h-[400px]">
                    <h3 className="text-xl font-[Rajdhani] font-bold mb-6 text-white">Monthly Collection Trend</h3>
                    <ResponsiveContainer width="100%" height="85%">
                        <AreaChart data={COLLECTION_DATA}>
                            <defs>
                                <linearGradient id="colorCollection" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                            <XAxis dataKey="name" stroke="#94a3b8" />
                            <YAxis stroke="#94a3b8" />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#0f0728', borderColor: '#10b981', color: '#fff' }}
                            />
                            <Area type="monotone" dataKey="value" stroke="#10b981" fillOpacity={1} fill="url(#colorCollection)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                {/* Pending Dues List */}
                <div className="bg-[rgba(19,10,48,0.5)] border border-[rgba(124,58,237,0.1)] rounded-2xl p-6 backdrop-blur-md">
                    <h3 className="text-xl font-[Rajdhani] font-bold mb-6 text-white">Pending Dues</h3>
                    <div className="space-y-4">
                        {[
                            { name: "John Smith", amount: "$500", due: "5 Days ago", course: "Java Full Stack" },
                            { name: "Emily Davis", amount: "$300", due: "2 Days ago", course: "UI/UX Design" },
                            { name: "Michael Brown", amount: "$750", due: "Today", course: "Data Science" },
                        ].map((item, i) => (
                            <div key={i} className="flex items-center justify-between p-4 bg-[rgba(255,255,255,0.03)] rounded-xl border border-[rgba(255,255,255,0.05)] border-l-4 border-l-red-500">
                                <div>
                                    <div className="font-bold text-white">{item.name}</div>
                                    <div className="text-xs text-[var(--text-dim)]">{item.course}</div>
                                </div>
                                <div className="text-right">
                                    <div className="font-bold text-red-400">{item.amount}</div>
                                    <div className="text-xs text-[var(--text-dim)]">{item.due}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button className="w-full mt-4 py-2 rounded-lg bg-[rgba(124,58,237,0.1)] text-[#7c3aed] text-sm font-bold hover:bg-[#7c3aed] hover:text-white transition-all">
                        Send Reminders
                    </button>
                </div>
            </div>
        </DashboardLayout>
    );
}
