import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import AdminNavbar from './components/AdminNavbar';
import {
  dashboardAPI, olympiadAPI, registrationAPI,
  studentAPI, schoolAPI, announcementAPI, resultAPI, contactAPI,
  cmsAPI, mediaAPI
} from './services';
import {
  Users, School, Trophy, FileText, Megaphone, Award,
  MessageSquare, TrendingUp, Download, Search, Plus,
  CheckCircle, Clock, ShieldAlert, XCircle, Eye,
  Calendar, Sparkles, ChevronLeft, ChevronRight, RefreshCw,
  Settings, Upload, Globe, HelpCircle, Phone, Home, Image,
  FileCheck, Loader2, Check, AlertCircle, Trash2
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
    <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide ${cls}`}>
      {status}
    </span>
  );
}

function SkeletonRows({ cols = 5, rows = 5 }) {
  return Array.from({ length: rows }).map((_, i) => (
    <tr key={i} className="animate-pulse">
      {Array.from({ length: cols }).map((__, j) => (
        <td key={j} className="py-3.5 pr-4">
          <div className="h-3.5 bg-slate-800/80 rounded-lg" style={{ width: `${55 + (j * 13) % 40}%` }} />
        </td>
      ))}
    </tr>
  ));
}

// ─────────────────────────────────────────────
// Stat Card
// ─────────────────────────────────────────────
function StatCard({ label, value, sub, color = 'stat-blue', icon: Icon, loading }) {
  return (
    <div className={`admin-card ${color} p-5 space-y-4`}>
      <div className="flex items-start justify-between">
        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none">{label}</span>
        {Icon && (
          <div className="w-7 h-7 rounded-lg bg-white/5 border border-white/5 flex items-center justify-center">
            <Icon className="w-3.5 h-3.5 text-slate-500" />
          </div>
        )}
      </div>
      {loading ? (
        <div className="h-8 w-24 bg-slate-800 rounded-lg animate-pulse" />
      ) : (
        <div className="flex items-end justify-between gap-2">
          <span className="text-2xl font-extrabold text-white leading-none">{value ?? '—'}</span>
          {sub && <span className="text-[10px] font-bold badge-green rounded px-1.5 py-0.5">{sub}</span>}
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
    <div className="overflow-x-auto">
      <table className="admin-table w-full text-left text-xs border-collapse">
        <thead>
          <tr className="text-[10px] text-slate-500 uppercase tracking-widest">
            {headers.map(h => (
              <th key={h} className="pb-3 pr-5 font-bold whitespace-nowrap">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <SkeletonRows cols={headers.length} />
          ) : React.Children.count(children) === 0 ? (
            <tr>
              <td colSpan={headers.length} className="py-12 text-center text-slate-600 text-xs">
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
        <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={e => onQuery(e.target.value)}
          className="w-full bg-slate-900/70 border border-white/5 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-blue-500/50 transition-all"
        />
      </div>
      <div className="flex items-center gap-2">
        {extra}
        {onExport && (
          <button
            onClick={onExport}
            className="flex items-center gap-1.5 bg-white/5 hover:bg-white/10 border border-white/5 px-3 py-2 rounded-xl text-xs text-slate-400 hover:text-slate-200 transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// MOCK DATA (fallbacks when backend is offline)
// ─────────────────────────────────────────────
const MOCK_STATS = { totalRegistrations: 4892, totalRevenue: 1640290, activeOlympiads: 3, pendingApprovals: 24 };

const MOCK_REGS = [
  { _id:'r1', registrationNumber:'BAIO-REG-8392', studentId:{ name:'Aarav Sharma' }, schoolId:{ name:'DPS RK Puram' }, olympiadId:{ title:'Senior Division', category:'Senior' }, paymentStatus:'Paid', registrationStatus:'Confirmed', createdAt:'2026-05-29', rollNumber:'BAIO2026-SR-8392' },
  { _id:'r2', registrationNumber:'BAIO-REG-4729', studentId:{ name:'Diya Patel' },   schoolId:{ name:'Aditya Birla' },  olympiadId:{ title:'Junior Division', category:'Junior' }, paymentStatus:'Paid', registrationStatus:'Confirmed', createdAt:'2026-05-28', rollNumber:'BAIO2026-JR-4729' },
  { _id:'r3', registrationNumber:'BAIO-REG-1120', studentId:{ name:'Rohan Verma' },  schoolId:{ name:'IIT Kharagpur' }, olympiadId:{ title:'Masters Division', category:'Masters' }, paymentStatus:'Pending', registrationStatus:'Initiated', createdAt:'2026-05-28', rollNumber:'N/A' },
  { _id:'r4', registrationNumber:'BAIO-REG-1092', studentId:{ name:'Ananya Rao' },   schoolId:{ name:'National Public' },olympiadId:{ title:'Senior Division', category:'Senior' }, paymentStatus:'Paid', registrationStatus:'Confirmed', createdAt:'2026-05-27', rollNumber:'BAIO2026-SR-1092' },
  { _id:'r5', registrationNumber:'BAIO-REG-3341', studentId:{ name:'Kabir Mehta' },  schoolId:{ name:'Ryan International' },olympiadId:{ title:'Junior Division', category:'Junior' }, paymentStatus:'Failed', registrationStatus:'Cancelled', createdAt:'2026-05-26', rollNumber:'N/A' },
];

const MOCK_OLYMPIADS = [
  { _id:'o1', title:'AI Olympiad - Junior Division', category:'Junior', status:'Active', registrationFee:299, currentRegistrationsCount:1820, timeline:{ examDate:'2026-07-15T00:00:00Z', registrationEnd:'2026-07-10T00:00:00Z' } },
  { _id:'o2', title:'AI Olympiad - Senior Division', category:'Senior', status:'Active', registrationFee:399, currentRegistrationsCount:2108, timeline:{ examDate:'2026-07-18T00:00:00Z', registrationEnd:'2026-07-12T00:00:00Z' } },
  { _id:'o3', title:'AI Olympiad - Masters Division', category:'Masters', status:'Active', registrationFee:499, currentRegistrationsCount:964,  timeline:{ examDate:'2026-07-20T00:00:00Z', registrationEnd:'2026-07-15T00:00:00Z' } },
];

const MOCK_STUDENTS = [
  { _id:'s1', name:'Aarav Sharma', email:'aarav@dps.edu.in', phone:'9876543210', class:'10', isActive:true, isEmailVerified:true, createdAt:'2026-05-20' },
  { _id:'s2', name:'Diya Patel',   email:'diya@ab.edu.in',   phone:'9876543211', class:'8',  isActive:true, isEmailVerified:true, createdAt:'2026-05-21' },
  { _id:'s3', name:'Rohan Verma',  email:'rohan@iit.ac.in',  phone:'9876543212', class:'UG', isActive:false,isEmailVerified:false,createdAt:'2026-05-22' },
];

const MOCK_SCHOOLS = [
  { _id:'sc1', name:'DPS RK Puram', board:'CBSE', address:{ city:'New Delhi', state:'Delhi' }, contactEmail:'coord@dps.edu.in', isVerified:true, registeredStudentsCount:38 },
  { _id:'sc2', name:'Aditya Birla World Academy', board:'ICSE', address:{ city:'Mumbai', state:'Maharashtra' }, contactEmail:'coord@abwa.edu.in', isVerified:true, registeredStudentsCount:24 },
  { _id:'sc3', name:'Ryan International Noida', board:'CBSE', address:{ city:'Noida', state:'Uttar Pradesh' }, contactEmail:'coord@ryan.edu.in', isVerified:false, registeredStudentsCount:11 },
];

const MOCK_ANNOUNCEMENTS = [
  { _id:'a1', title:'Official Syllabus Released', category:'OlympiadInfo', isPinned:true, publishedAt:'2026-05-25', targetAudience:'All' },
  { _id:'a2', title:'Physical Centre Guidelines', category:'Schedule', isPinned:false, publishedAt:'2026-05-22', targetAudience:'All' },
];

const MOCK_RESULTS = [
  { _id:'res1', rollNumber:'BAIO-2026-SR-911', studentId:{name:'Aditya Sharma'}, olympiadId:{title:'Senior Division'}, scores:{totalMarksObtained:92}, percentage:92, percentile:99.82, rankings:{national:14}, qualificationStatus:'MeritAwardee', isPublished:true },
  { _id:'res2', rollNumber:'BAIO-2026-JR-402', studentId:{name:'Kunal Sen'},     olympiadId:{title:'Junior Division'}, scores:{totalMarksObtained:84}, percentage:84, percentile:98.15, rankings:{national:88}, qualificationStatus:'Qualified',     isPublished:true },
  { _id:'res3', rollNumber:'BAIO-2026-MS-888', studentId:{name:'Drisha Roy'},    olympiadId:{title:'Masters Division'},scores:{totalMarksObtained:96}, percentage:96, percentile:99.98, rankings:{national:3},  qualificationStatus:'NationalRanker',  isPublished:false },
];

const MOCK_CONTACTS = [
  { _id:'c1', name:'Priya Nair', email:'priya@school.in', subject:'Admit Card Query', status:'New', createdAt:'2026-05-28' },
  { _id:'c2', name:'Sumit Das',  email:'sumit@example.com',subject:'Payment Failure',  status:'InProgress', createdAt:'2026-05-27' },
  { _id:'c3', name:'Meera Joshi',email:'meera@school.edu', subject:'Hall Ticket',      status:'Resolved', createdAt:'2026-05-26' },
];

// ─────────────────────────────────────────────
// Page: Dashboard
// ─────────────────────────────────────────────
function DashboardPage() {
  const [stats, setStats]     = useState(null);
  const [regs, setRegs]       = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery]     = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [sRes, rRes] = await Promise.all([
        dashboardAPI.stats(),
        registrationAPI.list({ limit: 10, sort: '-createdAt' }),
      ]);
      setStats(sRes?.data?.data || sRes?.data || MOCK_STATS);
      const list = rRes?.data?.data || rRes?.data || [];
      setRegs(Array.isArray(list) && list.length ? list : MOCK_REGS);
    } catch {
      setStats(MOCK_STATS);
      setRegs(MOCK_REGS);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = regs.filter(r => {
    const q = query.toLowerCase();
    return (
      (r.studentId?.name || '').toLowerCase().includes(q) ||
      (r.schoolId?.name  || '').toLowerCase().includes(q) ||
      (r.registrationNumber || '').toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-7">
      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard label="Total Registrations" value={fmt(stats?.totalRegistrations)} sub="+12.4%" color="stat-blue"  icon={FileText} loading={loading} />
        <StatCard label="Revenue Collected"   value={stats ? `₹${fmt(stats.totalRevenue)}` : null} sub="+8.2%" color="stat-green" icon={TrendingUp} loading={loading} />
        <StatCard label="Active Olympiads"    value={fmt(stats?.activeOlympiads)}    sub="Stable" color="stat-indigo" icon={Trophy}   loading={loading} />
        <StatCard label="Pending Approvals"   value={fmt(stats?.pendingApprovals)}   color="stat-amber"  icon={Clock}   loading={loading} />
      </div>

      {/* Recent Registrations */}
      <div className="admin-card p-6">
        <h2 className="text-sm font-bold text-slate-200 mb-4 flex items-center gap-2">
          <FileText className="w-4 h-4 text-blue-400" />
          Recent Registrations
        </h2>
        <TableToolbar query={query} onQuery={setQuery} placeholder="Search name, school, reg no…" onExport={() => {}} />
        <AdminTable
          loading={loading}
          headers={['Reg No.', 'Student', 'School', 'Division', 'Date', 'Payment', 'Status', 'Roll No.']}
        >
          {filtered.map(r => (
            <tr key={r._id}>
              <td className="py-3.5 pr-4 font-mono text-[10px] text-slate-500">{r.registrationNumber}</td>
              <td className="py-3.5 pr-4 font-semibold text-slate-100">{r.studentId?.name || '—'}</td>
              <td className="py-3.5 pr-4 text-slate-400">{r.schoolId?.name || '—'}</td>
              <td className="py-3.5 pr-4">
                <span className="badge-blue inline-block px-2 py-0.5 rounded-full text-[10px] font-bold">
                  {r.olympiadId?.category || r.olympiadId?.title || '—'}
                </span>
              </td>
              <td className="py-3.5 pr-4 text-slate-500 whitespace-nowrap">{fmtDate(r.createdAt)}</td>
              <td className="py-3.5 pr-4"><StatusBadge status={r.paymentStatus} /></td>
              <td className="py-3.5 pr-4"><StatusBadge status={r.registrationStatus} /></td>
              <td className="py-3.5 font-mono text-[10px] text-slate-500">{r.rollNumber || '—'}</td>
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

  const filtered = data.filter(o =>
    (o.title || '').toLowerCase().includes(query.toLowerCase())
  );

  const inputCls = 'w-full bg-slate-900/60 border border-white/8 rounded-xl px-3 py-2 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-blue-500/50 transition-all';

  return (
    <div className="space-y-5">
      <div className="admin-card p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-sm font-bold text-slate-200 flex items-center gap-2">
            <Trophy className="w-4 h-4 text-blue-400" /> Olympiad Catalog
          </h2>
          <button onClick={() => setShowForm(s => !s)} className="flex items-center gap-1.5 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 text-blue-400 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer">
            <Plus className="w-3.5 h-3.5" /> {showForm ? 'Cancel' : 'New Olympiad'}
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleCreate} className="mb-6 bg-slate-900/50 border border-blue-500/20 rounded-2xl p-5 space-y-4">
            <h3 className="text-sm font-bold text-blue-400">Create New Olympiad</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Title *</label>
                <input required className={inputCls} placeholder="AI Olympiad - Junior Division" value={form.title} onChange={e => setForm(p => ({...p, title: e.target.value}))} />
              </div>
              <div className="col-span-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Description</label>
                <textarea className={inputCls} rows={2} placeholder="Brief description…" value={form.description} onChange={e => setForm(p => ({...p, description: e.target.value}))} />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Category *</label>
                <select required className={inputCls} value={form.category} onChange={e => setForm(p => ({...p, category: e.target.value}))}>
                  <option>Junior</option><option>Senior</option><option>Masters</option><option>General</option><option>AI</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Registration Fee (₹)</label>
                <input type="number" min="0" className={inputCls} value={form.registrationFee} onChange={e => setForm(p => ({...p, registrationFee: Number(e.target.value)}))} />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Exam Date *</label>
                <input required type="date" className={inputCls} value={form.examDate} onChange={e => setForm(p => ({...p, examDate: e.target.value}))} />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Registration Closes *</label>
                <input required type="date" className={inputCls} value={form.registrationLastDate} onChange={e => setForm(p => ({...p, registrationLastDate: e.target.value}))} />
              </div>
            </div>
            <button type="submit" disabled={saving} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-sm font-bold px-5 py-2.5 rounded-xl transition-all cursor-pointer">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
              {saving ? 'Creating…' : 'Create Olympiad'}
            </button>
          </form>
        )}

        <TableToolbar query={query} onQuery={setQuery} placeholder="Search olympiad…" />
        <AdminTable loading={loading} headers={['Title', 'Category', 'Fee', 'Exam Date', 'Reg. Closes', 'Status']}>
          {filtered.map(o => (
            <tr key={o._id}>
              <td className="py-3.5 pr-4 font-semibold text-slate-100 max-w-[220px] truncate">{o.title}</td>
              <td className="py-3.5 pr-4">
                <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  o.category === 'Junior' ? 'badge-green' : o.category === 'Senior' ? 'badge-amber' : 'badge-indigo'
                }`}>{o.category}</span>
              </td>
              <td className="py-3.5 pr-4 text-slate-300">{o.registrationFee === 0 || o.isFree ? 'Free' : `₹${fmt(o.registrationFee)}`}</td>
              <td className="py-3.5 pr-4 text-slate-500 whitespace-nowrap">{fmtDate(o.timeline?.examDate || o.examDate)}</td>
              <td className="py-3.5 pr-4 text-slate-500 whitespace-nowrap">{fmtDate(o.timeline?.registrationEnd || o.registrationLastDate)}</td>
              <td className="py-3.5 pr-4"><StatusBadge status={o.status || o.status} /></td>
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
        const list = res?.data?.data || res?.data || [];
        setData(Array.isArray(list) && list.length ? list : MOCK_REGS);
      } catch { setData(MOCK_REGS); }
      finally { setLoading(false); }
    })();
  }, []);

  const filtered = data.filter(r => {
    const q = query.toLowerCase();
    return (r.studentId?.name || '').toLowerCase().includes(q) ||
           (r.schoolId?.name  || '').toLowerCase().includes(q) ||
           (r.registrationNumber || '').toLowerCase().includes(q);
  });

  return (
    <div className="admin-card p-6">
      <TableToolbar query={query} onQuery={setQuery} placeholder="Search name, school, reg no…" onExport={() => {}} />
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

  useEffect(() => {
    (async () => {
      try {
        const res = await schoolAPI.list({ limit: 50 });
        const list = res?.data?.data || res?.data || [];
        setData(Array.isArray(list) && list.length ? list : MOCK_SCHOOLS);
      } catch { setData(MOCK_SCHOOLS); }
      finally { setLoading(false); }
    })();
  }, []);

  const filtered = data.filter(s => {
    const q = query.toLowerCase();
    return (s.name || '').toLowerCase().includes(q) ||
           (s.address?.city || '').toLowerCase().includes(q) ||
           (s.address?.state || '').toLowerCase().includes(q);
  });

  return (
    <div className="admin-card p-6">
      <TableToolbar query={query} onQuery={setQuery} placeholder="Search school, city…" onExport={() => {}} />
      <AdminTable loading={loading} headers={['School Name', 'Board', 'City', 'State', 'Students', 'Verified', 'Email']}>
        {filtered.map(s => (
          <tr key={s._id}>
            <td className="py-3.5 pr-4 font-semibold text-slate-100 max-w-[200px] truncate">{s.name}</td>
            <td className="py-3.5 pr-4">
              <span className="badge-blue inline-block px-2 py-0.5 rounded-full text-[10px] font-bold">{s.board}</span>
            </td>
            <td className="py-3.5 pr-4 text-slate-400">{s.address?.city || '—'}</td>
            <td className="py-3.5 pr-4 text-slate-400">{s.address?.state || '—'}</td>
            <td className="py-3.5 pr-4 text-slate-300 font-semibold">{fmt(s.registeredStudentsCount)}</td>
            <td className="py-3.5 pr-4"><StatusBadge status={s.isVerified ? 'Confirmed' : 'Pending'} /></td>
            <td className="py-3.5 text-slate-500 text-[10px]">{s.contactEmail}</td>
          </tr>
        ))}
      </AdminTable>
    </div>
  );
}

