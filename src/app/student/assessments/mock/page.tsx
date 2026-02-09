"use client";

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Clock,
    AlertCircle,
    Camera,
    ChevronLeft,
    ChevronRight,
    Flag,
    CheckCircle2,
    Shield,
    Monitor,
    Brain,
    MousePointer2
} from 'lucide-react';

export default function MockTestEngine() {
    const [timeLeft, setTimeLeft] = useState(3600); // 60 mins
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [proctorAlert, setProctorAlert] = useState(false);

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(prev => prev > 0 ? prev - 1 : 0);
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const QUESTIONS = [
        {
            id: 1,
            section: "Quantitative Aptitude",
            q: "In a certain code, 'COMPUTER' is written as 'RFUVQNPC'. How is 'MEDICINE' written in that code?",
            options: ["EOJDJEFM", "EOJDEJFM", "MFEJDJOE", "EOJDJFME"],
            correct: 0
        },
        {
            id: 2,
            section: "Quantitative Aptitude",
            q: "A sum of money at compound interest amounts to thrice itself in 3 years. In how many years will it be 9 times itself?",
            options: ["6 years", "9 years", "12 years", "15 years"],
            correct: 1
        }
    ];

    return (
        <DashboardLayout role="student">
            <div className="flex flex-col h-[calc(100vh-140px)] gap-6">
                {/* Header: Test Info & Proctoring */}
                <div className="flex flex-col md:flex-row justify-between items-center bg-[rgba(19,10,48,0.8)] border-b border-[rgba(124,58,237,0.3)] p-4 rounded-t-2xl gap-4 backdrop-blur-xl">
                    <div className="flex items-center gap-4">
                        <div className="p-2 bg-red-500/10 rounded-lg flex items-center gap-2 border border-red-500/20">
                            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                            <span className="text-[10px] font-bold text-red-500 uppercase tracking-widest">Live Proctoring Active</span>
                        </div>
                        <h2 className="text-lg font-bold text-white font-[Rajdhani]">Accenture Composite Mock - Set A</h2>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="flex flex-col items-center">
                            <span className="text-[10px] text-[var(--text-dim)] uppercase font-bold">Section Timer</span>
                            <div className={`text-2xl font-bold font-mono ${timeLeft < 300 ? 'text-red-400 animate-pulse' : 'text-[#22d3ee]'}`}>
                                {formatTime(timeLeft)}
                            </div>
                        </div>
                        <button className="px-6 py-2 bg-emerald-500 text-white rounded-lg font-bold shadow-[0_0_15px_rgba(16,185,129,0.4)] hover:scale-105 transition-all">
                            Submit Test
                        </button>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-6 overflow-hidden">
                    {/* Left Panel: Question Content */}
                    <div className="lg:col-span-3 flex flex-col gap-6 overflow-hidden">
                        <div className="flex-1 bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.05)] rounded-2xl p-8 overflow-y-auto">
                            <div className="flex justify-between items-center mb-6">
                                <span className="px-3 py-1 bg-[#7c3aed]/20 rounded-full text-xs font-bold text-[#7c3aed] uppercase border border-[#7c3aed]/30">
                                    {QUESTIONS[currentQuestion]?.section}
                                </span>
                                <span className="text-sm text-[var(--text-dim)] font-medium">Question {currentQuestion + 1} of 40</span>
                            </div>

                            <motion.div
                                key={currentQuestion}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="space-y-8"
                            >
                                <h3 className="text-xl text-white leading-relaxed font-medium">
                                    {QUESTIONS[currentQuestion]?.q}
                                </h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {QUESTIONS[currentQuestion]?.options.map((option, idx) => (
                                        <div
                                            key={idx}
                                            className="group flex items-center gap-4 p-4 rounded-xl border border-[rgba(255,255,255,0.05)] hover:border-[#7c3aed] hover:bg-[rgba(124,58,237,0.05)] cursor-pointer transition-all"
                                        >
                                            <div className="w-8 h-8 rounded-full border border-[rgba(255,255,255,0.1)] group-hover:border-[#7c3aed] flex items-center justify-center text-xs text-[var(--text-dim)] group-hover:text-white font-bold transition-all">
                                                {String.fromCharCode(65 + idx)}
                                            </div>
                                            <span className="text-white group-hover:text-[var(--accent)] transition-colors">{option}</span>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        </div>

                        {/* Navigation Footer */}
                        <div className="flex justify-between items-center bg-[rgba(19,10,48,0.5)] border border-[rgba(255,255,255,0.05)] p-4 rounded-2xl">
                            <div className="flex gap-3">
                                <button className="flex items-center gap-2 px-4 py-2 text-[var(--text-dim)] hover:text-white transition-colors">
                                    <Flag className="w-4 h-4" />
                                    Mark for Review
                                </button>
                                <button className="flex items-center gap-2 px-4 py-2 text-[var(--text-dim)] hover:text-white transition-colors">
                                    <AlertCircle className="w-4 h-4" />
                                    Report Issue
                                </button>
                            </div>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setCurrentQuestion(q => Math.max(0, q - 1))}
                                    disabled={currentQuestion === 0}
                                    className="p-2 border border-[rgba(255,255,255,0.1)] rounded-lg text-white disabled:opacity-30"
                                >
                                    <ChevronLeft className="w-6 h-6" />
                                </button>
                                <button
                                    onClick={() => setCurrentQuestion(q => Math.min(QUESTIONS.length - 1, q + 1))}
                                    className="flex items-center gap-2 px-8 py-2 bg-[rgba(124,58,237,0.1)] border border-[#7c3aed]/30 rounded-lg text-[#7c3aed] font-bold hover:bg-[#7c3aed] hover:text-white transition-all shadow-lg"
                                >
                                    Save & Next
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Right Panel: Exam Controls & Proctor View */}
                    <div className="flex flex-col gap-6 overflow-hidden">
                        {/* Proctoring View */}
                        <div className="relative aspect-video bg-black rounded-2xl border border-[rgba(255,255,255,0.1)] overflow-hidden group">
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Camera className="w-4 h-4 text-white" />
                                        <span className="text-[10px] text-white font-bold font-mono">USER_FRONT_CAM</span>
                                    </div>
                                    <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                                </div>
                            </div>
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
                                <Shield className="w-16 h-16 text-[#7c3aed]" />
                            </div>
                        </div>

                        {/* Question Palette */}
                        <div className="flex-1 bg-[rgba(19,10,48,0.5)] border border-[rgba(255,255,255,0.05)] rounded-2xl p-6 flex flex-col overflow-hidden">
                            <h4 className="text-xs font-bold text-white uppercase tracking-widest mb-4">Question Palette</h4>
                            <div className="flex-1 overflow-y-auto">
                                <div className="grid grid-cols-4 md:grid-cols-5 gap-2">
                                    {Array.from({ length: 40 }).map((_, i) => (
                                        <div
                                            key={i}
                                            className={`aspect-square rounded-lg flex items-center justify-center text-xs font-bold cursor-pointer transition-all border ${i === currentQuestion ? 'bg-[#7c3aed] border-[#7c3aed] text-white shadow-[0_0_10px_rgba(124,58,237,0.5)] scale-110' :
                                                    i < 2 ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-400' :
                                                        'bg-[rgba(255,255,255,0.03)] border-[rgba(255,255,255,0.1)] text-[var(--text-dim)] hover:border-[#7c3aed]/50'
                                                }`}
                                            onClick={() => i < QUESTIONS.length && setCurrentQuestion(i)}
                                        >
                                            {i + 1}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="mt-6 pt-6 border-t border-[rgba(255,255,255,0.05)] space-y-3">
                                <div className="flex items-center gap-3 text-xs">
                                    <div className="w-3 h-3 rounded-sm bg-emerald-500" />
                                    <span className="text-[var(--text-dim)]">Answered</span>
                                </div>
                                <div className="flex items-center gap-3 text-xs">
                                    <div className="w-3 h-3 rounded-sm bg-[#7c3aed]" />
                                    <span className="text-[var(--text-dim)]">Current</span>
                                </div>
                                <div className="flex items-center gap-3 text-xs">
                                    <div className="w-3 h-3 rounded-sm bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.1)]" />
                                    <span className="text-[var(--text-dim)]">Not Visited</span>
                                </div>
                            </div>
                        </div>

                        {/* Proctoring Alerts */}
                        <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl">
                            <div className="flex items-start gap-3">
                                <AlertCircle className="w-5 h-5 text-amber-500 mt-0.5" />
                                <div>
                                    <h5 className="text-xs font-bold text-amber-500 uppercase tracking-wider">System Alert</h5>
                                    <p className="text-[10px] text-amber-500/80 leading-relaxed mt-1">Multiple face detection alert. Please ensure you are alone during the assessment.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
