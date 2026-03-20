"use client";

import { useState } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Bell, Megaphone, Plus, Calendar, Pin, Trash2, Edit, CheckCircle, AlertTriangle
} from 'lucide-react';
import styles from '../Admin.module.css';

// -- Mock Notices --
const MOCK_NOTICES = [
    { id: 1, title: 'Holiday Announcement: Diwali Break', content: 'The institute will remain closed from Nov 10 to Nov 14 for Diwali celebrations.', types: ['All'], date: 'Oct 28, 2026', priority: 'High', pinned: true },
    { id: 2, title: 'New Course Launch: AI & Machine Learning', content: 'We are thrilled to announce our new advanced AI cohort starting next month. Registrations open now.', types: ['Students', 'Tutors'], date: 'Nov 01, 2026', priority: 'Normal', pinned: false },
    { id: 3, title: 'Faculty Meeting Rescheduled', content: 'The weekly department meeting is moved to Friday, 3 PM.', types: ['Employee', 'Tutor'], date: 'Nov 02, 2026', priority: 'High', pinned: false },
];

export default function NoticesPage() {
    const [notices, setNotices] = useState(MOCK_NOTICES);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newNotice, setNewNotice] = useState({ title: '', content: '', priority: 'Normal', audience: 'All' });

    const handleAddNotice = () => {
        const notice = {
            id: notices.length + 1,
            title: newNotice.title,
            content: newNotice.content,
            types: [newNotice.audience],
            date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            priority: newNotice.priority,
            pinned: false
        };
        setNotices([notice, ...notices]);
        setIsModalOpen(false);
        setNewNotice({ title: '', content: '', priority: 'Normal', audience: 'All' });
    };

    const deleteNotice = (id: number) => {
        setNotices(notices.filter(n => n.id !== id));
    };

    return (
        <DashboardLayout role="admin">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={styles.container}>

                {/* Header */}
                <div className={styles.glassHeader} style={{ marginBottom: '2rem' }}>
                    <div className={styles.titleGroup}>
                        <h3 style={{ fontSize: '1.8rem' }}>NOTICE BOARD</h3>
                        <p className={styles.subTitle}>Broadcast announcements, schedules, and important updates.</p>
                    </div>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className={styles.btnPrimary}
                    >
                        <Plus size={18} /> Create Announcement
                    </button>
                </div>

                {/* Notices Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: '1.5rem' }}>
                    {notices.map((notice) => (
                        <motion.div
                            key={notice.id}
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className={styles.glassPanel}
                            style={{
                                padding: '1.5rem',
                                borderLeft: notice.priority === 'High' ? '4px solid #f87171' : '4px solid #3b82f6',
                                display: 'flex', flexDirection: 'column', gap: '1rem',
                                position: 'relative'
                            }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div style={{ flex: 1 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                        {notice.pinned && <Pin size={14} color="#facc15" fill="#facc15" />}
                                        <span style={{
                                            fontSize: '0.7rem', textTransform: 'uppercase', fontWeight: 700,
                                            padding: '0.2rem 0.5rem', borderRadius: '4px',
                                            background: 'rgba(255,255,255,0.1)', color: '#cbd5e1'
                                        }}>
                                            {notice.types.join(', ')}
                                        </span>
                                        {notice.priority === 'High' && (
                                            <span style={{ fontSize: '0.7rem', color: '#f87171', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                                                <AlertTriangle size={12} /> Urgent
                                            </span>
                                        )}
                                    </div>
                                    <h4 style={{ fontSize: '1.2rem', color: 'white', margin: 0, lineHeight: 1.3 }}>{notice.title}</h4>
                                </div>
                            </div>

                            <p style={{ color: '#94a3b8', fontSize: '0.95rem', lineHeight: '1.6', margin: 0 }}>
                                {notice.content}
                            </p>

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: '#64748b' }}>
                                    <Calendar size={14} /> {notice.date}
                                </div>
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <button className={styles.iconBtn} style={{ color: '#ef4444' }} onClick={() => deleteNotice(notice.id)}>
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Create Modal */}
                <AnimatePresence>
                    {isModalOpen && (
                        <>
                            <motion.div
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(5px)', zIndex: 100 }}
                                onClick={() => setIsModalOpen(false)}
                            />
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9, y: 20, x: '-50%' }}
                                animate={{ opacity: 1, scale: 1, y: 0, x: '-50%' }}
                                exit={{ opacity: 0, scale: 0.9, y: 20, x: '-50%' }}
                                style={{
                                    position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                                    width: '90%', maxWidth: '500px', background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)',
                                    borderRadius: '1rem', padding: '2rem', zIndex: 101, boxShadow: '0 20px 50px rgba(0,0,0,0.5)'
                                }}
                            >
                                <h3 style={{ fontSize: '1.5rem', color: 'white', marginBottom: '1.5rem' }}>New Announcement</h3>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    <div>
                                        <label style={{ display: 'block', color: '#cbd5e1', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Title</label>
                                        <input
                                            type="text"
                                            className={styles.searchInput} style={{ width: '100%' }} placeholder="e.g. System Maintenance"
                                            value={newNotice.title} onChange={e => setNewNotice({ ...newNotice, title: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', color: '#cbd5e1', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Message</label>
                                        <textarea
                                            className={styles.searchInput} style={{ width: '100%', minHeight: '100px', resize: 'vertical' }} placeholder="Enter the details..."
                                            value={newNotice.content} onChange={e => setNewNotice({ ...newNotice, content: e.target.value })}
                                        />
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                        <div>
                                            <label style={{ display: 'block', color: '#cbd5e1', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Priority</label>
                                            <select
                                                className={styles.searchInput} style={{ width: '100%' }}
                                                value={newNotice.priority} onChange={e => setNewNotice({ ...newNotice, priority: e.target.value })}
                                            >
                                                <option>Normal</option>
                                                <option>High</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label style={{ display: 'block', color: '#cbd5e1', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Audience</label>
                                            <select
                                                className={styles.searchInput} style={{ width: '100%' }}
                                                value={newNotice.audience} onChange={e => setNewNotice({ ...newNotice, audience: e.target.value })}
                                            >
                                                <option>All</option>
                                                <option>Students</option>
                                                <option>Employee</option>
                                                <option>Tutors</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
                                        <button onClick={() => setIsModalOpen(false)} className={styles.btnSecondary}>Cancel</button>
                                        <button onClick={handleAddNotice} className={styles.btnPrimary}>Post Notice</button>
                                    </div>
                                </div>
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>

            </motion.div>
        </DashboardLayout>
    );
}
