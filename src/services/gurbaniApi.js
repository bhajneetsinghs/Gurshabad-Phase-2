
const PRIMARY = '/api/banidb';
const FALLBACK = 'https://api.banidb.com/v2';
const CACHE = new Map();

async function fetchJSON(url, timeoutMs = 14000) {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), timeoutMs);
    try {
        const res = await fetch(url, {
            signal: ctrl.signal,
            headers: { Accept: 'application/json', 'User-Agent': 'Gurshabad/1.0' },
        });
        if (!res.ok) {
            const body = await res.text().catch(() => '');
            throw Object.assign(new Error(`HTTP ${res.status}: ${body}`), { status: res.status });
        }
        return await res.json();
    } finally {
        clearTimeout(timer);
    }
}

async function getWithFallback(path) {
    // Don't cache search results
    const shouldCache = !path.startsWith('/search/');
    if (shouldCache && CACHE.has(path)) return CACHE.get(path);

    let lastErr = null;
    for (const base of [PRIMARY, FALLBACK]) {
        try {
            const data = await fetchJSON(`${base}${path}`);
            if (shouldCache) CACHE.set(path, data);
            return data;
        } catch (err) {
            lastErr = err;
            console.warn(`[gurbaniApi] ${base}${path} →`, err.message);
        }
    }
    throw lastErr ?? new Error(`Failed to fetch ${path}`);
}

// ─── Ang ─────────────────────────────────────────────────────────────────────
export async function getAng(n) {
    // Swagger: /angs/{pageNo} — default source is G (Guru Granth Sahib Ji)
    return getWithFallback(`/angs/${encodeURIComponent(n)}`);
}

export function parseAngData(data) {
    if (!data) return [];
    if (Array.isArray(data.page) && data.page.length > 0) {
        return data.page
            .map((item) => ({
                id: item.verseId ?? null,
                shabadId: item.shabadId ?? null,
                gurmukhi: item.verse?.unicode ?? item.verse?.gurmukhi ?? '',
                translit: item.transliteration?.en ?? item.transliteration?.english ?? '',
                translation: item.translation?.en?.bdb
                    ?? item.translation?.en?.ssk
                    ?? item.translation?.en?.ms
                    ?? (typeof item.translation?.en === 'string' ? item.translation.en : '')
                    ?? '',
                raag: item.raag?.unicode ?? item.raag?.english ?? '',
                writer: item.writer?.english ?? item.writer?.unicode ?? '',
            }))
            .filter((l) => l.gurmukhi);
    }
    return [];
}

// ─── Search ───────────────────────────────────────────────────────────────────

function extractVerses(data) {
    if (Array.isArray(data?.verses) && data.verses.length > 0) return data.verses;
    if (Array.isArray(data?.results) && data.results.length > 0) return data.results;
    if (Array.isArray(data?.lines) && data.lines.length > 0) return data.lines;
    if (Array.isArray(data)) return data;
    return [];
}

/**
 * @param {string} type  - '1' first letter, '2' full word Gurmukhi, '4' romanized
 * @param {string} q     - search query (Gurmukhi for type 1/2, Roman for type 4)
 */
// export async function searchRaw(type, q) {
//     if (!q) return { verses: [], total: 0 };

//     // ✅ Correct format from swagger: /search/{query}?searchtype={n}
//     const path = `/search/${encodeURIComponent(q)}?searchtype=${encodeURIComponent(type)}`;

//     try {
//         const data = await getWithFallback(path);
//         const verses = extractVerses(data);
//         const total = data?.resultsInfo?.totalResults ?? verses.length;
//         return { verses, total, raw: data };
//     } catch (err) {
//         console.error('[searchRaw]', err.message);
//         return { verses: [], total: 0 };
//     }
// }

export async function searchRaw(type, q) {
    if (!q) return { verses: [], total: 0 };

    const path = `/search/${encodeURIComponent(q)}?searchtype=${encodeURIComponent(type)}`;

    try {
        const data = await getWithFallback(path);
        const verses = extractVerses(data);
        const total = data?.resultsInfo?.totalResults ?? verses.length;

        // ← ADD THIS temporarily to debug
        console.log('[searchRaw] query:', q, 'type:', type, 'total:', total, 'raw:', data);

        return { verses, total, raw: data };
    } catch (err) {
        console.error('[searchRaw] FAILED:', err.message); // ← make sure this is visible
        return { verses: [], total: 0 };
    }
}

// ─── Parse a single verse from search results ─────────────────────────────────
export function parseVerseItem(v) {
    const gurmukhi =
        v?.verse?.unicode ?? v?.verse?.gurmukhi ??
        v?.unicode ?? v?.gurmukhi ?? '';

    const ang = (() => {
        const raw = v?.pageNo ?? v?.page ?? v?.ang
            ?? v?.verse?.pageNo ?? v?.line?.sourcePage ?? null;
        const n = parseInt(raw, 10);
        return Number.isFinite(n) ? n : null;
    })();

    const lineNo = v?.lineNo ?? v?.line ?? v?.verse?.lineNo ?? null;

    const translit =
        v?.transliteration?.en ??
        v?.transliteration?.english ??
        '';

    const translation =
        v?.translation?.en?.bdb ??
        v?.translation?.en?.ssk ??
        '';

    const raag = v?.raag?.unicode ?? v?.raag?.english ?? '';
    const writer = v?.writer?.english ?? v?.writer?.unicode ?? '';

    return { gurmukhi, ang, lineNo, translit, translation, raag, writer };
}