import Image from "next/image";
import React from "react";

const About = () => {
  return (
    <section id="about" className="mt-36">
      {/* SVG Divider */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1440 300"
        className="block w-full -mb-1"
      >
        <path
          fill="#059669"
          fillOpacity="1"
          d="M0,160L80,149.3C160,139,320,117,480,122.7C640,128,800,160,960,181.3C1120,203,1280,213,1360,218.7L1440,224L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"
        ></path>
      </svg>

      {/* Konten Section */}
      <h1 className="text-center bg-emerald-600 font-semibold text-slate-100 text-4xl lg:mt-[-50px]">
        Tentang kami
      </h1>

      <div className="flex justify-center bg-emerald-600">
        <div className="container flex flex-wrap">
          <div className="w-full mt-14 lg:self-start px-4 lg:w-1/3">
            <div className="flex flex-col items-center justify-center self-center text-center lg:mt-9">
              <Image
                src="/Drs. Casmadi.jpg"
                alt="Drs. Casmadi"
                width={300}
                height={300}
                className="relative shadow-lg lg:mx-auto max-w-full"
              />
              <p className="text-lg font-semibold mt-3">Drs. Casmadi</p>
              <p className="text-sm text-slate-200">
                Kepala PKBM Flamboyan Comal
              </p>
            </div>
          </div>
          {/* Bagian Visi dan Misi */}
          <div className="w-full lg:self-start mt-11 px-4 lg:w-2/3">
            <div className="text-white">
              <h2 className="text-2xl font-bold mb-4">Visi</h2>
              <p className="mb-6">
                “Menjadi pusat kegiatan belajar yang inovatif dan inklusif,
                memberdayakan masyarakat melalui pendidikan yang berkualitas,
                untuk menciptakan komunitas yang mandiri, berpengetahuan luas,
                dan berdaya saing tinggi.”
              </p>
              <h2 className="text-2xl font-bold mb-4">Misi</h2>
              <ul className="list-disc list-inside space-y-2">
                <li>
                  <strong>Menyediakan Pendidikan Berkualitas:</strong>{" "}
                  Menawarkan berbagai program pendidikan yang relevan, baik
                  formal maupun non-formal, untuk meningkatkan keterampilan dan
                  pengetahuan masyarakat.
                </li>
                <li>
                  <strong>Memberdayakan Komunitas:</strong> Mengembangkan dan
                  melaksanakan program yang mendukung pemberdayaan masyarakat,
                  termasuk pelatihan keterampilan, kursus kewirausahaan, dan
                  pengembangan kapasitas.
                </li>
                <li>
                  <strong>Mendorong Inovasi dan Kreativitas:</strong>{" "}
                  Menciptakan lingkungan belajar yang inovatif dan mendukung
                  pengembangan kreativitas, guna mempersiapkan peserta didik
                  menghadapi tantangan masa depan.
                </li>
                <li>
                  <strong>Meningkatkan Akses dan Kesempatan:</strong> Menjamin
                  akses yang adil dan merata ke berbagai program pendidikan
                  untuk semua lapisan masyarakat, termasuk kelompok rentan dan
                  kurang beruntung.
                </li>
                <li>
                  <strong>Membangun Kerja Sama:</strong> Menjalin kemitraan
                  dengan lembaga pendidikan, pemerintah, dan sektor swasta untuk
                  memperluas jaringan, sumber daya, dan peluang pendidikan.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
        <path
          fill="#059669"
          fill-opacity="1"
          d="M0,160L80,149.3C160,139,320,117,480,122.7C640,128,800,160,960,176C1120,192,1280,192,1360,192L1440,192L1440,0L1360,0C1280,0,1120,0,960,0C800,0,640,0,480,0C320,0,160,0,80,0L0,0Z"
        ></path>
      </svg>
    </section>
  );
};

export default About;
