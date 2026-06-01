import React, { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { Trophy, Menu, X, LogOut, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { to: '/',          label: 'Home'      },
    { to: '/olympiads', label: 'Olympiads' },
    { to: '/results',   label: 'Results'   },
    { to: '/about',     label: 'About'     },
    { to: '/contact',   label: 'Contact'   },
  ];

  const handleLogout = async () => {
    await logout();
    setMobileOpen(false);
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200 px-6 py-4 transition-all duration-300">
      <div className="max-w-5xl mx-auto flex items-center justify-between">

        {/* ── Brand ── */}
        <Link to="/" className="flex items-center gap-2.5 no-underline group">
          <div className="w-9 h-9 rounded-xl bg-slate-900 flex items-center justify-center group-hover:bg-brand-orange transition-colors duration-300">
            <Trophy className="w-4.5 h-4.5 text-white" />
          </div>
          <div>
            <span className="font-heading font-extrabold text-lg tracking-tight text-slate-900">
              BAIO
            </span>
            <p className="text-[9px] text-slate-400 tracking-widest font-semibold uppercase leading-none">
              Bharat AI Olympiad
            </p>
          </div>
        </Link>

        {/* ── Desktop Nav ── */}
        <nav className="hidden md:flex items-center gap-0.5">
          {navLinks.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-slate-100 text-slate-900 font-semibold'
                    : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>

        {/* ── Auth Buttons ── */}
        <div className="hidden md:flex items-center gap-3">
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-500">
                Hi, <span className="text-slate-800 font-semibold">{user?.name || 'User'}</span>
              </span>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 bg-slate-100 hover:bg-red-50 hover:text-red-600 border border-slate-200 hover:border-red-200 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-slate-600 transition-all duration-200 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/student/login"
                className="text-slate-500 hover:text-slate-900 text-sm font-medium transition-colors px-4 py-2 rounded-lg hover:bg-slate-50"
              >
                Login
              </Link>
              <Link
                to="/student/login"
                className="bg-slate-900 hover:bg-brand-orange text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors duration-200 flex items-center gap-1.5"
              >
                Register <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}
        </div>

        {/* ── Mobile Hamburger ── */}
        <button
          className="md:hidden text-slate-500 hover:text-slate-900 p-1.5 rounded-lg hover:bg-slate-100 border border-slate-200 transition-colors"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* ── Mobile Drawer ── */}
      {mobileOpen && (
        <div className="md:hidden absolute top-[73px] left-0 right-0 bg-white border-b border-slate-200 px-6 py-5 space-y-4 shadow-sm z-50">
          <nav className="flex flex-col gap-1">
            {navLinks.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `block px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-slate-100 text-slate-900 font-semibold'
                      : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>

          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            {isAuthenticated ? (
              <div className="space-y-3">
                <p className="text-xs text-slate-500 px-4">
                  Hi, <span className="text-slate-800 font-semibold">{user?.name || 'User'}</span>
                </p>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 bg-red-50 text-red-600 border border-red-200 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer hover:bg-red-100"
                >
                  <LogOut className="w-4 h-4" /> Logout
                </button>
              </div>
            ) : (
              <>
                <Link
                  to="/student/login"
                  onClick={() => setMobileOpen(false)}
                  className="w-full text-center text-sm text-slate-600 hover:text-slate-900 py-2.5 border border-slate-200 hover:border-slate-300 rounded-xl transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/student/login"
                  onClick={() => setMobileOpen(false)}
                  className="w-full text-center bg-slate-900 hover:bg-brand-orange text-white py-2.5 rounded-xl text-sm font-bold transition-colors duration-200"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
