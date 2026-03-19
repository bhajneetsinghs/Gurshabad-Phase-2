import { useRef } from "react";

const GK = ["੦", "੧", "੨", "੩", "੪", "੫", "੬", "੭", "੮", "੯"];
function toGurmukhi(n) {
  return String(n).split("").map((ch) => GK[Number(ch)] ?? ch).join("");
}

function useGlassPointer() {
  const ref = useRef(null);
  const onPointerMove = (e) => {
    const el = ref.current; if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${((e.clientX - rect.left) / rect.width) * 100}%`);
    el.style.setProperty("--my", `${((e.clientY - rect.top) / rect.height) * 100}%`);
  };
  const onPointerLeave = () => {
    const el = ref.current; if (!el) return;
    el.style.setProperty("--mx", "50%");
    el.style.setProperty("--my", "50%");
  };
  return { ref, onPointerMove, onPointerLeave };
}

const R = 56; // card corner radius
const RING = 18; // frost ring thickness

export default function RaagCard({ raag, isActive, onClick, style }) {
  const { ref, onPointerMove, onPointerLeave } = useGlassPointer();
  const { transform } = style || {};

  return (
    /* ═══ LAYER 0: outermost shadow halo — sits behind everything ═══ */
    <div style={{
      position: "absolute", left: "50%", top: "50%", transform,
      width: `min(60vw, 540px)`, height: `min(68vh, 620px)`,
      borderRadius: `${R + RING + 8}px`,
      // Deep cold shadow well
      boxShadow: isActive
        ? `0 60px 120px rgba(0,0,0,0.22), 0 0 80px 12px rgba(180,215,255,0.30), 0 0 0 1px rgba(255,255,255,0.18)`
        : `0 30px 70px rgba(0,0,0,0.15), 0 0 50px 8px rgba(180,215,255,0.18), 0 0 0 1px rgba(255,255,255,0.10)`,
      padding: `${RING + 8}px`,
      background: "transparent",
      transition: "all 600ms cubic-bezier(0.2,0.8,0.2,1)",
      filter: isActive ? "none" : "brightness(0.92)",
      cursor: "pointer", userSelect: "none",
    }} onClick={onClick}>

      {/* ═══ LAYER 1: thick frost ring — its own blur, milky ice ═══ */}
      <div style={{
        position: "absolute", inset: 0,
        borderRadius: "inherit",
        // Multiple frost sub-layers via stacked backgrounds
        backdropFilter: "blur(36px) saturate(140%) brightness(1.12)",
        WebkitBackdropFilter: "blur(36px) saturate(140%) brightness(1.12)",
        background: isActive
          ? `
            radial-gradient(ellipse at 18% 18%, rgba(255,255,255,0.92) 0%, rgba(220,240,255,0.55) 18%, transparent 50%),
            radial-gradient(ellipse at 82% 82%, rgba(185,218,255,0.55) 0%, rgba(210,235,255,0.22) 30%, transparent 58%),
            radial-gradient(ellipse at 80% 18%, rgba(255,255,255,0.60) 0%, transparent 45%),
            radial-gradient(ellipse at 20% 82%, rgba(255,255,255,0.45) 0%, transparent 42%),
            linear-gradient(135deg, rgba(255,255,255,0.75) 0%, rgba(245,250,255,0.62) 40%, rgba(220,238,255,0.68) 100%)
          `
          : `
            radial-gradient(ellipse at 18% 18%, rgba(255,255,255,0.75) 0%, rgba(220,240,255,0.38) 20%, transparent 52%),
            radial-gradient(ellipse at 82% 82%, rgba(180,215,255,0.38) 0%, transparent 55%),
            linear-gradient(135deg, rgba(255,255,255,0.58) 0%, rgba(240,248,255,0.48) 100%)
          `,
        boxShadow: isActive
          ? [
              // outer face of frost ring
              "0 0 0 1.5px rgba(255,255,255,0.95)",
              "0 0 0 4px rgba(210,232,255,0.40)",
              "0 0 0 6px rgba(255,255,255,0.12)",
              // inner edge where frost meets glass card
              "inset 0 0 0 1px rgba(255,255,255,0.88)",
              // top/left lit bevels on ring
              "inset 0 3px 8px rgba(255,255,255,0.70)",
              "inset 3px 0 8px rgba(255,255,255,0.45)",
              // bottom/right shadow bevels
              "inset 0 -3px 8px rgba(170,200,240,0.35)",
              "inset -3px 0 8px rgba(170,200,240,0.25)",
            ].join(",")
          : [
              "0 0 0 1px rgba(255,255,255,0.80)",
              "0 0 0 3px rgba(210,232,255,0.28)",
              "inset 0 0 0 1px rgba(255,255,255,0.72)",
              "inset 0 2px 6px rgba(255,255,255,0.55)",
              "inset 2px 0 6px rgba(255,255,255,0.35)",
              "inset 0 -2px 6px rgba(170,200,240,0.25)",
            ].join(","),
        pointerEvents: "none",
      }}/>

      {/* ═══ LAYER 2: frost ring specular streaks ═══ */}
      {/* Diagonal light streak across ring */}
      <div aria-hidden style={{
        position: "absolute", inset: 0, borderRadius: "inherit",
        background: `linear-gradient(112deg,
          rgba(255,255,255,0.85) 0%,
          rgba(255,255,255,0.35) 8%,
          transparent 22%,
          transparent 75%,
          rgba(200,225,255,0.30) 90%,
          rgba(255,255,255,0.15) 100%)`,
        pointerEvents: "none",
      }}/>

      {/* ═══ LAYER 3: inner glass card ═══ */}
      <article
        ref={ref}
        onPointerMove={onPointerMove}
        onPointerLeave={onPointerLeave}
        style={{
          "--mx": "50%", "--my": "50%",
          position: "absolute",
          inset: `${RING}px`,
          borderRadius: `${R}px`,
          overflow: "hidden", isolation: "isolate",
          backdropFilter: "blur(56px) saturate(180%) brightness(1.04)",
          WebkitBackdropFilter: "blur(56px) saturate(180%) brightness(1.04)",
          background: isActive
            ? "rgba(255,255,255,0.30)"
            : "rgba(255,255,255,0.18)",
          border: "1.5px solid rgba(255,255,255,0.72)",
          boxShadow: [
            "inset 0 2.5px 0 rgba(255,255,255,0.98)",
            "inset 2.5px 0 0 rgba(255,255,255,0.65)",
            "inset 0 -2px 0 rgba(160,195,235,0.40)",
            "inset -2px 0 0 rgba(160,195,235,0.28)",
            // frosted interior top glow
            "inset 0 16px 40px rgba(255,255,255,0.18)",
            // inner depth shadow at bottom
            "inset 0 -20px 40px rgba(180,210,240,0.12)",
          ].join(","),
        }}
      >
        {/* Pointer-tracking shimmer */}
        <div aria-hidden style={{
          position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0,
          borderRadius: "inherit",
          background: `
            radial-gradient(320px circle at var(--mx) var(--my),
              rgba(255,255,255,0.70),
              rgba(255,255,255,0.18) 30%,
              rgba(255,255,255,0.04) 55%,
              transparent 72%),
            linear-gradient(150deg,
              rgba(255,255,255,0.60) 0%,
              rgba(255,255,255,0.12) 30%,
              rgba(230,244,255,0.06) 100%)
          `,
        }}/>

        {/* TL bright lens */}
        <div aria-hidden style={{
          position: "absolute", top: 0, left: 0,
          width: "58%", height: "58%", pointerEvents: "none", zIndex: 1,
          borderRadius: `${R}px 0 130% 0`,
          background: `radial-gradient(ellipse at 13% 13%,
            rgba(255,255,255,0.95) 0%,
            rgba(215,238,255,0.50) 18%,
            rgba(255,255,255,0.12) 45%,
            transparent 65%)`,
        }}/>
        {/* TR lens */}
        <div aria-hidden style={{
          position: "absolute", top: 0, right: 0,
          width: "42%", height: "42%", pointerEvents: "none", zIndex: 1,
          borderRadius: `0 ${R}px 0 130%`,
          background: `radial-gradient(ellipse at 87% 13%,
            rgba(255,255,255,0.62) 0%,
            rgba(255,255,255,0.14) 38%,
            transparent 62%)`,
        }}/>
        {/* BR cold lens */}
        <div aria-hidden style={{
          position: "absolute", bottom: 0, right: 0,
          width: "46%", height: "46%", pointerEvents: "none", zIndex: 1,
          borderRadius: `130% 0 ${R}px 0`,
          background: `radial-gradient(ellipse at 87% 87%,
            rgba(185,216,255,0.48) 0%,
            rgba(210,232,255,0.18) 36%,
            transparent 60%)`,
        }}/>

        {/* Glass face surface sheen — horizontal band mid-card */}
        <div aria-hidden style={{
          position: "absolute", left: 0, right: 0, top: "15%", height: "28%",
          pointerEvents: "none", zIndex: 1,
          background: `linear-gradient(180deg,
            rgba(255,255,255,0.14) 0%,
            rgba(255,255,255,0.06) 50%,
            transparent 100%)`,
          maskImage: "linear-gradient(90deg, transparent 0%, white 15%, white 85%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(90deg, transparent 0%, white 15%, white 85%, transparent 100%)",
        }}/>

        {/* Inactive veil */}
        {!isActive && (
          <div aria-hidden style={{
            position: "absolute", inset: 0, borderRadius: "inherit",
            pointerEvents: "none", zIndex: 3,
            backdropFilter: "blur(12px) saturate(115%)",
            WebkitBackdropFilter: "blur(12px) saturate(115%)",
            background: "rgba(225,236,252,0.12)",
          }}/>
        )}

        {/* Content */}
        <div style={{
          position: "relative", zIndex: 10,
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          height: "100%", gap: "12px", padding: "0 36px",
        }}>
          <h2 style={{
            fontFamily: "'Noto Sans Gurmukhi','Gurmukhi MN','Kohinoor Gurmukhi',sans-serif",
            fontSize: "clamp(1.6rem, 4vw, 2.6rem)",
            fontWeight: 500, lineHeight: 1.3, textAlign: "center", margin: 0,
            color: "rgba(10,16,28,0.82)",
            textShadow: "0 1px 0 rgba(255,255,255,0.80)",
          }}>
            {raag.name}
          </h2>
          <p style={{
            fontFamily: "'Noto Sans Gurmukhi','Gurmukhi MN','Kohinoor Gurmukhi',sans-serif",
            fontSize: "clamp(0.95rem, 2vw, 1.15rem)",
            textAlign: "center", margin: 0,
            color: "rgba(10,16,28,0.46)",
            textShadow: "0 1px 0 rgba(255,255,255,0.60)",
          }}>
            ਅੰਗ {toGurmukhi(raag.ang)}
          </p>
        </div>
      </article>
    </div>
  );
}