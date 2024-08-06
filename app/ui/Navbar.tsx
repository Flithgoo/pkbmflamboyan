"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
import { IoCloseSharp } from "react-icons/io5";
import { FaBars } from "react-icons/fa6";
import Logo from "./(Navbar)/Logo";
import NavLink from "./(Navbar)/NavLink";

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
          "fixed backdrop-blur-sm top-0 w-full z-30 bg-white-500 transition-all " +
          (activeScroll ? " shadow-md pt-0" : " pt-4")
        }
      >
        <nav className="max-w-screen-xl px-6 sm:px-8 lg:px-16 mx-auto flex justify-between py-3 sm:py-4">
          <Logo />
          <ul className="hidden lg:flex col-start-4 col-end-8 text-black-500  items-center">
            <NavLink
              title={"Beranda"}
              link={"home"}
              setActiveLink={setActiveLink}
              activeLink={activeLink}
            />
            <NavLink
              title={"Tentang kami"}
              link={"tentang-kami"}
              setActiveLink={setActiveLink}
              activeLink={activeLink}
            />
            <NavLink
              title={"Kontak kami"}
              link={"kontak-kami"}
              setActiveLink={setActiveLink}
              activeLink={activeLink}
            />
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
