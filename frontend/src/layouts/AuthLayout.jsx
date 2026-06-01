import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Trophy } from 'lucide-react';

/**
 * AuthLayout — minimal centered card wrapper used by
 * Login / Register pages so the form sits in the middle of the screen.
 */
export default function AuthLayout() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col items-center justify-center px-4 py-12">

      {/* Subtle brand mark */}
      <Link to="/" className="flex items-center gap-3 mb-8 no-underline">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-accent-teal flex items-center justify-center shadow-lg shadow-brand-900/50">
          <Trophy className="w-5 h-5 text-white" />
        </div>
        <div>
          <span className="font-heading font-extrabold text-xl tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
            BAIO
          </span>
          <p className="text-[10px] text-slate-500 tracking-widest font-semibold uppercase">
            Bharat AI Olympiad
          </p>
        </div>
      </Link>

      {/* Form slot */}
      <div className="w-full max-w-md">
        <Outlet />
      </div>

      <p className="mt-8 text-[10px] text-slate-600 text-center">
        © {new Date().getFullYear()} Bharat AI Olympiad (BAIO). All rights reserved.
      </p>
    </div>
  );
}
