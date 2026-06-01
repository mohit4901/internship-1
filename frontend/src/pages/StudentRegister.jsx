import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { schoolAPI } from '../services/schoolAPI';
import { UserPlus, Loader2, AlertCircle, Sparkles } from 'lucide-react';

export default function StudentRegisterPage() {
  const { registerStudent } = useAuth();
  const navigate = useNavigate();
  const [schools, setSchools] = useState([]);
  const [loadingSchools, setLoadingSchools] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    schoolId: '',
    class: '6',
    section: '',
    dob: '',
    gender: 'Male',
    parent: {
      name: '',
      phone: '',
      email: ''
    },
    address: {
      street: '',
      city: '',
      state: '',
      zip: ''
    }
  });

  // Load public schools list
  useEffect(() => {
    const fetchSchools = async () => {
      try {
        const res = await schoolAPI.listPublic();
        const list = res?.data?.data?.schools || res?.data?.schools || [];
        setSchools(list);
        if (list.length > 0) {
          setForm(p => ({ ...p, schoolId: list[0]._id }));
        }
      } catch (err) {
        console.error('Failed to load schools', err);
      } finally {
        setLoadingSchools(false);
      }
    };
    fetchSchools();
  }, []);

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

    // Deep copy form to format it
    const payload = {
      ...form,
      section: form.section ? form.section : undefined,
    };

    if (form.parent.name && form.parent.phone) {
      payload.parent = { ...form.parent };
      if (!payload.parent.email) {
        delete payload.parent.email;
      }
    } else {
      payload.parent = undefined;
    }

    if (form.address.city && form.address.state && form.address.zip) {
      payload.address = { ...form.address };
      if (!payload.address.street) {
        delete payload.address.street;
      }
    } else {
      payload.address = undefined;
    }

    try {
      await registerStudent(payload);
      navigate('/student/login');
    } catch (err) {
      if (err?.errors && Array.isArray(err.errors) && err.errors.length > 0) {
        const detailMsg = err.errors.map(e => `• ${e.field}: ${e.message}`).join('\n');
        setError(`Registration failed:\n${detailMsg}`);
      } else {
        setError(err?.message || 'Registration failed. Please check validation rules.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto my-12 px-4">
      <div className="glass-card p-8 rounded-3xl border border-white/5 space-y-6">
        <div className="text-center space-y-1">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-brand-orange/10 border border-brand-orange/20 mb-2">
            <UserPlus className="w-6 h-6 text-brand-orange" />
          </div>
          <h1 className="font-heading font-extrabold text-2xl text-white">Student Registration</h1>
          <p className="text-slate-400 text-sm">Join the Bharat AI Olympiad (BAIO) portal</p>
        </div>

        {error && (
          <div className="flex items-start gap-3 bg-red-500/10 border border-red-500/20 p-3.5 rounded-xl">
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <p className="text-xs text-red-300 whitespace-pre-wrap">{error}</p>
          </div>
        )}

        <form onSubmit={submit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Basic Info */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-brand-orange uppercase tracking-wider border-b border-slate-900 pb-1">
                Personal Information
              </h3>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 mb-1 uppercase tracking-wider">Full Name</label>
                <input name="name" type="text" required value={form.name} onChange={handle}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-brand-orange"
                  placeholder="e.g. Aditya Sharma" />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 mb-1 uppercase tracking-wider">Email Address</label>
                <input name="email" type="email" required value={form.email} onChange={handle}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-brand-orange"
                  placeholder="aditya@example.com" />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 mb-1 uppercase tracking-wider">Mobile Number</label>
                <input name="phone" type="tel" required value={form.phone} onChange={handle}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-brand-orange"
                  placeholder="e.g. 9876543210 (10 digit)" />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 mb-1 uppercase tracking-wider">Password</label>
                <input name="password" type="password" required value={form.password} onChange={handle}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-brand-orange"
                  placeholder="At least 8 chars (1 Capital, 1 Lower, 1 Num)" />
              </div>
            </div>

            {/* Academic Info */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-brand-orange uppercase tracking-wider border-b border-slate-900 pb-1">
                Academic Details
              </h3>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 mb-1 uppercase tracking-wider">School / Institution</label>
                {loadingSchools ? (
                  <div className="flex items-center gap-2 text-slate-400 text-xs py-2">
                    <Loader2 className="w-4 h-4 animate-spin text-brand-orange" />
                    <span>Loading schools...</span>
                  </div>
                ) : (
                  <select name="schoolId" required value={form.schoolId} onChange={handle}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-brand-orange">
                    {schools.map(s => (
                      <option key={s._id} value={s._id}>
                        {s.name || `${s.board} School, ${s.address?.city || ''}`} ({s.affiliationNumber})
                      </option>
                    ))}
                    {schools.length === 0 && (
                      <option disabled>No schools found. Please ask school to register.</option>
                    )}
                  </select>
                )}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 mb-1 uppercase tracking-wider">Class / Grade</label>
                  <select name="class" required value={form.class} onChange={handle}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-brand-orange">
                    {['6', '7', '8', '9', '10', '11', '12', 'UG'].map(c => (
                      <option key={c} value={c}>Class {c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 mb-1 uppercase tracking-wider">Section</label>
                  <input name="section" type="text" value={form.section} onChange={handle}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-brand-orange"
                    placeholder="e.g. A" />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 mb-1 uppercase tracking-wider">Date of Birth</label>
                <input name="dob" type="date" required value={form.dob} onChange={handle}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-brand-orange" />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 mb-1 uppercase tracking-wider">Gender</label>
                <select name="gender" required value={form.gender} onChange={handle}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-brand-orange">
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
          </div>

          {/* Parent Info & Address Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-brand-orange/80 uppercase tracking-wider border-b border-slate-900 pb-1">
                Parent/Guardian (Optional)
              </h3>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 mb-1 uppercase tracking-wider">Parent Name</label>
                <input name="name" type="text" value={form.parent.name} onChange={(e) => handleNested('parent', e)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-brand-orange"
                  placeholder="Father/Mother name" />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 mb-1 uppercase tracking-wider">Parent Mobile</label>
                <input name="phone" type="tel" value={form.parent.phone} onChange={(e) => handleNested('parent', e)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-brand-orange"
                  placeholder="10 digit number" />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-xs font-bold text-brand-orange/80 uppercase tracking-wider border-b border-slate-900 pb-1">
                Address Details (Optional)
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 mb-1 uppercase tracking-wider">City</label>
                  <input name="city" type="text" value={form.address.city} onChange={(e) => handleNested('address', e)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-brand-orange"
                    placeholder="e.g. Rohtak" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 mb-1 uppercase tracking-wider">State</label>
                  <input name="state" type="text" value={form.address.state} onChange={(e) => handleNested('address', e)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-brand-orange"
                    placeholder="e.g. Haryana" />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 mb-1 uppercase tracking-wider">Zip / Pincode</label>
                <input name="zip" type="text" value={form.address.zip} onChange={(e) => handleNested('address', e)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-brand-orange"
                  placeholder="6 digit PIN code" />
              </div>
            </div>
          </div>

          <button type="submit" disabled={submitting}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-brand-orange to-amber-600 text-white font-bold py-3.5 rounded-xl transition-all disabled:opacity-50 mt-4">
            {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Complete Registration'}
          </button>
        </form>

        <p className="text-center text-xs text-slate-550">
          Already registered?{' '}
          <Link to="/student/login" className="text-brand-orange hover:underline font-semibold">Sign In here</Link>
        </p>
      </div>
    </div>
  );
}
