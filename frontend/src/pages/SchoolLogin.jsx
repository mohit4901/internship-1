import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArrowRight, Sparkles, Building2 } from 'lucide-react';
import logoImg from '../assets/logo.jpg';

/* ── Brand Logo (matching Navbar/Footer) ── */
function BAIOLogo({ className = '' }) {
  return (
    <img 
      src={logoImg} 
      alt="BAIO Logo" 
      className={`${className} object-contain mix-blend-multiply`} 
    />
  );
}

export default function SchoolLoginPage() {
  const { loginSchool } = useAuth();
  const navigate        = useNavigate();
  const [form, setForm] = useState({ contactEmail: '', affiliationNumber: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  const set = (field, value) => setForm((f) => ({ ...f, [field]: value }));

  const submit = async (e) => {
    e.preventDefault();
    if (!form.contactEmail.trim() || !form.affiliationNumber.trim()) {
      setError('Both fields are required.'); return;
    }
    setLoading(true); setError('');
    try {
      await loginSchool(form);
      navigate('/school/dashboard');
    } catch (err) {
      setError(err?.response?.data?.message || 'Invalid email or affiliation number. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-cream flex items-center justify-center px-4 relative overflow-hidden py-12 selection:bg-brand-orange selection:text-white">
      
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
          <Link to="/" className="inline-flex items-center no-underline group justify-center">
            <BAIOLogo className="h-12 md:h-14 w-auto" />
          </Link>
          <div>
            <span className="brand-badge brand-badge-orange mb-2">
              School Portal
            </span>
            <h1 className="font-heading font-extrabold text-3xl text-brand-navy leading-tight">School Login</h1>
            <p className="text-slate-500 text-sm mt-1 max-w-xs mx-auto">
              Enter your school's contact email and CBSE affiliation number.
            </p>
          </div>
        </div>

        {/* Main Card */}
        <div className="bg-white border-4 border-brand-navy rounded-3xl p-8 edu-shadow-orange space-y-5">
          <form onSubmit={submit} className="space-y-5">
            
            <div className="space-y-2">
              <label className="block text-sm font-bold text-brand-navy">
                Contact Email <span className="text-brand-orange">*</span>
              </label>
              <input
                type="email"
                placeholder="school@yourinstitution.edu.in"
                value={form.contactEmail}
                onChange={(e) => set('contactEmail', e.target.value)}
                className="w-full bg-white border-2 border-slate-200 rounded-2xl px-4 py-3 text-sm text-slate-950 focus:outline-none focus:border-brand-navy placeholder:text-slate-300 font-semibold"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-bold text-brand-navy">
                Affiliation Number <span className="text-brand-orange">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. 2730101"
                value={form.affiliationNumber}
                onChange={(e) => set('affiliationNumber', e.target.value)}
                className="w-full bg-white border-2 border-slate-200 rounded-2xl px-4 py-3 text-sm text-slate-950 focus:outline-none focus:border-brand-navy placeholder:text-slate-300 font-semibold"
                required
              />
              <p className="text-[10px] text-slate-400 font-medium">Your CBSE / board affiliation number used during registration.</p>
            </div>

            {error && (
              <div className="bg-red-50 border-2 border-red-200 text-red-700 text-xs font-bold px-4 py-3 rounded-2xl">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full justify-center py-3.5 shadow-md text-sm disabled:opacity-60 cursor-pointer"
            >
              {loading ? 'Signing in…' : 'Sign In to Dashboard'}
              {!loading && <ArrowRight className="w-4 h-4" />}
            </button>
          </form>

          <div className="text-center pt-3.5 border-t-2 border-slate-100">
            <p className="text-xs text-slate-500 font-semibold">
              Not registered yet?{' '}
              <Link to="/register" className="text-brand-orange hover:text-[#e07c00] font-bold hover:underline">
                Register your school
              </Link>
            </p>
          </div>
        </div>

        <p className="text-center text-xs text-slate-400 font-medium">
          Having trouble signing in? Email{' '}
          <a href="mailto:schools@baio.in" className="text-brand-orange font-bold hover:underline">schools@baio.in</a>
        </p>
      </div>
    </div>
  );
}
