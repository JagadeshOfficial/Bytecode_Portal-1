/**
 * useUserId — resolves the logged-in user's MongoDB _id.
 *
 * New logins (after the AuthResponse.id fix) already have user.id in localStorage.
 * Old sessions that were stored without an id field fall back to a GET /users/{email}
 * lookup and patch localStorage so subsequent page loads are instant.
 */
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';

export function useUserId(): string | null {
    const { user } = useAuth();
    const [resolvedId, setResolvedId] = useState<string | null>(user?.id ?? null);

    useEffect(() => {
        if (!user) return;

        // Fast path — id already present (new login)
        if (user.id) {
            setResolvedId(user.id);
            return;
        }

        // Slow path — old localStorage session without id, fetch from user-service
        if (user.email) {
            api.get(`/users/${encodeURIComponent(user.email)}`)
                .then(res => {
                    const dbId: string = res.data?.id;
                    if (dbId) {
                        setResolvedId(dbId);
                        // Patch the stored user object so future page loads skip this fetch
                        const patched = { ...user, id: dbId };
                        localStorage.setItem('user', JSON.stringify(patched));
                    }
                })
                .catch(err => console.error('useUserId fallback failed:', err));
        }
    }, [user?.id, user?.email]);

    return resolvedId;
}
