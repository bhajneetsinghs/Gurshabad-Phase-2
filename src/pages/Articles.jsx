// "use client"; // Remove this line if NOT using Next.js App Router

// import { useState, useEffect, useCallback, useRef, useMemo } from "react";

// //  SOURCES CONFIG
// const SOURCES = {
//   all: { id: "all", label: "All Sources", shortLabel: "All", color: "white" },
//   svf: { id: "svf", label: "Sikhi Vichar Forum", shortLabel: "SVF", color: "amber", type: "wordpress", apiBase: "https://sikhivicharforum.org/wp-json/wp/v2", siteUrl: "https://sikhivicharforum.org" },
//   gurbani: { id: "gurbani", label: "Gurbani Blog", shortLabel: "Gurbani", color: "emerald", type: "wordpress", apiBase: "https://www.gurbani.org/gurblog/wp-json/wp/v2", siteUrl: "https://www.gurbani.org/gurblog" },
//   tlt: { id: "tlt", label: "The Living Treasure", shortLabel: "TLT", color: "sky", type: "static", siteUrl: "https://www.thelivingtreasure.com/downloadArticles.aspx" },
// };

// const COLOR = {
//   amber: { badge: "bg-amber-400/15 text-amber-300 border-amber-400/25", dot: "bg-amber-400", active: "bg-amber-400 text-gray-900", hover: "hover:border-amber-400/40 hover:text-amber-300" },
//   emerald: { badge: "bg-emerald-400/15 text-emerald-300 border-emerald-400/25", dot: "bg-emerald-400", active: "bg-emerald-400 text-gray-900", hover: "hover:border-emerald-400/40 hover:text-emerald-300" },
//   sky: { badge: "bg-sky-400/15 text-sky-300 border-sky-400/25", dot: "bg-sky-400", active: "bg-sky-400 text-gray-900", hover: "hover:border-sky-400/40 hover:text-sky-300" },
//   white: { badge: "bg-white/10 text-white/70 border-white/15", dot: "bg-white", active: "bg-white text-gray-900", hover: "hover:border-white/30 hover:text-white" },
// };

// const PER_PAGE = 12;

// //  SVF TOPIC ICONS  — mapped to category slug keywords
// const TOPIC_ICON = (name = "") => {
//   const n = name.toLowerCase();
//   if (n.includes("article")) return "";
//   if (n.includes("history")) return "";
//   if (n.includes("jup") || n.includes("bannee") || n.includes("bani")) return "";
//   if (n.includes("sidh")) return "";
//   if (n.includes("vichar") || n.includes("shabad") || n.includes("shabd")) return "";
//   if (n.includes("diwan")) return "";
//   if (n.includes("video")) return "";
//   if (n.includes("bulletin") || n.includes("media") || n.includes("international")) return "";
//   if (n.includes("bachitr") || n.includes("dsm") || n.includes("granth")) return "";
//   if (n.includes("faq")) return "";
//   return "";
// };

// //  THE LIVING TREASURE  — hardcoded (ASP.NET PostBack, no public API)
// const TLT_ARTICLES = [
//   { id: "tlt-1", title: "Law Of Nature", lang: "English", series: "Article" },
//   { id: "tlt-2", title: "Am I Lonely / Alone", lang: "English", series: "Article" },
//   { id: "tlt-3", title: "Meditation", lang: "English", series: "Article" },
//   { id: "tlt-4", title: "Real Spiritual Being", lang: "English", series: "Article" },
//   { id: "tlt-5", title: "Offering Flowers", lang: "English", series: "Article" },
//   { id: "tlt-6", title: "Harmony Withering Away", lang: "English", series: "Article" },
//   { id: "tlt-7", title: "Qualities of a Righteous Mother", lang: "English", series: "Article" },
//   { id: "tlt-8", title: "Aapsi Doori Kyon", lang: "Hindi", series: "Sawera" },
//   { id: "tlt-9", title: "Apni Taqdeer", lang: "Hindi", series: "Sawera" },
//   { id: "tlt-10", title: "Dhyan", lang: "Hindi", series: "Sawera" },
//   { id: "tlt-11", title: "Ichha Poorti", lang: "Hindi", series: "Sawera" },
//   { id: "tlt-12", title: "Ridhi Sidhi", lang: "Hindi", series: "Sawera" },
//   { id: "tlt-13", title: "Savera", lang: "Hindi", series: "Sawera" },
//   { id: "tlt-14", title: "Vigyan Aur Dharam", lang: "Hindi", series: "Sawera" },
//   { id: "tlt-15", title: "Maa Pio Tay Bachay", lang: "Punjabi", series: "Dil Noo Dilaan Dee Raah" },
//   { id: "tlt-16", title: "Manukhaan Dee Aapsee Dooree Kyon", lang: "Punjabi", series: "Dil Noo Dilaan Dee Raah" },
//   { id: "tlt-17", title: "Manukhtaa Bharpoor Vyaah", lang: "Punjabi", series: "Dil Noo Dilaan Dee Raah" },
//   { id: "tlt-18", title: "Pyaar", lang: "Punjabi", series: "Dil Noo Dilaan Dee Raah" },
//   { id: "tlt-19", title: "Pyaar Vyaah", lang: "Punjabi", series: "Dil Noo Dilaan Dee Raah" },
//   { id: "tlt-20", title: "Question Answer", lang: "Punjabi", series: "Dil Noo Dilaan Dee Raah" },
//   { id: "tlt-21", title: "Saaday Bachay Saaday Varis", lang: "Punjabi", series: "Dil Noo Dilaan Dee Raah" },
//   { id: "tlt-22", title: "Science, Padarthvaad Atay Bachay", lang: "Punjabi", series: "Dil Noo Dilaan Dee Raah" },
//   { id: "tlt-23", title: "Ik Onkaar", lang: "Punjabi", series: "Rabbi Gunn" },
//   { id: "tlt-24", title: "Ajoonee", lang: "Punjabi", series: "Rabbi Gunn" },
//   { id: "tlt-25", title: "Akaal Murat", lang: "Punjabi", series: "Rabbi Gunn" },
//   { id: "tlt-26", title: "Nirbhau", lang: "Punjabi", series: "Rabbi Gunn" },
//   { id: "tlt-27", title: "Nirvair", lang: "Punjabi", series: "Rabbi Gunn" },
//   { id: "tlt-28", title: "Saibhang", lang: "Punjabi", series: "Rabbi Gunn" },
//   { id: "tlt-29", title: "Satnaam", lang: "Punjabi", series: "Rabbi Gunn" },
//   { id: "tlt-30", title: "Gurprasaad", lang: "Punjabi", series: "Rabbi Gunn" },
//   { id: "tlt-31", title: "Kartaa Purakh", lang: "Punjabi", series: "Rabbi Gunn" },
//   { id: "tlt-32", title: "Ardaas", lang: "Punjabi", series: "Viraasat" },
//   { id: "tlt-33", title: "Gurdwara", lang: "Punjabi", series: "Viraasat" },
//   { id: "tlt-34", title: "Kadah Prashaad", lang: "Punjabi", series: "Viraasat" },
//   { id: "tlt-35", title: "Langar", lang: "Punjabi", series: "Viraasat" },
//   { id: "tlt-36", title: "Matha Teknaa", lang: "Punjabi", series: "Viraasat" },
//   { id: "tlt-37", title: "Sewaa", lang: "Punjabi", series: "Viraasat" },
//   { id: "tlt-38", title: "Guru Kaun Hunda Hai", lang: "Punjabi", series: "Viraasat" },
//   { id: "tlt-39", title: "Sarovar", lang: "Punjabi", series: "Viraasat" },
//   { id: "tlt-40", title: "Satsangat Atay Charan", lang: "Punjabi", series: "Viraasat" },
//   { id: "tlt-41", title: "Poota Mata Kee Asees", lang: "Punjabi", series: "Jiwan Jach Da Khazanna" },
//   { id: "tlt-42", title: "Harjan Rakhay", lang: "Punjabi", series: "Jiwan Jach Da Khazanna" },
//   { id: "tlt-43", title: "Satgur Puro Bhetya", lang: "Punjabi", series: "Jiwan Jach Da Khazanna" },
// ];

// //  UTILITIES
// const strip = (h = "") => h.replace(/<[^>]*>/g, "").replace(/&[a-z#0-9]+;/gi, " ").trim();
// const fmtDate = (d) => d ? new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }) : "";
// const proxyUrl = (u) => `https://corsproxy.io/?${encodeURIComponent(u)}`;

// async function wpGet(url) {
//   for (const ep of [url, proxyUrl(url)]) {
//     try {
//       const r = await fetch(ep);
//       if (!r.ok) continue;
//       return {
//         data: await r.json(),
//         total: +(r.headers.get("X-WP-Total") ?? 0),
//         totalPages: +(r.headers.get("X-WP-TotalPages") ?? 1),
//       };
//     } catch (_) { /* try proxy */ }
//   }
//   throw new Error("Could not reach API. Check network or CORS proxy.");
// }

