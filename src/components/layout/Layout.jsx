import Navbar from "./Navbar";
import Footer from "./Footer";

export default function Layout({ children }) {

  return (

    <>
      <Navbar />

      <main className="pt-16 min-h-screen">

        {children}

      </main>

      <Footer />
    </>
  );
}