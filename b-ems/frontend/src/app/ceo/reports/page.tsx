'use client';

import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import SectionHeader from '@/components/dashboard/SectionHeader';
import { 
  FileText, 
  Download, 
  Filter, 
  BarChart3, 
  PieChart as PieChartIcon, 
  Calendar,
  Share2,
  Trash2,
  ChevronRight,
  Sparkles,
  Zap,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { motion } from 'framer-motion';

const ReportsPage = () => {
  const [activeCategory, setActiveCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All Intelligence' },
    { id: 'revenue', name: 'Fiscal Reports' },
    { id: 'admissions', name: 'Intake Analytics' },
    { id: 'marketing', name: 'Campaign ROI' },
    { id: 'employee', name: 'Staff Performance' },
  ];

  const reports = [
    { id: 'R-001', name: 'Q2 Global Revenue Summary', cat: 'revenue', date: 'May 06, 2026', size: '2.4 MB', status: 'Ready' },
    { id: 'R-002', name: 'May Admissions Velocity Report', cat: 'admissions', date: 'May 05, 2026', size: '1.1 MB', status: 'Processing' },
    { id: 'R-003', name: 'Google Ads ROI Matrix - April', cat: 'marketing', date: 'May 02, 2026', size: '4.8 MB', status: 'Ready' },
    { id: 'R-004', name: 'Employee KPI Node Analysis', cat: 'employee', date: 'April 30, 2026', size: '840 KB', status: 'Ready' },
    { id: 'R-005', name: 'Branch Performance Comparison', cat: 'revenue', date: 'April 28, 2026', size: '3.2 MB', status: 'Archived' },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-12 pb-20">
        
        {/* --- HEADER --- */}
        <SectionHeader 
          title="Intelligence Analytics"
          subtitle="Generate, manage, and export high-fidelity organizational reports."
          icon={FileText}
          badge="DATA COMMAND"
          actionLabel="Instant Export"
        />

        {/* --- AI INSIGHTS HUD --- */}
        <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden group">
           <div className="absolute top-0 right-0 w-[500px] h-full bg-white/10 skew-x-[-20deg] translate-x-1/2" />
           <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
              <div className="space-y-4">
                 <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 border border-white/20 text-[10px] font-black tracking-widest uppercase">
                    <Sparkles size={14} /> AI Intelligence Detected
                 </div>
                 <h2 className="text-3xl font-black tracking-tight">Predictive Growth Anomaly</h2>
                 <p className="text-indigo-100 text-lg max-w-2xl font-medium">
                    Our AI models have detected a <span className="text-white font-black underline decoration-cyan-400 decoration-2">12.4% surge</span> in lead velocity for the "Data Science" domain. We recommend generating a localized capacity report for the Hyderabad branch.
                 </p>
              </div>
              <button className="px-8 py-4 bg-white text-indigo-600 rounded-2xl font-black text-sm hover:scale-105 transition-transform shadow-xl whitespace-nowrap">
                 Generate Insight Report
              </button>
           </div>
        </div>

        {/* --- MAIN REPORTS HUB --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
           
           {/* Sidebar Filter */}
           <div className="lg:col-span-3 space-y-2">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6 px-4">Classification</h4>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`w-full flex items-center justify-between px-6 py-4 rounded-2xl transition-all font-bold text-sm group ${
                    activeCategory === cat.id 
                     ? 'bg-white text-indigo-600 shadow-xl shadow-slate-200 border border-slate-100' 
                     : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  {cat.name}
                  {activeCategory === cat.id && <div className="w-1.5 h-1.5 rounded-full bg-indigo-600" />}
                </button>
              ))}

              <div className="mt-12 p-8 bg-indigo-50 rounded-[2rem] border border-indigo-100">
                 <Zap className="text-indigo-600 mb-4" size={32} />
                 <h5 className="text-sm font-black text-indigo-900 mb-2">Automated Scheduling</h5>
                 <p className="text-xs text-indigo-600/70 font-medium mb-6">Schedule recurring reports to be sent via email or WhatsApp.</p>
                 <button className="w-full py-3 bg-indigo-600 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-700 transition-all">
                    Configure Schedule
                 </button>
              </div>
           </div>

           {/* Reports Grid/List */}
           <div className="lg:col-span-9 space-y-6">
              <div className="flex items-center justify-between mb-8">
                 <h3 className="text-xl font-black text-slate-900 tracking-tight">Available Documents</h3>
                 <div className="flex gap-4">
                    <button className="p-3 bg-white border border-slate-100 rounded-xl text-slate-500 hover:bg-slate-50 transition-all">
                       <Calendar size={18} />
                    </button>
                    <button className="p-3 bg-white border border-slate-100 rounded-xl text-slate-500 hover:bg-slate-50 transition-all">
                       <Filter size={18} />
                    </button>
                 </div>
              </div>

              <div className="space-y-4">
                 {reports.map((report, i) => (
                   <motion.div 
                     key={report.id}
                     initial={{ opacity: 0, y: 10 }}
                     animate={{ opacity: 1, y: 0 }}
                     transition={{ delay: i * 0.05 }}
                     className="bg-white border border-slate-100 rounded-3xl p-6 flex items-center justify-between group hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-50/50 transition-all cursor-pointer"
                   >
                      <div className="flex items-center gap-6">
                         <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
                            report.status === 'Processing' ? 'bg-amber-50 text-amber-500 animate-pulse' : 'bg-slate-50 text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600'
                         } transition-colors`}>
                            <FileText size={24} />
                         </div>
                         <div>
                            <div className="flex items-center gap-3">
                               <h4 className="font-bold text-slate-900">{report.name}</h4>
                               <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">{report.id}</span>
                            </div>
                            <p className="text-xs text-slate-500 font-medium mt-1">Generated on {report.date} • {report.size}</p>
                         </div>
                      </div>

                      <div className="flex items-center gap-4">
                         <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                            report.status === 'Ready' ? 'bg-emerald-50 text-emerald-600' : 
                            report.status === 'Processing' ? 'bg-amber-50 text-amber-600' : 'bg-slate-100 text-slate-400'
                         }`}>
                            {report.status}
                         </span>
                         
                         <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button className="p-2.5 bg-slate-50 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all">
                               <Download size={18} />
                            </button>
                            <button className="p-2.5 bg-slate-50 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all">
                               <Share2 size={18} />
                            </button>
                            <button className="p-2.5 bg-slate-50 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all">
                               <Trash2 size={18} />
                            </button>
                         </div>
                         
                         <ChevronRight size={20} className="text-slate-200 group-hover:text-indigo-300 transition-colors" />
                      </div>
                   </motion.div>
                 ))}
              </div>

              <div className="mt-12 text-center p-12 border-2 border-dashed border-slate-100 rounded-[3rem]">
                 <p className="text-sm font-bold text-slate-400 mb-6">Looking for a custom data visualization?</p>
                 <button className="px-10 py-4 bg-slate-900 text-white rounded-2xl font-black text-sm hover:scale-105 transition-transform shadow-xl">
                    Open Custom Query Builder
                 </button>
              </div>
           </div>

        </div>

      </div>
    </DashboardLayout>
  );
};

export default ReportsPage;
