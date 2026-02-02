"use client";

import { useState } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Users, Phone, Mail, MessageSquare,
    CheckCircle, Clock, Search, Filter, Plus,
    ArrowRight, Star, Calendar, FileText, ChevronRight
} from 'lucide-react';
import styles from '../SuperAdmin.module.css';
import StatsCard from '@/components/dashboard/StatsCard';

// -- Types --
type Stage = 'new' | 'contacted' | 'demo' | 'enrolled';

interface Lead {
    id: number;
    name: string;
    email: string;
    phone: string;
    course: string;
    stage: Stage;
    time: string;
    source: string;
    notes: string;
    probability: number; // 0-100%
}

// -- Initial Mock Data --
const INITIAL_LEADS: Lead[] = [
    { id: 1, name: 'Arjun Reddy', email: 'arjun@example.com', phone: '+91 98765 43210', course: 'Java Full Stack', stage: 'new', time: '2h ago', source: 'Website', notes: 'Interested in weekend batch.', probability: 40 },
    { id: 2, name: 'Priya Sharma', email: 'priya@example.com', phone: '+91 98765 43211', course: 'Data Science', stage: 'new', time: '4h ago', source: 'Referral', notes: 'Referred by alumni Suresh.', probability: 60 },
    { id: 3, name: 'Mike Chen', email: 'mike@example.com', phone: '+91 98765 43212', course: 'Python & AI', stage: 'contacted', time: '1d ago', source: 'LinkedIn', notes: 'Called, busy. Call back tomorrow.', probability: 55 },
    { id: 4, name: 'Sara Miller', email: 'sara@example.com', phone: '+91 98765 43213', course: 'DevOps', stage: 'demo', time: '2d ago', source: 'Ad Campaign', notes: 'Loved the demo session.', probability: 85 },
    { id: 5, name: 'Rahul V.', email: 'rahul@example.com', phone: '+91 98765 43214', course: 'Java Full Stack', stage: 'enrolled', time: '3d ago', source: 'Walk-in', notes: 'Fees paid partially.', probability: 100 },
];

const PIPELINE_STAGES: { id: Stage, label: string, color: string }[] = [
    { id: 'new', label: 'New Leads', color: '#3b82f6' },
    { id: 'contacted', label: 'Contacted', color: '#8b5cf6' },
    { id: 'demo', label: 'Demo Scheduled', color: '#f59e0b' },
    { id: 'enrolled', label: 'Enrolled', color: '#10b981' },
];

