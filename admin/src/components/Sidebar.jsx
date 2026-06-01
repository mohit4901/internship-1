import React from 'react';
import {
  LayoutDashboard, Trophy, Users, School, FileText,
  Megaphone, Award, MessageSquare, ChevronLeft, ChevronRight,
  Shield, Settings
} from 'lucide-react';

const NAV_GROUPS = [
  {
    label: 'Core',
    items: [
      { id: 'dashboard',     label: 'Dashboard',      icon: LayoutDashboard },
      { id: 'olympiads',     label: 'Olympiads',      icon: Trophy           },
      { id: 'registrations', label: 'Registrations',  icon: FileText         },
    ],
  },
  {
    label: 'People',
    items: [
      { id: 'students',      label: 'Students',       icon: Users            },
      { id: 'schools',       label: 'Schools',        icon: School           },
    ],
  },
  {
    label: 'Content',
    items: [
      { id: 'announcements', label: 'Announcements',  icon: Megaphone        },
      { id: 'results',       label: 'Results',        icon: Award            },
      { id: 'contacts',      label: 'Contacts',       icon: MessageSquare    },
      { id: 'cms',           label: 'CMS / Pages',    icon: Settings         },
    ],
  },
];

export default function Sidebar({ active, onNav, collapsed, onToggle }) {
  return (
    <aside
      className={`admin-sidebar flex flex-col justify-between transition-all duration-300 ${
        collapsed ? 'w-16' : 'w-60'
      } min-h-screen`}
    >
      {/* ── Brand ── */}
      <div>
        <div className={`flex items-center gap-3 px-4 py-5 border-b border-white/5 ${collapsed ? 'justify-center' : ''}`}>
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-brand-navy to-accent-blue flex items-center justify-center shrink-0">
            <Shield className="w-4 h-4 text-white" />
          </div>
          {!collapsed && (
            <div className="overflow-hidden">
              <p className="text-sm font-bold text-slate-100 leading-none">BAIO Admin</p>
              <p className="text-[9px] text-slate-500 font-semibold uppercase tracking-widest mt-0.5">Control Console</p>
            </div>
          )}
        </div>

        {/* ── Nav groups ── */}
        <nav className="px-2 pt-4 space-y-5">
          {NAV_GROUPS.map((group) => (
            <div key={group.label}>
              {!collapsed && (
                <p className="text-[9px] font-bold text-slate-600 uppercase tracking-widest px-2 mb-1.5">
                  {group.label}
                </p>
              )}
              <div className="space-y-0.5">
                {group.items.map(({ id, label, icon: Icon }) => {
                  const isActive = active === id;
                  return (
                    <button
                      key={id}
                      onClick={() => onNav(id)}
                      title={collapsed ? label : undefined}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer
                        ${isActive ? 'nav-active' : 'nav-inactive'}`}
                    >
                      <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-blue-400' : ''}`} />
                      {!collapsed && <span className="truncate">{label}</span>}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </div>

      {/* ── Collapse Toggle + Footer ── */}
      <div className="px-2 pb-4 space-y-3 border-t border-white/5 pt-4">
        <button
          onClick={onToggle}
          className="w-full flex items-center justify-center gap-2 py-2 rounded-xl text-xs text-slate-500 hover:text-slate-300 hover:bg-white/5 transition-all cursor-pointer"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : (
            <>
              <ChevronLeft className="w-4 h-4" />
              <span>Collapse</span>
            </>
          )}
        </button>
        {!collapsed && (
          <p className="text-[10px] text-slate-700 text-center">v1.0.0 · © 2026 BAIO</p>
        )}
      </div>
    </aside>
  );
}
