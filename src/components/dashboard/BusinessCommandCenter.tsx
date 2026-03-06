"use client";

import { useState, useEffect } from 'react';
import AdvancedModuleLayout from '@/components/dashboard/AdvancedModuleLayout';
import api from '@/lib/api';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Briefcase,
    Building2,
    Users,
    TrendingUp,
    Clock,
    UserCheck,
    CheckCircle,
    Calendar,
    Settings,
    MoreVertical,
    FileText,
    PieChart,
    Layers,
    MoveRight,
    MapPin,
    AlertCircle,
    PhoneCall,
    MessageSquare,
    Handshake,
    DollarSign,
    Target,
    BarChart3,
    ArrowUpRight,
    Zap,
    Download,
    FileSignature,
    UserPlus,
    Activity,
    Wallet,
    LogOut,
    LogIn,
    ShieldCheck,
    FilePlus,
    UserCheck2,
    BriefcaseIcon,
    Presentation,
    LineChart,
    Search
} from 'lucide-react';
import Link from 'next/link';

interface BusinessCommandCenterProps {
    role: 'admin' | 'super_admin';
}

export default function BusinessCommandCenter({ role }: BusinessCommandCenterProps) {
    const [activeTab, setActiveTab] = useState('overview');

    const stats = [
        { label: "Total Leads", value: "2,842", icon: Target, color: "#3b82f6", trend: "+12% MoM" },
        { label: "Corp. Tie-ups", value: "48", icon: Building2, color: "#7c3aed", trend: "+2 New" },
        { label: "Attendance Today", value: "94%", icon: UserCheck, color: "#10b981", trend: "142/156" },
        { label: "Tasks Pending", value: "18", icon: Clock, color: "#f59e0b", trend: "Today" },
    ];

    const leads = [
        { name: "Google India", type: "Corporate", status: "Negotiation", value: "₹4.5L", rep: "Sarah C." },
        { name: "Rahul Deshmukh", type: "Student", status: "Follow-up", value: "₹45K", rep: "John W." },
        { name: "Zomato", type: "Hiring", status: "MoU Sent", value: "Placement", rep: "Tony S." },
        { name: "Priya Singh", type: "Student", status: "Closed", value: "₹52K", rep: "Sarah C." },
    ];

    const [backendStaff, setBackendStaff] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStaff = async () => {
            try {
                const res = await api.get('users');
                const staff = res.data.filter((u: any) => u.role !== 'STUDENT');
                setBackendStaff(staff);
                setLoading(false);
            } catch (err) {
                console.error("Failed to fetch staff:", err);
                setLoading(false);
            }
        };
        fetchStaff();
    }, []);

    const employees = backendStaff.map(s => ({
        name: s.fullName || 'Unknown',
        role: s.role,
        status: s.active ? 'In' : 'Out',
        checkIn: s.active ? '09:00 AM' : '-',
        tasks: s.role === 'ADMIN' ? '12/15' : '5/8',
        pay: 'Paid'
    })).slice(0, 4); // Limit to 4 for sidebar

    return (
        <AdvancedModuleLayout
            title={role === 'super_admin' ? "Global Business Command" : "Institute Business & Ops"}
            subtitle="Centralized management for Leads, Corporate Relations, Workforce, and Operations."
            stats={stats}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            role={role}
            tabs={[
                { id: 'overview', label: 'Overview', icon: PieChart },
                { id: 'leads', label: 'CRM & Leads', icon: Target },
                { id: 'corporate', label: 'Corporate Tech', icon: Building2 },
                { id: 'revenue', label: 'Revenue & ROI', icon: BarChart3 },
                { id: 'workforce', label: 'Workforce Hub', icon: Users },
                { id: 'hr', label: 'HR & Leaves', icon: ShieldCheck },
            ]}
        >
            {/* OVERVIEW TAB */}
            {activeTab === 'overview' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Live Operations Matrix */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="bg-[#0a0a1a]/60 border border-white/5 rounded-[2.5rem] p-8 backdrop-blur-xl relative overflow-hidden">
                            <div className="flex justify-between items-center mb-8 relative z-10">
                                <div>
                                    <h3 className="text-2xl font-black text-white uppercase tracking-tight">Today's Lead Pipeline</h3>
                                    <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Active conversions in BDM/BDE queue</p>
                                </div>
                                <div className="flex gap-2">
                                    <button className="p-3 bg-white/5 border border-white/10 rounded-xl text-blue-400 hover:text-white transition-all"><PhoneCall size={18} /></button>
                                    <button className="p-3 bg-white/5 border border-white/10 rounded-xl text-purple-400 hover:text-white transition-all"><MessageSquare size={18} /></button>
                                </div>
                            </div>

                            <div className="space-y-4">
                                {leads.map((lead, i) => (
                                    <div key={i} className="flex items-center justify-between p-5 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-blue-500/30 transition-all group">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-[#0a0a1a] border border-white/10 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
                                                {lead.type === 'Corporate' ? <Building2 size={20} /> : <Users size={20} />}
                                            </div>
                                            <div>
                                                <div className="text-sm font-black text-white uppercase group-hover:text-blue-400 transition-colors">{lead.name}</div>
                                                <div className="text-[10px] text-slate-500 font-bold uppercase mt-1 tracking-widest">{lead.type} • {lead.rep}</div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-8">
                                            <div className="text-right hidden md:block">
                                                <div className="text-xs font-black text-white">{lead.value}</div>
                                                <div className="text-[9px] text-slate-600 font-black uppercase">Revenue Potential</div>
                                            </div>
                                            <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black tracking-widest uppercase ${lead.status === 'Closed' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                                                lead.status === 'Negotiation' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' :
                                                    'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                                                }`}>
                                                {lead.status}
                                            </span>
                                            <ArrowUpRight size={16} className="text-white/10 group-hover:text-white transition-colors" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Recent Tasks */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="p-8 bg-gradient-to-br from-[#130a30] to-[#0a0a1a] border border-blue-500/20 rounded-[2.5rem] group hover:border-blue-500/40 transition-all relative overflow-hidden">
                                <Zap size={80} className="absolute -top-4 -right-4 text-blue-500/5 group-hover:scale-125 transition-transform" />
                                <h4 className="text-xl font-black text-white uppercase tracking-tight mb-2">BDM Priority Tasks</h4>
                                <div className="space-y-3 mt-6">
                                    <div className="flex items-center gap-3 text-xs text-slate-400"><CheckCircle size={14} className="text-emerald-500" /> Negotiate TCS MoU Renewal</div>
                                    <div className="flex items-center gap-3 text-xs text-slate-400"><Clock size={14} className="text-amber-500" /> Follow-up with 12 Demo Leads</div>
                                </div>
                            </div>
                            <div className="p-8 bg-gradient-to-br from-[#0c051a] to-[#030014] border border-violet-500/20 rounded-[2.5rem] group hover:border-violet-500/40 transition-all relative overflow-hidden">
                                <Activity size={80} className="absolute -top-4 -right-4 text-violet-500/5 group-hover:scale-125 transition-transform" />
                                <h4 className="text-xl font-black text-white uppercase tracking-tight mb-2">Ops Summary</h4>
                                <div className="grid grid-cols-2 gap-4 mt-6">
                                    <div className="p-3 bg-white/5 rounded-xl">
                                        <div className="text-xl font-black text-white">12</div>
                                        <div className="text-[9px] text-slate-500 font-bold uppercase">Calls Logged</div>
                                    </div>
                                    <div className="p-3 bg-white/5 rounded-xl">
                                        <div className="text-xl font-black text-white">05</div>
                                        <div className="text-[9px] text-slate-500 font-bold uppercase">Meetings</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Attendance Sidebar Component */}
                    <div className="space-y-8">
                        <div className="bg-[#0a0a1a]/60 border border-white/5 rounded-[2.5rem] p-8 backdrop-blur-xl">
                            <h3 className="text-xl font-bold text-white mb-8 flex items-center gap-3 uppercase tracking-tight">
                                <Users className="text-emerald-400" size={24} />
                                Staff Presence
                            </h3>
                            <div className="space-y-6">
                                {employees.map((emp, i) => (
                                    <div key={i} className="flex items-center justify-between group">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center font-bold text-white text-xs border border-white/5">
                                                {emp.name[0]}
                                            </div>
                                            <div>
                                                <div className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors uppercase tracking-tight">{emp.name}</div>
                                                <div className="text-[9px] text-slate-500 font-bold uppercase">{emp.role} • {emp.checkIn}</div>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-end">
                                            <span className={`text-[9px] font-black uppercase ${emp.status === 'In' ? 'text-emerald-500' : 'text-slate-600'}`}>
                                                {emp.status}
                                            </span>
                                            <div className="text-[8px] text-slate-600 font-black">{emp.tasks} Tasks</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <button onClick={() => setActiveTab('workforce')} className="w-full mt-10 py-5 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black text-slate-500 hover:text-white hover:bg-white/10 transition-all uppercase tracking-widest">VIEW FULL WORKFORCE HUB</button>
                        </div>

                        {/* Quick HR Actions */}
                        <div className="bg-gradient-to-br from-[#1e1445] to-[#0a0a1a] border border-white/5 rounded-[2.5rem] p-8 relative overflow-hidden">
                            <h4 className="text-lg font-black text-white uppercase tracking-tight mb-6">Payroll Cycle</h4>
                            <div className="flex justify-between items-center mb-8">
                                <div>
                                    <div className="text-[10px] text-slate-400 uppercase font-black tracking-widest mb-1">Current Status</div>
                                    <div className="text-xl font-black text-emerald-400">Processing</div>
                                </div>
                                <div className="p-4 bg-emerald-500/10 rounded-2xl text-emerald-400 border border-emerald-500/20"><DollarSign size={24} /></div>
                            </div>
                            <div className="space-y-4">
                                <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                                    <div className="h-full bg-emerald-500" style={{ width: '85%' }} />
                                </div>
                                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest text-center">85% Employees Processed</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* CRM & LEADS TAB */}
            {activeTab === 'leads' && (
                <div className="space-y-8">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-6 bg-[#0a0a1a]/60 border border-white/5 p-6 rounded-[2.5rem] backdrop-blur-xl">
                        <div className="relative w-full md:w-96">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                            <input type="text" placeholder="Filter leads by BDM or Client..." className="w-full bg-[#050510] border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-sm text-white focus:border-blue-500 outline-none font-bold" />
                        </div>
                        <div className="flex gap-4">
                            <button className="flex items-center gap-2 px-6 py-4 bg-blue-600 text-white font-black rounded-2xl uppercase text-[10px] tracking-widest shadow-xl shadow-blue-500/20"><UserPlus size={16} /> NEW LEAD</button>
                            <button className="px-6 py-4 bg-white/5 border border-white/10 text-slate-400 rounded-2xl uppercase text-[10px] font-black tracking-widest hover:text-white"><PhoneCall size={16} /></button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 h-[600px]">
                        {['New Lead', 'In Progress', 'Negotiation', 'Converted'].map((stage, sIdx) => (
                            <div key={stage} className="flex flex-col gap-4 bg-[#0a0a1a]/40 border border-white/5 rounded-3xl p-4 overflow-y-auto custom-scrollbar">
                                <div className="flex justify-between items-center px-2 py-2 border-b border-white/5">
                                    <h5 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">{stage}</h5>
                                    <span className="bg-white/5 text-slate-400 text-[10px] px-2 py-0.5 rounded-md">8</span>
                                </div>
                                {[1, 2, 3].map((l) => (
                                    <div key={l} className="p-5 bg-[#0a0a1a] border border-white/5 rounded-2xl hover:border-blue-500/40 transition-all cursor-pointer group shadow-lg">
                                        <div className="flex justify-between items-start mb-3">
                                            <div className="text-xs font-black text-white group-hover:text-blue-400 uppercase tracking-tight">TechNova {l}</div>
                                            <button className="text-slate-700 hover:text-white"><MoreVertical size={14} /></button>
                                        </div>
                                        <p className="text-[10px] text-slate-500 leading-relaxed mb-4">Discussing bulk student placement for Python stack.</p>
                                        <div className="flex justify-between items-center pt-3 border-t border-white/5">
                                            <div className="flex -space-x-2">
                                                <div className="w-6 h-6 rounded-full bg-blue-500 text-[8px] flex items-center justify-center font-bold text-white border-2 border-[#0a0a1a]">SC</div>
                                            </div>
                                            <div className="text-[10px] font-black text-emerald-400">₹4.5L</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* CORPORATE TECH TAB */}
            {activeTab === 'corporate' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 bg-[#0a0a1a]/60 border border-white/5 rounded-[2.5rem] p-8">
                        <div className="flex justify-between items-center mb-10">
                            <h3 className="text-2xl font-black text-white uppercase tracking-tight">Active MNC Alliances</h3>
                            <button className="px-6 py-3 bg-violet-600 text-white font-black rounded-2xl uppercase text-[10px] tracking-widest"><Handshake size={16} /> NEW PARTNERSHIP</button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-white/5 pb-4">
                                        <th className="pb-4">CORPORATE ENTITY</th>
                                        <th className="pb-4 px-4">AGREEMENT TYPE</th>
                                        <th className="pb-4 px-4">STATUS</th>
                                        <th className="pb-4 pr-4 text-right">ACTION</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/[0.03]">
                                    {[
                                        { name: "Infosys", type: "Placement MoU", status: "Active" },
                                        { name: "Cisco Systems", type: "Training Partner", status: "Expiring Soon" },
                                        { name: "Zomato", type: "Hiring Agreement", status: "Active" },
                                        { name: "Accenture", type: "Hiring Agreement", status: "Pipeline" },
                                    ].map((corp, i) => (
                                        <tr key={i} className="group hover:bg-white/[0.02] transition-all">
                                            <td className="py-6 flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-xl bg-[#0a0a1a] border border-white/10 flex items-center justify-center">🏢</div>
                                                <div className="text-sm font-black text-white uppercase group-hover:text-violet-400">{corp.name}</div>
                                            </td>
                                            <td className="py-6 px-4">
                                                <div className="text-[10px] font-bold text-slate-400 uppercase">{corp.type}</div>
                                            </td>
                                            <td className="py-6 px-4">
                                                <span className={`text-[9px] font-black px-2 py-1 rounded border uppercase ${corp.status === 'Active' ? 'text-emerald-400 border-emerald-500/20' : corp.status === 'Pipeline' ? 'text-blue-400 border-blue-500/20' : 'text-amber-400 border-amber-500/20'}`}>
                                                    {corp.status}
                                                </span>
                                            </td>
                                            <td className="py-6 pr-4 text-right">
                                                <button className="p-2 text-slate-500 hover:text-white"><FileSignature size={18} /></button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-[#1a0a30] to-[#030014] border border-white/5 rounded-[2.5rem] p-8 flex flex-col items-center justify-center text-center">
                        <div className="w-20 h-20 rounded-full bg-violet-600/10 flex items-center justify-center mb-6 border border-violet-500/20"><FileSignature size={32} className="text-violet-500" /></div>
                        <h4 className="text-xl font-black text-white uppercase tracking-tight mb-4">MoU Repository</h4>
                        <p className="text-xs text-slate-500 uppercase leading-relaxed font-bold tracking-tight mb-8">Access and upload hiring agreements, corporate partnership mandates, and institutional MoUs.</p>
                        <button className="w-full py-5 border border-white/10 rounded-2xl text-[10px] font-black text-slate-400 hover:text-white hover:bg-white/10 transition-all uppercase tracking-widest"><FilePlus size={16} className="inline mr-2" /> UPLOAD AGREEMENT</button>
                    </div>
                </div>
            )}

            {/* REVENUE TAB */}
            {activeTab === 'revenue' && (
                <div className="space-y-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="bg-[#0a0a1a]/60 border border-white/5 rounded-[2.5rem] p-8">
                            <h3 className="text-xl font-bold text-white mb-8 uppercase tracking-tight">Fiscal Growth Heatmap</h3>
                            <div className="h-64 flex items-end justify-between gap-4 mt-12 bg-white/[0.02] p-8 rounded-3xl border border-white/5">
                                {[40, 65, 52, 85, 95, 75].map((h, i) => (
                                    <div key={i} className="flex-1 group relative">
                                        <motion.div
                                            initial={{ height: 0 }}
                                            animate={{ height: `${h}%` }}
                                            className="w-full bg-gradient-to-t from-blue-600/20 to-blue-500 rounded-t-xl group-hover:from-violet-500/80 group-hover:to-[#22d3ee] transition-all cursor-pointer relative"
                                        />
                                        <div className="text-[9px] text-slate-600 font-black uppercase text-center mt-3">M{i + 1}</div>
                                    </div>
                                ))}
                            </div>
                            <div className="grid grid-cols-3 gap-8 mt-10">
                                <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                                    <div className="text-[9px] text-slate-500 font-black uppercase tracking-widest mb-1">Total Admissions</div>
                                    <div className="text-xl font-black text-white">425</div>
                                </div>
                                <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                                    <div className="text-[9px] text-slate-500 font-black uppercase tracking-widest mb-1">Placement Rev</div>
                                    <div className="text-xl font-black text-emerald-400">₹12.5L</div>
                                </div>
                                <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                                    <div className="text-[9px] text-slate-500 font-black uppercase tracking-widest mb-1">Net ROI</div>
                                    <div className="text-xl font-black text-blue-400">+22%</div>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col gap-6">
                            <div className="flex-1 bg-gradient-to-br from-[#0c1a1a] to-[#030014] border border-white/5 rounded-[2.5rem] p-8">
                                <h3 className="text-xl font-black text-white uppercase tracking-tight mb-8">Yield per Partnership</h3>
                                <div className="space-y-6">
                                    {[
                                        { label: "Amazon Recruitment", val: 92, rev: "₹18.5L" },
                                        { label: "TCS Ninja Batch", val: 84, rev: "₹12.2L" },
                                        { label: "Accenture ASE", val: 75, rev: "₹8.4L" },
                                    ].map((roi, i) => (
                                        <div key={i} className="space-y-3">
                                            <div className="flex justify-between text-[10px] font-black uppercase">
                                                <span className="text-slate-400">{roi.label}</span>
                                                <span className="text-blue-400">{roi.rev}</span>
                                            </div>
                                            <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                                                <motion.div initial={{ width: 0 }} animate={{ width: `${roi.val}%` }} className="h-full bg-blue-500" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <button className="w-full py-5 bg-blue-600 text-white font-black rounded-2xl uppercase text-[10px] tracking-widest shadow-xl shadow-blue-500/20"><LineChart size={16} className="inline mr-2" /> VIEW DETAILED FISCAL REPORT</button>
                        </div>
                    </div>
                </div>
            )}

            {/* WORKFORCE HUB TAB */}
            {activeTab === 'workforce' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-8">
                        <div className="bg-[#0a0a1a]/60 border border-white/5 rounded-[2.5rem] p-8">
                            <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-10">
                                <h3 className="text-2xl font-black text-white uppercase tracking-tight">Workforce Matrix</h3>
                                <div className="flex bg-[#050510] border border-white/10 rounded-xl p-1">
                                    <button className="px-6 py-2 bg-blue-600 text-white rounded-lg text-[10px] font-black uppercase tracking-widest">DIRECTORY</button>
                                    <button className="px-6 py-2 text-slate-500 hover:text-white rounded-lg text-[10px] font-black uppercase tracking-widest">PAYROLL</button>
                                </div>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-white/5 pb-4">
                                            <th className="pb-4">EMPLOYEE</th>
                                            <th className="pb-4 px-4 text-center">CHECK-IN</th>
                                            <th className="pb-4 px-4 text-center">TASKS</th>
                                            <th className="pb-4 px-4 text-center">PAYROLL</th>
                                            <th className="pb-4 pr-4 text-right">ACTION</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/[0.03]">
                                        {employees.map((emp, i) => (
                                            <tr key={i} className="group hover:bg-white/[0.01] transition-all">
                                                <td className="py-6 flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center font-bold text-white text-xs border border-white/5 group-hover:scale-110 transition-transform">
                                                        {emp.name[0]}
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-black text-white uppercase group-hover:text-blue-400 transition-colors">{emp.name}</div>
                                                        <div className="text-[9px] text-slate-600 font-bold uppercase">{emp.role}</div>
                                                    </div>
                                                </td>
                                                <td className="py-6 px-4 text-center">
                                                    <div className="text-xs font-bold text-white">{emp.checkIn}</div>
                                                    <div className={`text-[8px] font-black uppercase ${emp.status === 'In' ? 'text-emerald-500' : 'text-slate-600'}`}>{emp.status}</div>
                                                </td>
                                                <td className="py-6 px-4 text-center">
                                                    <div className="flex flex-col items-center gap-1">
                                                        <div className="text-[10px] font-black text-white">{emp.tasks}</div>
                                                        <div className="h-1 w-12 bg-white/5 rounded-full overflow-hidden">
                                                            <div className="h-full bg-blue-500" style={{ width: '60%' }} />
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-6 px-4 text-center">
                                                    <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${emp.pay === 'Paid' ? 'bg-emerald-500/10 text-emerald-400' : emp.pay === 'Hold' ? 'bg-red-500/10 text-red-400' : 'bg-amber-500/10 text-amber-500'}`}>
                                                        {emp.pay}
                                                    </span>
                                                </td>
                                                <td className="py-6 pr-4 text-right">
                                                    <button className="p-2 text-slate-500 hover:text-white transition-all"><Wallet size={18} /></button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-8">
                        <div className="bg-gradient-to-br from-[#1e1445] to-[#0a0a1a] border border-white/5 rounded-[2.5rem] p-8">
                            <h3 className="text-xl font-bold text-white mb-8 flex items-center gap-3 uppercase tracking-tight">
                                <UserCheck2 className="text-blue-400" size={24} />
                                My Operations
                            </h3>
                            <div className="space-y-4">
                                <button className="w-full py-5 bg-emerald-600 text-black font-black rounded-2xl text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-emerald-500/20 hover:scale-105 transition-all">DAILY CHECK-IN</button>
                                <div className="grid grid-cols-2 gap-4">
                                    <button className="py-4 bg-white/5 border border-white/10 rounded-2xl text-[9px] font-black text-slate-400 uppercase tracking-widest hover:text-white transition-all">VIEW PAYSLIP</button>
                                    <button className="py-4 bg-white/5 border border-white/10 rounded-2xl text-[9px] font-black text-slate-400 uppercase tracking-widest hover:text-white transition-all">MY TASKS</button>
                                </div>
                                <button className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl text-[9px] font-black text-slate-400 uppercase tracking-widest hover:text-white transition-all">APPLY FOR LEAVE</button>
                            </div>
                        </div>

                        <div className="bg-[#0a0a1a]/60 border border-white/5 rounded-[2.5rem] p-8 backdrop-blur-xl">
                            <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-6">Attendance Summary</h4>
                            <div className="space-y-4">
                                <div className="flex justify-between items-end border-b border-white/5 pb-4">
                                    <div>
                                        <div className="text-[9px] text-slate-500 font-bold uppercase">This Month</div>
                                        <div className="text-2xl font-black text-white tracking-tight">22 / 24</div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-[10px] font-black text-emerald-400">91.6%</div>
                                        <div className="text-[8px] text-slate-600 font-black uppercase">Efficiency</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* HR TAB */}
            {activeTab === 'hr' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 bg-[#0a0a1a]/60 border border-white/5 rounded-[2.5rem] p-8">
                        <h3 className="text-2xl font-black text-white uppercase tracking-tight mb-8">Leave Requests</h3>
                        <div className="space-y-6">
                            {[
                                { name: "Mike Ross", type: "Casual Leave", date: "15 Oct", status: "Pending" },
                                { name: "Harvey Specter", type: "Sick Leave", date: "12 Oct", status: "Approved" },
                                { name: "Donna Paulsen", type: "Emergency", date: "10 Oct", status: "Rejected" },
                            ].map((req, i) => (
                                <div key={i} className="flex items-center justify-between p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-violet-500/40 transition-all group">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center font-bold text-white text-[10px] border border-white/5">
                                            {req.name.split(' ').map(n => n[0]).join('')}
                                        </div>
                                        <div>
                                            <div className="text-sm font-black text-white uppercase group-hover:text-violet-400">{req.name}</div>
                                            <div className="text-[10px] text-slate-500 font-bold uppercase">{req.type} • {req.date}</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-6">
                                        <span className={`text-[9px] font-black uppercase ${req.status === 'Approved' ? 'text-emerald-500' : req.status === 'Rejected' ? 'text-red-500' : 'text-amber-500'}`}>
                                            {req.status}
                                        </span>
                                        <div className="flex gap-2 text-slate-500">
                                            <button className="p-2 bg-emerald-500/10 text-emerald-500 rounded-lg hover:bg-emerald-500 hover:text-black transition-all"><CheckCircle size={14} /></button>
                                            <button className="p-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500 hover:text-black transition-all"><LogOut size={14} /></button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-[#030014] border border-white/5 rounded-[2.5rem] p-8 flex flex-col justify-center text-center">
                        <div className="w-16 h-16 rounded-3xl bg-violet-600/10 border border-violet-500/20 text-violet-400 flex items-center justify-center mx-auto mb-6"><ShieldCheck size={32} /></div>
                        <h4 className="text-xl font-black text-white uppercase tracking-tight mb-4">HR Records Safe</h4>
                        <p className="text-xs text-slate-500 uppercase leading-relaxed font-bold tracking-tight mb-8">Access employee digital files, contract history, and performance evaluations.</p>
                        <button className="w-full py-5 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black text-slate-400 hover:text-white transition-all uppercase tracking-widest">OPEN HR VAULT</button>
                    </div>
                </div>
            )}
        </AdvancedModuleLayout>
    );
}
