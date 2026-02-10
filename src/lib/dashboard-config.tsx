
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
    Award,
    Bell,
    Video,
    Code2,
    CheckCircle2
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
        { label: 'Online Exam Engine', href: '/admin/super/exams', icon: FileText },
        { label: 'Admissions & CRM', href: '/admin/super/admissions', icon: UserCheck },
        { label: 'Business & Employees', href: '/admin/super/business', icon: Building2 },
        { label: 'User Management', href: '/admin/super/users', icon: Users },
        { label: 'Financials', href: '/admin/super/finance', icon: DollarSign },
        { label: 'Placements', href: '/admin/super/placements', icon: Briefcase },
        { label: 'Assets & Inventory', href: '/admin/super/assets', icon: Building2 },
        { label: 'Reports & Analytics', href: '/admin/super/reports', icon: BarChart3 },
        { label: 'Notice Board', href: '/admin/super/notices', icon: Bell },
        { label: 'Platform Settings', href: '/admin/super/settings', icon: Settings },
    ],
    admin: [
        { label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
        { label: 'User Management', href: '/admin/dashboard/users', icon: Users },
        { label: 'Academic', href: '/admin/dashboard/academics', icon: BookOpen },
        { label: 'Course Management', href: '/admin/dashboard/courses', icon: Layers },
        { label: 'Online Sessions', href: '/admin/dashboard/sessions', icon: Video },
        { label: 'Assessments', href: '/admin/dashboard/assessments', icon: CheckCircle2 },
        { label: 'Finance', href: '/admin/dashboard/finance', icon: Wallet },
        { label: 'Reports', href: '/admin/dashboard/reports', icon: BarChart3 },
    ],
    trainer: [
        { label: 'Dashboard', href: '/employee/trainer', icon: LayoutDashboard },
        { label: 'Online Sessions', href: '/employee/trainer/sessions', icon: Video },
        { label: 'LMS Management', href: '/employee/trainer/lms', icon: BookOpen },
        { label: 'Assessments', href: '/employee/trainer/assessments', icon: CheckCircle2 },
        { label: 'Student Tracking', href: '/employee/trainer/tracking', icon: BarChart3 },
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
        { label: 'Dashboard', href: '/student/dashboard', icon: LayoutDashboard },
        { label: 'Online Classes', href: '/student/dashboard/classes', icon: Video },
        { label: 'LMS Access', href: '/student/dashboard/lms', icon: BookOpen },
        { label: 'Assessments', href: '/student/dashboard/assessments', icon: CheckCircle2 },
        { label: 'Online Compiler', href: '/student/dashboard/compiler', icon: Code2 },
        { label: 'Fees Portal', href: '/student/dashboard/fees', icon: Wallet },
        { label: 'Placement HQ', href: '/student/dashboard/placements', icon: Briefcase },
        { label: 'Mock Tests', href: '/student/dashboard/mock-tests', icon: GraduationCap },
    ]
};

