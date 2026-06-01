import React, { useState, useRef } from 'react';
import { Hero } from '../components/ui/animated-hero';
import AnnouncementSection from '../components/AnnouncementSection';
import { TextColor } from '@/components/ui/text-color';
import { Trophy, Calendar, Sparkles, ChevronRight, HelpCircle, GraduationCap, Cpu, Layers } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { Testimonials3D } from '../components/ui/3d-testimonials';

/* ─── Animation helpers ─── */
const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.55, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] },
  }),
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
};

function AnimateIn({ children, className = '', custom = 0 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px 0px' });
  return (
    <motion.div ref={ref} variants={fadeUp} custom={custom}
      initial="hidden" animate={inView ? 'visible' : 'hidden'} className={className}>
      {children}
    </motion.div>
  );
}

function StaggerIn({ children, className = '' }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px 0px' });
  return (
    <motion.div ref={ref} variants={stagger}
      initial="hidden" animate={inView ? 'visible' : 'hidden'} className={className}>
      {children}
    </motion.div>
  );
}

export default function HomePage() {
  const [activeFaq, setActiveFaq] = useState(null);

  const divisions = [
    {
      id: 'junior',
      title: 'Junior Division',
      grade: 'Grades 6–8',
      fee: '₹299',
      date: 'July 15, 2026',
      icon: <GraduationCap className="w-5 h-5 text-emerald-600" />,
      accent: 'border-emerald-200 hover:border-emerald-400',
      iconBg: 'bg-emerald-50',
      feeColor: 'text-emerald-600',
      description: 'Foundations of Logical Reasoning, Algorithmic Thinking, and Introduction to AI Concepts.'
    },
    {
      id: 'senior',
      title: 'Senior Division',
      grade: 'Grades 9–12',
      fee: '₹399',
      date: 'July 18, 2026',
      icon: <Cpu className="w-5 h-5 text-brand-orange" />,
      accent: 'border-orange-200 hover:border-orange-400',
      iconBg: 'bg-orange-50',
      feeColor: 'text-brand-orange',
      description: 'Intermediate Logic, Machine Learning Essentials, and Python-based AI Core Concepts.'
    },
    {
      id: 'masters',
      title: 'Masters Division',
      grade: 'College & Undergrad',
      fee: '₹499',
      date: 'July 20, 2026',
      icon: <Layers className="w-5 h-5 text-indigo-500" />,
      accent: 'border-indigo-200 hover:border-indigo-400',
      iconBg: 'bg-indigo-50',
      feeColor: 'text-indigo-600',
      description: 'Advanced Deep Learning, Neural Networks, NLP models, and Ethical AI Systems.'
    }
  ];

  const benefits = [
    { title: 'National Level Benchmarking', description: 'See where you stand among top minds across all states with detailed percentile metrics.' },
    { title: 'Industry Aligned Syllabus', description: 'Curriculum curated by scholars and AI engineers — focused on real logic, not memorization.' },
    { title: '100% Proctored Integrity', description: 'Rigorous offline supervision at physical exam centers ensures high credibility.' },
    { title: 'Cash Rewards & Mentorship', description: 'Top rankers win cash scholarships, developer badges, and exclusive tech mentorship.' }
  ];

  const faqs = [
    { q: 'Who is eligible to participate in BAIO?', a: 'Students from standard 6th up to college undergrad can enroll across three tracks: Junior (Grades 6–8), Senior (Grades 9–12), and Masters (College/University).' },
    { q: 'Where will the exams be conducted?', a: 'All exams are held offline at designated external physical centers. Exact room allocations and center addresses will be stamped on your Admit Card.' },
    { q: 'How can I download the preparation syllabus?', a: 'Once registered, log in to your Student Dashboard to download a full mock test-prep kit, reference books, and division syllabus sheets.' },
    { q: 'Is there a registration refund policy?', a: 'Registration fees are non-refundable as centers allocate physical resources based on registration cards immediately after payment.' }
  ];

  const toggleFaq = (idx) => setActiveFaq(activeFaq === idx ? null : idx);

  return (
    <div className="bg-white">

      {/* ── 1. Animated Hero ── */}
      <Hero />



      {/* ── Divider ── */}
      <div className="border-t border-slate-100" />

      {/* ── 2. Announcements ── */}
      <AnimateIn>
        <AnnouncementSection />
      </AnimateIn>

      {/* ── Text Color Banner ── */}
      <TextColor />

      <div className="w-screen h-screen">
        <Testimonials3D />
      </div>



      {/* ── 3. Division Cards ── */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-6 space-y-12">

          <AnimateIn className="text-center space-y-3">
            <span className="inline-flex items-center gap-1.5 bg-slate-100 text-slate-600 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider">
              <Trophy className="w-3.5 h-3.5" /> Academic Categories
            </span>
            <h2 className="font-heading font-bold text-3xl md:text-4xl text-slate-900">
              Choose Your Division
            </h2>
            <p className="text-slate-500 text-sm max-w-md mx-auto">
              Select your academic track to lock your seat. Syllabus scales per division.
            </p>
          </AnimateIn>

          <StaggerIn className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {divisions.map((div, i) => (
              <motion.div
                key={div.id}
                variants={fadeUp}
                custom={i}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className={`bg-white border-2 ${div.accent} rounded-2xl p-6 flex flex-col gap-6 transition-colors duration-200`}
              >
                <div className="flex items-start justify-between">
                  <div className={`w-10 h-10 rounded-xl ${div.iconBg} flex items-center justify-center`}>
                    {div.icon}
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 border border-slate-200 rounded-md px-2 py-1">
                    {div.grade}
                  </span>
                </div>

                <div>
                  <h3 className="font-heading font-bold text-lg text-slate-900 mb-1">{div.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{div.description}</p>
                </div>

                <div className="pt-4 border-t border-slate-100 space-y-3">
                  <div className="flex justify-between items-center text-xs text-slate-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" /> {div.date}
                    </span>
                    <span className={`font-bold text-base ${div.feeColor}`}>{div.fee}</span>
                  </div>
                  <Link
                    to="/student/login"
                    className="w-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold py-2.5 rounded-xl transition-colors duration-200 flex items-center justify-center gap-1 group"
                  >
                    Register Track
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </StaggerIn>
        </div>
      </section>

      {/* ── Divider ── */}
      <div className="border-t border-slate-100" />

      {/* ── 4. Benefits ── */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-5xl mx-auto px-6 space-y-12">

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

            <AnimateIn className="space-y-5">
              <span className="inline-flex items-center gap-1.5 bg-orange-50 text-brand-orange rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" /> Why BAIO
              </span>
              <h2 className="font-heading font-bold text-3xl md:text-4xl text-slate-900 leading-tight">
                Empowering Minds in the AI Generation
              </h2>
              <p className="text-slate-500 text-sm leading-relaxed">
                BAIO bridges the gap between conventional computer classes and leading-edge cognitive intelligence. We test foundational algorithmic math, deep tech, and analytical thinking.
              </p>
              <Link
                to="/about"
                className="inline-flex items-center gap-1 text-sm font-semibold text-brand-orange hover:underline underline-offset-4"
              >
                Read about our mission <ChevronRight className="w-4 h-4" />
              </Link>
            </AnimateIn>

            <StaggerIn className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {benefits.map((item, idx) => (
                <motion.div
                  key={idx}
                  variants={fadeUp}
                  custom={idx}
                  className="bg-white border border-slate-200 rounded-2xl p-5 space-y-2"
                  whileHover={{ scale: 1.02, transition: { duration: 0.18 } }}
                >
                  <span className="text-xs font-bold text-slate-400">0{idx + 1}</span>
                  <h4 className="text-sm font-bold text-slate-900">{item.title}</h4>
                  <p className="text-slate-500 text-xs leading-relaxed">{item.description}</p>
                </motion.div>
              ))}
            </StaggerIn>

          </div>
        </div>
      </section>

      {/* ── Divider ── */}
      <div className="border-t border-slate-100" />

      {/* ── 5. FAQ ── */}
      <section className="py-20">
        <div className="max-w-2xl mx-auto px-6 space-y-10">

          <AnimateIn className="text-center space-y-3">
            <span className="inline-flex items-center gap-1.5 bg-slate-100 text-slate-600 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider">
              <HelpCircle className="w-3.5 h-3.5" /> Support
            </span>
            <h2 className="font-heading font-bold text-3xl text-slate-900">
              Frequently Asked Questions
            </h2>
            <p className="text-slate-500 text-sm">
              Quick resolutions on center routing, offline rules, and dashboard access.
            </p>
          </AnimateIn>

          <StaggerIn className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = activeFaq === idx;
              return (
                <motion.div
                  key={idx}
                  variants={fadeUp}
                  custom={idx}
                  className="border border-slate-200 rounded-2xl overflow-hidden"
                >
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="w-full px-6 py-4 flex items-center justify-between text-left text-slate-800 font-medium text-sm cursor-pointer hover:bg-slate-50 transition-colors"
                  >
                    <span className="font-semibold pr-4">{faq.q}</span>
                    <motion.span
                      animate={{ rotate: isOpen ? 45 : 0 }}
                      transition={{ duration: 0.22 }}
                      className="text-slate-400 shrink-0 text-lg leading-none"
                    >
                      +
                    </motion.span>
                  </button>

                  <motion.div
                    initial={false}
                    animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }}
                    transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                    className="overflow-hidden"
                  >
                    <p className="px-6 py-4 text-slate-500 text-sm leading-relaxed border-t border-slate-100 bg-slate-50">
                      {faq.a}
                    </p>
                  </motion.div>
                </motion.div>
              );
            })}
          </StaggerIn>

        </div>
      </section>

    </div>
  );
}
