import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ProfilePage = () => {
    const [user, setUser] = useState<{ email: string } | null>(null);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfile = async () => {
            const token = localStorage.getItem('accessToken');
            if (!token) {
                navigate('/login');
                return;
            }

            try {
                const response = await fetch('http://localhost:3000/auth/profile', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch profile. Please log in again.');
                }

                const data = await response.json();
                setUser(data.user);
            } catch (err: any) {
                setError(err.message);
                localStorage.removeItem('accessToken');
                navigate('/login');
            }
        };

        fetchProfile();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('accessToken');
        navigate('/login');
    };

    if (error) {
        return <div className="text-red-500">{error}</div>;
    }

    if (!user) {
        return <div>Loading profile...</div>;
    }

    return (
        <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md text-center">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">
                Welcome to your Profile
            </h2>
            <p className="text-gray-600 mb-6">
                Logged in as: <strong>{user.email}</strong>
            </p>
            <button
                onClick={handleLogout}
                className="w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition duration-300"
            >
                Logout
            </button>
        </div>
    );
};

export default ProfilePage;
