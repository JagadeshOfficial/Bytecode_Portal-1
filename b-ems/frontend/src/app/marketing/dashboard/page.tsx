'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';
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
  Plus,
  Loader2
} from 'lucide-react';
import { motion } from 'framer-motion';

interface Campaign {
  _id: string;
  name: string;
  source: string;
  status: string;
  budget: number;
  spent: number;
  leadCount: number;
  conversionCount: number;
  roi: string;
}

const MarketingDashboard = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api'}/campaigns`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (res.data.success) {
          setCampaigns(res.data.data);
        }
      } catch (err) {
        console.error('Error fetching campaigns:', err);
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchCampaigns();
  }, [token]);

  const totalLeads = campaigns.reduce((acc, curr) => acc + curr.leadCount, 0);
  const totalSpent = campaigns.reduce((acc, curr) => acc + curr.spent, 0);
  const avgROI = campaigns.length > 0 
    ? (campaigns.reduce((acc, curr) => acc + parseFloat(curr.roi), 0) / campaigns.length).toFixed(1)
    : '0';

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
          <StatsCard title="Total Campaigns" value={campaigns.length} icon={Megaphone} color="indigo" />
          <StatsCard title="Leads Generated" value={totalLeads} icon={Users} color="purple" trend="+18% Click-thru" />
          <StatsCard title="Total Spent" value={`$${totalSpent}`} icon={MousePointer2} color="cyan" />
          <StatsCard title="Avg. ROI" value={`${avgROI}x`} icon={Zap} color="emerald" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 glass-card p-8">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
                    <BarChart3 className="text-indigo-600" size={24} />
                    Active Campaign Performance
                </h3>
                {loading && <Loader2 className="animate-spin text-slate-400" size={20} />}
            </div>
            
            <div className="space-y-6">
              {campaigns.map((camp, idx) => (
                <motion.div 
                    key={camp._id} 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-indigo-200 transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                      <Globe size={20} className="text-indigo-600" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">{camp.name}</p>
                      <p className="text-[10px] uppercase font-bold text-slate-400">{camp.source}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-8">
                    <div className="text-right">
                        <p className="text-sm font-black text-slate-900">{camp.leadCount}</p>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tight">Leads</p>
                    </div>
                    <div className="text-right">
                        <p className="text-sm font-black text-emerald-600">{camp.roi}x</p>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tight">ROI</p>
                    </div>
                    <div className={`px-2 py-0.5 rounded text-[10px] font-black tracking-tighter ${camp.status === 'LIVE' ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-200 text-slate-500'}`}>
                      {camp.status}
                    </div>
                  </div>
                </motion.div>
              ))}
              {campaigns.length === 0 && !loading && (
                  <p className="text-center text-slate-400 py-10 font-medium italic">No active campaigns found.</p>
              )}
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
