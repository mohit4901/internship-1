import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, PhoneCall, Mail } from 'lucide-react';

const faqSections = [
  {
    category: 'About BAIO',
    color: 'bg-brand-orange border-brand-orange',
    faqs: [
      {
        q: 'What is BAIO?',
        a: "BAIO — Bharat AI Olympiad — is India's first national AI literacy competition for students from Class 3 to Class 8. It tests computational thinking and AI understanding aligned with CBSE's CTAI 2026-27 framework and NEP 2020.",
      },
      {
        q: 'How is BAIO different from SOF or other olympiads?',
        a: "SOF olympiads test Maths, Science, and English — subjects with decades of olympiad tradition. BAIO tests AI and computational thinking, the subject CBSE has mandated under CTAI 2026-27 that no existing olympiad addresses. The majority of our founding partner schools run both.",
      },
      {
        q: 'Who runs BAIO?',
        a: 'BAIO is run by a team of education professionals with deep knowledge of the CBSE CTAI 2026-27 curriculum, child development, and the operational infrastructure required to run a national competition. We are not a generic edtech platform. We built BAIO specifically for this purpose.',
      },
      {
        q: 'Which schools have participated so far?',
        a: 'BAIO launched in Delhi NCR with 100 founding partner schools in 2026. Our founding partner schools include respected academic institutions across Noida, Gurgaon, Faridabad, and Delhi. We are expanding city by city.',
      },
    ],
  },
  {
    category: 'Exam & Syllabus',
    color: 'bg-brand-navy border-brand-navy',
    faqs: [
      {
        q: 'What is the exam format?',
        a: 'The BAIO exam is 60 minutes long, pen-and-paper, with no computers or internet required. It has four sections: Section A (CT & Logical Reasoning), Section B (AI & Technology Concepts), Section C (Everyday AI Around Us), and Section D (HOTS Achiever\'s Section). Preparatory Stage (Classes 3-5) is 35 questions / 40 marks. Middle Stage (Classes 6-8) is 45 questions / 50 marks.',
      },
      {
        q: 'Is the paper the same for all classes?',
        a: 'No. Each grade has a completely independent paper. A Class 3 paper and a Class 8 paper are not the same questions at different difficulty levels — they are entirely different thinking tasks designed for each student\'s cognitive and academic stage.',
      },
      {
        q: 'What does the syllabus cover?',
        a: 'The syllabus is fully aligned with CBSE CTAI 2026-27. It covers algorithmic thinking, AI learning types (supervised, unsupervised, reinforcement), data science, computer vision, NLP, responsible AI, India\'s DPDP Act 2023, the IndiaAI Mission, and real-world Indian AI applications like Bhashini, DigiYatra, IRCTC, and UPI fraud detection.',
      },
      {
        q: 'How does the CTAI alignment work?',
        a: 'We conducted a 47-outcome audit of the CBSE CTAI 2026-27 curriculum before launching BAIO v2. Every BAIO question is mapped to a specific CTAI competency code. Our alignment scores: Class 3 (97%), Class 4 (96%), Class 5 (93%), Class 6 (94%), Class 7 (92%), Class 8 (95%).',
      },
      {
        q: 'Are sample papers available?',
        a: 'Yes. Sample questions and section descriptions are published on our Olympiad page. Schools that register receive a complete sample paper pack from their dedicated coordinator.',
      },
    ],
  },
  {
    category: 'Registration & Fees',
    color: 'bg-brand-green border-brand-green',
    faqs: [
      {
        q: 'How does school registration work?',
        a: 'A principal or school coordinator fills the two-minute registration form on baio.in. Within 24 hours, a dedicated BAIO School Coordinator is assigned to the school. The coordinator takes responsibility for every step from there — exam materials, date selection, and results delivery.',
      },
      {
        q: 'Is there a per-student fee charged to parents?',
        a: "No. BAIO is a school registration — a single fee that covers all student materials, printed certificates, the AI Readiness Report, and leaderboard listing for the entire school. There is no separate per-student charge to parents. The school registration cost is managed by the school.",
      },
      {
        q: 'Do we need to pay at registration?',
        a: 'No payment is required at registration. A BAIO coordinator contacts you within 24 hours with the complete school information pack, fee structure, exam date options, and next steps.',
      },
      {
        q: 'Is there a group rate for chain schools?',
        a: 'Yes. Schools that are part of a chain — DPS Society, Ryan Group, Amity, GD Goenka, and others — can apply for group registration covering all campuses. Contact us at schools@baio.in for a tailored package.',
      },
    ],
  },
  {
    category: 'Results & Certificates',
    color: 'bg-brand-orange border-brand-orange',
    faqs: [
      {
        q: 'When are results declared?',
        a: 'Results are delivered within 10 working days of BAIO receiving your school\'s answer sheets. Results are published on the BAIO National Leaderboard.',
      },
      {
        q: 'What certificates do students receive?',
        a: "Every student who sits the BAIO exam receives a printed AI Readiness Participation Certificate. Top performers receive Gold, Silver, or Bronze medals. The top 10% per school receive a BAIO Merit Letter. Gold, Silver, and Bronze medal winners receive national recognition on the All-India Leaderboard.",
      },
      {
        q: 'What is the AI Readiness Report?',
        a: "The AI Readiness Report is a class-by-class diagnostic delivered to the school principal. It shows class-wise average scores, CTAI competency-level analysis, comparison against city and national averages, individual student score sheets, and curriculum recommendations. It is the only school-level AI literacy diagnostic that exists in India.",
      },
      {
        q: 'Is the national leaderboard public?',
        a: 'Yes. The BAIO National Leaderboard is published publicly and lists schools by city. Founding schools receive featured listings. Individual student rankings for national medal holders are also published.',
      },
    ],
  },
  {
    category: 'For Parents',
    color: 'bg-brand-green border-brand-green',
    faqs: [
      {
        q: 'Should I prepare my child specifically for BAIO?',
        a: "BAIO tests what CBSE's CTAI framework already expects students to know. If your child follows the CBSE curriculum in their school, they are already being exposed to the concepts BAIO tests. There is no specific BAIO preparation required. The exam is designed to assess natural understanding, not coached performance.",
      },
      {
        q: 'What does my child win if they do well?',
        a: 'National Rank 1-3 per grade receive a Gold Medal, National Champion trophy, and merit scholarship. Rank 4-10 receive a Silver Medal and Excellence Certificate. The top 10% per school receive a Bronze Certificate and BAIO Merit Letter. Every participant receives a printed AI Readiness Certificate.',
      },
      {
        q: 'Is the BAIO certificate useful for college applications?',
        a: 'Yes. The BAIO AI Readiness Certificate demonstrates engagement with India\'s national AI competency framework — a credential that is increasingly relevant for college and scholarship applications as AI becomes central to every field.',
      },
      {
        q: 'How do I know BAIO is credible?',
        a: "BAIO publishes its full CTAI alignment audit, complete syllabus, and exam structure publicly. Our founding partner schools include respected academic institutions across Delhi NCR. We invite you to review exactly what we test before drawing any conclusions.",
      },
    ],
  },
];

