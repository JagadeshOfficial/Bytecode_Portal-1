"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Video, Calendar, Clock, Users, Plus, X, Search,
    Filter, MoreHorizontal, Link as LinkIcon, CheckCircle
} from 'lucide-react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import styles from './Sessions.module.css';

// --- Mock Data ---

const COURSES = ['Full Stack Java', 'Python Data Science', 'DevOps & Cloud', 'MERN Stack'];
const BATCHES = ['Batch A (Morning)', 'Batch B (Evening)', 'Batch C (Weekend)'];
const MOCK_STUDENTS = [
    { id: '1', name: 'Alice Johnson' },
    { id: '2', name: 'Bob Smith' },
    { id: '3', name: 'Charlie Brown' },
    { id: '4', name: 'Diana Prince' },
    { id: '5', name: 'Evan Wright' },
];

interface Session {
    id: string;
    title: string;
    course: string;
    batch: string;
    date: string;
    startTime: string;
    duration: string;
    platform: string;
    link: string;
    status: 'LIVE' | 'UPCOMING' | 'COMPLETED';
    instructor: string;
}

const INITIAL_SESSIONS: Session[] = [
    {
        id: '1',
        title: 'Advanced Java Collections',
        course: 'Full Stack Java',
        batch: 'Batch A (Morning)',
        date: '2024-02-10',
        startTime: '10:00 AM',
        duration: '90 min',
        platform: 'Zoom',
        link: 'https://zoom.us/j/123456789',
        status: 'UPCOMING',
        instructor: 'Dr. Smith'
    },
    {
        id: '2',
        title: 'React Hooks Deep Dive',
        course: 'MERN Stack',
        batch: 'Batch B (Evening)',
        date: '2024-02-05',
        startTime: '06:00 PM',
        duration: '120 min',
        platform: 'Google Meet',
        link: 'https://meet.google.com/abc-defg-hij',
        status: 'LIVE',
        instructor: 'Prof. Sarah'
    },
    {
        id: '3',
        title: 'Intro to Kubernetes',
        course: 'DevOps & Cloud',
        batch: 'Batch C (Weekend)',
        date: '2024-02-04',
        startTime: '02:00 PM',
        duration: '60 min',
        platform: 'Zoom',
        link: '#',
        status: 'COMPLETED',
        instructor: 'Eng. Mike'
    }
];

// --- Components ---

