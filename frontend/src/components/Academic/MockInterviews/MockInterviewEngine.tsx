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
    Edit2, Trash2, Copy, Play
} from 'lucide-react';

// --- STYLES & ACCENTS ---
const glassStyle = {
    background: 'rgba(255, 255, 255, 0.7)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(0, 0, 0, 0.05)',
    borderRadius: '24px',
    boxShadow: '0 20px 40px rgba(0,0,0,0.05)',
};

const gradText = {
    background: 'linear-gradient(to right, #818cf8, #c084fc)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
};

// --- MOCK DATA ---
const INITIAL_STATS = [
    { label: 'Total Interviews', value: 128, change: '+12%', icon: <Video size={20} /> },
    { label: 'Avg AI Score', value: '84%', change: '+5%', icon: <Brain size={20} /> },
    { label: 'Suspicious Activities', value: 3, change: '-20%', icon: <Shield size={20} /> },
    { label: 'Success Rate', value: '68%', change: '+8%', icon: <Target size={20} /> },
];

const INITIAL_INTERVIEWS = [
    {
        id: '1',
        title: 'Senior Java Developer Technical',
        type: 'TECHNICAL',
        mode: 'AI',
        duration: '45 Mins',
        difficulty: 'HARD',
        candidates: 24,
        confidence: 94,
        status: 'LIVE',
        interviewer: 'AI Engine v2.4'
    },
    {
        id: '2',
        title: 'Graduate HR Screening',
        type: 'HR',
        mode: 'HYBRID',
        duration: '20 Mins',
        difficulty: 'EASY',
        candidates: 156,
        confidence: 88,
        status: 'SCHEDULED',
        interviewer: 'Sarah Jen (Lead HR)'
    },
    {
        id: '3',
        title: 'System Design Architecture',
        type: 'SYSTEM_DESIGN',
        mode: 'HUMAN',
        duration: '60 Mins',
        difficulty: 'EXPERT',
        candidates: 8,
        confidence: 91,
        status: 'COMPLETED',
        interviewer: 'Alex Rivera (Staff Engineer)'
    }
];

