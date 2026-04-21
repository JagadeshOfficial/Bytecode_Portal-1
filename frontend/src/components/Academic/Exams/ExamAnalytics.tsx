"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Users, TrendingUp, Award, Clock, 
    AlertTriangle, Shield, CheckCircle,
    ChevronUp, ChevronDown, BarChart2,
    FileText, Play, Search, X, 
    User, Calendar, BrainCircuit, ExternalLink
} from 'lucide-react';

const API_BASE = "http://localhost:8080/api/academic";

const MetricCard = ({ label, value, trend, icon, color }: any) => (
    <div style={{ background: '#fff', border: '1px solid rgba(109, 40, 217, 0.08)', borderRadius: '35px', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '15px', boxShadow: '0 10px 30px rgba(0,0,0,0.02)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ width: 50, height: 50, borderRadius: '16px', background: `${color}10`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: color }}>
                {icon}
            </div>
            {trend !== undefined && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: parseFloat(trend) > 0 ? '#10b981' : '#ef4444', fontSize: '0.75rem', fontWeight: 900 }}>
                    {parseFloat(trend) > 0 ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    {Math.abs(parseFloat(trend))}%
                </div>
            )}
        </div>
        <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 900, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px' }}>{label}</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#1e1b4b', marginTop: '5px' }}>{value}</div>
        </div>
    </div>
);

