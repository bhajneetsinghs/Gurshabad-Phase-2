import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { parseVerseItem, searchRaw } from '../../services/gurbaniApi';

const GURBANI_FONT = "'Noto Sans Gurmukhi','Gurmukhi MN','Kohinoor Gurmukhi',sans-serif";
const UI_FONT = 'system-ui,-apple-system,sans-serif';

const isGurmukhiType = (t) => t === '1' || t === '2';

const DIG = ['੦', '੧', '੨', '੩', '੪', '੫', '੬', '੭', '੮', '੯'];
const MAP = {
    a: 'ਅ', b: 'ਬ', c: 'ਚ', d: 'ਦ', e: 'ਇ', f: 'ਫ', g: 'ਗ', h: 'ਹ', i: 'ਇ', j: 'ਜ',
    k: 'ਕ', l: 'ਲ', m: 'ਮ', n: 'ਨ', o: 'ਉ', p: 'ਪ', q: 'ਕ', r: 'ਰ', s: 'ਸ', t: 'ਤ',
    u: 'ਉ', v: 'ਵ', w: 'ਵ', x: 'ਕਸ', y: 'ਯ', z: 'ਜ਼',
    A: 'ਆ', B: 'ਭ', C: 'ਛ', D: 'ਡ', E: 'ਏ', F: 'ਫ਼', G: 'ਘ', H: 'ਃ', I: 'ਈ', J: 'ਝ',
    K: 'ਖ', L: 'ਲ਼', M: 'ੰ', N: 'ਣ', O: 'ਓ', P: 'ਫ਼', Q: 'ਕ਼', R: 'ੜ', S: 'ਸ਼', T: 'ਟ',
    U: 'ਊ', V: 'ਵ', W: 'ਵ', X: 'ਖ਼', Y: 'ਯ', Z: 'ਗ਼',
};

function romanToGurmukhi(s) {
    return s.replace(/[0-9A-Za-z]/g, ch =>
        /[0-9]/.test(ch) ? DIG[+ch] : (MAP[ch] || ch)
    );
}

