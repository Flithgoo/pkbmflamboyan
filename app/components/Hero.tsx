import Image from "next/image";
import Link from "next/link";
import React from "react";

const Hero = () => {
  return (
    <section id="home" className="pt-36">
      <div className="flex justify-center">
        <div className="container flex flex-wrap">
          <div className="self-center px-4 lg:w-1/2 text-green">
            <h1 className="text-base font-semibold text-primary md:text-xl">
              Selamat datang di website
              <span className="mt-1 block text-4xl font-bold text-slate-900 lg:text-5xl">
                PKBM Flamboyan
              </span>
            </h1>
            <p className="mb-10 font-medium leading-relaxed text-secondary">
              Lorem ipsum dolor sit, amet consectetur adipisicing elit.
              Provident nemo quia autem soluta voluptates temporibus aspernatur
              recusandae reprehenderit in deleniti esse, voluptatum molestias
              explicabo architecto perferendis. Aliquam eius aut quae.{" "}
            </p>

            <Link
              href="#"
              className="rounded-full bg-emerald-600 py-3 px-8 text-base font-semibold text-slate-100 transition duration-300 ease-in-out hover:opacity-80 hover:shadow-lg"
            >
              Daftar sekarang!
            </Link>
          </div>
          <div className="w-full lg:self-end px-4 lg:w-1/2">
            <div className="flex justify-center mt-12 lg:mt-9">
              <Image
                src="/heroimg/FOTO BERJAS.jpg"
                alt="Sandhika Galih"
                width={300}
                height={500}
                className="relative z-10 lg:ml-auto max-w-full"
              />
            </div>
            <div className="text-lg mt-3">
              <p className="font-semibold text-center text-slate-700">
                Drs. Casmadi
              </p>
              <p className="font-normal text-sm text-center text-slate-600">
                Kepala PKBM Flamboyan
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
