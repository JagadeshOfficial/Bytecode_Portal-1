"use client";

import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { motion } from 'framer-motion';
import {
    Building2,
    Calendar,
    ChevronRight,
    MapPin,
    Briefcase,
    ArrowRight,
    Search,
    Filter,
    CheckCircle2,
    Clock,
    XCircle,
    Monitor
} from 'lucide-react';

const COMPANIES = [
    {
        id: 1,
        name: "Infosys",
        logo: "🔷",
        role: "Systems Engineer",
        package: "3.6 - 5.5 LPA",
        deadline: "Apply by 15 Feb",
        status: "Applied",
        eligibility: true,
        location: "Pan India",
        rounds: ["Aptitude", "Technical", "HR"]
    },
    {
        id: 2,
        name: "TCS",
        logo: "🏢",
        role: "Ninja / Digital",
        package: "3.5 - 7.0 LPA",
        deadline: "Apply by 20 Feb",
        status: "Eligible",
        eligibility: true,
        location: "Pune, Bangalore",
        rounds: ["NQT", "Technical Interview", "MR", "HR"]
    },
    {
        id: 3,
        name: "Accenture",
        logo: "✴️",
        role: "ASE / SASE",
        package: "4.5 - 6.5 LPA",
        deadline: "Apply by 25 Feb",
        status: "Shortlisted",
        eligibility: true,
        location: "Hyderabad",
        rounds: ["Cognitive", "Coding", "Communication", "Interview"]
    },
    {
        id: 4,
        name: "Google",
        logo: "🔍",
        role: "Cloud Engineer",
        package: "18 - 25 LPA",
        deadline: "Apply by 10 Feb",
        status: "Expired",
        eligibility: false,
        location: "Bangalore",
        rounds: ["DS Round", "System Design", "Googlyness"]
    }
];

const STATS = [
    { label: "Total Applications", value: "12", icon: Briefcase, color: "text-[#7c3aed]" },
    { label: "Shortlisted", value: "4", icon: CheckCircle2, color: "text-emerald-400" },
    { label: "Interviews", value: "2", icon: Clock, color: "text-amber-400" },
    { label: "Offers", value: "1", icon: Monitor, color: "text-[#22d3ee]" },
];

