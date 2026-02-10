"use client";

import { useState } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Briefcase,
    Building2,
    MapPin,
    Calendar,
    Users,
    CheckCircle2,
    Clock,
    ChevronRight,
    Search,
    Filter,
    ArrowUpRight,
    Rocket,
    Award,
    ShieldCheck,
    MessageSquare,
    Link as LinkIcon,
    Upload,
    Download,
    Eye,
    Zap,
    ExternalLink,
    TrendingUp,
    DollarSign
} from 'lucide-react';

const JOBS = [
    {
        id: "J001",
        company: "Infosys",
        role: "Systems Engineer Specialist",
        location: "Bengaluru / Remote",
        salary: "6.5 - 9.0 LPA",
        type: "Full Time",
        logo: "🏢",
        tags: ["Java", "Spring Boot", "AWS"],
        status: "Applied",
        eligibility: "Met",
        deadline: "Feb 20, 2026"
    },
    {
        id: "J002",
        company: "Accenture",
        role: "Application Development Associate",
        location: "Hyderabad",
        salary: "4.5 - 6.0 LPA",
        type: "Full Time",
        logo: "🔺",
        tags: ["React", "JavaScript", "SQL"],
        status: "Eligible",
        eligibility: "Met",
        deadline: "Feb 25, 2026"
    },
    {
        id: "J003",
        company: "TCS",
        role: "Digital - Graduate Trainee",
        location: "Pan India",
        salary: "7.0 LPA",
        type: "Full Time",
        logo: "💠",
        tags: ["Python", "Machine Learning", "Cloud"],
        status: "Shortlisted",
        eligibility: "Met",
        deadline: "Closed"
    }
];

const INTERVIEWS = [
    { title: "Technical Round 1", company: "TCS Digital", date: "Feb 14, 2026", time: "11:00 AM", mode: "Virtual (Teams)", link: "https://teams.microsoft.com/l/meetup/..." },
    { title: "HR Discussion", company: "Infosys", date: "To be scheduled", time: "-", mode: "-", link: null },
];

const APPLICATIONS = [
    { company: "Capgemini", role: "Software Analyst", appliedOn: "Jan 15", status: "Rejected", step: "Aptitude Round" },
    { company: "Wipro", role: "Project Engineer", appliedOn: "Jan 28", status: "Selected", step: "Final Offer" },
];

