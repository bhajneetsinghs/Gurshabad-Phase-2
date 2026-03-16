import { Link } from "react-router-dom";
import { useState } from "react";

export default function Navbar() {

  const [open, setOpen] = useState(false);

  const nav = [
    { name: "Home", path: "/" },
    { name: "Courses", path: "/courses" },
    { name: "Guide", path: "/guide" },
    { name: "Flow Map", path: "/flow-map" },
    { name: "Articles", path: "/articles" },
    { name: "About", path: "/about" }
  ];

  return (

    <header className="fixed top-0 w-full z-50">

      <nav className="flex justify-center mt-10">

        <div className="hidden md:flex gap-3">

          {nav.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className="px-6 py-3 rounded-full text-white border border-white/20 bg-white/10 backdrop-blur hover:bg-white/20"
            >
              {item.name}
            </Link>
          ))}

        </div>

        <button
          className="md:hidden text-white"
          onClick={() => setOpen(!open)}
        >
          ☰
        </button>

      </nav>

      {open && (
        <div className="flex flex-col items-center gap-3 mt-4">

          {nav.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className="text-white"
            >
              {item.name}
            </Link>
          ))}

        </div>
      )}

    </header>
  );
}