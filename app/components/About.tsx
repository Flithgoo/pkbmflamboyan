/* eslint-disable react/no-unescaped-entities */
"use client";

import Image from "next/image";
import React from "react";
import {
  FaBookOpen,
  FaUsers,
  FaLightbulb,
  FaHandshake,
  FaAccessibleIcon,
} from "react-icons/fa";
import ScrollAnimationContainer from "./ui/ScrollAnimationContainer";
import getScrollAnimation from "../utils/getScrollAnimation";
import { motion } from "framer-motion";

const scrollAnimation = getScrollAnimation();
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
          <ScrollAnimationContainer>
            <motion.div
              className="flex flex-col items-center"
              variants={scrollAnimation}
            >
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
            </motion.div>
          </ScrollAnimationContainer>
        </div>

        {/* Bagian Visi dan Misi */}
        <div className="container mt-11 px-4 lg:px-0 w-full">
          <div className="text-white text-center">
            <ScrollAnimationContainer>
              <motion.div variants={scrollAnimation}>
                <h2 className="text-3xl font-bold mb-6">Visi</h2>
                <p className="text-xl italic mb-8">
                  "Menjadi pusat kegiatan belajar yang inovatif dan inklusif,
                  memberdayakan masyarakat melalui pendidikan yang berkualitas,
                  untuk menciptakan komunitas yang mandiri, berpengetahuan luas,
                  dan berdaya saing tinggi."
                </p>
              </motion.div>
            </ScrollAnimationContainer>

            <h2 className="text-3xl font-bold mb-6">Misi</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                "Melayani pendidikan dan keterampilan seluruh lapisan masyarakat.",
                "Mengembangkan dan memfasilitasi usaha pembelajaran masyarakat secara dinamis sesuai dengan kebutuhan dan partisipasi masyarakat.",
                "Menyelenggarakan pendidikan yang dapat dijangkau oleh masyarakat.",
                "Meningkatkan kemandirian masyarakat melalui pendidikan kecakapan hidup.",
              ].map((misi, index) => (
                <div
                  key={index}
                  className="flex items-center justify-center bg-emerald-700 p-6 rounded-lg shadow-lg text-white text-center transition-transform duration-300 transform hover:scale-105 hover:bg-emerald-500 hover:shadow-xl"
                >
                  <p className="font-medium">{misi}</p>
                </div>
              ))}
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
