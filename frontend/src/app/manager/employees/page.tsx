'use client';

import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import SectionHeader from '@/components/dashboard/SectionHeader';
import StatsCard from '@/components/dashboard/StatsCard';
import { 
  Users, 
  Search, 
  Filter, 
  Plus, 
  MoreHorizontal, 
  Mail, 
  Phone, 
  Briefcase, 
  MapPin,
  Calendar,
  CreditCard,
  ChevronRight,
  ShieldCheck,
  Zap,
  Activity
} from 'lucide-react';
import { motion } from 'framer-motion';

const EmployeeManagement = () => {
  return (
    <DashboardLayout>
      <div className="space-y-10 pb-20">
        
        <SectionHeader 
          title="Human Capital Node"
          subtitle="Manage organizational hierarchy, employee records, and performance metrics."
          icon={Users}
          badge="HR OPERATIONS"
          actionLabel="Onboard Staff"
        />

        {/* --- HR ANALYTICS --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard 
            title="Total Workforce" 
            value="86" 
            icon={Users} 
            color="indigo" 
            trend="4 teams"
          />
          <StatsCard 
            title="Retention Rate" 
            value="94%" 
            icon={Activity} 
            color="emerald" 
            trend="Stable"
          />
          <StatsCard 
            title="Open Positions" 
            value="06" 
            icon={Briefcase} 
            color="amber" 
            trend="Active hiring"
          />
          <StatsCard 
            title="Total Payroll" 
            value="₹14.2L" 
            icon={CreditCard} 
            color="purple" 
            trend="Monthly"
          />
        </div>

        {/* --- EMPLOYEE DIRECTORY --- */}
        <div className="bg-white border border-slate-100 rounded-[2.5rem] shadow-sm overflow-hidden">
           <div className="p-10 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                 <h3 className="text-2xl font-black text-slate-900 tracking-tight">Staff Registry</h3>
                 <span className="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">Active Nodes</span>
              </div>
              <div className="flex flex-wrap gap-4">
                 <div className="relative group">
                    <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                    <input 
                      type="text" 
                      placeholder="Search employees..." 
                      className="pl-11 pr-6 py-2.5 bg-slate-50 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-100 transition-all border border-transparent focus:border-indigo-100 min-w-[280px]" 
                    />
                 </div>
                 <button className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-black text-xs shadow-lg shadow-indigo-100 hover:scale-105 transition-all">
                    <Plus size={16} /> New Node
                 </button>
              </div>
           </div>

           <div className="overflow-x-auto">
              <table className="w-full">
                 <thead>
                    <tr className="bg-slate-50/50">
                       {['Employee Identity', 'Department', 'Role Node', 'Status', 'Performance', 'Actions'].map((h) => (
                         <th key={h} className="px-10 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{h}</th>
                       ))}
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-50">
                    {[
                      { name: 'Jagadesh Official', id: 'EMP-001', dept: 'Executive', role: 'CEO', status: 'Active', perf: 100, color: 'indigo' },
                      { name: 'Priya Sharma', id: 'EMP-012', dept: 'Academic', role: 'Senior Trainer', status: 'Active', perf: 94, color: 'purple' },
                      { name: 'Kunal Verma', id: 'EMP-045', dept: 'Admissions', role: 'Counsellor', status: 'On Leave', perf: 82, color: 'amber' },
                      { name: 'Rohan Gupta', id: 'EMP-088', dept: 'Growth', role: 'SEO Head', status: 'Active', perf: 88, color: 'emerald' },
                    ].map((emp, i) => (
                      <tr key={i} className="hover:bg-slate-50/50 transition-all cursor-pointer group">
                         <td className="px-10 py-6">
                            <div className="flex items-center gap-4">
                               <div className="w-11 h-11 rounded-2xl bg-slate-100 flex items-center justify-center font-black text-slate-500 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-sm">
                                  {emp.name[0]}
                               </div>
                               <div>
                                  <p className="text-sm font-black text-slate-900 leading-none mb-1">{emp.name}</p>
                                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">{emp.id}</p>
                               </div>
                            </div>
                         </td>
                         <td className="px-10 py-6 text-sm font-bold text-slate-600">{emp.dept}</td>
                         <td className="px-10 py-6">
                            <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest bg-${emp.color}-50 text-${emp.color}-600`}>
                               {emp.role}
                            </span>
                         </td>
                         <td className="px-10 py-6">
                            <div className="flex items-center gap-2">
                               <div className={`w-1.5 h-1.5 rounded-full ${emp.status === 'Active' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                               <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">{emp.status}</span>
                            </div>
                         </td>
                         <td className="px-10 py-6">
                            <div className="flex flex-col gap-1.5">
                               <span className="text-[10px] font-black text-slate-900">{emp.perf}% Health</span>
                               <div className="h-1 w-20 bg-slate-100 rounded-full overflow-hidden">
                                  <div className="h-full bg-indigo-500" style={{ width: `${emp.perf}%` }} />
                               </div>
                            </div>
                         </td>
                         <td className="px-10 py-6">
                            <div className="flex items-center gap-3">
                               <button className="p-2 text-slate-300 hover:text-indigo-600 transition-colors">
                                  <Mail size={18} />
                               </button>
                               <button className="p-2 text-slate-300 hover:text-indigo-600 transition-colors">
                                  <Activity size={18} />
                               </button>
                               <button className="p-2 text-slate-300 hover:text-indigo-600 transition-colors">
                                  <MoreHorizontal size={18} />
                               </button>
                            </div>
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

export default EmployeeManagement;
