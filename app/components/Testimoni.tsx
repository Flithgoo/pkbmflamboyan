"use client";

import React, { useRef } from "react";
import Slider from "react-slick";
import Image from "next/image";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";

const Testimoni = ({
  listTestimoni = [
    {
      name: "Jauhar Effendi",
      image: "/assets/people-3.png",
      email: "joeankkun@gmail.com",
      testimoni:
        "Tempat terbaik untuk belajar bagi yang sudah putus sekolah,memberikan kesetaraan pendidikan sebagai hak warga negara Indonesia",
    },
    {
      name: "Aprilia",
      image: "/assets/people-3.png",
      email: "rizhanfarazah93@gmail.com",
      testimoni:
        "Para guru²nya sangat ramah baik,sabar mengajarkan ilmu kepada kami, semoga pkbm sukses selalu tambah maju, makin ramai yg belajar, yg putus sekolah bisa sekolah lagi karna ada flamboyan",
    },
    {
      name: "Mega indriyani",
      image: "/assets/people-3.png",
      email: "muhamadtayal@gmail.com",
      testimoni:
        "PKBM sangat membantu kita yg terlambat melanjutkan sekolah, gurunya sangat baik & ramah2 , pokoknya top markotop buat PKBM 👍🏻👍🏻👍🏻❤️❤️❤️",
    },
    {
      name: "Siti Romlah",
      image: "/assets/people-3.png",
      email: "sitiromlah05781@gmail.com",
      testimoni:
        "Ajang pembelajaran yang sangat membantu dan bermanfaat sekali bagi saya yg putus sekolah",
    },
    {
      name: "Wartiah",
      image: "/assets/people-3.png",
      email: "wartiahpml07@gmail.com",
      testimoni:
        "Sangat mendukung kita yang sempat terhambat dengan pendidikan. Tutornya sangat ramah dan penjelasan materinya mudah dicerna.",
    },
    {
      name: "Liana Saputri ",
      image: "/assets/people-2.png",
      email: "rizqyhafizhah56@gmail.com",
      testimoni:
        "Terima kasih... atas adanya PKBM.  Saya bisa melanjutkan sekolah 🙏 PKBM sukses dan tetap semangat ",
    },
  ],
}) => {
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
    <section id="testimoni" className="pt-32 pb-32">
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
                <FaAngleLeft className="h-6 w-h-6 " />
              </div>
              <div
                className="mx-4 flex items-center justify-center h-12 w-12 sm:h-14 sm:w-14 rounded-full bg-white border-emerald-500 border hover:bg-emerald-500 hover:text-slate-50 transition-all text-emerald-500 cursor-pointer"
                onClick={() => sliderRef.current?.slickNext()} // Akses ref current
              >
                <FaAngleRight className="h-6 w-h-6" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimoni;
