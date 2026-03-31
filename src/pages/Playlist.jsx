// import { useEffect, useState } from "react";
// import { useParams, Link } from "react-router-dom";
// import Tile from "../components/Tile";

// export default function Playlist() {
//     const { channelId, playlistId } = useParams();
//     const [playlist, setPlaylist] = useState(null);

//     useEffect(() => {
//         fetch("/data/youtube-courses.json")
//             .then((r) => r.json())
//             .then((data) => {
//                 const channel = data.find((c) => c.id === channelId);
//                 const pl = channel?.playlists.find((p) => p.id === playlistId);
//                 setPlaylist(pl);
//             });
//     }, [channelId, playlistId]);

//     if (!playlist) return null;

//     return (
//         <div className="max-w-[min(1200px,92vw)] mx-auto px-4 pb-16 pt-8">
//             <Link to={`/courses/channel/${channelId}`} className="text-white/50 text-sm">
//                 ← Back
//             </Link>

//             <h1 className="text-white font-bold mb-8 mt-4 text-2xl text-center">
//                 {playlist.title}
//             </h1>

//             <div className="grid gap-4 mb-6"
//                 style={{ gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))" }}
//             >
//                 {playlist.guided && (
//                     <Tile title="Guided Walkthrough" />
//                 )}

//                 {playlist.videos.map((v, i) => (
//                     <Tile
//                         key={i}
//                         title={v.title}
//                         subtitle={`Video ${i + 1}`}
//                         href={v.youtube}
//                     />
//                 ))}
//             </div>
//         </div>
//     );
// }


import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Tile from "../components/Tile";

export default function Playlist() {
    const { channelId, playlistId } = useParams();
    const [playlist, setPlaylist] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetch("/data/youtube-courses.json")
            .then((r) => r.json())
            .then((data) => {
                const channel = data.find((c) => c.id === channelId);
                const pl = channel?.playlists.find((p) => p.id === playlistId);
                setPlaylist(pl);
            });
    }, [channelId, playlistId]);

    if (!playlist) return null;

    return (
        <div className="max-w-[min(1200px,92vw)] mx-auto px-4 pb-16 pt-8">
            <Link
                to={`/courses/channel/${channelId}`}
                className="text-white/50 text-sm"
            >
                ← Back
            </Link>

            <h1 className="text-white font-bold mb-8 mt-4 text-2xl text-center">
                {playlist.title}
            </h1>

            <div
                className="grid gap-4 mb-6 items-stretch"
                style={{ gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))" }}
            >
                {playlist.guided && (
                    <Tile
                        title="Guided Walkthrough"
                        variant="playlist"
                        onClick={() =>
                            navigate(`/courses/channel/${channelId}/playlist/${playlistId}/guided`)
                        }
                    />
                )}

                {playlist.videos.map((v, i) => (
                    <Tile
                        key={i}
                        title={v.title}
                        subtitle={`Video ${i + 1}`}
                        variant="video"
                        href={v.youtube}
                    />
                ))}
            </div>
        </div>
    );
}