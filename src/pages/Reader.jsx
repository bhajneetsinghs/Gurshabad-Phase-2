// import { useEffect, useState, useRef, useCallback } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { getAng, parseAngData } from '../services/gurbaniApi';
// import MeaningBox from '../components/reader/MeaningBox';
// import SearchBar from '../components/search/SearchBar';

// const MIN_ANG = 1;
// const MAX_ANG = 1430;
// const GURBANI_FONT =
//     "'Noto Sans Gurmukhi','Gurmukhi MN','Kohinoor Gurmukhi','AnmolLipi',sans-serif";

// const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

// export default function Reader() {
//     const { ang: angParam } = useParams();
//     const navigate = useNavigate();
//     const angNum = clamp(parseInt(angParam, 10) || 1, MIN_ANG, MAX_ANG);

//     const [lines, setLines] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const [inputVal, setInputVal] = useState(String(angNum));
//     const [showTrans, setShowTrans] = useState(false);
//     const [meaningData, setMeaningData] = useState(null);
//     const [rawPage, setRawPage] = useState([]);
//     const [liveSuggestions, setLiveSuggestions] = useState([]);

//     const abortRef = useRef(null);

//     useEffect(() => {
//         if (abortRef.current) abortRef.current.abort();
//         const ctrl = new AbortController();
//         abortRef.current = ctrl;

//         setLoading(true);
//         setError(null);
//         setLines([]);
//         setRawPage([]);
//         setMeaningData(null);
//         setInputVal(String(angNum));

//         getAng(angNum)
//             .then((raw) => {
//                 if (ctrl.signal.aborted) return;
//                 if (Array.isArray(raw?.page)) setRawPage(raw.page);

//                 const parsed = parseAngData(raw);
//                 if (!parsed.length) setError(`No content found for Ang ${angNum}.`);
//                 else setLines(parsed);
//             })
//             .catch((err) => {
//                 if (!ctrl.signal.aborted) setError(err.message);
//             })
//             .finally(() => {
//                 if (!ctrl.signal.aborted) setLoading(false);
//             });

//         return () => ctrl.abort();
//     }, [angNum]);

//     const goToAng = useCallback(
//         (n) => navigate(`/reader/${clamp(n, MIN_ANG, MAX_ANG)}`),
//         [navigate]
//     );

//     function handleSubmit(e) {
//         e.preventDefault();
//         const n = parseInt(inputVal, 10);
//         if (!isNaN(n)) goToAng(n);
//     }

//     const handleLiveResults = (results) => {
//         setLiveSuggestions(results || []);
//     };

//     useEffect(() => {
//         const handleKey = (e) => {
//             if (e.target.tagName === 'INPUT') return;
//             if (meaningData) return;
//             if (e.key === 'ArrowLeft') { e.preventDefault(); goToAng(angNum - 1); }
//             if (e.key === 'ArrowRight') { e.preventDefault(); goToAng(angNum + 1); }
//         };
//         window.addEventListener('keydown', handleKey);
//         return () => window.removeEventListener('keydown', handleKey);
//     }, [angNum, goToAng, meaningData]);

//     function handleWordClick(line) {
//         setMeaningData({
//             gurmukhiText: line.gurmukhi,
//             transliteration: line.translit || '',
//         });
//     }

//     const atStart = angNum <= MIN_ANG;
//     const atEnd   = angNum >= MAX_ANG;

//     return (
//         <div className="min-h-screen pt-6">

//             {/* Option 3 Layout: Narrow Search Left + Wide Centered Reader */}
//             <div className="max-w-[min(1200px,95vw)] mx-auto px-4 py-8 grid grid-cols-12 gap-12 items-start">

