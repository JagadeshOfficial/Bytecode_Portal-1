"use client";

import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FolderPlus, FilePlus, ChevronRight, Folder, FileText, Video,
    MoreHorizontal, Calendar, Clock, Users, Plus, PlayCircle,
    Download, Trash2, Edit3, ChevronDown, Check, UploadCloud
} from 'lucide-react';
import { useState } from 'react';
import styles from '../../Admin.module.css';

// Mock Data for a Single Course
const COURSE_DETAILS = {
    id: 'CRS-001',
    title: 'Full Stack Java Development',
    category: 'Development',
    modules: [
        {
            id: 'MOD-1', title: 'Introduction to Java', type: 'folder', isOpen: true,
            items: [
                { id: 'FILE-1', title: 'Setup Environment Variables', type: 'video', duration: '12:40' },
                { id: 'FILE-2', title: 'JDK Installation Guide', type: 'doc', size: '2.4 MB' }
            ]
        },
        {
            id: 'MOD-2', title: 'OOPs Concepts', type: 'folder', isOpen: false,
            items: [
                { id: 'FILE-3', title: 'Classes & Objects', type: 'video', duration: '45:10' }
            ]
        }
    ],
    batches: [
        { id: 'B-001', name: 'Weekend Batch A', start: 'Oct 12, 2024', time: '10:00 AM - 01:00 PM', instructor: 'Sarah Connor', students: 24, status: 'Active' },
        { id: 'B-002', name: 'Weekday Morning', start: 'Nov 01, 2024', time: '07:00 AM - 09:00 AM', instructor: 'Mike Ross', students: 0, status: 'Upcoming' }
    ]
};

