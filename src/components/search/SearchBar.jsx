// import { useState, useEffect, useRef, useCallback } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { parseVerseItem, searchRaw } from '../../services/gurbaniApi';

// const GURBANI_FONT = "'Noto Sans Gurmukhi','Gurmukhi MN','Kohinoor Gurmukhi',sans-serif";
// const UI_FONT = 'system-ui,-apple-system,sans-serif';

// const isGurmukhiType = (t) => t === '1' || t === '2';

// const DIG = ['੦', '੧', '੨', '੩', '੪', '੫', '੬', '੭', '੮', '੯'];
// const MAP = {
//     a: 'ਅ', b: 'ਬ', c: 'ਚ', d: 'ਦ', e: 'ਇ', f: 'ਫ', g: 'ਗ', h: 'ਹ', i: 'ਇ', j: 'ਜ',
//     k: 'ਕ', l: 'ਲ', m: 'ਮ', n: 'ਨ', o: 'ਉ', p: 'ਪ', q: 'ਕ', r: 'ਰ', s: 'ਸ', t: 'ਤ',
//     u: 'ਉ', v: 'ਵ', w: 'ਵ', x: 'ਕਸ', y: 'ਯ', z: 'ਜ਼',
//     A: 'ਆ', B: 'ਭ', C: 'ਛ', D: 'ਡ', E: 'ਏ', F: 'ਫ਼', G: 'ਘ', H: 'ਃ', I: 'ਈ', J: 'ਝ',
//     K: 'ਖ', L: 'ਲ਼', M: 'ੰ', N: 'ਣ', O: 'ਓ', P: 'ਫ਼', Q: 'ਕ਼', R: 'ੜ', S: 'ਸ਼', T: 'ਟ',
//     U: 'ਊ', V: 'ਵ', W: 'ਵ', X: 'ਖ਼', Y: 'ਯ', Z: 'ਗ਼',
// };

// function romanToGurmukhi(s) {
//     return s.replace(/[0-9A-Za-z]/g, ch =>
//         /[0-9]/.test(ch) ? DIG[+ch] : (MAP[ch] || ch)
//     );
// }

// export default function SearchBar({
//     initialQuery = '',
//     initialType = '1',
//     hideDropdown = false,
//     compact = false,
//     hideHint = false,
// }) {
//     const navigate = useNavigate();

//     const [query, setQuery] = useState(initialQuery);
//     const [searchType, setSearchType] = useState(initialType);
//     const [liveResults, setLiveResults] = useState([]);
//     const [liveLoading, setLiveLoading] = useState(false);
//     const [showDropdown, setShowDropdown] = useState(false);

//     const wrapRef = useRef(null);
//     const inputRef = useRef(null);
//     const abortRef = useRef(null);
//     const timerRef = useRef(null);
//     const tokenRef = useRef(0);

//     useEffect(() => {
//         setQuery(initialQuery);
//         setSearchType(initialType);
//     }, [initialQuery, initialType]);

//     function handleSubmit(e) {
//         e.preventDefault();
//         const q = query.trim();
//         if (!q) return;
//         setShowDropdown(false);

//         if (searchType === '5') {
//             let ang = parseInt(q, 10);
//             if (!Number.isFinite(ang)) { inputRef.current?.focus(); return; }
//             ang = Math.max(1, Math.min(1430, ang));
//             navigate(`/reader/${ang}`);
//             return;
//         }

//         navigate(`/search?q=${encodeURIComponent(q)}&type=${searchType}`);
//     }

//     function handleInputChange(e) {
//         const val = e.target.value;
//         if (isGurmukhiType(searchType)) {
//             setQuery(romanToGurmukhi(val));
//         } else {
//             setQuery(val);
//         }
//     }

//     function handleTypeChange(e) {
//         setSearchType(e.target.value);
//         setQuery('');
//         setLiveResults([]);
//         setShowDropdown(false);
//         inputRef.current?.focus();
//     }

//     const runLive = useCallback(async (q, type) => {
//         if (!q || q.length < 1 || type === '5' || hideDropdown) {
//             setLiveResults([]);
//             setShowDropdown(false);
//             return;
//         }

//         if (abortRef.current) abortRef.current.abort();
//         abortRef.current = new AbortController();
//         const myToken = ++tokenRef.current;

//         setLiveLoading(true);
//         setShowDropdown(true);

//         try {
//             const { verses } = await searchRaw(type, q);
//             if (myToken !== tokenRef.current) return;
//             setLiveResults(verses.slice(0, 8));
//         } catch (err) {
//             if (err.name === 'AbortError') return;
//             setLiveResults([]);
//         } finally {
//             if (myToken === tokenRef.current) setLiveLoading(false);
//         }
//     }, [hideDropdown]);

//     useEffect(() => {
//         clearTimeout(timerRef.current);
//         timerRef.current = setTimeout(() => runLive(query.trim(), searchType), 180);
//         return () => clearTimeout(timerRef.current);
//     }, [query, searchType, runLive]);

//     useEffect(() => {
//         const h = (e) => {
//             if (wrapRef.current && !wrapRef.current.contains(e.target))
//                 setShowDropdown(false);
//         };
//         document.addEventListener('mousedown', h);
//         return () => document.removeEventListener('mousedown', h);
//     }, []);

//     const placeholder = {
//         '1': 'ਪਹਿਲੇ ਅੱਖਰ ਟਾਈਪ ਕਰੋ…',
//         '2': 'ਗੁਰਬਾਣੀ ਖੋਜ ਕਰੋ…',
//         '5': 'ਅੰਗ ਨੰਬਰ…',
//     }[searchType] ?? 'Search…';

//     const useGurmukhiInput = isGurmukhiType(searchType);
//     const dropdownVisible = !hideDropdown && showDropdown && query.trim().length > 0 && searchType !== '5';

//     return (
//         <>
//             <style>{`
//                 .sb-root {
//                     position: relative;
//                     width: 100%;
//                     z-index: 1001; /* ABOVE overlay */
//                 }
//                 /* ─── Search bar pill ─── */
//                 .sb-pill {
//                     display: flex;
//                     align-items: center;
//                     gap: 0;
//                     width: 100%;
//                     border-radius: 16px;
//                     overflow: hidden;
//                     background: rgba(255, 255, 255, 0.07);
//                     border: 1px solid rgba(255, 255, 255, 0.12);
//                     backdrop-filter: blur(20px);
//                     -webkit-backdrop-filter: blur(20px);
//                     box-shadow:
//                         0 2px 12px rgba(0,0,0,0.3),
//                         inset 0 1px 0 rgba(255,255,255,0.08);
//                     transition: border-color 0.2s, box-shadow 0.2s;
//                 }
//                 .sb-pill:focus-within {
//                     border-color: rgba(255, 255, 255, 0.2);
//                     box-shadow:
//                         0 4px 24px rgba(0,0,0,0.4),
//                         inset 0 1px 0 rgba(255,255,255,0.1);
//                 }

