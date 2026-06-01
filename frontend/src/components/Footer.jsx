import React from 'react';
import { Link } from 'react-router-dom';
import { Trophy, FileText, ShieldAlert, Award } from 'lucide-react';
import AnimatedTextCycle from "./ui/AnimatedTextCycle";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200 pt-16 pb-8">

      <div>
        <div className="max-w-5xl mx-auto px-6 py-12 flex flex-col items-center text-center">

          <p className="text-sm text-slate-500 mb-4">
            Empowering the next generation of
          </p>

          <div className="min-h-[70px] flex items-center justify-center">
            <AnimatedTextCycle
              interval={2500}
              className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight"
              words={[
                'AI Innovators',
                'Future Engineers',
                'Problem Solvers',
                'National Rankers',
                'Tech Leaders',
                'Olympiad Champions',
                'Young Researchers',
                'Digital Creators',
              ]}
            />
          </div>

          <p className="mt-5 max-w-2xl text-sm text-slate-400 leading-relaxed">
            Bharat AI Olympiad is building India's strongest ecosystem for
            computational thinking, artificial intelligence, logical reasoning,
            innovation, and future-ready technology education.
          </p>

        </div>
      </div>


      <div className="max-w-5xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-6">


        {/* Column 1: Brand */}
        <div className="space-y-4 md:col-span-1">

          <Link to="/" className="flex items-center gap-2.5 no-underline">
            <div className="w-9 h-9 rounded-xl bg-slate-900 flex items-center justify-center">
              <Trophy className="w-4 h-4 text-white" />
            </div>
            <div>
              <span className="font-heading font-extrabold text-lg text-slate-900">
                BAIO
              </span>
              <p className="text-[9px] text-slate-400 tracking-wider font-semibold uppercase leading-none">
                Bharat AI Olympiad
              </p>
            </div>
          </Link>

          <p className="text-xs text-slate-500 leading-relaxed max-w-xs">
            Nurturing logical thinking, AI foundations, and deep tech skills
            across India's top academic minds.
          </p>
        </div>

        {/* Column 2: Navigation */}
        <div className="space-y-4">
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-widest flex items-center gap-1.5">
            <Award className="w-3.5 h-3.5 text-brand-orange" />
            Navigation
          </h4>

          <ul className="space-y-2.5 text-xs text-slate-500">
            <li>
              <Link
                to="/"
                className="hover:text-slate-900 transition-colors"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/olympiads"
                className="hover:text-slate-900 transition-colors"
              >
                Exams &amp; Syllabus
              </Link>
            </li>
            <li>
              <Link
                to="/results"
                className="hover:text-slate-900 transition-colors"
              >
                Results &amp; Ranks
              </Link>
            </li>
            <li>
              <Link
                to="/about"
                className="hover:text-slate-900 transition-colors"
              >
                About the Olympiad
              </Link>
            </li>
            <li>
              <Link
                to="/contact"
                className="hover:text-slate-900 transition-colors"
              >
                Contact Helpdesk
              </Link>
            </li>
            <li>
              <Link
                to="/faqs"
                className="hover:text-slate-900 transition-colors"
              >
                FAQs &amp; Help
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 3: Documents */}
        <div className="space-y-4">
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-widest flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-brand-green" />
            Documents
          </h4>

          <ul className="space-y-2.5 text-xs text-slate-500">
            <li>
              <a href="#" className="hover:text-slate-900 transition-colors">
                Rules &amp; Regulations
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-slate-900 transition-colors">
                Syllabus PDF
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-slate-900 transition-colors">
                Privacy Policy
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-slate-900 transition-colors">
                Terms of Registry
              </a>
            </li>
          </ul>
        </div>

        {/* Column 4: Physical Centre Notice */}
        <div className="space-y-4">
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-widest flex items-center gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5 text-red-500" />
            Centre Notice
          </h4>

          <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl">
            <p className="text-[11px] text-slate-500 leading-relaxed">
              This platform handles digital registrations only. All competitive
              exams are conducted at external physical centers for strict
              proctoring integrity.
            </p>
          </div>
        </div>

      </div>
      {/* Animated Closing Section */}

      {/* Sub Footer */}
      <div className="max-w-5xl mx-auto px-6 mt-12 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-[11px] text-slate-400">
          © {new Date().getFullYear()} Bharat AI Olympiad (BAIO). All rights reserved.
        </p>

        <div className="flex gap-4 text-xs text-slate-400">
          <a href="#" className="hover:text-slate-700 transition-colors">
            Twitter
          </a>
          <a href="#" className="hover:text-slate-700 transition-colors">
            LinkedIn
          </a>
          <a href="#" className="hover:text-slate-700 transition-colors">
            GitHub
          </a>
        </div>
      </div>



    </footer>
  );
}