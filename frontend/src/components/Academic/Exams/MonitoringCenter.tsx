"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Users, AlertTriangle, Monitor, Activity,
    Shield, ShieldAlert, ShieldCheck,
    Video, X, MessageSquare, Power, 
    Lock, Timer, MapPin, Smartphone,
    MoreVertical, Info, RefreshCw
} from 'lucide-react';

const CandidateCard = ({ candidate }: { candidate: any }) => {
    const statusMap = {
        ACTIVE: { color: '#10b981', label: 'Healthy', icon: <ShieldCheck size={14} /> },
        SUSPICIOUS: { color: '#ef4444', label: 'Critical', icon: <ShieldAlert size={14} /> },
        IDLE: { color: '#f59e0b', label: 'Idle', icon: <Shield size={14} /> },
        DISCONNECTED: { color: '#718096', label: 'Offline', icon: <Activity size={14} /> }
    };

    const statusObj = statusMap[candidate.status as keyof typeof statusMap] || statusMap.IDLE;

    return (
        <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{ 
                background: '#fff', 
                border: `1px solid ${candidate.status === 'SUSPICIOUS' ? '#fecaca' : '#e2e8f0'}`,
                borderRadius: '35px',
                padding: '1.5rem',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
                boxShadow: candidate.status === 'SUSPICIOUS' ? '0 10px 30px rgba(239, 68, 68, 0.1)' : 'none'
            }}
        >
            {/* Webcam / Screen Placeholder */}
            <div style={{ 
                width: '100%', 
                aspectRatio: '16/9', 
                background: '#000', 
                borderRadius: '24px', 
                position: 'relative',
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <div style={{ 
                    position: 'absolute', 
                    top: '15px', 
                    left: '15px', 
                    zIndex: 2,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    background: 'rgba(0,0,0,0.5)',
                    backdropFilter: 'blur(10px)',
                    padding: '6px 12px',
                    borderRadius: '10px',
                    color: '#fff',
                    fontSize: '0.65rem',
                    fontWeight: 900
                }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#ef4444', display: 'inline-block', boxShadow: '0 0 10px #ef4444' }}></span>
                    LIVE FEED
                </div>

                <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.3)', fontWeight: 800 }}>{candidate.name}'s Stream</div>
                
                {/* AI Overlay for suspicious candidates */}
                {candidate.status === 'SUSPICIOUS' && (
                    <div style={{ position: 'absolute', inset: 0, border: '4px solid #ef4444', animation: 'pulse 1s infinite' }}></div>
                )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h4 style={{ fontSize: '1rem', fontWeight: 900, color: '#1a202c' }}>{candidate.name}</h4>
                    <p style={{ fontSize: '0.7rem', color: '#718096', fontWeight: 800 }}>{candidate.testName}</p>
                </div>
                <div style={{ padding: '8px 14px', borderRadius: '12px', background: `${statusObj.color}10`, color: statusObj.color, fontSize: '0.65rem', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '6px' }}>
                    {statusObj.icon} {statusObj.label}
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div style={{ padding: '10px', background: '#f8fafc', borderRadius: '15px' }}>
                    <div style={{ fontSize: '0.6rem', color: '#a0aec0', fontWeight: 900 }}>AI RISK SCORE</div>
                    <div style={{ fontSize: '1rem', fontWeight: 900, color: candidate.risk > 70 ? '#ef4444' : '#1a202c' }}>{candidate.risk}%</div>
                </div>
                <div style={{ padding: '10px', background: '#f8fafc', borderRadius: '15px' }}>
                    <div style={{ fontSize: '0.6rem', color: '#a0aec0', fontWeight: 900 }}>TIME REMAINING</div>
                    <div style={{ fontSize: '1rem', fontWeight: 900, color: '#1a202c' }}>{candidate.timeLeft}m</div>
                </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '5px' }}>
                <button style={{ flex: 1, padding: '12px', borderRadius: '14px', border: '1px solid #e2e8f0', background: '#fff', color: '#6366f1', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '0.75rem', fontWeight: 800, cursor: 'pointer' }}>
                    <MessageSquare size={16} /> WARN
                </button>
                <button style={{ flex: 1, padding: '12px', borderRadius: '14px', border: '1px solid #e2e8f0', background: '#fff', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '0.75rem', fontWeight: 800, cursor: 'pointer' }}>
                    <Power size={16} /> BUST
                </button>
                <button style={{ padding: '12px', borderRadius: '14px', border: '1px solid #e2e8f0', background: '#fff', color: '#a0aec0', cursor: 'pointer' }}><Info size={16} /></button>
            </div>
        </motion.div>
    );
};

