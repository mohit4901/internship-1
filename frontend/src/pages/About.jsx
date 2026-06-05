import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2, Sparkles, Trophy, BookOpen, Target, Calendar, Building2 } from 'lucide-react';

const pillars = [
  {
    num: '01',
    title: 'CTAI Alignment',
    body: 'Every BAIO question is mapped to a specific CTAI 2026-27 competency code. We conducted a 47-outcome audit and achieved 92–97% alignment across all six grades. Where the CTAI has gaps, we have gone beyond it.',
    borderClass: 'edu-border-orange',
    shadowClass: 'edu-shadow-orange',
    textColor: 'text-brand-orange'
  },
  {
    num: '02',
    title: 'Cognitive Appropriateness',
    body: 'A BAIO Class 3 question and a BAIO Class 8 question are not the same question at different difficulty. They are completely different thinking tasks designed for where each student is in their cognitive journey.',
    borderClass: 'edu-border-navy',
    shadowClass: 'edu-shadow',
    textColor: 'text-brand-navy'
  },
  {
    num: '03',
    title: 'India-First Content',
    body: "Every BAIO question uses an Indian context — Ola Cabs surge pricing, DigiYatra, India's DPDP Act 2023. Learning is most powerful when it is rooted in the familiar. India's AI story is one of the world's richest stories.",
    borderClass: 'edu-border-green',
    shadowClass: 'edu-shadow-green',
    textColor: 'text-brand-green'
  },
];

const differentiators = [
  { feature: 'Subject Area', baio: 'AI, Computational Thinking, Data Science, Ethics', others: 'Maths, Science, English' },
  { feature: 'CTAI Alignment', baio: 'Yes — 92-97% verified outcome audit', others: 'Not applicable' },
  { feature: 'NEP 2020 Integrated', baio: 'Full pedagogical integration', others: 'Partial or none' },
  { feature: 'India-First Content', baio: 'Bhashini, DigiYatra, IRCTC, UPI, PM Kisan', others: 'Generic or Western examples' },
  { feature: 'School AI Report', baio: 'Included — class-by-class diagnostics', others: 'Not offered' },
  { feature: 'HOTS / Ethics Section', baio: 'Every single grade paper', others: 'Limited or absent' },
  { feature: 'Teacher Prep Required', baio: 'Zero teacher burden', others: 'Highly recommended' },
  { feature: 'School Recognition', baio: 'AI Ready School Badge, founding status, leaderboard', others: 'Participation listing only' },
];

