'use client';

import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import SectionHeader from '@/components/dashboard/SectionHeader';
import { 
  History, 
  Search, 
  Filter, 
  Download, 
  ShieldAlert, 
  User, 
  Database, 
  Globe,
  Clock,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { motion } from 'framer-motion';

const AuditLogs = () => {
  return (
    <DashboardLayout>
      <div className="space-y-10 pb-20">
        
        <SectionHeader 
          title="System Sovereignty"
          subtitle="Immutable audit trails and governance logs for complete operational transparency."
          icon={History}
          badge="SECURITY CORE"
        />

        {/* --- SECURITY MONITORING HUB --- */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
           {[
             { title: 'Critical Mutations', value: '12', sub: 'Last 24 hours', color: 'rose', icon: ShieldAlert },
             { title: 'Global Access', value: '412', sub: 'Session count', color: 'indigo', icon: Globe },
             { title: 'Data Queries', value: '18.2K', sub: 'API requests', color: 'emerald', icon: Database },
             { title: 'Admin Actors', value: '08', sub: 'Active sessions', color: 'amber', icon: User },
           ].map((stat, i) => (
             <div key={i} className="bg-white border border-slate-100 rounded-[2rem] p-8 shadow-sm group hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <div className={`w-12 h-12 bg-${stat.color}-50 text-${stat.color}-600 rounded-2xl flex items-center justify-center mb-6`}>
                   <stat.icon size={24} />
                </div>
                <h4 className="text-sm font-bold text-slate-500 mb-1">{stat.title}</h4>
                <p className="text-3xl font-black text-slate-900 tracking-tight">{stat.value}</p>
                <p className="text-[10px] font-black text-slate-400 mt-4 uppercase tracking-widest">{stat.sub}</p>
             </div>
           ))}
        </div>

        {/* --- LIVE AUDIT STREAM --- */}
        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
           <div className="p-10 border-b border-slate-50 flex items-center justify-between">
              <div className="flex items-center gap-4">
                 <h3 className="text-2xl font-black text-slate-900 tracking-tight">Governance Ledger</h3>
                 <span className="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
                    Real-time
                 </span>
              </div>
              <div className="flex gap-4">
                 <div className="relative group">
                    <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                    <input 
                      type="text" 
                      placeholder="Filter by actor/entity..." 
                      className="pl-11 pr-6 py-2.5 bg-slate-50 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-100 transition-all border border-transparent focus:border-indigo-100 min-w-[300px]" 
                    />
                 </div>
                 <button className="p-3 bg-slate-50 rounded-xl text-slate-400 hover:text-indigo-600 transition-all border border-transparent hover:border-slate-100">
                    <Filter size={18} />
                 </button>
              </div>
           </div>

           <div className="overflow-x-auto">
              <table className="w-full">
                 <thead>
                    <tr className="bg-slate-50/50">
                       {['Timestamp', 'Actor Node', 'Action Mutation', 'Target Entity', 'Identifier', 'IP Origin', 'Details'].map((h) => (
                         <th key={h} className="px-10 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{h}</th>
                       ))}
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-50">
                    {[
                      { time: '14:22:18', actor: 'CEO_JAGADESH', action: 'UPDATE_ROLE', target: 'MANAGER_NODE', id: 'ROL-102', ip: '182.16.42.10', severity: 'medium' },
                      { time: '14:15:02', actor: 'SYS_DAEMON', action: 'BACKUP_SYNC', target: 'CLOUD_VAULT', id: 'BCK-409', ip: 'internal', severity: 'low' },
                      { time: '13:58:44', actor: 'ADMIN_PRIYA', action: 'DELETE_USER', target: 'USER_ENTITY', id: 'USR-882', ip: '106.22.18.91', severity: 'high' },
                      { time: '13:42:10', actor: 'SALARY_BOT', action: 'BULK_PAYMENT', target: 'EMP_LEDGER', id: 'SAL-OCT-23', ip: 'internal', severity: 'medium' },
                    ].map((log, i) => (
                      <tr key={i} className="hover:bg-slate-50/50 transition-all cursor-pointer group">
                         <td className="px-10 py-6">
                            <div className="flex items-center gap-2 text-slate-400">
                               <Clock size={14} />
                               <span className="text-xs font-black tracking-tight">{log.time}</span>
                            </div>
                         </td>
                         <td className="px-10 py-6">
                            <div className="flex items-center gap-3">
                               <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 font-black text-[10px]">
                                  {log.actor[0]}
                               </div>
                               <span className="text-sm font-black text-slate-900 tracking-tight">{log.actor}</span>
                            </div>
                         </td>
                         <td className="px-10 py-6">
                            <span className={`px-2 py-1 rounded-md text-[9px] font-black uppercase tracking-tighter ${
                               log.severity === 'high' ? 'bg-rose-50 text-rose-600' : 
                               log.severity === 'medium' ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'
                            }`}>
                               {log.action}
                            </span>
                         </td>
                         <td className="px-10 py-6 text-sm font-bold text-slate-500 uppercase tracking-tight">{log.target}</td>
                         <td className="px-10 py-6">
                            <span className="bg-slate-100 px-2 py-1 rounded-md text-[10px] font-black text-slate-600">{log.id}</span>
                         </td>
                         <td className="px-10 py-6 text-[10px] font-black text-slate-400 tracking-widest">{log.ip}</td>
                         <td className="px-10 py-6">
                            <button className="p-2 text-slate-300 hover:text-indigo-600 transition-colors">
                               <ExternalLink size={18} />
                            </button>
                         </td>
                      </tr>
                    ))}
                 </tbody>
              </table>
           </div>

           <div className="p-8 bg-slate-50/50 flex items-center justify-between">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Displaying 50 of 4,812 mutation logs</p>
              <div className="flex gap-2">
                 <button className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-black text-slate-500 hover:bg-white transition-all disabled:opacity-30" disabled>Previous</button>
                 <button className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-black text-slate-900 hover:bg-white transition-all shadow-sm">Next Node</button>
              </div>
           </div>
        </div>

      </div>
    </DashboardLayout>
  );
};

export default AuditLogs;
