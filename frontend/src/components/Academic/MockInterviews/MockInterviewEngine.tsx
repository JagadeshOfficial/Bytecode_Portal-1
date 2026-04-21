"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Users, Video, BarChart2, Calendar, 
    Plus, Search, Filter, MoreVertical, 
    CheckCircle, Clock, Zap, Target, 
    Shield, Activity, Bot, Mic, 
    Monitor, Brain, Clipboard, UserPlus,
    X as CloseIcon, ChevronRight, ChevronLeft, Flag,
    Edit2, Trash2, Copy, Play, Check, Share2, ScreenShare, Circle
} from 'lucide-react';
import { fetchJsonSafe } from '@/lib/fetchJson';

// --- STYLES & ACCENTS ---
const glassStyle = {
    background: 'rgba(255, 255, 255, 0.7)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(0, 0, 0, 0.05)',
    borderRadius: '24px',
    boxShadow: '0 20px 40px rgba(0,0,0,0.05)',
};

// --- ICON MAPPING ---
const ICON_MAP: Record<string, any> = {
    Video: <Video size={20} />,
    Brain: <Brain size={20} />,
    Shield: <Shield size={20} />,
    Target: <Target size={20} />,
    Play: <Play size={20} />,
    Users: <Users size={20} />,
    CheckCircle: <CheckCircle size={20} />,
    Share2: <Share2 size={20} />
};

const controlBtnStyle = {
    padding: '12px',
    borderRadius: '12px',
    background: 'rgba(255,255,255,0.1)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255,255,255,0.1)',
    color: '#fff',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
};

