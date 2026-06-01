"use client";

import React, { useState } from "react";
import { CheckCircle, Trash2, Save, X } from "lucide-react";

type MateriDetail = {
  judul: string;
  deskripsi: string;
  mapel: string;
  tanggal: string;
  pengajar: string;
};

interface PageProps {
  params: {
    materiId: string;
  };
}

const defaultMateri: MateriDetail = {
  judul: "Judul Materi Contoh",
  deskripsi:
    "Deskripsi detail materi pembelajaran. Tambahkan ringkasan, tujuan, dan catatan penting di sini.",
  mapel: "Matematika",
  tanggal: "2026-06-01",
  pengajar: "Budi Santoso",
};

export default function MateriDetailPage({ params }: PageProps) {
  const materiId = params?.materiId ?? "tidak-diketahui";
  const [materi, setMateri] = useState<MateriDetail>(defaultMateri);
  const [hasChanges, setHasChanges] = useState(false);
  const [form, setForm] = useState<MateriDetail>(defaultMateri);
  const [message, setMessage] = useState<string>("");
  const [loading, setLoading] = useState(true);

  const handleSave = () => {
    setMateri(form);
    setMessage("Perubahan materi berhasil disimpan.");
    setTimeout(() => setMessage(""), 4000);
  };

  const handleDelete = () => {
    const confirmed = confirm("Yakin ingin menghapus materi ini?");
    if (!confirmed) {
      return;
    }

    setMateri({
      judul: "-",
      deskripsi: "Materi telah dihapus.",
      mapel: "-",
      tanggal: "-",
      pengajar: "-",
    });
    setMessage("Materi telah dihapus.");
    setTimeout(() => setMessage(""), 4000);
  };

  const handleChange = (field: keyof MateriDetail, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  return (
    <div className="wfull min-h-screen flex-grow bg-gradient-to-br from-emerald-50 to-amber-50 p-4 md:p-8">
      {/* Header Section */}

      <div className="inline-flex items-center gap-2 mb-4">
        <h1 className="text-4xl font-bold text-emerald-700">
          Detail Materi Pembelajaran
        </h1>
      </div>

      {/* Success/Delete Message */}
      {message && (
        <div className="mb-6 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="flex items-center gap-3 bg-gradient-to-r from-emerald-50 to-green-50 border-l-4 border-emerald-500 p-4 rounded-lg shadow-md">
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
                value={form.judul}
                onChange={(e) => handleChange("judul", e.target.value)}
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
                value={form.pengajar}
                onChange={(e) => handleChange("pengajar", e.target.value)}
                className="w-full rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>

            {/* TANGGAL */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Tanggal
              </label>

              <input
                type="date"
                value={form.tanggal}
                onChange={(e) => handleChange("tanggal", e.target.value)}
                className="w-full rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-400"
              />
            </div>
          </div>

          {/* DESKRIPSI */}
          <div className="border-t border-gray-200 pt-6">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Deskripsi Materi
            </label>

            <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-xl border border-gray-200">
              <textarea
                value={form.deskripsi}
                onChange={(e) => handleChange("deskripsi", e.target.value)}
                rows={10}
                className="w-full resize-none bg-transparent outline-none text-gray-700"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-8 py-6 border-t border-gray-200 flex flex-col sm:flex-row gap-3 justify-end">
          <button
            onClick={() => {
              setForm(materi);
              setHasChanges(false);
            }}
            disabled={!hasChanges}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 hover:bg-gray-100 rounded-lg disabled:opacity-50"
          >
            <X className="w-4 h-4" />
            Batal
          </button>

          <button
            onClick={() => {
              handleSave();
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            disabled={!hasChanges}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-lg disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            Simpan
          </button>

          <button
            onClick={handleDelete}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-white border-2 border-red-300 text-red-600 hover:bg-red-50 rounded-lg"
          >
            <Trash2 className="w-4 h-4" />
            Hapus
          </button>
        </div>
      </section>
    </div>
  );
}