//                 .sb-select-wrap {
//                     display: flex;
//                     align-items: center;
//                     padding: 0 4px 0 2px;
//                     flex-shrink: 0;
//                 }

//                 .sb-select {
//                     appearance: none;
//                     -webkit-appearance: none;
//                     background: rgba(255,255,255,0.08);
//                     border: none;
//                     border-radius: 10px;
//                     color: rgba(255,255,255,0.7);
//                     font-size: 0.75rem;
//                     padding: 7px 26px 7px 10px;
//                     margin: 5px 0 5px 5px;
//                     cursor: pointer;
//                     background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='rgba(255,255,255,0.35)'/%3E%3C/svg%3E");
//                     background-repeat: no-repeat;
//                     background-position: right 8px center;
//                     outline: none;
//                     white-space: nowrap;
//                     max-width: 130px;
//                     transition: background 0.15s;
//                 }
//                 .sb-select:focus { background-color: rgba(255,255,255,0.13); }

//                 .sb-sep {
//                     width: 1px;
//                     height: 22px;
//                     background: rgba(255,255,255,0.1);
//                     flex-shrink: 0;
//                     margin: 0 2px;
//                 }

//                 .sb-input {
//                     flex: 1;
//                     min-width: 0;
//                     background: transparent;
//                     border: none;
//                     outline: none;
//                     color: rgba(255,255,255,0.9);
//                     caret-color: rgba(255,255,255,0.55);
//                     padding: 12px 10px;
//                 }
//                 .sb-input::placeholder { color: rgba(255,255,255,0.22); }
//                 .sb-input::-webkit-search-cancel-button,
//                 .sb-input::-webkit-search-decoration { display: none; appearance: none; }

//                 .sb-go {
//                     flex-shrink: 0;
//                     background: rgba(255,255,255,0.12);
//                     border: none;
//                     border-left: 1px solid rgba(255,255,255,0.1);
//                     color: rgba(255,255,255,0.85);
//                     padding: 0 22px;
//                     height: 100%;
//                     min-height: 44px;
//                     font-size: 0.84rem;
//                     font-weight: 500;
//                     cursor: pointer;
//                     letter-spacing: 0.03em;
//                     transition: background 0.15s, color 0.15s;
//                 }
//                 .sb-go:hover {
//                     background: rgba(255,255,255,0.19);
//                     color: #fff;
//                 }
//                 .sb-go:active { background: rgba(255,255,255,0.09); }

//                 /* ─── Hint ─── */
//                 .sb-hint {
//                     margin-top: 9px;
//                     font-size: 0.71rem;
//                     text-align: center;
//                     color: rgba(255,255,255,0.2);
//                 }

//                 /* ─── Dropdown (above the bar, solid bg) ─── */
//                 .sb-dropdown {
//                     position: absolute;
//                     left: 0;
//                     right: 0;
//                     bottom: calc(100% + 10px);
//                     z-index: 1102;
//                     border-radius: 16px;
//                     overflow: hidden;
//                     background: #0d1226;
//                     border: 1px solid rgba(255,255,255,0.1);
//                     box-shadow:
//                         0 -4px 40px rgba(0,0,0,0.55),
//                         0 0 0 1px rgba(255,255,255,0.03) inset;
//                     max-height: 70vh;
//                     overflow-y: auto;
//                     scrollbar-width: thin;
//                     scrollbar-color: rgba(255,255,255,0.08) transparent;
//                 }
//                 .sb-dropdown::-webkit-scrollbar { width: 3px; }
//                 .sb-dropdown::-webkit-scrollbar-thumb {
//                     background: rgba(255,255,255,0.1);
//                     border-radius: 3px;
//                 }

//                 /* sticky header */
//                 .sb-dd-head {
//                     position: sticky;
//                     top: 0;
//                     z-index: 2;
//                     background: #0d1226;
//                     display: flex;
//                     align-items: center;
//                     justify-content: space-between;
//                     padding: 10px 16px 8px;
//                     border-bottom: 1px solid rgba(255,255,255,0.06);
//                 }
//                 .sb-dd-label {
//                     font-size: 0.63rem;
//                     font-weight: 700;
//                     letter-spacing: 0.13em;
//                     text-transform: uppercase;
//                     color: rgba(255,255,255,0.2);
//                 }

//                 .sb-spinner {
//                     width: 13px; height: 13px;
//                     border-radius: 50%;
//                     border: 2px solid rgba(255,255,255,0.07);
//                     border-top-color: rgba(255,255,255,0.4);
//                     animation: sbSpin 0.65s linear infinite;
//                 }
//                 @keyframes sbSpin { to { transform: rotate(360deg); } }

//                 /* rows */
//                 .sb-row {
//                     display: flex;
//                     align-items: center;
//                     justify-content: space-between;
//                     gap: 12px;
//                     width: 100%;
//                     text-align: left;
//                     background: transparent;
//                     border: none;
//                     border-bottom: 1px solid rgba(255,255,255,0.04);
//                     padding: 11px 16px;
//                     cursor: pointer;
//                     transition: background 0.1s;
//                 }
//                 .sb-row:last-child { border-bottom: none; }
//                 .sb-row:hover { background: rgba(255,255,255,0.04); }
//                 .sb-row:hover .sb-badge {
//                     background: rgba(200,165,80,0.15);
//                     border-color: rgba(200,165,80,0.3);
//                     color: rgba(220,190,120,0.85);
//                 }

//                 .sb-row-text {
//                     display: flex;
//                     flex-direction: column;
//                     gap: 3px;
//                     flex: 1;
//                     min-width: 0;
//                 }
//                 .sb-gurmukhi {
//                     font-size: 0.92rem;
//                     line-height: 1.55;
//                     color: rgba(255,255,255,0.87);
//                     white-space: nowrap;
//                     overflow: hidden;
//                     text-overflow: ellipsis;
//                 }
//                 .sb-translit {
//                     font-size: 0.7rem;
//                     color: rgba(255,255,255,0.27);
//                     font-style: italic;
//                     white-space: nowrap;
//                     overflow: hidden;
//                     text-overflow: ellipsis;
//                 }
//                 .sb-badge {
//                     flex-shrink: 0;
//                     font-size: 0.7rem;
//                     padding: 3px 10px;
//                     border-radius: 20px;
//                     background: rgba(255,255,255,0.05);
//                     border: 1px solid rgba(255,255,255,0.09);
//                     color: rgba(255,255,255,0.33);
//                     white-space: nowrap;
//                     transition: all 0.15s;
//                 }

//                 .sb-empty {
//                     padding: 20px 16px;
//                     text-align: center;
//                     font-size: 0.88rem;
//                     color: rgba(255,255,255,0.25);
//                     margin: 0;
//                 }
//                     /* ─── Background Blur Overlay ─── */
//                 .sb-overlay {
//                     position: fixed;
//                     inset: 0;
//                     z-index: 998;

