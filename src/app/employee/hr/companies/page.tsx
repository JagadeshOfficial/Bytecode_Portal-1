"use client";

import { useState } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Building2,
    Plus,
    Search,
    Filter,
    MoreVertical,
    Globe,
    MapPin,
    DollarSign,
    Users,
    FileText,
    ChevronRight,
    ArrowUpRight,
    Edit3,
    Trash2,
    CheckCircle2,
    Briefcase,
    Zap,
    Download
} from 'lucide-react';

const COMPANIES = [
    {
        id: "C-001",
        name: "Infosys",
        industry: "IT Services",
        headquarters: "Bengaluru",
        hiringStatus: "Active",
        drivesCount: 24,
        avgPackage: "6.5 LPA",
        logo: "🏢"
    },
    {
        id: "C-002",
        name: "Accenture",
        industry: "Consulting",
        headquarters: "Dublin / Global",
        hiringStatus: "Pipeline",
        drivesCount: 18,
        avgPackage: "4.8 LPA",
        logo: "🔺"
    },
    {
        id: "C-003",
        name: "TCS",
        industry: "IT Services",
        headquarters: "Mumbai",
        hiringStatus: "Active",
        drivesCount: 42,
        avgPackage: "7.2 LPA",
        logo: "💠"
    },
    {
        id: "C-004",
        name: "Wipro",
        industry: "IT Services",
        headquarters: "Bengaluru",
        hiringStatus: "Dormant",
        drivesCount: 12,
        avgPackage: "4.2 LPA",
        logo: "🏢"
    }
];

export default function CompanyManagementPage() {
    return (
        <DashboardLayout role="hr">
            <div className="flex flex-col gap-8 pb-10">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                        <h1 className="text-4xl font-[Rajdhani] font-bold text-white tracking-widest uppercase">
                            Company <span className="text-cyan-400">Database</span>
                        </h1>
                        <p className="text-slate-400 font-medium mt-1">Manage corporate partnerships, MNC hiring patterns, and role-specific requirements.</p>
                    </div>
                    <button className="flex items-center gap-2 px-6 py-4 bg-cyan-600 hover:bg-cyan-500 text-black font-black rounded-2xl shadow-xl shadow-cyan-500/20 transition-all uppercase text-[10px] tracking-widest">
                        <Plus size={18} /> REGISTER NEW MNC
                    </button>
                </div>

                {/* Filters & Search */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-6 bg-[#0a0a1a]/60 border border-white/5 p-6 rounded-[2.5rem] backdrop-blur-xl">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                        <input
                            type="text"
                            placeholder="Search companies by name or industry..."
                            className="w-full bg-[#050510] border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-sm text-white focus:outline-none focus:border-cyan-500 transition-all font-bold"
                        />
                    </div>
                    <div className="flex gap-4 w-full md:w-auto">
                        <button className="flex-1 md:flex-none p-4 bg-white/5 border border-white/10 rounded-xl text-slate-400 hover:text-white transition-all"><Filter size={20} /></button>
                        <button className="flex-1 md:flex-none px-8 py-4 bg-white/5 border border-white/10 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all">EXCEL EXPORT</button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
                    {COMPANIES.map((company) => (
                        <div key={company.id} className="group bg-[#0a0a1a]/60 border border-white/5 rounded-[2.5rem] p-8 backdrop-blur-xl hover:border-cyan-500/30 transition-all relative overflow-hidden flex flex-col">
                            {/* Company Branding BG */}
                            <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:scale-125 transition-transform duration-700">
                                <Building2 size={120} />
                            </div>

                            <div className="flex justify-between items-start mb-8 relative z-10">
                                <div className="w-16 h-16 rounded-2xl bg-[#0a0a1a] border border-white/10 flex items-center justify-center text-4xl shadow-2xl group-hover:scale-110 transition-transform">
                                    {company.logo}
                                </div>
                                <div className="flex flex-col items-end gap-2">
                                    <span className={`px-3 py-1 rounded-lg text-[9px] font-black tracking-widest uppercase ${company.hiringStatus === 'Active' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                                            company.hiringStatus === 'Pipeline' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                                                'bg-white/5 text-slate-500'
                                        }`}>
                                        {company.hiringStatus}
                                    </span>
                                    <div className="flex gap-1">
                                        <button className="p-2 bg-white/5 border border-white/10 rounded-lg text-slate-500 hover:text-white transition-all"><Edit3 size={14} /></button>
                                        <button className="p-2 bg-white/5 border border-white/10 rounded-lg text-slate-500 hover:text-red-500 transition-all"><Trash2 size={14} /></button>
                                    </div>
                                </div>
                            </div>

                            <div className="relative z-10 flex-1">
                                <h3 className="text-2xl font-black text-white group-hover:text-cyan-400 transition-colors uppercase tracking-tight mb-2">{company.name}</h3>
                                <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-widest mb-8">
                                    <Globe size={14} className="text-cyan-500" /> {company.industry}
                                </div>

                                <div className="grid grid-cols-2 gap-6 mb-8">
                                    <div className="space-y-1">
                                        <div className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Headquarters</div>
                                        <div className="text-xs font-bold text-white flex items-center gap-1"><MapPin size={12} className="text-cyan-500" /> {company.headquarters}</div>
                                    </div>
                                    <div className="space-y-1">
                                        <div className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Avg Package</div>
                                        <div className="text-xs font-bold text-white flex items-center gap-1"><DollarSign size={12} className="text-emerald-500" /> {company.avgPackage}</div>
                                    </div>
                                </div>

                                <div className="p-4 bg-white/5 border border-white/5 rounded-2xl flex items-center justify-between mb-8">
                                    <div className="flex items-center gap-3">
                                        <div className="text-sm font-black text-white">{company.drivesCount}</div>
                                        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Drives Conducted</div>
                                    </div>
                                    <ArrowUpRight size={18} className="text-cyan-500 group-hover:scale-125 transition-transform" />
                                </div>
                            </div>

                            <div className="relative z-10 pt-6 border-t border-white/5 flex gap-3">
                                <button className="flex-1 py-4 bg-white/5 border border-white/10 hover:border-white/20 text-white font-black text-xs tracking-widest rounded-2xl transition-all uppercase">VIEW PATTERNS</button>
                                <button className="flex-1 py-4 bg-cyan-600/10 border border-cyan-500/20 text-cyan-400 hover:bg-cyan-600 hover:text-black font-black text-xs tracking-widest rounded-2xl transition-all uppercase">SCHEDULE DRIVE</button>
                            </div>
                        </div>
                    ))}

                    {/* Add More CTA */}
                    <div className="group border-2 border-dashed border-white/10 rounded-[2.5rem] p-8 flex flex-col items-center justify-center text-center hover:border-cyan-500/50 transition-all cursor-pointer">
                        <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <Plus size={32} className="text-slate-500 group-hover:text-cyan-500" />
                        </div>
                        <h4 className="text-xl font-black text-white uppercase tracking-tight mb-2">Register Partner</h4>
                        <p className="text-xs text-slate-500 font-medium max-w-[200px]">Expand your corporate network by adding a new hiring partner.</p>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
