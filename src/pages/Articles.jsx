// export default function Articles() {
//   return (
//     <main className="min-h-screen flex items-center justify-center p-6">

//       <div className="max-w-xl w-full text-center p-8 rounded-2xl text-white bg-white/10 border border-white/20 backdrop-blur shadow-xl">

//         <h1 className="text-3xl mb-3">Articles</h1>

//         <p>Coming soon — Articles will be available here.</p>

//       </div>

//     </main>
//   );
// }


"use client"; // Remove if NOT using Next.js App Router

import { useState, useEffect, useCallback, useRef, useMemo } from "react";

// ═══════════════════════════════════════════════════════════════════════
//  SOURCES CONFIG
// ═══════════════════════════════════════════════════════════════════════
const SOURCES = {
  all: { id: "all", label: "All Sources", shortLabel: "All", color: "white" },
  svf: { id: "svf", label: "Sikhi Vichar Forum", shortLabel: "SVF", color: "amber", type: "wordpress", apiBase: "https://sikhivicharforum.org/wp-json/wp/v2", siteUrl: "https://sikhivicharforum.org" },
  gurbani: { id: "gurbani", label: "Gurbani Blog", shortLabel: "Gurbani", color: "emerald", type: "wordpress", apiBase: "https://www.gurbani.org/gurblog/wp-json/wp/v2", siteUrl: "https://www.gurbani.org/gurblog" },
  tlt: { id: "tlt", label: "The Living Treasure", shortLabel: "TLT", color: "sky", type: "static", siteUrl: "https://www.thelivingtreasure.com/downloadArticles.aspx" },
};

const COLOR = {
  amber: { badge: "bg-amber-400/15 text-amber-300 border-amber-400/25", dot: "bg-amber-400", active: "bg-amber-400 text-gray-900" },
  emerald: { badge: "bg-emerald-400/15 text-emerald-300 border-emerald-400/25", dot: "bg-emerald-400", active: "bg-emerald-400 text-gray-900" },
  sky: { badge: "bg-sky-400/15 text-sky-300 border-sky-400/25", dot: "bg-sky-400", active: "bg-sky-400 text-gray-900" },
  white: { badge: "bg-white/10 text-white/70 border-white/15", dot: "bg-white", active: "bg-white text-gray-900" },
};

const PER_PAGE = 12;

