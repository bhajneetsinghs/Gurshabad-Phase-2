import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { parseVerseItem, searchRaw } from '../../services/gurbaniApi';

const GURBANI_FONT = "'Noto Sans Gurmukhi','Gurmukhi MN','Kohinoor Gurmukhi',sans-serif";
const UI_FONT = 'system-ui,-apple-system,sans-serif';

// Detect if string contains Gurmukhi Unicode characters
const isGurmukhi = (s) => /[\u0A00-\u0A7F]/.test(s);

export default function SearchBar() {
    const navigate = useNavigate();

    const [query, setQuery] = useState('');
    const [searchType, setSearchType] = useState('4'); // default: Romanized (type 4)
    const [liveResults, setLiveResults] = useState([]);
    const [liveLoading, setLiveLoading] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);

    const wrapRef = useRef(null);
    const inputRef = useRef(null);
    const abortRef = useRef(null);
    const timerRef = useRef(null);
    const tokenRef = useRef(0);

    // ── Submit ─────────────────────────────────────────────────────────────────
    function handleSubmit(e) {
        e.preventDefault();
        const q = query.trim();
        if (!q) return;
        setShowDropdown(false);

        // Ang search — navigate directly
        if (searchType === '5') {
            let ang = parseInt(q, 10);
            if (!Number.isFinite(ang)) { inputRef.current?.focus(); return; }
            ang = Math.max(1, Math.min(1430, ang));
            navigate(`/reader/${ang}`);
            return;
        }

        navigate(`/search?q=${encodeURIComponent(q)}&type=${searchType}`);
    }

    // ── Live search ────────────────────────────────────────────────────────────
    const runLive = useCallback(async (q, type) => {
        if (!q || q.length < 1 || type === '5') {
            setLiveResults([]);
            setShowDropdown(false);
            return;
        }

        if (abortRef.current) abortRef.current.abort();
        abortRef.current = new AbortController();
        const myToken = ++tokenRef.current;

        setLiveLoading(true);
        setShowDropdown(true);

        try {
            const { verses } = await searchRaw(type, q);
            if (myToken !== tokenRef.current) return;
            setLiveResults(verses.slice(0, 8));
        } catch (err) {
            if (err.name === 'AbortError') return;
            setLiveResults([]);
        } finally {
            if (myToken === tokenRef.current) setLiveLoading(false);
        }
    }, []);

    // Debounce 180ms
    useEffect(() => {
        clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => runLive(query.trim(), searchType), 180);
        return () => clearTimeout(timerRef.current);
    }, [query, searchType, runLive]);

    // Close on outside click
    useEffect(() => {
        const h = (e) => {
            if (wrapRef.current && !wrapRef.current.contains(e.target))
                setShowDropdown(false);
        };
        document.addEventListener('mousedown', h);
        return () => document.removeEventListener('mousedown', h);
    }, []);

    // ── Placeholder text per search type ──────────────────────────────────────
    const placeholder = {
        '1': 'First letters e.g. ਸ ਨ ਕ ਪ',
        '2': 'ਗੁਰਬਾਣੀ ਖੋਜ (Gurmukhi)',
        '4': 'Type in Roman e.g. sat naam...',
        '5': 'Enter Ang number…',
    }[searchType] ?? 'Search…';

    // ── Render ─────────────────────────────────────────────────────────────────
    return (
        <div ref={wrapRef} className="relative w-full">
            <form
                onSubmit={handleSubmit}
                className="flex flex-row flex-nowrap items-center gap-3
                   px-4 py-3 rounded-2xl
                   border border-white/18 bg-white/[0.06]
                   backdrop-blur-lg"
            >
                {/* Search type */}
                <select
                    value={searchType}
                    onChange={(e) => {
                        setSearchType(e.target.value);
                        setQuery('');
                        setLiveResults([]);
                        setShowDropdown(false);
                        inputRef.current?.focus();
                    }}
                    aria-label="Search type"
                    className="flex-none appearance-none
                     border border-white/25 rounded-xl
                     bg-white/10 text-white
                     px-3 py-2 pr-8 text-sm
                     focus:outline-none focus:bg-[rgb(0,23,49)]
                     hover:bg-white/15 cursor-pointer transition-colors"
                    style={{
                        fontFamily: UI_FONT,
                        backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='rgba(255,255,255,.55)'/%3E%3C/svg%3E\")",
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'right 10px center',
                    }}
                >
                    <option value="4">Roman (sat naam…)</option>
                    <option value="1">First Letter (Gurmukhi)</option>
                    <option value="2">Full Word (Gurmukhi)</option>
                    <option value="5">Ang Number</option>
                </select>

                {/* Input */}
                <input
                    ref={inputRef}
                    type="search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => liveResults.length > 0 && setShowDropdown(true)}
                    inputMode="text"
                    autoComplete="off"
                    autoCapitalize="off"
                    spellCheck={false}
                    dir="ltr"
                    lang={isGurmukhi(query) ? 'pa' : 'en'}
                    placeholder={placeholder}
                    className="flex-1 min-w-0
                     border border-white/25 rounded-xl
                     bg-white/10 text-white placeholder-white/40
                     px-3 py-2 text-base
                     focus:outline-none focus:bg-white/14 focus:border-white/45
                     focus:ring-[3px] focus:ring-white/8
                     transition-all duration-150
                     [&::-webkit-search-cancel-button]:appearance-none
                     [&::-webkit-search-decoration]:hidden"
                    style={{
                        fontFamily: isGurmukhi(query) ? GURBANI_FONT : UI_FONT,
                        letterSpacing: isGurmukhi(query) ? '0.15px' : 'normal',
                    }}
                />

                {/* Submit */}
                <button
                    type="submit"
                    className="flex-none px-5 py-2 rounded-xl text-sm font-medium
                     border border-white/25 bg-white/15 text-white
                     hover:bg-white/24 hover:border-white/45
                     active:scale-95 transition-all cursor-pointer"
                    style={{ fontFamily: UI_FONT }}
                >
                    Search
                </button>
            </form>

            {/* Search type hint */}
            {searchType === '4' && (
                <p className="mt-1.5 text-white/25 text-xs text-center"
                    style={{ fontFamily: UI_FONT }}>
                    Type Roman phonetics — BaniDB converts automatically
                </p>
            )}
            {searchType === '2' && (
                <p className="mt-1.5 text-white/25 text-xs text-center"
                    style={{ fontFamily: UI_FONT }}>
                    Use your Gurmukhi keyboard to type
                </p>
            )}

            {/* Live dropdown */}
            {showDropdown && query.trim().length > 0 && searchType !== '5' && (
                <div
                    className="absolute left-0 right-0 top-full mt-2 z-50
                     rounded-2xl border border-white/15 overflow-hidden
                     shadow-[0_20px_60px_rgba(0,0,0,0.65)]"
                    style={{
                        background: 'rgba(10,13,26,0.97)',
                        backdropFilter: 'blur(24px)',
                        WebkitBackdropFilter: 'blur(24px)',
                    }}
                >
                    {liveLoading && (
                        <div className="flex items-center justify-center gap-2 px-5 py-5">
                            <div className="w-4 h-4 rounded-full border-2 border-white/20
                              border-t-white/60 animate-spin" />
                            <span className="text-white/35 text-sm" style={{ fontFamily: UI_FONT }}>
                                Searching…
                            </span>
                        </div>
                    )}

                    {!liveLoading && liveResults.length === 0 && (
                        <p className="px-5 py-5 text-white/35 text-sm text-center"
                            style={{ fontFamily: UI_FONT }}>
                            No results found
                        </p>
                    )}

                    {!liveLoading && liveResults.map((v, i) => {
                        const { gurmukhi, ang, translit } = parseVerseItem(v);
                        if (!gurmukhi) return null;
                        return (
                            <button
                                key={i}
                                type="button"
                                onClick={() => {
                                    setShowDropdown(false);
                                    if (ang) navigate(`/reader/${ang}`);
                                }}
                                className="w-full text-left px-5 py-3.5
                           border-b border-white/[0.06] last:border-0
                           hover:bg-white/[0.07] transition-colors duration-100"
                            >
                                <p className="text-white text-sm leading-relaxed truncate mb-0.5"
                                    style={{ fontFamily: GURBANI_FONT }}>
                                    {gurmukhi}
                                </p>
                                <div className="flex items-center justify-between gap-3">
                                    {translit && (
                                        <p className="text-white/35 text-xs truncate italic"
                                            style={{ fontFamily: UI_FONT }}>
                                            {translit}
                                        </p>
                                    )}
                                    {ang && (
                                        <span className="flex-none text-white/30 text-xs"
                                            style={{ fontFamily: UI_FONT }}>
                                            Ang {ang}
                                        </span>
                                    )}
                                </div>
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
}