"use client";

import { useState } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Code2,
    Play,
    Save,
    Share2,
    Settings,
    History,
    Trophy,
    Terminal,
    ChevronDown,
    Zap,
    CheckCircle2,
    XCircle,
    Copy,
    Cpu,
    BookOpen,
    Rocket
} from 'lucide-react';

const CHALLENGES = [
    { id: "P01", title: "Invert a Binary Tree", difficulty: "Medium", completed: true, points: 50 },
    { id: "P02", title: "Two Sum Problem", difficulty: "Easy", completed: true, points: 20 },
    { id: "P03", title: "Merge K Sorted Lists", difficulty: "Hard", completed: false, points: 100 },
];

const LEADERBOARD = [
    { rank: 1, name: "Arjun K.", points: 2450, badge: "Grandmaster" },
    { rank: 2, name: "Sneha R.", points: 2120, badge: "Master" },
    { rank: 3, name: "Jagadesh S.", points: 1980, badge: "Expert" },
];

export default function OnlineCompilerPage() {
    const [language, setLanguage] = useState('java');
    const [code, setCode] = useState(`public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, Bytecode!");\n    }\n}`);
    const [output, setOutput] = useState('');
    const [isRunning, setIsRunning] = useState(false);

    const handleRun = () => {
        setIsRunning(true);
        setTimeout(() => {
            setOutput('> Java execution started...\n> Hello, Bytecode!\n\nExecution finished in 0.4s.');
            setIsRunning(false);
        }, 800);
    };

    return (
        <DashboardLayout role="student">
            <div className="flex flex-col h-[calc(100vh-120px)] gap-6 pb-6 overflow-hidden">
                {/* Header Control Bar */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-[#0a0a1a]/60 border border-white/5 rounded-2xl p-4 backdrop-blur-xl">
                    <div className="flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-amber-500/10 text-amber-500 shadow-lg shadow-amber-500/10">
                            <Code2 size={24} />
                        </div>
                        <div>
                            <h1 className="text-xl font-black text-white uppercase tracking-tight">Cloud Compiler <span className="text-amber-500">v2.0</span></h1>
                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Isolated Runtime Environment</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex bg-[#050510] border border-white/10 rounded-xl p-1">
                            {['java', 'python', 'cpp', 'javascript'].map(lang => (
                                <button
                                    key={lang}
                                    onClick={() => setLanguage(lang)}
                                    className={`px-4 py-2 rounded-lg text-[10px] font-black transition-all uppercase tracking-widest ${language === lang ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20' : 'text-slate-500 hover:text-white'}`}
                                >
                                    {lang}
                                </button>
                            ))}
                        </div>
                        <div className="h-8 w-[1px] bg-white/10 mx-2" />
                        <button onClick={handleRun} disabled={isRunning} className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs rounded-xl shadow-lg shadow-emerald-500/20 flex items-center gap-2 transition-all uppercase tracking-widest disabled:opacity-50">
                            {isRunning ? <Cpu className="animate-spin" size={18} /> : <Play size={18} />}
                            {isRunning ? 'EXECUTING' : 'RUN CODE'}
                        </button>
                    </div>
                </div>

                <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-6 overflow-hidden">
                    {/* Left Sidebar - Challenges */}
                    <div className="lg:col-span-1 flex flex-col gap-6 overflow-y-auto custom-scrollbar">
                        <div className="bg-[#0a0a1a]/60 border border-white/5 rounded-3xl p-6 backdrop-blur-xl">
                            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-6 px-2 flex items-center justify-between">
                                Practice Problems
                                <BookOpen size={14} />
                            </h3>
                            <div className="space-y-3">
                                {CHALLENGES.map((prob) => (
                                    <button key={prob.id} className="w-full text-left p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-amber-500/40 transition-all group">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className={`text-[9px] font-black px-2 py-0.5 rounded-full ${prob.difficulty === 'Easy' ? 'bg-emerald-500/10 text-emerald-500' :
                                                    prob.difficulty === 'Medium' ? 'bg-amber-500/10 text-amber-500' : 'bg-red-500/10 text-red-500'
                                                } uppercase tracking-widest`}>{prob.difficulty}</span>
                                            {prob.completed && <CheckCircle2 className="text-emerald-500" size={14} />}
                                        </div>
                                        <div className="text-xs font-bold text-white group-hover:text-amber-400 transition-colors uppercase tracking-tight underline-offset-4 decoration-white/20">{prob.title}</div>
                                        <div className="text-[9px] text-slate-500 font-bold uppercase mt-2">{prob.points} Mastery Points</div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Leaderboard */}
                        <div className="bg-[#0a0a1a]/40 border border-white/5 rounded-3xl p-6">
                            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-6 px-2 flex items-center justify-between">
                                Global Rankings
                                <Trophy size={14} className="text-amber-500" />
                            </h3>
                            <div className="space-y-4">
                                {LEADERBOARD.map((user) => (
                                    <div key={user.rank} className="flex items-center gap-4 p-2">
                                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-xs ${user.rank === 1 ? 'bg-amber-500 text-black' : 'bg-white/5 text-slate-400'}`}>
                                            {user.rank}
                                        </div>
                                        <div className="flex-1">
                                            <div className="text-[11px] font-bold text-white uppercase tracking-tight">{user.name}</div>
                                            <div className="text-[9px] text-slate-500 font-bold uppercase">{user.badge}</div>
                                        </div>
                                        <div className="text-xs font-black text-amber-500">{user.points}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Editor & Console */}
                    <div className="lg:col-span-3 flex flex-col gap-6 overflow-hidden">
                        {/* IDE Container */}
                        <div className="flex-1 bg-[#050510] border border-white/5 rounded-[2.5rem] relative overflow-hidden flex flex-col group shadow-2xl">
                            {/* Editor Toolbar */}
                            <div className="p-4 bg-white/[0.03] border-bottom border-white/5 flex justify-between items-center backdrop-blur-md relative z-10">
                                <div className="flex items-center gap-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                                    <Terminal size={14} />
                                    MAIN.{language.toUpperCase()}
                                </div>
                                <div className="flex gap-2">
                                    <button className="p-2.5 rounded-xl bg-white/5 text-slate-400 hover:text-white transition-all"><Copy size={16} /></button>
                                    <button className="p-2.5 rounded-xl bg-white/5 text-slate-400 hover:text-white transition-all"><Share2 size={16} /></button>
                                    <button className="p-2.5 rounded-xl bg-white/5 text-slate-400 hover:text-white transition-all"><Save size={16} /></button>
                                </div>
                            </div>

                            {/* Text Area (Mock Code Editor) */}
                            <div className="flex-1 relative font-mono text-sm leading-relaxed p-8 overflow-hidden">
                                <div className="absolute top-0 left-0 w-12 h-full bg-[#0a0a1a] border-r border-white/5 flex flex-col items-center py-8 text-xs text-slate-700 select-none">
                                    {Array.from({ length: 20 }).map((_, i) => <div key={i} className="mb-px">{i + 1}</div>)}
                                </div>
                                <textarea
                                    value={code}
                                    onChange={(e) => setCode(e.target.value)}
                                    className="w-full h-full bg-transparent border-none outline-none resize-none text-gray-300 pl-10 custom-scrollbar-thin selection:bg-amber-500/30"
                                    spellCheck={false}
                                />
                            </div>

                            {/* Decorative Elements */}
                            <div className="absolute bottom-0 right-0 w-64 h-64 bg-amber-500/5 blur-[100px] pointer-events-none" />
                        </div>

                        {/* Console / Console Output */}
                        <div className="h-48 bg-[#0a0a1a] border border-white/5 rounded-[2rem] p-6 relative overflow-hidden flex flex-col">
                            <div className="flex items-center gap-2 mb-4 text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-white/5 pb-2">
                                <Zap size={14} className="text-amber-500" />
                                Execution Console
                            </div>
                            <div className="flex-1 overflow-y-auto custom-scrollbar font-mono text-xs leading-relaxed text-slate-400">
                                <pre className="whitespace-pre-wrap">{output || '> Waiting for code execution...'}</pre>
                            </div>
                            <div className="absolute top-4 right-6 flex items-center gap-4">
                                <div className="flex items-center gap-1.5 px-2 py-1 bg-emerald-500/10 rounded-lg text-emerald-500 text-[9px] font-black tracking-widest">
                                    <CheckCircle2 size={10} /> PASSED
                                </div>
                                <button onClick={() => setOutput('')} className="text-[9px] font-black text-slate-600 hover:text-white transition-colors uppercase tracking-[0.2em]">CLEAR</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
