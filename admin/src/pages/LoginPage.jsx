import React, { useState } from 'react';
import { useAdminAuth } from '../context/AuthContext';
import { ArrowRight, Loader2, AlertCircle, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

/* ── Brand Logo (matching Navbar/Footer) ── */
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

export default function LoginPage() {
  const { login } = useAdminAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await login({ email, password });
    } catch (err) {
      setError(err?.message || 'Invalid credentials or server error.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAF9F6] text-slate-800 p-4 relative overflow-hidden py-12 selection:bg-brand-orange selection:text-white">
      {/* Floating Background Shapes */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-10 w-8 h-8 rounded-full bg-brand-orange/10 floating-slow-y" />
        <div className="absolute top-1/3 right-12 w-12 h-12 rounded-full bg-brand-green/10 floating-slow-x" />
        <div className="absolute top-10 right-1/4 text-brand-orange/20 floating-rotate">
          <Sparkles className="w-10 h-10" />
        </div>
      </div>
      
      <div className="w-full max-w-md space-y-8 relative z-10">
        
        {/* Brand */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-3 no-underline group">
            <BAIOLogo className="w-11 h-11" />
            <div className="text-left">
              <span className="font-heading font-extrabold text-2xl text-brand-navy block tracking-tight">BAIO</span>
              <p className="text-[9px] text-brand-orange tracking-widest font-extrabold uppercase leading-none mt-0.5">Bharat AI Olympiad</p>
            </div>
          </div>
          <div>
            <span className="brand-badge brand-badge-navy mb-2">
              Administration
            </span>
            <h1 className="font-heading font-extrabold text-3xl text-brand-navy leading-tight">Admin Portal</h1>
            <p className="text-slate-500 text-sm mt-1 max-w-xs mx-auto">Sign in to manage the BAIO competition platform.</p>
          </div>
        </div>

        {error && (
          <div className="p-4 bg-red-50 border-2 border-red-200 text-red-700 text-xs font-bold rounded-2xl flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* Card Form */}
        <form onSubmit={handleSubmit} className="bg-white border-4 border-brand-navy rounded-3xl p-8 edu-shadow-orange space-y-5">
          <div className="space-y-2">
            <label className="block text-sm font-bold text-brand-navy">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white border-2 border-slate-200 rounded-2xl px-4 py-3 text-sm text-slate-950 focus:outline-none focus:border-brand-navy placeholder:text-slate-300 font-semibold"
              placeholder="admin@baio.in"
            />
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-bold text-brand-navy">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white border-2 border-slate-200 rounded-2xl px-4 py-3 text-sm text-slate-950 focus:outline-none focus:border-brand-navy placeholder:text-slate-300 font-semibold"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full justify-center py-3.5 shadow-md text-sm disabled:opacity-60 cursor-pointer"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Secure Sign In'}
            {!loading && <ArrowRight className="w-4 h-4" />}
          </button>
        </form>
      </div>
    </div>
  );
}
