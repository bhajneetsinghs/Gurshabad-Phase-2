// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import Tile from "../components/Tile";

// export default function Courses() {
//   const [channels, setChannels] = useState([]);
//   const navigate = useNavigate();

//   useEffect(() => {
//     fetch("/data/youtube-courses.json")
//       .then((r) => r.json())
//       .then(setChannels);
//   }, []);

//   return (
//     <div className="max-w-[min(1200px,92vw)] mx-auto px-4 pb-16 pt-8">
//       <h1 className="text-white font-bold mb-8 text-2xl text-center">
//         Courses
//       </h1>

//       <div className="grid gap-4"
//         style={{ gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))" }}
//       >
//         {channels.map((ch) => (
//           <Tile
//             key={ch.id}
//             title={ch.title}
//             onClick={() => navigate(`/courses/channel/${ch.id}`)}
//           />
//         ))}
//       </div>
//     </div>
//   );
// }

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Tile from "../components/Tile";

export default function Courses() {
  const [channels, setChannels] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("/data/youtube-courses.json")
      .then((r) => r.json())
      .then(setChannels);
  }, []);

  return (
    <div className="max-w-[min(1200px,92vw)] mx-auto px-4 pb-16 pt-8">
      <h1 className="text-white font-bold mb-8 text-2xl text-center">
        Courses
      </h1>

      <div
        className="grid gap-4"
        style={{ gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))" }}
      >
        {channels.map((ch) => (
          // <div
          //   key={ch.id}
          //   style={ch.id === "sikhi-vichar" ? { gridColumn: "1 / -1" } : {}}
          // >
          <Tile
            title={ch.title}
            variant="featured"
            onClick={() => navigate(`/courses/channel/${ch.id}`)}
          />
          // </div>
        ))}
      </div>
    </div >
  );
}