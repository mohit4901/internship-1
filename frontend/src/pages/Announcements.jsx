import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, Calendar, ChevronRight } from 'lucide-react';
import api from '../services/api';

const typeColors = {
  info:    'bg-blue-50 text-blue-700 border-blue-200',
  success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  warning: 'bg-amber-50 text-amber-700 border-amber-200',
  error:   'bg-red-50 text-red-700 border-red-200',
};

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading]             = useState(true);
  const [error, setError]                 = useState('');

  useEffect(() => {
    api.get('/announcements')
      .then((res) => setAnnouncements(res.data?.data?.announcements || res.data?.data || []))
      .catch(() => setError('Could not load announcements. Please try again later.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="bg-white min-h-screen">

      {/* Hero */}
      <section className="bg-slate-950 text-white py-20">
        <div className="max-w-3xl mx-auto px-6 text-center space-y-4">
          <span className="inline-flex items-center gap-1.5 bg-white/10 text-slate-300 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider">
            <Bell className="w-3.5 h-3.5" /> Announcements
          </span>
          <h1 className="font-heading font-black text-5xl">
            Stay up to date with BAIO.
          </h1>
          <p className="text-slate-400 text-base">
            Important updates, exam dates, result declarations, and news from the Bharat AI Olympiad.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-6">
          {loading && (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="border border-slate-100 rounded-2xl p-6 animate-pulse space-y-3">
                  <div className="h-3 bg-slate-100 rounded w-1/4" />
                  <div className="h-4 bg-slate-100 rounded w-3/4" />
                  <div className="h-3 bg-slate-100 rounded w-full" />
                </div>
              ))}
            </div>
          )}

          {error && (
            <div className="text-center py-16 space-y-3">
              <Bell className="w-10 h-10 text-slate-300 mx-auto" />
              <p className="text-slate-500 text-sm">{error}</p>
            </div>
          )}

          {!loading && !error && announcements.length === 0 && (
            <div className="text-center py-16 space-y-3">
              <Bell className="w-10 h-10 text-slate-200 mx-auto" />
              <h2 className="font-heading font-bold text-xl text-slate-700">No announcements yet.</h2>
              <p className="text-slate-400 text-sm">
                Check back soon for BAIO news, exam dates, and result declarations.
              </p>
            </div>
          )}

          {!loading && !error && announcements.length > 0 && (
            <div className="space-y-4">
              {announcements.map((ann, i) => (
                <motion.div
                  key={ann._id || i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.06 }}
                  className="border border-slate-200 rounded-2xl p-6 space-y-3 hover:border-slate-300 hover:shadow-sm transition-all"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1 flex-1">
                      {ann.type && (
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${typeColors[ann.type] || typeColors.info}`}>
                          {ann.type}
                        </span>
                      )}
                      <h2 className="font-heading font-bold text-slate-900 text-lg leading-snug">{ann.title}</h2>
                    </div>
                    {ann.createdAt && (
                      <span className="shrink-0 flex items-center gap-1 text-[11px] text-slate-400 mt-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {new Date(ann.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                    )}
                  </div>
                  <p className="text-slate-600 text-sm leading-relaxed">{ann.content || ann.body}</p>
                  {ann.link && (
                    <a href={ann.link} className="inline-flex items-center gap-1 text-xs font-semibold text-brand-orange hover:underline">
                      Read more <ChevronRight className="w-3.5 h-3.5" />
                    </a>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
