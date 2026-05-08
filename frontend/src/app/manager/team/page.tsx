'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';
import DashboardLayout from '@/components/layout/DashboardLayout';
import StatsCard from '@/components/dashboard/StatsCard';
import { 
  Users, 
  Target, 
  Zap, 
  TrendingUp, 
  Award,
  MoreVertical,
  Mail,
  Shield,
  Loader2
} from 'lucide-react';
import { motion } from 'framer-motion';

interface PerformanceStat {
  id: string;
  name: string;
  role: string;
  leads: number;
  conversions: number;
  rate: string;
  score: number;
}

const TeamPage = () => {
  const [performance, setPerformance] = useState<PerformanceStat[]>([]);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();

  useEffect(() => {
    const fetchPerformance = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api'}/employees/performance`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (res.data.success) {
          setPerformance(res.data.data);
        }
      } catch (err) {
        console.error('Error fetching performance:', err);
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchPerformance();
  }, [token]);

  // Aggregated stats
  const totalEmployees = performance.length;
  const avgConversion = totalEmployees > 0 
    ? (performance.reduce((acc, curr) => acc + parseFloat(curr.rate), 0) / totalEmployees).toFixed(1)
    : '0';
  const topPerformer = performance.length > 0 
    ? [...performance].sort((a, b) => b.score - a.score)[0]
    : null;

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Team Intelligence</h1>
            <p className="text-slate-500 font-medium tracking-tight">Personnel performance and productivity tracking</p>
          </div>
          
          <div className="flex items-center gap-3">
             <button className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-lg shadow-indigo-100 transition-all text-sm">
                Add New Member
             </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard title="Active Members" value={totalEmployees} icon={Users} color="indigo" />
          <StatsCard title="Avg Conversion" value={`${avgConversion}%`} icon={Target} color="purple" trend="+2.4% this month" />
          <StatsCard title="Team Velocity" value="92%" icon={Zap} color="cyan" />
          <StatsCard title="Top Performer" value={topPerformer?.name || 'N/A'} icon={Award} color="emerald" />
        </div>

        <div className="flex flex-col gap-6">
           <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
              <TrendingUp className="text-indigo-600" size={24} />
              Performance Ranking
           </h3>

           {loading ? (
             <div className="p-20 flex justify-center"><Loader2 className="animate-spin text-indigo-600" size={40} /></div>
           ) : (
             <div className="glass-card overflow-hidden">
               <table className="w-full text-left border-collapse">
                 <thead>
                   <tr className="bg-slate-50 border-b border-slate-100">
                     <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Member</th>
                     <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Role</th>
                     <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Leads</th>
                     <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Conversions</th>
                     <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Rate</th>
                     <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest text-right">Score</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-100">
                   {performance.map((emp, index) => (
                     <motion.tr 
                       key={emp.id}
                       initial={{ opacity: 0, y: 10 }}
                       animate={{ opacity: 1, y: 0 }}
                       transition={{ delay: index * 0.1 }}
                       className="hover:bg-slate-50/50 group transition-colors"
                     >
                       <td className="px-6 py-4">
                         <div className="flex items-center gap-3">
                           <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center font-bold text-indigo-600">
                             {emp.name.charAt(0)}
                           </div>
                           <div className="flex flex-col">
                             <span className="font-bold text-slate-900 text-sm">{emp.name}</span>
                             <div className="flex items-center gap-1 text-[10px] text-slate-400">
                               <Mail size={10} />
                               <span>E-ID: {emp.id.slice(-6).toUpperCase()}</span>
                             </div>
                           </div>
                         </div>
                       </td>
                       <td className="px-6 py-4">
                         <div className="flex items-center gap-1.5 px-2.5 py-1 bg-white border border-slate-100 rounded-lg text-[10px] font-black text-slate-500 uppercase tracking-tight">
                           <Shield size={10} className="text-indigo-600" />
                           {emp.role.replace('_', ' ')}
                         </div>
                       </td>
                       <td className="px-6 py-4">
                         <span className="text-sm font-bold text-slate-700">{emp.leads}</span>
                       </td>
                       <td className="px-6 py-4">
                         <span className="text-sm font-bold text-emerald-600">{emp.conversions}</span>
                       </td>
                       <td className="px-6 py-4">
                         <div className="flex flex-col gap-1">
                           <span className="text-xs font-black text-slate-900">{emp.rate}%</span>
                           <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                             <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${emp.rate}%` }}></div>
                           </div>
                         </div>
                       </td>
                       <td className="px-6 py-4 text-right">
                         <div className="inline-flex items-center justify-center w-10 h-10 bg-indigo-600 text-white rounded-xl font-black text-sm shadow-lg shadow-indigo-100">
                           {emp.score}
                         </div>
                       </td>
                     </motion.tr>
                   ))}
                 </tbody>
               </table>
             </div>
           )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default TeamPage;