export default function PlacementPortal() {
    return (
        <DashboardLayout role="student">
            <div className="flex flex-col gap-8">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-[Rajdhani] font-bold text-white tracking-widest">
                            Placement <span className="text-[#22d3ee]">HQ</span>
                        </h1>
                        <p className="text-[var(--text-dim)]">Track your career journey with top MNCs</p>
                    </div>
                    <div className="flex gap-3">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-dim)]" />
                            <input
                                type="text"
                                placeholder="Search companies..."
                                className="pl-10 pr-4 py-2 bg-[rgba(255,255,255,0.03)] border border-[rgba(124,58,237,0.2)] rounded-lg text-sm text-white focus:outline-none focus:border-[#7c3aed] transition-all w-64"
                            />
                        </div>
                        <button className="p-2 bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-lg hover:bg-[rgba(255,255,255,0.1)] transition-all">
                            <Filter className="w-5 h-5 text-white" />
                        </button>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {STATS.map((stat, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="bg-[rgba(19,10,48,0.5)] border border-[rgba(124,58,237,0.1)] rounded-2xl p-6 backdrop-blur-md relative overflow-hidden group"
                        >
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-sm font-bold text-[var(--text-dim)] uppercase tracking-wider">{stat.label}</span>
                                <stat.icon className={`w-5 h-5 ${stat.color}`} />
                            </div>
                            <div className="text-3xl font-bold text-white font-[Rajdhani]">{stat.value}</div>
                            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#7c3aed] to-transparent opacity-30 group-hover:opacity-100 transition-opacity" />
                        </motion.div>
                    ))}
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Active Job Roles */}
                    <div className="lg:col-span-2 flex flex-col gap-6">
                        <div className="flex justify-between items-center">
                            <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                <Briefcase className="w-5 h-5 text-[#7c3aed]" />
                                Active Opportunities
                            </h3>
                            <button className="text-[#22d3ee] text-sm hover:underline">View All</button>
                        </div>

                        <div className="grid grid-cols-1 gap-4">
                            {COMPANIES.map((company, idx) => (
                                <motion.div
                                    key={company.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="group relative bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.05)] hover:border-[#7c3aed] rounded-2xl p-6 transition-all cursor-pointer overflow-hidden"
                                >
                                    <div className="flex flex-col md:flex-row justify-between gap-6">
                                        <div className="flex gap-5">
                                            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[rgba(124,58,237,0.1)] to-[rgba(217,70,239,0.1)] flex items-center justify-center text-3xl border border-[rgba(255,255,255,0.05)]">
                                                {company.logo}
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-3 mb-1">
                                                    <h4 className="text-xl font-bold text-white group-hover:text-[#22d3ee] transition-colors">{company.name}</h4>
                                                    <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${company.status === 'Applied' ? 'bg-emerald-500/20 text-emerald-400' :
                                                            company.status === 'Shortlisted' ? 'bg-[#7c3aed]/20 text-[#7c3aed]' :
                                                                company.status === 'Eligible' ? 'bg-[#22d3ee]/20 text-[#22d3ee]' :
                                                                    'bg-red-500/20 text-red-400'
                                                        }`}>
                                                        {company.status}
                                                    </span>
                                                </div>
                                                <p className="text-md text-[var(--text-glow)] font-semibold mb-2">{company.role}</p>
                                                <div className="flex flex-wrap gap-4 text-xs text-[var(--text-dim)]">
                                                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {company.location}</span>
                                                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {company.deadline}</span>
                                                    <span className="text-[#22d3ee] font-bold">{company.package}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex flex-col justify-between items-end gap-4">
                                            <div className="flex -space-x-2">
                                                {company.rounds.slice(0, 3).map((round, rIdx) => (
                                                    <div key={rIdx} className="w-8 h-8 rounded-full bg-[#030014] border border-[#7c3aed]/30 flex items-center justify-center text-[10px] text-white font-bold" title={round}>
                                                        R{rIdx + 1}
                                                    </div>
                                                ))}
                                                {company.rounds.length > 3 && (
                                                    <div className="w-8 h-8 rounded-full bg-[#030014] border border-[#7c3aed]/30 flex items-center justify-center text-[10px] text-white font-bold">
                                                        +{company.rounds.length - 3}
                                                    </div>
                                                )}
                                            </div>
                                            <button className={`flex items-center gap-2 px-6 py-2 rounded-lg font-bold transition-all ${company.status === 'Eligible'
                                                    ? 'bg-[#7c3aed] text-white shadow-[0_0_15px_rgba(124,58,237,0.4)] hover:shadow-[0_0_25px_rgba(124,58,237,0.6)]'
                                                    : 'bg-white/5 text-[var(--text-dim)] cursor-not-allowed'
                                                }`}>
                                                {company.status === 'Eligible' ? 'Apply Now' : 'View Details'}
                                                <ArrowRight className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Hover Glow Effect */}
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#7c3aed]/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Right Panel: Preparation & Status */}
                    <div className="flex flex-col gap-8">
                        {/* Application Pipeline */}
                        <div className="bg-[rgba(19,10,48,0.5)] border border-[rgba(124,58,237,0.1)] rounded-2xl p-6 backdrop-blur-md">
                            <h3 className="text-lg font-bold text-white mb-6 uppercase tracking-wider">Hiring Pipeline</h3>
                            <div className="space-y-6">
                                {[
                                    { step: "Applied", count: 12, status: "completed" },
                                    { step: "Aptitude Test", count: 8, status: "active" },
                                    { step: "Technical Interview", count: 4, status: "pending" },
                                    { step: "HR Discussion", count: 2, status: "pending" },
                                    { step: "Offer Release", count: 1, status: "pending" }
                                ].map((step, idx) => (
                                    <div key={idx} className="flex items-center gap-4">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border ${step.status === 'completed' ? 'bg-[#7c3aed] border-[#7c3aed] text-white' :
                                                step.status === 'active' ? 'bg-[rgba(34,211,238,0.1)] border-[#22d3ee] text-[#22d3ee]' :
                                                    'bg-transparent border-[rgba(255,255,255,0.1)] text-[var(--text-dim)]'
                                            }`}>
                                            {step.status === 'completed' ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex justify-between text-sm mb-1">
                                                <span className={step.status === 'pending' ? 'text-[var(--text-dim)]' : 'text-white'}>{step.step}</span>
                                                <span className="font-bold text-[#22d3ee]">{step.count}</span>
                                            </div>
                                            <div className="w-full h-1 bg-[rgba(255,255,255,0.05)] rounded-full overflow-hidden">
                                                <div className={`h-full ${step.status === 'completed' ? 'bg-[#7c3aed]' :
                                                        step.status === 'active' ? 'bg-[#22d3ee]' :
                                                            'bg-transparent'
                                                    }`} style={{ width: `${(step.count / 12) * 100}%` }} />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Readiness Score */}
                        <div className="bg-[rgba(19,10,48,0.5)] border border-[rgba(34,211,238,0.1)] rounded-2xl p-6 backdrop-blur-md relative overflow-hidden">
                            <h3 className="text-lg font-bold text-white mb-2 underline decoration-[#22d3ee]">Placement Readiness</h3>
                            <div className="flex items-center justify-between mb-4">
                                <div className="text-4xl font-bold font-[Rajdhani] text-white">84<span className="text-xl text-[var(--text-dim)]">/100</span></div>
                                <div className="text-xs text-emerald-400 font-bold">+5.2% this month</div>
                            </div>
                            <div className="space-y-3">
                                <div className="flex justify-between text-xs">
                                    <span className="text-[var(--text-dim)]">Aptitude</span>
                                    <span className="text-white">92%</span>
                                </div>
                                <div className="w-full h-1.5 bg-[rgba(255,255,255,0.05)] rounded-full overflow-hidden">
                                    <div className="h-full bg-emerald-400 w-[92%]" />
                                </div>
                                <div className="flex justify-between text-xs pt-1">
                                    <span className="text-[var(--text-dim)]">Coding</span>
                                    <span className="text-white">78%</span>
                                </div>
                                <div className="w-full h-1.5 bg-[rgba(255,255,255,0.05)] rounded-full overflow-hidden">
                                    <div className="h-full bg-blue-500 w-[78%]" />
                                </div>
                                <div className="flex justify-between text-xs pt-1">
                                    <span className="text-[var(--text-dim)]">Communication</span>
                                    <span className="text-white">82%</span>
                                </div>
                                <div className="w-full h-1.5 bg-[rgba(255,255,255,0.05)] rounded-full overflow-hidden">
                                    <div className="h-full bg-purple-500 w-[82%]" />
                                </div>
                            </div>
                            <button className="w-full mt-6 py-3 bg-[rgba(34,211,238,0.1)] border border-[#22d3ee]/30 rounded-xl text-[#22d3ee] text-sm font-bold hover:bg-[#22d3ee] hover:text-white transition-all">
                                Take Mock Assessment
                            </button>

                            {/* Abstract bg element */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-[#22d3ee]/5 blur-3xl -z-10" />
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
