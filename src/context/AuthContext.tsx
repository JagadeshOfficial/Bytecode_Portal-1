"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Role } from '@/lib/dashboard-config';

interface AuthContextType {
    user: any | null;
    role: Role | null;
    token: string | null;
    login: (userData: any) => void;
    logout: () => void;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<any | null>(null);
    const [role, setRole] = useState<Role | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const storedRole = localStorage.getItem('role') as Role;
        const storedToken = localStorage.getItem('token');

        if (storedUser && storedRole && storedToken) {
            setUser(JSON.parse(storedUser));
            setRole(storedRole);
            setToken(storedToken);
        }
        setIsLoading(false);
    }, []);

    const login = (data: any) => {
        setUser(data);
        const backendRoleToFrontend: Record<string, Role> = {
            'SUPER_ADMIN': 'super_admin',
            'ADMIN': 'admin',
            'TRAINER': 'trainer',
            'HR': 'hr',
            'COUNSELOR': 'counselor',
            'FINANCE': 'finance',
            'STUDENT': 'student'
        };
        const mappedRole = backendRoleToFrontend[data.role] || (data.role.toLowerCase() as Role);
        setRole(mappedRole);
        setToken(data.token);

        localStorage.setItem('user', JSON.stringify(data));
        localStorage.setItem('role', mappedRole);
        localStorage.setItem('token', data.token);
    };

    const logout = () => {
        setUser(null);
        setRole(null);
        setToken(null);
        localStorage.removeItem('user');
        localStorage.removeItem('role');
        localStorage.removeItem('token');
        router.push('/login');
    };

    return (
        <AuthContext.Provider value={{ user, role, token, login, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
