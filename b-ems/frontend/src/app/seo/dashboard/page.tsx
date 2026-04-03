'use client';

import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import StatsCard from '@/components/dashboard/StatsCard';
import { 
  Globe, 
  TrendingUp, 
  Search, 
  Activity, 
  MousePointer2, 
  BarChart3, 
  Terminal,
  Zap
} from 'lucide-react';
import { motion } from 'framer-motion';

const SEODashboard = () => {
  return (
    <DashboardLayout>
      <div className="flex flex-col gap-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Search Engine Authority</h1>
            <p className="text-slate-500 font-medium">Domain performance and keyword ranking</p>
          </div>
          
          <div className="flex items-center gap-3">
             <div className="bg-white border border-slate-200 px-4 py-2 rounded-xl flex items-center gap-2">
                <Globe size={18} className="text-indigo-600" />
                <span className="font-bold text-sm tracking-tight text-slate-700">bytecode.io</span>
             </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard title="Monthly Traffic" value="245K" icon={Globe} color="indigo" />
          <StatsCard title="Ranked Keywords" value="1.2K" icon={TrendingUp} color="purple" trend="+42 New" />
          <StatsCard title="Core Web Vitals" value="98%" icon={Zap} color="emerald" />
          <StatsCard title="Impressions" value="4.2M" icon={Activity} color="cyan" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="glass-card p-8">
            <h3 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-2">
              <Search className="text-indigo-600" size={24} />
              Keyword Rankings (Today)
            </h3>
            
            <div className="space-y-4">
              {[
                { kw: 'full stack developer course', rank: 1, pos: 'up' },
                { kw: 'best tech training 2026', rank: 3, pos: 'up' },
                { kw: 'learn coding from scratch', rank: 5, pos: 'down' },
                { kw: 'placement guaranteed courses', rank: 2, pos: 'up' },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-indigo-200 transition-all">
                  <span className="text-sm font-bold text-slate-900">{item.kw}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-black text-slate-900">#{item.rank}</span>
                    <div className={`w-2 h-2 rounded-full ${item.pos === 'up' ? 'bg-emerald-500 shadow-lg shadow-emerald-200' : 'bg-rose-500 shadow-lg shadow-rose-200'}`}></div>
                  </div>
                </div>
              ))}
            </div>
            
            <button className="w-full mt-6 py-4 border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 hover:text-indigo-600 hover:border-indigo-400 font-bold text-sm transition-all tracking-tight flex items-center justify-center gap-2">
              <Plus size={16} /> Track New Keyword
            </button>
          </div>

          <div className="glass-card p-8">
            <h3 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-2">
              <Terminal className="text-indigo-600" size={24} />
              Technical Health Logs
            </h3>
            <div className="space-y-4">
              {[
                { log: 'Sitemap updated successfully', time: '2h ago' },
                { log: 'Mobile performance audit passed', time: '1d ago' },
                { log: '404 error detected: /old-courses', time: '2d ago', error: true },
              ].map((item, idx) => (
                <div key={idx} className={`p-4 rounded-2xl border ${item.error ? 'bg-rose-50 border-rose-100' : 'bg-slate-50 border-slate-100'}`}>
                  <p className={`text-sm font-bold ${item.error ? 'text-rose-600' : 'text-slate-800'}`}>{item.log}</p>
                  <p className="text-[10px] font-black text-slate-400 uppercase">{item.time}</p>
                </div>
              ))}
              <div className="mt-8 bg-indigo-600 p-6 rounded-3xl relative overflow-hidden group shadow-xl shadow-indigo-200">
                <div className="relative z-10">
                   <h4 className="text-white font-black text-lg mb-1 tracking-tight">SEO AI Insights</h4>
                   <p className="text-indigo-100 text-xs font-medium opacity-80 mb-4">
                      Improve domain authority by focusing on backlink quality and mobile optimization.
                   </p>
                   <button className="bg-white text-indigo-600 text-xs font-black px-4 py-2 rounded-xl flex items-center gap-2">
                      Run Live Audit
                      <Zap size={14} />
                   </button>
                </div>
                <div className="absolute top-4 right-4 text-white/20"><Globe size={64} /></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

const Plus = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
);

export default SEODashboard;
