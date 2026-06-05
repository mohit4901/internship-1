import React, { useEffect, useState } from 'react';
import { olympiadAPI } from '../services';
import { Calendar, Clock, Trophy, ShieldAlert, RefreshCw, Sparkles, GraduationCap, Cpu, Layers, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function renderIllustration(index) {
  const colors = [
    { name: 'green',   grad: 'from-emerald-600 to-teal-850',      stroke: '#34d399', glow: '#059669' },
    { name: 'orange',  grad: 'from-orange-500 to-amber-700',      stroke: '#fb923c', glow: '#ea580c' },
    { name: 'indigo',  grad: 'from-indigo-600 to-blue-900',       stroke: '#818cf8', glow: '#4f46e5' },
    { name: 'purple',  grad: 'from-fuchsia-600 to-violet-900',    stroke: '#e879f9', glow: '#c084fc' },
    { name: 'teal',    grad: 'from-cyan-500 to-teal-850',         stroke: '#22d3ee', glow: '#0891b2' },
    { name: 'yellow',  grad: 'from-amber-400 to-orange-600',      stroke: '#fbbf24', glow: '#d97706' },
    { name: 'rose',    grad: 'from-rose-500 to-pink-900',         stroke: '#f43f5e', glow: '#db2777' },
  ];
  
  const theme = colors[index % colors.length];
  
  return (
    <div className={`absolute inset-0 w-full h-full bg-gradient-to-br ${theme.grad} opacity-95 transition-transform duration-500 ease-in-out group-hover:scale-110 overflow-hidden`}>
      <svg className="absolute inset-0 w-full h-full opacity-30" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Subtle grid lines */}
        <path d="M 0 50 L 400 50 M 0 100 L 400 100 M 0 150 L 400 150 M 0 200 L 400 200 M 0 250 L 400 250 M 0 300 L 400 300 M 0 350 L 400 350" stroke={theme.stroke} strokeWidth="0.5" strokeDasharray="3 6" />
        <path d="M 50 0 L 50 400 M 100 0 L 100 400 M 150 0 L 150 400 M 200 0 L 200 400 M 250 0 L 250 400 M 300 0 L 300 400 M 350 0 L 350 400" stroke={theme.stroke} strokeWidth="0.5" strokeDasharray="3 6" />
        
        {/* Dynamic Vector Shapes based on index */}
        {index % 7 === 0 && (
          <>
            <circle cx="200" cy="200" r="60" stroke={theme.stroke} strokeWidth="2" />
            <circle cx="200" cy="200" r="10" fill={theme.stroke} />
            <line x1="200" y1="200" x2="120" y2="120" stroke={theme.stroke} strokeWidth="2" />
            <line x1="200" y1="200" x2="280" y2="120" stroke={theme.stroke} strokeWidth="2" />
            <line x1="200" y1="200" x2="120" y2="280" stroke={theme.stroke} strokeWidth="2" />
            <line x1="200" y1="200" x2="280" y2="280" stroke={theme.stroke} strokeWidth="2" />
            <circle cx="120" cy="120" r="15" fill={theme.stroke} />
            <circle cx="280" cy="120" r="15" fill={theme.stroke} />
            <circle cx="120" cy="280" r="15" fill={theme.stroke} />
            <circle cx="280" cy="280" r="15" fill={theme.stroke} />
          </>
        )}
        
        {index % 7 === 1 && (
          <>
            <rect x="80" y="80" width="100" height="60" rx="8" stroke={theme.stroke} strokeWidth="2" fill="rgba(0,0,0,0.2)" />
            <rect x="220" y="80" width="100" height="60" rx="8" stroke={theme.stroke} strokeWidth="2" fill="rgba(0,0,0,0.2)" />
            <line x1="130" y1="140" x2="200" y2="220" stroke={theme.stroke} strokeWidth="2" />
            <line x1="270" y1="140" x2="200" y2="220" stroke={theme.stroke} strokeWidth="2" />
            <polygon points="200,200 240,280 160,280" stroke={theme.stroke} strokeWidth="2" fill="rgba(0,0,0,0.2)" />
          </>
        )}
        
        {index % 7 === 2 && (
          <>
            <circle cx="200" cy="200" r="100" stroke={theme.stroke} strokeWidth="1" strokeDasharray="5 5" />
            <circle cx="200" cy="200" r="80" stroke={theme.stroke} strokeWidth="2" />
            <circle cx="200" cy="200" r="50" stroke={theme.stroke} strokeWidth="3" />
            <circle cx="200" cy="200" r="20" fill={theme.stroke} />
            <line x1="200" y1="50" x2="200" y2="350" stroke={theme.stroke} strokeWidth="1.5" />
            <line x1="50" y1="200" x2="350" y2="200" stroke={theme.stroke} strokeWidth="1.5" />
          </>
        )}

        {index % 7 === 3 && (
          <>
            <rect x="50" y="50" width="300" height="300" rx="16" stroke={theme.stroke} strokeWidth="2" />
            <line x1="90" y1="100" x2="310" y2="100" stroke={theme.stroke} strokeWidth="3" />
            <line x1="90" y1="150" x2="260" y2="150" stroke={theme.stroke} strokeWidth="2" />
            <line x1="90" y1="200" x2="290" y2="200" stroke={theme.stroke} strokeWidth="2" />
            <line x1="90" y1="250" x2="210" y2="250" stroke={theme.stroke} strokeWidth="2" />
            <line x1="90" y1="300" x2="270" y2="300" stroke={theme.stroke} strokeWidth="2" />
          </>
        )}

        {index % 7 === 4 && (
          <>
            <polygon points="200,60 320,130 320,270 200,340 80,270 80,130" stroke={theme.stroke} strokeWidth="2" fill="rgba(0,0,0,0.1)" />
            <polygon points="200,100 290,150 290,250 200,300 110,250 110,150" stroke={theme.stroke} strokeWidth="1.5" />
            <circle cx="200" cy="200" r="30" fill={theme.stroke} />
          </>
        )}

        {index % 7 === 5 && (
          <>
            <polygon points="200,80 320,300 80,300" stroke={theme.stroke} strokeWidth="3" fill="rgba(0,0,0,0.1)" />
            <circle cx="200" cy="80" r="12" fill={theme.stroke} />
            <circle cx="320" cy="300" r="12" fill={theme.stroke} />
            <circle cx="80" cy="300" r="12" fill={theme.stroke} />
            <line x1="200" y1="170" x2="200" y2="300" stroke={theme.stroke} strokeWidth="1.5" />
            <circle cx="200" cy="170" r="8" fill="white" />
          </>
        )}

        {index % 7 === 6 && (
          <>
            <path d="M 50 200 Q 125 75, 200 200 T 350 200" stroke={theme.stroke} strokeWidth="3" fill="none" />
            <path d="M 50 200 Q 125 325, 200 200 T 350 200" stroke={theme.stroke} strokeWidth="1.5" strokeDasharray="4 4" fill="none" />
            <circle cx="125" cy="137" r="10" fill={theme.stroke} />
            <circle cx="275" cy="262" r="10" fill={theme.stroke} />
          </>
        )}
      </svg>
      {/* Decorative ambient glowing spot inside card */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[220px] h-[220px] rounded-full opacity-35 blur-3xl pointer-events-none" style={{ backgroundColor: theme.glow }} />
    </div>
  );
}

export default function OlympiadsPage() {
  const { isAuthenticated, isSchool } = useAuth();
  const [olympiads, setOlympiads] = useState([]);
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

  useEffect(() => {
    fetchOlympiads();
  }, []);

  const getReadableDate = (dateStr) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  const getCategoryDetails = (category) => {
    switch (category) {
      case 'Junior':
        return {
          icon: <GraduationCap className="w-5 h-5 text-white" />,
          grades: 'Grades 6th to 9th'
        };
      case 'Senior':
        return {
          icon: <Cpu className="w-5 h-5 text-white" />,
          grades: 'Grades 10th to 12th'
        };
      case 'Masters':
      default:
        return {
          icon: <Layers className="w-5 h-5 text-white" />,
          grades: 'College & Undergrad'
        };
    }
  };

  return (
    <div className="bg-brand-cream min-h-screen selection:bg-brand-orange selection:text-white pb-24 pt-16 md:pt-28">
      <div className="max-w-7xl mx-auto px-6 space-y-12">
        
        {/* ── Page Header ── */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 text-left border-b border-slate-200 pb-6 relative">
          <div className="space-y-3">
            <span className="brand-badge brand-badge-navy">
              Active Catalogs
            </span>
            <h1 className="font-heading font-black text-4xl md:text-5xl text-brand-navy">
              BAIO Olympiad Tracks
            </h1>
            <p className="text-slate-650 text-sm md:text-base max-w-xl font-semibold leading-relaxed">
              Challenge your limits by enrolling your school in India's standard-setting cognitive assessments.
            </p>
          </div>

          <button 
            onClick={fetchOlympiads}
            className="self-start md:self-auto flex items-center gap-1.5 text-xs text-brand-navy font-bold hover:bg-slate-100 bg-white border border-brand-navy/20 px-3.5 py-1.5 rounded-xl transition-all cursor-pointer shadow-sm hover:border-brand-navy/40"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Sync Database</span>
          </button>
        </div>

        {/* ── Status Indicator (Database Connection Warning) ── */}
        {error && (
          <div className="bg-amber-50 border border-amber-300 rounded-3xl px-6 py-5 flex items-start gap-4 shadow-sm text-left animate-fade-in">
            <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center shrink-0 border border-amber-300">
              <ShieldAlert className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-sm font-extrabold text-amber-900 uppercase tracking-wide">Database Connection Stub Mode</p>
              <p className="text-xs text-amber-700 mt-1 leading-relaxed font-semibold">
                Could not retrieve the remote database catalog list. Showing pre-allocated BAIO official structural divisions.
              </p>
            </div>
          </div>
        )}

        {/* ── Loading Skeleton Grid ── */}
        {loading ? (
          <div className="flex flex-wrap justify-center gap-8">
            {[1, 2, 3].map((n) => (
              <div key={n} className="w-full max-w-[360px] h-[440px] bg-white rounded-3xl border border-slate-200 flex flex-col justify-between p-6">
                <div className="h-12 w-12 rounded-full bg-slate-200" />
                <div className="space-y-4">
                  <div className="w-20 h-4 bg-slate-200 rounded" />
                  <div className="w-3/4 h-8 bg-slate-200 rounded" />
                  <div className="w-1/2 h-4 bg-slate-200 rounded" />
                </div>
                <div className="border-t border-slate-100 pt-4 flex items-center justify-between">
                  <div className="w-20 h-6 bg-slate-200 rounded" />
                  <div className="w-28 h-10 bg-slate-200 rounded-xl" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* ── Centered Olympiads Flex/Grid Layout ── */
          <div className="flex flex-wrap justify-center gap-8">
            {olympiads.map((item, index) => {
              const track = getCategoryDetails(item.category);
              return (
                <div 
                  key={item._id} 
                  className="group relative w-full max-w-[360px] h-[440px] overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 shadow-lg transition-all duration-300 ease-in-out hover:shadow-2xl hover:-translate-y-2"
                >
                  {/* Custom Code-based Vector Illustration */}
                  {renderIllustration(index)}

                  {/* Gradient Overlay for Text Readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent z-10 pointer-events-none" />

                  {/* Content Container */}
                  <div className="relative z-20 flex h-full flex-col justify-between p-6 text-white">
                    {/* Top Section: Logo Icon */}
                    <div className="flex h-36 items-start">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-white/30 bg-black/30 backdrop-blur-sm shadow-md">
                        {track.icon}
                      </div>
                    </div>
                    
                    {/* Middle Section: Details (slides up on hover) */}
                    <div className="space-y-4 transition-transform duration-500 ease-in-out group-hover:-translate-y-20 text-left">
                      <div>
                        <span className="inline-block px-2.5 py-0.5 bg-brand-orange text-white text-[9px] font-black rounded-lg uppercase tracking-widest mb-2 border border-white/20">
                          {item.status || 'Active'}
                        </span>
                        <h3 className="text-2xl font-black text-white leading-snug">{item.title}</h3>
                        <p className="text-xs text-white/80 font-bold tracking-wide mt-1">{track.grades}</p>
                      </div>
                      <div className="opacity-0 transition-opacity duration-300 group-hover:opacity-100 space-y-1.5">
                        <h4 className="font-extrabold text-[9px] text-white/60 tracking-widest uppercase">Overview</h4>
                        <p className="text-xs text-white/80 leading-relaxed font-semibold line-clamp-3">
                          {item.description}
                        </p>
                      </div>
                    </div>

                    {/* Bottom Section: Price and Button (revealed on hover) */}
                    <div className="absolute -bottom-24 left-0 w-full p-6 opacity-0 transition-all duration-500 ease-in-out group-hover:bottom-0 group-hover:opacity-100 z-30">
                      <div className="flex items-center justify-between border-t border-white/10 pt-4">
                        <div className="text-left">
                          <span className="text-[9px] text-white/50 block font-extrabold uppercase leading-none">REGISTRATION FEE</span>
                          <span className="text-2xl font-black text-white font-heading mt-1.5 block">
                            {item.currency === 'INR' || !item.currency ? '₹' : item.currency + ' '}
                            {item.registrationFee}
                          </span>
                        </div>
                        
                        {isAuthenticated && isSchool ? (
                          <Link
                            to="/school/dashboard"
                            className="bg-white hover:bg-white/95 text-brand-navy font-extrabold text-xs px-4 py-2.5 rounded-xl border border-slate-200 transition-all duration-200 flex items-center gap-1 shadow-sm active:translate-y-[1px]"
                          >
                            <span>Dashboard</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </Link>
                        ) : (
                          <Link
                            to="/register"
                            className="bg-brand-orange hover:bg-brand-orange/95 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl border border-brand-orange transition-all duration-200 flex items-center gap-1 shadow-sm active:translate-y-[1px]"
                          >
                            <span>Register School</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </Link>
                        )}
                      </div>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Bottom Center Proctor notice */}
        <div className="bg-white border border-slate-250 max-w-xl mx-auto p-4 rounded-2xl flex items-center justify-center text-slate-600 text-xs text-center gap-2 mt-8 font-semibold shadow-sm">
          <ShieldAlert className="w-4 h-4 text-brand-orange shrink-0" />
          <span>Important: Coordination details and exam centers will be communicated directly to participating school coordinators.</span>
        </div>

      </div>
    </div>
  );
}
