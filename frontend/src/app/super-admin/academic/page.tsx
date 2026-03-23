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
    Settings, HardDrive, Filter, XCircle,
    ShieldCheck, UserPlus, Send
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
    const [selectedFolder, setSelectedFolder] = useState<any>(null);

    // Modals
    const [isCreateFolderOpen, setIsCreateFolderOpen] = useState(false);
    const [isShareModalOpen, setIsShareModalOpen] = useState(false);
    const [newFolderName, setNewFolderName] = useState('');
    const [sharingTarget, setSharingTarget] = useState<any>(null);
    const [userSearchTerm, setUserSearchTerm] = useState('');
    const [isTutorModalOpen, setIsTutorModalOpen] = useState(false);
    const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
    const [tutorSearchTerm, setTutorSearchTerm] = useState('');
    const [studentSearchTerm, setStudentSearchTerm] = useState('');
    const [renameTarget, setRenameTarget] = useState<{ type: 'folder' | 'file', oldName: string, folderName?: string } | null>(null);
    const [renameValue, setRenameValue] = useState('');
    const [viewFileTarget, setViewFileTarget] = useState<any>(null);

    const [searchTerm, setSearchTerm] = useState('');

    const fetchData = async () => {
        setLoading(true);
        try {
            const safeFetch = async (url: string) => {
                try {
                    const res = await fetch(url);
                    if (res.ok) return await res.json();
                } catch(e) {}
                return null;
            };

            const [cData, bData, uData] = await Promise.all([
                safeFetch('http://localhost:8080/api/courses'),
                safeFetch('http://localhost:8080/api/academic/batches'),
                safeFetch('http://localhost:8080/api/users')
            ]);

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
            createdBy: "Super Admin", 
            sharedWith: [], 
            files: []
        };
        
        updatedBatch.folders = [...(updatedBatch.folders || []), newFolder];

        try {
            const res = await fetch(`http://localhost:8080/api/academic/batches/${selectedBatch.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedBatch)
            });
            if (res.ok) {
                const savedBatch = await res.json();
                setSelectedBatch(savedBatch);
                setBatches(batches.map(b => b.id === savedBatch.id ? savedBatch : b));
                setIsCreateFolderOpen(false);
                setNewFolderName('');
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleUpdateSharing = async (user: any, role: string) => {
        if (!sharingTarget) return;

        const updatedFolders = selectedBatch.folders.map((f: any) => {
             if (f.name === sharingTarget.name) {
                  const alreadyShared = f.sharedWith?.find((s: any) => s.userId === user.id);
                  if (alreadyShared) {
                       return { ...f, sharedWith: f.sharedWith.map((s: any) => s.userId === user.id ? { ...s, role } : s) };
                  } else {
                       return { ...f, sharedWith: [...(f.sharedWith || []), { userId: user.id, fullName: user.fullName, role }] };
                  }
             }
             return f;
        });

        const updatedBatch = { ...selectedBatch, folders: updatedFolders };
        
        try {
            const res = await fetch(`http://localhost:8080/api/academic/batches/${selectedBatch.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedBatch)
            });
            if (res.ok) {
                const savedBatch = await res.json();
                setSelectedBatch(savedBatch);
                setBatches(batches.map(b => b.id === savedBatch.id ? savedBatch : b));
                // Update local sharing target if open
                if (sharingTarget) {
                    const freshFolder = savedBatch.folders.find((f: any) => f.name === sharingTarget.name);
                    setSharingTarget(freshFolder);
                }
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleAssignTutor = async (trainerId: string | null) => {
        const updatedBatch = { ...selectedBatch, trainerId };
        try {
            const res = await fetch(`http://localhost:8080/api/academic/batches/${selectedBatch.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedBatch)
            });
            if (res.ok) {
                const savedBatch = await res.json();
                setSelectedBatch(savedBatch);
                setBatches(batches.map(b => b.id === savedBatch.id ? savedBatch : b));
            }
        } catch(err) { console.error(err); }
    };

    const handleFileUpload = async (event: any) => {
        const file = event.target.files[0];
        if (!file) return;

        let targetFolder = selectedFolder;
        let updatedBatch = { ...selectedBatch };

        if (!targetFolder) {
            targetFolder = updatedBatch.folders?.find((f: any) => f.name === 'General Files');
            if (!targetFolder) {
                targetFolder = { name: 'General Files', files: [], sharedWith: [] };
                updatedBatch.folders = [...(updatedBatch.folders || []), targetFolder];
            }
        }

        const newFileObj = {
            name: file.name,
            size: (file.size / 1024 / 1024).toFixed(2) + ' MB',
            type: file.name.split('.').pop()?.toLowerCase() || 'unknown',
            uploadDate: new Date().toISOString()
        };

        updatedBatch.folders = updatedBatch.folders.map((f: any) => {
            if (f.name === targetFolder.name) {
                return { ...f, files: [...(f.files || []), newFileObj] };
            }
            return f;
        });

        try {
            const res = await fetch(`http://localhost:8080/api/academic/batches/${selectedBatch.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedBatch)
            });
            if (res.ok) {
                const savedBatch = await res.json();
                setSelectedBatch(savedBatch);
                setBatches(batches.map(b => b.id === savedBatch.id ? savedBatch : b));
                if (selectedFolder) {
                    const freshFolder = savedBatch.folders.find((f: any) => f.name === selectedFolder.name);
                    setSelectedFolder(freshFolder);
                }
            }
        } catch (err) {
            console.error(err);
        }
    };

    const updateBatchInDb = async (updatedBatch: any, newSelectedFolderName?: string | null) => {
        try {
            const res = await fetch(`http://localhost:8080/api/academic/batches/${selectedBatch.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedBatch)
            });
            if (res.ok) {
                const savedBatch = await res.json();
                setSelectedBatch(savedBatch);
                setBatches(batches.map((b: any) => b.id === savedBatch.id ? savedBatch : b));
                
                if (newSelectedFolderName) {
                    const freshFolder = savedBatch.folders?.find((f: any) => f.name === newSelectedFolderName);
                    setSelectedFolder(freshFolder);
                } else if (newSelectedFolderName === null && selectedFolder) {
                   setSelectedFolder(null);
                } else if (selectedFolder) {
                   const freshFolder = savedBatch.folders?.find((f: any) => f.name === selectedFolder.name);
                   setSelectedFolder(freshFolder);
                }
            }
        } catch (err) { console.error(err); }
    };

    const handleDeleteFolder = async (folderName: string, e: any) => {
        e.stopPropagation();
        if (!window.confirm(`Are you sure you want to delete folder "${folderName}" and all its contents?`)) return;
        const updatedBatch = { ...selectedBatch };
        updatedBatch.folders = updatedBatch.folders.filter((f: any) => f.name !== folderName);
        await updateBatchInDb(updatedBatch, null);
    };

    const handleRenameSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!renameTarget || !renameValue.trim()) return;

        const updatedBatch = { ...selectedBatch };
        
        if (renameTarget.type === 'folder') {
            updatedBatch.folders = updatedBatch.folders.map((f: any) => {
                if (f.name === renameTarget.oldName) return { ...f, name: renameValue.trim() };
                return f;
            });
        } else if (renameTarget.type === 'file') {
            updatedBatch.folders = updatedBatch.folders.map((f: any) => {
                if (f.name === renameTarget.folderName) {
                    return {
                        ...f,
                        files: f.files.map((file: any) => file.name === renameTarget.oldName ? { ...file, name: renameValue.trim() } : file)
                    };
                }
                return f;
            });
        }

        await updateBatchInDb(updatedBatch, renameTarget.type === 'folder' && selectedFolder?.name === renameTarget.oldName ? renameValue.trim() : selectedFolder?.name);
        setRenameTarget(null);
        setRenameValue('');
    };

    const handleDeleteFile = async (fileName: string) => {
        if (!window.confirm(`Are you sure you want to delete file "${fileName}"?`)) return;
        const updatedBatch = { ...selectedBatch };
        updatedBatch.folders = updatedBatch.folders.map((f: any) => {
            if (f.name === selectedFolder.name) {
                return { ...f, files: f.files.filter((file: any) => file.name !== fileName) };
            }
            return f;
        });
        await updateBatchInDb(updatedBatch, selectedFolder.name);
    };

    const handleToggleStudent = async (studentId: string) => {
        let currentStudentIds = selectedBatch.studentIds || [];
        if (currentStudentIds.includes(studentId)) {
            currentStudentIds = currentStudentIds.filter((id: string) => id !== studentId);
        } else {
            currentStudentIds = [...currentStudentIds, studentId];
        }
        
        const updatedBatch = { ...selectedBatch, studentIds: currentStudentIds, totalStudents: currentStudentIds.length };
        try {
            const res = await fetch(`http://localhost:8080/api/academic/batches/${selectedBatch.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedBatch)
            });
            if (res.ok) {
                const savedBatch = await res.json();
                setSelectedBatch(savedBatch);
                setBatches(batches.map(b => b.id === savedBatch.id ? savedBatch : b));
            }
        } catch(err) { console.error(err); }
    };

    const handleCourseClick = (course: any) => {
        setSelectedCourse(course);
        setViewMode('BATCHES');
    };

    const handleBatchClick = (batch: any) => {
        setSelectedBatch(batch);
        setViewMode('DETAILS');
        setSelectedFolder(null);
    };

    const goBack = () => {
        if (selectedFolder) setSelectedFolder(null);
        else if (viewMode === 'DETAILS') setViewMode('BATCHES');
        else if (viewMode === 'BATCHES') setViewMode('COURSES');
    };

    const filteredBatches = batches.filter(b => b.courseId === selectedCourse?.id);
    const tutor = allUsers.find(u => u.id === selectedBatch?.trainerId);
    const students = allUsers.filter(u => u.role === 'STUDENT' && (selectedBatch?.studentIds?.includes(u.id) || selectedBatch?.studentIds?.includes(u.email)));

    const usersToShareWith = allUsers.filter(u => 
        (u.fullName || '').toLowerCase().includes(userSearchTerm.toLowerCase()) || 
        (u.email || '').toLowerCase().includes(userSearchTerm.toLowerCase())
    ).slice(0, 5);

    return (
        <DashboardLayout role="super_admin">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ paddingBottom: '5rem' }}>
                
                {/* --- NAVIGATION BREADCRUMBS --- */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '2rem', fontSize: '0.9rem', fontWeight: 600 }}>
                    <span onClick={() => setViewMode('COURSES')} style={{ cursor: 'pointer', color: viewMode === 'COURSES' ? 'var(--primary)' : 'var(--text-dim)' }}>Academic Hub</span>
                    {viewMode !== 'COURSES' && (
                        <>
                            <ChevronRight size={14} color="var(--text-dim)" />
                            <span onClick={() => setViewMode('BATCHES')} style={{ cursor: 'pointer', color: viewMode === 'BATCHES' ? 'var(--primary)' : 'var(--text-dim)' }}>{selectedCourse?.title}</span>
                        </>
                    )}
                    {viewMode === 'DETAILS' && (
                        <>
                            <ChevronRight size={14} color="var(--text-dim)" />
                            <span onClick={() => setSelectedFolder(null)} style={{ cursor: 'pointer', color: !selectedFolder ? 'var(--primary)' : 'var(--text-dim)' }}>{selectedBatch?.name || selectedBatch?.batchName}</span>
                        </>
                    )}
                    {selectedFolder && (
                        <>
                            <ChevronRight size={14} color="var(--text-dim)" />
                            <span style={{ color: 'var(--primary)', fontWeight: 800 }}>📂 {selectedFolder.name}</span>
                        </>
                    )}
                </div>

                {/* --- HEADER --- */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem' }}>
                    <div>
                        <h1 style={{ fontSize: '2.8rem', fontWeight: 900, letterSpacing: '-1.5px' }}>
                            {selectedFolder ? selectedFolder.name : viewMode === 'COURSES' ? 'Academic Drive' : viewMode === 'BATCHES' ? 'Select Cohort' : 'Shared Workspace'}
                        </h1>
                        <div style={{ color: 'var(--text-dim)', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '20px' }}>
                            {selectedFolder ? `Exploring learning resources inside the folder.` : viewMode === 'COURSES' ? 'Cloud-powered educational resource hub.' : viewMode === 'BATCHES' ? `Managing batches for ${selectedCourse?.title}.` : `Manage folders and sharing for ${selectedBatch?.name || selectedBatch?.batchName}.`}
                            
                            {viewMode === 'COURSES' && !selectedFolder && (
                                <div style={{ display: 'flex', gap: '20px', marginLeft: '10px', borderLeft: '1px solid rgba(255,255,255,0.1)', paddingLeft: '20px' }}>
                                    <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--primary)' }}>{allUsers.filter(u => u.role === 'STUDENT').length} <span style={{ color: 'var(--text-dim)', opacity: 0.6 }}>STUDENTS</span></span>
                                    <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--secondary)' }}>{allUsers.filter(u => u.role === 'TRAINER').length} <span style={{ color: 'var(--text-dim)', opacity: 0.6 }}>TRAINERS</span></span>
                                    <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#fff' }}>{courses.length} <span style={{ color: 'var(--text-dim)', opacity: 0.6 }}>COURSES</span></span>
                                </div>
                            ) }
                        </div>
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
                        <>
                            {courses.length === 0 ? (
                                <div style={{ textAlign: 'center', padding: '5rem', background: 'rgba(255,255,255,0.02)', borderRadius: '32px', border: '1px dashed rgba(255,255,255,0.1)' }}>
                                    <Book size={48} color="var(--text-dim)" style={{ marginBottom: '1rem', opacity: 0.2 }} />
                                    <p style={{ color: 'var(--text-dim)', fontSize: '1.2rem', fontWeight: 800 }}>No courses available.</p>
                                    <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem', opacity: 0.7 }}>Please ensure your Course Service is running, or create courses to begin.</p>
                                </div>
                            ) : (
                                <motion.div key="courses" initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem' }}>
                                    {courses.map((c, i) => (
                                        <CourseCard key={c.id || i} course={c} onClick={() => handleCourseClick(c)} delay={i * 0.05} />
                                    ))}
                                </motion.div>
                            )}
                        </>
                    )}

                    {/* --- BATCHES GRID --- */}
                    {viewMode === 'BATCHES' && (
                        <>
                            {filteredBatches.length === 0 ? (
                                <div style={{ textAlign: 'center', padding: '5rem', background: 'rgba(255,255,255,0.02)', borderRadius: '32px', border: '1px dashed rgba(255,255,255,0.1)' }}>
                                    <Layers size={48} color="var(--text-dim)" style={{ marginBottom: '1rem', opacity: 0.2 }} />
                                    <p style={{ color: 'var(--text-dim)', fontSize: '1.2rem', fontWeight: 800 }}>No batches found for this course.</p>
                                </div>
                            ) : (
                                <motion.div key="batches" initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem' }}>
                                    {filteredBatches.map((b, i) => (
                                        <BatchCard key={b.id || i} batch={b} onClick={() => handleBatchClick(b)} delay={i * 0.05} />
                                    ))}
                                </motion.div>
                            )}
                        </>
                    )}

                    {/* --- DRIVE WORKSPACE --- */}
                    {viewMode === 'DETAILS' && (
                        <motion.div key="details" initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '2.5rem' }}>
                            
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
                                {/* --- DRIVE CONTENT --- */}
                                <div className="glass-panel" style={{ padding: '2.5rem', borderRadius: '40px', minHeight: '600px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                                         <h3 style={{ fontSize: '1.4rem', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '12px' }}>
                                             {selectedFolder ? <Folder color="var(--primary)" /> : <HardDrive color="var(--primary)" />} 
                                             {selectedFolder ? selectedFolder.name : "My Drive"}
                                         </h3>
                                         <div style={{ display: 'flex', gap: '10px' }}>
                                              {!selectedFolder && (
                                                  <button onClick={() => setIsCreateFolderOpen(true)} className="btn-quantum" style={{ padding: '10px 20px', fontSize: '0.85rem' }}>
                                                       <Plus size={16} /> NEW FOLDER
                                                  </button>
                                              )}
                                              <input type="file" id="file-upload" style={{ display: 'none' }} onChange={handleFileUpload} />
                                              <button onClick={() => document.getElementById('file-upload')?.click()} className="btn-quantum" style={{ padding: '10px 20px', fontSize: '0.85rem', background: 'var(--secondary)' }}>
                                                   <Upload size={16} /> UPLOAD FILE
                                              </button>
                                          </div>
                                     </div>

                                    {!selectedFolder ? (
                                         <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '2rem' }}>
                                              {selectedBatch?.folders?.map((folder: any, fIdx: number) => (
                                                  <DriveFolder 
                                                     key={fIdx} 
                                                     folder={folder} 
                                                     onClick={() => setSelectedFolder(folder)} 
                                                     onShare={(e: any) => { e.stopPropagation(); setSharingTarget(folder); setIsShareModalOpen(true); }} 
                                                     onRename={(e: any) => { e.stopPropagation(); setRenameTarget({ type: 'folder', oldName: folder.name }); setRenameValue(folder.name); }}
                                                     onDelete={(e: any) => handleDeleteFolder(folder.name, e)}
                                                  />
                                              ))}
                                              {(!selectedBatch?.folders || selectedBatch.folders.length === 0) && (
                                                   <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '5rem', background: 'rgba(255,255,255,0.01)', borderRadius: '32px' }}>
                                                       <Folder size={48} color="var(--text-dim)" style={{ marginBottom: '1rem', opacity: 0.1 }} />
                                                       <p style={{ color: 'var(--text-dim)', fontWeight: 800 }}>This batch has no resources yet.</p>
                                                   </div>
                                              )}
                                         </div>
                                    ) : (
                                         <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                              {selectedFolder.files?.length > 0 ? selectedFolder.files.map((file: any, fIdx: number) => (
                                                  <FileItem 
                                                     key={fIdx} 
                                                     name={file.name} 
                                                     type={file.type} 
                                                     size={file.size} 
                                                     date={new Date(file.uploadDate).toLocaleDateString()} 
                                                     onRename={() => { setRenameTarget({ type: 'file', oldName: file.name, folderName: selectedFolder.name }); setRenameValue(file.name); }}
                                                     onDelete={() => handleDeleteFile(file.name)}
                                                     onView={() => setViewFileTarget(file)}
                                                  />
                                              )) : (
                                                  <div style={{ textAlign: 'center', padding: '5rem', background: 'rgba(255,255,255,0.01)', borderRadius: '32px' }}>
                                                      <File size={40} color="var(--text-dim)" style={{ marginBottom: '1rem', opacity: 0.2 }} />
                                                      <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem' }}>No files found in this folder.</p>
                                                      <button onClick={() => document.getElementById('file-upload')?.click()} className="btn-quantum" style={{ marginTop: '1.5rem', padding: '10px 20px', fontSize: '0.8rem' }}><Upload size={16} /> UPLOAD FIRST FILE</button>
                                                  </div>
                                              )}
                                         </div>
                                    )}
                                </div>
                            </div>

                            {/* --- RIGHT INFO PANEL --- */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
                                 <div className="glass-panel" style={{ padding: '2rem', borderRadius: '32px' }}>
                                      <h4 style={{ fontSize: '1rem', fontWeight: 900, color: 'var(--primary)', marginBottom: '1.5rem', textTransform: 'uppercase' }}>Batch Context</h4>
                                      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                           <InfoSnippet icon={<User size={18} />} label="Assigned Tutor" value={tutor?.fullName || tutor?.email || 'Pending'} />
                                           <InfoSnippet icon={<Users size={18} />} label="Student Access" value={`${students.length} Active`} />
                                           <InfoSnippet icon={<Calendar size={18} />} label="Drive Created" value={selectedBatch?.createdAt ? new Date(selectedBatch.createdAt).toLocaleDateString() : 'Just Now'} />
                                       </div>
                                       <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                           <button onClick={() => setIsTutorModalOpen(true)} className="btn-quantum" style={{ padding: '10px', fontSize: '0.8rem', width: '100%' }}>ASSIGN TUTOR</button>
                                           <button onClick={() => setIsStudentModalOpen(true)} className="btn-quantum" style={{ padding: '10px', fontSize: '0.8rem', background: 'var(--secondary)', width: '100%' }}>MANAGE BATCH STUDENTS</button>
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
                     <div style={{ position: 'fixed', inset: 0, zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)' }}>
                          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="glass-panel" style={{ width: '90%', maxWidth: '400px', padding: '3rem', borderRadius: '40px' }}>
                               <h2 style={{ fontSize: '1.8rem', fontWeight: 900, marginBottom: '2rem' }}>New Folder</h2>
                               <form onSubmit={handleCreateFolder}>
                                    <input value={newFolderName} onChange={(e) => setNewFolderName(e.target.value)} autoFocus placeholder="Folder Name" style={inputStyle} />
                                    <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                                         <button type="button" onClick={() => setIsCreateFolderOpen(false)} style={{ flex: 1, padding: '12px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', color: '#fff', border: 'none', cursor: 'pointer' }}>CANCEL</button>
                                         <button type="submit" className="btn-quantum" style={{ flex: 2, padding: '12px', borderRadius: '12px' }}>CREATE</button>
                                    </div>
                               </form>
                          </motion.div>
                     </div>
                 )}
            </AnimatePresence>

            {/* --- SHARE ACCESS MODAL (Fully Functional) --- */}
            <AnimatePresence>
                 {isShareModalOpen && sharingTarget && (
                     <div style={{ position: 'fixed', inset: 0, zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(15px)' }}>
                          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="glass-panel" style={{ width: '95%', maxWidth: '550px', padding: 0, borderRadius: '40px', overflow: 'hidden' }}>
                               <div style={{ background: 'var(--primary)', padding: '2.5rem', color: '#000' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                         <h2 style={{ fontSize: '1.8rem', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '12px' }}><Share2 size={24} /> Share Access</h2>
                                         <button onClick={() => setIsShareModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><XCircle size={28} /></button>
                                    </div>
                                    <div style={{ background: 'rgba(0,0,0,0.1)', padding: '1rem', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                                         <Search size={18} />
                                         <input 
                                            value={userSearchTerm}
                                            onChange={(e) => setUserSearchTerm(e.target.value)}
                                            placeholder="Search students, staff or tutors..." 
                                            style={{ background: 'none', border: 'none', width: '100%', outline: 'none', fontWeight: 700, fontSize: '0.95rem', color: '#000' }} 
                                         />
                                    </div>
                               </div>

                               <div style={{ padding: '2.5rem' }}>
                                    {/* --- SEARCH RESULTS --- */}
                                    {userSearchTerm && (
                                         <div style={{ marginBottom: '2rem' }}>
                                              <h4 style={{ fontSize: '0.75rem', fontWeight: 900, color: 'var(--text-dim)', marginBottom: '1rem', textTransform: 'uppercase' }}>Search Results</h4>
                                              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                                   {usersToShareWith.map((u: any, idx: number) => (
                                                        <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: '16px' }}>
                                                             <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                                                  <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: 'var(--primary)', color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 900 }}>{u.fullName?.charAt(0)}</div>
                                                                  <div>
                                                                       <div style={{ fontSize: '0.9rem', fontWeight: 800 }}>{u.fullName}</div>
                                                                       <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>{u.role.replace('_', ' ')}</div>
                                                                  </div>
                                                             </div>
                                                             <button onClick={() => handleUpdateSharing(u, 'EDITOR')} style={{ background: 'var(--primary)', color: '#000', padding: '6px 15px', borderRadius: '10px', fontSize: '0.75rem', fontWeight: 900, cursor: 'pointer', border: 'none' }}>GIVE ACCESS</button>
                                                        </div>
                                                   ))}
                                              </div>
                                         </div>
                                    )}

                                    {/* --- CURRENT ACCESS LIST --- */}
                                    <h4 style={{ fontSize: '0.75rem', fontWeight: 900, color: 'var(--text-dim)', marginBottom: '1.5rem', textTransform: 'uppercase' }}>People with access</h4>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxHeight: '300px', overflowY: 'auto' }}>
                                         <SharedMemberItem name="Super Admin (You)" role="OWNER" />
                                         {sharingTarget.sharedWith?.map((access: any, idx: number) => (
                                              <SharedMemberItem 
                                                 key={idx} 
                                                 name={access.fullName} 
                                                 role={access.role} 
                                                 onRoleChange={(r: string) => handleUpdateSharing({ id: access.userId, fullName: access.fullName }, r)} 
                                              />
                                         ))}
                                    </div>
                               </div>

                               <div style={{ padding: '2rem 2.5rem', background: 'rgba(255,255,255,0.02)', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'flex-end' }}>
                                    <button onClick={() => setIsShareModalOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text-dim)', fontWeight: 800, cursor: 'pointer' }}>CLOSE</button>
                               </div>
                          </motion.div>
                     </div>
                 )}
            </AnimatePresence>

            {/* --- ASSIGN TUTOR MODAL --- */}
            <AnimatePresence>
                 {isTutorModalOpen && (
                     <div style={{ position: 'fixed', inset: 0, zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(15px)' }}>
                          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="glass-panel" style={{ width: '90%', maxWidth: '450px', padding: 0, borderRadius: '40px', overflow: 'hidden' }}>
                               <div style={{ background: 'var(--primary)', padding: '2rem', color: '#000' }}>
                                   <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                       <h2 style={{ fontSize: '1.5rem', fontWeight: 900 }}>Assign Tutor</h2>
                                       <button onClick={() => setIsTutorModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#000' }}><XCircle size={24} /></button>
                                   </div>
                                    <div style={{ background: 'rgba(0,0,0,0.1)', padding: '1rem', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                                         <Search size={18} />
                                         <input 
                                            value={tutorSearchTerm}
                                            onChange={(e) => setTutorSearchTerm(e.target.value)}
                                            placeholder="Search name, email, number..." 
                                            style={{ background: 'none', border: 'none', width: '100%', outline: 'none', fontWeight: 700, fontSize: '0.95rem', color: '#000' }} 
                                         />
                                    </div>
                               </div>
                               <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '350px', overflowY: 'auto' }}>
                                   {allUsers.filter(u => u.role === 'TRAINER' && (
                                       (u.fullName || '').toLowerCase().includes(tutorSearchTerm.toLowerCase()) ||
                                       (u.email || '').toLowerCase().includes(tutorSearchTerm.toLowerCase()) ||
                                       (u.phone || '').toLowerCase().includes(tutorSearchTerm.toLowerCase())
                                   )).map((trainer: any, idx: number) => {
                                       const isAssigned = selectedBatch?.trainerId === trainer.id;
                                       return (
                                       <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: '16px', border: isAssigned ? '1px solid var(--primary)' : '1px solid transparent' }}>
                                           <div>
                                               <div style={{ fontWeight: 800 }}>{trainer.fullName || trainer.email.split('@')[0]}</div>
                                               <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>{trainer.email} • {trainer.phone || 'No phone'}</div>
                                           </div>
                                           <button onClick={() => handleAssignTutor(isAssigned ? null : trainer.id)} style={{ background: isAssigned ? 'rgba(239, 68, 68, 0.1)' : 'var(--primary)', color: isAssigned ? '#ef4444' : '#000', border: isAssigned ? '1px solid #ef4444' : 'none', padding: '6px 15px', borderRadius: '10px', fontSize: '0.7rem', fontWeight: 900, cursor: 'pointer' }}>
                                               {isAssigned ? 'UNASSIGN' : 'ASSIGN'}
                                           </button>
                                       </div>
                                   )})}
                               </div>
                               <div style={{ padding: '1.5rem 2rem', background: 'rgba(255,255,255,0.02)', borderTop: '1px solid rgba(255,255,255,0.05)', textAlign: 'right' }}>
                                    <button onClick={() => setIsTutorModalOpen(false)} className="btn-quantum" style={{ padding: '10px 20px' }}>DONE</button>
                               </div>
                          </motion.div>
                     </div>
                 )}
            </AnimatePresence>

            {/* --- MANAGE STUDENTS MODAL --- */}
            <AnimatePresence>
                 {isStudentModalOpen && (
                     <div style={{ position: 'fixed', inset: 0, zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(15px)' }}>
                          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="glass-panel" style={{ width: '95%', maxWidth: '550px', padding: 0, borderRadius: '40px', overflow: 'hidden' }}>
                               <div style={{ background: 'var(--secondary)', padding: '2.5rem', color: '#000' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                         <h2 style={{ fontSize: '1.8rem', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '12px' }}><Users size={24} /> Edit Batch Students</h2>
                                         <button onClick={() => setIsStudentModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#000' }}><XCircle size={28} /></button>
                                    </div>
                                    <div style={{ background: 'rgba(0,0,0,0.1)', padding: '1rem', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                                         <Search size={18} />
                                         <input 
                                            value={studentSearchTerm}
                                            onChange={(e) => setStudentSearchTerm(e.target.value)}
                                            placeholder="Search name, email, number..." 
                                            style={{ background: 'none', border: 'none', width: '100%', outline: 'none', fontWeight: 700, fontSize: '0.95rem', color: '#000' }} 
                                         />
                                    </div>
                               </div>

                               <div style={{ padding: '2rem 2.5rem', display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '400px', overflowY: 'auto' }}>
                                   {allUsers.filter(u => u.role === 'STUDENT' && (
                                       (u.fullName || '').toLowerCase().includes(studentSearchTerm.toLowerCase()) ||
                                       (u.email || '').toLowerCase().includes(studentSearchTerm.toLowerCase()) ||
                                       (u.phone || '').toLowerCase().includes(studentSearchTerm.toLowerCase())
                                   )).map((student: any, idx: number) => {
                                       const hasAccess = selectedBatch?.studentIds?.includes(student.id);
                                       return (
                                           <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: '16px', border: hasAccess ? '1px solid var(--secondary)' : '1px solid transparent' }}>
                                               <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                                    <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: 'var(--secondary)', color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 900 }}>{student.email?.charAt(0).toUpperCase()}</div>
                                                    <div>
                                                         <div style={{ fontSize: '0.9rem', fontWeight: 800 }}>{student.fullName || student.email.split('@')[0]}</div>
                                                         <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>{student.email} • {student.phone || 'No phone'}</div>
                                                    </div>
                                               </div>
                                               <button onClick={() => handleToggleStudent(student.id)} style={{ background: hasAccess ? 'rgba(239, 68, 68, 0.1)' : 'var(--secondary)', color: hasAccess ? '#ef4444' : '#000', border: hasAccess ? '1px solid #ef4444' : 'none', padding: '6px 15px', borderRadius: '10px', fontSize: '0.75rem', fontWeight: 900, cursor: 'pointer' }}>
                                                   {hasAccess ? 'UNASSIGN' : 'ASSIGN'}
                                               </button>
                                           </div>
                                       )
                                   })}
                               </div>
                               <div style={{ padding: '1.5rem 2.5rem', background: 'rgba(255,255,255,0.02)', borderTop: '1px solid rgba(255,255,255,0.05)', textAlign: 'right' }}>
                                    <button onClick={() => setIsStudentModalOpen(false)} className="btn-quantum" style={{ padding: '10px 20px' }}>DONE</button>
                               </div>
                          </motion.div>
                     </div>
                 )}
            </AnimatePresence>

            {/* --- RENAME MODAL --- */}
            <AnimatePresence>
                 {renameTarget && (
                     <div style={{ position: 'fixed', inset: 0, zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)' }}>
                          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="glass-panel" style={{ width: '90%', maxWidth: '400px', padding: '3rem', borderRadius: '40px' }}>
                               <h2 style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: '2rem' }}>Rename {renameTarget.type === 'folder' ? 'Folder' : 'File'}</h2>
                               <form onSubmit={handleRenameSubmit}>
                                    <input value={renameValue} onChange={(e) => setRenameValue(e.target.value)} autoFocus placeholder="New Name" style={inputStyle} />
                                    <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                                         <button type="button" onClick={() => setRenameTarget(null)} style={{ flex: 1, padding: '12px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', color: '#fff', border: 'none', cursor: 'pointer' }}>CANCEL</button>
                                         <button type="submit" className="btn-quantum" style={{ flex: 2, padding: '12px', borderRadius: '12px' }}>SAVE</button>
                                    </div>
                               </form>
                          </motion.div>
                     </div>
                 )}
            </AnimatePresence>

            {/* --- VIEW FILE MODAL --- */}
            <AnimatePresence>
                 {viewFileTarget && (
                     <div style={{ position: 'fixed', inset: 0, zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.95)', backdropFilter: 'blur(15px)' }}>
                          <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} style={{ width: '95%', maxWidth: '1000px', height: '80vh', display: 'flex', flexDirection: 'column' }}>
                               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem', background: 'rgba(255,255,255,0.05)', borderRadius: '24px 24px 0 0' }}>
                                   <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                       {viewFileTarget.type === 'pdf' || viewFileTarget.type === 'doc' || viewFileTarget.type === 'txt' ? <FileText color="var(--primary)" /> : <Play color="var(--primary)" />}
                                       <h2 style={{ fontSize: '1.2rem', fontWeight: 900 }}>{viewFileTarget.name}</h2>
                                   </div>
                                   <button onClick={() => setViewFileTarget(null)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}><XCircle size={28} /></button>
                               </div>
                               <div style={{ flex: 1, background: '#000', borderRadius: '0 0 24px 24px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
                                    {['mp4', 'mkv', 'webm', 'mov'].includes(viewFileTarget.type) ? (
                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
                                            <Play size={80} color="var(--primary)" style={{ opacity: 0.5 }} />
                                            <p style={{ color: 'var(--text-dim)', fontWeight: 800 }}>Video Preview Player</p>
                                        </div>
                                    ) : (
                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
                                            <FileText size={80} color="var(--primary)" style={{ opacity: 0.5 }} />
                                            <p style={{ color: 'var(--text-dim)', fontWeight: 800 }}>Document Preview Viewer</p>
                                        </div>
                                    )}
                               </div>
                          </motion.div>
                     </div>
                 )}
            </AnimatePresence>

        </DashboardLayout>
    );
}

function DriveFolder({ folder, onClick, onShare, onRename, onDelete }: any) {
    return (
        <motion.div 
            whileHover={{ scale: 1.05, background: 'rgba(255,255,255,0.03)' }}
            onClick={onClick}
            style={{ padding: '1.5rem', borderRadius: '24px', background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.03)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px', textAlign: 'center', cursor: 'pointer', position: 'relative' }}
        >
            <div style={{ position: 'absolute', top: '15px', right: '15px', display: 'flex', gap: '5px' }}>
                <button onClick={onShare} title="Share" style={{ background: 'none', border: 'none', color: 'var(--text-dim)', opacity: 0.7, cursor: 'pointer' }}><Share2 size={16} /></button>
                <button onClick={onRename} title="Rename" style={{ background: 'none', border: 'none', color: 'var(--text-dim)', opacity: 0.7, cursor: 'pointer' }}><Edit2 size={16} /></button>
                <button onClick={onDelete} title="Delete" style={{ background: 'none', border: 'none', color: '#ef4444', opacity: 0.9, cursor: 'pointer' }}><Trash2 size={16} /></button>
            </div>
            <Folder size={64} fill="rgba(124, 58, 237, 0.2)" color="var(--primary)" />
            <div>
                 <div style={{ fontWeight: 800, fontSize: '0.9rem' }}>{folder.name}</div>
                 <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>{folder.files?.length || 0} Files</div>
            </div>
        </motion.div>
    );
}

function FileItem({ name, type, size, date, onRename, onDelete, onView }: any) {
    return (
        <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1.25rem', borderRadius: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid rgba(255,255,255,0.03)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                <div style={{ padding: '10px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', color: 'var(--primary)' }}>
                    {type === 'pdf' || type === 'doc' || type === 'txt' ? <FileText size={20} /> : <Play size={20} />}
                </div>
                <div>
                    <div style={{ fontSize: '0.95rem', fontWeight: 800 }}>{name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>{size} • {date}</div>
                </div>
            </div>
            <div style={{ display: 'flex', gap: '15px' }}>
                <button onClick={onView} title="View" style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer' }}><Eye size={18} /></button>
                <button onClick={onRename} title="Rename" style={{ background: 'none', border: 'none', color: '#f59e0b', cursor: 'pointer' }}><Edit2 size={18} /></button>
                <button onClick={onDelete} title="Delete" style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}><Trash2 size={18} /></button>
                <button title="Download" style={{ background: 'none', border: 'none', color: 'var(--text-dim)', cursor: 'pointer' }}><Download size={18} /></button>
            </div>
        </div>
    );
}

function SharedMemberItem({ name, role, onRoleChange }: any) {
    return (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
             <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 900 }}>{name.charAt(0)}</div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 800 }}>{name}</div>
             </div>
             {onRoleChange ? (
                  <select 
                    value={role} 
                    onChange={(e) => onRoleChange(e.target.value)}
                    style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 800, fontSize: '0.8rem', outline: 'none', cursor: 'pointer' }}
                  >
                       <option value="VIEWER">VIEWER</option>
                       <option value="EDITOR">EDITOR</option>
                       <option value="OWNER">OWNER</option>
                  </select>
             ) : (
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontWeight: 800, textTransform: 'uppercase' }}>{role}</span>
             )}
        </div>
    );
}

function InfoSnippet({ icon, label, value }: any) {
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(255,255,255,0.03)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{icon}</div>
            <div>
                 <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', fontWeight: 800, textTransform: 'uppercase' }}>{label}</div>
                 <div style={{ fontSize: '0.9rem', fontWeight: 900 }}>{value}</div>
            </div>
        </div>
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
                <span style={{ color: 'var(--primary)', fontWeight: 900, fontSize: '0.85rem', display: 'flex', alignItems: 'center' }}>VIEW GDRIVE <ChevronRight size={16} /></span>
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
                <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><Clock size={14} /> DRIVE SYNCED</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Users size={18} color="var(--secondary)" />
                    <span style={{ fontSize: '0.85rem', fontWeight: 800 }}>{batch.totalStudents || 0} Members</span>
                </div>
                <ChevronRight size={20} color="var(--primary)" />
            </div>
        </motion.div>
    );
}

const inputStyle = {
    padding: '14px 18px',
    borderRadius: '16px',
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.1)',
    color: '#fff',
    outline: 'none',
    width: '100%',
    fontFamily: 'inherit',
    fontSize: '1rem'
};
