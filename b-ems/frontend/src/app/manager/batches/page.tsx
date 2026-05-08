'use client';

import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import SectionHeader from '@/components/dashboard/SectionHeader';
import StatsCard from '@/components/dashboard/StatsCard';
import { 
  Layers, 
  Search, 
  Filter, 
  Plus, 
  Clock, 
  Users, 
  CheckCircle2, 
  AlertCircle,
  MoreVertical,
  Calendar,
  BookOpen,
  User,
  ArrowRight
} from 'lucide-react';
import { motion } from 'framer-motion';

const BatchManagement = () => {
  return (
    <DashboardLayout>
      <div className="space-y-10 pb-20">
        
        <SectionHeader 
          title="Batch Orchestration"
          subtitle="Monitor active cohorts, trainer assignments, and course progression."
          icon={Layers}
          badge="OPERATIONS"
          actionLabel="Initialize Batch"
        />

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
           {[
             { label: 'Active Batches', val: '38', color: 'indigo', icon: Layers },
             { label: 'Avg Completion', val: '74%', color: 'emerald', icon: CheckCircle2 },
             { label: 'Trainer Load', val: '86%', color: 'purple', icon: User },
             { label: 'Upcoming', val: '04', color: 'amber', icon: Calendar },
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

        {/* --- BATCH GRID --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           {[
             { name: 'Java Fullstack #24', trainer: 'Priya Sharma', students: 24, progress: 85, status: 'Ongoing', time: '10 AM - 12 PM', color: 'indigo' },
             { name: 'Python AI/ML #09', trainer: 'Rahul Verma', students: 18, progress: 42, status: 'Ongoing', time: '02 PM - 04 PM', color: 'purple' },
             { name: 'React Native #11', trainer: 'Sneha Gupta', students: 12, progress: 95, status: 'Concluding', time: '05 PM - 07 PM', color: 'emerald' },
             { name: 'Cyber Security #01', trainer: 'Kunal Mehra', students: 15, progress: 10, status: 'Just Started', time: 'Weekend Only', color: 'rose' },
             { name: 'Data Science #18', trainer: 'Amit Das', students: 20, progress: 60, status: 'Ongoing', time: '08 AM - 10 AM', color: 'cyan' },
             { name: 'Cloud Ops #04', trainer: 'Sana Khan', students: 8, progress: 100, status: 'Completed', time: '04 PM - 06 PM', color: 'slate' },
           ].map((batch, i) => (
             <motion.div 
               key={i}
               initial={{ opacity: 0, scale: 0.95 }}
               animate={{ opacity: 1, scale: 1 }}
               transition={{ delay: i * 0.1 }}
               className="bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-sm group hover:shadow-xl hover:-translate-y-2 transition-all duration-500"
             >
                <div className="flex justify-between items-start mb-8">
                   <div className={`w-12 h-12 bg-${batch.color}-50 text-${batch.color}-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                      <BookOpen size={24} />
                   </div>
                   <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                      batch.status === 'Completed' ? 'bg-slate-100 text-slate-500' : 'bg-emerald-50 text-emerald-600'
                   }`}>
                      {batch.status}
                   </span>
                </div>

                <h3 className="text-lg font-black text-slate-900 tracking-tight mb-2">{batch.name}</h3>
                <div className="flex items-center gap-2 mb-8">
                   <User size={14} className="text-slate-400" />
                   <span className="text-xs font-bold text-slate-500">{batch.trainer}</span>
                </div>

                <div className="space-y-4 mb-8">
                   <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
                      <span>Course Progress</span>
                      <span className="text-slate-900">{batch.progress}%</span>
                   </div>
                   <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden">
                      <div className={`h-full bg-${batch.color}-500 transition-all duration-1000`} style={{ width: `${batch.progress}%` }} />
                   </div>
                </div>

                <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                   <div className="flex items-center gap-2">
                      <Clock size={14} className="text-slate-400" />
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{batch.time}</span>
                   </div>
                   <button className="p-2 text-slate-300 hover:text-indigo-600 transition-colors">
                      <ArrowRight size={20} />
                   </button>
                </div>
             </motion.div>
           ))}
        </div>

      </div>
    </DashboardLayout>
  );
};

export default BatchManagement;
