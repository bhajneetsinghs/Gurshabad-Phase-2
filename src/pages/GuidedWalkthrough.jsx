import { Link, useParams } from "react-router-dom";

export default function GuidedWalkthrough() {
    const { channelId, playlistId } = useParams();

    return (
        <div className="max-w-[min(1200px,92vw)] mx-auto px-4 pb-16 pt-8">
            <Link
                to={`/courses/channel/${channelId}/playlist/${playlistId}`}
                className="text-white/50 text-sm"
            >
                ← Back
            </Link>

            <h1 className="text-white font-bold mb-8 mt-4 text-2xl text-center">
                Guided Walkthrough
            </h1>

            {/* content goes here */}
        </div>
    );
}