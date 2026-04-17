import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSkill, setSelectedSkill] = useState('');

  useEffect(() => {
    fetchPublicUsers();
  }, [searchTerm, selectedSkill]);

  const fetchPublicUsers = async () => {
    try {
      let url = 'http://localhost:5000/api/public/users/discover';
      const params = new URLSearchParams();
      
      if (searchTerm) params.append('search', searchTerm);
      if (selectedSkill) params.append('skill', selectedSkill);
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      const response = await fetch(url);
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-transparent">
      <header className="sticky top-0 z-30 border-b border-slate-200/70 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <h1 className="text-2xl font-black tracking-tight text-slate-900">
            Skill<span className="text-slate-500">Swap</span>
          </h1>
          <div className="flex items-center gap-3">
            <Link to="/login" className="btn btn-secondary">Sign In</Link>
            <Link to="/register" className="btn btn-primary">Create Account</Link>
          </div>
        </div>
      </header>

      <section className="mx-auto mt-8 max-w-7xl px-4">
        <div className="card overflow-hidden border-slate-200 bg-white">
          <div className="grid grid-cols-1 items-center gap-10 p-6 md:grid-cols-2 md:p-10">
            <div>
              <p className="mb-4 inline-flex rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                Learn by exchanging
              </p>
              <h2 className="mb-4 max-w-xl text-4xl font-extrabold leading-tight text-slate-900 md:text-5xl">
                Build skills together, one swap at a time.
              </h2>
              <p className="mb-8 max-w-xl text-base text-slate-600 md:text-lg">
                Meet people who can teach what you want to learn, and share your strengths in return. No fees, just meaningful learning collaborations.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link to="/register" className="btn btn-primary">Start Swapping</Link>
                <Link to="/login" className="btn btn-secondary">I have an account</Link>
              </div>
              <div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-slate-500">
                <span className="rounded-full border border-slate-200 px-3 py-1">1:1 skill exchange</span>
                <span className="rounded-full border border-slate-200 px-3 py-1">Community ratings</span>
                <span className="rounded-full border border-slate-200 px-3 py-1">No subscription fee</span>
              </div>
            </div>
            <div>
              <div className="hero-media">
                <img
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&crop=faces&w=1800&q=90"
                  alt="People collaborating and learning skills"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10">
        <div className="mx-auto max-w-4xl">
          <h3 className="mb-5 text-center text-2xl font-bold text-slate-900">
            Explore members before you sign up
          </h3>

          <div className="card mb-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="form-label">Search by name or skill</label>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="form-input"
                  placeholder="Try: JavaScript mentor, UI design..."
                />
              </div>
              <div>
                <label className="form-label">Filter by skill</label>
                <input
                  type="text"
                  value={selectedSkill}
                  onChange={(e) => setSelectedSkill(e.target.value)}
                  className="form-input"
                  placeholder="e.g., Figma, Python, Public speaking"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {users.map((user) => (
              <div key={user._id} className="card">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">{user.name}</h3>
                    {user.location && (
                      <p className="text-sm text-slate-500">{user.location}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-slate-500">Rating</div>
                    <div className="font-semibold text-slate-800">
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
                  <h4 className="mb-2 text-sm font-medium text-slate-500">Offers</h4>
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
                  <h4 className="mb-2 text-sm font-medium text-slate-500">Wants to learn</h4>
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

                <div className="text-center">
                  <Link
                    to="/login"
                    className="btn btn-primary w-full"
                  >
                    Sign In to Send Request
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {users.length === 0 && !loading && (
            <div className="text-center py-8">
              <p className="text-slate-600">No users found matching your criteria.</p>
            </div>
          )}
      </section>

      <section className="border-y border-slate-200/70 bg-white/60 py-12">
        <div className="mx-auto max-w-7xl px-4">
          <h3 className="mb-8 text-center text-3xl font-bold text-slate-900">
            How It Works
          </h3>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="card text-center">
              <img
                src="https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&crop=faces&w=1400&q=90"
                alt="Create profile"
                className="feature-media"
              />
              <div className="mb-4 text-4xl font-black text-slate-300">1</div>
              <h4 className="mb-2 text-xl font-semibold text-slate-900">Create Profile</h4>
              <p className="text-slate-600">
                Sign up and add the skills you can teach and the skills you want to learn.
              </p>
            </div>
            <div className="card text-center">
              <img
                src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&crop=faces&w=1400&q=90"
                alt="Find matches"
                className="feature-media"
              />
              <div className="mb-4 text-4xl font-black text-slate-300">2</div>
              <h4 className="mb-2 text-xl font-semibold text-slate-900">Find Matches</h4>
              <p className="text-slate-600">
                Browse other users and find people with complementary skills.
              </p>
            </div>
            <div className="card text-center">
              <img
                src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&crop=faces&w=1400&q=90"
                alt="Start swapping"
                className="feature-media"
              />
              <div className="mb-4 text-4xl font-black text-slate-300">3</div>
              <h4 className="mb-2 text-xl font-semibold text-slate-900">Start Swapping</h4>
              <p className="text-slate-600">
                Send swap requests and start learning from each other.
              </p>
            </div>
          </div>
        </div>
      </section>

      <footer className="py-8">
        <div className="mx-auto max-w-7xl px-4 text-center">
          <p className="text-slate-500">
            Skill Swap Platform - designed for collaborative learning.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage; 