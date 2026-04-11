"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Users, Video, BarChart2, Calendar, 
    Plus, Search, Filter, MoreVertical, 
    CheckCircle, Clock, Zap, Target, 
    Shield, Activity, Bot, Mic, 
    Monitor, Brain, Clipboard, UserPlus,
    X, ChevronRight, ChevronLeft, Flag,
    Edit2, Trash2, Copy, Play, Check
} from 'lucide-react';

// --- STYLES & ACCENTS ---
const glassStyle = {
    background: 'rgba(255, 255, 255, 0.7)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(0, 0, 0, 0.05)',
    borderRadius: '24px',
    boxShadow: '0 20px 40px rgba(0,0,0,0.05)',
};

// --- MOCK DATA ---
const INITIAL_STATS = [
    { label: 'Total Interviews', value: 128, change: '+12%', icon: <Video size={20} /> },
    { label: 'Avg AI Score', value: '84%', change: '+5%', icon: <Brain size={20} /> },
    { label: 'Suspicious Activities', value: 3, change: '-20%', icon: <Shield size={20} /> },
    { label: 'Success Rate', value: '68%', change: '+8%', icon: <Target size={20} /> },
];

export default function MockInterviewEngine() {
    const [subView, setSubView] = useState<'DASHBOARD' | 'LIVE_MONITOR' | 'ANALYTICS' | 'AI_ROOM'>('DASHBOARD');
    const [isWizardOpen, setIsWizardOpen] = useState(false);
    const [wizardStep, setWizardStep] = useState(1);
    
    // Data states
    const [interviews, setInterviews] = useState<any[]>([]);
    const [courses, setCourses] = useState<any[]>([]);
    const [batches, setBatches] = useState<any[]>([]);
    const [allUsers, setAllUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const [isEditing, setIsEditing] = useState(false);
    const [selectedInterviewId, setSelectedInterviewId] = useState<string | null>(null);

    // Form state
    const [newInterview, setNewInterview] = useState({
        title: '',
        description: '',
        type: 'TECHNICAL',
        difficulty: 'MEDIUM',
        courseId: '',
        courseName: '',
        batchId: '',
        batchName: '',
        candidateType: 'ALL', // 'ALL' or 'SPECIFIC'
        candidateIds: [] as string[],
        interviewerId: '',
        interviewerName: '',
        interviewerRole: '',
        mode: 'AI', // 'AI', 'HUMAN', 'HYBRID'
        date: '',
        startTime: '',
        duration: 30,
        settings: {
            faceDetection: true,
            eyeTracking: true,
            tabBlocker: true,
            noiseAnalysis: true
        }
    });

    const fetchAllData = async () => {
        setLoading(true);
        try {
            const [intRes, courRes, batchRes, userRes] = await Promise.all([
                fetch('http://localhost:8080/api/academic/mock-interviews'),
                fetch('http://localhost:8080/api/courses'),
                fetch('http://localhost:8080/api/academic/batches'),
                fetch('http://localhost:8080/api/users')
            ]);
            
            if (intRes.ok) setInterviews(await intRes.json());
            if (courRes.ok) setCourses(await courRes.json());
            if (batchRes.ok) setBatches(await batchRes.json());
            if (userRes.ok) setAllUsers(await userRes.json());
        } catch (err) {
            console.error("Failed to fetch interview data:", err);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchAllData();
    }, []);

    const handleCreateInterview = async () => {
        try {
            const method = isEditing ? 'PUT' : 'POST';
            const url = isEditing 
                ? `http://localhost:8080/api/academic/mock-interviews/${selectedInterviewId}` 
                : 'http://localhost:8080/api/academic/mock-interviews';

            const res = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newInterview)
            });
            if (res.ok) {
                const saved = await res.json();
                if (isEditing) {
                    setInterviews(interviews.map(i => (i.id === selectedInterviewId || i._id === selectedInterviewId) ? saved : i));
                } else {
                    setInterviews([saved, ...interviews]);
                }
                setIsWizardOpen(false);
                setIsEditing(false);
                setWizardStep(1);
                alert(isEditing ? "Interview Updated!" : "Mock Interview Scheduled Successfully!");
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleDeleteInterview = async (id: string) => {
        if (!confirm("Are you sure?")) return;
        try {
            const res = await fetch(`http://localhost:8080/api/academic/mock-interviews/${id}`, { method: 'DELETE' });
            if (res.ok) {
                setInterviews(interviews.filter(i => i.id !== id && i._id !== id));
            }
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div style={{ padding: '0 0.5rem' }}>
            {/* --- TOP SUB-NAV --- */}
            <div style={{ display: 'flex', gap: '15px', marginBottom: '3rem' }}>
                <button onClick={() => setSubView('DASHBOARD')} style={subView === 'DASHBOARD' ? activeBtnStyle : inactiveBtnStyle}>
                    <Monitor size={16} /> DASHBOARD
                </button>
                <button onClick={() => setSubView('LIVE_MONITOR')} style={subView === 'LIVE_MONITOR' ? activeBtnStyle : inactiveBtnStyle}>
                    <Activity size={16} /> LIVE MONITOR
                </button>
                <button onClick={() => setSubView('AI_ROOM')} style={subView === 'AI_ROOM' ? activeBtnStyle : inactiveBtnStyle}>
                    <Bot size={16} /> AI ROOM
                </button>
                <button onClick={() => setSubView('ANALYTICS')} style={subView === 'ANALYTICS' ? activeBtnStyle : inactiveBtnStyle}>
                    <BarChart2 size={16} /> ANALYTICS
                </button>
                <div style={{ flex: 1 }} />
                <button onClick={() => { setIsEditing(false); setNewInterview({ ...newInterview, title: '', description: '', date: '', startTime: '' }); setIsWizardOpen(true); }} className="btn-quantum" style={{ padding: '12px 24px', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Plus size={18} /> CREATE INTERVIEW
                </button>
            </div>

            {/* --- CONTENT AREA --- */}
            <AnimatePresence mode="wait">
                {subView === 'DASHBOARD' && (
                    <motion.div key="dash" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -20 }}>
                        {/* Stats Cards */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
                            {INITIAL_STATS.map((stat, i) => (
                                <div key={i} style={{ ...glassStyle, padding: '2rem' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                                        <div style={{ padding: 0, color: 'var(--primary)' }}>{stat.icon}</div>
                                        <span style={{ fontSize: '0.75rem', fontWeight: 900, color: stat.change.startsWith('+') ? '#10b981' : '#ef4444' }}>{stat.change}</span>
                                    </div>
                                    <h3 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '0.2rem', color: '#111' }}>{stat.value}</h3>
                                    <p style={{ fontSize: '0.8rem', fontWeight: 600, color: '#666', textTransform: 'uppercase', letterSpacing: '1px' }}>{stat.label}</p>
                                </div>
                            ))}
                        </div>

                        {/* Interview Grid */}
                        {loading ? (
                            <div style={{ textAlign: 'center', padding: '5rem' }}>Loading Interview Feed...</div>
                        ) : (
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: '2rem' }}>
                                {interviews.length === 0 ? (
                                    <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '5rem', background: 'rgba(0,0,0,0.02)', borderRadius: '32px' }}>
                                        <Video size={48} style={{ opacity: 0.1, marginBottom: '1rem' }} />
                                        <p style={{ fontWeight: 800, color: '#666' }}>No mock interviews scheduled yet.</p>
                                    </div>
                                ) : (
                                    interviews.map((item) => (
                                        <InterviewCard 
                                            key={item.id || item._id} 
                                            data={item} 
                                            onDelete={() => handleDeleteInterview(item.id || item._id)} 
                                            onEdit={() => {
                                                setNewInterview(item);
                                                setSelectedInterviewId(item.id || item._id);
                                                setIsEditing(true);
                                                setIsWizardOpen(true);
                                                setWizardStep(1);
                                            }}
                                            onJoin={() => { setSelectedInterviewId(item.id || item._id); setSubView('AI_ROOM'); }}
                                            onReports={() => { setSelectedInterviewId(item.id || item._id); setSubView('ANALYTICS'); }}
                                        />
                                    ))
                                )}
                            </div>
                        )}
                    </motion.div>
                )}

                {subView === 'LIVE_MONITOR' && (
                    <motion.div key="live" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -20 }}>
                        <LiveMonitoringView />
                    </motion.div>
                )}

                {subView === 'AI_ROOM' && (
                    <motion.div key="ai" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -20 }}>
                        <AIRoomView />
                    </motion.div>
                )}

                {subView === 'ANALYTICS' && (
                    <motion.div key="analysis" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -20 }}>
                        <div style={{ ...glassStyle, padding: '4rem', textAlign: 'center' }}>
                            <BarChart2 size={48} style={{ opacity: 0.2, marginBottom: '1rem' }} />
                            <h2 style={{ color: '#111' }}>Advanced Analytics Engine</h2>
                            <p style={{ color: '#666' }}>Detailed insights and performance trends are being calculated...</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* --- CREATION WIZARD MODAL --- */}
            <AnimatePresence>
                {isWizardOpen && (
                    <div style={modalOverlayStyle}>
                        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} style={modalContentStyle}>
                            <div style={{ padding: '2rem', borderBottom: '1px solid rgba(0,0,0,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fff' }}>
                                <div>
                                    <h2 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#111' }}>Mock Interview Scheduler</h2>
                                    <p style={{ fontSize: '0.8rem', color: '#666' }}>Step {wizardStep} of 8: {getStepTitle(wizardStep)}</p>
                                </div>
                                <button onClick={() => setIsWizardOpen(false)} style={{ background: 'none', border: 'none', color: '#666', cursor: 'pointer' }}><X size={24} /></button>
                            </div>

                            <div style={{ padding: '2.5rem', flex: 1, overflowY: 'auto', background: '#fefefe' }}>
                                {wizardStep === 1 && <BasicInfoStep data={newInterview} setData={setNewInterview} />}
                                {wizardStep === 2 && <CourseSelector data={newInterview} setData={setNewInterview} courses={courses} />}
                                {wizardStep === 3 && <BatchSelector data={newInterview} setData={setNewInterview} batches={batches} />}
                                {wizardStep === 4 && <CandidateSelector data={newInterview} setData={setNewInterview} allUsers={allUsers} selectedBatch={batches.find(b => b.id === newInterview.batchId || b._id === newInterview.batchId)} />}
                                {wizardStep === 5 && <InterviewerSelector data={newInterview} setData={setNewInterview} allUsers={allUsers} />}
                                {wizardStep === 6 && <ModeSelector data={newInterview} setData={setNewInterview} />}
                                {wizardStep === 7 && <ScheduleStep data={newInterview} setData={setNewInterview} />}
                                {wizardStep === 8 && <ReviewStep data={newInterview} />}
                            </div>

                            <div style={{ padding: '1.5rem 2rem', background: '#fff', borderTop: '1px solid rgba(0,0,0,0.05)', display: 'flex', justifyContent: 'space-between' }}>
                                <button 
                                    onClick={() => setWizardStep(prev => Math.max(1, prev - 1))} 
                                    style={{ ...secondaryBtnStyle, padding: '12px 30px' }}
                                    disabled={wizardStep === 1}
                                >
                                    BACK
                                </button>
                                <button 
                                    onClick={() => wizardStep === 8 ? handleCreateInterview() : setWizardStep(prev => prev + 1)} 
                                    className="btn-quantum" 
                                    style={{ padding: '12px 40px', borderRadius: '14px', background: 'var(--primary)', color: '#fff', fontWeight: 900 }}
                                >
                                    {wizardStep === 8 ? (isEditing ? 'UPDATE INTERVIEW' : 'SCHEDULE INTERVIEW') : 'NEXT STEP'}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}

