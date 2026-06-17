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
  BookOpen,
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
import {
  getTutorAttendanceDetial,
  updateAttendanceStatus,
} from "@/lib/api/attendance";
import { useUserStore } from "@/src/store/useUserStore";
import * as XLSX from "xlsx";

interface AttendanceRecord {
  id: number;
  student_id: string;
  student_name: string;
  status: string;
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
  const { user } = useUserStore();

  useEffect(() => {
    async function fetchAttendance() {
      setLoading(true);

      const { data } = await getTutorAttendanceDetial(Number(sessionId));

      if (data && data.length > 0) {
        const first = data[0];

        setSession({
          id: first.session_id,
          material_name: first.material_name,
          subject_name: first.subject_name,
          class_name: first.location_name,
          date: first.created_at,
          session_start: first.session_start,
          session_end: first.session_end,
        });

        const attendanceRecords: AttendanceRecord[] = data.map((item) => ({
          id: item.id,
          student_id: item.student_id,
          student_name: item.student_name,
          status: item.status as "hadir" | "absen" | "izin" | "belum absen",
          attendance_time: item.attendance_time,
        }));

        setRecords(attendanceRecords);
        setFilteredRecords(attendanceRecords);
      }

      setLoading(false);
    }

    fetchAttendance();
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

  const handleStatusChange = async (attendanceId: number, status: string) => {
    const { error } = await updateAttendanceStatus(
      attendanceId,
      status,
      Number(user?.id),
    );

    if (error) {
      console.error(error);
      return;
    }

    setRecords((prev) =>
      prev.map((record) =>
        record.id === attendanceId
          ? {
              ...record,
              status,
            }
          : record,
      ),
    );
    setEditingId(null);
  };

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const handleExport = () => {
    if (!session) return;

    // Header laporan
    const header = [
      ["PKBM FLAMBOYAN"],
      ["Laporan Absensi"],
      [],
      ["Materi", session.material_name],
      ["Mata Pelajaran", session.subject_name],
      ["Lokasi", session.class_name],
      ["Sesi Dimulai", new Date(session.session_start).toLocaleString("id-ID")],
      ["Sesi Berakhir", new Date(session.session_end).toLocaleString("id-ID")],
      [],
    ];

    // Header tabel
    const tableHeader = [
      ["No", "NIS", "Nama Pelajar", "Status", "Waktu Absensi"],
    ];

    const formatStatus = (status: AttendanceRecord["status"]) => {
      switch (status) {
        case "hadir":
          return "Hadir";

        case "izin":
          return "Izin";

        case "belum absen":
          return "Belum Absen";

        case "absen":
          return "Tidak Hadir";

        default:
          return status;
      }
    };

    // Isi tabel
    const tableData = records.map((record, index) => [
      index + 1,
      record.student_id,
      record.student_name,
      formatStatus(record.status),
      record.attendance_time
        ? new Date(record.attendance_time).toLocaleString("id-ID")
        : "-",
    ]);

    // Gabungkan semuanya
    const worksheet = XLSX.utils.aoa_to_sheet([
      ...header,
      ...tableHeader,
      ...tableData,
    ]);

    // Lebar kolom
    worksheet["!cols"] = [
      { wch: 6 },
      { wch: 15 },
      { wch: 35 },
      { wch: 15 },
      { wch: 25 },
    ];

    // Workbook
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Absensi");

    XLSX.writeFile(workbook, `Absensi-${session.material_name}.xlsx`);
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

  const totalPelajar = records.length;
  const jmlBelumAbsen = records.filter(
    (r) => r.status === "belum absen",
  ).length;
  const jmlHadir = records.filter((r) => r.status === "hadir").length;
  const jmlIzin = records.filter((r) => r.status === "izin").length;
  const jmlAbsen = records.filter((r) => r.status === "absen").length;

  return (
    <div className="min-h-screen w-full p-4 md:p-8">
      {/* Back Button */}
      <div className="mb-6 flex justify-end pe-2">
        <Link
          href="/LMS/tutor/Absensi"
          className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-medium transition hover:gap-3"
        >
          <ArrowLeft size={20} />
          Kembali ke Daftar Absensi
        </Link>
      </div>

      {/* Header Card - Session Info */}
      <div className="mb-8 overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-600 via-emerald-600 to-emerald-700 p-6 text-white shadow-xl md:p-8">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          {/* Left */}
          <div className="flex-1">
            <p className="mb-2 text-sm font-medium uppercase tracking-wider text-emerald-200">
              Kelola Absensi
            </p>

            <h1 className="mb-3 text-3xl font-bold leading-tight md:text-4xl">
              {session.material_name}
            </h1>

            <div className="flex flex-wrap items-center gap-2 text-sm text-emerald-100 md:text-base">
              <BookOpen size={18} />
              <span>{session.subject_name}</span>

              <span className="opacity-60">•</span>

              <Users size={18} />
              <span>{session.class_name}</span>
            </div>

            <p className="mt-5 text-sm text-emerald-100">
              {new Date(session.date).toLocaleDateString("id-ID", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>

          {/* Right */}
          <div className="grid grid-cols-1 xs:grid-cols-2 gap-4 lg:min-w-[320px]">
            <div className="rounded-2xl bg-white/10 p-3 backdrop-blur-sm ring-1 ring-white/20">
              <Clock className="mb-3 h-6 w-6 text-emerald-200" />

              <p className="text-xs uppercase tracking-wide text-emerald-200">
                Waktu Sesi
              </p>

              <div className="mt-2 space-y-3">
                <div>
                  <p className="text-sm font-semibold">
                    <span>
                      {new Date(session.session_start).toLocaleDateString(
                        "id-ID",
                        {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        },
                      )}
                    </span>
                    <span className="font-normal">{" : "}</span>
                    <span className="font-normal">
                      {new Date(session.session_start).toLocaleTimeString(
                        "id-ID",
                        {
                          hour: "2-digit",
                          minute: "2-digit",
                        },
                      )}
                    </span>
                  </p>
                </div>

                <div className="border-t border-white/20 pt-3">
                  <p className="text-sm font-semibold">
                    {new Date(session.session_end).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                    <span className="font-normal">{" : "}</span>
                    <span className="font-normal">
                      {new Date(session.session_end).toLocaleTimeString(
                        "id-ID",
                        {
                          hour: "2-digit",
                          minute: "2-digit",
                        },
                      )}
                    </span>
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-white/10 p-5 backdrop-blur-sm ring-1 ring-white/20">
              <Users className="mb-3 h-6 w-6 text-emerald-200" />

              <p className="text-xs uppercase tracking-wide text-emerald-200">
                Total Pelajar
              </p>

              <p className="mt-1 text-3xl font-bold">{totalPelajar}</p>

              <p className="text-sm text-emerald-100">Peserta Terdaftar</p>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="mb-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total */}
        <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition p-6 border-l-4 border-slate-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium mb-1">
                Belum Absen
              </p>
              <div className="flex items-baseline gap-2">
                <p className="text-3xl font-bold text-gray-600">
                  {jmlBelumAbsen}
                </p>
                <p className="text-sm text-gray-600 font-medium">
                  {totalPelajar > 0
                    ? Math.round((jmlBelumAbsen / totalPelajar) * 100)
                    : 0}
                  %
                </p>
              </div>
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
                  {jmlHadir}
                </p>
                <p className="text-sm text-emerald-600 font-medium">
                  {totalPelajar > 0
                    ? Math.round((jmlHadir / totalPelajar) * 100)
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
              <p className="text-gray-600 text-sm font-medium mb-1">
                Tidak Hadir
              </p>
              <div className="flex items-baseline gap-2">
                <p className="text-3xl font-bold text-red-700">{jmlAbsen}</p>
                <p className="text-sm text-red-600 font-medium">
                  {totalPelajar > 0
                    ? Math.round((jmlAbsen / totalPelajar) * 100)
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
                <p className="text-3xl font-bold text-blue-700">{jmlIzin}</p>
                <p className="text-sm text-blue-600 font-medium">
                  {totalPelajar > 0
                    ? Math.round((jmlIzin / totalPelajar) * 100)
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
          <Button
            onClick={handleExport}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold flex items-center justify-center gap-2 h-10 px-6 transition"
          >
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
                      {record.attendance_time
                        ? new Date(record.attendance_time).toLocaleTimeString(
                            "id-ID",
                            {
                              hour: "2-digit",
                              minute: "2-digit",
                            },
                          )
                        : "—"}
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
                    {record.attendance_time
                      ? new Date(record.attendance_time).toLocaleTimeString(
                          "id-ID",
                          {
                            hour: "2-digit",
                            minute: "2-digit",
                          },
                        )
                      : "—"}
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
              {totalPelajar > 0
                ? Math.round((jmlHadir / totalPelajar) * 100)
                : 0}
              %
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
            <p className="text-emerald-100 text-sm font-medium mb-2">
              Presentase Absen
            </p>
            <p className="text-3xl font-bold">
              {totalPelajar > 0
                ? Math.round((jmlAbsen / totalPelajar) * 100)
                : 0}
              %
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
            <p className="text-emerald-100 text-sm font-medium mb-2">
              Presentase Izin
            </p>
            <p className="text-3xl font-bold">
              {totalPelajar > 0
                ? Math.round((jmlIzin / totalPelajar) * 100)
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