// function buildUrl(base, params = {}) {
//   const u = new URL(base);
//   Object.entries(params).forEach(([k, v]) => v != null && v !== "" && u.searchParams.set(k, String(v)));
//   return u.toString();
// }

// //  HOOKS

// /** Fetch WP categories for a given site */
// function useCats(apiBase) {
//   const [cats, setCats] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     setLoading(true);
//     wpGet(buildUrl(`${apiBase}/categories`, { per_page: 50, orderby: "count", order: "desc", _fields: "id,name,slug,count,parent" }))
//       .then(({ data }) => setCats(data.filter(c => c.count > 0)))
//       .catch(() => setCats([]))
//       .finally(() => setLoading(false));
//   }, [apiBase]);

//   return { cats, loading };
// }

// /** Fetch WP posts */
// function usePosts(apiBase, { page = 1, categoryId = null, search = "" } = {}) {
//   const [posts, setPosts] = useState([]);
//   const [total, setTotal] = useState(0);
//   const [totalPages, setTotalPages] = useState(1);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [tick, setTick] = useState(0);
//   const retry = useCallback(() => setTick(t => t + 1), []);

//   useEffect(() => {
//     setLoading(true); setError(null);
//     wpGet(buildUrl(`${apiBase}/posts`, {
//       per_page: PER_PAGE,
//       page,
//       categories: categoryId || undefined,
//       search: search || undefined,
//       _fields: "id,title,link,date,excerpt,categories",
//     }))
//       .then(({ data, total: t, totalPages: tp }) => { setPosts(data); setTotal(t); setTotalPages(tp); })
//       .catch(e => setError(e.message))
//       .finally(() => setLoading(false));
//   }, [apiBase, page, categoryId, search, tick]);

//   return { posts, total, totalPages, loading, error, retry };
// }

// // ═══════════════════════════════════════════════════════════════════
// //  TINY UI ATOMS
// // ═══════════════════════════════════════════════════════════════════
// function Dot({ color, size = 1.5 }) {
//   const sz = `w-${size} h-${size}`;
//   return <span className={`inline-block rounded-full flex-shrink-0 ${sz} ${COLOR[color]?.dot ?? "bg-white"}`} />;
// }

// function Badge({ children, className = "" }) {
//   return <span className={`text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-full border ${className}`}>{children}</span>;
// }

// function Spinner({ label = "Loading…" }) {
//   return (
//     <div className="flex flex-col items-center justify-center py-20 gap-4">
//       <div className="w-9 h-9 rounded-full border-4 border-white/10 border-t-white/50 animate-spin" />
//       <p className="text-white/25 text-[11px] tracking-widest uppercase">{label}</p>
//     </div>
//   );
// }

// function ErrorBox({ msg, onRetry }) {
//   return (
//     <div className="text-center py-16">
//       <p className="text-red-400/70 mb-1"> Could not load articles</p>
//       <p className="text-white/25 text-sm mb-4 max-w-xs mx-auto">{msg}</p>
//       {onRetry && <button onClick={onRetry} className="px-4 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white/50 hover:text-white text-xs transition-all">Retry</button>}
//     </div>
//   );
// }

// function Empty() {
//   return (
//     <div className="text-center py-20 space-y-2">
//       <p className="text-4xl"></p>
//       <p className="text-white/40">No articles found</p>
//       <p className="text-white/20 text-sm">Try a different search or topic.</p>
//     </div>
//   );
// }

// function Pager({ page, totalPages, onChange }) {
//   if (totalPages <= 1) return null;
//   const win = [];
//   for (let i = Math.max(1, page - 2); i <= Math.min(totalPages, page + 2); i++) win.push(i);
//   const base = "px-3 py-1.5 rounded-lg text-xs transition-all";
//   const ghost = `${base} text-white/40 bg-white/5 border border-white/10 hover:text-white hover:bg-white/10`;
//   const off = `${base} text-white/15 bg-white/3 border border-white/5 cursor-not-allowed`;
//   const on = `${base} bg-white text-gray-900 font-bold`;
//   return (
//     <div className="flex items-center justify-center gap-1.5 mt-10 flex-wrap">
//       <button onClick={() => onChange(page - 1)} disabled={page === 1} className={page === 1 ? off : ghost}> ← Prev </button>
//       {win[0] > 1 && <><button onClick={() => onChange(1)} className={ghost}>1</button>       {win[0] > 2 && <span className="text-white/20 text-xs">…</span>}</>}
//       {win.map(p => <button key={p} onClick={() => onChange(p)} className={p === page ? on : ghost}>{p}</button>)}
//       {win.at(-1) < totalPages && <>{win.at(-1) < totalPages - 1 && <span className="text-white/20 text-xs">…</span>}<button onClick={() => onChange(totalPages)} className={ghost}>{totalPages}</button></>}
//       <button onClick={() => onChange(page + 1)} disabled={page === totalPages} className={page === totalPages ? off : ghost}> Next → </button>
//     </div>
//   );
// }

// // ═══════════════════════════════════════════════════════════════════
// //  SHARED CARDS
// // ═══════════════════════════════════════════════════════════════════
// function WpCard({ post, sourceId }) {
//   const src = SOURCES[sourceId];
//   const col = COLOR[src.color];
//   const title = strip(post.title?.rendered ?? "Untitled");
//   const exc = strip(post.excerpt?.rendered ?? "").slice(0, 130);

//   return (
//     <a href={post.link} target="_blank" rel="noopener noreferrer"
//       className="group flex flex-col gap-3 p-5 rounded-2xl bg-white/5 border border-white/10
//                  hover:bg-white/8 hover:border-white/20 transition-all duration-300 hover:-translate-y-0.5">
//       <div className="flex items-center gap-2">
//         <Dot color={src.color} size={1.5} />
//         <Badge className={col.badge}>{src.shortLabel}</Badge>
//       </div>
//       <h3 className="text-white/90 font-semibold text-[15px] leading-snug line-clamp-3 group-hover:text-white transition-colors">
//         {title}
//       </h3>
//       {exc && <p className="text-white/30 text-sm leading-relaxed line-clamp-2">{exc}…</p>}
//       <div className="mt-auto pt-3 border-t border-white/5 flex justify-between items-center">
//         <span className="text-white/20 text-xs">{fmtDate(post.date)}</span>
//         <span className="text-white/25 group-hover:text-white/60 text-xs transition-colors">Read →</span>
//       </div>
//     </a>
//   );
// }

// const LANG_CLR = {
//   English: "bg-violet-400/15 text-violet-300 border-violet-400/25",
//   Hindi: "bg-orange-400/15 text-orange-300 border-orange-400/25",
//   Punjabi: "bg-teal-400/15 text-teal-300 border-teal-400/25",
// };

// function TltCard({ article }) {
//   return (
//     <a href={SOURCES.tlt.siteUrl} target="_blank" rel="noopener noreferrer"
//       className="group flex flex-col gap-3 p-5 rounded-2xl bg-white/5 border border-white/10
//                  hover:bg-white/8 hover:border-white/20 transition-all duration-300 hover:-translate-y-0.5">
//       <div className="flex items-center gap-2 flex-wrap">
//         <Dot color="sky" size={1.5} />
//         <Badge className={COLOR.sky.badge}>TLT</Badge>
//         <Badge className={LANG_CLR[article.lang]}>{article.lang}</Badge>
//       </div>
//       <h3 className="text-white/90 font-semibold text-[15px] leading-snug group-hover:text-white transition-colors">
//         {article.title}
//       </h3>
//       <p className="text-white/25 text-xs italic">{article.series}</p>
//       <div className="mt-auto pt-3 border-t border-white/5 flex justify-between items-center">
//         <span className="text-white/15 text-xs">Veer Bhupinder Singh Ji</span>
//         <span className="text-white/25 group-hover:text-sky-400 text-xs transition-colors">Download →</span>
//       </div>
//     </a>
//   );
// }

// // ═══════════════════════════════════════════════════════════════════
// //  SVF VIEW  — topic browser + filtered post list
// // ═══════════════════════════════════════════════════════════════════

// /** Topic "card" shown in the browse grid */
// function TopicCard({ cat, onClick }) {
//   const icon = TOPIC_ICON(cat.name);
//   return (
//     <button onClick={onClick}
//       className="group flex items-start gap-4 p-4 rounded-2xl text-left w-full
//                  bg-white/5 border border-white/10
//                  hover:bg-amber-400/8 hover:border-amber-400/30
//                  transition-all duration-200 hover:-translate-y-0.5">
//       <span className="text-2xl flex-shrink-0 mt-0.5">{icon}</span>
//       <div className="min-w-0">
//         <p className="text-white/80 font-semibold text-sm leading-snug group-hover:text-amber-300 transition-colors line-clamp-2">
//           {cat.name}
//         </p>
//         <p className="text-white/25 text-xs mt-1">{cat.count} articles</p>
//       </div>
//     </button>
//   );
// }