export default function CoursemanagePage({ params }: { params: { courseId: string } }) {
    const [activeTab, setActiveTab] = useState('curriculum');
    const [modules, setModules] = useState(COURSE_DETAILS.modules);
    const [batches, setBatches] = useState(COURSE_DETAILS.batches);

    // Modals State
    const [isFolderModalOpen, setIsFolderModalOpen] = useState(false);
    const [isBatchModalOpen, setIsBatchModalOpen] = useState(false);
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [newFolderName, setNewFolderName] = useState('');
    const [newBatch, setNewBatch] = useState({ name: '', start: '', time: '', instructor: '' });
    const [uploadConfig, setUploadConfig] = useState({ moduleId: '', files: [] as File[] });

    const toggleFolder = (id: string) => {
        setModules(modules.map(m => m.id === id ? { ...m, isOpen: !m.isOpen } : m));
    };

    const handleCreateFolder = () => {
        if (!newFolderName) return;
        const newModule = {
            id: `MOD-${Date.now()}`,
            title: newFolderName,
            type: 'folder',
            isOpen: true,
            items: []
        };
        // @ts-ignore
        setModules([...modules, newModule]);
        setNewFolderName('');
        setIsFolderModalOpen(false);
    };

    const handleCreateBatch = () => {
        const newB = {
            id: `B-${Date.now()}`,
            ...newBatch,
            students: 0,
            status: 'Upcoming'
        };
        setBatches([...batches, newB]);
        setNewBatch({ name: '', start: '', time: '', instructor: '' });
        setIsBatchModalOpen(false);
    };

    return (
        <DashboardLayout role="admin">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={styles.container}>

                {/* Header with Breadcrumbs */}
                <div style={{ marginBottom: '2rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#94a3b8', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                        <span>Courses</span> <ChevronRight size={14} /> <span style={{ color: '#f8fafc' }}>{COURSE_DETAILS.title}</span>
                    </div>
                    <div className={styles.glassHeader} style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <h2 style={{ fontSize: '1.8rem', color: 'white', fontWeight: 700, margin: 0 }}>{COURSE_DETAILS.title}</h2>
                            <p style={{ color: '#94a3b8', marginTop: '0.4rem' }}>Manage curriculum, uploads, and batches</p>
                        </div>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <button onClick={() => setIsUploadModalOpen(true)} className={styles.viewScheduleBtn} style={{ marginTop: 0, width: 'auto', background: 'rgba(16, 185, 129, 0.2)', border: '1px solid rgba(16, 185, 129, 0.4)', color: '#34d399' }}>
                                <UploadCloud size={18} style={{ marginRight: '0.5rem' }} /> Add Content
                            </button>
                            <button onClick={() => setIsFolderModalOpen(true)} className={styles.viewScheduleBtn} style={{ marginTop: 0, width: 'auto', background: 'rgba(59, 130, 246, 0.2)', border: '1px solid rgba(59, 130, 246, 0.4)', color: '#60a5fa' }}>
                                <FolderPlus size={18} style={{ marginRight: '0.5rem' }} /> New Folder
                            </button>
                            <button onClick={() => setIsBatchModalOpen(true)} className={styles.viewScheduleBtn} style={{ marginTop: 0, width: 'auto' }}>
                                <Plus size={18} style={{ marginRight: '0.5rem' }} /> Create Batch
                            </button>
                        </div>
                    </div>
                </div>

                {/* Navigation Tabs */}
                <div style={{ display: 'flex', gap: '2rem', borderBottom: '1px solid rgba(255,255,255,0.1)', marginBottom: '2rem' }}>
                    {['curriculum', 'batches', 'students', 'settings'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            style={{
                                padding: '1rem 0', background: 'none', border: 'none',
                                color: activeTab === tab ? '#818cf8' : '#64748b',
                                borderBottom: activeTab === tab ? '2px solid #818cf8' : '2px solid transparent',
                                cursor: 'pointer', fontWeight: 500, textTransform: 'capitalize'
                            }}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* CONTENT AREA */}
                {activeTab === 'curriculum' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {modules.map((module) => (
                            <motion.div
                                key={module.id}
                                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                                className={styles.glassPanel}
                                style={{ padding: '0', overflow: 'hidden' }}
                            >
                                <div
                                    onClick={() => toggleFolder(module.id)}
                                    style={{
                                        padding: '1rem 1.5rem', background: 'rgba(255,255,255,0.03)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer',
                                        borderBottom: module.isOpen ? '1px solid rgba(255,255,255,0.05)' : 'none'
                                    }}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                        <div style={{ padding: '6px', borderRadius: '4px', background: 'rgba(124, 58, 237, 0.15)', color: '#a78bfa' }}>
                                            <Folder size={18} />
                                        </div>
                                        <h4 style={{ margin: 0, color: 'white', fontWeight: 500 }}>{module.title}</h4>
                                        <span style={{ fontSize: '0.8rem', color: '#64748b', background: 'rgba(0,0,0,0.2)', padding: '2px 8px', borderRadius: '4px' }}>
                                            {module.items.length} items
                                        </span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                        <button className={styles.iconBtn} style={{ width: '32px', height: '32px' }}><Plus size={16} /></button>
                                        <button className={styles.iconBtn} style={{ width: '32px', height: '32px' }}><Edit3 size={16} /></button>
                                        <ChevronDown size={20} color="#64748b" style={{ transform: module.isOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: '0.3s' }} />
                                    </div>
                                </div>

                                <AnimatePresence>
                                    {module.isOpen && (
                                        <motion.div
                                            initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }}
                                            style={{ overflow: 'hidden' }}
                                        >
                                            {module.items.length === 0 ? (
                                                <div style={{ padding: '2rem', textAlign: 'center', color: '#64748b', fontSize: '0.9rem', fontStyle: 'italic' }}>
                                                    This folder is empty. Click + to upload content.
                                                </div>
                                            ) : (
                                                <div>
                                                    {module.items.map((item) => (
                                                        <div key={item.id} style={{
                                                            padding: '0.8rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                                            borderBottom: '1px solid rgba(255,255,255,0.02)', paddingLeft: '4rem'
                                                        }}>
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                                                {item.type === 'video' ? <Video size={16} color="#38bdf8" /> : <FileText size={16} color="#fbbf24" />}
                                                                <span style={{ color: '#cbd5e1', fontSize: '0.9rem' }}>{item.title}</span>
                                                            </div>
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', fontSize: '0.8rem', color: '#64748b' }}>
                                                                <span>{item.type === 'video' ? item.duration : item.size}</span>
                                                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                                    <PlayCircle size={16} style={{ cursor: 'pointer', color: '#94a3b8' }} />
                                                                    <Trash2 size={16} style={{ cursor: 'pointer', color: '#ef4444' }} />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        ))}
                    </div>
                )}

                {/* BATCHES TAB */}
                {activeTab === 'batches' && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }}>
                        {batches.map((batch) => (
                            <motion.div key={batch.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className={styles.glassPanel} style={{ padding: '1.5rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                    <div style={{ padding: '0.5rem', borderRadius: '8px', background: 'rgba(16, 185, 129, 0.1)', color: '#34d399' }}>
                                        <Users size={20} />
                                    </div>
                                    <span style={{
                                        padding: '4px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 600,
                                        background: batch.status === 'Active' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(234, 179, 8, 0.1)',
                                        color: batch.status === 'Active' ? '#22c55e' : '#eab308'
                                    }}>
                                        {batch.status}
                                    </span>
                                </div>
                                <h3 style={{ fontSize: '1.2rem', color: 'white', marginBottom: '0.5rem' }}>{batch.name}</h3>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', marginTop: '1rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', fontSize: '0.9rem', color: '#94a3b8' }}>
                                        <Calendar size={16} color="#818cf8" /> Ends on {batch.start}
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', fontSize: '0.9rem', color: '#94a3b8' }}>
                                        <Clock size={16} color="#f472b6" /> {batch.time}
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', fontSize: '0.9rem', color: '#94a3b8' }}>
                                        <Users size={16} color="#fbbf24" /> {batch.instructor}
                                    </div>
                                </div>
                                <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ fontSize: '0.85rem', color: '#cbd5e1' }}><strong>{batch.students}</strong> Students</span>
                                    <button style={{ background: 'none', border: 'none', color: '#60a5fa', cursor: 'pointer', fontSize: '0.85rem' }}>Manage Batch →</button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}

                {/* CREATE FOLDER MODAL */}
                <AnimatePresence>
                    {isFolderModalOpen && (
                        <>
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', zIndex: 100 }}
                                onClick={() => setIsFolderModalOpen(false)} />
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9, x: '-50%', y: '-45%' }} animate={{ opacity: 1, scale: 1, x: '-50%', y: '-50%' }} exit={{ opacity: 0, scale: 0.9, x: '-50%', y: '-45%' }}
                                style={{ position: 'fixed', top: '50%', left: '50%', background: '#0f172a', padding: '2rem', borderRadius: '1rem', width: '400px', zIndex: 101, border: '1px solid rgba(255,255,255,0.1)' }}>
                                <h3 style={{ marginTop: 0, color: 'white' }}>Create New Folder</h3>
                                <input type="text" autoFocus placeholder="e.g. Section 1: Basics"
                                    className={styles.searchInput} style={{ width: '100%', marginTop: '1rem', borderRadius: '0.5rem' }}
                                    value={newFolderName} onChange={e => setNewFolderName(e.target.value)} />
                                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '1.5rem' }}>
                                    <button onClick={() => setIsFolderModalOpen(false)} style={{ padding: '0.6rem 1rem', borderRadius: '0.5rem', background: 'transparent', color: '#94a3b8', border: 'none', cursor: 'pointer' }}>Cancel</button>
                                    <button onClick={handleCreateFolder} style={{ padding: '0.6rem 1.2rem', borderRadius: '0.5rem', background: '#3b82f6', color: 'white', border: 'none', cursor: 'pointer' }}>Create</button>
                                </div>
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>

                {/* CREATE BATCH MODAL */}
                <AnimatePresence>
                    {isBatchModalOpen && (
                        <>
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', zIndex: 100 }}
                                onClick={() => setIsBatchModalOpen(false)} />
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9, x: '-50%', y: '-45%' }} animate={{ opacity: 1, scale: 1, x: '-50%', y: '-50%' }} exit={{ opacity: 0, scale: 0.9, x: '-50%', y: '-45%' }}
                                style={{ position: 'fixed', top: '50%', left: '50%', background: '#0f172a', padding: '2rem', borderRadius: '1rem', width: '500px', zIndex: 101, border: '1px solid rgba(255,255,255,0.1)' }}>
                                <h3 style={{ marginTop: 0, color: 'white' }}>Schedule New Batch</h3>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
                                    <input type="text" placeholder="Batch Name (e.g. Morning Batch)" className={styles.searchInput} style={{ borderRadius: '0.5rem' }}
                                        value={newBatch.name} onChange={e => setNewBatch({ ...newBatch, name: e.target.value })} />
                                    <input type="text" placeholder="Start Date" className={styles.searchInput} style={{ borderRadius: '0.5rem' }}
                                        value={newBatch.start} onChange={e => setNewBatch({ ...newBatch, start: e.target.value })} />
                                    <input type="text" placeholder="Timings (e.g. 10 AM - 12 PM)" className={styles.searchInput} style={{ borderRadius: '0.5rem' }}
                                        value={newBatch.time} onChange={e => setNewBatch({ ...newBatch, time: e.target.value })} />
                                    <input type="text" placeholder="Instructor Name" className={styles.searchInput} style={{ borderRadius: '0.5rem' }}
                                        value={newBatch.instructor} onChange={e => setNewBatch({ ...newBatch, instructor: e.target.value })} />
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '1.5rem' }}>
                                    <button onClick={() => setIsBatchModalOpen(false)} style={{ padding: '0.6rem 1rem', borderRadius: '0.5rem', background: 'transparent', color: '#94a3b8', border: 'none', cursor: 'pointer' }}>Cancel</button>
                                    <button onClick={handleCreateBatch} style={{ padding: '0.6rem 1.2rem', borderRadius: '0.5rem', background: '#10b981', color: 'white', border: 'none', cursor: 'pointer' }}>Schedule Batch</button>
                                </div>
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>

                {/* UPLOAD CONTENT MODAL */}
                <AnimatePresence>
                    {isUploadModalOpen && (
                        <>
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', zIndex: 100 }}
                                onClick={() => setIsUploadModalOpen(false)} />
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9, x: '-50%', y: '-45%' }} animate={{ opacity: 1, scale: 1, x: '-50%', y: '-50%' }} exit={{ opacity: 0, scale: 0.9, x: '-50%', y: '-45%' }}
                                style={{ position: 'fixed', top: '50%', left: '50%', background: '#0f172a', padding: '2rem', borderRadius: '1rem', width: '500px', zIndex: 101, border: '1px solid rgba(255,255,255,0.1)' }}>
                                <h3 style={{ marginTop: 0, color: 'white' }}>Upload Course Content</h3>

                                <div style={{ marginTop: '1.5rem' }}>
                                    <label style={{ display: 'block', fontSize: '0.85rem', color: '#94a3b8', marginBottom: '0.5rem' }}>Select Folder</label>
                                    <select
                                        className={styles.searchInput}
                                        style={{ width: '100%', borderRadius: '0.5rem' }}
                                        value={uploadConfig.moduleId}
                                        onChange={(e) => setUploadConfig({ ...uploadConfig, moduleId: e.target.value })}
                                    >
                                        <option value="">-- Choose a Module --</option>
                                        {modules.map(m => (
                                            <option key={m.id} value={m.id}>{m.title}</option>
                                        ))}
                                    </select>
                                </div>

                                <div
                                    style={{ marginTop: '1.5rem', border: '2px dashed rgba(255,255,255,0.1)', borderRadius: '0.75rem', padding: '2rem', textAlign: 'center', cursor: 'pointer', background: 'rgba(255,255,255,0.02)' }}
                                    className="upload-zone"
                                >
                                    <input type="file" multiple id="content-upload" style={{ display: 'none' }} onChange={(e) => {
                                        if (e.target.files) setUploadConfig({ ...uploadConfig, files: Array.from(e.target.files) });
                                    }} />
                                    <label htmlFor="content-upload" style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                                        <UploadCloud size={32} color="#6366f1" />
                                        <span style={{ fontSize: '0.9rem', color: '#e2e8f0', fontWeight: 500 }}>
                                            {uploadConfig.files.length > 0 ? `${uploadConfig.files.length} files selected` : "Click to upload files"}
                                        </span>
                                        <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Video, PDF, Assignments</span>
                                    </label>
                                </div>

                                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '2rem' }}>
                                    <button onClick={() => setIsUploadModalOpen(false)} style={{ padding: '0.6rem 1rem', borderRadius: '0.5rem', background: 'transparent', color: '#94a3b8', border: 'none', cursor: 'pointer' }}>Cancel</button>
                                    <button onClick={() => {
                                        if (!uploadConfig.moduleId || uploadConfig.files.length === 0) return alert('Please select a folder and files');
                                        // Mock upload logic
                                        const updatedModules = modules.map(m => {
                                            if (m.id === uploadConfig.moduleId) {
                                                const newItems = uploadConfig.files.map((f, i) => ({
                                                    id: `FILE-${Date.now()}-${i}`,
                                                    title: f.name,
                                                    type: f.type.includes('video') ? 'video' : 'doc',
                                                    duration: '00:00', // Mock
                                                    size: `${(f.size / 1024 / 1024).toFixed(2)} MB`
                                                }));
                                                return { ...m, items: [...m.items, ...newItems] };
                                            }
                                            return m;
                                        });
                                        // @ts-ignore
                                        setModules(updatedModules);
                                        setUploadConfig({ moduleId: '', files: [] });
                                        setIsUploadModalOpen(false);
                                        alert('Content uploaded successfully!');
                                    }} style={{ padding: '0.6rem 1.2rem', borderRadius: '0.5rem', background: '#3b82f6', color: 'white', border: 'none', cursor: 'pointer' }}>Upload</button>
                                </div>
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>

            </motion.div>
        </DashboardLayout>
    );
}
