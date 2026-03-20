"use client";

import DashboardLayout from '@/components/DashboardLayout';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { 
    TrendingUp, Plus, Search, Edit2, Trash2, 
    Instagram, Facebook, Linkedin, Youtube,
    BarChart3, Target, MousePointer2, Share2,
    Calendar, Play, MessageCircle
} from 'lucide-react';

export default function MarketingManagement() {
    const [campaigns, setCampaigns] = useState<any[]>([]);

    useEffect(() => {
        setCampaigns([
            { id: 1, title: 'Spring Mastery 2026', platform: 'INSTAGRAM', reached: '42K', leads: 482, status: 'RUNNING' },
            { id: 2, title: 'DevOps Corporate Push', platform: 'LINKEDIN', reached: '15K', leads: 124, status: 'PAUSED' },
            { id: 3, title: 'React Mastery Web Ads', platform: 'GOOGLE', reached: '85K', leads: 955, status: 'RUNNING' },
        ]);
    }, []);

    return (
        <DashboardLayout role="super_admin">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                    <div>
                        <h1 style={{ fontSize: '2.5rem', fontWeight: 900, letterSpacing: '-1px' }}>Universal Marketing Pulse</h1>
                        <p style={{ color: 'var(--text-dim)', fontSize: '1.1rem' }}>Architect global campaigns and oversee cross-platform lead acquisition.</p>
                    </div>
                    <button className="btn-quantum" style={{ padding: '14px 28px' }}>
                        <Plus size={18} style={{ marginRight: '8px' }} /> NEW CAMPAIGN NODE
                    </button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '2.5rem', marginBottom: '4rem' }}>
                    {campaigns.map((c, i) => (
                        <CampaignCard key={c.id} {...c} />
                    ))}
                </div>

                {/* --- CONTENT PLANNER / REEL SCHEDULER --- */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2.5rem' }}>
                    <div className="glass-panel" style={{ padding: '2.5rem', borderRadius: '40px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                            <h3 style={{ fontSize: '1.4rem', fontWeight: 900 }}>Short-form Scheduler</h3>
                            <button style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', color: 'var(--text-bright)', padding: '10px', borderRadius: '12px' }}>
                                <Calendar size={18} />
                            </button>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            <ContentPlanRow title="Day in a Life: Intern" platform="INSTAGRAM" time="Tomorrow, 6 PM" status="READY" />
                            <ContentPlanRow title="Spring Boot in 60s" platform="YOUTUBE" time="Today, 8 PM" status="SCHEDULED" />
                            <ContentPlanRow title="React Patterns Reel" platform="FACEBOOK" time="March 22, 11 AM" status="PENDING" />
                        </div>
                    </div>

                    <div className="glass-panel" style={{ padding: '2.5rem', borderRadius: '40px' }}>
                         <h3 style={{ fontSize: '1.4rem', fontWeight: 900, marginBottom: '2.5rem' }}>Conversion Analytics</h3>
                         <div style={{ height: '300px', display: 'flex', alignItems: 'flex-end', gap: '2rem', padding: '0 1rem' }}>
                             <Bar value={85} label="MAR" color="#8b5cf6" />
                             <Bar value={42} label="FEB" color="#3b82f6" />
                             <Bar value={95} label="JAN" color="#10b981" />
                             <Bar value={60} label="DEC" color="#f59e0b" />
                         </div>
                    </div>
                </div>
            </motion.div>
        </DashboardLayout>
    );
}

function CampaignCard({ title, platform, reached, leads, status }: any) {
    const iconMap: any = {
        'INSTAGRAM': <Instagram size={24} />,
        'LINKEDIN': <Linkedin size={24} />,
        'GOOGLE': <Target size={24} />,
        'YOUTUBE': <Youtube size={24} />
    };
    return (
        <div className="glass-panel" style={{ padding: '2rem', borderRadius: '32px', borderTop: '4px solid #8b5cf6', background: 'linear-gradient(180deg, rgba(139, 92, 246, 0.05) 0%, transparent 100%)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
                <div style={{ padding: '12px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', color: 'var(--primary)' }}>
                    {iconMap[platform]}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '0.65rem', fontWeight: 900, color: status === 'RUNNING' ? '#10b981' : '#f59e0b', letterSpacing: '2px', background: status === 'RUNNING' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)', padding: '5px 12px', borderRadius: '100px' }}>{status}</span>
                    <button style={{ background: 'none', border: 'none', color: 'var(--text-dim)', cursor: 'pointer' }}><MoreHorizontal size={18} /></button>
                </div>
            </div>

            <h3 style={{ fontSize: '1.4rem', fontWeight: 900, marginBottom: '1.5rem' }}>{title}</h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <div>
                    <div style={{ fontSize: '0.65rem', fontWeight: 900, color: 'var(--text-dim)', textTransform: 'uppercase' }}>Impressions</div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 900, marginTop: '4px' }}>{reached}</div>
                </div>
                <div>
                    <div style={{ fontSize: '0.65rem', fontWeight: 900, color: 'var(--text-dim)', textTransform: 'uppercase' }}>Leads Gained</div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 900, marginTop: '4px', color: '#10b981' }}>{leads}</div>
                </div>
            </div>

            <button style={{ width: '100%', marginTop: '2rem', padding: '12px', background: 'rgba(255,255,255,0.03)', color: '#fff', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', fontWeight: 800, cursor: 'pointer' }}>ADJUST BIDDING</button>
        </div>
    );
}

function ContentPlanRow({ title, platform, time, status }: any) {
    return (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem', background: 'rgba(255,255,255,0.015)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.03)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <div style={{ padding: '8px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px' }}><Play size={16} color="var(--primary)" /></div>
                <div>
                    <div style={{ fontWeight: 800, fontSize: '0.95rem' }}>{title}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>{platform} • {time}</div>
                </div>
            </div>
            <div style={{ fontSize: '0.65rem', fontWeight: 900, color: status === 'READY' ? '#10b981' : '#f59e0b' }}>{status}</div>
        </div>
    );
}

function Bar({ value, label, color }: any) {
    return (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
            <div style={{ flex: 1, width: '100%', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
                <motion.div 
                    initial={{ height: 0 }} 
                    animate={{ height: `${value}%` }} 
                    style={{ width: '30px', background: color, borderRadius: '6px 6px 0 0', boxShadow: `0 0 15px ${color}40` }} 
                />
            </div>
            <div style={{ fontSize: '0.7rem', fontWeight: 900, color: 'var(--text-dim)' }}>{label}</div>
        </div>
    );
}