// /** Post list once a topic is selected */
// function SvfPostList({ cat, search }) {
//   const [page, setPage] = useState(1);
//   useEffect(() => setPage(1), [cat?.id, search]);

//   const { posts, total, totalPages, loading, error, retry } = usePosts(
//     SOURCES.svf.apiBase,
//     { page, categoryId: cat?.id ?? null, search }
//   );

//   const onPage = (p) => { setPage(p); window.scrollTo({ top: 0, behavior: "smooth" }); };

//   return (
//     <>
//       {total > 0 && !loading && (
//         <p className="text-white/20 text-xs mb-5">{total} articles</p>
//       )}
//       {loading ? <Spinner /> :
//         error ? <ErrorBox msg={error} onRetry={retry} /> :
//           !posts.length ? <Empty /> : (
//             <>
//               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//                 {posts.map(p => <WpCard key={p.id} post={p} sourceId="svf" />)}
//               </div>
//               <Pager page={page} totalPages={totalPages} onChange={onPage} />
//             </>
//           )}
//     </>
//   );
// }

// function SvfView({ search }) {
//   const { cats, loading: catsLoading } = useCats(SOURCES.svf.apiBase);
//   const [activeCat, setActiveCat] = useState(null); // null = show topic grid

//   // Reset topic if search changes
//   useEffect(() => { setActiveCat(null); }, [search]);

//   // ─ Topic browser ─
//   if (!activeCat && !search) {
//     return (
//       <div>
//         <p className="text-white/30 text-xs mb-6 tracking-wide">
//           Select a topic to browse articles, or use the search bar above.
//         </p>

//         {catsLoading ? (
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
//             {Array.from({ length: 9 }).map((_, i) => (
//               <div key={i} className="h-20 rounded-2xl bg-white/5 animate-pulse" />
//             ))}
//           </div>
//         ) : (
//           <>
//             {/* "All Articles" shortcut */}
//             <button onClick={() => setActiveCat({ id: null, name: "All Articles", count: cats.reduce((s, c) => s + c.count, 0) })}
//               className="group flex items-center gap-3 w-full p-4 rounded-2xl mb-3
//                          bg-amber-400/10 border border-amber-400/25
//                          hover:bg-amber-400/15 hover:border-amber-400/50 transition-all">
//               <span className="text-2xl"></span>
//               <div className="text-left">
//                 <p className="text-amber-300 font-bold text-sm">All Articles</p>
//                 <p className="text-amber-300/40 text-xs">{cats.reduce((s, c) => s + c.count, 0)} total</p>
//               </div>
//             </button>

//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
//               {cats.map(cat => (
//                 <TopicCard key={cat.id} cat={cat} onClick={() => setActiveCat(cat)} />
//               ))}
//             </div>
//           </>
//         )}
//       </div>
//     );
//   }

//   // ─ Post list for a chosen topic (or when searching) ─
//   return (
//     <div>
//       {/* Breadcrumb / back button */}
//       <div className="flex items-center gap-3 mb-6">
//         <button onClick={() => setActiveCat(null)}
//           className="flex items-center gap-1.5 text-white/35 hover:text-white text-xs transition-colors">
//           ← Topics
//         </button>
//         {activeCat && (
//           <>
//             <span className="text-white/15 text-xs">/</span>
//             <span className="flex items-center gap-1.5 text-amber-300/80 text-xs font-semibold">
//               <span>{TOPIC_ICON(activeCat.name)}</span>
//               {activeCat.name}
//             </span>
//           </>
//         )}
//         {search && !activeCat && (
//           <>
//             <span className="text-white/15 text-xs">/</span>
//             <span className="text-white/50 text-xs">Search: "{search}"</span>
//           </>
//         )}
//       </div>

//       <SvfPostList cat={activeCat?.id !== undefined ? activeCat : null} search={search} />
//     </div>
//   );
// }

// // ═══════════════════════════════════════════════════════════════════
// //  GURBANI BLOG VIEW  — category filter pills + post list
// // ═══════════════════════════════════════════════════════════════════
// function GurbaniView({ search }) {
//   const { cats, loading: catsLoading } = useCats(SOURCES.gurbani.apiBase);
//   const [activeCat, setActiveCat] = useState(null); // null = All
//   const [page, setPage] = useState(1);

//   useEffect(() => setPage(1), [activeCat, search]);

//   const { posts, total, totalPages, loading, error, retry } = usePosts(
//     SOURCES.gurbani.apiBase,
//     { page, categoryId: activeCat?.id ?? null, search }
//   );

//   const onPage = (p) => { setPage(p); window.scrollTo({ top: 0, behavior: "smooth" }); };

//   return (
//     <div>
//       {/* ── Category filter pills ── */}
//       <div className="mb-6">
//         <p className="text-white/25 text-[11px] tracking-widest uppercase mb-3">Filter by Category</p>
//         <div className="flex flex-wrap gap-2">
//           {/* All */}
//           <button onClick={() => setActiveCat(null)}
//             className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all
//               ${!activeCat
//                 ? "bg-emerald-400 text-gray-900 shadow-lg shadow-emerald-400/20"
//                 : "bg-white/5 text-white/40 border border-white/10 hover:bg-white/10 hover:text-white"}`}>
//             All
//             {total > 0 && !activeCat && <span className="opacity-60 text-[10px]">({total})</span>}
//           </button>

//           {catsLoading
//             ? Array.from({ length: 8 }).map((_, i) => (
//               <div key={i} className="h-7 w-24 rounded-full bg-white/5 animate-pulse" />
//             ))
//             : cats.map(cat => {
//               const isActive = activeCat?.id === cat.id;
//               return (
//                 <button key={cat.id} onClick={() => setActiveCat(cat)}
//                   className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all
//                       ${isActive
//                       ? "bg-emerald-400 text-gray-900 shadow-lg shadow-emerald-400/20"
//                       : "bg-white/5 text-white/40 border border-white/10 hover:bg-white/10 hover:text-white"}`}>
//                   {cat.name}
//                   <span className={`text-[10px] ${isActive ? "opacity-60 text-gray-900" : "text-white/25"}`}>
//                     ({cat.count})
//                   </span>
//                 </button>
//               );
//             })
//           }
//         </div>

//         {/* Active filter label */}
//         {activeCat && (
//           <p className="text-white/25 text-xs mt-3">
//             Showing: <span className="text-emerald-300/80">{activeCat.name}</span>
//             {total > 0 && !loading && <span className="ml-1">— {total} articles</span>}
//             <button onClick={() => setActiveCat(null)}
//               className="ml-3 text-white/20 hover:text-white/60 underline underline-offset-2 transition-colors">
//               Clear
//             </button>
//           </p>
//         )}
//       </div>

//       {/* ── Posts ── */}
//       {loading ? <Spinner /> :
//         error ? <ErrorBox msg={error} onRetry={retry} /> :
//           !posts.length ? <Empty /> : (
//             <>
//               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//                 {posts.map(p => <WpCard key={p.id} post={p} sourceId="gurbani" />)}
//               </div>
//               <Pager page={page} totalPages={totalPages} onChange={onPage} />
//             </>
//           )}
//     </div>
//   );
// }

// // ═══════════════════════════════════════════════════════════════════
// //  THE LIVING TREASURE VIEW  — language filter + pagination
// // ═══════════════════════════════════════════════════════════════════
// const TLT_PER_PAGE = 18;
// const LANGS = ["All", "English", "Hindi", "Punjabi"];
// const LANG_ACTIVE = { All: "bg-white text-gray-900", English: "bg-violet-400 text-gray-900", Hindi: "bg-orange-400 text-gray-900", Punjabi: "bg-teal-400 text-gray-900" };

// function TltView({ search }) {
//   const [lang, setLang] = useState("All");
//   const [page, setPage] = useState(1);
//   useEffect(() => setPage(1), [search, lang]);

//   const list = useMemo(() => {
//     const q = search.toLowerCase();
//     return TLT_ARTICLES.filter(a =>
//       (lang === "All" || a.lang === lang) &&
//       (!q || a.title.toLowerCase().includes(q) || a.series.toLowerCase().includes(q))
//     );
//   }, [search, lang]);

//   const pages = Math.ceil(list.length / TLT_PER_PAGE);
//   const slice = list.slice((page - 1) * TLT_PER_PAGE, page * TLT_PER_PAGE);

