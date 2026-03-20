"use client";

import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Plus, MoreHorizontal, Mail, Phone, CheckCircle, ShieldAlert, Users, UserCheck, XCircle, Eye, Edit, Trash2, Ban } from 'lucide-react';
import { useState } from 'react';
import styles from '../Admin.module.css';

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

const STUDENTS_DATA = [
    { id: 'STU-2024-001', name: 'Student Name 1', email: 'active.learner@example.com', course: 'Full Stack Java', batch: 'Batch A', status: 'Active', isVerified: true, progress: 75, joinDate: 'Jan 15, 2024', img: 'https://api.dicebear.com/7.x/avataaars/svg?seed=1' },
    { id: 'STU-2024-002', name: 'Student Name 2', email: 'verified.pro@example.com', course: 'Python & AI', batch: 'Batch B', status: 'Active', isVerified: true, progress: 45, joinDate: 'Jan 20, 2024', img: 'https://api.dicebear.com/7.x/avataaars/svg?seed=2' },
    { id: 'STU-2024-003', name: 'Student Name 3', email: 'dropout.risk@example.com', course: 'DevOps Cloud', batch: 'Batch A', status: 'Inactive', isVerified: false, progress: 10, joinDate: 'Dec 10, 2023', img: 'https://api.dicebear.com/7.x/avataaars/svg?seed=3' },
    { id: 'STU-2024-004', name: 'Student Name 4', email: 'new.joiner@example.com', course: 'Data Science', batch: 'Batch C', status: 'Active', isVerified: true, progress: 5, joinDate: 'Feb 01, 2024', img: 'https://api.dicebear.com/7.x/avataaars/svg?seed=4' },
    { id: 'STU-2024-005', name: 'Student Name 5', email: 'pending.approval@example.com', course: 'Full Stack Java', batch: '-', status: 'Pending', isVerified: false, progress: 0, joinDate: 'Feb 05, 2024', img: 'https://api.dicebear.com/7.x/avataaars/svg?seed=5' },
    { id: 'STU-2024-006', name: 'Student Name 6', email: 'graduated.star@example.com', course: 'MERN Stack', batch: 'Batch 22', status: 'Alumni', isVerified: true, progress: 100, joinDate: 'Oct 05, 2023', img: 'https://api.dicebear.com/7.x/avataaars/svg?seed=6' },
];

