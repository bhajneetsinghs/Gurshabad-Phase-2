// // import { useDispatch } from "react-redux";
// // import { setQuery } from "./searchSlice";

// // export default function SearchBar() {

// //     const dispatch = useDispatch();

// //     const handleChange = (e) => {
// //         dispatch(setQuery(e.target.value))
// //     }

// //     return (

// //         <form className="flex gap-4 p-4 rounded-xl border border-white/20 bg-white/10 backdrop-blur">

// //             <select className="bg-white/10 text-white border border-white/20 rounded px-3 py-2">

// //                 <option>First Letter</option>
// //                 <option>Full Word</option>
// //                 <option>Ang</option>

// //             </select>

// //             <input
// //                 onChange={handleChange}
// //                 placeholder="ਗੁਰਬਾਣੀ ਖੋਜ"
// //                 className="flex-1 bg-white/10 border border-white/20 text-white rounded px-3 py-2"
// //             />

// //             <button className="px-5 py-2 bg-white/20 text-white rounded hover:bg-white/30">
// //                 Search
// //             </button>

// //         </form>

// //     )
// // }

// // src/components/search/SearchBar.jsx
// // Replaces: search.js + search-live.js
// //
// // Behaviour:
// //   Type 5 (Ang)        → navigate('/reader/:ang')
// //   Type 1 (First letter) → navigate('/search?q=...&type=1')
// //   Type 2 (Full word)    → navigate('/search?q=...&type=2')
// //
// // Live dropdown fires after 180ms debounce (like search-live.js),
// // shows up to 8 results, closes on outside click.

// import { useState, useEffect, useRef, useCallback } from 'react';
// import { useNavigate } from 'react-router-dom';

// const GURBANI_FONT = "'Noto Sans Gurmukhi','Gurmukhi MN','Kohinoor Gurmukhi',sans-serif";

// // ─── Helpers (mirrors search-results.js / search-live.js) ────────────────────
// function pickStr(o, keys) {
//     for (const k of keys) {
//         const v = o?.[k];
//         if (typeof v === 'string' && v.trim()) return v.trim();
//         if (typeof v === 'number' && Number.isFinite(v)) return String(v);
//     }
//     return '';
// }

// function getGurmukhi(v) {
//     return (
//         pickStr(v?.verse, ['unicode', 'gurmukhi']) ||
//         pickStr(v?.line, ['unicode', 'gurmukhi']) ||
//         pickStr(v, ['unicode', 'gurmukhi'])
//     );
// }

// function getAng(v) {
//     const raw =
//         pickStr(v, ['pageNo', 'page', 'ang', 'sourcePage']) ||
//         pickStr(v?.line, ['sourcePage']) ||
//         pickStr(v?.verse, ['page', 'sourcePage']);
//     const n = parseInt(raw, 10);
//     return Number.isFinite(n) ? n : null;
// }

// function apiUrl(type, q) {
//     if (type === '1') return `/api/banidb/search/first-letter?q=${encodeURIComponent(q)}`;
//     if (type === '2') return `/api/banidb/search/full-word?q=${encodeURIComponent(q)}`;
//     return '';
// }

// // ─── Component ────────────────────────────────────────────────────────────────
// export default function SearchBar() {
//     const navigate = useNavigate();

//     const [query, setQuery] = useState('');
//     const [searchType, setSearchType] = useState('2');
//     const [liveResults, setLiveResults] = useState([]);
//     const [liveLoading, setLiveLoading] = useState(false);
//     const [showDropdown, setShowDropdown] = useState(false);

//     const inputRef = useRef(null);
//     const wrapRef = useRef(null);
//     const abortRef = useRef(null);
//     const timerRef = useRef(null);
//     const tokenRef = useRef(0);

//     // ── Submit ──────────────────────────────────────────────────────────────────
//     function handleSubmit(e) {
//         e.preventDefault();
//         const q = query.trim();
//         if (!q) return;

//         setShowDropdown(false);

//         // Type 5 = Ang
//         if (searchType === '5') {
//             let ang = parseInt(q, 10);
//             if (!Number.isFinite(ang)) { inputRef.current?.focus(); return; }
//             ang = Math.max(1, Math.min(1430, ang));
//             navigate(`/reader/${ang}`);
//             return;
//         }

//         // Type 1 or 2 → search results page
//         navigate(`/search?q=${encodeURIComponent(q)}&type=${searchType}`);
//     }

