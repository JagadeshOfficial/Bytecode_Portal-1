"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams } from 'next/navigation';
import { 
    Gamepad2, TrendingUp, Trophy, Zap, Target, Users, Code, Brain,
    Calculator, Palette, Flame, ShoppingBag, BarChart3, Trash2, Edit3,
    Calendar, Play, ChevronRight, Star, Heart, RefreshCcw, Layers, Users2,
    Lock, CheckCircle, Clock, AlertCircle, Info, Download, Award, Coins,
    Plus, Shield, Activity, Globe, Settings, Eye, Database, Key, Gavel,
    FileSignature, UserPlus, ShieldAlert, Library, Settings2, Gift, FileBarChart, UserCog, Rocket
} from 'lucide-react';

// --- STYLING (REDUCED SIZE/COMPACT) ---
const glassStyle = {
    background: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(30px)',
    border: '1px solid rgba(0, 0, 0, 0.05)',
    borderRadius: '20px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.05)'
};

const cardStyle = {
    background: '#fff',
    padding: '1rem',
    borderRadius: '20px',
    border: '1px solid rgba(0,0,0,0.03)'
};

const gradientText = (c1 = '#6366f1', c2 = '#a855f7') => ({
    background: `linear-gradient(135deg, ${c1} 0%, ${c2} 100%)`,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    fontWeight: 1000
});

// --- MASTER COMPONENT ---
export default function GamesDashboard() {
    const [role, setRole] = useState<string>('STUDENT');
    const [activeSection, setActiveSection] = useState('DASHBOARD');
    const [points, setPoints] = useState(12850);
    const [coins, setCoins] = useState(420);
    const [streak, setStreak] = useState(12);
    const [isMounted, setIsMounted] = useState(false);
    
    // Live State
    const [games, setGames] = useState<any[]>([]);
    const [courses, setCourses] = useState<any[]>([]);
    const [batches, setBatches] = useState<any[]>([]);
    const [stats, setStats] = useState<any>({});
    const [leaderboard, setLeaderboard] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    const searchParams = useSearchParams();
    const tabParam = searchParams.get('tab');

    const fetchData = async () => {
        setLoading(true);
        try {
            const apiCall = async (url: string) => {
                const res = await fetch(url);
                const contentType = res.headers.get("content-type");
                if (!res.ok || !contentType || !contentType.includes("application/json")) {
                    const text = await res.text();
                    throw new Error(`Invalid Response: ${res.status} from ${url}. Received: ${text.substring(0, 50)}...`);
                }
                return res.json();
            };

            // Check and Seed
            const initialCourses = await apiCall('http://localhost:8085/api/courses');
            if (initialCourses.length === 0) {
                console.log("Empty DB - Auto-Seeding...");
                await fetch('http://localhost:8085/api/admin/setup-data');
            }

            const [g, c, b, s, l] = await Promise.all([
                apiCall('http://localhost:8085/api/games'),
                apiCall('http://localhost:8085/api/courses'),
                apiCall('http://localhost:8085/api/batches'),
                apiCall('http://localhost:8085/api/admin/system-stats'),
                apiCall('http://localhost:8085/api/leaderboard/global')
            ]);
            
            setGames(g); setCourses(c); setBatches(b); setStats(s); setLeaderboard(l);
        } catch (e: any) { 
            console.error("Master Sync Failure:", e.message); 
            // Only use fallback if really needed
            if (courses.length === 0) {
                setGames([{ _id: '1', title: 'React Sprint', category: 'CODING', course: 'Demo', batch: 'B1', active: true }]);
                setCourses([{ _id: '1', name: 'Demo Course' }]);
                setBatches([{ _id: '1', name: 'Demo Batch' }]);
            }
        }
        setLoading(false);
    };

    useEffect(() => {
        setIsMounted(true);
        const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
        setRole((storedUser.role || 'student').toUpperCase());
        if (tabParam) setActiveSection(tabParam);
        fetchData();
    }, [tabParam]);

    if (!isMounted) return null;

    return (
        <div style={{ minHeight: '100%', padding: '1.25rem', background: '#f8fafc', fontFamily: 'var(--font-outfit), sans-serif' }}>
            {/* HUD HEADER */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <div style={{ width: 50, height: 50, borderRadius: '15px', background: 'linear-gradient(135deg, #6366f1, #a855f7)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Rocket size={24} color="#fff" />
                    </div>
                    <div>
                        <h1 style={{ fontSize: '1.5rem', ...gradientText() }}>Intelligence Arena V6</h1>
                        <p style={{ fontSize: '0.65rem', fontWeight: 900, color: '#94a3b8' }}>PLATFORM SOVEREIGNTY ACTIVE</p>
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <StatBadge label="XP" val={points.toLocaleString()} color="#f59e0b" />
                    <StatBadge label="COINS" val={coins} color="#3b82f6" />
                    <button onClick={fetchData} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                        <RefreshCcw size={18} className={loading ? 'animate-spin' : ''} />
                    </button>
                </div>
            </div>

            <AnimatePresence mode="wait">
                <motion.div key={activeSection} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
                    {activeSection === 'DASHBOARD' && <DashboardModule stats={stats} />}
                    {activeSection === 'GAME_MGMT' && <GameMgmtModule games={games} courses={courses} batches={batches} refresh={fetchData} />}
                    {activeSection === 'TOURNAMENT' && <TournamentModule stats={stats} />}
                    {activeSection === 'LEADERBOARD_MGMT' && <LeaderboardModule leaderboard={leaderboard} />}
                    {activeSection === 'REWARDS_ECONOMY' && <RewardsModule />}
                    {activeSection === 'ANALYTICS' && <AnalyticsModule stats={stats} />}
                    {activeSection === 'USER_MGMT' && <UserMgmtModule />}
                    {activeSection === 'SETTINGS_CORE' && <SettingsModule />}
                </motion.div>
            </AnimatePresence>
        </div>
    );
}

// 👨💼 [1] DASHBOARD - FULL SYSTEM OVERVIEW
function DashboardModule({ stats }: any) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '1rem' }}>
                <AdminStatCard label="Total Games" val={stats.total_games} icon={<Gamepad2 size={20}/>} color="#6366f1" />
                <AdminStatCard label="Live Users" val="12,402" icon={<Users size={20}/>} color="#10b981" />
                <AdminStatCard label="Game Plays" val={stats.total_submissions} icon={<Activity size={20}/>} color="#f59e0b" />
                <AdminStatCard label="LMS Courses" val={stats.total_courses} icon={<Layers size={20}/>} color="#8b5cf6" />
                <AdminStatCard label="Active Batches" val={stats.total_batches} icon={<Users2 size={20}/>} color="#ec4899" />
            </div>
            <div style={{ ...glassStyle, padding: '1.5rem' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 1000, marginBottom: '1rem' }}>Sovereign Pulse Overview</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <ActivityRow user="Rahul (B40)" action="Completed Code Puzzle" time="Just now" />
                    <ActivityRow user="System" action="AI Difficulty Scaled to PRO" time="2m ago" />
                </div>
            </div>
        </div>
    );
}

