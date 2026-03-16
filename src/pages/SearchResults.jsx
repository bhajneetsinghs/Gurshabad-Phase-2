// src/pages/SearchResults.jsx
// Route: /search?q=...&type=1|2
// BaniDB search response: { resultsInfo: { totalResults }, verses: [...] }

import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { parseVerseItem } from '../services/gurbaniApi';

const GURBANI_FONT = "'Noto Sans Gurmukhi','Gurmukhi MN','Kohinoor Gurmukhi',sans-serif";

function apiUrl(type, q) {
    if (type === '1') return `/api/banidb/search/first-letter?q=${encodeURIComponent(q)}`;
    return `/api/banidb/search/full-word?q=${encodeURIComponent(q)}`;
}

// ✅ Primary key is data.verses[]
function extractVerses(data) {
    if (Array.isArray(data?.verses) && data.verses.length > 0) return data.verses;
    if (Array.isArray(data?.results) && data.results.length > 0) return data.results;
    if (Array.isArray(data?.lines) && data.lines.length > 0) return data.lines;
    if (Array.isArray(data)) return data;
    return [];
}

export default function SearchResults() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const q = (searchParams.get('q') || '').trim();
    const type = (searchParams.get('type') || '2').toString();

    const [results, setResults] = useState([]);
    const [totalResults, setTotalResults] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!q) { setLoading(false); return; }
        setLoading(true);
        setError(null);

        fetch(apiUrl(type, q), { headers: { Accept: 'application/json' } })
            .then((r) => {
                if (!r.ok) throw new Error(`HTTP ${r.status}`);
                return r.json();
            })
            .then((data) => {
                // Capture total from resultsInfo if present
                if (data?.resultsInfo?.totalResults != null) {
                    setTotalResults(data.resultsInfo.totalResults);
                }
                setResults(extractVerses(data));
            })
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    }, [q, type]);

    const typeLabel = type === '1' ? 'First Letter' : 'Full Word';
    const count = totalResults ?? results.length;

    return (
        <div className="max-w-[min(980px,92vw)] mx-auto px-4 pb-16 pt-6">

            {/* Back + heading */}
            <div className="mb-8">
                <Link
                    to="/"
                    className="inline-flex items-center gap-1.5 text-white/40
                     hover:text-white/70 text-sm mb-4 transition-colors"
                    style={{ fontFamily: 'system-ui,sans-serif' }}
                >
                    ← Home
                </Link>

                <h1
                    className="text-white/80 text-lg font-medium"
                    style={{ fontFamily: 'system-ui,sans-serif' }}
                >
                    {q ? `Results for "${q}" · ${typeLabel}` : 'Search Results'}
                </h1>

                {!loading && !error && (
                    <p className="text-white/35 text-sm mt-1"
                        style={{ fontFamily: 'system-ui,sans-serif' }}>
                        {count} result{count !== 1 ? 's' : ''} found
                    </p>
                )}
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
                    style={{ fontFamily: 'system-ui,sans-serif' }}>
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

            {/* Results grid */}
            {!loading && !error && results.length > 0 && (
                <div
                    className="grid gap-3"
                    style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}
                >
                    {results.map((v, i) => {
                        const { gurmukhi, ang, lineNo } = parseVerseItem(v);
                        if (!gurmukhi) return null;
                        return (
                            <ResultCard
                                key={i}
                                gurmukhi={gurmukhi}
                                ang={ang}
                                lineNo={lineNo}
                                onClick={() => ang && navigate(`/reader/${ang}`)}
                            />
                        );
                    })}
                </div>
            )}
        </div>
    );
}

// ─── Result card ──────────────────────────────────────────────────────────────
function ResultCard({ gurmukhi, ang, lineNo, onClick }) {
    const meta = [
        ang ? `Ang ${ang}` : null,
        lineNo ? `Line ${lineNo}` : null,
    ].filter(Boolean).join(' · ');

    return (
        <button
            type="button"
            onClick={onClick}
            className="group text-left w-full
                 px-5 py-4 rounded-[18px]
                 border border-white/18 hover:border-white/32
                 bg-white/[0.07] hover:bg-white/[0.12]
                 backdrop-blur-md
                 shadow-[0_4px_18px_rgba(0,0,0,0.18)]
                 hover:shadow-[0_8px_28px_rgba(0,0,0,0.28)]
                 hover:-translate-y-0.5
                 transition-all duration-200 ease-out
                 focus-visible:outline focus-visible:outline-2
                 focus-visible:outline-white/50"
        >
            <p
                className="text-white leading-relaxed mb-2 group-hover:text-white/95"
                style={{
                    fontFamily: GURBANI_FONT,
                    fontSize: 'clamp(0.95rem, 2vw, 1.05rem)',
                    lineHeight: 1.7,
                }}
            >
                {gurmukhi}
            </p>

            {meta && (
                <p className="text-white/40 text-xs"
                    style={{ fontFamily: 'system-ui,sans-serif' }}>
                    {meta}
                </p>
            )}
        </button>
    );
}