export default function MockInterviewEngine({ activeView, role = 'super_admin' }: { activeView?: string, role?: string }) {
    const isAdmin = role === 'super_admin' || role === 'admin';
    const [subView, setSubView] = useState<'DASHBOARD' | 'LIVE_MONITOR' | 'ANALYTICS' | 'AI_ROOM' | 'RECORDINGS'>('DASHBOARD');
    const [isMuted, setIsMuted] = useState(false);
    const [isVideoOff, setIsVideoOff] = useState(false);
    const [isScreenSharing, setIsScreenSharing] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const [recordedUrl, setRecordedUrl] = useState<string | null>(null);
    const videoRef = React.useRef<HTMLVideoElement>(null);
    const screenRef = React.useRef<HTMLVideoElement>(null);

    useEffect(() => {
        if (activeView) {
            setSubView(activeView as any);
        }
    }, [activeView]);

    useEffect(() => {
        if (subView === 'AI_ROOM') {
            startCamera();
        } else {
            stopCamera();
        }
    }, [subView]);

    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
        } catch (err) {
            console.error("Camera access failed:", err);
        }
    };

    const stopCamera = () => {
        if (videoRef.current && videoRef.current.srcObject) {
            const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
            tracks.forEach(track => track.stop());
            videoRef.current.srcObject = null;
        }
    };

    const toggleMute = () => {
        if (videoRef.current && videoRef.current.srcObject) {
            const audioTracks = (videoRef.current.srcObject as MediaStream).getAudioTracks();
            audioTracks.forEach(track => track.enabled = isMuted);
            setIsMuted(!isMuted);
        }
    };

    const toggleVideo = () => {
        if (videoRef.current && videoRef.current.srcObject) {
            const videoTracks = (videoRef.current.srcObject as MediaStream).getVideoTracks();
            videoTracks.forEach(track => track.enabled = isVideoOff);
            setIsVideoOff(!isVideoOff);
        }
    };

    const toggleScreenShare = async () => {
        try {
            if (!isScreenSharing) {
                const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
                setIsScreenSharing(true);
                // In a real app, you'd switch the video stream source
            } else {
                setIsScreenSharing(false);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const startRecording = () => {
        setIsRecording(true);
        setRecordedUrl(null);
        // Simulation of recording start
    };

    const stopRecording = async () => {
        setIsRecording(false);
        const mockUrl = `https://bytecode-storage.s3.amazonaws.com/mock-interviews/rec-${Date.now()}.mp4`;
        const mockTranscript = [
            { time: "00:05", speaker: "Interviewer", text: "Welcome to the simulation. Let's start with your background." },
            { time: "00:30", speaker: "Candidate", text: "I have been working on full-stack projects using React and Node.js for 2 years." },
            { time: "01:00", speaker: "AI Insight", text: "Clear technical introduction.", type: "insight" },
            { time: "01:45", speaker: "Interviewer", text: "Can you explain how you handle race conditions in the distributed system?" }
        ];
        
        setRecordedUrl(mockUrl);

        // Auto-save to database if session is selected
        if (selectedInterviewId) {
            const result = await fetchJsonSafe<any>(`http://localhost:8080/api/academic/mock-interviews/${selectedInterviewId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    recordedUrl: mockUrl,
                    transcript: mockTranscript,
                    status: 'COMPLETED',
                    aiScore: Math.floor(Math.random() * (95 - 75 + 1) + 75)
                })
            });
            if (result.ok && result.data) {
                setInterviews(prev => prev.map(i => (i.id === result.data.id || i._id === result.data.id) ? result.data : i));
            } else if (result.error) {
                console.error("Failed to auto-save recording:", result.error);
            }
        }
    };

    const shareToBatchDrive = async (session: any) => {
        if (!session || !recordedUrl) return;
        try {
            // Find the batch
            const bRes = await fetch(`http://localhost:8080/api/academic/batches/${session.batchId}`);
            if (!bRes.ok) return;
            const batch = await bRes.json();
            
            const newFile = {
                name: `MOCK_INTERVIEW_${session.title}_${new Date().toLocaleDateString().replace(/\//g, '-')}.mp4`,
                size: '42.5 MB',
                type: 'video/mp4',
                uploadDate: new Date().toISOString(),
                url: recordedUrl
            };

            // Add to 'Mock Interviews' folder or create it
            batch.folders = batch.folders || [];
            let folder = batch.folders.find((f: any) => f.name === 'Mock Interview Recordings');
            if (!folder) {
                folder = { name: 'Mock Interview Recordings', files: [], sharedWith: [] };
                batch.folders.push(folder);
            }
            folder.files.push(newFile);

            const upRes = await fetch(`http://localhost:8080/api/academic/batches/${session.batchId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(batch)
            });

            if (upRes.ok) {
                alert("Recording shared to Batch Drive successfully!");
            }
        } catch (err) {
            console.error(err);
        }
    };

    const [isWizardOpen, setIsWizardOpen] = useState(false);
    const [wizardStep, setWizardStep] = useState(1);
    
    // Data states
    const [interviews, setInterviews] = useState<any[]>([]);
    const [stats, setStats] = useState<any[]>([]);
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
            noiseAnalysis: true,
            multiLanguage: true,
            codingSandbox: true
        }
    });

    const fetchAllData = async () => {
        setLoading(true);
        const [intRes, courRes, batchRes, userRes, statsRes] = await Promise.all([
            fetchJsonSafe<any[]>('http://localhost:8080/api/academic/mock-interviews'),
            fetchJsonSafe<any[]>('http://localhost:8080/api/courses'),
            fetchJsonSafe<any[]>('http://localhost:8080/api/academic/batches'),
            fetchJsonSafe<any[]>('http://localhost:8080/api/users'),
            fetchJsonSafe<any[]>('http://localhost:8080/api/academic/mock-interviews/stats')
        ]);
        
        if (intRes.ok && intRes.data) setInterviews(intRes.data);
        if (courRes.ok && courRes.data) setCourses(courRes.data);
        if (batchRes.ok && batchRes.data) setBatches(batchRes.data);
        if (userRes.ok && userRes.data) setAllUsers(userRes.data);
        if (statsRes.ok && statsRes.data) {
            setStats(statsRes.data.map((s: any) => ({
                ...s,
                icon: ICON_MAP[s.iconType] || <Activity size={20} />
            })));
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

            const result = await fetchJsonSafe<any>(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newInterview)
            });
            if (result.ok && result.data) {
                const saved = result.data;
                if (isEditing) {
                    setInterviews(interviews.map(i => (i.id === selectedInterviewId || i._id === selectedInterviewId) ? saved : i));
                } else {
                    setInterviews([saved, ...interviews]);
                }
                setIsWizardOpen(false);
                setIsEditing(false);
                setWizardStep(1);
                alert(isEditing ? "Interview Updated!" : "Mock Interview Scheduled Successfully!");
            } else if (result.error) {
                alert(`Operation failed: ${result.error}`);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleDeleteInterview = async (id: string) => {
        if (!confirm("Are you sure?")) return;
        const result = await fetchJsonSafe<any>(`http://localhost:8080/api/academic/mock-interviews/${id}`, { method: 'DELETE' });
        if (result.ok) {
            setInterviews(interviews.filter(i => i.id !== id && i._id !== id));
        } else if (result.error) {
            console.error("Delete failed:", result.error);
        }
    };

    const isStudent = role === 'student';

    return (
        <div style={{ padding: '0 0.5rem' }}>
            {/* --- TOP SUB-NAV --- */}
            <div style={{ display: 'flex', gap: '15px', marginBottom: '3rem' }}>
                {[
                    { id: 'DASHBOARD', label: 'DASHBOARD', icon: <Monitor size={18} /> },
                    { id: 'LIVE_MONITOR', label: 'LIVE MONITOR', icon: <Activity size={18} />, adminOnly: true },
                    { id: 'AI_ROOM', label: 'AI ROOM', icon: <Bot size={18} /> },
                    { id: 'ANALYTICS', label: 'ANALYTICS', icon: <BarChart2 size={18} />, adminOnly: true },
                    { id: 'RECORDINGS', label: 'RECORDINGS', icon: <Video size={18} />, adminOnly: true }
                ].filter(tab => {
                    if (tab.adminOnly && !isAdmin) return false;
                    if (isStudent && tab.id === 'RECORDINGS') return false;
                    return true;
                }).map((tab) => (
                    <button key={tab.id} onClick={() => setSubView(tab.id as any)} style={subView === tab.id ? activeBtnStyle : inactiveBtnStyle}>
                        {tab.icon} {tab.label}
                    </button>
                ))}
                <div style={{ flex: 1 }} />
                {!isStudent && (
                    <button onClick={() => { setIsEditing(false); setNewInterview({ ...newInterview, title: '', description: '', date: '', startTime: '' }); setIsWizardOpen(true); }} className="btn-quantum" style={{ padding: '12px 24px', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Plus size={18} /> CREATE INTERVIEW
                    </button>
                )}
            </div>

            {/* --- CONTENT AREA --- */}
            <AnimatePresence mode="wait">
                {subView === 'DASHBOARD' && (
                    <motion.div key="dash" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -20 }}>
                        {/* Stats Cards */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
                            {stats.map((stat, i) => (
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
                                                const merged = {
                                                    ...item,
                                                    settings: {
                                                        faceDetection: true, eyeTracking: true, tabBlocker: true, noiseAnalysis: true, 
                                                        multiLanguage: true, codingSandbox: true,
                                                        ...(item.settings || {})
                                                    }
                                                };
                                                setNewInterview(merged);
                                                setSelectedInterviewId(item.id || item._id);
                                                setIsEditing(true);
                                                setIsWizardOpen(true);
                                                setWizardStep(1);
                                            }}
                                            onJoin={() => { setSelectedInterviewId(item.id || item._id); setSubView('AI_ROOM'); }}
                                            onReports={() => { setSelectedInterviewId(item.id || item._id); setSubView('ANALYTICS'); }}
                                            onStart={async () => {
                                                const result = await fetchJsonSafe<any>(`http://localhost:8080/api/academic/mock-interviews/${item.id || item._id}`, {
                                                    method: 'PUT',
                                                    headers: {'Content-Type': 'application/json'},
                                                    body: JSON.stringify({...item, status: 'LIVE'})
                                                });
                                                if (result.ok && result.data) {
                                                    const updated = result.data;
                                                    setInterviews(interviews.map(i => (i.id === (item.id || item._id) || i._id === (item.id || item._id)) ? updated : i));
                                                    setSelectedInterviewId(item.id || item._id);
                                                    setSubView('LIVE_MONITOR');
                                                } else if (result.error) {
                                                    console.error("Failed to start session:", result.error);
                                                }
                                            }}
                                            onFinish={async () => {
                                                if (!confirm("Are you sure you want to conclude this session? AI will generate the final report.")) return;
                                                const result = await fetchJsonSafe<any>(`http://localhost:8080/api/academic/mock-interviews/${item.id || item._id}`, {
                                                    method: 'PUT',
                                                    headers: {'Content-Type': 'application/json'},
                                                    body: JSON.stringify({...item, status: 'COMPLETED', completedAt: new Date()})
                                                });
                                                if (result.ok && result.data) {
                                                    const updated = result.data;
                                                    setInterviews(interviews.map(i => (i.id === (item.id || item._id) || i._id === (item.id || item._id)) ? updated : i));
                                                    alert("Protocol Concluded: AI Evaluation Report generated.");
                                                } else if (result.error) {
                                                    console.error("Failed to conclude session:", result.error);
                                                }
                                            }}
                                            isStudent={isStudent}
                                        />
                                    ))
                                )}
                            </div>
                        )}
                    </motion.div>
                )}

                {subView === 'LIVE_MONITOR' && (
                    <motion.div key="live" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -20 }}>
                        <LiveMonitoringView interviews={interviews} onJoin={(s: any) => { setSelectedInterviewId(s.id || s._id); setSubView('AI_ROOM'); }} />
                    </motion.div>
                )}

                {subView === 'AI_ROOM' && (
                    <motion.div key="ai" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -20 }}>
                        <AIRoomView 
                            session={interviews.find(i => i.id === selectedInterviewId || i._id === selectedInterviewId)} 
                            isAdmin={isAdmin}
                            videoRef={videoRef}
                            isMuted={isMuted}
                            isVideoOff={isVideoOff}
                            isScreenSharing={isScreenSharing}
                            isRecording={isRecording}
                            recordedUrl={recordedUrl}
                            toggleMute={toggleMute}
                            toggleVideo={toggleVideo}
                            toggleScreenShare={toggleScreenShare}
                            startRecording={startRecording}
                            stopRecording={stopRecording}
                            shareToBatchDrive={shareToBatchDrive}
                            onEndSession={() => setSubView('DASHBOARD')}
                        />
                    </motion.div>
                )}

                {subView === 'RECORDINGS' && (
                    <motion.div key="recordings" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                        <RecordingsHistoryView interviews={interviews} />
                    </motion.div>
                )}

                {subView === 'ANALYTICS' && (
                    <motion.div key="analysis" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -20 }}>
                        <AnalyticsEngineView interviews={interviews} />
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
                                <button onClick={() => setIsWizardOpen(false)} style={{ background: 'none', border: 'none', color: '#666', cursor: 'pointer' }}><CloseIcon size={24} /></button>
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

            <div style={{ ...glassStyle, padding: '1.5rem', background: 'rgba(59, 130, 246, 0.05)', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
                <h4 style={{ fontSize: '0.85rem', fontWeight: 900, marginBottom: '1rem', color: '#3b82f6' }}>ADVANCED CAPABILITIES</h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.8rem', cursor: 'pointer' }}>
                        <input type="checkbox" checked={!!data.settings?.multiLanguage} onChange={e => setData({...data, settings: {...(data.settings || {}), multiLanguage: e.target.checked}})} />
                        Multi-Language Support (Hindi/Telugu/English)
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.8rem', cursor: 'pointer' }}>
                        <input type="checkbox" checked={!!data.settings?.codingSandbox} onChange={e => setData({...data, settings: {...(data.settings || {}), codingSandbox: e.target.checked}})} />
                        Interactive Coding Sandbox
                    </label>
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
                    <p style={{ fontWeight: 800 }}>{data.batchName || 'Not Selected'} ({data.courseName || 'Not Selected'})</p>
                </div>
                <div style={{ marginBottom: '1rem' }}>
                    <p style={labelStyle}>INTERVIEWER</p>
                    <p style={{ fontWeight: 800 }}>{data.interviewerName || 'AI Engine'}</p>
                </div>
                <div>
                    <p style={labelStyle}>SCHEDULE</p>
                    <p style={{ fontWeight: 800 }}>{data.date || 'TBD'} at {data.startTime || 'TBD'} ({data.duration} mins)</p>
                </div>
            </div>
        </div>
    );
}

