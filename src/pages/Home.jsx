import { useNavigate } from "react-router-dom";
import RaagCarousel from "../components/raag/RaagCarousel";
import SearchBar from "../components/search/SearchBar";

export default function Home() {
    const navigate = useNavigate();

    function handleNavigate(url) {
        const raagMatch = url.match(/raag=([^&]+)/);
        const angMatch = url.match(/ang=([^&]+)/);

        if (raagMatch) navigate(`/sections/${raagMatch[1]}`);
        else if (angMatch) navigate(`/reader/${angMatch[1]}`);
    }

    return (
        <div className="space-y-8">
            <RaagCarousel onNavigate={handleNavigate} />

            <div className="max-w-[900px] mx-auto px-4">
                <SearchBar />
            </div>
        </div>
    );
}