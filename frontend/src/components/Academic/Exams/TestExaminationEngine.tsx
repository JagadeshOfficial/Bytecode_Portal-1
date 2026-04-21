"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Clock, Shield, AlertCircle, CheckCircle, 
    ChevronRight, ChevronLeft, Maximize, 
    Camera, Monitor, User, Info, 
    X, Layout, Video, Activity, Zap,
    LogOut, Award, AlertTriangle, Play
} from 'lucide-react';
import { fetchJsonSafe } from '@/lib/fetchJson';

// --- STYLES ---
const engineLayout = {
    fixed: {
        position: 'fixed' as const,
        inset: 0,
        background: '#f8fafc',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column' as const,
    },
    sidebar: {
        width: '320px',
        background: '#fff',
        borderLeft: '1px solid #e2e8f0',
        padding: '1.5rem',
        display: 'flex',
        flexDirection: 'column' as const,
        gap: '2rem'
    },
    main: {
        flex: 1,
        padding: '3rem',
        overflowY: 'auto' as const,
        display: 'flex',
        flexDirection: 'column' as const,
        gap: '2.5rem'
    }
};

const glassCard = {
    background: 'rgba(255, 255, 255, 0.8)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(0,0,0,0.05)',
    borderRadius: '24px',
    padding: '2rem'
};

const proctoringIndicator = (active: boolean) => ({
    padding: '6px 12px',
    borderRadius: '10px',
    background: active ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
    color: active ? '#10b981' : '#ef4444',
    fontSize: '0.7rem',
    fontWeight: 900,
    display: 'flex',
    alignItems: 'center',
    gap: '6px'
});

interface Question {
    id: string;
    text: string;
    options?: string[];
    correctOption?: number;
    type: 'MCQ' | 'TEXT' | 'CODE';
}

interface TestExaminationEngineProps {
    test: any;
    candidate: any;
    onComplete: (submission: any) => void;
    onExit: () => void;
}

type EngineStatus = 'ORIENTATION' | 'EXAMINING' | 'COMPLETED' | 'TERMINATED';

