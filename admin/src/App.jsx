import { useAdminAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import AdminNavbar from './components/AdminNavbar';
import * as XLSX from 'xlsx';
import {
  dashboardAPI, olympiadAPI, registrationAPI,
  studentAPI, schoolAPI, announcementAPI, resultAPI, contactAPI,
  cmsAPI, mediaAPI, participantAPI
} from './services';
import {
  Users, School, Trophy, FileText, Megaphone, Award,
  MessageSquare, TrendingUp, Download, Search, Plus,
  CheckCircle, Clock, ShieldAlert, XCircle, Eye,
  Calendar, Sparkles, ChevronLeft, ChevronRight, RefreshCw,
  Settings, Upload, Globe, HelpCircle, Phone, Home, Image,
  FileCheck, Loader2, Check, AlertCircle, Trash2, ClipboardList,
  FileSpreadsheet, CheckSquare, Square, BarChart3
} from 'lucide-react';

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────
function fmt(n) {
  if (n === undefined || n === null) return '—';
  return Number(n).toLocaleString('en-IN');
}
function fmtDate(d) {
  if (!d) return '—';
  try { return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }); }
  catch { return d; }
}

function StatusBadge({ status }) {
  const map = {
    Confirmed:   'badge-green',
    Active:      'badge-green',
    Paid:        'badge-green',
    Qualified:   'badge-green',
    Pending:     'badge-amber',
    Initiated:   'badge-amber',
    Draft:       'badge-slate',
    RegistrationClosed: 'badge-slate',
    Failed:      'badge-rose',
    Cancelled:   'badge-rose',
    Finished:    'badge-indigo',
    MeritAwardee:'badge-blue',
    NationalRanker:'badge-indigo',
    Participated:'badge-slate',
    New:         'badge-amber',
    InProgress:  'badge-blue',
    Resolved:    'badge-green',
  };
  const cls = map[status] || 'badge-slate';
  return (
    <span className={`inline-block px-2.5 py-1 rounded-xl text-[9px] font-black uppercase tracking-wider ${cls}`}>
      {status}
    </span>
  );
}

function SkeletonRows({ cols = 5, rows = 5 }) {
  return Array.from({ length: rows }).map((_, i) => (
    <tr key={i} className="animate-pulse">
      {Array.from({ length: cols }).map((__, j) => (
        <td key={j} className="py-4">
          <div className="h-4 bg-slate-100 border border-slate-200/50 rounded-lg" style={{ width: `${55 + (j * 13) % 40}%` }} />
        </td>
      ))}
    </tr>
  ));
}

