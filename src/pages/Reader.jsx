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

    useEffect(() => {
        const handleKey = (e) => {
            if (e.target.tagName === 'INPUT') return;
            if (meaningData) return;

            if (e.key === 'ArrowLeft') {
                e.preventDefault();
                goToAng(angNum - 1);
            }
            if (e.key === 'ArrowRight') {
                e.preventDefault();
                goToAng(angNum + 1);
            }
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

            {/* Navigation Box */}
        
            <div className="w-full max-w-6xl mx-auto mb-6">
                <div
                    className="rounded-2xl p-4 flex flex-col gap-4"
                    style={{
                        background: 'rgba(255,255,255,0.04)',
                        border: '1px solid rgba(212,175,55,0.15)',
                        backdropFilter: 'blur(16px)',
                    }}
                >
                    {/* Top row */}
                    <div className="flex items-center justify-between">
                        <p
                            className="text-xs uppercase tracking-widest"
                            style={{ color: 'rgba(212,175,55,0.7)' }}
                        >
                            Navigation
                        </p>

                        <span className="text-xs opacity-50">
                            {angNum} / {MAX_ANG}
                        </span>
                    </div>

                    {/* Controls */}
                    <div className="flex items-center gap-2">
                        <button
                            disabled={atStart}
                            onClick={() => goToAng(angNum - 1)}
                            className="flex-1 py-2 rounded-xl text-sm transition active:scale-95"
                            style={{
                                background: atStart
                                    ? 'rgba(255,255,255,0.05)'
                                    : 'rgba(212,175,55,0.12)',
                                color: atStart
                                    ? 'rgba(255,255,255,0.3)'
                                    : 'rgba(212,175,55,0.9)',
                                border: '1px solid rgba(212,175,55,0.2)',
                                cursor: atStart ? 'not-allowed' : 'pointer',
                            }}
                        >
                            ← Prev
                        </button>

                        <form onSubmit={handleSubmit} className="flex gap-2 ">
                            <input
                                type="number"
                                min={MIN_ANG}
                                max={MAX_ANG}
                                value={inputVal}
                                onChange={(e) => setInputVal(e.target.value)}
                                className="w-full text-center text-sm rounded-xl px-2 py-2 focus:outline-none"
                                style={{
                                    background: 'rgba(255,255,255,0.06)',
                                    border: '1px solid rgba(212,175,55,0.2)',
                                    color: 'white',
                                }}
                            />
                            <button
                                type="submit"
                                className="px-4 py-2 rounded-xl text-sm"
                                style={{
                                    background: 'rgba(212,175,55,0.15)',
                                    border: '1px solid rgba(212,175,55,0.3)',
                                    color: 'rgba(212,175,55,0.9)',
                                }}
                            >
                                Go
                            </button>
                        </form>

                        <button
                            disabled={atEnd}
                            onClick={() => goToAng(angNum + 1)}
                            className="flex-1 py-2 rounded-xl text-sm transition active:scale-95"
                            style={{
                                background: atEnd
                                    ? 'rgba(255,255,255,0.05)'
                                    : 'rgba(212,175,55,0.12)',
                                color: atEnd
                                    ? 'rgba(255,255,255,0.3)'
                                    : 'rgba(212,175,55,0.9)',
                                border: '1px solid rgba(212,175,55,0.2)',
                                cursor: atEnd ? 'not-allowed' : 'pointer',
                            }}
                        >
                            Next →
                        </button>
                    </div>

                    {/* Toggle */}
                    <div className="flex items-center justify-between pt-2 border-t border-white/5">
                        <span className="text-xs opacity-60">Transliteration</span>

                        <button
                            onClick={() => setShowTrans(v => !v)}
                            className="px-3 py-1 text-xs rounded-full transition"
                            style={{
                                background: showTrans
                                    ? 'rgba(212,175,55,0.2)'
                                    : 'rgba(255,255,255,0.06)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                color: showTrans
                                    ? 'rgba(212,175,55,0.9)'
                                    : 'rgba(255,255,255,0.5)',
                            }}
                        >
                            {showTrans ? 'On' : 'Off'}
                        </button>
                    </div>
                </div>
            </div>

            {/* Two Column Layout */}
            <div className="max-w-[min(1200px,95vw)] mx-auto px-4 py-8 grid grid-cols-3 gap-6 items-start">
                {/* Left Column */}
                <div className="col-span-1 sticky top-24 flex flex-col gap-4">
                    <div
                        className="rounded-2xl overflow-hidden"
                        style={{
                            background: 'rgba(255,255,255,0.07)',
                            border: '1px solid rgba(212,175,55,0.2)',
                            boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
                        }}
                    >
                        <div
                            className="px-4 py-3 flex items-center gap-2"
                            style={{ borderBottom: '1px solid rgba(212,175,55,0.12)' }}
                        >
                            <div
                                className="w-1.5 h-1.5 rounded-full"
                                style={{ background: 'rgba(212,175,55,0.8)' }}
                            />
                            <p
                                className="text-xs uppercase tracking-widest font-semibold"
                                style={{ fontFamily: 'system-ui,sans-serif', color: 'rgba(212,175,55,0.8)' }}
                            >
                                Search Gurbani
                            </p>
                        </div>
                        <div className="p-3">
                            <SearchBar hideDropdown hideHint />
                        </div>
                    </div>
                </div>

                {/* Right Column */}
                <div className="col-span-2">
                    <div
                        className="w-full rounded-3xl overflow-hidden"
                        style={{
                            background: 'rgba(255,255,255,0.05)',
                            border: '1px solid rgba(212,175,55,0.15)',
                            backdropFilter: 'blur(24px) saturate(160%)',
                            WebkitBackdropFilter: 'blur(24px) saturate(160%)',
                            boxShadow: '0 32px 80px rgba(0,0,0,0.55), inset 0 1px 0 rgba(212,175,55,0.08)',
                        }}
                    >
                        {/* Card Header */}
                        <div
                            className="px-8 py-4 flex items-center justify-between"
                            style={{ background: 'rgba(212,175,55,0.05)', borderBottom: '1px solid rgba(212,175,55,0.12)' }}
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-2 h-2 rounded-full" style={{ background: 'rgba(212,175,55,0.7)' }} />
                                <span className="text-base font-semibold" style={{ fontFamily: 'system-ui,sans-serif', color: 'rgba(212,175,55,0.9)' }}>
                                    Page {angNum}
                                </span>
                            </div>
                            <span className="text-xs" style={{ fontFamily: 'system-ui,sans-serif', color: 'rgba(255,255,255,0.2)' }}>
                                {angNum} / {MAX_ANG}
                            </span>
                        </div>

                        {/* Card Body */}
                        <div className="px-8 py-7">
                            {loading && (
                                <div className="flex justify-center py-16">
                                    <div className="w-8 h-8 rounded-full border-2 animate-spin"
                                        style={{ borderColor: 'rgba(212,175,55,0.15)', borderTopColor: 'rgba(212,175,55,0.7)' }} />
                                </div>
                            )}

                            {!loading && error && (
                                <div className="text-center py-12 space-y-3">
                                    <p className="text-sm" style={{ fontFamily: 'system-ui,sans-serif', color: 'rgba(255,255,255,0.45)' }}>
                                        {error}
                                    </p>
                                    <button
                                        onClick={() => goToAng(angNum)}
                                        className="px-4 py-2 rounded-xl text-sm transition-colors"
                                        style={{ fontFamily: 'system-ui,sans-serif', border: '1px solid rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.6)', background: 'transparent', cursor: 'pointer' }}
                                    >
                                        Retry
                                    </button>
                                </div>
                            )}

                            {!loading && !error && lines.length > 0 && (
                                <>
                                    <p className="text-xs mb-6 text-right" style={{ fontFamily: 'system-ui,sans-serif', color: 'rgba(255,255,255,0.2)' }}>
                                        Tap any line for transliteration
                                    </p>
                                    <div style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
                                        {lines.map((line, i) => (
                                            <VerseBlock key={line.id ?? i} line={line} showTrans={showTrans} onWordClick={() => handleWordClick(line)} />
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Card Footer */}
                        {!loading && lines.length > 0 && (
                            <div
                                className="px-8 py-4 flex justify-between"
                                style={{ background: 'rgba(212,175,55,0.03)', borderTop: '1px solid rgba(212,175,55,0.1)' }}
                            >
                                <button
                                    disabled={atStart}
                                    onClick={() => goToAng(angNum - 1)}
                                    className="px-5 py-2 rounded-xl text-sm transition-all active:scale-95"
                                    style={{
                                        fontFamily: 'system-ui,sans-serif',
                                        background: 'rgba(212,175,55,0.08)',
                                        border: '1px solid rgba(212,175,55,0.2)',
                                        color: atStart ? 'rgba(255,255,255,0.15)' : 'rgba(212,175,55,0.85)',
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
                                        background: 'rgba(212,175,55,0.08)',
                                        border: '1px solid rgba(212,175,55,0.2)',
                                        color: atEnd ? 'rgba(255,255,255,0.15)' : 'rgba(212,175,55,0.85)',
                                        cursor: atEnd ? 'not-allowed' : 'pointer',
                                    }}
                                >
                                    Next Page →
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* MeaningBox */}
            {meaningData && <MeaningBox data={meaningData} onClose={() => setMeaningData(null)} />}
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