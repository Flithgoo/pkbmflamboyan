import Image from "next/image";
import Link from "next/link";
import React from "react";

const Hero = () => {
  return (
    <section id="home" className="pt-36">
      <div className="flex justify-center">
        <div className="container flex flex-wrap">
          <div className="self-center px-4 lg:w-1/2 text-emerald-700">
            <h1 className="text-base font-semibold md:text-xl">
              Selamat datang di website
              <span className="mt-1 block text-4xl font-bold text-yellow-500 lg:text-5xl">
                PKBM Flamboyan
              </span>
            </h1>
            <p className="mb-10 font-medium text-justify leading-relaxed text-secondary mt-2">
              Pusat pendidikan untuk semua kalangan tanpa memandang usia. Kami
              menyediakan program kesetaraan dan keterampilan dengan jadwal
              pembelajaran yang fleksibel, cocok bagi Anda yang ingin tetap
              bekerja sambil belajar. Bergabunglah dan wujudkan masa depan lebih
              cerah bersama kami!
            </p>

            <Link
              href="#"
              className="rounded-full bg-emerald-600 py-3 px-8 text-base font-semibold text-slate-100 transition duration-300 ease-in-out hover:opacity-80 hover:shadow-lg"
            >
              Daftar sekarang!
            </Link>
          </div>
          <div className="w-full lg:self-end px-4 lg:w-1/2">
            <div className="flex justify-center mt-16 lg:mt-9">
              <Image
                src="/heroimg/Profile Pkbm.jpg"
                alt="Foto bareng PKBM"
                width={550}
                height={200}
                className="relative rounded-lg shadow-lg lg:ml-auto max-w-full"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
