'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';
import DashboardLayout from '@/components/layout/DashboardLayout';
import StatsCard from '@/components/dashboard/StatsCard';
import LeadTable from '@/components/leads/LeadTable';
import { 
  Users, 
  UserCheck, 
  Clock, 
  TrendingUp, 
  Plus, 
  Upload, 
  ArrowRightCircle, 
  Filter,
  Search,
  PieChart as PieChartIcon,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRef } from 'react';


const ManagerDashboard = () => {
  const [leads, setLeads] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    assigned: 0,
    pending: 0,
    converted: 0
  });
  const [notification, setNotification] = useState<{type: 'success' | 'error', message: string} | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { token } = useAuth();

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api'}/leads`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (res.data.success) {
        const fetchedLeads = res.data.data;
        setLeads(fetchedLeads);
        
        // Calculate stats
        const assigned = fetchedLeads.filter((l: any) => l.assignedTo).length;
        const pending = fetchedLeads.filter((l: any) => l.status === 'NEW').length;
        const converted = fetchedLeads.filter((l: any) => l.status === 'CONVERTED').length;
        
        setStats({
          total: fetchedLeads.length,
          assigned,
          pending,
          converted
        });
      }
    } catch (err) {
      console.error('Error fetching leads:', err);
      showNotification('error', 'Failed to fetch leads');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchLeads();
  }, [token]);

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };

  const handleBulkUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    setIsUpdating(true);
    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/leads/bulk`, formData, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      if (res.data.success) {
        showNotification('success', `Successfully uploaded ${res.data.count} leads`);
        fetchLeads();
      }
    } catch (err: any) {
      showNotification('error', err.response?.data?.error || 'Bulk upload failed');
    } finally {
      setIsUpdating(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleRoundRobin = async () => {
    const unassignedLeads = leads.filter((l: any) => !l.assignedTo).map((l: any) => l._id);
    if (unassignedLeads.length === 0) {
        showNotification('error', 'No unassigned leads to distribute');
        return;
    }

    setIsUpdating(true);
    try {
      const res = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/leads/assign-round-robin`, 
        { leadIds: unassignedLeads },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        showNotification('success', res.data.message);
        fetchLeads();
      }
    } catch (err: any) {
      showNotification('error', err.response?.data?.error || 'Round robin failed');
    } finally {
      setIsUpdating(false);
    }
  };


  return (
    <DashboardLayout>
      <div className="flex flex-col gap-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Manager Dashboard</h1>
            <p className="text-slate-500 font-medium">Lead monitoring and team operational center</p>
          </div>
          
          <div className="flex items-center gap-3">
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleBulkUpload} 
              className="hidden" 
              accept=".csv"
            />
            <button 
              onClick={() => fileInputRef.current?.click()}
              disabled={isUpdating}
              className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition-all text-sm disabled:opacity-50"
            >
              {isUpdating ? <Loader2 className="animate-spin" size={18} /> : <Upload size={18} />}
              Bulk Upload
            </button>
            <button 
              onClick={handleRoundRobin}
              disabled={isUpdating}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-xl font-bold transition-all text-sm disabled:opacity-50 border border-indigo-100"
            >
              <RefreshCw className={isUpdating ? "animate-spin" : ""} size={18} />
              Round Robin
            </button>
            <button className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-lg shadow-indigo-100 transition-all text-sm">
              <Plus size={18} />
              Add Lead
            </button>
          </div>
        </div>

        {/* Notification Toast */}
        <AnimatePresence>
          {notification && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`fixed top-24 right-8 z-[100] flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl border ${
                notification.type === 'success' ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : 'bg-rose-50 border-rose-100 text-rose-600'
              }`}
            >
              {notification.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
              <span className="font-bold tracking-tight">{notification.message}</span>
            </motion.div>
          )}
        </AnimatePresence>


        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard 
            title="Total Leads" 
            value={stats.total} 
            icon={Users} 
            color="indigo" 
            trend="+12% from last week" 
          />
          <StatsCard 
            title="Assigned Leads" 
            value={stats.assigned} 
            icon={ArrowRightCircle} 
            color="purple" 
          />
          <StatsCard 
            title="Pending Leads" 
            value={stats.pending} 
            icon={Clock} 
            color="amber" 
          />
          <StatsCard 
            title="Converted" 
            value={stats.converted} 
            icon={UserCheck} 
            color="emerald" 
          />
        </div>

        {/* Lead Management Section */}
        <div className="flex flex-col gap-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="text-indigo-600" size={24} />
              <h2 className="text-xl font-black text-slate-900">Live Traffic Control</h2>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-white border border-slate-200 px-4 py-2 rounded-xl">
                <Search size={16} className="text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Filter by name, phone..." 
                  className="bg-transparent border-none outline-none text-xs font-medium w-48"
                />
              </div>
              <button className="p-2.5 bg-white border border-slate-200 text-slate-500 rounded-xl hover:bg-slate-50 transition-all">
                <Filter size={18} />
              </button>
            </div>
          </div>

          {loading ? (
             <div className="p-20 flex justify-center">
               <div className="w-12 h-12 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
             </div>
          ) : (
            <LeadTable leads={leads} />
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ManagerDashboard;
