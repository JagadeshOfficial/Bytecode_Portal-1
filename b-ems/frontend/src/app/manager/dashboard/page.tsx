'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';
import DashboardLayout from '@/components/layout/DashboardLayout';
import StatsCard from '@/components/dashboard/StatsCard';
import SectionHeader from '@/components/dashboard/SectionHeader';
import { 
  Users, 
  UserCheck, 
  Clock, 
  TrendingUp, 
  Plus, 
  Upload, 
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Calendar,
  Layers,
  ArrowRightCircle,
  Search,
  Filter,
  Briefcase
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ManagerDashboard = () => {
  const [loading, setLoading] = useState(true);
  const { token, user } = useAuth();

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-12 pb-20">
        
        {/* --- HEADER SECTION --- */}
        <SectionHeader 
          title="Administrative Command"
          subtitle="Daily institute operations and team resource management."
          icon={Briefcase}
          badge="BRANCH MANAGER ACCESS"
          actionLabel="Quick Batch Add"
          onAction={() => console.log('Adding batch...')}
        />

        {/* --- OPERATIONAL STATS --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <StatsCard 
            title="Total Students" 
            value="1,240" 
            icon={Users} 
            color="indigo" 
            trend="+12% this week"
            delay={0.1}
          />
          <StatsCard 
            title="Attendance Rate" 
            value="94.2%" 
            icon={CheckCircle2} 
            color="emerald" 
            trend="Above Target"
            delay={0.2}
          />
          <StatsCard 
            title="Active Batches" 
            value="42" 
            icon={Layers} 
            color="purple" 
            trend="+3 vs last mo"
            delay={0.3}
          />
          <StatsCard 
            title="Pending Inquiries" 
            value="156" 
            icon={Clock} 
            color="amber" 
            trend="Needs Attention"
            trendUp={false}
            delay={0.4}
          />
        </div>

        {/* --- TEAM & TASK MONITORING --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Active Teams Panel */}
          <div className="lg:col-span-2 bg-white border border-slate-100 rounded-[2.5rem] p-10 shadow-sm relative overflow-hidden group">
            <div className="flex items-center justify-between mb-10">
               <div>
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight">Lead Distribution Control</h3>
                  <p className="text-slate-500 font-medium text-sm">Real-time traffic flow across counsellor nodes</p>
               </div>
               <button className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl font-bold text-xs hover:bg-indigo-100 transition-all border border-indigo-100">
                  <RefreshCw size={14} /> Run Round Robin
               </button>
            </div>

            <div className="space-y-6">
               {[
                 { name: 'Counselling Team A', assigned: 45, load: 85, color: 'bg-indigo-600' },
                 { name: 'Counselling Team B', assigned: 38, load: 70, color: 'bg-purple-500' },
                 { name: 'Direct Admissions', assigned: 72, load: 95, color: 'bg-emerald-500' },
                 { name: 'Scholarship Intake', assigned: 24, load: 40, color: 'bg-cyan-500' },
               ].map((team, i) => (
                 <div key={i} className="flex items-center gap-6 p-4 hover:bg-slate-50 rounded-2xl transition-all border border-transparent hover:border-slate-100">
                    <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center font-black text-slate-500">
                       {team.name[0]}
                    </div>
                    <div className="flex-1 space-y-2">
                       <div className="flex justify-between items-end">
                          <span className="text-sm font-bold text-slate-900">{team.name}</span>
                          <span className="text-xs font-black text-slate-500">{team.assigned} Leads</span>
                       </div>
                       <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                          <motion.div 
                             initial={{ width: 0 }}
                             animate={{ width: `${team.load}%` }}
                             className={`h-full ${team.color} rounded-full`}
                          />
                       </div>
                    </div>
                    <div className="text-right">
                       <span className={`text-[10px] font-black px-2 py-1 rounded-md ${team.load > 90 ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600'}`}>
                          {team.load > 90 ? 'OVERLOAD' : 'STABLE'}
                       </span>
                    </div>
                 </div>
               ))}
            </div>
          </div>

          {/* Timetable / Calendar Highlights */}
          <div className="lg:col-span-1 bg-white border border-slate-100 rounded-[2.5rem] p-10 shadow-sm flex flex-col">
             <h3 className="text-2xl font-black text-slate-900 tracking-tight mb-2">Operational Alerts</h3>
             <p className="text-slate-500 font-medium text-sm mb-10">Critical events for today</p>

             <div className="space-y-6 flex-1">
                {[
                  { time: '10:00 AM', event: 'Java Fullstack Batch A Starts', type: 'batch' },
                  { time: '01:30 PM', event: 'Team Sync: Admissions Target', type: 'meeting' },
                  { time: '04:00 PM', event: 'Infrastructure Audit: Labs', type: 'task' },
                  { time: '06:00 PM', event: 'Demo Session: Cloud Ops', type: 'demo' },
                ].map((item, i) => (
                  <div key={i} className="flex gap-4 group">
                     <div className="flex flex-col items-center">
                        <div className="w-2 h-2 rounded-full bg-indigo-600 group-hover:scale-150 transition-transform shadow-[0_0_8px_rgba(99,102,241,0.6)]" />
                        <div className="w-[1px] flex-1 bg-slate-100 my-1" />
                     </div>
                     <div className="pb-6">
                        <p className="text-[10px] font-black text-indigo-500 tracking-widest leading-none mb-2">{item.time}</p>
                        <p className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors leading-tight">{item.event}</p>
                     </div>
                  </div>
                ))}
             </div>

             <button className="w-full mt-8 py-4 bg-slate-50 rounded-2xl text-slate-600 font-black text-sm hover:bg-slate-100 transition-all flex items-center justify-center gap-2 border border-slate-100">
                <Calendar size={18} /> Full Operations Calendar
             </button>
          </div>
        </div>

        {/* --- STUDENT TABLE --- */}
        <div className="bg-white border border-slate-100 rounded-[2.5rem] overflow-hidden shadow-sm">
           <div className="p-10 border-b border-slate-50 flex items-center justify-between">
              <div>
                 <h3 className="text-2xl font-black text-slate-900 tracking-tight">Admission & Batch Roster</h3>
                 <p className="text-slate-500 font-medium text-sm">Managing active students across all technological domains</p>
              </div>
              <div className="flex gap-4">
                 <div className="flex items-center gap-3 bg-slate-50 px-4 py-2.5 rounded-2xl border border-slate-100">
                    <Search size={18} className="text-slate-400" />
                    <input type="text" placeholder="Quick find student..." className="bg-transparent border-none outline-none text-sm font-bold w-48" />
                 </div>
                 <button className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white rounded-2xl font-bold text-sm shadow-lg shadow-indigo-100">
                    <Plus size={18} /> New Admission
                 </button>
              </div>
           </div>

           <div className="overflow-x-auto">
              <table className="w-full">
                 <thead className="bg-slate-50">
                    <tr>
                       {['Student ID', 'Full Name', 'Domain', 'Batch Code', 'Attendance', 'Status'].map(h => (
                         <th key={h} className="px-10 py-5 text-left text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">{h}</th>
                       ))}
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-50">
                    {[
                      { id: 'BT-101', name: 'Rahul Sharma', domain: 'Fullstack Dev', batch: 'FS-JULY-A', att: '98%', status: 'Active' },
                      { id: 'BT-102', name: 'Priya Singh', domain: 'Data Science', batch: 'DS-JUNE-B', att: '85%', status: 'Active' },
                      { id: 'BT-103', name: 'Amit Verma', domain: 'Cloud Ops', batch: 'CL-MAY-C', att: '92%', status: 'Leave' },
                      { id: 'BT-104', name: 'Sneha Reddy', domain: 'Cyber Security', batch: 'CY-JULY-A', att: '100%', status: 'Active' },
                      { id: 'BT-105', name: 'Vikram Das', domain: 'UI/UX Design', batch: 'UX-AUG-A', att: '76%', status: 'Warning' },
                    ].map((row, i) => (
                      <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                         <td className="px-10 py-6 text-sm font-mono font-bold text-slate-400">{row.id}</td>
                         <td className="px-10 py-6 text-sm font-bold text-slate-900">{row.name}</td>
                         <td className="px-10 py-6 text-sm font-bold text-indigo-600">{row.domain}</td>
                         <td className="px-10 py-6 text-sm font-medium text-slate-500">{row.batch}</td>
                         <td className="px-10 py-6">
                            <div className="flex items-center gap-3">
                               <div className="flex-1 w-20 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: row.att }} />
                               </div>
                               <span className="text-[10px] font-black text-slate-900">{row.att}</span>
                            </div>
                         </td>
                         <td className="px-10 py-6">
                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                               row.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 
                               row.status === 'Leave' ? 'bg-indigo-50 text-indigo-600' : 'bg-rose-50 text-rose-600'
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

      </div>
    </DashboardLayout>
  );
};

export default ManagerDashboard;