//                 backdrop-filter: blur(10px);
//                 -webkit-backdrop-filter: blur(10px);

//                 background: rgba(10, 13, 26, 0.35);

//                 animation: sbFadeIn 0.15s ease;
//                 }
//                 `}
//             </style>


//             {/* ── Overlay (blur background) ── */}
//             {dropdownVisible && (
//                 <div
//                     className="sb-overlay"
//                     onClick={() => setShowDropdown(false)}
//                 />
//             )}

//             <div ref={wrapRef} className="sb-root">

//                 {/* ── Dropdown above ── */}
//                 {dropdownVisible && (
//                     <div className="sb-dropdown">
//                         <div className="sb-dd-head">
//                             <span className="sb-dd-label" style={{ fontFamily: UI_FONT }}>
//                                 Suggestions
//                             </span>
//                             {liveLoading && <div className="sb-spinner" />}
//                         </div>

//                         {!liveLoading && liveResults.length === 0 && (
//                             <p className="sb-empty" style={{ fontFamily: GURBANI_FONT }}>
//                                 ਕੋਈ ਨਤੀਜਾ ਨਹੀਂ ਮਿਲਿਆ
//                             </p>
//                         )}

//                         {!liveLoading && liveResults.map((v, i) => {
//                             const { gurmukhi, ang, translit } = parseVerseItem(v);
//                             if (!gurmukhi) return null;
//                             return (
//                                 <button
//                                     key={i}
//                                     type="button"
//                                     className="sb-row"
//                                     onClick={() => {
//                                         setShowDropdown(false);
//                                         if (ang) navigate(`/reader/${ang}`);
//                                     }}
//                                 >
//                                     <div className="sb-row-text">
//                                         <span className="sb-gurmukhi" style={{ fontFamily: GURBANI_FONT }}>
//                                             {gurmukhi}
//                                         </span>
//                                         {translit && (
//                                             <span className="sb-translit" style={{ fontFamily: UI_FONT }}>
//                                                 {translit}
//                                             </span>
//                                         )}
//                                     </div>
//                                     {ang && (
//                                         <span className="sb-badge" style={{ fontFamily: GURBANI_FONT }}>
//                                             ਪੰਨਾ {ang}
//                                         </span>
//                                     )}
//                                 </button>
//                             );
//                         })}
//                     </div>
//                 )}

//                 {/* ── Search pill ── */}
//                 <form
//                     className="sb-pill"
//                     onSubmit={handleSubmit}
//                     style={{ padding: compact ? '2px' : '0' }}
//                 >
//                     <div className="sb-select-wrap">
//                         <select
//                             value={searchType}
//                             onChange={handleTypeChange}
//                             aria-label="Search type"
//                             className="sb-select"
//                             style={{ fontFamily: UI_FONT }}
//                         >
//                             <option value="1" style={{ background: '#0d1226', color: '#fff' }}>
//                                 First Letter (Anywhere)
//                             </option>
//                             <option value="2" style={{ background: '#0d1226', color: '#fff' }}>
//                                 Full Word (Gurmukhi)
//                             </option>
//                             <option value="5" style={{ background: '#0d1226', color: '#fff' }}>
//                                 Page No.
//                             </option>
//                         </select>
//                     </div>

//                     <div className="sb-sep" />

//                     <input
//                         ref={inputRef}
//                         type="search"
//                         value={query}
//                         onChange={handleInputChange}
//                         onFocus={() => !hideDropdown && liveResults.length > 0 && setShowDropdown(true)}
//                         inputMode={searchType === '5' ? 'numeric' : 'text'}
//                         autoComplete="off"
//                         autoCapitalize="off"
//                         spellCheck={false}
//                         dir="ltr"
//                         lang={useGurmukhiInput ? 'pa' : 'en'}
//                         placeholder={placeholder}
//                         className="sb-input"
//                         style={{
//                             fontFamily: useGurmukhiInput ? GURBANI_FONT : UI_FONT,
//                             fontSize: compact ? '0.78rem' : '0.93rem',
//                             letterSpacing: useGurmukhiInput ? '0.15px' : 'normal',
//                         }}
//                     />

//                     <button
//                         type="submit"
//                         className="sb-go"
//                         style={{ fontFamily: UI_FONT }}
//                     >
//                         Go
//                     </button>
//                 </form>

//                 {/* ── Hint ── */}
//                 {!hideHint && !compact && searchType === '1' && (
//                     <p className="sb-hint" style={{ fontFamily: GURBANI_FONT }}>
//                         ਹਰ ਸ਼ਬਦ ਦਾ ਪਹਿਲਾ ਅੱਖਰ ਟਾਈਪ ਕਰੋ — ਅੰਗਰੇਜ਼ੀ ਵਿੱਚ ਟਾਈਪ ਕਰੋ
//                     </p>
//                 )}
//                 {!hideHint && !compact && searchType === '2' && (
//                     <p className="sb-hint" style={{ fontFamily: GURBANI_FONT }}>
//                         ਅੰਗਰੇਜ਼ੀ ਵਿੱਚ ਟਾਈਪ ਕਰੋ — ਗੁਰਮੁਖੀ ਵਿੱਚ ਬਦਲੇਗਾ
//                     </p>
//                 )}
//             </div>
//         </>
//     );
// }




// second

// import { useState, useEffect, useRef, useCallback } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { parseVerseItem, searchRaw } from '../../services/gurbaniApi';

// const GURBANI_FONT = "'Noto Sans Gurmukhi','Gurmukhi MN','Kohinoor Gurmukhi',sans-serif";
// const UI_FONT = 'system-ui,-apple-system,sans-serif';

// const isGurmukhiType = (t) => t === '1' || t === '2';

// const DIG = ['੦', '੧', '੨', '੩', '੪', '੫', '੬', '੭', '੮', '੯'];
// const MAP = {
//     a: 'ਅ', b: 'ਬ', c: 'ਚ', d: 'ਦ', e: 'ਇ', f: 'ਫ', g: 'ਗ', h: 'ਹ', i: 'ਇ', j: 'ਜ',
//     k: 'ਕ', l: 'ਲ', m: 'ਮ', n: 'ਨ', o: 'ਉ', p: 'ਪ', q: 'ਕ', r: 'ਰ', s: 'ਸ', t: 'ਤ',
//     u: 'ਉ', v: 'ਵ', w: 'ਵ', x: 'ਕਸ', y: 'ਯ', z: 'ਜ਼',
//     A: 'ਆ', B: 'ਭ', C: 'ਛ', D: 'ਡ', E: 'ਏ', F: 'ਫ਼', G: 'ਘ', H: 'ਃ', I: 'ਈ', J: 'ਝ',
//     K: 'ਖ', L: 'ਲ਼', M: 'ੰ', N: 'ਣ', O: 'ਓ', P: 'ਫ਼', Q: 'ਕ਼', R: 'ੜ', S: 'ਸ਼', T: 'ਟ',
//     U: 'ਊ', V: 'ਵ', W: 'ਵ', X: 'ਖ਼', Y: 'ਯ', Z: 'ਗ਼',
// };