export default function AdmissionsPage() {
    const [leads, setLeads] = useState<Lead[]>(INITIAL_LEADS);
    const [filterSource, setFilterSource] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');

    // Modals State
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

    // Filter Logic
    const filteredLeads = leads.filter(lead => {
        const matchesSource = filterSource === 'All' || lead.source === filterSource;
        const matchesSearch = lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            lead.course.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesSource && matchesSearch;
    });

    // Dynamic Stats
    const totalLeads = leads.length;
    const enrolledCount = leads.filter(l => l.stage === 'enrolled').length;
    const conversionRate = totalLeads > 0 ? Math.round((enrolledCount / totalLeads) * 100) : 0;
    const pendingFollowUps = leads.filter(l => l.stage === 'contacted').length;

    // Actions
    const handleAddLead = (e: React.FormEvent) => {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        const newLead: Lead = {
            id: Date.now(),
            name: (form.elements.namedItem('name') as HTMLInputElement).value,
            email: (form.elements.namedItem('email') as HTMLInputElement).value,
            phone: (form.elements.namedItem('phone') as HTMLInputElement).value,
            course: (form.elements.namedItem('course') as HTMLInputElement).value,
            source: (form.elements.namedItem('source') as HTMLInputElement).value,
            stage: 'new',
            time: 'Just now',
            notes: '',
            probability: 20
        };
        setLeads([newLead, ...leads]);
        setIsAddOpen(false);
    };

    const handleStageChange = (leadId: number, newStage: Stage) => {
        setLeads(leads.map(l => l.id === leadId ? { ...l, stage: newStage } : l));
        if (selectedLead) setSelectedLead(prev => prev ? { ...prev, stage: newStage } : null);
    };

    return (
        <DashboardLayout role="super_admin">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={styles.container}
            >
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '1.5rem' }}>
                    <div>
                        <div className={styles.textLabel} style={{ marginBottom: '0.25rem' }}>Sales & Marketing</div>
                        <h1 className={styles.textH1}>Admissions CRM</h1>
                    </div>
                    <div className={styles.actionBtnRow}>
                        <div className={styles.searchBar}>
                            <Search size={16} style={{ color: '#94a3b8' }} />
                            <input
                                type="text"
                                className={styles.searchInput}
                                placeholder="Search leads..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <button className={styles.btnPrimary} onClick={() => setIsAddOpen(true)}>
                            <Plus size={18} /> Add Lead
                        </button>
                    </div>
                </div>

                {/* KPI Overview */}
                <div className={styles.statsGrid}>
                    <StatsCard title="Total Leads (Feb)" value={totalLeads.toString()} trend="+12%" trendUp={true} icon={Users} color="#3b82f6" />
                    <StatsCard title="Conversion Rate" value={`${conversionRate}%`} trend="+4%" trendUp={true} icon={CheckCircle} color="#10b981" />
                    <StatsCard title="Action Required" value={pendingFollowUps.toString()} trend="Follow-ups" trendUp={false} icon={Phone} color="#f59e0b" />
                    <StatsCard title="Pipeline Est." value="$42k" trend="+8%" trendUp={true} icon={Users} color="#8b5cf6" />
                </div>

                {/* Filters */}
                <div className={styles.filterBar}>
                    {['All', 'Website', 'LinkedIn', 'Referral', 'Walk-in', 'Ad Campaign'].map(src => (
                        <button
                            key={src}
                            onClick={() => setFilterSource(src)}
                            className={`${styles.filterChip} ${filterSource === src ? styles.filterChipActive : ''}`}
                        >
                            {src}
                        </button>
                    ))}
                </div>

                {/* Kanban Board */}
                <div className={styles.kanbanBoard}>
                    {PIPELINE_STAGES.map((stage) => (
                        <div key={stage.id} className={styles.kanbanColumn} style={{ borderTop: `4px solid ${stage.color}` }}>
                            <div className={styles.kanbanHeader}>
                                <div style={{ fontWeight: 600, color: '#e2e8f0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: stage.color }}></span>
                                    {stage.label}
                                </div>
                                <span style={{ fontSize: '0.75rem', background: 'rgba(255,255,255,0.1)', padding: '2px 8px', borderRadius: '10px' }}>
                                    {filteredLeads.filter(l => l.stage === stage.id).length}
                                </span>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', overflowY: 'auto', flex: 1 }}>
                                {filteredLeads.filter(l => l.stage === stage.id).map((lead) => (
                                    <div
                                        key={lead.id}
                                        className={styles.kanbanCard}
                                        onClick={() => setSelectedLead(lead)}
                                    >
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                            <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{lead.name}</span>
                                            <span style={{ fontSize: '0.7rem', color: '#64748b' }}>{lead.time}</span>
                                        </div>
                                        <div style={{ fontSize: '0.8rem', color: '#cbd5e1', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <FileText size={12} /> {lead.course}
                                        </div>

                                        {/* Probability Bar */}
                                        <div style={{ marginBottom: '0.75rem' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#94a3b8', marginBottom: '2px' }}>
                                                <span>Probability</span>
                                                <span>{lead.probability}%</span>
                                            </div>
                                            <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px' }}>
                                                <div style={{ width: `${lead.probability}%`, height: '100%', background: stage.color, borderRadius: '2px' }}></div>
                                            </div>
                                        </div>

                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.5rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                <div className={styles.cardActionBtn} title="Call"><Phone size={14} /></div>
                                                <div className={styles.cardActionBtn} title="Email"><Mail size={14} /></div>
                                            </div>
                                            <span style={{ fontSize: '0.7rem', color: '#64748b' }}>{lead.source}</span>
                                        </div>
                                    </div>
                                ))}
                                {filteredLeads.filter(l => l.stage === stage.id).length === 0 && (
                                    <div style={{ padding: '2rem', textAlign: 'center', color: '#64748b', fontSize: '0.8rem', border: '2px dashed rgba(255,255,255,0.05)', borderRadius: '8px' }}>
                                        No leads
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {/* -- Add Lead Modal -- */}
                <AnimatePresence>
                    {isAddOpen && (
                        <div className={styles.modalOverlay}>
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className={`${styles.modalContent} ${styles.modalContentMedium}`}
                            >
                                <div className={styles.modalHeader}>
                                    <h2 className={styles.modalTitle}>Add New Lead</h2>
                                    <button onClick={() => setIsAddOpen(false)} className={styles.closeBtn}>✕</button>
                                </div>
                                <form onSubmit={handleAddLead} className={styles.modalBody}>
                                    <div className={styles.formGroup}>
                                        <label className={styles.formLabel}>Full Name</label>
                                        <input name="name" type="text" className={styles.formInput} required placeholder="John Doe" />
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                        <div className={styles.formGroup}>
                                            <label className={styles.formLabel}>Email</label>
                                            <input name="email" type="email" className={styles.formInput} required placeholder="john@example.com" />
                                        </div>
                                        <div className={styles.formGroup}>
                                            <label className={styles.formLabel}>Phone</label>
                                            <input name="phone" type="tel" className={styles.formInput} required placeholder="+91..." />
                                        </div>
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label className={styles.formLabel}>Interested Course</label>
                                        <select name="course" className={styles.formSelect}>
                                            <option>Java Full Stack</option>
                                            <option>Data Science & AI</option>
                                            <option>DevOps Engineering</option>
                                            <option>Cloud Computing</option>
                                        </select>
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label className={styles.formLabel}>Source</label>
                                        <select name="source" className={styles.formSelect}>
                                            <option>Website</option>
                                            <option>Walk-in</option>
                                            <option>Referral</option>
                                            <option>LinkedIn</option>
                                        </select>
                                    </div>
                                    <div className={styles.formActions}>
                                        <button type="button" onClick={() => setIsAddOpen(false)} className={styles.btnSecondary} style={{ justifyContent: 'center', flex: 1 }}>Cancel</button>
                                        <button type="submit" className={styles.btnPrimary} style={{ justifyContent: 'center', flex: 1 }}>Add Lead</button>
                                    </div>
                                </form>
                            </motion.div>
                        </div>
                    )}

                    {/* -- Lead Detail Modal -- */}
                    {selectedLead && (
                        <div className={styles.modalOverlay}>
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className={`${styles.modalContent} ${styles.modalContentLarge}`}
                                style={{ maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}
                            >
                                <div className={styles.modalHeader}>
                                    <div>
                                        <h2 className={styles.modalTitle}>{selectedLead.name}</h2>
                                        <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>ID: LE-{selectedLead.id}</span>
                                    </div>
                                    <button onClick={() => setSelectedLead(null)} className={styles.closeBtn}>✕</button>
                                </div>
                                <div className={styles.modalBody} style={{ flex: 1, overflowY: 'auto' }}>
                                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
                                        {/* Main Info */}
                                        <div>
                                            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
                                                <div style={{ flex: 1, padding: '1rem', background: 'rgba(30,41,59,0.3)', borderRadius: '0.5rem' }}>
                                                    <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: '0.25rem' }}>Email</div>
                                                    <div style={{ color: 'white' }}>{selectedLead.email}</div>
                                                </div>
                                                <div style={{ flex: 1, padding: '1rem', background: 'rgba(30,41,59,0.3)', borderRadius: '0.5rem' }}>
                                                    <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: '0.25rem' }}>Phone</div>
                                                    <div style={{ color: 'white' }}>{selectedLead.phone}</div>
                                                </div>
                                            </div>

                                            <h3 style={{ color: '#a78bfa', fontSize: '1rem', fontWeight: 600, marginBottom: '1rem' }}>Activity Timeline</h3>
                                            <div className={styles.activityTimeline}>
                                                <div className={styles.activityItem}>
                                                    <div className={styles.activityDot}></div>
                                                    <div className={styles.activityContent}>
                                                        <div style={{ fontWeight: 600, color: 'white', marginBottom: '0.25rem' }}>Stage Updated to {selectedLead.stage.toUpperCase()}</div>
                                                        <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Updated by System • Just now</div>
                                                    </div>
                                                </div>
                                                <div className={styles.activityItem}>
                                                    <div className={styles.activityDot} style={{ background: '#64748b' }}></div>
                                                    <div className={styles.activityContent}>
                                                        <div style={{ fontWeight: 600, color: 'white', marginBottom: '0.25rem' }}>Lead Created</div>
                                                        <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Source: {selectedLead.source} • {selectedLead.time}</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Sidebar Actions */}
                                        <div style={{ borderLeft: '1px solid rgba(51,65,85,0.5)', paddingLeft: '1.5rem' }}>
                                            <div className={styles.formGroup}>
                                                <label className={styles.formLabel}>Current Stage</label>
                                                <select
                                                    className={styles.formSelect}
                                                    value={selectedLead.stage}
                                                    onChange={(e) => handleStageChange(selectedLead.id, e.target.value as Stage)}
                                                >
                                                    <option value="new">New Lead</option>
                                                    <option value="contacted">Contacted</option>
                                                    <option value="demo">Demo Scheduled</option>
                                                    <option value="enrolled">Enrolled</option>
                                                </select>
                                            </div>

                                            <div className={styles.formGroup}>
                                                <label className={styles.formLabel}>Actions</label>
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                                    <button className={styles.btnSecondary} style={{ justifyContent: 'center' }}><Phone size={16} /> Log Call</button>
                                                    <button className={styles.btnSecondary} style={{ justifyContent: 'center' }}><Mail size={16} /> Send Email</button>
                                                    <button className={styles.btnSecondary} style={{ justifyContent: 'center' }}><Calendar size={16} /> Schedule Demo</button>
                                                </div>
                                            </div>

                                            <div style={{ marginTop: '2rem', padding: '1rem', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '0.5rem', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                                                <div style={{ display: 'flex', gap: '0.5rem', color: '#10b981', fontWeight: 600, marginBottom: '0.5rem' }}>
                                                    <Star size={18} fill="#10b981" /> High Intent
                                                </div>
                                                <p style={{ fontSize: '0.8rem', color: '#d1fae5' }}>This lead has a high probability ({selectedLead.probability}%) of conversion.</p>
                                            </div>
                                        </div>
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
