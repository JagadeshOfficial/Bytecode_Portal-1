'use client';

import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import SectionHeader from '@/components/dashboard/SectionHeader';
import { 
  GraduationCap, 
  Search, 
  Filter, 
  Download, 
  Plus, 
  User, 
  BookOpen, 
  CreditCard,
  MoreVertical,
  CheckCircle2,
  Clock,
  Mail,
  Phone
} from 'lucide-react';
import { motion } from 'framer-motion';

const StudentManagement = () => {
  return (
    <DashboardLayout>
      <div className="space-y-10 pb-20">
        
        <SectionHeader 
          title="Student Ecosystem"
          subtitle="Comprehensive management of academic records, enrollment status, and financial history."
          icon={GraduationCap}
          badge="ACADEMIC RECORDS"
          actionLabel="Bulk Import"
        />

        {/* --- FAST STATS --- */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
           {[
             { label: 'Active Learners', val: '1,248', color: 'indigo', icon: GraduationCap },
             { label: 'Fee Clearance', val: '82%', color: 'emerald', icon: CreditCard },
             { label: 'Avg Attendance', val: '94%', color: 'purple', icon: CheckCircle2 },
             { label: 'New This Month', val: '+42', color: 'amber', icon: Plus },
           ].map((s, i) => (
             <div key={i} className="bg-white border border-slate-100 rounded-[2rem] p-6 shadow-sm flex items-center gap-5">
                <div className={`w-12 h-12 bg-${s.color}-50 text-${s.color}-600 rounded-2xl flex items-center justify-center shrink-0`}>
                   <s.icon size={24} />
                </div>
                <div>
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1.5">{s.label}</p>
                   <p className="text-2xl font-black text-slate-900 leading-none">{s.val}</p>
                </div>
             </div>
           ))}
        </div>

        {/* --- STUDENT TABLE --- */}
        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
           <div className="p-10 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                 <h3 className="text-2xl font-black text-slate-900 tracking-tight">Enrollment Registry</h3>
                 <div className="flex gap-2">
                    <span className="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">Live Node</span>
                 </div>
              </div>
              
              <div className="flex flex-wrap gap-4">
                 <div className="relative group">
                    <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                    <input 
                      type="text" 
                      placeholder="Search by ID, Name or Phone..." 
                      className="pl-11 pr-6 py-3 bg-slate-50 rounded-2xl text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-100 transition-all border border-transparent focus:border-indigo-100 min-w-[320px]" 
                    />
                 </div>
                 <button className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-2xl font-black text-sm shadow-lg shadow-indigo-100 hover:scale-105 transition-all">
                    <Plus size={18} /> Add Student
                 </button>
                 <button className="p-3.5 bg-slate-50 rounded-2xl text-slate-400 hover:text-indigo-600 transition-all border border-transparent hover:border-slate-100">
                    <Filter size={20} />
                 </button>
              </div>
           </div>

           <div className="overflow-x-auto">
              <table className="w-full">
                 <thead>
                    <tr className="bg-slate-50/50">
                       {['Student Identity', 'Course Node', 'Batch ID', 'Admission', 'Fee Status', 'Attendance', 'Actions'].map((h) => (
                         <th key={h} className="px-10 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{h}</th>
                       ))}
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-50">
                    {[
                      { name: 'Aditya Verma', id: 'BTC-1002', email: 'aditya@example.com', course: 'Java Fullstack', batch: 'JFS-24', date: 'Oct 12, 2023', fee: 'Cleared', feeColor: 'emerald', att: '98%' },
                      { name: 'Sneha Kapur', id: 'BTC-1045', email: 'sneha@example.com', course: 'Python AI/ML', batch: 'PY-09', date: 'Oct 10, 2023', fee: '₹12K Due', feeColor: 'rose', att: '92%' },
                      { name: 'Rahul Sharma', id: 'BTC-1102', email: 'rahul@example.com', course: 'React Native', batch: 'RN-11', date: 'Oct 08, 2023', fee: 'Cleared', feeColor: 'emerald', att: '85%' },
                      { name: 'Priya Das', id: 'BTC-1156', email: 'priya@example.com', course: 'Cloud Ops', batch: 'CO-04', date: 'Oct 05, 2023', fee: '₹4K Due', feeColor: 'amber', att: '100%' },
                      { name: 'Kunal Mehra', id: 'BTC-1188', email: 'kunal@example.com', course: 'Cyber Security', batch: 'CS-01', date: 'Oct 02, 2023', fee: 'Cleared', feeColor: 'emerald', att: '94%' },
                    ].map((stu, i) => (
                      <tr key={i} className="hover:bg-slate-50/50 transition-all cursor-pointer group">
                         <td className="px-10 py-6">
                            <div className="flex items-center gap-4">
                               <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-black text-sm shadow-md border border-white/10 group-hover:scale-110 transition-transform">
                                  {stu.name[0]}
                               </div>
                               <div>
                                  <p className="text-sm font-black text-slate-900 group-hover:text-indigo-600 transition-colors">{stu.name}</p>
                                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">{stu.id}</p>
                               </div>
                            </div>
                         </td>
                         <td className="px-10 py-6 text-sm font-bold text-slate-600">{stu.course}</td>
                         <td className="px-10 py-6">
                            <span className="bg-slate-100 px-2.5 py-1 rounded-lg text-[10px] font-black text-slate-500 uppercase tracking-tighter">{stu.batch}</span>
                         </td>
                         <td className="px-10 py-6 text-xs font-bold text-slate-400 uppercase">{stu.date}</td>
                         <td className="px-10 py-6">
                            <div className="flex flex-col gap-1.5">
                               <span className={`text-[10px] font-black uppercase tracking-widest text-${stu.feeColor}-600`}>{stu.fee}</span>
                               <div className="h-1.5 w-20 bg-slate-100 rounded-full overflow-hidden">
                                  <div className={`h-full bg-${stu.feeColor}-500`} style={{ width: stu.fee === 'Cleared' ? '100%' : '60%' }} />
                               </div>
                            </div>
                         </td>
                         <td className="px-10 py-6">
                            <div className="flex items-center gap-2">
                               <div className="w-2 h-2 rounded-full bg-emerald-500" />
                               <span className="text-sm font-black text-slate-900">{stu.att}</span>
                            </div>
                         </td>
                         <td className="px-10 py-6">
                            <div className="flex items-center gap-3">
                               <button className="p-2 text-slate-300 hover:text-indigo-600 transition-colors">
                                  <Mail size={18} />
                               </button>
                               <button className="p-2 text-slate-300 hover:text-indigo-600 transition-colors">
                                  <Phone size={18} />
                               </button>
                               <button className="p-2 text-slate-300 hover:text-indigo-600 transition-colors">
                                  <MoreVertical size={18} />
                               </button>
                            </div>
                         </td>
                      </tr>
                    ))}
                 </tbody>
              </table>
           </div>

           <div className="p-10 bg-slate-50/50 flex items-center justify-between border-t border-slate-100">
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Displaying 10 of 1,248 students</p>
              <div className="flex gap-3">
                 <button className="px-5 py-2.5 bg-white border border-slate-200 rounded-xl text-[10px] font-black text-slate-500 uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm">Previous</button>
                 <button className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100">Next Node</button>
              </div>
           </div>
        </div>

      </div>
    </DashboardLayout>
  );
};

export default StudentManagement;