// function romanToGurmukhi(s) {
//     return s.replace(/[0-9A-Za-z]/g, ch =>
//         /[0-9]/.test(ch) ? DIG[+ch] : (MAP[ch] || ch)
//     );
// }

// export default function SearchBar({
//     initialQuery = '',
//     initialType = '1',
//     hideDropdown = false,
//     compact = false,
//     hideHint = false,
//     // 'above' (default, matches home page) | 'below' (for sidebar/reader use)
//     dropdownPosition = 'above',
// }) {
//     const navigate = useNavigate();

//     const [query, setQuery] = useState(initialQuery);
//     const [searchType, setSearchType] = useState(initialType);
//     const [liveResults, setLiveResults] = useState([]);
//     const [liveLoading, setLiveLoading] = useState(false);
//     const [showDropdown, setShowDropdown] = useState(false);

//     const wrapRef = useRef(null);
//     const inputRef = useRef(null);
//     const abortRef = useRef(null);
//     const timerRef = useRef(null);
//     const tokenRef = useRef(0);

//     useEffect(() => {
//         setQuery(initialQuery);
//         setSearchType(initialType);
//     }, [initialQuery, initialType]);

//     function handleSubmit(e) {
//         e.preventDefault();
//         const q = query.trim();
//         if (!q) return;
//         setShowDropdown(false);

//         if (searchType === '5') {
//             let ang = parseInt(q, 10);
//             if (!Number.isFinite(ang)) { inputRef.current?.focus(); return; }
//             ang = Math.max(1, Math.min(1430, ang));
//             navigate(`/reader/${ang}`);
//             return;
//         }

//         navigate(`/search?q=${encodeURIComponent(q)}&type=${searchType}`);
//     }

//     function handleInputChange(e) {
//         const val = e.target.value;
//         if (isGurmukhiType(searchType)) {
//             setQuery(romanToGurmukhi(val));
//         } else {
//             setQuery(val);
//         }
//     }

//     function handleTypeChange(e) {
//         setSearchType(e.target.value);
//         setQuery('');
//         setLiveResults([]);
//         setShowDropdown(false);
//         inputRef.current?.focus();
//     }

//     const runLive = useCallback(async (q, type) => {
//         if (!q || q.length < 1 || type === '5' || hideDropdown) {
//             setLiveResults([]);
//             setShowDropdown(false);
//             return;
//         }

//         if (abortRef.current) abortRef.current.abort();
//         abortRef.current = new AbortController();
//         const myToken = ++tokenRef.current;

//         setLiveLoading(true);
//         setShowDropdown(true);

//         try {
//             const { verses } = await searchRaw(type, q);
//             if (myToken !== tokenRef.current) return;
//             setLiveResults(verses.slice(0, 8));
//         } catch (err) {
//             if (err.name === 'AbortError') return;
//             setLiveResults([]);
//         } finally {
//             if (myToken === tokenRef.current) setLiveLoading(false);
//         }
//     }, [hideDropdown]);

//     useEffect(() => {
//         clearTimeout(timerRef.current);
//         timerRef.current = setTimeout(() => runLive(query.trim(), searchType), 180);
//         return () => clearTimeout(timerRef.current);
//     }, [query, searchType, runLive]);

//     useEffect(() => {
//         const h = (e) => {
//             if (wrapRef.current && !wrapRef.current.contains(e.target))
//                 setShowDropdown(false);
//         };
//         document.addEventListener('mousedown', h);
//         return () => document.removeEventListener('mousedown', h);
//     }, []);

//     const placeholder = {
//         '1': 'ਪਹਿਲੇ ਅੱਖਰ ਟਾਈਪ ਕਰੋ…',
//         '2': 'ਗੁਰਬਾਣੀ ਖੋਜ ਕਰੋ…',
//         '5': 'ਅੰਗ ਨੰਬਰ…',
//     }[searchType] ?? 'Search…';

//     const useGurmukhiInput = isGurmukhiType(searchType);
//     const dropdownVisible = !hideDropdown && showDropdown && query.trim().length > 0 && searchType !== '5';

//     // Dropdown positioning styles — above (default) vs below
//     const dropdownPositionStyle = dropdownPosition === 'below'
//         ? {
//             top: 'calc(100% + 10px)',
//             bottom: 'auto',
//         }
//         : {
//             bottom: 'calc(100% + 10px)',
//             top: 'auto',
//         };

//     // Box-shadow direction flips too for a natural feel
//     const dropdownShadow = dropdownPosition === 'below'
//         ? '0 8px 40px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.03) inset'
//         : '0 -4px 40px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.03) inset';

//     return (
//         <>
//             <style>{`
//                 .sb-root {
//                     position: relative;
//                     width: 100%;
//                     z-index: 1001;
//                 }
//                 /* ─── Search bar pill ─── */
//                 .sb-pill {
//                     display: flex;
//                     align-items: center;
//                     gap: 0;
//                     width: 100%;
//                     border-radius: 16px;
//                     overflow: hidden;
//                     background: rgba(255, 255, 255, 0.07);
//                     border: 1px solid rgba(255, 255, 255, 0.12);
//                     backdrop-filter: blur(20px);
//                     -webkit-backdrop-filter: blur(20px);
//                     box-shadow:
//                         0 2px 12px rgba(0,0,0,0.3),
//                         inset 0 1px 0 rgba(255,255,255,0.08);
//                     transition: border-color 0.2s, box-shadow 0.2s;
//                 }
//                 .sb-pill:focus-within {
//                     border-color: rgba(255, 255, 255, 0.2);
//                     box-shadow:
//                         0 4px 24px rgba(0,0,0,0.4),
//                         inset 0 1px 0 rgba(255,255,255,0.1);
//                 }

//                 .sb-select-wrap {
//                     display: flex;
//                     align-items: center;
//                     padding: 0 4px 0 2px;
//                     flex-shrink: 0;
//                 }

//                 .sb-select {
//                     appearance: none;
//                     -webkit-appearance: none;
//                     background: rgba(255,255,255,0.08);
//                     border: none;
//                     border-radius: 10px;
//                     color: rgba(255,255,255,0.7);
//                     font-size: 0.75rem;
//                     padding: 7px 26px 7px 10px;
//                     margin: 5px 0 5px 5px;
//                     cursor: pointer;
//                     background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='rgba(255,255,255,0.35)'/%3E%3C/svg%3E");
//                     background-repeat: no-repeat;
//                     background-position: right 8px center;
//                     outline: none;
//                     white-space: nowrap;
//                     max-width: 130px;
//                     transition: background 0.15s;
//                 }
//                 .sb-select:focus { background-color: rgba(255,255,255,0.13); }

//                 .sb-sep {
//                     width: 1px;
//                     height: 22px;
//                     background: rgba(255,255,255,0.1);
//                     flex-shrink: 0;
//                     margin: 0 2px;
//                 }

