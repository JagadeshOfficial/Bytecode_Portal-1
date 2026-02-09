"use client";

import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { motion } from 'framer-motion';
import {
    Users,
    Handshake,
    Target,
    PhoneCall,
    TrendingUp,
    Building,
    FileText,
    CheckCircle2,
    Clock,
    UserPlus,
    BarChart
} from 'lucide-react';

const LEADS = [
    { id: 1, name: "Amazon India", type: "Corporate", status: "Negotiation", value: "₹25,00,000", owner: "BDM - Rajesh" },
    { id: 2, name: "Suresh Kumar", type: "Student Portfolio", status: "Interested", value: "₹45,000", owner: "BDE - Anita" },
    { id: 3, name: "TCS Hiring Partnership", type: "Corporate", status: "MoU Signed", value: "N/A", owner: "BDM - Rajesh" },
];

const EMPLOYEES = [
    { name: "John Doe", role: "Sr. Trainer", status: "Active", attendance: "98%", task: "React Curriculum" },
    { name: "Sarah Smith", role: "BDM", status: "In Field", attendance: "95%", task: "Client Meeting" },
    { name: "Mike Ross", role: "Counselor", status: "On Leave", attendance: "88%", task: "Lead Follow-up" },
];

export default function BusinessModule() {
    return (
        <DashboardLayout role="admin">
            <div className="flex flex-col gap-8">
                {/* Header */}
                <div className="flex justify-between items-end">
                    <div>
                        <h1 className="text-3xl font-[Rajdhani] font-bold text-white tracking-widest">
                            Business & <span className="text-[#d946ef]">Operations</span>
                        </h1>
                        <p className="text-[var(--text-dim)]">Unified BDM, BDE & Employee Management</p>
                    </div>
                    <div className="flex gap-3">
                        <button className="flex items-center gap-2 px-4 py-2 bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-xl text-white font-bold hover:bg-[rgba(255,255,255,0.1)] transition-all">
                            <FileText className="w-4 h-4" /> Reports
                        </button>
                        <button className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-[#7c3aed] to-[#d946ef] rounded-xl text-white font-bold shadow-lg hover:scale-105 transition-all">
                            <UserPlus className="w-4 h-4" /> Add Employee
                        </button>
                    </div>
                </div>

                {/* Dashboard Snapshot */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                        { label: "Total Leads", value: "452", trend: "+12%", icon: Target, color: "text-[#7c3aed]" },
                        { label: "Corp. Tie-ups", value: "24", trend: "+2", icon: Handshake, color: "text-[#22d3ee]" },
                        { label: "Active Employees", value: "42", trend: "Steady", icon: Users, color: "text-emerald-400" },
                        { label: "Revenue (M)", value: "₹4.2M", trend: "+8%", icon: TrendingUp, color: "text-[#d946ef]" },
                    ].map((stat, idx) => (
                        <div key={idx} className="bg-[rgba(19,10,48,0.5)] border border-[rgba(124,58,237,0.1)] rounded-2xl p-6 backdrop-blur-md">
                            <div className="flex justify-between items-center mb-4">
                                <stat.icon className={`w-6 h-6 ${stat.color}`} />
                                <span className="text-xs font-bold text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full">{stat.trend}</span>
                            </div>
                            <div className="text-3xl font-bold text-white font-[Rajdhani]">{stat.value}</div>
                            <div className="text-xs text-[var(--text-dim)] uppercase tracking-wider font-bold mt-1">{stat.label}</div>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Leads Management (BDM/BDE) */}
                    <div className="lg:col-span-2 flex flex-col gap-6">
                        <div className="bg-[rgba(19,10,48,0.5)] border border-[rgba(124,58,237,0.1)] rounded-2xl overflow-hidden">
                            <div className="p-6 border-b border-[rgba(255,255,255,0.05)] flex justify-between items-center bg-[rgba(255,255,255,0.02)]">
                                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                    <PhoneCall className="w-5 h-5 text-[#22d3ee]" />
                                    Lead Pipeline (BDM/BDE)
                                </h3>
                                <button className="text-[10px] text-[#22d3ee] font-bold uppercase tracking-widest">View Pipeline view</button>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="border-b border-[rgba(255,255,255,0.05)]">
                                            <th className="p-4 text-xs font-bold text-[var(--text-dim)] uppercase">Entity Name</th>
                                            <th className="p-4 text-xs font-bold text-[var(--text-dim)] uppercase">Type</th>
                                            <th className="p-4 text-xs font-bold text-[var(--text-dim)] uppercase">Status</th>
                                            <th className="p-4 text-xs font-bold text-[var(--text-dim)] uppercase">Est. Value</th>
                                            <th className="p-4 text-xs font-bold text-[var(--text-dim)] uppercase">Owner</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {LEADS.map((lead) => (
                                            <tr key={lead.id} className="border-b border-[rgba(255,255,255,0.02)] hover:bg-[rgba(255,255,255,0.02)] transition-colors">
                                                <td className="p-4">
                                                    <div className="font-bold text-white">{lead.name}</div>
                                                </td>
                                                <td className="p-4">
                                                    <span className="text-sm text-[var(--text-dim)]">{lead.type}</span>
                                                </td>
                                                <td className="p-4">
                                                    <span className="px-2 py-1 rounded-lg bg-[#7c3aed]/10 text-[#7c3aed] text-[10px] font-bold border border-[#7c3aed]/20">
                                                        {lead.status}
                                                    </span>
                                                </td>
                                                <td className="p-4">
                                                    <div className="text-sm text-white font-mono">{lead.value}</div>
                                                </td>
                                                <td className="p-4">
                                                    <div className="text-sm text-[var(--text-dim)]">{lead.owner}</div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Employee Monitoring */}
                        <div className="bg-[rgba(19,10,48,0.5)] border border-[rgba(124,58,237,0.1)] rounded-2xl overflow-hidden">
                            <div className="p-6 border-b border-[rgba(255,255,255,0.05)] flex justify-between items-center bg-[rgba(255,255,255,0.02)]">
                                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                    <Users className="w-5 h-5 text-[#7c3aed]" />
                                    Staff & Operations
                                </h3>
                                <div className="flex gap-4">
                                    <div className="text-[10px] flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-emerald-400" />
                                        <span className="text-[var(--text-dim)] font-bold">ONLINE: 12</span>
                                    </div>
                                    <div className="text-[10px] flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-red-400" />
                                        <span className="text-[var(--text-dim)] font-bold">OFFLINE: 5</span>
                                    </div>
                                </div>
                            </div>
                            <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                                {EMPLOYEES.map((emp, i) => (
                                    <div key={i} className="p-4 rounded-xl bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.05)] hover:border-[#7c3aed] transition-all">
                                        <div className="flex justify-between items-start mb-3">
                                            <div>
                                                <div className="font-bold text-white">{emp.name}</div>
                                                <div className="text-[10px] text-[var(--accent)] font-bold uppercase">{emp.role}</div>
                                            </div>
                                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#7c3aed] to-[#d946ef] flex items-center justify-center text-[10px] font-bold text-white shadow-lg">
                                                {emp.attendance}
                                            </div>
                                        </div>
                                        <div className="text-xs text-[var(--text-dim)] mb-4">
                                            Current Task: <span className="text-white">{emp.task}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className={`text-[10px] font-bold ${emp.status === 'Active' ? 'text-emerald-400' : emp.status === 'In Field' ? 'text-[#22d3ee]' : 'text-amber-400'}`}>
                                                ● {emp.status}
                                            </span>
                                            <button className="p-1 hover:bg-white/5 rounded transition-all">
                                                <BarChart className="w-4 h-4 text-[var(--text-dim)]" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Side: Quick Actions & Financials */}
                    <div className="flex flex-col gap-8">
                        {/* Attendance Tracker */}
                        <div className="bg-[rgba(19,10,48,0.5)] border border-[rgba(217,70,239,0.1)] rounded-2xl p-6 backdrop-blur-md">
                            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                                <Clock className="w-5 h-5 text-[#d946ef]" />
                                My Actions
                            </h3>
                            <div className="space-y-4">
                                <button className="w-full py-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 font-bold hover:bg-emerald-500 hover:text-white transition-all">
                                    Daily Check-In
                                </button>
                                <div className="grid grid-cols-2 gap-4">
                                    <button className="py-3 bg-white/5 border border-white/10 rounded-xl text-white text-xs font-bold hover:bg-white/10 transition-all">
                                        Apply Leave
                                    </button>
                                    <button className="py-3 bg-white/5 border border-white/10 rounded-xl text-white text-xs font-bold hover:bg-white/10 transition-all">
                                        View Payslip
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Recent Corporate Ties */}
                        <div className="bg-[rgba(19,10,48,0.5)] border border-[rgba(34,211,238,0.1)] rounded-2xl p-6 backdrop-blur-md relative overflow-hidden">
                            <h3 className="text-lg font-bold text-white mb-4">Recent Corporate Partnerships</h3>
                            <div className="space-y-4">
                                {[
                                    { name: "Cognizant", date: "2 days ago", type: "Hiring MoU" },
                                    { name: "HCL Tech", date: "1 week ago", type: "Skill Hub" },
                                    { name: "Wipro", date: "3 days ago", type: "Campus Drive" },
                                ].map((corp, i) => (
                                    <div key={i} className="flex gap-4 p-3 rounded-lg hover:bg-white/5 transition-all group cursor-pointer">
                                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#22d3ee]/20 to-[#7c3aed]/20 flex items-center justify-center border border-white/10">
                                            <Building className="w-5 h-5 text-[#22d3ee]" />
                                        </div>
                                        <div>
                                            <div className="text-sm font-bold text-white group-hover:text-[#22d3ee] transition-colors">{corp.name}</div>
                                            <div className="text-[10px] text-[var(--text-dim)]">{corp.type} • {corp.date}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <button className="w-full mt-6 py-3 border border-[rgba(124,58,237,0.3)] rounded-xl text-white text-xs font-bold hover:bg-[#7c3aed] transition-all">
                                Add Partnership
                            </button>
                        </div>

                        {/* Task Progress */}
                        <div className="bg-[rgba(19,10,48,0.5)] border border-[rgba(255,255,255,0.05)] rounded-2xl p-6 backdrop-blur-md">
                            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                                Operations Health
                            </h3>
                            <div className="space-y-4">
                                <div>
                                    <div className="flex justify-between text-[10px] font-bold text-[var(--text-dim)] mb-1 uppercase">Student Admissions</div>
                                    <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                                        <div className="h-full bg-gradient-to-r from-[#7c3aed] to-[#22d3ee] w-[75%]" />
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between text-[10px] font-bold text-[var(--text-dim)] mb-1 uppercase">Corporate Leads</div>
                                    <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                                        <div className="h-full bg-gradient-to-r from-[#22d3ee] to-emerald-400 w-[45%]" />
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between text-[10px] font-bold text-[var(--text-dim)] mb-1 uppercase">Placement Revenue</div>
                                    <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                                        <div className="h-full bg-gradient-to-r from-[#d946ef] to-[#7c3aed] w-[90%]" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
