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
  Layers,
  Sparkles,
  ClipboardList,
  Target,
  FileText,
  Zap,
  MapPin,
  Clock,
  History,
  Lock,
  Search,
  BookOpen,
  PieChart,
  Megaphone
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
          { group: 'Command Center', links: [
            { name: 'Dashboard', href: '/ceo/dashboard', icon: LayoutDashboard },
            { name: 'Role Management', href: '/ceo/roles', icon: ShieldCheck },
            { name: 'User Permissions', href: '/ceo/permissions', icon: Lock },
            { name: 'Audit Logs', href: '/ceo/audit', icon: History },
          ]},
          { group: 'Strategic Oversight', links: [
            { name: 'Revenue Matrix', href: '/ceo/revenue', icon: BarChart3 },
            { name: 'Growth Analytics', href: '/ceo/growth', icon: TrendingUp },
            { name: 'Performance AI', href: '/ceo/ai-insights', icon: Zap },
          ]},
          { group: 'Operations Hub', links: [
            { name: 'Branch Ops', href: '/ceo/branches', icon: MapPin },
            { name: 'Departmental', href: '/ceo/departments', icon: Layers },
            { name: 'Global Reports', href: '/ceo/reports', icon: FileText },
          ]},
          { group: 'Human Capital', links: [
            { name: 'Employee Node', href: '/ceo/employees', icon: Users },
            { name: 'Salary Control', href: '/ceo/salaries', icon: CreditCard },
            { name: 'Leave Approvals', href: '/ceo/leaves', icon: Calendar },
          ]}
        ];
      case 'MANAGER':
      case 'ADMIN':
        return [
          { group: 'Academy Ops', links: [
            { name: 'Dashboard', href: '/manager/dashboard', icon: LayoutDashboard },
            { name: 'Student Mgt', href: '/manager/students', icon: GraduationCap },
            { name: 'Batch Control', href: '/manager/batches', icon: Layers },
            { name: 'Course Hub', href: '/manager/courses', icon: BookOpen },
          ]},
          { group: 'Management', links: [
            { name: 'Attendance Node', href: '/manager/attendance', icon: UserPlus },
            { name: 'Daily Schedule', href: '/manager/schedule', icon: Calendar },
            { name: 'Task Board', href: '/manager/tasks', icon: ClipboardList },
          ]},
          { group: 'Finance & CRM', links: [
            { name: 'Fee Collection', href: '/manager/finance', icon: CreditCard },
            { name: 'Lead Pipeline', href: '/manager/leads', icon: Target },
            { name: 'Operational Reports', href: '/manager/reports', icon: FileText },
          ]}
        ];
      case 'COUNSELLOR':
        return [
          { group: 'Conversion Pipeline', links: [
            { name: 'Admissions Hub', href: '/counsellor/dashboard', icon: LayoutDashboard },
            { name: 'New Leads', href: '/counsellor/leads/new', icon: Zap },
            { name: 'Follow-ups', href: '/counsellor/followups', icon: Clock },
            { name: 'Hot Leads', href: '/counsellor/leads/hot', icon: Target },
          ]},
          { group: 'Engagement', links: [
            { name: 'Call Tracking', href: '/counsellor/calls', icon: PhoneCall },
            { name: 'WhatsApp Center', href: '/counsellor/whatsapp', icon: MessageSquare },
            { name: 'Meeting Scheduler', href: '/counsellor/meetings', icon: Calendar },
          ]},
          { group: 'Personal Performance', links: [
            { name: 'My Targets', href: '/counsellor/targets', icon: TrendingUp },
            { name: 'Student Notes', href: '/counsellor/notes', icon: FileText },
          ]}
        ];
      case 'SEO':
        return [
          { group: 'Search Intelligence', links: [
            { name: 'SEO Dashboard', href: '/seo/dashboard', icon: Globe },
            { name: 'Keyword Ranking', href: '/seo/keywords', icon: TrendingUp },
            { name: 'Backlink Tracker', href: '/seo/backlinks', icon: Activity },
          ]},
          { group: 'Content Node', links: [
            { name: 'Blog Management', href: '/seo/blogs', icon: FileText },
            { name: 'Content Strategy', href: '/seo/strategy', icon: Megaphone },
            { name: 'Technical Audit', href: '/seo/technical', icon: ShieldCheck },
          ]},
          { group: 'Performance', links: [
            { name: 'Traffic Insights', href: '/seo/traffic', icon: BarChart3 },
            { name: 'Competitors', href: '/seo/competitors', icon: Search },
          ]}
        ];
      case 'MARKETING':
        return [
          { group: 'Growth Engine', links: [
            { name: 'Campaign Hub', href: '/marketing/dashboard', icon: Megaphone },
            { name: 'Ad Performance', href: '/marketing/ads', icon: TrendingUp },
            { name: 'ROI Analytics', href: '/marketing/roi', icon: PieChart },
          ]},
          { group: 'Engagement', links: [
            { name: 'Social Media', href: '/marketing/social', icon: Globe },
            { name: 'Email Marketing', href: '/marketing/email', icon: Send },
            { name: 'WhatsApp Blasts', href: '/marketing/whatsapp', icon: MessageSquare },
          ]},
          { group: 'Assets', links: [
            { name: 'Creative Library', href: '/marketing/creatives', icon: Sparkles },
            { name: 'Content Calendar', href: '/marketing/calendar', icon: Calendar },
          ]}
        ];
      default:
        return [
          { group: 'General', links: [
            { name: 'Dashboard', href: '/ems/dashboard', icon: LayoutDashboard },
            { name: 'My Profile', href: '/ems/profile', icon: Users },
            { name: 'Settings', href: '/ems/settings', icon: Settings },
          ]}
        ];
    }
  };

  const navGroups = getNavLinks();

  return (
    <aside className="w-72 bg-[#020617] h-screen fixed left-0 top-0 flex flex-col z-50 shadow-[4px_0_24px_rgba(0,0,0,0.3)] border-r border-white/5">
      {/* Premium Header */}
      <div className="p-8 pb-4">
        <div className="flex items-center gap-4 mb-10 group cursor-pointer">
          <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-[0_8px_16px_rgba(79,70,229,0.3)] group-hover:scale-110 transition-all duration-500 relative overflow-hidden">
            <Sparkles className="text-white relative z-10" size={24} />
            <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tighter text-white leading-none">BYTECODE</h1>
            <p className="text-[10px] uppercase tracking-widest text-indigo-400 font-bold mt-1.5 opacity-80">Enterprise Node</p>
          </div>
        </div>

        <div className="overflow-y-auto max-h-[calc(100vh-280px)] pr-2 scrollbar-hide">
          <nav className="space-y-8">
            {navGroups.map((group, gIdx) => (
              <div key={group.group || gIdx}>
                <h3 className="text-[10px] uppercase tracking-[0.25em] text-slate-500 font-black mb-5 px-4 opacity-50">{group.group}</h3>
                <div className="space-y-1.5">
                  {group.links.map((link) => {
                    const Icon = link.icon;
                    const isActive = pathname === link.href;
                    return (
                      <Link
                        key={link.name}
                        href={link.href}
                        className={`flex items-center gap-3.5 px-4 py-3 rounded-xl transition-all duration-300 group relative ${
                          isActive 
                            ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-500/20' 
                            : 'text-slate-400 hover:bg-white/5 hover:text-white border border-transparent'
                        }`}
                      >
                        <Icon size={18} className={`${isActive ? 'text-indigo-400' : 'text-slate-500 group-hover:text-indigo-400'} transition-colors`} />
                        <span className="text-sm font-bold tracking-tight">{link.name}</span>
                        {isActive && (
                          <motion.div 
                            layoutId="active-pill"
                            className="absolute right-0 w-1 h-5 bg-indigo-500 rounded-l-full shadow-[0_0_8px_rgba(99,102,241,0.5)]"
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
      </div>

      {/* Premium Footer Profile */}
      <div className="mt-auto p-6 bg-slate-950/50 border-t border-white/5">
        <div className="flex items-center gap-4 mb-6 p-2 rounded-2xl bg-white/5 border border-white/5">
           <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-cyan-500 flex items-center justify-center font-bold text-white shadow-md border border-white/10 shrink-0">
             {user?.name?.[0] || 'U'}
           </div>
           <div className="overflow-hidden">
             <p className="text-sm font-black text-white truncate leading-none mb-1">{user?.name}</p>
             <p className="text-[10px] font-black text-indigo-400 uppercase tracking-tight truncate opacity-80">{user?.role?.replace('_', ' ')}</p>
           </div>
        </div>
        
        <button 
          onClick={logout}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-500 hover:bg-rose-500/10 hover:text-rose-400 transition-all w-full font-bold text-sm border border-transparent hover:border-rose-500/20"
        >
          <LogOut size={18} />
          <span>Terminate Session</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
