"use client";

import DashboardLayout from '@/components/DashboardLayout';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { 
    Search, Plus, MapPin, Phone, 
    Mail, Filter, MoreHorizontal, UserCheck,
    TrendingUp, FileDown, Layers, Target,
    Activity, ChevronRight
} from 'lucide-react';

export default function LeadsCRM() {
    const [leads, setLeads] = useState<any[]>([]);

    useEffect(() => {
        setLeads([
            { id: 1, name: 'Sai Kiran', email: 'sai@example.com', phone: '+91 98765 43210', source: 'Web / Google', status: 'HOT', assigned: 'Anjali Sharma', course: 'Java Full Stack' },
            { id: 2, name: 'Deepak Kumar', email: 'deepak@tech.com', phone: '+91 88888 77777', source: 'LinkedIn', status: 'WARM', assigned: 'Siddharth M.', course: 'DevOps' },
            { id: 3, name: 'Ankita Ray', email: 'ankita@outlook.com', phone: '+91 99999 00000', source: 'Direct Walk-in', status: 'CLOSED', assigned: 'Siddharth M.', course: 'React Pro' },
        ]);
    }, []);

    return (
        <DashboardLayout role="super_admin">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                    <div>
                        <h1 style={{ fontSize: '2.5rem', fontWeight: 900, letterSpacing: '-1px' }}>Global Leads CRM</h1>
                        <p style={{ color: 'var(--text-dim)', fontSize: '1.1rem' }}>Architect the conversion funnel and oversee counselor assignments.</p>
                    </div>
                    <div style={{ display: 'flex', gap: '15px' }}>
                        <button className="btn-quantum" style={{ padding: '14px 28px', background: 'rgba(255,255,255,0.05)', color: '#fff' }}>
                            <FileDown size={18} style={{ marginRight: '8px' }} /> IMPORT DATA
                        </button>
                        <button className="btn-quantum" style={{ padding: '14px 28px' }}>
                            <Plus size={18} style={{ marginRight: '8px' }} /> NEW LEAD SOURCE
                        </button>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
                    <CRMStatCard title="Global Leads" value="1,452" trend="+124 vs prev" color="#8b5cf6" />
                    <CRMStatCard title="Hot Prospects" value="284" trend="20% Optimized" color="#ef4444" />
                    <CRMStatCard title="Conversion Rate" value="38.2%" trend="Top 1% benchmark" color="#10b981" />
                    <CRMStatCard title="Pipeline Value" value="$42,500" trend="Next 30D projection" color="#3b82f6" />
                </div>

                <div className="glass-panel" style={{ padding: '2.5rem', borderRadius: '32px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '20px' }}>
                        <h3 style={{ fontSize: '1.4rem', fontWeight: 900 }}>Production Leads Feed</h3>
                        <div style={{ display: 'flex', gap: '12px', flex: 1, maxWidth: '500px' }}>
                            <div style={{ flex: 1, background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', gap: '10px', padding: '0 15px' }}>
                                <Search size={16} color="var(--text-dim)" />
                                <input type="text" placeholder="Search leads by name, email, phone..." style={{ width: '100%', padding: '12px 0', background: 'none', border: 'none', color: '#fff', outline: 'none' }} />
                            </div>
                            <button style={{ padding: '10px 20px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', color: 'var(--text-dim)', fontWeight: 800 }}><Filter size={16} /></button>
                        </div>
                    </div>

                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 12px' }}>
                            <thead>
                                <tr style={{ fontSize: '0.7rem', fontWeight: 900, color: 'var(--text-dim)', textTransform: 'uppercase' }}>
                                    <th style={{ padding: '10px 20px', textAlign: 'left' }}>Lead Entity</th>
                                    <th style={{ padding: '10px 20px', textAlign: 'left' }}>Acquisition Path</th>
                                    <th style={{ padding: '10px 20px', textAlign: 'left' }}>Assigned Agent</th>
                                    <th style={{ padding: '10px 20px', textAlign: 'left' }}>Conversion Matrix</th>
                                    <th style={{ padding: '10px 20px', textAlign: 'right' }}>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {leads.map((l, i) => (
                                    <motion.tr 
                                        key={l.id} 
                                        initial={{ opacity: 0, y: 5 }} 
                                        animate={{ opacity: 1, y: 0 }} 
                                        transition={{ delay: i * 0.1 }}
                                        style={{ background: 'rgba(255,255,255,0.015)', borderRadius: '16px' }}
                                    >
                                        <td style={{ padding: '20px', borderRadius: '16px 0 0 16px', fontWeight: 900 }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                                <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>{l.name.charAt(0)}</div>
                                                <div>
                                                    <div style={{ fontWeight: 900 }}>{l.name}</div>
                                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                                        <Mail size={12} /> {l.email}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td style={{ padding: '20px', color: 'var(--text-dim)', fontWeight: 800, fontSize: '0.85rem' }}>{l.source}</td>
                                        <td style={{ padding: '20px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-bright)', fontWeight: 800, fontSize: '0.85rem' }}>
                                                <UserCheck size={14} color="var(--primary)" /> {l.assigned}
                                            </div>
                                        </td>
                                        <td style={{ padding: '20px' }}>
                                            <span style={{ 
                                                background: l.status === 'HOT' ? 'rgba(239, 68, 68, 0.1)' : (l.status === 'WARM' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(16, 185, 129, 0.1)'),
                                                color: l.status === 'HOT' ? '#ef4444' : (l.status === 'WARM' ? '#f59e0b' : '#10b981'),
                                                padding: '5px 14px',
                                                borderRadius: '100px',
                                                fontSize: '0.7rem',
                                                fontWeight: 900,
                                                letterSpacing: '1px'
                                            }}>{l.status}</span>
                                        </td>
                                        <td style={{ padding: '20px', textAlign: 'right', borderRadius: '0 16px 16px 0' }}>
                                            <button style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.05)', color: '#fff', padding: '8px 16px', borderRadius: '10px', fontSize: '0.8rem', fontWeight: 800, cursor: 'pointer' }}>ANALYZE</button>
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
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
