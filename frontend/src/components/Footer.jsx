import React, { useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Mail, MapPin, ExternalLink, ArrowRight } from "lucide-react";

// Register ScrollTrigger safely for React
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// -------------------------------------------------------------------------
// 1. THEME-ADAPTIVE INLINE STYLES (Adapted for BAIO Brand kit)
// -------------------------------------------------------------------------
const STYLES = `
.cinematic-footer-wrapper {
  -webkit-font-smoothing: antialiased;
  
  --pill-bg-1: rgba(255, 255, 255, 0.05);
  --pill-bg-2: rgba(255, 255, 255, 0.02);
  --pill-shadow: rgba(0, 0, 0, 0.4);
  --pill-highlight: rgba(255, 255, 255, 0.1);
  --pill-inset-shadow: rgba(0, 0, 0, 0.8);
  --pill-border: rgba(255, 255, 255, 0.08);
  
  --pill-bg-1-hover: rgba(255, 255, 255, 0.08);
  --pill-bg-2-hover: rgba(255, 255, 255, 0.03);
  --pill-border-hover: rgba(255, 255, 255, 0.2);
  --pill-shadow-hover: rgba(0, 0, 0, 0.5);
  --pill-highlight-hover: rgba(255, 255, 255, 0.25);
}

@keyframes footer-breathe {
  0% { transform: translate(-50%, -50%) scale(1); opacity: 0.4; }
  100% { transform: translate(-50%, -50%) scale(1.1); opacity: 0.7; }
}

@keyframes footer-scroll-marquee {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}

@keyframes footer-heartbeat {
  0%, 100% { transform: scale(1); filter: drop-shadow(0 0 2px rgba(255, 140, 0, 0.5)); }
  15%, 45% { transform: scale(1.2); filter: drop-shadow(0 0 6px rgba(255, 140, 0, 0.8)); }
  30% { transform: scale(1); }
}

.animate-footer-breathe {
  animation: footer-breathe 8s ease-in-out infinite alternate;
}

.animate-footer-scroll-marquee {
  animation: footer-scroll-marquee 40s linear infinite;
}

.animate-footer-heartbeat {
  animation: footer-heartbeat 2s cubic-bezier(0.25, 1, 0.5, 1) infinite;
}

/* Theme-adaptive Grid Background with Brand Orange Lines */
.footer-bg-grid {
  background-size: 60px 60px;
  background-image: 
    linear-gradient(to right, rgba(255, 140, 0, 0.04) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(255, 140, 0, 0.04) 1px, transparent 1px);
  mask-image: linear-gradient(to bottom, transparent, black 15%, black 85%, transparent);
  -webkit-mask-image: linear-gradient(to bottom, transparent, black 15%, black 85%, transparent);
}

/* Brand Aligned Aurora Glow */
.footer-aurora {
  background: radial-gradient(
    circle at 50% 50%, 
    rgba(255, 140, 0, 0.1) 0%, 
    rgba(11, 127, 59, 0.08) 40%, 
    transparent 70%
  );
}

/* Glass Pill Theming */
.footer-glass-pill {
  background: linear-gradient(145deg, var(--pill-bg-1) 0%, var(--pill-bg-2) 100%);
  box-shadow: 
      0 6px 20px -8px var(--pill-shadow), 
      inset 0 1px 1px var(--pill-highlight), 
      inset 0 -1px 2px var(--pill-inset-shadow);
  border: 1px solid var(--pill-border);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.footer-glass-pill:hover {
  background: linear-gradient(145deg, var(--pill-bg-1-hover) 0%, var(--pill-bg-2-hover) 100%);
  border-color: var(--pill-border-hover);
  box-shadow: 
      0 12px 24px -8px var(--pill-shadow-hover), 
      inset 0 1px 1px var(--pill-highlight-hover);
  color: white;
}

/* Giant Background Text Masking */
.footer-giant-bg-text {
  font-size: 26vw;
  line-height: 0.75;
  font-weight: 900;
  letter-spacing: -0.05em;
  color: transparent;
  -webkit-text-stroke: 1px rgba(255, 255, 255, 0.04);
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.08) 0%, transparent 60%);
  -webkit-background-clip: text;
  background-clip: text;
}

/* Metallic Text Glow */
.footer-text-glow {
  background: linear-gradient(180deg, #FFFFFF 0%, rgba(255, 255, 255, 0.55) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  filter: drop-shadow(0px 0px 20px rgba(255, 255, 255, 0.1));
}

@media (min-width: 768px) {
  .curtain-wrapper {
    clip-path: polygon(0% 0, 100% 0%, 100% 100%, 0 100%);
  }
}
`;

