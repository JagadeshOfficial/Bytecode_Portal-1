"use client";

import DashboardLayout from '@/components/DashboardLayout';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { 
    Book, Plus, Search, Edit2, Trash2, 
    CheckCircle, XCircle, Filter, 
    Layers, Layout, Cpu, Globe, Rocket
} from 'lucide-react';

export default function ModuleManagement() {
    const [courses, setCourses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState<any>(null);
    const [formData, setFormData] = useState({ title: '', description: '', duration: '', price: 0, active: true });
    const [notification, setNotification] = useState<{ message: string, type: 'success' | 'error' } | null>(null);

    const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 4000);
    };

    const fetchCourses = () => {
        setLoading(true);
        fetch('http://localhost:8080/api/courses')
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) setCourses(data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchCourses();
    }, []);

    const handleOpenModal = (course: any = null) => {
        if (course) {
            setSelectedCourse(course);
            setFormData({ 
                title: course.title || '', 
                description: course.description || '', 
                duration: course.duration || '', 
                price: course.price || 0,
                active: course.active !== undefined ? course.active : true 
            });
        } else {
            setSelectedCourse(null);
            setFormData({ title: '', description: '', duration: '', price: 0, active: true });
        }
        setIsModalOpen(true);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        const url = selectedCourse 
            ? `http://localhost:8080/api/courses/${selectedCourse.id}` 
            : 'http://localhost:8080/api/courses';
        const method = selectedCourse ? 'PUT' : 'POST';

        try {
            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            if (res.ok) {
                setIsModalOpen(false);
                fetchCourses();
                showNotification(selectedCourse ? 'Course updated successfully!' : 'New course added successfully!');
            } else {
                showNotification('Error saving course.', 'error');
            }
        } catch (err) {
            console.error(err);
            showNotification('Server connection failed.', 'error');
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this course?')) return;
        try {
            const res = await fetch(`http://localhost:8080/api/courses/${id}`, { method: 'DELETE' });
            if (res.ok) {
                fetchCourses();
                showNotification('Course deleted successfully.');
            }
        } catch (err) {
            console.error(err);
        }
    };

    const filteredCourses = courses.filter(c => 
        c.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
        c.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <DashboardLayout role="super_admin">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                    <div>
                        <h1 style={{ fontSize: '2.5rem', fontWeight: 900, letterSpacing: '-1px' }}>Course Management</h1>
                        <p style={{ color: 'var(--text-dim)', fontSize: '1.1rem' }}>Create and manage learning modules for your students.</p>
                    </div>
                    <motion.button onClick={() => handleOpenModal()} className="btn-quantum" style={{ padding: '14px 28px' }}>
                        <Plus size={18} style={{ marginRight: '8px' }} /> ADD NEW COURSE
                    </motion.button>
                </div>

                <div style={{ display: 'flex', gap: '1rem', marginBottom: '2.5rem' }}>
                    <div style={{ flex: 1, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px', padding: '0 1rem', display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <Search size={20} color="var(--text-dim)" />
                        <input type="text" placeholder="Search courses..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={{ width: '100%', background: 'none', border: 'none', padding: '1.25rem 0', color: 'var(--text-bright)', outline: 'none' }} />
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '2rem' }}>
                    {loading ? (
                        <p style={{ gridColumn: '1/-1', textAlign: 'center', padding: '4rem', fontWeight: 800 }}>LOADING COURSES...</p>
                    ) : filteredCourses.map((c, i) => (
                        <motion.div 
                            key={c.id || i} 
                            initial={{ opacity: 0, scale: 0.95 }} 
                            animate={{ opacity: 1, scale: 1 }} 
                            transition={{ delay: i * 0.05 }}
                            className="glass-panel" 
                            style={{ padding: '2rem', borderRadius: '24px', display: 'flex', flexDirection: 'column', gap: '1.5rem', border: '1px solid rgba(255,255,255,0.05)' }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div style={{ padding: '10px', borderRadius: '12px', background: 'rgba(124, 58, 237, 0.1)', color: 'var(--primary)' }}>
                                    <Book size={24} />
                                </div>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <ActionButton icon={<Edit2 size={16} />} onClick={() => handleOpenModal(c)} />
                                    <ActionButton icon={<Trash2 size={16} />} color="#ef4444" onClick={() => handleDelete(c.id)} />
                                </div>
                            </div>
                            <div>
                                <h3 style={{ fontSize: '1.25rem', fontWeight: 900, marginBottom: '0.5rem' }}>{c.title}</h3>
                                <p style={{ fontSize: '0.85rem', color: 'var(--text-dim)', lineHeight: 1.6, minHeight: '3rem' }}>{c.description}</p>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1.5rem' }}>
                                <div>
                                    <div style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--text-dim)', textTransform: 'uppercase' }}>Duration</div>
                                    <div style={{ fontSize: '0.9rem', fontWeight: 900 }}>{c.duration}</div>
                                </div>
                                <div>
                                    <div style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--text-dim)', textTransform: 'uppercase' }}>Status</div>
                                    <div style={{ fontSize: '0.9rem', fontWeight: 900, color: '#10b981' }}>Active</div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </motion.div>

            {/* --- MODULE MODAL --- */}
            <AnimatePresence>
                {isModalOpen && (
                    <div style={{ position: 'fixed', inset: 0, zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(12px)' }}>
                        <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="glass-panel" style={{ width: '90%', maxWidth: '600px', padding: '3rem', borderRadius: '40px' }}>
                            <h2 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '2rem' }}>{selectedCourse ? 'Edit Course' : 'Add New Course'}</h2>
                            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    <label style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-dim)' }}>COURSE TITLE</label>
                                    <input value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} placeholder="e.g. Full Stack Java" style={inputStyle} />
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    <label style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-dim)' }}>DESCRIPTION</label>
                                    <textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} placeholder="Course details..." style={{ ...inputStyle, minHeight: '120px', resize: 'none' }} />
                                </div>
                                <div style={{ display: 'flex', gap: '1.5rem' }}>
                                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                        <label style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-dim)' }}>DURATION</label>
                                        <input value={formData.duration} onChange={(e) => setFormData({...formData, duration: e.target.value})} placeholder="3 Months" style={inputStyle} />
                                    </div>
                                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                        <label style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-dim)' }}>PRICE</label>
                                        <input type="number" value={formData.price} onChange={(e) => setFormData({...formData, price: parseInt(e.target.value)})} placeholder="0.00" style={inputStyle} />
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                                    <button type="button" onClick={() => setIsModalOpen(false)} style={{ flex: 1, padding: '14px', borderRadius: '16px', background: 'rgba(255,255,255,0.05)', color: '#fff', border: 'none', fontWeight: 800, cursor: 'pointer' }}>CANCEL</button>
                                    <button type="submit" className="btn-quantum" style={{ flex: 2, padding: '14px', borderRadius: '16px', fontWeight: 800 }}>{selectedCourse ? 'UPDATE COURSE' : 'SAVE COURSE'}</button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* --- NOTIFICATION TOAST --- */}
            <AnimatePresence>
                {notification && (
                    <motion.div 
                        initial={{ opacity: 0, y: 50, x: '-50%' }}
                        animate={{ opacity: 1, y: 0, x: '-50%' }}
                        exit={{ opacity: 0, y: 20, x: '-50%' }}
                        style={{ 
                            position: 'fixed', 
                            bottom: '2rem', 
                            left: '50%', 
                            transform: 'translateX(-50%)',
                            zIndex: 10001,
                            background: notification.type === 'success' ? 'rgba(16, 185, 129, 0.95)' : 'rgba(239, 68, 68, 0.95)',
                            color: '#fff',
                            padding: '12px 24px',
                            borderRadius: '12px',
                            fontWeight: 800,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
                            backdropFilter: 'blur(10px)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            fontSize: '0.85rem'
                        }}
                    >
                        {notification.type === 'success' ? <CheckCircle size={18} /> : <XCircle size={18} />}
                        {notification.message}
                    </motion.div>
                )}
            </AnimatePresence>
        </DashboardLayout>
    );
}

function ActionButton({ icon, color, onClick }: any) {
    return (
        <button onClick={onClick} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', color: color || 'var(--text-bright)', padding: '10px', borderRadius: '12px', cursor: 'pointer' }}>{icon}</button>
    );
}

const inputStyle = {
    padding: '14px 18px',
    borderRadius: '16px',
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.1)',
    color: '#fff',
    outline: 'none',
    width: '100%',
    fontFamily: 'inherit'
};
