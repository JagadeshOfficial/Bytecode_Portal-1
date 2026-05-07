'use client';

import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import SectionHeader from '@/components/dashboard/SectionHeader';
import StatsCard from '@/components/dashboard/StatsCard';
import { 
  Megaphone, 
  Send, 
  TrendingUp, 
  PieChart, 
  Target, 
  BarChart3, 
  Activity,
  Globe,
  MousePointer2,
  Share2,
  DollarSign,
  Plus,
  ArrowUpRight,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { motion } from 'framer-motion';

const MarketingDashboard = () => {
  return (
    <DashboardLayout>
      <div className="space-y-10 pb-20">
        
        <SectionHeader 
          title="Growth Engine & ROI"
          subtitle="Precision marketing orchestration and multi-channel campaign performance tracking."
          icon={Megaphone}
          badge="GROWTH DIVISION"
          actionLabel="Launch Campaign"
        />

        {/* --- PERFORMANCE CLUSTERS --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard 
            title="Total Ad Spend" 
            value="₹2,42,000" 
            icon={DollarSign} 
            color="indigo" 
            trend="12% budget left"
          />
          <StatsCard 
            title="Campaign ROI" 
            value="3.8x" 
            icon={TrendingUp} 
            color="emerald" 
            trend="Peak performance"
          />
          <StatsCard 
            title="Total Clicks" 
            value="18.4K" 
            icon={MousePointer2} 
            color="purple" 
            trend="+12% ctr growth"
          />
          <StatsCard 
            title="Lead Cost (CPL)" 
            value="₹412" 
            icon={Target} 
            color="amber" 
            trend="Optimized -5%"
          />
        </div>

        {/* --- GROWTH ANALYTICS GRID --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
           
           {/* Campaign ROI Matrix */}
           <div className="lg:col-span-8 bg-white border border-slate-100 rounded-[2.5rem] overflow-hidden shadow-sm">
              <div className="p-10 border-b border-slate-50 flex items-center justify-between">
                 <div>
                    <h3 className="text-2xl font-black text-slate-900 tracking-tight">Active Node Performance</h3>
                    <p className="text-slate-500 font-medium text-sm">Real-time conversion tracking across all sources</p>
                 </div>
                 <button className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-2xl font-black text-xs shadow-lg shadow-indigo-100 hover:scale-105 transition-all">
                    <Plus size={16} /> New Ad Set
                 </button>
              </div>

              <div className="overflow-x-auto">
                 <table className="w-full">
                    <thead className="bg-slate-50/50">
                       <tr>
                          {['Campaign Entity', 'Ad Spend', 'Leads', 'CPL', 'ROI', 'Health'].map((h) => (
                            <th key={h} className="px-10 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{h}</th>
                          ))}
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                       {[
                         { name: 'Google Search: Java Fullstack', spend: '₹42K', leads: 240, cpl: '₹175', roi: '4.2x', health: 94 },
                         { name: 'Meta Leads: Python AI', spend: '₹18K', leads: 412, cpl: '₹43', roi: '3.1x', health: 88 },
                         { name: 'LinkedIn: B2B Enterprise', spend: '₹84K', leads: 32, cpl: '₹2,625', roi: '5.4x', health: 96 },
                         { name: 'Insta Reels: Admissions', spend: '₹12K', leads: 840, cpl: '₹14', roi: '1.8x', health: 72 },
                       ].map((camp, i) => (
                         <tr key={i} className="hover:bg-slate-50/50 transition-all cursor-pointer group">
                            <td className="px-10 py-6">
                               <div className="flex items-center gap-4">
                                  <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                                     <Globe size={18} />
                                  </div>
                                  <span className="text-sm font-black text-slate-900">{camp.name}</span>
                               </div>
                            </td>
                            <td className="px-10 py-6 text-sm font-bold text-slate-600">{camp.spend}</td>
                            <td className="px-10 py-6 text-sm font-black text-slate-900">{camp.leads}</td>
                            <td className="px-10 py-6 text-sm font-bold text-slate-500">{camp.cpl}</td>
                            <td className="px-10 py-6">
                               <span className="text-sm font-black text-emerald-600">{camp.roi}</span>
                            </td>
                            <td className="px-10 py-6">
                               <div className="flex items-center gap-3">
                                  <div className="h-1.5 w-16 bg-slate-100 rounded-full overflow-hidden">
                                     <div className={`h-full ${camp.health > 80 ? 'bg-emerald-500' : 'bg-amber-500'}`} style={{ width: `${camp.health}%` }} />
                                  </div>
                                  <span className="text-[10px] font-black text-slate-900">{camp.health}%</span>
                               </div>
                            </td>
                         </tr>
                       ))}
                    </tbody>
                 </table>
              </div>
           </div>

           {/* Source Distribution Sidepanel */}
           <div className="lg:col-span-4 space-y-8">
              <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden group">
                 <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/10 blur-[80px]" />
                 <h3 className="text-xl font-black mb-8 flex items-center gap-3">
                    <Share2 className="text-indigo-400" size={24} />
                    Source Intensity
                 </h3>
                 <div className="space-y-8 relative z-10">
                    {[
                      { label: 'Google Search', val: '42%', color: 'bg-indigo-500' },
                      { label: 'Meta Ecosystem', val: '38%', color: 'bg-purple-500' },
                      { label: 'Direct Traffic', val: '12%', color: 'bg-cyan-500' },
                      { label: 'Offline / Referral', val: '8%', color: 'bg-emerald-500' },
                    ].map((source, i) => (
                      <div key={i}>
                         <div className="flex justify-between text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-3">
                            <span>{source.label}</span>
                            <span className="text-white">{source.val}</span>
                         </div>
                         <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                            <motion.div 
                               initial={{ width: 0 }}
                               animate={{ width: source.val }}
                               transition={{ duration: 1.5, delay: i * 0.2 }}
                               className={`h-full ${source.color}`}
                            />
                         </div>
                      </div>
                    ))}
                 </div>
                 <button className="w-full mt-10 py-4 bg-white/10 hover:bg-white/20 border border-white/10 rounded-2xl text-white font-black text-xs transition-all">
                    Channel Deep-Dive
                 </button>
              </div>

              <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-[2.5rem] p-10 text-white shadow-xl relative overflow-hidden group cursor-pointer">
                 <div className="absolute -bottom-6 -right-6 p-8 opacity-20 group-hover:rotate-12 transition-transform duration-700">
                    <Sparkles size={120} />
                 </div>
                 <h4 className="text-lg font-black mb-2 tracking-tight">Marketing Intelligence</h4>
                 <p className="text-indigo-100 text-xs font-medium mb-10 leading-relaxed">AI suggests reallocating ₹12K from Meta to LinkedIn for a predicted 14% increase in ROI.</p>
                 <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-widest bg-white/20 px-3 py-1 rounded-full">Optimized</span>
                    <button className="flex items-center gap-2 text-sm font-black hover:gap-3 transition-all">
                       Accept Shift <ChevronRight size={18} />
                    </button>
                 </div>
              </div>
           </div>
        </div>

      </div>
    </DashboardLayout>
  );
};

export default MarketingDashboard;
