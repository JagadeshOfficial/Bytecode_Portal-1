"use client";

import { useState } from 'react';
import AdvancedModuleLayout from '@/components/dashboard/AdvancedModuleLayout';
import { motion } from 'framer-motion';
import {
    Briefcase,
    Building,
    Building2,
    Users,
    CheckCircle,
    Calendar,
    Globe,
    Award,
    MapPin,
    ArrowUpRight,
    Search,
    Filter,
    Plus,
    LayoutGrid,
    MoreVertical,
    Clock
} from 'lucide-react';

export default function PlacementsPage() {
    const [activeTab, setActiveTab] = useState('overview');

    const stats = [
        { label: "Total Placed", value: "450+", icon: Award, color: "#f59e0b", trend: "+12% YoY" },
        { label: "Active Companies", value: "85", icon: Building2, color: "#3b82f6", trend: "+5 New" },
        { label: "Avg. Package", value: "₹8.5 LPA", icon: Briefcase, color: "#10b981", trend: "+1.2L" },
        { label: "Pending Interviews", value: "24", icon: Calendar, color: "#8b5cf6", trend: "This Week" },
    ];

    const companies = [
        { name: "Google", type: "Product", location: "Bangalore", hiring: "Yes", logo: "G", color: "text-red-500", openings: 12 },
        { name: "Microsoft", type: "Product", location: "Hyderabad", hiring: "Yes", logo: "M", color: "text-blue-500", openings: 8 },
        { name: "TCS", type: "Service", location: "Mumbai", hiring: "Volume", logo: "T", color: "text-sky-600", openings: 45 },
        { name: "Amazon", type: "Product", location: "Gurgaon", hiring: "Yes", logo: "A", color: "text-orange-500", openings: 15 },
        { name: "Infosys", type: "Service", location: "Pune", hiring: "Volume", logo: "I", color: "text-blue-700", openings: 30 },
        { name: "Netflix", type: "Product", location: "Remote", hiring: "Selective", logo: "N", color: "text-red-600", openings: 3 },
    ];

    return (
        <AdvancedModuleLayout
            title="Placement & Careers"
            subtitle="Manage corporate relations, student placements, and interview schedules."
            stats={stats}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            tabs={[
                { id: 'overview', label: 'Overview', icon: Globe },
                { id: 'companies', label: 'Partner Network', icon: Building },
                { id: 'candidates', label: 'Candidate Pool', icon: Users },
                { id: 'drives', label: 'Hiring Drives', icon: Calendar },
            ]}
        >
            {activeTab === 'overview' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-slate-900/50 border border-white/5 rounded-2xl p-6 backdrop-blur-sm lg:col-span-2"
                    >
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                <Calendar size={20} className="text-blue-400" /> Upcoming Drives
                            </h3>
                            <button className="text-xs text-blue-400 font-bold hover:underline">View Calendar</button>
                        </div>
                        <div className="space-y-4">
                            {[
                                { company: "Google", role: "SDE I & II", date: "Feb 15 - 16, 2026", type: "On-Campus", logo: "G", color: "bg-red-500" },
                                { company: "Amazon", role: "Cloud Support", date: "Feb 18, 2026", type: "Virtual", logo: "A", color: "bg-orange-500" },
                                { company: "TCS", role: "System Engineer", date: "Feb 20 - 22, 2026", type: "On-Campus", logo: "T", color: "bg-blue-600" },
                            ].map((drive, i) => (
                                <div key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5 hover:border-blue-500/30 transition-all cursor-pointer group">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-white text-lg shadow-lg ${drive.color}`}>
                                            {drive.logo}
                                        </div>
                                        <div>
                                            <div className="font-bold text-white text-lg group-hover:text-blue-400 transition-colors">{drive.company}</div>
                                            <div className="text-sm text-slate-400 font-medium">{drive.role}</div>
                                            <div className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                                                <Clock size={12} /> {drive.date}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase border ${drive.type === 'On-Campus' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-violet-500/10 text-violet-400 border-violet-500/20'}`}>
                                            {drive.type}
                                        </span>
                                        <button className="flex items-center gap-1 text-xs font-bold text-slate-400 hover:text-white mt-3 ml-auto transition-colors">
                                            Details <ArrowUpRight size={12} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    <div className="flex flex-col gap-6">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-slate-900/50 border border-white/5 rounded-2xl p-6 backdrop-blur-sm"
                        >
                            <h3 className="text-lg font-bold text-white mb-4">Placement Success</h3>
                            <div className="flex items-end justify-center h-40 gap-4">
                                {[60, 85, 45, 90, 75].map((h, i) => (
                                    <div key={i} className="w-8 bg-slate-800 rounded-t-lg relative group">
                                        <div
                                            className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-blue-600 to-cyan-400 rounded-t-lg transition-all duration-500 hover:from-blue-500 hover:to-cyan-300"
                                            style={{ height: `${h}%` }}
                                        ></div>
                                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-white text-slate-900 text-[10px] font-bold px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                            {h} Placed
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-2 px-2">
                                <span>Sep</span><span>Oct</span><span>Nov</span><span>Dec</span><span>Jan</span>
                            </div>
                        </motion.div>
                    </div>
                </div>
            )}

            {activeTab === 'companies' && (
                <div className="space-y-6">
                    <div className="flex justify-between items-center">
                        <div className="relative w-96">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                            <input type="text" placeholder="Search partners..." className="w-full bg-slate-900/50 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors" />
                        </div>
                        <div className="flex gap-2">
                            <button className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-colors border border-white/5">
                                <Filter size={16} /> Filter
                            </button>
                            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-colors">
                                <Plus size={16} /> Add Partner
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {companies.map((comp, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: i * 0.05 }}
                                className="bg-slate-900/50 border border-white/5 rounded-2xl p-6 hover:border-blue-500/30 transition-all group relative"
                            >
                                <div className="absolute top-4 right-4">
                                    <button className="text-slate-500 hover:text-white transition-colors"><MoreVertical size={16} /></button>
                                </div>
                                <div className={`w-16 h-16 rounded-2xl bg-slate-800 flex items-center justify-center text-3xl font-bold mb-4 ${comp.color}`}>
                                    {comp.logo}
                                </div>
                                <h3 className="text-xl font-bold text-white mb-1">{comp.name}</h3>
                                <div className="flex items-center gap-2 text-xs text-slate-400 mb-4">
                                    <MapPin size={12} /> {comp.location} • {comp.type}
                                </div>
                                <div className="flex justify-between items-center border-t border-white/5 pt-4">
                                    <div>
                                        <div className="text-[10px] text-slate-500 uppercase tracking-wide font-bold">Openings</div>
                                        <div className="text-lg font-bold text-white">{comp.openings}</div>
                                    </div>
                                    <button className="px-3 py-1.5 bg-blue-600/10 text-blue-400 rounded-lg text-xs font-bold hover:bg-blue-600 hover:text-white transition-colors">
                                        View Jobs
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            )}
        </AdvancedModuleLayout>
    );
}