// --- WIZARD STEPS COMPONENTS ---

function BasicInfoStep({ data, setData }: any) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div style={inputGroupStyle}>
                <label style={labelStyleWizard}>INTERVIEW TITLE</label>
                <input 
                    value={data.title} 
                    onChange={e => setData({...data, title: e.target.value})}
                    placeholder="e.g. Java Backend Developer Mock" 
                    style={wizardInputStyle} 
                />
            </div>
            <div style={inputGroupStyle}>
                <label style={labelStyleWizard}>DESCRIPTION</label>
                <textarea 
                    value={data.description}
                    onChange={e => setData({...data, description: e.target.value})}
                    rows={3} 
                    placeholder="Focus areas, expectations..." 
                    style={{ ...wizardInputStyle, resize: 'none' }} 
                />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <div style={inputGroupStyle}>
                    <label style={labelStyleWizard}>TYPE</label>
                    <select value={data.type} onChange={e => setData({...data, type: e.target.value})} style={wizardInputStyle}>
                        <option value="TECHNICAL">Technical Interview</option>
                        <option value="HR">HR / Behavioral</option>
                        <option value="CODING">Coding Assessment</option>
                        <option value="SYSTEM_DESIGN">System Design</option>
                    </select>
                </div>
                <div style={inputGroupStyle}>
                    <label style={labelStyleWizard}>DIFFICULTY</label>
                    <select value={data.difficulty} onChange={e => setData({...data, difficulty: e.target.value})} style={wizardInputStyle}>
                        <option value="EASY">Easy</option>
                        <option value="MEDIUM">Medium</option>
                        <option value="HARD">Hard</option>
                        <option value="EXPERT">Expert</option>
                    </select>
                </div>
            </div>
        </div>
    );
}

