"use client";

import { getAllSubject } from "@/lib/api/subject";
import React, { useEffect, useState } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableCaption,
} from "@/components/ui/table";
import ConfirmDeleteModal from "@components/LMS/admin/ConfirmDeleteModal";
import { FaUserEdit, FaTrashAlt, FaPlus } from "react-icons/fa";
import Link from "next/link";

export default function AturKelas() {
  const [subjects, setSubject] = useState<any[]>([]);
  const [showDelete, setShowDelete] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState<any | null>(null);

  useEffect(() => {
    async function fetchData() {
      const { data } = await getAllSubject();
      setSubject(data ?? []);
    }
    fetchData();
  }, []);

  function handleDelete(subject: any) {
    setSelectedSubject(subject);
    setShowDelete(true);
  }

  // async function handleConfirmDelete() {
  //   if (!selectedSubject) return;

  //   const result = await deleteUserAction(selectedUser.id);

  //   if (result?.success) {
  //     setShowDelete(false); // Tutup modal
  //     // Refresh data
  //     const { data } = await getAllUser();
  //     setUsers(data ?? []);
  //   } else {
  //     alert("Gagal menghapus pengguna. Silakan coba lagi.");
  //     console.error("Error deleting user:", result?.error);
  //   }
  // }

  return (
    <div className="min-h-screen flex-grow bg-gradient-to-br from-emerald-50 to-amber-50 p-4 pt-8 md:p-8">
      <header className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-emerald-700">
            Atur Mata Pelajaran
          </h1>
        </div>
      </header>
      <main>
        <section
          id="daftar-materi"
          className="bg-white rounded-2xl shadow p-6 mt-6 overflow-x-auto"
        >
          <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-2">
            <h2 className="text-xl font-semibold text-emerald-700">
              Daftar Kelas
            </h2>
            <Link
              href="/LMS/admin/MataPelajaran/tambah"
              className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-semibold shadow transition"
            >
              <FaPlus />
              Tambah Mapel
            </Link>
          </div>
          <Table>
            <TableCaption>Tabel Mata Pelajaran PKBM Flamboyan</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>No</TableHead>
                <TableHead>Mapel</TableHead>
                <TableHead>Tutor yang mengampu</TableHead>
                <TableHead>Dibuat tgl</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {subjects && subjects.length > 0 ? (
                subjects.map((subject, idx) => (
                  <TableRow
                    key={subject.id}
                    className="hover:bg-emerald-50 transition"
                  >
                    <TableCell>{idx + 1}</TableCell>
                    <TableCell>{subject.name}</TableCell>
                    <TableCell>Prassetiyo Utomo</TableCell>
                    <TableCell>
                      {subject.created_at
                        ? new Date(subject.created_at).toLocaleDateString(
                            "id-ID"
                          )
                        : "-"}
                    </TableCell>
                    <TableCell className="flex gap-2 justify-end">
                      <Link
                        href={`/LMS/admin/MataPelajaran/edit/${subject.id}`}
                        className="p-2 rounded hover:bg-emerald-100 text-emerald-700 transition"
                        title="Edit User"
                      >
                        <FaUserEdit />
                      </Link>
                      <button
                        type="button"
                        className="p-2 rounded hover:bg-red-100 text-red-600 transition"
                        title="Hapus User"
                        onClick={() => handleDelete(subject)}
                      >
                        <FaTrashAlt />
                      </button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center">
                    Tidak ada data pengguna.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </section>
      </main>

      <ConfirmDeleteModal
        open={showDelete}
        onClose={() => setShowDelete(false)}
        // onConfirm={handleConfirmDelete}
        user={selectedSubject}
      />
    </div>
  );
}