//                 {/* Left Column - Narrow Search (More to the left) */}
//                 <div className="col-span-12 lg:col-span-4 xl:col-span-3 sticky top-24">
//                     <div
//                         className="rounded-2xl overflow-hidden"
//                         style={{
//                             background: 'rgba(255,255,255,0.05)',
//                             border: '1px solid rgba(255,255,255,0.1)',
//                             backdropFilter: 'blur(16px)',
//                             WebkitBackdropFilter: 'blur(16px)',
//                             boxShadow: '0 8px 32px rgba(0,0,0,0.35)',
//                         }}
//                     >
//                         <div
//                             className="px-4 py-3 flex items-center gap-2"
//                             style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}
//                         >
//                             <div className="w-1.5 h-1.5 rounded-full"
//                                 style={{ background: 'rgba(255,255,255,0.4)' }} />
//                             <p className="text-xs uppercase tracking-widest font-semibold"
//                                 style={{ fontFamily: 'system-ui,sans-serif', color: 'rgba(255,255,255,0.5)' }}>
//                                 Search Gurbani
//                             </p>
//                         </div>
//                         <div className="p-4">
//                             {/* Live Suggestions Above Search Bar */}
//                             {liveSuggestions.length > 0 && (
//                                 <div
//                                     className="mb-4 rounded-2xl overflow-hidden"
//                                     style={{
//                                         background: 'rgba(15,20,40,0.92)',
//                                         border: '1px solid rgba(255,255,255,0.1)',
//                                         backdropFilter: 'blur(24px)',
//                                     }}
//                                 >
//                                     {liveSuggestions.slice(0, 5).map((v, i) => {
//                                         const { gurmukhi, ang, translit } = parseAngData(v) || {};
//                                         if (!gurmukhi) return null;
//                                         return (
//                                             <button
//                                                 key={i}
//                                                 onClick={() => ang && navigate(`/reader/${ang}`)}
//                                                 className="w-full text-left px-5 py-3.5 hover:bg-white/5 transition-colors border-b border-white/10 last:border-none"
//                                             >
//                                                 <p style={{
//                                                     fontFamily: GURBANI_FONT,
//                                                     fontSize: '1rem',
//                                                     color: 'rgba(255,255,255,0.9)',
//                                                 }}>
//                                                     {gurmukhi}
//                                                 </p>
//                                                 <div className="flex justify-between text-xs mt-1">
//                                                     {translit && <span className="text-white/40 italic">{translit}</span>}
//                                                     {ang && <span className="text-white/50">ਪੰਨਾ {ang}</span>}
//                                                 </div>
//                                             </button>
//                                         );
//                                     })}
//                                 </div>
//                             )}

//                             <SearchBar hideDropdown hideHint onLiveResults={handleLiveResults} />
//                         </div>
//                     </div>
//                 </div>

//                 {/* Right Column - Wide Reader Card (Feels Centered) */}
//                 <div className="col-span-12 lg:col-span-8 xl:col-span-9">
//                     <div
//                         className="w-full rounded-3xl overflow-hidden"
//                         style={{
//                             background: 'rgba(255,255,255,0.05)',
//                             border: '1px solid rgba(255,255,255,0.1)',
//                             backdropFilter: 'blur(24px) saturate(160%)',
//                             WebkitBackdropFilter: 'blur(24px) saturate(160%)',
//                             boxShadow: '0 32px 80px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.07)',
//                         }}
//                     >
//                         {/* Card Header */}
//                         <div
//                             className="px-6 py-3 flex items-center gap-3"
//                             style={{
//                                 background: 'rgba(255,255,255,0.03)',
//                                 borderBottom: '1px solid rgba(255,255,255,0.07)',
//                             }}
//                         >
//                             <div className="flex items-center gap-2 flex-none">
//                                 <div className="w-2 h-2 rounded-full"
//                                     style={{ background: 'rgba(255,255,255,0.35)' }} />
//                                 <span className="text-sm font-semibold"
//                                     style={{ fontFamily: 'system-ui,sans-serif', color: 'rgba(255,255,255,0.75)' }}>
//                                     Page {angNum}
//                                 </span>
//                             </div>

//                             <div className="w-px h-4 flex-none"
//                                 style={{ background: 'rgba(255,255,255,0.1)' }} />

