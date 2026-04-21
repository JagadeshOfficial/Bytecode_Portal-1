"use client";

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { motion } from 'framer-motion';
import { 
    User, Mail, Phone, MapPin, Building, Briefcase, 
    Shield, CheckCircle, Edit2, Camera, Calendar, Award
} from 'lucide-react';

export default function StudentProfilePage() {
    const [loggedUser, setLoggedUser] = useState<any>(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const stored = localStorage.getItem('user');
        if (stored) setLoggedUser(JSON.parse(stored));
    }, []);

    if (!mounted || !loggedUser) return null;

    return (
        <DashboardLayout role="student">
            <div style={{ maxWidth: '1200px', margin: '0 auto', paddingBottom: '5rem' }}>
                
                {/* --- PROFILE HEADER --- */}
                <div className="glass-panel" style={{ padding: '3rem', borderRadius: '40px', marginBottom: '3rem', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '150px', background: 'linear-gradient(90deg, var(--primary), var(--secondary))', opacity: 0.15 }}></div>
                    
                    <div style={{ position: 'relative', display: 'flex', alignItems: 'flex-end', gap: '3rem' }}>
                        <div style={{ position: 'relative' }}>
                            <div style={{ 
                                width: '180px', height: '180px', borderRadius: '40px', 
                                background: 'var(--primary)', border: '8px solid #fff', 
                                boxShadow: '0 20px 40px rgba(0,0,0,0.1)', overflow: 'hidden',
                                display: 'flex', alignItems: 'center', justifyContent: 'center'
                            }}>
                                {loggedUser.profileImage ? (
                                    <img src={loggedUser.profileImage} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                ) : (
                                    <span style={{ fontSize: '5rem', fontWeight: 900, color: '#fff' }}>{loggedUser.fullName?.[0] || 'S'}</span>
                                )}
                            </div>
                            <button style={{ position: 'absolute', bottom: '-10px', right: '-10px', background: 'var(--primary)', color: '#fff', border: '4px solid #fff', borderRadius: '50%', padding: '12px', cursor: 'pointer', boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }}>
                                <Camera size={20} />
                            </button>
                        </div>

                        <div style={{ flex: 1, paddingBottom: '1rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '10px' }}>
                                <h1 style={{ fontSize: '2.8rem', fontWeight: 900, letterSpacing: '-1.5px' }}>{loggedUser.fullName || loggedUser.name}</h1>
                                <span style={{ padding: '6px 16px', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', borderRadius: '100px', fontSize: '0.75rem', fontWeight: 900, letterSpacing: '1px' }}>VERIFIED STUDENT</span>
                            </div>
                            <p style={{ color: 'var(--text-dim)', fontSize: '1.1rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <Mail size={18} /> {loggedUser.email}
                            </p>
                        </div>

                        <button className="btn-quantum" style={{ padding: '12px 24px', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 800 }}>
                            <Edit2 size={18} /> EDIT PROFILE
                        </button>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(350px, 1fr) 2fr', gap: '3rem' }}>
                    
                    {/* --- LEFT COLUMN: INFO --- */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
                        
                        <div className="glass-panel" style={{ padding: '2.5rem', borderRadius: '32px' }}>
                            <h3 style={{ fontSize: '1.2rem', fontWeight: 900, marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <Shield size={20} color="var(--primary)" /> Academic Identity
                            </h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                <InfoItem icon={<Building size={18} />} label="INSTITUTION" value="Bytecode Digital Archive" />
                                <InfoItem icon={<Briefcase size={18} />} label="ENROLLED COURSE" value={loggedUser.courseName || "General Academics"} />
                                <InfoItem icon={<User size={18} />} label="STUDENT ROLE" value={loggedUser.role || "Level 1 Learner"} />
                                <InfoItem icon={<Calendar size={18} />} label="MEMBER SINCE" value={new Date(loggedUser.createdAt || Date.now()).toLocaleDateString()} />
                            </div>
                        </div>

                        <div className="glass-panel" style={{ padding: '2.5rem', borderRadius: '32px' }}>
                            <h3 style={{ fontSize: '1.2rem', fontWeight: 900, marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <MapPin size={20} color="var(--secondary)" /> Contact Node
                            </h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                <InfoItem icon={<Phone size={18} />} label="PRIMARY PHONE" value={loggedUser.phoneNumber || "Not Set"} />
                                <InfoItem icon={<MapPin size={18} />} label="BRANCH / LOCATION" value={loggedUser.branch || "Remote Node"} />
                                <InfoItem icon={<MapPin size={18} />} label="DEPARTMENT" value={loggedUser.department || "General Discovery"} />
                            </div>
                        </div>
                    </div>

                    {/* --- RIGHT COLUMN: ACTIVITY & STATS --- */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
                        
                        {/* Achievements Grid */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.5rem' }}>
                            <StatCard label="MASTERY" value="84%" sub="Top Tier" color="var(--primary)" />
                            <StatCard label="ASSIGNMENTS" value="12" sub="Completed" color="var(--secondary)" />
                            <StatCard label="CREDITS" value="450" sub="Earned" color="#10b981" />
                        </div>

                        <div className="glass-panel" style={{ padding: '3rem', borderRadius: '40px' }}>
                            <h3 style={{ fontSize: '1.4rem', fontWeight: 900, marginBottom: '2.5rem', display: 'flex', alignItems: 'center', gap: '15px' }}>
                                <Award size={24} color="var(--primary)" /> Recognition & Certification
                            </h3>
                            
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                <AchievementRow title="Logic Master: Silver" date="20 Apr 2026" desc="Completed 5 Advanced Logic Node assessments with >90% score." />
                                <AchievementRow title="Synchronized Learner" date="15 Apr 2026" desc="Attended 10 consecutive live sessions without interruption." />
                                <AchievementRow title="Protocol Alpha" date="10 Apr 2026" desc="Successfully deployed the first full-stack architecture on local node." />
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}

function InfoItem({ icon, label, value }: any) {
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-dim)' }}>
                {icon}
            </div>
            <div>
                <p style={{ fontSize: '0.65rem', fontWeight: 900, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>{label}</p>
                <p style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff' }}>{value}</p>
            </div>
        </div>
    );
}

function StatCard({ label, value, sub, color }: any) {
    return (
        <div className="glass-panel" style={{ padding: '2rem', borderRadius: '32px', textAlign: 'center', borderLeft: `6px solid ${color}` }}>
            <p style={{ fontSize: '0.7rem', fontWeight: 900, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '10px' }}>{label}</p>
            <p style={{ fontSize: '2.5rem', fontWeight: 900, color: '#fff', marginBottom: '5px' }}>{value}</p>
            <p style={{ fontSize: '0.8rem', fontWeight: 800, color }}>{sub}</p>
        </div>
    );
}

function AchievementRow({ title, date, desc }: any) {
    return (
        <div style={{ display: 'flex', gap: '20px', padding: '1.5rem', background: 'rgba(255,255,255,0.02)', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)' }}>
            <div style={{ width: '50px', height: '50px', borderRadius: '16px', background: 'rgba(139, 92, 246, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', flexShrink: 0 }}>
                <CheckCircle size={28} />
            </div>
            <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <h4 style={{ fontWeight: 900, fontSize: '1.1rem' }}>{title}</h4>
                    <span style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-dim)' }}>{date}</span>
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-dim)', lineHeight: 1.5, opacity: 0.8 }}>{desc}</p>
            </div>
        </div>
    );
}
