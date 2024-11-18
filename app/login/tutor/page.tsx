"use client"; // Jika menggunakan struktur app

import React, { useState } from "react";
import { useRouter } from "next/navigation"; // Gunakan 'next/router' jika di pages

type FormData = {
  username: string;
  password: string;
};

const LoginTutor: React.FC = () => {
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
    // Logika autentikasi login tutor
    console.log("Form Submitted:", formData);

    // Contoh logika setelah login berhasil
    // TODO: Panggil API login dan validasi autentikasi
    if (
      formData.username === "tutor@example.com" &&
      formData.password === "password"
    ) {
      router.push("/tutor/dashboard"); // Redireksi ke halaman dashboard
    } else {
      alert("Login gagal. Periksa username dan password Anda.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-gray-800 text-center mb-6">
          Login Tutor
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
              className="mt-1 block text-slate-900 w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
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
              className="mt-1 block text-slate-900 w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="Masukkan password"
            />
          </div>

          {/* Tombol Login */}
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginTutor;
