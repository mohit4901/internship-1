import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, FileText, CheckCircle2, ChevronDown, ChevronUp, BookOpen, AlertCircle, HelpCircle, Award } from 'lucide-react';

const preparatoryData = {
  title: 'Preparatory Stage Curriculum',
  subtitle: 'Classes 3, 4 & 5 (Age 8–11)',
  pdfLink: '/preparatory-curriculum.pdf',
  pdfName: 'preparatory-curriculum.pdf',
  overview: 'Foundational logical thinking, algorithmic sequencing, basic spatial reasoning, and introduction to how machine learning agents recognize patterns in the real world.',
  pattern: {
    duration: '60 Minutes',
    totalQs: '35 Questions',
    totalMarks: '40 Marks',
    sections: [
      { code: 'A', name: 'CT & Logical Reasoning', qCount: '10 Questions', weight: '10 Marks (1 mark each)' },
      { code: 'B', name: 'AI & Technology Concepts', qCount: '10 Questions', weight: '10 Marks (1 mark each)' },
      { code: 'C', name: 'Everyday AI Around Us', qCount: '10 Questions', weight: '10 Marks (1 mark each)' },
      { code: 'D', name: 'Innovation Arena (HOTS)', qCount: '5 Questions', weight: '10 Marks (2 marks each)' },
    ],
  },
  marking: [
    { rule: 'Correct Answer (Section A, B, C)', desc: '+1 mark' },
    { rule: 'Correct Answer (Section D - Innovation Arena)', desc: '+2 marks' },
    { rule: 'Incorrect Answer / Unattempted', desc: '0 marks (No negative marking)' }
  ],
  grades: [
    {
      grade: 'Grade 3',
      tagline: 'Discovering that computers can learn.',
      ct: 'Algorithmic sequencing, pattern recognition, decomposition of 2-3 step problems, basic 3D spatial reasoning (cube viewpoints, mirror images), block-based coding concepts.',
      ai: 'Introduction to AI — voice assistants, face recognition, YouTube recommendations, autocomplete. How AI learns from examples vs how regular programs work.',
      hots: 'A computer is given the rule: IF number is even, PRINT EVEN. IF number is odd, PRINT ODD. For the number 7, what does the computer print, and why?'
    },
    {
      grade: 'Grade 4',
      tagline: 'Flowcharts, decision-making, and machine data.',
      ct: 'Flowcharts with YES/NO decision diamonds, input-output function rules, multi-step decomposition, mirror images and symmetry, grid movements, loop patterns.',
      ai: 'Training data and supervised learning. Why spam filters work. How IRCTC AI detects fraud bots. Differences between AI and automation.',
      hots: 'An AI recommends "Study more" IF exam is tomorrow AND score < 70. Rohan\'s exam is tomorrow and his score is 65. What does the AI recommend?'
    },
    {
      grade: 'Grade 5',
      tagline: 'Complex patterns, learning types, and ethics.',
      ct: 'Decision trees with 2ⁿ path counting, multi-rule patterns, pictorial decomposition, water images vs mirror images, combined transformations, Caesar cipher basics.',
      ai: 'All three AI learning types — supervised, unsupervised, reinforcement. Deep learning basics. AI4Bharat and IndicTrans2. AI bias — why training data matters.',
      hots: 'A table shows rainfall and crop yield over 4 years. More rain = more yield. What AI technique models this relationship? Predict yield for 300mm rain.'
    }
  ],
  outcomes: [
    'Decompose everyday tasks into step-by-step logical instructions (algorithms).',
    'Differentiate between simple programmatic automation and adaptive machine learning models.',
    'Identify AI elements in everyday tech (voice assistants, visual tagging, custom recommendations).',
    'Demonstrate initial awareness of machine learning bias and training data representation.'
  ]
};

