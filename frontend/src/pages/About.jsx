import React, { useEffect, useState } from 'react';
import { getCmsContent } from '../services/cms.service';
import { Target, Eye, BookOpen, Award, Zap } from 'lucide-react';

const DEFAULT = {
  title:   'About Bharat AI Olympiad',
  content: 'We are dedicated to fostering artificial intelligence knowledge across schools and academic institutions throughout India.',
  mission: 'To democratize AI education and empower every young mind with the skills to shape tomorrow\'s technology landscape.',
  vision:  'A future where every Indian student has access to world-class AI education and the opportunity to compete on a global stage.',
};

export default function AboutPage() {
  const [data, setData]       = useState(DEFAULT);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await getCmsContent('about');
        const v   = res?.data?.data?.value || res?.data?.value;
        if (v) setData({ ...DEFAULT, ...v });
      } catch { /* use defaults */ }
      finally { setLoading(false); }
    })();
  }, []);

  return (
    <div className="min-h-screen bg-[hsl(222,47%,7%)] text-slate-100">
      {/* ── Hero banner ── */}
      <section className="relative overflow-hidden py-24 px-6">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-navy via-[hsl(222,47%,9%)] to-[hsl(222,47%,7%)]" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-64 bg-brand-orange/5 rounded-full blur-3xl pointer-events-none" />
        <div className="relative max-w-4xl mx-auto text-center">
          {loading ? (
            <div className="space-y-4 animate-pulse">
              <div className="h-14 bg-white/5 rounded-2xl max-w-lg mx-auto" />
              <div className="h-5 bg-white/5 rounded-lg max-w-xl mx-auto" />
            </div>
          ) : (
            <>
              <div className="inline-flex items-center gap-2 bg-brand-orange/10 border border-brand-orange/20 text-brand-orange text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-6">
                <BookOpen className="w-3.5 h-3.5" /> Our Story
              </div>
              <h1 className="font-heading font-extrabold text-5xl md:text-6xl text-white leading-tight mb-6">
                {data.title}
              </h1>
              <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
                {data.content}
              </p>
            </>
          )}
        </div>
      </section>

      {/* ── Mission & Vision cards ── */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="relative group rounded-2xl p-8 bg-white/3 border border-white/6 hover:border-brand-orange/30 transition-all overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-brand-orange/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative">
              <div className="w-12 h-12 rounded-xl bg-brand-orange/10 border border-brand-orange/20 flex items-center justify-center mb-5">
                <Target className="w-6 h-6 text-brand-orange" />
              </div>
              <h2 className="text-xl font-bold text-white mb-3">Our Mission</h2>
              {loading
                ? <div className="h-16 bg-white/5 rounded-xl animate-pulse" />
                : <p className="text-slate-400 leading-relaxed">{data.mission}</p>
              }
            </div>
          </div>

          <div className="relative group rounded-2xl p-8 bg-white/3 border border-white/6 hover:border-brand-green/30 transition-all overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-brand-green/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative">
              <div className="w-12 h-12 rounded-xl bg-brand-green/10 border border-brand-green/20 flex items-center justify-center mb-5">
                <Eye className="w-6 h-6 text-brand-green" />
              </div>
              <h2 className="text-xl font-bold text-white mb-3">Our Vision</h2>
              {loading
                ? <div className="h-16 bg-white/5 rounded-xl animate-pulse" />
                : <p className="text-slate-400 leading-relaxed">{data.vision}</p>
              }
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats band ── */}
      <section className="border-y border-white/6 bg-white/2 py-12 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { n: '50,000+', label: 'Students Reached',   icon: Award },
            { n: '3,200+',  label: 'Schools Registered', icon: BookOpen },
            { n: '28',      label: 'States Covered',     icon: Target },
            { n: '3',       label: 'Olympiad Divisions',  icon: Zap },
          ].map(({ n, label, icon: Icon }) => (
            <div key={label} className="space-y-2">
              <Icon className="w-5 h-5 text-brand-orange mx-auto mb-1 opacity-70" />
              <p className="text-3xl font-extrabold text-white">{n}</p>
              <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold">{label}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
