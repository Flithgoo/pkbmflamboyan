"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  BookOpen,
  CheckCircle,
  Clock,
  Search,
  ChevronRight,
  Bell,
  PlusCircle,
} from "lucide-react";
import { useUserStore } from "@/src/store/useUserStore";

const sampleCourses = [
  {
    id: "1",
    title: "Matematika Dasar",
    description: "Operasi hitung dasar dan penerapan sehari-hari.",
    progress: 48,
    lessons: 12,
    updated_at: "2025-07-10",
    cover: "/assets/course_cover/math.jpg",
  },
  {
    id: "2",
    title: "Bahasa Indonesia",
    description: "Pemahaman teks, menulis dan tata bahasa praktis.",
    progress: 78,
    lessons: 8,
    updated_at: "2025-07-05",
    cover: "/assets/course_cover/indo.jpg",
  },
];

export default function PelajarDashboard() {
  const { user } = useUserStore();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "in-progress" | "completed">(
    "all"
  );

  const courses = useMemo(() => {
    return sampleCourses.filter((c) => {
      if (filter === "in-progress" && c.progress >= 100) return false;
      if (filter === "completed" && c.progress < 100) return false;
      if (!query) return true;
      return (
        c.title.toLowerCase().includes(query.toLowerCase()) ||
        c.description.toLowerCase().includes(query.toLowerCase())
      );
    });
  }, [query, filter]);

  const avgProgress =
    sampleCourses.length > 0
      ? Math.round(
          sampleCourses.reduce((s, c) => s + c.progress, 0) /
            sampleCourses.length
        )
      : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-amber-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Top bar */}
        <div className="flex items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-emerald-800">
              Halo, {user?.name ?? "Peserta"}
            </h1>
            <p className="text-sm text-gray-600">
              Semangat belajar di PKBM Flamboyan 🚀
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center bg-white rounded-lg shadow px-3 py-2 gap-2 w-[420px]">
              <Search className="text-emerald-500" size={16} />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Cari materi atau kelas..."
                className="w-full text-sm bg-transparent focus:outline-none"
              />
              <button
                onClick={() =>
                  setFilter((f) =>
                    f === "all"
                      ? "in-progress"
                      : f === "in-progress"
                      ? "completed"
                      : "all"
                  )
                }
                className="inline-flex items-center gap-2 bg-emerald-600 text-white px-3 py-1 rounded-md text-sm hover:bg-emerald-700 transition"
              >
                Quick Filter
              </button>
            </div>

            <button
              className="relative inline-flex items-center justify-center w-10 h-10 rounded-lg bg-white shadow hover:shadow-md transition"
              aria-label="notifications"
            >
              <Bell className="text-emerald-700" size={18} />
              <span className="absolute -top-1 -right-1 bg-amber-500 text-white text-xs rounded-full px-1">
                2
              </span>
            </button>

            <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-emerald-200">
              <Image
                src={
                  user?.profile_picture ??
                  "/assets/placeholder_profile/placeholder_avatar.png"
                }
                alt={user?.name ?? "Avatar"}
                width={40}
                height={40}
                className="object-cover"
              />
            </div>
          </div>
        </div>

        {/* Layout grid */}
        <main className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: summary & quick actions */}
          <aside className="lg:col-span-1 space-y-4">
            <div className="bg-white rounded-2xl p-4 shadow">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-emerald-700">
                  Ringkasan
                </h3>
                <span className="text-xs text-gray-400">
                  Terakhir: sekarang
                </span>
              </div>

              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-center justify-between">
                  <span>Jumlah Materi</span>
                  <span className="font-semibold text-emerald-800">
                    {sampleCourses.length}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span>Materi Selesai</span>
                  <span className="font-semibold text-emerald-800">
                    {sampleCourses.filter((c) => c.progress >= 100).length}
                  </span>
                </div>

                <div>
                  <div className="text-xs text-gray-500 mb-1">
                    Progress rata-rata
                  </div>
                  <div className="w-full bg-emerald-100 rounded-full h-3 overflow-hidden">
                    <div
                      className="h-3 bg-emerald-600"
                      style={{ width: `${avgProgress}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-4 shadow">
              <h4 className="text-sm font-semibold text-emerald-700 mb-3">
                Tindakan Cepat
              </h4>
              <div className="flex flex-col gap-2">
                <Link
                  href="/LMS/pelajar/absensi"
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-amber-50 hover:bg-amber-100 text-emerald-700"
                >
                  <Clock size={16} /> Cek Absensi
                </Link>
                <Link
                  href="/LMS/pelajar/riwayat"
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-emerald-50 hover:bg-emerald-100 text-emerald-700"
                >
                  <CheckCircle size={16} /> Riwayat Nilai
                </Link>
                <Link
                  href="/LMS/pelajar/tugas"
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-emerald-600 text-white hover:bg-emerald-700"
                >
                  <PlusCircle size={16} /> Unggah Tugas
                </Link>
              </div>
            </div>
          </aside>

          {/* Right: courses & activity */}
          <section className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-emerald-800">
                Kursus Saya
              </h2>
              <div className="text-sm text-gray-500 hidden md:block">
                Filter: {filter}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {courses.length > 0 ? (
                courses.map((c) => (
                  <article
                    key={c.id}
                    className="bg-white rounded-2xl p-4 shadow hover:shadow-lg transition flex flex-col"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-20 h-20 rounded-lg overflow-hidden bg-emerald-50 flex-shrink-0">
                        <Image
                          src={c.cover}
                          alt={c.title}
                          width={80}
                          height={80}
                          className="object-cover w-full h-full"
                        />
                      </div>

                      <div className="flex-1">
                        <h3 className="font-semibold text-emerald-800">
                          {c.title}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                          {c.description}
                        </p>

                        <div className="mt-3 flex items-center justify-between">
                          <div className="text-xs text-gray-500">
                            {c.lessons} materi •{" "}
                            {new Date(c.updated_at).toLocaleDateString("id-ID")}
                          </div>
                          <div className="text-sm font-medium text-emerald-700">
                            {c.progress}%
                          </div>
                        </div>

                        <div className="mt-2 w-full bg-emerald-100 rounded-full h-2 overflow-hidden">
                          <div
                            className="h-2 bg-emerald-600"
                            style={{ width: `${c.progress}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                      <Link
                        href={`/LMS/pelajar/materi/${c.id}`}
                        className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 hover:text-amber-600"
                      >
                        <BookOpen size={16} /> Mulai / Lanjut{" "}
                        <ChevronRight size={14} />
                      </Link>

                      <button
                        className="text-xs text-gray-500 bg-emerald-50 px-3 py-1 rounded-md hover:bg-emerald-100"
                        title="Tandai selesai"
                      >
                        Tandai Selesai
                      </button>
                    </div>
                  </article>
                ))
              ) : (
                <div className="text-center text-gray-500 py-8 col-span-full">
                  Belum ada kursus.
                </div>
              )}
            </div>

            <div className="bg-white rounded-2xl p-4 shadow">
              <h3 className="text-sm font-semibold text-emerald-700 mb-3">
                Aktivitas Terbaru
              </h3>
              <ul className="space-y-3 text-sm text-gray-600">
                <li className="flex items-start justify-between">
                  <div>
                    <div className="font-medium text-emerald-800">
                      Matematika Dasar
                    </div>
                    <div className="text-xs text-gray-500">
                      Menyelesaikan kuis 1 • 2 hari lalu
                    </div>
                  </div>
                  <div className="text-xs text-gray-400">100 pts</div>
                </li>

                <li className="flex items-start justify-between">
                  <div>
                    <div className="font-medium text-emerald-800">
                      Bahasa Indonesia
                    </div>
                    <div className="text-xs text-gray-500">
                      Mengunggah tugas • 5 hari lalu
                    </div>
                  </div>
                  <div className="text-xs text-gray-400">85 pts</div>
                </li>
              </ul>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
