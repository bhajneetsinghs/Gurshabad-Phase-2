import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { searchRaw, parseVerseItem } from '../services/gurbaniApi';
import SearchBar from '../components/search/SearchBar';

const GURBANI_FONT = "'Noto Sans Gurmukhi','Gurmukhi MN','Kohinoor Gurmukhi',sans-serif";
const UI_FONT = 'system-ui,-apple-system,sans-serif';

const SUGGESTIONS = [
    { label: "ਆਸਾ",     hint: "Raag Asa",         type: "2", q: "ਆਸਾ"     },
    { label: "ਮਾਝ",     hint: "Raag Maajh",        type: "2", q: "ਮਾਝ"     },
    { label: "ਗਉੜੀ",    hint: "Raag Gauri",        type: "2", q: "ਗਉੜੀ"    },
    { label: "ਜਪੁ",     hint: "Japji Sahib",       type: "2", q: "ਜਪੁ"     },
    { label: "ਸੋਹਿਲਾ",  hint: "Kirtan Sohila",    type: "2", q: "ਸੋਹਿਲਾ"  },
    { label: "ਅਨੰਦੁ",   hint: "Anand Sahib",       type: "2", q: "ਅਨੰਦੁ"   },
    { label: "ਸੁਖਮਨੀ",  hint: "Sukhmani Sahib",   type: "2", q: "ਸੁਖਮਨੀ"  },
    { label: "ਸਾਰੰਗ",   hint: "Raag Sarang",       type: "2", q: "ਸਾਰੰਗ"   },
    { label: "ਬਿਲਾਵਲ",  hint: "Raag Bilaval",     type: "2", q: "ਬਿਲਾਵਲ"  },
    { label: "ਰਾਮਕਲੀ",  hint: "Raag Ramkali",     type: "2", q: "ਰਾਮਕਲੀ"  },
];

