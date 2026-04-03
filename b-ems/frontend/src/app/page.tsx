"use client";

import { motion, Variants } from "framer-motion";
import { 
  Users, 
  Target, 
  BarChart3, 
  ShieldCheck, 
  ArrowRight, 
  LayoutDashboard, 
  Zap, 
  Clock, 
  Briefcase,
  Layers,
  Globe2
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Home() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { staggerChildren: 0.15, delayChildren: 0.2 } 
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.8 } 
    }
  };

  return (
    <div className="min-h-screen bg-[#05050A] text-slate-100 selection:bg-indigo-500/30 selection:text-indigo-200 overflow-x-hidden">
      {/* Dynamic Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-900/20 blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-cyan-900/20 blur-[120px]" />
        <div className="absolute top-[40%] left-[60%] w-[30%] h-[30%] rounded-full bg-violet-900/10 blur-[100px]" />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-slate-950/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-cyan-500 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-[0_0_20px_rgba(99,102,241,0.4)]">B</div>
            <span className="font-outfit text-2xl font-bold tracking-tight text-white">B-EMS</span>
          </div>
          <div className="hidden md:flex items-center gap-10 text-sm font-medium text-slate-300">
            <a href="#features" className="hover:text-white transition-colors duration-300">Platform Features</a>
            <a href="#solutions" className="hover:text-white transition-colors duration-300">Enterprise Solutions</a>
            <a href="#about" className="hover:text-white transition-colors duration-300">Why Us?</a>
          </div>
          <Link href="/ems/login" className="relative group overflow-hidden rounded-full p-[1px]">
            <span className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-cyan-400 to-indigo-500 rounded-full opacity-70 group-hover:opacity-100 animate-[spin_3s_linear_infinite]" />
            <div className="relative px-6 py-2.5 bg-slate-950/90 rounded-full flex items-center gap-2 text-sm font-semibold text-white transition-all group-hover:bg-slate-950/50">
              Portal Access <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </div>
      </nav>

      <main className="relative z-10">
        {/* Hero Section */}
        <section className="pt-32 pb-20 md:pt-48 md:pb-32 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              
              {/* Left Column: Text Content */}
              <motion.div 
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="max-w-2xl"
              >
                <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-bold uppercase tracking-widest mb-8 backdrop-blur-md">
                  <Zap size={14} className="fill-indigo-400" /> Next-Generation Enterprise OS
                </motion.div>
                <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl lg:text-8xl font-outfit font-black tracking-tight text-white leading-[1.05] mb-8">
                  Supercharge <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-cyan-300 to-indigo-400 animate-gradient-x">Your Growth</span>
                </motion.h1>
                <motion.p variants={itemVariants} className="text-lg md:text-xl text-slate-400 leading-relaxed mb-10 max-w-xl font-light">
                  The ultimate unified platform bridging intelligent CRM and sophisticated HRMS. Scale your business, automate workflows, and empower your global workforce like never before.
                </motion.p>
                <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center gap-5">
                  <Link href="/ems/login" className="w-full sm:w-auto flex items-center justify-center gap-2 text-base px-8 py-4 rounded-2xl bg-white text-slate-900 font-bold hover:scale-105 transition-transform duration-300 shadow-[0_0_30px_rgba(255,255,255,0.15)]">
                    Launch Platform <LayoutDashboard size={20} />
                  </Link>
                  <Link href="#features" className="w-full sm:w-auto flex items-center justify-center px-8 py-4 rounded-2xl font-semibold text-white bg-white/5 border border-white/10 hover:bg-white/10 transition-colors duration-300 backdrop-blur-md">
                    Explore Architecture
                  </Link>
                </motion.div>
                
                {/* Trusted By */}
                <motion.div variants={itemVariants} className="mt-16 pt-8 border-t border-white/10">
                  <p className="text-sm text-slate-500 font-medium mb-4 uppercase tracking-widest flex items-center gap-3">
                    <ShieldCheck size={16} className="text-indigo-400" /> Enterprise Grade Security
                  </p>
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shadow-lg"><Layers size={18} className="text-cyan-400" /></div>
                    <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shadow-lg"><Globe2 size={18} className="text-indigo-400" /></div>
                    <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shadow-lg"><Target size={18} className="text-violet-400" /></div>
                    <div className="flex items-center pl-2 text-xs font-bold text-slate-400 line-clamp-1">Trusted by industry leaders</div>
                  </div>
                </motion.div>
              </motion.div>

              {/* Right Column: Visual Showcase */}
              <motion.div 
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="relative hidden lg:block"
              >
                {/* Glowing Aura behind Dashboard */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-tr from-indigo-500/20 to-cyan-500/20 rounded-full blur-[80px] -z-10" />
                
                <div className="relative z-10 rounded-3xl p-2 bg-gradient-to-b from-white/10 to-white/0 shadow-2xl backdrop-blur-sm border border-white/10 transform rotate-[-2deg] hover:rotate-0 transition-transform duration-700">
                  <div className="rounded-[22px] overflow-hidden bg-slate-900 border border-white/5 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
                    <Image 
                      src="/images/hero-dashboard.png" 
                      alt="B-EMS Enterprise Dashboard" 
                      width={800}
                      height={500}
                      className="w-full h-auto object-cover opacity-90 hover:opacity-100 transition-opacity"
                      onError={(e) => {
                         // Fallback straight styled div if image is missing
                         const target = e.target as HTMLImageElement;
                         target.style.display = 'none';
                         const parent = target.parentElement;
                         if (parent && !parent.querySelector('.fallback-dash')) {
                           const fallback = document.createElement('div');
                           fallback.className = 'fallback-dash w-full h-[400px] bg-slate-900 flex flex-col p-6';
                           fallback.innerHTML = `
                             <div class="flex gap-2 mb-6">
                               <div class="w-3 h-3 rounded-full bg-red-500/80"></div>
                               <div class="w-3 h-3 rounded-full bg-amber-500/80"></div>
                               <div class="w-3 h-3 rounded-full bg-green-500/80"></div>
                             </div>
                             <div class="flex gap-6 h-full">
                               <div class="w-48 bg-slate-800/50 rounded-xl hidden md:block border border-white/5"></div>
                               <div class="flex-1 flex flex-col gap-6">
                                  <div class="flex gap-6">
                                    <div class="flex-1 h-32 bg-indigo-500/10 border border-indigo-500/20 rounded-xl"></div>
                                    <div class="flex-1 h-32 bg-cyan-500/10 border border-cyan-500/20 rounded-xl"></div>
                                  </div>
                                  <div class="flex-1 bg-slate-800/30 rounded-xl border border-white/5"></div>
                               </div>
                             </div>
                           `;
                           parent.appendChild(fallback);
                         }
                      }}
                      priority
                    />
                  </div>
                </div>

                {/* Floating Elements (Micro-animations) */}
                <motion.div 
                  animate={{ y: [-10, 10, -10] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -top-10 -left-10 z-20 bg-slate-800/80 backdrop-blur-xl border border-white/10 p-5 rounded-2xl shadow-xl flex items-center gap-4"
                >
                  <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                    <BarChart3 className="text-green-400" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-bold uppercase mb-1">Revenue Growth</p>
                    <p className="text-xl font-bold text-white">+142%</p>
                  </div>
                </motion.div>

                <motion.div 
                  animate={{ y: [15, -15, 15] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                  className="absolute -bottom-10 -right-5 z-20 bg-slate-800/80 backdrop-blur-xl border border-white/10 p-5 rounded-2xl shadow-xl flex items-center gap-4"
                >
                  <div className="w-12 h-12 bg-indigo-500/20 rounded-xl flex items-center justify-center">
                    <Users className="text-indigo-400" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-bold uppercase mb-1">Active Users</p>
                    <p className="text-xl font-bold text-white">12,504</p>
                  </div>
                </motion.div>

              </motion.div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section id="features" className="py-32 relative">
          <div className="absolute inset-0 bg-slate-900/50 border-y border-white/5 skew-y-3 -z-10 transform origin-top-left" />
          
          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="text-center max-w-3xl mx-auto mb-20">
              <h2 className="text-4xl md:text-5xl font-outfit font-bold text-white mb-6">Engineered for Superior Architecture</h2>
              <p className="text-lg text-slate-400 font-light">Deploy advanced analytics, master your talent pool, and close leads faster with a workspace that refuses to compromise on performance.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FeatureCard 
                icon={<BarChart3 className="text-cyan-400" />}
                title="Sleek CRM & Sales"
                description="Manage leads, track pipeline movements, and forecast revenue with real-time AI-powered insights."
                glowColor="rgba(34,211,238,0.15)"
              />
              <FeatureCard 
                icon={<Users className="text-indigo-400" />}
                title="Automated HRMS"
                description="From automated payroll to performance analytics. Employee lifecycle management, redefined."
                glowColor="rgba(99,102,241,0.15)"
              />
              <FeatureCard 
                icon={<ShieldCheck className="text-violet-400" />}
                title="Zero-Trust Security"
                description="Bank-grade encryption and granular role-based access control (RBAC) to protect your ecosystem."
                glowColor="rgba(167,139,250,0.15)"
              />
            </div>
          </div>
        </section>

        {/* Stats / Trust */}
        <section id="solutions" className="py-24">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
            <StatItem label="Employees Assigned" value="500+" />
            <StatItem label="Business Units" value="12" />
            <StatItem label="Automated Tasks" value="10k+" />
            <StatItem label="System Uptime" value="99.99%" />
          </div>
        </section>

        {/* Footer CTA */}
        <section className="py-32 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="relative rounded-[40px] p-12 md:p-24 text-center overflow-hidden border border-white/10 bg-slate-900/40 backdrop-blur-2xl">
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-[0.03] mix-blend-overlay" />
              <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3" />
              <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-cyan-500/20 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/3" />
              
              <div className="relative z-10 max-w-3xl mx-auto">
                <h2 className="text-4xl md:text-6xl font-outfit font-black mb-8 text-white tracking-tight">Ready for a Paradigm Shift?</h2>
                <p className="text-xl text-slate-400 mb-12 font-light leading-relaxed">Join the high-performing teams at Bytecode Trainings already leveraging the B-EMS ecosystem to dominate their operations.</p>
                <Link href="/ems/login" className="inline-flex items-center gap-3 bg-white text-slate-950 px-10 py-5 rounded-full font-bold text-lg hover:scale-105 transition-all duration-300 shadow-[0_0_40px_rgba(255,255,255,0.3)]">
                  Enter The Portal <ArrowRight size={24} />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="relative z-10 py-12 border-t border-white/5 bg-slate-950/50 backdrop-blur-lg mt-auto">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6 text-sm text-slate-500 font-medium">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center text-white/50 font-bold border border-white/5">B</div>
            <span>© 2026 Bytecode Trainings. All rights reserved.</span>
          </div>
          <div className="flex items-center gap-8">
            <a href="#" className="hover:text-cyan-400 transition-colors">Privacy</a>
            <a href="#" className="hover:text-cyan-400 transition-colors">Terms</a>
            <a href="#" className="hover:text-cyan-400 transition-colors">System Status</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description, glowColor }: { icon: React.ReactNode, title: string, description: string, glowColor: string }) {
  return (
    <div 
      className="group relative p-8 rounded-[32px] bg-slate-800/40 border border-white/5 backdrop-blur-sm hover:bg-slate-800/60 transition-all duration-500 overflow-hidden"
    >
      <div 
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
        style={{ background: `radial-gradient(circle at 50% 0%, ${glowColor}, transparent 70%)` }}
      />
      <div className="relative z-10 w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center mb-8 border border-white/10 group-hover:scale-110 group-hover:-translate-y-2 transition-all duration-500 shadow-xl">
        {icon}
      </div>
      <h3 className="relative z-10 text-2xl font-bold text-white mb-4 tracking-tight">{title}</h3>
      <p className="relative z-10 text-slate-400 leading-relaxed font-light">{description}</p>
    </div>
  );
}

function StatItem({ value, label }: { value: string, label: string }) {
  return (
    <div className="p-8 rounded-3xl bg-white/[0.02] border border-white/[0.05] flex flex-col items-center justify-center text-center hover:bg-white/[0.04] transition-colors">
      <div className="text-4xl md:text-5xl font-black text-white mb-3 font-outfit tracking-tight drop-shadow-md">{value}</div>
      <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">{label}</div>
    </div>
  );
}

