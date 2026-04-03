'use client';

import React from 'react';
import { 
  MoreVertical, 
  ExternalLink, 
  PhoneCall, 
  Calendar, 
  CheckCircle2, 
  XSquare, 
  Clock 
} from 'lucide-react';
import { motion } from 'framer-motion';

interface Lead {
  _id: string;
  name: string;
  email: string;
  phone: string;
  course: string;
  status: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  assignedTo?: { name: string };
  score?: number;
  createdAt: string;
}


interface LeadTableProps {
  leads: Lead[];
}

const statusColors: { [key: string]: { bg: string, text: string, icon: any } } = {
  'NEW': { bg: 'bg-blue-50', text: 'text-blue-600', icon: Clock },
  'CONTACTED': { bg: 'bg-purple-50', text: 'text-purple-600', icon: PhoneCall },
  'FOLLOW-UP': { bg: 'bg-amber-50', text: 'text-amber-600', icon: Calendar },
  'INTERESTED': { bg: 'bg-cyan-50', text: 'text-cyan-600', icon: ExternalLink },
  'DEMO': { bg: 'bg-indigo-50', text: 'text-indigo-600', icon: CheckCircle2 },
  'CONVERTED': { bg: 'bg-emerald-50', text: 'text-emerald-600', icon: CheckCircle2 },
  'LOST': { bg: 'bg-rose-50', text: 'text-rose-600', icon: XSquare },
};

const priorityColors: { [key: string]: string } = {
  'LOW': 'bg-slate-100 text-slate-600',
  'MEDIUM': 'bg-amber-100 text-amber-600',
  'HIGH': 'bg-rose-100 text-rose-600',
  'URGENT': 'bg-rose-600 text-white shadow-lg shadow-rose-200'
};

const LeadTable: React.FC<LeadTableProps> = ({ leads }) => {
  return (
    <div className="glass-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Lead Details</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Status</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Score</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Priority</th>

              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Course</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Assigned To</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {leads.map((lead, index) => {
              const status = statusColors[lead.status] || statusColors['NEW'];
              const StatusIcon = status.icon;
              
              return (
                <motion.tr 
                  key={lead._id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-slate-50/50 group transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-900 truncate max-w-[180px]">{lead.name}</span>
                      <span className="text-xs text-slate-500">{lead.phone}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${status.bg} ${status.text}`}>
                      <StatusIcon size={12} />
                      {lead.status}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-[10px] ${
                        (lead.score || 0) > 80 ? 'bg-emerald-100 text-emerald-600' :
                        (lead.score || 0) > 50 ? 'bg-indigo-100 text-indigo-600' :
                        'bg-slate-100 text-slate-400'
                      }`}>
                        {lead.score || 0}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">

                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase ${priorityColors[lead.priority]}`}>
                      {lead.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-medium text-slate-600">{lead.course}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                       <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center text-[10px] font-bold text-indigo-600">
                         {lead.assignedTo?.name?.charAt(0) || 'U'}
                       </div>
                       <span className="text-sm font-semibold text-slate-700 truncate max-w-[100px]">
                         {lead.assignedTo?.name || 'Unassigned'}
                       </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all opacity-0 group-hover:opacity-100">
                      <MoreVertical size={18} />
                    </button>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {leads.length === 0 && (
        <div className="p-12 text-center">
          <p className="text-slate-500 font-medium italic">No leads found.</p>
        </div>
      )}
    </div>
  );
};

export default LeadTable;
