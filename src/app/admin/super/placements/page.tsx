"use client";

import { useState, useEffect } from 'react';
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
    Clock,
    Trash2,
    Edit,
    X,
    Save,
    Eye
} from 'lucide-react';

import api from '@/lib/api';

export default function PlacementsPage() {
    const [activeTab, setActiveTab] = useState('overview');
    const [placements, setPlacements] = useState<any[]>([]);
    const [jobs, setJobs] = useState<any[]>([]);
    const [partners, setPartners] = useState<any[]>([]);
    const [candidates, setCandidates] = useState<any[]>([]);
    const [stats, setStats] = useState([
        { label: "Total Placed", value: "0", icon: Award, color: "#f59e0b", trend: "Loading..." },
        { label: "Active Companies", value: "0", icon: Building2, color: "#3b82f6", trend: "Loading..." },
        { label: "Avg. Package", value: "0 LPA", icon: Briefcase, color: "#10b981", trend: "Loading..." },
        { label: "Total Candidates", value: "0", icon: Users, color: "#8b5cf6", trend: "Loading..." },
    ]);
    const [chartData, setChartData] = useState<{ months: string[], counts: number[], heights: number[] }>({
        months: ['Sep', 'Oct', 'Nov', 'Dec', 'Jan'],
        counts: [0, 0, 0, 0, 0],
        heights: [0, 0, 0, 0, 0]
    });
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        setSearchTerm('');
    }, [activeTab]);

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalType, setModalType] = useState<'placement' | 'job' | 'candidate' | 'view_candidate' | null>(null);

    // Generic form data state
    const [formData, setFormData] = useState<any>({});

    const fetchData = async () => {
        try {
            // Use Promise.allSettled to avoid crashing if one service is down
            const results = await Promise.allSettled([
                api.get('/placements/records'),
                api.get('/placements/jobs'),
                api.get('/users')
            ]);

            const placemenData = results[0].status === 'fulfilled' ? results[0].value.data : [];
            const jobsData = results[1].status === 'fulfilled' ? results[1].value.data : [];
            const usersData = results[2].status === 'fulfilled' ? results[2].value.data : [];

            if (results[0].status === 'rejected') console.error("Placements API failed", results[0].reason);
            if (results[1].status === 'rejected') console.error("Jobs API failed", results[1].reason);
            if (results[2].status === 'rejected') console.error("Users API failed", results[2].reason);

            setPlacements(placemenData || []);
            setJobs(jobsData || []);

            // Process Candidates
            const studentCandidates = usersData.filter((u: any) => u.role === 'STUDENT');
            setCandidates(studentCandidates);

            // Process Partners
            const partnerMap = new Map();

            // From Placements
            placemenData.forEach((p: any) => {
                const normName = p.companyName.trim();
                if (!partnerMap.has(normName)) {
                    partnerMap.set(normName, {
                        name: normName,
                        type: "Hiring Partner",
                        location: "Global",
                        hiring: "Selective",
                        logo: normName.charAt(0).toUpperCase(),
                        color: "text-blue-500",
                        openings: 0
                    });
                }
            });

            // From Jobs
            jobsData.forEach((j: any) => {
                const normName = j.companyName.trim();
                if (partnerMap.has(normName)) {
                    const p = partnerMap.get(normName);
                    p.openings += 1;
                    p.hiring = "Active";
                    p.location = j.location || p.location;
                    partnerMap.set(normName, p);
                } else {
                    partnerMap.set(normName, {
                        name: normName,
                        type: "Hiring Partner",
                        location: j.location,
                        hiring: "Active",
                        logo: normName.charAt(0).toUpperCase(),
                        color: "text-emerald-500",
                        openings: 1
                    });
                }
            });

            setPartners(Array.from(partnerMap.values()));

            // Chart Data Calculation
            const months = [];
            const chartCounts = [];
            const today = new Date();

            for (let i = 4; i >= 0; i--) {
                const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
                const monthName = d.toLocaleString('default', { month: 'short' });
                months.push(monthName);

                const count = placemenData.filter((p: any) => {
                    if (!p.placementDate) return false;
                    const pd = new Date(p.placementDate);
                    return pd.getMonth() === d.getMonth() && pd.getFullYear() === d.getFullYear();
                }).length;
                chartCounts.push(count);
            }

            const maxCount = Math.max(...chartCounts, 5); // Minimum scale of 5 to avoid flat charts
            const heights = chartCounts.map(c => Math.round((c / maxCount) * 100));
            setChartData({ months, counts: chartCounts, heights });

            const total = placemenData.length;
            const uniqueCompanies = partnerMap.size;
            const avgPkg = total > 0
                ? (placemenData.reduce((acc: number, p: any) => acc + (p.packageLPA || 0), 0) / total).toFixed(1)
                : "0";

            setStats([
                { label: "Total Placed", value: `${total}+`, icon: Award, color: "#f59e0b", trend: "+12% YoY" },
                { label: "Active Companies", value: `${uniqueCompanies}`, icon: Building2, color: "#3b82f6", trend: "+5 New" },
                { label: "Avg. Package", value: `₹${avgPkg} LPA`, icon: Briefcase, color: "#10b981", trend: "+1.2L" },
                { label: "Total Candidates", value: `${studentCandidates.length}`, icon: Users, color: "#8b5cf6", trend: "Active Pool" },
            ]);
        } catch (err) {
            console.error("Failed to fetch data:", err);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // --- Modal Openers ---

    const openPlacementModal = (data: any = null) => {
        setModalType('placement');
        setFormData(data || { studentName: '', companyName: '', role: '', packageLPA: '', placementDate: new Date().toISOString().split('T')[0] });
        setIsModalOpen(true);
    };

    const openJobModal = (data: any = null) => {
        setModalType('job');
        setFormData(data || { companyName: '', jobTitle: '', location: 'Bangalore', salaryPackage: '', eligibility: 'B.Tech', driveDate: new Date().toISOString().split('T')[0], active: true, skillsRequired: [] });
        setIsModalOpen(true);
    };

    const openCandidateModal = (data: any = null) => {
        setModalType('candidate');
        // If editing, don't require password. If new, default to 'password123' or ask user.
        setFormData(data || { fullName: '', email: '', branch: 'CSE', role: 'STUDENT', phoneNumber: '', password: 'password123' });
        setIsModalOpen(true);
    };

    const openViewCandidateModal = (data: any) => {
        setModalType('view_candidate');
        setFormData(data);
        setIsModalOpen(true);
    };

    // --- Actions ---

    const handleDelete = async (type: 'placement' | 'job' | 'candidate', id: string) => {
        if (confirm("Are you sure you want to delete this record?")) {
            try {
                if (type === 'placement') await api.delete(`/placements/records/${id}`);
                if (type === 'job') await api.delete(`/placements/jobs/${id}`);
                if (type === 'candidate') await api.delete(`/users/${id}`);
                fetchData();
            } catch (err) {
                console.error(`Failed to delete ${type}:`, err);
                alert("Failed to delete record.");
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (modalType === 'placement') {
                if (formData.id) await api.put(`/placements/records/${formData.id}`, formData);
                else await api.post('/placements/records', formData);
            } else if (modalType === 'job') {
                // Ensure skills is array if string
                const payload = { ...formData };
                if (typeof payload.skillsRequired === 'string') {
                    payload.skillsRequired = payload.skillsRequired.split(',').map((s: string) => s.trim());
                }
                if (formData.id) await api.put(`/placements/jobs/${formData.id}`, payload);
                else await api.post('/placements/jobs', payload);
            } else if (modalType === 'candidate') {
                if (formData.id) await api.put(`/users/${formData.id}`, formData);
                else await api.post('/users', { ...formData, role: 'STUDENT', active: true });
            }
            setIsModalOpen(false);
            fetchData();
        } catch (err) {
            console.error("Failed to save:", err);
            alert("Failed to save record.");
        }
    };



    const filteredPlacements = placements.filter(p =>
        (p.studentName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (p.companyName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (p.role?.toLowerCase() || '').includes(searchTerm.toLowerCase())
    );

    const filteredPartners = partners.filter(p =>
        (p.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (p.location?.toLowerCase() || '').includes(searchTerm.toLowerCase())
    );

    const filteredCandidates = candidates.filter(c =>
        (c.fullName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (c.email?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (c.branch?.toLowerCase() || '').includes(searchTerm.toLowerCase())
    );

    const filteredJobs = jobs.filter(j =>
        (j.companyName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (j.jobTitle?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (j.location?.toLowerCase() || '').includes(searchTerm.toLowerCase())
    );

    return (
        <AdvancedModuleLayout
            title="Placement & Careers"
            subtitle="Manage corporate relations, student placements, and interview schedules."
            stats={stats}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            tabs={[
                { id: 'overview', label: 'Overview', icon: Globe },
                { id: 'students', label: 'Placed Students', icon: CheckCircle },
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
                            <button onClick={() => setActiveTab('drives')} className="text-xs text-blue-400 font-bold hover:underline">View All</button>
                        </div>
                        <div className="space-y-4">
                            {jobs.slice(0, 3).map((drive, i) => (
                                <div key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5 hover:border-blue-500/30 transition-all cursor-pointer group">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-white text-lg shadow-lg bg-slate-800`}>
                                            {drive.companyName.charAt(0)}
                                        </div>
                                        <div>
                                            <div className="font-bold text-white text-lg group-hover:text-blue-400 transition-colors">{drive.companyName}</div>
                                            <div className="text-sm text-slate-400 font-medium">{drive.jobTitle}</div>
                                            <div className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                                                <Clock size={12} /> {drive.driveDate ? new Date(drive.driveDate).toLocaleDateString() : 'TBD'}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase border ${drive.location === 'Remote' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-violet-500/10 text-violet-400 border-violet-500/20'}`}>
                                            {drive.location}
                                        </span>
                                        <button className="flex items-center gap-1 text-xs font-bold text-slate-400 hover:text-white mt-3 ml-auto transition-colors">
                                            Details <ArrowUpRight size={12} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                            {jobs.length === 0 && <div className="text-slate-500 text-center py-4">No upcoming drives found.</div>}
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
                                {chartData.heights.map((h, i) => (
                                    <div key={i} className="w-8 h-full bg-slate-800 rounded-t-lg relative group flex items-end">
                                        <div
                                            className="w-full bg-gradient-to-t from-blue-600 to-cyan-400 rounded-t-lg transition-all duration-500 hover:from-blue-500 hover:to-cyan-300"
                                            style={{ height: `${h}%` }}
                                        ></div>
                                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-white text-slate-900 text-[10px] font-bold px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                                            {chartData.counts[i]} Placed
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-2 px-2">
                                {chartData.months.map((m, i) => (
                                    <span key={i}>{m}</span>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                </div>
            )}

            {activeTab === 'students' && (
                <div className="space-y-6">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-bold text-white">Placed Students ({placements.length})</h2>
                        <div className="flex gap-4">
                            <div className="relative w-72">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                                <input type="text" placeholder="Search students..."
                                    value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full bg-slate-900/50 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors" />
                            </div>
                            <button onClick={() => openPlacementModal()} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-colors">
                                <Plus size={16} /> Add New
                            </button>
                        </div>
                    </div>

                    <div className="bg-slate-900/50 border border-white/5 rounded-2xl overflow-hidden backdrop-blur-sm">
                        <table className="w-full text-left text-sm text-slate-400">
                            <thead className="bg-white/5 text-white font-bold uppercase text-xs">
                                <tr>
                                    <th className="px-6 py-4">Student Name</th>
                                    <th className="px-6 py-4">Company</th>
                                    <th className="px-6 py-4">Role</th>
                                    <th className="px-6 py-4">Package (LPA)</th>
                                    <th className="px-6 py-4">Date</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {filteredPlacements.map((p, i) => (
                                    <tr key={p.id || i} className="hover:bg-white/5 transition-colors">
                                        <td className="px-6 py-4 font-medium text-white flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-xs font-bold text-white">
                                                {p.studentName ? p.studentName.charAt(0) : '?'}
                                            </div>
                                            {p.studentName}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="flex items-center gap-2">
                                                <Building2 size={14} className="text-slate-500" /> {p.companyName}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">{p.role}</td>
                                        <td className="px-6 py-4 text-emerald-400 font-bold">₹{p.packageLPA} LPA</td>
                                        <td className="px-6 py-4 text-slate-500">
                                            {p.placementDate ? new Date(p.placementDate).toLocaleDateString() : 'N/A'}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button onClick={() => openPlacementModal(p)} className="p-2 hover:bg-white/10 rounded-lg text-blue-400 transition-colors" title="Edit">
                                                    <Edit size={16} />
                                                </button>
                                                <button onClick={() => handleDelete('placement', p.id)} className="p-2 hover:bg-white/10 rounded-lg text-red-400 transition-colors" title="Delete">
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {placements.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                                            No placement records found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {activeTab === 'companies' && (
                <div className="space-y-6">
                    <div className="flex justify-between items-center">
                        <div className="relative w-96">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                            <input type="text" placeholder="Search partners..."
                                value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-slate-900/50 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors" />
                        </div>
                        <div className="flex gap-2">
                            <button onClick={() => openJobModal()} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-colors">
                                <Plus size={16} /> Add Hiring Drive
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredPartners.map((comp, i) => (
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
                        {partners.length === 0 && (
                            <div className="col-span-full text-center text-slate-500 py-12">
                                No partner companies found.
                            </div>
                        )}
                    </div>
                </div>
            )}

            {activeTab === 'candidates' && (
                <div className="space-y-6">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-bold text-white">Candidate Pool ({candidates.length})</h2>
                        <div className="flex gap-4">
                            <div className="relative w-72">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                                <input type="text" placeholder="Search candidates..."
                                    value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full bg-slate-900/50 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors" />
                            </div>
                            <button onClick={() => openCandidateModal()} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-colors">
                                <Plus size={16} /> Add Candidate
                            </button>
                        </div>
                    </div>
                    <div className="bg-slate-900/50 border border-white/5 rounded-2xl overflow-hidden backdrop-blur-sm">
                        <table className="w-full text-left text-sm text-slate-400">
                            <thead className="bg-white/5 text-white font-bold uppercase text-xs">
                                <tr>
                                    <th className="px-6 py-4">Name</th>
                                    <th className="px-6 py-4">Email</th>
                                    <th className="px-6 py-4">Branch</th>
                                    <th className="px-6 py-4">Role</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {filteredCandidates.map((c, i) => (
                                    <tr key={c.id || i} className="hover:bg-white/5 transition-colors">
                                        <td className="px-6 py-4 font-medium text-white flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold text-white uppercase">
                                                {c.fullName ? c.fullName.charAt(0) : '?'}
                                            </div>
                                            {c.fullName}
                                        </td>
                                        <td className="px-6 py-4">{c.email}</td>
                                        <td className="px-6 py-4">{c.branch || 'N/A'}</td>
                                        <td className="px-6 py-4">
                                            <span className="px-2 py-1 bg-blue-500/10 text-blue-400 rounded text-xs font-bold uppercase">
                                                {c.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button onClick={() => openViewCandidateModal(c)} className="p-2 hover:bg-white/10 rounded-lg text-emerald-400 transition-colors" title="View">
                                                    <Eye size={16} />
                                                </button>
                                                <button onClick={() => openCandidateModal(c)} className="p-2 hover:bg-white/10 rounded-lg text-blue-400 transition-colors" title="Edit">
                                                    <Edit size={16} />
                                                </button>
                                                <button onClick={() => handleDelete('candidate', c.id)} className="p-2 hover:bg-white/10 rounded-lg text-red-400 transition-colors" title="Delete">
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {candidates.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                                            No candidates found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {activeTab === 'drives' && (
                <div className="space-y-6">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-bold text-white">Active Hiring Drives ({filteredJobs.length})</h2>
                        <div className="flex gap-4">
                            <div className="relative w-72">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                                <input type="text" placeholder="Search drives..."
                                    value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full bg-slate-900/50 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors" />
                            </div>
                            <button onClick={() => openJobModal()} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-colors">
                                <Plus size={16} /> Add Drive
                            </button>
                        </div>
                    </div>
                    <div className="space-y-4">
                        {filteredJobs.map((drive, i) => (
                            <div key={i} className="flex items-center justify-between p-4 bg-slate-900/50 rounded-xl border border-white/5 hover:border-blue-500/30 transition-all cursor-pointer group">
                                <div className="flex items-center gap-4">
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-white text-lg shadow-lg bg-slate-800`}>
                                        {drive.companyName.charAt(0)}
                                    </div>
                                    <div>
                                        <div className="font-bold text-white text-lg group-hover:text-blue-400 transition-colors">{drive.companyName}</div>
                                        <div className="text-sm text-slate-400 font-medium">{drive.jobTitle}</div>
                                        <div className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                                            <Clock size={12} /> {drive.driveDate ? new Date(drive.driveDate).toLocaleDateString() : 'TBD'}
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right flex items-center gap-4">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase border ${drive.location === 'Remote' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-violet-500/10 text-violet-400 border-violet-500/20'}`}>
                                        {drive.location}
                                    </span>
                                    <div className="flex gap-2">
                                        <button onClick={(e) => { e.stopPropagation(); openJobModal(drive); }} className="p-2 hover:bg-white/10 rounded-lg text-blue-400" title="Edit">
                                            <Edit size={16} />
                                        </button>
                                        <button onClick={(e) => { e.stopPropagation(); handleDelete('job', drive.id); }} className="p-2 hover:bg-white/10 rounded-lg text-red-400" title="Delete">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {jobs.length === 0 && (
                            <div className="text-center text-slate-500 py-12">
                                No active hiring drives found.
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-slate-900 border border-white/10 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
                    >
                        <div className="p-6 border-b border-white/10 flex justify-between items-center">
                            <h3 className="text-xl font-bold text-white">
                                {modalType === 'placement' && (formData.id ? 'Edit Placement' : 'Add New Placement')}
                                {modalType === 'job' && (formData.id ? 'Edit Hiring Drive' : 'Add Hiring Drive')}
                                {modalType === 'candidate' && (formData.id ? 'Edit Candidate' : 'Add Candidate')}
                                {modalType === 'view_candidate' && 'Candidate Profile'}
                            </h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        {modalType === 'view_candidate' ? (
                            <div className="p-6 space-y-4">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-20 h-20 rounded-full bg-slate-800 flex items-center justify-center text-2xl font-bold text-white uppercase">
                                        {formData.fullName?.charAt(0)}
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-bold text-white">{formData.fullName}</h4>
                                        <p className="text-slate-400">{formData.email}</p>
                                        <span className="mt-2 inline-block px-3 py-1 bg-blue-500/10 text-blue-400 rounded-full text-xs font-bold uppercase">
                                            {formData.role}
                                        </span>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div className="p-4 bg-slate-800/50 rounded-xl">
                                        <label className="block text-xs text-slate-500 uppercase font-bold mb-1">Branch</label>
                                        <div className="text-white font-medium">{formData.branch || 'N/A'}</div>
                                    </div>
                                    <div className="p-4 bg-slate-800/50 rounded-xl">
                                        <label className="block text-xs text-slate-500 uppercase font-bold mb-1">Phone</label>
                                        <div className="text-white font-medium">{formData.phoneNumber || 'N/A'}</div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="p-6 space-y-4">
                                {modalType === 'placement' && (
                                    <>
                                        <div>
                                            <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Student Name</label>
                                            <input type="text" required className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-2 text-white outline-none focus:border-blue-500"
                                                value={formData.studentName} onChange={(e) => setFormData({ ...formData, studentName: e.target.value })} />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Company</label>
                                            <input type="text" required className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-2 text-white outline-none focus:border-blue-500"
                                                value={formData.companyName} onChange={(e) => setFormData({ ...formData, companyName: e.target.value })} />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Role</label>
                                                <input type="text" required className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-2 text-white outline-none focus:border-blue-500"
                                                    value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })} />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Pkg (LPA)</label>
                                                <input type="number" step="0.1" required className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-2 text-white outline-none focus:border-blue-500"
                                                    value={formData.packageLPA || ''} onChange={(e) => setFormData({ ...formData, packageLPA: e.target.value })} />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Date</label>
                                            <input type="date" required className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-2 text-white outline-none focus:border-blue-500"
                                                value={formData.placementDate || ''} onChange={(e) => setFormData({ ...formData, placementDate: e.target.value })} />
                                        </div>
                                    </>
                                )}

                                {modalType === 'job' && (
                                    <>
                                        <div>
                                            <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Company</label>
                                            <input type="text" required className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-2 text-white outline-none focus:border-blue-500"
                                                value={formData.companyName || ''} onChange={(e) => setFormData({ ...formData, companyName: e.target.value })} />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Job Title</label>
                                            <input type="text" required className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-2 text-white outline-none focus:border-blue-500"
                                                value={formData.jobTitle || ''} onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })} />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Location</label>
                                                <input type="text" required className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-2 text-white outline-none focus:border-blue-500"
                                                    value={formData.location || ''} onChange={(e) => setFormData({ ...formData, location: e.target.value })} />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Salary</label>
                                                <input type="number" step="0.1" className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-2 text-white outline-none focus:border-blue-500"
                                                    value={formData.salaryPackage || ''} onChange={(e) => setFormData({ ...formData, salaryPackage: e.target.value })} />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Skills (comma separated)</label>
                                            <input type="text" className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-2 text-white outline-none focus:border-blue-500"
                                                value={Array.isArray(formData.skillsRequired) ? formData.skillsRequired.join(', ') : (formData.skillsRequired || '')}
                                                onChange={(e) => setFormData({ ...formData, skillsRequired: e.target.value })} />
                                        </div>
                                    </>
                                )}

                                {modalType === 'candidate' && (
                                    <>
                                        <div>
                                            <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Full Name</label>
                                            <input type="text" required className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-2 text-white outline-none focus:border-blue-500"
                                                value={formData.fullName || ''} onChange={(e) => setFormData({ ...formData, fullName: e.target.value })} />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Email</label>
                                            <input type="email" required className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-2 text-white outline-none focus:border-blue-500"
                                                value={formData.email || ''} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                                        </div>
                                        {!formData.id && (
                                            <div>
                                                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Password</label>
                                                <input type="password" required className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-2 text-white outline-none focus:border-blue-500"
                                                    value={formData.password || ''} onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
                                            </div>
                                        )}
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Branch</label>
                                                <input type="text" className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-2 text-white outline-none focus:border-blue-500"
                                                    value={formData.branch || ''} onChange={(e) => setFormData({ ...formData, branch: e.target.value })} />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Phone</label>
                                                <input type="text" className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-2 text-white outline-none focus:border-blue-500"
                                                    value={formData.phoneNumber || ''} onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })} />
                                            </div>
                                        </div>
                                    </>
                                )}

                                <div className="pt-4 flex gap-3">
                                    <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 bg-slate-800 hover:bg-slate-700 text-white py-3 rounded-xl font-bold transition-colors">
                                        Cancel
                                    </button>
                                    <button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold transition-colors flex items-center justify-center gap-2">
                                        <Save size={18} /> Save
                                    </button>
                                </div>
                            </form>
                        )}
                    </motion.div>
                </div>
            )}
        </AdvancedModuleLayout>
    );
}