// -------------------------------------------------------------------------
// 2. MAGNETIC BUTTON PRIMITIVE
// -------------------------------------------------------------------------
const MagneticButton = React.forwardRef(
  ({ className, children, as: Component = "button", ...props }, forwardedRef) => {
    const localRef = useRef(null);

    useEffect(() => {
      if (typeof window === "undefined") return;
      const element = localRef.current;
      if (!element) return;

      const ctx = gsap.context(() => {
        const handleMouseMove = (e) => {
          const rect = element.getBoundingClientRect();
          const h = rect.width / 2;
          const w = rect.height / 2;
          const x = e.clientX - rect.left - h;
          const y = e.clientY - rect.top - w;

          gsap.to(element, {
            x: x * 0.4,
            y: y * 0.4,
            rotationX: -y * 0.15,
            rotationY: x * 0.15,
            scale: 1.05,
            ease: "power2.out",
            duration: 0.4,
          });
        };

        const handleMouseLeave = () => {
          gsap.to(element, {
            x: 0,
            y: 0,
            rotationX: 0,
            rotationY: 0,
            scale: 1,
            ease: "elastic.out(1, 0.3)",
            duration: 1.2,
          });
        };

        element.addEventListener("mousemove", handleMouseMove);
        element.addEventListener("mouseleave", handleMouseLeave);

        return () => {
          element.removeEventListener("mousemove", handleMouseMove);
          element.removeEventListener("mouseleave", handleMouseLeave);
        };
      }, element);

      return () => ctx.revert();
    }, []);

    return (
      <Component
        ref={(node) => {
          localRef.current = node;
          if (typeof forwardedRef === "function") forwardedRef(node);
          else if (forwardedRef) forwardedRef.current = node;
        }}
        className={className}
        {...props}
      >
        {children}
      </Component>
    );
  }
);
MagneticButton.displayName = "MagneticButton";

// -------------------------------------------------------------------------
// 3. BRAND LOGO
// -------------------------------------------------------------------------
function BAIOLogo({ className = '' }) {
  return (
    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <circle cx="20" cy="20" r="17" stroke="#FF8C00" strokeWidth="2.5" />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
        const rad = (angle * Math.PI) / 180;
        const x1 = 20 + 15 * Math.cos(rad);
        const y1 = 20 + 15 * Math.sin(rad);
        const x2 = 20 + 19 * Math.cos(rad);
        const y2 = 20 + 19 * Math.sin(rad);
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#FF8C00" strokeWidth="3" strokeLinecap="round" />;
      })}
      <circle cx="20" cy="20" r="10" fill="#001F5E" />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
        const rad = (angle * Math.PI) / 180;
        const x2 = 20 + 8 * Math.cos(rad);
        const y2 = 20 + 8 * Math.sin(rad);
        return <line key={i} x1="20" y1="20" x2={x2} y2={y2} stroke="#FF8C00" strokeWidth="1.2" strokeLinecap="round" />;
      })}
      <circle cx="20" cy="20" r="2.5" fill="#FF8C00" />
    </svg>
  );
}