function CourseSelector({ data, setData, courses }: any) {
    return (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1.5rem' }}>
            {courses.map((c: any) => (
                <div 
                    key={c.id || c._id} 
                    onClick={() => setData({...data, courseId: c.id || c._id, courseName: c.title})}
                    style={{ 
                        ...glassStyle, 
                        padding: '1.5rem', 
                        cursor: 'pointer', 
                        border: data.courseId === (c.id || c._id) ? '2px solid var(--primary)' : '1px solid rgba(0,0,0,0.1)',
                        background: data.courseId === (c.id || c._id) ? 'rgba(124, 58, 237, 0.05)' : '#fff'
                    }}
                >
                    <div style={{ width: 40, height: 40, borderRadius: '10px', background: 'rgba(124, 58, 237, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                        <Monitor size={20} color="var(--primary)" />
                    </div>
                    <h4 style={{ fontWeight: 800 }}>{c.title}</h4>
                    <p style={{ fontSize: '0.75rem', color: '#666', marginTop: '5px' }}>{c.duration}</p>
                </div>
            ))}
        </div>
    );
}

function BatchSelector({ data, setData, batches }: any) {
    const filteredBatches = batches.filter((b: any) => b.courseId === data.courseId);
    return (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1.5rem' }}>
            {filteredBatches.length > 0 ? filteredBatches.map((b: any) => (
                <div 
                    key={b.id || b._id} 
                    onClick={() => setData({...data, batchId: b.id || b._id, batchName: b.batchName || b.name})}
                    style={{ 
                        ...glassStyle, 
                        padding: '1.5rem', 
                        cursor: 'pointer', 
                        border: data.batchId === (b.id || b._id) ? '2px solid var(--primary)' : '1px solid rgba(0,0,0,0.1)',
                        background: data.batchId === (b.id || b._id) ? 'rgba(124, 58, 237, 0.05)' : '#fff'
                    }}
                >
                    <h4 style={{ fontWeight: 800 }}>{b.batchName || b.name}</h4>
                    <p style={{ fontSize: '0.75rem', color: '#666', marginTop: '5px' }}>{b.batchCode}</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginTop: '10px', color: 'var(--primary)', fontWeight: 800, fontSize: '0.7rem' }}>
                        <Users size={12} /> {b.studentIds?.length || 0} Students
                    </div>
                </div>
            )) : (
                <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '3rem' }}>Select a course first or no batches found.</div>
            )}
        </div>
    );
}

