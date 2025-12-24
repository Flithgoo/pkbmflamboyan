"use client";

import Image from "next/image";
import { getAllUser } from "@/lib/api/user";
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
import ConfirmDeleteModal from "@/app/components/LMS/admin/ConfirmDeleteUserModal";
import { FaUserEdit, FaTrashAlt, FaPlus } from "react-icons/fa";
import Link from "next/link";
import { deleteUserAction } from "@/lib/actions/user";
import PenggunaCard from "@/app/components/LMS/admin/(Pengguna)/PenggunaCard";
import { getAllClasses } from "@/lib/api/classes";
import { getAllLocation } from "@/lib/api/location";

export default function AdminDashboard() {
  const [users, setUsers] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [locations, setLocations] = useState<any[]>([]);
  const [showDelete, setShowDelete] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any | null>(null);

  useEffect(() => {
    async function fetchData() {
      const { data: userData } = await getAllUser();
      const { data: classData } = await getAllClasses();
      const { data: locationData } = await getAllLocation();
      setUsers(userData ?? []);
      setClasses(classData ?? []);
      setLocations(locationData ?? []);
    }
    fetchData();
  }, []);

  function handleDelete(user: any) {
    setSelectedUser(user);
    setShowDelete(true);
  }

  async function handleConfirmDelete() {
    if (!selectedUser) return;

    const result = await deleteUserAction(selectedUser.id);

    if (result?.success) {
      setShowDelete(false); // Tutup modal
      // Refresh data
      const { data } = await getAllUser();
      setUsers(data ?? []);
    } else {
      alert("Gagal menghapus pengguna. Silakan coba lagi.");
      console.error("Error deleting user:", result?.error);
    }
  }

  return (
    <div className="min-h-screen flex-grow bg-gradient-to-br from-emerald-50 to-amber-50 p-4 pt-8 md:p-8">
      <PenggunaCard
        classes={classes}
        locations={locations}
        formAction={function (formData: FormData): Promise<void> {
          console.log("🚀 ~ AdminDashboard ~ formData:", formData);

          throw new Error("Function not implemented.");
        }}
        handleDelete={function (classId: number): void {
          throw new Error("Function not implemented.");
        }}
        handleEdit={function (
          classId: number,
          updatedData: { name?: string; tutorId?: number; description?: string }
        ): void {
          throw new Error("Function not implemented.");
        }}
      />

      <header className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-emerald-700">
            Admin Dashboard
          </h1>
          <p className="text-gray-600 mt-2">
            Selamat datang di halaman admin PKBM Flamboyan.
          </p>
        </div>
      </header>
      <main>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow p-6 flex flex-col items-start">
            <h2 className="text-xl font-semibold mb-2 text-emerald-700">
              Pengguna
            </h2>
            <p className="text-gray-600 mb-4">
              Kelola data siswa, guru, dan admin.
            </p>
            <Link
              href="#daftar-pengguna"
              className="mt-auto px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition font-semibold"
            >
              Lihat Pengguna
            </Link>
          </div>
          <div className="bg-white rounded-2xl shadow p-6 flex flex-col items-start">
            <h2 className="text-xl font-semibold mb-2 text-emerald-700">
              Kelas & Materi
            </h2>
            <p className="text-gray-600 mb-4">
              Atur kelas, materi, dan tugas pembelajaran.
            </p>
            <button className="mt-auto px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition font-semibold">
              Kelola Kelas
            </button>
          </div>
          <div className="bg-white rounded-2xl shadow p-6 flex flex-col items-start">
            <h2 className="text-xl font-semibold mb-2 text-emerald-700">
              Laporan
            </h2>
            <p className="text-gray-600 mb-4">
              Lihat statistik dan laporan aktivitas.
            </p>
            <button className="mt-auto px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 transition font-semibold">
              Lihat Laporan
            </button>
          </div>
        </div>

        <section
          id="daftar-pengguna"
          className="bg-white rounded-2xl shadow p-6 mt-6 overflow-x-auto"
        >
          <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-2">
            <h2 className="text-xl font-semibold text-emerald-700">
              Daftar Pengguna
            </h2>
            <Link
              href="/LMS/admin/TambahPengguna"
              className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-semibold shadow transition"
            >
              <FaPlus />
              Tambah Pengguna
            </Link>
          </div>
          <Table className="text-xs">
            <TableCaption>Data seluruh pengguna sistem</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>No</TableHead>
                <TableHead>Nama</TableHead>
                <TableHead>Username / NIPD</TableHead>
                <TableHead className="ps-6">Role</TableHead>
                <TableHead>Dibuat tgl</TableHead>
                <TableHead className="text-right pe-7">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users && users.length > 0 ? (
                users.map((user, idx) => (
                  <TableRow
                    key={user.id}
                    className="hover:bg-emerald-50 transition"
                  >
                    <TableCell>{idx + 1}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <div className="flex-shrink-0 w-10 h-10">
                          <Image
                            width={"40"}
                            height={"40"}
                            className="w-full h-full object-cover rounded-full"
                            src={
                              user.profile_picture ||
                              "/assets/placeholder_profile/placeholder_avatar.png"
                            }
                            alt=""
                          />
                        </div>
                        <p className="ml-3">{user.name}</p>
                      </div>
                    </TableCell>
                    <TableCell>{user.username}</TableCell>
                    <TableCell>
                      <div
                        className={`px-2 py-1 w-16 text-center rounded text-xs font-semibold ${
                          user.role === "admin"
                            ? "bg-gray-100 text-gray-700"
                            : user.role === "tutor"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-emerald-100 text-emerald-700"
                        }`}
                      >
                        {user.role}
                      </div>
                    </TableCell>
                    <TableCell>
                      {user.created_at
                        ? new Date(user.created_at).toLocaleDateString("id-ID")
                        : "-"}
                    </TableCell>
                    <TableCell className="flex text-base gap-2 justify-end">
                      <Link
                        href={`/LMS/admin/edit/${user.id}`}
                        className="p-2 rounded hover:bg-emerald-100 text-emerald-700 transition"
                        title="Edit User"
                      >
                        <FaUserEdit />
                      </Link>
                      <button
                        type="button"
                        className="p-2 rounded hover:bg-red-100 text-red-600 transition"
                        title="Hapus User"
                        onClick={() => handleDelete(user)}
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
        onConfirm={handleConfirmDelete}
        user={selectedUser}
      />
    </div>
  );
}
