// import { useEffect, useState, useRef, useCallback } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { getAng, parseAngData } from '../services/gurbaniApi';

// const MIN_ANG = 1;
// const MAX_ANG = 1430;
// const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
// const GURBANI_FONT = "'Noto Sans Gurmukhi','Gurmukhi MN','Kohinoor Gurmukhi','AnmolLipi',sans-serif";

// export default function Reader() {
//     const { ang: angParam } = useParams();
//     const navigate = useNavigate();
//     const angNum = clamp(parseInt(angParam, 10) || 1, MIN_ANG, MAX_ANG);

//     const [lines, setLines] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const [inputVal, setInputVal] = useState(String(angNum));
//     const [showTrans, setShowTrans] = useState(false);
//     const [showMeaning, setShowMeaning] = useState(false);
//     const abortRef = useRef(null);

//     useEffect(() => {
//         if (abortRef.current) abortRef.current.abort();
//         const ctrl = new AbortController();
//         abortRef.current = ctrl;
//         setLoading(true);
//         setError(null);
//         setLines([]);
//         setInputVal(String(angNum));

//         getAng(angNum)
//             .then((raw) => {
//                 if (ctrl.signal.aborted) return;
//                 const parsed = parseAngData(raw);
//                 if (!parsed.length) setError(`No content found for Ang ${angNum}.`);
//                 else setLines(parsed);
//             })
//             .catch((err) => { if (!ctrl.signal.aborted) setError(err.message); })
//             .finally(() => { if (!ctrl.signal.aborted) setLoading(false); });

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

//     useEffect(() => {
//         const h = (e) => {
//             if (e.target.tagName === 'INPUT') return;
//             if (e.key === 'ArrowLeft') { e.preventDefault(); goToAng(angNum - 1); }
//             if (e.key === 'ArrowRight') { e.preventDefault(); goToAng(angNum + 1); }
//         };
//         window.addEventListener('keydown', h);
//         return () => window.removeEventListener('keydown', h);
//     }, [angNum, goToAng]);

//     const atStart = angNum <= MIN_ANG;
//     const atEnd = angNum >= MAX_ANG;

//     return (
//         <div className="min-h-screen">

//             {/* ── Sticky toolbar ── */}
//             <div className="sticky top-16 z-40 border-b border-white/10 bg-black/60 backdrop-blur-xl">
//                 <div className="max-w-[min(900px,92vw)] mx-auto px-4 py-2.5 flex items-center gap-3 flex-wrap">

//                     <ToolbarBtn disabled={atStart} onClick={() => goToAng(angNum - 1)}>
//                         ← Previous
//                     </ToolbarBtn>

//                     <form onSubmit={handleSubmit} className="flex items-center gap-2">
//                         <label htmlFor="ang-input" className="text-white/45 text-sm select-none"
//                             style={{ fontFamily: 'system-ui,sans-serif' }}>
//                             Ang
//                         </label>
//                         <input
//                             id="ang-input"
//                             type="number"
//                             min={MIN_ANG}
//                             max={MAX_ANG}
//                             value={inputVal}
//                             onChange={(e) => setInputVal(e.target.value)}
//                             className="w-20 text-center text-white text-sm
//                          bg-white/10 border border-white/25 rounded-xl px-2 py-1.5
//                          focus:outline-none focus:border-white/50 focus:bg-white/15
//                          transition-colors [appearance:textfield]
//                          [&::-webkit-inner-spin-button]:appearance-none
//                          [&::-webkit-outer-spin-button]:appearance-none"
//                             style={{ fontFamily: 'system-ui,sans-serif' }}
//                         />
//                         <ToolbarBtn type="submit">Go</ToolbarBtn>
//                     </form>

//                     <ToolbarBtn disabled={atEnd} onClick={() => goToAng(angNum + 1)}>
//                         Next →
//                     </ToolbarBtn>

//                     <div className="flex-1" />

//                     <ToggleBtn active={showTrans} onClick={() => setShowTrans(v => !v)}>
//                         Translit
//                     </ToggleBtn>
//                     <ToggleBtn active={showMeaning} onClick={() => setShowMeaning(v => !v)}>
//                         English
//                     </ToggleBtn>
//                 </div>
//             </div>

