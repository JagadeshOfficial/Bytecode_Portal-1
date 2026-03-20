"use client";

import DashboardLayout from '@/components/DashboardLayout';
import { motion } from 'framer-motion';
import { 
    PenTool, Target, BarChart3, TrendingUp, 
    Instagram, Facebook, Linkedin, Youtube,
    Play, Plus, Search, Calendar, Share2
} from 'lucide-react';

export default function SocialMediaDashboard() {
    return (
        <DashboardLayout role="social_media">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
                    <StatCard icon={<Share2 color="#8b5cf6" />} title="Social Reach" value="482K" trend="+24% YoY" color="#8b5cf6" />
                    <StatCard icon={<TrendingUp color="#10b981" />} title="Viral Potential" value="85%" trend="Active Campaigns" color="#10b981" />
                    <StatCard icon={<Target color="#ef4444" />} title="Leads Generation" value="1,280" trend="+124 vs prev" color="#ef4444" />
                    <StatCard icon={<PenTool color="#3b82f6" />} title="Content Nodes" value="48" sub="Scheduled Next 30D" color="#3b82f6" />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: '2rem' }}>
                    {/* --- CONTENT PLANNER --- */}
                    <div className="glass-panel" style={{ padding: '2.5rem', borderRadius: '32px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                            <h3 style={{ fontSize: '1.3rem', fontWeight: 900 }}>Production Content Hub</h3>
                            <button className="btn-quantum" style={{ padding: '10px 20px', fontSize: '0.8rem' }}><Plus size={16} style={{ marginRight: '8px' }} /> NEW CONTENT NODE</button>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            <ContentRow title="Alumni Success Story Reel" platform="INSTAGRAM" time="Tomorrow, 6 PM" status="READY" />
                            <ContentRow title="Microservices 101 Video" platform="YOUTUBE" time="March 22, 11 AM" status="SCHEDULED" />
                            <ContentRow title="Hiring: Spring Boot Devs Post" platform="LINKEDIN" time="Today, 8 PM" status="DRAFT" />
                        </div>
                    </div>

                    {/* --- ANALYTICS --- */}
                    <div className="glass-panel" style={{ padding: '2.5rem', borderRadius: '32px' }}>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: 900, marginBottom: '2.5rem' }}>Platform Sentiment</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <SentimentRow platform="Instagram" value={95} icon={<Instagram size={18} />} color="#ec4899" />
                            <SentimentRow platform="LinkedIn" value={82} icon={<Linkedin size={18} />} color="#3b82f6" />
                            <SentimentRow platform="YouTube" value={92} icon={<Youtube size={18} />} color="#ef4444" />
                        </div>
                        <div style={{ marginTop: '2.5rem', padding: '1.5rem', borderRadius: '20px', background: 'rgba(255,255,255,0.015)', border: '1px solid rgba(255,255,255,0.03)' }}>
                            <div style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-dim)', marginBottom: '10px' }}>Viral Metric of the Day</div>
                            <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#10b981' }}>+4,820 Followers</div>
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
             <div style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '2px' }}>{title}</div>
             <div style={{ fontSize: '2.5rem', fontWeight: 900, margin: '5px 0' }}>{value}</div>
             <div style={{ fontSize: '0.75rem', fontWeight: 800, color: trend ? '#10b981' : 'var(--text-dim)' }}>{trend || sub}</div>
        </div>
    );
}

function ContentRow({ title, platform, time, status }: any) {
    const statusMap: any = {
        'READY': { color: '#10b981', label: 'HUB_LOADED' },
        'SCHEDULED': { color: '#3b82f6', label: 'PRE_SYNC' },
        'DRAFT': { color: '#64748b', label: 'DRAFT_NODE' }
    };
    return (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem', background: 'rgba(255,255,255,0.015)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.03)' }}>
            <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                <div style={{ width: '40px', height: '40px', background: 'rgba(255,255,255,0.03)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900 }}><Play size={18} color="var(--primary)" /></div>
                <div>
                    <div style={{ fontWeight: 800, fontSize: '1.1rem' }}>{title}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>{platform} • {time}</div>
                </div>
            </div>
            <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.7rem', fontWeight: 900, color: statusMap[status]?.color, letterSpacing: '1px' }}>{statusMap[status]?.label}</div>
            </div>
        </div>
    );
}

function SentimentRow({ platform, value, icon, color }: any) {
    return (
        <div style={{ marginBottom: '15px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.8rem', fontWeight: 800 }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-dim)' }}>{icon} {platform}</span>
                <span>{value}%</span>
            </div>
            <div style={{ height: '6px', width: '100%', background: 'rgba(255,255,255,0.03)', borderRadius: '100px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${value}%`, background: color, borderRadius: '100px' }} />
            </div>
        </div>
    );
}
