// phoneticToGurmukhi.js
// Converts phonetic Roman/English input to Gurmukhi Unicode for Gurbani search.
// Convention: 'a' after a consonant = long ā (ਾ), matching common English-speaker intuition.

// Consonants ordered longest-first so digraphs match before singles
const CONS_MAP = [
    // 3-char
    ['chh', 'ਛ'],
    ['ddh', 'ਢ'],
    ['tth', 'ਠ'],
    // 2-char
    ['kh', 'ਖ'],
    ['gh', 'ਘ'],
    ['ng', 'ਙ'],
    ['ch', 'ਚ'],
    ['jh', 'ਝ'],
    ['tt', 'ਟ'],
    ['dd', 'ਡ'],
    ['nn', 'ਣ'],
    ['th', 'ਥ'],
    ['dh', 'ਧ'],
    ['ph', 'ਫ'],
    ['bh', 'ਭ'],
    ['sh', 'ਸ਼'],
    ['rr', 'ੜ'],
    ['lh', 'ਲ਼'],
    // 1-char
    ['k', 'ਕ'],
    ['g', 'ਗ'],
    ['c', 'ਚ'],
    ['j', 'ਜ'],
    ['t', 'ਤ'],
    ['d', 'ਦ'],
    ['n', 'ਨ'],
    ['p', 'ਪ'],
    ['f', 'ਫ਼'],
    ['b', 'ਬ'],
    ['m', 'ਮ'],
    ['y', 'ਯ'],
    ['r', 'ਰ'],
    ['l', 'ਲ'],
    ['v', 'ਵ'],
    ['w', 'ਵ'],
    ['s', 'ਸ'],
    ['h', 'ਹ'],
];

// Vowels: longest-first. ind = word-initial, mat = after-consonant matra.
// 'a' → mat:'ਾ' (long aa) because English 'a' sounds like Punjabi ਆ to most users.
const VOW_MAP = [
    ['au', { ind: 'ਔ', mat: 'ੌ' }],
    ['aa', { ind: 'ਆ', mat: 'ਾ' }],
    ['ai', { ind: 'ਐ', mat: 'ੈ' }],
    ['ii', { ind: 'ਈ', mat: 'ੀ' }],
    ['ee', { ind: 'ਈ', mat: 'ੀ' }],
    ['uu', { ind: 'ਊ', mat: 'ੂ' }],
    ['oo', { ind: 'ਊ', mat: 'ੂ' }],
    ['a', { ind: 'ਅ', mat: 'ਾ' }],
    ['i', { ind: 'ਇ', mat: 'ਿ' }],
    ['u', { ind: 'ਉ', mat: 'ੁ' }],
    ['e', { ind: 'ਏ', mat: 'ੇ' }],
    ['o', { ind: 'ਓ', mat: 'ੋ' }],
];

export function phoneticToGurmukhi(input) {
    if (!input) return '';

    const s = input.toLowerCase();
    let result = '';
    let i = 0;
    let afterConsonant = false;

    // In the while loop, swap the order — check consonants first:
    while (i < s.length) {
        const ch = s[i];

        if (ch === ' ') { result += ' '; afterConsonant = false; i++; continue; }
        if (ch >= '0' && ch <= '9') { result += ch; afterConsonant = false; i++; continue; }

        let matched = false;

        // ← Consonants FIRST
        for (const [rom, gur] of CONS_MAP) {
            if (s.startsWith(rom, i)) {
                result += gur;
                afterConsonant = true;
                i += rom.length;
                matched = true;
                break;
            }
        }
        if (matched) continue;

        // ← Vowels second
        for (const [rom, { ind, mat }] of VOW_MAP) {
            if (s.startsWith(rom, i)) {
                result += afterConsonant ? mat : ind;
                afterConsonant = false;
                i += rom.length;
                matched = true;
                break;
            }
        }
        if (matched) continue;

        result += ch;
        afterConsonant = false;
        i++;
    }

    return result;
}

// Quick test examples (for reference):
// "aasha"    → ਆਸ਼ਾ
// "satnam"   → ਸਾਤਨਾਮ
// "waheguru" → ਵਾਹੇਗੁਰੁ
// "japji"    → ਜਾਪਜਿ
// "sukhmani" → ਸੁਖਮਾਨਿ
// "anandu"   → ਅਨਾਂਦੁ