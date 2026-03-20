"use client";

import DashboardLayout from '@/components/DashboardLayout';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { 
    CheckCircle, Plus, Search, Edit2, Trash2, 
    AlertCircle, Clock, Award, BookOpen,
    Cpu, Code, Layers, FileJson, TrendingUp
} from 'lucide-react';

export default function TestManagement() {
    const [tests, setTests] = useState<any[]>([]);

    useEffect(() => {
        setTests([
            { id: 1, title: 'Mastery Exam: Java Algorithms', type: 'Coding', questions: 25, duration: '2h 15m', status: 'ACTIVE' },
            { id: 2, title: 'Assessment: React Performance', type: 'MCQ', questions: 40, duration: '1h 30m', status: 'DRAFT' },
            { id: 3, title: 'Final Capstone Project Exam', type: 'Case Study', questions: 5, duration: '4h 00m', status: 'LOCKED' },
        ]);
    }, []);

    return (
        <DashboardLayout role="super_admin">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                    <div>
                        <h1 style={{ fontSize: '2.5rem', fontWeight: 900, letterSpacing: '-1px' }}>Universal Test Engine</h1>
                        <p style={{ color: 'var(--text-dim)', fontSize: '1.1rem' }}>Engineer the evaluation matrix and automated scoring nodes.</p>
                    </div>
                    <button className="btn-quantum" style={{ padding: '14px 28px' }}>
                        <Plus size={18} style={{ marginRight: '8px' }} /> NEW ASSESSMENT NODE
                    </button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '2.5rem', marginBottom: '4rem' }}>
                    {tests.map((t, i) => (
                        <TestCard key={t.id} {...t} />
                    ))}
                </div>

                {/* --- RESULTS PANEL --- */}
                <div className="glass-panel" style={{ padding: '3rem', borderRadius: '40px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '3rem' }}>
                        <div>
                            <h3 style={{ fontSize: '1.6rem', fontWeight: 900 }}>Global Scoring Hub</h3>
                            <p style={{ fontSize: '0.9rem', color: 'var(--text-dim)' }}>Real-time ranking and competency mapping.</p>
                        </div>
                        <div style={{ padding: '10px 24px', background: 'rgba(59, 130, 246, 0.1)', color: 'var(--primary)', borderRadius: '100px', fontSize: '0.75rem', fontWeight: 900 }}>
                            <TrendingUp size={16} style={{ marginRight: '8px' }} /> ANALYZE COMPETENCY
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem' }}>
                        <div>
                            <h4 style={{ fontSize: '0.8rem', fontWeight: 900, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '1.5rem' }}>Top Ranking Scenarios</h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                <RankingRow name="Karthik R." score="98%" percentile="99.2" rank="RANK_1" />
                                <RankingRow name="Sai Kiran" score="95%" percentile="98.5" rank="RANK_2" />
                                <RankingRow name="Deepak Kumar" score="94%" percentile="97.8" rank="RANK_3" />
                            </div>
                        </div>
                        <div className="glass-panel" style={{ padding: '2rem', borderRadius: '24px', background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.05)' }}>
                             <h4 style={{ fontSize: '0.8rem', fontWeight: 900, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '1.5rem' }}>Automated Proctoring Logs</h4>
                             <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                 <LogEntry type="CAM_ALERT" label="Student #142 window blurred" status="SUSPICIOUS" />
                                 <LogEntry type="AUTH_SYNC" label="Biometric match: Passed" status="SECURE" />
                                 <LogEntry type="TIMER" label="Batch J1 Exam Time Terminated" status="COMPLETED" />
                             </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </DashboardLayout>
    );
}

function TestCard({ title, type, questions, duration, status }: any) {
    const statusMap: any = {
        'ACTIVE': { color: '#10b981', label: 'DEPLOYED' },
        'DRAFT': { color: '#3b82f6', label: 'STAGING' },
        'LOCKED': { color: '#ef4444', label: 'CLOSED' }
    };
    return (
        <div className="glass-panel" style={{ padding: '2.5rem', borderRadius: '32px', borderLeft: `6px solid ${statusMap[status].color}`, position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', right: '-15px', top: '10px', fontSize: '10rem', color: 'rgba(255,255,255,0.02)', fontWeight: 900, zIndex: 0 }}>{status.charAt(0)}</div>
            <div style={{ zIndex: 1, position: 'relative' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <span style={{ fontSize: '0.65rem', fontWeight: 900, color: statusMap[status]?.color, letterSpacing: '2px', background: `${statusMap[status]?.color}15`, padding: '4px 10px', borderRadius: '100px' }}>{statusMap[status]?.label}</span>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <ActionButton icon={<Edit2 size={16} />} />
                        <ActionButton icon={<Trash2 size={16} />} color="#ef4444" />
                    </div>
                </div>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 900, marginBottom: '1rem' }}>{title}</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1.5rem' }}>
                    <div style={{ padding: '1rem', borderRadius: '16px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <div style={{ fontSize: '0.6rem', fontWeight: 800, color: 'var(--text-dim)', textTransform: 'uppercase' }}>Structure</div>
                        <div style={{ fontSize: '0.9rem', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '5px' }}>
                            {type === 'Coding' ? <Code size={14} /> : <FileJson size={14} />} {type}
                        </div>
                    </div>
                    <div style={{ padding: '1rem', borderRadius: '16px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <div style={{ fontSize: '0.6rem', fontWeight: 800, color: 'var(--text-dim)', textTransform: 'uppercase' }}>Question Load</div>
                        <div style={{ fontSize: '0.9rem', fontWeight: 900 }}>{questions} Nodes</div>
                    </div>
                </div>
                <div style={{ marginTop: '2rem', display: 'flex', alignItems: 'center', gap: '5px', color: 'var(--text-dim)', fontSize: '0.85rem', fontWeight: 700 }}>
                    <Clock size={14} /> RUNTIME: {duration}
                </div>
            </div>
        </div>
    );
}

function RankingRow({ name, score, percentile, rank }: any) {
    return (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem', background: 'rgba(255,255,255,0.02)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.03)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'var(--primary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '0.8rem' }}>{rank.split('_')[1]}</div>
                <div style={{ fontWeight: 800 }}>{name}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
                <div style={{ fontWeight: 900, color: '#10b981' }}>{score}</div>
                <div style={{ fontSize: '0.65rem', color: 'var(--text-dim)', fontWeight: 800 }}>{percentile}th PERCENTILE</div>
            </div>
        </div>
    );
}

function LogEntry({ type, label, status }: any) {
    return (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '10px', borderBottom: '1px solid rgba(255,255,255,0.02)' }}>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <div style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--text-dim)', minWidth: '70px' }}>{type}</div>
                <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>{label}</div>
            </div>
            <span style={{ fontSize: '0.65rem', fontWeight: 900, color: status === 'SUSPICIOUS' ? '#ef4444' : '#10b981' }}>{status}</span>
        </div>
    );
}

function ActionButton({ icon, color, onClick }: any) {
    return (
        <button onClick={onClick} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', color: color || 'var(--text-bright)', padding: '10px', borderRadius: '12px', cursor: 'pointer' }}>{icon}</button>
    );
}