// --- SUB-COMPONENTS CORE ---

function InterviewCard({ data, onDelete, onEdit, onJoin, onReports, onStart, onFinish, isStudent }: { data: any, onDelete: any, onEdit: any, onJoin: any, onReports: any, onStart: any, onFinish: any, isStudent?: boolean }) {
    const isCompleted = data.status === 'COMPLETED';
    const isLive = data.status === 'LIVE';

    return (
        <motion.div whileHover={{ y: -5 }} style={{ ...glassStyle, padding: '0', overflow: 'hidden', background: '#fff', opacity: isCompleted ? 0.8 : 1 }}>
            <div style={{ padding: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                    <div style={{ 
                        background: isLive ? 'rgba(239, 68, 68, 0.1)' : isCompleted ? 'rgba(59, 130, 246, 0.1)' : 'rgba(16, 185, 129, 0.1)', 
                        padding: '6px 12px', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '8px' 
                    }}>
                        <div style={{ 
                            width: 8, height: 8, borderRadius: '50%', 
                            background: isLive ? '#ef4444' : isCompleted ? '#3b82f6' : '#10b981', 
                            boxShadow: isLive ? '0 0 10px #ef4444' : 'none' 
                        }} />
                        <span style={{ fontSize: '0.65rem', fontWeight: 900, color: isLive ? '#ef4444' : isCompleted ? '#3b82f6' : '#10b981' }}>
                            {data.status || 'SCHEDULED'}
                        </span>
                    </div>
                    {!isStudent && (
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <button onClick={onEdit} style={{ background: 'none', border: 'none', color: '#f59e0b', cursor: 'pointer' }}><Edit2 size={16} /></button>
                            <button onClick={onDelete} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}><Trash2 size={16} /></button>
                        </div>
                    )}
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
                        <p style={valueStyle}>{data.interviewerName || 'AI Engine'}</p>
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
                    {isLive ? (
                        <>
                            {isStudent ? (
                                <button onClick={onJoin} style={{ flex: 1, padding: '11px', borderRadius: '12px', background: 'var(--primary)', color: '#fff', fontSize: '0.75rem', fontWeight: 900, border: 'none', cursor: 'pointer' }}>JOIN NOW</button>
                            ) : (
                                <>
                                    <button onClick={onJoin} style={{ flex: 1, padding: '11px', borderRadius: '12px', background: '#ef4444', color: '#fff', fontSize: '0.75rem', fontWeight: 900, border: 'none', cursor: 'pointer' }}>MONITOR LIVE</button>
                                    <button onClick={onFinish} style={{ flex: 1, padding: '11px', borderRadius: '12px', background: '#111', color: '#fff', fontSize: '0.75rem', fontWeight: 900, border: 'none', cursor: 'pointer' }}>FINISH</button>
                                </>
                            )}
                        </>
                    ) : isCompleted ? (
                        <button onClick={onReports} style={{ flex: 1, padding: '11px', borderRadius: '12px', background: 'var(--primary)', color: '#fff', fontSize: '0.75rem', fontWeight: 900, border: 'none', cursor: 'pointer' }}>VIEW AI REPORT</button>
                    ) : (
                        !isStudent && <button onClick={onStart} style={{ flex: 1, padding: '11px', borderRadius: '12px', background: '#10b981', color: '#fff', fontSize: '0.75rem', fontWeight: 900, border: 'none', cursor: 'pointer' }}>START SESSION</button>
                    )}
                    {!isLive && !isCompleted && <button onClick={onReports} style={{ flex: !isStudent ? 1 : 2, padding: '11px', borderRadius: '12px', border: '1px solid #e2e8f0', background: '#f8fafc', color: '#111', fontSize: '0.75rem', fontWeight: 800, cursor: 'pointer' }}>HISTORY</button>}
                </div>
            </div>
        </motion.div>
    );
}

function LiveMonitoringView({ interviews, onJoin }: { interviews: any[], onJoin: any }) {
    const liveSessions = interviews.filter(i => i.status === 'LIVE');
    
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ fontWeight: 900 }}>Active Interviews ({liveSessions.length})</h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ef4444', animation: 'pulse 1.5s infinite' }} />
                    <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#ef4444' }}>LIVE STREAMING</span>
                </div>
            </div>

            {liveSessions.length === 0 ? (
                <div style={{ ...glassStyle, padding: '5rem', textAlign: 'center' }}>
                    <Activity size={48} style={{ opacity: 0.1, marginBottom: '1rem' }} />
                    <h2 style={{ color: '#111' }}>No Live Sessions</h2>
                    <p style={{ color: '#666' }}>Active sessions will appear here once you start an interview from the Dashboard.</p>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: '2rem' }}>
                    {liveSessions.map(session => (
                        <div key={session.id || session._id} style={{ ...glassStyle, padding: '1.5rem', background: '#fff', borderLeft: '4px solid #ef4444' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                <h4 style={{ fontWeight: 900 }}>{session.title}</h4>
                                <span style={{ fontSize: '0.7rem', fontWeight: 900, color: '#ef4444' }}>00:45:12</span>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                                <div><p style={labelStyle}>CANDIDATE</p><p style={valueStyle}>Multiple ({session.candidateIds?.length || session.candidateType})</p></div>
                                <div><p style={labelStyle}>INTERVIEWER</p><p style={valueStyle}>{session.interviewerName}</p></div>
                            </div>
                            <button onClick={() => onJoin(session)} className="btn-quantum" style={{ width: '100%', padding: '12px' }}>ENTER LIVE ROOM</button>
                        </div>
                    ))}
                </div>
            )}

            <style>{`
                @keyframes pulse {
                    0% { opacity: 1; transform: scale(1); }
                    50% { opacity: 0.5; transform: scale(1.1); }
                    100% { opacity: 1; transform: scale(1); }
                }
            `}</style>
        </div>
    );
}

