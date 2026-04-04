"use client";

import { motion, useScroll, useTransform, Variants } from "framer-motion";
import { 
  Users, 
  BarChart3, 
  ShieldCheck, 
  ArrowRight, 
  LayoutDashboard, 
  Zap, 
  Layers,
  Globe2,
  Lock,
  Sparkles,
  Command,
  Activity,
  Box
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const { scrollYProgress } = useScroll(); // Use global scroll instead of targeted ref to avoid hydration errors

  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);
  const y = useTransform(scrollYProgress, [0, 0.2], [0, -50]);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { staggerChildren: 0.1, delayChildren: 0.3 } 
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 40, filter: "blur(10px)" },
    visible: { 
      opacity: 1, 
      y: 0,
      filter: "blur(0px)",
      transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } 
    }
  };

  return (
    <div className="min-h-screen bg-[#030308] text-white selection:bg-indigo-500/30 selection:text-white">
      {/* Visual Infrastructure */}
      <div className="noise-overlay" />
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-indigo-500/10 blur-[150px] animate-mesh" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-cyan-500/10 blur-[150px] animate-mesh" style={{ animationDelay: '-4s' }} />
        <div className="absolute top-[30%] left-[50%] w-[40%] h-[40%] rounded-full bg-violet-500/5 blur-[120px] animate-mesh" style={{ animationDelay: '-2s' }} />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-[60] border-b border-white/5 bg-black/60 backdrop-blur-3xl">
        <div className="max-w-7xl mx-auto px-8 h-24 flex items-center justify-between">
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="w-12 h-12 bg-white text-black rounded-xl flex items-center justify-center font-black text-2xl transition-all duration-500 group-hover:rotate-[360deg] group-hover:scale-110 shadow-[0_0_30px_rgba(255,255,255,0.3)]">B</div>
            <span className="font-outfit text-2xl font-bold tracking-tighter">B-EMS <span className="text-indigo-500">.</span>OS</span>
          </div>
          
          <div className="hidden lg:flex items-center gap-12 text-[11px] font-black uppercase tracking-[0.2em] text-slate-500">
            {["System Architecture", "Security Matrix", "Global Operations", "Neural CRM"].map((item) => (
              <a key={item} href="#" className="hover:text-white transition-all duration-300 relative group overflow-hidden">
                {item}
                <span className="absolute bottom-[-4px] left-0 w-0 h-[2px] bg-indigo-500 transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </div>

          <Link href="/ems/login" className="btn-magnetic bg-white text-black px-10 py-3.5 rounded-full text-xs font-black shadow-[0_0_40px_rgba(255,255,255,0.1)] hover:bg-slate-100 transition-all uppercase tracking-widest">
            Access System
          </Link>
        </div>
      </nav>

      <main className="relative z-10">
        {/* Hero Section */}
        <section className="pt-64 pb-32 px-8">
          <motion.div 
            style={{ opacity, scale, y }}
            className="max-w-7xl mx-auto text-center"
          >
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="flex flex-col items-center"
            >
              <motion.div variants={itemVariants} className="px-6 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md mb-12 flex items-center gap-3 group cursor-pointer hover:border-white/20 transition-all">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_#22c55e]" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 group-hover:text-white transition-colors">v2.4 Neural Core Active</span>
                <ArrowRight size={14} className="text-indigo-500 ml-1 group-hover:translate-x-1 transition-transform" />
              </motion.div>

              <motion.h1 variants={itemVariants} className="text-7xl md:text-9xl lg:text-[11rem] font-outfit font-black tracking-tight leading-[0.85] mb-12">
                Unified <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-white to-cyan-300 animate-gradient-x px-4 pb-8 inline-block mt-4">Enterprise</span>
              </motion.h1>

              <motion.p variants={itemVariants} className="text-xl md:text-3xl text-slate-400 font-light max-w-4xl leading-relaxed mb-20">
                Orchestrate your entire business lifecycle through a single, <br className="hidden md:block" /> neural-driven command interface. Where intelligence meets raw performance.
              </motion.p>

              <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center gap-10 mb-32">
                <Link href="/ems/login" className="w-full sm:w-auto px-16 py-6 rounded-2xl bg-indigo-600 font-black text-xl hover:bg-indigo-500 transition-all flex items-center justify-center gap-3 shadow-[0_0_50px_rgba(79,70,229,0.4)]">
                  Launch Command Center <Command size={24} />
                </Link>
                <div className="flex items-center gap-4 text-slate-500 font-bold group cursor-pointer hover:text-white transition-colors">
                  <Activity size={24} className="text-indigo-500" />
                  <span className="text-lg">View System Reliability</span>
                </div>
              </motion.div>

              {/* Advanced Dashboard Showcase */}
              <motion.div 
                variants={itemVariants}
                className="w-full relative group"
              >
                <div className="absolute inset-0 bg-indigo-500/20 blur-[100px] rounded-full scale-75 -z-10 group-hover:scale-90 transition-transform duration-1000" />
                <div className="glass-panel p-3 rounded-[40px] shadow-2xl relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
                  <div className="rounded-[30px] overflow-hidden bg-[#0a0a0f] border border-white/5">
                     <div className="h-12 w-full border-b border-white/5 flex items-center px-6 gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500/50" />
                        <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                        <div className="w-3 h-3 rounded-full bg-green-500/50" />
                        <div className="ml-4 h-6 w-48 bg-white/5 rounded-full" />
                     </div>
                     <div className="p-8 aspect-video relative flex items-center justify-center">
                        <div className="grid grid-cols-12 gap-6 w-full h-full">
                           <div className="col-span-3 space-y-4">
                              <div className="h-32 rounded-2xl bg-white/5 border border-white/5 p-4 space-y-2">
                                 <div className="w-full h-2 bg-white/10 rounded" />
                                 <div className="w-3/4 h-2 bg-white/10 rounded" />
                                 <div className="w-1/2 h-2 bg-indigo-500/20 rounded" />
                              </div>
                              <div className="h-48 rounded-2xl bg-white/5 border border-white/5 p-4 flex flex-col justify-end">
                                 <div className="flex gap-1 h-32 items-end">
                                    {[30, 45, 25, 60, 40, 80, 55].map((h, i) => (
                                      <div key={i} className="flex-1 bg-indigo-500/30 rounded-t-lg" style={{ height: `${h}%` }} />
                                    ))}
                                 </div>
                              </div>
                           </div>
                           <div className="col-span-6 rounded-[2rem] bg-gradient-to-br from-indigo-500/10 to-transparent border border-white/10 p-10 flex flex-col justify-center">
                              <Sparkles size={48} className="text-white/20 mb-6" />
                              <h3 className="text-3xl font-black mb-4">Neural Analytics</h3>
                              <p className="text-slate-500 mb-8">Real-time processing of global data streams at 1.2M events/sec.</p>
                              <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                                 <motion.div 
                                    animate={{ x: ["-100%", "100%"] }}
                                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                                    className="w-1/3 h-full bg-gradient-to-r from-transparent via-white/50 to-transparent"
                                 />
                              </div>
                           </div>
                           <div className="col-span-3 flex flex-col justify-between">
                              <div className="grid grid-cols-2 gap-4">
                                 {[1, 2, 3, 4].map(n => (
                                   <div key={n} className="aspect-square rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center">
                                      <Box className="text-white/10" />
                                   </div>
                                 ))}
                              </div>
                              <div className="h-24 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 p-4">
                                 <Activity size={16} className="text-cyan-400 mb-2" />
                                 <div className="h-1 bg-cyan-400/20 w-full rounded" />
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        </section>

        {/* Bento Grid Features */}
        <section id="features" className="py-48 px-8 relative overflow-hidden">
           {/* Center Light Source */}
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-500/5 rounded-full blur-[180px] -z-10" />
           
           <div className="max-w-7xl mx-auto">
              <div className="mb-32">
                 <h2 className="text-4xl md:text-6xl font-outfit font-black mb-6">Neural Architecture <span className="text-slate-600">v2.0</span></h2>
                 <p className="text-xl text-slate-500 max-w-xl font-medium">Exceeding every standard of enterprise reliability with a decentralized command structure.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 grid-rows-2 gap-6 min-h-[800px]">
                 {/* Large Card 1 */}
                 <div className="md:col-span-7 row-span-1 glass-panel glass-panel-hover p-12 flex flex-col justify-between group overflow-hidden">
                    <div className="absolute top-0 right-0 p-12 opacity-5 group-hover:opacity-10 transition-opacity">
                       <ShieldCheck size={200} className="text-white" />
                    </div>
                    <div>
                       <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 mb-8 border border-indigo-500/20">
                          <Lock size={32} />
                       </div>
                       <h3 className="text-4xl font-bold mb-6">Zero-Trust Identity</h3>
                       <p className="text-lg text-slate-400 leading-relaxed max-w-sm">
                          Granular biometric and RBAC protocols protecting every byte of your corporate ecosystem across 45 nodes.
                       </p>
                    </div>
                    <div className="flex gap-3">
                       {["Encryption", "RBAC", "Cloud", "SAML"].map(t => (
                         <span key={t} className="px-5 py-2 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-slate-500">{t}</span>
                       ))}
                    </div>
                 </div>

                 {/* Slim Card 1 */}
                 <div className="md:col-span-5 row-span-1 glass-panel glass-panel-hover p-10 flex flex-col justify-center text-center">
                    <div className="w-20 h-20 bg-cyan-500/10 rounded-full mx-auto mb-8 flex items-center justify-center text-cyan-400 border border-cyan-500/20">
                       <Globe2 size={40} />
                    </div>
                    <h3 className="text-2xl font-black mb-4">Edge Presence</h3>
                    <p className="text-slate-500">Latency-free execution in 140+ global regions with automated failover.</p>
                 </div>

                 {/* Slim Card 2 */}
                 <div className="md:col-span-4 row-span-1 glass-panel glass-panel-hover p-10 flex flex-col items-center justify-center group">
                    <div className="text-6xl font-black mb-4 flex items-baseline gap-1">
                      <span className="text-glow group-hover:text-indigo-400 transition-colors">99.9</span>
                      <span className="text-2xl text-slate-700">%</span>
                    </div>
                    <p className="font-black uppercase tracking-[0.3em] text-[10px] text-slate-500">Redundancy Metric</p>
                 </div>

                 {/* Large Card 2 */}
                 <div className="md:col-span-8 row-span-1 bg-gradient-to-tr from-white/[0.03] to-white/[0.01] border border-white/5 backdrop-blur-xl rounded-[40px] p-12 flex items-center relative overflow-hidden group">
                    <div className="grid grid-cols-2 gap-12 w-full items-center">
                       <div>
                          <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center mb-8 border border-white/5 shadow-xl">
                             <BarChart3 className="text-indigo-500" />
                          </div>
                          <h3 className="text-4xl font-bold mb-6">Cognitive Pipeline</h3>
                          <p className="text-slate-500 leading-relaxed">
                             Automated sales funnels that learn from customer interactions to maximize LTV and minimize churn.
                          </p>
                       </div>
                       <div className="bg-black/50 rounded-3xl p-6 border border-white/5 shadow-inner scale-110 group-hover:scale-125 transition-transform duration-700">
                          <div className="flex flex-col gap-4">
                             {[1, 2, 3].map(n => (
                               <div key={n} className="flex items-center gap-4">
                                  <div className="w-10 h-10 rounded-lg bg-white/5" />
                                  <div className="flex-1 h-3 bg-white/5 rounded" />
                                  <div className="w-16 h-3 bg-indigo-500/40 rounded" />
                               </div>
                             ))}
                          </div>
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        </section>

        {/* Neural Activity Stats */}
        <section className="py-24 border-y border-white/5">
           <div className="max-w-7xl mx-auto px-8">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-16">
                 {[
                   { label: "Active Nodes", value: "2,408", icon: Globe2 },
                   { label: "Neural Ops/S", value: "1.2M+", icon: Zap },
                   { label: "Global Users", value: "850k", icon: Users },
                   { label: "Threats Deflected", value: "100%", icon: ShieldCheck }
                 ].map((stat, i) => (
                   <div key={i} className="flex flex-col gap-2">
                      <div className="flex items-center gap-3 text-slate-500 mb-2">
                         <stat.icon size={16} />
                         <span className="text-[10px] font-black uppercase tracking-widest">{stat.label}</span>
                      </div>
                      <div className="text-5xl font-outfit font-black tracking-tight">{stat.value}</div>
                   </div>
                 ))}
              </div>
           </div>
        </section>

        {/* Advanced Footer CTA */}
        <section className="py-48 px-8">
          <div className="max-w-6xl mx-auto">
             <motion.div 
                initial={{ opacity: 0, y: 100 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1 }}
                className="relative glass-panel p-24 rounded-[60px] text-center overflow-hidden border border-white/10 hover:border-indigo-500/30 transition-colors"
             >
                {/* Background FX */}
                <div className="absolute inset-0 bg-gradient-to-t from-indigo-500/10 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-1000" />
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-indigo-500 to-transparent shadow-[0_0_20px_#6366f1]" />
                
                <h2 className="text-4xl md:text-7xl font-outfit font-black mb-10 tracking-tight leading-none">
                  Establish Your <br />
                  <span className="text-glow group-hover:text-indigo-400 transition-colors">Digital Sovereignty</span>
                </h2>
                <p className="text-xl text-slate-400 mb-16 max-w-2xl mx-auto font-light">
                  Direct your enterprise flow with the precision of neural architecture. Experience the power of B-EMS.
                </p>
                
                <Link href="/ems/login" className="inline-flex items-center gap-4 bg-white text-black px-12 py-6 rounded-3xl font-black text-xl hover:scale-105 transition-all shadow-[0_0_50px_rgba(255,255,255,0.4)]">
                  Initialize Master Portal <LayoutDashboard size={28} />
                </Link>

                <div className="mt-20 flex justify-center gap-12 text-slate-600 font-bold text-xs uppercase tracking-widest">
                   {["Automated Compliance", "ISO 27001 Certified", "24/7 Command Support"].map(t => (
                     <div key={t} className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                        {t}
                     </div>
                   ))}
                </div>
             </motion.div>
          </div>
        </section>
      </main>

      <footer className="relative z-10 py-24 px-8 border-t border-white/5 bg-black/50 backdrop-blur-3xl">
        <div className="max-w-7xl mx-auto">
           <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="flex items-center gap-3">
                 <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center font-bold border border-white/5">B</div>
                 <span className="text-slate-500 font-bold">© 2026 Bytecode Trainings. Neural-Ops Division.</span>
              </div>
              <div className="flex md:justify-end gap-12 text-[10px] font-black uppercase tracking-widest text-slate-600">
                 {["Privacy Protocols", "Nexus Terms", "Network Status", "Operational Docs"].map(item => (
                   <a key={item} href="#" className="hover:text-indigo-400 transition-colors">{item}</a>
                 ))}
              </div>
           </div>
        </div>
      </footer>
    </div>
  );
}



