import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, LogIn, AlertCircle, ArrowLeft } from 'lucide-react';
import api from '../services/api';
import './Login.css';

const Login = ({ onNavigate, onLoginSuccess }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const response = await api.post('/auth/login', { email, password });
            const { token, role: returnedRole } = response.data;
            localStorage.setItem('token', token);

            let role = returnedRole;
            if (!role) {
                try {
                    const payload = JSON.parse(atob(token.split('.')[1]));
                    role = payload.role || (payload.authorities ? (Array.isArray(payload.authorities) ? payload.authorities[0] : payload.authorities) : null);
                } catch (e) {
                    console.error('Error decoding token:', e);
                }
            }
            if (!role) role = 'STUDENT';

            localStorage.setItem('role', role);
            onLoginSuccess('dashboard');

        } catch (err) {
            setError(err.response?.data?.message || 'Invalid email or password. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="login-page">
            <motion.button
                className="back-btn"
                onClick={() => onNavigate('landing')}
                whileHover={{ x: -5 }}
                whileTap={{ scale: 0.95 }}
            >
                <ArrowLeft size={20} />
                <span>Back to Home</span>
            </motion.button>

            <div className="login-container">
                <motion.div
                    className="login-card"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="login-header">
                        <div className="login-logo">
                            <svg width="40" height="40" viewBox="0 0 32 32" fill="none">
                                <rect width="32" height="32" rx="8" fill="url(#login-gradient)" />
                                <path d="M8 12h16M8 16h16M8 20h10" stroke="white" strokeWidth="2" strokeLinecap="round" />
                                <defs>
                                    <linearGradient id="login-gradient" x1="0" y1="0" x2="32" y2="32">
                                        <stop offset="0%" style={{ stopColor: '#667eea' }} />
                                        <stop offset="100%" style={{ stopColor: '#764ba2' }} />
                                    </linearGradient>
                                </defs>
                            </svg>
                        </div>
                        <h2>Welcome Back</h2>
                        <p>Sign in to manage your hostel experience</p>
                    </div>

                    <form onSubmit={handleSubmit} className="login-form">
                        {error && (
                            <motion.div
                                className="error-message"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                            >
                                <AlertCircle size={18} />
                                <span>{error}</span>
                            </motion.div>
                        )}

                        <div className="input-group">
                            <label htmlFor="email">Email Address</label>
                            <div className="input-wrapper">
                                <Mail className="input-icon" size={20} />
                                <input
                                    type="email"
                                    id="email"
                                    placeholder="your@email.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="input-group">
                            <label htmlFor="password">Password</label>
                            <div className="input-wrapper">
                                <Lock className="input-icon" size={20} />
                                <input
                                    type="password"
                                    id="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-options">
                            <label className="remember-me">
                                <input type="checkbox" />
                                <span>Remember me</span>
                            </label>
                            <a href="#forgot" className="forgot-link">Forgot Password?</a>
                        </div>

                        <motion.button
                            type="submit"
                            className="login-submit-btn"
                            disabled={isLoading}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            {isLoading ? (
                                <div className="loader"></div>
                            ) : (
                                <>
                                    <span>Sign In</span>
                                    <LogIn size={20} />
                                </>
                            )}
                        </motion.button>
                    </form>

                    <div className="login-footer">
                        <p>Don’t have an account? <a href="#" onClick={(e) => { e.preventDefault(); onNavigate('register'); }}>Create a new account</a></p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Login;