// ─────────────────────────────────────────────
// Stat Card
// ─────────────────────────────────────────────
function StatCard({ label, value, sub, color = 'stat-indigo', icon: Icon, loading }) {
  return (
    <div className="admin-card p-5 space-y-4 relative pt-6">
      <div className={`absolute top-0 left-0 right-0 h-1.5 ${color}`} />
      <div className="flex items-start justify-between">
        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none">{label}</span>
        {Icon && (
          <div className="w-8 h-8 rounded-lg bg-brand-cream border-2 border-brand-navy flex items-center justify-center shrink-0">
            <Icon className="w-4 h-4 text-brand-navy" />
          </div>
        )}
      </div>
      {loading ? (
        <div className="h-8 w-24 bg-slate-100 rounded-lg animate-pulse border border-slate-200" />
      ) : (
        <div className="flex items-end justify-between gap-2">
          <span className="text-2xl font-black text-brand-navy leading-none">{value ?? '—'}</span>
          {sub && <span className="text-[10px] font-black badge-green px-2 py-0.5">{sub}</span>}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// Generic Table wrapper
// ─────────────────────────────────────────────
function AdminTable({ headers, children, loading, cols, emptyMsg = 'No records found.' }) {
  return (
    <div className="admin-table-container overflow-x-auto my-4">
      <table className="admin-table">
        <thead>
          <tr>
            {headers.map(h => (
              <th key={h}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <SkeletonRows cols={headers.length} />
          ) : React.Children.count(children) === 0 ? (
            <tr>
              <td colSpan={headers.length} className="py-12 text-center text-slate-500 font-semibold">
                {emptyMsg}
              </td>
            </tr>
          ) : children}
        </tbody>
      </table>
    </div>
  );
}

// ─────────────────────────────────────────────
// Search + Export bar
// ─────────────────────────────────────────────
function TableToolbar({ query, onQuery, onExport, placeholder = 'Search…', extra }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
      <div className="relative max-w-xs w-full">
        <Search className="w-4 h-4 text-brand-navy/60 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={e => onQuery(e.target.value)}
          className="w-full bg-white border-2 border-brand-navy rounded-xl pl-9 pr-4 py-2 text-xs text-brand-navy placeholder:text-slate-400 focus:outline-none focus:border-brand-orange transition-all font-semibold"
        />
      </div>
      <div className="flex items-center gap-2">
        {extra}
        {onExport && (
          <button
            onClick={onExport}
            className="btn-secondary text-xs flex items-center gap-1.5 py-2 px-4 shadow-sm"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
        )}
      </div>
    </div>
  );
}

const MOCK_STATS = {
  cards: { totalRegistrations: 0, totalRevenue: 0, activeOlympiads: 0, pendingApprovals: 0, totalParticipants: 0 },
  breakdowns: {
    schools: { verified: 0, pending: 0 },
    registrations: { paid: 0, pending: 0 }
  }
};

const MOCK_REGS = [];
const MOCK_OLYMPIADS = [];
const MOCK_STUDENTS = [];
const MOCK_SCHOOLS = [];
const MOCK_ANNOUNCEMENTS = [];
const MOCK_RESULTS = [];
const MOCK_CONTACTS = [];

// ─────────────────────────────────────────────
// Page: Dashboard
// ─────────────────────────────────────────────
function DashboardPage() {
  const [stats, setStats]     = useState(null);
  const [loading, setLoading] = useState(true);
  const [query, setQuery]     = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await dashboardAPI.stats();
      setStats(res?.data?.data || res?.data || MOCK_STATS);
    } catch {
      setStats(MOCK_STATS);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleVerifySchool = async (schoolId, name, currentStatus) => {
    const targetStatus = !currentStatus;
    const msg = targetStatus ? `Verify and approve school "${name}"?` : `Revoke verification for school "${name}"?`;
    if (!window.confirm(msg)) return;
    try {
      await schoolAPI.verify(schoolId, { isVerified: targetStatus, remarks: 'Verified from admin dashboard quick action' });
      load();
    } catch (err) {
      alert(err?.response?.data?.message || err?.message || 'Failed to update verification status.');
    }
  };

  const recentSchools = stats?.recentActivity?.schools || [];
  const filteredSchools = recentSchools.filter(s => {
    const q = query.toLowerCase();
    return (
      (s.name || '').toLowerCase().includes(q) ||
      (s.board || '').toLowerCase().includes(q) ||
      (s.address?.city || '').toLowerCase().includes(q) ||
      (s.address?.state || '').toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-7">
      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard 
          label="Total Schools" 
          value={fmt(stats?.cards?.totalSchools)} 
          sub={stats?.breakdowns?.schools ? `Pending: ${fmt(stats.breakdowns.schools.pending)}` : "Enrolled"} 
          color="stat-indigo" 
          icon={School}   
          loading={loading} 
        />
        <StatCard 
          label="School Participants" 
          value={fmt(stats?.cards?.totalParticipants)} 
          sub="Batch Uploaded" 
          color="stat-green" 
          icon={ClipboardList} 
          loading={loading} 
        />
        <StatCard 
          label="Active Olympiads" 
          value={fmt(stats?.cards?.totalOlympiads)} 
          sub="Active catalogs" 
          color="stat-blue"  
          icon={Trophy} 
          loading={loading} 
        />
        <StatCard 
          label="Scorecards Created" 
          value={fmt(stats?.cards?.totalResults)} 
          sub="Published / Saved" 
          color="stat-amber"  
          icon={Award}   
          loading={loading} 
        />
      </div>

      {/* Recent School Registrations */}
      <div className="admin-card p-6">
        <h2 className="text-sm font-bold text-[#001F5E] mb-4 flex items-center gap-2">
          <School className="w-4 h-4 text-brand-orange" />
          Recent School Registrations
        </h2>
        <TableToolbar query={query} onQuery={setQuery} placeholder="Search name, board, location…" onExport={null} />
        <AdminTable
          loading={loading}
          headers={['School Name', 'Board', 'City', 'State', 'Participants', 'Verification', 'Action']}
        >
          {filteredSchools.map(s => (
            <tr key={s._id}>
              <td className="py-3.5 pr-4 font-semibold text-slate-800">{s.name}</td>
              <td className="py-3.5 pr-4 text-slate-500">{s.board || '—'}</td>
              <td className="py-3.5 pr-4 text-slate-500">{s.address?.city || '—'}</td>
              <td className="py-3.5 pr-4 text-slate-500">{s.address?.state || '—'}</td>
              <td className="py-3.5 pr-4 text-slate-700 font-semibold">{s.registeredStudentsCount || 0}</td>
              <td className="py-3.5 pr-4">
                <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  s.isVerified ? 'badge-green' : 'badge-amber'
                }`}>{s.isVerified ? 'Verified' : 'Pending'}</span>
              </td>
              <td className="py-3.5 pr-4">
                <button
                  onClick={() => handleVerifySchool(s._id, s.name, s.isVerified)}
                  className={`px-2.5 py-1 rounded-xl text-[10px] font-bold cursor-pointer transition-all border-2 border-brand-navy shadow-[0_2px_0px_0px_#001F5E] hover:-translate-y-0.5 active:translate-y-0.5 ${
                    s.isVerified 
                      ? 'bg-rose-500 text-white hover:bg-rose-600' 
                      : 'bg-brand-green text-white hover:bg-emerald-700'
                  }`}
                >
                  {s.isVerified ? 'Revoke' : 'Approve'}
                </button>
              </td>
            </tr>
          ))}
        </AdminTable>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Page: Olympiads
// ─────────────────────────────────────────────
function OlympiadsPage() {
  const [data, setData]       = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery]     = useState('');
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving]   = useState(false);
  const [form, setForm] = useState({
    title: '', description: '', category: 'Junior',
    registrationFee: 0, examDate: '', registrationLastDate: ''
  });

  const load = async () => {
    setLoading(true);
    try {
      const res = await olympiadAPI.list();
      const list = res?.data?.data?.olympiads || res?.data?.data || res?.data || [];
      setData(Array.isArray(list) ? list : MOCK_OLYMPIADS);
    } catch { setData(MOCK_OLYMPIADS); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await olympiadAPI.create(form);
      setShowForm(false);
      setForm({ title: '', description: '', category: 'Junior', registrationFee: 0, examDate: '', registrationLastDate: '' });
      load();
    } catch (err) {
      alert(err?.message || 'Failed to create olympiad.');
    } finally { setSaving(false); }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) return;
    try {
      await olympiadAPI.delete(id);
      load();
    } catch (err) {
      alert(err?.response?.data?.message || err?.message || 'Failed to delete olympiad.');
    }
  };

  const filtered = data.filter(o =>
    (o.title || '').toLowerCase().includes(query.toLowerCase())
  );

  const inputCls = 'w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#FF8C00] transition-all font-semibold';

  return (
    <div className="space-y-5">
      <div className="admin-card p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-sm font-bold text-[#001F5E] flex items-center gap-2">
            <Trophy className="w-4 h-4 text-brand-orange" /> Olympiad Catalog
          </h2>
          <button onClick={() => setShowForm(s => !s)} className="btn-secondary text-xs py-1.5 px-3">
            <Plus className="w-3.5 h-3.5 text-brand-orange" /> {showForm ? 'Cancel' : 'New Olympiad'}
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleCreate} className="mb-6 space-y-4">
            <h3 className="text-sm font-bold text-[#001F5E]">Create New Olympiad</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="text-[10px] font-bold text-slate-555 uppercase tracking-widest block mb-1">Title *</label>
                <input required className={inputCls} placeholder="AI Olympiad - Junior Division" value={form.title} onChange={e => setForm(p => ({...p, title: e.target.value}))} />
              </div>
              <div className="col-span-2">
                <label className="text-[10px] font-bold text-slate-555 uppercase tracking-widest block mb-1">Description</label>
                <textarea className={inputCls} rows={2} placeholder="Brief description…" value={form.description} onChange={e => setForm(p => ({...p, description: e.target.value}))} />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-555 uppercase tracking-widest block mb-1">Category *</label>
                <select required className={inputCls} value={form.category} onChange={e => setForm(p => ({...p, category: e.target.value}))}>
                  <option>Junior</option><option>Senior</option><option>Masters</option><option>General</option><option>AI</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-555 uppercase tracking-widest block mb-1">Registration Fee (₹)</label>
                <input type="number" min="0" className={inputCls} value={form.registrationFee} onChange={e => setForm(p => ({...p, registrationFee: Number(e.target.value)}))} />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-555 uppercase tracking-widest block mb-1">Exam Date *</label>
                <input required type="date" className={inputCls} value={form.examDate} onChange={e => setForm(p => ({...p, examDate: e.target.value}))} />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-555 uppercase tracking-widest block mb-1">Registration Closes *</label>
                <input required type="date" className={inputCls} value={form.registrationLastDate} onChange={e => setForm(p => ({...p, registrationLastDate: e.target.value}))} />
              </div>
            </div>
            <button type="submit" disabled={saving} className="btn-primary">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
              {saving ? 'Creating…' : 'Create Olympiad'}
            </button>
          </form>
        )}

        <TableToolbar query={query} onQuery={setQuery} placeholder="Search olympiad…" />
        <AdminTable loading={loading} headers={['Title', 'Category', 'Fee', 'Exam Date', 'Reg. Closes', 'Status', 'Actions']}>
          {filtered.map(o => (
            <tr key={o._id}>
              <td className="py-3.5 pr-4 font-semibold text-slate-800 max-w-[220px] truncate">{o.title}</td>
              <td className="py-3.5 pr-4">
                <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  o.category === 'Junior' ? 'badge-green' : o.category === 'Senior' ? 'badge-amber' : 'badge-indigo'
                }`}>{o.category}</span>
              </td>
              <td className="py-3.5 pr-4 text-slate-700 font-semibold">{o.registrationFee === 0 || o.isFree ? 'Free' : `₹${fmt(o.registrationFee)}`}</td>
              <td className="py-3.5 pr-4 text-slate-555 whitespace-nowrap">{fmtDate(o.timeline?.examDate || o.examDate)}</td>
              <td className="py-3.5 pr-4 text-slate-555 whitespace-nowrap">{fmtDate(o.timeline?.registrationEnd || o.registrationLastDate)}</td>
              <td className="py-3.5 pr-4"><StatusBadge status={o.status || o.status} /></td>
              <td className="py-3.5 pr-4">
                <button
                  disabled={o.status === 'Active' || o.status === 'RegistrationClosed'}
                  onClick={() => handleDelete(o._id, o.title)}
                  className="bg-rose-500 hover:bg-rose-600 text-white border-2 border-brand-navy shadow-[0_2px_0px_0px_#001F5E] hover:-translate-y-0.5 active:translate-y-0.5 px-2.5 py-1 rounded-xl text-[10px] font-bold transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                  title={o.status === 'Active' || o.status === 'RegistrationClosed' ? 'Cannot delete active/closed Olympiad' : 'Delete'}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </AdminTable>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Page: Registrations
// ─────────────────────────────────────────────
function RegistrationsPage() {
  const [data, setData]       = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery]     = useState('');

  useEffect(() => {
    (async () => {
      try {
        const res = await registrationAPI.list({ limit: 50 });
        const list = res?.data?.data?.registrations || res?.data?.registrations || res?.data?.data || [];
        setData(Array.isArray(list) && list.length ? list : MOCK_REGS);
      } catch { setData(MOCK_REGS); }
      finally { setLoading(false); }
    })();
  }, []);

  const filtered = data.filter(r => {
    const q = query.toLowerCase();
    const studentName = r.studentId?.name || r.studentId?.fullName || r.studentName || '';
    return studentName.toLowerCase().includes(q) ||
           (r.schoolId?.name  || '').toLowerCase().includes(q) ||
           (r.registrationNumber || '').toLowerCase().includes(q);
  });

  const handleExportRegistrations = () => {
    const formatted = filtered.map(r => ({
      "Registration Number": r.registrationNumber || "—",
      "Student Name": r.studentId?.fullName || r.studentId?.name || r.studentName || "—",
      "School Name": r.schoolId?.name || "—",
      "Division": r.division || "—",
      "Date Registered": r.createdAt ? new Date(r.createdAt).toLocaleDateString() : "—",
      "Payment Status": r.paymentStatus || "—",
      "Registration Status": r.registrationStatus || "—",
      "Roll Number": r.rollNumber || "—"
    }));
    const ws = XLSX.utils.json_to_sheet(formatted);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Registrations");
    XLSX.writeFile(wb, "BAIO_Registrations_List.xlsx");
  };

  return (
    <div className="admin-card p-6">
      <TableToolbar query={query} onQuery={setQuery} placeholder="Search name, school, reg no…" onExport={handleExportRegistrations} />
      <AdminTable loading={loading} headers={['Reg No.', 'Student', 'School', 'Division', 'Date', 'Payment', 'Status', 'Roll No.']}>
        {filtered.map(r => (
          <tr key={r._id}>
            <td className="py-3.5 pr-4 font-mono text-[10px] text-slate-500">{r.registrationNumber}</td>
            <td className="py-3.5 pr-4 font-semibold text-slate-100">{r.studentId?.name || '—'}</td>
            <td className="py-3.5 pr-4 text-slate-400">{r.schoolId?.name || '—'}</td>
            <td className="py-3.5 pr-4 text-slate-400">{r.olympiadId?.category || '—'}</td>
            <td className="py-3.5 pr-4 text-slate-500">{fmtDate(r.createdAt)}</td>
            <td className="py-3.5 pr-4"><StatusBadge status={r.paymentStatus} /></td>
            <td className="py-3.5 pr-4"><StatusBadge status={r.registrationStatus} /></td>
            <td className="py-3.5 font-mono text-[10px] text-slate-500">{r.rollNumber || '—'}</td>
          </tr>
        ))}
      </AdminTable>
    </div>
  );
}

// ─────────────────────────────────────────────
// Page: Students
// ─────────────────────────────────────────────
function StudentsPage() {
  const [data, setData]       = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery]     = useState('');
  const [deleting, setDeleting] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await studentAPI.list({ limit: 100 });
      const list = res?.data?.data?.students || res?.data?.data || res?.data || [];
      setData(Array.isArray(list) ? list : MOCK_STUDENTS);
    } catch { setData(MOCK_STUDENTS); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete student "${name}"? This cannot be undone.`)) return;
    setDeleting(id);
    try {
      await studentAPI.delete(id);
      setData(prev => prev.filter(s => s._id !== id));
    } catch (e) {
      alert(e?.message || 'Delete failed.');
    } finally { setDeleting(null); }
  };

  const filtered = data.filter(s => {
    const q = query.toLowerCase();
    return (s.name || '').toLowerCase().includes(q) || (s.email || '').toLowerCase().includes(q);
  });

  return (
    <div className="admin-card p-6">
      <TableToolbar query={query} onQuery={setQuery} placeholder="Search name, email…" onExport={() => {}} />
      <AdminTable loading={loading} headers={['Name', 'Email', 'Phone', 'Class', 'Verified', 'Status', 'Joined', 'Action']}>
        {filtered.map(s => (
          <tr key={s._id}>
            <td className="py-3.5 pr-4 font-semibold text-slate-100">{s.name}</td>
            <td className="py-3.5 pr-4 text-slate-400">{s.email}</td>
            <td className="py-3.5 pr-4 text-slate-500 font-mono">{s.phone}</td>
            <td className="py-3.5 pr-4 text-slate-400">Std {s.class}</td>
            <td className="py-3.5 pr-4"><StatusBadge status={s.isEmailVerified ? 'Confirmed' : 'Pending'} /></td>
            <td className="py-3.5 pr-4"><StatusBadge status={s.isActive ? 'Active' : 'Cancelled'} /></td>
            <td className="py-3.5 pr-4 text-slate-500">{fmtDate(s.createdAt)}</td>
            <td className="py-3.5">
              <button
                onClick={() => handleDelete(s._id, s.name)}
                disabled={deleting === s._id}
                className="flex items-center gap-1 text-[10px] font-bold text-rose-400 hover:text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 px-2 py-1 rounded-lg transition-all cursor-pointer disabled:opacity-50"
              >
                <Trash2 className="w-3 h-3" />
                {deleting === s._id ? '...' : 'Delete'}
              </button>
            </td>
          </tr>
        ))}
      </AdminTable>
    </div>
  );
}

// ─────────────────────────────────────────────
// Page: Schools
// ─────────────────────────────────────────────
function SchoolsPage() {
  const [data, setData]       = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery]     = useState('');

  // Verification modal state
  const [verifySchoolItem, setVerifySchoolItem] = useState(null);
  const [verifyStatus, setVerifyStatus] = useState(true);
  const [remarks, setRemarks] = useState('');
  const [savingVerify, setSavingVerify] = useState(false);

  // Participants modal state
  const [selectedSchoolForParticipants, setSelectedSchoolForParticipants] = useState(null);
  const [selectedSchoolForDetails, setSelectedSchoolForDetails] = useState(null);
  const [schoolParticipants, setSchoolParticipants] = useState([]);
  const [loadingParticipants, setLoadingParticipants] = useState(false);
  const [participantsQuery, setParticipantsQuery] = useState('');
  const [participantsClassFilter, setParticipantsClassFilter] = useState('');

  // Performance modal state
  const [selectedSchoolForPerformance, setSelectedSchoolForPerformance] = useState(null);
  const [performanceData, setPerformanceData] = useState(null);
  const [loadingPerformance, setLoadingPerformance] = useState(false);
  const [selectedStudents, setSelectedStudents] = useState([]);
  
  // Performance filters
  const [perfSearch, setPerfSearch] = useState('');
  const [perfClass, setPerfClass] = useState('');
  const [perfSection, setPerfSection] = useState('');
  const [perfStatus, setPerfStatus] = useState('');

  const loadSchools = async () => {
    setLoading(true);
    try {
      const res = await schoolAPI.list({ limit: 100 });
      const list = res?.data?.data?.schools || res?.data?.schools || res?.data?.data || [];
      setData(Array.isArray(list) && list.length ? list : MOCK_SCHOOLS);
    } catch { setData(MOCK_SCHOOLS); }
    finally { setLoading(false); }
  };

  useEffect(() => {
    loadSchools();
  }, []);

  useEffect(() => {
    if (!selectedSchoolForParticipants) return;
    (async () => {
      setLoadingParticipants(true);
      try {
        const res = await participantAPI.listForSchool(selectedSchoolForParticipants._id, { limit: 200 });
        const list = res?.data?.data?.participants || res?.data?.data || [];
        setSchoolParticipants(Array.isArray(list) ? list : []);
      } catch (err) {
        console.error(err);
        setSchoolParticipants([]);
      } finally {
        setLoadingParticipants(false);
      }
    })();
  }, [selectedSchoolForParticipants]);

  // Fetch school performance reports
  useEffect(() => {
    if (!selectedSchoolForPerformance) {
      setPerformanceData(null);
      setSelectedStudents([]);
      return;
    }
    (async () => {
      setLoadingPerformance(true);
      try {
        const res = await schoolAPI.getResultsAnalytics(selectedSchoolForPerformance._id);
        setPerformanceData(res?.data || res?.data?.data || null);
      } catch (err) {
        console.error(err);
        alert('Failed to load performance analytics for this school.');
        setSelectedSchoolForPerformance(null);
      } finally {
        setLoadingPerformance(false);
      }
    })();
  }, [selectedSchoolForPerformance]);

  const handleVerifySubmit = async (e) => {
    e.preventDefault();
    if (!verifySchoolItem) return;
    setSavingVerify(true);
    try {
      await schoolAPI.verify(verifySchoolItem._id, { isVerified: verifyStatus, remarks });
      // Update local state
      setData(prev => prev.map(s => s._id === verifySchoolItem._id ? { ...s, isVerified: verifyStatus } : s));
      setVerifySchoolItem(null);
      setRemarks('');
    } catch (err) {
      alert(err?.message || 'Verification update failed.');
    } finally {
      setSavingVerify(false);
    }
  };

  const handleExportSchools = () => {
    const formatted = data.map(s => ({
      "School Name": s.name,
      "Board": s.board,
      "City": s.address?.city || "",
      "State": s.address?.state || "",
      "Registered Students": s.registeredStudentsCount || 0,
      "Verification Status": s.isVerified ? "Verified" : "Pending",
      "Email": s.contactEmail,
      "Phone": s.contactPhone,
      "Principal": s.principalName || "",
      "Coordinator Name": s.coordinator?.name || "",
      "Coordinator Email": s.coordinator?.email || "",
      "Coordinator Phone": s.coordinator?.phone || ""
    }));
    const ws = XLSX.utils.json_to_sheet(formatted);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Schools");
    XLSX.writeFile(wb, "BAIO_Registered_Schools.xlsx");
  };

  const exportStudentResultsExcel = (schoolName, studentsToExport) => {
    const formatted = studentsToExport.map(s => ({
      "Roll Number": s.result?.rollNumber || "N/A",
      "Student Name": s.name,
      "Class/Grade": s.class,
      "Section": s.section || "—",
      "Gender": s.gender || "—",
      "Logical Reasoning": s.result?.scores?.logicalReasoning ?? "N/A",
      "Algorithmic Thinking": s.result?.scores?.algorithmicThinking ?? "N/A",
      "AI Core": s.result?.scores?.aiCore ?? "N/A",
      "Total Marks Obtained": s.result?.scores?.totalMarksObtained ?? "N/A",
      "Maximum Marks": s.result?.totalMaxMarks ?? "N/A",
      "Percentage": s.result?.percentage !== undefined ? `${s.result.percentage}%` : "N/A",
      "National Percentile": s.result?.percentile !== undefined ? `${s.result.percentile}%` : "N/A",
      "National Rank": s.result?.rankings?.national ?? "N/A",
      "State Rank": s.result?.rankings?.state ?? "N/A",
      "School Rank": s.result?.rankings?.school ?? "N/A",
      "Status": s.result?.qualificationStatus || "Registered"
    }));
    const ws = XLSX.utils.json_to_sheet(formatted);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Student Results");
    XLSX.writeFile(wb, `${schoolName || 'School'}_Student_Results.xlsx`);
  };

  const exportClassStatsExcel = (schoolName, statsObj) => {
    const cData = Object.keys(statsObj).map(cls => ({
      "Class": `Class ${cls}`,
      "Total Registered": statsObj[cls].total,
      "Appeared": statsObj[cls].appeared,
      "Average Marks": statsObj[cls].average,
      "Highest Mark": statsObj[cls].highest,
      "Lowest Mark": statsObj[cls].lowest
    }));
    const ws = XLSX.utils.json_to_sheet(cData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Class Stats");
    XLSX.writeFile(wb, `${schoolName || 'School'}_Class_Stats.xlsx`);
  };

  const exportSectionStatsExcel = (schoolName, sectionsList) => {
    const sData = sectionsList.map(sec => ({
      "Class": `Class ${sec.class}`,
      "Section": sec.section,
      "Appeared": sec.appeared,
      "Average Marks": sec.average,
      "Highest Mark": sec.highest,
      "Lowest Mark": sec.lowest
    }));
    const ws = XLSX.utils.json_to_sheet(sData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Section Stats");
    XLSX.writeFile(wb, `${schoolName || 'School'}_Section_Stats.xlsx`);
  };

  const handleSelectStudent = (id) => {
    if (selectedStudents.includes(id)) {
      setSelectedStudents(selectedStudents.filter(sid => sid !== id));
    } else {
      setSelectedStudents([...selectedStudents, id]);
    }
  };

  const handleSelectAllFiltered = (filteredList) => {
    const allFilteredIds = filteredList.map(s => s._id);
    const hasAllSelected = allFilteredIds.every(id => selectedStudents.includes(id));
    if (hasAllSelected) {
      setSelectedStudents(selectedStudents.filter(id => !allFilteredIds.includes(id)));
    } else {
      const merged = Array.from(new Set([...selectedStudents, ...allFilteredIds]));
      setSelectedStudents(merged);
    }
  };

  // Filter student performance table
  const getFilteredPerformanceStudents = () => {
    if (!performanceData?.students) return [];
    return performanceData.students.filter(s => {
      const matchesSearch = s.name.toLowerCase().includes(perfSearch.toLowerCase()) || 
                            (s.result?.rollNumber || '').toLowerCase().includes(perfSearch.toLowerCase());
      const matchesClass = !perfClass || s.class === perfClass;
      const matchesSection = !perfSection || s.section?.toUpperCase() === perfSection.toUpperCase();
      const matchesStatus = !perfStatus || (s.result?.qualificationStatus || 'Registered') === perfStatus;
      return matchesSearch && matchesClass && matchesSection && matchesStatus;
    });
  };

  const filteredPerformanceStudents = getFilteredPerformanceStudents();

  const filtered = data.filter(s => {
    const q = query.toLowerCase();
    return (s.name || '').toLowerCase().includes(q) ||
           (s.address?.city || '').toLowerCase().includes(q) ||
           (s.address?.state || '').toLowerCase().includes(q);
  });

  return (
    <div className="admin-card p-6">
      <TableToolbar query={query} onQuery={setQuery} placeholder="Search school, city…" onExport={handleExportSchools} />
      <AdminTable loading={loading} headers={['School Name', 'Board', 'City', 'State', 'Students', 'Verified', 'Email', 'Actions']}>
        {filtered.map(s => (
          <tr key={s._id}>
            <td className="py-3.5 pr-4 max-w-[200px] truncate">
              <button
                onClick={() => setSelectedSchoolForDetails(s)}
                className="text-left font-bold text-[#001F5E] hover:text-brand-orange hover:underline cursor-pointer flex items-center gap-1.5"
                title="Click to view full details"
              >
                <Eye className="w-3.5 h-3.5 text-slate-405 shrink-0" />
                <span>{s.name}</span>
              </button>
            </td>
            <td className="py-3.5 pr-4">
              <span className="badge-blue inline-block px-2 py-0.5 rounded-full text-[10px] font-bold">{s.board}</span>
            </td>
            <td className="py-3.5 pr-4 text-slate-400">{s.address?.city || '—'}</td>
            <td className="py-3.5 pr-4 text-slate-400">{s.address?.state || '—'}</td>
            <td className="py-3.5 pr-4">
              <button
                onClick={() => setSelectedSchoolForParticipants(s)}
                className="text-blue-500 hover:text-blue-600 hover:underline font-extrabold cursor-pointer"
              >
                {fmt(s.registeredStudentsCount)} Students
              </button>
            </td>
            <td className="py-3.5 pr-4"><StatusBadge status={s.isVerified ? 'Confirmed' : 'Pending'} /></td>
            <td className="py-3.5 text-slate-500 text-[10px]">{s.contactEmail}</td>
            <td className="py-3.5 text-right">
              <div className="flex gap-1.5 justify-end">
                <button
                  onClick={() => {
                    setVerifySchoolItem(s);
                    setVerifyStatus(!s.isVerified);
                    setRemarks('');
                  }}
                  className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-lg border transition-all cursor-pointer ${
                    s.isVerified
                      ? 'text-rose-600 hover:text-rose-700 bg-rose-50 border-rose-200'
                      : 'text-brand-orange hover:text-brand-orange/90 bg-orange-50 border-brand-orange/20'
                  }`}
                >
                  {s.isVerified ? 'Revoke' : 'Verify'}
                </button>
                <button
                  onClick={() => setSelectedSchoolForPerformance(s)}
                  className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-[#001F5E] transition-all cursor-pointer"
                >
                  <BarChart3 className="w-3 h-3 text-slate-500" />
                  <span>Performance</span>
                </button>
              </div>
            </td>
          </tr>
        ))}
      </AdminTable>

      {/* School Full Details Modal */}
      {selectedSchoolForDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white border-4 border-brand-navy rounded-3xl p-6 max-w-2xl w-full shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedSchoolForDetails(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-650 font-bold text-lg cursor-pointer"
            >
              ✕
            </button>
            
            <div className="flex items-center gap-2 mb-3">
              <School className="w-5 h-5 text-brand-orange" />
              <h3 className="text-base font-black text-brand-navy">School Profile Details</h3>
            </div>

            <div className="border-b border-slate-200 pb-4 mb-4">
              <h4 className="text-sm font-bold text-slate-800">{selectedSchoolForDetails.name}</h4>
              <div className="flex flex-wrap gap-2 mt-2">
                <span className="badge-blue px-2.5 py-0.5 rounded-full text-[10px] font-bold">
                  Board: {selectedSchoolForDetails.board}
                </span>
                <span className="badge-indigo px-2.5 py-0.5 rounded-full text-[10px] font-bold">
                  Affiliation: {selectedSchoolForDetails.affiliationNumber}
                </span>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                  selectedSchoolForDetails.isVerified ? 'badge-green' : 'badge-amber'
                }`}>
                  Status: {selectedSchoolForDetails.isVerified ? 'Verified' : 'Pending'}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Section 1: Institution Info */}
              <div className="space-y-3">
                <h5 className="text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-slate-100 pb-1">
                  Institution Info
                </h5>
                <div className="space-y-2 text-xs">
                  <div>
                    <span className="text-slate-400 font-bold">Principal Name:</span>
                    <p className="text-slate-850 font-semibold">{selectedSchoolForDetails.principalName || '—'}</p>
                  </div>
                  <div>
                    <span className="text-slate-400 font-bold">Primary Email:</span>
                    <p className="text-slate-850 font-semibold">{selectedSchoolForDetails.contactEmail || '—'}</p>
                  </div>
                  <div>
                    <span className="text-slate-400 font-bold">Primary Phone:</span>
                    <p className="text-slate-850 font-semibold font-mono">{selectedSchoolForDetails.contactPhone || '—'}</p>
                  </div>
                </div>
              </div>

              {/* Section 2: Coordinator Details */}
              <div className="space-y-3">
                <h5 className="text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-slate-100 pb-1">
                  Coordinator Details
                </h5>
                <div className="space-y-2 text-xs">
                  <div>
                    <span className="text-slate-400 font-bold">Coordinator Name:</span>
                    <p className="text-slate-855 font-semibold">{selectedSchoolForDetails.coordinator?.name || '—'}</p>
                  </div>
                  <div>
                    <span className="text-slate-400 font-bold">Coordinator Email:</span>
                    <p className="text-slate-855 font-semibold">{selectedSchoolForDetails.coordinator?.email || '—'}</p>
                  </div>
                  <div>
                    <span className="text-slate-400 font-bold">Coordinator Phone:</span>
                    <p className="text-slate-855 font-semibold font-mono">{selectedSchoolForDetails.coordinator?.phone || '—'}</p>
                  </div>
                </div>
              </div>

              {/* Section 3: Address Details */}
              <div className="space-y-3 md:col-span-2">
                <h5 className="text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-slate-100 pb-1">
                  Geographical Location
                </h5>
                <div className="space-y-2.5 text-xs text-slate-800 font-semibold">
                  <div>
                    <span className="text-slate-400 font-bold">Street Address:</span>
                    <p>{selectedSchoolForDetails.address?.street || '—'}</p>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <div>
                      <span className="text-slate-400 font-bold">City:</span>
                      <p>{selectedSchoolForDetails.address?.city || '—'}</p>
                    </div>
                    <div>
                      <span className="text-slate-400 font-bold">State:</span>
                      <p>{selectedSchoolForDetails.address?.state || '—'}</p>
                    </div>
                    <div>
                      <span className="text-slate-400 font-bold">ZIP Code:</span>
                      <p className="font-mono">{selectedSchoolForDetails.address?.zip || '—'}</p>
                    </div>
                    <div>
                      <span className="text-slate-400 font-bold">Country:</span>
                      <p>{selectedSchoolForDetails.address?.country || 'India'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 mt-6 pt-4 border-t border-slate-200">
              <button
                onClick={() => {
                  setSelectedSchoolForParticipants(selectedSchoolForDetails);
                  setSelectedSchoolForDetails(null);
                }}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-[0_2px_0px_0px_#1e3a8a] border-2 border-brand-navy"
              >
                <ClipboardList className="w-4 h-4" />
                <span>View Registered Students ({selectedSchoolForDetails.registeredStudentsCount || 0})</span>
              </button>
              
              <button
                onClick={() => setSelectedSchoolForDetails(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 border border-slate-350 text-slate-600 rounded-xl text-xs font-bold transition-all cursor-pointer text-center"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Verification Modal */}
      {verifySchoolItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white border-4 border-brand-navy rounded-3xl p-6 max-w-md w-full shadow-2xl relative">
            <button
              onClick={() => setVerifySchoolItem(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 font-bold text-lg cursor-pointer"
            >
              ✕
            </button>
            <h3 className="text-base font-black text-brand-navy mb-2">School Verification</h3>
            <p className="text-xs text-slate-500 mb-4">
              Update verification status for <strong className="text-slate-800">{verifySchoolItem.name}</strong>.
            </p>
            <form onSubmit={handleVerifySubmit} className="space-y-4 !border-0 !p-0 !shadow-none">
              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest">Status</label>
                <select
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800"
                  value={verifyStatus ? 'true' : 'false'}
                  onChange={e => setVerifyStatus(e.target.value === 'true')}
                >
                  <option value="true">Verify & Approve</option>
                  <option value="false">Reject / Pending</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest">Remarks (Optional)</label>
                <textarea
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800"
                  rows={3}
                  placeholder="Reason for verification change or remarks..."
                  value={remarks}
                  onChange={e => setRemarks(e.target.value)}
                />
              </div>
              <div className="flex gap-2 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setVerifySchoolItem(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 border border-slate-350 text-slate-600 rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingVerify}
                  className="px-4 py-2 bg-brand-orange hover:bg-brand-orange/90 text-white rounded-xl text-xs font-bold transition-all cursor-pointer disabled:opacity-50"
                >
                  {savingVerify ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Participants Detail Modal */}
      {selectedSchoolForParticipants && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white border-4 border-brand-navy rounded-3xl p-6 max-w-4xl w-full max-h-[85vh] flex flex-col shadow-2xl relative">
            <button
              onClick={() => setSelectedSchoolForParticipants(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 font-bold text-lg cursor-pointer"
            >
              ✕
            </button>
            <h3 className="text-base font-black text-brand-navy mb-1">School Participants</h3>
            <p className="text-xs text-slate-500 mb-4">
              Registered participants for <strong className="text-slate-800">{selectedSchoolForParticipants.name}</strong>
            </p>

            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
              <div className="relative max-w-xs w-full">
                <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search student name..."
                  value={participantsQuery}
                  onChange={e => setParticipantsQuery(e.target.value)}
                  className="w-full bg-white border border-slate-250 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-brand-orange"
                />
              </div>
              <select
                className="bg-white border border-slate-250 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-brand-orange max-w-[150px] w-full"
                value={participantsClassFilter}
                onChange={e => setParticipantsClassFilter(e.target.value)}
              >
                <option value="">All Classes</option>
                {['6', '7', '8', '9', '10', '11', '12'].map(c => (
                  <option key={c} value={c}>Class {c}</option>
                ))}
              </select>
            </div>

            {/* Table */}
            <div className="flex-1 overflow-y-auto min-h-0 border-t border-slate-100 pt-3">
              <AdminTable
                loading={loadingParticipants}
                headers={['Name', 'Class', 'Section', 'Roll No.', 'Gender', 'Division']}
                emptyMsg="No participants submitted by this school."
              >
                {schoolParticipants
                  .filter(p => {
                    const q = participantsQuery.toLowerCase();
                    const matchesSearch = (p.name || '').toLowerCase().includes(q);
                    const matchesClass = !participantsClassFilter || p.class === participantsClassFilter;
                    return matchesSearch && matchesClass;
                  })
                  .map(p => (
                    <tr key={p._id}>
                      <td className="py-2.5 pr-4 font-semibold text-slate-800">{p.name}</td>
                      <td className="py-2.5 pr-4 text-slate-600">Class {p.class}</td>
                      <td className="py-2.5 pr-4 text-slate-555">{p.section || '—'}</td>
                      <td className="py-2.5 pr-4 font-mono text-[10px] text-slate-650">{p.rollNo || '—'}</td>
                      <td className="py-2.5 pr-4 text-slate-550">{p.gender || '—'}</td>
                      <td className="py-2.5 pr-4">
                        <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          p.division === 'Junior' ? 'badge-green' : 'badge-indigo'
                        }`}>{p.division || '—'}</span>
                      </td>
                    </tr>
                  ))}
              </AdminTable>
            </div>
            <div className="flex justify-end pt-4 mt-3 border-t border-slate-100">
              <button
                onClick={() => setSelectedSchoolForParticipants(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 border border-slate-350 text-slate-600 rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                Close Window
              </button>
            </div>
          </div>
        </div>
      )}

      {/* School Performance Modal */}
      {selectedSchoolForPerformance && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white border-4 border-brand-navy rounded-3xl p-6 max-w-5xl w-full max-h-[90vh] flex flex-col shadow-2xl relative">
            <button
              onClick={() => setSelectedSchoolForPerformance(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-650 font-bold text-lg cursor-pointer"
            >
              ✕
            </button>
            
            <div className="flex items-center gap-2 mb-1">
              <BarChart3 className="w-5 h-5 text-brand-orange" />
              <h3 className="text-base font-black text-brand-navy">School Performance Reports</h3>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              Detailed analytics, class metrics, and candidate scorecard listings for <strong className="text-slate-800">{selectedSchoolForPerformance.name}</strong>.
            </p>

            {loadingPerformance ? (
              <div className="flex-1 flex flex-col items-center justify-center py-20 space-y-3">
                <div className="w-10 h-10 border-4 border-[#001F5E] border-t-transparent rounded-full animate-spin" />
                <p className="text-xs text-slate-500 font-bold">Loading Performance Metrics...</p>
              </div>
            ) : !performanceData || !performanceData.overview || performanceData.overview.totalRegistered === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center py-12 text-center space-y-4">
                <div className="w-12 h-12 bg-slate-50 border border-slate-200 rounded-full flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-slate-400" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-bold text-slate-700">No Performance Data Available</p>
                  <p className="text-xs text-slate-400 max-w-md">
                    Either no students have been submitted, or results have not been calculated/published yet.
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto min-h-0 space-y-6 pr-1.5">
                {/* 1. Overview cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { label: 'Registered Candidates', value: performanceData.overview.totalRegistered },
                    { label: 'Appeared Candidates', value: performanceData.overview.totalAppeared },
                    { label: 'School Average Score', value: `${performanceData.overview.averageScore} / 100` },
                    { label: 'Qualifiers Count', value: `${performanceData.overview.qualifiedCount} (${performanceData.overview.qualificationRate}%)` },
                  ].map((card, i) => (
                    <div key={i} className="bg-slate-50 border-2 border-brand-navy/10 rounded-2xl p-4">
                      <p className="text-[9px] text-slate-400 font-black uppercase tracking-wider">{card.label}</p>
                      <p className="font-heading font-black text-[#001F5E] text-xl mt-1">{card.value}</p>
                    </div>
                  ))}
                </div>

                {/* 2. Grade and Section stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Grade-wise table */}
                  <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white">
                    <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
                      <span className="text-xs font-bold text-slate-700">Grade Level Reports</span>
                      <button
                        onClick={() => exportClassStatsExcel(selectedSchoolForPerformance.name, performanceData.classStats)}
                        className="text-[10px] text-brand-green font-extrabold flex items-center gap-1 border border-brand-green/20 px-2 py-1 rounded bg-white hover:bg-emerald-50 cursor-pointer"
                      >
                        <Download className="w-3 h-3" /> Excel
                      </button>
                    </div>
                    <table className="w-full text-xs">
                      <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
                        <tr>
                          <th className="px-3 py-2 text-left">Class</th>
                          <th className="px-3 py-2 text-left">Appeared</th>
                          <th className="px-3 py-2 text-left">Average</th>
                          <th className="px-3 py-2 text-left">Highest</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Object.keys(performanceData.classStats).map(cls => (
                          <tr key={cls} className="border-b border-slate-100 last:border-none font-semibold text-slate-700 font-bold">
                            <td className="px-3 py-2">Class {cls}</td>
                            <td className="px-3 py-2">{performanceData.classStats[cls].appeared}</td>
                            <td className="px-3 py-2 text-brand-orange">{performanceData.classStats[cls].average}</td>
                            <td className="px-3 py-2 text-brand-green">{performanceData.classStats[cls].highest}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Section-wise table */}
                  <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white">
                    <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
                      <span className="text-xs font-bold text-slate-700">Section Level Reports</span>
                      <button
                        onClick={() => exportSectionStatsExcel(selectedSchoolForPerformance.name, performanceData.sectionStats)}
                        className="text-[10px] text-brand-green font-extrabold flex items-center gap-1 border border-brand-green/20 px-2 py-1 rounded bg-white hover:bg-emerald-50 cursor-pointer"
                      >
                        <Download className="w-3 h-3" /> Excel
                      </button>
                    </div>
                    <div className="max-h-[200px] overflow-y-auto">
                      <table className="w-full text-xs">
                        <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200 sticky top-0">
                          <tr>
                            <th className="px-3 py-2 text-left">Class & Sec</th>
                            <th className="px-3 py-2 text-left">Appeared</th>
                            <th className="px-3 py-2 text-left">Average</th>
                            <th className="px-3 py-2 text-left">Highest</th>
                          </tr>
                        </thead>
                        <tbody>
                          {performanceData.sectionStats.length === 0 ? (
                            <tr>
                              <td colSpan={4} className="text-center py-4 text-slate-400">No section-wise data.</td>
                            </tr>
                          ) : (
                            performanceData.sectionStats.map(sec => (
                              <tr key={sec.key} className="border-b border-slate-100 last:border-none font-semibold text-slate-700 font-bold">
                                <td className="px-3 py-2">Class {sec.class} - {sec.section}</td>
                                <td className="px-3 py-2">{sec.appeared}</td>
                                <td className="px-3 py-2 text-brand-orange">{sec.average}</td>
                                <td className="px-3 py-2 text-brand-green">{sec.highest}</td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                {/* 3. Candidate scorecard search and listing */}
                <div className="border border-slate-250 rounded-2xl overflow-hidden bg-white">
                  <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <span className="text-xs font-bold text-brand-navy">Individual Candidate Scorecards</span>
                    
                    {/* Filters */}
                    <div className="flex flex-wrap gap-2">
                      <input
                        type="text"
                        placeholder="Search roll/name..."
                        value={perfSearch}
                        onChange={e => setPerfSearch(e.target.value)}
                        className="bg-white border border-slate-200 rounded-lg px-2 py-1 text-[11px] w-[140px] focus:outline-none focus:border-brand-orange font-semibold text-slate-700"
                      />
                      <select
                        value={perfClass}
                        onChange={e => setPerfClass(e.target.value)}
                        className="bg-white border border-slate-200 rounded-lg px-2 py-1 text-[11px] focus:outline-none focus:border-brand-orange text-slate-750 font-semibold"
                      >
                        <option value="">All Classes</option>
                        {['6', '7', '8', '9', '10', '11', '12'].map(c => (
                          <option key={c} value={c}>Class {c}</option>
                        ))}
                      </select>
                      <select
                        value={perfStatus}
                        onChange={e => setPerfStatus(e.target.value)}
                        className="bg-white border border-slate-200 rounded-lg px-2 py-1 text-[11px] focus:outline-none focus:border-brand-orange text-slate-750 font-semibold"
                      >
                        <option value="">All Statuses</option>
                        <option value="Registered">Registered</option>
                        <option value="Qualified">Qualified</option>
                        <option value="Participated">Participated</option>
                        <option value="MeritAwardee">Merit Awardee</option>
                        <option value="NationalRanker">National Ranker</option>
                      </select>
                    </div>
                  </div>

                  {/* Bulk Actions Bar */}
                  <div className="px-4 py-2 border-b border-slate-100 bg-slate-50/50 flex flex-wrap gap-2 items-center text-[10px]">
                    <span className="font-extrabold text-slate-500 uppercase">{selectedStudents.length} Selected</span>
                    <button
                      onClick={() => {
                        const list = performanceData.students.filter(s => selectedStudents.includes(s._id));
                        exportStudentResultsExcel(selectedSchoolForPerformance.name, list);
                      }}
                      disabled={selectedStudents.length === 0}
                      className="px-2 py-1 bg-[#001F5E] text-white rounded font-bold disabled:opacity-40 cursor-pointer flex items-center gap-1 shadow-sm"
                    >
                      <FileSpreadsheet className="w-3 h-3" /> Export Selected Chunk (Excel)
                    </button>
                    <button
                      onClick={() => {
                        const filteredList = filteredPerformanceStudents;
                        exportStudentResultsExcel(selectedSchoolForPerformance.name, filteredList);
                      }}
                      className="px-2 py-1 border border-brand-green text-brand-green hover:bg-emerald-50 rounded font-bold cursor-pointer flex items-center gap-1 bg-white"
                    >
                      <Download className="w-3 h-3" /> Export All Filtered (Excel)
                    </button>
                  </div>

                  <table className="w-full text-xs">
                    <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
                      <tr>
                        <th className="px-3 py-2 text-left w-8">
                          <button
                            onClick={() => handleSelectAllFiltered(filteredPerformanceStudents)}
                            className="text-slate-400 hover:text-[#001F5E] cursor-pointer"
                          >
                            {filteredPerformanceStudents.length > 0 && filteredPerformanceStudents.every(s => selectedStudents.includes(s._id)) ? (
                              <CheckSquare className="w-3.5 h-3.5 text-brand-navy" />
                            ) : (
                              <Square className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </th>
                        <th className="px-3 py-2 text-left text-brand-navy font-bold">Roll Number</th>
                        <th className="px-3 py-2 text-left text-brand-navy font-bold">Name</th>
                        <th className="px-3 py-2 text-left text-brand-navy font-bold">Class & Sec</th>
                        <th className="px-3 py-2 text-left text-brand-navy font-bold">Scores (L/A/AI)</th>
                        <th className="px-3 py-2 text-left text-brand-navy font-bold">Total</th>
                        <th className="px-3 py-2 text-left text-brand-navy font-bold">Percentile</th>
                        <th className="px-3 py-2 text-left text-brand-navy font-bold">Rank</th>
                        <th className="px-3 py-2 text-left text-brand-navy font-bold">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredPerformanceStudents.length === 0 ? (
                        <tr>
                          <td colSpan={9} className="text-center py-6 text-slate-400 font-semibold">No candidates match the criteria.</td>
                        </tr>
                      ) : (
                        filteredPerformanceStudents.map(s => {
                          const isChecked = selectedStudents.includes(s._id);
                          return (
                            <tr key={s._id} className={`border-b border-slate-100 last:border-none font-semibold text-slate-750 hover:bg-slate-50/50 transition-colors ${isChecked ? 'bg-indigo-50/20' : ''}`}>
                              <td className="px-3 py-2">
                                <button onClick={() => handleSelectStudent(s._id)} className="text-slate-400 hover:text-brand-navy cursor-pointer">
                                  {isChecked ? <CheckSquare className="w-3.5 h-3.5 text-brand-navy" /> : <Square className="w-3.5 h-3.5" />}
                                </button>
                              </td>
                              <td className="px-3 py-2 font-bold text-brand-navy">{s.result?.rollNumber || '—'}</td>
                              <td className="px-3 py-2">{s.name}</td>
                              <td className="px-3 py-2">Class {s.class} - {s.section || '—'}</td>
                              <td className="px-3 py-2 font-mono text-[10px]">
                                {s.result ? `${s.result.scores?.logicalReasoning ?? 0}/${s.result.scores?.algorithmicThinking ?? 0}/${s.result.scores?.aiCore ?? 0}` : '—'}
                              </td>
                              <td className="px-3 py-2 text-brand-orange font-bold">
                                {s.result ? `${s.result.scores?.totalMarksObtained ?? 0}/${s.result.totalMaxMarks ?? 100}` : '—'}
                              </td>
                              <td className="px-3 py-2 font-mono">{s.result ? `${s.result.percentile}%` : '—'}</td>
                              <td className="px-3 py-2 text-slate-500">{s.result?.rankings?.national ?? '—'}</td>
                              <td className="px-3 py-2">
                                {s.result ? (
                                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold tracking-wider ${
                                    s.result.qualificationStatus === 'Qualified' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                                    s.result.qualificationStatus === 'MeritAwardee' ? 'bg-purple-50 text-purple-700 border border-purple-200' :
                                    s.result.qualificationStatus === 'NationalRanker' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                                    'bg-slate-50 text-slate-500 border border-slate-200'
                                  }`}>
                                    {s.result.qualificationStatus}
                                  </span>
                                ) : (
                                  <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold tracking-wider bg-slate-50 text-slate-400 border border-slate-150">Registered</span>
                                )}
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            
            <div className="flex justify-end pt-4 mt-3 border-t border-slate-150">
              <button
                onClick={() => setSelectedSchoolForPerformance(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 border border-slate-350 text-slate-600 rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                Close Window
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// Page: Participants (Global list)
// ─────────────────────────────────────────────
function ParticipantsPage() {
  const [data, setData]       = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery]     = useState('');
  const [classFilter, setClassFilter] = useState('');
  const [divisionFilter, setDivisionFilter] = useState('');
  const [page, setPage]       = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await participantAPI.list({
        page,
        limit: 50,
        class: classFilter || undefined,
        division: divisionFilter || undefined,
        search: query || undefined
      });
      const list = res?.data?.data?.participants || res?.data?.participants || [];
      setData(list);
      setTotalPages(res?.data?.data?.pagination?.totalPages || 1);
    } catch {
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [page, classFilter, divisionFilter, query]);

  useEffect(() => {
    load();
  }, [load]);

  const handleExport = () => {
    const formatted = data.map(p => ({
      "Student Name": p.name,
      "Class/Grade": p.class,
      "Section": p.section || "—",
      "Roll Number": p.rollNo || "—",
      "Gender": p.gender || "—",
      "Division": p.division || "—",
      "School Name": p.schoolId?.name || "—"
    }));
    const ws = XLSX.utils.json_to_sheet(formatted);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Participants");
    XLSX.writeFile(wb, "BAIO_Global_Participants_List.xlsx");
  };

  return (
    <div className="admin-card p-6 animate-fade-up">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5">
        <div className="relative max-w-xs w-full">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search student name…"
            value={query}
            onChange={e => { setQuery(e.target.value); setPage(1); }}
            className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-brand-orange font-semibold"
          />
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <select
            className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-brand-orange font-semibold"
            value={classFilter}
            onChange={e => { setClassFilter(e.target.value); setPage(1); }}
          >
            <option value="">All Classes</option>
            {['6', '7', '8', '9', '10', '11', '12'].map(c => (
              <option key={c} value={c}>Class {c}</option>
            ))}
          </select>
          <select
            className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-brand-orange font-semibold"
            value={divisionFilter}
            onChange={e => { setDivisionFilter(e.target.value); setPage(1); }}
          >
            <option value="">All Divisions</option>
            <option value="Junior">Junior</option>
            <option value="Senior">Senior</option>
          </select>
          <button
            onClick={load}
            className="p-2 bg-slate-100 hover:bg-slate-200 border border-slate-350 rounded-xl text-slate-600 transition-all cursor-pointer"
            title="Refresh"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleExport}
            disabled={!data || data.length === 0}
            className="flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-emerald-50 text-brand-green border border-brand-green/20 rounded-xl text-xs font-bold transition-all cursor-pointer disabled:opacity-50"
            title="Export current page list to Excel"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Excel</span>
          </button>
        </div>
      </div>

      <AdminTable loading={loading} headers={['Name', 'Class', 'Section', 'Roll No.', 'Gender', 'Division', 'School']}>
        {data.map(p => (
          <tr key={p._id}>
            <td className="py-3.5 pr-4 font-semibold text-slate-800">{p.name}</td>
            <td className="py-3.5 pr-4 text-slate-600">Class {p.class}</td>
            <td className="py-3.5 pr-4 text-slate-500">{p.section || '—'}</td>
            <td className="py-3.5 pr-4 font-mono text-[10px] text-slate-600">{p.rollNo || '—'}</td>
            <td className="py-3.5 pr-4 text-slate-500">{p.gender || '—'}</td>
            <td className="py-3.5 pr-4">
              <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                p.division === 'Junior' ? 'badge-green' : 'badge-indigo'
              }`}>{p.division}</span>
            </td>
            <td className="py-3.5 text-slate-800 font-medium truncate max-w-[180px]" title={p.schoolId?.name}>{p.schoolId?.name || '—'}</td>
          </tr>
        ))}
      </AdminTable>

      {/* Pagination controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-5 mt-5 border-t border-slate-100">
          <span className="text-xs text-slate-500">
            Page {page} of {totalPages}
          </span>
          <div className="flex gap-2">
            <button
              disabled={page === 1}
              onClick={() => setPage(p => Math.max(1, p - 1))}
              className="p-2 bg-slate-100 hover:bg-slate-200 border border-slate-350 disabled:opacity-40 rounded-xl transition-all cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4 text-slate-650" />
            </button>
            <button
              disabled={page === totalPages}
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              className="p-2 bg-slate-100 hover:bg-slate-200 border border-slate-355 disabled:opacity-40 rounded-xl transition-all cursor-pointer"
            >
              <ChevronRight className="w-4 h-4 text-slate-650" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function AnnouncementsPage() {
  const [data, setData]       = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery]     = useState('');
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving]   = useState(false);
  const [deleting, setDeleting] = useState(null);
  
  const [form, setForm] = useState({
    title: '',
    content: '',
    category: 'General',
    targetAudience: 'All',
    isPinned: false
  });

  const load = async () => {
    setLoading(true);
    try {
      const res = await announcementAPI.list({ limit: 40 });
      const list = res?.data?.data?.announcements || res?.data?.data || res?.data || [];
      setData(Array.isArray(list) ? list : MOCK_ANNOUNCEMENTS);
    } catch { 
      setData(MOCK_ANNOUNCEMENTS); 
    } finally { 
      setLoading(false); 
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await announcementAPI.create(form);
      setShowForm(false);
      setForm({ title: '', content: '', category: 'General', targetAudience: 'All', isPinned: false });
      load();
    } catch (err) {
      alert(err?.message || 'Failed to create announcement.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this announcement bulletin?')) return;
    setDeleting(id);
    try {
      await announcementAPI.delete(id);
      setData(prev => prev.filter(a => a._id !== id));
    } catch (err) {
      alert(err?.message || 'Failed to delete announcement.');
    } finally {
      setDeleting(null);
    }
  };

  const CATEGORY_BADGE = { OlympiadInfo:'badge-green', Schedule:'badge-amber', Emergency:'badge-rose', General:'badge-slate' };

  const filtered = data.filter(a =>
    (a.title || '').toLowerCase().includes(query.toLowerCase()) ||
    (a.content || '').toLowerCase().includes(query.toLowerCase())
  );

  const inputCls = 'w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#FF8C00] transition-all font-semibold';
  const textareaCls = 'w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#FF8C00] transition-all resize-none font-semibold';

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <TableToolbar query={query} onQuery={setQuery} placeholder="Search announcement…" />
        <button 
          onClick={() => setShowForm(s => !s)}
          className="btn-secondary text-xs py-1.5 px-3 shrink-0 ml-3"
        >
          <Plus className="w-3.5 h-3.5 text-brand-orange" /> {showForm ? 'Cancel' : 'New Bulletin'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="space-y-4">
          <h3 className="text-sm font-bold text-[#001F5E]">Publish New Announcement</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="text-[10px] font-bold text-slate-555 uppercase tracking-widest block mb-1">Title *</label>
              <input required className={inputCls} placeholder="e.g. Admit Card Release Timeline" value={form.title} onChange={e => setForm(p => ({...p, title: e.target.value}))} />
            </div>
            <div className="col-span-2">
              <label className="text-[10px] font-bold text-slate-555 uppercase tracking-widest block mb-1">Content *</label>
              <textarea required className={textareaCls} rows={4} placeholder="Announcement content detail..." value={form.content} onChange={e => setForm(p => ({...p, content: e.target.value}))} />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-555 uppercase tracking-widest block mb-1">Category</label>
              <select className={inputCls} value={form.category} onChange={e => setForm(p => ({...p, category: e.target.value}))}>
                <option value="General">General</option>
                <option value="Schedule">Schedule</option>
                <option value="OlympiadInfo">OlympiadInfo</option>
                <option value="Emergency">Emergency</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-555 uppercase tracking-widest block mb-1">Target Audience</label>
              <select className={inputCls} value={form.targetAudience} onChange={e => setForm(p => ({...p, targetAudience: e.target.value}))}>
                <option value="All">All</option>
                <option value="Junior">Junior</option>
                <option value="Senior">Senior</option>
                <option value="Masters">Masters</option>
                <option value="Schools">Schools</option>
              </select>
            </div>
            <div className="col-span-2 flex items-center gap-2 pt-2">
              <input 
                id="isPinned"
                type="checkbox" 
                className="rounded border-slate-300 bg-white text-brand-orange focus:ring-0 focus:ring-offset-0" 
                checked={form.isPinned} 
                onChange={e => setForm(p => ({...p, isPinned: e.target.checked}))} 
              />
              <label htmlFor="isPinned" className="text-xs font-bold text-slate-700 cursor-pointer">Pin to Landing Page Highlights</label>
            </div>
          </div>
          <button type="submit" disabled={saving} className="btn-primary">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
            {saving ? 'Publishing…' : 'Publish Bulletin'}
          </button>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {loading
          ? Array.from({length:4}).map((_,i) => (
              <div key={i} className="admin-card p-5 animate-pulse space-y-3">
                <div className="h-3 w-20 bg-slate-100 rounded" />
                <div className="h-5 w-3/4 bg-slate-100 rounded" />
                <div className="h-3 w-1/2 bg-slate-100 rounded" />
              </div>
            ))
          : filtered.map(a => (
              <div key={a._id} className={`admin-card p-5 space-y-3 border flex flex-col justify-between ${a.isPinned ? 'border-brand-orange/30' : 'border-slate-200/60'}`}>
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${CATEGORY_BADGE[a.category] || 'badge-slate'}`}>
                      {a.category}
                    </span>
                    {a.isPinned && <Sparkles className="w-3.5 h-3.5 text-brand-orange" />}
                  </div>
                  <p className="text-sm font-bold text-slate-800 leading-snug">{a.title}</p>
                  <p className="text-xs text-slate-600 leading-relaxed font-medium">{a.content}</p>
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-500 pt-3 border-t border-slate-100 mt-2">
                  <span>Audience: {a.targetAudience || 'All'}</span>
                  <div className="flex items-center gap-3">
                    <span>{fmtDate(a.publishedAt)}</span>
                    <button 
                      onClick={() => handleDelete(a._id)}
                      disabled={deleting === a._id}
                      className="text-red-500 hover:text-red-700 font-bold underline cursor-pointer disabled:opacity-50"
                    >
                      {deleting === a._id ? 'Deleting...' : 'Delete'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
      </div>
    </div>
  );
}

// Page: Results
// ─────────────────────────────────────────────
function ResultsPage() {
  const [data, setData]       = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery]     = useState('');
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving]   = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [olympiads, setOlympiads]       = useState([]);
  const [schools, setSchools]           = useState([]);
  const [loadingOptions, setLoadingOptions] = useState(false);

  const [selectedSchoolForPublish, setSelectedSchoolForPublish] = useState('');
  const [publishingSchool, setPublishingSchool] = useState(false);
  const [publishingGlobal, setPublishingGlobal] = useState(false);

  const [form, setForm] = useState({
    participantId: '',
    olympiadId: '',
    rollNumber: '',
    logicalReasoning: 0,
    algorithmicThinking: 0,
    aiCore: 0,
    percentile: 90,
    nationalRank: 1,
    stateRank: 1,
    schoolRank: 1,
    qualificationStatus: 'Qualified',
    isPublished: true
  });

  const load = async () => {
    setLoading(true);
    try {
      const res = await resultAPI.list({ limit: 100 });
      const list = res?.data?.data?.results || res?.data?.results || [];
      setData(Array.isArray(list) ? list : MOCK_RESULTS);
    } catch { 
      setData(MOCK_RESULTS); 
    } finally { 
      setLoading(false); 
    }
  };

  const loadOptions = async () => {
    setLoadingOptions(true);
    try {
      const [pRes, oRes, sRes] = await Promise.all([
        participantAPI.list({ limit: 200 }),
        olympiadAPI.list(),
        schoolAPI.list({ limit: 100 })
      ]);
      setParticipants(pRes?.data?.data?.participants || pRes?.data?.participants || []);
      setOlympiads(oRes?.data?.data?.olympiads || oRes?.data?.data || oRes?.data || []);
      setSchools(sRes?.data?.data?.schools || sRes?.data?.schools || sRes?.data?.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingOptions(false);
    }
  };

  useEffect(() => {
    load();
    loadOptions();
  }, []);

  const handlePublishSchool = async (isPublished) => {
    if (!selectedSchoolForPublish) {
      alert('Please select a school first.');
      return;
    }
    const schoolName = schools.find(s => s._id === selectedSchoolForPublish)?.name || 'this school';
    if (!window.confirm(`Are you sure you want to ${isPublished ? 'PUBLISH' : 'UNPUBLISH'} results for ${schoolName}?`)) return;
    setPublishingSchool(true);
    try {
      await resultAPI.publishSchoolResults(selectedSchoolForPublish, isPublished);
      alert(`Successfully ${isPublished ? 'published' : 'unpublished'} results for ${schoolName}.`);
      load();
    } catch (err) {
      alert(err?.message || 'Publish operation failed.');
    } finally {
      setPublishingSchool(false);
    }
  };

  const handlePublishGlobal = async (isPublished) => {
    if (!window.confirm(`Are you sure you want to ${isPublished ? 'PUBLISH' : 'UNPUBLISH'} results for ALL schools globally?`)) return;
    setPublishingGlobal(true);
    try {
      await resultAPI.publishAllResults(isPublished);
      alert(`Successfully ${isPublished ? 'published' : 'unpublished'} all results globally.`);
      load();
    } catch (err) {
      alert(err?.message || 'Global publish operation failed.');
    } finally {
      setPublishingGlobal(false);
    }
  };

  const handleExportResults = () => {
    const formatted = filtered.map(r => ({
      "Roll Number": r.rollNumber || "—",
      "Student Name": r.participantId?.name || r.studentName || "—",
      "Olympiad": r.olympiadId?.title || r.olympiadName || "—",
      "Logical Reasoning": r.scores?.logicalReasoning ?? 0,
      "Algorithmic Thinking": r.scores?.algorithmicThinking ?? 0,
      "AI Core": r.scores?.aiCore ?? 0,
      "Total Marks": r.scores?.totalMarksObtained ?? 0,
      "Percentage": r.percentage !== undefined ? `${r.percentage}%` : "—",
      "Percentile": r.percentile !== undefined ? `${r.percentile}%` : "—",
      "AIR Rank": r.rankings?.national !== undefined ? `AIR ${r.rankings.national}` : "—",
      "Qualification Status": r.qualificationStatus || "—"
    }));
    const ws = XLSX.utils.json_to_sheet(formatted);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Results");
    XLSX.writeFile(wb, "BAIO_Olympiad_Results.xlsx");
  };

  const handleParticipantChange = (pId) => {
    const p = participants.find(x => x._id === pId);
    if (!p) return;
    const pClass = p.class || '10';
    let prefix = 'SR';
    if (['6', '7', '8'].includes(pClass)) prefix = 'JR';
    else if (pClass === 'UG') prefix = 'MS';
    const rand = Math.floor(100 + Math.random() * 900);
    const generatedRoll = `BAIO-2026-${prefix}-${rand}`;
    setForm(p => ({
      ...p,
      participantId: pId,
      rollNumber: generatedRoll
    }));
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.participantId) {
      alert('Please select a participant student.');
      return;
    }
    if (!form.olympiadId) {
      alert('Please select an Olympiad event.');
      return;
    }

    setSaving(true);
    try {
      const totalMarks = Number(form.logicalReasoning) + Number(form.algorithmicThinking) + Number(form.aiCore);
      const payload = {
        participantId: form.participantId,
        olympiadId: form.olympiadId,
        rollNumber: form.rollNumber,
        scores: {
          logicalReasoning: Number(form.logicalReasoning),
          algorithmicThinking: Number(form.algorithmicThinking),
          aiCore: Number(form.aiCore),
          totalMarksObtained: totalMarks
        },
        totalMaxMarks: 100,
        percentage: totalMarks,
        percentile: Number(form.percentile),
        rankings: {
          national: Number(form.nationalRank),
          state: Number(form.stateRank),
          school: Number(form.schoolRank)
        },
        qualificationStatus: form.qualificationStatus,
        isPublished: form.isPublished
      };

      await resultAPI.create(payload);
      setShowForm(false);
      setForm({
        participantId: '',
        olympiadId: '',
        rollNumber: '',
        logicalReasoning: 0,
        algorithmicThinking: 0,
        aiCore: 0,
        percentile: 90,
        nationalRank: 1,
        stateRank: 1,
        schoolRank: 1,
        qualificationStatus: 'Qualified',
        isPublished: true
      });
      load();
    } catch (err) {
      alert(err?.message || 'Failed to add result.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this student scorecard result?')) return;
    setDeleting(id);
    try {
      await resultAPI.delete(id);
      setData(prev => prev.filter(r => r._id !== id));
    } catch (err) {
      alert(err?.message || 'Failed to delete result.');
    } finally {
      setDeleting(null);
    }
  };

  const filtered = data.filter(r => {
    const q = query.toLowerCase();
    const studentName = r.participantId?.name || r.studentName || '';
    return (r.rollNumber || '').toLowerCase().includes(q) ||
           studentName.toLowerCase().includes(q);
  });

  const inputCls = 'w-full bg-slate-900/60 border border-white/8 rounded-xl px-3 py-2 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-blue-500/50 transition-all';

  return (
    <div className="space-y-5">
      {/* Result Publishing Control Panel */}
      <div className="bg-white border-4 border-brand-navy rounded-3xl p-5 edu-shadow space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-2.5">
          <Megaphone className="w-5 h-5 text-brand-navy" />
          <div>
            <h3 className="font-heading font-extrabold text-brand-navy text-sm">Bulk Results Publishing Center</h3>
            <p className="text-[10px] text-slate-400 font-bold mt-0.5">Control the visibility of scorecards in school and student dashboards.</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
          {/* School-wise Publishing */}
          <div className="md:col-span-7 space-y-2.5">
            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest block">Option A: School-Wise Release</span>
            <div className="flex flex-col sm:flex-row gap-2.5">
              <select
                value={selectedSchoolForPublish}
                onChange={e => setSelectedSchoolForPublish(e.target.value)}
                className="flex-1 bg-white border-2 border-[#001F5E] rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none focus:border-brand-navy"
              >
                <option value="">-- Choose School to Publish --</option>
                {schools.map(s => (
                  <option key={s._id} value={s._id}>{s.name} ({s.address?.city || 'City'})</option>
                ))}
              </select>
              <div className="flex gap-2">
                <button
                  onClick={() => handlePublishSchool(true)}
                  disabled={publishingSchool || !selectedSchoolForPublish}
                  className="px-3 py-2 bg-emerald-50 hover:bg-emerald-100 border border-emerald-250 text-emerald-700 rounded-xl text-xs font-extrabold transition-all cursor-pointer disabled:opacity-50"
                >
                  Publish School
                </button>
                <button
                  onClick={() => handlePublishSchool(false)}
                  disabled={publishingSchool || !selectedSchoolForPublish}
                  className="px-3 py-2 bg-rose-50 hover:bg-rose-100 border border-rose-250 text-rose-700 rounded-xl text-xs font-extrabold transition-all cursor-pointer disabled:opacity-50"
                >
                  Unpublish School
                </button>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="hidden md:block md:col-span-1 text-center font-bold text-slate-350 text-xs">OR</div>

          {/* Global Release */}
          <div className="md:col-span-4 space-y-2.5">
            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest block">Option B: Global Release (All Schools)</span>
            <div className="flex gap-2">
              <button
                onClick={() => handlePublishGlobal(true)}
                disabled={publishingGlobal}
                className="flex-1 px-3 py-2 bg-[#001F5E] text-white rounded-xl text-xs font-extrabold transition-all hover:bg-indigo-900 cursor-pointer disabled:opacity-50 flex items-center justify-center gap-1"
              >
                <CheckCircle className="w-3.5 h-3.5" /> Release All
              </button>
              <button
                onClick={() => handlePublishGlobal(false)}
                disabled={publishingGlobal}
                className="flex-1 px-3 py-2 bg-slate-100 hover:bg-slate-200 border border-slate-350 text-slate-600 rounded-xl text-xs font-extrabold transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-1"
              >
                <XCircle className="w-3.5 h-3.5" /> Hide All
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <TableToolbar query={query} onQuery={setQuery} placeholder="Search roll no, name…" onExport={handleExportResults} />
        <button 
          onClick={() => setShowForm(s => !s)}
          className="flex items-center gap-1.5 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 text-blue-400 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ml-3 cursor-pointer shrink-0"
        >
          <Plus className="w-3.5 h-3.5" /> {showForm ? 'Cancel' : 'Add Result'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="bg-slate-900/50 border border-blue-500/20 rounded-2xl p-5 space-y-4 text-left">
          <h3 className="text-sm font-bold text-blue-400">Add Student Scorecard</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Select Participant Student *</label>
                <select required className={inputCls} value={form.participantId} onChange={e => handleParticipantChange(e.target.value)}>
                  <option value="">-- Choose student participant --</option>
                  {participants.map(p => (
                    <option key={p._id} value={p._id}>
                      {p.name} (Class {p.class} - {p.schoolId?.name || 'School'})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Select Olympiad Event *</label>
                <select required className={inputCls} value={form.olympiadId} onChange={e => setForm(p => ({ ...p, olympiadId: e.target.value }))}>
                  <option value="">-- Choose Olympiad Event --</option>
                  {olympiads.map(o => (
                    <option key={o._id} value={o._id}>
                      {o.title} ({o.category})
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Roll Number *</label>
              <input required className={inputCls} placeholder="e.g. BAIO-2026-SR-123" value={form.rollNumber} onChange={e => setForm(p => ({...p, rollNumber: e.target.value}))} />
            </div>

            <div className="border-t border-white/5 pt-3 md:col-span-3">
              <h4 className="text-xs font-bold text-slate-350 mb-3">Sectional Marks Breakdown (Max: 100)</h4>
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Logical Reasoning (Max 30) *</label>
              <input required type="number" min="0" max="30" className={inputCls} value={form.logicalReasoning} onChange={e => setForm(p => ({...p, logicalReasoning: e.target.value}))} />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Algorithmic Thinking (Max 35) *</label>
              <input required type="number" min="0" max="35" className={inputCls} value={form.algorithmicThinking} onChange={e => setForm(p => ({...p, algorithmicThinking: e.target.value}))} />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">AI Core Concepts (Max 35) *</label>
              <input required type="number" min="0" max="35" className={inputCls} value={form.aiCore} onChange={e => setForm(p => ({...p, aiCore: e.target.value}))} />
            </div>

            <div className="border-t border-white/5 pt-3 md:col-span-3">
              <h4 className="text-xs font-bold text-slate-350 mb-3">National Rankings & Percentile</h4>
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">National Percentile *</label>
              <input required type="number" step="0.01" min="0" max="100" className={inputCls} value={form.percentile} onChange={e => setForm(p => ({...p, percentile: e.target.value}))} />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">All India Rank (AIR) *</label>
              <input required type="number" min="1" className={inputCls} value={form.nationalRank} onChange={e => setForm(p => ({...p, nationalRank: e.target.value}))} />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">State Rank (SR) *</label>
              <input required type="number" min="1" className={inputCls} value={form.stateRank} onChange={e => setForm(p => ({...p, stateRank: e.target.value}))} />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">School Rank</label>
              <input type="number" min="1" className={inputCls} value={form.schoolRank} onChange={e => setForm(p => ({...p, schoolRank: e.target.value}))} />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Qualification Status</label>
              <select className={inputCls} value={form.qualificationStatus} onChange={e => setForm(p => ({...p, qualificationStatus: e.target.value}))}>
                <option value="Participated">Participated</option>
                <option value="Qualified">Qualified</option>
                <option value="MeritAwardee">MeritAwardee</option>
                <option value="NationalRanker">NationalRanker</option>
              </select>
            </div>
            <div className="flex items-center gap-2 pt-5">
              <input 
                id="isPublished"
                type="checkbox" 
                className="rounded border-white/10 bg-slate-900 text-blue-500 focus:ring-0 focus:ring-offset-0" 
                checked={form.isPublished} 
                onChange={e => setForm(p => ({...p, isPublished: e.target.checked}))} 
              />
              <label htmlFor="isPublished" className="text-xs font-semibold text-slate-350 cursor-pointer">Publish Result Instantly</label>
            </div>
          </div>
          <button type="submit" disabled={saving} className="btn-primary">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
            {saving ? 'Saving scorecard…' : 'Save Scorecard'}
          </button>
        </form>
      )}

      <div className="admin-card p-6">
        <AdminTable loading={loading} headers={['Roll No.', 'Student', 'Olympiad', 'Total Marks', '%', 'Percentile', 'AIR', 'Status', 'Action']}>
          {filtered.map(r => (
            <tr key={r._id}>
              <td className="py-3.5 pr-4 font-mono text-[10px] text-slate-400">{r.rollNumber}</td>
              <td className="py-3.5 pr-4 font-semibold text-slate-100">{r.participantId?.name || r.studentName || '—'}</td>
              <td className="py-3.5 pr-4 text-slate-400 max-w-[150px] truncate">{r.olympiadId?.title || r.olympiadName || '—'}</td>
              <td className="py-3.5 pr-4 text-slate-300 font-semibold">{r.scores?.totalMarksObtained ?? '—'}</td>
              <td className="py-3.5 pr-4 text-slate-300">{r.percentage}%</td>
              <td className="py-3.5 pr-4 text-brand-green font-semibold">{r.percentile}%</td>
              <td className="py-3.5 pr-4 text-slate-200 font-bold">AIR {r.rankings?.national}</td>
              <td className="py-3.5 pr-4"><StatusBadge status={r.qualificationStatus} /></td>
              <td className="py-3.5">
                <button
                  onClick={() => handleDelete(r._id)}
                  disabled={deleting === r._id}
                  className="flex items-center gap-1 text-[10px] font-bold text-rose-400 hover:text-rose-350 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 px-2.5 py-1 rounded-lg transition-all cursor-pointer disabled:opacity-50"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  {deleting === r._id ? '...' : 'Delete'}
                </button>
              </td>
            </tr>
          ))}
        </AdminTable>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Page: Contacts
// ─────────────────────────────────────────────
function ContactsPage() {
  const [data, setData]       = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery]     = useState('');

  useEffect(() => {
    (async () => {
      try {
        const res = await contactAPI.list({ limit: 50 });
        const list = res?.data?.data?.submissions || res?.data?.submissions || res?.data?.data || [];
        setData(Array.isArray(list) && list.length ? list : MOCK_CONTACTS);
      } catch { setData(MOCK_CONTACTS); }
      finally { setLoading(false); }
    })();
  }, []);

  const filtered = data.filter(c => {
    const q = query.toLowerCase();
    return (c.name || '').toLowerCase().includes(q) || (c.subject || '').toLowerCase().includes(q);
  });

  const handleExportContacts = () => {
    const formatted = filtered.map(c => ({
      "Name": c.name,
      "Email": c.email,
      "Phone": c.phone || "—",
      "Subject": c.subject,
      "Message/Inquiry": c.message || "",
      "Status": c.status || "Pending",
      "Received At": c.createdAt ? new Date(c.createdAt).toLocaleDateString() : ""
    }));
    const ws = XLSX.utils.json_to_sheet(formatted);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Contacts");
    XLSX.writeFile(wb, "BAIO_Contact_Inquiries.xlsx");
  };

  return (
    <div className="admin-card p-6">
      <TableToolbar query={query} onQuery={setQuery} placeholder="Search name, subject…" onExport={handleExportContacts} />
      <AdminTable loading={loading} headers={['Name', 'Email', 'Subject', 'Status', 'Received']}>
        {filtered.map(c => (
          <tr key={c._id}>
            <td className="py-3.5 pr-4 font-semibold text-slate-100">{c.name}</td>
            <td className="py-3.5 pr-4 text-slate-400 text-[10px]">{c.email}</td>
            <td className="py-3.5 pr-4 text-slate-300 max-w-[200px] truncate">{c.subject}</td>
            <td className="py-3.5 pr-4"><StatusBadge status={c.status} /></td>
            <td className="py-3.5 text-slate-500">{fmtDate(c.createdAt)}</td>
          </tr>
        ))}
      </AdminTable>
    </div>
  );
}

// ─────────────────────────────────────────────
// Page: CMS Management
// ─────────────────────────────────────────────
const CMS_TABS = [
  { id: 'homepage', label: 'Home Page',  icon: Home        },
  { id: 'about',    label: 'About',      icon: Globe       },
  { id: 'faq',      label: 'FAQs',       icon: HelpCircle  },
  { id: 'contact',  label: 'Contact',    icon: Phone       },
];

function FileUploadZone({ label, accept, hint, onUploaded }) {
  const [dragging, setDragging]   = useState(false);
  const [progress, setProgress]   = useState(null);
  const [result,   setResult]     = useState(null);
  const [error,    setError]      = useState(null);
  const inputRef = React.useRef();

  const handleFile = async (file) => {
    if (!file) return;
    setProgress(0); setResult(null); setError(null);
    try {
      const res = await mediaAPI.upload(file, (p) => setProgress(p));
      const data = res?.data?.data || res?.data;
      setResult(data);
      setProgress(null);
      if (onUploaded) onUploaded(data);
    } catch (e) {
      setError(e?.response?.data?.message || 'Upload failed.');
      setProgress(null);
    }
  };

  return (
    <div className="space-y-2">
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}</p>
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => { e.preventDefault(); setDragging(false); handleFile(e.dataTransfer.files[0]); }}
        onClick={() => inputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
          dragging ? 'border-blue-500 bg-blue-500/10' : 'border-white/10 hover:border-blue-500/40 hover:bg-white/3'
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          className="hidden"
          onChange={(e) => handleFile(e.target.files[0])}
        />
        {progress !== null ? (
          <div className="space-y-2">
            <Loader2 className="w-6 h-6 text-blue-400 animate-spin mx-auto" />
            <div className="w-full bg-slate-800 rounded-full h-1.5">
              <div className="bg-blue-500 h-1.5 rounded-full transition-all" style={{ width: `${progress}%` }} />
            </div>
            <p className="text-[10px] text-slate-500">{progress}% uploaded</p>
          </div>
        ) : result ? (
          <div className="space-y-1">
            <Check className="w-6 h-6 text-brand-green mx-auto" />
            <p className="text-[10px] text-brand-green font-semibold">Uploaded: {result.filename}</p>
            <p className="text-[9px] text-slate-500 font-mono break-all">/api/v1/media/{result.id}</p>
            <button
              onClick={(e) => { e.stopPropagation(); setResult(null); }}
              className="text-[9px] text-slate-500 hover:text-rose-400 underline mt-1"
            >Replace</button>
          </div>
        ) : (
          <div className="space-y-2">
            <Upload className="w-5 h-5 text-slate-600 mx-auto" />
            <p className="text-xs text-slate-500">Drag & drop or <span className="text-blue-400 underline">browse</span></p>
            <p className="text-[9px] text-slate-600">{hint}</p>
          </div>
        )}
      </div>
      {error && (
        <p className="flex items-center gap-1.5 text-[10px] text-rose-400">
          <AlertCircle className="w-3 h-3" /> {error}
        </p>
      )}
    </div>
  );
}

function CMSPage() {
  const [activeTab, setActiveTab] = useState('homepage');
  const [cmsData,   setCmsData]   = useState({});
  const [loading,   setLoading]   = useState(true);
  const [saving,    setSaving]    = useState(false);
  const [saved,     setSaved]     = useState(false);
  const [error,     setError]     = useState(null);

  // Load all CMS entries
  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const res  = await cmsAPI.listAll();
        const data = res?.data?.data?.cms || res?.data?.cms || {};
        setCmsData(data);
      } catch {
        setCmsData({});
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Get value for current tab (with defaults)
  const currentValue = cmsData[activeTab]?.value || {};

  const DEFAULTS = {
    homepage: { heroTitle: '', heroSubtitle: '', ctaText: '', features: [] },
    about:    { title: '', content: '', mission: '', vision: '' },
    faq:      [],
    contact:  { email: '', phone: '', address: '', officeHours: '' },
  };

  const getValue = (key) => currentValue[key] ?? DEFAULTS[activeTab]?.[key] ?? '';

  const patch = (key, val) => {
    setCmsData(prev => ({
      ...prev,
      [activeTab]: {
        ...prev[activeTab],
        value: { ...(prev[activeTab]?.value || {}), [key]: val },
      },
    }));
  };

  const save = async () => {
    setSaving(true); setSaved(false); setError(null);
    try {
      await cmsAPI.upsert({ key: activeTab, value: currentValue });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (e) {
      setError(e?.response?.data?.message || 'Save failed.');
    } finally {
      setSaving(false);
    }
  };

  // ── FAQ helpers ──
  const faqList = Array.isArray(currentValue) ? currentValue : [];
  const patchFaq = (idx, field, val) => {
    const next = [...faqList];
    next[idx] = { ...next[idx], [field]: val };
    setCmsData(prev => ({ ...prev, faq: { ...prev.faq, value: next } }));
  };
  const addFaq    = () => setCmsData(prev => ({ ...prev, faq: { ...prev.faq, value: [...faqList, { question: '', answer: '' }] } }));
  const removeFaq = (idx) => setCmsData(prev => ({ ...prev, faq: { ...prev.faq, value: faqList.filter((_,i)=>i!==idx) } }));

  const inputCls = 'w-full bg-slate-900/60 border border-white/8 rounded-xl px-4 py-2.5 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-blue-500/50 transition-all';
  const textareaCls = `${inputCls} resize-none`;
  const labelCls = 'block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5';

  return (
    <div className="space-y-6">
      {/* Tab Bar */}
      <div className="flex gap-1 p-1 bg-slate-900/60 border border-white/5 rounded-xl w-fit">
        {CMS_TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === id
                ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <Icon className="w-3.5 h-3.5" />
            {label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* ── Left: Text Editor ── */}
        <div className="xl:col-span-2 admin-card p-6 space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <Settings className="w-4 h-4 text-blue-400" />
              Edit · {CMS_TABS.find(t => t.id === activeTab)?.label}
            </h2>
            {cmsData[activeTab]?.updatedAt && (
              <span className="text-[10px] text-slate-600">
                Last saved: {fmtDate(cmsData[activeTab].updatedAt)}
              </span>
            )}
          </div>

          {loading ? (
            <div className="space-y-3 animate-pulse">
              {[1,2,3].map(i => <div key={i} className="h-10 bg-slate-800 rounded-xl" />)}
            </div>
          ) : (
            <>
              {/* ── Homepage fields ── */}
              {activeTab === 'homepage' && (
                <div className="space-y-4">
                  <div>
                    <label className={labelCls}>Hero Title</label>
                    <input className={inputCls} value={getValue('heroTitle')} onChange={e => patch('heroTitle', e.target.value)} placeholder="Welcome to Bharat AI Olympiad" />
                  </div>
                  <div>
                    <label className={labelCls}>Hero Subtitle</label>
                    <textarea className={textareaCls} rows={3} value={getValue('heroSubtitle')} onChange={e => patch('heroSubtitle', e.target.value)} placeholder="Empowering future minds…" />
                  </div>
                  <div>
                    <label className={labelCls}>CTA Button Text</label>
                    <input className={inputCls} value={getValue('ctaText')} onChange={e => patch('ctaText', e.target.value)} placeholder="Register Now" />
                  </div>
                </div>
              )}

              {/* ── About fields ── */}
              {activeTab === 'about' && (
                <div className="space-y-4">
                  <div>
                    <label className={labelCls}>Page Title</label>
                    <input className={inputCls} value={getValue('title')} onChange={e => patch('title', e.target.value)} placeholder="About Bharat AI Olympiad" />
                  </div>
                  <div>
                    <label className={labelCls}>Main Content</label>
                    <textarea className={textareaCls} rows={5} value={getValue('content')} onChange={e => patch('content', e.target.value)} placeholder="We are dedicated to…" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={labelCls}>Mission</label>
                      <textarea className={textareaCls} rows={3} value={getValue('mission')} onChange={e => patch('mission', e.target.value)} placeholder="Our mission is…" />
                    </div>
                    <div>
                      <label className={labelCls}>Vision</label>
                      <textarea className={textareaCls} rows={3} value={getValue('vision')} onChange={e => patch('vision', e.target.value)} placeholder="Our vision is…" />
                    </div>
                  </div>
                </div>
              )}

              {/* ── FAQ fields ── */}
              {activeTab === 'faq' && (
                <div className="space-y-4">
                  {faqList.map((item, idx) => (
                    <div key={idx} className="bg-slate-900/50 border border-white/5 rounded-xl p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-slate-500 uppercase">FAQ #{idx + 1}</span>
                        <button onClick={() => removeFaq(idx)} className="text-rose-500 hover:text-rose-400 cursor-pointer">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <div>
                        <label className={labelCls}>Question</label>
                        <input className={inputCls} value={item.question || ''} onChange={e => patchFaq(idx, 'question', e.target.value)} placeholder="What is BAIO?" />
                      </div>
                      <div>
                        <label className={labelCls}>Answer</label>
                        <textarea className={textareaCls} rows={3} value={item.answer || ''} onChange={e => patchFaq(idx, 'answer', e.target.value)} placeholder="BAIO is…" />
                      </div>
                    </div>
                  ))}
                  <button
                    onClick={addFaq}
                    className="flex items-center gap-2 text-xs text-blue-400 hover:text-blue-300 border border-blue-500/20 hover:border-blue-500/40 px-4 py-2 rounded-xl transition-all cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add FAQ
                  </button>
                </div>
              )}

              {/* ── Contact fields ── */}
              {activeTab === 'contact' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={labelCls}>Email</label>
                      <input className={inputCls} value={getValue('email')} onChange={e => patch('email', e.target.value)} placeholder="support@baio.in" />
                    </div>
                    <div>
                      <label className={labelCls}>Phone</label>
                      <input className={inputCls} value={getValue('phone')} onChange={e => patch('phone', e.target.value)} placeholder="+91 99999 99999" />
                    </div>
                  </div>
                  <div>
                    <label className={labelCls}>Address</label>
                    <textarea className={textareaCls} rows={2} value={getValue('address')} onChange={e => patch('address', e.target.value)} placeholder="New Delhi, India" />
                  </div>
                  <div>
                    <label className={labelCls}>Office Hours</label>
                    <input className={inputCls} value={getValue('officeHours')} onChange={e => patch('officeHours', e.target.value)} placeholder="Mon - Fri, 9am - 6pm" />
                  </div>
                </div>
              )}
            </>
          )}

          {/* ── Save Button ── */}
          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={save}
              disabled={saving || loading}
              className="btn-primary"
            >
              {saving
                ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving…</>
                : <><Check className="w-4 h-4" /> Save Changes</>
              }
            </button>
            {saved  && <span className="text-xs text-brand-green flex items-center gap-1"><Check className="w-3.5 h-3.5" /> Saved successfully</span>}
            {error  && <span className="text-xs text-rose-400 flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5" /> {error}</span>}
          </div>
        </div>

        {/* ── Right: File Upload Panel ── */}
        <div className="space-y-5">
          <div className="admin-card p-5 space-y-5">
            <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <Image className="w-4 h-4 text-blue-400" /> Media Uploads
            </h3>
            <FileUploadZone
              label="Olympiad Banner Image"
              accept="image/jpeg,image/png,image/webp"
              hint="JPEG, PNG or WebP · max 5 MB"
            />
            <FileUploadZone
              label="Syllabus PDF"
              accept="application/pdf"
              hint="PDF only · max 5 MB"
            />
            <FileUploadZone
              label="Results PDF"
              accept="application/pdf"
              hint="PDF only · max 5 MB"
            />
          </div>

          {/* Media library note */}
          <div className="admin-card p-4">
            <p className="text-[10px] text-slate-500 leading-relaxed">
              <span className="text-slate-400 font-semibold block mb-1">How to use uploaded files</span>
              After upload, copy the <code className="bg-slate-800 px-1 rounded text-[9px]">/api/v1/media/:id</code> URL and
              paste it into the relevant CMS field (e.g. bannerImageUrl on the homepage tab).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// ROOT App
// ─────────────────────────────────────────────
const PAGE_MAP = {
  dashboard:     DashboardPage,
  olympiads:     OlympiadsPage,
  participants:  ParticipantsPage,
  schools:       SchoolsPage,
  announcements: AnnouncementsPage,
  results:       ResultsPage,
  contacts:      ContactsPage,
  cms:           CMSPage,
};


export default function App() {
  const { isAuthenticated, loading: authLoading } = useAdminAuth();
  const [page, setPage]           = useState('dashboard');
  const [collapsed, setCollapsed] = useState(false);
  const [loading, setLoading]     = useState(false);
  const [refreshKey, setRefresh]  = useState(0);

  const handleRefresh = () => {
    setLoading(true);
    setRefresh(k => k + 1);
    setTimeout(() => setLoading(false), 800);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF9F6] text-[#001F5E]">
        <Loader2 className="w-8 h-8 text-brand-orange animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  const PageComponent = PAGE_MAP[page] || DashboardPage;

  return (
    <div className="min-h-screen flex bg-[#FAF9F6] text-slate-800 font-sans">
      {/* Sidebar */}
      <Sidebar
        active={page}
        onNav={setPage}
        collapsed={collapsed}
        onToggle={() => setCollapsed(c => !c)}
      />

      {/* Content area */}
      <div className="flex-1 flex flex-col min-w-0">
        <AdminNavbar page={page} loading={loading} onRefresh={handleRefresh} />

        <main className="flex-1 p-6 lg:p-8 overflow-y-auto" key={refreshKey}>
          {/* Ambient glow */}
          <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-48 bg-brand-orange/5 rounded-full blur-3xl pointer-events-none z-0" />
          <div className="relative z-10">
            <PageComponent />
          </div>
        </main>
      </div>
    </div>
  );
}
