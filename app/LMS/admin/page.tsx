"use client";

import { getAllUser } from "@/lib/api/user";
import React, { useEffect, useState } from "react";
import UserTable from "@/app/components/LMS/admin/(Pengguna)/UserTable";
import ConfirmDeleteModal from "@/app/components/LMS/admin/ConfirmDeleteUserModal";
import Link from "next/link";
import { deleteUserAction } from "@/lib/actions/user";
import PenggunaCard from "@/app/components/LMS/admin/(Pengguna)/AddUserDialog";
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
              updatedData: {
                name?: string;
                tutorId?: number;
                description?: string;
              }
            ): void {
              throw new Error("Function not implemented.");
            }}
          />
          <UserTable users={users} handleDelete={handleDelete} />
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
