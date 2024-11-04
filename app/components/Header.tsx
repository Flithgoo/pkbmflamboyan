"use client";

import React from "react";
import { useEffect, useState } from "react";
import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
import { IoCloseSharp } from "react-icons/io5";
import { FaBars } from "react-icons/fa6";
import Logo from "./(Header)/Logo";
import DesktopLink from "./(Header)/DesktopLink";
import MobileLink from "./(Header)/MobileLink";

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
          "fixed backdrop-blur-sm top-0 w-full z-30 bg-white/90 transition-all " +
          (activeScroll ? " shadow-md pt-0" : " pt-4")
        }
      >
        <nav className="max-w-screen-xl px-6 sm:px-8 lg:px-16 mx-auto flex justify-between py-3 sm:py-4">
          <Logo />
          {/* Start Desktop Navigation */}
          <ul className="hidden lg:flex col-start-4 col-end-8 text-emerald-500 text-sm items-center">
            <DesktopLink
              title={"Beranda"}
              link={"home"}
              setActiveLink={setActiveLink}
              activeLink={activeLink}
            />
            <DesktopLink
              title={"Tentang kami"}
              link={"about"}
              setActiveLink={setActiveLink}
              activeLink={activeLink}
            />
            <DesktopLink
              title={"Program"}
              link={"program"}
              setActiveLink={setActiveLink}
              activeLink={activeLink}
            />
            <DesktopLink
              title={"Pendaftaran"}
              link={"registration"}
              setActiveLink={setActiveLink}
              activeLink={activeLink}
            />
            <DesktopLink
              title={"Galeri"}
              link={"gallery"}
              setActiveLink={setActiveLink}
              activeLink={activeLink}
            />
            <DesktopLink
              title={"Testimoni"}
              link={"testimoni"}
              setActiveLink={setActiveLink}
              activeLink={activeLink}
            />
            <DesktopLink
              title={"FAQ"}
              link={"faq"}
              setActiveLink={setActiveLink}
              activeLink={activeLink}
            />
            <DesktopLink
              title={"Kontak kami"}
              link={"contact"}
              setActiveLink={setActiveLink}
              activeLink={activeLink}
            />
          </ul>
          {/* End Desktop Navigation */}

          {/* Start Mobile Navigation */}
          <Popover className="flex lg:hidden justify-end">
            {({ open, close }: { open: any; close: () => void }) => (
              <>
                <PopoverButton className="inline-flex outline-none items-center justify-center rounded-md text-emerald-500">
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
                  anchor={{ to: "left end", gap: "-3em" }}
                  className="w-52 z-40 mt-20 rounded-xl bg-emerald-600/90 text-sm/6 transition duration-200 ease-in-out data-[closed]:-translate-y-1 data-[closed]:opacity-0"
                >
                  <div className="p-3">
                    <MobileLink title={"Beranda"} link={"home"} close={close} />
                    <MobileLink
                      title={"Tentang kami"}
                      link={"about"}
                      close={close}
                    />
                    <MobileLink
                      title={"Program"}
                      link={"program"}
                      close={close}
                    />
                    <MobileLink
                      title={"Pendaftaran"}
                      link={"registration"}
                      close={close}
                    />
                    <MobileLink
                      title={"Galeri"}
                      link={"gallery"}
                      close={close}
                    />
                    <MobileLink
                      title={"Testimoni"}
                      link={"testimoni"}
                      close={close}
                    />
                    <MobileLink title={"FAQ"} link={"faq"} close={close} />
                    <MobileLink
                      title={"Kontak kami"}
                      link={"contact"}
                      close={close}
                    />
                  </div>
                </PopoverPanel>
              </>
            )}
          </Popover>
          {/* End Mobile Navigation */}
        </nav>
      </header>
    </>
  );
};

export default Navbar;