//   return (
//     <>
//       <div className="mb-6">
//         <p className="text-white/25 text-[11px] tracking-widest uppercase mb-3">Filter by Language</p>
//         <div className="flex items-center gap-2 flex-wrap">
//           {LANGS.map(l => (
//             <button key={l} onClick={() => setLang(l)}
//               className={`px-3 py-1.5 rounded-full text-xs font-bold tracking-wide uppercase transition-all
//                 ${l === lang ? LANG_ACTIVE[l] + " shadow-lg" : "bg-white/5 text-white/35 border border-white/10 hover:bg-white/10 hover:text-white"}`}>
//               {l}
//             </button>
//           ))}
//           <span className="text-white/20 text-xs ml-1">{list.length} articles</span>
//         </div>
//       </div>

//       {slice.length === 0 ? <Empty /> : (
//         <>
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//             {slice.map(a => <TltCard key={a.id} article={a} />)}
//           </div>
//           <Pager page={page} totalPages={pages}
//             onChange={p => { setPage(p); window.scrollTo({ top: 0, behavior: "smooth" }); }} />
//         </>
//       )}
//     </>
//   );
// }

// // ═══════════════════════════════════════════════════════════════════
// //  ALL SOURCES VIEW  — preview from each
// // ═══════════════════════════════════════════════════════════════════
// function AllView({ search, onPickSource }) {
//   const PREVIEW = 6;
//   const svf = usePosts(SOURCES.svf.apiBase, { search });
//   const gurbani = usePosts(SOURCES.gurbani.apiBase, { search });

//   const tltList = useMemo(() => {
//     const q = search.toLowerCase();
//     return q ? TLT_ARTICLES.filter(a => a.title.toLowerCase().includes(q) || a.series.toLowerCase().includes(q)) : TLT_ARTICLES;
//   }, [search]);

//   const sections = [
//     { id: "svf", hook: svf },
//     { id: "gurbani", hook: gurbani },
//   ];

//   return (
//     <div className="space-y-14">
//       {sections.map(({ id, hook }) => {
//         const src = SOURCES[id];
//         const col = COLOR[src.color];
//         return (
//           <section key={id}>
//             <div className="flex items-center justify-between mb-5">
//               <div className="flex items-center gap-2.5">
//                 <span className={`w-2.5 h-2.5 rounded-full ${col.dot}`} />
//                 <h2 className="text-white/70 font-bold text-sm tracking-wide">{src.label}</h2>
//                 {hook.total > 0 && <span className="text-white/20 text-xs">{hook.total} articles</span>}
//               </div>
//               <button onClick={() => onPickSource(id)}
//                 className="text-white/25 hover:text-white text-xs transition-colors underline underline-offset-2">
//                 Browse all →
//               </button>
//             </div>

//             {hook.loading ? <Spinner label={`Loading ${src.label}…`} /> :
//               hook.error ? <ErrorBox msg={hook.error} onRetry={hook.retry} /> :
//                 !hook.posts.length ? <p className="text-white/20 text-sm">No results.</p> : (
//                   <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//                     {hook.posts.slice(0, PREVIEW).map(p => <WpCard key={p.id} post={p} sourceId={id} />)}
//                   </div>
//                 )}
//           </section>
//         );
//       })}

//       {/* TLT */}
//       <section>
//         <div className="flex items-center justify-between mb-5">
//           <div className="flex items-center gap-2.5">
//             <span className={`w-2.5 h-2.5 rounded-full ${COLOR.sky.dot}`} />
//             <h2 className="text-white/70 font-bold text-sm tracking-wide">{SOURCES.tlt.label}</h2>
//             <span className="text-white/20 text-xs">{tltList.length} articles</span>
//           </div>
//           <button onClick={() => onPickSource("tlt")}
//             className="text-white/25 hover:text-white text-xs transition-colors underline underline-offset-2">
//             Browse all →
//           </button>
//         </div>
//         {tltList.length === 0 ? <p className="text-white/20 text-sm">No results.</p> : (
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//             {tltList.slice(0, PREVIEW).map(a => <TltCard key={a.id} article={a} />)}
//           </div>
//         )}
//       </section>
//     </div>
//   );
// }

// // ═══════════════════════════════════════════════════════════════════
// //  ROOT PAGE COMPONENT
// // ═══════════════════════════════════════════════════════════════════
// const TABS = ["all", "svf", "gurbani", "tlt"];

// export default function Articles() {
//   const [active, setActive] = useState("all");
//   const [search, setSearch] = useState("");
//   const [liveSearch, setLiveSearch] = useState("");
//   const debRef = useRef(null);

//   const handleSearch = useCallback(val => {
//     setSearch(val);
//     clearTimeout(debRef.current);
//     debRef.current = setTimeout(() => setLiveSearch(val.trim()), 400);
//   }, []);

//   return (
//     <main className="min-h-screen p-6 md:p-10">
//       <div className="max-w-6xl mx-auto">

//         {/* ══ Header ══════════════════════════════════════════════ */}
//         <header className="text-center mb-12">
//           <p className="text-white/20 text-[10px] tracking-[0.45em] uppercase mb-3">Knowledge Library</p>
//           <h1 className="text-4xl md:text-5xl font-bold text-white mb-3 tracking-tight">
//             Articles &amp; Resources
//           </h1>
//           <p className="text-white/30 text-sm max-w-lg mx-auto leading-relaxed">
//             Scholarly Sikh articles from three curated sources.
//           </p>
//           <div className="flex items-center justify-center gap-5 mt-4 flex-wrap">
//             {["svf", "gurbani", "tlt"].map(id => {
//               const src = SOURCES[id];
//               return (
//                 <a key={id} href={src.siteUrl} target="_blank" rel="noopener noreferrer"
//                   className="flex items-center gap-1.5 text-white/20 hover:text-white/50 text-xs transition-colors">
//                   <span className={`w-2 h-2 rounded-full ${COLOR[src.color].dot}`} />
//                   {src.label}
//                 </a>
//               );
//             })}
//           </div>
//         </header>

//         {/* ══ Source Tabs ══════════════════════════════════════════ */}
//         <div className="flex gap-2 mb-5 overflow-x-auto pb-1 scrollbar-none">
//           {TABS.map(id => {
//             const src = SOURCES[id];
//             const col = COLOR[src.color];
//             const isActive = active === id;
//             return (
//               <button key={id} onClick={() => setActive(id)}
//                 className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold
//                             whitespace-nowrap transition-all duration-200
//                             ${isActive
//                     ? col.active + " shadow-lg"
//                     : "bg-white/5 text-white/40 border border-white/10 hover:bg-white/10 hover:text-white"}`}>
//                 {id !== "all" && <span className={`w-1.5 h-1.5 rounded-full ${col.dot} ${isActive ? "opacity-60" : ""}`} />}
//                 {src.label}
//               </button>
//             );
//           })}
//         </div>

//         {/* ══ Search ════════════════════════════════════════════════ */}
//         <div className="relative mb-8">
//           <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 pointer-events-none"></span>
//           <input
//             type="text"
//             value={search}
//             onChange={e => handleSearch(e.target.value)}
//             placeholder={`Search ${SOURCES[active].label}…`}
//             className="w-full pl-11 pr-10 py-3 rounded-xl bg-white/5 border border-white/10
//                        text-white placeholder-white/20 text-sm
//                        focus:outline-none focus:border-white/25 focus:bg-white/7 transition-all"
//           />
//           {search && (
//             <button onClick={() => handleSearch("")}
//               className="absolute right-4 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/60 transition-colors">
//               ✕
//             </button>
//           )}
//         </div>

//         {/* ══ Views ═════════════════════════════════════════════════ */}
//         {active === "all" && <AllView search={liveSearch} onPickSource={setActive} />}
//         {active === "svf" && <SvfView search={liveSearch} />}
//         {active === "gurbani" && <GurbaniView search={liveSearch} />}
//         {active === "tlt" && <TltView search={liveSearch} />}

//       </div>
//     </main>
//   );
// }


"use client"; // Remove this line if NOT using Next.js App Router

import { useState, useEffect, useCallback, useRef, useMemo } from "react";

//  SOURCES CONFIG
const SOURCES = {
  all: { id: "all", label: "All Sources", shortLabel: "All", color: "white" },
  svf: { id: "svf", label: "Sikhi Vichar Forum", shortLabel: "SVF", color: "amber", type: "wordpress", apiBase: "https://sikhivicharforum.org/wp-json/wp/v2", siteUrl: "https://sikhivicharforum.org" },
  gurbani: { id: "gurbani", label: "Gurbani Blog", shortLabel: "Gurbani", color: "emerald", type: "wordpress", apiBase: "https://www.gurbani.org/gurblog/wp-json/wp/v2", siteUrl: "https://www.gurbani.org/gurblog" },
  tlt: { id: "tlt", label: "The Living Treasure", shortLabel: "TLT", color: "sky", type: "static", siteUrl: "https://www.thelivingtreasure.com/downloadArticles.aspx" },
};

