import React, { useEffect, useRef } from 'react';

// ─── School list ────────────────────────────────────────────────────────────
const SCHOOLS = [
  "DPS Noida",
  "Ryan International Noida",
  "Amity International Noida",
  "Lotus Valley International",
  "Shiv Nadar School",
  "GD Goenka Gurgaon",
  "Presidium Noida",
  "The Heritage School",
  "Apeejay School Noida",
  "Delhi Public School R.K. Puram",
  "Modern School Barakhamba",
  "Springdales School",
  "Step By Step School",
  "Pathways World School",
];

const SEPARATOR = "  ✦  ";

// ─── Inline keyframes injected once ─────────────────────────────────────────
const STYLE_ID = "school-marquee-keyframes";

function injectKeyframes() {
  if (document.getElementById(STYLE_ID)) return;
  const style = document.createElement("style");
  style.id = STYLE_ID;
  style.textContent = `
    @keyframes school-marquee-scroll {
      from { transform: translateX(0); }
      to   { transform: translateX(-50%); }
    }
  `;
  document.head.appendChild(style);
}

// ─── Component ───────────────────────────────────────────────────────────────
export default function SchoolMarquee({
  fontSize = 22,
  color = "#001F5E",
  background = "#FAF9F6",
  fadeColor = "#FAF9F6",
  rotateY = -22,
  rotateX = 6,
  perspective = 1100,
  speed = 28,          // seconds for one full loop
}) {
  const trackRef = useRef(null);

  useEffect(() => {
    injectKeyframes();
  }, []);

  // Build the full text string once (repeated × 2 so the loop is seamless)
  const text = SCHOOLS.map(s => `${s}${SEPARATOR}`).join('');
  const doubleText = text + text;

  const itemPadding = fontSize * 0.9;

  return (
    <section
      aria-label="Partner Schools"
      style={{
        width: "100%",
        background,
        padding: "56px 0",
        overflow: "hidden",
        perspective: `${perspective}px`,
        position: "relative",
      }}
    >
      {/* ── Heading ── */}
      <div style={{ textAlign: "center", marginBottom: 32, position: "relative", zIndex: 2 }}>
        <span
          style={{
            display: "inline-block",
            background: "#001F5E",
            color: "#FAF9F6",
            fontWeight: 800,
            fontSize: 10,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            padding: "6px 18px",
            borderRadius: 999,
          }}
        >
          Partner Schools
        </span>
        <h2
          style={{
            margin: "14px 0 0",
            fontSize: "clamp(20px, 3vw, 30px)",
            fontWeight: 900,
            color: "#001F5E",
            letterSpacing: "-0.02em",
            lineHeight: 1.15,
          }}
        >
          Trusted by India's{" "}
          <span style={{ color: "#FF8C00" }}>leading schools</span>
        </h2>
        <p
          style={{
            marginTop: 8,
            fontSize: 13,
            color: "#64748b",
            fontWeight: 600,
          }}
        >
          100+ partner schools across Delhi NCR and growing
        </p>
      </div>

      {/* ── 3-D perspective track ── */}
      <div
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-start",
          transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
          transformStyle: "preserve-3d",
          position: "relative",
          zIndex: 1,
        }}
      >
        <div
          ref={trackRef}
          style={{
            display: "flex",
            whiteSpace: "nowrap",
            animation: `school-marquee-scroll ${speed}s linear infinite`,
            willChange: "transform",
          }}
        >
          {/* Render the double string as individual school spans */}
          {[...SCHOOLS, ...SCHOOLS, ...SCHOOLS, ...SCHOOLS].map((school, i) => (
            <React.Fragment key={i}>
              <span
                style={{
                  display: "inline-block",
                  fontFamily:
                    "var(--font-geist-sans), Inter, -apple-system, BlinkMacSystemFont, sans-serif",
                  fontSize,
                  fontWeight: 800,
                  color,
                  letterSpacing: "-0.02em",
                  paddingRight: itemPadding,
                  userSelect: "none",
                }}
              >
                {school}
              </span>
              <span
                style={{
                  display: "inline-block",
                  fontSize,
                  fontWeight: 800,
                  color: "#FF8C00",
                  paddingRight: itemPadding,
                  userSelect: "none",
                }}
              >
                ✦
              </span>
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* ── Left / Right fade overlays ── */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          background: `linear-gradient(90deg, ${fadeColor} 0%, transparent 16%, transparent 84%, ${fadeColor} 100%)`,
          zIndex: 3,
        }}
      />
      {/* ── Top / Bottom fade overlays ── */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          background: `linear-gradient(180deg, ${fadeColor} 0%, transparent 22%, transparent 78%, ${fadeColor} 100%)`,
          zIndex: 3,
        }}
      />
    </section>
  );
}
