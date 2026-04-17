import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import LandingPage from './components/LandingPage';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import ForgotPassword from './components/auth/ForgotPassword';
import Dashboard from './components/Dashboard';
import Profile from './components/Profile';
import Discover from './components/Discover';
import SwapRequests from './components/SwapRequests';
import ChatPage from './components/ChatPage';
import AdminPanel from './components/admin/AdminPanel';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchUser(token);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUser = async (token) => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      } else {
        localStorage.removeItem('token');
      }
    } catch (error) {
      console.error('Error fetching user:', error);
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  };

  const login = (userData, token) => {
    setUser(userData);
    localStorage.setItem('token', token);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="rounded-full border border-slate-200 bg-white px-5 py-2 text-slate-600 shadow-sm">Loading...</div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-transparent">
        <div className="app-bg-orb orb-1"></div>
        <div className="app-bg-orb orb-2"></div>
        <div className="app-bg-orb orb-3"></div>
        {user && <Navbar user={user} logout={logout} />}
        
        <div className="mx-auto max-w-7xl px-4 py-8">
          <Routes>
            <Route 
              path="/" 
              element={user ? <Navigate to="/dashboard" /> : <LandingPage />} 
            />
            <Route 
              path="/login" 
              element={user ? <Navigate to="/dashboard" /> : <Login login={login} />} 
            />
            <Route 
              path="/register" 
              element={user ? <Navigate to="/dashboard" /> : <Register login={login} />} 
            />
            <Route
              path="/forgot-password"
              element={user ? <Navigate to="/dashboard" /> : <ForgotPassword />}
            />
            <Route 
              path="/dashboard" 
              element={user ? <Dashboard user={user} /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/profile" 
              element={user ? <Profile user={user} setUser={setUser} /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/discover" 
              element={user ? <Discover user={user} /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/requests" 
              element={user ? <SwapRequests user={user} /> : <Navigate to="/login" />} 
            />
            <Route
              path="/chat"
              element={user ? <ChatPage user={user} /> : <Navigate to="/login" />}
            />
            <Route 
              path="/admin" 
              element={user && user.isAdmin ? <AdminPanel user={user} /> : <Navigate to="/dashboard" />} 
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App; 