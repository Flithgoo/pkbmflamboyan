"use client"; // Jika menggunakan struktur app

import React, { useState } from "react";
import { useRouter } from "next/navigation"; // Gunakan 'next/router' jika di pages
import Link from "next/link";

type FormData = {
  username: string;
  password: string;
};

const LoginPelajar: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    username: "",
    password: "",
  });
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    // Logika autentikasi login pelajar
    console.log("Form Submitted:", formData);

    // Contoh logika setelah login berhasil
    // TODO: Panggil API login dan validasi autentikasi
    if (formData.username === "pelajar" && formData.password === "password") {
      router.push("/pelajar/LMS"); // Redireksi ke halaman LMS
    } else {
      alert("Login gagal. Periksa username dan password Anda.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-gray-800 text-center mb-6">
          Login Pelajar
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Input username */}
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-4 py-2 border-gray-300 rounded-lg shadow-sm focus:ring-emerald-500 focus:border-emerald-500 text-gray-900 border-2 outline-none"
              placeholder="Masukkan username"
            />
          </div>

          {/* Input Password */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-4 py-2 border-2 outline-none border-gray-300 rounded-lg shadow-sm focus:ring-emerald-500 focus:border-emerald-500 text-gray-900"
              placeholder="Masukkan password"
            />
          </div>

          <div className="text-center">
            {/* Tombol Login */}
            <button
              type="submit"
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-2 px-4 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
            >
              Login
            </button>

            {/* Tombol Login tutor */}
            <Link
              href={"/login/tutor"}
              className="w-full text-sm underline text-emerald-500 text-center mt-3 block"
            >
              Login Tutor
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPelajar;
