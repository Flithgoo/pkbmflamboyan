"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
import { IoCloseSharp } from "react-icons/io5";
import { FaBars } from "react-icons/fa6";
import Image from "next/image";

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
        <nav className="max-w-screen-xl px-6 sm:px-8 lg:px-16 mx-auto flex justify-between py-3 sm:py-4">
          <Link href="#" className="text-sm flex gap-2 font-bold">
            <Image
              src="/logo/Logo_PKBM_no-bg.png"
              width={"40"}
              height={"40"}
              alt="logo-pkbm"
            />
            <div>
              <p className="text-yellow-300">PKBM</p>
              <p className="text-emerald-400">Flamboyan</p>
            </div>
          </Link>
          <ul className="hidden lg:flex col-start-4 col-end-8 text-black-500  items-center">
            <Link
              href="#home"
              onClick={() => {
                setActiveLink("home");
              }}
              className={
                "px-4 py-2 mx-2 cursor-pointer animation-hover inline-block relative" +
                (activeLink === "home"
                  ? " text-orange-500 animation-active "
                  : " text-black-500 hover:text-orange-500 a")
              }
            >
              Home
            </Link>
            <Link
              href="#pricing"
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
              href="#feature"
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
              href="#about"
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

          <Popover className="flex lg:hidden justify-end">
            {({ open }: { open: any }) => (
              <>
                <PopoverButton className="inline-flex outline-none items-center justify-center rounded-md text-neutral-900 dark:text-white ">
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <IoCloseSharp
                      className="block h-6 w-6"
                      aria-hidden="true"
                    />
                  ) : (
                    <FaBars className="block h-6 w-6" aria-hidden="true" />
                  )}
                </PopoverButton>
                <PopoverPanel
                  transition
                  anchor="bottom"
                  className="divide-y divide-white/5 rounded-xl bg-white/5 text-sm/6 transition duration-200 ease-in-out [--anchor-gap:var(--spacing-5)] data-[closed]:-translate-y-1 data-[closed]:opacity-0"
                >
                  <div className="p-3">
                    <a
                      className="block rounded-lg py-2 px-3 transition hover:bg-white/5"
                      href="#"
                    >
                      <p className="font-semibold text-white">Insights</p>
                      <p className="text-white/50">
                        Measure actions your users take
                      </p>
                    </a>
                    <a
                      className="block rounded-lg py-2 px-3 transition hover:bg-white/5"
                      href="#"
                    >
                      <p className="font-semibold text-white">Automations</p>
                      <p className="text-white/50">
                        Create your own targeted content
                      </p>
                    </a>
                    <a
                      className="block rounded-lg py-2 px-3 transition hover:bg-white/5"
                      href="#"
                    >
                      <p className="font-semibold text-white">Reports</p>
                      <p className="text-white/50">Keep track of your growth</p>
                    </a>
                  </div>
                  <div className="p-3">
                    <a
                      className="block rounded-lg py-2 px-3 transition hover:bg-white/5"
                      href="#"
                    >
                      <p className="font-semibold text-white">Documentation</p>
                      <p className="text-white/50">
                        Start integrating products and tools
                      </p>
                    </a>
                  </div>
                </PopoverPanel>
              </>
            )}
          </Popover>
        </nav>
      </header>
    </>
  );
};

export default Navbar;