function AIRoomView({ 
    session, isAdmin, videoRef, isMuted, isVideoOff, isScreenSharing, isRecording, recordedUrl, 
    toggleMute, toggleVideo, toggleScreenShare, startRecording, stopRecording, shareToBatchDrive, onEndSession
}: { 
    session: any, isAdmin: boolean, videoRef: any, isMuted: boolean, isVideoOff: boolean, isScreenSharing: boolean, isRecording: boolean, recordedUrl: string | null,
    toggleMute: any, toggleVideo: any, toggleScreenShare: any, startRecording: any, stopRecording: any, shareToBatchDrive: any, onEndSession: any
}) {
    if (!session) {
        return (
            <div style={{ ...glassStyle, padding: '5rem', textAlign: 'center' }}>
                <Bot size={48} style={{ opacity: 0.1, marginBottom: '1rem' }} />
                <h2 style={{ color: '#111' }}>AI Calibration Room</h2>
                <p style={{ color: '#666' }}>Select a session to begin AI-assisted monitoring.</p>
            </div>
        );
    }

    return (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '2.5rem' }}>
            <div style={{ ...glassStyle, background: '#111', height: '600px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: '2rem', left: '2rem', display: 'flex', alignItems: 'center', gap: '10px', zIndex: 10 }}>
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ef4444', animation: isRecording ? 'pulse 1s infinite' : 'none' }} />
                    <span style={{ fontWeight: 900, textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
                        LIVE FEED: {session.interviewerName} vs CANDIDATE {isRecording && '(RECORDING...)'}
                    </span>
                </div>
                
                {/* VIDEO ELEMENT */}
                <video 
                    ref={videoRef} 
                    autoPlay 
                    muted={isMuted}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: isVideoOff ? 0 : 1 }} 
                />
                
                {isVideoOff && (
                    <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#111' }}>
                        <Bot size={120} style={{ opacity: 0.2, animation: 'float 3s infinite ease-in-out' }} />
                    </div>
                )}

                <div style={{ position: 'absolute', bottom: '2rem', left: '2rem', right: '2rem', display: 'flex', flexDirection: 'column', gap: '15px', zIndex: 10 }}>
                    {/* Controls */}
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '15px' }}>
                        <button onClick={toggleMute} style={controlBtnStyle}>
                            {isMuted ? <Mic size={20} color="#ef4444" /> : <Mic size={20} />}
                        </button>
                        <button onClick={toggleVideo} style={controlBtnStyle}>
                            {isVideoOff ? <Monitor size={20} color="#ef4444" /> : <Monitor size={20} />}
                        </button>
                        <button onClick={toggleScreenShare} style={controlBtnStyle}>
                            <ScreenShare size={20} color={isScreenSharing ? 'var(--primary)' : '#fff'} />
                        </button>
                        
                        {isAdmin && (
                            <>
                                <button onClick={isRecording ? stopRecording : startRecording} style={{ ...controlBtnStyle, border: isRecording ? '1px solid #ef4444' : '1px solid rgba(255,255,255,0.1)', background: isRecording ? 'rgba(239,68,68,0.1)' : 'transparent' }}>
                                    <Circle size={20} fill={isRecording ? "#ef4444" : "none"} color={isRecording ? "#ef4444" : "#fff"} />
                                </button>
                                <button onClick={onEndSession} style={{ ...controlBtnStyle, background: '#ef4444', borderRadius: '12px', padding: '10px 20px', fontWeight: 900, minWidth: '130px' }}>
                                    END MEETING
                                </button>
                            </>
                        )}
                    </div>

                    <div style={{ flex: 1, height: 4, background: 'rgba(255,255,255,0.1)', borderRadius: '2px' }}>
                        <div style={{ width: isRecording ? '100%' : '45%', height: '100%', background: isRecording ? '#ef4444' : 'var(--primary)', boxShadow: isRecording ? '0 0 10px #ef4444' : '0 0 10px var(--primary)', transition: 'width 0.5s' }} />
                    </div>
                </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div style={{ ...glassStyle, padding: '1.5rem', background: '#fff' }}>
                    <h4 style={{ fontWeight: 900, marginBottom: '1rem' }}>EMOTION RADAR</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                            <span style={{ color: '#666' }}>Confidence</span>
                            <div style={{ flex: 1, height: 6, background: '#eee', margin: '0 10px', borderRadius: '3px', alignSelf: 'center' }}><div style={{ width: '85%', height: '100%', background: '#10b981', borderRadius: '3px' }}/></div>
                            <span style={{ fontWeight: 800 }}>85%</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                            <span style={{ color: '#666' }}>Anxiety</span>
                            <div style={{ flex: 1, height: 6, background: '#eee', margin: '0 10px', borderRadius: '3px', alignSelf: 'center' }}><div style={{ width: '15%', height: '100%', background: '#ef4444', borderRadius: '3px' }}/></div>
                            <span style={{ fontWeight: 800 }}>15%</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                            <span style={{ color: '#666' }}>Engagement</span>
                            <div style={{ flex: 1, height: 6, background: '#eee', margin: '0 10px', borderRadius: '3px', alignSelf: 'center' }}><div style={{ width: '92%', height: '100%', background: 'var(--primary)', borderRadius: '3px' }}/></div>
                            <span style={{ fontWeight: 800 }}>92%</span>
                        </div>
                    </div>
                </div>

                <div style={{ ...glassStyle, padding: '1.5rem', background: '#fff' }}>
                    <h4 style={{ fontWeight: 900, marginBottom: '1rem' }}>AI ANALYSIS</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                            <span style={{ color: '#666' }}>Confidence Score</span>
                            <span style={{ fontWeight: 800 }}>88%</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                            <span style={{ color: '#666' }}>Sentiment Index</span>
                            <span style={{ fontWeight: 800 }}>Positive</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                            <span style={{ color: '#666' }}>Speech Clarity</span>
                            <span style={{ fontWeight: 800 }}>Excellent</span>
                        </div>
                    </div>
                </div>

                <div style={{ ...glassStyle, padding: '1.5rem', background: '#fff', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <h4 style={{ fontWeight: 900, marginBottom: '1rem' }}>LIVE TRANSCRIPT (HYBRID)</h4>
                    <div style={{ fontSize: '0.75rem', color: '#444', height: '200px', overflowY: 'auto', marginBottom: '1rem' }}>
                        <p style={{ marginBottom: '10px' }}><strong>Candidate:</strong> మల్టీ-థ్రెడింగ్ అనేది జావాలో ఒక ప్రధాన అంశం...</p>
                        <p style={{ color: 'var(--primary)', marginBottom: '10px' }}><strong>AI (Translated):</strong> Multi-threading is a key concept in Java...</p>
                        <p style={{ marginBottom: '10px' }}><strong>Interviewer:</strong> Correct. How do you handle synchronization?</p>
                    </div>
                    {session.settings?.codingSandbox && (
                        <div style={{ marginTop: 'auto', borderTop: '1px solid #eee', paddingTop: '1rem' }}>
                            <p style={labelStyle}>CODING SANDBOX</p>
                            <div style={{ background: '#1e1e1e', padding: '10px', borderRadius: '8px', color: '#4ade80', fontSize: '0.7rem', fontFamily: 'monospace' }}>
                                public class Solution {'{'} <br/>
                                &nbsp;&nbsp;public static void main(String[] args) {'{'} <br/>
                                &nbsp;&nbsp;&nbsp;&nbsp;System.out.println("Hello World"); <br/>
                                &nbsp;&nbsp;{'}'} <br/>
                                {'}'}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <style>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-20px); }
                }
            `}</style>
        </div>
    );
}

function AnalyticsEngineView({ interviews }: { interviews: any[] }) {
    const [selectedStudent, setSelectedStudent] = useState<string | null>(null);
    const completed = interviews.filter(i => i.status === 'COMPLETED');
    
    // Data filtering for selected student vs global batch
    const displayData = selectedStudent 
        ? completed.filter(i => i.candidateName === selectedStudent) 
        : completed;

    const avgScore = displayData.length > 0 
        ? (displayData.reduce((acc, i) => acc + (i.aiScore || 85), 0) / displayData.length).toFixed(1) 
        : "0.0";

    // Extract unique candidates
    const candidates = Array.from(new Set(completed.map(i => i.candidateName || 'Unknown')));

    // Dynamic Score Progression (last 10 sessions)
    const scoreProgression = displayData.slice(-10).map(i => i.aiScore || 85);
    
    // Dynamic Cognitive Parameters (simulated calculation based on raw scores)
    const params = [
        { label: 'Technical Depth', val: Math.min(100, Math.round(Number(avgScore) * 0.95)), color: 'var(--primary)' },
        { label: 'Problem Solving', val: Math.min(100, Math.round(Number(avgScore) * 0.9)), color: 'var(--secondary)' },
        { label: 'Communication', val: Math.min(100, Math.round(Number(avgScore) * 1.05)), color: '#10b981' },
        { label: 'System Design', val: Math.min(100, Math.round(Number(avgScore) * 0.75)), color: '#f59e0b' }
    ];

    // Dynamic Insight Calculations
    const readinessCount = displayData.filter(i => (i.aiScore || 85) >= 80).length;
    const readinessPct = displayData.length > 0 ? Math.round((readinessCount / displayData.length) * 100) : 0;
    const saturationAvg = (completed.length / (candidates.length || 1)).toFixed(1);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h2 style={{ fontWeight: 900 }}>Advanced Performance Matrix</h2>
                    <p style={{ fontSize: '0.8rem', color: '#666' }}>{selectedStudent ? `Deep analytics for ${selectedStudent}` : "Comprehensive batch intelligence and behavioral scoring."}</p>
                </div>
                <div style={{ background: 'var(--primary)', color: '#fff', padding: '12px 24px', borderRadius: '16px', fontSize: '0.9rem', fontWeight: 900, boxShadow: '0 10px 20px rgba(79, 70, 229, 0.2)' }}>
                    {selectedStudent ? 'STUDENT AVG:' : 'BATCH AVG:'} {avgScore}%
                </div>
            </div>

            {/* --- CANDIDATE SPOTLIGHT --- */}
            <div style={{ ...glassStyle, padding: '2.5rem', background: '#fff' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                    <h3 style={{ fontWeight: 900, display: 'flex', alignItems: 'center', gap: '10px' }}><Target size={20} color="var(--primary)" /> PERFORMANCE DRILL-DOWN</h3>
                    <select 
                        onChange={(e) => setSelectedStudent(e.target.value)} 
                        value={selectedStudent || ""}
                        style={{ padding: '12px 20px', borderRadius: '12px', border: '1px solid #eee', fontSize: '0.8rem', fontWeight: 800, background: '#f9f9f9' }}
                    >
                        <option value="">VIEW GLOBAL BATCH STATS</option>
                        {candidates.map(c => <option key={c as string} value={c as string}>{c as string}</option>)}
                    </select>
                </div>

                {/* Score Progression & Cognitive Distribution Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>
                    {/* Score Trends */}
                    <div style={{ padding: '1rem', borderRight: '1px solid #eee' }}>
                        <h4 style={{ fontWeight: 900, marginBottom: '2rem', fontSize: '0.9rem' }}>SCORE PROGRESSION (LATEST {scoreProgression.length})</h4>
                        <div style={{ height: '150px', display: 'flex', alignItems: 'flex-end', gap: '10px' }}>
                            {scoreProgression.length > 0 ? scoreProgression.map((h, i) => (
                                <div key={i} style={{ flex: 1, background: 'var(--primary)', height: `${h}%`, borderRadius: '4px 4px 0 0', opacity: 0.1 + (i * 0.1), position: 'relative' }}>
                                    <div style={{ position: 'absolute', top: '-25px', left: '50%', transform: 'translateX(-50%)', fontSize: '0.6rem', fontWeight: 900 }}>{h}</div>
                                </div>
                            )) : <div style={{ color: '#ccc', margin: 'auto' }}>No completed sessions found</div>}
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem', borderTop: '1px solid #eee', paddingTop: '1rem' }}>
                            <span style={{ fontSize: '0.7rem', color: '#999', fontWeight: 800 }}>START</span>
                            <span style={{ fontSize: '0.7rem', color: '#999', fontWeight: 800 }}>CURRENT</span>
                        </div>
                    </div>

                    {/* Cognitive Parameters */}
                    <div style={{ padding: '1rem' }}>
                        <h4 style={{ fontWeight: 900, marginBottom: '2rem', fontSize: '0.9rem' }}>COGNITIVE PARAMETERS</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            {params.map((p, i) => (
                                <div key={i}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 800, marginBottom: '5px' }}>
                                        <span>{p.label}</span>
                                        <span>{p.val}%</span>
                                    </div>
                                    <div style={{ height: '6px', background: '#f0f0f0', borderRadius: '3px' }}>
                                        <div style={{ width: `${p.val}%`, height: '100%', background: p.color, borderRadius: '3px', boxShadow: `0 0 10px ${p.color}44` }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {selectedStudent ? (
                    <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '3rem', borderTop: '1px solid #eee', paddingTop: '3rem' }}>
                        <div>
                            <h4 style={{ fontSize: '0.75rem', fontWeight: 900, color: '#999', marginBottom: '1.5rem', textTransform: 'uppercase' }}>Individual Mock Timeline (Date-wise)</h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {displayData.map((mock, idx) => (
                                    <div key={idx} style={{ padding: '1.5rem', border: '1px solid #f0f0f0', borderRadius: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div>
                                            <p style={{ fontSize: '0.65rem', fontWeight: 900, color: 'var(--primary)' }}>{mock.date}</p>
                                            <h5 style={{ fontWeight: 800, fontSize: '1rem' }}>{mock.title}</h5>
                                            <p style={{ fontSize: '0.75rem', color: '#666' }}>Type: {mock.type}</p>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <div style={{ fontSize: '1.2rem', fontWeight: 900, color: (mock.aiScore || 85) >= 80 ? '#10b981' : '#f59e0b' }}>{mock.aiScore || 85}%</div>
                                            <p style={{ fontSize: '0.65rem', fontWeight: 900, color: '#999' }}>AI RAW SCORE</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div style={{ background: '#fcfcfc', padding: '2rem', borderRadius: '24px', border: '1px dotted #e0e0e0' }}>
                            <h4 style={{ fontSize: '0.75rem', fontWeight: 900, color: '#999', marginBottom: '1.5rem', textTransform: 'uppercase' }}>AI Sentiment & Transcript Insight</h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                <div style={{ display: 'flex', gap: '15px' }}>
                                    <div style={{ width: '4px', background: '#10b981', borderRadius: '2px' }} />
                                    <div>
                                        <p style={{ fontSize: '0.7rem', fontWeight: 900, color: '#10b981' }}>STRENGTHS</p>
                                        <p style={{ fontSize: '0.85rem', color: '#444' }}>Strong grasp of the core concepts demonstrated in recent sessions. Confidence is trending upwards.</p>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: '15px' }}>
                                    <div style={{ width: '4px', background: '#f59e0b', borderRadius: '2px' }} />
                                    <div>
                                        <p style={{ fontSize: '0.7rem', fontWeight: 900, color: '#f59e0b' }}>GROWTH AREAS</p>
                                        <p style={{ fontSize: '0.85rem', color: '#444' }}>Needs to focus on complex edge cases and system scalability discussions during the design phase.</p>
                                    </div>
                                </div>
                                <div style={{ marginTop: '1rem', padding: '1rem', background: '#fff', borderRadius: '12px', border: '1px solid #eee' }}>
                                    <p style={{ fontSize: '0.7rem', fontWeight: 900, color: '#111', marginBottom: '8px' }}>LATEST AI OBSERVATION</p>
                                    <p style={{ fontSize: '0.75rem', color: '#777', fontStyle: 'italic', lineHeight: '1.5' }}>
                                        "Candidate showed exceptional resilience when refactoring the logic mid-interview. High adaptability marker."
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div style={{ textAlign: 'center', padding: '4rem', border: '2px dashed #f0f0f0', borderRadius: '24px' }}>
                        <Users size={32} style={{ color: '#ccc', marginBottom: '1rem' }} />
                        <p style={{ fontSize: '0.9rem', color: '#999', fontWeight: 800 }}>Global Batch Mode Active. Select a candidate above for individual drill-down.</p>
                    </div>
                )}
            </div>

            {/* --- GLOBAL BATCH STATS / INSIGHT CARDS --- */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
                <InsightCard 
                    title="Placement Readiness" 
                    value={readinessPct >= 75 ? "EXCELLENT" : (readinessPct >= 50 ? "GOOD" : "AVERAGE")} 
                    desc={`${readinessPct}% of ${selectedStudent ? 'sessions' : 'batch'} mimic production-grade logic.`} 
                    color="#10b981" 
                />
                <InsightCard 
                    title="Top Performance Blocker" 
                    value="Complex Logic" 
                    desc="Time complexity and optimization remain the primary hurdles in low-score sessions." 
                    color="#ef4444" 
                />
                <InsightCard 
                    title="Mock Saturation" 
                    value={`${saturationAvg} sessions`} 
                    desc="Average session completion per student across this assessment period." 
                    color="var(--primary)" 
                />
            </div>
        </div>
    );
}


function InsightCard({ title, value, desc, color }: any) {
    return (
        <div style={{ ...glassStyle, padding: '2rem', background: '#fff', borderLeft: `5px solid ${color}` }}>
            <p style={{ fontSize: '0.7rem', fontWeight: 900, color: '#999', textTransform: 'uppercase', marginBottom: '8px' }}>{title}</p>
            <h3 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#111', marginBottom: '10px' }}>{value}</h3>
            <p style={{ fontSize: '0.8rem', color: '#666', lineHeight: '1.5' }}>{desc}</p>
        </div>
    );
}

function RecordingsHistoryView({ interviews }: { interviews: any[] }) {
    const [selectedRec, setSelectedRec] = useState<any>(null);
    const [viewMode, setViewMode] = useState<'VIDEO' | 'TRANSCRIPT' | null>(null);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <h2 style={{ fontWeight: 900 }}>Mock Interview Archive</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '2rem' }}>
                {interviews.filter(i => i.status === 'COMPLETED').map(rec => (
                    <div key={rec.id || rec._id} style={{ ...glassStyle, padding: '1.5rem', background: '#fff' }}>
                        <div style={{ display: 'flex', gap: '15px', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <div style={{ padding: '12px', background: 'rgba(124, 58, 237, 0.1)', borderRadius: '12px', color: 'var(--primary)' }}><Video size={24} /></div>
                            <div>
                                <h4 style={{ fontWeight: 900 }}>{rec.title}</h4>
                                <p style={{ fontSize: '0.7rem', color: '#666' }}>{rec.date} • {rec.duration}m</p>
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <button 
                                onClick={() => { setSelectedRec(rec); setViewMode('VIDEO'); }}
                                className="btn-quantum" style={{ flex: 1, padding: '10px' }}
                            >
                                PLAY RECAP
                            </button>
                            <button 
                                onClick={() => { setSelectedRec(rec); setViewMode('TRANSCRIPT'); }}
                                style={{ ...secondaryBtnStyle, flex: 1 }}
                            >
                                AI TRANSCRIPT
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <AnimatePresence>
                {selectedRec && (
                    <div style={{ position: 'fixed', inset: 0, zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.85)', padding: '2rem' }}>
                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0 }} 
                            animate={{ scale: 1, opacity: 1 }} 
                            exit={{ scale: 0.9, opacity: 0 }}
                            style={{ ...glassStyle, width: '100%', maxWidth: '900px', maxHeight: '90vh', background: '#fff', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}
                        >
                            <div style={{ padding: '1.5rem', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <h3 style={{ fontWeight: 900 }}>{viewMode === 'VIDEO' ? 'Session Playback' : 'AI Performance Transcript'}</h3>
                                <button onClick={() => setSelectedRec(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><CloseIcon size={24} /></button>
                            </div>

                            <div style={{ flex: 1, overflowY: 'auto', padding: '2rem' }}>
                                {viewMode === 'VIDEO' ? (
                                    <div style={{ background: '#000', borderRadius: '16px', overflow: 'hidden', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', flexDirection: 'column', gap: '1rem', minHeight: '400px' }}>
                                        {selectedRec.recordedUrl ? (
                                            <video src={selectedRec.recordedUrl} controls autoPlay style={{ width: '100%', height: '100%', maxHeight: '500px' }} />
                                        ) : (
                                            <>
                                                <Play size={48} />
                                                <p style={{ fontWeight: 800 }}>Streaming: {selectedRec.title}</p>
                                                <p style={{ fontSize: '0.8rem', opacity: 0.6 }}>No real media source found. Using preview mode.</p>
                                            </>
                                        )}
                                    </div>
                                ) : (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                        {(selectedRec.transcript || [
                                            { time: "00:00", speaker: "System", text: "Transcript is being processed for this session..." }
                                        ]).map((line: any, i: number) => (
                                            <div key={i} style={{ display: 'flex', gap: '1rem', background: line.type === 'insight' ? 'rgba(79, 70, 229, 0.05)' : 'transparent', padding: line.type === 'insight' ? '1rem' : '0', borderRadius: '12px' }}>
                                                <span style={{ fontSize: '0.7rem', fontWeight: 900, color: 'var(--primary)', width: '45px' }}>{line.time}</span>
                                                <div>
                                                    <span style={{ fontSize: '0.75rem', fontWeight: 900, textTransform: 'uppercase', color: line.type === 'insight' ? 'var(--primary)' : '#111' }}>{line.speaker}</span>
                                                    <p style={{ fontSize: '0.9rem', color: '#444', marginTop: '4px', lineHeight: '1.6' }}>{line.text}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
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
