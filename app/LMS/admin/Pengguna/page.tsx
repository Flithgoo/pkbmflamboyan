"use client";

import { getAllUser } from "@/lib/api/user";
import React, { useEffect, useState } from "react";
import UserTable from "@/app/components/LMS/admin/(Pengguna)/UserTable";
import ConfirmDeleteModal from "@/app/components/LMS/admin/ConfirmDeleteUserModal";
import Link from "next/link";
import {
  deleteUserAction,
  addUserAction,
  editUserAction,
} from "@/lib/actions/user";
import AddUserDialog from "@/app/components/LMS/admin/(Pengguna)/AddUserDialog";
import { useClassLocationStore } from "@/src/store/useClassLocationStore";

export default function AdminDashboard() {
  const [users, setUsers] = useState<any[]>([]);
  const [showDelete, setShowDelete] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchAll = useClassLocationStore((s) => s.fetchAll);

  const fetchUsers = async () => {
    const { data: userData } = await getAllUser();
    setUsers(userData ?? []);
  };

  useEffect(() => {
    async function fetchData() {
      const { data: userData } = await getAllUser();
      setUsers(userData ?? []);
      await fetchAll();
    }
    fetchData();
  }, [fetchAll]);

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
      await fetchUsers();
    } else {
      alert("Gagal menghapus pengguna. Silakan coba lagi.");
      console.error("Error deleting user:", result?.error);
    }
  }

  const handleAddUserFormAction = async (formData: FormData) => {
    setIsLoading(true);
    try {
      await addUserAction(formData);
      // Refresh data setelah berhasil tambah
      await fetchUsers();
    } catch (error) {
      console.error("Error adding user:", error);
      alert("Gagal menambah pengguna. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditUserFormAction = async (formData: FormData) => {
    setIsLoading(true);

    try {
      await editUserAction(formData);
      // Refresh data setelah berhasil edit
      await fetchUsers();
    } catch (error) {
      console.error("Error editing user:", error);
      alert("Gagal mengedit pengguna. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

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
        <section
          id="daftar-pengguna"
          className="bg-white rounded-2xl shadow p-6 mt-6 overflow-x-auto"
        >
          <AddUserDialog
            formAction={handleAddUserFormAction}
            isLoading={isLoading}
          />
          <UserTable
            users={users}
            selectedUser={selectedUser}
            handleEdit={handleEditUserFormAction}
            handleDelete={handleDelete}
          />
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
