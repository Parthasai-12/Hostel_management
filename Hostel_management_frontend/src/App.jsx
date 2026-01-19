import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import Footer from './components/Footer';
import StudentDashboard from './components/StudentDashboard';
import ComplaintForm from './components/ComplaintForm';
import Login from './components/Login';
import Register from './components/Register';
import Profile from './components/Profile';
import AdminDashboard from './components/AdminDashboard';
import './App.css';

function App() {
  const [currentView, setCurrentView] = useState('landing');
  const [userRole, setUserRole] = useState(localStorage.getItem('role'));

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    if (token && role) {
      setUserRole(role);
      // Auto-redirect if token exists? Maybe only if they are on landing
      // For now, let's keep it simple.
    }
  }, []);

  const handleLoginSuccess = (view) => {
    setUserRole(localStorage.getItem('role'));
    setCurrentView(view);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setUserRole(null);
    setCurrentView('landing');
  };


  if (currentView === 'login') {
    return <Login onNavigate={setCurrentView} onLoginSuccess={handleLoginSuccess} />;
  }

  if (currentView === 'register') {
    return <Register onNavigate={setCurrentView} />;
  }

  if (currentView === 'dashboard' || currentView === 'complaints') {
    if (userRole === 'ADMIN') {
      return <AdminDashboard onNavigate={setCurrentView} onLogout={handleLogout} />;
    }
    return <StudentDashboard onNavigate={setCurrentView} onLogout={handleLogout} initialView={currentView === 'complaints' ? 'complaints' : 'dashboard'} />;
  }

  if (currentView === 'form') {
    return <ComplaintForm onNavigate={setCurrentView} />;
  }

  if (currentView === 'profile') {
    return <Profile onNavigate={setCurrentView} />;
  }

  return (
    <div className="app">
      <Navbar onNavigate={setCurrentView} onLogout={handleLogout} isLoggedIn={!!userRole} />
      <Hero onNavigate={setCurrentView} isLoggedIn={!!userRole} />
      <Features />
      <Footer />
    </div>
  );
}

export default App;
