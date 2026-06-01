import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn, Loader2, AlertCircle } from 'lucide-react';

export default function StudentLoginPage() {
  const { loginStudent } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handle = (e) => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true); setError(null);
    try {
      await loginStudent(form);
      navigate('/');
    } catch (err) {
      setError(err?.message || 'Invalid credentials.');
    } finally { setLoading(false); }
  };

  return (
    <div className="max-w-md mx-auto my-16 px-4">
      <div className="glass-card p-8 rounded-2xl border border-white/5 space-y-6">
        <div className="text-center space-y-1">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-brand-orange/10 border border-brand-orange/20 mb-2">
            <LogIn className="w-6 h-6 text-brand-orange" />
          </div>
          <h1 className="font-heading font-extrabold text-2xl text-white">Student Login</h1>
          <p className="text-slate-400 text-sm">Sign in to your student portal</p>
        </div>

        {error && (
          <div className="flex items-start gap-3 bg-red-500/10 border border-red-500/20 p-3 rounded-xl">
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <p className="text-sm text-red-300">{error}</p>
          </div>
        )}

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-400 mb-1 uppercase tracking-wider">Email</label>
            <input name="email" type="email" required value={form.email} onChange={handle}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-brand-orange transition-all"
              placeholder="you@school.edu.in" />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-400 mb-1 uppercase tracking-wider">Password</label>
            <input name="password" type="password" required value={form.password} onChange={handle}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-brand-orange transition-all"
              placeholder="••••••••" />
          </div>
          <button type="submit" disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-brand-orange to-amber-600 text-white font-bold py-3 rounded-xl transition-all disabled:opacity-50">
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-xs text-slate-500">
          New student?{' '}
          <Link to="/student/register" className="text-brand-orange hover:underline font-semibold">Register here</Link>
        </p>
        <p className="text-center text-xs text-slate-500">
          School portal?{' '}
          <Link to="/school/login" className="text-brand-green hover:underline font-semibold">School Login</Link>
        </p>
      </div>
    </div>
  );
}
