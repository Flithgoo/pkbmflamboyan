"use client";

import React, { useState, useEffect } from "react";
import {
  CheckCircle,
  Trash2,
  Save,
  X,
  Clock,
  AlertCircle,
  NotebookPen,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  getMaterialWithRelations,
  updateMaterial,
  deleteMaterial,
} from "@/lib/api/material";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Loading from "@/app/components/Loading";

// Dynamic import ReactQuill to avoid SSR issues
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

type MateriDetail = {
  id: number;
  title: string;
  content: string | null;
  mapel: string;
  pengajar: string;
  created_at: string;
};

interface PageProps {
  params: {
    id: string;
    materiId: string;
  };
}

export default function MateriDetailPage({ params }: PageProps) {
  const materiId = params?.materiId ? parseInt(params.materiId) : null;
  const subjectId = params?.id ? parseInt(params.id) : null;
  const [materi, setMateri] = useState<MateriDetail | null>(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [form, setForm] = useState<Partial<MateriDetail>>({});
  const [message, setMessage] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [absensiStart, setAbsensiStart] = useState<string>("");
  const [absensiEnd, setAbsensiEnd] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch material data from database
  useEffect(() => {
    const fetchMaterial = async () => {
      if (!materiId) {
        setError("ID Materi tidak valid");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");
        const { data, error: fetchError } =
          await getMaterialWithRelations(materiId);

        if (fetchError) {
          setError("Gagal memuat data materi: " + fetchError.message);
          return;
        }

        if (!data) {
          setError("Data materi tidak ditemukan");
          return;
        }

        // Transform data dari database ke format form
        const materiData: MateriDetail = {
          id: data.id,
          title: data.title || "",
          content: data.content || "",
          mapel: data.subjects?.name || "-",
          pengajar: data.users?.name || "-",
          created_at: data.created_at || "",
        };

        setMateri(materiData);
        setForm(materiData);
      } catch (err) {
        setError(
          "Terjadi kesalahan saat memuat data: " +
            (err instanceof Error ? err.message : "Unknown error"),
        );
      } finally {
        setLoading(false);
      }
    };

    fetchMaterial();
  }, [materiId]);

  const handleSave = async () => {
    try {
      setMessage("");
      setError("");
      setIsSaving(true);

      if (!materiId) {
        setError("ID Materi tidak valid");
        return;
      }

      // Call updateMaterial API
      const { error: updateError } = await updateMaterial(materiId, {
        title: form.title,
        content: form.content || "",
      });

      if (updateError) {
        setError("Gagal menyimpan data: " + updateError.message);
        return;
      }

      setMateri(form as MateriDetail);
      setHasChanges(false);
      setMessage("Perubahan materi berhasil disimpan.");
      setTimeout(() => setMessage(""), 4000);
    } catch (err) {
      setError(
        "Gagal menyimpan data: " +
          (err instanceof Error ? err.message : "Unknown error"),
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    const confirmed = confirm("Yakin ingin menghapus materi ini?");
    if (!confirmed) {
      return;
    }

    try {
      setError("");
      setMessage("");
      setIsDeleting(true);

      if (!materiId) {
        setError("ID Materi tidak valid");
        return;
      }

      // Call deleteMaterial API
      const { error: deleteError } = await deleteMaterial(materiId);

      if (deleteError) {
        setError("Gagal menghapus materi: " + deleteError.message);
        return;
      }

      setMessage("Materi telah dihapus. Mengarahkan ke halaman sebelumnya...");
      setTimeout(() => {
        window.history.back();
      }, 2000);
    } catch (err) {
      setError(
        "Gagal menghapus materi: " +
          (err instanceof Error ? err.message : "Unknown error"),
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const handleChange = (field: keyof MateriDetail, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  if (loading) {
    return <Loading text="Memuat data detail materi..." />;
  }

  if (error && !materi) {
    return (
      <div className="w-full min-h-screen flex-grow bg-gradient-to-br from-emerald-50 to-amber-50 p-4 md:p-8">
        <div className="inline-flex items-center gap-2 mb-4">
          <h1 className="text-4xl font-bold text-emerald-700">
            Detail Materi Pembelajaran
          </h1>
        </div>
        <div className="flex items-center gap-3 bg-red-50 border-l-4 border-red-500 p-4 rounded-lg shadow-xl">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
          <p className="text-red-800 font-medium">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="wfull min-h-screen flex-grow bg-gradient-to-br from-emerald-50 to-amber-50 p-4 md:p-8">
      {/* Header Section */}
      <div className="w-full inline-flex items-stretch justify-between gap-2 mb-4">
        <h1 className="text-4xl font-bold text-emerald-700">
          Detail Materi Pembelajaran
        </h1>
        <Link
          href={`/LMS/tutor/Mapel/${subjectId}`}
          className="text-sm flex items-center gap-2 px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 font-semibold shadow transition"
        >
          <ArrowLeft size={20} />
          Kembali ke Daftar Mapel
        </Link>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="flex items-center gap-3 bg-red-50 border-l-4 border-red-500 p-4 rounded-lg shadow-xl">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
            <p className="text-red-800 font-medium">{error}</p>
          </div>
        </div>
      )}

      {/* Success/Delete Message */}
      {message && (
        <div className="mb-6 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="flex items-center gap-3 bg-gradient-to-r from-emerald-50 to-green-50 border-l-4 border-emerald-500 p-4 rounded-lg shadow-xl">
            <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <p className="text-emerald-800 font-medium">{message}</p>
          </div>
        </div>
      )}

      <section className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-emerald-100">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 px-8 py-6">
          <p className="w-full bg-transparent text-white text-2xl font-bold outline-none placeholder-white/70">
            Mata Pelajaran: {form.mapel}
          </p>
          <p className="text-emerald-100 text-sm mt-2">Id Materi: {materiId}</p>
        </div>

        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Judul materi */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Judul Materi
              </label>

              <input
                type="text"
                value={form.title || ""}
                onChange={(e) => handleChange("title", e.target.value)}
                className="w-full rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-400"
              />
            </div>

            {/* PENGAJAR */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Pengajar
              </label>

              <input
                type="text"
                value={form.pengajar || ""}
                readOnly
                className="w-full rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-400 cursor-not-allowed"
              />
            </div>

            {/* TANGGAL */}
            <div>
              <label
                htmlFor="absensiStart"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Waktu Absensi Dibuka
              </label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type="datetime-local"
                  id="absensiStart"
                  value={absensiStart}
                  onChange={(e) => setAbsensiStart(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 bg-white border rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-400 focus:border-emerald-400 transition duration-200 hover:border-emerald-300"
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="absensiEnd"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Waktu Absensi Ditutup
              </label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type="datetime-local"
                  id="absensiEnd"
                  value={absensiEnd}
                  onChange={(e) => setAbsensiEnd(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 bg-white border rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-400 focus:border-emerald-400 transition duration-200 hover:border-emerald-300"
                />
              </div>
            </div>
          </div>

          {/* DESKRIPSI */}
          <div className="border-t border-gray-200 pt-6">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Deskripsi Materi
            </label>

            <div className="bg-white border border-gray-300 rounded-xl overflow-hidden shadow-sm">
              <ReactQuill
                value={form.content || ""}
                onChange={(value) => {
                  handleChange("content", value);
                }}
                modules={{
                  toolbar: [
                    [{ header: [1, 2, 3, false] }],
                    ["bold", "italic", "underline", "strike"],
                    ["blockquote", "code-block"],
                    [{ list: "ordered" }, { list: "bullet" }],
                    [{ color: [] }, { background: [] }],
                    [{ align: [] }],
                    ["link", "image"],
                    ["clean"],
                  ],
                }}
                theme="snow"
                className="bg-white"
              />
            </div>
          </div>

          {/* Stats */}
          <div className="mt-8 border-t border-gray-200 pt-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              {/* Total Siswa */}
              <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 border border-emerald-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-emerald-600 uppercase tracking-wide mb-2">
                      Total Siswa
                    </p>
                    <p className="text-4xl font-bold text-emerald-700">23</p>
                  </div>
                  <div className="p-3 bg-emerald-200 rounded-lg">
                    <svg
                      className="w-6 h-6 text-emerald-700"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4.354a4 4 0 110 5.292m0 0H7.5M12 9.354v5M5.5 17.5h13a1.5 1.5 0 001.5-1.5V4.5a1.5 1.5 0 00-1.5-1.5h-13a1.5 1.5 0 00-1.5 1.5v12.5a1.5 1.5 0 001.5 1.5z"
                      />
                    </svg>
                  </div>
                </div>
                <p className="text-xs text-emerald-600 mt-3">Jumlah peserta</p>
              </div>

              {/* Sudah Mengumpulkan */}
              <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-600 uppercase tracking-wide mb-2">
                      Sudah Mengumpulkan
                    </p>
                    <p className="text-4xl font-bold text-green-700">17</p>
                  </div>
                  <div className="p-3 bg-green-200 rounded-lg">
                    <svg
                      className="w-6 h-6 text-green-700"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                </div>
                <p className="text-xs text-green-600 mt-3">73.9% selesai</p>
              </div>

              {/* Belum Mengumpulkan */}
              <div className="bg-gradient-to-br from-amber-50 to-amber-100 border border-amber-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-amber-600 uppercase tracking-wide mb-2">
                      Belum Mengumpulkan
                    </p>
                    <p className="text-4xl font-bold text-amber-700">6</p>
                  </div>
                  <div className="p-3 bg-amber-200 rounded-lg">
                    <svg
                      className="w-6 h-6 text-amber-700"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                </div>
                <p className="text-xs text-amber-600 mt-3">26.1% tertunda</p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="bg-white rounded-xl p-6 border border-gray-100 mb-6">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm font-semibold text-gray-700">
                  Progres Pengumpulan Tugas
                </p>
                <p className="text-sm font-bold text-emerald-600">73.9%</p>
              </div>
              <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-green-500 rounded-full transition-all duration-500"
                  style={{ width: "73.9%" }}
                ></div>
              </div>
              <div className="flex justify-between mt-3">
                <span className="text-xs text-gray-500">Dimulai</span>
                <span className="text-xs text-emerald-600 font-semibold">
                  Selesai
                </span>
              </div>
            </div>

            {/* Button Kelola Penilaian */}
            <div className="flex justify-end">
              <button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-lg hover:from-emerald-600 hover:to-emerald-700 shadow-md hover:shadow-lg transition-all duration-200 font-medium">
                <NotebookPen />
                Kelola Penilaian
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-8 py-6 border-t border-gray-200 flex flex-col sm:flex-row gap-3 justify-end">
          <button
            onClick={() => {
              setForm(materi || {});
              setHasChanges(false);
              setError("");
            }}
            disabled={!hasChanges || isSaving || isDeleting}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 hover:bg-gray-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            <X className="w-4 h-4" />
            Batal
          </button>

          <button
            onClick={() => {
              handleSave();
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            disabled={!hasChanges || isSaving || isDeleting}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {isSaving ? (
              <>
                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                Menyimpan...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Simpan
              </>
            )}
          </button>

          <button
            onClick={() => {
              window.scrollTo({ top: 0, behavior: "smooth" });
              handleDelete();
            }}
            disabled={isSaving || isDeleting}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-white border-2 border-red-300 text-red-600 hover:bg-red-50 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {isDeleting ? (
              <>
                <div className="animate-spin h-4 w-4 border-2 border-red-600 border-t-transparent rounded-full"></div>
                Menghapus...
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4" />
                Hapus
              </>
            )}
          </button>
        </div>
      </section>
    </div>
  );
}
