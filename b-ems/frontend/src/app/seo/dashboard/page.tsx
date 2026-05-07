'use client';

import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import SectionHeader from '@/components/dashboard/SectionHeader';
import StatsCard from '@/components/dashboard/StatsCard';
import { 
  Globe, 
  Search, 
  TrendingUp, 
  Activity, 
  Zap, 
  MousePointer2, 
  BarChart3, 
  ShieldCheck,
  FileText,
  Plus,
  ArrowUpRight,
  ChevronRight,
  ExternalLink,
  Target
} from 'lucide-react';
import { motion } from 'framer-motion';

const SEODashboard = () => {
  return (
    <DashboardLayout>
      <div className="space-y-10 pb-20">
        
        <SectionHeader 
          title="Search Intelligence & Authority"
          subtitle="Dominate search rankings and monitor domain authority with deep-crawl analytics."
          icon={Globe}
          badge="ORGANIC GROWTH"
          actionLabel="Technical Audit"
        />

        {/* --- VISIBILITY CLUSTERS --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard 
            title="Total Sessions" 
            value="42.8K" 
            icon={MousePointer2} 
            color="indigo" 
            trend="+14% growth"
          />
          <StatsCard 
            title="Domain Authority" 
            value="48/100" 
            icon={ShieldCheck} 
            color="emerald" 
            trend="+2 points"
          />
          <StatsCard 
            title="Top 10 Keywords" 
            value="182" 
            icon={Target} 
            color="purple" 
            trend="+12 since last crawl"
          />
          <StatsCard 
            title="Backlink Health" 
            value="94%" 
            icon={Activity} 
            color="amber" 
            trend="Strong Authority"
          />
        </div>

        {/* --- SEARCH ANALYTICS GRID --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
           
           {/* Keyword Ranking Matrix */}
           <div className="lg:col-span-8 bg-white border border-slate-100 rounded-[2.5rem] overflow-hidden shadow-sm">
              <div className="p-10 border-b border-slate-50 flex items-center justify-between">
                 <div>
                    <h3 className="text-2xl font-black text-slate-900 tracking-tight">Keyword Ranking Pulse</h3>
                    <p className="text-slate-500 font-medium text-sm">Active tracking of high-volume organic search terms</p>
                 </div>
                 <div className="flex gap-4">
                    <div className="relative group">
                       <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                       <input 
                         type="text" 
                         placeholder="Search terms..." 
                         className="pl-11 pr-6 py-2.5 bg-slate-50 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-100 border border-transparent focus:border-indigo-100" 
                       />
                    </div>
                 </div>
              </div>

              <div className="overflow-x-auto">
                 <table className="w-full">
                    <thead className="bg-slate-50/50">
                       <tr>
                          {['Search Term', 'Ranking', 'Difficulty', 'Volume', 'Traffic', 'Last Sync'].map((h) => (
                            <th key={h} className="px-10 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{h}</th>
                          ))}
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                       {[
                         { term: 'Best Java Training in Hyderabad', rank: '#1', diff: 64, vol: '12K', traffic: '2.4K', sync: '2h ago' },
                         { term: 'Python Course with Placement', rank: '#3', diff: 78, vol: '18K', traffic: '1.2K', sync: '4h ago' },
                         { term: 'Software Testing Bootcamp', rank: '#2', diff: 52, vol: '8.4K', traffic: '840', sync: '1d ago' },
                         { term: 'ByteCode Trainings Review', rank: '#1', diff: 12, vol: '4.2K', traffic: '3.1K', sync: '2d ago' },
                       ].map((keyword, i) => (
                         <tr key={i} className="hover:bg-slate-50/50 transition-all cursor-pointer group">
                            <td className="px-10 py-6 text-sm font-black text-slate-900">{keyword.term}</td>
                            <td className="px-10 py-6 text-sm font-black text-indigo-600">{keyword.rank}</td>
                            <td className="px-10 py-6">
                               <div className="flex items-center gap-2">
                                  <div className="h-1.5 w-12 bg-slate-100 rounded-full overflow-hidden">
                                     <div className={`h-full ${keyword.diff > 70 ? 'bg-rose-500' : 'bg-amber-500'}`} style={{ width: `${keyword.diff}%` }} />
                                  </div>
                                  <span className="text-[10px] font-black text-slate-400">{keyword.diff}%</span>
                               </div>
                            </td>
                            <td className="px-10 py-6 text-sm font-bold text-slate-600">{keyword.vol}</td>
                            <td className="px-10 py-6 text-sm font-black text-emerald-600">+{keyword.traffic}</td>
                            <td className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-tighter">{keyword.sync}</td>
                         </tr>
                       ))}
                    </tbody>
                 </table>
              </div>
           </div>

           {/* Content Hub Sidepanel */}
           <div className="lg:col-span-4 space-y-8">
              <div className="bg-white border border-slate-100 rounded-[2.5rem] p-10 shadow-sm">
                 <h3 className="text-xl font-black text-slate-900 mb-8 tracking-tight">Recent Blog Nodes</h3>
                 <div className="space-y-6">
                    {[
                      { title: 'Top 10 Java Careers in 2024', status: 'Published', date: 'Oct 12' },
                      { title: 'Why AI is Changing Testing', status: 'Draft', date: 'Oct 10' },
                      { title: 'Student Success: Kunal M.', status: 'Published', date: 'Oct 08' },
                    ].map((blog, i) => (
                      <div key={i} className="flex items-center justify-between group cursor-pointer">
                         <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                               <FileText size={18} />
                            </div>
                            <div>
                               <p className="text-sm font-bold text-slate-900 leading-tight mb-1">{blog.title}</p>
                               <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{blog.date}</span>
                            </div>
                         </div>
                         <ChevronRight size={16} className="text-slate-300 group-hover:text-indigo-600 transition-colors" />
                      </div>
                    ))}
                 </div>
                 <button className="w-full mt-10 py-3.5 border-2 border-dashed border-slate-100 rounded-2xl text-slate-400 font-bold text-xs hover:text-indigo-600 hover:border-indigo-100 transition-all">
                    Create Content Node
                 </button>
              </div>

              <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden group">
                 <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:rotate-12 transition-transform duration-700">
                    <Zap size={80} />
                 </div>
                 <h4 className="text-xl font-black mb-2 tracking-tight">Technical Health</h4>
                 <p className="text-slate-400 text-xs font-medium mb-10 leading-relaxed">System crawl completed. 0 critical errors, 4 warnings found on homepage metadata.</p>
                 <div className="flex items-center justify-between mb-8">
                    <span className="text-4xl font-black text-emerald-400">98%</span>
                    <div className="flex flex-col items-end">
                       <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Core Web Vitals</span>
                       <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Optimized</span>
                    </div>
                 </div>
                 <button className="w-full py-4 bg-white/10 hover:bg-white/20 border border-white/10 rounded-2xl text-white font-black text-xs transition-all">
                    View Technical Audit
                 </button>
              </div>
           </div>
        </div>

      </div>
    </DashboardLayout>
  );
};

export default SEODashboard;