export default function SearchResults() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const q    = (searchParams.get('q')    || '').trim();
    const type = (searchParams.get('type') || '2').toString();

    const [results, setResults] = useState([]);
    const [total,   setTotal]   = useState(null);
    const [loading, setLoading] = useState(true);
    const [error,   setError]   = useState(null);

    useEffect(() => {
        if (!q) { setLoading(false); return; }
        setLoading(true);
        setError(null);

        searchRaw(type, q)
            .then(({ verses, total }) => {
                setResults(verses);
                setTotal(total);
            })
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    }, [q, type]);

    const typeLabel = { '1': 'First Letter', '2': 'Full Word', '4': 'Romanized' }[type] ?? 'Search';
    const count = total ?? results.length;

    return (
        <div className="max-w-[min(1200px,96vw)] mx-auto px-4 pb-16 pt-6">

            {/* Back
            <Link
                to="/"
                className="inline-flex items-center gap-1.5 text-white/40
                 hover:text-white/70 text-sm mb-5 transition-colors"
                style={{ fontFamily: UI_FONT }}
            >
                ← Home
            </Link> */}

            {/* SearchBar pre-filled with searched keyword */}
            <div className="mb-6">
                <SearchBar initialQuery={q} initialType={type} hideDropdown />
            </div>

            {/* 2-column grid */}
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-6 items-start">

                {/* ── Left: Results ── */}
                <div>
                    {/* Result count */}
                    {!loading && total !== null && (
                        <p className="text-white/35 text-xs mb-4"
                            style={{ fontFamily: UI_FONT }}>
                            {count.toLocaleString()} result{count !== 1 ? 's' : ''} · {typeLabel}
                        </p>
                    )}

                    {/* Loading */}
                    {loading && (
                        <div className="flex justify-center py-20">
                            <div className="w-8 h-8 rounded-full border-2 border-white/15
                                  border-t-white/70 animate-spin" />
                        </div>
                    )}

                    {/* Error */}
                    {!loading && error && (
                        <p className="text-white/45 text-center py-16 text-sm"
                            style={{ fontFamily: UI_FONT }}>
                            {error}
                        </p>
                    )}

                    {/* Empty */}
                    {!loading && !error && results.length === 0 && q && (
                        <p className="text-white/40 text-center py-16"
                            style={{ fontFamily: GURBANI_FONT, fontSize: '1.1rem' }}>
                            ਕੋਈ ਨਤੀਜਾ ਨਹੀਂ ਮਿਲਿਆ
                        </p>
                    )}

                    {/* Results */}
                    {!loading && !error && results.length > 0 && (
                        <div className="space-y-3">
                            {results.map((v, i) => {
                                const { gurmukhi, ang, lineNo } = parseVerseItem(v);
                                if (!gurmukhi) return null;
                                const meta = [
                                    ang    ? `Page ${ang}`     : null,
                                    lineNo ? `Line ${lineNo}` : null,
                                ].filter(Boolean).join(' • ');

                                return (
                                    <button
                                        key={i}
                                        type="button"
                                        onClick={() => ang && navigate(`/reader/${ang}`)}
                                        className="group w-full text-left
                                   px-5 py-4 rounded-[18px]
                                   border border-white/12 hover:border-white/25
                                   bg-white/[0.06] hover:bg-white/[0.10]
                                   backdrop-blur-md
                                   hover:-translate-y-px
                                   transition-all duration-150 ease-out
                                   focus-visible:outline-2 focus-visible:outline-white/50"
                                        style={{
                                            backdropFilter: 'blur(8px)',
                                            WebkitBackdropFilter: 'blur(8px)',
                                        }}
                                    >
                                        <p className="text-white leading-relaxed mb-1.5"
                                            style={{
                                                fontFamily: GURBANI_FONT,
                                                fontSize: 'clamp(1.1rem, 2.4vw, 1.45rem)',
                                                lineHeight: 1.7,
                                            }}>
                                            {gurmukhi}
                                        </p>
                                        {meta && (
                                            <p className="text-white/55 text-sm"
                                                style={{ fontFamily: UI_FONT }}>
                                                {meta}
                                            </p>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* ── Right: Suggestions ── */}
                <div
                    className="rounded-2xl border border-white/10 overflow-hidden sticky top-20"
                    style={{
                        background: 'rgba(255,255,255,0.04)',
                        backdropFilter: 'blur(16px)',
                        WebkitBackdropFilter: 'blur(16px)',
                    }}
                >
                    <div className="px-4 py-3 border-b border-white/[0.08]">
                        <p style={{
                            fontFamily: UI_FONT,
                            fontSize: '0.75rem',
                            letterSpacing: '0.08em',
                            textTransform: 'uppercase',
                            color: 'rgba(255,255,255,0.35)',
                        }}>
                            Explore Raags
                        </p>
                    </div>

                    <div className="divide-y divide-white/[0.06]">
                        {SUGGESTIONS.map((s, i) => (
                            <button
                                key={i}
                                type="button"
                                onClick={() => navigate(`/search?q=${encodeURIComponent(s.q)}&type=${s.type}`)}
                                className="w-full text-left px-4 py-3
                                 hover:bg-white/[0.06] transition-colors duration-100
                                 flex items-center justify-between gap-3 group"
                            >
                                <div>
                                    <p style={{
                                        fontFamily: GURBANI_FONT,
                                        fontSize: '1rem',
                                        color: 'rgba(255,255,255,0.82)',
                                        lineHeight: 1.3,
                                    }}>
                                        {s.label}
                                    </p>
                                    <p style={{
                                        fontFamily: UI_FONT,
                                        fontSize: '0.72rem',
                                        color: 'rgba(255,255,255,0.3)',
                                        marginTop: 2,
                                    }}>
                                        {s.hint}
                                    </p>
                                </div>
                                <span
                                    className="group-hover:text-white/50"
                                    style={{ color: 'rgba(255,255,255,0.18)', fontSize: '0.85rem' }}
                                >
                                    →
                                </span>
                            </button>
                        ))}
                    </div>

                    <div className="px-4 py-3 border-t border-white/[0.08]">
                        <button
                            type="button"
                            onClick={() => navigate('/')}
                            className="w-full text-center py-2 rounded-xl
                             border border-white/12 hover:border-white/25
                             hover:bg-white/[0.06] transition-all duration-150"
                            style={{
                                fontFamily: UI_FONT,
                                fontSize: '0.78rem',
                                color: 'rgba(255,255,255,0.45)',
                            }}
                        >
                            Browse all Raags →
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}