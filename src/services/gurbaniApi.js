// const PRIMARY = '/api/banidb';
// const FALLBACK = 'https://api.banidb.com/v2';
// const CACHE = new Map();

// async function fetchJSON(url, timeoutMs = 14000) {
//     const ctrl = new AbortController();
//     const timer = setTimeout(() => ctrl.abort(), timeoutMs);
//     try {
//         const res = await fetch(url, {
//             signal: ctrl.signal,
//             headers: { Accept: 'application/json', 'User-Agent': 'Gurshabad/1.0' },
//         });
//         if (!res.ok) {
//             const body = await res.text().catch(() => '');
//             throw Object.assign(new Error(`HTTP ${res.status}: ${body}`), { status: res.status });
//         }
//         return await res.json();
//     } finally {
//         clearTimeout(timer);
//     }
// }

// async function getWithFallback(path) {
//     if (CACHE.has(path)) return CACHE.get(path);
//     let lastErr = null;
//     for (const base of [PRIMARY, FALLBACK]) {
//         try {
//             const data = await fetchJSON(`${base}${path}`);
//             CACHE.set(path, data);
//             return data;
//         } catch (err) {
//             lastErr = err;
//             console.warn(`[gurbaniApi] ${base}${path} →`, err.message);
//         }
//     }
//     throw lastErr ?? new Error(`Failed to fetch ${path}`);
// }

// // Public: fetch raw ang data
// export async function getAng(n) {
//     return getWithFallback(`/angs/${encodeURIComponent(n)}`);
// }

// // Public: parse raw response into flat line array
// export function parseAngData(data) {
//     if (!data) return [];

//     // PRIMARY shape: data.page[] (confirmed from live API)
//     if (Array.isArray(data.page) && data.page.length > 0) {
//         return data.page.map((item) => ({
//             id: item.verseId ?? null,
//             shabadId: item.shabadId ?? null,
//             // verse.unicode is the correct Gurmukhi Unicode field
//             gurmukhi: item.verse?.unicode ?? item.verse?.gurmukhi ?? '',
//             // transliteration.en is a plain string
//             translit: item.transliteration?.en
//                 ?? item.transliteration?.english
//                 ?? '',
//             // translation.en.bdb is the main English translation
//             translation: item.translation?.en?.bdb
//                 ?? item.translation?.en?.ssk
//                 ?? item.translation?.en?.ms
//                 ?? (typeof item.translation?.en === 'string' ? item.translation.en : '')
//                 ?? '',
//             // raag name — use unicode field
//             raag: item.raag?.unicode ?? item.raag?.english ?? '',
//             // writer — unicode is null in API, use english
//             writer: item.writer?.unicode ?? item.writer?.english ?? '',
//         })).filter((line) => line.gurmukhi);  // drop any lines with no text
//     }

//     // FALLBACK shape: data.shabads[].verses[] (older API versions)
//     if (Array.isArray(data.shabads)) {
//         return data.shabads.flatMap((shabad) => {
//             const raag = shabad.shabadInfo?.raag?.nameGurmukhi ?? '';
//             const writer = shabad.shabadInfo?.writer?.nameGurmukhi ?? '';
//             const sid = shabad.shabadInfo?.shabadId ?? null;
//             return (shabad.verses ?? []).map((v) => ({
//                 id: v.id ?? null,
//                 shabadId: sid,
//                 gurmukhi: v.verse?.unicode ?? v.verse?.gurmukhi ?? '',
//                 translit: v.transliteration?.en ?? '',
//                 translation: v.translation?.en?.bdb ?? '',
//                 raag,
//                 writer,
//             }));
//         }).filter((l) => l.gurmukhi);
//     }

//     // LAST RESORT: raw array
//     const lines = Array.isArray(data) ? data
//         : Array.isArray(data.lines) ? data.lines
//             : [];
//     return lines.map((line) => ({
//         id: line.id ?? null,
//         shabadId: line.shabadId ?? null,
//         gurmukhi: line.verse?.unicode ?? line.unicode ?? line.gurmukhi ?? '',
//         translit: line.transliteration?.en ?? line.transliteration ?? '',
//         translation: line.translation?.en?.bdb ?? '',
//         raag: line.raag?.unicode ?? '',
//         writer: line.writer?.english ?? '',
//     })).filter((l) => l.gurmukhi);
// }

// // Search helpers
// export async function searchFirstLetter(q) {
//     if (!q) return [];
//     const data = await getWithFallback(`/search/first-letter?q=${encodeURIComponent(q)}`);
//     return Array.isArray(data?.results) ? data.results : (data ?? []);
// }

// export async function searchFullWord(q) {
//     if (!q) return [];
//     const data = await getWithFallback(`/search/full-word?q=${encodeURIComponent(q)}`);
//     return Array.isArray(data?.results) ? data.results : (data ?? []);
// }


// src/services/gurbaniApi.js
//
// BaniDB v2 confirmed response shapes:
//
// GET /angs/:n
//   { source, count, navigation, page: [ { verseId, shabadId, verse: { unicode }, transliteration: { en }, translation: { en: { bdb } }, raag, writer } ] }
//
// GET /search/first-letter?q=  OR  /search/full-word?q=
//   { resultsInfo: { totalResults, ... }, verses: [ { verseId, shabadId, verse: { unicode }, transliteration: { en }, translation: { en: { bdb } }, pageNo, lineNo, raag, writer } ] }

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
    if (CACHE.has(path)) return CACHE.get(path);
    let lastErr = null;
    for (const base of [PRIMARY, FALLBACK]) {
        try {
            const data = await fetchJSON(`${base}${path}`);
            CACHE.set(path, data);
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
    return getWithFallback(`/angs/${encodeURIComponent(n)}`);
}

// Parse /angs/:n  →  flat line array
export function parseAngData(data) {
    if (!data) return [];

    // PRIMARY: data.page[]
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
                writer: item.writer?.unicode ?? item.writer?.english ?? '',
            }))
            .filter((l) => l.gurmukhi);
    }

    return [];
}

// ─── Search ───────────────────────────────────────────────────────────────────
// BaniDB search response: { resultsInfo: {...}, verses: [...] }
// Each verse: { verseId, shabadId, verse: { unicode }, transliteration: { en },
//              translation: { en: { bdb } }, pageNo, lineNo, raag, writer }

function parseSearchResponse(data) {
    // ✅ Confirmed shape: data.verses[]
    if (Array.isArray(data?.verses) && data.verses.length > 0) {
        return data.verses;
    }
    // Fallbacks for any other shape
    if (Array.isArray(data?.results)) return data.results;
    if (Array.isArray(data?.lines)) return data.lines;
    if (Array.isArray(data)) return data;
    return [];
}

export async function searchFirstLetter(q) {
    if (!q) return [];
    const data = await getWithFallback(`/search/first-letter?q=${encodeURIComponent(q)}`);
    return parseSearchResponse(data);
}

export async function searchFullWord(q) {
    if (!q) return [];
    const data = await getWithFallback(`/search/full-word?q=${encodeURIComponent(q)}`);
    return parseSearchResponse(data);
}

// Shared helper — used by SearchBar + SearchResults to extract fields from a verse object
export function parseVerseItem(v) {
    const gurmukhi =
        v?.verse?.unicode ??
        v?.verse?.gurmukhi ??
        v?.unicode ??
        v?.gurmukhi ?? '';

    const ang = (() => {
        const raw = v?.pageNo ?? v?.page ?? v?.ang ?? v?.verse?.pageNo ?? null;
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