// -------------------------------------------------------------------------
// 4. MARQUEE CONTENT
// -------------------------------------------------------------------------
const MarqueeItem = () => (
  <div className="flex items-center space-x-12 px-6">
    <span>BHARAT AI OLYMPIAD</span> <span className="text-[#FF8C00]">✦</span>
    <span>CBSE CTAI ALIGNED</span> <span className="text-[#0B7F3B]">✦</span>
    <span>CLASSES 3 TO 8</span> <span className="text-[#FF8C00]">✦</span>
    <span>ZERO SYLLABUS BURDEN</span> <span className="text-[#0B7F3B]">✦</span>
    <span>DIAGNOSTIC READINESS REPORT</span> <span className="text-[#FF8C00]">✦</span>
  </div>
);

// -------------------------------------------------------------------------
// 5. MAIN COMPONENT
// -------------------------------------------------------------------------
export default function Footer() {
  const location = useLocation();
  const wrapperRef = useRef(null);
  const giantTextRef = useRef(null);
  const headingRef = useRef(null);
  const contentGridRef = useRef(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!wrapperRef.current) return;

    // GSAP context cleanup for React Strict Mode
    const ctx = gsap.context(() => {
      // ONLY trigger GSAP parallax effects on desktop viewports
      if (window.innerWidth < 768) return;

      // Background Parallax
      gsap.fromTo(
        giantTextRef.current,
        { y: "12vh", scale: 0.85, opacity: 0 },
        {
          y: "0vh",
          scale: 1,
          opacity: 1,
          ease: "power1.out",
          scrollTrigger: {
            trigger: wrapperRef.current,
            start: "top 80%",
            end: "bottom bottom",
            scrub: 1,
          },
        }
      );

      // Staggered Content Reveal
      gsap.fromTo(
        [headingRef.current, contentGridRef.current],
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: wrapperRef.current,
            start: "top 45%",
            end: "bottom bottom",
            scrub: 1,
          },
        }
      );
    }, wrapperRef);

    // Refresh ScrollTrigger after a short delay
    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 150);

    return () => {
      ctx.revert();
      clearTimeout(timer);
    };
  }, [location.pathname]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const ctaiAlignment = [
    { grade: 'Class 3', pct: 97 },
    { grade: 'Class 4', pct: 96 },
    { grade: 'Class 5', pct: 93 },
    { grade: 'Class 6', pct: 94 },
    { grade: 'Class 7', pct: 92 },
    { grade: 'Class 8', pct: 95 },
  ];

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />
      
      {/* 
        The "Curtain Reveal" Wrapper:
        On desktop (md+): sits in flow with clip-path and h-screen.
        On mobile: falls back to relative block layout.
      */}
      <div
        ref={wrapperRef}
        className="relative h-auto md:h-screen w-full curtain-wrapper"
      >
        {/* The actual footer stays fixed underneath on desktop, flows normally on mobile */}
        <footer className="relative md:fixed md:bottom-0 md:left-0 md:z-0 flex h-auto md:h-screen w-full flex-col justify-between overflow-hidden bg-[#001F5E] text-white cinematic-footer-wrapper pt-28 md:pt-36 pb-8">
          
          {/* Ambient Light & Grid Background */}
          <div className="footer-aurora absolute left-1/2 top-1/2 h-[60vh] w-[80vw] -translate-x-1/2 -translate-y-1/2 animate-footer-breathe rounded-[50%] blur-[80px] pointer-events-none z-0" />
          <div className="footer-bg-grid absolute inset-0 z-0 pointer-events-none" />

          {/* Giant background text */}
          <div
            ref={giantTextRef}
            className="footer-giant-bg-text absolute -bottom-[4vh] left-1/2 -translate-x-1/2 whitespace-nowrap z-0 pointer-events-none select-none hidden md:block"
          >
            BAIO
          </div>

          {/* 1. Diagonal Rotating Marquee */}
          <div className="absolute top-10 left-0 w-full overflow-hidden border-y border-white/5 bg-[#001F5E]/60 backdrop-blur-md py-3 z-10 -rotate-1 scale-105 shadow-2xl">
            <div className="flex w-max animate-footer-scroll-marquee text-[10px] md:text-xs font-bold tracking-[0.25em] text-white/50 uppercase">
              <MarqueeItem />
              <MarqueeItem />
            </div>
          </div>

          {/* 2. Main Center Content Grid */}
          <div className="relative z-10 flex flex-1 flex-col justify-center px-6 md:px-12 w-full max-w-6xl mx-auto space-y-8 mt-4 md:mt-0">
            
            <div ref={headingRef} className="text-center space-y-3">
              <h2 className="text-3xl md:text-5xl lg:text-6xl font-black footer-text-glow tracking-tighter leading-tight">
                Ready to Join India's First AI Olympiad?
              </h2>
              <p className="text-white/60 text-xs md:text-sm max-w-xl mx-auto leading-relaxed">
                Zero teacher syllabus burden · No special lab infrastructure required · Coordinator assigned in 24 hours.
              </p>
            </div>

            {/* Content Link sections & CTAs */}
            <div ref={contentGridRef} className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-4 items-start w-full text-left pt-2">
              
              {/* Col 1: CTAs & Magnetic Pills */}
              <div className="md:col-span-4 space-y-5 flex flex-col items-center md:items-start">
                <div className="flex flex-col sm:flex-row md:flex-col gap-3 w-full">
                  <MagneticButton 
                    as={Link} 
                    to="/register" 
                    className="footer-glass-pill px-6 py-4 rounded-xl text-white font-extrabold text-sm flex items-center justify-center gap-2 group cursor-pointer text-center"
                  >
                    Register Your School
                    <ExternalLink className="w-4 h-4 text-[#FF8C00] group-hover:scale-110 transition-transform" />
                  </MagneticButton>
                  
                  <MagneticButton 
                    as={Link} 
                    to="/contact" 
                    className="footer-glass-pill px-6 py-4 rounded-xl text-white/80 font-bold text-xs flex items-center justify-center gap-2 group cursor-pointer text-center"
                  >
                    Contact Support
                    <ArrowRight className="w-4 h-4 text-[#0B7F3B] group-hover:translate-x-1 transition-transform" />
                  </MagneticButton>
                </div>
                
                <div className="space-y-2 text-center md:text-left">
                  <p className="text-[10px] text-white/40 leading-relaxed">
                    Premium · Futuristic · Innovative<br />
                    Built on CBSE CTAI 2026-27 framework.
                  </p>
                  <div className="space-y-1.5 pt-1">
                    <a href="mailto:hello@baio.in" className="flex items-center justify-center md:justify-start gap-2 text-[10px] text-white/50 hover:text-white transition-colors">
                      <Mail className="w-3 h-3 text-[#FF8C00]" />
                      hello@baio.in
                    </a>
                    <a href="mailto:schools@baio.in" className="flex items-center justify-center md:justify-start gap-2 text-[10px] text-white/50 hover:text-white transition-colors">
                      <Mail className="w-3 h-3 text-[#FF8C00]" />
                      schools@baio.in
                    </a>
                    <div className="flex items-center justify-center md:justify-start gap-2 text-[10px] text-white/40">
                      <MapPin className="w-3 h-3 text-[#0B7F3B]" />
                      Delhi NCR, India
                    </div>
                  </div>
                </div>
              </div>

              {/* Col 2: Navigation Links */}
              <div className="md:col-span-2 space-y-3 text-center md:text-left">
                <h4 className="text-[9px] font-black uppercase tracking-[0.18em] text-[#FF8C00]">Navigate</h4>
                <ul className="space-y-2">
                  {[
                    { to: '/',            label: 'Home'          },
                    { to: '/about',       label: 'About BAIO'    },
                    { to: '/olympiad',    label: 'The Olympiad'  },
                    { to: '/schools',     label: 'For Schools'   },
                    { to: '/faqs',        label: 'FAQs'          },
                    { to: '/announcements', label: 'Announcements' },
                  ].map(({ to, label }) => (
                    <li key={to}>
                      <Link to={to} className="text-[11px] text-white/60 hover:text-white transition-colors font-medium">
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Col 3: Portals & Docs */}
              <div className="md:col-span-3 space-y-4 text-center md:text-left">
                <div className="space-y-2">
                  <h4 className="text-[9px] font-black uppercase tracking-[0.18em] text-[#FF8C00]">School Portal</h4>
                  <ul className="space-y-2">
                    <li>
                      <Link to="/school/login" className="text-[11px] text-white/60 hover:text-white transition-colors font-medium">
                        School Login
                      </Link>
                    </li>
                    <li>
                      <Link to="/school/dashboard" className="text-[11px] text-white/60 hover:text-white transition-colors font-medium">
                        School Dashboard
                      </Link>
                    </li>
                  </ul>
                </div>
                
                <div className="space-y-2">
                  <h4 className="text-[9px] font-black uppercase tracking-[0.18em] text-[#FF8C00]">Documents</h4>
                  <ul className="space-y-2">
                    {['Rules & Regulations', 'Syllabus PDF', 'Privacy Policy', 'Terms of Registry'].map((label) => (
                      <li key={label}>
                        <a href="#" className="text-[11px] text-white/40 hover:text-white/70 transition-colors font-medium">
                          {label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Col 4: CTAI alignment */}
              <div className="md:col-span-3 space-y-3">
                <h4 className="text-[9px] font-black uppercase tracking-[0.18em] text-center md:text-left text-[#FF8C00]">CTAI Alignment</h4>
                <div className="space-y-2">
                  {ctaiAlignment.map((row) => (
                    <div key={row.grade} className="flex items-center gap-2 text-[10px]">
                      <span className="w-12 text-white/50 text-left shrink-0">{row.grade}</span>
                      <div className="flex-1 rounded-full h-1.5 bg-white/10 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-[#0B7F3B] to-[#10a84f]"
                          style={{ width: `${row.pct}%` }}
                        />
                      </div>
                      <span className="text-right shrink-0 font-bold text-[#0B7F3B] w-7">{row.pct}%</span>
                    </div>
                  ))}
                </div>
                <div className="rounded-lg p-2.5 bg-white/5 border border-white/5 text-[9px] text-white/40 leading-normal text-center md:text-left">
                  CBSE CTAI 2026-27 · NEP 2020 · Pen-and-paper · Zero student parent fee
                </div>
              </div>

            </div>

          </div>

          {/* 3. Bottom Bar / Credits */}
          <div className="relative z-20 w-full px-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-4 border-t border-white/5 pt-6 mt-6">
            
            {/* Copyright */}
            <div className="text-white/40 text-[10px] font-bold tracking-widest uppercase order-3 md:order-1 text-center md:text-left">
              © 2026 Bharat AI Olympiad (BAIO). All rights reserved.
            </div>

            {/* "Crafted with Love" Badge */}
            <div className="footer-glass-pill px-5 py-2.5 rounded-full flex items-center gap-2 order-1 md:order-2 cursor-default border-white/5 text-[10px] font-bold uppercase tracking-widest text-white/60">
              <span>Crafted with</span>
              <span className="animate-footer-heartbeat text-xs text-[#FF8C00] select-none">❤</span>
              <span>in India for</span>
              <span className="text-white font-extrabold ml-0.5">BAIO</span>
            </div>

            {/* Back to top */}
            <div className="flex items-center gap-4 order-2 md:order-3">
              <div className="flex gap-4 text-[10px] text-white/40">
                {['Twitter / X', 'LinkedIn', 'Instagram'].map((s) => (
                  <a key={s} href="#" className="hover:text-white transition-colors">{s}</a>
                ))}
              </div>
              <MagneticButton
                onClick={scrollToTop}
                className="w-10 h-10 rounded-full footer-glass-pill flex items-center justify-center text-white/50 hover:text-white group cursor-pointer border-white/5"
              >
                <svg className="w-4 h-4 transform group-hover:-translate-y-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18"></path>
                </svg>
              </MagneticButton>
            </div>

          </div>

        </footer>
      </div>
    </>
  );
}