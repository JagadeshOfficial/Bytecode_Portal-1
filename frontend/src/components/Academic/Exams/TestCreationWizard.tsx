"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    X, Check, ChevronRight, ChevronLeft,
    Plus, Trash2, Code, FileText,
    Zap, Shield, Clock, Award,
    Globe, Smartphone, Monitor, Info, Video, Layers, Users, Sparkles, Target
} from 'lucide-react';

export default function TestCreationWizard({ onClose }: { onClose: () => void }) {
    const [step, setStep] = useState(1);
    const steps = [
        { id: 1, label: 'Objective', icon: <Target size={18} /> },
        { id: 2, label: 'Format', icon: <Award size={18} /> },
        { id: 3, label: 'AI Assistant', icon: <Sparkles size={18} /> },
        { id: 4, label: 'Builder', icon: <Plus size={18} /> },
        { id: 5, label: 'Security', icon: <Shield size={18} /> },
        { id: 6, label: 'Scoring', icon: <Zap size={18} /> },
        { id: 7, label: 'Distribution', icon: <Users size={18} /> },
        { id: 8, label: 'Publish', icon: <Check size={18} /> }
    ];

    const phases = [
        { name: 'STEP 1: CONFIGURATION', steps: [1, 2] },
        { name: 'STEP 2: AI & QUESTIONS', steps: [3, 4] },
        { name: 'STEP 3: EXAM SECURITY', steps: [5, 6, 7, 8] }
    ];

    const [testData, setTestData] = useState({
        title: '',
        name: '',
        description: '',
        difficulty: 'INTERMEDIATE',
        tags: [] as string[],
        courseId: '',
        courseName: '',
        batchId: '',
        batchName: '',
        type: 'MCQ',
        questions: [] as any[],
        proctoring: {
            screenLock: true,
            tabTracking: true,
            faceDetection: true,
            noiseDetection: false
        },
        evaluation: {
            negativeMarking: false,
            markingValue: 25,
            passPercentage: 60,
            allowReview: true
        },
        assignment: {
            mode: 'ALL', 
            studentIds: [] as string[]
        }
    });

    const [aiPrompt, setAiPrompt] = useState('');
    const [aiCount, setAiCount] = useState(5);
    const [aiFormats, setAiFormats] = useState(['MCQ']);
    const [isGenerating, setIsGenerating] = useState(false);

    const [courses, setCourses] = useState<any[]>([]);
    const [batches, setBatches] = useState<any[]>([]);
    const [students, setStudents] = useState<any[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [bRes, uRes] = await Promise.all([
                    fetch('http://localhost:8080/api/academic/batches'),
                    fetch('http://localhost:8080/api/users')
                ]);
                
                if (bRes.ok) {
                    const bData = await bRes.json();
                    setBatches(bData);
                    const uniqueCourses = Array.from(new Set(bData.map((b: any) => b.courseName))).map(name => {
                        const batch = bData.find((b: any) => b.courseName === name);
                        return { id: batch.courseId, name: batch.courseName };
                    });
                    setCourses(uniqueCourses);
                }

                if (uRes.ok) {
                    const uData = await uRes.json();
                    setStudents(uData.filter((u: any) => u.role === 'STUDENT' || u.role === 'student'));
                }
            } catch (err) {
                console.error(err);
            }
        };
        fetchData();
    }, []);

    const nextStep = () => step < 8 && setStep(s => s + 1);
    const prevStep = () => step > 1 && setStep(s => s - 1);

    const inputStyle = {
        width: '100%',
        padding: '18px 24px',
        borderRadius: '20px',
        border: '1px solid #e2e8f0',
        background: '#f8fafc',
        fontSize: '0.9rem',
        fontWeight: 800,
        outline: 'none',
        transition: 'all 0.3s'
    };

    const handlePublish = async () => {
        try {
            const finalData = { ...testData, name: testData.title };
            const res = await fetch('http://localhost:8080/api/academic/tests', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(finalData)
            });
            if (res.ok) {
                alert("Assessment Distributed & Published Successfully!");
                onClose();
            }
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div style={{ position: 'fixed', inset: 0, zIndex: 11000, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(15, 23, 42, 0.8)', backdropFilter: 'blur(12px)' }}>
            <motion.div 
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ 
                    width: '98%', 
                    maxWidth: '1150px', 
                    height: '92vh',
                    maxHeight: '900px',
                    background: '#fff', 
                    borderRadius: '40px', 
                    boxShadow: '0 40px 100px rgba(0,0,0,0.3)',
                    overflow: 'hidden',
                    display: 'grid',
                    gridTemplateColumns: '320px 1fr'
                }}
            >
                {/* --- SIDEBAR --- */}
                <div style={{ background: '#fdfdfe', padding: '3.5rem 2.5rem', borderRight: '1px solid #f1f5f9', display: 'flex', flexDirection: 'column', gap: '3rem' }}>
                    <div>
                        <h3 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.5px' }}>TEST CREATOR</h3>
                        <p style={{ fontSize: '0.65rem', fontWeight: 900, color: '#94a3b8', letterSpacing: '1px', marginTop: '4px' }}>ONLINE TEST BUILDER</p>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '35px' }}>
                        {phases.map((ph, pi) => (
                            <div key={pi} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                <div style={{ fontSize: '0.65rem', fontWeight: 900, color: '#94a3b8', letterSpacing: '2px' }}>{ph.name}</div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    {steps.filter(s => ph.steps.includes(s.id)).map(s => (
                                        <div 
                                            key={s.id} 
                                            style={{ 
                                                display: 'flex', 
                                                alignItems: 'center', 
                                                gap: '12px', 
                                                color: step === s.id ? 'var(--primary)' : (step > s.id ? '#10b981' : '#94a3b8'), 
                                                opacity: ph.steps.includes(step) || step > s.id ? 1 : 0.6,
                                                transition: 'all 0.4s' 
                                            }}
                                        >
                                            <div style={{ 
                                                width: 32, 
                                                height: 32, 
                                                borderRadius: '12px', 
                                                background: step === s.id ? 'var(--primary)15' : (step > s.id ? '#10b98115' : '#f1f5f9'), 
                                                border: `2.5px solid ${step === s.id ? 'var(--primary)' : (step > s.id ? '#10b981' : '#e2e8f0')}`,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                fontSize: '0.9rem'
                                            }}>
                                                {step > s.id ? <Check size={16} strokeWidth={3} /> : s.icon}
                                            </div>
                                            <span style={{ fontSize: '0.9rem', fontWeight: 900, fontFamily: 'Outfit, sans-serif' }}>{s.label}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>


                </div>

                {/* --- MAIN SEQUENTIAL TERMINAL --- */}
                <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#fff', position: 'relative' }}>
                    <div style={{ flexShrink: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '2rem 3rem 1rem 3rem' }}>
                         <div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                  <div style={{ background: '#f1f5f9', padding: '8px 16px', borderRadius: '12px', fontSize: '0.7rem', fontWeight: 900, color: '#64748b' }}>FLOW STATE: {((step/8)*100).toFixed(0)}%</div>
                                  <div style={{ width: '160px', height: '6px', background: '#f1f5f9', borderRadius: '3px', position: 'relative', overflow: 'hidden' }}>
                                      <motion.div initial={{ width: 0 }} animate={{ width: `${(step/8)*100}%` }} style={{ position: 'absolute', inset: 0, background: 'var(--primary)', borderRadius: '3px' }} />
                                  </div>
                              </div>
                              <h2 style={{ fontSize: '1.8rem', fontWeight: 900, marginTop: '1rem', color: '#0f172a', letterSpacing: '-0.5px' }}>{steps[step-1].label}</h2>
                         </div>
                         <button onClick={onClose} style={{ border: 'none', background: '#f8fafc', padding: '14px', borderRadius: '18px', cursor: 'pointer', color: '#64748b', transition: 'all 0.3s' }} className="hover-scale"><X size={26} /></button>
                    </div>

                    <div style={{ flex: 1, overflowY: 'auto', padding: '0.5rem 3rem 2rem 3rem', minHeight: 0 }} className="custom-scroll">
                        <AnimatePresence mode="wait">
                            {step === 1 && (
                                <motion.div key={`step-${step}`} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '30px' }}>
                                         <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                             <label style={{ fontSize: '0.75rem', fontWeight: 900, color: '#64748b' }}>ASSESSMENT TITLE</label>
                                             <input style={inputStyle} placeholder="e.g., Enterprise Architecture Masterclass" value={testData.title} onChange={(e) => setTestData({...testData, title: e.target.value})} />
                                         </div>
                                         <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                             <label style={{ fontSize: '0.75rem', fontWeight: 900, color: '#64748b' }}>CURRICULUM CATEGORY</label>
                                             <select style={inputStyle} value={testData.courseId} onChange={(e) => setTestData({...testData, courseId: e.target.value, courseName: e.target.options[e.target.selectedIndex].text})}>
                                                 <option value="">Map to Course...</option>
                                                 {courses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                             </select>
                                         </div>
                                    </div>

                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                            <label style={{ fontSize: '0.75rem', fontWeight: 900, color: '#64748b' }}>DIFFICULTY CALIBRATION</label>
                                            <div style={{ display: 'flex', gap: '10px' }}>
                                                {['BEGINNER', 'INTERMEDIATE', 'ADVANCED'].map(d => (
                                                    <button 
                                                        key={d} 
                                                        onClick={() => setTestData({...testData, difficulty: d})}
                                                        style={{ 
                                                            flex: 1, padding: '14px', borderRadius: '15px', 
                                                            border: `2px solid ${testData.difficulty === d ? 'var(--primary)' : '#f1f5f9'}`,
                                                            background: testData.difficulty === d ? 'var(--primary)10' : '#fff',
                                                            color: testData.difficulty === d ? 'var(--primary)' : '#94a3b8',
                                                            fontSize: '0.75rem', fontWeight: 900, cursor: 'pointer'
                                                        }}
                                                    >
                                                        {d}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                             <label style={{ fontSize: '0.75rem', fontWeight: 900, color: '#64748b' }}>SKILL MAPPING (TAGS)</label>
                                             <input 
                                                style={inputStyle} 
                                                placeholder="React, JS, Redux" 
                                                value={testData.tags.join(', ')} 
                                                onChange={(e) => setTestData({...testData, tags: e.target.value.split(',').map(s => s.trim()).filter(s => s !== '')})}
                                             />
                                         </div>
                                    </div>

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                        <label style={{ fontSize: '0.75rem', fontWeight: 900, color: '#64748b' }}>DESCRIPTION & OVERVIEW</label>
                                        <textarea style={{ ...inputStyle, height: '120px', resize: 'none' }} placeholder="Provide a detailed overview for the candidates..." value={testData.description} onChange={(e) => setTestData({...testData, description: e.target.value})} />
                                    </div>
                                </motion.div>
                            )}

                            {step === 2 && (
                                <motion.div key={`step-${step}`} initial={{ opacity: 0, scale: 1.05 }} animate={{ opacity: 1, scale: 1 }} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                                    {[
                                        { type: 'MCQ', icon: <FileText size={36} />, label: 'Standard MCQ', desc: 'Single or multi-correct options.' },
                                        { type: 'CODING', icon: <Code size={36} />, label: 'Dev Protocol', desc: 'Secure browser-based IDE challenges.' },
                                        { type: 'VIDEO', icon: <Video size={36} />, label: 'Audio/Visual', desc: 'Candidate recorded presentations.' },
                                        { type: 'HYBRID', icon: <Layers size={36} />, label: 'Quantum Hybrid', desc: 'Proprietary multi-module evaluation.' }
                                    ].map((t, i) => (
                                        <div key={i} onClick={() => setTestData({...testData, type: t.type})} style={{ padding: '2.5rem', border: `3px solid ${testData.type === t.type ? 'var(--primary)' : '#f1f5f9'}`, borderRadius: '35px', cursor: 'pointer', background: testData.type === t.type ? 'var(--primary)05' : '#fff', position: 'relative' }}>
                                            {testData.type === t.type && (
                                                <div style={{ position: 'absolute', top: 20, right: 20, width: 24, height: 24, borderRadius: '50%', background: 'var(--primary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                    <Check size={14} strokeWidth={4} />
                                                </div>
                                            )}
                                            <div style={{ color: testData.type === t.type ? 'var(--primary)' : '#e2e8f0', marginBottom: '20px' }}>{t.icon}</div>
                                            <div style={{ fontWeight: 900, color: '#0f172a', fontSize: '1.2rem', marginBottom: '6px' }}>{t.label}</div>
                                            <div style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 700 }}>{t.desc}</div>
                                        </div>
                                    ))}
                                </motion.div>
                            )}

                            {step === 3 && (
                                <motion.div key={`step-${step}`} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
                                    <div style={{ background: 'linear-gradient(135deg, #0ea5e9, #6366f1)', padding: '4rem', borderRadius: '45px', color: '#fff', position: 'relative', overflow: 'hidden' }}>
                                        <div style={{ position: 'absolute', top: -50, right: -50, width: 200, height: 200, background: 'rgba(255,255,255,0.1)', borderRadius: '50%' }} />
                                        
                                        <div style={{ display: 'flex', gap: '2rem', alignItems: 'center', marginBottom: '2.5rem' }}>
                                            <div style={{ width: 60, height: 60, borderRadius: '20px', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <Sparkles size={32} />
                                            </div>
                                            <div>
                                                <h4 style={{ fontWeight: 900, fontSize: '1.5rem' }}>AI INTELLIGENCE SUITE</h4>
                                                <p style={{ fontSize: '0.9rem', opacity: 0.8, fontWeight: 700 }}>Intelligent multi-modal curriculum fabrication.</p>
                                            </div>
                                        </div>

                                        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(200px, 1fr) 2fr', gap: '2.5rem', marginBottom: '2rem' }}>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                                <label style={{ fontSize: '0.75rem', fontWeight: 900, opacity: 0.9, letterSpacing: '1px' }}>ITEM QUANTITY</label>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '15px', background: 'rgba(255,255,255,0.15)', padding: '10px 20px', borderRadius: '20px' }}>
                                                    <button onClick={() => setAiCount(Math.max(1, aiCount - 1))} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}><ChevronLeft size={20} /></button>
                                                    <span style={{ fontSize: '1.4rem', fontWeight: 900, minWidth: '40px', textAlign: 'center' }}>{aiCount}</span>
                                                    <button onClick={() => setAiCount(Math.min(20, aiCount + 1))} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}><Plus size={20} /></button>
                                                </div>
                                            </div>

                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                                <label style={{ fontSize: '0.75rem', fontWeight: 900, opacity: 0.9, letterSpacing: '1px' }}>ASSESSMENT FORMATS</label>
                                                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                                                    {['MCQ', 'CODING', 'VIDEO', 'THEORY'].map(f => (
                                                        <button 
                                                            key={f}
                                                            onClick={() => {
                                                                const newFormats = aiFormats.includes(f) 
                                                                    ? aiFormats.filter(item => item !== f)
                                                                    : [...aiFormats, f];
                                                                if (newFormats.length > 0) setAiFormats(newFormats);
                                                            }}
                                                            style={{ 
                                                                padding: '10px 20px', 
                                                                borderRadius: '15px', 
                                                                background: aiFormats.includes(f) ? '#fff' : 'rgba(255,255,255,0.1)',
                                                                color: aiFormats.includes(f) ? 'var(--primary)' : '#fff',
                                                                border: 'none',
                                                                fontWeight: 900,
                                                                fontSize: '0.75rem',
                                                                cursor: 'pointer',
                                                                transition: 'all 0.3s'
                                                            }}
                                                        >
                                                            {f}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        <label style={{ fontSize: '0.75rem', fontWeight: 900, opacity: 0.9, letterSpacing: '1px', marginBottom: '10px', display: 'block' }}>GENERATION PROMPT</label>
                                        <textarea 
                                            style={{ width: '100%', padding: '24px', borderRadius: '24px', border: 'none', background: 'rgba(255,255,255,1)', color: '#0f172a', fontSize: '1rem', fontWeight: 800, height: '100px', outline: 'none' }} 
                                            placeholder="Specify curriculum focus..."
                                            value={aiPrompt}
                                            onChange={(e) => setAiPrompt(e.target.value)}
                                        />

                                        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '2rem' }}>
                                            <button 
                                                onClick={async () => {
                                                    setIsGenerating(true);
                                                    try {
                                                        const res = await fetch('http://localhost:8080/api/academic/tests/ai-generate', {
                                                            method: 'POST',
                                                            headers: { 'Content-Type': 'application/json' },
                                                            body: JSON.stringify({ 
                                                                prompt: aiPrompt, 
                                                                courseName: testData.courseName,
                                                                count: aiCount,
                                                                formats: aiFormats
                                                            })
                                                        });
                                                        if (res.ok) {
                                                            const newQuestions = await res.json();
                                                            setTestData({...testData, questions: [...testData.questions, ...newQuestions]});
                                                            setStep(4);
                                                        }
                                                    } catch (e) {
                                                        console.error(e);
                                                    } finally {
                                                        setIsGenerating(false);
                                                    }
                                                }}
                                                disabled={!aiPrompt || isGenerating || aiFormats.length === 0}
                                                style={{ padding: '16px 40px', borderRadius: '20px', background: '#fff', color: 'var(--primary)', border: 'none', fontWeight: 900, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px', fontSize: '1rem', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
                                            >
                                                {isGenerating ? 'FABRICATING...' : 'EXECUTE AI GENERATION'} <ChevronRight size={22} />
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {step === 4 && (
                                <motion.div key={`step-${step}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                         <h4 style={{ fontWeight: 900, color: '#0f172a', fontSize: '1.4rem' }}>Question Review Pipeline</h4>
                                         <button className="btn-quantum" style={{ padding: '12px 24px', background: 'var(--primary)', color: '#fff', borderRadius: '15px', fontWeight: 900 }} onClick={() => setTestData({...testData, questions: [...testData.questions, { id: Math.random().toString(36).substr(2,8), text: 'New Assessment Item', concept: 'GENERAL', options: ['A', 'B', 'C', 'D'], correctIndex: 0 }]})}><Plus size={18} /> MANUAL ENTRY</button>
                                    </div>

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                        {testData.questions.length === 0 ? (
                                            <div style={{ padding: '4rem', textAlign: 'center', background: '#f8fafc', borderRadius: '40px', border: '3px dashed #e2e8f0' }}>
                                                <Layers size={64} color="#cbd5e1" style={{ marginBottom: '20px' }} />
                                                <h5 style={{ fontWeight: 900, fontSize: '1.2rem' }}>Question Bank Empty</h5>
                                                <p style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: 700 }}>Initialize fabrication via AI Assistant or add manually.</p>
                                            </div>
                                        ) : (
                                            testData.questions.map((q, i) => (
                                                <motion.div key={q.id} style={{ background: '#fff', border: '1px solid #f1f5f9', borderRadius: '35px', padding: '2rem', boxShadow: '0 4px 20px rgba(0,0,0,0.02)', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                                            <div style={{ padding: '10px', background: 'var(--primary)10', borderRadius: '12px', color: 'var(--primary)' }}>
                                                                {q.type === 'CODING' ? <Code size={20} /> : (q.type === 'VIDEO' ? <Video size={20} /> : <FileText size={20} />)}
                                                            </div>
                                                            <span style={{ fontSize: '0.75rem', fontWeight: 900, color: 'var(--primary)', background: 'var(--primary)08', padding: '8px 16px', borderRadius: '12px', border: '1px solid var(--primary)15' }}>{q.type || 'MCQ'}</span>
                                                            <span style={{ fontSize: '0.75rem', fontWeight: 900, color: '#64748b', background: '#f1f5f9', padding: '8px 16px', borderRadius: '12px' }}>{q.difficulty || 'GENERAL'}</span>
                                                            <span style={{ fontSize: '0.75rem', fontWeight: 900, color: '#94a3b8' }}>{q.concept}</span>
                                                        </div>
                                                        <button onClick={() => setTestData({...testData, questions: testData.questions.filter(item => item.id !== q.id)})} style={{ background: 'transparent', border: 'none', color: '#ef4444', padding: '10px', borderRadius: '12px', cursor: 'pointer' }} className="hover-scale"><Trash2 size={20} /></button>
                                                    </div>

                                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                                        <label style={{ fontSize: '0.65rem', fontWeight: 900, color: '#94a3b8', letterSpacing: '1px' }}>CHALLENGE DEFINITION</label>
                                                        <textarea 
                                                            style={{ width: '100%', padding: '20px', borderRadius: '20px', border: 'none', background: '#f8fafc', fontSize: '1rem', fontWeight: 800, minHeight: '80px', color: '#0f172a', resize: 'none' }} 
                                                            value={q.text}
                                                            onChange={(e) => {
                                                                const newQs = [...testData.questions];
                                                                newQs[i].text = e.target.value;
                                                                setTestData({...testData, questions: newQs});
                                                            }}
                                                        />
                                                    </div>

                                                    {/* --- TYPE SPECIFIC UI --- */}
                                                    {(!q.type || q.type === 'MCQ') && (
                                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '15px' }}>
                                                            {q.options?.map((opt: string, oi: number) => (
                                                                <div key={oi} style={{ display: 'flex', alignItems: 'center', gap: '12px', background: oi === q.correctIndex ? '#10b98105' : '#fff', border: `1.5px solid ${oi === q.correctIndex ? '#10b981' : '#f1f5f9'}`, padding: '15px 20px', borderRadius: '18px' }}>
                                                                    <div style={{ width: 24, height: 24, borderRadius: '50%', background: oi === q.correctIndex ? '#10b981' : '#f1f5f9', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem' }}>{oi === q.correctIndex ? <Check size={14} /> : String.fromCharCode(65 + oi)}</div>
                                                                    <span style={{ fontSize: '0.85rem', fontWeight: 800, color: oi === q.correctIndex ? '#059669' : '#475569' }}>{opt}</span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}

                                                    {q.type === 'CODING' && (
                                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                                            <div style={{ background: '#0f172a', borderRadius: '20px', padding: '1.5rem', fontFamily: 'monospace', fontSize: '0.85rem', color: '#38bdf8' }}>
                                                                <div style={{ color: '#64748b', marginBottom: '10px' }}>// Gemini Fabricated Starter Code</div>
                                                                <pre style={{ margin: 0 }}>{q.starterCode || '// No starter code provided'}</pre>
                                                            </div>
                                                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                                                                <div style={{ background: '#f1f5f9', padding: '15px', borderRadius: '15px', fontSize: '0.75rem', fontWeight: 800 }}>
                                                                    <div style={{ color: '#64748b', marginBottom: '5px' }}>PROTOCOL SOLUTION</div>
                                                                    <div style={{ color: '#10b981' }}>Available in curriculum cloud</div>
                                                                </div>
                                                                <div style={{ background: '#f1f5f9', padding: '15px', borderRadius: '15px', fontSize: '0.75rem', fontWeight: 800 }}>
                                                                    <div style={{ color: '#64748b', marginBottom: '5px' }}>TEST SCENARIOS</div>
                                                                    <div>{q.testCases?.length || 0} Scenarios Configured</div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}

                                                    {(q.type === 'VIDEO' || q.type === 'THEORY') && (
                                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                                            <label style={{ fontSize: '0.65rem', fontWeight: 900, color: '#94a3b8', letterSpacing: '1px' }}>EVALUATION FOCAL POINTS</label>
                                                            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                                                                {q.focalPoints?.map((p: string, pi: number) => (
                                                                    <span key={pi} style={{ background: '#f1f5f9', color: '#475569', padding: '8px 16px', borderRadius: '12px', fontSize: '0.7rem', fontWeight: 800 }}>{p}</span>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}
                                                </motion.div>
                                            ))
                                        )}
                                    </div>
                                </motion.div>
                            )}

                            {step === 5 && (
                                <motion.div key={`step-${step}`} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                     {[
                                         { key: 'screenLock', label: 'Quantum Screen Lock', desc: 'Prevents navigation exits via proprietary OS hook simulation.' },
                                         { key: 'faceDetection', label: 'Visual Biometrics', desc: 'Continuous facial recognition verification during assessment.' },
                                         { key: 'tabTracking', label: 'Intelligent Tab Audit', desc: 'Analyzes focus shifts and tab switching with detailed logging.' },
                                         { key: 'noiseDetection', label: 'Audio Signal Analysis', desc: 'Filters frequency for human speech detection in noisy environments.' }
                                     ].map((p, i) => (
                                         <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fcfdfe', padding: '2rem', borderRadius: '28px', border: '1px solid #f1f5f9', transition: 'all 0.3s' }} className="hover-lift">
                                             <div style={{ display: 'flex', gap: '25px', alignItems: 'center' }}>
                                                 <div style={{ padding: '14px', background: 'var(--primary)05', borderRadius: '18px', border: '1px solid var(--primary)15' }}>
                                                     <Shield size={24} color="var(--primary)" />
                                                 </div>
                                                 <div>
                                                     <div style={{ fontWeight: 900, color: '#0f172a', fontSize: '1.1rem' }}>{p.label}</div>
                                                     <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 700 }}>{p.desc}</div>
                                                 </div>
                                             </div>
                                             <div className="toggle-quantum" onClick={() => setTestData({...testData, proctoring: {...testData.proctoring, [p.key]: !testData.proctoring[p.key as keyof typeof testData.proctoring]}})} style={{ width: 60, height: 32, background: testData.proctoring[p.key as keyof typeof testData.proctoring] ? 'var(--primary)' : '#e2e8f0', borderRadius: '16px', position: 'relative', cursor: 'pointer', transition: 'all 0.4s' }}>
                                                 <div style={{ position: 'absolute', top: 4, left: testData.proctoring[p.key as keyof typeof testData.proctoring] ? 32 : 4, width: 24, height: 24, background: '#fff', borderRadius: '50%', boxShadow: '0 4px 10px rgba(0,0,0,0.1)', transition: 'all 0.4s' }} />
                                             </div>
                                         </div>
                                     ))}
                                </motion.div>
                            )}

                            {step === 6 && (
                                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
                                    <div style={{ padding: '3rem', background: '#f8fafc', borderRadius: '40px', border: '1px solid #e2e8f0' }}>
                                         <h4 style={{ fontWeight: 900, marginBottom: '2rem', fontSize: '1.4rem' }}>Evaluation Logic</h4>
                                         <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '25px' }}>
                                             <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                                 <label style={{ fontSize: '0.75rem', fontWeight: 900, color: '#64748b' }}>PASS THRESHOLD (%)</label>
                                                 <input type="number" style={inputStyle} value={testData.evaluation.passPercentage} onChange={(e) => setTestData({...testData, evaluation: {...testData.evaluation, passPercentage: parseInt(e.target.value)}})} />
                                             </div>
                                             <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                                 <label style={{ fontSize: '0.75rem', fontWeight: 900, color: '#64748b' }}>NEGATIVE PENALTY (%)</label>
                                                 <input type="number" style={inputStyle} value={testData.evaluation.markingValue} onChange={(e) => setTestData({...testData, evaluation: {...testData.evaluation, markingValue: parseInt(e.target.value)}})} />
                                             </div>
                                             <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                                 <label style={{ fontSize: '0.75rem', fontWeight: 900, color: '#64748b' }}>TIME PER ITEM (SEC)</label>
                                                 <input type="number" style={inputStyle} placeholder="60" />
                                             </div>
                                         </div>
                                    </div>
                                </motion.div>
                            )}

                            {step === 7 && (
                                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                        <label style={{ fontSize: '0.85rem', fontWeight: 900, color: '#64748b' }}>SELECT TARGET BATCH</label>
                                        <select style={inputStyle} value={testData.batchId} onChange={(e) => setTestData({...testData, batchId: e.target.value, batchName: e.target.options[e.target.selectedIndex].text})}>
                                            <option value="">Map to Batch...</option>
                                            {batches.filter(b => b.courseName === testData.courseName).map(b => <option key={b.id} value={b.id}>{b.batchName || b.batchCode}</option>)}
                                        </select>
                                    </div>

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                        <label style={{ fontSize: '0.85rem', fontWeight: 900, color: '#64748b' }}>ACCESS CONTROL MODE</label>
                                        <div style={{ display: 'flex', gap: '15px' }}>
                                            {['ALL CANDIDATES', 'INDIVIDUALS ONLY'].map(m => (
                                                <button key={m} style={{ flex: 1, padding: '20px', borderRadius: '20px', border: '2px solid #f1f5f9', background: '#fff', fontWeight: 900, color: '#64748b' }}>{m}</button>
                                            ))}
                                        </div>
                                    </div>

                                    {testData.assignment.mode === 'INDIVIDUAL' && (
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                            <label style={{ fontSize: '0.85rem', fontWeight: 900, color: '#4a5568' }}>SELECT STUDENTS</label>
                                            <div style={{ maxHeight: '250px', overflowY: 'auto', border: '1px solid #e2e8f0', borderRadius: '20px', padding: '10px', display: 'flex', flexDirection: 'column', gap: '5px' }}>
                                                {students.map(s => (
                                                    <div key={s.id} onClick={() => {
                                                        const ids = testData.assignment.studentIds.includes(s.id) 
                                                            ? testData.assignment.studentIds.filter(id => id !== s.id)
                                                            : [...testData.assignment.studentIds, s.id];
                                                        setTestData({...testData, assignment: {...testData.assignment, studentIds: ids}});
                                                    }} style={{ padding: '12px 15px', borderRadius: '12px', background: testData.assignment.studentIds.includes(s.id) ? 'var(--primary)10' : 'transparent', border: `1px solid ${testData.assignment.studentIds.includes(s.id) ? 'var(--primary)' : 'transparent'}`, display: 'flex', justifyContent: 'space-between', cursor: 'pointer' }}>
                                                        <span style={{ fontSize: '0.9rem', fontWeight: 700 }}>{s.fullName}</span>
                                                        <span style={{ fontSize: '0.75rem', color: '#a0aec0' }}>{s.email}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </motion.div>
                            )}

                            {step === 8 && (
                                <motion.div key={`step-${step}`} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1.5rem', textAlign: 'center', padding: '2rem' }}>
                                     <div style={{ width: 100, height: 100, borderRadius: '50%', background: '#10b98110', border: '2px solid #10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981' }}>
                                         <Check size={48} />
                                     </div>
                                     <h2 style={{ fontSize: '2rem', fontWeight: 900 }}>Test is Ready!</h2>
                                     <p style={{ color: '#718096', fontSize: '1rem', maxWidth: '400px', fontWeight: 700 }}>Your test has been created and is ready to be published.</p>
                                     <div style={{ width: '100%', background: '#f8fafc', padding: '2rem', borderRadius: '32px', border: '1px solid #e2e8f0', textAlign: 'left' }}>
                                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                                               <span style={{ fontWeight: 800, color: '#a0aec0' }}>NAME</span>
                                               <span style={{ fontWeight: 900 }}>{testData.title || 'Untitled Test'}</span>
                                          </div>
                                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                                               <span style={{ fontWeight: 800, color: '#a0aec0' }}>ASSIGNED TO</span>
                                               <span style={{ fontWeight: 900 }}>{testData.assignment.mode === 'ALL' ? 'ALL STUDENTS' : `${testData.assignment.studentIds.length} STUDENTS`}</span>
                                          </div>
                                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                               <span style={{ fontWeight: 800, color: '#a0aec0' }}>SECURITY</span>
                                               <span style={{ fontWeight: 900, color: '#10b981' }}>STRONG</span>
                                          </div>
                                     </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* --- FOOTER ACTIONS --- */}
                    <div style={{ 
                        flexShrink: 0,
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        padding: '1rem 3rem 2rem 3rem', 
                        borderTop: '1px solid #f1f5f9', 
                        background: '#fff',
                        zIndex: 10
                    }}>
                         <button 
                            onClick={prevStep} 
                            disabled={step === 1}
                            style={{ padding: '14px 28px', borderRadius: '16px', border: '1px solid #e2e8f0', background: '#fff', color: '#718096', fontWeight: 800, cursor: step === 1 ? 'not-allowed' : 'pointer', opacity: step === 1 ? 0.5 : 1, display: 'flex', alignItems: 'center', gap: '10px' }}
                         >
                             <ChevronLeft size={18} /> PREVIOUS
                         </button>
                         <button 
                            onClick={() => {
                                console.log("Next step triggered from", step);
                                if (step === 8) handlePublish();
                                else nextStep();
                            }}
                            className="btn-quantum"
                            style={{ padding: '14px 40px', background: step === 8 ? '#10b981' : 'var(--primary)', color: '#fff', border: 'none', borderRadius: '18px', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
                         >
                             {step === 8 ? 'PUBLISH TEST' : 'SAVE & CONTINUE'} <ChevronRight size={18} />
                         </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
