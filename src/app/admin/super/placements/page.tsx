"use client";

import { useState } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Briefcase, Building2, Award, Users, TrendingUp, Calendar,
    CheckCircle, Clock, MapPin, Globe, ExternalLink, Plus,
    Search, Filter, ChevronRight, BarChart3, PieChart, MoreHorizontal,
    FileText, Mail, Phone, Rocket, Target, LayoutGrid, List,
    UserCheck, Medal, Star, ArrowUpRight, ArrowLeft, Zap, Trophy, X, Sparkles, Lock
} from 'lucide-react';
import styles from '../SuperAdmin.module.css';

// -- Mock Data & Types --

interface CompanyPrifle {
    id: string;
    name: string;
    industry: string;
    location: string;
    hiringStatus: 'Active' | 'Frozen' | 'Closed';
    openPositions: number;
    logoColor: string;
}

interface PlacementOfficer {
    id: string;
    name: string;
    role: string;
    activeDrives: number;
    studentsPlaced: number;
    successRate: number; // Percentage
    avgPackage: string;
    rating: number; // 1-5
    avatarColor: string;
    fullReport: {
        recentPerformance: number[]; // Trend
        topPlacements: { student: string, company: string, pkg: string }[];
        studentPipeline: { stage: string, count: number, color: string }[];
    };
    dailyLog: {
        id: string;
        time: string;
        task: string;
        student?: string;
        type: 'Call' | 'Meeting' | 'Review' | 'Interview' | 'Email';
        status: 'Pending' | 'Completed' | 'In Progress';
    }[];
}

interface PlacementDrive {
    id: string;
    company: string;
    role: string;
    date: string;
    package: string;
    eligibleBatches: string[];
    status: 'Upcoming' | 'Registration Open' | 'In Progress' | 'Completed';
    applicants: number;
    assignedOfficer: string;
}

interface StudentOffer {
    id: string;
    studentName: string;
    studentId: string;
    company: string;
    role: string;
    package: string;
    offerDate: string;
    status: 'Accepted' | 'Pending' | 'Rejected';
    avatarColor: string;
    handledBy: string;
}

const OFFICERS: PlacementOfficer[] = [
    {
        id: 'PO1', name: 'Anjali Verma', role: 'Senior Placement Lead', activeDrives: 3, studentsPlaced: 45, successRate: 88, avgPackage: '6.5 LPA', rating: 4.8, avatarColor: '#ec4899',
        fullReport: {
            recentPerformance: [12, 19, 15, 25, 32, 45],
            topPlacements: [
                { student: 'Riya Singh', company: 'Microsoft', pkg: '45.0 LPA' },
                { student: 'Rahul V', company: 'HCL Tech', pkg: '5.2 LPA' }
            ],
            studentPipeline: [
                { stage: 'Screening', count: 120, color: '#3b82f6' },
                { stage: 'Interviewing', count: 45, color: '#f59e0b' },
                { stage: 'Offered', count: 12, color: '#10b981' }
            ]
        },
        dailyLog: [
            { id: 'T1', time: '09:30 AM', task: 'Review Resumes for Microsoft Drive', type: 'Review', status: 'Completed' },
            { id: 'T2', time: '11:00 AM', task: 'Mock Interview with Rahul V.', student: 'Rahul V.', type: 'Interview', status: 'Completed' },
            { id: 'T3', time: '02:00 PM', task: 'Follow-up Call: Offer Negotiation', student: 'Riya Singh', type: 'Call', status: 'In Progress' },
            { id: 'T4', time: '04:30 PM', task: 'Update Pipeline Status', type: 'Email', status: 'Pending' },
            { id: 'T5', time: '05:00 PM', task: 'Team Sync Meeting', type: 'Meeting', status: 'Pending' },
        ]
    },
    {
        id: 'PO2', name: 'Rajesh Koothrappali', role: 'Corporate Relations', activeDrives: 2, studentsPlaced: 32, successRate: 75, avgPackage: '5.2 LPA', rating: 4.5, avatarColor: '#3b82f6',
        fullReport: {
            recentPerformance: [8, 12, 15, 18, 25, 32],
            topPlacements: [{ student: 'Amit Kumar', company: 'Capgemini', pkg: '4.0 LPA' }],
            studentPipeline: [
                { stage: 'Screening', count: 85, color: '#3b82f6' },
                { stage: 'Interviewing', count: 30, color: '#f59e0b' },
                { stage: 'Offered', count: 8, color: '#10b981' }
            ]
        },
        dailyLog: [
            { id: 'T1', time: '10:00 AM', task: 'Client Meeting: Capgemini HR', type: 'Meeting', status: 'Completed' },
            { id: 'T2', time: '12:30 PM', task: 'Shortlist Students for Accenture', type: 'Review', status: 'In Progress' },
            { id: 'T3', time: '03:00 PM', task: 'Student Counseling Session', student: 'Amit Kumar', type: 'Call', status: 'Pending' },
        ]
    },
    {
        id: 'PO3', name: 'Suresh Raina', role: 'Placement Officer', activeDrives: 4, studentsPlaced: 28, successRate: 92, avgPackage: '7.8 LPA', rating: 4.9, avatarColor: '#10b981',
        fullReport: {
            recentPerformance: [5, 10, 15, 20, 25, 28],
            topPlacements: [{ student: 'Sneha R', company: 'Oracle', pkg: '9.0 LPA' }],
            studentPipeline: [
                { stage: 'Screening', count: 40, color: '#3b82f6' },
                { stage: 'Interviewing', count: 15, color: '#f59e0b' },
                { stage: 'Offered', count: 5, color: '#10b981' }
            ]
        },
        dailyLog: [
            { id: 'T1', time: '09:00 AM', task: 'Daily Standup', type: 'Meeting', status: 'Completed' },
            { id: 'T2', time: '11:00 AM', task: 'Drive Coordination: Zoho', type: 'Email', status: 'Completed' },
            { id: 'T3', time: '04:00 PM', task: 'Pre-placement Talk Prep', type: 'Review', status: 'Pending' },
        ]
    },
];

