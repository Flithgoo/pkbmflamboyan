"use client";

import React from "react";
import Link from "next/link";
import { useUserStore } from "@/src/store/useUserStore";

export default function DashboardPage() {
  const { user } = useUserStore();

  return (
    <div className="flex flex-grow min-h-screen">
      {/* Sidebar */}

      {/* Main Content */}
      <main className="flex-1 p-6 bg-gray-50 grid gap-6">
        <h2 className="text-2xl font-semibold">
          Selamat datang {(user as { name: string }).name}
        </h2>
        {/* Mata Pelajaran */}
        <div className="bg-white rounded-2xl shadow p-4">
          <h3 className="text-xl font-semibold mb-2">Mata Pelajaran</h3>
          <ul className="grid gap-2">
            <li className="bg-gray-100 p-2 rounded hover:bg-gray-200">
              <Link href="/mapel/matematika">Matematika</Link>
            </li>
            <li className="bg-gray-100 p-2 rounded hover:bg-gray-200">
              <Link href="/mapel/bahasa-indonesia">Bahasa Indonesia</Link>
            </li>
          </ul>
        </div>
        {/* Progress Belajar */}
        <div className="bg-white rounded-2xl shadow p-4">
          <h3 className="text-xl font-semibold mb-2">Progress Belajar</h3>
          <div className="grid gap-2">
            <div className="flex justify-between">
              <span>Matematika</span>
              <span>3/5 Materi</span>
            </div>
            <div className="w-full bg-gray-200 h-2 rounded">
              <div className="bg-blue-500 h-2 rounded w-3/5"></div>
            </div>
          </div>
        </div>
        {/* Tugas */}
        <div className="bg-white rounded-2xl shadow p-4">
          <h3 className="text-xl font-semibold mb-2">Tugas</h3>
          <ul className="grid gap-2">
            <li className="bg-yellow-50 border-l-4 border-yellow-400 p-2 rounded">
              <div className="flex justify-between">
                <span>Tugas 1 - Matematika</span>
                <span className="text-sm text-gray-500">
                  Deadline: 10 April
                </span>
              </div>
              <Link href="/tugas/1" className="text-blue-600 text-sm">
                Upload Jawaban
              </Link>
            </li>
          </ul>
        </div>
        {/* Pengumuman */}
        <div className="bg-white rounded-2xl shadow p-4">
          <h3 className="text-xl font-semibold mb-2">Pengumuman</h3>
          <ul className="text-sm text-gray-700 list-disc pl-4">
            <li>Kelas daring dimulai setiap Senin pukul 09.00 WIB.</li>
            <li>Jangan lupa kumpulkan tugas sebelum deadline.</li>
          </ul>
        </div>
      </main>
    </div>
  );
}
