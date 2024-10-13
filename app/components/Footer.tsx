import React from "react";
import GoogleMap from "./(Footer)/GoogleMaps";
import { FaFacebook, FaInstagram, FaTiktok, FaYoutube } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-dark pt-24 pb-12">
      <div className="flex flex-col justify-center items-center">
        <div className="container flex flex-wrap">
          <div className="mb-12 w-full px-4 font-medium text-slate-300 md:w-2/5">
            <h2 className="mb-5 mt-7 text-4xl font-bold text-white">
              PKBM Flamboyan
            </h2>
            <h3 className="mb-2 text-2xl font-bold">Hubungi Kami</h3>
            <p>pkbmflamboyan017@gmail.com</p>
            <p>Jl. Desa Wonokromo, Comal, Pemalang, Jawa Tengah</p>
            <p>(Dekat Balai Desa Wonokromo)</p>
          </div>
          <div className="mb-12 w-full px-4 flex text-slate-300 md:w-3/5">
            <GoogleMap />
          </div>
        </div>

        <div className="w-full border-t border-slate-700 pt-10">
          <div className="mb-5 flex items-center justify-center">
            <a
              href="https://youtube.com/webprogrammingunpas"
              target="_blank"
              className="mr-3 flex h-9 w-9 items-center justify-center rounded-full border border-slate-300 text-slate-300 hover:border-primary hover:bg-primary hover:text-white"
            >
              <FaYoutube />
            </a>

            <a
              href="https://www.instagram.com/pkbmflamboyanwonokromo/"
              target="_blank"
              className="mr-3 flex h-9 w-9 items-center justify-center rounded-full border border-slate-300 text-slate-300 hover:border-primary hover:bg-primary hover:text-white"
            >
              <FaInstagram />
            </a>

            <a
              href="https://www.facebook.com/profile.php?id=100004782422830&locale=id_ID"
              target="_blank"
              className="mr-3 flex h-9 w-9 items-center justify-center rounded-full border border-slate-300 text-slate-300 hover:border-primary hover:bg-primary hover:text-white"
            >
              <FaFacebook />
            </a>

            <a
              href="https://www.tiktok.com/@pkbm.flamboyan"
              target="_blank"
              className="mr-3 flex h-9 w-9 items-center justify-center rounded-full border border-slate-300 text-slate-300 hover:border-primary hover:bg-primary hover:text-white"
            >
              <FaTiktok />
            </a>
          </div>
          <p className="text-center text-sm mt-3 font-medium text-slate-400">
            Copyright © 2024, PKBM Flamboyan.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
