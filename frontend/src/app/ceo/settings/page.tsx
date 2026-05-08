'use client';

import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import SectionHeader from '@/components/dashboard/SectionHeader';
import { 
  Settings, 
  ShieldCheck, 
  Globe, 
  Bell, 
  Database, 
  Key, 
  Smartphone, 
  Mail, 
  MessageSquare, 
  Zap,
  Lock,
  ChevronRight,
  Save,
  Activity
} from 'lucide-react';
import { motion } from 'framer-motion';

const SystemSettings = () => {
  const [activeTab, setActiveTab] = useState('Security');

  const tabs = [
    { name: 'Security', icon: ShieldCheck },
    { name: 'System Nodes', icon: Database },
    { name: 'Integrations', icon: Zap },
    { name: 'Global Config', icon: Globe },
    { name: 'Notifications', icon: Bell },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-10 pb-20">
        
        <SectionHeader 
          title="System Sovereignty"
          subtitle="Enterprise-grade configuration and security governance for ByteCode Trainings."
          icon={Settings}
          badge="ROOT SETTINGS"
        />

        <div className="flex flex-col lg:flex-row gap-10">
           
           {/* Navigation Sidebar */}
           <div className="lg:w-80 shrink-0 space-y-4">
              {tabs.map((tab) => (
                <button 
                  key={tab.name}
                  onClick={() => setActiveTab(tab.name)}
                  className={`w-full flex items-center gap-4 px-6 py-5 rounded-3xl transition-all duration-300 border ${
                    activeTab === tab.name 
                      ? 'bg-slate-900 text-white border-slate-900 shadow-2xl shadow-slate-900/20 translate-x-2' 
                      : 'bg-white text-slate-500 border-slate-100 hover:bg-slate-50'
                  }`}
                >
                  <tab.icon size={20} className={activeTab === tab.name ? 'text-indigo-400' : 'text-slate-400'} />
                  <span className="text-sm font-black tracking-tight">{tab.name}</span>
                  {activeTab === tab.name && <ChevronRight size={16} className="ml-auto opacity-50" />}
                </button>
              ))}
              
              <div className="p-8 bg-indigo-50 border border-indigo-100 rounded-[2rem] mt-10">
                 <h4 className="text-sm font-black text-indigo-900 mb-2 flex items-center gap-2">
                    <Activity size={16} /> System Health
                 </h4>
                 <div className="flex items-center gap-2 mb-4">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Core Online</span>
                 </div>
                 <p className="text-[10px] text-indigo-500 font-medium leading-relaxed">System performing at peak efficiency. No latency detected across 4 branch nodes.</p>
              </div>
           </div>

           {/* Configuration Panel */}
           <div className="flex-1">
              <div className="bg-white border border-slate-100 rounded-[2.5rem] shadow-sm overflow-hidden">
                 <div className="p-10 border-b border-slate-50 flex items-center justify-between">
                    <div>
                       <h3 className="text-2xl font-black text-slate-900 tracking-tight">{activeTab} Governance</h3>
                       <p className="text-slate-500 font-medium text-sm">Control security protocols and encryption vectors.</p>
                    </div>
                    <button className="flex items-center gap-2 px-8 py-3 bg-indigo-600 text-white rounded-2xl font-black text-sm shadow-lg shadow-indigo-100 hover:scale-105 transition-all">
                       <Save size={18} /> Deploy Changes
                    </button>
                 </div>

                 <div className="p-10 space-y-12">
                    
                    {/* Multi-Factor Authentication Section */}
                    <div className="space-y-6">
                       <div className="flex items-center gap-4 mb-8">
                          <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
                             <Smartphone size={20} />
                          </div>
                          <h4 className="text-lg font-black text-slate-900 tracking-tight">Multi-Factor Authentication</h4>
                       </div>
                       
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          {[
                            { name: 'App Authenticator (TOTP)', desc: 'Use apps like Google or Microsoft Authenticator.', status: 'Enabled' },
                            { name: 'SMS Verification', desc: 'Secure login via SMS code delivery.', status: 'Disabled' },
                            { name: 'Security Keys (FIDO)', desc: 'Hardware-based security for root nodes.', status: 'Experimental' },
                            { name: 'Email Magic Links', desc: 'Passwordless entry via secure URL.', status: 'Enabled' },
                          ].map((item, i) => (
                            <div key={i} className="flex items-center justify-between p-6 bg-slate-50 rounded-[2rem] border border-slate-100 hover:border-indigo-100 transition-all cursor-pointer group">
                               <div className="max-w-[70%]">
                                  <p className="text-sm font-black text-slate-900 mb-1">{item.name}</p>
                                  <p className="text-[10px] text-slate-500 font-medium leading-none">{item.desc}</p>
                               </div>
                               <div className="flex flex-col items-end">
                                  <div className={`w-12 h-6 rounded-full relative transition-colors ${item.status === 'Enabled' ? 'bg-indigo-600' : 'bg-slate-200'}`}>
                                     <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${item.status === 'Enabled' ? 'right-1' : 'left-1'}`} />
                                  </div>
                                  <span className="text-[9px] font-black mt-2 text-slate-400 uppercase tracking-widest">{item.status}</span>
                               </div>
                            </div>
                          ))}
                       </div>
                    </div>

                    <div className="h-[1px] w-full bg-slate-50" />

                    {/* API Integration Section */}
                    <div className="space-y-6">
                       <div className="flex items-center gap-4 mb-8">
                          <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center">
                             <Key size={20} />
                          </div>
                          <h4 className="text-lg font-black text-slate-900 tracking-tight">Operational API Nodes</h4>
                       </div>
                       
                       <div className="space-y-4">
                          {[
                            { name: 'WhatsApp Cloud API', endpoint: 'v1/messaging/webhook', status: 'Live' },
                            { name: 'Razorpay Gateway', endpoint: 'v1/payments/secure', status: 'Live' },
                            { name: 'Google Search Console', endpoint: 'v1/analytics/seo', status: 'Standby' },
                          ].map((api, i) => (
                            <div key={i} className="flex items-center justify-between p-6 bg-slate-50 rounded-[2rem] border border-slate-100">
                               <div className="flex items-center gap-6">
                                  <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                                  <div>
                                     <p className="text-sm font-black text-slate-900">{api.name}</p>
                                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Endpoint: {api.endpoint}</p>
                                  </div>
                               </div>
                               <button className="text-xs font-black text-indigo-600 px-4 py-2 hover:bg-indigo-50 rounded-xl transition-all">Configure Node</button>
                            </div>
                          ))}
                       </div>
                    </div>

                    <div className="h-[1px] w-full bg-slate-50" />

                    {/* Audit Policy */}
                    <div className="bg-slate-900 rounded-[2rem] p-10 text-white relative overflow-hidden">
                       <div className="absolute top-0 right-0 p-8 opacity-10">
                          <Lock size={60} />
                       </div>
                       <h4 className="text-lg font-black mb-2 tracking-tight">Audit Retention Policy</h4>
                       <p className="text-slate-400 text-xs font-medium mb-8">System logs are currently stored for 365 days in encrypted cold storage.</p>
                       <div className="flex gap-4">
                          <button className="px-6 py-2.5 bg-white text-slate-900 rounded-xl font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-transform">Download Policy</button>
                          <button className="px-6 py-2.5 bg-white/10 border border-white/10 rounded-xl text-white font-black text-[10px] uppercase tracking-widest hover:bg-white/20 transition-all">Request Purge</button>
                       </div>
                    </div>

                 </div>
              </div>
           </div>
        </div>

      </div>
    </DashboardLayout>
  );
};

export default SystemSettings;
