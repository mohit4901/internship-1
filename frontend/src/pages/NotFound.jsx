import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="max-w-md mx-auto py-24 text-center px-6 space-y-6">
      <div className="w-16 h-16 rounded-full bg-brand-orange/10 flex items-center justify-center mx-auto border border-brand-orange/20 animate-bounce">
        <ShieldAlert className="w-8 h-8 text-brand-orange" />
      </div>
      <div className="space-y-2">
        <h1 className="font-heading font-extrabold text-7xl text-slate-200">404</h1>
        <h2 className="font-heading font-bold text-xl text-slate-300">Page Not Found</h2>
        <p className="text-slate-400 text-sm max-w-sm mx-auto leading-relaxed">
          The page you are looking for does not exist or has been moved to a different educational track.
        </p>
      </div>
      <div className="pt-4">
        <Link 
          to="/" 
          className="bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200"
        >
          ← Back to Home
        </Link>
      </div>
    </div>
  );
}

