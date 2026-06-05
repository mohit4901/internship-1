import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2, Building2, Users, BookOpen, Trophy, Sparkles, PhoneCall } from 'lucide-react';

const valuePropsGroups = [
  {
    audience: 'For the Principal',
    icon: <Building2 className="w-5 h-5 text-brand-orange" />,
    borderClass: 'edu-border-orange',
    shadowClass: 'edu-shadow-orange',
    items: [
      'A class-by-class AI Readiness Report — diagnostic data you can present at board meetings, PTMs, and school improvement plans.',
      'The BAIO AI Ready School Badge — a national credential you can display on your website, gates, and prospectus.',
      'A featured listing on the BAIO National Leaderboard — public recognition of your AI education commitment.',
      'Founding School status — priority coordinator, featured listing, and permanent founding badge.',
    ],
  },
  {
    audience: 'For Teachers',
    icon: <BookOpen className="w-5 h-5 text-brand-green" />,
    borderClass: 'edu-border-green',
    shadowClass: 'edu-shadow-green',
    items: [
      'Zero preparation required. BAIO is a standalone 60-minute exam — teachers are not tested on it and do not need to teach to it.',
      'The AI Readiness Report identifies which specific CTAI skills are weak — actionable curriculum guidance without additional work.',
      'BAIO questions align to what CTAI already asks teachers to cover. Running BAIO reinforces existing teaching.',
    ],
  },
  {
    audience: 'For Students',
    icon: <Users className="w-5 h-5 text-brand-navy" />,
    borderClass: 'edu-border-navy',
    shadowClass: 'edu-shadow',
    items: [
      'A printed AI Readiness Certificate — a credential every participant takes home.',
      'National recognition for high performers — Gold, Silver, and Bronze medals with All-India rankings.',
      'The experience of sitting an AI-focused exam at a national level — building confidence in the subject that defines their generation.',
      'A BAIO Merit Letter for top performers that strengthens university and scholarship applications.',
    ],
  },
  {
    audience: 'For Parents',
    icon: <Trophy className="w-5 h-5 text-brand-orange" />,
    borderClass: 'edu-border-orange',
    shadowClass: 'edu-shadow-orange',
    items: [
      'A tangible answer to the question every parent is asking: what is the school doing about AI education?',
      'A printed certificate their child can show, keep, and include in their academic portfolio.',
      'Confidence that their school is aligned with CBSE\'s most forward-looking curriculum framework.',
      'Access to their child\'s performance on the BAIO National Leaderboard.',
    ],
  },
];

const objections = [
  {
    q: 'We already do SOF / NSO / NCO. Why do we need BAIO?',
    a: "SOF olympiads test Maths, Science, and English. BAIO tests AI and computational thinking — the subject CBSE has mandated under CTAI 2026-27 that no existing olympiad addresses. BAIO and SOF serve completely different purposes and the majority of our founding partner schools run both.",
  },
  {
    q: "Our parents are already paying a lot. We don't want to add to the burden.",
    a: "BAIO is priced as a school registration — a single fee covering all student materials, certificates, the AI Readiness Report, and leaderboard listing. There is no per-student charge to parents. For a school of 3,000 students, the per-student cost is comparable to one recess snack.",
  },
  {
    q: 'What if our students are not prepared for an AI exam?',
    a: "BAIO is an assessment of what CBSE's CTAI framework already expects students to know. If your school follows the CBSE curriculum, your students are already exposed to the concepts BAIO tests. The AI Readiness Report will tell you exactly where they are strong and where gaps exist.",
  },
  {
    q: "We don't have the infrastructure — no computer lab, no internet.",
    a: 'BAIO requires no computers, no internet, and no special infrastructure. It is a pen-and-paper exam that can be run in any classroom. This is a deliberate design choice — every school in India, regardless of resources, can participate on equal terms.',
  },
  {
    q: "What is the reputational risk? We don't know BAIO.",
    a: "We understand this concern and respect it. That is why we publish our full CTAI alignment audit, our complete syllabus, and sample papers publicly. We invite you to review exactly what we test before you make any commitment. Our founding partner schools include some of Delhi NCR's most respected institutions.",
  },
];