const COLOR = {
  amber: { badge: "bg-amber-400/15 text-amber-300 border-amber-400/25", dot: "bg-amber-400", active: "bg-amber-400 text-gray-900", hover: "hover:border-amber-400/40 hover:text-amber-300" },
  emerald: { badge: "bg-emerald-400/15 text-emerald-300 border-emerald-400/25", dot: "bg-emerald-400", active: "bg-emerald-400 text-gray-900", hover: "hover:border-emerald-400/40 hover:text-emerald-300" },
  sky: { badge: "bg-sky-400/15 text-sky-300 border-sky-400/25", dot: "bg-sky-400", active: "bg-sky-400 text-gray-900", hover: "hover:border-sky-400/40 hover:text-sky-300" },
  white: { badge: "bg-white/10 text-white/70 border-white/15", dot: "bg-white", active: "bg-white text-gray-900", hover: "hover:border-white/30 hover:text-white" },
};

const PER_PAGE = 12;

//  SVF TOPIC ICONS  — mapped to category slug keywords
const TOPIC_ICON = (name = "") => {
  const n = name.toLowerCase();
  if (n.includes("article")) return "📄";
  if (n.includes("history")) return "📜";
  if (n.includes("jup") || n.includes("bannee") || n.includes("bani")) return "📿";
  if (n.includes("sidh")) return "🕉️";
  if (n.includes("vichar") || n.includes("shabad") || n.includes("shabd")) return "💬";
  if (n.includes("diwan")) return "🎵";
  if (n.includes("video")) return "🎥";
  if (n.includes("bulletin") || n.includes("media") || n.includes("international")) return "🌐";
  if (n.includes("bachitr") || n.includes("dsm") || n.includes("granth")) return "📖";
  if (n.includes("faq")) return "❓";
  return "✦";
};

//  THE LIVING TREASURE  — hardcoded (ASP.NET PostBack, no public API)
const TLT_ARTICLES = [
  { id: "tlt-1", title: "Law Of Nature", lang: "English", series: "Article" },
  { id: "tlt-2", title: "Am I Lonely / Alone", lang: "English", series: "Article" },
  { id: "tlt-3", title: "Meditation", lang: "English", series: "Article" },
  { id: "tlt-4", title: "Real Spiritual Being", lang: "English", series: "Article" },
  { id: "tlt-5", title: "Offering Flowers", lang: "English", series: "Article" },
  { id: "tlt-6", title: "Harmony Withering Away", lang: "English", series: "Article" },
  { id: "tlt-7", title: "Qualities of a Righteous Mother", lang: "English", series: "Article" },
  { id: "tlt-8", title: "Aapsi Doori Kyon", lang: "Hindi", series: "Sawera" },
  { id: "tlt-9", title: "Apni Taqdeer", lang: "Hindi", series: "Sawera" },
  { id: "tlt-10", title: "Dhyan", lang: "Hindi", series: "Sawera" },
  { id: "tlt-11", title: "Ichha Poorti", lang: "Hindi", series: "Sawera" },
  { id: "tlt-12", title: "Ridhi Sidhi", lang: "Hindi", series: "Sawera" },
  { id: "tlt-13", title: "Savera", lang: "Hindi", series: "Sawera" },
  { id: "tlt-14", title: "Vigyan Aur Dharam", lang: "Hindi", series: "Sawera" },
  { id: "tlt-15", title: "Maa Pio Tay Bachay", lang: "Punjabi", series: "Dil Noo Dilaan Dee Raah" },
  { id: "tlt-16", title: "Manukhaan Dee Aapsee Dooree Kyon", lang: "Punjabi", series: "Dil Noo Dilaan Dee Raah" },
  { id: "tlt-17", title: "Manukhtaa Bharpoor Vyaah", lang: "Punjabi", series: "Dil Noo Dilaan Dee Raah" },
  { id: "tlt-18", title: "Pyaar", lang: "Punjabi", series: "Dil Noo Dilaan Dee Raah" },
  { id: "tlt-19", title: "Pyaar Vyaah", lang: "Punjabi", series: "Dil Noo Dilaan Dee Raah" },
  { id: "tlt-20", title: "Question Answer", lang: "Punjabi", series: "Dil Noo Dilaan Dee Raah" },
  { id: "tlt-21", title: "Saaday Bachay Saaday Varis", lang: "Punjabi", series: "Dil Noo Dilaan Dee Raah" },
  { id: "tlt-22", title: "Science, Padarthvaad Atay Bachay", lang: "Punjabi", series: "Dil Noo Dilaan Dee Raah" },
  { id: "tlt-23", title: "Ik Onkaar", lang: "Punjabi", series: "Rabbi Gunn" },
  { id: "tlt-24", title: "Ajoonee", lang: "Punjabi", series: "Rabbi Gunn" },
  { id: "tlt-25", title: "Akaal Murat", lang: "Punjabi", series: "Rabbi Gunn" },
  { id: "tlt-26", title: "Nirbhau", lang: "Punjabi", series: "Rabbi Gunn" },
  { id: "tlt-27", title: "Nirvair", lang: "Punjabi", series: "Rabbi Gunn" },
  { id: "tlt-28", title: "Saibhang", lang: "Punjabi", series: "Rabbi Gunn" },
  { id: "tlt-29", title: "Satnaam", lang: "Punjabi", series: "Rabbi Gunn" },
  { id: "tlt-30", title: "Gurprasaad", lang: "Punjabi", series: "Rabbi Gunn" },
  { id: "tlt-31", title: "Kartaa Purakh", lang: "Punjabi", series: "Rabbi Gunn" },
  { id: "tlt-32", title: "Ardaas", lang: "Punjabi", series: "Viraasat" },
  { id: "tlt-33", title: "Gurdwara", lang: "Punjabi", series: "Viraasat" },
  { id: "tlt-34", title: "Kadah Prashaad", lang: "Punjabi", series: "Viraasat" },
  { id: "tlt-35", title: "Langar", lang: "Punjabi", series: "Viraasat" },
  { id: "tlt-36", title: "Matha Teknaa", lang: "Punjabi", series: "Viraasat" },
  { id: "tlt-37", title: "Sewaa", lang: "Punjabi", series: "Viraasat" },
  { id: "tlt-38", title: "Guru Kaun Hunda Hai", lang: "Punjabi", series: "Viraasat" },
  { id: "tlt-39", title: "Sarovar", lang: "Punjabi", series: "Viraasat" },
  { id: "tlt-40", title: "Satsangat Atay Charan", lang: "Punjabi", series: "Viraasat" },
  { id: "tlt-41", title: "Poota Mata Kee Asees", lang: "Punjabi", series: "Jiwan Jach Da Khazanna" },
  { id: "tlt-42", title: "Harjan Rakhay", lang: "Punjabi", series: "Jiwan Jach Da Khazanna" },
  { id: "tlt-43", title: "Satgur Puro Bhetya", lang: "Punjabi", series: "Jiwan Jach Da Khazanna" },
];

//  SORT OPTIONS CONFIG
// ─────────────────────────────────────────────────────────────────
// "orderby" and "order" map directly to WP REST API params.
// For TLT (static), we handle sorting client-side in useMemo.
// For AllView "Sort by Source", we reorder the sections array.
// ─────────────────────────────────────────────────────────────────
const SORT_OPTIONS = [
  // ── Sort Articles ──
  { group: "Sort Articles", value: "title-asc", label: "Title: A to Z", icon: "↑", orderby: "title", order: "asc" },
  { group: "Sort Articles", value: "title-desc", label: "Title: Z to A", icon: "↓", orderby: "title", order: "desc" },
  { group: "Sort Articles", value: "date-desc", label: "Date Published: Newest First", icon: "⇣", orderby: "date", order: "desc" },
  { group: "Sort Articles", value: "date-asc", label: "Date Published: Oldest First", icon: "⇡", orderby: "date", order: "asc" },
  // ── Sort by Source ──
  { group: "Sort by Source", value: "source-asc", label: "Source Name: A to Z", icon: "↑", sourceSort: "name-asc" },
  { group: "Sort by Source", value: "source-desc", label: "Source Name: Z to A", icon: "↓", sourceSort: "name-desc" },
  { group: "Sort by Source", value: "source-date-desc", label: "Source Date: Newest First", icon: "⇣", sourceSort: "date-desc" },
  { group: "Sort by Source", value: "source-date-asc", label: "Source Date: Oldest First", icon: "⇡", sourceSort: "date-asc" },
];

const DEFAULT_SORT = "date-desc";

//  UTILITIES
const strip = (h = "") => h.replace(/<[^>]*>/g, "").replace(/&[a-z#0-9]+;/gi, " ").trim();
const fmtDate = (d) => d ? new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }) : "";
const proxyUrl = (u) => `https://corsproxy.io/?${encodeURIComponent(u)}`;