//     // ── Live search ─────────────────────────────────────────────────────────────
//     const runLive = useCallback(async (q, type) => {
//         if (q.length < 1 || type === '5') {
//             setLiveResults([]);
//             setShowDropdown(false);
//             return;
//         }

//         const url = apiUrl(type, q);
//         if (!url) return;

//         if (abortRef.current) abortRef.current.abort();
//         abortRef.current = new AbortController();
//         const myToken = ++tokenRef.current;

//         setLiveLoading(true);
//         setShowDropdown(true);

//         try {
//             const res = await fetch(url, {
//                 signal: abortRef.current.signal,
//                 headers: { Accept: 'application/json' },
//             });
//             if (!res.ok) throw new Error(`HTTP ${res.status}`);
//             const data = await res.json();

//             if (myToken !== tokenRef.current) return; // stale

//             const arr = Array.isArray(data?.results) ? data.results
//                 : Array.isArray(data?.lines) ? data.lines
//                     : Array.isArray(data) ? data
//                         : [];

//             setLiveResults(arr.slice(0, 8));
//         } catch (err) {
//             if (err.name === 'AbortError') return;
//             setLiveResults([]);
//         } finally {
//             if (myToken === tokenRef.current) setLiveLoading(false);
//         }
//     }, []);

//     // Debounce live search 180ms (same as original)
//     useEffect(() => {
//         clearTimeout(timerRef.current);
//         timerRef.current = setTimeout(() => runLive(query.trim(), searchType), 180);
//         return () => clearTimeout(timerRef.current);
//     }, [query, searchType, runLive]);

//     // Close dropdown on outside click
//     useEffect(() => {
//         const h = (e) => {
//             if (wrapRef.current && !wrapRef.current.contains(e.target)) {
//                 setShowDropdown(false);
//             }
//         };
//         document.addEventListener('mousedown', h);
//         return () => document.removeEventListener('mousedown', h);
//     }, []);

//     // ── Render ──────────────────────────────────────────────────────────────────
//     return (
//         <div ref={wrapRef} className="relative w-full">
//             <form
//                 onSubmit={handleSubmit}
//                 className={[
//                     'flex flex-row flex-nowrap items-center gap-3',
//                     'px-4 py-3 rounded-2xl',
//                     'border border-white/18 bg-white/[0.06]',
//                     'backdrop-blur-lg',
//                 ].join(' ')}
//             >
//                 {/* Search type dropdown */}
//                 <select
//                     value={searchType}
//                     onChange={(e) => setSearchType(e.target.value)}
//                     aria-label="Search type"
//                     className={[
//                         'flex-none appearance-none',
//                         'border border-white/25 rounded-xl',
//                         'bg-white/10 text-white',
//                         'px-3 py-2 pr-8 text-sm',
//                         'focus:outline-none focus:bg-[rgb(0,23,49)] focus:border-[rgb(0,23,49)]',
//                         'hover:bg-white/15 cursor-pointer transition-colors duration-150',
//                     ].join(' ')}
//                     style={{
//                         fontFamily: 'system-ui,-apple-system,sans-serif',
//                         backgroundImage:
//                             "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='rgba(255,255,255,.55)'/%3E%3C/svg%3E\")",
//                         backgroundRepeat: 'no-repeat',
//                         backgroundPosition: 'right 10px center',
//                     }}
//                 >
//                     <option value="1">First Letter</option>
//                     <option value="2">Full Word</option>
//                     <option value="5">Ang</option>
//                 </select>

//                 {/* Gurmukhi input */}
//                 <input
//                     ref={inputRef}
//                     type="search"
//                     value={query}
//                     onChange={(e) => setQuery(e.target.value)}
//                     onFocus={() => liveResults.length > 0 && setShowDropdown(true)}
//                     inputMode="text"
//                     autoComplete="off"
//                     autoCapitalize="off"
//                     spellCheck={false}
//                     dir="ltr"
//                     lang="pa"
//                     placeholder="ਗੁਰਬਾਣੀ ਖੋਜ"
//                     className={[
//                         'flex-1 min-w-0',
//                         'border border-white/25 rounded-xl',
//                         'bg-white/10 text-white placeholder-white/45',
//                         'px-3 py-2 text-base',
//                         'focus:outline-none focus:bg-white/14 focus:border-white/45',
//                         'focus:ring-[3px] focus:ring-white/8',
//                         'transition-all duration-150',
//                         // hide native clear button
//                         '[&::-webkit-search-cancel-button]:appearance-none',
//                         '[&::-webkit-search-decoration]:hidden',
//                     ].join(' ')}
//                     style={{ fontFamily: GURBANI_FONT, letterSpacing: '0.15px' }}
//                 />

