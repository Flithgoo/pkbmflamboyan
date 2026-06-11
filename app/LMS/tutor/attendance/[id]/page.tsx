"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  Clock,
  BookOpen,
  Users,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Download,
  Edit2,
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

interface AttendanceRecord {
  id: number;
  student_id: string;
  student_name: string;
  status: "hadir" | "absen" | "sakit" | "izin";
  check_in_time: string | null;
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
        check_in_time: "08:00",
      },
      {
        id: 2,
        student_id: "002",
        student_name: "Budi Santoso",
        status: "hadir",
        check_in_time: "08:05",
      },
      {
        id: 3,
        student_id: "003",
        student_name: "Citra Dewi",
        status: "sakit",
        check_in_time: null,
      },
      {
        id: 4,
        student_id: "004",
        student_name: "Dedi Gunawan",
        status: "absen",
        check_in_time: null,
      },
      {
        id: 5,
        student_id: "005",
        student_name: "Eka Putri",
        status: "hadir",
        check_in_time: "08:10",
      },
      {
        id: 6,
        student_id: "006",
        student_name: "Fajar Ismanto",
        status: "izin",
        check_in_time: null,
      },
      {
        id: 7,
        student_id: "007",
        student_name: "Gina Nur Aziz",
        status: "hadir",
        check_in_time: "08:02",
      },
      {
        id: 8,
        student_id: "008",
        student_name: "Hendra Wijaya",
        status: "absen",
        check_in_time: null,
      },
    ];

    setSession(mockSession);
    setRecords(mockRecords);
    setFilteredRecords(mockRecords);
    setLoading(false);
  }, [sessionId]);

  useEffect(() => {
    const filtered = records.filter((record) => {
      const matchSearch =
        record.student_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.student_id.includes(searchTerm);
      const matchStatus =
        filterStatus === "all" || record.status === filterStatus;
      return matchSearch && matchStatus;
    });
    setFilteredRecords(filtered);
  }, [searchTerm, filterStatus, records]);

  const handleStatusChange = (recordId: number, newStatus: string) => {
    const updated = records.map((r) =>
      r.id === recordId
        ? { ...r, status: newStatus as AttendanceRecord["status"] }
        : r,
    );
    setRecords(updated);
  };

  const stats = {
    total: records.length,
    hadir: records.filter((r) => r.status === "hadir").length,
    absen: records.filter((r) => r.status === "absen").length,
    sakit: records.filter((r) => r.status === "sakit").length,
    izin: records.filter((r) => r.status === "izin").length,
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "hadir":
        return "bg-green-100 text-green-800 border-green-300";
      case "sakit":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "izin":
        return "bg-blue-100 text-blue-800 border-blue-300";
      case "absen":
        return "bg-red-100 text-red-800 border-red-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "hadir":
        return <CheckCircle2 size={18} className="text-green-600" />;
      case "absen":
        return <XCircle size={18} className="text-red-600" />;
      case "sakit":
        return <AlertCircle size={18} className="text-yellow-600" />;
      case "izin":
        return <AlertCircle size={18} className="text-blue-600" />;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-amber-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-emerald-600 border-t-amber-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat data absensi...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-amber-50 p-4 md:p-8">
        <div className="text-center text-gray-500">Sesi tidak ditemukan</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex-grow bg-gradient-to-br from-emerald-50 to-amber-50 p-4 md:p-8">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/LMS/tutor/Absensi"
          className="flex items-center gap-2 text-emerald-600 hover:text-emerald-700 mb-4 font-medium"
        >
          <ArrowLeft size={20} />
          Kembali ke Daftar Absensi
        </Link>

        <div className="bg-white rounded-2xl shadow-md p-6 border-l-4 border-emerald-500">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div>
              <p className="text-gray-600 text-sm font-medium">Materi</p>
              <p className="text-lg font-bold text-gray-900 mt-1">
                {session.material_name}
              </p>
            </div>
            <div>
              <p className="text-gray-600 text-sm font-medium">
                Mata Pelajaran
              </p>
              <p className="text-lg font-bold text-blue-700 mt-1">
                {session.subject_name}
              </p>
            </div>
            <div>
              <p className="text-gray-600 text-sm font-medium">Kelas</p>
              <p className="text-lg font-bold text-purple-700 mt-1">
                Kelas {session.class_name}
              </p>
            </div>
            <div>
              <p className="text-gray-600 text-sm font-medium">Waktu Sesi</p>
              <p className="text-lg font-bold text-gray-900 mt-1">
                {session.session_start} - {session.session_end}
              </p>
            </div>
          </div>
          <p className="text-xs text-gray-500">
            Tanggal:{" "}
            {new Date(session.date).toLocaleDateString("id-ID", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
      </div>

      {/* Statistics */}
      <div className="mb-8 grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4">
        <div className="bg-white rounded-xl shadow p-4 border-t-4 border-emerald-500">
          <p className="text-gray-600 text-xs md:text-sm font-medium">Total</p>
          <p className="text-2xl md:text-3xl font-bold text-emerald-700 mt-1">
            {stats.total}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow p-4 border-t-4 border-green-500">
          <p className="text-gray-600 text-xs md:text-sm font-medium">Hadir</p>
          <p className="text-2xl md:text-3xl font-bold text-green-700 mt-1">
            {stats.hadir}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow p-4 border-t-4 border-red-500">
          <p className="text-gray-600 text-xs md:text-sm font-medium">Absen</p>
          <p className="text-2xl md:text-3xl font-bold text-red-700 mt-1">
            {stats.absen}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow p-4 border-t-4 border-yellow-500">
          <p className="text-gray-600 text-xs md:text-sm font-medium">Sakit</p>
          <p className="text-2xl md:text-3xl font-bold text-yellow-700 mt-1">
            {stats.sakit}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow p-4 border-t-4 border-blue-500">
          <p className="text-gray-600 text-xs md:text-sm font-medium">Izin</p>
          <p className="text-2xl md:text-3xl font-bold text-blue-700 mt-1">
            {stats.izin}
          </p>
        </div>
      </div>

      {/* Filters & Actions */}
      <div className="mb-6 bg-white rounded-2xl shadow-md p-4 md:p-6 border-l-4 border-emerald-500">
        <div className="flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Cari Pelajar
            </label>
            <Input
              type="text"
              placeholder="Cari nama atau ID pelajar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border-emerald-200 focus:ring-emerald-500"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Filter Status
            </label>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="border-emerald-200 focus:ring-emerald-500">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Status</SelectItem>
                <SelectItem value="hadir">Hadir</SelectItem>
                <SelectItem value="absen">Absen</SelectItem>
                <SelectItem value="sakit">Sakit</SelectItem>
                <SelectItem value="izin">Izin</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button className="bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-2">
            <Download size={18} />
            <span className="hidden md:inline">Export</span>
          </Button>
        </div>
      </div>

      {/* Attendance Table - Desktop */}
      <div className="hidden md:block bg-white rounded-2xl shadow-lg overflow-hidden border border-emerald-100">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold">
                  ID
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold">
                  Nama Pelajar
                </th>
                <th className="px-6 py-4 text-center text-sm font-semibold">
                  Status
                </th>
                <th className="px-6 py-4 text-center text-sm font-semibold">
                  Waktu Check-in
                </th>
                <th className="px-6 py-4 text-center text-sm font-semibold">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredRecords.length > 0 ? (
                filteredRecords.map((record, idx) => (
                  <tr
                    key={record.id}
                    className={`hover:bg-emerald-50 transition ${
                      idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                    }`}
                  >
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
                          onValueChange={(value) =>
                            handleStatusChange(record.id, value)
                          }
                        >
                          <SelectTrigger className="border-emerald-200 focus:ring-emerald-500 w-32 mx-auto">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="hadir">Hadir</SelectItem>
                            <SelectItem value="absen">Absen</SelectItem>
                            <SelectItem value="sakit">Sakit</SelectItem>
                            <SelectItem value="izin">Izin</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        <div
                          className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(
                            record.status,
                          )}`}
                        >
                          {getStatusIcon(record.status)}
                          <span className="capitalize">{record.status}</span>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center text-sm text-gray-600">
                      {record.check_in_time || "-"}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() =>
                          setEditingId(
                            editingId === record.id ? null : record.id,
                          )
                        }
                        className="px-3 py-1 text-xs font-semibold text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition flex items-center gap-1 mx-auto"
                      >
                        <Edit2 size={14} />
                        {editingId === record.id ? "Simpan" : "Edit"}
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
              className="bg-white rounded-xl shadow p-4 border-l-4 border-emerald-500"
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="text-xs text-gray-500 font-medium">
                    ID: {record.student_id}
                  </p>
                  <h3 className="text-base font-bold text-gray-800 mt-1">
                    {record.student_name}
                  </h3>
                </div>
                <button
                  onClick={() =>
                    setEditingId(editingId === record.id ? null : record.id)
                  }
                  className="text-emerald-600 hover:text-emerald-700"
                >
                  <Edit2 size={18} />
                </button>
              </div>

              {editingId === record.id ? (
                <div className="mb-3">
                  <Select
                    value={record.status}
                    onValueChange={(value) =>
                      handleStatusChange(record.id, value)
                    }
                  >
                    <SelectTrigger className="border-emerald-200 focus:ring-emerald-500 w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hadir">Hadir</SelectItem>
                      <SelectItem value="absen">Absen</SelectItem>
                      <SelectItem value="sakit">Sakit</SelectItem>
                      <SelectItem value="izin">Izin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              ) : (
                <div className="mb-3">
                  <div
                    className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(
                      record.status,
                    )}`}
                  >
                    {getStatusIcon(record.status)}
                    <span className="capitalize">{record.status}</span>
                  </div>
                </div>
              )}

              <div className="pt-3 border-t border-gray-200 text-sm text-gray-600">
                Waktu Check-in: {record.check_in_time || "-"}
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white rounded-xl p-8 text-center text-gray-500 shadow">
            Tidak ada data absensi ditemukan.
          </div>
        )}
      </div>

      {/* Summary */}
      <div className="mt-8 bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-2xl shadow-lg p-6 text-white">
        <h3 className="text-lg font-semibold mb-4">Ringkasan Absensi</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-emerald-100 text-sm">Presentase Hadir</p>
            <p className="text-3xl font-bold mt-1">
              {stats.total > 0
                ? Math.round((stats.hadir / stats.total) * 100)
                : 0}
              %
            </p>
          </div>
          <div>
            <p className="text-emerald-100 text-sm">Presentase Absen</p>
            <p className="text-3xl font-bold mt-1">
              {stats.total > 0
                ? Math.round((stats.absen / stats.total) * 100)
                : 0}
              %
            </p>
          </div>
          <div>
            <p className="text-emerald-100 text-sm">Total Pelajar</p>
            <p className="text-3xl font-bold mt-1">{stats.total}</p>
          </div>
          <div>
            <p className="text-emerald-100 text-sm">Tanggal</p>
            <p className="text-lg font-bold mt-1">
              {new Date(session.date).toLocaleDateString("id-ID")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
