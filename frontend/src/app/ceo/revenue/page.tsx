'use client';

import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import SectionHeader from '@/components/dashboard/SectionHeader';
import StatsCard from '@/components/dashboard/StatsCard';
import { 
  BarChart3, 
  TrendingUp, 
  DollarSign, 
  ArrowUpRight, 
  Download, 
  Filter,
  PieChart,
  Calendar,
  ChevronRight,
  Target,
  Clock,
  Search
} from 'lucide-react';
import { motion } from 'framer-motion';

const RevenueAnalytics = () => {
  return (
    <DashboardLayout>
      <div className="space-y-10 pb-20">
        
        <SectionHeader 
          title="Revenue Matrix"
          subtitle="Financial performance tracking and fiscal analytics across all branches."
          icon={BarChart3}
          badge="FINANCIAL OVERSIGHT"
          actionLabel="Export Ledger"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard 
            title="Total Revenue" 
            value="₹42,85,200" 
            icon={DollarSign} 
            color="emerald" 
            trend="+18% vs last yr"
          />
          <StatsCard 
            title="Monthly Target" 
            value="₹8,00,000" 
            icon={Target} 
            color="indigo" 
            trend="82% Achieved"
          />
          <StatsCard 
            title="Avg. Deal Size" 
            value="₹34,500" 
            icon={TrendingUp} 
            color="purple" 
            trend="+5% variance"
          />
          <StatsCard 
            title="Outstanding" 
            value="₹2,40,000" 
            icon={Clock} 
            color="rose" 
            trend="Needs follow-up"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
           
           {/* Revenue Stream Chart */}
           <div className="lg:col-span-8 bg-white rounded-[2.5rem] border border-slate-100 p-10 shadow-sm relative overflow-hidden group">
              <div className="flex items-center justify-between mb-12">
                 <div>
                    <h3 className="text-2xl font-black text-slate-900 tracking-tight">Revenue Stream Velocity</h3>
                    <p className="text-slate-500 font-medium text-sm">Monthly comparison of course collections</p>
                 </div>
                 <div className="flex gap-2">
                    <button className="px-4 py-2 bg-slate-50 rounded-xl text-xs font-black text-slate-400 hover:text-indigo-600 transition-all border border-transparent hover:border-slate-100">
                       Last 12 Months
                    </button>
                 </div>
              </div>

              <div className="h-80 flex items-end justify-between gap-4 px-2">
                 {[45, 60, 55, 80, 70, 95, 85, 60, 100, 75, 90, 85].map((h, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-4 group/bar">
                       <div className="relative w-full">
                          <motion.div 
                             initial={{ height: 0 }}
                             animate={{ height: `${h}%` }}
                             transition={{ delay: i * 0.05, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                             className="w-full bg-gradient-to-t from-indigo-600 to-indigo-400 rounded-2xl opacity-80 group-hover/bar:opacity-100 group-hover/bar:scale-x-105 transition-all shadow-[0_4px_12px_rgba(79,70,229,0.15)]"
                          />
                          {/* Tooltip on Hover */}
                          <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-black px-2 py-1 rounded opacity-0 group-hover/bar:opacity-100 transition-opacity">
                             ₹{(h * 10000).toLocaleString()}
                          </div>
                       </div>
                       <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{['J','F','M','A','M','J','J','A','S','O','N','D'][i]}</span>
                    </div>
                 ))}
              </div>
           </div>

           {/* Branch Performance Pie */}
           <div className="lg:col-span-4 bg-slate-900 rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 blur-[100px] pointer-events-none" />
              <h3 className="text-xl font-black mb-10 tracking-tight">Branch Contribution</h3>
              
              <div className="space-y-8">
                 {[
                   { name: 'Hyderabad Main', val: '45%', color: 'bg-indigo-500', amt: '₹19.2L' },
                   { name: 'Bangalore Hub', val: '32%', color: 'bg-purple-500', amt: '₹13.7L' },
                   { name: 'Chennai Tech', val: '23%', color: 'bg-cyan-500', amt: '₹9.8L' },
                 ].map((branch, i) => (
                   <div key={i} className="relative z-10">
                      <div className="flex justify-between mb-3 items-end">
                         <div>
                            <p className="text-sm font-bold text-white mb-1">{branch.name}</p>
                            <p className="text-xs text-indigo-400 font-black tracking-widest uppercase">{branch.amt}</p>
                         </div>
                         <span className="text-lg font-black text-indigo-400">{branch.val}</span>
                      </div>
                      <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                         <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: branch.val }}
                            transition={{ duration: 1.5, delay: 0.5 }}
                            className={`h-full ${branch.color}`}
                         />
                      </div>
                   </div>
                 ))}
              </div>

              <button className="w-full mt-12 py-4 bg-white text-slate-900 rounded-2xl font-black text-xs hover:scale-[1.02] transition-transform shadow-xl">
                 Download Regional Audit
              </button>
           </div>
        </div>

        {/* --- RECENT TRANSACTIONS --- */}
        <div className="bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden shadow-sm">
           <div className="p-10 border-b border-slate-50 flex items-center justify-between">
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">Financial Ledger</h3>
              <div className="flex gap-4">
                 <div className="relative group">
                    <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                    <input 
                      type="text" 
                      placeholder="Search receipts..." 
                      className="pl-11 pr-6 py-2.5 bg-slate-50 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-100 transition-all border border-transparent focus:border-indigo-100" 
                    />
                 </div>
                 <button className="p-3 bg-slate-50 rounded-xl text-slate-400 hover:text-indigo-600 transition-all border border-transparent hover:border-slate-100">
                    <Download size={18} />
                 </button>
              </div>
           </div>

           <div className="overflow-x-auto">
              <table className="w-full">
                 <thead>
                    <tr className="bg-slate-50/50">
                       {['Date', 'Student ID', 'Transaction', 'Branch', 'Method', 'Amount', 'Status'].map((h) => (
                         <th key={h} className="px-10 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{h}</th>
                       ))}
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-50">
                    {[
                      { date: 'Oct 12, 2023', sid: 'STU-1024', name: 'K. Verma', branch: 'Hyderabad', method: 'UPI', amt: '₹45,000', status: 'Success' },
                      { date: 'Oct 11, 2023', sid: 'STU-1025', name: 'R. Sharma', branch: 'Bangalore', method: 'Card', amt: '₹32,000', status: 'Success' },
                      { date: 'Oct 11, 2023', sid: 'STU-1026', name: 'A. Gupta', branch: 'Hyderabad', method: 'Cash', amt: '₹15,000', status: 'Pending' },
                      { date: 'Oct 10, 2023', sid: 'STU-1027', name: 'S. Mehra', branch: 'Chennai', method: 'Bank', amt: '₹60,000', status: 'Success' },
                    ].map((tx, i) => (
                      <tr key={i} className="hover:bg-slate-50/50 transition-all cursor-pointer group">
                         <td className="px-10 py-6 text-sm font-bold text-slate-500">{tx.date}</td>
                         <td className="px-10 py-6">
                            <span className="bg-slate-100 px-2 py-1 rounded-md text-[10px] font-black text-slate-600 uppercase tracking-tighter">{tx.sid}</span>
                         </td>
                         <td className="px-10 py-6 text-sm font-black text-slate-900">{tx.name}</td>
                         <td className="px-10 py-6 text-sm font-medium text-slate-500">{tx.branch}</td>
                         <td className="px-10 py-6 text-sm font-bold text-slate-600">{tx.method}</td>
                         <td className="px-10 py-6 text-sm font-black text-indigo-600">{tx.amt}</td>
                         <td className="px-10 py-6">
                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                               tx.status === 'Success' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                            }`}>
                               {tx.status}
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

export default RevenueAnalytics;
