import React from 'react';
import { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  color: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon: Icon, trend, color }) => {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="glass-card p-6 flex items-start justify-between"
    >
      <div>
        <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-1">{title}</p>
        <h3 className="text-3xl font-black text-slate-900 mb-2">{value}</h3>
        {trend && (
          <p className="text-xs font-bold text-emerald-500 flex items-center gap-1 bg-emerald-50 w-fit px-2 py-0.5 rounded-full">
            {trend}
          </p>
        )}
      </div>
      <div className={`p-4 rounded-2xl bg-${color}-50 text-${color}-600`}>
        <Icon size={24} />
      </div>
    </motion.div>
  );
};

export default StatsCard;
