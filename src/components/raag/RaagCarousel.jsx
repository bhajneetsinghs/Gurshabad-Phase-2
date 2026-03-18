import { useState, useEffect, useCallback, useRef } from "react";
import raagData from "./raagData";

const SLIVERS = [42, 32, 24, 17, 12, 8, 5];
const OVERLAP = 18;
const GK = ["੦","੧","੨","੩","੪","੫","੬","੭","੮","੯"];
const toGurmukhi = (n) => String(n).split("").map((c) => GK[+c] ?? c).join("");
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

function sliverLeft(level) {
  let x = -OVERLAP;
  for (let i = 0; i < level - 1; i++) x += SLIVERS[i];
  return x;
}

export default function RaagCarousel({ onNavigate }) {
  // Two persistent card slots — A is always rendered, B is always rendered
  // We swap which one shows which raag and animate via CSS transforms
  const [slotA,   setSlotA]   = useState(0); // raag index in slot A
  const [slotB,   setSlotB]   = useState(1); // raag index in slot B
  const [front,   setFront]   = useState("a"); // which slot is visible
  const [active,  setActive]  = useState(0);

  // Transform state for each slot — controlled entirely via inline style
  const [styleA,  setStyleA]  = useState({ x: 0, opacity: 1, rot: 0, scale: 1 });
  const [styleB,  setStyleB]  = useState({ x: 0, opacity: 0, rot: 0, scale: 1 });
  const [transA,  setTransA]  = useState("none");
  const [transB,  setTransB]  = useState("none");

  const animating   = useRef(false);
  const dragging    = useRef(false);
  const startX      = useRef(0);
  const lastX       = useRef(0);
  const lastTime    = useRef(0);
  const velRef      = useRef(0);
  const dragRef     = useRef(0);
  const rafId       = useRef(null);
  const stageRef    = useRef(null);
  const n = raagData.length;

  const SPRING  = "transform 0.48s cubic-bezier(0.34,1.3,0.64,1), opacity 0.35s ease";
  const FLYOUT  = "transform 0.32s cubic-bezier(0.55,0,0.8,1), opacity 0.26s ease";
  const INSTANT = "none";

  // commit: dir = 1 (swipe left → next) or -1 (swipe right → prev)
  const commit = useCallback((dir) => {
    const next = clamp(active + dir, 0, n - 1);
    if (next === active) {
      // spring back to center
      if (front === "a") {
        setTransA(SPRING); setStyleA({ x: 0, opacity: 1, rot: 0, scale: 1 });
      } else {
        setTransB(SPRING); setStyleB({ x: 0, opacity: 1, rot: 0, scale: 1 });
      }
      animating.current = false;
      return;
    }

    animating.current = true;
    const W = stageRef.current?.offsetWidth ?? 460;
    const outX  = dir > 0 ? -W * 1.3 : W * 1.3;
    const outRot = dir > 0 ? -14 : 14;
    const inX   = dir > 0 ? W * 0.9 : -W * 0.9;

    if (front === "a") {
      // A flies out, B comes in
      // 1. Pre-position B instantly (no transition)
      setTransB(INSTANT);
      setStyleB({ x: inX, opacity: 0, rot: outRot * -0.4, scale: 0.94 });
      setSlotB(next);

      requestAnimationFrame(() => requestAnimationFrame(() => {
        // 2. Fly A out
        setTransA(FLYOUT);
        setStyleA({ x: outX, opacity: 0, rot: outRot, scale: 0.88 });
        // 3. Slide B in with spring
        setTransB(SPRING);
        setStyleB({ x: 0, opacity: 1, rot: 0, scale: 1 });
        setFront("b");
        setActive(next);

        setTimeout(() => { animating.current = false; }, 480);
      }));
    } else {
      // B flies out, A comes in
      setTransA(INSTANT);
      setStyleA({ x: inX, opacity: 0, rot: outRot * -0.4, scale: 0.94 });
      setSlotA(next);

      requestAnimationFrame(() => requestAnimationFrame(() => {
        setTransB(FLYOUT);
        setStyleB({ x: outX, opacity: 0, rot: outRot, scale: 0.88 });
        setTransA(SPRING);
        setStyleA({ x: 0, opacity: 1, rot: 0, scale: 1 });
        setFront("a");
        setActive(next);

        setTimeout(() => { animating.current = false; }, 480);
      }));
    }
  }, [active, front, n]);

  // Pointer events
  const onPointerDown = useCallback((e) => {
    if (animating.current) return;
    dragging.current  = true;
    startX.current    = e.clientX;
    lastX.current     = e.clientX;
    lastTime.current  = Date.now();
    velRef.current    = 0;
    dragRef.current   = 0;
    e.currentTarget.setPointerCapture?.(e.pointerId);

    // freeze float animation while dragging
    if (front === "a") { setTransA(INSTANT); }
    else               { setTransB(INSTANT); }
  }, [front]);

  const onPointerMove = useCallback((e) => {
    if (!dragging.current) return;
    const now = Date.now();
    const dt  = now - lastTime.current || 1;
    velRef.current   = (e.clientX - lastX.current) / dt;
    lastX.current    = e.clientX;
    lastTime.current = now;

    const raw = e.clientX - startX.current;
    const W   = stageRef.current?.offsetWidth ?? 460;
    // rubber band at edges
    const atEdge = (active === 0 && raw > 0) || (active === n - 1 && raw < 0);
    const dx = atEdge ? raw * 0.22 : raw;
    dragRef.current = dx;

    const progress = dx / W;
    const rot   = progress * 10;
    const lift  = Math.abs(progress) * -10;
    const sc    = 1 + Math.abs(progress) * 0.012;

    if (rafId.current) cancelAnimationFrame(rafId.current);
    rafId.current = requestAnimationFrame(() => {
      if (front === "a") setStyleA({ x: dx, opacity: 1, rot, scale: sc });
      else               setStyleB({ x: dx, opacity: 1, rot, scale: sc });
    });
  }, [active, front, n]);

  const onPointerUp = useCallback(() => {
    if (!dragging.current) return;
    dragging.current = false;
    if (rafId.current) cancelAnimationFrame(rafId.current);

    const dx  = dragRef.current;
    const vel = velRef.current;
    const W   = stageRef.current?.offsetWidth ?? 460;

    if (dx < -W * 0.25 || vel < -0.45) commit(1);
    else if (dx > W * 0.25 || vel > 0.45) commit(-1);
    else commit(0); // spring back
  }, [commit]);

  // Keyboard
  useEffect(() => {
    const h = (e) => {
      if (e.key === "ArrowLeft"  && !animating.current) { e.preventDefault(); commit(-1); }
      if (e.key === "ArrowRight" && !animating.current) { e.preventDefault(); commit(1);  }
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [commit]);

  function handleTap() {
    if (Math.abs(dragRef.current) > 8) return;
    if (!onNavigate) return;
    const r = raagData[active];
    if (r.hasSections && r.slug)
      onNavigate(`/pages/sections.html?raag=${encodeURIComponent(r.slug)}`);
    else
      onNavigate(`/reader.html?ang=${encodeURIComponent(r.ang)}`);
  }

  const peekCount = Math.min(SLIVERS.length, n - 1 - active);

  function slotStyle(s, trans) {
    return {
      position: "absolute", inset: 0,
      transform: `translateX(${s.x}px) translateY(${(Math.abs(s.x) / 460) * -10}px) rotate(${s.rot}deg) scale(${s.scale})`,
      opacity: s.opacity,
      transition: trans,
      willChange: "transform, opacity",
    };
  }

  return (
    <div
      className="relative w-full flex items-center justify-center select-none"
      style={{ height: "clamp(360px, 60vh, 660px)" }}
    >
      <div
        ref={stageRef}
        className="relative"
        style={{ width: "min(52vw, 460px)", height: "min(60vh, 540px)", touchAction: "none" }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        {/* Slivers — untouched */}
        {Array.from({ length: peekCount }).map((_, i) => {
          const level    = i + 1;
          const leftPx   = sliverLeft(level);
          const width    = SLIVERS[i];
          const peekRaag = raagData[clamp(active + level, 0, n - 1)];
          const opacity  = Math.max(0.45, 1 - level * 0.1);
          const radius   = Math.max(8, 28 - level * 3);
          return (
            <div
              key={`sliver-${level}`}
              className="absolute top-0 overflow-hidden"
              style={{
                left: `calc(100% + ${leftPx}px)`,
                width, height: "100%",
                zIndex: 10 - level,
                borderRadius: `0 ${radius}px ${radius}px 0`,
                opacity,
                transition: "opacity 0.3s ease",
                pointerEvents: "none",
              }}
            >
              <div className="absolute top-0 right-0"
                style={{ width: "min(52vw, 460px)", height: "100%" }}>
                <CardFace raag={peekRaag} isActive={false} />
              </div>
            </div>
          );
        })}

        {/* Slot B — back */}
        <div style={{ ...slotStyle(styleB, transB), zIndex: front === "b" ? 20 : 15 }}>
          <div className="absolute inset-0" onClick={front === "b" ? handleTap : undefined}
            style={{ cursor: front === "b" ? "grab" : "default" }}>
            <CardFace raag={raagData[slotB]} isActive={front === "b"} />
          </div>
        </div>

        {/* Slot A — front */}
        <div style={{ ...slotStyle(styleA, transA), zIndex: front === "a" ? 20 : 15 }}>
          <div className="absolute inset-0" onClick={front === "a" ? handleTap : undefined}
            style={{ cursor: front === "a" ? "grab" : "default" }}>
            <CardFace raag={raagData[slotA]} isActive={front === "a"} />
          </div>
        </div>
      </div>

      <NavBtn dir="prev" disabled={active === 0}     onClick={() => { if (!animating.current) commit(-1); }} />
      <NavBtn dir="next" disabled={active === n - 1} onClick={() => { if (!animating.current) commit(1);  }} />
      <Dots active={active} total={n} onChange={(i) => { if (!animating.current) commit(i - active); }} />

      <style>{`
        @media (prefers-reduced-motion: reduce) {
          * { animation: none !important; transition: none !important; }
        }
      `}</style>
    </div>
  );
}

function CardFace({ raag, isActive }) {
  return (
    <div className="relative w-full h-full overflow-hidden"
      style={{
        borderRadius: 28,
        // Apple liquid glass: barely-there tint, background dominates
        background: isActive
          ? `linear-gradient(145deg,
              rgba(180,190,220,0.18) 0%,
              rgba(160,175,210,0.08) 35%,
              rgba(140,160,200,0.04) 65%,
              rgba(160,175,215,0.10) 100%)`
          : `linear-gradient(145deg,
              #0e1520 0%,
              #0a1018 55%,
              #070c14 100%)`,
        // Heavy blur + saturation = background tints the glass
        backdropFilter: isActive
          ? "blur(80px) saturate(380%) brightness(1.08) hue-rotate(2deg)"
          : "none",
        WebkitBackdropFilter: isActive
          ? "blur(80px) saturate(380%) brightness(1.08) hue-rotate(2deg)"
          : "none",
        border: isActive
          ? "1px solid rgba(200,215,255,0.22)"
          : "1px solid rgba(255,255,255,0.06)",
        boxShadow: isActive ? [
          "0 40px 100px rgba(0,0,0,0.55)",
          "0 12px 32px rgba(0,0,0,0.35)",
          // Soft top highlight — not harsh white, slightly blue-tinted
          "inset 0 1.5px 0 rgba(210,225,255,0.45)",
          "inset 0 -1px 0 rgba(0,0,0,0.12)",
          "inset 1.5px 0 0 rgba(200,218,255,0.20)",
          "inset -1px 0 0 rgba(200,218,255,0.06)",
        ].join(",") : [
          "0 12px 40px rgba(0,0,0,0.55)",
          "inset 0 1px 0 rgba(255,255,255,0.06)",
        ].join(","),
      }}
    >
      {isActive && <>
        {/* Subtle top-left diagonal sheen — Apple's signature */}
        <div className="absolute inset-0 pointer-events-none" style={{
          borderRadius: 28,
          background: `linear-gradient(145deg,
            rgba(210,225,255,0.14) 0%,
            rgba(190,210,255,0.06) 22%,
            transparent 45%,
            rgba(140,160,220,0.03) 75%,
            rgba(160,180,240,0.05) 100%)`,
        }} />

        {/* Top edge — very soft blue-white, not harsh */}
        <div className="absolute pointer-events-none" style={{
          top: 0, left: "8%", right: "8%", height: 1,
          background: "linear-gradient(90deg, transparent, rgba(210,228,255,0.55) 30%, rgba(210,228,255,0.55) 70%, transparent)",
        }} />

        {/* Left edge — soft tinted refraction */}
        <div className="absolute pointer-events-none" style={{
          top: "8%", left: 0, bottom: "8%", width: 1.5,
          background: "linear-gradient(180deg, transparent 0%, rgba(200,220,255,0.35) 25%, rgba(200,220,255,0.22) 65%, transparent 100%)",
        }} />

        {/* Inner light — picks up background colors through the glass */}
        <div className="absolute pointer-events-none" style={{
          top: "6%", left: "6%", width: "58%", height: "45%",
          background: "radial-gradient(ellipse at 35% 35%, rgba(180,200,255,0.10) 0%, transparent 68%)",
          filter: "blur(24px)",
        }} />

        {/* Ambient glow — indigo, your original */}
        <div className="absolute pointer-events-none" style={{
          width: "70%", height: "52%", top: "26%", left: "14%",
          background: "radial-gradient(ellipse, rgba(109,99,255,0.14) 0%, transparent 72%)",
          filter: "blur(38px)",
        }} />

        {/* Bottom vignette */}
        <div className="absolute pointer-events-none" style={{
          bottom: 0, left: 0, right: 0, height: "30%",
          borderRadius: "0 0 28px 28px",
          background: "linear-gradient(0deg, rgba(0,0,0,0.28) 0%, transparent 100%)",
        }} />
      </>}

      {/* Back cards — opaque dark, zero glass */}
      {!isActive && (
        <div className="absolute top-0 left-0 right-0 pointer-events-none" style={{
          height: "28%", borderRadius: "28px 28px 0 0",
          background: "linear-gradient(180deg, rgba(255,255,255,0.03) 0%, transparent 100%)",
        }} />
      )}

      {isActive && (
        <div className="relative z-10 flex flex-col items-center justify-center h-full gap-5 px-10">
          <h2 style={{
            fontFamily: "'Noto Sans Gurmukhi','Gurmukhi MN','Kohinoor Gurmukhi',sans-serif",
            fontSize: "clamp(1.9rem, 5vw, 3.2rem)",
            fontWeight: 600, color: "#ffffff",
            textAlign: "center", lineHeight: 1.25,
            letterSpacing: "-0.01em",
            textShadow: "0 1px 20px rgba(180,200,255,0.18), 0 2px 6px rgba(0,0,0,0.65)",
          }}>
            {raag.name}
          </h2>

          {/* Ang pill — liquid glass, tinted not white */}
          <div style={{
            display: "flex", alignItems: "center",
            background: "rgba(180,200,255,0.08)",
            border: "1px solid rgba(200,220,255,0.22)",
            borderRadius: 999, padding: "7px 22px",
            backdropFilter: "blur(40px) saturate(300%)",
            WebkitBackdropFilter: "blur(40px) saturate(300%)",
            boxShadow: [
              "inset 0 1.5px 0 rgba(210,228,255,0.35)",
              "inset 0 -1px 0 rgba(0,0,0,0.10)",
              "0 2px 12px rgba(0,0,0,0.18)",
            ].join(","),
          }}>
            <span style={{
              fontFamily: "'Noto Sans Gurmukhi','Gurmukhi MN',sans-serif",
              fontSize: "clamp(0.85rem, 2vw, 1.05rem)",
              color: "rgba(230,238,255,0.85)",
            }}>
              ਅੰਗ {toGurmukhi(raag.ang)}
            </span>
          </div>

          <span className="absolute bottom-6" style={{
            fontFamily: "system-ui,-apple-system,sans-serif",
            fontSize: 10, letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "rgba(200,215,255,0.22)",
          }}>
            tap to open
          </span>
        </div>
      )}
    </div>
  );
}

function NavBtn({ dir, disabled, onClick }) {
  const isPrev = dir === "prev";
  return (
    <button
      aria-label={isPrev ? "Previous" : "Next"}
      disabled={disabled} onClick={onClick}
      style={{
        position: "absolute", top: "50%",
        transform: "translateY(-50%)",
        [isPrev ? "left" : "right"]: "clamp(12px, 3vw, 28px)",
        zIndex: 300, width: 44, height: 44, borderRadius: 14,
        display: "flex", alignItems: "center", justifyContent: "center",
        background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.14)",
        backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)",
        color: "rgba(255,255,255,0.75)", fontSize: 22, fontWeight: 300,
        cursor: disabled ? "default" : "pointer",
        opacity: disabled ? 0.2 : 1,
        pointerEvents: disabled ? "none" : "auto",
        transition: "background 0.15s, opacity 0.15s", userSelect: "none",
      }}
      onMouseEnter={(e) => { if (!disabled) e.currentTarget.style.background = "rgba(255,255,255,0.16)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.08)"; }}
    >
      {isPrev ? "‹" : "›"}
    </button>
  );
}

function Dots({ active, total, onChange }) {
  const visible = 9;
  const half    = Math.floor(visible / 2);
  const start   = clamp(active - half, 0, Math.max(0, total - visible));
  return (
    <div style={{
      position: "absolute", bottom: 12, left: "50%",
      transform: "translateX(-50%)",
      display: "flex", alignItems: "center", gap: 6, zIndex: 300,
    }}>
      {Array.from({ length: Math.min(total, visible) }).map((_, i) => {
        const idx = start + i;
        if (idx >= total) return null;
        const isActive = idx === active;
        return (
          <button key={idx} onClick={() => onChange(idx)} style={{
            width: isActive ? 18 : 6, height: 6, borderRadius: 999,
            background: isActive ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0.28)",
            border: "none", padding: 0, cursor: "pointer",
            transition: "width 0.25s cubic-bezier(0.4,0,0.2,1), background 0.2s",
          }} />
        );
      })}
    </div>
  );
}