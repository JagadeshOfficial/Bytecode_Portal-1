'use client';

import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import StatsCard from '@/components/dashboard/StatsCard';
import SectionHeader from '@/components/dashboard/SectionHeader';
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  MessageSquare, 
  TrendingUp, 
  Activity,
  Zap,
  ArrowRight
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';

const UniversalDashboard = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-10">
        
        <SectionHeader 
          title={`Welcome Back, ${user?.name || 'User'}`}
          subtitle="Your personalized employee hub for tasks, communications, and tracking."
          icon={LayoutDashboard}
          badge={user?.role?.replace('_', ' ') || 'EMPLOYEE'}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard 
            title="Assigned Tasks" 
            value="4" 
            icon={Activity} 
            color="indigo" 
            trend="2 high priority"
            delay={0.1}
          />
          <StatsCard 
            title="Unread Messages" 
            value="12" 
            icon={MessageSquare} 
            color="purple" 
            trend="New from HR"
            delay={0.2}
          />
          <StatsCard 
            title="Attendance Score" 
            value="98%" 
            icon={Zap} 
            color="emerald" 
            trend="Excellent"
            delay={0.3}
          />
          <StatsCard 
            title="Leave Balance" 
            value="14" 
            icon={Calendar} 
            color="amber" 
            trend="Days remaining"
            delay={0.4}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           <div className="lg:col-span-2 bg-white rounded-[2rem] border border-slate-100 p-8 shadow-sm">
              <h3 className="text-xl font-black text-slate-900 tracking-tight mb-8">Recent Activity</h3>
              <div className="space-y-6">
                 {[
                   { title: 'Login from New Device', desc: 'Success • Chrome / Windows', time: '2m ago' },
                   { title: 'Task Completed', desc: 'Monthly Report Node #4', time: '1h ago' },
                   { title: 'Leave Approved', desc: 'Casual Leave (1 Day)', time: '4h ago' },
                 ].map((act, i) => (
                   <div key={i} className="flex items-center gap-4 group cursor-pointer p-4 hover:bg-slate-50 rounded-2xl transition-all border border-transparent hover:border-slate-100">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                         <Activity size={18} />
                      </div>
                      <div>
                         <p className="text-sm font-bold text-slate-900">{act.title}</p>
                         <p className="text-xs text-slate-500 font-medium">{act.desc}</p>
                      </div>
                      <span className="ml-auto text-[10px] font-black text-slate-300 uppercase">{act.time}</span>
                   </div>
                 ))}
              </div>
           </div>

           <div className="bg-slate-900 rounded-[2rem] p-8 text-white shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-20">
                 <Zap size={64} className="text-indigo-400" />
              </div>
              <h4 className="text-xl font-black mb-2">Quick Actions</h4>
              <p className="text-slate-400 text-xs font-medium mb-10">Commonly used system nodes.</p>
              
              <div className="space-y-4">
                 {[
                   { name: 'Mark Attendance', icon: Users },
                   { name: 'Request Leave', icon: Calendar },
                   { name: 'View Paystub', icon: TrendingUp },
                 ].map((action, i) => (
                   <button key={i} className="w-full flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all group">
                      <div className="flex items-center gap-3">
                         <action.icon size={18} className="text-indigo-400" />
                         <span className="text-sm font-bold">{action.name}</span>
                      </div>
                      <ArrowRight size={16} className="text-slate-500 group-hover:text-white transition-colors" />
                   </button>
                 ))}
              </div>
           </div>
        </div>

      </div>
    </DashboardLayout>
  );
};

export default UniversalDashboard;
