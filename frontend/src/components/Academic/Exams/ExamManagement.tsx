"use client";
import { API_URLS } from '@/lib/api-config';


import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Layout, Shield, Settings,
    BarChart3, Zap, Layers
} from 'lucide-react';
import TestDashboard from './TestDashboard';
import MonitoringCenter from './MonitoringCenter';
import TestCreationWizard from './TestCreationWizard';
import ExamAnalytics from './ExamAnalytics';
import TestExaminationEngine from './TestExaminationEngine';

export default function ExamManagement() {
    const [view, setView] = useState<'DASHBOARD' | 'MONITORING' | 'ANALYTICS'>('DASHBOARD');
    const [isCreating, setIsCreating] = useState(false);
    const [assigningTest, setAssigningTest] = useState<any>(null);
    const [takingTest, setTakingTest] = useState<any>(null);
    const [currentUser, setCurrentUser] = useState<any>(null);

    React.useEffect(() => {
        if (typeof window !== 'undefined') {
            const storedUser = localStorage.getItem('user');
            if (storedUser) setCurrentUser(JSON.parse(storedUser));
        }
    }, []);

    const handleTestAction = (action: string, test: any) => {
        if (action === 'PREVIEW' || action === 'TAKE') {
            setTakingTest(test);
        } else if (action === 'ANALYTICS') {
            setView('ANALYTICS');
        } else if (action === 'EDIT') {
            setIsCreating(true); // Opening wizard for now as edit proxy
        } else if (action === 'DELETE') {
            if (!confirm(`Are you sure you want to permanently delete "${test.name}"? This action cannot be undone.`)) return;
            fetch(`${API_URLS.LMS_BACKEND}/api/academic/tests/${test.id || test._id}`, { method: 'DELETE' })
                .then(res => {
                    if (res.ok) {
                        alert("Assessment deleted successfully. Curriculum registry updated.");
                        window.location.reload(); // Refresh to reflect change
                    } else {
                        alert("Failed to delete assessment. Error recorded in system logs.");
                    }
                })
                .catch(err => console.error("Delete failure:", err));
        } else if (action === 'MENU') {
            alert("Accessing Advanced Protocol Registry... This module is currently undergoing system maintenance.");
        } else if (action === 'ASSIGN') {
            setAssigningTest(test);
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
            {/* --- SUB-NAVIGATION --- */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: '15px', background: 'rgba(255,255,255,0.05)', padding: '10px', borderRadius: '24px', border: '1px solid rgba(139, 92, 246, 0.1)' }}>
                    <button
                        onClick={() => setView('DASHBOARD')}
                        style={{
                            padding: '12px 28px',
                            borderRadius: '16px',
                            background: view === 'DASHBOARD' ? 'var(--primary)' : 'transparent',
                            color: view === 'DASHBOARD' ? '#fff' : 'var(--text-dim)',
                            border: 'none',
                            fontWeight: 800,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            transition: 'all 0.3s'
                        }}
                    >
                        <Layout size={18} /> ALL TESTS
                    </button>
                    {(currentUser?.role !== 'STUDENT' && currentUser?.role !== 'student') && (
                        <>
                            <button
                                onClick={() => setView('MONITORING')}
                                style={{
                                    padding: '12px 28px',
                                    borderRadius: '16px',
                                    background: view === 'MONITORING' ? 'var(--primary)' : 'transparent',
                                    color: view === 'MONITORING' ? '#fff' : 'var(--text-dim)',
                                    border: 'none',
                                    fontWeight: 800,
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '10px',
                                    transition: 'all 0.3s'
                                }}
                            >
                                <Shield size={18} /> LIVE MONITORING
                            </button>
                            <button
                                onClick={() => setView('ANALYTICS')}
                                style={{
                                    padding: '12px 28px',
                                    borderRadius: '16px',
                                    background: view === 'ANALYTICS' ? 'var(--primary)' : 'transparent',
                                    color: view === 'ANALYTICS' ? '#fff' : 'var(--text-dim)',
                                    border: 'none',
                                    fontWeight: 800,
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '10px',
                                    transition: 'all 0.3s'
                                }}
                            >
                                <BarChart3 size={18} /> EXAM REPORTS
                            </button>
                        </>
                    )}
                </div>

                <div style={{ display: 'flex', gap: '15px' }}>
                    <button style={{ padding: '12px 20px', borderRadius: '16px', background: '#fff', border: '1px solid #e2e8f0', color: '#718096' }}><Settings size={20} /></button>
                    {(currentUser?.role !== 'STUDENT' && currentUser?.role !== 'student') && (
                        <button
                            onClick={() => setIsCreating(true)}
                            className="btn-quantum"
                            style={{ padding: '12px 24px', background: '#10b981', color: '#fff', borderRadius: '16px', fontWeight: 900, fontSize: '0.85rem' }}
                        >
                            + CREATE NEW TEST
                        </button>
                    )}
                </div>
            </div>

            {/* --- CONTENT AREA --- */}
            <motion.div
                key={view}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
            >
                {view === 'DASHBOARD' ? (
                    <TestDashboard
                        onActionOverride={handleTestAction}
                        currentUser={currentUser}
                    />
                ) : view === 'MONITORING' ? (
                    <MonitoringCenter />
                ) : (
                    <ExamAnalytics />
                )}
            </motion.div>

            {/* --- ENGINE OVERLAY --- */}
            <AnimatePresence>
                {takingTest && (
                    <TestExaminationEngine
                        test={takingTest}
                        candidate={currentUser || { fullName: 'Demo Candidate', id: 'demo' }}
                        onComplete={() => setTakingTest(null)}
                        onExit={() => setTakingTest(null)}
                    />
                )}
            </AnimatePresence>

            {/* --- MODALS --- */}
            <AnimatePresence>
                {isCreating && <TestCreationWizard onClose={() => setIsCreating(false)} />}
                {assigningTest && <AssignTestModal test={assigningTest} onClose={() => setAssigningTest(null)} />}
            </AnimatePresence>
        </div>
    );
}

function AssignTestModal({ test, onClose }: { test: any, onClose: () => void }) {
    const handleAssign = async () => {
        try {
            const updated = { ...test, status: 'DEPLOYED' };
            const res = await fetch(`${API_URLS.LMS_BACKEND}/api/academic/tests/${test.id || test._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updated)
            });
            if (res.ok) {
                alert("Assessment successfully assigned to Batch and deployed.");
                window.location.reload();
            }
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <div style={{ position: 'fixed', inset: 0, zIndex: 11000, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(15, 23, 42, 0.8)', backdropFilter: 'blur(12px)' }}>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} style={{ background: '#fff', borderRadius: '24px', padding: '2rem', width: '400px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)' }}>
                <h3 style={{ fontWeight: 900, marginBottom: '1rem', color: '#111', fontSize: '1.2rem' }}>Assign Assessment</h3>
                <p style={{ color: '#64748b', marginBottom: '1.5rem', fontSize: '0.95rem', lineHeight: '1.5' }}>
                    You are about to assign <b>{test.name}</b>. This will change its status to <b>DEPLOYED</b> and make it available for execution.
                </p>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <button onClick={onClose} style={{ flex: 1, padding: '12px', background: '#f1f5f9', color: '#64748b', borderRadius: '12px', fontWeight: 800, cursor: 'pointer', border: 'none' }}>Cancel</button>
                    <button onClick={handleAssign} style={{ flex: 1, padding: '12px', background: 'var(--primary)', color: '#fff', borderRadius: '12px', fontWeight: 800, cursor: 'pointer', border: 'none' }}>Deploy Now</button>
                </div>
            </motion.div>
        </div>
    );
}
