'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { 
  LayoutDashboard, 
  Users, 
  UserPlus, 
  BarChart3, 
  PhoneCall, 
  Calendar, 
  Send, 
  Activity, 
  Settings, 
  LogOut, 
  Briefcase,
  GraduationCap,
  Globe,
  TrendingUp,
  ShieldCheck,
  CreditCard,
  MessageSquare,
  Search,
  Bell,
  Layers,
  Sparkles
} from 'lucide-react';
import { motion } from 'framer-motion';

const Sidebar = () => {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const getNavLinks = () => {
    switch (user?.role) {
      case 'CEO':
      case 'SUPER_ADMIN':
        return [
          { group: 'Control Center', links: [
            { name: 'Dashboard', href: '/ceo/dashboard', icon: LayoutDashboard },
            { name: 'Role Management', href: '/ceo/roles', icon: ShieldCheck },
            { name: 'Branch Ops', href: '/ceo/branches', icon: Globe },
          ]},
          { group: 'Analytics', links: [
            { name: 'Revenue Matrix', href: '/ceo/revenue', icon: BarChart3 },
            { name: 'Growth Graphs', href: '/ceo/growth', icon: TrendingUp },
            { name: 'Team Insights', icon: Activity, href: '/ceo/performance' },
          ]},
          { group: 'HR & Finance', links: [
            { name: 'Employee Node', href: '/ceo/employees', icon: Users },
            { name: 'Salary Control', href: '/ceo/salaries', icon: CreditCard },
          ]}
        ];
      case 'MANAGER':
      case 'ADMIN':
        return [
          { group: 'Operations', links: [
            { name: 'Dashboard', href: '/manager/dashboard', icon: LayoutDashboard },
            { name: 'Lead Traffic', href: '/manager/leads', icon: Users },
            { name: 'Batch Control', href: '/manager/batches', icon: Layers },
          ]},
          { group: 'Management', links: [
            { name: 'Attendance', href: '/manager/attendance', icon: UserPlus },
            { name: 'Schedule', href: '/manager/schedule', icon: Calendar },
            { name: 'Reports', href: '/manager/reports', icon: BarChart3 },
          ]}
        ];
      case 'COUNSELLOR':
        return [
          { group: 'Pipeline', links: [
            { name: 'Active Leads', href: '/counsellor/leads', icon: Users },
            { name: 'Admissions', href: '/counsellor/admissions', icon: GraduationCap },
          ]},
          { group: 'Engagement', links: [
            { name: 'Follow-ups', href: '/counsellor/followups', icon: Calendar },
            { name: 'Communications', href: '/counsellor/chat', icon: MessageSquare },
          ]}
        ];
      case 'SEO':
      case 'MARKETING':
        return [
          { group: 'Traffic Control', links: [
            { name: 'Analytics', href: '/marketing/dashboard', icon: TrendingUp },
            { name: 'Campaigns', href: '/marketing/campaigns', icon: Send },
          ]},
          { group: 'Optimization', links: [
            { name: 'SEO Core', href: '/marketing/seo', icon: Globe },
            { name: 'Content Hub', href: '/marketing/content', icon: Briefcase },
          ]}
        ];
      default:
        return [
          { group: 'General', links: [
            { name: 'Dashboard', href: '/ems/dashboard', icon: LayoutDashboard },
          ]}
        ];
    }
  };

  const navGroups = getNavLinks();

  return (
    <aside className="w-72 bg-[#0f172a] h-screen fixed left-0 top-0 flex flex-col z-50 shadow-2xl">
      {/* Premium Header */}
      <div className="p-8">
        <div className="flex items-center gap-4 mb-10 group cursor-pointer">
          <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-500">
            <Sparkles className="text-white" size={24} />
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tighter text-white leading-none">B-EMS</h1>
            <p className="text-[10px] uppercase tracking-widest text-indigo-400 font-bold mt-1">Enterprise Node</p>
          </div>
        </div>

        <nav className="space-y-8">
          {navGroups.map((group, gIdx) => (
            <div key={group.group || gIdx}>
              <h3 className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-black mb-4 px-4">{group.group}</h3>
              <div className="space-y-1">
                {group.links.map((link) => {
                  const Icon = link.icon;
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.name}
                      href={link.href}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group relative ${
                        isActive 
                          ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' 
                          : 'text-slate-400 hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      <Icon size={18} className={`${isActive ? 'text-white' : 'text-slate-500 group-hover:text-indigo-400'} transition-colors`} />
                      <span className="text-sm font-bold tracking-tight">{link.name}</span>
                      {isActive && (
                        <motion.div 
                          layoutId="active-pill"
                          className="absolute right-0 w-1 h-6 bg-white rounded-l-full"
                        />
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </div>

      {/* Premium Footer Profile */}
      <div className="mt-auto p-6 bg-black/20">
        <div className="flex items-center gap-4 mb-6 p-2">
           <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-cyan-500 flex items-center justify-center font-bold text-white shadow-md border border-white/10">
             {user?.name?.[0] || 'U'}
           </div>
           <div className="overflow-hidden">
             <p className="text-sm font-bold text-white truncate">{user?.name}</p>
             <p className="text-[10px] font-black text-indigo-400 uppercase tracking-tighter truncate">{user?.role?.replace('_', ' ')}</p>
           </div>
        </div>
        
        <button 
          onClick={logout}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-500 hover:bg-rose-500/10 hover:text-rose-400 transition-all w-full font-bold text-sm"
        >
          <LogOut size={18} />
          <span>Terminate Session</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
