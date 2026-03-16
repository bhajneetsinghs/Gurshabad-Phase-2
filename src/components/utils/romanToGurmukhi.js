const GK_DIGITS = ['੦', '੧', '੨', '੩', '੪', '੫', '੬', '੭', '੮', '੯'];

const MAP = {
    // lowercase
    a: 'ਅ', b: 'ਬ', c: 'ਚ', d: 'ਦ', e: 'ਇ', f: 'ਫ', g: 'ਗ', h: 'ਹ', i: 'ਇ', j: 'ਜ',
    k: 'ਕ', l: 'ਲ', m: 'ਮ', n: 'ਨ', o: 'ਉ', p: 'ਪ', q: 'ਕ', r: 'ਰ', s: 'ਸ', t: 'ਤ',
    u: 'ਉ', v: 'ਵ', w: 'ਵ', x: 'ਕਸ', y: 'ਯ', z: 'ਜ਼',
    // uppercase (extended / aspirated)
    A: 'ਆ', B: 'ਭ', C: 'ਛ', D: 'ਡ', E: 'ਏ', F: 'ਫ਼', G: 'ਘ', H: 'ਃ', I: 'ਈ', J: 'ਝ',
    K: 'ਖ', L: 'ਲ਼', M: 'ੰ', N: 'ਣ', O: 'ਓ', P: 'ਫ਼', Q: 'ਕ਼', R: 'ੜ', S: 'ਸ਼', T: 'ਟ',
    U: 'ਊ', V: 'ਵ', W: 'ਵ', X: 'ਖ਼', Y: 'ਯ', Z: 'ਗ਼',
};

export function romanToGurmukhi(str) {
    if (!str) return '';
    return str.replace(/[0-9A-Za-z]/g, (ch) => {
        if (/[0-9]/.test(ch)) return GK_DIGITS[+ch];
        return MAP[ch] ?? ch;
    });
}

export function isGurmukhi(str) {
    return /[\u0A00-\u0A7F]/.test(str);
}