export default function FAQsPage() {
  const [activeSection, setActiveSection] = useState(0);
  const [openFaq, setOpenFaq] = useState(null);

  const handleSectionChange = (idx) => {
    setActiveSection(idx);
    setOpenFaq(null);
  };
  
  const toggleFaq = (key) => setOpenFaq(openFaq === key ? null : key);

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
            FAQ Desk
          </span>
          <h1 className="text-5xl md:text-6xl font-extrabold text-brand-navy tracking-tight leading-[1.1]">
            Every question about BAIO, <br />
            <span className="text-brand-orange">fully answered.</span>
          </h1>
          <p className="text-slate-600 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            School administrators, teachers, parents, and students — all procedural details and specifications compiled in one location.
          </p>
        </div>
      </section>

      {/* ─── STICKY TAB SELECTOR ───────────────────────────────────── */}
      <div className="sticky top-[60px] z-40 bg-white border-y-2 border-slate-100 shadow-sm py-4 px-6">
        <div className="max-w-4xl mx-auto flex gap-2 overflow-x-auto scrollbar-hide py-1">
          {faqSections.map((sec, idx) => (
            <button
              key={idx}
              onClick={() => handleSectionChange(idx)}
              className={`shrink-0 px-4 py-2.5 rounded-2xl text-xs font-bold border-2 transition-all duration-200 cursor-pointer ${
                activeSection === idx
                  ? `${sec.color} text-white border-transparent shadow`
                  : 'text-slate-500 bg-brand-cream border-slate-200 hover:border-brand-navy hover:text-brand-navy'
              }`}
            >
              {sec.category}
            </button>
          ))}
        </div>
      </div>

      {/* ─── FAQS SECTION ─────────────────────────────────────────── */}
      <section className="py-16 px-6">
        <div className="max-w-3xl mx-auto space-y-4">
          {faqSections[activeSection].faqs.map((faq, idx) => {
            const key = `${activeSection}-${idx}`;
            const isOpen = openFaq === key;
            return (
              <div key={idx} className="border-2 border-slate-200 bg-white rounded-3xl overflow-hidden shadow-sm">
                <button
                  onClick={() => toggleFaq(key)}
                  className="w-full px-6 py-4 flex items-center justify-between text-left font-bold text-brand-navy hover:bg-slate-50 transition-colors"
                >
                  <span>{faq.q}</span>
                  <span className="text-xl leading-none text-slate-400">{isOpen ? '−' : '+'}</span>
                </button>
                {isOpen && (
                  <div className="px-6 pb-5 pt-1 text-slate-600 text-sm border-t border-slate-200 leading-relaxed">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ─── STILL HAVE QUESTIONS BENTO ───────────────────────────── */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto bg-brand-navy text-white rounded-3xl border-4 border-brand-navy edu-shadow p-8 md:p-12 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          
          <div className="md:col-span-8 space-y-4">
            <h2 className="text-3xl font-extrabold">Still have a question?</h2>
            <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
              We respond to all support tickets, emails, and school onboarding queries within two business hours.
            </p>
          </div>

          <div className="md:col-span-4 flex flex-col gap-3">
            <a href="mailto:hello@baio.in" className="btn-primary w-full justify-center shadow-lg gap-2 text-xs">
              <Mail className="w-4 h-4" /> Email: hello@baio.in
            </a>
            <a href="tel:+918000000000" className="btn-navy w-full justify-center bg-white text-brand-navy border-2 border-brand-navy hover:bg-slate-50 gap-2 text-xs">
              <PhoneCall className="w-4 h-4" /> Call Onboarding
            </a>
          </div>

        </div>
      </section>

    </div>
  );
}