function CandidateSelector({ data, setData, allUsers, selectedBatch }: any) {
    const batchStudents = allUsers.filter((u: any) => selectedBatch?.studentIds?.includes(u.email) || selectedBatch?.studentIds?.includes(u.id) || selectedBatch?.studentIds?.includes(u._id));
    
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div style={{ display: 'flex', gap: '1.5rem' }}>
                <button 
                    onClick={() => setData({...data, candidateType: 'ALL', candidateIds: []})}
                    style={{ ...inactiveBtnStyle, flex: 1, border: data.candidateType === 'ALL' ? '2px solid var(--primary)' : '1px solid rgba(0,0,0,0.1)', background: data.candidateType === 'ALL' ? 'rgba(124, 58, 237, 0.05)' : '#fff' }}
                >
                    <Users size={16} /> ALL STUDENTS ({batchStudents.length})
                </button>
                <button 
                    onClick={() => setData({...data, candidateType: 'SPECIFIC'})}
                    style={{ ...inactiveBtnStyle, flex: 1, border: data.candidateType === 'SPECIFIC' ? '2px solid var(--primary)' : '1px solid rgba(0,0,0,0.1)', background: data.candidateType === 'SPECIFIC' ? 'rgba(124, 58, 237, 0.05)' : '#fff' }}
                >
                    <UserPlus size={16} /> SELECT INDIVIDUALS
                </button>
            </div>

            {data.candidateType === 'SPECIFIC' && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem', maxHeight: '300px', overflowY: 'auto', padding: '10px' }}>
                    {batchStudents.map((s: any) => {
                        const isSelected = data.candidateIds.includes(s.id || s._id);
                        return (
                            <div 
                                key={s.id || s._id} 
                                onClick={() => {
                                    const ids = [...data.candidateIds];
                                    if (isSelected) setData({...data, candidateIds: ids.filter(id => id !== (s.id || s._id))});
                                    else setData({...data, candidateIds: [...ids, (s.id || s._id)]});
                                }}
                                style={{ ...glassStyle, padding: '1rem', display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', border: isSelected ? '1px solid var(--primary)' : '1px solid rgba(0,0,0,0.05)' }}
                            >
                                <div style={{ width: 16, height: 16, border: '1px solid #ddd', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: isSelected ? 'var(--primary)' : 'transparent' }}>
                                    {isSelected && <Check size={12} color="white" />}
                                </div>
                                <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{s.fullName}</span>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

function InterviewerSelector({ data, setData, allUsers }: any) {
    const interviewers = allUsers.filter((u: any) => u.role === 'SUPER_ADMIN' || u.role === 'ADMIN' || u.role === 'EMPLOYEE');
    
    return (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
            {interviewers.map((u: any) => (
                <div 
                    key={u.id || u._id}
                    onClick={() => setData({...data, interviewerId: u.id || u._id, interviewerName: u.fullName, interviewerRole: u.role})}
                    style={{ 
                        ...glassStyle, 
                        padding: '1.5rem', 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '1.2rem', 
                        cursor: 'pointer',
                        border: data.interviewerId === (u.id || u._id) ? '2px solid var(--primary)' : '1px solid rgba(0,0,0,0.1)',
                        background: data.interviewerId === (u.id || u._id) ? 'rgba(124, 58, 237, 0.05)' : '#fff'
                    }}
                >
                    <div style={{ width: 45, height: 45, borderRadius: '12px', background: 'var(--primary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900 }}>
                        {u.fullName.charAt(0)}
                    </div>
                    <div>
                        <h4 style={{ fontWeight: 800 }}>{u.fullName}</h4>
                        <p style={{ fontSize: '0.7rem', color: 'var(--primary)', fontWeight: 800, textTransform: 'uppercase' }}>{u.role.replace('_', ' ')}</p>
                    </div>
                </div>
            ))}
        </div>
    );
}

function ModeSelector({ data, setData }: any) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div 
                onClick={() => setData({...data, mode: 'AI'})}
                style={{ ...glassStyle, padding: '1.5rem', display: 'flex', gap: '1.5rem', cursor: 'pointer', border: data.mode === 'AI' ? '2px solid var(--primary)' : '1px solid rgba(0,0,0,0.1)' }}
            >
                <div style={{ padding: '1rem', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '14px' }}><Bot color="#3b82f6" /></div>
                <div>
                    <h4 style={{ fontWeight: 800 }}>AI Interview Engine</h4>
                    <p style={{ fontSize: '0.75rem', color: '#666' }}>Autonomous evaluation with real-time scoring.</p>
                </div>
            </div>
            <div 
                onClick={() => setData({...data, mode: 'HUMAN'})}
                style={{ ...glassStyle, padding: '1.5rem', display: 'flex', gap: '1.5rem', cursor: 'pointer', border: data.mode === 'HUMAN' ? '2px solid var(--primary)' : '1px solid rgba(0,0,0,0.1)' }}
            >
                <div style={{ padding: '1rem', background: 'rgba(139, 92, 246, 0.1)', borderRadius: '14px' }}><UserPlus color="var(--primary)" /></div>
                <div>
                    <h4 style={{ fontWeight: 800 }}>Human Interviewer</h4>
                    <p style={{ fontSize: '0.75rem', color: '#666' }}>Manual evaluation by assigned faculty member.</p>
                </div>
            </div>
            <div 
                onClick={() => setData({...data, mode: 'HYBRID'})}
                style={{ ...glassStyle, padding: '1.5rem', display: 'flex', gap: '1.5rem', cursor: 'pointer', border: data.mode === 'HYBRID' ? '2px solid var(--primary)' : '1px solid rgba(0,0,0,0.1)' }}
            >
                <div style={{ padding: '1rem', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '14px' }}><Target color="#10b981" /></div>
                <div>
                    <h4 style={{ fontWeight: 800 }}>Hybrid Protocol</h4>
                    <p style={{ fontSize: '0.75rem', color: '#666' }}>AI screens the candidate, Human finalizes the feedback.</p>
                </div>
            </div>
        </div>
    );
}

function ScheduleStep({ data, setData }: any) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <div style={inputGroupStyle}>
                    <label style={labelStyleWizard}>DATE</label>
                    <input 
                        type="date" 
                        value={data.date} 
                        onChange={e => setData({...data, date: e.target.value})}
                        style={wizardInputStyle} 
                    />
                </div>
                <div style={inputGroupStyle}>
                    <label style={labelStyleWizard}>START TIME</label>
                    <input 
                        type="time" 
                        value={data.startTime} 
                        onChange={e => setData({...data, startTime: e.target.value})}
                        style={wizardInputStyle} 
                    />
                </div>
            </div>
            <div style={inputGroupStyle}>
                <label style={labelStyleWizard}>DURATION (MINUTES)</label>
                <input 
                    type="number" 
                    value={isNaN(data.duration) ? '' : data.duration} 
                    onChange={e => setData({...data, duration: parseInt(e.target.value) || 0})}
                    style={wizardInputStyle} 
                />
            </div>
        </div>
    );
}

function ReviewStep({ data }: any) {
    return (
        <div style={{ textAlign: 'center' }}>
            <div style={{ width: 70, height: 70, borderRadius: '50%', background: 'rgba(16, 185, 129, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', color: '#10b981' }}>
                <CheckCircle size={35} />
            </div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 900 }}>Validation Complete</h3>
            <p style={{ color: '#666', marginBottom: '2rem' }}>All interview slots are configured correctly.</p>
            
            <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '20px', textAlign: 'left', display: 'inline-block', minWidth: '350px', border: '1px solid #e2e8f0' }}>
                <div style={{ marginBottom: '1rem' }}>
                    <p style={labelStyle}>TITLE</p>
                    <p style={{ fontWeight: 800 }}>{data.title}</p>
                </div>
                <div style={{ marginBottom: '1rem' }}>
                    <p style={labelStyle}>TARGET</p>
                    <p style={{ fontWeight: 800 }}>{data.batchName} ({data.courseName})</p>
                </div>
                <div style={{ marginBottom: '1rem' }}>
                    <p style={labelStyle}>INTERVIEWER</p>
                    <p style={{ fontWeight: 800 }}>{data.interviewerName} ({data.interviewerRole})</p>
                </div>
                <div>
                    <p style={labelStyle}>SCHEDULE</p>
                    <p style={{ fontWeight: 800 }}>{data.date} at {data.startTime} ({data.duration} mins)</p>
                </div>
            </div>
        </div>
    );
}

// --- SUB-COMPONENTS CORE ---

function InterviewCard({ data, onDelete, onEdit, onJoin, onReports }: { data: any, onDelete: any, onEdit: any, onJoin: any, onReports: any }) {
    return (
        <motion.div whileHover={{ y: -5 }} style={{ ...glassStyle, padding: '0', overflow: 'hidden', background: '#fff' }}>
            <div style={{ padding: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                    <div style={{ background: data.status === 'LIVE' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)', padding: '6px 12px', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: data.status === 'LIVE' ? '#ef4444' : '#10b981', boxShadow: data.status === 'LIVE' ? '0 0 10px #ef4444' : 'none' }} />
                        <span style={{ fontSize: '0.65rem', fontWeight: 900, color: data.status === 'LIVE' ? '#ef4444' : '#10b981' }}>{data.status || 'SCHEDULED'}</span>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <button onClick={onEdit} style={{ background: 'none', border: 'none', color: '#f59e0b', cursor: 'pointer' }}><Edit2 size={16} /></button>
                        <button onClick={onDelete} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}><Trash2 size={16} /></button>
                    </div>
                </div>

                <h4 style={{ fontSize: '1.25rem', fontWeight: 900, marginBottom: '0.5rem', minHeight: '3.5rem', color: '#111' }}>{data.title}</h4>
                
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '2rem' }}>
                    <Badge icon={<Zap size={10} />} label={data.type} color="var(--primary)" />
                    <Badge icon={<Bot size={10} />} label={data.mode} color="var(--secondary)" />
                    <Badge icon={<Clock size={10} />} label={`${data.duration} MINS`} color="#f59e0b" />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', padding: '1.5rem', background: '#f8fafc', borderRadius: '20px', border: '1px solid #e2e8f0', marginBottom: '2rem' }}>
                    <div>
                        <p style={labelStyle}>INTERVIEWER</p>
                        <p style={valueStyle}>{data.interviewerName}</p>
                    </div>
                    <div>
                        <p style={labelStyle}>BATCH</p>
                        <p style={valueStyle}>{data.batchName}</p>
                    </div>
                    <div>
                        <p style={labelStyle}>DATE</p>
                        <p style={valueStyle}>{data.date}</p>
                    </div>
                    <div>
                        <p style={labelStyle}>TIME</p>
                        <p style={valueStyle}>{data.startTime}</p>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                    <button onClick={onReports} style={{ flex: 1, padding: '11px', borderRadius: '12px', border: '1px solid #e2e8f0', background: '#f8fafc', color: '#111', fontSize: '0.75rem', fontWeight: 800, cursor: 'pointer' }}>VIEW REPORTS</button>
                    <button onClick={onJoin} style={{ flex: 1.2, padding: '11px', borderRadius: '12px', background: 'var(--primary)', color: '#fff', fontSize: '0.75rem', fontWeight: 900, border: 'none', cursor: 'pointer' }}>JOIN HUB</button>
                </div>
            </div>
        </motion.div>
    );
}

function LiveMonitoringView() {
    return (
        <div style={{ ...glassStyle, padding: '5rem', textAlign: 'center' }}>
            <Activity size={48} style={{ opacity: 0.1, marginBottom: '1rem' }} />
            <h2 style={{ color: '#111' }}>Live Interview Monitor</h2>
            <p style={{ color: '#666' }}>Active sessions will appear here as candidates join the rooms.</p>
        </div>
    );
}

function AIRoomView() {
    return (
        <div style={{ ...glassStyle, padding: '5rem', textAlign: 'center' }}>
            <Bot size={48} style={{ opacity: 0.1, marginBottom: '1rem' }} />
            <h2 style={{ color: '#111' }}>AI Calibration Room</h2>
            <p style={{ color: '#666' }}>Adjusting NLP engine for behavioral analysis...</p>
        </div>
    );
}

// --- UTILS & SHARED STYLES ---

function Badge({ icon, label, color }: { icon: any, label: string, color: string }) {
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '4px 10px', background: 'rgba(0, 0, 0, 0.03)', borderRadius: '8px', fontSize: '0.65rem', fontWeight: 800, color: '#111', border: '1px solid rgba(0, 0, 0, 0.05)' }}>
            <span style={{ color }}>{icon}</span>
            {label}
        </div>
    );
}

