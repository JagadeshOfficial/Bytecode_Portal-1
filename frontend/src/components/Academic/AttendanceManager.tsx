import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Users, Calendar, CheckCircle2, XCircle, Clock, AlertCircle, 
    Search, ChevronRight, Save, History, UserCheck, UserX,
    Layout, Filter, Download, MoreHorizontal, Zap
} from 'lucide-react';

const API_BASE = 'http://localhost:8080/api';

interface StudentRecord {
    student: string;
    fullName: string;
    profileImage?: string;
    email: string;
    status: 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED';
    remark: string;
}

interface Batch {
    id: string;
    name: string;
    courseId?: string;
}

export default function AttendanceManager() {
    const [batches, setBatches] = useState<Batch[]>([]);
    const [selectedBatch, setSelectedBatch] = useState<string>('');
    const [students, setStudents] = useState<StudentRecord[]>([]);
    const [trainerStatus, setTrainerStatus] = useState<'PRESENT' | 'ABSENT'>('PRESENT');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [sessionType, setSessionType] = useState('LECTURE');
    const [sessionTopic, setSessionTopic] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [view, setView] = useState<'MARK' | 'HISTORY'>('MARK');
    const [history, setHistory] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchBatches();
    }, []);

    useEffect(() => {
        if (selectedBatch) {
            fetchStudents(selectedBatch);
            fetchHistory(selectedBatch);
        }
    }, [selectedBatch]);

    const fetchBatches = async () => {
        try {
            const res = await fetch(`${API_BASE}/academic/batches`);
            const data = await res.json();
            setBatches(data);
            if (data.length > 0 && !selectedBatch) setSelectedBatch(data[0].id);
        } catch (err) {
            console.error('Failed to fetch batches:', err);
        }
    };

    const fetchStudents = async (batchId: string) => {
        setIsLoading(true);
        try {
            // We fetch students from the academic tracking endpoint or similar
            const res = await fetch(`${API_BASE}/academic/batches/${batchId}/student-tracking`);
            const data = await res.json();
            const mapped: StudentRecord[] = data.map((s: any) => ({
                student: s.id,
                fullName: s.name,
                email: s.email,
                status: 'PRESENT',
                remark: ''
            }));
            setStudents(mapped);
        } catch (err) {
            console.error('Failed to fetch students:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchHistory = async (batchId: string) => {
        try {
            const res = await fetch(`${API_BASE}/attendance/batch/${batchId}`);
            const data = await res.json();
            setHistory(data);
        } catch (err) {
            console.error('History fetch failed:', err);
        }
    };

    const updateStatus = (studentId: string, status: any) => {
        setStudents(prev => prev.map(s => s.student === studentId ? { ...s, status } : s));
    };

    const submitAttendance = async () => {
        setIsLoading(true);
        try {
            const res = await fetch(`${API_BASE}/attendance`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    date,
                    batch: selectedBatch,
                    trainer: '670355f653139366df022a16', // Mock Current Trainer for now
                    trainerStatus,
                    records: students,
                    sessionType,
                    sessionTopic
                })
            });
            if (res.ok) {
                alert('Attendance synchronized successfully.');
                fetchHistory(selectedBatch);
            }
        } catch (err) {
            console.error('Submit failed:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const filteredStudents = students.filter(s => 
        s.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || 
        s.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div style={{ minHeight: '100vh', background: '#f8fafc', padding: '40px' }}>
            {/* TOP BAR */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '40px' }}>
                <div>
                    <h1 style={{ fontSize: '2.4rem', fontWeight: 900, color: '#1e1b4b', letterSpacing: '-1.5px' }}>Attendance Nexus</h1>
                    <p style={{ color: '#64748b', fontWeight: 600, fontSize: '1rem' }}>Organizational presence governance & analytical ledger.</p>
                </div>
                
                <div style={{ display: 'flex', gap: '15px' }}>
                    <motion.button 
                        whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                        onClick={() => setView('MARK')}
                        style={{ padding: '12px 24px', borderRadius: '16px', background: view === 'MARK' ? '#6d28d9' : '#fff', color: view === 'MARK' ? '#fff' : '#1e1b4b', border: 'none', fontWeight: 800, fontSize: '0.9rem', cursor: 'pointer', boxShadow: view === 'MARK' ? '0 10px 20px rgba(109, 40, 217, 0.2)' : '0 4px 6px rgba(0,0,0,0.02)' }}
                    >
                        Mark Presence
                    </motion.button>
                    <motion.button 
                        whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                        onClick={() => setView('HISTORY')}
                        style={{ padding: '12px 24px', borderRadius: '16px', background: view === 'HISTORY' ? '#6d28d9' : '#fff', color: view === 'HISTORY' ? '#fff' : '#1e1b4b', border: 'none', fontWeight: 800, fontSize: '0.9rem', cursor: 'pointer', boxShadow: view === 'HISTORY' ? '0 10px 20px rgba(109, 40, 217, 0.2)' : '0 4px 6px rgba(0,0,0,0.02)' }}
                    >
                        History Ledger
                    </motion.button>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '30px' }}>
                {/* CONFIG CONTROLS */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <div style={{ background: '#fff', padding: '30px', borderRadius: '32px', boxShadow: '0 10px 40px rgba(0,0,0,0.03)', border: '1px solid rgba(109,40,217,0.05)' }}>
                        <h4 style={{ fontSize: '0.75rem', fontWeight: 900, color: '#6d28d9', letterSpacing: '1.5px', marginBottom: '24px', textTransform: 'uppercase' }}>Configuration</h4>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#64748b', marginBottom: '8px' }}>Select Hub (Batch)</label>
                                <select 
                                    value={selectedBatch} 
                                    onChange={(e) => setSelectedBatch(e.target.value)}
                                    style={{ width: '100%', padding: '14px', borderRadius: '16px', background: '#f8fafc', border: '1px solid #e2e8f0', fontWeight: 700, fontSize: '0.9rem', outline: 'none' }}
                                >
                                    {batches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                                </select>
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#64748b', marginBottom: '8px' }}>Engagement Date</label>
                                <input 
                                    type="date" 
                                    value={date} 
                                    onChange={(e) => setDate(e.target.value)}
                                    style={{ width: '100%', padding: '14px', borderRadius: '16px', background: '#f8fafc', border: '1px solid #e2e8f0', fontWeight: 700, fontSize: '0.9rem', outline: 'none' }}
                                />
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#64748b', marginBottom: '8px' }}>Session Type</label>
                                <select 
                                    value={sessionType}
                                    onChange={(e) => setSessionType(e.target.value)}
                                    style={{ width: '100%', padding: '14px', borderRadius: '16px', background: '#f8fafc', border: '1px solid #e2e8f0', fontWeight: 700, fontSize: '0.9rem', outline: 'none' }}
                                >
                                    <option value="LECTURE">Lecture</option>
                                    <option value="PRACTICAL">Practical Hub</option>
                                    <option value="EXAM">Examination</option>
                                    <option value="WORKSHOP">Workshop</option>
                                </select>
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#64748b', marginBottom: '8px' }}>Active Topic</label>
                                <input 
                                    placeholder="Enter session focus..." 
                                    value={sessionTopic}
                                    onChange={(e) => setSessionTopic(e.target.value)}
                                    style={{ width: '100%', padding: '14px', borderRadius: '16px', background: '#f8fafc', border: '1px solid #e2e8f0', fontWeight: 700, fontSize: '0.9rem', outline: 'none' }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* TRAINER STATUS */}
                    <div style={{ background: '#fff', padding: '30px', borderRadius: '32px', boxShadow: '0 10px 40px rgba(0,0,0,0.03)', border: '1px solid rgba(109,40,217,0.05)' }}>
                        <h4 style={{ fontSize: '0.75rem', fontWeight: 900, color: '#6d28d9', letterSpacing: '1.5px', marginBottom: '20px', textTransform: 'uppercase' }}>Trainer Presence</h4>
                        
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <motion.button 
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setTrainerStatus('PRESENT')}
                                style={{ flex: 1, padding: '12px', borderRadius: '14px', background: trainerStatus === 'PRESENT' ? '#dcfce7' : '#f8fafc', color: trainerStatus === 'PRESENT' ? '#166534' : '#64748b', border: 'none', fontWeight: 800, fontSize: '0.8rem', cursor: 'pointer' }}
                            >
                                PRESENT
                            </motion.button>
                            <motion.button 
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setTrainerStatus('ABSENT')}
                                style={{ flex: 1, padding: '12px', borderRadius: '14px', background: trainerStatus === 'ABSENT' ? '#fee2e2' : '#f8fafc', color: trainerStatus === 'ABSENT' ? '#991b1b' : '#64748b', border: 'none', fontWeight: 800, fontSize: '0.8rem', cursor: 'pointer' }}
                            >
                                ABSENT
                            </motion.button>
                        </div>
                    </div>
                </div>

                {/* MAIN CONTENT HUB */}
                <div style={{ background: '#fff', borderRadius: '40px', padding: '40px', boxShadow: '0 20px 60px rgba(0,0,0,0.05)', border: '1px solid rgba(109,40,217,0.05)', overflow: 'hidden' }}>
                    <AnimatePresence mode="wait">
                        {view === 'MARK' ? (
                            <motion.div key="mark" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px', background: '#f8fafc', padding: '10px 24px', borderRadius: '100px', flex: 1, maxWidth: '400px' }}>
                                        <Search size={18} color="#94a3b8" />
                                        <input 
                                            placeholder="Audit roster by name..." 
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            style={{ background: 'none', border: 'none', padding: '10px 0', fontSize: '1rem', fontWeight: 600, outline: 'none', width: '100%' }} 
                                        />
                                    </div>
                                    <div style={{ display: 'flex', gap: '12px' }}>
                                        <div style={{ textAlign: 'right' }}>
                                            <p style={{ fontSize: '0.7rem', fontWeight: 800, color: '#94a3b8', letterSpacing: '1px' }}>HUB ROSTER</p>
                                            <p style={{ fontSize: '1.1rem', fontWeight: 900 }}>{filteredStudents.length} Students</p>
                                        </div>
                                    </div>
                                </div>

                                <div style={{ maxHeight: '600px', overflowY: 'auto', paddingRight: '10px' }}>
                                    <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 12px' }}>
                                        <thead>
                                            <tr style={{ textAlign: 'left' }}>
                                                <th style={{ padding: '0 20px', fontSize: '0.75rem', fontWeight: 900, color: '#94a3b8', letterSpacing: '1px' }}>STUDENT IDENTITY</th>
                                                <th style={{ padding: '0 20px', fontSize: '0.75rem', fontWeight: 900, color: '#94a3b8', letterSpacing: '1px' }}>PRESENCE STATUS</th>
                                                <th style={{ padding: '0 20px', fontSize: '0.75rem', fontWeight: 900, color: '#94a3b8', letterSpacing: '1px' }}>REMARKS</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredStudents.map((s) => (
                                                <tr key={s.student} style={{ background: '#fff', boxShadow: '0 4px 15px rgba(0,0,0,0.02)', borderRadius: '20px' }}>
                                                    <td style={{ padding: '20px', borderRadius: '20px 0 0 20px' }}>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                                            <div style={{ width: 44, height: 44, borderRadius: '14px', background: 'linear-gradient(135deg, #f5f3ff, #ede9fe)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                                                                <Users size={18} color="#6d28d9" />
                                                            </div>
                                                            <div>
                                                                <p style={{ fontSize: '0.95rem', fontWeight: 900, color: '#1e1b4b' }}>{s.fullName}</p>
                                                                <p style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600 }}>{s.email}</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td style={{ padding: '20px' }}>
                                                        <div style={{ display: 'flex', gap: '8px' }}>
                                                            <motion.button 
                                                                onClick={() => updateStatus(s.student, 'PRESENT')}
                                                                whileTap={{ scale: 0.9 }}
                                                                style={{ width: 40, height: 40, borderRadius: '12px', background: s.status === 'PRESENT' ? '#dcfce7' : '#f8fafc', color: s.status === 'PRESENT' ? '#10b981' : '#cbd5e1', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                                                title="Present"
                                                            >
                                                                <CheckCircle2 size={20} />
                                                            </motion.button>
                                                            <motion.button 
                                                                onClick={() => updateStatus(s.student, 'ABSENT')}
                                                                whileTap={{ scale: 0.9 }}
                                                                style={{ width: 40, height: 40, borderRadius: '12px', background: s.status === 'ABSENT' ? '#fee2e2' : '#f8fafc', color: s.status === 'ABSENT' ? '#ef4444' : '#cbd5e1', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                                                title="Absent"
                                                            >
                                                                <XCircle size={20} />
                                                            </motion.button>
                                                            <motion.button 
                                                                onClick={() => updateStatus(s.student, 'LATE')}
                                                                whileTap={{ scale: 0.9 }}
                                                                style={{ width: 40, height: 40, borderRadius: '12px', background: s.status === 'LATE' ? '#fef9c3' : '#f8fafc', color: s.status === 'LATE' ? '#ca8a04' : '#cbd5e1', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                                                title="Late"
                                                            >
                                                                <Clock size={20} />
                                                            </motion.button>
                                                        </div>
                                                    </td>
                                                    <td style={{ padding: '20px', borderRadius: '0 20px 20px 0' }}>
                                                        <input 
                                                            placeholder="Add remark..." 
                                                            style={{ background: '#f8fafc', border: '1px solid #e2e8f0', padding: '10px 16px', borderRadius: '12px', fontSize: '0.85rem', fontWeight: 600, width: '100%' }} 
                                                        />
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                <motion.button 
                                    whileHover={{ scale: 1.02, y: -2 }} whileTap={{ scale: 0.98 }}
                                    onClick={submitAttendance}
                                    disabled={isLoading}
                                    style={{ width: '100%', marginTop: '30px', padding: '24px', borderRadius: '24px', background: 'linear-gradient(135deg, #6d28d9, #4f46e5)', color: '#fff', border: 'none', fontWeight: 900, fontSize: '1.1rem', cursor: 'pointer', boxShadow: '0 20px 40px rgba(109, 40, 217, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '15px' }}
                                >
                                    {isLoading ? 'SYNCING...' : <>SYNCHRONIZE PRESENCE DIRECTORY <Save size={20} /></>}
                                </motion.button>
                            </motion.div>
                        ) : (
                            <motion.div key="history" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                                <div style={{ marginBottom: '32px' }}>
                                    <h3 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#1e1b4b' }}>Engagement History</h3>
                                    <p style={{ color: '#64748b', fontWeight: 600 }}>Historical analytical data for {batches.find(b => b.id === selectedBatch)?.name}</p>
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                    {history.map((record, idx) => (
                                        <div key={record._id} style={{ padding: '24px', background: '#f8fafc', borderRadius: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid #e2e8f0' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                                                <div style={{ width: 50, height: 50, borderRadius: '16px', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '1.2rem', color: '#6d28d9' }}>
                                                    {new Date(record.date).getDate()}
                                                </div>
                                                <div>
                                                    <p style={{ fontSize: '0.95rem', fontWeight: 900, color: '#1e1b4b' }}>{new Date(record.date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
                                                    <p style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 700 }}>{record.sessionType} • {record.sessionTopic || 'Unspecified Topic'}</p>
                                                </div>
                                            </div>
                                            <div style={{ textAlign: 'right' }}>
                                                <p style={{ fontSize: '1.1rem', fontWeight: 900, color: '#10b981' }}>{record.records.filter((r:any) => r.status === 'PRESENT').length} / {record.records.length} Present</p>
                                                <p style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>Trainer: {record.trainerStatus}</p>
                                            </div>
                                        </div>
                                    ))}
                                    {history.length === 0 && (
                                        <div style={{ padding: '60px', textAlign: 'center' }}>
                                            <History size={48} color="#e2e8f0" style={{ margin: '0 auto 20px' }} />
                                            <p style={{ color: '#94a3b8', fontWeight: 700 }}>No attendance records found for this unit.</p>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}

