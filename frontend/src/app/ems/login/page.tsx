"use client";

import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';
import { Mail, Lock, AlertCircle, Loader2, ArrowRight, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api'}/auth/login`, {
        email,
        password
      });

      if (response.data.success) {
        login(response.data.token, response.data.user);
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Invalid credentials. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#000000] text-white flex flex-col items-center justify-center relative font-outfit selection:bg-indigo-500/30">
      
      {/* Premium Minimalist Background */}
      <div className="fixed inset-0 z-0 pointer-events-none flex items-center justify-center">
        {/* Subtle top glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-indigo-600/15 blur-[120px] rounded-full pointer-events-none" />
        
        {/* Refined Grid Pattern */}
        <div 
          className="absolute inset-0 opacity-[0.04]" 
          style={{
            backgroundImage: `linear-gradient(rgba(255, 255, 255, 1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 1) 1px, transparent 1px)`,
            backgroundSize: '64px 64px',
            WebkitMaskImage: 'radial-gradient(circle at center, black, transparent 80%)'
          }}
        />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-[440px] px-6"
      >
        {/* Branding Header */}
        <div className="flex flex-col items-center mb-10 text-center">
          <div className="w-12 h-12 bg-white text-black rounded-2xl flex items-center justify-center font-black text-xl mb-6 shadow-[0_0_30px_rgba(255,255,255,0.1)] border border-white/20 relative overflow-hidden group">
             <div className="absolute inset-0 bg-indigo-500 opacity-0 group-hover:opacity-10 transition-opacity" />
             B
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Sign in to B-EMS</h1>
          <p className="text-slate-400 font-medium text-sm">Enter your organizational credentials to continue.</p>
        </div>

        {/* The Card */}
        <div className="bg-[#0a0a0a] border border-white/10 rounded-[24px] shadow-2xl relative overflow-hidden backdrop-blur-xl">
           {/* Top inner highlight */}
           <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
           
           <div className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                
                <AnimatePresence mode="wait">
                  {error && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0, y: -10 }}
                      animate={{ opacity: 1, height: 'auto', y: 0 }}
                      exit={{ opacity: 0, height: 0, y: -10 }}
                      className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm font-medium"
                    >
                      <AlertCircle size={18} className="shrink-0" />
                      <span>{error}</span>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Email Field */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-300 ml-1">Work Email</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Mail size={18} className="text-slate-500 group-focus-within:text-white transition-colors" />
                    </div>
                    <input 
                      type="email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 bg-white/[0.03] border border-white/10 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-white/30 focus:border-white/30 transition-all font-medium placeholder:text-slate-600 hover:bg-white/[0.05]"
                      placeholder="name@bytecode.io"
                      required
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center ml-1">
                    <label className="text-sm font-semibold text-slate-300">Password</label>
                  </div>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Lock size={18} className="text-slate-500 group-focus-within:text-white transition-colors" />
                    </div>
                    <input 
                      type="password" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 bg-white/[0.03] border border-white/10 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-white/30 focus:border-white/30 transition-all font-medium placeholder:text-slate-600 hover:bg-white/[0.05]"
                      placeholder="••••••••"
                      required
                    />
                  </div>
                </div>

                {/* Submit Action */}
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full py-3.5 mt-4 rounded-xl bg-white text-black font-bold text-sm flex items-center justify-center gap-2 hover:bg-slate-200 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.1)] disabled:opacity-70 group"
                >
                  {isSubmitting ? (
                    <Loader2 className="animate-spin" size={18} />
                  ) : (
                    <>Sign In <ArrowRight size={16} className="text-slate-500 group-hover:translate-x-1 group-hover:text-black transition-all" /></>
                  )}
                </button>
              </form>
           </div>
        </div>
        
        {/* Footer Meta */}
        <div className="mt-8 text-center flex flex-col items-center gap-3">
           <a href="#" className="text-sm font-medium text-slate-500 hover:text-white transition-colors">
              Forgot your password?
           </a>
           <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 uppercase tracking-widest mt-4">
              <ShieldCheck size={14} />
              Secure Enterprise Portal
           </div>
        </div>
      </motion.div>
    </div>
  );
}