export default function MonitoringCenter() {
    const [candidates, setCandidates] = useState([
        { id: '1', name: 'Arjun Sharma', testName: 'Full Stack Java', status: 'ACTIVE', risk: 12, timeLeft: 45 },
        { id: '2', name: 'Priya Verma', testName: 'Python Backend', status: 'SUSPICIOUS', risk: 88, timeLeft: 12 },
        { id: '3', name: 'Rahul Gupta', testName: 'Java Full Stack', status: 'IDLE', risk: 45, timeLeft: 60 },
        { id: '4', name: 'Sneha Reddy', testName: 'React Developer', status: 'ACTIVE', risk: 5, timeLeft: 30 },
        { id: '5', name: 'Vikram Singh', testName: 'MERN Assessment', status: 'DISCONNECTED', risk: 0, timeLeft: 85 },
        { id: '6', name: 'Ananya Das', testName: 'Cloud Arch.', status: 'ACTIVE', risk: 18, timeLeft: 22 },
    ]);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
            {/* --- GLOBAL OVERVIEW --- */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem' }}>
                <div style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', borderRadius: '35px', padding: '2rem', color: '#fff', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ padding: '12px', background: 'rgba(255,255,255,0.1)', borderRadius: '15px' }}><Users size={24} /></div>
                        <div style={{ fontSize: '0.75rem', fontWeight: 900, background: 'rgba(255,255,255,0.2)', padding: '5px 12px', borderRadius: '20px' }}>LIVE NOW</div>
                    </div>
                    <div>
                        <div style={{ fontSize: '2.5rem', fontWeight: 900 }}>42</div>
                        <div style={{ fontSize: '0.85rem', fontWeight: 800, opacity: 0.8 }}>Active Candidates</div>
                    </div>
                </div>

                {[
                    { label: 'Suspicious Activities', value: '14', color: '#ef4444', icon: <AlertTriangle size={24} /> },
                    { label: 'Active Test Sessions', value: '08', color: '#10b981', icon: <Monitor size={24} /> },
                    { label: 'Network Stability', value: '98%', color: '#6366f1', icon: <Activity size={24} /> }
                ].map((stat, i) => (
                    <div key={i} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '35px', padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '20px' }}>
                        <div style={{ width: 60, height: 60, borderRadius: '20px', background: `${stat.color}10`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: stat.color }}>
                            {stat.icon}
                        </div>
                        <div>
                            <div style={{ fontSize: '0.75rem', fontWeight: 900, color: '#a0aec0' }}>{stat.label}</div>
                            <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#1a202c' }}>{stat.value}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* --- CONTROLS --- */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fff', padding: '2rem', borderRadius: '35px', border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', gap: '30px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                         <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#10b981' }}></div>
                         <span style={{ fontSize: '0.9rem', fontWeight: 800 }}>Normal: 38</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                         <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#ef4444' }}></div>
                         <span style={{ fontSize: '0.9rem', fontWeight: 800 }}>Critical: 4</span>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '15px' }}>
                     <button style={{ padding: '12px 24px', borderRadius: '16px', border: '1px solid #e2e8f0', background: '#fff', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '10px' }}><RefreshCw size={18} /> SYNC DATA</button>
                     <button className="btn-quantum" style={{ padding: '12px 24px', background: '#ef4444', color: '#fff' }}>PAUSE ALL TESTS</button>
                </div>
            </div>

            {/* --- CANDIDATE GRID --- */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem' }}>
                <AnimatePresence>
                    {candidates.map(candidate => (
                        <CandidateCard key={candidate.id} candidate={candidate} />
                    ))}
                </AnimatePresence>
            </div>

            <style jsx>{`
                @keyframes pulse {
                    0% { border-color: rgba(239, 68, 68, 0.4); }
                    50% { border-color: rgba(239, 68, 68, 1); }
                    100% { border-color: rgba(239, 68, 68, 0.4); }
                }
            `}</style>
        </div>
    );
}
