"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { 
    Users, TrendingUp, Award, Clock, 
    AlertTriangle, Shield, CheckCircle,
    ChevronUp, ChevronDown, BarChart2
} from 'lucide-react';

const MetricCard = ({ label, value, trend, icon, color }: any) => (
    <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '35px', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ width: 50, height: 50, borderRadius: '16px', background: `${color}10`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: color }}>
                {icon}
            </div>
            {trend && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: trend > 0 ? '#10b981' : '#ef4444', fontSize: '0.75rem', fontWeight: 900 }}>
                    {trend > 0 ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    {Math.abs(trend)}%
                </div>
            )}
        </div>
        <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 900, color: '#a0aec0', textTransform: 'uppercase', letterSpacing: '1px' }}>{label}</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#1a202c', marginTop: '5px' }}>{value}</div>
        </div>
    </div>
);

const SkillBar = ({ label, percentage, color }: any) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 800 }}>
            <span style={{ color: '#4a5568' }}>{label}</span>
            <span style={{ color: '#1a202c' }}>{percentage}%</span>
        </div>
        <div style={{ height: '8px', background: '#f1f5f9', borderRadius: '10px', overflow: 'hidden' }}>
            <motion.div initial={{ width: 0 }} animate={{ width: `${percentage}%` }} transition={{ duration: 1 }} style={{ height: '100%', background: color, borderRadius: '10px' }} />
        </div>
    </div>
);

export default function ExamAnalytics() {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
            {/* --- TOP METRICS --- */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem' }}>
                <MetricCard label="Global Avg Score" value="72.4%" trend={12} icon={<TrendingUp size={24} />} color="#6366f1" />
                <MetricCard label="Completion Rate" value="94.8%" trend={3} icon={<CheckCircle size={24} />} color="#10b981" />
                <MetricCard label="Total Candidates" value="1,248" trend={-2} icon={<Users size={24} />} color="#f59e0b" />
                <MetricCard label="Integrity Score" value="99.1%" trend={0.5} icon={<Shield size={24} />} color="#8b5cf6" />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '2.5rem' }}>
                {/* --- SCORE DISTRIBUTION --- */}
                <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '40px', padding: '3rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                        <h3 style={{ fontSize: '1.4rem', fontWeight: 900 }}>Performance Distribution</h3>
                        <select style={{ padding: '8px 16px', borderRadius: '12px', border: '1px solid #e2e8f0', background: '#f8fafc', fontSize: '0.8rem', fontWeight: 700 }}>
                            <option>Last 30 Days</option>
                            <option>All Time</option>
                        </select>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: '250px', gap: '15px' }}>
                        {[45, 62, 85, 92, 78, 55, 30].map((h, i) => (
                            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px' }}>
                                <motion.div 
                                    initial={{ height: 0 }} 
                                    animate={{ height: `${h}%` }} 
                                    transition={{ delay: i * 0.1, duration: 0.8 }}
                                    style={{ 
                                        width: '100%', 
                                        background: `linear-gradient(to top, var(--primary), #8b5cf6)`, 
                                        borderRadius: '12px 12px 4px 4px',
                                        opacity: 0.8 + (i * 0.03)
                                    }} 
                                />
                                <span style={{ fontSize: '0.7rem', fontWeight: 900, color: '#a0aec0' }}>{10 + (i * 10)}%</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* --- SKILL BREAKDOWN --- */}
                <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '40px', padding: '3rem' }}>
                    <h3 style={{ fontSize: '1.4rem', fontWeight: 900, marginBottom: '2.5rem' }}>Skill Proficiency</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        <SkillBar label="Java Fundamentals" percentage={82} color="#6366f1" />
                        <SkillBar label="React Components" percentage={75} color="#10b981" />
                        <SkillBar label="Data Structures" percentage={45} color="#ef4444" />
                        <SkillBar label="System Design" percentage={30} color="#f59e0b" />
                        <SkillBar label="Cloud Arch." percentage={68} color="#8b5cf6" />
                    </div>
                </div>
            </div>

            {/* --- RECENT ANOMALIES --- */}
            <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '40px', padding: '3rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                    <h3 style={{ fontSize: '1.4rem', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <Shield size={24} color="#ef4444" /> Flags & Alerts Center
                    </h3>
                    <button style={{ color: 'var(--primary)', fontWeight: 900, background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.9rem' }}>View Audit Logs</button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    {[
                        { type: 'TAB_SWITCH', candidate: 'Arjun S.', test: 'Full Stack Java', time: '12m ago', severity: 'HIGH' },
                        { type: 'NO_FACE', candidate: 'Priya V.', test: 'UI/UX Quiz', time: '18m ago', severity: 'CRITICAL' },
                        { type: 'MULTIPLE_FACES', candidate: 'Rahul G.', test: 'Node.js Interview', time: '45m ago', severity: 'CRITICAL' },
                    ].map((alert, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px', background: '#f8fafc', borderRadius: '24px', border: '1px solid #e2e8f0' }}>
                             <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                                 <div style={{ width: 45, height: 45, borderRadius: '12px', background: '#fff', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ef4444' }}>
                                     <AlertTriangle size={20} />
                                 </div>
                                 <div>
                                     <div style={{ fontWeight: 900, color: '#1a202c' }}>{alert.type.replace('_', ' ')} Detected</div>
                                     <div style={{ fontSize: '0.75rem', color: '#718096', fontWeight: 700 }}>{alert.candidate} in {alert.test}</div>
                                 </div>
                             </div>
                             <div style={{ display: 'flex', alignItems: 'center', gap: '30px' }}>
                                 <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#a0aec0' }}>{alert.time}</span>
                                 <span style={{ padding: '6px 14px', borderRadius: '10px', fontSize: '0.65rem', fontWeight: 900, background: alert.severity === 'CRITICAL' ? '#ef4444' : '#f59e0b', color: '#fff' }}>{alert.severity}</span>
                             </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
