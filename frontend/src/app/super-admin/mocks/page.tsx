"use client";

import DashboardLayout from '@/components/DashboardLayout';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { 
    Target, Plus, Search, Edit2, Trash2, 
    User, Calendar, Clock, Star, 
    CheckCircle, MessageSquare, Briefcase
} from 'lucide-react';

export default function MockInterviewManagement() {
    const [interviews, setInterviews] = useState<any[]>([]);

    useEffect(() => {
        setInterviews([
            { id: 1, student: 'Anjali Sharma', interviewer: 'Siddharth M.', role: 'Frontend Developer', status: 'SCHEDULED', time: 'Tomorrow, 10:30 AM' },
            { id: 2, student: 'Karthik R.', interviewer: 'Anjali Sharma', role: 'Java Backend Dev', status: 'COMPLETED', time: 'Today, 2:00 PM', score: '4.8/5' },
            { id: 3, student: 'Deepak Kumar', interviewer: 'Sai Kiran', role: 'DevOps Cloud Eng', status: 'READY', time: 'Today, 4:00 PM' },
        ]);
    }, []);

    return (
        <DashboardLayout role="super_admin">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                    <div>
                        <h1 style={{ fontSize: '2.5rem', fontWeight: 900, letterSpacing: '-1px' }}>Global Mock Assessment Bench</h1>
                        <p style={{ color: 'var(--text-dim)', fontSize: '1.1rem' }}>Architect interview readiness and assign production interviewers.</p>
                    </div>
                    <button className="btn-quantum" style={{ padding: '14px 28px' }}>
                        <Plus size={18} style={{ marginRight: '8px' }} /> TRIGGER INTERVIEW NODE
                    </button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '2.5rem', marginBottom: '4rem' }}>
                    {interviews.map((i, idx) => (
                        <InterviewCard key={i.id} {...i} />
                    ))}
                </div>

                {/* --- FEEDBACK REVIEWS --- */}
                <div className="glass-panel" style={{ padding: '3rem', borderRadius: '40px' }}>
                    <h3 style={{ fontSize: '1.6rem', fontWeight: 900, marginBottom: '2.5rem' }}>Production Feedback Intel</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        <FeedbackRow name="Karthik R." role="Java Backend" interviewer="Vamsi Krishna" score="4.8" feedback="Excellent understanding of Microservices and JPA. Needs adjustment on Kubernetes scaling concepts." />
                        <FeedbackRow name="Sai Kiran" role="Full Stack" interviewer="Siddharth" score="4.2" feedback="Strong React patterns and state management. Suggest more work on SQL optimization." />
                    </div>
                </div>
            </motion.div>
        </DashboardLayout>
    );
}

function InterviewCard({ student, interviewer, role, status, time, score }: any) {
    const statusMap: any = {
        'SCHEDULED': { color: '#3b82f6', label: 'HUB_RESERVED' },
        'COMPLETED': { color: '#10b981', label: 'NODE_RESOLVED' },
        'READY': { color: '#f59e0b', label: 'PRE_CHECK' }
    };
    return (
        <div className="glass-panel" style={{ padding: '2rem', borderRadius: '32px', borderLeft: `6px solid ${statusMap[status].color}`, background: 'linear-gradient(135deg, rgba(255,255,255,0.02) 0%, transparent 100%)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                <span style={{ fontSize: '0.65rem', fontWeight: 900, color: statusMap[status]?.color, letterSpacing: '2px', background: `${statusMap[status]?.color}15`, padding: '4px 10px', borderRadius: '100px' }}>{statusMap[status]?.label}</span>
                <div style={{ padding: '8px', borderRadius: '10px', background: 'rgba(59, 130, 246, 0.1)', color: 'var(--primary)' }}>
                    <Target size={20} />
                </div>
            </div>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 900 }}>{student}</h3>
            <div style={{ fontSize: '0.9rem', color: 'var(--text-dim)', marginTop: '5px' }}>Target: <span style={{ color: 'var(--text-bright)', fontWeight: 800 }}>{role}</span></div>
            
            <div style={{ margin: '1.5rem 0', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <div>
                    <div style={{ fontSize: '0.6rem', fontWeight: 800, color: 'var(--text-dim)', textTransform: 'uppercase' }}>Interviewer</div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 900 }}>{interviewer}</div>
                </div>
                <div>
                    <div style={{ fontSize: '0.6rem', fontWeight: 800, color: 'var(--text-dim)', textTransform: 'uppercase' }}>Chronos Sync</div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 900 }}>{time}</div>
                </div>
            </div>

            <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                {score ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#10b981', fontWeight: 900 }}>
                        <Star size={14} fill="#10b981" /> {score}
                    </div>
                ) : (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-dim)', fontSize: '0.8rem', fontWeight: 700 }}>
                        <Clock size={14} /> PENDING
                    </div>
                )}
                <button style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 800, fontSize: '0.8rem', cursor: 'pointer' }}>VIEW BRIEF →</button>
            </div>
        </div>
    );
}

function FeedbackRow({ name, role, interviewer, score, feedback }: any) {
    return (
        <div style={{ display: 'grid', gridTemplateColumns: '250px 1fr', gap: '2rem', padding: '2rem', background: 'rgba(255,255,255,0.02)', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)' }}>
            <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, color: '#fff' }}>{name.charAt(0)}</div>
                    <div>
                        <div style={{ fontWeight: 900 }}>{name}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>{role}</div>
                    </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.85rem', color: 'var(--text-dim)' }}>
                    <User size={14} /> By: {interviewer}
                </div>
            </div>
            <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <div style={{ fontSize: '0.8rem', fontWeight: 900, color: '#10b981', background: 'rgba(16, 185, 129, 0.1)', padding: '5px 12px', borderRadius: '100px' }}>{score} / 5.0 SCORE</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontWeight: 700 }}>TIMESTAMP: 2026-03-20</div>
                </div>
                <p style={{ fontSize: '1rem', lineHeight: 1.6, color: 'var(--text-dim)' }}>{feedback}</p>
            </div>
        </div>
    );
}

function ActionButton({ icon, color, onClick }: any) {
    return (
        <button onClick={onClick} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', color: color || 'var(--text-bright)', padding: '10px', borderRadius: '12px', cursor: 'pointer' }}>{icon}</button>
    );
}
