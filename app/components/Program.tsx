import Image from "next/image";
import React from "react";

const Program = () => {
  return (
    <section id="program" className="pt-32">
      <h1 className="text-center font-semibold text-slate-800 text-4xl mb-5">
        Program
      </h1>

      <div className="flex flex-col items-center">
        <div className="container justify-center flex flex-wrap">
          <div className="self-center px-4 lg:w-1/3">
            <Image
              src="/Paket A.png"
              alt="Paket A"
              width={550}
              height={200}
              className="relative max-w-full"
            />
          </div>
          <div className="self-center px-4 lg:w-1/3">
            <Image
              src="/Paket B.png"
              alt="Paket B"
              width={550}
              height={200}
              className="relative bottom-7 max-w-full"
            />
          </div>
          <div className="self-center px-4 lg:w-1/3">
            <Image
              src="/Paket C.png"
              alt="Paket C"
              width={550}
              height={200}
              className="relative max-w-full"
            />
          </div>
        </div>

        <div className="container justify-center mt-12 flex flex-wrap">
          <div className="self-center items-center px-4 mb-10 lg:w-1/2">
            <h1 className="text-slate-900 text-center text-5xl font-semibold">
              Pelatihan
            </h1>
          </div>
          <div className="flex w-full flex-col gap-10 items-center rounded-md shadow-lg bg-amber-400 p-10 lg:w-1/2">
            <Image
              src="/Komputer.png"
              alt="Komputer"
              width={200}
              height={200}
              className="relative max-w-full"
            />
            <Image
              src="/Wirausaha.png"
              alt="Wirausaha"
              width={200}
              height={200}
              className="relative max-w-full"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Program;
