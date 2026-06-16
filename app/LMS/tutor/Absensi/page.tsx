"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  Clock,
  BookOpen,
  MapPin,
  ChevronRight,
  ChevronLeft,
  ChevronUp,
  ChevronDown,
  List,
  TimerOff,
  Users,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Loading from "@/app/components/Loading";
import { useUserStore } from "@/src/store/useUserStore";
import { getTutorAttendanceSessions } from "@/lib/api/attendance";

interface AttendanceSession {
  id: number;
  title: string;
  subject_name: string;
  location: string;

  created_at: string;

  session_start: string;
  session_end: string;

  upload_type: string;

  total_students: number;
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

const getLocationColor = (location: string) => {
  switch (location) {
    case "PKBM Flamboyan":
      return "bg-teal-100 text-teal-800 border-teal-300";
    case "Pondok Sidokare":
      return "bg-stone-100 text-stone-800 border-stone-300";
    case "Pondok Gedeg":
      return "bg-amber-100 text-amber-800 border-amber-300";
    default:
      return "bg-gray-100 text-gray-800 border-gray-300";
  }
};

const getLocationIcon = (location: string) => {
  return <MapPin size={14} />;
};

const SortableHeader = ({
  column,
  label,
  sortColumn,
  sortDirection,
  onSort,
}: {
  column: keyof AttendanceSession;
  label: string;
  sortColumn: keyof AttendanceSession | null;
  sortDirection: "asc" | "desc";
  onSort: (column: keyof AttendanceSession) => void;
}) => {
  const isActive = sortColumn === column;

  return (
    <button
      onClick={() => onSort(column)}
      className="flex items-center gap-2 hover:text-emerald-100 transition group"
    >
      <span>{label}</span>
      <div className="flex flex-col gap-0.5 opacity-60 group-hover:opacity-100 transition">
        <ChevronUp
          size={14}
          className={`${
            isActive && sortDirection === "asc" ? "opacity-100" : "opacity-40"
          } transition`}
        />
        <ChevronDown
          size={14}
          className={`${
            isActive && sortDirection === "desc" ? "opacity-100" : "opacity-40"
          } transition -mt-1`}
        />
      </div>
    </button>
  );
};

export default function AbsensiPage() {
  const { user } = useUserStore();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"semua" | "aktif" | "selesai">("semua");
  const [sessions, setSessions] = useState<AttendanceSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [sortColumn, setSortColumn] = useState<keyof AttendanceSession | null>(
    null,
  );
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  useEffect(() => {
    async function fetchAttendanceSessions() {
      if (!user?.id) return;

      setLoading(true);

      const { data, error } = await getTutorAttendanceSessions(user.id);

      if (!error && data) {
        setSessions(data);
      }

      setLoading(false);
    }

    fetchAttendanceSessions();
  }, [user?.id]);

  const filteredSessions = useMemo(() => {
    return sessions.filter((session) => {
      const matchSearch =
        session.title.toLowerCase().includes(search.toLowerCase()) ||
        session.subject_name.toLowerCase().includes(search.toLowerCase());

      const active = new Date(session.session_end) > new Date();

      const matchFilter =
        filter === "semua" ? true : filter === "aktif" ? active : !active;

      return matchSearch && matchFilter;
    });
  }, [sessions, search, filter]);

  const stats = useMemo(() => {
    return {
      totalSessions: sessions.length,
      activeSessions: sessions.filter(
        (s) => new Date(s.session_end) > new Date(),
      ).length,
      finishedSessions: sessions.filter(
        (s) => new Date(s.session_end) <= new Date(),
      ).length,
      totalStudents: sessions.reduce((sum, s) => sum + s.total_students, 0),
    };
  }, [sessions]);

  // Sorting logic
  const sortedSessions = [...filteredSessions].sort((a, b) => {
    if (!sortColumn) return 0;

    let aValue = a[sortColumn];
    let bValue = b[sortColumn];

    // Handle string comparisons
    if (typeof aValue === "string" && typeof bValue === "string") {
      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();
      return sortDirection === "asc"
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }

    // Handle date comparisons
    if (
      sortColumn === "created_at" ||
      sortColumn === "session_start" ||
      sortColumn === "session_end"
    ) {
      aValue = new Date(a[sortColumn]).getTime();

      bValue = new Date(b[sortColumn]).getTime();
      return sortDirection === "asc"
        ? (aValue as number) - (bValue as number)
        : (bValue as number) - (aValue as number);
    }

    return 0;
  });

  // Pagination logic
  const totalPages =
    itemsPerPage === 0 ? 1 : Math.ceil(sortedSessions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex =
    itemsPerPage === 0 ? sortedSessions.length : startIndex + itemsPerPage;
  const paginatedSessions =
    itemsPerPage === 0
      ? sortedSessions
      : sortedSessions.slice(startIndex, endIndex);

  // Reset to page 1 when search term changes
  const handleSearch = (value: string) => {
    setSearch(value);
    setCurrentPage(1);
  };

  const handleItemsPerPageChange = (newValue: number) => {
    setItemsPerPage(newValue);
    setCurrentPage(1);
  };

  const handleSort = (column: keyof AttendanceSession) => {
    if (sortColumn === column) {
      // Toggle direction jika column yang sama diklik
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      // Set column baru dengan default ascending
      setSortColumn(column);
      setSortDirection("asc");
    }
    setCurrentPage(1);
  };

  const goToPage = (page: number) => {
    const pageNum = Math.max(1, Math.min(page, totalPages));
    const statsTop = document.getElementById("stats")?.offsetTop ?? 0;

    setCurrentPage(pageNum);
    window.scrollTo({
      top: statsTop + 100,
      behavior: "smooth",
    });
  };

  if (loading) {
    return <Loading text="Memuat sesi absensi..." />;
  }

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
            placeholder="Cari berdasarkan materi, mapel, atau lokasi..."
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            className="border-emerald-200 focus:ring-emerald-500"
          />
        </div>
      </div>

      {/* Stats Cards */}
      <div id="stats" className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow p-4 border-t-4 border-emerald-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total Sesi</p>
              <p className="text-3xl font-bold text-emerald-700 mt-1">
                {sessions.length}
              </p>
            </div>
            <List size={40} className="text-emerald-200" />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow p-4 border-t-4 border-amber-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Sesi Aktif</p>
              <p className="text-3xl font-bold text-amber-700 mt-1">
                {
                  sortedSessions.filter(
                    (s) => new Date(s.session_end) > new Date(),
                  ).length
                }
              </p>
            </div>
            <Clock size={40} className="text-amber-200" />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow p-4 border-t-4 border-emerald-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Sesi Selesai</p>
              <p className="text-3xl font-bold text-emerald-600 mt-1">
                {
                  sortedSessions.filter(
                    (s) => new Date(s.session_end) < new Date(),
                  ).length
                }
              </p>
            </div>
            <TimerOff size={40} className="text-emerald-200" />
          </div>
        </div>
      </div>

      {/* Attendance Sessions Table - Desktop */}
      <div className="hidden md:block bg-white rounded-2xl shadow-lg overflow-hidden border border-emerald-100">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white">
              <tr>
                <th className="px-3 py-4 text-left text-sm font-semibold">
                  <SortableHeader
                    column="title"
                    label="Materi"
                    sortColumn={sortColumn}
                    sortDirection={sortDirection}
                    onSort={handleSort}
                  />
                </th>
                <th className="px-1 py-4 text-center text-sm font-semibold">
                  <SortableHeader
                    column="total_students"
                    label="Total Siswa"
                    sortColumn={sortColumn}
                    sortDirection={sortDirection}
                    onSort={handleSort}
                  />
                </th>
                <th className="px-3 py-4 text-left text-sm font-semibold">
                  <SortableHeader
                    column="subject_name"
                    label="Mapel"
                    sortColumn={sortColumn}
                    sortDirection={sortDirection}
                    onSort={handleSort}
                  />
                </th>
                <th className="px-3 py-4 text-left text-sm font-semibold">
                  <SortableHeader
                    column="location"
                    label="Lokasi"
                    sortColumn={sortColumn}
                    sortDirection={sortDirection}
                    onSort={handleSort}
                  />
                </th>
                <th className="px-3 py-4 text-left text-sm font-semibold">
                  <SortableHeader
                    column="created_at"
                    label="Tanggal"
                    sortColumn={sortColumn}
                    sortDirection={sortDirection}
                    onSort={handleSort}
                  />
                </th>
                <th className="px-3 py-4 text-center text-sm font-semibold">
                  Kelola
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {paginatedSessions.length > 0 ? (
                paginatedSessions.map((session, idx) => (
                  <tr
                    key={session.id}
                    className={`hover:bg-emerald-50 transition cursor-pointer ${
                      idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                    }`}
                  >
                    <td className="ps-3 py-4">
                      <div className="text-sm max-w-48 font-semibold text-gray-800">
                        {session.title}
                      </div>
                    </td>
                    <td className="px-2 py-4">
                      <div className="ps-7 text-sm font-medium">
                        {session.total_students}
                      </div>
                    </td>
                    <td className="px-3 py-4">
                      <div
                        className={`inline-flex items-center gap-2 px-3 py-1 ${session.upload_type === "Tugas" ? "bg-cyan-100 text-cyan-800 border-cyan-300" : "bg-emerald-100 text-emerald-800 border-emerald-300"} rounded-full text-xs font-semibold border`}
                      >
                        <BookOpen size={14} />
                        {session.subject_name}
                      </div>
                    </td>
                    <td className="px-3 py-4">
                      <div
                        className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold border ${getLocationColor(
                          session.location,
                        )}`}
                      >
                        {getLocationIcon(session.location)}
                        {session.location}
                      </div>
                    </td>
                    <td className="ps-3 py-4 text-sm text-gray-600">
                      <div className="font-medium">
                        {/* absensi start */}
                        {getRelativeDate(session.session_start)}
                      </div>
                      <div className="text-xs text-gray-500">
                        {/* created_at */}
                        {new Date(session.created_at).toLocaleDateString(
                          "id-ID",
                        )}
                      </div>
                    </td>
                    <td className="ps-1 py-4 text-center">
                      <Link
                        href={`/LMS/tutor/Absensi/${session.id}`}
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
                    className="px-3 py-12 text-center text-gray-500"
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
        {paginatedSessions.length > 0 ? (
          paginatedSessions.map((session) => (
            <Link
              key={session.id}
              href={`/LMS/tutor/attendance/${session.id}`}
              className="block bg-white rounded-xl shadow hover:shadow-lg transition border-l-4 border-emerald-500 p-4"
            >
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-base font-bold text-gray-900 flex-1">
                  {session.title}
                </h3>
                <ChevronRight
                  size={20}
                  className="text-emerald-600 flex-shrink-0"
                />
              </div>
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2">
                  <BookOpen
                    size={16}
                    className={`${session.upload_type === "Tugas" ? "text-cyan-600" : "text-emerald-600"}`}
                  />
                  <span className="text-sm font-medium text-gray-700">
                    {session.subject_name}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin size={16} className="text-purple-600" />
                  <span className="text-sm font-medium text-gray-700">
                    {session.location}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Users size={16} className="text-slate-600" />
                  <span className="text-sm font-medium text-gray-700">
                    {session.total_students} Siswa
                  </span>
                </div>
              </div>
              <div className="pt-3 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-xs text-gray-500 font-medium">
                      {/* session_start */}
                      {getRelativeDate(session.session_start)}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {/* created_at */}
                      {new Date(session.created_at).toLocaleDateString("id-ID")}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="inline-flex items-center px-2 py-1 text-xs font-semibold text-emerald-700 bg-emerald-50 rounded-lg">
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

      {/* Pagination */}
      {sortedSessions.length > 0 && (
        <div className="mt-8 flex flex-col lg:flex-row items-center justify-between gap-4 bg-white rounded-xl shadow p-6 border border-emerald-100">
          {/* Items Per Page Selector */}
          <div className="flex items-center gap-3 w-full lg:w-auto">
            <label className="text-sm font-medium text-gray-700 whitespace-nowrap">
              Tampilkan:
            </label>
            <Select
              value={itemsPerPage === 0 ? "all" : String(itemsPerPage)}
              onValueChange={(value) => {
                if (value === "all") {
                  handleItemsPerPageChange(0);
                } else {
                  handleItemsPerPageChange(parseInt(value));
                }
              }}
            >
              <SelectTrigger className="flex-1 lg:flex-initial border-2 border-emerald-200 hover:border-emerald-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 data-[state=open]:border-emerald-500 data-[state=open]:ring-2 data-[state=open]:ring-emerald-200">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="border-2 border-emerald-200">
                <SelectItem value="5">5 per halaman</SelectItem>
                <SelectItem value="10">10 per halaman</SelectItem>
                <SelectItem value="15">15 per halaman</SelectItem>
                <SelectItem value="25">25 per halaman</SelectItem>
                <SelectItem value="all">Tampilkan Semua</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Info Text */}
          <div className="text-sm text-gray-600 font-medium text-center lg:text-right">
            {itemsPerPage === 0 ? (
              <span>
                Menampilkan semua{" "}
                <span className="font-bold text-emerald-700">
                  {sortedSessions.length}
                </span>{" "}
                sesi
              </span>
            ) : (
              <span>
                Menampilkan{" "}
                <span className="font-bold text-emerald-700">
                  {startIndex + 1}
                </span>{" "}
                -{" "}
                <span className="font-bold text-emerald-700">
                  {Math.min(endIndex, sortedSessions.length)}
                </span>{" "}
                dari{" "}
                <span className="font-bold text-emerald-700">
                  {sortedSessions.length}
                </span>{" "}
                sesi
              </span>
            )}
          </div>

          {/* Pagination Controls - Hide when showing all */}
          {itemsPerPage !== 0 && totalPages > 1 && (
            <div className="flex items-center gap-2 w-full lg:w-auto justify-center text-sm">
              {/* Previous Button */}
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition ${
                  currentPage === 1
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 active:bg-emerald-200"
                }`}
              >
                <ChevronLeft size={18} />
                <span className="hidden sm:inline">Sebelumnya</span>
              </button>

              {/* Page Numbers */}
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => {
                    // Show first page, last page, current page, and adjacent pages
                    const isVisible =
                      page === 1 ||
                      page === totalPages ||
                      Math.abs(page - currentPage) <= 1;

                    if (!isVisible) {
                      if (page === 2 || page === totalPages - 1) {
                        return (
                          <span key={page} className="px-1 py-1 text-gray-400">
                            ...
                          </span>
                        );
                      }
                      return null;
                    }

                    return (
                      <button
                        key={page}
                        onClick={() => goToPage(page)}
                        className={`w-10 h-10 rounded-lg font-semibold transition ${
                          currentPage === page
                            ? "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-md"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200 active:bg-gray-300"
                        }`}
                      >
                        {page}
                      </button>
                    );
                  },
                )}
              </div>

              {/* Next Button */}
              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition ${
                  currentPage === totalPages
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 active:bg-emerald-200"
                }`}
              >
                <span className="hidden sm:inline">Selanjutnya</span>
                <ChevronRight size={18} />
              </button>
            </div>
          )}
        </div>
      )}

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
