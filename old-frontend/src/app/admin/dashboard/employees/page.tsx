"use client";

import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Plus, MoreHorizontal, Mail, Phone, Users, Briefcase, Star, Clock, UserCheck, Shield, Laptop, BadgeCheck, X } from 'lucide-react';
import { useState } from 'react';
import styles from '../Admin.module.css';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.1 }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
};

const INITIAL_EMPLOYEES_DATA = [
    { id: 'EMP-001', name: 'Sarah Connor', role: 'Senior Trainer', dept: 'Academics', status: 'Active', rating: 4.9, email: 'sarah.c@bytecode.com', img: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah', projects: 4, type: 'Full-Time' },
    { id: 'EMP-002', name: 'Mike Ross', role: 'Counselor Lead', dept: 'Sales', status: 'On Leave', rating: 4.7, email: 'mike.r@bytecode.com', img: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike', projects: 12, type: 'Full-Time' },
    { id: 'EMP-003', name: 'Jessica Pearson', role: 'HR Manager', dept: 'HR', status: 'Active', rating: 5.0, email: 'jessica.p@bytecode.com', img: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jessica', projects: 8, type: 'Remote' },
    { id: 'EMP-004', name: 'Harvey Specter', role: 'Legal Advisor', dept: 'Legal', status: 'Active', rating: 4.8, email: 'harvey.s@bytecode.com', img: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Harvey', projects: 5, type: 'Contract' },
    { id: 'EMP-005', name: 'Louis Litt', role: 'Finance Head', dept: 'Finance', status: 'Active', rating: 4.6, email: 'louis.l@bytecode.com', img: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Louis', projects: 15, type: 'Full-Time' },
    { id: 'EMP-006', name: 'Rachel Zane', role: 'Junior Trainer', dept: 'Academics', status: 'Active', rating: 4.5, email: 'rachel.z@bytecode.com', img: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rachel', projects: 2, type: 'Part-Time' },
];

export default function EmployeesPage() {
    const [employees, setEmployees] = useState(INITIAL_EMPLOYEES_DATA);
    const [activeTab, setActiveTab] = useState('All Staff');
    const [activeActionId, setActiveActionId] = useState<string | null>(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [newEmployee, setNewEmployee] = useState({
        name: '',
        email: '',
        role: '',
        dept: 'Academics',
        type: 'Full-Time',
        mobile: '',
        password: ''
    });

    const filteredEmployees = employees.filter(emp => {
        if (activeTab === 'All Staff') return true;
        if (activeTab === 'Trainers') return emp.dept === 'Academics';
        if (activeTab === 'HR & Admin') return emp.dept === 'HR' || emp.dept === 'Finance' || emp.dept === 'Legal';
        if (activeTab === 'Sales') return emp.dept === 'Sales';
        return true;
    });

    const handleAction = (action: string, name: string) => {
        alert(`${action} for ${name}`);
        setActiveActionId(null);
    };

    const handleAddEmployee = (e: React.FormEvent) => {
        e.preventDefault();
        const newId = `EMP-${String(employees.length + 1).padStart(3, '0')}`;
        const employeeToAdd = {
            id: newId,
            ...newEmployee,
            status: 'Active',
            rating: 0,
            img: `https://api.dicebear.com/7.x/avataaars/svg?seed=${newEmployee.name}`,
            projects: 0
        };
        setEmployees([employeeToAdd, ...employees]);
        setIsAddModalOpen(false);
        setNewEmployee({ name: '', email: '', role: '', dept: 'Academics', type: 'Full-Time', mobile: '', password: '' });
        alert(`New Employee ${newEmployee.name} Added!`);
    };

    return (
        <DashboardLayout role="admin">
            <motion.div
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                className={styles.container}
            >
                {/* Header */}
                <div className={styles.glassHeader} style={{ marginBottom: '2rem' }}>
                    <div className={styles.titleGroup}>
                        <h3 style={{ fontSize: '1.8rem' }}>EMPLOYEE MANAGEMENT</h3>
                        <p className={styles.subTitle}>Manage trainers, staff, and faculty details.</p>
                    </div>
                    <button
                        className={styles.viewScheduleBtn}
                        style={{ width: 'auto', padding: '0.8rem 1.5rem', marginTop: 0 }}
                        onClick={() => setIsAddModalOpen(true)}
                    >
                        <Plus size={18} style={{ marginRight: '0.5rem' }} /> Add New Employee
                    </button>
                </div>

                {/* Top Stats Row */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '2rem' }}>
                    {/* ... (Stats Cards remain unchanged) ... */}
                    <motion.div variants={itemVariants} className={styles.glassPanel} style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ padding: '0.8rem', borderRadius: '12px', background: 'rgba(99, 102, 241, 0.1)', color: '#818cf8' }}><Users size={24} /></div>
                        <div>
                            <div style={{ fontSize: '1.8rem', fontWeight: 'bold', fontFamily: 'Rajdhani', color: 'white' }}>{employees.length}</div>
                            <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Total Employees</div>
                        </div>
                    </motion.div>
                    <motion.div variants={itemVariants} className={styles.glassPanel} style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ padding: '0.8rem', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.1)', color: '#34d399' }}><UserCheck size={24} /></div>
                        <div>
                            <div style={{ fontSize: '1.8rem', fontWeight: 'bold', fontFamily: 'Rajdhani', color: 'white' }}>{employees.filter(e => e.status === 'Active').length}</div>
                            <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Active Now</div>
                        </div>
                    </motion.div>
                    <motion.div variants={itemVariants} className={styles.glassPanel} style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ padding: '0.8rem', borderRadius: '12px', background: 'rgba(234, 179, 8, 0.1)', color: '#facc15' }}><Clock size={24} /></div>
                        <div>
                            <div style={{ fontSize: '1.8rem', fontWeight: 'bold', fontFamily: 'Rajdhani', color: 'white' }}>{employees.filter(e => e.status === 'On Leave').length}</div>
                            <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>On Leave</div>
                        </div>
                    </motion.div>
                    <motion.div variants={itemVariants} className={styles.glassPanel} style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ padding: '0.8rem', borderRadius: '12px', background: 'rgba(236, 72, 153, 0.1)', color: '#f472b6' }}><Star size={24} /></div>
                        <div>
                            <div style={{ fontSize: '1.8rem', fontWeight: 'bold', fontFamily: 'Rajdhani', color: 'white' }}>4.8</div>
                            <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Avg Performance</div>
                        </div>
                    </motion.div>
                </div>

                {/* Filters & Tabs */}
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap', alignItems: 'center' }}>
                    <div style={{ display: 'flex', background: 'rgba(30, 41, 59, 0.5)', padding: '0.25rem', borderRadius: '0.75rem', border: '1px solid rgba(255,255,255,0.05)' }}>
                        {['All Staff', 'Trainers', 'HR & Admin', 'Sales'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                style={{
                                    padding: '0.5rem 1rem',
                                    background: activeTab === tab ? 'rgba(124, 58, 237, 0.2)' : 'transparent',
                                    color: activeTab === tab ? '#fff' : '#94a3b8',
                                    border: 'none',
                                    borderRadius: '0.5rem',
                                    cursor: 'pointer',
                                    fontSize: '0.85rem',
                                    fontWeight: 500,
                                    transition: 'all 0.2s'
                                }}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    <div className={styles.searchGroup} style={{ flex: 1, maxWidth: '400px', marginLeft: 'auto' }}>
                        <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', zIndex: 1 }} />
                        <input type="text" placeholder="Search employees..." className={styles.searchInput} />
                    </div>
                    <button className={styles.iconBtn}><Filter size={18} /></button>
                </div>

                {/* Employees Table */}
                <motion.div variants={itemVariants} className={styles.glassPanel}>
                    <div className={styles.tableWrapper}>
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th>Employee</th>
                                    <th>Role & Dept</th>
                                    <th>Contact</th>
                                    <th>Status & Type</th>
                                    <th>Rating</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredEmployees.map((emp, i) => (
                                    <tr key={i} className={styles.tableRow}>
                                        <td>
                                            <div className={styles.studentCell}>
                                                <div style={{ position: 'relative' }}>
                                                    <img src={emp.img} alt="" className={styles.studentImg} />
                                                    <div style={{
                                                        position: 'absolute', bottom: -2, right: -2,
                                                        background: '#10b981', borderRadius: '50%', padding: '2px', border: '2px solid #0f172a'
                                                    }}>
                                                        <BadgeCheck size={10} color="white" strokeWidth={3} />
                                                    </div>
                                                </div>
                                                <div className={styles.studentInfo}>
                                                    <div className={styles.studentName}>{emp.name}</div>
                                                    <div className={styles.studentId}>{emp.id}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                                                <span style={{ fontSize: '0.9rem', fontWeight: 500, color: '#f1f5f9' }}>{emp.role}</span>
                                                <span className={styles.statusTag} style={{ background: 'rgba(124, 58, 237, 0.1)', color: '#a78bfa', width: 'fit-content' }}>
                                                    {emp.dept}
                                                </span>
                                            </div>
                                        </td>
                                        <td>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', fontSize: '0.85rem', color: '#cbd5e1' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                    <Mail size={12} color="#94a3b8" /> {emp.email}
                                                </div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                    <Phone size={12} color="#94a3b8" /> +1 (555) 000-0000
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                                                <span className={`${styles.statusBadge} ${emp.status === 'Active' ? styles.paid : styles.statusBusy}`}
                                                    style={emp.status === 'On Leave' ? { background: 'rgba(234, 179, 8, 0.1)', color: '#facc15', borderColor: 'rgba(234, 179, 8, 0.2)' } : {}}
                                                >
                                                    {emp.status.toUpperCase()}
                                                </span>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.1rem' }}>
                                                    <Briefcase size={10} /> {emp.type}
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#fbbf24', fontWeight: 600 }}>
                                                <Star size={14} fill="#fbbf24" /> {emp.rating.toFixed(1)}
                                            </div>
                                            <div style={{ fontSize: '0.7rem', color: '#64748b' }}>{emp.projects} Active Projects</div>
                                        </td>
                                        <td>
                                            <div style={{ position: 'relative' }}>
                                                <button
                                                    className={styles.actionCellBtn}
                                                    onClick={() => setActiveActionId(activeActionId === emp.id ? null : emp.id)}
                                                >
                                                    <MoreHorizontal size={16} />
                                                </button>
                                                <AnimatePresence>
                                                    {activeActionId === emp.id && (
                                                        <motion.div
                                                            initial={{ opacity: 0, scale: 0.9, y: 10 }}
                                                            animate={{ opacity: 1, scale: 1, y: 0 }}
                                                            exit={{ opacity: 0, scale: 0.9, y: 10 }}
                                                            className={styles.actionMenu}
                                                            style={{ right: '0', top: '100%', zIndex: 50 }}
                                                        >
                                                            <div className={styles.actionMenuItem} onClick={() => handleAction('View Profile', emp.name)}>
                                                                <UserCheck size={14} /> View Profile
                                                            </div>
                                                            <div className={styles.actionMenuItem} onClick={() => handleAction('Review Performance', emp.name)}>
                                                                <Star size={14} /> Review Performance
                                                            </div>
                                                            <div className={styles.actionMenuItem} style={{ color: '#ef4444' }} onClick={() => handleAction('Terminate Access', emp.name)}>
                                                                <Shield size={14} /> Suspend Access
                                                            </div>
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </motion.div>

                {/* Add Employee Modal */}
                <AnimatePresence>
                    {isAddModalOpen && (
                        <>
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                style={{
                                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                                    background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(5px)', zIndex: 100
                                }}
                                onClick={() => setIsAddModalOpen(false)}
                            />
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95, x: '-50%', y: '-45%' }}
                                animate={{ opacity: 1, scale: 1, x: '-50%', y: '-50%' }}
                                exit={{ opacity: 0, scale: 0.95, x: '-50%', y: '-45%' }}
                                style={{
                                    position: 'fixed', top: '50%', left: '50%',
                                    background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)',
                                    borderRadius: '1rem', padding: '2rem', width: '90%', maxWidth: '500px',
                                    zIndex: 101, boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
                                    maxHeight: '90vh', overflowY: 'auto'
                                }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                    <h3 style={{ fontSize: '1.5rem', fontWeight: 600 }}>Add New Employee</h3>
                                    <button onClick={() => setIsAddModalOpen(false)} style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}><X size={20} /></button>
                                </div>
                                <form onSubmit={handleAddEmployee} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.85rem', color: '#94a3b8', marginBottom: '0.5rem' }}>Full Name</label>
                                        <input
                                            type="text"
                                            required
                                            className={styles.searchInput}
                                            style={{ width: '100%', borderRadius: '0.5rem' }}
                                            value={newEmployee.name}
                                            onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })}
                                            placeholder="John Doe"
                                        />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.85rem', color: '#94a3b8', marginBottom: '0.5rem' }}>Email Address</label>
                                        <input
                                            type="email"
                                            required
                                            className={styles.searchInput}
                                            style={{ width: '100%', borderRadius: '0.5rem' }}
                                            value={newEmployee.email}
                                            onChange={(e) => setNewEmployee({ ...newEmployee, email: e.target.value })}
                                            placeholder="john@example.com"
                                        />
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                        <div>
                                            <label style={{ display: 'block', fontSize: '0.85rem', color: '#94a3b8', marginBottom: '0.5rem' }}>Mobile Number</label>
                                            <input
                                                type="tel"
                                                required
                                                className={styles.searchInput}
                                                style={{ width: '100%', borderRadius: '0.5rem' }}
                                                value={newEmployee.mobile}
                                                onChange={(e) => setNewEmployee({ ...newEmployee, mobile: e.target.value })}
                                                placeholder="+1 234 567 890"
                                            />
                                        </div>
                                        <div>
                                            <label style={{ display: 'block', fontSize: '0.85rem', color: '#94a3b8', marginBottom: '0.5rem' }}>Password</label>
                                            <input
                                                type="password"
                                                required
                                                className={styles.searchInput}
                                                style={{ width: '100%', borderRadius: '0.5rem' }}
                                                value={newEmployee.password}
                                                onChange={(e) => setNewEmployee({ ...newEmployee, password: e.target.value })}
                                                placeholder="••••••••"
                                            />
                                        </div>
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                        <div>
                                            <label style={{ display: 'block', fontSize: '0.85rem', color: '#94a3b8', marginBottom: '0.5rem' }}>Role</label>
                                            <input
                                                type="text"
                                                required
                                                className={styles.searchInput}
                                                style={{ width: '100%', borderRadius: '0.5rem' }}
                                                value={newEmployee.role}
                                                onChange={(e) => setNewEmployee({ ...newEmployee, role: e.target.value })}
                                                placeholder="Senior Developer"
                                            />
                                        </div>
                                        <div>
                                            <label style={{ display: 'block', fontSize: '0.85rem', color: '#94a3b8', marginBottom: '0.5rem' }}>Department</label>
                                            <select
                                                className={styles.searchInput}
                                                style={{ width: '100%', borderRadius: '0.5rem' }}
                                                value={newEmployee.dept}
                                                onChange={(e) => setNewEmployee({ ...newEmployee, dept: e.target.value })}
                                            >
                                                <option value="Academics">Academics</option>
                                                <option value="Sales">Sales</option>
                                                <option value="HR">HR</option>
                                                <option value="Finance">Finance</option>
                                                <option value="Legal">Legal</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.85rem', color: '#94a3b8', marginBottom: '0.5rem' }}>Employment Type</label>
                                        <select
                                            className={styles.searchInput}
                                            style={{ width: '100%', borderRadius: '0.5rem' }}
                                            value={newEmployee.type}
                                            onChange={(e) => setNewEmployee({ ...newEmployee, type: e.target.value })}
                                        >
                                            <option value="Full-Time">Full-Time</option>
                                            <option value="Part-Time">Part-Time</option>
                                            <option value="Contract">Contract</option>
                                            <option value="Remote">Remote</option>
                                        </select>
                                    </div>
                                    <button
                                        type="submit"
                                        style={{
                                            background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
                                            color: 'white', border: 'none', padding: '0.8rem', borderRadius: '0.5rem',
                                            fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer', marginTop: '1rem'
                                        }}
                                    >
                                        Add Member
                                    </button>
                                </form>
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>
            </motion.div>
        </DashboardLayout>
    );
}
