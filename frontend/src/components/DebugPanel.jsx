/**
 * DebugPanel — Floating real-time log viewer for the BAIO frontend.
 * Shows API requests, responses, auth events, and errors live.
 * Toggle with the ⚙ button (bottom-left). Only visible in development.
 */

import React, { useEffect, useState, useRef } from 'react';
import logger from '../utils/debugLogger';

const TYPE_STYLES = {
  info:     { bg: 'bg-slate-800',      badge: 'bg-slate-600 text-slate-200',     text: 'text-slate-300'  },
  warn:     { bg: 'bg-amber-950/60',   badge: 'bg-amber-700 text-amber-100',     text: 'text-amber-300'  },
  error:    { bg: 'bg-red-950/60',     badge: 'bg-red-700 text-red-100',         text: 'text-red-300'    },
  auth:     { bg: 'bg-indigo-950/60',  badge: 'bg-indigo-700 text-indigo-100',   text: 'text-indigo-300' },
  request:  { bg: 'bg-slate-800',      badge: 'bg-blue-700 text-blue-100',       text: 'text-blue-300'   },
  response: { bg: 'bg-emerald-950/50', badge: 'bg-emerald-700 text-emerald-100', text: 'text-emerald-300'},
};

function BadgeIcon({ type }) {
  const labels = {
    info: 'INFO', warn: 'WARN', error: 'ERR',
    auth: 'AUTH', request: 'REQ', response: 'RES',
  };
  const s = TYPE_STYLES[type] || TYPE_STYLES.info;
  return (
    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider shrink-0 ${s.badge}`}>
      {labels[type] || type}
    </span>
  );
}

export default function DebugPanel() {
  const [open, setOpen]     = useState(false);
  const [logs, setLogs]     = useState([]);
  const [filter, setFilter] = useState('all');
  const [apiBase, setApiBase] = useState('');
  const [backendOk, setBackendOk] = useState(null); // null=checking, true, false
  const bottomRef = useRef(null);

  // Subscribe to logger
  useEffect(() => {
    const unsub = logger.subscribe(setLogs);
    return unsub;
  }, []);

  // Ping backend
  useEffect(() => {
    const base = import.meta.env.VITE_API_URL || 'http://localhost:5050/api/v1';
    setApiBase(base);
    const healthUrl = base.replace('/api/v1', '') + '/health';

    const check = async () => {
      try {
        const res = await fetch(healthUrl);
        setBackendOk(res.ok);
        logger.info(`Backend health check: ${res.ok ? '✓ OK' : '✗ FAILED'}`, `URL: ${healthUrl} | Status: ${res.status}`);
      } catch (e) {
        setBackendOk(false);
        logger.error('Backend unreachable!', `URL: ${healthUrl} | ${e.message}`);
      }
    };
    check();
    const interval = setInterval(check, 30000);
    return () => clearInterval(interval);
  }, []);

  const filtered = filter === 'all' ? logs : logs.filter((l) => l.type === filter);

  const unreadErrors = logs.filter((l) => l.type === 'error').length;

  if (import.meta.env.MODE === 'production') return null;

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setOpen((v) => !v)}
        style={{ zIndex: 99998 }}
        className="fixed bottom-4 left-4 flex items-center gap-1.5 bg-slate-900 border border-slate-700 text-slate-300 text-xs font-bold px-3 py-2 rounded-xl shadow-xl hover:border-slate-500 transition-all"
        title="Toggle Debug Panel"
      >
        <span className="text-base leading-none">🛠</span>
        <span>Debug</span>
        {unreadErrors > 0 && (
          <span className="bg-red-600 text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded-full leading-none">
            {unreadErrors}
          </span>
        )}
        {/* Backend status dot */}
        <span
          className={`w-2 h-2 rounded-full shrink-0 ${
            backendOk === null ? 'bg-amber-400 animate-pulse' :
            backendOk ? 'bg-emerald-400' : 'bg-red-500 animate-pulse'
          }`}
          title={backendOk === null ? 'Checking...' : backendOk ? 'Backend OK' : 'Backend DOWN'}
        />
      </button>

      {/* Panel */}
      {open && (
        <div
          style={{ zIndex: 99999 }}
          className="fixed bottom-16 left-4 w-[540px] max-w-[95vw] h-[500px] bg-slate-950 border border-slate-700 rounded-2xl shadow-2xl flex flex-col overflow-hidden font-mono text-xs"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-800 bg-slate-900 shrink-0">
            <div className="flex items-center gap-2">
              <span className="text-slate-200 font-bold text-sm">🛠 BAIO Debug Log</span>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  backendOk === null ? 'bg-amber-600 text-white' :
                  backendOk ? 'bg-emerald-700 text-white' : 'bg-red-700 text-white'
                }`}
              >
                {backendOk === null ? 'Connecting…' : backendOk ? '● Backend OK' : '● Backend DOWN'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={logger.clear}
                className="text-slate-500 hover:text-slate-300 text-[10px] border border-slate-700 px-2 py-0.5 rounded-lg transition-colors"
              >
                Clear
              </button>
              <button onClick={() => setOpen(false)} className="text-slate-500 hover:text-slate-200 font-bold text-base leading-none px-1">
                ×
              </button>
            </div>
          </div>

          {/* API URL info */}
          <div className="px-4 py-1.5 border-b border-slate-800/60 bg-slate-900/50 shrink-0">
            <span className="text-slate-500 text-[10px]">API Base: </span>
            <span className="text-slate-300 text-[10px] font-bold">{apiBase}</span>
          </div>

          {/* Filters */}
          <div className="flex gap-1 px-3 py-1.5 border-b border-slate-800/60 bg-slate-900/30 shrink-0 flex-wrap">
            {['all', 'error', 'warn', 'request', 'response', 'auth', 'info'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`text-[10px] font-bold px-2 py-0.5 rounded-md border transition-all capitalize ${
                  filter === f
                    ? 'bg-brand-orange border-brand-orange/50 text-white'
                    : 'border-slate-700 text-slate-500 hover:text-slate-300'
                }`}
              >
                {f}
                {f !== 'all' && (
                  <span className="ml-1 opacity-60">
                    {logs.filter((l) => l.type === f).length}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Log list */}
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {filtered.length === 0 && (
              <div className="text-slate-600 text-center py-8 text-xs">No logs yet. Make an API call or interact with the app.</div>
            )}
            {filtered.map((log) => {
              const s = TYPE_STYLES[log.type] || TYPE_STYLES.info;
              return (
                <div key={log.id} className={`rounded-lg px-2.5 py-1.5 flex flex-col gap-0.5 ${s.bg}`}>
                  <div className="flex items-start gap-1.5">
                    <BadgeIcon type={log.type} />
                    <span className={`flex-1 break-all leading-snug ${s.text}`}>{log.message}</span>
                    <span className="text-slate-600 text-[9px] shrink-0 mt-0.5">
                      {new Date(log.timestamp).toLocaleTimeString('en-IN')}
                    </span>
                  </div>
                  {log.detail && (
                    <div className="text-slate-500 text-[10px] pl-9 leading-relaxed break-all">{log.detail}</div>
                  )}
                </div>
              );
            })}
            <div ref={bottomRef} />
          </div>

          {/* Footer count */}
          <div className="px-4 py-1.5 border-t border-slate-800 bg-slate-900/50 text-slate-600 text-[10px] shrink-0 flex justify-between">
            <span>{filtered.length} entries shown</span>
            <span>Total: {logs.length} / {200}</span>
          </div>
        </div>
      )}
    </>
  );
}
