"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Clock, BookOpen, Users, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";

interface AttendanceSession {
  id: number;
  material_name: string;
  subject_name: string;
  class_name: string;
  date: string;
  session_start: string;
}

const getRelativeDate = (dateString: string): string => {
  const date = new Date(dateString);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const lastWeek = new Date(today);
  lastWeek.setDate(lastWeek.getDate() - 7);

  if (date.toDateString() === today.toDateString()) {
    return "Hari Ini";
  } else if (date.toDateString() === yesterday.toDateString()) {
    return "Kemarin";
  } else if (date > lastWeek) {
    return "Minggu Lalu";
  }

  return date.toLocaleDateString("id-ID", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export default function AbsensiPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [sessions, setSessions] = useState<AttendanceSession[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data - ganti dengan API call sebenarnya
    const mockSessions: AttendanceSession[] = [
      {
        id: 1,
        material_name: "Algoritma Dasar",
        subject_name: "Informatika",
        class_name: "7",
        date: new Date().toISOString().split("T")[0],
        session_start: new Date().toISOString(),
      },
      {
        id: 2,
        material_name: "Word Dasar",
        subject_name: "Informatika",
        class_name: "5",
        date: new Date(Date.now() - 86400000).toISOString().split("T")[0],
        session_start: new Date(Date.now() - 86400000).toISOString(),
      },
      {
        id: 3,
        material_name: "SPOK",
        subject_name: "Bahasa Indonesia",
        class_name: "6",
        date: new Date(Date.now() - 604800000).toISOString().split("T")[0],
        session_start: new Date(Date.now() - 604800000).toISOString(),
      },
      {
        id: 4,
        material_name: "Excel Lanjutan",
        subject_name: "Informatika",
        class_name: "8",
        date: new Date(Date.now() - 172800000).toISOString().split("T")[0],
        session_start: new Date(Date.now() - 172800000).toISOString(),
      },
      {
        id: 5,
        material_name: "Tenses",
        subject_name: "Bahasa Inggris",
        class_name: "9",
        date: new Date(Date.now() - 1296000000).toISOString().split("T")[0],
        session_start: new Date(Date.now() - 1296000000).toISOString(),
      },
    ];
    setSessions(mockSessions);
    setLoading(false);
  }, []);

  const filteredSessions = sessions.filter((session) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      session.material_name.toLowerCase().includes(searchLower) ||
      session.subject_name.toLowerCase().includes(searchLower) ||
      session.class_name.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="min-h-screen flex-grow bg-gradient-to-br from-emerald-50 to-amber-50 p-4 md:p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-emerald-700 flex items-center gap-3">
              <Clock size={36} className="text-amber-500" />
              Manajemen Absensi
            </h1>
            <p className="text-gray-600 mt-2 text-sm md:text-base">
              Kelola semua sesi absensi yang telah dibuat
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="bg-white rounded-xl shadow-md p-4 border-l-4 border-emerald-500">
          <Input
            type="text"
            placeholder="Cari berdasarkan materi, mapel, atau kelas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border-emerald-200 focus:ring-emerald-500"
          />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow p-4 border-t-4 border-emerald-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total Sesi</p>
              <p className="text-3xl font-bold text-emerald-700 mt-1">
                {sessions.length}
              </p>
            </div>
            <Clock size={40} className="text-emerald-200" />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow p-4 border-t-4 border-amber-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Sesi Aktif</p>
              <p className="text-3xl font-bold text-amber-700 mt-1">
                {sessions.filter((s) => new Date(s.date) >= new Date()).length}
              </p>
            </div>
            <BookOpen size={40} className="text-amber-200" />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow p-4 border-t-4 border-emerald-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Sesi Selesai</p>
              <p className="text-3xl font-bold text-emerald-600 mt-1">
                {sessions.filter((s) => new Date(s.date) < new Date()).length}
              </p>
            </div>
            <Users size={40} className="text-emerald-200" />
          </div>
        </div>
      </div>

      {/* Attendance Sessions Table - Desktop */}
      <div className="hidden md:block bg-white rounded-2xl shadow-lg overflow-hidden border border-emerald-100">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold">
                  Materi
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold">
                  Mapel
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold">
                  Kelas
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold">
                  Tanggal
                </th>
                <th className="px-6 py-4 text-center text-sm font-semibold">
                  Kelola
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredSessions.length > 0 ? (
                filteredSessions.map((session, idx) => (
                  <tr
                    key={session.id}
                    className={`hover:bg-emerald-50 transition cursor-pointer ${
                      idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                    }`}
                  >
                    <td className="px-6 py-4">
                      <div className="text-sm font-semibold text-gray-900">
                        {session.material_name}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold border border-blue-300">
                        <BookOpen size={14} />
                        {session.subject_name}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-semibold border border-purple-300">
                        <Users size={14} />
                        Kelas {session.class_name}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      <div className="font-medium">
                        {getRelativeDate(session.date)}
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(session.date).toLocaleDateString("id-ID")}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <Link
                        href={`/LMS/tutor/attendance/${session.id}`}
                        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition"
                      >
                        Lihat Detail
                        <ChevronRight size={16} />
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-12 text-center text-gray-500"
                  >
                    Tidak ada sesi absensi ditemukan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Attendance Sessions Cards - Mobile */}
      <div className="md:hidden space-y-4">
        {filteredSessions.length > 0 ? (
          filteredSessions.map((session) => (
            <Link
              key={session.id}
              href={`/LMS/tutor/attendance/${session.id}`}
              className="block bg-white rounded-xl shadow hover:shadow-lg transition border-l-4 border-emerald-500 p-4"
            >
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-base font-bold text-gray-900 flex-1">
                  {session.material_name}
                </h3>
                <ChevronRight
                  size={20}
                  className="text-emerald-600 flex-shrink-0"
                />
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2">
                  <BookOpen size={16} className="text-blue-600" />
                  <span className="text-sm font-medium text-gray-700">
                    {session.subject_name}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Users size={16} className="text-purple-600" />
                  <span className="text-sm font-medium text-gray-700">
                    Kelas {session.class_name}
                  </span>
                </div>
              </div>

              <div className="pt-3 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-xs text-gray-500 font-medium">
                      {getRelativeDate(session.date)}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(session.date).toLocaleDateString("id-ID")}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="inline-flex items-center px-2 py-1 text-xs font-semibold text-emerald-600 bg-emerald-50 rounded-lg">
                      Kelola →
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <div className="bg-white rounded-xl p-8 text-center text-gray-500 shadow">
            Tidak ada sesi absensi ditemukan.
          </div>
        )}
      </div>

      {/* Info Banner */}
      <div className="mt-8 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-2xl p-6 text-white shadow-lg">
        <h3 className="text-lg font-semibold mb-2">Tip</h3>
        <p className="text-emerald-50 text-sm">
          Klik pada sesi absensi untuk melihat detail, mengelola absensi
          pelajar, dan membuat laporan kehadiran.
        </p>
      </div>
    </div>
  );
}
