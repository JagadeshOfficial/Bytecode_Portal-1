'use client';

import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import StatsCard from '@/components/dashboard/StatsCard';
import SectionHeader from '@/components/dashboard/SectionHeader';
import { 
  TrendingUp, 
  Globe, 
  Send, 
  Target, 
  BarChart3, 
  Zap,
  Activity,
  Search,
  MousePointer2,
  PieChart as PieChartIcon,
  ArrowRight,
  Plus,
  Filter,
  CheckCircle2,
  ArrowUpRight
} from 'lucide-react';
import { motion } from 'framer-motion';

const MarketingDashboard = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-12 pb-20">
        
        {/* --- HEADER SECTION --- */}
        <SectionHeader 
          title="Growth & Visibility Hub"
          subtitle="Real-time monitoring of SEO performance and marketing campaign ROI."
          icon={TrendingUp}
          badge="MARKETING DIVISION"
          actionLabel="New Campaign"
          onAction={() => console.log('Starting campaign...')}
        />

        {/* --- PERFORMANCE STATS --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <StatsCard 
            title="Total Traffic" 
            value="142.5K" 
            icon={Globe} 
            color="indigo" 
            trend="+24% this mo"
            delay={0.1}
          />
          <StatsCard 
            title="Ad Conversion" 
            value="4.8%" 
            icon={Target} 
            color="purple" 
            trend="+0.5% vs avg"
            delay={0.2}
          />
          <StatsCard 
            title="Keyword Growth" 
            value="+212" 
            icon={TrendingUp} 
            color="emerald" 
            trend="New Top 10s"
            delay={0.3}
          />
          <StatsCard 
            title="Campaign ROI" 
            value="3.2x" 
            icon={BarChart3} 
            color="amber" 
            trend="Exceeding Target"
            delay={0.4}
          />
        </div>

        {/* --- CAMPAIGNS & SEO HUD --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
           
           {/* SEO Performance Chart Placeholder */}
           <div className="lg:col-span-8 bg-white border border-slate-100 rounded-[2.5rem] p-10 shadow-sm relative overflow-hidden group">
              <div className="flex items-center justify-between mb-10">
                 <div>
                    <h3 className="text-2xl font-black text-slate-900 tracking-tight">Keyword Ranking Velocity</h3>
                    <p className="text-slate-500 font-medium text-sm">Real-time tracking of high-intent search terms</p>
                 </div>
                 <div className="bg-emerald-50 text-emerald-600 px-4 py-2 rounded-xl text-xs font-black flex items-center gap-2">
                    <CheckCircle2 size={14} /> SYSTEM OPTIMIZED
                 </div>
              </div>

              <div className="space-y-6">
                 {[
                   { keyword: 'best java training in hyderabad', rank: 2, move: '+1', vol: '12K' },
                   { keyword: 'data science course with placement', rank: 4, move: '+3', vol: '8.5K' },
                   { keyword: 'full stack developer classes near me', rank: 1, move: '0', vol: '15K' },
                   { keyword: 'cloud computing certification', rank: 8, move: '-2', vol: '22K' },
                 ].map((kw, i) => (
                   <div key={i} className="flex items-center justify-between p-5 hover:bg-slate-50 rounded-2xl transition-all group/kw border border-transparent hover:border-slate-100 cursor-pointer">
                      <div className="flex items-center gap-4">
                         <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs ${kw.move.includes('+') ? 'bg-emerald-50 text-emerald-600' : kw.move === '0' ? 'bg-slate-100 text-slate-500' : 'bg-rose-50 text-rose-600'}`}>
                            {kw.move}
                         </div>
                         <div>
                            <p className="font-bold text-slate-900 text-sm">{kw.keyword}</p>
                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">VOL: {kw.vol} • CPC: ₹42.50</p>
                         </div>
                      </div>
                      <div className="flex items-center gap-10">
                         <div className="text-right">
                            <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">POS</p>
                            <p className="text-xl font-black text-slate-900">#{kw.rank}</p>
                         </div>
                         <button className="p-2 text-slate-300 group-hover/kw:text-indigo-600 transition-colors">
                            <ArrowUpRight size={20} />
                         </button>
                      </div>
                   </div>
                 ))}
              </div>

              <button className="w-full mt-8 py-4 border-2 border-dashed border-slate-100 rounded-2xl text-slate-400 font-bold text-sm hover:text-indigo-600 hover:border-indigo-200 transition-all">
                 View Full SEO Audit Matrix
              </button>
           </div>

           {/* Active Campaigns Sidepanel */}
           <div className="lg:col-span-4 bg-white border border-slate-100 rounded-[2.5rem] p-10 shadow-sm">
              <h3 className="text-2xl font-black text-slate-900 tracking-tight mb-2">Live Campaigns</h3>
              <p className="text-slate-500 font-medium text-sm mb-10">Active marketing nodes performance</p>

              <div className="space-y-8">
                 {[
                   { name: 'Google Ads: Core Java', spend: '₹24K', leads: 412, roi: '3.4x', color: 'bg-indigo-600' },
                   { name: 'FB/Insta: Admissions', spend: '₹18K', leads: 284, roi: '2.8x', color: 'bg-purple-500' },
                   { name: 'LinkedIn: Enterprise', spend: '₹32K', leads: 92, roi: '4.1x', color: 'bg-cyan-500' },
                 ].map((camp, i) => (
                   <div key={i} className="relative p-6 rounded-[2rem] bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-xl transition-all cursor-pointer group">
                      <div className={`absolute top-0 right-10 w-12 h-1 ${camp.color} rounded-b-full`} />
                      <p className="text-sm font-black text-slate-900 mb-4">{camp.name}</p>
                      <div className="grid grid-cols-3 gap-4">
                         <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Spend</p>
                            <p className="text-xs font-black text-slate-900">{camp.spend}</p>
                         </div>
                         <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Leads</p>
                            <p className="text-xs font-black text-indigo-600">{camp.leads}</p>
                         </div>
                         <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">ROI</p>
                            <p className="text-xs font-black text-emerald-600">{camp.roi}</p>
                         </div>
                      </div>
                      <div className="mt-4 h-1 w-full bg-white rounded-full overflow-hidden">
                         <div className={`h-full ${camp.color} opacity-20`} style={{ width: '100%' }} />
                      </div>
                   </div>
                 ))}
              </div>

              <div className="mt-10 bg-indigo-600 rounded-3xl p-8 text-white relative overflow-hidden group cursor-pointer">
                 <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:rotate-12 transition-transform duration-500">
                    <Zap size={64} />
                 </div>
                 <h4 className="text-xl font-black mb-2">Campaign Lab</h4>
                 <p className="text-indigo-100 text-xs font-medium mb-6">Launch AI-optimized campaigns based on traffic trends.</p>
                 <button className="w-full py-3 bg-white text-indigo-600 rounded-xl font-black text-xs hover:bg-indigo-50 transition-colors">
                    Access Lab
                 </button>
              </div>
           </div>
        </div>

      </div>
    </DashboardLayout>
  );
};

export default MarketingDashboard;