//                 {/* Submit */}
//                 <button
//                     type="submit"
//                     className={[
//                         'flex-none px-5 py-2 rounded-xl text-sm font-medium',
//                         'border border-white/25 bg-white/15 text-white',
//                         'hover:bg-white/24 hover:border-white/45',
//                         'active:scale-95 transition-all duration-150 cursor-pointer',
//                     ].join(' ')}
//                     style={{ fontFamily: 'system-ui,-apple-system,sans-serif' }}
//                 >
//                     Search
//                 </button>
//             </form>

//             {/* ── Live dropdown ── */}
//             {showDropdown && (query.trim().length > 0) && searchType !== '5' && (
//                 <div
//                     className={[
//                         'absolute left-0 right-0 top-full mt-2 z-50',
//                         'rounded-2xl border border-white/15 overflow-hidden',
//                         'shadow-[0_20px_60px_rgba(0,0,0,0.6)]',
//                     ].join(' ')}
//                     style={{
//                         background: 'rgba(12,15,28,0.92)',
//                         backdropFilter: 'blur(20px)',
//                         WebkitBackdropFilter: 'blur(20px)',
//                     }}
//                 >
//                     {liveLoading && (
//                         <div
//                             className="px-5 py-4 text-white/40 text-sm text-center"
//                             style={{ fontFamily: 'system-ui,sans-serif' }}
//                         >
//                             Searching…
//                         </div>
//                     )}

//                     {!liveLoading && liveResults.length === 0 && (
//                         <div
//                             className="px-5 py-4 text-white/35 text-sm text-center"
//                             style={{ fontFamily: 'system-ui,sans-serif' }}
//                         >
//                             No results
//                         </div>
//                     )}

//                     {!liveLoading && liveResults.map((v, i) => {
//                         const gurmukhi = getGurmukhi(v);
//                         const ang = getAng(v);
//                         if (!gurmukhi) return null;
//                         return (
//                             <button
//                                 key={i}
//                                 type="button"
//                                 onClick={() => {
//                                     setShowDropdown(false);
//                                     if (ang) navigate(`/reader/${ang}`);
//                                 }}
//                                 className={[
//                                     'w-full text-left px-5 py-3.5',
//                                     'border-b border-white/[0.07] last:border-0',
//                                     'hover:bg-white/[0.07] transition-colors duration-100',
//                                     'flex items-baseline justify-between gap-4',
//                                 ].join(' ')}
//                             >
//                                 {/* Gurmukhi text */}
//                                 <span
//                                     className="text-white text-sm leading-relaxed truncate"
//                                     style={{ fontFamily: GURBANI_FONT }}
//                                 >
//                                     {gurmukhi}
//                                 </span>
//                                 {/* Ang badge */}
//                                 {ang && (
//                                     <span
//                                         className="flex-none text-white/35 text-xs"
//                                         style={{ fontFamily: 'system-ui,sans-serif' }}
//                                     >
//                                         Ang {ang}
//                                     </span>
//                                 )}
//                             </button>
//                         );
//                     })}
//                 </div>
//             )}
//         </div>
//     );
// }

// src/components/search/SearchBar.jsx
// Replaces: search.js + search-live.js
// Search response shape: { resultsInfo, verses: [...] }

import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { parseVerseItem } from '../../services/gurbaniApi';

const GURBANI_FONT = "'Noto Sans Gurmukhi','Gurmukhi MN','Kohinoor Gurmukhi',sans-serif";

function apiUrl(type, q) {
    if (type === '1') return `/api/banidb/search/first-letter?q=${encodeURIComponent(q)}`;
    if (type === '2') return `/api/banidb/search/full-word?q=${encodeURIComponent(q)}`;
    return '';
}

// ✅ Parse any search response shape — primary is data.verses[]
function extractVerses(data) {
    if (Array.isArray(data?.verses) && data.verses.length > 0) return data.verses;
    if (Array.isArray(data?.results) && data.results.length > 0) return data.results;
    if (Array.isArray(data?.lines) && data.lines.length > 0) return data.lines;
    if (Array.isArray(data)) return data;
    return [];
}

