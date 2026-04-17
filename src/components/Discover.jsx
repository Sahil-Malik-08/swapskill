import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Discover = ({ user }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSkill, setSelectedSkill] = useState('');
  const [showSwapModal, setShowSwapModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [swapForm, setSwapForm] = useState({
    message: '',
    skillsOffered: [],
    skillsRequested: []
  });

  useEffect(() => {
    fetchUsers();
  }, [searchTerm, selectedSkill]);

  const fetchUsers = async () => {
    if (!user) {
      setUsers([]);
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      let url = 'http://localhost:5000/api/users/discover';
      const params = new URLSearchParams();
      
      if (searchTerm) params.append('search', searchTerm);
      if (selectedSkill) params.append('skill', selectedSkill);
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setUsers(data.users);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSwapRequest = async (e) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/swaps/request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          toUserId: selectedUser._id,
          message: swapForm.message,
          skillsOffered: swapForm.skillsOffered,
          skillsRequested: swapForm.skillsRequested
        })
      });

      const data = await response.json();

      if (response.ok) {
        setShowSwapModal(false);
        setSelectedUser(null);
        setSwapForm({
          message: '',
          skillsOffered: [],
          skillsRequested: []
        });
        alert('Swap request sent successfully!');
      } else {
        alert(data.message || 'Failed to send swap request');
      }
    } catch {
      alert('Network error. Please try again.');
    }
  };

  const openSwapModal = (user) => {
    setSelectedUser(user);
    setShowSwapModal(true);
  };

  const addSkillToForm = (skill, type) => {
    setSwapForm(prev => ({
      ...prev,
      [type]: [...prev[type], skill]
    }));
  };

  const removeSkillFromForm = (skill, type) => {
    setSwapForm(prev => ({
      ...prev,
      [type]: prev[type].filter(s => s !== skill)
    }));
  };

  if (!user) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-transparent">
        <div className="w-full max-w-md">
          <div className="card text-center">
            <h2 className="mb-4 text-2xl font-black text-slate-900">
              Sign In Required
            </h2>
            <p className="mb-6 text-slate-600">
              You need to be signed in to discover and connect with other users.
            </p>
            <div className="space-y-3">
              <Link to="/login" className="btn btn-primary w-full">
                Sign In
              </Link>
              <Link to="/register" className="btn btn-secondary w-full">
                Create Account
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="hero-shell card border-slate-300/40 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white">
        <span className="section-chip mb-3 border-white/20 bg-white/10 text-slate-100">Smart Matching</span>
        <h1 className="mb-2 text-3xl font-black tracking-tight">Discover Skills</h1>
        <p className="text-slate-200">Find people with skills you want and send thoughtful swap requests.</p>
      </div>

      <div className="card mb-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="form-label">Search by name or skill</label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-input"
              placeholder="Search users..."
            />
          </div>
          <div>
            <label className="form-label">Filter by specific skill</label>
            <input
              type="text"
              value={selectedSkill}
              onChange={(e) => setSelectedSkill(e.target.value)}
              className="form-input"
              placeholder="e.g., JavaScript, UI Design"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {users.map((user) => (
          <div key={user._id} className="card">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <img
                  src={`https://api.dicebear.com/9.x/thumbs/svg?seed=${encodeURIComponent(user.name)}`}
                  alt={user.name}
                  className="h-11 w-11 rounded-full border border-slate-200 bg-white p-1"
                />
                <div>
                <h3 className="text-lg font-bold text-slate-900">{user.name}</h3>
                {user.location && (
                  <p className="text-sm text-slate-500">{user.location}</p>
                )}
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs uppercase tracking-wide text-slate-500">Rating</div>
                <div className="font-bold text-slate-900">
                  {user.rating > 0 ? `${user.rating}/5` : 'No ratings'}
                </div>
              </div>
            </div>

            {user.availability && (
              <div className="mb-3">
                <span className="text-sm font-medium text-slate-500">Availability: </span>
                <span className="text-sm text-slate-800">{user.availability}</span>
              </div>
            )}

            <div className="mb-4">
              <h4 className="text-sm font-medium text-slate-500 mb-2">Skills Offered</h4>
              <div className="flex flex-wrap gap-1">
                {user.skillsOffered?.slice(0, 3).map((skill, index) => (
                  <span key={index} className="rounded-full border border-slate-200 bg-slate-100 px-2 py-1 text-xs text-slate-700">
                    {skill}
                  </span>
                ))}
                {user.skillsOffered?.length > 3 && (
                  <span className="text-xs text-slate-500">+{user.skillsOffered.length - 3} more</span>
                )}
              </div>
            </div>

            <div className="mb-4">
              <h4 className="text-sm font-medium text-slate-500 mb-2">Skills Wanted</h4>
              <div className="flex flex-wrap gap-1">
                {user.skillsWanted?.slice(0, 3).map((skill, index) => (
                  <span key={index} className="rounded-full border border-slate-200 bg-white px-2 py-1 text-xs text-slate-700">
                    {skill}
                  </span>
                ))}
                {user.skillsWanted?.length > 3 && (
                  <span className="text-xs text-slate-500">+{user.skillsWanted.length - 3} more</span>
                )}
              </div>
            </div>

            <button
              onClick={() => openSwapModal(user)}
              className="btn btn-primary w-full"
            >
              Send Swap Request
            </button>
          </div>
        ))}
      </div>

      {users.length === 0 && !loading && (
        <div className="card text-center py-8">
          <p className="text-slate-600">No users found matching your criteria.</p>
        </div>
      )}

      {showSwapModal && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
          <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-2xl">
            <div className="p-6">
              <h2 className="mb-4 text-xl font-bold text-slate-900">
                Send Swap Request to {selectedUser.name}
              </h2>

              <form onSubmit={handleSwapRequest}>
                <div className="form-group">
                  <label className="form-label">Message</label>
                  <textarea
                    value={swapForm.message}
                    onChange={(e) => setSwapForm({...swapForm, message: e.target.value})}
                    className="form-input"
                    rows="3"
                    placeholder="Introduce yourself and explain what you'd like to swap..."
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Skills You're Offering</label>
                  <div className="mb-2 flex flex-wrap gap-2">
                    {user.skillsOffered?.map((skill) => (
                      <button
                        key={skill}
                        type="button"
                        onClick={() => addSkillToForm(skill, 'skillsOffered')}
                        className={`rounded-full border px-2 py-1 text-xs ${
                          swapForm.skillsOffered.includes(skill)
                            ? 'border-slate-300 bg-slate-800 text-white'
                            : 'border-slate-200 bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        {skill}
                      </button>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {swapForm.skillsOffered.map((skill) => (
                      <span key={skill} className="rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-700">
                        {skill}
                        <button
                          type="button"
                          onClick={() => removeSkillFromForm(skill, 'skillsOffered')}
                          className="ml-1 text-blue-500 hover:text-blue-700"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Skills You Want</label>
                  <div className="mb-2 flex flex-wrap gap-2">
                    {selectedUser.skillsOffered?.map((skill) => (
                      <button
                        key={skill}
                        type="button"
                        onClick={() => addSkillToForm(skill, 'skillsRequested')}
                        className={`rounded-full border px-2 py-1 text-xs ${
                          swapForm.skillsRequested.includes(skill)
                            ? 'border-slate-300 bg-slate-800 text-white'
                            : 'border-slate-200 bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        {skill}
                      </button>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {swapForm.skillsRequested.map((skill) => (
                      <span key={skill} className="rounded-full bg-green-100 px-2 py-1 text-xs text-green-700">
                        {skill}
                        <button
                          type="button"
                          onClick={() => removeSkillFromForm(skill, 'skillsRequested')}
                          className="ml-1 text-green-500 hover:text-green-700"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-6 flex gap-2">
                  <button
                    type="submit"
                    className="btn btn-primary flex-1"
                  >
                    Send Request
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowSwapModal(false)}
                    className="btn btn-secondary flex-1"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Discover; 