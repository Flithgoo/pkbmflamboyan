"use client";

import React from "react";
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";
import { FaChevronDown } from "react-icons/fa";
import { listFaq as faqitems } from "../utils/data";
import { motion, AnimatePresence } from "framer-motion";

const Faq = () => {
  return (
    <section id="faq" className="flex justify-center pt-32">
      <div className="flex flex-col container items-center text-slate-900 py-8">
        <h2 className="text-4xl font-semibold text-center">FAQ</h2>
        <p className="pt-6 pb-14 text-base max-w-2xl text-center m-auto">
          Frequently Asked Question / Pertanyaan yang sering diajukan
        </p>
        <div className="mx-auto w-full max-w-2xl rounded-2xl">
          {faqitems.map(({ question, response }, index) => (
            <div key={index}>
              <Disclosure>
                {({ open }) => (
                  <div className="mt-4 px-4">
                    <DisclosureButton
                      className={`${
                        open ? "rounded-b-none" : ""
                      } flex w-full justify-between rounded-lg text-neutral-100 bg-emerald-500 px-4 py-4 text-left text-base font-medium transition-all duration-300`}
                    >
                      <h2 className="font-semibold">{question}</h2>
                      <FaChevronDown
                        className={`transform transition-transform duration-300 ${
                          open ? "rotate-180" : ""
                        } h-5 w-5 flex-shrink-0`}
                      />
                    </DisclosureButton>

                    {/* Animasi dengan Framer Motion */}
                    <AnimatePresence initial={false}>
                      {open && (
                        <motion.div
                          key="content"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3, ease: "easeInOut" }}
                          className="overflow-hidden bg-emerald-500 rounded-b-lg"
                        >
                          <DisclosurePanel
                            static
                            className="px-4 pt-4 pb-2 text-base text-neutral-100"
                          >
                            <p>{response}</p>
                          </DisclosurePanel>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}
              </Disclosure>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Faq;