// ═══════════════════════════════════════════════════════════════════════
//  THE LIVING TREASURE — hardcoded (ASP.NET PostBack site, no public API)
//  All cards link back to the download page.
// ═══════════════════════════════════════════════════════════════════════
const TLT_ARTICLES = [
  // ── English ──────────────────────────────────────────────────
  { id: "tlt-1", title: "Law Of Nature", lang: "English", series: "Article" },
  { id: "tlt-2", title: "Am I Lonely / Alone", lang: "English", series: "Article" },
  { id: "tlt-3", title: "Meditation", lang: "English", series: "Article" },
  { id: "tlt-4", title: "Real Spiritual Being", lang: "English", series: "Article" },
  { id: "tlt-5", title: "Offering Flowers", lang: "English", series: "Article" },
  { id: "tlt-6", title: "Harmony Withering Away", lang: "English", series: "Article" },
  { id: "tlt-7", title: "Qualities of a Righteous Mother", lang: "English", series: "Article" },
  // ── Hindi ────────────────────────────────────────────────────
  { id: "tlt-8", title: "Aapsi Doori Kyon", lang: "Hindi", series: "Sawera" },
  { id: "tlt-9", title: "Apni Taqdeer", lang: "Hindi", series: "Sawera" },
  { id: "tlt-10", title: "Dhyan", lang: "Hindi", series: "Sawera" },
  { id: "tlt-11", title: "Ichha Poorti", lang: "Hindi", series: "Sawera" },
  { id: "tlt-12", title: "Ridhi Sidhi", lang: "Hindi", series: "Sawera" },
  { id: "tlt-13", title: "Savera", lang: "Hindi", series: "Sawera" },
  { id: "tlt-14", title: "Vigyan Aur Dharam", lang: "Hindi", series: "Sawera" },
  // ── Punjabi — Dil Noo Dilaan Dee Raah ────────────────────────
  { id: "tlt-15", title: "Maa Pio Tay Bachay", lang: "Punjabi", series: "Dil Noo Dilaan Dee Raah" },
  { id: "tlt-16", title: "Manukhaan Dee Aapsee Dooree Kyon", lang: "Punjabi", series: "Dil Noo Dilaan Dee Raah" },
  { id: "tlt-17", title: "Manukhtaa Bharpoor Vyaah", lang: "Punjabi", series: "Dil Noo Dilaan Dee Raah" },
  { id: "tlt-18", title: "Pyaar", lang: "Punjabi", series: "Dil Noo Dilaan Dee Raah" },
  { id: "tlt-19", title: "Pyaar Vyaah", lang: "Punjabi", series: "Dil Noo Dilaan Dee Raah" },
  { id: "tlt-20", title: "Question Answer", lang: "Punjabi", series: "Dil Noo Dilaan Dee Raah" },
  { id: "tlt-21", title: "Saaday Bachay Saaday Varis", lang: "Punjabi", series: "Dil Noo Dilaan Dee Raah" },
  { id: "tlt-22", title: "Science, Padarthvaad Atay Bachay", lang: "Punjabi", series: "Dil Noo Dilaan Dee Raah" },
  // ── Punjabi — Rabbi Gunn ──────────────────────────────────────
  { id: "tlt-23", title: "Ik Onkaar", lang: "Punjabi", series: "Rabbi Gunn" },
  { id: "tlt-24", title: "Ajoonee", lang: "Punjabi", series: "Rabbi Gunn" },
  { id: "tlt-25", title: "Akaal Murat", lang: "Punjabi", series: "Rabbi Gunn" },
  { id: "tlt-26", title: "Nirbhau", lang: "Punjabi", series: "Rabbi Gunn" },
  { id: "tlt-27", title: "Nirvair", lang: "Punjabi", series: "Rabbi Gunn" },
  { id: "tlt-28", title: "Saibhang", lang: "Punjabi", series: "Rabbi Gunn" },
  { id: "tlt-29", title: "Satnaam", lang: "Punjabi", series: "Rabbi Gunn" },
  { id: "tlt-30", title: "Gurprasaad", lang: "Punjabi", series: "Rabbi Gunn" },
  { id: "tlt-31", title: "Kartaa Purakh", lang: "Punjabi", series: "Rabbi Gunn" },
  // ── Punjabi — Viraasat ────────────────────────────────────────
  { id: "tlt-32", title: "Ardaas", lang: "Punjabi", series: "Viraasat" },
  { id: "tlt-33", title: "Gurdwara", lang: "Punjabi", series: "Viraasat" },
  { id: "tlt-34", title: "Kadah Prashaad", lang: "Punjabi", series: "Viraasat" },
  { id: "tlt-35", title: "Langar", lang: "Punjabi", series: "Viraasat" },
  { id: "tlt-36", title: "Matha Teknaa", lang: "Punjabi", series: "Viraasat" },
  { id: "tlt-37", title: "Sewaa", lang: "Punjabi", series: "Viraasat" },
  { id: "tlt-38", title: "Guru Kaun Hunda Hai", lang: "Punjabi", series: "Viraasat" },
  { id: "tlt-39", title: "Sarovar", lang: "Punjabi", series: "Viraasat" },
  { id: "tlt-40", title: "Satsangat Atay Charan", lang: "Punjabi", series: "Viraasat" },
  // ── Punjabi — Jiwan Jach Da Khazanna ─────────────────────────
  { id: "tlt-41", title: "Poota Mata Kee Asees", lang: "Punjabi", series: "Jiwan Jach Da Khazanna" },
  { id: "tlt-42", title: "Harjan Rakhay", lang: "Punjabi", series: "Jiwan Jach Da Khazanna" },
  { id: "tlt-43", title: "Satgur Puro Bhetya", lang: "Punjabi", series: "Jiwan Jach Da Khazanna" },
];

// ═══════════════════════════════════════════════════════════════════════
//  HELPERS
// ═══════════════════════════════════════════════════════════════════════
const strip = (html = "") => html.replace(/<[^>]*>/g, "").replace(/&[a-z#0-9]+;/gi, " ").trim();
const fmtDate = (d) => d ? new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }) : "";
const proxy = (u) => `https://corsproxy.io/?${encodeURIComponent(u)}`;