const getStepTitle = (step: number) => {
    switch (step) {
        case 1: return 'Position Specifics';
        case 2: return 'Curriculum Context';
        case 3: return 'Target Batch';
        case 4: return 'Candidate Selection';
        case 5: return 'Interviewers';
        case 6: return 'Execution Protocol';
        case 7: return 'Timing & Slotting';
        case 8: return 'Deployment Preview';
        default: return '';
    }
};

const activeBtnStyle: React.CSSProperties = {
    padding: '12px 24px',
    borderRadius: '16px',
    background: 'var(--primary)',
    color: '#fff',
    border: 'none',
    fontWeight: 900,
    fontSize: '0.8rem',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    cursor: 'pointer'
};

const inactiveBtnStyle: React.CSSProperties = {
    padding: '12px 24px',
    borderRadius: '16px',
    background: 'rgba(0,0,0,0.03)',
    color: '#666',
    border: '1px solid rgba(0,0,0,0.05)',
    fontWeight: 800,
    fontSize: '0.8rem',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    cursor: 'pointer'
};

const secondaryBtnStyle: React.CSSProperties = {
    padding: '12px 24px',
    borderRadius: '14px',
    background: '#f8fafc',
    color: '#666',
    border: '1px solid #e2e8f0',
    fontWeight: 800,
    fontSize: '0.8rem',
    cursor: 'pointer'
};

