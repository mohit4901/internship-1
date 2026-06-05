import React from 'react';
import {
  LayoutDashboard, Trophy, Users, School, FileText,
  Megaphone, Award, MessageSquare, ChevronLeft, ChevronRight,
  Shield, Settings, ClipboardList
} from 'lucide-react';

/* ── Brand Logo ── */
function BAIOLogo({ className = '' }) {
  return (
    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <circle cx="20" cy="20" r="17" stroke="#FF8C00" strokeWidth="2.5" />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
        const rad = (angle * Math.PI) / 180;
        const x1 = 20 + 15 * Math.cos(rad);
        const y1 = 20 + 15 * Math.sin(rad);
        const x2 = 20 + 19 * Math.cos(rad);
        const y2 = 20 + 19 * Math.sin(rad);
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#FF8C00" strokeWidth="3" strokeLinecap="round" />;
      })}
      <circle cx="20" cy="20" r="10" fill="#FAF9F6" />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
        const rad = (angle * Math.PI) / 180;
        const x2 = 20 + 8 * Math.cos(rad);
        const y2 = 20 + 8 * Math.sin(rad);
        return <line key={i} x1="20" y1="20" x2={x2} y2={y2} stroke="#FF8C00" strokeWidth="1.2" strokeLinecap="round" />;
      })}
      <circle cx="20" cy="20" r="2.5" fill="#FF8C00" />
    </svg>
  );
}

const NAV_GROUPS = [
  {
    label: 'Core',
    items: [
      { id: 'dashboard',     label: 'Dashboard',      icon: LayoutDashboard },
      { id: 'olympiads',     label: 'Olympiads',      icon: Trophy           },
    ],
  },
  {
    label: 'People',
    items: [
      { id: 'participants',  label: 'Participants',   icon: ClipboardList    },
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
        collapsed ? 'w-18' : 'w-64'
      } min-h-screen z-50`}
    >
      {/* ── Brand / Header ── */}
      <div>
        <div className={`flex items-center gap-3 px-4 py-5 border-b border-white/10 ${collapsed ? 'justify-center' : ''}`}>
          <BAIOLogo className="w-8 h-8 shrink-0 animate-pulse-slow" />
          {!collapsed && (
            <div className="overflow-hidden">
              <p className="text-sm font-extrabold text-white leading-none tracking-tight">BAIO Admin</p>
              <p className="text-[8px] text-[#FF8C00] font-black uppercase tracking-widest mt-1">Control Panel</p>
            </div>
          )}
        </div>

        {/* ── Navigation List ── */}
        <nav className="px-3 pt-5 space-y-6">
          {NAV_GROUPS.map((group) => (
            <div key={group.label} className="space-y-2">
              {!collapsed && (
                <p className="text-[9px] font-black text-white/40 uppercase tracking-widest px-2">
                  {group.label}
                </p>
              )}
              <div className="space-y-1">
                {group.items.map(({ id, label, icon: Icon }) => {
                  const isActive = active === id;
                  return (
                    <button
                      key={id}
                      onClick={() => onNav(id)}
                      title={collapsed ? label : undefined}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer
                        ${isActive ? 'nav-active' : 'nav-inactive'}`}
                    >
                      <Icon className={`w-4 h-4 shrink-0 transition-transform ${isActive ? 'scale-110 text-white' : 'text-slate-400 group-hover:text-white'}`} />
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
      <div className="px-3 pb-5 space-y-4 border-t border-white/10 pt-4">
        <button
          onClick={onToggle}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-[10px] font-bold text-white/50 hover:text-white hover:bg-white/5 border-2 border-transparent hover:border-white/10 transition-all cursor-pointer"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : (
            <>
              <ChevronLeft className="w-4 h-4" />
              <span>Collapse Menu</span>
            </>
          )}
        </button>
        {!collapsed && (
          <p className="text-[9px] font-bold text-white/30 text-center tracking-wider">v1.0.0 · © 2026 Bharat AI</p>
        )}
      </div>
    </aside>
  );
}
