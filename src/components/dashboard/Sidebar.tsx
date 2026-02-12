
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { DASHBOARD_NAV, Role } from '@/lib/dashboard-config';
import { LogOut, Hexagon, User, Settings, Shield, Bell, X, CheckCircle, Zap, CreditCard } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';

interface SidebarProps {
    role: Role;
}

export default function Sidebar({ role }: SidebarProps) {
    const pathname = usePathname();
    const navItems = DASHBOARD_NAV[role] || [];
    const [hoveredItem, setHoveredItem] = useState<string | null>(null);
    const { user, logout } = useAuth();
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [profileData, setProfileData] = useState<any>(null);

    const handleOpenProfile = async () => {
        setIsProfileOpen(true);
        if (user?.email) {
            try {
                // Determine API endpoint based on role or just use generic /users/email
                // backend/user-service/.../UserController.java has @GetMapping("/{email}")
                const response = await api.get(`/users/${user.email}`);
                setProfileData(response.data);
            } catch (error) {
                console.error("Failed to fetch profile", error);
                setProfileData(user); // Fallback to context user
            }
        }
    };

    return (
        <aside className="fixed left-0 top-0 h-screen w-[280px] z-50 flex flex-col bg-[#030014]/90 backdrop-blur-xl border-r border-white/5 shadow-2xl shadow-violet-500/10 transition-all duration-300">
            {/* Premium Logo Section */}
            <div className="p-6 border-b border-white/5 flex items-center gap-3 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-r from-violet-600/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative z-10 p-2 bg-gradient-to-br from-violet-600 to-fuchsia-600 rounded-xl shadow-lg shadow-violet-500/30">
                    <Hexagon size={24} color="white" strokeWidth={2} className="group-hover:rotate-180 transition-transform duration-700 ease-in-out" />
                </div>
                <div className="relative z-10">
                    <div className="font-[Rajdhani] text-2xl font-bold text-white tracking-wide leading-none">
                        BYTE<span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">CODE</span>
                    </div>
                    <div className="text-[10px] text-slate-400 tracking-[0.2em] uppercase font-bold mt-1">Admin Console</div>
                </div>
            </div>

            {/* Advanced Navigation */}
            <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1 custom-scrollbar">
                <style jsx global>{`
                    .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                    .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                    .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.1); border-radius: 10px; }
                    .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(124, 58, 237, 0.5); }
                `}</style>

                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link key={item.href} href={item.href}>
                            <motion.div
                                onHoverStart={() => setHoveredItem(item.href)}
                                onHoverEnd={() => setHoveredItem(null)}
                                className={`relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 cursor-pointer overflow-hidden ${isActive
                                    ? 'bg-gradient-to-r from-violet-600/20 to-blue-600/10 border border-violet-500/30 shadow-[0_0_20px_rgba(124,58,237,0.15)]'
                                    : 'hover:bg-white/5 border border-transparent'
                                    }`}
                                whileHover={{ scale: 1.02, x: 4 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                {/* Active Indicator Bar */}
                                {isActive && (
                                    <motion.div
                                        layoutId="activeIndicator"
                                        className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-violet-400 to-fuchsia-400 shadow-[0_0_10px_rgba(167,139,250,0.8)]"
                                    />
                                )}

                                <div className={`relative z-10 p-1.5 rounded-lg transition-colors duration-300 ${isActive ? 'text-white bg-violet-500/20' : 'text-slate-400 group-hover:text-white'
                                    }`}>
                                    <item.icon size={20} strokeWidth={isActive ? 2 : 1.5} />
                                </div>
                                <span className={`relative z-10 text-sm font-medium transition-colors duration-300 ${isActive ? 'text-white font-bold tracking-wide' : 'text-slate-400 group-hover:text-white'
                                    }`}>
                                    {item.label}
                                </span>

                                {/* Hover Glow Effect */}
                                {hoveredItem === item.href && !isActive && (
                                    <motion.div
                                        layoutId="hoverGlow"
                                        className="absolute inset-0 bg-white/5 rounded-xl z-0"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                    />
                                )}
                            </motion.div>
                        </Link>
                    );
                })}
            </div>

            {/* Premium Profile Section */}
            <div className="p-4 border-t border-white/5 bg-[#020010]/50 backdrop-blur-md">
                <motion.div
                    whileHover={{ y: -2 }}
                    className="relative group p-3 rounded-2xl bg-gradient-to-b from-white/5 to-white/0 border border-white/5 hover:border-violet-500/30 transition-all duration-300"
                >
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-3 flex-1 min-w-0 cursor-pointer">
                            <div className="relative">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-violet-600 to-indigo-600 p-[2px]">
                                    <div className="w-full h-full rounded-full bg-black flex items-center justify-center text-xs font-bold text-white relative overflow-hidden">
                                        {user?.id ? user.fullName.slice(0, 2).toUpperCase() : role.slice(0, 2).toUpperCase()}
                                        {/* Shine effect */}
                                        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                                    </div>
                                </div>
                                <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-[#030014] rounded-full shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                            </div>

                            <div className="flex-1 min-w-0">
                                <div className="text-[10px] text-slate-400 font-medium mb-0.5 uppercase tracking-tighter">Authorized User</div>
                                <div className="text-sm font-bold text-white truncate capitalize bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400 group-hover:from-violet-200 group-hover:to-white transition-all">
                                    {user?.fullName || role.replace('_', ' ')}
                                </div>
                            </div>
                        </div>

                        <button onClick={logout} className="p-2 rounded-lg hover:bg-red-500/10 text-slate-500 hover:text-red-400 transition-colors pointer-events-auto relative z-20">
                            <LogOut size={18} />
                        </button>
                    </div>
                </motion.div>
            </div>
        </aside>
    );
}
