import { Link, useLocation } from "react-router-dom";
import { useState } from "react";

export default function Navbar() {
    const [open, setOpen] = useState(false);
    const location = useLocation();

    const nav = [
        { name: "Home",     path: "/" },
        { name: "Courses",  path: "/courses" },
        { name: "Guide",    path: "/guide" },
        { name: "Flow Map", path: "/flow-map" },
        { name: "Articles", path: "/articles" },
        { name: "About",    path: "/about" },
    ];

    return (
        <header className="fixed top-0 w-full z-[200]"
            style={{
                background: "linear-gradient(180deg, #060a14 0%, rgba(6,10,20,0.97) 100%)",
                borderBottom: "1px solid rgba(212,175,55,0.1)",
            }}
        >
            <nav className="flex items-center justify-between py-4 px-6 md:justify-center md:relative">

                {/* Logo — left on mobile, absolute left on desktop */}
                <Link to="/" style={{ textDecoration: "none" }}
                    className="md:absolute md:left-6 flex items-center gap-2"
                >
                    <div style={{
                        width: 34, height: 34,
                        borderRadius: 10,
                        background: "linear-gradient(135deg, rgba(212,175,55,0.9), rgba(232,201,122,0.65))",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        boxShadow: "0 0 14px rgba(212,175,55,0.28), inset 0 1px 0 rgba(255,255,255,0.3)",
                        fontSize: 16,
                        fontFamily: "'Noto Sans Gurmukhi', serif",
                        color: "#080c18",
                        fontWeight: 700,
                        flexShrink: 0,
                    }}>
                        ਗ
                    </div>
                    <span style={{
                        fontFamily: "system-ui, sans-serif",
                        fontSize: "0.8rem",
                        fontWeight: 600,
                        letterSpacing: "0.12em",
                        textTransform: "uppercase",
                        color: "rgba(255,255,255,0.65)",
                    }}>
                        Gurshabad
                    </span>
                </Link>

                {/* Desktop nav pills — unchanged */}
                <div className="hidden md:flex gap-2">
                    {nav.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.name}
                                to={item.path}
                                style={{
                                    background: isActive
                                        ? "rgba(212,175,55,0.12)"
                                        : "rgba(255,255,255,0.04)",
                                    border: isActive
                                        ? "1px solid rgba(212,175,55,0.35)"
                                        : "1px solid rgba(255,255,255,0.08)",
                                    color: isActive ? "rgba(212,175,55,0.95)" : "rgba(255,255,255,0.7)",
                                    boxShadow: isActive ? "0 0 20px rgba(212,175,55,0.08)" : "none",
                                }}
                                className="px-5 py-2.5 rounded-full text-sm font-medium backdrop-blur-md hover:border-[rgba(212,175,55,0.25)] hover:text-white transition-all duration-300"
                            >
                                {item.name}
                            </Link>
                        );
                    })}
                </div>

                {/* Hamburger — mobile only */}
                <button
                    className="md:hidden text-white/70 hover:text-white transition-colors"
                    onClick={() => setOpen(!open)}
                >
                    {open ? "✕" : "☰"}
                </button>
            </nav>

            {/* Mobile menu — unchanged */}
            {open && (
                <div className="flex flex-col items-center gap-2 pb-4"
                    style={{ borderTop: "1px solid rgba(212,175,55,0.08)" }}
                >
                    {nav.map((item) => (
                        <Link
                            key={item.name}
                            to={item.path}
                            onClick={() => setOpen(false)}
                            className="text-white/70 hover:text-white py-2 transition-colors"
                        >
                            {item.name}
                        </Link>
                    ))}
                </div>
            )}
        </header>
    );
}