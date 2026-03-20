"use client";

import { useState } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { motion } from 'framer-motion';
import {
    Play,
    RotateCcw,
    Download,
    Settings,
    Code2,
    Terminal,
    Cpu,
    Zap,
    History,
    FileCode,
    ChevronDown,
    Save
} from 'lucide-react';

export default function OnlineCompiler() {
    const [code, setCode] = useState(`// Welcome to Bytecode Online Compiler
// Write your code here...

function solution(arr) {
    console.log("Processing array:", arr);
    return arr.map(x => x * 2);
}

const result = solution([1, 2, 3, 4, 5]);
console.log("Result:", result);`);

    const [output, setOutput] = useState([
        { type: 'system', text: 'Initializing Bytecode Environment...' },
        { type: 'system', text: 'Loaded Node.js v20.x' },
        { type: 'system', text: 'Ready for execution.' },
    ]);

    const runCode = () => {
        setOutput(prev => [...prev, { type: 'command', text: 'node index.js' }]);
        setTimeout(() => {
            setOutput(prev => [...prev,
            { type: 'log', text: 'Processing array: [1, 2, 3, 4, 5]' },
            { type: 'log', text: 'Result: [2, 4, 6, 8, 10]' },
            { type: 'success', text: 'Process exited with code 0' }
            ]);
        }, 800);
    };

    return (
        <DashboardLayout role="student">
            <div className="flex flex-col h-[calc(100vh-140px)] gap-6">
                {/* Compiler Toolbar */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 bg-[rgba(19,10,48,0.5)] border border-[rgba(124,58,237,0.2)] rounded-2xl backdrop-blur-md gap-4">
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#7c3aed] to-[#22d3ee] flex items-center justify-center shadow-[0_0_15px_rgba(124,58,237,0.4)]">
                                <Code2 className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold font-[Rajdhani] text-white leading-tight">Code Nexus</h1>
                                <p className="text-[10px] text-[var(--accent)] font-bold tracking-widest uppercase">System: Online Pro</p>
                            </div>
                        </div>

                        <div className="h-8 w-[1px] bg-[rgba(255,255,255,0.1)] hidden md:block" />

                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2 bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.05)] px-3 py-1.5 rounded-lg cursor-pointer hover:border-[#7c3aed] transition-all">
                                <span className="text-xs text-white font-bold">JavaScript</span>
                                <ChevronDown className="w-3 h-3 text-[var(--text-dim)]" />
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <button
                            onClick={() => setCode('')}
                            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.05)] rounded-lg text-sm text-white hover:bg-[rgba(255,255,255,0.08)] transition-all"
                        >
                            <RotateCcw className="w-4 h-4" />
                            Reset
                        </button>
                        <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.05)] rounded-lg text-sm text-white hover:bg-[rgba(255,255,255,0.08)] transition-all">
                            <Save className="w-4 h-4" />
                            Save
                        </button>
                        <button
                            onClick={runCode}
                            className="flex-[2] md:flex-none flex items-center justify-center gap-2 px-8 py-2 bg-gradient-to-r from-[#7c3aed] to-[#d946ef] rounded-lg text-sm text-white font-bold shadow-[0_0_20px_rgba(124,58,237,0.4)] hover:scale-105 transition-all"
                        >
                            <Play className="w-4 h-4 fill-current" />
                            Run Code
                        </button>
                    </div>
                </div>

                {/* Main Coding Area */}
                <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-6 overflow-hidden">
                    {/* File Explorer (Desktop) */}
                    <div className="hidden lg:flex flex-col bg-[rgba(19,10,48,0.3)] border border-[rgba(255,255,255,0.05)] rounded-2xl overflow-hidden">
                        <div className="p-4 border-bottom border-[rgba(255,255,255,0.05)]">
                            <span className="text-xs font-bold text-[var(--text-dim)] uppercase tracking-widest">Files</span>
                        </div>
                        <div className="flex-1 p-2 space-y-1">
                            {[
                                { name: 'index.js', icon: <FileCode className="w-4 h-4 text-amber-400" />, active: true },
                                { name: 'logic.js', icon: <FileCode className="w-4 h-4 text-blue-400" /> },
                                { name: 'data.json', icon: <ChevronDown className="w-4 h-4 text-purple-400" /> },
                            ].map((file, idx) => (
                                <div key={idx} className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-all ${file.active ? 'bg-[rgba(124,58,237,0.1)] text-[#22d3ee]' : 'text-[var(--text-dim)] hover:bg-[rgba(255,255,255,0.02)]'}`}>
                                    {file.icon}
                                    <span className="text-sm font-medium">{file.name}</span>
                                </div>
                            ))}
                        </div>
                        <div className="p-4 mt-auto border-t border-[rgba(255,255,255,0.05)] bg-[rgba(255,255,255,0.02)]">
                            <div className="flex items-center gap-2 text-[10px] text-emerald-400 font-bold uppercase tracking-widest">
                                <Zap className="w-3 h-3 fill-current" />
                                Premium Mode Active
                            </div>
                        </div>
                    </div>

                    {/* Editor & Console */}
                    <div className="lg:col-span-3 flex flex-col gap-6 overflow-hidden">
                        {/* Editor */}
                        <div className="flex-1 bg-[#05011a] border border-[rgba(124,58,237,0.2)] rounded-2xl relative overflow-hidden group shadow-2xl">
                            <div className="absolute left-0 top-0 w-12 h-full bg-[rgba(124,58,237,0.05)] border-r border-[rgba(124,58,237,0.1)] flex flex-col items-center py-4 text-[10px] text-[rgba(255,255,255,0.2)] font-mono">
                                {Array.from({ length: 20 }).map((_, i) => (
                                    <div key={i} className="h-6 flex items-center">{i + 1}</div>
                                ))}
                            </div>
                            <textarea
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                className="w-full h-full pl-16 pr-6 py-4 bg-transparent text-white font-mono text-sm resize-none focus:outline-none leading-6 placeholder:text-[rgba(255,255,255,0.1)]"
                                spellCheck="false"
                            />

                            {/* Editor Overlay Elements */}
                            <div className="absolute right-4 bottom-4 flex gap-2">
                                <div className="p-2 rounded-lg bg-[rgba(3,0,20,0.8)] border border-[rgba(255,255,255,0.05)] text-[var(--text-dim)] hover:text-white cursor-pointer transition-all">
                                    <Settings className="w-4 h-4" />
                                </div>
                                <div className="p-2 rounded-lg bg-[rgba(3,0,20,0.8)] border border-[rgba(255,255,255,0.05)] text-[var(--text-dim)] hover:text-white cursor-pointer transition-all">
                                    <History className="w-4 h-4" />
                                </div>
                            </div>
                        </div>

                        {/* Console / Output */}
                        <div className="h-[200px] bg-[rgba(3,0,20,0.9)] border border-[rgba(34,211,238,0.2)] rounded-2xl overflow-hidden flex flex-col shadow-inner">
                            <div className="flex items-center justify-between px-4 py-2 bg-[rgba(255,255,255,0.02)] border-b border-[rgba(255,255,255,0.05)]">
                                <div className="flex items-center gap-2">
                                    <Terminal className="w-4 h-4 text-[var(--accent)]" />
                                    <span className="text-xs font-bold text-white uppercase tracking-widest font-[Rajdhani]">Output Terminal</span>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-2 text-[10px] text-emerald-400 font-bold">
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                        CONNECTED
                                    </div>
                                    <button onClick={() => setOutput([])} className="text-[10px] text-[var(--text-dim)] hover:text-white uppercase font-bold">Clear</button>
                                </div>
                            </div>
                            <div className="flex-1 p-4 font-mono text-xs overflow-y-auto space-y-1">
                                {output.map((line, idx) => (
                                    <div key={idx} className={`flex gap-2 ${line.type === 'system' ? 'text-amber-400' :
                                            line.type === 'command' ? 'text-blue-400' :
                                                line.type === 'success' ? 'text-emerald-400' :
                                                    'text-white/80'
                                        }`}>
                                        <span className="text-white/30">{line.type === 'command' ? '$' : '>'}</span>
                                        <span>{line.text}</span>
                                    </div>
                                ))}
                                {output.length === 0 && (
                                    <div className="text-white/20 italic">No output to display. Run code to see results.</div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