//                             <button
//                                 disabled={atStart}
//                                 onClick={() => goToAng(angNum - 1)}
//                                 className="flex-none px-3 py-1 rounded-lg text-xs transition-all active:scale-95"
//                                 style={{
//                                     background: 'rgba(255,255,255,0.07)',
//                                     border: '1px solid rgba(255,255,255,0.1)',
//                                     color: atStart ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.7)',
//                                     cursor: atStart ? 'not-allowed' : 'pointer',
//                                     fontFamily: 'system-ui,sans-serif',
//                                 }}
//                             >
//                                 ← Prev
//                             </button>

//                             <form onSubmit={handleSubmit} className="flex items-center gap-1 flex-none">
//                                 <input
//                                     type="number"
//                                     min={MIN_ANG}
//                                     max={MAX_ANG}
//                                     value={inputVal}
//                                     onChange={(e) => setInputVal(e.target.value)}
//                                     className="text-center text-xs rounded-lg px-2 py-1 focus:outline-none"
//                                     style={{
//                                         width: 56,
//                                         background: 'rgba(255,255,255,0.06)',
//                                         border: '1px solid rgba(255,255,255,0.12)',
//                                         color: 'rgba(255,255,255,0.88)',
//                                         fontFamily: 'system-ui,sans-serif',
//                                     }}
//                                 />
//                                 <button
//                                     type="submit"
//                                     className="px-3 py-1 rounded-lg text-xs transition-all active:scale-95"
//                                     style={{
//                                         background: 'rgba(255,255,255,0.1)',
//                                         border: '1px solid rgba(255,255,255,0.15)',
//                                         color: 'rgba(255,255,255,0.8)',
//                                         cursor: 'pointer',
//                                         fontFamily: 'system-ui,sans-serif',
//                                     }}
//                                 >
//                                     Go
//                                 </button>
//                             </form>

//                             <button
//                                 disabled={atEnd}
//                                 onClick={() => goToAng(angNum + 1)}
//                                 className="flex-none px-3 py-1 rounded-lg text-xs transition-all active:scale-95"
//                                 style={{
//                                     background: 'rgba(255,255,255,0.07)',
//                                     border: '1px solid rgba(255,255,255,0.1)',
//                                     color: atEnd ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.7)',
//                                     cursor: atEnd ? 'not-allowed' : 'pointer',
//                                     fontFamily: 'system-ui,sans-serif',
//                                 }}
//                             >
//                                 Next →
//                             </button>

//                             <div className="flex-1" />

//                             <div className="flex items-center gap-2 flex-none">
//                                 <span className="text-xs" style={{ color: 'rgba(255,255,255,0.35)', fontFamily: 'system-ui,sans-serif' }}>
//                                     Translit
//                                 </span>
//                                 <button
//                                     onClick={() => setShowTrans(v => !v)}
//                                     className="px-2.5 py-1 text-xs rounded-full transition"
//                                     style={{
//                                         background: showTrans ? 'rgba(255,255,255,0.14)' : 'rgba(255,255,255,0.06)',
//                                         border: '1px solid rgba(255,255,255,0.12)',
//                                         color: showTrans ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.4)',
//                                         cursor: 'pointer',
//                                         fontFamily: 'system-ui,sans-serif',
//                                     }}
//                                 >
//                                     {showTrans ? 'On' : 'Off'}
//                                 </button>
//                             </div>

//                             <span className="text-xs flex-none"
//                                 style={{ fontFamily: 'system-ui,sans-serif', color: 'rgba(255,255,255,0.2)' }}>
//                                 {angNum} / {MAX_ANG}
//                             </span>
//                         </div>

//                         {/* Card Body */}
//                         <div className="px-8 py-7">
//                             {loading && (
//                                 <div className="flex justify-center py-16">
//                                     <div className="w-8 h-8 rounded-full border-2 animate-spin"
//                                         style={{
//                                             borderColor: 'rgba(255,255,255,0.08)',
//                                             borderTopColor: 'rgba(255,255,255,0.5)',
//                                         }} />
//                                 </div>
//                             )}

