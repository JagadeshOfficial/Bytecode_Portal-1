"use client";

import DashboardLayout from '@/components/DashboardLayout';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { 
    Search, Plus, MapPin, Phone, 
    Mail, Filter, MoreHorizontal, UserCheck,
    TrendingUp, FileDown, Layers, Target,
    Activity, ChevronRight, X, CheckCircle, 
    Calendar, MessageCircle, BarChart3, ArrowUpRight
} from 'lucide-react';

type ViewMode = 'FEED' | 'PIPELINE' | 'ANALYTICS';
type LeadStatus = 'NEW' | 'CONTACTED' | 'INTERESTED' | 'NOT_INTERESTED' | 'CONVERTED';

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  source: string;
  status: LeadStatus;
  assigned: string;
  course: string;
}

export default function AdvancedCRM() {
    const [viewMode, setViewMode] = useState<ViewMode>('FEED');
    const [leads, setLeads] = useState<Lead[]>([]);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isImportModalOpen, setIsImportModalOpen] = useState(false);
    const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

    useEffect(() => {
        setLeads([
            { id: '1', name: 'Sai Kiran', email: 'sai@example.com', phone: '9876543210', source: 'Instagram Ad', status: 'NEW', assigned: 'Anjali Sharma', course: 'Java Full Stack' },
            { id: '2', name: 'Deepak Rao', email: 'deepak@tech.com', phone: '8888877777', source: 'LinkedIn Ref', status: 'CONTACTED', assigned: 'Siddharth M.', course: 'DevOps Master' },
            { id: '3', name: 'Ankita Ray', email: 'ankita@outlook.com', phone: '9999900000', source: 'Direct Walk-in', status: 'CONVERTED', assigned: 'Siddharth M.', course: 'UI/UX Pro' },
        ]);
    }, []);

    const getStatusColor = (status: LeadStatus) => {
        switch (status) {
            case 'NEW': return '#3b82f6';
            case 'CONTACTED': return '#f59e0b';
            case 'INTERESTED': return '#8b5cf6';
            case 'NOT_INTERESTED': return '#ef4444';
            case 'CONVERTED': return '#10b981';
            default: return '#fff';
        }
    };

    return (
        <DashboardLayout role="super_admin">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                
                {/* --- HEADER --- */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem' }}>
                    <div>
                        <div style={{ fontSize: '0.75rem', fontWeight: 900, color: 'var(--primary)', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '8px' }}>Sales & Growth</div>
                        <h1 style={{ fontSize: '3rem', fontWeight: 950, letterSpacing: '-2px', lineHeight: 0.9 }}>Quantum CRM <span style={{ color: 'var(--primary)' }}>Hub</span></h1>
                        <p style={{ color: 'var(--text-dim)', fontSize: '1.1rem', marginTop: '15px' }}>Automate your lead lifecycle and track multi-channel conversions.</p>
                    </div>
                    
                    <div style={{ display: 'flex', gap: '12px' }}>
                        <button className="btn-quantum" onClick={() => setIsImportModalOpen(true)} style={{ padding: '15px 30px', background: 'rgba(255,255,255,0.05)', color: '#fff' }}>
                            <FileDown size={18} /> IMPORT DATA
                        </button>
                        <button className="btn-quantum" onClick={() => setIsAddModalOpen(true)} style={{ padding: '15px 30px' }}>
                            <Plus size={18} /> CREATE NEW LEAD
                        </button>
                    </div>
                </div>

                {/* --- CONTROL BAR --- */}
                <div className="glass-panel" style={{ padding: '10px', borderRadius: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                    <div style={{ display: 'flex', gap: '5px' }}>
                        <TabButton active={viewMode === 'FEED'} onClick={() => setViewMode('FEED')} label="Production Feed" icon={<Layers size={16} />} />
                        <TabButton active={viewMode === 'PIPELINE'} onClick={() => setViewMode('PIPELINE')} label="Pipeline View" icon={<Target size={16} />} />
                        <TabButton active={viewMode === 'ANALYTICS'} onClick={() => setViewMode('ANALYTICS')} label="Growth Metrics" icon={<BarChart3 size={16} />} />
                    </div>
                    
                    <div style={{ display: 'flex', gap: '15px', paddingRight: '15px' }}>
                         <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', gap: '10px', padding: '0 15px', width: '300px' }}>
                            <Search size={16} color="var(--text-dim)" />
                            <input type="text" placeholder="Search across thousands of leads..." style={{ width: '100%', padding: '10px 0', background: 'none', border: 'none', color: '#fff', outline: 'none', fontSize: '0.9rem' }} />
                        </div>
                    </div>
                </div>

                {/* --- CONTENT AREA --- */}
                <AnimatePresence mode="wait">
                    {viewMode === 'FEED' && (
                        <motion.div key="feed" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '2.5rem' }}>
                                
                                <div className="glass-panel" style={{ padding: '2.5rem', borderRadius: '32px' }}>
                                    <div style={{ overflowX: 'auto' }}>
                                        <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 10px' }}>
                                            <thead>
                                                <tr style={{ fontSize: '0.7rem', fontWeight: 900, color: 'var(--text-dim)', textTransform: 'uppercase' }}>
                                                    <th style={{ padding: '10px 20px', textAlign: 'left' }}>Lead Entity</th>
                                                    <th style={{ padding: '10px 20px', textAlign: 'left' }}>Target Course</th>
                                                    <th style={{ padding: '10px 20px', textAlign: 'left' }}>Status</th>
                                                    <th style={{ padding: '10px 20px', textAlign: 'right' }}>Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {leads.map((l, i) => (
                                                    <tr key={l.id} style={{ background: 'rgba(255,255,255,0.01)', borderRadius: '16px' }} onClick={() => setSelectedLead(l)}>
                                                        <td style={{ padding: '20px', borderRadius: '16px 0 0 16px' }}>
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                                                <div style={{ width: '45px', height: '45px', borderRadius: '14px', background: 'var(--primary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '1.2rem' }}>{l.name.charAt(0)}</div>
                                                                <div>
                                                                    <div style={{ fontWeight: 900, fontSize: '1.05rem' }}>{l.name}</div>
                                                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginTop: '2px' }}>{l.phone} | {l.email}</div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td style={{ padding: '20px' }}>
                                                            <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{l.course}</div>
                                                            <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Via {l.source}</div>
                                                        </td>
                                                        <td style={{ padding: '20px' }}>
                                                            <span style={{ 
                                                                background: `${getStatusColor(l.status)}15`,
                                                                color: getStatusColor(l.status),
                                                                padding: '6px 14px',
                                                                borderRadius: '100px',
                                                                fontSize: '0.65rem',
                                                                fontWeight: 900,
                                                                letterSpacing: '1px'
                                                            }}>{l.status}</span>
                                                        </td>
                                                        <td style={{ padding: '20px', textAlign: 'right', borderRadius: '0 16px 16px 0' }}>
                                                            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                                                                <button className="icon-btn"><MessageCircle size={16} /></button>
                                                                <button className="icon-btn"><Phone size={16} /></button>
                                                                <button className="icon-btn"><MoreHorizontal size={16} /></button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                {/* SIDEBAR: ACTIVITY FEED */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                    <div className="glass-panel" style={{ padding: '2rem', borderRadius: '24px' }}>
                                        <h3 style={{ fontSize: '1.1rem', fontWeight: 900, marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <Activity color="var(--primary)" size={18} /> Conversion activity
                                        </h3>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                            <ActivityItem time="2M AGO" user="Koushik Krishna" action="Converted lead to Student" target="Arjun Das" />
                                            <ActivityItem time="15M AGO" user="System" action="Imported 45 leads from" target="Google Ads" />
                                            <ActivityItem time="1H AGO" user="Anjali Sharma" action="Rescheduled follow-up" target="Sai Kiran" />
                                        </div>
                                    </div>

                                    <div className="glass-panel" style={{ padding: '2rem', borderRadius: '24px', background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1), transparent)' }}>
                                        <div style={{ fontSize: '0.8rem', fontWeight: 900, color: 'var(--primary)', marginBottom: '10px' }}>SYSTEM HEALTH</div>
                                        <div style={{ fontSize: '1.8rem', fontWeight: 950 }}>98.2% <ArrowUpRight size={20} color="#10b981" /></div>
                                        <div style={{ fontSize: '0.85rem', color: 'var(--text-dim)', marginTop: '5px' }}>Conversion Velocity</div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                    
                    {viewMode === 'PIPELINE' && (
                        <motion.div key="pipeline" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }}>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '15px', height: '600px' }}>
                                <PipelineColumn title="New Leads" leads={leads.filter(l => l.status === 'NEW')} color="#3b82f6" />
                                <PipelineColumn title="Contacted" leads={leads.filter(l => l.status === 'CONTACTED')} color="#f59e0b" />
                                <PipelineColumn title="Interested" leads={leads.filter(l => l.status === 'INTERESTED')} color="#8b5cf6" />
                                <PipelineColumn title="Follow-up" leads={[]} color="#ef4444" />
                                <PipelineColumn title="Converted" leads={leads.filter(l => l.status === 'CONVERTED')} color="#10b981" />
                            </div>
                        </motion.div>
                    )}

                    {viewMode === 'ANALYTICS' && (
                        <motion.div key="analytics" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2.5rem' }}>
                                <div className="glass-panel" style={{ height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <div style={{ textAlign: 'center' }}>
                                        <BarChart3 size={60} color="var(--primary)" opacity={0.3} />
                                        <p style={{ marginTop: '1rem', fontWeight: 800, color: 'var(--text-dim)' }}>Lead Acqusition by Channel Chart</p>
                                    </div>
                                </div>
                                <div className="glass-panel" style={{ height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                   <div style={{ textAlign: 'center' }}>
                                        <TrendingUp size={60} color="#10b981" opacity={0.3} />
                                        <p style={{ marginTop: '1rem', fontWeight: 800, color: 'var(--text-dim)' }}>Monthly Conversion Forecast</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

            </motion.div>

            {/* --- CUSTOM STYLES --- */}
            <style jsx>{`
                .glass-panel {
                    background: rgba(255, 255, 255, 0.015);
                    backdrop-filter: blur(25px);
                    border: 1px solid rgba(255, 255, 255, 0.05);
                }
                .icon-btn {
                    background: rgba(255, 255, 255, 0.05);
                    border: 1px solid rgba(255, 255, 255, 0.05);
                    color: var(--text-dim);
                    padding: 8px;
                    border-radius: 10px;
                    cursor: pointer;
                    display: flex;
                    transition: all 0.2s ease;
                }
                .icon-btn:hover {
                    background: var(--primary);
                    color: #fff;
                    transform: translateY(-2px);
                }
            `}</style>
        </DashboardLayout>
    );
}

function TabButton({ active, label, icon, onClick }: any) {
    return (
        <button 
            onClick={onClick}
            style={{ 
                padding: '12px 24px', borderRadius: '16px', border: 'none',
                background: active ? 'var(--primary)' : 'transparent',
                color: active ? '#fff' : 'var(--text-dim)',
                fontWeight: 900, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '10px',
                cursor: 'pointer', transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
        >
            {icon} {label}
        </button>
    );
}

function ActivityItem({ time, user, action, target }: any) {
    return (
        <div style={{ display: 'flex', gap: '15px' }}>
            <div style={{ minWidth: '45px', fontSize: '0.65rem', fontWeight: 900, color: 'var(--text-dim)', paddingTop: '4px' }}>{time}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <div style={{ fontSize: '0.9rem', color: '#fff', fontWeight: 700 }}>
                    <span style={{ color: 'var(--primary)' }}>{user}</span> {action}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.75rem', fontWeight: 800, color: '#3b82f6' }}>
                    <div style={{ width: '6px', height: '6px', background: '#3b82f6', borderRadius: '50%' }} /> {target}
                </div>
            </div>
        </div>
    );
}

function PipelineColumn({ title, leads, color }: any) {
    return (
        <div className="glass-panel" style={{ padding: '1.25rem', borderRadius: '24px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <h4 style={{ fontSize: '0.8rem', fontWeight: 900, color: color, textTransform: 'uppercase', letterSpacing: '1px' }}>{title}</h4>
                <div style={{ background: 'rgba(255,255,255,0.05)', padding: '2px 8px', borderRadius: '8px', fontSize: '0.7rem', fontWeight: 900 }}>{leads.length}</div>
            </div>
            
            {leads.map((l: any) => (
                <motion.div 
                    key={l.id} 
                    whileHover={{ scale: 1.02 }}
                    style={{ background: 'rgba(255,255,255,0.02)', padding: '15px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)', cursor: 'grab' }}
                >
                    <div style={{ fontWeight: 900, fontSize: '0.9rem', marginBottom: '4px' }}>{l.name}</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>{l.course}</div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px' }}>
                        <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem' }}>
                            {l.assigned.charAt(0)}
                        </div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', background: 'rgba(255,255,255,0.05)', padding: '2px 8px', borderRadius: '6px' }}>{l.source}</div>
                    </div>
                </motion.div>
            ))}

            {leads.length === 0 && (
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px dashed rgba(255,255,255,0.02)', borderRadius: '16px' }}>
                    <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.1)', fontWeight: 900 }}>ZONE EMPTY</div>
                </div>
            )}
        </div>
    );
}
