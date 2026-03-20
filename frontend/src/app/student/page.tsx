"use client";

import DashboardLayout from '@/components/DashboardLayout';
import { 
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
    PieChart, Pie, Cell, RadialBarChart, RadialBar, Legend 
} from 'recharts';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { 
    Book, Award, Clock, Briefcase, 
    ChevronRight, CheckCircle, Play, FileText,
    Star, Target, Zap
} from 'lucide-react';

const learningData = [
    { name: 'Completed', value: 65, fill: '#8b5cf6' },
    { name: 'Ongoing', value: 20, fill: '#3b82f6' },
    { name: 'Pending', value: 15, fill: '#1e293b' },
];

const gradeTrend = [
    { module: 'M1', grade: 85 },
    { module: 'M2', grade: 78 },
    { module: 'M3', grade: 92 },
    { module: 'M4', grade: 88 },
    { module: 'M5', grade: 95 },
];

export default function StudentDashboard() {
    const [isMounted, setIsMounted] = useState(false);
    const [student, setStudent] = useState<any>(null);

    useEffect(() => {
        setIsMounted(true);
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const parsed = JSON.parse(storedUser);
            // Fetch student profile from user-service
            fetch(`http://localhost:8082/api/users/${parsed.email}`)
                .then(res => res.json())
                .then(data => setStudent(data))
                .catch(() => setStudent(parsed));
        }
    }, []);

    const name = student?.fullName || student?.name || 'Student';

    return (
        <DashboardLayout role="student">
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                {/* --- WELCOME HEADER --- */}
                <div style={{ marginBottom: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '20px' }}>
                    <div>
                        <div style={{ padding: '4px 12px', background: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.2)', borderRadius: '100px', fontSize: '0.7rem', fontWeight: 800, color: '#3b82f6', letterSpacing: '2px', display: 'inline-block', marginBottom: '1rem' }}>PATHWAY: FULL STACK SPECIALIST</div>
                        <h1 style={{ fontSize: '2.5rem', fontWeight: 900, letterSpacing: '-1px' }}>Elevate, {name.split(' ')[0]}!</h1>
                        <p style={{ color: 'var(--text-dim)', fontSize: '1.1rem' }}>Ready to conquer the next module? You're <span style={{ color: '#8b5cf6', fontWeight: 800 }}>65% through</span> your journey.</p>
                    </div>
                    <div style={{ display: 'flex', gap: '15px' }}>
                        <QuickBadge icon={<Target size={18} />} label="Daily Goal" value="12/20 XP" />
                        <QuickBadge icon={<Zap size={18} />} label="Streak" value="12 Days" />
                    </div>
                </div>

                {/* --- STUDENT METRICS --- */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
                    <LearningMetricCard icon={<Book color="#8b5cf6" />} title="Modules Completed" value="14 / 28" sub="Next: Advanced React Design" color="#8b5cf6" />
                    <LearningMetricCard icon={<Award color="#f59e0b" />} title="Learning Score" value="842" sub="Top 5% of your Batch" color="#f59e0b" />
                    <LearningMetricCard icon={<Clock color="#10b981" />} title="Attendance" value={`${student?.attendanceRate || 92}%`} sub="Requirement: 85%" color="#10b981" />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: '2rem', flexWrap: 'wrap' }}>
                    {/* Progress Analytics */}
                    <div className="glass-panel" style={{ padding: '2.5rem', borderRadius: '32px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2.5rem' }}>
                            <div>
                                <h3 style={{ fontSize: '1.25rem', fontWeight: 900 }}>Grade Trajectory</h3>
                                <p style={{ fontSize: '0.9rem', color: 'var(--text-dim)' }}>Performance assessment across modules</p>
                            </div>
                            <button style={{ padding: '8px 20px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-bright)', fontSize: '0.8rem', fontWeight: 700 }}>Export Report</button>
                        </div>
                        <div style={{ height: 350, width: '100%', marginLeft: '-20px' }}>
                            {isMounted && (
                                <ResponsiveContainer>
                                    <AreaChart data={gradeTrend}>
                                        <defs>
                                            <linearGradient id="gradeGrad" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                                                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <XAxis dataKey="module" stroke="var(--text-dim)" axisLine={false} tickLine={false} dy={10} />
                                        <YAxis stroke="var(--text-dim)" axisLine={false} tickLine={false} domain={[0, 100]} />
                                        <Tooltip contentStyle={{ background: '#0f172a', border: 'none', borderRadius: '16px', boxShadow: '0 10px 40px rgba(0,0,0,0.5)' }} />
                                        <Area type="monotone" dataKey="grade" stroke="#8b5cf6" strokeWidth={4} fill="url(#gradeGrad)" animationDuration={1500} />
                                    </AreaChart>
                                </ResponsiveContainer>
                            )}
                        </div>
                    </div>

                    {/* Right Side: Resume & Jobs */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div className="glass-panel" style={{ padding: '2rem', borderRadius: '24px', background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(30, 41, 59, 0.4) 100%)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                <Briefcase size={22} color="#8b5cf6" />
                                <span style={{ background: '#10b981', color: '#fff', fontSize: '0.65rem', fontWeight: 900, padding: '4px 10px', borderRadius: '20px' }}>3 NEW MATCHES</span>
                            </div>
                            <h4 style={{ fontWeight: 900, marginBottom: '0.25rem' }}>Career Opportunity</h4>
                            <p style={{ fontSize: '0.85rem', color: 'var(--text-dim)', marginBottom: '1.5rem' }}>Your profile matches 3 upcoming placement drives.</p>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                <JobEntry role="Frontend Dev" company="Meta" salary="24 LPA" />
                                <JobEntry role="SDE Intern" company="Google" salary="Stipend: 1L" />
                            </div>
                            <button style={{ width: '100%', marginTop: '1.5rem', background: '#8b5cf6', color: '#fff', border: 'none', padding: '12px', borderRadius: '12px', fontWeight: 800, fontSize: '0.85rem', cursor: 'pointer' }}>Prepare for Interview</button>
                        </div>

                        <div className="glass-panel" style={{ padding: '2rem', borderRadius: '24px' }}>
                            <h4 style={{ fontWeight: 900, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <Play size={18} color="#ef4444" /> Live Now
                            </h4>
                            <div style={{ display: 'flex', gap: '15px' }}>
                                <div style={{ width: '60px', height: '60px', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Play size={24} color="#ef4444" />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontWeight: 800, fontSize: '0.9rem' }}>Microservices with Spring Boot</div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '4px' }}>By: Vamsi Krishna • 324 Viewing</div>
                                    <button style={{ border: 'none', background: 'none', padding: 0, color: 'var(--primary)', fontWeight: 800, fontSize: '0.75rem', marginTop: '8px', cursor: 'pointer' }}>JOIN STREAM →</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- CURRICULUM OVERVIEW --- */}
                <div style={{ marginTop: '3rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '1.5rem' }}>
                        <h3 style={{ fontSize: '1.4rem', fontWeight: 900 }}>Curriculum Roadmap</h3>
                        <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem', fontWeight: 700 }}>Next Milestone: <span style={{ color: 'var(--text-bright)' }}>AWS Deployment</span></p>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
                        <ModuleCard title="Foundations of Java" modules="4 Units" status="COMPLETED" color="#10b981" />
                        <ModuleCard title="Deep React Patterns" modules="6 Units" status="IN PROGRESS" color="#3b82f6" />
                        <ModuleCard title="Cloud & Microservices" modules="8 Units" status="LOCKED" color="rgba(255,255,255,0.1)" />
                        <ModuleCard title="Final Capstone" modules="1 Project" status="LOCKED" color="rgba(255,255,255,0.1)" />
                    </div>
                </div>
            </motion.div>
        </DashboardLayout>
    );
}

function LearningMetricCard({ icon, title, value, sub, color }: any) {
    return (
        <motion.div whileHover={{ scale: 1.02 }} className="glass-panel" style={{ padding: '2rem', borderRadius: '32px', borderLeft: `6px solid ${color}` }}>
            <div style={{ marginBottom: '1.5rem' }}>{icon}</div>
            <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-dim)', letterSpacing: '0.5px' }}>{title.toUpperCase()}</div>
            <div style={{ fontSize: '2.4rem', fontWeight: 900, margin: '0.5rem 0', letterSpacing: '-1px' }}>{value}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', fontWeight: 700 }}>{sub}</div>
        </motion.div>
    );
}

function QuickBadge({ icon, label, value }: any) {
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '111px' }}>
            <div style={{ color: 'var(--primary)' }}>{icon}</div>
            <div>
                <div style={{ fontSize: '0.65rem', fontWeight: 700, opacity: 0.6 }}>{label}</div>
                <div style={{ fontSize: '0.8rem', fontWeight: 900 }}>{value}</div>
            </div>
        </div>
    );
}

function JobEntry({ role, company, salary }: any) {
    return (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
            <div>
                <div style={{ fontSize: '0.9rem', fontWeight: 800 }}>{role}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>{company}</div>
            </div>
            <div style={{ fontSize: '0.85rem', fontWeight: 900, color: 'var(--text-bright)' }}>{salary}</div>
        </div>
    );
}

function ModuleCard({ title, modules, status, color }: any) {
    return (
        <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: '24px', opacity: status === 'LOCKED' ? 0.5 : 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <span style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-dim)' }}>{modules}</span>
                <span style={{ fontSize: '0.65rem', fontWeight: 900, color: color }}>{status}</span>
            </div>
            <h4 style={{ fontWeight: 800, marginBottom: '1rem' }}>{title}</h4>
            <div style={{ height: '4px', width: '100%', background: 'rgba(255,255,255,0.1)', borderRadius: '100px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: status === 'COMPLETED' ? '100%' : (status === 'IN PROGRESS' ? '40%' : '0%'), background: color }} />
            </div>
        </div>
    );
}