export default function OnlineSessionsPage() {
    const [sessions, setSessions] = useState<Session[]>(INITIAL_SESSIONS);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterCourse, setFilterCourse] = useState('All');

    // Modal Form State
    const [formData, setFormData] = useState({
        title: '',
        course: COURSES[0],
        batch: BATCHES[0],
        date: '',
        startTime: '',
        duration: '60',
        platform: 'Zoom',
        link: '',
        audienceType: 'all', // 'all' or 'specific'
        selectedStudents: [] as string[]
    });

    const handleCreateSession = (e: React.FormEvent) => {
        e.preventDefault();
        const newSession: Session = {
            id: Math.random().toString(36).substr(2, 9),
            title: formData.title,
            course: formData.course,
            batch: formData.batch,
            date: formData.date || new Date().toISOString().split('T')[0],
            startTime: formData.startTime || '10:00 AM',
            duration: formData.duration + ' min',
            platform: formData.platform,
            link: formData.link,
            status: 'UPCOMING',
            instructor: 'Current Admin' // In real app, get from auth
        };
        setSessions([newSession, ...sessions]);
        setIsCreateModalOpen(false);
        // Reset form
        setFormData({
            title: '',
            course: COURSES[0],
            batch: BATCHES[0],
            date: '',
            startTime: '',
            duration: '60',
            platform: 'Zoom',
            link: '',
            audienceType: 'all',
            selectedStudents: []
        });
    };

    const toggleStudentSelection = (studentId: string) => {
        setFormData(prev => {
            const isSelected = prev.selectedStudents.includes(studentId);
            if (isSelected) {
                return { ...prev, selectedStudents: prev.selectedStudents.filter(id => id !== studentId) };
            } else {
                return { ...prev, selectedStudents: [...prev.selectedStudents, studentId] };
            }
        });
    };

    const filteredSessions = sessions.filter(session => {
        const matchesSearch = session.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            session.course.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFilter = filterCourse === 'All' || session.course === filterCourse;
        return matchesSearch && matchesFilter;
    });

    return (
        <DashboardLayout role="admin">
            <div className={styles.container}>
                {/* Header */}
                <div className={styles.header}>
                    <div className={styles.titleGroup}>
                        <Video size={32} color="#22d3ee" />
                        <h2>Online Sessions</h2>
                    </div>
                    <button className={styles.createBtn} onClick={() => setIsCreateModalOpen(true)}>
                        <Plus size={20} /> Create New Session
                    </button>
                </div>

                {/* Filters */}
                <div className={styles.filters}>
                    <div className={styles.searchBox}>
                        <Search size={18} color="#94a3b8" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
                        <input
                            type="text"
                            placeholder="Search sessions, topics..."
                            className={styles.searchInput}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <select
                        className={styles.filterSelect}
                        value={filterCourse}
                        onChange={(e) => setFilterCourse(e.target.value)}
                    >
                        <option value="All">All Courses</option>
                        {COURSES.map(course => (
                            <option key={course} value={course}>{course}</option>
                        ))}
                    </select>
                </div>

                {/* Grid */}
                <motion.div
                    layout
                    className={styles.sessionGrid}
                >
                    <AnimatePresence>
                        {filteredSessions.map((session) => (
                            <motion.div
                                key={session.id}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className={styles.sessionCard}
                            >
                                <div className={styles.cardHeader}>
                                    <div className={styles.dateBox}>
                                        <span className={styles.day}>{new Date(session.date).toLocaleString('en-US', { weekday: 'short' })}</span>
                                        <span className={styles.date}>{new Date(session.date).getDate()}</span>
                                    </div>
                                    <span className={`${styles.statusBadge} ${session.status === 'LIVE' ? styles.statusLive :
                                            session.status === 'UPCOMING' ? styles.statusUpcoming :
                                                styles.statusCompleted
                                        }`}>
                                        {session.status}
                                    </span>
                                </div>

                                <div className={styles.cardTitle}>{session.title}</div>
                                <div className={styles.cardCourse}>
                                    <span style={{ color: '#22d3ee' }}>{session.course}</span> • {session.batch}
                                </div>

                                <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', fontSize: '0.85rem', color: '#94a3b8' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                        <Clock size={14} />
                                        {session.startTime} ({session.duration})
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                        <Video size={14} />
                                        {session.platform}
                                    </div>
                                </div>

                                <div className={styles.cardFooter}>
                                    <div className={styles.avatars}>
                                        {[1, 2, 3].map((_, i) => (
                                            <div key={i} className={styles.avatar}>
                                                <Users size={12} />
                                            </div>
                                        ))}
                                        <div className={styles.avatar} style={{ background: '#475569' }}>+12</div>
                                    </div>
                                    <a href={session.link} target="_blank" rel="noopener noreferrer" className={styles.joinBtn}>
                                        {session.status === 'LIVE' ? 'Join Now' : 'Start Session'}
                                    </a>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>

                {/* Create Modal */}
                <AnimatePresence>
                    {isCreateModalOpen && (
                        <div className={styles.modalOverlay}>
                            <motion.div
                                initial={{ opacity: 0, y: 50 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 50 }}
                                className={styles.modalContent}
                            >
                                <div className={styles.modalHeader}>
                                    <h3>Schedule New Session</h3>
                                    <button className={styles.closeBtn} onClick={() => setIsCreateModalOpen(false)}>
                                        <X size={20} />
                                    </button>
                                </div>

                                <form onSubmit={handleCreateSession}>
                                    <div className={styles.formGroup}>
                                        <label className={styles.label}>Session Topic</label>
                                        <input
                                            required
                                            type="text"
                                            className={styles.input}
                                            placeholder="e.g., Advanced Java Streams"
                                            value={formData.title}
                                            onChange={e => setFormData({ ...formData, title: e.target.value })}
                                        />
                                    </div>

                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                        <div className={styles.formGroup}>
                                            <label className={styles.label}>Course</label>
                                            <select
                                                className={styles.select}
                                                value={formData.course}
                                                onChange={e => setFormData({ ...formData, course: e.target.value })}
                                            >
                                                {COURSES.map(c => <option key={c} value={c}>{c}</option>)}
                                            </select>
                                        </div>
                                        <div className={styles.formGroup}>
                                            <label className={styles.label}>Batch</label>
                                            <select
                                                className={styles.select}
                                                value={formData.batch}
                                                onChange={e => setFormData({ ...formData, batch: e.target.value })}
                                            >
                                                {BATCHES.map(b => <option key={b} value={b}>{b}</option>)}
                                            </select>
                                        </div>
                                    </div>

                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                                        <div className={styles.formGroup}>
                                            <label className={styles.label}>Date</label>
                                            <input
                                                required
                                                type="date"
                                                className={styles.input}
                                                value={formData.date}
                                                onChange={e => setFormData({ ...formData, date: e.target.value })}
                                            />
                                        </div>
                                        <div className={styles.formGroup}>
                                            <label className={styles.label}>Start Time</label>
                                            <input
                                                required
                                                type="time"
                                                className={styles.input}
                                                value={formData.startTime}
                                                onChange={e => setFormData({ ...formData, startTime: e.target.value })}
                                            />
                                        </div>
                                        <div className={styles.formGroup}>
                                            <label className={styles.label}>Duration (min)</label>
                                            <input
                                                type="number"
                                                className={styles.input}
                                                value={formData.duration}
                                                onChange={e => setFormData({ ...formData, duration: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <div className={styles.formGroup}>
                                        <label className={styles.label}>Participants</label>
                                        <div className={styles.radioGroup}>
                                            <label className={styles.radioLabel}>
                                                <input
                                                    type="radio"
                                                    name="audience"
                                                    checked={formData.audienceType === 'all'}
                                                    onChange={() => setFormData({ ...formData, audienceType: 'all' })}
                                                />
                                                All Students in Batch
                                            </label>
                                            <label className={styles.radioLabel}>
                                                <input
                                                    type="radio"
                                                    name="audience"
                                                    checked={formData.audienceType === 'specific'}
                                                    onChange={() => setFormData({ ...formData, audienceType: 'specific' })}
                                                />
                                                Select Specific Students
                                            </label>
                                        </div>
                                    </div>

                                    {formData.audienceType === 'specific' && (
                                        <div className={styles.formGroup} style={{ background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '0.5rem' }}>
                                            <label className={styles.label} style={{ marginBottom: '1rem' }}>Select Students</label>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '150px', overflowY: 'auto' }}>
                                                {MOCK_STUDENTS.map(student => (
                                                    <label key={student.id} className={styles.radioLabel} style={{ fontSize: '0.9rem' }}>
                                                        <input
                                                            type="checkbox"
                                                            checked={formData.selectedStudents.includes(student.id)}
                                                            onChange={() => toggleStudentSelection(student.id)}
                                                            style={{ marginRight: '0.5rem' }}
                                                        />
                                                        {student.name}
                                                    </label>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    <div className={styles.formGroup}>
                                        <label className={styles.label}>Meeting Link</label>
                                        <input
                                            required
                                            type="url"
                                            className={styles.input}
                                            placeholder="https://zoom.us/..."
                                            value={formData.link} // Changed from formData.url which was undefined in state setup
                                            onChange={e => setFormData({ ...formData, link: e.target.value })}
                                        />
                                    </div>

                                    <div className={styles.modalActions}>
                                        <button type="button" className={styles.cancelBtn} onClick={() => setIsCreateModalOpen(false)}>Cancel</button>
                                        <button type="submit" className={styles.submitBtn}>Schedule Session</button>
                                    </div>
                                </form>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </DashboardLayout>
    );
}