export default function StudentsPage() {
    const [activeTab, setActiveTab] = useState('All Students');
    const [activeActionId, setActiveActionId] = useState<string | null>(null);

    const filteredStudents = STUDENTS_DATA.filter(student => {
        if (activeTab === 'All Students') return true;
        if (activeTab === 'Enrolled') return student.status === 'Active';
        if (activeTab === 'Pending') return student.status === 'Pending';
        if (activeTab === 'Alumni') return student.status === 'Alumni' || student.status === 'Inactive'; // Grouping inactive as Alumni for demo
        return true;
    });

    const handleAction = (action: string, id: string) => {
        alert(`${action} for Student ID: ${id}`);
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
                {/* Header */}
                <div className={styles.glassHeader} style={{ marginBottom: '2rem' }}>
                    <div className={styles.titleGroup}>
                        <h3 style={{ fontSize: '1.8rem' }}>STUDENT MANAGEMENT</h3>
                        <p className={styles.subTitle}>Advanced enrollment tracking and student details.</p>
                    </div>
                    <button className={styles.viewScheduleBtn} style={{ width: 'auto', padding: '0.8rem 1.5rem', marginTop: 0 }}>
                        <Plus size={18} style={{ marginRight: '0.5rem' }} /> Add New Student
                    </button>
                </div>

                {/* Top Stats Row */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '2rem' }}>
                    <motion.div variants={itemVariants} className={styles.glassPanel} style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ padding: '0.8rem', borderRadius: '12px', background: 'rgba(34, 211, 238, 0.1)', color: '#22d3ee' }}><Users size={24} /></div>
                        <div>
                            <div style={{ fontSize: '1.8rem', fontWeight: 'bold', fontFamily: 'Rajdhani', color: 'white' }}>1,240</div>
                            <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Total Students</div>
                        </div>
                    </motion.div>
                    <motion.div variants={itemVariants} className={styles.glassPanel} style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ padding: '0.8rem', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.1)', color: '#34d399' }}><CheckCircle size={24} /></div>
                        <div>
                            <div style={{ fontSize: '1.8rem', fontWeight: 'bold', fontFamily: 'Rajdhani', color: 'white' }}>98%</div>
                            <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Verified Enrollments</div>
                        </div>
                    </motion.div>
                    <motion.div variants={itemVariants} className={styles.glassPanel} style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ padding: '0.8rem', borderRadius: '12px', background: 'rgba(234, 179, 8, 0.1)', color: '#facc15' }}><UserCheck size={24} /></div>
                        <div>
                            <div style={{ fontSize: '1.8rem', fontWeight: 'bold', fontFamily: 'Rajdhani', color: 'white' }}>45</div>
                            <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>New This Month</div>
                        </div>
                    </motion.div>
                    <motion.div variants={itemVariants} className={styles.glassPanel} style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ padding: '0.8rem', borderRadius: '12px', background: 'rgba(239, 68, 68, 0.1)', color: '#f87171' }}><XCircle size={24} /></div>
                        <div>
                            <div style={{ fontSize: '1.8rem', fontWeight: 'bold', fontFamily: 'Rajdhani', color: 'white' }}>12</div>
                            <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Inactive / Dropouts</div>
                        </div>
                    </motion.div>
                </div>

                {/* Filters & Tabs */}
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap', alignItems: 'center' }}>
                    <div style={{ display: 'flex', background: 'rgba(30, 41, 59, 0.5)', padding: '0.25rem', borderRadius: '0.75rem', border: '1px solid rgba(255,255,255,0.05)' }}>
                        {['All Students', 'Enrolled', 'Pending', 'Alumni'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                style={{
                                    padding: '0.5rem 1rem',
                                    background: activeTab === tab ? 'rgba(124, 58, 237, 0.2)' : 'transparent',
                                    color: activeTab === tab ? '#fff' : '#94a3b8',
                                    border: 'none',
                                    borderRadius: '0.5rem',
                                    cursor: 'pointer',
                                    fontSize: '0.85rem',
                                    fontWeight: 500,
                                    transition: 'all 0.2s'
                                }}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    <div className={styles.searchGroup} style={{ flex: 1, maxWidth: '400px', marginLeft: 'auto' }}>
                        <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', zIndex: 1 }} />
                        <input type="text" placeholder="Search students..." className={styles.searchInput} />
                    </div>
                    <button className={styles.iconBtn}><Filter size={18} /></button>
                </div>

                {/* Students Table */}
                <motion.div variants={itemVariants} className={styles.glassPanel}>
                    <div className={styles.tableWrapper}>
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th>Student</th>
                                    <th>Contact</th>
                                    <th>Enrollment & Batch</th>
                                    <th>Progress</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredStudents.map((student, i) => (
                                    <tr key={i} className={styles.tableRow}>
                                        <td>
                                            <div className={styles.studentCell}>
                                                <div style={{ position: 'relative' }}>
                                                    <img src={student.img} alt="" className={styles.studentImg} />
                                                    {student.isVerified && (
                                                        <div style={{
                                                            position: 'absolute', bottom: -2, right: -2,
                                                            background: '#10b981', borderRadius: '50%', padding: '2px', border: '2px solid #0f172a'
                                                        }}>
                                                            <CheckCircle size={10} color="white" strokeWidth={3} />
                                                        </div>
                                                    )}
                                                </div>
                                                <div className={styles.studentInfo}>
                                                    <div className={styles.studentName} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                        {student.name}
                                                        {!student.isVerified && <ShieldAlert size={14} color="#facc15" />}
                                                    </div>
                                                    <div className={styles.studentId}>{student.id}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', fontSize: '0.85rem', color: '#cbd5e1' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                    <Mail size={12} color="#94a3b8" /> {student.email}
                                                </div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                    <Phone size={12} color="#94a3b8" /> +1 234 567 890
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <div className={styles.courseText}>{student.course}</div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.25rem' }}>
                                                <span className={styles.statusTag} style={{ background: 'rgba(255,255,255,0.05)' }}>{student.batch}</span>
                                                {student.isVerified ?
                                                    <span style={{ fontSize: '0.65rem', color: '#34d399', display: 'flex', alignItems: 'center', gap: '2px' }}><CheckCircle size={10} /> Enrolled</span>
                                                    : <span style={{ fontSize: '0.65rem', color: '#facc15', display: 'flex', alignItems: 'center', gap: '2px' }}><ShieldAlert size={10} /> Not Enrolled</span>
                                                }
                                            </div>
                                        </td>
                                        <td style={{ width: '150px' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.3rem', color: '#94a3b8' }}>
                                                <span>Course Completion</span>
                                                <span>{student.progress}%</span>
                                            </div>
                                            <div className={styles.sysBarBg}>
                                                <div
                                                    className={styles.sysBarFill}
                                                    style={{ width: `${student.progress}%`, background: student.progress > 75 ? '#10b981' : student.progress > 40 ? '#3b82f6' : '#facc15' }}
                                                ></div>
                                            </div>
                                        </td>
                                        <td>
                                            <span className={`${styles.statusBadge} ${student.status === 'Active' ? styles.paid : student.status === 'Pending' ? styles.pending : student.status === 'Alumni' ? styles.paid : styles.statusBusy}`}
                                                style={student.status === 'Alumni' ? { background: 'rgba(99, 102, 241, 0.1)', color: '#818cf8', borderColor: 'rgba(99, 102, 241, 0.2)' } : {}}
                                            >
                                                {student.status.toUpperCase()}
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
                                                            style={{ right: '0', top: '100%', zIndex: 50 }}
                                                        >
                                                            <div className={styles.actionMenuItem} onClick={() => handleAction('View Profile', student.id)}>
                                                                <Eye size={14} /> View Details
                                                            </div>
                                                            <div className={styles.actionMenuItem} onClick={() => handleAction('Edit Student', student.id)}>
                                                                <Edit size={14} /> Edit Profile
                                                            </div>
                                                            <div className={styles.actionMenuItem} style={{ color: '#ef4444' }} onClick={() => handleAction('Suspend Student', student.id)}>
                                                                <Ban size={14} /> Suspend Access
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
            </motion.div>
        </DashboardLayout>
    );
}