async function wpFetch(apiBase, params = {}) {
  const url = new URL(`${apiBase}/posts`);
  url.searchParams.set("_fields", "id,title,link,date,excerpt,categories");
  Object.entries(params).forEach(([k, v]) => v != null && v !== "" && url.searchParams.set(k, v));

  for (const ep of [url.toString(), proxy(url.toString())]) {
    try {
      const r = await fetch(ep);
      if (!r.ok) continue;
      const data = await r.json();
      return { data, total: +r.headers.get("X-WP-Total") || 0, totalPages: +r.headers.get("X-WP-TotalPages") || 1 };
    } catch (_) { /* try next */ }
  }
  throw new Error("Could not reach API. Check network.");
}

// ═══════════════════════════════════════════════════════════════════════
//  SMALL UI ATOMS
// ═══════════════════════════════════════════════════════════════════════
function Dot({ sourceId }) {
  const src = SOURCES[sourceId];
  if (!src || sourceId === "all") return null;
  return <span className={`inline-block w-1.5 h-1.5 rounded-full flex-shrink-0 ${COLOR[src.color].dot}`} />;
}

function Badge({ children, className = "" }) {
  return (
    <span className={`text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-full border ${className}`}>
      {children}
    </span>
  );
}

function Spinner({ label = "Loading…" }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4">
      <div className="w-9 h-9 rounded-full border-4 border-white/10 border-t-white/50 animate-spin" />
      <p className="text-white/25 text-[11px] tracking-widest uppercase">{label}</p>
    </div>
  );
}

function ErrorBox({ msg, onRetry }) {
  return (
    <div className="text-center py-16">
      <p className="text-red-400/70 mb-2">⚠️ Could not load articles</p>
      <p className="text-white/25 text-sm mb-4 max-w-xs mx-auto">{msg}</p>
      {onRetry && <button onClick={onRetry} className="px-4 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white/50 hover:text-white text-xs transition-all">Retry</button>}
    </div>
  );
}

function Empty() {
  return (
    <div className="text-center py-20 space-y-2">
      <p className="text-4xl">📭</p>
      <p className="text-white/40">No articles found</p>
      <p className="text-white/20 text-sm">Try a different search or source.</p>
    </div>
  );
}

