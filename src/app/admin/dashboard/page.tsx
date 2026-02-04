"use client";

import DashboardLayout from '@/components/dashboard/DashboardLayout';
import AdvancedStatsCard from '../../../components/dashboard/AdvancedStatsCard';
import SystemHealthWidget from '@/components/dashboard/SystemHealthWidget';
import { Users, BookOpen, Calendar, Wallet, MoreHorizontal, Filter, Download, Activity, Clock, ShieldCheck, UserCheck, Plus, Zap, User, FileText, Trash2 } from 'lucide-react';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import styles from './Admin.module.css';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.1 }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
};

const ATTENDANCE_DATA = [
    { name: 'Mon', value: 92, previous: 85 },
    { name: 'Tue', value: 88, previous: 87 },
    { name: 'Wed', value: 95, previous: 90 },
    { name: 'Thu', value: 89, previous: 86 },
    { name: 'Fri', value: 85, previous: 82 },
    { name: 'Sat', value: 70, previous: 65 },
];

const PERFORMANCE_DATA = [
    { subject: 'Java', A: 120, B: 110, fullMark: 150 },
    { subject: 'Python', A: 98, B: 130, fullMark: 150 },
    { subject: 'DevOps', A: 86, B: 130, fullMark: 150 },
    { subject: 'Data Sci', A: 99, B: 100, fullMark: 150 },
    { subject: 'Cloud', A: 85, B: 90, fullMark: 150 },
    { subject: 'Security', A: 65, B: 85, fullMark: 150 },
];

const ENROLLMENT_DATA = [
    { id: 'STU-2024-001', name: 'Student Name 1', course: 'Full Stack Java', date: 'Jan 30, 2024', status: 'PAID', amount: '$1,200', img: 'https://api.dicebear.com/7.x/avataaars/svg?seed=1' },
    { id: 'STU-2024-002', name: 'Student Name 2', course: 'Python & AI', date: 'Jan 30, 2024', status: 'PENDING', amount: '$900', img: 'https://api.dicebear.com/7.x/avataaars/svg?seed=2' },
    { id: 'STU-2024-003', name: 'Student Name 3', course: 'DevOps Cloud', date: 'Jan 29, 2024', status: 'PAID', amount: '$1,500', img: 'https://api.dicebear.com/7.x/avataaars/svg?seed=3' },
    { id: 'STU-2024-004', name: 'Student Name 4', course: 'Data Science', date: 'Jan 28, 2024', status: 'PAID', amount: '$1,800', img: 'https://api.dicebear.com/7.x/avataaars/svg?seed=4' },
];

const FACULTY_STATUS = [
    { name: "Sarah Connor", subject: "React JS", status: "In Class", time: "10:00 - 12:00", avatar: "SC" },
    { name: "John Doe", subject: "Python", status: "Available", time: "Next: 02:00 PM", avatar: "JD" },
    { name: "Jane Smith", subject: "DevOps", status: "On Leave", time: "Back Tomorrow", avatar: "JS" },
    { name: "Mike Ross", subject: "System Design", status: "In Meeting", time: "11:30 - 12:30", avatar: "MR" },
];

import { useRouter } from 'next/navigation';

// ... (other imports remain)

