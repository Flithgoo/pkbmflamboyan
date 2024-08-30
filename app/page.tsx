import Hero from "./components/Hero";
import Navbar from "./components/Header";
import About from "./components/About";
import Program from "./components/Program";
import Registration from "./components/Registration";
import Contact from "./components/Contact";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="bg-white">
        <Hero />
        <About />
        <Program />
        <Registration />
        <Contact />

        <h1 className="h-lvh"></h1>
      </main>
      <Footer />
    </>
  );
}