async function wpGet(url) {
  for (const ep of [url, proxyUrl(url)]) {
    try {
      const r = await fetch(ep);
      if (!r.ok) continue;
      return {
        data: await r.json(),
        total: +(r.headers.get("X-WP-Total") ?? 0),
        totalPages: +(r.headers.get("X-WP-TotalPages") ?? 1),
      };
    } catch (_) { /* try proxy */ }
  }
  throw new Error("Could not reach API. Check network or CORS proxy.");
}

function buildUrl(base, params = {}) {
  const u = new URL(base);
  Object.entries(params).forEach(([k, v]) => v != null && v !== "" && u.searchParams.set(k, String(v)));
  return u.toString();
}

//  HOOKS

/** Fetch WP categories for a given site */
function useCats(apiBase) {
  const [cats, setCats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    wpGet(buildUrl(`${apiBase}/categories`, { per_page: 50, orderby: "count", order: "desc", _fields: "id,name,slug,count,parent" }))
      .then(({ data }) => setCats(data.filter(c => c.count > 0)))
      .catch(() => setCats([]))
      .finally(() => setLoading(false));
  }, [apiBase]);

  return { cats, loading };
}

/** Fetch WP posts — now accepts orderby + order for server-side sorting */
function usePosts(apiBase, { page = 1, categoryId = null, search = "", orderby = "date", order = "desc" } = {}) {
  const [posts, setPosts] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tick, setTick] = useState(0);
  const retry = useCallback(() => setTick(t => t + 1), []);

  useEffect(() => {
    setLoading(true); setError(null);
    wpGet(buildUrl(`${apiBase}/posts`, {
      per_page: PER_PAGE,
      page,
      categories: categoryId || undefined,
      search: search || undefined,
      orderby,
      order,
      _fields: "id,title,link,date,excerpt,categories",
    }))
      .then(({ data, total: t, totalPages: tp }) => { setPosts(data); setTotal(t); setTotalPages(tp); })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [apiBase, page, categoryId, search, orderby, order, tick]);

  return { posts, total, totalPages, loading, error, retry };
}

// ═══════════════════════════════════════════════════════════════════
//  SORT DROPDOWN  ← NEW COMPONENT
// ═══════════════════════════════════════════════════════════════════

/**
 * SortDropdown
 * Props:
 *   value       – current sort value string (e.g. "date-desc")
 *   onChange    – (value) => void
 *   hideSource  – bool: hide the "Sort by Source" group (for single-source tabs)
 */
