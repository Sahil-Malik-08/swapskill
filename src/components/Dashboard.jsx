import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Dashboard = ({ user }) => {
  const [stats, setStats] = useState({
    pendingRequests: 0,
    acceptedRequests: 0,
    completedSwaps: 0,
    totalRating: 0
  });
  const [recentRequests, setRecentRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('https://swapskill-2-1p6q.onrender.com/api/swaps/my-requests', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        const requests = data.swapRequests;

        // Calculate stats
        const pending = requests.filter(r => r.status === 'pending').length;
        const accepted = requests.filter(r => r.status === 'accepted').length;
        const completed = requests.filter(r => r.status === 'completed').length;

        setStats({
          pendingRequests: pending,
          acceptedRequests: accepted,
          completedSwaps: completed,
          totalRating: user.rating || 0
        });

        // Get recent requests (last 5)
        setRecentRequests(requests.slice(0, 5));
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="hero-shell card border-slate-300/40 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white">
        <span className="section-chip mb-3 border-white/20 bg-white/10 text-slate-100">Your Learning Hub</span>
        <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-300">Welcome back</p>
        <h1 className="mb-2 text-3xl font-black tracking-tight">Dashboard, {user.name.split(' ')[0]}</h1>
        <p className="text-slate-200">Track your active swaps, profile strength, and learning momentum in one place.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="card stat-card">
          <p className="mb-3 text-2xl">⏳</p>
          <p className="mb-1 text-sm font-semibold uppercase tracking-wide text-slate-500">Pending Requests</p>
          <p className="text-4xl font-black text-slate-900">{stats.pendingRequests}</p>
        </div>
        
        <div className="card stat-card">
          <p className="mb-3 text-2xl">🤝</p>
          <p className="mb-1 text-sm font-semibold uppercase tracking-wide text-slate-500">Accepted Requests</p>
          <p className="text-4xl font-black text-slate-900">{stats.acceptedRequests}</p>
        </div>
        
        <div className="card stat-card">
          <p className="mb-3 text-2xl">✅</p>
          <p className="mb-1 text-sm font-semibold uppercase tracking-wide text-slate-500">Completed Swaps</p>
          <p className="text-4xl font-black text-slate-900">{stats.completedSwaps}</p>
        </div>
        
        <div className="card stat-card">
          <p className="mb-3 text-2xl">⭐</p>
          <p className="mb-1 text-sm font-semibold uppercase tracking-wide text-slate-500">Your Rating</p>
          <p className="text-4xl font-black text-slate-900">
            {stats.totalRating > 0 ? `${stats.totalRating}/5` : 'No ratings yet'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Profile Summary */}
        <div className="card">
          <h2 className="mb-4 text-xl font-bold text-slate-900">Profile Summary</h2>
          <div className="space-y-3">
            <div>
              <span className="font-medium text-slate-500">Name:</span>
              <span className="ml-2 text-slate-900">{user.name}</span>
            </div>
            {user.location && (
              <div>
                <span className="font-medium text-slate-500">Location:</span>
                <span className="ml-2 text-slate-900">{user.location}</span>
              </div>
            )}
            <div>
              <span className="font-medium text-slate-500">Skills Offered:</span>
              <span className="ml-2 text-slate-900">{user.skillsOffered?.length || 0}</span>
            </div>
            <div>
              <span className="font-medium text-slate-500">Skills Wanted:</span>
              <span className="ml-2 text-slate-900">{user.skillsWanted?.length || 0}</span>
            </div>
            <div>
              <span className="font-medium text-slate-500">Profile Status:</span>
              <span className={`ml-2 ${user.isPublic ? 'text-green-600' : 'text-red-600'}`}>
                {user.isPublic ? 'Public' : 'Private'}
              </span>
            </div>
          </div>
          <div className="mt-4">
            <Link to="/profile" className="btn btn-primary">
              Edit Profile
            </Link>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="card">
          <h2 className="mb-4 text-xl font-bold text-slate-900">Recent Activity</h2>
          {recentRequests.length > 0 ? (
            <div className="space-y-3">
              {recentRequests.map((request) => (
                <div key={request._id} className="rounded-xl border border-slate-200/80 bg-white p-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-slate-900">
                        {request.fromUser._id === user._id 
                          ? `To: ${request.toUser.name}`
                          : `From: ${request.fromUser.name}`
                        }
                      </p>
                      <p className="text-sm text-slate-600">{request.message}</p>
                    </div>
                    <span className={`badge badge-${request.status}`}>
                      {request.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-slate-600">No recent activity</p>
          )}
          <div className="mt-4">
            <Link to="/requests" className="btn btn-secondary">
              View All Requests
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card">
        <h2 className="mb-4 text-xl font-bold text-slate-900">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          <Link to="/discover" className="btn btn-primary">
            Discover Skills
          </Link>
          <Link to="/profile" className="btn btn-secondary">
            Update Profile
          </Link>
          <Link to="/requests" className="btn btn-secondary">
            View Requests
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 
