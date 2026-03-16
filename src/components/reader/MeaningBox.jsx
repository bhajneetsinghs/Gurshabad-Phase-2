// src/components/reader/MeaningBox.jsx
// React port of meaning-box.js
// Shows translation / transliteration / word meanings for a clicked Gurmukhi line.
// Opened by passing `data` prop; closed by calling onClose.

import { useEffect } from 'react';

const GURBANI_FONT = "'Noto Sans Gurmukhi','Gurmukhi MN','Kohinoor Gurmukhi',sans-serif";
const UI_FONT = 'system-ui,-apple-system,sans-serif';

export default function MeaningBox({ data, onClose }) {
    // Close on Escape
    useEffect(() => {
        const h = (e) => { if (e.key === 'Escape') onClose(); };
        window.addEventListener('keydown', h);
        return () => window.removeEventListener('keydown', h);
    }, [onClose]);

    // Lock body scroll while open
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = ''; };
    }, []);

    if (!data) return null;

    const hasTranslation = !!data.translation;
    const hasTranslit = !!data.transliteration;
    const hasEtymology = !!data.etymology;

    return (
        /* Overlay — click outside to close */
        <div
            className="fixed inset-0 z-[999] flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(6px)' }}
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
            {/* Box */}
            <div
                className="relative w-full max-w-[560px] rounded-3xl overflow-hidden
                   border border-white/18
                   shadow-[0_40px_100px_rgba(0,0,0,0.8)]"
                style={{
                    background: 'rgba(10,13,24,0.95)',
                    backdropFilter: 'blur(24px) saturate(160%)',
                    WebkitBackdropFilter: 'blur(24px) saturate(160%)',
                }}
            >
                {/* Header — clicked word/line */}
                <div
                    className="px-7 pt-6 pb-4 border-b border-white/10
                     flex items-start justify-between gap-4"
                >
                    <h3
                        className="text-white font-bold leading-relaxed flex-1"
                        style={{
                            fontFamily: GURBANI_FONT,
                            fontSize: 'clamp(1.05rem, 2.5vw, 1.35rem)',
                            lineHeight: 1.75,
                        }}
                    >
                        {data.gurmukhiText}
                    </h3>

                    {/* Close button */}
                    <button
                        onClick={onClose}
                        aria-label="Close"
                        className="flex-none mt-0.5 w-8 h-8 rounded-xl flex items-center justify-center
                       text-white/50 hover:text-white hover:bg-white/10
                       transition-all duration-150 cursor-pointer"
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                            <path d="M18 6L6 18M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Content sections */}
                <div className="px-7 py-5 space-y-5 max-h-[65vh] overflow-y-auto">

                    {/* Translation */}
                    {hasTranslation && (
                        <Section title="Translation">
                            <p
                                className="text-white/75 text-sm leading-relaxed"
                                style={{ fontFamily: UI_FONT }}
                            >
                                {data.translation}
                            </p>
                        </Section>
                    )}

                    {/* Transliteration */}
                    {hasTranslit && (
                        <Section title="Transliteration">
                            <p
                                className="text-white/65 text-sm leading-relaxed italic"
                                style={{ fontFamily: UI_FONT }}
                            >
                                {data.transliteration}
                            </p>
                        </Section>
                    )}

                    {/* Etymology / Word meanings */}
                    {hasEtymology && (
                        <Section title="Word Meanings">
                            <p
                                className="text-white/60 text-sm leading-relaxed"
                                style={{ fontFamily: GURBANI_FONT }}
                            >
                                {data.etymology}
                            </p>
                        </Section>
                    )}

                    {/* Nothing to show */}
                    {!hasTranslation && !hasTranslit && !hasEtymology && (
                        <p
                            className="text-white/35 text-sm text-center py-4"
                            style={{ fontFamily: UI_FONT }}
                        >
                            No additional information available.
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}

function Section({ title, children }) {
    return (
        <div>
            <h4
                className="text-white/40 text-xs uppercase tracking-widest mb-2"
                style={{ fontFamily: 'system-ui,sans-serif', letterSpacing: '0.14em' }}
            >
                {title}
            </h4>
            {children}
        </div>
    );
}