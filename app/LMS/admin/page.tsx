"use client";

import React from "react";

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
        <p className="text-gray-600">Selamat datang di halaman admin PKBM Flamboyan.</p>
      </header>
      <main className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-2">Pengguna</h2>
          <p className="text-gray-600">Kelola data siswa, guru, dan admin.</p>
          <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            Lihat Pengguna
          </button>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-2">Kelas & Materi</h2>
          <p className="text-gray-600">Atur kelas, materi, dan tugas pembelajaran.</p>
          <button className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
            Kelola Kelas
          </button>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-2">Laporan</h2>
          <p className="text-gray-600">Lihat statistik dan laporan aktivitas.</p>
          <button className="mt-4 px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700">
            Lihat Laporan
          </button>
        </div>
      </main>
    </div>
  );
}