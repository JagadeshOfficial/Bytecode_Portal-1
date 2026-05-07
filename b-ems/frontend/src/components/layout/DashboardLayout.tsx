'use client';

import React from 'react';
import Sidebar from './Sidebar';
import { useAuth } from '@/context/AuthContext';
import { Bell, Search, User, Moon, Sun, Settings, Command } from 'lucide-react';
import { motion } from 'framer-motion';

const Topbar = () => {
  const { user } = useAuth();
  
  return (
    <header className="h-20 bg-white/60 backdrop-blur-2xl border-b border-slate-100 flex items-center justify-between px-10 sticky top-0 z-40">
      <div className="flex items-center gap-4 bg-slate-100/50 border border-slate-200/50 px-4 py-2.5 rounded-2xl w-[400px] transition-all focus-within:w-[450px] focus-within:bg-white focus-within:shadow-lg group">
        <Search className="text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
        <input 
          type="text" 
          placeholder="Global system search... (Cmd + K)" 
          className="bg-transparent border-none outline-none text-sm font-bold text-slate-900 w-full placeholder:text-slate-400 placeholder:font-medium"
        />
        <div className="flex items-center gap-1 bg-white border border-slate-200 px-1.5 py-0.5 rounded-md text-[10px] font-black text-slate-400">
           <Command size={10} /> K
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
           <button className="p-2 text-slate-500 bg-white shadow-sm rounded-lg transition-all">
             <Sun size={18} />
           </button>
           <button className="p-2 text-slate-400 hover:text-slate-600 rounded-lg transition-all">
             <Moon size={18} />
           </button>
        </div>

        <button className="relative p-2.5 text-slate-500 hover:bg-slate-100 rounded-xl transition-all group">
          <Bell size={20} />
          <span className="absolute top-2 right-2.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white animate-pulse"></span>
        </button>

        <div className="h-8 w-[1px] bg-slate-200 mx-2" />

        <div className="flex items-center gap-4 cursor-pointer group">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-black text-slate-900 tracking-tight leading-none mb-1 group-hover:text-indigo-600 transition-colors">{user?.name}</p>
            <p className="text-[10px] uppercase font-black text-indigo-600 tracking-widest leading-none">{user?.role?.replace('_', ' ')}</p>
          </div>
          <div className="w-12 h-12 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center p-[2px] shadow-lg group-hover:scale-105 transition-transform duration-300">
            <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center overflow-hidden">
               <User size={24} className="text-indigo-600" />
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
    <div className="min-h-screen bg-[#f8fafc]">
      <Sidebar />
      <main className="ml-72 flex flex-col min-h-screen relative">
        <Topbar />
        <div className="p-10 flex-1 animate-fade-in max-w-[1600px] mx-auto w-full">
          {children}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
