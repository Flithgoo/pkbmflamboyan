"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { FaArrowLeft } from "react-icons/fa";

export default function LoginSelection() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-amber-50">
      <motion.div
        className="bg-white rounded-3xl shadow-2xl p-10 max-w-md w-full"
        initial={{ opacity: 0, scale: 0.95, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <h1 className="text-3xl font-bold text-emerald-600 mb-2 text-center">
          Selamat Datang
        </h1>
        <p className="text-gray-500 mb-8 text-center">Pilih jenis login Anda</p>
        <div className="flex flex-col gap-6">
          <motion.div whileHover={{ scale: 1.03 }}>
            <Link
              href="/login/pelajar"
              className="flex items-center gap-4 px-6 py-4 rounded-xl border border-emerald-100 hover:bg-emerald-50 transition group"
            >
              <span className="flex items-center justify-center w-12 h-12 rounded-full bg-emerald-100 group-hover:bg-emerald-200 transition">
                <svg width="28" height="28" fill="none" viewBox="0 0 24 24">
                  <circle cx="12" cy="8" r="4" fill="#10B981" />
                  <path d="M4 20c0-2.21 3.58-4 8-4s8 1.79 8 4" fill="#10B981" />
                </svg>
              </span>
              <div>
                <div className="font-semibold text-emerald-700">
                  Login Pelajar
                </div>
                <div className="text-sm text-gray-400">
                  Akses materi & tugas
                </div>
              </div>
            </Link>
          </motion.div>
          <motion.div whileHover={{ scale: 1.03 }}>
            <Link
              href="/login/tutor"
              className="flex items-center gap-4 px-6 py-4 rounded-xl border border-amber-100 hover:bg-amber-50 transition group"
            >
              <span className="flex items-center justify-center w-12 h-12 rounded-full bg-amber-100 group-hover:bg-amber-200 transition">
                <svg width="28" height="28" fill="none" viewBox="0 0 24 24">
                  <rect
                    x="6"
                    y="4"
                    width="12"
                    height="8"
                    rx="4"
                    fill="#F59E0B"
                  />
                  <path d="M4 20c0-2.21 3.58-4 8-4s8 1.79 8 4" fill="#F59E0B" />
                </svg>
              </span>
              <div>
                <div className="font-semibold text-amber-700">Login Tutor</div>
                <div className="text-sm text-gray-400">
                  Kelola kelas & materi
                </div>
              </div>
            </Link>
          </motion.div>
          <motion.div whileHover={{ scale: 1.03 }}>
            <Link
              href="/login/admin"
              className="flex items-center gap-4 px-6 py-4 rounded-xl border border-gray-200 hover:bg-gray-50 transition group"
            >
              <span className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-200 group-hover:bg-gray-300 transition">
                <svg width="28" height="28" fill="none" viewBox="0 0 24 24">
                  <rect
                    x="8"
                    y="4"
                    width="8"
                    height="8"
                    rx="4"
                    fill="#64748B"
                  />
                  <rect
                    x="4"
                    y="16"
                    width="16"
                    height="4"
                    rx="2"
                    fill="#64748B"
                  />
                </svg>
              </span>
              <div>
                <div className="font-semibold text-gray-700">Login Admin</div>
                <div className="text-sm text-gray-400">Manajemen sistem</div>
              </div>
            </Link>
          </motion.div>
        </div>
        <div className="mt-8 text-center">
          <Link
            href="/"
            className="flex items-center justify-center gap-2 mt-2 text-emerald-600 hover:text-emerald-900 font-semibold transition"
          >
            <FaArrowLeft />
            Kembali ke Beranda
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
