'use client';

import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import StatsCard from '@/components/dashboard/StatsCard';
import SectionHeader from '@/components/dashboard/SectionHeader';
import { 
  TrendingUp, 
  Send, 
  Target, 
  BarChart3, 
  Zap,
  Activity,
  Search,
  MousePointer2,
  ChevronRight,
  ArrowUpRight,
  Plus,
  CheckCircle2
} from 'lucide-react';
import { motion } from 'framer-motion';

const MarketingDashboard = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-10">
        
        <SectionHeader 
          title="Growth & Visibility"
          subtitle="Monitor campaign ROI, social media performance, and lead acquisition metrics."
          icon={TrendingUp}
          badge="MARKETING DIVISION"
          actionLabel="New Campaign"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard 
            title="Ad Conversion" 
            value="4.8%" 
            icon={Target} 
            color="indigo" 
            trend="+0.5% vs avg"
            delay={0.1}
          />
          <StatsCard 
            title="Total Spend" 
            value="₹2.4L" 
            icon={BarChart3} 
            color="purple" 
            trend="On budget"
            delay={0.2}
          />
          <StatsCard 
            title="New Leads" 
            value="284" 
            icon={Send} 
            color="emerald" 
            trend="+12% growth"
            delay={0.3}
          />
          <StatsCard 
            title="Campaign ROI" 
            value="3.2x" 
            icon={TrendingUp} 
            color="amber" 
            trend="Exceeding target"
            delay={0.4}
          />
        </div>

        {/* --- CAMPAIGN HUD --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
           
           {/* Campaign Performance Table */}
           <div className="lg:col-span-8 bg-white border border-slate-100 rounded-[2rem] overflow-hidden shadow-sm">
              <div className="p-8 border-b border-slate-50 flex items-center justify-between">
                 <h3 className="text-xl font-black text-slate-900 tracking-tight">Active Campaigns</h3>
                 <div className="flex gap-2">
                    <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl font-bold text-xs shadow-lg shadow-indigo-100 hover:scale-105 transition-all">
                       <Plus size={14} /> Create Node
                    </button>
                 </div>
              </div>

              <div className="overflow-x-auto">
                 <table className="w-full">
                    <thead className="bg-slate-50/50">
                       <tr>
                          {['Campaign Name', 'Spend', 'Leads', 'ROI', 'Status'].map((h) => (
                            <th key={h} className="px-8 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">{h}</th>
                          ))}
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                       {[
                         { name: 'Google Ads: Core Java', spend: '₹24K', leads: 412, roi: '3.4x', status: 'Active', color: 'bg-indigo-600' },
                         { name: 'FB/Insta: Admissions', spend: '₹18K', leads: 284, roi: '2.8x', status: 'Active', color: 'bg-purple-500' },
                         { name: 'LinkedIn: Enterprise', spend: '₹32K', leads: 92, roi: '4.1x', status: 'Paused', color: 'bg-cyan-500' },
                       ].map((camp, i) => (
                         <tr key={i} className="hover:bg-slate-50/50 transition-colors group">
                            <td className="px-8 py-5">
                               <div className="flex items-center gap-3">
                                  <div className={`w-2 h-2 rounded-full ${camp.color}`} />
                                  <span className="text-sm font-bold text-slate-900">{camp.name}</span>
                               </div>
                            </td>
                            <td className="px-8 py-5 text-sm font-medium text-slate-500">{camp.spend}</td>
                            <td className="px-8 py-5 text-sm font-black text-slate-900">{camp.leads}</td>
                            <td className="px-8 py-5 text-sm font-black text-emerald-600">{camp.roi}</td>
                            <td className="px-8 py-5">
                               <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                                 camp.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400'
                               }`}>
                                  {camp.status}
                               </span>
                            </td>
                         </tr>
                       ))}
                    </tbody>
                 </table>
              </div>
           </div>

           {/* Ad Lab Sidepanel */}
           <div className="lg:col-span-4 space-y-6">
              <div className="bg-indigo-600 rounded-[2rem] p-8 text-white shadow-xl relative overflow-hidden group cursor-pointer">
                 <div className="absolute top-0 right-0 p-8 opacity-20 group-hover:rotate-12 transition-transform duration-500">
                    <Zap size={64} />
                 </div>
                 <h4 className="text-xl font-black mb-2">Campaign Intelligence</h4>
                 <p className="text-indigo-100 text-xs font-medium mb-8">AI-optimized insights for your next marketing node launch.</p>
                 <div className="space-y-4">
                    <div className="p-4 bg-white/10 rounded-2xl border border-white/10">
                       <p className="text-[10px] font-black uppercase tracking-widest text-indigo-200 mb-1">Top Performer</p>
                       <p className="text-sm font-bold">Insta-Lead-Gen #4</p>
                    </div>
                    <div className="p-4 bg-white/10 rounded-2xl border border-white/10">
                       <p className="text-[10px] font-black uppercase tracking-widest text-indigo-200 mb-1">CPL Variance</p>
                       <p className="text-sm font-bold text-emerald-300">-12% Optimization</p>
                    </div>
                 </div>
                 <button className="w-full mt-8 py-3 bg-white text-indigo-600 rounded-xl font-black text-xs hover:bg-indigo-50 transition-colors">
                    Access Lab
                 </button>
              </div>

              <div className="bg-white border border-slate-100 rounded-[2rem] p-8 shadow-sm">
                 <h4 className="text-sm font-black text-slate-900 mb-6 uppercase tracking-widest">Global Reach</h4>
                 <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden mb-4">
                    <div className="h-full bg-indigo-500" style={{ width: '75%' }} />
                 </div>
                 <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    <span>Target</span>
                    <span className="text-indigo-600">75% Achieved</span>
                 </div>
              </div>
           </div>
        </div>

      </div>
    </DashboardLayout>
  );
};

export default MarketingDashboard;
