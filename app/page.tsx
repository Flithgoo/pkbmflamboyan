import Hero from "./components/Hero";
import Navbar from "./components/Navbar";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="bg-white">
        <Hero />
        <div id="tentang-kami" className="h-96 bg-white">
          <h1>halo</h1>
        </div>
        <div className="h-96 bg-neutral-400">
          <h1>halo</h1>
        </div>
        <h1 className="h-lvh"></h1>
      </main>
    </>
  );
}