//                 .sb-input {
//                     flex: 1;
//                     min-width: 0;
//                     background: transparent;
//                     border: none;
//                     outline: none;
//                     color: rgba(255,255,255,0.9);
//                     caret-color: rgba(255,255,255,0.55);
//                     padding: 12px 10px;
//                 }
//                 .sb-input::placeholder { color: rgba(255,255,255,0.22); }
//                 .sb-input::-webkit-search-cancel-button,
//                 .sb-input::-webkit-search-decoration { display: none; appearance: none; }

//                 .sb-go {
//                     flex-shrink: 0;
//                     background: rgba(255,255,255,0.12);
//                     border: none;
//                     border-left: 1px solid rgba(255,255,255,0.1);
//                     color: rgba(255,255,255,0.85);
//                     padding: 0 22px;
//                     height: 100%;
//                     min-height: 44px;
//                     font-size: 0.84rem;
//                     font-weight: 500;
//                     cursor: pointer;
//                     letter-spacing: 0.03em;
//                     transition: background 0.15s, color 0.15s;
//                 }
//                 .sb-go:hover {
//                     background: rgba(255,255,255,0.19);
//                     color: #fff;
//                 }
//                 .sb-go:active { background: rgba(255,255,255,0.09); }

//                 /* ─── Hint ─── */
//                 .sb-hint {
//                     margin-top: 9px;
//                     font-size: 0.71rem;
//                     text-align: center;
//                     color: rgba(255,255,255,0.2);
//                 }

//                 /* ─── Dropdown ─── */
//                 .sb-dropdown {
//                     position: absolute;
//                     left: 0;
//                     right: 0;
//                     z-index: 1102;
//                     border-radius: 16px;
//                     overflow: hidden;
//                     background: #0d1226;
//                     border: 1px solid rgba(255,255,255,0.1);
//                     max-height: 70vh;
//                     overflow-y: auto;
//                     scrollbar-width: thin;
//                     scrollbar-color: rgba(255,255,255,0.08) transparent;
//                     animation: sbFadeIn 0.12s ease;
//                 }
//                 @keyframes sbFadeIn {
//                     from { opacity: 0; transform: translateY(4px); }
//                     to   { opacity: 1; transform: translateY(0); }
//                 }
//                 .sb-dropdown::-webkit-scrollbar { width: 3px; }
//                 .sb-dropdown::-webkit-scrollbar-thumb {
//                     background: rgba(255,255,255,0.1);
//                     border-radius: 3px;
//                 }

//                 /* sticky header */
//                 .sb-dd-head {
//                     position: sticky;
//                     top: 0;
//                     z-index: 2;
//                     background: #0d1226;
//                     display: flex;
//                     align-items: center;
//                     justify-content: space-between;
//                     padding: 10px 16px 8px;
//                     border-bottom: 1px solid rgba(255,255,255,0.06);
//                 }
//                 .sb-dd-label {
//                     font-size: 0.63rem;
//                     font-weight: 700;
//                     letter-spacing: 0.13em;
//                     text-transform: uppercase;
//                     color: rgba(255,255,255,0.2);
//                 }

//                 .sb-spinner {
//                     width: 13px; height: 13px;
//                     border-radius: 50%;
//                     border: 2px solid rgba(255,255,255,0.07);
//                     border-top-color: rgba(255,255,255,0.4);
//                     animation: sbSpin 0.65s linear infinite;
//                 }
//                 @keyframes sbSpin { to { transform: rotate(360deg); } }

//                 /* rows */
//                 .sb-row {
//                     display: flex;
//                     align-items: center;
//                     justify-content: space-between;
//                     gap: 12px;
//                     width: 100%;
//                     text-align: left;
//                     background: transparent;
//                     border: none;
//                     border-bottom: 1px solid rgba(255,255,255,0.04);
//                     padding: 11px 16px;
//                     cursor: pointer;
//                     transition: background 0.1s;
//                 }
//                 .sb-row:last-child { border-bottom: none; }
//                 .sb-row:hover { background: rgba(255,255,255,0.04); }
//                 .sb-row:hover .sb-badge {
//                     background: rgba(200,165,80,0.15);
//                     border-color: rgba(200,165,80,0.3);
//                     color: rgba(220,190,120,0.85);
//                 }

//                 .sb-row-text {
//                     display: flex;
//                     flex-direction: column;
//                     gap: 3px;
//                     flex: 1;
//                     min-width: 0;
//                 }
//                 .sb-gurmukhi {
//                     font-size: 0.92rem;
//                     line-height: 1.55;
//                     color: rgba(255,255,255,0.87);
//                     white-space: nowrap;
//                     overflow: hidden;
//                     text-overflow: ellipsis;
//                 }
//                 .sb-translit {
//                     font-size: 0.7rem;
//                     color: rgba(255,255,255,0.27);
//                     font-style: italic;
//                     white-space: nowrap;
//                     overflow: hidden;
//                     text-overflow: ellipsis;
//                 }
//                 .sb-badge {
//                     flex-shrink: 0;
//                     font-size: 0.7rem;
//                     padding: 3px 10px;
//                     border-radius: 20px;
//                     background: rgba(255,255,255,0.05);
//                     border: 1px solid rgba(255,255,255,0.09);
//                     color: rgba(255,255,255,0.33);
//                     white-space: nowrap;
//                     transition: all 0.15s;
//                 }

//                 .sb-empty {
//                     padding: 20px 16px;
//                     text-align: center;
//                     font-size: 0.88rem;
//                     color: rgba(255,255,255,0.25);
//                     margin: 0;
//                 }

//                 /* ─── Background Blur Overlay ─── */
//                 .sb-overlay {
//                     position: fixed;
//                     inset: 0;
//                     z-index: 998;
//                     backdrop-filter: blur(10px);
//                     -webkit-backdrop-filter: blur(10px);
//                     background: rgba(10, 13, 26, 0.35);
//                     animation: sbFadeIn 0.15s ease;
//                 }
//             `}</style>

//             {/* ── Overlay (blur background) ── */}
//             {dropdownVisible && (
//                 <div
//                     className="sb-overlay"
//                     onClick={() => setShowDropdown(false)}
//                 />
//             )}

//             <div ref={wrapRef} className="sb-root">

//                 {/* ── Dropdown (position controlled by prop) ── */}
//                 {dropdownVisible && (
//                     <div
//                         className="sb-dropdown"
//                         style={{
//                             ...dropdownPositionStyle,
//                             boxShadow: dropdownShadow,
//                         }}
//                     >
//                         <div className="sb-dd-head">
//                             <span className="sb-dd-label" style={{ fontFamily: UI_FONT }}>
//                                 Suggestions
//                             </span>
//                             {liveLoading && <div className="sb-spinner" />}
//                         </div>

//                         {!liveLoading && liveResults.length === 0 && (
//                             <p className="sb-empty" style={{ fontFamily: GURBANI_FONT }}>
//                                 ਕੋਈ ਨਤੀਜਾ ਨਹੀਂ ਮਿਲਿਆ
//                             </p>
//                         )}

