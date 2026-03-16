import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';

// Helpers 
const GK = ['੦', '੧', '੨', '੩', '੪', '੫', '੬', '੭', '੮', '੯'];
const toGurmukhi = (n) => String(n).split('').map((c) => GK[+c] ?? c).join('');

// Component 
export default function Sections() {
    const { raag: slug } = useParams();
    const navigate = useNavigate();

    const [raagData, setRaagData] = useState(null); // { slug, raag_pa, sections[] }
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Load raag-sections.json (placed in /public/data/)
    useEffect(() => {
        if (!slug) return;
        setLoading(true);
        setError(null);

        fetch('/data/raag-sections.json')
            .then((r) => {
                if (!r.ok) throw new Error(`Failed to load sections data (${r.status})`);
                return r.json();
            })
            .then((all) => {
                const found = all.find(
                    (r) => (r.slug || '').toLowerCase() === slug.toLowerCase()
                );
                if (!found) throw new Error(`No sections found for raag "${slug}"`);
                setRaagData(found);
            })
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    }, [slug]);

    // Loading state 
    if (loading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div
                        className="w-10 h-10 rounded-full border-2 border-white/20 border-t-white/80 animate-spin"
                    />
                    <p className="text-white/50 text-sm" style={{ fontFamily: 'system-ui,sans-serif' }}>
                        Loading…
                    </p>
                </div>
            </div>
        );
    }

    // Error state 
    if (error) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center px-6">
                <div className="text-center space-y-4">
                    <p className="text-white/60 text-base" style={{ fontFamily: "'Noto Sans Gurmukhi',sans-serif" }}>
                        ਭਾਗ ਲੋਡ ਕਰਨ ਵਿੱਚ ਗੜਬੜ।
                    </p>
                    <p className="text-white/35 text-sm" style={{ fontFamily: 'system-ui,sans-serif' }}>
                        {error}
                    </p>
                    <Link
                        to="/"
                        className="inline-block mt-2 px-5 py-2 rounded-xl text-sm text-white/70
                       border border-white/20 hover:bg-white/10 transition-colors duration-150"
                        style={{ fontFamily: 'system-ui,sans-serif' }}
                    >
                        ← Back home
                    </Link>
                </div>
            </div>
        );
    }

    //Sections grid 
    return (
        <div
            className="max-w-[min(1200px,92vw)] mx-auto px-4 pb-16"
            style={{ paddingTop: '2rem' }}
        >
            {/* Back link */}
            <Link
                to="/"
                className="inline-flex items-center gap-1.5 text-white/45 hover:text-white/80
                   text-sm mb-6 transition-colors duration-150"
                style={{ fontFamily: 'system-ui,sans-serif' }}
            >
                <span>←</span>
                <span>Home</span>
            </Link>

            {/* Raag title */}
            <h1
                className="text-white font-bold mb-8"
                style={{
                    fontFamily: "'Noto Sans Gurmukhi','Gurmukhi MN',sans-serif",
                    fontSize: 'clamp(1.4rem, 2.5vw, 2rem)',
                    textShadow: '0 1px 8px rgba(109,99,255,0.2)',
                }}
            >
                {raagData.raag_pa}
            </h1>

            {/* Tiles grid */}
            <div
                className="grid gap-4"
                style={{
                    gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                }}
            >
                {raagData.sections.map((sec, idx) => (
                    <SectionTile
                        key={idx}
                        raagName={raagData.raag_pa}
                        section={sec}
                        onClick={() => navigate(`/reader/${sec.ang_start}`)}
                    />
                ))}
            </div>
        </div>
    );
}

//Single tile 
function SectionTile({ raagName, section, onClick }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={[
                'group text-left w-full',
                'relative px-5 py-4 rounded-[18px]',
                'border border-white/20 hover:border-white/35',
                'bg-white/[0.08] hover:bg-white/[0.14]',
                'backdrop-blur-md',
                'shadow-[0_6px_22px_rgba(0,0,0,0.20)]',
                'hover:shadow-[0_10px_28px_rgba(0,0,0,0.28)]',
                'hover:-translate-y-0.5',
                'transition-all duration-200 ease-out',
                'cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-white/60',
            ].join(' ')}
        >
            {/* Raag name label */}
            <span
                className="block text-white/60 mb-0.5"
                style={{
                    fontFamily: "'Noto Sans Gurmukhi','Gurmukhi MN',sans-serif",
                    fontSize: '0.85rem',
                }}
            >
                {raagName}
            </span>

            {/* Section title */}
            <span
                className="block text-white font-semibold leading-snug mb-1.5 group-hover:text-white/95"
                style={{
                    fontFamily: "'Noto Sans Gurmukhi','Gurmukhi MN',sans-serif",
                    fontSize: '1rem',
                    lineHeight: 1.3,
                }}
            >
                {section.title_pa}
            </span>

            {/* Ang range */}
            <span
                className="text-white/60 text-sm"
                style={{
                    fontFamily: "'Noto Sans Gurmukhi','Gurmukhi MN',sans-serif",
                    fontSize: '0.88rem',
                }}
            >
                ਅੰਗ {toGurmukhi(section.ang_start)}–{toGurmukhi(section.ang_end)}
            </span>

            {/* Arrow hint */}
            <span
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20
                   group-hover:text-white/50 group-hover:translate-x-0.5
                   transition-all duration-200 text-lg"
            >
                ›
            </span>
        </button>
    );
}