export default function SearchBar({
    initialQuery = '',
    initialType = '2',
    hideDropdown = false,
    compact = false,
    hideHint = false,
}) {
    const navigate = useNavigate();

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

    useEffect(() => {
        setQuery(initialQuery);
        setSearchType(initialType);
    }, [initialQuery, initialType]);

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

    function handleInputChange(e) {
        const val = e.target.value;
        if (isGurmukhiType(searchType)) {
            setQuery(romanToGurmukhi(val));
        } else {
            setQuery(val);
        }
    }

    function handleTypeChange(e) {
        setSearchType(e.target.value);
        setQuery('');
        setLiveResults([]);
        setShowDropdown(false);
        inputRef.current?.focus();
    }

    const runLive = useCallback(async (q, type) => {
        if (!q || q.length < 1 || type === '5' || hideDropdown) {
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
    }, [hideDropdown]);

    useEffect(() => {
        clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => runLive(query.trim(), searchType), 180);
        return () => clearTimeout(timerRef.current);
    }, [query, searchType, runLive]);

    useEffect(() => {
        const h = (e) => {
            if (wrapRef.current && !wrapRef.current.contains(e.target))
                setShowDropdown(false);
        };
        document.addEventListener('mousedown', h);
        return () => document.removeEventListener('mousedown', h);
    }, []);

    const placeholder = {
        '1': 'ਪਹਿਲੇ ਅੱਖਰ ਟਾਈਪ ਕਰੋ…',
        '2': 'ਗੁਰਬਾਣੀ ਖੋਜ ਕਰੋ…',
        '5': 'ਅੰਗ ਨੰਬਰ…',
    }[searchType] ?? 'Search…';

    const useGurmukhiInput = isGurmukhiType(searchType);

    return (
        <div ref={wrapRef} className="relative w-full">
            <form
                onSubmit={handleSubmit}
                className="flex flex-row flex-nowrap items-center gap-2 w-full"
                style={{
                    background: 'rgba(255,255,255,0.07)',
                    border: '1px solid rgba(255,255,255,0.11)',
                    borderRadius: 14,
                    padding: compact ? '4px 6px' : '8px 10px',
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    boxShadow: '0 4px 24px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.07)',
                }}
            >
                {/* Select */}
                <select
                    value={searchType}
                    onChange={handleTypeChange}
                    aria-label="Search type"
                    className="flex-none appearance-none focus:outline-none cursor-pointer"
                    style={{
                        fontFamily: UI_FONT,
                        background: 'rgba(255,255,255,0.08)',
                        border: '1px solid rgba(255,255,255,0.12)',
                        borderRadius: 8,
                        color: 'rgba(255,255,255,0.75)',
                        padding: compact ? '3px 20px 3px 6px' : '5px 24px 5px 8px',
                        fontSize: '0.78rem',
                        backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='rgba(255,255,255,0.4)'/%3E%3C/svg%3E\")",
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'right 6px center',
                        maxWidth: 110,
                    }}
                >
                    <option value="1" style={{ background: '#1a1f35', color: '#fff' }}>First Letter (Anywhere)</option>
                    <option value="2" style={{ background: '#1a1f35', color: '#fff' }}>Full Word (Gurmukhi)</option>
                    <option value="5" style={{ background: '#1a1f35', color: '#fff' }}>Page No.</option>
                </select>

                {/* Input */}
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
                    lang={useGurmukhiInput ? 'pa' : 'en'}
                    placeholder={placeholder}
                    className="flex-1 min-w-0 focus:outline-none
                               [&::-webkit-search-cancel-button]:appearance-none
                               [&::-webkit-search-decoration]:hidden"
                    style={{
                        fontFamily: useGurmukhiInput ? GURBANI_FONT : UI_FONT,
                        fontSize: compact ? '0.75rem' : '0.92rem',
                        letterSpacing: useGurmukhiInput ? '0.15px' : 'normal',
                        background: 'transparent',
                        border: 'none',
                        color: 'rgba(255,255,255,0.88)',
                        caretColor: 'rgba(255,255,255,0.6)',
                        padding: '4px 6px',
                    }}
                />

                {/* Button */}
                <button
                    type="submit"
                    className="flex-none active:scale-95 transition-all cursor-pointer"
                    style={{
                        fontFamily: UI_FONT,
                        background: 'rgba(255,255,255,0.13)',
                        border: '1px solid rgba(255,255,255,0.18)',
                        borderRadius: 8,
                        color: 'rgba(255,255,255,0.9)',
                        padding: compact ? '3px 10px' : '5px 14px',
                        fontSize: '0.82rem',
                        fontWeight: 500,
                        backdropFilter: 'blur(8px)',
                    }}
                >
                    Go
                </button>
            </form>

            {/* Hint text */}
            {!hideHint && !compact && searchType === '1' && (
                <p className="mt-2 text-xs text-center"
                    style={{
                        fontFamily: GURBANI_FONT,
                        color: 'rgba(255,255,255,0.28)',
                    }}>
                    ਹਰ ਸ਼ਬਦ ਦਾ ਪਹਿਲਾ ਅੱਖਰ ਟਾਈਪ ਕਰੋ — ਅੰਗਰੇਜ਼ੀ ਵਿੱਚ ਟਾਈਪ ਕਰੋ
                </p>
            )}
            {!hideHint && !compact && searchType === '2' && (
                <p className="mt-2 text-xs text-center"
                    style={{
                        fontFamily: GURBANI_FONT,
                        color: 'rgba(255,255,255,0.28)',
                    }}>
                    ਅੰਗਰੇਜ਼ੀ ਵਿੱਚ ਟਾਈਪ ਕਰੋ — ਗੁਰਮੁਖੀ ਵਿੱਚ ਬਦਲੇਗਾ
                </p>
            )}

            {/* Live dropdown */}
            {!hideDropdown && showDropdown && query.trim().length > 0 && searchType !== '5' && (
                <div
                    className="absolute left-0 right-0 top-full mt-2 z-50
                               rounded-2xl overflow-hidden
                               shadow-[0_20px_60px_rgba(0,0,0,0.55)]"
                    style={{
                        background: 'rgba(15,20,40,0.92)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        backdropFilter: 'blur(24px)',
                        WebkitBackdropFilter: 'blur(24px)',
                    }}
                >
                    {liveLoading && (
                        <div className="flex items-center justify-center gap-2 px-5 py-5">
                            <div className="w-4 h-4 rounded-full border-2 animate-spin"
                                style={{
                                    borderColor: 'rgba(255,255,255,0.1)',
                                    borderTopColor: 'rgba(255,255,255,0.5)',
                                }}
                            />
                            <span className="text-sm" style={{
                                fontFamily: UI_FONT,
                                color: 'rgba(255,255,255,0.35)',
                            }}>
                                Searching…
                            </span>
                        </div>
                    )}
                    {!liveLoading && liveResults.length === 0 && (
                        <p className="px-5 py-5 text-sm text-center"
                            style={{
                                fontFamily: GURBANI_FONT,
                                color: 'rgba(255,255,255,0.35)',
                            }}>
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
                                onClick={() => {
                                    setShowDropdown(false);
                                    if (ang) navigate(`/reader/${ang}`);
                                }}
                                className="w-full text-left px-5 py-3.5 transition-colors duration-100"
                                style={{
                                    borderBottom: '1px solid rgba(255,255,255,0.05)',
                                    background: 'transparent',
                                }}
                                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                            >
                                <p className="text-sm leading-relaxed truncate mb-0.5"
                                    style={{
                                        fontFamily: GURBANI_FONT,
                                        color: 'rgba(255,255,255,0.88)',
                                    }}>
                                    {gurmukhi}
                                </p>
                                <div className="flex items-center justify-between gap-3">
                                    {translit && (
                                        <p className="text-xs truncate italic"
                                            style={{
                                                fontFamily: UI_FONT,
                                                color: 'rgba(255,255,255,0.32)',
                                            }}>
                                            {translit}
                                        </p>
                                    )}
                                    {ang && (
                                        <span className="flex-none text-xs"
                                            style={{
                                                fontFamily: GURBANI_FONT,
                                                color: 'rgba(255,255,255,0.4)',
                                            }}>
                                            ਪੰਨਾ {ang}
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