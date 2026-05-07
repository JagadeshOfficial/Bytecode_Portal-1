'use client';

import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useAuth } from '@/context/AuthContext';
import { 
  Users, 
  BarChart3, 
  Clock, 
  CheckCircle2, 
  ArrowRight,
  Sparkles,
  Calendar,
  Zap,
  ChevronRight
} from 'lucide-react';
import { motion } from 'framer-motion';

const EMSDashboard = () => {
  const { user } = useAuth();

  const stats = [
    { title: 'Total Members', value: '1,284', icon: Users, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { title: 'Active Tasks', value: '42', icon: Zap, color: 'text-amber-600', bg: 'bg-amber-50' },
    { title: 'Completed', value: '892', icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { title: 'Uptime', value: '99.9%', icon: BarChart3, color: 'text-cyan-600', bg: 'bg-cyan-50' },
  ];

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Welcome Section */}
        <div className="relative overflow-hidden rounded-[2rem] bg-slate-900 p-10 text-white shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/20 blur-[100px] -translate-y-1/2 translate-x-1/4" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/10 text-xs font-bold tracking-widest uppercase text-indigo-300">
                <Sparkles size={14} />
                Operational Hub
              </div>
              <h1 className="text-4xl md:text-5xl font-black tracking-tight">
                Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-cyan-300">{user?.name || 'Explorer'}</span>.
              </h1>
              <p className="text-slate-400 text-lg max-w-xl font-medium">
                Your organizational overview is ready. Monitor global activity, manage team nodes, and optimize your workflow from one command center.
              </p>
            </div>
            
            <button className="px-8 py-4 bg-white text-black rounded-2xl font-black text-lg hover:scale-105 transition-transform shadow-xl">
              Quick Actions
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <motion.div 
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white border border-slate-100 rounded-[2rem] p-8 hover:shadow-xl hover:shadow-slate-200/50 transition-all group cursor-pointer"
            >
              <div className={`w-14 h-14 ${stat.bg} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                <stat.icon className={stat.color} size={28} />
              </div>
              <p className="text-slate-500 font-bold text-sm uppercase tracking-widest mb-1">{stat.title}</p>
              <h3 className="text-4xl font-black text-slate-900 tracking-tight">{stat.value}</h3>
            </motion.div>
          ))}
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white border border-slate-100 rounded-[2rem] overflow-hidden">
              <div className="p-8 border-b border-slate-50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                    <Calendar size={20} />
                  </div>
                  <h2 className="text-xl font-black text-slate-900">Recent Activity</h2>
                </div>
                <button className="text-sm font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1">
                  View All <ChevronRight size={16} />
                </button>
              </div>
              
              <div className="p-4">
                {[1, 2, 3, 4].map((item) => (
                  <div key={item} className="flex items-center justify-between p-4 hover:bg-slate-50 rounded-2xl transition-colors cursor-pointer group">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center font-bold text-slate-500 group-hover:bg-white group-hover:shadow-md transition-all">
                        {item}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">Updated system architecture</p>
                        <p className="text-sm text-slate-500 font-medium">Modified by Admin • 2 hours ago</p>
                      </div>
                    </div>
                    <div className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-black tracking-widest uppercase">
                      Resolved
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar Area */}
          <div className="space-y-8">
            <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-[2rem] p-8 text-white shadow-xl relative overflow-hidden group">
              <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              <h3 className="text-2xl font-black mb-4">System Health</h3>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between text-sm font-bold mb-2">
                    <span>Performance</span>
                    <span>98%</span>
                  </div>
                  <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: '98%' }}
                      className="h-full bg-white" 
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm font-bold mb-2">
                    <span>Storage</span>
                    <span>42%</span>
                  </div>
                  <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: '42%' }}
                      className="h-full bg-cyan-300" 
                    />
                  </div>
                </div>
              </div>
              <button className="w-full mt-8 py-4 bg-white/20 backdrop-blur-md border border-white/30 rounded-2xl font-bold hover:bg-white/30 transition-all flex items-center justify-center gap-2">
                Launch Diagnostics <ArrowRight size={18} />
              </button>
            </div>
          </div>

        </div>
      </div>
    </DashboardLayout>
  );
};

export default EMSDashboard;
