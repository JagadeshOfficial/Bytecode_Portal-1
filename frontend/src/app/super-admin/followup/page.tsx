"use client";

import DashboardLayout from '@/components/DashboardLayout';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { 
    Phone, MessageCircle, Calendar, Clock, 
    CheckCircle, AlertCircle, ChevronRight, User,
    Plus, Filter, MoreVertical, MapPin
} from 'lucide-react';

export default function FollowUpHub() {
    const [activeTab, setActiveTab] = useState<'DUE' | 'OVERDUE' | 'UPCOMING'>('DUE');

    const tasks = [
        { id: 1, name: 'Sravan Kumar', phone: '9876543210', course: 'Java Full Stack', lastComment: 'Interested but needs to check fees.', due: '2:30 PM', priority: 'HIGH' },
        { id: 2, name: 'Priya Verma', phone: '8888877777', course: 'DevOps Master', lastComment: 'Wants a demo session.', due: '4:00 PM', priority: 'MEDIUM' },
        { id: 3, name: 'Kushal Reddy', phone: '7777700000', course: 'React Pro', lastComment: 'Busy, asked to call in the evening.', due: '5:30 PM', priority: 'LOW' },
    ];

    return (
        <DashboardLayout role="super_admin">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                    <div>
                        <div style={{ fontSize: '0.75rem', fontWeight: 900, color: 'var(--primary)', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '8px' }}>Action & Engagement</div>
                        <h1 style={{ fontSize: '3rem', fontWeight: 950, letterSpacing: '-2px', lineHeight: 0.9 }}>Follow-up Hub</h1>
                        <p style={{ color: 'var(--text-dim)', fontSize: '1.1rem', marginTop: '15px' }}>Never miss a single conversion opportunity. Every call counts.</p>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(400px, 1fr) 350px', gap: '2.5rem' }}>
                    
                    {/* --- MAIN TASK AREA --- */}
                    <div>
                        <div className="glass-panel" style={{ padding: '8px', borderRadius: '20px', display: 'inline-flex', gap: '5px', marginBottom: '2.5rem' }}>
                            <TabButton active={activeTab === 'DUE'} onClick={() => setActiveTab('DUE')} label="Due Today (12)" color="#3b82f6" />
                            <TabButton active={activeTab === 'OVERDUE'} onClick={() => setActiveTab('OVERDUE')} label="Overdue (3)" color="#ef4444" />
                            <TabButton active={activeTab === 'UPCOMING'} onClick={() => setActiveTab('UPCOMING')} label="Upcoming (45)" color="var(--text-dim)" />
                        </div>

                        <div className="timeline-container">
                            {tasks.map((t, i) => (
                                <motion.div 
                                    key={t.id} 
                                    initial={{ opacity: 0, x: -10 }} 
                                    animate={{ opacity: 1, x: 0 }} 
                                    transition={{ delay: i * 0.1 }}
                                    className="task-card"
                                >
                                    <div className="task-side-indicator" style={{ background: t.priority === 'HIGH' ? '#ef4444' : (t.priority === 'MEDIUM' ? '#f59e0b' : '#3b82f6') }} />
                                    
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '1.5rem', flex: 1 }}>
                                        <div style={{ display: 'flex', gap: '20px' }}>
                                            <div style={{ width: '60px', textAlign: 'center' }}>
                                                <div style={{ fontSize: '1rem', fontWeight: 950, color: 'var(--text-bright)' }}>{t.due}</div>
                                                <div style={{ fontSize: '0.6rem', fontWeight: 900, color: 'var(--text-dim)', textTransform: 'uppercase', marginTop: '4px' }}>Today</div>
                                            </div>
                                            
                                            <div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '5px' }}>
                                                    <h3 style={{ fontSize: '1.1rem', fontWeight: 900 }}>{t.name}</h3>
                                                    <span style={{ fontSize: '0.6rem', fontWeight: 900, background: 'rgba(255,255,255,0.05)', padding: '2px 8px', borderRadius: '6px', color: 'var(--text-dim)' }}>{t.priority} PRIORITY</span>
                                                </div>
                                                <div style={{ fontSize: '0.85rem', color: 'var(--text-dim)', fontWeight: 800 }}>{t.course}</div>
                                                <blockquote style={{ marginTop: '15px', color: 'rgba(255,255,255,0.6)', fontStyle: 'italic', fontSize: '0.8rem', borderLeft: '2px solid var(--primary)', paddingLeft: '15px', margin: '15px 0' }}>
                                                    "{t.lastComment}"
                                                </blockquote>
                                            </div>
                                        </div>

                                        <div style={{ display: 'flex', gap: '10px' }}>
                                            <button className="action-button whatsapp"><MessageCircle size={18} /></button>
                                            <button className="action-button call"><Phone size={18} /></button>
                                            <button className="action-button complete"><CheckCircle size={18} /></button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* --- SIDEBAR: INSIGHTS & SCRIPTS --- */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        <div className="glass-panel" style={{ padding: '2rem', borderRadius: '32px' }}>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: 900, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <Calendar color="var(--primary)" size={20} /> Today's Focus
                            </h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <FocusItem label="Completed Calls" value="08" total="12" color="#10b981" />
                                <FocusItem label="Interested Leads" value="03" total="08" color="#8b5cf6" />
                                <FocusItem label="Demo Sessions Scheduled" value="02" total="05" color="#3b82f6" />
                            </div>
                        </div>

                        <div className="glass-panel" style={{ padding: '2rem', borderRadius: '32px', background: 'linear-gradient(rgba(124, 58, 237, 0.1), transparent)' }}>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: 900, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <AlertCircle color="var(--primary)" size={20} /> Success Script
                            </h3>
                            <p style={{ fontSize: '0.85rem', color: 'var(--text-dim)', lineHeight: '1.6', marginBottom: '20px' }}>
                                "Hi {selectedTaskName}, I'm calling from Bytecode Trainings to follow up on your enquiry for the {selectedCourse} course. Have you had a chance to review the brochure?"
                            </p>
                            <button style={{ width: '100%', padding: '12px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '0.75rem', fontWeight: 900, letterSpacing: '1px' }}>
                                VIEW FULL SALES SCRIPT
                            </button>
                        </div>
                    </div>
                </div>

            </motion.div>

            <style jsx>{`
                .glass-panel {
                    background: rgba(255, 255, 255, 0.015);
                    backdrop-filter: blur(25px);
                    border: 1px solid rgba(255, 255, 255, 0.05);
                }
                .task-card {
                    background: rgba(255, 255, 255, 0.015);
                    backdrop-filter: blur(25px);
                    border: 1px solid rgba(255, 255, 255, 0.05);
                    border-radius: 24px;
                    margin-bottom: 1.5rem;
                    display: flex;
                    overflow: hidden;
                    transition: all 0.3s ease;
                }
                .task-card:hover {
                    transform: translateX(10px);
                    background: rgba(255, 255, 255, 0.03);
                }
                .task-side-indicator {
                    width: 6px;
                    height: 100%;
                }
                .action-button {
                    width: 45px;
                    height: 45px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 14px;
                    border: 1px solid rgba(255, 255, 255, 0.05);
                    cursor: pointer;
                    transition: all 0.2s ease;
                }
                .whatsapp { color: #25d366; background: rgba(37, 211, 102, 0.05); }
                .call { color: #3b82f6; background: rgba(59, 130, 246, 0.05); }
                .complete { color: #10b981; background: rgba(16, 185, 129, 0.05); }
                .action-button:hover { transform: scale(1.1); color: #fff; background: var(--primary); }
            `}</style>
        </DashboardLayout>
    );
}

const selectedTaskName = "{Lead Name}";
const selectedCourse = "{Course}";

function TabButton({ active, label, onClick, color }: any) {
    return (
        <button 
            onClick={onClick}
            style={{ 
                padding: '12px 24px', borderRadius: '14px', border: 'none',
                background: active ? 'rgba(255,255,255,0.05)' : 'transparent',
                color: active ? '#fff' : 'var(--text-dim)',
                boxShadow: active ? `inset 0 0 10px ${color}20` : 'none',
                fontWeight: 900, fontSize: '0.8rem', cursor: 'pointer', transition: 'all 0.3s ease'
            }}
        >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {active && <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: color }} />}
                {label}
            </div>
        </button>
    );
}

function FocusItem({ label, value, total, color }: any) {
    const percentage = (parseInt(value) / parseInt(total)) * 100;
    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)', fontWeight: 800 }}>{label}</span>
                <span style={{ fontSize: '0.85rem', color: '#fff', fontWeight: 950 }}>{value}/{total}</span>
            </div>
            <div style={{ height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', overflow: 'hidden' }}>
                <div style={{ height: '100%', background: color, width: `${percentage}%`, borderRadius: '10px', boxShadow: `0 0 10px ${color}80` }} />
            </div>
        </div>
    );
}
