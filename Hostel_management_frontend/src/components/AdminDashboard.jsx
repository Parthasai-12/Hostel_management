import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';
import {
    LayoutDashboard,
    List,
    User,
    LogOut,
    Menu,
    X,
    Clock,
    CheckCircle,
    AlertCircle,
    Users
} from 'lucide-react';
import './AdminDashboard.css';

const AdminDashboard = ({ onNavigate, onLogout }) => {
    const [activeMenu, setActiveMenu] = useState('dashboard');
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [complaints, setComplaints] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [updatingId, setUpdatingId] = useState(null);

    useEffect(() => {
        const role = localStorage.getItem('role');
        if (role !== 'ADMIN') {
            console.warn('Unauthorized access to admin dashboard');
            onLogout();
            return;
        }
        fetchComplaints();
    }, []);

    const fetchComplaints = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const response = await api.get('/complaints/all');
            setComplaints(response.data);
        } catch (err) {
            console.error('Error fetching complaints:', err);
            setError('Failed to load complaints. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleStatusUpdate = async (id, newStatus) => {
        try {
            setUpdatingId(id);
            await api.put(`/complaints/${id}/status`, { status: newStatus });
            // Refresh list
            await fetchComplaints();
        } catch (err) {
            console.error('Error updating status:', err);
            alert('Failed to update status');
        } finally {
            setUpdatingId(null);
        }
    };

    const menuItems = [
        { id: 'dashboard', label: 'Admin Panel', icon: <LayoutDashboard size={20} /> },
        { id: 'complaints', label: 'All Complaints', icon: <List size={20} /> },
        { id: 'users', label: 'User Management', icon: <Users size={20} /> },
        { id: 'logout', label: 'Logout', icon: <LogOut size={20} /> },
    ];

    const getStatusIcon = (status) => {
        switch (status) {
            case 'PENDING':
                return <Clock size={16} className="status-icon pending" />;
            case 'IN_PROGRESS':
                return <AlertCircle size={16} className="status-icon in-progress" />;
            case 'RESOLVED':
                return <CheckCircle size={16} className="status-icon resolved" />;
            default:
                return null;
        }
    };

    const getStatusClass = (status) => {
        return status.toLowerCase().replace('_', '-');
    };

    const handleMenuClick = (menuId) => {
        setActiveMenu(menuId);
        setSidebarOpen(false);
        if (menuId === 'logout') {
            onLogout();
        }
    };

    return (
        <div className="admin-dashboard">
            {/* Mobile Menu Button */}
            <motion.button
                className="mobile-menu-btn"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                whileTap={{ scale: 0.9 }}
            >
                {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </motion.button>

            {/* Sidebar */}
            <AnimatePresence>
                {(sidebarOpen || window.innerWidth > 768) && (
                    <motion.aside
                        className="sidebar"
                        initial={{ x: -300 }}
                        animate={{ x: 0 }}
                        exit={{ x: -300 }}
                        transition={{ duration: 0.3 }}
                    >
                        <div className="sidebar-header" onClick={() => onNavigate('landing')} style={{ cursor: 'pointer' }}>
                            <div className="logo">
                                <span className="logo-text">HostelHub Admin</span>
                            </div>
                        </div>

                        <nav className="sidebar-nav">
                            {menuItems.map((item, index) => (
                                <motion.button
                                    key={item.id}
                                    className={`nav-item ${activeMenu === item.id ? 'active' : ''}`}
                                    onClick={() => handleMenuClick(item.id)}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    whileHover={{ x: 5 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    {item.icon}
                                    <span>{item.label}</span>
                                </motion.button>
                            ))}
                        </nav>
                    </motion.aside>
                )}
            </AnimatePresence>

            {/* Main Content */}
            <main className="main-content">
                <motion.div
                    className="content-wrapper"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="dashboard-header">
                        <div>
                            <h1 className="dashboard-title">Admin Dashboard</h1>
                            <p className="dashboard-subtitle">Managing all student complaints and hostel issues</p>
                        </div>
                    </div>

                    <div className="stats-grid">
                        <div className="stat-card">
                            <div className="stat-icon pending-bg"><Clock size={24} /></div>
                            <div className="stat-info">
                                <p className="stat-label">Pending</p>
                                <p className="stat-value">{complaints.filter(c => c.status === 'PENDING').length}</p>
                            </div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon in-progress-bg"><AlertCircle size={24} /></div>
                            <div className="stat-info">
                                <p className="stat-label">In Progress</p>
                                <p className="stat-value">{complaints.filter(c => c.status === 'IN_PROGRESS').length}</p>
                            </div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon resolved-bg"><CheckCircle size={24} /></div>
                            <div className="stat-info">
                                <p className="stat-label">Resolved</p>
                                <p className="stat-value">{complaints.filter(c => c.status === 'RESOLVED').length}</p>
                            </div>
                        </div>
                    </div>

                    <div className="table-card">
                        <div className="table-header">
                            <h2 className="table-title">All Complaints</h2>
                        </div>

                        <div className="table-wrapper">
                            <table className="complaints-table">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Student</th>
                                        <th>Issue</th>
                                        <th>Description</th>
                                        <th>Date</th>
                                        <th>Status</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {isLoading ? (
                                        <tr><td colSpan="7" style={{ textAlign: 'center', padding: '2rem' }}>Loading complaints...</td></tr>
                                    ) : error ? (
                                        <tr><td colSpan="7" style={{ textAlign: 'center', padding: '2rem', color: '#ef4444' }}>{error}</td></tr>
                                    ) : complaints.length === 0 ? (
                                        <tr><td colSpan="7" style={{ textAlign: 'center', padding: '2rem' }}>No complaints found.</td></tr>
                                    ) : (
                                        complaints.map((complaint) => (
                                            <tr key={complaint.id}>
                                                <td className="id-cell">#{complaint.id}</td>
                                                <td className="student-cell">{complaint.studentName}</td>
                                                <td className="issue-cell">{complaint.title}</td>
                                                <td className="description-cell" title={complaint.description}>{complaint.description}</td>
                                                <td className="date-cell">
                                                    {complaint.createdAt ? new Date(complaint.createdAt).toLocaleDateString('en-GB', {
                                                        day: '2-digit',
                                                        month: 'short',
                                                        year: 'numeric'
                                                    }) : 'N/A'}
                                                </td>
                                                <td className="status-cell">
                                                    <span className={`status-badge ${getStatusClass(complaint.status)}`}>
                                                        {getStatusIcon(complaint.status)}
                                                        {complaint.status}
                                                    </span>
                                                </td>
                                                <td className="action-cell">
                                                    <select
                                                        className="status-select"
                                                        value={complaint.status}
                                                        onChange={(e) => handleStatusUpdate(complaint.id, e.target.value)}
                                                        disabled={updatingId === complaint.id}
                                                    >
                                                        <option value="PENDING">Pending</option>
                                                        <option value="IN_PROGRESS">In Progress</option>
                                                        <option value="RESOLVED">Resolved</option>
                                                    </select>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </motion.div>
            </main>
        </div>
    );
};

export default AdminDashboard;
