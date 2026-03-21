"use client";

import DashboardLayout from '@/components/DashboardLayout';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { 
    Book, Plus, Search, Edit2, Trash2, 
    Layers, Users, Clock, User, BookOpen, 
    ChevronRight, ChevronLeft, Folder, File,
    Download, Upload, Eye, MoreVertical
} from 'lucide-react';

export default function AcademicHub() {
    const [viewMode, setViewMode] = useState<'COURSES' | 'BATCHES' | 'DETAILS'>('COURSES');
    const [courses, setCourses] = useState<any[]>([]);
    const [batches, setBatches] = useState<any[]>([]);
    const [allUsers, setAllUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    
    const [selectedCourse, setSelectedCourse] = useState<any>(null);
    const [selectedBatch, setSelectedBatch] = useState<any>(null);

    const [searchTerm, setSearchTerm] = useState('');

    const fetchData = async () => {
        setLoading(true);
        try {
            const [cRes, bRes, uRes] = await Promise.all([
                fetch('http://localhost:8081/api/courses'),
                fetch('http://localhost:8089/api/academic/batches'),
                fetch('http://localhost:8082/api/users')
            ]);
            
            const cData = await cRes.json();
            const bData = await bRes.json();
            const uData = await uRes.json();

            if (Array.isArray(cData)) setCourses(cData);
            if (Array.isArray(bData)) setBatches(bData);
            if (Array.isArray(uData)) setAllUsers(uData);
        } catch (err) {
            console.error(err);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleCourseClick = (course: any) => {
        setSelectedCourse(course);
        setViewMode('BATCHES');
    };

    const handleBatchClick = (batch: any) => {
        setSelectedBatch(batch);
        setViewMode('DETAILS');
    };

    const goBack = () => {
        if (viewMode === 'DETAILS') setViewMode('BATCHES');
        else if (viewMode === 'BATCHES') setViewMode('COURSES');
    };

    const filteredBatches = batches.filter(b => b.courseId === selectedCourse?.id);
    const tutor = allUsers.find(u => u.id === selectedBatch?.trainerId);
    
    // Mock students for the batch (in a real app, you'd fetch them by batchId)
    const students = allUsers.filter(u => u.role === 'STUDENT').slice(0, 15);

    return (
        <DashboardLayout role="super_admin">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ paddingBottom: '5rem' }}>
                
                {/* --- NAVIGATION BREADCRUMBS --- */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '2rem', fontSize: '0.9rem', fontWeight: 600 }}>
                    <span onClick={() => setViewMode('COURSES')} style={{ cursor: 'pointer', color: viewMode === 'COURSES' ? 'var(--primary)' : 'var(--text-dim)' }}>Courses</span>
                    {viewMode !== 'COURSES' && (
                        <>
                            <ChevronRight size={14} color="var(--text-dim)" />
                            <span onClick={() => setViewMode('BATCHES')} style={{ cursor: 'pointer', color: viewMode === 'BATCHES' ? 'var(--primary)' : 'var(--text-dim)' }}>{selectedCourse?.title}</span>
                        </>
                    )}
                    {viewMode === 'DETAILS' && (
                        <>
                            <ChevronRight size={14} color="var(--text-dim)" />
                            <span style={{ color: 'var(--primary)' }}>{selectedBatch?.name}</span>
                        </>
                    )}
                </div>

                {/* --- HEADER --- */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem' }}>
                    <div>
                        <h1 style={{ fontSize: '2.8rem', fontWeight: 900, letterSpacing: '-1.5px' }}>
                            {viewMode === 'COURSES' ? 'Academic Hub' : viewMode === 'BATCHES' ? 'Select Batch' : 'Batch Workspace'}
                        </h1>
                        <p style={{ color: 'var(--text-dim)', fontSize: '1.2rem' }}>
                            {viewMode === 'COURSES' ? 'Browse all available curriculum and modules.' : viewMode === 'BATCHES' ? `Explore active cohorts for ${selectedCourse?.title}.` : `Managing resources for ${selectedBatch?.name}.`}
                        </p>
                    </div>
                    {viewMode !== 'COURSES' && (
                        <button onClick={goBack} style={{ background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', padding: '12px 24px', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 900, cursor: 'pointer' }}>
                            <ChevronLeft size={18} /> BACK
                        </button>
                    )}
                </div>

                <AnimatePresence mode="wait">
                    {/* --- COURSES GRID --- */}
                    {viewMode === 'COURSES' && (
                        <motion.div 
                            key="courses"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem' }}
                        >
                            {courses.map((c, i) => (
                                <CourseCard key={c.id || i} course={c} onClick={() => handleCourseClick(c)} delay={i * 0.05} />
                            ))}
                        </motion.div>
                    )}

                    {/* --- BATCHES LIST --- */}
                    {viewMode === 'BATCHES' && (
                        <motion.div 
                            key="batches"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem' }}
                        >
                            {filteredBatches.length > 0 ? filteredBatches.map((b, i) => (
                                <BatchCard key={b.id || i} batch={b} onClick={() => handleBatchClick(b)} delay={i * 0.05} />
                            )) : (
                                <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '5rem', background: 'rgba(255,255,255,0.02)', borderRadius: '32px' }}>
                                    <Layers size={48} color="var(--text-dim)" style={{ marginBottom: '1rem' }} />
                                    <p style={{ color: 'var(--text-dim)', fontSize: '1.1rem', fontWeight: 800 }}>No active batches for this course.</p>
                                </div>
                            )}
                        </motion.div>
                    )}

                    {/* --- DETAILS WORKSPACE --- */}
                    {viewMode === 'DETAILS' && (
                        <motion.div 
                            key="details"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.05 }}
                            style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '2.5rem' }}
                        >
                            {/* --- LEFT COLUMN: RESOURCES & FILES --- */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
                                <div className="glass-panel" style={{ padding: '2.5rem', borderRadius: '40px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                                        <h3 style={{ fontSize: '1.4rem', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            <Folder color="var(--primary)" /> Learning Resources
                                        </h3>
                                        <button className="btn-quantum" style={{ padding: '10px 20px', fontSize: '0.8rem' }}><Upload size={16} /> UPLOAD FILE</button>
                                    </div>

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                        <FileItem name="Java_Core_Introduction.pdf" type="pdf" size="2.4 MB" date="Mar 20, 2024" />
                                        <FileItem name="Spring_Security_Deep_Dive.mp4" type="video" size="145 MB" date="Mar 19, 2024" />
                                        <FileItem name="Database_Schema_v2.sql" type="code" size="45 KB" date="Mar 18, 2024" />
                                        <FileItem name="Class_Notes_Session_12.docx" type="doc" size="1.1 MB" date="Mar 17, 2024" />
                                    </div>
                                </div>

                                <div className="glass-panel" style={{ padding: '2.5rem', borderRadius: '40px' }}>
                                    <h3 style={{ fontSize: '1.4rem', fontWeight: 900, marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <Layers color="var(--secondary)" /> Batch Modules
                                    </h3>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                         <ModuleStep label="Introduction" status="COMPLETED" />
                                         <ModuleStep label="Advanced Concepts" status="IN PROGRESS" />
                                         <ModuleStep label="Final Project" status="PENDING" />
                                         <ModuleStep label="Certification" status="PENDING" />
                                    </div>
                                </div>
                            </div>

                            {/* --- RIGHT COLUMN: STAFF & STUDENTS --- */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
                                {/* --- TUTOR CARD --- */}
                                <div className="glass-panel" style={{ padding: '2.5rem', borderRadius: '40px', background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.1), transparent)' }}>
                                    <h3 style={{ fontSize: '1.2rem', fontWeight: 900, color: 'var(--primary)', marginBottom: '1.5rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Assigned Tutor</h3>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                                        <div style={{ width: '70px', height: '70px', borderRadius: '20px', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '1.8rem', fontWeight: 900 }}>
                                            {tutor?.fullName?.charAt(0) || 'T'}
                                        </div>
                                        <div>
                                            <div style={{ fontSize: '1.3rem', fontWeight: 900 }}>{tutor?.fullName || 'Pending Assignment'}</div>
                                            <div style={{ fontSize: '0.9rem', color: 'var(--text-dim)' }}>{tutor?.email || 'trainer@bytecode.com'}</div>
                                        </div>
                                    </div>
                                </div>

                                {/* --- STUDENTS LIST --- */}
                                <div className="glass-panel" style={{ padding: '2.5rem', borderRadius: '40px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                                        <h3 style={{ fontSize: '1.2rem', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <Users size={20} color="var(--secondary)" /> Enrolled Students
                                        </h3>
                                        <span style={{ fontSize: '0.9rem', fontWeight: 900, background: 'rgba(255,255,255,0.05)', padding: '5px 12px', borderRadius: '100px' }}>{students.length} Total</span>
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '400px', overflowY: 'auto', paddingRight: '10px' }}>
                                        {students.map((s, idx) => (
                                            <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                    <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 800 }}>{s.fullName.charAt(0)}</div>
                                                    <div>
                                                        <div style={{ fontSize: '0.9rem', fontWeight: 800 }}>{s.fullName}</div>
                                                        <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>{s.email}</div>
                                                    </div>
                                                </div>
                                                <div style={{ color: '#10b981' }}><CheckCircle size={16} /></div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </DashboardLayout>
    );
}

function CourseCard({ course, onClick, delay }: any) {
    return (
        <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay }}
            onClick={onClick}
            className="glass-panel" 
            style={{ 
                padding: '2.5rem', 
                borderRadius: '32px', 
                cursor: 'pointer', 
                border: '1px solid rgba(255,255,255,0.05)',
                position: 'relative',
                overflow: 'hidden'
            }}
            whileHover={{ y: -5, background: 'rgba(255,255,255,0.06)' }}
        >
            <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '100px', height: '100px', background: 'var(--primary)', opacity: 0.1, borderRadius: '50%', filter: 'blur(30px)' }} />
            <Book size={32} color="var(--primary)" style={{ marginBottom: '1.5rem' }} />
            <h3 style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: '0.75rem' }}>{course.title}</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-dim)', lineHeight: 1.6, marginBottom: '2rem' }}>{course.description}</p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1.5rem' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 900, color: 'var(--text-dim)' }}>{course.duration}</span>
                <span style={{ color: 'var(--primary)', fontWeight: 900, fontSize: '0.85rem', display: 'flex', alignItems: 'center' }}>VIEW BATCHES <ChevronRight size={16} /></span>
            </div>
        </motion.div>
    );
}

