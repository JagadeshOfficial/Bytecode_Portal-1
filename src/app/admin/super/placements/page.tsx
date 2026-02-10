"use client";

import { useState } from 'react';
import AdvancedModuleLayout from '@/components/dashboard/AdvancedModuleLayout';
import {
    Briefcase,
    Building,
    Building2,
    Users,
    CheckCircle,
    Calendar,
    Globe,
    Award
} from 'lucide-react';

export default function PlacementsPage() {
    const [activeTab, setActiveTab] = useState('overview');

    const stats = [
        { label: "Total Placed", value: "450+", icon: Award, color: "#f59e0b", trend: "+12% YoY" },
        { label: "Active Companies", value: "85", icon: Building2, color: "#3b82f6", trend: "+5 New" },
        { label: "Avg. Package", value: "₹8.5 LPA", icon: Briefcase, color: "#10b981", trend: "+1.2L" },
        { label: "Pending Interviews", value: "24", icon: Calendar, color: "#8b5cf6", trend: "This Week" },
    ];

    return (
        <AdvancedModuleLayout
            title="Placement & Careers"
            subtitle="Manage corporate relations, student placements, and interview schedules."
            stats={stats}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            tabs={[
                { id: 'overview', label: 'Overview', icon: Globe },
                { id: 'companies', label: 'Partners', icon: Building },
                { id: 'students', label: 'Candidates', icon: Users },
                { id: 'drives', label: 'Hiring Drives', icon: Calendar },
            ]}
        >
            {activeTab === 'overview' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="bg-slate-900/50 border border-white/5 rounded-2xl p-6 backdrop-blur-sm lg:col-span-2">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-bold text-white">Upcoming Drives</h3>
                            <button className="text-xs text-blue-400 font-bold hover:underline">See All</button>
                        </div>
                        <div className="space-y-4">
                            {[
                                { company: "Google", role: "SDE I", date: "Feb 15, 2026", type: "On-Campus" },
                                { company: "Amazon", role: "Cloud Support", date: "Feb 18, 2026", type: "Virtual" },
                                { company: "TCS", role: "System Engineer", date: "Feb 20, 2026", type: "On-Campus" },
                            ].map((drive, i) => (
                                <div key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5 hover:border-blue-500/30 transition-all cursor-pointer">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center font-bold text-slate-900 text-xs">
                                            {drive.company.substring(0, 1)}
                                        </div>
                                        <div>
                                            <div className="font-bold text-white">{drive.company}</div>
                                            <div className="text-xs text-slate-400">{drive.role} • {drive.date}</div>
                                        </div>
                                    </div>
                                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-700/50 text-slate-300 border border-slate-600">
                                        {drive.type}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </AdvancedModuleLayout>
    );
}
