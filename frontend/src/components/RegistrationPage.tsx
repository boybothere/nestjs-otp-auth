import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const RegistrationPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsLoading(true);
        setError(null);
        setSuccessMessage(null);

        try {
            const response = await fetch('http://localhost:3000/user/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });
            console.log(response)
            const data = await response.json();
            console.log(data)
            if (!response.ok) {
                throw new Error(data.message || 'Something went wrong');
            }

            setSuccessMessage(data.message);
            setEmail('');
            setPassword('');

        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-center text-gray-700 mb-6">
                Create Your Account
            </h2>
            <form onSubmit={handleSubmit}>
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}
                {successMessage && (
                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                        {successMessage}
                    </div>
                )}
                <div className="mb-4">
                    <label className="block text-gray-600 mb-2" htmlFor="email">
                        Email
                    </label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                        disabled={isLoading}
                    />
                </div>
                <div className="mb-6">
                    <label className="block text-gray-600 mb-2" htmlFor="password">
                        Password
                    </label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                        disabled={isLoading}
                    />
                </div>
                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-300 disabled:bg-blue-300"
                    disabled={isLoading}
                >
                    {isLoading ? 'Registering...' : 'Register'}
                </button>
            </form>
            <p className="text-center text-gray-500 text-sm mt-4">
                Already have an account?{' '}
                <Link to="/login" className="text-blue-600 hover:underline">
                    Login here
                </Link>
            </p>
        </div>
    );
};

export default RegistrationPage;
