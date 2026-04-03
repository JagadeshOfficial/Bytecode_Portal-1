"use client";

import DashboardLayout from '@/components/DashboardLayout';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { 
    Search, Plus, MapPin, Phone, 
    Mail, Filter, MoreHorizontal, UserCheck,
    TrendingUp, FileDown, Layers, Target,
    Activity, ChevronRight, X, CheckCircle, 
    UserPlus, Trash2, CheckSquare, Square, ChevronDown,
    Zap, Award, ArrowUpRight, BarChart3, PieChart,
    MessageCircle, Calendar, Clock
} from 'lucide-react';

type LeadStatus = 'NEW' | 'CONTACTED' | 'INTERESTED' | 'NOT_INTERESTED' | 'CONVERTED';

interface Lead {
    id: string;
    name: string;
    email: string;
    phone: string;
    course: string;
    source: string;
    status: LeadStatus;
    assignedTo: string;
    score: number;
    activity: { date: string, text: string }[];
}

export default function EliteCRM() {
    const [leads, setLeads] = useState<Lead[]>([]);
    const [selectedLeads, setSelectedLeads] = useState<string[]>([]);
    const [activeLead, setActiveLead] = useState<Lead | null>(null);
    const [isBulkAssignModalOpen, setIsBulkAssignModalOpen] = useState(false);
    const [filterCourse, setFilterCourse] = useState('ALL');

    const counsellors = [
        { name: 'Anjali Sharma', rate: '78%', active: 45, conversions: 12 },
        { name: 'Siddharth M.', rate: '92%', active: 38, conversions: 18 },
        { name: 'Priya Verma', rate: '65%', active: 22, conversions: 5 }
    ];

    useEffect(() => {
        setLeads([
            { id: 'LD001', name: 'Sai Kiran', email: 'sai@example.com', phone: '9876543210', course: 'Java Full Stack', source: 'Instagram Ads', status: 'NEW', assignedTo: 'Not Assigned', score: 85, activity: [{ date: 'Today, 10:30 AM', text: 'Lead acquired via Instagram' }] },
            { id: 'LD002', name: 'Deepak Rao', email: 'deepak@tech.com', phone: '8888877777', course: 'DevOps Master', source: 'LinkedIn', status: 'INTERESTED', assignedTo: 'Anjali Sharma', score: 92, activity: [{ date: 'Today, 09:15 AM', text: 'Anjali called: Very interested' }, { date: 'Yesterday', text: 'Lead acquired via LinkedIn' }] },
            { id: 'LD003', name: 'Ankita Ray', email: 'ankita@outlook.com', phone: '9999900000', course: 'UI/UX Pro', source: 'Direct Walk-in', status: 'CONVERTED', assignedTo: 'Siddharth M.', score: 100, activity: [{ date: 'Oct 12', text: 'Siddharth M. closed the lead' }, { date: 'Oct 11', text: 'Walk-in interview completed' }] }
        ]);
    }, []);

    const toggleSelect = (id: string) => {
        setSelectedLeads(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
    };

    return (
        <DashboardLayout role="super_admin">
            <div style={{ position: 'relative', minHeight: '100vh', padding: '0 2rem 5rem' }}>
                
                {/* --- ELITE HEADER --- */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '4rem' }}>
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                        <div style={{ fontSize: '0.8rem', fontWeight: 900, color: 'var(--primary)', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '12px' }}>Enterprise CRM Suite</div>
                        <h1 style={{ fontSize: '3.5rem', fontWeight: 950, letterSpacing: '-2.5px', lineHeight: 0.85, color: '#fff' }}>Quantum <span style={{ color: 'var(--primary)' }}>Growth</span> Hub</h1>
                        <p style={{ color: 'var(--text-dim)', fontSize: '1.1rem', marginTop: '20px', maxWidth: '600px', lineHeight: '1.6' }}>Master your sales funnel with high-fidelity tracking, performance leaderboards, and automated conversion intelligence.</p>
                    </motion.div>
                    
                    <div style={{ display: 'flex', gap: '15px' }}>
                         <button className="btn-elite-secondary"><FileDown size={18} /> EXPORT DATA</button>
                         <button className="btn-elite-primary"><Plus size={18} /> NEW PROSPECT</button>
                    </div>
                </div>

                {/* --- ELITE ANALYTICS FUNNEL --- */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '4rem' }}>
                    <AnalyticsCard title="Acquisitions" value="1,452" trend="+124 vs last month" icon={<Target size={22} />} color="#8b5cf6" />
                    <AnalyticsCard title="Qualified" value="984" trend="68% Conversion Ratio" icon={<Zap size={22} />} color="#3b82f6" />
                    <AnalyticsCard title="Negotiating" value="212" trend="₹12.4L Pipeline Value" icon={<Layers size={22} />} color="#f59e0b" />
                    <AnalyticsCard title="Converted" value="84" trend="High retention rate" icon={<Award size={22} />} color="#10b981" />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '3rem' }}>
                    
                    {/* --- MAIN INTERFACE: LEAD PRODUCTION --- */}
                    <div>
                         <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <button className="tab-btn active">Live Feed</button>
                                <button className="tab-btn">Pipeline</button>
                                <button className="tab-btn">Reports</button>
                            </div>
                            <div className="filter-wrapper">
                                <Search size={16} />
                                <input placeholder="Search production feed..." />
                            </div>
                         </div>

                         <div className="elite-container">
                            <table className="elite-table">
                                <thead>
                                    <tr>
                                        <th style={{ width: '40px' }}><Square size={16} /></th>
                                        <th>Lead Entity</th>
                                        <th>Course/Interest</th>
                                        <th>Agent Assigned</th>
                                        <th>Status Score</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {leads.map((l, i) => (
                                        <tr key={l.id} className={selectedLeads.includes(l.id) ? 'row-selected' : ''}>
                                            <td><button onClick={() => toggleSelect(l.id)} className="chk-btn">{selectedLeads.includes(l.id) ? <CheckSquare size={18} color="var(--primary)" /> : <Square size={18} color="var(--text-dim)" opacity={0.3} />}</button></td>
                                            <td onClick={() => setActiveLead(l)} style={{ cursor: 'pointer' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                                    <div className="avatar-quantum">{l.name.charAt(0)}</div>
                                                    <div>
                                                        <div style={{ fontWeight: 950, fontSize: '1.05rem', color: '#fff' }}>{l.name}</div>
                                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '2px' }}>{l.email}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <div style={{ fontWeight: 800, fontSize: '0.9rem' }}>{l.course}</div>
                                                <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>Via {l.source}</div>
                                            </td>
                                            <td>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: l.assignedTo === 'Not Assigned' ? '#ef4444' : '#c084fc', fontWeight: 950, fontSize: '0.85rem' }}>
                                                    <UserCheck size={14} /> {l.assignedTo}
                                                </div>
                                            </td>
                                            <td>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                    <div style={{ width: '60px', height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px' }}>
                                                        <div style={{ width: `${l.score}%`, height: '100%', background: l.score === 100 ? '#10b981' : 'var(--primary)', borderRadius: '10px', boxShadow: `0 0 10px ${l.score === 100 ? '#10b981' : 'var(--primary)'}80` }} />
                                                    </div>
                                                    <div style={{ fontSize: '0.75rem', fontWeight: 900, color: 'var(--text-dim)' }}>{l.score}%</div>
                                                </div>
                                            </td>
                                            <td>
                                                <button className="btn-matrix" onClick={() => setActiveLead(l)}>ANALYZE</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                         </div>
                    </div>

                    {/* --- SIDEBAR: LEADERBOARD & ACTIVITY --- */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
                         <div className="elite-card" style={{ padding: '2.5rem', background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1), transparent)' }}>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: 950, marginBottom: '2.5rem', display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <Award color="var(--primary)" size={18} /> Top Performers (Oct)
                            </h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                                {counsellors.map((c, i) => (
                                    <div key={c.name} style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                        <div style={{ width: '35px', height: '35px', borderRadius: '50%', background: 'rgba(255,255,255,0.03)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 950, fontSize: '0.9rem', color: i === 0 ? '#fbbf24' : '#fff' }}>#{i+1}</div>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ fontWeight: 950, fontSize: '0.95rem' }}>{c.name}</div>
                                            <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', fontWeight: 800 }}>{c.active} Actively Tracking</div>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <div style={{ fontSize: '0.9rem', fontWeight: 950, color: '#10b981' }}>{c.rate}</div>
                                            <div style={{ fontSize: '0.65rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 900 }}>Converted</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                         </div>

                         <div className="elite-card" style={{ padding: '2.5rem' }}>
                             <h3 style={{ fontSize: '1.1rem', fontWeight: 950, marginBottom: '2.5rem', display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <Activity color="#3b82f6" size={18} /> Activity Radar
                            </h3>
                            <div style={{ height: '300px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1.5rem', scrollbarWidth: 'none' }}>
                                <TimelineItem text="Global leads bulk assigned" user="System Agent" time="2m ago" />
                                <TimelineItem text="Lead Ankita Ray converted" user="Siddharth M" time="15m ago" />
                                <TimelineItem text="Call completed for Deepak Rao" user="Anjali Sharma" time="1h ago" />
                                <TimelineItem text="32 leads imported from Instagram" user="Marketing Bot" time="2h ago" />
                            </div>
                         </div>
                    </div>
                </div>

                {/* --- LEAD DETAIL SLIDE DRAWER --- */}
                <AnimatePresence>
                    {activeLead && (
                        <>
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setActiveLead(null)} className="drawer-overlay" />
                            <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }} className="drawer-container">
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4rem' }}>
                                    <div style={{ fontSize: '0.75rem', fontWeight: 950, color: 'var(--primary)', letterSpacing: '2px' }}>LEAD INTELLIGENCE ENGINE v4.0</div>
                                    <button onClick={() => setActiveLead(null)} className="drawer-close-btn"><X size={20} /></button>
                                </div>

                                <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                                    <div className="avatar-giant">{activeLead.name.charAt(0)}</div>
                                    <h2 style={{ fontSize: '2rem', fontWeight: 950, color: '#fff', marginBottom: '5px' }}>{activeLead.name}</h2>
                                    <p style={{ color: 'var(--text-dim)', fontWeight: 800 }}>{activeLead.course} Candidate</p>
                                    
                                    <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', marginTop: '2.5rem' }}>
                                        <div className="drawer-quick-stat"><div className="stat-label">SCORE</div><div className="stat-val" style={{ color: activeLead.score === 100 ? '#10b981' : 'var(--primary)' }}>{activeLead.score}%</div></div>
                                        <div className="drawer-quick-stat"><div className="stat-label">SOURCE</div><div className="stat-val">{activeLead.source.toUpperCase()}</div></div>
                                        <div className="drawer-quick-stat"><div className="stat-label">STATUS</div><div className="stat-val">{activeLead.status}</div></div>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
                                    <div>
                                        <h3 className="section-title">CONTACT INFORMATION</h3>
                                        <div className="contact-row"><Phone size={18} /> {activeLead.phone}</div>
                                        <div className="contact-row"><Mail size={18} /> {activeLead.email}</div>
                                    </div>

                                    <div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                            <h3 className="section-title" style={{ margin: 0 }}>ACTIVITY LOG</h3>
                                            <button className="add-note-btn"><Plus size={14} /> ADD NOTE</button>
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                                            {activeLead.activity.map((a, i) => (
                                                <div key={i} style={{ display: 'flex', gap: '20px' }}>
                                                    <div style={{ minWidth: '80px', fontSize: '0.65rem', fontWeight: 950, color: 'var(--text-dim)', paddingTop: '4px' }}>{a.date}</div>
                                                    <div className="log-bubble">{a.text}</div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div style={{ display: 'flex', gap: '1rem', marginTop: 'auto', paddingTop: '3rem' }}>
                                        <button className="btn-elite-primary" style={{ flex: 1, padding: '18px' }}><UserPlus size={18} /> RE-ASSIGN AGENT</button>
                                        <button className="btn-elite-secondary" style={{ width: '60px', padding: 0 }}><Trash2 size={18} /></button>
                                    </div>
                                </div>
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>

                {/* --- BULK ACTION BAR --- */}
                <AnimatePresence>
                    {selectedLeads.length > 0 && !activeLead && (
                        <motion.div initial={{ y: 100 }} animate={{ y: 0 }} exit={{ y: 100 }} className="elite-bulk-bar">
                             <div style={{ display: 'flex', alignItems: 'center', gap: '30px' }}>
                                <div style={{ fontSize: '1rem', fontWeight: 950, color: '#fff' }}>{selectedLeads.length} ENTITIES SELECTED</div>
                                <div style={{ width: '2px', height: '30px', background: 'rgba(255,255,255,0.1)' }} />
                                <button className="bulk-btn"><UserPlus size={16} /> ASSIGN COUNSELLOR</button>
                                <button className="bulk-btn" style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' }}><Trash2 size={16} /> WIPE DATA</button>
                             </div>
                             <button onClick={() => setSelectedLeads([])} className="bulk-close-btn"><X size={18} /></button>
                        </motion.div>
                    )}
                </AnimatePresence>

            </div>

            {/* --- ELITE STYLES --- */}
            <style jsx>{`
                .elite-container { background: #000; border: 1px solid rgba(255,255,255,0.03); border-radius: 40px; overflow: hidden; box-shadow: 0 40px 100px rgba(0,0,0,0.5); }
                .elite-table { width: 100%; border-collapse: collapse; }
                .elite-table th { text-align: left; padding: 1.8rem 2.5rem; color: var(--text-dim); font-size: 0.7rem; font-weight: 950; letter-spacing: 2px; text-transform: uppercase; background: #050505; }
                .elite-table td { padding: 2.2rem 2.5rem; border-top: 1px solid rgba(255,255,255,0.03); transition: all 0.3s ease; }
                .row-selected { background: rgba(124, 58, 237, 0.05); }
                .elite-table tr:hover:not(.row-selected) { background: rgba(255,255,255,0.01); }
                
                .avatar-quantum { width: 45px; height: 45px; border-radius: 12px; background: linear-gradient(135deg, var(--primary), var(--secondary)); display: flex; alignItems: center; justifyContent: center; fontWeight: 950; color: #fff; font-size: 1.1rem; box-shadow: 0 10px 20px rgba(124, 58, 237, 0.3); }
                .btn-matrix { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.05); color: #fff; padding: 10px 20px; border-radius: 12px; font-size: 0.7rem; fontWeight: 950; letter-spacing: 1px; cursor: pointer; transition: all 0.3s ease; }
                .btn-matrix:hover { background: #fff; color: #000; transform: translateY(-3px); box-shadow: 0 15px 30px rgba(255,255,255,0.1); }
                
                .tab-btn { background: none; border: none; color: var(--text-dim); fontWeight: 950; fontSize: 0.9rem; padding: 10px 20px; cursor: pointer; transition: all 0.3s ease; position: relative; }
                .tab-btn.active { color: #fff; }
                .tab-btn.active::after { content: ''; position: absolute; bottom: 0; left: 20px; right: 20px; height: 3px; background: var(--primary); border-radius: 10px; box-shadow: 0 0 15px var(--primary); }
                
                .filter-wrapper { display: flex; alignItems: center; gap: 12px; background: #050505; border: 1px solid rgba(255,255,255,0.05); border-radius: 16px; padding: 0 1.5rem; width: 350px; }
                .filter-wrapper input { background: none; border: none; color: #fff; padding: 12px 0; outline: none; fontSize: 0.9rem; flex: 1; }
                
                .elite-card { background: #000; border: 1px solid rgba(255,255,255,0.03); border-radius: 35px; box-shadow: 0 20px 50px rgba(0,0,0,0.3); }
                .chk-btn { background: none; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; width: 100%; height: 100%; }

                .drawer-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.85); backdrop-filter: blur(25px); z-index: 10000; cursor: pointer; }
                .drawer-container { position: fixed; top: 20px; right: 20px; bottom: 20px; width: 680px; background: #000; border: 1px solid rgba(255,255,255,0.1); border-radius: 40px; padding: 4rem; z-index: 10001; overflow-y: auto; scrollbar-width: none; box-shadow: -50px 0 150px rgba(0,0,0,0.9); }
                .drawer-close-btn { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.05); color: #fff; padding: 12px; borderRadius: 50%; cursor: pointer; }
                .avatar-giant { width: 110px; height: 110px; border-radius: 40px; background: linear-gradient(135deg, var(--primary), var(--secondary)); display: flex; align-items: center; justify-content: center; font-size: 3.5rem; fontWeight: 950; color: #fff; margin: 0 auto 2.5rem; box-shadow: 0 30px 60px rgba(124, 58, 237, 0.4); border: 4px solid rgba(255,255,255,0.1); }
                .drawer-quick-stat { flex: 1; padding: 20px; background: rgba(255,255,255,0.015); border: 1px solid rgba(255,255,255,0.03); border-radius: 20px; }
                .stat-label { fontSize: 0.65rem; fontWeight: 950; color: var(--text-dim); marginBottom: 8px; letterSpacing: 1px; }
                .stat-val { fontSize: 1.1rem; fontWeight: 950; color: #fff; }
                .section-title { fontSize: 0.75rem; fontWeight: 950; color: var(--primary); letterSpacing: 2px; border-bottom: 2px solid rgba(139, 92, 246, 0.1); padding-bottom: 15px; margin-bottom: 2.5rem; text-transform: uppercase; }
                .contact-row { display: flex; align-items: center; gap: 15px; font-size: 1.1rem; fontWeight: 900; color: #fff; margin-bottom: 1.5rem; }
                .log-bubble { background: rgba(255,255,255,0.02); padding: 15px 22px; border-radius: 0 20px 20px 20px; font-size: 0.9rem; color: #fff; border: 1px solid rgba(255,255,255,0.03); flex: 1; }
                .add-note-btn { background: rgba(139, 92, 246, 0.1); border: 1px solid rgba(139, 92, 246, 0.2); color: var(--primary); padding: 6px 12px; border-radius: 8px; font-size: 0.7rem; fontWeight: 950; cursor: pointer; }

                .elite-bulk-bar { position: fixed; bottom: 30px; left: 50%; transform: translateX(-50%); background: #000; border: 1px solid var(--primary); padding: 1.2rem 3rem; border-radius: 100px; display: flex; alignItems: center; gap: 50px; z-index: 1000; box-shadow: 0 40px 80px rgba(0,0,0,0.8), 0 0 30px rgba(139, 92, 246, 0.2); }
                .bulk-btn { background: none; border: none; color: #fff; font-size: 0.85rem; fontWeight: 950; display: flex; align-items: center; gap: 10px; cursor: pointer; padding: 12px 20px; border-radius: 100px; transition: all 0.3s ease; }
                .bulk-btn:hover { background: rgba(255,255,255,0.05); }
                .bulk-close-btn { background: rgba(255,255,255,0.05); border: none; color: #fff; width: 35px; height: 35px; border-radius: 50%; cursor: pointer; }

                .btn-elite-primary { background: var(--primary); color: #fff; border: none; padding: 14px 28px; border-radius: 14px; fontWeight: 950; fontSize: 0.9rem; display: flex; alignItems: center; gap: 10px; cursor: pointer; box-shadow: 0 15px 30px rgba(124, 58, 237, 0.4); text-transform: uppercase; letter-spacing: 1px; }
                .btn-elite-secondary { background: rgba(255,255,255,0.02); color: #fff; border: 1px solid rgba(255,255,255,0.05); padding: 14px 28px; border-radius: 14px; fontWeight: 950; fontSize: 0.9rem; display: flex; alignItems: center; gap: 10px; cursor: pointer; }
            `}</style>
        </DashboardLayout>
    );
}

function AnalyticsCard({ title, value, trend, icon, color }: any) {
    return (
        <div className="elite-card" style={{ padding: '2.5rem', position: 'relative' }}>
             <div style={{ position: 'absolute', top: '2.5rem', right: '2.5rem', color: color, opacity: 0.8 }}>{icon}</div>
             <div style={{ fontSize: '0.7rem', fontWeight: 950, color: 'var(--text-dim)', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '15px' }}>{title}</div>
             <div style={{ fontSize: '2.8rem', fontWeight: 950, color: '#fff', marginBottom: '15px', letterSpacing: '-1.5px' }}>{value}</div>
             <div style={{ fontSize: '0.75rem', fontWeight: 950, color: color, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <TrendingUp size={14} /> {trend}
             </div>
        </div>
    );
}

function TimelineItem({ text, user, time }: any) {
    return (
        <div style={{ display: 'flex', gap: '15px' }}>
            <div style={{ minWidth: '45px', fontSize: '0.6rem', fontWeight: 950, color: 'var(--text-dim)', paddingTop: '4px' }}>{time}</div>
            <div style={{ position: 'relative', flex: 1 }}>
                <div style={{ position: 'absolute', left: '-13px', top: '8px', bottom: '-25px', width: '2px', background: 'rgba(255,255,255,0.03)' }} />
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--primary)', position: 'absolute', left: '-16px', top: '6px', border: '2px solid #000' }} />
                <div style={{ fontSize: '0.9rem', fontWeight: 900, color: '#eee', marginBottom: '4px' }}>{text}</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', fontWeight: 800 }}>Action by {user}</div>
            </div>
        </div>
    );
}
