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
  TrendingUp, 
  MessageSquare,
  Sparkles,
  Clock,
  ArrowRight,
  MoreHorizontal,
  Mail,
  CheckCircle2,
  Phone
} from 'lucide-react';
import { motion } from 'framer-motion';

const CounsellorDashboard = () => {
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
          title="Admissions Hub"
          subtitle="Manage student inquiries, lead pipelines, and daily conversion targets."
          icon={PhoneCall}
          badge="SENIOR COUNSELLOR"
          actionLabel="Add Inquiry"
          onAction={() => console.log('Adding inquiry...')}
        />

        {/* --- PERFORMANCE STATS --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <StatsCard 
            title="Assigned Leads" 
            value="48" 
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
            title="Conversions" 
            value="9" 
            icon={UserPlus} 
            color="emerald" 
            trend="₹2.4L Value"
            delay={0.3}
          />
          <StatsCard 
            title="Call Time" 
            value="4.2h" 
            icon={PhoneCall} 
            color="purple" 
            trend="Above average"
            delay={0.4}
          />
        </div>

        {/* --- PIPELINE & PIPELINE --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           
           {/* Lead Pipeline HUD */}
           <div className="lg:col-span-2 space-y-8">
              <div className="bg-white border border-slate-100 rounded-[2.5rem] p-10 shadow-sm relative overflow-hidden">
                 <div className="flex items-center justify-between mb-10">
                    <h3 className="text-2xl font-black text-slate-900 tracking-tight">Active Lead Pipeline</h3>
                    <div className="flex items-center gap-2">
                       <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                       <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Live Updates</span>
                    </div>
                 </div>

                 <div className="grid grid-cols-4 gap-4 mb-10">
                    {[
                      { label: 'NEW', count: 18, color: 'bg-indigo-500' },
                      { label: 'CONTACTED', count: 12, color: 'bg-cyan-500' },
                      { label: 'DEMO', count: 8, color: 'bg-amber-500' },
                      { label: 'HOT', count: 5, color: 'bg-rose-500' },
                    ].map((step, i) => (
                      <div key={i} className="bg-slate-50 rounded-2xl p-4 text-center group cursor-pointer hover:bg-white hover:shadow-xl hover:shadow-slate-100 transition-all border border-transparent hover:border-slate-100">
                         <p className="text-[10px] font-black text-slate-400 mb-2">{step.label}</p>
                         <h4 className="text-2xl font-black text-slate-900">{step.count}</h4>
                         <div className={`h-1 w-8 ${step.color} mx-auto mt-3 rounded-full opacity-30 group-hover:opacity-100 transition-opacity`} />
                      </div>
                    ))}
                 </div>

                 <div className="space-y-4">
                    {[
                      { name: 'Arjun Mehra', status: 'HOT', course: 'Java Fullstack', time: '10m ago' },
                      { name: 'Sneha Kapur', status: 'DEMO', course: 'Data Science', time: '2h ago' },
                      { name: 'Rohan Gupta', status: 'NEW', course: 'Cloud Ops', time: '4h ago' },
                    ].map((lead, i) => (
                      <div key={i} className="flex items-center justify-between p-5 bg-white border border-slate-100 rounded-3xl group hover:border-indigo-200 hover:shadow-lg hover:shadow-indigo-50 transition-all cursor-pointer">
                         <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-black text-lg">
                               {lead.name[0]}
                            </div>
                            <div>
                               <p className="font-bold text-slate-900">{lead.name}</p>
                               <p className="text-xs text-slate-500 font-medium">{lead.course}</p>
                            </div>
                         </div>
                         <div className="flex items-center gap-6">
                            <span className="text-[10px] font-black text-slate-400">{lead.time}</span>
                            <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                               lead.status === 'HOT' ? 'bg-rose-50 text-rose-600' : lead.status === 'DEMO' ? 'bg-amber-50 text-amber-600' : 'bg-indigo-50 text-indigo-600'
                            }`}>
                               {lead.status}
                            </span>
                            <button className="p-2.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all">
                               <ArrowRight size={18} />
                            </button>
                         </div>
                      </div>
                    ))}
                 </div>
              </div>
           </div>

           {/* Call Scheduler Sidebar */}
           <div className="lg:col-span-1 space-y-8">
              <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden group">
                 <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/20 blur-[60px]" />
                 <h3 className="text-2xl font-black mb-2 flex items-center gap-2">
                    <Clock size={24} className="text-indigo-400" />
                    Due Today
                 </h3>
                 <p className="text-slate-400 text-sm font-medium mb-10">High priority follow-ups required</p>
                 
                 <div className="space-y-6">
                    {[
                      { name: 'Kunal Verma', time: '11:30 AM', action: 'Call' },
                      { name: 'Riya Das', time: '02:00 PM', action: 'Demo' },
                      { name: 'Vijay Kumar', time: '04:45 PM', action: 'WA Reminder' },
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
                            <button className="p-2 rounded-lg bg-white/5 border border-white/10 hover:bg-emerald-500 transition-all">
                               <MessageSquare size={14} />
                            </button>
                         </div>
                      </div>
                    ))}
                 </div>

                 <button className="w-full mt-12 py-4 bg-white text-black rounded-2xl font-black text-sm hover:scale-105 transition-transform shadow-xl">
                    Open Call Queue
                 </button>
              </div>

              {/* Performance Mini-Card */}
              <div className="bg-white border border-slate-100 rounded-[2.5rem] p-10 shadow-sm text-center">
                 <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-6 relative">
                    <Sparkles className="text-indigo-600" size={32} />
                    <div className="absolute -top-1 -right-1 w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-black text-[10px]">#1</div>
                 </div>
                 <h4 className="text-xl font-black text-slate-900 tracking-tight">Daily Target Met</h4>
                 <p className="text-slate-500 font-medium text-sm mt-2 mb-8">You are 124% above the monthly counseling average.</p>
                 <div className="h-2 w-full bg-slate-50 rounded-full overflow-hidden">
                    <motion.div 
                       initial={{ width: 0 }}
                       animate={{ width: '100%' }}
                       className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
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
