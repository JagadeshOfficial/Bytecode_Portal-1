'use client';

import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import SectionHeader from '@/components/dashboard/SectionHeader';
import { 
  Lock, 
  Search, 
  Filter, 
  Check, 
  X, 
  ShieldCheck, 
  Users, 
  Database, 
  Globe, 
  LayoutDashboard,
  Settings,
  ChevronRight,
  Info
} from 'lucide-react';
import { motion } from 'framer-motion';

const UserPermissions = () => {
  const [selectedRole, setSelectedRole] = useState('MANAGER');

  const permissionMatrix = [
    { module: 'User Management', read: true, create: true, update: true, delete: false },
    { module: 'Financial Records', read: true, create: false, update: false, delete: false },
    { module: 'Lead Pipeline', read: true, create: true, update: true, delete: true },
    { module: 'System Settings', read: false, create: false, update: false, delete: false },
    { module: 'Operational Audit', read: true, create: false, update: false, delete: false },
    { module: 'Course Syllabus', read: true, create: true, update: true, delete: false },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-10 pb-20">
        
        <SectionHeader 
          title="Permission Matrix"
          subtitle="Granular control over system-wide functional access and data visibility."
          icon={Lock}
          badge="GOVERNANCE"
        />

        <div className="flex flex-col lg:flex-row gap-8">
           
           {/* Role Selection Sidepanel */}
           <div className="lg:w-80 shrink-0 space-y-4">
              <div className="bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-sm">
                 <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-6">Select Role Node</h3>
                 <div className="space-y-2">
                    {['SUPER_ADMIN', 'CEO', 'MANAGER', 'COUNSELLOR', 'SEO', 'MARKETING'].map((role) => (
                      <button 
                        key={role}
                        onClick={() => setSelectedRole(role)}
                        className={`w-full flex items-center justify-between px-5 py-4 rounded-2xl transition-all font-black text-[10px] tracking-widest uppercase ${
                          selectedRole === role 
                            ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-100' 
                            : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
                        }`}
                      >
                        {role.replace('_', ' ')}
                        {selectedRole === role && <ChevronRight size={14} />}
                      </button>
                    ))}
                 </div>
              </div>

              <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden group">
                 <div className="absolute top-0 right-0 p-6 opacity-10">
                    <ShieldCheck size={48} />
                 </div>
                 <h4 className="text-sm font-black mb-2 flex items-center gap-2">
                    <Info size={14} className="text-indigo-400" />
                    Security Tip
                 </h4>
                 <p className="text-[10px] text-slate-400 font-medium leading-relaxed">Ensure 'Delete' permissions are restricted to root nodes only to prevent accidental data loss.</p>
              </div>
           </div>

           {/* Permission Grid */}
           <div className="flex-1">
              <div className="bg-white border border-slate-100 rounded-[2.5rem] shadow-sm overflow-hidden">
                 <div className="p-10 border-b border-slate-50 flex items-center justify-between">
                    <div>
                       <h3 className="text-2xl font-black text-slate-900 tracking-tight">Access Capabilities</h3>
                       <p className="text-slate-500 font-medium text-sm">Fine-tune CRUD operations for {selectedRole}.</p>
                    </div>
                    <button className="px-6 py-3 bg-indigo-600 text-white rounded-2xl font-black text-xs hover:scale-105 transition-all shadow-lg shadow-indigo-100">
                       Deploy Updates
                    </button>
                 </div>

                 <div className="overflow-x-auto">
                    <table className="w-full">
                       <thead className="bg-slate-50/50">
                          <tr>
                             <th className="px-10 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Module / Entity</th>
                             {['READ', 'CREATE', 'UPDATE', 'DELETE'].map((cap) => (
                               <th key={cap} className="px-10 py-6 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">{cap}</th>
                             ))}
                          </tr>
                       </thead>
                       <tbody className="divide-y divide-slate-50">
                          {permissionMatrix.map((item, i) => (
                            <tr key={i} className="hover:bg-slate-50/50 transition-all">
                               <td className="px-10 py-6">
                                  <div className="flex items-center gap-4">
                                     <div className="w-2 h-2 rounded-full bg-indigo-500" />
                                     <span className="text-sm font-black text-slate-900">{item.module}</span>
                                  </div>
                               </td>
                               {[item.read, item.create, item.update, item.delete].map((val, idx) => (
                                 <td key={idx} className="px-10 py-6 text-center">
                                    <button className={`w-10 h-10 rounded-xl flex items-center justify-center mx-auto transition-all ${
                                       val ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-rose-50 text-rose-400 border border-rose-100'
                                    }`}>
                                       {val ? <Check size={18} /> : <X size={18} />}
                                    </button>
                                 </td>
                               ))}
                            </tr>
                          ))}
                       </tbody>
                    </table>
                 </div>

                 <div className="p-10 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                       <ShieldCheck className="text-indigo-600" size={20} />
                       <p className="text-xs font-black text-slate-900 uppercase tracking-widest">Global Governance Active</p>
                    </div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Last modified by CEO @ 14:22 Today</p>
                 </div>
              </div>
           </div>
        </div>

      </div>
    </DashboardLayout>
  );
};

export default UserPermissions;
