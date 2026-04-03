"use client";

import DashboardLayout from '@/components/DashboardLayout';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { 
    Search, Plus, MapPin, Phone, 
    Mail, Filter, MoreHorizontal, UserCheck,
    TrendingUp, FileDown, Layers, Target,
    Activity, ChevronRight, X, CheckCircle, Clock, AlertCircle
} from 'lucide-react';

type LeadStatus = 'NEW' | 'CONTACTED' | 'INTERESTED' | 'NOT_INTERESTED' | 'CONVERTED';

interface Lead {
    id: string;
    name: string;
    email: string;
    phone: string;
    course: string;
    source: string;
    status: LeadStatus;
    assignedCounsellor: string;
    notes?: string;
    followUpDate?: string;
}

export default function AdminLeadsCRM() {
    const [leads, setLeads] = useState<Lead[]>([]);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isImportModalOpen, setIsImportModalOpen] = useState(false);
    const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
    const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
    const [leadForm, setLeadForm] = useState({
        name: '', email: '', phone: '', course: '', source: '', status: 'NEW' as LeadStatus
    });

    useEffect(() => {
        // Initial mock data to show functionality
        setLeads([
            { id: '1', name: 'Ravi Teja', email: 'ravi@gmail.com', phone: '9876543210', source: 'Instagram', status: 'NEW', assignedCounsellor: 'Unassigned', course: 'Java Full Stack' },
            { id: '2', name: 'Sneha Reddy', email: 'sneha@outlook.com', phone: '8888777766', source: 'Web / Google', status: 'CONTACTED', assignedCounsellor: 'Anjali Sharma', course: 'Python Data Science' },
            { id: '3', name: 'Arjun Das', email: 'arjun@tech.in', phone: '9000010000', source: 'Direct Walk-in', status: 'CONVERTED', assignedCounsellor: 'Siddharth M.', course: 'Full Stack Web' },
        ]);
    }, []);

    const handleAddLead = (e: React.FormEvent) => {
        e.preventDefault();
        const newLead: Lead = {
            id: Math.random().toString(36).substr(2, 9),
            ...leadForm,
            assignedCounsellor: 'Unassigned'
        };
        setLeads([newLead, ...leads]);
        setIsAddModalOpen(false);
        setLeadForm({ name: '', email: '', phone: '', course: '', source: '', status: 'NEW' });
    };

    const getStatusColor = (status: LeadStatus) => {
        switch (status) {
            case 'NEW': return { bg: 'rgba(59, 130, 246, 0.1)', text: '#3b82f6' };
            case 'CONTACTED': return { bg: 'rgba(245, 158, 11, 0.1)', text: '#f59e0b' };
            case 'INTERESTED': return { bg: 'rgba(139, 92, 246, 0.1)', text: '#8b5cf6' };
            case 'NOT_INTERESTED': return { bg: 'rgba(239, 68, 68, 0.1)', text: '#ef4444' };
            case 'CONVERTED': return { bg: 'rgba(16, 185, 129, 0.1)', text: '#10b981' };
            default: return { bg: 'rgba(255, 255, 255, 0.1)', text: '#fff' };
        }
    };

    return (
        <DashboardLayout role="admin">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                    <div>
                        <h1 style={{ fontSize: '2.5rem', fontWeight: 900, letterSpacing: '-1px' }}>Admin Leads Desk</h1>
                        <p style={{ color: 'var(--text-dim)', fontSize: '1.1rem' }}>Monitor lead conversion matrix and oversee team assignments.</p>
                    </div>
                    <div style={{ display: 'flex', gap: '15px' }}>
                        <button className="btn-quantum" onClick={() => setIsImportModalOpen(true)} style={{ padding: '14px 28px', background: 'rgba(255,255,255,0.05)', color: '#fff' }}>
                            <FileDown size={18} style={{ marginRight: '8px' }} /> IMPORT CSV
                        </button>
                        <button className="btn-quantum" onClick={() => setIsAddModalOpen(true)} style={{ padding: '14px 28px' }}>
                            <Plus size={18} style={{ marginRight: '8px' }} /> ADD NEW LEAD
                        </button>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
                    <CRMStatCard title="Total Leads" value={leads.length.toString()} trend="+4 today" color="#8b5cf6" />
                    <CRMStatCard title="Active Follow-ups" value="12" trend="3 OVERDUE" color="#f59e0b" />
                    <CRMStatCard title="Interested" value="48" trend="15% conversion probability" color="#3b82f6" />
                    <CRMStatCard title="Fully Converted" value="9" trend="Top performance" color="#10b981" />
                </div>

                <div className="glass-panel" style={{ padding: '2.5rem', borderRadius: '32px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '20px' }}>
                        <h3 style={{ fontSize: '1.4rem', fontWeight: 900 }}>Lead Feed</h3>
                        <div style={{ display: 'flex', gap: '12px', flex: 1, maxWidth: '500px' }}>
                            <div style={{ flex: 1, background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', gap: '10px', padding: '0 15px' }}>
                                <Search size={16} color="var(--text-dim)" />
                                <input type="text" placeholder="Search by name, email, phone..." style={{ width: '100%', padding: '12px 0', background: 'none', border: 'none', color: '#fff', outline: 'none' }} />
                            </div>
                            <button style={{ padding: '10px 20px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', color: 'var(--text-dim)', fontWeight: 800 }}><Filter size={16} /></button>
                        </div>
                    </div>

                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 12px' }}>
                            <thead>
                                <tr style={{ fontSize: '0.7rem', fontWeight: 900, color: 'var(--text-dim)', textTransform: 'uppercase' }}>
                                    <th style={{ padding: '10px 20px', textAlign: 'left' }}>Lead Details</th>
                                    <th style={{ padding: '10px 20px', textAlign: 'left' }}>Course & Source</th>
                                    <th style={{ padding: '10px 20px', textAlign: 'left' }}>Counsellor</th>
                                    <th style={{ padding: '10px 20px', textAlign: 'left' }}>Status</th>
                                    <th style={{ padding: '10px 20px', textAlign: 'right' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {leads.map((l, i) => {
                                    const { bg, text } = getStatusColor(l.status);
                                    return (
                                        <motion.tr 
                                            key={l.id} 
                                            initial={{ opacity: 0, y: 5 }} 
                                            animate={{ opacity: 1, y: 0 }} 
                                            transition={{ delay: i * 0.05 }}
                                            style={{ background: 'rgba(255,255,255,0.015)', borderRadius: '16px' }}
                                        >
                                            <td style={{ padding: '20px', borderRadius: '16px 0 0 16px' }}>
                                                <div>
                                                    <div style={{ fontWeight: 900, fontSize: '1rem' }}>{l.name}</div>
                                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '4px' }}>{l.email} | {l.phone}</div>
                                                </div>
                                            </td>
                                            <td style={{ padding: '20px' }}>
                                                <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>{l.course}</div>
                                                <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>Via {l.source}</div>
                                            </td>
                                            <td style={{ padding: '20px' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 800, fontSize: '0.85rem' }}>
                                                    <UserCheck size={14} color="var(--primary)" /> {l.assignedCounsellor}
                                                </div>
                                            </td>
                                            <td style={{ padding: '20px' }}>
                                                <span style={{ 
                                                    background: bg,
                                                    color: text,
                                                    padding: '6px 14px',
                                                    borderRadius: '100px',
                                                    fontSize: '0.65rem',
                                                    fontWeight: 900,
                                                    letterSpacing: '1px'
                                                }}>{l.status}</span>
                                            </td>
                                            <td style={{ padding: '20px', textAlign: 'right', borderRadius: '0 16px 16px 0' }}>
                                                <button onClick={() => { setSelectedLead(l); setIsAssignModalOpen(true); }} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.05)', color: '#fff', padding: '8px 16px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 900, cursor: 'pointer', transition: 'all 0.3s ease' }}>ASSIGN</button>
                                            </td>
                                        </motion.tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* --- MODALS --- */}
                {isAddModalOpen && (
                    <div style={{ position: 'fixed', inset: 0, zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)' }}>
                        <div className="glass-panel" style={{ width: '90%', maxWidth: '500px', padding: '2.5rem', borderRadius: '32px', position: 'relative' }}>
                            <button onClick={() => setIsAddModalOpen(false)} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}><X size={20}/></button>
                            <h2 style={{ fontSize: '1.6rem', fontWeight: 900, marginBottom: '2rem' }}>Add New Prospect</h2>
                            <form onSubmit={handleAddLead} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    <label style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-dim)', textTransform: 'uppercase' }}>Full Name</label>
                                    <input required value={leadForm.name} onChange={e => setLeadForm({...leadForm, name: e.target.value})} style={{ padding: '14px', borderRadius: '12px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', outline: 'none' }} placeholder="Enter lead name" />
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                        <label style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-dim)', textTransform: 'uppercase' }}>Email</label>
                                        <input required type="email" value={leadForm.email} onChange={e => setLeadForm({...leadForm, email: e.target.value})} style={{ padding: '14px', borderRadius: '12px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', outline: 'none' }} placeholder="name@email.com" />
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                        <label style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-dim)', textTransform: 'uppercase' }}>Phone</label>
                                        <input required value={leadForm.phone} onChange={e => setLeadForm({...leadForm, phone: e.target.value})} style={{ padding: '14px', borderRadius: '12px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', outline: 'none' }} placeholder="9876543210" />
                                    </div>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                        <label style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-dim)', textTransform: 'uppercase' }}>Target Course</label>
                                        <input required value={leadForm.course} onChange={e => setLeadForm({...leadForm, course: e.target.value})} style={{ padding: '14px', borderRadius: '12px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', outline: 'none' }} placeholder="Java Full Stack" />
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                        <label style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-dim)', textTransform: 'uppercase' }}>Lead Source</label>
                                        <input required value={leadForm.source} onChange={e => setLeadForm({...leadForm, source: e.target.value})} style={{ padding: '14px', borderRadius: '12px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', outline: 'none' }} placeholder="Instagram / Ad" />
                                    </div>
                                </div>
                                <button type="submit" className="btn-quantum" style={{ padding: '16px', borderRadius: '14px', marginTop: '1rem', fontWeight: 900 }}>CREATE LEAD ENTITY</button>
                            </form>
                        </div>
                    </div>
                )}

                {/* --- IMPORT CSV MODAL --- */}
                {isImportModalOpen && (
                    <div style={{ position: 'fixed', inset: 0, zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)' }}>
                        <div className="glass-panel" style={{ width: '90%', maxWidth: '500px', padding: '3rem', borderRadius: '32px', position: 'relative', textAlign: 'center' }}>
                            <button onClick={() => setIsImportModalOpen(false)} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}><X size={20}/></button>
                            <div style={{ width: '80px', height: '80px', borderRadius: '24px', background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem' }}><FileDown size={40} /></div>
                            <h2 style={{ fontSize: '1.8rem', fontWeight: 900, marginBottom: '0.5rem' }}>Bulk Lead Upload</h2>
                            <p style={{ color: 'var(--text-dim)', marginBottom: '2.5rem' }}>Upload a CSV file containing lead information.<br/>Max 5,000 entities per upload.</p>
                            
                            <div style={{ border: '2px dashed rgba(255,255,255,0.1)', borderRadius: '20px', padding: '2.5rem', cursor: 'pointer', transition: 'all 0.3s ease' }} onMouseOver={e => e.currentTarget.style.borderColor = 'var(--primary)'} onMouseOut={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'}>
                                <input type="file" id="csvFile" style={{ display: 'none' }} accept=".csv" />
                                <label htmlFor="csvFile" style={{ cursor: 'pointer' }}>
                                    <div style={{ fontWeight: 800, fontSize: '1rem' }}>Click to select .CSV file</div>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginTop: '8px' }}>or drag and drop here</div>
                                </label>
                            </div>

                            <button className="btn-quantum" style={{ width: '100%', padding: '16px', borderRadius: '14px', marginTop: '2.5rem', fontWeight: 900 }}>VALIDATE & IMPORT DATA</button>
                        </div>
                    </div>
                )}
            </motion.div>
        </DashboardLayout>
    );
}

function CRMStatCard({ title, value, trend, color }: any) {
    return (
        <div className="glass-panel" style={{ padding: '1.75rem', borderRadius: '24px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '4px', background: color }} />
            <div style={{ fontSize: '0.7rem', fontWeight: 900, color: 'var(--text-dim)', letterSpacing: '1px', textTransform: 'uppercase' }}>{title}</div>
            <div style={{ fontSize: '2.2rem', fontWeight: 900, margin: '10px 0' }}>{value}</div>
            <div style={{ fontSize: '0.75rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '5px' }}>
                <TrendingUp size={14} color={color} /> <span style={{ color: color }}>{trend}</span>
            </div>
        </div>
    );
}
