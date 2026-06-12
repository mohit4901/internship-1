import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2, Sparkles, BookOpen, Trophy, Target, Cpu, FileText } from 'lucide-react';

const prepStage = [
  { sec: 'A', title: 'CT & Logical Reasoning', struct: '10 × 1 mark', marks: '10' },
  { sec: 'B', title: 'AI & Technology Concepts', struct: '10 × 1 mark', marks: '10' },
  { sec: 'C', title: 'Everyday AI Around Us', struct: '10 × 1 mark', marks: '10' },
  { sec: 'D', title: 'Innovation Arena', struct: '5 × 2 marks', marks: '10' },
];

const midStage = [
  { sec: 'A', title: 'CT & Logical Reasoning', struct: '15 × 1 mark', marks: '15' },
  { sec: 'B', title: 'AI & Technology Concepts', struct: '15 × 1 mark', marks: '15' },
  { sec: 'C', title: 'Everyday AI Around Us', struct: '10 × 1 mark', marks: '10' },
  { sec: 'D', title: 'Innovation Arena', struct: '5 × 2 marks', marks: '10' },
];

const gradeCards = [
  {
    grade: 'Grade 3',
    stage: 'Preparatory Stage',
    tagline: 'Discovering that computers can learn.',
    borderClass: 'edu-border-green',
    shadowClass: 'edu-shadow-green',
    textColor: 'text-brand-green',
    ct: 'Algorithmic sequencing, pattern recognition, decomposition of 2-3 step problems, basic 3D spatial reasoning (cube viewpoints, mirror images), block-based coding concepts.',
    ai: 'Introduction to AI — voice assistants, face recognition, YouTube recommendations, autocomplete. How AI learns from examples vs how regular programs work.',
    hots: 'A computer is given the rule: IF number is even, PRINT EVEN. IF number is odd, PRINT ODD. For the number 7, what does the computer print, and why?',
  },
  {
    grade: 'Grade 4',
    stage: 'Preparatory Stage',
    tagline: 'Flowcharts, decision-making, and machine data.',
    borderClass: 'edu-border-orange',
    shadowClass: 'edu-shadow-orange',
    textColor: 'text-brand-orange',
    ct: 'Flowcharts with YES/NO decision diamonds, input-output function rules, multi-step decomposition, mirror images and symmetry, grid movements, loop patterns.',
    ai: 'Training data and supervised learning. Why spam filters work. How IRCTC AI detects fraud bots. Differences between AI and automation.',
    hots: 'An AI recommends "Study more" IF exam is tomorrow AND score < 70. Rohan\'s exam is tomorrow and his score is 65. What does the AI recommend?',
  },
  {
    grade: 'Grade 5',
    stage: 'Preparatory Stage',
    tagline: 'Complex patterns, learning types, and ethics.',
    borderClass: 'edu-border-navy',
    shadowClass: 'edu-shadow',
    textColor: 'text-brand-navy',
    ct: 'Decision trees with 2ⁿ path counting, multi-rule patterns, pictorial decomposition, water images vs mirror images, combined transformations, Caesar cipher basics.',
    ai: 'All three AI learning types — supervised, unsupervised, reinforcement. Deep learning basics. AI4Bharat and IndicTrans2. AI bias — why training data matters.',
    hots: 'A table shows rainfall and crop yield over 4 years. More rain = more yield. What AI technique models this relationship? Predict yield for 300mm rain.',
  },
  {
    grade: 'Grade 6',
    stage: 'Middle Stage',
    tagline: 'CTAI AI syllabus — learning, data, safety.',
    borderClass: 'edu-border-navy',
    shadowClass: 'edu-shadow',
    textColor: 'text-brand-navy',
    ct: 'Greedy algorithms, bubble sort full trace, binary search efficiency, Euler\'s formula, cyclic patterns, De Morgan\'s laws, algorithm efficiency O-notation introduction.',
    ai: 'Human vs machine intelligence, learning types in depth, four data types, digital footprints, secure passwords, phishing recognition, privacy measures.',
    hots: 'A town\'s AI traffic system reduces total waiting time by 25% but increases waiting time at one low-income crossing by 40%. Is this fair? What design principle should be added?',
  },
  {
    grade: 'Grade 7',
    stage: 'Middle Stage',
    tagline: 'Regression, clustering, and data analysis.',
    borderClass: 'edu-border-green',
    shadowClass: 'edu-shadow-green',
    textColor: 'text-brand-green',
    ct: 'Recursion (base case, recursive case), divide-and-conquer (merge sort), stacks (LIFO), queues (FIFO), BFS vs DFS, XOR and De Morgan\'s Laws, complexity comparison.',
    ai: 'Regression, classification, clustering, computer vision (CNNs), NLP limitations, data science (collecting, cleaning, visualising), digital citizenship.',
    hots: 'An AI loan system trained on 2010-2020 data denies women at twice the rate of equally qualified men. Give two causes of this bias and how to fix it.',
  },
  {
    grade: 'Grade 8',
    stage: 'Middle Stage',
    tagline: 'Lifecycle, no-code, and responsible innovation.',
    borderClass: 'edu-border-orange',
    shadowClass: 'edu-shadow-orange',
    textColor: 'text-brand-orange',
    ct: "Dijkstra's shortest path algorithm, dynamic programming, hash tables, binary-to-decimal (1011=11), hexadecimal (#FF0000=red), adjacency matrices.",
    ai: 'CTAI AI lifecycle (Define, Collect, Test, Reflect), Teachable Machine, ML for Kids, data fairness, explainable AI, DPDP Act 2023, IndiaAI Mission.',
    hots: 'Design an AI project using Teachable Machine to help visually impaired students navigate school — applying all four stages of the CTAI project lifecycle.',
  },
];

