"use client";

import DashboardLayout from '@/components/DashboardLayout';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { 
    BookOpen, Video, FileText, CheckCircle, 
    Briefcase, TrendingUp, Play, Clock, 
    Calendar, Award, Star, MessageSquare
} from 'lucide-react';

export default function StudentDashboard() {
    const [selectedTab, setSelectedTab] = useState('COURSES');

    const TABS = [
        { id: 'COURSES', label: 'My Learning Center', icon: <BookOpen size={18} /> },
        { id: 'ASSIGNMENTS', label: 'Submission Hub', icon: <FileText size={18} /> },
        { id: 'TESTS', label: 'Exam Node', icon: <CheckCircle size={18} /> },
        { id: 'CAREER', label: 'Career Launch', icon: <Briefcase size={18} /> },
    ];

    return (
        <DashboardLayout role="student">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                
                {/* --- STATS OVERVIEW --- */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
                    <ProgressStatCard icon={<TrendingUp color="#10b981" />} title="Overall Proficiency" value="84.2%" trend="+4.8% vs prev" color="#10b981" />
                    <ProgressStatCard icon={<Award color="#8b5cf6" />} title="Skill Points Gained" value="12,450" sub="Top 5% Learner" color="#8b5cf6" />
                    <ProgressStatCard icon={<Clock color="#3b82f6" />} title="Learning Runtime" value="128 hrs" trend="24h this week" color="#3b82f6" />
                    <ProgressStatCard icon={<Star color="#f59e0b" />} title="Project Badges" value="18" sub="Mastery Achievement" color="#f59e0b" />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '3rem' }}>
                    {/* --- SIDE TABS --- */}
                    <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: '32px', height: 'fit-content' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            {TABS.map(t => (
                                <button 
                                    key={t.id}
                                    onClick={() => setSelectedTab(t.id)}
                                    style={{ 
                                        display: 'flex', 
                                        alignItems: 'center', 
                                        gap: '12px', 
                                        padding: '12px 18px', 
                                        borderRadius: '16px', 
                                        background: selectedTab === t.id ? 'var(--primary)' : 'rgba(255,255,255,0.02)', 
                                        color: selectedTab === t.id ? '#fff' : 'var(--text-dim)', 
                                        border: '1px solid rgba(255,255,255,0.05)', 
                                        fontWeight: 800, 
                                        cursor: 'pointer',
                                        transition: 'all 0.3s'
                                    }}
                                >
                                    {t.icon} {t.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* --- TAB CONTENT --- */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        {selectedTab === 'COURSES' && (
                            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                                <CourseCard title="Mastering Spring Boot Microservices" progress={85} instructor="Vamsi Krishna" next="Module 12: K8s Ingress Control" />
                                <CourseCard title="React & Next.js Performance Optimization" progress={42} instructor="Sai Kiran" next="Chapter 4: Server Components" />
                            </motion.div>
                        )}

                        {selectedTab === 'ASSIGNMENTS' && (
                            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="glass-panel" style={{ padding: '2.5rem', borderRadius: '32px' }}>
                                <h3 style={{ fontSize: '1.4rem', fontWeight: 900, marginBottom: '2.5rem' }}>Active Evaluation Protocols</h3>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                    <TaskRow title="Authentication Cluster Implementation" deadline="MAR 25, 2026" status="SUBMITTED" color="#10b981" />
                                    <TaskRow title="Design System (Framer Motion)" deadline="MAR 22, 2026" status="PENDING" color="#f59e0b" />
                                    <TaskRow title="Microservices Inter-com API" deadline="MAR 20, 2026" status="OVERDUE" color="#ef4444" />
                                </div>
                            </motion.div>
                        )}

                        {selectedTab === 'TESTS' && (
                            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                                <TestNode title="Algorithm Prototyping" type="CODING" duration="2h" status="READY" />
                                <TestNode title="React State Management" type="MCQ" duration="1h" status="LOCKED" />
                            </motion.div>
                        )}

                        {selectedTab === 'CAREER' && (
                            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                                <CareerOpportunity company="Google" role="Cloud Architect Intern" location="Remote" match="95% Sync" />
                                <CareerOpportunity company="TechCorp" role="Frontend Performance Eng" location="Hybrid" match="88% Sync" />
                            </motion.div>
                        )}
                    </div>
                </div>
            </motion.div>
        </DashboardLayout>
    );
}

function ProgressStatCard({ icon, title, value, trend, sub, color }: any) {
    return (
        <div className="glass-panel" style={{ padding: '1.75rem', borderRadius: '24px', borderLeft: `6px solid ${color}` }}>
             <div style={{ color, marginBottom: '0.75rem' }}>{icon}</div>
             <div style={{ fontSize: '0.7rem', fontWeight: 900, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '2px' }}>{title}</div>
             <div style={{ fontSize: '2.2rem', fontWeight: 900, margin: '5px 0' }}>{value}</div>
             <div style={{ fontSize: '0.75rem', fontWeight: 800, color: trend ? '#10b981' : 'var(--text-dim)' }}>{trend || sub}</div>
        </div>
    );
}

function CourseCard({ title, progress, instructor, next }: any) {
    return (
        <div className="glass-panel" style={{ padding: '2.5rem', borderRadius: '32px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2.5rem' }}>
                <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: '1.6rem', fontWeight: 900, marginBottom: '0.5rem' }}>{title}</h3>
                    <div style={{ fontSize: '0.9rem', color: 'var(--text-dim)', fontWeight: 800 }}>Lead Instructor: {instructor}</div>
                </div>
                <button className="btn-quantum" style={{ padding: '12px 24px', borderRadius: '14px' }}><Play size={18} style={{ marginRight: '8px' }} /> RESUME SYNC</button>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '0.8rem', fontWeight: 900 }}>
                <span style={{ color: 'var(--text-dim)' }}>SYNC PROGRESS</span>
                <span>{progress}%</span>
            </div>
            <div style={{ height: '8px', background: 'rgba(255,255,255,0.03)', borderRadius: '100px', overflow: 'hidden', marginBottom: '1.5rem' }}>
                <div style={{ height: '100%', width: `${progress}%`, background: 'var(--primary)', boxShadow: '0 0 10px var(--primary)', borderRadius: '100px' }} />
            </div>

            <div style={{ padding: '1.25rem', background: 'rgba(255,255,255,0.02)', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '15px' }}>
                <Calendar size={18} color="var(--primary)" />
                <div style={{ fontSize: '0.9rem', fontWeight: 800 }}>NEXT NODE: <span style={{ color: 'var(--text-dim)' }}>{next}</span></div>
            </div>
        </div>
    );
}

