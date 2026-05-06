"use client";
import { API_URLS } from '@/lib/api-config';


import DashboardLayout from '@/components/DashboardLayout';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { 
    Video, FileText, Users, Activity, 
    Calendar, Plus, Clock,
    BookOpen, Layers, User
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { fetchJsonSafe } from '@/lib/fetchJson';

export default function TutorDashboard() {
    const router = useRouter();
    const [metrics, setMetrics] = useState({
        totalSessions: 0,
        pendingAssignments: 0,
        totalStudents: 0,
        attendanceRate: 0
    });
    const [batches, setBatches] = useState<any[]>([]);
    const [assignments, setAssignments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [tutorProfile, setTutorProfile] = useState<any>(null);
    const [error, setError] = useState('');

    useEffect(() => {
        // Try to get stored user immediately
        const stored = localStorage.getItem('user');
        if (!stored) {
            console.log('No user in localStorage, redirecting to login');
            router.push('/login');
            return;
        }
        
        const user = JSON.parse(stored);
        console.log('Stored user on mount:', user);
        
        // Fetch data
        fetchTutorData();
        
        // ALSO: directly set profile from stored user if we have it (quick fallback)
        if (stored) {
            try {
                const user = JSON.parse(stored);
                // We can use the stored user data directly while we fetch the full profile
                setTutorProfile(user);
            } catch (e) {}
        }
        
        // Also listen for storage changes (in case login updated it)
        const handleStorage = (e: StorageEvent) => {
            if (e.key === 'user' && e.newValue) {
                const user = JSON.parse(e.newValue);
                console.log('Storage updated:', user);
                fetchTutorData();
            }
        };
        window.addEventListener('storage', handleStorage);
        return () => window.removeEventListener('storage', handleStorage);
    }, []);

    const fetchTutorData = async () => {
        setLoading(true);
        setError('');
        
        // Get current logged in user from localStorage
        const storedUser = localStorage.getItem('user');
        let userId = null;
        let userEmail = null;
        if (storedUser) {
            const parsed = JSON.parse(storedUser);
            userId = parsed.id || parsed._id;
            userEmail = parsed.email;
            console.log('Logged in user ID:', userId);
            console.log('Logged in user:', parsed);
        }

        // First, fetch the tutor's own profile if we have a user ID
        let profileFetched = false;
        if (userId) {
            const profileResult = await fetchJsonSafe<any>(`${API_URLS.LMS_BACKEND}/api/users/${userId}`);
            if (profileResult.ok && profileResult.data) {
                setTutorProfile(profileResult.data);
                console.log('Tutor profile by ID:', profileResult.data);
                profileFetched = true;
            }
        }
        
        // Fallback: if no ID or ID failed, try to find by email
        if (!profileFetched && userEmail) {
            const allUsers = await fetchJsonSafe<any[]>(`${API_URLS.LMS_BACKEND}/api/users`);
            if (allUsers.ok && Array.isArray(allUsers.data)) {
                const foundUser = allUsers.data.find((u: any) => u.email === userEmail);
                if (foundUser) {
                    setTutorProfile(foundUser);
                    console.log('Tutor profile by email:', foundUser);
                }
            }
        }
        
        const [batchesResult, assignmentsResult, usersResult] = await Promise.all([
            fetchJsonSafe<any[]>(`${API_URLS.LMS_BACKEND}/api/academic/batches`),
            fetchJsonSafe<any[]>(`${API_URLS.LMS_BACKEND}/api/academic/assignments`),
            fetchJsonSafe<any[]>(`${API_URLS.LMS_BACKEND}/api/users`)
        ]);

        const batchesData = batchesResult.ok && Array.isArray(batchesResult.data) ? batchesResult.data : [];
        const assignmentsData = assignmentsResult.ok && Array.isArray(assignmentsResult.data) ? assignmentsResult.data : [];
        const usersData = usersResult.ok && Array.isArray(usersResult.data) ? usersResult.data : [];

        // Filter students
        const students = usersData.filter((u: any) => u.role === 'STUDENT');
        
        // Calculate attendance from students
        const avgAttendance = students.length > 0 
            ? Math.round(students.reduce((acc: number, u: any) => acc + (u.attendanceRate || 92), 0) / students.length)
            : 92;

        // Get pending assignments
        const pendingAssignments = assignmentsData.filter((a: any) => a.status === 'PENDING' || a.status === 'SUBMITTED').length;

        setBatches(batchesData);
        setAssignments(assignmentsData);
        setMetrics({
            totalSessions: batchesData.length,
            pendingAssignments,
            totalStudents: students.length,
            attendanceRate: avgAttendance
        });
        setLoading(false);
    };

    const pendingGrading = assignments.filter((a: any) => a.status === 'SUBMITTED');
    const upcomingBatches = batches.filter((b: any) => b.status === 'UPCOMING');

    return (
        <DashboardLayout role="tutor">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                {error && (
                    <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid #ef4444', padding: '1rem', borderRadius: '12px', marginBottom: '1.5rem', color: '#ef4444' }}>
                        Error: {error}
                </div>
                )}

                {/* Show loading or profile status */}
                {!tutorProfile && !loading && (
                    <div style={{ background: 'rgba(245, 158, 11, 0.1)', border: '1px solid #f59e0b', padding: '1rem', borderRadius: '12px', marginBottom: '1rem', color: '#f59e0b' }}>
                        ⚠️ Profile not loading. Check console for errors. 
                        <button onClick={() => { console.clear(); fetchTutorData(); }} style={{ marginLeft: '1rem', padding: '4px 12px', background: '#f59e0b', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
                            Retry
                        </button>
                    </div>
                )}

                {/* --- TUTOR PROFILE CARD --- */}
                {tutorProfile && (
                    <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: '20px', marginBottom: '2rem', borderLeft: '4px solid var(--primary)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                            <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                                {tutorProfile.profileImage ? (
                                    <img src={tutorProfile.profileImage} alt={tutorProfile.fullName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                ) : (
                                    <User size={30} color="#000" />
                                )}
                            </div>
                            <div style={{ flex: 1 }}>
                                <h2 style={{ fontSize: '1.5rem', fontWeight: 900 }}>{tutorProfile.fullName || tutorProfile.name || 'Tutor'}</h2>
                                <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem' }}>{tutorProfile.email}</p>
                                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
                                    <span style={{ background: 'rgba(139, 92, 246, 0.2)', color: '#8b5cf6', padding: '4px 12px', borderRadius: '100px', fontSize: '0.7rem', fontWeight: 900 }}>
                                        {tutorProfile.role || 'TUTOR'}
                                    </span>
                                    <span style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#10b981', padding: '4px 12px', borderRadius: '100px', fontSize: '0.7rem', fontWeight: 900 }}>
                                        {tutorProfile.department || 'FACULTY'}
                                    </span>
                                    <span style={{ background: 'rgba(59, 130, 246, 0.2)', color: '#3b82f6', padding: '4px 12px', borderRadius: '100px', fontSize: '0.7rem', fontWeight: 900 }}>
                                        {tutorProfile.branch || 'General'}
                                    </span>
                                    <span style={{ background: tutorProfile.userStatus === 'Present' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)', color: tutorProfile.userStatus === 'Present' ? '#10b981' : '#ef4444', padding: '4px 12px', borderRadius: '100px', fontSize: '0.7rem', fontWeight: 900 }}>
                                        {tutorProfile.userStatus || 'Active'}
                                    </span>
                                </div>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>ATTENDANCE</div>
                                <div style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--primary)' }}>{tutorProfile.attendanceRate || 92}%</div>
                            </div>
                        </div>
                    </div>
                )}
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
                    <StatCard icon={<Video color="#ef4444" />} title="Total Batches" value={metrics.totalSessions} trend={upcomingBatches.length > 0 ? `${upcomingBatches.length} Upcoming` : 'No upcoming'} color="#ef4444" />
                    <StatCard icon={<FileText color="#3b82f6" />} title="Pending Work" value={metrics.pendingAssignments} trend={pendingGrading.length > 0 ? `${pendingGrading.length} to grade` : 'All clear'} color="#3b82f6" />
                    <StatCard icon={<Users color="#8b5cf6" />} title="Total Students" value={metrics.totalStudents} trend="Enrolled" color="#8b5cf6" />
                    <StatCard icon={<Activity color="#10b981" />} title="Attendance Avg" value={`${metrics.attendanceRate}%`} trend={metrics.attendanceRate >= 90 ? 'Excellent' : 'Needs improvement'} color="#10b981" />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: '2rem' }}>
                    {/* --- BATCHES --- */}
                    <div className="glass-panel" style={{ padding: '2.5rem', borderRadius: '32px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                            <h3 style={{ fontSize: '1.3rem', fontWeight: 900 }}>All Batches</h3>
                            <button className="btn-quantum" style={{ padding: '10px 20px', fontSize: '0.8rem' }}><Plus size={16} style={{ marginRight: '8px' }} /> NEW BATCH</button>
                        </div>
                        {loading ? (
                            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-dim)' }}>Loading batches...</div>
                        ) : batches.length === 0 ? (
                            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-dim)' }}>
                                No batches found. <br /> 
                                <button onClick={fetchTutorData} style={{ marginTop: '1rem', padding: '8px 16px', background: 'var(--primary)', border: 'none', borderRadius: '8px', cursor: 'pointer', color: '#000', fontWeight: 800 }}>
                                    Retry
                                </button>
                            </div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                {batches.slice(0, 5).map((batch: any, i: number) => (
                                    <ClassRow key={i} title={batch.name || batch.batchName || 'Untitled'} batch={batch.course?.name || batch.branch || 'General'} time={batch.startTime || 'TBD'} status={batch.status || 'UPCOMING'} />
                                ))}
                            </div>
                        )}
                    </div>

                    {/* --- PENDING TASKS --- */}
                    <div className="glass-panel" style={{ padding: '2.5rem', borderRadius: '32px' }}>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: 900, marginBottom: '2rem' }}>Grading Queue</h3>
                        {loading ? (
                            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-dim)' }}>Loading...</div>
                        ) : pendingGrading.length === 0 ? (
                            <div style={{ textAlign: 'center', color: 'var(--text-dim)', padding: '2rem' }}>
                                No pending submissions.<br />
                                <button onClick={fetchTutorData} style={{ marginTop: '1rem', padding: '8px 16px', background: 'var(--primary)', border: 'none', borderRadius: '8px', cursor: 'pointer', color: '#000', fontWeight: 800 }}>
                                    Refresh
                                </button>
                            </div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                {pendingGrading.slice(0, 5).map((assignment: any, i: number) => (
                                    <GradingRow key={i} name={assignment.student?.name || 'Student'} task={assignment.title || 'Untitled'} score="PENDING" status={assignment.status || 'WAIT_EVAL'} />
                                ))}
                            </div>
                        )}
                        {pendingGrading.length > 0 && (
                            <button style={{ width: '100%', marginTop: '2rem', padding: '12px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', color: '#fff', fontSize: '0.8rem', fontWeight: 800 }}>LAUNCH GRADING SUITE →</button>
                        )}
                    </div>
                </div>

                {/* --- ALL ASSIGNMENTS --- */}
                <div style={{ marginTop: '2rem' }}>
                    <div className="glass-panel" style={{ padding: '2rem', borderRadius: '24px' }}>
                        <h3 style={{ fontSize: '1.3rem', fontWeight: 900, marginBottom: '1.5rem' }}>All Assignments ({assignments.length})</h3>
                        {loading ? (
                            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-dim)' }}>Loading...</div>
                        ) : assignments.length === 0 ? (
                            <div style={{ textAlign: 'center', color: 'var(--text-dim)', padding: '2rem' }}>No assignments found.</div>
                        ) : (
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1rem' }}>
                                {assignments.slice(0, 10).map((assignment: any, i: number) => (
                                    <div key={i} style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '12px' }}>
                                        <div style={{ fontWeight: 800, marginBottom: '4px' }}>{assignment.title || 'Untitled'}</div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                                            Status: <span style={{ color: assignment.status === 'GRADED' ? '#10b981' : '#f59e0b' }}>{assignment.status || 'PENDING'}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </motion.div>
        </DashboardLayout>
    );
}

