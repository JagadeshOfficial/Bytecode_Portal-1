'use client';

import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import StatsCard from '@/components/dashboard/StatsCard';
import SectionHeader from '@/components/dashboard/SectionHeader';
import { 
  Users, 
  PhoneCall, 
  Calendar, 
  UserPlus, 
  ArrowRight,
  MoreHorizontal,
  Clock,
  Sparkles,
  CheckCircle2,
  Phone,
  MessageSquare
} from 'lucide-react';
import { motion } from 'framer-motion';

const CounsellorDashboard = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-10">
        
        <SectionHeader 
          title="Admissions Terminal"
          subtitle="Manage your lead pipeline, schedule follow-ups, and track conversions."
          icon={PhoneCall}
          badge="SENIOR COUNSELLOR"
          actionLabel="Add Lead"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard 
            title="Assigned Leads" 
            value="42" 
            icon={Users} 
            color="indigo" 
            trend="+5 today"
            delay={0.1}
          />
          <StatsCard 
            title="Follow-ups" 
            value="12" 
            icon={Calendar} 
            color="amber" 
            trend="Due today"
            delay={0.2}
          />
          <StatsCard 
            title="Admissions" 
            value="8" 
            icon={UserPlus} 
            color="emerald" 
            trend="₹1.8L value"
            delay={0.3}
          />
          <StatsCard 
            title="Avg. Call Time" 
            value="4.5m" 
            icon={PhoneCall} 
            color="purple" 
            trend="Stable"
            delay={0.4}
          />
        </div>

        {/* --- ADMISSIONS HUD --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           
           {/* Lead Pipeline */}
           <div className="lg:col-span-2 bg-white rounded-[2rem] border border-slate-100 p-8 shadow-sm">
              <div className="flex items-center justify-between mb-10">
                 <h3 className="text-xl font-black text-slate-900 tracking-tight">Active Lead Pipeline</h3>
                 <div className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Live Conversion
                 </div>
              </div>

              <div className="grid grid-cols-4 gap-4 mb-10">
                 {[
                   { label: 'NEW', count: 18, color: 'bg-indigo-500' },
                   { label: 'CONTACTED', count: 12, color: 'bg-cyan-500' },
                   { label: 'DEMO', count: 8, color: 'bg-amber-500' },
                   { label: 'HOT', count: 4, color: 'bg-rose-500' },
                 ].map((step, i) => (
                   <div key={i} className="bg-slate-50/50 rounded-2xl p-4 text-center border border-slate-100 hover:bg-white hover:shadow-xl transition-all group cursor-pointer">
                      <p className="text-[10px] font-black text-slate-400 mb-2">{step.label}</p>
                      <h4 className="text-2xl font-black text-slate-900">{step.count}</h4>
                      <div className={`h-1 w-6 ${step.color} mx-auto mt-3 rounded-full opacity-30 group-hover:opacity-100 transition-opacity`} />
                   </div>
                 ))}
              </div>

              <div className="space-y-4">
                 {[
                   { name: 'Arjun Mehra', status: 'HOT', course: 'Java Fullstack', time: '10m ago' },
                   { name: 'Sneha Kapur', status: 'DEMO', course: 'Data Science', time: '2h ago' },
                   { name: 'Rohan Gupta', status: 'NEW', course: 'Cloud Ops', time: '4h ago' },
                 ].map((lead, i) => (
                   <div key={i} className="flex items-center justify-between p-5 bg-white border border-slate-100 rounded-2xl group hover:border-indigo-200 hover:shadow-lg transition-all cursor-pointer">
                      <div className="flex items-center gap-4">
                         <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center font-black text-slate-500 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                            {lead.name[0]}
                         </div>
                         <div>
                            <p className="font-bold text-slate-900 text-sm">{lead.name}</p>
                            <p className="text-[10px] text-slate-500 font-medium">{lead.course}</p>
                         </div>
                      </div>
                      <div className="flex items-center gap-6">
                         <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                            lead.status === 'HOT' ? 'bg-rose-50 text-rose-600' : lead.status === 'DEMO' ? 'bg-amber-50 text-amber-600' : 'bg-indigo-50 text-indigo-600'
                         }`}>
                            {lead.status}
                         </span>
                         <button className="p-2 text-slate-300 hover:text-indigo-600 transition-colors">
                            <ArrowRight size={18} />
                         </button>
                      </div>
                   </div>
                 ))}
              </div>
           </div>

           {/* Follow-up Scheduler */}
           <div className="space-y-6">
              <div className="bg-slate-900 rounded-[2rem] p-8 text-white shadow-xl relative overflow-hidden group">
                 <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 blur-[60px]" />
                 <h3 className="text-xl font-black mb-2 flex items-center gap-2">
                    <Clock size={20} className="text-indigo-400" />
                    Due Today
                 </h3>
                 <p className="text-slate-400 text-xs font-medium mb-10">High priority follow-ups required</p>
                 
                 <div className="space-y-6">
                    {[
                      { name: 'Kunal Verma', time: '11:30 AM', action: 'Call' },
                      { name: 'Riya Das', time: '02:00 PM', action: 'Demo' },
                    ].map((task, i) => (
                      <div key={i} className="flex items-center justify-between group/task">
                         <div>
                            <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1">{task.time}</p>
                            <p className="text-sm font-bold text-white group-hover/task:text-indigo-300 transition-colors">{task.name}</p>
                         </div>
                         <div className="flex gap-2">
                            <button className="p-2 rounded-lg bg-white/5 border border-white/10 hover:bg-indigo-500 transition-all">
                               <Phone size={14} />
                            </button>
                         </div>
                      </div>
                    ))}
                 </div>

                 <button className="w-full mt-12 py-3 bg-white text-slate-900 rounded-xl font-black text-xs hover:scale-105 transition-transform shadow-xl">
                    Launch Call Queue
                 </button>
              </div>

              <div className="bg-white border border-slate-100 rounded-[2rem] p-8 shadow-sm text-center">
                 <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-6 relative">
                    <Sparkles className="text-indigo-600" size={24} />
                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-indigo-600 text-white rounded-full flex items-center justify-center font-black text-[9px]">#1</div>
                 </div>
                 <h4 className="text-lg font-black text-slate-900 tracking-tight">Performance Streak</h4>
                 <p className="text-slate-500 font-medium text-xs mt-2 mb-8">You are 124% above the monthly counseling average.</p>
                 <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <motion.div 
                       initial={{ width: 0 }}
                       animate={{ width: '85%' }}
                       className="h-full bg-indigo-600"
                    />
                 </div>
              </div>
           </div>
        </div>

      </div>
    </DashboardLayout>
  );
};

export default CounsellorDashboard;
