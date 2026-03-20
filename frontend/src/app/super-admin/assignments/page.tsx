"use client";

import DashboardLayout from '@/components/DashboardLayout';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { 
    FileText, Plus, Search, Edit2, Trash2, 
    CheckCircle, Clock, AlertCircle, 
    Filter, Send, Activity, User
} from 'lucide-react';

export default function AssignmentManagement() {
    const [assignments, setAssignments] = useState<any[]>([]);

    useEffect(() => {
        setAssignments([
            { id: 1, title: 'Auth Multi-tenant Service Implementation', batch: 'J1_APRIL', submissions: 32, total: 45, deadline: '2026-03-25' },
            { id: 2, title: 'Design System Implementation', batch: 'R2_MAY', submissions: 18, total: 24, deadline: '2026-03-22' },
            { id: 3, title: 'Advanced K8s Deployment', batch: 'D1_JUNE', submissions: 12, total: 15, deadline: '2026-03-20' },
        ]);
    }, []);

    return (
        <DashboardLayout role="super_admin">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                    <div>
                        <h1 style={{ fontSize: '2.5rem', fontWeight: 900, letterSpacing: '-1px' }}>Global Assignments Desk</h1>
                        <p style={{ color: 'var(--text-dim)', fontSize: '1.1rem' }}>Architect curriculum evaluation protocols and track global submissions.</p>
                    </div>
                    <button className="btn-quantum" style={{ padding: '14px 28px' }}>
                        <Plus size={18} style={{ marginRight: '8px' }} /> ISSUE NEW TASK
                    </button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>
                    {assignments.map((a, i) => (
                        <AssignmentCard key={a.id} {...a} />
                    ))}
                </div>

                {/* --- SUBMISSIONS MONITOR --- */}
                <div className="glass-panel" style={{ padding: '2.5rem', borderRadius: '32px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                        <h3 style={{ fontSize: '1.4rem', fontWeight: 900 }}>Submission Real-time Monitor</h3>
                        <div style={{ padding: '8px 20px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', fontSize: '0.8rem', fontWeight: 700 }}>
                            <Filter size={14} style={{ marginRight: '8px' }} /> FILTER BY BATCH
                        </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        <SubmissionRow name="Anjali Sharma" task="Auth Cluster" status="VERIFIED" time="5m ago" />
                        <SubmissionRow name="Karthik R." task="Auth Cluster" status="PENDING_REVIEW" time="15m ago" />
                        <SubmissionRow name="Deepak Kumar" task="Design System" status="RE-EVALUATE" time="1h ago" />
                    </div>
                </div>
            </motion.div>
        </DashboardLayout>
    );
}

function AssignmentCard({ title, batch, submissions, total, deadline }: any) {
    const percent = Math.round((submissions / total) * 100);
    return (
        <div className="glass-panel" style={{ padding: '2rem', borderRadius: '24px', borderTop: '4px solid var(--primary)', background: 'linear-gradient(180deg, rgba(124, 58, 237, 0.05) 0%, transparent 100%)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                <span style={{ fontSize: '0.65rem', fontWeight: 900, color: 'var(--primary)', letterSpacing: '1px', background: 'rgba(124, 58, 237, 0.1)', padding: '4px 10px', borderRadius: '111px' }}>ACTIVE PROTOCOL</span>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#ef4444' }}><Clock size={12} style={{ marginRight: '5px' }} /> D-DAY: {deadline}</span>
            </div>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 900, marginBottom: '0.5rem' }}>{title}</h3>
            <p style={{ color: 'var(--text-dim)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>Batch: {batch}</p>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 800 }}>SYNC PROGRESS</span>
                <span style={{ fontSize: '0.75rem', fontWeight: 800 }}>{percent}%</span>
            </div>
            <div style={{ height: '6px', width: '100%', background: 'rgba(255,255,255,0.05)', borderRadius: '100px', overflow: 'hidden', marginBottom: '1.5rem' }}>
                <div style={{ height: '100%', width: `${percent}%`, background: 'var(--primary)', borderRadius: '100px', boxShadow: '0 0 10px var(--primary)' }} />
            </div>

            <div style={{ display: 'flex', gap: '15px' }}>
                <button style={{ flex: 1, padding: '10px', background: 'var(--primary)', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 800, cursor: 'pointer', fontSize: '0.8rem' }}>EVALUATE QUEUE</button>
                <button style={{ padding: '10px', background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', fontWeight: 800, cursor: 'pointer' }}>STATS</button>
            </div>
        </div>
    );
}

function SubmissionRow({ name, task, status, time }: any) {
    const statusMap: any = {
        'VERIFIED': { color: '#10b981', label: 'SUCCESS_READ' },
        'PENDING_REVIEW': { color: '#f59e0b', label: 'HUB_QUEUE' },
        'RE-EVALUATE': { color: '#ef4444', label: 'RE_MAP' }
    };
    return (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem', background: 'rgba(255,255,255,0.02)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.03)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900 }}>{name.charAt(0)}</div>
                <div>
                    <div style={{ fontWeight: 800, fontSize: '1rem' }}>{name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '2px' }}><Send size={10} style={{ marginRight: '5px' }} /> Task: {task}</div>
                </div>
            </div>
            <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.65rem', fontWeight: 900, color: statusMap[status]?.color, letterSpacing: '1px', marginBottom: '4px' }}>{statusMap[status]?.label}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontWeight: 700 }}>{time}</div>
            </div>
        </div>
    );
}
