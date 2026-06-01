import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { School, Loader2, AlertCircle } from 'lucide-react';

export default function SchoolLoginPage() {
  const { loginSchool } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ contactEmail: '', affiliationNumber: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handle = (e) => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true); setError(null);
    try {
      await loginSchool(form);
      navigate('/');
    } catch (err) {
      setError(err?.message || 'Invalid credentials.');
    } finally { setLoading(false); }
  };

  return (
    <div className="max-w-md mx-auto my-16 px-4">
      <div className="glass-card p-8 rounded-2xl border border-white/5 space-y-6">
        <div className="text-center space-y-1">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-brand-green/10 border border-brand-green/20 mb-2">
            <School className="w-6 h-6 text-brand-green" />
          </div>
          <h1 className="font-heading font-extrabold text-2xl text-white">School Login</h1>
          <p className="text-slate-400 text-sm">Institutional coordinator access</p>
        </div>

        {error && (
          <div className="flex items-start gap-3 bg-red-500/10 border border-red-500/20 p-3 rounded-xl">
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <p className="text-sm text-red-300">{error}</p>
          </div>
        )}

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-400 mb-1 uppercase tracking-wider">Coordinator Email</label>
            <input name="contactEmail" type="email" required value={form.contactEmail} onChange={handle}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-brand-green transition-all"
              placeholder="coordinator@school.edu.in" />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-400 mb-1 uppercase tracking-wider">Affiliation Number</label>
            <input name="affiliationNumber" type="text" required value={form.affiliationNumber} onChange={handle}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-brand-green transition-all"
              placeholder="e.g. CBSE12345" />
          </div>
          <button type="submit" disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-brand-green to-emerald-600 text-white font-bold py-3 rounded-xl transition-all disabled:opacity-50">
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Sign In as School'}
          </button>
        </form>

        <p className="text-center text-xs text-slate-550">
          New school coordinator?{' '}
          <Link to="/school/register" className="text-brand-green hover:underline font-semibold">Register School here</Link>
        </p>
        <p className="text-center text-xs text-slate-550">
          Student portal?{' '}
          <Link to="/student/login" className="text-brand-orange hover:underline font-semibold">Student Login</Link>
        </p>
      </div>
    </div>
  );
}