const ctaiAlignment = [
  { grade: 'Grade 3', pct: 97, details: 'Spatial reasoning & mirror patterns integrated' },
  { grade: 'Grade 4', pct: 96, details: 'Decision flowcharts & data training added' },
  { grade: 'Grade 5', pct: 93, details: 'Decomposition matrices & ethical bias models' },
  { grade: 'Grade 6', pct: 94, details: 'Digital safety, passwords, phishing safety' },
  { grade: 'Grade 7', pct: 92, details: 'Data regressions & visualization charts' },
  { grade: 'Grade 8', pct: 95, details: 'AI Lifecycle, DPDP Act 2023 frameworks' },
];

const awards = [
  {
    icon: '🥇',
    title: 'AI Champion Award',
    who: 'Gold Medal — National Rank 1-3',
    what: 'Gold medal, Champion trophy, merit scholarship, feature in National Talent Report, leaderboard listing.',
    borderClass: 'edu-border-orange',
    shadowClass: 'edu-shadow-orange'
  },
  {
    icon: '🥈',
    title: 'AI Excellence Award',
    who: 'Silver Medal — National Rank 4-10',
    what: 'Silver medal, Excellence certificate, BAIO Achievement Kit, school plaque, leaderboard listing.',
    borderClass: 'edu-border-navy',
    shadowClass: 'edu-shadow'
  },
  {
    icon: '🥉',
    title: 'AI Merit Award',
    who: 'Bronze — Top 10% per School',
    what: 'Bronze certificate, digital achievement badge, school leaderboard recognition, portfolio merit letter.',
    borderClass: 'edu-border-green',
    shadowClass: 'edu-shadow-green'
  },
];

