import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, User, UserPlus, AlertCircle, ArrowLeft, CheckCircle } from 'lucide-react';
import api from '../services/api';
import './Login.css'; // Reusing Login styles for consistency

const Register = ({ onNavigate }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [roomNumber, setRoomNumber] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setIsLoading(true);

        try {
            await api.post('/auth/register', {
                name,
                email,
                password,
                roomNumber,
                role: 'STUDENT'
            });

            setSuccess('Registration successful! Redirecting to login...');
            setTimeout(() => {
                onNavigate('login');
            }, 2000);

        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="login-page">
            <motion.button
                className="back-btn"
                onClick={() => onNavigate('login')}
                whileHover={{ x: -5 }}
                whileTap={{ scale: 0.95 }}
            >
                <ArrowLeft size={20} />
                <span>Back to Login</span>
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
                        <h2>Create Account</h2>
                        <p>Join our hostel community today</p>
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

                        {success && (
                            <motion.div
                                className="success-message"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                style={{
                                    background: '#ecfdf5',
                                    border: '1px solid #d1fae5',
                                    padding: 'var(--spacing-sm)',
                                    borderRadius: 'var(--radius-md)',
                                    color: '#059669',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 'var(--spacing-sm)',
                                    fontSize: '0.875rem',
                                    marginBottom: 'var(--spacing-md)'
                                }}
                            >
                                <CheckCircle size={18} />
                                <span>{success}</span>
                            </motion.div>
                        )}

                        <div className="input-group">
                            <label htmlFor="name">Full Name</label>
                            <div className="input-wrapper">
                                <User className="input-icon" size={20} />
                                <input
                                    type="text"
                                    id="name"
                                    placeholder="John Doe"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

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

                        <div className="input-group">
                            <label htmlFor="roomNumber">Room Number</label>
                            <div className="input-wrapper">
                                <User className="input-icon" size={20} />
                                <input
                                    type="text"
                                    id="roomNumber"
                                    placeholder="e.g., A-101"
                                    value={roomNumber}
                                    onChange={(e) => setRoomNumber(e.target.value)}
                                />
                            </div>
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
                                    <span>Create Account</span>
                                    <UserPlus size={20} />
                                </>
                            )}
                        </motion.button>
                    </form>

                    <div className="login-footer">
                        <p>Already have an account? <a href="#" onClick={(e) => { e.preventDefault(); onNavigate('login'); }}>Sign In</a></p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Register;
