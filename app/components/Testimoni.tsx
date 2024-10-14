"use client";

import React, { useRef } from "react";
import Slider from "react-slick";
import Image from "next/image";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import { listTestimoni } from "../utils/data";

const Testimoni = () => {
  // Berikan tipe SliderType atau null ke useRef
  const sliderRef = useRef<any>(null);

  const settings = {
    dots: true,
    customPaging: function () {
      return (
        <a className="">
          <span className="mx-1 sm:mx-2 rounded-l-full rounded-r-full h-4 w-4 block cursor-pointer transition-all"></span>
        </a>
      );
    },
    dotsClass: "slick-dots w-max absolute mt-[5em] sm:mt-20 mx-2 ",
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 2,
    responsive: [
      {
        breakpoint: 770,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          initialSlide: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <section id="testimoni" className="pt-32">
      <h1 className="text-center font-semibold text-slate-800 text-4xl mb-7">
        Testimoni
      </h1>

      <div className="flex justify-center">
        <div className="container">
          <Slider
            {...settings}
            arrows={false}
            ref={sliderRef} // Berikan referensi ke Slider
            className="flex items-stretch"
          >
            {listTestimoni.map((t, index) => (
              <div key={index} className="px-3">
                <div className="border-2 border-gray-200 hover:border-emerald-400 transition-all rounded-lg p-8 pb-5 flex flex-col min-h-[17em]">
                  <div className="flex flex-col xl:flex-row w-full items-stretch xl:items-center">
                    <div className="flex order-2 xl:order-1">
                      <Image
                        src={t.image}
                        height={50}
                        width={50}
                        alt={`Icon ${t.name}`}
                        className="rounded-full"
                      />
                      <div className="flex flex-col ml-5 text-left">
                        <p className="text-lg text-slate-800 capitalize">
                          {t.name}
                        </p>
                        <p className="text-sm text-slate-600">{t.email}</p>
                      </div>
                    </div>
                  </div>
                  <p className="mt-4 text-left text-slate-700">{t.testimoni}</p>
                </div>
              </div>
            ))}
          </Slider>
          <div className="flex w-full items-center justify-end">
            <div className="flex flex-none justify-between w-auto mt-14">
              <div
                className="mx-2 flex items-center justify-center h-12 w-12 sm:h-14 sm:w-14 rounded-full bg-white border-emerald-500 border hover:bg-emerald-500 hover:text-slate-50 transition-all text-emerald-500 cursor-pointer"
                onClick={() => sliderRef.current?.slickPrev()} // Akses ref current
              >
                <FaAngleLeft size={25} />
              </div>
              <div
                className="mx-4 flex items-center justify-center h-12 w-12 sm:h-14 sm:w-14 rounded-full bg-white border-emerald-500 border hover:bg-emerald-500 hover:text-slate-50 transition-all text-emerald-500 cursor-pointer"
                onClick={() => sliderRef.current?.slickNext()} // Akses ref current
              >
                <FaAngleRight size={25} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimoni;
