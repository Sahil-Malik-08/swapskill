import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = ({ user, logout }) => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="sticky top-0 z-40 border-b border-slate-200/70 bg-transparent backdrop-blur">
      <div className="mx-auto max-w-7xl px-4">
        <div className="glass-nav mt-2 flex min-h-16 flex-wrap items-center justify-between gap-3 rounded-2xl px-3 py-2">
          <div className="flex items-center">
            <Link to="/dashboard" className="text-xl font-black tracking-tight text-slate-900">
              Skill<span className="text-slate-500">Swap</span>
            </Link>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Link
              to="/dashboard"
              className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${
                isActive('/dashboard')
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              Dashboard
            </Link>

            <Link
              to="/discover"
              className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${
                isActive('/discover')
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              Discover
            </Link>

            <Link
              to="/requests"
              className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${
                isActive('/requests')
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              Requests
            </Link>

            <Link
              to="/chat"
              className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${
                isActive('/chat')
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              Chat
            </Link>

            <Link
              to="/profile"
              className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${
                isActive('/profile')
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              Profile
            </Link>

            {user.isAdmin && (
              <Link
                to="/admin"
                className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${
                  isActive('/admin')
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                Admin
              </Link>
            )}

            <div className="ml-1 flex items-center gap-2 rounded-full border border-slate-200 bg-white/90 px-2 py-1 shadow-sm">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500"></span>
              <span className="max-w-28 truncate text-sm font-medium text-slate-700">{user.name}</span>
              <button
                onClick={logout}
                className="btn btn-secondary text-sm"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 