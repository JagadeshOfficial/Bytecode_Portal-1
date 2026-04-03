'use client';

import React from 'react';
import Sidebar from './Sidebar';
import { useAuth } from '@/context/AuthContext';
import { Bell, Search, User } from 'lucide-react';

const Topbar = () => {
  const { user } = useAuth();
  
  return (
    <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-100 flex items-center justify-between px-8 sticky top-0 z-40">
      <div className="flex items-center gap-4 bg-slate-50 px-4 py-2 rounded-xl w-96">
        <Search className="text-slate-400" size={18} />
        <input 
          type="text" 
          placeholder="Search leads, tasks, or members..." 
          className="bg-transparent border-none outline-none text-sm w-full"
        />
      </div>

      <div className="flex items-center gap-6">
        <button className="relative p-2 text-slate-500 hover:bg-slate-50 rounded-xl transition-all">
          <Bell size={22} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
        </button>

        <div className="flex items-center gap-3 pl-6 border-l border-slate-100">
          <div className="text-right">
            <p className="text-sm font-bold text-slate-900">{user?.name}</p>
            <p className="text-[10px] uppercase font-bold text-indigo-600 tracking-tighter">{user?.role.replace('_', ' ')}</p>
          </div>
          <div className="w-10 h-10 bg-gradient-to-tr from-indigo-500 to-cyan-500 rounded-xl flex items-center justify-center p-0.5 shadow-md">
            <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center">
              <User size={20} className="text-indigo-600" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar />
      <main className="ml-72 flex flex-col min-h-screen">
        <Topbar />
        <div className="p-8 animate-fade-in flex-1">
          {children}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