//             {/* ── Centred card ── */}
//             <div className="flex justify-center px-4 py-10">
//                 <div
//                     className="w-full max-w-[860px] rounded-3xl border border-white/15 overflow-hidden"
//                     style={{
//                         background: 'rgba(255,255,255,0.06)',
//                         backdropFilter: 'blur(24px) saturate(160%)',
//                         WebkitBackdropFilter: 'blur(24px) saturate(160%)',
//                         boxShadow: '0 32px 80px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.12)',
//                     }}
//                 >
//                     {/* Card header — "Ang 347" */}
//                     <div
//                         className="px-8 py-4 border-b border-white/10 flex items-center justify-between"
//                         style={{ background: 'rgba(255,255,255,0.04)' }}
//                     >
//                         <span
//                             className="text-white font-semibold text-base"
//                             style={{ fontFamily: 'system-ui,sans-serif' }}
//                         >
//                             Ang {angNum}
//                         </span>
//                         <span
//                             className="text-white/30 text-xs"
//                             style={{ fontFamily: 'system-ui,sans-serif' }}
//                         >
//                             {angNum} / {MAX_ANG}
//                         </span>
//                     </div>

//                     {/* Card body */}
//                     <div className="px-8 py-7">

//                         {/* Loading */}
//                         {loading && (
//                             <div className="flex justify-center py-16">
//                                 <div className="w-8 h-8 rounded-full border-2 border-white/15
//                                 border-t-white/70 animate-spin" />
//                             </div>
//                         )}

//                         {/* Error */}
//                         {!loading && error && (
//                             <div className="text-center py-12 space-y-3">
//                                 <p className="text-white/45 text-sm" style={{ fontFamily: 'system-ui,sans-serif' }}>
//                                     {error}
//                                 </p>
//                                 <button
//                                     onClick={() => goToAng(angNum)}
//                                     className="px-4 py-2 rounded-xl text-sm text-white/60
//                              border border-white/20 hover:bg-white/10 transition-colors"
//                                     style={{ fontFamily: 'system-ui,sans-serif' }}
//                                 >
//                                     Retry
//                                 </button>
//                             </div>
//                         )}

//                         {/* Verses */}
//                         {!loading && !error && lines.length > 0 && (
//                             <div className="divide-y divide-white/[0.06]">
//                                 {lines.map((line, i) => (
//                                     <VerseBlock
//                                         key={line.id ?? i}
//                                         line={line}
//                                         showTrans={showTrans}
//                                         showMeaning={showMeaning}
//                                     />
//                                 ))}
//                             </div>
//                         )}
//                     </div>

//                     {/* Card footer — prev / next */}
//                     {!loading && lines.length > 0 && (
//                         <div
//                             className="px-8 py-4 border-t border-white/10
//                          flex justify-between items-center"
//                             style={{ background: 'rgba(255,255,255,0.03)' }}
//                         >
//                             <ToolbarBtn disabled={atStart} onClick={() => goToAng(angNum - 1)}>
//                                 ← Previous Ang
//                             </ToolbarBtn>
//                             <ToolbarBtn disabled={atEnd} onClick={() => goToAng(angNum + 1)}>
//                                 Next Ang →
//                             </ToolbarBtn>
//                         </div>
//                     )}
//                 </div>
//             </div>
//         </div>
//     );
// }

// // Verse block 
// function VerseBlock({ line, showTrans, showMeaning }) {
//     if (!line.gurmukhi) return null;
//     return (
//         <div className="py-5 first:pt-0 last:pb-0">
//             {/* Gurmukhi — large bold, full width */}
//             <p
//                 className="text-white font-bold leading-loose"
//                 style={{
//                     fontFamily: GURBANI_FONT,
//                     fontSize: 'clamp(1.1rem, 2.5vw, 1.5rem)',
//                     lineHeight: 1.85,
//                     letterSpacing: '0.01em',
//                 }}
//             >
//                 {line.gurmukhi}
//             </p>

//             {/* Transliteration */}
//             {showTrans && line.translit && (
//                 <p
//                     className="text-white/50 text-sm italic mt-1.5 leading-relaxed"
//                     style={{ fontFamily: 'system-ui,-apple-system,sans-serif' }}
//                 >
//                     {line.translit}
//                 </p>
//             )}

//             {/* English meaning */}
//             {showMeaning && line.translation && (
//                 <p
//                     className="text-white/38 text-sm mt-1.5 leading-relaxed
//                      pl-3 border-l-2 border-white/15"
//                     style={{ fontFamily: 'system-ui,-apple-system,sans-serif' }}
//                 >
//                     {line.translation}
//                 </p>
//             )}
//         </div>
//     );
// }