function Pager({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null;
  const win = [];
  for (let i = Math.max(1, page - 2); i <= Math.min(totalPages, page + 2); i++) win.push(i);
  const base = "px-3 py-1.5 rounded-lg text-xs transition-all";
  const ghost = `${base} text-white/40 bg-white/5 border border-white/10 hover:text-white hover:bg-white/10`;
  const off = `${base} text-white/20 bg-white/3 border border-white/5 cursor-not-allowed`;
  const on = `${base} bg-white text-gray-900 font-bold`;
  return (
    <div className="flex items-center justify-center gap-1.5 mt-10 flex-wrap">
      <button onClick={() => onChange(page - 1)} disabled={page === 1} className={page === 1 ? off : ghost}>← Prev</button>
      {win[0] > 1 && <><button onClick={() => onChange(1)} className={ghost}>1</button>{win[0] > 2 && <span className="text-white/20 text-xs">…</span>}</>}
      {win.map(p => <button key={p} onClick={() => onChange(p)} className={p === page ? on : ghost}>{p}</button>)}
      {win.at(-1) < totalPages && <>{win.at(-1) < totalPages - 1 && <span className="text-white/20 text-xs">…</span>}<button onClick={() => onChange(totalPages)} className={ghost}>{totalPages}</button></>}
      <button onClick={() => onChange(page + 1)} disabled={page === totalPages} className={page === totalPages ? off : ghost}>Next →</button>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════
//  CARDS
// ═══════════════════════════════════════════════════════════════════════
function WpCard({ post, sourceId }) {
  const src = SOURCES[sourceId];
  const col = COLOR[src.color];
  const title = strip(post.title?.rendered ?? "Untitled");
  const exc = strip(post.excerpt?.rendered ?? "").slice(0, 130);

  return (
    <a href={post.link} target="_blank" rel="noopener noreferrer"
      className="group flex flex-col gap-3 p-5 rounded-2xl bg-white/5 border border-white/10
                 hover:bg-white/8 hover:border-white/20 transition-all duration-300 hover:-translate-y-0.5">
      <div className="flex items-center gap-2">
        <Dot sourceId={sourceId} />
        <Badge className={col.badge}>{src.shortLabel}</Badge>
      </div>
      <h3 className="text-white/90 font-semibold text-[15px] leading-snug line-clamp-3 group-hover:text-white transition-colors">
        {title}
      </h3>
      {exc && <p className="text-white/30 text-sm leading-relaxed line-clamp-2">{exc}…</p>}
      <div className="mt-auto pt-3 border-t border-white/5 flex justify-between items-center">
        <span className="text-white/20 text-xs">{fmtDate(post.date)}</span>
        <span className="text-white/25 group-hover:text-white/60 text-xs transition-colors">Read →</span>
      </div>
    </a>
  );
}

const LANG_CLR = {
  English: "bg-violet-400/15 text-violet-300 border-violet-400/25",
  Hindi: "bg-orange-400/15 text-orange-300 border-orange-400/25",
  Punjabi: "bg-teal-400/15 text-teal-300 border-teal-400/25",
};

function TltCard({ article }) {
  return (
    <a href={SOURCES.tlt.siteUrl} target="_blank" rel="noopener noreferrer"
      className="group flex flex-col gap-3 p-5 rounded-2xl bg-white/5 border border-white/10
                 hover:bg-white/8 hover:border-white/20 transition-all duration-300 hover:-translate-y-0.5">
      <div className="flex items-center gap-2 flex-wrap">
        <Dot sourceId="tlt" />
        <Badge className={COLOR.sky.badge}>TLT</Badge>
        <Badge className={LANG_CLR[article.lang]}>{article.lang}</Badge>
      </div>
      <h3 className="text-white/90 font-semibold text-[15px] leading-snug group-hover:text-white transition-colors">
        {article.title}
      </h3>
      <p className="text-white/25 text-xs italic">{article.series}</p>
      <div className="mt-auto pt-3 border-t border-white/5 flex justify-between items-center">
        <span className="text-white/15 text-xs">Veer Bhupinder Singh Ji</span>
        <span className="text-white/25 group-hover:text-sky-400 text-xs transition-colors">Download →</span>
      </div>
    </a>
  );
}

// ═══════════════════════════════════════════════════════════════════════
//  CUSTOM HOOK — WordPress source state
// ═══════════════════════════════════════════════════════════════════════
function useWp(sourceId, page, search) {
  const [posts, setPosts] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tick, setTick] = useState(0);
  const retry = useCallback(() => setTick(t => t + 1), []);

  useEffect(() => {
    setLoading(true); setError(null);
    wpFetch(SOURCES[sourceId].apiBase, { per_page: PER_PAGE, page, search: search || undefined })
      .then(({ data, total: t, totalPages: tp }) => { setPosts(data); setTotal(t); setTotalPages(tp); })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [sourceId, page, search, tick]);

  return { posts, total, totalPages, loading, error, retry };
}

// ═══════════════════════════════════════════════════════════════════════
//  SECTION HEADER used in "All Sources" view
// ═══════════════════════════════════════════════════════════════════════
function SectionHeader({ sourceId, total, onViewAll }) {
  const src = SOURCES[sourceId];
  const col = COLOR[src.color];
  return (
    <div className="flex items-center justify-between mb-5">
      <div className="flex items-center gap-2.5">
        <span className={`w-2.5 h-2.5 rounded-full ${col.dot}`} />
        <h2 className="text-white/70 font-bold text-sm tracking-wide">{src.label}</h2>
        {total > 0 && <span className="text-white/25 text-xs">{total} articles</span>}
      </div>
      <button onClick={onViewAll}
        className="text-white/30 hover:text-white text-xs transition-colors underline underline-offset-2">
        View all →
      </button>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════
//  ALL SOURCES VIEW
// ═══════════════════════════════════════════════════════════════════════
function AllView({ search, onPickSource }) {
  const svf = useWp("svf", 1, search);
  const gurbani = useWp("gurbani", 1, search);

  const tltList = useMemo(() => {
    const q = search.toLowerCase();
    return q ? TLT_ARTICLES.filter(a => a.title.toLowerCase().includes(q) || a.series.toLowerCase().includes(q)) : TLT_ARTICLES;
  }, [search]);

  const PREVIEW = 6;

  return (
    <div className="space-y-14">
      {/* SVF */}
      <section>
        <SectionHeader sourceId="svf" total={svf.total} onViewAll={() => onPickSource("svf")} />
        {svf.loading ? <Spinner label="Loading Sikhi Vichar Forum…" /> :
          svf.error ? <ErrorBox msg={svf.error} onRetry={svf.retry} /> :
            svf.posts.length === 0 ? <p className="text-white/20 text-sm">No results.</p> : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {svf.posts.slice(0, PREVIEW).map(p => <WpCard key={p.id} post={p} sourceId="svf" />)}
              </div>
            )}
      </section>

      {/* Gurbani Blog */}
      <section>
        <SectionHeader sourceId="gurbani" total={gurbani.total} onViewAll={() => onPickSource("gurbani")} />
        {gurbani.loading ? <Spinner label="Loading Gurbani Blog…" /> :
          gurbani.error ? <ErrorBox msg={gurbani.error} onRetry={gurbani.retry} /> :
            gurbani.posts.length === 0 ? <p className="text-white/20 text-sm">No results.</p> : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {gurbani.posts.slice(0, PREVIEW).map(p => <WpCard key={p.id} post={p} sourceId="gurbani" />)}
              </div>
            )}
      </section>

      {/* The Living Treasure */}
      <section>
        <SectionHeader sourceId="tlt" total={tltList.length} onViewAll={() => onPickSource("tlt")} />
        {tltList.length === 0 ? <p className="text-white/20 text-sm">No results.</p> : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {tltList.slice(0, PREVIEW).map(a => <TltCard key={a.id} article={a} />)}
          </div>
        )}
      </section>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════
//  SINGLE WORDPRESS SOURCE VIEW
// ═══════════════════════════════════════════════════════════════════════
function WpView({ sourceId, search }) {
  const [page, setPage] = useState(1);
  const { posts, total, totalPages, loading, error, retry } = useWp(sourceId, page, search);

  useEffect(() => setPage(1), [search]);
  const onPage = p => { setPage(p); window.scrollTo({ top: 0, behavior: "smooth" }); };

  if (loading) return <Spinner />;
  if (error) return <ErrorBox msg={error} onRetry={retry} />;
  if (!posts.length) return <Empty />;

  return (
    <>
      {total > 0 && <p className="text-white/20 text-xs mb-5">{total} articles</p>}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {posts.map(p => <WpCard key={p.id} post={p} sourceId={sourceId} />)}
      </div>
      <Pager page={page} totalPages={totalPages} onChange={onPage} />
    </>
  );
}

// ═══════════════════════════════════════════════════════════════════════
//  THE LIVING TREASURE VIEW  (static list + language filter + pagination)
// ═══════════════════════════════════════════════════════════════════════
const TLT_PER_PAGE = 18;
const LANGS = ["All", "English", "Hindi", "Punjabi"];
const LANG_ACTIVE = { All: "bg-white text-gray-900", English: "bg-violet-400 text-gray-900", Hindi: "bg-orange-400 text-gray-900", Punjabi: "bg-teal-400 text-gray-900" };

function TltView({ search }) {
  const [lang, setLang] = useState("All");
  const [page, setPage] = useState(1);
  useEffect(() => setPage(1), [search, lang]);

  const list = useMemo(() => {
    const q = search.toLowerCase();
    return TLT_ARTICLES.filter(a =>
      (lang === "All" || a.lang === lang) &&
      (!q || a.title.toLowerCase().includes(q) || a.series.toLowerCase().includes(q))
    );
  }, [search, lang]);

  const pages = Math.ceil(list.length / TLT_PER_PAGE);
  const slice = list.slice((page - 1) * TLT_PER_PAGE, page * TLT_PER_PAGE);

  return (
    <>
      {/* Language pills */}
      <div className="flex items-center gap-2 mb-6 flex-wrap">
        {LANGS.map(l => (
          <button key={l} onClick={() => setLang(l)}
            className={`px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase transition-all
              ${l === lang ? LANG_ACTIVE[l] : "bg-white/5 text-white/35 border border-white/10 hover:bg-white/10 hover:text-white"}`}>
            {l}
          </button>
        ))}
        <span className="text-white/20 text-xs ml-1">{list.length} articles</span>
      </div>

      {slice.length === 0 ? <Empty /> : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {slice.map(a => <TltCard key={a.id} article={a} />)}
          </div>
          <Pager page={page} totalPages={pages}
            onChange={p => { setPage(p); window.scrollTo({ top: 0, behavior: "smooth" }); }} />
        </>
      )}
    </>
  );
}

// ═══════════════════════════════════════════════════════════════════════
//  ROOT COMPONENT
// ═══════════════════════════════════════════════════════════════════════
const SOURCE_TABS = ["all", "svf", "gurbani", "tlt"];

export default function Articles() {
  const [active, setActive] = useState("all");
  const [search, setSearch] = useState("");
  const [liveSearch, setLiveSearch] = useState("");
  const debRef = useRef(null);

  const handleSearch = useCallback(val => {
    setSearch(val);
    clearTimeout(debRef.current);
    debRef.current = setTimeout(() => setLiveSearch(val.trim()), 400);
  }, []);

  const handleTab = (id) => { setActive(id); };

  return (
    <main className="min-h-screen p-6 md:p-10">
      <div className="max-w-6xl mx-auto">

        {/* ══ Header ════════════════════════════════════════════════ */}
        <header className="text-center mb-12">
          <p className="text-white/25 text-[10px] tracking-[0.45em] uppercase mb-3">Knowledge Library</p>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-3 tracking-tight">
            Articles &amp; Resources
          </h1>
          <p className="text-white/30 text-sm max-w-lg mx-auto leading-relaxed">
            Scholarly Sikh articles from three curated sources. Browse, search, and filter by source or language.
          </p>
          {/* Source legend */}
          <div className="flex items-center justify-center gap-5 mt-5 flex-wrap">
            {["svf", "gurbani", "tlt"].map(id => {
              const src = SOURCES[id];
              return (
                <a key={id} href={src.siteUrl} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-white/25 hover:text-white/60 text-xs transition-colors">
                  <span className={`w-2 h-2 rounded-full ${COLOR[src.color].dot}`} />
                  {src.label}
                </a>
              );
            })}
          </div>
        </header>

        {/* ══ Source Tabs ═══════════════════════════════════════════ */}
        <div className="flex gap-2 mb-5 overflow-x-auto pb-1 scrollbar-none">
          {SOURCE_TABS.map(id => {
            const src = SOURCES[id];
            const col = COLOR[src.color];
            const isActive = active === id;
            return (
              <button key={id} onClick={() => handleTab(id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold
                            whitespace-nowrap transition-all duration-200
                            ${isActive ? col.active + " shadow-lg" : "bg-white/5 text-white/40 border border-white/10 hover:bg-white/10 hover:text-white"}`}>
                {id !== "all" && <span className={`w-1.5 h-1.5 rounded-full ${col.dot} ${isActive ? "opacity-70" : ""}`} />}
                {src.label}
              </button>
            );
          })}
        </div>

        {/* ══ Search ════════════════════════════════════════════════ */}
        <div className="relative mb-8">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 pointer-events-none select-none">🔍</span>
          <input
            type="text"
            value={search}
            onChange={e => handleSearch(e.target.value)}
            placeholder={`Search ${SOURCES[active].label}…`}
            className="w-full pl-11 pr-10 py-3 rounded-xl bg-white/5 border border-white/10
                       text-white placeholder-white/20 text-sm
                       focus:outline-none focus:border-white/25 focus:bg-white/7 transition-all"
          />
          {search && (
            <button onClick={() => handleSearch("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/60 transition-colors text-sm">
              ✕
            </button>
          )}
        </div>

        {/* ══ Content ═══════════════════════════════════════════════ */}
        {active === "all" && <AllView search={liveSearch} onPickSource={handleTab} />}
        {active === "svf" && <WpView sourceId="svf" search={liveSearch} />}
        {active === "gurbani" && <WpView sourceId="gurbani" search={liveSearch} />}
        {active === "tlt" && <TltView search={liveSearch} />}

      </div>
    </main>
  );
}