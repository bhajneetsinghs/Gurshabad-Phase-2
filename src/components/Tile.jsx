// export default function Tile({ title, subtitle, onClick, href }) {
//     const Comp = href ? "a" : "button";

//     return (
//         <Comp
//             onClick={onClick}
//             href={href}
//             target={href ? "_blank" : undefined}
//             rel={href ? "noopener noreferrer" : undefined}
//             className="group text-left w-full max-w-[320px] mx-auto relative px-5 py-4 rounded-[18px]
//                  border border-white/20 hover:border-white/35
//                  bg-white/[0.08] hover:bg-white/[0.14]
//                  backdrop-blur-md
//                  shadow-[0_6px_22px_rgba(0,0,0,0.20)]
//                  hover:shadow-[0_10px_28px_rgba(0,0,0,0.28)]
//                  hover:-translate-y-0.5 transition-all duration-200"
//         >
//             {subtitle && (
//                 <span className="block text-white/60 text-sm mb-1">
//                     {subtitle}
//                 </span>
//             )}

//             <span className="text-white font-semibold">{title}</span>

//             <span className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 group-hover:text-white/50 transition">
//                 ›
//             </span>
//         </Comp>
//     );
// }

const VARIANTS = {
    default: {
        wrapper: "py-4 max-w-[320px] min-h-[72px]",
        title: "text-base font-semibold",
        border: "border-white/20 hover:border-white/35",
        bg: "bg-white/[0.08] hover:bg-white/[0.14]",
    },
    featured: {
        wrapper: "py-8 max-w-none",
        title: "text-xl font-bold",
        border: "border-blue-400/40 hover:border-blue-400/70",
        bg: "bg-blue-400/[0.08] hover:bg-blue-400/[0.14]",
    },
    playlist: {
        wrapper: "py-5 max-w-[320px]",
        title: "text-base font-semibold",
        border: "border-blue-400/30 hover:border-blue-400/50",
        bg: "bg-blue-400/[0.07] hover:bg-blue-400/[0.13]",
    },
    video: {
        wrapper: "py-3 max-w-[320px] min-h-[80px]",
        title: "text-sm font-normal",
        border: "border-white/15 hover:border-white/30",
        bg: "bg-blue/[0.04] hover:bg-blue/[0.08]",
    },
};

export default function Tile({ title, subtitle, onClick, href, variant = "default" }) {
    const Comp = href ? "a" : "button";
    const v = VARIANTS[variant];

    return (
        <Comp
            onClick={onClick}
            href={href}
            target={href ? "_blank" : undefined}
            rel={href ? "noopener noreferrer" : undefined}
            className={`group text-left w-full mx-auto relative px-5 rounded-[18px]
                border backdrop-blur-md
                shadow-[0_6px_22px_rgba(0,0,0,0.20)]
                hover:shadow-[0_10px_28px_rgba(0,0,0,0.28)]
                hover:-translate-y-0.5 transition-all duration-200
                ${v.wrapper} ${v.border} ${v.bg}`}
        >
            {subtitle && (
                <span className="block text-white/60 text-sm mb-1">
                    {subtitle}
                </span>
            )}

            <span className={`text-white ${v.title}`}>
                {title}
            </span>

            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 group-hover:text-white/50 transition">
                ›
            </span>
        </Comp>
    );
}