
"use client";

import DashboardLayout from '@/components/dashboard/DashboardLayout';
import StatsCard from '@/components/dashboard/StatsCard';
import { PhoneCall, UserPlus, Target, MessageCircle } from 'lucide-react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';

const LEAD_SOURCE = [
    { name: 'Instagram', value: 45 },
    { name: 'Facebook', value: 30 },
    { name: 'Website', value: 60 },
    { name: 'Referral', value: 25 },
];

export default function CounselorDashboard() {
    return (
        <DashboardLayout role="counselor">
            {/* Header Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard
                    title="New Leads Today"
                    value="42"
                    trend="+5 vs yesterday"
                    trendUp={true}
                    icon={UserPlus}
                    color="text-[#22d3ee]"
                />
                <StatsCard
                    title="Calls Made"
                    value="85"
                    trend="Goal: 100"
                    trendUp={false}
                    icon={PhoneCall}
                    color="text-[#7c3aed]"
                />
                <StatsCard
                    title="Conversion Rate"
                    value="18%"
                    trend="+2%"
                    trendUp={true}
                    icon={Target}
                    color="text-emerald-400"
                />
                <StatsCard
                    title="Pending Follow-ups"
                    value="12"
                    trend="Urgent"
                    trendUp={false}
                    icon={MessageCircle}
                    color="text-[#d946ef]"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Lead Sources */}
                <div className="bg-[rgba(19,10,48,0.5)] border border-[rgba(124,58,237,0.1)] rounded-2xl p-6 backdrop-blur-md h-[400px]">
                    <h3 className="text-xl font-[Rajdhani] font-bold mb-6 text-white">Lead Sources</h3>
                    <ResponsiveContainer width="100%" height="85%">
                        <BarChart data={LEAD_SOURCE}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                            <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
                            <Tooltip
                                cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                contentStyle={{ backgroundColor: '#0f0728', borderColor: '#7c3aed', color: '#fff' }}
                            />
                            <Bar dataKey="value" fill="#d946ef" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Follow Ups */}
                <div className="lg:col-span-2 bg-[rgba(19,10,48,0.5)] border border-[rgba(124,58,237,0.1)] rounded-2xl p-6 backdrop-blur-md">
                    <h3 className="text-xl font-[Rajdhani] font-bold mb-6 text-white">Priority Follow-ups</h3>
                    <div className="space-y-4">
                        {[
                            { name: "Rahul Verma", interest: "Data Science", status: "Interested", lastCall: "2 days ago", action: "Call Now" },
                            { name: "Sneha Reddy", interest: "Full Stack Java", status: "Negotiating", lastCall: "Yesterday", action: "Send Offer" },
                            { name: "Amit Kumar", interest: "DevOps", status: "Callback Requested", lastCall: "Today 10 AM", action: "Call Now" },
                            { name: "Priya Singh", interest: "UI/UX", status: "Enquiry", lastCall: "New Lead", action: "First Contact" },
                        ].map((lead, i) => (
                            <div key={i} className="flex items-center justify-between p-4 bg-[rgba(255,255,255,0.03)] rounded-xl border border-[rgba(255,255,255,0.05)] hover:border-[#22d3ee]/30 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#7c3aed] to-[#22d3ee] flex items-center justify-center text-white font-bold text-xs uppercase">
                                        {lead.name.slice(0, 2)}
                                    </div>
                                    <div>
                                        <div className="font-bold text-white">{lead.name}</div>
                                        <div className="text-xs text-[var(--text-dim)]">{lead.interest} • {lead.status}</div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <button className="px-4 py-2 bg-[#7c3aed] hover:bg-[#6d28d9] text-white text-xs font-bold rounded-lg transition-colors shadow-[0_0_10px_rgba(124,58,237,0.3)]">
                                        {lead.action}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
