import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { searchRaw, parseVerseItem } from '../services/gurbaniApi';

const GURBANI_FONT = "'Noto Sans Gurmukhi','Gurmukhi MN','Kohinoor Gurmukhi',sans-serif";
const UI_FONT = 'system-ui,-apple-system,sans-serif';

export default function SearchResults() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const q = (searchParams.get('q') || '').trim();
    const type = (searchParams.get('type') || '2').toString();

    const [results, setResults] = useState([]);
    const [total, setTotal] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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
        <div className="max-w-[min(980px,92vw)] mx-auto px-4 pb-16 pt-16">

            {/* Back + heading */}
            <div className="mb-8">
                <Link
                    to="/"
                    className="inline-flex items-center gap-1.5 text-white/40
                     hover:text-white/70 text-sm mb-5 transition-colors"
                    style={{ fontFamily: UI_FONT }}
                >
                    ← Home
                </Link>

                {/* Info card — mirrors .search-info.card from original */}
                <div
                    className="rounded-2xl border border-white/12 px-6 py-5 mb-6 text-center"
                    style={{
                        background: 'rgba(255,255,255,0.06)',
                        backdropFilter: 'blur(8px)',
                        WebkitBackdropFilter: 'blur(8px)',
                    }}
                >
                    <h2
                        className="text-white font-bold mb-1"
                        style={{
                            fontFamily: UI_FONT,
                            fontSize: 'clamp(1.1rem, 2.4vw, 1.5rem)',
                        }}
                    >
                        Search Results
                    </h2>
                    {q && (
                        <p className="text-white/60 text-sm" style={{ fontFamily: UI_FONT }}>
                            {q.length > 0 && (
                                <span style={{ fontFamily: GURBANI_FONT }}>{q}</span>
                            )}
                            {' '}· {typeLabel}
                            {!loading && total !== null && (
                                <span className="ml-2 text-white/40">
                                    ({count.toLocaleString()} result{count !== 1 ? 's' : ''})
                                </span>
                            )}
                        </p>
                    )}
                </div>
            </div>

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
                <p
                    className="text-white/40 text-center py-16"
                    style={{ fontFamily: GURBANI_FONT, fontSize: '1.1rem' }}
                >
                    ਕੋਈ ਨਤੀਜਾ ਨਹੀਂ ਮਿਲਿਆ
                </p>
            )}

            {/* Results — matches original .result-item.card layout */}
            {!loading && !error && results.length > 0 && (
                <div className="space-y-3">
                    {results.map((v, i) => {
                        const { gurmukhi, ang, lineNo } = parseVerseItem(v);
                        if (!gurmukhi) return null;
                        const meta = [
                            ang ? `Ang ${ang}` : null,
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
                                {/* Gurmukhi text — large, matches .result-gurmukhi */}
                                <p
                                    className="text-white leading-relaxed mb-1.5"
                                    style={{
                                        fontFamily: GURBANI_FONT,
                                        fontSize: 'clamp(1.1rem, 2.4vw, 1.45rem)',
                                        lineHeight: 1.7,
                                    }}
                                >
                                    {gurmukhi}
                                </p>
                                {/* Meta — Ang • Line */}
                                {meta && (
                                    <p
                                        className="text-white/55 text-sm"
                                        style={{ fontFamily: UI_FONT }}
                                    >
                                        {meta}
                                    </p>
                                )}
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
}