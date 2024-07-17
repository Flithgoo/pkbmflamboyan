"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const Navbar = () => {
  const [activeLink, setActiveLink] = useState("undefined");
  const [activeScroll, setActiveScroll] = useState(false);
  useEffect(() => {
    window.addEventListener("scroll", () => {
      setActiveScroll(window.scrollY > 20);
    });
  }, []);

  return (
    <>
      <header
        className={
          "fixed backdrop-blur-sm top-0 w-full  z-30 bg-white-500 transition-all " +
          (activeScroll ? " shadow-md pt-0" : " pt-4")
        }
      >
        <nav className="max-w-screen-xl px-6 sm:px-8 lg:px-16 mx-auto grid grid-flow-col py-3 sm:py-4">
          <h1>PKBM Flamboyan</h1>
          <ul className="hidden lg:flex col-start-4 col-end-8 text-black-500  items-center">
            <Link
              href="about"
              className={
                "px-4 py-2 mx-2 cursor-pointer animation-hover inline-block relative" +
                (activeLink === "about"
                  ? " text-orange-500 animation-active "
                  : " text-black-500 hover:text-orange-500 a")
              }
            >
              About
            </Link>
            <Link
              href="about"
              target="__blank"
              onClick={() => {
                setActiveLink("pricing");
              }}
              className={
                "px-4 py-2 mx-2 cursor-pointer animation-hover inline-block relative" +
                (activeLink === "pricing"
                  ? " text-orange-500 animation-active "
                  : " text-black-500 hover:text-orange-500 a")
              }
            >
              Pricing
            </Link>
            <Link
              href=""
              onClick={() => {
                setActiveLink("feature");
              }}
              className={
                "px-4 py-2 mx-2 cursor-pointer animation-hover inline-block relative" +
                (activeLink === "feature"
                  ? " text-orange-500 animation-active "
                  : " text-black-500 hover:text-orange-500 a")
              }
            >
              Feature
            </Link>
            <Link
              href="about"
              className={
                "px-4 py-2 mx-2 cursor-pointer animation-hover inline-block relative" +
                (activeLink === "about"
                  ? " text-orange-500 animation-active "
                  : " text-black-500 hover:text-orange-500 a")
              }
            >
              About
            </Link>
          </ul>
          <div className="col-start-10 col-end-12 font-medium flex justify-end items-center">
            <Link href="/">Signup</Link>
          </div>
        </nav>
      </header>
    </>
  );
};

export default Navbar;