const COMPANIES: CompanyPrifle[] = [
    { id: 'C1', name: 'TechMahindra', industry: 'IT Services', location: 'Hyderabad', hiringStatus: 'Active', openPositions: 15, logoColor: '#e11d48' },
    { id: 'C2', name: 'Accenture', industry: 'Consulting', location: 'Bangalore', hiringStatus: 'Active', openPositions: 42, logoColor: '#a855f7' },
    { id: 'C3', name: 'Google', industry: 'Product', location: 'Hyderabad', hiringStatus: 'Frozen', openPositions: 0, logoColor: '#ea4335' },
    { id: 'C4', name: 'Zoho', industry: 'SaaS', location: 'Chennai', hiringStatus: 'Active', openPositions: 8, logoColor: '#eab308' },
    { id: 'C5', name: 'Deloitte', industry: 'FinTech', location: 'Mumbai', hiringStatus: 'Closed', openPositions: 0, logoColor: '#22c55e' },
];

const DRIVES: PlacementDrive[] = [
    { id: 'D1', company: 'TechMahindra', role: 'Java Developer', date: '2024-02-15', package: '4.5 - 6.0 LPA', eligibleBatches: ['B24', 'B25'], status: 'Registration Open', applicants: 124, assignedOfficer: 'PO1' },
    { id: 'D2', company: 'Accenture', role: 'Associate Engineer', date: '2024-02-20', package: '5.5 LPA', eligibleBatches: ['All Final Year'], status: 'Upcoming', applicants: 0, assignedOfficer: 'PO2' },
    { id: 'D3', company: 'Zoho', role: 'Frontend Dev', date: '2024-02-10', package: '8.0 LPA', eligibleBatches: ['B23', 'B24'], status: 'In Progress', applicants: 89, assignedOfficer: 'PO3' },
];

const RECENT_OFFERS: StudentOffer[] = [
    { id: 'O1', studentName: 'Rahul Verma', studentId: 'ST-2023-102', company: 'HCL Tech', role: 'System Analyst', package: '5.2 LPA', offerDate: '2024-02-01', status: 'Accepted', avatarColor: '#3b82f6', handledBy: 'Anjali Verma' },
    { id: 'O2', studentName: 'Sneha Reddy', studentId: 'ST-2023-088', company: 'Oracle', role: 'DB Admin', package: '9.0 LPA', offerDate: '2024-01-28', status: 'Pending', avatarColor: '#ec4899', handledBy: 'Suresh Raina' },
    { id: 'O3', studentName: 'Amit Kumar', studentId: 'ST-2023-156', company: 'Capgemini', role: 'Analyst', package: '4.0 LPA', offerDate: '2024-01-25', status: 'Accepted', avatarColor: '#10b981', handledBy: 'Rajesh K' },
    { id: 'O4', studentName: 'Riya Singh', studentId: 'ST-2023-201', company: 'Microsoft', role: 'SDE-1', package: '45.0 LPA', offerDate: '2024-01-20', status: 'Accepted', avatarColor: '#f59e0b', handledBy: 'Anjali Verma' },
];

