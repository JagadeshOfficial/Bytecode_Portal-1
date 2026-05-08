'use client';

import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import SectionHeader from '@/components/dashboard/SectionHeader';
import StatsCard from '@/components/dashboard/StatsCard';
import { 
  Layers, 
  Users, 
  GraduationCap, 
  CreditCard, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  MoreVertical,
  ArrowRight,
  Plus,
  Calendar,
  Activity,
  ChevronRight,
  TrendingUp,
  Target
} from 'lucide-react';
import { motion } from 'framer-motion';

const ManagerDashboard = () => {
  return (
    <DashboardLayout>
      <div className="space-y-10 pb-20">
        
        <SectionHeader 
          title="Operational Command"
          subtitle="Real-time branch management, academic tracking, and team orchestration."
          icon={Layers}
          badge="BRANCH MANAGER"
          actionLabel="Add Enrollment"
        />

        {/* --- PERFORMANCE HUB --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard 
            title="Total Students" 
            value="1,412" 
            icon={GraduationCap} 
            color="indigo" 
            trend="+12% growth"
          />
          <StatsCard 
            title="Active Batches" 
            value="38" 
            icon={Layers} 
            color="purple" 
            trend="4 finishing"
          />
          <StatsCard 
            title="Attendance Avg" 
            value="92.4%" 
            icon={CheckCircle2} 
            color="emerald" 
            trend="Peak hours"
          />
          <StatsCard 
            title="Revenue Goal" 
            value="78%" 
            icon={Target} 
            color="amber" 
            trend="₹2.4L to go"
          />
        </div>

        {/* --- OPERATIONAL GRID --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
           
           {/* Batch Live Monitoring */}
           <div className="lg:col-span-8 bg-white border border-slate-100 rounded-[2.5rem] overflow-hidden shadow-sm">
              <div className="p-10 border-b border-slate-50 flex items-center justify-between">
                 <div>
                    <h3 className="text-2xl font-black text-slate-900 tracking-tight">Active Batch Roadmap</h3>
                    <p className="text-slate-500 font-medium text-sm">Real-time status of ongoing technical modules</p>
                 </div>
                 <button className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-2xl font-black text-xs shadow-lg shadow-indigo-100 hover:scale-105 transition-all">
                    <Plus size={16} /> New Batch Node
                 </button>
              </div>

              <div className="overflow-x-auto">
                 <table className="w-full">
                    <thead className="bg-slate-50/50">
                       <tr>
                          {['Batch Entity', 'Lead Trainer', 'Student Load', 'Schedule', 'Health', 'Actions'].map((h) => (
                            <th key={h} className="px-10 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{h}</th>
                          ))}
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                       {[
                         { name: 'Java FS #24', trainer: 'P. Sharma', load: '24/30', schedule: '10 AM - 12 PM', health: 92, status: 'Active' },
                         { name: 'Python AI #09', trainer: 'R. Verma', load: '18/20', schedule: '02 PM - 04 PM', health: 88, status: 'Active' },
                         { name: 'React Node #11', trainer: 'S. Gupta', load: '12/25', schedule: '05 PM - 07 PM', health: 74, status: 'Delayed' },
                         { name: 'Cloud Ops #04', trainer: 'K. Mehra', load: '15/15', schedule: 'Weekend Only', health: 100, status: 'Closing' },
                       ].map((batch, i) => (
                         <tr key={i} className="hover:bg-slate-50/50 transition-all cursor-pointer group">
                            <td className="px-10 py-6">
                               <div className="flex flex-col">
                                  <span className="text-sm font-black text-slate-900 group-hover:text-indigo-600 transition-colors">{batch.name}</span>
                                  <span className="text-[10px] font-black text-slate-400 tracking-tighter uppercase">ID: BTC-{100+i}</span>
                               </div>
                            </td>
                            <td className="px-10 py-6 text-sm font-bold text-slate-600">{batch.trainer}</td>
                            <td className="px-10 py-6">
                               <div className="flex flex-col gap-1.5">
                                  <span className="text-xs font-black text-slate-900">{batch.load}</span>
                                  <div className="h-1 w-20 bg-slate-100 rounded-full overflow-hidden">
                                     <div className="h-full bg-indigo-500" style={{ width: `${(parseInt(batch.load)/30)*100}%` }} />
                                  </div>
                               </div>
                            </td>
                            <td className="px-10 py-6">
                               <div className="flex items-center gap-2 text-slate-500">
                                  <Clock size={14} />
                                  <span className="text-[10px] font-black uppercase tracking-tight">{batch.schedule}</span>
                               </div>
                            </td>
                            <td className="px-10 py-6">
                               <div className="flex items-center gap-3">
                                  <span className={`w-2 h-2 rounded-full ${batch.health > 80 ? 'bg-emerald-500' : batch.health > 70 ? 'bg-amber-500' : 'bg-rose-500'}`} />
                                  <span className="text-xs font-black text-slate-900">{batch.health}%</span>
                               </div>
                            </td>
                            <td className="px-10 py-6">
                               <button className="p-2 text-slate-300 hover:text-indigo-600 transition-colors">
                                  <ArrowRight size={18} />
                               </button>
                            </td>
                         </tr>
                       ))}
                    </tbody>
                 </table>
              </div>
           </div>

           {/* Branch Vital Panel */}
           <div className="lg:col-span-4 space-y-8">
              <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden group">
                 <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:rotate-12 transition-transform duration-700">
                    <Activity size={100} />
                 </div>
                 <h3 className="text-xl font-black mb-8 flex items-center gap-3">
                    <TrendingUp className="text-indigo-400" size={24} />
                    Conversion Vitals
                 </h3>
                 <div className="space-y-8 relative z-10">
                    {[
                      { label: 'Lead Velocity', val: '84%', color: 'bg-indigo-500' },
                      { label: 'Demo Success', val: '62%', color: 'bg-purple-500' },
                      { label: 'Fee Collection', val: '91%', color: 'bg-emerald-500' },
                    ].map((vital, i) => (
                      <div key={i}>
                         <div className="flex justify-between text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-3">
                            <span>{vital.label}</span>
                            <span className="text-white">{vital.val}</span>
                         </div>
                         <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                            <motion.div 
                               initial={{ width: 0 }}
                               animate={{ width: vital.val }}
                               transition={{ duration: 1.5, delay: i * 0.2 }}
                               className={`h-full ${vital.color} shadow-[0_0_12px_rgba(255,255,255,0.1)]`}
                            />
                         </div>
                      </div>
                    ))}
                 </div>
                 <button className="w-full mt-10 py-4 bg-white text-slate-900 rounded-2xl font-black text-xs hover:scale-[1.02] transition-transform">
                    View CRM Depth
                 </button>
              </div>

              <div className="bg-white border border-slate-100 rounded-[2.5rem] p-10 shadow-sm relative overflow-hidden">
                 <h3 className="text-xl font-black text-slate-900 mb-8 tracking-tight">Today's Schedule</h3>
                 <div className="space-y-6">
                    {[
                      { time: '10:00 AM', title: 'Trainer Sync-up', type: 'internal' },
                      { time: '12:30 PM', title: 'Fee Review Call', type: 'finance' },
                      { time: '03:00 PM', title: 'Demo: Java #24', type: 'academic' },
                    ].map((task, i) => (
                      <div key={i} className="flex gap-4 group cursor-pointer">
                         <div className="flex flex-col items-center">
                            <div className="w-2.5 h-2.5 rounded-full bg-indigo-500 shadow-[0_0_10px_rgba(79,70,229,0.3)]" />
                            {i < 2 && <div className="w-[1.5px] flex-1 bg-slate-100 my-1" />}
                         </div>
                         <div>
                            <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest leading-none mb-1">{task.time}</p>
                            <p className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{task.title}</p>
                         </div>
                      </div>
                    ))}
                 </div>
                 <button className="w-full mt-8 py-3 border-2 border-dashed border-slate-100 rounded-2xl text-slate-400 font-bold text-xs hover:text-indigo-600 hover:border-indigo-100 transition-all">
                    Full Calendar Node
                 </button>
              </div>
           </div>
        </div>

      </div>
    </DashboardLayout>
  );
};

export default ManagerDashboard;