export default function AboutPage() {
  return (
    <div className="bg-brand-cream min-h-screen selection:bg-brand-orange selection:text-white pb-1">

      {/* ─── HERO SECTION ─────────────────────────────────────────── */}
      <section className="relative pt-16 pb-24 px-6 text-center">
        
        {/* Floating Background Shapes */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/4 left-10 w-8 h-8 rounded-full bg-brand-orange/10 floating-slow-y" />
          <div className="absolute top-1/3 right-12 w-12 h-12 rounded-full bg-brand-green/10 floating-slow-x" />
          <div className="absolute top-10 right-1/4 text-brand-orange/20 floating-rotate">
            <Sparkles className="w-10 h-10" />
          </div>
        </div>

        <div className="max-w-4xl mx-auto space-y-6 relative z-10">
          <span className="brand-badge brand-badge-orange">
            Our Origin Story
          </span>
          <h1 className="text-5xl md:text-6xl font-extrabold text-brand-navy tracking-tight leading-[1.1]">
            We built the olympiad India's <br />
            <span className="text-brand-orange">students deserved.</span>
          </h1>
          <p className="text-slate-600 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
            India produces the highest number of STEM graduates in the world. Yet for decades, children in India's classrooms had no structured way to evaluate, develop, or celebrate their artificial intelligence literacy. We are changing that narrative.
          </p>
        </div>
      </section>

      {/* ─── MISSION & VISION BENTO GRID ──────────────────────────── */}
      <section className="pb-24 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Mission Card (Bento Left) */}
          <div className="bg-white rounded-3xl p-8 border-4 border-brand-navy edu-shadow lg:col-span-7 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-brand-orange/10 flex items-center justify-center text-brand-orange">
                <Target className="w-6 h-6" />
              </div>
              <h2 className="text-3xl font-extrabold text-brand-navy">
                To make AI literacy a source of national pride for every student.
              </h2>
              <p className="text-slate-600 text-sm md:text-base leading-relaxed">
                We believe AI literacy is not a luxury for the top 1% of students. It is a fundamental literacy required by every Indian child. A student in Ghaziabad should understand how facial recognition at Delhi airport works, why a UPI transaction gets flagged, and how rural AI programs operate.
              </p>
              <p className="text-slate-600 text-sm md:text-base leading-relaxed">
                Our mission is not to find India's best computer science students. Our mission is to create a generation of AI-aware citizens who interact with technology critically and ethically.
              </p>
            </div>
            <div className="pt-2">
              <span className="brand-badge brand-badge-orange">AI Awareness for All</span>
            </div>
          </div>

          {/* Vision Timeline Card (Bento Right) */}
          <div className="bg-brand-navy text-white rounded-3xl p-8 border-4 border-brand-navy edu-shadow lg:col-span-5 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-brand-orange">
                <Calendar className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-extrabold">Our Roadmap to 2030</h2>
              
              <div className="space-y-4 pt-2">
                {[
                  { year: '2026', desc: 'Launch in Delhi NCR with 100 founding partner schools.' },
                  { year: '2027', desc: 'Expand to Mumbai, Bengaluru, Hyderabad, Pune, Chennai.' },
                  { year: '2028', desc: 'Reach Tier 2 and Tier 3 cities across all states.' },
                  { year: '2030', desc: 'Every CBSE student in India has opportunity to sit BAIO.' },
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-3 items-start">
                    <span className="shrink-0 font-extrabold text-xs text-brand-orange bg-white/10 px-2 py-0.5 rounded border border-white/10">
                      {item.year}
                    </span>
                    <p className="text-xs text-slate-300 leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
            <p className="text-xs font-bold text-slate-400">That is not an ambition. That is a plan.</p>
          </div>

        </div>
      </section>

      {/* ─── THREE PILLARS SECTION ────────────────────────────────── */}
      <section className="py-24 px-6 bg-white border-y-2 border-slate-100">
        <div className="max-w-6xl mx-auto space-y-12">
          
          <div className="text-center space-y-4">
            <span className="brand-badge brand-badge-navy">
              Three Pillars
            </span>
            <h2 className="text-4xl font-extrabold text-brand-navy">
              BAIO is built on core educational foundations.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pillars.map((p, idx) => (
              <div key={idx} className={`bg-brand-cream rounded-3xl p-8 border-4 ${p.borderClass} ${p.shadowClass} flex flex-col justify-between space-y-6`}>
                <div className="space-y-4">
                  <span className={`font-extrabold text-3xl ${p.textColor}`}>{p.num}</span>
                  <h3 className="text-xl font-extrabold text-brand-navy">{p.title}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">{p.body}</p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ─── NEP ALIGNMENT SECTION ────────────────────────────────── */}
      <section className="py-24 px-6 bg-brand-cream">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-7 space-y-6">
            <span className="brand-badge brand-badge-green">
              NEP 2020 & CBSE
            </span>
            <h2 className="text-4xl font-extrabold text-brand-navy">
              NEP 2020 called for it. BAIO operationalizes it.
            </h2>
            <div className="space-y-4 text-slate-600 leading-relaxed text-sm md:text-base">
              <p>
                The National Education Policy 2020 explicitly demands the integration of coding, computational thinking, and digital literacy across all school grades. The CBSE Computational Thinking & AI (CTAI) 2026-27 framework is the structural result of this mandate.
              </p>
              <p>
                BAIO serves as the national assessment layer on top of this framework. If NEP is the vision and CTAI is the curriculum, BAIO is the benchmark that proves what students have actually mastered.
              </p>
              <p className="font-bold text-brand-navy">
                We go beyond the baseline by integrating Generative AI concepts, responsible innovation models, India's DPDP Act 2023, and the national IndiaAI Mission.
              </p>
            </div>
          </div>

          <div className="lg:col-span-5 flex items-center justify-center">
            <div className="relative">
              <div className="w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden border-4 border-brand-navy bg-white flex flex-col items-center justify-center text-brand-navy shadow-lg">
                <Building2 className="w-16 h-16 text-brand-orange" />
                <span className="text-[10px] font-black tracking-widest uppercase mt-3 text-slate-500">School Leaders</span>
              </div>
              <div className="absolute -top-3 -right-3 w-16 h-16 rounded-full bg-brand-orange text-white flex items-center justify-center text-center font-extrabold text-xs shadow border-2 border-brand-navy">
                NEP 2020
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ─── DIFFERENTIATORS TABLE SECTION ────────────────────────── */}
      <section className="py-24 px-6 bg-white border-t border-slate-100">
        <div className="max-w-6xl mx-auto space-y-12">
          
          <div className="text-center space-y-4">
            <span className="brand-badge brand-badge-orange">
              Comparison
            </span>
            <h2 className="text-4xl font-extrabold text-brand-navy">
              How BAIO compares to traditional options.
            </h2>
          </div>

          <div className="bg-brand-cream border-4 border-brand-navy rounded-3xl overflow-hidden edu-shadow">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b-4 border-brand-navy bg-brand-navy text-white text-left">
                    <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider">Evaluation Feature</th>
                    <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider text-brand-orange">Bharat AI Olympiad (BAIO)</th>
                    <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider text-slate-300">Other Olympiads</th>
                  </tr>
                </thead>
                <tbody className="divide-y-2 divide-slate-100 bg-white">
                  {differentiators.map((row, idx) => (
                    <tr key={idx} className="hover:bg-brand-cream/30 transition-colors">
                      <td className="px-6 py-4 font-bold text-brand-navy">{row.feature}</td>
                      <td className="px-6 py-4 font-medium text-slate-800 flex items-center gap-2">
                        <CheckCircle2 className="w-4.5 h-4.5 text-brand-green shrink-0" />
                        <span>{row.baio}</span>
                      </td>
                      <td className="px-6 py-4 text-slate-500">{row.others}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </section>

      {/* ─── CTA SECTION ──────────────────────────────────────────── */}
      <section className="py-24 px-6 bg-brand-navy text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-brand-orange opacity-10 blur-3xl rounded-full" />
        </div>
        <div className="max-w-2xl mx-auto space-y-6 relative z-10">
          <h2 className="text-4xl font-extrabold leading-tight">
            Ready to bring India's AI Olympiad to your school?
          </h2>
          <p className="text-slate-300 max-w-md mx-auto text-sm leading-relaxed">
            Spot reservation is simple. Receive study guides, sample papers, and coordinators immediately.
          </p>
          <div className="pt-4">
            <Link to="/register" className="btn-primary px-8 py-4 text-base shadow-lg hover:scale-105 transition-transform duration-200">
              Register Your School <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
