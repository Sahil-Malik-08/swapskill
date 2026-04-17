import React, { useState, useEffect } from 'react';

const AdminPanel = ({ user }) => {
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [swapRequests, setSwapRequests] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchData();
  }, [activeTab, currentPage]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      
      if (activeTab === 'users') {
        const response = await fetch(`http://localhost:5000/api/admin/users?page=${currentPage}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
          const data = await response.json();
          setUsers(data.users);
          setTotalPages(data.totalPages);
        }
      } else if (activeTab === 'swaps') {
        const response = await fetch(`http://localhost:5000/api/admin/swaps?page=${currentPage}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
          const data = await response.json();
          setSwapRequests(data.swapRequests);
          setTotalPages(data.totalPages);
        }
      } else if (activeTab === 'stats') {
        const response = await fetch('http://localhost:5000/api/admin/stats/swaps', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      }
    } catch (error) {
      console.error('Error fetching admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBanUser = async (userId, isBanned) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/admin/users/${userId}/ban`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ isBanned })
      });

      if (response.ok) {
        fetchData();
        alert(`User ${isBanned ? 'banned' : 'unbanned'} successfully!`);
      } else {
        alert('Failed to update user status');
      }
    } catch (error) {
      alert('Network error. Please try again.');
    }
  };

  const handleDeleteSwap = async (requestId) => {
    if (!confirm('Are you sure you want to delete this swap request?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/admin/swaps/${requestId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        fetchData();
        alert('Swap request deleted successfully!');
      } else {
        alert('Failed to delete swap request');
      }
    } catch (error) {
      alert('Network error. Please try again.');
    }
  };

  const exportData = async (type) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/admin/export/${type}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        
        // Create CSV content
        let csvContent = '';
        if (type === 'users') {
          csvContent = 'Name,Email,Location,Rating,Total Ratings,Skills Offered,Skills Wanted,Is Public,Is Banned,Created At\n';
          data.data.forEach(user => {
            csvContent += `"${user.name}","${user.email}","${user.location || ''}","${user.rating}","${user.totalRatings}","${user.skillsOffered?.join(';') || ''}","${user.skillsWanted?.join(';') || ''}","${user.isPublic}","${user.isBanned}","${user.createdAt}"\n`;
          });
        } else if (type === 'swaps') {
          csvContent = 'From User,To User,Message,Skills Offered,Skills Requested,Status,Created At\n';
          data.data.forEach(swap => {
            csvContent += `"${swap.fromUser?.name || ''}","${swap.toUser?.name || ''}","${swap.message}","${swap.skillsOffered?.join(';') || ''}","${swap.skillsRequested?.join(';') || ''}","${swap.status}","${swap.createdAt}"\n`;
          });
        }

        // Download CSV file
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${type}_export_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
        
        alert(`${type} data exported successfully!`);
      } else {
        alert('Failed to export data');
      }
    } catch (error) {
      alert('Network error. Please try again.');
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
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Admin Panel</h1>

      {/* Tabs */}
      <div className="flex space-x-1 mb-6 bg-gray-200 p-1 rounded-lg">
        {['users', 'swaps', 'stats'].map((tab) => (
          <button
            key={tab}
            onClick={() => {
              setActiveTab(tab);
              setCurrentPage(1);
            }}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium ${
              activeTab === tab
                ? 'bg-white text-gray-800 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Content */}
      {activeTab === 'users' && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">User Management</h2>
            <button
              onClick={() => exportData('users')}
              className="btn btn-secondary"
            >
              Export Users
            </button>
          </div>

          <div className="space-y-4">
            {users.map((user) => (
              <div key={user._id} className="card">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">{user.name}</h3>
                    <p className="text-sm text-gray-600">{user.email}</p>
                    {user.location && (
                      <p className="text-sm text-gray-600">{user.location}</p>
                    )}
                    <p className="text-sm text-gray-600">
                      Rating: {user.rating > 0 ? `${user.rating}/5` : 'No ratings'} 
                      ({user.totalRatings} ratings)
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleBanUser(user._id, !user.isBanned)}
                      className={`btn ${user.isBanned ? 'btn-success' : 'btn-danger'}`}
                    >
                      {user.isBanned ? 'Unban' : 'Ban'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'swaps' && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Swap Requests</h2>
            <button
              onClick={() => exportData('swaps')}
              className="btn btn-secondary"
            >
              Export Swaps
            </button>
          </div>

          <div className="space-y-4">
            {swapRequests.map((request) => (
              <div key={request._id} className="card">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      {request.fromUser?.name} → {request.toUser?.name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {new Date(request.createdAt).toLocaleDateString()}
                    </p>
                    <span className={`badge badge-${request.status}`}>
                      {request.status}
                    </span>
                  </div>
                  <button
                    onClick={() => handleDeleteSwap(request._id)}
                    className="btn btn-danger"
                  >
                    Delete
                  </button>
                </div>
                <p className="text-gray-800 mb-3">{request.message}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-600 mb-2">Skills Offered:</h4>
                    <div className="flex flex-wrap gap-1">
                      {request.skillsOffered?.map((skill, index) => (
                        <span key={index} className="text-xs bg-blue-100 px-2 py-1 rounded text-blue-700">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-600 mb-2">Skills Requested:</h4>
                    <div className="flex flex-wrap gap-1">
                      {request.skillsRequested?.map((skill, index) => (
                        <span key={index} className="text-xs bg-green-100 px-2 py-1 rounded text-green-700">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'stats' && (
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Platform Statistics</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Users</h3>
              <p className="text-3xl font-bold text-gray-800">{stats.totalUsers || 0}</p>
            </div>
            
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Ratings</h3>
              <p className="text-3xl font-bold text-gray-800">{stats.totalRatings || 0}</p>
            </div>
            
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Swaps</h3>
              <p className="text-3xl font-bold text-gray-800">
                {stats.swapStats?.reduce((sum, stat) => sum + stat.count, 0) || 0}
              </p>
            </div>
          </div>

          <div className="card">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Swap Status Breakdown</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {stats.swapStats?.map((stat) => (
                <div key={stat._id} className="text-center">
                  <div className="text-2xl font-bold text-gray-800">{stat.count}</div>
                  <div className="text-sm text-gray-600 capitalize">{stat._id}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6">
          <div className="flex space-x-1">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="btn btn-secondary"
            >
              Previous
            </button>
            <span className="px-4 py-2 text-gray-600">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="btn btn-secondary"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel; 