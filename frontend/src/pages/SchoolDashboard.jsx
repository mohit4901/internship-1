import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Building2, Users, CheckCircle2, Clock, Bell, PlusCircle,
  LogOut, ChevronRight, Trophy, Upload, Eye
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getParticipants, addParticipants, getSchoolMe } from '../services/auth.service';
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

export default function SchoolDashboardPage() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const [school,       setSchool]       = useState(null);
  const [participants, setParticipants] = useState([]);
  const [pLoading,     setPLoading]     = useState(true);
  const [tab,          setTab]          = useState('overview');
  const [batchText,    setBatchText]    = useState('');
  const [batchError,   setBatchError]   = useState('');
  const [batchSuccess, setBatchSuccess] = useState('');
  const [submitting,   setSubmitting]   = useState(false);

  useEffect(() => {
    if (!isAuthenticated) { navigate('/school/login'); return; }
    getSchoolMe()
      .then((r) => setSchool(r.data?.data || user))
      .catch(() => setSchool(user));
    getParticipants()
      .then((r) => setParticipants(r.data?.data?.participants || []))
      .catch(() => {})
      .finally(() => setPLoading(false));
  }, [isAuthenticated]);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const handleBatchSubmit = async () => {
    setBatchError(''); setBatchSuccess('');
    let rows;
    try {
      rows = JSON.parse(batchText);
      if (!Array.isArray(rows)) throw new Error();
    } catch {
      setBatchError('Please enter a valid JSON array. Example: [{"name":"Priya","class":"7","section":"A"}]');
      return;
    }
    setSubmitting(true);
    try {
      const res = await addParticipants({ participants: rows });
      setBatchSuccess(`${res.data?.data?.added || rows.length} participant(s) added successfully.`);
      setBatchText('');
      // Refresh list
      const r = await getParticipants();
      setParticipants(r.data?.data?.participants || []);
    } catch (err) {
      setBatchError(err?.response?.data?.message || 'Failed to add participants. Please check the data and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const schoolData = school || user || {};
  const isVerified = schoolData?.isVerified;

  return (
    <div className="min-h-screen bg-brand-cream pb-12 selection:bg-brand-orange selection:text-white">

      {/* Top Header Bar */}
      <header className="sticky top-0 z-30 bg-white/95 border-b-4 border-brand-navy px-6 py-4 backdrop-blur-md shadow-sm">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 no-underline group">
            <BAIOLogo className="h-8 md:h-9 w-auto" />
            <span className="text-slate-400 text-xs font-semibold ml-2 pl-2 border-l border-slate-200">School Portal</span>
          </Link>
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-xs font-bold text-brand-navy">
                {schoolData?.name || 'Your School'}
              </span>
              <span className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase">
                Affiliation: {schoolData?.affiliationNumber || '—'}
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-xs text-slate-600 hover:text-red-600 border-2 border-slate-200 hover:border-red-200 px-3.5 py-2 rounded-xl transition-all cursor-pointer font-bold bg-white shadow-sm"
            >
              <LogOut className="w-3.5 h-3.5" /> Logout
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-8 space-y-8">

        {/* Verification banner */}
        {!isVerified && (
          <div className="bg-amber-50 border-2 border-amber-300 rounded-3xl px-6 py-5 flex items-start gap-4 shadow-sm">
            <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center shrink-0 border border-amber-300">
              <Clock className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-sm font-extrabold text-amber-900 uppercase tracking-wide">Account Pending Verification</p>
              <p className="text-xs text-amber-700 mt-1 leading-relaxed font-semibold">
                Your school registration is under review by the BAIO team. A dedicated coordinator will reach out
                within 24 hours. You'll be able to submit participant details once verified.
              </p>
            </div>
          </div>
        )}

        {isVerified && (
          <div className="bg-emerald-50 border-2 border-emerald-300 rounded-3xl px-6 py-5 flex items-center gap-4 shadow-sm">
            <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 border border-emerald-300">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm font-extrabold text-emerald-900 uppercase tracking-wide">School Account Verified</p>
              <p className="text-xs text-emerald-700 mt-1 font-semibold leading-relaxed">
                Your school is fully verified and enrolled in BAIO 2026-27. You can now submit student registration batches.
              </p>
            </div>
          </div>
        )}

        {/* School stats cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            { icon: <Building2 className="w-5 h-5 text-brand-orange" />, label: 'Board Affiliation', value: schoolData?.board || '—', bg: 'bg-orange-50', border: 'border-brand-navy' },
            { icon: <Users className="w-5 h-5 text-brand-green" />, label: 'Participants', value: schoolData?.registeredStudentsCount ?? participants.length, bg: 'bg-brand-cream', border: 'border-brand-navy' },
            { icon: <CheckCircle2 className="w-5 h-5 text-brand-navy" />, label: 'Portal Status', value: isVerified ? 'Verified' : 'Pending', bg: 'bg-indigo-50', border: 'border-brand-navy' },
            { icon: <Trophy className="w-5 h-5 text-brand-orange" />, label: 'BAIO Season', value: '2026-27', bg: 'bg-amber-50', border: 'border-brand-navy' },
          ].map((card, i) => (
            <div key={i} className={`bg-white border-4 ${card.border} rounded-3xl p-5 space-y-4 edu-shadow`}>
              <div className={`w-10 h-10 rounded-xl ${card.bg} flex items-center justify-center border-2 border-brand-navy`}>
                {card.icon}
              </div>
              <div>
                <p className="text-[9px] text-slate-400 font-extrabold uppercase tracking-widest">{card.label}</p>
                <p className="font-heading font-black text-[#001F5E] text-2xl mt-1">{card.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs Bar */}
        <div className="flex flex-wrap gap-2 border-b-2 border-slate-200 pb-2.5">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'participants', label: 'Participants List' },
            { id: 'submit', label: 'Submit Students' },
          ].map((t) => {
            const isActive = tab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`px-5 py-2.5 text-xs font-extrabold rounded-full transition-all cursor-pointer ${
                  isActive 
                    ? 'bg-brand-orange text-white shadow-sm shadow-orange-500/20' 
                    : 'text-slate-600 hover:text-brand-navy hover:bg-white/60'
                }`}
              >
                {t.label}
              </button>
            );
          })}
        </div>

        {/* ─── TAB CONTENT CONTENTS ────────────────────────────────── */}
        
        {/* Overview tab */}
        {tab === 'overview' && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8"
          >
            {/* School details */}
            <div className="bg-white border-4 border-brand-navy rounded-3xl p-6 space-y-4 lg:col-span-7 edu-shadow">
              <h2 className="font-heading font-extrabold text-brand-navy text-lg border-b-2 border-slate-100 pb-3">School Registry Information</h2>
              <div className="space-y-3.5 text-xs font-semibold text-slate-800">
                {[
                  { label: 'School Registry Name', value: schoolData?.name },
                  { label: 'CBSE / Board Affiliation', value: schoolData?.affiliationNumber },
                  { label: 'Affiliated Board Type', value: schoolData?.board },
                  { label: 'School Principal Name', value: schoolData?.principalName || '—' },
                  { label: 'City Location', value: `${schoolData?.address?.city || ''}, ${schoolData?.address?.state || ''}` },
                  { label: 'Contact Registry Email', value: schoolData?.contactEmail },
                  { label: 'Contact Phone Number', value: schoolData?.contactPhone },
                ].map((row, i) => (
                  <div key={i} className="flex justify-between border-b border-slate-100 pb-2.5 last:border-0 last:pb-0">
                    <span className="text-slate-400 font-bold">{row.label}</span>
                    <span className="text-brand-navy font-extrabold text-right max-w-[60%]">{row.value || '—'}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick actions */}
            <div className="space-y-6 lg:col-span-5">
              <div className="bg-white border-4 border-brand-navy rounded-3xl p-6 space-y-4 edu-shadow">
                <h2 className="font-heading font-extrabold text-brand-navy text-lg border-b-2 border-slate-100 pb-3">Quick Actions</h2>
                {[
                  { icon: <Upload className="w-4 h-4" />, label: 'Submit Student List', desc: 'Add new entries for BAIO 2026-27', action: () => setTab('submit'), disabled: !isVerified },
                  { icon: <Eye className="w-4 h-4" />, label: 'View Participants List', desc: 'See all submitted student entries', action: () => setTab('participants'), disabled: false },
                  { icon: <Bell className="w-4 h-4" />, label: 'Announcements Board', desc: 'Check dates & updates', action: () => navigate('/announcements'), disabled: false },
                ].map((action, i) => (
                  <button
                    key={i}
                    onClick={action.action}
                    disabled={action.disabled}
                    className={`w-full flex items-start gap-3.5 p-3.5 rounded-2xl text-left transition-all border-2 border-transparent cursor-pointer ${
                      action.disabled
                        ? 'opacity-40 cursor-not-allowed bg-slate-50'
                        : 'hover:border-brand-navy/15 hover:bg-slate-50 border-slate-100/40 bg-white shadow-sm'
                    }`}
                  >
                    <div className="w-9 h-9 bg-brand-cream border border-slate-200 rounded-xl flex items-center justify-center shrink-0 mt-0.5 text-brand-navy">
                      {action.icon}
                    </div>
                    <div>
                      <p className="text-xs font-black text-brand-navy">{action.label}</p>
                      <p className="text-[10px] text-slate-500 font-bold mt-0.5">{action.desc}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400 ml-auto mt-1 shrink-0" />
                  </button>
                ))}
              </div>

              <div className="bg-orange-50 border-2 border-brand-orange/20 rounded-3xl p-5 space-y-2">
                <p className="text-xs font-black text-slate-800 uppercase tracking-wide">Need Support?</p>
                <p className="text-[10px] text-slate-600 leading-relaxed font-semibold">
                  Your dedicated BAIO coordinator is available for any coordination support. Email us at{' '}
                  <a href="mailto:schools@baio.in" className="text-brand-orange font-bold hover:underline">schools@baio.in</a>{' '}
                  and we'll get back to you within 2 business hours.
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Participants tab */}
        {tab === 'participants' && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            {pLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => <div key={i} className="h-12 bg-white rounded-2xl animate-pulse border border-slate-200" />)}
              </div>
            ) : participants.length === 0 ? (
              <div className="bg-white border-4 border-dashed border-slate-300 rounded-3xl p-12 text-center space-y-5">
                <div className="w-14 h-14 bg-slate-50 border-2 border-slate-200 rounded-full flex items-center justify-center mx-auto">
                  <Users className="w-6 h-6 text-slate-400" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-heading font-black text-slate-700 text-lg">No participants submitted yet.</h3>
                  <p className="text-slate-400 text-xs font-semibold">
                    {isVerified ? 'Use the "Submit Students" tab to upload your school\'s participant list.' : 'Your school account must be verified before submitting participant lists.'}
                  </p>
                </div>
                {isVerified && (
                  <button 
                    onClick={() => setTab('submit')} 
                    className="btn-primary py-2.5 px-5 shadow-sm text-xs"
                  >
                    <PlusCircle className="w-4 h-4" /> Submit Students
                  </button>
                )}
              </div>
            ) : (
              <div className="bg-white border-4 border-brand-navy rounded-3xl overflow-hidden edu-shadow">
                <div className="px-6 py-4.5 border-b border-slate-100 flex items-center justify-between flex-wrap gap-2 bg-white">
                  <div>
                    <h2 className="font-heading font-extrabold text-brand-navy text-base">Registered Participants ({participants.length})</h2>
                    <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Pen-and-paper study booklets will be dispatched based on this list.</p>
                  </div>
                  {isVerified && (
                    <button 
                      onClick={() => setTab('submit')} 
                      className="flex items-center gap-1.5 text-xs text-brand-orange font-extrabold border-2 border-brand-orange/20 px-3.5 py-2 rounded-xl hover:bg-orange-50 transition-colors cursor-pointer bg-white"
                    >
                      <PlusCircle className="w-3.5 h-3.5" /> Register More Students
                    </button>
                  )}
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="bg-brand-cream border-b-2 border-slate-150">
                        {['Name', 'Class Level', 'Section', 'Roll No', 'Registration Code'].map((h) => (
                          <th key={h} className="text-left px-5 py-3 text-[10px] font-black uppercase tracking-wider text-brand-navy">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {participants.map((p, i) => (
                        <tr key={p._id || i} className="border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors font-semibold text-slate-800">
                          <td className="px-5 py-4 font-bold text-brand-navy">{p.name}</td>
                          <td className="px-5 py-4">Class {p.class}</td>
                          <td className="px-5 py-4 text-slate-500">{p.section || '—'}</td>
                          <td className="px-5 py-4 text-slate-500">{p.rollNo || '—'}</td>
                          <td className="px-5 py-4">
                            <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-extrabold tracking-wider ${p.division === 'Junior' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-indigo-50 text-indigo-700 border border-indigo-200'}`}>
                              {p.division || '—'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* Submit tab */}
        {tab === 'submit' && (
          <motion.div 
            initial={{ opacity: 0, y: 12 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.3 }}
            className="max-w-2xl space-y-5 mx-auto"
          >
            {!isVerified ? (
              <div className="bg-amber-50 border-2 border-amber-300 rounded-3xl p-6 space-y-2">
                <p className="text-sm font-extrabold text-amber-900 uppercase tracking-wide">Account Verification Required</p>
                <p className="text-xs text-amber-700 font-semibold leading-relaxed">
                  You can submit participant registries only after your school account has been verified by the BAIO team.
                  A coordinator will reach out within 24 hours of registration.
                </p>
              </div>
            ) : (
              <>
                <div className="bg-white border-4 border-brand-navy rounded-3xl p-6 space-y-5 edu-shadow">
                  <div>
                    <h2 className="font-heading font-extrabold text-brand-navy text-lg">Batch Registration Console</h2>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed font-semibold">
                      Paste a JSON array of students below. Each entry requires a <code className="bg-slate-100 text-brand-orange px-1.5 py-0.5 rounded font-mono font-bold">name</code> and a <code className="bg-slate-100 text-brand-orange px-1.5 py-0.5 rounded font-mono font-bold">class</code>.
                      Optional: <code className="bg-slate-100 text-brand-navy px-1.5 py-0.5 rounded font-mono font-bold">section</code>, <code className="bg-slate-100 text-brand-navy px-1.5 py-0.5 rounded font-mono font-bold">rollNo</code>.
                    </p>
                  </div>
                  
                  <div className="bg-brand-cream border border-slate-200 rounded-2xl p-4 font-mono text-[10px] text-slate-500 leading-normal">
                    <p className="text-slate-400 font-bold mb-2">// Copy-Paste Template Example:</p>
                    <p className="whitespace-pre">{`[
  { "name": "Priya Sharma", "class": "7", "section": "A", "rollNo": "101" },
  { "name": "Arjun Mehta",  "class": "8", "section": "B", "rollNo": "102" }
]`}</p>
                  </div>
                  
                  <textarea
                    rows={8}
                    value={batchText}
                    onChange={(e) => setBatchText(e.target.value)}
                    placeholder='[{"name":"Student Name","class":"7","section":"A"}]'
                    className="w-full font-mono text-xs border-2 border-slate-200 rounded-2xl px-4 py-3 focus:outline-none focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/10 resize-y placeholder:text-slate-300 font-semibold"
                  />
                  
                  {batchError && <p className="text-red-600 text-xs font-bold">{batchError}</p>}
                  {batchSuccess && (
                    <div className="flex items-center gap-2 text-emerald-700 text-xs font-bold bg-emerald-50 p-3 rounded-xl border border-emerald-200">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" /> {batchSuccess}
                    </div>
                  )}
                  
                  <button
                    onClick={handleBatchSubmit}
                    disabled={submitting || !batchText.trim()}
                    className="btn-primary py-3.5 px-6 shadow-md disabled:opacity-50 text-xs cursor-pointer"
                  >
                    {submitting ? 'Submitting Batch...' : 'Submit Student Batch'}
                    <Upload className="w-4 h-4" />
                  </button>
                </div>
 
                <div className="bg-white border border-slate-200 rounded-2xl p-4 text-[10px] text-slate-500 space-y-1.5 font-semibold">
                  <p className="font-extrabold text-brand-navy uppercase tracking-wider">Registry Guide:</p>
                  <p>• Valid class levels: Classes 3 to 8 (in accordance with BAIO syllabus regulations)</p>
                  <p>• Participant divisions are auto-mapped based on grade</p>
                  <p>• Standard batches support up to 200 participants per submission</p>
                  <p>• You can submit multiple batches — the portal accumulates all student entries automatically</p>
                </div>
              </>
            )}
          </motion.div>
        )}

      </div>
    </div>
  );
}