export default function TestExaminationEngine({ test, candidate, onComplete, onExit }: TestExaminationEngineProps) {
    const [status, setStatus] = useState<EngineStatus>('ORIENTATION');
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<string, any>>({});
    const [timeLeft, setTimeLeft] = useState(test?.duration * 60 || 1800);
    const [isFullScreen, setIsFullScreen] = useState(false);
    const [violations, setViolations] = useState<any[]>([]);
    const [isCameraActive, setIsCameraActive] = useState(false);
    const [showWarning, setShowWarning] = useState<string | null>(null);
    const [termReason, setTermReason] = useState<string | null>(null);
    const [results, setResults] = useState<any>(null);
    
    const videoRef = useRef<HTMLVideoElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // --- PROCTORING LOGIC ---
    useEffect(() => {
        if (status !== 'EXAMINING') return;

        const handleVisibilityChange = () => {
            if (document.hidden) {
                logViolation('TAB_SWITCH', 'Candidate switched tabs or minimized browser');
            }
        };

        const handleBlur = () => {
             logViolation('LOSED_FOCUS', 'Candidate lost focus on assessment window');
        };

        window.addEventListener('visibilitychange', handleVisibilityChange);
        window.addEventListener('blur', handleBlur);

        return () => {
            window.removeEventListener('visibilitychange', handleVisibilityChange);
            window.removeEventListener('blur', handleBlur);
        };
    }, [status]);

    // Timer Logic
    useEffect(() => {
        if (status !== 'EXAMINING') return;
        if (timeLeft <= 0) {
            submitTest();
            return;
        }
        const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
        return () => clearInterval(timer);
    }, [timeLeft, status]);

    // Remote Termination Mocking (Simulation)
    useEffect(() => {
        if (status === 'EXAMINING') {
            const checkTermination = setInterval(async () => {
                // In a real app, we'd poll or use WebSockets
                // Simulated termination check:
                if (violations.length > 10) {
                    handleRemoteTerminate("Critical integrity violations detected via AI monitoring.");
                }
            }, 5000);
            return () => clearInterval(checkTermination);
        }
    }, [status, violations]);

    const handleRemoteTerminate = (reason: string) => {
        setTermReason(reason);
        setStatus('TERMINATED');
        if (document.exitFullscreen && document.fullscreenElement) {
            document.exitFullscreen();
        }
    };

    const logViolation = async (type: string, message: string) => {
        const log = {
            testId: test.id || test._id,
            testName: test.name,
            candidateId: candidate.id || candidate._id,
            candidateName: candidate.fullName || candidate.name,
            type,
            message,
            timestamp: new Date()
        };
        
        setViolations(prev => [...prev, log]);
        setShowWarning(message);
        setTimeout(() => setShowWarning(null), 5000);

        await fetchJsonSafe('http://localhost:8080/api/academic/proctoring/logs', {
            method: 'POST',
            body: JSON.stringify(log)
        });
    };

    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                setIsCameraActive(true);
            }
        } catch (err) {
            console.error("Camera failed", err);
            logViolation('CAMERA_ERROR', 'Unable to access camera for proctoring');
        }
    };

    const initiateTest = () => {
        if (containerRef.current?.requestFullscreen) {
            containerRef.current.requestFullscreen();
            setIsFullScreen(true);
        }
        startCamera();
        logViolation('SESSION_START', 'Candidate initiated assessment session'); 
        setStatus('EXAMINING');
    };

    const handleAnswerSelect = (qId: string, value: any) => {
        setAnswers(prev => ({ ...prev, [qId]: value }));
    };

    const submitTest = async () => {
        let score = 0;
        const total = (test.questions || questions).length;
        
        const currentQs = test.questions || questions;
        currentQs.forEach((q: any) => {
            if (answers[q.id] === q.correctOption) score++;
        });
        
        const finalScore = Math.round((score / total) * 100);

        const submission = {
            testId: test.id || test._id,
            testName: test.name,
            candidateId: candidate.id || candidate._id,
            candidateName: candidate.fullName || candidate.name,
            answers,
            violations,
            score: finalScore,
            status: 'COMPLETED'
        };

        const res = await fetchJsonSafe('http://localhost:8080/api/academic/test-submissions', {
            method: 'POST',
            body: JSON.stringify(submission)
        });

        if (res.ok) {
            setResults(submission);
            setStatus('COMPLETED');
            if (document.exitFullscreen && document.fullscreenElement) {
                document.exitFullscreen();
            }
        } else {
            alert("Submission failed. Network divergence detected.");
        }
    };

    const questions: Question[] = test.questions || [
        { id: '1', text: 'Which of the following is not a primitive data type in Java?', options: ['int', 'boolean', 'String', 'char'], correctOption: 2, type: 'MCQ' },
        { id: '2', text: 'Explain the difference between interface and abstract class in Java.', type: 'TEXT' },
        { id: '3', text: 'Write a program to reverse a linked list.', type: 'CODE' }
    ];

    const currentQuestion = questions[currentQuestionIndex];

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    };

    // --- RENDERERS ---

    if (status === 'ORIENTATION') {
        return (
            <div style={{ ...engineLayout.fixed, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'radial-gradient(circle at center, #1e1b4b, #030617)', color: '#fff' }}>
                <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} style={{ maxWidth: '700px', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '3rem', padding: '40px' }}>
                    <div style={{ marginBottom: '20px' }}>
                        <motion.div 
                            animate={{ rotate: 360 }} 
                            transition={{ repeat: Infinity, duration: 20, ease: 'linear' }}
                            style={{ width: 120, height: 120, borderRadius: '40px', border: '2px solid rgba(139, 92, 246, 0.3)', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}
                        >
                            <Shield size={60} color="#8b5cf6" />
                        </motion.div>
                    </div>
                    
                    <div>
                        <h1 style={{ fontSize: '3rem', fontWeight: 900, letterSpacing: '-1px', marginBottom: '1rem' }}>Online Exam System</h1>
                        <p style={{ fontSize: '1.1rem', opacity: 0.6, lineHeight: 1.6 }}>Please stay in full-screen mode during the test. Your camera and browser activity will be monitored for security. Do not switch tabs or minimize the window.</p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
                        {[
                            { icon: <Camera />, label: 'CAMERA FEED' },
                            { icon: <Monitor />, label: 'BROWSER LOCK' },
                            { icon: <Zap />, label: 'LIVE MONITOR' }
                        ].map((item, i) => (
                            <div key={i} style={{ padding: '24px', borderRadius: '30px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                                <div style={{ color: '#8b5cf6', marginBottom: '12px' }}>{item.icon}</div>
                                <div style={{ fontSize: '0.65rem', fontWeight: 900, letterSpacing: '1.5px' }}>{item.label}</div>
                            </div>
                        ))}
                    </div>

                    <div style={{ marginTop: '20px', display: 'flex', gap: '15px', justifyContent: 'center' }}>
                        <button onClick={onExit} style={{ padding: '20px 40px', borderRadius: '24px', background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', fontWeight: 800, cursor: 'pointer' }}>CANCEL</button>
                        <button 
                            onClick={initiateTest}
                            className="btn-quantum"
                            style={{ padding: '20px 60px', background: '#6d28d9', fontSize: '1.1rem', borderRadius: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}
                        >
                            <Play size={20} /> START EXAM NOW
                        </button>
                    </div>
                </motion.div>
            </div>
        );
    }

    if (status === 'TERMINATED') {
        return (
            <div style={{ ...engineLayout.fixed, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff1f2', color: '#991b1b' }}>
                <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} style={{ maxWidth: '500px', textAlign: 'center', padding: '40px' }}>
                    <AlertTriangle size={80} style={{ margin: '0 auto 30px' }} />
                    <h1 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '20px' }}>EXAM STOPPED</h1>
                    <div style={{ padding: '24px', background: '#fff', borderRadius: '24px', border: '1px solid #fecaca', marginBottom: '30px' }}>
                        <p style={{ fontSize: '0.8rem', fontWeight: 900, color: '#ef4444', marginBottom: '8px', textTransform: 'uppercase' }}>Reason</p>
                        <p style={{ fontSize: '1rem', fontWeight: 700, color: '#1a202c' }}>{termReason || "The administrator has stopped your exam."}</p>
                    </div>
                    <button onClick={onExit} style={{ width: '100%', padding: '20px', background: '#ef4444', color: '#fff', borderRadius: '20px', border: 'none', fontWeight: 900, cursor: 'pointer' }}>CLOSE WINDOW</button>
                </motion.div>
            </div>
        );
    }

    if (status === 'COMPLETED') {
        return (
            <div style={{ ...engineLayout.fixed, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fcfaff' }}>
                <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} style={{ maxWidth: '600px', width: '100%', textAlign: 'center', padding: '40px' }}>
                    <div style={{ width: 100, height: 100, borderRadius: '40px', background: '#dcfce7', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 30px' }}>
                        <Award size={60} />
                    </div>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: 900, color: '#1e1b4b', marginBottom: '10px' }}>Exam Finished</h1>
                    <p style={{ color: '#94a3b8', fontWeight: 700, marginBottom: '40px' }}>Your answers have been submitted successfully.</p>
                    
                    <div style={{ background: '#fff', borderRadius: '35px', padding: '40px', border: '1px solid rgba(139, 92, 246, 0.1)', boxShadow: '0 20px 50px rgba(109, 40, 217, 0.05)' }}>
                        <div style={{ fontSize: '0.8rem', fontWeight: 900, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '20px' }}>Your Score</div>
                        <div style={{ fontSize: '4rem', fontWeight: 900, color: '#6d28d9' }}>{results?.score}%</div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '40px' }}>
                            <div style={{ padding: '20px', background: '#f8fafc', borderRadius: '24px', textAlign: 'center' }}>
                                <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#1e1b4b' }}>{Object.keys(results?.answers || {}).length}</div>
                                <div style={{ fontSize: '0.65rem', fontWeight: 800, color: '#94a3b8' }}>ANSWERS GIVEN</div>
                            </div>
                            <div style={{ padding: '20px', background: '#f8fafc', borderRadius: '24px', textAlign: 'center' }}>
                                <div style={{ fontSize: '1.2rem', fontWeight: 900, color: violations.length > 2 ? '#ef4444' : '#10b981' }}>{violations.length}</div>
                                <div style={{ fontSize: '0.65rem', fontWeight: 800, color: '#94a3b8' }}>WARNINGS</div>
                            </div>
                        </div>
                    </div>
                    
                    <button onClick={onExit} style={{ marginTop: '40px', padding: '20px 40px', background: '#1e1b4b', color: '#fff', borderRadius: '20px', border: 'none', fontWeight: 900, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px', margin: '40px auto 0' }}>
                        GO TO DASHBOARD <LogOut size={18} />
                    </button>
                </motion.div>
            </div>
        );
    }

    return (
        <div ref={containerRef} style={engineLayout.fixed}>
            {/* Header */}
            <div style={{ padding: '1rem 3rem', background: '#fff', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <Shield size={24} color="#6d28d9" />
                    <div>
                        <h2 style={{ fontSize: '1rem', fontWeight: 900 }}>{test.name}</h2>
                        <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#666' }}>STUDENT: {candidate.fullName || candidate.name}</div>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '40px', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#10b981', boxShadow: '0 0 10px #10b981' }} />
                        <span style={{ fontSize: '0.75rem', fontWeight: 900, color: '#10b981' }}>LIVE MONITORING ACTIVE</span>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '0.65rem', fontWeight: 900, color: '#a0aec0' }}>TIME LEFT</div>
                        <div style={{ fontSize: '1.4rem', fontWeight: 900, color: timeLeft < 300 ? '#ef4444' : '#1a202c' }}>{formatTime(timeLeft)}</div>
                    </div>
                    <button onClick={submitTest} className="btn-quantum" style={{ padding: '14px 35px', background: '#ef4444', color: '#fff', borderRadius: '16px', fontSize: '0.85rem' }}>FINISH & SUBMIT</button>
                </div>
            </div>

            <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
                {/* Simplified Sidebar */}
                <div style={engineLayout.sidebar}>
                    <div style={{ flex: 1 }}>
                        <h4 style={{ fontSize: '0.8rem', fontWeight: 900, color: '#a0aec0', marginBottom: '1.5rem', textTransform: 'uppercase' }}>All Questions</h4>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '10px' }}>
                            {questions.map((_, i) => (
                                <button 
                                    key={i} 
                                    onClick={() => setCurrentQuestionIndex(i)}
                                    style={{ 
                                        width: '40px', 
                                        height: '40px', 
                                        borderRadius: '12px', 
                                        border: '1px solid #e2e8f0', 
                                        background: currentQuestionIndex === i ? '#6d28d9' : (answers[questions[i].id] ? '#f1f5f9' : '#fff'),
                                        color: currentQuestionIndex === i ? '#fff' : '#1a202c',
                                        fontWeight: 800, cursor: 'pointer', fontSize: '0.8rem'
                                    }}
                                >
                                    {i + 1}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div style={{ marginTop: 'auto' }}>
                        <div style={{ width: '100%', aspectRatio: '4/3', background: '#000', borderRadius: '24px', overflow: 'hidden', position: 'relative' }}>
                            <video ref={videoRef} autoPlay playsInline muted style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            <div style={{ position: 'absolute', top: '12px', left: '12px', ...proctoringIndicator(isCameraActive) }}>
                                <Camera size={12} /> CAMERA FEED
                            </div>
                        </div>
                    </div>
                </div>

                <div style={engineLayout.main}>
                    <AnimatePresence mode="wait">
                        <motion.div 
                            key={currentQuestionIndex}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            style={{ ...glassCard, flex: 1, display: 'flex', flexDirection: 'column' }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2.5rem' }}>
                                <span style={{ padding: '8px 16px', background: '#f5f3ff', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 900, color: '#6d28d9' }}>Question {currentQuestionIndex + 1}</span>
                                <span style={{ fontSize: '0.75rem', fontWeight: 900, color: '#94a3b8', textTransform: 'uppercase' }}>{currentQuestion.type}</span>
                            </div>

                            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1e1b4b', marginBottom: '3rem', lineHeight: 1.5 }}>
                                {currentQuestion.text}
                            </h3>

                            <div style={{ flex: 1 }}>
                                {currentQuestion.type === 'MCQ' && (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                                        {currentQuestion.options?.map((opt, i) => (
                                            <button 
                                                key={i}
                                                onClick={() => handleAnswerSelect(currentQuestion.id, i)}
                                                style={{ 
                                                    padding: '24px', borderRadius: '20px', 
                                                    border: `2px solid ${answers[currentQuestion.id] === i ? '#6d28d9' : '#f1f5f9'}`,
                                                    textAlign: 'left',
                                                    background: answers[currentQuestion.id] === i ? '#fcfaff' : '#fff',
                                                    fontWeight: 700, cursor: 'pointer', fontSize: '1rem', transition: '0.2s'
                                                }}
                                            >
                                                <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                                                    <div style={{ width: 22, height: 22, borderRadius: '8px', border: '2px solid currentColor', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                        {answers[currentQuestion.id] === i && <div style={{ width: 10, height: 10, borderRadius: '4px', background: 'currentColor' }}></div>}
                                                    </div>
                                                    {opt}
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                )}

                                {currentQuestion.type === 'TEXT' && (
                                    <textarea 
                                        value={answers[currentQuestion.id] || ''}
                                        onChange={e => handleAnswerSelect(currentQuestion.id, e.target.value)}
                                        placeholder="Type your answer here..."
                                        style={{ width: '100%', minHeight: '350px', padding: '2rem', borderRadius: '28px', border: '1px solid #f1f5f9', background: '#fcfaff', fontSize: '1.1rem', outline: 'none', resize: 'none' }}
                                    />
                                )}

                                {currentQuestion.type === 'CODE' && (
                                    <div style={{ background: '#030617', borderRadius: '30px', padding: '2rem', color: '#fff', border: '1px solid rgba(139, 92, 246, 0.2)' }}>
                                        <textarea 
                                            value={answers[currentQuestion.id] || ''}
                                            onChange={e => handleAnswerSelect(currentQuestion.id, e.target.value)}
                                            spellCheck={false}
                                            style={{ width: '100%', height: '400px', background: 'transparent', border: 'none', color: '#8b5cf6', fontSize: '1.1rem', fontFamily: 'monospace', outline: 'none', resize: 'none' }}
                                            placeholder="// Write your code here..."
                                        />
                                    </div>
                                )}
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4rem' }}>
                                <button 
                                    disabled={currentQuestionIndex === 0}
                                    onClick={() => setCurrentQuestionIndex(prev => prev - 1)}
                                    style={{ padding: '18px 35px', borderRadius: '18px', border: '1px solid #f1f5f9', background: '#fff', fontWeight: 800, cursor: 'pointer', opacity: currentQuestionIndex === 0 ? 0.4 : 1, display: 'flex', alignItems: 'center', gap: '10px' }}
                                >
                                    <ChevronLeft size={20} /> PREVIOUS
                                </button>
                                <button 
                                    onClick={() => currentQuestionIndex < questions.length - 1 ? setCurrentQuestionIndex(prev => prev + 1) : submitTest()}
                                    className="btn-quantum"
                                    style={{ padding: '18px 50px', background: currentQuestionIndex === questions.length - 1 ? '#10b981' : '#6d28d9', borderRadius: '18px', display: 'flex', alignItems: 'center', gap: '12px' }}
                                >
                                    {currentQuestionIndex === questions.length - 1 ? 'SUBMIT TEST' : 'NEXT QUESTION'} <ChevronRight size={20} />
                                </button>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>

            {/* Warning Overlay */}
            <AnimatePresence>
                {showWarning && (
                    <motion.div 
                        initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 50 }}
                        style={{ position: 'fixed', bottom: '40px', left: '50%', transform: 'translateX(-50%)', background: '#ef4444', color: '#fff', padding: '1.5rem 2.5rem', borderRadius: '24px', zIndex: 10000, display: 'flex', alignItems: 'center', gap: '15px' }}
                    >
                        <AlertCircle size={24} />
                        <div>
                            <div style={{ fontSize: '1rem', fontWeight: 900 }}>SECURITY WARNING</div>
                            <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{showWarning}</div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
