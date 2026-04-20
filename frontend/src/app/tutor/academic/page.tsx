"use client";

import DashboardLayout from '@/components/DashboardLayout';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { 
    Book, Layers, Users, Clock, Calendar,
    Play, Video, FileText, CheckCircle, Search,
    Plus, Edit2, Eye, ChevronRight
} from 'lucide-react';
import { fetchJsonSafe } from '@/lib/fetchJson';

export default function TutorAcademicPage() {
    const [viewMode, setViewMode] = useState<'BATCHES' | 'LIVE' | 'Drive'>('BATCHES');
    const [batches, setBatches] = useState<any[]>([]);
    const [courses, setCourses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedBatch, setSelectedBatch] = useState<any>(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        const [batchesResult, coursesResult] = await Promise.all([
            fetchJsonSafe<any[]>('http://localhost:8080/api/academic/batches'),
            fetchJsonSafe<any[]>('http://localhost:8080/api/academic/courses')
        ]);
        
        if (batchesResult.ok && Array.isArray(batchesResult.data)) {
            setBatches(batchesResult.data);
        }
        if (coursesResult.ok && Array.isArray(coursesResult.data)) {
            setCourses(coursesResult.data);
        }
        setLoading(false);
    };

    const myBatches = batches;

    return (
        <DashboardLayout role="tutor">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                    <div>
                        <h1 style={{ fontSize: '2.5rem', fontWeight: 900, letterSpacing: '-1px' }}>Academic Hub</h1>
                        <p style={{ color: 'var(--text-dim)', fontSize: '1.1rem' }}>Manage your curriculum and live sessions.</p>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '15px', marginBottom: '2rem' }}>
                    {['BATCHES', 'LIVE', 'Drive'].map(tab => (
                        <button 
                            key={tab}
                            onClick={() => setViewMode(tab as any)}
                            style={{
                                padding: '12px 24px',
                                borderRadius: '12px',
                                background: viewMode === tab ? 'var(--primary)' : 'rgba(255,255,255,0.03)',
                                border: viewMode === tab ? 'none' : '1px solid rgba(255,255,255,0.05)',
                                color: viewMode === tab ? '#000' : 'var(--text-dim)',
                                fontWeight: 800,
                                fontSize: '0.85rem',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease'
                            }}
                        >
                            {tab === 'Drive' ? 'Course Drive' : tab}
                        </button>
                    ))}
                </div>

                {viewMode === 'BATCHES' && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }}>
                        {loading ? (
                            <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-dim)' }}>Loading batches...</div>
                        ) : myBatches.length === 0 ? (
                            <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-dim)', gridColumn: '1/-1' }}>
                                No batches assigned yet.
                            </div>
                        ) : myBatches.map((batch, i) => (
                            <motion.div
                                key={batch.id || i}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="glass-panel"
                                style={{ padding: '1.5rem', borderRadius: '24px', cursor: 'pointer' }}
                                onClick={() => setSelectedBatch(batch)}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                                    <div>
                                        <h3 style={{ fontSize: '1.2rem', fontWeight: 900 }}>{batch.name || batch.batchName}</h3>
                                        <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginTop: '4px' }}>{batch.course?.name || 'General'}</p>
                                    </div>
                                    <span style={{ 
                                        background: batch.status === 'ACTIVE' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                                        color: batch.status === 'ACTIVE' ? '#10b981' : '#f59e0b',
                                        padding: '4px 12px',
                                        borderRadius: '100px',
                                        fontSize: '0.65rem',
                                        fontWeight: 900
                                    }}>
                                        {batch.status || 'UPCOMING'}
                                    </span>
                                </div>
                                <div style={{ display: 'flex', gap: '1.5rem', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-dim)', fontSize: '0.8rem' }}>
                                        <Clock size={14} /> {batch.startTime || 'TBD'}
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-dim)', fontSize: '0.8rem' }}>
                                        <Users size={14} /> {batch.students?.length || 0} Students
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}

                {viewMode === 'LIVE' && (
                    <div className="glass-panel" style={{ padding: '2rem', borderRadius: '24px' }}>
                        <h3 style={{ fontSize: '1.3rem', fontWeight: 900, marginBottom: '1.5rem' }}>Live Sessions</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1.25rem', borderRadius: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <div style={{ fontWeight: 800, fontSize: '1rem' }}>No live sessions scheduled</div>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>Schedule a new session to start</div>
                                </div>
                                <button className="btn-quantum" style={{ padding: '10px 20px', fontSize: '0.8rem' }}>
                                    <Plus size={16} style={{ marginRight: '8px' }} /> Schedule Live
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {viewMode === 'Drive' && (
                    <div className="glass-panel" style={{ padding: '2rem', borderRadius: '24px' }}>
                        <h3 style={{ fontSize: '1.3rem', fontWeight: 900, marginBottom: '1.5rem' }}>Course Materials</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1rem' }}>
                            {courses.map((course, i) => (
                                <div key={course.id || i} style={{ background: 'rgba(255,255,255,0.03)', padding: '1.25rem', borderRadius: '16px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '0.5rem' }}>
                                        <Book size={20} color="var(--primary)" />
                                        <span style={{ fontWeight: 800 }}>{course.name}</span>
                                    </div>
                                    <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>{course.modules?.length || 0} Modules</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </motion.div>
        </DashboardLayout>
    );
}