import React, { useState, useEffect, useMemo, useRef, forwardRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  motion, 
  useScroll, 
  useSpring, 
  useTransform, 
  useVelocity, 
  useAnimationFrame, 
  useMotionValue 
} from 'framer-motion';
import { cn } from '../lib/utils';
import { 
  ArrowRight, CheckCircle2, ChevronRight, Building2, Users, MapPin, 
  Shield, BookOpen, Award, Zap, Sparkles, Brain, Cpu, GraduationCap, 
  School, Puzzle, Globe, Laptop, Activity, TrendingUp, Calendar, 
  FileSpreadsheet, ShieldAlert, Star, Trophy
} from 'lucide-react';
import logoImg from '../assets/logo.jpg';

const wrap = (min, max, v) => {
  const range = max - min;
  return ((((v - min) % range) + range) % range) + min;
};

const VelocityText = forwardRef(({
  children,
  baseVelocity = -5,
  classname,
  scrollDependent = false,
  delay = 0,
}, ref) => {
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 50,
    stiffness: 400,
  });
  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 2], {
    clamp: false,
  });

  const x = useTransform(baseX, (v) => `${wrap(-20, -45, v)}%`);

  const directionFactor = useRef(1);
  const hasStarted = useRef(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      hasStarted.current = true;
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  useAnimationFrame((t, delta) => {
    if (!hasStarted.current) return;

    let moveBy = directionFactor.current * baseVelocity * (delta / 1000);

    if (scrollDependent) {
      if (velocityFactor.get() < 0) {
        directionFactor.current = -1;
      } else if (velocityFactor.get() > 0) {
        directionFactor.current = 1;
      }
    }

    moveBy += directionFactor.current * moveBy * velocityFactor.get();

    baseX.set(baseX.get() + moveBy);
  });

  return (
    <div ref={ref} className="overflow-hidden whitespace-nowrap flex flex-nowrap">
      <motion.div
        className="flex whitespace-nowrap gap-10 flex-nowrap"
        style={{ x }}
      >
        <span className={cn("block text-xl md:text-3xl font-black uppercase tracking-wider", classname)}>{children}</span>
        <span className={cn("block text-xl md:text-3xl font-black uppercase tracking-wider", classname)}>{children}</span>
        <span className={cn("block text-xl md:text-3xl font-black uppercase tracking-wider", classname)}>{children}</span>
        <span className={cn("block text-xl md:text-3xl font-black uppercase tracking-wider", classname)}>{children}</span>
      </motion.div>
    </div>
  );
});

VelocityText.displayName = 'VelocityText';

function ScrollVelocityMarquee() {
  return (
    <div className="py-6 bg-[#001F5E] text-[#FAF9F6] border-y-4 border-[#FF8C00] overflow-hidden relative z-20 my-8 transform rotate-1 select-none shadow-[0_4px_12px_rgba(0,31,94,0.15)]">
      <div className="absolute inset-0 bg-[#FF8C00]/5 pointer-events-none circuit-bg" />
      <VelocityText baseVelocity={-1.5} scrollDependent={true}>
        BHARAT AI OLYMPIAD ✦ CBSE CTAI ALIGNED ✦ CLASSES 3 TO 8 ✦ ZERO SYLLABUS BURDEN ✦ DIAGNOSTIC READINESS REPORT ✦&nbsp;
      </VelocityText>
    </div>
  );
}

