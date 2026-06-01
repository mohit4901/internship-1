import React from 'react';
import { Bell, Search, RefreshCw, LogOut, User } from 'lucide-react';

export default function AdminNavbar({ page, loading, onRefresh }) {
  const PAGE_TITLES = {
    dashboard:     'Dashboard Overview',
    olympiads:     'Olympiad Catalog',
    registrations: 'Registration Ledger',
    students:      'Student Registry',
    schools:       'School Directory',
    announcements: 'Announcements',
    results:       'Results & Merit',
    contacts:      'Contact Submissions',
    cms:           'CMS · Page Content',
  };

  return (
    <header className="sticky top-0 z-40 bg-[rgba(8,10,20,0.85)] backdrop-blur-md border-b border-white/5 px-6 py-3.5 flex items-center justify-between gap-4">

      {/* ── Page Title ── */}
      <div>
        <h1 className="text-base font-bold text-slate-100 leading-none">
          {PAGE_TITLES[page] || 'Admin'}
        </h1>
        <p className="text-[10px] text-slate-500 mt-0.5">
          Real-time data · {new Date().toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}
        </p>
      </div>

      {/* ── Right Controls ── */}
      <div className="flex items-center gap-2.5">
        {/* Refresh */}
        <button
          onClick={onRefresh}
          title="Refresh data"
          className="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 flex items-center justify-center text-slate-400 hover:text-slate-200 transition-all cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-blue-400' : ''}`} />
        </button>

        {/* Notification bell */}
        <button className="relative w-8 h-8 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 flex items-center justify-center text-slate-400 hover:text-slate-200 transition-all cursor-pointer">
          <Bell className="w-3.5 h-3.5" />
          <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-accent-rose rounded-full pulse-dot" />
        </button>

        {/* Divider */}
        <div className="w-px h-6 bg-white/10" />

        {/* Admin badge */}
        <div className="flex items-center gap-2 bg-white/5 border border-white/5 rounded-xl px-3 py-1.5">
          <div className="w-5 h-5 rounded-lg bg-gradient-to-tr from-accent-blue to-accent-indigo flex items-center justify-center">
            <User className="w-3 h-3 text-white" />
          </div>
          <span className="text-xs font-semibold text-slate-300">Admin</span>
        </div>

        {/* Logout */}
        <button
          title="Logout"
          className="w-8 h-8 rounded-xl bg-white/5 hover:bg-rose-500/10 hover:text-rose-400 border border-white/5 flex items-center justify-center text-slate-500 transition-all cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
        </button>
      </div>
    </header>
  );
}
