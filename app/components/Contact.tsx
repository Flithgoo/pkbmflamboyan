import React from "react";

const Contact = () => {
  return (
    <section id="contact" className="pt-32">
      <h1 className="text-center font-semibold text-slate-800 text-4xl mb-5">
        Kontak kami
      </h1>

      <div className="flex justify-center">
        <div className="container text-slate-700 justify-center flex flex-col">
          <form>
            <div className="w-full lg:mx-auto lg:w-2/3">
              <div className="mb-8 w-full px-4">
                <label htmlFor="name" className="text-base font-medium">
                  Nama
                </label>
                <input
                  type="text"
                  id="name"
                  className="w-full rounded-md bg-emerald-200 p-3 text-dark focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              <div className="mb-8 w-full px-4">
                <label htmlFor="email" className="text-base font-medium">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  className="w-full rounded-md bg-emerald-200 p-3 text-dark focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              <div className="mb-8 w-full px-4">
                <label htmlFor="message" className="text-base font-medium">
                  Pesan
                </label>
                <textarea
                  id="email"
                  className="h-32 w-full rounded-md bg-emerald-200 p-3 text-dark focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                ></textarea>
              </div>
              <div className="w-full px-4">
                <button className="w-full rounded-full bg-emerald-600 py-3 px-8 text-base font-semibold text-white transition duration-500 hover:opacity-80 hover:shadow-lg">
                  Kirim
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Contact;
