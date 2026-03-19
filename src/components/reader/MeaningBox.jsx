import { useEffect, useState } from 'react';

const GURBANI_FONT = "'Noto Sans Gurmukhi','Gurmukhi MN','Kohinoor Gurmukhi',sans-serif";
const UI_FONT = 'system-ui,-apple-system,sans-serif';

const IK_OANGKAAR_VIDEO_URL = 'https://www.youtube.com/embed/N3kV5Iyoh7M';
const PREAMBLE_VIDEO_URL    = 'https://www.youtube.com/embed/BZ96C_gJYgU';

function isIkOangkaar(text = '') {
  return (
    text.includes('ੴ') ||
    text.startsWith('ਇਕੁ ਓਅੰਕਾਰੁ') ||
    text.startsWith('ਇੱਕ ਓਅੰਕਾਰ')
  );
}

export default function MeaningBox({ data, onClose }) {
  useEffect(() => {
    const h = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [onClose]);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  if (!data) return null;

  const showVideos  = isIkOangkaar(data.gurmukhiText);
  const hasTranslit = !!data.transliteration;

  return (
    <div
      className="fixed inset-0 z-[999] flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.72)', backdropFilter: 'blur(8px)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="relative w-full rounded-3xl overflow-hidden"
        style={{
          maxWidth: showVideos ? '660px' : '540px',
          background: 'rgba(10,13,24,0.96)',
          backdropFilter: 'blur(28px) saturate(170%)',
          WebkitBackdropFilter: 'blur(28px) saturate(170%)',
          border: '1px solid rgba(255,255,255,0.10)',
          boxShadow: '0 48px 120px rgba(0,0,0,0.85), inset 0 1px 0 rgba(255,255,255,0.08)',
        }}
      >
        {/* Header */}
        <div style={{
          padding: '24px 28px 20px',
          borderBottom: '1px solid rgba(255,255,255,0.07)',
          display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16,
        }}>
          <h3 style={{
            fontFamily: GURBANI_FONT,
            fontSize: 'clamp(1.05rem, 2.5vw, 1.35rem)',
            lineHeight: 1.75, fontWeight: 700,
            color: 'rgba(255,255,255,0.92)', margin: 0, flex: 1,
          }}>
            {data.gurmukhiText}
          </h3>
          <button
            onClick={onClose}
            aria-label="Close"
            style={{
              flexShrink: 0, width: 32, height: 32, borderRadius: 12,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'transparent', border: 'none', cursor: 'pointer',
              color: 'rgba(255,255,255,0.40)',
              transition: 'color 150ms, background 150ms',
            }}
            onMouseEnter={e => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; }}
            onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.40)'; e.currentTarget.style.background = 'transparent'; }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '22px 28px 28px', overflowY: 'auto', maxHeight: '75vh', display: 'flex', flexDirection: 'column', gap: 24 }}>

          {/* ── 1. TRANSLITERATION first ── */}
          {hasTranslit && (
            <div>
              <Label>Transliteration</Label>
              <p style={{
                fontFamily: UI_FONT,
                fontSize: '0.9rem', lineHeight: 1.75, margin: 0,
                fontStyle: 'italic', color: 'rgba(255,255,255,0.62)',
                letterSpacing: '0.01em',
              }}>
                {data.transliteration}
              </p>
            </div>
          )}

          {/* ── 2. VIDEOS (Ik Oangkaar only) ── */}
          {showVideos && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {/* Divider before videos */}
              <div style={{
                display: 'flex', alignItems: 'center', gap: 12, margin: '2px 0',
              }}>
                <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.07)' }}/>
                <span style={{
                  fontFamily: UI_FONT, fontSize: '0.7rem', color: 'rgba(255,255,255,0.25)',
                  letterSpacing: '0.14em', textTransform: 'uppercase',
                }}>Watch & Listen</span>
                <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.07)' }}/>
              </div>

              <VideoCard
                label="ੴ  Ik Oangkaar"
                sublabel="The one universal creator"
                url={IK_OANGKAAR_VIDEO_URL}
                accentColor="rgba(251,191,36,0.18)"
                accentBorder="rgba(251,191,36,0.30)"
                dotColor="#fbbf24"
              />
              <VideoCard
                label="Mul Mantar — Preamble"
                sublabel="The foundational teaching"
                url={PREAMBLE_VIDEO_URL}
                accentColor="rgba(99,179,237,0.14)"
                accentBorder="rgba(99,179,237,0.28)"
                dotColor="#63b3ed"
              />
            </div>
          )}

          {/* Empty state */}
          {!hasTranslit && !showVideos && (
            <p style={{
              fontFamily: UI_FONT, fontSize: '0.85rem', textAlign: 'center',
              color: 'rgba(255,255,255,0.25)', padding: '16px 0', margin: 0,
            }}>
              No additional information available.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Unique video card ─────────────────────────────────────────────────────────
function VideoCard({ label, sublabel, url, accentColor, accentBorder, dotColor }) {
  const [expanded, setExpanded] = useState(false);
  const isYouTube = url.includes('youtube.com/embed') || url.includes('youtu.be');

  return (
    <div style={{
      borderRadius: 18,
      border: `1px solid ${accentBorder}`,
      background: accentColor,
      overflow: 'hidden',
      transition: 'all 300ms cubic-bezier(0.2,0.8,0.2,1)',
    }}>
      {/* Card header — click to expand/collapse */}
      <button
        onClick={() => setExpanded(v => !v)}
        style={{
          width: '100%', background: 'none', border: 'none', cursor: 'pointer',
          padding: '14px 18px',
          display: 'flex', alignItems: 'center', gap: 12,
          textAlign: 'left',
        }}
      >
        {/* Colour dot */}
        <span style={{
          width: 8, height: 8, borderRadius: '50%',
          background: dotColor, flexShrink: 0,
          boxShadow: `0 0 8px 2px ${dotColor}66`,
        }}/>

        {/* Labels */}
        <span style={{ flex: 1 }}>
          <span style={{
            display: 'block', fontFamily: GURBANI_FONT,
            fontSize: '0.92rem', color: 'rgba(255,255,255,0.88)',
            fontWeight: 500, lineHeight: 1.3,
          }}>
            {label}
          </span>
          <span style={{
            display: 'block', fontFamily: UI_FONT,
            fontSize: '0.72rem', color: 'rgba(255,255,255,0.38)',
            letterSpacing: '0.02em', marginTop: 2,
          }}>
            {sublabel}
          </span>
        </span>

        {/* Chevron */}
        <svg
          width="14" height="14" viewBox="0 0 24 24" fill="none"
          stroke="rgba(255,255,255,0.35)" strokeWidth="2.5" strokeLinecap="round"
          style={{
            flexShrink: 0,
            transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 280ms ease',
          }}
        >
          <path d="M6 9l6 6 6-6"/>
        </svg>
      </button>

      {/* Video — revealed on expand */}
      {expanded && (
        <div style={{
          margin: '0 14px 14px',
          borderRadius: 12, overflow: 'hidden',
          aspectRatio: '16/9',
          border: '1px solid rgba(255,255,255,0.08)',
          background: '#000',
        }}>
          {isYouTube ? (
            <iframe
              src={`${url}?rel=0`}
              title={label}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{ width: '100%', height: '100%', border: 'none', display: 'block' }}
            />
          ) : (
            <video
              src={url} controls autoPlay
              style={{ width: '100%', height: '100%', display: 'block', objectFit: 'cover' }}
            />
          )}
        </div>
      )}
    </div>
  );
}

function Label({ children }) {
  return (
    <p style={{
      fontFamily: UI_FONT, fontSize: '0.68rem', textTransform: 'uppercase',
      letterSpacing: '0.14em', color: 'rgba(255,255,255,0.30)',
      margin: '0 0 8px',
    }}>
      {children}
    </p>
  );
}