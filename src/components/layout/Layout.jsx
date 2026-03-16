import Navbar from "./Navbar";
import Footer from "./Footer";

export default function Layout({ children }) {

  return (

    <>
      <Navbar />

      <main className="pt-8 min-h-screen">

        {children}

      </main>

      <Footer />
    </>
  );
}