export default function MockInterviewEngine() {
    const [subView, setSubView] = useState<'DASHBOARD' | 'LIVE_MONITOR' | 'ANALYTICS' | 'AI_ROOM'>('DASHBOARD');
    const [isWizardOpen, setIsWizardOpen] = useState(false);
    const [wizardStep, setWizardStep] = useState(1);
    const [interviews, setInterviews] = useState(INITIAL_INTERVIEWS);

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
                <button onClick={() => setIsWizardOpen(true)} className="btn-quantum" style={{ padding: '12px 24px', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
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
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem' }}>
                            {interviews.map((item) => (
                                <InterviewCard key={item.id} data={item} />
                            ))}
                        </div>
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
                            <div style={{ padding: '2.5rem', borderBottom: '1px solid rgba(0,0,0,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <h2 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#111' }}>Mock Interview Builder</h2>
                                    <p style={{ fontSize: '0.8rem', color: '#666' }}>Step {wizardStep} of 8: {getStepTitle(wizardStep)}</p>
                                </div>
                                <button onClick={() => setIsWizardOpen(false)} style={{ background: 'none', border: 'none', color: '#666', cursor: 'pointer' }}><X size={24} /></button>
                            </div>

                            <div style={{ padding: '3rem', flex: 1, overflowY: 'auto' }}>
                                {wizardStep === 1 && <WizardStep1 />}
                                {wizardStep === 2 && <WizardStep2 />}
                                {wizardStep === 3 && <WizardStep3 />}
                                {wizardStep === 4 && <WizardStep4 />}
                                {wizardStep === 5 && <WizardStep5 />}
                                {wizardStep === 6 && <WizardStep6 />}
                                {wizardStep === 7 && <WizardStep7 />}
                                {wizardStep === 8 && <WizardStep8 />}
                            </div>

                            <div style={{ padding: '2rem', background: 'rgba(0,0,0,0.02)', borderTop: '1px solid rgba(0,0,0,0.05)', display: 'flex', justifyContent: 'space-between' }}>
                                <button 
                                    onClick={() => setWizardStep(prev => Math.max(1, prev - 1))} 
                                    style={{ ...inactiveBtnStyle, padding: '12px 30px' }}
                                    disabled={wizardStep === 1}
                                >
                                    PREVIOUS
                                </button>
                                <button 
                                    onClick={() => wizardStep === 8 ? setIsWizardOpen(false) : setWizardStep(prev => prev + 1)} 
                                    className="btn-quantum" 
                                    style={{ padding: '12px 40px', borderRadius: '12px' }}
                                >
                                    {wizardStep === 8 ? 'FINALIZE & PUBLISH' : 'CONTINUE'}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}

// --- SUB-COMPONENTS ---

function InterviewCard({ data }: { data: any }) {
    return (
        <motion.div whileHover={{ y: -5 }} style={{ ...glassStyle, padding: '0', overflow: 'hidden' }}>
            <div style={{ padding: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                    <div style={{ background: data.status === 'LIVE' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)', padding: '6px 12px', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: data.status === 'LIVE' ? '#ef4444' : '#10b981', boxShadow: data.status === 'LIVE' ? '0 0 10px #ef4444' : 'none' }} />
                        <span style={{ fontSize: '0.65rem', fontWeight: 900, color: data.status === 'LIVE' ? '#ef4444' : '#10b981' }}>{data.status}</span>
                    </div>
                    <button style={{ background: 'none', border: 'none', color: 'var(--text-dim)', cursor: 'pointer' }}><MoreVertical size={16} /></button>
                </div>

                <h4 style={{ fontSize: '1.25rem', fontWeight: 900, marginBottom: '0.5rem', minHeight: '3.5rem', color: '#111' }}>{data.title}</h4>
                
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '2rem' }}>
                    <Badge icon={<Zap size={10} />} label={data.type} color="var(--primary)" />
                    <Badge icon={<Mic size={10} />} label={data.mode} color="var(--secondary)" />
                    <Badge icon={<Clock size={10} />} label={data.duration} color="#f59e0b" />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', padding: '1.5rem', background: 'rgba(0,0,0,0.02)', borderRadius: '20px', border: '1px solid rgba(0,0,0,0.05)', marginBottom: '2rem' }}>
                    <div>
                        <p style={labelStyle}>INTERVIEWER</p>
                        <p style={valueStyle}>{data.interviewer}</p>
                    </div>
                    <div>
                        <p style={labelStyle}>DIFFICULTY</p>
                        <p style={{ ...valueStyle, color: '#ef4444' }}>{data.difficulty}</p>
                    </div>
                    <div>
                        <p style={labelStyle}>CANDIDATES</p>
                        <p style={valueStyle}>{data.candidates}</p>
                    </div>
                    <div>
                        <p style={labelStyle}>AI CONFIDENCE</p>
                        <p style={{ ...valueStyle, color: '#10b981' }}>{data.confidence}%</p>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                    <button style={{ flex: 1, padding: '11px', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.1)', background: 'rgba(0,0,0,0.03)', color: '#111', fontSize: '0.75rem', fontWeight: 800, cursor: 'pointer' }}>VIEW REPORTS</button>
                    {data.status === 'LIVE' ? (
                        <button style={{ flex: 1.2, padding: '11px', borderRadius: '12px', background: '#ef4444', color: '#fff', fontSize: '0.75rem', fontWeight: 900, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}>
                            <Play size={14} fill="white" /> JOIN LIVE
                        </button>
                    ) : (
                        <button style={{ flex: 1.2, padding: '11px', borderRadius: '12px', background: 'var(--primary)', color: '#000', fontSize: '0.75rem', fontWeight: 900, border: 'none', cursor: 'pointer' }}>SCHEDULE NOW</button>
                    )}
                </div>
            </div>
        </motion.div>
    );
}

function LiveMonitoringView() {
    const liveItems = [
        { name: 'John Doe', status: 'CODING', risk: 'LOW', time: '12:45 remaining', location: 'India/Mumbai' },
        { name: 'Alice Smith', status: 'HR ROUND', risk: 'HIGH', time: '05:20 remaining', location: 'UK/London' },
        { name: 'Bob Wilson', status: 'SYSTEM DESIGN', risk: 'LOW', time: '40:10 remaining', location: 'USA/California' }
    ];

    return (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '2rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div style={{ ...glassStyle, padding: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#111' }}>Global Live Feed</h2>
                        <p style={{ color: '#666', fontSize: '0.8rem' }}>Monitoring 12 active interview sessions across all regions.</p>
                    </div>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <div style={tagStyle}><div style={dotStyle('#ef4444')} /> 2 CRITICAL</div>
                        <div style={tagStyle}><div style={dotStyle('#f59e0b')} /> 5 WARNING</div>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                    {liveItems.slice(0, 2).map((item, i) => (
                        <div key={i} style={{ ...glassStyle, padding: '0', overflow: 'hidden' }}>
                            <div style={{ height: '220px', background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                                <Monitor size={48} style={{ opacity: 0.1 }} />
                                <div style={{ position: 'absolute', top: '15px', right: '15px', background: 'rgba(239, 68, 68, 0.8)', padding: '4px 10px', borderRadius: '10px', fontSize: '0.6rem', fontWeight: 900 }}>REC LIVE</div>
                                <div style={{ position: 'absolute', bottom: '15px', left: '15px', display: 'flex', gap: '10px' }}>
                                    <div style={{ padding: '5px 10px', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(10px)', borderRadius: '10px', fontSize: '0.65rem', fontWeight: 800 }}>{item.name}</div>
                                </div>
                            </div>
                            <div style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <p style={{ fontSize: '0.8rem', fontWeight: 900 }}>{item.status}</p>
                                    <p style={{ fontSize: '0.65rem', color: 'var(--text-dim)' }}>{item.time}</p>
                                </div>
                                <div style={{ display: 'flex', gap: '10px' }}>
                                     <button style={{ padding: '8px', background: 'rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.05)', borderRadius: '10px', color: '#111' }}><Shield size={14} /></button>
                                     <button style={{ padding: '8px 15px', background: 'var(--primary)', border: 'none', borderRadius: '10px', color: '#fff', fontWeight: 900, fontSize: '0.65rem' }}>JOIN ROOM</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div style={{ ...glassStyle, padding: '2rem' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 900, marginBottom: '2rem' }}>Activity Inspector</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {liveItems.map((item, i) => (
                        <div key={i} style={{ padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                <span style={{ fontWeight: 800, fontSize: '0.85rem' }}>{item.name}</span>
                                <span style={{ color: item.risk === 'HIGH' ? '#ef4444' : '#10b981', fontWeight: 900, fontSize: '0.65rem' }}>{item.risk} RISK</span>
                            </div>
                            <p style={{ fontSize: '0.7rem', color: 'var(--text-dim)', marginBottom: '1rem' }}>Suspicious tab switch detected 2 mins ago.</p>
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <button style={{ flex: 1, padding: '8px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid #ef444440', color: '#ef4444', borderRadius: '8px', fontSize: '0.6rem', fontWeight: 800 }}>SEND WARNING</button>
                                <button style={{ flex: 1, padding: '8px', background: 'rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.05)', color: '#111', borderRadius: '8px', fontSize: '0.6rem', fontWeight: 800 }}>VIEW LOGS</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

// --- WIZARD STEPS ---

function WizardStep1() {
    return (
        <div style={{ gap: '2rem', display: 'flex', flexDirection: 'column' }}>
            <div style={inputGroupStyle}>
                <label style={labelStyleWizard}>Interview Title</label>
                <input placeholder="e.g. Senior Frontend Engineer Mock Interview" style={wizardInputStyle} />
            </div>
            <div style={inputGroupStyle}>
                <label style={labelStyleWizard}>Description</label>
                <textarea rows={4} placeholder="What should candidates expect from this interview?" style={{ ...wizardInputStyle, resize: 'none' }} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                 <div style={inputGroupStyle}>
                    <label style={labelStyleWizard}>Hiring Role</label>
                    <select style={wizardInputStyle}>
                        <option>FullStack Developer</option>
                        <option>Data Scientist</option>
                        <option>Product Manager</option>
                        <option>DevOps Engineer</option>
                    </select>
                </div>
                <div style={inputGroupStyle}>
                    <label style={labelStyleWizard}>Tags (Comma separated)</label>
                    <input placeholder="React, Node.js, System Design" style={wizardInputStyle} />
                </div>
            </div>
        </div>
    );
}

function WizardStep2() {
    const types = [
        { id: 'hr', title: 'HR / Behavioral', desc: 'Communication and cultural fit evaluation.', icon: <Users /> },
        { id: 'tech', title: 'Technical Interview', desc: 'Core concept evaluation and logic checks.', icon: <Zap /> },
        { id: 'coding', title: 'Coding Interview', desc: 'Whiteboard and live coding assessment.', icon: <Play /> },
        { id: 'system', title: 'System Design', desc: 'High-level architecture and scalability.', icon: <Monitor /> },
    ];
    return (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            {types.map(t => (
                <div key={t.id} style={{ ...glassStyle, padding: '2rem', border: '1px solid var(--primary)', cursor: 'pointer', background: 'rgba(129, 140, 248, 0.05)' }}>
                    <div style={{ color: 'var(--primary)', marginBottom: '1.5rem' }}>{t.icon}</div>
                    <h4 style={{ fontWeight: 900, fontSize: '1.1rem', marginBottom: '0.5rem' }}>{t.title}</h4>
                    <p style={{ color: 'var(--text-dim)', fontSize: '0.75rem' }}>{t.desc}</p>
                </div>
            ))}
        </div>
    );
}

function WizardStep3() {
    const modes = [
        { id: 'ai', title: 'AI-Powered Interview', desc: 'Our AI engine asks questions and evaluates automatically.', icon: <Bot />, accent: 'var(--secondary)' },
        { id: 'human', title: 'Human Interviewer', desc: 'Assign a professional interviewer for the session.', icon: <UserPlus />, accent: 'var(--primary)' },
        { id: 'hybrid', title: 'Hybrid Intelligence', desc: 'AI screens first, then human takes over for final round.', icon: <Target />, accent: '#10b981' },
    ];
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {modes.map(m => (
                <div key={m.id} style={{ ...glassStyle, padding: '2rem', display: 'flex', alignItems: 'center', gap: '2rem', cursor: 'pointer' }}>
                    <div style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.03)', borderRadius: '20px', color: m.accent }}>{m.icon}</div>
                    <div>
                        <h4 style={{ fontWeight: 900, fontSize: '1.1rem', marginBottom: '0.5rem' }}>{m.title}</h4>
                        <p style={{ color: 'var(--text-dim)', fontSize: '0.8rem' }}>{m.desc}</p>
                    </div>
                    <div style={{ flex: 1 }} />
                    <div style={{ width: 24, height: 24, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.1)' }} />
                </div>
            ))}
        </div>
    );
}

function WizardStep4() {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div style={{ ...glassStyle, padding: '2.5rem', border: '1px dashed var(--primary)', background: '#fff' }}>
                <h4 style={{ fontWeight: 900, marginBottom: '0.5rem' }}>AI Question Generator</h4>
                <p style={{ color: 'var(--text-dim)', fontSize: '0.8rem', marginBottom: '1.5rem' }}>Our AI can extract questions from the job description or resume.</p>
                <div style={{ display: 'flex', gap: '10px' }}>
                     <button style={{ flex: 1, padding: '12px', background: 'var(--grad-main)', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: 900, fontSize: '0.75rem' }}>UPLOAD J.D. (PDF)</button>
                     <button style={{ flex: 1, padding: '12px', background: 'rgba(0,0,0,0.03)', color: '#111', border: '1px solid rgba(0,0,0,0.05)', borderRadius: '12px', fontWeight: 900, fontSize: '0.75rem' }}>SELECT FROM LIBRARY</button>
                </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                 <h4 style={{ fontWeight: 900, fontSize: '1rem' }}>Manual Question Builder</h4>
                 {[1, 2].map(i => (
                    <div key={i} style={{ ...glassStyle, padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                            <div style={{ padding: '8px', background: 'rgba(255,255,255,0.03)', borderRadius: '10px' }}><Clipboard size={16} color="var(--primary)" /></div>
                            <div>
                                <p style={{ fontWeight: 800, fontSize: '0.9rem' }}>{i === 1 ? 'Explain Closures in Javascript' : 'Explain System Scalability'}</p>
                                <p style={{ fontSize: '0.65rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Technical Round • Medium</p>
                            </div>
                        </div>
                        <Trash2 size={16} color="#ef4444" style={{ cursor: 'pointer' }} />
                    </div>
                 ))}
                 <button style={{ width: 'fit-content', color: 'var(--primary)', background: 'none', border: 'none', fontWeight: 900, fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '10px', padding: '0 10px' }}>
                    <Plus size={16} /> ADD CUSTOM QUESTION
                 </button>
            </div>
        </div>
    );
}

function WizardStep5() {
    const criteria = ['Communication', 'Technical Skills', 'Problem Solving', 'Confidence', 'Behavioral Fit', 'Leadership'];
    return (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            {criteria.map((c, i) => (
                <div key={i} style={{ ...glassStyle, padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 800 }}>{c}</span>
                    <input type="checkbox" defaultChecked style={{ width: 20, height: 20 }} />
                </div>
            ))}
        </div>
    );
}

function WizardStep6() {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                <div style={inputGroupStyle}>
                    <label style={labelStyleWizard}>Interview Date</label>
                    <input type="date" style={wizardInputStyle} />
                </div>
                <div style={inputGroupStyle}>
                    <label style={labelStyleWizard}>Start Time</label>
                    <input type="time" style={wizardInputStyle} />
                </div>
            </div>
            <div style={inputGroupStyle}>
                <label style={labelStyleWizard}>Time Slots (Auto-scheduling)</label>
                <div style={{ display: 'flex', gap: '10px' }}>
                    {['30 MINS', '1 HOUR', '1.5 HOURS'].map(t => (
                        <button key={t} style={{ border: '1px solid var(--primary)', background: 'rgba(129, 140, 248, 0.1)', color: '#fff', padding: '10px 20px', borderRadius: '12px', fontSize: '0.7rem', fontWeight: 900 }}>{t}</button>
                    ))}
                </div>
            </div>
        </div>
    );
}

function WizardStep7() {
    const settings = [
        { label: 'Face AI Detection', desc: 'Alert if multi-face detected.' },
        { label: 'Eye Tracking Monitor', desc: 'Warn if candidate looks away.' },
        { label: 'Tab Switch Blocker', desc: 'Auto-end if candidate switches tabs.' },
        { label: 'Noise Analysis', desc: 'Detect background whispering.' }
    ];
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {settings.map((s, i) => (
                <div key={i} style={{ ...glassStyle, padding: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h4 style={{ fontWeight: 900, fontSize: '1rem', marginBottom: '0.2rem' }}>{s.label}</h4>
                        <p style={{ color: 'var(--text-dim)', fontSize: '0.75rem' }}>{s.desc}</p>
                    </div>
                    <div style={{ width: 50, height: 26, background: 'var(--primary)', borderRadius: '20px', position: 'relative' }}>
                        <div style={{ width: 18, height: 18, background: '#000', borderRadius: '50%', position: 'absolute', right: 4, top: 4 }} />
                    </div>
                </div>
            ))}
        </div>
    );
}

function WizardStep8() {
    return (
        <div style={{ textAlign: 'center', padding: '2rem' }}>
            <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'rgba(16, 185, 129, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem', color: '#10b981' }}>
                <CheckCircle size={40} />
            </div>
            <h2 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '1rem' }}>Ready to Launch?</h2>
            <p style={{ color: 'var(--text-dim)', maxWidth: '400px', margin: '0 auto 3rem' }}>All protocols have been validated. Your mock interview engine is ready to broadcast to candidates.</p>
            <div style={{ ...glassStyle, padding: '2rem', display: 'inline-block', textAlign: 'left' }}>
                <p style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--primary)', marginBottom: '1rem' }}>SUMMARY</p>
                <p style={{ fontSize: '0.9rem', fontWeight: 600 }}>• Role: Sr. Frontend Developer</p>
                <p style={{ fontSize: '0.9rem', fontWeight: 600 }}>• Mode: AI Interview Engine</p>
                <p style={{ fontSize: '0.9rem', fontWeight: 600 }}>• Features: Face AI, Tab Blocking Enabled</p>
            </div>
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
        case 1: return 'Basic Information';
        case 2: return 'Interview Type';
        case 3: return 'Execution Mode';
        case 4: return 'Question Builder';
        case 5: return 'Evaluation Criteria';
        case 6: return 'Scheduling Slot';
        case 7: return 'Proctoring Guard';
        case 8: return 'Final Review';
        default: return '';
    }
};

function AIRoomView() {
    return (
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 380px', gap: '2rem', height: '70vh' }}>
            <div style={{ ...glassStyle, padding: '0', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                <div style={{ flex: 1, background: '#f8fafc', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                    <div style={{ width: 200, height: 200, borderRadius: '50%', background: 'var(--primary)', filter: 'blur(80px)', opacity: 0.15, position: 'absolute' }} />
                    <motion.div 
                        animate={{ scale: [1, 1.1, 1] }} 
                        transition={{ repeat: Infinity, duration: 2 }} 
                        style={{ width: 120, height: 120, borderRadius: '50%', border: '2px solid var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', zIndex: 1 }}
                    >
                        <Bot size={50} color="var(--primary)" />
                    </motion.div>
                    
                    <div style={{ marginTop: '3rem', textAlign: 'center', zIndex: 1 }}>
                        <h3 style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: '0.5rem' }}>AI Interviewer v2.4</h3>
                        <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem' }}>"Tell me about a time you handled a production outage..."</p>
                    </div>

                    <div style={{ position: 'absolute', bottom: '40px', display: 'flex', gap: '4px', alignItems: 'flex-end', height: '40px' }}>
                        {[0.4, 0.7, 1, 0.8, 0.5, 0.9, 0.6, 1, 0.7, 0.4].map((h, i) => (
                            <motion.div 
                                key={i} 
                                animate={{ height: [h * 40, (1-h) * 40, h * 40] }} 
                                transition={{ repeat: Infinity, duration: 1, delay: i * 0.1 }}
                                style={{ width: 4, borderRadius: '2px', background: 'var(--primary)' }} 
                            />
                        ))}
                    </div>
                </div>

                <div style={{ padding: '2rem', background: 'rgba(0,0,0,0.02)', borderTop: '1px solid rgba(0,0,0,0.05)', display: 'flex', gap: '2rem' }}>
                    <div style={{ flex: 1 }}>
                        <p style={labelStyle}>LIVE TRANSCRIPTION</p>
                        <p style={{ fontSize: '0.9rem', color: 'var(--text-dim)', marginTop: '8px' }}>Candidate: "So at my previous firm, we had an AWS S3 bucket leak that triggered our pager duty alerts..."</p>
                    </div>
                    <div style={{ width: '200px', display: 'flex', gap: '10px' }}>
                        <button style={{ flex: 1, background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid #ef444440', borderRadius: '12px', fontWeight: 900, fontSize: '0.7rem' }}>END SESSION</button>
                    </div>
                </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div style={{ ...glassStyle, padding: '2rem' }}>
                    <h4 style={{ fontWeight: 900, fontSize: '0.9rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}><Target size={16} /> LIVE SCORE</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                        <LiveMetric label="Technical Accuracy" value={82} color="var(--primary)" />
                        <LiveMetric label="Communication" value={91} color="var(--secondary)" />
                        <LiveMetric label="Confidence" value={78} color="#f59e0b" />
                    </div>
                </div>

                <div style={{ ...glassStyle, padding: '2rem', flex: 1 }}>
                    <h4 style={{ fontWeight: 900, fontSize: '0.9rem', marginBottom: '1.5rem' }}>AI INSIGHTS</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div style={{ padding: '12px', background: 'rgba(16, 185, 129, 0.05)', borderRadius: '12px', border: '1px solid #10b98120' }}>
                             <p style={{ fontSize: '0.75rem', fontWeight: 800, color: '#10b981' }}>STRENGTH</p>
                             <p style={{ fontSize: '0.8rem', marginTop: '4px' }}>Strong understanding of incident response lifecycle.</p>
                        </div>
                        <div style={{ padding: '12px', background: 'rgba(239, 68, 68, 0.05)', borderRadius: '12px', border: '1px solid #ef444420' }}>
                             <p style={{ fontSize: '0.75rem', fontWeight: 800, color: '#ef4444' }}>IMPROVEMENT</p>
                             <p style={{ fontSize: '0.8rem', marginTop: '4px' }}>Use more specific architectural terms when describing S3.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function LiveMetric({ label, value, color }: { label: string, value: number, color: string }) {
    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-dim)' }}>{label}</span>
                <span style={{ fontSize: '0.7rem', fontWeight: 900 }}>{value}%</span>
            </div>
            <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px' }}>
                <motion.div initial={{ width: 0 }} animate={{ width: `${value}%` }} transition={{ duration: 1 }} style={{ height: '100%', background: color, borderRadius: '2px' }} />
            </div>
        </div>
    );
}

// --- STYLES OBJECTS ---

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

const labelStyle: React.CSSProperties = { fontSize: '0.6rem', fontWeight: 900, color: '#999', textTransform: 'uppercase', marginBottom: '4px', letterSpacing: '1px' };
const valueStyle: React.CSSProperties = { fontSize: '0.85rem', fontWeight: 800, color: '#111' };

const modalOverlayStyle: React.CSSProperties = {
    position: 'fixed',
    inset: 0,
    background: 'rgba(255, 255, 255, 0.8)',
    backdropFilter: 'blur(30px)',
    zIndex: 10000,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '6rem 0'
};

const modalContentStyle: React.CSSProperties = {
    width: '95%',
    maxWidth: '1000px',
    height: '100%',
    ...glassStyle,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden'
};

const inputGroupStyle: React.CSSProperties = { display: 'flex', flexDirection: 'column', gap: '10px' };
const labelStyleWizard: React.CSSProperties = { fontSize: '0.75rem', fontWeight: 900, color: 'var(--text-dim)', marginLeft: '10px' };
const wizardInputStyle: React.CSSProperties = { padding: '1.2rem 1.5rem', borderRadius: '18px', background: 'rgba(0,0,0,0.02)', border: '1px solid rgba(0,0,0,0.05)', color: '#111', fontSize: '0.9rem', outline: 'none', fontWeight: 600 };

const tagStyle: React.CSSProperties = { padding: '6px 15px', borderRadius: '12px', background: 'rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.05)', fontSize: '0.65rem', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '8px', color: '#111' };
const dotStyle = (color: string) => ({ width: 6, height: 6, borderRadius: '50%', background: color, boxShadow: `0 0 10px ${color}` });
