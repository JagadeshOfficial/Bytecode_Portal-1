"use client";

import DashboardLayout from '@/components/DashboardLayout';
import { motion } from 'framer-motion';
import { 
    Briefcase, Target, UserCheck, Calendar, 
    TrendingUp, Search, Plus, MapPin, 
    Award, CheckCircle, Clock, Link
} from 'lucide-react';

export default function PlacementDashboard() {
    return (
        <DashboardLayout role="placement">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
                    <StatCard icon={<UserCheck color="#10b981" />} title="Placement Ready" value="482" trend="85% of total" color="#10b981" />
                    <StatCard icon={<Briefcase color="#3b82f6" />} title="Active Openings" value="124" trend="12 New Today" color="#3b82f6" />
                    <StatCard icon={<Calendar color="#8b5cf6" />} title="Interviews Today" value="38" trend="12 Pending" color="#8b5cf6" />
                    <StatCard icon={<Award color="#f59e0b" />} title="Placements Month" value="12" trend="Avg: 85K/mo" color="#f59e0b" />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: '2rem' }}>
                    {/* --- READINESS TRACKER --- */}
                    <div className="glass-panel" style={{ padding: '2.5rem', borderRadius: '32px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                            <h3 style={{ fontSize: '1.3rem', fontWeight: 900 }}>Ready for Deployment</h3>
                            <button className="btn-quantum" style={{ padding: '10px 20px', fontSize: '0.8rem' }}><Search size={16} style={{ marginRight: '8px' }} /> SEARCH TALENT</button>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            <StudentReadinessRow name="Sai Kiran" skills="Full Stack, AWS" score="4.8" status="READY" />
                            <StudentReadinessRow name="Anjali Sharma" skills="React, Node.js" score="4.5" status="INTERVIEW" />
                            <StudentReadinessRow name="Deepak Kumar" skills="Java, Microservices" score="4.2" status="READY" />
                        </div>
                    </div>

                    {/* --- JOB MASTER LIST --- */}
                    <div className="glass-panel" style={{ padding: '2.5rem', borderRadius: '32px' }}>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: 900, marginBottom: '2.5rem' }}>Production Openings</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <JobRow company="Google" role="Cloud Architect" pkg="38 LPA" location="Hybrid" />
                            <JobRow company="TechCorp" role="Full Stack Eng" pkg="24 LPA" location="On-site" />
                            <JobRow company="Vangrove" role="DevOps Lead" pkg="28 LPA" location="Remote" />
                        </div>
                        <button style={{ width: '100%', marginTop: '2rem', padding: '12px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', color: '#fff', fontSize: '0.8rem', fontWeight: 800 }}>MANAGE ALL OPENINGS →</button>
                    </div>
                </div>
            </motion.div>
        </DashboardLayout>
    );
}

function StatCard({ icon, title, value, trend, sub, color }: any) {
    return (
        <div className="glass-panel" style={{ padding: '1.75rem', borderRadius: '24px', borderLeft: `6px solid ${color}` }}>
             <div style={{ color, marginBottom: '0.75rem' }}>{icon}</div>
             <div style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '2px' }}>{title}</div>
             <div style={{ fontSize: '2.5rem', fontWeight: 900, margin: '5px 0' }}>{value}</div>
             <div style={{ fontSize: '0.75rem', fontWeight: 800, color: trend ? '#10b981' : 'var(--text-dim)' }}>{trend || sub}</div>
        </div>
    );
}

function StudentReadinessRow({ name, skills, score, status }: any) {
    const statusMap: any = {
        'READY': { color: '#10b981', label: 'DEPLOYMENT_READY' },
        'INTERVIEW': { color: '#3b82f6', label: 'HUB_RESERVED' },
        'PREP': { color: '#f59e0b', label: 'STAGING_READY' }
    };
    return (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem', background: 'rgba(255,255,255,0.015)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.03)' }}>
            <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                <div style={{ width: '40px', height: '40px', background: 'rgba(255,255,255,0.03)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900 }}>{name.charAt(0)}</div>
                <div>
                    <div style={{ fontWeight: 800, fontSize: '1.1rem' }}>{name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>{skills}</div>
                </div>
            </div>
            <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.7rem', fontWeight: 900, color: statusMap[status]?.color, letterSpacing: '1px', marginBottom: '4px' }}>{statusMap[status]?.label}</div>
                <div style={{ fontWeight: 900, color: '#10b981', background: 'rgba(16, 185, 129, 0.1)', padding: '4px 10px', borderRadius: '100px', fontSize: '0.75rem' }}>{score} SKILL_RANK</div>
            </div>
        </div>
    );
}

function JobRow({ company, role, pkg, location }: any) {
    return (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '12px', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
            <div>
                <div style={{ fontWeight: 900, fontSize: '1rem' }}>{company} • {role}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontWeight: 800 }}>{location} • {pkg}</div>
            </div>
            <button style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 800, cursor: 'pointer' }}><Link size={16} /></button>
        </div>
    );
}
