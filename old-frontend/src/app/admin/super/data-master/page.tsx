"use client";

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { motion, AnimatePresence } from 'framer-motion';
import api from '@/lib/api';
import {
    Database,
    Users,
    Briefcase,
    GraduationCap,
    FileText,
    DollarSign,
    Search,
    RefreshCw,
    Download,
    ChevronRight,
    Table as TableIcon,
    AlertCircle,
    CheckCircle2
} from 'lucide-react';

type EntityType = 'users' | 'placements' | 'courses' | 'exams' | 'finance' | 'academic';

export default function DatabaseMasterExplorer() {
    const [activeTab, setActiveTab] = useState<EntityType>('users');
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [stats, setStats] = useState<any>({});

    const tabs: { id: EntityType; label: string; icon: any; color: string }[] = [
        { id: 'users', label: 'User Registry', icon: Users, color: '#7c3aed' },
        { id: 'placements', label: 'Placement Records', icon: Briefcase, color: '#d946ef' },
        { id: 'courses', label: 'LMS Catalog', icon: FileText, color: '#06b6d4' },
        { id: 'exams', label: 'Exam Engine', icon: GraduationCap, color: '#f59e0b' },
        { id: 'finance', label: 'Financial Ledger', icon: DollarSign, color: '#10b981' },
        { id: 'academic', label: 'Academic Batches', icon: Database, color: '#3b82f6' },
    ];

    const fetchData = async (type: EntityType) => {
        setLoading(true);
        try {
            let endpoint = '';
            switch (type) {
                case 'users': endpoint = 'users'; break;
                case 'placements': endpoint = 'placements/records'; break;
                case 'courses': endpoint = 'courses'; break;
                case 'exams': endpoint = 'exams'; break;
                case 'finance': endpoint = 'finance/fees'; break;
                case 'academic': endpoint = 'academic/batches'; break;
            }
            const res = await api.get(endpoint);
            setData(res.data || []);
            setLoading(false);
        } catch (error) {
            console.error(`Failed to fetch ${type}:`, error);
            setData([]);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData(activeTab);
    }, [activeTab]);

    const filteredData = data.filter(item => {
        const str = JSON.stringify(item).toLowerCase();
        return str.includes(searchTerm.toLowerCase());
    });

    const renderTable = () => {
        if (loading) return (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
                <RefreshCw className="w-10 h-10 text-violet-500 animate-spin" />
                <p className="text-slate-400 font-medium animate-pulse">Syncing with MongoDB Atlas...</p>
            </div>
        );

        if (!data || data.length === 0) return (
            <div className="flex flex-col items-center justify-center py-20 gap-4 border border-dashed border-white/10 rounded-3xl bg-white/5">
                <AlertCircle className="w-12 h-12 text-slate-600" />
                <p className="text-slate-400">No records found for this collection.</p>
            </div>
        );

        const keys = Object.keys(data[0]).filter(k => k !== '__v' && k !== 'password');

        return (
            <div className="overflow-x-auto rounded-3xl border border-white/10 bg-[#030014]/50 backdrop-blur-xl">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-white/5">
                            {keys.map(key => (
                                <th key={key} className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-white/5 whitespace-nowrap">
                                    {key.replace(/([A-Z])/g, ' $1')}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {filteredData.map((row, i) => (
                            <tr key={i} className="hover:bg-white/[0.02] transition-colors group">
                                {keys.map(key => (
                                    <td key={key} className="px-6 py-4 text-sm text-slate-300 font-medium whitespace-nowrap">
                                        {typeof row[key] === 'object' ? JSON.stringify(row[key]) : String(row[key])}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    };

    return (
        <DashboardLayout role="super_admin">
            <div className="flex flex-col gap-8">
                {/* Header Section */}
                <div className="relative overflow-hidden rounded-[2.5rem] p-1 bg-gradient-to-r from-violet-500/20 via-fuchsia-500/20 to-cyan-500/20">
                    <div className="relative z-10 bg-[#030014]/90 rounded-[2.4rem] p-10 flex flex-col md:flex-row justify-between items-center gap-6">
                        <div className="flex items-center gap-6">
                            <div className="p-4 bg-violet-500/20 rounded-3xl border border-violet-500/30">
                                <Database className="w-10 h-10 text-violet-400" />
                            </div>
                            <div>
                                <h1 className="text-4xl font-black text-white tracking-tight uppercase">Database <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-400">Master Data</span></h1>
                                <p className="text-slate-400 mt-2 font-medium flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                    Live exploration of multi-tenant MongoDB Cloud instances
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <button onClick={() => fetchData(activeTab)} className="flex items-center gap-3 px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white font-bold hover:bg-white/10 transition-all uppercase text-[10px] tracking-widest">
                                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Sync Data
                            </button>
                            <button className="flex items-center gap-3 px-6 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-black rounded-2xl shadow-xl shadow-emerald-500/20 uppercase text-[10px] tracking-widest hover:scale-105 transition-all">
                                <Download className="w-4 h-4" /> Export JSON
                            </button>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Sidebar Tabs */}
                    <div className="flex flex-col gap-3">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-4 px-6 py-5 rounded-3xl border transition-all relative overflow-hidden group ${activeTab === tab.id
                                        ? 'bg-white/10 border-white/20 text-white'
                                        : 'bg-white/5 border-white/5 text-slate-500 hover:border-white/10 hover:text-slate-300'
                                    }`}
                            >
                                {activeTab === tab.id && (
                                    <motion.div
                                        layoutId="activeTabGlow"
                                        className="absolute inset-0 bg-gradient-to-r opacity-20"
                                        style={{ backgroundImage: `linear-gradient(to right, ${tab.color}, transparent)` }}
                                    />
                                )}
                                <div className={`p-2 rounded-xl border transition-colors ${activeTab === tab.id
                                        ? 'bg-white/10 border-white/10'
                                        : 'bg-black/20 border-white/5'
                                    }`} style={{ color: activeTab === tab.id ? tab.color : 'inherit' }}>
                                    <tab.icon size={20} />
                                </div>
                                <span className="font-bold flex-1 text-left">{tab.label}</span>
                                <ChevronRight className={`w-4 h-4 transition-transform ${activeTab === tab.id ? 'translate-x-0 opacity-100' : '-translate-x-2 opacity-0'}`} />
                            </button>
                        ))}
                    </div>

                    {/* Data Explorer */}
                    <div className="lg:col-span-3 flex flex-col gap-6">
                        <div className="bg-[#0f0728]/60 border border-white/5 rounded-[2.5rem] p-8 backdrop-blur-xl">
                            <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-8">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-white/5 rounded-2xl border border-white/10">
                                        <TableIcon className="w-6 h-6 text-violet-400" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-white">Full Record Explorer</h3>
                                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Found {filteredData.length} documents in collection</p>
                                    </div>
                                </div>
                                <div className="relative w-full md:w-96">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                    <input
                                        type="text"
                                        placeholder="Globally filter table data..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-sm text-white focus:border-violet-500 outline-none font-bold"
                                    />
                                </div>
                            </div>

                            {renderTable()}
                        </div>

                        {/* Database Health Info */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="p-6 bg-white/5 border border-white/5 rounded-3xl flex items-center gap-4">
                                <div className="p-3 bg-emerald-500/10 rounded-2xl text-emerald-400 border border-emerald-500/20">
                                    <CheckCircle2 size={24} />
                                </div>
                                <div>
                                    <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Connection</div>
                                    <div className="text-lg font-black text-white">ENCRYPTED</div>
                                </div>
                            </div>
                            <div className="p-6 bg-white/5 border border-white/5 rounded-3xl flex items-center gap-4">
                                <div className="p-3 bg-blue-500/10 rounded-2xl text-blue-400 border border-blue-500/20">
                                    <Database size={24} />
                                </div>
                                <div>
                                    <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Instance</div>
                                    <div className="text-lg font-black text-white">AWS N. VIRGINIA</div>
                                </div>
                            </div>
                            <div className="p-6 bg-white/5 border border-white/5 rounded-3xl flex items-center gap-4">
                                <div className="p-3 bg-violet-500/10 rounded-2xl text-violet-400 border border-violet-500/20">
                                    <Users size={24} />
                                </div>
                                <div>
                                    <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Tenancy</div>
                                    <div className="text-lg font-black text-white">ISOLATED DBs</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