//                         {!liveLoading && liveResults.map((v, i) => {
//                             const { gurmukhi, ang, translit } = parseVerseItem(v);
//                             if (!gurmukhi) return null;
//                             return (
//                                 <button
//                                     key={i}
//                                     type="button"
//                                     className="sb-row"
//                                     onClick={() => {
//                                         setShowDropdown(false);
//                                         if (ang) navigate(`/reader/${ang}`);
//                                     }}
//                                 >
//                                     <div className="sb-row-text">
//                                         <span className="sb-gurmukhi" style={{ fontFamily: GURBANI_FONT }}>
//                                             {gurmukhi}
//                                         </span>
//                                         {translit && (
//                                             <span className="sb-translit" style={{ fontFamily: UI_FONT }}>
//                                                 {translit}
//                                             </span>
//                                         )}
//                                     </div>
//                                     {ang && (
//                                         <span className="sb-badge" style={{ fontFamily: GURBANI_FONT }}>
//                                             ਪੰਨਾ {ang}
//                                         </span>
//                                     )}
//                                 </button>
//                             );
//                         })}
//                     </div>
//                 )}

//                 {/* ── Search pill ── */}
//                 <form
//                     className="sb-pill"
//                     onSubmit={handleSubmit}
//                     style={{ padding: compact ? '2px' : '0' }}
//                 >
//                     <div className="sb-select-wrap">
//                         <select
//                             value={searchType}
//                             onChange={handleTypeChange}
//                             aria-label="Search type"
//                             className="sb-select"
//                             style={{ fontFamily: UI_FONT }}
//                         >
//                             <option value="1" style={{ background: '#0d1226', color: '#fff' }}>
//                                 First Letter (Anywhere)
//                             </option>
//                             <option value="2" style={{ background: '#0d1226', color: '#fff' }}>
//                                 Full Word (Gurmukhi)
//                             </option>
//                             <option value="5" style={{ background: '#0d1226', color: '#fff' }}>
//                                 Page No.
//                             </option>
//                         </select>
//                     </div>

//                     <div className="sb-sep" />

//                     <input
//                         ref={inputRef}
//                         type="search"
//                         value={query}
//                         onChange={handleInputChange}
//                         onFocus={() => !hideDropdown && liveResults.length > 0 && setShowDropdown(true)}
//                         inputMode={searchType === '5' ? 'numeric' : 'text'}
//                         autoComplete="off"
//                         autoCapitalize="off"
//                         spellCheck={false}
//                         dir="ltr"
//                         lang={useGurmukhiInput ? 'pa' : 'en'}
//                         placeholder={placeholder}
//                         className="sb-input"
//                         style={{
//                             fontFamily: useGurmukhiInput ? GURBANI_FONT : UI_FONT,
//                             fontSize: compact ? '0.78rem' : '0.93rem',
//                             letterSpacing: useGurmukhiInput ? '0.15px' : 'normal',
//                         }}
//                     />

//                     <button
//                         type="submit"
//                         className="sb-go"
//                         style={{ fontFamily: UI_FONT }}
//                     >
//                         Go
//                     </button>
//                 </form>

//                 {/* ── Hint ── */}
//                 {!hideHint && !compact && searchType === '1' && (
//                     <p className="sb-hint" style={{ fontFamily: GURBANI_FONT }}>
//                         ਹਰ ਸ਼ਬਦ ਦਾ ਪਹਿਲਾ ਅੱਖਰ ਟਾਈਪ ਕਰੋ — ਅੰਗਰੇਜ਼ੀ ਵਿੱਚ ਟਾਈਪ ਕਰੋ
//                     </p>
//                 )}
//                 {!hideHint && !compact && searchType === '2' && (
//                     <p className="sb-hint" style={{ fontFamily: GURBANI_FONT }}>
//                         ਅੰਗਰੇਜ਼ੀ ਵਿੱਚ ਟਾਈਪ ਕਰੋ — ਗੁਰਮੁਖੀ ਵਿੱਚ ਬਦਲੇਗਾ
//                     </p>
//                 )}
//             </div>
//         </>
//     );
// }


import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { parseVerseItem, searchRaw } from '../../services/gurbaniApi';
import { phoneticToGurmukhi } from '../utils/phoneticToGurmukhi'; // ← adjust path to where you put the new file

const GURBANI_FONT = "'Noto Sans Gurmukhi','Gurmukhi MN','Kohinoor Gurmukhi',sans-serif";
const UI_FONT = 'system-ui,-apple-system,sans-serif';

const isGurmukhiType = (t) => t === '1' || t === '2';

