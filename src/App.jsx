import { BrowserRouter, Routes, Route } from "react-router-dom";

import Layout from "./components/layout/Layout";
import Home from "./pages/Home";
import About from "./pages/About";
import Articles from "./pages/Articles";
import Courses from "./pages/Courses";
import Guide from "./pages/Guide";
import FlowMap from "./pages/FlowMap";
import Sections from "./pages/Sections";   // raag sections page
import Reader from "./pages/Reader";
import SearchResults from "./pages/SearchResults";

function App() {
    return (
        <BrowserRouter>
            <Layout>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/articles" element={<Articles />} />
                    <Route path="/courses" element={<Courses />} />
                    <Route path="/guide" element={<Guide />} />
                    <Route path="/flow-map" element={<FlowMap />} />
                    <Route path="/sections/:raag" element={<Sections />} />
                    <Route path="/reader/:ang" element={<Reader />} />
                    <Route path="/search" element={<SearchResults />} />
                </Routes>
            </Layout>
        </BrowserRouter>
    );
}

export default App;