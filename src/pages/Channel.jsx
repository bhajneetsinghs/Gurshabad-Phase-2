// import { useEffect, useState } from "react";
// import { useParams, useNavigate, Link } from "react-router-dom";
// import Tile from "../components/Tile";

// export default function Channel() {
//     const { channelId } = useParams();
//     const [channel, setChannel] = useState(null);
//     const navigate = useNavigate();

//     useEffect(() => {
//         fetch("/data/youtube-courses.json")
//             .then((r) => r.json())
//             .then((data) => {
//                 const found = data.find((c) => c.id === channelId);
//                 setChannel(found);
//             });
//     }, [channelId]);

//     if (!channel) return null;

//     return (
//         <div className="max-w-[min(1200px,92vw)] mx-auto px-4 pb-16 pt-8">
//             <Link to="/courses" className="text-white/50 text-sm">
//                 ← Courses
//             </Link>

//             <h1 className="text-white font-bold mb-8 mt-4 text-2xl text-center">
//                 {channel.title}
//             </h1>

//             <div className="grid gap-4"
//                 style={{ gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))" }}
//             >
//                 {channel.playlists.map((pl) => (
//                     <Tile
//                         key={pl.id}
//                         title={pl.title}
//                         onClick={() =>
//                             navigate(`/courses/channel/${channelId}/playlist/${pl.id}`)
//                         }
//                     />
//                 ))}
//             </div>
//         </div>
//     );
// }

import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Tile from "../components/Tile";

export default function Channel() {
    const { channelId } = useParams();
    const [channel, setChannel] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetch("/data/youtube-courses.json")
            .then((r) => r.json())
            .then((data) => {
                const found = data.find((c) => c.id === channelId);
                setChannel(found);
            });
    }, [channelId]);

    if (!channel) return null;

    return (
        <div className="max-w-[min(1200px,92vw)] mx-auto px-4 pb-16 pt-8">
            <Link to="/courses" className="text-white/50 text-sm">
                ← Courses
            </Link>

            <h1 className="text-white font-bold mb-8 mt-4 text-2xl text-center">
                {channel.title}
            </h1>

            <div
                className="grid gap-4"
                style={{ gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))" }}
            >
                {channel.playlists.map((pl) => (
                    <Tile
                        key={pl.id}
                        title={pl.title}
                        variant="playlist"
                        onClick={() =>
                            navigate(`/courses/channel/${channelId}/playlist/${pl.id}`)
                        }
                    />
                ))}
            </div>
        </div>
    );
}