// // Shared UI 
// function ToolbarBtn({ children, disabled, onClick, type = 'button' }) {
//     return (
//         <button
//             type={type}
//             disabled={disabled}
//             onClick={onClick}
//             className={[
//                 'px-4 py-1.5 rounded-xl text-sm whitespace-nowrap',
//                 'border border-white/18 bg-white/[0.07] text-white/70',
//                 'hover:bg-white/14 hover:text-white hover:border-white/30',
//                 'active:scale-95 transition-all duration-150',
//                 disabled ? 'opacity-20 pointer-events-none' : 'cursor-pointer',
//             ].join(' ')}
//             style={{ fontFamily: 'system-ui,sans-serif' }}
//         >
//             {children}
//         </button>
//     );
// }

// function ToggleBtn({ children, active, onClick }) {
//     return (
//         <button
//             type="button"
//             onClick={onClick}
//             className={[
//                 'px-3 py-1 rounded-full text-xs border transition-all duration-150',
//                 active
//                     ? 'bg-white/16 border-white/30 text-white'
//                     : 'bg-transparent border-white/12 text-white/35 hover:text-white/55',
//             ].join(' ')}
//             style={{ fontFamily: 'system-ui,sans-serif' }}
//         >
//             {children}
//         </button>
//     );
// }


// src/pages/Reader.jsx
// Full port of ang.html + ang-viewer.js + meaning-box.js + search-live.js
//
// Features:
//  ✓ Fetch ang from BaniDB via gurbaniApi.js
//  ✓ Centered glassy card with "Ang N" heading
//  ✓ Every Gurmukhi WORD is clickable → MeaningBox popup
//  ✓ MeaningBox shows: translation, transliteration, word meanings (etymology)
//  ✓ Prev / Next / Go toolbar + keyboard ← →
//  ✓ Transliteration + English toggles (off by default)
//  ✓ Search bar with live dropdown (like search-live.js on ang.html)

import { useEffect, useState, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getAng, parseAngData } from '../services/gurbaniApi';
import MeaningBox from '../components/reader/MeaningBox';