const labelStyle: React.CSSProperties = { fontSize: '0.6rem', fontWeight: 900, color: '#999', textTransform: 'uppercase', marginBottom: '4px', letterSpacing: '1px' };
const valueStyle: React.CSSProperties = { fontSize: '0.85rem', fontWeight: 800, color: '#111' };

const modalOverlayStyle: React.CSSProperties = {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0, 0, 0, 0.4)',
    backdropFilter: 'blur(10px)',
    zIndex: 10000,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '4rem 0'
};

const modalContentStyle: React.CSSProperties = {
    width: '95%',
    maxWidth: '900px',
    height: '90%',
    ...glassStyle,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    background: '#fff',
    boxShadow: '0 40px 100px rgba(0,0,0,0.2)'
};

const inputGroupStyle: React.CSSProperties = { display: 'flex', flexDirection: 'column', gap: '10px' };
const labelStyleWizard: React.CSSProperties = { fontSize: '0.7rem', fontWeight: 900, color: '#666', marginLeft: '5px', letterSpacing: '1px' };
const wizardInputStyle: React.CSSProperties = { padding: '1rem', borderRadius: '15px', background: '#f8fafc', border: '1px solid #e2e8f0', color: '#111', fontSize: '0.9rem', outline: 'none', fontWeight: 600 };
