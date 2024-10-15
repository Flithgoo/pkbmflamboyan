import Image from "next/image";
import React from "react";
import {
  FaBookOpen,
  FaUsers,
  FaLightbulb,
  FaHandshake,
  FaAccessibleIcon,
} from "react-icons/fa";

const About = () => {
  return (
    <section id="about" className="mt-36 bg-white py-16">
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
      <h1 className="text-center bg-emerald-600 font-semibold text-slate-100 text-4xl py-5">
        Tentang Kami
      </h1>

      <div className="flex flex-col items-center bg-emerald-600 py-8">
        {/* Foto di Tengah */}
        <div className="w-full flex justify-center px-4">
          <div className="flex flex-col items-center">
            <Image
              src="/Drs. Casmadi.jpg"
              alt="Drs. Casmadi"
              width={300}
              height={300}
              className="rounded-full shadow-lg"
            />
            <p className="text-lg font-semibold mt-3 text-white">
              Drs. Casmadi
            </p>
            <p className="text-sm text-slate-200">
              Kepala PKBM Flamboyan Comal
            </p>
          </div>
        </div>

        {/* Bagian Visi dan Misi */}
        <div className="container mt-11 px-4 lg:px-0 w-full">
          <div className="text-white text-center">
            <h2 className="text-3xl font-bold mb-6">Visi</h2>
            <p className="text-xl italic mb-8">
              "Menjadi pusat kegiatan belajar yang inovatif dan inklusif,
              memberdayakan masyarakat melalui pendidikan yang berkualitas,
              untuk menciptakan komunitas yang mandiri, berpengetahuan luas, dan
              berdaya saing tinggi."
            </p>

            <h2 className="text-3xl font-bold mb-6">Misi</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Misi 1 */}
              <div className="flex items-start space-x-4 bg-emerald-700 p-4 rounded-lg shadow-lg transition-transform duration-300 transform 5 hover:bg-emerald-500 hover:shadow-xl">
                <FaBookOpen className="text-4xl text-white transition-transform duration-300" />
                <div>
                  <h3 className="text-xl font-bold">
                    Menyediakan Pendidikan Berkualitas
                  </h3>
                  <p>
                    Menawarkan berbagai program pendidikan yang relevan, baik
                    formal maupun non-formal, untuk meningkatkan keterampilan
                    dan pengetahuan masyarakat.
                  </p>
                </div>
              </div>

              {/* Misi 2 */}
              <div className="flex items-start space-x-4 bg-emerald-700 p-4 rounded-lg shadow-lg transition-transform hover:scale-105 duration-300 transform 5 hover:bg-emerald-500 hover:shadow-xl">
                <FaUsers className="text-4xl text-white transition-transform duration-300" />
                <div>
                  <h3 className="text-xl font-bold">Memberdayakan Komunitas</h3>
                  <p>
                    Mengembangkan dan melaksanakan program yang mendukung
                    pemberdayaan masyarakat, termasuk pelatihan keterampilan,
                    kursus kewirausahaan, dan pengembangan kapasitas.
                  </p>
                </div>
              </div>

              {/* Misi 3 */}
              <div className="flex items-start space-x-4 bg-emerald-700 p-4 rounded-lg shadow-lg transition-transform hover:scale-105 duration-300 transform 5 hover:bg-emerald-500 hover:shadow-xl">
                <FaLightbulb className="text-4xl text-white transition-transform duration-300" />
                <div>
                  <h3 className="text-xl font-bold">
                    Mendorong Inovasi dan Kreativitas
                  </h3>
                  <p>
                    Menciptakan lingkungan belajar yang inovatif dan mendukung
                    pengembangan kreativitas, guna mempersiapkan peserta didik
                    menghadapi tantangan masa depan.
                  </p>
                </div>
              </div>

              {/* Misi 4 */}
              <div className="flex items-start space-x-4 bg-emerald-700 p-4 rounded-lg shadow-lg transition-transform hover:scale-105 duration-300 transform 5 hover:bg-emerald-500 hover:shadow-xl">
                <FaAccessibleIcon className="text-4xl text-white transition-transform duration-300" />
                <div>
                  <h3 className="text-xl font-bold">
                    Meningkatkan Akses dan Kesempatan
                  </h3>
                  <p>
                    Menjamin akses yang adil dan merata ke berbagai program
                    pendidikan untuk semua lapisan masyarakat, termasuk kelompok
                    rentan dan kurang beruntung.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 240">
        <path
          fill="#059669"
          fillOpacity="1"
          d="M0,160L80,149.3C160,139,320,117,480,122.7C640,128,800,160,960,176C1120,192,1280,192,1360,192L1440,192L1440,0L1360,0C1280,0,1120,0,960,0C800,0,640,0,480,0C320,0,160,0,80,0L0,0Z"
        ></path>
      </svg>
    </section>
  );
};

export default About;
