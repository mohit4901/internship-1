import React, { useState, useEffect } from 'react';
import { NavLink, Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Home, Info, Trophy, School, HelpCircle, Mail, LogOut, BookOpen
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

function BAIOLogo({ className = '' }) {
  return (
    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <circle cx="20" cy="20" r="17" stroke="#FF8C00" strokeWidth="2.5" />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
        const rad = (angle * Math.PI) / 180;
        const x1 = 20 + 15 * Math.cos(rad);
        const y1 = 20 + 15 * Math.sin(rad);
        const x2 = 20 + 19 * Math.cos(rad);
        const y2 = 20 + 19 * Math.sin(rad);
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#FF8C00" strokeWidth="3" strokeLinecap="round" />;
      })}
      <circle cx="20" cy="20" r="10" fill="#001F5E" />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
        const rad = (angle * Math.PI) / 180;
        const x2 = 20 + 8 * Math.cos(rad);
        const y2 = 20 + 8 * Math.sin(rad);
        return <line key={i} x1="20" y1="20" x2={x2} y2={y2} stroke="#FF8C00" strokeWidth="1.2" strokeLinecap="round" />;
      })}
      <circle cx="20" cy="20" r="2.5" fill="#FF8C00" />
    </svg>
  );
}

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const navLinks = [
    { to: '/olympiads',   label: 'Olympiads',     icon: Trophy },
    { to: '/olympiad',    label: 'Syllabus',      icon: BookOpen },
    { to: '/schools',     label: 'For Schools',   icon: School },
    { to: '/faqs',        label: 'FAQs',          icon: HelpCircle },
  ];

  return (
    <>
      {/* ─── DESKTOP FLOATING BAR ────────────────────────────────────── */}
      <div className="hidden md:block fixed top-6 left-1/2 -translate-x-1/2 z-50 pointer-events-none w-full max-w-5xl px-6">
        <div className="flex items-center justify-between bg-white/95 border border-slate-200/80 backdrop-blur-md py-2.5 px-6 rounded-full shadow-lg pointer-events-auto">
          
          {/* Logo Section */}
          <Link to="/" className="flex items-center gap-2 no-underline shrink-0 group">
            <BAIOLogo className="w-7 h-7" />
            <div className="flex items-baseline">
              <span className="font-extrabold text-[#001F5E] text-lg tracking-tight">
                BAIO
              </span>
              <span className="text-[#FF8C00] text-lg font-bold ml-0.5">•</span>
            </div>
          </Link>

          {/* Desktop Links with Framer Motion Lamp glow */}
          <nav className="flex items-center gap-3">
            {navLinks.map((item) => {
              const isActive = location.pathname === item.to;

              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`relative cursor-pointer text-xs font-bold px-4 py-2 rounded-full transition-colors duration-200 ${
                    isActive ? 'text-[#FF8C00]' : 'text-slate-600 hover:text-[#001F5E]'
                  }`}
                >
                  <span className="relative z-10">{item.label}</span>
                  {isActive && (
                    <motion.div
                      layoutId="lamp"
                      className="absolute inset-0 w-full bg-[#FF8C00]/5 rounded-full z-0"
                      initial={false}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 30,
                      }}
                    >
                      <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-[#FF8C00] rounded-t-full">
                        <div className="absolute w-8 h-4 bg-[#FF8C00]/30 rounded-full blur-sm -top-1.5 -left-1" />
                        <div className="absolute w-6 h-4 bg-[#FF8C00]/20 rounded-full blur-xs -top-1" />
                      </div>
                    </motion.div>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Auth / Register CTAs */}
          <div className="flex items-center gap-4 shrink-0">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <Link
                  to="/school/dashboard"
                  className="text-xs font-bold text-[#001F5E] hover:text-[#FF8C00] transition-colors"
                >
                  Hi, <span className="font-extrabold">{user?.name || 'School'}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="bg-slate-100 hover:bg-red-50 text-slate-700 hover:text-red-600 px-4 py-1.5 rounded-full text-xs font-extrabold transition-colors cursor-pointer border-0 shadow-sm"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link
                  to="/school/login"
                  className="text-xs font-bold text-slate-600 hover:text-[#001F5E] transition-colors"
                >
                  School Login
                </Link>
                <Link
                  to="/register"
                  className="bg-[#FF8C00] hover:bg-[#e07c00] text-white text-xs font-extrabold px-4 py-2 rounded-full transition-colors shadow-sm"
                >
                  Register School
                </Link>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* ─── MOBILE TOP HEADER ───────────────────────────────────────── */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-white/95 border-b border-slate-100 backdrop-blur-md px-6 py-3.5 flex items-center justify-between shadow-sm">
        <Link to="/" className="flex items-center gap-2 no-underline">
          <BAIOLogo className="w-7 h-7" />
          <span className="font-extrabold text-[#001F5E] text-lg tracking-tight">BAIO</span>
        </Link>
        
        <div className="flex items-center gap-2">
          {isAuthenticated ? (
            <Link
              to="/school/dashboard"
              className="bg-[#001F5E] text-white text-xs font-extrabold px-4 py-2 rounded-full shadow-sm"
            >
              Dashboard
            </Link>
          ) : (
            <Link
              to="/register"
              className="bg-[#FF8C00] hover:bg-[#e07c00] text-white text-xs font-extrabold px-4 py-2 rounded-full shadow-sm"
            >
              Register
            </Link>
          )}
        </div>
      </div>

      {/* ─── MOBILE BOTTOM FLOATING BAR ──────────────────────────────── */}
      <div className="md:hidden fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-[92%] max-w-md pointer-events-none">
        <div className="flex items-center justify-around bg-white/95 border border-slate-200/80 backdrop-blur-md py-2.5 px-2 rounded-full shadow-lg pointer-events-auto">
          {navLinks.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.to;

            return (
              <Link
                key={item.to}
                to={item.to}
                className={`relative cursor-pointer p-2 rounded-full transition-colors ${
                  isActive ? 'text-[#FF8C00]' : 'text-slate-500 hover:text-[#001F5E]'
                }`}
              >
                <Icon size={20} strokeWidth={2.5} className="relative z-10" />
                {isActive && (
                  <motion.div
                    layoutId="lamp-mobile"
                    className="absolute inset-0 w-full bg-[#FF8C00]/5 rounded-full z-0"
                    initial={false}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 30,
                    }}
                  >
                    <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-[#FF8C00] rounded-t-full">
                      <div className="absolute w-8 h-4 bg-[#FF8C00]/30 rounded-full blur-sm -top-1.5 -left-1" />
                    </div>
                  </motion.div>
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}
