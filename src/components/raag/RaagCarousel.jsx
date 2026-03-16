import { useState, useEffect, useCallback } from "react";
import raagData from "./raagData";

const SLIVERS = [42, 32, 24, 17, 12, 8, 5]; // visible width per peek level
const OVERLAP = 18; // how far slivers overlap the main card's right edge

//Helpers
const GK = ["੦", "੧", "੨", "੩", "੪", "੫", "੬", "੭", "੮", "੯"];
const toGurmukhi = (n) => String(n).split("").map((c) => GK[+c] ?? c).join("");
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

// Left offset (from the RIGHT edge of the deck stage) for each sliver level
function sliverLeft(level) {
  let x = -OVERLAP;
  for (let i = 0; i < level - 1; i++) x += SLIVERS[i];
  return x;
}

//Main 
export default function RaagCarousel({ onNavigate }) {
  const [active, setActive] = useState(0);
  const [enterDir, setEnterDir] = useState(null); // "left"|"right" → drives enter anim
  const n = raagData.length;

  // Swap index immediately — no waiting for an exit animation
  const go = useCallback((delta) => {
    const next = clamp(active + delta, 0, n - 1);
    if (next === active) return;
    setEnterDir(delta > 0 ? "left" : "right");
    setActive(next);
    setTimeout(() => setEnterDir(null), 300);
  }, [active, n]);

  // Keyboard
  useEffect(() => {
    const h = (e) => {
      if (e.key === "ArrowLeft") { e.preventDefault(); go(-1); }
      if (e.key === "ArrowRight") { e.preventDefault(); go(1); }
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [go]);

  // Card tap → navigate
  function handleTap() {
    if (!onNavigate) return;
    const r = raagData[active];
    if (r.hasSections && r.slug)
      onNavigate(`/pages/sections.html?raag=${encodeURIComponent(r.slug)}`);
    else
      onNavigate(`/reader.html?ang=${encodeURIComponent(r.ang)}`);
  }

  const peekCount = Math.min(SLIVERS.length, n - 1 - active);
  const atStart = active === 0;
  const atEnd = active === n - 1;

  // Which CSS animation should the active card play on enter?
  const enterAnim = enterDir === "left"
    ? "card-enter-left 0.28s cubic-bezier(0.22,1,0.36,1) forwards"
    : enterDir === "right"
      ? "card-enter-right 0.28s cubic-bezier(0.22,1,0.36,1) forwards"
      : "raag-float 5.5s ease-in-out infinite";

  return (
    <div
      className="relative w-full flex items-center justify-center select-none"
      style={{ height: "clamp(360px, 60vh, 660px)" }}
    >
      {/*  Deck stage  */}
      <div
        className="relative"
        style={{
          width: "min(52vw, 460px)",
          height: "min(60vh, 540px)",
        }}
      >

        {/*  Peek slivers (behind the active card)  */}
        {Array.from({ length: peekCount }).map((_, i) => {
          const level = i + 1;
          const leftPx = sliverLeft(level);
          const width = SLIVERS[i];
          const peekRaag = raagData[clamp(active + level, 0, n - 1)];
          const opacity = Math.max(0.45, 1 - level * 0.1);
          const radius = Math.max(8, 28 - level * 3);

          return (
            <div
              key={`sliver-${level}`}
              className="absolute top-0 overflow-hidden"
              style={{
                left: `calc(100% + ${leftPx}px)`,
                width,
                height: "100%",
                zIndex: 10 - level,
                borderRadius: `0 ${radius}px ${radius}px 0`,
                opacity,
                transition: "opacity 0.2s ease",
              }}
            >
              {/* Full-width card anchored right — clipped to sliver width */}
              <div
                className="absolute top-0 right-0"
                style={{ width: "min(52vw, 460px)", height: "100%" }}
              >
                <CardFace raag={peekRaag} isActive={false} />
              </div>
            </div>
          );
        })}

        {/*  Active card — no exit, just enter */}
        <div
          key={active}              // key change re-mounts → triggers enter animation
          className="absolute inset-0 cursor-pointer"
          onClick={handleTap}
          style={{
            zIndex: 20,
            animation: enterAnim,
          }}
        >
          <CardFace raag={raagData[active]} isActive />
        </div>

      </div>

      {/* ── Arrows ── */}
      <NavBtn dir="prev" disabled={atStart} onClick={() => go(-1)} />
      <NavBtn dir="next" disabled={atEnd} onClick={() => go(1)} />

      {/* ── Dots ── */}
      <Dots
        active={active}
        total={n}
        onChange={(i) => go(i - active)}
      />

      {/* ── Keyframes ── */}
      <style>{`
        /* Enter from right (next) — slides in from slight right + fades */
        @keyframes card-enter-left {
          from { opacity: 0.4; transform: translateX(22px) scale(0.97); }
          to   { opacity: 1;   transform: translateX(0)    scale(1);    }
        }
        /* Enter from left (prev) */
        @keyframes card-enter-right {
          from { opacity: 0.4; transform: translateX(-22px) scale(0.97); }
          to   { opacity: 1;   transform: translateX(0)     scale(1);    }
        }
        /* Idle float */
        @keyframes raag-float {
          0%, 100% { transform: translateY(0px);  }
          50%       { transform: translateY(-9px); }
        }
        @media (prefers-reduced-motion: reduce) {
          * { animation: none !important; transition: none !important; }
        }
      `}</style>
    </div>
  );
}

// Card face 
function CardFace({ raag, isActive }) {
  return (
    <div
      className="relative w-full h-full overflow-hidden"
      style={{
        borderRadius: 28,
        background: [
          "linear-gradient(155deg,",
          "  #0b0d1a 0%, #101426 35%,",
          "  #0d1220 65%, #090c18 100%)",
        ].join(""),
        border: "1px solid rgba(255,255,255,0.11)",
        filter: isActive
          ? "drop-shadow(0 28px 60px rgba(0,0,0,0.75)) drop-shadow(0 4px 10px rgba(0,0,0,0.5))"
          : undefined,
      }}
    >
      {/* Top-edge gloss */}
      <div
        className="absolute top-0 left-0 right-0 pointer-events-none"
        style={{
          height: "42%",
          borderRadius: "28px 28px 0 0",
          background: "linear-gradient(180deg, rgba(255,255,255,0.07) 0%, transparent 100%)",
        }}
      />

      {/* Ambient indigo glow */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: "70%", height: "50%",
          top: "25%", left: "15%",
          background: "radial-gradient(ellipse, rgba(109,99,255,0.13) 0%, transparent 75%)",
          filter: "blur(28px)",
        }}
      />

      {/* Right-edge spine — visible as the sliver highlight */}
      <div
        className="absolute top-4 right-0 bottom-4 pointer-events-none"
        style={{
          width: 2,
          background: "rgba(255,255,255,0.22)",
        }}
      />

      {/* Content (active card only) */}
      {isActive && (
        <div className="relative z-10 flex flex-col items-center justify-center h-full gap-5 px-10">
          <h2
            style={{
              fontFamily: "'Noto Sans Gurmukhi','Gurmukhi MN','Kohinoor Gurmukhi',sans-serif",
              fontSize: "clamp(1.9rem, 5vw, 3.2rem)",
              fontWeight: 600,
              color: "#ffffff",
              textAlign: "center",
              lineHeight: 1.25,
              letterSpacing: "-0.01em",
              textShadow: "0 1px 12px rgba(109,99,255,0.25)",
            }}
          >
            {raag.name}
          </h2>

          {/* Ang pill */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              background: "rgba(255,255,255,0.09)",
              border: "1px solid rgba(255,255,255,0.15)",
              borderRadius: 999,
              padding: "7px 22px",
              backdropFilter: "blur(8px)",
              WebkitBackdropFilter: "blur(8px)",
            }}
          >
            <span
              style={{
                fontFamily: "'Noto Sans Gurmukhi','Gurmukhi MN',sans-serif",
                fontSize: "clamp(0.85rem, 2vw, 1.05rem)",
                color: "rgba(255,255,255,0.65)",
              }}
            >
              ਅੰਗ {toGurmukhi(raag.ang)}
            </span>
          </div>

          {/* Tap hint */}
          <span
            className="absolute bottom-6"
            style={{
              fontFamily: "system-ui,-apple-system,sans-serif",
              fontSize: 10,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.18)",
            }}
          >
            tap to open
          </span>
        </div>
      )}
    </div>
  );
}

