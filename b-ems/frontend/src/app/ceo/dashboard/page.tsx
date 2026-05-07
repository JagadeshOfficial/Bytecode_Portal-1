'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';
import DashboardLayout from '@/components/layout/DashboardLayout';
import StatsCard from '@/components/dashboard/StatsCard';
import SectionHeader from '@/components/dashboard/SectionHeader';
import { 
  TrendingUp, 
  BarChart3, 
  Users, 
  DollarSign, 
  Target, 
  Award,
  ArrowUpRight,
  ArrowDownRight,
  Briefcase,
  GraduationCap,
  Layers,
  Zap,
  Activity,
  Calendar,
  Search,
  Download,
  Filter,
  MoreVertical,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const CEODashboard = () => {
  const [loading, setLoading] = useState(true);
  const { token, user } = useAuth();

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-12 pb-20">
        
        {/* --- HEADER SECTION --- */}
        <SectionHeader 
          title="Executive Command Center"
          subtitle="Strategic oversight and global performance analytics for ByteCode Trainings."
          icon={Zap}
          badge="SUPER ADMIN ACCESS"
          actionLabel="Generate Report"
          onAction={() => console.log('Generating report...')}
        />

        {/* --- CORE ANALYTICS GRID --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <StatsCard 
            title="Total Revenue" 
            value="₹42,85,200" 
            icon={DollarSign} 
            color="emerald" 
            trend="+18.4% vs last mo"
            trendUp={true}
            delay={0.1}
          />
          <StatsCard 
            title="Active Admissions" 
            value="1,482" 
            icon={GraduationCap} 
            color="indigo" 
            trend="+5.2% growth"
            trendUp={true}
            delay={0.2}
          />
          <StatsCard 
            title="Total Employees" 
            value="84" 
            icon={Briefcase} 
            color="purple" 
            trend="Stable"
            trendUp={true}
            delay={0.3}
          />
          <StatsCard 
            title="Lead Conversion" 
            value="24.8%" 
            icon={Target} 
            color="amber" 
            trend="-1.2% variance"
            trendUp={false}
            delay={0.4}
          />
        </div>

        {/* --- SECONDARY STATS --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <StatsCard 
            title="Course Completion" 
            value="92%" 
            icon={CheckCircle2} 
            color="cyan" 
            delay={0.5}
          />
          <StatsCard 
            title="Avg. Lead Response" 
            value="12m" 
            icon={Clock} 
            color="rose" 
            delay={0.6}
          />
          <StatsCard 
            title="Active Batches" 
            value="38" 
            icon={Layers} 
            color="indigo" 
            delay={0.7}
          />
          <StatsCard 
            title="Daily Attendance" 
            value="96.4%" 
            icon={Activity} 
            color="emerald" 
            delay={0.8}
          />
        </div>

        {/* --- GROWTH & PERFORMANCE VISUALS --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Main Chart Placeholder */}
          <div className="lg:col-span-8 bg-white border border-slate-100 rounded-[2.5rem] p-10 shadow-sm relative overflow-hidden group">
            <div className="flex items-center justify-between mb-10">
               <div>
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight">Revenue & Growth Matrix</h3>
                  <p className="text-slate-500 font-medium text-sm">Monthly fiscal performance vs projected targets</p>
               </div>
               <div className="flex gap-2">
                  {['1M', '6M', '1Y', 'ALL'].map(t => (
                    <button key={t} className={`px-4 py-1.5 rounded-xl text-xs font-black transition-all ${t === '6M' ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}>
                       {t}
                    </button>
                  ))}
               </div>
            </div>

            {/* Mock Chart Visualization */}
            <div className="h-[400px] flex items-end gap-3 w-full relative">
               <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-[0.03]">
                  {[1,2,3,4,5].map(i => <div key={i} className="w-full h-[1px] bg-black" />)}
               </div>
               {[60, 85, 45, 95, 75, 110, 80, 105, 90, 120, 100, 130].map((h, i) => (
                 <div key={i} className="flex-1 flex flex-col items-center gap-4 group/bar relative">
                    <motion.div 
                       initial={{ height: 0 }}
                       animate={{ height: `${h * 2.5}px` }}
                       transition={{ duration: 1, delay: i * 0.05 }}
                       className={`w-full rounded-t-2xl relative ${i === 11 ? 'bg-indigo-600 shadow-xl shadow-indigo-200' : 'bg-slate-100 group-hover/bar:bg-slate-200'} transition-all`}
                    >
                       {i === 11 && (
                         <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-black px-2 py-1 rounded-md">
                            ₹1.3M
                         </div>
                       )}
                    </motion.div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{['J','F','M','A','M','J','J','A','S','O','N','D'][i]}</span>
                 </div>
               ))}
            </div>
          </div>

          {/* Department Performance */}
          <div className="lg:col-span-4 bg-white border border-slate-100 rounded-[2.5rem] p-10 shadow-sm">
             <h3 className="text-2xl font-black text-slate-900 tracking-tight mb-2">Department Efficiency</h3>
             <p className="text-slate-500 font-medium text-sm mb-10">Relative output per division</p>

             <div className="space-y-8">
                {[
                  { name: 'Counselling', val: 94, color: 'bg-indigo-600' },
                  { name: 'SEO & Content', val: 78, color: 'bg-cyan-500' },
                  { name: 'Marketing', val: 86, color: 'bg-purple-500' },
                  { name: 'Placements', val: 91, color: 'bg-emerald-500' },
                  { name: 'Technical', val: 82, color: 'bg-amber-500' },
                ].map((dept, i) => (
                  <div key={i} className="space-y-3">
                     <div className="flex justify-between items-end">
                        <span className="text-sm font-bold text-slate-700">{dept.name}</span>
                        <span className="text-sm font-black text-slate-900">{dept.val}%</span>
                     </div>
                     <div className="h-3 w-full bg-slate-50 rounded-full overflow-hidden">
                        <motion.div 
                           initial={{ width: 0 }}
                           animate={{ width: `${dept.val}%` }}
                           transition={{ duration: 1, delay: 0.5 + i * 0.1 }}
                           className={`h-full ${dept.color} rounded-full`}
                        />
                     </div>
                  </div>
                ))}
             </div>

             <div className="mt-12 p-6 rounded-3xl bg-indigo-50 border border-indigo-100 flex items-center gap-4">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                   <Award className="text-indigo-600" size={24} />
                </div>
                <div>
                   <p className="text-xs font-black text-indigo-400 uppercase tracking-widest">Top Division</p>
                   <p className="text-sm font-black text-indigo-900">Counseling Team</p>
                </div>
             </div>
          </div>
        </div>

        {/* --- SYSTEM OPERATIONS LOG --- */}
        <div className="bg-white border border-slate-100 rounded-[2.5rem] overflow-hidden shadow-sm">
           <div className="p-10 border-b border-slate-50 flex items-center justify-between">
              <div>
                 <h3 className="text-2xl font-black text-slate-900 tracking-tight">System Audit & Login Logs</h3>
                 <p className="text-slate-500 font-medium text-sm">Real-time security monitoring and user activity tracking</p>
              </div>
              <div className="flex gap-4">
                 <button className="flex items-center gap-2 px-5 py-2.5 bg-slate-50 border border-slate-100 text-slate-700 rounded-2xl font-bold text-sm hover:bg-slate-100 transition-all">
                    <Download size={18} /> Export CSV
                 </button>
                 <button className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-2xl font-bold text-sm hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100">
                    <Filter size={18} /> Advanced Filters
                 </button>
              </div>
           </div>

           <div className="overflow-x-auto">
              <table className="w-full">
                 <thead className="bg-slate-50">
                    <tr>
                       {['Entity', 'Action', 'System Node', 'Timestamp', 'Status', 'Ref ID'].map(h => (
                         <th key={h} className="px-10 py-5 text-left text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">{h}</th>
                       ))}
                       <th className="px-10 py-5"></th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-50">
                    {[
                      { user: 'Admin_Jagadesh', action: 'Modified Permissions', node: 'Branch_Hyderabad', time: '2 mins ago', status: 'Success', id: 'AU-94281' },
                      { user: 'Sys_Bot_01', action: 'Automatic DB Backup', node: 'Core_Storage', time: '14 mins ago', status: 'Completed', id: 'BK-00392' },
                      { user: 'Counsellor_Raj', action: 'Lead Status Update', node: 'Leads_Engine', time: '22 mins ago', status: 'Success', id: 'LD-11029' },
                      { user: 'Mkt_Lead_Sarah', action: 'Campaign Deployment', node: 'Marketing_Hub', time: '41 mins ago', status: 'Success', id: 'CP-44910' },
                      { user: 'CEO_Jagadesh', action: 'Revenue Report Generated', node: 'Finance_Module', time: '1 hour ago', status: 'Success', id: 'RF-88273' },
                    ].map((row, i) => (
                      <tr key={i} className="hover:bg-slate-50/50 transition-colors group">
                         <td className="px-10 py-6">
                            <div className="flex items-center gap-3">
                               <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-[10px]">
                                  {row.user[0]}
                               </div>
                               <span className="text-sm font-bold text-slate-900">{row.user}</span>
                            </div>
                         </td>
                         <td className="px-10 py-6 text-sm font-medium text-slate-600">{row.action}</td>
                         <td className="px-10 py-6 text-sm font-medium text-slate-500">{row.node}</td>
                         <td className="px-10 py-6 text-sm font-medium text-slate-400">{row.time}</td>
                         <td className="px-10 py-6">
                            <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest">
                               {row.status}
                            </span>
                         </td>
                         <td className="px-10 py-6 text-xs font-mono font-bold text-slate-400">{row.id}</td>
                         <td className="px-10 py-6 text-right">
                            <button className="text-slate-300 hover:text-slate-600 transition-colors">
                               <MoreVertical size={18} />
                            </button>
                         </td>
                      </tr>
                    ))}
                 </tbody>
              </table>
           </div>
           
           <div className="p-8 bg-slate-50/50 flex items-center justify-between">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Showing last 5 of 2,840 audit entries</p>
              <button className="text-sm font-black text-indigo-600 hover:text-indigo-800 transition-colors flex items-center gap-2">
                 View Full System Logs <ArrowUpRight size={18} />
              </button>
           </div>
        </div>

      </div>
    </DashboardLayout>
  );
};

export default CEODashboard;
