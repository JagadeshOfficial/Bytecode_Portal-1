'use client';

import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import SectionHeader from '@/components/dashboard/SectionHeader';
import StatsCard from '@/components/dashboard/StatsCard';
import { 
  Users, 
  Target, 
  Calendar, 
  PhoneCall, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  Plus,
  Search,
  ChevronRight,
  MessageSquare,
  TrendingUp,
  Award,
  Zap,
  Activity
} from 'lucide-react';
import { motion } from 'framer-motion';

const CounsellorDashboard = () => {
  return (
    <DashboardLayout>
      <div className="space-y-10 pb-20">
        
        <SectionHeader 
          title="Admissions Intelligence"
          subtitle="Transform inquiries into enrollments with high-velocity lead management."
          icon={PhoneCall}
          badge="ADMISSIONS NODE"
          actionLabel="New Inquiry"
        />

        {/* --- PERFORMANCE SNAPSHOT --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard 
            title="Total Leads" 
            value="312" 
            icon={Users} 
            color="indigo" 
            trend="+18 this week"
          />
          <StatsCard 
            title="Conversions" 
            value="24" 
            icon={Award} 
            color="emerald" 
            trend="₹4.2L revenue"
          />
          <StatsCard 
            title="Due Follow-ups" 
            value="14" 
            icon={Calendar} 
            color="amber" 
            trend="Needs priority"
          />
          <StatsCard 
            title="Efficiency Score" 
            value="94%" 
            icon={CheckCircle2} 
            color="purple" 
            trend="Top percentile"
          />
        </div>

        {/* --- PIPELINE VISUALIZATION --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
           
           {/* Active Pipeline Grid */}
           <div className="lg:col-span-8 space-y-8">
              <div className="bg-white border border-slate-100 rounded-[2.5rem] p-10 shadow-sm relative overflow-hidden group">
                 <div className="flex items-center justify-between mb-12">
                    <h3 className="text-2xl font-black text-slate-900 tracking-tight">Lead Distribution</h3>
                    <button className="text-indigo-600 font-bold text-xs flex items-center gap-1 hover:gap-2 transition-all">
                       Full Pipeline <ChevronRight size={14} />
                    </button>
                 </div>

                 <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {[
                      { label: 'New Nodes', count: 124, color: 'bg-indigo-600', icon: Zap },
                      { label: 'Follow-ups', count: 86, color: 'bg-amber-500', icon: Clock },
                      { label: 'Demos Held', count: 42, color: 'bg-purple-600', icon: Activity },
                      { label: 'Closed/Won', count: 60, color: 'bg-emerald-600', icon: CheckCircle2 },
                    ].map((step, i) => (
                      <div key={i} className="bg-slate-50/50 border border-slate-100 p-6 rounded-[2rem] hover:bg-white hover:shadow-xl hover:-translate-y-1 transition-all group/card cursor-pointer">
                         <div className={`w-10 h-10 ${step.color} text-white rounded-xl flex items-center justify-center mb-6 shadow-lg shadow-black/5`}>
                            <step.icon size={20} />
                         </div>
                         <h4 className="text-3xl font-black text-slate-900 mb-1">{step.count}</h4>
                         <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">{step.label}</p>
                      </div>
                    ))}
                 </div>
              </div>

              {/* Recent Inquiries List */}
              <div className="bg-white border border-slate-100 rounded-[2.5rem] overflow-hidden shadow-sm">
                 <div className="p-10 border-b border-slate-50 flex items-center justify-between">
                    <h3 className="text-2xl font-black text-slate-900 tracking-tight">Active Inquiries</h3>
                    <div className="flex gap-4">
                       <div className="relative group">
                          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                          <input 
                            type="text" 
                            placeholder="Find leads..." 
                            className="pl-11 pr-6 py-2.5 bg-slate-50 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-100 border border-transparent focus:border-indigo-100" 
                          />
                       </div>
                    </div>
                 </div>
                 <div className="divide-y divide-slate-50">
                    {[
                      { name: 'Arjun Mehra', course: 'Java Fullstack', source: 'Google Ads', status: 'HOT', time: '12m ago' },
                      { name: 'Sana Khan', course: 'Data Science', source: 'Website', status: 'NEW', time: '1h ago' },
                      { name: 'Vikram Singh', course: 'Cloud Computing', source: 'Referral', status: 'FOLLOW_UP', time: '3h ago' },
                      { name: 'Ananya Rao', course: 'UI/UX Design', source: 'Instagram', status: 'DEMO', time: '5h ago' },
                    ].map((lead, i) => (
                      <div key={i} className="px-10 py-6 flex items-center justify-between hover:bg-slate-50/50 transition-all group cursor-pointer">
                         <div className="flex items-center gap-5">
                            <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center font-black text-indigo-600 shadow-sm border border-indigo-100/50 group-hover:scale-110 transition-transform">
                               {lead.name[0]}
                            </div>
                            <div>
                               <p className="text-sm font-black text-slate-900">{lead.name}</p>
                               <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">{lead.course} • {lead.source}</p>
                            </div>
                         </div>
                         <div className="flex items-center gap-8">
                            <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${
                               lead.status === 'HOT' ? 'bg-rose-50 text-rose-600' : 
                               lead.status === 'NEW' ? 'bg-indigo-50 text-indigo-600' : 
                               lead.status === 'DEMO' ? 'bg-purple-50 text-purple-600' : 'bg-amber-50 text-amber-600'
                            }`}>
                               {lead.status}
                            </span>
                            <div className="text-right">
                               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{lead.time}</p>
                               <button className="p-2 text-slate-300 hover:text-indigo-600 transition-colors">
                                  <ArrowRight size={18} />
                               </button>
                            </div>
                         </div>
                      </div>
                    ))}
                 </div>
              </div>
           </div>

           {/* Personal Sidepanel */}
           <div className="lg:col-span-4 space-y-8">
              <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden group">
                 <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:scale-125 transition-transform duration-1000">
                    <TrendingUp size={120} />
                 </div>
                 <h3 className="text-xl font-black mb-8 flex items-center gap-3">
                    <Target className="text-indigo-400" size={24} />
                    Daily Targets
                 </h3>
                 <div className="space-y-8 relative z-10">
                    {[
                      { label: 'Follow-ups', val: '12/15', color: 'bg-indigo-500' },
                      { label: 'Demos Booked', val: '4/5', color: 'bg-purple-500' },
                      { label: 'Conversions', val: '2/3', color: 'bg-emerald-500' },
                    ].map((target, i) => (
                      <div key={i}>
                         <div className="flex justify-between text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-3">
                            <span>{target.label}</span>
                            <span className="text-white">{target.val}</span>
                         </div>
                         <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                            <motion.div 
                               initial={{ width: 0 }}
                               animate={{ width: `${(parseInt(target.val.split('/')[0]) / parseInt(target.val.split('/')[1])) * 100}%` }}
                               transition={{ duration: 1.5, delay: i * 0.2 }}
                               className={`h-full ${target.color} shadow-[0_0_12px_rgba(255,255,255,0.1)]`}
                            />
                         </div>
                      </div>
                    ))}
                 </div>
                 <button className="w-full mt-10 py-4 bg-white text-slate-900 rounded-2xl font-black text-xs hover:scale-[1.02] transition-transform">
                    Unlock Performance Bonus
                 </button>
              </div>

              <div className="bg-indigo-600 rounded-[2.5rem] p-10 text-white shadow-xl relative overflow-hidden group">
                 <div className="absolute -bottom-4 -right-4 p-8 opacity-20">
                    <MessageSquare size={100} />
                 </div>
                 <h3 className="text-xl font-black mb-6">Upcoming Meetings</h3>
                 <div className="space-y-6">
                    {[
                      { name: 'Kunal Verma', time: '11:30 AM', task: 'Fee Negotiation' },
                      { name: 'Riya Das', time: '04:00 PM', task: 'Python Demo #4' },
                    ].map((meeting, i) => (
                      <div key={i} className="flex gap-4 items-start">
                         <div className="w-1.5 h-12 bg-white/20 rounded-full" />
                         <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-indigo-200 mb-1">{meeting.time}</p>
                            <p className="text-sm font-bold">{meeting.name}</p>
                            <p className="text-[10px] font-black uppercase tracking-tighter opacity-70">{meeting.task}</p>
                         </div>
                      </div>
                    ))}
                 </div>
                 <button className="w-full mt-10 py-3.5 bg-black/20 hover:bg-black/30 border border-white/10 rounded-xl text-white font-black text-xs transition-all">
                    Launch Scheduler
                 </button>
              </div>
           </div>
        </div>

      </div>
    </DashboardLayout>
  );
};

export default CounsellorDashboard;
