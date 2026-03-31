import { BrowserRouter, Routes, Route } from "react-router-dom";

import Layout from "./components/layout/Layout";
import Home from "./pages/Home";
import About from "./pages/About";
import Articles from "./pages/Articles";
import Courses from "./pages/Courses";
import Channel from "./pages/Channel";
import Playlist from "./pages/Playlist";
import Guide from "./pages/Guide";
import FlowMap from "./pages/FlowMap";
import Sections from "./pages/Sections";   // raag sections page
import Reader from "./pages/Reader";
import SearchResults from "./pages/SearchResults";
import GuidedWalkthrough from "./pages/GuidedWalkthrough"

function App() {
    return (
        <BrowserRouter>
            <Layout>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/articles" element={<Articles />} />
                    <Route path="/courses" element={<Courses />} />
                    <Route
                        path="/courses/channel/:channelId"
                        element={<Channel />}
                    />
                    <Route
                        path="/courses/channel/:channelId/playlist/:playlistId"
                        element={<Playlist />}
                    />
                    <Route path="/guide" element={<Guide />} />
                    <Route path="/flow-map" element={<FlowMap />} />
                    <Route path="/sections/:raag" element={<Sections />} />
                    <Route path="/reader/:ang" element={<Reader />} />
                    <Route path="/search" element={<SearchResults />} />
                    <Route
                        path="/courses/channel/:channelId/playlist/:playlistId/guided"
                        element={<GuidedWalkthrough />}
                    />
                </Routes>
            </Layout>
        </BrowserRouter>
    );
}

export default App;