//                             {!loading && error && (
//                                 <div className="text-center py-12 space-y-3">
//                                     <p className="text-sm"
//                                         style={{ fontFamily: 'system-ui,sans-serif', color: 'rgba(255,255,255,0.4)' }}>
//                                         {error}
//                                     </p>
//                                     <button
//                                         onClick={() => goToAng(angNum)}
//                                         className="px-4 py-2 rounded-xl text-sm transition-colors"
//                                         style={{
//                                             fontFamily: 'system-ui,sans-serif',
//                                             border: '1px solid rgba(255,255,255,0.15)',
//                                             color: 'rgba(255,255,255,0.55)',
//                                             background: 'transparent',
//                                             cursor: 'pointer',
//                                         }}
//                                     >
//                                         Retry
//                                     </button>
//                                 </div>
//                             )}

//                             {!loading && !error && lines.length > 0 && (
//                                 <>
//                                     <p className="text-xs mb-6 text-right"
//                                         style={{ fontFamily: 'system-ui,sans-serif', color: 'rgba(255,255,255,0.2)' }}>
//                                         Tap any line for transliteration
//                                     </p>
//                                     <div style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
//                                         {lines.map((line, i) => (
//                                             <VerseBlock
//                                                 key={line.id ?? i}
//                                                 line={line}
//                                                 showTrans={showTrans}
//                                                 onWordClick={() => handleWordClick(line)}
//                                             />
//                                         ))}
//                                     </div>
//                                 </>
//                             )}
//                         </div>

//                         {/* Card Footer */}
//                         {!loading && lines.length > 0 && (
//                             <div
//                                 className="px-8 py-4 flex justify-between"
//                                 style={{
//                                     background: 'rgba(255,255,255,0.02)',
//                                     borderTop: '1px solid rgba(255,255,255,0.07)',
//                                 }}
//                             >
//                                 <button
//                                     disabled={atStart}
//                                     onClick={() => goToAng(angNum - 1)}
//                                     className="px-5 py-2 rounded-xl text-sm transition-all active:scale-95"
//                                     style={{
//                                         fontFamily: 'system-ui,sans-serif',
//                                         background: 'rgba(255,255,255,0.07)',
//                                         border: '1px solid rgba(255,255,255,0.1)',
//                                         color: atStart ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.75)',
//                                         cursor: atStart ? 'not-allowed' : 'pointer',
//                                     }}
//                                 >
//                                     ← Previous Page
//                                 </button>
//                                 <button
//                                     disabled={atEnd}
//                                     onClick={() => goToAng(angNum + 1)}
//                                     className="px-5 py-2 rounded-xl text-sm transition-all active:scale-95"
//                                     style={{
//                                         fontFamily: 'system-ui,sans-serif',
//                                         background: 'rgba(255,255,255,0.07)',
//                                         border: '1px solid rgba(255,255,255,0.1)',
//                                         color: atEnd ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.75)',
//                                         cursor: atEnd ? 'not-allowed' : 'pointer',
//                                     }}
//                                 >
//                                     Next Page →
//                                 </button>
//                             </div>
//                         )}
//                     </div>
//                 </div>
//             </div>

//             {meaningData && <MeaningBox data={meaningData} onClose={() => setMeaningData(null)} />}
//         </div>
//     );
// }

// // VerseBlock Component (unchanged)
// function VerseBlock({ line, showTrans, onWordClick }) {
//     if (!line.gurmukhi) return null;
//     const words = line.gurmukhi.split(' ').filter(Boolean);

//     return (
//         <div className="py-5 first:pt-0 last:pb-0">
//             <p
//                 className="leading-loose mb-1"
//                 style={{
//                     fontFamily: GURBANI_FONT,
//                     fontSize: 'clamp(1.1rem, 2.5vw, 1.5rem)',
//                     lineHeight: 1.85,
//                     letterSpacing: '0.01em',
//                 }}
//             >
//                 {words.map((word, idx) => (
//                     <span key={idx}>
//                         <span
//                             onClick={() => onWordClick(word)}
//                             className="text-white/85 font-bold cursor-pointer
//                                        hover:text-white hover:underline
//                                        underline-offset-4 decoration-dotted
//                                        transition-colors duration-100"
//                             title="Click for transliteration"
//                         >
//                             {word}
//                         </span>
//                         {idx < words.length - 1 ? ' ' : ''}
//                     </span>
//                 ))}
//             </p>

