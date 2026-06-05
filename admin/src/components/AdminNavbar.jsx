import React from 'react';
import { Bell, RefreshCw, LogOut, User } from 'lucide-react';

export default function AdminNavbar({ page, loading, onRefresh }) {
  const PAGE_TITLES = {
    dashboard:     'Dashboard Overview',
    olympiads:     'Olympiad Catalog',
    registrations: 'Registration Ledger',
    students:      'Student Registry',
    schools:       'School Directory',
    announcements: 'Announcements Bulletin',
    results:       'Results & Merit Ledger',
    contacts:      'Contact Submissions',
    cms:           'CMS · Page Content Manager',
  };

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b-2 border-brand-navy px-6 py-4 flex items-center justify-between gap-4">

      {/* ── Page Title & Context ── */}
      <div>
        <h1 className="text-lg font-black text-brand-navy leading-none">
          {PAGE_TITLES[page] || 'Admin Portal'}
        </h1>
        <p className="text-[10px] text-slate-500 mt-1.5 font-bold uppercase tracking-wider">
          Real-time updates · {new Date().toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}
        </p>
      </div>

      {/* ── Right Controls ── */}
      <div className="flex items-center gap-3">
        
        {/* Refresh button */}
        <button
          onClick={onRefresh}
          title="Refresh data"
          className="w-9 h-9 rounded-xl bg-white border-2 border-brand-navy shadow-[0_2px_0px_0px_#001F5E] hover:-translate-y-0.5 hover:shadow-[0_3px_0px_0px_#001F5E] active:translate-y-0.5 active:shadow-[0_1px_0px_0px_#001F5E] flex items-center justify-center text-brand-navy transition-all cursor-pointer"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-brand-orange' : ''}`} />
        </button>

        {/* Notifications button */}
        <button className="relative w-9 h-9 rounded-xl bg-white border-2 border-brand-navy shadow-[0_2px_0px_0px_#001F5E] hover:-translate-y-0.5 hover:shadow-[0_3px_0px_0px_#001F5E] active:translate-y-0.5 active:shadow-[0_1px_0px_0px_#001F5E] flex items-center justify-center text-brand-navy transition-all cursor-pointer">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-accent-rose rounded-full pulse-dot border border-brand-navy" />
        </button>

        {/* Divider */}
        <div className="w-0.5 h-6 bg-brand-navy/15 rounded-full" />

        {/* Admin profile indicator */}
        <div className="flex items-center gap-2 bg-white border-2 border-brand-navy shadow-[0_2px_0px_0px_#001F5E] rounded-xl px-3 py-1.5">
          <div className="w-5 h-5 rounded-lg bg-gradient-to-tr from-brand-navy to-brand-orange flex items-center justify-center shrink-0">
            <User className="w-3 h-3 text-white" />
          </div>
          <span className="text-xs font-black text-brand-navy tracking-tight">Admin Console</span>
        </div>

        {/* Logout button */}
        <button
          title="Logout"
          className="w-9 h-9 rounded-xl bg-white border-2 border-brand-navy shadow-[0_2px_0px_0px_#001F5E] hover:bg-rose-50 hover:text-accent-rose hover:-translate-y-0.5 hover:shadow-[0_3px_0px_0px_#001F5E] active:translate-y-0.5 active:shadow-[0_1px_0px_0px_#001F5E] flex items-center justify-center text-slate-500 transition-all cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}
