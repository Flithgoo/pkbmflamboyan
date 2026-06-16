"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  Clock,
  Users,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Download,
  Edit2,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Loading from "@/app/components/Loading";

interface AttendanceRecord {
  id: number;
  student_id: string;
  student_name: string;
  status: "hadir" | "absen" | "izin";
  attendance_time: string | null;
}

interface SessionDetail {
  id: number;
  material_name: string;
  subject_name: string;
  class_name: string;
  date: string;
  session_start: string;
  session_end: string;
}

const SortableHeader = ({
  column,
  label,
  sortColumn,
  sortDirection,
  onSort,
}: {
  column: string;
  label: string;
  sortColumn: string | null;
  sortDirection: "asc" | "desc";
  onSort: (column: string) => void;
}) => {
  const isActive = sortColumn === column;

  return (
    <button
      onClick={() => onSort(column)}
      className="flex items-center gap-2 hover:text-emerald-600 transition group"
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

export default function AttendanceDetailPage() {
  const params = useParams();
  const sessionId = params.id as string;

  const [session, setSession] = useState<SessionDetail | null>(null);
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [filteredRecords, setFilteredRecords] = useState<AttendanceRecord[]>(
    [],
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  useEffect(() => {
    // Mock data - ganti dengan API call sebenarnya
    const mockSession: SessionDetail = {
      id: parseInt(sessionId),
      material_name: "Algoritma Dasar",
      subject_name: "Informatika",
      class_name: "7",
      date: new Date().toISOString().split("T")[0],
      session_start: "08:00",
      session_end: "09:30",
    };

    const mockRecords: AttendanceRecord[] = [
      {
        id: 1,
        student_id: "001",
        student_name: "Ahmad Rizki Pratama",
        status: "hadir",
        attendance_time: "08:00",
      },
      {
        id: 2,
        student_id: "002",
        student_name: "Budi Santoso",
        status: "hadir",
        attendance_time: "08:05",
      },
      {
        id: 3,
        student_id: "003",
        student_name: "Citra Dewi",
        status: "izin",
        attendance_time: null,
      },
      {
        id: 4,
        student_id: "004",
        student_name: "Dedi Gunawan",
        status: "absen",
        attendance_time: null,
      },
      {
        id: 5,
        student_id: "005",
        student_name: "Eka Putri",
        status: "hadir",
        attendance_time: "08:10",
      },
      {
        id: 6,
        student_id: "006",
        student_name: "Fajar Ismanto",
        status: "izin",
        attendance_time: null,
      },
      {
        id: 7,
        student_id: "007",
        student_name: "Gina Nur Aziz",
        status: "hadir",
        attendance_time: "08:02",
      },
      {
        id: 8,
        student_id: "008",
        student_name: "Hendra Wijaya",
        status: "absen",
        attendance_time: null,
      },
    ];

    setSession(mockSession);
    setRecords(mockRecords);
    setFilteredRecords(mockRecords);
    setLoading(false);
  }, [sessionId]);

  useEffect(() => {
    let filtered = records.filter((record) => {
      const matchSearch =
        record.student_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.student_id.includes(searchTerm);
      const matchStatus =
        filterStatus === "all" || record.status === filterStatus;
      return matchSearch && matchStatus;
    });

    // Sorting logic
    if (sortColumn) {
      filtered = [...filtered].sort((a, b) => {
        let aValue: any = a[sortColumn as keyof AttendanceRecord];
        let bValue: any = b[sortColumn as keyof AttendanceRecord];

        if (typeof aValue === "string" && typeof bValue === "string") {
          aValue = aValue.toLowerCase();
          bValue = bValue.toLowerCase();
          return sortDirection === "asc"
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        }

        return 0;
      });
    }

    setFilteredRecords(filtered);
  }, [searchTerm, filterStatus, records, sortColumn, sortDirection]);

  const handleStatusChange = (recordId: number, newStatus: string) => {
    const updated = records.map((r) =>
      r.id === recordId
        ? { ...r, status: newStatus as AttendanceRecord["status"] }
        : r,
    );
    setRecords(updated);
  };

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const stats = {
    total: records.length,
    hadir: records.filter((r) => r.status === "hadir").length,
    absen: records.filter((r) => r.status === "absen").length,
    izin: records.filter((r) => r.status === "izin").length,
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "hadir":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "izin":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "absen":
        return "bg-red-50 text-red-700 border-red-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "hadir":
        return <CheckCircle2 size={18} className="text-emerald-600" />;
      case "absen":
        return <XCircle size={18} className="text-red-600" />;
      case "izin":
        return <AlertCircle size={18} className="text-blue-600" />;
      default:
        return null;
    }
  };

  if (loading) {
    return <Loading text="Memuat data absensi..." />;
  }

  if (!session) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center p-4 md:p-8">
        <div className="text-center text-gray-500">Sesi tidak ditemukan</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full p-4 md:p-8">
      {/* Back Button */}
      <div className="mb-8">
        <Link
          href="/LMS/tutor/Absensi"
          className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-medium transition hover:gap-3"
        >
          <ArrowLeft size={20} />
          Kembali ke Daftar Absensi
        </Link>
      </div>

      {/* Header Card - Session Info */}
      <div className="mb-8 bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-2xl shadow-lg p-8 text-white">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              {session.material_name}
            </h1>
            <p className="text-emerald-100 text-lg">
              Kelas {session.class_name} • {session.subject_name}
            </p>
          </div>
          <div className="flex gap-6">
            <div className="flex items-center gap-2">
              <Clock size={20} className="text-emerald-200" />
              <div>
                <p className="text-emerald-100 text-sm">Waktu Sesi</p>
                <p className="font-bold">
                  {session.session_start} - {session.session_end}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Users size={20} className="text-emerald-200" />
              <div>
                <p className="text-emerald-100 text-sm">Total Pelajar</p>
                <p className="font-bold">{stats.total}</p>
              </div>
            </div>
          </div>
        </div>
        <p className="text-emerald-100 text-sm">
          {new Date(session.date).toLocaleDateString("id-ID", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </div>

      {/* Statistics */}
      <div className="mb-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total */}
        <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition p-6 border-l-4 border-slate-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium mb-1">Total</p>
              <p className="text-3xl font-bold text-slate-800">{stats.total}</p>
            </div>
            <Users size={32} className="text-slate-200" />
          </div>
        </div>

        {/* Hadir */}
        <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition p-6 border-l-4 border-emerald-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium mb-1">Hadir</p>
              <div className="flex items-baseline gap-2">
                <p className="text-3xl font-bold text-emerald-700">
                  {stats.hadir}
                </p>
                <p className="text-sm text-emerald-600 font-medium">
                  {stats.total > 0
                    ? Math.round((stats.hadir / stats.total) * 100)
                    : 0}
                  %
                </p>
              </div>
            </div>
            <CheckCircle2 size={32} className="text-emerald-200" />
          </div>
        </div>

        {/* Absen */}
        <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition p-6 border-l-4 border-red-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium mb-1">Absen</p>
              <div className="flex items-baseline gap-2">
                <p className="text-3xl font-bold text-red-700">{stats.absen}</p>
                <p className="text-sm text-red-600 font-medium">
                  {stats.total > 0
                    ? Math.round((stats.absen / stats.total) * 100)
                    : 0}
                  %
                </p>
              </div>
            </div>
            <XCircle size={32} className="text-red-200" />
          </div>
        </div>

        {/* Izin */}
        <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium mb-1">Izin</p>
              <div className="flex items-baseline gap-2">
                <p className="text-3xl font-bold text-blue-700">{stats.izin}</p>
                <p className="text-sm text-blue-600 font-medium">
                  {stats.total > 0
                    ? Math.round((stats.izin / stats.total) * 100)
                    : 0}
                  %
                </p>
              </div>
            </div>
            <AlertCircle size={32} className="text-blue-200" />
          </div>
        </div>
      </div>

      {/* Filters & Actions */}
      <div className="mb-6 bg-white rounded-xl shadow-sm p-4 md:p-6 border border-gray-100">
        <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-end">
          <div className="flex-1">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Cari Pelajar
            </label>
            <Input
              type="text"
              placeholder="Nama atau ID pelajar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border-gray-200 focus:border-emerald-500 focus:ring-emerald-500"
            />
          </div>
          <div className="w-full md:w-48">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Filter Status
            </label>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="border-gray-200 focus:border-emerald-500 focus:ring-emerald-500">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Status</SelectItem>
                <SelectItem value="hadir">Hadir</SelectItem>
                <SelectItem value="absen">Absen</SelectItem>
                <SelectItem value="izin">Izin</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold flex items-center justify-center gap-2 h-10 px-6 transition">
            <Download size={18} />
            <span>Export</span>
          </Button>
        </div>
      </div>

      {/* Attendance Table - Desktop */}
      <div className="hidden md:block bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-emerald-50 to-blue-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  <SortableHeader
                    column="student_id"
                    label="ID"
                    sortColumn={sortColumn}
                    sortDirection={sortDirection}
                    onSort={handleSort}
                  />
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  <SortableHeader
                    column="student_name"
                    label="Nama Pelajar"
                    sortColumn={sortColumn}
                    sortDirection={sortDirection}
                    onSort={handleSort}
                  />
                </th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">
                  <SortableHeader
                    column="status"
                    label="Status"
                    sortColumn={sortColumn}
                    sortDirection={sortDirection}
                    onSort={handleSort}
                  />
                </th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">
                  Waktu Absensi
                </th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredRecords.length > 0 ? (
                filteredRecords.map((record) => (
                  <tr key={record.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {record.student_id}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-700">
                      {record.student_name}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {editingId === record.id ? (
                        <Select
                          value={record.status}
                          onValueChange={(value) => {
                            handleStatusChange(record.id, value);
                            setEditingId(null);
                          }}
                        >
                          <SelectTrigger className="border-emerald-200 focus:ring-emerald-500 w-32 h-8 mx-auto text-sm">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="hadir">Hadir</SelectItem>
                            <SelectItem value="absen">Absen</SelectItem>
                            <SelectItem value="izin">Izin</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        <div
                          className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold border ${getStatusColor(
                            record.status,
                          )}`}
                        >
                          {getStatusIcon(record.status)}
                          <span className="capitalize">{record.status}</span>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center text-sm text-gray-600">
                      {record.attendance_time || "—"}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() =>
                          setEditingId(
                            editingId === record.id ? null : record.id,
                          )
                        }
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition"
                      >
                        <Edit2 size={14} />
                        Edit
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-12 text-center text-gray-500"
                  >
                    Tidak ada data absensi ditemukan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Attendance Cards - Mobile */}
      <div className="md:hidden space-y-4">
        {filteredRecords.length > 0 ? (
          filteredRecords.map((record) => (
            <div
              key={record.id}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition"
            >
              <div className="flex justify-between items-start gap-4 mb-4">
                <div className="flex-1">
                  <p className="text-xs text-gray-500 font-medium mb-1">
                    ID: {record.student_id}
                  </p>
                  <h3 className="text-sm font-bold text-gray-900">
                    {record.student_name}
                  </h3>
                </div>
                <button
                  onClick={() =>
                    setEditingId(editingId === record.id ? null : record.id)
                  }
                  className="text-emerald-600 hover:text-emerald-700 transition"
                >
                  <Edit2 size={18} />
                </button>
              </div>

              {editingId === record.id ? (
                <div className="mb-4">
                  <Select
                    value={record.status}
                    onValueChange={(value) => {
                      handleStatusChange(record.id, value);
                      setEditingId(null);
                    }}
                  >
                    <SelectTrigger className="border-emerald-200 focus:ring-emerald-500 w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hadir">Hadir</SelectItem>
                      <SelectItem value="absen">Absen</SelectItem>
                      <SelectItem value="izin">Izin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              ) : (
                <div className="mb-4">
                  <div
                    className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold border ${getStatusColor(
                      record.status,
                    )}`}
                  >
                    {getStatusIcon(record.status)}
                    <span className="capitalize">{record.status}</span>
                  </div>
                </div>
              )}

              <div className="pt-4 border-t border-gray-200 text-xs text-gray-600">
                <p>
                  Waktu Check-in:{" "}
                  <span className="font-medium">
                    {record.attendance_time || "—"}
                  </span>
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white rounded-xl p-8 text-center text-gray-500 shadow-sm border border-gray-100">
            Tidak ada data absensi ditemukan.
          </div>
        )}
      </div>

      {/* Summary Section */}
      <div className="mt-8 bg-gradient-to-br from-emerald-600 via-emerald-500 to-blue-600 rounded-2xl shadow-lg p-8 text-white">
        <h3 className="text-2xl font-bold mb-6">Ringkasan Kehadiran</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
            <p className="text-emerald-100 text-sm font-medium mb-2">
              Presentase Hadir
            </p>
            <p className="text-3xl font-bold">
              {stats.total > 0
                ? Math.round((stats.hadir / stats.total) * 100)
                : 0}
              %
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
            <p className="text-emerald-100 text-sm font-medium mb-2">
              Presentase Absen
            </p>
            <p className="text-3xl font-bold">
              {stats.total > 0
                ? Math.round((stats.absen / stats.total) * 100)
                : 0}
              %
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
            <p className="text-emerald-100 text-sm font-medium mb-2">
              Presentase Izin
            </p>
            <p className="text-3xl font-bold">
              {stats.total > 0
                ? Math.round((stats.izin / stats.total) * 100)
                : 0}
              %
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
            <p className="text-emerald-100 text-sm font-medium mb-2">Tanggal</p>
            <p className="text-lg font-bold">
              {new Date(session.date).toLocaleDateString("id-ID", {
                month: "short",
                day: "numeric",
              })}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