const middleData = {
  title: 'Middle Stage Curriculum',
  subtitle: 'Classes 6, 7 & 8 (Age 11–14)',
  pdfLink: '/middle-stage-curriculum.pdf',
  pdfName: 'middle-stage-curriculum.pdf',
  overview: 'Algorithmic efficiency, recursive problem-solving, structured data analytics, data security and citizenship, and introduction to the professional AI Lifecycle.',
  pattern: {
    duration: '60 Minutes',
    totalQs: '45 Questions',
    totalMarks: '50 Marks',
    sections: [
      { code: 'A', name: 'CT & Logical Reasoning', qCount: '15 Questions', weight: '15 Marks (1 mark each)' },
      { code: 'B', name: 'AI & Technology Concepts', qCount: '15 Questions', weight: '15 Marks (1 mark each)' },
      { code: 'C', name: 'Everyday AI Around Us', qCount: '10 Questions', weight: '10 Marks (1 mark each)' },
      { code: 'D', name: 'Innovation Arena (HOTS)', qCount: '5 Questions', weight: '10 Marks (2 marks each)' },
    ],
  },
  marking: [
    { rule: 'Correct Answer (Section A, B, C)', desc: '+1 mark' },
    { rule: 'Correct Answer (Section D - Innovation Arena)', desc: '+2 marks' },
    { rule: 'Incorrect Answer / Unattempted', desc: '0 marks (No negative marking)' }
  ],
  grades: [
    {
      grade: 'Grade 6',
      tagline: 'CTAI AI syllabus — learning, data, safety.',
      ct: 'Greedy algorithms, bubble sort full trace, binary search efficiency, Euler\'s formula, cyclic patterns, De Morgan\'s laws, algorithm efficiency O-notation introduction.',
      ai: 'Human vs machine intelligence, learning types in depth, four data types, digital footprints, secure passwords, phishing recognition, privacy measures.',
      hots: 'A town\'s AI traffic system reduces total waiting time by 25% but increases waiting time at one low-income crossing by 40%. Is this fair? What design principle should be added?'
    },
    {
      grade: 'Grade 7',
      tagline: 'Regression, clustering, and data analysis.',
      ct: 'Recursion (base case, recursive case), divide-and-conquer (merge sort), stacks (LIFO), queues (FIFO), BFS vs DFS, XOR and De Morgan\'s Laws, complexity comparison.',
      ai: 'Regression, classification, clustering, computer vision (CNNs), NLP limitations, data science (collecting, cleaning, visualising), digital citizenship.',
      hots: 'An AI loan system trained on 2010-2020 data denies women at twice the rate of equally qualified men. Give two causes of this bias and how to fix it.'
    },
    {
      grade: 'Grade 8',
      tagline: 'Lifecycle, no-code, and responsible innovation.',
      ct: 'Dijkstra\'s shortest path algorithm, dynamic programming, hash tables, binary-to-decimal (1011=11), hexadecimal (#FF0000=red), adjacency matrices.',
      ai: 'CTAI AI lifecycle (Define, Collect, Test, Reflect), Teachable Machine, ML for Kids, data fairness, explainable AI, DPDP Act 2023, IndiaAI Mission.',
      hots: 'Design an AI project using Teachable Machine to help visually impaired students navigate school — applying all four stages of the CTAI project lifecycle.'
    }
  ],
  outcomes: [
    'Analyze basic logic gate expressions and evaluate algorithmic sorting/searching steps.',
    'Understand common AI models (linear regression, K-means clustering, convolutional networks).',
    'Demonstrate secure digital behaviors (phishing detection, data minimization, strong passwords).',
    'Apply the 4-stage CTAI AI project lifecycle to structure and evaluate tech-driven solutions.'
  ]
};

