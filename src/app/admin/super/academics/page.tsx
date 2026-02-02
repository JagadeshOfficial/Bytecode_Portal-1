"use client";

import { useState } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { motion, AnimatePresence } from 'framer-motion';
import {
    BookOpen, Users, Calendar, Clock,
    MoreVertical, Plus, Search, Filter,
    CheckCircle, AlertCircle, BarChart3,
    Layers, Code, Database, Globe, Cpu,
    ChevronRight, PlayCircle, Book,
    MessageSquare, AlertTriangle, Monitor, Star
} from 'lucide-react';
import styles from '../SuperAdmin.module.css';
import StatsCard from '@/components/dashboard/StatsCard';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

// -- Advanced Mock Data --

const ACADEMIC_STATS = [
    { title: 'Total Active Students', value: '2,450', icon: Users, color: '#8b5cf6', trend: '+12% vs last month', chartData: [40, 55, 45, 60, 75, 65, 85] },
    { title: 'Course Completion Rate', value: '94.2%', icon: CheckCircle, color: '#10b981', trend: '+2.5% efficiency', chartData: [88, 90, 89, 92, 93, 94, 94] },
    { title: 'Running Batches', value: '42', icon: Layers, color: '#3b82f6', trend: '8 starting next week', chartData: [30, 32, 35, 38, 40, 41, 42] },
    { title: 'Content Repository', value: '1.2TB', icon: Database, color: '#ec4899', trend: '+50GB new assets', chartData: [100, 105, 110, 112, 115, 118, 120] },
];

const RUNNING_BATCHES_ADV = [
    {
        id: 'B204', course: 'Java Full Stack', phase: 'Spring Boot Microservices',
        trainer: 'Sarah Jenkins', attendance: 92, progress: 65, status: 'In Session',
        nextItem: 'Live Coding: API Gateway', time: '09:00 - 11:00 AM',
        stack: ['Java', 'Spring', 'React']
    },
    {
        id: 'B205', course: 'Data Science & AI', phase: 'Neural Networks Deep Dive',
        trainer: 'Dr. Rao', attendance: 88, progress: 42, status: 'Lab Session',
        nextItem: 'Project: Image Classification', time: '11:00 - 01:00 PM',
        stack: ['Python', 'TensorFlow', 'Pandas']
    },
    {
        id: 'B206', course: 'DevOps Engineering', phase: 'Kubernetes Orchestration',
        trainer: 'Karthik M.', attendance: 95, progress: 78, status: 'Break',
        nextItem: 'Helm Charts Demo', time: '10:00 - 12:00 PM',
        stack: ['Docker', 'K8s', 'AWS']
    },
];

const CURRICULUM_CATALOG = [
    { id: 1, title: 'Full Stack Development', modules: 24, projects: 8, duration: '6 Months', icon: Globe, color: '#a78bfa', bg: 'rgba(139, 92, 246, 0.1)' },
    { id: 2, title: 'AI & Machine Learning', modules: 18, projects: 12, duration: '8 Months', icon: Cpu, color: '#10b981', bg: 'rgba(16, 185, 129, 0.1)' },
    { id: 3, title: 'Cloud Computing', modules: 15, projects: 5, duration: '4 Months', icon: Database, color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.1)' },
    { id: 4, title: 'Cyber Security Ops', modules: 20, projects: 10, duration: '5 Months', icon: Shield, color: '#f87171', bg: 'rgba(248, 113, 113, 0.1)' },
];

const RECENT_FEEDBACK = [
    { id: 1, trainer: 'Sarah Jenkins', rating: 4.8, type: 'Kudos', msg: "Great explanation of Hooks!" },
    { id: 2, trainer: 'Karthik M.', rating: 3.5, type: 'Critical', msg: "Pace was too fast today." },
];

import { Shield } from 'lucide-react';

// -- Components --