export default function SearchBar({
    initialQuery = '',
    initialType = '1',
    hideDropdown = false,
    compact = false,
    hideHint = false,
    dropdownPosition = 'above',
}) {
    const navigate = useNavigate();

    // query = what user literally typed (roman text for types 1/2, plain text for others)
    const [query, setQuery] = useState(initialQuery);
    const [searchType, setSearchType] = useState(initialType);
    const [liveResults, setLiveResults] = useState([]);
    const [liveLoading, setLiveLoading] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);

    const wrapRef = useRef(null);
    const inputRef = useRef(null);
    const abortRef = useRef(null);
    const timerRef = useRef(null);
    const tokenRef = useRef(0);

    // Derived: the actual Gurmukhi string used for search and display chip
    const gurmukhiQuery = isGurmukhiType(searchType)
        ? phoneticToGurmukhi(query.trim())
        : query.trim();

    useEffect(() => {
        setQuery(initialQuery);
        setSearchType(initialType);
    }, [initialQuery, initialType]);

    function handleSubmit(e) {
        e.preventDefault();
        const q = gurmukhiQuery; // ← use converted Gurmukhi
        if (!q && searchType !== '5') return;
        setShowDropdown(false);

        if (searchType === '5') {
            let ang = parseInt(query.trim(), 10);
            if (!Number.isFinite(ang)) { inputRef.current?.focus(); return; }
            ang = Math.max(1, Math.min(1430, ang));
            navigate(`/reader/${ang}`);
            return;
        }

        navigate(`/search?q=${encodeURIComponent(q)}&type=${searchType}`);
    }

    // Simple — just store what the user typed. Conversion happens in gurmukhiQuery.
    function handleInputChange(e) {
        setQuery(e.target.value);
    }

    function handleTypeChange(e) {
        setSearchType(e.target.value);
        setQuery('');
        setLiveResults([]);
        setShowDropdown(false);
        inputRef.current?.focus();
    }

    const runLive = useCallback(async (gq, type) => {
        if (!gq || gq.length < 1 || type === '5' || hideDropdown) {
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
            const { verses } = await searchRaw(type, gq); // ← uses converted Gurmukhi
            if (myToken !== tokenRef.current) return;
            setLiveResults(verses.slice(0, 8));
        } catch (err) {
            if (err.name === 'AbortError') return;
            setLiveResults([]);
        } finally {
            if (myToken === tokenRef.current) setLiveLoading(false);
        }
    }, [hideDropdown]);

    // Debounce live search — trigger on gurmukhiQuery, not raw query
    useEffect(() => {
        clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => runLive(gurmukhiQuery, searchType), 180);
        return () => clearTimeout(timerRef.current);
    }, [gurmukhiQuery, searchType, runLive]);

    useEffect(() => {
        const h = (e) => {
            if (wrapRef.current && !wrapRef.current.contains(e.target))
                setShowDropdown(false);
        };
        document.addEventListener('mousedown', h);
        return () => document.removeEventListener('mousedown', h);
    }, []);

    const placeholder = {
        '1': 'e.g. "skgm" → ਸਕਗਮ…',
        '2': 'e.g. "aasha" → ਆਸ਼ਾ…',
        '5': 'ਅੰਗ ਨੰਬਰ…',
    }[searchType] ?? 'Search…';

    const showGurmukhiChip = isGurmukhiType(searchType) && query.trim().length > 0;
    const dropdownVisible = !hideDropdown && showDropdown && gurmukhiQuery.length > 0 && searchType !== '5';

    const dropdownPositionStyle = dropdownPosition === 'below'
        ? { top: 'calc(100% + 10px)', bottom: 'auto' }
        : { bottom: 'calc(100% + 10px)', top: 'auto' };

    const dropdownShadow = dropdownPosition === 'below'
        ? '0 8px 40px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.03) inset'
        : '0 -4px 40px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.03) inset';

    return (
        <>
            <style>{`
                .sb-root {
                    position: relative;
                    width: 100%;
                    z-index: 1001;
                }

                .sb-pill {
                    display: flex;
                    align-items: center;
                    gap: 0;
                    width: 100%;
                    border-radius: 16px;
                    overflow: hidden;
                    background: rgba(255, 255, 255, 0.07);
                    border: 1px solid rgba(255, 255, 255, 0.12);
                    backdrop-filter: blur(20px);
                    -webkit-backdrop-filter: blur(20px);
                    box-shadow:
                        0 2px 12px rgba(0,0,0,0.3),
                        inset 0 1px 0 rgba(255,255,255,0.08);
                    transition: border-color 0.2s, box-shadow 0.2s;
                }
                .sb-pill:focus-within {
                    border-color: rgba(255, 255, 255, 0.2);
                    box-shadow:
                        0 4px 24px rgba(0,0,0,0.4),
                        inset 0 1px 0 rgba(255,255,255,0.1);
                }

                .sb-select-wrap {
                    display: flex;
                    align-items: center;
                    padding: 0 4px 0 2px;
                    flex-shrink: 0;
                }

                .sb-select {
                    appearance: none;
                    -webkit-appearance: none;
                    background: rgba(255,255,255,0.08);
                    border: none;
                    border-radius: 10px;
                    color: rgba(255,255,255,0.7);
                    font-size: 0.75rem;
                    padding: 7px 26px 7px 10px;
                    margin: 5px 0 5px 5px;
                    cursor: pointer;
                    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='rgba(255,255,255,0.35)'/%3E%3C/svg%3E");
                    background-repeat: no-repeat;
                    background-position: right 8px center;
                    outline: none;
                    white-space: nowrap;
                    max-width: 140px;
                    transition: background 0.15s;
                }
                .sb-select:focus { background-color: rgba(255,255,255,0.13); }

                .sb-sep {
                    width: 1px;
                    height: 22px;
                    background: rgba(255,255,255,0.1);
                    flex-shrink: 0;
                    margin: 0 2px;
                }

                /* ── Gurmukhi live preview chip (inside the pill) ── */
                .sb-gurmukhi-chip {
                    flex-shrink: 0;
                    display: flex;
                    align-items: center;
                    padding: 4px 10px 4px 12px;
                    font-size: 1rem;
                    line-height: 1;
                    color: rgba(255,255,255,0.9);
                    background: rgba(255,255,255,0.06);
                    border-right: 1px solid rgba(255,255,255,0.08);
                    white-space: nowrap;
                    max-width: 200px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    pointer-events: none;
                    animation: sbChipIn 0.12s ease;
                }
                @keyframes sbChipIn {
                    from { opacity: 0; transform: translateX(-4px); }
                    to   { opacity: 1; transform: translateX(0); }
                }

                .sb-input {
                    flex: 1;
                    min-width: 0;
                    background: transparent;
                    border: none;
                    outline: none;
                    color: rgba(255,255,255,0.55);
                    caret-color: rgba(255,255,255,0.55);
                    padding: 12px 10px;
                    font-size: 0.82rem;
                    font-style: italic;
                }
                .sb-input::placeholder { color: rgba(255,255,255,0.18); }
                .sb-input::-webkit-search-cancel-button,
                .sb-input::-webkit-search-decoration { display: none; appearance: none; }

                /* When no chip is showing, input is full brightness */
                .sb-input-primary {
                    color: rgba(255,255,255,0.9) !important;
                    font-style: normal !important;
                    font-size: 0.93rem !important;
                }

                .sb-go {
                    flex-shrink: 0;
                    background: rgba(255,255,255,0.12);
                    border: none;
                    border-left: 1px solid rgba(255,255,255,0.1);
                    color: rgba(255,255,255,0.85);
                    padding: 0 22px;
                    height: 100%;
                    min-height: 44px;
                    font-size: 0.84rem;
                    font-weight: 500;
                    cursor: pointer;
                    letter-spacing: 0.03em;
                    transition: background 0.15s, color 0.15s;
                }
                .sb-go:hover {
                    background: rgba(255,255,255,0.19);
                    color: #fff;
                }
                .sb-go:active { background: rgba(255,255,255,0.09); }

                .sb-hint {
                    margin-top: 9px;
                    font-size: 0.71rem;
                    text-align: center;
                    color: rgba(255,255,255,0.2);
                }

                /* ── Dropdown ── */
                .sb-dropdown {
                    position: absolute;
                    left: 0;
                    right: 0;
                    z-index: 1102;
                    border-radius: 16px;
                    overflow: hidden;
                    background: #0d1226;
                    border: 1px solid rgba(255,255,255,0.1);
                    max-height: 70vh;
                    overflow-y: auto;
                    scrollbar-width: thin;
                    scrollbar-color: rgba(255,255,255,0.08) transparent;
                    animation: sbFadeIn 0.12s ease;
                }
                @keyframes sbFadeIn {
                    from { opacity: 0; transform: translateY(4px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                .sb-dropdown::-webkit-scrollbar { width: 3px; }
                .sb-dropdown::-webkit-scrollbar-thumb {
                    background: rgba(255,255,255,0.1);
                    border-radius: 3px;
                }

                .sb-dd-head {
                    position: sticky;
                    top: 0;
                    z-index: 2;
                    background: #0d1226;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 10px 16px 8px;
                    border-bottom: 1px solid rgba(255,255,255,0.06);
                }
                .sb-dd-label {
                    font-size: 0.63rem;
                    font-weight: 700;
                    letter-spacing: 0.13em;
                    text-transform: uppercase;
                    color: rgba(255,255,255,0.2);
                }

                .sb-spinner {
                    width: 13px; height: 13px;
                    border-radius: 50%;
                    border: 2px solid rgba(255,255,255,0.07);
                    border-top-color: rgba(255,255,255,0.4);
                    animation: sbSpin 0.65s linear infinite;
                }
                @keyframes sbSpin { to { transform: rotate(360deg); } }

                .sb-row {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 12px;
                    width: 100%;
                    text-align: left;
                    background: transparent;
                    border: none;
                    border-bottom: 1px solid rgba(255,255,255,0.04);
                    padding: 11px 16px;
                    cursor: pointer;
                    transition: background 0.1s;
                }
                .sb-row:last-child { border-bottom: none; }
                .sb-row:hover { background: rgba(255,255,255,0.04); }
                .sb-row:hover .sb-badge {
                    background: rgba(200,165,80,0.15);
                    border-color: rgba(200,165,80,0.3);
                    color: rgba(220,190,120,0.85);
                }

                .sb-row-text {
                    display: flex;
                    flex-direction: column;
                    gap: 3px;
                    flex: 1;
                    min-width: 0;
                }
                .sb-gurmukhi {
                    font-size: 0.92rem;
                    line-height: 1.55;
                    color: rgba(255,255,255,0.87);
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
                .sb-translit {
                    font-size: 0.7rem;
                    color: rgba(255,255,255,0.27);
                    font-style: italic;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
                .sb-badge {
                    flex-shrink: 0;
                    font-size: 0.7rem;
                    padding: 3px 10px;
                    border-radius: 20px;
                    background: rgba(255,255,255,0.05);
                    border: 1px solid rgba(255,255,255,0.09);
                    color: rgba(255,255,255,0.33);
                    white-space: nowrap;
                    transition: all 0.15s;
                }

                .sb-empty {
                    padding: 20px 16px;
                    text-align: center;
                    font-size: 0.88rem;
                    color: rgba(255,255,255,0.25);
                    margin: 0;
                }

                .sb-overlay {
                    position: fixed;
                    inset: 0;
                    z-index: 998;
                    backdrop-filter: blur(10px);
                    -webkit-backdrop-filter: blur(10px);
                    background: rgba(10, 13, 26, 0.35);
                    animation: sbFadeIn 0.15s ease;
                }
            `}</style>

            {dropdownVisible && (
                <div className="sb-overlay" onClick={() => setShowDropdown(false)} />
            )}

            <div ref={wrapRef} className="sb-root">

                {dropdownVisible && (
                    <div
                        className="sb-dropdown"
                        style={{ ...dropdownPositionStyle, boxShadow: dropdownShadow }}
                    >
                        <div className="sb-dd-head">
                            <span className="sb-dd-label" style={{ fontFamily: UI_FONT }}>
                                Suggestions
                            </span>
                            {liveLoading && <div className="sb-spinner" />}
                        </div>

                        {!liveLoading && liveResults.length === 0 && (
                            <p className="sb-empty" style={{ fontFamily: GURBANI_FONT }}>
                                ਕੋਈ ਨਤੀਜਾ ਨਹੀਂ ਮਿਲਿਆ
                            </p>
                        )}

                        {!liveLoading && liveResults.map((v, i) => {
                            const { gurmukhi, ang, translit } = parseVerseItem(v);
                            if (!gurmukhi) return null;
                            return (
                                <button
                                    key={i}
                                    type="button"
                                    className="sb-row"
                                    onClick={() => {
                                        setShowDropdown(false);
                                        if (ang) navigate(`/reader/${ang}`);
                                    }}
                                >
                                    <div className="sb-row-text">
                                        <span className="sb-gurmukhi" style={{ fontFamily: GURBANI_FONT }}>
                                            {gurmukhi}
                                        </span>
                                        {translit && (
                                            <span className="sb-translit" style={{ fontFamily: UI_FONT }}>
                                                {translit}
                                            </span>
                                        )}
                                    </div>
                                    {ang && (
                                        <span className="sb-badge" style={{ fontFamily: GURBANI_FONT }}>
                                            ਪੰਨਾ {ang}
                                        </span>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                )}

                <form
                    className="sb-pill"
                    onSubmit={handleSubmit}
                    style={{ padding: compact ? '2px' : '0' }}
                >
                    <div className="sb-select-wrap">
                        <select
                            value={searchType}
                            onChange={handleTypeChange}
                            aria-label="Search type"
                            className="sb-select"
                            style={{ fontFamily: UI_FONT }}
                        >
                            <option value="1" style={{ background: '#0d1226', color: '#fff' }}>
                                First Letter
                            </option>
                            <option value="2" style={{ background: '#0d1226', color: '#fff' }}>
                                Full Word
                            </option>
                            <option value="5" style={{ background: '#0d1226', color: '#fff' }}>
                                Page No.
                            </option>
                        </select>
                    </div>

                    <div className="sb-sep" />

                    {/* ── Live Gurmukhi chip — appears as user types ── */}
                    {showGurmukhiChip && (
                        <span
                            className="sb-gurmukhi-chip"
                            style={{ fontFamily: GURBANI_FONT }}
                            title={gurmukhiQuery}
                        >
                            {gurmukhiQuery}
                        </span>
                    )}

                    <input
                        ref={inputRef}
                        type="search"
                        value={query}
                        onChange={handleInputChange}
                        onFocus={() => !hideDropdown && liveResults.length > 0 && setShowDropdown(true)}
                        inputMode={searchType === '5' ? 'numeric' : 'text'}
                        autoComplete="off"
                        autoCapitalize="off"
                        spellCheck={false}
                        dir="ltr"
                        lang="en"
                        placeholder={placeholder}
                        className={`sb-input${!showGurmukhiChip ? ' sb-input-primary' : ''}`}
                        style={{
                            fontFamily: UI_FONT,
                            fontSize: compact ? '0.78rem' : undefined,
                        }}
                    />

                    <button
                        type="submit"
                        className="sb-go"
                        style={{ fontFamily: UI_FONT }}
                    >
                        Go
                    </button>
                </form>

                {/* ── Hints ── */}
                {!hideHint && !compact && searchType === '1' && (
                    <p className="sb-hint" style={{ fontFamily: UI_FONT }}>
                        Type first letters of each word in English — e.g. "skgm" → ਸਕਗਮ
                    </p>
                )}
                {!hideHint && !compact && searchType === '2' && (
                    <p className="sb-hint" style={{ fontFamily: UI_FONT }}>
                        Type phonetically in English — e.g. "aasha" → ਆਸ਼ਾ · "waheguru" → ਵਾਹੇਗੁਰੁ
                    </p>
                )}
            </div>
        </>
    );
}