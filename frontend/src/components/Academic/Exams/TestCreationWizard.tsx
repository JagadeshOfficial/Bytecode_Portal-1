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

    const [testData, setTestData] = useState({
        title: '',
        name: '',
        description: '',
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
            timePerQuestion: 0,
            passPercentage: 60
        },
        assignment: {
            mode: 'ALL', 
            studentIds: [] as string[]
        }
    });

    const [aiPrompt, setAiPrompt] = useState('');
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
                    // Derive unique courses from batches for selection
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

    const nextStep = () => step < 8 && setStep(step + 1);
    const prevStep = () => step > 1 && setStep(step - 1);

    const inputStyle = {
        width: '100%',
        padding: '16px 20px',
        borderRadius: '16px',
        border: '1px solid #e2e8f0',
        background: '#f8fafc',
        fontSize: '0.95rem',
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
                alert("Test Published Successfully!");
                onClose();
            }
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div style={{ position: 'fixed', inset: 0, zIndex: 11000, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(20px)' }}>
            <motion.div 
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                style={{ 
                    width: '95%', 
                    maxWidth: '1000px', 
                    height: '90vh',
                    maxHeight: '850px',
                    background: '#fff', 
                    borderRadius: '45px', 
                    overflow: 'hidden',
                    display: 'grid',
                    gridTemplateColumns: '280px 1fr'
                }}
            >
                {/* --- SIDEBAR STEPS --- */}
                <div style={{ background: '#f8fafc', padding: '3rem 2rem', borderRight: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '40px' }}>
                    <div>
                         <h3 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#1a202c', marginBottom: '8px' }}>Create New Test</h3>
                         <p style={{ fontSize: '0.75rem', color: '#718096', fontWeight: 700 }}>EXAM MANAGEMENT TOOL</p>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        {steps.map(s => (
                            <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: '15px', color: step === s.id ? 'var(--primary)' : (step > s.id ? '#10b981' : '#a0aec0'), transition: 'all 0.3s' }}>
                                <div style={{ 
                                    width: 35, 
                                    height: 35, 
                                    borderRadius: '10px', 
                                    background: step === s.id ? 'var(--primary)10' : (step > s.id ? '#10b98110' : '#fff'), 
                                    border: `1px solid ${step === s.id ? 'var(--primary)' : (step > s.id ? '#10b981' : '#e2e8f0')}`,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    {step > s.id ? <Check size={18} /> : s.icon}
                                </div>
                                <span style={{ fontSize: '0.85rem', fontWeight: 900 }}>{s.label}</span>
                            </div>
                        ))}
                    </div>

                    <div style={{ marginTop: 'auto', padding: '1.5rem', background: '#fff', borderRadius: '24px', border: '1px solid #e2e8f0' }}>
                         <div style={{ fontSize: '0.7rem', fontWeight: 900, color: '#a0aec0', marginBottom: '10px' }}>SUGGESTIONS</div>
                         <p style={{ fontSize: '0.75rem', color: '#4a5568', lineHeight: 1.5, fontWeight: 700 }}>Enable "Lock Screen" to prevent students from switching tabs during the test.</p>
                    </div>
                </div>

                {/* --- MAIN CONTENT --- */}
                <div style={{ display: 'flex', flexDirection: 'column', padding: '3.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                         <div>
                              <span style={{ fontSize: '0.75rem', fontWeight: 900, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '2px' }}>Step {step} of 8</span>
                              <h2 style={{ fontSize: '2rem', fontWeight: 900, marginTop: '5px' }}>{steps[step-1].label}</h2>
                         </div>
                         <button onClick={onClose} style={{ border: 'none', background: '#f8fafc', padding: '12px', borderRadius: '50%', cursor: 'pointer' }}><X size={24} /></button>
                    </div>

                    <div style={{ flex: 1, overflowY: 'auto', paddingRight: '10px' }}>
                        <AnimatePresence mode="wait">
                            {step === 1 && (
                                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                         <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                             <label style={{ fontSize: '0.8rem', fontWeight: 900 }}>TEST NAME</label>
                                             <input style={inputStyle} placeholder="e.g. React Mastery" value={testData.title} onChange={(e) => setTestData({...testData, title: e.target.value})} />
                                         </div>
                                         <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                             <label style={{ fontSize: '0.8rem', fontWeight: 900 }}>COURSE / CATEGORY</label>
                                             <select style={inputStyle} value={testData.courseId} onChange={(e) => setTestData({...testData, courseId: e.target.value, courseName: e.target.options[e.target.selectedIndex].text})}>
                                                 <option value="">Select Course...</option>
                                                 {courses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                             </select>
                                         </div>
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                        <label style={{ fontSize: '0.8rem', fontWeight: 900 }}>DESCRIPTION</label>
                                        <textarea style={{ ...inputStyle, resize: 'none' }} rows={3} placeholder="Brief test overview..." value={testData.description} onChange={(e) => setTestData({...testData, description: e.target.value})} />
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                         <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                             <label style={{ fontSize: '0.8rem', fontWeight: 900 }}>SKILLS (TAGS)</label>
                                             <input 
                                                style={inputStyle} 
                                                placeholder="e.g. React, JS" 
                                                value={testData.tags.join(', ')} 
                                                onChange={(e) => setTestData({...testData, tags: e.target.value.split(',').map(s => s.trim()).filter(s => s !== '')})}
                                             />
                                         </div>
                                         <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                             <label style={{ fontSize: '0.8rem', fontWeight: 900 }}>DEFAULT BATCH (OPTIONAL)</label>
                                             <select style={inputStyle} value={testData.batchId} onChange={(e) => setTestData({...testData, batchId: e.target.value, batchName: e.target.options[e.target.selectedIndex].text})}>
                                                 <option value="">No specific batch...</option>
                                                 {batches.filter(b => b.courseName === testData.courseName).map(b => <option key={b.id} value={b.id}>{b.batchName || b.batchCode}</option>)}
                                             </select>
                                         </div>
                                    </div>
                                </motion.div>
                            )}

                            {step === 2 && (
                                <motion.div initial={{ opacity: 0, scale: 1.1 }} animate={{ opacity: 1, scale: 1 }} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                    {[
                                        { type: 'MCQ', icon: <FileText size={32} />, label: 'Multiple Choice', desc: 'Questions with multiple options.' },
                                        { type: 'CODING', icon: <Code size={32} />, label: 'Coding Challenge', desc: 'Write and run code in the browser.' },
                                        { type: 'VIDEO', icon: <Video size={32} />, label: 'Video Question', desc: 'Record a video response.' },
                                        { type: 'HYBRID', icon: <Layers size={32} />, label: 'Mixed Test', desc: 'A combination of all types.' }
                                    ].map((t, i) => (
                                        <div key={i} onClick={() => setTestData({...testData, type: t.type})} style={{ padding: '2rem', border: `2px solid ${testData.type === t.type ? 'var(--primary)' : '#e2e8f0'}`, borderRadius: '32px', cursor: 'pointer', background: testData.type === t.type ? 'var(--primary)05' : '#fff', transition: 'all 0.3s' }}>
                                            <div style={{ color: testData.type === t.type ? 'var(--primary)' : '#cbd5e0', marginBottom: '15px' }}>{t.icon}</div>
                                            <div style={{ fontWeight: 900, color: '#1a202c', fontSize: '1.1rem' }}>{t.label}</div>
                                            <div style={{ fontSize: '0.8rem', color: '#718096', fontWeight: 700 }}>{t.desc}</div>
                                        </div>
                                    ))}
                                </motion.div>
                            )}

                            {step === 3 && (
                                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
                                    <div style={{ background: 'linear-gradient(135deg, #6366f110, #a855f710)', padding: '2.5rem', borderRadius: '40px', border: '1px solid #6366f120' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '1.5rem' }}>
                                            <div style={{ width: 45, height: 45, borderRadius: '15px', background: 'var(--primary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <Sparkles size={24} />
                                            </div>
                                            <div>
                                                <h4 style={{ fontWeight: 900, fontSize: '1.2rem' }}>AI Question Assistant</h4>
                                                <p style={{ fontSize: '0.75rem', color: '#718096', fontWeight: 700 }}>Enter your course concepts separated by commas.</p>
                                            </div>
                                        </div>

                                        <textarea 
                                            style={{ ...inputStyle, height: '120px', border: '2px solid #6366f130', background: '#fff' }} 
                                            placeholder="e.g. React Hooks, Redux Middleware, Virtual DOM, Components Architecture"
                                            value={aiPrompt}
                                            onChange={(e) => setAiPrompt(e.target.value)}
                                        />

                                        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
                                            <button 
                                                onClick={() => {
                                                    setIsGenerating(true);
                                                    setTimeout(() => {
                                                        const concepts = aiPrompt.split(',').map(c => c.trim());
                                                        const newQuestions = concepts.map(c => ({
                                                            id: Math.random().toString(),
                                                            concept: c.toUpperCase(),
                                                            text: `AI Generated: Describe the core principles and implementation of ${c} in modern development.`,
                                                            options: ['Option A', 'Option B', 'Option C', 'Option D'],
                                                            correctIndex: 0
                                                        }));
                                                        setTestData({...testData, questions: [...testData.questions, ...newQuestions]});
                                                        setIsGenerating(false);
                                                        setStep(4);
                                                    }, 1500);
                                                }}
                                                disabled={!aiPrompt || isGenerating}
                                                style={{ padding: '14px 30px', borderRadius: '15px', background: 'var(--primary)', color: '#fff', border: 'none', fontWeight: 900, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', opacity: isGenerating ? 0.7 : 1 }}
                                            >
                                                {isGenerating ? 'GENIUSING...' : 'GENERATE QUESTIONS'} <ChevronRight size={18} />
                                            </button>
                                        </div>
                                    </div>
                                    
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px', padding: '1.5rem', background: '#f8fafc', borderRadius: '24px', border: '1px solid #e2e8f0' }}>
                                        <div style={{ padding: '10px', background: '#fff', borderRadius: '12px' }}><Info size={20} color="var(--primary)" /></div>
                                        <p style={{ fontSize: '0.8rem', color: '#4a5568', fontWeight: 700, lineHeight: 1.4 }}>The AI will analyze the concepts provided and create MCQ or descriptive questions based on the course: <span style={{ fontWeight: 900, color: 'var(--primary)' }}>{testData.courseName || 'General'}</span></p>
                                    </div>
                                </motion.div>
                            )}

                            {step === 4 && (
                                <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                         <h4 style={{ fontWeight: 900, color: '#1a202c' }}>Review & Edit Questions</h4>
                                         <div style={{ display: 'flex', gap: '10px' }}>
                                             <button style={{ padding: '10px 18px', borderRadius: '12px', background: '#f8fafc', border: '1px solid #e2e8f0', fontSize: '0.75rem', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '8px' }} onClick={() => setTestData({...testData, questions: [...testData.questions, { id: Date.now().toString(), text: 'New Question', concept: 'GENERAL' }]})}><Plus size={16} /> ADD MANUAL</button>
                                         </div>
                                    </div>

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                        {testData.questions.length === 0 ? (
                                            <div style={{ padding: '3rem', textAlign: 'center', background: '#f8fafc', borderRadius: '32px', border: '2px dashed #e2e8f0' }}>
                                                <Layers size={48} color="#cbd5e0" style={{ marginBottom: '15px' }} />
                                                <h5 style={{ fontWeight: 900 }}>Empty Question Bank</h5>
                                                <p style={{ fontSize: '0.8rem', color: '#718096' }}>Generate with AI or add manually above.</p>
                                            </div>
                                        ) : (
                                            testData.questions.map((q, i) => (
                                                <div key={q.id} style={{ border: '1px solid #e2e8f0', borderRadius: '28px', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', background: '#fff' }}>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                        <span style={{ fontSize: '0.65rem', fontWeight: 900, color: 'var(--primary)', background: 'var(--primary)10', padding: '6px 12px', borderRadius: '10px' }}>{q.concept}</span>
                                                        <button onClick={() => setTestData({...testData, questions: testData.questions.filter(item => item.id !== q.id)})} style={{ background: 'transparent', border: 'none', color: '#ef4444' }}><Trash2 size={16} /></button>
                                                    </div>
                                                    <input 
                                                        style={{ ...inputStyle, border: 'none', background: 'transparent', padding: 0, fontSize: '1rem', fontWeight: 800 }} 
                                                        value={q.text}
                                                        onChange={(e) => {
                                                            const newQs = [...testData.questions];
                                                            newQs[i].text = e.target.value;
                                                            setTestData({...testData, questions: newQs});
                                                        }}
                                                    />
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </motion.div>
                            )}

                            {step === 5 && (
                                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                                     {[
                                         { key: 'screenLock', label: 'Lock Screen During Test', desc: 'Prevents students from leaving the test window.' },
                                         { key: 'faceDetection', label: 'Camera Monitoring', desc: 'Checks if the student is present at the desk.' },
                                         { key: 'tabTracking', label: 'Tab Activity Tracking', desc: 'Logs if the student switches browser tabs.' },
                                         { key: 'noiseDetection', label: 'Audio Monitoring', desc: 'Detects talking or suspicious background noise.' }
                                     ].map((p, i) => (
                                         <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc', padding: '1.5rem', borderRadius: '24px', border: '1px solid #e2e8f0' }}>
                                             <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                                                 <div style={{ padding: '10px', background: '#fff', borderRadius: '14px', border: '1px solid #e2e8f0' }}>
                                                     <Shield size={20} color="var(--primary)" />
                                                 </div>
                                                 <div>
                                                     <div style={{ fontWeight: 900, color: '#1a202c' }}>{p.label}</div>
                                                     <div style={{ fontSize: '0.75rem', color: '#718096', fontWeight: 700 }}>{p.desc}</div>
                                                 </div>
                                             </div>
                                             <input type="checkbox" style={{ width: 24, height: 24, cursor: 'pointer' }} defaultChecked={testData.proctoring[p.key as keyof typeof testData.proctoring]} />
                                         </div>
                                     ))}
                                </motion.div>
                            )}

                            {step === 6 && (
                                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
                                    <div style={{ padding: '2rem', background: 'linear-gradient(to right, #f8fafc, #fff)', borderRadius: '32px', border: '1px solid #e2e8f0' }}>
                                         <h4 style={{ fontWeight: 900, marginBottom: '1.5rem' }}>Scoring Rules</h4>
                                         <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                                             <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                                 <label style={{ fontSize: '0.75rem', fontWeight: 900 }}>PASSING MARK (%)</label>
                                                 <input type="number" defaultValue={60} style={inputStyle} />
                                             </div>
                                             <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                                 <label style={{ fontSize: '0.75rem', fontWeight: 900 }}>NEGATIVE MARKING (%)</label>
                                                 <input type="number" defaultValue={25} style={inputStyle} />
                                             </div>
                                         </div>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '1.5rem', background: '#fff9c4', borderRadius: '20px', color: '#827717' }}>
                                         <span style={{ fontSize: '0.8rem', fontWeight: 800 }}>The test will automatically submit when time finishes.</span>
                                    </div>
                                </motion.div>
                            )}

                            {step === 7 && (
                                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                        <label style={{ fontSize: '0.85rem', fontWeight: 900, color: '#4a5568' }}>ASSIGNMENT MODE</label>
                                        <div style={{ display: 'flex', gap: '10px' }}>
                                            {['ALL', 'INDIVIDUAL'].map(m => (
                                                <button 
                                                    key={m}
                                                    onClick={() => setTestData({...testData, assignment: {...testData.assignment, mode: m as any}})}
                                                    style={{ 
                                                        flex: 1, padding: '15px', borderRadius: '15px', 
                                                        border: `2px solid ${testData.assignment.mode === m ? 'var(--primary)' : '#e2e8f0'}`,
                                                        background: testData.assignment.mode === m ? 'var(--primary)10' : '#fff',
                                                        fontWeight: 800, fontSize: '0.75rem', cursor: 'pointer'
                                                    }}
                                                >
                                                    {m} STUDENTS
                                                </button>
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
                                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1.5rem', textAlign: 'center', padding: '2rem' }}>
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
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '3rem', paddingTop: '2.5rem', borderTop: '1px solid #f1f5f9' }}>
                         <button 
                            onClick={prevStep} 
                            disabled={step === 1}
                            style={{ padding: '14px 28px', borderRadius: '16px', border: '1px solid #e2e8f0', background: '#fff', color: '#718096', fontWeight: 800, cursor: step === 1 ? 'not-allowed' : 'pointer', opacity: step === 1 ? 0.5 : 1, display: 'flex', alignItems: 'center', gap: '10px' }}
                         >
                             <ChevronLeft size={18} /> PREVIOUS
                         </button>
                         <button 
                            onClick={step === 8 ? handlePublish : nextStep}
                            className="btn-quantum"
                            style={{ padding: '14px 40px', background: step === 8 ? '#10b981' : 'var(--primary)', borderRadius: '18px', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '10px' }}
                         >
                             {step === 8 ? 'PUBLISH TEST' : 'SAVE & CONTINUE'} <ChevronRight size={18} />
                         </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
