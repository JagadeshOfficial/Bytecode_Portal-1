'use client';

import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import StatsCard from '@/components/dashboard/StatsCard';
import SectionHeader from '@/components/dashboard/SectionHeader';
import { 
  Users, 
  Layers, 
  Calendar, 
  BarChart3, 
  Search, 
  Plus, 
  MoreHorizontal,
  Clock,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { motion } from 'framer-motion';

const ManagerDashboard = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-10">
        
        <SectionHeader 
          title="Operations Management"
          subtitle="Oversee branch activities, batch schedules, and team performance."
          icon={Layers}
          badge="BRANCH MANAGER"
          actionLabel="New Batch"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard 
            title="Total Students" 
            value="412" 
            icon={Users} 
            color="indigo" 
            trend="+12 this month"
            delay={0.1}
          />
          <StatsCard 
            title="Active Batches" 
            value="18" 
            icon={Layers} 
            color="purple" 
            trend="4 ending soon"
            delay={0.2}
          />
          <StatsCard 
            title="Daily Attendance" 
            value="94%" 
            icon={CheckCircle2} 
            color="emerald" 
            trend="Peak performance"
            delay={0.3}
          />
          <StatsCard 
            title="Pending Fees" 
            value="₹2.4L" 
            icon={BarChart3} 
            color="rose" 
            trend="Requires attention"
            delay={0.4}
          />
        </div>

        {/* --- OPERATIONAL HUD --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
           
           {/* Batch Status Table */}
           <div className="lg:col-span-8 bg-white border border-slate-100 rounded-[2rem] overflow-hidden shadow-sm">
              <div className="p-8 border-b border-slate-50 flex items-center justify-between">
                 <h3 className="text-xl font-black text-slate-900 tracking-tight">Live Batch Monitoring</h3>
                 <div className="flex gap-2">
                    <button className="p-2 bg-slate-50 rounded-lg text-slate-400 hover:text-indigo-600 transition-colors">
                       <Search size={16} />
                    </button>
                    <button className="p-2 bg-slate-50 rounded-lg text-slate-400 hover:text-indigo-600 transition-colors">
                       <Plus size={16} />
                    </button>
                 </div>
              </div>

              <div className="overflow-x-auto">
                 <table className="w-full">
                    <thead className="bg-slate-50/50">
                       <tr>
                          {['Batch Name', 'Trainer', 'Students', 'Status', 'Actions'].map((h) => (
                            <th key={h} className="px-8 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">{h}</th>
                          ))}
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                       {[
                         { name: 'Java Fullstack #12', trainer: 'P. Sharma', count: 24, status: 'Active' },
                         { name: 'Python DS #4', trainer: 'R. Verma', count: 18, status: 'Active' },
                         { name: 'React Advanced', trainer: 'S. Gupta', count: 22, status: 'Pending' },
                         { name: 'Cloud Ops #1', trainer: 'K. Mehra', count: 12, status: 'Closing' },
                       ].map((batch, i) => (
                         <tr key={i} className="hover:bg-slate-50/50 transition-colors group">
                            <td className="px-8 py-5 text-sm font-bold text-slate-900">{batch.name}</td>
                            <td className="px-8 py-5 text-sm font-medium text-slate-500">{batch.trainer}</td>
                            <td className="px-8 py-5 text-sm font-black text-slate-900">{batch.count}</td>
                            <td className="px-8 py-5">
                               <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                                 batch.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 
                                 batch.status === 'Pending' ? 'bg-amber-50 text-amber-600' : 'bg-indigo-50 text-indigo-600'
                               }`}>
                                  {batch.status}
                               </span>
                            </td>
                            <td className="px-8 py-5">
                               <button className="p-2 text-slate-300 hover:text-indigo-600 transition-colors">
                                  <MoreHorizontal size={18} />
                                </button>
                            </td>
                         </tr>
                       ))}
                    </tbody>
                 </table>
              </div>
           </div>

           {/* Daily Schedule Sidepanel */}
           <div className="lg:col-span-4 space-y-6">
              <div className="bg-slate-900 rounded-[2rem] p-8 text-white shadow-xl relative overflow-hidden">
                 <div className="absolute top-0 right-0 p-8 opacity-10">
                    <Clock size={80} />
                 </div>
                 <h3 className="text-xl font-black mb-6 flex items-center gap-2">
                    <Clock size={20} className="text-indigo-400" />
                    Today's Roadmap
                 </h3>
                 <div className="space-y-6 relative z-10">
                    {[
                      { time: '10:00 AM', title: 'Trainer Meetup', type: 'internal' },
                      { time: '12:30 PM', title: 'Fee Review', type: 'finance' },
                      { time: '04:00 PM', title: 'Batch Allotment', type: 'ops' },
                    ].map((task, i) => (
                      <div key={i} className="flex gap-4 group/task cursor-pointer">
                         <div className="flex flex-col items-center">
                            <div className="w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]" />
                            {i < 2 && <div className="w-[1px] flex-1 bg-slate-700 my-1" />}
                         </div>
                         <div>
                            <p className="text-[10px] font-black text-indigo-400 tracking-widest uppercase">{task.time}</p>
                            <p className="text-sm font-bold text-white group-hover/task:text-indigo-300 transition-colors">{task.title}</p>
                         </div>
                      </div>
                    ))}
                 </div>
                 <button className="w-full mt-10 py-3 bg-white/10 hover:bg-white/20 border border-white/10 rounded-xl text-white font-black text-xs transition-all">
                    Full Timetable
                 </button>
              </div>

              <div className="bg-indigo-600 rounded-[2rem] p-8 text-white shadow-xl">
                 <div className="flex items-center justify-between mb-4">
                    <AlertCircle size={24} />
                    <span className="text-[10px] font-black bg-white/20 px-2 py-1 rounded">PRIORITY</span>
                 </div>
                 <h4 className="text-lg font-black mb-2">4 Fee Dues Today</h4>
                 <p className="text-indigo-100 text-xs font-medium mb-6">Automated reminders have been sent to students.</p>
                 <button className="w-full py-3 bg-white text-indigo-600 rounded-xl font-black text-xs hover:bg-indigo-50 transition-colors">
                    Manage Collection
                 </button>
              </div>
           </div>
        </div>

      </div>
    </DashboardLayout>
  );
};

export default ManagerDashboard;
