"use client";
import { API_URLS } from '@/lib/api-config';


import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Search, Plus, Filter, MoreVertical, 
    FileText, Code, Video, Layout, 
    Clock, Users, CheckCircle, BarChart3, 
    Copy, Trash2, Edit2, Play, 
    Eye, Share2, Award, Zap, Shield
} from 'lucide-react';

interface TestCardProps {
    test: any;
    onAction: (action: string, test: any) => void;
}

const STATS_ICON_MAP: Record<string, any> = {
    Play: <Play color="#10b981" />,
    Users: <Users color="#6366f1" />,
    CheckCircle: <CheckCircle color="#f59e0b" />,
    Shield: <Shield color="#8b5cf6" />
};

const TestCard = ({ test, onAction, userRole }: { test: any, onAction: (action: string, test: any) => void, userRole?: string }) => {
    const isStudent = userRole === 'STUDENT' || userRole === 'student';

    const statusColors: any = {
        DEPLOYED: { bg: 'rgba(16, 185, 129, 0.1)', text: '#10b981', border: 'rgba(16, 185, 129, 0.2)' },
        PUBLISHED: { bg: 'rgba(16, 185, 129, 0.1)', text: '#10b981', border: 'rgba(16, 185, 129, 0.2)' },
        STAGING: { bg: 'rgba(245, 158, 11, 0.1)', text: '#f59e0b', border: 'rgba(245, 158, 11, 0.2)' },
        CLOSED: { bg: 'rgba(239, 68, 68, 0.1)', text: '#ef4444', border: 'rgba(239, 68, 68, 0.2)' }
    };

    const typeIcons = {
        MCQ: <FileText size={18} />,
        CODING: <Code size={18} />,
        HYBRID: <Layout size={18} />,
        MIXED: <Layout size={18} />,
        VIDEO: <Video size={18} />
    };

    const status = test.status || 'STAGING';
    const currentStyle = statusColors[status] || statusColors.STAGING;

    return (
        <motion.div 
            whileHover={{ y: -8, boxShadow: '0 20px 40px rgba(0,0,0,0.06)' }}
            style={{ 
                background: '#fff', 
                border: '1px solid #e2e8f0', 
                borderRadius: '32px', 
                padding: '1.8rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '1.2rem',
                position: 'relative',
                overflow: 'hidden'
            }}
        >
            {/* Status Ribbon */}
            <div style={{ 
                position: 'absolute', 
                top: '20px', 
                right: '20px',
                padding: '6px 14px',
                borderRadius: '12px',
                fontSize: '0.7rem',
                fontWeight: 900,
                background: currentStyle.bg,
                color: currentStyle.text,
                border: `1px solid ${currentStyle.border}`,
                textTransform: 'uppercase',
                letterSpacing: '1px'
            }}>
                {status}
            </div>

            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <div style={{ 
                    width: 50, 
                    height: 50, 
                    borderRadius: '16px', 
                    background: 'rgba(99, 102, 241, 0.05)', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    color: '#6366f1'
                }}>
                    {typeIcons[test.type as keyof typeof typeIcons] || <FileText size={24} />}
                </div>
                <div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 900, color: '#1a202c', marginBottom: '4px' }}>{test.name}</h3>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        {Array.isArray(test.tags) && test.tags.map((tag: string) => (
                            <span key={tag} style={{ fontSize: '0.65rem', fontWeight: 800, color: '#718096', background: '#f8fafc', padding: '4px 8px', borderRadius: '6px' }}>#{tag}</span>
                        ))}
                    </div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', background: '#f8fafc', padding: '15px', borderRadius: '20px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <span style={{ fontSize: '0.65rem', fontWeight: 900, color: '#a0aec0', textTransform: 'uppercase' }}>Structure</span>
                    <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#1a202c', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        {test.structure || (test.type === 'MIXED' ? 'MCQ & CODING' : 'Standard')}
                    </span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <span style={{ fontSize: '0.65rem', fontWeight: 900, color: '#a0aec0', textTransform: 'uppercase' }}>Duration</span>
                    <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#1a202c', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Clock size={14} /> {test.duration || 60}m
                    </span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <span style={{ fontSize: '0.65rem', fontWeight: 900, color: '#a0aec0', textTransform: 'uppercase' }}>Questions</span>
                    <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#1a202c' }}>{test.questionCount || (test.questions ? test.questions.length : 0)} Items</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <span style={{ fontSize: '0.65rem', fontWeight: 900, color: '#a0aec0', textTransform: 'uppercase' }}>Difficulty</span>
                    <span style={{ fontSize: '0.85rem', fontWeight: 800, color: test.difficulty === 'HARD' ? '#ef4444' : (test.difficulty === 'MEDIUM' ? '#f59e0b' : '#10b981') }}>{test.difficulty}</span>
                </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '10px', borderTop: '1px solid #f1f5f9' }}>
                <div style={{ display: 'flex', gap: '20px' }}>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '1rem', fontWeight: 900, color: '#1a202c' }}>{test.attempts || 0}</div>
                        <div style={{ fontSize: '0.65rem', fontWeight: 800, color: '#a0aec0' }}>ATTEMPTS</div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '1rem', fontWeight: 900, color: '#10b981' }}>{test.passRate || 0}%</div>
                        <div style={{ fontSize: '0.65rem', fontWeight: 800, color: '#a0aec0' }}>PASS RATE</div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '1rem', fontWeight: 900, color: '#6366f1' }}>{test.aiScore || 99}%</div>
                        <div style={{ fontSize: '0.65rem', fontWeight: 800, color: '#a0aec0' }}>AI CONFID.</div>
                    </div>
                </div>
            </div>

            {!isStudent ? (
                <>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginTop: '5px' }}>
                        <button onClick={() => onAction('EDIT', test)} style={{ padding: '10px', borderRadius: '12px', border: '1px solid #e2e8f0', background: '#fff', color: '#718096', cursor: 'pointer' }} title="Edit"><Edit2 size={16} /></button>
                        <button onClick={() => onAction('DELETE', test)} style={{ padding: '10px', borderRadius: '12px', border: '1px solid #fff1f2', background: '#fff', color: '#ef4444', cursor: 'pointer' }} title="Delete"><Trash2 size={16} /></button>
                        <button onClick={() => onAction('MENU', test)} style={{ padding: '10px', borderRadius: '12px', border: '1px solid #e2e8f0', background: '#fff', color: '#718096', cursor: 'pointer' }} title="More Options"><MoreVertical size={16} /></button>
                    </div>

                    <button 
                        onClick={() => onAction('ASSIGN', test)}
                        className="btn-quantum"
                        style={{ width: '100%', padding: '14px', background: 'var(--primary)', fontWeight: 900, borderRadius: '16px', fontSize: '0.85rem' }}
                    >
                        ASSIGN TO BATCH
                    </button>
                </>
            ) : (
                <button 
                    onClick={() => onAction('TAKE', test)}
                    className="btn-quantum"
                    style={{ width: '100%', padding: '18px', background: '#6d28d9', color: '#fff', fontWeight: 900, borderRadius: '20px', fontSize: '1rem', marginTop: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', boxShadow: '0 10px 20px rgba(109, 40, 217, 0.2)' }}
                >
                    <Play size={20} fill="currentColor" /> START SECURE ASSESSMENT
                </button>
            )}
        </motion.div>
    );
};

