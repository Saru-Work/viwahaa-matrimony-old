import { useSelector } from 'react-redux';
import { Outlet, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { API } from '../utils/api';

export default function OnlyAdminPrivateRoute() {
    const { currentUser } = useSelector((state) => state.user);
    const [hasAdminAccess, setHasAdminAccess] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAdminAccess = async () => {
            // Resolve user object and token from Redux or localStorage
            let userObj = null;
            let token = null;

            if (currentUser) {
                // Redux shape from AdminSignIn: { token, user: { id, user_type_id, ... }, isAdmin, ... }
                token = currentUser.token;
                userObj = currentUser.user || currentUser;
            }

            if (!userObj || !token) {
                // Fallback to localStorage
                const localUser = localStorage.getItem('user');
                const localToken = localStorage.getItem('token');
                const isAdmin = localStorage.getItem('isAdmin') === 'true';

                if (localUser && localToken && isAdmin) {
                    userObj = JSON.parse(localUser);
                    token = localToken;
                } else {
                    setLoading(false);
                    return;
                }
            }

            // Resolve the user ID — handle both { id } and { user: { id } } shapes
            const userId = userObj.id || userObj.user?.id;
            // Resolve user type — allow Admin (1) and Staff (3)
            const userTypeId = userObj.user_type_id || userObj.userType;
            const allowedTypes = [1, 3];

            if (!userId) {
                console.error('Admin verification: could not resolve user ID');
                setHasAdminAccess(false);
                setLoading(false);
                return;
            }

            // Quick client-side check first
            if (allowedTypes.includes(Number(userTypeId))) {
                setHasAdminAccess(true);
            }

            // Then verify with backend
            try {
                const response = await fetch(`${API}/api/admin/permissions/${userId}`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });
                
                if (!response.ok) {
                    throw new Error('Failed to verify admin status');
                }
                
                const data = await response.json();
                // Backend returns isAdmin: true only for user_type_id=1
                // Staff (type 3) should also have access
                setHasAdminAccess(data.isAdmin || allowedTypes.includes(Number(userTypeId)));
            } catch (error) {
                console.error('Admin verification error:', error);
                // If the API fails but we have valid client-side data, still allow access
                if (allowedTypes.includes(Number(userTypeId))) {
                    setHasAdminAccess(true);
                } else {
                    setHasAdminAccess(false);
                }
            } finally {
                setLoading(false);
            }
        };

        checkAdminAccess();
    }, [currentUser]);

    if (loading) {
        return <div>Loading...</div>;
    }

    return hasAdminAccess ? <Outlet /> : <Navigate to="/admin-sign-in" />;
}