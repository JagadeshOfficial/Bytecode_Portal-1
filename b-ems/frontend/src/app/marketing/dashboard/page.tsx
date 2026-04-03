'use client';

import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import StatsCard from '@/components/dashboard/StatsCard';
import { 
  Send, 
  Megaphone, 
  Users, 
  MousePointer2, 
  BarChart3, 
  Zap,
  Globe,
  Plus
} from 'lucide-react';
import { motion } from 'framer-motion';

const MarketingDashboard = () => {
  return (
    <DashboardLayout>
      <div className="flex flex-col gap-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Campaign Command Center</h1>
            <p className="text-slate-500 font-medium">Growth tracking and marketing analytics</p>
          </div>
          
          <button className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-lg shadow-indigo-100 transition-all text-sm">
            <Plus size={18} />
            New Campaign
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard title="Total Campaigns" value="12" icon={Megaphone} color="indigo" />
          <StatsCard title="Leads Generated" value="842" icon={Users} color="purple" trend="+18% Click-thru" />
          <StatsCard title="Avg. CPC" value="$0.42" icon={MousePointer2} color="cyan" />
          <StatsCard title="ROI Rate" value="4.2x" icon={Zap} color="emerald" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 glass-card p-8">
            <h3 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-2">
              <BarChart3 className="text-indigo-600" size={24} />
              Active Campaign Performance
            </h3>
            
            <div className="space-y-6">
              {[
                { name: 'Summer Intake 2026', source: 'Facebook Ads', leads: 432, status: 'live' },
                { name: 'Tech Workshop Webinar', source: 'Instagram', leads: 215, status: 'live' },
                { name: 'Career Fair Outreach', source: 'LinkedIn', leads: 95, status: 'paused' },
              ].map((camp, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-indigo-200 transition-all">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                      <Globe size={20} className="text-indigo-600" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">{camp.name}</p>
                      <p className="text-[10px] uppercase font-bold text-slate-400">{camp.source}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="text-sm font-black text-slate-900">{camp.leads}</p>
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tight">Leads</p>
                    </div>
                    <div className={`px-2 py-0.5 rounded text-[10px] font-black tracking-tighter ${camp.status === 'live' ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-200 text-slate-500'}`}>
                      {camp.status.toUpperCase()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card p-8">
            <h3 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-2">
              <Send className="text-indigo-600" size={24} />
              Quick Content Tasks
            </h3>
            <div className="space-y-4">
              {[
                { task: 'New reel for Course Promo', due: 'Today' },
                { task: 'Email Blast: Upcoming Batch', due: 'Tomorrow' },
                { task: 'Update LinkedIn Header', due: 'Apr 10' },
              ].map((item, idx) => (
                <div key={idx} className="p-4 border border-slate-100 rounded-2xl hover:bg-indigo-50/50 transition-all cursor-pointer">
                  <p className="text-sm font-bold text-slate-800 mb-1">{item.task}</p>
                  <p className="text-[10px] font-black text-rose-500 uppercase">Due {item.due}</p>
                </div>
              ))}
              <button className="w-full mt-4 py-3 bg-slate-50 hover:bg-slate-100 text-slate-500 rounded-xl text-xs font-bold transition-all">
                VIEW ALL TASKS
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default MarketingDashboard;
