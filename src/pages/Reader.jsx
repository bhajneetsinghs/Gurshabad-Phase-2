import { useEffect, useState, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getAng, parseAngData } from '../services/gurbaniApi';
import MeaningBox from '../components/reader/MeaningBox';
import { Link } from 'react-router-dom';
import SearchBar from '../components/search/SearchBar';

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
    const [meaningData, setMeaningData] = useState(null);
    const [rawPage, setRawPage] = useState([]);
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
            .catch((err) => { if (!ctrl.signal.aborted) setError(err.message); })
            .finally(() => { if (!ctrl.signal.aborted) setLoading(false); });

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

    useEffect(() => {
        const h = (e) => {
            if (e.target.tagName === 'INPUT') return;
            if (meaningData) return;
            if (e.key === 'ArrowLeft') { e.preventDefault(); goToAng(angNum - 1); }
            if (e.key === 'ArrowRight') { e.preventDefault(); goToAng(angNum + 1); }
        };
        window.addEventListener('keydown', h);
        return () => window.removeEventListener('keydown', h);
    }, [angNum, goToAng, meaningData]);

    function handleWordClick(line, clickedWord) {
        const rawItem = rawPage.find(
            (item) => item.verseId === line.id ||
                item.verse?.unicode === line.gurmukhi
        );
        setMeaningData({
            gurmukhiText: line.gurmukhi,
            transliteration: line.translit || '',
        });
    }

    const atStart = angNum <= MIN_ANG;
    const atEnd = angNum >= MAX_ANG;

    return (
        <div className="min-h-screen">

            {/* ── Sticky toolbar ── */}
            <div className="sticky top-16 z-40 border-b border-white/10 bg-black/60 backdrop-blur-xl">
                <div className="max-w-[min(1200px,95vw)] mx-auto px-4 py-2 flex items-center">
                    <span className="text-white/30 text-xs"
                        style={{ fontFamily: 'system-ui,sans-serif' }}>
                        Ang {angNum} / {MAX_ANG}
                    </span>
                </div>
            </div>

            {/* ── TWO COLUMN LAYOUT ── */}
            <div className="max-w-[min(1200px,95vw)] mx-auto px-4 py-8
                            grid grid-cols-3 gap-6 items-start">

                {/* ── LEFT COLUMN 1/3 — Search + Nav ── */}
                <div className="col-span-1 sticky top-32 flex flex-col gap-4">

                    {/* Search box */}
                    <div
                        className="rounded-2xl border border-white/15 overflow-hidden"
                        style={{
                            background: 'rgba(255,255,255,0.04)',
                            backdropFilter: 'blur(24px)',
                            WebkitBackdropFilter: 'blur(24px)',
                        }}
                    >
                        <div className="px-4 py-2.5 border-b border-white/10">
                            <p className="text-white/50 text-xs uppercase tracking-widest"
                                style={{ fontFamily: 'system-ui,sans-serif' }}>
                                Search Gurbani
                            </p>
                        </div>
                        <div className="p-3">
                            <SearchBar hideDropdown hideHint />
                        </div>
                    </div>

                    {/* Nav controls */}
                    <div
                        className="rounded-2xl border border-white/15 overflow-hidden"
                        style={{
                            background: 'rgba(255,255,255,0.04)',
                            backdropFilter: 'blur(24px)',
                            WebkitBackdropFilter: 'blur(24px)',
                        }}
                    >
                        <div className="px-4 py-2.5 border-b border-white/10">
                            <p className="text-white/50 text-xs uppercase tracking-widest"
                                style={{ fontFamily: 'system-ui,sans-serif' }}>
                                Navigation
                            </p>
                        </div>
                        <div className="p-4 flex flex-col gap-4">

                            {/* Previous / Next — full width */}
                            <div className="grid grid-cols-2 gap-2">
                                <button
                                    disabled={atStart}
                                    onClick={() => goToAng(angNum - 1)}
                                    className={[
                                        'py-2 rounded-xl text-sm text-center',
                                        'border border-white/18 bg-white/[0.07] text-white/70',
                                        'hover:bg-white/14 hover:text-white hover:border-white/30',
                                        'active:scale-95 transition-all duration-150',
                                        atStart ? 'opacity-20 pointer-events-none' : 'cursor-pointer',
                                    ].join(' ')}
                                    style={{ fontFamily: 'system-ui,sans-serif' }}
                                >
                                    ← Previous
                                </button>
                                <button
                                    disabled={atEnd}
                                    onClick={() => goToAng(angNum + 1)}
                                    className={[
                                        'py-2 rounded-xl text-sm text-center',
                                        'border border-white/18 bg-white/[0.07] text-white/70',
                                        'hover:bg-white/14 hover:text-white hover:border-white/30',
                                        'active:scale-95 transition-all duration-150',
                                        atEnd ? 'opacity-20 pointer-events-none' : 'cursor-pointer',
                                    ].join(' ')}
                                    style={{ fontFamily: 'system-ui,sans-serif' }}
                                >
                                    Next →
                                </button>
                            </div>

                            <div className="border-t border-white/10" />

                            {/* Page jump */}
                            <form onSubmit={handleSubmit} className="flex items-center gap-2">
                                <label
                                    htmlFor="ang-input"
                                    className="text-white/45 text-sm select-none shrink-0"
                                    style={{ fontFamily: 'system-ui,sans-serif' }}
                                >
                                    Page
                                </label>
                                <input
                                    id="ang-input"
                                    type="number"
                                    min={MIN_ANG}
                                    max={MAX_ANG}
                                    value={inputVal}
                                    onChange={(e) => setInputVal(e.target.value)}
                                    className="flex-1 text-center text-white text-sm
                                               bg-white/10 border border-white/25 rounded-xl px-2 py-1.5
                                               focus:outline-none focus:border-white/50 focus:bg-white/15
                                               transition-colors [appearance:textfield]
                                               [&::-webkit-inner-spin-button]:appearance-none
                                               [&::-webkit-outer-spin-button]:appearance-none"
                                    style={{ fontFamily: 'system-ui,sans-serif' }}
                                />
                                <ToolbarBtn type="submit">Go</ToolbarBtn>
                            </form>

                            <div className="border-t border-white/10" />

                            {/* Translit toggle */}
                            <div className="flex items-center justify-between">
                                <span className="text-white/50 text-sm"
                                    style={{ fontFamily: 'system-ui,sans-serif' }}>
                                    Transliteration
                                </span>
                                <ToggleBtn active={showTrans} onClick={() => setShowTrans(v => !v)}>
                                    {showTrans ? 'On' : 'Off'}
                                </ToggleBtn>
                            </div>

                        </div>
                    </div>

                </div>

                {/* ── RIGHT COLUMN 2/3 — Shabad content ── */}
                <div className="col-span-2">
                    <div
                        className="w-full rounded-3xl border border-white/15 overflow-hidden"
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
                                Page {angNum}
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

                            {!loading && !error && lines.length > 0 && (
                                <p className="text-white/25 text-xs mb-5 text-right"
                                    style={{ fontFamily: 'system-ui,sans-serif' }}>
                                    Tap any line for transliteration
                                </p>
                            )}

                            {!loading && !error && lines.length > 0 && (
                                <div className="divide-y divide-white/[0.06]">
                                    {lines.map((line, i) => (
                                        <VerseBlock
                                            key={line.id ?? i}
                                            line={line}
                                            showTrans={showTrans}
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
                                    ← Previous Page
                                </ToolbarBtn>
                                <ToolbarBtn disabled={atEnd} onClick={() => goToAng(angNum + 1)}>
                                    Next Page →
                                </ToolbarBtn>
                            </div>
                        )}
                    </div>
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
                            className="text-white font-bold cursor-pointer
                                       hover:text-amber-200 hover:underline
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
                    className="text-white/50 text-sm italic mt-1.5 leading-relaxed"
                    style={{ fontFamily: 'system-ui,-apple-system,sans-serif' }}
                >
                    {line.translit}
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