export default function OlympiadPage() {
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
          <span className="brand-badge brand-badge-navy">
            The Exam Spec
          </span>
          <h1 className="text-5xl md:text-6xl font-extrabold text-brand-navy tracking-tight leading-[1.1]">
            Genuine AI literacy, <br />
            <span className="text-brand-orange">evaluated on paper.</span>
          </h1>
          <p className="text-slate-600 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
            The BAIO exam is not a general technology quiz. It is a curriculum-aligned evaluation designed to test the exact logical, reasoning, and conceptual capabilities outlined in CBSE's CTAI 2026-27 framework.
          </p>
        </div>
      </section>

      {/* ─── EXAM STAGES BENTO GRID ───────────────────────────────── */}
      <section className="pb-24 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Prep Stage Card */}
          <div className="bg-white rounded-3xl overflow-hidden border border-slate-200 edu-shadow flex flex-col justify-between">
            <div className="bg-brand-green text-white p-6 border-b border-brand-navy/10">
              <span className="text-[10px] font-black uppercase tracking-widest bg-white/20 px-2 py-0.5 rounded">Grades 3–5</span>
              <h2 className="text-2xl font-extrabold mt-2">Preparatory Stage</h2>
              <p className="text-xs text-slate-100 mt-1">35 Questions · 40 Marks · 60 Minutes</p>
            </div>
            
            <div className="p-6 flex-1">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b-2 border-slate-100 text-left text-xs font-bold text-slate-400">
                    <th className="pb-2">Section</th>
                    <th className="pb-2">Details</th>
                    <th className="pb-2 text-right">Marks</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {prepStage.map((row, idx) => (
                    <tr key={idx}>
                      <td className="py-3 font-bold text-brand-green">{row.sec}</td>
                      <td className="py-3">
                        <span className="font-bold text-brand-navy block">{row.title}</span>
                        <span className="text-xs text-slate-500">{row.struct}</span>
                      </td>
                      <td className="py-3 text-right font-extrabold text-brand-navy">{row.marks}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-6 bg-slate-50 border-t-2 border-slate-100 text-center font-extrabold text-brand-navy">
              Total Score: 40 Marks
            </div>
          </div>

          {/* Middle Stage Card */}
          <div className="bg-white rounded-3xl overflow-hidden border border-slate-200 edu-shadow flex flex-col justify-between">
            <div className="bg-brand-navy text-white p-6 border-b border-brand-navy/10">
              <span className="text-[10px] font-black uppercase tracking-widest bg-white/20 px-2 py-0.5 rounded">Grades 6–8</span>
              <h2 className="text-2xl font-extrabold mt-2">Middle Stage</h2>
              <p className="text-xs text-slate-100 mt-1">45 Questions · 50 Marks · 60 Minutes</p>
            </div>

            <div className="p-6 flex-1">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b-2 border-slate-100 text-left text-xs font-bold text-slate-400">
                    <th className="pb-2">Section</th>
                    <th className="pb-2">Details</th>
                    <th className="pb-2 text-right">Marks</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {midStage.map((row, idx) => (
                    <tr key={idx}>
                      <td className="py-3 font-bold text-brand-orange">{row.sec}</td>
                      <td className="py-3">
                        <span className="font-bold text-brand-navy block">{row.title}</span>
                        <span className="text-xs text-slate-500">{row.struct}</span>
                      </td>
                      <td className="py-3 text-right font-extrabold text-brand-navy">{row.marks}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-6 bg-slate-50 border-t-2 border-slate-100 text-center font-extrabold text-brand-navy">
              Total Score: 50 Marks
            </div>
          </div>

        </div>
      </section>

      {/* ─── GRADE BY GRADE BENTO GRID ────────────────────────────── */}
      <section className="py-24 px-6 bg-white border-y-2 border-slate-100">
        <div className="max-w-6xl mx-auto space-y-12">
          
          <div className="text-center space-y-4">
            <span className="brand-badge brand-badge-orange">
              Grade Modules
            </span>
            <h2 className="text-4xl font-extrabold text-brand-navy">
              Age-appropriate diagnostic papers.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {gradeCards.map((g, idx) => (
              <div key={idx} className={`bg-brand-cream rounded-3xl p-8 border ${g.borderClass} ${g.shadowClass} flex flex-col justify-between space-y-6`}>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className={`font-extrabold text-2xl ${g.textColor}`}>{g.grade}</span>
                    <span className="text-[9px] font-black uppercase tracking-wider bg-white border border-slate-200 px-2 py-0.5 rounded shadow-sm text-slate-600">{g.stage}</span>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 italic">"{g.tagline}"</p>
                  </div>
                  
                  <div className="space-y-3 pt-2">
                    <div>
                      <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 block mb-0.5">Logical Units</span>
                      <p className="text-xs text-slate-600 leading-relaxed">{g.ct}</p>
                    </div>
                    <div>
                      <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 block mb-0.5">AI Units</span>
                      <p className="text-xs text-slate-600 leading-relaxed">{g.ai}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-4 border border-slate-150 shadow-inner">
                  <span className="text-[9px] font-black uppercase tracking-widest text-brand-orange block mb-1">Innovation Arena Sample Question</span>
                  <p className="text-[11px] text-slate-700 leading-relaxed italic">"{g.hots}"</p>
                </div>

              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ─── CBSE CTAI ALIGNMENT AUDIT SECTION ────────────────────── */}
      <section className="py-24 px-6 bg-brand-cream">
        <div className="max-w-4xl mx-auto space-y-12">
          
          <div className="text-center space-y-4">
            <span className="brand-badge brand-badge-green">
              Audit Data
            </span>
            <h2 className="text-4xl font-extrabold text-brand-navy">
              Verified syllabus alignment mapping.
            </h2>
            <p className="text-slate-600 max-w-lg mx-auto text-sm leading-relaxed">
              We completed a 47-outcome cross-referenced audit mapping all questions against CBSE CTAI 2026-27 framework learning points.
            </p>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 p-8 edu-shadow space-y-6">
            {ctaiAlignment.map((row, idx) => (
              <div key={idx} className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                <span className="w-20 font-bold text-brand-navy shrink-0">{row.grade}</span>
                <div className="flex-1 bg-slate-100 rounded-full h-3.5 overflow-hidden border border-slate-200">
                  <div className="bg-brand-green h-full rounded-full" style={{ width: `${row.pct}%` }} />
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="font-extrabold text-brand-green w-10 text-right">{row.pct}%</span>
                  <span className="text-xs text-slate-500">({row.details})</span>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ─── AWARDS & RECOGNITION SECTION ─────────────────────────── */}
      <section className="py-24 px-6 bg-white border-t border-slate-100">
        <div className="max-w-6xl mx-auto space-y-12">
          
          <div className="text-center space-y-4">
            <span className="brand-badge brand-badge-orange">
              Awards
            </span>
            <h2 className="text-4xl font-extrabold text-brand-navy">
              Win big. Celebrate excellence.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {awards.map((a, idx) => (
              <div key={idx} className={`bg-brand-cream rounded-3xl p-6 border ${a.borderClass} ${a.shadowClass} flex flex-col justify-between space-y-6`}>
                <div className="space-y-4">
                  <span className="text-4xl block">{a.icon}</span>
                  <div>
                    <h3 className="text-lg font-extrabold text-brand-navy">{a.title}</h3>
                    <span className="text-xs font-bold text-slate-500">{a.who}</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{a.what}</p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ─── CTA SECTION ──────────────────────────────────────────── */}
      <section className="py-24 px-6 bg-brand-navy text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-brand-orange opacity-10 blur-3xl rounded-full" />
        </div>
        <div className="max-w-2xl mx-auto space-y-6 relative z-10">
          <h2 className="text-4xl font-extrabold leading-tight">
            Ready to bring this program to your campus?
          </h2>
          <p className="text-slate-300 max-w-md mx-auto text-sm leading-relaxed">
            Spot reservation is open for CBSE partner schools. Get physical booklets, guides, and schedules today.
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
