import React, { useEffect, useState } from 'react';
import { getCmsContent } from '../services/cms.service';
import { HelpCircle, ChevronDown, Search } from 'lucide-react';

const DEFAULT_FAQS = [
  { question: 'What is Bharat AI Olympiad?', answer: 'BAIO is a national-level AI-focused competition designed to test and nurture artificial intelligence knowledge among school and college students across India.' },
  { question: 'Who is eligible to participate?', answer: 'Students from Class 6 to Class 12 can register under the Junior or Senior Division. College undergraduates may apply for the Masters Division.' },
  { question: 'How do I register?', answer: 'Click "Register Now" on the Olympiads page, select your category, fill in your details, and complete the registration fee payment through the secure gateway.' },
  { question: 'What is the exam format?', answer: 'The exam is conducted online and consists of multiple-choice questions covering AI fundamentals, logic, mathematics, and problem-solving.' },
  { question: 'When will results be announced?', answer: 'Results are typically published within 3 weeks of the exam date. You can check your results on the Results page using your Roll Number.' },
  { question: 'Is there a refund policy?', answer: 'Registration fees are non-refundable once confirmed. In case of exam cancellation by BAIO, a full refund will be issued within 7 working days.' },
];

function FAQItem({ item, index }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className={`border rounded-xl overflow-hidden transition-all duration-200 ${
        open ? 'border-brand-orange/30 bg-brand-orange/5' : 'border-white/6 bg-white/2 hover:border-white/10'
      }`}
    >
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between gap-4 px-6 py-4 text-left cursor-pointer"
      >
        <div className="flex items-start gap-3">
          <span className="text-[10px] font-bold text-brand-orange bg-brand-orange/10 border border-brand-orange/20 rounded-lg px-2 py-1 mt-0.5 shrink-0">
            Q{String(index + 1).padStart(2, '0')}
          </span>
          <span className={`text-sm font-semibold leading-snug ${open ? 'text-white' : 'text-slate-300'}`}>
            {item.question}
          </span>
        </div>
        <ChevronDown className={`w-4 h-4 text-slate-500 shrink-0 transition-transform duration-200 ${open ? 'rotate-180 text-brand-orange' : ''}`} />
      </button>
      {open && (
        <div className="px-6 pb-5">
          <div className="ml-[52px] text-sm text-slate-400 leading-relaxed border-t border-white/5 pt-3">
            {item.answer}
          </div>
        </div>
      )}
    </div>
  );
}

export default function FAQsPage() {
  const [faqs,    setFaqs]    = useState(DEFAULT_FAQS);
  const [loading, setLoading] = useState(true);
  const [query,   setQuery]   = useState('');

  useEffect(() => {
    (async () => {
      try {
        const res = await getCmsContent('faq');
        const v   = res?.data?.data?.value || res?.data?.value;
        if (Array.isArray(v) && v.length > 0) setFaqs(v);
      } catch { /* use defaults */ }
      finally { setLoading(false); }
    })();
  }, []);

  const filtered = faqs.filter(f =>
    f.question.toLowerCase().includes(query.toLowerCase()) ||
    f.answer.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[hsl(222,47%,7%)] text-slate-100">
      {/* ── Hero ── */}
      <section className="relative overflow-hidden py-24 px-6 text-center">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-navy via-[hsl(222,47%,9%)] to-[hsl(222,47%,7%)]" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-48 bg-brand-green/5 rounded-full blur-3xl pointer-events-none" />
        <div className="relative max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-brand-green/10 border border-brand-green/20 text-brand-green text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-6">
            <HelpCircle className="w-3.5 h-3.5" /> Help Center
          </div>
          <h1 className="font-heading font-extrabold text-5xl md:text-6xl text-white leading-tight mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-slate-400 text-lg mb-8">
            Everything you need to know about BAIO — registration, exams, and results.
          </p>
          {/* Search */}
          <div className="relative max-w-md mx-auto">
            <Search className="w-4 h-4 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search questions…"
              value={query}
              onChange={e => setQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-brand-green/50 transition-all"
            />
          </div>
        </div>
      </section>

      {/* ── FAQ List ── */}
      <section className="max-w-3xl mx-auto px-6 pb-24 space-y-3">
        {loading
          ? Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-16 bg-white/3 border border-white/5 rounded-xl animate-pulse" />
            ))
          : filtered.length === 0
            ? (
              <div className="text-center py-16">
                <HelpCircle className="w-10 h-10 text-slate-700 mx-auto mb-3" />
                <p className="text-slate-500">No questions match your search.</p>
              </div>
            )
            : filtered.map((item, idx) => (
                <FAQItem key={idx} item={item} index={idx} />
              ))
        }
      </section>
    </div>
  );
}