export default function PlacementHQPage() {
    const [selectedTab, setSelectedTab] = useState('listings');

    return (
        <DashboardLayout role="student">
            <div className="flex flex-col gap-8 pb-10">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                        <h1 className="text-4xl font-display font-bold text-white tracking-tight uppercase">
                            Placement <span className="text-violet-400">HQ</span>
                        </h1>
                        <p className="text-slate-400 font-medium mt-1">Your gateway to Tier-1 MNCs. Track applications, schedule interviews, and manage offers.</p>
                    </div>
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                        { label: "Eligible Jobs", value: "24", sub: "MNC Pattern", icon: Zap, color: "text-amber-400", bg: "bg-amber-500/10" },
                        { label: "Applied", value: "08", sub: "Last 30 Days", icon: FileText, color: "text-blue-400", bg: "bg-blue-500/10" },
                        { label: "Shortlisted", value: "02", sub: "Ready for Interview", icon: Award, color: "text-emerald-400", bg: "bg-emerald-500/10" },
                        { label: "Job Readiness", value: "84%", sub: "Top 5% Score", icon: TrendingUp, color: "text-violet-400", bg: "bg-violet-500/10" },
                    ].map((stat, idx) => (
                        <div key={idx} className={`${stat.bg} border border-white/5 rounded-3xl p-6 backdrop-blur-xl group hover:scale-[1.02] transition-all cursor-pointer`}>
                            <div className="flex justify-between items-start mb-4">
                                <div className={`p-3 rounded-2xl bg-[#0a0a1a]/80 ${stat.color} shadow-lg shadow-black/40`}>
                                    <stat.icon className="w-5 h-5" />
                                </div>
                                <ArrowUpRight className="text-slate-600 group-hover:text-white transition-colors" size={18} />
                            </div>
                            <div className="text-3xl font-black text-white mb-1 tracking-tight">{stat.value}</div>
                            <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{stat.label}</div>
                            <div className={`mt-3 text-[9px] font-black uppercase tracking-tighter ${stat.color}`}>{stat.sub}</div>
                        </div>
                    ))}
                </div>

                {/* Navigation Tabs */}
                <div className="flex gap-4 p-1.5 bg-[#0a0a1a]/60 border border-white/5 rounded-2xl w-fit backdrop-blur-xl">
                    {[
                        { id: 'listings', label: 'JOB LISTINGS', icon: Briefcase },
                        { id: 'interviews', label: 'INTERVIEWS', icon: MessageSquare },
                        { id: 'tracking', label: 'TRACK APPLICATIONS', icon: Rocket },
                        { id: 'offers', label: 'MY OFFERS', icon: Award },
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setSelectedTab(tab.id)}
                            className={`flex items-center gap-2 px-6 py-4 rounded-xl text-[10px] font-black transition-all tracking-widest leading-none ${selectedTab === tab.id
                                ? 'bg-violet-600 text-white shadow-lg shadow-violet-500/20'
                                : 'text-slate-500 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            <tab.icon size={16} />
                            {tab.label}
                        </button>
                    ))}
                </div>

                <AnimatePresence mode="wait">
                    {selectedTab === 'listings' && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="space-y-6"
                        >
                            <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
                                <div className="relative w-full md:w-96">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                    <input
                                        type="text"
                                        placeholder="Search by company or role..."
                                        className="w-full bg-[#0a0a1a]/60 border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-sm text-white focus:outline-none focus:border-violet-500 transition-all font-bold"
                                    />
                                </div>
                                <div className="flex gap-4">
                                    <button className="px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black text-slate-500 hover:text-white hover:bg-violet-600 hover:border-violet-500 transition-all uppercase tracking-[0.2em] leading-none">AUTO ELIGIBILITY CHECK</button>
                                    <button className="p-3 bg-white/5 border border-white/10 rounded-xl text-slate-400 hover:text-white transition-all"><Filter size={20} /></button>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                {JOBS.map((job) => (
                                    <div key={job.id} className="group bg-[#0a0a1a]/60 border border-white/5 rounded-[2.5rem] p-8 backdrop-blur-xl hover:border-violet-500/30 transition-all relative overflow-hidden flex flex-col">
                                        <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:scale-125 transition-transform duration-700">
                                            <Building2 size={120} />
                                        </div>

                                        <div className="flex justify-between items-start mb-8 relative z-10">
                                            <div className="w-16 h-16 rounded-2xl bg-[#0a0a1a] border border-white/10 flex items-center justify-center text-4xl shadow-xl group-hover:scale-110 transition-transform duration-500">
                                                {job.logo}
                                            </div>
                                            <div className="flex flex-col items-end gap-2">
                                                {job.status === 'Applied' ? (
                                                    <span className="px-3 py-1 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-full text-[9px] font-black tracking-widest uppercase">APPLIED</span>
                                                ) : job.status === 'Shortlisted' ? (
                                                    <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full text-[9px] font-black tracking-widest uppercase">SHORTLISTED</span>
                                                ) : (
                                                    <span className="px-3 py-1 bg-amber-500/10 border border-amber-500/20 text-amber-500 rounded-full text-[9px] font-black tracking-widest uppercase">ELIGIBLE</span>
                                                )}
                                                <span className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">DEADLINE: {job.deadline}</span>
                                            </div>
                                        </div>

                                        <div className="relative z-10 flex-1">
                                            <h3 className="text-xl font-black text-white group-hover:text-violet-400 transition-colors uppercase tracking-tight leading-tight mb-2">{job.company}</h3>
                                            <p className="text-sm font-bold text-slate-400 mb-8 uppercase tracking-widest">{job.role}</p>

                                            <div className="grid grid-cols-2 gap-4 mb-8">
                                                <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-tight">
                                                    <MapPin size={14} className="text-violet-400" />
                                                    {job.location}
                                                </div>
                                                <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-tight">
                                                    <DollarSign size={14} className="text-violet-400" />
                                                    {job.salary}
                                                </div>
                                            </div>

                                            <div className="flex flex-wrap gap-2 mb-10">
                                                {job.tags.map(tag => (
                                                    <span key={tag} className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-[9px] font-bold text-slate-400 uppercase tracking-widest">{tag}</span>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="relative z-10 pt-8 border-t border-white/5 flex gap-4">
                                            <button className="flex-1 py-4 bg-white/5 border border-white/10 hover:border-white/20 text-white font-black text-xs tracking-widest rounded-2xl transition-all uppercase">DETAILS</button>
                                            <button className={`flex-1 py-4 font-black text-xs tracking-widest rounded-2xl transition-all uppercase shadow-xl ${job.status === 'Eligible' ? 'bg-violet-600 text-white hover:bg-violet-500 shadow-violet-500/20' : 'bg-[#000]/40 text-slate-600 cursor-not-allowed border border-white/5'
                                                }`}>
                                                {job.status === 'Applied' ? 'APPLIED' : job.status === 'Shortlisted' ? 'PROCEED' : 'APPLY NOW'}
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {selectedTab === 'interviews' && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.98 }}
                            className="grid grid-cols-1 lg:grid-cols-2 gap-8"
                        >
                            {INTERVIEWS.map((interview, i) => (
                                <div key={i} className="bg-[#0a0a1a]/60 border border-white/5 rounded-[2.5rem] p-10 backdrop-blur-xl relative overflow-hidden group">
                                    <div className="flex justify-between items-start mb-10">
                                        <div className="flex items-center gap-6">
                                            <div className="w-16 h-16 rounded-2xl bg-violet-600/10 border border-violet-500/20 flex items-center justify-center text-violet-400 shadow-xl">
                                                <MessageSquare size={32} />
                                            </div>
                                            <div>
                                                <div className="text-[10px] font-black text-violet-400 uppercase tracking-[0.2em] mb-1">INTERVIEW ROUND</div>
                                                <h3 className="text-2xl font-black text-white uppercase tracking-tight">{interview.title}</h3>
                                            </div>
                                        </div>
                                        <div className="p-3 bg-white/5 rounded-xl text-slate-600"><Clock size={20} /></div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-8 mb-10">
                                        <div>
                                            <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">COMPANY</div>
                                            <div className="text-base font-bold text-white uppercase">{interview.company}</div>
                                        </div>
                                        <div>
                                            <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">DATE & TIME</div>
                                            <div className="text-base font-bold text-white uppercase">{interview.date} {interview.time !== '-' && `• ${interview.time}`}</div>
                                        </div>
                                        <div>
                                            <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">MODE</div>
                                            <div className="text-base font-bold text-white uppercase">{interview.mode}</div>
                                        </div>
                                    </div>

                                    {interview.link ? (
                                        <div className="flex gap-4">
                                            <button className="flex-1 py-4 bg-emerald-600 hover:bg-emerald-500 text-black font-black text-xs tracking-[0.2em] rounded-2xl shadow-xl shadow-emerald-500/20 transition-all uppercase flex items-center justify-center gap-2">
                                                JOIN MEETING <Zap size={16} />
                                            </button>
                                            <button className="px-6 py-4 bg-white/5 border border-white/10 text-white rounded-2xl hover:bg-white/10 transition-all"><LinkIcon size={18} /></button>
                                        </div>
                                    ) : (
                                        <div className="w-full py-4 bg-white/5 border border-dashed border-white/10 text-slate-500 text-[10px] font-black uppercase text-center rounded-2xl tracking-[0.2em]">WAITING FOR SCHEDULE</div>
                                    )}
                                </div>
                            ))}
                        </motion.div>
                    )}

                    {selectedTab === 'tracking' && (
                        <motion.div
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-[#0a0a1a]/60 border border-white/5 rounded-[2.5rem] p-10 backdrop-blur-xl"
                        >
                            <h3 className="text-2xl font-black text-white uppercase tracking-tight mb-10">Application Pipeline</h3>
                            <div className="space-y-6">
                                {APPLICATIONS.map((app, i) => (
                                    <div key={i} className="p-6 rounded-3xl bg-white/[0.02] border border-white/5 flex items-center justify-between group hover:bg-white/[0.04] transition-all">
                                        <div className="flex items-center gap-8">
                                            <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-3xl">🏢</div>
                                            <div>
                                                <h4 className="text-lg font-black text-white uppercase tracking-tight mb-1">{app.company}</h4>
                                                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{app.role} • Applied {app.appliedOn}</div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-12">
                                            <div>
                                                <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1 text-right">LATEST STEP</div>
                                                <div className="text-xs font-bold text-white uppercase text-right">{app.step}</div>
                                            </div>
                                            <div className="w-40">
                                                <span className={`w-full inline-block py-2 text-center rounded-xl text-[9px] font-black tracking-[0.2em] uppercase ${app.status === 'Selected' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' :
                                                    app.status === 'Rejected' ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                                                    }`}>
                                                    {app.status}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {selectedTab === 'offers' && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="max-w-2xl mx-auto"
                        >
                            <div className="bg-gradient-to-br from-[#10b981]/20 via-[#0a0a1a] to-[#0a0a1a] border border-[#10b981]/30 rounded-[3rem] p-12 backdrop-blur-xl relative overflow-hidden group">
                                <div className="absolute -top-10 -right-10 w-48 h-48 bg-emerald-500/10 blur-[60px] rounded-full" />
                                <div className="absolute bottom-10 left-10 w-24 h-24 bg-violet-500/5 blur-[40px] rounded-full" />

                                <div className="relative z-10 flex flex-col items-center text-center">
                                    <div className="w-24 h-24 rounded-[2rem] bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-8 shadow-2xl">
                                        <Award size={48} />
                                    </div>
                                    <h2 className="text-3xl font-black text-white uppercase tracking-tight mb-4 leading-tight">Congratultions, Jagadesh!</h2>
                                    <p className="text-slate-400 font-medium mb-10 max-w-sm">You have received a formal placement offer from <span className="text-emerald-400 font-black">Wipro Limited</span> for the role of Project Engineer.</p>

                                    <div className="grid grid-cols-2 gap-4 w-full mb-10">
                                        <div className="p-6 rounded-3xl bg-white/[0.03] border border-white/5">
                                            <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">ANNUAL CTC</div>
                                            <div className="text-xl font-black text-white tracking-tight">₹6.50 LPA</div>
                                        </div>
                                        <div className="p-6 rounded-3xl bg-white/[0.03] border border-white/5">
                                            <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">JOINING DATE</div>
                                            <div className="text-xl font-black text-white tracking-tight">JUNE 2026</div>
                                        </div>
                                    </div>

                                    <div className="flex gap-4 w-full">
                                        <button className="flex-1 py-5 bg-emerald-600 hover:bg-emerald-500 text-black font-black text-xs tracking-[0.2em] rounded-[1.5rem] shadow-2xl transition-all uppercase flex items-center justify-center gap-2">
                                            VIEW OFFER LETTER <Eye size={18} />
                                        </button>
                                        <button className="px-8 py-5 bg-white/5 border border-white/10 text-white rounded-[1.5rem] hover:bg-white/10 transition-all uppercase text-[10px] font-black tracking-widest">
                                            UPLOAD SIGNED SOP <Upload size={18} className="inline ml-2" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </DashboardLayout>
    );
}

import { FileText } from 'lucide-react';