//             {showTrans && line.translit && (
//                 <p
//                     className="text-white/40 text-sm italic mt-1.5 leading-relaxed"
//                     style={{ fontFamily: 'system-ui,-apple-system,sans-serif' }}
//                 >
//                     {line.translit}
//                 </p>
//             )}
//         </div>
//     );
// }

import { useEffect, useState, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getAng, parseAngData } from '../services/gurbaniApi';
import MeaningBox from '../components/reader/MeaningBox';
import SearchBar from '../components/search/SearchBar';

const MIN_ANG = 1;
const MAX_ANG = 1430;
const GURBANI_FONT =
    "'Noto Sans Gurmukhi','Gurmukhi MN','Kohinoor Gurmukhi','AnmolLipi',sans-serif";

const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

export default function Reader() {
    const { ang: angParam } = useParams();
    const navigate = useNavigate();
    const angNum = clamp(parseInt(angParam, 10) || 1, MIN_ANG, MAX_ANG);

    const [lines, setLines] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [inputVal, setInputVal] = useState(String(angNum));
    const [showTrans, setShowTrans] = useState(false);
    const [meaningData, setMeaningData] = useState(null);
    const [rawPage, setRawPage] = useState([]);
    const [liveSuggestions, setLiveSuggestions] = useState([]);

    const abortRef = useRef(null);

    useEffect(() => {
        if (abortRef.current) abortRef.current.abort();
        const ctrl = new AbortController();
        abortRef.current = ctrl;

        setLoading(true);
        setError(null);
        setLines([]);
        setRawPage([]);
        setMeaningData(null);
        setInputVal(String(angNum));

        getAng(angNum)
            .then((raw) => {
                if (ctrl.signal.aborted) return;
                if (Array.isArray(raw?.page)) setRawPage(raw.page);
                const parsed = parseAngData(raw);
                if (!parsed.length) setError(`No content found for Ang ${angNum}.`);
                else setLines(parsed);
            })
            .catch((err) => {
                if (!ctrl.signal.aborted) setError(err.message);
            })
            .finally(() => {
                if (!ctrl.signal.aborted) setLoading(false);
            });

        return () => ctrl.abort();
    }, [angNum]);

    const goToAng = useCallback(
        (n) => navigate(`/reader/${clamp(n, MIN_ANG, MAX_ANG)}`),
        [navigate]
    );

    function handleSubmit(e) {
        e.preventDefault();
        const n = parseInt(inputVal, 10);
        if (!isNaN(n)) goToAng(n);
    }

    const handleLiveResults = (results) => {
        setLiveSuggestions(results || []);
    };

    useEffect(() => {
        const handleKey = (e) => {
            if (e.target.tagName === 'INPUT') return;
            if (meaningData) return;
            if (e.key === 'ArrowLeft') { e.preventDefault(); goToAng(angNum - 1); }
            if (e.key === 'ArrowRight') { e.preventDefault(); goToAng(angNum + 1); }
        };
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, [angNum, goToAng, meaningData]);

    function handleWordClick(line) {
        setMeaningData({
            gurmukhiText: line.gurmukhi,
            transliteration: line.translit || '',
        });
    }

    const atStart = angNum <= MIN_ANG;
    const atEnd = angNum >= MAX_ANG;

    return (
        <div className="min-h-screen pt-6">

            {/*
              True-center layout:
              - Search panel: position:fixed, left edge — completely out of document flow
              - Reader card: max-width + marginLeft/Right auto = centered on full viewport
              Because the search is fixed (not in flow), margin:auto on the reader
              centers it against the full viewport width, not the remaining space.
            */}

            {/* ── FIXED LEFT: Search Panel ── */}
            <div
                className="hidden xl:block"
                style={{
                    position: 'fixed',
                    top: '7.5rem',
                    left: '2rem',
                    width: '300px',
                    zIndex: 40,
                }}
            >
                <div
                    className="rounded-2xl overflow-hidden"
                    style={{
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        backdropFilter: 'blur(16px)',
                        WebkitBackdropFilter: 'blur(16px)',
                        boxShadow: '0 8px 32px rgba(0,0,0,0.35)',
                    }}
                >
                    {/* Panel Header */}
                    <div
                        className="px-4 py-3 flex items-center gap-2"
                        style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}
                    >
                        <div
                            className="w-1.5 h-1.5 rounded-full"
                            style={{ background: 'rgba(255,255,255,0.4)' }}
                        />
                        <p
                            className="text-xs uppercase tracking-widest font-semibold"
                            style={{
                                fontFamily: 'system-ui,sans-serif',
                                color: 'rgba(255,255,255,0.5)',
                            }}
                        >
                            Search Gurbani
                        </p>
                    </div>

                    {/* Live Suggestions + SearchBar */}
                    <div className="p-4">
                        {liveSuggestions.length > 0 && (
                            <div
                                className="mb-4 rounded-2xl overflow-hidden"
                                style={{
                                    background: 'rgba(15,20,40,0.92)',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    backdropFilter: 'blur(24px)',
                                }}
                            >
                                {liveSuggestions.slice(0, 5).map((v, i) => {
                                    const { gurmukhi, ang, translit } = parseAngData(v) || {};
                                    if (!gurmukhi) return null;
                                    return (
                                        <button
                                            key={i}
                                            onClick={() => ang && navigate(`/reader/${ang}`)}
                                            className="w-full text-left px-5 py-3.5 hover:bg-white/5 transition-colors border-b border-white/10 last:border-none"
                                        >
                                            <p
                                                style={{
                                                    fontFamily: GURBANI_FONT,
                                                    fontSize: '1rem',
                                                    color: 'rgba(255,255,255,0.9)',
                                                }}
                                            >
                                                {gurmukhi}
                                            </p>
                                            <div className="flex justify-between text-xs mt-1">
                                                {translit && (
                                                    <span className="text-white/40 italic">{translit}</span>
                                                )}
                                                {ang && (
                                                    <span className="text-white/50">ਪੰਨਾ {ang}</span>
                                                )}
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                        <SearchBar hideDropdown hideHint onLiveResults={handleLiveResults} />
                    </div>
                </div>
            </div>

            {/* ── CENTERED READER: margin auto anchors to full viewport ── */}
            <div
                className="py-8 px-4"
                style={{
                    maxWidth: '860px',
                    marginLeft: 'auto',
                    marginRight: 'auto',
                }}
            >
                <div
                    className="w-full rounded-3xl overflow-hidden"
                    style={{
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        backdropFilter: 'blur(24px) saturate(160%)',
                        WebkitBackdropFilter: 'blur(24px) saturate(160%)',
                        boxShadow: '0 32px 80px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.07)',
                    }}
                >
                    {/* Card Header */}
                    <div
                        className="px-6 py-3 flex items-center gap-3 flex-wrap"
                        style={{
                            background: 'rgba(255,255,255,0.03)',
                            borderBottom: '1px solid rgba(255,255,255,0.07)',
                        }}
                    >
                        <div className="flex items-center gap-2 flex-none">
                            <div
                                className="w-2 h-2 rounded-full"
                                style={{ background: 'rgba(255,255,255,0.35)' }}
                            />
                            <span
                                className="text-sm font-semibold"
                                style={{
                                    fontFamily: 'system-ui,sans-serif',
                                    color: 'rgba(255,255,255,0.75)',
                                }}
                            >
                                Page {angNum}
                            </span>
                        </div>

                        <div
                            className="w-px h-4 flex-none"
                            style={{ background: 'rgba(255,255,255,0.1)' }}
                        />

                        {/* Prev */}
                        <button
                            disabled={atStart}
                            onClick={() => goToAng(angNum - 1)}
                            className="flex-none px-3 py-1 rounded-lg text-xs transition-all active:scale-95"
                            style={{
                                background: 'rgba(255,255,255,0.07)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                color: atStart ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.7)',
                                cursor: atStart ? 'not-allowed' : 'pointer',
                                fontFamily: 'system-ui,sans-serif',
                            }}
                        >
                            ← Prev
                        </button>

                        {/* Go-to Input */}
                        <form onSubmit={handleSubmit} className="flex items-center gap-1 flex-none">
                            <input
                                type="number"
                                min={MIN_ANG}
                                max={MAX_ANG}
                                value={inputVal}
                                onChange={(e) => setInputVal(e.target.value)}
                                className="text-center text-xs rounded-lg px-2 py-1 focus:outline-none"
                                style={{
                                    width: 56,
                                    background: 'rgba(255,255,255,0.06)',
                                    border: '1px solid rgba(255,255,255,0.12)',
                                    color: 'rgba(255,255,255,0.88)',
                                    fontFamily: 'system-ui,sans-serif',
                                }}
                            />
                            <button
                                type="submit"
                                className="px-3 py-1 rounded-lg text-xs transition-all active:scale-95"
                                style={{
                                    background: 'rgba(255,255,255,0.1)',
                                    border: '1px solid rgba(255,255,255,0.15)',
                                    color: 'rgba(255,255,255,0.8)',
                                    cursor: 'pointer',
                                    fontFamily: 'system-ui,sans-serif',
                                }}
                            >
                                Go
                            </button>
                        </form>

                        {/* Next */}
                        <button
                            disabled={atEnd}
                            onClick={() => goToAng(angNum + 1)}
                            className="flex-none px-3 py-1 rounded-lg text-xs transition-all active:scale-95"
                            style={{
                                background: 'rgba(255,255,255,0.07)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                color: atEnd ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.7)',
                                cursor: atEnd ? 'not-allowed' : 'pointer',
                                fontFamily: 'system-ui,sans-serif',
                            }}
                        >
                            Next →
                        </button>

                        <div className="flex-1" />

                        {/* Translit Toggle */}
                        <div className="flex items-center gap-2 flex-none">
                            <span
                                className="text-xs"
                                style={{
                                    color: 'rgba(255,255,255,0.35)',
                                    fontFamily: 'system-ui,sans-serif',
                                }}
                            >
                                Translit
                            </span>
                            <button
                                onClick={() => setShowTrans(v => !v)}
                                className="px-2.5 py-1 text-xs rounded-full transition"
                                style={{
                                    background: showTrans
                                        ? 'rgba(255,255,255,0.14)'
                                        : 'rgba(255,255,255,0.06)',
                                    border: '1px solid rgba(255,255,255,0.12)',
                                    color: showTrans
                                        ? 'rgba(255,255,255,0.9)'
                                        : 'rgba(255,255,255,0.4)',
                                    cursor: 'pointer',
                                    fontFamily: 'system-ui,sans-serif',
                                }}
                            >
                                {showTrans ? 'On' : 'Off'}
                            </button>
                        </div>

                        <span
                            className="text-xs flex-none"
                            style={{
                                fontFamily: 'system-ui,sans-serif',
                                color: 'rgba(255,255,255,0.2)',
                            }}
                        >
                            {angNum} / {MAX_ANG}
                        </span>
                    </div>

                    {/* Card Body */}
                    <div className="px-8 py-7">
                        {loading && (
                            <div className="flex justify-center py-16">
                                <div
                                    className="w-8 h-8 rounded-full border-2 animate-spin"
                                    style={{
                                        borderColor: 'rgba(255,255,255,0.08)',
                                        borderTopColor: 'rgba(255,255,255,0.5)',
                                    }}
                                />
                            </div>
                        )}

                        {!loading && error && (
                            <div className="text-center py-12 space-y-3">
                                <p
                                    className="text-sm"
                                    style={{
                                        fontFamily: 'system-ui,sans-serif',
                                        color: 'rgba(255,255,255,0.4)',
                                    }}
                                >
                                    {error}
                                </p>
                                <button
                                    onClick={() => goToAng(angNum)}
                                    className="px-4 py-2 rounded-xl text-sm transition-colors"
                                    style={{
                                        fontFamily: 'system-ui,sans-serif',
                                        border: '1px solid rgba(255,255,255,0.15)',
                                        color: 'rgba(255,255,255,0.55)',
                                        background: 'transparent',
                                        cursor: 'pointer',
                                    }}
                                >
                                    Retry
                                </button>
                            </div>
                        )}

                        {!loading && !error && lines.length > 0 && (
                            <>
                                <p
                                    className="text-xs mb-6 text-right"
                                    style={{
                                        fontFamily: 'system-ui,sans-serif',
                                        color: 'rgba(255,255,255,0.2)',
                                    }}
                                >
                                    Tap any line for transliteration
                                </p>
                                <div style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
                                    {lines.map((line, i) => (
                                        <VerseBlock
                                            key={line.id ?? i}
                                            line={line}
                                            showTrans={showTrans}
                                            onWordClick={() => handleWordClick(line)}
                                        />
                                    ))}
                                </div>
                            </>
                        )}
                    </div>

                    {/* Card Footer */}
                    {!loading && lines.length > 0 && (
                        <div
                            className="px-8 py-4 flex justify-between"
                            style={{
                                background: 'rgba(255,255,255,0.02)',
                                borderTop: '1px solid rgba(255,255,255,0.07)',
                            }}
                        >
                            <button
                                disabled={atStart}
                                onClick={() => goToAng(angNum - 1)}
                                className="px-5 py-2 rounded-xl text-sm transition-all active:scale-95"
                                style={{
                                    fontFamily: 'system-ui,sans-serif',
                                    background: 'rgba(255,255,255,0.07)',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    color: atStart ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.75)',
                                    cursor: atStart ? 'not-allowed' : 'pointer',
                                }}
                            >
                                ← Previous Page
                            </button>
                            <button
                                disabled={atEnd}
                                onClick={() => goToAng(angNum + 1)}
                                className="px-5 py-2 rounded-xl text-sm transition-all active:scale-95"
                                style={{
                                    fontFamily: 'system-ui,sans-serif',
                                    background: 'rgba(255,255,255,0.07)',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    color: atEnd ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.75)',
                                    cursor: atEnd ? 'not-allowed' : 'pointer',
                                }}
                            >
                                Next Page →
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {meaningData && (
                <MeaningBox data={meaningData} onClose={() => setMeaningData(null)} />
            )}
        </div>
    );
}

// ── VerseBlock Component ──
function VerseBlock({ line, showTrans, onWordClick }) {
    if (!line.gurmukhi) return null;
    const words = line.gurmukhi.split(' ').filter(Boolean);

    return (
        <div className="py-5 first:pt-0 last:pb-0">
            <p
                className="leading-loose mb-1"
                style={{
                    fontFamily: GURBANI_FONT,
                    fontSize: 'clamp(1.1rem, 2.5vw, 1.5rem)',
                    lineHeight: 1.85,
                    letterSpacing: '0.01em',
                }}
            >
                {words.map((word, idx) => (
                    <span key={idx}>
                        <span
                            onClick={() => onWordClick(word)}
                            className="text-white/85 font-bold cursor-pointer
                                       hover:text-white hover:underline
                                       underline-offset-4 decoration-dotted
                                       transition-colors duration-100"
                            title="Click for transliteration"
                        >
                            {word}
                        </span>
                        {idx < words.length - 1 ? ' ' : ''}
                    </span>
                ))}
            </p>

            {showTrans && line.translit && (
                <p
                    className="text-white/40 text-sm italic mt-1.5 leading-relaxed"
                    style={{ fontFamily: 'system-ui,-apple-system,sans-serif' }}
                >
                    {line.translit}
                </p>
            )}
        </div>
    );
}