function StatCard({ icon, title, value, trend, color }: any) {
    return (
        <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: '24px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', bottom: -10, right: -10, color: `${color}05`, width: '80px', height: '80px' }}>{icon}</div>
            <div style={{ color, marginBottom: '0.5rem' }}>{icon}</div>
            <div style={{ fontSize: '0.6rem', fontWeight: 900, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '2px' }}>{title}</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 900, margin: '5px 0' }}>{value}</div>
            <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-dim)' }}>{trend}</div>
        </div>
    );
}

function ClassRow({ title, batch, time, status }: any) {
    const statusMap: any = {
        'ACTIVE': { color: '#10b981', label: 'ACTIVE' },
        'UPCOMING': { color: '#3b82f6', label: 'UPCOMING' },
        'COMPLETED': { color: '#8b5cf6', label: 'COMPLETED' }
    };
    return (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem', background: 'rgba(255,255,255,0.015)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.03)' }}>
            <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                <div style={{ width: '40px', height: '40px', background: 'rgba(255,255,255,0.03)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900 }}>{title.charAt(0)}</div>
                <div>
                    <div style={{ fontWeight: 800, fontSize: '0.95rem' }}>{title}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>{batch} • {time}</div>
                </div>
            </div>
            <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.65rem', fontWeight: 900, color: statusMap[status]?.color || '#f59e0b', letterSpacing: '1px', marginBottom: '4px' }}>{statusMap[status]?.label || status}</div>
                <button style={{ padding: '6px 12px', background: 'var(--primary)', border: 'none', color: '#fff', borderRadius: '6px', fontSize: '0.65rem', fontWeight: 900, cursor: 'pointer' }}>VIEW →</button>
            </div>
        </div>
    );
}

function GradingRow({ name, task, score, status }: any) {
    return (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '12px', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
            <div>
                <div style={{ fontWeight: 800, fontSize: '0.9rem' }}>{name}</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', fontWeight: 700 }}>{task}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
                <div style={{ fontWeight: 900, color: score === 'PENDING' ? '#f59e0b' : '#10b981', fontSize: '0.8rem' }}>{score}</div>
                <div style={{ fontSize: '0.6rem', fontWeight: 900, color: 'var(--text-dim)', textTransform: 'uppercase' }}>{status}</div>
            </div>
        </div>
    );
}