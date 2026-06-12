import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, ArrowRight, CheckCircle2, Sparkles, Trophy, Cpu, Network } from 'lucide-react';
import { WebGLShader } from '@/components/ui/web-gl-shader';
import { LiquidButton } from '@/components/ui/liquid-glass-button';

export default function Hero() {
  const highlights = [
    'National Rank Certificate & Smart Badge',
    'Curriculum aligned with modern AI/ML trends',
    'Offline physical centre proctoring integrity',
    'Exams for Junior, Senior & Masters divisions'
  ];

  return (
    <section className="relative overflow-hidden pt-12 pb-24 md:py-32 min-h-screen">
      {/* ── WebGL Animated Background ── */}
      <WebGLShader />

      {/* Dark overlay so text remains readable over the shader */}
      <div className="absolute inset-0 bg-black/60 pointer-events-none z-[1]" />

      {/* ── Ambient Background Glows ── */}
      <div className="absolute top-1/4 left-10 w-72 h-72 rounded-full bg-brand-navy/30 blur-3xl pointer-events-none z-[2]" />
      <div className="absolute top-1/3 right-10 w-96 h-96 rounded-full bg-brand-green/10 blur-3xl pointer-events-none z-[2]" />

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center relative z-10">

        {/* ── Left Column: Content ── */}
        <div className="lg:col-span-7 space-y-8 text-left">

          {/* Tagline Badge */}
          <div className="inline-flex items-center gap-2 bg-brand-navy border border-slate-800 rounded-full px-4 py-2 hover:border-brand-orange/40 transition-colors duration-300">
            <BookOpen className="w-3.5 h-3.5 text-brand-orange" />
            <span className="text-[11px] font-bold text-slate-300 uppercase tracking-widest flex items-center gap-1">
              Registrations Open 2026
              <Sparkles className="w-3 h-3 text-brand-orange animate-pulse" />
            </span>
          </div>

          {/* Heading */}
          <div className="space-y-4">
            <h1 className="font-heading font-extrabold text-4xl sm:text-5xl md:text-6xl tracking-tight leading-[1.08] text-white">
              Desh Ka Sabse Bada <br />
              <span className="bg-gradient-to-r from-brand-orange via-amber-400 to-brand-green bg-clip-text text-transparent drop-shadow-sm">
                AI Olympiad
              </span>
            </h1>
            <p className="text-slate-400 text-base sm:text-lg font-light leading-relaxed max-w-xl">
              Empowering India's next generation of innovators. Join thousands of school & college students in the ultimate artificial intelligence evaluation.
            </p>
          </div>

          {/* Bullet Highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {highlights.map((text, i) => (
              <div key={i} className="flex items-center gap-2.5">
                <div className="w-5 h-5 rounded-full bg-brand-green/10 flex items-center justify-center border border-brand-green/20">
                  <CheckCircle2 className="w-3.5 h-3.5 text-brand-green" />
                </div>
                <span className="text-xs sm:text-sm text-slate-300 leading-none">{text}</span>
              </div>
            ))}
          </div>

          {/* CTAs */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Link
              to="/register"
              className="group"
            >
              <LiquidButton
                className="text-white border border-brand-orange/40 rounded-full bg-brand-orange/20 hover:bg-brand-orange/30"
                size="xl"
              >
                <span className="flex items-center gap-2">
                  Register School
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                </span>
              </LiquidButton>
            </Link>
            <Link
              to="/olympiad"
              className="bg-slate-900/60 hover:bg-slate-900 border border-slate-800/80 hover:border-slate-700 text-slate-300 hover:text-white px-7 py-3.5 rounded-xl font-bold transition-all duration-300 flex items-center gap-2 text-sm"
            >
              Explore Syllabus
            </Link>
          </div>

        </div>

        {/* ── Right Column: Interactive Visual ── */}
        <div className="lg:col-span-5 flex justify-center relative">

          {/* Decorative Back Gradients */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-brand-orange/5 rounded-full blur-3xl z-0 animate-pulse-slow" />

          {/* Main Floating Glass Panel */}
          <div className="w-full max-w-sm glass-card rounded-3xl p-6 relative z-10 glow-orange animate-float overflow-hidden border border-white/10">

            {/* Glossy Overlay */}
            <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/0 pointer-events-none" />

            {/* Header branding */}
            <div className="flex justify-between items-center pb-4 border-b border-slate-800/60">
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-brand-orange" />
                <span className="text-[10px] font-bold text-slate-400 tracking-widest uppercase">
                  BAIO CERTIFICATE
                </span>
              </div>
              <Cpu className="w-4 h-4 text-brand-green animate-spin-slow" />
            </div>

            {/* Certificate Details Mock */}
            <div className="py-6 space-y-6 text-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-brand-navy to-brand-green flex items-center justify-center mx-auto border border-brand-green/30 shadow-md">
                <AwardMockIcon className="w-8 h-8 text-brand-green" />
              </div>
              <div className="space-y-1.5">
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                  National Merit Awardee
                </p>
                <h3 className="font-heading font-extrabold text-xl text-slate-100">
                  Aditya Sharma
                </h3>
                <p className="text-xs text-slate-400">
                  Grade 10, Senior Division
                </p>
              </div>
            </div>

            {/* Stats / Badges strip */}
            <div className="bg-slate-950/70 p-3.5 rounded-2xl border border-slate-900/60 grid grid-cols-3 gap-2 text-center">
              <div>
                <p className="text-[9px] text-slate-500 font-bold uppercase">Rank</p>
                <p className="text-sm font-extrabold text-brand-orange font-heading">AIR 14</p>
              </div>
              <div className="border-x border-slate-900">
                <p className="text-[9px] text-slate-500 font-bold uppercase">Percentile</p>
                <p className="text-sm font-extrabold text-brand-green font-heading">99.82%</p>
              </div>
              <div>
                <p className="text-[9px] text-slate-500 font-bold uppercase">Status</p>
                <p className="text-sm font-extrabold text-amber-400 font-heading">Merit</p>
              </div>
            </div>

            {/* Extra Dynamic badge */}
            <div className="absolute -bottom-1 -right-1 w-24 h-24 bg-brand-green/5 rounded-full blur-2xl" />

          </div>

          {/* Smaller floating decoration */}
          <div className="absolute -bottom-4 -left-6 bg-slate-900/90 border border-slate-800/80 p-3 rounded-2xl shadow-xl flex items-center gap-2.5 animate-bounce-slow z-20">
            <div className="w-8 h-8 rounded-lg bg-brand-orange/10 flex items-center justify-center border border-brand-orange/20">
              <Network className="w-4 h-4 text-brand-orange" />
            </div>
            <div className="text-left leading-tight">
              <p className="text-[10px] font-bold text-slate-500 uppercase leading-none">Registered</p>
              <p className="text-xs font-extrabold text-slate-200">12,500+ Students</p>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}

// Simple custom helper component for mock icon inside Visual
function AwardMockIcon(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      {...props}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
      />
    </svg>
  );
}