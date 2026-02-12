import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { DASHBOARD_NAV, Role } from '@/lib/dashboard-config';
import { LogOut, Hexagon, User, Settings, Shield, Bell, X, CheckCircle, Zap, CreditCard, Edit2, Save, Phone, Lock, Mail } from 'lucide-react';
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
    const [isEditing, setIsEditing] = useState(false);
    const [tempProfile, setTempProfile] = useState<any>({});

    const handleOpenProfile = async () => {
        setIsProfileOpen(true);
        if (user?.email) {
            try {
                const response = await api.get(`/users/${user.email}`);
                setProfileData(response.data);
                setTempProfile(response.data); // Initialize temp profile
            } catch (error) {
                console.error("Failed to fetch profile", error);
                setProfileData(user);
                setTempProfile(user);
            }
        }
    };

    const handleSaveProfile = async () => {
        if (!tempProfile.id) return;
        try {
            const updatedData = {
                ...tempProfile,
                // Ensure password is sent only if changed (handled by backend check)
                password: tempProfile.password || "",
                phoneNumber: tempProfile.phoneNumber || ""
            };

            await api.put(`/users/${tempProfile.id}`, updatedData);
            setProfileData(updatedData);
            setIsEditing(false);
            alert("Profile updated successfully!");
        } catch (error) {
            console.error("Failed to update profile", error);
            alert("Failed to update profile.");
        }
    };

    return (
        <>
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
                            <div onClick={handleOpenProfile} className="flex items-center gap-3 flex-1 min-w-0 cursor-pointer">
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

            {/* Profile Modal */}
            <AnimatePresence>
                {isProfileOpen && (
                    <motion.div
                        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsProfileOpen(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            className="relative w-full max-w-md bg-[#0f172a] border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="relative">
                                {/* Header Background Pattern */}
                                <div className="absolute inset-0 h-32 bg-gradient-to-br from-violet-600/20 via-fuchsia-600/10 to-blue-600/20" />
                                <div className="relative p-6 pt-12 flex flex-col items-center">
                                    <div className="absolute top-4 right-4 flex gap-2">
                                        {!isEditing && (
                                            <button
                                                onClick={() => { setIsEditing(true); setTempProfile(profileData || user); }}
                                                className="p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                                                title="Edit Profile"
                                            >
                                                <Edit2 size={18} />
                                            </button>
                                        )}
                                        <button
                                            onClick={() => { setIsProfileOpen(false); setIsEditing(false); }}
                                            className="p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                                        >
                                            <X size={20} />
                                        </button>
                                    </div>

                                    <motion.div
                                        initial={{ scale: 0 }} animate={{ scale: 1 }}
                                        className="w-28 h-28 rounded-full bg-gradient-to-tr from-violet-500 via-fuchsia-500 to-blue-500 p-1 mb-4 shadow-xl shadow-violet-500/20"
                                    >
                                        <div className="w-full h-full rounded-full bg-[#0f172a] flex items-center justify-center text-4xl font-bold text-white relative overflow-hidden group">
                                            {tempProfile?.fullName ? tempProfile.fullName.slice(0, 2).toUpperCase() : user?.fullName?.slice(0, 2).toUpperCase() || 'US'}
                                            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                        </div>
                                    </motion.div>

                                    {isEditing ? (
                                        <input
                                            type="text"
                                            value={tempProfile.fullName || ''}
                                            onChange={(e) => setTempProfile({ ...tempProfile, fullName: e.target.value })}
                                            className="bg-slate-800/50 border border-white/10 rounded-lg px-3 py-1 text-white text-center font-bold mb-1 w-full max-w-[200px]"
                                            placeholder="Full Name"
                                        />
                                    ) : (
                                        <h3 className="text-2xl font-bold text-white text-center mb-1">{profileData?.fullName || user?.fullName || 'User'}</h3>
                                    )}

                                    <div className="flex items-center gap-2 mt-2">
                                        <span className="px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-xs font-bold uppercase tracking-wider">
                                            {profileData?.role || user?.role || 'Role'}
                                        </span>
                                        {profileData?.branch && (
                                            <span className="px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs font-bold uppercase tracking-wider">
                                                {profileData.branch}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 space-y-4 bg-[#0f172a]">
                                <div className="space-y-4">
                                    {/* Email Field */}
                                    <div className="bg-slate-900/50 p-3 rounded-xl border border-white/5 flex items-center gap-3">
                                        <div className="p-2 rounded-lg bg-violet-500/10 text-violet-400">
                                            <Mail size={18} />
                                        </div>
                                        <div className="flex-1">
                                            <div className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-0.5">Email</div>
                                            {isEditing ? (
                                                <input
                                                    type="email"
                                                    value={tempProfile.email || ''}
                                                    onChange={(e) => setTempProfile({ ...tempProfile, email: e.target.value })}
                                                    className="bg-transparent text-white w-full focus:outline-none border-b border-white/10 focus:border-violet-500/50 pb-0.5 text-sm"
                                                />
                                            ) : (
                                                <div className="text-white text-sm font-medium truncate">{profileData?.email || user?.email || 'N/A'}</div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Phone Field */}
                                    <div className="bg-slate-900/50 p-3 rounded-xl border border-white/5 flex items-center gap-3">
                                        <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
                                            <Phone size={18} />
                                        </div>
                                        <div className="flex-1">
                                            <div className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-0.5">Phone Number</div>
                                            {isEditing ? (
                                                <input
                                                    type="tel"
                                                    value={tempProfile.phoneNumber || ''}
                                                    onChange={(e) => setTempProfile({ ...tempProfile, phoneNumber: e.target.value })}
                                                    className="bg-transparent text-white w-full focus:outline-none border-b border-white/10 focus:border-blue-500/50 pb-0.5 text-sm"
                                                    placeholder="Add phone number"
                                                />
                                            ) : (
                                                <div className="text-white text-sm font-medium">{profileData?.phoneNumber || 'Not provided'}</div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Password Field (only show in edit mode or as masked) */}
                                    {isEditing && (
                                        <div className="bg-slate-900/50 p-3 rounded-xl border border-white/5 flex items-center gap-3 border-l-2 border-l-yellow-500/50">
                                            <div className="p-2 rounded-lg bg-yellow-500/10 text-yellow-400">
                                                <Lock size={18} />
                                            </div>
                                            <div className="flex-1">
                                                <div className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-0.5">New Password</div>
                                                <input
                                                    type="password"
                                                    value={tempProfile.password || ''}
                                                    onChange={(e) => setTempProfile({ ...tempProfile, password: e.target.value })}
                                                    className="bg-transparent text-white w-full focus:outline-none border-b border-white/10 focus:border-yellow-500/50 pb-0.5 text-sm"
                                                    placeholder="Leave blank to keep current"
                                                />
                                            </div>
                                        </div>
                                    )}

                                    {/* Status (Read Only) */}
                                    <div className="bg-slate-900/50 p-3 rounded-xl border border-white/5 flex items-center gap-3">
                                        <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                                            <Shield size={18} />
                                        </div>
                                        <div className="flex-1 flex justify-between items-center">
                                            <div>
                                                <div className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-0.5">Status / ID</div>
                                                <div className="text-white text-sm font-medium flex items-center gap-2">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                                    Active
                                                </div>
                                            </div>
                                            <div className="text-[10px] text-slate-600 font-mono bg-black/20 px-2 py-1 rounded max-w-[100px] truncate" title={profileData?.id || user?.id}>
                                                {profileData?.id || user?.id || '---'}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-2 border-t border-white/5 flex gap-3">
                                    {isEditing ? (
                                        <>
                                            <button
                                                onClick={() => setIsEditing(false)}
                                                className="flex-1 py-2.5 bg-slate-800 text-slate-300 hover:text-white rounded-lg font-semibold transition-colors text-sm"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                onClick={handleSaveProfile}
                                                className="flex-1 py-2.5 bg-violet-600 hover:bg-violet-700 text-white rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 text-sm shadow-lg shadow-violet-600/20"
                                            >
                                                <Save size={16} /> Save Changes
                                            </button>
                                        </>
                                    ) : (
                                        <button
                                            onClick={() => { setIsProfileOpen(false); logout(); }}
                                            className="w-full py-3 bg-red-500/5 hover:bg-red-500/10 text-red-500 hover:text-red-400 rounded-xl font-semibold transition-all border border-red-500/10 hover:border-red-500/20 flex items-center justify-center gap-2 group"
                                        >
                                            <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
                                            Sign Out securely
                                        </button>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
