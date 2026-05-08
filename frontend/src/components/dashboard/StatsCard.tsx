'use client';

import React from 'react';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';
import { motion } from 'framer-motion';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  trendUp?: boolean;
  color?: 'indigo' | 'purple' | 'emerald' | 'amber' | 'rose' | 'cyan';
  delay?: number;
}

const colorMap = {
  indigo: { bg: 'bg-indigo-50', icon: 'text-indigo-600', border: 'border-indigo-100', glow: 'shadow-indigo-100' },
  purple: { bg: 'bg-purple-50', icon: 'text-purple-600', border: 'border-purple-100', glow: 'shadow-purple-100' },
  emerald: { bg: 'bg-emerald-50', icon: 'text-emerald-600', border: 'border-emerald-100', glow: 'shadow-emerald-100' },
  amber: { bg: 'bg-amber-50', icon: 'text-amber-600', border: 'border-amber-100', glow: 'shadow-amber-100' },
  rose: { bg: 'bg-rose-50', icon: 'text-rose-600', border: 'border-rose-100', glow: 'shadow-rose-100' },
  cyan: { bg: 'bg-cyan-50', icon: 'text-cyan-600', border: 'border-cyan-100', glow: 'shadow-cyan-100' },
};

const StatsCard: React.FC<StatsCardProps> = ({ 
  title, 
  value, 
  icon: Icon, 
  trend, 
  trendUp = true, 
  color = 'indigo',
  delay = 0 
}) => {
  const styles = colorMap[color];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="bg-white border border-slate-100 rounded-[2rem] p-8 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all group cursor-pointer relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 p-4 opacity-5 transform translate-x-4 -translate-y-4 group-hover:translate-x-0 group-hover:translate-y-0 transition-transform duration-500">
         <Icon size={120} />
      </div>

      <div className="relative z-10">
        <div className={`w-14 h-14 ${styles.bg} ${styles.border} border rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500`}>
          <Icon className={styles.icon} size={28} />
        </div>
        
        <p className="text-slate-500 font-bold text-xs uppercase tracking-widest mb-1">{title}</p>
        <div className="flex items-baseline gap-3">
          <h3 className="text-4xl font-black text-slate-900 tracking-tight">{value}</h3>
          {trend && (
            <div className={`flex items-center gap-1 text-[10px] font-black px-2 py-0.5 rounded-full ${trendUp ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
              {trendUp ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
              {trend}
            </div>
          )}
        </div>
      </div>
      
      <div className="mt-6 flex items-center gap-2">
         <div className="flex-1 h-1 bg-slate-50 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: '70%' }}
              transition={{ duration: 1, delay: delay + 0.5 }}
              className={`h-full ${styles.icon.replace('text', 'bg')}`} 
            />
         </div>
      </div>
    </motion.div>
  );
};

export default StatsCard;
