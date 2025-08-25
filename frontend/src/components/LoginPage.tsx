import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [otp, setOtp] = useState('');

    const [isLoading, setIsLoading] = useState(false);
    const [isSendingOtp, setIsSendingOtp] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleRequestOtp = async () => {
        if (!email) {
            setError('Please enter your email to request an OTP.');
            return;
        }
        setIsSendingOtp(true);
        setError(null);
        setMessage(null);

        try {
            const response = await fetch('http://localhost:3000/user/request-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message);
            setMessage(data.message);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsSendingOtp(false);
        }
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsLoading(true);
        setError(null);
        setMessage(null);

        try {
            const response = await fetch('http://localhost:3000/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password, otp }),
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.message);

            localStorage.setItem('accessToken', data.accessToken);
            navigate('/profile');

        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-center text-gray-700 mb-6">
                Login
            </h2>
            <form onSubmit={handleSubmit}>
                {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}
                {message && <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded mb-4">{message}</div>}

                <div className="mb-4">
                    <label className="block text-gray-600 mb-2" htmlFor="login-email">Email</label>
                    <input
                        type="email"
                        id="login-email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                        disabled={isLoading || isSendingOtp}
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-600 mb-2" htmlFor="login-password">Password</label>
                    <input
                        type="password"
                        id="login-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                        disabled={isLoading || isSendingOtp}
                    />
                </div>

                <div className="mb-6">
                    <label className="block text-gray-600 mb-2" htmlFor="otp">Login Code (OTP)</label>
                    <div className="flex items-center space-x-2">
                        <input
                            type="text"
                            id="otp"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                            disabled={isLoading || isSendingOtp}
                        />
                        <button
                            type="button"
                            onClick={handleRequestOtp}
                            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition duration-300 whitespace-nowrap disabled:bg-gray-400"
                            disabled={isLoading || isSendingOtp}
                        >
                            {isSendingOtp ? 'Sending...' : 'Send Code'}
                        </button>
                    </div>
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-300 disabled:bg-blue-300"
                    disabled={isLoading || isSendingOtp}
                >
                    {isLoading ? 'Logging In...' : 'Login'}
                </button>
            </form>
            <div className="text-center text-gray-500 text-sm mt-4 flex justify-between">
                <Link to="/forgot-password" className="text-blue-600 hover:underline">
                    Forgot Password?
                </Link>
                <Link to="/register" className="text-blue-600 hover:underline">
                    Register here
                </Link>
            </div>
        </div>
    );
};

export default LoginPage;