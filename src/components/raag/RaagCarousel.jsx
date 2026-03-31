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

// Easing & Durations
const EASE_SPRING = "cubic-bezier(0.22, 1.0, 0.36, 1)";
const EASE_OUT    = "cubic-bezier(0.4, 0, 0.6, 1)";
const DUR_IN      = 480;
const DUR_OUT     = 300;

// Quick durations for smooth continuous hold
const QUICK_DUR_OUT = 240;
const QUICK_DUR_IN  = 260;

export default function RaagCarousel({ onNavigate }) {
  const n = raagData.length;

  const [slotA, setSlotA] = useState(0);
  const [slotB, setSlotB] = useState(1);
  const [front, setFront] = useState("a");
  const [active, setActive] = useState(0);

  const [styA, setStyA] = useState({ x: 0, rot: 0, scale: 1, opacity: 1 });
  const [styB, setStyB] = useState({ x: 0, rot: 0, scale: 1, opacity: 0 });
  const [trA, setTrA] = useState("none");
  const [trB, setTrB] = useState("none");

  const animating = useRef(false);
  const activeRef = useRef(0);
  const frontRef = useRef("a");
  const stageRef = useRef(null);

  // Drag state
  const dragging = useRef(false);
  const startX = useRef(0);
  const startY = useRef(0);
  const lastX = useRef(0);
  const lastT = useRef(0);
  const velRef = useRef(0);
  const dragDx = useRef(0);
  const rafId = useRef(null);

  // Hold support for keyboard + mouse buttons
  const holdIntervalRef = useRef(null);
  const holdDirectionRef = useRef(0);

  useEffect(() => { activeRef.current = active; }, [active]);
  useEffect(() => { frontRef.current = front; }, [front]);

  const navigate = useCallback((idx) => {
    if (!onNavigate) return;
    const r = raagData[idx];
    if (r.hasSections && r.slug) onNavigate(`?raag=${encodeURIComponent(r.slug)}`);
    else onNavigate(`?ang=${encodeURIComponent(r.ang)}`);
  }, [onNavigate]);

  // Updated commit with isHold parameter for faster animation during hold
  const commit = useCallback((dir, isHold = false) => {
    if (animating.current) return;

    const cur = activeRef.current;
    const next = clamp(cur + dir, 0, n - 1);

    if (next === cur) {
      const reset = { x: 0, rot: 0, scale: 1, opacity: 1 };
      const tr = `transform ${DUR_IN}ms ${EASE_SPRING}, opacity ${DUR_IN}ms ease`;
      if (frontRef.current === "a") { setTrA(tr); setStyA(reset); }
      else { setTrB(tr); setStyB(reset); }
      return;
    }

    animating.current = true;

    const W = stageRef.current?.offsetWidth ?? 460;
    const outX = dir > 0 ? -W * 1.35 : W * 1.35;
    const inX = dir > 0 ? W * 1.0 : -W * 1.0;
    const outRot = dir > 0 ? -12 : 12;

    const durOut = isHold ? QUICK_DUR_OUT : DUR_OUT;
    const durIn = isHold ? QUICK_DUR_IN : DUR_IN;

    if (frontRef.current === "a") {
      setTrB("none");
      setStyB({ x: inX, rot: outRot * -0.3, scale: 0.94, opacity: 0 });
      setSlotB(next);

      requestAnimationFrame(() => {
        setTrA(`transform ${durOut}ms ${EASE_OUT}, opacity ${durOut}ms ease`);
        setStyA({ x: outX, rot: outRot, scale: 0.88, opacity: 0 });

        setTrB(`transform ${durIn}ms ${EASE_SPRING}, opacity ${durIn * 0.7}ms ease`);
        setStyB({ x: 0, rot: 0, scale: 1, opacity: 1 });

        setFront("b");
        setActive(next);
        setTimeout(() => { animating.current = false; }, durIn + 30);
      });
    } else {
      setTrA("none");
      setStyA({ x: inX, rot: outRot * -0.3, scale: 0.94, opacity: 0 });
      setSlotA(next);

      requestAnimationFrame(() => {
        setTrB(`transform ${durOut}ms ${EASE_OUT}, opacity ${durOut}ms ease`);
        setStyB({ x: outX, rot: outRot, scale: 0.88, opacity: 0 });

        setTrA(`transform ${durIn}ms ${EASE_SPRING}, opacity ${durIn * 0.7}ms ease`);
        setStyA({ x: 0, rot: 0, scale: 1, opacity: 1 });

        setFront("a");
        setActive(next);
        setTimeout(() => { animating.current = false; }, durIn + 30);
      });
    }
  }, [n]);

  // Keyboard hold support
  useEffect(() => {
    const onKeyDown = (e) => {
      if (animating.current || dragging.current) return;
      let dir = 0;
      if (e.key === "ArrowLeft") dir = -1;
      if (e.key === "ArrowRight") dir = 1;
      if (dir === 0) return;

      e.preventDefault();

      if (holdIntervalRef.current) clearInterval(holdIntervalRef.current);

      holdDirectionRef.current = dir;
      commit(dir, false);

      holdIntervalRef.current = setTimeout(() => {
        holdIntervalRef.current = setInterval(() => {
          if (!animating.current) commit(holdDirectionRef.current, true);
        }, 240);
      }, 380);
    };

    const onKeyUp = (e) => {
      if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
        if (holdIntervalRef.current) {
          clearInterval(holdIntervalRef.current);
          holdIntervalRef.current = null;
        }
        holdDirectionRef.current = 0;
      }
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      if (holdIntervalRef.current) clearInterval(holdIntervalRef.current);
    };
  }, [commit]);

  // Mouse hold support for arrow buttons
  const startHold = useCallback((dir) => {
    if (animating.current || dragging.current) return;

    if (holdIntervalRef.current) clearInterval(holdIntervalRef.current);

    holdDirectionRef.current = dir;
    commit(dir, false);

    holdIntervalRef.current = setTimeout(() => {
      holdIntervalRef.current = setInterval(() => {
        if (!animating.current) commit(holdDirectionRef.current, true);
      }, 240);
    }, 380);
  }, [commit]);

  const stopHold = useCallback(() => {
    if (holdIntervalRef.current) {
      clearInterval(holdIntervalRef.current);
      holdIntervalRef.current = null;
    }
    holdDirectionRef.current = 0;
  }, []);

  // Pointer / drag handlers (unchanged)
  const onPointerDown = useCallback((e) => {
    if (animating.current) return;
    dragging.current = true;
    startX.current = e.clientX;
    startY.current = e.clientY;
    lastX.current = e.clientX;
    lastT.current = Date.now();
    velRef.current = 0;
    dragDx.current = 0;
    e.currentTarget.setPointerCapture?.(e.pointerId);
    if (frontRef.current === "a") setTrA("none");
    else setTrB("none");
  }, []);

  const onPointerMove = useCallback((e) => {
    if (!dragging.current) return;
    const now = Date.now();
    const dt = Math.max(now - lastT.current, 1);
    velRef.current = (e.clientX - lastX.current) / dt;
    lastX.current = e.clientX;
    lastT.current = now;

    const raw = e.clientX - startX.current;
    const W = stageRef.current?.offsetWidth ?? 460;
    const atEdge = (activeRef.current === 0 && raw > 0) || (activeRef.current === n - 1 && raw < 0);
    const dx = atEdge ? raw * 0.18 : raw;
    dragDx.current = dx;

    const rot = (dx / W) * 10;
    const sc = 1 + Math.abs(dx / W) * 0.012;

    if (rafId.current) cancelAnimationFrame(rafId.current);
    rafId.current = requestAnimationFrame(() => {
      if (frontRef.current === "a") setStyA({ x: dx, rot, scale: sc, opacity: 1 });
      else setStyB({ x: dx, rot, scale: sc, opacity: 1 });
    });
  }, [n]);

  const onPointerUp = useCallback((e) => {
    if (!dragging.current) return;
    dragging.current = false;
    if (rafId.current) cancelAnimationFrame(rafId.current);

    const dx = dragDx.current;
    const dy = Math.abs(e.clientY - startY.current);
    const vel = velRef.current;
    const W = stageRef.current?.offsetWidth ?? 460;
    dragDx.current = 0;

    if (Math.abs(dx) < 6 && dy < 6) {
      navigate(activeRef.current);
      const reset = { x: 0, rot: 0, scale: 1, opacity: 1 };
      const tr = `transform ${DUR_IN}ms ${EASE_SPRING}, opacity ${DUR_IN}ms ease`;
      if (frontRef.current === "a") { setTrA(tr); setStyA(reset); }
      else { setTrB(tr); setStyB(reset); }
      return;
    }

    if (dx < -W * 0.25 || vel < -0.45) commit(1);
    else if (dx > W * 0.25 || vel > 0.45) commit(-1);
    else commit(0);
  }, [commit, navigate]);

  function cardStyle(s, tr, z) {
    return {
      position: "absolute",
      inset: 0,
      zIndex: z,
      transform: `translate3d(${s.x}px, ${(Math.abs(s.x) / 460) * -10}px, 0) rotate(${s.rot}deg) scale(${s.scale})`,
      opacity: s.opacity,
      transition: tr,
      willChange: "transform, opacity",
    };
  }

  const peekCount = Math.min(SLIVERS.length, n - 1 - active);

  return (
    <div
      className="relative w-full flex items-center justify-center select-none"
      style={{ height: "clamp(360px, 60vh, 660px)" }}
    >
      <div
        ref={stageRef}
        className="relative"
        style={{
          width: "min(52vw, 460px)",
          height: "min(60vh, 540px)",
          touchAction: "none",
          cursor: "grab",
        }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        {/* Slivers */}
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
                transition: "opacity 0.3s ease",
                pointerEvents: "none",
              }}
            >
              <div className="absolute top-0 right-0" style={{ width: "min(52vw, 460px)", height: "100%" }}>
                <CardFace raag={peekRaag} isActive={false} />
              </div>
            </div>
          );
        })}

        {/* Slot B */}
        <div style={cardStyle(styB, trB, front === "b" ? 20 : 15)}>
          <CardFace raag={raagData[slotB]} isActive={front === "b"} />
        </div>

        {/* Slot A */}
        <div style={cardStyle(styA, trA, front === "a" ? 20 : 15)}>
          <CardFace raag={raagData[slotA]} isActive={front === "a"} />
        </div>
      </div>

      {/* Nav Buttons with Hold Support */}
      <NavBtn
        dir="prev"
        disabled={active === 0}
        onClick={() => commit(-1)}
        onMouseDown={() => startHold(-1)}
        onMouseUp={stopHold}
        onMouseLeave={stopHold}
      />
      <NavBtn
        dir="next"
        disabled={active === n - 1}
        onClick={() => commit(1)}
        onMouseDown={() => startHold(1)}
        onMouseUp={stopHold}
        onMouseLeave={stopHold}
      />

      <Dots active={active} total={n} onChange={(i) => commit(i - active)} />

      <style>{`
        @media (prefers-reduced-motion: reduce) {
          * { animation: none !important; transition: none !important; }
        }
      `}</style>
    </div>
  );
}

