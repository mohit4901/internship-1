import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { School, Loader2, AlertCircle } from 'lucide-react';

export default function SchoolRegisterPage() {
  const { registerSchool } = useAuth();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const [form, setForm] = useState({
    name: '',
    affiliationNumber: '',
    board: 'CBSE',
    contactEmail: '',
    contactPhone: '',
    principalName: '',
    address: {
      street: '',
      city: '',
      state: '',
      zip: '',
      country: 'India'
    },
    coordinator: {
      name: '',
      phone: '',
      email: ''
    }
  });

  const handle = (e) => {
    const { name, value } = e.target;
    setForm(p => ({ ...p, [name]: value }));
  };

  const handleNested = (field, e) => {
    const { name, value } = e.target;
    setForm(p => ({
      ...p,
      [field]: {
        ...p[field],
        [name]: value
      }
    }));
  };

  const submit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      await registerSchool(form);
      navigate('/school/login');
    } catch (err) {
      if (err?.errors && Array.isArray(err.errors) && err.errors.length > 0) {
        const detailMsg = err.errors.map(e => `• ${e.field}: ${e.message}`).join('\n');
        setError(`School registration failed:\n${detailMsg}`);
      } else {
        setError(err?.message || 'School registration failed. Check values and try again.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto my-12 px-4">
      <div className="glass-card p-8 rounded-3xl border border-white/5 space-y-6">
        <div className="text-center space-y-1">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-brand-green/10 border border-brand-green/20 mb-2">
            <School className="w-6 h-6 text-brand-green" />
          </div>
          <h1 className="font-heading font-extrabold text-2xl text-white">School Registration</h1>
          <p className="text-slate-400 text-sm">Register your institution as a BAIO coordinate hub</p>
        </div>

        {error && (
          <div className="flex items-start gap-3 bg-red-500/10 border border-red-500/20 p-3.5 rounded-xl">
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <p className="text-xs text-red-300 whitespace-pre-wrap">{error}</p>
          </div>
        )}

        <form onSubmit={submit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Institution Info */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-brand-green uppercase tracking-wider border-b border-slate-900 pb-1">
                Institution Info
              </h3>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 mb-1 uppercase tracking-wider">School / Institution Name</label>
                <input name="name" type="text" required value={form.name} onChange={handle}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-brand-green"
                  placeholder="e.g. Rohtak Public School" />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 mb-1 uppercase tracking-wider">Affiliation / Board Number</label>
                <input name="affiliationNumber" type="text" required value={form.affiliationNumber} onChange={handle}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-brand-green"
                  placeholder="e.g. CBSE123456" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 mb-1 uppercase tracking-wider">Board</label>
                  <select name="board" required value={form.board} onChange={handle}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-brand-green">
                    {['CBSE', 'ICSE', 'State Board', 'IB', 'Cambridge'].map(b => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 mb-1 uppercase tracking-wider">Principal Name</label>
                  <input name="principalName" type="text" value={form.principalName} onChange={handle}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-brand-green"
                    placeholder="e.g. Dr. Ramesh Roy" />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 mb-1 uppercase tracking-wider">School Contact Email</label>
                <input name="contactEmail" type="email" required value={form.contactEmail} onChange={handle}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-brand-green"
                  placeholder="info@school.edu.in" />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 mb-1 uppercase tracking-wider">School Phone</label>
                <input name="contactPhone" type="tel" required value={form.contactPhone} onChange={handle}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-brand-green"
                  placeholder="e.g. 9876543210 (10 digit)" />
              </div>
            </div>

            {/* Address & Coordinator */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-brand-green uppercase tracking-wider border-b border-slate-900 pb-1">
                Coordinator & Location
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 mb-1 uppercase tracking-wider">City</label>
                  <input name="city" type="text" required value={form.address.city} onChange={(e) => handleNested('address', e)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-brand-green"
                    placeholder="e.g. Rohtak" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 mb-1 uppercase tracking-wider">State</label>
                  <input name="state" type="text" required value={form.address.state} onChange={(e) => handleNested('address', e)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-brand-green"
                    placeholder="e.g. Haryana" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 mb-1 uppercase tracking-wider">Pincode</label>
                  <input name="zip" type="text" required value={form.address.zip} onChange={(e) => handleNested('address', e)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-brand-green"
                    placeholder="6 digit PIN" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 mb-1 uppercase tracking-wider">Coordinator Name</label>
                  <input name="name" type="text" required value={form.coordinator.name} onChange={(e) => handleNested('coordinator', e)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-brand-green"
                    placeholder="Coordinator Name" />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 mb-1 uppercase tracking-wider">Coordinator Phone</label>
                <input name="phone" type="tel" required value={form.coordinator.phone} onChange={(e) => handleNested('coordinator', e)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-brand-green"
                  placeholder="Coordinator mobile number" />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 mb-1 uppercase tracking-wider">Coordinator Email</label>
                <input name="email" type="email" required value={form.coordinator.email} onChange={(e) => handleNested('coordinator', e)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-brand-green"
                  placeholder="Coordinator personal/official email" />
              </div>
            </div>
          </div>

          <button type="submit" disabled={submitting}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-brand-green to-emerald-600 text-white font-bold py-3.5 rounded-xl transition-all disabled:opacity-50 mt-4">
            {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Register School'}
          </button>
        </form>

        <p className="text-center text-xs text-slate-550">
          Already registered?{' '}
          <Link to="/school/login" className="text-brand-green hover:underline font-semibold">School Login here</Link>
        </p>
      </div>
    </div>
  );
}
