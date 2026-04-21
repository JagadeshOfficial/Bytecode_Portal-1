"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Clock, Shield, AlertCircle, CheckCircle, 
    ChevronRight, ChevronLeft, Maximize, 
    Camera, Monitor, User, Info, 
    X, Layout, Video, Activity, Zap
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

export default function TestExaminationEngine({ test, candidate, onComplete, onExit }: TestExaminationEngineProps) {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<string, any>>({});
    const [timeLeft, setTimeLeft] = useState(test?.duration * 60 || 1800); // Default 30 min
    const [isFullScreen, setIsFullScreen] = useState(false);
    const [violations, setViolations] = useState<any[]>([]);
    const [isCameraActive, setIsCameraActive] = useState(false);
    const [isScreenActive, setIsScreenActive] = useState(false);
    const [showWarning, setShowWarning] = useState<string | null>(null);
    
    const videoRef = useRef<HTMLVideoElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // --- PROCTORING LOGIC ---
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.hidden) {
                logViolation('TAB_SWITCH', 'Candidate switched tabs or minimized browser');
            }
        };

        const handleBlur = () => {
             logViolation('LOSED_FOCUS', 'Candidate lost focus on assessment window');
        };

        const handleResize = () => {
            if (window.innerWidth < 800 || window.innerHeight < 600) {
                 logViolation('WINDOW_RESIZE', 'Insecure window dimensions detected');
            }
        };

        window.addEventListener('visibilitychange', handleVisibilityChange);
        window.addEventListener('blur', handleBlur);
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('visibilitychange', handleVisibilityChange);
            window.removeEventListener('blur', handleBlur);
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    // Timer Logic
    useEffect(() => {
        if (timeLeft <= 0) {
            submitTest();
            return;
        }
        const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
        return () => clearInterval(timer);
    }, [timeLeft]);

    const logViolation = async (type: string, message: string) => {
        const log = {
            testId: test.id || test._id,
            candidateId: candidate.id || candidate._id,
            candidateName: candidate.fullName || candidate.name,
            type,
            message,
            timestamp: new Date()
        };
        
        setViolations(prev => [...prev, log]);
        setShowWarning(message);
        setTimeout(() => setShowWarning(null), 5000);

        // Send to backend
        await fetchJsonSafe('http://localhost:8080/api/academic/proctoring/logs', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
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

    const enterFullScreen = () => {
        if (containerRef.current?.requestFullscreen) {
            containerRef.current.requestFullscreen();
            setIsFullScreen(true);
        }
    };

    const handleAnswerSelect = (qId: string, value: any) => {
        setAnswers(prev => ({ ...prev, [qId]: value }));
    };

    const submitTest = async () => {
        // Calculate score for MCQs
        let score = 0;
        const total = test.questions?.length || 1;
        
        if (test.questions) {
            test.questions.forEach((q: any) => {
                if (answers[q.id] === q.correctOption) score++;
            });
        }
        
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
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(submission)
        });

        if (res.ok) {
            alert(`Test Submitted! Final Score: ${finalScore}%`);
            onComplete(submission);
        } else {
            alert("Submission failed. Please contact administrator.");
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

    if (!isFullScreen) {
        return (
            <div style={{ ...engineLayout.fixed, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.9)', color: '#fff' }}>
                <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} style={{ maxWidth: '600px', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    <Shield size={80} color="var(--primary)" style={{ margin: '0 auto' }} />
                    <h1 style={{ fontSize: '2.5rem', fontWeight: 900 }}>AI Proctoring Secure Protocol</h1>
                    <p style={{ fontSize: '1.1rem', opacity: 0.7 }}>This assessment is monitored by the Gemini AI Proctoring Engine. Tab switching, screen sharing, or leaving full-screen will be logged as violations.</p>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                        <div style={{ padding: '20px', borderRadius: '24px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
                            <Camera size={24} style={{ marginBottom: '10px' }} />
                            <div style={{ fontSize: '0.8rem', fontWeight: 800 }}>LIVE WEBCAM</div>
                        </div>
                        <div style={{ padding: '20px', borderRadius: '24px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
                            <Monitor size={24} style={{ marginBottom: '10px' }} />
                            <div style={{ fontSize: '0.8rem', fontWeight: 800 }}>TAB LOCKER</div>
                        </div>
                    </div>
                    <button 
                        onClick={() => { enterFullScreen(); startCamera(); }}
                        className="btn-quantum"
                        style={{ padding: '20px 40px', background: 'var(--primary)', fontSize: '1.2rem', borderRadius: '20px' }}
                    >
                        INITIATE ASSESSMENT
                    </button>
                    <button onClick={onExit} style={{ background: 'none', border: 'none', color: '#666', cursor: 'pointer', fontWeight: 800 }}>Cancel & Return</button>
                </motion.div>
            </div>
        );
    }

    return (
        <div ref={containerRef} style={engineLayout.fixed}>
            {/* Header */}
            <div style={{ padding: '1rem 3rem', background: '#fff', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <div style={{ width: 40, height: 40, borderRadius: '12px', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                        <Shield size={20} />
                    </div>
                    <div>
                        <h2 style={{ fontSize: '1rem', fontWeight: 900 }}>{test.name}</h2>
                        <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#666' }}>CANDIDATE: {candidate.fullName || candidate.name}</div>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '30px', alignItems: 'center' }}>
                    <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '0.65rem', fontWeight: 900, color: '#a0aec0' }}>TIME REMAINING</div>
                        <div style={{ fontSize: '1.4rem', fontWeight: 900, color: timeLeft < 300 ? '#ef4444' : '#1a202c' }}>{formatTime(timeLeft)}</div>
                    </div>
                    <button onClick={submitTest} className="btn-quantum" style={{ padding: '12px 30px', background: '#10b981', color: '#fff', borderRadius: '14px' }}>FINISH TEST</button>
                </div>
            </div>

            <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
                {/* Side Nav */}
                <div style={engineLayout.sidebar}>
                    <div style={{ flex: 1 }}>
                        <h4 style={{ fontSize: '0.8rem', fontWeight: 900, color: '#a0aec0', marginBottom: '1.5rem', textTransform: 'uppercase' }}>Navigation</h4>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '10px' }}>
                            {questions.map((_, i) => (
                                <button 
                                    key={i} 
                                    onClick={() => setCurrentQuestionIndex(i)}
                                    style={{ 
                                        width: '40px', 
                                        height: '40px', 
                                        borderRadius: '10px', 
                                        border: '1px solid #e2e8f0', 
                                        background: currentQuestionIndex === i ? 'var(--primary)' : (answers[questions[i].id] ? '#f1f5f9' : '#fff'),
                                        color: currentQuestionIndex === i ? '#fff' : '#1a202c',
                                        fontWeight: 800,
                                        cursor: 'pointer',
                                        fontSize: '0.8rem'
                                    }}
                                >
                                    {i + 1}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        <h4 style={{ fontSize: '0.8rem', fontWeight: 900, color: '#a0aec0', textTransform: 'uppercase' }}>Monitoring Hub</h4>
                        <div style={{ width: '100%', aspectRatio: '4/3', background: '#000', borderRadius: '20px', overflow: 'hidden', position: 'relative' }}>
                            <video ref={videoRef} autoPlay playsInline muted style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            <div style={{ position: 'absolute', top: '10px', left: '10px', ...proctoringIndicator(isCameraActive) }}>
                                {isCameraActive ? <CheckCircle size={12} /> : <AlertCircle size={12} />}
                                WEBCAM
                            </div>
                        </div>
                        <div style={{ background: '#f8fafc', padding: '15px', borderRadius: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#666' }}>AI Risk Index</span>
                                <span style={{ fontSize: '0.75rem', fontWeight: 900, color: violations.length > 2 ? '#ef4444' : '#10b981' }}>{violations.length * 15}%</span>
                            </div>
                            <div style={{ width: '100%', height: '6px', background: '#e2e8f0', borderRadius: '10px', overflow: 'hidden' }}>
                                <div style={{ width: `${violations.length * 15}%`, height: '100%', background: violations.length > 2 ? '#ef4444' : '#10b981' }}></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Area */}
                <div style={engineLayout.main}>
                    <AnimatePresence mode="wait">
                        <motion.div 
                            key={currentQuestionIndex}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            style={{ ...glassCard, flex: 1, display: 'flex', flexDirection: 'column' }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
                                <span style={{ padding: '6px 12px', background: '#f1f5f9', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 900, color: '#6366f1' }}>Question {currentQuestionIndex + 1} of {questions.length}</span>
                                <span style={{ fontSize: '0.75rem', fontWeight: 900, color: '#a0aec0' }}>{currentQuestion.type}</span>
                            </div>

                            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#1a202c', marginBottom: '3rem', lineHeight: 1.5 }}>
                                {currentQuestion.text}
                            </h3>

                            <div style={{ flex: 1 }}>
                                {currentQuestion.type === 'MCQ' && (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                        {currentQuestion.options?.map((opt, i) => (
                                            <button 
                                                key={i}
                                                onClick={() => handleAnswerSelect(currentQuestion.id, i)}
                                                style={{ 
                                                    padding: '20px', 
                                                    borderRadius: '16px', 
                                                    border: `2px solid ${answers[currentQuestion.id] === i ? 'var(--primary)' : '#e2e8f0'}`,
                                                    textAlign: 'left',
                                                    background: answers[currentQuestion.id] === i ? 'rgba(99, 102, 241, 0.05)' : '#fff',
                                                    fontWeight: 700,
                                                    cursor: 'pointer',
                                                    fontSize: '1rem',
                                                    transition: 'all 0.2s'
                                                }}
                                            >
                                                <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                                                    <div style={{ width: 24, height: 24, borderRadius: '50%', border: '2px solid currentColor', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                        {answers[currentQuestion.id] === i && <div style={{ width: 12, height: 12, borderRadius: '50%', background: 'currentColor' }}></div>}
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
                                        placeholder="Type your response here..."
                                        style={{ width: '100%', minHeight: '300px', padding: '2rem', borderRadius: '24px', border: '1px solid #e2e8f0', background: '#f8fafc', fontSize: '1.1rem', outline: 'none', resize: 'none' }}
                                    />
                                )}

                                {currentQuestion.type === 'CODE' && (
                                    <div style={{ background: '#0f172a', borderRadius: '24px', padding: '1.5rem', color: '#fff' }}>
                                        <div style={{ display: 'flex', gap: '10px', marginBottom: '1rem', opacity: 0.5 }}>
                                            <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#ff5f56' }}></div>
                                            <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#ffbd2e' }}></div>
                                            <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#27c93f' }}></div>
                                        </div>
                                        <textarea 
                                            value={answers[currentQuestion.id] || ''}
                                            onChange={e => handleAnswerSelect(currentQuestion.id, e.target.value)}
                                            spellCheck={false}
                                            style={{ width: '100%', height: '400px', background: 'transparent', border: 'none', color: '#38bdf8', fontSize: '1.1rem', fontFamily: 'monospace', outline: 'none', resize: 'none' }}
                                            placeholder="// Write your code here..."
                                        />
                                    </div>
                                )}
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4rem' }}>
                                <button 
                                    disabled={currentQuestionIndex === 0}
                                    onClick={() => setCurrentQuestionIndex(prev => prev - 1)}
                                    style={{ padding: '15px 30px', borderRadius: '15px', border: '1px solid #e2e8f0', background: '#fff', fontWeight: 800, cursor: 'pointer', opacity: currentQuestionIndex === 0 ? 0.5 : 1, display: 'flex', alignItems: 'center', gap: '10px' }}
                                >
                                    <ChevronLeft size={20} /> PREVIOUS
                                </button>
                                <button 
                                    onClick={() => currentQuestionIndex < questions.length - 1 ? setCurrentQuestionIndex(prev => prev + 1) : submitTest()}
                                    className="btn-quantum"
                                    style={{ padding: '15px 40px', background: currentQuestionIndex === questions.length - 1 ? '#10b981' : 'var(--primary)', borderRadius: '15px', display: 'flex', alignItems: 'center', gap: '10px' }}
                                >
                                    {currentQuestionIndex === questions.length - 1 ? 'FINAL SUBMIT' : 'NEXT QUESTION'} <ChevronRight size={20} />
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
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 50 }}
                        style={{ position: 'fixed', bottom: '50px', left: '50%', transform: 'translateX(-50%)', background: '#ef4444', color: '#fff', padding: '1.2rem 2rem', borderRadius: '20px', zIndex: 10000, display: 'flex', alignItems: 'center', gap: '15px', boxShadow: '0 20px 40px rgba(239, 68, 68, 0.3)' }}
                    >
                        <AlertCircle size={24} />
                        <div>
                            <div style={{ fontSize: '1rem', fontWeight: 900 }}>PROCTORING ALERT</div>
                            <div style={{ fontSize: '0.8rem', fontWeight: 600 }}>{showWarning}</div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <style jsx>{`
                @keyframes pulse {
                    0% { opacity: 0.4; }
                    50% { opacity: 1; }
                    100% { opacity: 0.4; }
                }
            `}</style>
        </div>
    );
}
