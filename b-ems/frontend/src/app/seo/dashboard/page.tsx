'use client';

import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import StatsCard from '@/components/dashboard/StatsCard';
import SectionHeader from '@/components/dashboard/SectionHeader';
import { 
  Globe, 
  Search, 
  BarChart3, 
  TrendingUp, 
  MousePointer2, 
  Link as LinkIcon,
  FileText,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle2,
  AlertCircle,
  MoreVertical,
  Plus
} from 'lucide-react';
import { motion } from 'framer-motion';

const SEODashboard = () => {
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
          title="Search Visibility Hub"
          subtitle="Advanced monitoring of search engine rankings, indexing status, and organic growth."
          icon={Globe}
          badge="SEO DIVISION"
          actionLabel="Audit Website"
          onAction={() => console.log('Starting audit...')}
        />

        {/* --- SEO STATS --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <StatsCard 
            title="Organic Traffic" 
            value="84.2K" 
            icon={Globe} 
            color="indigo" 
            trend="+15% this month"
            delay={0.1}
          />
          <StatsCard 
            title="Avg. Position" 
            value="12.4" 
            icon={TrendingUp} 
            color="purple" 
            trend="+1.2 improved"
            delay={0.2}
          />
          <StatsCard 
            title="CTR Rate" 
            value="3.8%" 
            icon={MousePointer2} 
            color="emerald" 
            trend="Stable"
            delay={0.3}
          />
          <StatsCard 
            title="Backlinks" 
            value="1.4K" 
            icon={LinkIcon} 
            color="cyan" 
            trend="+42 new links"
            delay={0.4}
          />
        </div>

        {/* --- KEYWORD RANKINGS & ANALYTICS --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
           
           {/* Keyword Performance Table */}
           <div className="lg:col-span-8 bg-white border border-slate-100 rounded-[2.5rem] overflow-hidden shadow-sm">
              <div className="p-10 border-b border-slate-50 flex items-center justify-between">
                 <div>
                    <h3 className="text-2xl font-black text-slate-900 tracking-tight">Priority Keyword Rankings</h3>
                    <p className="text-slate-500 font-medium text-sm">Real-time ranking velocity for high-value search terms</p>
                 </div>
                 <div className="flex gap-3">
                    <button className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-slate-500 hover:bg-slate-100 transition-all">
                       <Search size={18} />
                    </button>
                    <button className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-indigo-100">
                       <Plus size={18} /> Add Tracked Word
                    </button>
                 </div>
              </div>

              <div className="overflow-x-auto">
                 <table className="w-full">
                    <thead className="bg-slate-50">
                       <tr>
                          {['Keyword', 'Volume', 'Rank', 'Change', 'Status'].map(h => (
                            <th key={h} className="px-10 py-5 text-left text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">{h}</th>
                          ))}
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                       {[
                         { kw: 'java training institute hyderabad', vol: '12K', rank: 1, change: '0', status: 'Dominant' },
                         { kw: 'best software courses placement', vol: '8.5K', rank: 3, change: '+2', status: 'Rising' },
                         { kw: 'full stack python classes', vol: '15K', rank: 7, change: '+5', status: 'Rising' },
                         { kw: 'data science training online', vol: '22K', rank: 12, change: '-3', status: 'Declining' },
                         { kw: 'bytecode training reviews', vol: '4.2K', rank: 1, change: '0', status: 'Dominant' },
                       ].map((row, i) => (
                         <tr key={i} className="hover:bg-slate-50/50 transition-colors group">
                            <td className="px-10 py-6">
                               <span className="text-sm font-bold text-slate-900">{row.kw}</span>
                            </td>
                            <td className="px-10 py-6 text-sm font-medium text-slate-500">{row.vol}</td>
                            <td className="px-10 py-6 text-xl font-black text-slate-900 tracking-tighter">#{row.rank}</td>
                            <td className="px-10 py-6">
                               <div className={`flex items-center gap-1 text-xs font-black ${row.change.includes('+') ? 'text-emerald-500' : row.change === '0' ? 'text-slate-400' : 'text-rose-500'}`}>
                                  {row.change.includes('+') ? <ArrowUpRight size={14} /> : row.change === '0' ? null : <ArrowDownRight size={14} />}
                                  {row.change !== '0' ? row.change : 'Stable'}
                               </div>
                            </td>
                            <td className="px-10 py-6">
                               <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                                  row.status === 'Dominant' ? 'bg-indigo-50 text-indigo-600' : 
                                  row.status === 'Rising' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                               }`}>
                                  {row.status}
                               </span>
                            </td>
                         </tr>
                       ))}
                    </tbody>
                 </table>
              </div>
           </div>

           {/* Technical SEO Audit Sidepanel */}
           <div className="lg:col-span-4 space-y-8">
              <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden group">
                 <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/20 blur-[60px]" />
                 <h3 className="text-2xl font-black mb-10 flex items-center gap-3">
                    <Activity size={24} className="text-indigo-400" />
                    Technical Health
                 </h3>
                 
                 <div className="space-y-8">
                    {[
                      { label: 'Core Web Vitals', score: 98, status: 'Excellent' },
                      { label: 'Mobile Usability', score: 92, status: 'Good' },
                      { label: 'HTTPS Compliance', score: 100, status: 'Perfect' },
                      { label: 'Index Coverage', score: 84, status: 'Warning' },
                    ].map((stat, i) => (
                      <div key={i} className="space-y-3">
                         <div className="flex justify-between text-xs font-black tracking-widest">
                            <span className="text-slate-400 uppercase">{stat.label}</span>
                            <span className={stat.score > 90 ? 'text-emerald-400' : 'text-amber-400'}>{stat.score}%</span>
                         </div>
                         <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                            <motion.div 
                               initial={{ width: 0 }}
                               animate={{ width: `${stat.score}%` }}
                               className={`h-full ${stat.score > 90 ? 'bg-emerald-500' : 'bg-amber-500'} rounded-full`}
                            />
                         </div>
                      </div>
                    ))}
                 </div>

                 <button className="w-full mt-12 py-4 bg-white/5 border border-white/10 rounded-2xl text-white font-black text-xs hover:bg-white/10 transition-all">
                    View Full Technical Report
                 </button>
              </div>

              {/* Content Performance Mini-Card */}
              <div className="bg-white border border-slate-100 rounded-[2.5rem] p-10 shadow-sm">
                 <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 shadow-sm">
                       <FileText size={24} />
                    </div>
                    <div>
                       <h4 className="text-lg font-black text-slate-900 tracking-tight">Blog Output</h4>
                       <p className="text-slate-500 font-medium text-xs">12 posts scheduled for May</p>
                    </div>
                 </div>
                 <div className="space-y-4">
                    {[
                      { title: 'The Future of Java in 2026', views: '2.4K', color: 'bg-indigo-600' },
                      { title: 'Top 10 Coding Bootcamp Skills', views: '1.8K', color: 'bg-purple-500' },
                    ].map((blog, i) => (
                      <div key={i} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:bg-white hover:shadow-lg transition-all cursor-pointer group">
                         <p className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 transition-colors truncate">{blog.title}</p>
                         <div className="flex items-center justify-between mt-2">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{blog.views} Views</span>
                            <div className={`w-2 h-2 rounded-full ${blog.color}`} />
                         </div>
                      </div>
                    ))}
                 </div>
              </div>
           </div>
        </div>

      </div>
    </DashboardLayout>
  );
};

export default SEODashboard;
