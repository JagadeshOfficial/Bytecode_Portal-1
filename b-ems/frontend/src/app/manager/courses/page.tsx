'use client';

import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import SectionHeader from '@/components/dashboard/SectionHeader';
import { 
  BookOpen, 
  Search, 
  Filter, 
  Plus, 
  Clock, 
  DollarSign, 
  Users, 
  ChevronRight, 
  MoreHorizontal,
  Layers,
  Sparkles,
  TrendingUp,
  Target
} from 'lucide-react';
import { motion } from 'framer-motion';

const CourseHub = () => {
  return (
    <DashboardLayout>
      <div className="space-y-10 pb-20">
        
        <SectionHeader 
          title="Curriculum & Course Hub"
          subtitle="Manage educational nodes, syllabus versions, and commercial parameters."
          icon={BookOpen}
          badge="ACADEMIC CORE"
          actionLabel="New Course Node"
        />

        {/* --- PERFORMANCE --- */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
           {[
             { label: 'Total Modules', val: '18', color: 'indigo', icon: Layers },
             { label: 'Popularity', val: 'Java FS', color: 'emerald', icon: TrendingUp },
             { label: 'Avg Fee', val: '₹34K', color: 'purple', icon: DollarSign },
             { label: 'Completion Rate', val: '91%', color: 'amber', icon: Target },
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

        {/* --- COURSE LIST --- */}
        <div className="bg-white border border-slate-100 rounded-[2.5rem] shadow-sm overflow-hidden">
           <div className="p-10 border-b border-slate-50 flex items-center justify-between">
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">Active Curriculum Nodes</h3>
              <div className="flex gap-4">
                 <div className="relative group">
                    <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                    <input 
                      type="text" 
                      placeholder="Search courses..." 
                      className="pl-11 pr-6 py-2.5 bg-slate-50 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-100 border border-transparent focus:border-indigo-100 min-w-[280px]" 
                    />
                 </div>
              </div>
           </div>

           <div className="overflow-x-auto">
              <table className="w-full">
                 <thead>
                    <tr className="bg-slate-50/50">
                       {['Course Entity', 'Duration', 'Fee Node', 'Students', 'Rating', 'Status'].map((h) => (
                         <th key={h} className="px-10 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{h}</th>
                       ))}
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-50">
                    {[
                      { name: 'Java Fullstack Development', code: 'JFS-01', duration: '6 Months', fee: '₹45,000', students: 412, rating: 4.8, status: 'Trending' },
                      { name: 'Python AI/ML Specialist', code: 'PAI-02', duration: '4 Months', fee: '₹55,000', students: 284, rating: 4.9, status: 'New' },
                      { name: 'Software Testing (QA)', code: 'ST-03', duration: '3 Months', fee: '₹32,000', students: 192, rating: 4.5, status: 'Active' },
                      { name: 'React Native Expert', code: 'RN-04', duration: '3 Months', fee: '₹38,000', students: 110, rating: 4.7, status: 'Active' },
                      { name: 'Cloud Ops & DevOps', code: 'COD-05', duration: '5 Months', fee: '₹50,000', students: 95, rating: 4.6, status: 'Active' },
                    ].map((course, i) => (
                      <tr key={i} className="hover:bg-slate-50/50 transition-all cursor-pointer group">
                         <td className="px-10 py-6">
                            <div className="flex items-center gap-4">
                               <div className="w-11 h-11 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-black group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-sm">
                                  <Sparkles size={18} />
                               </div>
                               <div>
                                  <p className="text-sm font-black text-slate-900 leading-none mb-1">{course.name}</p>
                                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">{course.code}</p>
                               </div>
                            </div>
                         </td>
                         <td className="px-10 py-6 text-sm font-bold text-slate-500">{course.duration}</td>
                         <td className="px-10 py-6 text-sm font-black text-indigo-600">{course.fee}</td>
                         <td className="px-10 py-6 text-sm font-black text-slate-900">{course.students}</td>
                         <td className="px-10 py-6">
                            <div className="flex items-center gap-2">
                               <span className="text-sm font-black text-amber-500">{course.rating}</span>
                               <div className="flex gap-0.5">
                                  {[1,2,3,4,5].map(s => <div key={s} className={`w-1 h-3 rounded-full ${s <= Math.floor(course.rating) ? 'bg-amber-400' : 'bg-slate-100'}`} />)}
                               </div>
                            </div>
                         </td>
                         <td className="px-10 py-6">
                            <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                               course.status === 'Trending' ? 'bg-indigo-50 text-indigo-600 shadow-sm shadow-indigo-100' : 
                               course.status === 'New' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'
                            }`}>
                               {course.status}
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

export default CourseHub;