export default function PlacementsPage() {
    const [activeTab, setActiveTab] = useState<'overview' | 'officers' | 'drives' | 'partners' | 'analytics'>('overview');
    const [isAddDriveOpen, setIsAddDriveOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedOfficer, setSelectedOfficer] = useState<PlacementOfficer | null>(null);
    const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
    const [isIncentiveModalOpen, setIsIncentiveModalOpen] = useState(false);

    // -- Helper Components --

    const KPICard = ({ title, value, sub, icon: Icon, color }: any) => (
        <motion.div
            whileHover={{ y: -6, scale: 1.02 }}
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className={styles.glassPanel}
            style={{
                position: 'relative', overflow: 'hidden',
                padding: '1.75rem',
                display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                height: '210px',
                border: `1px solid ${color}30`
            }}
        >
            <div style={{ position: 'absolute', top: 0, left: '0', right: '0', height: '2px', background: `linear-gradient(90deg, transparent, ${color}, transparent)`, opacity: 0.6 }} />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ width: '56px', height: '56px', borderRadius: '18px', background: `linear-gradient(135deg, ${color}20, ${color}05)`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: color, border: `1px solid ${color}30`, boxShadow: `inset 0 0 20px ${color}10` }}>
                    <Icon size={28} strokeWidth={2.5} />
                </div>
                <div style={{ opacity: 0.8 }}>
                    <svg width="70" height="35" viewBox="0 0 70 35" fill="none" style={{ filter: `drop-shadow(0 4px 6px ${color}40)` }}>
                        <path d="M0 28 C 10 28, 15 15, 25 20 C 35 25, 40 5, 50 10 C 60 15, 65 2, 70 5" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                        <defs><linearGradient id={`grad_${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={color} stopOpacity="0.5" /><stop offset="100%" stopColor={color} stopOpacity="0" /></linearGradient></defs>
                        <path d="M0 28 C 10 28, 15 15, 25 20 C 35 25, 40 5, 50 10 C 60 15, 65 2, 70 5 V 35 H 0 Z" fill={`url(#grad_${color.replace('#', '')})`} opacity="0.2" />
                    </svg>
                </div>
            </div>

            <div style={{ position: 'relative', zIndex: 2, marginTop: 'auto' }}>
                <div style={{ fontSize: '2.8rem', fontWeight: 800, color: 'white', lineHeight: '1', letterSpacing: '-0.03em', textShadow: `0 0 40px ${color}30` }}>{value}</div>
                <div style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', marginTop: '8px' }}>{title}</div>
            </div>

            <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.75rem', color: '#cbd5e1', background: 'rgba(255,255,255,0.03)', padding: '6px 12px', borderRadius: '8px', width: 'fit-content', border: '1px solid rgba(255,255,255,0.02)' }}>
                <Zap size={10} fill={color} stroke="none" />
                {sub}
            </div>

            <div style={{
                position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                background: `radial-gradient(circle at top left, ${color}10, transparent 70%)`,
                pointerEvents: 'none'
            }} />
        </motion.div>
    );

    const OfficerCard = ({ officer }: { officer: PlacementOfficer }) => (
        <motion.div
            whileHover={{ y: -5 }}
            className={`${styles.card} ${styles.glassPanel}`}
            style={{ padding: '0', display: 'flex', flexDirection: 'column', overflow: 'hidden', cursor: 'pointer', border: '1px solid rgba(255,255,255,0.05)' }}
            onClick={() => setSelectedOfficer(officer)}
        >
            <div style={{ padding: '1.5rem', position: 'relative' }}>
                <div style={{ position: 'absolute', top: 0, right: 0, left: 0, height: '60px', background: `linear-gradient(90deg, ${officer.avatarColor}20, transparent)` }} />
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', position: 'relative', zIndex: 1 }}>
                    <div style={{ width: '64px', height: '64px', borderRadius: '24px', background: officer.avatarColor, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', fontSize: '1.5rem', boxShadow: `0 8px 16px -4px ${officer.avatarColor}60` }}>
                        {officer.name[0]}
                    </div>
                    <div>
                        <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'white' }}>{officer.name}</h3>
                        <div style={{ fontSize: '0.85rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <Zap size={12} color="#f59e0b" fill="#f59e0b" /> {officer.rating} Rating
                        </div>
                    </div>
                </div>
            </div>

            <div style={{ padding: '0 1.5rem 1.5rem 1.5rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', background: 'rgba(0,0,0,0.3)', padding: '12px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Success</div>
                        <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#10b981' }}>{officer.successRate}%</div>
                    </div>
                    <div style={{ textAlign: 'center', borderLeft: '1px solid rgba(255,255,255,0.1)', borderRight: '1px solid rgba(255,255,255,0.1)' }}>
                        <div style={{ fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Placed</div>
                        <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'white' }}>{officer.studentsPlaced}</div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Avg Pkg</div>
                        <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f59e0b' }}>{officer.avgPackage}</div>
                    </div>
                </div>
            </div>

            <div style={{ marginTop: 'auto', padding: '1rem', background: 'rgba(255,255,255,0.02)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                <span style={{ fontSize: '0.8rem', color: '#64748b' }}>{officer.activeDrives} Active Assignments</span>
                <span style={{ fontSize: '0.8rem', color: officer.avatarColor, fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>View Report <ChevronRight size={14} /></span>
            </div>
        </motion.div>
    );

    // -- OFFICER DRILL-DOWN VIEW (ENHANCED) --
    if (selectedOfficer) {
        return (
            <DashboardLayout role="super_admin">
                <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className={styles.container}>

                    {/* Back Header */}
                    <div style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <button onClick={() => setSelectedOfficer(null)} className={styles.btnSecondary} style={{ padding: '8px 12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}><ArrowLeft size={18} /> Back</button>
                            <div>
                                <div className={styles.textLabel} style={{ letterSpacing: '0.1em', opacity: 0.7, fontSize: '0.75rem' }}>OFFICER PERFORMANCE ANALYTICS</div>
                                <h1 className={styles.textH1} style={{ fontSize: '1.75rem' }}>{selectedOfficer.name}</h1>
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: '0.75rem' }}>
                            <div style={{ display: 'flex', gap: '0.75rem' }}>
                                <button onClick={() => setIsMessageModalOpen(true)} className={styles.btnSecondary}><Mail size={16} /> Message</button>
                                <button onClick={() => setIsIncentiveModalOpen(true)} className={styles.btnPrimary} style={{ background: '#10b981', boxShadow: '0 0 20px rgba(16,185,129,0.3)' }}><CheckCircle size={16} /> Approve Incentives</button>
                            </div>
                        </div>
                    </div>

                    {/* Top Stats Grid - Hero Section */}
                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.2fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                        {/* Profile Hero */}
                        <div className={styles.card} style={{
                            background: `linear-gradient(125deg, ${selectedOfficer.avatarColor}15, rgba(15, 23, 42, 0.8))`,
                            border: `1px solid ${selectedOfficer.avatarColor}30`,
                            display: 'flex', flexDirection: 'column', justifyContent: 'center', position: 'relative', overflow: 'hidden'
                        }}>
                            <div style={{ position: 'absolute', top: '-50%', right: '-10%', width: '300px', height: '300px', background: selectedOfficer.avatarColor, filter: 'blur(80px)', opacity: 0.15, borderRadius: '50%' }} />

                            <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', position: 'relative', zIndex: 1 }}>
                                <div style={{ width: '110px', height: '110px', borderRadius: '30px', background: `linear-gradient(135deg, ${selectedOfficer.avatarColor}, ${selectedOfficer.avatarColor}dd)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3.5rem', fontWeight: 'bold', color: 'white', boxShadow: `0 20px 40px -10px ${selectedOfficer.avatarColor}60`, border: '4px solid rgba(255,255,255,0.1)' }}>
                                    {selectedOfficer.name[0]}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <h2 style={{ fontSize: '2.2rem', color: 'white', fontWeight: 800, lineHeight: 1.1 }}>{selectedOfficer.role}</h2>
                                    <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', flexWrap: 'wrap' }}>
                                        <div style={{ background: 'rgba(255,255,255,0.05)', padding: '8px 14px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <Award size={18} color={selectedOfficer.avatarColor} />
                                            <span style={{ color: '#cbd5e1', fontSize: '0.9rem' }}>Specialization: <span style={{ color: 'white', fontWeight: 600 }}>FinTech & SaaS</span></span>
                                        </div>
                                        <div style={{ background: 'rgba(255,255,255,0.05)', padding: '8px 14px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <Globe size={18} color="#f59e0b" />
                                            <span style={{ color: '#cbd5e1', fontSize: '0.9rem' }}>Region: <span style={{ color: 'white', fontWeight: 600 }}>South India</span></span>
                                        </div>
                                    </div>
                                </div>
                                <div style={{ textAlign: 'right', paddingLeft: '2rem', borderLeft: '1px solid rgba(255,255,255,0.1)' }}>
                                    <div style={{ color: '#94a3b8', fontSize: '0.85rem', marginBottom: '4px' }}>Efficiency Score</div>
                                    <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#f59e0b', textShadow: '0 0 20px rgba(245, 158, 11, 0.4)' }}>{selectedOfficer.rating}</div>
                                    <div style={{ display: 'flex', gap: '2px', justifyContent: 'end' }}>
                                        {[1, 2, 3, 4, 5].map(s => <Star key={s} size={14} fill={s <= Math.floor(selectedOfficer.rating) ? "#f59e0b" : "rgba(255,255,255,0.1)"} stroke="none" />)}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* AI Insights Panel */}
                        <div className={styles.card} style={{ background: 'linear-gradient(180deg, rgba(30, 41, 59, 0.4) 0%, rgba(15, 23, 42, 0.6) 100%)', border: '1px solid rgba(99, 102, 241, 0.2)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem' }}>
                                <Sparkles size={18} color="#818cf8" fill="#818cf8" />
                                <h3 style={{ fontSize: '1rem', color: 'white', fontWeight: 600 }}>AI Performance Insights</h3>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <div style={{ padding: '12px', background: 'rgba(99, 102, 241, 0.1)', borderRadius: '12px', border: '1px solid rgba(99, 102, 241, 0.2)', fontSize: '0.9rem', color: '#e2e8f0', lineHeight: '1.5' }}>
                                    <strong style={{ color: '#818cf8' }}>Trending Up:</strong> {selectedOfficer.name}'s conversion rate is <strong>15% higher</strong> than the team average this month.
                                </div>
                                <div style={{ padding: '12px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '12px', border: '1px solid rgba(16, 185, 129, 0.2)', fontSize: '0.9rem', color: '#e2e8f0', lineHeight: '1.5' }}>
                                    <strong style={{ color: '#10b981' }}>Outcome Prediction:</strong> On track to exceed quarterly target by <strong>8 placements</strong> based on current pipeline velocity.
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Content Grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.5rem' }}>

                        {/* Pipeline Column */}
                        <div className={styles.card}>
                            <h3 style={{ fontSize: '1rem', color: '#cbd5e1', marginBottom: '1.2rem', display: 'flex', alignItems: 'center', gap: '8px' }}><BarChart3 size={18} /> Student Pipeline</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                                {selectedOfficer.fullReport.studentPipeline.map((stage, idx) => (
                                    <div key={idx} style={{ position: 'relative' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '6px', color: 'white', fontWeight: 500 }}>
                                            <span>{stage.stage}</span>
                                            <span>{stage.count} Candidates</span>
                                        </div>
                                        <div style={{ height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden' }}>
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${(stage.count / 150) * 100}%` }}
                                                transition={{ duration: 1, delay: 0.2 }}
                                                style={{ height: '100%', background: stage.color, borderRadius: '4px', boxShadow: `0 0 10px ${stage.color}60` }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div style={{ marginTop: '2rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.05)', textAlign: 'center', fontSize: '0.85rem', color: '#64748b' }}>
                                Pipeline Health: <span style={{ color: '#10b981', fontWeight: 600 }}>Healthy</span>
                            </div>
                        </div>

                        {/* Daily Operations / Activity */}
                        <div className={styles.card} style={{ paddingRight: '0' }}>
                            <div className={styles.cardHeader} style={{ paddingRight: '1.5rem', marginBottom: '1.5rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Clock size={18} /> Daily Operations Log</div>
                                <div style={{ fontSize: '0.75rem', color: '#10b981', background: 'rgba(16,185,129,0.1)', padding: '2px 8px', borderRadius: '6px' }}>Today</div>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0', overflowY: 'auto', maxHeight: '300px', paddingRight: '1.5rem' }}>
                                {selectedOfficer.dailyLog?.map((item, i) => (
                                    <div key={i} style={{ padding: '16px 0', borderBottom: '1px solid rgba(255,255,255,0.03)', display: 'flex', gap: '16px', position: 'relative' }}>
                                        {/* Time Track */}
                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '60px', flexShrink: 0 }}>
                                            <span style={{ fontSize: '0.75rem', color: '#cbd5e1', fontWeight: 600 }}>{item.time.split(' ')[0]}</span>
                                            <span style={{ fontSize: '0.65rem', color: '#64748b' }}>{item.time.split(' ')[1]}</span>
                                            <div style={{ width: '1px', background: 'rgba(255,255,255,0.1)', flex: 1, marginTop: '8px' }}></div>
                                        </div>

                                        {/* Task Card */}
                                        <div style={{ flex: 1 }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                                                <div style={{
                                                    padding: '2px 8px', borderRadius: '12px', fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase',
                                                    background: item.type === 'Interview' ? 'rgba(236, 72, 153, 0.15)' : item.type === 'Meeting' ? 'rgba(59, 130, 246, 0.15)' : 'rgba(255,255,255,0.05)',
                                                    color: item.type === 'Interview' ? '#f472b6' : item.type === 'Meeting' ? '#60a5fa' : '#cbd5e1'
                                                }}>
                                                    {item.type}
                                                </div>
                                                {item.status === 'In Progress' && <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 8px #10b981' }}></span>}
                                            </div>

                                            <div style={{ color: 'white', fontSize: '0.95rem', fontWeight: 500, marginBottom: '2px' }}>{item.task}</div>
                                            {item.student && <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: '#94a3b8' }}><UserCheck size={12} /> Student: <span style={{ color: '#e2e8f0' }}>{item.student}</span></div>}

                                            {/* Action Buttons depending on type */}
                                            {item.status !== 'Completed' && (
                                                <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                                                    {item.type === 'Call' && <button className={styles.btnSecondary} style={{ padding: '4px 10px', fontSize: '0.75rem', height: 'auto' }}><Phone size={10} style={{ marginRight: '4px' }} /> Call Now</button>}
                                                    {item.type === 'Interview' && <button className={styles.btnSecondary} style={{ padding: '4px 10px', fontSize: '0.75rem', height: 'auto', background: 'rgba(236, 72, 153, 0.1)', borderColor: 'rgba(236, 72, 153, 0.2)', color: '#f472b6' }}><ExternalLink size={10} style={{ marginRight: '4px' }} /> Join Room</button>}
                                                    <button className={styles.btnSecondary} style={{ padding: '4px 10px', fontSize: '0.75rem', height: 'auto' }}>Log Notes</button>
                                                </div>
                                            )}
                                        </div>

                                        {/* Status Check */}
                                        <div style={{ marginTop: '4px' }}>
                                            {item.status === 'Completed' ? <CheckCircle size={18} color="#10b981" /> : item.status === 'In Progress' ? <Clock size={18} color="#f59e0b" /> : <div style={{ width: '16px', height: '16px', borderRadius: '50%', border: '2px solid rgba(255,255,255,0.1)' }}></div>}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Top Wins & Badges */}
                        <div className={styles.card} style={{ display: 'flex', flexDirection: 'column' }}>
                            <h3 style={{ fontSize: '1rem', color: '#cbd5e1', marginBottom: '1.2rem', display: 'flex', alignItems: 'center', gap: '8px' }}><Trophy size={18} /> Top Achievements</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', flex: 1 }}>
                                {selectedOfficer.fullReport.topPlacements.map((win, idx) => (
                                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.05)', border: '1px solid rgba(16, 185, 129, 0.1)' }}>
                                        <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg, #10b981, #059669)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', boxShadow: '0 4px 10px rgba(16,185,129,0.3)' }}><Award size={18} /></div>
                                        <div>
                                            <div style={{ color: 'white', fontWeight: 600, fontSize: '0.95rem' }}>{win.student}</div>
                                            <div style={{ fontSize: '0.75rem', color: '#10b981' }}>Placed at {win.company}</div>
                                        </div>
                                        <div style={{ marginLeft: 'auto', fontSize: '1rem', fontWeight: 700, color: '#white', background: '#10b981', padding: '2px 8px', borderRadius: '6px' }}>{win.pkg}</div>
                                    </div>
                                ))}
                            </div>
                            <button className={styles.btnSecondary} style={{ marginTop: '1.5rem', width: '100%', justifyContent: 'center' }}>View All Placements</button>
                        </div>
                    </div>

                    {/* -- MESSAGE MODAL -- */}
                    <AnimatePresence>
                        {isMessageModalOpen && (
                            <div className={styles.modalOverlay} style={{ zIndex: 100 }}>
                                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className={styles.modalContent} style={{ maxWidth: '500px' }}>
                                    <div className={styles.modalHeader} style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                                        <div style={{ display: 'flex', alignContent: 'center', gap: '10px' }}>
                                            <div style={{ padding: '8px', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '8px' }}><Mail size={20} color="#3b82f6" /></div>
                                            <div>
                                                <h2 className={styles.modalTitle}>Compose Quick Message</h2>
                                                <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>To: <span style={{ color: 'white', fontWeight: 600 }}>{selectedOfficer.name}</span></div>
                                            </div>
                                        </div>
                                        <button onClick={() => setIsMessageModalOpen(false)} className={styles.closeBtn}>✕</button>
                                    </div>
                                    <div className={styles.modalBody} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                                        <div>
                                            <label className={styles.formLabel}>Subject</label>
                                            <input type="text" className={styles.formInput} placeholder="e.g. Performance Review Meeting" defaultValue="Urgent: Quarterly Targets Review" />
                                        </div>
                                        <div>
                                            <label className={styles.formLabel}>Priority</label>
                                            <div style={{ display: 'flex', gap: '10px' }}>
                                                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', cursor: 'pointer', border: '1px solid rgba(255,255,255,0.1)' }}>
                                                    <input type="radio" name="priority" defaultChecked /> <span style={{ fontSize: '0.9rem', color: '#cbd5e1' }}>Normal</span>
                                                </label>
                                                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: '8px', background: 'rgba(239, 68, 68, 0.1)', cursor: 'pointer', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                                                    <input type="radio" name="priority" /> <span style={{ fontSize: '0.9rem', color: '#f87171', fontWeight: 600 }}>High Priority</span>
                                                </label>
                                            </div>
                                        </div>
                                        <div>
                                            <label className={styles.formLabel}>Message</label>
                                            <textarea className={styles.formInput} rows={5} placeholder="Write your message here..."></textarea>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
                                            <button onClick={() => setIsMessageModalOpen(false)} className={styles.btnSecondary}>Cancel</button>
                                            <button onClick={() => setIsMessageModalOpen(false)} className={styles.btnPrimary} style={{ background: '#3b82f6', boxShadow: '0 0 15px rgba(59,130,246,0.4)' }}>Send Message <ArrowUpRight size={16} /></button>
                                        </div>
                                    </div>
                                </motion.div>
                            </div>
                        )}
                    </AnimatePresence>

                    {/* -- INCENTIVE APPROVAL MODAL -- */}
                    <AnimatePresence>
                        {isIncentiveModalOpen && (
                            <div className={styles.modalOverlay} style={{ zIndex: 100 }}>
                                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className={styles.modalContent} style={{ maxWidth: '450px', border: '1px solid rgba(16, 185, 129, 0.3)', background: 'linear-gradient(145deg, #0f172a, #064e3b)' }}>
                                    <div style={{ textAlign: 'center', padding: '2rem 0 1rem 0' }}>
                                        <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem auto', boxShadow: '0 0 30px rgba(16,185,129,0.4)' }}>
                                            <CheckCircle size={32} color="white" />
                                        </div>
                                        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'white', marginBottom: '0.5rem' }}>Approve Incentives</h2>
                                        <div style={{ color: '#a7f3d0', fontSize: '0.9rem' }}>Review and authorize payout for <strong>{selectedOfficer.name}</strong></div>
                                    </div>

                                    <div style={{ background: 'rgba(0,0,0,0.2)', borderRadius: '16px', padding: '1.5rem', margin: '0 1rem', border: '1px solid rgba(16,185,129,0.2)' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.8rem', fontSize: '0.9rem', color: '#cbd5e1' }}>
                                            <span>Base Commission</span>
                                            <span>₹ 12,000</span>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.8rem', fontSize: '0.9rem', color: '#cbd5e1' }}>
                                            <span>Milestone Bonus (30+ Placements)</span>
                                            <span style={{ color: '#10b981' }}>+ ₹ 5,000</span>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.8rem', fontSize: '0.9rem', color: '#cbd5e1' }}>
                                            <span>Efficiency Multiplier (4.5★)</span>
                                            <span style={{ color: '#10b981' }}>+ ₹ 2,500</span>
                                        </div>
                                        <div style={{ height: '1px', background: 'rgba(255,255,255,0.1)', margin: '1rem 0' }}></div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <span style={{ fontSize: '1.1rem', fontWeight: 600, color: 'white' }}>Total Payout</span>
                                            <span style={{ fontSize: '1.5rem', fontWeight: 800, color: '#10b981', textShadow: '0 0 20px rgba(16,185,129,0.4)' }}>₹ 19,500</span>
                                        </div>
                                    </div>

                                    <div className={styles.modalBody}>
                                        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                                            <button onClick={() => setIsIncentiveModalOpen(false)} className={styles.btnSecondary} style={{ flex: 1, borderColor: 'rgba(255,255,255,0.1)' }}>Cancel</button>
                                            <button onClick={() => setIsIncentiveModalOpen(false)} className={styles.btnPrimary} style={{ flex: 1, background: '#10b981', boxShadow: '0 0 20px rgba(16,185,129,0.4)', color: 'white', fontSize: '1rem' }}>Authorize Payment</button>
                                        </div>
                                        <div style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.75rem', color: '#6ee7b7', opacity: 0.8 }}>
                                            <Lock size={10} style={{ marginRight: '4px' }} /> Secure Transaction • ID: #TX-9102
                                        </div>
                                    </div>
                                </motion.div>
                            </div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </DashboardLayout>
        );
    }

    // -- MAIN VIEW --
    return (
        <DashboardLayout role="super_admin">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={styles.container}>

                {/* Header Actions - Premium Glass Bar */}
                <div style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem',
                    padding: '1rem 1.5rem', background: 'rgba(15, 23, 42, 0.6)',
                    backdropFilter: 'blur(16px)', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.08)',
                    boxShadow: '0 8px 32px -8px rgba(0,0,0,0.3)'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'linear-gradient(135deg, #3b82f6, #2563eb)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', boxShadow: '0 0 20px #3b82f660' }}>
                            <Briefcase size={24} strokeWidth={2.5} />
                        </div>
                        <div>
                            <div className={styles.textLabel} style={{ fontSize: '0.75rem', letterSpacing: '0.1em', opacity: 0.7, marginBottom: '2px' }}>EXTERNAL RELATIONS</div>
                            <h1 style={{ fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-0.02em', background: 'linear-gradient(90deg, #fff, #94a3b8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Corporate Placements</h1>
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem', background: 'rgba(0,0,0,0.2)', padding: '6px', borderRadius: '16px' }}>
                        {['overview', 'officers', 'drives', 'partners', 'analytics'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab as any)}
                                style={{
                                    padding: '8px 16px', borderRadius: '12px', fontSize: '0.9rem', fontWeight: 600,
                                    border: 'none', cursor: 'pointer', transition: 'all 0.3s ease',
                                    background: activeTab === tab ? '#3b82f6' : 'transparent',
                                    color: activeTab === tab ? 'white' : '#94a3b8',
                                    textTransform: 'capitalize',
                                    boxShadow: activeTab === tab ? '0 4px 12px rgba(59, 130, 246, 0.4)' : 'none'
                                }}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <button className={styles.btnSecondary} style={{ padding: '10px 20px', fontSize: '0.95rem', borderRadius: '12px' }}>
                            <FileText size={18} /> Export
                        </button>
                        <button className={styles.btnPrimary} onClick={() => setIsAddDriveOpen(true)} style={{ padding: '10px 20px', fontSize: '0.95rem', borderRadius: '12px', background: 'linear-gradient(90deg, #8b5cf6, #d946ef)', boxShadow: '0 0 20px rgba(139, 92, 246, 0.4)' }}>
                            <Plus size={18} strokeWidth={2.5} /> Schedule Drive
                        </button>
                    </div>
                </div>

                {/* KPI Overview */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '2rem' }}>
                    <KPICard title="Total Placed" value="142" sub="+12 this week" icon={Award} color="#3b82f6" />
                    <KPICard title="Highest Package" value="₹45 LPA" sub="Microsoft (SDE)" icon={TrendingUp} color="#10b981" />
                    <KPICard title="Avg Package" value="₹6.8 LPA" sub="↑ 15% vs last year" icon={BarChart3} color="#f59e0b" />
                    <KPICard title="Active Recruiters" value="28" sub="5 Drives Scheduled" icon={Briefcase} color="#8b5cf6" />
                </div>

                {/* CONTENT AREA */}
                <AnimatePresence mode="wait">

                    {/* --- OVERVIEW TAB --- */}
                    {activeTab === 'overview' && (
                        <motion.div key="overview" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
                            <div className={styles.card}>
                                <div className={styles.cardHeader}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}><Rocket size={20} color="#f59e0b" /><span>Upcoming Placement Drives</span></div>
                                    <button className={styles.btnSecondary} onClick={() => setActiveTab('drives')} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)', color: '#60a5fa' }}>
                                        <Calendar size={14} /> Full Calendar
                                    </button>
                                </div>
                                <div className={styles.tableContainer}>
                                    <table className={styles.table}>
                                        <thead><tr><th>Company</th><th>Role</th><th>Assigned Officer</th><th>Date</th><th>Pkg (LPA)</th><th>Status</th></tr></thead>
                                        <tbody>
                                            {DRIVES.map(drive => {
                                                const officer = OFFICERS.find(o => o.id === drive.assignedOfficer);
                                                return (
                                                    <tr key={drive.id}>
                                                        <td><div style={{ fontWeight: 600, color: 'white' }}>{drive.company}</div></td>
                                                        <td style={{ color: '#cbd5e1' }}>{drive.role}</td>
                                                        <td>{officer ? <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><div style={{ width: '20px', height: '20px', borderRadius: '50%', background: officer.avatarColor, color: 'white', fontSize: '0.6rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{officer.name[0]}</div><span style={{ fontSize: '0.85rem' }}>{officer.name}</span></div> : '-'}</td>
                                                        <td>{drive.date}</td>
                                                        <td style={{ fontWeight: 600, color: '#10b981' }}>{drive.package}</td>
                                                        <td><span className={styles.statusBadge} style={{ background: drive.status === 'Registration Open' ? 'rgba(59,130,246,0.1)' : drive.status === 'In Progress' ? 'rgba(245,158,11,0.1)' : 'rgba(255,255,255,0.05)', color: drive.status === 'Registration Open' ? '#3b82f6' : drive.status === 'In Progress' ? '#f59e0b' : '#94a3b8' }}>{drive.status}</span></td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div className={styles.card} style={{ maxHeight: '500px', display: 'flex', flexDirection: 'column' }}>
                                <div className={styles.cardHeader}><div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}><Award size={20} color="#10b981" /><span>Recent Success</span></div></div>
                                <div style={{ overflowY: 'auto', paddingRight: '4px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    {RECENT_OFFERS.map(offer => (
                                        <div key={offer.id} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.75rem', borderRadius: '8px', background: 'rgba(30,41,59,0.3)', border: '1px solid rgba(255,255,255,0.03)' }}>
                                            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: offer.avatarColor, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' }}>{offer.studentName[0]}</div>
                                            <div style={{ flex: 1 }}><div style={{ color: 'white', fontWeight: 500, fontSize: '0.95rem' }}>{offer.studentName}</div><div style={{ color: '#94a3b8', fontSize: '0.8rem' }}>Placed at <span style={{ color: 'white' }}>{offer.company}</span></div><div style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '2px' }}>Officer: {offer.handledBy}</div></div>
                                            <div style={{ textAlign: 'right' }}><div style={{ color: '#10b981', fontWeight: 700, fontSize: '0.9rem' }}>{offer.package}</div><div style={{ fontSize: '0.7rem', color: '#64748b' }}>{offer.role}</div></div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* --- OFFICERS TAB --- */}
                    {activeTab === 'officers' && (
                        <motion.div key="officers" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                            <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <h3 style={{ fontSize: '1.2rem', color: 'white', fontWeight: 600 }}>Placement Team Performance</h3>
                                <div style={{ display: 'flex', gap: '1rem' }}><button className={styles.btnSecondary}><Target size={16} /> View Targets</button><button className={styles.btnPrimary}><UserCheck size={16} /> Assign Officer</button></div>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
                                {OFFICERS.map(officer => (
                                    <OfficerCard key={officer.id} officer={officer} />
                                ))}
                                <motion.div whileHover={{ scale: 1.02 }} className={styles.card} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '180px', borderStyle: 'dashed', cursor: 'pointer', background: 'transparent' }}>
                                    <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}><Plus size={24} color="#94a3b8" /></div>
                                    <div style={{ color: '#94a3b8', fontWeight: 500 }}>Add Placement Officer</div>
                                </motion.div>
                            </div>
                        </motion.div>
                    )}

                    {/* --- DRIVES & OFFERS --- */}
                    {activeTab === 'drives' && (
                        <motion.div key="drives" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                            <div className={styles.card}>
                                <div className={styles.cardHeader}>Master Drive Calendar</div>
                                <div className={styles.tableContainer}>
                                    <table className={styles.table}>
                                        <thead><tr><th>Company</th><th>Role</th><th>Assigned Officer</th><th>Date</th><th>Pkg (LPA)</th><th>Status</th><th>Applicants</th><th>Action</th></tr></thead>
                                        <tbody>
                                            {DRIVES.map(drive => {
                                                const officer = OFFICERS.find(o => o.id === drive.assignedOfficer);
                                                return (
                                                    <tr key={drive.id}>
                                                        <td><div style={{ fontWeight: 600, color: 'white' }}>{drive.company}</div></td><td>{drive.role}</td>
                                                        <td>{officer ? <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.05)', padding: '2px 8px', borderRadius: '12px', fontSize: '0.8rem' }}><span style={{ width: '8px', height: '8px', borderRadius: '50%', background: officer.avatarColor }}></span>{officer.name}</span> : 'Unassigned'}</td>
                                                        <td>{drive.date}</td><td style={{ fontWeight: 600, color: '#10b981' }}>{drive.package}</td><td><span className={styles.statusBadge}>{drive.status}</span></td><td>{drive.applicants} Users</td><td><button className={styles.btnSecondary} style={{ padding: '4px 8px' }}>Manage</button></td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* --- PARTNERS --- */}
                    {activeTab === 'partners' && (
                        <motion.div key="partners" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                            <div style={{ marginBottom: '1.5rem', display: 'flex', gap: '1rem' }}>
                                <div className={styles.searchBar} style={{ flex: 1 }}><Search size={18} color="#94a3b8" /><input type="text" placeholder="Search companies, locations..." className={styles.searchInput} value={searchQuery} onChange={e => setSearchQuery(e.target.value)} /></div>
                                <button className={styles.btnSecondary}><Filter size={18} /> Industry</button>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.5rem' }}>
                                {COMPANIES.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase())).map(company => (
                                    <motion.div key={company.id} whileHover={{ y: -5 }} className={styles.card} style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', borderTop: `4px solid ${company.logoColor}` }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                                            <div style={{ width: '48px', height: '48px', borderRadius: '8px', background: `${company.logoColor}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: company.logoColor, fontWeight: 'bold', fontSize: '1.2rem' }}>{company.name[0]}</div>
                                            <span className={styles.statusBadge} style={{ background: company.hiringStatus === 'Active' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)', color: company.hiringStatus === 'Active' ? '#10b981' : '#ef4444' }}>{company.hiringStatus}</span>
                                        </div>
                                        <div><h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'white' }}>{company.name}</h3><div style={{ fontSize: '0.85rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.25rem' }}><MapPin size={12} /> {company.location} • {company.industry}</div></div>
                                        <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><div style={{ fontSize: '0.8rem', color: '#cbd5e1' }}><span style={{ fontWeight: 700, color: 'white' }}>{company.openPositions}</span> Openings</div><button className={styles.btnSecondary} style={{ padding: '4px 8px', fontSize: '0.8rem' }}>View</button></div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    )}

    // --- ANALYTICS TAB ---
                    {activeTab === 'analytics' && (
                        <motion.div key="analytics" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                            <div className={styles.statsGrid}>
                                <div className={`${styles.glassPanel} ${styles.neonBorder}`} style={{ padding: '1.5rem', gridColumn: 'span 2' }}>
                                    <h3 className={styles.cardHeader}><TrendingUp size={20} color="#22d3ee" /> Placement Trends (2023-24)</h3>
                                    <div style={{ height: '300px', display: 'flex', alignItems: 'flex-end', gap: '2rem', padding: '1rem', position: 'relative' }}>
                                        {/* Simple SVG Line Chart */}
                                        <svg width="100%" height="100%" viewBox="0 0 800 300" style={{ overflow: 'visible' }}>
                                            <defs>
                                                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.5" />
                                                    <stop offset="100%" stopColor="#7c3aed" stopOpacity="0" />
                                                </linearGradient>
                                            </defs>
                                            <path d="M0,250 C100,200 200,280 300,150 S500,100 600,50 S800,20 800,20" fill="none" stroke="#7c3aed" strokeWidth="4" filter="drop-shadow(0 0 10px #7c3aed)" />
                                            <path d="M0,250 C100,200 200,280 300,150 S500,100 600,50 S800,20 800,20 V300 H0 Z" fill="url(#chartGradient)" opacity="0.3" />

                                            {/* Data Points */}
                                            {[
                                                { x: 0, y: 250, val: 'Jan' }, { x: 300, y: 150, val: 'May' }, { x: 600, y: 50, val: 'Sep' }, { x: 800, y: 20, val: 'Dec' }
                                            ].map((pt, i) => (
                                                <g key={i}>
                                                    <circle cx={pt.x} cy={pt.y} r="6" fill="#fff" stroke="#7c3aed" strokeWidth="2" />
                                                    <text x={pt.x} y={320} fill="#94a3b8" fontSize="12" textAnchor="middle">{pt.val}</text>
                                                </g>
                                            ))}
                                        </svg>
                                    </div>
                                </div>

                                <div className={styles.glassPanel} style={{ padding: '1.5rem' }}>
                                    <h3 className={styles.cardHeader}>Department Wise</h3>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                        {[
                                            { dept: 'CSE', val: 85, color: '#3b82f6' },
                                            { dept: 'ECE', val: 65, color: '#10b981' },
                                            { dept: 'EEE', val: 45, color: '#f59e0b' },
                                            { dept: 'Mech', val: 30, color: '#ef4444' }
                                        ].map((d, i) => (
                                            <div key={i}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.9rem' }}>
                                                    <span style={{ color: '#e2e8f0' }}>{d.dept}</span>
                                                    <span style={{ fontWeight: 700, color: d.color }}>{d.val}%</span>
                                                </div>
                                                <div style={{ height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden' }}>
                                                    <motion.div
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${d.val}%` }}
                                                        transition={{ duration: 1, delay: i * 0.1 }}
                                                        style={{ height: '100%', background: d.color, boxShadow: `0 0 10px ${d.color}60` }}
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className={styles.glassPanel} style={{ padding: '1.5rem', marginTop: '1.5rem' }}>
                                <h3 className={styles.cardHeader}><LayoutGrid size={20} color="#d946ef" /> Detailed Placement Statistics</h3>
                                <table className={styles.table}>
                                    <thead><tr><th>Metric</th><th>Target</th><th>Achieved</th><th>Delta</th><th>Status</th></tr></thead>
                                    <tbody>
                                        {[
                                            { m: 'Students Placed', t: '500', a: '452', d: '-9.6%', s: 'On Track' },
                                            { m: 'Avg Package', t: '6.0 LPA', a: '6.8 LPA', d: '+13.3%', s: 'Exceeded' },
                                            { m: 'Dream Offers', t: '50', a: '62', d: '+24%', s: 'Exceeded' },
                                            { m: 'Partner Companies', t: '120', a: '98', d: '-18%', s: 'Behind' }
                                        ].map((row, i) => (
                                            <tr key={i} className={styles.interactiveRow}>
                                                <td style={{ color: '#fff', fontWeight: 500 }}>{row.m}</td>
                                                <td>{row.t}</td>
                                                <td style={{ color: '#fff', fontWeight: 700 }}>{row.a}</td>
                                                <td style={{ color: row.d.startsWith('+') ? '#10b981' : '#f43f5e' }}>{row.d}</td>
                                                <td><span className={styles.statusBadge} style={{ background: row.s === 'Exceeded' ? 'rgba(16,185,129,0.1)' : row.s === 'On Track' ? 'rgba(59,130,246,0.1)' : 'rgba(244,63,94,0.1)', color: row.s === 'Exceeded' ? '#10b981' : row.s === 'On Track' ? '#3b82f6' : '#f43f5e' }}>{row.s}</span></td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </motion.div>
                    )}

                </AnimatePresence>

                {/* SCHEDULE MODAL */}
                <AnimatePresence>
                    {isAddDriveOpen && (
                        <div className={styles.modalOverlay}>
                            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className={`${styles.modalContent} ${styles.neonBorder}`}>
                                <div className={styles.modalHeader}><h2 className={styles.modalTitle} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><Rocket size={24} color="#d946ef" /> Schedule New Placement Drive</h2><button onClick={() => setIsAddDriveOpen(false)} className={styles.closeBtn}>✕</button></div>
                                <div className={styles.modalBody}>
                                    <form style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}><div className={styles.formGroup}><label className={styles.formLabel}>Company Name</label><input type="text" className={styles.formInput} placeholder="e.g. Microsoft" /></div><div className={styles.formGroup}><label className={styles.formLabel}>Job Role</label><input type="text" className={styles.formInput} placeholder="e.g. Software Engineer" /></div></div>
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}><div className={styles.formGroup}><label className={styles.formLabel}>Date</label><input type="date" className={styles.formInput} /></div><div className={styles.formGroup}><label className={styles.formLabel}>Expected CTC (LPA)</label><input type="text" className={styles.formInput} placeholder="e.g. 12.0 - 15.5 LPA" /></div></div>
                                        <div className={styles.formGroup}><label className={styles.formLabel}>Assign Placement Officer</label><select className={styles.formSelect}><option value="">Select Officer...</option>{OFFICERS.map(o => (<option key={o.id} value={o.id}>{o.name} - {o.role}</option>))}</select></div>
                                        <div className={styles.formGroup}><label className={styles.formLabel}>Job Description</label><textarea className={styles.formInput} rows={3}></textarea></div>
                                        <div className={styles.formActions}><button type="button" onClick={() => setIsAddDriveOpen(false)} className={styles.btnSecondary} style={{ flex: 1 }}>Cancel</button><button type="button" onClick={() => setIsAddDriveOpen(false)} className={styles.btnPrimary} style={{ flex: 1 }}>Launch Drive</button></div>
                                    </form>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>

            </motion.div>
        </DashboardLayout>
    );
}
