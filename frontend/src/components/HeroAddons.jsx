import React from 'react';
import { Brain, School } from 'lucide-react';

/**
 * HeroAddons — the stats bar + floating capsules that were
 * previously living inside the hero section.
 * Rendered as a standalone section right after the hero.
 */
export default function HeroAddons() {
  return (
    <section className="px-6 pb-10 relative">
      <div className="max-w-5xl mx-auto relative">

        {/* ── Floating Left Capsule (xl only) ── */}
        <div className="absolute -left-[140px] top-1/2 -translate-y-1/2 hidden xl:block">
          <div className="w-[110px] h-[150px] bg-[#A2D149] rounded-t-full rounded-b-[40px] border-4 border-white shadow-md flex flex-col items-center justify-center p-4">
            <School className="w-14 h-14 text-white" />
            <span className="text-[9px] text-white/90 font-black uppercase tracking-wider mt-2">Grades 3–8</span>
          </div>
          <div className="absolute -bottom-4 -right-4 w-8 h-8 rounded-full bg-[#E2583E] border-2 border-white flex items-center justify-center">
            <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 text-white" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
              <circle cx="12" cy="12" r="6" stroke="currentColor" strokeWidth="2" />
              <circle cx="12" cy="12" r="2" fill="currentColor" />
            </svg>
          </div>
        </div>

        {/* ── Stats Bar ── */}
        <div className="w-full bg-white border-4 border-[#001F5E] rounded-3xl p-6 md:p-8 shadow-[0_8px_0px_0px_#001F5E] relative overflow-hidden">
          <div className="absolute inset-0 bg-[#FF8C00]/5 pointer-events-none circuit-bg opacity-40" />
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 text-center divide-y md:divide-y-0 md:divide-x divide-slate-100 relative z-10">
            <div className="pt-2 md:pt-0">
              <h3 className="text-2xl md:text-3xl font-black text-[#FF8C00]">100+</h3>
              <p className="text-[10px] md:text-xs font-bold text-slate-500 mt-1 uppercase tracking-wider">Partner Schools</p>
            </div>
            <div className="pt-4 md:pt-0 md:pl-4">
              <h3 className="text-2xl md:text-3xl font-black text-[#001F5E]">10,000+</h3>
              <p className="text-[10px] md:text-xs font-bold text-slate-500 mt-1 uppercase tracking-wider">Students</p>
            </div>
            <div className="pt-4 md:pt-0 md:pl-4">
              <h3 className="text-2xl md:text-3xl font-black text-[#0B7F3B]">95%+</h3>
              <p className="text-[10px] md:text-xs font-bold text-slate-500 mt-1 uppercase tracking-wider">CTAI Alignment</p>
            </div>
            <div className="pt-4 md:pt-0 md:pl-4">
              <h3 className="text-2xl md:text-3xl font-black text-[#FF8C00]">₹0</h3>
              <p className="text-[10px] md:text-xs font-bold text-slate-500 mt-1 uppercase tracking-wider">Teacher Prep Cost</p>
            </div>
            <div className="pt-4 md:pt-0 md:pl-4">
              <h3 className="text-2xl md:text-3xl font-black text-[#001F5E]">60 Mins</h3>
              <p className="text-[10px] md:text-xs font-bold text-slate-500 mt-1 uppercase tracking-wider">One Exam</p>
            </div>
          </div>
        </div>

        {/* ── Floating Right Capsule (xl only) ── */}
        <div className="absolute -right-[140px] top-1/2 -translate-y-1/2 hidden xl:block">
          <div className="w-[110px] h-[150px] bg-[#FFB040] rounded-t-full rounded-b-[40px] border-4 border-white shadow-md flex flex-col items-center justify-center p-4">
            <Brain className="w-14 h-14 text-white" />
            <span className="text-[9px] text-white/90 font-black uppercase tracking-wider mt-2">AI Literacy</span>
          </div>
          <div className="absolute -bottom-4 -left-4 w-8 h-8 rounded-full bg-[#FF4B4B] border-2 border-white flex items-center justify-center text-[10px] text-white font-bold">
            🎒
          </div>
        </div>

      </div>
    </section>
  );
}