const MIN_ANG = 1;
const MAX_ANG = 1430;
const GURBANI_FONT = "'Noto Sans Gurmukhi','Gurmukhi MN','Kohinoor Gurmukhi','AnmolLipi',sans-serif";
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
    const [showMeaning, setShowMeaning] = useState(false);
    // MeaningBox state — null = closed, object = data to show
    const [meaningData, setMeaningData] = useState(null);
    // Raw page items (needed for per-line etymology)
    const [rawPage, setRawPage] = useState([]);
    const abortRef = useRef(null);

    // ── Fetch ─────────────────────────────────────────────────────────────────
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
                // Store raw page for etymology lookup
                if (Array.isArray(raw?.page)) setRawPage(raw.page);
                const parsed = parseAngData(raw);
                if (!parsed.length) setError(`No content found for Ang ${angNum}.`);
                else setLines(parsed);
            })
            .catch((err) => { if (!ctrl.signal.aborted) setError(err.message); })
            .finally(() => { if (!ctrl.signal.aborted) setLoading(false); });

        return () => ctrl.abort();
    }, [angNum]);

    // ── Navigation ────────────────────────────────────────────────────────────
    const goToAng = useCallback(
        (n) => navigate(`/reader/${clamp(n, MIN_ANG, MAX_ANG)}`),
        [navigate]
    );

    function handleSubmit(e) {
        e.preventDefault();
        const n = parseInt(inputVal, 10);
        if (!isNaN(n)) goToAng(n);
    }

    useEffect(() => {
        const h = (e) => {
            if (e.target.tagName === 'INPUT') return;
            if (meaningData) return; // don't navigate when popup is open
            if (e.key === 'ArrowLeft') { e.preventDefault(); goToAng(angNum - 1); }
            if (e.key === 'ArrowRight') { e.preventDefault(); goToAng(angNum + 1); }
        };
        window.addEventListener('keydown', h);
        return () => window.removeEventListener('keydown', h);
    }, [angNum, goToAng, meaningData]);

    // ── Word click → MeaningBox ───────────────────────────────────────────────
    // Look up the matching raw page item to get etymology (translation.pu.pss)
    function handleWordClick(line, clickedWord) {
        // Find matching raw item by verseId or gurmukhi text
        const rawItem = rawPage.find(
            (item) => item.verseId === line.id ||
                item.verse?.unicode === line.gurmukhi
        );

        // Build popup data
        const etymology =
            rawItem?.translation?.pu?.pss?.unicode ||
            rawItem?.translation?.pu?.pss?.gurmukhi ||
            rawItem?.translation?.pu?.ft?.unicode ||
            '';

        setMeaningData({
            gurmukhiText: line.gurmukhi,          // full line (like original)
            translation: line.translation || '',
            transliteration: line.translit || '',
            etymology: etymology,
        });
    }

    const atStart = angNum <= MIN_ANG;
    const atEnd = angNum >= MAX_ANG;

    return (
        <div className="min-h-screen">

            {/* ── Sticky toolbar ── */}
            <div className="sticky top-16 z-40 border-b border-white/10 bg-black/60 backdrop-blur-xl">
                <div className="max-w-[min(900px,92vw)] mx-auto px-4 py-2.5
                        flex items-center gap-3 flex-wrap">

                    <ToolbarBtn disabled={atStart} onClick={() => goToAng(angNum - 1)}>
                        ← Previous
                    </ToolbarBtn>

                    <form onSubmit={handleSubmit} className="flex items-center gap-2">
                        <label
                            htmlFor="ang-input"
                            className="text-white/45 text-sm select-none"
                            style={{ fontFamily: 'system-ui,sans-serif' }}
                        >
                            Ang
                        </label>
                        <input
                            id="ang-input"
                            type="number"
                            min={MIN_ANG}
                            max={MAX_ANG}
                            value={inputVal}
                            onChange={(e) => setInputVal(e.target.value)}
                            className="w-20 text-center text-white text-sm
                         bg-white/10 border border-white/25 rounded-xl px-2 py-1.5
                         focus:outline-none focus:border-white/50 focus:bg-white/15
                         transition-colors [appearance:textfield]
                         [&::-webkit-inner-spin-button]:appearance-none
                         [&::-webkit-outer-spin-button]:appearance-none"
                            style={{ fontFamily: 'system-ui,sans-serif' }}
                        />
                        <ToolbarBtn type="submit">Go</ToolbarBtn>
                    </form>

                    <ToolbarBtn disabled={atEnd} onClick={() => goToAng(angNum + 1)}>
                        Next →
                    </ToolbarBtn>

                    <div className="flex-1" />

                    <ToggleBtn active={showTrans} onClick={() => setShowTrans(v => !v)}>
                        Translit
                    </ToggleBtn>
                    <ToggleBtn active={showMeaning} onClick={() => setShowMeaning(v => !v)}>
                        English
                    </ToggleBtn>
                </div>
            </div>

            {/* ── Centred glass card ── */}
            <div className="flex justify-center px-4 py-8">
                <div
                    className="w-full max-w-[860px] rounded-3xl border border-white/15 overflow-hidden"
                    style={{
                        background: 'rgba(255,255,255,0.06)',
                        backdropFilter: 'blur(24px) saturate(160%)',
                        WebkitBackdropFilter: 'blur(24px) saturate(160%)',
                        boxShadow: '0 32px 80px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.12)',
                    }}
                >
                    {/* Card header */}
                    <div
                        className="px-8 py-4 border-b border-white/10 flex items-center justify-between"
                        style={{ background: 'rgba(255,255,255,0.04)' }}
                    >
                        <span
                            className="text-white font-semibold text-base"
                            style={{ fontFamily: 'system-ui,sans-serif' }}
                        >
                            Ang {angNum}
                        </span>
                        <span
                            className="text-white/25 text-xs"
                            style={{ fontFamily: 'system-ui,sans-serif' }}
                        >
                            {angNum} / {MAX_ANG}
                        </span>
                    </div>

                    {/* Card body */}
                    <div className="px-8 py-7">

                        {loading && (
                            <div className="flex justify-center py-16">
                                <div className="w-8 h-8 rounded-full border-2 border-white/15
                                border-t-white/70 animate-spin" />
                            </div>
                        )}

                        {!loading && error && (
                            <div className="text-center py-12 space-y-3">
                                <p className="text-white/45 text-sm"
                                    style={{ fontFamily: 'system-ui,sans-serif' }}>
                                    {error}
                                </p>
                                <button
                                    onClick={() => goToAng(angNum)}
                                    className="px-4 py-2 rounded-xl text-sm text-white/60
                             border border-white/20 hover:bg-white/10 transition-colors"
                                    style={{ fontFamily: 'system-ui,sans-serif' }}
                                >
                                    Retry
                                </button>
                            </div>
                        )}

                        {/* Click-hint */}
                        {!loading && !error && lines.length > 0 && (
                            <p
                                className="text-white/25 text-xs mb-5 text-right"
                                style={{ fontFamily: 'system-ui,sans-serif' }}
                            >
                                Tap any line for translation
                            </p>
                        )}

                        {/* Lines */}
                        {!loading && !error && lines.length > 0 && (
                            <div className="divide-y divide-white/[0.06]">
                                {lines.map((line, i) => (
                                    <VerseBlock
                                        key={line.id ?? i}
                                        line={line}
                                        showTrans={showTrans}
                                        showMeaning={showMeaning}
                                        onWordClick={(word) => handleWordClick(line, word)}
                                    />
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Card footer */}
                    {!loading && lines.length > 0 && (
                        <div
                            className="px-8 py-4 border-t border-white/10 flex justify-between"
                            style={{ background: 'rgba(255,255,255,0.03)' }}
                        >
                            <ToolbarBtn disabled={atStart} onClick={() => goToAng(angNum - 1)}>
                                ← Previous Ang
                            </ToolbarBtn>
                            <ToolbarBtn disabled={atEnd} onClick={() => goToAng(angNum + 1)}>
                                Next Ang →
                            </ToolbarBtn>
                        </div>
                    )}
                </div>
            </div>

            {/* ── MeaningBox popup ── */}
            {meaningData && (
                <MeaningBox
                    data={meaningData}
                    onClose={() => setMeaningData(null)}
                />
            )}
        </div>
    );
}

// ─── Verse block ──────────────────────────────────────────────────────────────
// Each Gurmukhi line is split into words — each word is clickable.
// Clicking any word in a line triggers the MeaningBox for that whole line.
function VerseBlock({ line, showTrans, showMeaning, onWordClick }) {
    if (!line.gurmukhi) return null;

    const words = line.gurmukhi.split(' ').filter(Boolean);

    return (
        <div className="py-5 first:pt-0 last:pb-0">
            {/* Gurmukhi — words as clickable spans */}
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
                            className="text-white font-bold cursor-pointer
                         hover:text-amber-200 hover:underline
                         underline-offset-4 decoration-dotted
                         transition-colors duration-100"
                            title="Click for meaning"
                        >
                            {word}
                        </span>
                        {idx < words.length - 1 ? ' ' : ''}
                    </span>
                ))}
            </p>

            {/* Transliteration */}
            {showTrans && line.translit && (
                <p
                    className="text-white/50 text-sm italic mt-1.5 leading-relaxed"
                    style={{ fontFamily: 'system-ui,-apple-system,sans-serif' }}
                >
                    {line.translit}
                </p>
            )}

            {/* English */}
            {showMeaning && line.translation && (
                <p
                    className="text-white/38 text-sm mt-1.5 leading-relaxed
                     pl-3 border-l-2 border-white/15"
                    style={{ fontFamily: 'system-ui,-apple-system,sans-serif' }}
                >
                    {line.translation}
                </p>
            )}
        </div>
    );
}

// ─── Shared UI ────────────────────────────────────────────────────────────────
function ToolbarBtn({ children, disabled, onClick, type = 'button' }) {
    return (
        <button
            type={type}
            disabled={disabled}
            onClick={onClick}
            className={[
                'px-4 py-1.5 rounded-xl text-sm whitespace-nowrap',
                'border border-white/18 bg-white/[0.07] text-white/70',
                'hover:bg-white/14 hover:text-white hover:border-white/30',
                'active:scale-95 transition-all duration-150',
                disabled ? 'opacity-20 pointer-events-none' : 'cursor-pointer',
            ].join(' ')}
            style={{ fontFamily: 'system-ui,sans-serif' }}
        >
            {children}
        </button>
    );
}

function ToggleBtn({ children, active, onClick }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={[
                'px-3 py-1 rounded-full text-xs border transition-all duration-150',
                active
                    ? 'bg-white/16 border-white/30 text-white'
                    : 'bg-transparent border-white/12 text-white/35 hover:text-white/55',
            ].join(' ')}
            style={{ fontFamily: 'system-ui,sans-serif' }}
        >
            {children}
        </button>
    );
}