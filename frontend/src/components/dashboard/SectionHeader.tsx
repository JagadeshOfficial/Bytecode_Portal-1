'use client';

import React from 'react';
import { LucideIcon, ChevronRight } from 'lucide-react';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  icon?: LucideIcon;
  actionLabel?: string;
  onAction?: () => void;
  badge?: string;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ 
  title, 
  subtitle, 
  icon: Icon, 
  actionLabel, 
  onAction,
  badge
}) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
      <div className="flex items-start gap-4">
        {Icon && (
          <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-100 flex-shrink-0">
            <Icon size={28} />
          </div>
        )}
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight leading-none">{title}</h2>
            {badge && (
              <span className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase tracking-widest border border-indigo-100">
                {badge}
              </span>
            )}
          </div>
          {subtitle && <p className="text-slate-500 font-medium mt-2 text-lg">{subtitle}</p>}
        </div>
      </div>

      {actionLabel && (
        <button 
          onClick={onAction}
          className="group flex items-center gap-2 px-8 py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-black transition-all shadow-xl hover:-translate-y-1 active:scale-95"
        >
          {actionLabel}
          <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
        </button>
      )}
    </div>
  );
};

export default SectionHeader;
