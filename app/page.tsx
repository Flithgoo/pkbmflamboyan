import Hero from "./components/Hero";
import Navbar from "./components/Header";
import About from "./components/About";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="bg-white">
        <Hero />
        <About />
        <div className="h-96 bg-orange-400">
          <h1>halo</h1>
        </div>
        <h1 className="h-lvh"></h1>
      </main>
    </>
  );
}
