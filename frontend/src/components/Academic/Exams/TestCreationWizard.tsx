"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    X, Check, ChevronRight, ChevronLeft,
    Plus, Trash2, Code, FileText,
    Zap, Shield, Clock, Award,
    Globe, Smartphone, Monitor, Info, Video, Layers
} from 'lucide-react';

export default function TestCreationWizard({ onClose }: { onClose: () => void }) {
    const [step, setStep] = useState(1);
    const steps = [
        { id: 1, label: 'Basic Info', icon: <Info size={18} /> },
        { id: 2, label: 'Test Type', icon: <Award size={18} /> },
        { id: 3, label: 'Question Builder', icon: <Plus size={18} /> },
        { id: 4, label: 'Proctoring', icon: <Shield size={18} /> },
        { id: 5, label: 'Evaluation', icon: <Zap size={18} /> },
        { id: 6, label: 'Publish', icon: <Check size={18} /> }
    ];

    const [testData, setTestData] = useState({
        title: '',
        description: '',
        tags: '',
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
        }
    });

    const nextStep = () => step < 6 && setStep(step + 1);
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
            const res = await fetch('http://localhost:8080/api/academic/tests', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(testData)
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
                         <h3 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#1a202c', marginBottom: '8px' }}>Test Designer</h3>
                         <p style={{ fontSize: '0.75rem', color: '#718096', fontWeight: 700 }}>AI MULTI-ENGINE v2.0</p>
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
                         <div style={{ fontSize: '0.7rem', fontWeight: 900, color: '#a0aec0', marginBottom: '10px' }}>AI RECOMMENDATION</div>
                         <p style={{ fontSize: '0.75rem', color: '#4a5568', lineHeight: 1.5, fontWeight: 700 }}>Enable "Screen Lock" for critical certification exams to improve integrity by 45%.</p>
                    </div>
                </div>

                {/* --- MAIN CONTENT --- */}
                <div style={{ display: 'flex', flexDirection: 'column', padding: '3.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                         <div>
                              <span style={{ fontSize: '0.75rem', fontWeight: 900, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '2px' }}>Step {step} of 6</span>
                              <h2 style={{ fontSize: '2rem', fontWeight: 900, marginTop: '5px' }}>{steps[step-1].label}</h2>
                         </div>
                         <button onClick={onClose} style={{ border: 'none', background: '#f8fafc', padding: '12px', borderRadius: '50%', cursor: 'pointer' }}><X size={24} /></button>
                    </div>

                    <div style={{ flex: 1, overflowY: 'auto', paddingRight: '10px' }}>
                        <AnimatePresence mode="wait">
                            {step === 1 && (
                                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                        <label style={{ fontSize: '0.85rem', fontWeight: 900, color: '#4a5568' }}>TEST TITLE</label>
                                        <input style={inputStyle} placeholder="e.g. Master React & Redux Assessment" />
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                        <label style={{ fontSize: '0.85rem', fontWeight: 900, color: '#4a5568' }}>EXECUTIVE SUMMARY</label>
                                        <textarea style={{ ...inputStyle, resize: 'none' }} rows={4} placeholder="Briefly describe the purpose of this test..." />
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                        <label style={{ fontSize: '0.85rem', fontWeight: 900, color: '#4a5568' }}>SKILL TAGS</label>
                                        <input style={inputStyle} placeholder="Add tags like React, JS, Logic (comma separated)" />
                                    </div>
                                </motion.div>
                            )}

                            {step === 3 && (
                                <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                         <h4 style={{ fontWeight: 900, color: '#1a202c' }}>Drafting Questions</h4>
                                         <div style={{ display: 'flex', gap: '10px' }}>
                                             <button style={{ padding: '10px 18px', borderRadius: '12px', background: '#f8fafc', border: '1px solid #e2e8f0', fontSize: '0.75rem', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '8px' }}><FileText size={16} /> ADD MCQ</button>
                                             <button style={{ padding: '10px 18px', borderRadius: '12px', background: 'var(--primary)', color: '#fff', border: 'none', fontSize: '0.75rem', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '8px' }}><Code size={16} /> ADD CODING BOX</button>
                                         </div>
                                    </div>

                                    {/* Mock Question Preview */}
                                    <div style={{ border: '1px solid #e2e8f0', borderRadius: '28px', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                         <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                             <span style={{ fontSize: '0.7rem', fontWeight: 900, color: '#6366f1', background: '#eef2ff', padding: '5px 12px', borderRadius: '10px' }}>ALGORITHMS / HASHING</span>
                                             <span style={{ fontSize: '0.75rem', fontWeight: 900, color: '#718096' }}>Q1 of 5</span>
                                         </div>
                                         <div>
                                             <input style={{ ...inputStyle, border: 'none', background: 'transparent', padding: 0, fontSize: '1.2rem', fontWeight: 800 }} defaultValue="Two Sum Problem Optimization" />
                                             <textarea style={{ ...inputStyle, border: 'none', background: 'transparent', padding: '10px 0', fontSize: '0.9rem', color: '#718096' }} rows={3} defaultValue="Design an optimal algorithm to find two numbers that sum up to a target value... " />
                                         </div>
                                         <div style={{ background: '#f1f5f9', borderRadius: '20px', padding: '1.5rem' }}>
                                             <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                                                 <span style={{ fontSize: '0.75rem', fontWeight: 900 }}>TEST CASES</span>
                                                 <button style={{ background: 'transparent', border: 'none', color: 'var(--primary)', fontWeight: 900, fontSize: '0.7rem' }}>+ ADD CASE</button>
                                             </div>
                                             <div style={{ display: 'flex', gap: '10px' }}>
                                                 <div style={{ flex: 1, background: '#fff', padding: '12px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 700 }}>Input: [2, 7, 11, 15], 9</div>
                                                 <div style={{ flex: 1, background: '#fff', padding: '12px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 700 }}>Output: [0, 1]</div>
                                             </div>
                                         </div>
                                    </div>
                                </motion.div>
                            )}

                            {step === 2 && (
                                <motion.div initial={{ opacity: 0, scale: 1.1 }} animate={{ opacity: 1, scale: 1 }} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                    {[
                                        { type: 'MCQ', icon: <FileText size={32} />, label: 'Standard MCQ', desc: 'Multiple Choice, Single Correct, or Multi-select.' },
                                        { type: 'CODING', icon: <Code size={32} />, label: 'Coding Challenge', desc: 'Algorithm & Logic testing with real-time compiler.' },
                                        { type: 'VIDEO', icon: <Video size={32} />, label: 'Video Interview', desc: 'AI-monitored asynchronous video response tests.' },
                                        { type: 'HYBRID', icon: <Layers size={32} />, label: 'Hybrid Assessment', desc: 'Combo of MCQ, Coding, and Subjective items.' }
                                    ].map((t, i) => (
                                        <div key={i} onClick={() => setTestData({...testData, type: t.type})} style={{ padding: '2rem', border: `2px solid ${testData.type === t.type ? 'var(--primary)' : '#e2e8f0'}`, borderRadius: '32px', cursor: 'pointer', background: testData.type === t.type ? 'var(--primary)05' : '#fff', transition: 'all 0.3s' }}>
                                            <div style={{ color: testData.type === t.type ? 'var(--primary)' : '#cbd5e0', marginBottom: '15px' }}>{t.icon}</div>
                                            <div style={{ fontWeight: 900, color: '#1a202c', fontSize: '1.1rem' }}>{t.label}</div>
                                            <div style={{ fontSize: '0.8rem', color: '#718096', fontWeight: 700 }}>{t.desc}</div>
                                        </div>
                                    ))}
                                </motion.div>
                            )}

                            {step === 4 && (
                                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
                                     {[
                                         { key: 'screenLock', label: 'Mandatory Full-Screen Mode', desc: 'Prevents window switching during the exam.' },
                                         { key: 'faceDetection', label: 'AI Face & Identity Verification', desc: 'Ensures the candidate is visible throughout.' },
                                         { key: 'tabTracking', label: 'Tab Switch Monitoring', desc: 'Logs any attempts to leave the test environment.' },
                                         { key: 'noiseDetection', label: 'Active Noise Analysis', desc: 'Detects background talking or suspicious audio.' }
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

                            {step === 5 && (
                                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
                                    <div style={{ padding: '2rem', background: 'linear-gradient(to right, #f8fafc, #fff)', borderRadius: '32px', border: '1px solid #e2e8f0' }}>
                                         <h4 style={{ fontWeight: 900, marginBottom: '2rem' }}>Scoring & Time Control</h4>
                                         <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                                             <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                                 <label style={{ fontSize: '0.75rem', fontWeight: 900 }}>PASSING PERCENTAGE</label>
                                                 <input type="number" defaultValue={60} style={inputStyle} />
                                             </div>
                                             <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                                 <label style={{ fontSize: '0.75rem', fontWeight: 900 }}>NEGATIVE MARKING (%)</label>
                                                 <input type="number" defaultValue={25} style={inputStyle} />
                                             </div>
                                         </div>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '1.5rem', background: '#fff9c4', borderRadius: '20px', color: '#827717' }}>
                                         <Info size={20} />
                                         <span style={{ fontSize: '0.8rem', fontWeight: 800 }}>AI Auto-submit is enabled. Candidate window will close automatically once the timer reaches zero.</span>
                                    </div>
                                </motion.div>
                            )}

                            {step === 6 && (
                                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1.5rem', textAlign: 'center', padding: '2rem' }}>
                                     <div style={{ width: 100, height: 100, borderRadius: '50%', background: '#10b98110', border: '2px solid #10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981' }}>
                                         <Zap size={48} />
                                     </div>
                                     <h2 style={{ fontSize: '2rem', fontWeight: 900 }}>Assessment Ready!</h2>
                                     <p style={{ color: '#718096', fontSize: '1rem', maxWidth: '400px', fontWeight: 700 }}>Successfully audited by AI. This test is optimized for standard proctoring levels.</p>
                                     <div style={{ width: '100%', background: '#f8fafc', padding: '2rem', borderRadius: '32px', border: '1px solid #e2e8f0', textAlign: 'left' }}>
                                         <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                                              <span style={{ fontWeight: 800, color: '#a0aec0' }}>TITLE</span>
                                              <span style={{ fontWeight: 900 }}>{testData.title || 'Untitled Test'}</span>
                                         </div>
                                         <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                              <span style={{ fontWeight: 800, color: '#a0aec0' }}>PROCTORING</span>
                                              <span style={{ fontWeight: 900, color: '#10b981' }}>MAXIMUM SHIELD</span>
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
                            onClick={step === 6 ? handlePublish : nextStep}
                            className="btn-quantum"
                            style={{ padding: '14px 40px', background: step === 6 ? '#10b981' : 'var(--primary)', borderRadius: '18px', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '10px' }}
                         >
                             {step === 6 ? 'PUBLISH TEST' : 'SAVE & CONTINUE'} <ChevronRight size={18} />
                         </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