// ─── NavBtn with mouse hold events
function NavBtn({ dir, disabled, onClick, onMouseDown, onMouseUp, onMouseLeave }) {
  const isPrev = dir === "prev";
  return (
    <button
      aria-label={isPrev ? "Previous" : "Next"}
      disabled={disabled}
      onClick={onClick}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
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
      onMouseEnter={(e) => {
        if (!disabled) e.currentTarget.style.background = "rgba(255,255,255,0.16)";
      }}
      onMouseLeave={(e) => {
        onMouseLeave();
        e.currentTarget.style.background = "rgba(255,255,255,0.08)";
      }}
    >
      {isPrev ? "‹" : "›"}
    </button>
  );
}

// ─── CardFace with full glassy effect (unchanged)
function CardFace({ raag, isActive }) {
  return (
    <div
      className="relative w-full h-full overflow-hidden"
      style={{
        borderRadius: 28,
        background: isActive
          ? `linear-gradient(145deg,
              rgba(180,190,220,0.18) 0%,
              rgba(160,175,210,0.08) 35%,
              rgba(140,160,200,0.04) 65%,
              rgba(160,175,215,0.10) 100%)`
          : `linear-gradient(145deg, #0e1520 0%, #0a1018 55%, #070c14 100%)`,
        backdropFilter: isActive
          ? "blur(80px) saturate(380%) brightness(1.08) hue-rotate(2deg)"
          : "none",
        WebkitBackdropFilter: isActive
          ? "blur(80px) saturate(380%) brightness(1.08) hue-rotate(2deg)"
          : "none",
        border: isActive
          ? "1px solid rgba(200,215,255,0.22)"
          : "1px solid rgba(255,255,255,0.06)",
        boxShadow: isActive
          ? [
              "0 40px 100px rgba(0,0,0,0.55)",
              "0 12px 32px rgba(0,0,0,0.35)",
              "inset 0 1.5px 0 rgba(210,225,255,0.45)",
              "inset 0 -1px 0 rgba(0,0,0,0.12)",
              "inset 1.5px 0 0 rgba(200,218,255,0.20)",
              "inset -1px 0 0 rgba(200,218,255,0.06)",
            ].join(",")
          : [
              "0 12px 40px rgba(0,0,0,0.55)",
              "inset 0 1px 0 rgba(255,255,255,0.06)",
            ].join(","),
      }}
    >
      {isActive && (
        <>
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              borderRadius: 28,
              background: `linear-gradient(145deg,
                rgba(210,225,255,0.14) 0%, rgba(190,210,255,0.06) 22%,
                transparent 45%, rgba(140,160,220,0.03) 75%, rgba(160,180,240,0.05) 100%)`,
            }}
          />
          <div
            className="absolute pointer-events-none"
            style={{
              top: 0,
              left: "8%",
              right: "8%",
              height: 1,
              background: "linear-gradient(90deg, transparent, rgba(210,228,255,0.55) 30%, rgba(210,228,255,0.55) 70%, transparent)",
            }}
          />
          <div
            className="absolute pointer-events-none"
            style={{
              top: "8%",
              left: 0,
              bottom: "8%",
              width: 1.5,
              background: "linear-gradient(180deg, transparent 0%, rgba(200,220,255,0.35) 25%, rgba(200,220,255,0.22) 65%, transparent 100%)",
            }}
          />
          <div
            className="absolute pointer-events-none"
            style={{
              top: "6%",
              left: "6%",
              width: "58%",
              height: "45%",
              background: "radial-gradient(ellipse at 35% 35%, rgba(180,200,255,0.10) 0%, transparent 68%)",
              filter: "blur(24px)",
            }}
          />
          <div
            className="absolute pointer-events-none"
            style={{
              width: "70%",
              height: "52%",
              top: "26%",
              left: "14%",
              background: "radial-gradient(ellipse, rgba(109,99,255,0.14) 0%, transparent 72%)",
              filter: "blur(38px)",
            }}
          />
          <div
            className="absolute pointer-events-none"
            style={{
              bottom: 0,
              left: 0,
              right: 0,
              height: "30%",
              borderRadius: "0 0 28px 28px",
              background: "linear-gradient(0deg, rgba(0,0,0,0.28) 0%, transparent 100%)",
            }}
          />
        </>
      )}

      {!isActive && (
        <div
          className="absolute top-0 left-0 right-0 pointer-events-none"
          style={{
            height: "28%",
            borderRadius: "28px 28px 0 0",
            background: "linear-gradient(180deg, rgba(255,255,255,0.03) 0%, transparent 100%)",
          }}
        />
      )}

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
              textShadow: "0 1px 20px rgba(180,200,255,0.18), 0 2px 6px rgba(0,0,0,0.65)",
            }}
          >
            {raag.name}
          </h2>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              background: "rgba(180,200,255,0.08)",
              border: "1px solid rgba(200,220,255,0.22)",
              borderRadius: 999,
              padding: "7px 22px",
              backdropFilter: "blur(40px) saturate(300%)",
              WebkitBackdropFilter: "blur(40px) saturate(300%)",
              boxShadow: [
                "inset 0 1.5px 0 rgba(210,228,255,0.35)",
                "inset 0 -1px 0 rgba(0,0,0,0.10)",
                "0 2px 12px rgba(0,0,0,0.18)",
              ].join(","),
            }}
          >
            <span
              style={{
                fontFamily: "'Noto Sans Gurmukhi','Gurmukhi MN',sans-serif",
                fontSize: "clamp(0.85rem, 2vw, 1.05rem)",
                color: "rgba(230,238,255,0.85)",
              }}
            >
              ਪੰਨਾ {toGurmukhi(raag.ang)}
            </span>
          </div>

          <span
            className="absolute bottom-6"
            style={{
              fontFamily: "system-ui,-apple-system,sans-serif",
              fontSize: 10,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "rgba(200,215,255,0.22)",
            }}
          >
            tap to open
          </span>
        </div>
      )}
    </div>
  );
}

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