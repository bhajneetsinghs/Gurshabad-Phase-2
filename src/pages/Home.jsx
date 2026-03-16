import { useNavigate } from "react-router-dom";
import RaagCarousel from "../components/raag/RaagCarousel";
import SearchBar from "../components/search/SearchBar";

export default function Home() {
  const navigate = useNavigate();

  function handleNavigate(url) {
    const raagMatch = url.match(/raag=([^&]+)/);
    const angMatch  = url.match(/ang=([^&]+)/);

    if (raagMatch) navigate(`/sections/${raagMatch[1]}`);
    else if (angMatch) navigate(`/reader/${angMatch[1]}`);
  }

  return (
    <div
      style={{
        minHeight: "110vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 36,
        padding: "0 24px 24px",
      }}
    >
      <RaagCarousel onNavigate={handleNavigate} />
      <div style={{ width: "100%", maxWidth: 800 }}>
        <SearchBar />
      </div>
    </div>
  );
}