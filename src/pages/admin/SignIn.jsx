import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const GOOGLE_AUTH_URL =
  import.meta.env.VITE_GOOGLE_AUTH_URL || 'http://localhost:3000/api/auth/google';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Dummy handler for email/password login (replace with real API if needed)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    // You can implement your own email/password login here if needed
    toast.error('Email/password login is not enabled. Please use Google Sign-In.');
    setLoading(false);
  };

  const handleGoogleSignIn = () => {
    window.location.href = GOOGLE_AUTH_URL;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-6">Admin Sign In</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your email"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your password"
              required
            />
          </div>
          {error && <div className="text-red-600 text-sm">{error}</div>}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        <div className="my-6 flex items-center justify-center">
          <span className="text-gray-400 text-sm">or</span>
        </div>
        <button
          onClick={handleGoogleSignIn}
          className="w-full flex items-center justify-center gap-2 bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition-colors"
        >
          <svg className="w-5 h-5" viewBox="0 0 48 48">
            <g>
              <path fill="#4285F4" d="M24 9.5c3.54 0 6.7 1.22 9.19 3.23l6.85-6.85C35.64 2.7 30.18 0 24 0 14.82 0 6.71 5.82 2.69 14.09l7.98 6.2C12.13 13.13 17.56 9.5 24 9.5z"/>
              <path fill="#34A853" d="M46.1 24.55c0-1.64-.15-3.22-.42-4.74H24v9.01h12.42c-.54 2.9-2.18 5.36-4.65 7.01l7.19 5.6C43.98 37.13 46.1 31.3 46.1 24.55z"/>
              <path fill="#FBBC05" d="M10.67 28.29a14.5 14.5 0 0 1 0-8.58l-7.98-6.2A23.94 23.94 0 0 0 0 24c0 3.77.9 7.34 2.69 10.49l7.98-6.2z"/>
              <path fill="#EA4335" d="M24 48c6.18 0 11.36-2.05 15.15-5.59l-7.19-5.6c-2.01 1.35-4.6 2.16-7.96 2.16-6.44 0-11.87-3.63-14.33-8.79l-7.98 6.2C6.71 42.18 14.82 48 24 48z"/>
              <path fill="none" d="M0 0h48v48H0z"/>
            </g>
          </svg>
          Sign in with Google
        </button>
        <div className="mt-6 text-center text-sm text-gray-500">
          Only authorized admins can access the admin panel.
        </div>
      </div>
    </div>
  );
};

export default SignIn; 