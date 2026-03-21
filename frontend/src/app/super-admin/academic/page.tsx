"use client";

import DashboardLayout from '@/components/DashboardLayout';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { 
    Book, Plus, Search, Edit2, Trash2, 
    Layers, Users, Clock, User, BookOpen, 
    ChevronRight, ChevronLeft, Folder, File,
    Download, Upload, Eye, MoreVertical, 
    CheckCircle, Calendar, Play, FileText,
    ExternalLink, Share2, Lock, Globe,
    Settings, HardDrive, Filter
} from 'lucide-react';

export default function AcademicHub() {
    const [viewMode, setViewMode] = useState<'COURSES' | 'BATCHES' | 'DETAILS'>('COURSES');
    const [courses, setCourses] = useState<any[]>([]);
    const [batches, setBatches] = useState<any[]>([]);
    const [allUsers, setAllUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    
    // Selection state
    const [selectedCourse, setSelectedCourse] = useState<any>(null);
    const [selectedBatch, setSelectedBatch] = useState<any>(null);

    // Modals
    const [isCreateFolderOpen, setIsCreateFolderOpen] = useState(false);
    const [isShareModalOpen, setIsShareModalOpen] = useState(false);
    const [newFolderName, setNewFolderName] = useState('');
    const [sharingTarget, setSharingTarget] = useState<any>(null);

    const [searchTerm, setSearchTerm] = useState('');

    const fetchData = async () => {
        setLoading(true);
        try {
            const [cRes, bRes, uRes] = await Promise.all([
                fetch('http://localhost:8081/api/courses'),
                fetch('http://localhost:8089/api/academic/batches'),
                fetch('http://localhost:8082/api/users')
            ]);
            
            const cData = await cRes.json();
            const bData = await bRes.json();
            const uData = await uRes.json();

            if (Array.isArray(cData)) setCourses(cData);
            if (Array.isArray(bData)) setBatches(bData);
            if (Array.isArray(uData)) setAllUsers(uData);
        } catch (err) {
            console.error(err);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleCreateFolder = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newFolderName.trim()) return;

        const updatedBatch = { ...selectedBatch };
        const newFolder = {
            name: newFolderName,
            createdBy: "Super Admin", // Actually fetch current user
            sharedWith: [], 
            files: []
        };
        
        updatedBatch.folders = [...(updatedBatch.folders || []), newFolder];

        try {
            const res = await fetch(`http://localhost:8089/api/academic/batches/${selectedBatch.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedBatch)
            });
            if (res.ok) {
                const savedBatch = await res.json();
                setSelectedBatch(savedBatch);
                // Update batch in list locally
                setBatches(batches.map(b => b.id === savedBatch.id ? savedBatch : b));
                setIsCreateFolderOpen(false);
                setNewFolderName('');
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleCourseClick = (course: any) => {
        setSelectedCourse(course);
        setViewMode('BATCHES');
    };

    const handleBatchClick = (batch: any) => {
        setSelectedBatch(batch);
        setViewMode('DETAILS');
    };

    const goBack = () => {
        if (viewMode === 'DETAILS') setViewMode('BATCHES');
        else if (viewMode === 'BATCHES') setViewMode('COURSES');
    };

    const filteredBatches = batches.filter(b => b.courseId === selectedCourse?.id);
    const tutor = allUsers.find(u => u.id === selectedBatch?.trainerId);
    const students = allUsers.filter(u => u.role === 'STUDENT' && (selectedBatch?.studentIds?.includes(u.id) || selectedBatch?.studentIds?.includes(u.email)));

    return (
        <DashboardLayout role="super_admin">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ paddingBottom: '5rem' }}>
                
                {/* --- NAVIGATION BREADCRUMBS --- */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '2rem', fontSize: '0.9rem', fontWeight: 600 }}>
                    <span onClick={() => setViewMode('COURSES')} style={{ cursor: 'pointer', color: viewMode === 'COURSES' ? 'var(--primary)' : 'var(--text-dim)' }}>Courses Hub</span>
                    {viewMode !== 'COURSES' && (
                        <>
                            <ChevronRight size={14} color="var(--text-dim)" />
                            <span onClick={() => setViewMode('BATCHES')} style={{ cursor: 'pointer', color: viewMode === 'BATCHES' ? 'var(--primary)' : 'var(--text-dim)' }}>{selectedCourse?.title}</span>
                        </>
                    )}
                    {viewMode === 'DETAILS' && (
                        <>
                            <ChevronRight size={14} color="var(--text-dim)" />
                            <span style={{ color: 'var(--primary)', fontWeight: 800 }}>📂 Workspace: {selectedBatch?.name || selectedBatch?.batchName}</span>
                        </>
                    )}
                </div>

                {/* --- HEADER --- */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem' }}>
                    <div>
                        <h1 style={{ fontSize: '2.8rem', fontWeight: 900, letterSpacing: '-1.5px' }}>
                            {viewMode === 'COURSES' ? 'Curriculum Hub' : viewMode === 'BATCHES' ? 'Select Cohort' : 'Batch Drive Workspace'}
                        </h1>
                        <p style={{ color: 'var(--text-dim)', fontSize: '1.2rem' }}>
                            {viewMode === 'COURSES' ? 'Browse curated learning paths and modules.' : viewMode === 'BATCHES' ? `Managing batches for ${selectedCourse?.title}.` : `Real-time collaboration for the current batch.`}
                        </p>
                    </div>
                    {viewMode !== 'COURSES' && (
                        <button onClick={goBack} style={{ background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', padding: '12px 24px', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 900, cursor: 'pointer' }}>
                            <ChevronLeft size={18} /> GO BACK
                        </button>
                    )}
                </div>

                <AnimatePresence mode="wait">
                    {/* --- COURSES GRID --- */}
                    {viewMode === 'COURSES' && (
                        <motion.div key="courses" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem' }}>
                            {courses.map((c, i) => (
                                <CourseCard key={c.id || i} course={c} onClick={() => handleCourseClick(c)} delay={i * 0.05} />
                            ))}
                        </motion.div>
                    )}

                    {/* --- BATCHES GRID --- */}
                    {viewMode === 'BATCHES' && (
                        <motion.div key="batches" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem' }}>
                            {filteredBatches.map((b, i) => (
                                <BatchCard key={b.id || i} batch={b} onClick={() => handleBatchClick(b)} delay={i * 0.05} />
                            ))}
                        </motion.div>
                    )}

                    {/* --- DRIVE WORKSPACE --- */}
                    {viewMode === 'DETAILS' && (
                        <motion.div key="details" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.02 }} style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 350px', gap: '2.5rem' }}>
                            {/* --- MAIN DRIVE AREA --- */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
                                {/* --- TOOLBAR --- */}
                                <div className="glass-panel" style={{ padding: '1.25rem 2rem', borderRadius: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div style={{ display: 'flex', gap: '1rem' }}>
                                        <button onClick={() => setIsCreateFolderOpen(true)} className="btn-quantum" style={{ padding: '10px 20px', fontSize: '0.8rem', background: 'var(--primary)', color: '#000' }}>
                                            <Plus size={16} /> NEW FOLDER
                                        </button>
                                        <button className="btn-quantum" style={{ padding: '10px 20px', fontSize: '0.8rem', background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid rgba(255,255,255,0.05)' }}>
                                            <Upload size={16} /> UPLOAD FILE
                                        </button>
                                    </div>
                                    <div style={{ display: 'flex', gap: '10px' }}>
                                         <span style={{ color: 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.8rem' }}><Filter size={14} /> Filter: All Items</span>
                                    </div>
                                </div>

                                {/* --- DRIVE CONTENT --- */}
                                <div className="glass-panel" style={{ padding: '2.5rem', borderRadius: '40px', minHeight: '600px' }}>
                                    <h3 style={{ fontSize: '1.4rem', fontWeight: 900, marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <HardDrive color="var(--primary)" /> Shared Resources Drive
                                    </h3>

                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '2rem' }}>
                                         {selectedBatch?.folders?.map((folder: any, fIdx: number) => (
                                             <DriveFolder key={fIdx} folder={folder} onShare={() => { setSharingTarget(folder); setIsShareModalOpen(true); }} />
                                         ))}
                                         {(!selectedBatch?.folders || selectedBatch.folders.length === 0) && (
                                              <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '5rem', background: 'rgba(255,255,255,0.01)', borderRadius: '32px' }}>
                                                  <Folder size={48} color="var(--text-dim)" style={{ marginBottom: '1rem', opacity: 0.1 }} />
                                                  <p style={{ color: 'var(--text-dim)', fontWeight: 800 }}>Create your first folder to start sharing.</p>
                                              </div>
                                         )}
                                    </div>
                                </div>
                            </div>

                            {/* --- RIGHT INFO PANEL (Shared Side) --- */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
                                 {/* --- QUICK ACCESS / BATCH INFO --- */}
                                 <div className="glass-panel" style={{ padding: '2rem', borderRadius: '32px' }}>
                                      <h4 style={{ fontSize: '1rem', fontWeight: 900, color: 'var(--primary)', marginBottom: '1.5rem', textTransform: 'uppercase' }}>Workspace Access</h4>
                                      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                           <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                                <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(124, 58, 237, 0.1)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><User size={20} /></div>
                                                <div>
                                                     <div style={{ fontSize: '0.9rem', fontWeight: 800 }}>Tutor In-Charge</div>
                                                     <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>{tutor?.fullName || 'Pending'}</div>
                                                </div>
                                           </div>
                                           <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                                <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Users size={20} /></div>
                                                <div>
                                                     <div style={{ fontSize: '0.9rem', fontWeight: 800 }}>Privacy: Custom</div>
                                                     <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>{students.length} people have access</div>
                                                </div>
                                           </div>
                                      </div>
                                 </div>

                                 {/* --- STAFF NOTES / ACTIVITY --- */}
                                 <div className="glass-panel" style={{ padding: '2rem', borderRadius: '32px', flex: 1 }}>
                                      <h4 style={{ fontSize: '1rem', fontWeight: 900, marginBottom: '1.5rem' }}>Recent Activity</h4>
                                      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                           <ActivityItem text="Tutor updated the Syllabus" time="Today, 10:45 AM" />
                                           <ActivityItem text="Module 2 resources added" time="Yesterday" />
                                           <ActivityItem text="Batch created" time="2 weeks ago" />
                                      </div>
                                 </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>

            {/* --- CREATE FOLDER MODAL --- */}
            <AnimatePresence>
                 {isCreateFolderOpen && (
                     <div style={{ position: 'fixed', inset: 0, zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)' }}>
                          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="glass-panel" style={{ width: '90%', maxWidth: '450px', padding: '3rem', borderRadius: '40px' }}>
                               <h2 style={{ fontSize: '1.8rem', fontWeight: 900, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '15px' }}><Folder color="var(--primary)" /> New Folder</h2>
                               <form onSubmit={handleCreateFolder}>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '2rem' }}>
                                         <label style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-dim)' }}>FOLDER NAME</label>
                                         <input 
                                            value={newFolderName} 
                                            onChange={(e) => setNewFolderName(e.target.value)} 
                                            autoFocus 
                                            placeholder="e.g. Session Recordings" 
                                            style={inputStyle} 
                                         />
                                    </div>
                                    <div style={{ display: 'flex', gap: '1rem' }}>
                                         <button type="button" onClick={() => setIsCreateFolderOpen(false)} style={{ flex: 1, padding: '12px', borderRadius: '14px', background: 'rgba(255,255,255,0.05)', color: '#fff', border: 'none', fontWeight: 800, cursor: 'pointer' }}>CANCEL</button>
                                         <button type="submit" className="btn-quantum" style={{ flex: 2, padding: '12px', borderRadius: '14px' }}>CREATE FOLDER</button>
                                    </div>
                               </form>
                          </motion.div>
                     </div>
                 )}
            </AnimatePresence>

            {/* --- SHARE ACCESS MODAL --- */}
            <AnimatePresence>
                 {isShareModalOpen && sharingTarget && (
                     <div style={{ position: 'fixed', inset: 0, zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)' }}>
                          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="glass-panel" style={{ width: '90%', maxWidth: '500px', padding: '3rem', borderRadius: '40px' }}>
                               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
                                    <div>
                                         <h2 style={{ fontSize: '1.5rem', fontWeight: 900 }}>Share "{sharingTarget.name}"</h2>
                                         <p style={{ color: 'var(--text-dim)', fontSize: '0.85rem' }}>Give people access to view or edit this item.</p>
                                    </div>
                                    <button onClick={() => setIsShareModalOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text-dim)', cursor: 'pointer' }}><XCircle size={24} /></button>
                               </div>

                               <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '2rem' }}>
                                    <div style={{ background: 'rgba(255,255,255,0.03)', padding: '15px', borderRadius: '16px', display: 'flex', gap: '15px', alignItems: 'center' }}>
                                         <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--primary)', color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 900 }}>G</div>
                                         <div style={{ flex: 1 }}>
                                              <div style={{ fontSize: '0.9rem', fontWeight: 800 }}>General Access</div>
                                              <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Anyone with the link can view</div>
                                         </div>
                                         <select style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 800, fontSize: '0.8rem', outline: 'none' }}>
                                              <option>Restricted</option>
                                              <option>Anyone</option>
                                         </select>
                                    </div>

                                    <div>
                                         <h4 style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-dim)', marginBottom: '10px', textTransform: 'uppercase' }}>Shared With (2 people)</h4>
                                         <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                              <SharedMember name="Director (You)" role="Owner" />
                                              <SharedMember name="Trainer_Jagadesh" role="Editor" />
                                         </div>
                                    </div>
                               </div>

                               <button onClick={() => setIsShareModalOpen(false)} className="btn-quantum" style={{ width: '100%', padding: '14px', borderRadius: '16px' }}>DONE</button>
                          </motion.div>
                     </div>
                 )}
            </AnimatePresence>

        </DashboardLayout>
    );
}

function DriveFolder({ folder, onShare }: any) {
    return (
        <motion.div 
            whileHover={{ y: -5, background: 'rgba(255,255,255,0.03)' }}
            style={{ 
                padding: '1.5rem', 
                borderRadius: '24px', 
                background: 'rgba(255,255,255,0.01)', 
                border: '1px solid rgba(255,255,255,0.03)', 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                gap: '12px',
                textAlign: 'center',
                cursor: 'pointer',
                position: 'relative'
            }}
        >
            <div style={{ position: 'absolute', top: '10px', right: '10px' }}>
                 <button onClick={(e) => { e.stopPropagation(); onShare(); }} style={{ background: 'none', border: 'none', color: 'var(--text-dim)', opacity: 0.5 }}>
                      <Share2 size={16} />
                 </button>
            </div>
            <Folder size={64} fill="rgba(124, 58, 237, 0.2)" color="var(--primary)" />
            <div>
                 <div style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--text-bright)' }}>{folder.name}</div>
                 <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>{folder.files?.length || 0} items • Shared</div>
            </div>
        </motion.div>
    );
}

function CourseCard({ course, onClick, delay }: any) {
    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }} onClick={onClick} className="glass-panel" 
            style={{ padding: '2.5rem', borderRadius: '32px', cursor: 'pointer', border: '1px solid rgba(255,255,255,0.05)', position: 'relative', overflow: 'hidden' }}
            whileHover={{ y: -5, background: 'rgba(255,255,255,0.06)' }}
        >
            <Book size={32} color="var(--primary)" style={{ marginBottom: '1.5rem' }} />
            <h3 style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: '0.75rem' }}>{course.title}</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-dim)', lineHeight: 1.6, marginBottom: '2rem' }}>{course.description}</p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1.5rem' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 900, color: 'var(--text-dim)' }}>{course.duration}</span>
                <span style={{ color: 'var(--primary)', fontWeight: 900, fontSize: '0.85rem', display: 'flex', alignItems: 'center' }}>EXPLORE DRIVE <ChevronRight size={16} /></span>
            </div>
        </motion.div>
    );
}

function BatchCard({ batch, onClick, delay }: any) {
    return (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay }} onClick={onClick} className="glass-panel" 
            style={{ padding: '2.5rem', borderRadius: '32px', cursor: 'pointer', border: '1px solid rgba(255,255,255,0.05)' }}
            whileHover={{ y: -5 }}
        >
            <Layers size={32} color="var(--secondary)" style={{ marginBottom: '1.5rem' }} />
            <h3 style={{ fontSize: '1.4rem', fontWeight: 900, marginBottom: '0.5rem' }}>{batch.name || batch.batchName}</h3>
            <div style={{ display: 'flex', gap: '15px', color: 'var(--text-dim)', fontSize: '0.8rem', fontWeight: 700, marginBottom: '1.5rem' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><Clock size={14} /> {batch.startTime || '10:00 AM'}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><Calendar size={14} /> DRIVE SYNCED</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Users size={18} color="var(--secondary)" />
                    <span style={{ fontSize: '0.85rem', fontWeight: 900 }}>{batch.totalStudents || 0} People</span>
                </div>
                <ChevronRight size={20} color="var(--primary)" />
            </div>
        </motion.div>
    );
}

function SharedMember({ name, role }: any) {
    return (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
             <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 800 }}>{name.charAt(0)}</div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>{name}</div>
             </div>
             <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontWeight: 800 }}>{role}</span>
        </div>
    );
}

function ActivityItem({ text, time }: any) {
    return (
        <div style={{ display: 'flex', gap: '12px' }}>
             <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--primary)', marginTop: '6px' }} />
             <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>{text}</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>{time}</div>
             </div>
        </div>
    );
}

function XCircle({ size }: { size: number }) {
    return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>;
}

const inputStyle = {
    padding: '14px 18px',
    borderRadius: '16px',
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.1)',
    color: '#fff',
    outline: 'none',
    width: '100%',
    fontFamily: 'inherit'
};
