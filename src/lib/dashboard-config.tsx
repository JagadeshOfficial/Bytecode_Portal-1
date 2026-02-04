
import {
    LayoutDashboard,
    Building2,
    Users,
    DollarSign,
    BookOpen,
    Settings,
    Shield,
    BarChart3,
    GraduationCap,
    Briefcase,
    FileText,
    Calendar,
    MessageSquare,
    UserCheck,
    Layers,
    PieChart,
    Wallet,
    Award
} from "lucide-react";

export type Role = 'super_admin' | 'admin' | 'trainer' | 'hr' | 'counselor' | 'finance' | 'student';

export interface NavItem {
    label: string;
    href: string;
    icon: any;
}

export const ROLE_CONFIG: Record<Role, { label: string; dashUrl: string }> = {
    super_admin: { label: 'Super Admin', dashUrl: '/admin/super' },
    admin: { label: 'Institute Admin', dashUrl: '/admin/dashboard' },
    trainer: { label: 'Trainer / Faculty', dashUrl: '/employee/trainer' },
    hr: { label: 'HR / Placement', dashUrl: '/employee/hr' },
    counselor: { label: 'Counselor / Sales', dashUrl: '/employee/counselor' },
    finance: { label: 'Finance Executive', dashUrl: '/employee/finance' },
    student: { label: 'Student', dashUrl: '/student/dashboard' }
};

export const DASHBOARD_NAV: Record<Role, NavItem[]> = {
    super_admin: [
        { label: 'Overview', href: '/admin/super', icon: LayoutDashboard },
        { label: 'Academics', href: '/admin/super/academics', icon: BookOpen },
        { label: 'Course Management', href: '/admin/super/courses', icon: Layers },
        { label: 'Admissions & CRM', href: '/admin/super/admissions', icon: UserCheck },
        { label: 'User Management', href: '/admin/super/users', icon: Users },
        { label: 'Financials', href: '/admin/super/finance', icon: DollarSign },
        { label: 'Placements', href: '/admin/super/placements', icon: Briefcase },
        { label: 'Assets & Inventory', href: '/admin/super/assets', icon: Building2 },
        { label: 'Reports & Analytics', href: '/admin/super/reports', icon: BarChart3 },
        { label: 'Platform Settings', href: '/admin/super/settings', icon: Settings },
    ],
    admin: [
        { label: 'Institute Snapshot', href: '/admin/dashboard', icon: LayoutDashboard },
        { label: 'Student Management', href: '/admin/dashboard/students', icon: GraduationCap },
        { label: 'Employee Management', href: '/admin/dashboard/employees', icon: Users },
        { label: 'Courses & Batches', href: '/admin/dashboard/courses', icon: BookOpen },
        { label: 'Attendance', href: '/admin/dashboard/attendance', icon: Calendar },
        { label: 'Finance & Fees', href: '/admin/dashboard/finance', icon: Wallet },
        { label: 'Reports', href: '/admin/dashboard/reports', icon: FileText },
    ],
    trainer: [
        { label: 'My Batches', href: '/employee/trainer', icon: LayoutDashboard },
        { label: 'Class Schedule', href: '/employee/trainer/schedule', icon: Calendar },
        { label: 'Content Upload', href: '/employee/trainer/content', icon: FileText },
        { label: 'Assignments', href: '/employee/trainer/assignments', icon: BookOpen },
        { label: 'Attendance', href: '/employee/trainer/attendance', icon: UserCheck },
        { label: 'Student Analytics', href: '/employee/trainer/analytics', icon: BarChart3 },
    ],
    hr: [
        { label: 'Job Postings', href: '/employee/hr', icon: Briefcase },
        { label: 'Company Mgmt', href: '/employee/hr/companies', icon: Building2 },
        { label: 'Student Mapping', href: '/employee/hr/mapping', icon: Users },
        { label: 'Interviews', href: '/employee/hr/interviews', icon: MessageSquare },
        { label: 'Offer Tracking', href: '/employee/hr/offers', icon: Award },
    ],
    counselor: [
        { label: 'Lead Management', href: '/employee/counselor', icon: Users },
        { label: 'Follow-ups', href: '/employee/counselor/followups', icon: MessageSquare },
        { label: 'Onboarding', href: '/employee/counselor/onboarding', icon: UserCheck },
        { label: 'Reports', href: '/employee/counselor/reports', icon: PieChart },
    ],
    finance: [
        { label: 'Fee Collection', href: '/employee/finance', icon: Wallet },
        { label: 'Invoices', href: '/employee/finance/invoices', icon: FileText },
        { label: 'Expenses', href: '/employee/finance/expenses', icon: DollarSign },
        { label: 'Reports', href: '/employee/finance/reports', icon: BarChart3 },
    ],
    student: [
        { label: 'Learning Hub', href: '/student/dashboard', icon: BookOpen },
        { label: 'My Courses', href: '/student/dashboard/courses', icon: GraduationCap },
        { label: 'Assignments', href: '/student/dashboard/assignments', icon: FileText },
        { label: 'Attendance', href: '/student/dashboard/attendance', icon: Calendar },
        { label: 'Placement Hub', href: '/student/dashboard/placement', icon: Briefcase },
        { label: 'Fees & Certs', href: '/student/dashboard/fees', icon: Wallet },
    ]
};