export default function TestDashboard({ onActionOverride, currentUser }: { onActionOverride?: (action: string, test: any) => void, currentUser?: any }) {
    const [tests, setTests] = useState<any[]>([]);
    const [stats, setStats] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [testsRes, statsRes] = await Promise.all([
                    fetch(`${API_URLS.LMS_BACKEND}/api/academic/tests`),
                    fetch(`${API_URLS.LMS_BACKEND}/api/academic/tests/stats`)
                ]);

                if (testsRes.ok) {
                    const data = await testsRes.json();
                    setTests(data);
                }
                if (statsRes.ok) {
                    setStats(await statsRes.json());
                }
            } catch (err) {
                console.error(err);
            }
            setLoading(false);
        };
        fetchData();
    }, []);

    const handleAction = (action: string, test: any) => {
        if (onActionOverride) {
            onActionOverride(action, test);
        } else {
            console.log(`Action: ${action} on test:`, test);
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
            {/* --- TOP BAR --- */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: '15px' }}>
                    <div style={{ position: 'relative', width: '350px' }}>
                        <Search style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: '#a0aec0' }} size={18} />
                        <input 
                            placeholder="Search tests by name or tag..." 
                            style={{ width: '100%', padding: '14px 20px 14px 45px', borderRadius: '18px', border: '1px solid #e2e8f0', background: '#fff', fontSize: '0.9rem', outline: 'none' }} 
                        />
                    </div>
                    <button style={{ padding: '14px 24px', borderRadius: '18px', border: '1px solid #e2e8f0', background: '#fff', color: '#4a5568', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                        <Filter size={18} /> FILTER
                    </button>
                </div>
            </div>

            {/* --- STATS ROW --- */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem' }}>
                {(stats.length > 0 ? stats : [
                    { label: 'Active Tests', value: '12', iconType: 'Play', change: '+2 this week' },
                    { label: 'Total Attempts', value: '45.2k', iconType: 'Users', change: 'avg 2.1k / day' },
                    { label: 'Avg Pass Rate', value: '64.5%', iconType: 'CheckCircle', change: 'improved 4%' },
                    { label: 'AI Monitoring Efficiency', value: '99.2%', iconType: 'Shield', change: 'real-time audit active' }
                ]).map((stat, i) => (
                    <div key={i} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '28px', padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '20px' }}>
                        <div style={{ width: 60, height: 60, borderRadius: '20px', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {STATS_ICON_MAP[stat.iconType] || <Play color="var(--primary)" />}
                        </div>
                        <div>
                            <div style={{ fontSize: '0.75rem', fontWeight: 900, color: '#a0aec0', textTransform: 'uppercase' }}>{stat.label}</div>
                            <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#1a202c', margin: '2px 0' }}>{stat.value}</div>
                            <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#718096' }}>{stat.change}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* --- GRID --- */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: '2.5rem' }}>
                {tests.map(test => (
                    <TestCard key={test.id} test={test} onAction={handleAction} userRole={currentUser?.role} />
                ))}
            </div>
        </div>
    );
}
