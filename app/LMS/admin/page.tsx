import { getAllUser } from "@/lib/api/user";
import React from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableCaption,
} from "@/components/ui/table";
import { FaUserEdit } from "react-icons/fa";
import Link from "next/link";

export default async function AdminDashboard() {
  const { data, error } = await getAllUser();

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
        <p className="text-gray-600">
          Selamat datang di halaman admin PKBM Flamboyan.
        </p>
      </header>
      <main>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-2">Pengguna</h2>
            <p className="text-gray-600">Kelola data siswa, guru, dan admin.</p>
            <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
              Lihat Pengguna
            </button>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-2">Kelas & Materi</h2>
            <p className="text-gray-600">
              Atur kelas, materi, dan tugas pembelajaran.
            </p>
            <button className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
              Kelola Kelas
            </button>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-2">Laporan</h2>
            <p className="text-gray-600">
              Lihat statistik dan laporan aktivitas.
            </p>
            <button className="mt-4 px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700">
              Lihat Laporan
            </button>
          </div>
        </div>
        <section className="bg-white rounded-lg shadow p-6 mt-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Daftar Pengguna</h2>
            {/* Tombol tambah pengguna */}
            <Link
              href="/LMS/admin/TambahPengguna"
              className="px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700 font-semibold"
            >
              + Tambah Pengguna
            </Link>
          </div>
          <Table>
            <TableCaption>Data seluruh pengguna sistem</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>No</TableHead>
                <TableHead>Id</TableHead>
                <TableHead>Nama</TableHead>
                <TableHead>Username / NIPD</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Dibuat tgl</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data && data.length > 0 ? (
                data.map((user: any, idx: number) => (
                  <TableRow key={user.id}>
                    <TableCell>{idx + 1}</TableCell>
                    <TableCell>{user.id}</TableCell>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.username}</TableCell>
                    <TableCell>{user.role}</TableCell>
                    <TableCell>{user.created_at}</TableCell>
                    <TableCell>
                      <Link href={"/"}>
                        {/* ubah sesuaikan dengan route edit user */}
                        <FaUserEdit />
                      </Link>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center">
                    Tidak ada data pengguna.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </section>
      </main>
    </div>
  );
}