//Arrow button
function NavBtn({ dir, disabled, onClick }) {
  const isPrev = dir === "prev";
  return (
    <button
      aria-label={isPrev ? "Previous" : "Next"}
      disabled={disabled}
      onClick={onClick}
      style={{
        position: "absolute",
        top: "50%",
        transform: "translateY(-50%)",
        [isPrev ? "left" : "right"]: "clamp(12px, 3vw, 28px)",
        zIndex: 300,
        width: 44,
        height: 44,
        borderRadius: 14,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(255,255,255,0.08)",
        border: "1px solid rgba(255,255,255,0.14)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        color: "rgba(255,255,255,0.75)",
        fontSize: 22,
        fontWeight: 300,
        cursor: disabled ? "default" : "pointer",
        opacity: disabled ? 0.2 : 1,
        pointerEvents: disabled ? "none" : "auto",
        transition: "background 0.15s, opacity 0.15s",
        userSelect: "none",
      }}
      onMouseEnter={(e) => { if (!disabled) e.currentTarget.style.background = "rgba(255,255,255,0.16)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.08)"; }}
    >
      {isPrev ? "‹" : "›"}
    </button>
  );
}

// Progress dots 
function Dots({ active, total, onChange }) {
  const visible = 9;
  const half = Math.floor(visible / 2);
  const start = clamp(active - half, 0, Math.max(0, total - visible));

  return (
    <div
      style={{
        position: "absolute",
        bottom: 12,
        left: "50%",
        transform: "translateX(-50%)",
        display: "flex",
        alignItems: "center",
        gap: 6,
        zIndex: 300,
      }}
    >
      {Array.from({ length: Math.min(total, visible) }).map((_, i) => {
        const idx = start + i;
        if (idx >= total) return null;
        const isActive = idx === active;
        return (
          <button
            key={idx}
            onClick={() => onChange(idx)}
            style={{
              width: isActive ? 18 : 6,
              height: 6,
              borderRadius: 999,
              background: isActive ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0.28)",
              border: "none",
              padding: 0,
              cursor: "pointer",
              transition: "width 0.25s cubic-bezier(0.4,0,0.2,1), background 0.2s",
            }}
          />
        );
      })}
    </div>
  );
}