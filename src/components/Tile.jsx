export default function Tile({ title, subtitle, onClick, href }) {
    const Comp = href ? "a" : "button";

    return (
        <Comp
            onClick={onClick}
            href={href}
            target={href ? "_blank" : undefined}
            rel={href ? "noopener noreferrer" : undefined}
            className="group text-left w-full max-w-[320px] mx-auto relative px-5 py-4 rounded-[18px]
                 border border-white/20 hover:border-white/35
                 bg-white/[0.08] hover:bg-white/[0.14]
                 backdrop-blur-md
                 shadow-[0_6px_22px_rgba(0,0,0,0.20)]
                 hover:shadow-[0_10px_28px_rgba(0,0,0,0.28)]
                 hover:-translate-y-0.5 transition-all duration-200"
        >
            {subtitle && (
                <span className="block text-white/60 text-sm mb-1">
                    {subtitle}
                </span>
            )}

            <span className="text-white font-semibold">{title}</span>

            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 group-hover:text-white/50 transition">
                ›
            </span>
        </Comp>
    );
}