export default function ExamAnalytics() {
    const [submissions, setSubmissions] = useState<any[]>([]);
    const [proctoringLogs, setProctoringLogs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedSubmission, setSelectedSubmission] = useState<any | null>(null);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 10000); // Polling for live data
        return () => clearInterval(interval);
    }, []);

    const fetchData = async () => {
        try {
            const [subRes, logRes] = await Promise.all([
                fetch(`${API_BASE}/test-submissions`),
                fetch(`${API_BASE}/proctoring/logs`)
            ]);
            
            if (subRes.ok) setSubmissions(await subRes.json());
            if (logRes.ok) setProctoringLogs(await logRes.json());
        } catch (err) {
            console.error("Fetch analytics data failed:", err);
        } finally {
            setLoading(false);
        }
    };

    const getAnomaliesForSubmission = (studentId: string, testId: string) => {
        return proctoringLogs.filter(log => log.studentId === studentId && log.testId === testId);
    };

    const filteredSubmissions = submissions.filter(s => 
        s.studentName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.testName?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const stats = {
        totalAttempts: submissions.length,
        avgScore: submissions.length > 0 ? (submissions.reduce((acc, s) => acc + (s.score || 0), 0) / submissions.length).toFixed(1) : 0,
        integrityScore: proctoringLogs.length > 0 ? (100 - (proctoringLogs.length / submissions.length * 10)).toFixed(1) : 100,
        passed: submissions.filter(s => (s.score || 0) >= 60).length
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem', padding: '10px' }}>
            {/* --- TOP METRICS --- */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem' }}>
                <MetricCard label="Candidate Attempts" value={stats.totalAttempts} trend={12} icon={<Users size={24} />} color="#6366f1" />
                <MetricCard label="Avg Performance" value={`${stats.avgScore}%`} trend={5} icon={<TrendingUp size={24} />} color="#10b981" />
                <MetricCard label="Integrity Rating" value={`${stats.integrityScore}%`} trend={-1} icon={<Shield size={24} />} color="#8b5cf6" />
                <MetricCard label="Passed Threshold" value={stats.passed} trend={8} icon={<Award size={24} />} color="#f59e0b" />
            </div>

            {/* --- CANDIDATE TRANSCRIPTS --- */}
            <div style={{ background: '#fff', border: '1px solid rgba(109, 40, 217, 0.08)', borderRadius: '40px', padding: '3rem', boxShadow: '0 20px 50px rgba(0,0,0,0.02)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                    <div>
                        <h3 style={{ fontSize: '1.6rem', fontWeight: 900, color: '#1e1b4b' }}>Personnel Assessment Registry</h3>
                        <p style={{ color: '#94a3b8', fontSize: '0.9rem', fontWeight: 600 }}>Real-time monitoring and candidate transcripts.</p>
                    </div>
                    <div style={{ position: 'relative', width: '300px' }}>
                        <Search size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                        <input 
                            placeholder="Identify candidate..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{ width: '100%', padding: '14px 14px 14px 48px', borderRadius: '18px', background: '#f8fafc', border: '1px solid rgba(109,40,217,0.1)', fontSize: '0.9rem', fontWeight: 700, outline: 'none' }} 
                        />
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {loading ? (
                        <div style={{ padding: '100px', textAlign: 'center', color: '#94a3b8', fontWeight: 800 }}>SYNCHRONIZING WITH CLUSTER...</div>
                    ) : filteredSubmissions.length === 0 ? (
                        <div style={{ padding: '60px', textAlign: 'center', background: '#fcfaff', borderRadius: '30px', color: '#94a3b8', border: '1px dashed rgba(109,40,217,0.2)' }}>
                            <Search size={40} style={{ marginBottom: '15px', opacity: 0.2 }} />
                            <p style={{ fontWeight: 800 }}>No assessment records localized in current sector.</p>
                        </div>
                    ) : (
                        filteredSubmissions.map((sub, i) => {
                            const anomalies = getAnomaliesForSubmission(sub.studentId, sub.testId);
                            return (
                                <motion.div 
                                    key={sub.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                    onClick={() => setSelectedSubmission(sub)}
                                    style={{ 
                                        display: 'flex', alignItems: 'center', justifyContent: 'space-between', 
                                        padding: '24px 32px', background: '#fff', borderRadius: '28px', 
                                        border: '1px solid rgba(109, 40, 217, 0.05)', cursor: 'pointer',
                                        transition: 'all 0.3s'
                                    }}
                                    whileHover={{ scale: 1.01, boxShadow: '0 15px 40px rgba(109, 40, 217, 0.08)', borderColor: '#6d28d9' }}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                                        <div style={{ width: 56, height: 56, borderRadius: '18px', background: 'linear-gradient(135deg, #6d28d9, #4f46e5)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 900, fontSize: '1.2rem' }}>
                                            {sub.studentName?.[0] || 'U'}
                                        </div>
                                        <div>
                                            <div style={{ fontSize: '1rem', fontWeight: 900, color: '#1e1b4b' }}>{sub.studentName}</div>
                                            <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <FileText size={12} /> {sub.testName} 
                                                <span style={{ opacity: 0.3 }}>•</span> 
                                                <Calendar size={12} /> {new Date(sub.submittedAt).toLocaleDateString()}
                                            </div>
                                        </div>
                                    </div>

                                    <div style={{ display: 'flex', alignItems: 'center', gap: '40px' }}>
                                        <div style={{ textAlign: 'right' }}>
                                            <div style={{ fontSize: '1.2rem', fontWeight: 900, color: sub.score >= 80 ? '#10b981' : sub.score >= 60 ? '#6d28d9' : '#ef4444' }}>{sub.score}%</div>
                                            <div style={{ fontSize: '0.6rem', color: '#94a3b8', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '1px' }}>PROVAL SCORE</div>
                                        </div>

                                        <div style={{ minWidth: '140px' }}>
                                            {anomalies.length > 0 ? (
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#ef4444', background: 'rgba(239, 68, 68, 0.08)', padding: '8px 14px', borderRadius: '12px' }}>
                                                    <AlertTriangle size={14} />
                                                    <span style={{ fontSize: '0.7rem', fontWeight: 900 }}>{anomalies.length} ALERTS</span>
                                                </div>
                                            ) : (
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#10b981', background: 'rgba(16, 185, 129, 0.08)', padding: '8px 14px', borderRadius: '12px' }}>
                                                    <Shield size={14} />
                                                    <span style={{ fontSize: '0.7rem', fontWeight: 900 }}>SECURE</span>
                                                </div>
                                            )}
                                        </div>

                                        <div style={{ width: 40, height: 40, borderRadius: '12px', background: '#f5f3ff', color: '#6d28d9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <ExternalLink size={18} />
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })
                    )}
                </div>
            </div>

            {/* --- TRANSCRIPT MODAL --- */}
            <AnimatePresence>
                {selectedSubmission && (
                    <div style={{ position: 'fixed', inset: 0, zIndex: 5000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px' }}>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedSubmission(null)} style={{ position: 'absolute', inset: 0, background: 'rgba(30, 27, 75, 0.4)', backdropFilter: 'blur(20px)' }} />
                        <motion.div 
                            initial={{ scale: 0.95, opacity: 0, y: 30 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 30 }}
                            style={{ 
                                position: 'relative', width: '100%', maxWidth: '900px', background: '#fff', 
                                borderRadius: '45px', overflow: 'hidden', boxShadow: '0 40px 100px rgba(0,0,0,0.2)',
                                display: 'flex', flexDirection: 'column', maxHeight: '90vh'
                            }}
                        >
                            <div style={{ padding: '40px', background: '#fcfaff', borderBottom: '1px solid rgba(109,40,217,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
                                    <div style={{ width: 80, height: 80, borderRadius: '28px', background: 'linear-gradient(135deg, #6d28d9, #4f46e5)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '2rem', fontWeight: 900 }}>
                                        {selectedSubmission.studentName?.[0]}
                                    </div>
                                    <div>
                                        <h2 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#1e1b4b' }}>{selectedSubmission.studentName}</h2>
                                        <p style={{ color: '#94a3b8', fontWeight: 700, fontSize: '0.9rem' }}>Personnel ID: {selectedSubmission.studentId?.substring(0, 8).toUpperCase()}</p>
                                    </div>
                                </div>
                                <button onClick={() => setSelectedSubmission(null)} style={{ background: '#fff', border: 'none', padding: '12px', borderRadius: '15px', cursor: 'pointer', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}><X size={20} /></button>
                            </div>

                            <div style={{ flex: 1, overflowY: 'auto', padding: '40px', display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '40px' }}>
                                {/* Left Side: Vital Stats */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                                    <div style={{ background: '#fff', border: '1px solid #f1f5f9', borderRadius: '30px', padding: '24px' }}>
                                        <h4 style={{ fontSize: '0.8rem', fontWeight: 900, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '20px', letterSpacing: '1.5px' }}>Assessment Profile</h4>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                <span style={{ color: '#64748b', fontWeight: 700 }}>Test Engine</span>
                                                <span style={{ color: '#1e1b4b', fontWeight: 900 }}>{selectedSubmission.testName}</span>
                                            </div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                <span style={{ color: '#64748b', fontWeight: 700 }}>Timestamp</span>
                                                <span style={{ color: '#1e1b4b', fontWeight: 900 }}>{new Date(selectedSubmission.submittedAt).toLocaleTimeString()}</span>
                                            </div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                <span style={{ color: '#64748b', fontWeight: 700 }}>Performance</span>
                                                <span style={{ color: '#6d28d9', fontWeight: 900 }}>{selectedSubmission.score}%</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div style={{ background: '#fff', border: '1px solid #f1f5f9', borderRadius: '30px', padding: '24px' }}>
                                        <h4 style={{ fontSize: '0.8rem', fontWeight: 900, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '20px', letterSpacing: '1.5px' }}>Proctoring Audit</h4>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                            {getAnomaliesForSubmission(selectedSubmission.studentId, selectedSubmission.testId).length === 0 ? (
                                                <div style={{ color: '#10b981', fontWeight: 800, textAlign: 'center', padding: '20px' }}>
                                                    <Shield size={32} style={{ marginBottom: '10px' }} />
                                                    <div>Clean Protocol Audit</div>
                                                </div>
                                            ) : (
                                                getAnomaliesForSubmission(selectedSubmission.studentId, selectedSubmission.testId).map((log, l) => (
                                                    <div key={l} style={{ display: 'flex', gap: '12px', alignItems: 'center', padding: '12px', background: '#fff1f2', borderRadius: '16px', border: '1px solid rgba(239, 68, 68, 0.1)' }}>
                                                        <AlertTriangle size={14} color="#ef4444" />
                                                        <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#991b1b' }}>{log.type}</div>
                                                        <span style={{ fontSize: '0.65rem', color: '#f87171', marginLeft: 'auto' }}>{new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Right Side: AI Recap & Transcript */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                                    <div style={{ background: '#f5f3ff', border: '1px solid rgba(109,40,217,0.1)', borderRadius: '35px', padding: '30px' }}>
                                        <h4 style={{ fontSize: '1rem', fontWeight: 900, color: '#6d28d9', display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                                            <BrainCircuit size={20} /> Cognitive Insight Recap
                                        </h4>
                                        <p style={{ fontSize: '0.9rem', color: '#4c1d95', lineHeight: 1.7, fontWeight: 600 }}>
                                            Candidate exhibited {selectedSubmission.score > 80 ? 'exceptional' : selectedSubmission.score > 60 ? 'moderate' : 'limited'} comprehension of subject matter. 
                                            Response patterns suggest {getAnomaliesForSubmission(selectedSubmission.studentId, selectedSubmission.testId).length > 2 ? 'high cognitive load or potential divergence' : 'stable mental state during assessment'}. 
                                            Recommend technical review in {selectedSubmission.score < 70 ? 'all modules' : 'advanced sections'}.
                                        </p>
                                    </div>

                                    <div style={{ background: '#fff', border: '1px solid #f1f5f9', borderRadius: '35px', padding: '30px', flex: 1 }}>
                                        <h4 style={{ fontSize: '0.9rem', fontWeight: 900, color: '#1e1b4b', marginBottom: '24px' }}>Submission Transcript (Raw Data)</h4>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxHeight: '300px', overflowY: 'auto', paddingRight: '10px' }}>
                                            {(selectedSubmission.answers || []).map((ans: any, idx: number) => (
                                                <div key={idx} style={{ borderLeft: '3px solid #6d28d9', paddingLeft: '20px', paddingBottom: '10px' }}>
                                                    <div style={{ fontSize: '0.7rem', fontWeight: 900, color: '#94a3b8', marginBottom: '6px' }}>RESPONSE SEQUENCE {idx + 1}</div>
                                                    <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#1e1b4b', marginBottom: '4px' }}>Value: {ans.answer || ans.value || 'N/A'}</div>
                                                    <div style={{ fontSize: '0.7rem', fontWeight: 700, color: ans.isCorrect ? '#10b981' : '#ef4444' }}>
                                                        {ans.isCorrect ? 'VERIFIED: ACCURATE' : 'AUDIT: DISCREPANCY'}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <style jsx global>{`
                ::-webkit-scrollbar { width: 6px; }
                ::-webkit-scrollbar-thumb { background: rgba(109, 40, 217, 0.1); border-radius: 10px; }
                ::-webkit-scrollbar-track { background: transparent; }
            `}</style>
        </div>
    );
}
