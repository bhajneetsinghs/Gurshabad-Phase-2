import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { parseVerseItem, searchRaw } from '../../services/gurbaniApi';

const GURBANI_FONT = "'Noto Sans Gurmukhi','Gurmukhi MN','Kohinoor Gurmukhi',sans-serif";
const UI_FONT = 'system-ui,-apple-system,sans-serif';

const isGurmukhiType = (t) => t === '1' || t === '2';

const DIG = ['੦','੧','੨','੩','੪','੫','੬','੭','੮','੯'];
const MAP = {
  a:'ਅ',b:'ਬ',c:'ਚ',d:'ਦ',e:'ਇ',f:'ਫ',g:'ਗ',h:'ਹ',i:'ਇ',j:'ਜ',
  k:'ਕ',l:'ਲ',m:'ਮ',n:'ਨ',o:'ਉ',p:'ਪ',q:'ਕ',r:'ਰ',s:'ਸ',t:'ਤ',
  u:'ਉ',v:'ਵ',w:'ਵ',x:'ਕਸ',y:'ਯ',z:'ਜ਼',
  A:'ਆ',B:'ਭ',C:'ਛ',D:'ਡ',E:'ਏ',F:'ਫ਼',G:'ਘ',H:'ਃ',I:'ਈ',J:'ਝ',
  K:'ਖ',L:'ਲ਼',M:'ੰ',N:'ਣ',O:'ਓ',P:'ਫ਼',Q:'ਕ਼',R:'ੜ',S:'ਸ਼',T:'ਟ',
  U:'ਊ',V:'ਵ',W:'ਵ',X:'ਖ਼',Y:'ਯ',Z:'ਗ਼',
};

function romanToGurmukhi(s) {
  return s.replace(/[0-9A-Za-z]/g, ch =>
    /[0-9]/.test(ch) ? DIG[+ch] : (MAP[ch] || ch)
  );
}

export default function SearchBar({
    initialQuery = '',
    initialType  = '1',
    hideDropdown = false,
    compact      = false,
    hideHint     = false,
}) {
    const navigate = useNavigate();

    const [query,        setQuery]        = useState(initialQuery);
    const [searchType,   setSearchType]   = useState(initialType);
    const [liveResults,  setLiveResults]  = useState([]);
    const [liveLoading,  setLiveLoading]  = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);

    const wrapRef  = useRef(null);
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
        '1': 'ਪਹਿਲੇ ਅੱਖਰ…',
        '2': 'ਗੁਰਬਾਣੀ ਖੋਜ…',
        '5': 'ਅੰਗ ਨੰਬਰ…',
    }[searchType] ?? 'Search…';

    const useGurmukhiInput = isGurmukhiType(searchType);

    return (
        <div ref={wrapRef} className="relative w-full">
            <form
                onSubmit={handleSubmit}
                className={`flex flex-row flex-nowrap items-center gap-2
                   border border-white/18 bg-white/[0.06] backdrop-blur-lg
                   ${compact ? 'px-2 py-1 rounded-xl' : 'px-4 py-3 rounded-2xl'}`}
            >
                <select
                    value={searchType}
                    onChange={handleTypeChange}
                    aria-label="Search type"
                    className={`flex-none appearance-none border border-white/25 rounded-lg
                     bg-white/10 text-white focus:outline-none focus:bg-[rgb(0,23,49)]
                     hover:bg-white/15 cursor-pointer transition-colors
                     ${compact ? 'px-1.5 py-0.5 text-xs pr-5' : 'px-3 py-2 pr-8 text-sm'}`}
                    style={{
                        fontFamily: UI_FONT,
                        backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='rgba(255,255,255,.55)'/%3E%3C/svg%3E\")",
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'right 6px center',
                    }}
                >
                    <option value="1">First Letter(Anywhere)</option>
                    <option value="2">Full Word(Gurmukhi)</option>
                    <option value="5">Page No.</option>
                </select>

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
                    className={`flex-1 min-w-0 border border-white/25 rounded-lg
                     bg-white/10 text-white placeholder-white/40
                     focus:outline-none focus:bg-white/14 focus:border-white/45
                     focus:ring-[3px] focus:ring-white/8 transition-all duration-150
                     [&::-webkit-search-cancel-button]:appearance-none
                     [&::-webkit-search-decoration]:hidden
                     ${compact ? 'px-2 py-0.5 text-xs' : 'px-3 py-2 text-base'}`}
                    style={{
                        fontFamily: useGurmukhiInput ? GURBANI_FONT : UI_FONT,
                        letterSpacing: useGurmukhiInput ? '0.15px' : 'normal',
                        fontSize: compact ? '0.75rem' : useGurmukhiInput ? '1.05rem' : '1rem',
                    }}
                />

                <button
                    type="submit"
                    className={`flex-none rounded-lg font-medium border border-white/25
                     bg-white/15 text-white hover:bg-white/24 hover:border-white/45
                     active:scale-95 transition-all cursor-pointer
                     ${compact ? 'px-2 py-0.5 text-xs' : 'px-5 py-2 text-sm'}`}
                    style={{ fontFamily: UI_FONT }}
                >
                    Search
                </button>
            </form>

            {/* ← hint text now uses hideHint prop */}
            {!hideHint && !compact && searchType === '1' && (
                <p className="mt-1.5 text-white/25 text-xs text-center"
                    style={{ fontFamily: GURBANI_FONT }}>
                    ਹਰ ਸ਼ਬਦ ਦਾ ਪਹਿਲਾ ਅੱਖਰ ਟਾਈਪ ਕਰੋ — ਅੰਗਰੇਜ਼ੀ ਵਿੱਚ ਟਾਈਪ ਕਰੋ, ਗੁਰਮੁਖੀ ਵਿੱਚ ਬਦਲੇਗਾ
                </p>
            )}
            {!hideHint && !compact && searchType === '2' && (
                <p className="mt-1.5 text-white/25 text-xs text-center"
                    style={{ fontFamily: GURBANI_FONT }}>
                    ਅੰਗਰੇਜ਼ੀ ਵਿੱਚ ਟਾਈਪ ਕਰੋ — ਗੁਰਮੁਖੀ ਵਿੱਚ ਬਦਲੇਗਾ
                </p>
            )}

            {!hideDropdown && showDropdown && query.trim().length > 0 && searchType !== '5' && (
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
                            style={{ fontFamily: GURBANI_FONT }}>
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
                                            style={{ fontFamily: GURBANI_FONT }}>
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