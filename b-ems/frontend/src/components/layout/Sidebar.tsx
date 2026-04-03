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
  TrendingUp
} from 'lucide-react';

const Sidebar = () => {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const getNavLinks = () => {
    const common = [{ name: 'Dashboard', href: `/${user?.role.toLowerCase()}/dashboard`, icon: LayoutDashboard }];

    switch (user?.role) {
      case 'CEO':
        return [
          { name: 'Dashboard', href: '/ceo/dashboard', icon: LayoutDashboard },
          { name: 'Leads Overview', href: '/ceo/leads-overview', icon: BarChart3 },
          { name: 'Team Performance', href: '/ceo/team-insights', icon: Activity },
          { name: 'Assignment Rules', href: '/ceo/settings', icon: Settings },
        ];
      case 'MANAGER':
        return [
          { name: 'Dashboard', href: '/manager/dashboard', icon: LayoutDashboard },
          { name: 'Lead Management', href: '/manager/leads', icon: Users },
          { name: 'Bulk Assignment', href: '/manager/leads/assign', icon: UserPlus },
          { name: 'Follow-ups', href: '/manager/followups', icon: Calendar },
          { name: 'Team Tracking', href: '/manager/team', icon: Activity },
        ];
      case 'COUNSELLOR':
        return [
          { name: 'My Leads', href: '/counsellor/leads', icon: Users },
          { name: 'Follow-ups', href: '/counsellor/followups', icon: Calendar },
          { name: 'Call History', href: '/counsellor/history', icon: PhoneCall },
        ];
      case 'MARKETING_LEAD':
      case 'MARKETING_EMPLOYEE':
        return [
          { name: 'Campaigns', href: '/marketing/campaigns', icon: Send },
          { name: 'Content Library', href: '/marketing/content', icon: Globe },
          { name: 'SEO Dashboard', href: '/marketing/seo', icon: TrendingUp },
        ];
      case 'PLACEMENT_OFFICER':
        return [
          { name: 'Student Placement', href: '/placement/students', icon: GraduationCap },
          { name: 'Company Portal', href: '/placement/companies', icon: Briefcase },
          { name: 'Interviews', href: '/placement/interviews', icon: Calendar },
        ];
      default:
        return common;
    }
  };

  const navLinks = getNavLinks();

  return (
    <aside className="w-72 bg-white h-screen fixed left-0 top-0 border-r border-slate-200 flex flex-col overflow-y-auto z-50">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center">
            <span className="text-white font-black text-xl">B</span>
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900 leading-none">B-EMS</h1>
            <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mt-1">Enterprise System</p>
          </div>
        </div>

        <nav className="space-y-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                  isActive 
                    ? 'bg-indigo-50 text-indigo-600 font-semibold' 
                    : 'text-slate-600 hover:bg-slate-50 hover:text-indigo-600'
                }`}
              >
                <Icon size={20} className={`${isActive ? 'text-indigo-600' : 'text-slate-400 group-hover:text-indigo-600'}`} />
                <span>{link.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="mt-auto p-6 border-t border-slate-100">
        <div className="bg-slate-50 rounded-2xl p-4 mb-4">
          <p className="text-xs text-slate-500 mb-1">Logged in as</p>
          <p className="text-sm font-bold text-slate-900 truncate">{user?.name}</p>
          <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-tighter">{user?.role}</p>
        </div>
        <button 
          onClick={logout}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 hover:bg-rose-50 hover:text-rose-600 transition-all w-full font-medium"
        >
          <LogOut size={20} />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
