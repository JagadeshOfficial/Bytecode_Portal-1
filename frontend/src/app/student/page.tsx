"use client";

import DashboardLayout from '@/components/DashboardLayout';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { 
    BookOpen, Video, FileText, CheckCircle, 
    Briefcase, TrendingUp, Play, Clock, 
    Calendar, Award, Star, MessageSquare, X, Activity
} from 'lucide-react';

export default function StudentDashboard() {
    const [selectedTab, setSelectedTab] = useState('LEARNING');
    const [subTab, setSubTab] = useState<'COURSES' | 'LIVE' | 'ASSIGNMENTS'>('COURSES');
    
    // --- ACADEMIC STATE ---
    const [assignments, setAssignments] = useState<any[]>([]);
    const [loggedUser, setLoggedUser] = useState<any>(null);
    const [isSubmissionModalOpen, setIsSubmissionModalOpen] = useState(false);
    const [selectedAssignment, setSelectedAssignment] = useState<any>(null);
    const [submissionForm, setSubmissionForm] = useState({ url: '', remarks: '' });

    const [isSessionRequestModalOpen, setIsSessionRequestModalOpen] = useState(false);
    const [sessionRequests, setSessionRequests] = useState<any[]>([]);
    const [requestForm, setRequestForm] = useState({
        studentName: '',
        courseName: '',
        batchName: '',
        message: ''
    });
    const [selectedLiveSession, setSelectedLiveSession] = useState<any>(null);

    useEffect(() => {
        const stored = localStorage.getItem('user');
        if (stored) {
            const user = JSON.parse(stored);
            setLoggedUser(user);
            fetchStudentAssignments(user.id);
            fetchStudentRequests(user.id);
            setRequestForm(prev => ({ ...prev, studentName: user.fullName || user.name || user.email }));
        }
    }, []);

    const fetchStudentRequests = async (studentId: string) => {
        try {
            const res = await fetch(`http://localhost:8080/api/academic/session-requests`);
            if (res.ok) {
                const all = await res.json();
                setSessionRequests(all.filter((r: any) => r.requestedById === studentId));
            }
        } catch (e) {
            console.error("Failed to fetch requests:", e);
        }
    };

    const handleSessionRequestSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!loggedUser || !selectedLiveSession) return;

        const payload = {
            type: 'JOIN_SESSION',
            sessionId: selectedLiveSession.id || selectedLiveSession._id,
            requestedBy: requestForm.studentName,
            requestedById: loggedUser.id,
            data: {
                title: selectedLiveSession.title,
                courseName: requestForm.courseName,
                batchName: requestForm.batchName,
                message: requestForm.message
            },
            status: 'PENDING',
            createdAt: new Date().toISOString()
        };

        try {
            const res = await fetch('http://localhost:8080/api/academic/session-requests', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            if (res.ok) {
                const saved = await res.json();
                setSessionRequests([saved, ...sessionRequests]);
                setIsSessionRequestModalOpen(false);
                setRequestForm(prev => ({ ...prev, message: '' }));
                alert("Access request sent to Command Center. Awaiting authorization.");
            }
        } catch (e) {
            console.error(e);
        }
    };

    const fetchStudentAssignments = async (studentId: string) => {
        try {
            const bRes = await fetch(`http://localhost:8080/api/academic/batches/student/${studentId}`);
            if (!bRes.ok) return;
            const batches = await bRes.json();
            
            const allAss: any[] = [];
            for (const b of batches) {
                const aRes = await fetch(`http://localhost:8080/api/academic/assignments/batch/${b.id}`);
                if (aRes.ok) {
                    const data = await aRes.json();
                    allAss.push(...data);
                }
            }
            setAssignments(allAss);
        } catch (e) {
            console.error("Failed to sync assignments:", e);
        }
    };

    const handleSubmitAssignment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedAssignment || !loggedUser) return;

        const submission = {
            studentId: loggedUser.id,
            studentName: loggedUser.fullName || loggedUser.name || loggedUser.email,
            submittedAt: new Date().toISOString(),
            files: [submissionForm.url],
            remarks: submissionForm.remarks,
            status: 'SUBMITTED'
        };

        const updatedAssignment = {
            ...selectedAssignment,
            submissions: [...(selectedAssignment.submissions || []), submission]
        };

        try {
            const res = await fetch(`http://localhost:8080/api/academic/assignments/${selectedAssignment.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedAssignment)
            });
            if (res.ok) {
                const saved = await res.json();
                setAssignments(assignments.map(a => a.id === saved.id ? saved : a));
                setIsSubmissionModalOpen(false);
                setSubmissionForm({ url: '', remarks: '' });
                alert("Protocol Synchronized: Submission Successful.");
            }
        } catch (e) {
            console.error(e);
        }
    };

    const TABS = [
        { id: 'LEARNING', label: 'My Learning Hub', icon: <BookOpen size={18} /> },
        { id: 'REQUESTS', label: 'Session Tracking', icon: <Activity size={18} /> },
        { id: 'TESTS', label: 'Exam Node', icon: <CheckCircle size={18} /> },
        { id: 'CAREER', label: 'Career Launch', icon: <Briefcase size={18} /> },
    ];

    return (
        <DashboardLayout role="student">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                
                {/* --- STATS OVERVIEW --- */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
                    <ProgressStatCard icon={<TrendingUp color="#10b981" />} title="Overall Proficiency" value="84.2%" trend="+4.8% vs prev" color="#10b981" />
                    <ProgressStatCard icon={<Award color="#8b5cf6" />} title="Skill Points Gained" value="12,450" sub="Top 5% Learner" color="#8b5cf6" />
                    <ProgressStatCard icon={<Clock color="#3b82f6" />} title="Learning Runtime" value="128 hrs" trend="24h this week" color="#3b82f6" />
                    <ProgressStatCard icon={<Star color="#f59e0b" />} title="Project Badges" value="18" sub="Mastery Achievement" color="#f59e0b" />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '3rem' }}>
                    {/* --- SIDE TABS --- */}
                    <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: '32px', height: 'fit-content' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            {TABS.map(t => (
                                <button 
                                    key={t.id}
                                    onClick={() => setSelectedTab(t.id)}
                                    style={{ 
                                        display: 'flex', 
                                        alignItems: 'center', 
                                        gap: '12px', 
                                        padding: '12px 18px', 
                                        borderRadius: '16px', 
                                        background: selectedTab === t.id ? 'var(--primary)' : 'rgba(255,255,255,0.02)', 
                                        color: selectedTab === t.id ? '#fff' : 'var(--text-dim)', 
                                        border: '1px solid rgba(255,255,255,0.05)', 
                                        fontWeight: 800, 
                                        cursor: 'pointer',
                                        transition: 'all 0.3s'
                                    }}
                                >
                                    {t.icon} {t.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* --- TAB CONTENT --- */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        {selectedTab === 'LEARNING' && (
                            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                                {/* --- LEARNING HUB SUB-TABS --- */}
                                <div style={{ display: 'flex', gap: '20px', marginBottom: '2.5rem', background: 'rgba(255,255,255,0.02)', padding: '10px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                    {[
                                        { id: 'COURSES', label: 'Course Tracks', icon: <BookOpen size={16} /> },
                                        { id: 'LIVE', label: 'Live Classes', icon: <Video size={16} /> },
                                        { id: 'ASSIGNMENTS', label: 'Assignments', icon: <FileText size={16} /> },
                                    ].map(st => (
                                        <button 
                                            key={st.id}
                                            onClick={() => setSubTab(st.id as any)}
                                            style={{ 
                                                flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                                                padding: '10px', borderRadius: '10px', background: subTab === st.id ? 'var(--primary)' : 'transparent',
                                                color: subTab === st.id ? '#fff' : 'var(--text-dim)', border: 'none', fontWeight: 800, cursor: 'pointer', transition: 'all 0.3s'
                                            }}
                                        >
                                            {st.icon} {st.label}
                                        </button>
                                    ))}
                                </div>

                                <AnimatePresence mode="wait">
                                    {subTab === 'COURSES' && (
                                        <motion.div key="courses" initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                                            <CourseCard title="Mastering Spring Boot Microservices" progress={85} instructor="Vamsi Krishna" next="Module 12: K8s Ingress Control" />
                                            <CourseCard title="React & Next.js Performance Optimization" progress={42} instructor="Sai Kiran" next="Chapter 4: Server Components" />
                                        </motion.div>
                                    )}

                                    {subTab === 'LIVE' && (
                                        <motion.div key="live" initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                            <div className="glass-panel" style={{ padding: '2rem', borderRadius: '24px', borderLeft: '6px solid #ef4444' }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                                    <span style={{ color: '#ef4444', fontWeight: 900, fontSize: '0.7rem' }}>● BROADCASTING NOW</span>
                                                </div>
                                                <h3 style={{ fontWeight: 900 }}>Advanced K8s Deployment Patterns</h3>
                                                <p style={{ color: 'var(--text-dim)', fontSize: '0.85rem' }}>Managed by Vamsi Krishna • Starting soon (10:00 AM)</p>
                                                <button 
                                                    className="btn-quantum" 
                                                    style={{ marginTop: '1.5rem', width: '100%', padding: '12px' }}
                                                    onClick={() => {
                                                        setSelectedLiveSession({ id: 'live-1', title: 'Advanced K8s Deployment Patterns' });
                                                        setRequestForm(prev => ({ ...prev, courseName: 'Full Stack Java', batchName: 'Batch-12' }));
                                                        setIsSessionRequestModalOpen(true);
                                                    }}
                                                >
                                                    JOIN STREAM
                                                </button>
                                            </div>
                                        </motion.div>
                                    )}


                                    {subTab === 'ASSIGNMENTS' && (
                                        <motion.div key="assignments" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-panel" style={{ padding: '2.5rem', borderRadius: '32px' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                                                <h3 style={{ fontSize: '1.4rem', fontWeight: 900 }}>Active Evaluation Protocols</h3>
                                                <div style={{ padding: '8px 16px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', fontSize: '0.8rem', color: 'var(--text-dim)', fontWeight: 800 }}>{assignments.length} ASSIGNMENTS TOTAL</div>
                                            </div>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                                {assignments.map((a, idx) => {
                                                    const submission = a.submissions?.find((s: any) => s.studentId === loggedUser?.id);
                                                    const status = submission ? (submission.status || 'SUBMITTED') : 'PENDING';
                                                    const color = status === 'ACCEPTED' ? '#10b981' : status === 'REJECTED' ? '#ef4444' : status === 'SUBMITTED' ? '#3b82f6' : '#f59e0b';
                                                    
                                                    return (
                                                        <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.8rem', background: 'rgba(255,255,255,0.02)', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)', transition: 'all 0.3s hover', cursor: 'pointer' }} onClick={() => { setSelectedAssignment(a); setIsSubmissionModalOpen(true); }}>
                                                            <div style={{ flex: 1 }}>
                                                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                                                                    <div style={{ padding: '8px', borderRadius: '10px', background: `${color}15`, color }}>
                                                                        <FileText size={20} />
                                                                    </div>
                                                                    <h4 style={{ fontWeight: 900, fontSize: '1.2rem' }}>{a.title}</h4>
                                                                    <span style={{ fontSize: '0.65rem', fontWeight: 900, color, background: `${color}15`, padding: '4px 10px', borderRadius: '8px', letterSpacing: '1px' }}>{status}</span>
                                                                </div>
                                                                <p style={{ fontSize: '0.85rem', color: 'var(--text-dim)', marginBottom: '12px', opacity: 0.7 }}>{a.description}</p>
                                                                <div style={{ display: 'flex', gap: '20px', fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-dim)' }}>
                                                                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Star size={14} /> {a.difficulty} LEVEL</span>
                                                                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Clock size={14} /> {a.status}</span>
                                                                </div>
                                                            </div>
                                                            <button className="btn-quantum" style={{ padding: '12px 24px', borderRadius: '14px', border: submission ? `1px solid ${color}` : 'none', background: submission ? 'transparent' : 'var(--primary)', color: submission ? color : '#fff' }}>
                                                                {submission ? 'VIEW STATUS' : 'SUBMIT WORK'}
                                                            </button>
                                                        </div>
                                                    );
                                                })}

                                                {assignments.length === 0 && (
                                                    <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-dim)', fontSize: '0.9rem' }}>No assignments distributed at this time.</div>
                                                )}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        )}

                        {selectedTab === 'TESTS' && (
                            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                                <TestNode title="Algorithm Prototyping" type="CODING" duration="2h" status="READY" />
                                <TestNode title="React State Management" type="MCQ" duration="1h" status="LOCKED" />
                            </motion.div>
                        )}

                        {selectedTab === 'CAREER' && (
                            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                                <CareerOpportunity company="Google" role="Cloud Architect Intern" location="Remote" match="95% Sync" />
                                <CareerOpportunity company="TechCorp" role="Frontend Performance Eng" location="Hybrid" match="88% Sync" />
                            </motion.div>
                        )}
                        {selectedTab === 'REQUESTS' && (
                            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="glass-panel" style={{ padding: '2.5rem', borderRadius: '32px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                                    <h3 style={{ fontSize: '1.4rem', fontWeight: 900 }}>My Session Authorization Logs</h3>
                                    <div style={{ padding: '8px 16px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', fontSize: '0.8rem', color: 'var(--text-dim)', fontWeight: 800 }}>{sessionRequests.length} REQUESTS TOTAL</div>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                    {sessionRequests.map((r, idx) => {
                                        const color = r.status === 'APPROVED' ? '#10b981' : r.status === 'REJECTED' ? '#ef4444' : '#f59e0b';
                                        return (
                                            <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem', background: 'rgba(255,255,255,0.02)', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                                <div>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '5px' }}>
                                                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: color }} />
                                                        <h4 style={{ fontWeight: 800 }}>{r.data?.title || "Join Request"}</h4>
                                                    </div>
                                                    <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>
                                                        {r.data?.courseName} • {r.data?.batchName}
                                                    </p>
                                                    {r.data?.message && <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '5px', opacity: 0.6 }}>Note: {r.data.message}</p>}
                                                </div>
                                                <div style={{ textAlign: 'right' }}>
                                                    <div style={{ fontSize: '0.7rem', fontWeight: 900, color, background: `${color}15`, padding: '4px 12px', borderRadius: '8px', letterSpacing: '1px', marginBottom: '5px' }}>{r.status}</div>
                                                    <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>{new Date(r.createdAt).toLocaleDateString()}</div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                    {sessionRequests.length === 0 && (
                                        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-dim)', fontSize: '0.9rem' }}>No session requests initiated yet.</div>
                                    )}
                                </div>
                            </motion.div>
                        )}
                    </div>
                </div>

                {/* --- SESSION REQUEST MODAL --- */}
                <AnimatePresence>
                    {isSessionRequestModalOpen && selectedLiveSession && (
                        <div style={{ position: 'fixed', inset: 0, zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(15px)' }}>
                            <motion.div initial={{ scale: 0.95, y: 20, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }} className="glass-panel" style={{ width: '95%', maxWidth: '550px', padding: '3rem', borderRadius: '40px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2.5rem' }}>
                                    <div>
                                        <h2 style={{ fontSize: '1.8rem', fontWeight: 900 }}>Authorization Protocol</h2>
                                        <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem', marginTop: '5px' }}>Requesting access to: {selectedLiveSession.title}</p>
                                    </div>
                                    <button onClick={() => setIsSessionRequestModalOpen(false)} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '8px', borderRadius: '50%', cursor: 'pointer' }}><X size={18} /></button>
                                </div>

                                <form onSubmit={handleSessionRequestSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                    <div>
                                        <label style={{ fontSize: '0.75rem', fontWeight: 900, color: 'var(--text-dim)', textTransform: 'uppercase', marginBottom: '8px', display: 'block' }}>Student Identity</label>
                                        <input value={requestForm.studentName} onChange={e => setRequestForm({...requestForm, studentName: e.target.value})} style={inputStyle} required />
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                        <div>
                                            <label style={{ fontSize: '0.75rem', fontWeight: 900, color: 'var(--text-dim)', textTransform: 'uppercase', marginBottom: '8px', display: 'block' }}>Course Stream</label>
                                            <input value={requestForm.courseName} onChange={e => setRequestForm({...requestForm, courseName: e.target.value})} placeholder="e.g. Java Master" style={inputStyle} required />
                                        </div>
                                        <div>
                                            <label style={{ fontSize: '0.75rem', fontWeight: 900, color: 'var(--text-dim)', textTransform: 'uppercase', marginBottom: '8px', display: 'block' }}>Active Batch</label>
                                            <input value={requestForm.batchName} onChange={e => setRequestForm({...requestForm, batchName: e.target.value})} placeholder="e.g. B-24" style={inputStyle} required />
                                        </div>
                                    </div>
                                    <div>
                                        <label style={{ fontSize: '0.75rem', fontWeight: 900, color: 'var(--text-dim)', textTransform: 'uppercase', marginBottom: '8px', display: 'block' }}>Deployment Message</label>
                                        <textarea value={requestForm.message} onChange={e => setRequestForm({...requestForm, message: e.target.value})} placeholder="Why do you need to join? (Optional)" rows={3} style={{...inputStyle, resize: 'none'}} />
                                    </div>
                                    <button type="submit" className="btn-quantum" style={{ padding: '15px', borderRadius: '14px', width: '100%', marginTop: '1rem' }}>SUBMIT AUTHORIZATION REQUEST</button>
                                </form>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>

                {/* --- SUBMISSION MODAL --- */}
                <AnimatePresence>
                    {isSubmissionModalOpen && selectedAssignment && (
                        <div style={{ position: 'fixed', inset: 0, zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(15px)' }}>
                            <motion.div initial={{ scale: 0.95, y: 20, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }} className="glass-panel" style={{ width: '95%', maxWidth: '800px', padding: '4rem', borderRadius: '40px', maxHeight: '90vh', overflowY: 'auto' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '3rem' }}>
                                    <div>
                                        <h2 style={{ fontSize: '2.2rem', fontWeight: 900 }}>Submission Protocol</h2>
                                        <p style={{ color: 'var(--text-dim)', fontSize: '1rem', marginTop: '8px' }}>Project Target: {selectedAssignment.title}</p>
                                    </div>
                                    <button onClick={() => setIsSubmissionModalOpen(false)} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '10px', borderRadius: '50%', cursor: 'pointer' }}><X size={20} /></button>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '3rem' }}>
                                    <div>
                                        <h5 style={{ color: 'var(--primary)', fontWeight: 900, marginBottom: '1.5rem', textTransform: 'uppercase', fontSize: '0.8rem' }}>Instructions & Specs</h5>
                                        <div style={{ background: 'rgba(255,255,255,0.02)', padding: '2rem', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)', color: 'var(--text-dim)', lineHeight: 1.6, fontSize: '0.95rem', marginBottom: '2.5rem' }}>
                                            {selectedAssignment.instructions || "No specific instructions provided. Follow general submission guidelines."}
                                        </div>

                                        <h5 style={{ color: 'var(--primary)', fontWeight: 900, marginBottom: '1.2rem', textTransform: 'uppercase', fontSize: '0.8rem' }}>Academic Weight</h5>
                                        <div style={{ display: 'flex', gap: '15px' }}>
                                            <div style={{ flex: 1, padding: '1.5rem', background: 'rgba(0,0,0,0.2)', borderRadius: '18px', textAlign: 'center' }}>
                                                <div style={{ fontSize: '1.8rem', fontWeight: 900 }}>{selectedAssignment.totalMarks}</div>
                                                <div style={{ fontSize: '0.65rem', color: 'var(--text-dim)', fontWeight: 800 }}>MAX POINTS</div>
                                            </div>
                                            <div style={{ flex: 1, padding: '1.5rem', background: 'rgba(0,0,0,0.2)', borderRadius: '18px', textAlign: 'center' }}>
                                                <div style={{ fontSize: '1.8rem', fontWeight: 900 }}>{new Date(selectedAssignment.dueDate).toLocaleDateString('en-US', { day: '2-digit', month: 'short' })}</div>
                                                <div style={{ fontSize: '0.65rem', color: 'var(--text-dim)', fontWeight: 800 }}>DUE DATE</div>
                                            </div>
                                        </div>
                                    </div>

                                    <div style={{ background: 'rgba(124, 58, 237, 0.05)', padding: '2.5rem', borderRadius: '32px', border: '1px solid rgba(124, 58, 237, 0.2)' }}>
                                        {selectedAssignment.submissions?.find((s: any) => s.studentId === loggedUser?.id) ? (
                                            <div style={{ textAlign: 'center' }}>
                                                <div style={{ width: '64px', height: '64px', background: '#10b981', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                                                    <CheckCircle size={32} color="#000" />
                                                </div>
                                                <h3 style={{ fontWeight: 900, marginBottom: '1rem' }}>Success Synchronized</h3>
                                                <p style={{ fontSize: '0.85rem', color: 'var(--text-dim)', lineHeight: 1.6 }}>Your work has been uploaded and is awaiting instructor audit.</p>
                                                <div style={{ marginTop: '2rem', padding: '1.5rem', background: 'rgba(0,0,0,0.2)', borderRadius: '16px', textAlign: 'left' }}>
                                                    <div style={{ fontSize: '0.7rem', fontWeight: 900, color: '#10b981', marginBottom: '8px' }}>LATEST FEEDBACK</div>
                                                    <p style={{ fontSize: '0.8rem', color: '#fff' }}>{selectedAssignment.submissions?.find((s: any) => s.studentId === loggedUser?.id)?.feedback || "Awaiting grading..."}</p>
                                                </div>
                                            </div>
                                        ) : (
                                            <form onSubmit={handleSubmitAssignment} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                                <label style={{ fontSize: '0.75rem', fontWeight: 900, color: '#fff' }}>ATTACH ARTIFACT URL</label>
                                                <input value={submissionForm.url} onChange={(e) => setSubmissionForm({...submissionForm, url: e.target.value})} placeholder="https://github.com/your-repo" style={inputStyle} required />
                                                
                                                <label style={{ fontSize: '0.75rem', fontWeight: 900, color: '#fff' }}>DEVELOPER NOTES</label>
                                                <textarea value={submissionForm.remarks} onChange={(e) => setSubmissionForm({...submissionForm, remarks: e.target.value})} placeholder="Notes for the instructor..." rows={4} style={{...inputStyle, resize: 'none'}} />
                                                
                                                <button type="submit" className="btn-quantum" style={{ padding: '15px', borderRadius: '100px', marginTop: '1rem' }}>UPLOAD PROTOCOL</button>
                                            </form>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>
            </motion.div>
        </DashboardLayout>
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
    fontFamily: 'inherit',
    fontSize: '0.95rem'
};

function ProgressStatCard({ icon, title, value, trend, sub, color }: any) {
    return (
        <div className="glass-panel" style={{ padding: '1.75rem', borderRadius: '24px', borderLeft: `6px solid ${color}` }}>
             <div style={{ color, marginBottom: '0.75rem' }}>{icon}</div>
             <div style={{ fontSize: '0.7rem', fontWeight: 900, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '2px' }}>{title}</div>
             <div style={{ fontSize: '2.2rem', fontWeight: 900, margin: '5px 0' }}>{value}</div>
             <div style={{ fontSize: '0.75rem', fontWeight: 800, color: trend ? '#10b981' : 'var(--text-dim)' }}>{trend || sub}</div>
        </div>
    );
}

function CourseCard({ title, progress, instructor, next }: any) {
    return (
        <div className="glass-panel" style={{ padding: '2.5rem', borderRadius: '32px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2.5rem' }}>
                <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: '1.6rem', fontWeight: 900, marginBottom: '0.5rem' }}>{title}</h3>
                    <div style={{ fontSize: '0.9rem', color: 'var(--text-dim)', fontWeight: 800 }}>Lead Instructor: {instructor}</div>
                </div>
                <button className="btn-quantum" style={{ padding: '12px 24px', borderRadius: '14px' }}><Play size={18} style={{ marginRight: '8px' }} /> RESUME SYNC</button>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '0.8rem', fontWeight: 900 }}>
                <span style={{ color: 'var(--text-dim)' }}>SYNC PROGRESS</span>
                <span>{progress}%</span>
            </div>
            <div style={{ height: '8px', background: 'rgba(255,255,255,0.03)', borderRadius: '100px', overflow: 'hidden', marginBottom: '1.5rem' }}>
                <div style={{ height: '100%', width: `${progress}%`, background: 'var(--primary)', boxShadow: '0 0 10px var(--primary)', borderRadius: '100px' }} />
            </div>

            <div style={{ padding: '1.25rem', background: 'rgba(255,255,255,0.02)', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '15px' }}>
                <Calendar size={18} color="var(--primary)" />
                <div style={{ fontSize: '0.9rem', fontWeight: 800 }}>NEXT NODE: <span style={{ color: 'var(--text-dim)' }}>{next}</span></div>
            </div>
        </div>
    );
}

function TaskRow({ title, deadline, status, color }: any) {
    return (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem', background: 'rgba(255,255,255,0.015)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.03)' }}>
            <div>
                <div style={{ fontWeight: 800, fontSize: '1.1rem' }}>{title}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontWeight: 800 }}>DEADLINE: {deadline}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.7rem', fontWeight: 900, color, letterSpacing: '1px', background: `${color}15`, padding: '5px 14px', borderRadius: '100px' }}>{status}</div>
            </div>
        </div>
    );
}

function TestNode({ title, type, duration, status }: any) {
    return (
        <div className="glass-panel" style={{ padding: '2rem', borderRadius: '24px', borderLeft: status === 'READY' ? '6px solid #10b981' : '6px solid rgba(255,255,255,0.05)' }}>
            <div style={{ fontSize: '0.65rem', fontWeight: 900, color: 'var(--text-dim)', textTransform: 'uppercase', marginBottom: '10px' }}>Assessment Cluster</div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 900, marginBottom: '1.5rem' }}>{title}</h3>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-dim)' }}>{type} • {duration}</div>
                <button disabled={status === 'LOCKED'} style={{ padding: '8px 16px', borderRadius: '8px', background: status === 'READY' ? 'var(--primary)' : 'rgba(255,255,255,0.03)', color: '#fff', border: 'none', fontWeight: 900, cursor: status === 'READY' ? 'pointer' : 'default' }}>{status === 'READY' ? 'INITIATE' : 'LOCKED'}</button>
            </div>
        </div>
    );
}

function CareerOpportunity({ company, role, location, match }: any) {
    return (
        <div className="glass-panel" style={{ padding: '2rem', borderRadius: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
                <div style={{ fontSize: '0.7rem', fontWeight: 900, color: '#10b981', letterSpacing: '1px', marginBottom: '8px' }}>TARGET CLUSTER: {match}</div>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 900 }}>{company} • {role}</h3>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-dim)', fontWeight: 800, marginTop: '5px' }}>{location} Access Node</div>
            </div>
            <button style={{ padding: '12px 24px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', color: '#fff', fontWeight: 900, cursor: 'pointer' }}>APPLY NOW</button>
        </div>
    );
}