function LogoShowcaseSection() {
  return (
    <section className="py-12 px-6 bg-[#FAF9F6] relative overflow-hidden select-none">
      <div className="max-w-4xl mx-auto text-center space-y-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-white border-4 border-[#001F5E] rounded-3xl p-8 md:p-12 shadow-[0_10px_0px_0px_#001F5E] flex flex-col items-center justify-center relative group"
        >
          {/* Subtle background circuit pattern */}
          <div className="absolute inset-0 bg-[#FF8C00]/5 pointer-events-none circuit-bg opacity-35 rounded-[22px]" />
          
          <span className="relative z-10 inline-block bg-[#001F5E] text-white font-black text-[10px] tracking-widest px-4 py-1.5 rounded-full uppercase mb-6 shadow-sm">
            Official Brand Mark
          </span>
          
          {/* The Large Logo Image */}
          <div className="relative z-10 w-full max-w-xl bg-white p-6 rounded-2xl border-2 border-slate-100 flex items-center justify-center shadow-inner overflow-hidden transition-transform duration-500 group-hover:scale-[1.02]">
            <img 
              src={logoImg} 
              alt="Bharat AI Olympiad Official Logo" 
              className="h-28 md:h-44 w-auto object-contain mix-blend-multiply transition-all duration-300"
            />
          </div>
          
          <div className="relative z-10 mt-6 max-w-md">
            <h3 className="font-heading font-extrabold text-xl text-[#001F5E]">Bharat AI Olympiad (BAIO)</h3>
            <p className="text-slate-500 text-xs mt-1.5 font-semibold leading-relaxed">
              The standardized national cognitive benchmark for AI literacy and computational thinking, aligned with the CBSE CTAI 2026-27 framework.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}



function FloatingPaths({ position, className }) {
  const paths = Array.from({ length: 36 }, (_, i) => ({
    id: i,
    d: `M-${380 - i * 5 * position} -${189 + i * 6}C-${
      380 - i * 5 * position
    } -${189 + i * 6} -${312 - i * 5 * position} ${216 - i * 6} ${
      152 - i * 5 * position
    } ${343 - i * 6}C${616 - i * 5 * position} ${470 - i * 6} ${
      684 - i * 5 * position
    } ${875 - i * 6} ${684 - i * 5 * position} ${875 - i * 6}`,
    width: 0.5 + i * 0.03,
  }));

  return (
    <div className="absolute inset-0 pointer-events-none">
      <svg
        className={`w-full h-full ${className}`}
        viewBox="0 0 696 316"
        fill="none"
        preserveAspectRatio="none"
      >
        <title>Background Paths</title>
        {paths.map((path) => (
          <motion.path
            key={path.id}
            d={path.d}
            stroke="currentColor"
            strokeWidth={path.width}
            strokeOpacity={0.12 + path.id * 0.006}
            initial={{ pathLength: 0.3, opacity: 0.6 }}
            animate={{
              pathLength: 1,
              opacity: [0.3, 0.6, 0.3],
              pathOffset: [0, 1, 0],
            }}
            transition={{
              duration: 20 + Math.random() * 10,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
          />
        ))}
      </svg>
    </div>
  );
}

export default function HomePage() {
  const [titleNumber, setTitleNumber] = useState(0);
  const titles = useMemo(
    () => ["AI Olympiad", "CTAI Framework", "NEP 2020 Standard", "AI Literacy"],
    []
  );

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (titleNumber === titles.length - 1) {
        setTitleNumber(0);
      } else {
        setTitleNumber(titleNumber + 1);
      }
    }, 2000);
    return () => clearTimeout(timeoutId);
  }, [titleNumber, titles]);

  return (
    <div className="bg-[#FAF9F6] text-[#333333] font-sans selection:bg-[#FF8C00] selection:text-white pb-12">
      
      {/* ─── HERO SECTION ─────────────────────────────────────────── */}
      <section className="relative pt-12 pb-24 md:pt-20 md:pb-24 px-6 overflow-hidden">
        
        {/* Floating Paths Background Animation */}
        <FloatingPaths position={1} className="text-[#001F5E]" />
        <FloatingPaths position={-1} className="text-[#FF8C00]" />
        
        {/* Floating Background Icons/Shapes */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Hot air balloon left */}
          <div className="absolute top-10 left-[15%] w-8 h-12 opacity-80 hidden lg:block">
            <svg viewBox="0 0 30 45" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 0C6.71 0 0 6.71 0 15C0 22.8 12.3 39.5 13.9 41.5C14.5 42.2 15.5 42.2 16.1 41.5C17.7 39.5 30 22.8 30 15C30 6.71 23.29 0 15 0Z" fill="#E2583E" />
              <rect x="12" y="42" width="6" height="3" fill="#8C52FF" />
            </svg>
          </div>
          {/* Tennis ball right */}
          <div className="absolute top-10 right-[15%] w-6 h-6 rounded-full bg-[#A2D149] opacity-90 hidden lg:block" />
        </div>

        <div className="max-w-7xl mx-auto flex flex-col items-center relative z-10">
          
          {/* Checkbox pills */}
          <div className="flex flex-wrap justify-center items-center gap-6 mb-8 text-xs font-bold text-slate-700 tracking-wide">
            <div className="flex items-center gap-1.5">
              <span className="text-[#0B7F3B] font-bold">✓</span> INDIA'S FIRST
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[#0B7F3B] font-bold">✓</span> CLASSES 3–8
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[#0B7F3B] font-bold">✓</span> CBSE CTAI 2026-27 ALIGNED
            </div>
          </div>

          {/* Heading */}
          <div className="text-center max-w-3xl space-y-4">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#001F5E] leading-tight flex flex-col items-center justify-center">
              <span>India's First</span>
              <span className="relative flex w-full justify-center overflow-hidden text-center h-[1.3em] md:pb-4 md:pt-1 text-[#FF8C00] italic font-serif font-normal">
                &nbsp;
                {titles.map((title, index) => (
                  <motion.span
                    key={index}
                    className="absolute font-semibold"
                    initial={{ opacity: 0, y: "-100" }}
                    transition={{ type: "spring", stiffness: 50 }}
                    animate={
                      titleNumber === index
                        ? {
                            y: 0,
                            opacity: 1,
                          }
                        : {
                            y: titleNumber > index ? -150 : 150,
                            opacity: 0,
                          }
                    }
                  >
                    {title}
                  </motion.span>
                ))}
              </span>
              <span>is Here.</span>
            </h1>
            <p className="text-[#FF8C00] font-black text-sm tracking-widest uppercase">
              Bharat AI Olympiad — BAIO
            </p>
          </div>
          {/* Button */}
          <div className="mt-8">
            <Link 
              to="/register" 
              className="inline-flex items-center gap-2 bg-[#FF8C00] hover:bg-[#e07c00] text-white font-extrabold px-8 py-3.5 rounded-full transition-colors shadow-md text-sm"
            >
              Register Your School
              <span className="bg-white/20 rounded-full p-1">
                <ArrowRight className="w-3.5 h-3.5 text-white" />
              </span>
            </Link>
          </div>

          {/* Subtext description */}
          <div className="mt-8 max-w-2xl text-center text-slate-600 text-sm leading-relaxed space-y-4">
            <p>
              India has a maths olympiad. India has a science olympiad. For the first time in our nation's history, India now has an AI olympiad — and it is built not for tomorrow's engineers alone, but for every student in every classroom, from Class 3 to Class 8.
            </p>
            <p className="text-xs text-slate-500 font-medium">
              BAIO — the Bharat AI Olympiad — is a national AI literacy competition that tests exactly what the CBSE's new Computational Thinking and AI (CTAI) 2026-27 framework demands. No other olympiad in India can say this. We don't just align with NEP 2020. We go beyond it.
            </p>
          </div>

          {/* Center Graphic */}
          <div className="mt-8 w-20 h-16 flex items-center justify-center text-[#FF8C00]">
            <BookOpen className="w-12 h-12" />
          </div>

          {/* Floating Left School in Capsule */}
          <div className="absolute left-[3%] top-[12%] hidden xl:block">
            <div className="w-[120px] h-[160px] bg-[#A2D149] rounded-t-full rounded-b-[40px] border-4 border-white shadow-md flex flex-col items-center justify-center p-4">
              <School className="w-16 h-16 text-white" />
              <span className="text-[9px] text-white/90 font-black uppercase tracking-wider mt-2">Classes 3–8</span>
            </div>
            {/* Target icon near left capsule */}
            <div className="absolute -bottom-4 -right-4 w-8 h-8 rounded-full bg-[#E2583E] border-2 border-white flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 text-white" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                <circle cx="12" cy="12" r="6" stroke="currentColor" strokeWidth="2" />
                <circle cx="12" cy="12" r="2" fill="currentColor" />
              </svg>
            </div>
          </div>

          {/* Floating Right Brain/AI in Capsule */}
          <div className="absolute right-[3%] top-[12%] hidden xl:block">
            <div className="w-[120px] h-[160px] bg-[#FFB040] rounded-t-full rounded-b-[40px] border-4 border-white shadow-md flex flex-col items-center justify-center p-4">
              <Brain className="w-16 h-16 text-white" />
              <span className="text-[9px] text-white/90 font-black uppercase tracking-wider mt-2">AI Literacy</span>
            </div>
            {/* Red backpack icon near right capsule */}
            <div className="absolute -bottom-4 -left-4 w-8 h-8 rounded-full bg-[#FF4B4B] border-2 border-white flex items-center justify-center text-[10px] text-white font-bold">
              🎒
            </div>
          </div>

        </div>
      </section>

      <ScrollVelocityMarquee />

      {/* ─── STATS BAR ────────────────────────────────────────────── */}
      <section className="px-6 pb-20">
        <div className="max-w-6xl mx-auto bg-[#001F5E] text-white rounded-3xl p-8 md:p-10 shadow-lg relative overflow-hidden transform -rotate-1">
          
          {/* Floating blue paper airplane on right */}
          <div className="absolute right-4 top-2 text-sky-400 opacity-60">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 rotate-45">
              <path d="M2 21L23 12L2 3V10L17 12L2 14V21Z" />
            </svg>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
            
            {/* Column 1 */}
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#FF8C00] flex items-center justify-center text-white text-lg shrink-0">
                🏫
              </div>
              <div className="space-y-3">
                <div>
                  <h3 className="text-3xl font-extrabold text-[#FF8C00]">100+</h3>
                  <p className="text-xs font-bold text-slate-200">Partner Schools — Delhi NCR</p>
                </div>
                <div className="border-t border-white/10 pt-2">
                  <h3 className="text-xl font-extrabold text-[#0B7F3B]">95%+</h3>
                  <p className="text-[10px] text-slate-400">CBSE CTAI Alignment</p>
                </div>
              </div>
            </div>

            {/* Column 2 */}
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#FFB040] flex items-center justify-center text-white text-lg shrink-0">
                👥
              </div>
              <div className="space-y-3">
                <div>
                  <h3 className="text-3xl font-extrabold text-white">10,000+</h3>
                  <p className="text-xs font-bold text-slate-200">Students Enrolled</p>
                </div>
                <div className="border-t border-white/10 pt-2">
                  <h3 className="text-xl font-extrabold text-[#FF8C00]">6</h3>
                  <p className="text-[10px] text-slate-400">Grade Levels — Class 3 to 8</p>
                </div>
              </div>
            </div>

            {/* Column 3 */}
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#0B7F3B] flex items-center justify-center text-white text-lg shrink-0">
                📍
              </div>
              <div className="space-y-3">
                <div>
                  <h3 className="text-3xl font-extrabold text-[#0B7F3B]">9</h3>
                  <p className="text-xs font-bold text-slate-200">Cities Covered</p>
                </div>
                <div className="border-t border-white/10 pt-2">
                  <h3 className="text-xl font-extrabold text-white">0</h3>
                  <p className="text-[10px] text-slate-400">Teacher Preparation Cost</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      <LogoShowcaseSection />

      {/* ─── WHY BAIO - BENTO GRID ────────────────────────────────── */}
      <section className="py-16 px-6 bg-white border-y border-slate-150">
        <div className="max-w-6xl mx-auto space-y-10">
          
          {/* Title Row */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-2">
              <span className="text-[#FF8C00] font-bold text-xs uppercase tracking-wider">WHY BAIO</span>
              <h2 className="text-3xl font-extrabold text-[#001F5E]">Six reasons 100+ schools chose BAIO.</h2>
            </div>
            <div className="shrink-0">
              <Link to="/olympiad" className="inline-flex items-center gap-2 bg-[#001F5E] hover:bg-[#002880] text-white font-extrabold px-6 py-3 rounded-full text-xs shadow">
                Explore the Olympiad
              </Link>
            </div>
          </div>

          {/* Bento Grid Rows */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Card 1: Orange background */}
            <div className="bg-[#FF8C00] text-white rounded-3xl p-6 relative overflow-hidden flex flex-col justify-between h-[200px]">
              <div>
                <h3 className="font-extrabold text-sm border-b border-white/20 pb-2">01 ■ Built on CBSE CTAI 2026-27</h3>
                <p className="text-[11px] text-slate-100 leading-relaxed mt-2">
                  Every single BAIO question maps to an exact CTAI competency code. We conducted a 47-outcome audit against the CBSE CTAI curriculum and achieved 92–97% alignment across all six grades.
                </p>
              </div>
              <div className="absolute right-4 bottom-4 w-12 h-12 opacity-20 text-white">
                <Shield className="w-full h-full" />
              </div>
            </div>

            {/* Card 2: Green background */}
            <div className="bg-[#0B7F3B] text-white rounded-3xl p-6 relative overflow-hidden flex flex-col justify-between h-[200px]">
              <div>
                <h3 className="font-extrabold text-sm border-b border-white/20 pb-2">02 ■■ India's AI Story</h3>
                <p className="text-[11px] text-slate-100 leading-relaxed mt-2">
                  Our questions reference Bhashini, DigiYatra, PM Kisan, AI4Bharat, IRCTC, UPI fraud detection, Qure.ai, and the IndiaAI Mission. Students learn about the AI transforming their country.
                </p>
              </div>
              <div className="absolute right-4 bottom-4 w-12 h-12 opacity-20 text-white">
                <Globe className="w-full h-full" />
              </div>
            </div>

            {/* Card 3: Blue background */}
            <div className="bg-[#4a90e2] text-white rounded-3xl p-6 relative overflow-hidden flex flex-col justify-between h-[200px]">
              <div>
                <h3 className="font-extrabold text-sm border-b border-white/20 pb-2">03 ■ Zero Work for Teachers</h3>
                <p className="text-[11px] text-slate-100 leading-relaxed mt-2">
                  BAIO requires zero teacher training, zero syllabus change, and zero special infrastructure. The exam is 60 minutes on one day of your choosing. We deliver all physical booklets 5 days prior.
                </p>
              </div>
              <div className="absolute right-4 bottom-4 w-12 h-12 opacity-20 text-white">
                <Zap className="w-full h-full" />
              </div>
            </div>

            {/* Card 4: Navy background */}
            <div className="bg-[#001F5E] text-white rounded-3xl p-6 relative overflow-hidden flex flex-col justify-between h-[200px]">
              <div>
                <h3 className="font-extrabold text-sm border-b border-white/20 pb-2">04 ■ A Diagnostic Tool</h3>
                <p className="text-[11px] text-slate-200 leading-relaxed mt-2">
                  After every BAIO, your school receives a class-by-class AI Readiness Report. It shows which CTAI skills your students have mastered, where curriculum gaps exist, and how your school compares.
                </p>
              </div>
              <div className="absolute right-4 bottom-4 w-12 h-12 opacity-20 text-white">
                <Activity className="w-full h-full" />
              </div>
            </div>

            {/* Card 5: Orange background */}
            <div className="bg-[#FF8C00] text-white rounded-3xl p-6 relative overflow-hidden flex flex-col justify-between h-[200px]">
              <div>
                <h3 className="font-extrabold text-sm border-b border-white/20 pb-2">05 ■ Real Recognition</h3>
                <p className="text-[11px] text-slate-100 leading-relaxed mt-2">
                  Gold, Silver, Bronze medals. An All-India BAIO Leaderboard. The AI Champion Award for national rank holders. A printed AI Readiness Certificate for every single participant.
                </p>
              </div>
              <div className="absolute right-4 bottom-4 w-12 h-12 opacity-20 text-white">
                <Trophy className="w-full h-full" />
              </div>
            </div>

            {/* Card 6: Green background */}
            <div className="bg-[#0B7F3B] text-white rounded-3xl p-6 relative overflow-hidden flex flex-col justify-between h-[200px]">
              <div>
                <h3 className="font-extrabold text-sm border-b border-white/20 pb-2">06 ■ Ahead of the Curve</h3>
                <p className="text-[11px] text-slate-100 leading-relaxed mt-2">
                  BAIO covers everything the CTAI mandates — and then goes further. Federated learning, generative AI, responsible innovation, deepfakes in democracy, India's DPDP Act 2023, and the IndiaAI Mission.
                </p>
              </div>
              <div className="absolute right-4 bottom-4 w-12 h-12 opacity-20 text-white">
                <TrendingUp className="w-full h-full" />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ─── EXAM SNAPSHOT - 4 CIRCLES ────────────────────────────── */}
      <section className="py-16 px-6 bg-[#FAF9F6]">
        <div className="max-w-6xl mx-auto space-y-10">
          
          <div className="text-center space-y-2">
            <span className="text-[#FF8C00] font-bold text-xs uppercase tracking-wider">EXAM FORMAT</span>
            <h2 className="text-3xl font-extrabold text-[#001F5E]">Simple to run. Powerful to analyse.</h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            
            {/* Circle 1 */}
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 rounded-full border-4 border-[#4a90e2] flex items-center justify-center bg-white shadow-sm text-[#4a90e2]">
                <Puzzle className="w-8 h-8" />
              </div>
              <h3 className="font-bold text-xs text-[#001F5E] mt-3">Section A</h3>
              <p className="text-[10px] text-slate-800 font-bold">CT & Logical Reasoning</p>
              <p className="text-[9px] text-slate-500 mt-0.5">Classes 3–5: 10 Marks | Classes 6–8: 15 Marks</p>
            </div>

            {/* Circle 2 */}
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 rounded-full border-4 border-[#FF8C00] flex items-center justify-center bg-white shadow-sm text-[#FF8C00]">
                <Cpu className="w-8 h-8" />
              </div>
              <h3 className="font-bold text-xs text-[#001F5E] mt-3">Section B</h3>
              <p className="text-[10px] text-slate-800 font-bold">AI & Technology Concepts</p>
              <p className="text-[9px] text-slate-500 mt-0.5">Classes 3–5: 10 Marks | Classes 6–8: 15 Marks</p>
            </div>

            {/* Circle 3 */}
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 rounded-full border-4 border-[#0B7F3B] flex items-center justify-center bg-white shadow-sm text-[#0B7F3B]">
                <Globe className="w-8 h-8" />
              </div>
              <h3 className="font-bold text-xs text-[#001F5E] mt-3">Section C</h3>
              <p className="text-[10px] text-slate-800 font-bold">Everyday AI Around Us</p>
              <p className="text-[9px] text-slate-500 mt-0.5">Classes 3–5: 10 Marks | Classes 6–8: 10 Marks</p>
            </div>

            {/* Circle 4 */}
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 rounded-full border-4 border-[#FFB040] flex items-center justify-center bg-white shadow-sm text-[#FFB040]">
                <Sparkles className="w-8 h-8" />
              </div>
              <h3 className="font-bold text-xs text-[#001F5E] mt-3">Section D</h3>
              <p className="text-[10px] text-slate-800 font-bold">HOTS — Achiever's Section</p>
              <p className="text-[9px] text-slate-500 mt-0.5">All Grades: 10 Marks (5 Qs × 2 Marks)</p>
            </div>

          </div>
        </div>
      </section>

      {/* ─── TWO COLUMN CARDS ─────────────────────────────────────── */}
      <section className="py-16 px-6 bg-white border-y border-slate-150">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Card 1: Yellow/Orange Background */}
          <div className="bg-[#FFB040] text-[#001F5E] rounded-3xl p-8 relative overflow-hidden flex flex-col justify-between h-[250px] shadow-sm">
            <div className="space-y-2 max-w-[70%]">
              <h3 className="text-xl font-extrabold text-[#001F5E]">Preparatory Stage — Classes 3, 4 & 5</h3>
              <p className="text-[10px] text-[#001F5E]/90 font-bold">
                TOTAL: 35 Questions · 40 Marks · 60 Minutes
              </p>
              <p className="text-[10px] text-slate-800 leading-relaxed font-semibold">
                Section A: 10 Marks | Section B: 10 Marks | Section C: 10 Marks | Section D (HOTS): 10 Marks
              </p>
            </div>
            <div className="mt-4">
              <Link to="/register" className="inline-flex items-center gap-2 bg-[#001F5E] text-white text-xs font-bold px-5 py-2.5 rounded-full shadow-md">
                Register Your School <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            {/* Simple educational icon graphic on right */}
            <div className="absolute right-4 bottom-4 w-20 h-20 opacity-20 text-[#001F5E]">
              <GraduationCap className="w-full h-full" />
            </div>
          </div>

          {/* Card 2: Coral Background */}
          <div className="bg-[#FF8C00] text-white rounded-3xl p-8 relative overflow-hidden flex flex-col justify-between h-[250px] shadow-sm">
            <div className="space-y-2 max-w-[70%]">
              <h3 className="text-xl font-extrabold text-white">Middle Stage — Classes 6, 7 & 8</h3>
              <p className="text-[10px] text-slate-100 font-bold">
                TOTAL: 45 Questions · 50 Marks · 60 Minutes
              </p>
              <p className="text-[10px] text-slate-100/90 leading-relaxed">
                Section A: 15 Marks | Section B: 15 Marks | Section C: 10 Marks | Section D (HOTS): 10 Marks
              </p>
            </div>
            <div className="mt-4">
              <Link to="/olympiad" className="inline-flex items-center gap-2 bg-white text-brand-orange text-xs font-bold px-5 py-2.5 rounded-full shadow-md">
                Explore the Olympiad <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            {/* Simple educational icon graphic on right */}
            <div className="absolute right-4 bottom-4 w-20 h-20 opacity-20 text-white">
              <Award className="w-full h-full" />
            </div>
          </div>

        </div>
      </section>

      {/* ─── THE PROBLEM SECTION ──────────────────────────────────── */}
      <section className="py-20 px-6 bg-[#FAF9F6]">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column - Content */}
          <div className="lg:col-span-7 space-y-6">
            <span className="inline-block bg-[#FF8C00]/10 text-[#FF8C00] font-black text-[10px] tracking-widest px-3 py-1 rounded-full uppercase">
              THE PROBLEM
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#001F5E] leading-tight">
              Every child uses AI every day. <br />
              <span className="text-slate-400">Almost none of them understand it.</span>
            </h2>
            <div className="text-slate-600 text-xs md:text-sm leading-relaxed space-y-4 font-medium">
              <p>
                Your students use Siri to set alarms, ask YouTube what to watch next, rely on Google Maps to navigate, and have their Instagram feeds curated by algorithms they never chose. AI makes 200 decisions per day on behalf of a typical Indian teenager.
              </p>
              <p>
                Yet when you ask those same students what AI actually is — how it learns, what it cannot do, when it is wrong, and who is responsible when it harms someone — most cannot answer. Not because they lack intelligence. But because no one has ever taught them.
              </p>
              <p className="font-bold text-[#001F5E]">
                CBSE recognised this. NEP 2020 recognised this. CTAI 2026-27 was built in response to this gap. BAIO is the competition that makes CTAI real, tangible, and nationally celebrated.
              </p>
              <p className="text-[11px] text-slate-500">
                The World Economic Forum projects that 65% of today's Class 3 students will work in jobs that do not yet exist — and AI fluency will be the single most common requirement across all of them. We are not preparing students for the future. We are preparing them for a future that is already here.
              </p>
            </div>
            <div className="pt-2">
              <Link to="/register" className="inline-flex items-center gap-2 bg-[#FF8C00] hover:bg-[#e07c00] text-white font-extrabold px-6 py-3 rounded-full text-xs shadow-md">
                Register Your School
              </Link>
            </div>
          </div>

          {/* Right Column - Graphic and Stats */}
          <div className="lg:col-span-5 relative flex flex-col items-center">
            {/* Simple educational vector card */}
            <div className="w-[220px] h-[220px] rounded-3xl border-4 border-[#001F5E] shadow-sm bg-white flex flex-col items-center justify-center p-6 text-[#001F5E]">
              <Laptop className="w-16 h-16 text-[#FF8C00]" />
              <span className="text-[11px] font-black uppercase tracking-widest mt-4 text-slate-500">AI Literacy Audit</span>
            </div>
            
            {/* Stats Overlay Cards */}
            <div className="mt-6 flex gap-4 w-full justify-center">
              <div className="bg-white border-2 border-slate-100 rounded-2xl p-4 text-center shadow-sm w-36">
                <span className="text-[#0B7F3B] font-bold text-sm block">✓ 95%+</span>
                <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider mt-0.5">CTAI Alignment</p>
              </div>
              <div className="bg-white border-2 border-slate-100 rounded-2xl p-4 text-center shadow-sm w-36">
                <span className="text-[#FF8C00] font-bold text-sm block">✓ 0 Cost</span>
                <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider mt-0.5">Teacher Prep</p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ─── HOW IT WORKS / TIMELINE ──────────────────────────────── */}
      <section className="py-20 px-6 bg-white border-y border-slate-150">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column - Graphic */}
          <div className="lg:col-span-4 flex justify-center">
            {/* Clean calendar graphic container */}
            <div className="w-[200px] h-[250px] rounded-3xl border-4 border-[#0B7F3B] shadow-sm bg-[#FAF9F6] flex flex-col items-center justify-center p-6 text-[#0B7F3B]">
              <Calendar className="w-16 h-16 text-[#0B7F3B]" />
              <span className="text-[10px] font-black uppercase tracking-widest mt-4 text-slate-500">Exam Timelines</span>
            </div>
          </div>

          {/* Right Column - Step timeline inside Card */}
          <div className="lg:col-span-8 bg-[#FFB040] text-[#001F5E] rounded-3xl p-6 md:p-8 relative overflow-hidden shadow-sm">
            
            {/* Linear doodle decoration */}
            <div className="absolute right-4 top-4 w-12 h-12 opacity-30 text-[#001F5E]">
              <FileSpreadsheet className="w-full h-full" />
            </div>

            <span className="bg-[#001F5E] text-[#FFB040] font-black text-[9px] tracking-widest px-2.5 py-0.5 rounded-full uppercase">
              HOW IT WORKS
            </span>
            
            <h3 className="text-2xl font-extrabold mt-3 mb-6">From sign-up to celebration in 5 steps.</h3>
            
            <div className="space-y-4 text-xs font-semibold max-h-[300px] overflow-y-auto pr-2">
              <div className="border-l-2 border-[#001F5E]/30 pl-4 py-1">
                <h4 className="font-extrabold text-sm">Step 01: School Registers</h4>
                <p className="text-slate-800 text-[11px] leading-relaxed mt-0.5">
                  Principal fills a 2-minute form on baio.in. A dedicated BAIO School Coordinator is assigned within 24 hours and takes responsibility for every step from here.
                </p>
              </div>
              <div className="border-l-2 border-[#001F5E]/30 pl-4 py-1">
                <h4 className="font-extrabold text-sm">Step 02: We Send Everything</h4>
                <p className="text-slate-800 text-[11px] leading-relaxed mt-0.5">
                  Five days before your chosen exam date, we deliver: printed question papers, answer sheets, invigilator instruction guides, roll number slips, and a complete seating plan template.
                </p>
              </div>
              <div className="border-l-2 border-[#001F5E]/30 pl-4 py-1">
                <h4 className="font-extrabold text-sm">Step 03: Students Sit the 60-Minute Exam</h4>
                <p className="text-slate-800 text-[11px] leading-relaxed mt-0.5">
                  Students sit the BAIO exam on your chosen date. No computers. No internet. No lab. Just a question paper, a pen, and the thinking they bring to every classroom.
                </p>
              </div>
              <div className="border-l-2 border-[#001F5E]/30 pl-4 py-1">
                <h4 className="font-extrabold text-sm">Step 04: We Handle Marking and Analysis</h4>
                <p className="text-slate-800 text-[11px] leading-relaxed mt-0.5">
                  Answer sheets are returned to BAIO. Our team marks all papers, generates individual student scores, compiles the school's class-wise AI Readiness Report, and calculates rankings.
                </p>
              </div>
              <div className="border-l-2 border-[#001F5E]/30 pl-4 py-1">
                <h4 className="font-extrabold text-sm">Step 05: Results, Certificates, and Celebration</h4>
                <p className="text-slate-800 text-[11px] leading-relaxed mt-0.5">
                  Results are published on the BAIO National Leaderboard. Printed certificates are dispatched. The principal receives the full AI Readiness Report. And your school earns the BAIO AI Ready Badge.
                </p>
              </div>
            </div>

            <div className="mt-6 text-[10px] font-bold text-slate-800">
              🗓️ Onboarding status: Open for BAIO 2026-27 registration
            </div>

          </div>

        </div>
      </section>

      {/* ─── TESTIMONIALS (WHAT SCHOOLS SAY) ───────────────────────── */}
      <section className="py-20 px-6 bg-[#FAF9F6] border-b border-slate-150">
        <div className="max-w-6xl mx-auto space-y-12">
          
          <div className="text-center space-y-2">
            <span className="text-[#FF8C00] font-bold text-xs uppercase tracking-wider">WHAT SCHOOLS SAY</span>
            <h2 className="text-3xl font-extrabold text-[#001F5E]">Principals speak. Parents listen. Students shine.</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Testimonial 1 */}
            <div className="bg-white border-2 border-slate-200 rounded-3xl p-6 flex flex-col justify-between h-[230px] shadow-sm">
              <p className="text-xs text-slate-600 italic leading-relaxed">
                "We were hesitant at first. Another olympiad, another coordination headache. BAIO was the complete opposite. Zero work for our teachers, and the AI Readiness Report we received was the most useful school data I have seen in years. Our Principal presented it at the Parent-Teacher Meeting to actual applause."
              </p>
              <div className="border-t border-slate-100 pt-3 mt-3 flex items-center gap-2">
                <span className="text-xs font-bold text-[#001F5E]">Dr. Sangeeta Arya</span>
                <span className="text-[10px] text-slate-400">— Principal, Apeejay School, Noida</span>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-white border-2 border-slate-200 rounded-3xl p-6 flex flex-col justify-between h-[230px] shadow-sm">
              <p className="text-xs text-slate-600 italic leading-relaxed">
                "Parents have been asking us for years what the school is doing about AI education. BAIO gave us a concrete, credible answer. Our students now hold an AI Readiness Certificate. Three parents specifically called the school office to say thank you the week results were declared."
              </p>
              <div className="border-t border-slate-100 pt-3 mt-3 flex items-center gap-2">
                <span className="text-xs font-bold text-[#001F5E]">Ms. Nidhi Trivedi</span>
                <span className="text-[10px] text-slate-400">— Principal, Ryan International School, Noida</span>
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-white border-2 border-slate-200 rounded-3xl p-6 flex flex-col justify-between h-[230px] shadow-sm">
              <p className="text-xs text-slate-600 italic leading-relaxed">
                "What struck me most about BAIO is the depth. This is not a technology quiz. It tests genuine reasoning about AI, ethics, data, and societal impact. My Class 8 students came out of the exam room actually debating whether an AI should be allowed to make bail decisions."
              </p>
              <div className="border-t border-slate-100 pt-3 mt-3 flex items-center gap-2">
                <span className="text-xs font-bold text-[#001F5E]">Ms. Priyanka Barara</span>
                <span className="text-[10px] text-slate-400">— Principal, Lotus Valley International School, Noida</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ─── FINAL CTA SECTION ────────────────────────────────────── */}
      <section className="py-20 px-6 bg-[#001F5E] text-white text-center relative overflow-hidden">
        
        {/* Glow Spheres */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-[#FF8C00] opacity-10 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-[#0B7F3B] opacity-10 rounded-full blur-3xl" />
        </div>

        <div className="max-w-3xl mx-auto space-y-6 relative z-10">
          <span className="inline-block bg-[#FF8C00]/25 text-[#FFB040] font-black text-[10px] tracking-widest px-3 py-1 rounded-full uppercase">
            REGISTER NOW
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-white leading-tight">
            Your school's AI journey <br />
            starts today.
          </h2>
          <p className="text-slate-300 text-sm max-w-xl mx-auto leading-relaxed">
            Join India's first national AI Olympiad as a Founding Partner school. Founding school status includes priority coordinator assignment, preferred exam date selection, featured listing on the BAIO National Leaderboard, and the Founding School Badge. Spots are limited in each city.
          </p>
          <div className="pt-4 space-y-3">
            <Link 
              to="/register" 
              className="inline-flex items-center gap-2 bg-[#FF8C00] hover:bg-[#e07c00] text-white font-extrabold px-8 py-3.5 rounded-full transition-colors shadow-md text-sm"
            >
              Register My School for BAIO 2026-27
            </Link>
            <p className="text-slate-400 text-xs font-semibold">
              No payment required at registration. A BAIO coordinator contacts you within 24 hours with the complete school pack, fee structure, and next steps.
            </p>
          </div>
        </div>
      </section>

    </div>
  );
}