const MiniChart = ({ data, color }: { data: number[], color: string }) => (
    <div className={styles.miniChartContainer}>
        <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data.map((val, i) => ({ i, val }))}>
                <defs>
                    <linearGradient id={`grad-${color}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={color} stopOpacity={0.4} />
                        <stop offset="100%" stopColor={color} stopOpacity={0} />
                    </linearGradient>
                </defs>
                <Area type="monotone" dataKey="val" stroke={color} strokeWidth={2} fill={`url(#grad-${color})`} />
            </AreaChart>
        </ResponsiveContainer>
    </div>
);

export default function AcademicsPage() {
    const [isScheduleOpen, setIsScheduleOpen] = useState(false);
    const [isCreateOpen, setIsCreateOpen] = useState(false);

    return (
        <DashboardLayout role="super_admin">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={styles.container}
            >
                {/* 1. Dynamic Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '1.5rem' }}>
                    <div>
                        <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#a78bfa', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                            Academic Control Center
                        </div>
                        <h1 className={styles.textH1}>Academics & Curriculum</h1>
                    </div>
                    <div className={styles.actionBtnRow}>
                        <button
                            className={styles.btnSecondary}
                            onClick={() => setIsScheduleOpen(true)}
                        >
                            <Calendar size={18} /> Master Schedule
                        </button>
                        <button
                            className={styles.btnPrimary}
                            onClick={() => setIsCreateOpen(true)}
                        >
                            <Plus size={18} /> Create New
                        </button>
                    </div>
                </div>

                {/* -- Modals -- */}
                {/* -- Modals -- */}
                <AnimatePresence>
                    {isScheduleOpen && (
                        <div className={styles.modalOverlay}>
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className={`${styles.modalContent} ${styles.modalContentLarge}`}
                            >
                                <div className={styles.modalHeader}>
                                    <h2 className={styles.modalTitle}>Institute Master Schedule</h2>
                                    <button onClick={() => setIsScheduleOpen(false)} className={styles.closeBtn}>✕</button>
                                </div>
                                <div className={styles.modalBody}>
                                    <div className={styles.scheduleGrid}>
                                        <div className={styles.scheduleHeader} style={{ background: 'transparent' }}>Time</div>
                                        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map(d => (
                                            <div key={d} className={styles.scheduleHeader}>{d}</div>
                                        ))}

                                        {['09:00 AM', '11:00 AM', '02:00 PM', '04:00 PM'].map((time, i) => (
                                            <>
                                                <div className={styles.scheduleTime}>{time}</div>
                                                {[1, 2, 3, 4, 5].map(col => (
                                                    <div key={col} className={styles.scheduleCell}>
                                                        {(i === 0 && col % 2 !== 0) && (
                                                            <div className={`${styles.scheduleEvent} ${styles.eventViolet}`}>
                                                                <div className={styles.eventTitle}>Java Batch</div>
                                                                <div className={styles.eventSub}>Lab A</div>
                                                            </div>
                                                        )}
                                                        {(i === 1 && col === 3) && (
                                                            <div className={`${styles.scheduleEvent} ${styles.eventViolet}`} style={{ borderColor: 'rgba(16,185,129,0.3)', background: 'rgba(16,185,129,0.15)' }}>
                                                                <div className={styles.eventTitle} style={{ color: '#34d399' }}>Python AI</div>
                                                                <div className={styles.eventSub} style={{ color: '#6ee7b7' }}>Room 302</div>
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                            </>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    )}

                    {isCreateOpen && (
                        <div className={styles.modalOverlay}>
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className={`${styles.modalContent} ${styles.modalContentMedium}`}
                            >
                                <div className={styles.modalHeader}>
                                    <h2 className={styles.modalTitle}>Create New Academic Entry</h2>
                                    <button onClick={() => setIsCreateOpen(false)} className={styles.closeBtn}>✕</button>
                                </div>
                                <div className={styles.modalBody}>
                                    <div className={styles.formGroup}>
                                        <label className={styles.formLabel}>Entry Type</label>
                                        <select className={styles.formSelect}>
                                            <option>New Batch</option>
                                            <option>New Course</option>
                                            <option>Schedule Event</option>
                                            <option>Curriculum Module</option>
                                        </select>
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label className={styles.formLabel}>Title / Name</label>
                                        <input type="text" className={styles.formInput} placeholder="e.g. Java Weekend Batch 24" />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label className={styles.formLabel}>Start Date</label>
                                        <input type="date" className={styles.formInput} />
                                    </div>
                                    <div className={styles.formActions}>
                                        <button onClick={() => setIsCreateOpen(false)} className={styles.btnSecondary} style={{ justifyContent: 'center', flex: 1 }}>Cancel</button>
                                        <button className={styles.btnPrimary} style={{ justifyContent: 'center', flex: 1 }}>Create</button>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>

                {/* 2. Advanced Stats Row */}
                <div className={styles.advStatsGrid}>
                    {ACADEMIC_STATS.map((stat, idx) => (
                        <div key={idx} className={styles.advCard}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                                <div className={styles.advCardIconBox} style={{
                                    background: stat.title.includes('Total') ? 'rgba(139,92,246,0.1)' : stat.title.includes('Completion') ? 'rgba(16,185,129,0.1)' : stat.title.includes('Batches') ? 'rgba(59,130,246,0.1)' : 'rgba(236,72,153,0.1)',
                                    color: stat.color
                                }}>
                                    <stat.icon size={22} />
                                </div>
                                <span className={styles.statusBadge} style={{ background: 'rgba(16,185,129,0.1)', color: '#10b981' }}>{stat.trend}</span>
                            </div>
                            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'white', marginBottom: '0.25rem', fontFamily: 'Rajdhani' }}>{stat.value}</div>
                            <div className={styles.textLabel}>{stat.title}</div>
                            <MiniChart data={stat.chartData} color={stat.color} />
                        </div>
                    ))}
                </div>

                {/* 3. Live Operations Center */}
                <div className={styles.academicsGrid}>

                    {/* Running Batches - Live Status */}
                    <div className={styles.card} style={{ gridColumn: 'span 1' }}> {/* Force span 1 in mobile, grid handles desktop */}
                        <div className={styles.cardHeader}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <PlayCircle size={20} style={{ color: '#34d399' }} />
                                Live Classroom Status
                            </div>
                            <div style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }}></span> Live Streaming
                            </div>
                        </div>

                        <div className={styles.liveBatchList}>
                            {/* Academic Risk Alert */}
                            <div className={styles.alertBox}>
                                <div className={styles.alertIcon}><AlertTriangle size={20} /></div>
                                <div>
                                    <div style={{ color: 'white', fontWeight: 600, fontSize: '0.9rem' }}>Schedule Risk Alert</div>
                                    <div style={{ color: '#f87171', fontSize: '0.8rem' }}>Batch B201 is 2 sessions behind schedule.</div>
                                </div>
                            </div>

                            {RUNNING_BATCHES_ADV.map((batch) => (
                                <div key={batch.id} className={styles.batchItem}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                                        <div style={{ display: 'flex', gap: '1rem' }}>
                                            <div style={{
                                                width: '48px', height: '48px', borderRadius: '8px', background: 'rgba(15, 23, 42, 0.8)',
                                                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(51, 65, 85, 0.5)'
                                            }}>
                                                <span style={{ fontSize: '10px', color: '#94a3b8', fontWeight: 700 }}>BATCH</span>
                                                <span style={{ fontSize: '14px', fontWeight: 700, color: 'white' }}>{batch.id}</span>
                                            </div>
                                            <div>
                                                <div style={{ color: 'white', fontWeight: 700, fontSize: '1rem' }}>{batch.course}</div>
                                                <div style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.25rem' }}>
                                                    <Users size={12} /> {batch.trainer}
                                                    <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#475569' }}></span>
                                                    <Clock size={12} /> {batch.time}
                                                </div>
                                            </div>
                                        </div>
                                        <div className={styles.statusBadge} style={{
                                            background: batch.status === 'In Session' ? 'rgba(16, 185, 129, 0.1)' : batch.status === 'Lab Session' ? 'rgba(139, 92, 246, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                                            color: batch.status === 'In Session' ? '#10b981' : batch.status === 'Lab Session' ? '#8b5cf6' : '#f59e0b',
                                            border: `1px solid ${batch.status === 'In Session' ? 'rgba(16, 185, 129, 0.2)' : batch.status === 'Lab Session' ? 'rgba(139, 92, 246, 0.2)' : 'rgba(245, 158, 11, 0.2)'}`
                                        }}>
                                            {batch.status}
                                        </div>
                                    </div>

                                    {/* Progress & Phase */}
                                    <div style={{ marginBottom: '0.75rem' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.25rem' }}>
                                            <span style={{ color: '#cbd5e1', fontWeight: 500 }}>Current Module: <span style={{ color: 'white' }}>{batch.phase}</span></span>
                                            <span style={{ color: '#94a3b8' }}>{batch.progress}% Complete</span>
                                        </div>
                                        <div className={styles.progressTrack}>
                                            <div className={styles.progressBar} style={{ width: `${batch.progress}%` }}></div>
                                        </div>
                                    </div>

                                    {/* Tech Stack Pills */}
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        {batch.stack.map((tech) => (
                                            <span key={tech} style={{
                                                fontSize: '10px', padding: '2px 8px', borderRadius: '4px',
                                                border: '1px solid rgba(71, 85, 105, 0.5)', color: '#94a3b8', background: 'rgba(30, 41, 59, 0.5)'
                                            }}>
                                                {tech}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Quick Access / Curriculum Snapshot */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        {/* Syllabus Catalog Widget */}
                        <div className={styles.card} style={{ flex: 1 }}>
                            <div className={styles.cardHeader} style={{ marginBottom: '1rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <BookOpen size={20} style={{ color: '#60a5fa' }} />
                                    Curriculum Hub
                                </div>
                            </div>
                            <div className={styles.hubList}>
                                {CURRICULUM_CATALOG.map((item) => (
                                    <div key={item.id} className={styles.hubItem}>
                                        <div style={{ padding: '0.5rem', borderRadius: '0.5rem', background: item.bg, color: item.color }}>
                                            <item.icon size={18} />
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'white' }}>{item.title}</div>
                                            <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{item.modules} Modules • {item.projects} Projects</div>
                                        </div>
                                        <ChevronRight size={16} style={{ color: '#475569' }} />
                                    </div>
                                ))}
                            </div>
                            <button className={styles.btnSecondary} style={{ width: '100%', marginTop: '1rem', justifyContent: 'center' }}>
                                View Full Syllabus Catalog
                            </button>
                        </div>

                        {/* Lab Availability Widget */}
                        <div className={styles.card}>
                            <div className={styles.cardHeader} style={{ marginBottom: '1rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <Monitor size={20} style={{ color: '#f472b6' }} />
                                    Lab Availability
                                </div>
                            </div>
                            <div className={styles.labGrid}>
                                <div className={`${styles.labItem} ${styles.labOccupied}`}>
                                    <div className={styles.labName}>Lab A (Main)</div>
                                    <div className={`${styles.labStatus} ${styles.textOccupied}`}>Occupied</div>
                                </div>
                                <div className={`${styles.labItem} ${styles.labFree}`}>
                                    <div className={styles.labName}>Lab B (AI)</div>
                                    <div className={`${styles.labStatus} ${styles.textFree}`}>Available</div>
                                </div>
                                <div className={`${styles.labItem} ${styles.labFree}`}>
                                    <div className={styles.labName}>Lab C (Exam)</div>
                                    <div className={`${styles.labStatus} ${styles.textFree}`}>Available</div>
                                </div>
                                <div className={`${styles.labItem} ${styles.labOccupied}`}>
                                    <div className={styles.labName}>Lab D (Cloud)</div>
                                    <div className={`${styles.labStatus} ${styles.textOccupied}`}>Maintenance</div>
                                </div>
                            </div>
                        </div>

                        {/* Feedback Widget */}
                        <div className={styles.card}>
                            <div className={styles.cardHeader} style={{ marginBottom: '1rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <MessageSquare size={20} style={{ color: '#facc15' }} />
                                    Session Quality
                                </div>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                {RECENT_FEEDBACK.map(f => (
                                    <div key={f.id} className={styles.feedbackItem}>
                                        <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, color: 'white' }}>
                                            {f.trainer.charAt(0)}
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'white' }}>{f.trainer}</span>
                                                <div className={styles.starRating}>
                                                    <Star size={12} fill="#facc15" />
                                                    <span style={{ color: 'white' }}>{f.rating}</span>
                                                </div>
                                            </div>
                                            <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.25rem' }}>"{f.msg}"</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>
                </div>

            </motion.div>
        </DashboardLayout>
    );
}
