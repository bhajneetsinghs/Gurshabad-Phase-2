import { useNavigate, useParams, Link } from "react-router-dom";

export default function Channel() {
    const navigate = useNavigate();
    const { channelId } = useParams();

    return (
        <div
            className="max-w-[min(1200px,92vw)] mx-auto px-4 pb-16"
            style={{ paddingTop: "2rem" }}
        >
            <Link to="/courses" className="text-white/50 text-sm">
                ← Courses
            </Link>

            <h1 className="text-white font-bold mb-8 mt-4 text-2xl text-center">
                Sikhi Vichar Forum
            </h1>

            <div
                className="grid gap-4 justify-center"
                style={{
                    gridTemplateColumns:
                        "repeat(auto-fill, minmax(260px, 1fr))",
                }}
            >
                <Tile
                    title="Hijacking of Sikhi"
                    onClick={() =>
                        navigate(
                            `/courses/channel/${channelId}/playlist/hijacking-of-sikhi`
                        )
                    }
                />
            </div>
        </div>
    );
}

function Tile({ title, onClick }) {
    return (
        <button
            onClick={onClick}
            className="group text-left w-full max-w-[320px] mx-auto relative px-5 py-4 rounded-[18px]
                 border border-white/20 hover:border-white/35
                 bg-white/[0.08] hover:bg-white/[0.14]
                 backdrop-blur-md
                 shadow-[0_6px_22px_rgba(0,0,0,0.20)]
                 hover:shadow-[0_10px_28px_rgba(0,0,0,0.28)]
                 hover:-translate-y-0.5 transition-all duration-200"
        >
            <span className="text-white font-semibold">{title}</span>

            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 group-hover:text-white/50 transition">
                ›
            </span>
        </button>
    );
}