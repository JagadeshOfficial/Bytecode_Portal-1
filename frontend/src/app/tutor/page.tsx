"use client";

import DashboardLayout from '@/components/DashboardLayout';
import { motion } from 'framer-motion';
import { 
    Video, FileText, Users, Activity, 
    Calendar, Play, Trash2, Edit2, 
    CheckCircle, MessageSquare, Plus, Clock
} from 'lucide-react';

export default function TutorDashboard() {
    return (
        <DashboardLayout role="tutor">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
                    <StatCard icon={<Video color="#ef4444" />} title="Broadcasting Stats" value="12" trend="Sessions this month" color="#ef4444" />
                    <StatCard icon={<FileText color="#3b82f6" />} title="Assignments Pending" value="24" trend="12 Verified" color="#3b82f6" />
                    <StatCard icon={<Users color="#8b5cf6" />} title="Total Enrolled" value="482" trend="Active Students" color="#8b5cf6" />
                    <StatCard icon={<Activity color="#10b981" />} title="Attendance Avg" value="92%" trend="95% Optimal" color="#10b981" />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: '2rem' }}>
                    {/* --- LIVE CLASS HUB --- */}
                    <div className="glass-panel" style={{ padding: '2.5rem', borderRadius: '32px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                            <h3 style={{ fontSize: '1.3rem', fontWeight: 900 }}>Daily Live Schedule</h3>
                            <button className="btn-quantum" style={{ padding: '10px 20px', fontSize: '0.8rem' }}><Plus size={16} style={{ marginRight: '8px' }} /> NEW SESSION NODE</button>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            <ClassRow title="Advanced Microservices JPA" batch="J1_APRIL" time="10:30 AM" status="LIVE" />
                            <ClassRow title="Spring Security & OAuth2" batch="R2_MAY" time="02:00 PM" status="SCHEDULED" />
                            <ClassRow title="Full Stack Web Deployment" batch="D1_JUNE" time="04:30 PM" status="READY" />
                        </div>
                    </div>

                    {/* --- PENDING TASKS --- */}
                    <div className="glass-panel" style={{ padding: '2.5rem', borderRadius: '32px' }}>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: 900, marginBottom: '2rem' }}>Grading Queue</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                            <GradingRow name="Karthik R." task="Microservices Final" score="PENDING" status="WAIT_EVAL" />
                            <GradingRow name="Anjali Sharma" task="Auth Cluster" score="4.8/5" status="VERIFIED" />
                            <GradingRow name="Deepak Kumar" task="AWS EC2 Config" score="PENDING" status="HUB_QUEUE" />
                        </div>
                        <button style={{ width: '100%', marginTop: '2rem', padding: '12px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', color: '#fff', fontSize: '0.8rem', fontWeight: 800 }}>LAUNCH GRADING SUITE →</button>
                    </div>
                </div>
            </motion.div>
        </DashboardLayout>
    );
}

function StatCard({ icon, title, value, trend, color }: any) {
    return (
        <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: '24px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', bottom: -10, right: -10, color: `${color}05`, width: '80px', height: '80px' }}>{icon}</div>
            <div style={{ color, marginBottom: '0.5rem' }}>{icon}</div>
            <div style={{ fontSize: '0.6rem', fontWeight: 900, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '2px' }}>{title}</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 900, margin: '5px 0' }}>{value}</div>
            <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-dim)' }}>{trend}</div>
        </div>
    );
}

function ClassRow({ title, batch, time, status }: any) {
    const statusMap: any = {
        'LIVE': { color: '#ef4444', label: 'B_CASTING' },
        'SCHEDULED': { color: '#3b82f6', label: 'HUB_LOAD' },
        'READY': { color: '#10b981', label: 'SYNC_READY' }
    };
    return (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem', background: 'rgba(255,255,255,0.015)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.03)' }}>
            <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                <div style={{ width: '40px', height: '40px', background: 'rgba(255,255,255,0.03)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900 }}>{title.charAt(0)}</div>
                <div>
                    <div style={{ fontWeight: 800, fontSize: '0.95rem' }}>{title}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Batch: {batch} • {time}</div>
                </div>
            </div>
            <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.65rem', fontWeight: 900, color: statusMap[status]?.color, letterSpacing: '1px', marginBottom: '4px' }}>{statusMap[status]?.label}</div>
                <button style={{ padding: '6px 12px', background: 'var(--primary)', border: 'none', color: '#fff', borderRadius: '6px', fontSize: '0.65rem', fontWeight: 900, cursor: 'pointer' }}>INITIATE →</button>
            </div>
        </div>
    );
}

function GradingRow({ name, task, score, status }: any) {
    return (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '12px', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
            <div>
                <div style={{ fontWeight: 800, fontSize: '0.9rem' }}>{name}</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', fontWeight: 700 }}>{task}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
                <div style={{ fontWeight: 900, color: score === 'PENDING' ? '#f59e0b' : '#10b981', fontSize: '0.8rem' }}>{score}</div>
                <div style={{ fontSize: '0.6rem', fontWeight: 900, color: 'var(--text-dim)', textTransform: 'uppercase' }}>{status}</div>
            </div>
        </div>
    );
}