export default function SearchBar() {
    const navigate = useNavigate();

    const [query, setQuery] = useState('');
    const [searchType, setSearchType] = useState('2');
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
        if (q.length < 1 || type === '5') {
            setLiveResults([]);
            setShowDropdown(false);
            return;
        }
        const url = apiUrl(type, q);
        if (!url) return;

        if (abortRef.current) abortRef.current.abort();
        abortRef.current = new AbortController();
        const myToken = ++tokenRef.current;

        setLiveLoading(true);
        setShowDropdown(true);

        try {
            const res = await fetch(url, {
                signal: abortRef.current.signal,
                headers: { Accept: 'application/json' },
            });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const data = await res.json();
            if (myToken !== tokenRef.current) return;

            const verses = extractVerses(data);
            setLiveResults(verses.slice(0, 8));
        } catch (err) {
            if (err.name === 'AbortError') return;
            setLiveResults([]);
        } finally {
            if (myToken === tokenRef.current) setLiveLoading(false);
        }
    }, []);

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
                {/* Type dropdown */}
                <select
                    value={searchType}
                    onChange={(e) => setSearchType(e.target.value)}
                    aria-label="Search type"
                    className="flex-none appearance-none
                     border border-white/25 rounded-xl
                     bg-white/10 text-white
                     px-3 py-2 pr-8 text-sm
                     focus:outline-none focus:bg-[rgb(0,23,49)]
                     hover:bg-white/15 cursor-pointer transition-colors"
                    style={{
                        fontFamily: 'system-ui,-apple-system,sans-serif',
                        backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='rgba(255,255,255,.55)'/%3E%3C/svg%3E\")",
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'right 10px center',
                    }}
                >
                    <option value="1">First Letter</option>
                    <option value="2">Full Word</option>
                    <option value="5">Ang</option>
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
                    lang="pa"
                    placeholder="ਗੁਰਬਾਣੀ ਖੋਜ"
                    className="flex-1 min-w-0
                     border border-white/25 rounded-xl
                     bg-white/10 text-white placeholder-white/45
                     px-3 py-2 text-base
                     focus:outline-none focus:bg-white/14 focus:border-white/45
                     focus:ring-[3px] focus:ring-white/8
                     transition-all duration-150
                     [&::-webkit-search-cancel-button]:appearance-none
                     [&::-webkit-search-decoration]:hidden"
                    style={{ fontFamily: GURBANI_FONT, letterSpacing: '0.15px' }}
                />

                {/* Submit */}
                <button
                    type="submit"
                    className="flex-none px-5 py-2 rounded-xl text-sm font-medium
                     border border-white/25 bg-white/15 text-white
                     hover:bg-white/24 hover:border-white/45
                     active:scale-95 transition-all cursor-pointer"
                    style={{ fontFamily: 'system-ui,-apple-system,sans-serif' }}
                >
                    Search
                </button>
            </form>

            {/* Live dropdown */}
            {showDropdown && query.trim().length > 0 && searchType !== '5' && (
                <div
                    className="absolute left-0 right-0 top-full mt-2 z-50
                     rounded-2xl border border-white/15 overflow-hidden
                     shadow-[0_20px_60px_rgba(0,0,0,0.6)]"
                    style={{
                        background: 'rgba(12,15,28,0.95)',
                        backdropFilter: 'blur(20px)',
                        WebkitBackdropFilter: 'blur(20px)',
                    }}
                >
                    {liveLoading && (
                        <p className="px-5 py-4 text-white/40 text-sm text-center"
                            style={{ fontFamily: 'system-ui,sans-serif' }}>
                            Searching…
                        </p>
                    )}

                    {!liveLoading && liveResults.length === 0 && (
                        <p className="px-5 py-4 text-white/35 text-sm text-center"
                            style={{ fontFamily: 'system-ui,sans-serif' }}>
                            No results
                        </p>
                    )}

                    {!liveLoading && liveResults.map((v, i) => {
                        const { gurmukhi, ang } = parseVerseItem(v);
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
                           border-b border-white/[0.07] last:border-0
                           hover:bg-white/[0.07] transition-colors duration-100
                           flex items-baseline justify-between gap-4"
                            >
                                <span
                                    className="text-white text-sm leading-relaxed truncate"
                                    style={{ fontFamily: GURBANI_FONT }}
                                >
                                    {gurmukhi}
                                </span>
                                {ang && (
                                    <span className="flex-none text-white/35 text-xs"
                                        style={{ fontFamily: 'system-ui,sans-serif' }}>
                                        Ang {ang}
                                    </span>
                                )}
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
}