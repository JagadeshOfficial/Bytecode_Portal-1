"use client";

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
        } else if (action === 'ASSIGN') {
            alert("Batch assignment registry is being synchronized. Please wait.");
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
                        <Layout size={18} /> TEST ENGINE
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
                                <Shield size={18} /> MONITORING CENTER
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
                                <BarChart3 size={18} /> ANALYTICS
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
                             + NEW ASSESSMENT
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
            </AnimatePresence>
        </div>
    );
}