export default function ForSchoolsPage() {
  const [openIdx, setOpenIdx] = useState(null);
  const toggle = (idx) => setOpenIdx(openIdx === idx ? null : idx);

  return (
    <div className="bg-brand-cream min-h-screen selection:bg-brand-orange selection:text-white pb-1">

      {/* ─── HERO SECTION ─────────────────────────────────────────── */}
      <section className="relative pt-16 pb-24 px-6 text-center">
        
        {/* Floating Shapes */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/4 left-10 w-8 h-8 rounded-full bg-brand-orange/10 floating-slow-y" />
          <div className="absolute top-1/3 right-12 w-12 h-12 rounded-full bg-brand-green/10 floating-slow-x" />
          <div className="absolute top-10 right-1/4 text-brand-orange/20 floating-rotate">
            <Sparkles className="w-10 h-10" />
          </div>
        </div>

        <div className="max-w-4xl mx-auto space-y-6 relative z-10">
          <span className="brand-badge brand-badge-orange">
            School Leaders
          </span>
          <h1 className="text-5xl md:text-6xl font-extrabold text-brand-navy tracking-tight leading-[1.1]">
            The Olympiad that works <br />
            <span className="text-brand-green">with schools, not against them.</span>
          </h1>
          <p className="text-slate-600 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
            We built BAIO in consultation with school leaders across India. We designed every element to ensure zero teacher burden, zero special computer lab infrastructure, and maximum utility.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link to="/register" className="btn-primary w-full sm:w-auto justify-center shadow-lg">
              Register Your School <ArrowRight className="w-5 h-5" />
            </Link>
            <Link to="/contact" className="btn-navy w-full sm:w-auto justify-center bg-white text-brand-navy border-2 border-brand-navy hover:bg-slate-50 shadow-sm">
              Talk to Our Team
            </Link>
          </div>
        </div>
      </section>

      {/* ─── VALUE PROPOSITION GRID ───────────────────────────────── */}
      <section className="pb-24 px-6">
        <div className="max-w-6xl mx-auto space-y-12">
          
          <div className="text-center space-y-4">
            <span className="brand-badge brand-badge-navy">
              Value Proposition
            </span>
            <h2 className="text-4xl font-extrabold text-brand-navy">
              Real institutional value. Zero coordination burden.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {valuePropsGroups.map((group, idx) => (
              <div key={idx} className={`bg-white rounded-3xl p-6 border-4 ${group.borderClass} ${group.shadowClass} flex flex-col justify-between space-y-6`}>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-brand-cream border border-slate-100 flex items-center justify-center shadow-sm">
                      {group.icon}
                    </div>
                    <h3 className="text-xl font-extrabold text-brand-navy">{group.audience}</h3>
                  </div>
                  <ul className="space-y-3">
                    {group.items.map((item, jIdx) => (
                      <li key={jIdx} className="flex gap-3 items-start text-xs md:text-sm text-slate-600 leading-relaxed">
                        <CheckCircle2 className="w-5 h-5 text-brand-green shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ─── COORDINATOR DETAILS & STATS ──────────────────────────── */}
      <section className="py-24 px-6 bg-white border-y-2 border-slate-100">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-7 space-y-6">
            <span className="brand-badge brand-badge-orange">
              Operational Support
            </span>
            <h2 className="text-4xl font-extrabold text-brand-navy leading-tight">
              A dedicated BAIO Coordinator is assigned to you on day one.
            </h2>
            <div className="space-y-4 text-slate-600 leading-relaxed text-sm md:text-base">
              <p>
                Every school that registers is assigned a dedicated BAIO School Coordinator. They serve as a single point of contact to manage all dates, materials, checklists, and final results distribution.
              </p>
              <p>
                We handle the heavy lifting. All booklets, instructions, seating chart layouts, and OMR packets arrive pre-packed at your office doors 5 days prior to your test date.
              </p>
              <p className="font-bold text-brand-navy">
                We follow up, answer queries in under two hours, and ensure your principal has results ready within 10 business days.
              </p>
            </div>
          </div>

          <div className="lg:col-span-5 grid grid-cols-2 gap-4">
            {[
              { metric: '24 hrs', label: 'Coordinator assigned after online signup' },
              { metric: '5 days', label: 'Before exam — all physical sets arrive' },
              { metric: '2 hrs', label: 'Guaranteed response time on school inquiries' },
              { metric: '10 days', label: 'To deliver complete diagnostic AI reports' },
            ].map((stat, idx) => (
              <div key={idx} className="bg-brand-cream border-2 border-brand-navy rounded-3xl p-6 text-center space-y-1 edu-shadow">
                <h4 className="text-2xl font-extrabold text-brand-navy">{stat.metric}</h4>
                <p className="text-[10px] text-slate-600 leading-snug font-medium uppercase tracking-wider">{stat.label}</p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ─── THE DIAGNOSTIC REPORT SECTION ────────────────────────── */}
      <section className="py-24 px-6 bg-brand-cream">
        <div className="max-w-4xl mx-auto space-y-10">
          
          <div className="text-center space-y-4">
            <span className="brand-badge brand-badge-navy">
              School Diagnostics
            </span>
            <h2 className="text-4xl font-extrabold text-brand-navy">
              The AI Readiness Report
            </h2>
            <p className="text-slate-600 max-w-lg mx-auto text-sm leading-relaxed">
              India's only class-by-class educational diagnostic report measuring practical computational thinking and AI literacy.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              'Class-wise average scores across all four key evaluation modules.',
              'CTAI competency mapping showing which framework areas are fully mastered.',
              'Benchmark tracking against regional city averages and national BAIO cohorts.',
              'Individualized student performance marks mapped per roll number.',
              'Curriculum suggestions to fill classroom logic gaps.',
            ].map((feat, idx) => (
              <div key={idx} className="bg-white rounded-2xl border border-slate-200 p-4 flex gap-3 shadow-sm items-start">
                <CheckCircle2 className="w-5 h-5 text-brand-green shrink-0 mt-0.5" />
                <p className="text-xs text-slate-700 leading-relaxed font-medium">{feat}</p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ─── PRINCIPALS OBJECTIONS ACCORDION ──────────────────────── */}
      <section className="py-24 px-6 bg-white border-t border-slate-100">
        <div className="max-w-3xl mx-auto space-y-12">
          
          <div className="text-center space-y-4">
            <span className="brand-badge brand-badge-orange">
              FAQ for Leaders
            </span>
            <h2 className="text-4xl font-extrabold text-brand-navy">
              Addressing key questions from school boards.
            </h2>
          </div>

          <div className="space-y-4">
            {objections.map((faq, idx) => {
              const isOpen = openIdx === idx;
              return (
                <div key={idx} className="border-2 border-slate-200 rounded-3xl overflow-hidden bg-slate-50/50">
                  <button
                    onClick={() => toggle(idx)}
                    className="w-full px-6 py-4 flex items-center justify-between text-left font-bold text-brand-navy hover:bg-slate-100/50 transition-colors"
                  >
                    <span>{faq.q}</span>
                    <span className="text-xl leading-none text-slate-400">{isOpen ? '−' : '+'}</span>
                  </button>
                  {isOpen && (
                    <div className="px-6 pb-5 pt-1 text-slate-600 text-sm border-t border-slate-200 leading-relaxed bg-white">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* ─── CHAIN SCHOOLS GROUP REGISTRATION ─────────────────────── */}
      <section className="py-24 px-6 bg-brand-cream">
        <div className="max-w-5xl mx-auto bg-brand-navy text-white rounded-3xl border-4 border-brand-navy edu-shadow p-8 md:p-12 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          
          <div className="md:col-span-8 space-y-4">
            <span className="brand-badge brand-badge-white">
              Chain Schools
            </span>
            <h2 className="text-3xl font-extrabold">Group registration packages.</h2>
            <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
              If your school is part of a multi-campus society (e.g. DPS, Ryan Group, Apeejay, GD Goenka, Amity), we support unified agreements covering all branches. This includes unified scheduling, single-contract pricing, and group-wide diagnostic leadership panels.
            </p>
          </div>

          <div className="md:col-span-4 space-y-4 md:text-right">
            <span className="text-xs text-slate-400 block">Contact group onboarding:</span>
            <a href="mailto:schools@baio.in" className="text-lg font-bold text-brand-orange hover:underline block">schools@baio.in</a>
            <Link to="/register" className="btn-primary w-full justify-center shadow-lg">
              Start Signup
            </Link>
          </div>

        </div>
      </section>

    </div>
  );
}
