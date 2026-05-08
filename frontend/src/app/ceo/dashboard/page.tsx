'use client';

import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import StatsCard from '@/components/dashboard/StatsCard';
import SectionHeader from '@/components/dashboard/SectionHeader';
import { 
  Zap, 
  DollarSign, 
  GraduationCap, 
  Briefcase, 
  Target, 
  Activity,
  ArrowUpRight,
  ChevronRight,
  TrendingUp,
  Award
} from 'lucide-react';
import { motion } from 'framer-motion';

const CEODashboard = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-10">
        
        {/* --- HEADER --- */}
        <SectionHeader 
          title="Enterprise Executive Hub"
          subtitle="Real-time strategic oversight of ByteCode Trainings ecosystem."
          icon={Zap}
          badge="ROOT ACCESS"
        />

        {/* --- CORE KPI GRID --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard 
            title="Total Revenue" 
            value="₹42.8L" 
            icon={DollarSign} 
            color="emerald" 
            trend="+12% growth"
            delay={0.1}
          />
          <StatsCard 
            title="Active Admissions" 
            value="1,240" 
            icon={GraduationCap} 
            color="indigo" 
            trend="+48 this week"
            delay={0.2}
          />
          <StatsCard 
            title="Staff Strength" 
            value="86" 
            icon={Briefcase} 
            color="purple" 
            trend="Stable"
            delay={0.3}
          />
          <StatsCard 
            title="Lead Velocity" 
            value="24.5%" 
            icon={Target} 
            color="amber" 
            trend="Above average"
            delay={0.4}
          />
        </div>

        {/* --- STRATEGIC INSIGHTS --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           
           {/* Performance Matrix */}
           <div className="lg:col-span-2 bg-white rounded-[2rem] border border-slate-100 p-8 shadow-sm overflow-hidden relative group">
              <div className="flex items-center justify-between mb-8">
                 <div>
                    <h3 className="text-xl font-black text-slate-900 tracking-tight">Revenue Velocity</h3>
                    <p className="text-slate-500 text-sm font-medium">Growth trajectory across all branches</p>
                 </div>
                 <button className="text-indigo-600 font-bold text-xs flex items-center gap-1 hover:gap-2 transition-all">
                    Full Report <ChevronRight size={14} />
                 </button>
              </div>
              
              {/* Animated Mock Chart Area */}
              <div className="h-64 flex items-end gap-3 px-2">
                 {[40, 65, 45, 90, 55, 75, 85, 60, 95, 70, 80, 100].map((h, i) => (
                   <motion.div 
                     key={i}
                     initial={{ height: 0 }}
                     animate={{ height: `${h}%` }}
                     transition={{ delay: i * 0.05, duration: 1 }}
                     className="flex-1 bg-gradient-to-t from-indigo-600 to-indigo-400 rounded-t-lg opacity-80 hover:opacity-100 cursor-pointer"
                   />
                 ))}
              </div>
              <div className="flex justify-between mt-4 px-2 text-[10px] font-black text-slate-400 tracking-widest">
                 <span>JAN</span><span>JUN</span><span>DEC</span>
              </div>
           </div>

           {/* Branch Leaderboard */}
           <div className="bg-white rounded-[2rem] border border-slate-100 p-8 shadow-sm">
              <h3 className="text-xl font-black text-slate-900 tracking-tight mb-8">Top Branch Nodes</h3>
              <div className="space-y-6">
                 {[
                   { name: 'Hyderabad Main', score: '98%', trend: '+2%' },
                   { name: 'Bangalore Hub', score: '92%', trend: '+4%' },
                   { name: 'Chennai Tech', score: '84%', trend: '-1%' },
                 ].map((branch, i) => (
                   <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-indigo-200 transition-all">
                      <div>
                         <p className="text-sm font-black text-slate-900">{branch.name}</p>
                         <div className="flex items-center gap-2 mt-1">
                            <div className="h-1.5 w-24 bg-slate-200 rounded-full overflow-hidden">
                               <div className="h-full bg-indigo-500 rounded-full" style={{ width: branch.score }} />
                            </div>
                            <span className="text-[10px] font-black text-slate-500">{branch.score}</span>
                         </div>
                      </div>
                      <div className={`text-xs font-black ${branch.trend.includes('+') ? 'text-emerald-500' : 'text-rose-500'}`}>
                         {branch.trend}
                      </div>
                   </div>
                 ))}
              </div>
              <button className="w-full mt-8 py-3 border-2 border-dashed border-slate-100 rounded-2xl text-slate-400 font-bold text-xs hover:text-indigo-600 hover:border-indigo-100 transition-all">
                 View Operational Map
              </button>
           </div>
        </div>

        {/* --- SYSTEM AUDIT LOG --- */}
        <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden group">
           <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 blur-[100px]" />
           <div className="flex items-center justify-between mb-10">
              <div className="flex items-center gap-4">
                 <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-indigo-400">
                    <Activity size={24} />
                 </div>
                 <div>
                    <h3 className="text-2xl font-black tracking-tight">Core System Audit</h3>
                    <p className="text-slate-400 text-sm font-medium">Real-time mutation tracking across all nodes</p>
                 </div>
              </div>
              <div className="flex gap-2">
                 <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                 <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Live Pulse</span>
              </div>
           </div>

           <div className="space-y-4">
              {[
                { actor: 'ADMIN_01', action: 'Approved Leave', target: 'K. Verma', time: '2m ago' },
                { actor: 'SYS_NODE', action: 'Backup Successful', target: 'AWS-S3', time: '15m ago' },
                { actor: 'MANAGER', action: 'Created Batch', target: 'Java FS #4', time: '1h ago' },
              ].map((log, i) => (
                <div key={i} className="flex items-center justify-between p-5 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-all cursor-pointer">
                   <div className="flex items-center gap-6">
                      <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">{log.actor}</span>
                      <p className="text-sm font-bold text-white">{log.action}</p>
                      <span className="text-slate-500">→</span>
                      <p className="text-sm font-medium text-slate-300">{log.target}</p>
                   </div>
                   <span className="text-[10px] font-black text-slate-500 uppercase">{log.time}</span>
                </div>
              ))}
           </div>
        </div>

      </div>
    </DashboardLayout>
  );
};

export default CEODashboard;
