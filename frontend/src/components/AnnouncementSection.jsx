import React, { useEffect, useState } from 'react';
import { announcementAPI } from '../services';
import { Calendar, Bell, ShieldAlert, Sparkles, ChevronDown, ChevronUp, RefreshCw } from 'lucide-react';

export default function AnnouncementSection() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [expandedId, setExpandedId] = useState(null);

  const mockAnnouncements = [
    {
      _id: 'mock-1',
      title: 'BAIO 2026 Official Syllabus & Resource Kit Released',
      content: 'The official academic syllabus for Junior (6-8), Senior (9-12), and Masters divisions is now live. Register to download sample questions, logic blueprints, and AI python essentials compiled by top technical faculty members. Examinations will be conducted at external physical centres in July 2026.',
      category: 'OlympiadInfo',
      publishedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      isPinned: true
    },
    {
      _id: 'mock-2',
      title: 'Physical Test Centres and Room Allocation Guidelines',
      content: 'Important Notice: Bharat AI Olympiad is registered on this portal for seat-allocation only. To maintain absolute competitive integrity, all actual exams are held offline at designated external physical centers. Admit cards containing exact center coordinates, roll numbers, and timings will be available for download starting June 20, 2026.',
      category: 'Schedule',
      publishedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      isPinned: false
    },
    {
      _id: 'mock-3',
      title: 'National Merit Scholarship & Cash Prizes Announced',
      content: 'We are thrilled to announce a cash prize pool of ₹10,00,000 for National Rankers! The top 3 rankers in each division will secure direct tech internships, smart developer badges, and 100% scholarship grants for advanced deep learning training modules.',
      category: 'General',
      publishedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      isPinned: false
    }
  ];

  const fetchAnnouncements = async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await announcementAPI.list({ limit: 6 });
      let list = [];
      if (res?.data?.data?.announcements)       list = res.data.data.announcements;
      else if (Array.isArray(res?.data?.data))  list = res.data.data;
      else if (Array.isArray(res?.data))        list = res.data;
      else if (res?.data?.announcements)        list = res.data.announcements;

      setAnnouncements(list?.length > 0 ? list : mockAnnouncements);
    } catch (err) {
      console.warn('Backend offline — loading mock announcements.', err);
      setError(true);
      setAnnouncements(mockAnnouncements);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAnnouncements(); }, []);

  const getBadgeStyles = (category) => {
    switch (category) {
      case 'Emergency':    return 'bg-red-50 text-red-600 border-red-200';
      case 'Schedule':     return 'bg-orange-50 text-brand-orange border-orange-200';
      case 'OlympiadInfo': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      default:             return 'bg-slate-100 text-slate-600 border-slate-200';
    }
  };

  const getReadableDate = (dateStr) => {
    try {
      return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
    } catch { return dateStr; }
  };

  const toggleExpand = (id) => setExpandedId(expandedId === id ? null : id);

  return (
    <section className="py-20 bg-white">
      <div className="max-w-5xl mx-auto px-6 space-y-10">

        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-2">
            <span className="inline-flex items-center gap-1.5 bg-slate-100 text-slate-600 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider">
              <Bell className="w-3.5 h-3.5" /> Live Updates
            </span>
            <h2 className="font-heading font-bold text-3xl text-slate-900">
              Announcements &amp; Bulletins
            </h2>
            <p className="text-slate-500 text-sm max-w-lg">
              Stay up-to-date with official timelines, syllabus updates, and registration releases.
            </p>
          </div>

          <button
            onClick={fetchAnnouncements}
            className="self-start sm:self-auto flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-lg transition-colors duration-200 cursor-pointer"
            title="Refresh feed"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>

        {/* Offline warning */}
        {error && (
          <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
              <ShieldAlert className="w-4 h-4 text-amber-600" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-amber-900">Server Offline Mode</h4>
              <p className="text-xs text-amber-700 mt-0.5">Displaying pre-compiled official announcements.</p>
            </div>
          </div>
        )}

        {/* Loading skeleton */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[1, 2, 3].map((n) => (
              <div key={n} className="border border-slate-200 rounded-2xl p-5 flex flex-col gap-4 animate-pulse">
                <div className="flex justify-between">
                  <div className="w-20 h-5 bg-slate-100 rounded-md" />
                  <div className="w-24 h-4 bg-slate-100 rounded-md" />
                </div>
                <div className="space-y-2">
                  <div className="w-full h-5 bg-slate-100 rounded-md" />
                  <div className="w-2/3 h-4 bg-slate-100 rounded-md" />
                </div>
                <div className="w-full h-14 bg-slate-50 rounded-xl" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {announcements.map((item) => {
              const isExpanded = expandedId === item._id;
              return (
                <div
                  key={item._id}
                  className={`border-2 rounded-2xl p-5 flex flex-col justify-between transition-all duration-200 relative ${
                    item.isPinned
                      ? 'border-brand-orange/30 bg-orange-50/30'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  {/* Pinned badge */}
                  {item.isPinned && (
                    <div className="absolute -top-2.5 right-5 bg-brand-orange text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
                      <Sparkles className="w-2.5 h-2.5" /> Pinned
                    </div>
                  )}

                  <div className="space-y-3">
                    {/* Badge + Date */}
                    <div className="flex items-center justify-between">
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider border ${getBadgeStyles(item.category)}`}>
                        {item.category === 'OlympiadInfo' ? 'Olympiad Info' : item.category}
                      </span>
                      <div className="flex items-center gap-1 text-slate-400 text-xs">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{getReadableDate(item.publishedAt)}</span>
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="font-heading font-bold text-base text-slate-900 leading-snug">
                      {item.title}
                    </h3>

                    {/* Content */}
                    <p className={`text-slate-500 text-xs leading-relaxed ${isExpanded ? '' : 'line-clamp-3'}`}>
                      {item.content}
                    </p>
                  </div>

                  {/* Expand toggle */}
                  <div className="pt-4 border-t border-slate-100 mt-4">
                    <button
                      onClick={() => toggleExpand(item._id)}
                      className="text-xs font-semibold text-brand-orange hover:text-orange-600 flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      {isExpanded ? 'Close' : 'Read More'}
                      {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </section>
  );
}
