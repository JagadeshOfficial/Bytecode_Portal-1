'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';
import DashboardLayout from '@/components/layout/DashboardLayout';
import StatsCard from '@/components/dashboard/StatsCard';
import LeadTable from '@/components/leads/LeadTable';
import { 
  Users, 
  Clock, 
  Calendar, 
  PhoneCall, 
  Plus, 
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  TrendingUp
} from 'lucide-react';

import { motion } from 'framer-motion';

const CounsellorLeads = () => {
  const [leads, setLeads] = useState([]);
  const [stats, setStats] = useState({
    myTotal: 0,
    contacted: 0,
    followingUp: 0,
    converted: 0
  });
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api'}/leads`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (res.data.success) {
          const fetchedLeads = res.data.data;
          setLeads(fetchedLeads);
          
          setStats({
            myTotal: fetchedLeads.length,
            contacted: fetchedLeads.filter((l: any) => l.status === 'CONTACTED').length,
            followingUp: fetchedLeads.filter((l: any) => l.status === 'FOLLOW-UP').length,
            converted: fetchedLeads.filter((l: any) => l.status === 'CONVERTED').length
          });
        }
      } catch (err) {
        console.error('Error fetching leads:', err);
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchLeads();
  }, [token]);

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">My Active Leads</h1>
            <p className="text-slate-500 font-medium">Manage your conversions and follow-ups</p>
          </div>
          
          <div className="flex items-center gap-3">
             <button className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-lg shadow-indigo-100 transition-all text-sm">
                <Plus size={18} />
                Quick Log Lead
             </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard title="My Workload" value={stats.myTotal} icon={Users} color="indigo" />
          <StatsCard title="Contacted" value={stats.contacted} icon={PhoneCall} color="purple" />
          <StatsCard title="Follow-ups" value={stats.followingUp} icon={Calendar} color="amber" />
          <StatsCard title="My Conversions" value={stats.converted} icon={CheckCircle2} color="emerald" />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          <div className="xl:col-span-2 flex flex-col gap-6">
             <div className="flex items-center justify-between">
                <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
                   <Clock className="text-indigo-600" size={24} />
                   Priority Leads
                </h3>
                <div className="flex items-center gap-2">
                   <div className="bg-white border border-slate-200 px-3 py-1.5 rounded-lg flex items-center gap-2">
                      <Search size={14} className="text-slate-400" />
                      <input type="text" placeholder="Search..." className="bg-transparent border-none outline-none text-xs font-medium w-32" />
                   </div>
                </div>
             </div>
             
             {loading ? (
                <div className="p-20 flex justify-center"><div className="w-12 h-12 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div></div>
             ) : (
                <LeadTable leads={leads} />
             )}
          </div>

          <div className="flex flex-col gap-6">
             <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
                <Calendar className="text-indigo-600" size={24} />
                Upcoming Follow-ups
             </h3>

             <div className="space-y-4">
                {[
                  { name: 'Alice Johnson', time: '10:30 AM', status: 'OVERDUE', type: 'Call' },
                  { name: 'Bob Smith', time: '12:00 PM', status: 'URGENT', type: 'WhatsApp' },
                  { name: 'Charlie Davis', time: '02:45 PM', status: 'PENDING', type: 'Email' },
                ].map((item, idx) => (
                  <motion.div 
                    key={idx}
                    whileHover={{ scale: 1.02 }}
                    className="glass-card p-4 flex items-center justify-between border-l-4 border-l-rose-500"
                  >
                    <div>
                       <p className="text-sm font-bold text-slate-900">{item.name}</p>
                       <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tight">{item.type} • {item.time}</p>
                    </div>
                    <div className={`px-2 py-0.5 rounded text-[10px] font-black ${item.status === 'OVERDUE' ? 'bg-rose-100 text-rose-600' : 'bg-amber-100 text-amber-600'}`}>
                       {item.status}
                    </div>
                  </motion.div>
                ))}
             </div>
             
             <div className="mt-4 p-6 bg-indigo-600 rounded-3xl relative overflow-hidden group cursor-pointer shadow-xl shadow-indigo-200">
                <div className="relative z-10">
                   <h4 className="text-white font-black text-lg mb-1 tracking-tight">AI Lead Scoring</h4>
                   <p className="text-indigo-100 text-xs font-medium opacity-80 leading-relaxed mb-4">
                      Our system identifies leads most likely to convert today.
                   </p>
                   <button className="bg-white text-indigo-600 text-xs font-black px-4 py-2 rounded-xl flex items-center gap-2 shadow-lg">
                      View Top Predicts
                      <TrendingUp size={14} />
                   </button>
                </div>
                {/* Decoration */}
                <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-all duration-700"></div>
                <div className="absolute top-4 right-4 text-white/20">
                   <AlertCircle size={48} />
                </div>
             </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CounsellorLeads;