// 👨💼 [2] GAME MANAGEMENT - DYNAMIC FROM DB
function GameMgmtModule({ games, courses, batches, refresh }: any) {
    const [isAdding, setIsAdding] = useState(false);
    const [form, setForm] = useState({ title: '', category: 'CODING', difficulty: 'MED', course: '', batch: '' });

    const createGame = async (e: any) => {
        e.preventDefault();
        const res = await fetch('http://localhost:8080/api/admin/games/create', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(form)
        });
        if (res.ok) { setIsAdding(false); refresh(); }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
                <div onClick={() => setIsAdding(true)} style={{ ...cardStyle, textAlign: 'center', cursor: 'pointer', border: '2px dashed #10b981' }}>
                    <Plus size={24} color="#10b981" />
                    <p style={{ fontSize: '0.8rem', fontWeight: 900, marginTop: '5px' }}>CREATE GAME</p>
                </div>
                <FeatureCard label="Game Library" count={games.length} icon={<Library size={20}/>} color="#6366f1" />
                <FeatureCard label="LMS Courses" count={courses.length} icon={<Layers size={20}/>} color="#8b5cf6" />
                <FeatureCard label="Active Batches" count={batches.length} icon={<Users2 size={20}/>} color="#f59e0b" />
            </div>

            {isAdding && (
                <motion.form onSubmit={createGame} initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ ...glassStyle, padding: '1.5rem', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '15px' }}>
                    <input required placeholder="Game Title" value={form.title} onChange={e=>setForm({...form, title: e.target.value})} style={{ padding: '10px', borderRadius: '10px', border: '1px solid #ddd' }} />
                    <select value={form.category} onChange={e=>setForm({...form, category: e.target.value})} style={{ padding: '10px', borderRadius: '10px' }}>
                        <option>CODING</option><option>MATH</option><option>BRAIN</option>
                    </select>
                    <select required value={form.course} onChange={e=>setForm({...form, course: e.target.value})} style={{ padding: '10px', borderRadius: '10px' }}>
                        <option value="">Select Course</option>
                        {courses.map((c: any) => <option key={c._id}>{c.name}</option>)}
                    </select>
                    <select required value={form.batch} onChange={e=>setForm({...form, batch: e.target.value})} style={{ padding: '10px', borderRadius: '10px' }}>
                        <option value="">Select Batch</option>
                        {batches.map((b: any) => <option key={b._id}>{b.name}</option>)}
                    </select>
                    <div style={{ gridColumn: 'span 2', display: 'flex', gap: '10px' }}>
                        <button type="submit" style={{ flex: 1, padding: '12px', background: '#10b981', color: '#fff', borderRadius: '10px', border: 'none', fontWeight: 900 }}>ORCHESTRATE MODULE</button>
                        <button onClick={()=>setIsAdding(false)} style={{ flex: 1, padding: '12px', background: '#eee', borderRadius: '10px', border: 'none' }}>CANCEL</button>
                    </div>
                </motion.form>
            )}

            <div style={{ ...glassStyle, padding: '1.5rem' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 1000, marginBottom: '1rem' }}>Active Module Registry</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {games.map((g: any) => (
                        <div key={g._id} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 20px', background: '#fff', borderRadius: '15px', border: '1px solid #f1f5f9', alignItems: 'center' }}>
                            <div>
                                <span style={{ fontWeight: 900, fontSize: '0.85rem' }}>{g.title}</span>
                                <p style={{ fontSize: '0.65rem', color: '#94a3b8' }}>{g.course} • Batch {g.batch}</p>
                            </div>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <Badge label={g.category} />
                                <Trash2 size={16} color="#ef4444" cursor="pointer" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

// 👨💼 [3] TOURNAMENT CONTROL
function TournamentModule({ stats }: any) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                <FeatureCard label="Live Matches" count={stats.live_tournaments} icon={<Trophy size={20}/>} color="#9333ea" />
                <FeatureCard label="Participants" count="1,240" icon={<Users size={20}/>} color="#6366f1" />
                <FeatureCard label="Prize Pool" val="₹12.5L" icon={<Coins size={20}/>} color="#f59e0b" />
            </div>
            <div style={{ ...glassStyle, padding: '1.5rem' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 1000, marginBottom: '1rem' }}>Active Tournament Control</h3>
                <TournamentRow name="Bytecode Open 2026" status="LIVE" />
                <TournamentRow name="SQL Rumble" status="UPCOMING" />
            </div>
        </div>
    );
}

// 👨💼 [4] LEADERBOARD CONTROL
function LeaderboardModule({ leaderboard }: any) {
    return (
        <div style={{ ...glassStyle, padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 1000, marginBottom: '1rem' }}>Global Unified Rankings</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {leaderboard.map((l: any, i: number) => (
                    <div key={l._id} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 20px', background: '#fff', borderRadius: '15px' }}>
                        <span style={{ fontWeight: 1000 }}>#{i+1} User_{l._id.substring(0,4)}</span>
                        <span style={{ fontWeight: 900, color: '#f59e0b' }}>{l.totalScore} XP</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

// 👨💼 [5] REWARDS & MONETIZATION
function RewardsModule() {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
                <ActionCardItem label="Badge Creator" icon={<Zap/>} />
                <ActionCardItem label="Coin Config" icon={<Coins/>} />
                <ActionCardItem label="Bounty Store" icon={<ShoppingBag/>} />
                <ActionCardItem label="Cert Generator" icon={<FileSignature/>} />
            </div>
            <div style={{ ...glassStyle, padding: '1.5rem' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 1000, marginBottom: '1rem' }}>Active Reward Inventory</h3>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <Badge label="SQL Master" /> <Badge label="DevOps Elite" />
                </div>
            </div>
        </div>
    );
}

// 👨💼 [6] ANALYTICS & REPORTS
function AnalyticsModule({ stats }: any) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                <AdminStatCard label="Accuracy" val="72%" icon={<Target size={20}/>} color="#ec4899" />
                <AdminStatCard label="Cheating Rate" val="1.2%" icon={<ShieldAlert size={20}/>} color="#ef4444" />
                <AdminStatCard label="Engagement" val="94%" icon={<TrendingUp size={20}/>} color="#10b981" />
            </div>
            <button style={{ padding: '12px', background: '#0f172a', color: '#fff', borderRadius: '10px', border: 'none', fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                <Download size={18}/> EXPORT SOVEREIGN AUDIT REPORT
            </button>
        </div>
    );
}

// 👨💼 [7] USER MANAGEMENT
function UserMgmtModule() {
    return (
        <div style={{ ...glassStyle, padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 1000, marginBottom: '1rem' }}>Platform Authority Grid</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <UserRowDetail name="Koushik Admin" role="SUPER ADMIN" />
                <UserRowDetail name="Rahul Trainer" role="TRAINER" />
                <UserRowDetail name="Priya Student" role="STUDENT" />
            </div>
        </div>
    );
}

// 👨💼 [8] SYSTEM SETTINGS
function SettingsModule() {
    return (
        <div style={{ ...glassStyle, padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 1000, marginBottom: '1.5rem' }}>Core Intelligence Config</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '2rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ fontWeight: 800 }}>AI Proctoring</span> <span style={{ color: '#ef4444' }}>95% Risk</span></div>
                    <div style={{ height: 6, background: '#eee', borderRadius: '10px' }}><div style={{ width: '95%', height: '100%', background: '#ef4444' }} /></div>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <ToggleOption label="Auto-Ban" active />
                    <ToggleOption label="Tab Guard" active />
                </div>
            </div>
        </div>
    );
}

// --- UI ATOMS ---

function StatBadge({ label, val, color }: any) {
    return (
        <div style={{ padding: '8px 18px', borderRadius: '12px', background: '#fff', border: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '0.6rem', fontWeight: 900, color: '#94a3b8' }}>{label}</span>
            <span style={{ fontWeight: 1000, color }}>{val}</span>
        </div>
    );
}

function AdminStatCard({ label, val, icon, color }: any) {
    return (
        <div style={{ ...cardStyle }}>
            <div style={{ color, marginBottom: '8px', display: 'flex', justifyContent: 'center' }}>{icon}</div>
            <p style={{ fontSize: '0.55rem', fontWeight: 900, color: '#94a3b8', textAlign: 'center' }}>{label}</p>
            <h4 style={{ fontSize: '1.1rem', fontWeight: 1000, textAlign: 'center' }}>{val || 0}</h4>
        </div>
    );
}

function FeatureCard({ label, count, val, icon, color }: any) {
    return (
        <div style={{ ...cardStyle, textAlign: 'center' }}>
            <div style={{ color, marginBottom: '8px', display: 'flex', justifyContent: 'center' }}>{icon}</div>
            <p style={{ fontSize: '0.55rem', fontWeight: 900, color: '#94a3b8' }}>{label}</p>
            <h4 style={{ fontSize: '1rem', fontWeight: 1000 }}>{val || count}</h4>
        </div>
    );
}

function ActivityRow({ user, action, time }: any) {
    return (
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 15px', background: '#fff', borderRadius: '12px', border: '1px solid #f1f5f9' }}>
            <div><span style={{ fontWeight: 900, fontSize: '0.8rem' }}>{user}</span> <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{action}</span></div>
            <span style={{ fontSize: '0.65rem', color: '#94a3b8' }}>{time}</span>
        </div>
    );
}

function Badge({ label }: any) {
    return <span style={{ padding: '3px 12px', borderRadius: '100px', background: '#6366f111', color: '#6366f1', fontSize: '0.65rem', fontWeight: 900 }}>{label}</span>;
}

function TournamentRow({ name, status }: any) {
    return (
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 15px', background: '#fff', borderRadius: '12px', marginBottom: '8px' }}>
            <span style={{ fontWeight: 900, fontSize: '0.8rem' }}>{name}</span>
            <span style={{ color: status === 'LIVE' ? '#10b981' : '#a855f7', fontWeight: 1000, fontSize: '0.7rem' }}>{status}</span>
        </div>
    );
}

function ActionCardItem({ label, icon }: any) {
    return (
        <div style={{ ...cardStyle, textAlign: 'center', cursor: 'pointer' }}>
            <div style={{ color: '#6366f1', marginBottom: '8px', display: 'flex', justifyContent: 'center' }}>{icon}</div>
            <p style={{ fontSize: '0.7rem', fontWeight: 900 }}>{label}</p>
        </div>
    );
}

function UserRowDetail({ name, role }: any) {
    return (
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 15px', background: '#fff', borderRadius: '12px' }}>
            <span style={{ fontWeight: 900 }}>{name}</span>
            <span style={{ background: '#eee', padding: '2px 10px', borderRadius: '100px', fontSize: '0.6rem', fontWeight: 900 }}>{role}</span>
        </div>
    );
}

function ToggleOption({ label, active }: any) {
    return (
        <div style={{ flex: 1, padding: '10px', borderRadius: '12px', background: active ? '#10b98111' : '#eee', color: active ? '#10b981' : '#666', textAlign: 'center', fontWeight: 900, fontSize: '0.7rem' }}>{label}</div>
    );
}
