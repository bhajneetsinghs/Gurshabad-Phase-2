import { Link } from "react-router-dom";

const videos = [
    {
        title: "Hijacking of Sikhi - Part 1",
        youtube: "https://www.youtube.com/watch?v=VIDEO_ID_1",
    },
    {
        title: "Hijacking of Sikhi - Part 2",
        youtube: "https://www.youtube.com/watch?v=VIDEO_ID_2",
    },
];

export default function Playlist() {
    return (
        <div
            className="max-w-[min(1200px,92vw)] mx-auto px-4 pb-16"
            style={{ paddingTop: "2rem" }}
        >
            <Link
                to="/courses/channel/sikhi-vichar"
                className="text-white/50 text-sm"
            >
                ← Back
            </Link>

            <h1 className="text-white font-bold mb-8 mt-4 text-2xl text-center">
                Hijacking of Sikhi
            </h1>

            {/* Guided Walkthrough */}
            <div
                className="grid gap-4 justify-center mb-8"
                style={{
                    gridTemplateColumns:
                        "repeat(auto-fill, minmax(260px, 1fr))",
                }}
            >
                <div className="w-full max-w-[320px] mx-auto px-5 py-4 rounded-[18px]
                        border border-white/20 bg-white/[0.08] text-white">
                    Guided Walkthrough
                </div>
            </div>

            {/* Video tiles */}
            <div
                className="grid gap-4 justify-center"
                style={{
                    gridTemplateColumns:
                        "repeat(auto-fill, minmax(260px, 1fr))",
                }}
            >
                {videos.map((v, i) => (
                    <a
                        key={i}
                        href={v.youtube}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group text-left w-full max-w-[320px] mx-auto relative px-5 py-4 rounded-[18px]
                       border border-white/20 hover:border-white/35
                       bg-white/[0.08] hover:bg-white/[0.14]
                       backdrop-blur-md
                       shadow-[0_6px_22px_rgba(0,0,0,0.20)]
                       hover:shadow-[0_10px_28px_rgba(0,0,0,0.28)]
                       hover:-translate-y-0.5 transition-all duration-200"
                    >
                        <span className="block text-white font-semibold">
                            {v.title}
                        </span>

                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 group-hover:text-white/50 transition">
                            ›
                        </span>
                    </a>
                ))}
            </div>
        </div>
    );
}