function AccordionSection({ title, icon: Icon, isOpen, onToggle, children }) {
  return (
    <div className="border border-slate-200/80 rounded-2xl overflow-hidden bg-white shadow-xs transition-all duration-200">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4.5 text-left font-extrabold text-brand-navy hover:bg-slate-50 transition-colors cursor-pointer"
      >
        <div className="flex items-center gap-3">
          {Icon && <Icon className="w-5 h-5 text-brand-orange" />}
          <span className="text-sm tracking-tight">{title}</span>
        </div>
        {isOpen ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
      </button>
      
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
          >
            <div className="p-5 border-t border-slate-100 bg-[#FAF9F6] text-xs leading-relaxed text-slate-700">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function CurriculumModal({ stage, isOpen, onClose }) {
  const [openSection, setOpenSection] = useState('pdf'); // default open 'pdf'
  const data = stage === 'preparatory' ? preparatoryData : middleData;

  const handleToggle = (secName) => {
    setOpenSection(openSection === secName ? null : secName);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
        />

        {/* Modal content panel */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ type: 'spring', duration: 0.45 }}
          className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto bg-white border-4 border-brand-navy rounded-3xl shadow-2xl z-10 flex flex-col"
        >
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-slate-100 px-6 py-5 flex items-center justify-between z-20">
            <div>
              <span className={`inline-block px-2.5 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-wider ${stage === 'preparatory' ? 'bg-emerald-50 text-brand-green border border-emerald-200' : 'bg-indigo-50 text-brand-navy border border-indigo-200'}`}>
                {stage === 'preparatory' ? 'Grades 3–5' : 'Grades 6–8'}
              </span>
              <h2 className="text-xl font-heading font-black text-brand-navy mt-1">
                {data.title}
              </h2>
              <p className="text-slate-500 text-xs font-bold mt-0.5">
                {data.subtitle}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-slate-100 transition-colors text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 space-y-6 overflow-y-auto flex-1 text-left">
            {/* Overview Box */}
            <div className="bg-orange-50 border-2 border-brand-orange/15 rounded-2xl p-4 flex gap-3">
              <BookOpen className="w-5 h-5 text-brand-orange shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-slate-800">Track Overview</p>
                <p className="text-xs text-slate-600 mt-1 leading-normal font-medium">{data.overview}</p>
              </div>
            </div>

            {/* Expandable Sections */}
            <div className="space-y-3.5">
              {/* 1. Curriculum PDF */}
              <AccordionSection
                title="Curriculum PDF Document"
                icon={FileText}
                isOpen={openSection === 'pdf'}
                onToggle={() => handleToggle('pdf')}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <p className="font-bold text-slate-800 text-xs">Official Syllabus Blueprint PDF</p>
                    <p className="text-slate-500 text-[11px] leading-relaxed">
                      Download the complete competency-wise curriculum mapping aligned directly with CBSE CTAI 2026-27 guidelines. Contains logic diagrams, section breakups, and grade checklists.
                    </p>
                  </div>
                  <a
                    href={data.pdfLink}
                    download={data.pdfName}
                    className="shrink-0 flex items-center justify-center gap-1.5 bg-[#0B7F3B] hover:bg-[#096a31] text-white text-xs font-extrabold px-4.5 py-2.5 rounded-xl transition-all shadow-sm shadow-emerald-500/20 active:translate-y-[1px]"
                  >
                    <Download className="w-4 h-4" /> Download PDF
                  </a>
                </div>
              </AccordionSection>

              {/* 2. Exam Pattern */}
              <AccordionSection
                title="Exam Pattern & Details"
                icon={HelpCircle}
                isOpen={openSection === 'pattern'}
                onToggle={() => handleToggle('pattern')}
              >
                <div className="space-y-4 font-semibold text-slate-700">
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div className="bg-white border border-slate-200 p-2.5 rounded-xl shadow-inner">
                      <span className="text-[9px] text-slate-400 uppercase tracking-wider block leading-none">DURATION</span>
                      <span className="text-sm font-extrabold text-brand-navy mt-1.5 block">{data.pattern.duration}</span>
                    </div>
                    <div className="bg-white border border-slate-200 p-2.5 rounded-xl shadow-inner">
                      <span className="text-[9px] text-slate-400 uppercase tracking-wider block leading-none">QUESTIONS</span>
                      <span className="text-sm font-extrabold text-brand-navy mt-1.5 block">{data.pattern.totalQs}</span>
                    </div>
                    <div className="bg-white border border-slate-200 p-2.5 rounded-xl shadow-inner">
                      <span className="text-[9px] text-slate-400 uppercase tracking-wider block leading-none">TOTAL MARKS</span>
                      <span className="text-sm font-extrabold text-brand-navy mt-1.5 block">{data.pattern.totalMarks}</span>
                    </div>
                  </div>

                  <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-100/80 border-b border-slate-250">
                          <th className="px-4 py-2.5 text-[9px] font-black uppercase tracking-wider text-slate-500 w-16">Section</th>
                          <th className="px-4 py-2.5 text-[9px] font-black uppercase tracking-wider text-slate-500">Focus Outcomes</th>
                          <th className="px-4 py-2.5 text-[9px] font-black uppercase tracking-wider text-slate-500 w-24">Structure</th>
                          <th className="px-4 py-2.5 text-[9px] font-black uppercase tracking-wider text-slate-500 text-right w-24">Weights</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-150">
                        {data.pattern.sections.map((sec) => (
                          <tr key={sec.code}>
                            <td className="px-4 py-2.5 font-black text-brand-orange text-center">{sec.code}</td>
                            <td className="px-4 py-2.5 font-bold text-brand-navy">{sec.name}</td>
                            <td className="px-4 py-2.5 text-slate-500 text-[11px]">{sec.qCount}</td>
                            <td className="px-4 py-2.5 text-right font-extrabold text-slate-600 text-[11px]">{sec.weight}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </AccordionSection>

              {/* 3. Marking Scheme */}
              <AccordionSection
                title="Marking Scheme"
                icon={Award}
                isOpen={openSection === 'marking'}
                onToggle={() => handleToggle('marking')}
              >
                <div className="space-y-3 font-semibold">
                  <p className="text-slate-500 text-[11px] leading-relaxed mb-3">
                    Evaluation points are computed deterministically. All answers are scanned via OMR.
                  </p>
                  <div className="divide-y divide-slate-150 bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
                    {data.marking.map((m, idx) => (
                      <div key={idx} className="flex justify-between items-center px-4 py-2.5 text-slate-800">
                        <span className="text-slate-500 font-bold">{m.rule}</span>
                        <span className={`font-extrabold ${m.desc.includes('No') ? 'text-slate-400' : m.desc.includes('+2') ? 'text-brand-orange' : 'text-brand-navy'}`}>{m.desc}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </AccordionSection>

              {/* 4. Sample Questions */}
              <AccordionSection
                title="Grade-Wise Modules & Sample Questions"
                icon={HelpCircle}
                isOpen={openSection === 'samples'}
                onToggle={() => handleToggle('samples')}
              >
                <div className="space-y-5">
                  {data.grades.map((g, idx) => (
                    <div key={idx} className="bg-white border border-slate-200/80 rounded-2xl p-4.5 space-y-3.5 shadow-xs">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                        <div>
                          <span className="font-extrabold text-sm text-brand-navy block">{g.grade}</span>
                          <span className="text-[10px] text-slate-450 italic font-medium">"{g.tagline}"</span>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[11px] leading-relaxed">
                        <div className="space-y-1">
                          <span className="text-[9px] font-black uppercase tracking-wider text-slate-450 block">Logical Units</span>
                          <p className="text-slate-600 font-medium">{g.ct}</p>
                        </div>
                        <div className="space-y-1">
                          <span className="text-[9px] font-black uppercase tracking-wider text-slate-450 block">AI Units</span>
                          <p className="text-slate-600 font-medium">{g.ai}</p>
                        </div>
                      </div>

                      <div className="bg-[#FAF9F6] border border-slate-200/60 rounded-xl p-3.5">
                        <span className="text-[9px] font-black uppercase tracking-wider text-brand-orange block mb-1">Innovation Arena (HOTS) Sample Question</span>
                        <p className="text-[11px] text-slate-700 leading-relaxed italic">"{g.hots}"</p>
                      </div>
                    </div>
                  ))}
                </div>
              </AccordionSection>

              {/* 5. Learning Outcomes */}
              <AccordionSection
                title="Syllabus Learning Outcomes"
                icon={CheckCircle2}
                isOpen={openSection === 'outcomes'}
                onToggle={() => handleToggle('outcomes')}
              >
                <div className="space-y-3 font-semibold text-slate-700">
                  <p className="text-slate-500 text-[11px] leading-relaxed mb-3">
                    Students participating in this BAIO track will develop the core cognitive benchmarks defined by CBSE:
                  </p>
                  <div className="space-y-2.5">
                    {data.outcomes.map((o, idx) => (
                      <div key={idx} className="flex items-start gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-brand-green shrink-0 mt-0.5" />
                        <span className="text-slate-700 text-xs font-semibold leading-relaxed">{o}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </AccordionSection>
            </div>
          </div>

          {/* Footer actions */}
          <div className="sticky bottom-0 bg-slate-50 border-t border-slate-150 px-6 py-4 flex items-center justify-end gap-3 z-20">
            <button
              onClick={onClose}
              className="px-5 py-2.5 border-2 border-slate-250 hover:bg-slate-100 text-slate-600 hover:text-slate-800 text-xs font-extrabold rounded-xl transition-all cursor-pointer bg-white"
            >
              Close
            </button>
            <a
              href={data.pdfLink}
              download={data.pdfName}
              className="inline-flex items-center gap-1.5 bg-brand-navy hover:bg-[#002880] text-white text-xs font-extrabold px-5 py-2.5 rounded-xl transition-all shadow-md cursor-pointer active:translate-y-[1px]"
            >
              <Download className="w-3.5 h-3.5" /> Download Full Syllabus PDF
            </a>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
