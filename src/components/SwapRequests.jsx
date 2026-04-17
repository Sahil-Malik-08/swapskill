import React, { useState, useEffect } from 'react';

const SwapRequests = ({ user }) => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [ratingForm, setRatingForm] = useState({
    rating: 5,
    feedback: ''
  });

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('https://swapskill-2-1p6q.onrender.com/api/swaps/my-requests', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setRequests(data.swapRequests);
      }
    } catch (error) {
      console.error('Error fetching requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (requestId, action) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('https://swapskill-2-1p6q.onrender.com/api/swaps/${action}/${requestId}', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        fetchRequests(); // Refresh the list
        alert(`Request ${action}ed successfully!`);
      } else {
        const data = await response.json();
        alert(data.message || `Failed to ${action} request`);
      }
    } catch {
      alert('Network error. Please try again.');
    }
  };

  const handleCancel = async (requestId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://swapskill-2-1p6q.onrender.com/api/swaps/cancel/${requestId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        fetchRequests();
        alert('Request cancelled successfully!');
      } else {
        const data = await response.json();
        alert(data.message || 'Failed to cancel request');
      }
    } catch {
      alert('Network error. Please try again.');
    }
  };

  const openRatingModal = (request) => {
    setSelectedRequest(request);
    setShowRatingModal(true);
  };

  const submitRating = async (e) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem('token');
      const otherUserId = selectedRequest.fromUser._id === user._id 
        ? selectedRequest.toUser._id 
        : selectedRequest.fromUser._id;

      const response = await fetch('https://swapskill-2-1p6q.onrender.com/api/ratings/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          swapRequestId: selectedRequest._id,
          toUserId: otherUserId,
          rating: ratingForm.rating,
          feedback: ratingForm.feedback
        })
      });

      const data = await response.json();

      if (response.ok) {
        setShowRatingModal(false);
        setSelectedRequest(null);
        setRatingForm({ rating: 5, feedback: '' });
        fetchRequests();
        alert('Rating submitted successfully!');
      } else {
        alert(data.message || 'Failed to submit rating');
      }
    } catch {
      alert('Network error. Please try again.');
    }
  };

  const filteredRequests = requests.filter(request => {
    if (activeTab === 'all') return true;
    return request.status === activeTab;
  });

  const getStatusBadge = (status) => {
    const statusClasses = {
      pending: 'badge-pending',
      accepted: 'badge-accepted',
      rejected: 'badge-rejected',
      completed: 'badge-completed',
      cancelled: 'badge-rejected'
    };
    return `badge ${statusClasses[status] || 'badge-pending'}`;
  };

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
        <span className="section-chip mb-3 border-white/20 bg-white/10 text-slate-100">Collaboration Pipeline</span>
        <h1 className="mb-2 text-3xl font-black tracking-tight">Swap Requests</h1>
        <p className="text-slate-200">Manage incoming and outgoing requests, then close the loop with ratings.</p>
      </div>

      <div className="flex flex-wrap gap-2 rounded-xl border border-slate-200 bg-white p-2 shadow-sm">
        {['all', 'pending', 'accepted', 'completed', 'rejected', 'cancelled'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`rounded-lg px-4 py-2 text-sm font-semibold ${
              activeTab === tab
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {filteredRequests.map((request) => (
          <div key={request._id} className="card">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  {request.fromUser._id === user._id 
                    ? `To: ${request.toUser.name}`
                    : `From: ${request.fromUser.name}`
                  }
                </h3>
                <p className="text-sm text-slate-500">
                  {new Date(request.createdAt).toLocaleDateString()}
                </p>
              </div>
              <span className={getStatusBadge(request.status)}>
                {request.status}
              </span>
            </div>

            <div className="mb-4">
              <p className="mb-3 text-slate-800">{request.message}</p>
              
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <h4 className="mb-2 text-sm font-medium text-slate-500">Skills Offered:</h4>
                  <div className="flex flex-wrap gap-1">
                    {request.skillsOffered.map((skill, index) => (
                      <span key={index} className="rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-700">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="mb-2 text-sm font-medium text-slate-500">Skills Requested:</h4>
                  <div className="flex flex-wrap gap-1">
                    {request.skillsRequested.map((skill, index) => (
                      <span key={index} className="rounded-full bg-green-100 px-2 py-1 text-xs text-green-700">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {request.status === 'pending' && request.toUser._id === user._id && (
                <>
                  <button
                    onClick={() => handleAction(request._id, 'accept')}
                    className="btn btn-success"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => handleAction(request._id, 'reject')}
                    className="btn btn-danger"
                  >
                    Reject
                  </button>
                </>
              )}

              {request.status === 'pending' && request.fromUser._id === user._id && (
                <button
                  onClick={() => handleCancel(request._id)}
                  className="btn btn-danger"
                >
                  Cancel
                </button>
              )}

              {request.status === 'accepted' && (
                <button
                  onClick={() => handleAction(request._id, 'complete')}
                  className="btn btn-primary"
                >
                  Mark as Completed
                </button>
              )}

              {request.status === 'completed' && (
                <button
                  onClick={() => openRatingModal(request)}
                  className="btn btn-secondary"
                >
                  Rate & Review
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredRequests.length === 0 && (
        <div className="card text-center py-8">
          <p className="text-slate-600">No {activeTab} requests found.</p>
        </div>
      )}

      {showRatingModal && selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white shadow-2xl">
            <div className="p-6">
              <h2 className="mb-4 text-xl font-bold text-slate-900">
                Rate Your Experience
              </h2>

              <form onSubmit={submitRating}>
                <div className="form-group">
                  <label className="form-label">Rating</label>
                  <select
                    value={ratingForm.rating}
                    onChange={(e) => setRatingForm({...ratingForm, rating: parseInt(e.target.value)})}
                    className="form-input"
                  >
                    <option value={5}>5 - Excellent</option>
                    <option value={4}>4 - Very Good</option>
                    <option value={3}>3 - Good</option>
                    <option value={2}>2 - Fair</option>
                    <option value={1}>1 - Poor</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Feedback (optional)</label>
                  <textarea
                    value={ratingForm.feedback}
                    onChange={(e) => setRatingForm({...ratingForm, feedback: e.target.value})}
                    className="form-input"
                    rows="3"
                    placeholder="Share your experience..."
                  />
                </div>

                <div className="flex gap-2 mt-6">
                  <button
                    type="submit"
                    className="btn btn-primary flex-1"
                  >
                    Submit Rating
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowRatingModal(false)}
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

export default SwapRequests; 
