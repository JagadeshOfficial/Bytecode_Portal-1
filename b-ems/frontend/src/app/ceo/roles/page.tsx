'use client';

import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import SectionHeader from '@/components/dashboard/SectionHeader';
import { 
  ShieldCheck, 
  Plus, 
  Search, 
  MoreVertical, 
  Lock, 
  Eye, 
  Edit3, 
  Trash2,
  CheckCircle2,
  XCircle,
  Users,
  ChevronRight
} from 'lucide-react';
import { motion } from 'framer-motion';

const RoleManagement = () => {
  const [isAddingRole, setIsAddingRole] = useState(false);

  const roles = [
    { name: 'SUPER_ADMIN', users: 2, permissions: 'All Access', status: 'Active', color: 'indigo' },
    { name: 'CEO', users: 1, permissions: 'All Access', status: 'Active', color: 'purple' },
    { name: 'MANAGER', users: 8, permissions: 'Branch Control', status: 'Active', color: 'emerald' },
    { name: 'COUNSELLOR', users: 24, permissions: 'Lead Management', status: 'Active', color: 'amber' },
    { name: 'SEO_SPECIALIST', users: 4, permissions: 'Content & Meta', status: 'Active', color: 'cyan' },
    { name: 'MARKETING_LEAD', users: 3, permissions: 'Campaign Control', status: 'Active', color: 'rose' },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-10 pb-20">
        
        <SectionHeader 
          title="Role Governance"
          subtitle="Define organizational hierarchy and distribute system-wide permissions."
          icon={ShieldCheck}
          badge="SECURITY CORE"
          actionLabel="Create New Role"
          onAction={() => setIsAddingRole(true)}
        />

        {/* --- ROLE GRID --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
           {roles.map((role, i) => (
             <motion.div 
               key={role.name}
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: i * 0.1 }}
               className="bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group relative overflow-hidden"
             >
                {/* Decorative Background */}
                <div className={`absolute top-0 right-0 w-32 h-32 bg-${role.color}-500/5 blur-[60px] group-hover:bg-${role.color}-500/10 transition-colors`} />
                
                <div className="flex justify-between items-start mb-8 relative z-10">
                   <div className={`w-14 h-14 bg-${role.color}-50 text-${role.color}-600 rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform`}>
                      <ShieldCheck size={28} />
                   </div>
                   <button className="p-2 text-slate-300 hover:text-slate-900 transition-colors">
                      <MoreVertical size={20} />
                   </button>
                </div>

                <div className="relative z-10">
                   <h3 className="text-xl font-black text-slate-900 tracking-tight mb-2">{role.name.replace('_', ' ')}</h3>
                   <div className="flex items-center gap-2 mb-6">
                      <Users size={14} className="text-slate-400" />
                      <span className="text-xs font-bold text-slate-500">{role.users} active users assigned</span>
                   </div>

                   <div className="space-y-4 mb-8">
                      <div className="flex items-center justify-between text-xs font-black uppercase tracking-widest text-slate-400">
                         <span>Permissions</span>
                         <span className={`text-${role.color}-600`}>{role.permissions}</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden">
                         <div className={`h-full bg-${role.color}-500`} style={{ width: role.permissions === 'All Access' ? '100%' : '65%' }} />
                      </div>
                   </div>

                   <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                      <div className="flex items-center gap-2">
                         <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.3)]" />
                         <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{role.status}</span>
                      </div>
                      <button className="text-indigo-600 font-bold text-xs flex items-center gap-1 group-hover:gap-2 transition-all">
                         View Details <ChevronRight size={14} />
                      </button>
                   </div>
                </div>
             </motion.div>
           ))}

           {/* Add New Role Card */}
           <button 
             onClick={() => setIsAddingRole(true)}
             className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-[2.5rem] p-8 flex flex-col items-center justify-center gap-4 group hover:bg-indigo-50 hover:border-indigo-200 transition-all cursor-pointer"
           >
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-slate-400 group-hover:text-indigo-600 shadow-sm transition-all">
                 <Plus size={32} />
              </div>
              <div className="text-center">
                 <p className="text-sm font-black text-slate-900">Add New Role Node</p>
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Define new access level</p>
              </div>
           </button>
        </div>

        {/* --- RECENT ACTIVITY --- */}
        <div className="bg-white border border-slate-100 rounded-[2.5rem] p-10 shadow-sm overflow-hidden">
           <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">Recent Policy Mutations</h3>
              <button className="px-5 py-2.5 bg-slate-50 rounded-xl text-xs font-black text-slate-500 hover:text-indigo-600 transition-all">
                 View Security Audit
              </button>
           </div>
           
           <div className="space-y-4">
              {[
                { actor: 'CEO_JAGADESH', action: 'Elevated Permissions', role: 'MANAGER', time: '2h ago' },
                { actor: 'SYS_ADMIN', action: 'Created New Role', role: 'MARKETING_LEAD', time: '5h ago' },
                { actor: 'CEO_JAGADESH', action: 'Restricted Access', role: 'COUNSELLOR', time: '1d ago' },
              ].map((act, i) => (
                <div key={i} className="flex items-center justify-between p-5 bg-slate-50/50 rounded-2xl border border-transparent hover:border-slate-100 transition-all">
                   <div className="flex items-center gap-6">
                      <span className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em]">{act.actor}</span>
                      <p className="text-sm font-bold text-slate-900">{act.action}</p>
                      <span className="text-slate-300">→</span>
                      <span className="bg-white px-3 py-1 rounded-lg text-[10px] font-black text-slate-500 border border-slate-100">{act.role}</span>
                   </div>
                   <span className="text-[10px] font-black text-slate-400 uppercase">{act.time}</span>
                </div>
              ))}
           </div>
        </div>

      </div>
    </DashboardLayout>
  );
};

export default RoleManagement;
