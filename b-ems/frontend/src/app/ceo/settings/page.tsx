'use client';

import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import SectionHeader from '@/components/dashboard/SectionHeader';
import { 
  Shield, 
  User, 
  Globe, 
  Bell, 
  Database, 
  Zap, 
  CheckCircle2, 
  Lock, 
  Fingerprint, 
  Save,
  Trash2,
  Key,
  Smartphone,
  Eye,
  EyeOff
} from 'lucide-react';
import { motion } from 'framer-motion';

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState('security');
  const [showKey, setShowKey] = useState(false);

  const tabs = [
    { id: 'profile', name: 'Profile Node', icon: User },
    { id: 'security', name: 'Security Matrix', icon: Shield },
    { id: 'notifications', name: 'Signal Config', icon: Bell },
    { id: 'integrations', name: 'Uplink Nodes', icon: Zap },
    { id: 'system', name: 'Core Engine', icon: Database },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-12 pb-20">
        <SectionHeader 
          title="System Sovereignty"
          subtitle="Configure your operational profile and global security parameters."
          icon={Settings}
          badge="ROOT ACCESS"
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Navigation Sidebar */}
          <div className="lg:col-span-3 space-y-2">
             {tabs.map((tab) => (
               <button
                 key={tab.id}
                 onClick={() => setActiveTab(tab.id)}
                 className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all font-bold text-sm ${
                   activeTab === tab.id 
                    ? 'bg-slate-900 text-white shadow-xl shadow-slate-200' 
                    : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
                 }`}
               >
                 <tab.icon size={18} />
                 {tab.name}
               </button>
             ))}
          </div>

          {/* Settings Content */}
          <div className="lg:col-span-9 space-y-8">
             
             {activeTab === 'security' && (
               <motion.div 
                 initial={{ opacity: 0, x: 20 }}
                 animate={{ opacity: 1, x: 0 }}
                 className="space-y-8"
               >
                  {/* Security Section 1 */}
                  <div className="bg-white border border-slate-100 rounded-[2.5rem] p-10 shadow-sm">
                     <div className="flex items-center justify-between mb-10">
                        <div>
                           <h3 className="text-2xl font-black text-slate-900 tracking-tight">Multi-Factor Authentication</h3>
                           <p className="text-slate-500 font-medium text-sm">Hardware and biometric verification layers</p>
                        </div>
                        <div className="px-4 py-2 rounded-xl bg-emerald-50 text-emerald-600 text-xs font-black flex items-center gap-2">
                           <CheckCircle2 size={16} /> SYSTEM SECURED
                        </div>
                     </div>

                     <div className="space-y-6">
                        {[
                          { name: 'Biometric Login', desc: 'Use FaceID or Fingerprint on authorized devices', active: true, icon: Fingerprint },
                          { name: 'Authenticator App', desc: 'Generate OTP codes via Google or Microsoft Authenticator', active: true, icon: Smartphone },
                          { name: 'Hardware Key', desc: 'Require a physical Yubikey for system login', active: false, icon: Key },
                        ].map((item, i) => (
                          <div key={i} className="flex items-center justify-between p-6 bg-slate-50 rounded-3xl border border-slate-100 group hover:border-indigo-200 transition-all">
                             <div className="flex items-center gap-5">
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${item.active ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-400'}`}>
                                   <item.icon size={24} />
                                </div>
                                <div>
                                   <p className="font-bold text-slate-900">{item.name}</p>
                                   <p className="text-xs text-slate-500 font-medium">{item.desc}</p>
                                </div>
                             </div>
                             <button className={`w-14 h-8 rounded-full relative transition-colors duration-500 ${item.active ? 'bg-indigo-600' : 'bg-slate-300'}`}>
                                <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-transform duration-500 ${item.active ? 'translate-x-7' : 'translate-x-1'}`} />
                             </button>
                          </div>
                        ))}
                     </div>
                  </div>

                  {/* Security Section 2 - API Access */}
                  <div className="bg-white border border-slate-100 rounded-[2.5rem] p-10 shadow-sm relative overflow-hidden">
                     <h3 className="text-2xl font-black text-slate-900 tracking-tight mb-2">Internal Uplink Secret</h3>
                     <p className="text-slate-500 font-medium text-sm mb-10">Private key for core system integrations</p>

                     <div className="p-6 bg-slate-900 rounded-3xl flex items-center justify-between gap-6 border border-white/10 relative z-10">
                        <div className="flex items-center gap-4 flex-1">
                           <Lock className="text-indigo-400" size={20} />
                           <code className="text-indigo-200 font-mono text-sm tracking-widest bg-black/40 px-4 py-2 rounded-xl flex-1 overflow-hidden">
                              {showKey ? 'BC-NODE-X991-A82J-K102-S92B' : '••••••••••••••••••••••••••••••••'}
                           </code>
                        </div>
                        <div className="flex gap-2">
                           <button onClick={() => setShowKey(!showKey)} className="p-3 bg-white/5 border border-white/10 rounded-xl text-white hover:bg-white/10 transition-all">
                              {showKey ? <EyeOff size={18} /> : <Eye size={18} />}
                           </button>
                           <button className="p-3 bg-indigo-600 rounded-xl text-white hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-900">
                              <Save size={18} />
                           </button>
                        </div>
                     </div>
                     
                     <div className="mt-8 p-6 bg-rose-50 border border-rose-100 rounded-3xl flex items-center gap-4">
                        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-rose-600 shadow-sm">
                           <Trash2 size={24} />
                        </div>
                        <div>
                           <p className="text-sm font-black text-rose-900">Emergency Protocol</p>
                           <p className="text-xs font-bold text-rose-500">Revoke all access and initiate system lockdown instantly.</p>
                        </div>
                        <button className="ml-auto px-6 py-3 bg-rose-600 text-white rounded-xl font-black text-xs hover:bg-rose-700 transition-all">
                           Terminate Core
                        </button>
                     </div>
                  </div>
               </motion.div>
             )}

             {/* Footer Actions */}
             <div className="flex justify-end gap-4 pt-10 border-t border-slate-100">
                <button className="px-8 py-4 bg-slate-100 text-slate-500 rounded-2xl font-black hover:bg-slate-200 transition-all">
                   Reset Defaults
                </button>
                <button className="px-10 py-4 bg-indigo-600 text-white rounded-2xl font-black shadow-xl shadow-indigo-100 hover:bg-indigo-700 hover:-translate-y-1 active:scale-95 transition-all">
                   Synchronize Configuration
                </button>
             </div>

          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SettingsPage;