function TaskRow({ title, deadline, status, color }: any) {
    return (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem', background: 'rgba(255,255,255,0.015)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.03)' }}>
            <div>
                <div style={{ fontWeight: 800, fontSize: '1.1rem' }}>{title}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontWeight: 800 }}>DEADLINE: {deadline}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.7rem', fontWeight: 900, color, letterSpacing: '1px', background: `${color}15`, padding: '5px 14px', borderRadius: '100px' }}>{status}</div>
            </div>
        </div>
    );
}

function TestNode({ title, type, duration, status }: any) {
    return (
        <div className="glass-panel" style={{ padding: '2rem', borderRadius: '24px', borderLeft: status === 'READY' ? '6px solid #10b981' : '6px solid rgba(255,255,255,0.05)' }}>
            <div style={{ fontSize: '0.65rem', fontWeight: 900, color: 'var(--text-dim)', textTransform: 'uppercase', marginBottom: '10px' }}>Assessment Cluster</div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 900, marginBottom: '1.5rem' }}>{title}</h3>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-dim)' }}>{type} • {duration}</div>
                <button disabled={status === 'LOCKED'} style={{ padding: '8px 16px', borderRadius: '8px', background: status === 'READY' ? 'var(--primary)' : 'rgba(255,255,255,0.03)', color: '#fff', border: 'none', fontWeight: 900, cursor: status === 'READY' ? 'pointer' : 'default' }}>{status === 'READY' ? 'INITIATE' : 'LOCKED'}</button>
            </div>
        </div>
    );
}

function CareerOpportunity({ company, role, location, match }: any) {
    return (
        <div className="glass-panel" style={{ padding: '2rem', borderRadius: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
                <div style={{ fontSize: '0.7rem', fontWeight: 900, color: '#10b981', letterSpacing: '1px', marginBottom: '8px' }}>TARGET CLUSTER: {match}</div>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 900 }}>{company} • {role}</h3>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-dim)', fontWeight: 800, marginTop: '5px' }}>{location} Access Node</div>
            </div>
            <button style={{ padding: '12px 24px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', color: '#fff', fontWeight: 900, cursor: 'pointer' }}>APPLY NOW</button>
        </div>
    );
}
