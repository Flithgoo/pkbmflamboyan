import Hero from "./components/Hero";
import Navbar from "./components/Header";
import About from "./components/About";
import Program from "./components/Program";
import Registration from "./components/Registration";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import Gallery from "./components/Gallery";
import Testimoni from "./components/Testimoni";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="bg-white">
        <Hero />
        <About />
        <Program />
        <Registration />
        <Gallery />
        <Testimoni />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
