"use client";

import DashboardLayout from '@/components/DashboardLayout';
import { motion } from 'framer-motion';
import { 
    LayoutDashboard, Target, Phone, 
    TrendingUp, Search, UserCheck, 
    Activity, Clock, Calendar, AlertCircle
} from 'lucide-react';

export default function CounsellorDashboard() {
    return (
        <DashboardLayout role="counsellor">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
                    <StatCard icon={<Target color="#3b82f6" />} title="Assigned Leads" value="124" trend="+12 this week" color="#3b82f6" />
                    <StatCard icon={<Phone color="#10b981" />} title="Today's Calls" value="38" trend="12 Pending" color="#10b981" />
                    <StatCard icon={<TrendingUp color="#8b5cf6" />} title="Monthly Conversion" value="14.2%" trend="+2.4% vs prev" color="#8b5cf6" />
                    <StatCard icon={<Activity color="#f59e0b" />} title="Next Target" value="$12,000" sub="85% Achieved" color="#f59e0b" />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: '2rem' }}>
                    <div className="glass-panel" style={{ padding: '2.5rem', borderRadius: '32px' }}>
                        <h3 style={{ fontSize: '1.3rem', fontWeight: 900, marginBottom: '2rem' }}>Priority Outreach Queue</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            <LeadActionRow name="Anjali Sharma" task="Hot Follow-up" time="10:30 AM" status="URGENT" />
                            <LeadActionRow name="Karthik R." task="Initial Outreach" time="11:15 AM" status="NORMAL" />
                            <LeadActionRow name="Deepak Kumar" task="Fee Discussion" time="12:00 PM" status="HIGH" />
                        </div>
                    </div>

                    <div className="glass-panel" style={{ padding: '2.5rem', borderRadius: '32px' }}>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: 900, marginBottom: '1.5rem' }}>Daily Performance Goal</h3>
                        <div style={{ height: '200px', width: '100%', borderRadius: '50%', border: '8px solid rgba(255,255,255,0.05)', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <div style={{ textAlign: 'center' }}>
                                <div style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--primary)' }}>85%</div>
                                <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-dim)' }}>GOAL ACHIEVED</div>
                            </div>
                            <div style={{ position: 'absolute', inset: -8, borderRadius: '50%', border: '8px solid var(--primary)', borderBottomColor: 'transparent', borderLeftColor: 'transparent' }} />
                        </div>
                        <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 800 }}>
                                <span style={{ color: 'var(--text-dim)' }}>Calls Completed</span>
                                <span>32 / 40</span>
                            </div>
                            <div style={{ height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '100px', overflow: 'hidden' }}>
                                <div style={{ height: '100%', width: '80%', background: 'var(--primary)', borderRadius: '100px' }} />
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </DashboardLayout>
    );
}

function StatCard({ icon, title, value, trend, sub, color }: any) {
    return (
        <div className="glass-panel" style={{ padding: '1.75rem', borderRadius: '24px', borderLeft: `4px solid ${color}` }}>
             <div style={{ color, marginBottom: '0.75rem' }}>{icon}</div>
             <div style={{ fontSize: '0.65rem', fontWeight: 900, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '1px' }}>{title}</div>
             <div style={{ fontSize: '2rem', fontWeight: 900, margin: '5px 0' }}>{value}</div>
             <div style={{ fontSize: '0.75rem', fontWeight: 800, color: trend ? '#10b981' : 'var(--text-dim)' }}>{trend || sub}</div>
        </div>
    );
}

function LeadActionRow({ name, task, time, status }: any) {
    return (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem', background: 'rgba(255,255,255,0.015)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.03)' }}>
            <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(59, 130, 246, 0.1)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900 }}>{name.charAt(0)}</div>
                <div>
                    <div style={{ fontWeight: 800, fontSize: '1rem' }}>{name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Task: {task}</div>
                </div>
            </div>
            <div style={{ textAlign: 'right' }}>
                <div style={{ fontWeight: 900, color: status === 'URGENT' ? '#ef4444' : '#10b981', fontSize: '0.8rem' }}>{status}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontWeight: 800 }}>{time}</div>
            </div>
        </div>
    );
}