function SortDropdown({ value, onChange, hideSource = false }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  // Close on outside click
  useEffect(() => {
    function handler(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const current = SORT_OPTIONS.find(o => o.value === value) ?? SORT_OPTIONS[2];

  // Build groups to render
  const groups = useMemo(() => {
    const opts = hideSource
      ? SORT_OPTIONS.filter(o => o.group === "Sort Articles")
      : SORT_OPTIONS;
    return ["Sort Articles", "Sort by Source"]
      .filter(g => !hideSource || g === "Sort Articles")
      .map(g => ({ group: g, options: opts.filter(o => o.group === g) }));
  }, [hideSource]);

  return (
    <div ref={ref} className="relative flex-shrink-0">
      {/* Trigger button */}
      <button
        onClick={() => setOpen(o => !o)}
        className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold
                    border transition-all duration-200 whitespace-nowrap
                    ${open
            ? "bg-white/12 border-white/25 text-white"
            : "bg-white/5 border-white/10 text-white/50 hover:bg-white/8 hover:border-white/20 hover:text-white/80"
          }`}
      >
        {/* Sort icon (two lines with arrow) */}
        <svg width="15" height="15" viewBox="0 0 15 15" fill="none" className="flex-shrink-0 opacity-70">
          <path d="M2 4h11M2 7.5h7M2 11h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M11 7v6m0 0-2-2m2 2 2-2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span className="hidden sm:inline">Sort</span>
        {/* Active indicator dot */}
        {value !== DEFAULT_SORT && (
          <span className="w-1.5 h-1.5 rounded-full bg-white/60 flex-shrink-0" />
        )}
        {/* Chevron */}
        <svg
          width="10" height="10" viewBox="0 0 10 10" fill="none"
          className={`flex-shrink-0 opacity-40 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        >
          <path d="M2 3.5l3 3 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {/* Dropdown panel — matches the iOS-style frosted card in the screenshot */}
      {open && (
        <div
          className="absolute right-0 top-[calc(100%+8px)] z-50 w-72
                     rounded-2xl border border-white/12
                     shadow-2xl shadow-black/60"
          style={{
            background: "rgba(18, 24, 38, 0.92)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
          }}
        >
          {groups.map((grp, gi) => (
            <div key={grp.group}>
              {/* Group header */}
              <p className={`px-5 pt-4 pb-2 text-[11px] font-bold tracking-widest uppercase text-white/35
                             ${gi > 0 ? "border-t border-white/8 mt-1" : ""}`}>
                {grp.group}
              </p>

              {/* Options */}
              {grp.options.map(opt => {
                const isActive = opt.value === value;
                return (
                  <button
                    key={opt.value}
                    onClick={() => { onChange(opt.value); setOpen(false); }}
                    className={`w-full flex items-center justify-between px-5 py-2.5
                                text-sm transition-colors duration-150
                                ${isActive
                        ? "text-white"
                        : "text-white/45 hover:text-white/80 hover:bg-white/5"
                      }`}
                  >
                    <span className="flex items-center gap-3">
                      {/* Checkmark for active */}
                      <span className={`w-4 text-center text-xs ${isActive ? "text-white opacity-100" : "opacity-0"}`}>
                        ✓
                      </span>
                      {opt.label}
                    </span>
                    {/* Sort direction icon — shown for date sorts */}
                    {(opt.value.includes("date")) && (
                      <span className="text-white/25 text-base flex-shrink-0 ml-2">
                        {opt.order === "desc" || opt.sourceSort === "date-desc" ? (
                          // Lines-down icon
                          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                            <path d="M2 4h9M2 8h6M2 12h3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                            <path d="M14 4v10m0 0-2.5-2.5M14 14l2.5-2.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        ) : (
                          // Lines-up icon
                          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                            <path d="M2 4h9M2 8h6M2 12h3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                            <path d="M14 14V4m0 0-2.5 2.5M14 4l2.5 2.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </span>
                    )}
                  </button>
                );
              })}

              {/* Bottom padding after last group */}
              {gi === groups.length - 1 && <div className="h-2" />}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
//  TINY UI ATOMS
// ═══════════════════════════════════════════════════════════════════
function Dot({ color, size = 1.5 }) {
  const sz = `w-${size} h-${size}`;
  return <span className={`inline-block rounded-full flex-shrink-0 ${sz} ${COLOR[color]?.dot ?? "bg-white"}`} />;
}

function Badge({ children, className = "" }) {
  return <span className={`text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-full border ${className}`}>{children}</span>;
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
      <p className="text-red-400/70 mb-1">⚠ Could not load articles</p>
      <p className="text-white/25 text-sm mb-4 max-w-xs mx-auto">{msg}</p>
      {onRetry && <button onClick={onRetry} className="px-4 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white/50 hover:text-white text-xs transition-all">Retry</button>}
    </div>
  );
}

function Empty() {
  return (
    <div className="text-center py-20 space-y-2">
      <p className="text-4xl">🔍</p>
      <p className="text-white/40">No articles found</p>
      <p className="text-white/20 text-sm">Try a different search or topic.</p>
    </div>
  );
}

function Pager({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null;
  const win = [];
  for (let i = Math.max(1, page - 2); i <= Math.min(totalPages, page + 2); i++) win.push(i);
  const base = "px-3 py-1.5 rounded-lg text-xs transition-all";
  const ghost = `${base} text-white/40 bg-white/5 border border-white/10 hover:text-white hover:bg-white/10`;
  const off = `${base} text-white/15 bg-white/3 border border-white/5 cursor-not-allowed`;
  const on = `${base} bg-white text-gray-900 font-bold`;
  return (
    <div className="flex items-center justify-center gap-1.5 mt-10 flex-wrap">
      <button onClick={() => onChange(page - 1)} disabled={page === 1} className={page === 1 ? off : ghost}> ← Prev </button>
      {win[0] > 1 && <><button onClick={() => onChange(1)} className={ghost}>1</button>       {win[0] > 2 && <span className="text-white/20 text-xs">…</span>}</>}
      {win.map(p => <button key={p} onClick={() => onChange(p)} className={p === page ? on : ghost}>{p}</button>)}
      {win.at(-1) < totalPages && <>{win.at(-1) < totalPages - 1 && <span className="text-white/20 text-xs">…</span>}<button onClick={() => onChange(totalPages)} className={ghost}>{totalPages}</button></>}
      <button onClick={() => onChange(page + 1)} disabled={page === totalPages} className={page === totalPages ? off : ghost}> Next → </button>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
//  SHARED CARDS
// ═══════════════════════════════════════════════════════════════════
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
        <Dot color={src.color} size={1.5} />
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
        <Dot color="sky" size={1.5} />
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

// ═══════════════════════════════════════════════════════════════════
//  SVF VIEW  — topic browser + filtered post list
// ═══════════════════════════════════════════════════════════════════

/** Topic "card" shown in the browse grid */
function TopicCard({ cat, onClick }) {
  const icon = TOPIC_ICON(cat.name);
  return (
    <button onClick={onClick}
      className="group flex items-start gap-4 p-4 rounded-2xl text-left w-full
                 bg-white/5 border border-white/10
                 hover:bg-amber-400/8 hover:border-amber-400/30
                 transition-all duration-200 hover:-translate-y-0.5">
      <span className="text-2xl flex-shrink-0 mt-0.5">{icon}</span>
      <div className="min-w-0">
        <p className="text-white/80 font-semibold text-sm leading-snug group-hover:text-amber-300 transition-colors line-clamp-2">
          {cat.name}
        </p>
        <p className="text-white/25 text-xs mt-1">{cat.count} articles</p>
      </div>
    </button>
  );
}

/** Post list once a topic is selected */
function SvfPostList({ cat, search, orderby, order }) {
  const [page, setPage] = useState(1);
  useEffect(() => setPage(1), [cat?.id, search, orderby, order]);

  const { posts, total, totalPages, loading, error, retry } = usePosts(
    SOURCES.svf.apiBase,
    { page, categoryId: cat?.id ?? null, search, orderby, order }
  );

  const onPage = (p) => { setPage(p); window.scrollTo({ top: 0, behavior: "smooth" }); };

  return (
    <>
      {total > 0 && !loading && (
        <p className="text-white/20 text-xs mb-5">{total} articles</p>
      )}
      {loading ? <Spinner /> :
        error ? <ErrorBox msg={error} onRetry={retry} /> :
          !posts.length ? <Empty /> : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {posts.map(p => <WpCard key={p.id} post={p} sourceId="svf" />)}
              </div>
              <Pager page={page} totalPages={totalPages} onChange={onPage} />
            </>
          )}
    </>
  );
}

function SvfView({ search, orderby, order }) {
  const { cats, loading: catsLoading } = useCats(SOURCES.svf.apiBase);
  const [activeCat, setActiveCat] = useState(null); // null = show topic grid

  // Reset topic if search changes
  useEffect(() => { setActiveCat(null); }, [search]);

  // ─ Topic browser ─
  if (!activeCat && !search) {
    return (
      <div>
        <p className="text-white/30 text-xs mb-6 tracking-wide">
          Select a topic to browse articles, or use the search bar above.
        </p>

        {catsLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="h-20 rounded-2xl bg-white/5 animate-pulse" />
            ))}
          </div>
        ) : (
          <>
            {/* "All Articles" shortcut */}
            <button onClick={() => setActiveCat({ id: null, name: "All Articles", count: cats.reduce((s, c) => s + c.count, 0) })}
              className="group flex items-center gap-3 w-full p-4 rounded-2xl mb-3
                         bg-amber-400/10 border border-amber-400/25
                         hover:bg-amber-400/15 hover:border-amber-400/50 transition-all">
              <span className="text-2xl">✦</span>
              <div className="text-left">
                <p className="text-amber-300 font-bold text-sm">All Articles</p>
                <p className="text-amber-300/40 text-xs">{cats.reduce((s, c) => s + c.count, 0)} total</p>
              </div>
            </button>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {cats.map(cat => (
                <TopicCard key={cat.id} cat={cat} onClick={() => setActiveCat(cat)} />
              ))}
            </div>
          </>
        )}
      </div>
    );
  }

  // ─ Post list for a chosen topic (or when searching) ─
  return (
    <div>
      {/* Breadcrumb / back button */}
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => setActiveCat(null)}
          className="flex items-center gap-1.5 text-white/35 hover:text-white text-xs transition-colors">
          ← Topics
        </button>
        {activeCat && (
          <>
            <span className="text-white/15 text-xs">/</span>
            <span className="flex items-center gap-1.5 text-amber-300/80 text-xs font-semibold">
              <span>{TOPIC_ICON(activeCat.name)}</span>
              {activeCat.name}
            </span>
          </>
        )}
        {search && !activeCat && (
          <>
            <span className="text-white/15 text-xs">/</span>
            <span className="text-white/50 text-xs">Search: "{search}"</span>
          </>
        )}
      </div>

      <SvfPostList
        cat={activeCat?.id !== undefined ? activeCat : null}
        search={search}
        orderby={orderby}
        order={order}
      />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
//  GURBANI BLOG VIEW  — category filter pills + post list
// ═══════════════════════════════════════════════════════════════════
function GurbaniView({ search, orderby, order }) {
  const { cats, loading: catsLoading } = useCats(SOURCES.gurbani.apiBase);
  const [activeCat, setActiveCat] = useState(null); // null = All
  const [page, setPage] = useState(1);

  useEffect(() => setPage(1), [activeCat, search, orderby, order]);

  const { posts, total, totalPages, loading, error, retry } = usePosts(
    SOURCES.gurbani.apiBase,
    { page, categoryId: activeCat?.id ?? null, search, orderby, order }
  );

  const onPage = (p) => { setPage(p); window.scrollTo({ top: 0, behavior: "smooth" }); };

  return (
    <div>
      {/* ── Category filter pills ── */}
      <div className="mb-6">
        <p className="text-white/25 text-[11px] tracking-widest uppercase mb-3">Filter by Category</p>
        <div className="flex flex-wrap gap-2">
          {/* All */}
          <button onClick={() => setActiveCat(null)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all
              ${!activeCat
                ? "bg-emerald-400 text-gray-900 shadow-lg shadow-emerald-400/20"
                : "bg-white/5 text-white/40 border border-white/10 hover:bg-white/10 hover:text-white"}`}>
            All
            {total > 0 && !activeCat && <span className="opacity-60 text-[10px]">({total})</span>}
          </button>

          {catsLoading
            ? Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-7 w-24 rounded-full bg-white/5 animate-pulse" />
            ))
            : cats.map(cat => {
              const isActive = activeCat?.id === cat.id;
              return (
                <button key={cat.id} onClick={() => setActiveCat(cat)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all
                      ${isActive
                      ? "bg-emerald-400 text-gray-900 shadow-lg shadow-emerald-400/20"
                      : "bg-white/5 text-white/40 border border-white/10 hover:bg-white/10 hover:text-white"}`}>
                  {cat.name}
                  <span className={`text-[10px] ${isActive ? "opacity-60 text-gray-900" : "text-white/25"}`}>
                    ({cat.count})
                  </span>
                </button>
              );
            })
          }
        </div>

        {/* Active filter label */}
        {activeCat && (
          <p className="text-white/25 text-xs mt-3">
            Showing: <span className="text-emerald-300/80">{activeCat.name}</span>
            {total > 0 && !loading && <span className="ml-1">— {total} articles</span>}
            <button onClick={() => setActiveCat(null)}
              className="ml-3 text-white/20 hover:text-white/60 underline underline-offset-2 transition-colors">
              Clear
            </button>
          </p>
        )}
      </div>

      {/* ── Posts ── */}
      {loading ? <Spinner /> :
        error ? <ErrorBox msg={error} onRetry={retry} /> :
          !posts.length ? <Empty /> : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {posts.map(p => <WpCard key={p.id} post={p} sourceId="gurbani" />)}
              </div>
              <Pager page={page} totalPages={totalPages} onChange={onPage} />
            </>
          )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
//  THE LIVING TREASURE VIEW  — language filter + pagination
// ═══════════════════════════════════════════════════════════════════
const TLT_PER_PAGE = 18;
const LANGS = ["All", "English", "Hindi", "Punjabi"];
const LANG_ACTIVE = { All: "bg-white text-gray-900", English: "bg-violet-400 text-gray-900", Hindi: "bg-orange-400 text-gray-900", Punjabi: "bg-teal-400 text-gray-900" };

function TltView({ search, sortValue }) {
  const [lang, setLang] = useState("All");
  const [page, setPage] = useState(1);
  useEffect(() => setPage(1), [search, lang, sortValue]);

  const list = useMemo(() => {
    const q = search.toLowerCase();
    let filtered = TLT_ARTICLES.filter(a =>
      (lang === "All" || a.lang === lang) &&
      (!q || a.title.toLowerCase().includes(q) || a.series.toLowerCase().includes(q))
    );

    // Client-side sort for static TLT data
    if (sortValue === "title-asc") filtered = [...filtered].sort((a, b) => a.title.localeCompare(b.title));
    if (sortValue === "title-desc") filtered = [...filtered].sort((a, b) => b.title.localeCompare(a.title));
    // TLT has no dates, so date sorts fall back to default order

    return filtered;
  }, [search, lang, sortValue]);

  const pages = Math.ceil(list.length / TLT_PER_PAGE);
  const slice = list.slice((page - 1) * TLT_PER_PAGE, page * TLT_PER_PAGE);

  return (
    <>
      <div className="mb-6">
        <p className="text-white/25 text-[11px] tracking-widest uppercase mb-3">Filter by Language</p>
        <div className="flex items-center gap-2 flex-wrap">
          {LANGS.map(l => (
            <button key={l} onClick={() => setLang(l)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold tracking-wide uppercase transition-all
                ${l === lang ? LANG_ACTIVE[l] + " shadow-lg" : "bg-white/5 text-white/35 border border-white/10 hover:bg-white/10 hover:text-white"}`}>
              {l}
            </button>
          ))}
          <span className="text-white/20 text-xs ml-1">{list.length} articles</span>
        </div>
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

// ═══════════════════════════════════════════════════════════════════
//  ALL SOURCES VIEW  — preview from each
// ═══════════════════════════════════════════════════════════════════

// Source order for AllView — used by "Sort by Source" options
const ALL_SOURCE_IDS = ["svf", "gurbani", "tlt"];

function AllView({ search, onPickSource, orderby, order, sortValue }) {
  const PREVIEW = 6;
  const svf = usePosts(SOURCES.svf.apiBase, { search, orderby, order });
  const gurbani = usePosts(SOURCES.gurbani.apiBase, { search, orderby, order });

  const tltList = useMemo(() => {
    const q = search.toLowerCase();
    let filtered = q
      ? TLT_ARTICLES.filter(a => a.title.toLowerCase().includes(q) || a.series.toLowerCase().includes(q))
      : TLT_ARTICLES;
    if (sortValue === "title-asc") filtered = [...filtered].sort((a, b) => a.title.localeCompare(b.title));
    if (sortValue === "title-desc") filtered = [...filtered].sort((a, b) => b.title.localeCompare(a.title));
    return filtered;
  }, [search, sortValue]);

  // Determine source display order based on "Sort by Source" options
  const sourceOrder = useMemo(() => {
    const opt = SORT_OPTIONS.find(o => o.value === sortValue);
    if (!opt?.sourceSort) return ALL_SOURCE_IDS; // default order
    if (opt.sourceSort === "name-asc") return [...ALL_SOURCE_IDS].sort((a, b) => SOURCES[a].label.localeCompare(SOURCES[b].label));
    if (opt.sourceSort === "name-desc") return [...ALL_SOURCE_IDS].sort((a, b) => SOURCES[b].label.localeCompare(SOURCES[a].label));
    // date sorts: SVF and Gurbani are real-time from API, TLT has no dates
    // for date-desc: dynamic sources first, TLT last; for date-asc: TLT first
    if (opt.sourceSort === "date-desc") return ["svf", "gurbani", "tlt"];
    if (opt.sourceSort === "date-asc") return ["tlt", "svf", "gurbani"];
    return ALL_SOURCE_IDS;
  }, [sortValue]);

  const wpHooks = { svf, gurbani };

  return (
    <div className="space-y-14">
      {sourceOrder.map(id => {
        const src = SOURCES[id];
        const col = COLOR[src.color];

        // ── TLT section ──
        if (id === "tlt") {
          return (
            <section key="tlt">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2.5">
                  <span className={`w-2.5 h-2.5 rounded-full ${COLOR.sky.dot}`} />
                  <h2 className="text-white/70 font-bold text-sm tracking-wide">{SOURCES.tlt.label}</h2>
                  <span className="text-white/20 text-xs">{tltList.length} articles</span>
                </div>
                <button onClick={() => onPickSource("tlt")}
                  className="text-white/25 hover:text-white text-xs transition-colors underline underline-offset-2">
                  Browse all →
                </button>
              </div>
              {tltList.length === 0 ? <p className="text-white/20 text-sm">No results.</p> : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {tltList.slice(0, PREVIEW).map(a => <TltCard key={a.id} article={a} />)}
                </div>
              )}
            </section>
          );
        }

        // ── WP sections (SVF / Gurbani) ──
        const hook = wpHooks[id];
        return (
          <section key={id}>
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2.5">
                <span className={`w-2.5 h-2.5 rounded-full ${col.dot}`} />
                <h2 className="text-white/70 font-bold text-sm tracking-wide">{src.label}</h2>
                {hook.total > 0 && <span className="text-white/20 text-xs">{hook.total} articles</span>}
              </div>
              <button onClick={() => onPickSource(id)}
                className="text-white/25 hover:text-white text-xs transition-colors underline underline-offset-2">
                Browse all →
              </button>
            </div>

            {hook.loading ? <Spinner label={`Loading ${src.label}…`} /> :
              hook.error ? <ErrorBox msg={hook.error} onRetry={hook.retry} /> :
                !hook.posts.length ? <p className="text-white/20 text-sm">No results.</p> : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {hook.posts.slice(0, PREVIEW).map(p => <WpCard key={p.id} post={p} sourceId={id} />)}
                  </div>
                )}
          </section>
        );
      })}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
//  ROOT PAGE COMPONENT
// ═══════════════════════════════════════════════════════════════════
const TABS = ["all", "svf", "gurbani", "tlt"];

export default function Articles() {
  const [active, setActive] = useState("all");
  const [search, setSearch] = useState("");
  const [liveSearch, setLiveSearch] = useState("");
  const [sortValue, setSortValue] = useState(DEFAULT_SORT);
  const debRef = useRef(null);

  const handleSearch = useCallback(val => {
    setSearch(val);
    clearTimeout(debRef.current);
    debRef.current = setTimeout(() => setLiveSearch(val.trim()), 400);
  }, []);

  // Derive WP API params from sortValue
  const activeSortOpt = SORT_OPTIONS.find(o => o.value === sortValue) ?? SORT_OPTIONS[2];
  const orderby = activeSortOpt.orderby ?? "date";
  const order = activeSortOpt.order ?? "desc";

  // "Sort by Source" options only make sense in AllView
  const hideSourceSort = active !== "all";

  return (
    <main className="min-h-screen p-6 md:p-10">
      <div className="max-w-6xl mx-auto">

        {/* ══ Header ══════════════════════════════════════════════ */}
        <header className="text-center mb-12">
          <p className="text-white/20 text-[10px] tracking-[0.45em] uppercase mb-3">Knowledge Library</p>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-3 tracking-tight">
            Articles &amp; Resources
          </h1>
          <p className="text-white/30 text-sm max-w-lg mx-auto leading-relaxed">
            Scholarly Sikh articles from three curated sources.
          </p>
          <div className="flex items-center justify-center gap-5 mt-4 flex-wrap">
            {["svf", "gurbani", "tlt"].map(id => {
              const src = SOURCES[id];
              return (
                <a key={id} href={src.siteUrl} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-white/20 hover:text-white/50 text-xs transition-colors">
                  <span className={`w-2 h-2 rounded-full ${COLOR[src.color].dot}`} />
                  {src.label}
                </a>
              );
            })}
          </div>
        </header>

        {/* ══ Source Tabs ══════════════════════════════════════════ */}
        <div className="flex gap-2 mb-5 overflow-x-auto pb-1 scrollbar-none">
          {TABS.map(id => {
            const src = SOURCES[id];
            const col = COLOR[src.color];
            const isActive = active === id;
            return (
              <button key={id} onClick={() => setActive(id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold
                            whitespace-nowrap transition-all duration-200
                            ${isActive
                    ? col.active + " shadow-lg"
                    : "bg-white/5 text-white/40 border border-white/10 hover:bg-white/10 hover:text-white"}`}>
                {id !== "all" && <span className={`w-1.5 h-1.5 rounded-full ${col.dot} ${isActive ? "opacity-60" : ""}`} />}
                {src.label}
              </button>
            );
          })}
        </div>

        {/* ══ Search + Sort Row ═══════════════════════════════════ */}
        <div className="flex gap-3 mb-8 items-center">
          {/* Search input */}
          <div className="relative flex-1">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 pointer-events-none">🔍</span>
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
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/60 transition-colors">
                ✕
              </button>
            )}
          </div>

          {/* Sort dropdown — sits right of search */}
          <SortDropdown
            value={sortValue}
            onChange={setSortValue}
            hideSource={hideSourceSort}
          />
        </div>

        {/* ══ Views ═════════════════════════════════════════════════ */}
        {active === "all" && (
          <AllView
            search={liveSearch}
            onPickSource={setActive}
            orderby={orderby}
            order={order}
            sortValue={sortValue}
          />
        )}
        {active === "svf" && (
          <SvfView
            search={liveSearch}
            orderby={orderby}
            order={order}
          />
        )}
        {active === "gurbani" && (
          <GurbaniView
            search={liveSearch}
            orderby={orderby}
            order={order}
          />
        )}
        {active === "tlt" && (
          <TltView
            search={liveSearch}
            sortValue={sortValue}
          />
        )}

      </div>
    </main>
  );
}