export default function AdminDashboard() {
    const router = useRouter();
    const [activeActionId, setActiveActionId] = useState<string | null>(null);

    const handleDownloadInvoice = (id: string) => {
        // Simulate download
        const link = document.createElement('a');
        link.href = '#';
        link.download = `Invoice_${id}.pdf`;
        document.body.appendChild(link);
        alert(`Starting download for Invoice #${id}...`);
        document.body.removeChild(link);
        setActiveActionId(null);
    };

    const handleViewProfile = (id: string) => {
        router.push('/admin/dashboard/students');
        setActiveActionId(null);
    };

    const handleRemoveStudent = (id: string) => {
        if (confirm('Are you sure you want to remove this student?')) {
            alert('Student removed successfully (Simulated).');
        }
        setActiveActionId(null);
    };

    return (
        <DashboardLayout role="admin">
            <motion.div
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                className={styles.container}
            >
                {/* ... (Stats and Charts remain the same) ... */}

                {/* 3. Bottom Grid: Enrollments + Health + Faculty */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                    {/* Enrollments Table - Span 2 on large */}
                    <motion.div variants={itemVariants} className={styles.glassPanel} style={{ gridColumn: 'span 2' }}>
                        <div className={styles.glassHeader}>
                            <div className={styles.titleGroup}>
                                <h3><ShieldCheck size={20} color="#22d3ee" /> RECENT ENROLLMENTS</h3>
                            </div>
                            <div className={styles.controls}>
                                <div className={styles.searchGroup}>
                                    <Filter size={16} color="#94a3b8" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', zIndex: 1 }} />
                                    <input type="text" placeholder="Search by student or course..." className={styles.searchInput} />
                                </div>
                                <button className={styles.iconBtn}><Download size={18} /></button>
                            </div>
                        </div>

                        <div className={styles.tableWrapper}>
                            <table className={styles.table}>
                                <thead>
                                    <tr>
                                        <th>Student</th>
                                        <th>Course</th>
                                        <th>Date</th>
                                        <th>Amount</th>
                                        <th>Status</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {ENROLLMENT_DATA.map((student, i) => (
                                        <tr key={i} className={styles.tableRow}>
                                            <td>
                                                <div className={styles.studentCell}>
                                                    <img src={student.img} alt="" className={styles.studentImg} />
                                                    <div className={styles.studentInfo}>
                                                        <div className={styles.studentName}>{student.name}</div>
                                                        <div className={styles.studentId}>{student.id}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className={styles.courseText}>{student.course}</td>
                                            <td className={styles.dateText}>{student.date}</td>
                                            <td className={styles.amountText}>{student.amount}</td>
                                            <td>
                                                <span className={`${styles.statusBadge} ${student.status === 'PAID' ? styles.paid : styles.pending}`}>
                                                    {student.status}
                                                </span>
                                            </td>
                                            <td>
                                                <div style={{ position: 'relative' }}>
                                                    <button
                                                        className={styles.actionCellBtn}
                                                        onClick={() => setActiveActionId(activeActionId === student.id ? null : student.id)}
                                                    >
                                                        <MoreHorizontal size={16} />
                                                    </button>
                                                    <AnimatePresence>
                                                        {activeActionId === student.id && (
                                                            <motion.div
                                                                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                                                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                                                exit={{ opacity: 0, scale: 0.9, y: 10 }}
                                                                className={styles.actionMenu}
                                                            >
                                                                <div className={styles.actionMenuItem} onClick={() => handleViewProfile(student.id)}>
                                                                    <User size={14} /> View Profile
                                                                </div>
                                                                <div className={styles.actionMenuItem} onClick={() => handleDownloadInvoice(student.id)}>
                                                                    <FileText size={14} /> Download Invoice
                                                                </div>
                                                                <div className={styles.actionMenuItem} style={{ color: '#ef4444' }} onClick={() => handleRemoveStudent(student.id)}>
                                                                    <Trash2 size={14} /> Remove Student
                                                                </div>
                                                            </motion.div>
                                                        )}
                                                    </AnimatePresence>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </motion.div>

                    {/* Right Column Stack */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <SystemHealthWidget />

                        <motion.div variants={itemVariants} className={styles.glassPanel}>
                            <div className={styles.glassHeader}>
                                <div className={styles.titleGroup}>
                                    <h3><UserCheck size={20} color="#10b981" /> FACULTY STATUS</h3>
                                    <span className={`${styles.statusTag} ${styles.statusAvailable}`} style={{ marginLeft: '0.5rem' }}>LIVE</span>
                                </div>
                            </div>
                            <div className={styles.facultyList}>
                                {FACULTY_STATUS.map((faculty, i) => (
                                    <div key={i} className={styles.facultyCard}>
                                        <div className={styles.facultyInfo}>
                                            <div className={styles.avatar}>{faculty.avatar}</div>
                                            <div>
                                                <div className={styles.facultyName}>{faculty.name}</div>
                                                <div className={styles.facultySubject}>{faculty.subject}</div>
                                            </div>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <span className={`${styles.statusTag} ${faculty.status === 'Available' ? styles.statusAvailable :
                                                faculty.status === 'In Class' ? styles.statusInClass : styles.statusBusy
                                                }`}>
                                                {faculty.status}
                                            </span>
                                            <div className={styles.timeInfo} style={{ marginTop: '0.2rem' }}>
                                                <Clock size={10} /> {faculty.time}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <button className={styles.viewScheduleBtn} onClick={() => router.push('/admin/dashboard/attendance')}>
                                View Full Schedule
                            </button>
                        </motion.div>
                    </div>
                </div>
            </motion.div>
        </DashboardLayout>
    );
}
