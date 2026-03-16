export default function RaagCard({ raag, isActive, onClick, style }) {
    return (
        <article
            onClick={onClick}
            style={style}
            className={[
                // positioning
                "absolute left-1/2 top-1/2",
                // sizing — mirrors the original min(56vw, 540px) × min(68vh, 620px)
                "w-[min(56vw,540px)] h-[min(68vh,620px)]",
                // shape
                "rounded-[28px] overflow-hidden isolate",
                // glass
                "border border-white/20 backdrop-blur-2xl",
                // transition (transform + opacity driven by inline style from carousel)
                "transition-[transform,opacity,box-shadow,filter] duration-[600ms]",
                "transition-timing-function-[cubic-bezier(0.2,0.8,0.2,1)]",
                "will-change-[transform,opacity]",
                // cursor
                "cursor-pointer select-none",
                // active vs inactive look
                isActive
                    ? [
                        "bg-[rgba(18,22,38,0.32)]",
                        "shadow-[0_60px_140px_rgba(0,0,0,0.8),0_0_0_1px_rgba(255,255,255,0.15),inset_0_1px_0_rgba(255,255,255,0.45)]",
                    ].join(" ")
                    : [
                        "bg-[rgba(18,22,38,0.32)]",
                        "brightness-75 saturate-90",
                        "shadow-[0_40px_90px_rgba(0,0,0,0.65),inset_0_1px_0_rgba(255,255,255,0.35),inset_0_-1px_0_rgba(255,255,255,0.05)]",
                    ].join(" "),
            ]
                .flat()
                .join(" ")}
        >
            {/* Colour-shift overlay — same as ::before pseudo in original */}
            <div
                className="absolute inset-0 rounded-[inherit] pointer-events-none mix-blend-screen"
                style={{
                    background:
                        "linear-gradient(120deg, rgba(255,0,80,0.05) 0%, transparent 30%, transparent 70%, rgba(0,150,255,0.05) 100%)",
                }}
            />

            {/* Inactive defocus veil — same as ::after pseudo */}
            {!isActive && (
                <div
                    className="absolute inset-0 rounded-[inherit] pointer-events-none"
                    style={{
                        backdropFilter: "blur(12px) saturate(120%)",
                        WebkitBackdropFilter: "blur(12px) saturate(120%)",
                        background: "rgba(10,15,25,0.2)",
                    }}
                />
            )}

            {/* Card content — centered vertically + horizontally */}
            <div className="relative z-10 flex flex-col items-center justify-center h-full gap-3 px-6">
                <h2
                    className="text-white text-center text-shadow"
                    style={{
                        fontFamily:
                            "'Noto Sans Gurmukhi', 'Gurmukhi MN', 'Kohinoor Gurmukhi', sans-serif",
                        fontSize: "clamp(1.6rem, 4vw, 2.6rem)",
                        fontWeight: 500,
                        lineHeight: 1.3,
                        textShadow: "0 1px 1px rgba(0,0,0,0.35)",
                    }}
                >
                    {raag.name}
                </h2>

                <p
                    className="text-white/80 text-center"
                    style={{
                        fontFamily:
                            "'Noto Sans Gurmukhi', 'Gurmukhi MN', 'Kohinoor Gurmukhi', sans-serif",
                        fontSize: "clamp(0.95rem, 2vw, 1.15rem)",
                        textShadow: "0 1px 1px rgba(0,0,0,0.35)",
                    }}
                >
                    {/* Render ang as Gurmukhi digits to match original */}
                    ਅੰਗ {toGurmukhi(raag.ang)}
                </p>
            </div>
        </article>
    );
}

// Utility: convert an Arabic numeral to Gurmukhi digits 
const GK = ["੦", "੧", "੨", "੩", "੪", "੫", "੬", "੭", "੮", "੯"];

function toGurmukhi(n) {
    return String(n)
        .split("")
        .map((ch) => (GK[Number(ch)] !== undefined ? GK[Number(ch)] : ch))
        .join("");
}