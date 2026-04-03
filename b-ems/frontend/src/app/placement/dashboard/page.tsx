'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';
import DashboardLayout from '@/components/layout/DashboardLayout';
import StatsCard from '@/components/dashboard/StatsCard';
import { 
  GraduationCap, 
  Briefcase, 
  Calendar, 
  CheckCircle2, 
  Users, 
  TrendingUp, 
  Building2,
  Plus,
  Loader2
} from 'lucide-react';
import { motion } from 'framer-motion';

interface PlacementStats {
  totalStudents: number;
  eligibleStudents: number;
  placedStudents: number;
  totalCompanies: number;
  avgPackage: string;
}

const PlacementDashboard = () => {
  const [stats, setStats] = useState<PlacementStats | null>(null);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api'}/placement/stats`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (res.data.success) {
          setStats(res.data.data);
        }
      } catch (err) {
        console.error('Error fetching placement stats:', err);
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchStats();
  }, [token]);

  if (loading) {
      return (
          <DashboardLayout>
              <div className="p-20 flex justify-center"><Loader2 className="animate-spin text-indigo-600" size={40} /></div>
          </DashboardLayout>
      );
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Career Placement Center</h1>
            <p className="text-slate-500 font-medium">Student success and corporate relations</p>
          </div>
          
          <div className="flex items-center gap-3">
             <button className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-lg shadow-indigo-100 transition-all text-sm">
                <Plus size={18} />
                Post New Job
             </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard title="Eligible Students" value={stats?.eligibleStudents || 0} icon={Users} color="indigo" />
          <StatsCard title="Hiring Partners" value={stats?.totalCompanies || 0} icon={Building2} color="purple" trend="+3 New" />
          <StatsCard title="Placed Students" value={stats?.placedStudents || 0} icon={CheckCircle2} color="emerald" />
          <StatsCard title="Avg. Package" value={stats?.avgPackage || 'N/A'} icon={TrendingUp} color="cyan" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 glass-card p-8">
            <h3 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-2">
              <Briefcase className="text-indigo-600" size={24} />
              Recent Job Openings
            </h3>
            
            <div className="space-y-6">
              {[
                { company: 'Google', role: 'SDE-1', type: 'Full-time', package: '18 LPA' },
                { company: 'Meta', role: 'UI Developer', type: 'Remote', package: '12 LPA' },
                { company: 'Bytecode Corp', role: 'Full Stack Dev', type: 'Hybrid', package: '8 LPA' },
              ].map((job, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-indigo-200 transition-all">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                      <Building2 size={20} className="text-indigo-600" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">{job.role}</p>
                      <p className="text-[10px] uppercase font-bold text-slate-400">{job.company} • {job.type}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-black text-slate-900">{job.package}</p>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tight">Package</p>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-xs font-bold transition-all">
               VIEW ALL CORPORATE PARTNERS
            </button>
          </div>

          <div className="glass-card p-8">
            <h3 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-2">
              <Calendar className="text-indigo-600" size={24} />
              Interview Schedule
            </h3>
            <div className="space-y-4">
              {[
                { student: 'John Smith', with: 'Google', time: '10:00 AM', status: 'CONFIRMED' },
                { student: 'Alice Brown', with: 'Meta', time: '11:45 AM', status: 'PENDING' },
                { student: 'Bob Wilson', with: 'Bytecode', time: '02:30 PM', status: 'CONFIRMED' },
              ].map((item, idx) => (
                <div key={idx} className="p-4 border border-slate-100 rounded-2xl hover:bg-indigo-50/50 transition-all cursor-pointer">
                  <div className="flex justify-between items-start mb-1">
                     <p className="text-sm font-bold text-slate-800">{item.student}</p>
                     <span className={`px-2 py-0.5 rounded text-[10px] font-black ${item.status === 'CONFIRMED' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'}`}>
                        {item.status}
                     </span>
                  </div>
                  <p className="text-[10px] font-black text-slate-400 uppercase">Interview with {item.with} @ {item.time}</p>
                </div>
              ))}
              <div className="mt-8 bg-indigo-600 p-6 rounded-3xl relative overflow-hidden group shadow-xl shadow-indigo-200">
                <div className="relative z-10">
                   <h4 className="text-white font-black text-lg mb-1 tracking-tight">Placement Assist AI</h4>
                   <p className="text-indigo-100 text-xs font-medium opacity-80 mb-4">
                      Identify students with 90%+ match for current job roles using AI scoring.
                   </p>
                   <button className="bg-white text-indigo-600 text-xs font-black px-4 py-2 rounded-xl flex items-center gap-2 shadow-lg">
                      Match Students
                      <GraduationCap size={14} />
                   </button>
                </div>
                <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-all duration-700"></div>
                <div className="absolute top-4 right-4 text-white/20"><Briefcase size={48} /></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default PlacementDashboard;
