"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { 
    Users, BookOpen, Clock, Activity,
    Calendar, TrendingUp, Award, CheckCircle,
    Layout, Layers, MoreHorizontal
} from 'lucide-react';

const StatCard = ({ label, value, sub, icon, color }: any) => (
    <div className="glass-panel" style={{ padding: '2.5rem', borderRadius: '40px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ width: 60, height: 60, borderRadius: '20px', background: `${color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: color }}>
                {icon}
            </div>
            <span style={{ fontSize: '0.75rem', fontWeight: 900, color: '#10b981', background: '#d1fae5', padding: '6px 14px', borderRadius: '12px' }}>+12%</span>
        </div>
        <div>
            <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#1a202c' }}>{value}</div>
            <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#718096', textTransform: 'uppercase', letterSpacing: '1px' }}>{label}</div>
        </div>
        <p style={{ fontSize: '0.75rem', color: '#a0aec0', fontWeight: 700 }}>{sub}</p>
    </div>
);

export default function AcademicAnalytics() {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
            {/* --- HERO STATS --- */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '2rem' }}>
                <StatCard label="Total Students" value="8,240" sub="Across 42 active batches" icon={<Users size={28} />} color="#6366f1" />
                <StatCard label="Active Courses" value="18" sub="Mainstream & Specializations" icon={<BookOpen size={28} />} color="#8b5cf6" />
                <StatCard label="Sessions Today" value="24" sub="12 completed, 8 live" icon={<Activity size={28} />} color="#10b981" />
                <StatCard label="Success Ratio" value="92%" sub="Placement and Certification" icon={<Award size={28} />} color="#f59e0b" />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1fr', gap: '2.5rem' }}>
                {/* --- TRENDS CHART --- */}
                <div className="glass-panel" style={{ padding: '3rem', borderRadius: '45px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                        <div>
                            <h3 style={{ fontSize: '1.5rem', fontWeight: 900 }}>Enrolment & Engagement</h3>
                            <p style={{ color: '#718096', fontSize: '0.9rem' }}>Monthly growth and student activity levels.</p>
                        </div>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', fontWeight: 800 }}>
                                <div style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--primary)' }}></div> Enrolments
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', fontWeight: 800 }}>
                                <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#10b981' }}></div> Engagement
                            </div>
                        </div>
                    </div>

                    <div style={{ height: '300px', width: '100%', display: 'flex', alignItems: 'flex-end', gap: '20px', paddingBottom: '30px', borderBottom: '1px solid #f1f5f9', position: 'relative' }}>
                        {/* Grid Lines */}
                        {[0, 25, 50, 75, 100].map(v => (
                            <div key={v} style={{ position: 'absolute', bottom: `${v}%`, left: 0, right: 0, borderTop: '1px dashed #f1f5f9', zIndex: 0 }}>
                                <span style={{ position: 'absolute', left: '-40px', top: '-8px', fontSize: '0.7rem', fontWeight: 900, color: '#cbd5e1' }}>{v}%</span>
                            </div>
                        ))}

                        {/* Bars */}
                        {[65, 80, 45, 90, 70, 85, 95, 60, 50, 75, 88, 92].map((h, i) => (
                            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px', height: '100%', justifyContent: 'flex-end', zIndex: 1, position: 'relative' }}>
                                <motion.div 
                                    initial={{ height: 0 }} 
                                    animate={{ height: `${h}%` }} 
                                    transition={{ delay: i * 0.05, duration: 1 }}
                                    style={{ width: '100%', background: `linear-gradient(to top, var(--primary), #8b5cf6)`, borderRadius: '8px 8px 2px 2px', opacity: 0.8 }} 
                                />
                                <div style={{ position: 'absolute', bottom: '-25px', width: '100%', textAlign: 'center', fontSize: '0.65rem', fontWeight: 900, color: '#a0aec0' }}>
                                    {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i]}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* --- BATCH PERFORMANCE --- */}
                <div className="glass-panel" style={{ padding: '3rem', borderRadius: '45px' }}>
                    <h3 style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: '2.5rem' }}>Top Batches</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        {[
                            { name: 'Java Full Stack J23', students: 120, performance: 94, color: '#6366f1' },
                            { name: 'Python Backend P12', students: 85, performance: 88, color: '#10b981' },
                            { name: 'React Development R05', students: 240, performance: 82, color: '#f59e0b' },
                            { name: 'UI/UX Design UI09', students: 95, performance: 78, color: '#ef4444' },
                            { name: 'Cloud Architects C21', students: 60, performance: 91, color: '#8b5cf6' }
                        ].map((batch, i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '20px', padding: '15px', background: '#f8fafc', borderRadius: '24px', border: '1px solid #f1f5f9' }}>
                                <div style={{ width: 45, height: 45, borderRadius: '15px', background: `${batch.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: batch.color, fontWeight: 900, fontSize: '0.9rem' }}>
                                    {batch.name[0]}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontWeight: 900, color: '#1a202c', fontSize: '0.9rem' }}>{batch.name}</div>
                                    <div style={{ fontSize: '0.75rem', color: '#718096', fontWeight: 700 }}>{batch.students} Active Students</div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ fontWeight: 900, color: batch.performance > 90 ? '#10b981' : '#1a202c' }}>{batch.performance}%</div>
                                    <div style={{ fontSize: '0.65rem', fontWeight: 800, color: '#a0aec0' }}>AVG SCORE</div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button style={{ width: '100%', marginTop: '2.5rem', padding: '15px', borderRadius: '18px', border: '1px solid #e2e8f0', background: '#fff', color: '#718096', fontWeight: 900, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                        VIEW FULL REPORT <TrendingUp size={18} />
                    </button>
                </div>
            </div>

            {/* --- RECENT ACTIVITY FEED --- */}
            <div className="glass-panel" style={{ padding: '3rem', borderRadius: '45px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                    <h3 style={{ fontSize: '1.5rem', fontWeight: 900 }}>System Activity Audit</h3>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button style={{ padding: '8px 16px', borderRadius: '10px', background: 'var(--primary)', color: '#fff', border: 'none', fontSize: '0.8rem', fontWeight: 800 }}>All Events</button>
                        <button style={{ padding: '8px 16px', borderRadius: '10px', background: '#f8fafc', border: '1px solid #e2e8f0', fontSize: '0.8rem', fontWeight: 800 }}>Critical Only</button>
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {[
                        { event: 'Course Material Updated', target: 'Java Full Stack', actor: 'Super Admin', time: '12 mins ago', icon: <BookOpen size={18} />, color: '#6366f1' },
                        { event: 'New Batch Deployed', target: 'Cloud Arch B22', actor: 'Faculty Manager', time: '45 mins ago', icon: <Layout size={18} />, color: '#10b981' },
                        { event: 'Submission Deadline Extended', target: 'React Quiz', actor: 'Assigned Tutor', time: '2 hours ago', icon: <Clock size={18} />, color: '#f59e0b' },
                        { event: 'Student Access Revoked', target: 'Rahul G (Suspended)', actor: 'System AI', time: '5 hours ago', icon: <CheckCircle size={18} />, color: '#ef4444' }
                    ].map((log, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 25px', borderBottom: i === 3 ? 'none' : '1px solid #f1f5f9' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                                <div style={{ width: 40, height: 40, borderRadius: '12px', background: `${log.color}10`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: log.color }}>
                                    {log.icon}
                                </div>
                                <div>
                                    <div style={{ fontWeight: 900, color: '#1a202c', fontSize: '0.95rem' }}>{log.event}</div>
                                    <div style={{ fontSize: '0.75rem', color: '#718096', fontWeight: 800 }}>Target: {log.target}  •  By: {log.actor}</div>
                                </div>
                            </div>
                            <div style={{ fontSize: '0.8rem', fontWeight: 900, color: '#cbd5e1' }}>{log.time}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
