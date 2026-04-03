'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';
import DashboardLayout from '@/components/layout/DashboardLayout';
import StatsCard from '@/components/dashboard/StatsCard';
import { 
  TrendingUp, 
  BarChart3, 
  PieChart as PieChartIcon, 
  Users, 
  DollarSign, 
  Target, 
  Award,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { motion } from 'framer-motion';

const CEODashboard = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api'}/leads`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.data.success) {
          setLeads(res.data.data);
        }
      } catch (err) {
        console.error('Error fetching leads:', err);
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchData();
  }, [token]);

  const totalLeads = leads.length;
  const convertedLeads = leads.filter((l: any) => l.status === 'CONVERTED').length;
  const conversionRate = totalLeads > 0 ? ((convertedLeads / totalLeads) * 100).toFixed(1) : 0;

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Executive Overview</h1>
            <p className="text-slate-500 font-medium tracking-tight">Strategic insights and revenue performance</p>
          </div>
          
          <div className="flex items-center gap-3">
             <div className="bg-emerald-50 text-emerald-600 px-4 py-2 rounded-xl border border-emerald-100 flex items-center gap-2">
               <TrendingUp size={18} />
               <span className="font-bold text-sm tracking-tighter">LIVE PERFORMANCE MODE</span>
             </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard title="Total Leads" value={totalLeads} icon={Users} color="indigo" />
          <StatsCard title="Conversion %" value={`${conversionRate}%`} icon={Target} color="emerald" trend="+2.4% vs last month" />
          <StatsCard title="Est. Revenue" value="$42,500" icon={DollarSign} color="cyan" />
          <StatsCard title="Top Source" value="Google Search" icon={Award} color="amber" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="glass-card p-8">
            <h3 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-2">
              <BarChart3 className="text-indigo-600" size={24} />
              Lead Funnel Visualization
            </h3>
            
            <div className="space-y-6">
              {[
                { label: 'Total Leads', count: totalLeads, color: 'bg-indigo-600', percent: 100 },
                { label: 'Contacted', count: leads.filter((l: any) => l.status === 'CONTACTED' || l.status === 'FOLLOW-UP').length, color: 'bg-cyan-500', percent: 65 },
                { label: 'Interested', count: leads.filter((l: any) => l.status === 'INTERESTED').length, color: 'bg-emerald-500', percent: 40 },
                { label: 'Conversion', count: convertedLeads, color: 'bg-rose-500', percent: conversionRate }
              ].map((item, idx) => (
                <div key={idx} className="relative group">
                   <div className="flex justify-between mb-2">
                     <span className="text-sm font-bold text-slate-700 tracking-tight">{item.label}</span>
                     <span className="text-sm font-black text-slate-900">{item.count}</span>
                   </div>
                   <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                     <motion.div 
                       initial={{ width: 0 }}
                       animate={{ width: `${item.percent}%` }}
                       transition={{ duration: 0.8, delay: idx * 0.1 }}
                       className={`h-full ${item.color} rounded-full`}
                     />
                   </div>
                </div>
              ))}
            </div>
            
            <div className="mt-8 p-4 bg-slate-50 rounded-2xl border border-slate-100 italic text-sm text-slate-500 text-center">
              "Funnel health is currently within expected enterprise parameters."
            </div>
          </div>

          <div className="glass-card p-8 group">
            <h3 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-2">
              <TrendingUp className="text-indigo-600" size={24} />
              Performance Ranking
            </h3>

            <div className="space-y-4">
              {[
                { name: 'John Doe', role: 'Sr. Counsellor', score: 98, trend: 'up' },
                { name: 'Sarah Smith', role: 'Sales Lead', score: 92, trend: 'up' },
                { name: 'Michael Ross', role: 'Counsellor', score: 85, trend: 'down' },
              ].map((emp, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 bg-slate-50 group-hover:bg-white border boundary-transparent border-slate-100 hover:border-slate-200 rounded-2xl transition-all">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-xl flex items-center justify-center font-black text-white text-sm">
                      {idx + 1}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 text-sm tracking-tight">{emp.name}</p>
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tight">{emp.role}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-black text-slate-900 tracking-tighter">{emp.score}</span>
                    {emp.trend === 'up' ? <ArrowUpRight className="text-emerald-500" size={16} /> : <ArrowDownRight className="text-rose-500" size={16} />}
                  </div>
                </div>
              ))}
            </div>
            
            <button className="w-full mt-6 py-4 border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 hover:text-indigo-600 hover:border-indigo-400 font-bold text-sm transition-all tracking-tight">
              View Detailed Analytics
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CEODashboard;
