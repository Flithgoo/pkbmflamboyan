import React from "react";

const Registration = () => {
  return (
    <section id="registration" className="pt-32">
      <h1 className="text-center font-semibold text-slate-800 text-4xl mb-5">
        Syarat Pendaftaran
      </h1>

      <div className="flex justify-center">
        <div className="container justify-center flex flex-wrap">
          <div className="max-w-4xl mx-auto bg-emerald-500 rounded-lg p-10 shadow-lg">
            <ul className="text-white font-medium space-y-4 text-lg leading-relaxed">
              <li>
                • Fotokopi Ijazah Terakhir Dilegalisir bagi yang mendaftar Paket
                B atau Paket C (2 lembar)
              </li>
              <li>• Menunjukan Raport (Bagi Yang Putus Sekolah)</li>
              <li>• Fotokopi Kartu Keluarga (1 Lembar)</li>
              <li>• Akte Kelahiran (1 Lembar)</li>
              <li>• Pas Foto Warna: 3 x 4 (2 Lembar) & 2 x 3 (2 Lembar)</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Registration;
