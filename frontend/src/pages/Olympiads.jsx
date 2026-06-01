import React, { useEffect, useState, useCallback } from 'react';
import { olympiadAPI, registerForOlympiad, getMyRegistrations } from '../services';
import { Calendar, Clock, Trophy, ShieldAlert, RefreshCw, Sparkles, GraduationCap, Cpu, Layers, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function OlympiadsPage() {
  const { isAuthenticated, isStudent } = useAuth();
  const [olympiads, setOlympiads] = useState([]);
  const [registeredOlympiadIds, setRegisteredOlympiadIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // High-fidelity pre-compiled fallbacks if the backend is offline or empty
  const mockOlympiads = [
    {
      _id: 'olympiad-1',
      title: 'AI Olympiad - Junior Division',
      description: 'Foundations of Logical Reasoning, Algorithmic Thinking, and Introduction to AI Concepts. Designed to empower middle school minds to grasp key cognitive frameworks early.',
      category: 'Junior',
      gradesSupported: ['6', '7', '8'],
      registrationFee: 299,
      currency: 'INR',
      timeline: {
        registrationStart: new Date('2026-05-01T00:00:00Z').toISOString(),
        registrationEnd: new Date('2026-07-10T23:59:59Z').toISOString(),
        examDate: new Date('2026-07-15T09:00:00Z').toISOString()
      },
      status: 'Active'
    },
    {
      _id: 'olympiad-2',
      title: 'AI Olympiad - Senior Division',
      description: 'Intermediate Logic, Machine Learning Essentials, and Python-based AI Core Concepts. Designed to validate advanced data models and deep logical reasoning.',
      category: 'Senior',
      gradesSupported: ['9', '10', '11', '12'],
      registrationFee: 399,
      currency: 'INR',
      timeline: {
        registrationStart: new Date('2026-05-01T00:00:00Z').toISOString(),
        registrationEnd: new Date('2026-07-12T23:59:59Z').toISOString(),
        examDate: new Date('2026-07-18T09:00:00Z').toISOString()
      },
      status: 'Active'
    },
    {
      _id: 'olympiad-3',
      title: 'AI Olympiad - Masters Division',
      description: 'Advanced Deep Learning, Neural Network Architectures, NLP systems, and Ethical AI Core. Designed to benchmark engineering caliber for college and undergrad scholars.',
      category: 'Masters',
      gradesSupported: ['UG'],
      registrationFee: 499,
      currency: 'INR',
      timeline: {
        registrationStart: new Date('2026-05-01T00:00:00Z').toISOString(),
        registrationEnd: new Date('2026-07-15T23:59:59Z').toISOString(),
        examDate: new Date('2026-07-20T09:00:00Z').toISOString()
      },
      status: 'Active'
    }
  ];

  const fetchOlympiads = async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await olympiadAPI.list();
      let list = [];
      if (res?.data?.data?.olympiads) {
        list = res.data.data.olympiads;
      } else if (Array.isArray(res?.data?.data)) {
        list = res.data.data;
      } else if (Array.isArray(res?.data)) {
        list = res.data;
      } else if (res?.data?.olympiads) {
        list = res.data.olympiads;
      }

      if (list && list.length > 0) {
        setOlympiads(list);
      } else {
        setOlympiads(mockOlympiads);
      }
    } catch (err) {
      console.warn('Backend offline or Olympiad fetch failed. Loading premium mock fallbacks.', err);
      setError(true);
      setOlympiads(mockOlympiads);
    } finally {
      setLoading(false);
    }
  };

  const loadRegistrations = useCallback(async () => {
    if (isAuthenticated && isStudent) {
      try {
        const res = await getMyRegistrations();
        const list = res?.data?.data?.registrations || res?.data?.registrations || [];
        const ids = list.map(r => r.olympiadId?._id || r.olympiadId);
        setRegisteredOlympiadIds(ids);
      } catch (err) {
        console.warn('Failed to load student registrations', err);
      }
    }
  }, [isAuthenticated, isStudent]);

  useEffect(() => {
    fetchOlympiads();
    loadRegistrations();
  }, [loadRegistrations]);

  const handleRegister = async (olympiadId, title) => {
    if (!window.confirm(`Are you sure you want to register for "${title}"?`)) return;
    try {
      await registerForOlympiad({ olympiadId });
      alert(`Successfully registered for "${title}"!`);
      loadRegistrations();
    } catch (err) {
      alert(err?.message || 'Failed to register.');
    }
  };

  const getReadableDate = (dateStr) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  // Dynamic aesthetic helper settings for cards depending on track
  const getCategoryDetails = (category) => {
    switch (category) {
      case 'Junior':
        return {
          banner: 'from-brand-navy via-slate-900 to-brand-green/85',
          glow: 'glow-green hover:shadow-brand-green/10',
          badge: 'bg-brand-green/10 text-brand-green border-brand-green/20',
          icon: <GraduationCap className="w-8 h-8 text-brand-green animate-pulse-slow" />,
          grades: 'Grades 6th to 8th'
        };
      case 'Senior':
        return {
          banner: 'from-brand-navy via-slate-900 to-brand-orange/85',
          glow: 'glow-orange hover:shadow-brand-orange/10',
          badge: 'bg-brand-orange/10 text-brand-orange border-brand-orange/20',
          icon: <Cpu className="w-8 h-8 text-brand-orange animate-pulse-slow" />,
          grades: 'Grades 9th to 12th'
        };
      case 'Masters':
      default:
        return {
          banner: 'from-brand-navy via-slate-900 to-indigo-600/80',
          glow: 'glow-navy hover:shadow-indigo-600/10',
          badge: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
          icon: <Layers className="w-8 h-8 text-indigo-400 animate-pulse-slow" />,
          grades: 'College & Undergrad'
        };
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 md:py-20 space-y-12">
      
      {/* ── Page Header ── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 text-left border-b border-slate-900/60 pb-8 relative">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-1.5 bg-brand-green/10 text-brand-green border border-brand-green/20 rounded-lg px-2.5 py-1 text-xs font-bold uppercase tracking-wider">
            <Trophy className="w-3.5 h-3.5" />
            <span>Active Catalogs</span>
          </div>
          <h1 className="font-heading font-extrabold text-4xl md:text-5xl text-white">
            BAIO Olympiad tracks
          </h1>
          <p className="text-slate-400 text-sm md:text-base max-w-xl font-light leading-relaxed">
            Challenge your limits by registering for India's standard-setting cognitive assessments. Choose your category to begin seat-allocation.
          </p>
        </div>

        <button 
          onClick={fetchOlympiads}
          className="self-start md:self-auto flex items-center gap-1.5 text-xs text-slate-400 hover:text-white bg-slate-900 border border-slate-800/80 px-3 py-1.5 rounded-xl transition-all cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Sync Database</span>
        </button>
      </div>

      {/* ── Status Indicator (Database Offline Warning) ── */}
      {error && (
        <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl flex items-start gap-3 text-left">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20 shrink-0">
            <ShieldAlert className="w-5 h-5 text-amber-500" />
          </div>
          <div className="space-y-0.5">
            <h4 className="text-sm font-bold text-slate-200">Database Connection Stub Mode</h4>
            <p className="text-xs text-slate-400 leading-relaxed font-light">
              Could not retrieve the remote database catalog list. Showing pre-allocated BAIO official structural divisions.
            </p>
          </div>
        </div>
      )}

      {/* ── Loading Skeleton Grid ── */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[1, 2, 3].map((n) => (
            <div key={n} className="glass-card rounded-3xl overflow-hidden border border-slate-900 h-[500px] flex flex-col justify-between animate-pulse">
              <div className="h-44 bg-slate-900/80" />
              <div className="p-6 space-y-4 flex-1">
                <div className="w-24 h-5 bg-slate-800 rounded-lg" />
                <div className="w-3/4 h-7 bg-slate-800 rounded-lg" />
                <div className="space-y-2 pt-2">
                  <div className="w-full h-4 bg-slate-800 rounded-lg" />
                  <div className="w-5/6 h-4 bg-slate-800 rounded-lg" />
                </div>
              </div>
              <div className="p-6 border-t border-slate-900/60 flex items-center justify-between">
                <div className="w-20 h-5 bg-slate-800 rounded-lg" />
                <div className="w-28 h-10 bg-slate-800 rounded-xl" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* ── Olympiads Grid ── */
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {olympiads.map((item) => {
            const track = getCategoryDetails(item.category);
            return (
              <div 
                key={item._id} 
                className={`glass-card rounded-3xl overflow-hidden border border-white/5 flex flex-col justify-between transition-all duration-300 relative ${track.glow}`}
              >
                
                {/* ── Card Top Header (Banner Graphic) ── */}
                <div className={`h-44 w-full bg-gradient-to-br ${track.banner} relative p-6 flex flex-col justify-between overflow-hidden border-b border-slate-900/50`}>
                  
                  {/* Subtle Grid Overlay on Banner */}
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.18),rgba(255,255,255,0))] opacity-40" />

                  {/* Brand and category icons */}
                  <div className="flex justify-between items-start relative z-10">
                    <div className="inline-flex items-center gap-1 bg-slate-950/80 px-2.5 py-1 rounded-md border border-white/5 text-[9px] font-bold text-slate-300 uppercase tracking-widest leading-none">
                      <Sparkles className="w-2.5 h-2.5 text-brand-orange animate-pulse" />
                      <span>{item.status || 'Active'}</span>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-slate-950/70 flex items-center justify-center border border-white/5">
                      {track.icon}
                    </div>
                  </div>

                  {/* Division Badge */}
                  <div className="relative z-10 text-left">
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider border leading-none ${track.badge}`}>
                      {track.grades}
                    </span>
                  </div>

                </div>

                {/* ── Card Body Details ── */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-6 text-left relative">
                  
                  <div className="space-y-3">
                    <h3 className="font-heading font-extrabold text-xl text-slate-100 leading-snug">
                      {item.title}
                    </h3>
                    <p className="text-slate-400 text-xs sm:text-sm leading-relaxed font-light line-clamp-4">
                      {item.description}
                    </p>
                  </div>

                  {/* Timeline Indicators */}
                  <div className="space-y-2 pt-3 border-t border-slate-900/40">
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <Calendar className="w-4 h-4 text-brand-green" />
                      <span>Exam Date: <strong className="text-slate-200">{getReadableDate(item.timeline?.examDate || item.examDate)}</strong></span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <Clock className="w-4 h-4 text-brand-orange" />
                      <span>Closing: <strong className="text-slate-200">{getReadableDate(item.timeline?.registrationEnd || item.registrationLastDate)}</strong></span>
                    </div>
                  </div>

                </div>

                {/* ── Card Footer Action Bar ── */}
                <div className="p-6 border-t border-slate-900/60 bg-slate-950/20 flex items-center justify-between gap-4">
                  <div className="text-left">
                    <p className="text-[10px] text-slate-500 font-bold uppercase leading-none">Registration Fee</p>
                    <p className="text-lg font-extrabold text-white font-heading mt-1">
                      {item.currency === 'INR' || !item.currency ? '₹' : item.currency + ' '}
                      {item.registrationFee}
                    </p>
                  </div>
                  
                  {isAuthenticated ? (
                    isStudent ? (
                      registeredOlympiadIds.includes(item._id) ? (
                        <div className="bg-brand-green/10 border border-brand-green/20 text-brand-green font-bold text-xs px-5 py-3 rounded-xl flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Registered</span>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleRegister(item._id, item.title)}
                          className="bg-brand-orange hover:bg-brand-orange hover:shadow-lg hover:shadow-brand-orange/20 text-white font-bold text-xs px-5 py-3 rounded-xl transition-all duration-200 flex items-center gap-1.5 group cursor-pointer"
                        >
                          <span>Register Now</span>
                          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                        </button>
                      )
                    ) : (
                      <div className="bg-slate-900 border border-slate-850 text-slate-500 font-bold text-xs px-5 py-3 rounded-xl flex items-center gap-1">
                        <span>Students Only</span>
                      </div>
                    )
                  ) : (
                    <Link
                      to="/student/login"
                      className="bg-brand-orange hover:bg-brand-orange hover:shadow-lg hover:shadow-brand-orange/20 text-white font-bold text-xs px-5 py-3 rounded-xl transition-all duration-200 flex items-center gap-1.5 group"
                    >
                      <span>Register Now</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* Bottom Center Proctor notice to emphasize physical integrity */}
      <div className="bg-slate-950/80 border border-slate-900/80 max-w-xl mx-auto p-4 rounded-2xl flex items-center justify-center text-slate-500 text-xs text-center gap-2 mt-8">
        <ShieldAlert className="w-4 h-4 text-slate-500 shrink-0" />
        <span>Important: Actual examination center coordinates and physical allocations will be updated on your Admit Card.</span>
      </div>

    </div>
  );
}