function BatchCard({ batch, onClick, delay }: any) {
    return (
        <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay }}
            onClick={onClick}
            className="glass-panel" 
            style={{ padding: '2.5rem', borderRadius: '32px', cursor: 'pointer', border: '1px solid rgba(255,255,255,0.05)' }}
            whileHover={{ y: -5 }}
        >
            <Layers size={32} color="var(--secondary)" style={{ marginBottom: '1.5rem' }} />
            <h3 style={{ fontSize: '1.4rem', fontWeight: 900, marginBottom: '0.5rem' }}>{batch.name}</h3>
            <div style={{ display: 'flex', gap: '15px', color: 'var(--text-dim)', fontSize: '0.8rem', fontWeight: 700, marginBottom: '1.5rem' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><Clock size={14} /> {batch.startTime}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><Calendar size={14} /> {batch.startDate}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Users size={18} color="var(--secondary)" />
                    <span style={{ fontSize: '0.85rem', fontWeight: 900 }}>45 Students</span>
                </div>
                <ChevronRight size={20} color="var(--primary)" />
            </div>
        </motion.div>
    );
}

function FileItem({ name, type, size, date }: any) {
    return (
        <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1.25rem', borderRadius: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid rgba(255,255,255,0.03)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                <div style={{ padding: '10px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', color: 'var(--primary)' }}>
                    {type === 'pdf' ? <File size={20} /> : type === 'video' ? <Play size={20} /> : <FileText size={20} />}
                </div>
                <div>
                    <div style={{ fontSize: '0.95rem', fontWeight: 800 }}>{name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>{size} • Uploaded on {date}</div>
                </div>
            </div>
            <button style={{ background: 'none', border: 'none', color: 'var(--text-dim)', cursor: 'pointer' }}><Download size={18} /></button>
        </div>
    );
}

function ModuleStep({ label, status }: any) {
    return (
        <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1.5rem', borderRadius: '20px', textAlign: 'center' }}>
            <div style={{ fontSize: '0.65rem', fontWeight: 800, color: status === 'COMPLETED' ? '#10b981' : status === 'IN PROGRESS' ? 'var(--secondary)' : 'var(--text-dim)', marginBottom: '5px' }}>{status}</div>
            <div style={{ fontSize: '0.9rem', fontWeight: 900 }}>{label}</div>
        </div>
    );
}