// ─────────────────────────────────────────────
// Page: Announcements
// ─────────────────────────────────────────────
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

  const inputCls = 'w-full bg-slate-900/60 border border-white/8 rounded-xl px-3 py-2 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-blue-500/50 transition-all';
  const textareaCls = 'w-full bg-slate-900/60 border border-white/8 rounded-xl px-3 py-2 text-sm text-slate-200 placeholder:text-slate-650 focus:outline-none focus:border-blue-500/50 transition-all resize-none';

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <TableToolbar query={query} onQuery={setQuery} placeholder="Search announcement…" />
        <button 
          onClick={() => setShowForm(s => !s)}
          className="flex items-center gap-1.5 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 text-blue-400 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ml-3 cursor-pointer shrink-0"
        >
          <Plus className="w-3.5 h-3.5" /> {showForm ? 'Cancel' : 'New Bulletin'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="bg-slate-900/50 border border-blue-500/20 rounded-2xl p-5 space-y-4">
          <h3 className="text-sm font-bold text-blue-400">Publish New Announcement</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Title *</label>
              <input required className={inputCls} placeholder="e.g. Admit Card Release Timeline" value={form.title} onChange={e => setForm(p => ({...p, title: e.target.value}))} />
            </div>
            <div className="col-span-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Content *</label>
              <textarea required className={textareaCls} rows={4} placeholder="Announcement content detail..." value={form.content} onChange={e => setForm(p => ({...p, content: e.target.value}))} />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Category</label>
              <select className={inputCls} value={form.category} onChange={e => setForm(p => ({...p, category: e.target.value}))}>
                <option value="General">General</option>
                <option value="Schedule">Schedule</option>
                <option value="OlympiadInfo">OlympiadInfo</option>
                <option value="Emergency">Emergency</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Target Audience</label>
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
                className="rounded border-white/10 bg-slate-900 text-blue-500 focus:ring-0 focus:ring-offset-0" 
                checked={form.isPinned} 
                onChange={e => setForm(p => ({...p, isPinned: e.target.checked}))} 
              />
              <label htmlFor="isPinned" className="text-xs font-semibold text-slate-350 cursor-pointer">Pin to Landing Page Highlights</label>
            </div>
          </div>
          <button type="submit" disabled={saving} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-sm font-bold px-5 py-2.5 rounded-xl transition-all cursor-pointer">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
            {saving ? 'Publishing…' : 'Publish Bulletin'}
          </button>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {loading
          ? Array.from({length:4}).map((_,i) => (
              <div key={i} className="admin-card p-5 animate-pulse space-y-3">
                <div className="h-3 w-20 bg-slate-800 rounded" />
                <div className="h-5 w-3/4 bg-slate-800 rounded" />
                <div className="h-3 w-1/2 bg-slate-800 rounded" />
              </div>
            ))
          : filtered.map(a => (
              <div key={a._id} className={`admin-card p-5 space-y-3 border flex flex-col justify-between ${a.isPinned ? 'border-amber-500/20' : 'border-white/5'}`}>
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${CATEGORY_BADGE[a.category] || 'badge-slate'}`}>
                      {a.category}
                    </span>
                    {a.isPinned && <Sparkles className="w-3.5 h-3.5 text-amber-400" />}
                  </div>
                  <p className="text-sm font-semibold text-slate-100 leading-snug">{a.title}</p>
                  <p className="text-xs text-slate-400 leading-relaxed font-light">{a.content}</p>
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-500 pt-3 border-t border-white/5 mt-2">
                  <span>Audience: {a.targetAudience || 'All'}</span>
                  <div className="flex items-center gap-3">
                    <span>{fmtDate(a.publishedAt)}</span>
                    <button 
                      onClick={() => handleDelete(a._id)}
                      disabled={deleting === a._id}
                      className="text-rose-400 hover:text-rose-350 font-bold underline cursor-pointer disabled:opacity-50"
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

// ─────────────────────────────────────────────
// Page: Results
// ─────────────────────────────────────────────
function ResultsPage() {
  const [data, setData]       = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery]     = useState('');
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving]   = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [registrations, setRegistrations] = useState([]);
  const [loadingRegs, setLoadingRegs] = useState(false);

  const [form, setForm] = useState({
    registrationId: '',
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

  const loadRegistrations = async () => {
    setLoadingRegs(true);
    try {
      const res = await registrationAPI.list({ limit: 100 });
      const list = res?.data?.data || res?.data || [];
      setRegistrations(Array.isArray(list) ? list : []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingRegs(false);
    }
  };

  useEffect(() => {
    load();
    loadRegistrations();
  }, []);

  const handleRegChange = (regId) => {
    const reg = registrations.find(r => r._id === regId);
    if (!reg) return;
    const studentClass = reg.studentId?.class || '10';
    let prefix = 'SR';
    if (['6', '7', '8'].includes(studentClass)) prefix = 'JR';
    else if (studentClass === 'UG') prefix = 'MS';
    const rand = Math.floor(100 + Math.random() * 900);
    const generatedRoll = `BAIO-2026-${prefix}-${rand}`;
    setForm(p => ({
      ...p,
      registrationId: regId,
      rollNumber: generatedRoll
    }));
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.registrationId) {
      alert('Please select a student registration.');
      return;
    }
    const reg = registrations.find(r => r._id === form.registrationId);
    if (!reg) return;

    setSaving(true);
    try {
      const totalMarks = Number(form.logicalReasoning) + Number(form.algorithmicThinking) + Number(form.aiCore);
      const payload = {
        registrationId: form.registrationId,
        studentId: reg.studentId?._id || reg.studentId,
        olympiadId: reg.olympiadId?._id || reg.olympiadId,
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
        registrationId: '',
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
    const studentName = r.studentId?.name || r.studentName || '';
    return (r.rollNumber || '').toLowerCase().includes(q) ||
           studentName.toLowerCase().includes(q);
  });

  const inputCls = 'w-full bg-slate-900/60 border border-white/8 rounded-xl px-3 py-2 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-blue-500/50 transition-all';

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <TableToolbar query={query} onQuery={setQuery} placeholder="Search roll no, name…" onExport={() => {}} />
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
            <div className="md:col-span-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Select Registration *</label>
              <select required className={inputCls} value={form.registrationId} onChange={e => handleRegChange(e.target.value)}>
                <option value="">-- Choose registered student --</option>
                {registrations.map(r => (
                  <option key={r._id} value={r._id}>
                    {r.studentId?.name || 'Student'} ({r.olympiadId?.title || 'Olympiad'}) - Reg: {r.registrationNumber}
                  </option>
                ))}
              </select>
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
          <button type="submit" disabled={saving} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-sm font-bold px-5 py-2.5 rounded-xl transition-all cursor-pointer">
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
              <td className="py-3.5 pr-4 font-semibold text-slate-100">{r.studentId?.name || r.studentName || '—'}</td>
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
        const list = res?.data?.data || res?.data || [];
        setData(Array.isArray(list) && list.length ? list : MOCK_CONTACTS);
      } catch { setData(MOCK_CONTACTS); }
      finally { setLoading(false); }
    })();
  }, []);

  const filtered = data.filter(c => {
    const q = query.toLowerCase();
    return (c.name || '').toLowerCase().includes(q) || (c.subject || '').toLowerCase().includes(q);
  });

  return (
    <div className="admin-card p-6">
      <TableToolbar query={query} onQuery={setQuery} placeholder="Search name, subject…" />
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
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-sm font-bold px-5 py-2.5 rounded-xl transition-all cursor-pointer"
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
  registrations: RegistrationsPage,
  students:      StudentsPage,
  schools:       SchoolsPage,
  announcements: AnnouncementsPage,
  results:       ResultsPage,
  contacts:      ContactsPage,
  cms:           CMSPage,
};

import { useAdminAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage';

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
      <div className="min-h-screen flex items-center justify-center bg-[hsl(230,25%,5%)]">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  const PageComponent = PAGE_MAP[page] || DashboardPage;

  return (
    <div className="min-h-screen flex bg-[hsl(230,25%,5%)] text-slate-100 font-sans">
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
          <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-48 bg-blue-600/5 rounded-full blur-3xl pointer-events-none z-0" />
          <div className="relative z-10">
            <PageComponent />
          </div>
        </main>
      </div>
    </div>
  );
}
